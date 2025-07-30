import { Toaster } from "@/src/components/ui/sonner";
import Footer from "../components/Footer";
import "./globals.css";
import { Providers } from "./providers";
import { Ubuntu } from "next/font/google";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ubuntu",
});

export const metadata = {
  title: {
    default: "Avali.up",
    template: "%s | Avali.up",
  },
  description: "O melhor site para encontrar produtos de qualidade.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning className={ubuntu.variable}>
      <head>
        <link rel="icon" href="/logo-avaliup.svg" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXX"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        <Providers>
          <main className="flex-grow">
            {children}
            <Toaster />
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
