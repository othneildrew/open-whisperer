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
