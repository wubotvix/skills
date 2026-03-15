// English Study Planner — coordinates 7 English skills (A1-C2). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'english-study-planner');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'diagnostic': {
    'grammar': ['grammar-diagnostic'],
    'vocabulary': ['vocabulary-diagnostic'],
    'reading': ['reading-diagnostic'],
    'writing': ['writing-diagnostic'],
    'listening': ['listening-diagnostic'],
    'conversation': ['conversation-diagnostic'],
    'pronunciation': ['pronunciation-diagnostic'],
  },
};

const ITEM_BANKS = {
  'diagnostic': {
    'grammar-diagnostic': {
      type: 'fill-in', instruction: 'Choose the correct option to complete the sentence.',
      items: [
        { prompt: 'She ___ to school every day.', answer: 'goes', options: ['go', 'goes', 'going', 'gone'] },
        { prompt: 'If I ___ rich, I would travel the world.', answer: 'were', options: ['am', 'was', 'were', 'be'] },
        { prompt: 'The report ___ by the manager yesterday.', answer: 'was reviewed', options: ['reviewed', 'was reviewed', 'is reviewed', 'has reviewed'] },
        { prompt: 'By next June, I ___ here for ten years.', answer: 'will have worked', options: ['will work', 'will be working', 'will have worked', 'work'] },
        { prompt: 'He suggested that she ___ the meeting.', answer: 'attend', options: ['attends', 'attend', 'attended', 'attending'] },
        { prompt: 'Neither the students nor the teacher ___ aware of the change.', answer: 'was', options: ['was', 'were', 'are', 'is'] },
        { prompt: 'I wish I ___ harder when I was younger.', answer: 'had studied', options: ['studied', 'have studied', 'had studied', 'would study'] },
        { prompt: 'The children are used to ___ up early.', answer: 'getting', options: ['get', 'getting', 'got', 'gets'] },
      ],
    },
    'vocabulary-diagnostic': {
      type: 'fill-in', instruction: 'Select the word that best completes the sentence.',
      items: [
        { prompt: 'The cat sat on the ___.', answer: 'mat', options: ['mat', 'bat', 'hat', 'rat'] },
        { prompt: 'She felt ___ after hearing the good news.', answer: 'elated', options: ['depressed', 'elated', 'exhausted', 'confused'] },
        { prompt: 'The scientist made a ___ discovery that changed the field.', answer: 'groundbreaking', options: ['groundbreaking', 'trivial', 'mundane', 'superficial'] },
        { prompt: 'His ___ remarks offended everyone at the meeting.', answer: 'disparaging', options: ['flattering', 'disparaging', 'ambiguous', 'neutral'] },
        { prompt: 'The politician tried to ___ the scandal.', answer: 'downplay', options: ['exaggerate', 'downplay', 'fabricate', 'celebrate'] },
        { prompt: 'The new policy was met with widespread ___.', answer: 'disapproval', options: ['approval', 'disapproval', 'indifference', 'enthusiasm'] },
        { prompt: 'The ___ of evidence led the jury to convict.', answer: 'preponderance', options: ['preponderance', 'scarcity', 'absence', 'fragment'] },
        { prompt: 'After the flood, the town began the slow process of ___.', answer: 'recovery', options: ['decline', 'recovery', 'abandonment', 'celebration'] },
      ],
    },
    'reading-diagnostic': {
      type: 'comprehension', instruction: 'Read the passage and answer the question.',
      items: [
        { passage: 'Tom has a red ball. He plays in the garden.', question: 'Where does Tom play?', answer: 'In the garden', options: ['In the garden', 'At school', 'In the house', 'At the park'] },
        { passage: 'The shop opens at 9 and closes at 5. It is closed on Sundays.', question: 'When is the shop closed?', answer: 'On Sundays', options: ['On Mondays', 'On Sundays', 'At 9', 'At 5'] },
        { passage: 'Climate change is causing glaciers to melt at an unprecedented rate. Scientists warn that sea levels could rise by several metres within this century.', question: 'What is the main concern?', answer: 'Rising sea levels', options: ['Rising sea levels', 'Colder temperatures', 'Stronger glaciers', 'Decreasing rainfall'] },
        { passage: 'The author argues that social media has fundamentally altered how people form opinions, creating echo chambers that reinforce pre-existing beliefs rather than challenging them.', question: 'What effect does social media have according to the author?', answer: 'It reinforces existing beliefs', options: ['It reinforces existing beliefs', 'It broadens perspectives', 'It reduces communication', 'It has no effect'] },
        { passage: 'Recent archaeological findings suggest that early human settlements in the region were far more sophisticated than previously assumed, featuring complex irrigation systems and structured governance.', question: 'What did the findings reveal?', answer: 'Settlements were more advanced than thought', options: ['Settlements were more advanced than thought', 'Settlements were primitive', 'There were no settlements', 'Irrigation was unknown'] },
        { passage: 'The CEO announced quarterly earnings that exceeded analyst expectations, attributing the growth to strategic acquisitions and cost optimisation measures implemented in the previous fiscal year.', question: 'What drove the earnings growth?', answer: 'Acquisitions and cost optimisation', options: ['Acquisitions and cost optimisation', 'New product launches', 'Government subsidies', 'Market crashes'] },
      ],
    },
    'writing-diagnostic': {
      type: 'fill-in', instruction: 'Choose the best way to complete or improve the sentence.',
      items: [
        { prompt: 'Which is correct? "Me and Tom went to the shop" or "Tom and I went to the shop"?', answer: 'Tom and I went to the shop', options: ['Me and Tom went to the shop', 'Tom and I went to the shop'] },
        { prompt: 'Add a comma: "However___ the plan failed."', answer: 'However, the plan failed.', options: ['However, the plan failed.', 'However the plan failed.', ', However the plan failed.', 'However the, plan failed.'] },
        { prompt: 'Choose the better topic sentence: (A) "Dogs are nice." (B) "Dogs make excellent companions for several reasons."', answer: 'B', options: ['A', 'B'] },
        { prompt: 'Which transition best links these sentences? "The data was clear. ___ the committee ignored it."', answer: 'Nevertheless,', options: ['Nevertheless,', 'Therefore,', 'Similarly,', 'For example,'] },
        { prompt: 'Rewrite in passive: "The team completed the project."', answer: 'The project was completed by the team.', options: ['The project was completed by the team.', 'The project completed the team.', 'The team was completed.', 'Completed was the project.'] },
        { prompt: 'Which is more concise? (A) "Due to the fact that it rained" (B) "Because it rained"', answer: 'B', options: ['A', 'B'] },
        { prompt: 'Identify the error: "Their going to the store to buy they\'re supplies for there project."', answer: "They're going to the store to buy their supplies for their project.", options: ["They're going to the store to buy their supplies for their project.", 'No error', "Their going to the store to buy their supplies for they're project.", "They're going to the store to buy they're supplies for their project."] },
        { prompt: 'Which sentence best concludes a persuasive essay about recycling?', answer: 'Recycling is not merely a choice but a collective responsibility for future generations.', options: ['Recycling is good.', 'Recycling is not merely a choice but a collective responsibility for future generations.', 'Some people recycle.', 'In conclusion, recycling.'] },
      ],
    },
    'listening-diagnostic': {
      type: 'comprehension', instruction: 'Listen to the description and answer the question.',
      items: [
        { passage: '"Hello, my name is Anna."', question: 'What is her name?', answer: 'Anna', options: ['Anna', 'Emma', 'Amy', 'Alice'] },
        { passage: '"The meeting is at 3 PM in room 204."', question: 'What time is the meeting?', answer: '3 PM', options: ['2 PM', '3 PM', '4 PM', '3:30 PM'] },
        { passage: '"She said she\'d been waiting for over an hour when the bus finally arrived. The delay was caused by road works on the high street."', question: 'Why was the bus late?', answer: 'Road works', options: ['Road works', 'Traffic', 'An accident', 'Bad weather'] },
        { passage: '"The professor explained that while correlation does not imply causation, the strong association between the two variables warranted further investigation."', question: 'What did the professor recommend?', answer: 'Further investigation', options: ['Further investigation', 'Accepting causation', 'Ignoring the data', 'Ending the study'] },
        { passage: '"Good afternoon, passengers. We regret to inform you that the 14:30 service to Edinburgh will depart from platform 7 instead of platform 3."', question: 'Which platform should passengers go to?', answer: 'Platform 7', options: ['Platform 3', 'Platform 7', 'Platform 14', 'Platform 30'] },
        { passage: '"The quarterly review indicates a 12% increase in customer retention, which the marketing team attributes to the loyalty programme launched in Q2."', question: 'What caused the increase in retention?', answer: 'The loyalty programme', options: ['The loyalty programme', 'Price reductions', 'New products', 'Advertising'] },
      ],
    },
    'conversation-diagnostic': {
      type: 'fill-in', instruction: 'Choose the most appropriate response.',
      items: [
        { prompt: 'Someone says "How are you?" You reply:', answer: "I'm fine, thank you. And you?", options: ["I'm fine, thank you. And you?", 'I am 25 years old.', 'My name is John.', 'Yes, please.'] },
        { prompt: '"Would you mind if I opened the window?" — Best reply:', answer: 'Not at all, go ahead.', options: ['Not at all, go ahead.', 'Yes, I would mind opening it.', "I don't open windows.", 'The window is there.'] },
        { prompt: '"I\'m afraid I have some bad news." — You respond:', answer: "Oh no, what's happened?", options: ["Oh no, what's happened?", "That's great!", 'I have news too.', 'Afraid of what?'] },
        { prompt: '"Could you elaborate on your previous point about the budget?"', answer: 'Certainly. What I meant was that we need to reallocate funds towards R&D.', options: ['Certainly. What I meant was that we need to reallocate funds towards R&D.', 'No.', "The budget is big.", "I don't know about budgets."] },
        { prompt: '"What would you suggest we do about the declining sales figures?"', answer: "I'd recommend conducting a thorough market analysis before making any major changes.", options: ["I'd recommend conducting a thorough market analysis before making any major changes.", 'Sell more things.', "I don't know.", 'Sales are fine.'] },
        { prompt: '"Let\'s agree to disagree on this matter."', answer: "That's fair. Perhaps we can revisit this when we have more data.", options: ["That's fair. Perhaps we can revisit this when we have more data.", "No, I'm right.", 'OK bye.', 'I agree to disagree but actually I disagree.'] },
        { prompt: 'Your colleague says: "I feel like I\'m not making any progress at work."', answer: "I understand how that feels. Would it help to talk through your goals together?", options: ["I understand how that feels. Would it help to talk through your goals together?", 'Just work harder.', "That's your problem.", 'Me neither.'] },
        { prompt: '"In your opinion, to what extent has globalisation benefited developing economies?"', answer: "That's a nuanced issue. While globalisation has created opportunities, the benefits have been unevenly distributed.", options: ["That's a nuanced issue. While globalisation has created opportunities, the benefits have been unevenly distributed.", 'Globalisation is good.', "I don't follow politics.", 'Economies are complicated.'] },
      ],
    },
    'pronunciation-diagnostic': {
      type: 'fill-in', instruction: 'Choose the correct pronunciation or stress pattern.',
      items: [
        { prompt: 'Which word rhymes with "cat"?', answer: 'hat', options: ['hat', 'cut', 'cart', 'coat'] },
        { prompt: 'Where is the stress in "photograph"?', answer: 'PHO-to-graph', options: ['PHO-to-graph', 'pho-TO-graph', 'pho-to-GRAPH', 'All equal'] },
        { prompt: 'Which word has a silent letter? "knife", "spin", "desk", "jump"', answer: 'knife', options: ['knife', 'spin', 'desk', 'jump'] },
        { prompt: 'Where is the stress in "economics"?', answer: 'e-co-NO-mics', options: ['E-co-no-mics', 'e-CO-no-mics', 'e-co-NO-mics', 'e-co-no-MICS'] },
        { prompt: 'How many syllables in "comfortable"?', answer: '3', options: ['3', '4', '5', '2'] },
        { prompt: 'Which pair contains different vowel sounds? "ship/sheep", "bed/bed", "cat/cat"', answer: 'ship/sheep', options: ['ship/sheep', 'bed/bed', 'cat/cat', 'None of them'] },
        { prompt: 'The "th" in "think" is pronounced the same as in:', answer: 'thought', options: ['this', 'that', 'thought', 'the'] },
        { prompt: 'Where does the stress shift in "record" (noun) vs "record" (verb)?', answer: 'RE-cord (noun) / re-CORD (verb)', options: ['RE-cord (noun) / re-CORD (verb)', 'Both on first syllable', 'Both on second syllable', 'No difference'] },
      ],
    },
  },
};

