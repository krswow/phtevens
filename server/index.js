import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';
import db from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

mkdirSync(join(__dirname, '../data'), { recursive: true });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(join(__dirname, '..')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Phtevens server running on port ${PORT}`);
});

export default app;
