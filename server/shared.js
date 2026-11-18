// Framework-neutral API logic shared by the Express server (local/Docker/VPS) and Vercel serverless functions (/api).
import { analyzeLocal } from '../src/lib/analyze.js';
import { buildSystemPrompt, localReply, linksFor } from './chat.js';

const KEY = () => process.env.ANTHROPIC_API_KEY;
const MODEL = () => process.env.ECHOORA_MODEL || 'claude-sonnet-5-5';

export async function claude(body) {
  const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 25000);
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', signal: ctl.signal,
      headers: { 'content-type': 'application/json', 'x-api-key': KEY(), 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: MODEL(), ...body }) });
    if (!r.ok) throw new Error(`Anthropic API ${r.status}`);
    const d = await r.json(); return d.content.map((b) => b.text || '').join('').trim();
  } finally { clearTimeout(timer); }
}

// Best-effort limiter: 20 AI calls/minute/IP (per server instance; on serverless it is per warm instance).
const hits = new Map();
export function limited(ip) { const now = Date.now(); const arr = (hits.get(ip) || []).filter((t) => now - t < 60000);
  if (arr.length >= 20) return true; arr.push(now); hits.set(ip, arr); if (hits.size > 5000) hits.clear(); return false; }
export const clientIp = (req) => String(req.headers?.['x-forwarded-for'] || req.ip || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
const parse = (b) => { if (typeof b === 'string') { try { return JSON.parse(b); } catch { return {}; } } return b || {}; };
export const health = () => ({ ok: true, ai: Boolean(KEY()) });

export async function chat(rawBody, ip) {
  if (limited(ip)) return { status: 429, data: { error: 'Too many requests — please wait a moment.' } };
  const body = parse(rawBody);
  const msgs = (body.messages || []).filter((m) => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string').slice(-12).map((m) => ({ role: m.role, content: m.content.slice(0, 1500) }));
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  const last = msgs.at(-1); if (!last || last.role !== 'user') return { status: 400, data: { error: 'Send a user message.' } };
  const menu = Array.isArray(body.menu) ? body.menu : [];
  let aiError = KEY() ? '' : 'ANTHROPIC_API_KEY is not set on the server';
  if (KEY()) { try { const reply = await claude({ max_tokens: 500, system: buildSystemPrompt(menu), messages: msgs });
      return { status: 200, data: { reply, links: linksFor(last.content + ' ' + reply), source: 'claude' } }; } catch (e) { aiError = e.message; console.error('chat:', e.message); } }
  return { status: 200, data: { reply: localReply(last.content, menu), links: linksFor(last.content), source: 'local', aiError } };
}

export async function analyze(rawBody, ip) {
  if (limited(ip)) return { status: 429, data: { error: 'Too many requests — please wait a moment.' } };
  const texts = (parse(rawBody).reviews || []).map((t) => String(t).slice(0, 2000)).filter(Boolean).slice(0, 100);
  if (!texts.length) return { status: 400, data: { error: 'Provide at least one review text.' } };
  if (!KEY()) return { status: 200, data: analyzeLocal(texts) };
  try {
    const prompt = `Analyse these restaurant reviews. Reply with ONLY JSON: {"summary":string,"positive":number,"neutral":number,"negative":number (integer percentages summing to 100),"themes":[{"topic":string,"positive":number,"negative":number,"neutral":number,"mentions":number}],"actions":[string]}\n\nReviews:\n${texts.map((t, i) => `${i + 1}. ${t}`).join('\n')}`;
    const raw = (await claude({ max_tokens: 1200, messages: [{ role: 'user', content: prompt }] })).replace(/```json|```/g, '').trim();
    return { status: 200, data: { ...JSON.parse(raw), source: 'claude', total: texts.length } };
  } catch (e) { console.error('analyze:', e.message); return { status: 200, data: { ...analyzeLocal(texts), note: 'AI service unavailable; used local analysis.' } }; }
}
