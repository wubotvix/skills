// Belarusian Pronunciation Tutor -- all data embedded, FSRS-tracked
const core = require('../_lib/core');

const SKILL_NAME = 'belarusian-pronunciation';

// ---------------------------------------------------------------------------
// SOUND DATA by CEFR level
// ---------------------------------------------------------------------------
const SOUNDS = {
  A1: [
    // Vowels and аканне
    { id: 'v-a', cat: 'vowels', name: 'Open /a/', ipa: '/a/', desc: 'Open front vowel. Same as Russian а. Present in ALL unstressed positions where Russian has о (аканне).', examples: ['малако','галава','вада','дарога'], minimalPairs: [['мак','мок (stressed)']], commonErrors: ['Not applying аканне in speech'] },
    { id: 'v-o', cat: 'vowels', name: 'Mid back /ɔ/ (stressed only)', ipa: '/ɔ/', desc: 'Mid back rounded vowel. ONLY appears in stressed position. Unstressed о → а (аканне).', examples: ['го́рад','до́бры','по́ле','стол'], minimalPairs: [['го́рад (stressed о)','гарады́ (unstressed → а)']], commonErrors: ['Using о in unstressed positions'] },
    { id: 'v-jakanne', cat: 'vowels', name: 'Яканне (е → я unstressed)', ipa: '/a/ after soft C', desc: 'Unstressed е after soft consonant → я [a]. Written as я. вясна́ (not *весна).', examples: ['вясна','зямля','сяло','пяро'], minimalPairs: [['ве́чар (stressed е stays)','вясна́ (unstressed е → я)']], commonErrors: ['Keeping е in unstressed position (Russian habit)'] },
    { id: 'v-y', cat: 'vowels', name: 'Close central /ɨ/', ipa: '/ɨ/', desc: 'Like Russian ы. Between "i" and "u", unrounded. No English equivalent.', examples: ['быць','мыць','сыр','рыба'], minimalPairs: [['быць (to be)','біць (to beat)']], commonErrors: ['Substituting English /i/'] },
    // Ў
    { id: 'c-uu', cat: 'consonants', name: 'Ў [w] — non-syllabic u', ipa: '/w/', desc: 'UNIQUE to Belarusian among all Slavic languages. Like English "w". Appears after vowels where Russian has в before consonant/end.', examples: ['аўтобус','даўно','праўда','быў','рабіў'], minimalPairs: [['у школе (syllabic)','аўтобус (non-syllabic)']], commonErrors: ['Pronouncing as [v] (Russian habit)'] },
    // Г
    { id: 'c-h', cat: 'consonants', name: 'Г [ɣ] velar fricative', ipa: '/ɣ/', desc: 'Voiced VELAR fricative. NOT Russian [ɡ] (plosive) or Ukrainian [ɦ] (glottal). Tongue near velum, air passes through continuously.', examples: ['горад','галава','гаварыць','гара'], minimalPairs: [['гара (mountain)','кара (punishment)']], commonErrors: ['Using Russian [ɡ] plosive','Using Ukrainian [ɦ] glottal'] },
  ],
  A2: [
    // Дзеканне/Цеканне
    { id: 'c-dz', cat: 'consonants', name: 'Дзеканне: д → дз', ipa: '/dz/', desc: 'Before soft vowels (і,е,ё,ю,я) and ь, д becomes дз. This is STANDARD, not dialectal.', examples: ['дзень','дзеці','дзверы','дзяўчына'], minimalPairs: [['дым (д before hard)','дзень (д before soft → дз)']], commonErrors: ['Using Russian [dʲ] instead of [dz]'] },
    { id: 'c-ts', cat: 'consonants', name: 'Цеканне: т → ц', ipa: '/ts/', desc: 'Before soft vowels, т becomes ц. ціхі (not *тіхі), цябе (not *цебе).', examples: ['ціхі','цябе','цень','цікавы'], minimalPairs: [['тата (т before hard)','ціхі (т before soft → ц)']], commonErrors: ['Using Russian [tʲ] instead of [ts]'] },
    { id: 'c-dzh', cat: 'consonants', name: 'ДЖ [dʒ] affricate', ipa: '/dʒ/', desc: 'Single phoneme, like English "j" in "judge". Found in хаджу (1st sg of хадзіць).', examples: ['хаджу','ваджу','саджу','дождж'], minimalPairs: [], commonErrors: ['Splitting into д+ж'] },
    { id: 's-stress', cat: 'stress', name: 'Free mobile stress', ipa: 'ˈ', desc: 'Stress is free and mobile like Russian. Interacts with spelling: unstressed о→а. за́мак (castle) vs замо́к (lock).', examples: ['за́мак/замо́к','мýка/мукá','го́рад/гарады́'], minimalPairs: [['за́мак (castle)','замо́к (lock)'],['мýка (torment)','мукá (flour)']], commonErrors: ['Wrong stress placement','Ignoring stress-spelling interaction'] },
    { id: 'c-r', cat: 'consonants', name: 'Alveolar trill /r/', ipa: '/r/', desc: 'Alveolar trill, same as Russian р. Tongue tip vibrates against alveolar ridge.', examples: ['рыба','горад','дарога','рабіць'], minimalPairs: [], commonErrors: ['English retroflex approximant'] },
  ],
  B1: [
    { id: 'cs-akanne', cat: 'connected-speech', name: 'Аканне in connected speech', ipa: '(rhythm)', desc: 'In rapid speech, ALL unstressed о become full [a]. "Я хачу малака" — three а sounds where Russian has о.', examples: ['Я хачу малака','Яна гаварыць па-беларуску'], minimalPairs: [], commonErrors: ['Reducing unstressed vowels to schwa (English habit)','Keeping Russian о pronunciation'] },
    { id: 'i-statement', cat: 'intonation', name: 'Statement intonation', ipa: '↘', desc: 'Falling intonation for statements: "Ён студэнт." ↘', examples: ['Ён студэнт.','Я жыву ў Мінску.','Мне падабаецца кава.'], minimalPairs: [], commonErrors: ['Rising at end (English uptalk)'] },
    { id: 'i-ynq', cat: 'intonation', name: 'Yes/No question rise', ipa: '↗', desc: 'Rising intonation for yes/no questions: "Ён студэнт?" ↗', examples: ['Ты тут жывеш?','Ты маеш час?','Гэта правільна?'], minimalPairs: [], commonErrors: ['Insufficient rise'] },
    { id: 'cs-linking', cat: 'connected-speech', name: 'Word linking', ipa: '(flow)', desc: 'Words flow together: "ён ідзе" → [jɔˈnʲidzʲɛ]. No glottal stops between vowels.', examples: ['ён ідзе','яна ў школе','я іду'], minimalPairs: [], commonErrors: ['Inserting pauses between words'] },
    { id: 'c-assimilation', cat: 'connected-speech', name: 'Voice assimilation', ipa: '(regressive)', desc: 'Regressive voice assimilation: просьба [ˈprɔzʲba] (с→з before б). Final devoicing: хлеб [xlʲɛp].', examples: ['просьба [ˈprɔzʲba]','хлеб [xlʲɛp]','горад [ˈɣɔrat]'], minimalPairs: [], commonErrors: ['Not devoicing word-final consonants'] },
  ],
  B2: [
    { id: 'c-soft-hard', cat: 'consonants', name: 'Hard/Soft consonant pairs', ipa: '/C/ vs /Cʲ/', desc: 'Most consonants have hard/soft variants. Soft sign (ь) marks softness. Important for meaning.', examples: ['кон (horse) vs конь (horse, archaic/poetic)','мал (small) vs маль (moth)'], minimalPairs: [], commonErrors: ['Not palatalizing before ь'] },
    { id: 'c-retrofl', cat: 'consonants', name: 'Always-hard ж, ч, ш', ipa: '/ʐ,tʂ,ʂ/', desc: 'Ж, ч, ш are always hard (retroflex), like Russian. NOT postalveolar like Ukrainian.', examples: ['жыць','чытаць','школа','шчасце'], minimalPairs: [], commonErrors: ['Making them soft (Ukrainian influence)'] },
    { id: 'i-whq', cat: 'intonation', name: 'Wh-question fall', ipa: '↘', desc: 'Wh-questions fall at end: "Дзе ты жывеш?" ↘', examples: ['Дзе ты жывеш?','Што ты робіш?','Як цябе завуць?'], minimalPairs: [], commonErrors: ['Rising like a yes/no question'] },
  ],
  C1: [
    { id: 'cs-rhythm', cat: 'connected-speech', name: 'Native-like rhythm', ipa: '(rhythm)', desc: 'Natural Belarusian rhythm with full [a] vowels in unstressed positions (not reduced like Russian [ɐ]). Every unstressed а is a clear [a].', examples: ['ма-ла-ко́','га-ла-ва́','да-ро́-га'], minimalPairs: [], commonErrors: ['Reducing unstressed vowels (Russian ə/ɐ habit)'] },
    { id: 'c-dialect', cat: 'consonants', name: 'Dialectal awareness', ipa: '(varies)', desc: 'Recognize regional features: some dialects have stronger дзеканне, different stress patterns, lexical variation.', examples: ['Regional stress variants','Dialectal vocabulary in literature'], minimalPairs: [], commonErrors: ['Assuming one uniform standard'] },
  ],
  C2: [
    { id: 'cs-full', cat: 'connected-speech', name: 'Native-like connected speech', ipa: '(flow)', desc: 'Full integration: аканне + яканне + дзеканне/цеканне + linking + intonation in rapid natural speech.', examples: ['Я хачу пайсці да магазіна і купіць малака.'], minimalPairs: [], commonErrors: ['Slowing down at word boundaries'] },
  ],
};

