// College Political Science Interactive Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-socialstudies-political-science');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'introductory': {
    'political-theory': ['social-contract', 'classical-liberalism', 'modern-ideologies'],
    'comparative-politics': ['regime-types', 'democratization-basics', 'electoral-systems-intro'],
    'international-relations': ['realism-intro', 'liberalism-intro', 'key-ir-concepts'],
    'public-policy': ['policy-process-basics', 'stakeholder-analysis', 'policy-evaluation-intro'],
    'political-methodology': ['qualitative-vs-quantitative', 'research-questions', 'basic-evidence-evaluation'],
    'american-politics': ['separation-of-powers', 'federalism', 'judicial-review', 'political-behavior'],
  },
  'intermediate': {
    'political-theory': ['ancient-political-thought', 'enlightenment-thinkers', 'rawls-justice', 'communitarianism', 'critical-theory-intro'],
    'comparative-politics': ['institutional-design', 'political-development', 'comparative-methods', 'political-economy'],
    'international-relations': ['neorealism', 'neoliberal-institutionalism', 'constructivism', 'game-theory-ir'],
    'public-policy': ['agenda-setting', 'implementation', 'cost-benefit-analysis', 'regulatory-policy'],
    'political-methodology': ['case-study-method', 'process-tracing', 'survey-design', 'regression-basics'],
    'american-politics': ['congress-lawmaking', 'presidential-power', 'judiciary-interpretation', 'polarization', 'media-effects'],
  },
  'upper-division': {
    'political-theory': ['contemporary-liberalism', 'feminist-political-theory', 'postcolonial-theory', 'deliberative-democracy'],
    'comparative-politics': ['ethnic-conflict', 'authoritarian-resilience', 'welfare-states', 'comparative-political-economy'],
    'international-relations': ['critical-ir', 'feminist-ir', 'security-studies', 'international-law'],
    'public-policy': ['evidence-based-policy', 'policy-diffusion', 'global-governance', 'policy-memo-writing'],
    'political-methodology': ['causal-inference', 'experimental-methods', 'content-analysis', 'mixed-methods'],
    'american-politics': ['constitutional-law-doctrine', 'electoral-dynamics', 'interest-groups', 'bureaucratic-politics'],
  },
  'advanced': {
    'political-theory': ['agonistic-democracy', 'capabilities-approach', 'critical-race-theory-politics', 'theory-thesis-writing'],
    'comparative-politics': ['state-building-theory', 'regime-transitions-advanced', 'comparative-thesis-research'],
    'international-relations': ['ir-thesis-research', 'grand-strategy', 'international-political-economy'],
    'public-policy': ['policy-research-design', 'program-evaluation-advanced', 'policy-thesis-writing'],
    'political-methodology': ['advanced-quantitative', 'advanced-qualitative', 'methodology-thesis-chapter'],
    'american-politics': ['american-political-development', 'advanced-constitutional-analysis', 'american-politics-thesis'],
  },
};

