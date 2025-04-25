import Link from "next/link";

export default function ForgotPassword() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-md">
                <h2 className="text-2xl font-bold text-center text-blue-900">Recuperar senha</h2>
                <p className="text-sm text-center text-gray-600">
                    Informe o seu endereço de e-mail para que possamos enviar o link de recuperação da senha
                </p>
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
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Enviar
                    </button>
                </form>
                <div className="text-center">
                    <Link href="/" className="text-sm text-blue-600 hover:underline">
                        &larr; Voltar
                    </Link>
                </div>
            </div>
        </div>
    );
}