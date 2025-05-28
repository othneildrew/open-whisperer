from app.db import get_db
from app.models.session import Session
from sqlalchemy import delete

from app.utils import delete_all_folders_in_directory, get_storage_path


def purge_sessions():
  db = next(get_db())
  try:
    db.execute(delete(Session))
    db.commit()
    print("DB sessions purged.")

    # Attempt to delete all storage files
    delete_all_folders_in_directory(get_storage_path())

  finally:
    db.close()


if __name__ == "__main__":
  purge_sessions()
