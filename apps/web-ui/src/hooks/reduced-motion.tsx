"use client";

import { useEffect, useState } from "react";

/**
 * Detects whether a user prefers reduced motion.
 */
export const useReducedMotion = (): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mql.addEventListener("change", handler);

    return () => {
      mql.removeEventListener("change", handler);
    };
  }, []);

  return matches;
};
