#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'polish-listening';

// ---------------------------------------------------------------------------
// Embedded exercise data by CEFR level
// ---------------------------------------------------------------------------

const EXERCISES = {
  A1: [
    { id: 'a1-dict-kawiarnia', title: 'W kawiarni', type: 'dictation',
      transcript: 'Dzień dobry. Poproszę kawę z mlekiem i szarlotkę.',
      questions: [{ question: 'Write the full sentence you heard.', answer: 'Dzień dobry. Poproszę kawę z mlekiem i szarlotkę.', explanation: 'Note diacriticals: ó in "Poproszę" is ę. "szarlotka" takes accusative: szarlotkę.' }],
      vocabulary: ['poproszę', 'kawa z mlekiem', 'szarlotka'], connectedSpeechFeatures: [] },
    { id: 'a1-dict-przedstawienie', title: 'Przedstawienie się', type: 'dictation',
      transcript: 'Mam na imię Ania i mam dwadzieścia pięć lat. Jestem z Krakowa.',
      questions: [{ question: 'Write the full sentence you heard.', answer: 'Mam na imię Ania i mam dwadzieścia pięć lat. Jestem z Krakowa.', explanation: 'Note: dwadzieścia (ś), Krakowa (genitive after z).' }],
      vocabulary: ['mieć na imię', 'mieć lat', 'być z + genitive'], connectedSpeechFeatures: [] },
    { id: 'a1-sib-kasa-kasza', title: 'Kasa vs kasza', type: 'minimal-pairs',
      transcript: 'Proszę podać mi ___.',
      questions: [{ question: 'Which word fits in a restaurant: "kaszę" or "kasę"?', answer: 'kaszę', explanation: 'In a restaurant you order kasza (groats) → kaszę (accusative). Kasa = cash register.' }],
      vocabulary: ['kasza', 'kasa', 'podać'], connectedSpeechFeatures: ['s vs sz sibilant contrast'] },
    { id: 'a1-comp-sklep', title: 'W sklepie', type: 'comprehension',
      transcript: 'SPRZEDAWCA: Dzień dobry! Co podać?\nKLIENT: Poproszę pół kilo jabłek i litr mleka.\nSPRZEDAWCA: Coś jeszcze?\nKLIENT: Nie, dziękuję. Ile płacę?\nSPRZEDAWCA: Osiem złotych pięćdziesiąt groszy.\nKLIENT: Proszę. Dziękuję bardzo.\nSPRZEDAWCA: Dziękuję, do widzenia!',
      questions: [
        { question: 'What does the customer buy?', answer: 'pół kilo jabłek i litr mleka', explanation: 'Half a kilo of apples and a liter of milk.' },
        { question: 'How much does it cost?', answer: 'osiem złotych pięćdziesiąt groszy', explanation: '8.50 PLN.' },
      ],
      vocabulary: ['pół kilo', 'jabłko → jabłek (gen.pl.)', 'złoty', 'grosz'], connectedSpeechFeatures: [] },
  ],
  A2: [
    { id: 'a2-dict-weekend', title: 'Plany na weekend', type: 'dictation',
      transcript: 'W sobotę chciałabym pojechać nad morze, ale nie wiem, jaka będzie pogoda.',
      questions: [{ question: 'Write the full sentence.', answer: 'W sobotę chciałabym pojechać nad morze, ale nie wiem, jaka będzie pogoda.', explanation: 'Note conditional: chciałabym (feminine). Nad morze = to the sea (accusative for direction).' }],
      vocabulary: ['chciałabym', 'nad morze', 'pogoda'], connectedSpeechFeatures: ['conditional mood form'] },
    { id: 'a2-aspect-disc', title: 'Aspect discrimination', type: 'minimal-pairs',
      transcript: 'Ania ___ list przez dwie godziny.',
      questions: [{ question: 'Was she (a) writing the letter (process) or (b) she finished writing?', answer: 'a', explanation: '"przez dwie godziny" (for two hours) → imperfective: pisała (process/duration).' }],
      vocabulary: ['pisać (impf.)', 'napisać (perf.)', 'przez + acc.'], connectedSpeechFeatures: ['aspect recognition'] },
    { id: 'a2-comp-lekarz', title: 'U lekarza', type: 'comprehension',
      transcript: 'LEKARZ: Dzień dobry. Co Panu dolega?\nPACJENT: Dzień dobry. Od wczoraj boli mnie gardło i mam katar.\nLEKARZ: Proszę otworzyć usta. Hmm, gardło jest zaczerwienione. Ma Pan gorączkę?\nPACJENT: Tak, trzydzieści osiem stopni.\nLEKARZ: To przeziębienie. Przepiszę Panu leki. Proszę dużo pić i odpoczywać.\nPACJENT: Dziękuję, Panie Doktorze.',
      questions: [
        { question: 'What are the symptoms?', answer: 'ból gardła i katar', explanation: 'Sore throat and runny nose.' },
        { question: 'What temperature does the patient have?', answer: 'trzydzieści osiem stopni', explanation: '38 degrees.' },
        { question: 'What is the diagnosis?', answer: 'przeziębienie', explanation: 'A cold.' },
      ],
      vocabulary: ['dolegać', 'gardło', 'katar', 'gorączka', 'przeziębienie'], connectedSpeechFeatures: ['Pan/Pani formal address'] },
  ],
  B1: [
    { id: 'b1-dict-praca', title: 'Rozmowa o pracy', type: 'dictation',
      transcript: 'Chciałbym poruszyć pewną kwestię dotyczącą mojego wynagrodzenia.',
      questions: [{ question: 'Write the full sentence.', answer: 'Chciałbym poruszyć pewną kwestię dotyczącą mojego wynagrodzenia.', explanation: 'Note: dotyczącą (participle in accusative), wynagrodzenia (genitive).' }],
      vocabulary: ['poruszyć kwestię', 'dotyczący + gen.', 'wynagrodzenie'], connectedSpeechFeatures: ['formal register'] },
    { id: 'b1-case-gap', title: 'Case ending gap-fill', type: 'gap-fill',
      transcript: 'Dałem ___ (brat) książkę.',
      questions: [{ question: 'What case form of "brat" did you hear?', answer: 'bratu', explanation: 'Dative case for indirect object: brat → bratu.' }],
      vocabulary: ['dać + dative + accusative'], connectedSpeechFeatures: ['case ending recognition'] },
    { id: 'b1-comp-radio', title: 'Prognoza pogody', type: 'comprehension',
      transcript: 'Witamy w prognozie pogody. Dziś w całej Polsce zachmurzenie duże. Na zachodzie opady deszczu, na wschodzie opady śniegu. Temperatura od minus dwóch stopni na wschodzie do plus pięciu na zachodzie. Wiatr umiarkowany, południowo-zachodni. Jutro poprawa — w całym kraju słonecznie, temperatura do dziesięciu stopni.',
      questions: [
        { question: 'What is the weather like today?', answer: 'zachmurzenie duże, opady deszczu na zachodzie, śniegu na wschodzie', explanation: 'Cloudy with rain in the west and snow in the east.' },
        { question: 'What is the temperature range today?', answer: 'od -2 do +5 stopni', explanation: 'From minus 2 in the east to plus 5 in the west.' },
        { question: 'What is tomorrow\'s forecast?', answer: 'słonecznie, do 10 stopni', explanation: 'Sunny, up to 10 degrees.' },
      ],
      vocabulary: ['zachmurzenie', 'opady', 'wiatr umiarkowany', 'poprawa'], connectedSpeechFeatures: ['number + genitive agreement'] },
  ],
  B2: [
    { id: 'b2-dict-formal', title: 'Wypowiedź formalna', type: 'dictation',
      transcript: 'Gdybym wiedział wcześniej o tej sprawie, na pewno podjąłbym inne decyzje.',
      questions: [{ question: 'Write the full sentence.', answer: 'Gdybym wiedział wcześniej o tej sprawie, na pewno podjąłbym inne decyzje.', explanation: 'Past conditional: gdybym wiedział... podjąłbym. Note consonant cluster in "podjąłbym".' }],
      vocabulary: ['gdybym + past', 'podjąć decyzję'], connectedSpeechFeatures: ['conditional clusters'] },
    { id: 'b2-note-taking', title: 'Wykład o historii Polski', type: 'note-taking',
      transcript: 'Polska odzyskała niepodległość w tysiąc dziewięćset osiemnastym roku, po stu dwudziestu trzech latach rozbiorów. Trzy mocarstwa — Rosja, Prusy i Austria — podzieliły Polskę w osiemnastym wieku. Mimo braku własnego państwa, Polacy zachowali tożsamość narodową poprzez język, literaturę i religię katolicką. Józef Piłsudski odegrał kluczową rolę w odbudowie państwa polskiego.',
      questions: [
        { question: 'When did Poland regain independence?', answer: '1918', explanation: 'W tysiąc dziewięćset osiemnastym roku.' },
        { question: 'How many years were the partitions?', answer: '123 lata', explanation: 'Sto dwadzieścia trzy lata.' },
        { question: 'What three empires partitioned Poland?', answer: 'Rosja, Prusy, Austria', explanation: 'Russia, Prussia, Austria.' },
      ],
      vocabulary: ['niepodległość', 'rozbiory', 'tożsamość narodowa', 'odbudowa'], connectedSpeechFeatures: ['complex numbers in genitive'] },
  ],
  C1: [
    { id: 'c1-dict-academic', title: 'Tekst akademicki', type: 'dictation',
      transcript: 'Właściwie to chciałbym poruszyć pewną kwestię dotyczącą metodologii badań, która moim zdaniem wymaga ponownego rozpatrzenia.',
      questions: [{ question: 'Write the full sentence.', answer: 'Właściwie to chciałbym poruszyć pewną kwestię dotyczącą metodologii badań, która moim zdaniem wymaga ponownego rozpatrzenia.', explanation: 'Note discourse markers: właściwie to, moim zdaniem. Complex noun phrase: metodologii badań (genitive chain).' }],
      vocabulary: ['właściwie', 'moim zdaniem', 'metodologia badań', 'ponowne rozpatrzenie'], connectedSpeechFeatures: ['academic register', 'genitive chains'] },
  ],
  C2: [
    { id: 'c2-comp-humor', title: 'Polski humor', type: 'comprehension',
      transcript: 'Przychodzi facet do lekarza i mówi: "Panie doktorze, wszyscy mnie ignorują." Lekarz: "Następny proszę!"',
      questions: [
        { question: 'Why is this joke funny?', answer: 'The doctor ignores the patient who complains about being ignored, proving his point.', explanation: 'Classic Polish "przychodzi facet do..." joke structure. The humor is in the ironic demonstration.' },
      ],
      vocabulary: ['przychodzi facet do...', 'ignorować', 'następny proszę'], connectedSpeechFeatures: ['colloquial register', 'joke structure'] },
  ],
};

