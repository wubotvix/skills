// eClaw HS Science Study Planner & Coach (Grades 9-12). No deps. Coordinator skill.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-science-study-planner');
const MASTERY_THRESHOLD = 0.8;

const DOMAINS = {
  'biology': {
    skills: ['cell-structure', 'cell-processes', 'genetics', 'evolution', 'ecology', 'human-body-systems', 'molecular-biology', 'biodiversity'],
    courses: ['biology', 'ap-biology'],
    description: 'Life science: cells, genetics, evolution, ecology, and organismal biology',
  },
  'chemistry': {
    skills: ['atomic-structure', 'periodic-trends', 'chemical-bonding', 'reactions-equations', 'stoichiometry', 'thermochemistry', 'solutions-equilibrium', 'acids-bases'],
    courses: ['chemistry', 'ap-chemistry'],
    description: 'Physical science: atoms, bonding, reactions, stoichiometry, and thermodynamics',
  },
  'physics': {
    skills: ['kinematics', 'forces-newtons-laws', 'energy-work-power', 'momentum-collisions', 'waves-sound', 'electricity-magnetism', 'optics', 'modern-physics'],
    courses: ['physics', 'ap-physics-1', 'ap-physics-2', 'ap-physics-c'],
    description: 'Physical science: motion, forces, energy, waves, electricity, and magnetism',
  },
  'earth-space': {
    skills: ['geology-minerals-rocks', 'plate-tectonics', 'weather-climate', 'oceanography', 'astronomy', 'earth-history', 'natural-resources', 'space-exploration'],
    courses: ['earth-science', 'ap-environmental-science'],
    description: 'Earth and space science: geology, climate, astronomy, and environmental systems',
  },
  'engineering': {
    skills: ['design-process', 'materials-science', 'structural-analysis', 'optimization', 'prototyping-testing', 'systems-engineering', 'computational-modeling', 'sustainability-design'],
    courses: ['engineering', 'ap-computer-science-principles'],
    description: 'Engineering design: process, materials, optimization, and systems thinking',
  },
  'inquiry': {
    skills: ['experimental-design', 'data-collection', 'data-analysis', 'graphing-interpretation', 'statistical-reasoning', 'scientific-writing', 'research-methods', 'lab-safety-techniques'],
    courses: ['all'],
    description: 'Science practices: experiments, data analysis, research methods, and lab skills',
  },
  'reasoning': {
    skills: ['evidence-based-arguments', 'cause-and-effect', 'systems-thinking', 'patterns-and-models', 'scale-proportion-quantity', 'structure-function', 'stability-change', 'energy-matter-flow'],
    courses: ['all'],
    description: 'Crosscutting concepts: reasoning, evidence evaluation, and systems analysis',
  },
};

const TRACK_PROGRESSION = {
  standard: ['earth-science', 'biology', 'chemistry', 'physics', 'elective'],
  accelerated: ['biology', 'chemistry', 'physics', 'ap-biology', 'ap-chemistry'],
  ap: ['honors-biology', 'honors-chemistry', 'ap-physics-1', 'ap-biology', 'ap-chemistry'],
};

const GRADE_EXPECTATIONS = {
  '9': { typical: 'earth-science', advanced: 'biology', domains: ['earth-space', 'inquiry', 'reasoning'] },
  '10': { typical: 'biology', advanced: 'chemistry', domains: ['biology', 'inquiry', 'reasoning'] },
  '11': { typical: 'chemistry', advanced: 'ap-chemistry', domains: ['chemistry', 'biology', 'inquiry', 'reasoning'] },
  '12': { typical: 'physics', advanced: 'ap-physics-1', domains: ['physics', 'chemistry', 'engineering', 'inquiry', 'reasoning'] },
};

