#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'russian-listening';

// ---------------------------------------------------------------------------
// Embedded exercise data by CEFR level
// ---------------------------------------------------------------------------

const EXERCISES = {
  A1: [
    { id: 'a1-dict-cafe', title: 'В кафе́', type: 'dictation',
      transcript: 'Здра́вствуйте. Мне оди́н ко́фе с молоко́м, пожа́луйста.',
      questions: [{ question: 'Write the full sentence you heard.', answer: 'Здра́вствуйте. Мне оди́н ко́фе с молоко́м, пожа́луйста.', explanation: 'Note: ко́фе is masculine (not neuter). "Мне" (dative) is the natural ordering form.' }],
      vocabulary: ['ко́фе', 'молоко́', 'пожа́луйста'], connectedSpeechFeatures: [] },
    { id: 'a1-dict-intro', title: 'Знако́мство', type: 'dictation',
      transcript: 'Меня́ зову́т Ива́н. Мне два́дцать пять лет. Я из Москвы́.',
      questions: [{ question: 'Write the full sentence you heard.', answer: 'Меня́ зову́т Ива́н. Мне два́дцать пять лет. Я из Москвы́.', explanation: 'Москвы́ is the genitive form of Москва́ (after из).' }],
      vocabulary: ['зову́т', 'лет', 'из'], connectedSpeechFeatures: [] },
    { id: 'a1-mp-byl-bil', title: 'Был vs бил', type: 'minimal-pairs',
      transcript: 'Он ___ до́ма.',
      questions: [{ question: 'Which word fits: "был" (was) or "бил" (was beating)?', answer: 'был', explanation: '"Он был до́ма" (He was at home) makes sense. ы vs и changes meaning.' }],
      vocabulary: ['был', 'бил', 'до́ма'], connectedSpeechFeatures: ['ы vs и'] },
    { id: 'a1-mp-mat-mat', title: 'Мат vs мать', type: 'minimal-pairs',
      transcript: 'Э́то моя́ ___.',
      questions: [{ question: 'Which word fits: "мат" (checkmate) or "мать" (mother)?', answer: 'мать', explanation: '"Э́то моя́ мать" (This is my mother). Hard/soft distinction: мат [mat] vs мать [matʲ].' }],
      vocabulary: ['мат', 'мать'], connectedSpeechFeatures: ['hard/soft consonants'] },
    { id: 'a1-comp-hotel', title: 'В гости́нице', type: 'comprehension',
      transcript: 'ГОСТЬ: Здра́вствуйте. У меня́ бронь на и́мя Петро́ва.\nАДМИНИСТРА́ТОР: Да, вот ваш ключ. Ко́мната два́дцать три, второ́й эта́ж.\nГОСТЬ: Спаси́бо. А где зáвтрак?\nАДМИНИСТРА́ТОР: Завтрак с семи́ до десяти́ в рестора́не на пе́рвом этаже́.',
      questions: [
        { question: 'Како́й но́мер ко́мнаты?', answer: 'два́дцать три', explanation: 'Администра́тор говори́т: "Ко́мната два́дцать три".' },
        { question: 'На како́м этаже́ ко́мната?', answer: 'на второ́м этаже́', explanation: '"Второ́й эта́ж" — second floor.' },
        { question: 'Когда́ за́втрак?', answer: 'с семи́ до десяти́', explanation: '"С семи́ до десяти́" — from 7 to 10.' },
      ],
      vocabulary: ['бронь', 'ключ', 'эта́ж', 'за́втрак'], connectedSpeechFeatures: [] },
  ],
  A2: [
    { id: 'a2-dict-weekend', title: 'Выходны́е', type: 'dictation',
      transcript: 'В суббо́ту мы ходи́ли в кино́. Фильм был о́чень интере́сный. Пото́м мы поу́жинали в рестора́не.',
      questions: [{ question: 'Write the full text you heard.', answer: 'В суббо́ту мы ходи́ли в кино́. Фильм был о́чень интере́сный. Пото́м мы поу́жинали в рестора́не.', explanation: 'Note ходи́ли (multidirectional past — round trip). Поу́жинали is perfective (completed dinner).' }],
      vocabulary: ['ходи́ли', 'интере́сный', 'поу́жинали'], connectedSpeechFeatures: ['vowel reduction in быстро'] },
    { id: 'a2-comp-transport', title: 'В метро́', type: 'comprehension',
      transcript: 'ПАССАЖИ́Р: Скажи́те, пожа́луйста, как дое́хать до Кра́сной пло́щади?\nЖЕ́НЩИНА: Вам ну́жно е́хать до ста́нции "Охо́тный ряд". Э́то три остано́вки отсю́да.\nПАССАЖИ́Р: Спаси́бо большо́е!\nЖЕ́НЩИНА: Пожа́луйста.',
      questions: [
        { question: 'Куда́ ну́жно пассажи́ру?', answer: 'на Кра́сную пло́щадь', explanation: 'Он спра́шивает "как дое́хать до Кра́сной пло́щади".' },
        { question: 'На како́й ста́нции ну́жно вы́йти?', answer: 'Охо́тный ряд', explanation: '"Вам ну́жно е́хать до ста́нции Охо́тный ряд".' },
      ],
      vocabulary: ['дое́хать', 'ста́нция', 'остано́вка'], connectedSpeechFeatures: [] },
    { id: 'a2-gap-reduction', title: 'Vowel reduction', type: 'gap-fill',
      transcript: '[mɐlɐˈko] — What word is this?',
      questions: [{ question: 'Write the standard Russian spelling.', answer: 'молоко́', explanation: 'Three different realizations of о: [m] unstressed → [ə], [l] pretonic → [ɐ], stressed → [o].' }],
      vocabulary: ['молоко́'], connectedSpeechFeatures: ['аканье'] },
  ],
  B1: [
    { id: 'b1-dict-natural', title: 'Разгово́р', type: 'dictation',
      transcript: 'Мы с ним вчера́ ходи́ли в кино́, но фильм был не о́чень.',
      questions: [{ question: 'Write the standard Russian spelling.', answer: 'Мы с ним вчера́ ходи́ли в кино́, но фильм был не о́чень.', explanation: '"Не о́чень" is a common understatement meaning "not great". Natural vowel reduction throughout.' }],
      vocabulary: ['вчера́', 'не о́чень'], connectedSpeechFeatures: ['vowel reduction', 'natural speed'] },
    { id: 'b1-comp-news', title: 'Но́вости', type: 'comprehension',
      transcript: 'По да́нным Росста́та, сре́дняя зарпла́та в Росси́и в про́шлом году́ соста́вила о́коло шести́десяти ты́сяч рубле́й в ме́сяц. Экспе́рты отмеча́ют, что реа́льные дохо́ды населе́ния вы́росли на три проце́нта по сравне́нию с предыду́щим го́дом.',
      questions: [
        { question: 'Какова́ сре́дняя зарпла́та?', answer: 'о́коло 60 000 рубле́й в ме́сяц', explanation: '"Соста́вила о́коло шести́десяти ты́сяч рубле́й".' },
        { question: 'На ско́лько вы́росли дохо́ды?', answer: 'на три проце́нта', explanation: '"Вы́росли на три проце́нта".' },
      ],
      vocabulary: ['зарпла́та', 'дохо́ды', 'населе́ние'], connectedSpeechFeatures: ['formal register'] },
    { id: 'b1-note-lecture', title: 'Ле́кция', type: 'note-taking',
      transcript: 'Сего́дня мы поговори́м о ру́сской культу́ре девятна́дцатого ве́ка. Э́то был золото́й век ру́сской литерату́ры. Пу́шкин, Ле́рмонтов, Го́голь — э́ти имена́ зна́ет весь мир. Пу́шкин счита́ется основополо́жником совреме́нного ру́сского литерату́рного языка́. Его́ рома́н "Евге́ний Оне́гин" — э́то энциклопе́дия ру́сской жи́зни.',
      questions: [
        { question: 'О каком ве́ке идёт речь?', answer: 'девятна́дцатый век', explanation: '"Девятна́дцатый век" — 19th century.' },
        { question: 'Кто счита́ется основополо́жником ру́сского литерату́рного языка́?', answer: 'Пу́шкин', explanation: '"Пу́шкин счита́ется основополо́жником..."' },
      ],
      vocabulary: ['золото́й век', 'основополо́жник', 'литерату́рный язы́к'], connectedSpeechFeatures: ['academic register'] },
  ],
  B2: [
    { id: 'b2-dict-colloquial', title: 'Разгово́рная речь', type: 'dictation',
      transcript: 'Слу́шай, я чё хоте́л сказа́ть — ты э́то, дава́й за́втра, ла́дно?',
      questions: [{ question: 'Write the standard Russian equivalent.', answer: 'Слу́шай, я что хоте́л сказа́ть — ты э́то, дава́й за́втра, ла́дно?', explanation: 'Colloquial чё = что. "Ты э́то" and "дава́й" are fillers. Natural fast speech.' }],
      vocabulary: ['чё = что', 'дава́й', 'ла́дно'], connectedSpeechFeatures: ['colloquial reductions'] },
    { id: 'b2-comp-debate', title: 'Диску́ссия', type: 'comprehension',
      transcript: 'ВЕДУЩИЙ: Как вы счита́ете, ну́жно ли ввести́ обяза́тельное изуче́ние второ́го иностра́нного языка́ в шко́ле?\nЭКСПЕ́РТ: С одно́й стороны́, э́то расширя́ет кругозо́р дете́й. С друго́й стороны́, нагру́зка на ученико́в и так высока́. На мой взгляд, лу́чше сде́лать э́то факультати́вным, что́бы мотиви́рованные де́ти могли́ выбра́ть.',
      questions: [
        { question: 'Како́й вопро́с обсужда́ют?', answer: 'обяза́тельное изуче́ние второ́го иностра́нного языка́ в шко́ле', explanation: 'Веду́щий спра́шивает об обяза́тельном изуче́нии второ́го языка́.' },
        { question: 'Како́е мне́ние у экспе́рта?', answer: 'лу́чше сде́лать факультати́вным', explanation: '"Лу́чше сде́лать э́то факультати́вным" — optional, not mandatory.' },
      ],
      vocabulary: ['кругозо́р', 'нагру́зка', 'факультати́вный'], connectedSpeechFeatures: ['formal debate register'] },
  ],
  C1: [
    { id: 'c1-dict-academic', title: 'Акаде́мическая речь', type: 'dictation',
      transcript: 'Принима́я во внима́ние вышеизло́женное, мо́жно сде́лать вы́вод о том, что да́нная пробле́ма тре́бует компле́ксного по́дхода.',
      questions: [{ question: 'Write the full sentence.', answer: 'Принима́я во внима́ние вышеизло́женное, мо́жно сде́лать вы́вод о том, что да́нная пробле́ма тре́бует компле́ксного по́дхода.', explanation: 'Academic/bureaucratic style with verbal adverb (принима́я), nominal constructions.' }],
      vocabulary: ['принима́я во внима́ние', 'вышеизло́женное', 'компле́ксный по́дход'], connectedSpeechFeatures: ['academic register', 'nominal style'] },
  ],
  C2: [
    { id: 'c2-dict-slang', title: 'Ра́зговорный сленг', type: 'dictation',
      transcript: 'Коро́че, я ваще́ не поня́л, чё он от меня́ хо́чет. Грю ему́ — ты чё, нормáльный? А он мне — да ла́дно тебе́.',
      questions: [{ question: 'Write the standard Russian equivalent.', answer: 'Коро́че, я вообще́ не по́нял, что он от меня́ хо́чет. Говорю́ ему́ — ты что, норма́льный? А он мне — да ла́дно тебе́.', explanation: 'Colloquial: ваще́=вообще́, чё=что, грю=говорю́. Extreme reduction in fast casual speech.' }],
      vocabulary: ['коро́че', 'ваще́=вообще́', 'грю=говорю́'], connectedSpeechFeatures: ['extreme colloquial reduction'] },
  ],
};

