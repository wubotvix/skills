// Polish Pronunciation Tutor -- all data embedded, FSRS-tracked
const core = require('../_lib/core');

const SKILL_NAME = 'polish-pronunciation';

// ---------------------------------------------------------------------------
// SOUND DATA by CEFR level
// ---------------------------------------------------------------------------
const SOUNDS = {
  A1: [
    // Vowels
    { id: 'v-a', cat: 'vowels', name: 'Open central /a/', ipa: '/a/', desc: 'Mouth open, tongue low and central. Like "father" but shorter.', examples: ['tak','mama','kawa','rata'], minimalPairs: [['tam','tom'],['tak','tok']], commonErrors: ['English /æ/ substitution'] },
    { id: 'v-e', cat: 'vowels', name: 'Open-mid front /ɛ/', ipa: '/ɛ/', desc: 'Like English "bed". Never slides to /eɪ/. Pure, short.', examples: ['ten','ser','bez','pech'], minimalPairs: [['sen','syn'],['lek','lak']], commonErrors: ['Diphthongizing to /eɪ/'] },
    { id: 'v-i', cat: 'vowels', name: 'Close front /i/', ipa: '/i/', desc: 'Like English "see" but shorter. Lips spread. Palatalizes preceding consonant.', examples: ['miś','pić','film','kino'], minimalPairs: [['miś','mysz'],['bit','but']], commonErrors: ['Too long or glided'] },
    { id: 'v-o', cat: 'vowels', name: 'Open-mid back /ɔ/', ipa: '/ɔ/', desc: 'More open than English "go". Lips rounded. No glide.', examples: ['kot','dom','noc','rok'], minimalPairs: [['tok','tak'],['nos','nas']], commonErrors: ['Diphthongizing to /oʊ/'] },
    { id: 'v-u', cat: 'vowels', name: 'Close back /u/', ipa: '/u/', desc: 'Like "boot" but shorter. Note: u and ó are the SAME sound.', examples: ['but','mur','góra','ósmy'], minimalPairs: [['but','bat'],['tur','tor']], commonErrors: ['Distinguishing u from ó (they are identical!)'] },
    { id: 'v-y', cat: 'vowels', name: 'Close central /ɨ/', ipa: '/ɨ/', desc: 'UNIQUE to Polish. Between /i/ and /u/. Tongue high and central. Say /i/ then pull tongue back without rounding lips.', examples: ['syn','ty','być','mysz'], minimalPairs: [['syn','sen'],['mysz','miś'],['byt','bit']], commonErrors: ['Substituting /i/ (too front)','Substituting /u/ (too rounded)'] },
    // Basic consonants
    { id: 'c-w', cat: 'consonants', name: 'W = /v/', ipa: '/v/', desc: 'Polish W is English V! Teeth on lower lip. "woda" = /vɔda/.', examples: ['woda','wino','ważny','wieś'], minimalPairs: [['waga','Waga']], commonErrors: ['Pronouncing as English /w/'] },
    { id: 'c-l-dark', cat: 'consonants', name: 'Ł = /w/', ipa: '/w/', desc: 'Polish Ł sounds like English W in "water". NOT an L sound at all!', examples: ['ładny','stół','było','mały'], minimalPairs: [['las','łas'],['ładny','ladny']], commonErrors: ['Using /l/ or dark l instead of /w/'] },
  ],
  A2: [
    // Sibilant series 1: dental
    { id: 's-dental-s', cat: 'sibilants', name: 'Dental s /s/', ipa: '/s/', desc: 'Sharp, thin s. Tongue tip at teeth/alveolar ridge. Like English "see".', examples: ['sam','sen','nos','las'], minimalPairs: [['kasa','kasza'],['pas','pasz']], commonErrors: ['Confusing with sz'] },
    { id: 's-dental-z', cat: 'sibilants', name: 'Dental z /z/', ipa: '/z/', desc: 'Voiced partner of s. Like English "zoo".', examples: ['zupa','zero','mróz','bez'], minimalPairs: [['koza','koża']], commonErrors: ['Confusing with ż'] },
    // Sibilant series 2: postalveolar
    { id: 's-post-sz', cat: 'sibilants', name: 'Postalveolar sz /ʂ/', ipa: '/ʂ/', desc: 'Tongue curled back slightly. "Thick, hushing" sound. Like English "sh" but tongue more retracted.', examples: ['szum','szkoła','kosz','masz'], minimalPairs: [['kasza','kasa'],['szyk','syk']], commonErrors: ['Not retracting tongue enough'] },
    { id: 's-post-zz', cat: 'sibilants', name: 'Postalveolar ż/rz /ʐ/', ipa: '/ʐ/', desc: 'Voiced partner of sz. ż and rz are the SAME sound. Like English "measure" but more retracted.', examples: ['żaba','rzeka','może','morze'], minimalPairs: [['żar','źar']], commonErrors: ['Not distinguishing from ź'] },
    // Trilled R
    { id: 'c-r', cat: 'consonants', name: 'Trilled r /r/', ipa: '/r/', desc: 'Alveolar trill. 2-3 rapid taps of tongue tip. Like Spanish or Italian r.', examples: ['rok','rano','morze','brat'], minimalPairs: [['rak','lak']], commonErrors: ['English retroflex /ɹ/','French uvular /ʁ/'] },
    // Stress
    { id: 'str-penultimate', cat: 'stress', name: 'Penultimate stress rule', ipa: 'ˈ', desc: 'Polish stress is almost ALWAYS on the penultimate (2nd-to-last) syllable. This is fixed and predictable.', examples: ['ko-BIE-ta','War-SZA-wa','u-ni-wer-SY-tet','do-bra-NOC'], minimalPairs: [['MU-zy-ka (exception)','gra-MA-ty-ka (exception)']], commonErrors: ['Using English variable stress patterns'] },
  ],
  B1: [
    // Sibilant series 3: alveolo-palatal
    { id: 's-pal-s', cat: 'sibilants', name: 'Alveolo-palatal ś/si /ɕ/', ipa: '/ɕ/', desc: 'Tongue tip DOWN behind lower teeth. MIDDLE of tongue raised toward palate. "Light, bright hiss". No English equivalent.', examples: ['ślub','śnieg','siostra','osiem'], minimalPairs: [['Kasia','kasa'],['kosi','kosy']], commonErrors: ['Producing sz instead','Producing s instead'] },
    { id: 's-pal-z', cat: 'sibilants', name: 'Alveolo-palatal ź/zi /ʑ/', ipa: '/ʑ/', desc: 'Voiced partner of ś. Tongue position same as ś but with voicing.', examples: ['źle','źródło','ziarno','zima'], minimalPairs: [['kozia','koza']], commonErrors: ['Producing ż instead'] },
    { id: 's-pal-c', cat: 'sibilants', name: 'Alveolo-palatal ć/ci /tɕ/', ipa: '/tɕ/', desc: 'Affricate version of ś. Tongue same position, but starts with stop.', examples: ['ćma','ciało','nić','pięć'], minimalPairs: [['noc','noć']], commonErrors: ['Producing cz instead'] },
    { id: 's-pal-dz', cat: 'sibilants', name: 'Alveolo-palatal dź/dzi /dʑ/', ipa: '/dʑ/', desc: 'Voiced affricate partner of ć.', examples: ['dźwig','dziecko','niedźwiedź','jeździć'], minimalPairs: [], commonErrors: ['Producing dż instead'] },
    // Nasal vowels
    { id: 'v-nasal-a', cat: 'nasal-vowels', name: 'Nasal ą', ipa: '/ɔ̃/ → [ɔn/ɔm/ɔŋ/ɔw̃]', desc: 'Position-dependent: [ɔŋ] before k/g (ręka), [ɔm] before b/p (ząb), [ɔn] before t/d (kąt). NOT a pure nasal vowel!', examples: ['mąka','kąt','ząb','idą'], minimalPairs: [['mąka','muka']], commonErrors: ['Using French-style pure nasalization'] },
    { id: 'v-nasal-e', cat: 'nasal-vowels', name: 'Nasal ę', ipa: '/ɛ̃/ → [ɛn/ɛm/ɛŋ/ɛ]', desc: 'Like ą but with /ɛ/. IMPORTANT: word-final ę is often just /ɛ/ in modern speech! "lubię" = /lubjɛ/.', examples: ['ręka','będę','pięć','zrobię'], minimalPairs: [['ręka','reka']], commonErrors: ['Hypercorrect nasalization of final ę'] },
    // Intonation
    { id: 'i-statement', cat: 'intonation', name: 'Statement intonation', ipa: '↘', desc: 'Statements fall at end: "To jest mój dom." ↘', examples: ['To jest mój dom.','Mieszkam w Warszawie.'], minimalPairs: [], commonErrors: ['Rising at end (English uptalk)'] },
    { id: 'i-ynq', cat: 'intonation', name: 'Yes/No question rise', ipa: '↗', desc: 'Yes/No questions rise: "Czy masz czas?" ↗', examples: ['Czy masz czas?','Lubisz kawę?'], minimalPairs: [], commonErrors: ['Insufficient rise'] },
  ],
  B2: [
    // Consonant clusters
    { id: 'cl-szcz', cat: 'clusters', name: 'Cluster szcz', ipa: '/ʂtʂ/', desc: 'Two sounds: sz + cz. "szczęście" = happiness. Do NOT insert vowels.', examples: ['szczęście','jeszcze','Szczecin','deszcz'], minimalPairs: [], commonErrors: ['Inserting vowels between consonants'] },
    { id: 'cl-strz', cat: 'clusters', name: 'Cluster strz', ipa: '/stʂ/', desc: 'Three sounds: s + t + rz. "strzał" = shot.', examples: ['strzał','strzec','ostrzegać'], minimalPairs: [], commonErrors: ['Reducing to str'] },
    { id: 'cl-chrz', cat: 'clusters', name: 'Cluster chrz', ipa: '/xʂ/', desc: 'ch + rz. "chrzest" = baptism. The famous "chrząszcz" (beetle).', examples: ['chrzest','chrzan','chrząszcz'], minimalPairs: [], commonErrors: ['Dropping sounds'] },
    // Voicing rules
    { id: 'v-devoicing', cat: 'voicing', name: 'Final devoicing', ipa: '(rule)', desc: 'All voiced obstruents devoice word-finally: chleb /xlɛp/, mróz /mrus/, obiad /ɔbjat/.', examples: ['chleb /xlɛp/','mróz /mrus/','obiad /ɔbjat/','raz /ras/'], minimalPairs: [], commonErrors: ['Pronouncing final b,d,g,z as voiced'] },
    { id: 'v-assimilation', cat: 'voicing', name: 'Regressive voicing assimilation', ipa: '(rule)', desc: 'Clusters assimilate to voicing of last obstruent: prośba /prɔʑba/, wódka /vutka/.', examples: ['prośba /prɔʑba/','wódka /vutka/','też by /tɛʐ bɨ/'], minimalPairs: [], commonErrors: ['Not assimilating across word boundaries'] },
  ],
  C1: [
    // Advanced connected speech
    { id: 'cs-boundary', cat: 'connected-speech', name: 'Word boundary assimilation', ipa: '(linking)', desc: 'Voicing assimilation across word boundaries: "jak dobrze" = /jaɡ dɔbʐɛ/. Natural speech blends words.', examples: ['jak dobrze /jaɡ dɔbʐɛ/','pod stolem /pɔt stɔlɛm/'], minimalPairs: [], commonErrors: ['Keeping word boundaries too rigid'] },
    { id: 'cs-nasal-detail', cat: 'connected-speech', name: 'Nasal vowel allophony', ipa: '(varies)', desc: 'Full mastery of nasal vowel realization by position: ą = [ɔŋ] before velar, [ɔm] before labial, [ɔn] before dental, [ɔw̃] before fricative.', examples: ['ząb [zɔmp]','ręka [rɛŋka]','kąt [kɔnt]','wąs [vɔw̃s]'], minimalPairs: [], commonErrors: ['Using uniform nasalization'] },
  ],
  C2: [
    { id: 'cs-native', cat: 'connected-speech', name: 'Native-like connected speech', ipa: '(flow)', desc: 'Full integration: voicing assimilation + nasal allophony + cluster fluency + natural rhythm in rapid speech.', examples: ['W Szczebrzeszynie chrząszcz brzmi w trzcinie'], minimalPairs: [], commonErrors: ['Slowing at cluster boundaries'] },
    { id: 'c-regional', cat: 'connected-speech', name: 'Regional awareness', ipa: '(varies)', desc: 'Recognize regional features: Kraków a-raising, Silesian dialect, Kashubian influence, Poznań features.', examples: ['Kraków: raised /a/', 'Eastern Polish: longer vowels'], minimalPairs: [], commonErrors: ['Inconsistent dialect features'] },
  ],
};

