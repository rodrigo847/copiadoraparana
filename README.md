# Paraná Laser Copy

Projeto institucional em Next.js para substituir o site atual em WordPress por uma base mais moderna, rápida e preparada para SEO local.

## Guia rapido de execucao

- Passo a passo para novas funcoes: PASSO-A-PASSO-NOVA-FUNCAO.txt

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
- sitemap.xml e robots.txt servidos como arquivos estaticos na raiz de public

## Desenvolvimento

```bash
npm run dev
```

## Aviso de atendimento

O modal em `src/components/site-notice-modal.tsx` informa que, a partir de
7 de novembro de 2026, não haverá atendimento aos sábados devido à adoção da
escala 5x2. O atendimento permanece de segunda a sexta-feira, das 9h às 18h.

O aviso está ativo em todas as páginas e pode ser fechado pelos botões ou pela
tecla Escape. Para desativá-lo, altere `siteNoticeEnabled` para `false` em
`src/app/layout.tsx`.

## Build de produção

```bash
npm run build
```

## Impressão UV no Orça Fácil

Na calculadora e no chat, peças com área individual de até 560 cm²
(0,056 m², equivalente a 20 × 28 cm), inclusive, têm somente a impressão UV
cobrada em dobro: R$ 190/m² em vez de R$ 95/m². O limite é pela área, portanto
formatos como 10 × 50 cm também entram na regra, independentemente da quantidade.

Acima desse limite, a impressão UV permanece em R$ 95/m². Materiais,
acabamentos, verso, produtos especiais com preço fixo e o pedido mínimo de
R$ 60 continuam com suas regras anteriores. Por isso, o total de um pedido
pequeno ainda pode ficar no mínimo de R$ 60.

Para validar a regra de preço:

```bash
node --test src/lib/orcamento-pricing.test.mjs
```

## Próximos conteúdos recomendados

- textos detalhados por serviço e produto
- provas sociais e projetos reais
- imagens finais da marca e dos materiais produzidos
- formulário conectado a CRM, e-mail ou WhatsApp
