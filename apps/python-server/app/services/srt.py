import srt
import json
from datetime import timedelta

# class SrtFormatter:
#   # def __init__(self):
#   async def to_json(self):
#

def srt_to_json(subs):
  return [
    {
      "number": i,
      "start": sub.start,
      "end": sub.end,
      "text": sub.content
    }
    for i, sub in enumerate(subs, start=1)
  ]

def json_to_srt(segments):
  return [
    srt.Subtitle(
      index=i,
      start=timedelta(seconds=item["start"]),
      end=timedelta(seconds=item["end"]),
      content=item["text"]
    )
    for i, item in enumerate(segments, start=1)
  ]

def json_flatten_text_content(json_data, delimiter = "\n"):
  return False