# Forms Dashboard

Full-stack forms management app with Next.js 15, TypeScript, and Tailwind CSS.

## Setup

```bash
npm install
cp .env.example .env.local
# Add your env variables (see below)
npm run dev
```

## Environment Variables

```env
JWT_SECRET=any-secret-string
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

Get free Upstash Redis at https://console.upstash.com

## Test Users

- Admin: `admin@forms.com`
- User: `user@forms.com`

(No password needed - test assignment)

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Upstash Redis
- Zustand (state)

## Why Upstash Redis?

Original assignment said "in-memory singleton or local JSON", but that doesn't work on Vercel:
- Serverless functions don't share memory
- File system is read-only

Upstash is serverless-compatible key-value storage that works like in-memory but persists across deployments.

## Features

- Server-side rendering for forms list
- Client-side validation with Zod
- JWT auth with middleware
- Role-based access (admin/individual)
- Toast notifications
- CRUD operations for forms

## Project Structure

```
app/          - Next.js pages and API routes
components/   - React components
lib/          - Business logic, schemas, utils
data/         - Seed data (forms.json, users.json)
middleware.ts - Route protection
```

## API Routes

```
POST   /api/auth/login      - Login
POST   /api/auth/logout     - Logout
GET    /api/forms           - List forms (with filters)
POST   /api/forms           - Create form (admin)
GET    /api/forms/[id]      - Get form
PUT    /api/forms/[id]      - Update form (admin)
DELETE /api/forms/[id]      - Delete form (admin)
```

## Running Tests

```bash
npm test
npm run test:watch
npm run test:coverage
```

## Deploy

Works on Vercel. Add environment variables in project settings.
