export function formatCurrencyBRL(
  value: string | number | null | undefined
): string {
  if (value === null || value === undefined) return "";

  let str = String(value).trim();

  str = str.replace("R$", "").replace(/\s+/g, "");

  if (str.includes(",")) {
    str = str.replace(/\./g, "");
    str = str.replace(",", ".");
  }

  const num = Number(str);

  if (isNaN(num)) {
    console.warn("Valor inválido em formatCurrencyBRL:", value, "->", str);
    return "";
  }

  return num.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