const TONGUE_TWISTERS = [
  { id: 'tt-1', level: 'A2', text: 'Быў бабёр белабровы і белабокі.', focus: 'б allophony, аканне, ў', ipa: '/bɨw baˈbʲɔr bʲɛlaˈbrovɨ i bʲɛlaˈbokʲi/' },
  { id: 'tt-2', level: 'A2', text: 'Дзеці бачылі дзіва-дзівоснае.', focus: 'дзеканне: дз sound', ipa: '/ˈdzʲɛtsʲi baˈtʂɨlʲi ˈdzʲiva dzʲiˈvosnajɛ/' },
  { id: 'tt-3', level: 'B1', text: 'Ціхі ціхан цішэй за цішыню.', focus: 'цеканне: ц sound, ш', ipa: '/ˈtsʲixʲi tsʲiˈxan tsʲiˈʂɛj za tsʲiʂɨˈnʲu/' },
  { id: 'tt-4', level: 'B1', text: 'Гаварыў гарадскі гарлахват.', focus: 'г [ɣ] velar fricative, аканне', ipa: '/ɣavaˈrɨw ɣaraˈdskʲi ɣarlaxˈvat/' },
  { id: 'tt-5', level: 'B2', text: 'Праўда пра праўду — праўдзівая праўда.', focus: 'ў [w] in multiple positions, дзеканне', ipa: '/ˈprawda pra ˈprawdu ˈprawdzʲivaja ˈprawda/' },
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
    return { studentId, level, date: td, category: category || 'all', reviewCount: reviewItems.length, newCount: newItems.length, exercises };
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
      return { exerciseId: exId, type: 'minimal-pairs', soundId: sound.id, soundName: sound.name, ipa: sound.ipa, prompt: `Which word do you hear? Target: "${target}"`, options, answer: target, description: sound.desc };
    }
    if (type === 'stress-identification') {
      const word = core.pick(sound.examples, 1)[0];
      return { exerciseId: exId, type: 'stress-identification', soundId: sound.id, soundName: sound.name, prompt: `Identify the stressed syllable in: "${word}"`, word, description: sound.desc, hint: 'Break the word into syllables and find the stressed one.' };
    }
    const word = core.pick(sound.examples, 1)[0];
    return { exerciseId: exId, type: 'production', soundId: sound.id, soundName: sound.name, ipa: sound.ipa, prompt: `Say this word aloud, focusing on ${sound.name}: "${word}"`, word, description: sound.desc, selfAssessPrompt: 'Rate yourself 0-3: 0=cannot produce, 1=hear difference but struggle, 2=produce with concentration, 3=natural' };
  }

  _tongueTwister(level) {
    const idx = core.CEFR.indexOf(level);
    const eligible = TONGUE_TWISTERS.filter(t => core.CEFR.indexOf(t.level) <= idx);
    const tt = core.pick(eligible.length ? eligible : TONGUE_TWISTERS, 1)[0];
    return { exerciseId: 'tt-' + Date.now(), type: 'tonguetwister', text: tt.text, focus: tt.focus, ipa: tt.ipa, level: tt.level, prompt: `Repeat this tongue twister slowly, then speed up:\n"${tt.text}"\nFocus: ${tt.focus}`, selfAssessPrompt: 'Rate yourself 0-3: 0=cannot say it, 1=very slow only, 2=moderate speed, 3=fast and clear' };
  }

  checkAnswer(studentId, exerciseId, answer) {
    const ans = core.norm(answer);
    return { exerciseId, givenAnswer: answer, normalized: ans, note: 'For pronunciation exercises, use "record" to log your self-assessment grade (0-3).' };
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
    const next = new Date(); next.setDate(next.getDate() + interval);
    sk.nextReview = next.toISOString().slice(0, 10);
    sk.history.push({ date: core.today(), grade, fsrsGrade });
    p.assessments.push({ soundId, grade, date: core.today() });
    core.saveProfile(this.dir, p);
    return { studentId, soundId, soundName: sound.name, grade, stability: sk.stability, difficulty: sk.difficulty, nextReview: sk.nextReview, interval };
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
      totalStudied += data.studied; totalMastered += data.mastered; totalItems += data.total;
      catSummary[cat] = `${data.mastered}/${data.total} mastered`;
    }
    const recentAssessments = (p.assessments || []).slice(-10).reverse();
    return { studentId, level: p.level || 'A1', summary: { totalItems, totalStudied, totalMastered, percentMastered: totalItems ? Math.round(totalMastered / totalItems * 100) : 0 }, categories: catSummary, dueForReview: next.totalDue, unstartedRemaining: next.totalUnstarted, recentAssessments, recommendations: this._recommendations(progress, next) };
  }

  _recommendations(progress, next) {
    const recs = [];
    const cats = progress.categories;
    if (cats.vowels) {
      const emerging = cats.vowels.items.filter(i => i.status === 'emerging' || i.status === 'not-started');
      if (emerging.length) recs.push('Focus on аканне/яканне vowel patterns -- ' + emerging.length + ' vowel sounds need work.');
    }
    if (next.totalDue > 0) recs.push(next.totalDue + ' sound(s) due for review today.');
    if (next.totalUnstarted > 3) recs.push(next.totalUnstarted + ' sounds not yet started at your level.');
    if (cats.consonants) {
      const uu = cats.consonants.items.find(i => i.id === 'c-uu');
      if (uu && (uu.status === 'not-started' || uu.status === 'emerging')) recs.push('Practice ў [w] -- unique to Belarusian!');
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
      out({ commands: 'Use one of the commands listed in SKILL.md' });
      break;
    default:
      out({ error: 'Unknown command: ' + cmd, commands: ['start','set-level','lesson','exercise','check','record','progress','report','next','sounds','students'] });
  }
});

module.exports = { PronunciationTutor, SOUNDS, TONGUE_TWISTERS };
