export const metadata = {
  title: "Gerenciar Produtos",
};

function Page() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#010b62] dark:text-white">
          Gerenciar produtos
        </h1>
      </div>

      <p className="mt-2 text-md text-[#010b62] opacity-75 dark:text-white">
        Gerencie quais itens serão mostrados
      </p>
    </div>
  );
}

export default Page;
