// eClaw HS ELA Study Planner (Grades 9-12). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-ela-study-planner');
const ALL_DATA_ROOT = path.join(__dirname, '..', '..', 'data');

const GRADES = ['grade-9', 'grade-10', 'grade-11', 'grade-12'];
const GOALS = ['on-level', 'honors', 'ap-lang', 'ap-lit', 'sat-prep', 'college-readiness', 'writing-focus'];
const TRACKS = ['regular', 'honors', 'AP'];

const SKILL_AREAS = {
  'literature':          { label: 'Literature',            dataDir: 'hs-ela-literature' },
  'informational':       { label: 'Informational Text',    dataDir: 'hs-ela-informational' },
  'writing':             { label: 'Writing',               dataDir: 'hs-ela-writing' },
  'grammar-language':    { label: 'Grammar & Language',     dataDir: 'hs-ela-grammar-language' },
  'vocabulary':          { label: 'Vocabulary',             dataDir: 'hs-ela-vocabulary' },
  'speaking-listening':  { label: 'Speaking & Listening',   dataDir: 'hs-ela-speaking-listening' },
  'research-media':      { label: 'Research & Media',       dataDir: 'hs-ela-research-media' },
};

// ── Time allocation weights by goal (must sum to 100) ──

const ALLOCATIONS = {
  'on-level':          { literature: 20, informational: 15, writing: 25, 'grammar-language': 15, vocabulary: 10, 'speaking-listening': 8, 'research-media': 7 },
  'honors':            { literature: 22, informational: 18, writing: 22, 'grammar-language': 12, vocabulary: 10, 'speaking-listening': 8, 'research-media': 8 },
  'ap-lang':           { literature: 10, informational: 25, writing: 30, 'grammar-language': 10, vocabulary: 10, 'speaking-listening': 8, 'research-media': 7 },
  'ap-lit':            { literature: 30, informational: 10, writing: 25, 'grammar-language': 10, vocabulary: 10, 'speaking-listening': 8, 'research-media': 7 },
  'sat-prep':          { literature: 15, informational: 20, writing: 20, 'grammar-language': 20, vocabulary: 15, 'speaking-listening': 5, 'research-media': 5 },
  'college-readiness': { literature: 18, informational: 18, writing: 22, 'grammar-language': 12, vocabulary: 12, 'speaking-listening': 10, 'research-media': 8 },
  'writing-focus':     { literature: 15, informational: 10, writing: 35, 'grammar-language': 15, vocabulary: 10, 'speaking-listening': 8, 'research-media': 7 },
};

// ── Day schedule templates ──

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ── Book Recommendations ──