// ---------------------------------------------------------------------------
// ListeningTutor
// ---------------------------------------------------------------------------

class ListeningTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(id) {
    const p = core.loadProfile(this.dir, id);
    if (!p.level) p.level = 'A1';
    if (!p.skills) p.skills = {};
    if (!p.assessments) p.assessments = [];
    if (!p.sessions) p.sessions = [];
    return p;
  }

  setLevel(id, level) {
    if (!core.CEFR.includes(level)) throw new Error('Invalid CEFR level: ' + level);
    const p = this.getProfile(id);
    p.level = level;
    core.saveProfile(this.dir, p);
    return { studentId: id, level };
  }

  _exercisesForLevel(level) {
    const idx = core.CEFR.indexOf(level);
    const out = [];
    for (let i = 0; i <= idx; i++) {
      const lvl = core.CEFR[i];
      if (EXERCISES[lvl]) out.push(...EXERCISES[lvl].map(e => ({ ...e, level: lvl })));
    }
    return out;
  }

  generateLesson(id) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const avail = this._exercisesForLevel(level);
    const selected = core.pick(avail, 3);
    return { studentId: id, level, date: core.today(), exercises: selected };
  }

  generateExercise(id, type) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    let avail = this._exercisesForLevel(level);
    if (type) avail = avail.filter(e => e.type === type);
    if (!avail.length) avail = this._exercisesForLevel(level);
    return core.pick(avail, 1)[0];
  }

  checkAnswer(id, exerciseId, answer, questionIndex) {
    const allEx = [];
    for (const lvl of core.CEFR) {
      if (EXERCISES[lvl]) allEx.push(...EXERCISES[lvl]);
    }
    const ex = allEx.find(e => e.id === exerciseId);
    if (!ex) throw new Error('Exercise not found: ' + exerciseId);
    const q = ex.questions[0];
    const correct = core.norm(answer).includes(core.norm(q.answer));
    return { exerciseId, correct, expected: q.answer, explanation: q.explanation };
  }

  recordAssessment(id, exerciseId, score, total) {
    const p = this.getProfile(id);
    const s = parseInt(score, 10);
    const t = parseInt(total, 10);
    if (!p.skills[exerciseId]) {
      p.skills[exerciseId] = { stability: 1, difficulty: 5, lastReview: null, nextReview: null, attempts: [] };
    }
    const sk = p.skills[exerciseId];
    const grade = (s / t) >= 0.8 ? 4 : (s / t) >= 0.6 ? 3 : (s / t) >= 0.4 ? 2 : 1;
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, grade);
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, grade);
    sk.lastReview = core.today();
    const interval = core.fsrsNextReview(sk.stability);
    const d = new Date(); d.setDate(d.getDate() + interval);
    sk.nextReview = d.toISOString().slice(0, 10);
    sk.attempts.push({ score: s, total: t, date: core.today() });
    p.assessments.push({ exerciseId, score: s, total: t, date: core.today() });
    core.saveProfile(this.dir, p);
    return { studentId: id, exerciseId, score: s, total: t, grade, nextReview: sk.nextReview };
  }

  getProgress(id) {
    const p = this.getProfile(id);
    const byType = {};
    for (const a of p.assessments) {
      const allEx = [];
      for (const lvl of core.CEFR) { if (EXERCISES[lvl]) allEx.push(...EXERCISES[lvl]); }
      const ex = allEx.find(e => e.id === a.exerciseId);
      const type = ex ? ex.type : 'unknown';
      if (!byType[type]) byType[type] = { count: 0, totalScore: 0, totalItems: 0 };
      byType[type].count++;
      byType[type].totalScore += a.score;
      byType[type].totalItems += a.total;
    }
    return { studentId: id, level: p.level, assessments: p.assessments.length, byType };
  }

  getReport(id) {
    const progress = this.getProgress(id);
    const p = this.getProfile(id);
    const recent = p.assessments.slice(-5);
    return { ...progress, recentAssessments: recent };
  }

  getNextExercises(id) {
    const p = this.getProfile(id);
    const td = core.today();
    const due = [];
    for (const [exId, sk] of Object.entries(p.skills)) {
      if (sk.nextReview && sk.nextReview <= td) due.push({ exerciseId: exId, nextReview: sk.nextReview });
    }
    return { studentId: id, due };
  }

  listExercises(level) {
    if (level) return EXERCISES[level] || [];
    return EXERCISES;
  }

  listStudents() { return core.listProfiles(this.dir); }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new ListeningTutor();

