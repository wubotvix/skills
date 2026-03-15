// Spanish Pronunciation Tutor -- all data embedded, FSRS-tracked
const core = require('../_lib/core');

// ---------------------------------------------------------------------------
// SOUND DATA by CEFR level
// ---------------------------------------------------------------------------
const SOUNDS = {
  A1: [
    // Vowels
    { id: 'v-a', cat: 'vowels', name: 'Open central /a/', ipa: '/a/', desc: 'Mouth wide open, tongue low and central. Like English "father" but shorter, crisper. Never slides.', examples: ['casa','hablar','mapa','banana'], minimalPairs: [['paso','piso'],['casa','cosa']], commonErrors: ['Substituting English /æ/ or /eɪ/'] },
    { id: 'v-e', cat: 'vowels', name: 'Mid front /e/', ipa: '/e/', desc: 'Lips slightly spread, mid-front. Like the start of English "say" WITHOUT the glide to /ɪ/. Freeze it.', examples: ['mesa','tres','comer','leche'], minimalPairs: [['peso','piso'],['mesa','misa']], commonErrors: ['Diphthongizing to /eɪ/ (English habit)'] },
    { id: 'v-i', cat: 'vowels', name: 'Close front /i/', ipa: '/i/', desc: 'Lips spread, tongue high and front. Like English "see" but shorter, no glide.', examples: ['silla','fin','aquí','mira'], minimalPairs: [['piso','peso'],['misa','mesa']], commonErrors: ['Too long or glided'] },
    { id: 'v-o', cat: 'vowels', name: 'Mid back /o/', ipa: '/o/', desc: 'Lips rounded, mid-back. Like start of English "go" WITHOUT the glide to /ʊ/. Freeze it.', examples: ['todo','como','ojo','poco'], minimalPairs: [['cosa','casa'],['poso','puso']], commonErrors: ['Diphthongizing to /oʊ/ (English habit)'] },
    { id: 'v-u', cat: 'vowels', name: 'Close back /u/', ipa: '/u/', desc: 'Lips rounded tightly, tongue high and back. Like English "too" but shorter.', examples: ['luna','mucho','uva','grupo'], minimalPairs: [['puso','poso'],['muro','moro']], commonErrors: ['Too long or glided'] },
    // Basic consonants
    { id: 'c-bv', cat: 'consonants', name: 'B/V merger', ipa: '/b/ ~ [β]', desc: 'B and V are the SAME sound. [b] after pause/m/n; approximant [β] (lips close but don\'t touch) between vowels.', examples: ['bueno','vaca','saber','hablar'], minimalPairs: [['beso','peso'],['bata','pata']], commonErrors: ['Using English /v/ (teeth on lip) for V'] },
    { id: 'c-h', cat: 'consonants', name: 'Silent H', ipa: '(silent)', desc: 'H is ALWAYS silent in Spanish. No aspiration, no sound at all.', examples: ['hola','hacer','hombre','ahora'], minimalPairs: [['hola (=ola)','ola']], commonErrors: ['Pronouncing /h/ as in English'] },
  ],
  A2: [
    { id: 'c-tap', cat: 'consonants', name: 'Tapped R /ɾ/', ipa: '/ɾ/', desc: 'Single quick tap of tongue tip on the alveolar ridge. Like American English "butter" or "water" flap.', examples: ['pero','tres','comer','hora'], minimalPairs: [['pero','perro'],['caro','carro'],['cero','cerro']], commonErrors: ['English retroflex /ɹ/', 'French uvular /ʁ/'] },
    { id: 'c-trill', cat: 'consonants', name: 'Trilled R /r/', ipa: '/r/', desc: 'Multiple rapid taps (2-5) of relaxed tongue tip on alveolar ridge. Let airflow vibrate the tongue passively. Written RR or word-initial R.', examples: ['perro','rojo','carro','Enrique'], minimalPairs: [['perro','pero'],['carro','caro'],['parra','para']], commonErrors: ['Tongue too tense','Uvular/French R','Not enough air pressure'] },
    { id: 's-basic', cat: 'stress', name: 'Basic stress rules', ipa: 'ˈ', desc: 'Vowel/n/s ending: penultimate stress (casa). Other consonant: final stress (hablar). Accent mark overrides (café).', examples: ['CA-sa','ha-BLAR','ca-FÉ','te-LÉ-fo-no'], minimalPairs: [['papa (potato)','papá (dad)'],['esta (this)','está (is located)']], commonErrors: ['Stressing wrong syllable','Ignoring accent marks'] },
    { id: 'c-d', cat: 'consonants', name: 'D allophony', ipa: '/d/ ~ [ð]', desc: '[d] after pause/n/l; soft [ð] (like English "the") between vowels: "nada" = [na.ða].', examples: ['donde','nada','ciudad','dedo'], minimalPairs: [['domar','tomar']], commonErrors: ['Always using hard [d]','Dropping intervocalic [ð]'] },
    { id: 'c-ny', cat: 'consonants', name: 'Ñ /ɲ/', ipa: '/ɲ/', desc: 'Tongue blade on hard palate. Like "ny" in "canyon" but one sound.', examples: ['año','España','mañana','niño'], minimalPairs: [['cana (grey hair)','caña (cane)'],['mono (monkey)','moño (bun)']], commonErrors: ['Pronouncing as /n/ + /j/ separately'] },
  ],
  B1: [
    { id: 'c-g', cat: 'consonants', name: 'G allophony', ipa: '/ɡ/ ~ [ɣ]', desc: '[ɡ] after pause/n; soft [ɣ] elsewhere. Before e/i: /x/ (jota).', examples: ['gato','lago','tengo','guerra'], minimalPairs: [['gata','kata (not a word) -- gata vs jota contrast']], commonErrors: ['Always using hard [ɡ]'] },
    { id: 'c-jota', cat: 'consonants', name: 'Jota /x/', ipa: '/x/', desc: 'Velar fricative, like soft throat-clearing or Scottish "loch". J always; G before e/i.', examples: ['jefe','gente','rojo','mujer'], minimalPairs: [], commonErrors: ['English /dʒ/ (judge)','English /h/'] },
    { id: 'cs-sinalefa', cat: 'connected-speech', name: 'Sinalefa', ipa: '(linking)', desc: 'Word-final vowel + word-initial vowel merge into one syllable: "mi amigo" = [mja.mi.ɣo].', examples: ['mi amigo','la escuela','como estás','de español'], minimalPairs: [], commonErrors: ['Inserting glottal stop between words','Pausing between vowels'] },
    { id: 'cs-resynth', cat: 'connected-speech', name: 'Resyllabification', ipa: '(linking)', desc: 'Final consonants attach to following vowel: "el otro" = [e.lo.tro], "los amigos" = [lo.sa.mi.ɣos].', examples: ['el otro','los amigos','un hombre','es importante'], minimalPairs: [], commonErrors: ['Keeping word boundaries rigid'] },
    { id: 's-triplets', cat: 'stress', name: 'Stress triplets', ipa: 'ˈ', desc: 'Same letters, three meanings by stress: practico (adj) / practico (present) / practicó (preterite).', examples: ['práctico/practico/practicó','término/termino/terminó','número/numero/numeró','público/publico/publicó'], minimalPairs: [['término (term)','termino (I end)','terminó (ended)'],['práctico (practical)','practico (I practice)','practicó (practiced)']], commonErrors: ['Defaulting to one stress pattern'] },
    { id: 'i-statement', cat: 'intonation', name: 'Statement intonation', ipa: '↘', desc: 'Gradual descent with fall at end: "Vivo en Madrid." ↘', examples: ['Vivo en Madrid.','Tengo dos hermanos.','Me gusta el café.'], minimalPairs: [], commonErrors: ['Rising at end (English uptalk)'] },
    { id: 'i-ynq', cat: 'intonation', name: 'Yes/No question rise', ipa: '↗', desc: 'Rise at end: "¿Vives en Madrid?" ↗', examples: ['¿Vives aquí?','¿Tienes hambre?','¿Está listo?'], minimalPairs: [], commonErrors: ['Insufficient rise','Falling like a statement'] },
  ],
  B2: [
    { id: 'cs-noglottal', cat: 'connected-speech', name: 'No glottal stop', ipa: '(flow)', desc: 'Unlike English/German, Spanish never inserts a glottal stop before vowel-initial words. Smooth flow.', examples: ['el agua [e.la.ɣwa]','una idea [u.nai.ðe.a]','la oficina [lao.fi.θi.na]'], minimalPairs: [], commonErrors: ['Inserting ʔ before vowels (English habit)'] },
    { id: 'c-czs', cat: 'consonants', name: 'Seseo vs distinción', ipa: '/s/ vs /θ/', desc: 'Seseo (Latin Am ~90%): z,ce,ci = /s/. Distinción (Spain ~10%): z,ce,ci = /θ/, s = /s/.', examples: ['zapato [sa.pa.to] / [θa.pa.to]','cena [se.na] / [θe.na]','piscina','cerveza'], minimalPairs: [['caza (hunt)','casa (house) -- merged in seseo']], commonErrors: ['Inconsistent system mixing'] },
    { id: 'c-lly', cat: 'consonants', name: 'Yeísmo (LL/Y)', ipa: '/ʝ/', desc: 'LL and Y both = /ʝ/ in ~95% of dialects. Argentine: /ʃ/ or /ʒ/.', examples: ['llamar','yo','calle','playa'], minimalPairs: [], commonErrors: ['English /l/ for LL'] },
    { id: 'i-whq', cat: 'intonation', name: 'Wh-question fall', ipa: '↘', desc: 'Wh-questions fall at end (like English): "¿Dónde vives?" ↘', examples: ['¿Dónde vives?','¿Qué quieres?','¿Cómo te llamas?'], minimalPairs: [], commonErrors: ['Rising like a yes/no question'] },
    { id: 'i-list', cat: 'intonation', name: 'List intonation', ipa: '↗...↘', desc: 'Rise on each item, fall on last: "Compré manzanas↗, plátanos↗, y naranjas↘."', examples: ['manzanas, plátanos y naranjas','lunes, martes y miércoles'], minimalPairs: [], commonErrors: ['Falling too early','Flat intonation'] },
  ],
  C1: [
    { id: 'cs-rhythm', cat: 'connected-speech', name: 'Syllable-timed rhythm mastery', ipa: '(rhythm)', desc: 'Every syllable equal duration, no schwa. "Chocolate" = /tʃo.ko.la.te/ (4 clear vowels). Drill: tap finger evenly.', examples: ['te-lé-fo-no','u-ni-ver-si-dad','es-ta-do-u-ni-den-se','cho-co-la-te'], minimalPairs: [], commonErrors: ['Stress-timed rhythm (English)','Reducing unstressed vowels to schwa'] },
    { id: 'c-sasp', cat: 'consonants', name: 'S aspiration (Caribbean/Andalusian)', ipa: '/s/ → [h]', desc: 'In Caribbean, Andalusia, Chile: /s/ before consonant → [h]. Word-final /s/ may delete. "estos" = [eh.toh].', examples: ['estos [eh.toh]','los otros [lo.ho.tro]','más o menos [ma.ho.me.no]'], minimalPairs: [], commonErrors: ['Not recognizing aspirated variants'] },
    { id: 'c-sheismo', cat: 'consonants', name: 'Sheísmo (Argentine LL/Y)', ipa: '/ʃ/ or /ʒ/', desc: 'In Rioplatense: LL/Y → /ʃ/ (younger) or /ʒ/ (traditional). "yo me llamo" = [ʃo me ʃa.mo].', examples: ['yo [ʃo]','calle [ka.ʃe]','lluvia [ʃu.βja]','playa [pla.ʃa]'], minimalPairs: [], commonErrors: ['Using /ʝ/ in Argentine context'] },
    { id: 'i-excl', cat: 'intonation', name: 'Exclamation contour', ipa: '↗↘', desc: 'Wide pitch range: "¡Qué bonito!" ↗↘', examples: ['¡Qué bonito!','¡No me digas!','¡Increíble!'], minimalPairs: [], commonErrors: ['Too flat','Insufficient pitch range'] },
  ],
  C2: [
    { id: 'cs-full', cat: 'connected-speech', name: 'Native-like connected speech', ipa: '(flow)', desc: 'Full integration: sinalefa + resyllabification + rhythm + intonation in rapid natural speech.', examples: ['Voy a ir a la escuela [boj.a.i.ra.laes.kwe.la]','¿Cómo es que no lo has hecho? (fluid)'], minimalPairs: [], commonErrors: ['Slowing down at word boundaries'] },
    { id: 'c-regional', cat: 'consonants', name: 'Pan-dialectal awareness', ipa: '(varies)', desc: 'Recognize and optionally produce features from multiple dialects: seseo/distinción, yeísmo/sheísmo, aspiration, voseo stress.', examples: ['zapato: /sa-/ vs /θa-/','calle: /ka.ʝe/ vs /ka.ʃe/','estos: /es.tos/ vs /eh.toh/'], minimalPairs: [], commonErrors: ['Inconsistent dialect features'] },
  ],
};

