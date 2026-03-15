#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

// ─── Embedded Data ──────────────────────────────────────────────────────────

const SCENARIOS = [
  // A1 — Survival Conversations
  { id: 'a1-greetings',       level: 'A1', title: 'Greeting & introducing yourself',     setting: 'Social',     register: 'neutral',     keyLanguage: ['Hola, me llamo...', 'Mucho gusto', 'Soy de...', '¿Y tú?'] },
  { id: 'a1-ordering',        level: 'A1', title: 'Ordering at a tapas bar / taquería',  setting: 'Restaurant', register: 'neutral',     keyLanguage: ['Quisiera...', 'Me pone...', 'La cuenta, por favor', '¿Qué me recomienda?'] },
  { id: 'a1-directions',      level: 'A1', title: 'Asking for directions in a city',     setting: 'Street',     register: 'neutral',     keyLanguage: ['¿Dónde está...?', 'A la derecha/izquierda', 'Todo recto', '¿Está lejos?'] },
  { id: 'a1-shopping',        level: 'A1', title: 'Shopping at a market',                setting: 'Mercado',    register: 'neutral',     keyLanguage: ['¿Cuánto cuesta?', 'Me llevo este', '¿Tiene más grande?', '¿Algo más barato?'] },

  // A2 — Daily Life Conversations
  { id: 'a2-plans',           level: 'A2', title: 'Making plans with a friend',          setting: 'Phone',      register: 'casual',      keyLanguage: ['¿Estás libre el...?', 'Quedamos a las...', '¿Qué te parece si...?'] },
  { id: 'a2-weekend',         level: 'A2', title: 'Describing your weekend',             setting: 'Social',     register: 'casual',      keyLanguage: ['Fui a...', 'Fue muy divertido', 'Jugamos...', 'Comimos...'] },
  { id: 'a2-doctor',          level: 'A2', title: 'At the doctor',                       setting: 'Clínica',    register: 'formal',      keyLanguage: ['Me duele...', '¿Desde cuándo?', 'Tiene que tomar...', 'Receta'] },
  { id: 'a2-hobbies',         level: 'A2', title: 'Talking about hobbies',               setting: 'Social',     register: 'casual',      keyLanguage: ['Me gusta...', 'En mi tiempo libre...', '¿Con qué frecuencia...?'] },

  // B1 — Opinions & Experiences
  { id: 'b1-interview',       level: 'B1', title: 'Job interview (basic)',               setting: 'Office',     register: 'formal',      keyLanguage: ['Tengo experiencia en...', 'Mis puntos fuertes son...', 'Me interesa...'] },
  { id: 'b1-complaint',       level: 'B1', title: 'Making a complaint',                  setting: 'Store',      register: 'neutral',     keyLanguage: ['No estoy satisfecho', 'Quisiera una devolución', 'Esto no es lo que pedí'] },
  { id: 'b1-opinions',        level: 'B1', title: 'Giving opinions about news',          setting: 'Social',     register: 'casual',      keyLanguage: ['Creo que...', 'En mi opinión...', 'Estoy de acuerdo/desacuerdo porque...'] },
  { id: 'b1-trip',            level: 'B1', title: 'Making plans for a trip',             setting: 'Social',     register: 'casual',      keyLanguage: ['Podríamos ir a...', '¿Qué te parece?', 'Sería mejor si...'] },

  // B2 — Nuanced Discussion
  { id: 'b2-debate',          level: 'B2', title: 'Debating a topic',                    setting: 'Academic',   register: 'neutral',     keyLanguage: ['Por un lado...', 'Depende de...', 'Entiendo tu punto, pero...'] },
  { id: 'b2-negotiation',     level: 'B2', title: 'Negotiating (price, terms)',          setting: 'Business',   register: 'formal',      keyLanguage: ['Estaría dispuesto a...', '¿Y si nosotros...?', 'Le puedo ofrecer...'] },
  { id: 'b2-movie',           level: 'B2', title: 'Discussing a movie or book',          setting: 'Social',     register: 'casual',      keyLanguage: ['La trama va de...', 'Lo que me impactó fue...', 'Me recordó a...'] },
  { id: 'b2-advice',          level: 'B2', title: 'Giving advice',                       setting: 'Social',     register: 'casual',      keyLanguage: ['Yo que tú...', '¿Has pensado en...?', 'Quizá te convenga...'] },

  // C1 — Abstract & Professional
  { id: 'c1-abstract',        level: 'C1', title: 'Abstract discussion',                 setting: 'Academic',   register: 'formal',      keyLanguage: ['Plantea la cuestión de...', 'Desde una perspectiva más amplia...'] },
  { id: 'c1-conflict',        level: 'C1', title: 'Conflict resolution at work',         setting: 'Office',     register: 'formal',      keyLanguage: ['Entiendo tu preocupación', 'Busquemos un punto intermedio'] },
  { id: 'c1-persuasion',      level: 'C1', title: 'Persuasion',                          setting: 'Business',   register: 'formal',      keyLanguage: ['Estoy convencido de que...', 'Considera las implicaciones', 'Los datos sugieren...'] },
  { id: 'c1-cultural',        level: 'C1', title: 'Cultural comparison',                 setting: 'Social',     register: 'neutral',     keyLanguage: ['En mi cultura...', 'Es fascinante cómo...', 'Hay una diferencia fundamental...'] },

  // C2 — Mastery
  { id: 'c2-humor',           level: 'C2', title: 'Humor and sarcasm',                   setting: 'Social',     register: 'very_casual', keyLanguage: ['Irony', 'Wordplay', 'Double meanings', 'Regional humor'] },
  { id: 'c2-disagreement',    level: 'C2', title: 'Nuanced disagreement',                setting: 'Academic',   register: 'formal',      keyLanguage: ['Entiendo lo que dices, pero discrepo en...', 'Es una crítica válida'] },
  { id: 'c2-literary',        level: 'C2', title: 'Literary discussion',                 setting: 'Academic',   register: 'formal',      keyLanguage: ['El subtexto sugiere...', 'El uso del autor de...', 'Esto es un paralelo con...'] },
  { id: 'c2-philosophy',      level: 'C2', title: 'Philosophical discussion',            setting: 'Academic',   register: 'formal',      keyLanguage: ['Se podria argumentar...', 'Depende de cómo definas...', 'La paradoja es...'] },
];

