// eClaw HS Math Study Planner & Coach (Grades 9-12). No deps. Coordinator skill.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-math-study-planner');
const MASTERY_THRESHOLD = 0.8;

const DOMAINS = {
  'algebra': {
    skills: ['linear-equations', 'systems-of-equations', 'quadratic-equations', 'polynomials', 'rational-expressions', 'radical-expressions', 'exponential-functions', 'logarithmic-functions'],
    courses: ['algebra-1', 'algebra-2'],
    satCategory: 'Heart of Algebra',
  },
  'geometry': {
    skills: ['angles-and-lines', 'triangles', 'quadrilaterals', 'circles', 'area-and-volume', 'coordinate-geometry', 'transformations', 'proofs'],
    courses: ['geometry'],
    satCategory: 'Additional Topics in Math',
  },
  'functions': {
    skills: ['function-notation', 'domain-range', 'transformations', 'inverse-functions', 'composition', 'piecewise', 'polynomial-functions', 'rational-functions'],
    courses: ['algebra-2', 'precalculus'],
    satCategory: 'Passport to Advanced Math',
  },
  'trigonometry': {
    skills: ['unit-circle', 'trig-ratios', 'trig-identities', 'trig-equations', 'law-of-sines', 'law-of-cosines', 'graphing-trig', 'inverse-trig'],
    courses: ['precalculus'],
    satCategory: 'Additional Topics in Math',
  },
  'statistics': {
    skills: ['descriptive-stats', 'probability', 'distributions', 'sampling', 'confidence-intervals', 'hypothesis-testing', 'regression', 'experimental-design'],
    courses: ['statistics'],
    satCategory: 'Problem Solving and Data Analysis',
  },
  'precalculus': {
    skills: ['advanced-functions', 'conic-sections', 'sequences-series', 'limits-intro', 'polar-parametric', 'rate-of-change', 'continuity', 'vectors'],
    courses: ['precalculus'],
    satCategory: 'Passport to Advanced Math',
  },
  'problem-solving': {
    skills: ['word-problems', 'logical-reasoning', 'proof-techniques', 'optimization', 'modeling', 'estimation', 'multi-step', 'competition-math'],
    courses: ['all'],
    satCategory: 'Problem Solving and Data Analysis',
  },
};

const COURSE_PROGRESSION = {
  standard: ['algebra-1', 'geometry', 'algebra-2', 'precalculus', 'calculus'],
  accelerated: ['algebra-1', 'geometry+algebra-2', 'precalculus', 'ap-calculus-ab', 'ap-calculus-bc'],
  honors: ['honors-algebra-1', 'honors-geometry', 'honors-algebra-2', 'honors-precalculus', 'ap-calculus-bc'],
};

const GRADE_EXPECTATIONS = {
  '9': { typical: 'algebra-1', advanced: 'geometry', domains: ['algebra', 'problem-solving'] },
  '10': { typical: 'geometry', advanced: 'algebra-2', domains: ['algebra', 'geometry', 'problem-solving'] },
  '11': { typical: 'algebra-2', advanced: 'precalculus', domains: ['algebra', 'functions', 'trigonometry', 'problem-solving'] },
  '12': { typical: 'precalculus', advanced: 'ap-calculus', domains: ['functions', 'trigonometry', 'precalculus', 'statistics', 'problem-solving'] },
};

const SAT_CATEGORIES = {
  'Heart of Algebra': { weight: 0.33, domains: ['algebra'], description: 'Linear equations, systems, inequalities' },
  'Problem Solving and Data Analysis': { weight: 0.29, domains: ['statistics', 'problem-solving'], description: 'Ratios, percentages, data interpretation, probability' },
  'Passport to Advanced Math': { weight: 0.28, domains: ['functions', 'precalculus'], description: 'Quadratics, polynomials, advanced expressions' },
  'Additional Topics in Math': { weight: 0.10, domains: ['geometry', 'trigonometry'], description: 'Geometry, trig, complex numbers' },
};

