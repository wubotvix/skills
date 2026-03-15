#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const LANG = 'filipino';
const SKILL_NAME = 'filipino-conversation';

// ─── Embedded Data ──────────────────────────────────────────────────────────

const SCENARIOS = [
  // A1 — Survival Conversations
  { id: 'a1-greetings',       level: 'A1', title: 'Greetings & introducing yourself',      setting: 'Social',      register: 'neutral',     keyLanguage: ['Kumusta po', 'Ang pangalan ko ay...', 'Taga-saan ka?', 'Masaya akong makilala ka'] },
  { id: 'a1-ordering',        level: 'A1', title: 'Ordering food at a karinderya',         setting: 'Karinderya',  register: 'neutral',     keyLanguage: ['Pabili po ng...', 'Magkano po?', 'Ito na lang po', 'Salamat po'] },
  { id: 'a1-directions',      level: 'A1', title: 'Asking for directions',                 setting: 'Kalye',       register: 'neutral',     keyLanguage: ['Saan po ang...?', 'Kumaliwa/Kumanan', 'Diretso lang po', 'Malayo po ba?'] },
  { id: 'a1-shopping',        level: 'A1', title: 'Shopping at the palengke',               setting: 'Palengke',   register: 'neutral',     keyLanguage: ['Magkano po ito?', 'Pwede po bang tawad?', 'Bilhin ko na po', 'May mas mura po ba?'] },

  // A2 — Daily Life Conversations
  { id: 'a2-plans',           level: 'A2', title: 'Making plans with a friend',             setting: 'Phone',      register: 'casual',      keyLanguage: ['Libre ka ba sa...?', 'Magkita tayo sa...', 'Paano kung...?'] },
  { id: 'a2-weekend',         level: 'A2', title: 'Describing your weekend',                setting: 'Social',     register: 'casual',      keyLanguage: ['Pumunta ako sa...', 'Masaya naman', 'Naglaro kami', 'Kumain kami sa...'] },
  { id: 'a2-doctor',          level: 'A2', title: 'At the doctor',                          setting: 'Klinika',    register: 'formal',      keyLanguage: ['Masakit po ang...', 'Gaano po katagal?', 'Uminom po ng gamot', 'Reseta'] },
  { id: 'a2-transport',       level: 'A2', title: 'Taking a jeepney/tricycle',              setting: 'Transport',  register: 'neutral',     keyLanguage: ['Para po', 'Magkano po hanggang...?', 'Bababa po', 'Bayad po'] },

  // B1 — Opinions & Experiences
  { id: 'b1-interview',       level: 'B1', title: 'Job interview (basic)',                  setting: 'Office',     register: 'formal',      keyLanguage: ['May karanasan po ako sa...', 'Ang mga lakas ko ay...', 'Interesado po ako sa...'] },
  { id: 'b1-complaint',       level: 'B1', title: 'Making a complaint',                     setting: 'Store',      register: 'neutral',     keyLanguage: ['Hindi po ako satisfied', 'Gusto ko po ng refund', 'Hindi po ito ang inorder ko'] },
  { id: 'b1-opinions',        level: 'B1', title: 'Giving opinions about news',             setting: 'Social',     register: 'casual',      keyLanguage: ['Sa tingin ko...', 'Sa opinion ko...', 'Sumasang-ayon/Hindi ako sumasang-ayon dahil...'] },
  { id: 'b1-story',           level: 'B1', title: 'Telling a personal story',               setting: 'Social',     register: 'casual',      keyLanguage: ['Una...', 'Tapos...', 'Pagkatapos noon...', 'Sa bandang huli...'] },

  // B2 — Nuanced Discussion
  { id: 'b2-debate',          level: 'B2', title: 'Debating a topic',                       setting: 'Academic',   register: 'neutral',     keyLanguage: ['Sa isang banda...', 'Depende sa...', 'Nakikita ko ang punto mo pero...'] },
  { id: 'b2-negotiation',     level: 'B2', title: 'Negotiating (price, terms)',              setting: 'Business',   register: 'formal',      keyLanguage: ['Handa po ba kayong...', 'Paano kung...', 'Maaari ko pong i-offer...'] },
  { id: 'b2-movie',           level: 'B2', title: 'Discussing a movie or book',             setting: 'Social',     register: 'casual',      keyLanguage: ['Ang plot ay tungkol sa...', 'Ang nakapansin ko...', 'Napapagunita sa akin...'] },
  { id: 'b2-advice',          level: 'B2', title: 'Giving advice',                          setting: 'Social',     register: 'casual',      keyLanguage: ['Kung ako sa\'yo...', 'Naisip mo na bang...?', 'Baka sulit...'] },

  // C1 — Abstract & Professional
  { id: 'c1-abstract',        level: 'C1', title: 'Abstract discussion',                    setting: 'Academic',   register: 'formal',      keyLanguage: ['Nagbubukas ito ng tanong tungkol sa...', 'Mula sa mas malawak na pananaw...'] },
  { id: 'c1-conflict',        level: 'C1', title: 'Conflict resolution at work',            setting: 'Office',     register: 'formal',      keyLanguage: ['Naiintindihan ko ang alalahanin mo', 'Humanap tayo ng kompromiso'] },
  { id: 'c1-persuasion',      level: 'C1', title: 'Persuasion',                             setting: 'Business',   register: 'formal',      keyLanguage: ['Lubos akong naniniwala na...', 'Isaalang-alang ang mga epekto', 'Ipinapakita ng datos...'] },
  { id: 'c1-cultural',        level: 'C1', title: 'Cultural comparison',                    setting: 'Social',     register: 'neutral',     keyLanguage: ['Sa ating kultura...', 'Nakakaakit kung paano...', 'May malalim na pagkakaiba...'] },

  // C2 — Mastery
  { id: 'c2-humor',           level: 'C2', title: 'Filipino humor and wordplay',            setting: 'Social',     register: 'very_casual', keyLanguage: ['Hugot lines', 'Banat', 'Double meanings', 'Self-deprecating humor'] },
  { id: 'c2-disagreement',    level: 'C2', title: 'Nuanced disagreement',                   setting: 'Academic',   register: 'formal',      keyLanguage: ['May punto ka, pero gusto kong kontrahin...', 'Patas na kritisismo'] },
  { id: 'c2-literary',        level: 'C2', title: 'Literary discussion',                    setting: 'Academic',   register: 'formal',      keyLanguage: ['Ang subteksto ay nagpapahiwatig...', 'Ang gamit ng may-akda ng...', 'Paralelo ito sa...'] },
  { id: 'c2-philosophy',      level: 'C2', title: 'Philosophical discussion',               setting: 'Academic',   register: 'formal',      keyLanguage: ['Maaaring sabihin na...', 'Depende sa kung paano mo idefine...', 'Ang paradox ay...'] },
];

