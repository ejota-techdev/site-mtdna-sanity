# MTDNA — Site institucional

Site institucional da **My Travel DNA**, construido em Next.js com Sanity como CMS.
O cliente edita todo o conteudo pelo painel; o site em si e React.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS 4** — tokens de design definidos em `src/app/globals.css`
- **Sanity** — CMS, painel embutido em `/studio`

## Como rodar

Pre-requisito: **Node.js 20 ou superior**.

```bash
npm install
cp .env.local.example .env.local   # e preencha os valores
npm run dev
```

- Site: http://localhost:3000
- Painel de conteudo: http://localhost:3000/studio

> **Nunca rode `npm run build` com o `npm run dev` ligado.**
> Os dois escrevem na mesma pasta `.next`: o build a reescreve e o servidor de
> desenvolvimento passa a apontar para arquivos que deixaram de existir,
> derrubando todas as rotas com erro 500. Se acontecer, pare o dev,
> apague `.next` e suba de novo.

### Variaveis de ambiente

Criar o projeto em [sanity.io/manage](https://www.sanity.io/manage) e copiar o
Project ID. O token de escrita (role **Editor**) e usado apenas no servidor,
para gravar os envios do formulario de contato — nunca deve ir para o browser.

## Rotas

| Rota | Conteúdo |
|---|---|
| `/` | Home |
| `/marcas` | Listagem das marcas |
| `/marcas/[slug]` | Página da marca (Europcar, Goldcar, Unlock) |
| `/publicacoes` | Listagem paginada |
| `/publicacoes/[slug]` | Artigo |
| `/sobre` · `/sobre-nosotros` · `/about` | Sobre Nós (PT · ES · EN) |
| `/contato` | Contato |
| `/studio` | Painel do Sanity |
| `/api/contato` | Recebe o formulário e grava no CMS |

## Scripts auxiliares

```bash
node scripts/seed.mjs                        # cria só o que falta — não toca no que existe
node scripts/seed.mjs --sobrescrever         # DESTRUTIVO: volta tudo ao conteúdo original
node scripts/mensagens.mjs                   # lista as mensagens recebidas
node scripts/mensagens.mjs --limpar-testes   # remove registros de teste
```

> **Atenção ao `--sobrescrever`.**
> Ele substitui os documentos inteiros pelo conteúdo do script, apagando
> qualquer edição feita no painel. O modo padrão preserva o que já existe.
> Se alguma coisa for perdida, o Sanity guarda histórico: no Studio, abra o
> documento e use o menu de contexto (⋯) para restaurar uma revisão anterior.

## Estrutura

```
src/
  app/                 rotas (App Router)
    studio/            painel do Sanity embutido
  sanity/
    schemaTypes/
      documents/       tipos de conteudo (paginas, marcas, publicacoes)
      objects/         blocos reutilizaveis (botao, imagem, texto rico)
    lib/               cliente e helper de imagem
    structure.ts       organizacao do menu do painel
```

## Modelo de conteudo

| Tipo | O que e | Quantos |
|---|---|---|
| `homePage` | Home | 1 (unico) |
| `contactPage` | Pagina de Contato | 1 (unico) |
| `siteSettings` | Logo, contatos, rodape | 1 (unico) |
| `aboutPage` | Sobre Nos | 3 — um por idioma (PT/ES/EN) |
| `brand` | Marca parceira | 3 — Europcar, Goldcar, Unlock |
| `post` | Publicacao | ilimitado |
| `contactSubmission` | Mensagem do formulario | gerado pelo site |

Decisoes que valem registrar:

- **Idiomas**: so a pagina "Sobre Nos" e traduzida — e o unico lugar do
  wireframe com dropdown de idioma. O resto do site e em portugues.
- **Marcas e publicacoes na Home** nao sao editadas dentro da Home: vem dos
  seus proprios documentos, para o cliente editar cada coisa em um lugar so.
- **Mensagens de contato** sao somente leitura no painel, para ninguem editar
  um lead por engano.

## Design tokens

Extraidos do arquivo Figma "My Travel DNA - Wireframes".

| Token | Hex |
|---|---|
| `brand-yellow` | `#F4C70B` |
| `brand-navy` | `#002132` |
| `brand-teal` | `#10485B` |
| `brand-coral` | `#FF8877` |
| `brand-cream` | `#F7EDE5` |

Tipografia: **Roboto**, auto-hospedada em `public/fonts` via `next/font/local`.
Não usamos `next/font/google` porque o download em tempo de build falhava por
timeout — o que quebraria um deploy em rede instável.

Os utilitários `corner-br-flat`, `corner-bl-flat` e `corner-tr-flat` reproduzem
o padrão recorrente do layout: três cantos arredondados e um reto.

## Imagens

O `next/image` usa um loader próprio (`src/sanity/lib/imageLoader.ts`) em vez do
otimizador padrão do Next. Dois motivos:

1. O CDN do Sanity já redimensiona e converte formato por parâmetro de URL.
   Deixar o Next baixar cada imagem para reprocessar era um hop redundante — e
   falhava com 500 sempre que a rede oscilava.
2. O loader lê as dimensões originais do nome do arquivo (`...-374x120.png`) e
   nunca pede uma largura maior que a original. Sem isso, o `srcset` chegava a
   pedir 3840px para um logo de 374px.

Imagens de `/public` (ícones, mapa) usam `unoptimized` — são estáticas e não
precisam de redimensionamento.

## Pendências conhecidas

- **Logo**: extraído dos renders do Figma (os wireframes não trazem um arquivo
  isolado). O do cabeçalho tem fundo branco e o do rodapé fundo petróleo —
  compõem corretamente onde estão, mas o ideal é receber o SVG original do
  cliente.
- **Mapa de Portugal** (página da Unlock): é uma imagem rasterizada, com os
  nomes das localidades gravados nos pixels. Por isso a lista de destinos
  continua no schema e é renderizada como `figcaption` invisível — sem ela,
  leitor de tela não alcançaria nenhum nome. Se um dia surgir o vetor de
  verdade, dá para trocar por texto real.
- **Marca d'água da newsletter**: aproximação em CSS, não o vetor do Figma.
- Algumas imagens são substitutos plausíveis, não os originais do wireframe.
  Trocar leva três cliques no painel.
