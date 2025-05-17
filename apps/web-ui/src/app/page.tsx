"use client";

import { useListSessionsQuery } from "@open-whisperer/rtk-query";
import { ScrollArea } from "@/components/shad-ui/scroll-area";
import { MediaCard } from "@/components/ui/media-card";
import { CardSkeleton } from "@/components/skeletons/card-skeleton";
import { WaveLoaderSkeleton } from "@/components/skeletons/wave-loader-skeleton";
import { useRouter } from "next/navigation";
import { ErrorCard } from "@/components/ui/error-card";
import { Skeleton } from "@/components/shad-ui/skeleton";

export default function EditorPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useListSessionsQuery();

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="container max-w-6xl mx-auto py-8">
          <div className="py-6">
            {isLoading ? (
              <Skeleton className="mb-2 w-[100px] h-[32px]" />
            ) : (
              <h1 className="text-2xl font-bold mb-1 text-white">Uploads</h1>
            )}
            {isLoading ? (
              <Skeleton className="w-[34%] h-[24px]" />
            ) : (
              <p>
                All uploaded videos are public and will be deleted after 24
                hours.Report abuse at codeguydrew+abuse@gmail.com
              </p>
            )}
          </div>

          {isError && <ErrorCard />}

          <div className="grid grid-cols-4 gap-4">
            {isLoading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : (
              <>
                {!isError
                  ? data?.data?.map(({ id, created_at }) => (
                      <MediaCard
                        key={id}
                        thumbnail={undefined}
                        title="jla sdfjla sjdlfjasdf"
                        onClick={() => router.push(`/s/${id}`)}
                      />
                    ))
                  : null}
              </>
            )}
          </div>
        </div>
      </ScrollArea>
      <WaveLoaderSkeleton />
    </>
  );
}
