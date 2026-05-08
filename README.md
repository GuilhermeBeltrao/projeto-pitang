# Sistema de Controle de Solicitacoes de Reembolso

Aplicacao fullstack para controle de solicitacoes de reembolso com autenticacao JWT, RBAC e fluxo completo de aprovacao.

## Stack

**Backend**
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- JWT + bcrypt
- Zod + DayJS
- Jest + Supertest

**Frontend**
- React + TypeScript + Vite
- React Router DOM + Context API
- Axios + React Hook Form + Zod
- TailwindCSS + shadcn/ui
- Jest + React Testing Library

## Requisitos

- Node.js 18+
- PostgreSQL 15+

## Estrutura

- /backend
- /frontend

## Variaveis de ambiente

### Backend ([backend/.env.example](backend/.env.example))

```
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/reembolsos
DATABASE_TEST_URL=postgresql://postgres:postgres@localhost:5432/reembolsos_test
JWT_SECRET=changeme
JWT_EXPIRES_IN=1d
```

### Frontend ([frontend/.env.example](frontend/.env.example))

```
VITE_API_URL=http://localhost:4000
```

## Setup do backend

```
npm install
npm --workspace backend run prisma:generate
npm --workspace backend run prisma:migrate
npm --workspace backend run prisma:seed
npm --workspace backend run dev
```

A API sobe em `http://localhost:4000` e a documentacao Swagger em `http://localhost:4000/docs`.

## Setup do frontend

```
npm install
npm --workspace frontend run dev
```

O frontend sobe em `http://localhost:5173`.

## Testes

```
npm --workspace backend run test
npm --workspace frontend run test
```

## Exemplos de login (seed)

- colaborador@demo.local / Passw0rd!
- gestor@demo.local / Passw0rd!
- financeiro@demo.local / Passw0rd!
- admin@demo.local / Passw0rd!

## Fluxo do sistema

1. Colaborador cria solicitacao e envia.
2. Gestor aprova ou rejeita (justificativa obrigatoria).
3. Financeiro marca como paga.
4. Admin gerencia usuarios e categorias.

## Scripts adicionais

Backend:
- `npm --workspace backend run prisma:deploy`
- `npm --workspace backend run build`

Frontend:
- `npm --workspace frontend run build`

## Docker

```
docker-compose up --build
```

## Observacoes

- Toda rota privada exige JWT.
- Toda operacao relevante gera historico.
- Solicitacoes pagas nao podem ser alteradas.
