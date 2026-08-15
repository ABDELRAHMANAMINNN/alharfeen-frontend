# الحرفيين — Al Harafyeen Marketplace

Egyptian automotive spare-parts marketplace. Built from the original Figma design
(قطع غيارك) as the source of truth, rebranded to الحرفيين.

## Stack
React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router + Zustand + lucide-react + recharts

This is the **frontend only**. It talks to a real backend — see `alharafyeen-api/` (sibling project).

## Run it (full stack)
```
# Terminal 1 — backend
cd alharafyeen-api
npm install
npm run seed
npm run dev        # http://localhost:4000

# Terminal 2 — frontend
cd alharafyeen
npm install
npm run dev         # http://localhost:5173
```

Demo accounts (created by the backend's seed script):
- Customer: `01111111111` / `customer123`
- Admin: `01000000000` / `admin1234`

The frontend reads `VITE_API_URL` from `.env` (defaults to `http://localhost:4000/api`).

## Status: Day 8 — Backend + Frontend Integration ✅
See DEVELOPMENT_LOG.md for the full phased plan and checkpoint notes.
