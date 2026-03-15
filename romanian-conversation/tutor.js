#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

// ─── Embedded Data ──────────────────────────────────────────────────────────

const LANG = 'romanian';
const SKILL_NAME = 'romanian-conversation';

const SCENARIOS = [
  // A1 — Survival Conversations
  { id: 'a1-greetings',       level: 'A1', title: 'Greeting & introducing yourself',     setting: 'Social',     register: 'neutral',     keyLanguage: ['Bună ziua, mă numesc...', 'Încântat de cunoștință', 'Sunt din...', 'Tu de unde ești?'] },
  { id: 'a1-ordering',        level: 'A1', title: 'Ordering at a Romanian restaurant',   setting: 'Restaurant', register: 'neutral',     keyLanguage: ['Aș vrea...', 'Meniul, vă rog', 'Nota, vă rog', 'Ce ne recomandați?'] },
  { id: 'a1-directions',      level: 'A1', title: 'Asking for directions in a city',     setting: 'Street',     register: 'neutral',     keyLanguage: ['Unde este...?', 'La stânga/dreapta', 'Drept înainte', 'E departe?'] },
  { id: 'a1-shopping',        level: 'A1', title: 'Shopping at the market (piață)',       setting: 'Piață',      register: 'neutral',     keyLanguage: ['Cât costă?', 'Dați-mi vă rog...', 'Un kilogram de...', 'Aveți ceva mai ieftin?'] },

  // A2 — Daily Life Conversations
  { id: 'a2-plans',           level: 'A2', title: 'Making plans with a friend',          setting: 'Phone',      register: 'casual',      keyLanguage: ['Ești liber(ă) sâmbătă?', 'Ne vedem la...', 'Ce zici să...?'] },
  { id: 'a2-weekend',         level: 'A2', title: 'Describing your weekend',             setting: 'Social',     register: 'casual',      keyLanguage: ['Am fost la...', 'A fost foarte distractiv', 'Am jucat...', 'Am mâncat...'] },
  { id: 'a2-doctor',          level: 'A2', title: 'At the doctor',                       setting: 'Clinică',    register: 'formal',      keyLanguage: ['Mă doare...', 'De când?', 'Trebuie să luați...', 'Rețetă'] },
  { id: 'a2-hobbies',         level: 'A2', title: 'Talking about hobbies',               setting: 'Social',     register: 'casual',      keyLanguage: ['Îmi place să...', 'În timpul liber...', 'Cât de des...?'] },

  // B1 — Opinions & Experiences
  { id: 'b1-interview',       level: 'B1', title: 'Job interview (basic)',               setting: 'Office',     register: 'formal',      keyLanguage: ['Am experiență în...', 'Punctele mele forte sunt...', 'Mă interesează...'] },
  { id: 'b1-complaint',       level: 'B1', title: 'Making a complaint',                  setting: 'Store',      register: 'neutral',     keyLanguage: ['Nu sunt mulțumit', 'Aș dori o returnare', 'Nu este ceea ce am comandat'] },
  { id: 'b1-opinions',        level: 'B1', title: 'Giving opinions about news',          setting: 'Social',     register: 'casual',      keyLanguage: ['Cred că...', 'Din punctul meu de vedere...', 'Sunt de acord/nu sunt de acord pentru că...'] },
  { id: 'b1-trip',            level: 'B1', title: 'Planning a trip to Romania',           setting: 'Social',     register: 'casual',      keyLanguage: ['Am putea merge la...', 'Ce zici?', 'Ar fi mai bine dacă...'] },

  // B2 — Nuanced Discussion
  { id: 'b2-debate',          level: 'B2', title: 'Debating a topic',                    setting: 'Academic',   register: 'neutral',     keyLanguage: ['Pe de o parte...', 'Depinde de...', 'Înțeleg ce spui, dar...'] },
  { id: 'b2-negotiation',     level: 'B2', title: 'Negotiating (price, terms)',          setting: 'Business',   register: 'formal',      keyLanguage: ['Aș fi dispus să...', 'Și dacă noi...', 'Vă pot oferi...'] },
  { id: 'b2-movie',           level: 'B2', title: 'Discussing a movie or book',          setting: 'Social',     register: 'casual',      keyLanguage: ['Acțiunea e despre...', 'Ce m-a impresionat a fost...', 'Mi-a amintit de...'] },
  { id: 'b2-advice',          level: 'B2', title: 'Giving advice',                       setting: 'Social',     register: 'casual',      keyLanguage: ['Dacă aș fi în locul tău...', 'Te-ai gândit la...?', 'Poate ți-ar conveni să...'] },

  // C1 — Abstract & Professional
  { id: 'c1-abstract',        level: 'C1', title: 'Abstract discussion',                 setting: 'Academic',   register: 'formal',      keyLanguage: ['Ridică problema...', 'Dintr-o perspectivă mai largă...'] },
  { id: 'c1-conflict',        level: 'C1', title: 'Conflict resolution at work',         setting: 'Office',     register: 'formal',      keyLanguage: ['Înțeleg preocuparea ta', 'Să căutăm un punct de mijloc'] },
  { id: 'c1-persuasion',      level: 'C1', title: 'Persuasion',                          setting: 'Business',   register: 'formal',      keyLanguage: ['Sunt convins că...', 'Ia în considerare implicațiile', 'Datele sugerează...'] },
  { id: 'c1-cultural',        level: 'C1', title: 'Cultural comparison',                 setting: 'Social',     register: 'neutral',     keyLanguage: ['În cultura mea...', 'E fascinant cum...', 'Există o diferență fundamentală...'] },

  // C2 — Mastery
  { id: 'c2-humor',           level: 'C2', title: 'Humor and sarcasm',                   setting: 'Social',     register: 'very_casual', keyLanguage: ['Ironie', 'Jocuri de cuvinte', 'Sensuri duble', 'Umor regional'] },
  { id: 'c2-disagreement',    level: 'C2', title: 'Nuanced disagreement',                setting: 'Academic',   register: 'formal',      keyLanguage: ['Înțeleg ce spui, dar nu sunt de acord în privința...', 'E o critică validă'] },
  { id: 'c2-literary',        level: 'C2', title: 'Literary discussion',                 setting: 'Academic',   register: 'formal',      keyLanguage: ['Subtextul sugerează...', 'Utilizarea de către autor a...', 'Aceasta e o paralelă cu...'] },
  { id: 'c2-philosophy',      level: 'C2', title: 'Philosophical discussion',            setting: 'Academic',   register: 'formal',      keyLanguage: ['S-ar putea argumenta...', 'Depinde de cum definești...', 'Paradoxul este...'] },
];

