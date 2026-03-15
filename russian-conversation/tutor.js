#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const LANG = 'russian';
const SKILL_NAME = 'russian-conversation';

// ─── Embedded Data ──────────────────────────────────────────────────────────

const SCENARIOS = [
  // A1 — Survival Conversations
  { id: 'a1-greetings',       level: 'A1', title: 'Greeting & introducing yourself',           setting: 'Social',     register: 'neutral',     keyLanguage: ['Здра́вствуйте, меня́ зову́т...', 'О́чень прия́тно', 'Я из...', 'А вас?'] },
  { id: 'a1-ordering',        level: 'A1', title: 'Ordering at a Russian café',                setting: 'Café',       register: 'neutral',     keyLanguage: ['Мне, пожа́луйста...', 'Ско́лько сто́ит?', 'Счёт, пожа́луйста', 'Что вы посове́туете?'] },
  { id: 'a1-directions',      level: 'A1', title: 'Asking for directions in a city',           setting: 'Street',     register: 'neutral',     keyLanguage: ['Где нахо́дится...?', 'Напра́во/нале́во', 'Пря́мо', 'Э́то далеко́?'] },
  { id: 'a1-shopping',        level: 'A1', title: 'Shopping at a market',                      setting: 'Rýnok',     register: 'neutral',     keyLanguage: ['Ско́лько?', 'Я возьму́ э́то', 'Есть побо́льше?', 'Что-нибу́дь подеше́вле?'] },

  // A2 — Daily Life Conversations
  { id: 'a2-plans',           level: 'A2', title: 'Making plans with a friend',                setting: 'Phone',      register: 'casual',      keyLanguage: ['Ты свобо́ден/свобо́дна?', 'Дава́й встре́тимся в...', 'Как тебе́ тако́й план?'] },
  { id: 'a2-weekend',         level: 'A2', title: 'Describing your weekend',                   setting: 'Social',     register: 'casual',      keyLanguage: ['Я ходи́л/а в...', 'Бы́ло о́чень весело́', 'Мы игра́ли...', 'Мы е́ли...'] },
  { id: 'a2-doctor',          level: 'A2', title: 'At the doctor',                             setting: 'Clinic',     register: 'formal',      keyLanguage: ['У меня́ боли́т...', 'С каки́х пор?', 'Вам ну́жно принима́ть...', 'Реце́пт'] },
  { id: 'a2-hobbies',         level: 'A2', title: 'Talking about hobbies',                     setting: 'Social',     register: 'casual',      keyLanguage: ['Я увлека́юсь...', 'Мне нра́вится...', 'Как ча́сто ты...?'] },

  // B1 — Opinions & Experiences
  { id: 'b1-interview',       level: 'B1', title: 'Job interview (basic)',                     setting: 'Office',     register: 'formal',      keyLanguage: ['У меня́ о́пыт в...', 'Мои́ си́льные сто́роны...', 'Меня́ интересу́ет...'] },
  { id: 'b1-complaint',       level: 'B1', title: 'Making a complaint',                        setting: 'Store',      register: 'neutral',     keyLanguage: ['Я недово́лен/недово́льна', 'Я хоте́л/а бы верну́ть...', 'Э́то не то, что я заказа́л/а'] },
  { id: 'b1-opinions',        level: 'B1', title: 'Giving opinions about news',                setting: 'Social',     register: 'casual',      keyLanguage: ['Я ду́маю, что...', 'По-мо́ему...', 'Я согла́сен/согла́сна / не согла́сен/не согла́сна, потому́ что...'] },
  { id: 'b1-trip',            level: 'B1', title: 'Making plans for a trip',                   setting: 'Social',     register: 'casual',      keyLanguage: ['Мы могли́ бы пое́хать в...', 'Как тебе́?', 'Бы́ло бы лу́чше, е́сли...'] },

  // B2 — Nuanced Discussion
  { id: 'b2-debate',          level: 'B2', title: 'Debating a topic',                          setting: 'Academic',   register: 'neutral',     keyLanguage: ['С одно́й стороны́...', 'Э́то зави́сит от...', 'Я понима́ю ва́шу то́чку зре́ния, но...'] },
  { id: 'b2-negotiation',     level: 'B2', title: 'Negotiating (price, terms)',                setting: 'Business',   register: 'formal',      keyLanguage: ['Мы гото́вы предложи́ть...', 'А что е́сли мы...', 'Мы мо́жем предложи́ть вам...'] },
  { id: 'b2-movie',           level: 'B2', title: 'Discussing a movie or book',                setting: 'Social',     register: 'casual',      keyLanguage: ['Сюже́т о том, как...', 'Меня́ порази́ло то, что...', 'Э́то напо́мнило мне...'] },
  { id: 'b2-advice',          level: 'B2', title: 'Giving advice',                             setting: 'Social',     register: 'casual',      keyLanguage: ['На твоём ме́сте я бы...', 'Ты не ду́мал/а о...?', 'Тебе́ сто́ит...'] },

  // C1 — Abstract & Professional
  { id: 'c1-abstract',        level: 'C1', title: 'Abstract discussion',                       setting: 'Academic',   register: 'formal',      keyLanguage: ['Э́то ста́вит вопро́с о...', 'С бо́лее широ́кой то́чки зре́ния...'] },
  { id: 'c1-conflict',        level: 'C1', title: 'Conflict resolution at work',               setting: 'Office',     register: 'formal',      keyLanguage: ['Я понима́ю ва́шу озабо́ченность', 'Дава́йте найдём компроми́сс'] },
  { id: 'c1-persuasion',      level: 'C1', title: 'Persuasion',                                setting: 'Business',   register: 'formal',      keyLanguage: ['Я убеждён, что...', 'Приме́те во внима́ние после́дствия', 'Да́нные свиде́тельствуют...'] },
  { id: 'c1-cultural',        level: 'C1', title: 'Cultural comparison',                       setting: 'Social',     register: 'neutral',     keyLanguage: ['В мое́й культу́ре...', 'Интере́сно, как...', 'Есть принципиа́льная ра́зница...'] },

  // C2 — Mastery
  { id: 'c2-humor',           level: 'C2', title: 'Humor and sarcasm',                         setting: 'Social',     register: 'very_casual', keyLanguage: ['Ирония', 'Игра́ слов', 'Двойно́й смысл', 'Анекдо́ты'] },
  { id: 'c2-disagreement',    level: 'C2', title: 'Nuanced disagreement',                      setting: 'Academic',   register: 'formal',      keyLanguage: ['Я понима́ю, что вы хоти́те сказа́ть, но позво́лю себе́ не согласи́ться в...', 'Э́то спра́ведливая кри́тика'] },
  { id: 'c2-literary',        level: 'C2', title: 'Literary discussion',                       setting: 'Academic',   register: 'formal',      keyLanguage: ['Подте́кст предполага́ет...', 'Испо́льзование а́втором...', 'Э́то паралле́ль с...'] },
  { id: 'c2-philosophy',      level: 'C2', title: 'Philosophical discussion',                  setting: 'Academic',   register: 'formal',      keyLanguage: ['Мо́жно утвержда́ть, что...', 'Зави́сит от того́, как определи́ть...', 'Парадо́кс в том, что...'] },
];