const AP_EXAM_WEIGHTS = {
  'ap-biology': {
    'Evolution': { weight: 0.18, domains: ['biology'] },
    'Energetics': { weight: 0.18, domains: ['biology', 'chemistry'] },
    'Information Storage': { weight: 0.18, domains: ['biology'] },
    'Systems Interactions': { weight: 0.22, domains: ['biology', 'reasoning'] },
    'Ecology': { weight: 0.12, domains: ['biology', 'earth-space'] },
    'Science Practices': { weight: 0.12, domains: ['inquiry', 'reasoning'] },
  },
  'ap-chemistry': {
    'Atomic Structure': { weight: 0.10, domains: ['chemistry'] },
    'Bonding and Intermolecular': { weight: 0.12, domains: ['chemistry'] },
    'Chemical Reactions': { weight: 0.12, domains: ['chemistry'] },
    'Kinetics': { weight: 0.10, domains: ['chemistry'] },
    'Thermodynamics': { weight: 0.12, domains: ['chemistry'] },
    'Equilibrium': { weight: 0.14, domains: ['chemistry'] },
    'Acids and Bases': { weight: 0.14, domains: ['chemistry'] },
    'Applications and Practices': { weight: 0.16, domains: ['inquiry', 'reasoning'] },
  },
  'ap-physics-1': {
    'Kinematics': { weight: 0.14, domains: ['physics'] },
    'Forces and Newton\'s Laws': { weight: 0.20, domains: ['physics'] },
    'Work, Energy, Power': { weight: 0.16, domains: ['physics'] },
    'Momentum and Impulse': { weight: 0.12, domains: ['physics'] },
    'Rotational Motion': { weight: 0.12, domains: ['physics'] },
    'Oscillations and Waves': { weight: 0.12, domains: ['physics'] },
    'Experimental Design': { weight: 0.14, domains: ['inquiry', 'reasoning'] },
  },
  'ap-environmental-science': {
    'The Living World': { weight: 0.14, domains: ['biology', 'earth-space'] },
    'Populations': { weight: 0.14, domains: ['biology', 'earth-space'] },
    'Land and Water Use': { weight: 0.14, domains: ['earth-space', 'engineering'] },
    'Energy Resources': { weight: 0.12, domains: ['earth-space', 'engineering'] },
    'Pollution': { weight: 0.14, domains: ['chemistry', 'earth-space'] },
    'Global Change': { weight: 0.14, domains: ['earth-space', 'reasoning'] },
    'Science Practices': { weight: 0.18, domains: ['inquiry', 'reasoning'] },
  },
};

