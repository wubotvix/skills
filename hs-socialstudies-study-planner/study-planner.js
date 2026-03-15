// eClaw HS Social Studies Study Planner & Coach (Grades 9-12). No deps. Coordinator skill.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-socialstudies-study-planner');
const MASTERY_THRESHOLD = 0.8;

const SUBJECTS = {
  'us-history': {
    skills: ['colonial-period', 'revolution-founding', 'civil-war-reconstruction', 'industrialization-gilded-age', 'progressive-era', 'world-wars', 'cold-war', 'civil-rights-movement', 'modern-america'],
    courses: ['us-history', 'ap-us-history'],
    apExam: 'AP US History',
  },
  'world-history': {
    skills: ['ancient-civilizations', 'classical-empires', 'medieval-world', 'age-of-exploration', 'revolution-nationalism', 'imperialism', 'world-wars-global', 'cold-war-decolonization', 'globalization'],
    courses: ['world-history', 'ap-world-history'],
    apExam: 'AP World History',
  },
  'government': {
    skills: ['political-philosophy', 'constitution-federalism', 'three-branches', 'civil-liberties', 'civil-rights', 'political-parties-elections', 'public-policy', 'comparative-government'],
    courses: ['government', 'ap-government'],
    apExam: 'AP US Government & Politics',
  },
  'economics': {
    skills: ['economic-fundamentals', 'supply-demand', 'market-structures', 'macroeconomics', 'fiscal-policy', 'monetary-policy', 'international-trade', 'personal-finance'],
    courses: ['economics', 'ap-economics'],
    apExam: 'AP Macroeconomics / Microeconomics',
  },
  'geography': {
    skills: ['spatial-thinking', 'physical-geography', 'human-geography', 'cultural-geography', 'political-geography', 'economic-geography', 'environmental-geography', 'geospatial-technology'],
    courses: ['geography', 'ap-human-geography'],
    apExam: 'AP Human Geography',
  },
  'current-events': {
    skills: ['news-analysis', 'media-literacy', 'domestic-policy', 'foreign-policy', 'global-issues', 'civic-participation'],
    courses: ['current-events', 'media-literacy'],
    apExam: null,
  },
  'inquiry': {
    skills: ['historical-analysis', 'source-evaluation', 'argumentation', 'research-methodology', 'interdisciplinary-connections', 'civic-action'],
    courses: ['all-social-studies'],
    apExam: null,
  },
};

const GRADE_EXPECTATIONS = {
  '9': { typical: ['world-history', 'geography'], advanced: ['ap-human-geography'], focus: ['world-history', 'geography', 'inquiry'] },
  '10': { typical: ['us-history'], advanced: ['ap-us-history'], focus: ['us-history', 'geography', 'inquiry'] },
  '11': { typical: ['us-history', 'government'], advanced: ['ap-us-history', 'ap-government'], focus: ['us-history', 'government', 'economics', 'inquiry'] },
  '12': { typical: ['government', 'economics'], advanced: ['ap-government', 'ap-economics'], focus: ['government', 'economics', 'current-events', 'inquiry'] },
};

const AP_EXAM_INFO = {
  'AP US History': { subjects: ['us-history', 'inquiry'], weight: { 'us-history': 0.7, 'inquiry': 0.3 }, format: 'Multiple choice, short answer, DBQ, long essay' },
  'AP World History': { subjects: ['world-history', 'inquiry'], weight: { 'world-history': 0.7, 'inquiry': 0.3 }, format: 'Multiple choice, short answer, DBQ, long essay' },
  'AP US Government & Politics': { subjects: ['government', 'current-events', 'inquiry'], weight: { 'government': 0.6, 'current-events': 0.2, 'inquiry': 0.2 }, format: 'Multiple choice, FRQs (concept application, SCOTUS comparison, argument essay, quantitative analysis)' },
  'AP Macroeconomics / Microeconomics': { subjects: ['economics'], weight: { 'economics': 1.0 }, format: 'Multiple choice, free response (graphs, analysis)' },
  'AP Human Geography': { subjects: ['geography', 'current-events'], weight: { 'geography': 0.8, 'current-events': 0.2 }, format: 'Multiple choice, free response (stimulus-based)' },
};

