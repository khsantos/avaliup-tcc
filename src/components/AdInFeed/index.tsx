"use client";

import dynamic from "next/dynamic";
import { useAdSense } from "@/src/hooks/useAdSense";

function AdInFeed({ slot }: { slot: string }) {
  useAdSense();

  return (
    <div className="w-full my-8 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          maxWidth: "728px",
          height: "90px",
        }}
        data-ad-client="ca-pub-8840751358865151"
        data-ad-slot={slot}
        data-ad-format="fluid"
        data-ad-layout-key="-gw-3+1f-3d+2z"
      />
    </div>
  );
}

export default dynamic(() => Promise.resolve(AdInFeed), { ssr: false });
