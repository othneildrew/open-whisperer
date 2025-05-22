import {
  SupportedLanguageCode,
  SupportedLanguageDropdown,
  SupportedLanguageDropdownProps,
} from '@/components/ui/supported-language-dropdown';
import { Button } from '@/components/shad-ui/button';
import { ThreeDots } from 'react-loader-spinner';
import { ArrowDown, Trash } from 'lucide-react';
import { useDeleteSessionMutation } from '@open-whisperer/rtk-query';
import { useSessionId } from '@/components/providers/session-id-provider';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shad-ui/tooltip';

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

const deleteBtnTitle = 'Delete transcript & upload';

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
  const router = useRouter();
  const sessionId = useSessionId();
  const [deleteSession] = useDeleteSessionMutation();

  const isLoadingOrTranscribing = isLoading || isTranscribing;

  const handleDeleteSession = () => {
    if (sessionId) {
      /**
       * We immediately move user to the home page then do the delete operation.
       * This is since we don't have any jobs in the background and the os might
       * throw an error since the video could be getting streamed while attempting
       * a delete operation.
       *
       * Ideally, a job would schedule its deletion and the backend would start
       * throwing 404 errors at this time to let clients know.
       */
      router.push('/');
      deleteSession(sessionId);
    }
  };

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

      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteSession}
              title={deleteBtnTitle}
            >
              <Trash size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{deleteBtnTitle}</p>
          </TooltipContent>
        </Tooltip>
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
    </div>
  );
};
