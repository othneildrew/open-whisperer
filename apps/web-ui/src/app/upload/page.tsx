'use client';

import { useRouter } from 'next/navigation';
import { useUploadFileMutation } from '@open-whisperer/rtk-query';
import { WaveLoaderSkeleton } from '@/components/skeletons/wave-loader-skeleton';
import { UploadCard } from '@/components/skeletons/upload-card';
import { useCallback, useEffect } from 'react';

export default function Upload() {
  const router = useRouter();
  const [uploadFile, { data, isLoading, isError, isSuccess }] =
    useUploadFileMutation();

  const showErrorUploadingFile = useCallback(() => {
    alert('There was a problem uploading file. Please try again later.');
  }, []);

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        uploadFile({
          file,
        });
      } catch (e) {
        showErrorUploadingFile();
        console.error('failed to upload media', e);
      }
    },
    [showErrorUploadingFile, uploadFile]
  );

  useEffect(() => {
    if (isError) {
      showErrorUploadingFile();
    }
  }, [isError, showErrorUploadingFile]);

  useEffect(() => {
    if (!isLoading && isSuccess && data?.session_id) {
      router.push(`/s/${data.session_id}`);
    }
  }, [data?.session_id, isLoading, isSuccess, router]);

  return (
    <>
      <div className="flex-1 flex justify-center items-center max-w-6xl mx-auto">
        <UploadCard handleFileUpload={handleFileUpload} isLoading={isLoading} />
      </div>
      <WaveLoaderSkeleton percentage={40} />
    </>
  );
}