const QUESTION_BANKS = {
  'introductory': {
    'social-contract': {
      questions: [
        { q: 'Which thinker described the state of nature as "solitary, poor, nasty, brutish, and short"?', a: 'Thomas Hobbes', type: 'recall', options: ['Thomas Hobbes', 'John Locke', 'Jean-Jacques Rousseau', 'John Rawls'] },
        { q: 'Locke argued that government\'s primary purpose is to protect what?', a: 'life, liberty, and property', type: 'recall', options: ['life, liberty, and property', 'military power', 'religious authority', 'economic growth'] },
        { q: 'Rousseau\'s concept of the "general will" refers to what?', a: 'the collective interest of the political community', type: 'concept', options: ['the collective interest of the political community', 'majority rule', 'the will of the monarch', 'individual rights'] },
        { q: 'Social contract theory argues that political authority derives from what?', a: 'agreement among free individuals', type: 'concept', options: ['agreement among free individuals', 'divine right', 'military conquest', 'inherited tradition'] },
        { q: 'Which thinker justified revolution when government violates natural rights?', a: 'John Locke', type: 'recall', options: ['John Locke', 'Thomas Hobbes', 'Niccolo Machiavelli', 'Plato'] },
      ],
    },
    'classical-liberalism': {
      questions: [
        { q: 'John Stuart Mill\'s "harm principle" states that liberty may be limited only when what?', a: 'one\'s actions harm others', type: 'recall', options: ['one\'s actions harm others', 'the majority disapproves', 'the government decides', 'religious law requires it'] },
        { q: 'Classical liberalism emphasizes what above all?', a: 'individual rights and limited government', type: 'concept', options: ['individual rights and limited government', 'collective ownership', 'military strength', 'religious values'] },
        { q: 'The concept of "negative liberty" (Berlin) means freedom from what?', a: 'external interference or coercion', type: 'concept', options: ['external interference or coercion', 'all social obligations', 'economic hardship', 'moral confusion'] },
      ],
    },
    'modern-ideologies': {
      questions: [
        { q: 'Conservatism traditionally emphasizes what values?', a: 'tradition, order, and gradual change', type: 'concept', options: ['tradition, order, and gradual change', 'radical transformation', 'individual autonomy above all', 'classless society'] },
        { q: 'Socialism advocates for what economic arrangement?', a: 'collective or state ownership of the means of production', type: 'concept', options: ['collective or state ownership of the means of production', 'unregulated free markets', 'feudal land ownership', 'corporate monopolies'] },
        { q: 'Fascism is characterized by what features?', a: 'ultranationalism, authoritarian leadership, and rejection of liberal democracy', type: 'concept', options: ['ultranationalism, authoritarian leadership, and rejection of liberal democracy', 'international cooperation', 'individual rights', 'direct democracy'] },
      ],
    },
    'regime-types': {
      questions: [
        { q: 'Robert Dahl defined democracy (polyarchy) as requiring what two dimensions?', a: 'contestation (competition) and participation (inclusion)', type: 'recall', options: ['contestation (competition) and participation (inclusion)', 'wealth and power', 'freedom and equality', 'representation and federalism'] },
        { q: 'A hybrid regime combines features of what?', a: 'democracy and authoritarianism', type: 'concept', options: ['democracy and authoritarianism', 'monarchy and republic', 'capitalism and socialism', 'federal and unitary systems'] },
        { q: 'Levitsky and Way coined what term for regimes that hold elections but are not fully democratic?', a: 'competitive authoritarianism', type: 'recall', options: ['competitive authoritarianism', 'illiberal democracy', 'totalitarianism', 'oligarchy'] },
      ],
    },
    'democratization-basics': {
      questions: [
        { q: 'Huntington\'s "third wave" of democratization began in what decade?', a: '1970s', type: 'recall', options: ['1970s', '1940s', '1990s', '2000s'] },
        { q: 'Democratic transition refers to the process of moving from what to what?', a: 'authoritarian rule to democratic governance', type: 'concept', options: ['authoritarian rule to democratic governance', 'democracy to authoritarianism', 'monarchy to republic', 'one party to another'] },
      ],
    },
    'electoral-systems-intro': {
      questions: [
        { q: 'Duverger\'s law predicts that single-member plurality systems tend to produce what?', a: 'two-party systems', type: 'recall', options: ['two-party systems', 'multiparty systems', 'one-party rule', 'no parties'] },
        { q: 'Proportional representation allocates seats based on what?', a: 'each party\'s share of the total vote', type: 'concept', options: ['each party\'s share of the total vote', 'geographic districts', 'seniority', 'random selection'] },
        { q: 'The US, UK, and Canada use what type of electoral system?', a: 'single-member plurality (first past the post)', type: 'recall', options: ['single-member plurality (first past the post)', 'proportional representation', 'mixed-member proportional', 'single transferable vote'] },
      ],
    },
    'realism-intro': {
      questions: [
        { q: 'Realism in IR assumes that the international system is characterized by what?', a: 'anarchy (no overarching authority above states)', type: 'concept', options: ['anarchy (no overarching authority above states)', 'global government', 'international law enforcement', 'natural cooperation'] },
        { q: 'Hans Morgenthau is considered the founder of what school of IR thought?', a: 'classical realism', type: 'recall', options: ['classical realism', 'neoliberalism', 'constructivism', 'Marxist IR'] },
        { q: 'The balance of power concept suggests that states do what to prevent hegemony?', a: 'form alliances against the strongest state', type: 'concept', options: ['form alliances against the strongest state', 'surrender to the strongest', 'avoid all alliances', 'pursue economic integration'] },
        { q: 'The security dilemma occurs when one state\'s defensive actions are perceived as what?', a: 'threatening by other states, leading to arms races', type: 'concept', options: ['threatening by other states, leading to arms races', 'peaceful', 'economically beneficial', 'irrelevant'] },
      ],
    },
    'liberalism-intro': {
      questions: [
        { q: 'The democratic peace theory claims that democracies rarely do what?', a: 'go to war with each other', type: 'recall', options: ['go to war with each other', 'trade with each other', 'form alliances', 'have disputes'] },
        { q: 'Keohane and Nye argued that complex interdependence reduces the likelihood of what?', a: 'military conflict between states', type: 'recall', options: ['military conflict between states', 'trade', 'diplomacy', 'cultural exchange'] },
        { q: 'Liberal institutionalism argues that international organizations promote cooperation by doing what?', a: 'reducing transaction costs and providing information', type: 'concept', options: ['reducing transaction costs and providing information', 'enforcing laws with military force', 'replacing state sovereignty', 'eliminating power politics'] },
      ],
    },
    'key-ir-concepts': {
      questions: [
        { q: 'Sovereignty in IR means what?', a: 'a state has supreme authority within its territory and independence from external authority', type: 'concept', options: ['a state has supreme authority within its territory and independence from external authority', 'a state can do anything it wants globally', 'the king has absolute power', 'the UN controls all states'] },
        { q: 'Soft power, as defined by Joseph Nye, refers to what?', a: 'the ability to influence through attraction and persuasion rather than coercion', type: 'recall', options: ['the ability to influence through attraction and persuasion rather than coercion', 'military strength', 'economic sanctions', 'intelligence operations'] },
      ],
    },
    'policy-process-basics': {
      questions: [
        { q: 'Kingdon\'s multiple streams framework identifies which three streams?', a: 'problems, policies, and politics', type: 'recall', options: ['problems, policies, and politics', 'executive, legislative, judicial', 'local, state, federal', 'economic, social, environmental'] },
        { q: 'Incrementalism in policy-making means what?', a: 'policy changes through small, gradual adjustments rather than wholesale reform', type: 'concept', options: ['policy changes through small, gradual adjustments rather than wholesale reform', 'rapid revolutionary change', 'returning to previous policies', 'random policy choices'] },
      ],
    },
    'stakeholder-analysis': {
      questions: [
        { q: 'A stakeholder analysis maps what about actors in a policy debate?', a: 'their interests, power, and positions', type: 'concept', options: ['their interests, power, and positions', 'only their funding sources', 'their party affiliation', 'their educational background'] },
        { q: 'A veto player in policy-making is an actor who can do what?', a: 'block a policy change', type: 'concept', options: ['block a policy change', 'propose any law', 'override the constitution', 'appoint judges'] },
      ],
    },
    'policy-evaluation-intro': {
      questions: [
        { q: 'Policy evaluation typically assesses what?', a: 'whether a policy achieved its intended goals and at what cost', type: 'concept', options: ['whether a policy achieved its intended goals and at what cost', 'only public opinion', 'only government spending', 'the political party that proposed it'] },
      ],
    },
    'qualitative-vs-quantitative': {
      questions: [
        { q: 'Quantitative methods in political science use what?', a: 'numerical data and statistical analysis', type: 'concept', options: ['numerical data and statistical analysis', 'only interviews', 'only case studies', 'philosophical reasoning'] },
        { q: 'Qualitative methods are best suited for what type of research question?', a: 'how and why questions that require depth and context', type: 'concept', options: ['how and why questions that require depth and context', 'only numerical questions', 'prediction', 'measuring exact causal effects'] },
      ],
    },
    'research-questions': {
      questions: [
        { q: 'A good research question in political science should be what?', a: 'specific, answerable with evidence, and analytically interesting', type: 'concept', options: ['specific, answerable with evidence, and analytically interesting', 'as broad as possible', 'based on personal opinion', 'impossible to answer definitively'] },
        { q: 'A hypothesis differs from a research question by doing what?', a: 'proposing a specific expected relationship between variables', type: 'concept', options: ['proposing a specific expected relationship between variables', 'asking a broad question', 'describing a phenomenon', 'summarizing existing research'] },
      ],
    },
    'basic-evidence-evaluation': {
      questions: [
        { q: 'What is the key distinction between correlation and causation in political science?', a: 'correlation shows association; causation requires demonstrating that one variable produces a change in another', type: 'concept', options: ['correlation shows association; causation requires demonstrating that one variable produces a change in another', 'they mean the same thing', 'causation is weaker than correlation', 'correlation cannot be measured'] },
      ],
    },
    'separation-of-powers': {
      questions: [
        { q: 'The US Constitution divides power among which three branches?', a: 'legislative, executive, and judicial', type: 'recall', options: ['legislative, executive, and judicial', 'federal, state, local', 'military, civilian, judicial', 'House, Senate, President'] },
        { q: 'Checks and balances serve what purpose?', a: 'preventing any one branch from dominating the others', type: 'concept', options: ['preventing any one branch from dominating the others', 'making government more efficient', 'ensuring majority rule', 'protecting states\' rights'] },
        { q: 'The presidential veto is a check on which branch?', a: 'the legislative branch', type: 'application', options: ['the legislative branch', 'the judicial branch', 'the executive branch itself', 'state governments'] },
      ],
    },
    'federalism': {
      questions: [
        { q: 'Federalism divides power between what levels?', a: 'national (federal) and state governments', type: 'concept', options: ['national (federal) and state governments', 'executive and legislative', 'urban and rural', 'elected and appointed officials'] },
        { q: 'McCulloch v. Maryland (1819) established what principle?', a: 'federal supremacy and implied powers under the Necessary and Proper Clause', type: 'recall', options: ['federal supremacy and implied powers under the Necessary and Proper Clause', 'states can nullify federal law', 'judicial review', 'freedom of speech'] },
      ],
    },
    'judicial-review': {
      questions: [
        { q: 'Marbury v. Madison (1803) established what power for the Supreme Court?', a: 'judicial review (the power to declare laws unconstitutional)', type: 'recall', options: ['judicial review (the power to declare laws unconstitutional)', 'the power to make laws', 'the power to declare war', 'the power to tax'] },
        { q: 'Originalism argues that the Constitution should be interpreted how?', a: 'according to the original meaning at the time of ratification', type: 'concept', options: ['according to the original meaning at the time of ratification', 'as a living document that evolves', 'by popular vote', 'by the president alone'] },
      ],
    },
    'political-behavior': {
      questions: [
        { q: 'The Michigan model of voting emphasizes what factor?', a: 'party identification as the strongest predictor of vote choice', type: 'recall', options: ['party identification as the strongest predictor of vote choice', 'economic conditions', 'candidate personality', 'media influence'] },
        { q: 'Retrospective voting means voters evaluate candidates based on what?', a: 'past performance of incumbents', type: 'concept', options: ['past performance of incumbents', 'future promises', 'party loyalty', 'candidate appearance'] },
      ],
    },
  },
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
  return { studentId: id, level: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
}

function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }

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

