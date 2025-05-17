'use client';

import { ReactNode, useRef, createContext, useState, useContext } from "react";

export interface TranscriptProviderProps {
  children?: ReactNode;
}

export interface TranscriptProviderReturnValue {}

type T = Record<string, unknown>;

const TranscriptContext = createContext<T>({});

export const TranscriptProvider = ({ children }: TranscriptProviderProps) => {



  return (
    <TranscriptContext.Provider value={{}}>
      {children}
    </TranscriptContext.Provider>
  );
};

export const useTranscript = () => useContext(TranscriptContext);
