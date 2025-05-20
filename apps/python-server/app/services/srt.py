from enum import Enum

import srt
from datetime import timedelta

class TextVersion(Enum):
  TEXT = "text"
  TRANSLATED = "translated_text"


async def srt_to_json(subs):
  return [
    {
      "number": i,
      "start": sub.start,
      "end": sub.end,
      "text": sub.content
    }
    for i, sub in enumerate(subs, start=1)
  ]

async def json_to_srt(segments, text_version: TextVersion = TextVersion.TRANSLATED):
  return [
    srt.Subtitle(
      index=i,
      start=timedelta(seconds=item["start"]),
      end=timedelta(seconds=item["end"]),
      content=item["translated_text"]
    )
    for i, item in enumerate(segments, start=1)
  ]