const FUNCTIONAL_LANGUAGE = {
  agreeing: {
    A2: ['Да, согла́сен/согла́сна.', 'Ты прав/права́.'],
    B1: ['Ду́маю, ты прав/права́.', 'Хоро́шая мысль.'],
    B2: ['Абсолю́тно.', 'Не могу́ не согласи́ться.'],
    C1: ['Я по́лностью разделя́ю э́ту то́чку зре́ния.', 'Совершенно ве́рно.'],
  },
  disagreeing: {
    A2: ['Я не согла́сен/не согла́сна.', 'Не ду́маю.'],
    B1: ['Я не уве́рен/не уве́рена в э́том.', 'Я ви́жу э́то ина́че.'],
    B2: ['Я понима́ю ва́шу то́чку зре́ния, но...', 'Я бы сказа́л/сказа́ла, что...'],
    C1: ['Позво́льте не согласи́ться.', 'При всём уваже́нии, я приде́рживаюсь ино́го мне́ния.'],
  },
  clarification: [
    'Прости́те, мо́жете повтори́ть?',
    'Что вы име́ете в виду́?',
    'Мо́жете привести́ приме́р?',
    'То есть вы хоти́те сказа́ть, что...?',
    'Я не совсе́м поня́л/поняла́ — мо́жете объясни́ть?',
  ],
  changingSubject: [
    'Кста́ти...',
    'Э́то напо́мнило мне...',
    'Меня́я те́му...',
    'Хоте́л/хоте́ла бы перейти́ к...',
    'Говоря́ о...',
  ],
  interrupting: [
    'Прости́те, что перебива́ю, но...',
    'Мо́жно сказа́ть?',
    'Е́сли позво́лите на мину́тку...',
    'Пре́жде чем вы продо́лжите...',
  ],
  uncertainty: [
    'Я не уве́рен/не уве́рена, но ду́маю, что...',
    'Мо́жет быть, я оши́баюсь, но...',
    'Е́сли мне не изменя́ет па́мять...',
    'Я бы сказа́л/сказа́ла, что, наве́рное...',
  ],
  softening: [
    'Хочу́ → Хоте́л/а бы / Мне хоте́лось бы',
    'Мо́жете → Не могли́ бы вы',
    'До́лжны → Вам сто́ило бы',
    'Вам на́до → Вам бы сто́ило',
  ],
};

