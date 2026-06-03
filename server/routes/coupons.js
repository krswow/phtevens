import { Router } from 'express';
import db from '../db.js';
import { requireAuth, requireAdmin } from '../auth.js';

const router = Router();

// GET /api/coupons?week=&year= — all authenticated users see all coupons
router.get('/', requireAuth, (req, res) => {
  const { week, year } = req.query;

  const coupons = db.prepare(`
    SELECT c.*, u.username FROM coupons c
    JOIN users u ON c.user_id = u.id
    WHERE c.week = ? AND c.year = ?
    ORDER BY u.username
  `).all(week, year);

  const result = coupons.map(c => ({
    ...c,
    bets: db.prepare('SELECT * FROM bets WHERE coupon_id = ? ORDER BY id').all(c.id),
  }));

  res.json(result);
});

// GET /api/coupons/:id — member can only get their own
router.get('/:id', requireAuth, (req, res) => {
  const coupon = db.prepare(`
    SELECT c.*, u.username FROM coupons c
    JOIN users u ON c.user_id = u.id
    WHERE c.id = ?
  `).get(req.params.id);

  if (!coupon) return res.status(404).json({ error: 'Not found' });

  coupon.bets = db.prepare('SELECT * FROM bets WHERE coupon_id = ? ORDER BY id').all(coupon.id);
  res.json(coupon);
});

// POST /api/coupons — member submits their own coupon
router.post('/', requireAuth, (req, res) => {
  const { week, year, bets } = req.body;

  if (!bets || bets.length === 0) {
    return res.status(400).json({ error: 'A coupon must contain at least one bet' });
  }

  for (const bet of bets) {
    if (!bet.event || !bet.prediction || !bet.odds) {
      return res.status(400).json({ error: 'Each bet must have an event, prediction, and odds' });
    }
  }

  const totalOdds = bets.reduce((acc, b) => acc * parseFloat(b.odds), 1);
  if (totalOdds < 1.75) {
    return res.status(400).json({ error: `Total odds ${totalOdds.toFixed(2)} is below minimum of 1.75` });
  }

  const stake = 25.0;
  const potentialWinnings = stake * totalOdds;

  const coupon = db.prepare(`
    INSERT INTO coupons (user_id, week, year, stake, total_odds, potential_winnings)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(req.user.id, week, year, stake, totalOdds, potentialWinnings);

  const insertBet = db.prepare('INSERT INTO bets (coupon_id, event, prediction, odds) VALUES (?, ?, ?, ?)');
  for (const bet of bets) {
    insertBet.run(coupon.lastInsertRowid, bet.event, bet.prediction, parseFloat(bet.odds));
  }

  res.status(201).json({ id: coupon.lastInsertRowid });
});

// PATCH /api/coupons/:id/result — admin only
router.patch('/:id/result', requireAdmin, (req, res) => {
  const { result } = req.body;
  if (!['won', 'lost'].includes(result)) {
    return res.status(400).json({ error: 'Result must be won or lost' });
  }

  const coupon = db.prepare('SELECT * FROM coupons WHERE id = ?').get(req.params.id);
  if (!coupon) return res.status(404).json({ error: 'Not found' });

  db.prepare(`UPDATE coupons SET result = ?, updated_at = datetime('now') WHERE id = ?`)
    .run(result, req.params.id);

  res.json({ success: true });
});

export default router;
