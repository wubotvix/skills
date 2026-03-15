// College Sociology Interactive Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-socialstudies-sociology');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'introductory': {
    'social-theory': ['sociological-imagination', 'classical-theorists-overview', 'functionalism-basics', 'conflict-theory-basics', 'symbolic-interactionism'],
    'social-stratification': ['class-inequality', 'social-mobility', 'poverty-measurement', 'wealth-gap'],
    'race-ethnicity': ['race-as-social-construct', 'prejudice-vs-discrimination', 'institutional-racism', 'racial-formation'],
    'gender-sexuality': ['gender-as-social-construct', 'gender-roles', 'wage-gap', 'lgbtq-sociology'],
    'institutions': ['family', 'education', 'religion', 'criminal-justice'],
    'globalization': ['global-inequality', 'migration', 'cultural-globalization'],
    'research-methods': ['survey-basics', 'qualitative-vs-quantitative', 'ethics-in-research', 'sampling'],
  },
  'intermediate': {
    'social-theory': ['marx-depth', 'durkheim-depth', 'weber-depth', 'du-bois-double-consciousness', 'simmel-social-forms'],
    'social-stratification': ['weber-class-status-party', 'bourdieu-capitals', 'wright-class-analysis', 'intersectional-stratification'],
    'race-ethnicity': ['color-blind-racism', 'critical-race-theory', 'immigration-assimilation', 'whiteness-studies'],
    'gender-sexuality': ['doing-gender', 'hegemonic-masculinity', 'queer-theory', 'reproductive-politics'],
    'institutions': ['medicalization', 'school-to-prison-pipeline', 'mass-incarceration', 'welfare-state'],
    'globalization': ['world-systems-theory', 'global-cities', 'transnationalism', 'digital-sociology'],
    'research-methods': ['ethnographic-methods', 'interview-methods', 'content-analysis', 'regression-basics'],
  },
  'theory': {
    'social-theory': ['parsons-functionalism', 'merton-middle-range', 'goffman-dramaturgy', 'bourdieu-practice', 'foucault-power', 'collins-interaction-ritual'],
    'social-stratification': ['reproduction-theory', 'cultural-capital-depth', 'poverty-research', 'wealth-accumulation'],
    'race-ethnicity': ['racial-capitalism', 'settler-colonialism', 'afro-pessimism', 'multiracial-identity'],
    'gender-sexuality': ['butler-performativity', 'connell-gender-order', 'feminist-epistemology', 'intersectionality-depth'],
    'institutions': ['organizational-isomorphism', 'institutional-logics', 'total-institutions', 'credentialism'],
    'globalization': ['postcolonial-sociology', 'southern-theory', 'platform-capitalism', 'environmental-sociology'],
    'research-methods': ['mixed-methods', 'historical-comparative', 'multilevel-modeling', 'participatory-action-research'],
  },
  'advanced': {
    'social-theory': ['actor-network-theory', 'critical-realism', 'decolonial-sociology', 'theory-synthesis'],
    'social-stratification': ['stratification-thesis-research', 'policy-analysis', 'comparative-inequality'],
    'race-ethnicity': ['race-thesis-research', 'global-racial-formations', 'reparations-debate'],
    'gender-sexuality': ['gender-thesis-research', 'transnational-feminism', 'masculinity-studies-advanced'],
    'institutions': ['institutional-change-theory', 'comparative-institutions', 'institution-thesis-research'],
    'globalization': ['globalization-thesis-research', 'climate-justice', 'digital-inequality'],
    'research-methods': ['advanced-quantitative', 'advanced-qualitative', 'research-thesis-methods'],
  },
};

