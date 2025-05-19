from fastapi import APIRouter, Query

from app.routes.sessions import get_session_if_exists
from app.services.transcriber import WhisperRunner, persist_transcript
from app.services.translator import Translator
from app.utils import raise_not_found_exception, get_session_storage_dir, session_json_load, extract_audio_from_video

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


@router.post("/{session_id}", operation_id="transcribeFile")
async def transcribe_file(
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


  print(f"source_lang::: {source_lang}")
  print(f"target_lang::: {target_lang}")
  print(f"stored_from::: {stored_from}")
  print(f"stored_to::: {stored_to}")

  # Create the translator instance
  translator = Translator(transcript=transcript, source_lang=source_lang, target_lang=target_lang)

  # Run the translator against the transcript
  transcript_with_translations = await translator.run()

  # Store the new transcript file with translations
  # TODO: Yea, probably not the best way to do things, but my goal is to get this working in 3-4 days
  await persist_transcript(session_id, transcript_with_translations)

  # Return the transcript right away
  return transcript_with_translations