function generateExercise(level, skill, count = 5) {
  const bank = QUESTION_BANKS[level]?.[skill];
  if (!bank || !bank.questions) return { error: `No question bank for ${level}/${skill}` };
  const items = pick(bank.questions, count).map(q => ({ prompt: q.q, answer: q.a, type: q.type, options: q.options || [] }));
  return { type: 'college-polisci', skill, level, count: items.length, instruction: 'Answer each question. Choose the best answer or provide a concise response.', items };
}

function checkAnswer(type, expected, answer) {
  return { correct: norm(expected) === norm(answer), expected, studentAnswer: answer };
}

class PoliticalScience {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, level: p.level, createdAt: p.createdAt, totalAssessments: p.assessments.length };
  }

  setLevel(id, level) {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    const p = loadProfile(id); p.level = level; saveProfile(p);
    return { studentId: id, level };
  }

  recordAssessment(id, level, category, skill, score, total, notes = '') {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}`);
    if (!SKILLS[level][category]) throw new Error(`Unknown category '${category}' for ${level}`);
    if (!SKILLS[level][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${level}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id);
    if (!p.level) p.level = level;
    const entry = { date: new Date().toISOString(), level, category, skill, score, total, notes };
    p.assessments.push(entry);
    const key = `${level}/${category}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p);
    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const level = p.level || 'introductory';
    const ls = SKILLS[level] || {};
    const results = {};
    let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(ls)) {
      results[cat] = {};
      for (const sk of skills) {
        total++;
        const d = p.skills[`${level}/${cat}/${sk}`];
        results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
      }
    }
    return { studentId: id, level, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id);
    const level = p.level || 'introductory';
    const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS[level] || {})) {
      for (const sk of skills) {
        const d = p.skills[`${level}/${cat}/${sk}`];
        const m = d ? d.mastery : 0;
        if (m < MASTERY_THRESHOLD) candidates.push({ level, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' });
      }
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, level, next: candidates.slice(0, count) };
  }

  getReport(id) { const p = loadProfile(id); return { studentId: id, level: p.level, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }

  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }

  getSkillCatalog(level) {
    const ls = SKILLS[level];
    if (!ls) return { level, error: `Unknown level. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0; const catalog = {};
    for (const [cat, skills] of Object.entries(ls)) { total += skills.length; catalog[cat] = [...skills]; }
    return { level, skills: catalog, totalSkills: total };
  }

  generateExercise(level, skill, count = 5) { return generateExercise(level, skill, count); }
  checkAnswer(type, expected, answer) { return checkAnswer(type, expected, answer); }

  generateLesson(id) {
    const p = loadProfile(id);
    const level = p.level || 'introductory';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Ready for next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    return {
      studentId: id, level, targetSkill: target, exercise,
      lessonPlan: {
        review: 'Review previously learned frameworks (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Apply framework to a real-world political case',
        reflect: 'Identify what was learned and what needs more work',
      },
    };
  }
}

module.exports = PoliticalScience;

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new PoliticalScience();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': { const [, id, level] = args; if (!id) throw new Error('Usage: start <id> [level]'); if (level) api.setLevel(id, level); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const level = loadProfile(id).level || 'introductory'; if (skill) { out(api.generateExercise(level, skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient at current level!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); let exp = expected; try { exp = JSON.parse(expected); } catch {} out(api.checkAnswer(type, exp, answer)); break; }
      case 'record': { const [, id, level, cat, skill, sc, tot, ...notes] = args; if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total> [notes]'); out(api.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? api.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(api.setLevel(id, l)); break; }
      default: out({ usage: 'node political-science.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
