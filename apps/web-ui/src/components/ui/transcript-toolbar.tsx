import {
  SupportedLanguageDropdown,
  SupportedLanguageDropdownProps,
} from "@/components/ui/supported-language-dropdown";
import { Button } from "@/components/shad-ui/button";
import { ThreeDots } from "react-loader-spinner";

export interface TranscriptToolbarProps {
  languages: SupportedLanguageDropdownProps["languages"];
  isLoading?: boolean;
  isTranscribing?: boolean;
  onFromLangChange: SupportedLanguageDropdownProps["onChange"];
  onToLangChange: SupportedLanguageDropdownProps["onChange"];
  handleTranscribe: () => void;
}

export const TranscriptToolbar = ({
  languages,
  onFromLangChange,
  onToLangChange,
  isLoading,
  isTranscribing,
  handleTranscribe,
}: TranscriptToolbarProps) => (
  <div className="px-4 flex gap-5 justify-between items-center h-[48px] border-1 border-b-neutral-600">
    <div className="flex gap-2 items-center">
      Translate:
      <SupportedLanguageDropdown
        helperText="Source"
        languages={languages}
        isLoading={isTranscribing || isLoading}
        onChange={onFromLangChange}
      />
      <SupportedLanguageDropdown
        helperText="Target"
        languages={languages}
        defaultSelected="en"
        isLoading={isTranscribing || isLoading}
        onChange={onToLangChange}
      />
    </div>

    <Button
      size="sm"
      onClick={handleTranscribe}
      disabled={isTranscribing || isLoading}
    >
      {isTranscribing || isLoading ? (
        <ThreeDots color="#ffffff" height={16} />
      ) : (
        "Generate Transcript"
      )}
    </Button>
  </div>
);
