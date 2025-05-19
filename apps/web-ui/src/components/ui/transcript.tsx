import { useEffect, useMemo } from "react";
import { useGetTranscriptQuery } from "@open-whisperer/rtk-query";
import { Textarea } from "@/components/shad-ui/textarea";
import { ArrowRight } from "lucide-react";
import { secondsToTimestamp } from "@/lib/utils";
import { useSessionId } from "@/components/providers/session-id-provider";
import { TranscriptSkeleton } from "@/components/skeletons/transcript-skeleton";

export interface ITranscript {
  start: number;
  end: number;
  number: number;
  text: string;
  translatedText: string | null;
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
    <div className="flex-1">
      {hasTranscript ? (
        <>
          {events.map(({ start, end, number, text, translatedText }) => (
            <div
              key={number}
              className="border-b-1 px-4 py-2 border-neutral-700"
            >
              <div className="flex gap-2 font-mono">{number}
                <p>{secondsToTimestamp(start)}</p> -->
                <p>{secondsToTimestamp(end)}</p>
              </div>
              <div className="flex flex-1 justify-between items-center">
                <Textarea value={text} readOnly />
                <ArrowRight className="px-2 shrink-0" size={26} />
                <Textarea value={translatedText || ""} readOnly />
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
