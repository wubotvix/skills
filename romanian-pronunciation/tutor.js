// Romanian Pronunciation Tutor -- all data embedded, FSRS-tracked
const core = require('../_lib/core');

const SKILL_NAME = 'romanian-pronunciation';

// ---------------------------------------------------------------------------
// SOUND DATA by CEFR level
// ---------------------------------------------------------------------------
const SOUNDS = {
  A1: [
    // Vowels
    { id: 'v-a', cat: 'vowels', name: 'Open central /a/', ipa: '/a/', desc: 'Mouth wide open, tongue low and central. Like English "father" but shorter, crisper. Never slides.', examples: ['casă','mare','a','acasă'], minimalPairs: [['cas','cos'],['par','păr']], commonErrors: ['Substituting English /æ/ or /eɪ/'] },
    { id: 'v-e', cat: 'vowels', name: 'Mid front /e/', ipa: '/e/', desc: 'Lips slightly spread, mid-front. Like the start of English "say" WITHOUT the glide to /ɪ/. Freeze it.', examples: ['este','mere','bere','ele'], minimalPairs: [['bere','bare'],['mere','mare']], commonErrors: ['Diphthongizing to /eɪ/ (English habit)'] },
    { id: 'v-i', cat: 'vowels', name: 'Close front /i/', ipa: '/i/', desc: 'Lips spread, tongue high and front. Like English "see" but shorter, no glide. Word-final after consonant: very short /ʲ/ (palatalization).', examples: ['mic','zi','iarnă','lupi'], minimalPairs: [['vis','vas'],['mic','mec']], commonErrors: ['Too long or glided','Missing word-final palatalization'] },
    { id: 'v-o', cat: 'vowels', name: 'Mid back /o/', ipa: '/o/', desc: 'Lips rounded, mid-back. Like start of English "go" WITHOUT the glide to /ʊ/. Freeze it.', examples: ['om','bor','copil','doi'], minimalPairs: [['cos','cas'],['sor','sur']], commonErrors: ['Diphthongizing to /oʊ/ (English habit)'] },
    { id: 'v-u', cat: 'vowels', name: 'Close back /u/', ipa: '/u/', desc: 'Lips rounded tightly, tongue high and back. Like English "too" but shorter.', examples: ['unu','lup','munte','urs'], minimalPairs: [['sur','sor'],['lup','lip']], commonErrors: ['Too long or glided'] },
    { id: 'v-a-breve', cat: 'vowels', name: 'Schwa /ə/ (ă)', ipa: '/ə/', desc: 'THE key Romanian vowel. Mid-central, relaxed. Like English "a" in "about" or "sofa." Tongue relaxed, center of mouth, lips neutral. English speakers make this sound all the time but don\'t recognize it.', examples: ['masă','băiat','că','fată'], minimalPairs: [['par','păr'],['cas','căs']], commonErrors: ['Confusing with /a/','Using English stressed schwa quality'] },
    { id: 'v-a-circumflex', cat: 'vowels', name: 'Close central /ɨ/ (â/î)', ipa: '/ɨ/', desc: 'THE most difficult Romanian vowel. Close central, unrounded. Tongue high (like /i/) but pulled BACK to center (not front like /i/, not back like /u/). Lips NOT rounded. No direct English/Spanish/French/Italian equivalent.', examples: ['mână','își','România','pâine'], minimalPairs: [['par','pâr'],['păr','pâr']], commonErrors: ['Substituting /i/ or /u/','Rounding lips'] },
    // Basic consonants
    { id: 'c-s-vs-sh', cat: 'consonants', name: 'S /s/ vs Ș /ʃ/', ipa: '/s/ vs /ʃ/', desc: 'S is always voiceless /s/. Ș (with comma below) is /ʃ/ like English "sh." These are completely different phonemes.', examples: ['sac','sar','școală','șase'], minimalPairs: [['sar','șar'],['sac','șac']], commonErrors: ['Confusing s and ș','Missing the ș sound'] },
    { id: 'c-t-vs-ts', cat: 'consonants', name: 'T /t/ vs Ț /ts/', ipa: '/t/ vs /ts/', desc: 'T is plain /t/. Ț (with comma below) is /ts/ like English "cats." Ț can appear word-initially: țară, unlike English.', examples: ['tare','top','țară','țap'], minimalPairs: [['tară','țară'],['tic','țic']], commonErrors: ['Confusing t and ț','Cannot produce word-initial /ts/'] },
  ],
  A2: [
    { id: 'c-trill', cat: 'consonants', name: 'Trilled R /r/', ipa: '/r/', desc: 'Alveolar trill: tongue tip vibrates against alveolar ridge. Like Spanish "rr." In casual speech, a single tap /ɾ/ between vowels. Practice: bilabial trill (brrr), then dr-dr-dr, then tr-tr-tr.', examples: ['rog','răspuns','verde','mare'], minimalPairs: [['cal','car'],['fir','fil']], commonErrors: ['English retroflex /ɹ/','French uvular /ʁ/','Not enough air pressure'] },
    { id: 's-basic', cat: 'stress', name: 'Basic stress patterns', ipa: 'ˈ', desc: 'Romanian stress is lexical (not rule-based like Spanish). Most common: penultimate. Verbs: often on stem-final. No written accent marks. Stress must be learned per word.', examples: ['CA-să','fe-REAS-tră','a vor-BI','te-le-FON'], minimalPairs: [['VE-se-lă (dishes)','ve-SE-lă (cheerful)'],['CO-pii (children)','co-PII (copies)']], commonErrors: ['Defaulting to one stress pattern','Stressing wrong syllable'] },
    { id: 'c-h', cat: 'consonants', name: 'Pronounced H /h/', ipa: '/h/', desc: 'Romanian H is ALWAYS pronounced. Unlike Spanish (silent) or French (usually silent). Voiceless glottal fricative like English "h."', examples: ['hârtie','hotar','hotel','haina'], minimalPairs: [['are','hare']], commonErrors: ['Dropping h (Spanish/French speakers)'] },
    { id: 'c-palat', cat: 'consonants', name: 'Palatalization before -i', ipa: '/ʲ/', desc: 'Word-final -i after consonant is a very short /ʲ/ that palatalizes the consonant. This marks plurals and verb forms: lup→lupi /lupʲ/, frumos→frumoși /frumoʃʲ/.', examples: ['lupi','frumoși','copaci','bani'], minimalPairs: [['lup','lupi'],['frumos','frumoși'],['copac','copaci']], commonErrors: ['Pronouncing full /i/ instead of short palatalization','Missing plural marker entirely'] },
    { id: 'd-ea', cat: 'diphthongs', name: 'Diphthong /e̯a/ (ea)', ipa: '/e̯a/', desc: 'Very common Romanian diphthong. Quick glide from /e/ to /a/ in one syllable. Found everywhere in Romanian.', examples: ['seară','femeie','cafea','bea'], minimalPairs: [], commonErrors: ['Pronouncing as two separate syllables','Missing the glide'] },
    { id: 'd-oa', cat: 'diphthongs', name: 'Diphthong /o̯a/ (oa)', ipa: '/o̯a/', desc: 'Very common diphthong. Quick glide from /o/ to /a/ in one syllable.', examples: ['foarte','soare','oameni','boare'], minimalPairs: [], commonErrors: ['Pronouncing as two syllables','Dropping the /o/ onset'] },
  ],
  B1: [
    { id: 'c-ce-ci', cat: 'consonants', name: 'Soft C: ce/ci /tʃ/', ipa: '/tʃ/', desc: 'C before e,i = /tʃ/ (like English "ch"). To keep hard /k/ before e,i, add h: che/chi.', examples: ['cer','cine','cinci','ceas'], minimalPairs: [['cer','cher (from cheie)'],['cine','chine (from chineza)']], commonErrors: ['Using /k/ before e,i','Confusing ce/ci with che/chi'] },
    { id: 'c-ge-gi', cat: 'consonants', name: 'Soft G: ge/gi /dʒ/', ipa: '/dʒ/', desc: 'G before e,i = /dʒ/ (like English "j" in "judge"). To keep hard /ɡ/ before e,i, add h: ghe/ghi.', examples: ['ger','girafă','ginere','gel'], minimalPairs: [['ger','gher (from gherghef)'],['gi','ghi']], commonErrors: ['Using /ɡ/ before e,i','Confusing ge/gi with ghe/ghi'] },
    { id: 'cs-linking', cat: 'connected-speech', name: 'Vowel linking', ipa: '(linking)', desc: 'In fast speech, adjacent vowels across words may link: "și eu" → [ʃjew]. Glide insertion common.', examples: ['și eu','de aici','la ora','nu e'], minimalPairs: [], commonErrors: ['Inserting pauses between words','Glottal stops before vowels'] },
    { id: 'cs-elision', cat: 'connected-speech', name: 'Casual elision', ipa: '(elision)', desc: '"Nu este" → "nu-i" or "nu e." "Este" → "e." "O să" → reduced in fast speech. These are standard casual Romanian.', examples: ['nu-i bine','nu e rău','n-am văzut','n-are'], minimalPairs: [], commonErrors: ['Not recognizing reduced forms','Always using full forms (sounds stilted)'] },
    { id: 'i-statement', cat: 'intonation', name: 'Statement intonation ↘', ipa: '↘', desc: 'Statements have gradual descent with fall at end: "Merg la școală." ↘', examples: ['Merg la școală.','Am doi frați.','Este frumos afară.'], minimalPairs: [], commonErrors: ['Rising at end (English uptalk)'] },
    { id: 'i-ynq', cat: 'intonation', name: 'Yes/No question rise ↗', ipa: '↗', desc: 'Yes/No questions rise at end: "Mergi la școală?" ↗', examples: ['Mergi acasă?','Ai timp?','Ești gata?'], minimalPairs: [], commonErrors: ['Insufficient rise','Falling like a statement'] },
  ],
  B2: [
    { id: 'cs-noglottal', cat: 'connected-speech', name: 'No glottal stop', ipa: '(flow)', desc: 'Romanian does not insert glottal stops before vowel-initial words. Maintain smooth flow between words.', examples: ['o apă [oa.pə]','un om [u.nom]','la ora [la.o.ra]'], minimalPairs: [], commonErrors: ['Inserting ʔ before vowels (English/German habit)'] },
    { id: 'c-j', cat: 'consonants', name: 'J /ʒ/ (voiced postalveolar)', ipa: '/ʒ/', desc: 'Romanian J is /ʒ/ like French "j" or English "measure." NOT English "j" /dʒ/.', examples: ['joc','jar','jale','ージューri'], minimalPairs: [['ger /dʒ/','jer /ʒ/']], commonErrors: ['Using English /dʒ/ for j','Confusing j with g before e/i'] },
    { id: 'i-whq', cat: 'intonation', name: 'Wh-question fall ↘', ipa: '↘', desc: 'Wh-questions fall at end: "Unde mergi?" ↘', examples: ['Unde mergi?','Ce faci?','Cum te cheamă?'], minimalPairs: [], commonErrors: ['Rising like a yes/no question'] },
    { id: 'i-list', cat: 'intonation', name: 'List intonation', ipa: '↗...↘', desc: 'Rise on each item, fall on last: "Am cumpărat mere↗, pere↗ și struguri↘."', examples: ['mere, pere și struguri','luni, marți și miercuri'], minimalPairs: [], commonErrors: ['Falling too early','Flat intonation'] },
    { id: 'd-triphthong', cat: 'diphthongs', name: 'Triphthongs', ipa: '/e̯aw/', desc: 'Romanian has triphthongs — 3 vowels in one syllable: "beau" /be̯aw/ (I drink), "iau" /jaw/ (I take).', examples: ['beau','iau','beai','voiau'], minimalPairs: [], commonErrors: ['Breaking into multiple syllables'] },
  ],
  C1: [
    { id: 'cs-rhythm', cat: 'connected-speech', name: 'Syllable-timed rhythm mastery', ipa: '(rhythm)', desc: 'Romanian is syllable-timed. Every syllable gets roughly equal duration, no schwa reduction in unstressed syllables (except ă is already schwa). Drill: tap finger evenly.', examples: ['te-le-vi-zi-u-ne','u-ni-ver-si-ta-te','con-struc-ți-e'], minimalPairs: [], commonErrors: ['Stress-timed rhythm (English habit)','Reducing unstressed vowels'] },
    { id: 'c-dialect', cat: 'consonants', name: 'Dialectal awareness', ipa: '(varies)', desc: 'Recognize Moldavian (more melodic, open vowels), Transylvanian (Hungarian-influenced intonation), Banat (Serbian influence). All are valid.', examples: ['Standard: foarte → Moldavian: foarti','Standard: ce faci → regional variations'], minimalPairs: [], commonErrors: ['Thinking only Bucharest pronunciation is correct'] },
    { id: 'i-excl', cat: 'intonation', name: 'Exclamation contour', ipa: '↗↘', desc: 'Wide pitch range: "Ce frumos!" ↗↘', examples: ['Ce frumos!','Nu se poate!','Incredibil!'], minimalPairs: [], commonErrors: ['Too flat','Insufficient pitch range'] },
    { id: 'i-vocative', cat: 'intonation', name: 'Vocative intonation', ipa: '↗↘ / ↘', desc: '"Maria!" (calling) ↗↘. "Măi, Maria" (casual address) ↘. "Domnule!" (formal) ↗↘.', examples: ['Maria!','Măi, Ionele!','Domnule profesor!'], minimalPairs: [], commonErrors: ['Wrong contour for formal vs casual'] },
  ],
  C2: [
    { id: 'cs-full', cat: 'connected-speech', name: 'Native-like connected speech', ipa: '(flow)', desc: 'Full integration: linking + elision + rhythm + intonation in rapid natural speech. Includes recognizing all casual reductions.', examples: ['Nu știu ce-o să se-ntâmple. (fluid)','Hai că mergem, nu-i așa?'], minimalPairs: [], commonErrors: ['Slowing down at word boundaries'] },
    { id: 'c-regional-full', cat: 'consonants', name: 'Pan-dialectal production', ipa: '(varies)', desc: 'Optionally produce features from Muntenian, Moldavian, Transylvanian, and Banat dialects. Understand all varieties fluently.', examples: ['Standard: "ce faci?"','Moldavian: more melodic contour','Transylvanian: Hungarian-influenced rhythm'], minimalPairs: [], commonErrors: ['Inconsistent dialect features'] },
  ],
};