const BOOKS = {
  'grade-9': {
    classic: [
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', lexile: '870L', pages: 281 },
      { title: 'Romeo and Juliet', author: 'William Shakespeare', lexile: '1100L', pages: 150 },
      { title: 'The Odyssey', author: 'Homer', lexile: '1050L', pages: 400 },
      { title: 'Lord of the Flies', author: 'William Golding', lexile: '770L', pages: 224 },
      { title: 'Animal Farm', author: 'George Orwell', lexile: '1170L', pages: 112 },
      { title: 'A Raisin in the Sun', author: 'Lorraine Hansberry', lexile: '680L', pages: 151 },
    ],
    contemporary: [
      { title: 'The Hate U Give', author: 'Angie Thomas', lexile: '590L', pages: 444 },
      { title: 'Long Way Down', author: 'Jason Reynolds', lexile: '720L', pages: 320 },
      { title: 'The House on Mango Street', author: 'Sandra Cisneros', lexile: '870L', pages: 110 },
      { title: 'Speak', author: 'Laurie Halse Anderson', lexile: '690L', pages: 198 },
      { title: 'The Poet X', author: 'Elizabeth Acevedo', lexile: '720L', pages: 357 },
      { title: 'Piecing Me Together', author: 'Renee Watson', lexile: '750L', pages: 260 },
    ],
  },
  'grade-10': {
    classic: [
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', lexile: '1070L', pages: 180 },
      { title: 'Of Mice and Men', author: 'John Steinbeck', lexile: '630L', pages: 107 },
      { title: 'Fahrenheit 451', author: 'Ray Bradbury', lexile: '890L', pages: 158 },
      { title: 'Julius Caesar', author: 'William Shakespeare', lexile: '1190L', pages: 128 },
      { title: 'Night', author: 'Elie Wiesel', lexile: '590L', pages: 120 },
      { title: 'Their Eyes Were Watching God', author: 'Zora Neale Hurston', lexile: '1080L', pages: 219 },
    ],
    contemporary: [
      { title: 'Born a Crime', author: 'Trevor Noah', lexile: '1000L', pages: 304 },
      { title: 'All American Boys', author: 'Jason Reynolds & Brendan Kiely', lexile: '750L', pages: 320 },
      { title: 'The Book Thief', author: 'Markus Zusak', lexile: '730L', pages: 552 },
      { title: 'Between the World and Me', author: 'Ta-Nehisi Coates', lexile: '1180L', pages: 152 },
      { title: 'Mexican Gothic', author: 'Silvia Moreno-Garcia', lexile: '820L', pages: 301 },
      { title: 'An Ember in the Ashes', author: 'Sabaa Tahir', lexile: '800L', pages: 446 },
    ],
  },
  'grade-11': {
    classic: [
      { title: 'The Scarlet Letter', author: 'Nathaniel Hawthorne', lexile: '1420L', pages: 238 },
      { title: 'The Adventures of Huckleberry Finn', author: 'Mark Twain', lexile: '990L', pages: 366 },
      { title: 'The Crucible', author: 'Arthur Miller', lexile: '1320L', pages: 152 },
      { title: 'Narrative of the Life of Frederick Douglass', author: 'Frederick Douglass', lexile: '1080L', pages: 128 },
      { title: 'Death of a Salesman', author: 'Arthur Miller', lexile: '800L', pages: 139 },
      { title: 'Walden', author: 'Henry David Thoreau', lexile: '1410L', pages: 352 },
    ],
    contemporary: [
      { title: 'Into the Wild', author: 'Jon Krakauer', lexile: '1070L', pages: 224 },
      { title: 'Just Mercy', author: 'Bryan Stevenson', lexile: '1040L', pages: 368 },
      { title: 'The Glass Castle', author: 'Jeannette Walls', lexile: '1010L', pages: 288 },
      { title: 'Educated', author: 'Tara Westover', lexile: '1000L', pages: 334 },
      { title: 'Station Eleven', author: 'Emily St. John Mandel', lexile: '870L', pages: 333 },
      { title: 'The Underground Railroad', author: 'Colson Whitehead', lexile: '920L', pages: 306 },
    ],
  },
  'grade-12': {
    classic: [
      { title: 'Hamlet', author: 'William Shakespeare', lexile: '1390L', pages: 200 },
      { title: '1984', author: 'George Orwell', lexile: '1080L', pages: 328 },
      { title: 'Brave New World', author: 'Aldous Huxley', lexile: '870L', pages: 288 },
      { title: 'Beloved', author: 'Toni Morrison', lexile: '870L', pages: 324 },
      { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', lexile: '1070L', pages: 430 },
      { title: 'Heart of Darkness', author: 'Joseph Conrad', lexile: '1110L', pages: 96 },
    ],
    contemporary: [
      { title: 'The Namesake', author: 'Jhumpa Lahiri', lexile: '1090L', pages: 291 },
      { title: 'Never Let Me Go', author: 'Kazuo Ishiguro', lexile: '1040L', pages: 288 },
      { title: 'Exit West', author: 'Mohsin Hamid', lexile: '1050L', pages: 231 },
      { title: 'Homegoing', author: 'Yaa Gyasi', lexile: '920L', pages: 305 },
      { title: 'The Remains of the Day', author: 'Kazuo Ishiguro', lexile: '1150L', pages: 245 },
      { title: 'There There', author: 'Tommy Orange', lexile: '890L', pages: 290 },
    ],
  },
};

// ── AP Exam Prep Milestones ──

const AP_MILESTONES = {
  'ap-lang': [
    { phase: 'Foundation', months: 'Sep-Nov', focus: 'Rhetorical analysis, SOAPSTone, appeals, argument basics', weeklyHrs: 4 },
    { phase: 'Development', months: 'Dec-Jan', focus: 'Argument essay, Toulmin model, evidence types, synthesis intro', weeklyHrs: 5 },
    { phase: 'Practice', months: 'Feb-Mar', focus: 'Synthesis essay, source integration, timed writes', weeklyHrs: 6 },
    { phase: 'Review', months: 'Apr-May', focus: 'Full practice exams, MCQ strategies, final review', weeklyHrs: 7 },
  ],
  'ap-lit': [
    { phase: 'Foundation', months: 'Sep-Nov', focus: 'Close reading, poetry analysis, prose analysis', weeklyHrs: 4 },
    { phase: 'Development', months: 'Dec-Jan', focus: 'Literary argument, open-question novels, criticism', weeklyHrs: 5 },
    { phase: 'Practice', months: 'Feb-Mar', focus: 'Timed essay practice, MCQ passage work', weeklyHrs: 6 },
    { phase: 'Review', months: 'Apr-May', focus: 'Full practice exams, periods/movements review', weeklyHrs: 7 },
  ],
};

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
    studentId: id,
    grade: null,
    goal: 'on-level',
    track: 'regular',
    dailyBudget: 60,
    readingConfidence: 'medium',
    writingConfidence: 'medium',
    strengths: [],
    gaps: [],
    createdAt: new Date().toISOString(),
    assessments: [],
    readingLog: [],
    apPrep: {},
    weeklyPlans: [],
  };
}

