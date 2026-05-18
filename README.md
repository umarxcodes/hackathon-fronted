# ClinicAI Frontend

Production-ready React 18 + Vite frontend for the AI Clinic Management SaaS.

## Stack

- Vite, React Router v6, Redux Toolkit, RTK Query
- React Hook Form, Zod
- Tailwind CSS v3
- Recharts, React Hot Toast, date-fns, lucide-react

## Setup

```bash
yarn
yarn dev
```

The app expects:

```bash
VITE_API_URL=https://hackathon-backend-woad-two.vercel.app/api
```

## Build

```bash
yarn build
```

Vercel is configured with `vercel.json` so React Router routes fall back to `index.html`.
