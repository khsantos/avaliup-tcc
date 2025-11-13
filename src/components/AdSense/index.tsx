"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

function AdSenseComponent() {
  const adLoaded = useRef(false);

  useEffect(() => {
    if (adLoaded.current) return; // já inicializado

    try {
      // @ts-expect-error description about adsbygoogle
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      adLoaded.current = true;
    } catch (e) {
      console.error("Adsense error", e);
    }
  }, []);

  return (
    <div className="w-full my-8 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          maxWidth: "970px",
          height: "55px",
        }}
        data-ad-client="ca-pub-8840751358865151"
        data-ad-slot="2165327748"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export default dynamic(() => Promise.resolve(AdSenseComponent), { ssr: false });
