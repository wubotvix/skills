#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const LANG = 'french';
const SKILL_NAME = 'french-conversation';

// ─── Embedded Data ──────────────────────────────────────────────────────────

const SCENARIOS = [
  // A1 — Survival Conversations
  { id: 'a1-greetings',       level: 'A1', title: 'Greeting & introducing yourself',     setting: 'Social',     register: 'neutral',     keyLanguage: ['Bonjour, je m\'appelle...', 'Enchanté(e)', 'Je suis de...', 'Et vous ?'] },
  { id: 'a1-ordering',        level: 'A1', title: 'Ordering at a café / brasserie',      setting: 'Café',       register: 'neutral',     keyLanguage: ['Je voudrais...', 'Un café, s\'il vous plaît', 'L\'addition, s\'il vous plaît', 'Qu\'est-ce que vous recommandez ?'] },
  { id: 'a1-directions',      level: 'A1', title: 'Asking for directions in a city',     setting: 'Street',     register: 'neutral',     keyLanguage: ['Où est... ?', 'À droite / à gauche', 'Tout droit', 'C\'est loin ?'] },
  { id: 'a1-shopping',        level: 'A1', title: 'Shopping at a marché',                setting: 'Marché',     register: 'neutral',     keyLanguage: ['Combien ça coûte ?', 'Je prends celui-ci', 'Vous avez plus grand ?', 'Moins cher ?'] },

  // A2 — Daily Life Conversations
  { id: 'a2-plans',           level: 'A2', title: 'Making plans with a friend',          setting: 'Phone',      register: 'casual',      keyLanguage: ['Tu es libre le... ?', 'On se retrouve à...', 'Qu\'est-ce que tu en penses ?'] },
  { id: 'a2-weekend',         level: 'A2', title: 'Describing your weekend',             setting: 'Social',     register: 'casual',      keyLanguage: ['Je suis allé(e) à...', 'C\'était super', 'On a joué...', 'On a mangé...'] },
  { id: 'a2-doctor',          level: 'A2', title: 'At the doctor',                       setting: 'Cabinet',    register: 'formal',      keyLanguage: ['J\'ai mal à...', 'Depuis quand ?', 'Il faut prendre...', 'Ordonnance'] },
  { id: 'a2-hobbies',         level: 'A2', title: 'Talking about hobbies',               setting: 'Social',     register: 'casual',      keyLanguage: ['J\'aime...', 'Pendant mon temps libre...', 'À quelle fréquence... ?'] },

  // B1 — Opinions & Experiences
  { id: 'b1-interview',       level: 'B1', title: 'Job interview (basic)',               setting: 'Office',     register: 'formal',      keyLanguage: ['J\'ai de l\'expérience en...', 'Mes points forts sont...', 'Je m\'intéresse à...'] },
  { id: 'b1-complaint',       level: 'B1', title: 'Making a complaint',                  setting: 'Store',      register: 'neutral',     keyLanguage: ['Je ne suis pas satisfait(e)', 'Je voudrais un remboursement', 'Ce n\'est pas ce que j\'ai commandé'] },
  { id: 'b1-opinions',        level: 'B1', title: 'Giving opinions about news',          setting: 'Social',     register: 'casual',      keyLanguage: ['Je pense que...', 'À mon avis...', 'Je suis d\'accord / pas d\'accord parce que...'] },
  { id: 'b1-trip',            level: 'B1', title: 'Making plans for a trip',             setting: 'Social',     register: 'casual',      keyLanguage: ['On pourrait aller à...', 'Qu\'est-ce que tu en penses ?', 'Ce serait mieux si...'] },

  // B2 — Nuanced Discussion
  { id: 'b2-debate',          level: 'B2', title: 'Debating a topic',                    setting: 'Academic',   register: 'neutral',     keyLanguage: ['D\'un côté...', 'Ça dépend de...', 'Je comprends ton point de vue, mais...'] },
  { id: 'b2-negotiation',     level: 'B2', title: 'Negotiating (price, terms)',          setting: 'Business',   register: 'formal',      keyLanguage: ['Je serais disposé(e) à...', 'Et si nous...', 'Je peux vous proposer...'] },
  { id: 'b2-movie',           level: 'B2', title: 'Discussing a movie or book',          setting: 'Social',     register: 'casual',      keyLanguage: ['L\'intrigue porte sur...', 'Ce qui m\'a frappé, c\'est...', 'Ça m\'a rappelé...'] },
  { id: 'b2-advice',          level: 'B2', title: 'Giving advice',                       setting: 'Social',     register: 'casual',      keyLanguage: ['À ta place, je...', 'Tu as pensé à... ?', 'Tu devrais peut-être...'] },

  // C1 — Abstract & Professional
  { id: 'c1-abstract',        level: 'C1', title: 'Abstract discussion',                 setting: 'Academic',   register: 'formal',      keyLanguage: ['Cela soulève la question de...', 'D\'un point de vue plus large...'] },
  { id: 'c1-conflict',        level: 'C1', title: 'Conflict resolution at work',         setting: 'Office',     register: 'formal',      keyLanguage: ['Je comprends votre préoccupation', 'Cherchons un compromis'] },
  { id: 'c1-persuasion',      level: 'C1', title: 'Persuasion',                          setting: 'Business',   register: 'formal',      keyLanguage: ['Je suis convaincu(e) que...', 'Considérez les implications', 'Les données suggèrent que...'] },
  { id: 'c1-cultural',        level: 'C1', title: 'Cultural comparison',                 setting: 'Social',     register: 'neutral',     keyLanguage: ['Dans ma culture...', 'C\'est fascinant comme...', 'Il y a une différence fondamentale...'] },

  // C2 — Mastery
  { id: 'c2-humor',           level: 'C2', title: 'Humor and sarcasm',                   setting: 'Social',     register: 'very_casual', keyLanguage: ['Ironie', 'Jeux de mots', 'Double sens', 'Humour noir'] },
  { id: 'c2-disagreement',    level: 'C2', title: 'Nuanced disagreement',                setting: 'Academic',   register: 'formal',      keyLanguage: ['Je vois ce que vous dites, mais je ne suis pas du même avis sur...', 'C\'est une critique valable'] },
  { id: 'c2-literary',        level: 'C2', title: 'Literary discussion',                 setting: 'Academic',   register: 'formal',      keyLanguage: ['Le sous-texte suggère...', 'L\'emploi de... par l\'auteur', 'Cela fait écho à...'] },
  { id: 'c2-philosophy',      level: 'C2', title: 'Philosophical discussion',            setting: 'Academic',   register: 'formal',      keyLanguage: ['On pourrait arguer que...', 'Cela dépend de la définition de...', 'Le paradoxe, c\'est que...'] },
];

