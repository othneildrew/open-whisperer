import os
import uvicorn
from dotenv import load_dotenv

# Initialize (and read) the .env file
load_dotenv()

ENV = os.getenv("ENV", "production")

if __name__ == "__main__":
  uvicorn.run(
    "app.main:app",
    host="0.0.0.0",
    port=8000,
    reload=ENV == "development",
    log_level="debug" if ENV == "development" else "info",
    timeout_keep_alive=3600,
    ws_max_size=5368709120,
  )