const FUNCTIONAL_LANGUAGE = {
  agreeing: {
    A2: ['Oo, tama ka.', 'Sang-ayon ako.'],
    B1: ['Sa tingin ko tama ka.', 'Magandang punto iyan.'],
    B2: ['Lubos akong sumasang-ayon.', 'Hindi ko mapag-aalinlanganan iyan.'],
    C1: ['Nagkakaisa tayo rito.', 'Buong-buo akong sumasang-ayon.'],
  },
  disagreeing: {
    A2: ['Hindi ako sang-ayon.', 'Hindi ko sa tingin.'],
    B1: ['Hindi ako sigurado diyan.', 'Iba ang tingin ko.'],
    B2: ['Naiintindihan ko ang punto mo, pero...', 'Sasabihin ko na...'],
    C1: ['Hindi ako sang-ayon sa puntong iyan.', 'Nang buong paggalang, iba ang opinyon ko.'],
  },
  clarification: [
    'Pasensya na, pwede mo bang ulitin?',
    'Ano ang ibig mong sabihin sa...?',
    'Pwede mo bang bigyan ako ng halimbawa?',
    'Para lang masiguro — sinasabi mo ba na...?',
    'Hindi ko masyadong naintindihan — pwede mo bang ipaliwanag?',
  ],
  changingSubject: [
    'Siyanga pala...',
    'Naalala ko tuloy...',
    'Baguhin natin ang usapan...',
    'Gusto kong pag-usapan ang...',
    'Tungkol sa...',
  ],
  interrupting: [
    'Pasensya, pero...',
    'Pwede bang magsalita saglit?',
    'Kung pwede lang sandali...',
    'Bago ka magpatuloy...',
  ],
  uncertainty: [
    'Hindi ako sigurado, pero sa tingin ko...',
    'Baka mali ako, pero...',
    'Kung tama ang pagkaalala ko...',
    'Siguro...',
  ],
  softening: [
    'Gusto ko -> Gusto ko sana',
    'Pwede ka ba -> Pwede ka bang',
    'Dapat -> Dapat sana / Baka dapat',
    'Kailangan mo -> Kailangan mo sana',
  ],
};

const ERROR_CATEGORIES = [
  { id: 'verb-focus',      label: 'Verb Focus (AF/OF/LF/BF)',   example: '"Kumain ko ang mangga" -> "Kinain ko ang mangga"',       levelFocus: 'B1+' },
  { id: 'case-markers',    label: 'Case Markers (ang/ng/sa)',    example: '"Kumain ng bata ang mangga" -> "Kumain ang bata ng mangga"', levelFocus: 'A2+' },
  { id: 'aspect',          label: 'Verb Aspect',                 example: '"Kumain siya bukas" -> "Kakain siya bukas"',             levelFocus: 'A2+' },
  { id: 'po-opo',          label: 'Po/Opo Usage',                example: 'Missing po in formal contexts',                          levelFocus: 'A1+' },
  { id: 'linkers',         label: 'Linker na/-ng',               example: '"maganda bata" -> "magandang bata"',                     levelFocus: 'A2+' },
  { id: 'pronouns',        label: 'Pronoun forms',               example: '"Ako ang kumain" vs "Kumain ako"',                       levelFocus: 'A1+' },
  { id: 'word-order',      label: 'Word Order',                  example: '"Ako kumain ng mangga" -> "Kumain ako ng mangga"',       levelFocus: 'A2+' },
  { id: 'taglish-errors',  label: 'Taglish Structure Errors',    example: '"Nag-discuss about" -> "Nag-usap tungkol sa"',           levelFocus: 'All' },
];

const REGISTERS = {
  very_casual: { label: 'Very Casual (Barkada)', addressForm: 'ikaw/ka',   features: 'Slang, fragments, heavy Taglish, no po/opo' },
  casual:      { label: 'Casual',                 addressForm: 'ikaw/ka',   features: 'Some Taglish, relaxed grammar, no po/opo' },
  neutral:     { label: 'Neutral',                addressForm: 'kayo/po',   features: 'Polite, clear, po/opo optional' },
  formal:      { label: 'Formal',                 addressForm: 'kayo/po',   features: 'Po/opo required, pure Filipino, formal vocabulary' },
  very_formal: { label: 'Very Formal',            addressForm: 'kayo/po',   features: 'Literary Filipino, no Taglish, po/opo throughout' },
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
        { step: 2, name: 'Warm-up',     duration: '2 min', note: 'Low-stakes small talk: "Kumusta ang araw mo?"' },
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

    return { studentId, level, recommendations: topics };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const next = this.getNextTopics(studentId);

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
