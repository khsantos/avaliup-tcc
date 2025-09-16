import { Toaster } from "@/src/components/ui/sonner";
import "./globals.css";
import { Providers } from "./providers";
import { Ubuntu_Sans } from "next/font/google";
import Script from "next/script";

const ubuntuSans = Ubuntu_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ubuntu-sans",
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
    <html lang="pt-br" suppressHydrationWarning className={ubuntuSans.variable}>
      <head>
        <link rel="icon" href="/logo-avaliup.svg" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <main className="flex-grow">
            {children}
            <Toaster />
          </main>
        </Providers>

        <Script
          id="adsense-script"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8840751358865151"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
