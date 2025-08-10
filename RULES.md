# AI Coding Rules for This Project

## General
- Use TypeScript for all code.
- Always import types using `import type` where possible.
- Use async/await for all DB operations.
- All functions must have clear names and docstrings.

## Next.js
- Use Next.js App Router where possible.
- Use server components for DB interactions and data fetching.
- Avoid using `getServerSideProps` unless needed; prefer API routes or server components.
- Pages should be placed under `src/pages/` for this project.

## React
- Use functional components with hooks (no class components).
- Use Tailwind CSS for styling (no inline styles unless necessary).
- Keep components small and reusable.

## Prisma + PostgreSQL
- All queries should be inside `/src/lib/db.ts` or a service layer, not inside React components.
- Validate inputs before database writes.
- Use `zod` for schema validation on API endpoints.
- Migrations must be committed to the repo.

## Linting & Formatting
- Follow ESLint and Prettier rules — no disabled rules unless justified.
- Use camelCase for variables and PascalCase for components.

## Docker
- Use docker compose latest version