const DIAGNOSTIC_QUESTIONS = {
  'biology': [
    { prompt: 'What organelle is the "powerhouse of the cell"?', answer: 'mitochondria', difficulty: 'basic' },
    { prompt: 'What molecule carries genetic information in most organisms?', answer: 'DNA', difficulty: 'basic' },
    { prompt: 'What process converts glucose to ATP in the presence of oxygen?', answer: 'cellular respiration', difficulty: 'intermediate' },
    { prompt: 'What is the complementary base pair for adenine in DNA?', answer: 'thymine', difficulty: 'intermediate' },
    { prompt: 'Describe natural selection in one sentence.', answer: 'organisms with favorable traits survive and reproduce more', difficulty: 'intermediate' },
    { prompt: 'What is the difference between mitosis and meiosis?', answer: 'mitosis produces 2 identical cells, meiosis produces 4 haploid gametes', difficulty: 'advanced' },
    { prompt: 'What level of ecology studies interactions between different species?', answer: 'community', difficulty: 'intermediate' },
    { prompt: 'What is the role of RNA polymerase in transcription?', answer: 'synthesizes mRNA from DNA template', difficulty: 'advanced' },
  ],
  'chemistry': [
    { prompt: 'What is the atomic number of carbon?', answer: '6', difficulty: 'basic' },
    { prompt: 'What type of bond forms between Na and Cl?', answer: 'ionic', difficulty: 'basic' },
    { prompt: 'Balance: __H2 + __O2 -> __H2O', answer: '2H2 + O2 -> 2H2O', difficulty: 'intermediate' },
    { prompt: 'What is the pH of a neutral solution at 25C?', answer: '7', difficulty: 'basic' },
    { prompt: 'How many moles of NaCl are in 58.44g of NaCl?', answer: '1 mole', difficulty: 'intermediate' },
    { prompt: 'What determines the chemical properties of an element?', answer: 'number of valence electrons', difficulty: 'intermediate' },
    { prompt: 'What is Le Chatelier\'s principle?', answer: 'a system at equilibrium shifts to counteract a stress', difficulty: 'advanced' },
    { prompt: 'Calculate the molarity of 0.5 mol NaOH in 250 mL solution.', answer: '2 M', difficulty: 'advanced' },
  ],
  'physics': [
    { prompt: 'What is the SI unit of force?', answer: 'newton', difficulty: 'basic' },
    { prompt: 'An object falls freely for 3 seconds. How far does it fall? (g=10 m/s^2)', answer: '45 meters', difficulty: 'intermediate' },
    { prompt: 'State Newton\'s Third Law.', answer: 'every action has an equal and opposite reaction', difficulty: 'basic' },
    { prompt: 'What is the kinetic energy of a 2 kg object moving at 3 m/s?', answer: '9 joules', difficulty: 'intermediate' },
    { prompt: 'What type of wave is sound?', answer: 'longitudinal', difficulty: 'basic' },
    { prompt: 'What is the relationship between voltage, current, and resistance?', answer: 'V = IR (Ohm\'s Law)', difficulty: 'intermediate' },
    { prompt: 'A 5 kg box is pushed with 20 N force on a frictionless surface. What is the acceleration?', answer: '4 m/s^2', difficulty: 'intermediate' },
    { prompt: 'What happens to the wavelength of light as frequency increases?', answer: 'wavelength decreases', difficulty: 'advanced' },
  ],
  'earth-space': [
    { prompt: 'What are the three main types of rocks?', answer: 'igneous, sedimentary, metamorphic', difficulty: 'basic' },
    { prompt: 'What causes tectonic plates to move?', answer: 'convection currents in the mantle', difficulty: 'intermediate' },
    { prompt: 'What layer of the atmosphere contains the ozone layer?', answer: 'stratosphere', difficulty: 'intermediate' },
    { prompt: 'What is the main greenhouse gas produced by burning fossil fuels?', answer: 'carbon dioxide (CO2)', difficulty: 'basic' },
    { prompt: 'What type of plate boundary forms mountains?', answer: 'convergent', difficulty: 'intermediate' },
    { prompt: 'What causes the seasons on Earth?', answer: 'axial tilt of Earth (23.5 degrees)', difficulty: 'intermediate' },
    { prompt: 'What is the Hertzsprung-Russell diagram used for?', answer: 'classifying stars by luminosity and temperature', difficulty: 'advanced' },
  ],
  'engineering': [
    { prompt: 'What is the first step in the engineering design process?', answer: 'define the problem', difficulty: 'basic' },
    { prompt: 'What is a prototype?', answer: 'a working model used for testing', difficulty: 'basic' },
    { prompt: 'What property of materials describes resistance to deformation?', answer: 'stiffness or rigidity (Young\'s modulus)', difficulty: 'intermediate' },
    { prompt: 'What is a trade-off in engineering design?', answer: 'giving up one quality to gain another', difficulty: 'intermediate' },
    { prompt: 'What is the purpose of a control variable in testing?', answer: 'to keep conditions constant for fair comparison', difficulty: 'intermediate' },
    { prompt: 'Name one criterion and one constraint in bridge design.', answer: 'criterion: hold X weight; constraint: budget or materials limit', difficulty: 'advanced' },
  ],
  'inquiry': [
    { prompt: 'What is the independent variable in an experiment?', answer: 'the variable you change', difficulty: 'basic' },
    { prompt: 'Why is a control group important?', answer: 'provides a baseline for comparison', difficulty: 'basic' },
    { prompt: 'What is the difference between accuracy and precision?', answer: 'accuracy is closeness to true value; precision is consistency of measurements', difficulty: 'intermediate' },
    { prompt: 'What type of graph is best for showing change over time?', answer: 'line graph', difficulty: 'basic' },
    { prompt: 'What does a p-value less than 0.05 typically indicate?', answer: 'statistically significant result', difficulty: 'advanced' },
    { prompt: 'What is the purpose of repeating trials in an experiment?', answer: 'to improve reliability and reduce random error', difficulty: 'intermediate' },
    { prompt: 'What is a confounding variable?', answer: 'an uncontrolled variable that may affect the dependent variable', difficulty: 'intermediate' },
  ],
  'reasoning': [
    { prompt: 'What is the difference between correlation and causation?', answer: 'correlation is association; causation means one thing causes another', difficulty: 'intermediate' },
    { prompt: 'Give an example of a positive feedback loop in nature.', answer: 'ice melting reduces albedo, increasing warming, melting more ice', difficulty: 'advanced' },
    { prompt: 'What crosscutting concept connects how a bird wing shape relates to flight?', answer: 'structure and function', difficulty: 'intermediate' },
    { prompt: 'Why are models useful in science?', answer: 'they simplify complex systems to make predictions and test ideas', difficulty: 'basic' },
    { prompt: 'What is the principle of conservation of energy?', answer: 'energy cannot be created or destroyed, only transformed', difficulty: 'intermediate' },
    { prompt: 'How does scale affect properties? (e.g., nano vs macro)', answer: 'properties can change at different scales due to surface area ratios, quantum effects', difficulty: 'advanced' },
    { prompt: 'What distinguishes a scientific theory from a hypothesis?', answer: 'a theory is well-tested and broadly explanatory; a hypothesis is a testable prediction', difficulty: 'intermediate' },
  ],
};

