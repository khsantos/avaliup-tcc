export const metadata = {
  title: "Página Inicial",
};

export default function Home() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#010b62] dark:text-white">
          Bem-vindo(a) !
        </h1>
      </div>

      <p className="mt-2 text-sm text-[#010b62] opacity-75 dark:text-white">
        Navegue pelas tabs à direita para começar.
      </p>
    </div>
  );
}
