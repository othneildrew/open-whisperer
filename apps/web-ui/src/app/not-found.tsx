'use client';

import { ErrorCard } from "@/components/ui/error-card";
import { WaveLoaderSkeleton } from "@/components/skeletons/wave-loader-skeleton";

export default function Error404() {
  return (
    <>
      <div className="flex-1 container max-w-6xl mx-auto py-12">
        <ErrorCard
          showLink={false}
          message="The page you are looking for does not exist"
        />
      </div>
      <WaveLoaderSkeleton />
    </>
  );
}
