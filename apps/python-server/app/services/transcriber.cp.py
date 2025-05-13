import json
import os
import sys
import pycountry
from faster_whisper import WhisperModel

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TMP_DIR = os.path.join(SCRIPT_DIR, '..', 'tmp')

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


class WhisperRunner:
  def __init__(self, model_size="base", device="cpu", compute_type="int8"):
    # Load model with INT8 precision for fast CPU performance
    self.model = WhisperModel(model_size, device=device, compute_type=compute_type)

  def transcribe(self, file):
    file_path = os.path.abspath(os.path.join(TMP_DIR, file))

    # Transcribe an audio file
    segments, info = self.model.transcribe(file_path, beam_size=5)

    # Format the language prediction data
    data = [
      {
        "start": segment.start,
        "end": segment.end,
        "text": segment.text.strip(),
        # "words": segment.words,
        # "seek": segment.seek,
      }
      for segment in segments
    ]
    meta = {
      "language": info.language,
      "probability": info.language_probability,
      "duration": info.duration,
      "probabilities": info.all_language_probs,
    }
    output = {
      "meta": meta,
      "data": data,
    }
    return json.dumps(output, indent=2)

  def langs(self):
    languages = self.model.supported_languages
    data = [
      {
        "code": lang_code,
        "name": get_iso_639_1_lang_name(lang_code)
      }
      for lang_code in languages
    ]
    output = {
      "data": data
    }
    return json.dumps(output, indent=2)


# Handle the main process
if __name__ == "__main__":
  arg_action = sys.argv[1]
  arg_file = sys.argv[2] if len(sys.argv) > 2 else None

  whisperer = WhisperRunner()

  if arg_action == "langs":
    print(whisperer.langs())

  elif arg_action == "transcribe":
    print(whisperer.transcribe(arg_file))

  else:
    print("Unknown action")
