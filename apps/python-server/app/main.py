import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from dotenv import load_dotenv

from app.db import SessionLocal, Base, engine
from app.utils import ALLOWED_HOSTS
from .routes import sessions, uploads, transcribe

development: bool = os.getenv("ENV") == 'development'

# Initialize (and read) the .env file here incase run.py wasn't used
load_dotenv()

@asynccontextmanager
async def lifespan(api: FastAPI):
  # Run on startup
  Base.metadata.create_all(bind=engine)
  print("Initialized database")

  # Debug print all routes on app start
  print("Registered routes:")
  for route in app.routes:
    print(f"{route.path} -> ({route.name})")

  yield
    # Run any clean up on shutdown

# Create and initialize the application
app = FastAPI(debug=True, lifespan=lifespan)

# Apply middleware
# Check host header sent in http request
app.add_middleware(
  TrustedHostMiddleware, allowed_hosts=ALLOWED_HOSTS
)

# Actually restrict apis outside of localhost (yes, don't try to use my shit, host it yourself!)
@app.middleware("http")
async def restrict_to_localhost(request: Request, call_next):
  client_host = request.client.host
  if client_host not in ALLOWED_HOSTS:
    return JSONResponse(
      status_code=403,
      content={"detail": "Access forbidden: only localhost is allowed"}
    )
  return await call_next(request)

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
app.include_router(transcribe.router)

@app.get("/")
async def hello():
  return {"message": "Hello World"}
