import { useEffect, useState } from "react";

export const useSearchDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeOut);
  }, [value, delay]);
  return { debouncedValue, setDebouncedValue };
};
