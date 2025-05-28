'use client';

import { useListSessionsQuery } from '@open-whisperer/rtk-query';
import { ScrollArea } from '@/components/shad-ui/scroll-area';
import { MediaCard } from '@/components/ui/media-card';
import { CardSkeleton } from '@/components/skeletons/card-skeleton';
import { WaveLoaderSkeleton } from '@/components/skeletons/wave-loader-skeleton';
import { useRouter } from 'next/navigation';
import { ErrorCard } from '@/components/ui/error-card';
import { Skeleton } from '@/components/shad-ui/skeleton';
import { Button } from '@/components/shad-ui/button';

interface Session {
  id: string;
  input_file_name: string;
  thumbnail?: string;
}

export default function Page() {
  const router = useRouter();
  const { data, isLoading, isFetching, isError, isSuccess } =
    useListSessionsQuery();

  const sessions = (data?.data ?? {}) as Session[];

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="container max-w-6xl mx-auto py-8 px-2 sm:px-4 md:px-5">
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
                All uploaded videos are public and can be viewed by anyone that
                accesses this self hosted tool.{' '}
                {process.env.NEXT_PUBLIC_IS_DEMO === '1' &&
                  'Files are deleted after 25 minutes.'}
              </p>
            )}
          </div>

          {isError && <ErrorCard />}

          {isSuccess && sessions.length === 0 && (
            <Button onClick={() => router.push('/upload')}>
              Upload your first video
            </Button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading || isFetching ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : (
              <>
                {!isError
                  ? sessions?.map(({ id, input_file_name, thumbnail }) => (
                      <MediaCard
                        key={id}
                        id={id}
                        thumbnail={thumbnail}
                        title={input_file_name}
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
