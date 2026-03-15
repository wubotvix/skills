// eClaw Scientific Inquiry Interactive Tutor (K-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'science-inquiry');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'K-2': {
    'asking-questions': ['observe-and-wonder', 'what-if-questions'],
    'planning': ['simple-tests', 'change-one-thing'],
    'data': ['tally-charts', 'picture-graphs'],
    'explaining': ['i-think-because', 'describe-observations'],
  },
  '3-5': {
    'testable-questions': ['testable-vs-not', 'question-formula'],
    'variables': ['independent-variable', 'dependent-variable', 'controlled-variables'],
    'fair-testing': ['designing-fair-tests', 'multiple-trials'],
    'data-analysis': ['data-tables', 'bar-graphs', 'line-graphs', 'patterns-in-data'],
    'cer-writing': ['claim', 'evidence', 'reasoning'],
  },
  '6-8': {
    'hypotheses': ['writing-hypotheses', 'if-then-because'],
    'experimental-design': ['controlled-experiments', 'sample-size', 'reliability'],
    'advanced-data': ['scatter-plots', 'best-fit-lines', 'percent-error'],
    'argumentation': ['evaluating-evidence', 'competing-arguments', 'rebuttal'],
    'communication': ['lab-reports', 'peer-review', 'presenting-findings'],
  },
};

