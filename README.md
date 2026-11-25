# Sistema de Biblioteca

Aplicação web em Next.js para autenticação e gerenciamento de uma biblioteca integrada a uma API REST.

## Requisitos

- Node.js 24 ou superior
- API da biblioteca em execução
- SQLite (já incluído pela aplicação)

## Configuração

Crie o arquivo `.env` na raiz do projeto:

```env
API_URL=http://localhost:3000/v1

admin_email=admin@example.com
admin_password=use-uma-senha-aleatoria-com-16-caracteres-ou-mais

# Opcional
AUTH_DATABASE_PATH=data/auth.sqlite
```

O usuário administrador é criado na primeira inicialização da aplicação.

## Instalação e execução

```bash
npm install
npm run dev
```

Acesse `http://localhost:3001`.

## Perfis

- **Administrador:** gerencia usuários, categorias, autores, livros e relatórios.
- **Atendente:** gerencia leitores, empréstimos e devoluções.

## Funcionalidades

- Login e controle de sessão
- Logout com revogação do refresh token por meio de `POST /v1/auth/logout`
- Cadastro e consulta de categorias e autores
- Cadastro, pesquisa e filtros de livros
- Cadastro e consulta de leitores
- Registro, consulta e devolução de empréstimos
- Dashboard administrativo com relatório da biblioteca

## Logout e revogação de tokens

O endpoint `POST /v1/auth/logout` recebe o refresh token e o revoga no servidor. Dessa forma, o token não poderá ser usado novamente para renovar uma sessão.

A tabela `logout_list` pode ser utilizada para bloquear access tokens revogados antes do fim de sua validade. Ela pode ser mantida quando a API precisa invalidar imediatamente sessões já existentes; nesse cenário, as requisições verificam se o access token está nessa lista.

Caso a API não exija invalidação imediata do access token, a tabela `logout_list` pode ser removida. Após o logout, o access token continuará válido até expirar, mas não será possível renovar a sessão porque o refresh token foi revogado.

## Dados locais

Os usuários e seus papéis são armazenados em `data/auth.sqlite`. Em produção, configure `AUTH_DATABASE_PATH` para um arquivo em volume persistente.

## Scripts

```bash
npm run dev    # Desenvolvimento
npm run build  # Build de produção
npm run start  # Executar build
npm run lint   # Verificar código
```