const FUNCTIONAL_LANGUAGE = {
  agreeing: {
    A2: ['Sí, de acuerdo.', 'Tienes razón.'],
    B1: ['Creo que tienes razón.', 'Es un buen punto.'],
    B2: ['Totalmente.', 'No podría estar más de acuerdo.'],
    C1: ['Me identifico con eso.', 'Estoy completamente de acuerdo.'],
  },
  disagreeing: {
    A2: ['No estoy de acuerdo.', 'No creo.'],
    B1: ['No estoy seguro de eso.', 'Lo veo diferente.'],
    B2: ['Entiendo tu punto, pero...', 'Yo diría que...'],
    C1: ['Discrepo en ese punto.', 'Con todo respeto, no opino igual.'],
  },
  clarification: [
    '¿Perdona, puedes repetir?',
    '¿Qué quieres decir con...?',
    '¿Me puedes dar un ejemplo?',
    '¿Solo para asegurarme — dices que...?',
    '¿No estoy seguro de entender — me lo puedes explicar?',
  ],
  changingSubject: [
    'Por cierto...',
    'Eso me recuerda...',
    'Cambiando de tema...',
    'Me gustaría pasar a...',
    'Hablando de...',
  ],
  interrupting: [
    'Perdona que te interrumpa, pero...',
    '¿Puedo decir algo?',
    'Si me permites un momento...',
    'Antes de que sigas...',
  ],
  uncertainty: [
    'No estoy seguro, pero creo que...',
    'A lo mejor me equivoco, pero...',
    'Si no me falla la memoria...',
    'Yo diría que probablemente...',
  ],
  softening: [
    'Quiero -> Querría / Me gustaría',
    'Puedes -> Podrías',
    'Debes -> Deberías',
    'Tienes que -> Tendrías que',
  ],
};

const ERROR_CATEGORIES = [
  { id: 'ser-estar',       label: 'Ser/Estar',            example: '"Soy aburrido" -> "Estoy aburrido"',               levelFocus: 'B1+' },
  { id: 'gender',          label: 'Gender agreement',      example: '"La problema" -> "El problema"',                    levelFocus: 'A2+' },
  { id: 'subjunctive',     label: 'Subjunctive',           example: '"Espero que vienes" -> "Espero que vengas"',        levelFocus: 'B1+' },
  { id: 'por-para',        label: 'Por/Para',              example: '"Estudio por ser doctor" -> "Estudio para ser doctor"', levelFocus: 'B1+' },
  { id: 'pret-imperf',     label: 'Preterite/Imperfect',   example: '"Ayer llovio cuando sali" -> "Ayer llovia cuando sali"', levelFocus: 'B1+' },
  { id: 'object-pronouns', label: 'Object pronouns',       example: '"Yo vi a ella" -> "La vi"',                         levelFocus: 'A2+' },
  { id: 'reflexive',       label: 'Reflexive verbs',       example: '"Yo levanto a las 8" -> "Me levanto a las 8"',      levelFocus: 'A2+' },
  { id: 'false-friends',   label: 'False friends',         example: '"Estoy embarazado" -> "Estoy avergonzado"',         levelFocus: 'All' },
];

