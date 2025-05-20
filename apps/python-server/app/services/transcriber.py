import pycountry
from faster_whisper import WhisperModel

from app.utils import session_json_save


# Manually add missing or non-standard codes that might be returned, not part of ISO_639-1 spec
custom_lang_map = {
  "yue": "Cantonese",
  "jw": "Javanese",      # pycountry uses 'jv'
  "zh": "Chinese",
  "ceb": "Cebuano",      # sometimes seen in other models
}

# Returns the name of a country given its ISO_639-1 code
def get_iso_639_1_lang_name(code):
  # Try alpha 2 lookup
  lang = pycountry.languages.get(alpha_2=code)
  if lang:
    return lang.name
  # Try alpha 3 look up
  lang = pycountry.languages.get(alpha_3=code)
  if lang:
    return lang.name
  return custom_lang_map.get(code, code)


async def persist_transcript(session_id: str, json_data):
  await session_json_save(session_id, "transcript.json", json_data)
  return True


class WhisperRunner:
  def __init__(self, model_size="base", device="cpu", compute_type="int8"):
    # Load model with INT8 precision for fast CPU performance
    self.model = WhisperModel(model_size, device=device, compute_type=compute_type)

  async def transcribe(self, audio_path):
    # Transcribe an audio file
    segments, info = self.model.transcribe(audio_path, beam_size=5)

    # Format the language prediction data
    data = [
      {
        "number": i,
        "start": segment.start,
        "end": segment.end,
        "text": segment.text.strip(),
        "translated_text": None
      }
      for i, segment in enumerate(segments, start=1)
    ]

    meta = {
      "language": info.language,
      "probability": info.language_probability,
      "duration": info.duration,
      "probabilities": info.all_language_probs[:5], # top 5 highest probabilities
    }

    return {"meta": meta, "data": data}

  async def langs(self):
    languages = self.model.supported_languages

    data = [
      {
        "code": lang_code,
        "name": get_iso_639_1_lang_name(lang_code)
      }
      for lang_code in languages
    ]

    return {"data": data}

