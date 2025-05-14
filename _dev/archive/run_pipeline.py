import sys
import os
from diarize import diarize
from whisper_runner import transcribe
from merge import merge_speaker_transcript, export_srt, export_json

def main(audio_path):
  print("[1] Running diarization...")
  speakers = diarize(audio_path)

  print("[2] Running transcription...")
  segments = transcribe(audio_path)

  print("[3] Merging and exporting...")
  merged = merge_speaker_transcript(speakers, segments)

  base = os.path.splitext(audio_path)[0]
  export_srt(merged, base + ".srt")
  export_json(merged, base + ".json")

  for m in merged:
    print(f"{m['speaker']} [{m['start']:.2f}s - {m['end']:.2f}s]: {m['text']}")

if __name__ == "__main__":
  if len(sys.argv) < 2:
    print("Usage: python run_pipeline.py path/to/audio.wav")
    sys.exit(1)
  main(sys.argv[1])
