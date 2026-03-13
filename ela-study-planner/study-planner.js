// eClaw ELA Study Planner & Progress Coach (K-6). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ela-study-planner');

const VALID_GRADES = ['kindergarten', 'grade-1', 'grade-2', 'grade-3', 'grade-4', 'grade-5', 'grade-6'];
const VALID_GOALS = ['catch-up', 'stay-strong', 'get-ahead', 'love-reading', 'writing-focus', 'test-prep'];

const SKILL_AREAS = [
  { key: 'phonics', label: 'Phonics & Decoding', dataDir: 'ela-phonics' },
  { key: 'readlit', label: 'Reading: Literature', dataDir: 'ela-reading-literature' },
  { key: 'readinfo', label: 'Reading: Informational', dataDir: 'ela-reading-informational' },
  { key: 'writing', label: 'Writing', dataDir: 'ela-writing' },
  { key: 'grammar', label: 'Grammar & Conventions', dataDir: 'ela-grammar' },
  { key: 'vocab', label: 'Vocabulary & Spelling', dataDir: 'ela-vocabulary' },
  { key: 'speak', label: 'Speaking & Listening', dataDir: 'ela-speaking-listening' },
];

// Time allocation percentages per goal: [phonics, readlit, readinfo, writing, grammar, vocab, speak]
const TIME_ALLOC = {
  'catch-up':      [25, 15, 10, 15, 15, 15, 5],
  'stay-strong':   [10, 20, 15, 20, 10, 15, 10],
  'get-ahead':     [5,  20, 15, 20, 10, 15, 15],
  'love-reading':  [5,  30, 20, 10,  5, 20, 10],
  'writing-focus': [5,  10, 10, 35, 15, 15, 10],
  'test-prep':     [10, 20, 20, 20, 10, 15,  5],
};

// ── Book Recommendations ──