const ACT_CATEGORIES = {
  'Pre-Algebra': { weight: 0.20, domains: ['algebra'], description: 'Arithmetic, fractions, decimals, basic operations' },
  'Elementary Algebra': { weight: 0.15, domains: ['algebra'], description: 'Linear equations, expressions, simple quadratics' },
  'Intermediate Algebra': { weight: 0.15, domains: ['algebra', 'functions'], description: 'Systems, quadratics, functions, matrices' },
  'Coordinate Geometry': { weight: 0.15, domains: ['geometry', 'functions'], description: 'Graphing, lines, circles, conic sections' },
  'Plane Geometry': { weight: 0.20, domains: ['geometry'], description: 'Angles, triangles, quadrilaterals, area/volume' },
  'Trigonometry': { weight: 0.15, domains: ['trigonometry'], description: 'Trig functions, identities, applications' },
};

const DIAGNOSTIC_QUESTIONS = {
  'algebra': [
    { prompt: 'Solve: 3x + 7 = 22', answer: '5', difficulty: 'basic' },
    { prompt: 'Solve the system: y = 2x + 1, y = -x + 7', answer: '(2, 5)', difficulty: 'intermediate' },
    { prompt: 'Factor: x^2 - 5x + 6', answer: '(x-2)(x-3)', difficulty: 'intermediate' },
    { prompt: 'Solve: 2^(x+1) = 32', answer: '4', difficulty: 'advanced' },
    { prompt: 'Simplify: (x^2-4)/(x+2)', answer: 'x-2', difficulty: 'intermediate' },
  ],
  'geometry': [
    { prompt: 'Sum of angles in a triangle?', answer: '180', difficulty: 'basic' },
    { prompt: 'Area of a circle with radius 5?', answer: '25pi', difficulty: 'basic' },
    { prompt: 'Find the hypotenuse: legs 6 and 8.', answer: '10', difficulty: 'intermediate' },
    { prompt: 'Volume of a cylinder: r=3, h=10?', answer: '90pi', difficulty: 'intermediate' },
    { prompt: 'Distance between (1,2) and (4,6)?', answer: '5', difficulty: 'intermediate' },
  ],
  'functions': [
    { prompt: 'If f(x) = 2x + 3, find f(4).', answer: '11', difficulty: 'basic' },
    { prompt: 'Domain of f(x) = 1/(x-3)?', answer: 'x != 3', difficulty: 'intermediate' },
    { prompt: 'If f(x) = x^2 and g(x) = x+1, find f(g(2)).', answer: '9', difficulty: 'intermediate' },
    { prompt: 'Find the inverse of f(x) = 3x - 6.', answer: 'f^(-1)(x) = (x+6)/3', difficulty: 'advanced' },
    { prompt: 'Describe the transformation: f(x) = (x-2)^2 + 3', answer: 'right 2, up 3', difficulty: 'intermediate' },
  ],
  'trigonometry': [
    { prompt: 'sin(30°) = ?', answer: '1/2', difficulty: 'basic' },
    { prompt: 'cos(π/3) = ?', answer: '1/2', difficulty: 'intermediate' },
    { prompt: 'tan(45°) = ?', answer: '1', difficulty: 'basic' },
    { prompt: 'Simplify: sin^2(x) + cos^2(x)', answer: '1', difficulty: 'intermediate' },
    { prompt: 'Period of y = sin(2x)?', answer: 'pi', difficulty: 'advanced' },
  ],
  'statistics': [
    { prompt: 'Mean of: 10, 20, 30, 40, 50?', answer: '30', difficulty: 'basic' },
    { prompt: 'Median of: 3, 7, 8, 12, 15?', answer: '8', difficulty: 'basic' },
    { prompt: 'P(heads) for a fair coin?', answer: '0.5', difficulty: 'basic' },
    { prompt: 'Standard deviation measures what?', answer: 'spread or variability', difficulty: 'intermediate' },
    { prompt: 'What does a 95% confidence interval mean?', answer: '95% of such intervals contain the true parameter', difficulty: 'advanced' },
  ],
  'precalculus': [
    { prompt: 'Find all zeros of f(x) = x^2 - 9.', answer: '3, -3', difficulty: 'basic' },
    { prompt: 'Horizontal asymptote of f(x) = (2x+1)/(x-3)?', answer: 'y = 2', difficulty: 'intermediate' },
    { prompt: 'Sum of first 10 terms: a_1=1, d=3.', answer: '145', difficulty: 'intermediate' },
    { prompt: 'lim(x→2) (x^2-4)/(x-2) = ?', answer: '4', difficulty: 'advanced' },
    { prompt: 'Convert (3, π/4) from polar to rectangular.', answer: '(3sqrt(2)/2, 3sqrt(2)/2)', difficulty: 'advanced' },
  ],
  'problem-solving': [
    { prompt: 'Three consecutive integers sum to 42. What are they?', answer: '13, 14, 15', difficulty: 'basic' },
    { prompt: 'A rectangle has perimeter 20 and area 24. Find dimensions.', answer: '4 and 6', difficulty: 'intermediate' },
    { prompt: 'How many ways to arrange 4 books on a shelf?', answer: '24', difficulty: 'intermediate' },
    { prompt: 'Find units digit of 7^2024.', answer: '1', difficulty: 'advanced' },
    { prompt: 'Prove: the sum of two even numbers is even.', answer: '2a + 2b = 2(a+b)', difficulty: 'intermediate' },
  ],
};