const FUNCTIONAL_LANGUAGE = {
  agreeing: {
    A2: ['Da, de acord.', 'Ai dreptate.'],
    B1: ['Cred că ai dreptate.', 'E un punct bun.'],
    B2: ['Absolut.', 'Nu aș putea fi mai de acord.'],
    C1: ['Mă regăsesc în asta.', 'Sunt pe deplin de acord.'],
  },
  disagreeing: {
    A2: ['Nu sunt de acord.', 'Nu cred.'],
    B1: ['Nu sunt sigur(ă) de asta.', 'Eu văd altfel.'],
    B2: ['Înțeleg punctul tău de vedere, dar...', 'Eu aș spune că...'],
    C1: ['Nu sunt de acord în acel punct.', 'Cu tot respectul, am altă părere.'],
  },
  clarification: [
    'Scuză-mă, poți repeta?',
    'Ce vrei să spui cu...?',
    'Poți să-mi dai un exemplu?',
    'Doar ca să mă asigur — spui că...?',
    'Nu sunt sigur(ă) că înțeleg — poți să-mi explici?',
  ],
  changingSubject: [
    'Apropo...',
    'Asta îmi aduce aminte de...',
    'Schimbând subiectul...',
    'Aș vrea să trec la...',
    'Vorbind despre...',
  ],
  interrupting: [
    'Scuză-mă că te întrerup, dar...',
    'Pot să spun ceva?',
    'Dacă îmi permiți un moment...',
    'Înainte să continui...',
  ],
  uncertainty: [
    'Nu sunt sigur(ă), dar cred că...',
    'Poate mă înșel, dar...',
    'Dacă nu mă înșeală memoria...',
    'Aș zice că probabil...',
  ],
  softening: [
    'Vreau -> Aș vrea / Mi-ar plăcea',
    'Poți -> Ai putea',
    'Trebuie -> Ar trebui',
    'E necesar -> Ar fi bine',
  ],
};

const ERROR_CATEGORIES = [
  { id: 'gender',          label: 'Gender (3 genders)',     example: '"un carte" -> "o carte"',                          levelFocus: 'A2+' },
  { id: 'case-form',       label: 'Case forms',             example: '"cartea profesoru" -> "cartea profesorului"',      levelFocus: 'A2+' },
  { id: 'subjunctive',     label: 'Subjunctive with să',    example: '"vreau că merg" -> "vreau să merg"',              levelFocus: 'B1+' },
  { id: 'def-article',     label: 'Definite article suffix',example: '"profesorul bun" vs "un profesor bun"',           levelFocus: 'A1+' },
  { id: 'agreement',       label: 'Agreement',              example: '"casa frumos" -> "casa frumoasă"',                levelFocus: 'A2+' },
  { id: 'pronoun-clitics', label: 'Pronoun clitics',        example: '"Eu văd pe el" -> "Îl văd pe el"',               levelFocus: 'B1+' },
  { id: 'pe-animate',      label: 'Pe + animate objects',   example: '"Văd Maria" -> "O văd pe Maria"',                levelFocus: 'A2+' },
  { id: 'false-friends',   label: 'False friends',          example: '"eventual" (possibly) ≠ "eventually"',           levelFocus: 'All' },
];

const REGISTERS = {
  very_casual: { label: 'Very Casual', addressForm: 'tu',            features: 'Slang, particles (păi, deci, mă/bă), diminutives, fragments' },
  casual:      { label: 'Casual',      addressForm: 'tu',            features: 'Particles, natural connectors, diminutives, relaxed' },
  neutral:     { label: 'Neutral',     addressForm: 'dumneavoastră', features: 'Polite, clear, standard grammar' },
  formal:      { label: 'Formal',      addressForm: 'dumneavoastră', features: 'Full verb forms, formal vocabulary, structured' },
  very_formal: { label: 'Very Formal', addressForm: 'dumneavoastră', features: 'No slang, formal connectors, precise register, impersonal constructions' },
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
        { step: 2, name: 'Warm-up',     duration: '2 min', note: `Low-stakes small talk: "Ce mai faci? Ce ai mai făcut?"` },
        { step: 3, name: 'Conversation', duration: '10-12 min', note: 'Role-play with communicative goals' },
        { step: 4, name: 'Recap',       duration: '4 min', note: 'Corrections, vocabulary, emergent language' },
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
          'start <student> [level]':           'Create profile and generate first session',
          'session <student>':                  'Generate a new session for student',
          'scenario <student> <scenarioId>':    'Get full scenario details',
          'recap <student> <scenarioId> [json]':'Record session results',
          'progress <student>':                 'View student progress',
          'report <student>':                   'Full student report with recommendations',
          'scenarios [level]':                  'List all scenarios, optionally filtered by level',
          'set-level <student> <level>':        'Set CEFR level (A1-C2)',
          'students':                           'List all student profiles',
        },
      });
  }
});
