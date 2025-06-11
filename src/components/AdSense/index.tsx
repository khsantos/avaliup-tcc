"use client";

import { useEffect } from "react";

export default function AdSense() {
  useEffect(() => {
    try {
      // @ts-expect-error: adsbygoogle might not be defined yet
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
        data-ad-client="ca-pub-XXXXXXXXXXXXXXX" // <-- substitua com seu ID real
        data-ad-slot="1234567890" // <-- substitua com seu slot real
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  );
}
