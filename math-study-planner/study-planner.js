// Math Study Planner — Coordinator across K-6 math skills. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'math-study-planner');
const MASTERY_THRESHOLD = 0.8;

// ── Subject Map ──────────────────────────────────────────────────────────────

const SUBJECTS = {
  'number-sense': {
    label: 'Number Sense',
    'kindergarten': ['counting-to-20', 'number-recognition', 'comparing-numbers', 'one-more-one-less'],
    'grade-1': ['place-value-tens-ones', 'number-line-to-100', 'skip-counting-2-5-10', 'comparing-two-digit'],
    'grade-2': ['place-value-hundreds', 'skip-counting-3-4', 'expanded-form', 'comparing-three-digit'],
    'grade-3': ['rounding-nearest-10-100', 'place-value-thousands', 'number-patterns-100s', 'comparing-four-digit'],
    'grade-4': ['place-value-millions', 'rounding-any-place', 'roman-numerals', 'comparing-large-numbers'],
    'grade-5': ['decimal-place-value', 'powers-of-ten', 'comparing-decimals', 'rounding-decimals'],
    'grade-6': ['integers-number-line', 'absolute-value', 'rational-numbers', 'ordering-rational'],
  },
  'operations': {
    label: 'Operations',
    'kindergarten': ['addition-within-5', 'subtraction-within-5', 'composing-decomposing-to-10'],
    'grade-1': ['addition-within-20', 'subtraction-within-20', 'fact-families', 'adding-tens'],
    'grade-2': ['addition-within-100', 'subtraction-within-100', 'intro-multiplication', 'intro-division'],
    'grade-3': ['multiply-within-100', 'divide-within-100', 'multi-digit-addition', 'multi-digit-subtraction'],
    'grade-4': ['multi-digit-multiplication', 'long-division', 'factors-multiples', 'order-of-operations-intro'],
    'grade-5': ['decimal-addition', 'decimal-subtraction', 'decimal-multiplication', 'decimal-division'],
    'grade-6': ['integer-addition', 'integer-subtraction', 'integer-multiply-divide', 'order-of-operations'],
  },
  'fractions': {
    label: 'Fractions',
    'kindergarten': ['equal-shares-intro'],
    'grade-1': ['halves-quarters', 'equal-parts-of-shapes'],
    'grade-2': ['fractions-of-shapes', 'naming-unit-fractions', 'equal-shares-word-problems'],
    'grade-3': ['unit-fractions', 'fractions-on-number-line', 'comparing-fractions-same-denom', 'equivalent-fractions-intro'],
    'grade-4': ['equivalent-fractions', 'comparing-unlike-fractions', 'add-subtract-like-fractions', 'mixed-numbers'],
    'grade-5': ['add-subtract-unlike-fractions', 'multiply-fractions', 'divide-fractions-intro', 'fractions-decimals-percents'],
    'grade-6': ['divide-fractions', 'ratio-intro', 'proportional-reasoning', 'percent-applications'],
  },
  'geometry': {
    label: 'Geometry',
    'kindergarten': ['basic-shapes-2d', 'positional-words', 'shape-sorting'],
    'grade-1': ['attributes-of-shapes', '2d-vs-3d', 'composing-shapes', 'partitioning-shapes'],
    'grade-2': ['polygon-names', 'faces-edges-vertices', 'symmetry-intro', 'shape-patterns'],
    'grade-3': ['perimeter', 'quadrilateral-types', 'angles-intro', 'area-intro'],
    'grade-4': ['angle-measurement', 'line-symmetry', 'parallel-perpendicular', 'classifying-triangles'],
    'grade-5': ['coordinate-plane', 'volume-rectangular-prism', 'classifying-2d-shapes', 'hierarchy-of-shapes'],
    'grade-6': ['area-triangles-polygons', 'surface-area', 'volume-3d-shapes', 'coordinate-geometry'],
  },
  'measurement-data': {
    label: 'Measurement & Data',
    'kindergarten': ['comparing-lengths', 'sorting-objects', 'counting-data'],
    'grade-1': ['measuring-length-units', 'telling-time-hour', 'picture-graphs', 'bar-graphs-intro'],
    'grade-2': ['measuring-inches-cm', 'telling-time-5min', 'money-coins-bills', 'line-plots-intro'],
    'grade-3': ['measurement-conversions', 'elapsed-time', 'scaled-bar-graphs', 'area-measurement'],
    'grade-4': ['unit-conversions', 'angle-measurement-tools', 'line-plots-fractions', 'data-interpretation'],
    'grade-5': ['volume-units', 'metric-conversions', 'mean-median-mode', 'line-graphs'],
    'grade-6': ['statistical-measures', 'box-plots', 'histograms', 'variability'],
  },
  'word-problems': {
    label: 'Word Problems',
    'kindergarten': ['add-subtract-story-within-5', 'more-fewer-comparisons'],
    'grade-1': ['add-subtract-story-within-20', 'comparison-word-problems', 'missing-addend'],
    'grade-2': ['two-step-add-subtract', 'multiplication-stories', 'money-word-problems'],
    'grade-3': ['multi-step-problems', 'multiplication-division-stories', 'fraction-word-problems-intro'],
    'grade-4': ['multi-step-all-operations', 'fraction-word-problems', 'measurement-word-problems'],
    'grade-5': ['decimal-word-problems', 'fraction-operation-stories', 'percent-word-problems-intro'],
    'grade-6': ['ratio-word-problems', 'percent-word-problems', 'equation-word-problems', 'multi-concept-problems'],
  },
  'patterns-algebra': {
    label: 'Patterns & Algebra',
    'kindergarten': ['ab-abc-patterns', 'extending-patterns', 'what-comes-next'],
    'grade-1': ['growing-patterns', 'skip-count-patterns', 'number-sentences'],
    'grade-2': ['repeating-vs-growing', 'missing-number-equations', 'odd-even-patterns'],
    'grade-3': ['number-patterns', 'input-output-tables-intro', 'properties-of-operations'],
    'grade-4': ['input-output-tables', 'number-sequences', 'expression-writing', 'distributive-property'],
    'grade-5': ['variables-expressions', 'evaluating-expressions', 'graphing-patterns', 'two-operation-equations'],
    'grade-6': ['one-step-equations', 'inequalities', 'dependent-independent-variables', 'linear-relationships'],
  },
};

