const core = require('../_lib/core');

const SKILL_NAME = 'french-writing';

// -- Correction categories ────────────────────────────────────────────────
const CORRECTION_CATEGORIES = [
  'orthographe', 'accord', 'conjugaison', 'accent',
  'ponctuation', 'registre', 'coherence', 'faux-amis',
];

// -- Prompts by CEFR level ────────────────────────────────────────────────
const PROMPTS = {
  A1: [
    {
      id: 'a1-personal-1', category: 'personal', title: 'Carte postale de vacances',
      type: 'postcard',
      instructions: 'Écrivez une carte postale à un(e) ami(e) depuis un lieu de vacances. Incluez: où vous êtes, quel temps il fait, ce que vous faites chaque jour. (30-50 mots)',
      targetStructures: ['present tense regular verbs', 'être + location', 'faire for weather'],
      rubric: {
        content: 'Mentions location, weather, and daily activity',
        grammar: 'Correct present tense conjugation of regular -er/-ir/-re verbs',
        vocabulary: 'Basic travel and weather words used appropriately',
        organization: 'Greeting, body, farewell structure',
      },
      modelResponse: 'Cher Pierre, Je suis à Nice. Il fait très beau et chaud. Tous les jours, je vais à la plage et je mange de la salade niçoise. La ville est magnifique! À bientôt! Marie',
    },
    {
      id: 'a1-personal-2', category: 'personal', title: 'Ma famille',
      type: 'description',
      instructions: 'Décrivez votre famille. Incluez: noms, âges, professions et une chose qu\'ils aiment faire. (40-60 mots)',
      targetStructures: ['être for descriptions', 'avoir for age', 'possessive adjectives'],
      rubric: {
        content: 'Names at least 3 family members with details',
        grammar: 'Correct use of être/avoir; gender agreement with adjectives',
        vocabulary: 'Family terms, numbers, professions',
        organization: 'Logical grouping of information',
      },
      modelResponse: 'Ma famille est petite. Mon père s\'appelle Jean, il a cinquante ans. Il est professeur. Ma mère s\'appelle Anne, elle a quarante-huit ans. Elle est médecin. Ma sœur s\'appelle Lucie, elle a vingt ans. Elle est étudiante. Le week-end, nous aimons cuisiner ensemble.',
    },
    {
      id: 'a1-personal-3', category: 'personal', title: 'Ma journée',
      type: 'narrative',
      instructions: 'Décrivez une journée typique. Incluez: l\'heure, les activités et les repas. (40-60 mots)',
      targetStructures: ['reflexive verbs (se lever, se coucher)', 'time expressions', 'articles with meals'],
      rubric: {
        content: 'Describes at least 4 activities with times',
        grammar: 'Correct reflexive verb forms; articles with meals (le petit-déjeuner, le déjeuner)',
        vocabulary: 'Daily routine vocabulary',
        organization: 'Chronological order',
      },
      modelResponse: 'Je me lève à sept heures. Je prends le petit-déjeuner à sept heures et demie. Je vais au travail en métro. À midi, je déjeune à la cantine. L\'après-midi, je travaille jusqu\'à dix-huit heures. Le soir, je dîne et je regarde la télé. Je me couche à vingt-trois heures.',
    },
  ],

  A2: [
    {
      id: 'a2-personal-1', category: 'personal', title: 'Mes dernières vacances',
      type: 'narrative',
      instructions: 'Racontez vos dernières vacances. Utilisez le passé composé et l\'imparfait. Où êtes-vous allé(e)? Qu\'avez-vous fait? Comment était-ce? (60-80 mots)',
      targetStructures: ['passé composé with avoir/être', 'imparfait for descriptions', 'DR MRS VANDERTRAMP verbs'],
      rubric: {
        content: 'Narrates vacation with location, activities, and impressions',
        grammar: 'Correct auxiliary choice (avoir/être); agreement of past participle with être verbs',
        vocabulary: 'Travel, activities, adjectives for impressions',
        organization: 'Chronological narrative with opening and closing',
      },
      modelResponse: 'L\'été dernier, je suis allé en Bretagne avec ma famille. Nous sommes restés une semaine à Saint-Malo. Il faisait beau presque tous les jours. Nous avons visité la vieille ville et nous sommes allés à la plage. Un jour, nous avons mangé des crêpes délicieuses. J\'ai adoré ces vacances!',
    },
    {
      id: 'a2-formal-1', category: 'formal', title: 'Lettre de réclamation',
      type: 'letter',
      instructions: 'Vous avez commandé un produit en ligne et il est arrivé cassé. Écrivez un courriel au service client pour vous plaindre et demander un remboursement. (60-80 mots)',
      targetStructures: ['passé composé for narrating events', 'conditional for polite requests', 'formal register'],
      rubric: {
        content: 'States problem, provides details, makes a clear request',
        grammar: 'Conditional for politeness (je voudrais, pourriez-vous); formal vous',
        vocabulary: 'E-commerce and complaint vocabulary',
        organization: 'Formal email structure: greeting, body, request, sign-off',
      },
      modelResponse: 'Madame, Monsieur,\n\nJ\'ai commandé un vase sur votre site le 15 mars (commande n° 12345). Le colis est arrivé hier, mais le vase était cassé. Je suis très déçu(e).\n\nJe voudrais un remboursement ou un échange. Pourriez-vous me contacter?\n\nCordialement,\nMarie Dupont',
    },
    {
      id: 'a2-personal-2', category: 'personal', title: 'Mon logement',
      type: 'description',
      instructions: 'Décrivez votre logement (appartement ou maison). Incluez: pièces, meubles, ce que vous aimez et n\'aimez pas. (60-80 mots)',
      targetStructures: ['il y a', 'prepositions of place', 'adjective agreement'],
      rubric: {
        content: 'Describes at least 3 rooms with furniture and opinions',
        grammar: 'Correct gender/number agreement; preposition usage',
        vocabulary: 'Housing, furniture, opinion expressions',
        organization: 'Room-by-room or spatial organization',
      },
      modelResponse: 'J\'habite dans un petit appartement au troisième étage. Il y a un salon, une chambre, une cuisine et une salle de bains. Dans le salon, il y a un canapé confortable et une grande fenêtre. La cuisine est petite mais bien équipée. J\'aime beaucoup mon balcon, mais je n\'aime pas le bruit de la rue.',
    },
  ],

  B1: [
    {
      id: 'b1-formal-1', category: 'formal', title: 'Lettre de motivation',
      type: 'letter',
      instructions: 'Vous postulez pour un stage dans une entreprise française. Écrivez une lettre de motivation. Incluez: votre formation, vos compétences et votre motivation. (100-150 mots)',
      targetStructures: ['conditional for expressing wishes', 'relative pronouns (qui/que/dont)', 'subjunctive after expressions of desire'],
      rubric: {
        content: 'States qualifications, relevant experience, and motivation',
        grammar: 'Formal register; correct use of relative pronouns and conditional',
        vocabulary: 'Professional and academic vocabulary',
        organization: 'Standard French letter format with clear paragraphs',
      },
      modelResponse: 'Madame, Monsieur,\n\nActuellement étudiant(e) en troisième année de commerce international, je souhaiterais effectuer mon stage de fin d\'études au sein de votre entreprise.\n\nVotre société, qui est reconnue dans le secteur de l\'innovation, correspond parfaitement à mes aspirations professionnelles. Au cours de mes études, j\'ai acquis des compétences dont je pense pouvoir faire bénéficier votre équipe.\n\nJe serais ravi(e) de vous rencontrer pour un entretien.\n\nVeuillez agréer, Madame, Monsieur, l\'expression de mes salutations distinguées.\n\nMarie Dupont',
    },
    {
      id: 'b1-creative-1', category: 'creative', title: 'Un souvenir d\'enfance',
      type: 'narrative',
      instructions: 'Racontez un souvenir d\'enfance important. Utilisez le passé composé, l\'imparfait et le plus-que-parfait. Décrivez les émotions. (100-150 mots)',
      targetStructures: ['imparfait for background/habits', 'passé composé for events', 'plus-que-parfait for prior events', 'emotion vocabulary'],
      rubric: {
        content: 'Tells a complete anecdote with emotional depth',
        grammar: 'Correct tense usage across three past tenses',
        vocabulary: 'Descriptive and emotional vocabulary',
        organization: 'Narrative arc: setting, event, reflection',
      },
      modelResponse: 'Quand j\'avais huit ans, ma grand-mère m\'avait promis de m\'emmener à la mer pour la première fois. J\'étais tellement excité(e) que je n\'ai pas dormi la veille. Le matin, nous sommes partis très tôt. Je me souviens de l\'odeur du sel et du bruit des vagues. J\'ai couru vers l\'eau en criant de joie. Ma grand-mère riait. C\'était un moment parfait. Elle est décédée l\'année suivante, mais ce souvenir reste gravé dans ma mémoire.',
    },
    {
      id: 'b1-personal-1', category: 'personal', title: 'Avantages et inconvénients',
      type: 'essay',
      instructions: 'Le télétravail a-t-il plus d\'avantages ou d\'inconvénients? Donnez votre opinion avec des exemples. (100-150 mots)',
      targetStructures: ['opinion expressions (je pense que, à mon avis)', 'contrast connectors (cependant, en revanche, toutefois)', 'conditional for hypothetical examples'],
      rubric: {
        content: 'Presents both sides with concrete examples',
        grammar: 'Correct use of connectors and opinion expressions',
        vocabulary: 'Work and lifestyle vocabulary',
        organization: 'Introduction, arguments for/against, conclusion',
      },
      modelResponse: 'À mon avis, le télétravail présente plus d\'avantages que d\'inconvénients. D\'abord, on gagne du temps dans les transports. Ensuite, on peut mieux organiser sa journée. Cependant, il y a aussi des inconvénients. Par exemple, certaines personnes se sentent isolées. En revanche, le modèle hybride permet de combiner les avantages des deux systèmes. En conclusion, je pense que le télétravail est positif si on garde un lien avec ses collègues.',
    },
  ],

  B2: [
    {
      id: 'b2-academic-1', category: 'academic', title: 'Dissertation: l\'éducation',
      type: 'essay',
      instructions: 'L\'école devrait-elle enseigner des compétences pratiques (cuisine, finances personnelles) en plus des matières académiques? Rédigez une dissertation structurée. (200-300 mots)',
      targetStructures: ['subjunctive after impersonal expressions (il est essentiel que)', 'concessive clauses (bien que, quoique)', 'passive voice'],
      rubric: {
        content: 'Develops a nuanced argument with examples from at least 2 countries',
        grammar: 'Correct subjunctive; varied sentence structures; passive voice',
        vocabulary: 'Education, social policy, argumentation vocabulary',
        organization: 'Introduction with problématique, développement, conclusion with ouverture',
      },
      modelResponse: 'Introduction de modèle: Il est indéniable que le système éducatif français, centré sur les savoirs académiques, forme des esprits critiques. Toutefois, bien que cette approche ait fait ses preuves, il est légitime de se demander si l\'école ne devrait pas aussi préparer les élèves à la vie quotidienne...',
    },
    {
      id: 'b2-formal-1', category: 'formal', title: 'Lettre formelle au maire',
      type: 'letter',
      instructions: 'Votre quartier manque d\'espaces verts. Écrivez une lettre au maire pour proposer la création d\'un jardin partagé. Argumentez en utilisant des données et des exemples. (150-200 mots)',
      targetStructures: ['subjunctive after il faut que/il est nécessaire que', 'conditional for suggestions', 'impersonal constructions'],
      rubric: {
        content: 'States the problem, proposes a concrete solution, supports with arguments',
        grammar: 'Formal register throughout; correct subjunctive and conditional',
        vocabulary: 'Urban planning, ecology, civic engagement vocabulary',
        organization: 'Formal letter format with clear argumentation',
      },
      modelResponse: 'Monsieur le Maire,\n\nJe me permets de vous écrire au sujet du manque d\'espaces verts dans notre quartier. Il est nécessaire que la mairie prenne des mesures pour améliorer la qualité de vie des habitants...',
    },
    {
      id: 'b2-creative-1', category: 'creative', title: 'Nouvelle courte: le quiproquo',
      type: 'narrative',
      instructions: 'Écrivez une courte histoire basée sur un malentendu (quiproquo). Utilisez le discours indirect et variez les temps du passé. (200-300 mots)',
      targetStructures: ['reported speech (il a dit que + imparfait)', 'past conditional (il aurait dû)', 'si clauses with plus-que-parfait'],
      rubric: {
        content: 'Creates a complete narrative with a misunderstanding that drives the plot',
        grammar: 'Correct sequence of tenses in reported speech; conditional past',
        vocabulary: 'Varied and precise vocabulary; dialogue vocabulary',
        organization: 'Setup, complication, resolution structure',
      },
      modelResponse: 'Pierre avait dit à Marie qu\'il l\'attendrait "devant le café." Marie avait compris "devant le café" — le restaurant sur la place. Pierre, lui, attendait devant chez lui, un café à la main. Si seulement ils avaient précisé...',
    },
  ],

  C1: [
    {
      id: 'c1-academic-1', category: 'academic', title: 'Synthèse de documents',
      type: 'synthesis',
      instructions: 'Rédigez une synthèse comparant deux points de vue sur la laïcité en France: (1) la laïcité comme protection des libertés et (2) la laïcité comme outil d\'exclusion. Ne donnez pas votre opinion personnelle. (250-350 mots)',
      targetStructures: ['nominalization (la mise en place, le renforcement)', 'concessive and adversative connectors', 'impersonal constructions throughout'],
      rubric: {
        content: 'Faithfully represents both perspectives without personal opinion',
        grammar: 'Academic register; nominalizations; complex syntax',
        vocabulary: 'Legal, political, and sociological vocabulary',
        organization: 'Structured comparison with synthesis, not mere juxtaposition',
      },
      modelResponse: 'La laïcité, principe fondateur de la République française, fait l\'objet d\'interprétations divergentes. D\'une part, ses défenseurs soutiennent qu\'elle garantit la neutralité de l\'espace public, permettant ainsi l\'exercice de toutes les libertés...',
    },
    {
      id: 'c1-academic-2', category: 'academic', title: 'Essai argumentatif',
      type: 'essay',
      instructions: 'Les réseaux sociaux constituent-ils une menace pour la démocratie? Rédigez un essai argumentatif structuré avec une thèse, une antithèse et une synthèse. (300-400 mots)',
      targetStructures: ['subjunctive in independent clauses (que ce soit)', 'literary past tenses (optional)', 'complex relative clauses (ce dont, ce à quoi)'],
      rubric: {
        content: 'Develops sophisticated arguments with concrete examples and scholarly references',
        grammar: 'C1 structures: complex relatives, subjunctive, varied sentence patterns',
        vocabulary: 'Political science, media studies, philosophical vocabulary',
        organization: 'French dissertation plan: thèse, antithèse, synthèse',
      },
      modelResponse: 'Les réseaux sociaux, que ce soit Facebook, Twitter ou TikTok, ont profondément transformé l\'espace public. Ce dont les démocraties doivent prendre conscience, c\'est que ces plateformes modifient non seulement la circulation de l\'information, mais aussi la nature même du débat politique...',
    },
  ],

  C2: [
    {
      id: 'c2-academic-1', category: 'academic', title: 'Analyse littéraire',
      type: 'essay',
      instructions: 'Analysez le thème de la mémoire dans un texte de votre choix de la littérature francophone (Proust, Modiano, Chamoiseau, Kourouma...). Mobilisez des concepts critiques. (400-500 mots)',
      targetStructures: ['passé simple for literary analysis', 'subjunctive after concessive conjunctions (pour que, afin que, bien que)', 'sophisticated connectors (force est de constater, il n\'en demeure pas moins)'],
      rubric: {
        content: 'Deep textual analysis with critical concepts and close reading',
        grammar: 'Near-native accuracy; literary register; varied syntax',
        vocabulary: 'Literary criticism vocabulary; philosophical terminology',
        organization: 'Academic essay with thesis, analysis, conclusion',
      },
      modelResponse: 'Dans "Du côté de chez Swann," Proust mit en scène ce qui deviendrait le paradigme de la mémoire involontaire. La célèbre scène de la madeleine ne constitue pas un simple exercice de nostalgie; elle révèle une conception du temps où passé et présent coexistent...',
    },
    {
      id: 'c2-creative-1', category: 'creative', title: 'Pastiche littéraire',
      type: 'narrative',
      instructions: 'Écrivez un pastiche du style d\'un auteur francophone de votre choix. Reproduisez ses procédés stylistiques caractéristiques. (300-400 mots)',
      targetStructures: ['author-specific stylistic devices', 'full range of subjunctive tenses', 'sophisticated literary prose'],
      rubric: {
        content: 'Successfully captures the author\'s voice, themes, and stylistic features',
        grammar: 'Near-native mastery; stylistic choices are deliberate',
        vocabulary: 'Rich, author-appropriate lexicon',
        organization: 'Mimics the author\'s structural patterns',
      },
      modelResponse: 'À la manière de Camus: "Aujourd\'hui, le métro est en grève. Ou peut-être hier. Je ne sais pas. J\'ai marché jusqu\'au bureau sous un ciel indifférent..."',
    },
  ],
};

