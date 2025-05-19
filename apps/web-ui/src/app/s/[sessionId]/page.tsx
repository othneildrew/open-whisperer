"use client";

import {
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
  RefObject,
  useMemo,
} from "react";
import {
  useTranscribeFileMutation,
  useListTranslateSupportedLanguagesQuery,
  Language,
} from "@open-whisperer/rtk-query";
import { VideoPlayer } from "@/features/video/video-player";
import { AudioVisualizer } from "@/features/audio-visualizer/audio-visualizer";
import { useParams } from "next/navigation";
import { SessionIdProvider } from "@/components/providers/session-id-provider";
import { ScrollArea } from "@/components/shad-ui/scroll-area";
import { TranscriptToolbar } from "@/components/ui/transcript-toolbar";
import { Transcript } from "@/components/ui/transcript";

export type PageParams = {
  sessionId: string;
};

export default function Editor() {
  const params = useParams<PageParams>();
  const sessionId = params.sessionId as string;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fromLang, setFromLang] = useState<Language>();
  const [toLang, setToLang] = useState<Language>();
  const [transcribeFile, { isLoading: isTranscribing }] =
    useTranscribeFileMutation();

  const { data: supportedLangs, isLoading: isLoadingSupportedLanguages } =
    useListTranslateSupportedLanguagesQuery();

  const languages = useMemo(
    () => (supportedLangs?.data ?? []) as Language[],
    [supportedLangs?.data],
  );

  const handleTranscribe = useCallback(async () => {
    const fromLangCode = fromLang?.code;
    const toLangCode = toLang?.code;

    await transcribeFile({
      sessionId,
      fromLang: fromLangCode !== "auto-detected" ? fromLangCode : undefined,
      toLang: toLangCode !== "auto-detected" ? toLangCode : undefined,
    });
  }, [fromLang?.code, sessionId, toLang?.code, transcribeFile]);

  const isLoading = isLoadingSupportedLanguages;

  // useEffect(() => {
  //   // console.log("video ref:::", videoRef.current);
  //   console.log("transcript:::", transcript);
  // }, [transcript]);

  return (
    <SessionIdProvider>
      <div className="flex-1 grid grid-rows-[1fr_200px] min-h-0">
        <div className="h-[calc(100dvh-200px-56px)] grid grid-cols-2 min-h-0">
          <div className="flex flex-col items-stretch min-h-0">
            <TranscriptToolbar
              isLoading={isLoadingSupportedLanguages}
              languages={languages}
              isTranscribing={isTranscribing}
              handleTranscribe={handleTranscribe}
              onFromLangChange={setFromLang}
              onToLangChange={setToLang}
            />
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <Transcript />
              </ScrollArea>
            </div>
          </div>

          <div className="flex min-h-0 flex-col justify-center items-center">
            <VideoPlayer ref={videoRef} />
          </div>
        </div>

        <div className="flex flex-1 border-t-1">
          {/*<div className="border-t-1 border-b-1 h-[38px]"></div>*/}
          {/*<AudioVisualizer videoRef={videoRef} />*/}
        </div>
      </div>
    </SessionIdProvider>
  );
}
