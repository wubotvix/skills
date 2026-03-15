#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const LANG = 'portuguese';
const SKILL_NAME = 'portuguese-conversation';

// ─── Embedded Data ──────────────────────────────────────────────────────────

const SCENARIOS = [
  // A1 — Survival Conversations
  { id: 'a1-greetings',       level: 'A1', title: 'Greeting & introducing yourself',     setting: 'Social',     register: 'neutral',     keyLanguage: ['Oi, meu nome e...', 'Prazer em conhecer', 'Sou do/da...', 'E voce?'] },
  { id: 'a1-ordering',        level: 'A1', title: 'Ordering at a padaria / cafe',        setting: 'Padaria',    register: 'neutral',     keyLanguage: ['Queria um...', 'Me ve...', 'Quanto custa?', 'A conta, por favor'] },
  { id: 'a1-directions',      level: 'A1', title: 'Asking for directions in a city',     setting: 'Street',     register: 'neutral',     keyLanguage: ['Onde fica...?', 'Vira a direita/esquerda', 'Siga em frente', 'E longe?'] },
  { id: 'a1-shopping',        level: 'A1', title: 'Shopping at a loja / mercado',        setting: 'Mercado',    register: 'neutral',     keyLanguage: ['Quanto e?', 'Vou levar esse', 'Tem tamanho maior?', 'Ta muito caro'] },

  // A2 — Daily Life Conversations
  { id: 'a2-plans',           level: 'A2', title: 'Making plans with a friend',          setting: 'WhatsApp',   register: 'casual',      keyLanguage: ['Voce ta livre...?', 'Vamos combinar', 'Que tal se...?'] },
  { id: 'a2-weekend',         level: 'A2', title: 'Describing your weekend',             setting: 'Social',     register: 'casual',      keyLanguage: ['Eu fui...', 'Foi muito legal', 'A gente jogou...', 'Comemos...'] },
  { id: 'a2-doctor',          level: 'A2', title: 'At the doctor / farmacia',            setting: 'Clinica',    register: 'formal',      keyLanguage: ['Estou com dor de...', 'Ha quanto tempo?', 'Toma esse remedio', 'Receita'] },
  { id: 'a2-hobbies',         level: 'A2', title: 'Talking about hobbies',               setting: 'Social',     register: 'casual',      keyLanguage: ['Eu gosto de...', 'No meu tempo livre...', 'Com que frequencia...?'] },

  // B1 — Opinions & Experiences
  { id: 'b1-interview',       level: 'B1', title: 'Job interview (basic)',               setting: 'Office',     register: 'formal',      keyLanguage: ['Tenho experiencia em...', 'Meus pontos fortes sao...', 'Me interesso por...'] },
  { id: 'b1-complaint',       level: 'B1', title: 'Making a complaint',                  setting: 'Store',      register: 'neutral',     keyLanguage: ['Nao estou satisfeito', 'Queria um reembolso', 'Nao foi isso que eu pedi'] },
  { id: 'b1-opinions',        level: 'B1', title: 'Giving opinions about news/novelas',  setting: 'Social',     register: 'casual',      keyLanguage: ['Eu acho que...', 'Na minha opiniao...', 'Concordo/Discordo porque...'] },
  { id: 'b1-trip',            level: 'B1', title: 'Making plans for a trip',             setting: 'Social',     register: 'casual',      keyLanguage: ['A gente poderia ir...', 'Que tal?', 'Seria melhor se...'] },

  // B2 — Nuanced Discussion
  { id: 'b2-debate',          level: 'B2', title: 'Debating a topic',                    setting: 'Academic',   register: 'neutral',     keyLanguage: ['Por um lado...', 'Depende de...', 'Entendo seu ponto, mas...'] },
  { id: 'b2-negotiation',     level: 'B2', title: 'Negotiating (price, terms)',          setting: 'Business',   register: 'formal',      keyLanguage: ['O senhor estaria disposto a...', 'E se a gente...', 'Posso oferecer...'] },
  { id: 'b2-movie',           level: 'B2', title: 'Discussing a movie/book/novela',      setting: 'Social',     register: 'casual',      keyLanguage: ['A trama era sobre...', 'O que me chamou atencao foi...', 'Me lembrou...'] },
  { id: 'b2-advice',          level: 'B2', title: 'Giving advice',                       setting: 'Social',     register: 'casual',      keyLanguage: ['Se eu fosse voce...', 'Ja pensou em...?', 'Talvez valha a pena...'] },

  // C1 — Abstract & Professional
  { id: 'c1-abstract',        level: 'C1', title: 'Abstract discussion',                 setting: 'Academic',   register: 'formal',      keyLanguage: ['Isso levanta a questao de...', 'De uma perspectiva mais ampla...'] },
  { id: 'c1-conflict',        level: 'C1', title: 'Conflict resolution at work',         setting: 'Office',     register: 'formal',      keyLanguage: ['Entendo sua preocupacao', 'Vamos encontrar um meio-termo'] },
  { id: 'c1-persuasion',      level: 'C1', title: 'Persuasion',                          setting: 'Business',   register: 'formal',      keyLanguage: ['Acredito firmemente que...', 'Considere as implicacoes', 'As evidencias sugerem...'] },
  { id: 'c1-cultural',        level: 'C1', title: 'Cultural comparison (BR vs PT)',       setting: 'Social',     register: 'neutral',     keyLanguage: ['Na cultura brasileira...', 'E fascinante como...', 'Ha uma diferenca fundamental...'] },

  // C2 — Mastery
  { id: 'c2-humor',           level: 'C2', title: 'Humor and sarcasm',                   setting: 'Social',     register: 'very_casual', keyLanguage: ['Irony', 'Wordplay', 'Double meanings', 'Regional humor'] },
  { id: 'c2-disagreement',    level: 'C2', title: 'Nuanced disagreement',                setting: 'Academic',   register: 'formal',      keyLanguage: ['Entendo seu argumento, mas discordo em...', 'Essa e uma critica justa'] },
  { id: 'c2-literary',        level: 'C2', title: 'Literary discussion (Machado, Pessoa)',setting: 'Academic',   register: 'formal',      keyLanguage: ['O subtexto sugere...', 'O uso que o autor faz de...', 'Isso se assemelha...'] },
  { id: 'c2-philosophy',      level: 'C2', title: 'Philosophical discussion / saudade',  setting: 'Academic',   register: 'formal',      keyLanguage: ['Podemos argumentar que...', 'Depende de como definimos...', 'O paradoxo e...'] },
];

