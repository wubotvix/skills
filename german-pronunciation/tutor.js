// German Pronunciation Tutor -- all data embedded, FSRS-tracked
const core = require('../_lib/core');

const SKILL_NAME = 'german-pronunciation';

// ---------------------------------------------------------------------------
// SOUND DATA by CEFR level
// ---------------------------------------------------------------------------
const SOUNDS = {
  A1: [
    // Vowels
    { id: 'v-long-a', cat: 'vowels', name: 'Long /aː/', ipa: '/aː/', desc: 'Mouth wide open, tongue low. Like English "father" but longer. Spelled: a, aa, ah.', examples: ['Staat','Bahn','Vater','Tag'], minimalPairs: [['Staat','Stadt'],['Bahn','Bann']], commonErrors: ['Too short — German long vowels are truly long'] },
    { id: 'v-short-a', cat: 'vowels', name: 'Short /a/', ipa: '/a/', desc: 'Shorter, more open than long /aː/. Before double consonants.', examples: ['Stadt','Mann','Kamm','Wasser'], minimalPairs: [['Stadt','Staat'],['Kamm','kam']], commonErrors: ['Not distinguishing length from /aː/'] },
    { id: 'v-long-i', cat: 'vowels', name: 'Long /iː/', ipa: '/iː/', desc: 'Lips spread, tongue high front. Like English "see". Spelled: ie, ih, i (open syllable).', examples: ['Biene','ihm','Miete','sieben'], minimalPairs: [['Miete','Mitte'],['bieten','bitten']], commonErrors: ['Too short'] },
    { id: 'v-short-i', cat: 'vowels', name: 'Short /ɪ/', ipa: '/ɪ/', desc: 'Shorter, more lax than /iː/. Like English "bit".', examples: ['Mitte','bitte','Fisch','Tisch'], minimalPairs: [['Mitte','Miete'],['bitten','bieten']], commonErrors: ['Confusing with long /iː/'] },
    { id: 'v-long-u', cat: 'vowels', name: 'Long /uː/', ipa: '/uː/', desc: 'Lips rounded tightly, tongue high back. Like English "moon".', examples: ['Schule','Stuhl','Uhr','gut'], minimalPairs: [['Mus','muss'],['Ruhm','Rum']], commonErrors: ['Not rounding enough'] },
    // Umlauts
    { id: 'v-ue', cat: 'vowels', name: 'Ü /yː/ and /ʏ/', ipa: '/yː/ ~ /ʏ/', desc: 'Say /iː/ with lips rounded like /uː/. Long ü (Tür) vs short ü (Glück). No English equivalent.', examples: ['Tür','fünf','Glück','über'], minimalPairs: [['Mühle','Müll'],['fühlen','füllen']], commonErrors: ['Substituting /uː/ or /iː/ — must combine front tongue + rounded lips'] },
    { id: 'v-oe', cat: 'vowels', name: 'Ö /øː/ and /œ/', ipa: '/øː/ ~ /œ/', desc: 'Say /eː/ with lips rounded like /oː/. Long ö (schön) vs short ö (können). No English equivalent.', examples: ['schön','böse','können','Löffel'], minimalPairs: [['Höhle','Hölle'],['Öfen','öffnen']], commonErrors: ['Substituting /oː/ or /eː/ — must combine mid-front tongue + rounded lips'] },
    // Basic consonants
    { id: 'c-final', cat: 'consonants', name: 'Final devoicing (Auslautverhärtung)', ipa: '/b/→[p], /d/→[t], /ɡ/→[k]', desc: 'Word-final voiced stops become voiceless: "Hund" = [hʊnt], "Tag" = [taːk], "Korb" = [kɔrp]. Compare inflected forms: Hunde [d], Tage [ɡ].', examples: ['Hund [hʊnt]','Tag [taːk]','Rad [raːt]','gelb [ɡɛlp]'], minimalPairs: [['Rad (wheel) [raːt]','Rat (advice) [raːt] — same sound!']], commonErrors: ['Pronouncing final d/g/b as voiced (English habit)'] },
    { id: 'c-h', cat: 'consonants', name: 'Aspirated H and silent H', ipa: '/h/ or (silent)', desc: 'H at syllable start = aspirated [h]. H after vowel = silent length marker: "gehen" = [ˈɡeːən]. "Uhr" = [uːɐ̯].', examples: ['Haus','haben','gehen (silent)','Uhr (silent)'], minimalPairs: [], commonErrors: ['Pronouncing silent h', 'Not aspirating initial h'] },
  ],
  A2: [
    { id: 'c-ch-ich', cat: 'consonants', name: 'Ich-Laut /ç/', ipa: '/ç/', desc: 'Voiceless palatal fricative. After front vowels (i,e,ä,ö,ü), after consonants (l,n,r), in -ig, -lich, -chen. Like a whispered "huge".', examples: ['ich','echt','möchte','wichtig','Mädchen'], minimalPairs: [['Kirche','Kirsche (ch vs sch)']], commonErrors: ['Using /ʃ/ (English "sh")', 'Using /k/', 'Using ach-Laut /x/'] },
    { id: 'c-ch-ach', cat: 'consonants', name: 'Ach-Laut /x/', ipa: '/x/', desc: 'Voiceless velar fricative. After back vowels (a,o,u,au). Like Scottish "loch".', examples: ['ach','Buch','noch','auch','Tochter'], minimalPairs: [['Kuchen (ach)','Küchen (ich)']], commonErrors: ['Using /k/ instead of fricative', 'Confusing with ich-Laut'] },
    { id: 'c-r', cat: 'consonants', name: 'German R /ʁ/', ipa: '/ʁ/ ~ [ɐ]', desc: 'Uvular fricative/approximant at syllable start. Vocalized to [ɐ] after vowels/in unstressed -er. "rot" = [ʁoːt], "Vater" = [ˈfaːtɐ].', examples: ['rot','Bruder','Vater [ˈfaːtɐ]','besser [ˈbɛsɐ]'], minimalPairs: [], commonErrors: ['English retroflex /ɹ/', 'Tapped /r/ (Spanish-style)', 'Not vocalizing in -er'] },
    { id: 'c-glottal', cat: 'consonants', name: 'Glottal stop (Knacklaut)', ipa: '/ʔ/', desc: 'German inserts a glottal stop before vowel-initial words and morphemes: "be|achten" = [bəˈʔaxtən]. Essential for clear German speech.', examples: ['beachten [bəˈʔaxtən]','verarbeiten','Theater','Chaos'], minimalPairs: [['vereisen (ice over)','verreisen (travel) — glottal marks boundary']], commonErrors: ['Linking vowels smoothly (English/French habit)'] },
    { id: 's-basic', cat: 'stress', name: 'Basic German stress', ipa: 'ˈ', desc: 'Native words: first syllable (ˈArbeiten). Foreign words vary (stuˈdieren, Reˈstaurant). Separable prefix stressed (ˈanfangen). Inseparable prefix unstressed (verˈstehen).', examples: ['ˈArbeiten','stuˈdieren','ˈanfangen','verˈstehen'], minimalPairs: [['ˈumfahren (to knock over)','umˈfahren (to drive around)']], commonErrors: ['Stressing wrong syllable in compound verbs'] },
  ],
  B1: [
    { id: 'v-schwa', cat: 'vowels', name: 'Schwa /ə/ and vocalic R /ɐ/', ipa: '/ə/ ~ /ɐ/', desc: 'Unstressed -e = [ə] (Klasse, bitte). Unstressed -er = [ɐ] (Vater, besser). These two sounds are pervasive in German.', examples: ['Klasse [ˈklasə]','Vater [ˈfaːtɐ]','bitte [ˈbɪtə]','besser [ˈbɛsɐ]'], minimalPairs: [['bitte [ə]','bitter [ɐ]']], commonErrors: ['Overpronouncing unstressed syllables'] },
    { id: 'c-pf', cat: 'consonants', name: 'Affricate /pf/', ipa: '/pf/', desc: 'Both sounds together as one affricate. Not just /f/. "Pferd" = [pfɛʁt].', examples: ['Pferd','Apfel','Kopf','Pfeffer'], minimalPairs: [], commonErrors: ['Dropping the /p/ and saying just /f/'] },
    { id: 'c-z', cat: 'consonants', name: 'Z = /ts/', ipa: '/ts/', desc: 'Z is always /ts/ in German, never /z/. Also written tz after short vowels.', examples: ['Zeit','zehn','Katze','Platz'], minimalPairs: [], commonErrors: ['Pronouncing as English /z/', 'Not releasing the /t/'] },
    { id: 'c-sp-st', cat: 'consonants', name: 'SP/ST = /ʃp/ /ʃt/ at syllable start', ipa: '/ʃp/ /ʃt/', desc: 'At the start of a word or syllable: sp = [ʃp], st = [ʃt]. "spielen" = [ˈʃpiːlən], "Straße" = [ˈʃtʁaːsə]. Not in the middle: "Fenster" = [ˈfɛnstɐ].', examples: ['spielen [ˈʃpiːlən]','Straße [ˈʃtʁaːsə]','sprechen','verstehen'], minimalPairs: [], commonErrors: ['Pronouncing as English /sp/ /st/ at word start'] },
    { id: 'cs-compound', cat: 'connected-speech', name: 'Compound word stress', ipa: 'ˈ', desc: 'In compounds, main stress falls on the FIRST element: ˈHandschuh, ˈKrankenhaus, ˈBundesregierung. Secondary stress on later elements.', examples: ['ˈHandschuh','ˈKrankenhaus','ˈBundesregierung','ˈAutobahnausfahrt'], minimalPairs: [], commonErrors: ['Equal stress on all parts', 'Stress on last element'] },
    { id: 'i-statement', cat: 'intonation', name: 'Statement intonation', ipa: '↘', desc: 'Statements fall at the end: "Ich wohne in Berlin." ↘', examples: ['Ich wohne in Berlin.','Er hat zwei Kinder.','Das Wetter ist schön.'], minimalPairs: [], commonErrors: ['Rising at end (English uptalk)'] },
    { id: 'i-ynq', cat: 'intonation', name: 'Yes/No question rise', ipa: '↗', desc: 'Yes/No questions (verb-first) rise at end: "Wohnst du in Berlin?" ↗', examples: ['Wohnst du hier?','Hast du Hunger?','Ist er fertig?'], minimalPairs: [], commonErrors: ['Insufficient rise', 'Falling like a statement'] },
  ],
  B2: [
    { id: 'v-diphthongs', cat: 'vowels', name: 'Diphthongs /aɪ̯/ /aʊ̯/ /ɔʏ̯/', ipa: '/aɪ̯/ /aʊ̯/ /ɔʏ̯/', desc: 'Three diphthongs: ei/ai = [aɪ̯], au = [aʊ̯], eu/äu = [ɔʏ̯]. "Haus" = [haʊ̯s], "Leute" = [ˈlɔʏ̯tə].', examples: ['mein [aɪ̯]','Haus [aʊ̯]','Leute [ɔʏ̯]','Bäume [ɔʏ̯]'], minimalPairs: [['Eis (ice)','aus (out)','Eule (owl)']], commonErrors: ['English diphthong habits', 'Not rounding enough for /ɔʏ̯/'] },
    { id: 'c-ng', cat: 'consonants', name: 'NG /ŋ/ without /ɡ/', ipa: '/ŋ/', desc: 'In -ng, only [ŋ] — NO [ɡ] follows. "singen" = [ˈzɪŋən] not *[ˈzɪŋɡən]. In -nk, [ŋk]: "danke" = [ˈdaŋkə].', examples: ['singen [ˈzɪŋən]','lang [laŋ]','danke [ˈdaŋkə]'], minimalPairs: [], commonErrors: ['Adding [ɡ] after [ŋ] (English "finger" pattern)'] },
    { id: 'i-whq', cat: 'intonation', name: 'W-question fall', ipa: '↘', desc: 'W-questions (wer, was, wo, etc.) fall at end: "Wo wohnst du?" ↘', examples: ['Wo wohnst du?','Was machst du?','Wie heißen Sie?'], minimalPairs: [], commonErrors: ['Rising like a yes/no question'] },
    { id: 'i-list', cat: 'intonation', name: 'List intonation', ipa: '↗...↘', desc: 'Rise on each item, fall on last: "Ich kaufe Brot↗, Milch↗ und Käse↘."', examples: ['Brot, Milch und Käse','Montag, Dienstag und Mittwoch'], minimalPairs: [], commonErrors: ['Falling too early', 'Flat intonation'] },
    { id: 'cs-satzklammer', cat: 'connected-speech', name: 'Sentence bracket rhythm', ipa: '(rhythm)', desc: 'German sentence bracket (Satzklammer) creates a rhythmic pattern: "Ich habe gestern ein Buch geLEsen" — stress flows toward the final verb part.', examples: ['Ich habe...gelesen','Er ist...gefahren','Sie wird...anrufen'], minimalPairs: [], commonErrors: ['Not sustaining rhythm to the end of the sentence bracket'] },
  ],
  C1: [
    { id: 'cs-rhythm', cat: 'connected-speech', name: 'Stress-timed rhythm mastery', ipa: '(rhythm)', desc: 'German is stress-timed: stressed syllables at roughly equal intervals, unstressed syllables compressed. Master reducing unstressed syllables without losing clarity.', examples: ['ˈUni.ver.si.ˈtät','ˈBun.des.re.ˈgie.rung','Ar.ˈbeits.lo.sig.keit'], minimalPairs: [], commonErrors: ['Syllable-timed rhythm (French/Spanish habit)', 'Over-reducing unstressed vowels'] },
    { id: 'c-regional-r', cat: 'consonants', name: 'Regional R variants', ipa: '/ʁ/ /r/ /ɾ/', desc: 'Standard: uvular [ʁ]. Bavaria/Austria: alveolar trill [r] or tap [ɾ]. Swiss German: various. All are acceptable.', examples: ['rot [ʁoːt] / [roːt]','Straße','Brot'], minimalPairs: [], commonErrors: ['Inconsistent R variant'] },
    { id: 'i-emphasis', cat: 'intonation', name: 'Contrastive stress', ipa: '(emphasis)', desc: 'German uses contrastive stress for emphasis/correction: "Ich habe das BUCH gelesen" (not the magazine). Can shift to any element.', examples: ['ICH habe das gesagt','Ich HABE das gesagt','Ich habe DAS gesagt'], minimalPairs: [], commonErrors: ['Not shifting stress clearly enough'] },
  ],
  C2: [
    { id: 'cs-full', cat: 'connected-speech', name: 'Native-like connected speech', ipa: '(flow)', desc: 'Full integration: glottal stops at morpheme boundaries, sentence bracket rhythm, compound stress, reduction patterns, and regional awareness in rapid natural speech.', examples: ['Das hätte ich mir auch denken können.','Er hat sich bei der Bundesagentur für Arbeit beworben.'], minimalPairs: [], commonErrors: ['Losing clarity in rapid speech'] },
    { id: 'c-regional', cat: 'consonants', name: 'Pan-regional awareness', ipa: '(varies)', desc: 'Recognize and optionally produce features from multiple regions: Bavarian/Austrian vocalized L, Swiss German ch-variants, northern German /g/→[j].', examples: ['ich: [ɪç] vs [ɪk] (Berlin)','König: [-ɪç] vs [-ɪk]','nicht: [nɪçt] vs [nɪt] (colloquial)'], minimalPairs: [], commonErrors: ['Inconsistent dialect features'] },
  ],
};