const QUESTION_BANKS = {
  'introductory': {
    'sociological-imagination': {
      questions: [
        { q: 'C. Wright Mills coined the term "sociological imagination" to describe what ability?', a: 'connecting personal troubles to public issues and structural forces', type: 'recall', options: ['connecting personal troubles to public issues and structural forces', 'predicting individual behavior', 'conducting surveys', 'studying only large groups'] },
        { q: 'Using the sociological imagination, unemployment is best understood as what?', a: 'a public issue shaped by economic structures, not just individual failure', type: 'application', options: ['a public issue shaped by economic structures, not just individual failure', 'always a personal choice', 'a natural condition', 'only a psychological problem'] },
        { q: 'The sociological imagination requires thinking at what two levels?', a: 'the individual (biography) and society (history/structure)', type: 'concept', options: ['the individual (biography) and society (history/structure)', 'local and national', 'past and future', 'theory and practice only'] },
      ],
    },
    'classical-theorists-overview': {
      questions: [
        { q: 'Marx, Durkheim, and Weber are considered the three founders of what discipline?', a: 'sociology', type: 'recall', options: ['sociology', 'psychology', 'economics', 'anthropology'] },
        { q: 'Marx emphasized which factor as the primary driver of social change?', a: 'class struggle and economic relations', type: 'recall', options: ['class struggle and economic relations', 'religious beliefs', 'bureaucratic rationalization', 'population growth'] },
        { q: 'Durkheim focused on what as the central question of sociology?', a: 'social cohesion (what holds society together)', type: 'recall', options: ['social cohesion (what holds society together)', 'individual psychology', 'economic markets', 'political power'] },
        { q: 'Weber\'s concept of verstehen means what?', a: 'interpretive understanding of social action from the actor\'s perspective', type: 'recall', options: ['interpretive understanding of social action from the actor\'s perspective', 'objective measurement', 'statistical analysis', 'material production'] },
      ],
    },
    'functionalism-basics': {
      questions: [
        { q: 'Functionalism views society as what?', a: 'a system of interconnected parts that work together to maintain stability', type: 'concept', options: ['a system of interconnected parts that work together to maintain stability', 'a site of constant conflict', 'a collection of individuals', 'an illusion'] },
        { q: 'Merton distinguished between manifest and latent functions. What are latent functions?', a: 'unintended and often unrecognized consequences of social structures', type: 'concept', options: ['unintended and often unrecognized consequences of social structures', 'the stated purposes of institutions', 'hidden government agendas', 'functions that no longer operate'] },
        { q: 'A major criticism of functionalism is what?', a: 'it tends to justify the status quo and overlook inequality and conflict', type: 'analysis', options: ['it tends to justify the status quo and overlook inequality and conflict', 'it is too focused on conflict', 'it ignores social structures', 'it is purely quantitative'] },
      ],
    },
    'conflict-theory-basics': {
      questions: [
        { q: 'Conflict theory focuses on what aspect of society?', a: 'competition for scarce resources and power between groups', type: 'concept', options: ['competition for scarce resources and power between groups', 'social harmony', 'individual achievement', 'cultural symbols'] },
        { q: 'Marx\'s concept of alienation describes workers\' estrangement from what?', a: 'their labor, the product, other workers, and their human potential', type: 'recall', options: ['their labor, the product, other workers, and their human potential', 'their families only', 'religion', 'government'] },
      ],
    },
    'symbolic-interactionism': {
      questions: [
        { q: 'Symbolic interactionism focuses on what level of social analysis?', a: 'micro-level: face-to-face interaction and meaning-making', type: 'concept', options: ['micro-level: face-to-face interaction and meaning-making', 'macro-level structures', 'global patterns', 'economic systems'] },
        { q: 'Cooley\'s "looking-glass self" means that our self-concept is shaped by what?', a: 'how we imagine others perceive us', type: 'recall', options: ['how we imagine others perceive us', 'our genes', 'standardized tests', 'government records'] },
        { q: 'George Herbert Mead distinguished between the "I" and the "Me." The "Me" represents what?', a: 'the socialized self that incorporates others\' attitudes', type: 'recall', options: ['the socialized self that incorporates others\' attitudes', 'the creative, spontaneous self', 'the unconscious mind', 'the biological body'] },
      ],
    },
    'class-inequality': {
      questions: [
        { q: 'Social class in sociology refers to what?', a: 'a group\'s position in the economic hierarchy based on wealth, income, and occupation', type: 'concept', options: ['a group\'s position in the economic hierarchy based on wealth, income, and occupation', 'personal talent', 'educational achievement alone', 'cultural taste'] },
        { q: 'The distinction between wealth and income is what?', a: 'wealth is accumulated assets; income is earnings over a period', type: 'concept', options: ['wealth is accumulated assets; income is earnings over a period', 'they are the same', 'wealth is always larger', 'income includes only wages'] },
      ],
    },
    'social-mobility': {
      questions: [
        { q: 'Intergenerational mobility refers to what?', a: 'changes in social position between parents and children', type: 'concept', options: ['changes in social position between parents and children', 'moving to a new city', 'changing careers', 'aging'] },
        { q: 'Structural mobility occurs because of what?', a: 'changes in the economy that create or eliminate types of jobs', type: 'concept', options: ['changes in the economy that create or eliminate types of jobs', 'individual effort alone', 'government policy only', 'educational reform'] },
      ],
    },
    'poverty-measurement': {
      questions: [
        { q: 'The difference between absolute and relative poverty is what?', a: 'absolute poverty is a fixed threshold; relative poverty is measured against a society\'s standard of living', type: 'concept', options: ['absolute poverty is a fixed threshold; relative poverty is measured against a society\'s standard of living', 'they are the same', 'absolute is worse', 'relative poverty does not exist in wealthy countries'] },
      ],
    },
    'wealth-gap': {
      questions: [
        { q: 'The racial wealth gap in the US refers to what?', a: 'the large disparity in net worth between White and Black/Latino households', type: 'concept', options: ['the large disparity in net worth between White and Black/Latino households', 'income differences only', 'differences in spending habits', 'educational attainment gaps only'] },
        { q: 'Historical factors contributing to the racial wealth gap include what?', a: 'slavery, redlining, discriminatory lending, and exclusion from New Deal programs', type: 'recall', options: ['slavery, redlining, discriminatory lending, and exclusion from New Deal programs', 'only recent discrimination', 'cultural differences', 'natural variation'] },
      ],
    },
    'race-as-social-construct': {
      questions: [
        { q: 'Sociologists argue that race is a social construct because what?', a: 'racial categories are created by human societies, not determined by biology', type: 'concept', options: ['racial categories are created by human societies, not determined by biology', 'race does not exist at all', 'biology determines race', 'race is the same everywhere'] },
        { q: 'Human genetic variation is best described as what?', a: 'clinal (gradual) and not clustered into discrete racial groups', type: 'concept', options: ['clinal (gradual) and not clustered into discrete racial groups', 'divided into three races', 'random', 'identical across populations'] },
      ],
    },
    'prejudice-vs-discrimination': {
      questions: [
        { q: 'Prejudice refers to what?', a: 'attitudes and beliefs about a group', type: 'concept', options: ['attitudes and beliefs about a group', 'actions taken against a group', 'laws targeting a group', 'economic inequality'] },
        { q: 'Discrimination refers to what?', a: 'unequal treatment based on group membership', type: 'concept', options: ['unequal treatment based on group membership', 'negative attitudes', 'personal opinions', 'stereotypes'] },
      ],
    },
    'institutional-racism': {
      questions: [
        { q: 'Institutional racism refers to what?', a: 'racial inequality embedded in the normal operations of social institutions', type: 'concept', options: ['racial inequality embedded in the normal operations of social institutions', 'individual racial prejudice', 'hate crimes', 'explicit segregation laws only'] },
        { q: 'Redlining is an example of what?', a: 'institutional racism in housing and lending', type: 'application', options: ['institutional racism in housing and lending', 'individual prejudice', 'cultural racism', 'reverse discrimination'] },
      ],
    },
    'racial-formation': {
      questions: [
        { q: 'Omi and Winant\'s racial formation theory argues that race is what?', a: 'an unstable social category shaped by political struggle and state power', type: 'recall', options: ['an unstable social category shaped by political struggle and state power', 'a fixed biological category', 'irrelevant to politics', 'only about skin color'] },
      ],
    },
    'gender-as-social-construct': {
      questions: [
        { q: 'The sociological distinction between sex and gender is what?', a: 'sex refers to biological characteristics; gender refers to social roles and identities', type: 'concept', options: ['sex refers to biological characteristics; gender refers to social roles and identities', 'they are the same', 'gender is biological', 'sex is a social construct'] },
        { q: 'West and Zimmerman\'s concept of "doing gender" means what?', a: 'gender is continually produced through everyday interactions', type: 'recall', options: ['gender is continually produced through everyday interactions', 'gender is fixed at birth', 'gender is chosen once', 'gender does not exist'] },
      ],
    },
    'gender-roles': {
      questions: [
        { q: 'Gender socialization begins at what point in life?', a: 'from birth (and even before, through expectations)', type: 'concept', options: ['from birth (and even before, through expectations)', 'at puberty', 'in college', 'after marriage'] },
        { q: 'The concept of hegemonic masculinity (Connell) refers to what?', a: 'the culturally dominant form of masculinity that subordinates other forms', type: 'recall', options: ['the culturally dominant form of masculinity that subordinates other forms', 'biological male traits', 'all men\'s behavior', 'military masculinity only'] },
      ],
    },
    'wage-gap': {
      questions: [
        { q: 'The gender wage gap refers to what?', a: 'the difference in average earnings between men and women', type: 'concept', options: ['the difference in average earnings between men and women', 'equal pay for equal work', 'differences in hours worked only', 'occupational segregation alone'] },
      ],
    },
    'lgbtq-sociology': {
      questions: [
        { q: 'Sociological approaches to sexuality emphasize what?', a: 'sexuality is shaped by social norms, institutions, and power structures', type: 'concept', options: ['sexuality is shaped by social norms, institutions, and power structures', 'sexuality is purely biological', 'sexuality is a personal choice unaffected by society', 'sexuality cannot be studied sociologically'] },
      ],
    },
    'family': {
      questions: [
        { q: 'Sociologists study the family as what?', a: 'a social institution that varies across cultures and historical periods', type: 'concept', options: ['a social institution that varies across cultures and historical periods', 'a purely biological unit', 'unchanging across time', 'irrelevant to inequality'] },
      ],
    },
    'education': {
      questions: [
        { q: 'Bourdieu argued that schools reproduce inequality through what mechanism?', a: 'rewarding cultural capital that upper-class students already possess', type: 'recall', options: ['rewarding cultural capital that upper-class students already possess', 'charging high tuition', 'explicit discrimination', 'random selection'] },
      ],
    },
    'religion': {
      questions: [
        { q: 'Durkheim defined religion in terms of what distinction?', a: 'the sacred and the profane', type: 'recall', options: ['the sacred and the profane', 'true and false beliefs', 'monotheism and polytheism', 'Western and Eastern traditions'] },
      ],
    },
    'criminal-justice': {
      questions: [
        { q: 'Labeling theory argues that deviance is created by what?', a: 'the social process of labeling behavior as deviant', type: 'concept', options: ['the social process of labeling behavior as deviant', 'inherent criminal traits', 'poverty alone', 'biology'] },
      ],
    },
    'global-inequality': {
      questions: [
        { q: 'World-systems theory (Wallerstein) divides the global economy into what zones?', a: 'core, semi-periphery, and periphery', type: 'recall', options: ['core, semi-periphery, and periphery', 'developed and developing', 'East and West', 'industrial and agricultural'] },
      ],
    },
    'migration': {
      questions: [
        { q: 'Push factors in migration include what?', a: 'poverty, violence, persecution, and environmental disasters', type: 'concept', options: ['poverty, violence, persecution, and environmental disasters', 'high wages', 'good schools', 'cultural attractions'] },
      ],
    },
    'cultural-globalization': {
      questions: [
        { q: 'Cultural globalization refers to what process?', a: 'the spread of ideas, values, and cultural practices across national borders', type: 'concept', options: ['the spread of ideas, values, and cultural practices across national borders', 'only economic integration', 'military expansion', 'language extinction'] },
      ],
    },
    'survey-basics': {
      questions: [
        { q: 'The General Social Survey (GSS) is an important resource for sociology because of what?', a: 'it provides nationally representative data on social attitudes and behaviors since 1972', type: 'recall', options: ['it provides nationally representative data on social attitudes and behaviors since 1972', 'it is the only survey in the US', 'it studies only economics', 'it was created by Durkheim'] },
      ],
    },
    'qualitative-vs-quantitative': {
      questions: [
        { q: 'Qualitative research in sociology aims to do what?', a: 'understand meaning, context, and process through in-depth data', type: 'concept', options: ['understand meaning, context, and process through in-depth data', 'measure variables numerically', 'test hypotheses with statistics', 'produce generalizable findings only'] },
        { q: 'Quantitative research in sociology emphasizes what?', a: 'numerical measurement, statistical analysis, and generalizability', type: 'concept', options: ['numerical measurement, statistical analysis, and generalizability', 'in-depth interviews only', 'participant observation', 'narrative analysis'] },
      ],
    },
    'ethics-in-research': {
      questions: [
        { q: 'Informed consent in sociological research means what?', a: 'participants understand and voluntarily agree to the research procedures', type: 'concept', options: ['participants understand and voluntarily agree to the research procedures', 'the researcher consents to the university', 'participants sign a waiver of rights', 'consent is optional'] },
      ],
    },
    'sampling': {
      questions: [
        { q: 'A random sample ensures what?', a: 'every member of the population has an equal chance of being selected', type: 'concept', options: ['every member of the population has an equal chance of being selected', 'only volunteers participate', 'the sample is small', 'results are always correct'] },
      ],
    },
  },
};

