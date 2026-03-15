const core = require('../_lib/core');

const SKILL_NAME = 'russian-writing';

// ── Correction categories ──────────────────────────────────────────────────
const CORRECTION_CATEGORIES = [
  'case', 'gender', 'aspect', 'spelling', 'punctuation',
  'register', 'word-order', 'agreement',
];

// ── Prompts by CEFR level ──────────────────────────────────────────────────
const PROMPTS = {
  A1: [
    {
      id: 'a1-personal-1', category: 'personal', title: 'Открытка из путешествия',
      type: 'postcard',
      instructions: 'Напишите открытку другу из путешествия. Включите: где вы, какая погода, что вы делаете каждый день. (30-50 слов)',
      targetStructures: ['present tense verbs', 'locative expressions with в/на + prepositional', 'weather expressions'],
      rubric: {
        content: 'Mentions location, weather, and daily activity',
        grammar: 'Correct present tense conjugation; basic prepositional case after в/на',
        vocabulary: 'Basic travel and weather words',
        organization: 'Greeting, body, farewell structure',
      },
      modelResponse: 'Дорогой Павел! Я в Москве. Здесь очень красиво и холодно. Каждый день я гуляю по центру и фотографирую. Вчера я был на Красной площади. До скорой встречи! Анна',
    },
    {
      id: 'a1-personal-2', category: 'personal', title: 'Моя семья',
      type: 'description',
      instructions: 'Опишите свою семью. Включите: имена, возраст, профессии и что они любят делать. (40-60 слов)',
      targetStructures: ['possessive pronouns', 'у меня есть + nominative', 'dative for age'],
      rubric: {
        content: 'Names at least 3 family members with details',
        grammar: 'Correct gender agreement; dative for age (мне, ему, ей)',
        vocabulary: 'Family terms, numbers, professions',
        organization: 'Logical grouping of family members',
      },
      modelResponse: 'Моя семья небольшая. Мой папа — Иван Петрович. Ему 50 лет. Он инженер. Моя мама — Мария Сергеевна. Ей 47 лет. Она учительница. У меня есть сестра Аня. Ей 15 лет. Она учится в школе. По выходным мы любим гулять в парке.',
    },
    {
      id: 'a1-formal-1', category: 'formal', title: 'Бронирование гостиницы',
      type: 'email',
      instructions: 'Напишите короткое электронное письмо для бронирования номера в гостинице. Включите: даты, тип номера, количество гостей. (30-50 слов)',
      targetStructures: ['formal Вы', 'хотеть/мочь + infinitive', 'numbers and dates'],
      rubric: {
        content: 'Includes dates, room type, number of guests',
        grammar: 'Correct formal register (Вы with capital); хочу + infinitive',
        vocabulary: 'Hotel vocabulary: номер, бронь, ночь',
        organization: 'Greeting, request, sign-off',
      },
      modelResponse: 'Уважаемый администратор! Я хочу забронировать двухместный номер на две ночи — с 15 по 17 июня. Нас двое. Сколько стоит номер за ночь? Заранее спасибо. С уважением, Пётр Сидоров',
    },
    {
      id: 'a1-creative-1', category: 'creative', title: 'Мой идеальный день',
      type: 'narrative',
      instructions: 'Опишите свой идеальный день с утра до вечера. Используйте выражения времени. (40-60 слов)',
      targetStructures: ['time expressions', 'reflexive verbs', 'present tense sequence'],
      rubric: {
        content: 'Covers morning, afternoon, and evening with activities',
        grammar: 'Correct reflexive verb forms; time expressions with в + accusative',
        vocabulary: 'Daily routine vocabulary',
        organization: 'Chronological order with time markers',
      },
      modelResponse: 'Утром я просыпаюсь в девять. Завтракаю с семьёй. В одиннадцать я иду на пляж. Днём обедаю в ресторане. Вечером гуляю по городу и ем мороженое. Ложусь спать в полночь. Идеальный день!',
    },
  ],
  A2: [
    {
      id: 'a2-personal-1', category: 'personal', title: 'Как я провёл выходные',
      type: 'narrative',
      instructions: 'Расскажите, что вы делали в прошлые выходные. Включите минимум 4 действия и скажите, с кем вы были. (60-80 слов)',
      targetStructures: ['past tense with gender agreement', 'aspect choice', 'time markers'],
      rubric: {
        content: 'At least 4 activities with companions mentioned',
        grammar: 'Correct past tense gender (он ходил / она ходила); basic aspect choice',
        vocabulary: 'Leisure activities, time connectors',
        organization: 'Chronological narrative with connectors (потом, после этого)',
      },
      modelResponse: 'В субботу утром я встал поздно. Потом позавтракал и пошёл гулять в парк. Там я встретил друга Колю. Мы вместе пообедали в кафе около метро. После обеда мы посмотрели новый фильм в кинотеатре. В воскресенье я убирался дома и готовил еду на неделю. Выходные были отличные!',
    },
    {
      id: 'a2-personal-2', category: 'personal', title: 'Письмо другу по переписке',
      type: 'letter',
      instructions: 'Напишите неформальное письмо новому другу по переписке. Представьтесь, расскажите о хобби и задайте вопросы. (70-90 слов)',
      targetStructures: ['нравиться/любить + infinitive', 'dative pronouns', 'question formation'],
      rubric: {
        content: 'Self-introduction, hobbies, questions to the friend',
        grammar: 'Correct нравиться + dative; question formation',
        vocabulary: 'Hobbies, interests, personality adjectives',
        organization: 'Informal letter format with greeting and questions',
      },
      modelResponse: 'Привет, Марко! Меня зовут Людмила, мне 16 лет. Я живу в Казани — это красивый город на Волге. Мне очень нравится музыка, я играю на гитаре. Ещё я люблю читать книги — особенно фантастику. А спорт мне не нравится, это скучно! А ты? Что тебе нравится делать? Ты любишь музыку? Жду твоего ответа! Обнимаю, Люда',
    },
    {
      id: 'a2-formal-1', category: 'formal', title: 'Жалоба на товар',
      type: 'email',
      instructions: 'Напишите электронное письмо-жалобу: вы купили товар, и он пришёл сломанным. Объясните ситуацию и скажите, что вы хотите. (60-80 слов)',
      targetStructures: ['past tense narration', 'formal Вы', 'хотеть бы + infinitive'],
      rubric: {
        content: 'States problem, explains what happened, requests solution',
        grammar: 'Past tense for events; conditional for polite requests',
        vocabulary: 'Shopping and complaint vocabulary',
        organization: 'Formal greeting, problem, request, closing',
      },
      modelResponse: 'Уважаемый менеджер! 10 марта я заказал чайник на вашем сайте. Заказ пришёл 15 марта, но чайник был сломан — не работает кнопка. Я очень разочарован. Я хотел бы получить новый чайник или вернуть деньги. Прошу Вас решить эту проблему. С уважением, Александр Козлов',
    },
  ],
  B1: [
    {
      id: 'b1-personal-1', category: 'personal', title: 'Сочинение: мой город',
      type: 'essay',
      instructions: 'Напишите сочинение о вашем городе. Расскажите, почему он вам нравится или не нравится. Приведите примеры. (150-200 слов)',
      targetStructures: ['comparative adjectives', 'opinion expressions', 'aspect alternation in narrative'],
      rubric: {
        content: 'Description of city with personal opinion and examples',
        grammar: 'Correct comparatives; opinion expressions; basic aspect usage',
        vocabulary: 'City description, evaluation adjectives',
        organization: 'Introduction, body with examples, conclusion',
      },
      modelResponse: 'Я живу в Нижнем Новгороде — это третий по величине город в европейской части России. Он стоит на слиянии двух рек — Волги и Оки. Мне нравится мой город по нескольким причинам. Во-первых, здесь очень красивый Кремль, откуда открывается прекрасный вид на реку. Во-вторых, город не такой шумный, как Москва, но при этом здесь есть всё необходимое. Однако есть и проблемы. Зимой здесь очень холодно, а дороги не всегда хорошо чистят. Общественный транспорт мог бы работать лучше. В целом, я люблю свой город и не хочу переезжать.',
    },
    {
      id: 'b1-formal-1', category: 'formal', title: 'Деловое письмо',
      type: 'letter',
      instructions: 'Напишите деловое письмо с просьбой о встрече. Объясните цель встречи и предложите дату. (100-150 слов)',
      targetStructures: ['formal register', 'instrumental case', 'чтобы + infinitive'],
      rubric: {
        content: 'Clear purpose, proposed date, polite tone',
        grammar: 'Correct formal constructions; instrumental case',
        vocabulary: 'Business correspondence formulas',
        organization: 'Standard formal letter structure',
      },
      modelResponse: 'Уважаемая Елена Владимировна!\n\nОбращаюсь к Вам с просьбой о встрече. Я являюсь представителем компании «ТехноПлюс». Мы хотели бы обсудить с Вами возможность сотрудничества в области IT-разработки.\n\nЦелью встречи является презентация нашего нового продукта, который мог бы быть полезен Вашей компании.\n\nМы были бы рады встретиться с Вами в удобное для Вас время. Со своей стороны, предлагаем среду, 20 марта, в 14:00.\n\nБуду признателен за Ваш ответ.\n\nС уважением,\nАлексей Иванович Соколов\nМенеджер по развитию',
    },
    {
      id: 'b1-creative-1', category: 'creative', title: 'Рассказ: неожиданная встреча',
      type: 'narrative',
      instructions: 'Напишите короткий рассказ о неожиданной встрече. Используйте чередование видов глагола (СВ/НСВ). (150-200 слов)',
      targetStructures: ['aspect alternation', 'time connectors', 'reported speech'],
      rubric: {
        content: 'Clear narrative with unexpected element',
        grammar: 'Correct aspect alternation (background/foreground)',
        vocabulary: 'Narrative vocabulary, emotion words',
        organization: 'Beginning, development, climax, ending',
      },
      modelResponse: 'В тот вечер я шёл домой с работы. Было темно, шёл дождь. Я торопился и ни на кого не смотрел. Вдруг кто-то окликнул меня по имени. Я обернулся и увидел женщину. Сначала я её не узнал. А потом понял — это была Наташа, моя одноклассница! Мы не виделись пятнадцать лет. Она сказала, что недавно переехала в наш город. Мы зашли в кафе и проговорили два часа. Оказалось, что мы живём на соседних улицах. Мы обменялись телефонами и договорились встретиться снова.',
    },
  ],
  B2: [
    {
      id: 'b2-academic-1', category: 'academic', title: 'Эссе: за и против',
      type: 'essay',
      instructions: 'Напишите эссе на тему: «Социальные сети: польза или вред?» Приведите аргументы за и против. (250-350 слов)',
      targetStructures: ['participial constructions', 'academic connectors', 'impersonal constructions'],
      rubric: {
        content: 'Thesis, arguments for and against, conclusion',
        grammar: 'Participial phrases; impersonal constructions (можно, следует)',
        vocabulary: 'Academic register, evaluation vocabulary',
        organization: 'Introduction-thesis-arguments-counter-argument-conclusion',
      },
      modelResponse: 'Социальные сети стали неотъемлемой частью современной жизни. Однако вопрос об их влиянии на общество остаётся дискуссионным.\n\nС одной стороны, социальные сети открывают новые возможности для общения. Люди, находящиеся в разных странах, могут поддерживать связь. Кроме того, социальные сети являются мощным инструментом для бизнеса и образования.\n\nС другой стороны, чрезмерное использование социальных сетей может привести к зависимости и проблемам с психическим здоровьем. Исследования показывают, что подростки, проводящие более трёх часов в день в социальных сетях, чаще страдают от тревожности.\n\nТаким образом, социальные сети — это инструмент, который может быть как полезным, так и вредным. Ключевое значение имеет умеренность и критическое мышление.',
    },
    {
      id: 'b2-formal-1', category: 'formal', title: 'Жалоба (официальная)',
      type: 'letter',
      instructions: 'Напишите официальную жалобу на некачественное обслуживание. Используйте формулы делового стиля. (200-300 слов)',
      targetStructures: ['bureaucratic formulas', 'passive voice', 'instrumental case'],
      rubric: {
        content: 'Clear problem statement, factual description, desired outcome',
        grammar: 'Passive constructions; correct case government',
        vocabulary: 'Formal/bureaucratic register',
        organization: 'Standard official complaint structure',
      },
      modelResponse: 'Директору ООО «СервисПлюс»\nИванову И.П.\n\nот Козловой Елены Александровны,\nпроживающей по адресу: г. Москва, ул. Ленина, д. 15, кв. 42\n\nЖАЛОБА\n\n20 февраля 2026 года мной была заказана услуга по ремонту стиральной машины. Мастер прибыл 22 февраля, однако после его визита машина перестала работать полностью. Мои неоднократные обращения по телефону остались без ответа.\n\nНа основании вышеизложенного прошу:\n1. Провести повторный ремонт за счёт компании.\n2. Компенсировать стоимость стирки в прачечной за период неработающей машины.\n\nВ случае неудовлетворения моих требований в течение 10 дней я буду вынуждена обратиться в Роспотребнадзор.\n\nС уважением,\nКозлова Е.А.\n25 февраля 2026 г.',
    },
  ],
  C1: [
    {
      id: 'c1-academic-1', category: 'academic', title: 'Реферат: языковая политика',
      type: 'essay',
      instructions: 'Напишите академическое эссе о языковой политике в России. Используйте научный стиль с причастными оборотами и отглагольными существительными. (400-500 слов)',
      targetStructures: ['participial phrases', 'verbal nouns (-ние/-ение)', 'hedging expressions'],
      rubric: {
        content: 'Analysis with evidence and academic argumentation',
        grammar: 'Correct participial constructions; nominal style',
        vocabulary: 'Academic discourse markers, terminology',
        organization: 'Abstract-introduction-body-conclusion structure',
      },
      modelResponse: 'Языковая политика Российской Федерации является одной из наиболее обсуждаемых тем в современной социолингвистике. Представляется целесообразным рассмотреть основные направления данной политики...',
    },
    {
      id: 'c1-creative-1', category: 'creative', title: 'Литературное эссе',
      type: 'essay',
      instructions: 'Напишите эссе о роли классической литературы в современной России. Ссылайтесь на конкретных авторов. (400-500 слов)',
      targetStructures: ['complex subordination', 'literary vocabulary', 'quotation integration'],
      rubric: {
        content: 'Thoughtful analysis with specific literary references',
        grammar: 'Complex sentences with который, чтобы, несмотря на то что',
        vocabulary: 'Literary criticism terminology',
        organization: 'Thesis-driven essay with literary evidence',
      },
      modelResponse: 'Русская классическая литература продолжает оказывать глубокое влияние на культурное сознание современного общества...',
    },
  ],
  C2: [
    {
      id: 'c2-academic-1', category: 'academic', title: 'Канцелярит vs литературный стиль',
      type: 'essay',
      instructions: 'Перепишите бюрократический текст литературным языком, затем проанализируйте стилистические различия. (300-400 слов)',
      targetStructures: ['register contrast', 'stylistic analysis', 'metalanguage'],
      rubric: {
        content: 'Successful register transformation with analysis',
        grammar: 'Mastery of both registers; metalinguistic awareness',
        vocabulary: 'Stylistic terminology',
        organization: 'Original, transformation, analytical commentary',
      },
      modelResponse: 'Оригинал (канцелярит): «В целях обеспечения надлежащего функционирования системы теплоснабжения осуществляется проведение плановых ремонтных работ...» Литературный вариант: «Каждую весну коммунальные службы ремонтируют трубы отопления...»',
    },
  ],
};

