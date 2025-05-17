"use client";

import { CloudUpload } from "lucide-react";
import { Separator } from "@/components/shad-ui/separator";
import { useEffect, useRef } from 'react';

export interface UploadCardProps {
  handleFileUpload: (file: File) => void;
}

export const UploadCard = ({ handleFileUpload }: UploadCardProps) => {
  const handleFileDrop = () => {};
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileAttached = () => {};

  const handleSelectFile = () => {
   inputRef.current?.click();
  };

  useEffect(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.multiple = false;
    inputRef.current = input;

    input.addEventListener('change', handleFileAttached);

    return () => {
      input.removeEventListener('change', handleFileAttached);
    }
  }, []);

  useEffect(() => {
  }, []);

  return (
    <div
      className="backdrop-blur-sm bg-background/8 flex justify-center items-center px-4 w-md mx-auto min-h-[50vh] border-1 rounded-xl border-white/4"
      onClick={handleSelectFile}
    >
      <div className="flex flex-col justif-center items-center">
        <CloudUpload size={64} />
        <p className="text-lg dark:text-white text-center">Drag & drop</p>
        <div className="flex justify-around items-center gap-4">
          <Separator className="w-[200px]" /> or{" "}
          <Separator className="w-[200px]" />
        </div>
        <p className="text-lg dark:text-white text-center">
          click to select a video to translate
        </p>
        <small>All videos are public and will be deleted after 1 hour.</small>
      </div>
    </div>
  );
};
