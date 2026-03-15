// College ELA Study Planner and Progress Coach. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-ela-study-planner');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'diagnostic': {
    'literature': ['literature-diagnostic'],
    'rhetoric': ['rhetoric-diagnostic'],
    'creative-writing': ['creative-writing-diagnostic'],
    'critical-theory': ['critical-theory-diagnostic'],
    'linguistics': ['linguistics-diagnostic'],
    'research-writing': ['research-writing-diagnostic'],
    'professional-writing': ['professional-writing-diagnostic'],
  },
};

const SKILL_AREAS = [
  { key: 'literature', name: 'Literature', module: 'college-ela-literature' },
  { key: 'rhetoric', name: 'Rhetoric & Composition', module: 'college-ela-rhetoric-composition' },
  { key: 'creative-writing', name: 'Creative Writing', module: 'college-ela-creative-writing' },
  { key: 'critical-theory', name: 'Critical Theory', module: 'college-ela-critical-theory' },
  { key: 'linguistics', name: 'Linguistics', module: 'college-ela-linguistics' },
  { key: 'research-writing', name: 'Research Writing', module: 'college-ela-research-writing' },
  { key: 'professional-writing', name: 'Professional Writing', module: 'college-ela-professional-writing' },
];

const VALID_GOALS = ['major', 'minor', 'gre', 'grad-school', 'mfa'];

