import Wave from "react-wavify";
import { useMemo, ComponentProps } from "react";
import { useReducedMotion } from "@/hooks/reduced-motion";
import { mapRange } from "@/lib/utils";

export interface WaveLoaderSkeletonProps {
  percentage?: number;
  waveProps?: ComponentProps<typeof Wave>;
  pause?: boolean;
}

export const WaveLoaderSkeleton = ({
  pause = false,
  percentage = 0,
  waveProps,
}: WaveLoaderSkeletonProps) => {
  const reducedMotion = useReducedMotion();

  // Mapped value used to keep the minimum wave height at 20% of the viewport's height
  const mappedValue = useMemo(
    () => mapRange(percentage, 0, 100, 20, 100),
    [percentage],
  );

  return (
    <Wave
      fill="rgb(255 255 255 / 0.04)"
      paused={pause}
      style={{
        display: "flex",
        zIndex: -10,
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: `calc(100dvh - ${100 - mappedValue}%)`,
      }}
      options={{
        height: 20,
        amplitude: 20,
        speed: reducedMotion ? 0.15 : 0.3,
        points: 3,
      }}
      {...waveProps}
    />
  );
};