const ERROR_CATEGORIES = [
  { id: 'case-errors',        label: 'Case errors',             example: '"в Москва́" → "в Москве́" (prepositional)',       levelFocus: 'A2+' },
  { id: 'aspect',             label: 'Verbal aspect',           example: '"Я чита́л кни́гу" vs "Я прочита́л кни́гу"',     levelFocus: 'B1+' },
  { id: 'motion-verbs',       label: 'Verbs of motion',         example: '"Я иду́ в магази́н ка́ждый день" → "Я хожу́..."', levelFocus: 'B1+' },
  { id: 'gender',             label: 'Gender agreement',        example: '"большо́й кни́га" → "больша́я кни́га"',          levelFocus: 'A2+' },
  { id: 'ty-vy',              label: 'Ты/Вы confusion',         example: 'Using ты with a stranger or boss',               levelFocus: 'All' },
  { id: 'word-order',         label: 'Word order / emphasis',   example: 'Unnatural emphasis placement',                   levelFocus: 'B2+' },
  { id: 'reflexive',          label: 'Reflexive verbs (-ся)',   example: '"Я учу́" → "Я учу́сь" (studying vs teaching)',    levelFocus: 'A2+' },
  { id: 'false-friends',      label: 'False friends',           example: '"магази́н" ≠ magazine (= store)',                  levelFocus: 'All' },
];

const REGISTERS = {
  very_casual: { label: 'Very Casual',  addressForm: 'ты',    features: 'Slang, fragments, particles (ну, же, вот), diminutives, ты' },
  casual:      { label: 'Casual',       addressForm: 'ты',    features: 'Natural connectors, particles, ты (if agreed)' },
  neutral:     { label: 'Neutral',      addressForm: 'вы',    features: 'Polite, clear, вы, standard forms' },
  formal:      { label: 'Formal',       addressForm: 'вы',    features: 'Full verb forms, formal vocabulary, structured' },
  very_formal: { label: 'Very Formal',  addressForm: 'вы',    features: 'Bureaucratic language, passive constructions, no slang' },
};

const CORRECTION_TECHNIQUES = {
  A1: ['recast'],
  A2: ['recast', 'elicitation', 'clarification'],
  B1: ['recast', 'elicitation', 'clarification', 'pushed_output'],
  B2: ['elicitation', 'clarification', 'metalinguistic_cue', 'pushed_output'],
  C1: ['metalinguistic_cue', 'pushed_output'],
  C2: ['metalinguistic_cue'],
};