const BOOK_RECS = {
  'kindergarten': [
    { title: 'The Very Hungry Caterpillar', author: 'Eric Carle', type: 'picture-book' },
    { title: 'Brown Bear, Brown Bear, What Do You See?', author: 'Bill Martin Jr.', type: 'picture-book' },
    { title: 'Chicka Chicka Boom Boom', author: 'Bill Martin Jr.', type: 'picture-book' },
    { title: 'Goodnight Moon', author: 'Margaret Wise Brown', type: 'picture-book' },
    { title: 'Pete the Cat: I Love My White Shoes', author: 'Eric Litwin', type: 'picture-book' },
    { title: 'Green Eggs and Ham', author: 'Dr. Seuss', type: 'easy-reader' },
    { title: 'Corduroy', author: 'Don Freeman', type: 'picture-book' },
    { title: 'The Snowy Day', author: 'Ezra Jack Keats', type: 'picture-book' },
  ],
  'grade-1': [
    { title: 'Elephant & Piggie series', author: 'Mo Willems', type: 'easy-reader' },
    { title: 'Frog and Toad Are Friends', author: 'Arnold Lobel', type: 'easy-reader' },
    { title: 'Henry and Mudge series', author: 'Cynthia Rylant', type: 'easy-reader' },
    { title: 'Biscuit series', author: 'Alyssa Satin Capucilli', type: 'easy-reader' },
    { title: 'Bob Books Set 1', author: 'Bobby Lynn Maslen', type: 'decodable' },
    { title: 'Mercy Watson series', author: 'Kate DiCamillo', type: 'early-chapter' },
    { title: 'Fly Guy series', author: 'Tedd Arnold', type: 'easy-reader' },
    { title: 'The Cat in the Hat', author: 'Dr. Seuss', type: 'easy-reader' },
  ],
  'grade-2': [
    { title: 'Magic Tree House series', author: 'Mary Pope Osborne', type: 'chapter-book' },
    { title: 'Junie B. Jones series', author: 'Barbara Park', type: 'chapter-book' },
    { title: 'Dog Man series', author: 'Dav Pilkey', type: 'graphic-novel' },
    { title: 'Owl Diaries series', author: 'Rebecca Elliott', type: 'chapter-book' },
    { title: 'Ivy + Bean series', author: 'Annie Barrows', type: 'chapter-book' },
    { title: 'Nate the Great series', author: 'Marjorie Weinman Sharmat', type: 'chapter-book' },
    { title: 'Who Was...? series', author: 'Various', type: 'nonfiction' },
    { title: 'National Geographic Readers', author: 'Various', type: 'nonfiction' },
  ],
  'grade-3': [
    { title: 'Diary of a Wimpy Kid', author: 'Jeff Kinney', type: 'chapter-book' },
    { title: 'The Bad Guys series', author: 'Aaron Blabey', type: 'graphic-novel' },
    { title: 'Wings of Fire series', author: 'Tui T. Sutherland', type: 'novel' },
    { title: 'Charlotte\'s Web', author: 'E.B. White', type: 'novel' },
    { title: 'Ramona Quimby, Age 8', author: 'Beverly Cleary', type: 'novel' },
    { title: 'Tales of a Fourth Grade Nothing', author: 'Judy Blume', type: 'novel' },
    { title: 'The One and Only Ivan', author: 'Katherine Applegate', type: 'novel' },
    { title: 'Catwings', author: 'Ursula K. Le Guin', type: 'chapter-book' },
  ],
  'grade-4': [
    { title: 'Percy Jackson and the Lightning Thief', author: 'Rick Riordan', type: 'novel' },
    { title: 'Wonder', author: 'R.J. Palacio', type: 'novel' },
    { title: 'Hatchet', author: 'Gary Paulsen', type: 'novel' },
    { title: 'Because of Winn-Dixie', author: 'Kate DiCamillo', type: 'novel' },
    { title: 'The Wild Robot', author: 'Peter Brown', type: 'novel' },
    { title: 'Esperanza Rising', author: 'Pam Munoz Ryan', type: 'novel' },
    { title: 'Shiloh', author: 'Phyllis Reynolds Naylor', type: 'novel' },
    { title: 'From the Mixed-Up Files of Mrs. Basil E. Frankweiler', author: 'E.L. Konigsburg', type: 'novel' },
  ],
  'grade-5': [
    { title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', type: 'novel' },
    { title: 'The Chronicles of Narnia: The Lion, the Witch and the Wardrobe', author: 'C.S. Lewis', type: 'novel' },
    { title: 'Holes', author: 'Louis Sachar', type: 'novel' },
    { title: 'Bridge to Terabithia', author: 'Katherine Paterson', type: 'novel' },
    { title: 'Tuck Everlasting', author: 'Natalie Babbitt', type: 'novel' },
    { title: 'The Crossover', author: 'Kwame Alexander', type: 'verse-novel' },
    { title: 'Number the Stars', author: 'Lois Lowry', type: 'novel' },
    { title: 'A Wrinkle in Time', author: 'Madeleine L\'Engle', type: 'novel' },
  ],
  'grade-6': [
    { title: 'The Giver', author: 'Lois Lowry', type: 'novel' },
    { title: 'Bud, Not Buddy', author: 'Christopher Paul Curtis', type: 'novel' },
    { title: 'Roll of Thunder, Hear My Cry', author: 'Mildred D. Taylor', type: 'novel' },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', type: 'novel' },
    { title: 'Island of the Blue Dolphins', author: 'Scott O\'Dell', type: 'novel' },
    { title: 'Maniac Magee', author: 'Jerry Spinelli', type: 'novel' },
    { title: 'The Phantom Tollbooth', author: 'Norton Juster', type: 'novel' },
    { title: 'Brown Girl Dreaming', author: 'Jacqueline Woodson', type: 'verse-novel' },
  ],
};

// ── Assessment Question Banks (per skill area, per grade band) ──

const ASSESS_QUESTIONS = {
  phonics: {
    'kindergarten': [
      { q: 'What sound does the letter B make?', a: '/b/', type: 'open' },
      { q: 'What sound does the letter M make?', a: '/m/', type: 'open' },
      { q: 'Which word rhymes with "cat"?', options: ['dog', 'bat', 'cup'], a: 'bat', type: 'choice' },
      { q: 'What is the first sound in "sun"?', a: '/s/', type: 'open' },
    ],
    'grade-1': [
      { q: 'Read this word: "ship". What are the sounds?', a: '/sh/ /i/ /p/', type: 'open' },
      { q: 'Which word has a long a sound?', options: ['cat', 'cake', 'cap'], a: 'cake', type: 'choice' },
      { q: 'What word do you get when you blend /ch/ /i/ /n/?', a: 'chin', type: 'open' },
    ],
    'grade-2': [
      { q: 'Read this word: "knight". What is the silent letter?', a: 'k', type: 'open' },
      { q: 'Split "rabbit" into syllables.', a: 'rab-bit', type: 'open' },
      { q: 'Which word has the /oi/ sound?', options: ['coin', 'cone', 'can'], a: 'coin', type: 'choice' },
    ],
    'grade-3': [
      { q: 'What does the prefix "un-" mean in "unhappy"?', a: 'not', type: 'open' },
      { q: 'What is the root word in "playing"?', a: 'play', type: 'open' },
      { q: 'How many syllables in "beautiful"?', a: '3', type: 'open' },
    ],
  },
  readlit: {
    'kindergarten': [
      { q: 'In a story about a lost puppy who finds its way home, who is the main character?', a: 'the puppy', type: 'open' },
      { q: 'What happened at the end of the story?', a: 'The puppy found its way home.', type: 'open' },
    ],
    'grade-1': [
      { q: 'What is the problem the main character faces?', a: 'open-ended', type: 'open' },
      { q: 'How does the character feel at the beginning vs. the end?', a: 'open-ended', type: 'open' },
    ],
    'grade-2': [
      { q: 'What is the main idea of this story?', a: 'open-ended', type: 'open' },
      { q: 'Compare the two main characters. How are they alike or different?', a: 'open-ended', type: 'open' },
    ],
    'grade-3': [
      { q: 'What is the theme or lesson of this story?', a: 'open-ended', type: 'open' },
      { q: 'From whose point of view is the story told?', a: 'open-ended', type: 'open' },
    ],
    'grade-4': [
      { q: 'Summarize the passage in 2-3 sentences.', a: 'open-ended', type: 'open' },
      { q: 'What inference can you make based on the character\'s actions?', a: 'open-ended', type: 'open' },
    ],
    'grade-5': [
      { q: 'How does the main character respond to the central challenge?', a: 'open-ended', type: 'open' },
      { q: 'Compare two texts on a similar topic. How are their approaches different?', a: 'open-ended', type: 'open' },
    ],
    'grade-6': [
      { q: 'How does the author develop the theme across the text?', a: 'open-ended', type: 'open' },
      { q: 'Evaluate the strength of the author\'s argument. What evidence supports it?', a: 'open-ended', type: 'open' },
    ],
  },
  grammar: {
    'kindergarten': [
      { q: 'Fix this sentence: "the cat sat"', a: 'The cat sat.', type: 'open' },
      { q: 'Which is correct?', options: ['i like dogs.', 'I like dogs.'], a: 'I like dogs.', type: 'choice' },
    ],
    'grade-1': [
      { q: 'Is "dog" a common or proper noun?', a: 'common', type: 'open' },
      { q: 'What is the past tense of "run"?', a: 'ran', type: 'open' },
    ],
    'grade-2': [
      { q: 'Make this sentence complete: "The big dog"', a: 'open-ended', type: 'open' },
      { q: 'What is the plural of "child"?', a: 'children', type: 'open' },
    ],
    'grade-3': [
      { q: 'Add quotation marks: She said I love reading', a: 'She said, "I love reading."', type: 'open' },
      { q: 'Choose: The dogs (is/are) playing.', a: 'are', type: 'open' },
    ],
    'grade-4': [
      { q: 'Fix the fragment: "Running through the park."', a: 'open-ended', type: 'open' },
      { q: 'Add a comma: "I like reading and she likes writing."', a: 'I like reading, and she likes writing.', type: 'open' },
    ],
    'grade-5': [
      { q: 'What is the perfect tense of "I walk"?', a: 'I have walked', type: 'open' },
      { q: 'Use "not only...but also" in a sentence.', a: 'open-ended', type: 'open' },
    ],
    'grade-6': [
      { q: 'Identify the pronoun case: "She gave the book to him." What case is "him"?', a: 'objective', type: 'open' },
      { q: 'Rewrite with varied sentence structure: "I went to the store. I bought milk. I came home."', a: 'open-ended', type: 'open' },
    ],
  },
  vocab: {
    'kindergarten': [
      { q: 'What is the opposite of "big"?', a: 'small', type: 'open' },
      { q: 'Sort: Which is a color?', options: ['red', 'fast', 'happy'], a: 'red', type: 'choice' },
    ],
    'grade-1': [
      { q: 'What does "tiny" mean?', a: 'very small', type: 'open' },
      { q: 'Use "happy" in a sentence.', a: 'open-ended', type: 'open' },
    ],
    'grade-2': [
      { q: 'What does the prefix "re-" mean in "redo"?', a: 'again', type: 'open' },
      { q: 'What is a synonym for "glad"?', a: 'happy', type: 'open' },
    ],
    'grade-3': [
      { q: 'What does "enormous" mean?', a: 'very large', type: 'open' },
      { q: 'Use context clues: "The arid desert had no water." What does "arid" mean?', a: 'dry', type: 'open' },
    ],
    'grade-4': [
      { q: 'What does the Greek root "graph" mean?', a: 'write', type: 'open' },
      { q: 'What is an antonym of "generous"?', a: 'selfish', type: 'open' },
    ],
    'grade-5': [
      { q: 'Use "reluctant" in a sentence.', a: 'open-ended', type: 'open' },
      { q: 'What does the Latin root "dict" mean?', a: 'say/speak', type: 'open' },
    ],
    'grade-6': [
      { q: 'What is the connotation of "thrifty" vs. "cheap"?', a: 'Thrifty is positive, cheap is negative.', type: 'open' },
      { q: 'Define "ambiguous" and use it in a sentence.', a: 'open-ended', type: 'open' },
    ],
  },
  writing: {
    'kindergarten': [
      { q: 'Draw and write about your favorite animal. Use at least 3 words.', a: 'open-ended', type: 'open' },
    ],
    'grade-1': [
      { q: 'Write 3 sentences about your favorite food. Include a beginning, middle, and end.', a: 'open-ended', type: 'open' },
    ],
    'grade-2': [
      { q: 'Write a paragraph about your favorite season. Start with a topic sentence.', a: 'open-ended', type: 'open' },
    ],
    'grade-3': [
      { q: 'Write a short opinion piece: What is the best pet and why? Include an introduction and conclusion.', a: 'open-ended', type: 'open' },
    ],
    'grade-4': [
      { q: 'Write a multi-paragraph piece explaining how to do something you are good at. Use transition words.', a: 'open-ended', type: 'open' },
    ],
    'grade-5': [
      { q: 'Write a short essay with a thesis statement, two supporting paragraphs, and a conclusion.', a: 'open-ended', type: 'open' },
    ],
    'grade-6': [
      { q: 'Write an argumentative paragraph: Should students have homework? Include a claim, evidence, and reasoning.', a: 'open-ended', type: 'open' },
    ],
  },
  readinfo: {
    'kindergarten': [
      { q: 'Look at this book cover about dogs. What do you think this book will teach us?', a: 'open-ended', type: 'open' },
    ],
    'grade-1': [
      { q: 'After reading about penguins: What is one fact you learned?', a: 'open-ended', type: 'open' },
    ],
    'grade-2': [
      { q: 'What is the main idea of this article about weather?', a: 'open-ended', type: 'open' },
    ],
    'grade-3': [
      { q: 'What text features help you understand this article? (headings, captions, etc.)', a: 'open-ended', type: 'open' },
    ],
    'grade-4': [
      { q: 'Summarize the main argument of this passage in your own words.', a: 'open-ended', type: 'open' },
    ],
    'grade-5': [
      { q: 'Compare the information from two sources on the same topic. Which is more reliable and why?', a: 'open-ended', type: 'open' },
    ],
    'grade-6': [
      { q: 'Evaluate the author\'s use of evidence. Is the argument convincing? Why or why not?', a: 'open-ended', type: 'open' },
    ],
  },
  speak: {
    'kindergarten': [
      { q: 'Tell me about your favorite toy. What does it look like?', a: 'open-ended', type: 'open' },
    ],
    'grade-1': [
      { q: 'Describe what happened in a story you heard. Use details.', a: 'open-ended', type: 'open' },
    ],
    'grade-2': [
      { q: 'Retell a story in order: first, next, then, finally.', a: 'open-ended', type: 'open' },
    ],
    'grade-3': [
      { q: 'Give a short presentation about something you know a lot about. Speak clearly and make eye contact.', a: 'open-ended', type: 'open' },
    ],
    'grade-4': [
      { q: 'Summarize a passage you read and explain your opinion about it. Support with reasons.', a: 'open-ended', type: 'open' },
    ],
    'grade-5': [
      { q: 'Lead a short discussion about a topic. Ask questions to keep the conversation going.', a: 'open-ended', type: 'open' },
    ],
    'grade-6': [
      { q: 'Present an argument for or against a topic. Use formal language and evidence.', a: 'open-ended', type: 'open' },
    ],
  },
};

// ── Day labels for plans ──

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// ── File I/O ──

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
    goal: null,
    dailyBudget: 30,
    readingFeeling: null,
    writingFeeling: null,
    favoriteGenre: null,
    vision: null,
    strengths: [],
    gaps: [],
    createdAt: new Date().toISOString(),
    readingLog: [],
    plans: [],
    assessments: [],
  };
}

