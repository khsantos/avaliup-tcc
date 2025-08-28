export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Cabeçalho com logo e navegação */}

      {/* Abas de navegação */}
      <div className=" shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <a
                href="#"
                className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-500 dark:text-white "
                aria-current="page"
              >
                Geral
              </a>
              <a
                href="/profile-general"
                className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm  dark:text-white  text-[#010B62] hover:text-gray-700 hover:border-gray-300"
              >
                Editar
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto p-8 shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-6">Perfil</h2>
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 bg-[#e3eafc] rounded-xl flex items-center justify-center mr-6 border-2 border-[#bfc8e6]">
            {/* Avatar SVG */}
            <svg width="64" height="64" viewBox="0 0 80 80">
              <circle cx="40" cy="32" r="24" fill="#bfc8e6" />
              <rect x="16" y="56" width="48" height="18" rx="9" fill="#bfc8e6" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-lg text-gray-600 dark:text-white ">
              Bem vindo(a)
            </p>
            <p className="text-sm text-gray-600 dark:text-white">igormatheus@hotmail.com</p>
          </div>
        </div>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium dark:text-white text-gray-700"
            >
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Informe seu Nome completo"
              className="w-full px-2 py-2 mt-1 border rounded-md focus:outline-none border-white dark:text-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700  dark:text-white"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Informe seu e-mail"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none border-white dark:text-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          <div>
            <label
              htmlFor="cpf"
              className="block text-sm font-medium dark:text-white text-gray-700"
            >
              CPF
            </label>
            <input
              id="cpf"
              name="cpf"
              type="text"
              placeholder="Informe seu CPF"
              className="w-full px-3 py-2 mt-1 border dark:text-white border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium dark:text-white text-gray-700"
            >
              Gênero
            </label>
            <select
              id="gender"
              name="gender"
              defaultValue="Feminino"
              className="w-full px-3 py-2 mt-1 dark:text-white border dark:bg-[#030712] text-gray-700 rounded-md  border-white"
            >
              <option value="Feminino">Feminino</option>
              <option value="Masculino">Masculino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium dark:text-white text-gray-700"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Informe a nova senha"
              className="w-full px-3 py-2 mt-1 border border-white dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium dark:text-white text-gray-700"
            >
              Confirmar senha
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              placeholder="Confirme a nova senha"
              className="w-full px-3 py-2 mt-1 border rounded-md border-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 text-blue-600 border cursor-pointer dark:hover:bg-[#33C9F2] dark:text-white border-blue-600 rounded-md hover:bg-blue-50"
            >
              Salvar alterações
            </button>
            <button
              type="button"
              className="px-4 py-2 text-white  cursor-pointer bg-[#e40d0d] rounded-md hover:bg-[#010B62]/90"
            >
              Excluir conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
