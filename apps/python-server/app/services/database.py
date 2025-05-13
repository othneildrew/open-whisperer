import os
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "" / ""

db_name = os.getenv('SQLITE_DATABASE', 'openwhisperer.db')

with sqlite3.connect(db_name) as conn:
  c = conn.cursor()

  create_sessions_table_query = '''
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT NOT NULL,
    input TEXT NOT NULL,
    audio TEXT,
    output TEXT,
    output_srt TEXT,
    output_json TEXT,
    status TEXT,
  )
  '''

  create_index_query = '''
  CREATE INDEX IF NOT EXISTS sessions_id_index ON sessions (id);
  '''

  c.execute(create_sessions_table_query)
  c.execute(create_index_query)
  conn.commit()

  print("DB initialized. Tables created successfully.")