// ── Diagnostic Questions ─────────────────────────────────────────────────────

const DIAGNOSTIC_QUESTIONS = {
  'number-sense': {
    'kindergarten': { question: 'Count these dots: * * * * * * *', answer: '7', type: 'short' },
    'grade-1': { question: 'What number is 10 more than 47?', answer: '57', type: 'short' },
    'grade-2': { question: 'Put these in order from least to greatest: 356, 365, 305', answer: '305, 356, 365', type: 'short' },
    'grade-3': { question: 'Round 467 to the nearest hundred.', answer: '500', type: 'short' },
    'grade-4': { question: 'Write 40,000 + 3,000 + 200 + 5 as one number.', answer: '43205', type: 'short' },
    'grade-5': { question: 'Which is greater: 0.45 or 0.405?', answer: '0.45', type: 'short' },
    'grade-6': { question: 'Order these from least to greatest: -3, 1.5, -0.5, 0', answer: '-3, -0.5, 0, 1.5', type: 'short' },
  },
  'operations': {
    'kindergarten': { question: '3 + 2 = ?', answer: '5', type: 'short' },
    'grade-1': { question: '14 - 8 = ?', answer: '6', type: 'short' },
    'grade-2': { question: 'There are 5 rows with 3 stars each. How many stars?', answer: '15', type: 'short' },
    'grade-3': { question: '7 x 8 = ?', answer: '56', type: 'short' },
    'grade-4': { question: '3,456 x 7 = ?', answer: '24192', type: 'short' },
    'grade-5': { question: '144 / 12 = ?', answer: '12', type: 'short' },
    'grade-6': { question: 'Evaluate: 3 + 4 x 2 - 1', answer: '10', type: 'short' },
  },
  'fractions': {
    'kindergarten': { question: 'If you cut a sandwich into 2 equal pieces, how many pieces do you have?', answer: '2', type: 'short' },
    'grade-1': { question: 'If you cut a pizza into 4 equal slices and eat 1, how many are left?', answer: '3', type: 'short' },
    'grade-2': { question: 'What fraction of a shape is shaded if 1 out of 3 equal parts is shaded?', answer: '1/3', type: 'short' },
    'grade-3': { question: 'Which is larger: 3/4 or 2/4?', answer: '3/4', type: 'short' },
    'grade-4': { question: 'Which is larger: 3/8 or 3/4?', answer: '3/4', type: 'short' },
    'grade-5': { question: '2/3 + 1/4 = ?', answer: '11/12', type: 'short' },
    'grade-6': { question: '3/4 divided by 2/3 = ?', answer: '9/8', type: 'short' },
  },
  'geometry': {
    'kindergarten': { question: 'How many sides does a triangle have?', answer: '3', type: 'short' },
    'grade-1': { question: 'How many sides does a hexagon have?', answer: '6', type: 'short' },
    'grade-2': { question: 'How many faces does a cube have?', answer: '6', type: 'short' },
    'grade-3': { question: 'What is the perimeter of a rectangle that is 5 cm by 3 cm?', answer: '16', type: 'short' },
    'grade-4': { question: 'How many lines of symmetry does a square have?', answer: '4', type: 'short' },
    'grade-5': { question: 'Find the volume of a box that is 4 x 3 x 2.', answer: '24', type: 'short' },
    'grade-6': { question: 'What is the area of a triangle with base 10 and height 6?', answer: '30', type: 'short' },
  },
  'measurement-data': {
    'kindergarten': { question: 'Which is longer: your arm or your finger?', answer: 'arm', type: 'short' },
    'grade-1': { question: 'What time does a clock show when the big hand is on 12 and the little hand is on 3?', answer: '3:00', type: 'short' },
    'grade-2': { question: 'You have 3 quarters and 2 dimes. How many cents is that?', answer: '95', type: 'short' },
    'grade-3': { question: 'How many inches are in 2 feet?', answer: '24', type: 'short' },
    'grade-4': { question: 'Convert 3 feet to inches.', answer: '36', type: 'short' },
    'grade-5': { question: 'What is the mean of: 4, 7, 3, 6, 5?', answer: '5', type: 'short' },
    'grade-6': { question: 'A box plot shows Q1=20, median=25, Q3=35. What is the IQR?', answer: '15', type: 'short' },
  },
  'word-problems': {
    'kindergarten': { question: 'You have 4 apples. Your friend gives you 2 more. How many now?', answer: '6', type: 'short' },
    'grade-1': { question: 'Sam had 15 stickers. He gave 7 away. How many does he have left?', answer: '8', type: 'short' },
    'grade-2': { question: 'There are 6 bags with 4 cookies each. How many cookies in all?', answer: '24', type: 'short' },
    'grade-3': { question: 'Maria read 23 pages Monday and 31 Tuesday. Her book has 100 pages. How many pages are left?', answer: '46', type: 'short' },
    'grade-4': { question: 'A pizza has 8 slices. Tom eats 3 and Sara eats 2. What fraction is left?', answer: '3/8', type: 'short' },
    'grade-5': { question: 'A store has a 20% off sale. A shirt costs $35. What is the sale price?', answer: '28', type: 'short' },
    'grade-6': { question: 'A train travels 60 mph for 2.5 hours. How far does it go?', answer: '150', type: 'short' },
  },
  'patterns-algebra': {
    'kindergarten': { question: 'What comes next? red, blue, red, blue, red, ___', answer: 'blue', type: 'short' },
    'grade-1': { question: 'What are the next 3 numbers? 2, 4, 6, 8, ___, ___, ___', answer: '10, 12, 14', type: 'short' },
    'grade-2': { question: 'Fill in: 5 + ___ = 12', answer: '7', type: 'short' },
    'grade-3': { question: 'Find the next number: 3, 6, 12, 24, ___', answer: '48', type: 'short' },
    'grade-4': { question: 'Input -> Output: 1->3, 2->5, 3->7, 4->___', answer: '9', type: 'short' },
    'grade-5': { question: "Write an expression: 'five less than three times a number n'", answer: '3n - 5', type: 'short' },
    'grade-6': { question: 'Solve: 2x + 3 = 11', answer: '4', type: 'short' },
  },
};

