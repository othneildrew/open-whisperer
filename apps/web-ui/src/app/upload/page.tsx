"use client";

import { WaveLoaderSkeleton } from "@/components/skeletons/wave-loader-skeleton";
import { UploadCard } from '@/components/skeletons/upload-card';

export default function Upload() {
  const handleFileUpload = () => {

  }

  return (
    <>
      <div className="flex-1 flex justify-center items-center max-w-6xl mx-auto">
        <UploadCard handleFileUpload={handleFileUpload} />
      </div>
      <WaveLoaderSkeleton percentage={50} />
    </>
  );
}
