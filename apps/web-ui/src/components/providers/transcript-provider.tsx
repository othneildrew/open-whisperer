"use client";

import { ReactNode, createContext, useContext, useMemo } from "react";
import { useParams } from "next/navigation";
import { useGetTranscriptQuery } from "@open-whisperer/rtk-query";
import { PageParams } from "@/app/s/[sessionId]/page";

export interface TranscriptProviderProps {
  children?: ReactNode;
}

export interface TranscriptProviderReturnValue {
  isLoading: boolean;
  sessionId: string;
  data: any;
}

const TranscriptContext = createContext<
  TranscriptProviderReturnValue | undefined
>(undefined);

export const TranscriptProvider = ({ children }: TranscriptProviderProps) => {
  const params = useParams<PageParams>();
  const sessionId = params.sessionId as string;
  const { data, isLoading } = useGetTranscriptQuery(sessionId, {
    skip: !sessionId,
  });

  const value = useMemo(
    () => ({
      isLoading,
      sessionId,
      data: data?.data ?? {},
    }),
    [data?.data, isLoading, sessionId],
  );

  return (
    <TranscriptContext.Provider value={value}>
      {children}
    </TranscriptContext.Provider>
  );
};

export const useTranscript = () => useContext(TranscriptContext);
