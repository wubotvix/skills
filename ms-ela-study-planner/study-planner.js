// MS ELA Study Planner & Progress Coach (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-ela-study-planner');
const DATA_ROOT = path.join(__dirname, '..', '..', 'data');

const VALID_GRADES = ['grade-6', 'grade-7', 'grade-8'];
const VALID_GOALS = ['catch-up', 'on-level', 'advanced', 'love-reading', 'writing-focus', 'test-prep'];

const ELA_SKILLS = [
  'reading-literature', 'reading-informational', 'writing',
  'grammar-language', 'vocabulary', 'speaking-listening', 'research-media',
];

const ELA_DATA_DIRS = {
  'reading-literature':    'ms-ela-reading-literature',
  'reading-informational': 'ms-ela-reading-informational',
  'writing':               'ms-ela-writing',
  'grammar-language':      'ms-ela-grammar-language',
  'vocabulary':            'ms-ela-vocabulary',
  'speaking-listening':    'ms-ela-speaking-listening',
  'research-media':        'ms-ela-research-media',
};

// Time allocation percentages per goal across 7 skill areas
const ALLOCATIONS = {
  'catch-up':       { 'reading-literature': 20, 'reading-informational': 15, 'writing': 20, 'grammar-language': 15, 'vocabulary': 15, 'speaking-listening': 5,  'research-media': 10 },
  'on-level':       { 'reading-literature': 20, 'reading-informational': 15, 'writing': 20, 'grammar-language': 10, 'vocabulary': 10, 'speaking-listening': 10, 'research-media': 15 },
  'advanced':       { 'reading-literature': 20, 'reading-informational': 15, 'writing': 20, 'grammar-language': 5,  'vocabulary': 10, 'speaking-listening': 15, 'research-media': 15 },
  'love-reading':   { 'reading-literature': 30, 'reading-informational': 20, 'writing': 10, 'grammar-language': 5,  'vocabulary': 15, 'speaking-listening': 10, 'research-media': 10 },
  'writing-focus':  { 'reading-literature': 10, 'reading-informational': 10, 'writing': 35, 'grammar-language': 15, 'vocabulary': 10, 'speaking-listening': 5,  'research-media': 15 },
  'test-prep':      { 'reading-literature': 20, 'reading-informational': 20, 'writing': 20, 'grammar-language': 10, 'vocabulary': 15, 'speaking-listening': 5,  'research-media': 10 },
};

const SKILL_LABELS = {
  'reading-literature':    'Reading: Literature',
  'reading-informational': 'Reading: Informational',
  'writing':               'Writing',
  'grammar-language':      'Grammar & Language',
  'vocabulary':            'Vocabulary',
  'speaking-listening':    'Speaking & Listening',
  'research-media':        'Research & Media',
};

const LEXILE_RANGES = {
  'grade-6': { low: 925, high: 1070, target: 1000 },
  'grade-7': { low: 970, high: 1120, target: 1050 },
  'grade-8': { low: 1010, high: 1185, target: 1100 },
};

