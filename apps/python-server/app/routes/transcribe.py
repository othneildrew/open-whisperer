import ffmpeg
from fastapi import APIRouter, HTTPException
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR

from app.routes.sessions import get_session_if_exists, raise_session_not_found, get_session_storage_dir
from app.services.transcriber import WhisperRunner
from app.utils import raise_file_not_found

router = APIRouter(
  prefix="/transcribe",
  tags=["transcribe"],
  responses={404: {"description": "Not found"}}
)

@router.post("/{session_id}")
async def transcribe_file(session_id: str):
  session = get_session_if_exists(session_id)

  if not session:
    raise_session_not_found()

  # Get the full input file path
  input_file = get_session_storage_dir(session_id) / "output.wav"

  # Should call /transcribe/<session_id>/extract before calling transcribe
  if not input_file.exists():
    raise_file_not_found("output.wav")

  # Create the whisper instance and run the transcriber
  whisperer = WhisperRunner()
  return await whisperer.transcribe(input_file)

@router.post("/{session_id}/extract")
async def extract_audio_from_video(session_id: str):
  session = get_session_if_exists(session_id)

  if not session:
    raise_session_not_found()

  session_dir = get_session_storage_dir(session_id)
  input_file = session_dir / session.input
  output_file = session_dir / "output.wav"

  try:
    # ffmpeg -i input.mp4 -ar 16000 -ac 1 -f wav audio.wav
    ffmpeg.input(input_file).output(
      str(output_file),
      ar=16000,     # recommended 16kHz sampling rate for transcriptions & diarization
      ac=1,         # mono channel
      f='wav'       # format
    ).run(overwrite_output=True)
  except (OSError, IOError) as exc:
    raise HTTPException(
      status_code=HTTP_500_INTERNAL_SERVER_ERROR,
      detail=f"Failed to extract and save audio file {str(exc)}"
    )

  return {"session_id": session_id, "output": "output.wav"}


@router.get("/languages")
async def get_supported_languages():
  whisperer = WhisperRunner()
  return await whisperer.langs()

