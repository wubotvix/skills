// Filipino Pronunciation Tutor -- all data embedded, FSRS-tracked
const core = require('../_lib/core');

const SKILL_NAME = 'filipino-pronunciation';

// ---------------------------------------------------------------------------
// SOUND DATA by CEFR level
// ---------------------------------------------------------------------------
const SOUNDS = {
  A1: [
    // Vowels
    { id: 'v-a', cat: 'vowels', name: 'Open central /a/', ipa: '/a/', desc: 'Mouth wide open, tongue low and central. Similar to English "father" but shorter. In unstressed position may reduce to [ɐ].', examples: ['aso','bata','araw','bahay'], minimalPairs: [['aso','uso'],['araw','uraw']], commonErrors: ['English schwa substitution in unstressed syllables'] },
    { id: 'v-e', cat: 'vowels', name: 'Open-mid front /ɛ/', ipa: '/ɛ/', desc: 'Lips slightly spread, open-mid front. In Filipino, /e/ and /i/ may alternate in casual speech (historical feature).', examples: ['mesa','leche','berde','eto'], minimalPairs: [['mesa','misa']], commonErrors: ['Confusion with /i/ — both are acceptable in some words'] },
    { id: 'v-i', cat: 'vowels', name: 'Close front /i/', ipa: '/i/', desc: 'Lips spread, tongue high and front. Short and crisp, no glide.', examples: ['isa','silya','isda','init'], minimalPairs: [['piso','peso']], commonErrors: ['Too long or glided'] },
    { id: 'v-o', cat: 'vowels', name: 'Close-mid back /o/', ipa: '/o/', desc: 'Lips rounded, mid-back. /o/ and /u/ may alternate in casual speech.', examples: ['opo','oras','itlog','bato'], minimalPairs: [['bato','buto']], commonErrors: ['Confusion with /u/ — both acceptable in some words'] },
    { id: 'v-u', cat: 'vowels', name: 'Close back /u/', ipa: '/u/', desc: 'Lips rounded tightly, tongue high and back. Short, no glide.', examples: ['ulo','ulan','buwan','gusto'], minimalPairs: [['buto','bato']], commonErrors: ['Too long or glided'] },
    // Glottal stop
    { id: 'c-glottal', cat: 'consonants', name: 'Glottal stop /ʔ/', ipa: '/ʔ/', desc: 'Brief closure of vocal cords, like the break in English "uh-oh". PHONEMIC in Filipino — changes meaning. Occurs word-finally after vowels, between vowels, and word-initially before vowels.', examples: ['aso /ʔa.so/','bata /ba.taʔ/ (bathrobe)','pito /pi.toʔ/ (whistle)'], minimalPairs: [['bata (child)','bataʔ (bathrobe)'],['pito (seven)','pitoʔ (whistle)']], commonErrors: ['Omitting word-final glottal stop','Not producing glottal before initial vowels'] },
  ],
  A2: [
    // NG phoneme
    { id: 'c-ng', cat: 'consonants', name: 'Velar nasal /ŋ/ (ng)', ipa: '/ŋ/', desc: '"Ng" is a SINGLE phoneme /ŋ/, not two sounds. Can appear at WORD-INITIAL position (unusual for English speakers). Drill: say "singing" → hold the /ŋ/ → add vowel → "nga", "ngi", "ngo".', examples: ['ngiti (smile)','ngayon (now)','ngunit (but)','mangga (mango)'], minimalPairs: [['nang (so that)','ng (of, genitive)']], commonErrors: ['Cannot produce word-initial /ŋ/','Splitting into /n/ + /g/'] },
    // Flap
    { id: 'c-flap', cat: 'consonants', name: 'Alveolar flap /ɾ/', ipa: '/ɾ/', desc: 'Quick single tap of tongue on alveolar ridge. Like American English "butter" or "better" flap. Filipino does NOT use the English retroflex /r/.', examples: ['araw','biro','taray','pero'], minimalPairs: [['biro (joke)','bilo (curl)']], commonErrors: ['English retroflex /ɹ/','Rolling/trilling the R'] },
    // Stress basics
    { id: 's-basic', cat: 'stress', name: 'Phonemic stress (basic)', ipa: 'ˈ', desc: 'Filipino stress is PHONEMIC — it changes meaning. Stress falls on either penultimate or ultimate syllable. BUkas=open, buKAS=tomorrow. BAsa=read, baSA=wet.', examples: ['BUkas/buKAS','BAsa/baSA','BAta/baTAʔ','PIto/piTOʔ'], minimalPairs: [['BUkas (open)','buKAS (tomorrow)'],['BAsa (read)','baSA (wet)'],['BAta (child)','baTAʔ (bathrobe)'],['TUlong (help)','tuLONG (push)']], commonErrors: ['Defaulting to one stress pattern','Not distinguishing stress-based meaning changes'] },
  ],
  B1: [
    // Stress with affixes
    { id: 's-affixed', cat: 'stress', name: 'Stress shift with affixes', ipa: 'ˈ', desc: 'Stress often shifts when affixes are added: SUlat → magSUlat → suLAtin. Learning stress patterns with affixes is critical for intelligibility.', examples: ['SUlat → magSUlat','KAin → kaINin','LUto → magluLUto'], minimalPairs: [], commonErrors: ['Not shifting stress with affixes','Stressing the affix instead of root'] },
    // Connected speech
    { id: 'cs-linking', cat: 'connected-speech', name: 'Vowel linking', ipa: '(linking)', desc: 'Words flow together at vowel boundaries: "Kumain ako" → /ku.ma.i.na.ko/. "Ang aso" → /a.ŋa.so/.', examples: ['Kumain ako → /ku.ma.i.na.ko/','Ang aso → /a.ŋa.so/','sa akin → /sa.kin/'], minimalPairs: [], commonErrors: ['Inserting glottal stop between words','Pausing at word boundaries'] },
    // Intonation
    { id: 'i-statement', cat: 'intonation', name: 'Statement intonation', ipa: '↘', desc: 'Statements fall at the end: "Kumain na ako." ↘', examples: ['Kumain na ako.','Pupunta kami bukas.','Masaya ako.'], minimalPairs: [], commonErrors: ['Rising at end (English uptalk)'] },
    { id: 'i-ynq', cat: 'intonation', name: 'Yes/No question rise (ba)', ipa: '↗', desc: 'Yes/no questions (especially with "ba") rise at end: "Kumain ka na ba?" ↗', examples: ['Kumain ka na ba?','Pupunta ka?','Gusto mo ba?'], minimalPairs: [], commonErrors: ['Insufficient rise','Falling like a statement'] },
    { id: 'i-whq', cat: 'intonation', name: 'Wh-question rise-fall', ipa: '↗↘', desc: 'Wh-questions (sino, ano, saan, etc.) have rise-fall: "Saan ka pupunta?" ↗↘', examples: ['Saan ka pupunta?','Bakit?','Sino siya?'], minimalPairs: [], commonErrors: ['Flat intonation','Rising like yes/no question'] },
  ],
  B2: [
    // Reductions
    { id: 'cs-reductions', cat: 'connected-speech', name: 'Common reductions', ipa: '(reduction)', desc: 'Natural Filipino reduces many words: Hindi→\'Di, Huwag→\'Wag, Paano→Pa\'no, Ganoon→Ganon, Iyon→\'Yon, Sa akin→Sakin.', examples: ["'Di ko alam","'Wag mo","Pa'no ba?","Ganon ba?"], minimalPairs: [], commonErrors: ['Not recognizing reduced forms','Over-reducing in formal contexts'] },
    // Borrowed sounds
    { id: 'c-borrowed', cat: 'consonants', name: 'Borrowed consonants', ipa: '/f/ /v/ /tʃ/ /dʒ/ /ʃ/ /z/', desc: 'From Spanish/English loanwords. Some speakers replace: /f/→/p/, /v/→/b/, /z/→/s/. Both pronunciations are acceptable.', examples: ['Filipino/Pilipino','video/bidyo','chocolate/tsokolate','jeep/dyip'], minimalPairs: [['Filipino','Pilipino']], commonErrors: ['Over-correcting native Filipino speakers who use /p/ for /f/'] },
    // Emotional intonation
    { id: 'i-emotion', cat: 'intonation', name: 'Emotional intonation', ipa: '(various)', desc: 'Surprise: "Talaga?!" ↗↗. Excitement: "Ang ganda!" ↗↘. Sarcasm: "Ah, ganoon." (flat ↘). Endearment: elongated vowels "Hayyy..."', examples: ['Talaga?!','Ang ganda!','Ah, ganoon.','Hayyy...'], minimalPairs: [], commonErrors: ['Too flat emotional expression','Insufficient pitch range'] },
  ],
  C1: [
    // Syllable structure
    { id: 'cs-syllable', cat: 'connected-speech', name: 'Syllable structure mastery', ipa: '(CV/CVC)', desc: 'Filipino syllables are mostly CV or CVC. No complex clusters in native words. Loanwords may add vowels: "school"→"eskwela", "president"→"presidente".', examples: ['ka.in','ba.ta','is.da','es.kwe.la'], minimalPairs: [], commonErrors: ['Pronouncing loanword clusters as in English'] },
    // Regional awareness
    { id: 'cs-regional', cat: 'connected-speech', name: 'Regional awareness', ipa: '(varies)', desc: 'Manila Filipino is the standard, but awareness of Visayan intonation (more musical), Ilocano influences, and Mindanao patterns helps comprehension.', examples: ['Manila: "Saan ka pupunta?"','Visayan-influenced: different intonation contour'], minimalPairs: [], commonErrors: ['Assuming Manila pronunciation is the only valid form'] },
  ],
  C2: [
    // Full connected speech mastery
    { id: 'cs-full', cat: 'connected-speech', name: 'Native-like connected speech', ipa: '(flow)', desc: 'Full integration: linking + reductions + stress + intonation in rapid natural speech, including Taglish switching without breaking prosodic flow.', examples: ["Nag-meeting kami kanina, tapos nag-decide na i-move 'yung deadline.","'No ba 'yan? 'Di ba sabi mo 'di ka pupunta?"], minimalPairs: [], commonErrors: ['Slowing down at word boundaries','Breaking prosody when switching languages in Taglish'] },
  ],
};