function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }

// ── Helpers ──

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }

function gradeIndex(g) { return VALID_GRADES.indexOf(g); }

function adjustPhonicsForGrade(alloc, grade) {
  // K-2 get extra phonics time regardless of goal
  const gi = gradeIndex(grade);
  if (gi <= 2 && alloc[0] < 20) {
    const boost = 20 - alloc[0];
    const result = [...alloc];
    result[0] = 20;
    // Reduce from speak and readinfo proportionally
    let remaining = boost;
    for (const idx of [6, 2]) {
      const take = Math.min(remaining, Math.floor(result[idx] / 2));
      result[idx] -= take;
      remaining -= take;
    }
    if (remaining > 0) result[5] = Math.max(0, result[5] - remaining);
    return result;
  }
  // Grade 4+ can drop phonics
  if (gi >= 4 && alloc[0] > 5) {
    const freed = alloc[0] - 5;
    const result = [...alloc];
    result[0] = 5;
    result[3] += freed; // give to writing
    return result;
  }
  return alloc;
}

function allocateMinutes(budget, percents) {
  const raw = percents.map(p => budget * p / 100);
  const floored = raw.map(v => Math.floor(v));
  let leftover = budget - floored.reduce((a, b) => a + b, 0);
  const fracs = raw.map((v, i) => ({ i, f: v - floored[i] })).sort((a, b) => b.f - a.f);
  for (const { i } of fracs) {
    if (leftover <= 0) break;
    floored[i]++;
    leftover--;
  }
  return floored;
}

