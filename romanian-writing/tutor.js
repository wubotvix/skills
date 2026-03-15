const core = require('../_lib/core');

const SKILL_NAME = 'romanian-writing';

// -- Correction categories (Romanian-specific) ---------------------------------
const CORRECTION_CATEGORIES = [
  'diacritics', 'gender-number', 'case', 'agreement',
  'subjunctive', 'register', 'spelling', 'vocabulary',
  'coherence', 'article',
];

// -- Prompts by CEFR level ----------------------------------------------------
const PROMPTS = {
  A1: [
    {
      id: 'a1-personal-1', category: 'personal', title: 'Carte poștală din vacanță',
      type: 'postcard',
      instructions: 'Scrie o carte poștală unui prieten din vacanță. Include: unde ești, ce vreme este, ce faci în fiecare zi. (30-50 de cuvinte)',
      targetStructures: ['present tense regular verbs', 'a fi + location', 'weather expressions'],
      rubric: {
        content: 'Mentions location, weather, and daily activity',
        grammar: 'Correct present tense conjugation, correct gender articles',
        vocabulary: 'Basic travel and weather words used appropriately',
        organization: 'Greeting, body, farewell structure',
      },
      modelResponse: 'Dragă Pablo, Sunt la Constanța, la mare. Este foarte cald și soare. În fiecare zi merg la plajă și mănânc pește proaspăt. Orașul este foarte frumos. Pe curând! Ana',
    },
    {
      id: 'a1-personal-2', category: 'personal', title: 'Familia mea',
      type: 'description',
      instructions: 'Descrie-ți familia. Include: nume, vârste, profesii și ce le place să facă. (40-60 de cuvinte)',
      targetStructures: ['a fi for descriptions', 'a avea for age', 'possessive adjectives'],
      rubric: {
        content: 'Names at least 3 family members with details',
        grammar: 'Correct use of a fi/a avea; gender agreement with adjectives',
        vocabulary: 'Family terms, numbers, professions',
        organization: 'Logical grouping of information',
      },
      modelResponse: 'Am o familie mică. Tatăl meu se cheamă Ion și are patruzeci de ani. Este inginer. Mama mea se cheamă Maria și este profesoară. Am un frate. Se cheamă Andrei și are cincisprezece ani. Este elev. Nouă ne place să mergem la munte.',
    },
  ],
  A2: [
    {
      id: 'a2-personal-1', category: 'personal', title: 'Weekendul trecut',
      type: 'narrative',
      instructions: 'Povestește ce ai făcut weekendul trecut. Folosește perfectul compus. (60-100 de cuvinte)',
      targetStructures: ['perfectul compus', 'time expressions', 'connectors: apoi, după aceea'],
      rubric: {
        content: 'Describes at least 3 activities over the weekend',
        grammar: 'Correct perfectul compus forms (am + participiu)',
        vocabulary: 'Leisure and daily activities vocabulary',
        organization: 'Chronological sequence with time markers',
      },
      modelResponse: 'Sâmbătă dimineața am dormit până la zece. Apoi am luat micul dejun și am mers la piață. Am cumpărat legume și fructe proaspete. După-amiază am vizitat un muzeu cu prietenii mei. Seara am gătit o cină românească: ciorbă de legume și sarmale. Duminică am citit o carte și am făcut o plimbare în parc.',
    },
    {
      id: 'a2-formal-1', category: 'formal', title: 'E-mail la hotel',
      type: 'email',
      instructions: 'Scrie un e-mail la un hotel pentru a rezerva o cameră. Include: datele, tipul camerei, întrebări despre preț. Folosește forma de politețe (dumneavoastră). (60-100 de cuvinte)',
      targetStructures: ['conditional polite forms (aș vrea)', 'formal register (dumneavoastră)', 'questions'],
      rubric: {
        content: 'Includes dates, room type, and price inquiry',
        grammar: 'Correct conditional forms, formal register throughout',
        vocabulary: 'Hotel and travel vocabulary',
        organization: 'Formal email structure: greeting, body, closing',
      },
      modelResponse: 'Stimate Domn/Stimată Doamnă,\n\nAș vrea să rezerv o cameră dublă pentru perioada 15-20 august. Puteți să-mi spuneți care este prețul pe noapte? De asemenea, aș vrea să știu dacă micul dejun este inclus.\n\nVă mulțumesc anticipat.\n\nCu stimă,\nAna Popescu',
    },
  ],
  B1: [
    {
      id: 'b1-opinion-1', category: 'opinion', title: 'Viața la oraș vs la țară',
      type: 'essay',
      instructions: 'Scrie un eseu scurt în care compari viața la oraș cu viața la țară. Dă argumente pentru fiecare. (150-200 de cuvinte)',
      targetStructures: ['comparative constructions', 'connectors: cu toate acestea, pe de altă parte', 'subjunctive after expressions of opinion'],
      rubric: {
        content: 'Compares at least 2 aspects of city vs countryside life',
        grammar: 'Correct comparatives, subjunctive with să where needed',
        vocabulary: 'Abstract and descriptive vocabulary',
        organization: 'Introduction, body with both sides, conclusion',
      },
      modelResponse: 'Viața la oraș și viața la țară sunt foarte diferite. La oraș, ai acces la transport public, magazine și evenimente culturale. Pe de altă parte, viața la țară oferă liniște, aer curat și natură. Mulți tineri preferă să locuiască la oraș pentru oportunitățile de carieră. Cu toate acestea, tot mai mulți oameni aleg să se mute la țară pentru o viață mai sănătoasă. Eu consider că este important să găsim un echilibru între cele două.',
    },
    {
      id: 'b1-formal-1', category: 'formal', title: 'E-mail formal de reclamație',
      type: 'email',
      instructions: 'Scrie un e-mail formal de reclamație către un magazin online. Descrie problema, explică ce vrei. Folosește dumneavoastră. (100-150 de cuvinte)',
      targetStructures: ['formal register', 'perfectul compus for narrating events', 'conditional for polite requests'],
      rubric: {
        content: 'Describes problem clearly, states desired resolution',
        grammar: 'Consistent formal register, correct past tenses',
        vocabulary: 'Formal complaint vocabulary',
        organization: 'Problem, evidence, desired resolution',
      },
      modelResponse: 'Stimată echipă,\n\nVă scriu în legătură cu comanda nr. 12345 din data de 5 martie. Am primit produsul deteriorat. Cutia era deschisă și produsul zgâriat.\n\nAș dori să primesc un produs nou sau o rambursare completă. Am atașat fotografii ca dovadă.\n\nVă rog să rezolvați această problemă cât mai curând posibil.\n\nCu stimă,\nIon Marinescu',
    },
  ],
  B2: [
    {
      id: 'b2-argumentative-1', category: 'argumentative', title: 'Digitalizarea educației',
      type: 'essay',
      instructions: 'Scrie un eseu argumentativ despre avantajele și dezavantajele digitalizării educației. Susține-ți argumentele cu exemple. (250-350 de cuvinte)',
      targetStructures: ['subjunctive in subordinate clauses', 'impersonal constructions', 'formal connectors'],
      rubric: {
        content: 'Thesis, arguments for/against, counter-argument, conclusion',
        grammar: 'Subjunctive, conditional, formal register consistently',
        vocabulary: 'Academic and technology vocabulary',
        organization: 'Clear essay structure with transitions',
      },
      modelResponse: null,
    },
    {
      id: 'b2-report-1', category: 'formal', title: 'Raport despre un eveniment',
      type: 'report',
      instructions: 'Scrie un raport despre un eveniment la care ai participat (conferință, festival, expoziție). Include: descriere, observații, concluzii. (200-300 de cuvinte)',
      targetStructures: ['passive voice', 'impersonal constructions', 'formal register'],
      rubric: {
        content: 'Event description, observations, and conclusions',
        grammar: 'Passive voice, impersonal constructions',
        vocabulary: 'Formal reporting vocabulary',
        organization: 'Report structure: intro, findings, conclusions',
      },
      modelResponse: null,
    },
  ],
  C1: [
    {
      id: 'c1-academic-1', category: 'academic', title: 'Eseu academic',
      type: 'essay',
      instructions: 'Scrie un eseu academic pe tema: „Impactul rețelelor sociale asupra comunicării interpersonale." Folosește surse (imaginare) și argumente bine structurate. (400-500 de cuvinte)',
      targetStructures: ['academic register', 'hedging (este posibil ca, s-ar putea ca)', 'metadiscourse markers'],
      rubric: {
        content: 'Clear thesis, evidence-based arguments, nuanced conclusion',
        grammar: 'Subjunctive, conditional, academic register, genitive/dative forms',
        vocabulary: 'Academic vocabulary, metadiscourse markers',
        organization: 'Academic essay structure with transitions',
      },
      modelResponse: null,
    },
  ],
  C2: [
    {
      id: 'c2-creative-1', category: 'creative', title: 'Scriere creativă',
      type: 'creative',
      instructions: 'Scrie un text literar scurt (fragment de roman, povestire sau eseu) pe tema „Dorul." Folosește stilul literar românesc. (400-500 de cuvinte)',
      targetStructures: ['literary register', 'gerund', 'presumptive mood', 'stylistic variation'],
      rubric: {
        content: 'Engaging narrative with depth and literary quality',
        grammar: 'Full command of Romanian grammar including literary forms',
        vocabulary: 'Rich, nuanced vocabulary with stylistic awareness',
        organization: 'Creative structure that serves the narrative',
      },
      modelResponse: null,
    },
  ],
};

