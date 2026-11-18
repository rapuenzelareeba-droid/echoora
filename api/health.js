import { health } from '../server/shared.js';
export default function handler(_req, res) { res.status(200).json(health()); }
