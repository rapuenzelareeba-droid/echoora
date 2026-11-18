import { chat, clientIp } from '../server/shared.js';
export const config = { maxDuration: 30 };
export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Use POST.' }); }
  const { status, data } = await chat(req.body, clientIp(req));
  res.status(status).json(data);
}
