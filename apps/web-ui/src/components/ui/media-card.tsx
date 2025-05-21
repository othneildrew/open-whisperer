import { useMemo } from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/shad-ui/aspect-ratio";
import { BACKEND_SERVER_MEDIA_URL } from "@/lib/constants";

export interface SimpleCardProps {
  id: string;
  title?: string;
  thumbnail?: string | null;
  onClick?: () => void;
}

export const MediaCard = ({
  id,
  title,
  thumbnail,
  onClick,
}: SimpleCardProps) => {
  const src = useMemo(
    () =>
      thumbnail
        ? `${BACKEND_SERVER_MEDIA_URL}/${id}/${thumbnail}`
        : "/placeholder.jpg",
    [id, thumbnail],
  );

  return (
    <div
      className="cursor-pointer bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-2 shadow-sm min-h-[250px] w-full flex-grow h-auto transition-all hover:scale-101 hover:translate-y-[-8px] hover:border-primary"
      onClick={onClick}
    >
      <AspectRatio className="relative" ratio={4 / 3}>
        <Image
          fill
          src={src}
          alt="thumbnail"
          className="rounded-lg object-cover"
          unselectable="on"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 28vw"
          draggable={false}
        />
      </AspectRatio>
      <div className="flex flex-col gap-2">
        <p className="line-clamp-3">{title}</p>
      </div>
    </div>
  );
};
