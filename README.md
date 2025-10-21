# News Feed Monorepo

This project is a full-stack monorepo built using Vue 3 (Vite), NestJS, Tailwindcss 4, shadcn vue and Turborepo. It aggregates top news stories from multiple providers (NYTimes, The Guardian) via their APIs and displays them in a user-friendly web interface.

## Project Structure

- `apps/`
  - `api/`: NestJS backend service. Fetches news from external providers (NYTimes, Guardian) and exposes REST endpoints.
  - `web/`: Vue 3 frontend app (Vite). Consumes the API and displays news stories.
- `packages/`
  - `ui/`: Shared Vue component library.
  - `eslint-config-custom/`: Shared ESLint config.
  - `tsconfig/`: Shared TypeScript config.

## Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (monorepo package manager)

### Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd news-feed-monorepo-vue-nest
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Get API keys for providers:

   - [NYTimes Developer Portal](https://developer.nytimes.com/)
   - [The Guardian Open Platform](https://open-platform.theguardian.com/)

   Copy `.env.example` to `.env` in both `apps/api` and `apps/web`, then fill in your keys:

   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   # Edit apps/api/.env and add your NYT_API_KEY and GUARDIAN_API_KEY
   ```

### Start Development

- Run both backend and frontend in parallel:
  ```bash
  pnpm dev
  ```
  - API: http://localhost:3010
  - Web: http://localhost:3000

## Docker Compose

You can run the entire stack using Docker Compose for easy setup.
To build and start all services:

```bash
docker-compose up --build
```

## Notes

- **API Keys Required:** You must provide your own API keys for NYTimes and The Guardian in `apps/api/.env`.
- **Monorepo:** Managed with Turborepo and pnpm workspaces for fast builds and shared code.
- **Frontend:** Vue 3 + Vite for fast development and HMR.
- **Backend:** NestJS for scalable API development.

---

Feel free to reach out if you have any questions or feedback!
