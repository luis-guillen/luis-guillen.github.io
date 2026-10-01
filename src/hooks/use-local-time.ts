import { useEffect, useState } from "react";

const TZ = "Atlantic/Canary";

function format(): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TZ,
  }).format(new Date());
}

/** Current wall-clock time in the Canary Islands, refreshed every 30s. */
export function useLocalTime(): string {
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}
