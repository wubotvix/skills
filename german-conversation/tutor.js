#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const LANG = 'german';
const SKILL_NAME = 'german-conversation';

// ─── Embedded Data ──────────────────────────────────────────────────────────

const SCENARIOS = [
  // A1 — Survival Conversations
  { id: 'a1-greetings',       level: 'A1', title: 'Greeting & introducing yourself',        setting: 'Social',      register: 'neutral',     keyLanguage: ['Hallo, ich heiße...', 'Freut mich!', 'Ich komme aus...', 'Und Sie?'] },
  { id: 'a1-ordering',        level: 'A1', title: 'Ordering at a Café / Imbiss',            setting: 'Restaurant',  register: 'neutral',     keyLanguage: ['Ich hätte gern...', 'Einmal Currywurst, bitte', 'Die Rechnung, bitte', 'Was empfehlen Sie?'] },
  { id: 'a1-directions',      level: 'A1', title: 'Asking for directions in a city',        setting: 'Street',      register: 'neutral',     keyLanguage: ['Wo ist...?', 'Gehen Sie nach rechts/links', 'Geradeaus', 'Ist es weit?'] },
  { id: 'a1-shopping',        level: 'A1', title: 'Shopping at a market',                   setting: 'Markt',       register: 'neutral',     keyLanguage: ['Was kostet das?', 'Ich nehme das', 'Haben Sie das größer?', 'Etwas Günstigeres?'] },

  // A2 — Daily Life Conversations
  { id: 'a2-plans',           level: 'A2', title: 'Making plans with a friend',             setting: 'Phone',       register: 'casual',      keyLanguage: ['Hast du am... Zeit?', 'Treffen wir uns um...', 'Was hältst du von...?'] },
  { id: 'a2-weekend',         level: 'A2', title: 'Describing your weekend',                setting: 'Social',      register: 'casual',      keyLanguage: ['Ich bin... gegangen', 'Es war total schön', 'Wir haben... gespielt', 'Wir haben... gegessen'] },
  { id: 'a2-doctor',          level: 'A2', title: 'At the doctor',                          setting: 'Arztpraxis',  register: 'formal',      keyLanguage: ['Mir tut... weh', 'Seit wann?', 'Sie müssen... nehmen', 'Rezept'] },
  { id: 'a2-hobbies',         level: 'A2', title: 'Talking about hobbies',                  setting: 'Social',      register: 'casual',      keyLanguage: ['Ich... gern', 'In meiner Freizeit...', 'Wie oft...?'] },

  // B1 — Opinions & Experiences
  { id: 'b1-interview',       level: 'B1', title: 'Job interview (basic)',                  setting: 'Office',      register: 'formal',      keyLanguage: ['Ich habe Erfahrung in...', 'Meine Stärken sind...', 'Ich interessiere mich für...'] },
  { id: 'b1-complaint',       level: 'B1', title: 'Making a complaint',                     setting: 'Store',       register: 'neutral',     keyLanguage: ['Ich bin nicht zufrieden', 'Ich möchte umtauschen', 'Das ist nicht das, was ich bestellt habe'] },
  { id: 'b1-opinions',        level: 'B1', title: 'Giving opinions about news',             setting: 'Social',      register: 'casual',      keyLanguage: ['Ich finde, dass...', 'Meiner Meinung nach...', 'Ich bin einverstanden/nicht einverstanden, weil...'] },
  { id: 'b1-trip',            level: 'B1', title: 'Making plans for a trip',                setting: 'Social',      register: 'casual',      keyLanguage: ['Wir könnten nach... fahren', 'Was meinst du?', 'Es wäre besser, wenn...'] },

  // B2 — Nuanced Discussion
  { id: 'b2-debate',          level: 'B2', title: 'Debating a topic',                       setting: 'Academic',    register: 'neutral',     keyLanguage: ['Einerseits...', 'Es kommt darauf an...', 'Ich verstehe deinen Punkt, aber...'] },
  { id: 'b2-negotiation',     level: 'B2', title: 'Negotiating (price, terms)',             setting: 'Business',    register: 'formal',      keyLanguage: ['Ich wäre bereit...', 'Und wenn wir...', 'Ich kann Ihnen anbieten...'] },
  { id: 'b2-movie',           level: 'B2', title: 'Discussing a movie or book',             setting: 'Social',      register: 'casual',      keyLanguage: ['Es geht um...', 'Was mich beeindruckt hat, war...', 'Das hat mich an... erinnert'] },
  { id: 'b2-advice',          level: 'B2', title: 'Giving advice',                          setting: 'Social',      register: 'casual',      keyLanguage: ['An deiner Stelle würde ich...', 'Hast du schon mal daran gedacht...?', 'Vielleicht solltest du...'] },

  // C1 — Abstract & Professional
  { id: 'c1-abstract',        level: 'C1', title: 'Abstract discussion',                    setting: 'Academic',    register: 'formal',      keyLanguage: ['Das wirft die Frage auf...', 'Aus einer breiteren Perspektive...'] },
  { id: 'c1-conflict',        level: 'C1', title: 'Conflict resolution at work',            setting: 'Office',      register: 'formal',      keyLanguage: ['Ich verstehe Ihre Bedenken', 'Lassen Sie uns einen Kompromiss finden'] },
  { id: 'c1-persuasion',      level: 'C1', title: 'Persuasion',                             setting: 'Business',    register: 'formal',      keyLanguage: ['Ich bin überzeugt, dass...', 'Bedenken Sie die Auswirkungen', 'Die Daten deuten darauf hin...'] },
  { id: 'c1-cultural',        level: 'C1', title: 'Cultural comparison',                    setting: 'Social',      register: 'neutral',     keyLanguage: ['In meiner Kultur...', 'Es ist faszinierend, wie...', 'Da gibt es einen grundlegenden Unterschied...'] },

  // C2 — Mastery
  { id: 'c2-humor',           level: 'C2', title: 'Humor and sarcasm',                      setting: 'Social',      register: 'very_casual', keyLanguage: ['Ironie', 'Wortspiele', 'Doppeldeutigkeiten', 'Regionaler Humor'] },
  { id: 'c2-disagreement',    level: 'C2', title: 'Nuanced disagreement',                   setting: 'Academic',    register: 'formal',      keyLanguage: ['Ich verstehe, was Sie meinen, aber ich widerspreche in...', 'Das ist ein berechtigter Einwand'] },
  { id: 'c2-literary',        level: 'C2', title: 'Literary discussion',                    setting: 'Academic',    register: 'formal',      keyLanguage: ['Der Subtext deutet auf...', 'Die Verwendung des Autors von...', 'Das ist eine Parallele zu...'] },
  { id: 'c2-philosophy',      level: 'C2', title: 'Philosophical discussion',               setting: 'Academic',    register: 'formal',      keyLanguage: ['Man könnte argumentieren...', 'Es hängt davon ab, wie man... definiert', 'Das Paradoxe ist...'] },
];

