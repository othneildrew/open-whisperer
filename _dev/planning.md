


### Nice to haves (for v1, if not added in v1, add later)

- Styling subtitles
- Voice cloning each speaker and using translated audio instead
- Editing placement of subtitle text or placement and start/end times
- Batch video/audio support
- A good-looking UI lol :D
- Structured mono repo setup
- Selecting a range on the video player to decide where translations should start/end






## File storage strategy

```md
/<upload_path>
├── /<session_id>
│   ├── input.mp4     # source video file
│   ├── audio.wav     # extracted audio file, downsampled (16kHz mono PCM, de noised)
│   ├── output.mp4    # output video file with translated subtitles
│   ├── output.srt    # subtitles
│   ├── output.json   # full transcript with speaker data
│   ├── meta.json     # optional metadata (duration, size, speaker count, etc.)
```


Can possibly use SQLite or just a json file to store the sessions.
This app is expected to run locally only so handling a ton of concurrent connections and request isn't necessary right now.

Data can be something like this, maybe. idk 
```json
{
  "session_id": "<session_id>",
  "created_at": "2025-05-11T14:35:00Z",
  "expires_at": "2025-05-11T15:35:00Z",
  "input": "<upload_path>/<session_id>/input.mp4",
  "audio": "<upload_path>/<session_id>/audio.wav",
   "output": "<upload_path>/<session_id>/output.mp4",
  "output_srt": "<upload_path>/<session_id>/output.srt",
  "output_json": "<upload_path>/<session_id>/output.json",
  "status": "done"
}
```


## Tooling

| Task                          | Tool                                                                                                  | Notes                                                                                                   |
|-------------------------------|-------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| **Audio Extraction**          | `ffmpeg`                                                                                              | Industry standard                                                                                       |
| **Language Detection**        | [Whisper](https://github.com/openai/whisper)                                                          | Detects and transcribes; use [faster-whisper](https://github.com/guillaumekln/faster-whisper) for speed |
| **Multi-Speaker Diarization** | [pyannote-audio](https://github.com/pyannote/pyannote-audio)                                          | Best diarization tool (offline support with Hugging Face model download)                                |
| **Translation**               | [argos-translate](https://github.com/argosopentech/argos-translate)                                   | Offline translation, install language pairs                                                             |
| **Voice Synthesis (TTS)**     | [Tortoise TTS](https://github.com/neonbjb/tortoise-tts), [Coqui TTS](https://github.com/coqui-ai/TTS) | High quality, supports speaker cloning too                                                              |
| **Subtitle Handling**         | `ffmpeg`, `srt`, `autosub`, or custom logic                                                           | SRT file generation and muxing                                                                          |
| **Muxing**                    | `ffmpeg`                                                                                              | Add subtitles or TTS audio back to the video                                                            |




🚀 Bonus Features to Add
🎛️ Subtitle Editor UI — Add a waveform + subtitle timeline

🔈 Voice Cloning / Dubbing — Integrate Coqui TTS or Piper

🧑‍🤝‍🧑 Speaker Diarization — Add pyannote or WhisperX

🌍 Translation — Use MarianMT or Argos Translate (offline)


