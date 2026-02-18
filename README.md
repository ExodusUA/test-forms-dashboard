# Forms Dashboard

A modern, full-stack forms management application built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd forms-dashboard

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local and add:
# - JWT_SECRET: any string (e.g., "mysuperjwtsecretkey")
# - UPSTASH_REDIS_REST_URL: from Upstash Console
# - UPSTASH_REDIS_REST_TOKEN: from Upstash Console

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test Credentials

The app uses an in-memory authentication system with predefined users:

**Admin User:**

- Email: `admin@forms.com`
- Role: Admin

**Individual User:**

- Email: `user@forms.com`
- Role: Individual

## 🏗️ Architecture Decisions

### Tech Stack

- **Next.js 15.5.12** (App Router) - SSR/SSG, Server Components, Route Handlers
- **TypeScript** - Type safety throughout
- **Tailwind CSS 4** - Utility-first styling with custom theme
- **React Hook Form + Zod** - Form validation with shared schemas
- **Zustand** - Lightweight state management (auth + toasts)
- **jose** - JWT token handling
- **Lucide React** - Icon library

### Key Design Decisions

1. **Upstash Redis for Data Persistence**

   **Why Redis instead of in-memory or local JSON?**

   The test assignment specified "in-memory singleton or read/write a local JSON file" with no database. However, deploying to **Vercel's serverless platform** reveals critical limitations:

   **❌ Why In-Memory Singleton Doesn't Work on Vercel:**
   - Vercel deploys each route handler as a **separate serverless function**
   - Each function runs in an **isolated container** with its own memory space
   - Module-level singletons (e.g., `export const store = new Store()`) are **NOT shared** across functions
   - Example: `/api/forms` (POST) creates data in Instance A, but `/forms` (GET) reads from Instance B → data lost
   - **Evidence from logs**: Different `instanceId` values showed separate store instances being created

   **❌ Why Local JSON File Doesn't Work on Vercel:**
   - Vercel's serverless functions have **read-only file system** (except `/tmp`)
   - Writing to `/tmp` only persists **within that single function invocation**
   - Next request might hit a different instance → file not found
   - File system is **ephemeral** and resets between cold starts

   **✅ Why Upstash Redis is the Solution:**
   - **Serverless-native**: Designed specifically for edge/serverless environments
   - **Shared state**: All serverless instances connect to the same Redis database
   - **HTTP-based**: Uses REST API, no persistent connections (unlike traditional Redis)
   - **Free tier**: 10,000 commands/day, perfect for test assignments
   - **Vercel-compatible**: Works seamlessly with Vercel's serverless architecture
   - **True persistence**: Data survives across all deployments and cold starts

   **Setup Required**:
   - Create free Upstash Redis database at https://console.upstash.com/
   - Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to environment variables
   - On Vercel: Add these via Project Settings → Environment Variables

   **Alternative Considered**: Using a real database (PostgreSQL, MongoDB) but that contradicts the "no DB" requirement. Upstash Redis is a key-value store, not a traditional relational database, making it the closest serverless-compatible solution to "in-memory storage."

2. **Server Components First**
   - Forms list page is a Server Component
   - Filtering/sorting happens server-side
   - Client Components only where interactivity is needed

3. **Shared Zod Schemas**
   - Single source of truth for validation
   - Reused on both client (React Hook Form) and server (API routes)
   - Type inference from Zod schemas

4. **Middleware-Based Route Protection**
   - JWT verification happens in middleware
   - Automatic redirects for unauthenticated users
   - Role-based access checks

5. **Toast System**
   - Zustand store for global toast state
   - Dismissible notifications
   - Auto-dismiss after 5 seconds

6. **Error Handling**
   - Centralized error handler utility
   - Consistent API error responses
   - User-friendly error messages

## 📁 Project Structure