const FUNCTIONAL_LANGUAGE = {
  agreeing: {
    A2: ['Oui, d\'accord.', 'Tu as raison.'],
    B1: ['Je pense que tu as raison.', 'C\'est un bon argument.'],
    B2: ['Tout à fait.', 'Je ne pourrais pas être plus d\'accord.'],
    C1: ['Je me retrouve là-dedans.', 'Je suis entièrement d\'accord.'],
  },
  disagreeing: {
    A2: ['Je ne suis pas d\'accord.', 'Je ne crois pas.'],
    B1: ['Je n\'en suis pas sûr(e).', 'Je le vois autrement.'],
    B2: ['Je comprends ton point de vue, mais...', 'Je dirais plutôt que...'],
    C1: ['Je ne suis pas du même avis sur ce point.', 'Avec tout le respect que je vous dois, je ne partage pas cet avis.'],
  },
  clarification: [
    'Pardon, vous pouvez répéter ?',
    'Qu\'est-ce que vous voulez dire par... ?',
    'Vous pouvez me donner un exemple ?',
    'Juste pour être sûr(e) — vous dites que... ?',
    'Je ne suis pas sûr(e) de comprendre — vous pouvez m\'expliquer ?',
  ],
  changingSubject: [
    'Au fait...',
    'Ça me rappelle...',
    'En parlant de...',
    'Je voudrais passer à...',
    'À propos de...',
  ],
  interrupting: [
    'Excuse-moi de t\'interrompre, mais...',
    'Je peux dire quelque chose ?',
    'Si vous permettez un instant...',
    'Avant que tu continues...',
  ],
  uncertainty: [
    'Je ne suis pas sûr(e), mais je crois que...',
    'Je me trompe peut-être, mais...',
    'Si ma mémoire est bonne...',
    'Je dirais que probablement...',
  ],
  softening: [
    'Je veux -> Je voudrais / J\'aimerais',
    'Tu peux -> Tu pourrais / Pourriez-vous',
    'Tu dois -> Tu devrais',
    'Il faut -> Il faudrait',
  ],
};

const ERROR_CATEGORIES = [
  { id: 'gender',          label: 'Gender agreement',      example: '"Le problème" -> "Le problème" (OK) / "La table" not "Le table"', levelFocus: 'A2+' },
  { id: 'auxiliary',        label: 'Auxiliary choice',       example: '"J\'ai allé" -> "Je suis allé"',                    levelFocus: 'A2+' },
  { id: 'prepositions',     label: 'Prepositions',           example: '"Je pense à" not "Je pense de"',                    levelFocus: 'B1+' },
  { id: 'subjunctive',      label: 'Subjunctive',            example: '"Il faut que tu viens" -> "Il faut que tu viennes"', levelFocus: 'B1+' },
  { id: 'pc-imparfait',     label: 'Passé composé/Imparfait', example: '"Hier il pleuvait quand je suis sorti"',           levelFocus: 'B1+' },
  { id: 'pronouns',         label: 'Pronoun placement',      example: '"Je lui ai dit" not "J\'ai dit lui"',               levelFocus: 'A2+' },
  { id: 'partitive',        label: 'Partitive articles',     example: '"Je mange du pain" not "Je mange de pain"',         levelFocus: 'A1+' },
  { id: 'false-friends',    label: 'False friends',          example: '"Je suis excité" ≠ I\'m excited (use "enthousiaste")', levelFocus: 'All' },
];

