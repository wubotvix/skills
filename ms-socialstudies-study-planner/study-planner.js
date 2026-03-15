// MS Social Studies Study Planner (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-socialstudies-study-planner');

const VALID_GRADES = ['grade-6', 'grade-7', 'grade-8'];
const VALID_GOALS = ["catch-up","stay-strong","get-ahead","dbq-ready","test-prep","civic-engagement"];

const SKILL_AREAS = [
  {
    "key": "world-history",
    "label": "World History",
    "dataDir": "ms-socialstudies-world-history"
  },
  {
    "key": "us-history",
    "label": "US History",
    "dataDir": "ms-socialstudies-us-history"
  },
  {
    "key": "geography",
    "label": "Geography",
    "dataDir": "ms-socialstudies-geography"
  },
  {
    "key": "civics",
    "label": "Civics & Government",
    "dataDir": "ms-socialstudies-civics"
  },
  {
    "key": "economics",
    "label": "Economics",
    "dataDir": "ms-socialstudies-economics"
  },
  {
    "key": "inquiry",
    "label": "Inquiry & Evidence",
    "dataDir": "ms-socialstudies-inquiry"
  },
  {
    "key": "current-events",
    "label": "Current Events & Media",
    "dataDir": "ms-socialstudies-current-events"
  }
];

// Percentages map to SKILL_AREAS order: world-history, us-history, geography, civics, economics, inquiry, current-events
const TIME_ALLOC = {
  'catch-up': [10, 10, 18, 20, 18, 10, 14],
  'stay-strong': [15, 15, 15, 15, 14, 13, 13],
  'get-ahead': [12, 12, 10, 10, 10, 24, 22],
  'dbq-ready': [18, 20, 8, 8, 6, 28, 12],
  'test-prep': [16, 18, 16, 16, 16, 10, 8],
  'civic-engagement': [8, 10, 10, 28, 10, 8, 26],
};

