// College Philosophy Interactive Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-socialstudies-philosophy');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'introductory': {
    'epistemology': ['knowledge-jtb', 'gettier-problem', 'skepticism-intro', 'rationalism-vs-empiricism'],
    'metaphysics': ['mind-body-problem', 'free-will-intro', 'personal-identity-intro', 'universals-intro'],
    'ethics': ['utilitarianism-intro', 'deontology-intro', 'virtue-ethics-intro', 'metaethics-intro'],
    'logic-formal': ['propositional-connectives', 'truth-tables', 'validity-soundness', 'common-fallacies'],
    'political-philosophy': ['social-contract-intro', 'justice-intro', 'liberty-intro', 'rights-intro'],
    'philosophy-of-mind': ['dualism-intro', 'physicalism-intro', 'consciousness-intro'],
    'aesthetics': ['what-is-art', 'beauty-subjectivity', 'aesthetic-experience'],
  },
  'logic': {
    'epistemology': ['foundationalism', 'coherentism', 'reliabilism', 'social-epistemology-intro'],
    'metaphysics': ['causation-theories', 'ontology-categories', 'time-and-persistence', 'modality-intro'],
    'ethics': ['applied-ethics-intro', 'moral-psychology', 'moral-relativism-critique'],
    'logic-formal': ['natural-deduction', 'predicate-logic', 'quantifier-rules', 'proof-strategies'],
    'political-philosophy': ['rawls-veil-of-ignorance', 'libertarianism-nozick', 'communitarianism-intro'],
    'philosophy-of-mind': ['functionalism', 'intentionality', 'qualia-problem'],
    'aesthetics': ['expression-theory', 'formalism', 'institutional-theory-art'],
  },
  'intermediate': {
    'epistemology': ['contextualism', 'epistemic-injustice', 'naturalized-epistemology', 'testimony'],
    'metaphysics': ['personal-identity-depth', 'free-will-compatibilism', 'abstract-objects', 'composition'],
    'ethics': ['consequentialism-depth', 'kantian-ethics-depth', 'care-ethics', 'contractualism-scanlon'],
    'logic-formal': ['modal-logic', 'set-theory-basics', 'logical-paradoxes', 'non-classical-logics'],
    'political-philosophy': ['deliberative-democracy', 'capabilities-approach', 'critical-race-theory-phil', 'global-justice'],
    'philosophy-of-mind': ['chinese-room', 'hard-problem', 'extended-mind', 'eliminativism'],
    'aesthetics': ['aesthetic-judgment', 'sublime', 'art-and-morality', 'environmental-aesthetics'],
  },
  'advanced': {
    'epistemology': ['epistemology-thesis-research', 'formal-epistemology', 'knowledge-norms'],
    'metaphysics': ['grounding', 'metaphysics-thesis-research', 'structural-realism'],
    'ethics': ['ethics-thesis-research', 'moral-responsibility', 'population-ethics'],
    'logic-formal': ['philosophical-logic', 'logic-thesis-research', 'paradox-resolution'],
    'political-philosophy': ['political-philosophy-thesis', 'ideal-vs-nonideal-theory', 'democratic-theory-advanced'],
    'philosophy-of-mind': ['consciousness-thesis', 'panpsychism', 'ai-philosophy'],
    'aesthetics': ['aesthetics-thesis', 'philosophy-of-film', 'digital-aesthetics'],
  },
};

