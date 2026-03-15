#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const LANG = 'italian';
const SKILL_NAME = 'italian-conversation';

// ─── Embedded Data ──────────────────────────────────────────────────────────

const SCENARIOS = [
  // A1 — Survival Conversations
  { id: 'a1-greetings',       level: 'A1', title: 'Greeting & introducing yourself',     setting: 'Social',       register: 'neutral',     keyLanguage: ['Ciao, mi chiamo...', 'Piacere', 'Sono di...', 'E tu/Lei?'] },
  { id: 'a1-ordering',        level: 'A1', title: 'Ordering at a bar / ristorante',      setting: 'Bar',          register: 'neutral',     keyLanguage: ['Vorrei...', 'Un caffe, per favore', 'Il conto, per favore', 'Cosa mi consiglia?'] },
  { id: 'a1-directions',      level: 'A1', title: 'Asking for directions in a city',     setting: 'Street',       register: 'neutral',     keyLanguage: ["Dov'è...?", 'A destra/sinistra', 'Sempre dritto', "È lontano?"] },
  { id: 'a1-shopping',        level: 'A1', title: 'Shopping at a mercato',               setting: 'Mercato',      register: 'neutral',     keyLanguage: ['Quanto costa?', 'Prendo questo', "Ce l'ha piu grande?", 'Qualcosa di meno caro?'] },

  // A2 — Daily Life Conversations
  { id: 'a2-plans',           level: 'A2', title: 'Making plans with a friend',          setting: 'Phone',        register: 'casual',      keyLanguage: ['Sei libero sabato?', 'Ci vediamo alle...', 'Ti va di...?'] },
  { id: 'a2-weekend',         level: 'A2', title: 'Describing your weekend',             setting: 'Social',       register: 'casual',      keyLanguage: ['Sono andato/a a...', 'È stato bellissimo', 'Abbiamo visitato...'] },
  { id: 'a2-doctor',          level: 'A2', title: 'At the doctor',                       setting: 'Clinica',      register: 'formal',      keyLanguage: ['Mi fa male...', 'Da quanto tempo?', 'Prenda questa medicina', 'Ricetta'] },
  { id: 'a2-hobbies',         level: 'A2', title: 'Talking about hobbies',               setting: 'Social',       register: 'casual',      keyLanguage: ['Mi piace...', 'Nel tempo libero...', 'Ogni quanto...?'] },

  // B1 — Opinions & Experiences
  { id: 'b1-interview',       level: 'B1', title: 'Job interview (basic)',               setting: 'Office',       register: 'formal',      keyLanguage: ['Ho esperienza in...', 'I miei punti di forza sono...', 'Mi interessa...'] },
  { id: 'b1-complaint',       level: 'B1', title: 'Making a complaint',                  setting: 'Store',        register: 'neutral',     keyLanguage: ['Non sono soddisfatto/a', 'Vorrei un rimborso', "Non è quello che ho ordinato"] },
  { id: 'b1-opinions',        level: 'B1', title: 'Giving opinions about news',          setting: 'Social',       register: 'casual',      keyLanguage: ['Secondo me...', 'Trovo che...', "Sono d'accordo/non sono d'accordo perche..."] },
  { id: 'b1-trip',            level: 'B1', title: 'Making plans for a trip',             setting: 'Social',       register: 'casual',      keyLanguage: ['Potremmo andare a...', 'Che ne pensi?', 'Sarebbe meglio se...'] },

  // B2 — Nuanced Discussion
  { id: 'b2-debate',          level: 'B2', title: 'Debating a topic',                    setting: 'Academic',     register: 'neutral',     keyLanguage: ['Da un lato... dall\'altro...', 'Dipende da...', 'Capisco il tuo punto di vista, ma...'] },
  { id: 'b2-negotiation',     level: 'B2', title: 'Negotiating (price, terms)',          setting: 'Business',     register: 'formal',      keyLanguage: ['Sarebbe disposto a...?', 'E se noi...?', 'Le posso proporre...'] },
  { id: 'b2-movie',           level: 'B2', title: 'Discussing a movie or book',          setting: 'Social',       register: 'casual',      keyLanguage: ['La trama riguardava...', 'Quello che mi ha colpito è...', 'Mi ha fatto pensare a...'] },
  { id: 'b2-advice',          level: 'B2', title: 'Giving advice',                       setting: 'Social',       register: 'casual',      keyLanguage: ['Se fossi in te...', 'Hai pensato di...?', 'Forse varrebbe la pena di...'] },

  // C1 — Abstract & Professional
  { id: 'c1-abstract',        level: 'C1', title: 'Abstract discussion',                 setting: 'Academic',     register: 'formal',      keyLanguage: ['Questo solleva la questione di...', 'In una prospettiva piu ampia...'] },
  { id: 'c1-conflict',        level: 'C1', title: 'Conflict resolution at work',         setting: 'Office',       register: 'formal',      keyLanguage: ['Capisco la Sua preoccupazione', 'Troviamo un punto d\'incontro'] },
  { id: 'c1-persuasion',      level: 'C1', title: 'Persuasion',                          setting: 'Business',     register: 'formal',      keyLanguage: ['Sono profondamente convinto che...', 'Se consideriamo le conseguenze...', 'I dati suggeriscono...'] },
  { id: 'c1-cultural',        level: 'C1', title: 'Cultural comparison',                 setting: 'Social',       register: 'neutral',     keyLanguage: ['Nel mio paese...', 'È affascinante vedere come...', 'C\'e una differenza fondamentale...'] },

  // C2 — Mastery
  { id: 'c2-humor',           level: 'C2', title: 'Humor and irony',                     setting: 'Social',       register: 'very_casual', keyLanguage: ['Ironia', 'Giochi di parole', 'Doppi sensi', 'Umorismo regionale'] },
  { id: 'c2-disagreement',    level: 'C2', title: 'Nuanced disagreement',                setting: 'Academic',     register: 'formal',      keyLanguage: ['Capisco dove vuoi arrivare, ma...', 'È una critica pertinente, tuttavia...'] },
  { id: 'c2-literary',        level: 'C2', title: 'Literary discussion',                 setting: 'Academic',     register: 'formal',      keyLanguage: ['Il sottotesto suggerisce...', 'L\'uso dell\'autore di...', 'Fa eco a...'] },
  { id: 'c2-philosophy',      level: 'C2', title: 'Philosophical discussion',            setting: 'Academic',     register: 'formal',      keyLanguage: ['Si potrebbe sostenere che...', 'Dipende da come si definisce...', 'Il paradosso è che...'] },
];