const ASSESS_QUESTIONS = {
  'world-history': {
    'grade-6': [
      { q: 'What was the role of the Nile River in the development of ancient Egyptian civilization?', a: 'open-ended', type: 'open' },
      { q: 'Describe one way the Silk Road connected different cultures across Asia and Europe.', a: 'open-ended', type: 'open' },
    ],
    'grade-7': [
      { q: 'How did the feudal system organize society in medieval Europe, and who held the most power?', a: 'open-ended', type: 'open' },
      { q: 'Explain one cause and one effect of the spread of Islam across North Africa and Southwest Asia.', a: 'open-ended', type: 'open' },
    ],
    'grade-8': [
      { q: 'Compare the causes of the French Revolution and the American Revolution. What did they have in common?', a: 'open-ended', type: 'open' },
      { q: 'How did the Industrial Revolution change the relationship between workers and factory owners?', a: 'open-ended', type: 'open' },
    ],
  },
  'us-history': {
    'grade-6': [
      { q: 'Why did early colonists come to North America? Name at least two different reasons.', a: 'open-ended', type: 'open' },
      { q: 'What was the Columbian Exchange, and how did it affect both the Americas and Europe?', a: 'open-ended', type: 'open' },
    ],
    'grade-7': [
      { q: 'Explain why the Declaration of Independence was written and identify one key idea it contains.', a: 'open-ended', type: 'open' },
      { q: 'How did westward expansion affect Native American nations during the early 1800s?', a: 'open-ended', type: 'open' },
    ],
    'grade-8': [
      { q: 'What were the main disagreements between the North and South that led to the Civil War?', a: 'open-ended', type: 'open' },
      { q: 'Describe how Reconstruction attempted to rebuild the South and expand rights for formerly enslaved people. Why is it considered only partly successful?', a: 'open-ended', type: 'open' },
    ],
  },
  'geography': {
    'grade-6': [
      { q: 'What is the difference between latitude and longitude, and how do they help us locate places on a map?', a: 'open-ended', type: 'open' },
      { q: 'How does climate affect the way people live in different regions of the world? Give one example.', a: 'open-ended', type: 'open' },
    ],
    'grade-7': [
      { q: 'Explain how physical geography (mountains, rivers, deserts) can influence where cities develop.', a: 'open-ended', type: 'open' },
      { q: 'What is the difference between a renewable and a nonrenewable natural resource? Give an example of each.', a: 'open-ended', type: 'open' },
    ],
    'grade-8': [
      { q: 'How has globalization changed the movement of people, goods, and ideas across regions?', a: 'open-ended', type: 'open' },
      { q: 'Describe one way human activity has altered the physical environment and explain the consequences.', a: 'open-ended', type: 'open' },
    ],
  },
  'civics': {
    'grade-6': [
      { q: 'What are the three branches of the U.S. government, and what does each branch do?', a: 'open-ended', type: 'open' },
      { q: 'Why do communities need rules and laws? Give an example of a rule that helps people live together.', a: 'open-ended', type: 'open' },
    ],
    'grade-7': [
      { q: 'What is the Bill of Rights, and why was it added to the Constitution?', a: 'open-ended', type: 'open' },
      { q: 'Explain what "checks and balances" means and give one example of how it works.', a: 'open-ended', type: 'open' },
    ],
    'grade-8': [
      { q: 'How does the amendment process allow the Constitution to change over time? Give an example of an amendment that expanded rights.', a: 'open-ended', type: 'open' },
      { q: 'Compare the roles and powers of federal, state, and local governments. How do they share responsibility?', a: 'open-ended', type: 'open' },
    ],
  },
  'economics': {
    'grade-6': [
      { q: 'What is the difference between a want and a need? Give one example of each.', a: 'open-ended', type: 'open' },
      { q: 'Why do people trade with other countries instead of making everything themselves?', a: 'open-ended', type: 'open' },
    ],
    'grade-7': [
      { q: 'Explain how supply and demand affect the price of a product. What happens when demand is high but supply is low?', a: 'open-ended', type: 'open' },
      { q: 'What is the difference between a market economy and a command economy?', a: 'open-ended', type: 'open' },
    ],
    'grade-8': [
      { q: 'How do taxes fund public goods and services? Name two examples of public goods.', a: 'open-ended', type: 'open' },
      { q: 'What role do banks play in the economy, and how does borrowing and lending affect consumers and businesses?', a: 'open-ended', type: 'open' },
    ],
  },
  'inquiry': {
    'grade-6': [
      { q: 'If you wanted to find out why your city was built where it is, what kinds of sources would you look for?', a: 'open-ended', type: 'open' },
      { q: 'What is the difference between a primary source and a secondary source? Give an example of each.', a: 'open-ended', type: 'open' },
    ],
    'grade-7': [
      { q: 'A historian finds two accounts of the same battle that disagree. How should the historian decide which is more reliable?', a: 'open-ended', type: 'open' },
      { q: 'Why is it important to consider who created a source and why before using it as evidence?', a: 'open-ended', type: 'open' },
    ],
    'grade-8': [
      { q: 'You are given three documents about the causes of World War I. Describe the steps you would take to build an argument using those documents.', a: 'open-ended', type: 'open' },
      { q: 'What does it mean to corroborate sources, and why is corroboration important in historical inquiry?', a: 'open-ended', type: 'open' },
    ],
  },
  'current-events': {
    'grade-6': [
      { q: 'How can you tell if a news article is giving you facts or opinions? What clues do you look for?', a: 'open-ended', type: 'open' },
      { q: 'Why is it important to get news from more than one source?', a: 'open-ended', type: 'open' },
    ],
    'grade-7': [
      { q: 'What is media bias, and how might it affect the way a news story is reported?', a: 'open-ended', type: 'open' },
      { q: 'Describe one current issue in your community or country. Who are the different groups involved, and what do they want?', a: 'open-ended', type: 'open' },
    ],
    'grade-8': [
      { q: 'How can social media both help and harm public understanding of current events? Give an example of each.', a: 'open-ended', type: 'open' },
      { q: 'Choose a global issue (such as climate change or migration). Explain how it connects to concepts you have studied in social studies.', a: 'open-ended', type: 'open' },
    ],
  },
};

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// File I/O

function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }
function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }

function loadProfile(id) {
  const fp = profilePath(id);
  if (fs.existsSync(fp)) {
    try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
    catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); }
  }
  return {
    studentId: id, grade: null, goal: null, dailyBudget: 30,
    vision: null, strengths: [], gaps: [],
    createdAt: new Date().toISOString(), plans: [], assessments: [],
  };
}

function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }

// Helpers

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }

function allocateMinutes(budget, percents) {
  const raw = percents.map(p => budget * p / 100);
  const floored = raw.map(v => Math.floor(v));
  let leftover = budget - floored.reduce((a, b) => a + b, 0);
  const fracs = raw.map((v, i) => ({ i, f: v - floored[i] })).sort((a, b) => b.f - a.f);
  for (const { i } of fracs) { if (leftover <= 0) break; floored[i]++; leftover--; }
  return floored;
}

