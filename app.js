/* Personal Development Dashboard
 * - SPA behavior using plain JavaScript.
 * - Persists all data in localStorage.
 */
const STORAGE_KEY = 'growth-dashboard-v1';
const POINTS_PER_HABIT = 10;
const LEVEL_SIZE = 200;

const defaultHabits = [
  { id: 'h_wake_early', name: 'Wake up early', goal: null, custom: false },
  { id: 'h_no_masturbation', name: 'No masturbation', goal: null, custom: false },
  { id: 'h_orders', name: 'Validate minimum 4 orders', goal: 4, custom: false },
  { id: 'h_read', name: 'Read minimum 4 pages', goal: 4, custom: false },
  { id: 'h_no_smoking', name: 'No smoking', goal: null, custom: false }
];

const els = {
  themeToggle: document.getElementById('themeToggle'),
  exportData: document.getElementById('exportData'),
  dailyCompletion: document.getElementById('dailyCompletion'),
  totalPoints: document.getElementById('totalPoints'),
  levelDisplay: document.getElementById('levelDisplay'),
  bestStreak: document.getElementById('bestStreak'),
  todayDate: document.getElementById('todayDate'),
  habitList: document.getElementById('habitList'),
  habitForm: document.getElementById('habitForm'),
  habitName: document.getElementById('habitName'),
  habitGoal: document.getElementById('habitGoal'),
  journalDate: document.getElementById('journalDate'),
  journalText: document.getElementById('journalText'),
  saveJournal: document.getElementById('saveJournal'),
  journalHistory: document.getElementById('journalHistory'),
  calendar: document.getElementById('calendar'),
  badgeList: document.getElementById('badgeList')
};

let weeklyChart;
let streakChart;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const base = {
    theme: 'light',
    habits: [...defaultHabits],
    days: {},
    customCounter: 0
  };
  if (!raw) return base;
  try {
    const parsed = JSON.parse(raw);
    return {
      ...base,
      ...parsed,
      habits: mergeDefaults(parsed.habits || []),
      days: parsed.days || {}
    };
  } catch {
    return base;
  }
}

function mergeDefaults(savedHabits) {
  const map = new Map(savedHabits.map((h) => [h.id, h]));
  defaultHabits.forEach((habit) => {
    if (!map.has(habit.id)) map.set(habit.id, habit);
  });
  return [...map.values()];
}

let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getDay(date = todayKey()) {
  if (!state.days[date]) {
    state.days[date] = { checks: {}, journal: '' };
  }
  return state.days[date];
}

function isHabitDone(habit, date = todayKey()) {
  const day = getDay(date);
  const value = day.checks[habit.id];
  return habit.goal ? Number(value || 0) >= habit.goal : Boolean(value);
}

function completionPercent(date = todayKey()) {
  if (!state.habits.length) return 0;
  const completed = state.habits.filter((h) => isHabitDone(h, date)).length;
  return Math.round((completed / state.habits.length) * 100);
}

