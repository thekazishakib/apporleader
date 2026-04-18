# ApporLeader

**Decoding Logic. Mastering AI. Winning the Game.**

ApporLeader is a full-stack web platform built for strategists, tech enthusiasts, and future leaders — a community-driven space for AI learning, business case studies, competitions, and more.

🌐 Live: [apporleader.vercel.app](https://apporleader.vercel.app)

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS** — styling
- **Framer Motion** — animations
- **Supabase** (PostgreSQL + Auth + Storage) — database, authentication & file storage
- **Web3Forms** — contact form handling

---

## Features

- Multi-page layout: Home, About, Members, Gallery, Workshops, Blogs, Contact
- Secure Admin Panel with Google Authentication (Supabase Auth)
- Real-time Supabase database sync
- **Pinned Iconic Video** — featured video auto-plays at the top of the Gallery page (set via Admin → Site Settings)
- YouTube Class Recordings section with autoplay modal & pagination
- Photo gallery with category filters (Chess, Workshops, Business, Events, Competitions)
- Image uploads via Supabase Storage
- Fully responsive across all devices
- SEO optimized with React Helmet
- Code-split bundles for faster load times (React, Framer Motion, Supabase, UI chunks)
- Environment-variable-based configuration

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/thekazishakib/apporleader.git
cd apporleader
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```

Fill in your values in `.env` — refer to `.env.example` for all required keys.

### 4. Run locally
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## Deployment

Hosted on **Vercel**. Steps to deploy:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repository
3. Set **Framework Preset** to `Vite`
4. Add all environment variables from `.env.example` under:
   **Vercel Dashboard → Project → Settings → Environment Variables**
5. Click **Deploy**

> The `vercel.json` file is already configured for SPA routing — no extra setup needed.

---

## Supabase Setup

Create the following tables in your Supabase project (SQL Editor):

```sql
-- Videos table (for YouTube class recordings)
create table if not exists videos (
  id text primary key,
  title text not null,
  url text not null
);
alter table videos enable row level security;
create policy "Public read" on videos for select using (true);
create policy "Admin write" on videos for all using (true);
```

Refer to `supabase_setup.sql` in the project root for the full schema including members, leadership, gallery, events, blogs, and settings tables.

---

## Project Structure
```
src/
├── components/     # Reusable UI components
├── config/         # Site settings map & defaults
├── context/        # Admin context & state management
├── data/           # Static data files
├── pages/          # Page-level components
│   └── admin/      # Admin panel pages
├── utils/          # Utility/helper functions
├── supabase.ts     # Supabase client initialization
└── App.tsx         # Root component & routing
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `VITE_SUPABASE_STORAGE_BUCKET` | Storage bucket name (e.g. `apporleader`) |
| `VITE_WEB3FORMS_ACCESS_KEY` | Web3Forms key for contact form |
| `VITE_ADMIN_EMAIL` | Google account email for admin access |

---

## Development Notes

This project was developed with the assistance of **Google AI Studio** and **Claude (Anthropic)** — used for code generation, debugging, security hardening, and deployment guidance.

All architectural decisions, content, design direction, and final implementation were led and managed by **Kazi Shakib**.

---

## Author

**Kazi Shakib**
[GitHub](https://github.com/thekazishakib) · [LinkedIn](https://linkedin.com/in/kazishakib) · [Instagram](https://instagram.com/thekazishakib)

---

© 2026 Kazi Shakib. All rights reserved.
