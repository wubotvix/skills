// Russian Pronunciation Tutor -- all data embedded, FSRS-tracked
const core = require('../_lib/core');

const SKILL_NAME = 'russian-pronunciation';

// ---------------------------------------------------------------------------
// SOUND DATA by CEFR level
// ---------------------------------------------------------------------------
const SOUNDS = {
  A1: [
    // Vowels
    { id: 'v-a', cat: 'vowels', name: 'Open central /a/', ipa: '/a/', desc: 'Mouth wide open, tongue low. Like English "father" but shorter. Stressed а is always [a].', examples: ['ма́ма','ка́ша','да','стака́н'], minimalPairs: [['мат (checkmate)','мять (to crumple)']], commonErrors: ['Not reducing unstressed а'] },
    { id: 'v-o', cat: 'vowels', name: 'Mid back /o/', ipa: '/o/', desc: 'Lips rounded, mid-back. Only in STRESSED position. Unstressed о reduces to [ɐ] or [ə].', examples: ['дом','окно́','мо́ре','хорошо́'], minimalPairs: [['дом (house)','дым (smoke)']], commonErrors: ['Pronouncing unstressed о as [o] instead of [ɐ]'] },
    { id: 'v-u', cat: 'vowels', name: 'Close back /u/', ipa: '/u/', desc: 'Lips rounded tightly, tongue high and back. Does NOT reduce significantly in unstressed position.', examples: ['у́тро','лу́на','ру́сский','ту́т'], minimalPairs: [['лук (onion)','люк (hatch)']], commonErrors: ['Diphthongizing like English "oo"'] },
    { id: 'v-i', cat: 'vowels', name: 'Close front /i/', ipa: '/i/', desc: 'Lips spread, tongue high and front. Written as и after soft consonants. SOFTENS the preceding consonant.', examples: ['и́мя','кни́га','ми́р','пи́сьмо'], minimalPairs: [['мир (peace/world)','мыр (not a word — compare ы)']], commonErrors: ['Not softening consonant before и'] },
    { id: 'v-y', cat: 'vowels', name: 'Close central /ɨ/ (ы)', ipa: '/ɨ/', desc: 'Retract tongue from "ee" position. Keep lips UNROUNDED. Between "ee" and "uh". English has NO equivalent. Practice: say "ee" while pulling tongue back.', examples: ['мы','ты','вы','сын','ры́ба'], minimalPairs: [['мил (dear)','мыл (washed)'],['бить (to beat)','быть (to be)']], commonErrors: ['Substituting /i/ for /ɨ/','Rounding the lips'] },
    { id: 'v-e', cat: 'vowels', name: 'Mid front /e/', ipa: '/e/', desc: 'Like English "bed" but purer. Written as э alone or е after soft consonants. Unstressed е reduces to [ɪ].', examples: ['э́то','де́ло','сем','мéсто'], minimalPairs: [['мел (chalk)','мель (sandbar)']], commonErrors: ['Diphthongizing to /eɪ/'] },
    // Basic consonants
    { id: 'c-hard-soft-intro', cat: 'consonants', name: 'Hard/Soft consonant intro', ipa: '/C/ vs /Cʲ/', desc: 'Most Russian consonants come in hard/soft pairs. Soft = raise middle of tongue toward palate, like adding a tiny "y" glide. E.g., т [t] vs ть [tʲ].', examples: ['мат/мать','брат/брать','кон/конь','угол/уголь'], minimalPairs: [['мат (checkmate)','мать (mother)'],['брат (brother)','брать (to take)']], commonErrors: ['Not hearing the hard/soft distinction'] },
  ],
  A2: [
    { id: 'c-r', cat: 'consonants', name: 'Alveolar trill /r/', ipa: '/r/', desc: 'Tongue tip trills against the ridge behind upper teeth. NOT the English "r". Like Spanish/Italian rolled r. Let airflow vibrate a relaxed tongue tip.', examples: ['рабо́та','ру́сский','три','до́рога'], minimalPairs: [['рот (mouth)','лот (lot)']], commonErrors: ['English retroflex /ɹ/','French uvular /ʁ/','Tongue too tense'] },
    { id: 'c-kh', cat: 'consonants', name: 'Voiceless velar fricative /x/ (х)', ipa: '/x/', desc: 'Like Scottish "loch" or German "Bach". Strong breathy sound from back of throat. NOT English "h".', examples: ['хорошо́','хлеб','плóхо','у́хо'], minimalPairs: [], commonErrors: ['Using English /h/ instead of /x/'] },
    { id: 'c-shch', cat: 'consonants', name: 'Long soft sh /ɕː/ (щ)', ipa: '/ɕː/', desc: 'A prolonged, soft "sh" with tongue raised high. Longer and softer than ш. Like saying "shsh" with tongue forward.', examples: ['щи','борщ','ещё','пло́щадь'], minimalPairs: [['шит (sewn)','щит (shield)']], commonErrors: ['Pronouncing like English "sh"','Too short'] },
    { id: 's-stress', cat: 'stress', name: 'Russian word stress', ipa: 'ˈ', desc: 'Russian stress is FREE and MOBILE — can fall on any syllable and shift between forms. Misplaced stress changes meaning. No reliable rules — each word must be memorized.', examples: ['зА́мок (castle)','замО́К (lock)','мУ́ка (torment)','мукА́ (flour)'], minimalPairs: [['зА́мок (castle)','замО́К (lock)'],['мУ́ка (torment)','мукА́ (flour)'],['О́рган (body organ)','оргА́н (musical organ)']], commonErrors: ['Stressing wrong syllable','Not checking dictionary for stress'] },
    { id: 'c-ts', cat: 'consonants', name: 'Voiceless affricate /ts/ (ц)', ipa: '/ts/', desc: 'Always hard. Like "ts" in "cats" but as one sound. Never soft.', examples: ['цена́','ули́ца','пти́ца','оте́ц'], minimalPairs: [], commonErrors: ['Softening ц (it is always hard)'] },
  ],
  B1: [
    { id: 'cs-vowel-reduction', cat: 'connected-speech', name: 'Vowel reduction (аканье)', ipa: '[ɐ]/[ə]', desc: 'THE defining feature of Russian pronunciation. Unstressed о and а merge: 1st pretonic → [ɐ], other positions → [ə]. молоко́ = [məlɐˈko].', examples: ['молоко́ [məlɐˈko]','хорошо́ [xərɐˈʂo]','Москва́ [mɐˈskva]','говори́ть [gəvɐˈrʲitʲ]'], minimalPairs: [], commonErrors: ['Pronouncing all о as [o]','Not reducing unstressed vowels'] },
    { id: 'cs-ikanye', cat: 'connected-speech', name: 'Vowel reduction after soft C (иканье)', ipa: '[ɪ]', desc: 'After soft consonants, unstressed е and я reduce to [ɪ]. язы́к = [jɪˈzɨk], пятна́дцать = [pɪtˈnatsːətʲ].', examples: ['язы́к [jɪˈzɨk]','пятна́дцать','весна́ [vʲɪsˈna]'], minimalPairs: [], commonErrors: ['Pronouncing unstressed е as full [e]'] },
    { id: 'cs-final-devoicing', cat: 'connected-speech', name: 'Final devoicing', ipa: '(devoicing)', desc: 'Voiced consonants become voiceless at word end: хлеб [xlʲep], город [ˈɡorət], друг [druk], нож [noʂ].', examples: ['хлеб [xlʲep]','го́род [ˈɡorət]','друг [druk]','глаз [ɡlas]'], minimalPairs: [], commonErrors: ['Pronouncing final voiced consonants as voiced'] },
    { id: 'i-ik1', cat: 'intonation', name: 'IK-1: Neutral statement', ipa: '↘', desc: 'Pitch drops on stressed syllable of focus word and stays low. "Он студе́нт. ↘"', examples: ['Он студе́нт.','Э́то мой дом.','Сего́дня хо́лодно.'], minimalPairs: [], commonErrors: ['Rising at end (English uptalk)'] },
    { id: 'i-ik3', cat: 'intonation', name: 'IK-3: Yes/No question', ipa: '↗', desc: 'Pitch rises SHARPLY on stressed syllable of key word, then drops. This is the ONLY way to mark a yes/no question — no word order change! "Он студе́нт? ↗"', examples: ['Он студе́нт?','Вы говори́те по-ру́сски?','Э́то Москва́?'], minimalPairs: [['Э́то А́нна. ↘ (statement)','Э́то А́нна? ↗ (question)']], commonErrors: ['Insufficient rise','Not placing rise on the right word'] },
  ],
  B2: [
    { id: 'cs-voicing-assim', cat: 'connected-speech', name: 'Voicing assimilation', ipa: '(assimilation)', desc: 'Consonants assimilate in voicing to the following consonant: сде́лать [ˈzdʲelatʲ], во́дка [ˈvotkə]. Exception: в does NOT trigger assimilation.', examples: ['сде́лать [ˈzdʲelatʲ]','во́дка [ˈvotkə]','с бра́том [zˈbratəm]','в шко́лу [fʂˈkolu]'], minimalPairs: [], commonErrors: ['Not assimilating voicing','Assimilating after в'] },
    { id: 'cs-preposition-merge', cat: 'connected-speech', name: 'Preposition merging', ipa: '(linking)', desc: 'Prepositions merge phonetically with following word: в шко́лу [fʂˈkolu], к до́му [ɡˈdomu], из го́рода [ɪzˈɡorədə].', examples: ['в шко́лу [fʂˈkolu]','к до́му [ɡˈdomu]','с бра́том [zˈbratəm]'], minimalPairs: [], commonErrors: ['Pausing between preposition and noun'] },
    { id: 'i-ik2', cat: 'intonation', name: 'IK-2: Wh-question / command', ipa: '↘↘', desc: 'Stronger drop than IK-1. Used for wh-questions and commands. "Что вы де́лаете? ↘↘"', examples: ['Что вы де́лаете?','Когда́ он придёт?','Закро́йте дверь!'], minimalPairs: [], commonErrors: ['Rising like a yes/no question'] },
    { id: 'i-ik4', cat: 'intonation', name: 'IK-4: "And what about...?"', ipa: '↗↘', desc: 'Rise then drop. Used for "and you?" follow-ups, surprise, rhetorical questions. "А вы? ↗↘"', examples: ['А вы?','А почему́?','А она́?'], minimalPairs: [], commonErrors: ['Confusing with IK-3'] },
    { id: 'c-l-dark-light', cat: 'consonants', name: 'Dark л vs light ль', ipa: '/l/ vs /lʲ/', desc: 'Russian hard л is MUCH darker than English "l" — tongue pulled back. Russian soft ль is lighter — tongue tip on teeth, middle rises to palate.', examples: ['лук [luk] (onion)','люк [lʲuk] (hatch)','мал [mal]','маль [malʲ]'], minimalPairs: [['лук (onion)','люк (hatch)'],['мел (chalk)','мель (sandbar)']], commonErrors: ['Using English "l" for both'] },
  ],
  C1: [
    { id: 'cs-cluster-simplif', cat: 'connected-speech', name: 'Consonant cluster simplification', ipa: '(simplification)', desc: 'Complex clusters simplify in speech: здра́вствуйте → [ˈzdrasʲtʲɪ], со́лнце → [ˈsontsə] (silent л), се́рдце → [ˈsʲertsə] (silent д).', examples: ['здра́вствуйте [ˈzdrasʲtʲɪ]','со́лнце [ˈsontsə]','чу́вство [ˈtɕustvə]','ле́стница [ˈlʲesʲnʲɪtsə]'], minimalPairs: [], commonErrors: ['Pronouncing all written consonants'] },
    { id: 'i-ik5', cat: 'intonation', name: 'IK-5: Exclamation', ipa: '↗—↗', desc: 'Two rises. Used for admiration and exclamation. "Кака́я красота́! ↗—↗"', examples: ['Кака́я красота́!','Как хорошо́!','Ско́лько снега!'], minimalPairs: [], commonErrors: ['Insufficient pitch range'] },
    { id: 'cs-yo-omission', cat: 'connected-speech', name: 'Ё recognition (missing dots)', ipa: '/jo/', desc: 'ё is almost always printed as е. Learners must memorize which words have ё: все [fsʲe] (all) vs всё [fsʲo] (everything), берёза (birch) printed as "береза".', examples: ['всё [fsʲo] vs все [fsʲe]','берёза [bʲɪˈrʲozə]','ёлка [ˈjolkə]'], minimalPairs: [['все (all/everyone)','всё (everything)']], commonErrors: ['Reading ё as е'] },
  ],
  C2: [
    { id: 'cs-native-flow', cat: 'connected-speech', name: 'Native-like connected speech', ipa: '(flow)', desc: 'Full integration: vowel reduction + voicing assimilation + cluster simplification + intonation in rapid natural speech. Colloquial reductions: сейча́с → щас, вообще́ → ваще́.', examples: ['сейча́с → щас','вообще́ → ваще́','говорю́ → грю','здра́вствуйте → здра́сте'], minimalPairs: [], commonErrors: ['Slowing down at word boundaries','Not recognizing colloquial forms'] },
    { id: 'c-regional', cat: 'consonants', name: 'Regional pronunciation awareness', ipa: '(varies)', desc: 'Recognize features: Moscow аканье vs Saint Petersburg eканье (pronouncing unstressed е closer to [e]), southern г as [ɣ] (Ukrainian influence), Siberian dialect features.', examples: ['хорошо́: Moscow [xərɐˈʂo] vs SPb more [o]','что: standard [ʂto] vs dialectal [tɕto]'], minimalPairs: [], commonErrors: ['Mixing regional features inconsistently'] },
  ],
};

