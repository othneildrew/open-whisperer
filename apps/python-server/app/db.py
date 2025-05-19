import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.utils import get_project_root_path

root_dir = get_project_root_path()
dest_dir = root_dir / "database/sqlite"

# Create dir if it doesn't exist
dest_dir.mkdir(parents=True, exist_ok=True)
db_file = dest_dir / os.getenv("SQLITE_DATABASE", "app.db")

engine = create_engine(
  f"sqlite:///{db_file}", connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()