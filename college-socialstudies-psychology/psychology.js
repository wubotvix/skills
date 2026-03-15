// College Psychology Interactive Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-socialstudies-psychology');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'introductory': {
    'cognitive-psychology': ['memory-models', 'attention', 'heuristics-biases', 'problem-solving'],
    'developmental-psychology': ['piaget-stages', 'erikson-stages', 'attachment-theory', 'moral-development'],
    'social-psychology': ['conformity', 'obedience', 'attribution', 'attitudes-persuasion'],
    'abnormal-psychology': ['mood-disorders', 'anxiety-disorders', 'psychotic-disorders', 'treatment-approaches'],
    'research-methods': ['experimental-design', 'correlation-vs-causation', 'ethics-apa', 'basic-statistics'],
    'neuroscience-intro': ['neuron-structure', 'neurotransmitters', 'brain-regions', 'endocrine-system'],
    'behavioral-psychology': ['classical-conditioning', 'operant-conditioning', 'observational-learning', 'reinforcement-schedules'],
  },
  'foundational': {
    'cognitive-psychology': ['working-memory-baddeley', 'levels-of-processing', 'false-memories', 'decision-making-kahneman'],
    'developmental-psychology': ['vygotsky-zpd', 'language-acquisition', 'lifespan-development', 'temperament'],
    'social-psychology': ['group-dynamics', 'prejudice-stereotypes', 'prosocial-behavior', 'cognitive-dissonance'],
    'abnormal-psychology': ['dsm-5-criteria', 'personality-disorders', 'neurodevelopmental', 'trauma-disorders'],
    'research-methods': ['validity-reliability', 'sampling-methods', 'apa-writing', 'effect-sizes'],
    'neuroscience-intro': ['neuroplasticity', 'brain-imaging', 'lateralization', 'psychopharmacology'],
    'behavioral-psychology': ['behavior-modification', 'token-economies', 'applied-behavior-analysis', 'extinction'],
  },
  'core': {
    'cognitive-psychology': ['dual-process-theory', 'language-cognition', 'expertise-chunking', 'metacognition'],
    'developmental-psychology': ['adolescent-development', 'aging-cognition', 'cross-cultural-development', 'resilience'],
    'social-psychology': ['implicit-bias', 'stereotype-threat', 'social-identity', 'bystander-effect'],
    'abnormal-psychology': ['biopsychosocial-model', 'evidence-based-treatment', 'comorbidity', 'cultural-considerations'],
    'research-methods': ['quasi-experiments', 'meta-analysis', 'qualitative-methods', 'replication-crisis'],
    'neuroscience-intro': ['neural-networks', 'consciousness', 'sleep-neuroscience', 'stress-brain'],
    'behavioral-psychology': ['behavioral-therapy', 'cbt-foundations', 'habit-formation', 'self-regulation'],
  },
  'advanced': {
    'cognitive-psychology': ['computational-models', 'embodied-cognition', 'cognitive-neuroscience', 'cognitive-aging'],
    'developmental-psychology': ['epigenetics-development', 'developmental-psychopathology', 'parenting-research', 'positive-youth-development'],
    'social-psychology': ['social-neuroscience', 'culture-cognition', 'intergroup-contact', 'moral-psychology'],
    'abnormal-psychology': ['treatment-outcome-research', 'transdiagnostic-approaches', 'global-mental-health', 'psychotherapy-integration'],
    'research-methods': ['structural-equation-modeling', 'multilevel-modeling', 'open-science', 'research-thesis'],
    'neuroscience-intro': ['connectomics', 'neuroethics', 'brain-computer-interface', 'translational-neuroscience'],
    'behavioral-psychology': ['acceptance-commitment-therapy', 'behavioral-economics', 'behavioral-genetics', 'animal-cognition'],
  },
};

