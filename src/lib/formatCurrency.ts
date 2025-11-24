export function formatCurrencyBRL(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "";

  let num = Number(value);

  if (num >= 1000) {
    num = num / 1000;
  }

  return num.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}
