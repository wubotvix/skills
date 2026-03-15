const core = require('../_lib/core');

const SKILL_NAME = 'ukrainian-writing';

// ── Correction categories ──────────────────────────────────────────────────
const CORRECTION_CATEGORIES = [
  'case-endings', 'vocative', 'aspect', 'agreement',
  'apostrophe', 'spelling', 'punctuation', 'register',
];

// ── Prompts by CEFR level ──────────────────────────────────────────────────
const PROMPTS = {
  A1: [
    {
      id: 'a1-personal-1', category: 'personal', title: 'Листівка з подорожі',
      type: 'postcard',
      instructions: 'Напишіть листівку другу з місця відпочинку. Включіть: де ви, яка погода, що робите щодня. (30-50 слів)',
      targetStructures: ['present tense verbs', 'basic adjectives', 'location with "у/в"'],
      rubric: {
        content: 'Згадує місце, погоду та щоденну діяльність',
        grammar: 'Правильне дієвідмінювання в теперішньому часі',
        vocabulary: 'Базова лексика подорожі та погоди',
        organization: 'Привітання, основна частина, прощання',
      },
      modelResponse: 'Привіт, Олено! Я зараз у Львові. Тут тепло і сонячно. Щодня гуляю по старому місту і п\'ю каву. Місто дуже гарне! До зустрічі! Марія',
    },
    {
      id: 'a1-personal-2', category: 'personal', title: 'Моя сім\'я',
      type: 'description',
      instructions: 'Опишіть свою сім\'ю. Включіть: імена, вік, професії та що вони люблять робити. (40-60 слів)',
      targetStructures: ['possessives (мій/моя/моє)', 'бути for descriptions', 'мати for age/possession'],
      rubric: {
        content: 'Називає щонайменше 3 членів родини з деталями',
        grammar: 'Правильне вживання присвійних займенників та відмінків',
        vocabulary: 'Сімейна лексика, числа, професії',
        organization: 'Логічна послідовність',
      },
      modelResponse: 'Мене звати Андрій. Моя сім\'я невелика. Мій тато — Олександр. Йому п\'ятдесят років. Він інженер. Моя мама — Наталія. Вона вчителька. У мене є сестра Марія. Їй двадцять два роки. Вона студентка. Ми живемо в Києві.',
    },
    {
      id: 'a1-personal-3', category: 'personal', title: 'Повідомлення другу',
      type: 'message',
      instructions: 'Напишіть коротке повідомлення (SMS/Viber) другу. Запропонуйте зустрітися. Вкажіть: де, коли, що робитимете. (20-40 слів)',
      targetStructures: ['informal register (ти)', 'question formation', 'time expressions'],
      rubric: {
        content: 'Пропозиція зустрічі з місцем, часом і діяльністю',
        grammar: 'Правильні форми ти-звертання',
        vocabulary: 'Неформальна лексика, час',
        organization: 'Стислість і зрозумілість',
      },
      modelResponse: 'Привіт! Як справи? Може, зустрінемося завтра о п\'ятій? Є нове кафе біля метро. Випиємо кави! Напиши, чи зможеш.',
    },
  ],

  A2: [
    {
      id: 'a2-personal-1', category: 'personal', title: 'Лист про вихідні',
      type: 'email',
      instructions: 'Напишіть неформальний електронний лист другу. Розкажіть, що ви робили минулих вихідних. (60-80 слів)',
      targetStructures: ['past tense (-в/-ла)', 'aspect choice (basic)', 'time expressions'],
      rubric: {
        content: 'Описує конкретні діяльності у минулому часі',
        grammar: 'Правильний минулий час (рід!), базовий вибір виду',
        vocabulary: 'Дозвілля, їжа, активності',
        organization: 'Привітання, хронологія, прощання',
      },
      modelResponse: 'Привіт, Дмитре!\n\nМинулих вихідних було дуже весело! У суботу я ходив на ринок і купив свіжих овочів. Потім ми з Олексієм пішли в кіно на новий український фільм. Він дуже сподобався!\n\nУ неділю я готував борщ. Вийшло смачно! А ти що робив?\n\nОлег',
    },
    {
      id: 'a2-formal-1', category: 'formal', title: 'Запит інформації',
      type: 'email',
      instructions: 'Напишіть формальний лист до готелю у Львові. Запитайте про ціни, наявність кімнат та сніданок. (50-70 слів). Пам\'ятайте про кличний відмінок у зверненні!',
      targetStructures: ['vocative in formal address', 'formal register (Ви)', 'question formation'],
      rubric: {
        content: 'Запитує про ціни, кімнати та сніданок',
        grammar: 'Кличний відмінок у зверненні, Ви-звертання',
        vocabulary: 'Формальна лексика, подорож, готель',
        organization: 'Звернення, основна частина, "З повагою"',
      },
      modelResponse: 'Шановний пане менеджере!\n\nПишу, щоб дізнатися про ваш готель. Чи є вільні кімнати на 15-17 березня? Скільки коштує двомісний номер? Чи входить сніданок у вартість?\n\nБуду вдячний за відповідь.\n\nЗ повагою,\nОлена Петренко',
    },
  ],

  B1: [
    {
      id: 'b1-personal-1', category: 'personal', title: 'Мій улюблений фільм',
      type: 'review',
      instructions: 'Напишіть відгук про ваш улюблений фільм або серіал. Включіть: назву, жанр, сюжет, вашу думку. Поясніть, чому рекомендуєте. (100-150 слів)',
      targetStructures: ['opinion expressions', 'because/although', 'comparative/superlative'],
      rubric: {
        content: 'Чіткий опис та аргументована думка',
        grammar: 'Правильні сполучники, ступені порівняння',
        vocabulary: 'Лексика кіно, оцінки, емоцій',
        organization: 'Вступ, опис, думка, рекомендація',
      },
      modelResponse: 'Мій улюблений фільм — "Атлантида" режисера Валентина Васяновича. Це драма про Україну після війни. Хоча фільм знятий із мінімумом діалогів, він вражає своєю візуальною мовою. Головний герой — колишній військовий, який намагається знайти своє місце в мирному житті. Фільм отримав нагороду на Венеційському кінофестивалі. Я рекомендую цей фільм усім, хто хоче зрозуміти сучасну Україну, тому що він показує реальність без прикрас.',
    },
    {
      id: 'b1-formal-1', category: 'formal', title: 'Скарга на послуги',
      type: 'letter',
      instructions: 'Напишіть офіційного листа зі скаргою на погане обслуговування в ресторані. Опишіть ситуацію, висловіть незадоволення та попросіть компенсацію. (100-130 слів). Обов\'язково: кличний відмінок!',
      targetStructures: ['formal register', 'vocative case', 'conditional (б/би)', 'past tense narrative'],
      rubric: {
        content: 'Чіткий опис ситуації, незадоволення, прохання',
        grammar: 'Кличний відмінок, формальний стиль, умовний спосіб',
        vocabulary: 'Офіційна лексика, обслуговування',
        organization: 'Звернення → ситуація → скарга → прохання → "З повагою"',
      },
      modelResponse: 'Шановний пане директоре!\n\nЗвертаюся до Вас із скаргою щодо обслуговування у Вашому ресторані 5 березня. Ми чекали замовлення понад годину, а коли його принесли, страви були холодні. Офіціант був неввічливий і не вибачився.\n\nЯ був би вдячний, якби Ви розглянули цю ситуацію та надали компенсацію. Як постійний клієнт, я розчарований рівнем обслуговування.\n\nЧекаю на Вашу відповідь.\n\nЗ повагою,\nМихайло Коваленко',
    },
  ],

  B2: [
    {
      id: 'b2-essay-1', category: 'academic', title: 'Аргументативне есе',
      type: 'essay',
      instructions: 'Напишіть есе на тему: "Чи повинні всі українці знати українську мову?" Наведіть аргументи за і проти. Висловіть свою думку. (180-250 слів)',
      targetStructures: ['complex subordination', 'concessive clauses', 'passive voice', 'discourse markers'],
      rubric: {
        content: 'Збалансовані аргументи, чітка позиція',
        grammar: 'Складні речення, правильні відмінки, пасив',
        vocabulary: 'Абстрактна та академічна лексика',
        organization: 'Вступ → аргументи за → аргументи проти → висновок',
      },
      modelResponse: 'Мовне питання в Україні залишається актуальним і дискусійним. Існують вагомі аргументи як на користь обов\'язкового знання української, так і проти.\n\nПрихильники стверджують, що спільна мова зміцнює національну єдність. Державна мова — це інструмент комунікації між громадянами різних регіонів. Крім того, знання української відкриває доступ до багатої літературної та культурної спадщини.\n\nВодночас критики зазначають, що примусова мовна політика може порушувати права мовних меншин. Для багатьох жителів сходу та півдня російська є рідною мовою, і перехід потребує часу та ресурсів.\n\nНа мою думку, знання державної мови є важливим для повноцінної участі в суспільному житті. Однак цей перехід має відбуватися поступово, із належною підтримкою та без примусу.',
    },
    {
      id: 'b2-formal-1', category: 'formal', title: 'Заява про прийом на роботу',
      type: 'application',
      instructions: 'Напишіть мотиваційного листа для подання на роботу в українській IT-компанії. Включіть: досвід, навички, мотивацію. (150-200 слів). Кличний відмінок обов\'язковий!',
      targetStructures: ['formal register', 'vocative', 'relative clauses', 'synthetic future'],
      rubric: {
        content: 'Досвід, навички, мотивація — все розкрито',
        grammar: 'Кличний відмінок, формальний стиль, складні речення',
        vocabulary: 'Ділова лексика, IT-термінологія',
        organization: 'Звернення → досвід → навички → мотивація → закриття',
      },
      modelResponse: 'Шановна пані Олено Вікторівно!\n\nЗвертаюся до Вас щодо вакансії розробника програмного забезпечення. Маю п\'ять років досвіду роботи з JavaScript та Python.\n\nПротягом останніх двох років працював у стартапі, де відповідав за розробку мобільних додатків. Мій проєкт отримав нагороду на хакатоні "Ukrainian Tech Awards".\n\nМене приваблює Ваша компанія, оскільки вона працює над соціально важливими проєктами. Я переконаний, що мій досвід буде корисним для вашої команди. Готовий докласти максимум зусиль для досягнення спільних цілей.\n\nДодатково повідомлю, що вільно володію українською та англійською мовами.\n\nБуду вдячний за можливість обговорити мою кандидатуру.\n\nЗ повагою,\nДмитро Шевченко',
    },
  ],

  C1: [
    {
      id: 'c1-academic-1', category: 'academic', title: 'Академічне есе',
      type: 'essay',
      instructions: 'Напишіть аналітичне есе на тему: "Вплив цифровізації на збереження української мови." Використовуйте аргументи, приклади та контраргументи. (250-350 слів)',
      targetStructures: ['academic register', 'verbal nouns', 'complex passive', 'discourse markers', 'participial phrases'],
      rubric: {
        content: 'Глибокий аналіз із прикладами та контраргументами',
        grammar: 'Академічний стиль, складні конструкції, правильні відмінки',
        vocabulary: 'Фахова лексика, академічні маркери',
        organization: 'Тезис → аргументи → контраргумент → висновок',
      },
      modelResponse: 'Цифровізація створює безпрецедентні можливості для збереження та розвитку української мови, водночас породжуючи нові виклики.\n\nЗ одного боку, цифрові технології значно розширили присутність української мови в інформаційному просторі. Українські соціальні мережі, блоги та подкасти створили нові платформи для мовної практики. За даними досліджень, кількість україномовного контенту в інтернеті зросла вдвічі за останні п\'ять років.\n\nЗ іншого боку, цифровий простір залишається переважно англомовним, що створює загрозу для менших мов. Алгоритми соціальних мереж часто віддають перевагу контенту домінантних мов, маргіналізуючи менші. Крім того, якість машинного перекладу для української залишається нижчою порівняно з мовами, що мають більші корпуси даних.\n\nВажливо зазначити, що цифровізація також сприяє документуванню та збереженню діалектів та регіональних варіантів мови, які раніше існували лише в усній формі.\n\nПідсумовуючи, цифровізація є двоїстим явищем для збереження мови. Для максимізації позитивного впливу необхідна цілеспрямована державна політика підтримки українського контенту в цифровому просторі.',
    },
    {
      id: 'c1-creative-1', category: 'creative', title: 'Оповідання',
      type: 'story',
      instructions: 'Напишіть коротке оповідання (200-300 слів) про зустріч двох людей на київському вокзалі. Використовуйте описи, діалоги та внутрішній монолог. Обов\'язково використайте кличний відмінок у діалогах.',
      targetStructures: ['literary register', 'dialogue formatting', 'vocative in dialogue', 'aspect for narrative effect', 'pluperfect'],
      rubric: {
        content: 'Жива розповідь з описами та діалогами',
        grammar: 'Кличний відмінок, плюсквамперфект, видові пари',
        vocabulary: 'Художня мова, описові елементи',
        organization: 'Наративна структура: зав\'язка → розвиток → розв\'язка',
      },
      modelResponse: 'Вокзал гудів голосами. Людський потік ніс мене до виходу, коли я побачив її.\n\n— Оксано?! — вигукнув я.\n\nВона обернулася. Обличчя, яке я був забув за ці десять років, раптом постало переді мною таким знайомим, ніби ми бачилися вчора.\n\n— Андрію... Боже мій, Андрію!\n\nМи стояли посеред натовпу, і люди обтікали нас, як вода обтікає камінь у річці.\n\n— Куди їдеш? — запитав я.\n— Додому, до Чернівців. А ти?\n— Я вже приїхав. Живу в Києві.\n\nМовчання. Десять років мовчання, і ось тепер ми стоїмо і не знаємо, що сказати.\n\n— Знаєш, — вона усміхнулася, — я часто згадувала тебе.',
    },
  ],

  C2: [
    {
      id: 'c2-academic-1', category: 'academic', title: 'Науковий аналіз',
      type: 'research-essay',
      instructions: 'Напишіть критичний аналіз (300-400 слів) постколоніальної перспективи в сучасній українській літературі. Посилайтеся на конкретних авторів та твори.',
      targetStructures: ['scholarly register', 'complex subordination', 'verbal adverbs', 'passive constructions', 'abstract nominalizations'],
      rubric: {
        content: 'Глибокий критичний аналіз із конкретними прикладами',
        grammar: 'Бездоганна академічна мова',
        vocabulary: 'Літературознавча термінологія',
        organization: 'Тезис → аналіз → контраргумент → синтез',
      },
      modelResponse: 'Постколоніальний дискурс став визначальною рамкою для осмислення сучасної української літератури. Розглядаючи Україну як постколоніальний простір, дослідники виявляють у текстах механізми деколонізації свідомості та мови.\n\nТворчість Оксани Забужко, зокрема "Польові дослідження з українського сексу" (1996), є одним із перших свідомо постколоніальних текстів в українській літературі. Забужко деконструює радянський наратив, показуючи його травматичний вплив на особистість та мову.\n\nСергій Жадан у "Ворошиловграді" та "Інтернаті" досліджує постколоніальний простір східної України, де зіткнення імперського та національного наративів відбувається на рівні повсякденного досвіду.\n\nВодночас застосування постколоніальної теорії до українського контексту має свої обмеження. Класичні постколоніальні концепції, розроблені на матеріалі заморських колоній, не завжди адекватно описують специфіку "внутрішньої колонізації" у межах Російської імперії та СРСР.',
    },
  ],
};

