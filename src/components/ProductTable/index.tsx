import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Star } from "lucide-react";
import { Products } from "@/src/types/Products";
import Image from "next/image";

type ProdutoTableProps = {
  produtos: Products[];
};

export function ProdutoTable({ produtos }: ProdutoTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-[#010B62] dark:text-white">
            Imagem
          </TableHead>
          <TableHead className="text-[#010B62] dark:text-white">Nome</TableHead>
          <TableHead className="text-[#010B62] dark:text-white">
            Categoria
          </TableHead>
          <TableHead className="text-[#010B62] dark:text-white">
            Subcategoria
          </TableHead>
          <TableHead className="text-[#010B62] dark:text-white">
            Nota Geral
          </TableHead>
          <TableHead className="text-[#010B62] dark:text-white">
            Ativo
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {produtos.map((produto) => (
          <TableRow key={produto.id}>
            <TableCell>
              <Image
                src={produto.imagem}
                alt={produto.categoria}
                width={60}
                height={40}
                className="rounded width-16 h-16 object-cover"
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