const ANXIETY_STRATEGIES = {
  mild: [
    'Practice positive self-talk: "I can learn this step by step"',
    'Break problems into smaller parts',
    'Use a timer to build stamina gradually (start with 10 min, add 5 each week)',
    'Celebrate small wins — every problem solved is progress',
  ],
  moderate: [
    'Deep breathing before starting: 4 counts in, 4 counts hold, 4 counts out',
    'Start each session with problems you CAN solve to build confidence',
    'Use concrete manipulatives or visual models when abstract feels overwhelming',
    'Track your "growth journal" — write what you learned, not just what you scored',
    'Work with a study partner to normalize struggle',
  ],
  significant: [
    'Consider speaking with a school counselor about math anxiety support',
    'Focus on understanding, not speed — there is no timer in real learning',
    'Build from strengths: what math CAN you do? Start there and bridge forward',
    'Explore math in contexts you enjoy (sports stats, music, art patterns)',
    'Practice relaxation techniques before and during math work',
    'Remember: struggle is learning. Your brain is growing when math feels hard.',
  ],
};

const GROWTH_MINDSET = {
  struggling: [
    'Struggle means your brain is growing new connections. This is literally how learning works.',
    'You haven\'t mastered this YET. That\'s a temporary state, not a permanent one.',
    'Every expert was once a beginner. The difference is persistence.',
    'Making mistakes is not failing — it\'s gathering information about what to try next.',
  ],
  plateaued: [
    'Plateaus are normal! Your brain is consolidating what it\'s learned.',
    'Try a different approach — sometimes a new strategy unlocks understanding.',
    'Review fundamentals. Gaps in earlier skills can stall current progress.',
    'Teach what you know to someone else. Teaching deepens understanding.',
  ],
  progressing: [
    'Your hard work is paying off! Keep building on this momentum.',
    'Notice how problems that once seemed impossible now feel manageable?',
    'You\'re developing mathematical thinking, not just memorizing procedures.',
    'Challenge yourself with slightly harder problems to keep growing.',
  ],
};

// File I/O

function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }

function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }

function loadProfile(id) {
  const fp = profilePath(id);
  if (fs.existsSync(fp)) {
    try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
    catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); }
  }
  return { studentId: id, grade: null, goal: null, createdAt: new Date().toISOString(), assessments: [], skills: {}, diagnosticResults: null, anxietyLevel: null };
}