// ── Plan Generation ──

function generateWeeklyPlan(profile) {
  const goal = profile.goal || 'stay-strong';
  const grade = profile.grade || 'kindergarten';
  const budget = profile.dailyBudget || 30;

  const baseAlloc = TIME_ALLOC[goal] || TIME_ALLOC['stay-strong'];
  const adjAlloc = adjustPhonicsForGrade(baseAlloc, grade);
  const weeklyMinutes = allocateMinutes(budget * 5, adjAlloc);

  // Build 5-day schedule distributing minutes across days
  const days = [];
  const remaining = [...weeklyMinutes];

  for (let d = 0; d < 5; d++) {
    const dayBudget = budget;
    const slots = [];
    let dayRemaining = dayBudget;

    // Friday is free reading day
    if (d === 4) {
      const readTime = Math.round(dayBudget * 0.7);
      const respTime = dayBudget - readTime;
      days.push({
        day: DAY_NAMES[d],
        label: 'Free Reading Friday',
        slots: [
          { skill: 'Free Choice Reading', minutes: readTime },
          { skill: 'Reading Response / Journal', minutes: respTime },
        ],
        totalMinutes: dayBudget,
      });
      // Deduct from readlit
      remaining[1] = Math.max(0, remaining[1] - readTime);
      remaining[3] = Math.max(0, remaining[3] - respTime); // response counts as writing
      continue;
    }

    // For Mon-Thu, pick the 2-3 skills with the most remaining minutes
    const ranked = SKILL_AREAS.map((s, i) => ({ ...s, idx: i, rem: remaining[i] }))
      .filter(s => s.rem > 0)
      .sort((a, b) => b.rem - a.rem);

    const slotCount = dayBudget >= 40 ? 3 : 2;
    const chosen = ranked.slice(0, slotCount);
    const perSlot = Math.floor(dayBudget / chosen.length);
    let extra = dayBudget - perSlot * chosen.length;

    for (const c of chosen) {
      const mins = perSlot + (extra > 0 ? 1 : 0);
      if (extra > 0) extra--;
      const actual = Math.min(mins, c.rem);
      slots.push({ skill: c.label, minutes: actual });
      remaining[c.idx] -= actual;
      dayRemaining -= actual;
    }

    days.push({ day: DAY_NAMES[d], slots, totalMinutes: dayBudget - dayRemaining });
  }

  const plan = {
    weekOf: new Date().toISOString().slice(0, 10),
    goal,
    grade,
    dailyBudget: budget,
    allocation: SKILL_AREAS.map((s, i) => ({ skill: s.label, percent: adjAlloc[i], weeklyMinutes: weeklyMinutes[i] })),
    days,
  };

  return plan;
}

