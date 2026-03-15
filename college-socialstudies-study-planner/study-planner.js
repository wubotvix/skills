// College Social Studies Study Planner — Coordinator across all college social studies skills. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-socialstudies-study-planner');
const MASTERY_THRESHOLD = 0.8;

// ── Discipline Map ───────────────────────────────────────────────────────────

const DISCIPLINES = {
  'history': { label: 'History', skill: 'college-socialstudies-history', areas: ['historiography', 'primary-sources', 'world-history', 'thematic-analysis'] },
  'economics': { label: 'Economics', skill: 'college-socialstudies-economics', areas: ['micro', 'macro', 'econometrics', 'game-theory', 'behavioral'] },
  'political-science': { label: 'Political Science', skill: 'college-socialstudies-political-science', areas: ['comparative-politics', 'international-relations', 'political-theory', 'american-politics'] },
  'psychology': { label: 'Psychology', skill: 'college-socialstudies-psychology', areas: ['cognition', 'development', 'abnormal', 'neuroscience', 'social-psychology'] },
  'sociology': { label: 'Sociology', skill: 'college-socialstudies-sociology', areas: ['social-theory', 'stratification', 'race-gender', 'methods', 'institutions'] },
  'philosophy': { label: 'Philosophy', skill: 'college-socialstudies-philosophy', areas: ['logic', 'ethics', 'epistemology', 'metaphysics', 'political-philosophy'] },
  'anthropology': { label: 'Anthropology', skill: 'college-socialstudies-anthropology', areas: ['cultural', 'biological', 'archaeology', 'linguistic'] },
};

const VALID_MAJORS = ['history', 'economics', 'political-science', 'psychology', 'sociology', 'philosophy', 'anthropology', 'pre-law', 'public-policy', 'international-relations'];

// ── Diagnostic Questions ─────────────────────────────────────────────────────

const DIAGNOSTIC_QUESTIONS = {
  'history': [
    { question: 'What is historiography?', answer: 'The study of how history is written — methods, interpretations, and debates among historians', area: 'historiography' },
    { question: 'What is the difference between a primary and secondary source?', answer: 'Primary: created during the period studied. Secondary: analyzes/interprets primary sources after the fact', area: 'primary-sources' },
  ],
  'economics': [
    { question: 'State the law of demand.', answer: 'As price increases, quantity demanded decreases (ceteris paribus)', area: 'micro' },
    { question: 'What is GDP?', answer: 'Total market value of final goods and services produced in a country in a year. GDP = C+I+G+(X-M)', area: 'macro' },
  ],
  'political-science': [
    { question: 'What is the difference between a presidential and parliamentary system?', answer: 'Presidential: separate executive/legislative. Parliamentary: executive derives from and is accountable to legislature', area: 'comparative-politics' },
    { question: 'Define sovereignty in international relations.', answer: 'Supreme authority within a territory; non-interference in internal affairs by other states', area: 'international-relations' },
  ],
  'psychology': [
    { question: 'What is the difference between classical and operant conditioning?', answer: 'Classical: associating stimuli (Pavlov). Operant: consequences shape behavior (Skinner)', area: 'cognition' },
    { question: 'Name Piaget\'s four stages of cognitive development.', answer: 'Sensorimotor, preoperational, concrete operational, formal operational', area: 'development' },
  ],
  'sociology': [
    { question: 'Compare functionalism and conflict theory.', answer: 'Functionalism: society as interconnected parts maintaining stability. Conflict: society shaped by power struggles between groups', area: 'social-theory' },
  ],
  'philosophy': [
    { question: 'What is the difference between deductive and inductive reasoning?', answer: 'Deductive: conclusion follows necessarily from premises. Inductive: conclusion is probable based on evidence', area: 'logic' },
    { question: 'State the trolley problem and its ethical significance.', answer: 'Divert trolley to save 5 but kill 1? Tests consequentialism vs deontological ethics', area: 'ethics' },
  ],
  'anthropology': [
    { question: 'Define cultural relativism.', answer: 'Understanding a culture on its own terms without judging by the standards of another culture', area: 'cultural' },
    { question: 'What are the four subfields of anthropology?', answer: 'Cultural, biological/physical, archaeology, linguistic', area: 'cultural' },
  ],
};

// ── Major-based time allocation ──────────────────────────────────────────────