function scanSkillData(dataDir) {
  const fullPath = path.join(__dirname, '..', '..', 'data', dataDir);
  if (!fs.existsSync(fullPath)) return { found: false, students: {} };
  const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.json'));
  const students = {};
  for (const f of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(fullPath, f), 'utf8'));
      const sid = data.studentId || f.replace(/\.json$/, '');
      const skills = data.skills || {};
      let totalMastery = 0, count = 0;
      for (const [, info] of Object.entries(skills)) { if (info.mastery !== undefined) { totalMastery += info.mastery; count++; } }
      const avgMastery = count > 0 ? Math.round(totalMastery / count * 100) : 0;
      const assessCount = (data.assessments || []).length;
      const lastAssess = assessCount > 0 ? data.assessments[assessCount - 1].date : null;
      students[sid] = { avgMastery, skillCount: count, assessments: assessCount, lastActivity: lastAssess };
    } catch { /* skip corrupt files */ }
  }
  return { found: true, students };
}

function aggregateProgress(studentId) {
  const results = {};
  let overallTotal = 0, overallMastered = 0;
  for (const area of SKILL_AREAS) {
    const scan = scanSkillData(area.dataDir);
    const studentData = scan.found && scan.students[studentId] ? scan.students[studentId] : null;
    results[area.key] = {
      label: area.label, found: scan.found,
      mastery: studentData ? studentData.avgMastery : 0,
      assessments: studentData ? studentData.assessments : 0,
      lastActivity: studentData ? studentData.lastActivity : null,
      status: !studentData ? 'no-data'
        : studentData.avgMastery >= 90 ? 'strong'
        : studentData.avgMastery >= 80 ? 'on-track'
        : studentData.avgMastery >= 60 ? 'growing'
        : 'needs-work',
    };
    if (studentData) { overallTotal++; if (studentData.avgMastery >= 80) overallMastered++; }
  }
  return { studentId, skills: results, areasWithData: overallTotal, areasOnTrack: overallMastered };
}

function generateWeeklyPlan(profile) {
  const goal = profile.goal || 'stay-strong';
  const grade = profile.grade || 'grade-6';
  const budget = profile.dailyBudget || 30;
  const baseAlloc = TIME_ALLOC[goal] || TIME_ALLOC[VALID_GOALS[0]];
  const weeklyMinutes = allocateMinutes(budget * 5, baseAlloc);
  const days = [];
  const remaining = [...weeklyMinutes];
  for (let d = 0; d < 5; d++) {
    const dayBudget = budget;
    if (d === 4) {
      const reviewTime = Math.round(dayBudget * 0.5);
      const practiceTime = dayBudget - reviewTime;
      days.push({ day: DAY_NAMES[d], label: 'Review Friday', slots: [{ skill: 'Weekly Review', minutes: reviewTime }, { skill: 'Practice & Application', minutes: practiceTime }], totalMinutes: dayBudget });
      continue;
    }
    const ranked = SKILL_AREAS.map((s, i) => ({ ...s, idx: i, rem: remaining[i] })).filter(s => s.rem > 0).sort((a, b) => b.rem - a.rem);
    const slotCount = dayBudget >= 40 ? 3 : 2;
    const chosen = ranked.slice(0, slotCount);
    const perSlot = Math.floor(dayBudget / chosen.length);
    let extra = dayBudget - perSlot * chosen.length;
    let dayRemaining = dayBudget;
    const slots = [];
    for (const c of chosen) {
      const mins = perSlot + (extra > 0 ? 1 : 0); if (extra > 0) extra--;
      const actual = Math.min(mins, c.rem); slots.push({ skill: c.label, minutes: actual });
      remaining[c.idx] -= actual; dayRemaining -= actual;
    }
    days.push({ day: DAY_NAMES[d], slots, totalMinutes: dayBudget - dayRemaining });
  }
  return { weekOf: new Date().toISOString().slice(0, 10), goal, grade, dailyBudget: budget, allocation: SKILL_AREAS.map((s, i) => ({ skill: s.label, percent: baseAlloc[i], weeklyMinutes: weeklyMinutes[i] })), days };
}

function generateAssessment(studentId, grade) {
  grade = grade || 'grade-6';
  const questions = {};
  for (const area of SKILL_AREAS) {
    const bank = ASSESS_QUESTIONS[area.key];
    if (!bank) continue;
    let g = grade;
    if (!bank[g]) { const gi = VALID_GRADES.indexOf(grade); for (let d = 0; d <= 2; d++) { if (gi - d >= 0 && bank[VALID_GRADES[gi - d]]) { g = VALID_GRADES[gi - d]; break; } if (gi + d < VALID_GRADES.length && bank[VALID_GRADES[gi + d]]) { g = VALID_GRADES[gi + d]; break; } } }
    const items = bank[g];
    if (items && items.length) { questions[area.key] = { label: area.label, grade: g, questions: pick(items, 2) }; }
  }
  return { studentId, assessmentGrade: grade, areas: questions, instructions: 'Present questions one at a time. Record scores after each domain.' };
}