const FUNCTIONAL_LANGUAGE = {
  agreeing: {
    A2: ['Concordo.', 'Sim, isso mesmo.'],
    B1: ['Acho que voce tem razao.', 'Boa observacao.'],
    B2: ['Com certeza.', 'Concordo plenamente.'],
    C1: ['Isso faz muito sentido pra mim.', 'Estou totalmente de acordo.'],
  },
  disagreeing: {
    A2: ['Nao concordo.', 'Acho que nao.'],
    B1: ['Nao tenho certeza disso.', 'Vejo de forma diferente.'],
    B2: ['Entendo seu ponto, mas...', 'Eu argumentaria que...'],
    C1: ['Discordo nesse ponto.', 'Com todo respeito, penso diferente.'],
  },
  clarification: [
    'Desculpa, pode repetir?',
    'O que voce quer dizer com...?',
    'Pode me dar um exemplo?',
    'So pra eu ter certeza — voce ta dizendo que...?',
    'Nao sei se entendi — pode explicar?',
  ],
  changingSubject: [
    'Alias...',
    'Isso me lembra...',
    'Mudando de assunto...',
    'Gostaria de passar para...',
    'Falando em...',
  ],
  interrupting: [
    'Desculpa interromper, mas...',
    'Posso falar uma coisa?',
    'So um minuto...',
    'Antes de continuar...',
  ],
  uncertainty: [
    'Nao tenho certeza, mas acho que...',
    'Posso estar enganado, mas...',
    'Se nao me engano...',
    'Eu diria que provavelmente...',
  ],
  softening: [
    'Quero -> Gostaria / Queria',
    'Pode -> Poderia',
    'Deve -> Deveria',
    'Tem que -> Teria que',
  ],
};

const ERROR_CATEGORIES = [
  { id: 'ser-estar',       label: 'Ser/Estar/Ficar',       example: '"Sou cansado" -> "Estou cansado"',               levelFocus: 'B1+' },
  { id: 'gender',          label: 'Gender agreement',      example: '"A problema" -> "O problema"',                    levelFocus: 'A2+' },
  { id: 'subjunctive',     label: 'Conjuntivo',            example: '"Espero que vem" -> "Espero que venha"',          levelFocus: 'B1+' },
  { id: 'por-para',        label: 'Por/Para',              example: '"Estudo por aprender" -> "Estudo para aprender"', levelFocus: 'B1+' },
  { id: 'pret-imperf',     label: 'Perfeito/Imperfeito',   example: '"Ontem chovia quando sai" -> "Ontem chovia quando sai"', levelFocus: 'B1+' },
  { id: 'object-pronouns', label: 'Clitic placement',       example: '"Me da" (BR) vs "Da-me" (PT)',                   levelFocus: 'A2+' },
  { id: 'reflexive',       label: 'Reflexive verbs',       example: '"Eu levanto as 8" -> "Eu me levanto as 8"',       levelFocus: 'A2+' },
  { id: 'false-friends',   label: 'False friends (ES/EN)', example: '"Pretender" = to intend, not to pretend',         levelFocus: 'All' },
  { id: 'ter-haver',       label: 'Ter vs Haver',          example: '"Ha muita gente" (formal) / "Tem muita gente" (BR informal)', levelFocus: 'B1+' },
  { id: 'personal-inf',    label: 'Personal infinitive',   example: '"Para nos fazer" -> "Para nos fazermos"',         levelFocus: 'B2+' },
];