const ITEM_BANKS = {
  'diagnostic': {
    'literature-diagnostic': {
      type: 'mixed', instruction: 'Answer the following literature diagnostic questions.',
      items: [
        { prompt: 'In literary analysis, "close reading" primarily involves:', answer: 'Careful attention to language, structure, and meaning within the text itself', options: ['Careful attention to language, structure, and meaning within the text itself', 'Reading the text quickly', 'Only reading the first and last chapters', 'Summarizing the plot'] },
        { prompt: 'A bildungsroman is a novel that focuses on:', answer: 'The moral and psychological growth of the protagonist from youth to adulthood', options: ['The moral and psychological growth of the protagonist from youth to adulthood', 'A detective solving a mystery', 'A journey through a fantasy world', 'A historical war narrative'] },
        { prompt: 'Which literary period emphasized reason, order, and classical forms?', answer: 'Neoclassicism / The Enlightenment', options: ['Neoclassicism / The Enlightenment', 'Romanticism', 'Modernism', 'Postmodernism'] },
        { prompt: 'Free indirect discourse is a narrative technique that:', answer: 'Blends a character\'s voice with the narrator\'s without explicit attribution', options: ['Blends a character\'s voice with the narrator\'s without explicit attribution', 'Uses only first-person narration', 'Eliminates all dialogue', 'Relies exclusively on stage directions'] },
        { prompt: '"The curtains were blue" is often cited in discussions about literary interpretation to illustrate:', answer: 'The tension between authorial intent, symbolic reading, and over-interpretation', options: ['The tension between authorial intent, symbolic reading, and over-interpretation', 'That blue is the best color for curtains', 'A famous passage from Gatsby', 'The importance of setting in all novels'] },
        { prompt: 'Postcolonial literary criticism primarily examines:', answer: 'How literature represents and responds to colonialism, empire, and cultural identity', options: ['How literature represents and responds to colonialism, empire, and cultural identity', 'Only literature written after 1945', 'Postal systems in fiction', 'The colonization of Mars in science fiction'] },
      ],
    },
    'rhetoric-diagnostic': {
      type: 'mixed', instruction: 'Answer the following rhetoric and composition diagnostic questions.',
      items: [
        { prompt: 'Aristotle\'s three rhetorical appeals are:', answer: 'Ethos (credibility), Pathos (emotion), Logos (logic)', options: ['Ethos (credibility), Pathos (emotion), Logos (logic)', 'Introduction, Body, Conclusion', 'Thesis, Antithesis, Synthesis', 'Plot, Character, Setting'] },
        { prompt: 'A "straw man" fallacy occurs when:', answer: 'Someone misrepresents an opponent\'s argument to make it easier to attack', options: ['Someone misrepresents an opponent\'s argument to make it easier to attack', 'Someone uses scarecrow imagery in their argument', 'An argument is too long', 'Someone cites too many sources'] },
        { prompt: 'Kairos in rhetorical theory refers to:', answer: 'The opportune moment — the right time, place, and context for an argument', options: ['The opportune moment — the right time, place, and context for an argument', 'The logical structure of an argument', 'The speaker\'s credibility', 'The emotional response of the audience'] },
        { prompt: 'In composition studies, "process writing" emphasizes:', answer: 'Writing as iterative stages (prewriting, drafting, revising, editing) rather than a single product', options: ['Writing as iterative stages (prewriting, drafting, revising, editing) rather than a single product', 'Only the final draft matters', 'Speed-writing competitions', 'Copying model essays exactly'] },
        { prompt: 'A rhetorical analysis essay should focus on:', answer: 'HOW the author constructs the argument (strategies, appeals, techniques)', options: ['HOW the author constructs the argument (strategies, appeals, techniques)', 'Whether you agree with the argument', 'A summary of the text', 'Your personal opinion on the topic'] },
        { prompt: 'The "rhetorical situation" includes:', answer: 'Writer/speaker, audience, purpose, context, and genre', options: ['Writer/speaker, audience, purpose, context, and genre', 'Only the topic of the text', 'The page count and font', 'The publication date only'] },
      ],
    },
    'creative-writing-diagnostic': {
      type: 'mixed', instruction: 'Answer the following creative writing diagnostic questions.',
      items: [
        { prompt: '"Show, don\'t tell" in fiction writing means:', answer: 'Use concrete details, action, and sensory language instead of abstract summary', options: ['Use concrete details, action, and sensory language instead of abstract summary', 'Include illustrations instead of words', 'Write only in present tense', 'Avoid all adjectives'] },
        { prompt: 'In medias res means starting a story:', answer: 'In the middle of the action, then filling in background later', options: ['In the middle of the action, then filling in background later', 'At the very beginning of the character\'s life', 'At the end, then going backward', 'With a dictionary definition'] },
        { prompt: 'A "flat character" in fiction is one who:', answer: 'Is built around a single quality or trait and does not change', options: ['Is built around a single quality or trait and does not change', 'Lives in a flat or apartment', 'Is boring to read about', 'Has no dialogue'] },
        { prompt: 'Enjambment in poetry refers to:', answer: 'A sentence or phrase continuing past the end of a line without punctuation', options: ['A sentence or phrase continuing past the end of a line without punctuation', 'A poem that rhymes perfectly', 'Using only short lines', 'The title of the poem'] },
        { prompt: 'The "workshop model" in creative writing involves:', answer: 'Peers reading and critiquing each other\'s drafts with the author typically silent', options: ['Peers reading and critiquing each other\'s drafts with the author typically silent', 'Writing alone in a workshop building', 'Only the instructor providing feedback', 'Publishing without revision'] },
        { prompt: 'Second-person point of view uses:', answer: '"You" as the protagonist, placing the reader directly in the story', options: ['"You" as the protagonist, placing the reader directly in the story', '"I" as the narrator', '"He/she/they" for all characters', 'No pronouns at all'] },
      ],
    },
    'critical-theory-diagnostic': {
      type: 'mixed', instruction: 'Answer the following critical theory diagnostic questions.',
      items: [
        { prompt: 'Feminist literary criticism primarily examines:', answer: 'How gender and power structures are represented and constructed in texts', options: ['How gender and power structures are represented and constructed in texts', 'Only literature by women', 'The femininity of writing styles', 'Grammar rules about gendered pronouns'] },
        { prompt: 'Marxist literary criticism focuses on:', answer: 'Class relations, economic conditions, and ideology in literary texts', options: ['Class relations, economic conditions, and ideology in literary texts', 'Karl Marx\'s personal diaries', 'Only Russian literature', 'Mathematical formulas in fiction'] },
        { prompt: 'Deconstruction, associated with Derrida, argues that:', answer: 'Texts contain internal contradictions that undermine their apparent meaning', options: ['Texts contain internal contradictions that undermine their apparent meaning', 'All texts should be physically destroyed', 'Only one correct reading exists for any text', 'Grammar is unimportant'] },
        { prompt: 'The "male gaze" concept, originating from Laura Mulvey\'s film theory, refers to:', answer: 'The way visual media positions the audience to view women from a masculine perspective', options: ['The way visual media positions the audience to view women from a masculine perspective', 'Male characters who stare at things', 'A type of camera lens', 'Men who read novels'] },
        { prompt: 'New Historicism differs from traditional historical criticism by:', answer: 'Treating literary and non-literary texts as equally important cultural documents', options: ['Treating literary and non-literary texts as equally important cultural documents', 'Ignoring history entirely', 'Only studying very recent works', 'Focusing exclusively on dates and timelines'] },
        { prompt: 'Queer theory in literary studies challenges:', answer: 'Fixed categories of gender and sexuality, examining how they are constructed in texts', options: ['Fixed categories of gender and sexuality, examining how they are constructed in texts', 'Only LGBTQ+ authored literature', 'Unusual or "queer" sentence structures', 'The quality of strange fiction'] },
      ],
    },
    'linguistics-diagnostic': {
      type: 'mixed', instruction: 'Answer the following linguistics diagnostic questions.',
      items: [
        { prompt: 'Morphology is the study of:', answer: 'The internal structure and formation of words', options: ['The internal structure and formation of words', 'The meaning of sentences', 'Sound systems', 'Conversational rules'] },
        { prompt: 'The difference between "prescriptive" and "descriptive" grammar is:', answer: 'Prescriptive dictates rules; descriptive documents how language is actually used', options: ['Prescriptive dictates rules; descriptive documents how language is actually used', 'They are the same thing', 'Prescriptive is about pronunciation only', 'Descriptive is about writing only'] },
        { prompt: 'A phoneme is:', answer: 'The smallest unit of sound that can distinguish meaning in a language', options: ['The smallest unit of sound that can distinguish meaning in a language', 'A type of telephone', 'A complete sentence', 'A writing system'] },
        { prompt: 'Code-switching refers to:', answer: 'Alternating between two or more languages or language varieties in conversation', options: ['Alternating between two or more languages or language varieties in conversation', 'Switching computer programming languages', 'Changing the topic of conversation', 'Translating a book'] },
        { prompt: 'The Sapir-Whorf hypothesis proposes that:', answer: 'Language influences (or determines) how speakers perceive and think about the world', options: ['Language influences (or determines) how speakers perceive and think about the world', 'All languages are identical in structure', 'Language has no connection to thought', 'Only written language matters'] },
        { prompt: 'Syntax is the study of:', answer: 'How words combine to form phrases, clauses, and sentences', options: ['How words combine to form phrases, clauses, and sentences', 'Word meanings', 'Sound patterns', 'Writing systems'] },
      ],
    },
    'research-writing-diagnostic': {
      type: 'mixed', instruction: 'Answer the following research writing diagnostic questions.',
      items: [
        { prompt: 'A literature review in a research paper serves to:', answer: 'Synthesize existing scholarship and position your study within the conversation', options: ['Synthesize existing scholarship and position your study within the conversation', 'Review your favorite novels', 'Summarize one article', 'List your bibliography alphabetically'] },
        { prompt: 'Primary sources differ from secondary sources in that primary sources are:', answer: 'Original documents, data, or artifacts from the period/event being studied', options: ['Original documents, data, or artifacts from the period/event being studied', 'Always more reliable', 'Published more recently', 'Written by professors'] },
        { prompt: 'An annotated bibliography entry includes:', answer: 'A citation followed by a summary and evaluation of the source', options: ['A citation followed by a summary and evaluation of the source', 'Only the title and author', 'A full copy of the article', 'Only your opinion of the source'] },
        { prompt: 'In academic writing, "hedging" language (e.g., "suggests," "may indicate") is used to:', answer: 'Acknowledge uncertainty and avoid overclaiming based on evidence', options: ['Acknowledge uncertainty and avoid overclaiming based on evidence', 'Make writing sound weaker', 'Hide the main argument', 'Meet word count requirements'] },
        { prompt: 'The IMRaD structure (Introduction, Methods, Results, and Discussion) is standard in:', answer: 'Empirical research papers, especially in sciences and social sciences', options: ['Empirical research papers, especially in sciences and social sciences', 'All poetry', 'Personal essays', 'Newspaper editorials'] },
        { prompt: 'Plagiarism includes all of the following EXCEPT:', answer: 'Paraphrasing a source in your own words with proper citation', options: ['Paraphrasing a source in your own words with proper citation', 'Copying text without attribution', 'Submitting someone else\'s paper as your own', 'Fabricating sources that do not exist'] },
      ],
    },
    'professional-writing-diagnostic': {
      type: 'mixed', instruction: 'Answer the following professional writing diagnostic questions.',
      items: [
        { prompt: 'Plain language writing prioritizes:', answer: 'Clarity, conciseness, and the reader\'s ability to understand on first reading', options: ['Clarity, conciseness, and the reader\'s ability to understand on first reading', 'Using the most complex vocabulary available', 'Impressing the reader with jargon', 'Making documents as long as possible'] },
        { prompt: 'The CRAP principles of visual design stand for:', answer: 'Contrast, Repetition, Alignment, Proximity', options: ['Contrast, Repetition, Alignment, Proximity', 'Color, Resolution, Animation, Pixels', 'Content, Research, Analysis, Publishing', 'Creative, Realistic, Authentic, Professional'] },
        { prompt: 'In business writing, the "bottom-line-up-front" (BLUF) approach means:', answer: 'State the key point or request in the opening sentence', options: ['State the key point or request in the opening sentence', 'Focus on financial data first', 'Put the conclusion at the end only', 'Write the last paragraph first'] },
        { prompt: 'A grant proposal\'s logic model maps:', answer: 'Inputs → Activities → Outputs → Outcomes → Impact', options: ['Inputs → Activities → Outputs → Outcomes → Impact', 'Title → Abstract → Body → References', 'Problem → Excuse → Solution', 'Budget → Timeline → Staff'] },
        { prompt: 'UX writing is primarily concerned with:', answer: 'Guiding users through digital interfaces with clear, helpful microcopy', options: ['Guiding users through digital interfaces with clear, helpful microcopy', 'Writing long-form blog posts', 'Academic research about user experience', 'Designing visual layouts'] },
        { prompt: 'An effective data visualization should:', answer: 'Highlight the key insight with minimal non-data ink', options: ['Highlight the key insight with minimal non-data ink', 'Include as many colors and effects as possible', 'Always use 3D pie charts', 'Avoid labels to keep it clean'] },
      ],
    },
  },
};

