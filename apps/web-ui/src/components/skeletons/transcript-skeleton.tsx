import { Skeleton } from "@/components/shad-ui/skeleton";

export const TranscriptSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col p-4 gap-2 border-1 border-b-neutral-700">
          <Skeleton className="w-[18%] h-[18px]" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="shrink-0 w-[100%] h-[48px]" />
            <Skeleton className="shrink-0 w-[100%] h-[48px]" />
          </div>
        </div>
      ))}
    </>
  );
};
