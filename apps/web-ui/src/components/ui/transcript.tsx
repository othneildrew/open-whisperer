import { useEffect, useMemo } from "react";
import { useGetTranscriptQuery } from "@open-whisperer/rtk-query";
import { Textarea } from "@/components/shad-ui/textarea";
import { ArrowRight } from "lucide-react";
import { secondsToSrtTimestamp } from "@/lib/utils";
import { useSessionId } from "@/components/providers/session-id-provider";
import { TranscriptSkeleton } from "@/components/skeletons/transcript-skeleton";

export interface ITranscript {
  start: number;
  end: number;
  number: number;
  text: string;
  translated_text: string | null;
}

export interface TranscriptProps {
  transcribing?: boolean;
}

export const Transcript = ({ transcribing }: TranscriptProps) => {
  const sessionId = useSessionId();
  const {
    data: transcript,
    isLoading: isLoadingTranscript,
    isFetching: isFetchingTranscript,
    isError,
    isSuccess,
  } = useGetTranscriptQuery(sessionId!, { skip: !sessionId });

  const isLoading = transcribing || isLoadingTranscript || isFetchingTranscript;

  const events = useMemo(
    () => (transcript?.data ?? []) as ITranscript[],
    [transcript],
  );

  const hasTranscript = useMemo(
    () => !isLoading && isSuccess && events.length > 0,
    [events.length, isLoading, isSuccess],
  );

  useEffect(() => {
    console.log("TRANSCRIPT FROM TRANSCRIPT FILE:::", transcript);
  }, [transcript]);

  return (
    <div className="flex-1 bg-muted/30">
      {hasTranscript ? (
        <>
          {events.map(({ start, end, number, text, translated_text }) => (
            <div
              key={number}
              className="px-4 pb-4 pt-2 border-b-1 border-neutral-900"
            >
              <p className="pb-2">
                <strong className="dark:text-white/90">{number}</strong> {secondsToSrtTimestamp(start, end)}
              </p>
              <div
                key={number}
                className="flex flex-1 gap-x-2 items-stretch h-full"
              >
                <div className="flex-1 overflow-auto min-h-[80px]">
                  <Textarea value={text} readOnly className="h-full" />
                </div>

                <ArrowRight className="shrink-0 self-center" size={18} />

                <div className="flex-1 overflow-auto min-h-[80px]">
                  <Textarea
                    value={translated_text || ""}
                    readOnly
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </>
      ) : isLoading ? (
        <TranscriptSkeleton />
      ) : (
        <div className="flex flex-col p-4 gap-2">
          <p className="">
            No transcript has been generated. Choose a target language and click
            "Generate Transcript" above.
          </p>
          <small>
            Recommended: set source to "Auto Detect" unless you get inaccurate
            results
          </small>
        </div>
      )}
    </div>
  );
};
