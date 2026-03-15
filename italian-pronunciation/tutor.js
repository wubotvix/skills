// Italian Pronunciation Tutor -- all data embedded, FSRS-tracked
const core = require('../_lib/core');

const SKILL_NAME = 'italian-pronunciation';

// ---------------------------------------------------------------------------
// SOUND DATA by CEFR level
// ---------------------------------------------------------------------------
const SOUNDS = {
  A1: [
    // Vowels (7 vowel system)
    { id: 'v-a', cat: 'vowels', name: 'Open central /a/', ipa: '/a/', desc: 'Mouth wide open, tongue low and central. Like English "father" but shorter. Never reduces to schwa.', examples: ['casa','pane','mamma','banana'], minimalPairs: [['casa','cosa'],['pane','pene']], commonErrors: ['Reducing to schwa in unstressed syllables'] },
    { id: 'v-e-closed', cat: 'vowels', name: 'Close-mid front /e/', ipa: '/e/', desc: 'Lips slightly spread, mid-front. Like start of English "say" WITHOUT the glide. Freeze it.', examples: ['mela','sera','verde','perche'], minimalPairs: [['pesca (peach)','pesca (fishing)'],['venti (winds)','venti (twenty)']], commonErrors: ['Diphthongizing to /eɪ/ (English habit)'] },
    { id: 'v-e-open', cat: 'vowels', name: 'Open-mid front /ɛ/', ipa: '/ɛ/', desc: 'Like English "bed". More open than /e/. Only in stressed syllables.', examples: ['bello','sette','festa','letto'], minimalPairs: [['legge (reads)','legge (law)'],['messe (placed)','messe (masses)']], commonErrors: ['Confusing with /e/ closed'] },
    { id: 'v-i', cat: 'vowels', name: 'Close front /i/', ipa: '/i/', desc: 'Lips spread, tongue high and front. Like English "see" but shorter, no glide.', examples: ['vino','finito','amico','pizza'], minimalPairs: [], commonErrors: ['Too long or glided'] },
    { id: 'v-o-closed', cat: 'vowels', name: 'Close-mid back /o/', ipa: '/o/', desc: 'Lips rounded, mid-back. Like start of English "go" WITHOUT the glide. Freeze it.', examples: ['sole','amore','come','molto'], minimalPairs: [['botte (barrel)','botte (blows)'],['colto (cultivated)','colto (caught)']], commonErrors: ['Diphthongizing to /oʊ/ (English habit)'] },
    { id: 'v-o-open', cat: 'vowels', name: 'Open-mid back /ɔ/', ipa: '/ɔ/', desc: 'More open than /o/. Like English "thought". Only in stressed syllables.', examples: ['notte','porta','cosa','corpo'], minimalPairs: [['fossi (ditches)','fossi (I were)']], commonErrors: ['Confusing with /o/ closed'] },
    { id: 'v-u', cat: 'vowels', name: 'Close back /u/', ipa: '/u/', desc: 'Lips rounded tightly, tongue high and back. Like English "too" but shorter.', examples: ['luna','muro','uva','scuro'], minimalPairs: [], commonErrors: ['Too long or glided'] },
    // Basic spelling-to-sound
    { id: 'c-cg', cat: 'consonants', name: 'C/G before vowels', ipa: '/k,tʃ,ɡ,dʒ/', desc: 'C before a/o/u = /k/ (casa). C before e/i = /tʃ/ (cena). G before a/o/u = /ɡ/ (gatto). G before e/i = /dʒ/ (gente). CH/GH restore /k/,/ɡ/ before e/i.', examples: ['casa','cena','gatto','gente','che','ghiaccio'], minimalPairs: [['cane (dog)','cena (dinner)']], commonErrors: ['English /s/ for C before e/i'] },
    { id: 'c-h', cat: 'consonants', name: 'Silent H', ipa: '(silent)', desc: 'H is ALWAYS silent. Used only in CH/GH digraphs and verb forms (ho, hai, ha, hanno).', examples: ['ho','hai','che','chi','ghiaccio'], minimalPairs: [], commonErrors: ['Pronouncing /h/ as in English'] },
  ],
  A2: [
    // Geminates (THE key feature)
    { id: 'gem-basic', cat: 'geminates', name: 'Geminate consonants (basic)', ipa: '/pp tt kk bb dd/...', desc: 'Double consonants are held 1.5-2x longer than single. They straddle syllables: palla = /ˈpal.la/. This changes meaning.', examples: ['palla','fatto','nonno','bello','carro'], minimalPairs: [['pala (shovel)','palla (ball)'],['caro (dear)','carro (cart)'],['fato (fate)','fatto (fact)'],['nono (ninth)','nonno (grandfather)'],['pena (sorrow)','penna (pen)']], commonErrors: ['Not lengthening the consonant','Treating doubles as singles'] },
    { id: 'gem-more', cat: 'geminates', name: 'Geminate consonants (extended)', ipa: '/ff ss vv mm nn ll rr/', desc: 'All consonant types can be geminate. Fricatives: extend airflow. Nasals/laterals: maintain contact longer. Trill: more vibrations.', examples: ['sette','notte','cappello','mamma','anno','villa','terra'], minimalPairs: [['sete (thirst)','sette (seven)'],['note (notes)','notte (night)'],['capello (hair)','cappello (hat)'],['casa (house)','cassa (crate)'],['sono (I am)','sonno (sleep)']], commonErrors: ['Single and double sounding the same'] },
    // Trill
    { id: 'c-trill', cat: 'consonants', name: 'Alveolar trill /r/', ipa: '/r/', desc: 'Tongue tip vibrates against alveolar ridge. 2-3 taps for single /r/, 3-5 for geminate /rr/. NOT English approximant.', examples: ['roma','sera','caro','rosso','grande'], minimalPairs: [['caro (dear)','carro (cart)'],['sera (evening)','serra (greenhouse)']], commonErrors: ['English approximant /ɹ/','French uvular /ʁ/','Not enough taps for geminate'] },
    // Stress
    { id: 's-basic', cat: 'stress', name: 'Italian stress rules', ipa: 'ˈ', desc: 'Italian stress is unpredictable. ~75% penultimate (amico), ~15% antepenultimate (tavolo), ~8% final (citta). Written accent only on finals.', examples: ['aMIco','TAVolo','citTA','TELefono','perCHE'], minimalPairs: [['ancora (anchor)','ancora (still)'],['principi (principles)','principi (princes)'],['capitano (they happen)','capitano (captain)']], commonErrors: ['Always stressing penultimate','Ignoring accent marks on finals'] },
    // SC, GN, GLI
    { id: 'c-sc', cat: 'consonants', name: 'SC digraph', ipa: '/ʃ/ or /sk/', desc: 'SC before e/i = /ʃ/ (pesce). SC before a/o/u = /sk/ (scala). SCH before e/i = /sk/ (schema).', examples: ['pesce','scena','scala','scusa','schema','schiena'], minimalPairs: [], commonErrors: ['Always using /sk/'] },
  ],
  B1: [
    { id: 'c-gn', cat: 'consonants', name: 'GN = /ɲ/ (palatal nasal)', ipa: '/ɲ/', desc: 'Like Spanish ñ. Tongue blade against hard palate. Always geminate in Italian: /ɲɲ/.', examples: ['bagno','sogno','montagna','lasagna','gnocchi'], minimalPairs: [], commonErrors: ['Pronouncing as /ɡn/ (two sounds)','English /n/ sound'] },
    { id: 'c-gli', cat: 'consonants', name: 'GLI = /ʎ/ (palatal lateral)', ipa: '/ʎ/', desc: 'Absent from English. Tongue body against hard palate. Always geminate: /ʎʎ/.', examples: ['figlio','moglie','aglio','famiglia','bottiglia'], minimalPairs: [], commonErrors: ['Pronouncing as /ɡli/ (three sounds)','Using /l/ + /j/'] },
    { id: 'c-z', cat: 'consonants', name: 'Z = /ts/ or /dz/', ipa: '/ts/ /dz/', desc: '/ts/ (voiceless): grazie, pizza, stazione. /dz/ (voiced): zero, zona, azzurro. After consonant usually /ts/; word-initial usually /dz/.', examples: ['grazie','pizza','zero','zona','stazione','azzurro'], minimalPairs: [], commonErrors: ['English /z/ sound','Not distinguishing voiced/voiceless'] },
    { id: 's-sdrucciole', cat: 'stress', name: 'Parole sdrucciole', ipa: 'ˈ', desc: 'Antepenultimate stress (~15% of words): TAVolo, TELefono, ULtimo. No written accent — must be memorized.', examples: ['tavolo','telefono','ultimo','subito','sabato','zucchero'], minimalPairs: [['subito (immediately)','subito (suffered)']], commonErrors: ['Defaulting to penultimate stress'] },
    { id: 'i-statement', cat: 'intonation', name: 'Statement intonation', ipa: '↘', desc: 'Gradual descent with fall at end. Italian has wider pitch range than English.', examples: ['Sono italiano. ↘','Fa molto caldo oggi. ↘'], minimalPairs: [], commonErrors: ['Rising at end (English uptalk)','Too flat'] },
    { id: 'i-ynq', cat: 'intonation', name: 'Yes/No question rise', ipa: '↗', desc: 'Rise at end. Same word order as statement — intonation alone marks the question.', examples: ['Sei italiano? ↗','Viene anche Maria? ↗'], minimalPairs: [], commonErrors: ['Insufficient rise','Relying on word order instead'] },
    { id: 'cs-noreduction', cat: 'connected-speech', name: 'No vowel reduction', ipa: '(full vowels)', desc: 'Italian does NOT reduce unstressed vowels. Every vowel keeps full quality: telefono = /te.ˈlɛ.fo.no/, NOT /tə.ˈlɛ.fə.noʊ/.', examples: ['telefono','universita','cioccolato','comunicazione'], minimalPairs: [], commonErrors: ['Schwa /ə/ in unstressed syllables (English habit)','Swallowing final vowels'] },
  ],
  B2: [
    { id: 'gem-raddoppiamento', cat: 'geminates', name: 'Raddoppiamento sintattico', ipa: '(syntactic doubling)', desc: 'In central/southern Italian, certain words trigger consonant doubling of the next word: "a casa" = /ak.ˈka.za/, "e bello" = /ɛb.ˈbɛl.lo/. Triggers: a, e (verb), che, come, da, fra, dove, se, su.', examples: ['a casa','e bello','che cosa','come mai','da Roma'], minimalPairs: [], commonErrors: ['Not doubling (northern pattern — also valid)'] },
    { id: 'c-affricates', cat: 'consonants', name: 'Four affricates', ipa: '/tʃ dʒ ts dz/', desc: '/tʃ/ cena, /dʒ/ gente, /ts/ grazie, /dz/ zero. Italian has four affricates — English has only two (/tʃ/, /dʒ/).', examples: ['cielo','gelo','razza','mezzo'], minimalPairs: [['cielo (sky)','gelo (frost)'],['razza /ts/ (breed)','razza /dz/ (ray)']], commonErrors: ['Not distinguishing /ts/ from /dz/'] },
    { id: 'c-s-voicing', cat: 'consonants', name: 'S voicing rules', ipa: '/s/ /z/', desc: 'Word-initial before vowel = /s/. Before voiced consonant = /z/ (sbaglio). Between vowels = /z/ (north) or /s/ (south). Double SS = always /s/.', examples: ['sole','sbaglio','casa','rosso'], minimalPairs: [['chiese (churches) /s/','chiese (he asked) /z/']], commonErrors: ['Always using /s/','Always using /z/'] },
    { id: 'i-whq', cat: 'intonation', name: 'Wh-question fall', ipa: '↘', desc: 'Wh-questions fall at end: "Dove vai?" ↘ "Come ti chiami?" ↘', examples: ['Dove vai?','Come ti chiami?','Quando parti?'], minimalPairs: [], commonErrors: ['Rising like a yes/no question'] },
    { id: 'i-list', cat: 'intonation', name: 'List intonation', ipa: '↗...↘', desc: 'Rise on each item, fall on last: "Ho comprato pane↗, latte↗, e formaggio↘."', examples: ['pane, latte, uova e formaggio'], minimalPairs: [], commonErrors: ['Falling too early'] },
    { id: 'c-unaspirated', cat: 'consonants', name: 'Unaspirated stops', ipa: '/p t k/', desc: '/p/, /t/, /k/ have NO puff of air. Hold hand in front of mouth — no breath. /t/ and /d/ are dental (tongue touches teeth, not alveolar ridge).', examples: ['pane','tempo','casa','tutto','grande'], minimalPairs: [], commonErrors: ['Aspirating like English','Alveolar instead of dental /t/ /d/'] },
  ],
  C1: [
    { id: 'cs-rhythm', cat: 'connected-speech', name: 'Syllable-timed rhythm', ipa: '(rhythm)', desc: 'Italian is syllable-timed: every syllable gets roughly equal duration. No schwa, no swallowed syllables. More melodic than English.', examples: ['te-LE-fo-no','u-ni-ver-si-TA','co-mu-ni-ca-ZIO-ne'], minimalPairs: [], commonErrors: ['Stress-timed rhythm (English)','Reducing unstressed syllables'] },
    { id: 'v-regional', cat: 'vowels', name: 'Regional vowel variation', ipa: '/e/-/ɛ/ /o/-/ɔ/', desc: 'Open/closed /e/ and /o/ vary by region. Tuscany preserves the standard distinctions best. Northern Italian often merges them. Both are intelligible.', examples: ['pesca/pesca','botte/botte','venti/venti'], minimalPairs: [], commonErrors: ['Inconsistent within a single register'] },
    { id: 'i-excl', cat: 'intonation', name: 'Exclamation contour', ipa: '↗↘', desc: 'Wide pitch range for exclamations. Italian is more melodic than most European languages.', examples: ['Che bello!','Ma dai!','Incredibile!','Mamma mia!'], minimalPairs: [], commonErrors: ['Too flat','Insufficient pitch range'] },
  ],
  C2: [
    { id: 'cs-native', cat: 'connected-speech', name: 'Native-like connected speech', ipa: '(flow)', desc: 'Full integration of geminates, stress, intonation, raddoppiamento sintattico, and regional features in rapid natural speech.', examples: ['Ma che cosa stai dicendo?','Non ci credo, e impossibile!'], minimalPairs: [], commonErrors: ['Slowing down at word boundaries','Losing geminates in fast speech'] },
    { id: 'c-dialect', cat: 'consonants', name: 'Pan-dialectal awareness', ipa: '(varies)', desc: 'Recognize features from multiple regions: raddoppiamento (central/south), gorgia toscana (aspirated /k/), Neapolitan vowel reduction, Roman rhotacism.', examples: ['la hasa (Tuscan gorgia)','Napule (Neapolitan)'], minimalPairs: [], commonErrors: ['Mixing features from different regions inconsistently'] },
  ],
};

