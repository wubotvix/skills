// College Math Study Planner — Coordinator across all college math skills. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-math-study-planner');
const MASTERY_THRESHOLD = 0.8;

// ── Subject Map ──────────────────────────────────────────────────────────────

const SUBJECTS = {
  'calculus': {
    label: 'Calculus',
    skill: 'college-math-calculus',
    areas: ['limits', 'derivatives', 'integrals', 'sequences-series', 'multivariable'],
  },
  'linear-algebra': {
    label: 'Linear Algebra',
    skill: 'college-math-linear-algebra',
    areas: ['vectors-matrices', 'systems', 'vector-spaces', 'eigenvalues', 'applications'],
  },
  'differential-equations': {
    label: 'Differential Equations',
    skill: 'college-math-differential-equations',
    areas: ['first-order-odes', 'second-order-odes', 'systems-of-odes', 'laplace-transforms', 'pde-intro'],
  },
  'discrete-math': {
    label: 'Discrete Mathematics',
    skill: 'college-math-discrete-math',
    areas: ['logic-proofs', 'sets-functions', 'combinatorics', 'graph-theory', 'number-theory'],
  },
  'probability-statistics': {
    label: 'Probability & Statistics',
    skill: 'college-math-probability-statistics',
    areas: ['probability', 'distributions', 'estimation', 'hypothesis-testing', 'regression'],
  },
  'abstract-algebra': {
    label: 'Abstract Algebra',
    skill: 'college-math-abstract-algebra',
    areas: ['groups', 'rings', 'fields', 'homomorphisms', 'galois-theory'],
  },
  'real-analysis': {
    label: 'Real Analysis',
    skill: 'college-math-real-analysis',
    areas: ['sequences-series', 'topology', 'continuity', 'differentiation', 'integration'],
  },
};

const VALID_MAJORS = ['pure-math', 'applied-math', 'cs', 'engineering', 'data-science', 'physics', 'pre-med', 'business'];

// ── Prerequisite Chains ──────────────────────────────────────────────────────

const PREREQUISITES = {
  'calculus': [],
  'linear-algebra': ['calculus'],
  'differential-equations': ['calculus', 'linear-algebra'],
  'discrete-math': [],
  'probability-statistics': ['calculus'],
  'abstract-algebra': ['calculus', 'linear-algebra'],
  'real-analysis': ['calculus', 'linear-algebra'],
};

// ── Major-based time allocation (percent per subject) ────────────────────────

const MAJOR_ALLOCATIONS = {
  'pure-math':     { calculus: 15, 'linear-algebra': 15, 'differential-equations': 10, 'discrete-math': 10, 'probability-statistics': 10, 'abstract-algebra': 20, 'real-analysis': 20 },
  'applied-math':  { calculus: 20, 'linear-algebra': 20, 'differential-equations': 20, 'discrete-math': 5, 'probability-statistics': 15, 'abstract-algebra': 10, 'real-analysis': 10 },
  'cs':            { calculus: 15, 'linear-algebra': 15, 'differential-equations': 5, 'discrete-math': 30, 'probability-statistics': 20, 'abstract-algebra': 10, 'real-analysis': 5 },
  'engineering':   { calculus: 25, 'linear-algebra': 20, 'differential-equations': 25, 'discrete-math': 5, 'probability-statistics': 15, 'abstract-algebra': 5, 'real-analysis': 5 },
  'data-science':  { calculus: 15, 'linear-algebra': 25, 'differential-equations': 5, 'discrete-math': 10, 'probability-statistics': 35, 'abstract-algebra': 5, 'real-analysis': 5 },
  'physics':       { calculus: 25, 'linear-algebra': 20, 'differential-equations': 25, 'discrete-math': 5, 'probability-statistics': 10, 'abstract-algebra': 10, 'real-analysis': 5 },
  'pre-med':       { calculus: 30, 'linear-algebra': 10, 'differential-equations': 5, 'discrete-math': 10, 'probability-statistics': 35, 'abstract-algebra': 5, 'real-analysis': 5 },
  'business':      { calculus: 25, 'linear-algebra': 15, 'differential-equations': 5, 'discrete-math': 10, 'probability-statistics': 35, 'abstract-algebra': 5, 'real-analysis': 5 },
};

// ── Diagnostic Questions ─────────────────────────────────────────────────────

