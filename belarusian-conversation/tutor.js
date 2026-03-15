#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const LANG = 'belarusian';
const SKILL_NAME = 'belarusian-conversation';

// ─── Embedded Data ──────────────────────────────────────────────────────────

const SCENARIOS = [
  // A1 — Survival Conversations
  { id: 'a1-greetings',       level: 'A1', title: 'Greeting & introducing yourself',     setting: 'Social',     register: 'neutral',     keyLanguage: ['Добры дзень, мяне завуць...', 'Прыемна пазнаёміцца', 'Я з...', 'А вы?'] },
  { id: 'a1-ordering',        level: 'A1', title: 'Ordering at a café in Minsk',         setting: 'Café',       register: 'neutral',     keyLanguage: ['Мне, калі ласка...', 'Колькі каштуе?', 'Рахунак, калі ласка', 'Што вы параіце?'] },
  { id: 'a1-directions',      level: 'A1', title: 'Asking for directions in a city',     setting: 'Street',     register: 'neutral',     keyLanguage: ['Дзе знаходзіцца...?', 'Направа/налева', 'Проста', 'Гэта далёка?'] },
  { id: 'a1-shopping',        level: 'A1', title: 'Shopping at a market',                setting: 'Market',     register: 'neutral',     keyLanguage: ['Колькі гэта каштуе?', 'Я вазьму гэта', 'Ёсць большы?', 'Нешта танней?'] },

  // A2 — Daily Life Conversations
  { id: 'a2-plans',           level: 'A2', title: 'Making plans with a friend',          setting: 'Phone',      register: 'casual',      keyLanguage: ['Ты вольны ў...?', 'Давай сустрэнемся а...', 'Як табе ідэя...?'] },
  { id: 'a2-weekend',         level: 'A2', title: 'Describing your weekend',             setting: 'Social',     register: 'casual',      keyLanguage: ['Я хадзіў/хадзіла ў...', 'Было цікава', 'Мы гулялі...', 'Мы елі...'] },
  { id: 'a2-doctor',          level: 'A2', title: 'At the doctor',                       setting: 'Clinic',     register: 'formal',      keyLanguage: ['У мяне баліць...', 'Як даўно?', 'Вам трэба прымаць...', 'Рэцэпт'] },
  { id: 'a2-hobbies',         level: 'A2', title: 'Talking about hobbies',               setting: 'Social',     register: 'casual',      keyLanguage: ['Мне падабаецца...', 'У вольны час я...', 'Як часта вы...?'] },

  // B1 — Opinions & Experiences
  { id: 'b1-interview',       level: 'B1', title: 'Job interview (basic)',               setting: 'Office',     register: 'formal',      keyLanguage: ['Я маю досвед у...', 'Мае моцныя бакі...', 'Мне цікава...'] },
  { id: 'b1-complaint',       level: 'B1', title: 'Making a complaint',                  setting: 'Store',      register: 'neutral',     keyLanguage: ['Я не задаволены', 'Я хацеў бы вярнуць', 'Гэта не тое, што я замаўляў'] },
  { id: 'b1-opinions',        level: 'B1', title: 'Giving opinions about news',          setting: 'Social',     register: 'casual',      keyLanguage: ['Я лічу, што...', 'На маю думку...', 'Я згодны/не згодны, бо...'] },
  { id: 'b1-trip',            level: 'B1', title: 'Making plans for a trip',             setting: 'Social',     register: 'casual',      keyLanguage: ['Мы маглі б паехаць у...', 'Як табе?', 'Было б лепш, калі...'] },

  // B2 — Nuanced Discussion
  { id: 'b2-debate',          level: 'B2', title: 'Debating a topic',                    setting: 'Academic',   register: 'neutral',     keyLanguage: ['З аднаго боку...', 'Гэта залежыць ад...', 'Я разумею вашу думку, але...'] },
  { id: 'b2-negotiation',     level: 'B2', title: 'Negotiating (price, terms)',          setting: 'Business',   register: 'formal',      keyLanguage: ['Ці былі б вы гатовыя...', 'А калі мы...', 'Я мог бы прапанаваць...'] },
  { id: 'b2-culture',         level: 'B2', title: 'Discussing Belarusian culture',       setting: 'Social',     register: 'casual',      keyLanguage: ['У Беларусі прынята...', 'Мне кідаецца ў вочы, што...', 'Гэта нагадвае мне...'] },
  { id: 'b2-advice',          level: 'B2', title: 'Giving advice',                       setting: 'Social',     register: 'casual',      keyLanguage: ['На вашым месцы я б...', 'Ці думалі вы пра...?', 'Магчыма, варта...'] },

  // C1 — Abstract & Professional
  { id: 'c1-abstract',        level: 'C1', title: 'Abstract discussion',                 setting: 'Academic',   register: 'formal',      keyLanguage: ['Гэта ставіць пытанне пра...', 'З больш шырокай перспектывы...'] },
  { id: 'c1-language',        level: 'C1', title: 'Language politics in Belarus',         setting: 'Academic',   register: 'formal',      keyLanguage: ['Роля мовы ў нацыянальнай ідэнтычнасці', 'Статус мовы'] },
  { id: 'c1-persuasion',      level: 'C1', title: 'Persuasion',                          setting: 'Business',   register: 'formal',      keyLanguage: ['Я перакананы, што...', 'Разгледзьце наступствы', 'Даныя паказваюць...'] },
  { id: 'c1-cultural',        level: 'C1', title: 'Cultural comparison',                 setting: 'Social',     register: 'neutral',     keyLanguage: ['У маёй культуры...', 'Цікава, як...', 'Ёсць прынцыповая розніца...'] },

  // C2 — Mastery
  { id: 'c2-humor',           level: 'C2', title: 'Humor and sarcasm',                   setting: 'Social',     register: 'very_casual', keyLanguage: ['Iронія', 'Каламбуры', 'Падвойны сэнс', 'Беларускі гумар'] },
  { id: 'c2-disagreement',    level: 'C2', title: 'Nuanced disagreement',                setting: 'Academic',   register: 'formal',      keyLanguage: ['Я разумею, што вы кажаце, але не пагаджаюся ў...', 'Гэта слушная крытыка'] },
  { id: 'c2-literary',        level: 'C2', title: 'Literary discussion',                 setting: 'Academic',   register: 'formal',      keyLanguage: ['Падтэкст падказвае...', 'Аўтарская пазіцыя...', 'Гэта паралель з...'] },
  { id: 'c2-identity',        level: 'C2', title: 'Belarusian identity discussion',      setting: 'Academic',   register: 'formal',      keyLanguage: ['Што значыць быць беларусам сёння...', 'Нацыянальная самасвядомасць...'] },
];