// Goal-based weights for plan generation
const GOAL_WEIGHTS = {
  'major': { literature: 3, rhetoric: 3, 'creative-writing': 2, 'critical-theory': 3, linguistics: 2, 'research-writing': 3, 'professional-writing': 2 },
  'minor': { literature: 3, rhetoric: 3, 'creative-writing': 2, 'critical-theory': 1, linguistics: 1, 'research-writing': 2, 'professional-writing': 2 },
  'gre': { literature: 3, rhetoric: 3, 'creative-writing': 1, 'critical-theory': 2, linguistics: 1, 'research-writing': 3, 'professional-writing': 1 },
  'grad-school': { literature: 3, rhetoric: 3, 'creative-writing': 1, 'critical-theory': 3, linguistics: 2, 'research-writing': 3, 'professional-writing': 2 },
  'mfa': { literature: 3, rhetoric: 2, 'creative-writing': 3, 'critical-theory': 2, linguistics: 1, 'research-writing': 2, 'professional-writing': 2 },
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
  return { studentId: id, createdAt: new Date().toISOString(), skillLevels: {}, goal: null, semesterPlan: null, assessments: [], skills: {} };
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

// Diagnostic generation

function generateDiagnostic(area) {
  const skill = `${area}-diagnostic`;
  const bank = ITEM_BANKS['diagnostic']?.[skill];
  if (!bank) return { error: `No diagnostic bank for ${area}` };
  const items = pick(bank.items, 6);
  return { type: bank.type, area, skill, count: items.length, instruction: bank.instruction, items };
}

function runFullDiagnostic() {
  const diagnostics = {};
  for (const sa of SKILL_AREAS) {
    diagnostics[sa.key] = generateDiagnostic(sa.key);
  }
  return diagnostics;
}

// Plan generation

function levelFromScore(score, total) {
  const pct = total > 0 ? score / total : 0;
  if (pct >= 0.85) return 'advanced';
  if (pct >= 0.6) return 'intermediate';
  return 'intro';
}

function generatePlan(id) {
  const p = loadProfile(id);
  const goal = p.goal || 'major';
  const weights = GOAL_WEIGHTS[goal] || GOAL_WEIGHTS['major'];
  const totalWeight = Object.values(weights).reduce((s, w) => s + w, 0);

  const plan = {
    goal,
    generatedAt: new Date().toISOString(),
    semesters: [],
  };

  // Generate a 4-semester plan
  const semesterNames = ['Semester 1: Foundations', 'Semester 2: Development', 'Semester 3: Specialization', 'Semester 4: Capstone'];
  const semesterFocus = [
    { literature: 'intro', rhetoric: 'intro', 'creative-writing': 'intro', 'critical-theory': null, linguistics: 'intro', 'research-writing': 'intro', 'professional-writing': null },
    { literature: 'intermediate', rhetoric: 'intermediate', 'creative-writing': 'intermediate', 'critical-theory': 'intro', linguistics: 'intermediate', 'research-writing': 'intermediate', 'professional-writing': 'intro' },
    { literature: 'advanced', rhetoric: 'advanced', 'creative-writing': 'intermediate', 'critical-theory': 'intermediate', linguistics: 'advanced', 'research-writing': 'advanced', 'professional-writing': 'intermediate' },
    { literature: 'advanced', rhetoric: 'advanced', 'creative-writing': 'advanced', 'critical-theory': 'advanced', linguistics: 'advanced', 'research-writing': 'advanced', 'professional-writing': 'advanced' },
  ];

  for (let i = 0; i < 4; i++) {
    const courses = [];
    for (const sa of SKILL_AREAS) {
      const level = semesterFocus[i][sa.key];
      if (!level) continue;
      const w = weights[sa.key] || 1;
      const hoursPerWeek = Math.round((w / totalWeight) * 15 * 10) / 10;
      const currentLevel = p.skillLevels[sa.key];

      // Skip if student is already beyond this level
      const levelOrder = { intro: 0, intermediate: 1, advanced: 2 };
      if (currentLevel && (levelOrder[currentLevel] || 0) > (levelOrder[level] || 0)) continue;

      courses.push({
        area: sa.key,
        name: sa.name,
        level,
        module: sa.module,
        suggestedHoursPerWeek: hoursPerWeek,
        priority: w >= 3 ? 'high' : w >= 2 ? 'medium' : 'low',
      });
    }
    plan.semesters.push({ name: semesterNames[i], courses });
  }

  p.semesterPlan = plan;
  saveProfile(p);
  return { studentId: id, plan };
}

// GRE prep plan

function generateGrePrep(id) {
  const p = loadProfile(id);
  const weeks = [];

  const greWeeks = [
    { week: 1, focus: 'Baseline & Strategy', tasks: ['Take a practice GRE Verbal section', 'Review scoring rubric for Analytical Writing', 'Identify strongest and weakest areas', 'Set target scores'] },
    { week: 2, focus: 'Reading Comprehension Foundations', tasks: ['Practice close reading of academic passages', 'Work on main-idea extraction', 'Practice evidence-based reasoning', 'Timed reading drills: 2 passages per session'] },
    { week: 3, focus: 'Text Completion & Sentence Equivalence', tasks: ['Vocabulary building: academic word list (50 words)', 'Practice text completion strategies', 'Work on sentence equivalence with context clues', 'Review roots, prefixes, and suffixes'] },
    { week: 4, focus: 'Analytical Writing — Issue Essay', tasks: ['Study the GRE Issue essay prompt pool', 'Practice brainstorming and outlining in 5 minutes', 'Write 2 timed Issue essays (30 min each)', 'Review scoring criteria and self-assess'] },
    { week: 5, focus: 'Analytical Writing — Argument Essay', tasks: ['Study the GRE Argument essay prompt pool', 'Identify common logical fallacies', 'Write 2 timed Argument essays (30 min each)', 'Practice identifying assumptions and counter-examples'] },
    { week: 6, focus: 'Advanced Reading Comprehension', tasks: ['Practice inference and implication questions', 'Work on "select all that apply" format', 'Practice identifying author\'s attitude and purpose', 'Timed practice: full Verbal section'] },
    { week: 7, focus: 'Vocabulary Intensive', tasks: ['Vocabulary building: 50 more academic words', 'Practice using context to determine meaning', 'Review commonly confused words', 'Timed text completion practice'] },
    { week: 8, focus: 'Critical Reasoning', tasks: ['Practice strengthening/weakening argument questions', 'Work on logical structure identification', 'Practice with complex multi-paragraph passages', 'Review critical theory concepts that aid analysis'] },
    { week: 9, focus: 'Timed Practice & Review', tasks: ['Take full-length practice Verbal section', 'Write 1 Issue and 1 Argument essay under timed conditions', 'Review all errors and identify patterns', 'Focus remediation on weakest question types'] },
    { week: 10, focus: 'Final Review & Test Strategy', tasks: ['Take final practice test under real conditions', 'Review time management strategies', 'Practice stress management techniques', 'Final vocabulary review of missed words'] },
  ];

  for (const w of greWeeks) {
    weeks.push(w);
  }

  const grePlan = {
    generatedAt: new Date().toISOString(),
    totalWeeks: 10,
    hoursPerWeek: '8-10 recommended',
    sections: ['Verbal Reasoning', 'Analytical Writing'],
    weeks,
    resources: [
      'ETS Official GRE Verbal Practice',
      'GRE Analytical Writing prompt pools (publicly available from ETS)',
      'Academic word lists',
      'College-level reading from literature and rhetoric modules',
    ],
  };

  return { studentId: id, grePlan };
}

// Public API

class CollegePlanner {
  getProfile(id) {
    const p = loadProfile(id);
    return {
      studentId: p.studentId,
      createdAt: p.createdAt,
      skillLevels: p.skillLevels,
      goal: p.goal,
      hasPlan: !!p.semesterPlan,
      totalAssessments: p.assessments.length,
    };
  }

  runDiagnostic(id) {
    const diagnostics = runFullDiagnostic();
    return { studentId: id, diagnostics, instruction: 'Administer each area\'s diagnostic, then record results with the "record" command to set skill levels.' };
  }

  recordAssessment(id, area, score, total, notes = '') {
    const validAreas = SKILL_AREAS.map(a => a.key);
    if (!validAreas.includes(area)) throw new Error(`Unknown area: ${area}. Valid: ${validAreas.join(', ')}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id);
    const entry = { date: new Date().toISOString(), area, score, total, notes };
    p.assessments.push(entry);
    const key = `diagnostic/${area}/${area}-diagnostic`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);
    p.skillLevels[area] = levelFromScore(score, total);
    saveProfile(p);
    return { studentId: id, area, score: `${score}/${total}`, level: p.skillLevels[area], mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  generatePlan(id) { return generatePlan(id); }

  getDashboard(id) {
    const p = loadProfile(id);
    const dashboard = { studentId: id, goal: p.goal, skillLevels: p.skillLevels, areas: {} };
    let totalMastery = 0, areaCount = 0;
    for (const sa of SKILL_AREAS) {
      const key = `diagnostic/${sa.key}/${sa.key}-diagnostic`;
      const d = p.skills[key];
      dashboard.areas[sa.key] = {
        name: sa.name,
        module: sa.module,
        level: p.skillLevels[sa.key] || 'not-assessed',
        mastery: d ? d.mastery : 0,
        label: d ? d.label : 'not-started',
      };
      if (d) { totalMastery += d.mastery; areaCount++; }
    }
    dashboard.overallMastery = areaCount > 0 ? Math.round(totalMastery / areaCount * 100) / 100 : 0;
    dashboard.hasPlan = !!p.semesterPlan;
    return dashboard;
  }

  generateGrePrep(id) { return generateGrePrep(id); }

  adjustLevel(id, area, level) {
    const validAreas = SKILL_AREAS.map(a => a.key);
    if (!validAreas.includes(area)) throw new Error(`Unknown area: ${area}. Valid: ${validAreas.join(', ')}`);
    const validLevels = ['intro', 'intermediate', 'advanced'];
    if (!validLevels.includes(level)) throw new Error(`Unknown level: ${level}. Valid: ${validLevels.join(', ')}`);
    const p = loadProfile(id);
    p.skillLevels[area] = level;
    saveProfile(p);
    return { studentId: id, area, level };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const progress = {};
    for (const sa of SKILL_AREAS) {
      const key = `diagnostic/${sa.key}/${sa.key}-diagnostic`;
      const d = p.skills[key];
      progress[sa.key] = {
        name: sa.name,
        level: p.skillLevels[sa.key] || 'not-assessed',
        mastery: d ? d.mastery : 0,
        label: d ? d.label : 'not-started',
        attempts: d ? d.attempts.length : 0,
      };
    }
    return { studentId: id, goal: p.goal, progress };
  }

  getReport(id) {
    const p = loadProfile(id);
    return {
      studentId: id,
      goal: p.goal,
      skillLevels: p.skillLevels,
      dashboard: this.getDashboard(id),
      semesterPlan: p.semesterPlan,
      recentAssessments: p.assessments.slice(-20).reverse(),
    };
  }

  setGoal(id, goal) {
    if (!VALID_GOALS.includes(goal)) throw new Error(`Unknown goal: ${goal}. Valid: ${VALID_GOALS.join(', ')}`);
    const p = loadProfile(id);
    p.goal = goal;
    saveProfile(p);
    return { studentId: id, goal };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }
}

module.exports = CollegePlanner;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const cp = new CollegePlanner();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': { const [, id] = args; if (!id) throw new Error('Usage: start <id>'); out({ action: 'start', profile: cp.getProfile(id) }); break; }
      case 'diagnostic': { const [, id] = args; if (!id) throw new Error('Usage: diagnostic <id>'); out(cp.runDiagnostic(id)); break; }
      case 'record': { const [, id, area, sc, tot, ...notes] = args; if (!id || !area || !sc || !tot) throw new Error('Usage: record <id> <area> <score> <total>'); out(cp.recordAssessment(id, area, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'plan': { const [, id] = args; if (!id) throw new Error('Usage: plan <id>'); out(cp.generatePlan(id)); break; }
      case 'dashboard': { const [, id] = args; if (!id) throw new Error('Usage: dashboard <id>'); out(cp.getDashboard(id)); break; }
      case 'gre-prep': { const [, id] = args; if (!id) throw new Error('Usage: gre-prep <id>'); out(cp.generateGrePrep(id)); break; }
      case 'adjust': { const [, id, area, level] = args; if (!id || !area || !level) throw new Error('Usage: adjust <id> <area> <level>'); out(cp.adjustLevel(id, area, level)); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(cp.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(cp.getReport(id)); break; }
      case 'set-goal': { const [, id, goal] = args; if (!id || !goal) throw new Error('Usage: set-goal <id> <goal>'); out(cp.setGoal(id, goal)); break; }
      case 'students': { out(cp.listStudents()); break; }
      default: out({ usage: 'node college-planner.js <command> [args]', commands: ['start', 'diagnostic', 'record', 'plan', 'dashboard', 'gre-prep', 'adjust', 'progress', 'report', 'set-goal', 'students'], goals: VALID_GOALS });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
