// MS Science Study Planner (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-science-study-planner');

const VALID_GRADES = ['grade-6', 'grade-7', 'grade-8'];
const VALID_GOALS = ["catch-up","stay-strong","get-ahead","stem-focus","test-prep","science-identity"];

const SKILL_AREAS = [
  {
    "key": "life-science",
    "label": "Life Science",
    "dataDir": "ms-science-life"
  },
  {
    "key": "physical-science",
    "label": "Physical Science",
    "dataDir": "ms-science-physical"
  },
  {
    "key": "earth-space",
    "label": "Earth & Space Science",
    "dataDir": "ms-science-earth-space"
  },
  {
    "key": "engineering",
    "label": "Engineering Design",
    "dataDir": "ms-science-engineering"
  },
  {
    "key": "inquiry",
    "label": "Scientific Practices",
    "dataDir": "ms-science-inquiry"
  },
  {
    "key": "reasoning",
    "label": "Crosscutting Concepts",
    "dataDir": "ms-science-reasoning"
  },
  {
    "key": "literacy",
    "label": "Science Literacy",
    "dataDir": "ms-science-literacy"
  }
];

// Percentages map to SKILL_AREAS order: life-science, physical-science, earth-space, engineering, inquiry, reasoning, literacy
const TIME_ALLOC = {
  'catch-up': [20, 20, 18, 8, 14, 10, 10],
  'stay-strong': [15, 15, 15, 13, 14, 14, 14],
  'get-ahead': [12, 12, 10, 20, 18, 16, 12],
  'stem-focus': [10, 24, 10, 26, 14, 10, 6],
  'test-prep': [18, 18, 18, 8, 14, 14, 10],
  'science-identity': [10, 10, 10, 10, 24, 20, 16],
};

