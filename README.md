# ECHOORA — multi-page restaurant web app
React 18 + React Router 6 + GSAP + Vite, with one small Express server (AI concierge chat, AI feedback analysis, and — in production — serving the built site).

## Develop
    npm install
    npm run dev:all        # API on :8787 + site on http://localhost:5173 (one terminal)

## AI setup (optional)
Copy `.env.example` to `.env` and set `ANTHROPIC_API_KEY`. Without a key the chat and feedback analysis still work using built-in offline logic.
Edit what the chatbot knows (hours, address, policies) in `server/chat.js` → `RESTAURANT`. The menu is sent live from the site, so admin menu edits are reflected automatically.

## Deploy on Vercel (via GitHub)
1. Push this folder to a GitHub repository (`.env`, `node_modules`, `dist` are git-ignored).
2. vercel.com → Add New → Project → import the repo. Framework is detected as Vite; leave the defaults.
3. Before deploying open Environment Variables and add `ANTHROPIC_API_KEY` (optional; without it the chat uses the built-in offline logic).
4. Deploy. `/api/chat`, `/api/analyze-feedback` and `/api/health` run as serverless functions from the `api/` folder; `vercel.json` makes every other URL load the React app so refreshing `/menu` etc. works.
Every `git push` to main redeploys automatically. After changing environment variables, redeploy once.

## Deploy on a normal Node host / Docker
    npm install && npm run build && npm start     # site + API on $PORT (default 8787)
    docker build -t echoora . && docker run -p 8787:8787 -e ANTHROPIC_API_KEY=... echoora

## Structure
`src/layouts` · `src/pages/customer` · `src/pages/admin` · `src/components` (incl. `customer/ChatWidget.jsx`) · `src/context/StoreContext.jsx` · `api/` (Vercel functions) · `server/shared.js` (API logic used by both) · `server/index.js` (Express for local/Docker) · `server/chat.js` (chatbot knowledge).
Admin demo login: admin@echoora.com / echoora2026 (client-side only; replace before production).
