// Ukrainian Pronunciation Tutor -- all data embedded, FSRS-tracked
const core = require('../_lib/core');

const SKILL_NAME = 'ukrainian-pronunciation';

// ---------------------------------------------------------------------------
// SOUND DATA by CEFR level
// ---------------------------------------------------------------------------
const SOUNDS = {
  A1: [
    // Vowels — NO reduction (key Ukrainian feature)
    { id: 'v-a', cat: 'vowels', name: 'Open /a/', ipa: '/a/', desc: 'Open front vowel. Same quality stressed or unstressed. Never reduces.', examples: ['мáма','кавá','парасóлька','хатá'], minimalPairs: [['мáти','мýти']], commonErrors: ['Reducing to schwa when unstressed (Russian habit)'] },
    { id: 'v-e', cat: 'vowels', name: 'Open-mid /ɛ/', ipa: '/ɛ/', desc: 'More open than Russian е. Always [ɛ], never [jɛ] at word start. Ukrainian є = [jɛ].', examples: ['мéне','сéрце','берéза','весná'], minimalPairs: [['сéло','сíло']], commonErrors: ['Reducing unstressed е to [ɪ] (Russian habit)', 'Adding [j] before initial е'] },
    { id: 'v-y', cat: 'vowels', name: 'Near-close /ɪ/ (и)', ipa: '/ɪ/', desc: 'UNIQUE Ukrainian vowel — between Russian и [i] and ы [ɨ]. Like English "bit" but slightly more retracted.', examples: ['син','лист','зимá','живи́й'], minimalPairs: [['бити (beat)','біти? (n/a)'],['ми (we)','мі (note)']], commonErrors: ['Producing Russian [i] instead', 'Producing Russian [ɨ] instead'] },
    { id: 'v-i', cat: 'vowels', name: 'Close front /i/ (і)', ipa: '/i/', desc: 'Close front vowel. Like Russian и. Softens preceding consonant.', examples: ['місто','ніс','сіль','пíсня'], minimalPairs: [['ніс (nose)','нис? (n/a)']], commonErrors: ['Confusing with и [ɪ]'] },
    { id: 'v-o', cat: 'vowels', name: 'Mid back /ɔ/', ipa: '/ɔ/', desc: 'Mid back rounded. STAYS [ɔ] even unstressed! молоко = [mɔlɔˈkɔ], NOT [məlɐˈko].', examples: ['молокó','головá','дорóга','водá'], minimalPairs: [['кот (cat)','кут (corner)']], commonErrors: ['Reducing to [ɐ] or [ə] when unstressed (biggest Russian habit!)'] },
    { id: 'v-u', cat: 'vowels', name: 'Close back /u/', ipa: '/u/', desc: 'Close back rounded. Same quality stressed or unstressed.', examples: ['рукá','вулиця','думáти','купи́ти'], minimalPairs: [['тут (here)','тáт? (n/a)']], commonErrors: ['Too short or fronted'] },
    // Key consonants
    { id: 'c-h', cat: 'consonants', name: 'Voiced glottal fricative г [ɦ]', ipa: '/ɦ/', desc: 'NOT [ɡ]! Breathy voiced "h". Vocal cords vibrate, air passes through open glottis. Like saying "hah" with voice.', examples: ['гáрний','головá','говори́ти','грá'], minimalPairs: [['гул (rumble)','ґул (rare)']], commonErrors: ['Using Russian [ɡ] (hard stop)'] },
    { id: 'c-g', cat: 'consonants', name: 'Voiced velar plosive ґ [ɡ]', ipa: '/ɡ/', desc: 'Like English "g" in "go". RARE — only ~400 native words. Different from г [ɦ]!', examples: ['ґáнок','ґу́дзик','ґрунт','ґрéчний'], minimalPairs: [['грáти (play)','ґрáти (bars)']], commonErrors: ['Not distinguishing from г [ɦ]'] },
  ],
  A2: [
    { id: 'c-v', cat: 'consonants', name: 'В approximant [ʋ]/[w]', ipa: '/ʋ/~/w/', desc: 'NOT a fricative [v] like Russian. Labiodental approximant [ʋ] before vowels, becomes [w] before consonants and word-finally.', examples: ['водá [ʋɔˈda]','вчóра [ˈwtʃɔra]','прáвда [ˈprawda]','знов [znɔw]'], minimalPairs: [], commonErrors: ['Making a hard Russian [v]'] },
    { id: 'c-shch', cat: 'consonants', name: 'Щ = [ʃtʃ] (two sounds)', ipa: '/ʃtʃ/', desc: 'TWO sounds: ш + ч. NOT Russian long [ɕː]. Say "sh" then "ch" quickly.', examples: ['ще [ʃtʃɛ]','щáстя','борщ','плóща'], minimalPairs: [], commonErrors: ['Producing Russian long [ɕː] instead of [ʃtʃ]'] },
    { id: 'c-dzh', cat: 'consonants', name: 'Дж [dʒ] affricate', ipa: '/dʒ/', desc: 'Single phoneme like English "j" in "judge". Not a consonant cluster.', examples: ['бджолá','джерелó','дженéзький'], minimalPairs: [], commonErrors: ['Treating as two separate sounds д+ж'] },
    { id: 'c-dz', cat: 'consonants', name: 'Дз [dz] affricate', ipa: '/dz/', desc: 'Single phoneme. Like "ds" in "adds" pronounced as one sound.', examples: ['дзвін','дзéркало','кукуру́дза'], minimalPairs: [], commonErrors: ['Treating as two separate sounds д+з'] },
    { id: 's-basic', cat: 'stress', name: 'Basic stress rules', ipa: 'ˈ', desc: 'Ukrainian stress is FREE and MOBILE — can fall on any syllable. Must learn with each word. Stress shifts between forms: рукá → рýки.', examples: ['зáмок (castle) vs замóк (lock)','мýка (torment) vs мукá (flour)','плáчу (I cry) vs плачý (I pay)'], minimalPairs: [['зáмок','замóк'],['мýка','мукá'],['плáчу','плачý']], commonErrors: ['Stressing wrong syllable','Not learning stress with new words'] },
  ],
  B1: [
    { id: 'cs-assimilation', cat: 'connected-speech', name: 'Voice assimilation', ipa: '(assimilation)', desc: 'Regressive voicing: просьба [ˈprɔzʲba] (с→з before б). Regressive devoicing: ніжка [ˈnʲiʃka] (ж→ш before к).', examples: ['прóсьба [ˈprɔzʲba]','ні́жка [ˈnʲiʃka]','вóкзал [vɔɡˈzal]'], minimalPairs: [], commonErrors: ['Not assimilating in natural speech'] },
    { id: 'cs-linking', cat: 'connected-speech', name: 'Word linking', ipa: '(linking)', desc: 'Words flow together. Consonant-to-vowel linking: він іде → [wʲiˈnidɛ]. Less final devoicing than Russian.', examples: ['він іде́ [wʲiˈnidɛ]','хліб [xlʲib] (б stays voiced)'], minimalPairs: [], commonErrors: ['Inserting pauses between words','Devoicing final consonants like Russian'] },
    { id: 'i-statement', cat: 'intonation', name: 'Statement intonation (↘)', ipa: '↘', desc: 'Statements and wh-questions fall at the end.', examples: ['Він студéнт. ↘','Де ти живéш? ↘','Закри́й двéрі. ↘'], minimalPairs: [], commonErrors: ['Rising at end like a question'] },
    { id: 'i-ynq', cat: 'intonation', name: 'Yes/No question rise (↗)', ipa: '↗', desc: 'Yes/no questions rise on the focus word. No word order change needed.', examples: ['Він студéнт? ↗','Ти з Украї́ни? ↗'], minimalPairs: [], commonErrors: ['Insufficient rise','Changing word order instead of intonation'] },
    { id: 'c-palatalization', cat: 'consonants', name: 'Hard/soft consonant pairs', ipa: '(ʲ)', desc: 'Soft sign ь palatalizes preceding consonant. Ukrainian ж, ч, ш are ALWAYS hard (unlike Russian ч).', examples: ['день [dɛnʲ]','тінь [tʲinʲ]','батько [ˈbatʲkɔ]','кінь [kʲinʲ]'], minimalPairs: [['кон (horse-obsolete)','кінь (horse)'],['лук (onion)','люк (hatch)']], commonErrors: ['Softening ж/ч/ш like Russian'] },
  ],
  B2: [
    { id: 'c-postalveolar', cat: 'consonants', name: 'Postalveolar ж/ч/ш (lighter than Russian)', ipa: '/ʃ/ /ʒ/ /tʃ/', desc: 'Ukrainian ж, ч, ш are postalveolar, NOT retroflex like Russian. Sound lighter and more English-like.', examples: ['шкóла','чáсто','жи́ти'], minimalPairs: [], commonErrors: ['Curling tongue back like Russian retroflex'] },
    { id: 'i-list', cat: 'intonation', name: 'List intonation', ipa: '↗...↘', desc: 'Rise on each item, fall on last: "Я купи́в яблука↗, банáни↗, і апельси́ни↘."', examples: ['яблука↗, банáни↗, і апельси́ни↘'], minimalPairs: [], commonErrors: ['Falling too early','Flat intonation'] },
    { id: 's-shifts', cat: 'stress', name: 'Stress shifts in declension/conjugation', ipa: 'ˈ', desc: 'Stress often shifts between forms: рукá → рýки, писáти → пишý → пи́ше, головá → голови́.', examples: ['рукá → рýки','водá → вóди','писáти → пишý → пи́ше'], minimalPairs: [], commonErrors: ['Keeping stress fixed across forms'] },
  ],
  C1: [
    { id: 'cs-rhythm', cat: 'connected-speech', name: 'Even-rhythm mastery (no reduction)', ipa: '(rhythm)', desc: 'Every syllable maintains vowel quality. No schwa reduction. молоко = [mɔ-lɔ-ˈkɔ] with three clear [ɔ]s.', examples: ['мо-ло-кó','го-ло-су-вáн-ня','пе-ре-мó-га'], minimalPairs: [], commonErrors: ['Stress-timed rhythm from English','Vowel reduction from Russian'] },
    { id: 'i-contrastive', cat: 'intonation', name: 'Contrastive stress', ipa: 'ˈ', desc: 'Same sentence means different things depending on focus word.', examples: ['Я НЕ КАЗÁВ, що він це зробив.','Я не казав, що ВІН це зробив.'], minimalPairs: [], commonErrors: ['Not varying nuclear stress for meaning'] },
  ],
  C2: [
    { id: 'cs-native', cat: 'connected-speech', name: 'Native-like connected speech', ipa: '(flow)', desc: 'Full integration: linking + assimilation + rhythm + intonation in rapid natural speech.', examples: ['Як ви почувáєтесь? (fluid, all vowels full)'], minimalPairs: [], commonErrors: ['Slowing down at word boundaries'] },
    { id: 'c-regional', cat: 'consonants', name: 'Regional variation awareness', ipa: '(varies)', desc: 'Recognize Western (Galician), Central (Kyiv standard), and Eastern features.', examples: ['Western: файний = гарний','Eastern: more Russian influence'], minimalPairs: [], commonErrors: ['Inconsistent dialect features'] },
  ],
};

