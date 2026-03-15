// eClaw MS Math Study Planner & Coordinator (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-math-study-planner');

const VALID_GRADES = ['grade-6', 'grade-7', 'grade-8'];
const VALID_GOALS = ['catch-up', 'stay-strong', 'get-ahead', 'algebra-ready', 'test-prep', 'math-confidence'];

const SKILL_AREAS = [
  { key: 'number-system', label: 'Number System', dataDir: 'ms-math-number-system' },
  { key: 'ratios-proportions', label: 'Ratios & Proportions', dataDir: 'ms-math-ratios-proportions' },
  { key: 'expressions-equations', label: 'Expressions & Equations', dataDir: 'ms-math-expressions-equations' },
  { key: 'functions', label: 'Functions', dataDir: 'ms-math-functions' },
  { key: 'geometry', label: 'Geometry', dataDir: 'ms-math-geometry' },
  { key: 'statistics-probability', label: 'Statistics & Probability', dataDir: 'ms-math-statistics-probability' },
  { key: 'problem-solving', label: 'Problem Solving', dataDir: 'ms-math-problem-solving' },
];

const TIME_ALLOC = {
  'catch-up':         [20, 15, 20, 5, 15, 10, 15],
  'stay-strong':      [10, 15, 20, 10, 15, 15, 15],
  'get-ahead':        [10, 10, 15, 20, 15, 10, 20],
  'algebra-ready':    [15, 15, 25, 15, 10, 5, 15],
  'test-prep':        [15, 15, 20, 10, 15, 10, 15],
  'math-confidence':  [15, 10, 15, 10, 15, 15, 20],
};

const ASSESS_QUESTIONS = {
  'number-system': {
    'grade-6': [
      { q: 'Compute: 2/3 ÷ 1/4', a: '8/3', type: 'open' },
      { q: 'What is the absolute value of -7?', a: '7', type: 'open' },
      { q: 'Order from least to greatest: -3, 5, -8, 0', a: '-8, -3, 0, 5', type: 'open' },
    ],
    'grade-7': [
      { q: 'Compute: -5 + (-8)', a: '-13', type: 'open' },
      { q: 'Convert 3/8 to a decimal.', a: '0.375', type: 'open' },
      { q: 'What is the multiplicative inverse of 2/3?', a: '3/2', type: 'open' },
    ],
    'grade-8': [
      { q: 'Is √7 rational or irrational?', a: 'irrational', type: 'open' },
      { q: 'Write 45000 in scientific notation.', a: '4.5 × 10^4', type: 'open' },
    ],
  },
  'ratios-proportions': {
    'grade-6': [
      { q: 'The ratio of cats to dogs is 3:5. If there are 15 cats, how many dogs?', a: '25', type: 'open' },
      { q: 'What is the unit rate: 240 miles in 4 hours?', a: '60 mph', type: 'open' },
    ],
    'grade-7': [
      { q: 'A shirt is 25% off the $40 price. What is the sale price?', a: '$30', type: 'open' },
      { q: 'What is the constant of proportionality in y = 3x?', a: '3', type: 'open' },
    ],
  },
  'expressions-equations': {
    'grade-6': [
      { q: 'Evaluate: 3x + 5 when x = 4', a: '17', type: 'open' },
      { q: 'Solve: x + 8 = 15', a: '7', type: 'open' },
    ],
    'grade-7': [
      { q: 'Solve: 2x - 5 = 11', a: '8', type: 'open' },
      { q: 'Expand: 3(x + 4)', a: '3x + 12', type: 'open' },
    ],
    'grade-8': [
      { q: 'Solve: 3x + 2 = 5x - 6', a: '4', type: 'open' },
      { q: 'What is the slope of y = -2x + 7?', a: '-2', type: 'open' },
    ],
  },
  'functions': {
    'grade-8': [
      { q: 'Is this a function? {(1,2), (1,3), (2,4)}', a: 'no', type: 'open' },
      { q: 'What is the slope between (1,3) and (4,9)?', a: '2', type: 'open' },
    ],
  },
  'geometry': {
    'grade-6': [
      { q: 'What is the area of a triangle with base 10 and height 6?', a: '30', type: 'open' },
    ],
    'grade-7': [
      { q: 'Find the circumference of a circle with radius 7 (use pi = 3.14).', a: '43.96', type: 'open' },
    ],
    'grade-8': [
      { q: 'Find the hypotenuse: legs are 6 and 8.', a: '10', type: 'open' },
    ],
  },
  'statistics-probability': {
    'grade-6': [
      { q: 'Find the mean of 4, 8, 6, 10, 2.', a: '6', type: 'open' },
      { q: 'Find the median of 3, 7, 9, 12, 15.', a: '9', type: 'open' },
    ],
    'grade-7': [
      { q: 'What is the probability of flipping heads on a fair coin?', a: '0.5', type: 'open' },
    ],
  },
  'problem-solving': {
    'grade-6': [
      { q: 'A store sells notebooks for $3 each and pens for $2 each. Maria buys 4 notebooks and 6 pens. How much does she spend?', a: '24', type: 'open' },
    ],
    'grade-7': [
      { q: 'A meal costs $45. You leave a 20% tip. What is the total?', a: '54', type: 'open' },
    ],
    'grade-8': [
      { q: 'Adult tickets cost $12, child tickets cost $7. A group buys 10 tickets for $95. How many adult tickets?', a: '5', type: 'open' },
    ],
  },
};

