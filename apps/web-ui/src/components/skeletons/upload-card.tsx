'use client';

import { CloudUpload } from 'lucide-react';
import { Separator } from '@/components/shad-ui/separator';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/shad-ui/button';
import { ThreeDots } from 'react-loader-spinner';

export interface UploadCardProps {
  handleFileUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
}

export const UploadCard = ({
  handleFileUpload,
  isLoading,
}: UploadCardProps) => {
  // const handleFileDrop = () => {};
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const maxSize = useMemo(() => {
    const max = parseInt(process.env.NEXT_PUBLIC_UPLOAD_MAX_SIZE || '');
    const value = max * 1024 * 1024;
    if (!max) return null;
    return {
      value,
      text: `${(value / 1024 ** 2).toFixed(2)} MB`,
    };
  }, []);

  const handleFileAttached = useCallback(
    (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file && (!maxSize || file.size <= maxSize?.value)) {
        setFile(file);
      } else {
        alert(`The uploaded file is too large. File limit: ${maxSize?.text}`);
      }
    },
    [maxSize]
  );

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
        <p className="text-lg dark:text-white text-center text-ellipsis">
          {file?.name || 'Click to select a video to translate'}
        </p>
        {!file && (
          <small>
            All videos are public{' '}
            {process.env.NEXT_PUBLIC_IS_DEMO === '1'
              ? 'and will be deleted after 25 minutes.'
              : 'and can be seen by anyone until deleted.'}
          </small>
        )}
        <small>
          {file
            ? `${(file?.size / 1024 ** 2).toFixed(2)} MB`
            : maxSize
              ? `File limit: ${maxSize.text}`
              : null}
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