// Tongue twisters
const TONGUE_TWISTERS = [
  { id: 'tt-1', level: 'A2', text: 'Król Karol kupił królowej Karolinie korale koloru koralowego.', focus: 'k sounds, vowel purity', ipa: '(focus on crisp /k/ and pure vowels)' },
  { id: 'tt-2', level: 'B1', text: 'Stół z powyłamywanymi nogami.', focus: 'ł /w/, consonant clusters, -ymi ending', ipa: '/stuw s pɔvɨwamɨvanɨmi nɔɡami/' },
  { id: 'tt-3', level: 'B1', text: 'Sześć Sasiek siedziało na sesjach.', focus: 'sz vs ś contrast (sześć vs siedziało)', ipa: '(focus on sz/ś three-way contrast)' },
  { id: 'tt-4', level: 'B2', text: 'W Szczebrzeszynie chrząszcz brzmi w trzcinie.', focus: 'szcz, chrz, brzm, trzcin clusters', ipa: '/f ʂtʂɛbʐɛʂɨɲɛ xʂɔw̃ʂtʂ bʐmi f tʂtɕiɲɛ/' },
  { id: 'tt-5', level: 'B2', text: 'Grzegorz Brzęczyszczykiewicz, powiat Chrząszczyżewoszyce, powiat Łękołody.', focus: 'extreme clusters, all sibilant series', ipa: '(practice each word slowly, then combine)' },
  { id: 'tt-6', level: 'C1', text: 'Pchnąć w tę łódź jeża lub ośm skrzyń fig.', focus: 'pangram — every Polish letter, nasal vowels, clusters', ipa: '/ptxnɔw̃tɕ f tɛ wutɕ jɛʐa lup ɔɕm skʂɨɲ fiɡ/' },
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
        description: sound.desc, hint: 'Remember: Polish stress is almost always on the penultimate syllable.',
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
    if (cats.sibilants) {
      const emerging = cats.sibilants.items.filter(i => i.status === 'emerging' || i.status === 'not-started');
      if (emerging.length) recs.push('Focus on sibilant contrasts (sz/ś/s) -- ' + emerging.length + ' sibilant sounds need work.');
    }
    if (cats.vowels) {
      const ySound = cats.vowels.items.find(i => i.id === 'v-y');
      if (ySound && ySound.status !== 'mastered') recs.push('Practice the unique Polish y /ɨ/ vowel.');
    }
    if (next.totalDue > 0) recs.push(next.totalDue + ' sound(s) due for review today.');
    if (next.totalUnstarted > 3) recs.push(next.totalUnstarted + ' sounds not yet started at your level.');
    if (cats.clusters) {
      const cs = cats.clusters;
      if (cs.studied === 0) recs.push('Start consonant cluster practice (szcz, strz, chrz).');
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
