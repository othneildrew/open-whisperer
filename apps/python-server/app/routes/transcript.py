import srt
from fastapi import APIRouter, Query

from app.routes.sessions import get_session_if_exists
from app.services.transcriber import WhisperRunner, persist_transcript
from app.services.translator import Translator
from app.services.srt import json_to_srt
from app.utils import raise_not_found_exception, get_session_storage_dir, session_json_load, extract_audio_from_video, \
  add_subtitle_to_video

router = APIRouter(
  prefix="/transcripts",
  tags=["Transcript"],
  responses={404: {"description": "Not found"}}
)

@router.get("/{session_id}", operation_id="getTranscript")
async def get_transcript_file(session_id: str):
  session = get_session_if_exists(session_id)

  if not session:
    raise_not_found_exception("Session")

  session_dir = get_session_storage_dir(session_id)
  transcript_file = session_dir / "transcript.json"

  if not transcript_file.exists():
    raise_not_found_exception("Transcript")

  return await session_json_load(session_id, transcript_file)


@router.post("/{session_id}", operation_id="generateTranscript")
async def generate_transcript_file(
    session_id: str,
    from_lang: str = Query(default=None),
    to_lang: str = Query(default=None),
):
  # Normalize the variables if none set
  from_lang = (from_lang or "").strip()
  to_lang = (to_lang or "en").strip()

  session = get_session_if_exists(session_id)
  session_dir = get_session_storage_dir(session_id)

  if not session:
    raise_not_found_exception("Session")

  # Get the full input file path
  input_audio_path = session_dir / "input.wav"

  # Background task on upload hasn't finished or wasn't successful so try again
  if not input_audio_path.exists():
    await extract_audio_from_video(session.input, input_audio_path)

  # Get cached transcript file instead of re-running whisper
  # TODO: rm session file on new file uploads
  transcript_file = session_dir / "transcript.json"
  transcript = None

  # If the desired translations are the same, just return previous transcript
  if transcript_file.exists():
    print(f"Transcript file exists")
    stored = await session_json_load(session_id, transcript_file)
    transcript = stored

  # Create the whisper instance and run the translator
  if not transcript:
    whisperer = WhisperRunner()
    transcript = await whisperer.transcribe(input_audio_path)
    # Store updated transcript file after running whisper
    await persist_transcript(session_id, transcript)

  # Fallbacks (use transcript-detected language if from_lang is missing)
  meta = transcript["meta"]
  stored_from = (meta.get("language_from") or "").strip()
  stored_to = (meta.get("language_to") or "").strip()

  source_lang = from_lang if from_lang else transcript["meta"].get("language", "es")
  target_lang = to_lang if to_lang else "en"

  # Assume translations ran already for this language and this is the current
  if source_lang == stored_from and target_lang == stored_to:
    return transcript
  elif source_lang == target_lang:
    transcript["meta"]["language_from"] = source_lang
    transcript["meta"]["language_to"] = source_lang
    return transcript

  print(f"stored_from::: {stored_from}")
  print(f"source_lang::: {source_lang}")
  print(f"stored_to::: {stored_to}")
  print(f"target_lang::: {target_lang}")

  # Create the translator instance
  translator = Translator(transcript=transcript, source_lang=source_lang, target_lang=target_lang)

  # Run the translator against the transcript
  transcript_with_translations = await translator.run()

  # Store the new transcript file with translations
  # TODO: Yea, probably not the best way to do things, but my goal is to get this working in 3-4 days
  await persist_transcript(session_id, transcript_with_translations)

  # Generate and save the .srt transcript file to use for video captions
  srt_blocks = await json_to_srt(transcript_with_translations["data"])
  srt_content = srt.compose(srt_blocks)
  srt_dest = session_dir / f"{target_lang}.srt"

  with open(srt_dest, "w", encoding="UTF-8") as f:
    f.write(srt_content)
    f.close()

  print(srt_content)

  # Output a new video with the translated subtitles
  video_input = session_dir / session.input
  video_output = session_dir / "output.mp4"

  print(f"Generating captioned video for {target_lang}")

  if srt_dest.exists():
    await add_subtitle_to_video(
      input_path=video_input,
      output_path=video_output,
      subtitle_path=srt_dest,
    )

    # print(f"Generated captioned video stored at: {video_output}")

  # Return the transcript right away
  return transcript_with_translations

@router.patch("/{session_id}", operation_id="updateTranscript")
async def update_transcript_file():
  # TODO: fill in update transcript file stub
  return ""

@router.post("/{session_id}/apply", operation_id="applySubtitles")
async def apply_transcript_subtitles_to_video(
    session_id: str,
    lang: str = Query(default=None),
):
  session = get_session_if_exists(session_id)
  session_dir = get_session_storage_dir(session_id)
  srt_path = session_dir / f"{lang}.srt"

  if not session:
    raise_not_found_exception("Session")
  elif not srt_path.exists():
    raise_not_found_exception(f"{lang}.srt")

  input_file = session_dir / session.input
  output_file = session_dir / "output.mp4"
  srt_file = session_dir / f"{lang}.srt"

  try:
    await add_subtitle_to_video(
      input_path=input_file,
      output_path=output_file,
      subtitle_path=srt_file,
    )
  except (OSError, IOError) as exc:
    print(f"Failed to add {lang}.srt subtitles to video stream")
    raise

  # TODO: fill in apply transcript subtitles to video stub
  return {
    "session_id": session_id,
    "lang": lang,
    "output": "output.mp4"
  }