const BOOK_RECOMMENDATIONS = {
  'grade-6': [
    { title: 'Percy Jackson & The Lightning Thief', author: 'Rick Riordan', lexile: 680, genre: 'fantasy' },
    { title: 'Wonder', author: 'R.J. Palacio', lexile: 790, genre: 'realistic' },
    { title: 'Hatchet', author: 'Gary Paulsen', lexile: 1020, genre: 'adventure' },
    { title: 'Number the Stars', author: 'Lois Lowry', lexile: 670, genre: 'historical' },
    { title: 'Smile', author: 'Raina Telgemeier', lexile: 410, genre: 'graphic-novel' },
    { title: 'Ghost', author: 'Jason Reynolds', lexile: 730, genre: 'sports' },
    { title: 'The Wild Robot', author: 'Peter Brown', lexile: 740, genre: 'science-fiction' },
    { title: 'Amulet: The Stonekeeper', author: 'Kazu Kibuishi', lexile: 370, genre: 'graphic-novel' },
    { title: 'Restart', author: 'Gordon Korman', lexile: 730, genre: 'realistic' },
    { title: 'Small Spaces', author: 'Katherine Arden', lexile: 730, genre: 'horror' },
  ],
  'grade-7': [
    { title: 'The Outsiders', author: 'S.E. Hinton', lexile: 750, genre: 'realistic' },
    { title: 'The Crossover', author: 'Kwame Alexander', lexile: 750, genre: 'sports' },
    { title: 'Ender\'s Game', author: 'Orson Scott Card', lexile: 780, genre: 'science-fiction' },
    { title: 'The Westing Game', author: 'Ellen Raskin', lexile: 750, genre: 'mystery' },
    { title: 'Brown Girl Dreaming', author: 'Jacqueline Woodson', lexile: 990, genre: 'memoir' },
    { title: 'New Kid', author: 'Jerry Craft', lexile: 640, genre: 'graphic-novel' },
    { title: 'Refugee', author: 'Alan Gratz', lexile: 800, genre: 'historical' },
    { title: 'Children of Blood and Bone', author: 'Tomi Adeyemi', lexile: 710, genre: 'fantasy' },
    { title: 'Long Way Down', author: 'Jason Reynolds', lexile: 720, genre: 'realistic' },
    { title: 'Coraline', author: 'Neil Gaiman', lexile: 740, genre: 'horror' },
  ],
  'grade-8': [
    { title: 'The Hate U Give', author: 'Angie Thomas', lexile: 590, genre: 'realistic' },
    { title: 'The Giver', author: 'Lois Lowry', lexile: 760, genre: 'science-fiction' },
    { title: 'Dear Martin', author: 'Nic Stone', lexile: 720, genre: 'realistic' },
    { title: 'Chains', author: 'Laurie Halse Anderson', lexile: 780, genre: 'historical' },
    { title: 'Ready Player One', author: 'Ernest Cline', lexile: 900, genre: 'science-fiction' },
    { title: 'One of Us Is Lying', author: 'Karen McManus', lexile: 590, genre: 'mystery' },
    { title: 'March: Book One', author: 'John Lewis', lexile: 660, genre: 'graphic-novel' },
    { title: 'Ghost Boys', author: 'Jewell Parker Rhodes', lexile: 750, genre: 'realistic' },
    { title: 'The Martian (YA Edition)', author: 'Andy Weir', lexile: 680, genre: 'science-fiction' },
    { title: 'Eragon', author: 'Christopher Paolini', lexile: 710, genre: 'fantasy' },
  ],
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ── File I/O ──

function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }
function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }

function loadProfile(id) {
  const fp = profilePath(id);
  if (fs.existsSync(fp)) {
    try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
    catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); }
  }
  return {
    studentId: id, grade: null, goal: 'on-level', dailyBudget: 30,
    readingFeeling: 3, writingFeeling: 3, strengths: [], gaps: [],
    createdAt: new Date().toISOString(),
    readingLog: [], plans: [], assessments: [],
  };
}

function saveProfile(p) { ensureDir(DATA_DIR); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }

// ── Helpers ──

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function today() { return new Date().toISOString().slice(0, 10); }

function weekStart() {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d.toISOString().slice(0, 10);
}

function validateGrade(g) {
  if (!VALID_GRADES.includes(g)) throw new Error(`Invalid grade: ${g}. Valid: ${VALID_GRADES.join(', ')}`);
}

function validateGoal(g) {
  if (!VALID_GOALS.includes(g)) throw new Error(`Invalid goal: ${g}. Valid: ${VALID_GOALS.join(', ')}`);
}

// ── Scan external ms-ela-* data dirs for progress ──

