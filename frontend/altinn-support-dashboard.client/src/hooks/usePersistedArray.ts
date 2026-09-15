import { useState, useEffect } from "react";

function usePersistedArray(key: string) {
  const [value, setValue] = useState<string[]>(() => {
    const saved = sessionStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

export default usePersistedArray;