const FUNCTIONAL_LANGUAGE = {
  agreeing: {
    A2: ['Так, згодны.', 'Вы маеце рацыю.'],
    B1: ['Я думаю, вы маеце рацыю.', 'Гэта добрая думка.'],
    B2: ['Цалкам згодны.', 'Не мог бы больш згадзіцца.'],
    C1: ['Я падзяляю гэту думку.', 'Абсалютна згодны.'],
  },
  disagreeing: {
    A2: ['Я не згодны.', 'Я так не думаю.'],
    B1: ['Я не ўпэўнены ў гэтым.', 'Я бачу гэта інакш.'],
    B2: ['Я разумею вашу думку, але...', 'Я б сказаў, што...'],
    C1: ['Я б з гэтым паспрачаўся.', 'З усёй павагай, я думаю інакш.'],
  },
  clarification: [
    'Прабачце, ці можаце паўтарыць?',
    'Што вы маеце на ўвазе?',
    'Ці можаце даць прыклад?',
    'Толькі каб упэўніцца — вы кажаце, што...?',
    'Я не ўпэўнены, што разумею — ці можаце растлумачыць?',
  ],
  changingSubject: [
    'Дарэчы...',
    'Гэта нагадвае мне...',
    'Мяняючы тэму...',
    'Я хацеў бы перайсці да...',
    'Калі казаць пра...',
  ],
  interrupting: [
    'Прабачце, што перабіваю, але...',
    'Ці магу я нешта сказаць?',
    'Калі дазволіце...',
    'Перш чым вы працягнеце...',
  ],
  uncertainty: [
    'Я не ўпэўнены, але, здаецца...',
    'Мабыць, я памыляюся, але...',
    'Калі мне не здраджвае памяць...',
    'Я б сказаў, што, мабыць...',
  ],
  softening: [
    'Хачу → Хацеў бы / Мне хацелася б',
    'Можаш → Ці мог бы ты',
    'Павінен → Варта было б',
    'Трэба → Напэўна, варта',
  ],
};

const ERROR_CATEGORIES = [
  { id: 'trasianka',       label: 'Trasianka (Russian mixing)',  example: '"спасибо" → "дзякуй"',                    levelFocus: 'All' },
  { id: 'case',            label: 'Case errors',                 example: '"у Мінск" → "у Мінску"',                    levelFocus: 'A2+' },
  { id: 'akanne',          label: 'Аканне spelling',             example: '"молоко" → "малако"',                       levelFocus: 'A1+' },
  { id: 'dzekanne',        label: 'Дзеканне/Цеканне',           example: '"день" → "дзень", "тихий" → "ціхі"',        levelFocus: 'A1+' },
  { id: 'uu',              label: 'Ў usage',                     example: '"автобус" → "аўтобус", "был" → "быў"',      levelFocus: 'A1+' },
  { id: 'aspect',          label: 'Verbal aspect',               example: '"Я чытаў кнігу" vs "Я прачытаў кнігу"',    levelFocus: 'B1+' },
  { id: 'gender',          label: 'Gender agreement',            example: '"новы кніга" → "новая кніга"',              levelFocus: 'A2+' },
  { id: 'past-tense',      label: 'Past tense (-ў)',             example: '"ён чытал" → "ён чытаў"',                   levelFocus: 'A2+' },
];

