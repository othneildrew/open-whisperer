import shutil
from datetime import datetime
from typing import Optional
from pathlib import Path
from fastapi import APIRouter, UploadFile, HTTPException, Form, Depends
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR

from app.utils import generate_session_id, get_storage_path, delete_existing_input_files, get_public_ip
from app.models.session import Session
from app.db import get_db

router = APIRouter(
  prefix="/uploads",
  tags=["uploads"],
  dependencies=[Depends(get_db)],
  responses={404: {"description": "Not found"}}
)

ALLOWED_EXTENSIONS = {".mp4", ".mpeg", ".mov", ".avi", ".mkv", ".webm", ".mp3", ".wav", ".ogg", ".m4a"}

ALLOWED_MEDIA_TYPES = {
  "video/mp4",        # .mp4
  "video/mpeg",       # .mpeg
  "video/quicktime",  # .mov
  "video/x-msvideo",  # .avi
  "video/x-matroska", # .mkv
  "video/webm",        # .webm
  "audio/mpeg",       # .mp3
  "audio/wav",        # .wav
  "audio/ogg",        # .ogg
  "audio/mp4",        # .mp4
  "audio/x-m4a",      # .m4a
}


@router.post("")
async def upload_file(
    file: UploadFile,
    user_session_id: Optional[str] = Form(None, alias="session_id"),
    db = Depends(get_db)
):
  # Get storage path and automatically create the storage path if it doesn't exist
  dest_dir = get_storage_path()
  dest_dir.mkdir(parents=True, exist_ok=True)

  # Reject files that aren't supported
  if file.content_type not in ALLOWED_MEDIA_TYPES:
    raise HTTPException(
      status_code=HTTP_400_BAD_REQUEST,
      detail=f"Unsupported media type: {file.content_type}. Supported: {ALLOWED_MEDIA_TYPES}"
    )

  # Reject if not in allowed file extensions list
  f_path = Path(file.filename)
  # og_filename = f_path.stem
  og_file_ext = f_path.suffix.lower()

  if og_file_ext not in ALLOWED_EXTENSIONS:
    raise HTTPException(
      status_code=HTTP_400_BAD_REQUEST,
      detail=f"Invalid file extensions: {og_file_ext}. Supported: {ALLOWED_EXTENSIONS}"
    )

  # Generate a session for the file and create folder, every new upload is considered a session
  session_id = user_session_id or generate_session_id()
  session_folder = dest_dir / session_id
  session_folder.mkdir(parents=True, exist_ok=True)

  # Clean up any old input files before saving new one
  # TODO: may just need to delete everything, if existing translations and diff vid can cause issues
  delete_existing_input_files(session_folder)

  # Rename the file to "input.<ext>"
  new_filename = "input" + Path(file.filename).suffix
  dest = session_folder / new_filename

  # Get uploader's ip
  ip = get_public_ip()

  # Save the file
  try:
    with dest.open("wb") as buffer:
      shutil.copyfileobj(file.file, buffer)

    # Save a session in db
    new_session =  Session(
      id=session_id,
      input=new_filename,
      created_at=(datetime.now()).isoformat(),
      uploader_ip_addr=ip
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

  except (OSError, IOError) as exc:
    raise HTTPException(
      status_code=HTTP_500_INTERNAL_SERVER_ERROR,
      detail=f"Failed to save file {str(exc)}"
    )

  return {
    "session_id": session_id,
    "upload_path": dest,
    "dest_file": new_filename,
    "uploader_ip_addr": ip,
    "file": {
      "file_name": file.filename,
      "file_size": dest.stat().st_size,
    }
  }