const SPECIALIST_SKILLS = {
  'biology': { skill: 'hs-science-biology', route: 'Cells, genetics, evolution, ecology' },
  'chemistry': { skill: 'hs-science-chemistry', route: 'Atoms, bonding, reactions, stoichiometry' },
  'physics': { skill: 'hs-science-physics', route: 'Motion, forces, energy, waves, E&M' },
  'earth-space': { skill: 'hs-science-earth-space', route: 'Geology, climate, astronomy' },
  'engineering': { skill: 'hs-science-engineering', route: 'Design, materials, optimization' },
  'inquiry': { skill: 'hs-science-inquiry', route: 'Experiments, data analysis, research' },
  'reasoning': { skill: 'hs-science-reasoning', route: 'Reasoning, evidence, systems thinking' },
};

const GROWTH_MINDSET = {
  struggling: [
    'Science is learned through curiosity and persistence. Every question you ask is progress.',
    'You have not mastered this YET. That word makes all the difference.',
    'Every scientist started as a beginner. Confusion is the first step to understanding.',
    'Making mistakes in science is not failure — it is how hypotheses get refined.',
  ],
  plateaued: [
    'Plateaus are normal. Your brain is integrating new concepts with what you already know.',
    'Try approaching the topic from a different angle — a new diagram, analogy, or experiment.',
    'Review foundational concepts. Gaps in earlier material can block new understanding.',
    'Explain what you know to someone else. Teaching reveals both strengths and gaps.',
  ],
  progressing: [
    'Your effort is paying off. Keep building on this momentum.',
    'Notice how concepts that seemed impossible now make sense? That is real learning.',
    'You are developing scientific thinking, not just memorizing facts.',
    'Challenge yourself with deeper questions to keep growing.',
  ],
};

