interface ProductPriceProps {
  lowestPrice?: number;
  lowestPlatform?: string;
}

export default function ProductPrice({
  lowestPrice,
  lowestPlatform,
}: ProductPriceProps) {
  if (!lowestPrice) {
    return (
      <div className="mt-2 text-gray-500 dark:text-gray-400">
        Nenhum preço disponível ainda
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="text-2xl font-bold text-[#010b62] dark:text-white">
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
        }).format(lowestPrice)}{" "}
        <span className="text-base">à vista</span>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300 font-light">
        menor preço atual {lowestPlatform && `na ${lowestPlatform}`}
      </div>
    </div>
  );
}