const ALGEBRA_READINESS = {
  'number-fluency': { label: 'Number fluency (integers, rationals, operations)', areas: ['number-system'] },
  'proportional-reasoning': { label: 'Proportional reasoning', areas: ['ratios-proportions'] },
  'equation-solving': { label: 'Equation solving and expressions', areas: ['expressions-equations'] },
  'function-understanding': { label: 'Function concepts', areas: ['functions'] },
  'geometric-reasoning': { label: 'Geometric reasoning', areas: ['geometry'] },
  'data-reasoning': { label: 'Data and probability reasoning', areas: ['statistics-probability'] },
  'problem-solving': { label: 'Multi-step problem solving', areas: ['problem-solving'] },
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
    mathAnxiety: null, vision: null, strengths: [], gaps: [],
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
  for (const { i } of fracs) {
    if (leftover <= 0) break;
    floored[i]++;
    leftover--;
  }
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
      for (const [, info] of Object.entries(skills)) {
        if (info.mastery !== undefined) { totalMastery += info.mastery; count++; }
      }
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
    if (studentData) {
      overallTotal++;
      if (studentData.avgMastery >= 80) overallMastered++;
    }
  }
  return { studentId, skills: results, areasWithData: overallTotal, areasOnTrack: overallMastered };
}

function generateWeeklyPlan(profile) {
  const goal = profile.goal || 'stay-strong';
  const grade = profile.grade || 'grade-6';
  const budget = profile.dailyBudget || 30;
  const baseAlloc = TIME_ALLOC[goal] || TIME_ALLOC['stay-strong'];
  const weeklyMinutes = allocateMinutes(budget * 5, baseAlloc);

  const days = [];
  const remaining = [...weeklyMinutes];

  for (let d = 0; d < 5; d++) {
    const dayBudget = budget;
    const slots = [];

    if (d === 4) {
      const reviewTime = Math.round(dayBudget * 0.5);
      const problemTime = dayBudget - reviewTime;
      days.push({
        day: DAY_NAMES[d], label: 'Problem Solving Friday',
        slots: [
          { skill: 'Weekly Review', minutes: reviewTime },
          { skill: 'Problem Solving Challenge', minutes: problemTime },
        ],
        totalMinutes: dayBudget,
      });
      remaining[6] = Math.max(0, remaining[6] - problemTime);
      continue;
    }

    const ranked = SKILL_AREAS.map((s, i) => ({ ...s, idx: i, rem: remaining[i] }))
      .filter(s => s.rem > 0)
      .sort((a, b) => b.rem - a.rem);

    const slotCount = dayBudget >= 40 ? 3 : 2;
    const chosen = ranked.slice(0, slotCount);
    const perSlot = Math.floor(dayBudget / chosen.length);
    let extra = dayBudget - perSlot * chosen.length;
    let dayRemaining = dayBudget;

    for (const c of chosen) {
      const mins = perSlot + (extra > 0 ? 1 : 0);
      if (extra > 0) extra--;
      const actual = Math.min(mins, c.rem);
      slots.push({ skill: c.label, minutes: actual });
      remaining[c.idx] -= actual;
      dayRemaining -= actual;
    }

    days.push({ day: DAY_NAMES[d], slots, totalMinutes: dayBudget - dayRemaining });
  }

  return {
    weekOf: new Date().toISOString().slice(0, 10), goal, grade, dailyBudget: budget,
    allocation: SKILL_AREAS.map((s, i) => ({ skill: s.label, percent: baseAlloc[i], weeklyMinutes: weeklyMinutes[i] })),
    days,
  };
}