// Tongue twisters by difficulty
const TONGUE_TWISTERS = [
  { id: 'tt-1', level: 'A2', text: 'Fischers Fritz fischt frische Fische, frische Fische fischt Fischers Fritz.', focus: 'Consonant clusters /fr/, /ʃ/', ipa: '/fɪʃɐs frɪts fɪʃt frɪʃə fɪʃə/' },
  { id: 'tt-2', level: 'A2', text: 'Zwischen zwei Zwetschgenzweigen zwitschern zwei Schwalben.', focus: '/ts/ (z), consonant clusters /tsv/', ipa: '/tsvɪʃən tsvaɪ̯ tsvɛtʃɡəntsvaɪ̯ɡən tsvɪtʃɐn tsvaɪ̯ ʃvalbən/' },
  { id: 'tt-3', level: 'B1', text: 'Blaukraut bleibt Blaukraut und Brautkleid bleibt Brautkleid.', focus: 'Consonant clusters /bl/ /br/ /kl/ /kr/', ipa: '/blaʊ̯kraʊ̯t blaɪ̯pt blaʊ̯kraʊ̯t ʊnt braʊ̯tklaɪ̯t blaɪ̯pt braʊ̯tklaɪ̯t/' },
  { id: 'tt-4', level: 'B1', text: 'In Ulm, um Ulm und um Ulm herum.', focus: 'Short /ʊ/ purity, rounded vowels', ipa: '/ɪn ʊlm ʊm ʊlm ʊnt ʊm ʊlm hɛˈʁʊm/' },
  { id: 'tt-5', level: 'B1', text: 'Der Cottbuser Postkutscher putzt den Cottbuser Postkutschkasten.', focus: 'Consonant clusters, compound stress, final devoicing', ipa: '(practice steady compound stress)' },
  { id: 'tt-6', level: 'B2', text: 'Wenn Fliegen hinter Fliegen fliegen, fliegen Fliegen Fliegen nach.', focus: 'Homograph awareness (Fliegen = flies/flying), rhythm', ipa: '(focus on stress and meaning differentiation)' },
  { id: 'tt-7', level: 'B2', text: 'Es klapperten die Klapperschlangen, bis ihre Klappern schlapper klangen.', focus: 'Consonant clusters /kl/ /ʃl/, final devoicing', ipa: '(focus on crisp consonant clusters)' },
  { id: 'tt-8', level: 'C1', text: 'Brautkleid bleibt Brautkleid und Blaukraut bleibt Blaukraut. Ob er aber über Oberammergau oder aber über Unterammergau oder aber überhaupt nicht kommt, ist ungewiss.', focus: 'Compound stress, Ü-sounds, connected speech', ipa: '(focus on smooth connected speech and ü)' },
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
    if (cats.vowels) {
      const emerging = cats.vowels.items.filter(i => i.status === 'emerging' || i.status === 'not-started');
      if (emerging.length) recs.push('Focus on vowel system (umlauts, long/short distinction) -- ' + emerging.length + ' vowel sounds need work.');
    }
    if (next.totalDue > 0) recs.push(next.totalDue + ' sound(s) due for review today.');
    if (next.totalUnstarted > 3) recs.push(next.totalUnstarted + ' sounds not yet started at your level.');
    if (cats['connected-speech']) {
      const cs = cats['connected-speech'];
      if (cs.studied === 0) recs.push('Start connected speech practice (compound stress, Satzklammer rhythm).');
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