// -- All prompts flat lookup --
const ALL_PROMPTS = {};
for (const lvl of Object.keys(PROMPTS)) {
  for (const p of PROMPTS[lvl]) ALL_PROMPTS[p.id] = { ...p, level: lvl };
}

// ---------------------------------------------------------------------------
// WritingTutor
// ---------------------------------------------------------------------------

class WritingTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId, initialLevel) {
    const p = core.loadProfile(this.dir, studentId);
    if (initialLevel && !p.level) {
      const lv = initialLevel.toUpperCase();
      if (core.CEFR.includes(lv)) p.level = lv;
    }
    if (!p.level) p.level = 'A1';
    if (!p.assessments) p.assessments = [];
    if (!p.corrections) {
      p.corrections = {};
      for (const cat of CORRECTION_CATEGORIES) {
        p.corrections[cat] = { attempts: [], stability: 2.5, difficulty: 5 };
      }
    }
    core.saveProfile(this.dir, p);
    return p;
  }

  setLevel(studentId, level) {
    const lv = level.toUpperCase();
    if (!core.CEFR.includes(lv)) throw new Error('Invalid CEFR level: ' + level);
    const p = this.getProfile(studentId);
    p.level = lv;
    core.saveProfile(this.dir, p);
    return { studentId, level: lv };
  }

  generatePrompt(studentId, category) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const pool = PROMPTS[level] || PROMPTS.A1;
    const filtered = category ? pool.filter(pr => pr.category === category) : pool;
    if (!filtered.length) throw new Error('No prompts for level ' + level + (category ? ' category ' + category : ''));

    const chosen = core.pick(filtered, 1)[0];
    return {
      studentId,
      level,
      promptId: chosen.id,
      category: chosen.category,
      title: chosen.title,
      type: chosen.type,
      instructions: chosen.instructions,
      targetStructures: chosen.targetStructures,
      rubric: chosen.rubric,
    };
  }

  getRubric(promptId) {
    const pr = ALL_PROMPTS[promptId];
    if (!pr) throw new Error('Prompt not found: ' + promptId);
    return {
      promptId: pr.id,
      title: pr.title,
      level: pr.level,
      rubric: pr.rubric,
      targetStructures: pr.targetStructures,
      modelResponse: pr.modelResponse,
    };
  }

  recordAssessment(studentId, promptId, scores, corrections) {
    const pr = ALL_PROMPTS[promptId];
    if (!pr) throw new Error('Prompt not found: ' + promptId);
    const p = this.getProfile(studentId);

    const content = parseInt(scores.content, 10) || 0;
    const grammar = parseInt(scores.grammar, 10) || 0;
    const vocabulary = parseInt(scores.vocabulary, 10) || 0;
    const organization = parseInt(scores.organization, 10) || 0;

    const assessment = {
      promptId,
      level: pr.level,
      date: core.today(),
      scores: { content, grammar, vocabulary, organization },
      total: content + grammar + vocabulary + organization,
      maxTotal: 20,
      corrections: corrections || null,
    };

    // Update correction category tracking
    if (corrections && typeof corrections === 'object') {
      for (const [cat, errorCount] of Object.entries(corrections)) {
        if (!CORRECTION_CATEGORIES.includes(cat)) continue;
        if (!p.corrections[cat]) p.corrections[cat] = { attempts: [], stability: 2.5, difficulty: 5 };
        const rec = p.corrections[cat];
        const errs = parseInt(errorCount, 10);
        rec.attempts.push({ score: Math.max(0, 5 - errs), total: 5, date: core.today() });
        const grade = errs === 0 ? 4 : errs <= 1 ? 3 : errs <= 3 ? 2 : 1;
        rec.stability = core.fsrsUpdateStability(rec.stability, rec.difficulty, grade);
        rec.difficulty = core.fsrsUpdateDifficulty(rec.difficulty, grade);
      }
      for (const cat of CORRECTION_CATEGORIES) {
        if (!(cat in corrections)) {
          const rec = p.corrections[cat];
          if (!rec) continue;
          rec.attempts.push({ score: 1, total: 1, date: core.today() });
          const grade = 3;
          rec.stability = core.fsrsUpdateStability(rec.stability, rec.difficulty, grade);
          rec.difficulty = core.fsrsUpdateDifficulty(rec.difficulty, grade);
        }
      }
    }

    p.assessments.push(assessment);
    core.saveProfile(this.dir, p);

    return {
      studentId,
      assessment,
      overallScore: `${assessment.total}/${assessment.maxTotal}`,
    };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const categories = {};
    for (const cat of CORRECTION_CATEGORIES) {
      const rec = p.corrections[cat] || { attempts: [] };
      const mastery = core.calcMastery(rec.attempts);
      categories[cat] = {
        mastery,
        label: core.masteryLabel(mastery),
        attempts: rec.attempts.length,
        nextReview: rec.stability ? core.fsrsNextReview(rec.stability, core.DEFAULT_RETENTION) : null,
      };
    }

    const recent = (p.assessments || []).slice(-10);
    const avgScores = { content: 0, grammar: 0, vocabulary: 0, organization: 0 };
    if (recent.length) {
      for (const a of recent) {
        for (const dim of Object.keys(avgScores)) avgScores[dim] += a.scores[dim];
      }
      for (const dim of Object.keys(avgScores)) avgScores[dim] = Math.round(avgScores[dim] / recent.length * 10) / 10;
    }

    return {
      studentId,
      level: p.level,
      totalAssessments: (p.assessments || []).length,
      correctionCategories: categories,
      averageScores: recent.length ? avgScores : null,
    };
  }

  getNextTopics(studentId) {
    const progress = this.getProgress(studentId);
    const cats = progress.correctionCategories;
    const sorted = CORRECTION_CATEGORIES
      .map(cat => ({ category: cat, ...cats[cat] }))
      .sort((a, b) => a.mastery - b.mastery || (a.nextReview || 999) - (b.nextReview || 999));

    return {
      studentId,
      level: progress.level,
      focusAreas: sorted.slice(0, 3).map(s => ({
        category: s.category,
        mastery: s.mastery,
        label: s.label,
        recommendation: this._recommendation(s.category, s.label),
      })),
    };
  }

  _recommendation(category, label) {
    const recs = {
      'diacritics': 'Practice using ă, â, î, ș, ț correctly. They are mandatory in Romanian writing.',
      'gender-number': 'Practice noun-adjective gender agreement (3 genders: m/f/n). Drill the neuter pattern.',
      'case': 'Focus on genitive/dative case forms: băiatul→băiatului, fata→fetei.',
      'agreement': 'Focus on adjective agreement across gender/number/case in longer sentences.',
      'subjunctive': 'Practice "să + verb" constructions. "Vreau să merg" not "vreau că merg."',
      'register': 'Practice consistency: tu throughout or dumneavoastră throughout. Never mix.',
      'spelling': 'Review Romanian spelling rules. Remember â vs î placement.',
      'vocabulary': 'Upgrade vague words to precise ones. Use vocabulary upgrades table.',
      'coherence': 'Use linking words: cu toate acestea, prin urmare, pe de altă parte.',
      'article': 'Practice suffixed definite articles: casa (the house), omul (the man).',
    };
    if (label === 'mastered' || label === 'proficient') return `${category}: strong. Maintain through varied writing.`;
    return recs[category] || `Focus on ${category} in your next writing exercises.`;
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const topics = this.getNextTopics(studentId);

    return {
      studentId,
      level: p.level,
      createdAt: p.createdAt,
      totalAssessments: progress.totalAssessments,
      averageScores: progress.averageScores,
      correctionCategories: progress.correctionCategories,
      focusAreas: topics.focusAreas,
      recentAssessments: (p.assessments || []).slice(-5).map(a => ({
        promptId: a.promptId,
        date: a.date,
        score: `${a.total}/${a.maxTotal}`,
      })),
    };
  }

  listStudents() {
    return core.listProfiles(this.dir);
  }

  getPromptCatalog(level) {
    if (level) {
      if (!core.CEFR.includes(level)) throw new Error(`Invalid level: ${level}`);
      return (PROMPTS[level] || []).map(p => ({ id: p.id, category: p.category, title: p.title, type: p.type, level }));
    }
    const catalog = [];
    for (const lvl of core.CEFR) {
      for (const p of (PROMPTS[lvl] || [])) {
        catalog.push({ id: p.id, category: p.category, title: p.title, type: p.type, level: lvl });
      }
    }
    return catalog;
  }
}