const REGIONAL_VARIANTS = {
  spain: {
    label: 'Spain (Peninsular)',
    informalYou: 'tú',
    pluralYou: 'vosotros',
    pastPreference: 'present perfect',
    greeting: '¿Qué tal?',
    slangCool: 'mola / guay',
    bus: 'autobús',
    computer: 'ordenador',
    apartment: 'piso',
    culturalNotes: [
      'Two cheek kisses for greetings (women/mixed), handshake (men)',
      'Tu is default among people under 40',
      'Dry humor, irony, playful insults among friends',
      'Complaining about politicians is universal bonding',
    ],
  },
  mexico: {
    label: 'México',
    informalYou: 'tú',
    pluralYou: 'ustedes',
    pastPreference: 'preterite',
    greeting: '¿Qué onda?',
    slangCool: 'chido / padre',
    bus: 'camión',
    computer: 'computadora',
    apartment: 'departamento',
    culturalNotes: [
      'One cheek kiss for greetings (women/mixed), handshake (men)',
      'Diminutives used extensively: momentito, cafecito, ahorita',
      'Wordplay and albures (double entendres) in humor',
      '"Ahorita" can mean right now, in a moment, or later today',
    ],
  },
  argentina: {
    label: 'Argentina',
    informalYou: 'vos',
    pluralYou: 'ustedes',
    pastPreference: 'preterite',
    greeting: 'Que haces?',
    slangCool: 'copado / piola',
    bus: 'colectivo / bondi',
    computer: 'computadora',
    apartment: 'departamento',
    culturalNotes: [
      'One cheek kiss for everyone, including between men',
      'Vos replaces tu entirely — using tu sounds foreign/pretentious',
      'Sharp wit, irony, Italian-influenced expressiveness',
      'Mate is a social ritual, not just a beverage',
    ],
  },
  colombia: {
    label: 'Colombia',
    informalYou: 'tu (but usted common even among friends)',
    pluralYou: 'ustedes',
    pastPreference: 'preterite',
    greeting: '¿Qué más?',
    slangCool: 'chevere / bacano',
    bus: 'bus',
    computer: 'computador',
    apartment: 'apartamento',
    culturalNotes: [
      'One cheek kiss for greetings (women/mixed), handshake (men)',
      'Usted used even between close friends in Bogota',
      'Warm humor, storytelling, exaggeration for comic effect',
      'More indirect communication style than Peninsular Spanish',
    ],
  },
};

