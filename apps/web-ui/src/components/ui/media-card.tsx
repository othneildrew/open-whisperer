import { ReactNode, useMemo } from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/shad-ui/aspect-ratio";

export interface SimpleCardProps {
  title?: string;
  thumbnail?: string | null;
  size?: number;
  // children?: ReactNode;
  onClick?: () => void;
}

export const MediaCard = ({ title, thumbnail, size, onClick }: SimpleCardProps) => {
  const src = useMemo(
    () => (thumbnail ? thumbnail : "/placeholder.jpg"),
    [thumbnail],
  );

  return (
    <div className="cursor-pointer bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-2 shadow-sm min-h-[250px] w-full flex-grow h-[300px] transition-all hover:scale-101 hover:translate-y-[-8px] hover:border-primary" onClick={onClick}>
      <AspectRatio ratio={4 / 3}>
        <Image
          fill
          src={src}
          alt="thumbnail"
          className="rounded-lg object-cover"
          unselectable="on"
          draggable={false}
        />
      </AspectRatio>
      <div className="flex flex-col gap-2">
        <p className="h-[16px] text-ellipsis">{title}</p>
        <small className="font-mono">[es {"\u27f6"} en]</small>
      </div>
    </div>
  );
};
