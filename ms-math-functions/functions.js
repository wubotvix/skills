// eClaw MS Math Functions Tutor (Grade 8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-math-functions');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'pre-functions': ['input-output-tables', 'plotting-points'],
  },
  'grade-7': {
    'proportional-functions': ['proportional-tables', 'proportional-graphs'],
  },
  'grade-8': {
    'function-basics': ['function-definition', 'function-vs-non-function', 'function-notation'],
    'linear-functions': ['slope-calculation', 'y-intercept', 'slope-intercept-form', 'graphing-linear'],
    'comparing-functions': ['compare-slopes', 'compare-intercepts', 'compare-representations'],
    'constructing-functions': ['function-from-context', 'function-from-table'],
    'nonlinear': ['linear-vs-nonlinear', 'qualitative-features'],
  },
};

const PROBLEM_BANKS = {
  'grade-6': {
    'input-output-tables': {
      problems: [
        { prompt: 'Rule: y = 2x + 1. Find y when x = 0, 1, 2, 3, 4', answer: '1, 3, 5, 7, 9' },
        { prompt: 'Rule: y = 3x. Find y when x = 1, 2, 3, 4, 5', answer: '3, 6, 9, 12, 15' },
        { prompt: 'Table: x: 1→4, 2→7, 3→10, 4→13. What is the rule?', answer: 'y = 3x + 1' },
        { prompt: 'Rule: y = x + 5. Find y when x = 0, 3, 7, 10', answer: '5, 8, 12, 15' },
        { prompt: 'Table: x: 0→2, 1→5, 2→8, 3→11. What is the rule?', answer: 'y = 3x + 2' },
        { prompt: 'Rule: y = 4x - 1. Find y when x = 1, 2, 3', answer: '3, 7, 11' },
      ],
    },
    'plotting-points': {
      problems: [
        { prompt: 'Plot (3, 5). Which quadrant is it in?', answer: 'I' },
        { prompt: 'Plot (-2, 4). Which quadrant?', answer: 'II' },
        { prompt: 'A point is at x=0, y=3. Where does it lie?', answer: 'y-axis' },
        { prompt: 'What are the coordinates of a point 2 right and 3 up from the origin?', answer: '(2, 3)' },
        { prompt: 'Plot (-1, -5). Which quadrant?', answer: 'III' },
        { prompt: 'Plot (4, -2). Which quadrant?', answer: 'IV' },
      ],
    },
  },
  'grade-7': {
    'proportional-tables': {
      problems: [
        { prompt: 'Table: (1,3), (2,6), (3,9). Is this proportional? What is k?', answer: 'yes, k=3' },
        { prompt: 'Table: (2,5), (4,10), (6,15). Is this proportional? What is k?', answer: 'yes, k=2.5' },
        { prompt: 'Table: (1,4), (2,7), (3,10). Proportional?', answer: 'no', hint: '4/1≠7/2' },
        { prompt: 'Table: (0,0), (3,12), (5,20). Is this proportional? What is k?', answer: 'yes, k=4' },
        { prompt: 'Table: (1,5), (2,10), (4,20). Find k and write the equation.', answer: 'k=5, y=5x' },
        { prompt: 'Table: (2,8), (3,12), (5,20). What is k?', answer: '4', numeric: 4 },
      ],
    },
    'proportional-graphs': {
      problems: [
        { prompt: 'A graph is a straight line through (0,0) and (2,8). Proportional? Find k.', answer: 'yes, k=4' },
        { prompt: 'A graph passes through (0,3) and (2,9). Proportional?', answer: 'no', hint: 'Does not pass through origin' },
        { prompt: 'A line passes through origin and (5,15). Write the equation.', answer: 'y = 3x' },
        { prompt: 'A proportional graph has the point (4, 20). What is y when x = 7?', answer: '35', numeric: 35 },
        { prompt: 'Two lines pass through origin. Line A: (1,3). Line B: (1,5). Which is steeper?', answer: 'Line B' },
        { prompt: 'A graph passes through (0,0) and (3,12). What is the unit rate?', answer: '4', numeric: 4 },
      ],
    },
  },
  'grade-8': {
    'function-definition': {
      problems: [
        { prompt: 'A function assigns exactly ___ output(s) to each input.', answer: 'one' },
        { prompt: 'f(x) = 2x + 3. What is f(5)?', answer: '13', numeric: 13 },
        { prompt: 'f(x) = x² - 1. What is f(4)?', answer: '15', numeric: 15 },
        { prompt: 'f(x) = -3x + 10. What is f(2)?', answer: '4', numeric: 4 },
        { prompt: 'If f(x) = 4x - 5, find x when f(x) = 11.', answer: '4', numeric: 4 },
        { prompt: 'f(x) = x/2 + 6. What is f(8)?', answer: '10', numeric: 10 },
      ],
    },
    'function-vs-non-function': {
      problems: [
        { prompt: 'Is {(1,2), (3,4), (1,5)} a function?', answer: 'no', hint: 'Input 1 maps to both 2 and 5' },
        { prompt: 'Is {(1,3), (2,3), (3,3)} a function?', answer: 'yes', hint: 'Each input has exactly one output' },
        { prompt: 'Does the equation x = 3 represent a function?', answer: 'no', hint: 'Vertical line fails vertical line test' },
        { prompt: 'Does y = 2x + 1 represent a function?', answer: 'yes' },
        { prompt: 'Is {(2,4), (3,6), (4,8), (5,10)} a function?', answer: 'yes' },
        { prompt: 'A mapping diagram shows input 5 going to both 7 and 9. Function?', answer: 'no' },
        { prompt: 'Does y = x² represent a function?', answer: 'yes', hint: 'Each x gives exactly one y' },
        { prompt: 'Does x² + y² = 25 represent a function?', answer: 'no', hint: 'Circle fails vertical line test' },
      ],
    },
    'function-notation': {
      problems: [
        { prompt: 'g(x) = 5x - 2. Find g(3).', answer: '13', numeric: 13 },
        { prompt: 'h(x) = x² + x. Find h(4).', answer: '20', numeric: 20 },
        { prompt: 'f(x) = -2x + 8. Find f(0).', answer: '8', numeric: 8 },
        { prompt: 'g(x) = 3x + 1. Find x when g(x) = 16.', answer: '5', numeric: 5 },
        { prompt: 'f(x) = x/3 - 2. Find f(12).', answer: '2', numeric: 2 },
        { prompt: 'h(x) = 4x - 7. Find h(-2).', answer: '-15', numeric: -15 },
      ],
    },
    'slope-calculation': {
      problems: [
        { prompt: 'Find the slope between (1, 3) and (4, 9).', answer: '2', numeric: 2 },
        { prompt: 'Find the slope between (0, 5) and (2, 1).', answer: '-2', numeric: -2 },
        { prompt: 'Find the slope between (-3, 2) and (1, 10).', answer: '2', numeric: 2 },
        { prompt: 'Table: (1,4), (3,10). Find the slope.', answer: '3', numeric: 3 },
        { prompt: 'Find the slope between (2, 7) and (5, 7).', answer: '0', numeric: 0 },
        { prompt: 'Find the slope between (-1, -4) and (3, 8).', answer: '3', numeric: 3 },
        { prompt: 'Table: (0,-2), (1,1), (2,4). Find the slope.', answer: '3', numeric: 3 },
        { prompt: 'Find the slope between (6, 1) and (2, 9).', answer: '-2', numeric: -2 },
      ],
    },
    'y-intercept': {
      problems: [
        { prompt: 'y = 3x + 7. What is the y-intercept?', answer: '7', numeric: 7 },
        { prompt: 'Table: (0,-3), (1,1), (2,5). What is the y-intercept?', answer: '-3', numeric: -3 },
        { prompt: 'A line crosses the y-axis at (0, 12). What is b?', answer: '12', numeric: 12 },
        { prompt: 'y = -2x. What is the y-intercept?', answer: '0', numeric: 0 },
        { prompt: 'A plumber charges $40 visit fee + $25/hr. What is the y-intercept (initial value)?', answer: '40', numeric: 40 },
        { prompt: 'y = x/2 - 5. What is the y-intercept?', answer: '-5', numeric: -5 },
      ],
    },
    'slope-intercept-form': {
      problems: [
        { prompt: 'Write the equation: slope = 3, y-intercept = -1', answer: 'y = 3x - 1' },
        { prompt: 'Write the equation: slope = -2, y-intercept = 5', answer: 'y = -2x + 5' },
        { prompt: 'Points (0,4) and (2,10). Write y = mx + b.', answer: 'y = 3x + 4' },
        { prompt: 'A gym costs $20 to join and $15/month. Write the equation for total cost c after m months.', answer: 'c = 15m + 20' },
        { prompt: 'Table: (0,1), (1,4), (2,7). Write y = mx + b.', answer: 'y = 3x + 1' },
        { prompt: 'Slope = 1/2, y-intercept = 3. Write the equation.', answer: 'y = (1/2)x + 3' },
      ],
    },
    'graphing-linear': {
      problems: [
        { prompt: 'y = 2x + 1. Start at y-intercept (0,1). Go up 2, right 1. What is the next point?', answer: '(1, 3)' },
        { prompt: 'y = -x + 4. Where does the line cross the y-axis?', answer: '(0, 4)' },
        { prompt: 'y = 3x - 2. What are the points at x=0 and x=2?', answer: '(0,-2) and (2,4)' },
        { prompt: 'y = -2x + 6. Where does the line cross the x-axis? (Set y=0)', answer: '(3, 0)', hint: '0=-2x+6 → x=3' },
        { prompt: 'y = x. Name 3 points on this line.', answer: '(0,0), (1,1), (2,2)' },
        { prompt: 'y = 4x - 8. What is the x-intercept?', answer: '(2, 0)', hint: '0=4x-8 → x=2' },
      ],
    },
    'compare-slopes': {
      problems: [
        { prompt: 'Function A: y = 3x + 2. Function B: y = 5x - 1. Which has a greater rate of change?', answer: 'Function B', hint: 'B slope=5 > A slope=3' },
        { prompt: 'Function A: table (1,4),(2,7),(3,10). Function B: y = 2x + 1. Which changes faster?', answer: 'Function A', hint: 'A slope=3 > B slope=2' },
        { prompt: 'Line A has slope -4. Line B has slope 2. Which is steeper?', answer: 'Line A', hint: '|-4|=4 > |2|=2' },
        { prompt: 'Function A: y = x + 10. Function B: y = 6x. At what x are they equal?', answer: '2', numeric: 2, hint: 'x+10=6x → 10=5x' },
        { prompt: 'Earning A: $8/hour. Earning B: table (2,20),(4,40). Who earns more per hour?', answer: 'Earning B', hint: 'B: $10/hour' },
        { prompt: 'Function A: slope 3/4. Function B: slope 0.8. Which is greater?', answer: 'Function B', hint: '3/4=0.75 < 0.8' },
      ],
    },
    'compare-intercepts': {
      problems: [
        { prompt: 'Function A: y = 2x + 10. Function B: y = 5x + 3. Which starts higher?', answer: 'Function A', hint: 'A: b=10 > B: b=3' },
        { prompt: 'Phone plan A: $30/month + $0.10/text. Plan B: $50/month unlimited. Which has a lower starting cost?', answer: 'Plan A' },
        { prompt: 'Function A: table (0,7),(1,10),(2,13). Function B: y = 4x + 5. Which has a greater initial value?', answer: 'Function A', hint: 'A: b=7 > B: b=5' },
        { prompt: 'Savings A starts at $100. Savings B starts at $0. Which has a higher y-intercept?', answer: 'Savings A' },
        { prompt: 'Function A: y = -x + 8. Function B: y = -2x + 12. Which starts higher?', answer: 'Function B' },
        { prompt: 'Function A: (0,0), (3,9). Function B: (0,5), (3,8). Which has a higher initial value?', answer: 'Function B' },
      ],
    },
    'compare-representations': {
      problems: [
        { prompt: 'Function A: y = 2x + 3. Function B: table (0,1),(1,4),(2,7). Which has a greater slope?', answer: 'Function B', hint: 'A: m=2, B: m=3' },
        { prompt: 'Function A: table (0,5),(2,11). Function B: y = 4x + 1. Which has a greater initial value?', answer: 'Function A', hint: 'A: b=5, B: b=1' },
        { prompt: 'Runner A: y = 6x (miles in x hours). Runner B: runs 8 miles in 1 hour. Who is faster?', answer: 'Runner B' },
        { prompt: 'Function A: slope 4, intercept 2. Function B: (0,2),(1,6),(2,10). Same function?', answer: 'yes', hint: 'Both: y = 4x + 2' },
        { prompt: 'Plant A grows 2 cm/week from 5 cm. Plant B: (0,8),(1,9),(2,10). Which is taller at week 3?', answer: 'They are equal', hint: 'A: 5+2(3)=11cm, B: 8+1(3)=11cm — they are tied!' },
        { prompt: 'Job A: $10/hr + $20 bonus. Job B: table (1,15),(2,30),(3,45). After 5 hours, who earns more?', answer: 'Job B', hint: 'A: 10(5)+20=$70, B: 15(5)=$75. B earns more.' },
      ],
    },
    'function-from-context': {
      problems: [
        { prompt: 'A plumber charges $40 visit + $25/hour. Write f(h) for total cost.', answer: 'f(h) = 25h + 40' },
        { prompt: 'A pool has 200 gallons and drains 10 gal/min. Write f(t) for water remaining.', answer: 'f(t) = 200 - 10t' },
        { prompt: 'You save $15/week starting with $50. Write f(w) for total savings.', answer: 'f(w) = 15w + 50' },
        { prompt: 'A candle is 12 inches and burns 0.5 in/hr. Write f(h) for height.', answer: 'f(h) = 12 - 0.5h' },
        { prompt: 'A taxi charges $3 + $2.50/mile. Write f(m) for fare.', answer: 'f(m) = 2.5m + 3' },
        { prompt: 'A membership costs $100/year + $5/visit. Write f(v) for annual cost.', answer: 'f(v) = 5v + 100' },
      ],
    },
    'function-from-table': {
      problems: [
        { prompt: 'Table: (0,4), (1,7), (2,10), (3,13). Write y = mx + b.', answer: 'y = 3x + 4' },
        { prompt: 'Table: (1,5), (2,8), (3,11). Write y = mx + b.', answer: 'y = 3x + 2' },
        { prompt: 'Table: (0,-1), (2,3), (4,7). Write y = mx + b.', answer: 'y = 2x - 1' },
        { prompt: 'Table: (0,10), (1,7), (2,4), (3,1). Write y = mx + b.', answer: 'y = -3x + 10' },
        { prompt: 'Table: (2,9), (4,13), (6,17). Write y = mx + b.', answer: 'y = 2x + 5' },
        { prompt: 'Table: (0,0), (3,6), (6,12). Write y = mx + b.', answer: 'y = 2x' },
      ],
    },
    'linear-vs-nonlinear': {
      problems: [
        { prompt: 'y = 3x + 1. Linear or nonlinear?', answer: 'linear' },
        { prompt: 'y = x². Linear or nonlinear?', answer: 'nonlinear' },
        { prompt: 'Table: (1,2), (2,4), (3,8), (4,16). Linear?', answer: 'no', hint: 'Rate of change is not constant (doubles)' },
        { prompt: 'Table: (1,5), (2,8), (3,11), (4,14). Linear?', answer: 'yes', hint: 'Constant rate of change: +3' },
        { prompt: 'y = 2^x. Linear or nonlinear?', answer: 'nonlinear' },
        { prompt: 'y = -4x + 7. Linear or nonlinear?', answer: 'linear' },
        { prompt: 'Table: (0,1), (1,3), (2,9), (3,27). Linear?', answer: 'no', hint: 'Rate of change varies: 2, 6, 18' },
        { prompt: 'A graph is a straight line. Linear or nonlinear?', answer: 'linear' },
      ],
    },
    'qualitative-features': {
      problems: [
        { prompt: 'A graph shows temperature rising quickly then leveling off. Is the function increasing, decreasing, or both?', answer: 'increasing then constant' },
        { prompt: 'A ball is thrown up: height increases, peaks, then decreases. Describe qualitatively.', answer: 'increasing then decreasing' },
        { prompt: 'Water fills a pool at a constant rate. What does the graph look like?', answer: 'straight line going up', hint: 'Linear, increasing' },
        { prompt: 'A car speeds up, drives at constant speed, then slows down. Describe the distance-time graph.', answer: 'steep, then straight, then less steep' },
        { prompt: 'A population doubles every year. Is the graph linear or curved?', answer: 'curved', hint: 'Exponential growth' },
        { prompt: 'A candle burns at a constant rate. Describe the height-time graph.', answer: 'straight line going down', hint: 'Linear, decreasing' },
      ],
    },
  },
};

