from pydantic import BaseModel
from typing import List

class Language(BaseModel):
  code: str
  name: str

class LanguageResponse(BaseModel):
  data: List[Language]