// -- WritingTutor class ────────────────────────────────────────────────────

class WritingTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  // Profile management

  getProfile(studentId, level) {
    const p = core.loadProfile(this.dir, studentId);
    if (level && core.CEFR.includes(level)) {
      p.level = level;
      if (!p.corrections) p.corrections = {};
      for (const cat of CORRECTION_CATEGORIES) {
        if (!p.corrections[cat]) p.corrections[cat] = { attempts: [], stability: 2, difficulty: 5 };
      }
      core.saveProfile(this.dir, p);
    } else if (!p.level) {
      p.level = 'A1';
      if (!p.corrections) p.corrections = {};
      for (const cat of CORRECTION_CATEGORIES) {
        if (!p.corrections[cat]) p.corrections[cat] = { attempts: [], stability: 2, difficulty: 5 };
      }
      core.saveProfile(this.dir, p);
    }
    return p;
  }

  setLevel(studentId, level) {
    level = level.toUpperCase();
    if (!core.CEFR.includes(level)) throw new Error(`Invalid level: ${level}. Must be one of ${core.CEFR.join(', ')}`);
    const p = this.getProfile(studentId);
    p.level = level;
    core.saveProfile(this.dir, p);
    return p;
  }

  // Prompt generation

  generatePrompt(studentId, category) {
    const p = this.getProfile(studentId);
    const levelPrompts = PROMPTS[p.level] || PROMPTS.A1;
    let pool = levelPrompts;
    if (category) {
      pool = levelPrompts.filter(pr => pr.category === category);
      if (!pool.length) pool = levelPrompts;
    }

    // Prefer prompts not yet attempted
    const attempted = new Set((p.assessments || []).map(a => a.promptId));
    const fresh = pool.filter(pr => !attempted.has(pr.id));
    const chosen = fresh.length ? core.pick(fresh, 1)[0] : core.pick(pool, 1)[0];

    return {
      studentId,
      level: p.level,
      prompt: chosen,
    };
  }

  getRubric(promptId) {
    for (const level of core.CEFR) {
      const found = (PROMPTS[level] || []).find(pr => pr.id === promptId);
      if (found) return { promptId, level, title: found.title, rubric: found.rubric, targetStructures: found.targetStructures, modelResponse: found.modelResponse };
    }
    throw new Error(`Prompt not found: ${promptId}`);
  }

  // Assessment recording

  recordAssessment(studentId, promptId, scores, corrections) {
    const p = this.getProfile(studentId);
    if (!p.assessments) p.assessments = [];
    if (!p.corrections) p.corrections = {};
    for (const cat of CORRECTION_CATEGORIES) {
      if (!p.corrections[cat]) p.corrections[cat] = { attempts: [], stability: 2, difficulty: 5 };
    }

    // Validate scores
    for (const dim of ['content', 'grammar', 'vocabulary', 'organization']) {
      const v = Number(scores[dim]);
      if (isNaN(v) || v < 1 || v > 5) throw new Error(`Score ${dim} must be 1-5, got: ${scores[dim]}`);
    }

    const assessment = {
      promptId,
      date: core.today(),
      scores: {
        content: Number(scores.content),
        grammar: Number(scores.grammar),
        vocabulary: Number(scores.vocabulary),
        organization: Number(scores.organization),
      },
      total: Number(scores.content) + Number(scores.grammar) + Number(scores.vocabulary) + Number(scores.organization),
      maxTotal: 20,
    };

    // Process corrections (e.g., { "orthographe": 2, "accord": 1 } = error counts)
    if (corrections && typeof corrections === 'object') {
      assessment.corrections = corrections;
      for (const [cat, count] of Object.entries(corrections)) {
        if (!CORRECTION_CATEGORIES.includes(cat)) continue;
        const rec = p.corrections[cat];
        const errorCount = Number(count) || 0;
        if (errorCount > 0) {
          rec.attempts.push({ score: 0, total: 1, date: core.today() });
          const grade = 1; // fail
          rec.stability = core.fsrsUpdateStability(rec.stability, rec.difficulty, grade);
          rec.difficulty = core.fsrsUpdateDifficulty(rec.difficulty, grade);
        } else {
          rec.attempts.push({ score: 1, total: 1, date: core.today() });
          const grade = 4; // easy
          rec.stability = core.fsrsUpdateStability(rec.stability, rec.difficulty, grade);
          rec.difficulty = core.fsrsUpdateDifficulty(rec.difficulty, grade);
        }
      }
      // Categories not mentioned in corrections = clean (no errors)
      for (const cat of CORRECTION_CATEGORIES) {
        if (!(cat in corrections)) {
          const rec = p.corrections[cat];
          rec.attempts.push({ score: 1, total: 1, date: core.today() });
          const grade = 3; // good
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

  // Progress and reporting

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

    // Overall writing scores over time
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
      orthographe: 'Practice French spelling rules. Focus on doubled consonants, silent letters, and common homophones (a/à, ou/où, et/est).',
      accord: 'Focus on gender and number agreement: noun-adjective, subject-verb, and past participle agreement with être verbs.',
      conjugaison: 'Practice verb conjugations: regular -er/-ir/-re patterns, then irregular verbs (être, avoir, aller, faire). Mix tenses.',
      accent: 'Review accent rules: accent aigu (é), accent grave (è, à, ù), accent circonflexe (ê), tréma (ë, ï). Practice dictation.',
      ponctuation: 'Review French punctuation: spaces before ; : ! ? and guillemets « ». Practice comma usage with subordinate clauses.',
      registre: 'Practice switching between tu/vous, formal letter formulas, and informal expressions. Write the same message in two registers.',
      coherence: 'Use discourse markers: d\'abord, ensuite, enfin, cependant, en revanche, par conséquent. Practice paragraph transitions.',
      'faux-amis': 'Study false cognates: actuellement ≠ actually, librairie ≠ library, assister ≠ assist, blesser ≠ bless. Write contrastive sentences.',
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

// -- CLI ──────────────────────────────────────────────────────────────────

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
        catch { throw new Error('corrections must be valid JSON, e.g. \'{"orthographe":2,"accord":1}\''); }
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
      out(tutor.getPromptCatalog(level));
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
