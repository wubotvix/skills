// French Pronunciation Tutor -- all data embedded, FSRS-tracked
const core = require('../_lib/core');

const SKILL_NAME = 'french-pronunciation';

// ---------------------------------------------------------------------------
// SOUND DATA by CEFR level
// ---------------------------------------------------------------------------
const SOUNDS = {
  A1: [
    // Oral vowels
    { id: 'v-i', cat: 'vowels', name: 'Close front /i/', ipa: '/i/', desc: 'Lips spread, tongue high and forward. Like English "see" but shorter and tenser.', examples: ['lit','vie','midi','idée'], minimalPairs: [['lit','lu'],['si','su']], commonErrors: ['Too relaxed, not tense enough'] },
    { id: 'v-e', cat: 'vowels', name: 'Close-mid front /e/', ipa: '/e/', desc: 'Lips spread, mid-front. Like "ay" in "say" but WITHOUT the glide. Freeze the position.', examples: ['été','café','aller','parler'], minimalPairs: [['les','lait'],['des','dès']], commonErrors: ['Diphthongizing to /eɪ/'] },
    { id: 'v-a', cat: 'vowels', name: 'Open central /a/', ipa: '/a/', desc: 'Mouth open wide, tongue low. Like English "father" but shorter, crisper.', examples: ['chat','papa','table','madame'], minimalPairs: [['patte','pâte']], commonErrors: ['English /æ/ substitution'] },
    { id: 'v-o', cat: 'vowels', name: 'Close-mid back /o/', ipa: '/o/', desc: 'Lips rounded, mid-back. Like start of "go" WITHOUT the glide.', examples: ['beau','mot','eau','gros'], minimalPairs: [['côte','cotte'],['saute','sotte']], commonErrors: ['Diphthongizing to /oʊ/'] },
    { id: 'v-u', cat: 'vowels', name: 'Close back /u/', ipa: '/u/', desc: 'Lips tightly rounded, tongue high and back. Like English "too" but shorter.', examples: ['vous','tout','où','rouge'], minimalPairs: [['vous','vu'],['tout','tu']], commonErrors: ['Confusing with /y/'] },
    // The key French sound
    { id: 'v-y', cat: 'vowels', name: 'Close front rounded /y/', ipa: '/y/', desc: 'Say /i/ then round your lips WITHOUT moving your tongue. This is the key French sound. No English equivalent.', examples: ['tu','lune','rue','vu'], minimalPairs: [['tu','tout'],['lu','loup'],['vu','vous'],['su','sous']], commonErrors: ['Substituting /u/ (English speakers)','Not rounding lips enough'] },
    // Basic consonants
    { id: 'c-r', cat: 'consonants', name: 'French R /ʁ/', ipa: '/ʁ/', desc: 'Uvular fricative: back of tongue approaches uvula. Like a gentle gargle. NOT alveolar (Spanish/Italian R).', examples: ['rouge','Paris','merci','regarder'], minimalPairs: [['rue','lu']], commonErrors: ['Using English retroflex /ɹ/','Using Spanish trill /r/'] },
    { id: 'c-silent', cat: 'consonants', name: 'Silent final consonants', ipa: '(silent)', desc: 'Most final consonants are silent: petit = /pəti/, pas = /pa/. Exception rule: C-R-F-L are often pronounced (CaReFuL).', examples: ['petit','grand','trop','vous'], minimalPairs: [['vert (silent t)','verre (no final cons.)']], commonErrors: ['Pronouncing all final consonants like English'] },
  ],
  A2: [
    // Nasal vowels
    { id: 'n-an', cat: 'nasals', name: 'Nasal /ɑ̃/', ipa: '/ɑ̃/', desc: 'Open nasal vowel. Start with /a/, let air through nose. Written an, am, en, em.', examples: ['dans','temps','enfant','chambre'], minimalPairs: [['dans','dont'],['an','on'],['lent','long']], commonErrors: ['Adding /n/ after the vowel','Not nasalizing enough'] },
    { id: 'n-on', cat: 'nasals', name: 'Nasal /ɔ̃/', ipa: '/ɔ̃/', desc: 'Rounded nasal vowel. Start with /o/, let air through nose. Written on, om.', examples: ['bon','nom','pont','monter'], minimalPairs: [['bon','bain'],['mon','main'],['pont','pain']], commonErrors: ['Confusing with /ɑ̃/','Adding /n/'] },
    { id: 'n-in', cat: 'nasals', name: 'Nasal /ɛ̃/', ipa: '/ɛ̃/', desc: 'Open-mid nasal vowel. Start with /ɛ/, let air through nose. Written in, im, ain, ein, un.', examples: ['vin','main','plein','brun'], minimalPairs: [['vin','vent'],['bain','bon'],['pain','pont']], commonErrors: ['Confusing with /ɑ̃/','Pronouncing the n'] },
    // E sounds
    { id: 'v-eh', cat: 'vowels', name: 'Open-mid front /ɛ/', ipa: '/ɛ/', desc: 'Lips slightly spread, more open than /e/. Like English "bet".', examples: ['lait','fête','mère','faire'], minimalPairs: [['les','lait'],['été','était']], commonErrors: ['Not distinguishing from /e/'] },
    { id: 'v-schwa', cat: 'vowels', name: 'Schwa /ə/', ipa: '/ə/', desc: 'The "e muet" (mute e). Lips slightly rounded, tongue mid-central. Often dropped in casual speech.', examples: ['le','je','petit','demain'], minimalPairs: [], commonErrors: ['Always pronouncing it','Never pronouncing it'] },
    // Liaison
    { id: 'cs-liaison', cat: 'connected-speech', name: 'Liaison', ipa: '(linking)', desc: 'Silent final consonant pronounced before a vowel-initial word: les amis = /le.za.mi/. Obligatory after determiners, pronouns, prepositions.', examples: ['les amis','un ami','très important','nous avons'], minimalPairs: [['les amis /lezami/','les hamsters /leamstɛʁ/ (h aspiré = no liaison)']], commonErrors: ['Omitting obligatory liaison','Making forbidden liaisons'] },
  ],
  B1: [
    // Rounded front vowels
    { id: 'v-oe', cat: 'vowels', name: 'Open-mid front rounded /œ/', ipa: '/œ/', desc: 'Say /ɛ/ then round lips. Like German ö in "Hölle". Written eu in closed context.', examples: ['peur','heure','fleur','seul'], minimalPairs: [['peur','pur'],['jeune','jaune']], commonErrors: ['Substituting /ɜː/ (English)'] },
    { id: 'v-eu', cat: 'vowels', name: 'Close-mid front rounded /ø/', ipa: '/ø/', desc: 'Say /e/ then round lips. Like German ö in "schön". Written eu in open syllable.', examples: ['peu','jeu','deux','bleu'], minimalPairs: [['peu','peur'],['jeu','je']], commonErrors: ['Not rounding enough'] },
    // Connected speech
    { id: 'cs-enchainement', cat: 'connected-speech', name: 'Enchaînement', ipa: '(linking)', desc: 'Final pronounced consonant links to next vowel-initial word: elle est = /ɛ.lɛ/. Unlike liaison, the consonant is always pronounced.', examples: ['elle est','il a','une amie','pour eux'], minimalPairs: [], commonErrors: ['Inserting glottal stop between words'] },
    { id: 'cs-elision', cat: 'connected-speech', name: 'Elision', ipa: '(contraction)', desc: 'Final vowel dropped before vowel-initial word: le + ami = l\'ami. Mandatory with le, la, je, me, te, se, de, ne, que.', examples: ['l\'ami','j\'ai','c\'est','n\'est-ce pas'], minimalPairs: [], commonErrors: ['Not eliding (saying "je ai")'] },
    // Intonation
    { id: 'i-statement', cat: 'intonation', name: 'Statement intonation', ipa: '↘', desc: 'Gradual descent with fall at end: "Je vais au marché." ↘', examples: ['Je vais au marché.','Il fait beau.','Elle travaille ici.'], minimalPairs: [], commonErrors: ['Rising at end (English uptalk)'] },
    { id: 'i-ynq', cat: 'intonation', name: 'Yes/No question rise', ipa: '↗', desc: 'Rise at end for yes/no questions: "Tu viens ?" ↗', examples: ['Tu viens ?','Il fait beau ?','C\'est prêt ?'], minimalPairs: [], commonErrors: ['Insufficient rise','Falling like a statement'] },
    { id: 's-rhythm', cat: 'stress', name: 'Syllable-timed rhythm & final stress', ipa: 'ˈ', desc: 'French is syllable-timed with stress on the LAST syllable of each phrase group: uni.ver.si.TÉ.', examples: ['u-ni-ver-si-TÉ','ma-GA-sin','res-tau-RANT','im-pos-SI-ble'], minimalPairs: [], commonErrors: ['Stressing non-final syllables (English pattern)','Reducing unstressed vowels'] },
  ],
  B2: [
    // H aspiré
    { id: 'c-hasp', cat: 'consonants', name: 'H aspiré vs h muet', ipa: '(no liaison)', desc: 'H aspiré blocks liaison and elision: le hibou (not l\'hibou). H muet allows them: l\'homme. No sound difference — only affects linking.', examples: ['le hibou','les haricots','la honte','en haut'], minimalPairs: [['les héros /le.e.ʁo/ (h aspiré)','les hommes /le.zɔm/ (h muet)']], commonErrors: ['Treating all h as h muet'] },
    // Semi-vowels
    { id: 'sv-j', cat: 'semi-vowels', name: 'Yod /j/', ipa: '/j/', desc: 'Like English "yes". Written i/y before vowel, or -il/-ille at word end.', examples: ['fille','travail','hier','yeux'], minimalPairs: [['paille /paj/','paye /pɛj/']], commonErrors: ['Not producing in -ille words'] },
    { id: 'sv-w', cat: 'semi-vowels', name: 'Semi-vowel /w/', ipa: '/w/', desc: 'Like English "we". Written ou before vowel.', examples: ['oui','Louis','jouer','moi'], minimalPairs: [], commonErrors: ['Separating into two syllables'] },
    { id: 'sv-y', cat: 'semi-vowels', name: 'Semi-vowel /ɥ/', ipa: '/ɥ/', desc: 'Unique to French. Say /y/ rapidly before another vowel. Written u before vowel.', examples: ['nuit','huit','lui','fruit'], minimalPairs: [['lui /lɥi/','Louis /lwi/']], commonErrors: ['Substituting /w/'] },
    // Intonation
    { id: 'i-whq', cat: 'intonation', name: 'Wh-question fall', ipa: '↘', desc: 'Wh-questions fall at end: "Où habites-tu ?" ↘', examples: ['Où habites-tu ?','Comment ça va ?','Pourquoi ?'], minimalPairs: [], commonErrors: ['Rising like a yes/no question'] },
    { id: 'i-list', cat: 'intonation', name: 'List intonation', ipa: '↗...↘', desc: 'Rise on each item, fall on last: "pommes↗, poires↗, et bananes↘."', examples: ['pommes, poires et bananes','lundi, mardi et mercredi'], minimalPairs: [], commonErrors: ['Falling too early'] },
  ],
  C1: [
    { id: 'cs-nedrop', cat: 'connected-speech', name: 'Ne-dropping', ipa: '(informal)', desc: 'In casual speech, "ne" is almost always dropped: "je sais pas" = /ʃɛpa/. Recognize and optionally produce.', examples: ['je sais pas','c\'est pas vrai','y a pas','j\'ai pas le temps'], minimalPairs: [], commonErrors: ['Always keeping ne in conversation (sounds overly formal)'] },
    { id: 'cs-reduction', cat: 'connected-speech', name: 'Informal reductions', ipa: '(casual)', desc: 'Common reductions: il y a → y a, je suis → chuis, tu es → t\'es, il/elle → i/è.', examples: ['y a /ja/','chuis /ʃɥi/','t\'es /tɛ/','i fait beau /ifɛbo/'], minimalPairs: [], commonErrors: ['Not recognizing reductions in listening'] },
    { id: 'i-emphasis', cat: 'intonation', name: 'Emphatic stress', ipa: 'ˈˈ', desc: 'For emphasis, French adds stress to first syllable: "C\'est FORmidable!" (normal: formidABle).', examples: ['C\'est FORmidable !','INcroyable !','IMpossible !','ABsolument !'], minimalPairs: [], commonErrors: ['Not using initial-syllable emphasis'] },
    { id: 'cs-emuet', cat: 'connected-speech', name: 'E muet mastery', ipa: '/ə/', desc: 'Complex rules for when /ə/ is kept or dropped. Loi des trois consonnes: keep /ə/ to avoid 3+ consonants in a row.', examples: ['sam(e)di','ven(dre)di','je n(e) sais pas','un(e) petit(e) fille'], minimalPairs: [], commonErrors: ['Inconsistent e muet treatment'] },
  ],
  C2: [
    { id: 'cs-full', cat: 'connected-speech', name: 'Native-like connected speech', ipa: '(flow)', desc: 'Full integration: liaison + enchaînement + elision + e muet + reductions in rapid natural speech.', examples: ['Il n\'y en a pas → /jɑ̃napa/','Qu\'est-ce que c\'est que ça ? → /kɛskəsɛksa/'], minimalPairs: [], commonErrors: ['Slowing down at word boundaries'] },
    { id: 'c-regional', cat: 'consonants', name: 'Pan-dialectal awareness', ipa: '(varies)', desc: 'Recognize features across varieties: Quebec affrication (tu → /tsy/), Belgian/Swiss numbers (septante/huitante), African French vowel patterns.', examples: ['Quebec: tu dis → /tsydi/','Belgium: septante-deux','African: longer vowels'], minimalPairs: [], commonErrors: ['Only understanding one variety'] },
  ],
};

