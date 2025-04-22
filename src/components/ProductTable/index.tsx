"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Star, ArrowDown, ArrowUp } from "lucide-react";
import { Products } from "@/src/types/Products";
import Image from "next/image";
import { useState } from "react";

type ProdutoTableProps = {
  produtos: Products[];
};

export function ProdutoTable({ produtos }: ProdutoTableProps) {
  const [sortColumn, setSortColumn] = useState<keyof Products | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: keyof Products) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedProducts = [...produtos].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(String(bValue))
        : String(bValue).localeCompare(aValue);
    }

    if (typeof aValue === "number") {
      return sortDirection === "asc"
        ? aValue - Number(bValue)
        : Number(bValue) - aValue;
    }

    return 0;
  });

  const renderSortIcon = (column: keyof Products) => {
    if (sortColumn !== column) return null;

    return sortDirection === "asc" ? (
      <ArrowUp className="inline w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="inline w-4 h-4 ml-1" />
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-[#010B62] dark:text-white">
            Imagem
          </TableHead>
          <TableHead
            className="text-[#010B62] dark:text-white cursor-pointer select-none"
            onClick={() => handleSort("nome")}
          >
            Nome {renderSortIcon("nome")}
          </TableHead>
          <TableHead
            className="text-[#010B62] dark:text-white cursor-pointer select-none"
            onClick={() => handleSort("categoria")}
          >
            Categoria {renderSortIcon("categoria")}
          </TableHead>
          <TableHead
            className="text-[#010B62] dark:text-white cursor-pointer select-none"
            onClick={() => handleSort("subcategoria")}
          >
            Subcategoria {renderSortIcon("subcategoria")}
          </TableHead>
          <TableHead
            className="text-[#010B62] dark:text-white cursor-pointer select-none"
            onClick={() => handleSort("nota")}
          >
            Nota Geral {renderSortIcon("nota")}
          </TableHead>
          <TableHead className="text-[#010B62] dark:text-white">
            Ativo
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {sortedProducts.map((produto) => (
          <TableRow key={produto.id}>
            <TableCell>
              <Image
                src={produto.imagem}
                alt={produto.categoria}
                width={60}
                height={40}
                className="rounded w-16 h-16 object-cover"
              />
            </TableCell>
            <TableCell className="pl-10">{produto.nome}</TableCell>
            <TableCell>{produto.categoria}</TableCell>
            <TableCell>{produto.subcategoria}</TableCell>
            <TableCell className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              {produto.nota}
            </TableCell>
            <TableCell>
              <Checkbox
                checked={produto.ativo}
                className="border-gray-800 dark:border-gray-50"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
