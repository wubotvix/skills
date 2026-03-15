// College Science Study Planner — Coordinator across all college science skills. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-science-study-planner');
const MASTERY_THRESHOLD = 0.8;

// ── Domain Map ───────────────────────────────────────────────────────────────

const DOMAINS = {
  'biology': { label: 'Biology', skill: 'college-science-biology', areas: ['molecular-biology', 'cell-biology', 'genetics', 'evolution', 'ecology', 'physiology'] },
  'chemistry': { label: 'Chemistry', skill: 'college-science-chemistry', areas: ['general-chemistry', 'organic-chemistry', 'biochemistry', 'analytical-chemistry', 'physical-chemistry'] },
  'physics': { label: 'Physics', skill: 'college-science-physics', areas: ['mechanics', 'thermodynamics', 'electromagnetism', 'optics-waves', 'modern-physics'] },
  'earth-space': { label: 'Earth & Space', skill: 'college-science-earth-space', areas: ['geology', 'atmospheric-science', 'oceanography', 'planetary-science', 'environmental-science'] },
  'engineering': { label: 'Engineering', skill: 'college-science-engineering', areas: ['statics-dynamics', 'thermodynamics', 'fluid-mechanics', 'materials-science', 'circuits'] },
  'research-methods': { label: 'Research Methods', skill: 'college-science-research-methods', areas: ['experimental-design', 'statistics', 'scientific-writing', 'literature-review', 'ethics'] },
  'interdisciplinary': { label: 'Interdisciplinary', skill: 'college-science-interdisciplinary', areas: ['biophysics', 'biochemistry', 'environmental-engineering', 'computational-science', 'science-policy'] },
};

const VALID_MAJORS = ['biology', 'chemistry', 'physics', 'earth-science', 'engineering', 'pre-med', 'environmental-science', 'data-science', 'neuroscience'];

// ── Diagnostic Questions ─────────────────────────────────────────────────────

const DIAGNOSTIC_QUESTIONS = {
  'biology': [
    { question: 'What is the central dogma of molecular biology?', answer: 'DNA -> RNA -> Protein', area: 'molecular-biology' },
    { question: 'What are the products of cellular respiration?', answer: 'CO2, H2O, and ATP', area: 'cell-biology' },
    { question: 'State Hardy-Weinberg conditions.', answer: 'Large population, random mating, no mutation, no migration, no selection', area: 'genetics' },
  ],
  'chemistry': [
    { question: 'Balance: Fe + O2 -> Fe2O3', answer: '4Fe + 3O2 -> 2Fe2O3', area: 'general-chemistry' },
    { question: 'What type of reaction is an SN2 mechanism?', answer: 'Nucleophilic substitution, bimolecular, one step with inversion', area: 'organic-chemistry' },
  ],
  'physics': [
    { question: 'A 2kg object accelerates at 3 m/s^2. What net force acts on it?', answer: '6 N', area: 'mechanics' },
    { question: 'State the first law of thermodynamics.', answer: 'dU = Q - W (internal energy change = heat in minus work out)', area: 'thermodynamics' },
  ],
  'earth-space': [
    { question: 'Name the three types of plate boundaries.', answer: 'Divergent, convergent, transform', area: 'geology' },
    { question: 'What causes the seasons on Earth?', answer: 'Axial tilt (23.5 degrees) relative to orbital plane', area: 'planetary-science' },
  ],
  'engineering': [
    { question: 'What are the conditions for static equilibrium?', answer: 'Sum of forces = 0 and sum of moments = 0', area: 'statics' },
  ],
  'research-methods': [
    { question: 'What is the difference between independent and dependent variables?', answer: 'Independent is manipulated; dependent is measured (the outcome)', area: 'experimental-design' },
  ],
  'interdisciplinary': [
    { question: 'What is bioinformatics?', answer: 'Application of computational tools to analyze biological data (genomics, proteomics)', area: 'computational-science' },
  ],
};

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ── Major-based time allocation ──────────────────────────────────────────────

const MAJOR_ALLOCATIONS = {
  'biology':              { biology: 30, chemistry: 20, physics: 10, 'earth-space': 5, engineering: 0, 'research-methods': 20, interdisciplinary: 15 },
  'chemistry':            { biology: 10, chemistry: 35, physics: 15, 'earth-space': 5, engineering: 5, 'research-methods': 15, interdisciplinary: 15 },
  'physics':              { biology: 5, chemistry: 10, physics: 35, 'earth-space': 5, engineering: 15, 'research-methods': 15, interdisciplinary: 15 },
  'earth-science':        { biology: 10, chemistry: 15, physics: 10, 'earth-space': 30, engineering: 5, 'research-methods': 15, interdisciplinary: 15 },
  'engineering':          { biology: 5, chemistry: 10, physics: 25, 'earth-space': 5, engineering: 30, 'research-methods': 10, interdisciplinary: 15 },
  'pre-med':              { biology: 30, chemistry: 25, physics: 15, 'earth-space': 0, engineering: 0, 'research-methods': 20, interdisciplinary: 10 },
  'environmental-science': { biology: 20, chemistry: 15, physics: 10, 'earth-space': 25, engineering: 5, 'research-methods': 15, interdisciplinary: 10 },
  'data-science':         { biology: 10, chemistry: 10, physics: 10, 'earth-space': 5, engineering: 5, 'research-methods': 30, interdisciplinary: 30 },
  'neuroscience':         { biology: 30, chemistry: 15, physics: 10, 'earth-space': 0, engineering: 5, 'research-methods': 20, interdisciplinary: 20 },
};

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

