export default function formatCpf(value: string) {
  const numericValue = value.replace(/\D/g, "");

  const limitedValue = numericValue.slice(0, 11);

  return limitedValue
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}