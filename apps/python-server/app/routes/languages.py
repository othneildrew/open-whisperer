import argostranslate.package
from fastapi import APIRouter

from app.models.language import LanguageResponse
from app.services.transcriber import WhisperRunner

router = APIRouter(
  prefix="/languages",
  tags=["Language"],
  responses={404: {"description": "Not found"}}
)

@router.get(
  "/transcript",
  operation_id="listTranscriptSupportedLanguages",
  response_model=LanguageResponse
)
async def list_transcript_supported_languages():
  whisperer = WhisperRunner()
  return await whisperer.langs()

@router.get(
  "/translate",
  operation_id="listTranslateSupportedLanguages",
  response_model=LanguageResponse
)
async def list_translate_supported_languages():
  # Update and get all available packages
  argostranslate.package.update_package_index()
  available_packages = argostranslate.package.get_available_packages()

  # Use dict to store unique languages
  languages = {}

  # Handle both to/from languages
  for package in available_packages:
    if package.from_code not in languages:
      languages[package.from_code] = package.from_name
    if package.to_code not in languages:
      languages[package.to_code] = package.to_name

  # Convert to list of dicts with "code" and "name" and return json formated output
  language_list = [
    {
      "code": code,
      "name": name,
    }
    for code, name in sorted(languages.items())
  ]

  # List should be on part with: https://www.argosopentech.com/argospm/index/
  return {"data": language_list}