const REGIONAL_VARIANTS = {
  france: {
    label: 'France (Metropolitan)',
    informalYou: 'tu',
    formalYou: 'vous',
    pastPreference: 'passé composé',
    greeting: 'Salut ! / Bonjour !',
    slangCool: 'cool / génial / trop bien',
    bus: 'bus',
    computer: 'ordinateur',
    apartment: 'appartement',
    culturalNotes: [
      'La bise (cheek kiss) varies by region: 1-4 kisses',
      'Vous is default with strangers, tu with friends/family',
      'Dry humor, irony, complaining is a social bonding activity',
      'Never skip bonjour/au revoir — omitting greetings is rude',
    ],
  },
  quebec: {
    label: 'Quebec (Canadian French)',
    informalYou: 'tu',
    formalYou: 'vous',
    pastPreference: 'passé composé',
    greeting: 'Salut ! / Allô !',
    slangCool: 'cool / le fun / écoeurant (positive)',
    bus: 'autobus',
    computer: 'ordinateur',
    apartment: 'appartement',
    culturalNotes: [
      'Tu is more commonly used than in France, even with strangers',
      'Sacres (church-derived swearwords): tabernac, câlice, ostie',
      'English borrowings are resisted officially (courriel not email)',
      '"Tu-veux-tu?" double-subject questions are common',
    ],
  },
  belgium: {
    label: 'Belgium (Belgian French)',
    informalYou: 'tu',
    formalYou: 'vous',
    pastPreference: 'passé composé',
    greeting: 'Bonjour ! / Salut !',
    slangCool: 'chouette / super',
    bus: 'bus',
    computer: 'ordinateur',
    apartment: 'appartement',
    culturalNotes: [
      'Septante (70), nonante (90) instead of soixante-dix, quatre-vingt-dix',
      'Huitante is Swiss, not Belgian (Belgium says quatre-vingts)',
      'More reserved than French, less ironic humor',
      'Bilingual context: French-Dutch code-switching in Brussels',
    ],
  },
  swiss: {
    label: 'Switzerland (Swiss French)',
    informalYou: 'tu',
    formalYou: 'vous',
    pastPreference: 'passé composé',
    greeting: 'Bonjour ! / Salut !',
    slangCool: 'chouette / super',
    bus: 'bus',
    computer: 'ordinateur',
    apartment: 'appartement',
    culturalNotes: [
      'Septante (70), huitante (80), nonante (90)',
      'More formal and polite register than France',
      'Swiss punctuality is a real cultural norm',
      'Loan words from German (natel for mobile phone)',
    ],
  },
  african: {
    label: 'West/Central Africa (African French)',
    informalYou: 'tu',
    formalYou: 'vous',
    pastPreference: 'passé composé',
    greeting: 'Bonjour ! / Ça va ?',
    slangCool: 'c\'est bon / c\'est la joie',
    bus: 'car / bus',
    computer: 'ordinateur',
    apartment: 'appartement',
    culturalNotes: [
      'French is often a second or third language alongside local languages',
      'Respectful greetings are essential and often lengthy',
      'On is often replaced by nous in spoken language',
      'Local vocabulary: essencerie (gas station), taximan, go (girlfriend)',
    ],
  },
};

const REGISTERS = {
  very_casual: { label: 'Très familier', addressForm: 'tu',       features: 'Argot, verlan, fragments, omission of ne, contractions' },
  casual:      { label: 'Familier',      addressForm: 'tu',       features: 'Ne-dropping, natural connectors, relaxed' },
  neutral:     { label: 'Courant',       addressForm: 'tu/vous',  features: 'Polite, clear, standard grammar' },
  formal:      { label: 'Soutenu',       addressForm: 'vous',     features: 'Full ne...pas, formal vocabulary, structured' },
  very_formal: { label: 'Très soutenu',  addressForm: 'vous',     features: 'No slang, literary connectors, precise register' },
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
    if (!p.variant) p.variant = 'france';
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
    const variant = p.variant || 'france';

    const levelScenarios = SCENARIOS.filter(s => s.level === level);
    const seen = new Set(p.scenarioHistory.map(h => h.scenarioId));
    let candidates = levelScenarios.filter(s => !seen.has(s.id));
    if (candidates.length === 0) candidates = levelScenarios;
    const scenario = core.pick(candidates, 1)[0];

    const reg = REGISTERS[scenario.register] || REGISTERS.neutral;
    const regionData = REGIONAL_VARIANTS[variant];

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

    return { studentId, level, variant: p.variant, recommendations: topics };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const next = this.getNextTopics(studentId);
    const variant = REGIONAL_VARIANTS[p.variant || 'france'];

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
      const variant = args[3] || 'france';
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
          'set-variant <student> <variant>':    'Set regional variant (france/quebec/belgium/swiss/african)',
          'students':                           'List all student profiles',
        },
      });
  }
});
