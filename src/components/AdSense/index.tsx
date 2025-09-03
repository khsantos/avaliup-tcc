"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

function AdSenseComponent() {
  useEffect(() => {
    try {
      // @ts-expect-error adsbygoogle pode não estar definido
      (window.adsbygoogle = window.adsbygoogle || []).push({});
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
          height: "90px",
        }}
        data-ad-client="ca-pub-8840751358865151"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

// 🔥 Só renderiza no client
export default dynamic(() => Promise.resolve(AdSenseComponent), {
  ssr: false,
});