const CAF_PRIORITIES = {
  A1: { priority: 'fluency',    accuracy: 'low',  complexity: 'low' },
  A2: { priority: 'fluency',    accuracy: 'low',  complexity: 'low' },
  B1: { priority: 'fluency+accuracy', accuracy: 'medium', complexity: 'medium' },
  B2: { priority: 'accuracy+fluency', accuracy: 'medium', complexity: 'medium' },
  C1: { priority: 'complexity+accuracy', accuracy: 'high', complexity: 'high' },
  C2: { priority: 'complexity+accuracy', accuracy: 'high', complexity: 'high' },
};

// ─── Tutor Class ────────────────────────────────────────────────────────────

class ConversationTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.level) p.level = 'A1';
    if (!p.sessions) p.sessions = [];
    if (!p.errorTracking) p.errorTracking = {};
    if (!p.scenarioHistory) p.scenarioHistory = [];
    if (!p.functionalSkills) p.functionalSkills = {};
    return p;
  }

  _save(p) {
    core.saveProfile(this.dir, p);
  }

  setLevel(studentId, level) {
    level = level.toUpperCase();
    if (!core.CEFR.includes(level)) throw new Error(`Invalid CEFR level: ${level}. Must be one of: ${core.CEFR.join(', ')}`);
    const p = this.getProfile(studentId);
    p.level = level;
    this._save(p);
    return { studentId, level, cafPriority: CAF_PRIORITIES[level], correctionTechniques: CORRECTION_TECHNIQUES[level] };
  }

  // ── Session Generation ──────────────────────────────────────────────────

  generateSession(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level;

    const levelScenarios = SCENARIOS.filter(s => s.level === level);
    const seen = new Set(p.scenarioHistory.map(h => h.scenarioId));
    let candidates = levelScenarios.filter(s => !seen.has(s.id));
    if (candidates.length === 0) candidates = levelScenarios;
    const scenario = core.pick(candidates, 1)[0];

    const reg = REGISTERS[scenario.register] || REGISTERS.neutral;

    const levelIdx = core.CEFR.indexOf(level);
    const funcLang = {};
    for (const [cat, levels] of Object.entries(FUNCTIONAL_LANGUAGE)) {
      if (typeof levels === 'object' && !Array.isArray(levels)) {
        const applicable = core.CEFR.slice(0, levelIdx + 1)
          .filter(l => levels[l])
          .flatMap(l => levels[l]);
        if (applicable.length) funcLang[cat] = applicable;
      } else if (Array.isArray(levels)) {
        funcLang[cat] = levels;
      }
    }

    const errorFocus = ERROR_CATEGORIES.filter(e => {
      if (e.levelFocus === 'All') return true;
      const match = e.levelFocus.match(/^([A-C]\d)\+?$/);
      if (!match) return true;
      return core.CEFR.indexOf(level) >= core.CEFR.indexOf(match[1]);
    });

    return {
      studentId,
      level,
      scenario: {
        id: scenario.id,
        title: scenario.title,
        setting: scenario.setting,
        register: reg.label,
        addressForm: reg.addressForm,
        keyLanguage: scenario.keyLanguage,
      },
      cafPriority: CAF_PRIORITIES[level],
      correctionTechniques: CORRECTION_TECHNIQUES[level],
      functionalLanguage: funcLang,
      errorFocus: errorFocus.map(e => ({ id: e.id, label: e.label, example: e.example })),
      sessionFlow: [
        { step: 1, name: 'Setup',       duration: '2 min', note: `Scenario: ${scenario.title}, Register: ${reg.label}` },
        { step: 2, name: 'Warm-up',     duration: '2 min', note: `Low-stakes small talk` },
        { step: 3, name: 'Conversation', duration: '10-12 min', note: `Role-play with communicative goals` },
        { step: 4, name: 'Recap',       duration: '4 min', note: `Corrections, vocabulary, emergent language` },
      ],
    };
  }

  getScenario(scenarioId) {
    const s = SCENARIOS.find(sc => sc.id === scenarioId);
    if (!s) throw new Error(`Scenario not found: ${scenarioId}`);
    const reg = REGISTERS[s.register] || REGISTERS.neutral;
    return {
      ...s,
      registerLabel: reg.label,
      addressForm: reg.addressForm,
      registerFeatures: reg.features,
    };
  }

  listScenarios(level) {
    let list = SCENARIOS;
    if (level) {
      if (!core.CEFR.includes(level)) throw new Error(`Invalid CEFR level: ${level}`);
      list = list.filter(s => s.level === level);
    }
    return list.map(s => ({
      id: s.id,
      level: s.level,
      title: s.title,
      setting: s.setting,
      register: s.register,
    }));
  }

  // ── Recording & Progress ────────────────────────────────────────────────

  recordSession(studentId, scenarioId, data) {
    const p = this.getProfile(studentId);
    const session = {
      date: core.today(),
      scenarioId,
      level: p.level,
      duration: data.duration || null,
      errorsObserved: data.errors || [],
      emergentLanguage: data.emergentLanguage || [],
      vocabularyLearned: data.vocabulary || [],
      score: data.score != null ? data.score : null,
      total: data.total != null ? data.total : null,
      notes: data.notes || '',
    };

    p.sessions.push(session);
    p.scenarioHistory.push({ scenarioId, date: core.today() });

    if (data.errors && data.errors.length) {
      for (const err of data.errors) {
        const cat = err.category || 'other';
        if (!p.errorTracking[cat]) p.errorTracking[cat] = { count: 0, recent: [] };
        p.errorTracking[cat].count++;
        p.errorTracking[cat].recent.push({ date: core.today(), detail: err.detail || '' });
        if (p.errorTracking[cat].recent.length > 10) p.errorTracking[cat].recent.shift();
      }
    }

    if (data.functionalSkillsUsed) {
      for (const skill of data.functionalSkillsUsed) {
        if (!p.functionalSkills[skill]) p.functionalSkills[skill] = 0;
        p.functionalSkills[skill]++;
      }
    }

    this._save(p);
    return { recorded: true, sessionCount: p.sessions.length, scenarioId };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const sessions = p.sessions || [];
    const totalSessions = sessions.length;

    const byLevel = {};
    for (const s of sessions) {
      byLevel[s.level] = (byLevel[s.level] || 0) + 1;
    }

    const errorSummary = {};
    for (const [cat, data] of Object.entries(p.errorTracking || {})) {
      const catInfo = ERROR_CATEGORIES.find(e => e.id === cat);
      errorSummary[cat] = {
        label: catInfo ? catInfo.label : cat,
        totalErrors: data.count,
        recentCount: data.recent.length,
      };
    }

    const scenariosCompleted = [...new Set((p.scenarioHistory || []).map(h => h.scenarioId))];

    const scored = sessions.filter(s => s.score != null && s.total != null && s.total > 0);
    const mastery = core.calcMastery(scored.map(s => ({ score: s.score, total: s.total })));

    const funcSkills = p.functionalSkills || {};

    return {
      studentId,
      level: p.level,
      totalSessions,
      sessionsByLevel: byLevel,
      scenariosCompleted: scenariosCompleted.length,
      totalScenarios: SCENARIOS.length,
      mastery,
      masteryLabel: core.masteryLabel(mastery),
      errorPatterns: errorSummary,
      functionalSkills: funcSkills,
    };
  }

  getNextTopics(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level;
    const topics = [];

    const seen = new Set((p.scenarioHistory || []).map(h => h.scenarioId));
    const unseen = SCENARIOS.filter(s => s.level === level && !seen.has(s.id));
    if (unseen.length) {
      topics.push({ type: 'scenario', message: `${unseen.length} unseen scenario(s) at ${level}`, items: unseen.map(s => s.title) });
    }

    const errorTracking = p.errorTracking || {};
    const frequentErrors = Object.entries(errorTracking)
      .filter(([, d]) => d.count >= 2)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 3);
    if (frequentErrors.length) {
      topics.push({
        type: 'error_focus',
        message: 'Recurring error patterns to address',
        items: frequentErrors.map(([cat, d]) => {
          const info = ERROR_CATEGORIES.find(e => e.id === cat);
          return `${info ? info.label : cat} (${d.count} occurrences) — e.g. ${info ? info.example : ''}`;
        }),
      });
    }

    const practiced = new Set(Object.keys(p.functionalSkills || {}));
    const allFuncCategories = Object.keys(FUNCTIONAL_LANGUAGE);
    const unpracticed = allFuncCategories.filter(c => !practiced.has(c));
    if (unpracticed.length) {
      topics.push({ type: 'functional_language', message: 'Functional language areas to practice', items: unpracticed });
    }

    const sessions = (p.sessions || []).filter(s => s.level === level);
    if (sessions.length >= 6) {
      const levelIdx = core.CEFR.indexOf(level);
      if (levelIdx < core.CEFR.length - 1) {
        topics.push({ type: 'level_up', message: `Consider advancing to ${core.CEFR[levelIdx + 1]} (${sessions.length} sessions completed at ${level})` });
      }
    }

    return { studentId, level, recommendations: topics };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const next = this.getNextTopics(studentId);

    const recentSessions = (p.sessions || []).slice(-5).map(s => ({
      date: s.date,
      scenario: s.scenarioId,
      level: s.level,
      errors: (s.errorsObserved || []).length,
      vocabulary: (s.vocabularyLearned || []).length,
    }));

    return {
      studentId,
      level: p.level,
      createdAt: p.createdAt,
      progress,
      recentSessions,
      recommendations: next.recommendations,
    };
  }

  listStudents() {
    return core.listProfiles(this.dir);
  }
}