// ---------------------------------------------------------------------------
// Build flat index
// ---------------------------------------------------------------------------

const ALL_PROMPTS = {};
for (const level of Object.keys(PROMPTS)) {
  for (const p of PROMPTS[level]) {
    p.level = level;
    ALL_PROMPTS[p.id] = p;
  }
}

// ---------------------------------------------------------------------------
// WritingTutor class
// ---------------------------------------------------------------------------

class WritingTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.level) p.level = 'A1';
    if (!p.skills) p.skills = {};
    if (!p.corrections) p.corrections = {};
    for (const cat of CORRECTION_CATEGORIES) {
      if (!p.corrections[cat]) p.corrections[cat] = { count: 0, resolved: 0 };
    }
    return p;
  }

  _save(p) { core.saveProfile(this.dir, p); }

  setLevel(studentId, level) {
    const lv = level.toUpperCase();
    if (!core.CEFR.includes(lv)) throw new Error('Invalid CEFR level: ' + level);
    const p = this.getProfile(studentId);
    p.level = lv;
    this._save(p);
    return { studentId, level: lv };
  }

  generatePrompt(studentId, category) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const pool = PROMPTS[level] || PROMPTS.A1;
    let filtered = category ? pool.filter(pr => pr.category === category) : pool;
    if (filtered.length === 0) filtered = pool;
    const chosen = core.pick(filtered, 1)[0];

    return {
      promptId: chosen.id,
      level,
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
      promptId,
      title: pr.title,
      rubric: pr.rubric,
      targetStructures: pr.targetStructures,
      modelResponse: pr.modelResponse,
    };
  }

  recordAssessment(studentId, promptId, scores, corrections) {
    const pr = ALL_PROMPTS[promptId];
    if (!pr) throw new Error('Prompt not found: ' + promptId);

    const p = this.getProfile(studentId);
    const { content, grammar, vocab, org } = scores;

    // Validate scores
    for (const [name, val] of Object.entries({ content, grammar, vocab, org })) {
      const v = parseInt(val, 10);
      if (isNaN(v) || v < 1 || v > 5) throw new Error(`${name} must be 1-5`);
    }

    const total = parseInt(content) + parseInt(grammar) + parseInt(vocab) + parseInt(org);
    const maxTotal = 20;

    // Track corrections by category
    if (corrections && Array.isArray(corrections)) {
      for (const c of corrections) {
        if (p.corrections[c.category]) {
          p.corrections[c.category].count++;
          if (c.resolved) p.corrections[c.category].resolved++;
        }
      }
    }

    // FSRS on this prompt
    if (!p.skills[promptId]) {
      p.skills[promptId] = {
        promptId,
        level: pr.level,
        attempts: [],
        stability: 1,
        difficulty: 5,
        lastReview: null,
        nextReview: null,
      };
    }

    const sk = p.skills[promptId];
    sk.attempts.push({ score: total, total: maxTotal, date: core.today(), content, grammar, vocab, org });
    if (sk.attempts.length > 20) sk.attempts = sk.attempts.slice(-20);

    const grade = Math.round((total / maxTotal) * 4);
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, Math.max(1, grade));
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, Math.max(1, grade));
    sk.lastReview = core.today();
    sk.nextReview = (() => {
      const d = new Date();
      d.setDate(d.getDate() + core.fsrsNextReview(sk.stability));
      return d.toISOString().slice(0, 10);
    })();

    p.assessments.push({ promptId, total, maxTotal, date: core.today() });
    this._save(p);

    return {
      studentId,
      promptId,
      scores: { content, grammar, vocab, org },
      total,
      maxTotal,
      mastery: core.calcMastery(sk.attempts),
      masteryLabel: core.masteryLabel(core.calcMastery(sk.attempts)),
      nextReview: sk.nextReview,
    };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const progress = {};
    for (const [key, sk] of Object.entries(p.skills || {})) {
      progress[key] = {
        level: sk.level,
        mastery: core.calcMastery(sk.attempts),
        masteryLabel: core.masteryLabel(core.calcMastery(sk.attempts)),
        attempts: (sk.attempts || []).length,
        nextReview: sk.nextReview,
      };
    }
    return {
      studentId,
      level: p.level,
      corrections: p.corrections,
      prompts: progress,
    };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);

    // Identify weakest correction category
    let weakest = null;
    let maxErrors = 0;
    for (const [cat, data] of Object.entries(p.corrections)) {
      const unresolved = data.count - data.resolved;
      if (unresolved > maxErrors) {
        maxErrors = unresolved;
        weakest = cat;
      }
    }

    return {
      ...progress,
      createdAt: p.createdAt,
      totalAssessments: (p.assessments || []).length,
      weakestCategory: weakest,
      recommendation: weakest
        ? `Focus on ${weakest}: ${maxErrors} unresolved errors. Practice with targeted exercises.`
        : 'Good progress across all categories.',
      recentActivity: (p.assessments || []).slice(-10).reverse(),
    };
  }

  getPromptCatalog(level) {
    if (level) {
      const lv = level.toUpperCase();
      return { [lv]: (PROMPTS[lv] || []).map(p => ({ id: p.id, title: p.title, type: p.type, category: p.category })) };
    }
    const catalog = {};
    for (const lv of core.CEFR) {
      if (PROMPTS[lv]) {
        catalog[lv] = PROMPTS[lv].map(p => ({ id: p.id, title: p.title, type: p.type, category: p.category }));
      }
    }
    return catalog;
  }

  listStudents() {
    return core.listProfiles(this.dir);
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new WritingTutor();

core.runCLI((cmd, args, out) => {
  const sid = args[1] || 'default';
  switch (cmd) {
    case 'start': {
      if (!args[1]) throw new Error('Usage: start <studentId> [level]');
      const p = tutor.getProfile(sid);
      if (args[2]) {
        const lv = args[2].toUpperCase();
        if (core.CEFR.includes(lv)) p.level = lv;
      }
      tutor._save(p);
      out({ studentId: sid, level: p.level, status: 'ready' });
      break;
    }
    case 'set-level':
      if (!args[2]) throw new Error('Usage: set-level <studentId> <A1-C2>');
      out(tutor.setLevel(sid, args[2]));
      break;
    case 'prompt':
      out(tutor.generatePrompt(sid, args[2] || null));
      break;
    case 'rubric':
      if (!args[1]) throw new Error('Usage: rubric <promptId>');
      out(tutor.getRubric(args[1]));
      break;
    case 'record': {
      // record <studentId> <promptId> <content> <grammar> <vocab> <org> [correctionsJSON]
      const [, id, promptId, content, grammar, vocab, org] = args;
      if (!id || !promptId || !content) throw new Error('Usage: record <studentId> <promptId> <content> <grammar> <vocab> <org> [correctionsJSON]');
      let corrections = null;
      if (args[7]) {
        try { corrections = JSON.parse(args[7]); } catch { /* ignore */ }
      }
      out(tutor.recordAssessment(id, promptId, { content, grammar, vocab, org }, corrections));
      break;
    }
    case 'progress':
      out(tutor.getProgress(sid));
      break;
    case 'report':
      out(tutor.getReport(sid));
      break;
    case 'prompts':
      out(tutor.getPromptCatalog(args[1] ? args[1].toUpperCase() : null));
      break;
    case 'students':
      out({ students: tutor.listStudents() });
      break;
    case 'help':
      out({ commands: ['start', 'set-level', 'prompt', 'rubric', 'record',
                   'progress', 'report', 'prompts', 'students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + (cmd || '(none)'),
        commands: ['start', 'set-level', 'prompt', 'rubric', 'record',
                   'progress', 'report', 'prompts', 'students'],
      });
  }
});