const GOAL_WEIGHTS = {
  'general': { grammar: 0.15, vocabulary: 0.15, reading: 0.15, writing: 0.15, listening: 0.15, conversation: 0.15, pronunciation: 0.10 },
  'ielts':   { grammar: 0.12, vocabulary: 0.12, reading: 0.20, writing: 0.20, listening: 0.20, conversation: 0.08, pronunciation: 0.08 },
  'toefl':   { grammar: 0.10, vocabulary: 0.12, reading: 0.22, writing: 0.18, listening: 0.22, conversation: 0.08, pronunciation: 0.08 },
  'cambridge': { grammar: 0.18, vocabulary: 0.15, reading: 0.18, writing: 0.15, listening: 0.15, conversation: 0.12, pronunciation: 0.07 },
  'business':  { grammar: 0.10, vocabulary: 0.18, reading: 0.12, writing: 0.18, listening: 0.12, conversation: 0.20, pronunciation: 0.10 },
};

const ALL_SKILL_AREAS = ['grammar', 'vocabulary', 'reading', 'writing', 'listening', 'conversation', 'pronunciation'];
const CEFR_LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];

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
    createdAt: new Date().toISOString(),
    skillLevels: {},
    weeklyHours: 5,
    goal: 'general',
    schedule: [],
    assessments: [],
    skills: {},
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

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