// File I/O

function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }
function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }

function loadProfile(id) {
  const fp = profilePath(id);
  if (fs.existsSync(fp)) { try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); } }
  return { studentId: id, grade: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
}

function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }

function calcMastery(attempts) {
  if (!attempts || !attempts.length) return 0;
  const recent = attempts.slice(-5).filter(a => a.total > 0);
  return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0;
}

function masteryLabel(r) { return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started'; }
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }
function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9./=+() -]/g, '').replace(/\s+/g, ' '); }

function generateExercise(grade, skill, count = 5) {
  const bank = PROBLEM_BANKS[grade]?.[skill];
  if (!bank) return { error: `No problem bank for ${grade}/${skill}` };
  const items = pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer, ...(p.hint && { hint: p.hint }) }));
  return { type: 'functions', skill, grade, count: items.length, instruction: 'Solve each problem. Show your work.', items };
}

function checkAnswer(type, expected, answer) {
  const ne = norm(expected); const na = norm(answer);
  if (ne === na) return true;
  const numE = parseFloat(expected); const numA = parseFloat(answer);
  if (!isNaN(numE) && !isNaN(numA) && Math.abs(numE - numA) < 0.01) return true;
  if (ne.replace(/\s/g, '') === na.replace(/\s/g, '')) return true;
  return false;
}

