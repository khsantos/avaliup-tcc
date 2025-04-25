import Link from "next/link";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center text-blue-900">Login</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Insira seu e-mail"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Insira sua senha"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Esqueceu sua senha?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm">
            É novo no Avail.up?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Crie sua conta
            </Link>
          </p>
        </div>
        <div className="flex items-center justify-between">
          <hr className="w-full border-gray-300" />
          <span className="px-2 text-sm text-gray-500">OU</span>
          <hr className="w-full border-gray-300" />
        </div>
        <button
          type="button"
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-100"
        >
          <img
            src="/google-icon.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Google
        </button>
        <div className="text-center text-sm text-gray-500">
          <Link href="/terms" className="hover:underline">
            Termos de uso
          </Link>{" "}
          |{" "}
          <Link href="/privacy" className="hover:underline">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </div>
  );
}