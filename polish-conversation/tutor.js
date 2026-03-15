#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const LANG = 'polish';
const SKILL_NAME = 'polish-conversation';

// ─── Embedded Data ──────────────────────────────────────────────────────────

const SCENARIOS = [
  // A1 — Survival Conversations
  { id: 'a1-greetings',       level: 'A1', title: 'Greeting & introducing yourself',     setting: 'Social',     register: 'neutral',     keyLanguage: ['Dzień dobry, jestem...', 'Miło mi', 'Jestem z...', 'A Pan/Pani?'] },
  { id: 'a1-ordering',        level: 'A1', title: 'Ordering at a Polish restaurant',     setting: 'Restaurant', register: 'neutral',     keyLanguage: ['Poproszę...', 'Czy jest...?', 'Rachunek proszę', 'Co Pan/Pani poleca?'] },
  { id: 'a1-directions',      level: 'A1', title: 'Asking for directions in a city',     setting: 'Street',     register: 'neutral',     keyLanguage: ['Gdzie jest...?', 'Na prawo/lewo', 'Prosto', 'Czy to daleko?'] },
  { id: 'a1-shopping',        level: 'A1', title: 'Shopping at a market',                setting: 'Rynek',      register: 'neutral',     keyLanguage: ['Ile kosztuje?', 'Wezmę to', 'Czy jest większy?', 'Coś tańszego?'] },

  // A2 — Daily Life Conversations
  { id: 'a2-plans',           level: 'A2', title: 'Making plans with a friend',          setting: 'Phone',      register: 'casual',      keyLanguage: ['Jesteś wolny/wolna w...?', 'Spotkajmy się o...', 'Co powiesz na...?'] },
  { id: 'a2-weekend',         level: 'A2', title: 'Describing your weekend',             setting: 'Social',     register: 'casual',      keyLanguage: ['Byłem/Byłam w...', 'Było super', 'Graliśmy w...', 'Jedliśmy...'] },
  { id: 'a2-doctor',          level: 'A2', title: 'At the doctor',                       setting: 'Przychodnia', register: 'formal',     keyLanguage: ['Boli mnie...', 'Od kiedy?', 'Musi Pan/Pani brać...', 'Recepta'] },
  { id: 'a2-hobbies',         level: 'A2', title: 'Talking about hobbies',               setting: 'Social',     register: 'casual',      keyLanguage: ['Lubię...', 'W wolnym czasie...', 'Jak często...?'] },

  // B1 — Opinions & Experiences
  { id: 'b1-interview',       level: 'B1', title: 'Job interview (basic)',               setting: 'Office',     register: 'formal',      keyLanguage: ['Mam doświadczenie w...', 'Moje mocne strony to...', 'Interesuję się...'] },
  { id: 'b1-complaint',       level: 'B1', title: 'Making a complaint',                  setting: 'Store',      register: 'neutral',     keyLanguage: ['Nie jestem zadowolony/a', 'Chciałbym/Chciałabym zwrot', 'To nie jest to, co zamawiałem/am'] },
  { id: 'b1-opinions',        level: 'B1', title: 'Giving opinions about news',          setting: 'Social',     register: 'casual',      keyLanguage: ['Uważam, że...', 'Moim zdaniem...', 'Zgadzam się / Nie zgadzam się, bo...'] },
  { id: 'b1-trip',            level: 'B1', title: 'Making plans for a trip',             setting: 'Social',     register: 'casual',      keyLanguage: ['Moglibyśmy pojechać do...', 'Co myślisz?', 'Lepiej by było, gdyby...'] },

  // B2 — Nuanced Discussion
  { id: 'b2-debate',          level: 'B2', title: 'Debating a topic',                    setting: 'Academic',   register: 'neutral',     keyLanguage: ['Z jednej strony...', 'To zależy od...', 'Rozumiem twój punkt widzenia, ale...'] },
  { id: 'b2-negotiation',     level: 'B2', title: 'Negotiating (price, terms)',          setting: 'Business',   register: 'formal',      keyLanguage: ['Byłbym/Byłabym skłonny/a...', 'A gdybyśmy...', 'Mogę zaproponować...'] },
  { id: 'b2-movie',           level: 'B2', title: 'Discussing a movie or book',          setting: 'Social',     register: 'casual',      keyLanguage: ['Fabuła jest o...', 'To, co mnie uderzyło, to...', 'Przypomniało mi to...'] },
  { id: 'b2-advice',          level: 'B2', title: 'Giving advice',                       setting: 'Social',     register: 'casual',      keyLanguage: ['Na twoim miejscu...', 'Myślałeś/aś o...?', 'Może warto by było...'] },

  // C1 — Abstract & Professional
  { id: 'c1-abstract',        level: 'C1', title: 'Abstract discussion',                 setting: 'Academic',   register: 'formal',      keyLanguage: ['To stawia pytanie o...', 'Z szerszej perspektywy...'] },
  { id: 'c1-conflict',        level: 'C1', title: 'Conflict resolution at work',         setting: 'Office',     register: 'formal',      keyLanguage: ['Rozumiem Pana/Pani obawy', 'Poszukajmy kompromisu'] },
  { id: 'c1-persuasion',      level: 'C1', title: 'Persuasion',                          setting: 'Business',   register: 'formal',      keyLanguage: ['Jestem przekonany/a, że...', 'Proszę rozważyć konsekwencje', 'Dane wskazują, że...'] },
  { id: 'c1-cultural',        level: 'C1', title: 'Cultural comparison',                 setting: 'Social',     register: 'neutral',     keyLanguage: ['W mojej kulturze...', 'Fascynujące, jak...', 'Jest zasadnicza różnica...'] },

  // C2 — Mastery
  { id: 'c2-humor',           level: 'C2', title: 'Humor and sarcasm',                   setting: 'Social',     register: 'very_casual', keyLanguage: ['Ironia', 'Gra słów', 'Podwójne znaczenia', 'Humor absurdalny'] },
  { id: 'c2-disagreement',    level: 'C2', title: 'Nuanced disagreement',                setting: 'Academic',   register: 'formal',      keyLanguage: ['Rozumiem, co mówisz, ale nie zgadzam się w kwestii...', 'To trafna krytyka'] },
  { id: 'c2-literary',        level: 'C2', title: 'Literary discussion',                 setting: 'Academic',   register: 'formal',      keyLanguage: ['Podtekst sugeruje...', 'Autor posługuje się...', 'To stanowi paralelę z...'] },
  { id: 'c2-philosophy',      level: 'C2', title: 'Philosophical discussion',            setting: 'Academic',   register: 'formal',      keyLanguage: ['Można by argumentować...', 'Zależy, jak zdefiniujesz...', 'Paradoks polega na...'] },
];