const MAJOR_ALLOCATIONS = {
  'history':                  { history: 35, economics: 10, 'political-science': 15, psychology: 5, sociology: 10, philosophy: 15, anthropology: 10 },
  'economics':                { history: 10, economics: 35, 'political-science': 15, psychology: 5, sociology: 5, philosophy: 10, anthropology: 20 },
  'political-science':        { history: 15, economics: 15, 'political-science': 30, psychology: 10, sociology: 10, philosophy: 10, anthropology: 10 },
  'psychology':               { history: 5, economics: 5, 'political-science': 5, psychology: 40, sociology: 15, philosophy: 15, anthropology: 15 },
  'sociology':                { history: 10, economics: 10, 'political-science': 10, psychology: 15, sociology: 35, philosophy: 10, anthropology: 10 },
  'philosophy':               { history: 15, economics: 10, 'political-science': 10, psychology: 10, sociology: 10, philosophy: 35, anthropology: 10 },
  'anthropology':             { history: 10, economics: 5, 'political-science': 5, psychology: 10, sociology: 15, philosophy: 10, anthropology: 45 },
  'pre-law':                  { history: 15, economics: 15, 'political-science': 25, psychology: 10, sociology: 10, philosophy: 20, anthropology: 5 },
  'public-policy':            { history: 10, economics: 25, 'political-science': 25, psychology: 10, sociology: 15, philosophy: 10, anthropology: 5 },
  'international-relations':  { history: 15, economics: 15, 'political-science': 30, psychology: 5, sociology: 10, philosophy: 10, anthropology: 15 },
};

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ── File I/O ─────────────────────────────────────────────────────────────────

function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }

function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }

function loadProfile(id) {
  const fp = profilePath(id);
  if (fs.existsSync(fp)) {
    try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
    catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); }
  }
  return {
    studentId: id,
    major: null,
    goal: null,
    dailyMinutes: 60,
    createdAt: new Date().toISOString(),
    diagnosticResults: {},
    assessments: [],
    skills: {},
  };
}

function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }

// ── Helpers ──────────────────────────────────────────────────────────────────

function calcMastery(attempts) {
  if (!attempts || !attempts.length) return 0;
  const recent = attempts.slice(-5).filter(a => a.total > 0);
  return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0;
}

function masteryLabel(r) {
  return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started';
}

// ── Diagnostic ───────────────────────────────────────────────────────────────

function generateDiagnostic(id) {
  const questions = [];
  for (const [discipline, qs] of Object.entries(DIAGNOSTIC_QUESTIONS)) {
    for (const q of qs) {
      questions.push({ discipline, disciplineLabel: DISCIPLINES[discipline].label, area: q.area, question: q.question, answer: q.answer });
    }
  }
  return { studentId: id, totalQuestions: questions.length, instructions: 'Present questions ONE AT A TIME. Record results with record-diagnostic.', questions };
}

// ── Study Plan ───────────────────────────────────────────────────────────────

function createStudyPlan(id) {
  const p = loadProfile(id);
  const major = p.major || 'history';
  const alloc = MAJOR_ALLOCATIONS[major] || MAJOR_ALLOCATIONS['history'];
  const minutes = p.dailyMinutes || 60;

  const discMastery = {};
  for (const disc of Object.keys(DISCIPLINES)) {
    const diag = p.diagnosticResults[disc];
    discMastery[disc] = diag ? diag.mastery : 0;
  }

  const ranked = Object.keys(alloc).filter(k => alloc[k] > 0).sort((a, b) => alloc[b] - alloc[a] || discMastery[a] - discMastery[b]);

  const schedule = [];
  for (let d = 0; d < 7; d++) {
    if (d === 6) { schedule.push({ day: DAY_NAMES[d], type: 'rest', note: 'Rest or optional reading' }); continue; }
    if (d === 5) {
      const weakest = ranked[ranked.length - 1];
      schedule.push({ day: DAY_NAMES[d], type: 'review', discipline: weakest, label: DISCIPLINES[weakest].label, minutes, note: 'Deep review of weakest area' });
      continue;
    }
    const s1 = ranked[(d * 2) % ranked.length];
    const s2 = ranked[(d * 2 + 1) % ranked.length];
    const min1 = Math.round(minutes * 0.6);
    schedule.push({ day: DAY_NAMES[d], type: 'standard', block1: { discipline: s1, label: DISCIPLINES[s1].label, minutes: min1 }, block2: { discipline: s2, label: DISCIPLINES[s2].label, minutes: minutes - min1 } });
  }

  return {
    studentId: id, major, dailyMinutes: minutes,
    allocation: Object.fromEntries(Object.entries(alloc).filter(([, v]) => v > 0).map(([k, v]) => [DISCIPLINES[k].label, `${v}%`])),
    schedule,
    routing: Object.fromEntries(Object.entries(DISCIPLINES).map(([k, v]) => [v.label, v.skill])),
  };
}