function cefrToNum(level) { const idx = CEFR_LEVELS.indexOf(level); return idx >= 0 ? idx : 0; }

function numToCefr(n) { return CEFR_LEVELS[Math.max(0, Math.min(n, CEFR_LEVELS.length - 1))]; }

function scoreToCefr(score, total) {
  if (total <= 0) return 'a1';
  const pct = score / total;
  if (pct >= 0.90) return 'c2';
  if (pct >= 0.78) return 'c1';
  if (pct >= 0.65) return 'b2';
  if (pct >= 0.50) return 'b1';
  if (pct >= 0.35) return 'a2';
  return 'a1';
}

// Exercise generation

function generateDiagnosticExercise(area, count = 6) {
  const skill = area + '-diagnostic';
  const bank = ITEM_BANKS['diagnostic']?.[skill];
  if (!bank) return { error: `No item bank for diagnostic/${skill}` };
  const items = pick(bank.items, count);
  return { type: bank.type, skill, area, count: items.length, instruction: bank.instruction, items };
}

// Answer checking

function checkAnswer(expected, answer) {
  return norm(expected) === norm(answer);
}

// Public API

class Planner {
  getProfile(id) {
    const p = loadProfile(id);
    return {
      studentId: p.studentId,
      createdAt: p.createdAt,
      skillLevels: p.skillLevels,
      weeklyHours: p.weeklyHours,
      goal: p.goal,
      totalAssessments: p.assessments.length,
    };
  }

