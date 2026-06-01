const API = '';

function getToken() { return localStorage.getItem('token'); }
function getUser() { return JSON.parse(localStorage.getItem('user') || 'null'); }

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

let currentWeek = getWeekNumber(new Date());
let currentYear = new Date().getFullYear();

// --- Auth ---

document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const username = document.getElementById('username-input').value.trim();
  const password = document.getElementById('password-input').value;
  const errorEl = document.getElementById('login-error');
  errorEl.classList.add('hidden');

  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    errorEl.textContent = data.error || 'Login failed';
    errorEl.classList.remove('hidden');
    return;
  }

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  initApp();
});

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showPage('login-page');
});

// --- App ---

function initApp() {
  const user = getUser();
  if (!user) { showPage('login-page'); return; }
  document.getElementById('logged-in-user').textContent = user.username;
  showPage('app-page');
  renderWeekLabel();
  loadStandings();
  loadCoupons();
}

function renderWeekLabel() {
  document.getElementById('week-label').textContent = `${currentYear} — Week ${currentWeek}`;
}

async function loadStandings() {
  const res = await fetch(`${API}/api/standings`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) return;
  const standings = await res.json();
  const tbody = document.getElementById('leaderboard-body');
  if (!standings.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No data yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = standings.map((m, i) => `
    <tr class="${i < 3 ? 'rank-' + (i + 1) : ''}">
      <td>${i + 1}</td>
      <td>${m.username}</td>
      <td>${m.won}</td>
      <td>${m.lost}</td>
      <td>${m.winnings.toFixed(2)}</td>
    </tr>
  `).join('');
}

async function loadCoupons() {
  const res = await fetch(`${API}/api/coupons?week=${currentWeek}&year=${currentYear}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) return;
  const coupons = await res.json();
  const container = document.getElementById('coupons-list');
  if (!coupons.length) {
    container.innerHTML = `<p class="empty-state">No coupons this week.</p>`;
    return;
  }
  container.innerHTML = coupons.map(c => `
    <div class="coupon-card">
      <div class="coupon-header">
        <span class="coupon-member">${c.username}</span>
        <span class="badge ${c.result}">${c.result}</span>
      </div>
      <div class="coupon-meta">
        Stake: 25 DKK &nbsp;|&nbsp; Total odds: ${c.total_odds.toFixed(2)} &nbsp;|&nbsp; Potential: ${c.potential_winnings.toFixed(2)} DKK
      </div>
      ${c.bets.map(b => `
        <div class="bet-row">
          <span>${b.event} — ${b.prediction}</span>
          <span>${b.odds}</span>
        </div>
      `).join('')}
    </div>
  `).join('');
}

document.getElementById('prev-week').addEventListener('click', () => {
  currentWeek--;
  if (currentWeek < 1) { currentWeek = 52; currentYear--; }
  renderWeekLabel();
  loadCoupons();
});

document.getElementById('next-week').addEventListener('click', () => {
  currentWeek++;
  if (currentWeek > 52) { currentWeek = 1; currentYear++; }
  renderWeekLabel();
  loadCoupons();
});

// --- Boot ---
if (getToken()) {
  initApp();
}
// login-page is active by default in HTML, no else needed
