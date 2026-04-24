# SHG Records — Self Help Group Digital Record Platform

A web-based record-keeping and governance transparency tool for Self Help Groups (SHGs), built for rural women in Maharashtra, India. Supports English and Marathi.

---

## Features

- Member registration and role management (President, Treasurer, Member)
- Meeting scheduling, attendance tracking, and notes
- Payment declarations and verification (cash & online/UPI)
- Loan management with treasurer and president approval workflow
- Loan repayment tracking
- PDF statement generation
- Group settings and custom rules

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native (Expo) — web only |
| Backend | Node.js + Express |
| Database | PostgreSQL via Supabase (optional) |
| ORM | Drizzle ORM |
| Language | TypeScript |

---

## Local Setup

### Prerequisites

- Node.js 18 or higher (22 recommended)
- npm

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <project-folder>
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your values. At minimum you only need `PORT`:

```
PORT=5000
```

**Without `DATABASE_URL`** the app runs with in-memory storage — data resets every time the server restarts. This is fine for development/testing.

### 3. Connect Supabase (for persistent data)

1. Go to [supabase.com](https://supabase.com) and create a free account and a new project.
2. In your Supabase project: **Settings → Database → Connection string → URI** — copy the URI (use the "Transaction" pooler version on port 6543 for best compatibility).
3. Paste it in your `.env`:
   ```
   DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
4. Push the schema to create all tables:
   ```bash
   npm run db:push
   ```

### 4. Run the application

Open **two terminals**:

**Terminal 1 — Backend (API server on port 5000):**
```bash
npm run server:dev
```

**Terminal 2 — Frontend (web UI on port 8081):**
```bash
npm run expo:dev
```

Then open **http://localhost:5000** in your browser.

> The backend automatically proxies all non-API requests to the Expo web server at port 8081, so you access everything through a single URL (port 5000).

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run server:dev` | Start the backend in development mode |
| `npm run expo:dev` | Start the frontend web server (Metro bundler) |
| `npm run build:web` | Build the frontend into `web-build/` for production |
| `npm run db:push` | Push Drizzle schema to your PostgreSQL database |
| `npm start` | Run the backend in production mode |

---

## Storage Modes

The app automatically selects the right storage backend:

- **No `DATABASE_URL`** — In-memory storage. Perfect for quick local testing, no database needed. Data is lost on restart.
- **`DATABASE_URL` set** — PostgreSQL via Drizzle ORM. Data is persisted. Use this for production or any serious use.

---

## Project Structure

```
app/                 Expo Router screens (frontend)
  (auth)/            Login and Register screens
  (main)/            Main app tabs: Dashboard, Meetings, Payments, More
  loan/              Loan detail screens
  meeting/           Meeting detail screens
  member/            Member detail screens
components/          Reusable UI components
contexts/            React Context: Auth, Data, Language
lib/                 API client, PDF generator utilities
server/              Express backend
  index.ts           Server entry point
  routes.ts          API route definitions
  storage.ts         MemStorage + DatabaseStorage implementations
  db.ts              Drizzle database connection
shared/              Shared TypeScript types and Drizzle schema
  schema.ts          All database table definitions
constants/           App colors, translations
```

---

## Roles

| Feature | Member | Treasurer | President |
|---|---|---|---|
| Declare Payment | Yes | No | Yes |
| Verify Payments | No | Yes | Yes |
| Apply for Loan | Yes | Yes | Yes |
| Approve Loans | No | First step | Final step |
| Manage Group Settings | No | Partial | Yes |
| Schedule Meetings | No | No | Yes |

---

## Notes

- The frontend runs entirely in the browser as a web app — no Expo Go app or mobile device required.
- For production, run `npm run build:web` first, then `npm start` to serve everything from a single port (5000).
