# Paraná Laser Copy

Projeto institucional em Next.js para substituir o site atual em WordPress por uma base mais moderna, rápida e preparada para SEO local.

## Stack

- Next.js com App Router
- TypeScript
- Tailwind CSS v4

## Estrutura do projeto

- `src/app`: rotas e paginas do site
- `src/components`: componentes reutilizaveis de interface
- `src/lib`: dados e configuracoes de conteudo
- `public`: arquivos estaticos (imagens, robots, sitemap)

## Fluxo simples (sem export estatico)

- `npm run dev`: desenvolvimento local
- `npm run build`: gera build de producao
- `npm run start`: sobe o servidor Next.js em producao

Nao usamos pasta `out/` nem `next export`.

## O que já está pronto

- Home institucional com identidade visual própria
- Páginas indexáveis para serviços, produtos, projetos, quem somos e contato
- Metadata por página
- JSON-LD de LocalBusiness
- sitemap.xml e robots.txt gerados pelo App Router

## Desenvolvimento

```bash
npm run dev
```

## Build de produção

```bash
npm run build
```

## Próximos conteúdos recomendados

- textos detalhados por serviço e produto
- provas sociais e projetos reais
- imagens finais da marca e dos materiais produzidos
- formulário conectado a CRM, e-mail ou WhatsApp