// ── WritingTutor class ──────────────────────────────────────────────────────

class WritingTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId, level) {
    const p = core.loadProfile(this.dir, studentId);
    if (level) {
      const lv = level.toUpperCase();
      if (core.CEFR.includes(lv)) p.level = lv;
    }
    if (!p.level) p.level = 'A1';
    if (!p.assessments) p.assessments = [];
    if (!p.corrections) {
      p.corrections = {};
      for (const cat of CORRECTION_CATEGORIES) {
        p.corrections[cat] = { attempts: [], stability: 2, difficulty: 5 };
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
    const prompts = PROMPTS[level] || [];
    if (!prompts.length) throw new Error(`No prompts for level ${level}.`);

    let candidates = prompts;
    if (category) {
      const cat = category.toLowerCase();
      candidates = prompts.filter(pr => pr.category === cat);
      if (!candidates.length) candidates = prompts;
    }

    const chosen = core.pick(candidates, 1)[0];
    return {
      studentId,
      level,
      prompt: {
        id: chosen.id,
        category: chosen.category,
        title: chosen.title,
        type: chosen.type,
        instructions: chosen.instructions,
        targetStructures: chosen.targetStructures,
      },
    };
  }

  getRubric(promptId) {
    for (const level of core.CEFR) {
      const found = (PROMPTS[level] || []).find(pr => pr.id === promptId);
      if (found) return { promptId, level, title: found.title, rubric: found.rubric, targetStructures: found.targetStructures, modelResponse: found.modelResponse };
    }
    throw new Error(`Prompt not found: ${promptId}`);
  }

  recordAssessment(studentId, promptId, scores, corrections) {
    const p = this.getProfile(studentId);
    if (!p.assessments) p.assessments = [];
    if (!p.corrections) p.corrections = {};
    for (const cat of CORRECTION_CATEGORIES) {
      if (!p.corrections[cat]) p.corrections[cat] = { attempts: [], stability: 2, difficulty: 5 };
    }

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

    if (corrections && typeof corrections === 'object') {
      assessment.corrections = corrections;
      for (const [cat, count] of Object.entries(corrections)) {
        if (!CORRECTION_CATEGORIES.includes(cat)) continue;
        const rec = p.corrections[cat];
        const errorCount = Number(count) || 0;
        if (errorCount > 0) {
          rec.attempts.push({ score: 0, total: 1, date: core.today() });
          rec.stability = core.fsrsUpdateStability(rec.stability, rec.difficulty, 1);
          rec.difficulty = core.fsrsUpdateDifficulty(rec.difficulty, 1);
        } else {
          rec.attempts.push({ score: 1, total: 1, date: core.today() });
          rec.stability = core.fsrsUpdateStability(rec.stability, rec.difficulty, 4);
          rec.difficulty = core.fsrsUpdateDifficulty(rec.difficulty, 4);
        }
      }
      for (const cat of CORRECTION_CATEGORIES) {
        if (!(cat in corrections)) {
          const rec = p.corrections[cat];
          rec.attempts.push({ score: 1, total: 1, date: core.today() });
          rec.stability = core.fsrsUpdateStability(rec.stability, rec.difficulty, 3);
          rec.difficulty = core.fsrsUpdateDifficulty(rec.difficulty, 3);
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
      case: 'Practice case endings in context. Write descriptions using all 6 cases.',
      gender: 'Focus on noun-adjective gender agreement. Write about objects and people.',
      aspect: 'Narrate past events alternating imperfective (background) and perfective (events).',
      spelling: 'Review the 3 spelling rules (after г/к/х/ж/ш/щ/ч). Dictation practice.',
      punctuation: 'Practice comma before что and который. Review dash for omitted быть.',
      register: 'Write the same message formally (Вы) and informally (ты). Compare styles.',
      'word-order': 'Practice theme-rheme ordering. Rewrite sentences with different emphasis.',
      agreement: 'Focus on adjective-noun and subject-verb agreement across genders.',
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

// ── CLI ────────────────────────────────────────────────────────────────────

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
        catch { throw new Error('corrections must be valid JSON, e.g. \'{"case":2,"aspect":1}\''); }
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