function generateAssessment(studentId, grade) {
  grade = grade || 'grade-6';
  const questions = {};
  for (const area of SKILL_AREAS) {
    const bank = ASSESS_QUESTIONS[area.key];
    if (!bank) continue;
    let g = grade;
    if (!bank[g]) {
      const gi = VALID_GRADES.indexOf(grade);
      for (let d = 0; d <= 2; d++) {
        if (gi - d >= 0 && bank[VALID_GRADES[gi - d]]) { g = VALID_GRADES[gi - d]; break; }
        if (gi + d < VALID_GRADES.length && bank[VALID_GRADES[gi + d]]) { g = VALID_GRADES[gi + d]; break; }
      }
    }
    const items = bank[g];
    if (items && items.length) {
      questions[area.key] = { label: area.label, grade: g, questions: pick(items, 2) };
    }
  }
  return { studentId, assessmentGrade: grade, areas: questions, instructions: 'Present questions one at a time. Record scores using: record <id> <domain> <grade> <score> <total>' };
}

function algebraReadiness(studentId) {
  const agg = aggregateProgress(studentId);
  const readiness = {};
  let totalScore = 0, count = 0;
  for (const [key, config] of Object.entries(ALGEBRA_READINESS)) {
    const areaScores = config.areas.map(a => agg.skills[a]?.mastery || 0);
    const avg = areaScores.length ? Math.round(areaScores.reduce((s, v) => s + v, 0) / areaScores.length) : 0;
    readiness[key] = { label: config.label, mastery: avg, ready: avg >= 80 };
    totalScore += avg;
    count++;
  }
  const overall = count > 0 ? Math.round(totalScore / count) : 0;
  return { studentId, overallReadiness: overall, ready: overall >= 80, areas: readiness };
}

// Public API

class StudyPlanner {
  start(id, grade) {
    const p = loadProfile(id);
    if (grade) {
      if (!VALID_GRADES.includes(grade)) throw new Error(`Unknown grade: ${grade}. Valid: ${VALID_GRADES.join(', ')}`);
      p.grade = grade;
    }
    if (!p.grade) p.grade = 'grade-6';
    if (!p.goal) p.goal = 'stay-strong';
    saveProfile(p);
    return {
      action: 'start',
      profile: { studentId: p.studentId, grade: p.grade, goal: p.goal, dailyBudget: p.dailyBudget, mathAnxiety: p.mathAnxiety, strengths: p.strengths, gaps: p.gaps, createdAt: p.createdAt },
      prompt: 'Welcome! Use set-goal, set-time, and set-anxiety to customize, then run plan to generate your weekly schedule.',
    };
  }

  profile(id) {
    const p = loadProfile(id);
    const agg = aggregateProgress(id);
    return { studentId: id, grade: p.grade, goal: p.goal, dailyBudget: p.dailyBudget, mathAnxiety: p.mathAnxiety, vision: p.vision, strengths: p.strengths, gaps: p.gaps, createdAt: p.createdAt, domainProgress: agg.skills };
  }

  setGoal(id, goal) {
    if (!VALID_GOALS.includes(goal)) throw new Error(`Unknown goal: ${goal}. Valid: ${VALID_GOALS.join(', ')}`);
    const p = loadProfile(id); p.goal = goal; saveProfile(p);
    return { studentId: id, goal };
  }

  setTime(id, minutes) {
    const m = Number(minutes);
    if (!m || m < 10 || m > 120) throw new Error('Budget must be 10-120 minutes.');
    const p = loadProfile(id); p.dailyBudget = m; saveProfile(p);
    return { studentId: id, dailyBudget: m };
  }

  setAnxiety(id, level) {
    const n = Number(level);
    if (n < 1 || n > 5) throw new Error('Anxiety level must be 1-5.');
    const p = loadProfile(id); p.mathAnxiety = n; saveProfile(p);
    return { studentId: id, mathAnxiety: n };
  }

  diagnose(id) {
    const p = loadProfile(id);
    return generateAssessment(id, p.grade || 'grade-6');
  }

  plan(id) {
    const p = loadProfile(id);
    if (!p.grade) throw new Error('Set grade first: start <id> <grade>');
    const plan = generateWeeklyPlan(p);
    p.plans.push({ generated: new Date().toISOString(), plan });
    saveProfile(p);
    return plan;
  }

  today(id) {
    const p = loadProfile(id);
    const agg = aggregateProgress(id);
    const weakest = SKILL_AREAS
      .map(a => ({ ...a, mastery: agg.skills[a.key]?.mastery || 0 }))
      .sort((a, b) => a.mastery - b.mastery)
      .slice(0, 2);
    return {
      studentId: id, grade: p.grade, dailyBudget: p.dailyBudget,
      recommendation: weakest.map(w => ({ domain: w.label, mastery: w.mastery, suggestedMinutes: Math.round(p.dailyBudget / 2) })),
      tip: p.mathAnxiety && p.mathAnxiety >= 4 ? 'Start with something you feel confident about to build momentum.' : 'Focus on understanding, not just getting answers.',
    };
  }

