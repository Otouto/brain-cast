# Brain Cast
Brain Cast is a personal learning project exploring AI‑assisted development. The app turns raw ideas into ready‑to‑publish posts for LinkedIn and Twitter using user-defined templates and OpenAI. It is built with Next.js, Clerk for authentication, Prisma for data, and Shadcn/Tailwind for UI.


## General Structure

- **Next.js App** – The project uses Next.js with the new app directory. The root layout sets up Clerk authentication, a theme provider, and a toast provider for notifications.

- **Routing** – Pages such as `/edit-post`, `/posts`, `/templates`, and /settings are grouped under (dashboard) for authenticated users. The home page simply redirects to `/edit-post`. Sign‑in and sign‑up pages use Clerk components for authentication.

- **Components & Hooks** – UI pieces live in `src/components` and re-usable hooks in `src/hooks`. Hooks manage image uploads, social connections, template selection, content generation, and publishing logic. Example: `useContentEditor` orchestrates calls to the formatting API with progress handling and fallbacks.

- **Services** – Database and external logic are isolated in `src/services`. Prisma is the database client (configured in `src/lib/prisma.ts`), and services expose operations for users, posts, templates, and OpenAI integration. The `openai.service.ts` file shows how raw content and a template are combined into a formatted post using the OpenAI API with explicit prompts and error handling.

- **API Routes** – Under `src/app/api` are server routes for formatting content, managing templates, and handling Clerk webhooks. For example, `/api/templates` creates or retrieves templates for the current user and auto‑generates default templates if none exist.

- **Database Schema** – Prisma schema defines models for `User`, `Post`, `Platform`, and `Template` with relations and constraints. Templates are unique per user/platform combination.

- **Documentation** – The `.documentation` folder contains product requirements and system design notes. They describe the app’s goal: quickly converting user ideas into polished LinkedIn/Twitter posts using LLM-powered templates and a streamlined publishing flow.

## Setup
1. Install dependencies:
```bash
npm install
```
2. Configure environment variables `(.env)` including `OPENAI_API_KEY` and Clerk credentials.

3. Run development server:
```bash
npm run dev
```

4. Visit http://localhost:3000 to use the app.
