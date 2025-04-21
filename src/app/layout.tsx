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
    <html lang="en" suppressHydrationWarning className={ubuntu.variable}>
      <head />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