const QUESTION_BANKS = {
  'introductory': {
    'memory-models': {
      questions: [
        { q: 'The Atkinson-Shiffrin model proposes what three stages of memory?', a: 'sensory memory, short-term memory, and long-term memory', type: 'recall', options: ['sensory memory, short-term memory, and long-term memory', 'encoding, storage, retrieval', 'implicit, explicit, procedural', 'visual, auditory, haptic'] },
        { q: 'The serial position effect shows that people best recall items from which positions in a list?', a: 'the beginning (primacy) and end (recency)', type: 'recall', options: ['the beginning (primacy) and end (recency)', 'only the middle', 'random positions', 'only the end'] },
        { q: 'Baddeley\'s working memory model includes what central component?', a: 'the central executive', type: 'recall', options: ['the central executive', 'the hippocampus', 'the sensory register', 'the cerebellum'] },
        { q: 'Episodic memory stores what type of information?', a: 'personal experiences and events', type: 'concept', options: ['personal experiences and events', 'word meanings', 'motor skills', 'conditioned responses'] },
        { q: 'The misinformation effect, studied by Elizabeth Loftus, shows that memories can be what?', a: 'altered by misleading post-event information', type: 'recall', options: ['altered by misleading post-event information', 'permanently erased', 'perfectly accurate', 'only visual'] },
      ],
    },
    'attention': {
      questions: [
        { q: 'Broadbent\'s filter theory proposes that attention works how?', a: 'by filtering information early based on physical characteristics', type: 'recall', options: ['by filtering information early based on physical characteristics', 'by processing all information equally', 'by ignoring all unattended stimuli', 'by using only visual input'] },
        { q: 'The cocktail party effect demonstrates what about attention?', a: 'we can detect personally relevant information even in unattended channels', type: 'concept', options: ['we can detect personally relevant information even in unattended channels', 'we can attend to everything simultaneously', 'auditory attention is unlimited', 'we cannot process speech in noise'] },
        { q: 'The Stroop effect shows interference between what two processes?', a: 'reading and color naming', type: 'recall', options: ['reading and color naming', 'hearing and seeing', 'speaking and listening', 'memory and attention'] },
      ],
    },
    'heuristics-biases': {
      questions: [
        { q: 'The availability heuristic leads people to judge probability based on what?', a: 'how easily examples come to mind', type: 'concept', options: ['how easily examples come to mind', 'statistical calculation', 'expert opinion', 'random guessing'] },
        { q: 'Confirmation bias refers to the tendency to do what?', a: 'seek and interpret information that confirms existing beliefs', type: 'concept', options: ['seek and interpret information that confirms existing beliefs', 'reject all new information', 'change beliefs frequently', 'rely on authority'] },
        { q: 'The framing effect shows that decisions change based on what?', a: 'how options are presented (as gains vs. losses)', type: 'concept', options: ['how options are presented (as gains vs. losses)', 'the number of options', 'the time available', 'the decision-maker\'s age'] },
      ],
    },
    'problem-solving': {
      questions: [
        { q: 'Functional fixedness refers to the inability to see what about an object?', a: 'uses beyond its typical function', type: 'concept', options: ['uses beyond its typical function', 'its color', 'its size', 'how to name it'] },
        { q: 'Duncker\'s candle problem demonstrates what cognitive barrier?', a: 'functional fixedness', type: 'recall', options: ['functional fixedness', 'confirmation bias', 'anchoring', 'the availability heuristic'] },
      ],
    },
    'piaget-stages': {
      questions: [
        { q: 'In Piaget\'s theory, the sensorimotor stage spans what ages?', a: 'birth to about 2 years', type: 'recall', options: ['birth to about 2 years', '2 to 7 years', '7 to 11 years', '11 years and up'] },
        { q: 'Object permanence develops during which Piagetian stage?', a: 'sensorimotor', type: 'recall', options: ['sensorimotor', 'preoperational', 'concrete operational', 'formal operational'] },
        { q: 'Conservation (understanding that quantity remains despite appearance change) develops in which stage?', a: 'concrete operational', type: 'recall', options: ['concrete operational', 'sensorimotor', 'preoperational', 'formal operational'] },
        { q: 'Egocentrism is most characteristic of which Piagetian stage?', a: 'preoperational', type: 'recall', options: ['preoperational', 'sensorimotor', 'concrete operational', 'formal operational'] },
        { q: 'Abstract and hypothetical thinking characterizes which stage?', a: 'formal operational', type: 'recall', options: ['formal operational', 'concrete operational', 'preoperational', 'sensorimotor'] },
      ],
    },
    'erikson-stages': {
      questions: [
        { q: 'Erikson\'s first psychosocial crisis is what?', a: 'trust vs. mistrust', type: 'recall', options: ['trust vs. mistrust', 'autonomy vs. shame', 'initiative vs. guilt', 'industry vs. inferiority'] },
        { q: 'The identity vs. role confusion crisis occurs during what life stage?', a: 'adolescence', type: 'recall', options: ['adolescence', 'infancy', 'early childhood', 'late adulthood'] },
        { q: 'Generativity vs. stagnation is the crisis of what life stage?', a: 'middle adulthood', type: 'recall', options: ['middle adulthood', 'young adulthood', 'adolescence', 'late adulthood'] },
      ],
    },
    'attachment-theory': {
      questions: [
        { q: 'Mary Ainsworth\'s Strange Situation identified what types of attachment?', a: 'secure, avoidant, anxious-ambivalent (and later disorganized)', type: 'recall', options: ['secure, avoidant, anxious-ambivalent (and later disorganized)', 'strong and weak', 'positive and negative', 'maternal and paternal'] },
        { q: 'John Bowlby proposed that attachment serves what evolutionary function?', a: 'ensuring infant survival by maintaining proximity to caregivers', type: 'concept', options: ['ensuring infant survival by maintaining proximity to caregivers', 'developing language', 'building intelligence', 'learning social norms'] },
        { q: 'Secure attachment is associated with what caregiver behavior?', a: 'consistent, responsive, and sensitive caregiving', type: 'concept', options: ['consistent, responsive, and sensitive caregiving', 'strict discipline', 'minimal interaction', 'unpredictable responses'] },
      ],
    },
    'moral-development': {
      questions: [
        { q: 'Kohlberg\'s preconventional level of moral reasoning is based on what?', a: 'self-interest and avoiding punishment', type: 'concept', options: ['self-interest and avoiding punishment', 'social norms', 'universal ethical principles', 'religious authority'] },
        { q: 'Carol Gilligan critiqued Kohlberg for overlooking what perspective?', a: 'an ethic of care (more common in women\'s moral reasoning)', type: 'recall', options: ['an ethic of care (more common in women\'s moral reasoning)', 'religious morality', 'evolutionary ethics', 'legal reasoning'] },
      ],
    },
    'conformity': {
      questions: [
        { q: 'Asch\'s line judgment experiment demonstrated what?', a: 'people conform to group opinion even when the group is clearly wrong', type: 'recall', options: ['people conform to group opinion even when the group is clearly wrong', 'people always resist group pressure', 'visual perception is unreliable', 'people cannot judge line lengths'] },
        { q: 'Normative social influence involves conforming to do what?', a: 'gain social acceptance or avoid rejection', type: 'concept', options: ['gain social acceptance or avoid rejection', 'gain accurate information', 'obey authority', 'express individuality'] },
        { q: 'Informational social influence involves conforming because of what?', a: 'believing others have accurate information', type: 'concept', options: ['believing others have accurate information', 'fear of punishment', 'desire for rewards', 'habit'] },
      ],
    },
    'obedience': {
      questions: [
        { q: 'In Milgram\'s experiment, approximately what percentage of participants administered the maximum shock?', a: '65%', type: 'recall', options: ['65%', '10%', '90%', '35%'] },
        { q: 'Which factor increased disobedience in Milgram\'s variations?', a: 'physical proximity to the learner', type: 'recall', options: ['physical proximity to the learner', 'higher pay', 'a more prestigious setting', 'younger participants'] },
        { q: 'Milgram\'s experiment demonstrated the power of what?', a: 'situational authority over individual resistance', type: 'concept', options: ['situational authority over individual resistance', 'personality traits', 'intelligence', 'cultural background'] },
      ],
    },
    'attribution': {
      questions: [
        { q: 'The fundamental attribution error is the tendency to do what?', a: 'overattribute others\' behavior to dispositional (internal) factors', type: 'concept', options: ['overattribute others\' behavior to dispositional (internal) factors', 'blame situations for everything', 'accurately assess causes', 'attribute success to luck'] },
        { q: 'The actor-observer bias means that we tend to attribute our own behavior to what?', a: 'situational factors', type: 'concept', options: ['situational factors', 'personality traits', 'genetics', 'childhood experiences'] },
      ],
    },
    'attitudes-persuasion': {
      questions: [
        { q: 'The elaboration likelihood model identifies what two routes to persuasion?', a: 'central and peripheral', type: 'recall', options: ['central and peripheral', 'direct and indirect', 'conscious and unconscious', 'verbal and nonverbal'] },
        { q: 'Cognitive dissonance theory (Festinger) predicts that people change attitudes when what occurs?', a: 'their behavior conflicts with their beliefs, creating psychological discomfort', type: 'concept', options: ['their behavior conflicts with their beliefs, creating psychological discomfort', 'they are paid to change', 'they hear a persuasive argument', 'they are punished'] },
      ],
    },
    'mood-disorders': {
      questions: [
        { q: 'Major depressive disorder requires depressed mood or anhedonia lasting at least how long?', a: 'two weeks', type: 'recall', options: ['two weeks', 'one day', 'six months', 'one year'] },
        { q: 'Bipolar I disorder is distinguished from Bipolar II by the presence of what?', a: 'full manic episodes (vs. hypomanic)', type: 'concept', options: ['full manic episodes (vs. hypomanic)', 'more severe depression', 'psychotic features only', 'earlier onset'] },
        { q: 'SSRIs treat depression by affecting what neurotransmitter?', a: 'serotonin', type: 'recall', options: ['serotonin', 'dopamine', 'GABA', 'acetylcholine'] },
      ],
    },
    'anxiety-disorders': {
      questions: [
        { q: 'Generalized anxiety disorder is characterized by what?', a: 'persistent, excessive worry about multiple domains for at least 6 months', type: 'concept', options: ['persistent, excessive worry about multiple domains for at least 6 months', 'fear of a specific object', 'recurrent panic attacks', 'social avoidance only'] },
        { q: 'Exposure therapy is the primary behavioral treatment for what type of disorders?', a: 'anxiety disorders (especially phobias)', type: 'recall', options: ['anxiety disorders (especially phobias)', 'psychotic disorders', 'personality disorders', 'neurodevelopmental disorders'] },
      ],
    },
    'psychotic-disorders': {
      questions: [
        { q: 'Positive symptoms of schizophrenia include what?', a: 'hallucinations and delusions', type: 'recall', options: ['hallucinations and delusions', 'flat affect and social withdrawal', 'anxiety and depression', 'memory loss'] },
        { q: 'Negative symptoms of schizophrenia include what?', a: 'flat affect, social withdrawal, and reduced motivation', type: 'recall', options: ['flat affect, social withdrawal, and reduced motivation', 'hallucinations', 'delusions', 'disorganized speech only'] },
        { q: 'The dopamine hypothesis suggests schizophrenia involves what?', a: 'excess dopamine activity in certain brain pathways', type: 'recall', options: ['excess dopamine activity in certain brain pathways', 'low serotonin', 'too much GABA', 'acetylcholine deficiency'] },
      ],
    },
    'treatment-approaches': {
      questions: [
        { q: 'CBT (Cognitive Behavioral Therapy) targets what?', a: 'maladaptive thoughts and behaviors', type: 'concept', options: ['maladaptive thoughts and behaviors', 'unconscious conflicts only', 'brain chemistry directly', 'family dynamics exclusively'] },
        { q: 'Psychodynamic therapy focuses on what?', a: 'unconscious conflicts, early relationships, and defense mechanisms', type: 'concept', options: ['unconscious conflicts, early relationships, and defense mechanisms', 'behavioral modification', 'medication management', 'cognitive restructuring'] },
      ],
    },
    'experimental-design': {
      questions: [
        { q: 'The independent variable in an experiment is what?', a: 'the variable manipulated by the researcher', type: 'concept', options: ['the variable manipulated by the researcher', 'the variable measured as outcome', 'a confounding variable', 'a control variable'] },
        { q: 'Random assignment serves what purpose?', a: 'equalizing groups on potential confounding variables', type: 'concept', options: ['equalizing groups on potential confounding variables', 'selecting participants', 'measuring the DV', 'eliminating the need for statistics'] },
        { q: 'A double-blind procedure controls for what?', a: 'experimenter bias and participant expectation effects', type: 'concept', options: ['experimenter bias and participant expectation effects', 'sampling error', 'measurement error', 'attrition'] },
      ],
    },
    'correlation-vs-causation': {
      questions: [
        { q: 'A correlation coefficient of -0.85 indicates what?', a: 'a strong negative relationship', type: 'application', options: ['a strong negative relationship', 'a weak relationship', 'no relationship', 'a positive relationship'] },
        { q: 'Why can correlational studies not establish causation?', a: 'there may be third variables and the direction of causation is unclear', type: 'concept', options: ['there may be third variables and the direction of causation is unclear', 'correlations are always small', 'they use too many participants', 'they lack statistical tests'] },
      ],
    },
    'ethics-apa': {
      questions: [
        { q: 'Informed consent requires what from research participants?', a: 'voluntary agreement based on understanding of the study\'s procedures and risks', type: 'concept', options: ['voluntary agreement based on understanding of the study\'s procedures and risks', 'a signed payment receipt', 'a college degree', 'approval from their family'] },
        { q: 'Debriefing after a study serves what purpose?', a: 'explaining the true nature of the study, especially if deception was used', type: 'concept', options: ['explaining the true nature of the study, especially if deception was used', 'collecting more data', 'paying participants', 'recruiting for future studies'] },
      ],
    },
    'basic-statistics': {
      questions: [
        { q: 'A p-value less than 0.05 means what in psychology research?', a: 'the result is unlikely to have occurred by chance (statistically significant)', type: 'concept', options: ['the result is unlikely to have occurred by chance (statistically significant)', 'the result is definitely true', 'the effect is large', 'the study is well-designed'] },
        { q: 'What does statistical significance NOT tell you?', a: 'the practical importance or size of the effect', type: 'concept', options: ['the practical importance or size of the effect', 'whether the null hypothesis is rejected', 'the probability of the data given the null', 'whether the test was run correctly'] },
      ],
    },
    'neuron-structure': {
      questions: [
        { q: 'An action potential travels along what part of the neuron?', a: 'the axon', type: 'recall', options: ['the axon', 'the dendrite', 'the cell body', 'the synapse'] },
        { q: 'Synaptic transmission involves the release of what into the synaptic cleft?', a: 'neurotransmitters', type: 'recall', options: ['neurotransmitters', 'blood cells', 'hormones only', 'electrical current'] },
        { q: 'The myelin sheath serves what function?', a: 'insulating the axon to speed up signal transmission', type: 'concept', options: ['insulating the axon to speed up signal transmission', 'producing neurotransmitters', 'receiving signals', 'storing memories'] },
      ],
    },
    'neurotransmitters': {
      questions: [
        { q: 'Dopamine is most associated with what functions?', a: 'reward, motivation, and motor control', type: 'recall', options: ['reward, motivation, and motor control', 'sleep only', 'pain perception only', 'immune function'] },
        { q: 'Low serotonin activity is linked to what condition?', a: 'depression', type: 'recall', options: ['depression', 'schizophrenia', 'Parkinson\'s disease', 'epilepsy'] },
        { q: 'GABA is the brain\'s primary what type of neurotransmitter?', a: 'inhibitory', type: 'recall', options: ['inhibitory', 'excitatory', 'modulatory', 'structural'] },
      ],
    },
    'brain-regions': {
      questions: [
        { q: 'Broca\'s area is associated with what function?', a: 'speech production', type: 'recall', options: ['speech production', 'speech comprehension', 'visual processing', 'motor coordination'] },
        { q: 'The hippocampus plays a critical role in what?', a: 'forming new long-term memories', type: 'recall', options: ['forming new long-term memories', 'motor control', 'visual processing', 'breathing'] },
        { q: 'The amygdala is most associated with processing what?', a: 'emotions, especially fear', type: 'recall', options: ['emotions, especially fear', 'language', 'motor skills', 'logical reasoning'] },
      ],
    },
    'endocrine-system': {
      questions: [
        { q: 'The HPA axis is activated during what?', a: 'stress response', type: 'recall', options: ['stress response', 'sleep', 'digestion', 'growth'] },
        { q: 'Cortisol is released by what gland?', a: 'adrenal glands', type: 'recall', options: ['adrenal glands', 'pituitary gland', 'thyroid gland', 'pineal gland'] },
      ],
    },
    'classical-conditioning': {
      questions: [
        { q: 'In Pavlov\'s experiment, the bell became what?', a: 'a conditioned stimulus', type: 'recall', options: ['a conditioned stimulus', 'an unconditioned stimulus', 'a conditioned response', 'an unconditioned response'] },
        { q: 'Extinction in classical conditioning occurs when what happens?', a: 'the CS is repeatedly presented without the US', type: 'concept', options: ['the CS is repeatedly presented without the US', 'the organism dies', 'a new CS is introduced', 'the US becomes stronger'] },
        { q: 'Little Albert\'s conditioned fear demonstrates what?', a: 'emotional responses can be classically conditioned', type: 'recall', options: ['emotional responses can be classically conditioned', 'all fears are innate', 'children cannot learn fear', 'phobias require trauma'] },
      ],
    },
    'operant-conditioning': {
      questions: [
        { q: 'Positive reinforcement involves what?', a: 'adding a pleasant stimulus to increase behavior', type: 'concept', options: ['adding a pleasant stimulus to increase behavior', 'removing a stimulus', 'adding an unpleasant stimulus', 'decreasing behavior'] },
        { q: 'Negative reinforcement involves what?', a: 'removing an aversive stimulus to increase behavior', type: 'concept', options: ['removing an aversive stimulus to increase behavior', 'punishment', 'adding something unpleasant', 'extinction'] },
        { q: 'Punishment decreases behavior by doing what?', a: 'adding an aversive consequence or removing a positive one', type: 'concept', options: ['adding an aversive consequence or removing a positive one', 'increasing reinforcement', 'ignoring the behavior', 'rewarding alternatives'] },
      ],
    },
    'observational-learning': {
      questions: [
        { q: 'Bandura\'s Bobo doll experiment demonstrated what?', a: 'children learn aggressive behavior by observing models', type: 'recall', options: ['children learn aggressive behavior by observing models', 'aggression is innate', 'punishment stops aggression', 'children cannot imitate adults'] },
        { q: 'Observational learning requires what four processes according to Bandura?', a: 'attention, retention, reproduction, and motivation', type: 'recall', options: ['attention, retention, reproduction, and motivation', 'stimulus, response, reinforcement, punishment', 'encoding, storage, retrieval, forgetting', 'sensation, perception, cognition, action'] },
      ],
    },
    'reinforcement-schedules': {
      questions: [
        { q: 'Which reinforcement schedule produces the highest, most consistent response rate?', a: 'variable ratio', type: 'recall', options: ['variable ratio', 'fixed ratio', 'variable interval', 'fixed interval'] },
        { q: 'A slot machine operates on what schedule of reinforcement?', a: 'variable ratio', type: 'application', options: ['variable ratio', 'fixed ratio', 'variable interval', 'fixed interval'] },
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
  return { studentId: id, level: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
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
function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

function generateExercise(level, skill, count = 5) {
  const bank = QUESTION_BANKS[level]?.[skill];
  if (!bank || !bank.questions) return { error: `No question bank for ${level}/${skill}` };
  const items = pick(bank.questions, count).map(q => ({ prompt: q.q, answer: q.a, type: q.type, options: q.options || [] }));
  return { type: 'college-psychology', skill, level, count: items.length, instruction: 'Answer each question. Choose the best answer or provide a concise response.', items };
}

function checkAnswer(type, expected, answer) { return { correct: norm(expected) === norm(answer), expected, studentAnswer: answer }; }

class Psychology {
  getProfile(id) { const p = loadProfile(id); return { studentId: p.studentId, level: p.level, createdAt: p.createdAt, totalAssessments: p.assessments.length }; }

  setLevel(id, level) {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    const p = loadProfile(id); p.level = level; saveProfile(p); return { studentId: id, level };
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
    const p = loadProfile(id); const level = p.level || 'introductory'; const ls = SKILLS[level] || {};
    const results = {}; let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(ls)) { results[cat] = {}; for (const sk of skills) { total++; const d = p.skills[`${level}/${cat}/${sk}`]; results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' }; if (d && d.mastery >= MASTERY_THRESHOLD) mastered++; } }
    return { studentId: id, level, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id); const level = p.level || 'introductory'; const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS[level] || {})) { for (const sk of skills) { const d = p.skills[`${level}/${cat}/${sk}`]; const m = d ? d.mastery : 0; if (m < MASTERY_THRESHOLD) candidates.push({ level, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' }); } }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, level, next: candidates.slice(0, count) };
  }

  getReport(id) { const p = loadProfile(id); return { studentId: id, level: p.level, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }
  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }

  getSkillCatalog(level) {
    const ls = SKILLS[level]; if (!ls) return { level, error: `Unknown level. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0; const catalog = {};
    for (const [cat, skills] of Object.entries(ls)) { total += skills.length; catalog[cat] = [...skills]; }
    return { level, skills: catalog, totalSkills: total };
  }

  generateExercise(level, skill, count = 5) { return generateExercise(level, skill, count); }
  checkAnswer(type, expected, answer) { return checkAnswer(type, expected, answer); }

  generateLesson(id) {
    const p = loadProfile(id); const level = p.level || 'introductory';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Ready for next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    return { studentId: id, level, targetSkill: target, exercise, lessonPlan: { review: 'Review previously learned concepts (2-3 min)', teach: `Introduce/reinforce: ${target.category} > ${target.skill}`, practice: `Complete ${exercise.count || 0} practice items`, apply: 'Connect to research studies and real-world applications', reflect: 'Identify what was learned and what needs more work' } };
  }
}

module.exports = Psychology;

if (require.main === module) {
  const args = process.argv.slice(2); const cmd = args[0]; const api = new Psychology();
  const out = d => console.log(JSON.stringify(d, null, 2));
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
      default: out({ usage: 'node psychology.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
