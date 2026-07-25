export const site = {
  name: "Paraná Laser Copy",
  shortName: "Paraná Laser",
  domain: "https://copiadoraparana.com.br",
  description:
    "Gráfica rápida em Curitiba com soluções gráficas em tempo recorde para materiais corporativos, projetos visuais e produção sob demanda.",
  phoneDisplay: "(41) 3078-2039",
  phoneHref: "tel:+554130782039",
  whatsappDisplay: "(41) 99679-9517",
  whatsappHref:
    "https://wa.me/5541996799517?text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20falar%20sobre%20um%20projeto.",
  email: "contato@copiadoraparanalaser.com.br",
  financialEmail: "financeiro@copiadoraparanalaser.com.br",
  financialEmailHref:
    "mailto:financeiro@copiadoraparanalaser.com.br?subject=Solicitacao%20de%20cadastro%20comercial&body=Ola%2C%20gostaria%20de%20solicitar%20cadastro%20comercial.%0A%0AEmpresa%3A%0ACNPJ%3A%0AResponsavel%3A%0ATelefone%3A%0AEmail%3A%0A",
  instagram: "https://www.instagram.com/copiadoraparanalaser/",
  googleMapsDirections:
    "https://www.google.com/maps/dir/?api=1&destination=Rua+Teixeira+Coelho,+61,+Batel,+Curitiba+-+PR,+80420-030",
  wazeDirections:
    "https://www.waze.com/ul?q=Rua%20Teixeira%20Coelho%2061%20Batel%20Curitiba&navigate=yes",
  address: {
    street: "Rua Teixeira Coelho, 61",
    district: "Batel",
    city: "Curitiba",
    region: "PR",
    postalCode: "80420-030",
    country: "BR",
  },
  openingHours: ["Mo-Fr 09:00-18:00", "Sa 09:00-12:00"],
};

export const navLinks = [
  { href: "/#inicio", label: "Home" },
  { href: "/#servicos", label: "Serviços" },
  { href: "/#projetos", label: "Projetos" },
  { href: "/#quem-somos", label: "Quem Somos" },
  { href: "/#perguntas-frequentes", label: "Perguntas +" },
  { href: "/#contato", label: "Contato" },
  { href: "/orcafacil", label: "Orça Fácil" },
];

export const highlights = [
  "Atendimento Corporativo, faturamos para empresas!",
  "Produção ágil com foco em prazo, legibilidade e acabamento",
  "Estrutura pensada para arquivos, materiais impressos",
];

export const services = [
  {
    title: "Impressão",
    backgroundImage: "/img/banner.jpg",
    description:
      "Papéis especiais, de gramatura variada, de 75g/m² a 300g/m², para apresentação comercial e materiais institucionais com produção rápida e orientação técnica.",
  },
  {
    title: "Eventos! Entre em contato...",
    backgroundImage: "/img/material_evento.png",
    description:
      "Soluções em impressão de Crachás, Canetas e Material didático para campanhas internas, eventos e pontos de contato com clientes.",
  },
  {
    title: "Material",
    backgroundImage: "/img/folder.jpg",
    description:
      "Hoje com a evolução de ferramentas de design, recebemos arquivos de diversos tipos: Imagens, Canva, PDFs...",
  },
  {
    title: "Acabamento",
    backgroundImage: "/img/acabamentos.png",
    description:
      "Atenção ao resultado final para que o material entregue tenha leitura clara, presença profissional e boa durabilidade.",
  },
];

export type ServiceLandingPage = {
  slug: string;
  title: string;
  headline: string;
  metaDescription: string;
  summary: string;
  keywords: string[];
  highlights: string[];
};

