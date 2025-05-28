import shutil
from fastapi import APIRouter
from fastapi.params import Depends
from typing import Optional
from sqlalchemy import delete

from app.db import get_db
from app.models.session import Session
from app.utils import get_storage_path, raise_not_found_exception, delete_all_folders_in_directory

router = APIRouter(
  prefix="/sessions",
  tags=["Session"],
  dependencies=[Depends(get_db)],
  responses={404: {"description": "Not found"}}
)

def get_session_if_exists(session_id: str, db: Session) -> Optional[Session]:
  return db.query(Session).filter(Session.id == session_id).first()

# No create session, sessions can only be created by uploading a file
# Also, no updating, can only be updated by uploading new file

@router.get("", operation_id="listSessions")
async def list_sessions(db: Session = Depends(get_db)):
  sessions = db.query(Session).all()
  return {"data": sessions}

@router.get("/{session_id}", operation_id="getSession")
async def get_session(session_id: str, db: Session = Depends(get_db)):
  session = get_session_if_exists(session_id, db)

  if not session:
    raise_not_found_exception("Session")

  return {
    "id": session.id,
    "input": session.input,
    "audio": session.audio,
    "output": session.output,
    # "output_srt": session.output,
    # "output_json": session.output,
    "uploader_ip_addr": session.uploader_ip_addr,
    "input_file_name": session.input_file_name,
    "input_file_size": session.input_file_size,
    "thumbnail": session.thumbnail,
    "created_at": session.created_at,
    "expires_at": session.updated_at,
  }

@router.delete("/{session_id}", operation_id="deleteSession")
async def delete_session(session_id: str, db: Session = Depends(get_db)):
  session = get_session_if_exists(session_id, db)

  # Allow to silently fail if no session, better for UI error handling I think
  if not session:
    return None

  # Delete the folder if it exists
  session_dir = get_storage_path() / session_id

  if session_dir.is_dir():
    shutil.rmtree(session_dir)

  # Delete the db record
  db.delete(session)
  db.commit()

  # Return null w/ 200 status
  return None

@router.delete("/purge", operation_id="purgeSessions")
async def purge_sessions(db: Session = Depends(get_db)):
  storage_path = get_storage_path()

  try:
    await db.execute(delete(Session))
    await db.commit()

    delete_all_folders_in_directory(storage_path)
  except exec:
    print(f"Error purging all db sessions {str(exec)}")

