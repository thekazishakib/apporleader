# ApoorLeader

**Decoding Logic. Mastering AI. Winning the Game.**

A full-stack web platform for the ApoorLeader community — built for strategists, tech enthusiasts, and future leaders.

🌐 Live: [apporleader.netlify.app](https://apporleader.netlify.app)

---

## Built With

- **React 19** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS** — styling
- **Framer Motion** — animations
- **Firebase** (Firestore + Auth) — database & authentication
- **Web3Forms** — contact form

---

## Features

- Home, About, Members, Gallery, Workshops, Blogs, Contact pages
- Admin panel with Google Authentication
- Firestore real-time database sync
- Fully responsive design
- SEO optimized with React Helmet

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/thekazishakib/apporleader.git
cd apporleader
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Fill in your own values in `.env` — see `.env.example` for reference.

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

Deployed on **Netlify**. Set all environment variables from `.env.example` in your Netlify dashboard under **Site Settings → Environment Variables**.

---

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # Admin context & state management
├── data/           # Static data
├── pages/          # All page components
├── utils/          # Utility functions
├── firebase.ts     # Firebase initialization
└── App.tsx         # Main app & routing
```

---

## License

MIT © [Kazi Shakib](https://github.com/thekazishakib)