// Tongue twisters by difficulty
const TONGUE_TWISTERS = [
  { id: 'tt-1', level: 'A2', text: 'Si six scies scient six cyprès, six cent six scies scient six cent six cyprès.', focus: '/s/ purity, syllable clarity', ipa: '/si si si si si sipʁɛ si sɑ̃ si si si si sɑ̃ si sipʁɛ/' },
  { id: 'tt-2', level: 'A2', text: 'Un chasseur sachant chasser sait chasser sans son chien.', focus: '/ʃ/ vs /s/ distinction', ipa: '/ɛ̃ ʃa.sœʁ sa.ʃɑ̃ ʃa.se sɛ ʃa.se sɑ̃ sɔ̃ ʃjɛ̃/' },
  { id: 'tt-3', level: 'B1', text: 'Les chaussettes de l\'archiduchesse sont-elles sèches, archi-sèches ?', focus: '/ʃ/ and /s/ alternation, vowel precision', ipa: '/le ʃo.sɛt də laʁ.ʃi.dy.ʃɛs sɔ̃.tɛl sɛʃ aʁ.ʃi.sɛʃ/' },
  { id: 'tt-4', level: 'B1', text: 'Je suis ce que je suis, et si je suis ce que je suis, qu\'est-ce que je suis ?', focus: '/ʒ/ and /s/ and /ʃ/ mixing, /ɥ/ in "suis"', ipa: '/ʒə sɥi skə ʒə sɥi e si ʒə sɥi skə ʒə sɥi kɛs kə ʒə sɥi/' },
  { id: 'tt-5', level: 'B2', text: 'Cinq chiens chassent six chats.', focus: 'Nasal vowels /ɛ̃/ and /s/ vs /ʃ/', ipa: '/sɛ̃k ʃjɛ̃ ʃas si ʃa/' },
  { id: 'tt-6', level: 'B2', text: 'Tonton, ton thé t\'a-t-il ôté ta toux ?', focus: '/t/ precision, nasal /ɔ̃/, liaison', ipa: '/tɔ̃.tɔ̃ tɔ̃ te ta.til o.te ta tu/' },
  { id: 'tt-7', level: 'C1', text: 'Pauvre petit pêcheur, prend patience pour pouvoir prendre plusieurs petits poissons.', focus: '/p/ without aspiration, vowel precision across many syllables', ipa: '(focus on unaspirated /p/ and steady rhythm)' },
  { id: 'tt-8', level: 'C1', text: 'Didon dîna, dit-on, du dos d\'un dodu dindon.', focus: '/d/ precision, nasal vowels, rhythm', ipa: '/di.dɔ̃ di.na di.tɔ̃ dy do dɛ̃ do.dy dɛ̃.dɔ̃/' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function allSounds() {
  const out = [];
  for (const lvl of core.CEFR) {
    for (const s of (SOUNDS[lvl] || [])) out.push({ ...s, level: lvl });
  }
  return out;
}

function soundsForLevel(level) {
  const idx = core.CEFR.indexOf(level);
  if (idx < 0) return allSounds();
  const out = [];
  for (let i = 0; i <= idx; i++) {
    for (const s of (SOUNDS[core.CEFR[i]] || [])) out.push({ ...s, level: core.CEFR[i] });
  }
  return out;
}

function findSound(id) {
  return allSounds().find(s => s.id === id) || null;
}

// ---------------------------------------------------------------------------
// PronunciationTutor
// ---------------------------------------------------------------------------

class PronunciationTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.skills) p.skills = {};
    if (!p.assessments) p.assessments = [];
    if (!p.sessions) p.sessions = [];
    return p;
  }

  setLevel(studentId, level) {
    level = level.toUpperCase();
    if (!core.CEFR.includes(level)) throw new Error('Invalid CEFR level: ' + level);
    const p = this.getProfile(studentId);
    p.level = level;
    core.saveProfile(this.dir, p);
    return { studentId, level, soundsAvailable: soundsForLevel(level).length };
  }

  listStudents() {
    return core.listProfiles(this.dir);
  }

  getSoundCatalog(level) {
    const sounds = level ? soundsForLevel(level) : allSounds();
    const byCat = {};
    for (const s of sounds) {
      if (!byCat[s.cat]) byCat[s.cat] = [];
      byCat[s.cat].push({ id: s.id, name: s.name, ipa: s.ipa, level: s.level });
    }
    return byCat;
  }

  generateLesson(studentId, category) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = soundsForLevel(level);
    const filtered = category ? available.filter(s => s.cat === category) : available;
    const td = core.today();

    const due = [];
    const fresh = [];
    for (const s of filtered) {
      const sk = p.skills[s.id];
      if (!sk) { fresh.push(s); continue; }
      if (sk.nextReview && sk.nextReview <= td) due.push(s);
    }

    const reviewItems = core.pick(due, 5);
    const newItems = core.pick(fresh, 2);

    const exercises = [];
    for (const s of [...reviewItems, ...newItems]) {
      exercises.push(this._makeExercise(s, level));
    }

    return {
      studentId, level, date: td, category: category || 'all',
      reviewCount: reviewItems.length, newCount: newItems.length,
      exercises,
    };
  }

  generateExercise(studentId, type) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = soundsForLevel(level);
    const sound = core.pick(available, 1)[0];
    if (!sound) throw new Error('No sounds available for level ' + level);

    if (type === 'tonguetwister') return this._tongueTwister(level);
    return this._makeExercise(sound, level, type);
  }

  _makeExercise(sound, level, forceType) {
    const types = [];
    if (sound.minimalPairs && sound.minimalPairs.length) types.push('minimal-pairs');
    if (sound.cat === 'stress') types.push('stress-identification');
    types.push('production');

    const type = forceType && types.includes(forceType) ? forceType : (forceType === 'production' ? 'production' : core.pick(types, 1)[0] || 'production');
    const exId = sound.id + '-' + Date.now();

    if (type === 'minimal-pairs' && sound.minimalPairs.length) {
      const pair = core.pick(sound.minimalPairs, 1)[0];
      const target = core.pick(pair, 1)[0];
      const options = core.shuffle([...pair]);
      return {
        exerciseId: exId, type: 'minimal-pairs', soundId: sound.id, soundName: sound.name,
        ipa: sound.ipa, prompt: `Which word do you hear? Target: "${target}"`,
        options, answer: target, description: sound.desc,
      };
    }

    if (type === 'stress-identification') {
      const word = core.pick(sound.examples, 1)[0];
      return {
        exerciseId: exId, type: 'stress-identification', soundId: sound.id, soundName: sound.name,
        prompt: `Identify the stressed syllable in: "${word}"`, word,
        description: sound.desc, hint: 'In French, stress falls on the LAST syllable of a phrase group.',
      };
    }

    const word = core.pick(sound.examples, 1)[0];
    return {
      exerciseId: exId, type: 'production', soundId: sound.id, soundName: sound.name,
      ipa: sound.ipa, prompt: `Say this word aloud, focusing on ${sound.name}: "${word}"`,
      word, description: sound.desc,
      selfAssessPrompt: 'Rate yourself 0-3: 0=cannot produce, 1=hear difference but struggle, 2=produce with concentration, 3=natural',
    };
  }

  _tongueTwister(level) {
    const idx = core.CEFR.indexOf(level);
    const eligible = TONGUE_TWISTERS.filter(t => core.CEFR.indexOf(t.level) <= idx);
    const tt = core.pick(eligible.length ? eligible : TONGUE_TWISTERS, 1)[0];
    return {
      exerciseId: 'tt-' + Date.now(), type: 'tonguetwister',
      text: tt.text, focus: tt.focus, ipa: tt.ipa, level: tt.level,
      prompt: `Repeat this tongue twister slowly, then speed up:\n"${tt.text}"\nFocus: ${tt.focus}`,
      selfAssessPrompt: 'Rate yourself 0-3: 0=cannot say it, 1=very slow only, 2=moderate speed, 3=fast and clear',
    };
  }

  checkAnswer(studentId, exerciseId, answer) {
    const ans = core.norm(answer);
    return {
      exerciseId, givenAnswer: answer, normalized: ans,
      note: 'For pronunciation exercises, use "record" to log your self-assessment grade (0-3).',
    };
  }

  recordAssessment(studentId, soundId, grade) {
    grade = Number(grade);
    if (grade < 0 || grade > 3) throw new Error('Grade must be 0-3');
    const p = this.getProfile(studentId);
    const sound = findSound(soundId);
    if (!sound) throw new Error('Unknown sound: ' + soundId);

    const fsrsGrade = grade + 1;

    if (!p.skills[soundId]) {
      p.skills[soundId] = { difficulty: 5, stability: 0.5, lastReview: null, nextReview: null, history: [] };
    }
    const sk = p.skills[soundId];
    sk.stability = core.fsrsUpdateStability(sk.stability || 0.5, sk.difficulty || 5, fsrsGrade);
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty || 5, fsrsGrade);
    sk.lastReview = core.today();
    const interval = core.fsrsNextReview(sk.stability);
    const next = new Date();
    next.setDate(next.getDate() + interval);
    sk.nextReview = next.toISOString().slice(0, 10);
    sk.history.push({ date: core.today(), grade, fsrsGrade });

    p.assessments.push({ soundId, grade, date: core.today() });
    core.saveProfile(this.dir, p);

    return {
      studentId, soundId, soundName: sound.name, grade,
      stability: sk.stability, difficulty: sk.difficulty,
      nextReview: sk.nextReview, interval,
    };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = soundsForLevel(level);
    const byCat = {};

    for (const s of available) {
      if (!byCat[s.cat]) byCat[s.cat] = { total: 0, studied: 0, mastered: 0, items: [] };
      const cat = byCat[s.cat];
      cat.total++;
      const sk = p.skills[s.id];
      const lastGrade = sk && sk.history.length ? sk.history[sk.history.length - 1].grade : null;
      const status = !sk ? 'not-started' : lastGrade >= 3 ? 'mastered' : lastGrade >= 2 ? 'proficient' : lastGrade >= 1 ? 'developing' : 'emerging';
      if (sk) cat.studied++;
      if (lastGrade >= 3) cat.mastered++;
      cat.items.push({ id: s.id, name: s.name, status, lastGrade, nextReview: sk ? sk.nextReview : null });
    }

    return { studentId, level, categories: byCat };
  }

  getNextSounds(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = soundsForLevel(level);
    const td = core.today();
    const due = [];
    const unstarted = [];

    for (const s of available) {
      const sk = p.skills[s.id];
      if (!sk) { unstarted.push({ id: s.id, name: s.name, cat: s.cat, level: s.level, reason: 'new' }); continue; }
      if (sk.nextReview && sk.nextReview <= td) {
        due.push({ id: s.id, name: s.name, cat: s.cat, level: s.level, nextReview: sk.nextReview, reason: 'due' });
      }
    }

    return { studentId, date: td, due, unstarted: unstarted.slice(0, 5), totalDue: due.length, totalUnstarted: unstarted.length };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const next = this.getNextSounds(studentId);

    let totalStudied = 0, totalMastered = 0, totalItems = 0;
    const catSummary = {};
    for (const [cat, data] of Object.entries(progress.categories)) {
      totalStudied += data.studied;
      totalMastered += data.mastered;
      totalItems += data.total;
      catSummary[cat] = `${data.mastered}/${data.total} mastered`;
    }

    const recentAssessments = (p.assessments || []).slice(-10).reverse();

    return {
      studentId, level: p.level || 'A1',
      summary: { totalItems, totalStudied, totalMastered, percentMastered: totalItems ? Math.round(totalMastered / totalItems * 100) : 0 },
      categories: catSummary,
      dueForReview: next.totalDue,
      unstartedRemaining: next.totalUnstarted,
      recentAssessments,
      recommendations: this._recommendations(progress, next),
    };
  }

  _recommendations(progress, next) {
    const recs = [];
    const cats = progress.categories;
    if (cats.vowels) {
      const emerging = cats.vowels.items.filter(i => i.status === 'emerging' || i.status === 'not-started');
      if (emerging.length) recs.push('Focus on vowel precision -- ' + emerging.length + ' vowel sounds need work. Priority: /y/ (tu vs tout).');
    }
    if (cats.nasals) {
      const emerging = cats.nasals.items.filter(i => i.status === 'emerging' || i.status === 'not-started');
      if (emerging.length) recs.push('Nasal vowels need practice -- ' + emerging.length + ' nasal sounds to work on.');
    }
    if (next.totalDue > 0) recs.push(next.totalDue + ' sound(s) due for review today.');
    if (next.totalUnstarted > 3) recs.push(next.totalUnstarted + ' sounds not yet started at your level.');
    if (cats['connected-speech']) {
      const cs = cats['connected-speech'];
      if (cs.studied === 0) recs.push('Start connected speech practice (liaison, enchaînement).');
    }
    if (!recs.length) recs.push('Great progress! Consider advancing to the next CEFR level.');
    return recs;
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new PronunciationTutor();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const id = args[1]; if (!id) throw new Error('Usage: start <studentId>');
      const p = tutor.getProfile(id);
      core.saveProfile(tutor.dir, p);
      out({ status: 'ok', studentId: id, level: p.level || 'not set', soundsTracked: Object.keys(p.skills).length });
      break;
    }
    case 'set-level': {
      const id = args[1], lvl = args[2];
      if (!id || !lvl) throw new Error('Usage: set-level <studentId> <A1-C2>');
      out(tutor.setLevel(id, lvl.toUpperCase()));
      break;
    }
    case 'lesson': {
      const id = args[1], cat = args[2] || null;
      if (!id) throw new Error('Usage: lesson <studentId> [category]');
      out(tutor.generateLesson(id, cat));
      break;
    }
    case 'exercise': {
      const id = args[1], type = args[2] || null;
      if (!id) throw new Error('Usage: exercise <studentId> [minimal-pairs|stress-identification|production|tonguetwister]');
      out(tutor.generateExercise(id, type));
      break;
    }
    case 'check': {
      const id = args[1], exId = args[2], answer = args.slice(3).join(' ');
      if (!id || !exId) throw new Error('Usage: check <studentId> <exerciseId> <answer>');
      out(tutor.checkAnswer(id, exId, answer));
      break;
    }
    case 'record': {
      const id = args[1], soundId = args[2], grade = args[3];
      if (!id || !soundId || grade === undefined) throw new Error('Usage: record <studentId> <soundId> <0-3>');
      out(tutor.recordAssessment(id, soundId, grade));
      break;
    }
    case 'progress': {
      const id = args[1]; if (!id) throw new Error('Usage: progress <studentId>');
      out(tutor.getProgress(id));
      break;
    }
    case 'report': {
      const id = args[1]; if (!id) throw new Error('Usage: report <studentId>');
      out(tutor.getReport(id));
      break;
    }
    case 'next': {
      const id = args[1]; if (!id) throw new Error('Usage: next <studentId>');
      out(tutor.getNextSounds(id));
      break;
    }
    case 'sounds': {
      const lvl = args[1] || null;
      out(tutor.getSoundCatalog(lvl ? lvl.toUpperCase() : null));
      break;
    }
    case 'students': {
      out({ students: tutor.listStudents() });
      break;
    }
    case 'help':
      out({ commands: ['start','set-level','lesson','exercise','check','record','progress','report','next','sounds','students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + cmd,
        commands: ['start','set-level','lesson','exercise','check','record','progress','report','next','sounds','students'],
      });
  }
});

module.exports = { PronunciationTutor, SOUNDS, TONGUE_TWISTERS };