// ---------------------------------------------------------------------------
// Flatten exercises
// ---------------------------------------------------------------------------

const ALL_EXERCISES = {};
for (const level of core.CEFR) {
  if (EXERCISES[level]) {
    for (const ex of EXERCISES[level]) {
      ALL_EXERCISES[ex.id] = { ...ex, level };
    }
  }
}

// ---------------------------------------------------------------------------
// ListeningTutor class
// ---------------------------------------------------------------------------

class ListeningTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.skills) p.skills = {};
    if (!p.assessments) p.assessments = [];
    if (!p.sessions) p.sessions = [];
    if (!p.exerciseHistory) p.exerciseHistory = {};
    return p;
  }

  _save(p) { core.saveProfile(this.dir, p); }

  setLevel(studentId, level) {
    level = level.toUpperCase();
    if (!core.CEFR.includes(level)) throw new Error('Invalid CEFR level: ' + level);
    const p = this.getProfile(studentId);
    p.level = level;
    this._save(p);
    return { studentId, level };
  }

  getExerciseCatalog(level) {
    if (level) {
      return (EXERCISES[level] || []).map(e => ({ id: e.id, title: e.title, type: e.type, level, questionCount: e.questions.length }));
    }
    const catalog = {};
    for (const lv of core.CEFR) {
      if (EXERCISES[lv]) catalog[lv] = EXERCISES[lv].map(e => ({ id: e.id, title: e.title, type: e.type, questionCount: e.questions.length }));
    }
    return catalog;
  }

  generateExercise(studentId, type) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    let pool = EXERCISES[level] || EXERCISES.A1;
    if (type) {
      pool = pool.filter(e => e.type === type);
      if (!pool.length) throw new Error(`No exercises of type "${type}" at level ${level}`);
    }
    const history = p.exerciseHistory || {};
    const unseen = pool.filter(e => !history[e.id]);
    const chosen = unseen.length ? core.pick(unseen, 1)[0] : core.pick(pool, 1)[0];

    return {
      exerciseId: chosen.id, level, type: chosen.type, title: chosen.title,
      transcript: chosen.transcript,
      questions: chosen.questions.map((q, i) => ({ index: i, question: q.question })),
      vocabulary: chosen.vocabulary, connectedSpeechFeatures: chosen.connectedSpeechFeatures,
    };
  }

  generateLesson(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const pool = EXERCISES[level] || EXERCISES.A1;
    const types = [...new Set(pool.map(e => e.type))];
    const lesson = [];
    for (const t of core.shuffle(types).slice(0, 4)) {
      const ofType = pool.filter(e => e.type === t);
      lesson.push(core.pick(ofType, 1)[0]);
    }
    return {
      studentId, level, date: core.today(),
      exercises: lesson.map(ex => ({
        exerciseId: ex.id, type: ex.type, title: ex.title, transcript: ex.transcript,
        questions: ex.questions.map((q, i) => ({ index: i, question: q.question })),
        vocabulary: ex.vocabulary, connectedSpeechFeatures: ex.connectedSpeechFeatures,
      })),
    };
  }

  checkAnswer(studentId, exerciseId, answerText, questionIndex) {
    const ex = ALL_EXERCISES[exerciseId];
    if (!ex) throw new Error('Exercise not found: ' + exerciseId);
    const results = [];
    for (const q of ex.questions) {
      const normAnswer = core.norm(answerText);
      const normExpected = core.norm(q.answer);
      const exact = normAnswer === normExpected;
      const partial = !exact && normExpected.split(' ').filter(w => normAnswer.split(' ').includes(w)).length / normExpected.split(' ').length;
      results.push({ question: q.question, expected: q.answer, given: answerText, correct: exact, partialScore: exact ? 1 : Math.round((partial || 0) * 100) / 100, explanation: q.explanation });
    }
    const p = this.getProfile(studentId);
    if (!p.exerciseHistory) p.exerciseHistory = {};
    p.exerciseHistory[exerciseId] = { lastAttempt: core.today(), results, type: ex.type, level: ex.level };
    this._save(p);
    return { exerciseId, type: ex.type, level: ex.level, results };
  }

  recordAssessment(studentId, exerciseId, score, total) {
    const ex = ALL_EXERCISES[exerciseId];
    if (!ex) throw new Error('Exercise not found: ' + exerciseId);
    const p = this.getProfile(studentId);
    const skillKey = `${ex.level}-${ex.type}`;
    if (!p.skills[skillKey]) {
      p.skills[skillKey] = { level: ex.level, type: ex.type, attempts: [], stability: 1, difficulty: 5, lastReview: null, nextReview: null };
    }
    const sk = p.skills[skillKey];
    sk.attempts.push({ score, total, date: core.today(), exerciseId });
    if (sk.attempts.length > 20) sk.attempts = sk.attempts.slice(-20);
    const grade = total > 0 ? Math.min(4, Math.max(1, Math.round((score / total) * 4))) : 1;
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, Math.max(1, grade));
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, Math.max(1, grade));
    sk.lastReview = core.today();
    sk.nextReview = (() => { const d = new Date(); d.setDate(d.getDate() + core.fsrsNextReview(sk.stability)); return d.toISOString().slice(0, 10); })();
    p.assessments.push({ exerciseId, skillKey, score, total, date: core.today() });
    this._save(p);
    return { studentId, exerciseId, skillKey, score, total, mastery: core.calcMastery(sk.attempts), masteryLabel: core.masteryLabel(core.calcMastery(sk.attempts)), nextReview: sk.nextReview };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const progress = {};
    for (const [key, sk] of Object.entries(p.skills || {})) {
      progress[key] = { level: sk.level, type: sk.type, mastery: core.calcMastery(sk.attempts), masteryLabel: core.masteryLabel(core.calcMastery(sk.attempts)), attempts: (sk.attempts || []).length, nextReview: sk.nextReview };
    }
    return { studentId, level: p.level, progress };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const byType = {};
    for (const [, sk] of Object.entries(p.skills || {})) {
      if (!byType[sk.type]) byType[sk.type] = { attempts: 0, totalScore: 0, totalPossible: 0 };
      for (const a of sk.attempts || []) { byType[sk.type].attempts++; byType[sk.type].totalScore += a.score; byType[sk.type].totalPossible += a.total; }
    }
    for (const t of Object.keys(byType)) byType[t].accuracy = byType[t].totalPossible > 0 ? Math.round(byType[t].totalScore / byType[t].totalPossible * 100) : 0;
    return { studentId, level: p.level, createdAt: p.createdAt, totalAssessments: (p.assessments || []).length, skillProgress: progress.progress, byType, recentActivity: (p.assessments || []).slice(-10).reverse() };
  }

  getNextExercises(studentId) {
    const p = this.getProfile(studentId);
    const now = core.today();
    const due = [];
    for (const [key, sk] of Object.entries(p.skills || {})) {
      if (sk.nextReview && sk.nextReview <= now) due.push({ skillKey: key, level: sk.level, type: sk.type, mastery: core.calcMastery(sk.attempts), dueDate: sk.nextReview });
    }
    const level = p.level || 'A1';
    const pool = EXERCISES[level] || [];
    const triedTypes = new Set(Object.values(p.skills || {}).filter(sk => sk.level === level).map(sk => sk.type));
    const newTypes = [...new Set(pool.map(e => e.type))].filter(t => !triedTypes.has(t));
    return { studentId, level, dueForReview: due.sort((a, b) => a.dueDate.localeCompare(b.dueDate)), newTypesToTry: newTypes };
  }

  listStudents() { return core.listProfiles(this.dir); }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new ListeningTutor();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const id = args[1]; if (!id) throw new Error('Usage: start <studentId> [level]');
      const level = args[2] || 'A1';
      if (!core.CEFR.includes(level)) throw new Error('Invalid level: ' + level);
      const p = tutor.getProfile(id); if (!p.level) p.level = level; tutor._save(p);
      out({ studentId: id, level: p.level, status: 'ready' }); break;
    }
    case 'set-level': { const id = args[1], level = args[2]; if (!id || !level) throw new Error('Usage: set-level <studentId> <level>'); out(tutor.setLevel(id, level)); break; }
    case 'lesson': { const id = args[1]; if (!id) throw new Error('Usage: lesson <studentId>'); out(tutor.generateLesson(id)); break; }
    case 'exercise': { const id = args[1], type = args[2] || null; if (!id) throw new Error('Usage: exercise <studentId> [type]'); out(tutor.generateExercise(id, type)); break; }
    case 'check': { const id = args[1], exId = args[2], answer = args.slice(3).join(' '); if (!id || !exId || !answer) throw new Error('Usage: check <studentId> <exerciseId> <answer>'); out(tutor.checkAnswer(id, exId, answer, parseInt(args[4], 10) || null)); break; }
    case 'record': { const id = args[1], exId = args[2], score = parseInt(args[3]), total = parseInt(args[4]); if (!id || !exId || isNaN(score) || isNaN(total)) throw new Error('Usage: record <studentId> <exerciseId> <score> <total>'); out(tutor.recordAssessment(id, exId, score, total)); break; }
    case 'progress': { const id = args[1]; if (!id) throw new Error('Usage: progress <studentId>'); out(tutor.getProgress(id)); break; }
    case 'report': { const id = args[1]; if (!id) throw new Error('Usage: report <studentId>'); out(tutor.getReport(id)); break; }
    case 'next': { const id = args[1]; if (!id) throw new Error('Usage: next <studentId>'); out(tutor.getNextExercises(id)); break; }
    case 'exercises': { const lvl = args[1] || null; out(tutor.getExerciseCatalog(lvl)); break; }
    case 'students': { out({ students: tutor.listStudents() }); break; }
    case 'help':
      out({ commands: 'Use one of the commands listed in SKILL.md' });
      break;
    default:
      out({ error: 'Unknown command: ' + cmd, commands: ['start','set-level','lesson','exercise','check','record','progress','report','next','exercises','students'] });
  }
});