function scanSkillData(studentId) {
  const results = {};
  for (const [skill, dirName] of Object.entries(ELA_DATA_DIRS)) {
    const dir = path.join(DATA_ROOT, dirName);
    if (!fs.existsSync(dir)) { results[skill] = null; continue; }
    const fp = path.join(dir, String(studentId).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json');
    if (!fs.existsSync(fp)) { results[skill] = null; continue; }
    try {
      const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
      const assessments = data.assessments || [];
      const recent = assessments.slice(-10);
      let correct = 0, total = 0;
      for (const a of recent) {
        correct += (a.score || 0);
        total += (a.total || 0);
      }
      const accuracy = total > 0 ? Math.round(correct / total * 100) : 0;
      const streak = assessments.length;
      const lastDate = assessments.length ? (assessments[assessments.length - 1].date || '').slice(0, 10) : null;
      results[skill] = { accuracy, sessions: assessments.length, lastDate, streak, mastery: data.skills || {} };
    } catch { results[skill] = null; }
  }
  return results;
}

// ── Public API ──

class StudyPlanner {
  start(id, grade, goal) {
    const p = loadProfile(id);
    if (grade) { validateGrade(grade); p.grade = grade; }
    if (goal) { validateGoal(goal); p.goal = goal; }
    if (!p.grade) p.grade = 'grade-6';
    saveProfile(p);
    return { action: 'start', profile: this.getProfile(id) };
  }

  getProfile(id) {
    const p = loadProfile(id);
    return {
      studentId: p.studentId, grade: p.grade, goal: p.goal,
      dailyBudget: p.dailyBudget, readingFeeling: p.readingFeeling,
      writingFeeling: p.writingFeeling, strengths: p.strengths,
      gaps: p.gaps, createdAt: p.createdAt,
      booksRead: p.readingLog.length, plansGenerated: p.plans.length,
    };
  }

  setGoal(id, goal) {
    validateGoal(goal);
    const p = loadProfile(id); p.goal = goal; saveProfile(p);
    return { studentId: id, goal };
  }

  setBudget(id, minutes) {
    const m = Number(minutes);
    if (!m || m < 10 || m > 180) throw new Error('Budget must be 10-180 minutes.');
    const p = loadProfile(id); p.dailyBudget = m; saveProfile(p);
    return { studentId: id, dailyBudget: m };
  }

  updateProfile(id, updates) {
    const p = loadProfile(id);
    if (updates.grade) { validateGrade(updates.grade); p.grade = updates.grade; }
    if (updates.goal) { validateGoal(updates.goal); p.goal = updates.goal; }
    if (updates.dailyBudget) {
      const m = Number(updates.dailyBudget);
      if (!m || m < 10 || m > 180) throw new Error('Budget must be 10-180 minutes.');
      p.dailyBudget = m;
    }
    if (updates.readingFeeling) {
      const n = Number(updates.readingFeeling);
      if (n < 1 || n > 5) throw new Error('readingFeeling must be 1-5.');
      p.readingFeeling = n;
    }
    if (updates.writingFeeling) {
      const n = Number(updates.writingFeeling);
      if (n < 1 || n > 5) throw new Error('writingFeeling must be 1-5.');
      p.writingFeeling = n;
    }
    if (updates.strengths) p.strengths = updates.strengths.split(',').map(s => s.trim());
    if (updates.gaps) p.gaps = updates.gaps.split(',').map(s => s.trim());
    saveProfile(p);
    return { studentId: id, updated: true, profile: this.getProfile(id) };
  }

  // ── Weekly Plan Generation ──

  generatePlan(id) {
    const p = loadProfile(id);
    if (!p.grade) throw new Error('Set grade first: start <id> <grade>');
    const goal = p.goal || 'on-level';
    const budget = p.dailyBudget || 30;
    const alloc = ALLOCATIONS[goal] || ALLOCATIONS['on-level'];
    const weeklyMin = budget * 7;

    // Build daily schedule
    const schedule = DAYS.map((day, i) => {
      if (i === 6) return { day, blocks: [{ skill: 'rest', label: 'Rest / Free Reading / Journal', minutes: budget }] };

      // Distribute 2-3 skills per day based on allocation
      const blocks = [];
      const daySkills = pickDaySkills(i, alloc);
      let remaining = budget;
      for (const sk of daySkills) {
        const pct = alloc[sk] || 0;
        const mins = Math.max(10, Math.round((pct / 100) * weeklyMin / 6));
        const actual = Math.min(mins, remaining);
        if (actual >= 5) {
          blocks.push({ skill: sk, label: SKILL_LABELS[sk], minutes: actual });
          remaining -= actual;
        }
      }
      // If time left, add to first block
      if (remaining > 0 && blocks.length) blocks[0].minutes += remaining;
      return { day, blocks };
    });

    // Compute totals per skill
    const totals = {};
    for (const sk of ELA_SKILLS) totals[sk] = 0;
    for (const d of schedule) {
      for (const b of d.blocks) { if (totals[b.skill] !== undefined) totals[b.skill] += b.minutes; }
    }

    const plan = {
      weekOf: weekStart(), grade: p.grade, goal, dailyBudget: budget,
      weeklyTotal: weeklyMin, schedule, skillTotals: totals,
      generatedAt: new Date().toISOString(),
    };

    p.plans.push({ weekOf: plan.weekOf, generatedAt: plan.generatedAt });
    saveProfile(p);
    return plan;
  }

  // ── Progress Dashboard ──

  getProgress(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-6';
    const external = scanSkillData(id);

    const skills = {};
    for (const sk of ELA_SKILLS) {
      const ext = external[sk];
      if (ext) {
        const status = ext.accuracy >= 80 ? 'Strong' : ext.accuracy >= 65 ? 'On Track' : ext.accuracy >= 50 ? 'Growing' : 'Needs Work';
        skills[sk] = { label: SKILL_LABELS[sk], accuracy: ext.accuracy, sessions: ext.sessions, lastDate: ext.lastDate, status };
      } else {
        skills[sk] = { label: SKILL_LABELS[sk], accuracy: null, sessions: 0, lastDate: null, status: 'Not Started' };
      }
    }

    // Reading log summary
    const thisMonth = today().slice(0, 7);
    const monthBooks = p.readingLog.filter(b => (b.date || '').startsWith(thisMonth));
    const totalPages = monthBooks.reduce((s, b) => s + (b.pagesRead || 0), 0);
    const lexileRange = LEXILE_RANGES[grade] || LEXILE_RANGES['grade-6'];

    return {
      studentId: id, grade, goal: p.goal, dailyBudget: p.dailyBudget,
      skills,
      reading: {
        booksThisMonth: monthBooks.length, pagesThisMonth: totalPages,
        totalBooks: p.readingLog.length, lexileTarget: lexileRange.target + 'L',
      },
      streak: computeStreak(p),
    };
  }

  // ── Assessment ──

  recordAssessment(id, skill, score, total, notes) {
    if (!ELA_SKILLS.includes(skill)) throw new Error(`Invalid skill: ${skill}. Valid: ${ELA_SKILLS.join(', ')}`);
    const sc = Number(score), tot = Number(total);
    if (!tot || tot <= 0) throw new Error('Total must be positive.');
    if (sc < 0 || sc > tot) throw new Error(`Score must be 0-${tot}.`);

    const p = loadProfile(id);
    const entry = { date: new Date().toISOString(), skill, score: sc, total: tot, notes: notes || '' };
    p.assessments.push(entry);
    saveProfile(p);
    return { studentId: id, skill, score: `${sc}/${tot}`, pct: Math.round(sc / tot * 100) };
  }

  // ── Reading Log ──

  addReadingLog(id, title, pages, lexile) {
    const p = loadProfile(id);
    const entry = {
      date: new Date().toISOString(), title: title || 'Untitled',
      pagesRead: Number(pages) || 0, lexile: lexile ? Number(lexile) : null,
    };
    p.readingLog.push(entry);
    saveProfile(p);
    return { studentId: id, entry, totalBooks: p.readingLog.length };
  }

  getReadingLog(id) {
    const p = loadProfile(id);
    const log = p.readingLog.slice(-20).reverse();
    const totalPages = p.readingLog.reduce((s, b) => s + (b.pagesRead || 0), 0);
    return { studentId: id, totalEntries: p.readingLog.length, totalPages, recent: log };
  }

  // ── Book Recommendations ──

  bookRecommend(id, genre) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-6';
    let books = BOOK_RECOMMENDATIONS[grade] || BOOK_RECOMMENDATIONS['grade-6'];
    if (genre) {
      const g = genre.toLowerCase();
      const filtered = books.filter(b => b.genre === g);
      if (filtered.length) books = filtered;
    }
    // Shuffle and return top 5
    const shuffled = shuffle(books).slice(0, 5);
    return { studentId: id, grade, genre: genre || 'all', recommendations: shuffled };
  }

  // ── Report ──

  getReport(id) {
    const p = loadProfile(id);
    const progress = this.getProgress(id);
    const recentAssessments = p.assessments.slice(-15).reverse();
    const recentBooks = p.readingLog.slice(-10).reverse();
    return {
      studentId: id, grade: p.grade, goal: p.goal,
      progress, recentAssessments, recentBooks,
      strengths: p.strengths, gaps: p.gaps,
      generatedAt: new Date().toISOString(),
    };
  }

  // ── Student List ──

  listStudents() {
    ensureDir(DATA_DIR);
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }
}

