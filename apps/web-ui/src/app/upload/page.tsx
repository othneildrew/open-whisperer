"use client";

import { useRouter } from "next/navigation";
import { useUploadFileMutation } from "@open-whisperer/rtk-query";
import { WaveLoaderSkeleton } from "@/components/skeletons/wave-loader-skeleton";
import { UploadCard } from "@/components/skeletons/upload-card";
import { useCallback, useEffect, useState } from "react";

export default function Upload() {
  const router = useRouter();
  const [percentage, setPercentage] = useState<number>(0);
  const [uploadFile, { data, error, isLoading, isError, isSuccess }] =
    useUploadFileMutation();

  const handleFileUpload = useCallback(
    async (file: File) => {
      // uploadFile({
      //   file: new Blob([file], { type: file.type }),
      // });

      const formData = new FormData();
      formData.append("file", file);

      try {
        const result = await fetch("http://localhost:8000/uploads", {
          method: "POST",
          body: formData,
        });

        const data = await result.json();
        const sessionId = data?.session_id;

        if (sessionId) {
          router.push(`/s/${sessionId}`);
        }
      } catch (e) {
        console.error("failed to upload media", e);
      }
    },
    [router],
  );

  return (
    <>
      <div className="flex-1 flex justify-center items-center max-w-6xl mx-auto">
        <UploadCard handleFileUpload={handleFileUpload} />
      </div>
      <WaveLoaderSkeleton percentage={40} />
    </>
  );
}
