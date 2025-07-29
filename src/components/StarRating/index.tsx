import { Star } from "lucide-react";

export default function StarRating({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex gap-[2px]">
      {Array.from({ length: 5 }).map((_, i) => {
        const current = i + 1;
        const fillLevel =
          rating >= current
            ? 100
            : rating > i
            ? Math.round((rating - i) * 100)
            : 0;
        return (
          <div
            key={i}
            className="relative"
            style={{ width: size, height: size }}
          >
            <Star
              className="text-[#FFB24B] dark:text-[#FFB24B] absolute"
              style={{ width: size, height: size }}
            />

            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${fillLevel}%`, height: size }}
            >
              <Star
                className="fill-[#FFB24B] text-[#FFB24B]"
                style={{ width: size, height: size }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