const FUNCTIONAL_LANGUAGE = {
  agreeing: {
    A2: ['Ja, einverstanden.', 'Du hast recht.'],
    B1: ['Ich glaube, du hast recht.', 'Das ist ein guter Punkt.'],
    B2: ['Absolut.', 'Da stimme ich voll und ganz zu.'],
    C1: ['Das kann ich nachvollziehen.', 'Dem stimme ich uneingeschränkt zu.'],
  },
  disagreeing: {
    A2: ['Ich bin nicht einverstanden.', 'Ich glaube nicht.'],
    B1: ['Da bin ich mir nicht sicher.', 'Ich sehe das anders.'],
    B2: ['Ich verstehe deinen Punkt, aber...', 'Ich würde sagen, dass...'],
    C1: ['Da widerspreche ich.', 'Bei allem Respekt, ich sehe das anders.'],
  },
  clarification: [
    'Entschuldigung, können Sie das wiederholen?',
    'Was meinen Sie mit...?',
    'Können Sie mir ein Beispiel geben?',
    'Nur um sicherzugehen — Sie meinen, dass...?',
    'Ich bin mir nicht sicher, ob ich verstehe — können Sie das erklären?',
  ],
  changingSubject: [
    'Übrigens...',
    'Das erinnert mich an...',
    'Wenn wir schon dabei sind...',
    'Ich würde gern auf... zu sprechen kommen',
    'Apropos...',
  ],
  interrupting: [
    'Entschuldigung, dass ich unterbreche, aber...',
    'Darf ich kurz etwas sagen?',
    'Wenn Sie erlauben...',
    'Bevor Sie weitermachen...',
  ],
  uncertainty: [
    'Ich bin mir nicht sicher, aber ich glaube...',
    'Vielleicht irre ich mich, aber...',
    'Wenn ich mich richtig erinnere...',
    'Ich würde sagen, wahrscheinlich...',
  ],
  softening: [
    'Ich will -> Ich hätte gern / Ich würde gern',
    'Kannst du -> Könntest du',
    'Du musst -> Du solltest',
    'Du musst -> Du müsstest eigentlich',
  ],
  modalParticles: [
    'doch — contradiction/insistence: "Das ist doch klar!"',
    'mal — softening: "Schau mal!"',
    'halt — resignation: "Das ist halt so."',
    'ja — shared knowledge: "Das ist ja interessant."',
    'eben — emphasis: "Das ist eben der Punkt."',
    'schon — concession: "Das stimmt schon, aber..."',
    'eigentlich — actually: "Eigentlich wollte ich..."',
    'denn — curiosity in questions: "Was machst du denn?"',
  ],
};