const FUNCTIONAL_LANGUAGE = {
  agreeing: {
    A2: ['Sì, è vero.', "Sono d'accordo."],
    B1: ['Penso che tu abbia ragione.', 'È un buon punto.'],
    B2: ['Assolutamente.', 'Sono pienamente d\'accordo.'],
    C1: ['Mi trovo molto d\'accordo.', 'Ti do pienamente ragione.'],
  },
  disagreeing: {
    A2: ["Non sono d'accordo.", 'Non credo.'],
    B1: ['Non sono sicuro/a.', 'La vedo diversamente.'],
    B2: ['Capisco il tuo punto di vista, ma...', 'Tenderei a pensare che...'],
    C1: ['Permettimi di sfumare.', 'Con tutto il rispetto, non la penso cosi.'],
  },
  clarification: [
    'Scusa, puoi ripetere?',
    'Cosa intendi con...?',
    'Potresti farmi un esempio?',
    'Se ho capito bene, stai dicendo che...?',
    'Non sono sicuro/a di capire — puoi spiegare?',
  ],
  changingSubject: [
    'A proposito...',
    'Questo mi fa pensare a...',
    'Parlando di...',
    'Vorrei passare a...',
    'Comunque...',
  ],
  interrupting: [
    'Scusa se ti interrompo, ma...',
    'Posso dire una cosa?',
    'Se mi permetti un momento...',
    'Prima che tu continui...',
  ],
  uncertainty: [
    'Non sono sicuro/a, ma credo che...',
    'Mi sembra che...',
    'Se non ricordo male...',
    'Direi che probabilmente...',
  ],
  softening: [
    'Voglio -> Vorrei / Mi piacerebbe',
    'Puoi -> Potresti',
    'Devi -> Dovresti',
    'Devi -> Sarebbe opportuno',
  ],
};