function norm(s) { return String(s).toLowerCase().trim().replace(/\s+/g, ' '); }

// ── Diagnostic ───────────────────────────────────────────────────────────────

function generateDiagnostic(id) {
  const questions = [];
  for (const [domain, qs] of Object.entries(DIAGNOSTIC_QUESTIONS)) {
    for (const q of qs) {
      questions.push({ domain, domainLabel: DOMAINS[domain].label, area: q.area, question: q.question, answer: q.answer });
    }
  }
  return { studentId: id, totalQuestions: questions.length, instructions: 'Present questions ONE AT A TIME. Record results with record-diagnostic.', questions };
}

// ── Study Plan ───────────────────────────────────────────────────────────────

function createStudyPlan(id, hours) {
  const p = loadProfile(id);
  if (hours) { p.dailyMinutes = hours * 60; saveProfile(p); }
  const major = p.major || 'biology';
  const alloc = MAJOR_ALLOCATIONS[major] || MAJOR_ALLOCATIONS['biology'];
  const minutes = p.dailyMinutes || 60;

  const domainMastery = {};
  for (const domain of Object.keys(DOMAINS)) {
    const diag = p.diagnosticResults[domain];
    domainMastery[domain] = diag ? diag.mastery : 0;
  }

  const ranked = Object.keys(alloc).filter(k => alloc[k] > 0).sort((a, b) => alloc[b] - alloc[a] || domainMastery[a] - domainMastery[b]);

  const schedule = [];
  for (let d = 0; d < 7; d++) {
    if (d === 6) { schedule.push({ day: DAY_NAMES[d], type: 'rest', note: 'Rest or optional review' }); continue; }
    if (d === 5) {
      const weakest = ranked[ranked.length - 1];
      schedule.push({ day: DAY_NAMES[d], type: 'review', domain: weakest, label: DOMAINS[weakest].label, minutes, note: 'Deep review of weakest domain' });
      continue;
    }
    const s1 = ranked[(d * 2) % ranked.length];
    const s2 = ranked[(d * 2 + 1) % ranked.length];
    const min1 = Math.round(minutes * 0.6);
    schedule.push({ day: DAY_NAMES[d], type: 'standard', block1: { domain: s1, label: DOMAINS[s1].label, minutes: min1 }, block2: { domain: s2, label: DOMAINS[s2].label, minutes: minutes - min1 } });
  }

  return {
    studentId: id, major, dailyMinutes: minutes,
    allocation: Object.fromEntries(Object.entries(alloc).filter(([, v]) => v > 0).map(([k, v]) => [DOMAINS[k].label, `${v}%`])),
    schedule,
    routing: Object.fromEntries(Object.entries(DOMAINS).map(([k, v]) => [v.label, v.skill])),
  };
}

// ── Recommendations ──────────────────────────────────────────────────────────

function getRecommendations(id) {
  const p = loadProfile(id);
  const major = p.major || 'biology';
  const alloc = MAJOR_ALLOCATIONS[major] || MAJOR_ALLOCATIONS['biology'];

  const recs = [];
  for (const [domain, data] of Object.entries(DOMAINS)) {
    const diag = p.diagnosticResults[domain];
    const mastery = diag ? diag.mastery : 0;
    const weight = alloc[domain] || 0;
    if (mastery < MASTERY_THRESHOLD && weight > 0) {
      recs.push({ domain, label: data.label, skill: data.skill, mastery, weight, priority: weight * (1 - mastery) });
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

  recordDiagnostic(id, domain, score, total) {
    if (!DOMAINS[domain]) throw new Error(`Unknown domain: ${domain}. Valid: ${Object.keys(DOMAINS).join(', ')}`);
    const p = loadProfile(id);
    if (!p.diagnosticResults) p.diagnosticResults = {};
    p.diagnosticResults[domain] = { score, total, mastery: total > 0 ? Math.round(score / total * 100) / 100 : 0, date: new Date().toISOString() };
    saveProfile(p);
    return { studentId: id, domain, score: `${score}/${total}`, mastery: p.diagnosticResults[domain].mastery };
  }

  generateDiagnostic(id) { return generateDiagnostic(id); }
  createStudyPlan(id, hours) { return createStudyPlan(id, hours); }
  getRecommendations(id) { return getRecommendations(id); }

  getProgress(id) {
    const p = loadProfile(id);
    const results = {};
    for (const [domain, data] of Object.entries(DOMAINS)) {
      const diag = p.diagnosticResults[domain];
      results[data.label] = { mastery: diag ? diag.mastery : 0, label: diag ? masteryLabel(diag.mastery) : 'not-started', skill: data.skill };
    }
    return { studentId: id, major: p.major, domains: results };
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
      case 'plan': { const [, id, hours] = args; if (!id) throw new Error('Usage: plan <id> [hours]'); out(sp.createStudyPlan(id, hours ? Number(hours) : null)); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(sp.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(sp.getReport(id)); break; }
      case 'goals': { const [, id, goal] = args; if (!id) throw new Error('Usage: goals <id> [goal]'); if (goal) out(sp.setGoal(id, goal)); else out(sp.getGoals(id)); break; }
      case 'recommend': { const [, id] = args; if (!id) throw new Error('Usage: recommend <id>'); out(sp.getRecommendations(id)); break; }
      case 'students': { out(sp.listStudents()); break; }
      default: out({ usage: 'node study-planner.js <command> [args]', commands: ['start','diagnostic','plan','progress','report','goals','recommend','students'], majors: VALID_MAJORS });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
