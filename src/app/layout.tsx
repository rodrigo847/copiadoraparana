import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const headingFont = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://copiadoraparana.com.br"),
  title: {
    default: "Paraná Laser Copy | Copiadora Paraná Laser",
    template: "%s | Paraná Laser Copy",
  },
  description:
    "Gráfica rápida em Curitiba com produção ágil, atendimento consultivo e soluções para impressão gráfica, materiais corporativos e projetos visuais.",
  applicationName: "Paraná Laser Copy",
  keywords: [
    "copiadora Paraná Laser",
    "impressão gráfica Curitiba",
    "copiadora Curitiba",
    "materiais gráficos",
    "impressão digital",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://copiadoraparana.com.br",
    siteName: "Paraná Laser Copy",
    title: "Paraná Laser Copy | Copiadora Paraná Laser",
    description:
      "Soluções gráficas em tempo recorde para empresas, profissionais e demandas sob medida em Curitiba.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paraná Laser Copy | Copiadora Paraná Laser",
    description:
      "Produção gráfica com agilidade, acabamento profissional e atendimento local em Curitiba.",
  },
  icons: {
    icon: [{ url: "/favicon.webp", type: "image/webp" }],
    shortcut: "/favicon.webp",
    apple: "/favicon.webp",
  },
  category: "printing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${headingFont.variable} ${bodyFont.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