function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }

// Helpers

function calcMastery(attempts) {
  if (!attempts || !attempts.length) return 0;
  const recent = attempts.slice(-5).filter(a => a.total > 0);
  return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0;
}

function masteryLabel(r) { return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started'; }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 /()^+\-.'!,=]/g, ''); }

// Public API

class StudyPlanner {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, grade: p.grade, goal: p.goal, createdAt: p.createdAt, totalAssessments: p.assessments.length, hasDiagnostic: !!p.diagnosticResults };
  }

  setGrade(id, grade) {
    if (!GRADE_EXPECTATIONS[grade]) throw new Error(`Unknown grade: ${grade}. Valid: ${Object.keys(GRADE_EXPECTATIONS).join(', ')}`);
    const p = loadProfile(id); p.grade = grade; saveProfile(p);
    return { studentId: id, grade };
  }

  setGoal(id, goal) {
    const validGoals = ['catch-up', 'stay-strong', 'get-ahead', 'test-prep', 'competition'];
    if (!validGoals.includes(goal)) throw new Error(`Unknown goal: ${goal}. Valid: ${validGoals.join(', ')}`);
    const p = loadProfile(id); p.goal = goal; saveProfile(p);
    return { studentId: id, goal };
  }

  runDiagnostic(id) {
    const p = loadProfile(id);
    const results = {};
    for (const [domain, questions] of Object.entries(DIAGNOSTIC_QUESTIONS)) {
      results[domain] = {
        questions: shuffle(questions).slice(0, 3).map(q => ({
          prompt: q.prompt,
          answer: q.answer,
          difficulty: q.difficulty,
        })),
        totalQuestions: 3,
      };
    }
    p.diagnosticResults = { date: new Date().toISOString(), domains: Object.keys(results) };
    saveProfile(p);
    return { studentId: id, diagnostic: results, instructions: 'Answer each question. Record scores using: record <id> <domain> <skill> <score> <total>' };
  }

  recordAssessment(id, domain, skill, score, total, notes = '') {
    if (!DOMAINS[domain]) throw new Error(`Unknown domain: ${domain}. Valid: ${Object.keys(DOMAINS).join(', ')}`);
    if (!DOMAINS[domain].skills.includes(skill)) throw new Error(`Unknown skill '${skill}' in ${domain}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);

    const p = loadProfile(id);
    const entry = { date: new Date().toISOString(), domain, skill, score, total, notes };
    p.assessments.push(entry);
    const key = `${domain}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p);
    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const results = {};
    let totalMastered = 0, totalSkills = 0;
    for (const [domain, info] of Object.entries(DOMAINS)) {
      results[domain] = {};
      for (const sk of info.skills) {
        totalSkills++;
        const d = p.skills[`${domain}/${sk}`];
        results[domain][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) totalMastered++;
      }
    }
    const domainSummary = {};
    for (const [domain, skills] of Object.entries(results)) {
      const vals = Object.values(skills);
      const avg = vals.reduce((s, v) => s + v.mastery, 0) / vals.length;
      domainSummary[domain] = { avgMastery: Math.round(avg * 100) / 100, label: masteryLabel(avg) };
    }
    return { studentId: id, grade: p.grade, goal: p.goal, mastered: totalMastered, totalSkills, overallPct: totalSkills > 0 ? Math.round(totalMastered / totalSkills * 100) : 0, domainSummary, skills: results };
  }

  generatePlan(id) {
    const p = loadProfile(id);
    const grade = p.grade || '9';
    const goal = p.goal || 'stay-strong';
    const progress = this.getProgress(id);

    // Find weakest domains
    const domainScores = Object.entries(progress.domainSummary)
      .map(([d, info]) => ({ domain: d, mastery: info.avgMastery, label: info.label }))
      .sort((a, b) => a.mastery - b.mastery);

    const weakest = domainScores.filter(d => d.mastery < MASTERY_THRESHOLD);
    const gradeExpected = GRADE_EXPECTATIONS[grade]?.domains || ['algebra', 'problem-solving'];

    // Build weekly plan
    const weeklyPlan = {
      focus: weakest.length > 0 ? weakest.slice(0, 2).map(d => d.domain) : gradeExpected.slice(0, 2),
      review: domainScores.filter(d => d.mastery >= MASTERY_THRESHOLD && d.mastery < 0.9).map(d => d.domain).slice(0, 2),
      sessions: [],
    };

    const sessionTemplates = {
      'catch-up': [
        { day: 'Monday', duration: 45, focus: 'weakest domain - fundamentals', type: 'practice' },
        { day: 'Tuesday', duration: 30, focus: 'second weakest domain', type: 'practice' },
        { day: 'Wednesday', duration: 45, focus: 'weakest domain - advancement', type: 'lesson' },
        { day: 'Thursday', duration: 30, focus: 'review and mixed practice', type: 'review' },
        { day: 'Friday', duration: 30, focus: 'problem solving', type: 'challenge' },
      ],
      'stay-strong': [
        { day: 'Monday', duration: 30, focus: 'current course material', type: 'lesson' },
        { day: 'Wednesday', duration: 30, focus: 'practice and homework support', type: 'practice' },
        { day: 'Friday', duration: 30, focus: 'review and enrichment', type: 'review' },
      ],
      'get-ahead': [
        { day: 'Monday', duration: 45, focus: 'advanced topic introduction', type: 'lesson' },
        { day: 'Tuesday', duration: 30, focus: 'advanced practice', type: 'practice' },
        { day: 'Thursday', duration: 45, focus: 'next-level concepts', type: 'lesson' },
        { day: 'Friday', duration: 30, focus: 'challenge problems', type: 'challenge' },
      ],
      'test-prep': [
        { day: 'Monday', duration: 45, focus: 'SAT/ACT weakest category', type: 'practice' },
        { day: 'Tuesday', duration: 30, focus: 'timed practice set', type: 'timed' },
        { day: 'Wednesday', duration: 45, focus: 'SAT/ACT second weakest', type: 'practice' },
        { day: 'Thursday', duration: 30, focus: 'strategy and error analysis', type: 'review' },
        { day: 'Saturday', duration: 60, focus: 'full practice section', type: 'timed' },
      ],
      'competition': [
        { day: 'Monday', duration: 45, focus: 'competition topic (counting/number theory)', type: 'lesson' },
        { day: 'Wednesday', duration: 45, focus: 'problem solving strategies', type: 'challenge' },
        { day: 'Friday', duration: 30, focus: 'timed AMC practice', type: 'timed' },
        { day: 'Saturday', duration: 60, focus: 'AIME-level problems', type: 'challenge' },
      ],
    };

    weeklyPlan.sessions = sessionTemplates[goal] || sessionTemplates['stay-strong'];

    // Mindset message
    const overallMastery = progress.overallPct / 100;
    let mindsetCategory = 'struggling';
    if (overallMastery >= 0.6) mindsetCategory = 'progressing';
    else if (overallMastery >= 0.3) mindsetCategory = 'plateaued';
    const mindset = pick(GROWTH_MINDSET[mindsetCategory], 1)[0];

    return {
      studentId: id, grade, goal, weeklyPlan,
      domainPriorities: domainScores.slice(0, 3),
      gradeExpectations: GRADE_EXPECTATIONS[grade],
      mindsetMessage: mindset,
    };
  }

  getSATReadiness(id) {
    const progress = this.getProgress(id);
    const readiness = {};
    for (const [cat, info] of Object.entries(SAT_CATEGORIES)) {
      const domainMasteries = info.domains.map(d => progress.domainSummary[d]?.avgMastery || 0);
      const avg = domainMasteries.reduce((s, v) => s + v, 0) / domainMasteries.length;
      readiness[cat] = {
        weight: info.weight,
        description: info.description,
        mastery: Math.round(avg * 100) / 100,
        label: masteryLabel(avg),
        ready: avg >= MASTERY_THRESHOLD,
        domains: info.domains,
      };
    }
    const overallReady = Object.values(readiness).every(r => r.ready);
    const weakest = Object.entries(readiness).sort((a, b) => a[1].mastery - b[1].mastery)[0];
    return { studentId: id, satReadiness: readiness, overallReady, weakestCategory: weakest[0], recommendation: overallReady ? 'You are SAT math ready!' : `Focus on: ${weakest[0]} (${weakest[1].description})` };
  }

  getACTReadiness(id) {
    const progress = this.getProgress(id);
    const readiness = {};
    for (const [cat, info] of Object.entries(ACT_CATEGORIES)) {
      const domainMasteries = info.domains.map(d => progress.domainSummary[d]?.avgMastery || 0);
      const avg = domainMasteries.reduce((s, v) => s + v, 0) / domainMasteries.length;
      readiness[cat] = {
        weight: info.weight,
        description: info.description,
        mastery: Math.round(avg * 100) / 100,
        label: masteryLabel(avg),
        ready: avg >= MASTERY_THRESHOLD,
        domains: info.domains,
      };
    }
    const overallReady = Object.values(readiness).every(r => r.ready);
    const weakest = Object.entries(readiness).sort((a, b) => a[1].mastery - b[1].mastery)[0];
    return { studentId: id, actReadiness: readiness, overallReady, weakestCategory: weakest[0], recommendation: overallReady ? 'You are ACT math ready!' : `Focus on: ${weakest[0]} (${weakest[1].description})` };
  }

  getNextCourse(id) {
    const p = loadProfile(id);
    const grade = p.grade || '9';
    const progress = this.getProgress(id);
    const gradeInfo = GRADE_EXPECTATIONS[grade];

    const readinessChecks = {};
    for (const domain of gradeInfo.domains) {
      readinessChecks[domain] = {
        mastery: progress.domainSummary[domain]?.avgMastery || 0,
        ready: (progress.domainSummary[domain]?.avgMastery || 0) >= MASTERY_THRESHOLD,
      };
    }
    const allReady = Object.values(readinessChecks).every(r => r.ready);
    const nextGrade = String(Math.min(Number(grade) + 1, 12));

    return {
      studentId: id,
      currentGrade: grade,
      typicalCourse: gradeInfo.typical,
      advancedCourse: gradeInfo.advanced,
      readiness: readinessChecks,
      recommendation: allReady
        ? `Ready for ${GRADE_EXPECTATIONS[nextGrade]?.typical || 'advanced courses'}! Consider ${gradeInfo.advanced}.`
        : `Continue strengthening: ${Object.entries(readinessChecks).filter(([,v]) => !v.ready).map(([k]) => k).join(', ')}`,
      courseOptions: COURSE_PROGRESSION,
    };
  }

  getCalcReadiness(id) {
    const progress = this.getProgress(id);
    const prerequisites = {
      algebra: { required: 0.9, current: progress.domainSummary.algebra?.avgMastery || 0 },
      functions: { required: 0.85, current: progress.domainSummary.functions?.avgMastery || 0 },
      trigonometry: { required: 0.8, current: progress.domainSummary.trigonometry?.avgMastery || 0 },
      precalculus: { required: 0.8, current: progress.domainSummary.precalculus?.avgMastery || 0 },
    };

    const checklist = {};
    let ready = true;
    for (const [domain, req] of Object.entries(prerequisites)) {
      const met = req.current >= req.required;
      checklist[domain] = { required: req.required, current: req.current, met, gap: met ? 0 : Math.round((req.required - req.current) * 100) / 100 };
      if (!met) ready = false;
    }

    return {
      studentId: id,
      calcReady: ready,
      checklist,
      recommendation: ready
        ? 'You are ready for Calculus! Your foundational skills are strong.'
        : `Not yet ready. Focus on: ${Object.entries(checklist).filter(([,v]) => !v.met).map(([k,v]) => `${k} (need ${v.gap} more)`).join(', ')}`,
    };
  }

  anxietyCheck(id) {
    const p = loadProfile(id);
    const questions = [
      'I feel nervous when I hear the word "math" (1-5)',
      'I avoid math homework until the last minute (1-5)',
      'I believe some people just aren\'t "math people" (1-5)',
      'My mind goes blank during math tests (1-5)',
      'I feel like I\'m the only one who doesn\'t understand (1-5)',
    ];

    return {
      studentId: id,
      screeningQuestions: questions,
      scoring: {
        '5-10': { level: 'mild', strategies: ANXIETY_STRATEGIES.mild },
        '11-18': { level: 'moderate', strategies: ANXIETY_STRATEGIES.moderate },
        '19-25': { level: 'significant', strategies: ANXIETY_STRATEGIES.significant },
      },
      instructions: 'Rate each question 1 (never) to 5 (always). Sum the scores to determine anxiety level.',
      note: 'This is a screening tool, not a clinical assessment. For persistent anxiety, consult a school counselor.',
    };
  }

  getReport(id) {
    const p = loadProfile(id);
    return {
      studentId: id,
      grade: p.grade,
      goal: p.goal,
      progress: this.getProgress(id),
      satReadiness: this.getSATReadiness(id),
      calcReadiness: this.getCalcReadiness(id),
      recentAssessments: p.assessments.slice(-20).reverse(),
    };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }
}

