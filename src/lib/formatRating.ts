export const formatRating = (rating: number | null | undefined) => {
  if (rating == null) return "0.0";
  return rating.toFixed(1);
};