  setGoal(id, goal) {
    if (!GOAL_WEIGHTS[goal]) throw new Error(`Unknown goal: ${goal}. Valid: ${Object.keys(GOAL_WEIGHTS).join(', ')}`);
    const p = loadProfile(id);
    p.goal = goal;
    saveProfile(p);
    return { studentId: id, goal, weights: GOAL_WEIGHTS[goal] };
  }

  setHours(id, hours) {
    const h = Number(hours);
    if (!Number.isFinite(h) || h <= 0 || h > 80) throw new Error('Hours must be between 1 and 80 per week');
    const p = loadProfile(id);
    p.weeklyHours = h;
    saveProfile(p);
    return { studentId: id, weeklyHours: h };
  }

  runPlacement(id) {
    const exercises = {};
    let totalItems = 0;
    for (const area of ALL_SKILL_AREAS) {
      const ex = generateDiagnosticExercise(area, 7);
      if (!ex.error) {
        exercises[area] = ex;
        totalItems += ex.count;
      }
    }
    return {
      studentId: id,
      testType: 'placement',
      totalAreas: Object.keys(exercises).length,
      totalItems,
      instructions: 'Complete all sections. Results will determine your CEFR level per skill area.',
      exercises,
    };
  }

  generatePlan(id) {
    const p = loadProfile(id);
    const goal = p.goal || 'general';
    const hours = p.weeklyHours || 5;
    const weights = GOAL_WEIGHTS[goal];

    const plan = { studentId: id, goal, weeklyHours: hours, weeklySchedule: [], skillBreakdown: {} };

    // Determine weakest areas to prioritise
    const levelScores = {};
    for (const area of ALL_SKILL_AREAS) {
      const lvl = p.skillLevels[area] || 'a1';
      levelScores[area] = cefrToNum(lvl);
    }
    const minLevel = Math.min(...Object.values(levelScores));
    const maxLevel = Math.max(...Object.values(levelScores));
    const range = maxLevel - minLevel || 1;

    // Adjust weights: base weight + boost for weaker areas
    const adjustedWeights = {};
    let totalWeight = 0;
    for (const area of ALL_SKILL_AREAS) {
      const gap = maxLevel - levelScores[area];
      const boost = range > 0 ? (gap / range) * 0.15 : 0;
      adjustedWeights[area] = weights[area] + boost;
      totalWeight += adjustedWeights[area];
    }

    // Normalise and allocate hours
    for (const area of ALL_SKILL_AREAS) {
      const fraction = adjustedWeights[area] / totalWeight;
      const areaHours = Math.round(fraction * hours * 10) / 10;
      const lvl = p.skillLevels[area] || 'a1';
      plan.skillBreakdown[area] = {
        currentLevel: lvl,
        hoursPerWeek: areaHours,
        percentOfTime: Math.round(fraction * 100),
        priority: areaHours >= (hours / ALL_SKILL_AREAS.length) ? 'focus' : 'maintain',
      };
    }

    // Build day-by-day schedule (7 days)
    const dailyMinutes = Math.round((hours * 60) / 7);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sortedAreas = [...ALL_SKILL_AREAS].sort((a, b) =>
      (plan.skillBreakdown[b].hoursPerWeek - plan.skillBreakdown[a].hoursPerWeek)
    );

    for (let d = 0; d < 7; d++) {
      const primary = sortedAreas[d % sortedAreas.length];
      const secondary = sortedAreas[(d + 1) % sortedAreas.length];
      const entry = {
        day: days[d],
        totalMinutes: dailyMinutes,
        sessions: [
          { skill: primary, minutes: Math.round(dailyMinutes * 0.6), focus: plan.skillBreakdown[primary].currentLevel },
          { skill: secondary, minutes: Math.round(dailyMinutes * 0.4), focus: plan.skillBreakdown[secondary].currentLevel },
        ],
      };
      plan.weeklySchedule.push(entry);
    }

    // Save schedule to profile
    p.schedule = plan.weeklySchedule;
    saveProfile(p);

    return plan;
  }

