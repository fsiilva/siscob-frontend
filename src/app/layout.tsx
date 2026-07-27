import type { Metadata } from "next";

import { MainLayout } from "@/components/layout/main-layout";
import { Providers } from "@/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "SisCob",
  description: "Sistema de cobrança",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
