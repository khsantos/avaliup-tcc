import { useEffect, useRef } from "react";

export function useAdSense() {
  const adLoaded = useRef(false);

  useEffect(() => {
    if (adLoaded.current) return;
    try {
      // @ts-expect-error ads already exist
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      adLoaded.current = true;
    } catch (e) {
      console.error("Adsense error", e);
    }
  }, []);

  return adLoaded.current;
}
