"use client";

import dynamic from "next/dynamic";
import { useAdSense } from "@/src/hooks/useAdSense";

function AdBanner({
  height = 40,
  margin = "my-6",
}: {
  slot: string;
  height?: number;
  margin?: string;
}) {
  useAdSense();

  return (
    <div className={`w-full flex justify-center ${margin} mt-6`}>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          maxWidth: "970px",
          height: `${height}px`,
        }}
        data-ad-client="ca-pub-8840751358865151"
        data-ad-slot="2165327748"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export default dynamic(() => Promise.resolve(AdBanner), { ssr: false });