  getDashboard(id) {
    const p = loadProfile(id);
    const overview = { studentId: id, goal: p.goal, weeklyHours: p.weeklyHours, totalAssessments: p.assessments.length };
    const skillSummary = {};
    let totalLevel = 0;
    let levelCount = 0;

    for (const area of ALL_SKILL_AREAS) {
      const lvl = p.skillLevels[area] || 'not-assessed';
      const key = `diagnostic/${area}/${area}-diagnostic`;
      const d = p.skills[key];
      skillSummary[area] = {
        level: lvl,
        mastery: d ? d.mastery : 0,
        label: d ? d.label : 'not-started',
        assessmentCount: d ? d.attempts.length : 0,
      };
      if (lvl !== 'not-assessed') {
        totalLevel += cefrToNum(lvl);
        levelCount++;
      }
    }

    overview.averageLevel = levelCount > 0 ? numToCefr(Math.round(totalLevel / levelCount)) : 'not-assessed';
    overview.skills = skillSummary;

    // Recent activity
    overview.recentAssessments = p.assessments.slice(-10).reverse();

    // Schedule
    overview.schedule = p.schedule || [];

    return overview;
  }

  adjustLevel(id, skill, level) {
    if (!ALL_SKILL_AREAS.includes(skill)) throw new Error(`Unknown skill area: ${skill}. Valid: ${ALL_SKILL_AREAS.join(', ')}`);
    if (!CEFR_LEVELS.includes(level)) throw new Error(`Unknown level: ${level}. Valid: ${CEFR_LEVELS.join(', ')}`);
    const p = loadProfile(id);
    p.skillLevels[skill] = level;
    saveProfile(p);
    return { studentId: id, skill, level, allLevels: { ...p.skillLevels } };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const results = {};
    let assessed = 0;

    for (const area of ALL_SKILL_AREAS) {
      const key = `diagnostic/${area}/${area}-diagnostic`;
      const d = p.skills[key];
      const lvl = p.skillLevels[area] || 'not-assessed';
      results[area] = {
        level: lvl,
        mastery: d ? d.mastery : 0,
        label: d ? d.label : 'not-started',
        attempts: d ? d.attempts.length : 0,
      };
      if (lvl !== 'not-assessed') assessed++;
    }

    return {
      studentId: id,
      assessedAreas: assessed,
      totalAreas: ALL_SKILL_AREAS.length,
      overallPct: Math.round((assessed / ALL_SKILL_AREAS.length) * 100),
      goal: p.goal,
      weeklyHours: p.weeklyHours,
      skills: results,
    };
  }