const REGIONAL_VARIANTS = {
  brazil: {
    label: 'Brazil (Standard / Paulista)',
    informalYou: 'voce',
    pluralYou: 'voces',
    pastPreference: 'preterite',
    greeting: 'E ai? Tudo bem?',
    slangCool: 'legal / massa',
    bus: 'onibus',
    computer: 'computador',
    apartment: 'apartamento',
    cellphone: 'celular',
    breakfast: 'cafe da manha',
    culturalNotes: [
      'Warm physical greetings: hugs, cheek kisses (1 in SP, 2 in Rio)',
      'Voce is default; tu used in some regions (Sul, Norte) often with 3rd person verb',
      'Diminutives used extensively: minutinho, cafezinho, rapidinho',
      '"Estou chegando" can mean "I haven\'t left yet"',
    ],
  },
  portugal: {
    label: 'Portugal (Standard / Lisbon)',
    informalYou: 'tu',
    pluralYou: 'voces',
    pastPreference: 'preterite',
    greeting: 'Ola! Tudo bem?',
    slangCool: 'fixe / porreiro',
    bus: 'autocarro',
    computer: 'computador',
    apartment: 'apartamento',
    cellphone: 'telemovel',
    breakfast: 'pequeno-almoco',
    culturalNotes: [
      'Two cheek kisses for greetings (women/mixed), handshake (men)',
      'Tu is the standard informal pronoun with proper 2nd-person conjugation',
      'Voce can feel distancing or even rude in some contexts',
      'More reserved initially compared to Brazilian warmth',
    ],
  },
  rio: {
    label: 'Brazil (Carioca / Rio)',
    informalYou: 'voce / tu (mixed)',
    pluralYou: 'voces',
    pastPreference: 'preterite',
    greeting: 'E ai, beleza?',
    slangCool: 'show / irado',
    bus: 'onibus',
    computer: 'computador',
    apartment: 'apartamento',
    cellphone: 'celular',
    breakfast: 'cafe da manha',
    culturalNotes: [
      'Two cheek kisses standard for everyone',
      'Tu used frequently but often with 3rd-person verb: "Tu vai?"',
      'Strong /ʃ/ for S before consonants: "mesmo" = /ˈmeʒmu/',
      'R as /h/: "carro" = /ˈkahu/',
    ],
  },
  nordeste: {
    label: 'Brazil (Nordeste)',
    informalYou: 'tu / voce',
    pluralYou: 'voces',
    pastPreference: 'preterite',
    greeting: 'E ai, meu filho!',
    slangCool: 'arretado / massa',
    bus: 'onibus',
    computer: 'computador',
    apartment: 'apartamento',
    cellphone: 'celular',
    breakfast: 'cafe da manha',
    culturalNotes: [
      'Rich regional vocabulary: oxente, vixe, arretado, cabra da peste',
      'T/D generally NOT palatalized: "tia" = /ˈtia/ not /ˈtʃia/',
      'Open vowels more common than other BR regions',
      'Warm, storytelling culture with expressive humor',
    ],
  },
};

const REGISTERS = {
  very_casual: { label: 'Very Casual', addressForm: 'voce/tu',           features: 'Slang, fragments, fillers, a gente, diminutives' },
  casual:      { label: 'Casual',      addressForm: 'voce (BR) / tu (PT)', features: 'Contractions (pra, ta, to), natural connectors' },
  neutral:     { label: 'Neutral',     addressForm: 'voce',               features: 'Polite, clear, standard grammar' },
  formal:      { label: 'Formal',      addressForm: 'o senhor/a senhora', features: 'Full verb forms, formal vocabulary, structured' },
  very_formal: { label: 'Very Formal', addressForm: 'Vossa Excelencia',   features: 'No contractions, formal connectors, precise register' },
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
    if (!p.variant) p.variant = 'brazil';
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

  generateSession(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level;
    const variant = p.variant || 'brazil';

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
        { step: 3, name: 'Conversation', duration: '10-12 min', note: 'Role-play with communicative goals' },
        { step: 4, name: 'Recap',       duration: '4 min', note: 'Corrections, vocabulary, emergent language' },
      ],
    };
  }

  getScenario(scenarioId) {
    const s = SCENARIOS.find(sc => sc.id === scenarioId);
    if (!s) throw new Error(`Scenario not found: ${scenarioId}`);
    const reg = REGISTERS[s.register] || REGISTERS.neutral;
    return { ...s, registerLabel: reg.label, addressForm: reg.addressForm, registerFeatures: reg.features };
  }

  listScenarios(level) {
    let list = SCENARIOS;
    if (level) {
      if (!core.CEFR.includes(level)) throw new Error(`Invalid CEFR level: ${level}`);
      list = list.filter(s => s.level === level);
    }
    return list.map(s => ({ id: s.id, level: s.level, title: s.title, setting: s.setting, register: s.register }));
  }

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
    const variant = REGIONAL_VARIANTS[p.variant || 'brazil'];

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
      const variant = args[3] || 'brazil';
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
          'set-variant <student> <variant>':    'Set regional variant (brazil/portugal/rio/nordeste)',
          'students':                           'List all student profiles',
        },
      });
  }
});