const CONTENT_BANKS = {
  'K-2': {
    'observe-and-wonder': {
      items: [
        { prompt: 'You see a puddle disappear on a sunny day. Write an "I wonder" question.', answer: 'I wonder where the water went' },
        { prompt: 'You see a plant leaning toward the window. Write an "I wonder" question.', answer: 'I wonder why the plant grows toward the light' },
        { prompt: 'You notice ice melting faster in the sun. Write an "I wonder" question.', answer: 'I wonder if the sun makes ice melt faster' },
        { prompt: 'A ball rolls farther on the hallway floor than on carpet. What do you wonder?', answer: 'I wonder why the ball goes farther on smooth floors' },
        { prompt: 'You see birds flying south in fall. What do you wonder?', answer: 'I wonder where the birds are going and why' },
      ],
    },
    'what-if-questions': {
      items: [
        { prompt: 'You water a plant every day. What "what if" question could you ask?', answer: 'what if I gave it more or less water' },
        { prompt: 'A toy car rolls down a ramp. What "what if" question could you ask?', answer: 'what if I made the ramp steeper' },
        { prompt: 'Seeds grow in a cup on the windowsill. What "what if" question could you ask?', answer: 'what if I put the cup in the dark' },
        { prompt: 'You blow on a pinwheel and it spins. What "what if" question could you ask?', answer: 'what if I blew harder or softer' },
      ],
    },
    'simple-tests': {
      items: [
        { question: 'You want to know if plants need sunlight. What simple test could you do?', answer: 'put one plant in light and one in the dark and compare' },
        { question: 'You want to know which ball bounces highest. What do you do?', answer: 'drop each ball from the same height and measure how high they bounce' },
        { question: 'You want to know if warm water dissolves sugar faster. How do you test?', answer: 'put sugar in warm water and cold water and see which dissolves first' },
      ],
    },
    'change-one-thing': {
      items: [
        { question: 'You test how ramp height affects car distance. What ONE thing do you change?', answer: 'the height of the ramp' },
        { question: 'What do you keep the same in the ramp test?', answer: 'same car, same surface, same release point' },
        { question: 'Why should you only change ONE thing at a time?', answer: 'so you know what caused the result' },
      ],
    },
    'tally-charts': {
      items: [
        { question: 'What is a tally chart used for?', answer: 'counting and recording data' },
        { question: 'How do you show 5 in a tally chart?', answer: 'four lines with a diagonal line through them' },
        { question: 'You count birds at a feeder: 3 robins, 5 sparrows, 2 cardinals. Which was most common?', answer: 'sparrows' },
      ],
    },
    'picture-graphs': {
      items: [
        { question: 'What does a picture graph use to show data?', answer: 'pictures or symbols' },
        { question: 'In a picture graph, each picture of an apple represents 1 apple. If there are 4 apple pictures, how many apples?', answer: '4' },
      ],
    },
    'i-think-because': {
      items: [
        { prompt: 'The plant in the window grew taller than the one in the closet. Explain using "I think...because..."', answer: 'I think the window plant grew taller because it got sunlight' },
        { prompt: 'The ice cube melted faster on the dark plate. Explain using "I think...because..."', answer: 'I think dark colors absorb more heat because dark surfaces get warmer' },
        { prompt: 'The ball rolled farther on tile than on carpet. Explain.', answer: 'I think the ball went farther on tile because tile has less friction' },
      ],
    },
    'describe-observations': {
      items: [
        { question: 'What does a good observation include?', answer: 'what you see, hear, feel, or measure using your senses' },
        { question: 'Is "The flower is pretty" a good scientific observation?', answer: 'no, a better observation describes color, size, shape, or smell' },
        { question: 'Write a better observation for a red apple', answer: 'the apple is round, red, about 7cm wide, smooth, and has a green stem' },
      ],
    },
  },
  '3-5': {
    'testable-vs-not': {
      items: [
        ['Which color is best?', 'not testable'],
        ['Which color of light makes plants grow tallest?', 'testable'],
        ['Do dogs like music?', 'not testable'],
        ['Does playing music change how much a dog moves?', 'testable'],
        ['Why is the sky blue?', 'not testable'],
        ['Does water temperature affect how fast sugar dissolves?', 'testable'],
        ['Is chocolate the best candy?', 'not testable'],
        ['Which brand of paper towel absorbs the most water?', 'testable'],
      ],
    },
    'question-formula': {
      items: [
        { prompt: 'Write a testable question about plant growth using "How does ___ affect ___?"', answer: 'How does the amount of water affect how tall a plant grows?' },
        { prompt: 'Write a testable question about ramp height', answer: 'How does the height of a ramp affect how far a car rolls?' },
        { prompt: 'Write a testable question about dissolving', answer: 'How does water temperature affect how fast salt dissolves?' },
      ],
    },
    'independent-variable': {
      items: [
        { question: 'In "How does sunlight affect plant growth?" — what is the independent variable?', answer: 'amount of sunlight' },
        { question: 'In "How does ramp height affect car distance?" — what is the independent variable?', answer: 'ramp height' },
        { question: 'What is the independent variable?', answer: 'the one thing you change on purpose' },
      ],
    },
    'dependent-variable': {
      items: [
        { question: 'In "How does sunlight affect plant growth?" — what is the dependent variable?', answer: 'plant growth (height)' },
        { question: 'In "How does ramp height affect car distance?" — what is the dependent variable?', answer: 'distance the car rolls' },
        { question: 'What is the dependent variable?', answer: 'what you measure to see the effect' },
      ],
    },
    'controlled-variables': {
      items: [
        { question: 'In "How does sunlight affect plant growth?" — name 2 controlled variables', answer: 'same type of plant, same amount of water, same soil, same pot' },
        { question: 'Why do we need controlled variables?', answer: 'to make the test fair so we know what caused the result' },
        { question: 'What happens if you change more than one variable?', answer: 'you cannot tell which change caused the result' },
      ],
    },
    'designing-fair-tests': {
      items: [
        { question: 'What makes a test "fair"?', answer: 'only one variable is changed while everything else stays the same' },
        { question: 'You test if fertilizer helps plants grow. One plant gets fertilizer, one does not. What must be the same?', answer: 'same plant type, same amount of water, same sunlight, same soil' },
        { question: 'A student tests two paper airplanes. One is thrown hard, the other softly. Is this fair?', answer: 'no, the force of the throw should be the same' },
      ],
    },
    'multiple-trials': {
      items: [
        { question: 'Why should you do more than one trial?', answer: 'to make results more reliable and check for flukes' },
        { question: 'What do you do with data from multiple trials?', answer: 'calculate the average' },
        { question: 'If 3 trials give: 42cm, 38cm, 40cm — what is the average?', answer: '40 cm' },
      ],
    },
    'data-tables': {
      items: [
        { question: 'What should every data table have?', answer: 'a title, labeled columns, and units of measurement' },
        { question: 'Where does the independent variable go in a data table?', answer: 'in the first column (left side)' },
        { question: 'Where does the dependent variable go?', answer: 'in the other columns (right side)' },
      ],
    },
    'bar-graphs': {
      items: [
        { question: 'When do you use a bar graph?', answer: 'when the independent variable is categories (not numbers)' },
        { question: 'What goes on the x-axis of a bar graph?', answer: 'the categories (independent variable)' },
        { question: 'What goes on the y-axis?', answer: 'the measured values (dependent variable)' },
      ],
    },
    'line-graphs': {
      items: [
        { question: 'When do you use a line graph?', answer: 'when both variables are numbers and you want to show change over time' },
        { question: 'What does a rising line on a graph mean?', answer: 'the values are increasing' },
        { question: 'What does a flat line mean?', answer: 'the values are staying the same' },
      ],
    },
    'patterns-in-data': {
      items: [
        { question: 'What is a pattern in data?', answer: 'a trend or regularity you notice (increasing, decreasing, repeating)' },
        { question: 'Data: 10, 20, 30, 40. What is the pattern?', answer: 'increasing by 10 each time' },
        { question: 'Why do scientists look for patterns?', answer: 'patterns help make predictions' },
      ],
    },
    'claim': {
      items: [
        { question: 'What is a claim in CER?', answer: 'a statement that answers the question' },
        { question: 'Write a claim: Plants given more light grew taller.', answer: 'plants grow taller when they get more light' },
        { question: 'Should a claim be an opinion or based on data?', answer: 'based on data' },
      ],
    },
    'evidence': {
      items: [
        { question: 'What is evidence in CER?', answer: 'data or observations that support the claim' },
        { question: 'Is "I think plants need light" good evidence?', answer: 'no, evidence must be specific data or observations' },
        { question: 'Give an example of good evidence', answer: 'the plant in sunlight grew 12cm while the plant in the dark grew 2cm' },
      ],
    },
    'reasoning': {
      items: [
        { question: 'What is reasoning in CER?', answer: 'explains WHY the evidence supports the claim using science concepts' },
        { question: 'How is reasoning different from evidence?', answer: 'evidence is what you observed; reasoning explains why using science' },
        { question: 'Write reasoning for: "plants need light to grow"', answer: 'plants use light energy for photosynthesis to make food, so more light means more food and growth' },
      ],
    },
  },
  '6-8': {
    'writing-hypotheses': {
      items: [
        { question: 'What is a hypothesis?', answer: 'a testable prediction based on prior knowledge' },
        { question: 'How is a hypothesis different from a guess?', answer: 'a hypothesis is based on evidence and can be tested' },
        { question: 'Write a hypothesis about plant growth and light', answer: 'if a plant gets more light, then it will grow taller, because plants need light for photosynthesis' },
      ],
    },
    'if-then-because': {
      items: [
        { prompt: 'Write an if-then-because hypothesis about ramp height and car distance', answer: 'if the ramp is higher, then the car will roll farther, because it has more potential energy' },
        { prompt: 'Write an if-then-because about water temperature and dissolving', answer: 'if water is warmer, then sugar will dissolve faster, because molecules move faster in warm water' },
        { prompt: 'What are the three parts?', answer: 'if (independent variable), then (predicted result), because (scientific reasoning)' },
      ],
    },
    'controlled-experiments': {
      items: [
        { question: 'What is a control group?', answer: 'the group that is not changed, used for comparison' },
        { question: 'What is an experimental group?', answer: 'the group that receives the treatment or change' },
        { question: 'Why do you need a control group?', answer: 'to compare results and see if the variable caused a difference' },
      ],
    },
    'sample-size': {
      items: [
        { question: 'Why is a larger sample size better?', answer: 'it makes results more reliable and representative' },
        { question: 'If you test only 1 plant, can you draw a strong conclusion?', answer: 'no, one sample is not enough — you need replication' },
        { question: 'How does sample size affect confidence in results?', answer: 'larger samples reduce the effect of random variation' },
      ],
    },
    'reliability': {
      items: [
        { question: 'What does reliability mean in science?', answer: 'getting similar results when the experiment is repeated' },
        { question: 'How do you increase reliability?', answer: 'repeat trials, use larger samples, follow consistent procedures' },
        { question: 'What is reproducibility?', answer: 'when other scientists can repeat the experiment and get similar results' },
      ],
    },
    'scatter-plots': {
      items: [
        { question: 'When do you use a scatter plot?', answer: 'to show the relationship between two numerical variables' },
        { question: 'What does a positive correlation look like?', answer: 'dots going up from left to right' },
        { question: 'What does no correlation look like?', answer: 'dots scattered randomly with no pattern' },
      ],
    },
    'best-fit-lines': {
      items: [
        { question: 'What is a line of best fit?', answer: 'a straight line that best represents the trend in scatter plot data' },
        { question: 'Does a best-fit line have to go through every point?', answer: 'no, it shows the general trend' },
        { question: 'What can you use a best-fit line for?', answer: 'making predictions for values not directly measured' },
      ],
    },
    'percent-error': {
      items: [
        { question: 'What is percent error?', answer: 'how far off a measurement is from the accepted value, as a percentage' },
        { question: 'How do you calculate percent error?', answer: '|measured - accepted| / accepted x 100' },
        { question: 'Is 5% error good or bad?', answer: 'generally good — means the measurement was close to the accepted value' },
      ],
    },
    'evaluating-evidence': {
      items: [
        { question: 'What makes evidence strong?', answer: 'multiple trials, controlled variables, measured data, reproducible' },
        { question: 'What makes evidence weak?', answer: 'single trial, uncontrolled variables, opinion-based, not reproducible' },
        { question: 'Is "I think magnets are cool" evidence?', answer: 'no, it is an opinion, not measurable evidence' },
      ],
    },
    'competing-arguments': {
      items: [
        { question: 'What do you do when two scientific arguments conflict?', answer: 'examine the evidence quality for each and see which is better supported' },
        { question: 'Can two scientists look at the same data and disagree?', answer: 'yes, interpretation can differ, which is why peer review matters' },
      ],
    },
    'rebuttal': {
      items: [
        { question: 'What is a rebuttal in scientific argumentation?', answer: 'addressing a counterargument and explaining why your evidence is stronger' },
        { question: 'Why are rebuttals important in science?', answer: 'they strengthen arguments by considering alternative explanations' },
      ],
    },
    'lab-reports': {
      items: [
        { question: 'What sections does a formal lab report have?', answer: 'title, question, hypothesis, materials, procedure, data, results, conclusion' },
        { question: 'What goes in the conclusion?', answer: 'a CER: claim answering the question, evidence from data, reasoning using science concepts' },
        { question: 'Why is the procedure section important?', answer: 'so others can reproduce the experiment' },
      ],
    },
    'peer-review': {
      items: [
        { question: 'What is peer review?', answer: 'other scientists evaluate your work before it is published' },
        { question: 'Why is peer review important?', answer: 'it checks for errors, bias, and ensures quality' },
      ],
    },
    'presenting-findings': {
      items: [
        { question: 'What should a good science presentation include?', answer: 'clear question, methods, data with graphs, conclusion, and what you would do differently' },
        { question: 'Why use graphs in a presentation?', answer: 'they make data patterns easy to see at a glance' },
      ],
    },
  },
};

