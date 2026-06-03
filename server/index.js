import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';
import db from './db.js';
import authRoutes from './routes/auth.js';
import couponRoutes from './routes/coupons.js';
import standingsRoutes from './routes/standings.js';
import testUtilRoutes from './routes/test-utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

mkdirSync(join(__dirname, '../data'), { recursive: true });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/standings', standingsRoutes);
app.use('/api/test', testUtilRoutes);
app.use(express.static(join(__dirname, '..')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Phtevens server running on port ${PORT}`);
});

export default app;
