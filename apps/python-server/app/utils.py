import os
import subprocess
import uuid
import requests
import json
from pathlib import Path
from dotenv import load_dotenv
from fastapi import HTTPException
from starlette.status import HTTP_404_NOT_FOUND
from typing import Union

# Don't import any source files here to avoid circular deps

# Only localhost can use this service, not intended as external api
ALLOWED_HOSTS = ["http://localhost:3000", "localhost:3000", "localhost", "127.0.0.1", "::1"]

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

def get_project_root_path():
  return Path(__file__).resolve().parent.parent

def get_storage_path():
  parent_dir = get_project_root_path()
  env_path = os.getenv('UPLOAD_PATH', 'storage')
  # Force path to be relative to project's root
  relative_path = env_path.lstrip('/\\')
  return parent_dir / relative_path

def get_session_storage_dir(session_id: str):
  return get_storage_path() / session_id

def delete_existing_input_files(dest_dir: Path):
  for existing_file in dest_dir.glob("input.*"):
    existing_file.unlink()

def raise_file_not_found(file):
  raise HTTPException(
    status_code=HTTP_404_NOT_FOUND,
    detail=f"{file} not found. Endpoints should be called according to docs to ensure dependencies exists to properly output files"
  )

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


async def generate_thumbnail(video_path: Union[str, Path], thumbnail_path: str, width=320, height=240, time="00:00:01"):
  os.makedirs(os.path.dirname(thumbnail_path), exist_ok=True)
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