import { ProdutoTable } from "@/src/components/ProductTable";
import { produtos } from "@/src/data/products";

export const metadata = {
  title: "Gerenciar Produtos",
};

function Page() {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-[#010b62] dark:text-white">
          Gerenciar produtos
        </h1>
      </div>

      <p className="mb-10 text-md text-[#010b62] opacity-75 dark:text-white">
        Gerencie quais itens serão mostrados
      </p>

      <div>
        <div className="overflow-x-auto mt-4">
          <ProdutoTable produtos={produtos} />
        </div>
      </div>
    </div>
  );
}

export default Page;