const FUNCTIONAL_LANGUAGE = {
  agreeing: {
    A2: ['Tak, zgadza się.', 'Masz rację.'],
    B1: ['Myślę, że masz rację.', 'To dobry punkt.'],
    B2: ['Zdecydowanie.', 'Nie mógłbym/mogłabym się bardziej zgodzić.'],
    C1: ['Utożsamiam się z tym.', 'Całkowicie się zgadzam.'],
  },
  disagreeing: {
    A2: ['Nie zgadzam się.', 'Nie sądzę.'],
    B1: ['Nie jestem tego pewien/pewna.', 'Widzę to inaczej.'],
    B2: ['Rozumiem twój punkt widzenia, ale...', 'Powiedziałbym/Powiedziałabym, że...'],
    C1: ['Nie zgadzam się w tym punkcie.', 'Z całym szacunkiem, mam inne zdanie.'],
  },
  clarification: [
    'Przepraszam, czy możesz powtórzyć?',
    'Co masz na myśli, mówiąc...?',
    'Czy możesz podać przykład?',
    'Tylko żeby się upewnić — mówisz, że...?',
    'Nie jestem pewien/pewna, czy rozumiem — czy możesz wyjaśnić?',
  ],
  changingSubject: [
    'Przy okazji...',
    'To mi przypomina...',
    'Zmieniając temat...',
    'Chciałbym/Chciałabym przejść do...',
    'Skoro mowa o...',
  ],
  interrupting: [
    'Przepraszam, że przerywam, ale...',
    'Czy mogę coś powiedzieć?',
    'Jeśli mogę na chwilę...',
    'Zanim będziesz kontynuować...',
  ],
  uncertainty: [
    'Nie jestem pewien/pewna, ale wydaje mi się, że...',
    'Mogę się mylić, ale...',
    'O ile dobrze pamiętam...',
    'Powiedziałbym/Powiedziałabym, że prawdopodobnie...',
  ],
  softening: [
    'Chcę -> Chciałbym/Chciałabym',
    'Możesz -> Mógłbyś/Mogłabyś',
    'Musisz -> Powinieneś/Powinnaś',
    'Daj mi -> Czy mógłbyś/mogłabyś mi dać...',
  ],
};