const SCENARIOS = {
  'K-2': [
    { title: 'The Melting Race', focus: 'simple test', text: 'You have an ice cube, a warm towel, and a cold towel. Predict: which will melt the ice cube faster? Test it! Observe what happens. Explain why.' },
    { title: 'Sink or Float', focus: 'predictions', text: 'Gather 5 objects: a coin, a crayon, a cork, a rock, a leaf. Predict: will each sink or float? Test them in water. Were your predictions correct? Why did some float?' },
  ],
  '3-5': [
    { title: 'Paper Airplane Lab', focus: 'fair testing', text: 'Question: How does wing length affect how far a paper airplane flies? Your variables: change wing length, measure distance, keep everything else the same. Do 3 trials for each wing length. Make a data table and bar graph.' },
    { title: 'Dissolving Detective', focus: 'variables', text: 'Question: Does water temperature affect how fast sugar dissolves? Independent variable: water temperature. Dependent variable: time to dissolve. Controlled: same amount of sugar, same stirring, same cup. Predict, test, record, conclude.' },
  ],
  '6-8': [
    { title: 'Pendulum Lab', focus: 'experimental design', text: 'Design an experiment to answer: Does the length of a pendulum affect its period? Write a hypothesis, identify all variables, plan your procedure with at least 5 trials per length, collect data, create a scatter plot, and write a full CER conclusion.' },
    { title: 'Enzyme Activity', focus: 'controlled experiment', text: 'Design an experiment: How does temperature affect enzyme activity? Include a control group, experimental groups at 3+ temperatures, multiple trials, and address potential sources of error. Write a complete lab report.' },
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
  return { studentId: id, grade: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
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

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

// Exercise generation

function exResult(type, skill, grade, instruction, items) { return { type, skill, grade, count: items.length, instruction, items }; }

function generateExercise(grade, skill, count = 5) {
  const bank = CONTENT_BANKS[grade]?.[skill];
  if (!bank) return { error: `No content bank for ${grade}/${skill}` };

  if (bank.items && Array.isArray(bank.items[0]) && bank.items[0].length === 2)
    return exResult('classify', skill, grade, 'Classify each item.',
      pick(bank.items, count).map(([item, cat]) => ({ prompt: item, answer: cat })));

  if (bank.items && bank.items[0]?.question)
    return exResult('short-answer', skill, grade, 'Answer the question.',
      pick(bank.items, count).map(i => ({ prompt: i.question, answer: i.answer })));

  if (bank.items && bank.items[0]?.prompt)
    return exResult('open-response', skill, grade, 'Respond to the prompt.',
      pick(bank.items, count).map(i => ({ prompt: i.prompt, answer: i.answer })));

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(e => norm(e) === norm(answer));
  return norm(expected) === norm(answer);
}

// Public API

class Inquiry {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, grade: p.grade, createdAt: p.createdAt, totalAssessments: p.assessments.length };
  }

  setGrade(id, grade) {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    const p = loadProfile(id); p.grade = grade; saveProfile(p);
    return { studentId: id, grade };
  }

  recordAssessment(id, grade, category, skill, score, total, notes = '') {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}`);
    if (!SKILLS[grade][category]) throw new Error(`Unknown category '${category}' for ${grade}`);
    if (!SKILLS[grade][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${grade}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);

    const p = loadProfile(id);
    if (!p.grade) p.grade = grade;
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
    const p = loadProfile(id);
    const grade = p.grade || 'K-2';
    const gs = SKILLS[grade] || {};
    const results = {};
    let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(gs)) {
      results[cat] = {};
      for (const sk of skills) {
        total++;
        const d = p.skills[`${grade}/${cat}/${sk}`];
        results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
      }
    }
    return { studentId: id, grade, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id);
    const grade = p.grade || 'K-2';
    const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS[grade] || {})) {
      for (const sk of skills) {
        const d = p.skills[`${grade}/${cat}/${sk}`];
        const m = d ? d.mastery : 0;
        if (m < MASTERY_THRESHOLD) candidates.push({ grade, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' });
      }
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, grade, next: candidates.slice(0, count) };
  }

  getReport(id) {
    const p = loadProfile(id);
    return { studentId: id, grade: p.grade, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }

  getSkillCatalog(grade) {
    const gs = SKILLS[grade];
    if (!gs) return { grade, error: `Unknown grade. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0;
    const catalog = {};
    for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; }
    return { grade, skills: catalog, totalSkills: total };
  }

  generateExercise(grade, skill, count = 5) { return generateExercise(grade, skill, count); }

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  getScenario(grade) {
    const s = SCENARIOS[grade];
    if (!s) return { error: `No scenarios for ${grade}. Available: ${Object.keys(SCENARIOS).join(', ')}` };
    return pick(s, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'K-2';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const scenario = SCENARIOS[grade] ? pick(SCENARIOS[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, scenario,
      lessonPlan: {
        question: `Present a phenomenon related to ${target.skill}`,
        predict: 'Have student make a prediction',
        investigate: `Complete ${exercise.count || 0} practice items`,
        analyze: `Discuss the inquiry skill: ${target.skill}`,
        reflect: scenario ? `Try scenario: "${scenario.title}"` : 'Reflect on what was learned',
      },
    };
  }
}

module.exports = Inquiry;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new Inquiry();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) api.setGrade(id, grade);
        out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'K-2';
        if (skill) { out(api.generateExercise(grade, skill, 5)); }
        else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current grade!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(api.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(api.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? api.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(api.setGrade(id, g)); break; }
      case 'scenario': { const [, g] = args; if (!g) throw new Error('Usage: scenario <grade>'); out(api.getScenario(g)); break; }
      default: out({ usage: 'node inquiry.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','scenario'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
