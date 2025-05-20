import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Linearly maps a number to a new range value.
 * For example, 0-100 can be represented as 0-1 or 20-100.
 * @param value
 * @param inMin
 * @param inMax
 * @param outMin
 * @param outMax
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

/**
 * Transforms seconds into the hh:mm:ss format more used without .srt transcript files.
 * @param start
 * @param end
 */
export const secondsToSrtTimestamp = (start: number, end: number): string => {
  const formatTime = (time: number): string => {
    const hh = Math.floor(time / 3600);
    const mm = Math.floor((time % 3600) / 60);
    const ss = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 1000);

    return (
      [
        String(hh).padStart(2, "0"),
        String(mm).padStart(2, "0"),
        String(ss).padStart(2, "0"),
      ].join(":") + `,${String(ms).padStart(3, "0")}`
    );
  };

  return `${formatTime(start)} --> ${formatTime(end)}`;
};
