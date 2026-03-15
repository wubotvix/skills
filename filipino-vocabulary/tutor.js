'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'filipino-vocabulary';
const MAX_NEW_PER_SESSION = 7;

// ─── Embedded Word Banks by CEFR Level ───────────────────────────────────────

const WORD_BANKS = {
  A1: [
    // Greetings
    { word: 'kumusta', root: null, category: 'greetings', definition: 'how are you / hello',
      exampleSentence: 'Kumusta ka? Mabuti naman.', collocations: ['Kumusta po', 'Kumusta ka na'], loanword: 'Spanish: como esta', confusions: null },
    { word: 'salamat', root: null, category: 'greetings', definition: 'thank you',
      exampleSentence: 'Maraming salamat po sa tulong.', collocations: ['maraming salamat', 'salamat po'], loanword: null, confusions: null },
    { word: 'paalam', root: null, category: 'greetings', definition: 'goodbye',
      exampleSentence: 'Paalam na po, ingat kayo.', collocations: ['paalam na', 'magpaalam'], loanword: null, confusions: null },
    // Family
    { word: 'nanay', root: null, category: 'family', definition: 'mother',
      exampleSentence: 'Ang nanay ko ay marunong magluto.', collocations: ['nanay ko', 'Inay'], loanword: null, confusions: null },
    { word: 'tatay', root: null, category: 'family', definition: 'father',
      exampleSentence: 'Ang tatay ko ay nagtatrabaho sa opisina.', collocations: ['tatay ko', 'Itay'], loanword: null, confusions: null },
    { word: 'kapatid', root: null, category: 'family', definition: 'sibling',
      exampleSentence: 'Dalawa ang kapatid ko.', collocations: ['kapatid na babae', 'kapatid na lalaki'], loanword: null, confusions: null },
    { word: 'pamilya', root: null, category: 'family', definition: 'family',
      exampleSentence: 'Mahal ko ang pamilya ko.', collocations: ['buong pamilya', 'kapamilya'], loanword: 'Spanish: familia', confusions: null },
    // Food
    { word: 'pagkain', root: 'kain', category: 'food', definition: 'food',
      exampleSentence: 'Masarap ang pagkain dito.', collocations: ['masarap na pagkain', 'pagkaing Pilipino'], loanword: null, confusions: null },
    { word: 'kanin', root: null, category: 'food', definition: 'cooked rice',
      exampleSentence: 'Gusto ko ng kanin at ulam.', collocations: ['mainit na kanin', 'kanin at ulam'], loanword: null, confusions: null },
    { word: 'tubig', root: null, category: 'food', definition: 'water',
      exampleSentence: 'Uminom ka ng maraming tubig.', collocations: ['malamig na tubig', 'baso ng tubig'], loanword: null, confusions: null },
    // Everyday objects
    { word: 'bahay', root: null, category: 'everyday', definition: 'house / home',
      exampleSentence: 'Malaki ang bahay namin.', collocations: ['sa bahay', 'bahay-kubo', 'kabahayan'], loanword: null, confusions: null },
    { word: 'eskwela', root: null, category: 'everyday', definition: 'school',
      exampleSentence: 'Pumupunta ako sa eskwela araw-araw.', collocations: ['sa eskwela', 'kaeskwela'], loanword: 'Spanish: escuela', confusions: null },
    { word: 'mesa', root: null, category: 'everyday', definition: 'table',
      exampleSentence: 'Ilagay mo sa mesa ang pagkain.', collocations: ['sa ibabaw ng mesa', 'mesang kainan'], loanword: 'Spanish: mesa', confusions: null },
    { word: 'silya', root: null, category: 'everyday', definition: 'chair',
      exampleSentence: 'Umupo ka sa silya.', collocations: ['silyang de-gulong'], loanword: 'Spanish: silla', confusions: null },
    // Time / numbers
    { word: 'araw', root: null, category: 'time', definition: 'day / sun',
      exampleSentence: 'Magandang araw ngayon.', collocations: ['araw-araw', 'buong araw', 'mainit ang araw'], loanword: null, confusions: null },
    { word: 'gabi', root: null, category: 'time', definition: 'night / evening',
      exampleSentence: 'Magandang gabi po.', collocations: ['gabi-gabi', 'kagabi'], loanword: null, confusions: [{ word: 'gabi (taro root)', note: 'Stress difference: GAbi=night, gaBl=taro' }] },
    { word: 'ngayon', root: null, category: 'time', definition: 'now / today',
      exampleSentence: 'Ano ang gagawin mo ngayon?', collocations: ['ngayon din', 'ngayong araw'], loanword: null, confusions: null },
    // Adjectives
    { word: 'maganda', root: 'ganda', category: 'adjectives', definition: 'beautiful / nice',
      exampleSentence: 'Maganda ang panahon ngayon.', collocations: ['napakaganda', 'magandang umaga'], loanword: null, confusions: null },
    { word: 'masarap', root: 'sarap', category: 'adjectives', definition: 'delicious',
      exampleSentence: 'Masarap ang adobo ng nanay ko.', collocations: ['napakamasarap', 'masarap na pagkain'], loanword: null, confusions: null },
    { word: 'malaki', root: 'laki', category: 'adjectives', definition: 'big / large',
      exampleSentence: 'Malaki ang bahay nila.', collocations: ['napakalaki', 'malaking bahay'], loanword: null, confusions: null },
  ],

  A2: [
    // Transport
    { word: 'sasakyan', root: 'sakay', category: 'transport', definition: 'vehicle',
      exampleSentence: 'Maraming sasakyan sa daan.', collocations: ['sumakay ng sasakyan', 'pampublikong sasakyan'], loanword: null, confusions: null },
    { word: 'palengke', root: null, category: 'shopping', definition: 'wet market',
      exampleSentence: 'Pumunta kami sa palengke kaninang umaga.', collocations: ['sa palengke', 'mamili sa palengke'], loanword: 'Spanish: palenque', confusions: null },
    { word: 'tindahan', root: 'tinda', category: 'shopping', definition: 'store / shop',
      exampleSentence: 'May tindahan sa kanto.', collocations: ['tindahan ng damit', 'magtinda'], loanword: null, confusions: null },
    { word: 'pera', root: null, category: 'shopping', definition: 'money',
      exampleSentence: 'Wala na akong pera.', collocations: ['may pera', 'kulang ang pera'], loanword: 'Spanish: perra (old coin)', confusions: null },
    // Weather
    { word: 'ulan', root: null, category: 'weather', definition: 'rain',
      exampleSentence: 'Malakas ang ulan ngayon.', collocations: ['tag-ulan', 'umuulan'], loanword: null, confusions: null },
    { word: 'init', root: null, category: 'weather', definition: 'heat / hot',
      exampleSentence: 'Napakainit ngayon!', collocations: ['tag-init', 'mainit'], loanword: null, confusions: null },
    { word: 'panahon', root: null, category: 'weather', definition: 'weather / time / season',
      exampleSentence: 'Maganda ang panahon ngayon.', collocations: ['sa panahon ng', 'masamang panahon'], loanword: null, confusions: null },
    // Health
    { word: 'sakit', root: null, category: 'health', definition: 'sickness / pain',
      exampleSentence: 'May sakit siya ngayon.', collocations: ['masakit', 'may sakit', 'karamdaman'], loanword: null, confusions: null },
    { word: 'gamot', root: null, category: 'health', definition: 'medicine',
      exampleSentence: 'Uminom ka ng gamot.', collocations: ['inumin ang gamot', 'botika'], loanword: null, confusions: null },
    { word: 'doktor', root: null, category: 'health', definition: 'doctor',
      exampleSentence: 'Pumunta ka sa doktor.', collocations: ['payo ng doktor'], loanword: 'Spanish: doctor', confusions: null },
    // Daily
    { word: 'trabaho', root: null, category: 'daily', definition: 'work / job',
      exampleSentence: 'Mabigat ang trabaho ko ngayon.', collocations: ['magtrabaho', 'lugar ng trabaho'], loanword: 'Spanish: trabajo', confusions: null },
    { word: 'tulog', root: null, category: 'daily', definition: 'sleep',
      exampleSentence: 'Kulang ang tulog ko kagabi.', collocations: ['matulog', 'nakatulog', 'matulog nang maaga'], loanword: null, confusions: null },
    // Actions
    { word: 'pumunta', root: 'punta', category: 'actions', definition: 'to go (somewhere)',
      exampleSentence: 'Pumunta ako sa mall kahapon.', collocations: ['pumunta sa', 'papunta na'], loanword: null, confusions: null },
    { word: 'kumain', root: 'kain', category: 'actions', definition: 'to eat',
      exampleSentence: 'Kumain na ba kayo?', collocations: ['kumain ng', 'kakain pa'], loanword: null, confusions: null },
    { word: 'uminom', root: 'inom', category: 'actions', definition: 'to drink',
      exampleSentence: 'Uminom ka ng tubig.', collocations: ['uminom ng gamot', 'inumin'], loanword: null, confusions: null },
    // Feelings
    { word: 'masaya', root: 'saya', category: 'feelings', definition: 'happy',
      exampleSentence: 'Masaya ako ngayon.', collocations: ['napakamasaya', 'masayang-masaya'], loanword: null, confusions: null },
    { word: 'malungkot', root: 'lungkot', category: 'feelings', definition: 'sad',
      exampleSentence: 'Malungkot siya dahil umalis ang kaibigan niya.', collocations: ['napakalungkot', 'kalungkutan'], loanword: null, confusions: null },
    { word: 'galit', root: null, category: 'feelings', definition: 'angry / anger',
      exampleSentence: 'Huwag kang magalit.', collocations: ['nagagalit', 'pagkagalit'], loanword: null, confusions: null },
    { word: 'takot', root: null, category: 'feelings', definition: 'fear / afraid',
      exampleSentence: 'Takot ako sa dilim.', collocations: ['natatakot', 'katakot-takot'], loanword: null, confusions: null },
    { word: 'gutom', root: null, category: 'feelings', definition: 'hungry',
      exampleSentence: 'Gutom na ako, kakain na tayo!', collocations: ['nagugutom', 'pagkagutom'], loanword: null, confusions: null },
  ],

  B1: [
    // Work
    { word: 'opisina', root: null, category: 'work', definition: 'office',
      exampleSentence: 'Nasa opisina siya ngayon.', collocations: ['sa opisina', 'kaopisina'], loanword: 'Spanish: oficina', confusions: null },
    { word: 'pulong', root: null, category: 'work', definition: 'meeting',
      exampleSentence: 'May pulong kami mamayang hapon.', collocations: ['pulong ng grupo', 'magpulong'], loanword: null, confusions: null },
    { word: 'sweldo', root: null, category: 'work', definition: 'salary',
      exampleSentence: 'Taas na ng sweldo niya.', collocations: ['araw ng sweldo', 'minimum na sweldo'], loanword: 'Spanish: sueldo', confusions: null },
    // Abstract
    { word: 'karanasan', root: 'danas', category: 'abstract', definition: 'experience',
      exampleSentence: 'May karanasan siya sa pagtuturo.', collocations: ['batay sa karanasan', 'maranasang'], loanword: null, confusions: null },
    { word: 'pagbabago', root: 'bago', category: 'abstract', definition: 'change',
      exampleSentence: 'Kailangan ng pagbabago sa sistema.', collocations: ['malaking pagbabago', 'magbago'], loanword: null, confusions: null },
    { word: 'pananaw', root: 'tanaw', category: 'abstract', definition: 'perspective / view',
      exampleSentence: 'Iba ang pananaw niya sa isyung ito.', collocations: ['sa aking pananaw', 'malapad na pananaw'], loanword: null, confusions: null },
    // Sawikain (idioms)
    { word: 'balat-sibuyas', root: null, category: 'idioms', definition: 'onion-skinned (overly sensitive)',
      exampleSentence: 'Huwag kang maging balat-sibuyas.', collocations: ['maging balat-sibuyas'], loanword: null, confusions: null },
    { word: 'matigas ang ulo', root: null, category: 'idioms', definition: 'hard-headed (stubborn)',
      exampleSentence: 'Matigas talaga ang ulo ng batang iyon.', collocations: ['matigas ang ulo'], loanword: null, confusions: null },
    // Education
    { word: 'aralin', root: 'aral', category: 'education', definition: 'lesson / to study (something)',
      exampleSentence: 'Mahirap ang aralin namin ngayon.', collocations: ['aralin sa math', 'pag-aralan'], loanword: null, confusions: null },
    { word: 'guro', root: null, category: 'education', definition: 'teacher',
      exampleSentence: 'Mabait ang guro namin.', collocations: ['guro sa Filipino', 'mga guro'], loanword: null, confusions: null },
    // Connectors
    { word: 'dahil', root: null, category: 'connectors', definition: 'because',
      exampleSentence: 'Hindi ako pumunta dahil may sakit ako.', collocations: ['dahil sa', 'dahil dito'], loanword: null, confusions: [{ word: 'kasi', note: 'Kasi is casual, dahil is neutral/formal' }] },
    { word: 'gayunpaman', root: null, category: 'connectors', definition: 'however / nevertheless',
      exampleSentence: 'Mahirap ang trabaho. Gayunpaman, masaya siya.', collocations: ['gayunpaman'], loanword: null, confusions: null },
    // Daily life
    { word: 'problema', root: null, category: 'daily', definition: 'problem',
      exampleSentence: 'Ano ang problema mo?', collocations: ['malaking problema', 'solusyon sa problema'], loanword: 'Spanish: problema', confusions: null },
    { word: 'tulong', root: null, category: 'daily', definition: 'help',
      exampleSentence: 'Kailangan ko ng tulong.', collocations: ['humingi ng tulong', 'tumulong'], loanword: null, confusions: [{ word: 'tulong', note: 'TUlong=help, tuLONG=push (stress difference)' }] },
    // Salawikain
    { word: 'Kapag may tiyaga, may nilaga', root: null, category: 'salawikain', definition: 'With patience comes reward (lit: with patience, there is stew)',
      exampleSentence: 'Kapag may tiyaga, may nilaga — huwag kang susuko.', collocations: [], loanword: null, confusions: null },
  ],

  B2: [
    { word: 'pananaliksik', root: 'saliksik', category: 'academic', definition: 'research',
      exampleSentence: 'Ang pananaliksik niya ay tungkol sa kalikasan.', collocations: ['magsaliksik', 'resulta ng pananaliksik'], loanword: null, confusions: null },
    { word: 'pamamaraan', root: 'paraan', category: 'academic', definition: 'method / approach',
      exampleSentence: 'Epektibo ang pamamaraan niya sa pagtuturo.', collocations: ['tamang pamamaraan', 'bagong pamamaraan'], loanword: null, confusions: null },
    { word: 'mungkahi', root: null, category: 'work', definition: 'suggestion / proposal',
      exampleSentence: 'Maganda ang mungkahi mo.', collocations: ['magmungkahi', 'alinsunod sa mungkahi'], loanword: null, confusions: null },
    { word: 'pagkakakilanlan', root: 'kilala', category: 'abstract', definition: 'identity',
      exampleSentence: 'Ang wika ay bahagi ng pagkakakilanlan.', collocations: ['pambansang pagkakakilanlan'], loanword: null, confusions: null },
    { word: 'samakatuwid', root: null, category: 'connectors', definition: 'therefore',
      exampleSentence: 'Lumabag siya sa batas. Samakatuwid, may parusa.', collocations: ['samakatuwid'], loanword: null, confusions: null },
    { word: 'sapagkat', root: null, category: 'connectors', definition: 'because (formal)',
      exampleSentence: 'Hindi siya nakapunta sapagkat may sakit siya.', collocations: ['sapagkat'], loanword: null, confusions: [{ word: 'dahil', note: 'Sapagkat is formal, dahil is neutral' }] },
    // Sawikain B2
    { word: 'Nasa huli ang pagsisisi', root: null, category: 'idioms', definition: 'Regret comes at the end (too late to regret)',
      exampleSentence: 'Nag-aral ka sana — nasa huli ang pagsisisi.', collocations: [], loanword: null, confusions: null },
    { word: 'nagbubuhat ng sariling bangko', root: null, category: 'idioms', definition: 'Lifting one\'s own bench (bragging)',
      exampleSentence: 'Huwag mong ibash, pero nagbubuhat ka ata ng sariling bangko.', collocations: [], loanword: null, confusions: null },
    // Society
    { word: 'kalikasan', root: 'likas', category: 'society', definition: 'nature / environment',
      exampleSentence: 'Kailangan nating pangalagaan ang kalikasan.', collocations: ['kalikasan ng tao', 'likas na kalikasan'], loanword: null, confusions: null },
    { word: 'lipunan', root: null, category: 'society', definition: 'society',
      exampleSentence: 'May responsibilidad tayo sa lipunan.', collocations: ['panlipunan', 'kasapi ng lipunan'], loanword: null, confusions: null },
  ],

  C1: [
    { word: 'nararapat', root: 'dapat', category: 'formal', definition: 'appropriate / fitting (formal)',
      exampleSentence: 'Nararapat lamang na kilalanin ang kanilang ambag.', collocations: ['nararapat lamang'], loanword: null, confusions: null },
    { word: 'subalit', root: null, category: 'connectors', definition: 'but / however (literary)',
      exampleSentence: 'Maganda ang plano, subalit mahirap ipatupad.', collocations: ['subalit'], loanword: null, confusions: [{ word: 'pero/ngunit', note: 'pero=casual, ngunit=neutral, subalit=literary' }] },
    { word: 'isinusulong', root: 'sulong', category: 'formal', definition: 'being advocated / being pushed forward',
      exampleSentence: 'Isinusulong ng senado ang bagong batas.', collocations: ['isulong ang reporma'], loanword: null, confusions: null },
    { word: 'pagkakaisa', root: 'isa', category: 'abstract', definition: 'unity',
      exampleSentence: 'Ang pagkakaisa ang susi sa tagumpay.', collocations: ['pagkakaisang-loob', 'magkaisa'], loanword: null, confusions: null },
    { word: 'sa kabila ng', root: null, category: 'connectors', definition: 'despite / in spite of',
      exampleSentence: 'Sa kabila ng kahirapan, nagpatuloy siya.', collocations: ['sa kabila ng lahat'], loanword: null, confusions: null },
  ],

  C2: [
    { word: 'diwata', root: null, category: 'literary', definition: 'nature spirit / fairy (from mythology)',
      exampleSentence: 'Ayon sa alamat, nakatira ang diwata sa bundok.', collocations: ['diwata ng kagubatan'], loanword: null, confusions: null },
    { word: 'dalumat', root: null, category: 'literary', definition: 'concept / deep thought',
      exampleSentence: 'Malalim ang dalumat ng tula.', collocations: ['dalumat ng bayan'], loanword: null, confusions: null },
    { word: 'katwiran', root: 'twiran', category: 'formal', definition: 'reason / justification',
      exampleSentence: 'Walang katwiran ang kanyang ginawa.', collocations: ['makatwiran', 'batayan ng katwiran'], loanword: null, confusions: null },
    { word: 'salvage', root: null, category: 'false-friends', definition: 'extrajudicial killing (Filipino usage — NOT English meaning)',
      exampleSentence: '"Na-salvage daw ang biktima" means the victim was killed.', collocations: ['na-salvage'], loanword: 'English (shifted meaning)', confusions: [{ word: 'salvage (English)', note: 'In English means rescue; in Filipino means extrajudicial killing' }] },
  ],
};