// ── Progress Aggregation ──

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
      for (const [, info] of Object.entries(skills)) {
        if (info.mastery !== undefined) { totalMastery += info.mastery; count++; }
      }
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
      label: area.label,
      found: scan.found,
      mastery: studentData ? studentData.avgMastery : 0,
      assessments: studentData ? studentData.assessments : 0,
      lastActivity: studentData ? studentData.lastActivity : null,
      status: !studentData ? 'no-data'
        : studentData.avgMastery >= 90 ? 'strong'
        : studentData.avgMastery >= 80 ? 'on-track'
        : studentData.avgMastery >= 60 ? 'growing'
        : 'needs-work',
    };
    if (studentData) {
      overallTotal++;
      if (studentData.avgMastery >= 80) overallMastered++;
    }
  }

  return { studentId, skills: results, areasWithData: overallTotal, areasOnTrack: overallMastered };
}

// ── Assessment Routing ──

function generateAssessment(studentId, grade) {
  grade = grade || 'kindergarten';
  const questions = {};
  for (const area of SKILL_AREAS) {
    const bank = ASSESS_QUESTIONS[area.key];
    if (!bank) continue;
    // Find closest grade band with questions
    let g = grade;
    if (!bank[g]) {
      // Fall back to nearest available grade
      const gi = gradeIndex(grade);
      for (let d = 0; d <= 6; d++) {
        if (gi - d >= 0 && bank[VALID_GRADES[gi - d]]) { g = VALID_GRADES[gi - d]; break; }
        if (gi + d < VALID_GRADES.length && bank[VALID_GRADES[gi + d]]) { g = VALID_GRADES[gi + d]; break; }
      }
    }
    const items = bank[g];
    if (items && items.length) {
      questions[area.key] = { label: area.label, grade: g, questions: pick(items, 2) };
    }
  }
  return { studentId, assessmentGrade: grade, areas: questions, instructions: 'Present questions one at a time. Record scores using: record <id> <area> <score> <total>' };
}