function dateLabel(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function computeStreak(habitId) {
  const sorted = Object.keys(state.days).sort().reverse();
  let streak = 0;
  let cursor = new Date();
  for (const dayStr of sorted) {
    const target = cursor.toISOString().slice(0, 10);
    if (dayStr !== target) {
      if (streak === 0 && dayStr > target) continue;
      break;
    }
    const habit = state.habits.find((h) => h.id === habitId);
    if (!habit || !isHabitDone(habit, target)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function totalPoints() {
  return Object.keys(state.days).reduce((sum, date) => {
    const completed = state.habits.filter((h) => isHabitDone(h, date)).length;
    return sum + completed * POINTS_PER_HABIT;
  }, 0);
}

function getBestStreakAllHabits() {
  return Math.max(0, ...state.habits.map((h) => computeStreak(h.id)));
}

function renderHabits() {
  const today = getDay();
  els.habitList.innerHTML = '';

  state.habits.forEach((habit) => {
    const row = document.createElement('div');
    row.className = 'habit-item';

    const meta = document.createElement('div');
    meta.className = 'habit-meta';
    const streak = computeStreak(habit.id);
    meta.innerHTML = `<h4>${habit.name}</h4><p>Streak: ${streak} day(s)${habit.goal ? ` • Goal: ${habit.goal}` : ''}</p>`;

    const controls = document.createElement('div');
    controls.className = 'controls';

    if (habit.goal) {
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.value = Number(today.checks[habit.id] || 0);
      input.addEventListener('change', () => {
        today.checks[habit.id] = Number(input.value || 0);
        saveState();
        refresh();
      });
      controls.append(input);
    } else {
      const toggle = document.createElement('button');
      const done = Boolean(today.checks[habit.id]);
      toggle.textContent = done ? 'Done' : 'Mark';
      toggle.className = `icon-btn toggle ${done ? 'done' : ''}`;
      toggle.addEventListener('click', () => {
        today.checks[habit.id] = !today.checks[habit.id];
        saveState();
        refresh();
      });
      controls.append(toggle);
    }

    if (habit.custom) {
      const editBtn = document.createElement('button');
      editBtn.className = 'icon-btn';
      editBtn.textContent = 'Edit';
      editBtn.onclick = () => {
        const name = prompt('Habit name', habit.name);
        if (!name) return;
        const goalRaw = prompt('Numeric goal (empty for checkbox)', habit.goal ?? '');
        habit.name = name.trim();
        habit.goal = goalRaw === '' ? null : Number(goalRaw);
        saveState();
        refresh();
      };

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'icon-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = () => {
        state.habits = state.habits.filter((h) => h.id !== habit.id);
        Object.values(state.days).forEach((day) => delete day.checks[habit.id]);
        saveState();
        refresh();
      };

      controls.append(editBtn, deleteBtn);
    }

    row.append(meta, controls);
    els.habitList.append(row);
  });
}

function lastNDates(n) {
  const now = new Date();
  const arr = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
}

function renderCharts() {
  const dates = lastNDates(7);
  const weeklyData = dates.map((d) => completionPercent(d));
  const totalByDay = dates.map((d) => state.habits.filter((h) => isHabitDone(h, d)).length);

  if (weeklyChart) weeklyChart.destroy();
  if (streakChart) streakChart.destroy();

  weeklyChart = new Chart(document.getElementById('weeklyChart'), {
    type: 'line',
    data: {
      labels: dates.map(dateLabel),
      datasets: [{ label: 'Completion %', data: weeklyData, borderColor: '#5566ff', tension: 0.35, fill: false }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100 } } }
  });

  streakChart = new Chart(document.getElementById('streakChart'), {
    type: 'bar',
    data: {
      labels: dates.map(dateLabel),
      datasets: [{ label: 'Completed Habits', data: totalByDay, backgroundColor: '#20b86a' }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
}

function renderJournal() {
  const date = els.journalDate.value || todayKey();
  const day = getDay(date);
  els.journalText.value = day.journal || '';

  const entries = Object.entries(state.days)
    .filter(([, d]) => d.journal)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 15);

  els.journalHistory.innerHTML = entries.length
    ? entries.map(([k, d]) => `<div class="journal-entry"><b>${k}</b><span>${d.journal}</span></div>`).join('')
    : '<p class="eyebrow">No journal entries yet.</p>';
}

function renderCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  els.calendar.innerHTML = '';

  for (let day = 1; day <= daysInMonth; day += 1) {
    const d = new Date(year, month, day);
    const key = d.toISOString().slice(0, 10);
    const cell = document.createElement('div');
    cell.className = `day ${completionPercent(key) === 100 ? 'completed' : ''}`;
    cell.textContent = String(day);
    els.calendar.append(cell);
  }
}

function renderBadges() {
  const best = getBestStreakAllHabits();
  const badges = [
    { label: '3-day streak', earned: best >= 3 },
    { label: '7-day streak', earned: best >= 7 },
    { label: '14-day streak', earned: best >= 14 },
    { label: '30-day streak', earned: best >= 30 }
  ];

  els.badgeList.innerHTML = badges
    .map((b) => `<span class="badge">${b.earned ? '🏆' : '🔒'} ${b.label}</span>`)
    .join('');
}

function refreshStats() {
  const points = totalPoints();
  const level = Math.max(1, Math.floor(points / LEVEL_SIZE) + 1);
  els.dailyCompletion.textContent = `${completionPercent()}%`;
  els.totalPoints.textContent = String(points);
  els.levelDisplay.textContent = `${level}`;
  els.bestStreak.textContent = `${getBestStreakAllHabits()} days`;
  els.todayDate.textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

function applyTheme() {
  document.body.classList.toggle('dark', state.theme === 'dark');
  els.themeToggle.textContent = state.theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}

function refresh() {
  refreshStats();
  renderHabits();
  renderCharts();
  renderJournal();
  renderCalendar();
  renderBadges();
}

els.themeToggle.addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  saveState();
  applyTheme();
});

els.habitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = els.habitName.value.trim();
  if (!name) return;
  const goalRaw = els.habitGoal.value.trim();
  state.customCounter += 1;
  state.habits.push({
    id: `custom_${Date.now()}_${state.customCounter}`,
    name,
    goal: goalRaw ? Number(goalRaw) : null,
    custom: true
  });
  els.habitForm.reset();
  saveState();
  refresh();
});

els.journalDate.value = todayKey();
els.journalDate.addEventListener('change', renderJournal);
els.saveJournal.addEventListener('click', () => {
  const d = els.journalDate.value || todayKey();
  getDay(d).journal = els.journalText.value.trim();
  saveState();
  refresh();
});

els.exportData.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `growth-dashboard-${todayKey()}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

applyTheme();
refresh();
