import { Router } from 'express';
import db from '../db.js';

const router = Router();

// Only available in test environment
router.post('/reset', (req, res) => {
  if (process.env.NODE_ENV !== 'test') {
    return res.status(403).json({ error: 'Only available in test environment' });
  }
  db.prepare('DELETE FROM bets').run();
  db.prepare('DELETE FROM coupons').run();
  res.json({ success: true });
});

export default router;