// Public API

class StudyPlanner {
  start(id, grade) {
    const p = loadProfile(id);
    if (grade) { if (!VALID_GRADES.includes(grade)) throw new Error(`Unknown grade: ${grade}. Valid: ${VALID_GRADES.join(', ')}`); p.grade = grade; }
    if (!p.grade) p.grade = 'grade-6'; if (!p.goal) p.goal = VALID_GOALS[0];
    saveProfile(p);
    return { action: 'start', profile: { studentId: p.studentId, grade: p.grade, goal: p.goal, dailyBudget: p.dailyBudget, strengths: p.strengths, gaps: p.gaps, createdAt: p.createdAt }, prompt: 'Welcome! Use set-goal to customize, then run plan to generate your weekly schedule.' };
  }

  diagnostic(id) { const p = loadProfile(id); return generateAssessment(id, p.grade || 'grade-6'); }
  plan(id) { const p = loadProfile(id); if (!p.grade) throw new Error('Set grade first: start <id> <grade>'); const plan = generateWeeklyPlan(p); p.plans.push({ generated: new Date().toISOString(), plan }); saveProfile(p); return plan; }
  progress(id) { const p = loadProfile(id); const agg = aggregateProgress(id); return { studentId: id, grade: p.grade, goal: p.goal, skills: agg.skills, areasWithData: agg.areasWithData, areasOnTrack: agg.areasOnTrack }; }
  recommend(id) {
    const p = loadProfile(id); const agg = aggregateProgress(id);
    const weakest = SKILL_AREAS.map(a => ({ ...a, mastery: agg.skills[a.key]?.mastery || 0 })).sort((a, b) => a.mastery - b.mastery).slice(0, 2);
    return { studentId: id, grade: p.grade, recommendation: weakest.map(w => ({ domain: w.label, mastery: w.mastery, suggestedMinutes: Math.round((p.dailyBudget || 30) / 2) })) };
  }
  goals(id) { const p = loadProfile(id); return { studentId: id, goal: p.goal, availableGoals: VALID_GOALS }; }
  setGoal(id, goal) { if (!VALID_GOALS.includes(goal)) throw new Error(`Unknown goal: ${goal}. Valid: ${VALID_GOALS.join(', ')}`); const p = loadProfile(id); p.goal = goal; saveProfile(p); return { studentId: id, goal }; }

  report(id) {
    const p = loadProfile(id); const agg = aggregateProgress(id);
    return { studentId: id, grade: p.grade, goal: p.goal, dailyBudget: p.dailyBudget, strengths: p.strengths, gaps: p.gaps, skills: agg.skills, areasWithData: agg.areasWithData, areasOnTrack: agg.areasOnTrack, recentAssessments: (p.assessments || []).slice(-10).reverse(), currentPlan: p.plans && p.plans.length ? p.plans[p.plans.length - 1].plan : null };
  }

  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }
}

module.exports = StudyPlanner;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2); const cmd = args[0]; const sp = new StudyPlanner(); const out = d => console.log(JSON.stringify(d, null, 2));
  try {
    switch (cmd) {
      case 'start': { const [, id, grade] = args; if (!id) throw new Error('Usage: start <id> [grade]'); out(sp.start(id, grade || undefined)); break; }
      case 'diagnostic': { const [, id] = args; if (!id) throw new Error('Usage: diagnostic <id>'); out(sp.diagnostic(id)); break; }
      case 'plan': { const [, id] = args; if (!id) throw new Error('Usage: plan <id>'); out(sp.plan(id)); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(sp.progress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(sp.report(id)); break; }
      case 'goals': { const [, id] = args; if (!id) throw new Error('Usage: goals <id>'); out(sp.goals(id)); break; }
      case 'recommend': { const [, id] = args; if (!id) throw new Error('Usage: recommend <id>'); out(sp.recommend(id)); break; }
      case 'set-goal': { const [, id, goal] = args; if (!id || !goal) throw new Error('Usage: set-goal <id> <goal>'); out(sp.setGoal(id, goal)); break; }
      case 'students': { out(sp.listStudents()); break; }
      default: out({ usage: 'node study-planner.js <command> [args]', commands: ['start','diagnostic','plan','progress','report','goals','recommend','set-goal','students'], goals: VALID_GOALS, grades: VALID_GRADES });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