// Tongue twisters by difficulty
const TONGUE_TWISTERS = [
  { id: 'tt-1', level: 'A2', text: 'Capra calcă-n pietre, piatra crapă-n patru.', focus: 'consonant clusters /kr/, /pr/, palatalization', ipa: '/ka.pra kal.kə.n pje.tre pja.tra kra.pə.n pa.tru/' },
  { id: 'tt-2', level: 'A2', text: 'Șase sasi în șase saci.', focus: '/s/ vs /ʃ/ distinction', ipa: '/ʃa.se sa.sʲ ɨn ʃa.se satʃʲ/' },
  { id: 'tt-3', level: 'B1', text: 'Un vultur gras stă pe un varză grasă și o strigă pe vulturița grasă.', focus: 'trilled R, consonant clusters, vowel purity', ipa: '(focus on clear r trill and vowel quality)' },
  { id: 'tt-4', level: 'B1', text: 'Trei tigri trișți mâncau trei bucăți de grâu pe trei trotuare.', focus: 'trill /r/ in clusters /tr/, ă vs â distinction', ipa: '(focus on /tr/ clusters and distinguishing /ə/ from /ɨ/)' },
  { id: 'tt-5', level: 'B1', text: 'Cinci cățeluși cu cinci căciulițe.', focus: 'palatalization /tʃ/, diminutives, /ɨ/ vowel', ipa: '/tʃintʃʲ kə.tse.luʃʲ ku tʃintʃʲ kə.tʃu.li.tse/' },
  { id: 'tt-6', level: 'B2', text: 'Trenul trece prin tranșeul de la Turda, traversând tunelul cu trudă.', focus: '/tr/ clusters, ă vowel, connected speech', ipa: '(focus on smooth linking and /tr/ clusters throughout)' },
  { id: 'tt-7', level: 'B2', text: 'Într-o țară îndepărtată trăiau trei țărani care vorbeau despre țărână.', focus: '/ɨ/ (â/î) vowel throughout, ț /ts/ production', ipa: '(focus on consistent /ɨ/ production and /ts/ clarity)' },
  { id: 'tt-8', level: 'C1', text: 'Următoarea întrebare a împărătesei a îngrozit întreaga împrejurime.', focus: '/ɨ/ (î/â) at word boundaries, connected speech with î-initial words', ipa: '(focus on smooth transitions between /ɨ/-initial words)' },
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
        description: sound.desc, hint: 'Break the word into syllables and find the stressed one.',
      };
    }

    // production
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
      if (emerging.length) recs.push('Focus on vowel system -- ' + emerging.length + ' vowel sounds need work (especially ă /ə/ and â/î /ɨ/).');
    }
    if (next.totalDue > 0) recs.push(next.totalDue + ' sound(s) due for review today.');
    if (next.totalUnstarted > 3) recs.push(next.totalUnstarted + ' sounds not yet started at your level.');
    if (cats['connected-speech']) {
      const cs = cats['connected-speech'];
      if (cs.studied === 0) recs.push('Start connected speech practice (linking, elision).');
    }
    if (cats.diphthongs) {
      const dp = cats.diphthongs;
      if (dp.studied === 0) recs.push('Start diphthong practice (/e̯a/, /o̯a/ are essential).');
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
