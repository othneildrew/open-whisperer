from sqlalchemy import Column, String, Numeric
from app.db import Base

class Session(Base):
  __tablename__ = "sessions"

  id = Column(String, autoincrement=False, primary_key=True, index=True, nullable=False)
  input = Column(String)
  audio = Column(String)
  output = Column(String)
  # output_srt = Column(String)
  # output_json = Column(String)
  uploader_ip_addr = Column(String)
  input_file_name = Column(String)
  input_file_size = Column(Numeric)
  # status = Column(Enum("translating", "done"))
  thumbnail = Column(String)
  created_at = Column(String)
  updated_at = Column(String)