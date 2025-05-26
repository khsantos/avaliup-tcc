import data from "@/src/data/priceHistory";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

export default function PriceHistoryChart() {
  return (
    <div className="dark:bg-zinc-900 text-white rounded-xl p-6 border border-[#010b62] dark:border-zinc-700 w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#010b62]">
          Gráfico de variação do preço
        </h2>
        <select className=" text-sm text-gray-400 border border-gray-400 rounded px-2 py-1">
          <option>30 dias</option>
          <option>7 dias</option>
          <option>90 dias</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ style: { fontSize: 12, fill: "#888" } }}
          />
          <YAxis
            tick={{ style: { fontSize: 12, fill: "#888" } }}
            tickFormatter={(value) =>
              value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }
          />
          <Tooltip
            contentStyle={{ fontSize: "12px" }} // Tooltip menor
            formatter={(value) =>
              (value as number).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }
          />
          <Legend
            wrapperStyle={{ fontSize: "12px" }} // Legenda menor
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={false}
            name="Preço"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