const DIAGNOSTIC_QUESTIONS = {
  'us-history': [
    { prompt: 'What document declared American independence from Britain?', answer: 'Declaration of Independence', difficulty: 'basic' },
    { prompt: 'What was the primary cause of the Civil War?', answer: 'slavery', difficulty: 'basic' },
    { prompt: 'What constitutional amendment abolished slavery?', answer: '13th', difficulty: 'intermediate' },
    { prompt: 'What was the significance of Brown v. Board of Education?', answer: 'desegregation', difficulty: 'intermediate' },
    { prompt: 'How did the New Deal change the relationship between government and citizens?', answer: 'expanded federal role', difficulty: 'advanced' },
  ],
  'world-history': [
    { prompt: 'What ancient civilization built the pyramids?', answer: 'Egypt', difficulty: 'basic' },
    { prompt: 'What was the Renaissance?', answer: 'cultural rebirth', difficulty: 'basic' },
    { prompt: 'What were the main causes of World War I?', answer: 'MAIN (militarism, alliances, imperialism, nationalism)', difficulty: 'intermediate' },
    { prompt: 'How did the Columbian Exchange transform the world?', answer: 'exchange of plants, animals, diseases', difficulty: 'intermediate' },
    { prompt: 'What is the significance of the Treaty of Westphalia (1648)?', answer: 'sovereignty and nation-states', difficulty: 'advanced' },
  ],
  'government': [
    { prompt: 'What are the three branches of US government?', answer: 'legislative, executive, judicial', difficulty: 'basic' },
    { prompt: 'What is the Bill of Rights?', answer: 'first ten amendments', difficulty: 'basic' },
    { prompt: 'What is judicial review and which case established it?', answer: 'Marbury v. Madison', difficulty: 'intermediate' },
    { prompt: 'How does federalism divide power?', answer: 'national and state governments', difficulty: 'intermediate' },
    { prompt: 'Compare and contrast presidential and parliamentary systems.', answer: 'separation vs fusion of powers', difficulty: 'advanced' },
  ],
  'economics': [
    { prompt: 'What is scarcity?', answer: 'unlimited wants, limited resources', difficulty: 'basic' },
    { prompt: 'What happens to demand when price increases?', answer: 'decreases', difficulty: 'basic' },
    { prompt: 'What is GDP?', answer: 'total value of goods and services', difficulty: 'intermediate' },
    { prompt: 'How does the Federal Reserve control the money supply?', answer: 'open market operations', difficulty: 'intermediate' },
    { prompt: 'Explain the relationship between unemployment and inflation (Phillips Curve).', answer: 'inverse relationship', difficulty: 'advanced' },
  ],
  'geography': [
    { prompt: 'What is the difference between latitude and longitude?', answer: 'north-south vs east-west', difficulty: 'basic' },
    { prompt: 'What causes seasons on Earth?', answer: 'tilted axis', difficulty: 'basic' },
    { prompt: 'What is the demographic transition model?', answer: 'stages of population change', difficulty: 'intermediate' },
    { prompt: 'Explain the rain shadow effect.', answer: 'dry leeward side of mountains', difficulty: 'intermediate' },
    { prompt: 'How does Wallerstein\'s world systems theory explain global inequality?', answer: 'core-periphery exploitation', difficulty: 'advanced' },
  ],
  'current-events': [
    { prompt: 'What is the difference between a fact and an opinion in news?', answer: 'verifiable vs judgment', difficulty: 'basic' },
    { prompt: 'What is media bias?', answer: 'slanted reporting', difficulty: 'basic' },
    { prompt: 'What is the Paris Climate Agreement?', answer: 'international climate accord', difficulty: 'intermediate' },
    { prompt: 'How do social media algorithms affect news consumption?', answer: 'filter bubbles', difficulty: 'intermediate' },
    { prompt: 'Analyze the tension between national sovereignty and international cooperation.', answer: 'tradeoff between independence and collective action', difficulty: 'advanced' },
  ],
  'inquiry': [
    { prompt: 'What is the difference between a primary and secondary source?', answer: 'firsthand vs analysis', difficulty: 'basic' },
    { prompt: 'What makes a good thesis statement?', answer: 'arguable claim with evidence', difficulty: 'basic' },
    { prompt: 'What is corroboration in historical research?', answer: 'cross-checking sources', difficulty: 'intermediate' },
    { prompt: 'What is the difference between correlation and causation?', answer: 'correlation does not prove causation', difficulty: 'intermediate' },
    { prompt: 'Design a research question for a Document-Based Question analysis.', answer: 'open-ended, evidence-based, significant', difficulty: 'advanced' },
  ],
};