// ─── CLI ────────────────────────────────────────────────────────────────────

const tutor = new ConversationTutor();

core.runCLI((cmd, args, out) => {
  const sid = args[1] || 'default';

  switch (cmd) {
    case 'start': {
      const level = args[2] || 'A1';
      tutor.setLevel(sid, level);
      const session = tutor.generateSession(sid);
      out(session);
      break;
    }

    case 'session': {
      out(tutor.generateSession(sid));
      break;
    }

    case 'scenario': {
      const scenarioId = args[2];
      if (!scenarioId) throw new Error('Usage: scenario <studentId> <scenarioId>');
      out(tutor.getScenario(scenarioId));
      break;
    }

    case 'recap': {
      const scenarioId = args[2];
      if (!scenarioId) throw new Error('Usage: recap <studentId> <scenarioId> [json-data]');
      let data = {};
      if (args[3]) {
        try { data = JSON.parse(args[3]); } catch { data = { notes: args[3] }; }
      }
      out(tutor.recordSession(sid, scenarioId, data));
      break;
    }

    case 'progress': {
      out(tutor.getProgress(sid));
      break;
    }

    case 'report': {
      out(tutor.getReport(sid));
      break;
    }

    case 'scenarios': {
      const level = args[1] ? args[1].toUpperCase() : null;
      out(tutor.listScenarios(level));
      break;
    }

    case 'set-level': {
      const level = args[2];
      if (!level) throw new Error('Usage: set-level <studentId> <level>');
      out(tutor.setLevel(sid, level));
      break;
    }

    case 'students': {
      out({ students: tutor.listStudents() });
      break;
    }


    case 'help':

      out({ info: 'Use one of the commands listed in SKILL.md' });

      break;

    default:
      out({
        error: `Unknown command: ${cmd}`,
        usage: {
          'start <student> [level]':             'Create profile and generate first session',
          'session <student>':                    'Generate a new session for student',
          'scenario <student> <scenarioId>':      'Get full scenario details',
          'recap <student> <scenarioId> [json]':  'Record session results',
          'progress <student>':                   'View student progress',
          'report <student>':                     'Full student report with recommendations',
          'scenarios [level]':                    'List all scenarios, optionally filtered by level',
          'set-level <student> <level>':          'Set CEFR level (A1-C2)',
          'students':                             'List all student profiles',
        },
      });
  }
});
