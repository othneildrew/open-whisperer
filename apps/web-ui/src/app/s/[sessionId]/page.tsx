"use client";

import {
  FormEvent,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
  use, RefObject,
} from "react";
import {
  useGetTranscriptSupportedLanguagesQuery,
  useTranscribeFileQuery,
} from "@open-whisperer/rtk-query";
import { AppBar } from "@/components/shad-ui/app-bar";
import { VideoPlayer } from "@/features/video/video-player";
import { AudioVisualizer } from "@/features/audio-visualizer/audio-visualizer";
import { useSearchParams } from "next/navigation";

export type PageParams = {
  session?: string;
};

export default function Home() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  // console.log(sessionId);

  const videoRef = useRef<RefObject<HTMLVideoElement>>(null);
  // const { data } = useGetTranscriptSupportedLanguagesQuery();
  const { data: transcript } = useTranscribeFileQuery(
    { sessionId: sessionId! },
    { skip: !sessionId },
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    for (const [key, value] of formData.entries()) {
      console.log("key:::", key);
      console.log("value:::", value);
    }

    console.log("formData:::", formData.entries());
    const files = form.files;

    // if (files.length !== 1) {
    //   // throw error a file must be specified, no more than 1
    // }

    console.log("files:::", { e, files });

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("server response:::", data);
      })
      .catch((err) => console.log(err));
  };

  const handleFileChange = () => {};

  const handleTranscribe = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch("/api/transcribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: "a_test.mp3",
        sourceLang: "es-US",
        targetLang: "en-US",
      }),
    });

    const data = await res.json();

    console.log("server response:::", data);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    // console.log("video ref:::", videoRef.current);
    console.log('transcript:::', transcript);
  }, [transcript]);

  return (
    <main className="flex-1 grid grid-rows-[56px_1fr_200px]">
      <AppBar />

      <div className="border-2">
        <div className="h-full grid grid-cols-2">
          <div className="flex flex-col border-r-1 border-white/78">
            subtitles and translations goes here
          </div>
          <div className="flex flex-col justify-center bg-black">
            <VideoPlayer ref={videoRef} />
          </div>
        </div>
      </div>

      <div className="border-pink-400">
        <div className="border-t-1 border-b-1 h-[38px]">trackbar</div>
        <AudioVisualizer videoRef={videoRef} />
      </div>

      {/*<div>*/}
      {/*  <form className="" onSubmit={handleSubmit}>*/}
      {/*    <input name="sourceLang" defaultValue="es" hidden />*/}
      {/*    <input name="targetLang" defaultValue="en" hidden />*/}
      {/*    <input name="file" type="file" id="file" onChange={handleFileChange} accept="video/*,audio/*" />*/}
      {/*    <button type="submit">Upload</button>*/}
      {/*  </form>*/}
      {/*</div>*/}

      {/*<div>*/}
      {/*  <button onClick={handleTranscribe} disabled={isLoading}>Transcribe </button>*/}
      {/*  {isLoading && <p className="text-amber-500">Transcribing...</p>}*/}
      {/*</div>*/}
    </main>
  );
}