  getReport(id) {
    const p = loadProfile(id);
    const progress = this.getProgress(id);

    // Identify strengths and weaknesses
    const assessed = ALL_SKILL_AREAS.filter(a => p.skillLevels[a]);
    const sorted = assessed.sort((a, b) => cefrToNum(p.skillLevels[b]) - cefrToNum(p.skillLevels[a]));
    const strengths = sorted.slice(0, 2).map(a => ({ area: a, level: p.skillLevels[a] }));
    const weaknesses = sorted.slice(-2).reverse().map(a => ({ area: a, level: p.skillLevels[a] }));

    // Recommendations
    const recommendations = [];
    for (const area of ALL_SKILL_AREAS) {
      const lvl = p.skillLevels[area];
      if (!lvl) {
        recommendations.push(`Take the ${area} placement diagnostic to establish your level.`);
      } else if (cefrToNum(lvl) <= 1) {
        recommendations.push(`Focus on building foundational ${area} skills (current: ${lvl.toUpperCase()}).`);
      }
    }

    if (p.goal === 'ielts' || p.goal === 'toefl') {
      recommendations.push(`For ${p.goal.toUpperCase()} prep, prioritise reading and listening practice with timed exercises.`);
    } else if (p.goal === 'business') {
      recommendations.push('For business English, practise formal writing and professional conversation scenarios.');
    }

    return {
      studentId: id,
      goal: p.goal,
      weeklyHours: p.weeklyHours,
      progress,
      strengths,
      weaknesses,
      recommendations,
      recentAssessments: p.assessments.slice(-20).reverse(),
    };
  }