const ERROR_CATEGORIES = [
  { id: 'kasus',          label: 'Case errors',             example: '"Ich gebe der Mann" -> "Ich gebe dem Mann"',                      levelFocus: 'A2+' },
  { id: 'genus',          label: 'Gender (der/die/das)',     example: '"Die Buch" -> "Das Buch"',                                        levelFocus: 'A1+' },
  { id: 'verbstellung',   label: 'Verb position (V2)',       example: '"Gestern ich ging" -> "Gestern ging ich"',                        levelFocus: 'A2+' },
  { id: 'trennbare',      label: 'Separable verbs',          example: '"Ich anrufe dich" -> "Ich rufe dich an"',                         levelFocus: 'A2+' },
  { id: 'konjunktiv',     label: 'Konjunktiv II',            example: '"Wenn ich bin reich" -> "Wenn ich reich wäre"',                    levelFocus: 'B1+' },
  { id: 'adjektivdekl',   label: 'Adjective declension',     example: '"ein großer Haus" -> "ein großes Haus"',                          levelFocus: 'B1+' },
  { id: 'praepositionen', label: 'Preposition + case',       example: '"Ich gehe in der Park" -> "Ich gehe in den Park"',                levelFocus: 'A2+' },
  { id: 'false-friends',  label: 'False friends',            example: '"Ich will ein Gift" (I want a present) not poison',               levelFocus: 'All' },
];

const REGIONAL_VARIANTS = {
  germany: {
    label: 'Germany (Hochdeutsch)',
    informalYou: 'du',
    formalYou: 'Sie',
    pastPreference: 'Perfekt (spoken)',
    greeting: 'Na, wie geht\'s?',
    slangCool: 'geil / cool / krass',
    bus: 'der Bus',
    bread: 'das Brötchen (north) / die Semmel (south)',
    culturalNotes: [
      'Handshake is standard greeting; hugs among close friends',
      'Du among peers under ~40; Sie for strangers, authority, business',
      'Directness is normal; not considered rude',
      'Pünktlichkeit (punctuality) is highly valued',
    ],
  },
  austria: {
    label: 'Austria (Österreichisches Deutsch)',
    informalYou: 'du',
    formalYou: 'Sie',
    pastPreference: 'Perfekt (spoken), Präteritum avoided',
    greeting: 'Grüß Gott! / Servus!',
    slangCool: 'leiwand / ur-cool',
    bus: 'der Bus',
    bread: 'die Semmel',
    culturalNotes: [
      'Grüß Gott is standard (not religious); Servus among friends',
      'Titles matter: Herr Doktor, Frau Magister, etc.',
      'Softer tone than German German; more indirect',
      'Coffee house culture is central to social life',
    ],
  },
  switzerland: {
    label: 'Switzerland (Schweizer Hochdeutsch)',
    informalYou: 'du',
    formalYou: 'Sie',
    pastPreference: 'Perfekt (Präteritum rare in speech)',
    greeting: 'Grüezi! / Hoi!',
    slangCool: 'lässig / mega',
    bus: 'der Bus / das Postauto',
    bread: 'das Brötli / die Wegge',
    culturalNotes: [
      'Grüezi (formal) and Hoi (casual) are standard greetings',
      'Swiss German (Mundart) is spoken; standard German for writing/formal',
      'Consensus and understatement are cultural values',
      'No ß: always "ss" in Swiss standard German',
    ],
  },
};

const REGISTERS = {
  very_casual: { label: 'Very Casual',  addressForm: 'du',      features: 'Slang, fragments, fillers, modal particles, dialect' },
  casual:      { label: 'Casual',       addressForm: 'du',      features: 'Contractions (hab\'s, geht\'s), natural connectors, relaxed' },
  neutral:     { label: 'Neutral',      addressForm: 'du/Sie',  features: 'Polite, clear, standard grammar' },
  formal:      { label: 'Formal',       addressForm: 'Sie',     features: 'Full verb forms, formal vocabulary, structured' },
  very_formal: { label: 'Very Formal',  addressForm: 'Sie',     features: 'Konjunktiv II for politeness, no slang, formal connectors' },
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
    if (!p.variant) p.variant = 'germany';
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
    const variant = p.variant || 'germany';

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
        { step: 1, name: 'Setup',        duration: '2 min', note: `Scenario: ${scenario.title}, Region: ${regionData.label}, Register: ${reg.label}` },
        { step: 2, name: 'Warm-up',      duration: '2 min', note: `Low-stakes small talk using ${regionData.greeting}` },
        { step: 3, name: 'Conversation',  duration: '10-12 min', note: 'Role-play with communicative goals' },
        { step: 4, name: 'Recap',        duration: '4 min', note: 'Corrections, vocabulary, emergent language' },
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
    const variant = REGIONAL_VARIANTS[p.variant || 'germany'];

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
      const variant = args[3] || 'germany';
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
          'set-variant <student> <variant>':    'Set regional variant (germany/austria/switzerland)',
          'students':                           'List all student profiles',
        },
      });
  }
});