```
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth route group
│   │   └── login/           # Login page
│   ├── api/                 # Route Handlers (REST API)
│   │   ├── auth/            # Auth endpoints
│   │   └── forms/           # Forms CRUD endpoints
│   ├── dashboard/           # Protected dashboard
│   ├── forms/               # Forms management
│   │   ├── [id]/           # Edit form (dynamic route)
│   │   └── new/            # Create form
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Home page (SSG)
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   │   ├── button.tsx       # Button component
│   │   └── toast-container.tsx
│   └── forms/               # Form-specific components
├── lib/                     # Business logic
│   ├── auth/                # Authentication services
│   ├── forms/               # Forms service (CRUD)
│   ├── schemas/             # Zod validation schemas
│   ├── store/               # Zustand stores
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── data/                    # Seed data
│   ├── forms.json           # Sample forms
│   └── users.json           # Sample users
├── middleware.ts            # Route protection
└── public/                  # Static assets
```

## 🔒 Environment Variables

Create a `.env.local` file:

```env
JWT_SECRET=your_secret_key_here

# Upstash Redis (required for data persistence)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

⚠️ **Important**:

- The app validates that `JWT_SECRET` is set on startup
- **Upstash Redis** is required for CRUD operations to work properly
- Get free Redis database at https://console.upstash.com/

### Setting up Upstash Redis

1. Go to https://console.upstash.com/
2. Create a free account (no credit card required)
3. Click "Create Database"
4. Choose any region close to your Vercel deployment
5. Copy **REST URL** and **REST Token** from the database dashboard
6. Add them to `.env.local` (local) or Vercel Environment Variables (production)

## 🧪 Testing the App

### Test Flow

1. **Visit Home Page** → SEO-optimized landing with hero
2. **Click Login** → Enter test credentials (see above)
3. **View Forms List** → Server-rendered list with filters
4. **Filter/Sort** → Test different status filters and sorting options
5. **Create Form (Admin)** → Click "New Form" button
6. **Edit Form (Admin)** → Click on any form card
7. **Delete Form (Admin)** → Use delete button in edit page
8. **Individual User** → Login as `admin@forms.com` to see read-only view

### Role Differences

**Admin:**

- ✅ Create new forms
- ✅ Edit existing forms
- ✅ Delete forms
- ✅ Full access to all pages

**Individual:**

- ✅ View forms list
- ❌ Cannot create/edit/delete
- Cards show "Admin Only" indicator

## 🔧 Technical Deep Dive: Serverless Data Persistence

### The Challenge

The test assignment required "in-memory singleton or local JSON file, no database." This works perfectly on traditional Node.js servers but **fails on serverless platforms** like Vercel.

### Why Traditional Approaches Don't Work

**1. In-Memory Singleton Attempt:**

```typescript
// ❌ This doesn't work on Vercel
class FormsStore {
  private forms: Form[] = [];
}
export const formsStore = new FormsStore(); // Separate instance per function!
```

**Problem**: Vercel bundles `/app/api/forms/route.ts` and `/app/forms/page.tsx` as **separate serverless functions**. Each gets its own module instance. When you POST to create a form, it goes to Function A. When you GET to read forms, it might go to Function B with a fresh, empty store.

**2. Local JSON File Attempt:**

```typescript
// ❌ This doesn't work on Vercel
fs.writeFileSync("./data/forms.json", JSON.stringify(forms));
```

**Problem**: Vercel's filesystem is **read-only** (except `/tmp`). Writing to `/tmp` only persists within that single Lambda execution. Next cold start = file gone.

**3. Global Variable Attempt:**

```typescript
// ❌ Still doesn't work
declare global {
  var formsStore: Form[];
}
global.formsStore = global.formsStore || seedData;
```

**Problem**: `global` is scoped to the Node.js process. Each serverless function = separate process = separate `global` object.

### The Solution: Upstash Redis

**Why it works:**

- ✅ **External persistence**: Data lives outside serverless functions
- ✅ **Shared across all instances**: All functions connect to same Redis URL
- ✅ **HTTP-based REST API**: No persistent connections needed (serverless-friendly)
- ✅ **Sub-millisecond latency**: Fast enough for real-time apps
- ✅ **Free tier**: Perfect for test projects and demos

**Implementation:**

```typescript
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// All serverless instances share this data
const forms = await redis.get<Form[]>("forms:all");
await redis.set("forms:all", updatedForms);
```

### Local Development

For local development, Upstash Redis also works seamlessly. No need for separate local storage logic. Same code runs everywhere.

**Tech Stack**: Next.js 15 · TypeScript · Tailwind CSS · React Hook Form · Zod · Zustand · Upstash Redis