// ── Reading Log ──

function addReadingLogEntry(profile, title, pages, notes) {
  const entry = {
    date: new Date().toISOString().slice(0, 10),
    title,
    pages: Number(pages) || 0,
    notes: notes || '',
  };
  profile.readingLog.push(entry);
  return entry;
}

function getReadingLogSummary(profile) {
  const log = profile.readingLog || [];
  const totalPages = log.reduce((s, e) => s + (e.pages || 0), 0);
  const uniqueBooks = [...new Set(log.map(e => e.title))];
  const now = new Date();
  const thisMonth = log.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthPages = thisMonth.reduce((s, e) => s + (e.pages || 0), 0);
  return {
    totalEntries: log.length,
    totalPages,
    uniqueBooks: uniqueBooks.length,
    bookTitles: uniqueBooks,
    thisMonth: { entries: thisMonth.length, pages: monthPages },
    recentEntries: log.slice(-10).reverse(),
  };
}

// ── Public API ──

class StudyPlanner {
  start(id, grade) {
    const p = loadProfile(id);
    if (grade) {
      if (!VALID_GRADES.includes(grade)) throw new Error(`Unknown grade: ${grade}. Valid: ${VALID_GRADES.join(', ')}`);
      p.grade = grade;
    }
    if (!p.grade) p.grade = 'kindergarten';
    if (!p.goal) p.goal = 'stay-strong';
    saveProfile(p);
    return {
      action: 'start',
      profile: {
        studentId: p.studentId,
        grade: p.grade,
        goal: p.goal,
        dailyBudget: p.dailyBudget,
        readingFeeling: p.readingFeeling,
        writingFeeling: p.writingFeeling,
        strengths: p.strengths,
        gaps: p.gaps,
        createdAt: p.createdAt,
      },
      prompt: 'Welcome! Use set-goal and set-budget to customize your plan, then run plan to generate your weekly schedule.',
    };
  }