const DIAGNOSTIC_QUESTIONS = {
  'calculus': [
    { question: 'Find lim_{x->0} sin(x)/x.', answer: '1', area: 'limits' },
    { question: 'Find d/dx [x^3 * e^x].', answer: 'x^2 * e^x * (3 + x)', area: 'derivatives' },
    { question: 'Evaluate integral of x*cos(x) dx.', answer: 'x*sin(x) + cos(x) + C', area: 'integrals' },
    { question: 'Does sum 1/n^2 converge? What is its value?', answer: 'Yes, pi^2/6', area: 'series' },
  ],
  'linear-algebra': [
    { question: 'Find the determinant of [[1,2],[3,4]].', answer: '-2', area: 'matrices' },
    { question: 'Solve: x + 2y = 5, 3x + 4y = 11.', answer: 'x=1, y=2', area: 'systems' },
    { question: 'What are the eigenvalues of [[2,1],[0,3]]?', answer: '2 and 3', area: 'eigenvalues' },
  ],
  'differential-equations': [
    { question: "Solve dy/dx = 2y, y(0) = 1.", answer: 'y = e^{2x}', area: 'first-order' },
    { question: "Solve y'' + y = 0.", answer: 'y = c1*cos(x) + c2*sin(x)', area: 'second-order' },
  ],
  'discrete-math': [
    { question: 'How many ways to choose 3 items from 10?', answer: '120', area: 'combinatorics' },
    { question: 'Is (p -> q) equivalent to (not p or q)?', answer: 'yes', area: 'logic' },
  ],
  'probability-statistics': [
    { question: 'If X ~ Bin(10, 0.5), what is E[X]?', answer: '5', area: 'distributions' },
    { question: 'State Bayes theorem in words.', answer: 'Posterior is proportional to likelihood times prior', area: 'probability' },
  ],
  'abstract-algebra': [
    { question: 'What is |S_3|?', answer: '6', area: 'groups' },
    { question: 'Is Z_6 an integral domain?', answer: 'no', area: 'rings' },
  ],
  'real-analysis': [
    { question: 'State the epsilon-N definition of sequence convergence.', answer: 'For all epsilon > 0, exists N such that n >= N implies |a_n - L| < epsilon', area: 'sequences' },
    { question: 'Is [0,1] compact in R?', answer: 'yes, by Heine-Borel', area: 'topology' },
  ],
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

function norm(s) { return String(s).toLowerCase().trim().replace(/\s+/g, ' '); }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ── Diagnostic ───────────────────────────────────────────────────────────────

function generateDiagnostic(id) {
  const questions = [];
  for (const [subject, qs] of Object.entries(DIAGNOSTIC_QUESTIONS)) {
    for (const q of qs) {
      questions.push({
        subject,
        subjectLabel: SUBJECTS[subject].label,
        area: q.area,
        question: q.question,
        answer: q.answer,
      });
    }
  }
  return {
    studentId: id,
    totalQuestions: questions.length,
    instructions: 'Present questions ONE AT A TIME. Record results with record-diagnostic after each answer.',
    questions,
  };
}

// ── Study Plan Generation ────────────────────────────────────────────────────

function createStudyPlan(id) {
  const p = loadProfile(id);
  const major = p.major || 'applied-math';
  const alloc = MAJOR_ALLOCATIONS[major] || MAJOR_ALLOCATIONS['applied-math'];
  const minutes = p.dailyMinutes || 60;

  // Rank subjects by allocation weight (descending), then weakness
  const subjectMastery = {};
  for (const subject of Object.keys(SUBJECTS)) {
    const diag = p.diagnosticResults[subject];
    subjectMastery[subject] = diag ? diag.mastery : 0;
  }

  const ranked = Object.keys(alloc).sort((a, b) => {
    const diff = alloc[b] - alloc[a];
    return diff !== 0 ? diff : subjectMastery[a] - subjectMastery[b];
  });

  // Build weekly schedule
  const schedule = [];
  for (let d = 0; d < 7; d++) {
    if (d === 6) {
      schedule.push({ day: DAY_NAMES[d], type: 'rest', note: 'Rest or optional review' });
      continue;
    }
    if (d === 5) {
      const weakest = ranked[ranked.length - 1];
      schedule.push({
        day: DAY_NAMES[d],
        type: 'review',
        subject: weakest,
        label: SUBJECTS[weakest].label,
        minutes,
        note: 'Deep review of weakest area',
      });
      continue;
    }
    const s1 = ranked[(d * 2) % ranked.length];
    const s2 = ranked[(d * 2 + 1) % ranked.length];
    const min1 = Math.round(minutes * 0.6);
    const min2 = minutes - min1;
    schedule.push({
      day: DAY_NAMES[d],
      type: 'standard',
      block1: { subject: s1, label: SUBJECTS[s1].label, minutes: min1 },
      block2: { subject: s2, label: SUBJECTS[s2].label, minutes: min2 },
    });
  }

  return {
    studentId: id,
    major,
    dailyMinutes: minutes,
    allocation: Object.fromEntries(Object.entries(alloc).map(([k, v]) => [SUBJECTS[k].label, `${v}%`])),
    schedule,
    routing: Object.fromEntries(Object.entries(SUBJECTS).map(([k, v]) => [v.label, v.skill])),
  };
}

// ── Recommendations ──────────────────────────────────────────────────────────

function getRecommendations(id) {
  const p = loadProfile(id);
  const major = p.major || 'applied-math';
  const alloc = MAJOR_ALLOCATIONS[major] || MAJOR_ALLOCATIONS['applied-math'];

  const recs = [];
  for (const [subject, data] of Object.entries(SUBJECTS)) {
    const diag = p.diagnosticResults[subject];
    const mastery = diag ? diag.mastery : 0;
    const weight = alloc[subject] || 0;
    if (mastery < MASTERY_THRESHOLD) {
      // Check prerequisites
      const prereqs = PREREQUISITES[subject] || [];
      const prereqsMet = prereqs.every(pr => {
        const prDiag = p.diagnosticResults[pr];
        return prDiag && prDiag.mastery >= 0.5;
      });
      recs.push({
        subject,
        label: data.label,
        skill: data.skill,
        mastery,
        weight,
        prereqsMet,
        priority: prereqsMet ? weight * (1 - mastery) : 0,
      });
    }
  }

  recs.sort((a, b) => b.priority - a.priority);
  return { studentId: id, major, recommendations: recs };
}

// ── Public API Class ─────────────────────────────────────────────────────────

class StudyPlanner {
  getProfile(id) {
    const p = loadProfile(id);
    return {
      studentId: p.studentId,
      major: p.major,
      goal: p.goal,
      dailyMinutes: p.dailyMinutes,
      createdAt: p.createdAt,
      totalAssessments: p.assessments.length,
    };
  }

  setMajor(id, major) {
    if (!VALID_MAJORS.includes(major)) throw new Error(`Unknown major: ${major}. Valid: ${VALID_MAJORS.join(', ')}`);
    const p = loadProfile(id);
    p.major = major;
    saveProfile(p);
    return { studentId: id, major };
  }

  setGoal(id, goal) {
    const p = loadProfile(id);
    p.goal = goal;
    saveProfile(p);
    return { studentId: id, goal };
  }

  recordDiagnostic(id, subject, score, total) {
    if (!SUBJECTS[subject]) throw new Error(`Unknown subject: ${subject}. Valid: ${Object.keys(SUBJECTS).join(', ')}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    const p = loadProfile(id);
    if (!p.diagnosticResults) p.diagnosticResults = {};
    p.diagnosticResults[subject] = { score, total, mastery: total > 0 ? Math.round(score / total * 100) / 100 : 0, date: new Date().toISOString() };
    saveProfile(p);
    return { studentId: id, subject, score: `${score}/${total}`, mastery: p.diagnosticResults[subject].mastery };
  }

  generateDiagnostic(id) { return generateDiagnostic(id); }

  createStudyPlan(id) { return createStudyPlan(id); }

  getRecommendations(id) { return getRecommendations(id); }

  getProgress(id) {
    const p = loadProfile(id);
    const results = {};
    for (const [subject, data] of Object.entries(SUBJECTS)) {
      const diag = p.diagnosticResults[subject];
      results[data.label] = {
        mastery: diag ? diag.mastery : 0,
        label: diag ? masteryLabel(diag.mastery) : 'not-started',
        skill: data.skill,
      };
    }
    return { studentId: id, major: p.major, subjects: results };
  }

  getReport(id) {
    const p = loadProfile(id);
    return {
      studentId: id,
      major: p.major,
      goal: p.goal,
      progress: this.getProgress(id),
      recommendations: getRecommendations(id).recommendations,
      diagnosticResults: p.diagnosticResults || {},
      recentAssessments: p.assessments.slice(-20).reverse(),
      prerequisites: PREREQUISITES,
    };
  }

  getGoals(id) {
    const p = loadProfile(id);
    return { studentId: id, currentGoal: p.goal, major: p.major };
  }

  generateSchedule(id, hours) {
    const p = loadProfile(id);
    if (hours) { p.dailyMinutes = hours * 60; saveProfile(p); }
    return createStudyPlan(id);
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
      case 'diagnostic': {
        const [, id] = args;
        if (!id) throw new Error('Usage: diagnostic <id>');
        out(sp.generateDiagnostic(id));
        break;
      }
      case 'plan': {
        const [, id] = args;
        if (!id) throw new Error('Usage: plan <id>');
        out(sp.createStudyPlan(id));
        break;
      }
      case 'progress': {
        const [, id] = args;
        if (!id) throw new Error('Usage: progress <id>');
        out(sp.getProgress(id));
        break;
      }
      case 'report': {
        const [, id] = args;
        if (!id) throw new Error('Usage: report <id>');
        out(sp.getReport(id));
        break;
      }
      case 'goals': {
        const [, id, goal] = args;
        if (!id) throw new Error('Usage: goals <id> [goal]');
        if (goal) { out(sp.setGoal(id, goal)); }
        else { out(sp.getGoals(id)); }
        break;
      }
      case 'recommend': {
        const [, id] = args;
        if (!id) throw new Error('Usage: recommend <id>');
        out(sp.getRecommendations(id));
        break;
      }
      case 'schedule': {
        const [, id, hours] = args;
        if (!id) throw new Error('Usage: schedule <id> [hours]');
        out(sp.generateSchedule(id, hours ? Number(hours) : null));
        break;
      }
      case 'students': {
        out(sp.listStudents());
        break;
      }
      default: {
        out({
          usage: 'node study-planner.js <command> [args]',
          commands: ['start', 'diagnostic', 'plan', 'progress', 'report', 'goals', 'recommend', 'schedule', 'students'],
          majors: VALID_MAJORS,
        });
      }
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