// Tongue twisters / practice phrases
const TONGUE_TWISTERS = [
  { id: 'tt-1', level: 'A1', text: 'Naglalaba ang laba-laba sa lababo.', focus: 'syllable rhythm, /l/ and /b/ alternation', ipa: '/nag.la.la.ba aŋ la.ba.la.ba sa la.ba.bo/' },
  { id: 'tt-2', level: 'A2', text: 'Pitumpu\'t pitong puting pusa.', focus: 'word-initial /p/, stress patterns', ipa: '/pi.tum.put pi.toŋ pu.tiŋ pu.sa/' },
  { id: 'tt-3', level: 'B1', text: 'Kung mani ang kinakain ko, ngayon, nguni\'t ang ngipin ko ay ngumingiti.', focus: 'word-initial /ŋ/, multiple ng- words', ipa: '(focus on smooth /ŋ/ production in initial position)' },
  { id: 'tt-4', level: 'B1', text: 'Ang relo ni Rogelio ay rolyong ginto.', focus: 'flap /ɾ/, consonant clusters in loanwords', ipa: '/aŋ ɾe.lo ni ɾo.he.ljo aj ɾol.joŋ gin.to/' },
  { id: 'tt-5', level: 'B2', text: 'Minekaniko ni Monico ang makina ng Minica ni Monica.', focus: 'rapid syllable production, stress placement', ipa: '(even syllable timing throughout)' },
  { id: 'tt-6', level: 'C1', text: 'Nakakagulat na nakakapagpabagabag ang mga nakakapagsawalang-bahala.', focus: 'multiple affixes, sustained rhythm through long words', ipa: '(maintain even rhythm across heavily affixed words)' },
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

  listStudents() { return core.listProfiles(this.dir); }

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
      prompt: `Repeat this slowly, then speed up:\n"${tt.text}"\nFocus: ${tt.focus}`,
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
    };
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
      if (!id) throw new Error('Usage: exercise <studentId> [type]');
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