// ── Recommendations ──────────────────────────────────────────────────────────

function getRecommendations(id) {
  const p = loadProfile(id);
  const major = p.major || 'history';
  const alloc = MAJOR_ALLOCATIONS[major] || MAJOR_ALLOCATIONS['history'];

  const recs = [];
  for (const [disc, data] of Object.entries(DISCIPLINES)) {
    const diag = p.diagnosticResults[disc];
    const mastery = diag ? diag.mastery : 0;
    const weight = alloc[disc] || 0;
    if (mastery < MASTERY_THRESHOLD && weight > 0) {
      recs.push({ discipline: disc, label: data.label, skill: data.skill, mastery, weight, priority: weight * (1 - mastery) });
    }
  }
  recs.sort((a, b) => b.priority - a.priority);
  return { studentId: id, major, recommendations: recs };
}

// ── Public API Class ─────────────────────────────────────────────────────────

class StudyPlanner {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, major: p.major, goal: p.goal, dailyMinutes: p.dailyMinutes, createdAt: p.createdAt, totalAssessments: p.assessments.length };
  }

  setMajor(id, major) {
    if (!VALID_MAJORS.includes(major)) throw new Error(`Unknown major: ${major}. Valid: ${VALID_MAJORS.join(', ')}`);
    const p = loadProfile(id); p.major = major; saveProfile(p);
    return { studentId: id, major };
  }

  setGoal(id, goal) {
    const p = loadProfile(id); p.goal = goal; saveProfile(p);
    return { studentId: id, goal };
  }

  recordDiagnostic(id, discipline, score, total) {
    if (!DISCIPLINES[discipline]) throw new Error(`Unknown discipline: ${discipline}. Valid: ${Object.keys(DISCIPLINES).join(', ')}`);
    const p = loadProfile(id);
    if (!p.diagnosticResults) p.diagnosticResults = {};
    p.diagnosticResults[discipline] = { score, total, mastery: total > 0 ? Math.round(score / total * 100) / 100 : 0, date: new Date().toISOString() };
    saveProfile(p);
    return { studentId: id, discipline, score: `${score}/${total}`, mastery: p.diagnosticResults[discipline].mastery };
  }

  generateDiagnostic(id) { return generateDiagnostic(id); }
  createStudyPlan(id) { return createStudyPlan(id); }
  getRecommendations(id) { return getRecommendations(id); }

  getProgress(id) {
    const p = loadProfile(id);
    const results = {};
    for (const [disc, data] of Object.entries(DISCIPLINES)) {
      const diag = p.diagnosticResults[disc];
      results[data.label] = { mastery: diag ? diag.mastery : 0, label: diag ? masteryLabel(diag.mastery) : 'not-started', skill: data.skill };
    }
    return { studentId: id, major: p.major, disciplines: results };
  }

  getReport(id) {
    const p = loadProfile(id);
    return {
      studentId: id, major: p.major, goal: p.goal,
      progress: this.getProgress(id),
      recommendations: getRecommendations(id).recommendations,
      diagnosticResults: p.diagnosticResults || {},
      recentAssessments: p.assessments.slice(-20).reverse(),
    };
  }

  getGoals(id) {
    const p = loadProfile(id);
    return { studentId: id, currentGoal: p.goal, major: p.major };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json') && !f.includes('.corrupt.'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }
}

module.exports = StudyPlanner;

// ── CLI ──────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const sp = new StudyPlanner();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, major] = args;
        if (!id) throw new Error('Usage: start <id> [major]');
        if (major) sp.setMajor(id, major);
        out({ action: 'start', profile: sp.getProfile(id), recommendations: sp.getRecommendations(id) });
        break;
      }
      case 'diagnostic': { const [, id] = args; if (!id) throw new Error('Usage: diagnostic <id>'); out(sp.generateDiagnostic(id)); break; }
      case 'plan': { const [, id] = args; if (!id) throw new Error('Usage: plan <id>'); out(sp.createStudyPlan(id)); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(sp.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(sp.getReport(id)); break; }
      case 'goals': { const [, id, goal] = args; if (!id) throw new Error('Usage: goals <id> [goal]'); if (goal) out(sp.setGoal(id, goal)); else out(sp.getGoals(id)); break; }
      case 'recommend': { const [, id] = args; if (!id) throw new Error('Usage: recommend <id>'); out(sp.getRecommendations(id)); break; }
      case 'students': { out(sp.listStudents()); break; }
      default: out({ usage: 'node study-planner.js <command> [args]', commands: ['start','diagnostic','plan','progress','report','goals','recommend','students'], majors: VALID_MAJORS });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