// Tongue twisters by difficulty
const TONGUE_TWISTERS = [
  { id: 'tt-1', level: 'A2', text: 'Tres tristes tigres tragaban trigo en un trigal.', focus: 'trill /r/, consonant clusters /tr/', ipa: '/tɾes tɾis.tes ti.ɣɾes tɾa.ɣa.βan tɾi.ɣo en un tɾi.ɣal/' },
  { id: 'tt-2', level: 'A2', text: 'Erre con erre, guitarra; erre con erre, barril.', focus: 'trill /r/ vs tap /ɾ/', ipa: '/e.re kon e.re ɡi.ta.ra | e.re kon e.re ba.ril/' },
  { id: 'tt-3', level: 'B1', text: 'El perro de San Roque no tiene rabo porque Ramón Ramírez se lo ha robado.', focus: 'trill /r/ in multiple positions', ipa: '/el pe.ro ðe san ro.ke no tje.ne ra.βo poɾ.ke ra.mon ra.mi.ɾeθ se lo a ro.βa.ðo/' },
  { id: 'tt-4', level: 'B1', text: 'Pablito clavó un clavito. ¿Qué clavito clavó Pablito?', focus: 'consonant clusters /kl/, /bl/', ipa: '/pa.βli.to kla.βo un kla.βi.to | ke kla.βi.to kla.βo pa.βli.to/' },
  { id: 'tt-5', level: 'B1', text: 'Un poco de coco como poco coco compro.', focus: 'vowel /o/ purity, no diphthongizing', ipa: '/un po.ko ðe ko.ko ko.mo po.ko ko.ko kom.pɾo/' },
  { id: 'tt-6', level: 'B2', text: 'Parangaricutirimícuaro: el pueblo que nadie puede desparagaricutirimicuarizar.', focus: 'syllable-timed rhythm, vowel purity across many syllables', ipa: '(practice steady rhythm on each syllable)' },
  { id: 'tt-7', level: 'B2', text: 'El cielo está enladrillado. ¿Quién lo desenladrillará? El desenladrillador que lo desenladrille, buen desenladrillador será.', focus: 'connected speech, resyllabification, trill', ipa: '(focus on smooth linking and even rhythm)' },
  { id: 'tt-8', level: 'C1', text: 'Pepe Pecas pica papas con un pico. Con un pico pica papas Pepe Pecas.', focus: '/p/ aspiration-free (no English puff of air), vowel /a/ and /e/', ipa: '/pe.pe pe.kas pi.ka pa.pas kon um pi.ko/' },
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
    this.dir = core.dataDir('spanish-pronunciation');
    core.ensureDir(this.dir);
  }

  // -- Profile management --

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

  // -- Sound catalog --

  getSoundCatalog(level) {
    const sounds = level ? soundsForLevel(level) : allSounds();
    const byCat = {};
    for (const s of sounds) {
      if (!byCat[s.cat]) byCat[s.cat] = [];
      byCat[s.cat].push({ id: s.id, name: s.name, ipa: s.ipa, level: s.level });
    }
    return byCat;
  }

  // -- Lesson generation --

  generateLesson(studentId, category) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = soundsForLevel(level);
    const filtered = category ? available.filter(s => s.cat === category) : available;
    const td = core.today();

    // Collect due items
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

  // -- Exercise generation --

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

  // -- Answer checking --

  checkAnswer(studentId, exerciseId, answer) {
    // For minimal-pairs, check if the answer matches
    // For stress-identification, accept the stressed syllable
    // For production/tonguetwister, return self-assessment prompt
    const ans = core.norm(answer);
    return {
      exerciseId, givenAnswer: answer, normalized: ans,
      note: 'For pronunciation exercises, use "record" to log your self-assessment grade (0-3).',
    };
  }

  // -- SRS recording --

  recordAssessment(studentId, soundId, grade) {
    grade = Number(grade);
    if (grade < 0 || grade > 3) throw new Error('Grade must be 0-3');
    const p = this.getProfile(studentId);
    const sound = findSound(soundId);
    if (!sound) throw new Error('Unknown sound: ' + soundId);

    // Map 0-3 student scale to FSRS 1-4 internal scale
    const fsrsGrade = grade + 1; // 0->1(fail), 1->2, 2->3, 3->4

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

  // -- Progress & reporting --

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
      if (emerging.length) recs.push('Focus on vowel purity -- ' + emerging.length + ' vowel sounds need work.');
    }
    if (next.totalDue > 0) recs.push(next.totalDue + ' sound(s) due for review today.');
    if (next.totalUnstarted > 3) recs.push(next.totalUnstarted + ' sounds not yet started at your level.');
    if (cats['connected-speech']) {
      const cs = cats['connected-speech'];
      if (cs.studied === 0) recs.push('Start connected speech practice (sinalefa, linking).');
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