export const serviceLandingPages: ServiceLandingPage[] = [
  {
    slug: "impressao-digital-curitiba",
    title: "Gráfica Rápida e Impressão Digital em Curitiba",
    headline: "Gráfica rápida em Curitiba com impressão digital, impressão a laser e impressão colorida",
    metaDescription:
      "Gráfica rápida e impressão digital em Curitiba com impressão a laser, impressão colorida, materiais promocionais e produção ágil para empresas e clientes finais.",
    summary:
      "Atendemos demandas de impressão digital, impressão a laser, impressão colorida e materiais comerciais com orientação técnica sobre papéis, gramaturas, acabamento e formatos como impressão A3.",
    keywords: ["gráfica rápida curitiba", "impressão digital curitiba", "impressão a laser", "impressão colorida", "copiadora curitiba", "impressão a3"],
    highlights: [
      "Materiais em diversas gramaturas",
      "Atendimento para empresas, profissionais e demandas urgentes",
      "Produção com foco em prazo, legibilidade e acabamento",
    ],
  },
  {
    slug: "adesivos-personalizados-curitiba",
    title: "Gráfica para Adesivos em Curitiba",
    headline: "Gráfica para adesivos com recorte eletrônico, rótulos e etiquetas personalizadas",
    metaDescription:
      "Gráfica para adesivos em Curitiba com adesivo recorte, rótulos, etiquetas e materiais para vitrine, embalagem e comunicação visual.",
    summary:
      "Produzimos adesivos personalizados, adesivo com recorte, rótulos e etiquetas para marca, embalagem, vitrine e ações promocionais com formatos variados.",
    keywords: ["gráfica para adesivos", "adesivos personalizados curitiba", "adesivo recorte", "rótulos curitiba", "etiquetas personalizadas", "adesivo plotagem"],
    highlights: [
      "Recorte eletrônico para formatos customizados",
      "Aplicação em produtos e pontos de venda",
      "Materiais para campanhas promocionais e comunicação visual",
    ],
  },
  {
    slug: "banners-rollups-curitiba",
    title: "Banners e Faixas em Curitiba",
    headline: "Impressão de banners e faixas para eventos, lojas e campanhas",
    metaDescription:
      "Banners e faixas em Curitiba com impressão de banners para eventos, feiras, lojas e campanhas promocionais com acabamento técnico.",
    summary:
      "Produção de banners, faixas e peças de comunicação visual com opções de tamanho, estrutura, ilhós, madeira e acabamento conforme o ambiente.",
    keywords: ["banners e faixas", "impressão de banners", "banner curitiba", "banner", "faixas e banners", "comunicação visual curitiba"],
    highlights: [
      "Opções para uso interno e externo",
      "Acabamentos com ilhós e estrutura",
      "Ideal para eventos, campanhas e sinalização",
    ],
  },
  {
    slug: "encadernacao-curitiba",
    title: "Impressão de Apostilas e Encadernação em Curitiba",
    headline: "Impressão de apostilas, relatórios e encadernações para uso técnico e acadêmico",
    metaDescription:
      "Impressão de apostilas e encadernação em Curitiba com opções de espiral, capa e formatos para documentos corporativos, técnicos e acadêmicos.",
    summary:
      "Organizamos apostilas, relatórios e materiais didáticos com apresentação profissional para uso interno, entrega a clientes e demandas acadêmicas.",
    keywords: ["impressão de apostilas", "encadernação curitiba", "apostilas curitiba", "impressão relatório curitiba"],
    highlights: [
      "Opções de espiral, capas e montagem",
      "Capas Duras para TCC, livros e relatórios",
    ],
  },
  {
    slug: "plotagem-curitiba",
    title: "Plotagem e Impressão A3 em Curitiba",
    headline: "Serviço de plotagem, plotagem gráfica e impressão A3 em Curitiba",
    metaDescription:
      "Serviço de plotagem e impressão A3 em Curitiba para plantas, pranchas e projetos de engenharia e arquitetura com contraste e nitidez.",
    summary:
      "Executamos plotagem gráfica e impressão de grandes formatos para engenharia e arquitetura, do tamanho A3 até A0, com leitura técnica precisa.",
    keywords: ["plotagem curitiba", "serviço de plotagem", "plotagem grafica", "impressão a3", "plotagem engenharia curitiba", "plotagem arquitetura curitiba"],
    highlights: [
      "Impressão e acabamento para grandes formatos",
      "Escanners e envio de arquivos por email em PDF",
      "Fotocopias de plantas, projetos técnicos e pranchas",
    ],
  },
  {
    slug: "papelaria-corporativa-curitiba",
    title: "Panfletos, Flyers e Papelaria Corporativa em Curitiba",
    headline: "Panfletos, flyers, cartões e papelaria corporativa para empresas",
    metaDescription:
      "Panfletos, flyers e papelaria corporativa em Curitiba com cartões de visita, papel timbrado e materiais institucionais para fortalecer a marca.",
    summary:
      "Produzimos panfletos, flyers, cartões de visita, papel timbrado e materiais de identidade visual para vendas, divulgação e comunicação profissional.",
    keywords: ["panfletos", "impressão flyer", "panfletos personalizados", "papelaria corporativa curitiba", "cartão de visita curitiba", "papel timbrado curitiba"],
    highlights: [
      "Panfletos e flyers para divulgação rápida",
      "Padrão visual alinhado a marca",
      "Apoio para vendas e apresentações",
    ],
  },
  {
    slug: "crachas-e-brindes-curitiba",
    title: "Crachás e Brindes em Curitiba",
    headline: "Crachás, canetas e itens promocionais para eventos e empresas",
    metaDescription:
      "Crachás e credenciais personalizados e brindes em Curitiba para eventos, equipes e ações de relacionamento com clientes.",
    summary:
      "Materiais de identificação e promoção para feiras, treinamentos, campanhas internas e experiências de marca.",
    keywords: ["crachás curitiba", "credenciais curitiba", "credenciais eventos", "brindes personalizados curitiba", "canetas personalizadas curitiba"],
    highlights: [
      "Identificação visual para equipes",
      "Brindes corporativos para campanhas",
      "Soluções para eventos e credenciamento",
    ],
  },
];

