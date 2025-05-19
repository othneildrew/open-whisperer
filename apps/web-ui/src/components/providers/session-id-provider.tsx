"use client";

import { useContext, createContext, ReactNode } from "react";
import { useParams } from "next/navigation";
import { PageParams } from "@/app/s/[sessionId]/page";

const SessionIdContext = createContext<string | null>(null);

export const SessionIdProvider = ({ children }: { children: ReactNode }) => {
  const params = useParams<PageParams>();
  const sessionId = params.sessionId as string;



  return (
    <SessionIdContext.Provider value={sessionId}>
      {children}
    </SessionIdContext.Provider>
  );
};

export const useSessionId = () => useContext(SessionIdContext);
