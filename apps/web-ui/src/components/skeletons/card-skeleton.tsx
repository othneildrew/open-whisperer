import { Skeleton } from "@/components/shad-ui/skeleton";
import { AspectRatio } from '@/components/shad-ui/aspect-ratio';

export const CardSkeleton = () => {
  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-2 shadow-sm min-h-[250px] w-full flex-grow h-[300px]">
      <AspectRatio ratio={4 / 3}>
        <Skeleton className="w-full h-[193.5px]" />
      </AspectRatio>
      <div className="flex flex-col gap-2">
        <Skeleton className="w-[88%] h-[16px]" />
        <Skeleton className="w-[94%] h-[16px]" />
        <Skeleton className="w-[34%] h-[16px]" />
      </div>
    </div>
  );
};