// ── Plan helpers ──

function pickDaySkills(dayIndex, alloc) {
  // Rotate skills across 6 active days (Mon-Sat), 2-3 per day
  const ranked = ELA_SKILLS.slice().sort((a, b) => (alloc[b] || 0) - (alloc[a] || 0));
  const perDay = [
    [ranked[0], ranked[1]],         // Mon
    [ranked[2], ranked[3]],         // Tue
    [ranked[0], ranked[4]],         // Wed
    [ranked[1], ranked[5]],         // Thu
    [ranked[2], ranked[6]],         // Fri
    [ranked[3], ranked[0], ranked[5]], // Sat
  ];
  return perDay[dayIndex] || [ranked[0], ranked[1]];
}

function computeStreak(p) {
  // Count consecutive days with any activity (assessment or reading log)
  const dates = new Set();
  for (const a of p.assessments) { if (a.date) dates.add(a.date.slice(0, 10)); }
  for (const r of p.readingLog) { if (r.date) dates.add(r.date.slice(0, 10)); }
  if (!dates.size) return 0;

  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const ds = d.toISOString().slice(0, 10);
    if (dates.has(ds)) { streak++; d.setDate(d.getDate() - 1); }
    else if (i === 0) { d.setDate(d.getDate() - 1); } // allow today to be skipped
    else break;
  }
  return streak;
}