// ── Goal-based time allocation (percent per subject) ─────────────────────────

const GOAL_ALLOCATIONS = {
  'catch-up':     { 'number-sense': 20, operations: 25, fractions: 15, geometry: 10, 'measurement-data': 10, 'word-problems': 15, 'patterns-algebra': 5 },
  'stay-strong':  { 'number-sense': 15, operations: 15, fractions: 15, geometry: 15, 'measurement-data': 15, 'word-problems': 15, 'patterns-algebra': 10 },
  'get-ahead':    { 'number-sense': 10, operations: 10, fractions: 15, geometry: 15, 'measurement-data': 10, 'word-problems': 20, 'patterns-algebra': 20 },
  'competition':  { 'number-sense': 5,  operations: 10, fractions: 15, geometry: 15, 'measurement-data': 5,  'word-problems': 30, 'patterns-algebra': 20 },
  'real-world':   { 'number-sense': 15, operations: 15, fractions: 15, geometry: 10, 'measurement-data': 20, 'word-problems': 20, 'patterns-algebra': 5 },
};

const VALID_GOALS = Object.keys(GOAL_ALLOCATIONS);
const VALID_GRADES = ['kindergarten', 'grade-1', 'grade-2', 'grade-3', 'grade-4', 'grade-5', 'grade-6'];
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
    grade: null,
    goal: 'stay-strong',
    dailyMinutes: 20,
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

