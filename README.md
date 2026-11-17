# Bárbara Delivery

Site/cardápio online da **Bárbara Delivery**, feito com Next.js 16, Tailwind 4 e Motion.

## Rodando

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Como pedir

O cliente monta a sacola no site e clica em **Enviar pedido e consultar valores**. A mensagem vai pronta para o WhatsApp da Bárbara com os itens, o nome, a forma de pagamento e as observações. Os valores são combinados direto com ela; cada produto também tem um link **Consultar valor**.

## Editando o conteúdo

Todo o conteúdo fica em [`src/lib/content.ts`](src/lib/content.ts):

- **Produtos**: nome, descrição, categoria, foto, emoji, etiquetas, selo, destaque e disponibilidade
- **Categorias**: os filtros do cardápio
- **Textos e contatos**: nome, slogan, textos do topo e do "Sobre", WhatsApp, Instagram, horário e endereço
- **Depoimentos**

As fotos ficam em [`public/images/`](public/images/). Para trocar uma foto, coloque o arquivo nessa pasta e aponte o `image` do produto para ele.

As fotos de banco de imagens vêm do Wikimedia Commons; os créditos ficam em [`src/lib/photo-credits.ts`](src/lib/photo-credits.ts) e aparecem no rodapé enquanto a foto estiver em uso.

## Efeitos

Abertura animada · letras que pulam · palavra giratória "Hoje tem…" · comidas flutuando com parallax · trilha de confeitos no cursor · prato com texto circular e vapor · faixas rolantes inclinadas pelo scroll · filtros com pílula animada · cards com inclinação 3D · emoji que "voa" até a sacola · destaques em scroll horizontal · contadores animados · caminho que se desenha no scroll · depoimentos arrastáveis · botões magnéticos.

## Publicação

O site é estático (não tem banco de dados nem login), então pode ser publicado em qualquer hospedagem de Next.js, como a Vercel.
