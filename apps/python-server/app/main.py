import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.db import Base, engine
from app.utils import get_storage_path, get_project_root_path, is_dev
from .routes import sessions, uploads, transcripts, languages

DEVELOPMENT: bool = os.getenv("ENV") == 'development'
RESTRICT_HOSTS = os.getenv("RESTRICT_HOSTS", "true").lower() == "true"

# Initialize (and read) the .env file here incase run.py wasn't used
load_dotenv()

@asynccontextmanager
async def lifespan(api: FastAPI):
  # Run on startup
  Base.metadata.create_all(bind=engine)
  print("Initialized database")

  # Debug print all routes on app start
  print("Registered routes:")
  for route in api.routes:
    print(f"{route.path} -> ({route.name})")

  yield
    # Run any clean up on shutdown

# Create and initialize the application
app = FastAPI(
  debug=True,
  lifespan=lifespan,
  openapi_tags=[
    {
      "name": "sessions",
      "descriptions": "Each file upload and transcribe/translate operation."
    }
  ]
)

# Apply middleware
app.add_middleware(
  CORSMiddleware,
  allow_credentials=True,
  allow_origins=["*"],
  allow_methods=["*"],
  allow_headers=["*"],
)


# Exception handler
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
  import traceback
  print(traceback.format_exc())
  return JSONResponse(
    status_code=500,
    content={"message": str(exc)}
  )

# Register api routes
app.include_router(sessions.router)
app.include_router(uploads.router)
app.include_router(transcripts.router)
app.include_router(languages.router)

# Serve the static folder with all the files
storage_path = get_storage_path()
storage_path.mkdir(parents=True, exist_ok=True)
app.mount("/media", StaticFiles(directory=storage_path), name="media")

@app.get("/", operation_id="sayHello")
async def hello():
  return {"message": "Hello World"}


@app.get("/debug/media", operation_id="getDebugMediaDir")
async def get_debug_media_dir():
  return {
    "is_dev": is_dev(),
    "project_root": get_project_root_path(),
    "storage_path": get_storage_path(),
  }