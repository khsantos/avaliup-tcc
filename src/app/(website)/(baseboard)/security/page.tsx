"use client";
// import { useRouter } from "next/navigation";

export default function Page() {
  // const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#030712] px-4">
      <div className="w-[345px] space-y-4 mt-8">
        <h1 className="text-2xl font-bold text-[#010B62] dark:text-white text-center">
          Segurança
        </h1>
        <p className="text-sm text-[#010B62] dark:text-white">
          🔒 Nosso site adota práticas rigorosas de segurança para proteger seus
          dados. Utilizamos conexão segura (HTTPS), criptografia de senhas e
          protocolos atualizados para garantir a integridade das suas
          informações. As contas de usuário são protegidas e os dados pessoais
          não são compartilhados com terceiros sem consentimento. Recomendamos o
          uso de senhas fortes e únicas para sua conta.
        </p>
        <p className="text-sm text-[#010B62] dark:text-white">
          🛒 Transparência com Afiliados Alguns links presentes em nosso site
          podem ser afiliados. Isso significa que podemos receber comissões caso
          você realize uma compra por meio deles – sem custo adicional para
          você. Essa prática nos ajuda a manter o site e continuar oferecendo
          conteúdo gratuito e imparcial.
        </p>
        <br />
        <p className="text-sm text-[#010B62] dark:text-white">
          📊 Compromisso com a Imparcialidade Todos os rankings e avaliações de
          periféricos são baseados em critérios técnicos e análises
          especializadas. Prezamos pela imparcialidade e pela experiência real
          do usuário.
        </p>
        <br />
        <p className="text-sm text-[#010B62] dark:text-white">
          Em caso de dúvidas, envie um e-mail para privacidade@avaliup.com.
        </p>
        <br />
      </div>
    </div>
  );
}
