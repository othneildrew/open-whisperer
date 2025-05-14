import subprocess
from fastapi import APIRouter, HTTPException
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR

from app.routes.sessions import get_session_if_exists, raise_session_not_found
from app.services.transcriber import WhisperRunner, persist_transcript
from app.services.translator import Translator
from app.utils import raise_file_not_found, get_session_storage_dir, session_json_load
from app.services.srt import json_to_srt

router = APIRouter(
  prefix="/transcript",
  tags=["transcript"],
  responses={404: {"description": "Not found"}}
)

@router.post("/{session_id}")
async def transcribe_file(session_id: str):
  session = get_session_if_exists(session_id)
  session_dir = get_session_storage_dir(session_id)

  if not session:
    raise_session_not_found()

  # Get the full input file path
  input_file = session_dir / "output.wav"

  # Should call /transcribe/<session_id>/extract before calling transcribe
  if not input_file.exists():
    raise_file_not_found("output.wav")

  # Get cached transcript file instead of re-running whisper
  # TODO: rm session file on new file uploads
  transcript_file = session_dir / "transcript.json"

  # if transcript_file.exists():
  #   return await session_json_load(session_id, transcript_file)

  # Create the whisper instance and run the transcriber
  whisperer = WhisperRunner()
  transcript = await whisperer.transcribe(input_file)

  # transcript = await session_json_load(session_id, transcript_file)

  # Create the translator instance
  translator = Translator(transcript)

  # Store a new transcript file
  await persist_transcript(session_id, transcript)

  # Store the source.srt file
  # print(json_to_srt(transcript))

  # Run the translator against the transcript
  transcript_with_translations = await translator.run(transcript["meta"]["language"], "en")

  # Store the new transcript file with translations
  # TODO: Yea, probably not the best way to do things, but my goal is to get this working in 3-4 days
  await persist_transcript(session_id, transcript_with_translations)

  # Return the transcript right away
  return transcript_with_translations


@router.post("/{session_id}/extract")
async def extract_audio_from_video(session_id: str):
  session = get_session_if_exists(session_id)

  if not session:
    raise_session_not_found()

  session_dir = get_session_storage_dir(session_id)
  input_file = session_dir / session.input
  output_file = session_dir / "output.wav"

  try:
    cmd = [
      "ffmpeg",
      "-y",               # run non interactively, overwrite the previous file
      "-i", input_file,   # input file
      "-ar", "16000",     # recommended 16kHz sampling rate for transcriptions & diarization
      "-ac", "1",         # mono channel
      "-f", "wav",        # format (wav)
      output_file
    ]

    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
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
