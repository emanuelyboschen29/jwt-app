This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Usuários e permissões locais

O cadastro, login, sessões e papéis são gerenciados neste projeto usando SQLite embutido no Node.js. Use Node.js 24 ou superior. A base local é criada em `data/auth.sqlite` e não deve ser commitada.

Para criar o primeiro administrador, configure estas variáveis no `.env` local antes de iniciar a aplicação:

```env
BOOTSTRAP_ADMIN_EMAIL=admin@example.com
BOOTSTRAP_ADMIN_PASSWORD=use-uma-senha-aleatoria-com-16-caracteres-ou-mais
```

O administrador inicial é criado quando a aplicação acessa a base pela primeira vez. Cadastros públicos recebem sempre o papel **Leitor**. Na opção **Usuários**, administradores podem atribuir os papéis **Administrador**, **Bibliotecário** ou **Leitor**. Leitores não acessam as telas de gerenciamento; bibliotecários gerenciam o acervo, leitores e empréstimos.

Os dados ficam na máquina/servidor que executa a aplicação. Em produção com uma única instância, mantenha `data/auth.sqlite` em um volume persistente; `AUTH_DATABASE_PATH` permite escolher outro caminho. Para executar múltiplas instâncias, use um banco de dados gerenciado em vez de compartilhar um arquivo SQLite.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
