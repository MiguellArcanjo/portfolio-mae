# Bárbara Delivery — site + gerenciador

Portfólio/cardápio online da **Bárbara Delivery** (Next.js 16 + Tailwind 4 + Motion), com um **gerenciador** em `/admin` para editar tudo sem mexer em código.

## Rodando

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Gerenciador: http://localhost:3000/admin (senha definida em `.env.local`)

Copie `.env.example` para `.env.local` e defina `ADMIN_PASSWORD` e `SESSION_SECRET`.

## O que dá pra gerenciar

| Tela | O que faz |
| --- | --- |
| **Produtos** | criar, editar, excluir, foto (upload), preço, emoji, selo, ingredientes, ordem, destaque ⭐ e esgotado 👁 |
| **Categorias** | criar, renomear, emoji, reordenar (viram os filtros do cardápio) |
| **Depoimentos** | adicionar, editar, nota, ocultar/mostrar, excluir |
| **Configurações** | nome, slogan, textos do topo e do "Sobre", palavras que giram, faixa rolante, fotos, números animados, WhatsApp, Instagram, horário, endereço, aviso de entrega |

## Efeitos do site

Abertura animada · letras que pulam · palavra giratória "Hoje tem…" · comidas flutuando com parallax do mouse · trilha de confeitos no cursor · prato com texto circular e vapor · faixas rolantes inclinadas pelo scroll · filtros com pílula animada · cards com inclinação 3D e brilho · emoji que "voa" até a sacola · destaques em scroll horizontal fixo · contadores animados · caminho que se desenha no scroll · bilhetinhos de depoimento arrastáveis · botões magnéticos · textura de grão.

## Pedidos

O cliente monta a sacola no site e clica em **Enviar pedido no WhatsApp** — a mensagem já vai pronta com itens, total, nome, endereço, pagamento e observações para o número configurado.

## Dados

Tudo fica em `data/db.json` (criado automaticamente na primeira execução a partir de `src/lib/seed.ts`) e as fotos em `data/uploads/`. Ambos estão no `.gitignore`.

> **Hospedagem:** como os dados ficam em arquivos, use um servidor com disco persistente (VPS, Railway, Render com disco, etc.). Em hospedagens serverless (ex.: Vercel) as alterações feitas no gerenciador não persistem — nesse caso seria preciso trocar `src/lib/db.ts` por um banco (Supabase, Postgres…).