const STUDY_STRATEGIES = {
  'visual': [
    'Create timeline charts connecting events across subjects',
    'Use concept maps to link government structures to historical developments',
    'Draw comparison charts for economic systems, political systems, and cultural movements',
    'Map geographic connections to historical events and economic patterns',
    'Create infographics summarizing key Supreme Court cases or policy debates',
  ],
  'active-recall': [
    'Practice writing thesis statements for different topics without notes',
    'Create flashcards linking cause-effect chains across time periods',
    'Summarize each chapter or section from memory, then check for gaps',
    'Practice DBQ-style analysis with timed writing exercises',
    'Teach a topic to someone else — explaining deepens understanding',
  ],
  'spaced-repetition': [
    'Review new material within 24 hours, then at increasing intervals',
    'Cycle through subjects: review US History Monday, Government Tuesday, etc.',
    'Use a spacing calendar to schedule review of previously mastered topics',
    'Mix old and new material in each study session to strengthen connections',
    'Return to foundational concepts regularly — they support advanced understanding',
  ],
  'writing-practice': [
    'Write a thesis paragraph daily — even 10 minutes of practice builds skill',
    'Practice document analysis using the HIPP framework (Historical context, Intended audience, Purpose, Point of view)',
    'Draft compare-and-contrast essays connecting themes across time periods',
    'Write practice FRQs under timed conditions to build exam stamina',
    'Keep a current events journal analyzing one article per week',
  ],
};

const GROWTH_MINDSET = {
  struggling: [
    'Social studies rewards curiosity and persistence. Every question you wrestle with deepens your thinking.',
    'Historical understanding builds layer by layer. The connections will come — keep engaging with the material.',
    'Struggle with complex arguments is a sign your brain is developing analytical thinking. This is growth.',
    'Every great historian started as a student who didn\'t yet understand. Your journey is just beginning.',
  ],
  plateaued: [
    'Plateaus mean your brain is consolidating knowledge. Try approaching the material from a different angle.',
    'Connect what you know across subjects — how does economics relate to the history you\'ve studied?',
    'Try teaching what you know to someone else. Explaining deepens understanding and reveals gaps.',
    'Revisit earlier material with your current knowledge — you\'ll see connections you missed before.',
  ],
  progressing: [
    'Your analytical thinking is getting stronger! Keep building connections across time periods and subjects.',
    'Notice how you\'re starting to see patterns — that\'s historical thinking developing.',
    'Challenge yourself with primary sources and more complex arguments to keep growing.',
    'You\'re building skills that matter far beyond school — critical thinking, evidence evaluation, and civic awareness.',
  ],
};