  setGoal(id, goal) {
    if (!VALID_GOALS.includes(goal)) throw new Error(`Unknown goal: ${goal}. Valid: ${VALID_GOALS.join(', ')}`);
    const p = loadProfile(id);
    p.goal = goal;
    saveProfile(p);
    return { studentId: id, goal };
  }

  setBudget(id, minutes) {
    const m = Number(minutes);
    if (!m || m < 10 || m > 120) throw new Error('Budget must be 10-120 minutes.');
    const p = loadProfile(id);
    p.dailyBudget = m;
    saveProfile(p);
    return { studentId: id, dailyBudget: m };
  }

  setProfile(id, field, value) {
    const p = loadProfile(id);
    const allowed = ['readingFeeling', 'writingFeeling', 'favoriteGenre', 'vision', 'strengths', 'gaps'];
    if (!allowed.includes(field)) throw new Error(`Field must be one of: ${allowed.join(', ')}`);
    if (field === 'strengths' || field === 'gaps') {
      p[field] = String(value).split(',').map(s => s.trim()).filter(Boolean);
    } else if (field === 'readingFeeling' || field === 'writingFeeling') {
      const n = Number(value);
      if (n < 1 || n > 5) throw new Error('Feeling must be 1-5.');
      p[field] = n;
    } else {
      p[field] = String(value);
    }
    saveProfile(p);
    return { studentId: id, [field]: p[field] };
  }

  plan(id) {
    const p = loadProfile(id);
    if (!p.grade) throw new Error('Set grade first: start <id> <grade>');
    const plan = generateWeeklyPlan(p);
    p.plans.push({ generated: new Date().toISOString(), plan });
    saveProfile(p);
    return plan;
  }

  progress(id) {
    const p = loadProfile(id);
    const agg = aggregateProgress(id);
    const logSummary = getReadingLogSummary(p);
    return {
      studentId: id,
      grade: p.grade,
      goal: p.goal,
      skills: agg.skills,
      areasWithData: agg.areasWithData,
      areasOnTrack: agg.areasOnTrack,
      readingLog: logSummary,
    };
  }

  assess(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    return generateAssessment(id, grade);
  }

