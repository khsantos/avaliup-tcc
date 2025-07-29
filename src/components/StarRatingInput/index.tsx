"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
}

export default function StarRatingInput({
  value,
  onChange,
  size = 20,
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
        >
          <Star
            className={`transition-colors ${
              (hovered || value) >= star
                ? "fill-[#FFB24B] text-[#FFB24B]"
                : "text-[#FFB24B]"
            }`}
            style={{ width: size, height: size }}
          />
        </button>
      ))}
    </div>
  );
}