const ERROR_CATEGORIES = [
  { id: 'case-errors',      label: 'Case errors',             example: '"Widzę pies" -> "Widzę psa"',                    levelFocus: 'A1+' },
  { id: 'gender',            label: 'Gender agreement',         example: '"Moja brat" -> "Mój brat"',                      levelFocus: 'A1+' },
  { id: 'aspect',            label: 'Aspect (perf/imperf)',     example: '"Wczoraj pisałem list (done)" -> "Napisałem list"', levelFocus: 'A2+' },
  { id: 'pan-pani',          label: 'Pan/Pani address',         example: '"Pan chcesz" -> "Pan chce"',                     levelFocus: 'A1+' },
  { id: 'word-order',        label: 'Unnatural word order',     example: '"Ja zawsze jem śniadanie" (overuse of pronoun)',  levelFocus: 'B1+' },
  { id: 'preposition-case',  label: 'Preposition + case',       example: '"w szkole" (loc) vs "do szkoły" (gen)',           levelFocus: 'A2+' },
  { id: 'reflexive',         label: 'Reflexive verbs',          example: '"Ja myję" -> "Myję się"',                        levelFocus: 'A2+' },
  { id: 'false-friends',     label: 'False friends',            example: '"aktualny" ≠ "actual" (means current)',           levelFocus: 'All' },
];

const REGISTERS = {
  very_casual: { label: 'Very Casual', addressForm: 'ty',         features: 'Slang, fragments, fillers, diminutives (chwilkę, kawka)' },
  casual:      { label: 'Casual',      addressForm: 'ty',         features: 'Informal, natural connectors, relaxed' },
  neutral:     { label: 'Neutral',     addressForm: 'Pan/Pani',   features: 'Polite, clear, standard grammar' },
  formal:      { label: 'Formal',      addressForm: 'Pan/Pani',   features: '3rd-person verb forms, formal vocabulary, structured' },
  very_formal: { label: 'Very Formal', addressForm: 'Państwo',    features: 'No slang, formal connectors, official Polish' },
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

  // ── Profile ─────────────────────────────────────────────────────────────

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

    // Pick a scenario at the student's level, preferring unseen ones
    const levelScenarios = SCENARIOS.filter(s => s.level === level);
    const seen = new Set(p.scenarioHistory.map(h => h.scenarioId));
    let candidates = levelScenarios.filter(s => !seen.has(s.id));
    if (candidates.length === 0) candidates = levelScenarios;
    const scenario = core.pick(candidates, 1)[0];

    const reg = REGISTERS[scenario.register] || REGISTERS.neutral;

    // Gather relevant functional language
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

    // Error categories relevant to this level
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
        { step: 2, name: 'Warm-up',     duration: '2 min', note: `Low-stakes small talk using Dzień dobry / Cześć` },
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

    // Track errors by category
    if (data.errors && data.errors.length) {
      for (const err of data.errors) {
        const cat = err.category || 'other';
        if (!p.errorTracking[cat]) p.errorTracking[cat] = { count: 0, recent: [] };
        p.errorTracking[cat].count++;
        p.errorTracking[cat].recent.push({ date: core.today(), detail: err.detail || '' });
        if (p.errorTracking[cat].recent.length > 10) p.errorTracking[cat].recent.shift();
      }
    }

    // Track functional skill usage
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
          'start <student> [level]':              'Create profile and generate first session',
          'session <student>':                     'Generate a new session for student',
          'scenario <student> <scenarioId>':       'Get full scenario details',
          'recap <student> <scenarioId> [json]':   'Record session results',
          'progress <student>':                    'View student progress',
          'report <student>':                      'Full student report with recommendations',
          'scenarios [level]':                     'List all scenarios, optionally filtered by level',
          'set-level <student> <level>':           'Set CEFR level (A1-C2)',
          'students':                              'List all student profiles',
        },
      });
  }
});
