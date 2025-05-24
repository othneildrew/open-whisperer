'use client';

import { useCallback, useState, useMemo, useEffect } from 'react';
import {
  Language,
  useGenerateTranscriptMutation,
  useListTranslateSupportedLanguagesQuery,
  useApplySubtitlesMutation,
  useGetTranscriptQuery,
} from '@open-whisperer/rtk-query';
import { VideoPlayer } from '@/features/video/video-player';
import { useParams } from 'next/navigation';
import { SessionIdProvider } from '@/components/providers/session-id-provider';
import { ScrollArea } from '@/components/shad-ui/scroll-area';
import { TranscriptToolbar } from '@/components/ui/transcript-toolbar';
import { Transcript } from '@/components/ui/transcript';
import {
  TranscriptBlockButton,
  BlockButtonMode,
} from '@/components/ui/transcript-block-button';
import { VideoProvider } from '@/components/providers/video-provider';
import { AUTO_LANGUAGE_SELECTION } from '@/components/ui/supported-language-dropdown';

export type PageParams = {
  sessionId: string;
};

export default function Editor() {
  const params = useParams<PageParams>();
  const sessionId = params.sessionId as string;
  const [blockButtonMode] = useState<BlockButtonMode>('apply');
  const [fromLangCode, setFromLangCode] = useState<Language['code']>(
    AUTO_LANGUAGE_SELECTION['code']
  );
  const [toLangCode, setToLangCode] = useState<Language['code']>('en');
  const { data: transcript, isLoading: isLoadingTranscript } =
    useGetTranscriptQuery(sessionId, { skip: !sessionId });
  const [transcribeFile, { isLoading: isTranscribing }] =
    useGenerateTranscriptMutation();
  const [applySubtitles, { isLoading: isApplyingSubtitles }] =
    useApplySubtitlesMutation();

  const { data: supportedLangs, isLoading: isLoadingSupportedLanguages } =
    useListTranslateSupportedLanguagesQuery();

  const languages = useMemo(
    () => (supportedLangs?.data ?? []) as Language[],
    [supportedLangs?.data]
  );

  /**
   * Ensures the user has a valid transcript and that the languages dropdowns
   * haven't been changed without a new transcript being generated
   */
  const canApplySubtitles = useMemo<boolean>(() => {
    const tFrom = transcript?.meta?.language_from;
    const tTo = transcript?.meta?.language_to;

    return !!(tFrom && tTo && tFrom === fromLangCode && tTo === toLangCode);
  }, [
    fromLangCode,
    toLangCode,
    transcript?.meta?.language_from,
    transcript?.meta?.language_to,
  ]);

  const handleTranscribe = useCallback(async () => {
    await transcribeFile({
      sessionId,
      fromLang: fromLangCode !== 'auto-detected' ? fromLangCode : undefined,
      toLang: toLangCode !== 'auto-detected' ? toLangCode : undefined,
    });
  }, [fromLangCode, sessionId, toLangCode, transcribeFile]);

  const handleApplySubtitles = useCallback(async () => {
    if (transcript?.meta?.language_to) {
      applySubtitles({
        sessionId,
        lang: transcript?.meta?.language_to,
      });
    } else {
      alert(
        'No target language set in transcript. Generate a transcript first'
      );
    }
  }, [applySubtitles, sessionId, transcript?.meta?.language_to]);

  /**
   * Sets the source/target languages based on the transcript.
   * Allowing the user to see what language is the source if auto detected is ever used.
   */
  useEffect(() => {
    const transcriptFromLang = transcript?.meta?.language_from;
    const transcriptToLang = transcript?.meta?.language_to;

    if (transcriptFromLang) {
      setFromLangCode(transcriptFromLang);
    }

    if (transcriptToLang) {
      setToLangCode(transcriptToLang);
    }
  }, [transcript]);

  return (
    <SessionIdProvider>
      <VideoProvider>
        <div className="flex-1 grid grid-rows-[1fr] min-h-0">
          <div className="h-[calc(100dvh-56px)] grid grid-cols-2 min-h-0">
            <div className="flex flex-col items-stretch min-h-0">
              <TranscriptToolbar
                isLoading={isLoadingSupportedLanguages}
                languages={languages}
                isTranscribing={isTranscribing}
                handleTranscribe={handleTranscribe}
                onFromLangChange={setFromLangCode}
                onToLangChange={setToLangCode}
                fromLangCodeValue={fromLangCode}
                toLangCodeValue={toLangCode}
              />
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full bg-muted/30">
                  <Transcript
                    transcribing={isLoadingTranscript || isTranscribing}
                  />
                </ScrollArea>
              </div>
              <TranscriptBlockButton
                mode={blockButtonMode}
                isLoading={isApplyingSubtitles}
                disabled={!canApplySubtitles}
                onClick={handleApplySubtitles}
              />
            </div>

            <VideoPlayer />
          </div>
          {/*TODO: add audio wave visualizer in later version, should be 200px height when ready to use*/}
          {/*<div className="flex flex-1 border-1 border-red-700 h-full">*/}
          {/*  /!*<div className="border-t-1 border-b-1 h-[38px]"></div>*!/*/}
          {/*  <AudioVisualizer />*/}
          {/*</div>*/}
        </div>
      </VideoProvider>
    </SessionIdProvider>
  );
}
