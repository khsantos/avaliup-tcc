"use client";
// import { useRouter } from "next/navigation";

export default function Page() {
  // const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#030712] px-4">
      <div className="w-[345px] space-y-4 mt-8">
        <h1 className="text-2xl font-bold text-[#010B62] dark:text-white text-center">
          Termos de Uso
        </h1>
        <p className="text-sm text-[#010B62] dark:text-white">
          Última atualização: [Data]
        </p>
        <p className="text-sm text-[#010B62] dark:text-white">
          Bem-vindo ao Avali.up! Ao acessar este site, você concorda com os
          seguintes termos e condições. Leia-os com atenção antes de usar nosso
          serviço.
        </p>
        <p className="text-sm text-[#010B62] dark:text-white">
          O Avali.up é uma plataforma online para avaliação, resenha e
          comparação de periféricos de informática como teclados, mouses,
          headsets, entre outros.
        </p>
        <p className="text-sm text-[#010B62] dark:text-white">
          Ao enviar conteúdos como comentários e avaliações, você declara ser o
          autor e nos concede direito de uso e exibição pública desse conteúdo.
        </p>
        <p className="text-sm text-[#010B62] dark:text-white">
          Todo o conteúdo do site é protegido por direitos autorais. O uso
          indevido é proibido.
        </p>
        <p className="text-sm text-[#010B62] dark:text-white">
          Reservamo-nos o direito de alterar estes termos a qualquer momento.
        </p>
        <p className="text-sm text-[#010B62] dark:text-white">
          Em caso de dúvidas, entre em contato via contato@avaliup.com.
        </p>
      </div>
    </div>
  );
}