class Functions {
  getProfile(id) { const p = loadProfile(id); return { studentId: p.studentId, grade: p.grade, createdAt: p.createdAt, totalAssessments: p.assessments.length }; }
  setGrade(id, grade) { if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}. Valid: ${Object.keys(SKILLS).join(', ')}`); const p = loadProfile(id); p.grade = grade; saveProfile(p); return { studentId: id, grade }; }

  recordAssessment(id, grade, category, skill, score, total, notes = '') {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}`);
    if (!SKILLS[grade][category]) throw new Error(`Unknown category '${category}' for ${grade}`);
    if (!SKILLS[grade][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${grade}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id); if (!p.grade) p.grade = grade;
    const entry = { date: new Date().toISOString(), grade, category, skill, score, total, notes };
    p.assessments.push(entry);
    const key = `${grade}/${category}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p);
    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  getProgress(id) {
    const p = loadProfile(id); const grade = p.grade || 'grade-8'; const gs = SKILLS[grade] || {};
    const results = {}; let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(gs)) { results[cat] = {}; for (const sk of skills) { total++; const d = p.skills[`${grade}/${cat}/${sk}`]; results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' }; if (d && d.mastery >= MASTERY_THRESHOLD) mastered++; } }
    return { studentId: id, grade, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id); const grade = p.grade || 'grade-8'; const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS[grade] || {})) { for (const sk of skills) { const d = p.skills[`${grade}/${cat}/${sk}`]; const m = d ? d.mastery : 0; if (m < MASTERY_THRESHOLD) candidates.push({ grade, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' }); } }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, grade, next: candidates.slice(0, count) };
  }

  getReport(id) { const p = loadProfile(id); return { studentId: id, grade: p.grade, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }
  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }
  getSkillCatalog(grade) { const gs = SKILLS[grade]; if (!gs) return { grade, error: `Unknown grade. Valid: ${Object.keys(SKILLS).join(', ')}` }; let total = 0; const catalog = {}; for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; } return { grade, skills: catalog, totalSkills: total }; }
  generateExercise(grade, skill, count = 5) { return generateExercise(grade, skill, count); }
  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  generateLesson(id) {
    const p = loadProfile(id); const grade = p.grade || 'grade-8';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient!`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    return { studentId: id, grade, targetSkill: target, exercise, lessonPlan: { review: 'Review prerequisite function concepts (2-3 min)', teach: `Introduce/reinforce: ${target.category} → ${target.skill}`, practice: `Complete ${exercise.count || 0} practice items`, apply: 'Connect to real-world function context' } };
  }
}

module.exports = Functions;

if (require.main === module) {
  const args = process.argv.slice(2); const cmd = args[0]; const api = new Functions();
  const out = d => console.log(JSON.stringify(d, null, 2));
  try {
    switch (cmd) {
      case 'start': { const [, id, grade] = args; if (!id) throw new Error('Usage: start <id> [grade]'); if (grade) api.setGrade(id, grade); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const grade = loadProfile(id).grade || 'grade-8'; if (skill) { out(api.generateExercise(grade, skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); out(api.checkAnswer(type, expected, answer)); break; }
      case 'record': { const [, id, grade, cat, skill, sc, tot, ...notes] = args; if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]'); out(api.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? api.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(api.setGrade(id, g)); break; }
      default: out({ usage: 'node functions.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