const SCIENCE_ANXIETY_STRATEGIES = {
  mild: [
    'Approach science with curiosity rather than pressure to be perfect.',
    'Break complex topics into smaller, manageable pieces.',
    'Connect science to real-world examples you find interesting.',
    'Celebrate each concept you understand — learning is cumulative.',
  ],
  moderate: [
    'Start each session reviewing something you already understand well.',
    'Use diagrams, models, and hands-on activities when text feels overwhelming.',
    'Work with a lab partner or study group to share the learning process.',
    'Keep a "what I learned today" journal to make progress visible.',
    'Focus on understanding the "why" before memorizing the "what".',
  ],
  significant: [
    'Consider talking to your teacher about accommodations or extra support.',
    'Build from your strengths: what science topic interests you most? Start there.',
    'Practice deep breathing (4-4-4) before tests or challenging assignments.',
    'Remember: real scientists spend most of their time confused. That is part of the process.',
    'Explore science through videos, podcasts, or nature walks — not just textbooks.',
    'Your value is not defined by a test score. Science literacy is a lifelong journey.',
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
  return {
    studentId: id,
    track: null,
    grade: null,
    goals: [],
    timeBudget: null,
    createdAt: new Date().toISOString(),
    assessments: [],
    skills: {},
    diagnosticResults: null,
  };
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
  start(id, track) {
    if (track) this.setTrack(id, track);
    const p = loadProfile(id);
    return {
      action: 'start',
      profile: {
        studentId: p.studentId,
        track: p.track,
        grade: p.grade,
        goals: p.goals,
        createdAt: p.createdAt,
        totalAssessments: p.assessments.length,
        hasDiagnostic: !!p.diagnosticResults,
      },
      progress: this.progress(id),
      nextStep: p.diagnosticResults ? 'Run plan to get a study schedule.' : 'Run diagnostic to assess your science knowledge.',
    };
  }

  setTrack(id, track) {
    if (!TRACK_PROGRESSION[track]) throw new Error(`Unknown track: ${track}. Valid: ${Object.keys(TRACK_PROGRESSION).join(', ')}`);
    const p = loadProfile(id);
    p.track = track;
    saveProfile(p);
    return { studentId: id, track, progression: TRACK_PROGRESSION[track] };
  }

  setGrade(id, grade) {
    if (!GRADE_EXPECTATIONS[grade]) throw new Error(`Unknown grade: ${grade}. Valid: ${Object.keys(GRADE_EXPECTATIONS).join(', ')}`);
    const p = loadProfile(id);
    p.grade = grade;
    saveProfile(p);
    return { studentId: id, grade };
  }

  diagnostic(id) {
    const p = loadProfile(id);
    const results = {};
    for (const [domain, questions] of Object.entries(DIAGNOSTIC_QUESTIONS)) {
      const selected = shuffle(questions).slice(0, 4);
      results[domain] = {
        questions: selected.map(q => ({
          prompt: q.prompt,
          answer: q.answer,
          difficulty: q.difficulty,
        })),
        totalQuestions: selected.length,
      };
    }
    p.diagnosticResults = { date: new Date().toISOString(), domains: Object.keys(results) };
    saveProfile(p);
    return {
      studentId: id,
      diagnostic: results,
      instructions: 'Answer each question. Record scores using: record <id> <domain> <skill> <score> <total>',
      domains: Object.keys(DOMAINS),
    };
  }

  recordAssessment(id, domain, skill, score, total, notes = '') {
    if (!DOMAINS[domain]) throw new Error(`Unknown domain: ${domain}. Valid: ${Object.keys(DOMAINS).join(', ')}`);
    if (!DOMAINS[domain].skills.includes(skill)) throw new Error(`Unknown skill '${skill}' in ${domain}. Valid: ${DOMAINS[domain].skills.join(', ')}`);
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

  progress(id) {
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
    return {
      studentId: id,
      track: p.track,
      grade: p.grade,
      mastered: totalMastered,
      totalSkills,
      overallPct: totalSkills > 0 ? Math.round(totalMastered / totalSkills * 100) : 0,
      domainSummary,
      skills: results,
    };
  }

  plan(id) {
    const p = loadProfile(id);
    const track = p.track || 'standard';
    const grade = p.grade || '9';
    const prog = this.progress(id);

    // Find weakest domains
    const domainScores = Object.entries(prog.domainSummary)
      .map(([d, info]) => ({ domain: d, mastery: info.avgMastery, label: info.label }))
      .sort((a, b) => a.mastery - b.mastery);

    const weakest = domainScores.filter(d => d.mastery < MASTERY_THRESHOLD);
    const gradeExpected = GRADE_EXPECTATIONS[grade]?.domains || ['inquiry', 'reasoning'];

    // Build weekly plan
    const weeklyPlan = {
      focus: weakest.length > 0 ? weakest.slice(0, 2).map(d => d.domain) : gradeExpected.slice(0, 2),
      review: domainScores.filter(d => d.mastery >= MASTERY_THRESHOLD && d.mastery < 0.9).map(d => d.domain).slice(0, 2),
      sessions: [],
    };

    const sessionTemplates = {
      standard: [
        { day: 'Monday', duration: 40, focus: 'primary domain — concept review and notes', type: 'lesson' },
        { day: 'Tuesday', duration: 30, focus: 'primary domain — practice problems', type: 'practice' },
        { day: 'Wednesday', duration: 40, focus: 'secondary domain — concept review and notes', type: 'lesson' },
        { day: 'Thursday', duration: 30, focus: 'inquiry skills — lab analysis or data interpretation', type: 'lab' },
        { day: 'Friday', duration: 25, focus: 'review and self-assessment', type: 'review' },
      ],
      accelerated: [
        { day: 'Monday', duration: 50, focus: 'primary domain — advanced concepts', type: 'lesson' },
        { day: 'Tuesday', duration: 40, focus: 'primary domain — problem sets and applications', type: 'practice' },
        { day: 'Wednesday', duration: 50, focus: 'secondary domain — advanced concepts', type: 'lesson' },
        { day: 'Thursday', duration: 40, focus: 'inquiry and reasoning — experimental analysis', type: 'lab' },
        { day: 'Friday', duration: 35, focus: 'cross-domain connections and review', type: 'review' },
        { day: 'Saturday', duration: 30, focus: 'enrichment or challenge problems', type: 'challenge' },
      ],
      ap: [
        { day: 'Monday', duration: 60, focus: 'AP unit content — detailed study', type: 'lesson' },
        { day: 'Tuesday', duration: 45, focus: 'AP practice questions — multiple choice', type: 'practice' },
        { day: 'Wednesday', duration: 60, focus: 'AP unit content — continued', type: 'lesson' },
        { day: 'Thursday', duration: 45, focus: 'AP free-response practice', type: 'practice' },
        { day: 'Friday', duration: 40, focus: 'lab and inquiry skills for AP', type: 'lab' },
        { day: 'Saturday', duration: 50, focus: 'full AP practice section or review', type: 'timed' },
      ],
    };

    weeklyPlan.sessions = sessionTemplates[track] || sessionTemplates.standard;

    // Specialist routing
    const routing = [];
    for (const focusDomain of weeklyPlan.focus) {
      if (SPECIALIST_SKILLS[focusDomain]) {
        routing.push({
          domain: focusDomain,
          specialist: SPECIALIST_SKILLS[focusDomain].skill,
          reason: SPECIALIST_SKILLS[focusDomain].route,
        });
      }
    }

    // Mindset message
    const overallMastery = prog.overallPct / 100;
    let mindsetCategory = 'struggling';
    if (overallMastery >= 0.6) mindsetCategory = 'progressing';
    else if (overallMastery >= 0.3) mindsetCategory = 'plateaued';
    const mindset = pick(GROWTH_MINDSET[mindsetCategory], 1)[0];

    return {
      studentId: id,
      track,
      grade,
      weeklyPlan,
      domainPriorities: domainScores.slice(0, 4),
      gradeExpectations: GRADE_EXPECTATIONS[grade],
      routeToSpecialists: routing,
      mindsetMessage: mindset,
    };
  }

  recommend(id) {
    const p = loadProfile(id);
    const prog = this.progress(id);
    const track = p.track || 'standard';
    const grade = p.grade || '9';

    // Find weakest skills across all domains
    const allSkills = [];
    for (const [domain, skills] of Object.entries(prog.skills)) {
      for (const [skill, info] of Object.entries(skills)) {
        allSkills.push({ domain, skill, mastery: info.mastery, label: info.label });
      }
    }
    allSkills.sort((a, b) => a.mastery - b.mastery);

    // Weakest domains
    const domainScores = Object.entries(prog.domainSummary)
      .map(([d, info]) => ({ domain: d, mastery: info.avgMastery, label: info.label }))
      .sort((a, b) => a.mastery - b.mastery);

    // Priority recommendations based on grade expectations
    const gradeInfo = GRADE_EXPECTATIONS[grade];
    const priorityDomains = gradeInfo ? gradeInfo.domains : ['inquiry', 'reasoning'];
    const gradePriority = domainScores.filter(d => priorityDomains.includes(d.domain) && d.mastery < MASTERY_THRESHOLD);

    // Specialist routing for weakest areas
    const routing = [];
    const weakestDomains = domainScores.filter(d => d.mastery < MASTERY_THRESHOLD).slice(0, 3);
    for (const wd of weakestDomains) {
      if (SPECIALIST_SKILLS[wd.domain]) {
        routing.push({
          domain: wd.domain,
          specialist: SPECIALIST_SKILLS[wd.domain].skill,
          currentMastery: wd.mastery,
          reason: `${wd.label} — needs focused practice in ${SPECIALIST_SKILLS[wd.domain].route}`,
        });
      }
    }

    // AP readiness check if on AP track
    let apInsight = null;
    if (track === 'ap') {
      apInsight = this.getAPReadiness(id);
    }

    return {
      studentId: id,
      track,
      grade,
      weakestSkills: allSkills.slice(0, 10),
      weakestDomains: domainScores.slice(0, 3),
      gradePriorityGaps: gradePriority,
      routeToSpecialists: routing,
      apReadiness: apInsight,
      tip: weakestDomains.length > 0
        ? `Focus on ${weakestDomains[0].domain} first — it is your biggest opportunity for growth.`
        : 'Great work! All domains are at or above proficiency. Consider AP-level challenges.',
    };
  }

  goals(id, goal) {
    const p = loadProfile(id);
    const validGoals = ['course-grade', 'ap-prep', 'college-ready', 'stem-career', 'general-literacy', 'competition'];

    if (goal) {
      if (!validGoals.includes(goal)) throw new Error(`Unknown goal: ${goal}. Valid: ${validGoals.join(', ')}`);
      if (!p.goals.includes(goal)) p.goals.push(goal);
      saveProfile(p);
    }

    const goalDescriptions = {
      'course-grade': 'Improve grades in current science courses',
      'ap-prep': 'Prepare for AP science exams (target score 4-5)',
      'college-ready': 'Build science skills for college STEM courses',
      'stem-career': 'Explore STEM career paths and build relevant skills',
      'general-literacy': 'Develop broad scientific literacy for informed citizenship',
      'competition': 'Prepare for science competitions (Science Olympiad, research fairs)',
    };

    return {
      studentId: id,
      currentGoals: p.goals,
      availableGoals: validGoals,
      goalDescriptions,
      timeBudget: p.timeBudget,
    };
  }

  setTimeBudget(id, hoursPerWeek) {
    const hours = Number(hoursPerWeek);
    if (isNaN(hours) || hours < 1 || hours > 30) throw new Error('Time budget must be 1-30 hours per week');
    const p = loadProfile(id);
    p.timeBudget = hours;
    saveProfile(p);
    return { studentId: id, timeBudget: hours };
  }

  getAPReadiness(id) {
    const prog = this.progress(id);
    const results = {};

    for (const [exam, units] of Object.entries(AP_EXAM_WEIGHTS)) {
      const unitReadiness = {};
      let weightedScore = 0;
      for (const [unit, info] of Object.entries(units)) {
        const domainMasteries = info.domains.map(d => prog.domainSummary[d]?.avgMastery || 0);
        const avg = domainMasteries.reduce((s, v) => s + v, 0) / domainMasteries.length;
        unitReadiness[unit] = {
          weight: info.weight,
          mastery: Math.round(avg * 100) / 100,
          label: masteryLabel(avg),
          ready: avg >= MASTERY_THRESHOLD,
        };
        weightedScore += avg * info.weight;
      }
      const overallReady = Object.values(unitReadiness).every(r => r.ready);
      const weakestUnit = Object.entries(unitReadiness).sort((a, b) => a[1].mastery - b[1].mastery)[0];
      results[exam] = {
        units: unitReadiness,
        weightedScore: Math.round(weightedScore * 100) / 100,
        overallReady,
        weakestUnit: weakestUnit ? weakestUnit[0] : null,
        projectedScore: weightedScore >= 0.9 ? 5 : weightedScore >= 0.75 ? 4 : weightedScore >= 0.6 ? 3 : weightedScore >= 0.4 ? 2 : 1,
      };
    }

    return { studentId: id, apReadiness: results };
  }

  report(id) {
    const p = loadProfile(id);
    const prog = this.progress(id);

    // Domain strengths and weaknesses
    const domainScores = Object.entries(prog.domainSummary)
      .map(([d, info]) => ({ domain: d, mastery: info.avgMastery, label: info.label }))
      .sort((a, b) => b.mastery - a.mastery);

    const strengths = domainScores.filter(d => d.mastery >= MASTERY_THRESHOLD);
    const weaknesses = domainScores.filter(d => d.mastery < MASTERY_THRESHOLD);

    // Three-dimensional learning check (NGSS)
    const dimensionCheck = {
      disciplinaryCore: ['biology', 'chemistry', 'physics', 'earth-space'].map(d => ({
        domain: d,
        mastery: prog.domainSummary[d]?.avgMastery || 0,
        label: prog.domainSummary[d]?.label || 'not-started',
      })),
      sciencePractices: {
        domain: 'inquiry',
        mastery: prog.domainSummary.inquiry?.avgMastery || 0,
        label: prog.domainSummary.inquiry?.label || 'not-started',
      },
      crosscuttingConcepts: {
        domain: 'reasoning',
        mastery: prog.domainSummary.reasoning?.avgMastery || 0,
        label: prog.domainSummary.reasoning?.label || 'not-started',
      },
    };

    // Mindset
    const overallMastery = prog.overallPct / 100;
    let mindsetCategory = 'struggling';
    if (overallMastery >= 0.6) mindsetCategory = 'progressing';
    else if (overallMastery >= 0.3) mindsetCategory = 'plateaued';

    return {
      studentId: id,
      track: p.track,
      grade: p.grade,
      goals: p.goals,
      progress: prog,
      strengths,
      weaknesses,
      dimensionCheck,
      apReadiness: (p.track === 'ap') ? this.getAPReadiness(id) : null,
      recentAssessments: p.assessments.slice(-20).reverse(),
      mindsetMessage: pick(GROWTH_MINDSET[mindsetCategory], 1)[0],
    };
  }

  catalog(track) {
    const t = track || 'standard';
    if (!TRACK_PROGRESSION[t]) throw new Error(`Unknown track: ${t}. Valid: ${Object.keys(TRACK_PROGRESSION).join(', ')}`);

    const domainCatalog = {};
    for (const [domain, info] of Object.entries(DOMAINS)) {
      domainCatalog[domain] = {
        description: info.description,
        skills: info.skills,
        courses: info.courses,
        totalSkills: info.skills.length,
      };
    }

    return {
      track: t,
      progression: TRACK_PROGRESSION[t],
      domains: domainCatalog,
      totalDomains: Object.keys(DOMAINS).length,
      totalSkills: Object.values(DOMAINS).reduce((s, d) => s + d.skills.length, 0),
      specialists: SPECIALIST_SKILLS,
    };
  }

  students() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return {
      count: files.length,
      students: files.map(f => {
        const id = f.replace(/\.json$/, '');
        const p = loadProfile(id);
        return { id, track: p.track, grade: p.grade, goals: p.goals, assessments: p.assessments.length };
      }),
    };
  }

  anxietyCheck(id) {
    const questions = [
      'I feel anxious before science tests or lab practicals (1-5)',
      'I avoid science homework or put it off as long as possible (1-5)',
      'I believe science is only for naturally "smart" people (1-5)',
      'I feel lost when the teacher explains new science concepts (1-5)',
      'I feel embarrassed to ask questions in science class (1-5)',
    ];

    return {
      studentId: id,
      screeningQuestions: questions,
      scoring: {
        '5-10': { level: 'mild', strategies: SCIENCE_ANXIETY_STRATEGIES.mild },
        '11-18': { level: 'moderate', strategies: SCIENCE_ANXIETY_STRATEGIES.moderate },
        '19-25': { level: 'significant', strategies: SCIENCE_ANXIETY_STRATEGIES.significant },
      },
      instructions: 'Rate each question 1 (never) to 5 (always). Sum the scores to determine anxiety level.',
      note: 'This is a screening tool, not a clinical assessment. For persistent anxiety, consult a school counselor.',
    };
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
        const [, id, track] = args;
        if (!id) throw new Error('Usage: start <id> [track]');
        out(sp.start(id, track));
        break;
      }
      case 'diagnostic': {
        const [, id] = args;
        if (!id) throw new Error('Usage: diagnostic <id>');
        out(sp.diagnostic(id));
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
      case 'report': {
        const [, id] = args;
        if (!id) throw new Error('Usage: report <id>');
        out(sp.report(id));
        break;
      }
      case 'goals': {
        const [, id, goal] = args;
        if (!id) throw new Error('Usage: goals <id> [goal]');
        out(sp.goals(id, goal));
        break;
      }
      case 'recommend': {
        const [, id] = args;
        if (!id) throw new Error('Usage: recommend <id>');
        out(sp.recommend(id));
        break;
      }
      case 'set-track': {
        const [, id, track] = args;
        if (!id || !track) throw new Error('Usage: set-track <id> <track>');
        out(sp.setTrack(id, track));
        break;
      }
      case 'set-grade': {
        const [, id, g] = args;
        if (!id || !g) throw new Error('Usage: set-grade <id> <grade>');
        out(sp.setGrade(id, g));
        break;
      }
      case 'record': {
        const [, id, domain, skill, sc, tot, ...notes] = args;
        if (!id || !domain || !skill || !sc || !tot) throw new Error('Usage: record <id> <domain> <skill> <score> <total> [notes]');
        out(sp.recordAssessment(id, domain, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'catalog': {
        const [, track] = args;
        out(sp.catalog(track));
        break;
      }
      case 'students': {
        out(sp.students());
        break;
      }
      case 'ap-ready': {
        const [, id] = args;
        if (!id) throw new Error('Usage: ap-ready <id>');
        out(sp.getAPReadiness(id));
        break;
      }
      case 'set-time': {
        const [, id, hours] = args;
        if (!id || !hours) throw new Error('Usage: set-time <id> <hours-per-week>');
        out(sp.setTimeBudget(id, hours));
        break;
      }
      case 'anxiety-check': {
        const [, id] = args;
        if (!id) throw new Error('Usage: anxiety-check <id>');
        out(sp.anxietyCheck(id));
        break;
      }
      default: out({
        usage: 'node study-planner.js <command> [args]',
        commands: ['start', 'diagnostic', 'plan', 'progress', 'report', 'goals', 'recommend', 'set-track', 'set-grade', 'record', 'catalog', 'students', 'ap-ready', 'set-time', 'anxiety-check'],
        tracks: Object.keys(TRACK_PROGRESSION),
        grades: Object.keys(GRADE_EXPECTATIONS),
        domains: Object.keys(DOMAINS),
      });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
