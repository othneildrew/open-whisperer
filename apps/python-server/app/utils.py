import os
import shutil
import subprocess
import uuid
import requests
import json
import ffmpeg
from pathlib import Path
from dotenv import load_dotenv
from fastapi import HTTPException
from starlette.status import HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR
from typing import Union


# Don't import any source files here to avoid circular deps
def is_dev():
  load_dotenv()
  return os.getenv("ENV") == 'development'


def generate_session_id():
  return uuid.uuid4().hex


def get_client_ip():
  services = [
    "https://api.ipify.org",
    "https://ifconfig.me/ip",
    "https://ident.me",
    "https://checkip.amazonaws.com"
  ]

  for url in services:
    try:
      response = requests.get(url, timeout=3)
      if response.ok:
        return response.text.strip()
    except requests.RequestException:
      continue
  return '<unknown_ip>'


def raise_not_found_exception(resource: str):
  raise HTTPException(
    status_code=HTTP_404_NOT_FOUND,
    detail=f"{resource} not found"
  )


def get_project_root_path():
  return Path(__file__).resolve().parent.parent


def get_storage_path():
  parent_dir = get_project_root_path() / 'data'
  env_path = os.getenv('UPLOAD_PATH', 'storage')
  # Force path to be relative to project's root
  relative_path = env_path.lstrip('/\\')
  return parent_dir / relative_path


def get_session_storage_dir(session_id: str):
  return get_storage_path() / session_id


def delete_existing_input_files(dest_dir: Path):
  for existing_file in dest_dir.glob("input.*"):
    existing_file.unlink()


async def session_json_save(session_id: str, file_name: str, json_data):
  session_dir = get_session_storage_dir(session_id)
  temp_file = session_dir / f"{file_name}.tmp"
  dest_file = session_dir / file_name
  ident = 2 if is_dev else None

  print(f"temp_file: {temp_file}")
  print(f"dest_file: {dest_file}")

  with open(temp_file, "w", encoding="utf-8") as f:
    json.dump(json_data, f, ensure_ascii=False, indent=ident)

  os.replace(temp_file, dest_file)


async def session_json_load(session_id: str, file_name):
  session_dir = get_session_storage_dir(session_id)
  target_file = session_dir / file_name

  with open(target_file, "r", encoding="utf-8") as f:
    return json.load(f)


async def generate_thumbnail(video_path: Union[str, Path], thumbnail_path: str, width=320, height=240, time="00:00:04"):
  os.makedirs(os.path.dirname(thumbnail_path), exist_ok=True)
  # Desired scale to fit aspect ratio not working rn
  # filter_str = (
  #   "scale=if(gt(a,16/9),320,-1):if(gt(a,16/9),-1,180),crop=320:180"
  # )
  filter_str = "scale=w=320:h=180:force_original_aspect_ratio=increase,crop=320:180"
  result = subprocess.run([
    "ffmpeg",
    "-y",
    "-ss", time,
    "-i", str(video_path),
    "-vframes", "1",
    "-vf", filter_str,
    "-q:v", "2",
    thumbnail_path
  ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

  if result.returncode != 0:
    print("ffmpeg error output:\n", result.stderr)
    raise RuntimeError(f"ffmpeg failed with {result.returncode}")


async def extract_audio_from_video(input_file: Path, output_file: Path):
  """
  Generates a .wav file with industry recommended settings to optimize the transcription and diarization processes.
  :param input_file:
  :param output_file:
  :return:
  """
  try:
    cmd = [
      "ffmpeg",
      "-y",  # run non interactively, overwrite the previous file
      "-i", str(input_file),  # input file
      "-ar", "16000",  # recommended 16kHz sampling rate for transcriptions & diarization
      "-ac", "1",  # mono channel
      "-f", "wav",  # format (wav)
      str(output_file)
    ]

    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
  except (OSError, IOError) as exc:
    print(f"Failed to extract and save audio file {str(exc)}")


async def add_subtitle_to_video(input_path: Path, output_path: Path, subtitle_path: Path):
  input_file = input_path.as_posix()
  output = output_path.as_posix()
  subtitle = subtitle_path.as_posix()

  escaped_subtitle = subtitle.replace('\\', '\\\\').replace(':', '\\:')

  # Set up the video input
  in_video_stream = ffmpeg.input(input_file)

  # Add subtitles to video stream
  stream = ffmpeg.output(
    in_video_stream,
    output,
    vf=f"subtitles='{escaped_subtitle}'"
  )

  ffmpeg.run(stream, overwrite_output=True)


def delete_all_folders_in_directory(dir_path: Path):
  try:
    for entry in dir_path.iterdir():
      if entry.is_dir():
        shutil.rmtree(entry)
  finally:
    print("Purged all session folders")
