const MEMBERS = ['Marcus', 'Leila', 'Tobias', 'Priya', 'Finn', 'Sofia', 'Dante'];

const STORAGE_KEY = 'phtevens_bets';

let currentWeek = getWeekNumber(new Date());
let currentYear = new Date().getFullYear();

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function weekKey(year, week) {
  return `${year}-W${String(week).padStart(2, '0')}`;
}

function loadBets() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
}

function saveBets(bets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bets));
}

function getBetsForWeek(year, week) {
  const bets = loadBets();
  return bets[weekKey(year, week)] || [];
}

function addBet(year, week, bet) {
  const bets = loadBets();
  const key = weekKey(year, week);
  if (!bets[key]) bets[key] = [];
  bets[key].push(bet);
  saveBets(bets);
}

function buildLeaderboard() {
  const bets = loadBets();
  const stats = {};
  MEMBERS.forEach(m => stats[m] = { wins: 0, losses: 0 });

  Object.values(bets).flat().forEach(bet => {
    if (!stats[bet.member]) return;
    if (bet.result === 'win') stats[bet.member].wins++;
    if (bet.result === 'loss') stats[bet.member].losses++;
  });

  return MEMBERS
    .map(m => ({ name: m, ...stats[m], points: stats[m].wins * 3 - stats[m].losses }))
    .sort((a, b) => b.points - a.points || b.wins - a.wins);
}

function renderLeaderboard() {
  const tbody = document.getElementById('leaderboard-body');
  const board = buildLeaderboard();
  tbody.innerHTML = board.map((m, i) => `
    <tr class="${i < 3 ? 'rank-' + (i + 1) : ''}">
      <td>${i + 1}</td>
      <td>${m.name}</td>
      <td>${m.wins}</td>
      <td>${m.losses}</td>
      <td>${m.points}</td>
    </tr>
  `).join('');
}

function renderBets() {
  const tbody = document.getElementById('bets-body');
  const label = document.getElementById('week-label');
  const bets = getBetsForWeek(currentYear, currentWeek);

  label.textContent = `${currentYear} — Week ${currentWeek}`;

  if (bets.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="color:#8b949e;text-align:center;">No bets this week yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = bets.map(b => `
    <tr>
      <td>${b.member}</td>
      <td>${b.match}</td>
      <td>${b.prediction}</td>
      <td><span class="badge ${b.result}">${b.result}</span></td>
    </tr>
  `).join('');
}

function populateMemberSelect() {
  const select = document.getElementById('member-select');
  MEMBERS.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    select.appendChild(opt);
  });
}

function render() {
  renderLeaderboard();
  renderBets();
}

document.getElementById('prev-week').addEventListener('click', () => {
  currentWeek--;
  if (currentWeek < 1) { currentWeek = 52; currentYear--; }
  render();
});

document.getElementById('next-week').addEventListener('click', () => {
  currentWeek++;
  if (currentWeek > 52) { currentWeek = 1; currentYear++; }
  render();
});

document.getElementById('bet-form').addEventListener('submit', e => {
  e.preventDefault();
  const member = document.getElementById('member-select').value;
  const match = document.getElementById('match-input').value.trim();
  const prediction = document.getElementById('prediction-input').value.trim();
  const result = document.getElementById('result-select').value;

  if (!member || !match || !prediction) return;

  addBet(currentYear, currentWeek, { member, match, prediction, result });

  document.getElementById('match-input').value = '';
  document.getElementById('prediction-input').value = '';
  document.getElementById('result-select').value = 'pending';
  document.getElementById('member-select').value = '';

  render();
});

populateMemberSelect();
render();
