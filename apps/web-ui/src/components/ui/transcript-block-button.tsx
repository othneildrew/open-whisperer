import clsx from "clsx";
import { ArrowRight, ArrowUp } from "lucide-react";
import { ThreeDots } from "react-loader-spinner";

export type BlockButtonMode = "update" | "apply";

export interface BlockButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
  mode?: BlockButtonMode;
  disabled?: boolean;
}

export const TranscriptBlockButton = ({
  mode = "apply",
  onClick,
  isLoading,
  disabled,
}: BlockButtonProps) => {
  const btnTextMap: Record<BlockButtonMode, string> = {
    update: "Update Transcript",
    apply: "Apply Subtitles to Video",
  };

  return (
    <button
      className={clsx(
        "disabled:cursor-not-allowed transition-colors relative flex justify-center items-center h-[48px] cursor-pointer ",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50":
            !disabled,
          "bg-secondary text-secondary-foreground/78": disabled,
        },
      )}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ThreeDots color="#ffffff" height={16} />
      ) : (
        <>
          <div className="absolute left-2">
            {mode === "update" && <ArrowUp size={24} />}
          </div>
          <p className="font-semibold">{btnTextMap[mode]}</p>
          <div className="absolute right-2">
            {mode === "update" ? (
              <ArrowUp size={24} />
            ) : (
              <ArrowRight size={24} />
            )}
          </div>
        </>
      )}
    </button>
  );
};
