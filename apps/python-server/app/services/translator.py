import argostranslate.package
import argostranslate.translate

class Translator:
  def __init__(self, transcript):
    self.transcript = transcript
    self.delimiter = "\n"

    from_code = "es"
    to_code = "en"

    argostranslate.package.update_package_index()
    available_packages = argostranslate.package.get_available_packages()
    package_to_install = next(
      filter(
        lambda x: x.from_code == from_code and x.to_code == to_code, available_packages
      )
    )
    argostranslate.package.install_from_path(package_to_install.download())


  async def __flatten_json_text_content(self):
    subs = self.transcript["data"]
    return self.delimiter.join(sub["text"] for sub in subs)

  async def __unflatten_json_text_content(self, text_content):
    lines = text_content.split(self.delimiter)
    subs = self.transcript["data"]

    if len(lines) != len(subs):
      raise ValueError(f"Mismatched line count: got {len(lines)} lines, expected {len(subs)} subs")

    return lines

  async def run(self, source_lang: str, target_lang: str):
    # TODO: run check to make sure the language is supported. Should probably have that return in transcript/languages instead of what whisper supprots
    # get the transcript
    # convert to basic csv file format with text only with only text content
    simple_csv_format = await self.__flatten_json_text_content()

    # Run the translation on the entire csv file

    print(f"simple_csv_format: {simple_csv_format}")

    # Get each line and insert it into the transcript data
    translated = argostranslate.translate.translate(simple_csv_format, "es", "en")
    print(f"translated text: {translated}")

    translated_lines = await self.__unflatten_json_text_content(translated)

    # Update the translated text value
    for sub, line in zip(self.transcript["data"], translated_lines):
      sub["translatedText"] = line

    # Update the transcript meta to include "language_to"
    self.transcript["meta"]["language_from"] = source_lang
    self.transcript["meta"]["language_to"] = target_lang

    return self.transcript