const INTERDISCIPLINARY_CONNECTIONS = {
  'us-history+government': 'Study how historical events shaped constitutional interpretation (Reconstruction Amendments, New Deal and federal power, Civil Rights legislation).',
  'us-history+economics': 'Connect economic factors to historical change: mercantilism and colonial revolt, industrialization and labor movements, Great Depression and the New Deal.',
  'government+economics': 'Analyze how government policy shapes economic outcomes: fiscal/monetary policy, regulation, trade agreements, and the debate over government\'s economic role.',
  'geography+economics': 'Explore how geographic factors influence economic development: resource distribution, trade routes, climate and agriculture, urbanization patterns.',
  'geography+us-history': 'Examine how geography shaped American expansion: Manifest Destiny, frontier settlement, environmental transformation, regional economic differences.',
  'current-events+government': 'Apply constitutional principles to current policy debates: free speech in the digital age, executive power, voting rights, and judicial interpretation.',
  'current-events+economics': 'Analyze current economic issues through economic theory: inflation, trade policy, inequality, fiscal debates, and labor market changes.',
  'inquiry+us-history': 'Apply inquiry skills to historical analysis: sourcing documents, constructing arguments from evidence, evaluating competing historical interpretations.',
  'inquiry+current-events': 'Use inquiry skills for media literacy: evaluating sources, detecting bias, analyzing data visualizations, and constructing evidence-based civic arguments.',
  'world-history+geography': 'Study how geography influenced the rise and fall of civilizations: river valleys, trade routes, climate change, and the Columbian Exchange.',
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
  return { studentId: id, grade: null, goal: null, createdAt: new Date().toISOString(), assessments: [], skills: {}, diagnosticResults: null };
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

// Public API

class StudyPlanner {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, grade: p.grade, goal: p.goal, createdAt: p.createdAt, totalAssessments: p.assessments.length, hasDiagnostic: !!p.diagnosticResults };
  }

  setGrade(id, grade) {
    if (!GRADE_EXPECTATIONS[grade]) throw new Error(`Unknown grade: ${grade}. Valid: ${Object.keys(GRADE_EXPECTATIONS).join(', ')}`);
    const p = loadProfile(id); p.grade = grade; saveProfile(p);
    return { studentId: id, grade, expectations: GRADE_EXPECTATIONS[grade] };
  }

  setGoal(id, goal) {
    const validGoals = ['catch-up', 'maintain', 'excel', 'ap-prep', 'civic-engagement'];
    if (!validGoals.includes(goal)) throw new Error(`Unknown goal: ${goal}. Valid: ${validGoals.join(', ')}`);
    const p = loadProfile(id); p.goal = goal; saveProfile(p);
    return { studentId: id, goal };
  }

  runDiagnostic(id) {
    const p = loadProfile(id);
    const results = {};
    for (const [subject, questions] of Object.entries(DIAGNOSTIC_QUESTIONS)) {
      results[subject] = {
        questions: shuffle(questions).slice(0, 3).map(q => ({
          prompt: q.prompt,
          answer: q.answer,
          difficulty: q.difficulty,
        })),
        totalQuestions: 3,
      };
    }
    p.diagnosticResults = { date: new Date().toISOString(), subjects: Object.keys(results) };
    saveProfile(p);
    return { studentId: id, diagnostic: results, instructions: 'Answer each question. Record scores using: record <id> <subject> <skill> <score> <total>' };
  }

  recordAssessment(id, subject, skill, score, total, notes = '') {
    if (!SUBJECTS[subject]) throw new Error(`Unknown subject: ${subject}. Valid: ${Object.keys(SUBJECTS).join(', ')}`);
    if (!SUBJECTS[subject].skills.includes(skill)) throw new Error(`Unknown skill '${skill}' in ${subject}. Valid: ${SUBJECTS[subject].skills.join(', ')}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);

    const p = loadProfile(id);
    const entry = { date: new Date().toISOString(), subject, skill, score, total, notes };
    p.assessments.push(entry);
    const key = `${subject}/${skill}`;
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
    for (const [subject, info] of Object.entries(SUBJECTS)) {
      results[subject] = {};
      for (const sk of info.skills) {
        totalSkills++;
        const d = p.skills[`${subject}/${sk}`];
        results[subject][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) totalMastered++;
      }
    }
    const subjectSummary = {};
    for (const [subject, skills] of Object.entries(results)) {
      const vals = Object.values(skills);
      const avg = vals.reduce((s, v) => s + v.mastery, 0) / vals.length;
      subjectSummary[subject] = { avgMastery: Math.round(avg * 100) / 100, label: masteryLabel(avg) };
    }
    return { studentId: id, grade: p.grade, goal: p.goal, mastered: totalMastered, totalSkills, overallPct: totalSkills > 0 ? Math.round(totalMastered / totalSkills * 100) : 0, subjectSummary, skills: results };
  }

  generatePlan(id) {
    const p = loadProfile(id);
    const grade = p.grade || '9';
    const goal = p.goal || 'maintain';
    const progress = this.getProgress(id);

    // Find weakest subjects
    const subjectScores = Object.entries(progress.subjectSummary)
      .map(([s, info]) => ({ subject: s, mastery: info.avgMastery, label: info.label }))
      .sort((a, b) => a.mastery - b.mastery);

    const weakest = subjectScores.filter(s => s.mastery < MASTERY_THRESHOLD);
    const gradeExpected = GRADE_EXPECTATIONS[grade]?.focus || ['us-history', 'inquiry'];

    // Build weekly plan
    const weeklyPlan = {
      focus: weakest.length > 0 ? weakest.slice(0, 2).map(s => s.subject) : gradeExpected.slice(0, 2),
      review: subjectScores.filter(s => s.mastery >= MASTERY_THRESHOLD && s.mastery < 0.9).map(s => s.subject).slice(0, 2),
      sessions: [],
    };

    const sessionTemplates = {
      'catch-up': [
        { day: 'Monday', duration: 45, focus: 'weakest subject - core concepts', type: 'lesson' },
        { day: 'Tuesday', duration: 30, focus: 'second weakest subject - core concepts', type: 'lesson' },
        { day: 'Wednesday', duration: 45, focus: 'weakest subject - practice exercises', type: 'practice' },
        { day: 'Thursday', duration: 30, focus: 'inquiry skills and writing practice', type: 'practice' },
        { day: 'Friday', duration: 30, focus: 'review and connections across subjects', type: 'review' },
      ],
      'maintain': [
        { day: 'Monday', duration: 30, focus: 'current course material review', type: 'lesson' },
        { day: 'Wednesday', duration: 30, focus: 'practice exercises and homework support', type: 'practice' },
        { day: 'Friday', duration: 30, focus: 'review, enrichment, and current events', type: 'review' },
      ],
      'excel': [
        { day: 'Monday', duration: 45, focus: 'advanced content and primary source analysis', type: 'lesson' },
        { day: 'Tuesday', duration: 30, focus: 'DBQ and essay writing practice', type: 'practice' },
        { day: 'Thursday', duration: 45, focus: 'interdisciplinary connections', type: 'lesson' },
        { day: 'Friday', duration: 30, focus: 'current events analysis and civic engagement', type: 'enrichment' },
      ],
      'ap-prep': [
        { day: 'Monday', duration: 45, focus: 'AP content review - weakest areas', type: 'practice' },
        { day: 'Tuesday', duration: 30, focus: 'multiple choice practice - timed', type: 'timed' },
        { day: 'Wednesday', duration: 45, focus: 'FRQ/DBQ practice', type: 'practice' },
        { day: 'Thursday', duration: 30, focus: 'document analysis and sourcing skills', type: 'practice' },
        { day: 'Saturday', duration: 60, focus: 'full practice exam section', type: 'timed' },
      ],
      'civic-engagement': [
        { day: 'Monday', duration: 30, focus: 'current events analysis and media literacy', type: 'lesson' },
        { day: 'Wednesday', duration: 30, focus: 'government and policy analysis', type: 'lesson' },
        { day: 'Friday', duration: 30, focus: 'civic action project work and community research', type: 'project' },
      ],
    };

    weeklyPlan.sessions = sessionTemplates[goal] || sessionTemplates['maintain'];

    // Interdisciplinary connections for focus subjects
    const connections = [];
    const focusSubjects = weeklyPlan.focus;
    for (let i = 0; i < focusSubjects.length; i++) {
      for (let j = i + 1; j < focusSubjects.length; j++) {
        const key = `${focusSubjects[i]}+${focusSubjects[j]}`;
        const reverseKey = `${focusSubjects[j]}+${focusSubjects[i]}`;
        if (INTERDISCIPLINARY_CONNECTIONS[key]) connections.push(INTERDISCIPLINARY_CONNECTIONS[key]);
        else if (INTERDISCIPLINARY_CONNECTIONS[reverseKey]) connections.push(INTERDISCIPLINARY_CONNECTIONS[reverseKey]);
      }
    }

    // Study strategy recommendation
    const strategies = [];
    if (goal === 'ap-prep' || goal === 'excel') {
      strategies.push(...pick(STUDY_STRATEGIES['writing-practice'], 2));
      strategies.push(...pick(STUDY_STRATEGIES['active-recall'], 1));
    } else {
      strategies.push(...pick(STUDY_STRATEGIES['visual'], 1));
      strategies.push(...pick(STUDY_STRATEGIES['active-recall'], 1));
      strategies.push(...pick(STUDY_STRATEGIES['spaced-repetition'], 1));
    }

    // Mindset message
    const overallMastery = progress.overallPct / 100;
    let mindsetCategory = 'struggling';
    if (overallMastery >= 0.6) mindsetCategory = 'progressing';
    else if (overallMastery >= 0.3) mindsetCategory = 'plateaued';
    const mindset = pick(GROWTH_MINDSET[mindsetCategory], 1)[0];

    return {
      studentId: id, grade, goal, weeklyPlan,
      subjectPriorities: subjectScores.slice(0, 3),
      gradeExpectations: GRADE_EXPECTATIONS[grade],
      interdisciplinaryConnections: connections,
      studyStrategies: strategies,
      mindsetMessage: mindset,
    };
  }

  getAPReadiness(id, apExam) {
    if (!AP_EXAM_INFO[apExam]) throw new Error(`Unknown AP exam: ${apExam}. Valid: ${Object.keys(AP_EXAM_INFO).join(', ')}`);
    const progress = this.getProgress(id);
    const examInfo = AP_EXAM_INFO[apExam];
    const readiness = {};
    let weightedMastery = 0;

    for (const [subject, weight] of Object.entries(examInfo.weight)) {
      const subjectMastery = progress.subjectSummary[subject]?.avgMastery || 0;
      readiness[subject] = {
        weight,
        mastery: subjectMastery,
        label: masteryLabel(subjectMastery),
        ready: subjectMastery >= MASTERY_THRESHOLD,
      };
      weightedMastery += subjectMastery * weight;
    }

    const overallReady = Object.values(readiness).every(r => r.ready);
    const weakest = Object.entries(readiness).sort((a, b) => a[1].mastery - b[1].mastery)[0];

    return {
      studentId: id,
      apExam,
      format: examInfo.format,
      readiness,
      weightedMastery: Math.round(weightedMastery * 100) / 100,
      overallReady,
      weakestSubject: weakest[0],
      recommendation: overallReady
        ? `You are ready for ${apExam}! Continue reviewing and practicing exam-format questions.`
        : `Focus on: ${weakest[0]} (currently ${Math.round(weakest[1].mastery * 100)}%). ${apExam} requires strong skills in ${examInfo.subjects.join(', ')}.`,
    };
  }

  getRecommendations(id) {
    const p = loadProfile(id);
    const progress = this.getProgress(id);
    const grade = p.grade || '9';
    const goal = p.goal || 'maintain';
    const gradeInfo = GRADE_EXPECTATIONS[grade];

    const recommendations = [];

    // Subject-specific recommendations
    const subjectScores = Object.entries(progress.subjectSummary)
      .map(([s, info]) => ({ subject: s, mastery: info.avgMastery, label: info.label }))
      .sort((a, b) => a.mastery - b.mastery);

    // Weakest subjects for grade level
    for (const subj of gradeInfo.focus) {
      const score = progress.subjectSummary[subj];
      if (score && score.avgMastery < MASTERY_THRESHOLD) {
        recommendations.push({
          type: 'priority',
          subject: subj,
          message: `${subj} is a focus area for grade ${grade}. Current mastery: ${Math.round(score.avgMastery * 100)}%. Prioritize this subject.`,
        });
      }
    }

    // Inquiry skills are always important
    const inquiryMastery = progress.subjectSummary.inquiry?.avgMastery || 0;
    if (inquiryMastery < MASTERY_THRESHOLD) {
      recommendations.push({
        type: 'cross-cutting',
        subject: 'inquiry',
        message: 'Inquiry skills (source analysis, argumentation, research) apply across all social studies subjects. Strengthening these skills will improve performance everywhere.',
      });
    }

    // AP recommendations
    if (goal === 'ap-prep' || goal === 'excel') {
      for (const [examName, examInfo] of Object.entries(AP_EXAM_INFO)) {
        const relevant = examInfo.subjects.some(s => gradeInfo.focus.includes(s));
        if (relevant) {
          recommendations.push({
            type: 'ap-opportunity',
            exam: examName,
            message: `Consider preparing for ${examName}. Practice DBQ writing, source analysis, and timed essay responses.`,
          });
        }
      }
    }

    // Interdisciplinary connections
    const strongSubjects = subjectScores.filter(s => s.mastery >= MASTERY_THRESHOLD);
    const weakSubjects = subjectScores.filter(s => s.mastery < 0.6);
    if (strongSubjects.length > 0 && weakSubjects.length > 0) {
      const strong = strongSubjects[0].subject;
      const weak = weakSubjects[0].subject;
      const connectionKey = `${strong}+${weak}`;
      const reverseKey = `${weak}+${strong}`;
      const connection = INTERDISCIPLINARY_CONNECTIONS[connectionKey] || INTERDISCIPLINARY_CONNECTIONS[reverseKey];
      if (connection) {
        recommendations.push({
          type: 'connection',
          message: `Use your strength in ${strong} to build understanding in ${weak}. ${connection}`,
        });
      }
    }

    // Study strategies
    const strategy = goal === 'ap-prep'
      ? pick(STUDY_STRATEGIES['writing-practice'], 1)[0]
      : pick(STUDY_STRATEGIES['active-recall'], 1)[0];
    recommendations.push({ type: 'strategy', message: strategy });

    return { studentId: id, grade, goal, recommendations };
  }

  generateSchedule(id) {
    const p = loadProfile(id);
    const grade = p.grade || '9';
    const goal = p.goal || 'maintain';
    const progress = this.getProgress(id);
    const gradeInfo = GRADE_EXPECTATIONS[grade];

    // Create a 4-week rotating schedule
    const weeks = [];
    const focusSubjects = gradeInfo.focus;
    const subjectScores = Object.entries(progress.subjectSummary)
      .map(([s, info]) => ({ subject: s, mastery: info.avgMastery }))
      .sort((a, b) => a.mastery - b.mastery);

    for (let week = 1; week <= 4; week++) {
      const weekPlan = {
        week,
        theme: '',
        sessions: [],
      };

      switch (week) {
        case 1:
          weekPlan.theme = 'Foundation Building';
          weekPlan.sessions = [
            { day: 'Monday', subject: subjectScores[0]?.subject || focusSubjects[0], activity: 'Core concept review and practice', duration: 40 },
            { day: 'Wednesday', subject: subjectScores[1]?.subject || focusSubjects[1] || focusSubjects[0], activity: 'Core concept review and practice', duration: 40 },
            { day: 'Friday', subject: 'inquiry', activity: 'Source analysis and writing skills', duration: 30 },
          ];
          break;
        case 2:
          weekPlan.theme = 'Deepening Understanding';
          weekPlan.sessions = [
            { day: 'Monday', subject: focusSubjects[0], activity: 'Primary source analysis and discussion', duration: 40 },
            { day: 'Tuesday', subject: focusSubjects[1] || focusSubjects[0], activity: 'Practice exercises and application', duration: 30 },
            { day: 'Thursday', subject: 'current-events', activity: 'Current events analysis connecting to course content', duration: 30 },
            { day: 'Friday', subject: subjectScores[0]?.subject || focusSubjects[0], activity: 'Review weakest area', duration: 30 },
          ];
          break;
        case 3:
          weekPlan.theme = 'Connections & Synthesis';
          weekPlan.sessions = [
            { day: 'Monday', subject: focusSubjects[0], activity: 'Interdisciplinary connection building', duration: 40 },
            { day: 'Wednesday', subject: 'inquiry', activity: 'Argumentative writing practice (DBQ/essay)', duration: 45 },
            { day: 'Friday', subject: focusSubjects[1] || focusSubjects[0], activity: 'Mixed practice and review', duration: 30 },
          ];
          break;
        case 4:
          weekPlan.theme = 'Assessment & Reflection';
          weekPlan.sessions = [
            { day: 'Monday', subject: subjectScores[0]?.subject || focusSubjects[0], activity: 'Assessment preparation and practice test', duration: 45 },
            { day: 'Wednesday', subject: 'inquiry', activity: 'Timed writing practice', duration: 40 },
            { day: 'Friday', subject: 'all', activity: 'Review, self-assessment, and goal-setting for next cycle', duration: 30 },
          ];
          break;
      }

      weeks.push(weekPlan);
    }

    return {
      studentId: id,
      grade,
      goal,
      schedule: weeks,
      focusSubjects,
      note: 'This is a 4-week rotating schedule. Adjust based on upcoming tests, assignments, and personal progress.',
    };
  }

  getReport(id) {
    const p = loadProfile(id);
    const progress = this.getProgress(id);

    // AP readiness for relevant exams
    const grade = p.grade || '9';
    const gradeInfo = GRADE_EXPECTATIONS[grade];
    const apReadiness = {};
    for (const [examName, examInfo] of Object.entries(AP_EXAM_INFO)) {
      const relevant = examInfo.subjects.some(s => gradeInfo.focus.includes(s));
      if (relevant) {
        try { apReadiness[examName] = this.getAPReadiness(id, examName); }
        catch { /* skip if error */ }
      }
    }

    return {
      studentId: id,
      grade: p.grade,
      goal: p.goal,
      progress,
      apReadiness,
      recommendations: this.getRecommendations(id),
      recentAssessments: p.assessments.slice(-20).reverse(),
    };
  }

  setGoals(id, goals) {
    if (!Array.isArray(goals)) throw new Error('goals must be an array of goal objects');
    const p = loadProfile(id);
    p.customGoals = goals.map(g => ({
      subject: g.subject,
      target: g.target || 'proficient',
      deadline: g.deadline || null,
      createdAt: new Date().toISOString(),
    }));
    saveProfile(p);
    return { studentId: id, goals: p.customGoals };
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
        if (grade) sp.setGrade(id, grade);
        out({ action: 'start', profile: sp.getProfile(id), progress: sp.getProgress(id) });
        break;
      }
      case 'diagnostic': { const [, id] = args; if (!id) throw new Error('Usage: diagnostic <id>'); out(sp.runDiagnostic(id)); break; }
      case 'plan': { const [, id] = args; if (!id) throw new Error('Usage: plan <id>'); out(sp.generatePlan(id)); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(sp.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(sp.getReport(id)); break; }
      case 'goals': {
        const [, id, ...goalArgs] = args;
        if (!id) throw new Error('Usage: goals <id> [subject:target ...]');
        if (goalArgs.length > 0) {
          const goals = goalArgs.map(g => { const [subject, target] = g.split(':'); return { subject, target: target || 'proficient' }; });
          out(sp.setGoals(id, goals));
        } else {
          const p = loadProfile(id);
          out({ studentId: id, goals: p.customGoals || [] });
        }
        break;
      }
      case 'recommend': { const [, id] = args; if (!id) throw new Error('Usage: recommend <id>'); out(sp.getRecommendations(id)); break; }
      case 'schedule': { const [, id] = args; if (!id) throw new Error('Usage: schedule <id>'); out(sp.generateSchedule(id)); break; }
      case 'record': {
        const [, id, subject, skill, sc, tot, ...notes] = args;
        if (!id || !subject || !skill || !sc || !tot) throw new Error('Usage: record <id> <subject> <skill> <score> <total> [notes]');
        out(sp.recordAssessment(id, subject, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'ap-ready': {
        const [, id, ...examParts] = args;
        if (!id || examParts.length === 0) throw new Error('Usage: ap-ready <id> <exam-name>');
        out(sp.getAPReadiness(id, examParts.join(' ')));
        break;
      }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(sp.setGrade(id, g)); break; }
      case 'set-goal': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-goal <id> <goal>'); out(sp.setGoal(id, g)); break; }
      case 'students': { out(sp.listStudents()); break; }
      default: out({
        usage: 'node study-planner.js <command> [args]',
        commands: ['start','diagnostic','plan','progress','report','goals','recommend','schedule','record','ap-ready','set-grade','set-goal','students'],
        subjects: Object.keys(SUBJECTS),
        grades: Object.keys(GRADE_EXPECTATIONS),
        goals: ['catch-up','maintain','excel','ap-prep','civic-engagement'],
        apExams: Object.keys(AP_EXAM_INFO),
      });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