  progress(id) {
    const p = loadProfile(id);
    const agg = aggregateProgress(id);
    return { studentId: id, grade: p.grade, goal: p.goal, skills: agg.skills, areasWithData: agg.areasWithData, areasOnTrack: agg.areasOnTrack };
  }

  algebraReady(id) { return algebraReadiness(id); }

  recordAssessment(id, domain, grade, score, total) {
    const validDomains = SKILL_AREAS.map(s => s.key);
    if (!validDomains.includes(domain)) throw new Error(`Unknown domain: ${domain}. Valid: ${validDomains.join(', ')}`);
    const sc = Number(score), tot = Number(total);
    if (!tot || tot <= 0) throw new Error('total must be positive');
    if (sc < 0 || sc > tot) throw new Error(`score must be 0-${tot}`);
    const p = loadProfile(id);
    const entry = { date: new Date().toISOString(), domain, grade, score: sc, total: tot, pct: Math.round(sc / tot * 100) };
    p.assessments.push(entry);
    const pct = entry.pct;
    const label = SKILL_AREAS.find(s => s.key === domain).label;
    if (pct >= 80 && !p.strengths.includes(label)) { p.strengths = [...new Set([...p.strengths, label])]; p.gaps = p.gaps.filter(g => g !== label); }
    else if (pct < 60 && !p.gaps.includes(label)) { p.gaps = [...new Set([...p.gaps, label])]; p.strengths = p.strengths.filter(s => s !== label); }
    saveProfile(p);
    return { studentId: id, recorded: entry, strengths: p.strengths, gaps: p.gaps };
  }

  report(id) {
    const p = loadProfile(id);
    const agg = aggregateProgress(id);
    const ar = algebraReadiness(id);
    return {
      studentId: id, grade: p.grade, goal: p.goal, dailyBudget: p.dailyBudget, mathAnxiety: p.mathAnxiety,
      strengths: p.strengths, gaps: p.gaps, skills: agg.skills,
      areasWithData: agg.areasWithData, areasOnTrack: agg.areasOnTrack,
      algebraReadiness: ar, recentAssessments: (p.assessments || []).slice(-10).reverse(),
      currentPlan: p.plans && p.plans.length ? p.plans[p.plans.length - 1].plan : null,
    };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }
}

module.exports = StudyPlanner;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const sp = new StudyPlanner();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': { const [, id, grade] = args; if (!id) throw new Error('Usage: start <id> [grade]'); out(sp.start(id, grade || undefined)); break; }
      case 'profile': { const [, id] = args; if (!id) throw new Error('Usage: profile <id>'); out(sp.profile(id)); break; }
      case 'diagnose': { const [, id] = args; if (!id) throw new Error('Usage: diagnose <id>'); out(sp.diagnose(id)); break; }
      case 'plan': { const [, id] = args; if (!id) throw new Error('Usage: plan <id>'); out(sp.plan(id)); break; }
      case 'today': { const [, id] = args; if (!id) throw new Error('Usage: today <id>'); out(sp.today(id)); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(sp.progress(id)); break; }
      case 'algebra-ready': { const [, id] = args; if (!id) throw new Error('Usage: algebra-ready <id>'); out(sp.algebraReady(id)); break; }
      case 'record': { const [, id, domain, grade, score, total] = args; if (!id || !domain || !grade || score === undefined || !total) throw new Error('Usage: record <id> <domain> <grade> <score> <total>'); out(sp.recordAssessment(id, domain, grade, Number(score), Number(total))); break; }
      case 'set-goal': { const [, id, goal] = args; if (!id || !goal) throw new Error('Usage: set-goal <id> <goal>'); out(sp.setGoal(id, goal)); break; }
      case 'set-time': { const [, id, mins] = args; if (!id || !mins) throw new Error('Usage: set-time <id> <minutes>'); out(sp.setTime(id, Number(mins))); break; }
      case 'set-anxiety': { const [, id, level] = args; if (!id || !level) throw new Error('Usage: set-anxiety <id> <level>'); out(sp.setAnxiety(id, Number(level))); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(sp.report(id)); break; }
      case 'students': { out(sp.listStudents()); break; }
      default: out({ usage: 'node study-planner.js <command> [args]', commands: ['start','profile','diagnose','plan','today','progress','algebra-ready','record','set-goal','set-time','set-anxiety','report','students'], goals: VALID_GOALS, grades: VALID_GRADES });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
