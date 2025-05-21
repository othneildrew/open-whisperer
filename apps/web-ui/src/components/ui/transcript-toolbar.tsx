import {
  SupportedLanguageCode,
  SupportedLanguageDropdown,
  SupportedLanguageDropdownProps,
} from '@/components/ui/supported-language-dropdown';
import { Button } from '@/components/shad-ui/button';
import { ThreeDots } from 'react-loader-spinner';
import { ArrowDown } from 'lucide-react';

export interface TranscriptToolbarProps {
  languages: SupportedLanguageDropdownProps['languages'];
  isLoading?: boolean;
  isTranscribing?: boolean;
  onFromLangChange: SupportedLanguageDropdownProps['onChange'];
  onToLangChange: SupportedLanguageDropdownProps['onChange'];
  fromLangCodeValue?: SupportedLanguageCode;
  toLangCodeValue?: SupportedLanguageCode;
  handleTranscribe: () => void;
}

export const TranscriptToolbar = ({
  languages,
  onFromLangChange,
  onToLangChange,
  isLoading,
  isTranscribing,
  handleTranscribe,
  fromLangCodeValue,
  toLangCodeValue,
}: TranscriptToolbarProps) => {
  const isLoadingOrTranscribing = isLoading || isTranscribing;
  return (
    <div className="px-4 flex gap-5 justify-between items-center h-[48px]">
      <div className="flex gap-2 items-center">
        Translate:
        <SupportedLanguageDropdown
          allowAutoDetectOption
          helperText="Source"
          languages={languages}
          isLoading={isLoadingOrTranscribing}
          onChange={onFromLangChange}
          value={fromLangCodeValue}
          omittedLanguages={toLangCodeValue ? [toLangCodeValue] : undefined}
        />
        <SupportedLanguageDropdown
          helperText="Target"
          languages={languages}
          isLoading={isLoadingOrTranscribing}
          onChange={onToLangChange}
          value={toLangCodeValue}
          omittedLanguages={fromLangCodeValue ? [fromLangCodeValue] : undefined}
        />
      </div>

      <Button
        className="min-w-[166px]"
        size="sm"
        onClick={handleTranscribe}
        disabled={isLoadingOrTranscribing}
      >
        {isLoadingOrTranscribing ? (
          <ThreeDots color="#ffffff" height={16} />
        ) : (
          'Generate Transcript'
        )}
        {!isLoadingOrTranscribing && <ArrowDown size={16} />}
      </Button>
    </div>
  );
};
