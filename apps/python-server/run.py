import os
import uvicorn
from dotenv import load_dotenv

# Initialize (and read) the .env file
load_dotenv()

# development: bool = os.getenv("ENV") == "development"

if __name__ == "__main__":
  # Run the python server app locally, watch for changes and reload if dev env
  uvicorn.run(
    "app.main:app",
    host="0.0.0.0",
    port=8000,
    reload=True,
    log_level="debug",
    timeout_keep_alive=3600,
    ws_max_size=5368709120,
  )