// -- CLI ----------------------------------------------------------------------

const tutor = new WritingTutor();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const [, studentId, level] = args;
      if (!studentId) throw new Error('Usage: start <studentId> [level]');
      out(tutor.getProfile(studentId, level));
      break;
    }
    case 'set-level': {
      const [, studentId, level] = args;
      if (!studentId || !level) throw new Error('Usage: set-level <studentId> <level>');
      out(tutor.setLevel(studentId, level));
      break;
    }
    case 'prompt': {
      const [, studentId, category] = args;
      if (!studentId) throw new Error('Usage: prompt <studentId> [category]');
      out(tutor.generatePrompt(studentId, category));
      break;
    }
    case 'rubric': {
      const [, promptId] = args;
      if (!promptId) throw new Error('Usage: rubric <promptId>');
      out(tutor.getRubric(promptId));
      break;
    }
    case 'record': {
      const [, studentId, promptId, content, grammar, vocabulary, organization, correctionsJson] = args;
      if (!studentId || !promptId || !content) throw new Error('Usage: record <studentId> <promptId> <content> <grammar> <vocab> <org> [correctionsJson]');
      const scores = { content, grammar, vocabulary, organization };
      let corrections = null;
      if (correctionsJson) {
        try { corrections = JSON.parse(correctionsJson); }
        catch { throw new Error('corrections must be valid JSON, e.g. \'{"diacritics":2,"case":1}\''); }
      }
      out(tutor.recordAssessment(studentId, promptId, scores, corrections));
      break;
    }
    case 'progress': {
      const [, studentId] = args;
      if (!studentId) throw new Error('Usage: progress <studentId>');
      out(tutor.getProgress(studentId));
      break;
    }
    case 'report': {
      const [, studentId] = args;
      if (!studentId) throw new Error('Usage: report <studentId>');
      out(tutor.getReport(studentId));
      break;
    }
    case 'prompts': {
      const [, level] = args;
      out(tutor.getPromptCatalog(level ? level.toUpperCase() : null));
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
        commands: ['start', 'set-level', 'prompt', 'rubric', 'record', 'progress', 'report', 'prompts', 'students'],
      });
  }
});

module.exports = { WritingTutor, PROMPTS, CORRECTION_CATEGORIES };
