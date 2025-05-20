import { ArrowRight } from "lucide-react";
import { ThreeDots } from "react-loader-spinner";

export interface BlockButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
}

export const BlockButton = ({ onClick, isLoading }: BlockButtonProps) => {
  return (
    <button
      className="disabled:cursor-not-allowed transition-colors relative flex justify-center items-center h-[48px] bg-primary cursor-pointer hover:bg-primary/90 disabled:bg-primary/90"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <ThreeDots color="#ffffff" height={16} />
      ) : (
        <>
          {" "}
          <p className="text-primary-foreground font-semibold">
            Apply Subtitles to Video
          </p>
          <div className="absolute right-2 text-primary-foreground">
            <ArrowRight size={24} />
          </div>
        </>
      )}
    </button>
  );
};