const REGISTERS = {
  very_casual: { label: 'Very Casual', addressForm: 'ты',         features: 'Slang, particles, fillers, diminutives' },
  casual:      { label: 'Casual',      addressForm: 'ты',         features: 'Particles (ж, бо, ну), relaxed, natural' },
  neutral:     { label: 'Neutral',     addressForm: 'Вы',         features: 'Polite, clear, standard grammar' },
  formal:      { label: 'Formal',      addressForm: 'Вы/Пан(і)',  features: 'Full verb forms, formal vocabulary, Пан/Пані address' },
  very_formal: { label: 'Very Formal', addressForm: 'Вы/Пан(і)',  features: 'No slang, formal connectors, official register' },
};

const CORRECTION_TECHNIQUES = {
  A1: ['recast'],
  A2: ['recast', 'trasianka_flag', 'elicitation'],
  B1: ['recast', 'trasianka_flag', 'elicitation', 'pushed_output'],
  B2: ['trasianka_flag', 'elicitation', 'metalinguistic_cue', 'pushed_output'],
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
    if (!p.trasiankaLog) p.trasiankaLog = [];
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
        { step: 2, name: 'Warm-up',     duration: '2 min', note: 'Low-stakes small talk: Добры дзень! Як справы?' },
        { step: 3, name: 'Conversation', duration: '10-12 min', note: 'Role-play with communicative goals' },
        { step: 4, name: 'Recap',       duration: '4 min', note: 'Corrections, Trasianka audit, vocabulary, emergent language' },
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
      id: s.id, level: s.level, title: s.title, setting: s.setting, register: s.register,
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
      trasiankaWords: data.trasiankaWords || [],
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

    if (data.trasiankaWords && data.trasiankaWords.length) {
      for (const tw of data.trasiankaWords) {
        p.trasiankaLog.push({ date: core.today(), russian: tw.russian, belarusian: tw.belarusian });
      }
      if (p.trasiankaLog.length > 50) p.trasiankaLog = p.trasiankaLog.slice(-50);
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
      functionalSkills: p.functionalSkills || {},
      trasiankaCount: (p.trasiankaLog || []).length,
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

    if ((p.trasiankaLog || []).length > 5) {
      const recentTrasianka = p.trasiankaLog.slice(-10);
      topics.push({
        type: 'trasianka_focus',
        message: 'Trasianka words to replace with Belarusian equivalents',
        items: recentTrasianka.map(t => `${t.russian} → ${t.belarusian}`),
      });
    }

    const practiced = new Set(Object.keys(p.functionalSkills || {}));
    const allFuncCategories = Object.keys(FUNCTIONAL_LANGUAGE);
    const unpracticed = allFuncCategories.filter(c => !practiced.has(c));
    if (unpracticed.length) {
      topics.push({ type: 'functional_language', message: 'Functional language areas to practice', items: unpracticed });
    }

    const levelSessions = (p.sessions || []).filter(s => s.level === level);
    if (levelSessions.length >= 6) {
      const levelIdx = core.CEFR.indexOf(level);
      if (levelIdx < core.CEFR.length - 1) {
        topics.push({ type: 'level_up', message: `Consider advancing to ${core.CEFR[levelIdx + 1]} (${levelSessions.length} sessions completed at ${level})` });
      }
    }

    return { studentId, level, recommendations: topics };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const next = this.getNextTopics(studentId);

    const recentSessions = (p.sessions || []).slice(-5).map(s => ({
      date: s.date, scenario: s.scenarioId, level: s.level,
      errors: (s.errorsObserved || []).length, vocabulary: (s.vocabularyLearned || []).length,
      trasiankaWords: (s.trasiankaWords || []).length,
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
          'start <student> [level]':                'Create profile and generate first session',
          'session <student>':                       'Generate a new session for student',
          'scenario <student> <scenarioId>':         'Get full scenario details',
          'recap <student> <scenarioId> [json]':     'Record session results',
          'progress <student>':                      'View student progress',
          'report <student>':                        'Full student report with recommendations',
          'scenarios [level]':                        'List all scenarios, optionally filtered by level',
          'set-level <student> <level>':             'Set CEFR level (A1-C2)',
          'students':                                'List all student profiles',
        },
      });
  }
});