// ─── Exercise Types ──────────────────────────────────────────────────────────

const EXERCISE_TYPES = ['definition', 'fill-in-blank', 'matching', 'context-guess', 'collocation'];

function makeDefinitionExercise(targetWord, level) {
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const distractors = core.pick(bank.filter(w => w.word !== targetWord.word), 3).map(w => w.definition);
  const options = core.shuffle([targetWord.definition, ...distractors]);
  return { type: 'definition', prompt: `Ano ang ibig sabihin ng "${targetWord.word}"?`, options, answer: targetWord.definition, word: targetWord.word };
}

function makeFillInBlankExercise(targetWord) {
  const sentence = targetWord.exampleSentence;
  const escapedWord = targetWord.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedWord, 'i');
  const blanked = sentence.replace(regex, '________');
  if (blanked === sentence) {
    return { type: 'fill-in-blank', prompt: `Punan ang patlang:\n"${sentence.replace(targetWord.word, '________')}"`, answer: targetWord.word, hint: targetWord.definition, word: targetWord.word };
  }
  return { type: 'fill-in-blank', prompt: `Punan ang patlang:\n"${blanked}"`, answer: targetWord.word, hint: targetWord.definition, word: targetWord.word };
}

function makeMatchingExercise(level) {
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const items = core.pick(bank, 5);
  const pairs = items.map(w => ({ word: w.word, definition: w.definition }));
  return { type: 'matching', prompt: 'Itambal ang bawat salita sa kahulugan nito.', pairs, shuffledDefinitions: core.shuffle(pairs.map(p => p.definition)), words: pairs.map(p => p.word) };
}