// Tongue twisters by difficulty
const TONGUE_TWISTERS = [
  { id: 'tt-1', level: 'A2', text: 'Trentatre trentini entrarono a Trento, tutti e trentatre trotterellando.', focus: 'trill /r/, consonant clusters /tr/', ipa: '/tren.ta.ˈtre tren.ˈti.ni en.ˈtra.ro.no a ˈtren.to/' },
  { id: 'tt-2', level: 'A2', text: 'Sopra la panca la capra campa, sotto la panca la capra crepa.', focus: 'geminate /pp/, /kk/; /p/ vs /k/', ipa: '/ˈso.pra la ˈpaŋ.ka la ˈka.pra ˈkam.pa/' },
  { id: 'tt-3', level: 'B1', text: 'Se l\'arcivescovo di Costantinopoli si disarcivescovicostantinopolizzasse, vi disarcivescovicostantinopolizzereste voi?', focus: 'syllable-timed rhythm, vowel purity across many syllables', ipa: '(practice steady rhythm on each syllable)' },
  { id: 'tt-4', level: 'B1', text: 'Apelle figlio di Apollo fece una palla di pelle di pollo.', focus: 'geminate /ll/ vs single /l/, /p/ clusters', ipa: '/a.ˈpɛl.le ˈfi.ʎʎo di a.ˈpɔl.lo ˈfe.tʃe ˈu.na ˈpal.la di ˈpɛl.le di ˈpol.lo/' },
  { id: 'tt-5', level: 'B1', text: 'Tigre contro tigre.', focus: 'trill /r/ in clusters, /ɡr/', ipa: '/ˈti.ɡre ˈkon.tro ˈti.ɡre/' },
  { id: 'tt-6', level: 'B2', text: 'Sul tagliere taglia l\'aglio, non tagliare la tovaglia. La tovaglia non e aglio, e se la tagli non e tovaglia.', focus: 'GLI /ʎ/ sound throughout, geminate contrasts', ipa: '(focus on consistent /ʎ/ production)' },
  { id: 'tt-7', level: 'B2', text: 'Chi ama chiama chi ama. Chiama chi ama, chi ama chiama.', focus: 'CH /k/ vs C /tʃ/, geminates', ipa: '/ki ˈa.ma ˈkja.ma ki ˈa.ma/' },
  { id: 'tt-8', level: 'C1', text: 'In un piatto poco cupo, poco pepe pesto cape.', focus: '/p/ unaspirated, geminate /pp/, vowel purity', ipa: '/in um ˈpjat.to ˈpɔ.ko ˈku.po ˈpɔ.ko ˈpe.pe ˈpes.to ˈka.pe/' },
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
    if (cats.geminates) {
      const emerging = cats.geminates.items.filter(i => i.status === 'emerging' || i.status === 'not-started');
      if (emerging.length) recs.push('Focus on geminate consonants -- ' + emerging.length + ' geminate sounds need work. This is the #1 priority.');
    }
    if (cats.vowels) {
      const emerging = cats.vowels.items.filter(i => i.status === 'emerging' || i.status === 'not-started');
      if (emerging.length) recs.push('Work on vowel purity -- ' + emerging.length + ' vowel sounds need attention.');
    }
    if (next.totalDue > 0) recs.push(next.totalDue + ' sound(s) due for review today.');
    if (next.totalUnstarted > 3) recs.push(next.totalUnstarted + ' sounds not yet started at your level.');
    if (cats['connected-speech']) {
      const cs = cats['connected-speech'];
      if (cs.studied === 0) recs.push('Start connected speech practice (no vowel reduction, syllable-timed rhythm).');
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