export const projectSteps = [
  {
    title: "A Idéia e o arquivo",
    description: "Devido a muitas ferramentas e idéias diversas, nosso time até o momento só recebe os arquivos prontos para impressão, não mexemos com a arte.",
  },
  {
    title: "Validação técnica",
    description: "Nosso time confere e valida antes de produzir, *Nota: Salve os arquivos em CMYK!!! Bitmap, RGB ou IMG geralmente ficam escuras!",
  },
  {
    title: "Execução",
    description: "Após a aprovação, iniciamos a impressão com controle de qualidade em cada etapa para garantir fidelidade no resultado.",
  },
  {
    title: "Entrega com prazo definido",
    description: "Finalizamos com transparência no andamento e foco em entrega confiável.",
  },
];

export const mostRequested = [
  {
    title: "Adesivos, rótulos e etiquetas",
    demand: "Adesivos com recorte eletrônico",
    description: "Muito usados para embalagem, branding de produto e comunicação no ponto de venda.",
  },
  {
    title: "Banners e Roll-ups",
    demand: "Acabamentos em madeira e ilhós para eventos e pontos de venda",
    description: "Ideal para Eventos, feiras e sinalização de loja, com opções de tamanhos e materiais resistentes para uso interno e externo.",
  },
  {
    title: "Cartões de visita especiais",
    demand: "Cartões de visita especiais couche 300gm² verniz localizado...",
    description: "Os classicos cartões de visita, nunca saem de moda!",
  },
  {
    title: "Encadernações",
    demand: "Uso frequente em TCCs e relatórios",
    description: "Opções de espiral, capa dura e brochura para organizar documentos técnicos e comerciais.",
  },
  {
    title: "Carimbos personalizados",
    demand: "Alta saída para escritórios e profissionais",
    description: "Aplicações rápidas para identificação, assinaturas e processos internos.",
  },
  {
    title: "Plotagens de engenharia e arquitetura",
    demand: "Procura forte em projetos e obras",
    description: "Impressão de plantas e pranchas com leitura precisa e bom contraste.",
  },
  {
    title: "Flyers, folders e panfletos",
    demand: "Um dos impressos promocionais mais vendidos",
    description: "Formatos de distribuição rápida para campanhas, eventos e promoções locais.",
  },
  {
    title: "Papel timbrado",
    demand: "Muito usado por empresas e escritórios",
    description: "Identidade visual profissional para propostas, contratos e comunicação institucional.",
  },
  {
    title: "Calendário",
    demand: "Alta procura em ações promocionais sazonais",
    description: "Material útil para marcação de datas e fortalecimento de marca ao longo do ano.",
  },
  {
    title: "Crachás e Credenciais em PS ou PVC",
    demand: "Muito usados em eventos, empresas e credenciamento",
    description: "Identificação visual com acabamento limpo para equipes, visitantes e ações promocionais.",
  },
  {
    title: "Canetas personalizadas",
    demand: "Brindes corporativos e ações promocionais",
    description: "Ótimas para eventos, kits institucionais e campanhas de relacionamento com clientes.",
  },
  {
    title: "Displays de mesa",
    demand: "Apoio visual de alto giro em balcões e recepções",
    description: "Muito utilizado para Pix, QR Codes e informações de contato em pontos de atendimento e vendas.",
  },
  {
    title: "Caixas em acrílico",
    demand: "Alta procura para rifas, sorteios e ações promocionais",
    description: "Produção de caixas em acrílico para urnas de votação, captação de cupons e campanhas em eventos e pontos de venda.",
  },
  {
    title: "Wobblers promocionais",
    demand: "Muito usados para chamar atenção no PDV",
    description: "Material de destaque para prateleiras e gôndolas, ideal para campanhas e lançamentos.",
  },
];

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  image: `${site.domain}/opengraph-image`,
  url: site.domain,
  telephone: "+55 41 3078-2039",
  email: site.email,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.street}, ${site.address.district}`,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  sameAs: [site.instagram],
  openingHours: site.openingHours,
  areaServed: "Curitiba e região metropolitana",
  description: site.description,
};

export const serviceCatalogJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Serviços e produtos de impressão em Curitiba",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: mostRequested.length,
  itemListElement: mostRequested.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.title,
    description: item.description,
  })),
};

export const faqEntries = [
  {
    question: "Quais serviços a Paraná Laser Copy oferece em Curitiba?",
    answer:
      "Oferecemos impressão digital/laser, materiais institucionais, adesivos com meio corte: transparente, fosco e brilho, banners, encadernações, impressão em materiais rígidos como acrílico e MDF; Papeis especiais de alta gramatura.",
  },
  {
    question: "Vocês atendem empresas com faturamento?",
    answer:
      "Sim. Atendemos empresas que precisam de materiais e prazo para pagamentos. Faturamos para empresas, com emissão de nota fiscal e condições comerciais flexíveis via boleto ou cartão de crédito.",
  },
  {
    question: "Como solicitar orçamento de impressão?",
    answer:
      "Você pode solicitar orçamento pelo WhatsApp 4199679-9517, email: contato@copiadoraparanalaser.com.br ou presencialmente em nossa loja na rua Teixeira Coelho, 61, Batel, Curitiba - PR.",
  },
  {
    question: "Como devo enviar meus arquivos para impressão?",
    answer:
      "Os arquivos devem ser enviados preferencialmente em PDF e as imagens em alta resolução. Mas aceitamos word, excel, canvas, jpg, png... Nosso time confere e valida antes de produzir. Salve os arquivos em CMYK e x1a para obter melhores resultados!!! Bitmap, RGB ou IMG geralmente ficam escuras!",
  },
  {
    question: "Qual o melhor adesivo para uso interno e externo?",
    answer:
      "Atualmente trabalhamos com adesivos Vinil Brilho e Fosco e Transparente de alta resistência a água e luz, adequados para uso interno e externo. Consulte nosso time para escolher a melhor opção para seu projeto.",
  },
];

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqEntries.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: entry.answer,
    },
  })),
};
