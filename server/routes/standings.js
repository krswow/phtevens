import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../auth.js';

const router = Router();

router.get('/', requireAuth, (req, res) => {
  const standings = db.prepare(`
    SELECT
      u.id,
      u.username,
      COUNT(CASE WHEN c.result = 'won' THEN 1 END) as won,
      COUNT(CASE WHEN c.result = 'lost' THEN 1 END) as lost,
      COALESCE(SUM(CASE WHEN c.result = 'won' THEN c.potential_winnings ELSE 0 END), 0) as winnings
    FROM users u
    LEFT JOIN coupons c ON c.user_id = u.id
    WHERE u.role = 'member'
    GROUP BY u.id, u.username
    ORDER BY winnings DESC, won DESC
  `).all();

  res.json(standings);
});

export default router;
