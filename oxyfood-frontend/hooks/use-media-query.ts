"use client";

import { useState, useEffect } from "react";

function getInitialValue(query: string): boolean {
  if (typeof window !== "undefined") {
    return window.matchMedia(query).matches;
  }
  return false;
}

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(() => getInitialValue(query));

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = window.matchMedia(query);

    result.addEventListener("change", onChange);
    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}