module.exports = StudyPlanner;

// CLI: node study-planner.js <command> [args]
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
        out({ action: 'start', profile: sp.getProfile(id), progress: sp.getProgress(id) });
        break;
      }
      case 'diagnostic': { const [, id] = args; if (!id) throw new Error('Usage: diagnostic <id>'); out(sp.runDiagnostic(id)); break; }
      case 'plan': { const [, id] = args; if (!id) throw new Error('Usage: plan <id>'); out(sp.generatePlan(id)); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(sp.getProgress(id)); break; }
      case 'sat-ready': { const [, id] = args; if (!id) throw new Error('Usage: sat-ready <id>'); out(sp.getSATReadiness(id)); break; }
      case 'act-ready': { const [, id] = args; if (!id) throw new Error('Usage: act-ready <id>'); out(sp.getACTReadiness(id)); break; }
      case 'record': {
        const [, id, domain, skill, sc, tot, ...notes] = args;
        if (!id || !domain || !skill || !sc || !tot) throw new Error('Usage: record <id> <domain> <skill> <score> <total> [notes]');
        out(sp.recordAssessment(id, domain, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(sp.getReport(id)); break; }
      case 'next-course': { const [, id] = args; if (!id) throw new Error('Usage: next-course <id>'); out(sp.getNextCourse(id)); break; }
      case 'calc-ready': { const [, id] = args; if (!id) throw new Error('Usage: calc-ready <id>'); out(sp.getCalcReadiness(id)); break; }
      case 'anxiety-check': { const [, id] = args; if (!id) throw new Error('Usage: anxiety-check <id>'); out(sp.anxietyCheck(id)); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(sp.setGrade(id, g)); break; }
      case 'set-goal': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-goal <id> <goal>'); out(sp.setGoal(id, g)); break; }
      case 'students': { out(sp.listStudents()); break; }
      default: out({
        usage: 'node study-planner.js <command> [args]',
        commands: ['start','diagnostic','plan','progress','sat-ready','act-ready','record','report','next-course','calc-ready','anxiety-check','set-grade','set-goal','students'],
        grades: Object.keys(GRADE_EXPECTATIONS),
        goals: ['catch-up','stay-strong','get-ahead','test-prep','competition'],
      });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
