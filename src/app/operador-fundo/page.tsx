import type { Metadata } from "next";

import { BackgroundRemovalStudio } from "@/components/background-removal-studio";

export const metadata: Metadata = {
  title: "Operador | Remoção de Fundo",
  description: "Ferramenta interna de remoção de fundo e vetorização simplificada.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OperadorFundoPage() {
  return <BackgroundRemovalStudio />;
}
