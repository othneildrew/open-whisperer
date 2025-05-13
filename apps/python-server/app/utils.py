import os
import uuid
import requests
from pathlib import Path
from dotenv import load_dotenv
from fastapi import HTTPException
from starlette.status import HTTP_404_NOT_FOUND

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "::1"]

def is_dev():
  load_dotenv()
  return os.getenv("ENV") == 'development'

def generate_session_id():
  return uuid.uuid4().hex

def get_public_ip():
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

def delete_existing_input_files(dest_dir: Path):
  for existing_file in dest_dir.glob("input.*"):
    existing_file.unlink()

def raise_file_not_found(file):
  raise HTTPException(
    status_code=HTTP_404_NOT_FOUND,
    detail=f"{file} not found. Endpoints should be called according to docs to ensure dependencies exists to properly output files"
  )