  recordAssessment(id, area, score, total) {
    const validAreas = SKILL_AREAS.map(s => s.key);
    if (!validAreas.includes(area)) throw new Error(`Unknown area: ${area}. Valid: ${validAreas.join(', ')}`);
    const sc = Number(score), tot = Number(total);
    if (!tot || tot <= 0) throw new Error('total must be positive');
    if (sc < 0 || sc > tot) throw new Error(`score must be 0-${tot}`);

    const p = loadProfile(id);
    const entry = { date: new Date().toISOString(), area, score: sc, total: tot, pct: Math.round(sc / tot * 100) };
    p.assessments.push(entry);

    // Update strengths/gaps based on assessment results
    const pct = entry.pct;
    const label = SKILL_AREAS.find(s => s.key === area).label;
    if (pct >= 80 && !p.strengths.includes(label)) {
      p.strengths = [...new Set([...p.strengths, label])];
      p.gaps = p.gaps.filter(g => g !== label);
    } else if (pct < 60 && !p.gaps.includes(label)) {
      p.gaps = [...new Set([...p.gaps, label])];
      p.strengths = p.strengths.filter(s => s !== label);
    }

    saveProfile(p);
    return { studentId: id, recorded: entry, strengths: p.strengths, gaps: p.gaps };
  }

  readingLog(id, title, pages, notes) {
    const p = loadProfile(id);
    if (!title) {
      // Just show the log
      return { studentId: id, log: getReadingLogSummary(p) };
    }
    const entry = addReadingLogEntry(p, title, pages, notes);
    saveProfile(p);
    return { studentId: id, added: entry, summary: getReadingLogSummary(p) };
  }

  bookRecommend(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const books = BOOK_RECS[grade] || BOOK_RECS['grade-3'];
    const alreadyRead = (p.readingLog || []).map(e => e.title.toLowerCase());
    const unread = books.filter(b => !alreadyRead.includes(b.title.toLowerCase()));
    const recs = pick(unread.length ? unread : books, 3);
    return { studentId: id, grade, recommendations: recs };
  }

  report(id) {
    const p = loadProfile(id);
    const agg = aggregateProgress(id);
    const logSummary = getReadingLogSummary(p);
    const recentAssess = (p.assessments || []).slice(-10).reverse();
    const latestPlan = p.plans && p.plans.length ? p.plans[p.plans.length - 1].plan : null;
    return {
      studentId: id,
      grade: p.grade,
      goal: p.goal,
      dailyBudget: p.dailyBudget,
      readingFeeling: p.readingFeeling,
      writingFeeling: p.writingFeeling,
      strengths: p.strengths,
      gaps: p.gaps,
      skills: agg.skills,
      areasWithData: agg.areasWithData,
      areasOnTrack: agg.areasOnTrack,
      readingLog: logSummary,
      recentAssessments: recentAssess,
      currentPlan: latestPlan,
    };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }
}

module.exports = StudyPlanner;

// CLI
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
        const [, id] = args;
        if (!id) throw new Error('Usage: assess <id>');
        out(sp.assess(id));
        break;
      }
      case 'record': {
        const [, id, area, score, total] = args;
        if (!id || !area || score === undefined || !total) throw new Error('Usage: record <id> <area> <score> <total>');
        out(sp.recordAssessment(id, area, Number(score), Number(total)));
        break;
      }
      case 'reading-log': {
        const [, id, title, pages, ...notes] = args;
        if (!id) throw new Error('Usage: reading-log <id> [title] [pages] [notes...]');
        out(sp.readingLog(id, title, pages ? Number(pages) : undefined, notes.join(' ') || undefined));
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
        out(sp.setBudget(id, Number(mins)));
        break;
      }
      case 'set-profile': {
        const [, id, field, ...val] = args;
        if (!id || !field || !val.length) throw new Error('Usage: set-profile <id> <field> <value>');
        out(sp.setProfile(id, field, val.join(' ')));
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
        const [, id] = args;
        if (!id) throw new Error('Usage: book-recommend <id>');
        out(sp.bookRecommend(id));
        break;
      }
      default:
        out({
          usage: 'node study-planner.js <command> [args]',
          commands: ['start', 'plan', 'progress', 'assess', 'record', 'reading-log', 'set-goal', 'set-budget', 'set-profile', 'report', 'students', 'book-recommend'],
          goals: VALID_GOALS,
          grades: VALID_GRADES,
        });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
