"use client";

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
import { useTheme } from "next-themes";

export default function PriceHistoryChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="dark:bg-[#030712] bg-white text-white rounded-xl p-6 border border-[#010b62] dark:border-white w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#010b62] dark:text-white">
          Gráfico de variação do preço
        </h2>
        <select className="text-sm text-[#010b62] dark:text-[#FFFFFF] opacity-50 border-[#010b62] dark:opacity-50 border-1 dark:border-gray-700 rounded-sm w-50 h-10 p-2 py-1 bg-white dark:bg-[#030712]">
          <option>30 dias</option>
          <option>7 dias</option>
          <option>90 dias</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid
            vertical={false}
            stroke={isDark ? "#FFFFFF" : "#010b62"}
            opacity={isDark ? 0.15 : 0.25}
          />
          <XAxis
            dataKey="date"
            tick={{
              style: {
                fontSize: 12,
                fill: isDark ? "#9ca3af" : "#374151",
              },
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{
              style: {
                fontSize: 12,
                fill: isDark ? "#9ca3af" : "#374151",
              },
            }}
            tickFormatter={(value) =>
              value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }
            axisLine={false}
            tickLine={false}
            width={60}
            stroke={isDark ? "#374151" : "#e5e7eb"}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1f2937" : "#fff",
              borderColor: isDark ? "#374151" : "#ccc",
              fontSize: "12px",
              color: isDark ? "#fff" : "#000",
            }}
            formatter={(value) =>
              (value as number).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }
          />

          <Legend
            wrapperStyle={{
              fontSize: "12px",
              color: isDark ? "#ccc" : "#000",
              paddingTop: 10,
            }}
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="minorPrice"
            stroke={isDark ? "#ffffff" : "#010b62"}
            strokeWidth={2}
            dot={false}
            name="Menor preço"
          />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={false}
            name="À vista"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