function makeContextGuessExercise(targetWord) {
  return { type: 'context-guess', prompt: `Basahin ang pangungusap at hulaan ang kahulugan:\n"${targetWord.exampleSentence}"\n\nAno ang ibig sabihin ng "${targetWord.word}"?`, answer: targetWord.definition, word: targetWord.word, confusions: targetWord.confusions };
}

function makeCollocationExercise(targetWord, level) {
  if (!targetWord.collocations || targetWord.collocations.length === 0) return makeDefinitionExercise(targetWord, level);
  const correctCollocation = core.pick(targetWord.collocations, 1)[0];
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const otherCollocations = [];
  for (const w of core.shuffle(bank)) {
    if (w.word !== targetWord.word && w.collocations && w.collocations.length) {
      otherCollocations.push(w.collocations[0]);
      if (otherCollocations.length >= 3) break;
    }
  }
  const options = core.shuffle([correctCollocation, ...otherCollocations]);
  return { type: 'collocation', prompt: `Alin ang karaniwang kasama ng "${targetWord.word}"?`, options, answer: correctCollocation, word: targetWord.word };
}

function generateExercise(targetWord, level, type) {
  switch (type) {
    case 'fill-in-blank': return makeFillInBlankExercise(targetWord);
    case 'matching': return makeMatchingExercise(level);
    case 'context-guess': return makeContextGuessExercise(targetWord);
    case 'collocation': return makeCollocationExercise(targetWord, level);
    default: return makeDefinitionExercise(targetWord, level);
  }
}