core.runCLI((cmd, args, out) => {
  const id = args[1] || 'default';
  switch (cmd) {
    case 'start':
      out(tutor.getProfile(id));
      break;
    case 'set-level':
      out(tutor.setLevel(id, (args[2] || '').toUpperCase()));
      break;
    case 'lesson':
      out(tutor.generateLesson(id));
      break;
    case 'exercise':
      out(tutor.generateExercise(id, args[2]));
      break;
    case 'check':
      out(tutor.checkAnswer(id, args[2], args.slice(3).join(' '), parseInt(args[4], 10) || null));
      break;
    case 'record':
      out(tutor.recordAssessment(id, args[2], args[3], args[4]));
      break;
    case 'progress':
      out(tutor.getProgress(id));
      break;
    case 'report':
      out(tutor.getReport(id));
      break;
    case 'next':
      out(tutor.getNextExercises(id));
      break;
    case 'exercises':
      out(tutor.listExercises(args[2] ? args[2].toUpperCase() : null));
      break;
    case 'students':
      out({ students: tutor.listStudents() });
      break;
    case 'help':
      out({ commands: 'Use one of the commands listed in SKILL.md' });
      break;
    default:
      out({ error: 'Unknown command: ' + cmd, commands: ['start','set-level','lesson','exercise','check','record','progress','report','next','exercises','students'] });
  }
});