// File I/O
function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }
function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }
function loadProfile(id) { const fp = profilePath(id); if (fs.existsSync(fp)) { try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); } } return { studentId: id, level: null, createdAt: new Date().toISOString(), assessments: [], skills: {} }; }
function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }

function calcMastery(attempts) { if (!attempts || !attempts.length) return 0; const recent = attempts.slice(-5).filter(a => a.total > 0); return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0; }
function masteryLabel(r) { return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started'; }
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }
function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

function generateExercise(level, skill, count = 5) { const bank = QUESTION_BANKS[level]?.[skill]; if (!bank || !bank.questions) return { error: `No question bank for ${level}/${skill}` }; const items = pick(bank.questions, count).map(q => ({ prompt: q.q, answer: q.a, type: q.type, options: q.options || [] })); return { type: 'college-sociology', skill, level, count: items.length, instruction: 'Answer each question. Choose the best answer or provide a concise response.', items }; }
function checkAnswer(type, expected, answer) { return { correct: norm(expected) === norm(answer), expected, studentAnswer: answer }; }

class Sociology {
  getProfile(id) { const p = loadProfile(id); return { studentId: p.studentId, level: p.level, createdAt: p.createdAt, totalAssessments: p.assessments.length }; }
  setLevel(id, level) { if (!SKILLS[level]) throw new Error(`Unknown level: ${level}. Valid: ${Object.keys(SKILLS).join(', ')}`); const p = loadProfile(id); p.level = level; saveProfile(p); return { studentId: id, level }; }