// Tongue twisters
const TONGUE_TWISTERS = [
  { id: 'tt-1', level: 'A2', text: 'Шла Са́ша по шоссе́ и соса́ла су́шку.', focus: 'ш vs с (hard sibilants)', ipa: '[ʂla ˈsaʂə pə ʂɐˈsːe ɪ sɐˈsalə ˈsuʂku]' },
  { id: 'tt-2', level: 'A2', text: 'Ка́рл у Кла́ры укра́л кора́ллы.', focus: 'р (trill), consonant clusters', ipa: '[karl u ˈklarɨ uˈkral kɐˈralːɨ]' },
  { id: 'tt-3', level: 'B1', text: 'На дворе́ трава́, на траве́ дрова́.', focus: 'р in clusters тр/др, vowel reduction', ipa: '[nə dvɐˈrʲe trɐˈva nə trɐˈvʲe drɐˈva]' },
  { id: 'tt-4', level: 'B1', text: 'Три́дцать три кора́бля лави́ровали, лави́ровали, да не вы́лавировали.', focus: 'р trill, л vs ль, complex clusters', ipa: '(focus on steady rhythm and clear р)' },
  { id: 'tt-5', level: 'B2', text: 'Была́ у Фро́ла, Фро́лу на Ла́вра навра́ла, пойду́ к Ла́вру — на Фро́ла Ла́вру навру́.', focus: 'р/л alternation, vowel reduction', ipa: '(focus on clean р vs л distinction)' },
  { id: 'tt-6', level: 'B2', text: 'Шесть мыше́й в камыша́х шурша́т.', focus: 'ш, щ sibilants, palatalization', ipa: '[ʂesʲtʲ mɨˈʂej f kəmɨˈʂax ʂurˈʂat]' },
  { id: 'tt-7', level: 'C1', text: 'В четве́рг четвёртого числа́ в четы́ре с четве́ртью часа́ четы́ре чёрненьких чума́зеньких чертёнка черти́ли чёрными черни́лами чертёж.', focus: 'ч (soft affricate), vowel reduction, speed', ipa: '(focus on maintaining soft ч throughout)' },
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
      if (emerging.length) recs.push('Focus on vowel sounds (especially ы) -- ' + emerging.length + ' vowel sounds need work.');
    }
    if (next.totalDue > 0) recs.push(next.totalDue + ' sound(s) due for review today.');
    if (next.totalUnstarted > 3) recs.push(next.totalUnstarted + ' sounds not yet started at your level.');
    if (cats['connected-speech']) {
      const cs = cats['connected-speech'];
      if (cs.studied === 0) recs.push('Start connected speech practice (vowel reduction, final devoicing).');
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
