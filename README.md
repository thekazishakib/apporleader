# ApoorLeader

**Decoding Logic. Mastering AI. Winning the Game.**

ApoorLeader is a full-stack web platform built for strategists, tech enthusiasts, and future leaders — a community-driven space for AI learning, business case studies, competitions, and more.

🌐 Live: [apporleader.netlify.app](https://apporleader.netlify.app)

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS** — styling
- **Framer Motion** — animations
- **Firebase** (Firestore + Auth) — database & authentication
- **Web3Forms** — contact form handling

---

## Features

- Multi-page layout: Home, About, Members, Gallery, Workshops, Blogs, Contact
- Secure Admin Panel with Google Authentication
- Real-time Firestore database sync
- Fully responsive across all devices
- SEO optimized with React Helmet
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

Hosted on **Netlify**. Configure all environment variables from `.env.example` under:
**Netlify Dashboard → Site Settings → Environment Variables**

---

## Project Structure
```
src/
├── components/     # Reusable UI components
├── context/        # Admin context & state management
├── data/           # Static data files
├── pages/          # Page-level components
├── utils/          # Utility/helper functions
├── firebase.ts     # Firebase initialization
└── App.tsx         # Root component & routing
```

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