function norm(s) { return String(s).toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^a-z0-9/. -]/g, ''); }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }

function gradeIndex(g) { return g === 'kindergarten' ? 0 : Number(g.replace('grade-', '')); }

function gradeLabel(g) { return g === 'kindergarten' ? 'Kindergarten' : `Grade ${g.replace('grade-', '')}`; }

// ── Diagnostic ───────────────────────────────────────────────────────────────

function generateDiagnostic(id) {
  const p = loadProfile(id);
  const grade = p.grade || 'kindergarten';
  const gi = gradeIndex(grade);
  const startGrade = gi > 0 ? VALID_GRADES[gi - 1] : 'kindergarten';

  const questions = [];
  for (const [subject, gradeQuestions] of Object.entries(DIAGNOSTIC_QUESTIONS)) {
    // Start one grade below, then go up to one above
    const testGrades = [];
    const si = VALID_GRADES.indexOf(startGrade);
    for (let i = si; i < Math.min(si + 3, VALID_GRADES.length); i++) {
      testGrades.push(VALID_GRADES[i]);
    }
    for (const tg of testGrades) {
      if (gradeQuestions[tg]) {
        questions.push({
          subject,
          subjectLabel: SUBJECTS[subject].label,
          grade: tg,
          gradeLabel: gradeLabel(tg),
          ...gradeQuestions[tg],
        });
      }
    }
  }

  return {
    studentId: id,
    currentGrade: grade,
    startingAt: startGrade,
    totalQuestions: questions.length,
    instructions: 'Present questions ONE AT A TIME. Record score 0-5 using mediation levels. Run record after each answer.',
    questions,
  };
}

// ── Study Plan Generation ────────────────────────────────────────────────────

function createStudyPlan(id, goal) {
  const p = loadProfile(id);
  const grade = p.grade || 'kindergarten';
  const g = goal || p.goal || 'stay-strong';
  if (!GOAL_ALLOCATIONS[g]) {
    return { error: `Unknown goal: ${g}. Valid: ${VALID_GOALS.join(', ')}` };
  }

  const alloc = GOAL_ALLOCATIONS[g];
  const minutes = p.dailyMinutes || 20;

  // Rank subjects by weakness (lowest mastery first)
  const subjectMastery = {};
  for (const subject of Object.keys(SUBJECTS)) {
    const skills = SUBJECTS[subject][grade] || [];
    let total = 0, count = 0;
    for (const sk of skills) {
      const key = `${grade}/${subject}/${sk}`;
      const d = p.skills[key];
      total += d ? d.mastery : 0;
      count++;
    }
    subjectMastery[subject] = count > 0 ? total / count : 0;
  }

  // Sort subjects by allocation weight (descending), then weakness
  const ranked = Object.keys(alloc).sort((a, b) => {
    const diff = alloc[b] - alloc[a];
    return diff !== 0 ? diff : subjectMastery[a] - subjectMastery[b];
  });

  // Build weekly schedule: 6 active days + 1 rest
  const schedule = [];
  for (let d = 0; d < 7; d++) {
    if (d === 6) {
      schedule.push({ day: DAY_NAMES[d], type: 'rest', note: 'Rest or optional math game' });
      continue;
    }
    if (d === 5) {
      // Challenge day: weakest subject
      const weakest = ranked[ranked.length - 1];
      schedule.push({
        day: DAY_NAMES[d],
        type: 'challenge',
        skill1: { subject: weakest, label: SUBJECTS[weakest].label, minutes },
        note: 'Challenge day: focus on weakest area',
      });
      continue;
    }
    // Two subjects per day
    const s1 = ranked[(d * 2) % ranked.length];
    const s2 = ranked[(d * 2 + 1) % ranked.length];
    const min1 = Math.round(minutes * 0.6);
    const min2 = minutes - min1;
    schedule.push({
      day: DAY_NAMES[d],
      type: 'standard',
      skill1: { subject: s1, label: SUBJECTS[s1].label, minutes: min1 },
      skill2: { subject: s2, label: SUBJECTS[s2].label, minutes: min2 },
    });
  }

  // Update profile goal
  p.goal = g;
  saveProfile(p);

  return {
    studentId: id,
    grade,
    goal: g,
    dailyMinutes: minutes,
    allocation: Object.fromEntries(Object.entries(alloc).map(([k, v]) => [SUBJECTS[k].label, `${v}%`])),
    schedule,
  };
}