const ERROR_CATEGORIES = [
  { id: 'essere-stare',     label: 'Essere/Stare',           example: '"Sono bene" -> "Sto bene"',                        levelFocus: 'A1+' },
  { id: 'gender',           label: 'Gender & articles',       example: '"Il problema" (corretto), "La problema" -> errore', levelFocus: 'A2+' },
  { id: 'congiuntivo',      label: 'Congiuntivo',             example: '"Penso che viene" -> "Penso che venga"',           levelFocus: 'B1+' },
  { id: 'prepositions',     label: 'Preposizioni articolate', example: '"In il" -> "Nel", "di il" -> "del"',               levelFocus: 'A2+' },
  { id: 'passato',          label: 'Passato prossimo/imperfetto', example: '"Ieri pioveva quando sono uscito"',            levelFocus: 'B1+' },
  { id: 'pronouns',         label: 'Pronoun combinations',    example: '"Glielo dico" = "I tell it to him/her"',           levelFocus: 'A2+' },
  { id: 'reflexive',        label: 'Reflexive verbs',         example: '"Io alzo alle 8" -> "Mi alzo alle 8"',             levelFocus: 'A2+' },
  { id: 'false-friends',    label: 'Falsi amici',             example: '"Sono eccitato" (sexual) -> "Sono entusiasta"',    levelFocus: 'All' },
];

const REGIONAL_VARIANTS = {
  standard: {
    label: 'Standard Italian',
    informalYou: 'tu',
    formalYou: 'Lei',
    pastPreference: 'passato prossimo',
    greeting: 'Ciao! / Buongiorno!',
    slangCool: 'figo / bello',
    culturalNotes: [
      'Two cheek kisses (left cheek first) for greetings among friends',
      'Tu is default among peers; Lei for strangers, elders, professional settings',
      'Buongiorno before greeting anything else — not greeting is rude',
      'La bella figura — making a good impression is fundamental',
    ],
  },
  northern: {
    label: 'Northern Italy (Milano)',
    informalYou: 'tu',
    formalYou: 'Lei',
    pastPreference: 'passato prossimo exclusively',
    greeting: 'Ciao!',
    slangCool: 'figo / ganzo (Toscana)',
    culturalNotes: [
      'More reserved communication style',
      'Passato prossimo for everything, even distant past',
      'Work-oriented culture, punctuality valued',
      'Less expressive gesturing than south',
    ],
  },
  roman: {
    label: 'Roman Italian',
    informalYou: 'tu',
    formalYou: 'Lei',
    pastPreference: 'both, leaning prossimo',
    greeting: "Ao'! / Ciao!",
    slangCool: 'fico / forte',
    culturalNotes: [
      "Daje! — Roman encouragement/exclamation",
      "Expressive communication with distinctive rise-fall intonation",
      "'Na cifra = a lot (very Roman slang)",
      "Strong local pride — Roma caput mundi",
    ],
  },
  southern: {
    label: 'Southern Italy (Napoli)',
    informalYou: 'tu',
    formalYou: 'Voi (traditional) / Lei',
    pastPreference: 'passato remoto preferred',
    greeting: "Ue'! / Ciao!",
    slangCool: 'buono / bello',
    culturalNotes: [
      'Voi still used as formal address by older speakers',
      'Passato remoto for distant past, prossimo for recent',
      'Very expressive gestural communication',
      'Strong food identity — cuisine is sacred',
    ],
  },
};

const REGISTERS = {
  very_casual: { label: 'Very Casual (Colloquiale)', addressForm: 'tu',             features: "Slang, fragments, fillers, 'sto/'sta, regional color" },
  casual:      { label: 'Casual',                     addressForm: 'tu',             features: 'Natural connectors, relaxed grammar, colloquial expressions' },
  neutral:     { label: 'Neutral (Standard)',          addressForm: 'Lei',            features: 'Polite, clear, standard grammar' },
  formal:      { label: 'Formal',                      addressForm: 'Lei',            features: 'Full verb forms, congiuntivo, conditional for politeness' },
  very_formal: { label: 'Very Formal (Aulico)',        addressForm: 'Lei/Loro',       features: 'No slang, elaborate vocabulary, passato remoto, rhetorical style' },
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
    if (!p.variant) p.variant = 'standard';
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
    const variant = p.variant || 'standard';

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
    const variant = REGIONAL_VARIANTS[p.variant || 'standard'];

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
      const variant = args[3] || 'standard';
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
          'set-variant <student> <variant>':    'Set regional variant (standard/northern/roman/southern)',
          'students':                           'List all student profiles',
        },
      });
  }
});
