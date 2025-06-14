export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#030712] px-4">
            <div className="w-[345px] space-y-4 mt-8">
                <h1 className="text-2xl font-bold text-[#010B62] dark:text-white text-center">
                    Política de Privacidade
                </h1>
                <p className="text-sm text-[#010B62] dark:text-white">
                    Última atualização: [Data]
                </p>
                <p className="text-sm text-[#010B62] dark:text-white">
                    Esta Política explica como coletamos, usamos e protegemos suas informações ao usar o Avali.up.
                </p>
                <p className="text-sm text-[#010B62] dark:text-white">
                    Coletamos dados como e-mail e IP para melhorar sua experiência e manter a segurança da plataforma.
                </p>
                <p className="text-sm text-[#010B62] dark:text-white">
                    Não compartilhamos seus dados com terceiros, exceto se exigido por lei.
                </p>
                <p className="text-sm text-[#010B62] dark:text-white">
                    Você pode solicitar a exclusão ou alteração de seus dados a qualquer momento.
                </p>
                <p className="text-sm text-[#010B62] dark:text-white">
                    Em caso de dúvidas, envie um e-mail para privacidade@avaliup.com.
                </p>
            </div>
        </div>
    )
}