const REGISTERS = {
  very_casual: { label: 'Very Casual', addressForm: 'tú/vos',  features: 'Slang, fragments, fillers, diminutives' },
  casual:      { label: 'Casual',      addressForm: 'tu',       features: 'Contractions, natural connectors, relaxed' },
  neutral:     { label: 'Neutral',     addressForm: 'usted',    features: 'Polite, clear, standard grammar' },
  formal:      { label: 'Formal',      addressForm: 'usted',    features: 'Full verb forms, formal vocabulary, structured' },
  very_formal: { label: 'Very Formal', addressForm: 'usted/ustedes', features: 'No slang, formal connectors, precise register' },
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
    this.dir = core.dataDir('spanish-conversation');
    core.ensureDir(this.dir);
  }

  // ── Profile ─────────────────────────────────────────────────────────────

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.level) p.level = 'A1';
    if (!p.variant) p.variant = 'spain';
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

  setVariant(studentId, variant) {
    if (!REGIONAL_VARIANTS[variant]) throw new Error(`Invalid variant: ${variant}. Must be one of: ${Object.keys(REGIONAL_VARIANTS).join(', ')}`);
    const p = this.getProfile(studentId);
    p.variant = variant;
    this._save(p);
    const v = REGIONAL_VARIANTS[variant];
    return { studentId, variant, label: v.label, informalYou: v.informalYou, greeting: v.greeting, culturalNotes: v.culturalNotes };
  }

  // ── Session Generation ──────────────────────────────────────────────────

  generateSession(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level;
    const variant = p.variant || 'spain';

    // Pick a scenario at the student's level, preferring unseen ones
    const levelScenarios = SCENARIOS.filter(s => s.level === level);
    const seen = new Set(p.scenarioHistory.map(h => h.scenarioId));
    let candidates = levelScenarios.filter(s => !seen.has(s.id));
    if (candidates.length === 0) candidates = levelScenarios;
    const scenario = core.pick(candidates, 1)[0];

    const reg = REGISTERS[scenario.register] || REGISTERS.neutral;
    const regionData = REGIONAL_VARIANTS[variant];

    // Gather relevant functional language
    const levelIdx = core.CEFR.indexOf(level);
    const funcLang = {};
    for (const [cat, levels] of Object.entries(FUNCTIONAL_LANGUAGE)) {
      if (typeof levels === 'object' && !Array.isArray(levels)) {
        // Level-keyed
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
      variant,
      scenario: {
        id: scenario.id,
        title: scenario.title,
        setting: scenario.setting,
        register: reg.label,
        addressForm: reg.addressForm,
        keyLanguage: scenario.keyLanguage,
      },
      region: {
        label: regionData.label,
        greeting: regionData.greeting,
        informalYou: regionData.informalYou,
        slangCool: regionData.slangCool,
      },
      cafPriority: CAF_PRIORITIES[level],
      correctionTechniques: CORRECTION_TECHNIQUES[level],
      functionalLanguage: funcLang,
      errorFocus: errorFocus.map(e => ({ id: e.id, label: e.label, example: e.example })),
      sessionFlow: [
        { step: 1, name: 'Setup',       duration: '2 min', note: `Scenario: ${scenario.title}, Region: ${regionData.label}, Register: ${reg.label}` },
        { step: 2, name: 'Warm-up',     duration: '2 min', note: `Low-stakes small talk using ${regionData.greeting}` },
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
      variant: p.variant,
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

    // Sessions by level
    const byLevel = {};
    for (const s of sessions) {
      byLevel[s.level] = (byLevel[s.level] || 0) + 1;
    }

    // Error patterns
    const errorSummary = {};
    for (const [cat, data] of Object.entries(p.errorTracking || {})) {
      const catInfo = ERROR_CATEGORIES.find(e => e.id === cat);
      errorSummary[cat] = {
        label: catInfo ? catInfo.label : cat,
        totalErrors: data.count,
        recentCount: data.recent.length,
      };
    }

    // Scenarios completed
    const scenariosCompleted = [...new Set((p.scenarioHistory || []).map(h => h.scenarioId))];

    // Mastery from scored sessions
    const scored = sessions.filter(s => s.score != null && s.total != null && s.total > 0);
    const mastery = core.calcMastery(scored.map(s => ({ score: s.score, total: s.total })));

    // Functional skills
    const funcSkills = p.functionalSkills || {};

    return {
      studentId,
      level: p.level,
      variant: p.variant,
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

    // Suggest scenarios not yet attempted
    const seen = new Set((p.scenarioHistory || []).map(h => h.scenarioId));
    const unseen = SCENARIOS.filter(s => s.level === level && !seen.has(s.id));
    if (unseen.length) {
      topics.push({ type: 'scenario', message: `${unseen.length} unseen scenario(s) at ${level}`, items: unseen.map(s => s.title) });
    }

    // Suggest error focus areas
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

    // Suggest functional skills not yet practiced
    const practiced = new Set(Object.keys(p.functionalSkills || {}));
    const allFuncCategories = Object.keys(FUNCTIONAL_LANGUAGE);
    const unpracticed = allFuncCategories.filter(c => !practiced.has(c));
    if (unpracticed.length) {
      topics.push({ type: 'functional_language', message: 'Functional language areas to practice', items: unpracticed });
    }

    // Suggest level advancement
    const sessions = (p.sessions || []).filter(s => s.level === level);
    if (sessions.length >= 6) {
      const levelIdx = core.CEFR.indexOf(level);
      if (levelIdx < core.CEFR.length - 1) {
        topics.push({ type: 'level_up', message: `Consider advancing to ${core.CEFR[levelIdx + 1]} (${sessions.length} sessions completed at ${level})` });
      }
    }

    return { studentId, level, variant: p.variant, recommendations: topics };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const next = this.getNextTopics(studentId);
    const variant = REGIONAL_VARIANTS[p.variant || 'spain'];

    // Recent sessions
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
      variant: { key: p.variant, label: variant.label },
      createdAt: p.createdAt,
      progress,
      recentSessions,
      recommendations: next.recommendations,
      regionalInfo: {
        greeting: variant.greeting,
        informalYou: variant.informalYou,
        culturalNotes: variant.culturalNotes,
      },
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
      const variant = args[3] || 'spain';
      tutor.setLevel(sid, level);
      tutor.setVariant(sid, variant);
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
      // Record a session result. Expects JSON on args[2] or minimal data.
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

    case 'set-variant': {
      const variant = args[2];
      if (!variant) throw new Error('Usage: set-variant <studentId> <variant>');
      out(tutor.setVariant(sid, variant));
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
          'start <student> [level] [variant]': 'Create profile and generate first session',
          'session <student>':                  'Generate a new session for student',
          'scenario <student> <scenarioId>':    'Get full scenario details',
          'recap <student> <scenarioId> [json]':'Record session results',
          'progress <student>':                 'View student progress',
          'report <student>':                   'Full student report with recommendations',
          'scenarios [level]':                  'List all scenarios, optionally filtered by level',
          'set-level <student> <level>':        'Set CEFR level (A1-C2)',
          'set-variant <student> <variant>':    'Set regional variant (spain/mexico/argentina/colombia)',
          'students':                           'List all student profiles',
        },
      });
  }
});
