// Express server for local development, Docker and any always-on Node host. (Vercel uses /api/*.js instead.)
import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chat, analyze, health, clientIp } from './shared.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
try { for (const line of fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i); if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch { /* no .env file */ }

const PORT = process.env.PORT || 8787;
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || true })); app.use(express.json({ limit: '200kb' }));
app.get('/api/health', (_q, r) => r.json(health()));
app.post('/api/chat', async (req, res) => { const { status, data } = await chat(req.body, clientIp(req)); res.status(status).json(data); });
app.post('/api/analyze-feedback', async (req, res) => { const { status, data } = await analyze(req.body, clientIp(req)); res.status(status).json(data); });

const dist = path.join(root, 'dist');
if (fs.existsSync(path.join(dist, 'index.html'))) {
  app.use(express.static(dist, { maxAge: '7d', index: false }));
  app.get('*', (req, res, next) => req.path.startsWith('/api') ? next() : res.sendFile(path.join(dist, 'index.html')));
}
app.listen(PORT, () => console.log(`ECHOORA running on http://localhost:${PORT}  (AI: ${process.env.ANTHROPIC_API_KEY ? 'Claude' : 'local fallback — set ANTHROPIC_API_KEY'})`));