function checkAnswer(exercise, userAnswer) {
  const normalise = s => core.norm(s);
  if (exercise.type === 'matching') {
    if (!Array.isArray(userAnswer)) return { correct: false, message: 'Provide matched pairs.' };
    const correctCount = userAnswer.filter(ua => exercise.pairs.some(p => normalise(p.word) === normalise(ua.word) && normalise(p.definition) === normalise(ua.definition))).length;
    return { correct: correctCount === exercise.pairs.length, score: correctCount, total: exercise.pairs.length, message: correctCount === exercise.pairs.length ? 'Tama! Magaling!' : `${correctCount}/${exercise.pairs.length} tama.` };
  }
  const expected = normalise(exercise.answer);
  const given = normalise(userAnswer);
  if (given === expected) return { correct: true, message: 'Tama! Magaling!' };
  if (expected.includes(given) && given.length > 2) return { correct: true, partial: true, message: `Malapit na — ang buong sagot ay "${exercise.answer}".` };
  return { correct: false, message: `Hindi tama. Ang sagot ay "${exercise.answer}".`, expected: exercise.answer };
}

// ─── VocabularyTutor Class ───────────────────────────────────────────────────

class VocabularyTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(id) {
    const p = core.loadProfile(this.dir, id);
    if (!p.level) p.level = 'A1';
    if (!p.skills) p.skills = {};
    if (!p.sessions) p.sessions = [];
    return p;
  }

  setLevel(id, level) {
    if (!core.CEFR.includes(level)) throw new Error(`Invalid CEFR level: ${level}`);
    const p = this.getProfile(id);
    p.level = level;
    core.saveProfile(this.dir, p);
    return { studentId: id, level };
  }

  generateLesson(id) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const bank = WORD_BANKS[level];
    if (!bank) throw new Error(`No word bank for level ${level}`);
    const seen = Object.keys(p.skills);
    const unseen = bank.filter(w => !seen.includes(w.word));
    const newWords = core.pick(unseen.length > 0 ? unseen : bank, Math.min(MAX_NEW_PER_SESSION, unseen.length || MAX_NEW_PER_SESSION));
    const exercises = newWords.map((w, i) => {
      const type = EXERCISE_TYPES[i % EXERCISE_TYPES.length];
      return generateExercise(w, level, type);
    });
    return {
      date: core.today(), level,
      newWords: newWords.map(w => ({ word: w.word, root: w.root, definition: w.definition, exampleSentence: w.exampleSentence, collocations: w.collocations, loanword: w.loanword, confusions: w.confusions, category: w.category })),
      exercises,
    };
  }

  generateExercise(id, type) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const bank = WORD_BANKS[level];
    if (!bank) throw new Error(`No word bank for level ${level}`);
    const targetWord = core.pick(bank, 1)[0];
    const exType = type && EXERCISE_TYPES.includes(type) ? type : core.pick(EXERCISE_TYPES, 1)[0];
    return generateExercise(targetWord, level, exType);
  }

  checkAnswer(exercise, userAnswer) { return checkAnswer(exercise, userAnswer); }

  recordAssessment(id, word, grade) {
    if (!core.isValidGrade(grade, 1, 4)) throw new Error('Grade must be 1-4');
    const p = this.getProfile(id);
    if (!p.skills[word]) { p.skills[word] = { word, encounters: 0, stability: 1, difficulty: 5, lastReview: null, nextReview: null, attempts: [] }; }
    const sk = p.skills[word];
    sk.encounters += 1;
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, grade);
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, grade);
    sk.lastReview = core.today();
    sk.nextReview = (() => { const days = core.fsrsNextReview(sk.stability, core.DEFAULT_RETENTION); const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); })();
    sk.attempts.push({ score: grade >= 3 ? 1 : 0, total: 1, date: core.today() });
    p.assessments.push({ word, grade, date: core.today() });
    core.saveProfile(this.dir, p);
    return { word, grade, mastery: core.masteryLabel(core.calcMastery(sk.attempts)), nextReview: sk.nextReview, encounters: sk.encounters };
  }

  getProgress(id) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const bankSize = (WORD_BANKS[level] || []).length;
    const words = Object.keys(p.skills);
    let masteredCount = 0, totalEncounters = 0;
    for (const w of words) {
      const sk = p.skills[w];
      const m = core.calcMastery(sk.attempts);
      if (m >= core.MASTERY_THRESHOLD) masteredCount++;
      totalEncounters += sk.encounters;
    }
    return { studentId: id, level, wordsStudied: words.length, wordsMastered: masteredCount, totalInLevel: bankSize, totalEncounters };
  }

  getNextTopics(id) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const bank = WORD_BANKS[level] || [];
    const seen = new Set(Object.keys(p.skills));
    const unseen = bank.filter(w => !seen.has(w.word));
    const categories = {};
    for (const w of unseen) { if (!categories[w.category]) categories[w.category] = []; categories[w.category].push(w.word); }
    return { level, unseenCount: unseen.length, byCategory: categories };
  }

  getReport(id) {
    const p = this.getProfile(id);
    const progress = this.getProgress(id);
    const review = this.getReviewDue(id);
    return { studentId: id, level: p.level, createdAt: p.createdAt, ...progress, reviewDueCount: review.length, reviewDueWords: review.map(r => r.word) };
  }

  getReviewDue(id) {
    const p = this.getProfile(id);
    const t = core.today();
    const due = [];
    for (const [word, sk] of Object.entries(p.skills)) {
      if (sk.nextReview && sk.nextReview <= t) due.push({ word, nextReview: sk.nextReview, encounters: sk.encounters, mastery: core.masteryLabel(core.calcMastery(sk.attempts)) });
    }
    return due.sort((a, b) => a.nextReview.localeCompare(b.nextReview));
  }

  listStudents() { return core.listProfiles(this.dir); }

  getWordCatalog(level) {
    const lvl = level && core.CEFR.includes(level) ? level : null;
    if (lvl) return { [lvl]: (WORD_BANKS[lvl] || []).map(w => ({ word: w.word, definition: w.definition, category: w.category, root: w.root, loanword: w.loanword })) };
    const catalog = {};
    for (const l of core.CEFR) { if (WORD_BANKS[l]) catalog[l] = WORD_BANKS[l].map(w => ({ word: w.word, definition: w.definition, category: w.category, root: w.root, loanword: w.loanword })); }
    return catalog;
  }
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