module.exports = StudyPlanner;

// ── CLI ──

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const sp = new StudyPlanner();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade, goal] = args;
        if (!id) throw new Error('Usage: start <id> [grade] [goal]');
        out(sp.start(id, grade, goal));
        break;
      }
      case 'plan': {
        const [, id] = args;
        if (!id) throw new Error('Usage: plan <id>');
        out(sp.generatePlan(id));
        break;
      }
      case 'progress': {
        const [, id] = args;
        if (!id) throw new Error('Usage: progress <id>');
        out(sp.getProgress(id));
        break;
      }
      case 'assess': {
        const [, id, skill, score, total, ...notes] = args;
        if (!id || !skill || !score || !total) throw new Error('Usage: assess <id> <skill> <score> <total> [notes]');
        out(sp.recordAssessment(id, skill, Number(score), Number(total), notes.join(' ')));
        break;
      }
      case 'reading-log': {
        const [, id, title, pages, lexile] = args;
        if (!id) throw new Error('Usage: reading-log <id> [title] [pages] [lexile]');
        if (!title) { out(sp.getReadingLog(id)); }
        else { out(sp.addReadingLog(id, title, pages, lexile)); }
        break;
      }
      case 'set-goal': {
        const [, id, goal] = args;
        if (!id || !goal) throw new Error('Usage: set-goal <id> <goal>');
        out(sp.setGoal(id, goal));
        break;
      }
      case 'set-budget': {
        const [, id, minutes] = args;
        if (!id || !minutes) throw new Error('Usage: set-budget <id> <minutes>');
        out(sp.setBudget(id, minutes));
        break;
      }
      case 'report': {
        const [, id] = args;
        if (!id) throw new Error('Usage: report <id>');
        out(sp.getReport(id));
        break;
      }
      case 'students': {
        out(sp.listStudents());
        break;
      }
      case 'book-recommend': {
        const [, id, genre] = args;
        if (!id) throw new Error('Usage: book-recommend <id> [genre]');
        out(sp.bookRecommend(id, genre));
        break;
      }
      default:
        out({
          usage: 'node study-planner.js <command> [args]',
          commands: ['start', 'plan', 'progress', 'assess', 'reading-log', 'set-goal', 'set-budget', 'report', 'students', 'book-recommend'],
          goals: VALID_GOALS,
          grades: VALID_GRADES,
          skills: ELA_SKILLS,
        });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
