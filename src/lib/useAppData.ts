import { useEffect, useState } from "react";
import { loadData } from "./storage";
import type { AppData } from "./types";

export function useAppData(): AppData {
  const [data, setData] = useState<AppData>(() => loadData());

  useEffect(() => {
    const handler = () => setData(loadData());
    window.addEventListener("podtracker:update", handler);
    window.addEventListener("storage", handler);
    // refresh on mount in case SSR placeholder
    setData(loadData());
    return () => {
      window.removeEventListener("podtracker:update", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return data;
}