  recordAssessment(id, area, score, total, notes = '') {
    if (!ALL_SKILL_AREAS.includes(area)) throw new Error(`Unknown area: ${area}. Valid: ${ALL_SKILL_AREAS.join(', ')}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);

    const p = loadProfile(id);
    const skill = area + '-diagnostic';
    const category = area;
    const entry = { date: new Date().toISOString(), area, category, skill, score, total, notes };
    p.assessments.push(entry);

    const key = `diagnostic/${category}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);

    // Update CEFR level for this area
    p.skillLevels[area] = scoreToCefr(score, total);

    saveProfile(p);
    return {
      studentId: id,
      area,
      score: `${score}/${total}`,
      cefrLevel: p.skillLevels[area],
      mastery: p.skills[key].mastery,
      label: p.skills[key].label,
    };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }
}

module.exports = Planner;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const planner = new Planner();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id] = args;
        if (!id) throw new Error('Usage: start <id>');
        out({ action: 'start', profile: planner.getProfile(id) });
        break;
      }
      case 'placement': {
        const [, id] = args;
        if (!id) throw new Error('Usage: placement <id>');
        out(planner.runPlacement(id));
        break;
      }
      case 'plan': {
        const [, id] = args;
        if (!id) throw new Error('Usage: plan <id>');
        out(planner.generatePlan(id));
        break;
      }
      case 'dashboard': {
        const [, id] = args;
        if (!id) throw new Error('Usage: dashboard <id>');
        out(planner.getDashboard(id));
        break;
      }
      case 'adjust': {
        const [, id, skill, level] = args;
        if (!id || !skill || !level) throw new Error('Usage: adjust <id> <skill> <level>');
        out(planner.adjustLevel(id, skill, level));
        break;
      }
      case 'progress': {
        const [, id] = args;
        if (!id) throw new Error('Usage: progress <id>');
        out(planner.getProgress(id));
        break;
      }
      case 'report': {
        const [, id] = args;
        if (!id) throw new Error('Usage: report <id>');
        out(planner.getReport(id));
        break;
      }
      case 'set-goal': {
        const [, id, goal] = args;
        if (!id || !goal) throw new Error('Usage: set-goal <id> <goal>');
        out(planner.setGoal(id, goal));
        break;
      }
      case 'set-hours': {
        const [, id, hours] = args;
        if (!id || !hours) throw new Error('Usage: set-hours <id> <hours>');
        out(planner.setHours(id, Number(hours)));
        break;
      }
      case 'record': {
        const [, id, area, sc, tot, ...notes] = args;
        if (!id || !area || !sc || !tot) throw new Error('Usage: record <id> <area> <score> <total>');
        out(planner.recordAssessment(id, area, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'students': {
        out(planner.listStudents());
        break;
      }
      default:
        out({
          usage: 'node planner.js <command> [args]',
          commands: ['start', 'placement', 'plan', 'dashboard', 'adjust', 'progress', 'report', 'set-goal', 'set-hours', 'record', 'students'],
          goals: Object.keys(GOAL_WEIGHTS),
          skillAreas: ALL_SKILL_AREAS,
          cefrLevels: CEFR_LEVELS,
        });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