const QUESTION_BANKS = {
  'introductory': {
    'knowledge-jtb': {
      questions: [
        { q: 'The traditional definition of knowledge is what?', a: 'justified true belief', type: 'recall', options: ['justified true belief', 'strong feeling of certainty', 'information in books', 'popular opinion'] },
        { q: 'Which three conditions must all be met for knowledge according to the JTB account?', a: 'the belief must be true, the person must believe it, and the belief must be justified', type: 'concept', options: ['the belief must be true, the person must believe it, and the belief must be justified', 'the belief must be popular, useful, and recent', 'the claim must be scientific, testable, and published', 'the person must be educated, rational, and experienced'] },
        { q: 'Why is mere true belief not sufficient for knowledge?', a: 'a true belief could be based on luck or bad reasoning', type: 'concept', options: ['a true belief could be based on luck or bad reasoning', 'true beliefs are always knowledge', 'truth does not matter', 'beliefs cannot be true'] },
      ],
    },
    'gettier-problem': {
      questions: [
        { q: 'Gettier showed that JTB is insufficient for knowledge by presenting what?', a: 'cases where someone has a justified true belief that is not knowledge', type: 'recall', options: ['cases where someone has a justified true belief that is not knowledge', 'a proof that knowledge is impossible', 'evidence that all beliefs are false', 'that justification is unnecessary'] },
        { q: 'In a Gettier case, the justified belief turns out true due to what?', a: 'luck or coincidence, not because of the justification', type: 'concept', options: ['luck or coincidence, not because of the justification', 'careful reasoning', 'scientific evidence', 'divine intervention'] },
      ],
    },
    'skepticism-intro': {
      questions: [
        { q: 'Descartes\' evil demon hypothesis is an example of what philosophical position?', a: 'radical skepticism about the external world', type: 'recall', options: ['radical skepticism about the external world', 'moral relativism', 'aesthetic subjectivism', 'political anarchism'] },
        { q: 'The brain-in-a-vat scenario (Putnam) challenges what type of knowledge?', a: 'knowledge of the external world', type: 'concept', options: ['knowledge of the external world', 'mathematical knowledge', 'self-knowledge', 'moral knowledge'] },
        { q: 'Hume\'s problem of induction challenges what?', a: 'our justification for believing that the future will resemble the past', type: 'recall', options: ['our justification for believing that the future will resemble the past', 'the existence of God', 'mathematical truth', 'free will'] },
      ],
    },
    'rationalism-vs-empiricism': {
      questions: [
        { q: 'Rationalists (like Descartes) claim that some knowledge comes from what source?', a: 'reason alone, independent of sensory experience', type: 'concept', options: ['reason alone, independent of sensory experience', 'the senses only', 'religious revelation', 'practical experience'] },
        { q: 'Empiricists (like Locke and Hume) claim that knowledge originates from what?', a: 'sensory experience', type: 'concept', options: ['sensory experience', 'innate ideas', 'pure reason', 'divine illumination'] },
        { q: 'Kant attempted to synthesize rationalism and empiricism by arguing what?', a: 'experience provides content but the mind structures it with innate categories', type: 'recall', options: ['experience provides content but the mind structures it with innate categories', 'only reason matters', 'only experience matters', 'knowledge is impossible'] },
      ],
    },
    'mind-body-problem': {
      questions: [
        { q: 'Cartesian dualism holds that mind and body are what?', a: 'two fundamentally different substances', type: 'recall', options: ['two fundamentally different substances', 'the same thing', 'both physical', 'both mental'] },
        { q: 'The interaction problem for dualism asks what?', a: 'how can a non-physical mind cause changes in a physical body?', type: 'concept', options: ['how can a non-physical mind cause changes in a physical body?', 'why do we have bodies?', 'how does the brain grow?', 'why do we dream?'] },
        { q: 'Physicalism (materialism) claims that everything, including the mind, is what?', a: 'physical', type: 'concept', options: ['physical', 'mental', 'spiritual', 'illusory'] },
      ],
    },
    'free-will-intro': {
      questions: [
        { q: 'Determinism is the thesis that what?', a: 'every event is necessitated by prior causes and natural laws', type: 'concept', options: ['every event is necessitated by prior causes and natural laws', 'nothing is determined', 'only human actions are free', 'God controls everything'] },
        { q: 'Compatibilism holds that free will and determinism are what?', a: 'compatible — you can be free even if determinism is true', type: 'concept', options: ['compatible — you can be free even if determinism is true', 'incompatible', 'both false', 'irrelevant to each other'] },
        { q: 'Libertarianism about free will (not political libertarianism) claims what?', a: 'we have free will and determinism is false (at least regarding human action)', type: 'concept', options: ['we have free will and determinism is false (at least regarding human action)', 'free will is an illusion', 'determinism is true and we are free', 'the question is meaningless'] },
      ],
    },
    'personal-identity-intro': {
      questions: [
        { q: 'Locke\'s theory of personal identity is based on what?', a: 'psychological continuity (memory and consciousness)', type: 'recall', options: ['psychological continuity (memory and consciousness)', 'the physical body', 'the soul', 'DNA'] },
        { q: 'Derek Parfit argued that personal identity is what?', a: 'not what matters — what matters is psychological continuity and connectedness', type: 'recall', options: ['not what matters — what matters is psychological continuity and connectedness', 'determined by the soul', 'fixed and unchanging', 'purely physical'] },
      ],
    },
    'universals-intro': {
      questions: [
        { q: 'The problem of universals asks what?', a: 'whether properties like "redness" exist independently of particular red things', type: 'concept', options: ['whether properties like "redness" exist independently of particular red things', 'whether the universe is infinite', 'whether God exists', 'whether science is reliable'] },
        { q: 'Nominalism holds that universals are what?', a: 'merely names or concepts, not real entities', type: 'concept', options: ['merely names or concepts, not real entities', 'the most real things', 'physical objects', 'divine thoughts'] },
      ],
    },
    'utilitarianism-intro': {
      questions: [
        { q: 'Utilitarianism judges actions by what criterion?', a: 'whether they maximize overall happiness or well-being', type: 'concept', options: ['whether they maximize overall happiness or well-being', 'whether they follow moral rules', 'whether they express good character', 'whether God approves'] },
        { q: 'Jeremy Bentham proposed what principle as the foundation of ethics?', a: 'the greatest happiness principle', type: 'recall', options: ['the greatest happiness principle', 'the categorical imperative', 'the golden mean', 'natural law'] },
        { q: 'Mill distinguished between higher and lower pleasures. What makes a pleasure "higher"?', a: 'it involves the distinctively human faculties (intellect, imagination)', type: 'recall', options: ['it involves the distinctively human faculties (intellect, imagination)', 'it lasts longer', 'it costs more', 'it is more intense'] },
      ],
    },
    'deontology-intro': {
      questions: [
        { q: 'Kant\'s categorical imperative commands what?', a: 'act only according to maxims you could will as universal laws', type: 'recall', options: ['act only according to maxims you could will as universal laws', 'maximize happiness', 'follow your emotions', 'obey the government'] },
        { q: 'Deontology judges the morality of actions based on what?', a: 'whether they conform to moral rules or duties, regardless of consequences', type: 'concept', options: ['whether they conform to moral rules or duties, regardless of consequences', 'their outcomes', 'the character of the actor', 'popular opinion'] },
        { q: 'Kant\'s humanity formula says to treat persons always as what?', a: 'ends in themselves, never merely as means', type: 'recall', options: ['ends in themselves, never merely as means', 'equals', 'competitors', 'resources'] },
      ],
    },
    'virtue-ethics-intro': {
      questions: [
        { q: 'Virtue ethics focuses on what as the primary unit of moral evaluation?', a: 'the character of the agent', type: 'concept', options: ['the character of the agent', 'the action itself', 'the consequences', 'the moral rule'] },
        { q: 'Aristotle\'s doctrine of the mean holds that virtues are what?', a: 'means between extremes of excess and deficiency', type: 'recall', options: ['means between extremes of excess and deficiency', 'absolute rules', 'feelings', 'innate traits'] },
        { q: 'Eudaimonia in Aristotle\'s ethics is best translated as what?', a: 'human flourishing or living well', type: 'recall', options: ['human flourishing or living well', 'pleasure', 'wealth', 'freedom'] },
      ],
    },
    'metaethics-intro': {
      questions: [
        { q: 'Moral realism claims what?', a: 'there are objective moral facts independent of what anyone believes', type: 'concept', options: ['there are objective moral facts independent of what anyone believes', 'morality is relative', 'morality is an illusion', 'moral claims are merely emotional'] },
        { q: 'Error theory (Mackie) claims what about moral statements?', a: 'they aim to state facts but all moral facts are false — morality is an error', type: 'recall', options: ['they aim to state facts but all moral facts are false — morality is an error', 'moral facts exist', 'morality is relative to culture', 'moral claims express emotions'] },
      ],
    },
    'propositional-connectives': {
      questions: [
        { q: 'In propositional logic, the conjunction "P and Q" is true when?', a: 'both P and Q are true', type: 'concept', options: ['both P and Q are true', 'either is true', 'P is true', 'neither is true'] },
        { q: 'The material conditional "if P then Q" is false only when?', a: 'P is true and Q is false', type: 'concept', options: ['P is true and Q is false', 'P is false', 'Q is true', 'both are false'] },
        { q: 'The negation of P is true when?', a: 'P is false', type: 'concept', options: ['P is false', 'P is true', 'P is unknown', 'P is meaningless'] },
      ],
    },
    'truth-tables': {
      questions: [
        { q: 'A truth table shows what for a logical formula?', a: 'its truth value under every possible assignment of truth values to its components', type: 'concept', options: ['its truth value under every possible assignment of truth values to its components', 'only when it is true', 'its meaning in English', 'how to prove it'] },
        { q: 'If a formula is true on every row of its truth table, it is called what?', a: 'a tautology', type: 'concept', options: ['a tautology', 'a contradiction', 'contingent', 'invalid'] },
        { q: 'A contradiction is false on how many rows of its truth table?', a: 'every row', type: 'concept', options: ['every row', 'some rows', 'no rows', 'only one row'] },
      ],
    },
    'validity-soundness': {
      questions: [
        { q: 'An argument is valid when what is true?', a: 'the conclusion follows necessarily from the premises (if premises are true, conclusion must be true)', type: 'concept', options: ['the conclusion follows necessarily from the premises (if premises are true, conclusion must be true)', 'the conclusion is true', 'the premises are true', 'everyone agrees with it'] },
        { q: 'A sound argument is what?', a: 'valid with true premises', type: 'concept', options: ['valid with true premises', 'any argument that is persuasive', 'an argument with a true conclusion', 'a well-written argument'] },
        { q: 'Can a valid argument have false premises?', a: 'yes — validity only concerns the logical structure, not the truth of premises', type: 'concept', options: ['yes — validity only concerns the logical structure, not the truth of premises', 'no', 'only in special cases', 'only in formal logic'] },
      ],
    },
    'common-fallacies': {
      questions: [
        { q: 'An ad hominem fallacy attacks what instead of the argument?', a: 'the person making the argument', type: 'concept', options: ['the person making the argument', 'the conclusion', 'the evidence', 'the logical structure'] },
        { q: 'A straw man fallacy involves what?', a: 'misrepresenting an opponent\'s argument to make it easier to attack', type: 'concept', options: ['misrepresenting an opponent\'s argument to make it easier to attack', 'building a strong argument', 'using irrelevant evidence', 'appealing to emotion'] },
        { q: 'The appeal to authority fallacy occurs when what?', a: 'someone cites an authority who is not an expert on the relevant topic', type: 'concept', options: ['someone cites an authority who is not an expert on the relevant topic', 'someone cites a relevant expert', 'an argument is too complex', 'evidence is presented'] },
      ],
    },
    'social-contract-intro': {
      questions: [
        { q: 'Social contract theory in political philosophy argues that political authority derives from what?', a: 'an agreement (actual or hypothetical) among free individuals', type: 'concept', options: ['an agreement (actual or hypothetical) among free individuals', 'divine right', 'natural superiority', 'military conquest'] },
        { q: 'Hobbes argued that the state of nature would be a state of what?', a: 'war of all against all', type: 'recall', options: ['war of all against all', 'perfect freedom', 'natural harmony', 'democratic governance'] },
      ],
    },
    'justice-intro': {
      questions: [
        { q: 'Rawls\' difference principle allows inequality only when what?', a: 'it benefits the least advantaged members of society', type: 'recall', options: ['it benefits the least advantaged members of society', 'it maximizes total wealth', 'everyone consents', 'it rewards hard work'] },
        { q: 'The veil of ignorance is a thought experiment where you choose principles of justice without knowing what?', a: 'your position in society (race, class, gender, talents)', type: 'recall', options: ['your position in society (race, class, gender, talents)', 'the laws of physics', 'your own name', 'what century you live in'] },
      ],
    },
    'liberty-intro': {
      questions: [
        { q: 'Isaiah Berlin distinguished between what two concepts of liberty?', a: 'positive liberty (freedom to) and negative liberty (freedom from)', type: 'recall', options: ['positive liberty (freedom to) and negative liberty (freedom from)', 'political and economic liberty', 'natural and artificial liberty', 'absolute and relative liberty'] },
      ],
    },
    'rights-intro': {
      questions: [
        { q: 'Natural rights theory holds that rights are what?', a: 'inherent and not granted by government', type: 'concept', options: ['inherent and not granted by government', 'created by legislation', 'earned through citizenship', 'given by religious institutions'] },
      ],
    },
    'dualism-intro': {
      questions: [
        { q: 'Substance dualism holds that the mind is what?', a: 'a non-physical substance distinct from the body', type: 'concept', options: ['a non-physical substance distinct from the body', 'identical to the brain', 'an illusion', 'a social construct'] },
      ],
    },
    'physicalism-intro': {
      questions: [
        { q: 'Physicalism about the mind claims what?', a: 'mental states are physical states (identical to or realized by brain states)', type: 'concept', options: ['mental states are physical states (identical to or realized by brain states)', 'the mind is separate from the body', 'consciousness does not exist', 'only behavior matters'] },
      ],
    },
    'consciousness-intro': {
      questions: [
        { q: 'The "hard problem of consciousness" (Chalmers) asks what?', a: 'why and how physical processes give rise to subjective experience', type: 'recall', options: ['why and how physical processes give rise to subjective experience', 'how the brain processes information', 'whether computers can think', 'how to measure intelligence'] },
        { q: 'Nagel\'s "What Is It Like to Be a Bat?" argues what?', a: 'there is a subjective character to experience that physical science cannot capture', type: 'recall', options: ['there is a subjective character to experience that physical science cannot capture', 'bats are conscious and humans are not', 'consciousness is an illusion', 'we can fully understand bat experience'] },
      ],
    },
    'what-is-art': {
      questions: [
        { q: 'The question "What is art?" in aesthetics asks for what?', a: 'necessary and sufficient conditions for something to count as art', type: 'concept', options: ['necessary and sufficient conditions for something to count as art', 'which art is best', 'how much art costs', 'who the greatest artist is'] },
      ],
    },
    'beauty-subjectivity': {
      questions: [
        { q: 'The debate over whether beauty is objective or subjective concerns what?', a: 'whether aesthetic judgments reflect real properties or merely personal preferences', type: 'concept', options: ['whether aesthetic judgments reflect real properties or merely personal preferences', 'how to measure beauty', 'cultural differences in taste', 'the price of art'] },
      ],
    },
    'aesthetic-experience': {
      questions: [
        { q: 'Kant argued that aesthetic judgment is what type of judgment?', a: 'disinterested — based on the form of the object, not personal desire or utility', type: 'recall', options: ['disinterested — based on the form of the object, not personal desire or utility', 'entirely subjective', 'based on market value', 'determined by expertise'] },
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
function generateExercise(level, skill, count = 5) { const bank = QUESTION_BANKS[level]?.[skill]; if (!bank || !bank.questions) return { error: `No question bank for ${level}/${skill}` }; const items = pick(bank.questions, count).map(q => ({ prompt: q.q, answer: q.a, type: q.type, options: q.options || [] })); return { type: 'college-philosophy', skill, level, count: items.length, instruction: 'Answer each question. Choose the best answer or provide a concise response.', items }; }
function checkAnswer(type, expected, answer) { return { correct: norm(expected) === norm(answer), expected, studentAnswer: answer }; }

class Philosophy {
  getProfile(id) { const p = loadProfile(id); return { studentId: p.studentId, level: p.level, createdAt: p.createdAt, totalAssessments: p.assessments.length }; }
  setLevel(id, level) { if (!SKILLS[level]) throw new Error(`Unknown level: ${level}. Valid: ${Object.keys(SKILLS).join(', ')}`); const p = loadProfile(id); p.level = level; saveProfile(p); return { studentId: id, level }; }
  recordAssessment(id, level, category, skill, score, total, notes = '') {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}`); if (!SKILLS[level][category]) throw new Error(`Unknown category '${category}' for ${level}`); if (!SKILLS[level][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${level}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive'); if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id); if (!p.level) p.level = level; const entry = { date: new Date().toISOString(), level, category, skill, score, total, notes }; p.assessments.push(entry);
    const key = `${level}/${category}/${skill}`; if (!p.skills[key]) p.skills[key] = { attempts: [] }; p.skills[key].attempts.push({ date: entry.date, score, total }); p.skills[key].mastery = calcMastery(p.skills[key].attempts); p.skills[key].label = masteryLabel(p.skills[key].mastery); saveProfile(p);
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
    const p = loadProfile(id); const level = p.level || 'introductory'; const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Ready for next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    return { studentId: id, level, targetSkill: target, exercise, lessonPlan: { review: 'Review previously learned arguments (2-3 min)', teach: `Introduce/reinforce: ${target.category} > ${target.skill}`, practice: `Complete ${exercise.count || 0} practice items`, apply: 'Reconstruct and evaluate a philosophical argument', reflect: 'Identify what was learned and what needs more work' } };
  }
}

module.exports = Philosophy;

if (require.main === module) {
  const args = process.argv.slice(2); const cmd = args[0]; const api = new Philosophy(); const out = d => console.log(JSON.stringify(d, null, 2));
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
      default: out({ usage: 'node philosophy.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
