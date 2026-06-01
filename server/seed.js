import bcrypt from 'bcrypt';
import db from './db.js';

const MEMBERS = ['Marcus', 'Leila', 'Tobias', 'Priya', 'Finn', 'Sofia', 'Dante'];
const DEFAULT_PASSWORD = 'phtevens2024';

async function seed() {
  const existing = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (existing.count > 0) {
    console.log('Database already seeded, skipping.');
    return;
  }

  const hash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  const insert = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)');

  for (const name of MEMBERS) {
    insert.run(name.toLowerCase(), hash, 'member');
    console.log(`Created member: ${name.toLowerCase()}`);
  }

  insert.run('admin', await bcrypt.hash('admin2024', 10), 'admin');
  console.log('Created admin user');

  console.log(`\nDefault member password: ${DEFAULT_PASSWORD}`);
  console.log('Admin password: admin2024');
}

seed().catch(console.error);