// ── Recommendations ──────────────────────────────────────────────────────────

function getRecommendations(id, count) {
  count = count || 5;
  const p = loadProfile(id);
  const grade = p.grade || 'kindergarten';
  const candidates = [];

  for (const [subject, data] of Object.entries(SUBJECTS)) {
    const skills = data[grade] || [];
    for (const sk of skills) {
      const key = `${grade}/${subject}/${sk}`;
      const d = p.skills[key];
      const m = d ? d.mastery : 0;
      if (m < MASTERY_THRESHOLD) {
        candidates.push({
          grade,
          subject,
          subjectLabel: data.label,
          skill: sk,
          mastery: m,
          label: d ? d.label : 'not-started',
        });
      }
    }
  }

  // Priority: developing > emerging > not-started, then lowest mastery first
  const order = { developing: 0, emerging: 1, 'not-started': 2 };
  candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || a.mastery - b.mastery);

  return { studentId: id, grade, recommendations: candidates.slice(0, count) };
}

// ── Public API Class ─────────────────────────────────────────────────────────

class StudyPlanner {
  getProfile(id) {
    const p = loadProfile(id);
    return {
      studentId: p.studentId,
      grade: p.grade,
      goal: p.goal,
      dailyMinutes: p.dailyMinutes,
      createdAt: p.createdAt,
      totalAssessments: p.assessments.length,
    };
  }

  setGrade(id, grade) {
    if (!VALID_GRADES.includes(grade)) throw new Error(`Unknown grade: ${grade}. Valid: ${VALID_GRADES.join(', ')}`);
    const p = loadProfile(id);
    p.grade = grade;
    saveProfile(p);
    return { studentId: id, grade };
  }

  setGoal(id, goal) {
    if (!VALID_GOALS.includes(goal)) throw new Error(`Unknown goal: ${goal}. Valid: ${VALID_GOALS.join(', ')}`);
    const p = loadProfile(id);
    p.goal = goal;
    saveProfile(p);
    return { studentId: id, goal };
  }