function saveProfile(p) { ensureDir(DATA_DIR); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }

// ── Helpers ──

// ── Aggregate progress from sibling hs-ela-* data dirs ──

function aggregateProgress(studentId) {
  const result = {};
  for (const [area, info] of Object.entries(SKILL_AREAS)) {
    const dir = path.join(ALL_DATA_ROOT, info.dataDir);
    const fp = path.join(dir, String(studentId).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json');
    if (fs.existsSync(fp)) {
      try {
        const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
        const assessments = data.assessments || [];
        const skills = data.skills || {};
        let totalSkills = 0, masteredSkills = 0;
        for (const sk of Object.values(skills)) {
          totalSkills++;
          if (sk.mastery >= 0.8) masteredSkills++;
        }
        result[area] = {
          label: info.label,
          totalAssessments: assessments.length,
          totalSkills,
          masteredSkills,
          masteryPct: totalSkills > 0 ? Math.round(masteredSkills / totalSkills * 100) : 0,
          lastActivity: assessments.length > 0 ? assessments[assessments.length - 1].date : null,
        };
      } catch { result[area] = { label: info.label, error: 'corrupt data' }; }
    } else {
      result[area] = { label: info.label, totalAssessments: 0, totalSkills: 0, masteredSkills: 0, masteryPct: 0, lastActivity: null };
    }
  }
  return result;
}

// ── Weekly Plan Generation ──

function generateWeeklyPlan(profile) {
  const goal = profile.goal || 'on-level';
  const budget = profile.dailyBudget || 60;
  const alloc = ALLOCATIONS[goal] || ALLOCATIONS['on-level'];
  const weeklyMinutes = budget * 7;
  const plan = [];

  for (const day of DAYS) {
    const dayPlan = { day, activities: [] };
    let remaining = budget;

    // Distribute skills across the week; weight higher-priority areas toward weekdays
    const isWeekend = day === 'Saturday' || day === 'Sunday';
    const dayAreas = isWeekend
      ? ['literature', 'writing', 'vocabulary']
      : Object.keys(SKILL_AREAS);

    for (const area of dayAreas) {
      if (remaining <= 0) break;
      const pct = alloc[area] || 0;
      let mins = Math.floor((pct / 100) * budget);
      if (isWeekend) mins = Math.round(mins * 1.4); // more time on weekends for fewer areas
      mins = Math.min(mins, remaining);
      if (mins >= 5) {
        dayPlan.activities.push({ skill: area, label: SKILL_AREAS[area].label, minutes: mins });
        remaining -= mins;
      }
    }
    dayPlan.totalMinutes = budget - remaining;
    plan.push(dayPlan);
  }

  return {
    studentId: profile.studentId,
    grade: profile.grade,
    goal,
    track: profile.track,
    dailyBudget: budget,
    weeklyMinutes,
    generatedAt: new Date().toISOString(),
    plan,
  };
}

// ── Public API ──

class StudyPlanner {

  start(id, grade) {
    const p = loadProfile(id);
    if (grade) {
      if (!GRADES.includes(grade)) throw new Error(`Unknown grade: ${grade}. Valid: ${GRADES.join(', ')}`);
      p.grade = grade;
    }
    if (!p.grade) p.grade = 'grade-9';
    saveProfile(p);
    return { action: 'start', profile: this.getProfileSummary(p), goals: GOALS, tracks: TRACKS };
  }

  getProfileSummary(p) {
    return {
      studentId: p.studentId, grade: p.grade, goal: p.goal, track: p.track,
      dailyBudget: p.dailyBudget, readingConfidence: p.readingConfidence,
      writingConfidence: p.writingConfidence, strengths: p.strengths, gaps: p.gaps,
      createdAt: p.createdAt, totalAssessments: p.assessments.length,
      booksRead: p.readingLog.length,
    };
  }

  setGoal(id, goal) {
    if (!GOALS.includes(goal)) throw new Error(`Unknown goal: ${goal}. Valid: ${GOALS.join(', ')}`);
    const p = loadProfile(id); p.goal = goal; saveProfile(p);
    return { studentId: id, goal };
  }

  setBudget(id, minutes) {
    const mins = Number(minutes);
    if (!mins || mins < 15 || mins > 300) throw new Error('Budget must be 15-300 minutes per day.');
    const p = loadProfile(id); p.dailyBudget = mins; saveProfile(p);
    return { studentId: id, dailyBudget: mins };
  }

  setProfile(id, field, value) {
    const p = loadProfile(id);
    const valid = { track: TRACKS, readingConfidence: ['low', 'medium', 'high'], writingConfidence: ['low', 'medium', 'high'] };
    if (valid[field]) {
      if (!valid[field].includes(value)) throw new Error(`${field} must be one of: ${valid[field].join(', ')}`);
      p[field] = value;
    } else if (field === 'strengths' || field === 'gaps') {
      p[field] = value.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      throw new Error(`Unknown profile field: ${field}. Valid: track, readingConfidence, writingConfidence, strengths, gaps`);
    }
    saveProfile(p);
    return { studentId: id, [field]: p[field] };
  }

  plan(id) {
    const p = loadProfile(id);
    if (!p.grade) throw new Error('Set grade first: start <id> <grade>');
    const weekly = generateWeeklyPlan(p);
    p.weeklyPlans.push({ generatedAt: weekly.generatedAt, goal: weekly.goal });
    if (p.weeklyPlans.length > 20) p.weeklyPlans = p.weeklyPlans.slice(-20);
    saveProfile(p);
    return weekly;
  }

  progress(id) {
    const p = loadProfile(id);
    const cross = aggregateProgress(id);
    const totalAreas = Object.keys(cross).length;
    let totalMastery = 0;
    for (const area of Object.values(cross)) {
      totalMastery += (area.masteryPct || 0);
    }
    return {
      studentId: id, grade: p.grade, goal: p.goal, track: p.track,
      overallMasteryPct: totalAreas > 0 ? Math.round(totalMastery / totalAreas) : 0,
      skillAreas: cross,
      booksRead: p.readingLog.length,
      totalPages: p.readingLog.reduce((s, b) => s + (b.pagesRead || 0), 0),
      totalAssessments: p.assessments.length,
    };
  }

  assess(id, area, score, total, notes) {
    if (!SKILL_AREAS[area]) throw new Error(`Unknown skill area: ${area}. Valid: ${Object.keys(SKILL_AREAS).join(', ')}`);
    const sc = Number(score), tot = Number(total);
    if (!tot || tot <= 0) throw new Error('total must be positive');
    if (sc < 0 || sc > tot) throw new Error(`score must be 0-${tot}`);
    const p = loadProfile(id);
    const entry = { date: new Date().toISOString(), area, score: sc, total: tot, notes: notes || '' };
    p.assessments.push(entry);
    saveProfile(p);
    return { studentId: id, area, score: `${sc}/${tot}`, pct: Math.round(sc / tot * 100), notes: entry.notes };
  }

  readingLog(id, action, ...args) {
    const p = loadProfile(id);
    if (action === 'add') {
      const [title, author, pages, lexile] = args;
      if (!title) throw new Error('Usage: reading-log <id> add <title> <author> <pages> [lexile]');
      const entry = {
        date: new Date().toISOString(),
        title: title || '',
        author: author || '',
        pagesRead: Number(pages) || 0,
        lexile: lexile || '',
        status: 'in-progress',
      };
      p.readingLog.push(entry);
      saveProfile(p);
      return { action: 'added', entry, totalBooks: p.readingLog.length };
    }
    if (action === 'finish') {
      const [title] = args;
      const book = [...p.readingLog].reverse().find(b => b.title.toLowerCase() === (title || '').toLowerCase());
      if (!book) return { error: `Book "${title}" not found in log.` };
      book.status = 'finished';
      book.finishedDate = new Date().toISOString();
      saveProfile(p);
      return { action: 'finished', book };
    }
    if (action === 'update') {
      const [title, pages] = args;
      const book = [...p.readingLog].reverse().find(b => b.title.toLowerCase() === (title || '').toLowerCase());
      if (!book) return { error: `Book "${title}" not found in log.` };
      book.pagesRead = Number(pages) || book.pagesRead;
      saveProfile(p);
      return { action: 'updated', book };
    }
    // default: list
    const finished = p.readingLog.filter(b => b.status === 'finished').length;
    const inProgress = p.readingLog.filter(b => b.status === 'in-progress').length;
    const totalPages = p.readingLog.reduce((s, b) => s + (b.pagesRead || 0), 0);
    return {
      studentId: id,
      totalBooks: p.readingLog.length,
      finished, inProgress, totalPages,
      books: p.readingLog.slice(-20).reverse(),
    };
  }

  bookRecommend(grade, category) {
    if (!GRADES.includes(grade)) throw new Error(`Unknown grade: ${grade}. Valid: ${GRADES.join(', ')}`);
    const gradeBooks = BOOKS[grade];
    if (category && category !== 'classic' && category !== 'contemporary') {
      throw new Error('Category must be classic or contemporary.');
    }
    if (category) return { grade, category, books: gradeBooks[category] };
    return { grade, classic: gradeBooks.classic, contemporary: gradeBooks.contemporary };
  }

  apPrep(id, exam) {
    if (!['ap-lang', 'ap-lit'].includes(exam)) throw new Error('Exam must be ap-lang or ap-lit.');
    const p = loadProfile(id);
    if (!p.apPrep[exam]) {
      p.apPrep[exam] = { started: new Date().toISOString(), currentPhase: 0, practiceScores: [], timedWrites: 0 };
      saveProfile(p);
    }
    const milestones = AP_MILESTONES[exam];
    const prep = p.apPrep[exam];
    const currentPhase = milestones[Math.min(prep.currentPhase, milestones.length - 1)];
    return {
      studentId: id, exam, started: prep.started,
      currentPhase,
      allPhases: milestones,
      practiceScores: prep.practiceScores,
      timedWrites: prep.timedWrites,
    };
  }

  apRecord(id, exam, score, total, type) {
    if (!['ap-lang', 'ap-lit'].includes(exam)) throw new Error('Exam must be ap-lang or ap-lit.');
    const p = loadProfile(id);
    if (!p.apPrep[exam]) p.apPrep[exam] = { started: new Date().toISOString(), currentPhase: 0, practiceScores: [], timedWrites: 0 };
    const entry = { date: new Date().toISOString(), score: Number(score), total: Number(total), type: type || 'practice' };
    p.apPrep[exam].practiceScores.push(entry);
    if (type === 'timed-write') p.apPrep[exam].timedWrites++;
    saveProfile(p);
    return { studentId: id, exam, recorded: entry, totalPractices: p.apPrep[exam].practiceScores.length };
  }

  apAdvance(id, exam) {
    if (!['ap-lang', 'ap-lit'].includes(exam)) throw new Error('Exam must be ap-lang or ap-lit.');
    const p = loadProfile(id);
    if (!p.apPrep[exam]) throw new Error(`No AP prep started for ${exam}. Run: ap-prep <id> ${exam}`);
    const max = AP_MILESTONES[exam].length - 1;
    if (p.apPrep[exam].currentPhase < max) {
      p.apPrep[exam].currentPhase++;
      saveProfile(p);
    }
    return { studentId: id, exam, phase: p.apPrep[exam].currentPhase, milestone: AP_MILESTONES[exam][p.apPrep[exam].currentPhase] };
  }

  report(id) {
    const p = loadProfile(id);
    const prog = this.progress(id);
    const recentAssessments = p.assessments.slice(-15).reverse();
    const recentBooks = p.readingLog.slice(-10).reverse();
    const apStatus = {};
    for (const exam of ['ap-lang', 'ap-lit']) {
      if (p.apPrep[exam]) {
        apStatus[exam] = {
          phase: AP_MILESTONES[exam][p.apPrep[exam].currentPhase]?.phase || 'Not started',
          practiceCount: p.apPrep[exam].practiceScores.length,
          timedWrites: p.apPrep[exam].timedWrites,
          avgScore: p.apPrep[exam].practiceScores.length > 0
            ? Math.round(p.apPrep[exam].practiceScores.reduce((s, e) => s + (e.score / e.total) * 100, 0) / p.apPrep[exam].practiceScores.length)
            : null,
        };
      }
    }
    return {
      studentId: id, grade: p.grade, goal: p.goal, track: p.track, dailyBudget: p.dailyBudget,
      readingConfidence: p.readingConfidence, writingConfidence: p.writingConfidence,
      strengths: p.strengths, gaps: p.gaps,
      progress: prog,
      recentAssessments,
      readingLog: { total: p.readingLog.length, recentBooks },
      apStatus: Object.keys(apStatus).length > 0 ? apStatus : null,
      weeklyPlansGenerated: p.weeklyPlans.length,
    };
  }

  listStudents() {
    ensureDir(DATA_DIR);
    try {
      const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json') && !f.includes('.corrupt.'));
      return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
    } catch { return { count: 0, students: [] }; }
  }
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
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        out(sp.start(id, grade || undefined));
        break;
      }
      case 'plan': {
        const [, id] = args;
        if (!id) throw new Error('Usage: plan <id>');
        out(sp.plan(id));
        break;
      }
      case 'progress': {
        const [, id] = args;
        if (!id) throw new Error('Usage: progress <id>');
        out(sp.progress(id));
        break;
      }
      case 'assess': {
        const [, id, area, score, total, ...notes] = args;
        if (!id || !area || !score || !total) throw new Error('Usage: assess <id> <area> <score> <total> [notes]');
        out(sp.assess(id, area, Number(score), Number(total), notes.join(' ')));
        break;
      }
      case 'reading-log': {
        const [, id, action, ...rest] = args;
        if (!id) throw new Error('Usage: reading-log <id> [add|finish|update|list] [args]');
        out(sp.readingLog(id, action || 'list', ...rest));
        break;
      }
      case 'set-goal': {
        const [, id, goal] = args;
        if (!id || !goal) throw new Error('Usage: set-goal <id> <goal>');
        out(sp.setGoal(id, goal));
        break;
      }
      case 'set-budget': {
        const [, id, mins] = args;
        if (!id || !mins) throw new Error('Usage: set-budget <id> <minutes>');
        out(sp.setBudget(id, mins));
        break;
      }
      case 'set-profile': {
        const [, id, field, ...vals] = args;
        if (!id || !field || !vals.length) throw new Error('Usage: set-profile <id> <field> <value>');
        out(sp.setProfile(id, field, vals.join(' ')));
        break;
      }
      case 'report': {
        const [, id] = args;
        if (!id) throw new Error('Usage: report <id>');
        out(sp.report(id));
        break;
      }
      case 'students': {
        out(sp.listStudents());
        break;
      }
      case 'book-recommend': {
        const [, grade, cat] = args;
        if (!grade) throw new Error('Usage: book-recommend <grade> [classic|contemporary]');
        out(sp.bookRecommend(grade, cat || undefined));
        break;
      }
      case 'ap-prep': {
        const [, id, exam] = args;
        if (!id || !exam) throw new Error('Usage: ap-prep <id> <ap-lang|ap-lit>');
        out(sp.apPrep(id, exam));
        break;
      }
      case 'ap-record': {
        const [, id, exam, score, total, type] = args;
        if (!id || !exam || !score || !total) throw new Error('Usage: ap-record <id> <ap-lang|ap-lit> <score> <total> [type]');
        out(sp.apRecord(id, exam, score, total, type));
        break;
      }
      case 'ap-advance': {
        const [, id, exam] = args;
        if (!id || !exam) throw new Error('Usage: ap-advance <id> <ap-lang|ap-lit>');
        out(sp.apAdvance(id, exam));
        break;
      }
      default:
        out({
          usage: 'node study-planner.js <command> [args]',
          commands: ['start', 'plan', 'progress', 'assess', 'reading-log', 'set-goal', 'set-budget', 'set-profile', 'report', 'students', 'book-recommend', 'ap-prep', 'ap-record', 'ap-advance'],
          grades: GRADES, goals: GOALS, tracks: TRACKS,
          skillAreas: Object.keys(SKILL_AREAS),
        });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