const TONGUE_TWISTERS = [
  { id: 'tt-1', level: 'A2', text: 'Ішов Прокіп, кипів окріп, прийшов Прокіп — кипить окріп.', focus: 'vowel quality, no reduction', ipa: '(maintain all vowels full quality)' },
  { id: 'tt-2', level: 'A2', text: 'Горіла гора горобина, горіла горіхова гілка.', focus: 'г [ɦ] production', ipa: '(all г = [ɦ], breathy)' },
  { id: 'tt-3', level: 'B1', text: 'Бджола бджолу не жалить.', focus: 'дж affricate, consonant clusters', ipa: '/bdʒɔˈla bdʒɔˈlu nɛ ʒaˈlɪtʲ/' },
  { id: 'tt-4', level: 'B1', text: 'На дворі трава, на траві дрова.', focus: 'р trill, consonant clusters', ipa: '(clear alveolar trill in тр, др clusters)' },
  { id: 'tt-5', level: 'B2', text: 'Розкажіть про вашу подорож через Закарпаття.', focus: 'multiple challenging sounds: ж, щ-like clusters, stress', ipa: '(maintain even rhythm throughout)' },
  { id: 'tt-6', level: 'C1', text: 'Голосувáння за запропонóвану поправку до зáкону тривáтиме до п\'ятниці.', focus: 'maintaining all vowels full quality in long word', ipa: '(every о stays [ɔ], every a stays [a])' },
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

    return {
      studentId, level: p.level || 'A1',
      summary: { totalItems, totalStudied, totalMastered, percentMastered: totalItems ? Math.round(totalMastered / totalItems * 100) : 0 },
      categories: catSummary,
      dueForReview: next.totalDue,
      unstartedRemaining: next.totalUnstarted,
      recentAssessments: (p.assessments || []).slice(-10).reverse(),
      recommendations: this._recommendations(progress, next),
    };
  }

  _recommendations(progress, next) {
    const recs = [];
    const cats = progress.categories;
    if (cats.vowels) {
      const emerging = cats.vowels.items.filter(i => i.status === 'emerging' || i.status === 'not-started');
      if (emerging.length) recs.push('Focus on vowel quality (no reduction!) -- ' + emerging.length + ' vowel sounds need work.');
    }
    if (next.totalDue > 0) recs.push(next.totalDue + ' sound(s) due for review today.');
    if (next.totalUnstarted > 3) recs.push(next.totalUnstarted + ' sounds not yet started at your level.');
    if (cats['connected-speech']) {
      const cs = cats['connected-speech'];
      if (cs.studied === 0) recs.push('Start connected speech practice (linking, assimilation).');
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