  recordAssessment(id, grade, subject, skill, score, total, notes) {
    notes = notes || '';
    if (!VALID_GRADES.includes(grade)) throw new Error(`Unknown grade: ${grade}`);
    if (!SUBJECTS[subject]) throw new Error(`Unknown subject: ${subject}. Valid: ${Object.keys(SUBJECTS).join(', ')}`);
    const skills = SUBJECTS[subject][grade];
    if (!skills) throw new Error(`No skills for ${subject} at grade ${grade}`);
    if (!skills.includes(skill)) throw new Error(`Unknown skill '${skill}' in ${subject}/${grade}. Valid: ${skills.join(', ')}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);

    const p = loadProfile(id);
    if (!p.grade) p.grade = grade;
    const entry = { date: new Date().toISOString(), grade, subject, skill, score, total, notes };
    p.assessments.push(entry);

    const key = `${grade}/${subject}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p);

    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  recordDiagnostic(id, subject, grade, score, total) {
    const p = loadProfile(id);
    if (!p.diagnosticResults) p.diagnosticResults = {};
    p.diagnosticResults[subject] = { grade, score, total, mastery: total > 0 ? Math.round(score / total * 100) / 100 : 0, date: new Date().toISOString() };
    saveProfile(p);
    return { studentId: id, subject, grade, score: `${score}/${total}`, mastery: p.diagnosticResults[subject].mastery };
  }

  generateDiagnostic(id) { return generateDiagnostic(id); }

  createStudyPlan(id, goal) { return createStudyPlan(id, goal); }

  getRecommendations(id, count) { return getRecommendations(id, count); }

  getProgress(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const results = {};
    let mastered = 0, total = 0;

    for (const [subject, data] of Object.entries(SUBJECTS)) {
      const skills = data[grade] || [];
      results[data.label] = {};
      for (const sk of skills) {
        total++;
        const key = `${grade}/${subject}/${sk}`;
        const d = p.skills[key];
        results[data.label][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
      }
    }

    return {
      studentId: id,
      grade,
      goal: p.goal,
      mastered,
      total,
      overallPct: total > 0 ? Math.round(mastered / total * 100) : 0,
      skills: results,
    };
  }

  getReport(id) {
    const p = loadProfile(id);
    const progress = this.getProgress(id);
    const recs = this.getRecommendations(id, 5);

    // Subject-level summary
    const grade = p.grade || 'kindergarten';
    const subjectSummary = {};
    for (const [subject, data] of Object.entries(SUBJECTS)) {
      const skills = data[grade] || [];
      let totalMastery = 0, count = 0;
      for (const sk of skills) {
        const key = `${grade}/${subject}/${sk}`;
        const d = p.skills[key];
        totalMastery += d ? d.mastery : 0;
        count++;
      }
      const avg = count > 0 ? Math.round(totalMastery / count * 100) / 100 : 0;
      subjectSummary[data.label] = { avgMastery: avg, label: masteryLabel(avg), skillCount: count };
    }

    return {
      studentId: id,
      grade,
      goal: p.goal,
      subjectSummary,
      progress,
      recommendations: recs.recommendations,
      recentAssessments: p.assessments.slice(-20).reverse(),
      diagnosticResults: p.diagnosticResults || {},
    };
  }

  getGoals(id) {
    const p = loadProfile(id);
    return {
      studentId: id,
      currentGoal: p.goal,
      availableGoals: VALID_GOALS,
      descriptions: {
        'catch-up': 'Below grade level — fill gaps and build foundations',
        'stay-strong': 'On grade level — maintain and deepen understanding',
        'get-ahead': 'Above grade level — challenge and extend',
        'competition': 'Math competitions and olympiad preparation',
        'real-world': 'Practical math — money, cooking, building, everyday use',
      },
    };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json') && !f.includes('.corrupt.'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }
}

module.exports = StudyPlanner;

// ── CLI: node study-planner.js <command> [args] ──────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const sp = new StudyPlanner();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) sp.setGrade(id, grade);
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
        const [, id, goal] = args;
        if (!id) throw new Error('Usage: plan <id> [goal]');
        out(sp.createStudyPlan(id, goal));
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
        const [, id, n] = args;
        if (!id) throw new Error('Usage: recommend <id> [count]');
        out(sp.getRecommendations(id, n ? Number(n) : 5));
        break;
      }
      case 'record': {
        const [, id, grade, subject, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !subject || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <subject> <skill> <score> <total> [notes]');
        out(sp.recordAssessment(id, grade, subject, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'record-diagnostic': {
        const [, id, subject, grade, sc, tot] = args;
        if (!id || !subject || !grade || !sc || !tot) throw new Error('Usage: record-diagnostic <id> <subject> <grade> <score> <total>');
        out(sp.recordDiagnostic(id, subject, grade, Number(sc), Number(tot)));
        break;
      }
      case 'students': {
        out(sp.listStudents());
        break;
      }
      default: {
        out({
          usage: 'node study-planner.js <command> [args]',
          commands: ['start', 'diagnostic', 'plan', 'progress', 'report', 'goals', 'recommend', 'record', 'record-diagnostic', 'students'],
          grades: VALID_GRADES,
          goals: VALID_GOALS,
        });
      }
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