const ASSESS_QUESTIONS = {
  'life-science': {
    'grade-6': [
      { q: 'What is the difference between a plant cell and an animal cell? Name at least two differences.', a: 'open-ended', type: 'open' },
      { q: 'Explain how energy flows through a food chain. What happens to the energy at each level?', a: 'open-ended', type: 'open' },
    ],
    'grade-7': [
      { q: 'How do body systems (such as the circulatory and respiratory systems) work together to keep you alive?', a: 'open-ended', type: 'open' },
      { q: 'What is photosynthesis, and why is it important for almost all life on Earth?', a: 'open-ended', type: 'open' },
    ],
    'grade-8': [
      { q: 'Explain how natural selection can lead to changes in a population over many generations.', a: 'open-ended', type: 'open' },
      { q: 'How do genes and the environment both contribute to the traits an organism displays?', a: 'open-ended', type: 'open' },
    ],
  },
  'physical-science': {
    'grade-6': [
      { q: 'What is the difference between a physical change and a chemical change? Give an example of each.', a: 'open-ended', type: 'open' },
      { q: 'Describe how heat energy moves from a warm object to a cool object. What is this process called?', a: 'open-ended', type: 'open' },
    ],
    'grade-7': [
      { q: 'If you push a box across the floor and it slows down, what force is acting against the motion? Explain how you know.', a: 'open-ended', type: 'open' },
      { q: 'What happens to the atoms and molecules in a substance when it changes from a solid to a liquid?', a: 'open-ended', type: 'open' },
    ],
    'grade-8': [
      { q: 'Explain Newton\'s third law of motion and give a real-world example.', a: 'open-ended', type: 'open' },
      { q: 'How is kinetic energy different from potential energy? Describe a situation where one converts into the other.', a: 'open-ended', type: 'open' },
    ],
  },
  'earth-space': {
    'grade-6': [
      { q: 'What causes the cycle of day and night on Earth?', a: 'open-ended', type: 'open' },
      { q: 'Describe the three main types of rocks (igneous, sedimentary, metamorphic) and how one type can change into another.', a: 'open-ended', type: 'open' },
    ],
    'grade-7': [
      { q: 'What causes earthquakes, and how are they related to tectonic plate boundaries?', a: 'open-ended', type: 'open' },
      { q: 'Explain how the water cycle moves water between the atmosphere, land, and oceans.', a: 'open-ended', type: 'open' },
    ],
    'grade-8': [
      { q: 'How do scientists use evidence from fossils and rock layers to understand Earth\'s history?', a: 'open-ended', type: 'open' },
      { q: 'Describe one way that human activity is contributing to climate change and explain the mechanism involved.', a: 'open-ended', type: 'open' },
    ],
  },
  'engineering': {
    'grade-6': [
      { q: 'You need to design a container that keeps an ice cube from melting for as long as possible. What materials would you choose, and why?', a: 'open-ended', type: 'open' },
      { q: 'What is the difference between science and engineering? How do they work together?', a: 'open-ended', type: 'open' },
    ],
    'grade-7': [
      { q: 'Describe the steps of the engineering design process. Why is testing and redesigning important?', a: 'open-ended', type: 'open' },
      { q: 'A bridge you designed collapsed under a heavy load. What would you do to improve your next design?', a: 'open-ended', type: 'open' },
    ],
    'grade-8': [
      { q: 'How do engineers balance trade-offs (such as cost, safety, and performance) when designing a solution?', a: 'open-ended', type: 'open' },
      { q: 'Describe a real-world problem that could be solved with engineering. Outline the criteria and constraints for your solution.', a: 'open-ended', type: 'open' },
    ],
  },
  'inquiry': {
    'grade-6': [
      { q: 'What makes a scientific question different from an everyday question? Give an example of each.', a: 'open-ended', type: 'open' },
      { q: 'Why is it important to keep all variables the same except the one you are testing in an experiment?', a: 'open-ended', type: 'open' },
    ],
    'grade-7': [
      { q: 'You notice that plants near a window grow taller than plants in a dark corner. Design a simple experiment to test whether light affects plant growth.', a: 'open-ended', type: 'open' },
      { q: 'What is the difference between an observation and an inference? Give an example of each.', a: 'open-ended', type: 'open' },
    ],
    'grade-8': [
      { q: 'A classmate says their experiment proves their hypothesis is true. Why is the word "proves" problematic in science?', a: 'open-ended', type: 'open' },
      { q: 'You collected data from an experiment and your results do not support your hypothesis. What should you do next, and why?', a: 'open-ended', type: 'open' },
    ],
  },
  'reasoning': {
    'grade-6': [
      { q: 'Give an example of a pattern you can observe in nature. Why are patterns useful in science?', a: 'open-ended', type: 'open' },
      { q: 'What does "cause and effect" mean in science? Describe a cause-and-effect relationship you have observed.', a: 'open-ended', type: 'open' },
    ],
    'grade-7': [
      { q: 'What is a system in science? Pick an example (like the human body or an ecosystem) and identify its parts and how they interact.', a: 'open-ended', type: 'open' },
      { q: 'Why do scientists use models, and what are the limitations of models?', a: 'open-ended', type: 'open' },
    ],
    'grade-8': [
      { q: 'Explain the concept of "stability and change" using an example from Earth science or biology.', a: 'open-ended', type: 'open' },
      { q: 'How can understanding scale, proportion, and quantity help you compare very large or very small things in science?', a: 'open-ended', type: 'open' },
    ],
  },
  'literacy': {
    'grade-6': [
      { q: 'How can you tell if a claim in a science article is supported by evidence? What would you look for?', a: 'open-ended', type: 'open' },
      { q: 'Why is it important to use precise scientific vocabulary when writing about an experiment?', a: 'open-ended', type: 'open' },
    ],
    'grade-7': [
      { q: 'You read two articles about whether video games affect sleep. One says yes, one says no. How would you evaluate which is more trustworthy?', a: 'open-ended', type: 'open' },
      { q: 'What are the key parts of a scientific explanation? How is it different from just stating a fact?', a: 'open-ended', type: 'open' },
    ],
    'grade-8': [
      { q: 'Explain the CER (Claim-Evidence-Reasoning) framework. Why is reasoning the most important part?', a: 'open-ended', type: 'open' },
      { q: 'A website claims a new supplement boosts memory by 50%. What questions would you ask to evaluate this claim scientifically?', a: 'open-ended', type: 'open' },
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
