'use client';

import { CloudUpload } from 'lucide-react';
import { Separator } from '@/components/shad-ui/separator';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/shad-ui/button';
import { ThreeDots } from 'react-loader-spinner';

export interface UploadCardProps {
  handleFileUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
}

const isFileUnder2GB = (size: number) => {
  const maxSizeInBytes = 2 * 1024 * 1024 * 1024; // 2 GB in bytes
  return size <= maxSizeInBytes;
};

export const UploadCard = ({
  handleFileUpload,
  isLoading,
}: UploadCardProps) => {
  // const handleFileDrop = () => {};
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileAttached = useCallback((e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file && isFileUnder2GB(file.size)) {
      setFile(file);
    } else {
      alert('file to large');
    }
  }, []);

  const handleSelectFile = () => {
    inputRef.current?.click();
  };

  useEffect(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.multiple = false;
    inputRef.current = input;

    input.addEventListener('change', handleFileAttached);

    return () => {
      input.removeEventListener('change', handleFileAttached);
    };
  }, [handleFileAttached]);

  return (
    <div
      className="cursor-pointer backdrop-blur-sm bg-background/8 flex justify-center transition-all items-center px-4 w-md mx-auto min-h-[50vh] border-1 rounded-xl hover:border-2 border-white/4 hover:border-white/55"
      onClick={handleSelectFile}
    >
      <div className="flex flex-col justif-center items-center">
        <CloudUpload size={64} />
        {/*<p className="text-lg dark:text-white text-center">Drag & drop</p>*/}
        {/*<div className="flex justify-around items-center gap-4">*/}
        {/*  <Separator className="w-[200px]" /> or{" "}*/}
        {/*  <Separator className="w-[200px]" />*/}
        {/*</div>*/}
        <p className="text-lg dark:text-white text-center text-ellipsis">
          {file?.name || 'Click to select a video to translate'}
        </p>
        {!file && (
          <small>All videos are public and will be deleted after 1 hour.</small>
        )}
        <small>
          {file
            ? `${(file?.size / 1024 ** 2).toFixed(2)} MB`
            : ' File limit: 2 GB'}
        </small>

        {file && (
          <div className="mt-6 flex flex-col gap-5">
            <Button
              className="cursor-pointer mt-4 rounded-full"
              size="lg"
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFileUpload(file);
              }}
            >
              {isLoading ? <ThreeDots color="#ffffff" /> : 'Start Translation'}
            </Button>
            <Separator />
            <p>or click to upload another file</p>
          </div>
        )}
      </div>
    </div>
  );
};
