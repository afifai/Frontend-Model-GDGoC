<p align="center">
  <img src="public/logo.png" alt="NgodingAI" width="220" />
</p>

<h1 align="center">SMS Spam Detector</h1>

<p align="center">
  A simple, polished web app that classifies SMS messages as <strong>normal</strong>, <strong>spam</strong>, or <strong>promo</strong> using a machine-learning backend.
</p>

---

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** — dark theme matching NgodingAI branding
- **FastAPI** backend on Google Cloud Run

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. (Optional) configure the API URL
cp .env.local.example .env.local
# edit .env.local if you need a different backend

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://sms-spam-api-uoqthydjdq-et.a.run.app` | Backend API base URL |

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set the **Root Directory** to `frontend/` (if this lives in a monorepo).
4. Add the environment variable `NEXT_PUBLIC_API_URL` if needed.
5. Deploy!

### CI/CD (GitHub Actions)

The included `.github/workflows/deploy.yml` auto-deploys on push to `main`.  
Required repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Author

**Afif AI** — GDGoC UIN Jakarta