const tutor = new VocabularyTutor();

core.runCLI((cmd, args, out) => {
  const sid = args[1] || 'default';
  switch (cmd) {
    case 'start': out(tutor.getProfile(sid)); break;
    case 'set-level': out(tutor.setLevel(sid, (args[2] || '').toUpperCase())); break;
    case 'lesson': out(tutor.generateLesson(sid)); break;
    case 'exercise': out(tutor.generateExercise(sid, args[2])); break;
    case 'check': { const ex = JSON.parse(args[2]); const ans = args.slice(3).join(' '); out(tutor.checkAnswer(ex, ans)); break; }
    case 'record': out(tutor.recordAssessment(sid, args[2], parseInt(args[3], 10))); break;
    case 'review': out(tutor.getReviewDue(sid)); break;
    case 'progress': out(tutor.getProgress(sid)); break;
    case 'report': out(tutor.getReport(sid)); break;
    case 'next': out(tutor.getNextTopics(sid)); break;
    case 'words': out(tutor.getWordCatalog(args[1] ? args[2].toUpperCase() : null)); break;
    case 'students': out({ students: tutor.listStudents() }); break;
    case 'help':
      out({ info: 'Use one of the commands listed in SKILL.md' });
      break;
    default:
      out({
        usage: 'node tutor.js <command> [studentId] [args...]',
        commands: { start: 'Load or create profile', 'set-level': 'Set CEFR level', lesson: 'Generate lesson', exercise: 'Single exercise [type]', check: 'Check answer', record: 'Record grade (1-4)', review: 'Words due for review', progress: 'Progress summary', report: 'Full report', next: 'Upcoming topics', words: 'Word catalog [level]', students: 'List students' },
      });
  }
});