  recordAssessment(id, level, category, skill, score, total, notes = '') {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}`);
    if (!SKILLS[level][category]) throw new Error(`Unknown category '${category}' for ${level}`);
    if (!SKILLS[level][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${level}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id); if (!p.level) p.level = level;
    const entry = { date: new Date().toISOString(), level, category, skill, score, total, notes }; p.assessments.push(entry);
    const key = `${level}/${category}/${skill}`; if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total }); p.skills[key].mastery = calcMastery(p.skills[key].attempts); p.skills[key].label = masteryLabel(p.skills[key].mastery); saveProfile(p);
    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  getProgress(id) { const p = loadProfile(id); const level = p.level || 'introductory'; const ls = SKILLS[level] || {}; const results = {}; let mastered = 0, total = 0; for (const [cat, skills] of Object.entries(ls)) { results[cat] = {}; for (const sk of skills) { total++; const d = p.skills[`${level}/${cat}/${sk}`]; results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' }; if (d && d.mastery >= MASTERY_THRESHOLD) mastered++; } } return { studentId: id, level, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results }; }

  getNextSkills(id, count = 5) { const p = loadProfile(id); const level = p.level || 'introductory'; const candidates = []; for (const [cat, skills] of Object.entries(SKILLS[level] || {})) { for (const sk of skills) { const d = p.skills[`${level}/${cat}/${sk}`]; const m = d ? d.mastery : 0; if (m < MASTERY_THRESHOLD) candidates.push({ level, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' }); } } const order = { developing: 0, emerging: 1, 'not-started': 2 }; candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery); return { studentId: id, level, next: candidates.slice(0, count) }; }

  getReport(id) { const p = loadProfile(id); return { studentId: id, level: p.level, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }
  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }
  getSkillCatalog(level) { const ls = SKILLS[level]; if (!ls) return { level, error: `Unknown level. Valid: ${Object.keys(SKILLS).join(', ')}` }; let total = 0; const catalog = {}; for (const [cat, skills] of Object.entries(ls)) { total += skills.length; catalog[cat] = [...skills]; } return { level, skills: catalog, totalSkills: total }; }
  generateExercise(level, skill, count = 5) { return generateExercise(level, skill, count); }
  checkAnswer(type, expected, answer) { return checkAnswer(type, expected, answer); }

  generateLesson(id) {
    const p = loadProfile(id); const level = p.level || 'introductory';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Ready for next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    return { studentId: id, level, targetSkill: target, exercise, lessonPlan: { review: 'Review previously learned concepts (2-3 min)', teach: `Introduce/reinforce: ${target.category} > ${target.skill}`, practice: `Complete ${exercise.count || 0} practice items`, apply: 'Connect to sociological research and real-world social patterns', reflect: 'Identify what was learned and what needs more work' } };
  }
}

module.exports = Sociology;

if (require.main === module) {
  const args = process.argv.slice(2); const cmd = args[0]; const api = new Sociology(); const out = d => console.log(JSON.stringify(d, null, 2));
  try {
    switch (cmd) {
      case 'start': { const [, id, level] = args; if (!id) throw new Error('Usage: start <id> [level]'); if (level) api.setLevel(id, level); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const level = loadProfile(id).level || 'introductory'; if (skill) { out(api.generateExercise(level, skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); let exp = expected; try { exp = JSON.parse(expected); } catch {} out(api.checkAnswer(type, exp, answer)); break; }
      case 'record': { const [, id, level, cat, skill, sc, tot, ...notes] = args; if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total> [notes]'); out(api.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? api.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(api.setLevel(id, l)); break; }
      default: out({ usage: 'node sociology.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
