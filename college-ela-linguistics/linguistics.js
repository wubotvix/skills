// College ELA Linguistics Lab (Intro-Advanced). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-ela-linguistics');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'intro': {
    'phonetics-phonology': ['ipa-consonants', 'ipa-vowels'],
    'morphology': ['morpheme-id'],
    'syntax': ['phrase-structure'],
    'semantics-pragmatics': ['word-relations', 'speech-acts'],
  },
  'intermediate': {
    'phonetics-phonology': ['phonological-rules'],
    'morphology': ['word-formation'],
    'syntax': ['x-bar-syntax'],
    'semantics-pragmatics': ['compositional-semantics', 'grices-maxims'],
  },
  'advanced': {
    'phonetics-phonology': ['optimality-theory'],
    'semantics-pragmatics': ['formal-semantics', 'discourse-analysis'],
    'morphology': ['language-change'],
  },
};

const ITEM_BANKS = {
  'intro': {
    'ipa-consonants': {
      type: 'ipa-id', instruction: 'Identify the IPA symbol for the described consonant sound.',
      items: [
        { prompt: 'Voiceless bilabial plosive (as in "pat")', answer: 'p', options: ['p', 'b', 't', 'k'] },
        { prompt: 'Voiced alveolar nasal (as in "nap")', answer: 'n', options: ['n', 'm', 'ŋ', 'ɲ'] },
        { prompt: 'Voiceless labiodental fricative (as in "fan")', answer: 'f', options: ['f', 'v', 'θ', 's'] },
        { prompt: 'Voiced velar plosive (as in "gap")', answer: 'ɡ', options: ['ɡ', 'k', 'd', 'b'] },
        { prompt: 'Voiceless postalveolar affricate (as in "chip")', answer: 'tʃ', options: ['tʃ', 'dʒ', 'ʃ', 'ʒ'] },
        { prompt: 'Voiced bilabial plosive (as in "bat")', answer: 'b', options: ['b', 'p', 'd', 'v'] },
      ],
    },
    'ipa-vowels': {
      type: 'ipa-id', instruction: 'Identify the IPA symbol for the described vowel sound.',
      items: [
        { prompt: 'Close front unrounded vowel (as in "fleece")', answer: 'iː', options: ['iː', 'ɪ', 'eɪ', 'uː'] },
        { prompt: 'Open back unrounded vowel (as in "father")', answer: 'ɑː', options: ['ɑː', 'æ', 'ɒ', 'ʌ'] },
        { prompt: 'Close-mid front unrounded vowel (as in "face" nucleus)', answer: 'e', options: ['e', 'ɛ', 'æ', 'ɪ'] },
        { prompt: 'Near-close near-front unrounded vowel (as in "kit")', answer: 'ɪ', options: ['ɪ', 'iː', 'e', 'æ'] },
        { prompt: 'Open-mid back rounded vowel (as in "thought")', answer: 'ɔː', options: ['ɔː', 'oʊ', 'ɒ', 'ʌ'] },
        { prompt: 'Mid central vowel / schwa (as in "about")', answer: 'ə', options: ['ə', 'ʌ', 'ɜː', 'ɪ'] },
      ],
    },
    'morpheme-id': {
      type: 'morpheme-segmentation', instruction: 'Segment the word into its constituent morphemes.',
      items: [
        { prompt: 'unhappiness', answer: 'un-happy-ness', options: ['un-happy-ness', 'un-happi-ness', 'unhappy-ness', 'un-happiness'] },
        { prompt: 'rewritable', answer: 're-write-able', options: ['re-write-able', 'rewrite-able', 're-writ-able', 'rewrit-able'] },
        { prompt: 'disorganization', answer: 'dis-organ-ize-ation', options: ['dis-organ-ize-ation', 'dis-organiz-ation', 'disorganize-ation', 'dis-organ-ization'] },
        { prompt: 'teachers', answer: 'teach-er-s', options: ['teach-er-s', 'teacher-s', 'teach-ers', 'tea-cher-s'] },
        { prompt: 'unbreakable', answer: 'un-break-able', options: ['un-break-able', 'un-breakable', 'unbr-eak-able', 'unbreak-able'] },
        { prompt: 'preschoolers', answer: 'pre-school-er-s', options: ['pre-school-er-s', 'pre-schooler-s', 'preschool-er-s', 'pre-school-ers'] },
      ],
    },
    'phrase-structure': {
      type: 'constituent-id', instruction: 'Identify the syntactic constituent type of the bracketed phrase.',
      items: [
        { prompt: '[The old man] walked slowly.', answer: 'NP (Noun Phrase)', options: ['NP (Noun Phrase)', 'VP (Verb Phrase)', 'PP (Prepositional Phrase)', 'AP (Adjective Phrase)'] },
        { prompt: 'She ran [into the garden].', answer: 'PP (Prepositional Phrase)', options: ['PP (Prepositional Phrase)', 'NP (Noun Phrase)', 'VP (Verb Phrase)', 'AdvP (Adverb Phrase)'] },
        { prompt: 'The child [ate the cake quickly].', answer: 'VP (Verb Phrase)', options: ['VP (Verb Phrase)', 'NP (Noun Phrase)', 'S (Sentence)', 'PP (Prepositional Phrase)'] },
        { prompt: 'He is [very tall].', answer: 'AP (Adjective Phrase)', options: ['AP (Adjective Phrase)', 'NP (Noun Phrase)', 'AdvP (Adverb Phrase)', 'VP (Verb Phrase)'] },
        { prompt: 'She spoke [quite clearly].', answer: 'AdvP (Adverb Phrase)', options: ['AdvP (Adverb Phrase)', 'AP (Adjective Phrase)', 'PP (Prepositional Phrase)', 'VP (Verb Phrase)'] },
        { prompt: '[That she left early] surprised everyone.', answer: 'CP (Complementizer Phrase)', options: ['CP (Complementizer Phrase)', 'NP (Noun Phrase)', 'VP (Verb Phrase)', 'IP (Inflection Phrase)'] },
      ],
    },
    'word-relations': {
      type: 'semantic-relation', instruction: 'Identify the semantic relation between the given words.',
      items: [
        { prompt: 'big / large', answer: 'Synonymy', options: ['Synonymy', 'Antonymy', 'Hyponymy', 'Meronymy'] },
        { prompt: 'hot / cold', answer: 'Antonymy', options: ['Antonymy', 'Synonymy', 'Polysemy', 'Homophony'] },
        { prompt: 'rose / flower', answer: 'Hyponymy', options: ['Hyponymy', 'Meronymy', 'Synonymy', 'Antonymy'] },
        { prompt: 'wheel / car', answer: 'Meronymy', options: ['Meronymy', 'Hyponymy', 'Synonymy', 'Holonymy'] },
        { prompt: 'bank (river) / bank (financial)', answer: 'Homonymy', options: ['Homonymy', 'Polysemy', 'Synonymy', 'Antonymy'] },
        { prompt: 'mouth (of person) / mouth (of river)', answer: 'Polysemy', options: ['Polysemy', 'Homonymy', 'Synonymy', 'Metonymy'] },
      ],
    },
    'speech-acts': {
      type: 'speech-act-classify', instruction: 'Classify the speech act performed by the utterance.',
      items: [
        { prompt: '"I promise I will be there at 5."', answer: 'Commissive', options: ['Commissive', 'Directive', 'Assertive', 'Expressive'] },
        { prompt: '"Could you close the window?"', answer: 'Directive', options: ['Directive', 'Commissive', 'Assertive', 'Declarative'] },
        { prompt: '"The Earth revolves around the Sun."', answer: 'Assertive', options: ['Assertive', 'Directive', 'Expressive', 'Declarative'] },
        { prompt: '"Congratulations on your promotion!"', answer: 'Expressive', options: ['Expressive', 'Assertive', 'Commissive', 'Declarative'] },
        { prompt: '"I hereby pronounce you husband and wife."', answer: 'Declarative', options: ['Declarative', 'Commissive', 'Assertive', 'Directive'] },
        { prompt: '"I apologize for the inconvenience."', answer: 'Expressive', options: ['Expressive', 'Commissive', 'Assertive', 'Directive'] },
      ],
    },
  },
  'intermediate': {
    'phonological-rules': {
      type: 'ipa-id', instruction: 'Identify the phonological rule or process illustrated.',
      items: [
        { prompt: '"input" pronounced as [ɪmpʊt] — the /n/ becomes [m] before /p/', answer: 'Assimilation (place)', options: ['Assimilation (place)', 'Deletion', 'Epenthesis', 'Metathesis'] },
        { prompt: '"fifths" often pronounced as [fɪfs] — the /θ/ is dropped', answer: 'Deletion', options: ['Deletion', 'Assimilation', 'Epenthesis', 'Dissimilation'] },
        { prompt: '"athlete" sometimes pronounced as [æθəliːt] — extra vowel added', answer: 'Epenthesis', options: ['Epenthesis', 'Deletion', 'Assimilation', 'Metathesis'] },
        { prompt: '"ask" dialectally pronounced as [æks] — sounds swap order', answer: 'Metathesis', options: ['Metathesis', 'Epenthesis', 'Assimilation', 'Deletion'] },
        { prompt: '"dogs" ends in [z] but "cats" ends in [s] — voicing depends on previous sound', answer: 'Assimilation (voicing)', options: ['Assimilation (voicing)', 'Assimilation (place)', 'Deletion', 'Neutralization'] },
        { prompt: '"pit" [pʰɪt] vs. "spit" [spɪt] — aspiration after word-initial position', answer: 'Aspiration (allophonic rule)', options: ['Aspiration (allophonic rule)', 'Assimilation', 'Epenthesis', 'Fortition'] },
      ],
    },
    'word-formation': {
      type: 'morpheme-segmentation', instruction: 'Identify the word-formation process used to create the word.',
      items: [
        { prompt: '"brunch" (from breakfast + lunch)', answer: 'Blending', options: ['Blending', 'Compounding', 'Clipping', 'Coinage'] },
        { prompt: '"fridge" (from refrigerator)', answer: 'Clipping', options: ['Clipping', 'Blending', 'Backformation', 'Acronym'] },
        { prompt: '"babysit" (from babysitter)', answer: 'Backformation', options: ['Backformation', 'Compounding', 'Derivation', 'Conversion'] },
        { prompt: '"google" (used as a verb meaning to search)', answer: 'Conversion', options: ['Conversion', 'Coinage', 'Derivation', 'Clipping'] },
        { prompt: '"UNESCO"', answer: 'Acronym', options: ['Acronym', 'Initialism', 'Blending', 'Compounding'] },
        { prompt: '"blackboard"', answer: 'Compounding', options: ['Compounding', 'Blending', 'Derivation', 'Clipping'] },
      ],
    },
    'x-bar-syntax': {
      type: 'constituent-id', instruction: 'Identify the correct X-bar structure component.',
      items: [
        { prompt: 'In "very proud of his son," what is the head of the phrase?', answer: 'proud (A/Adjective)', options: ['proud (A/Adjective)', 'very (Adverb)', 'son (Noun)', 'of (Preposition)'] },
        { prompt: 'In X-bar theory, the specifier of IP (TP) is typically...', answer: 'The subject NP', options: ['The subject NP', 'The verb', 'The object NP', 'The complementizer'] },
        { prompt: 'What is the complement of V in "put the book on the table"?', answer: 'NP and PP together', options: ['NP and PP together', 'Only NP "the book"', 'Only PP "on the table"', 'The subject'] },
        { prompt: 'In "the student of physics," "of physics" is a...', answer: 'Complement of N', options: ['Complement of N', 'Specifier of N', 'Adjunct of N', 'Head of NP'] },
        { prompt: 'An adjunct differs from a complement because adjuncts are...', answer: 'Optional and not selected by the head', options: ['Optional and not selected by the head', 'Required by the head', 'Always prepositional phrases', 'Always adverbs'] },
        { prompt: 'In "that she left," "that" occupies which position?', answer: 'C (Complementizer) head', options: ['C (Complementizer) head', 'Specifier of CP', 'Specifier of IP', 'Adjunct of VP'] },
      ],
    },
    'compositional-semantics': {
      type: 'semantic-relation', instruction: 'Analyze the compositional meaning or semantic property.',
      items: [
        { prompt: '"Every student passed the exam." — What is the quantifier scope?', answer: 'Universal quantifier scoping over the predicate', options: ['Universal quantifier scoping over the predicate', 'Existential quantifier', 'Negation scoping over universal', 'No quantifier present'] },
        { prompt: '"The cat sat on the mat." — This sentence\'s truth conditions require...', answer: 'A unique cat sitting on a unique mat', options: ['A unique cat sitting on a unique mat', 'Any cat on any mat', 'Multiple cats', 'A hypothetical situation'] },
        { prompt: '"Colorless green ideas sleep furiously." — This is semantically...', answer: 'Syntactically well-formed but semantically anomalous', options: ['Syntactically well-formed but semantically anomalous', 'Both syntactically and semantically well-formed', 'Syntactically ill-formed', 'A meaningful metaphor'] },
        { prompt: '"John broke the vase" entails "The vase broke." This is an example of...', answer: 'Entailment via causative-inchoative alternation', options: ['Entailment via causative-inchoative alternation', 'Presupposition', 'Implicature', 'Contradiction'] },
        { prompt: 'The meaning of "big ant" vs. "big elephant" shows that "big" is...', answer: 'Context-dependent / relative adjective', options: ['Context-dependent / relative adjective', 'Absolute adjective', 'Ambiguous', 'Meaningless without context'] },
        { prompt: '"Some students didn\'t pass" vs. "Not every student passed" — these readings illustrate...', answer: 'Quantifier scope ambiguity', options: ['Quantifier scope ambiguity', 'Lexical ambiguity', 'Structural ambiguity', 'Pragmatic vagueness'] },
      ],
    },
    'grices-maxims': {
      type: 'speech-act-classify', instruction: 'Identify which of Grice\'s maxims is being flouted or violated.',
      items: [
        { prompt: '"How is your new colleague?" "The weather has been nice lately."', answer: 'Maxim of Relevance (Relation)', options: ['Maxim of Relevance (Relation)', 'Maxim of Quantity', 'Maxim of Quality', 'Maxim of Manner'] },
        { prompt: '"What did you think of the film?" "Well, the popcorn was good."', answer: 'Maxim of Quantity (underinformative, generating implicature)', options: ['Maxim of Quantity (underinformative, generating implicature)', 'Maxim of Quality', 'Maxim of Manner', 'Maxim of Relevance'] },
        { prompt: '"War is war." — a tautology that implies war is terrible', answer: 'Maxim of Quantity (flouted to generate implicature)', options: ['Maxim of Quantity (flouted to generate implicature)', 'Maxim of Quality', 'Maxim of Relevance', 'Maxim of Manner'] },
        { prompt: '"He\'s not the brightest bulb in the box."', answer: 'Maxim of Quality (flouted via metaphor/irony)', options: ['Maxim of Quality (flouted via metaphor/irony)', 'Maxim of Quantity', 'Maxim of Relevance', 'Maxim of Manner'] },
        { prompt: '"Miss X produced a series of sounds corresponding to a well-known aria from Rigoletto."', answer: 'Maxim of Manner (deliberately obscure)', options: ['Maxim of Manner (deliberately obscure)', 'Maxim of Quality', 'Maxim of Quantity', 'Maxim of Relevance'] },
        { prompt: 'Saying "I ate some of the cookies" when you ate all of them', answer: 'Maxim of Quantity (violating — underinforming to mislead)', options: ['Maxim of Quantity (violating — underinforming to mislead)', 'Maxim of Quality', 'Maxim of Manner', 'Maxim of Relevance'] },
      ],
    },
  },
  'advanced': {
    'optimality-theory': {
      type: 'ipa-id', instruction: 'Apply Optimality Theory concepts to the given problem.',
      items: [
        { prompt: 'In OT, constraints are universal but differ across languages by their...', answer: 'Ranking', options: ['Ranking', 'Number', 'Type', 'Presence or absence'] },
        { prompt: 'A faithfulness constraint like MAX-IO ensures...', answer: 'Every input segment has an output correspondent (no deletion)', options: ['Every input segment has an output correspondent (no deletion)', 'No segments are added', 'Syllables have onsets', 'Codas are banned'] },
        { prompt: 'ONSET >> NO-CODA predicts a language that...', answer: 'Prefers syllables with onsets more than it avoids codas', options: ['Prefers syllables with onsets more than it avoids codas', 'Bans all codas', 'Has no onsets', 'Allows any syllable structure'] },
        { prompt: 'The winning candidate in an OT tableau is the one that...', answer: 'Incurs the least serious violation on the highest-ranked constraint where candidates differ', options: ['Incurs the least serious violation on the highest-ranked constraint where candidates differ', 'Violates no constraints', 'Violates the most constraints', 'Is most faithful to the input'] },
        { prompt: 'DEP-IO >> *COMPLEX would prevent...', answer: 'Epenthesis to break up consonant clusters', options: ['Epenthesis to break up consonant clusters', 'Deletion of consonants', 'Vowel harmony', 'Metathesis'] },
        { prompt: 'A "richness of the base" principle in OT means...', answer: 'There are no language-specific restrictions on underlying forms', options: ['There are no language-specific restrictions on underlying forms', 'All inputs produce the same output', 'The base is always richer than the derived form', 'Constraints apply only to underlying forms'] },
      ],
    },
    'formal-semantics': {
      type: 'semantic-relation', instruction: 'Apply formal semantic analysis to the given problem.',
      items: [
        { prompt: 'In lambda calculus, the denotation of "every" is typically...', answer: 'λP.λQ.∀x[P(x) → Q(x)]', options: ['λP.λQ.∀x[P(x) → Q(x)]', 'λP.λQ.∃x[P(x) ∧ Q(x)]', 'λP.∀x[P(x)]', 'λx.P(x)'] },
        { prompt: '"The king of France is bald" (Russell\'s analysis) is...', answer: 'False, because the existence presupposition fails', options: ['False, because the existence presupposition fails', 'True', 'Neither true nor false', 'Meaningless'] },
        { prompt: 'An intensional context is one where...', answer: 'Substitution of co-referring expressions may change truth value', options: ['Substitution of co-referring expressions may change truth value', 'Only extensions matter', 'All expressions are referential', 'Quantifiers are banned'] },
        { prompt: 'In possible-worlds semantics, the intension of a sentence is...', answer: 'A function from possible worlds to truth values', options: ['A function from possible worlds to truth values', 'Its truth value in the actual world', 'The set of its entailments', 'A syntactic representation'] },
        { prompt: 'A monotone-increasing quantifier Q satisfies: if A⊆B and Q(A), then...', answer: 'Q(B)', options: ['Q(B)', 'Q(A∩B)', 'Q(A−B)', 'Nothing follows'] },
        { prompt: 'The type of a transitive verb like "loves" in type theory is...', answer: '⟨e,⟨e,t⟩⟩', options: ['⟨e,⟨e,t⟩⟩', '⟨e,t⟩', '⟨t,e⟩', '⟨e,e⟩'] },
      ],
    },
    'discourse-analysis': {
      type: 'speech-act-classify', instruction: 'Analyze the discourse-level phenomenon illustrated.',
      items: [
        { prompt: '"A man walked in. The man sat down." — "The man" refers to "a man" via...', answer: 'Anaphoric reference (discourse deixis)', options: ['Anaphoric reference (discourse deixis)', 'Cataphoric reference', 'Exophoric reference', 'Homophoric reference'] },
        { prompt: '"She didn\'t steal the money. It was already hers." — The second sentence functions as...', answer: 'Justification (rhetorical relation)', options: ['Justification (rhetorical relation)', 'Elaboration', 'Narration', 'Contrast'] },
        { prompt: 'In conversation, "Well..." at the start of an answer typically signals...', answer: 'A dispreferred or non-straightforward response', options: ['A dispreferred or non-straightforward response', 'Enthusiastic agreement', 'Topic change', 'Ending the conversation'] },
        { prompt: 'A: "It\'s cold in here." B: [closes window]. B treated A\'s utterance as...', answer: 'An indirect request (pragmatic inference)', options: ['An indirect request (pragmatic inference)', 'A factual statement only', 'A complaint about B', 'An irrelevant remark'] },
        { prompt: '"John likes his mother" is ambiguous because "his" can be...', answer: 'Bound by "John" or free (referring to someone else)', options: ['Bound by "John" or free (referring to someone else)', 'Only referring to John', 'Only referring to someone else', 'Semantically empty'] },
        { prompt: 'Topic-comment structure in "As for syntax, it is the study of sentence structure" places "syntax" as...', answer: 'The discourse topic (given/old information)', options: ['The discourse topic (given/old information)', 'The comment (new information)', 'The focus', 'An adjunct'] },
      ],
    },
    'language-change': {
      type: 'morpheme-segmentation', instruction: 'Identify the type of historical or morphological change.',
      items: [
        { prompt: '"Lord" derives from Old English "hlafweard" (loaf-guardian) — meaning has shifted from specific to general', answer: 'Semantic broadening (generalization)', options: ['Semantic broadening (generalization)', 'Semantic narrowing', 'Amelioration', 'Pejoration'] },
        { prompt: '"Meat" once meant any food but now refers only to animal flesh', answer: 'Semantic narrowing (specialization)', options: ['Semantic narrowing (specialization)', 'Semantic broadening', 'Amelioration', 'Metaphorical extension'] },
        { prompt: '"Nice" once meant "foolish/ignorant" (Latin nescius) but now means pleasant', answer: 'Amelioration', options: ['Amelioration', 'Pejoration', 'Semantic narrowing', 'Semantic broadening'] },
        { prompt: 'Loss of case endings in English from Old English to Modern English is an example of...', answer: 'Morphological simplification (analytic drift)', options: ['Morphological simplification (analytic drift)', 'Morphological complexification', 'Phonological change only', 'Syntactic change only'] },
        { prompt: 'The Great Vowel Shift (c. 1400-1700) is a classic example of...', answer: 'Chain shift (systematic phonological change)', options: ['Chain shift (systematic phonological change)', 'Morphological change', 'Syntactic change', 'Semantic change'] },
        { prompt: '"Don\'t" from "do not" is an example of...', answer: 'Grammaticalization with phonological reduction', options: ['Grammaticalization with phonological reduction', 'Semantic broadening', 'Back-formation', 'Blending'] },
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

function exResult(type, skill, level, instruction, items) { return { type, skill, level, count: items.length, instruction, items }; }

function generateExercise(level, skill, count = 5) {
  const bank = ITEM_BANKS[level]?.[skill];
  if (!bank) return { error: `No item bank for ${level}/${skill}` };
  const items = pick(bank.items, count);
  return exResult(bank.type, skill, level, bank.instruction, items);
}

// Answer checking

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
}

// Public API

class Linguistics {
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
    const level = p.level || 'intro';
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
    const level = p.level || 'intro';
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

  getReport(id) {
    const p = loadProfile(id);
    return { studentId: id, level: p.level, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }

  getSkillCatalog(level) {
    const ls = SKILLS[level];
    if (!ls) return { level, error: `Unknown level. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0;
    const catalog = {};
    for (const [cat, skills] of Object.entries(ls)) { total += skills.length; catalog[cat] = [...skills]; }
    return { level, skills: catalog, totalSkills: total };
  }

  generateExercise(level, skill, count = 5) { return generateExercise(level, skill, count); }

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  generateLesson(id) {
    const p = loadProfile(id);
    const level = p.level || 'intro';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Ready for next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    return {
      studentId: id, level, targetSkill: target, exercise,
      lessonPlan: {
        observe: 'Examine language data and identify patterns',
        present: `Focus: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        reflect: 'Metacognitive check: What strategies did you use?',
      },
    };
  }
}

module.exports = Linguistics;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const ling = new Linguistics();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': { const [, id, level] = args; if (!id) throw new Error('Usage: start <id> [level]'); if (level) ling.setLevel(id, level); out({ action: 'start', profile: ling.getProfile(id), nextSkills: ling.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(ling.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const level = loadProfile(id).level || 'intro'; if (skill) { out(ling.generateExercise(level, skill, 5)); } else { const n = ling.getNextSkills(id, 1).next; out(n.length ? ling.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); let exp = expected; try { exp = JSON.parse(expected); } catch {} out(ling.checkAnswer(type, exp, answer)); break; }
      case 'record': { const [, id, level, cat, skill, sc, tot, ...notes] = args; if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total>'); out(ling.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(ling.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(ling.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(ling.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? ling.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(ling.setLevel(id, l)); break; }
      case 'students': { out(ling.listStudents()); break; }
      default: out({ usage: 'node linguistics.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
