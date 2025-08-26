export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho com logo e navegação */}

      {/* Abas de navegação */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <a
                href="#"
                className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-blue-600 border-blue-600"
                aria-current="page"
              >
                Geral
              </a>
              <a
                href="/profile-general"
                className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Editar
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Perfil</h2>
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            {/* Placeholder para imagem do perfil */}
          </div>
          <div className="ml-4">
            <p className="text-lg font-semibold">
              Bem vindo(a), Alessandra Ramos!
            </p>
            <p className="text-sm text-gray-600">igormatheus@hotmail.com</p>
          </div>
        </div>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Informe seu Nome completo"
              className="w-full px-2 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Informe seu e-mail"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          <div>
            <label
              htmlFor="cpf"
              className="block text-sm font-medium text-gray-700"
            >
              CPF
            </label>
            <input
              id="cpf"
              name="cpf"
              type="text"
              placeholder="Informe seu CPF"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gênero
            </label>
            <select
              id="gender"
              name="gender"
              defaultValue="Feminino"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Feminino">Feminino</option>
              <option value="Masculino">Masculino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Informe a nova senha"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmar senha
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              placeholder="Confirme a nova senha"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50"
            >
              Salvar alterações
            </button>
            <button
              type="button"
              className="px-4 py-2 text-white bg-[#010B62] rounded-md hover:bg-[#010B62]/90"
            >
              Excluir conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
