export default function normalizePrice(value: number | string): number {
  const num = Number(value);
  if (isNaN(num)) return 0;

  if (!Number.isInteger(num)) {
    return num;
  }

  const digits = num.toString().length;

  if (digits >= 4 && digits <= 6) {
    return num / 100;
  }

  return num;
}
