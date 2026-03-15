#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'ukrainian-reading';

// ---------------------------------------------------------------------------
// Embedded reading texts by CEFR level
// ---------------------------------------------------------------------------

const TEXTS = {
  A1: [
    {
      id: 'a1-kaviarnia',
      title: 'У кав\'ярні',
      type: 'dialogue',
      text:
        '— Добрий день! Що бажаєте?\n' +
        '— Добрий день. Мені каву з молоком, будь ласка.\n' +
        '— Велику чи маленьку?\n' +
        '— Велику. І ще один круасан.\n' +
        '— Добре. Сімдесят п\'ять гривень.\n' +
        '— Ось, будь ласка. Дякую.\n' +
        '— Смачного!',
      vocabulary: [
        { word: 'бажати', definition: 'to wish / want (formal)', example: 'Що бажаєте замовити?' },
        { word: 'круасан', definition: 'croissant', example: 'Один круасан з шоколадом.' },
        { word: 'смачного', definition: 'enjoy your meal (bon appétit)', example: 'Смачного вам!' },
      ],
      comprehensionQuestions: [
        {
          question: 'Що замовляє клієнт?',
          options: ['Чай', 'Каву з молоком', 'Сік', 'Воду'],
          answer: 1,
          explanation: 'Клієнт каже: "Мені каву з молоком, будь ласка."',
        },
        {
          question: 'Який розмір кави хоче клієнт?',
          options: ['Маленьку', 'Середню', 'Велику', 'Не каже'],
          answer: 2,
          explanation: 'На питання "Велику чи маленьку?" клієнт відповідає "Велику."',
        },
        {
          question: 'Скільки коштує замовлення?',
          options: ['50 грн', '65 грн', '75 грн', '100 грн'],
          answer: 2,
          explanation: '"Сімдесят п\'ять гривень" — 75 hryvnias.',
        },
      ],
    },
    {
      id: 'a1-sim-ia',
      title: 'Моя сім\'я',
      type: 'description',
      text:
        'Мене звати Андрій. Мені двадцять шість років. Я живу в Києві.\n' +
        'Моя сім\'я невелика. Мій тато — Олександр. Він інженер. ' +
        'Моя мама — Наталія. Вона вчителька. У мене є сестра Марія. ' +
        'Їй двадцять два роки. Вона студентка.\n' +
        'Ми живемо разом у великій квартирі. По вихідних ми часто гуляємо в парку.',
      vocabulary: [
        { word: 'сім\'я', definition: 'family', example: 'У мене велика сім\'я.' },
        { word: 'інженер', definition: 'engineer', example: 'Мій тато працює інженером.' },
        { word: 'вчителька', definition: 'teacher (female)', example: 'Вона вчителька математики.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Де живе Андрій?',
          options: ['У Львові', 'В Одесі', 'У Києві', 'У Харкові'],
          answer: 2,
          explanation: '"Я живу в Києві."',
        },
        {
          question: 'Хто мама Андрія за професією?',
          options: ['Інженер', 'Лікар', 'Студентка', 'Вчителька'],
          answer: 3,
          explanation: '"Моя мама — Наталія. Вона вчителька."',
        },
        {
          question: 'Скільки років сестрі Андрія?',
          options: ['20', '22', '24', '26'],
          answer: 1,
          explanation: '"Їй двадцять два роки."',
        },
      ],
    },
    {
      id: 'a1-znaky',
      title: 'Міські знаки',
      type: 'signs',
      text:
        'ВХІД   ВИХІД   КАСА   ЗАЧИНЕНО   ВІДЧИНЕНО\n' +
        'УВАГА! РЕМОНТ   НЕ ПАЛИТИ   ОБЕРЕЖНО\n' +
        'АПТЕКА   ПОШТА   МЕТРО   ЗУПИНКА\n' +
        'ТУАЛЕТ   ГАРДЕРОБ   ІНФОРМАЦІЯ',
      vocabulary: [
        { word: 'вхід / вихід', definition: 'entrance / exit', example: 'Вхід зліва, вихід справа.' },
        { word: 'зачинено / відчинено', definition: 'closed / open', example: 'Магазин зачинено.' },
        { word: 'обережно', definition: 'caution / careful', example: 'Обережно, слизька підлога!' },
      ],
      comprehensionQuestions: [
        {
          question: 'Яке слово означає "entrance"?',
          options: ['ВИХІД', 'ВХІД', 'КАСА', 'ЗУПИНКА'],
          answer: 1,
          explanation: 'ВХІД = entrance, ВИХІД = exit.',
        },
        {
          question: 'Що означає "ЗАЧИНЕНО"?',
          options: ['Open', 'Closed', 'Caution', 'Information'],
          answer: 1,
          explanation: 'ЗАЧИНЕНО = closed (від "зачинити" — to close).',
        },
        {
          question: 'Де можна купити ліки?',
          options: ['ПОШТА', 'МЕТРО', 'АПТЕКА', 'КАСА'],
          answer: 2,
          explanation: 'АПТЕКА = pharmacy, where you can buy medicine.',
        },
      ],
    },
  ],

  A2: [
    {
      id: 'a2-lviv',
      title: 'Подорож до Львова',
      type: 'narrative',
      text:
        'Минулого тижня ми з друзями їздили до Львова. Ми сіли на ранковий потяг о сьомій годині. Подорож тривала п\'ять годин.\n\n' +
        'Львів — дуже гарне місто. Ми гуляли по старому центру, відвідали Оперний театр і п\'яли каву в кав\'ярні на площі Ринок. Кава у Львові найсмачніша!\n\n' +
        'Увечері ми пішли в ресторан і скуштували традиційну українську кухню: борщ, вареники і сало. Все було дуже смачно.\n\n' +
        'Ми провели у Львові два дні і повернулися додому у неділю ввечері. Я хочу поїхати туди знову!',
      vocabulary: [
        { word: 'подорож', definition: 'trip / journey', example: 'Подорож тривала п\'ять годин.' },
        { word: 'скуштувати', definition: 'to taste / try (food)', example: 'Скуштуйте цей борщ!' },
        { word: 'повернутися', definition: 'to return', example: 'Ми повернулися додому ввечері.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Скільки тривала подорож потягом?',
          options: ['Три години', 'Чотири години', 'П\'ять годин', 'Шість годин'],
          answer: 2,
          explanation: '"Подорож тривала п\'ять годин."',
        },
        {
          question: 'Що вони робили на площі Ринок?',
          options: ['Купували сувеніри', 'Пили каву', 'Фотографувалися', 'Слухали музику'],
          answer: 1,
          explanation: '"П\'яли каву в кав\'ярні на площі Ринок."',
        },
        {
          question: 'Коли вони повернулися додому?',
          options: ['У суботу вранці', 'У суботу ввечері', 'У неділю вранці', 'У неділю ввечері'],
          answer: 3,
          explanation: '"Повернулися додому у неділю ввечері."',
        },
        {
          question: 'Які страви вони їли?',
          options: ['Піцу і пасту', 'Борщ, вареники і сало', 'Суші і рамен', 'Шашлик і плов'],
          answer: 1,
          explanation: '"Скуштували традиційну українську кухню: борщ, вареники і сало."',
        },
      ],
    },
    {
      id: 'a2-email',
      title: 'Електронний лист другу',
      type: 'email',
      text:
        'Привіт, Дмитре!\n\n' +
        'Як у тебе справи? Давно не писав тобі.\n\n' +
        'Я нещодавно почав нову роботу. Працюю в офісі в центрі міста. Робота цікава, але дуже багато роботи! Щодня приходжу додому о сьомій вечора.\n\n' +
        'На вихідних ходив на концерт групи "Океан Ельзи". Було круто! Ти б теж сподобалось.\n\n' +
        'Може, зустрінемося наступного тижня? Є класне нове кафе біля метро "Золоті ворота".\n\n' +
        'Напиши мені!\n' +
        'Олексій',
      vocabulary: [
        { word: 'нещодавно', definition: 'recently', example: 'Я нещодавно переїхав.' },
        { word: 'щодня', definition: 'every day', example: 'Щодня ходжу на роботу пішки.' },
        { word: 'зустрітися', definition: 'to meet up', example: 'Зустрінемося о третій?' },
      ],
      comprehensionQuestions: [
        {
          question: 'Зверніть увагу на кличний відмінок. Як Олексій звертається до друга?',
          options: ['Дмитро', 'Дмитре', 'Дмитрію', 'Дмитру'],
          answer: 1,
          explanation: '"Привіт, Дмитре!" — Дмитро → Дмитре (vocative case for direct address).',
        },
        {
          question: 'Де працює Олексій?',
          options: ['Вдома', 'В офісі в центрі міста', 'В кафе', 'В університеті'],
          answer: 1,
          explanation: '"Працюю в офісі в центрі міста."',
        },
        {
          question: 'На чий концерт він ходив?',
          options: ['ТНМК', 'Океан Ельзи', 'ДахаБраха', 'Скрябін'],
          answer: 1,
          explanation: '"Ходив на концерт групи «Океан Ельзи»."',
        },
      ],
    },
  ],

  B1: [
    {
      id: 'b1-osvita',
      title: 'Освіта в Україні',
      type: 'informational',
      text:
        'Система освіти в Україні складається з кількох ступенів. Діти починають ходити до школи о шостому або сьомому році життя. Початкова школа триває чотири роки.\n\n' +
        'Після початкової школи учні переходять до базової середньої освіти, яка триває п\'ять років. Потім — профільна старша школа (три роки) або професійно-технічна освіта.\n\n' +
        'Для вступу до університету потрібно скласти ЗНО — Зовнішнє незалежне оцінювання. Це національний іспит, подібний до SAT у США. Вища освіта включає бакалаврат (чотири роки) та магістратуру (один-два роки).\n\n' +
        'Останнім часом в Україні відбувається реформа освіти під назвою "Нова українська школа". Її мета — перейти від простого запам\'ятовування до розвитку критичного мислення.',
      vocabulary: [
        { word: 'ступінь', definition: 'stage / level / degree', example: 'Перший ступінь освіти — початкова школа.' },
        { word: 'ЗНО', definition: 'External Independent Evaluation (national exam)', example: 'Вона склала ЗНО на відмінно.' },
        { word: 'критичне мислення', definition: 'critical thinking', example: 'Нова школа розвиває критичне мислення.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Скільки років триває початкова школа?',
          options: ['Три', 'Чотири', 'П\'ять', 'Шість'],
          answer: 1,
          explanation: '"Початкова школа триває чотири роки."',
        },
        {
          question: 'Що таке ЗНО?',
          options: ['Шкільний іспит', 'Національний іспит для вступу до університету', 'Олімпіада', 'Домашнє завдання'],
          answer: 1,
          explanation: '"ЗНО — Зовнішнє незалежне оцінювання. Це національний іспит."',
        },
        {
          question: 'Яка мета реформи "Нова українська школа"?',
          options: ['Більше домашніх завдань', 'Вивчення іноземних мов', 'Розвиток критичного мислення', 'Більше іспитів'],
          answer: 2,
          explanation: '"Її мета — перейти від простого запам\'ятовування до розвитку критичного мислення."',
        },
      ],
    },
    {
      id: 'b1-borscht',
      title: 'Борщ — більше ніж страва',
      type: 'article',
      text:
        'У 2022 році ЮНЕСКО внесла культуру приготування українського борщу до списку нематеріальної культурної спадщини, що потребує термінової охорони.\n\n' +
        'Борщ — це не просто суп. Для українців це символ дому, родини і традицій. Кожна область має свій рецепт. На Полтавщині додають галушки, на Львівщині — квасолю, а на Черкащині борщ готують із сушеними грушами.\n\n' +
        'Основні інгредієнти: буряк, капуста, картопля, морква, цибуля і м\'ясо. Головний секрет — у заправці: пасерована цибуля з буряком і часником.\n\n' +
        'Багато українських сімей мають власний рецепт борщу, який передається від покоління до покоління. Як кажуть: "Борщ — це любов, яку можна з\'їсти."',
      vocabulary: [
        { word: 'спадщина', definition: 'heritage', example: 'Культурна спадщина України дуже багата.' },
        { word: 'покоління', definition: 'generation', example: 'Рецепт передається від покоління до покоління.' },
        { word: 'буряк', definition: 'beetroot', example: 'Буряк надає борщу червоний колір.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Коли ЮНЕСКО визнала українській борщ?',
          options: ['2020', '2021', '2022', '2023'],
          answer: 2,
          explanation: '"У 2022 році ЮНЕСКО внесла культуру приготування українського борщу..."',
        },
        {
          question: 'Що додають у борщ на Полтавщині?',
          options: ['Квасолю', 'Галушки', 'Сушені груші', 'Гриби'],
          answer: 1,
          explanation: '"На Полтавщині додають галушки."',
        },
        {
          question: 'Який головний секрет борщу, за текстом?',
          options: ['Свіжі овочі', 'Тривале варіння', 'Заправка з цибулі, буряку і часнику', 'Спеціальна сіль'],
          answer: 2,
          explanation: '"Головний секрет — у заправці: пасерована цибуля з буряком і часником."',
        },
      ],
    },
  ],

  B2: [
    {
      id: 'b2-mova',
      title: 'Мовне питання в Україні',
      type: 'analytical',
      text:
        'Мовне питання залишається одним із найбільш дискусійних в українському суспільстві. Згідно з переписом населення, більшість українців вважають українську рідною мовою, однак у повсякденному житті значна частина населення, особливо на сході й півдні країни, послуговується російською.\n\n' +
        'Закон "Про забезпечення функціонування української мови як державної", ухвалений у 2019 році, встановив вимоги щодо використання державної мови в освіті, медіа, сфері обслуговування та державному управлінні. Прихильники закону стверджують, що він захищає українську мову від подальшої маргіналізації. Критики вважають, що закон обмежує мовні права меншин.\n\n' +
        'Соціолінгвісти зазначають, що ситуація є складнішою, ніж простий поділ на "українськомовних" і "російськомовних". Багато українців є двомовними, переключаючись між мовами залежно від контексту. Крім того, існує суржик — змішане мовлення, яке поєднує елементи обох мов.\n\n' +
        'Важливо розуміти, що мовне питання в Україні не є лише лінгвістичним — воно тісно пов\'язане з питаннями ідентичності, геополітики та історичної пам\'яті.',
      vocabulary: [
        { word: 'послуговуватися', definition: 'to use / make use of (formal)', example: 'Вона послуговується двома мовами.' },
        { word: 'маргіналізація', definition: 'marginalization', example: 'Маргіналізація мов меншин — серйозна проблема.' },
        { word: 'суржик', definition: 'mixed Ukrainian-Russian speech', example: 'Суржик поширений у центральній Україні.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Коли було ухвалено мовний закон?',
          options: ['2017', '2018', '2019', '2020'],
          answer: 2,
          explanation: '"Закон... ухвалений у 2019 році."',
        },
        {
          question: 'Що стверджують прихильники закону?',
          options: ['Він обмежує права', 'Він захищає українську мову', 'Він непотрібний', 'Він занадто м\'який'],
          answer: 1,
          explanation: '"Прихильники закону стверджують, що він захищає українську мову від подальшої маргіналізації."',
        },
        {
          question: 'Що таке суржик?',
          options: ['Діалект', 'Змішане мовлення', 'Стародавня мова', 'Жаргон'],
          answer: 1,
          explanation: '"Суржик — змішане мовлення, яке поєднує елементи обох мов."',
        },
        {
          question: 'З чим пов\'язане мовне питання, окрім лінгвістики?',
          options: ['Лише з освітою', 'З ідентичністю, геополітикою та історичною пам\'яттю', 'Лише з економікою', 'Лише з юриспруденцією'],
          answer: 1,
          explanation: '"Воно тісно пов\'язане з питаннями ідентичності, геополітики та історичної пам\'яті."',
        },
      ],
    },
    {
      id: 'b2-tech',
      title: 'IT-індустрія України',
      type: 'report',
      text:
        'Україна стала одним із провідних IT-хабів Центральної та Східної Європи. За даними Мінцифри, у секторі працює понад триста тисяч фахівців, а експорт IT-послуг перевищує сім мільярдів доларів на рік.\n\n' +
        'Декілька факторів сприяли такому зростанню. По-перше, сильна математична та технічна освіта, успадкована від радянської системи. По-друге, конкурентоспроможна вартість праці порівняно із Західною Європою. По-третє, велика кількість технічних університетів щороку випускає тисячі кваліфікованих спеціалістів.\n\n' +
        'Водночас індустрія стикається з викликами. Конкуренція за таланти загострюється: провідні фахівці отримують пропозиції від міжнародних компаній. Війна змусила багатьох спеціалістів переїхати, хоча значна частина продовжує працювати дистанційно з-за кордону.\n\n' +
        'Експерти прогнозують, що після перемоги Україна зможе стати цифровим хабом для відбудови не лише своєї, а й усієї регіональної економіки.',
      vocabulary: [
        { word: 'фахівець', definition: 'specialist / expert', example: 'Вона висококваліфікований фахівець.' },
        { word: 'конкурентоспроможний', definition: 'competitive', example: 'Ціна дуже конкурентоспроможна.' },
        { word: 'дистанційно', definition: 'remotely', example: 'Я працюю дистанційно з дому.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Скільки фахівців працює в IT-секторі України?',
          options: ['100 тисяч', '200 тисяч', 'Понад 300 тисяч', '500 тисяч'],
          answer: 2,
          explanation: '"У секторі працює понад триста тисяч фахівців."',
        },
        {
          question: 'Який із факторів НЕ згадано як причину зростання?',
          options: ['Сильна математична освіта', 'Конкурентна вартість праці', 'Великий внутрішній ринок', 'Багато технічних університетів'],
          answer: 2,
          explanation: 'The text mentions strong math education, competitive labor costs, and many tech universities — but NOT a large domestic market.',
        },
        {
          question: 'Який основний виклик для індустрії?',
          options: ['Нестача комп\'ютерів', 'Конкуренція за таланти', 'Погане підключення до інтернету', 'Відсутність університетів'],
          answer: 1,
          explanation: '"Конкуренція за таланти загострюється."',
        },
      ],
    },
  ],

  C1: [
    {
      id: 'c1-zhadan',
      title: 'Сучасна українська література (Жадан)',
      type: 'literary-analysis',
      text:
        'Сергій Жадан — один із найвпливовіших українських письменників сучасності. Його проза балансує між поетичною мовою та жорстким реалізмом, створюючи унікальний голос, який резонує з досвідом цілого покоління.\n\n' +
        'У романі "Ворошиловград" (2010) Жадан досліджує тему повернення до своїх коренів. Головний герой приїздить у маленьке містечко на сході України і стикається з реальністю, яка руйнує його столичні ілюзії. Мова роману — поєднання міського сленгу, поетичних метафор та живої розмовної мови.\n\n' +
        'Після початку збройного конфлікту на Донбасі у 2014 році творчість Жадана набула нового виміру. Збірка "Месопотамія" та роман "Інтернат" стали літературним свідченням війни, яка змінила Україну. У "Інтернаті" автор показує війну очима вчителя, який намагається забрати свого племінника з інтернату в зоні бойових дій.\n\n' +
        'Жадан отримав Премію миру Німецької книготоргівлі у 2022 році — визнання, яке підкреслює значення його творчості далеко за межами України.',
      vocabulary: [
        { word: 'впливовий', definition: 'influential', example: 'Він один із найвпливовіших політиків.' },
        { word: 'резонувати', definition: 'to resonate', example: 'Ця музика резонує зі мною.' },
        { word: 'свідчення', definition: 'testimony / witness account', example: 'Книга є свідченням тих подій.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Яку тему досліджує роман "Ворошиловград"?',
          options: ['Еміграцію', 'Повернення до коренів', 'Кохання', 'Політику'],
          answer: 1,
          explanation: '"Жадан досліджує тему повернення до своїх коренів."',
        },
        {
          question: 'Чиїми очима показано війну в "Інтернаті"?',
          options: ['Солдата', 'Дитини', 'Вчителя', 'Журналіста'],
          answer: 2,
          explanation: '"Автор показує війну очима вчителя, який намагається забрати свого племінника."',
        },
        {
          question: 'Яку нагороду отримав Жадан у 2022 році?',
          options: ['Нобелівську премію', 'Шевченківську премію', 'Премію миру Німецької книготоргівлі', 'Пулітцерівську премію'],
          answer: 2,
          explanation: '"Жадан отримав Премію миру Німецької книготоргівлі у 2022 році."',
        },
        {
          question: 'Як автор характеризує мову роману "Ворошиловград"?',
          options: ['Суто академічна', 'Поєднання сленгу, метафор і розмовної мови', 'Архаїчна', 'Діалектна'],
          answer: 1,
          explanation: '"Мова роману — поєднання міського сленгу, поетичних метафор та живої розмовної мови."',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Build flat index for lookups
// ---------------------------------------------------------------------------

const ALL_TEXTS = {};
for (const level of Object.keys(TEXTS)) {
  for (const txt of TEXTS[level]) {
    txt.level = level;
    ALL_TEXTS[txt.id] = txt;
  }
}

// ---------------------------------------------------------------------------
// ReadingTutor class
// ---------------------------------------------------------------------------

class ReadingTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.level) p.level = 'A1';
    if (!p.skills) p.skills = {};
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

  // ---- Text catalog ----

  getTextCatalog(level) {
    if (level) {
      const lv = level.toUpperCase();
      return { [lv]: (TEXTS[lv] || []).map(t => ({ id: t.id, title: t.title, type: t.type })) };
    }
    const catalog = {};
    for (const lv of core.CEFR) {
      if (TEXTS[lv]) {
        catalog[lv] = TEXTS[lv].map(t => ({ id: t.id, title: t.title, type: t.type }));
      }
    }
    return catalog;
  }

  getText(studentId, textId) {
    const txt = ALL_TEXTS[textId];
    if (!txt) throw new Error('Text not found: ' + textId);
    return {
      id: txt.id,
      title: txt.title,
      type: txt.type,
      level: txt.level,
      text: txt.text,
      vocabulary: txt.vocabulary,
      questions: txt.comprehensionQuestions.map((q, i) => ({
        index: i,
        question: q.question,
        options: q.options,
      })),
    };
  }

  generateLesson(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const pool = TEXTS[level] || TEXTS.A1;
    const chosen = core.pick(pool, 1)[0];

    return {
      studentId,
      level,
      date: core.today(),
      text: {
        id: chosen.id,
        title: chosen.title,
        type: chosen.type,
        text: chosen.text,
        vocabulary: chosen.vocabulary,
        questions: chosen.comprehensionQuestions.map((q, i) => ({
          index: i,
          question: q.question,
          options: q.options,
        })),
      },
    };
  }

  // ---- Answer checking ----

  checkAnswer(studentId, textId, questionIndex, answer) {
    const txt = ALL_TEXTS[textId];
    if (!txt) throw new Error('Text not found: ' + textId);
    const qi = parseInt(questionIndex, 10);
    const q = txt.comprehensionQuestions[qi];
    if (!q) throw new Error('Question not found at index: ' + questionIndex);

    const given = parseInt(answer, 10);
    const correct = given === q.answer;

    return {
      textId,
      questionIndex: qi,
      correct,
      expected: q.options[q.answer],
      given: q.options[given] || answer,
      explanation: q.explanation,
    };
  }

  // ---- Assessment recording ----

  recordAssessment(studentId, textId, score, total) {
    const txt = ALL_TEXTS[textId];
    if (!txt) throw new Error('Text not found: ' + textId);

    const p = this.getProfile(studentId);

    if (!p.skills[textId]) {
      p.skills[textId] = {
        textId,
        level: txt.level,
        type: txt.type,
        attempts: [],
        stability: 1,
        difficulty: 5,
        lastReview: null,
        nextReview: null,
      };
    }

    const sk = p.skills[textId];
    sk.attempts.push({ score, total, date: core.today() });
    if (sk.attempts.length > 20) sk.attempts = sk.attempts.slice(-20);

    const grade = total > 0 ? Math.min(4, Math.max(1, Math.round((score / total) * 4))) : 1;
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, Math.max(1, grade));
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, Math.max(1, grade));
    sk.lastReview = core.today();
    sk.nextReview = (() => {
      const d = new Date();
      d.setDate(d.getDate() + core.fsrsNextReview(sk.stability));
      return d.toISOString().slice(0, 10);
    })();

    p.assessments.push({ textId, score, total, date: core.today() });
    this._save(p);

    return {
      studentId,
      textId,
      score,
      total,
      mastery: core.calcMastery(sk.attempts),
      masteryLabel: core.masteryLabel(core.calcMastery(sk.attempts)),
      nextReview: sk.nextReview,
    };
  }

  // ---- Progress & reports ----

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const progress = {};
    for (const [key, sk] of Object.entries(p.skills || {})) {
      progress[key] = {
        level: sk.level,
        type: sk.type,
        mastery: core.calcMastery(sk.attempts),
        masteryLabel: core.masteryLabel(core.calcMastery(sk.attempts)),
        attempts: (sk.attempts || []).length,
        nextReview: sk.nextReview,
      };
    }
    return { studentId, level: p.level, progress };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);

    const byLevel = {};
    for (const [, sk] of Object.entries(p.skills || {})) {
      if (!byLevel[sk.level]) byLevel[sk.level] = { texts: 0, mastered: 0 };
      byLevel[sk.level].texts++;
      if (core.calcMastery(sk.attempts) >= core.MASTERY_THRESHOLD) byLevel[sk.level].mastered++;
    }

    return {
      studentId,
      level: p.level,
      createdAt: p.createdAt,
      totalAssessments: (p.assessments || []).length,
      textProgress: progress.progress,
      byLevel,
      recentActivity: (p.assessments || []).slice(-10).reverse(),
    };
  }

  getNextTexts(studentId) {
    const p = this.getProfile(studentId);
    const now = core.today();
    const due = [];

    for (const [key, sk] of Object.entries(p.skills || {})) {
      if (sk.nextReview && sk.nextReview <= now) {
        due.push({
          textId: key,
          level: sk.level,
          type: sk.type,
          mastery: core.calcMastery(sk.attempts),
          dueDate: sk.nextReview,
        });
      }
    }

    const level = p.level || 'A1';
    const pool = TEXTS[level] || [];
    const tried = new Set(Object.keys(p.skills || {}));
    const newTexts = pool.filter(t => !tried.has(t.id)).map(t => ({ id: t.id, title: t.title, type: t.type }));

    return {
      studentId,
      level,
      dueForReview: due.sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
      newTexts,
    };
  }

  listStudents() {
    return core.listProfiles(this.dir);
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new ReadingTutor();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const id = args[1];
      if (!id) throw new Error('Usage: start <studentId> [level]');
      const level = args[2] || 'A1';
      if (!core.CEFR.includes(level.toUpperCase())) throw new Error('Invalid level: ' + level);
      const p = tutor.getProfile(id);
      if (!p.level) p.level = level.toUpperCase();
      tutor._save(p);
      out({ studentId: id, level: p.level, status: 'ready' });
      break;
    }
    case 'set-level': {
      const id = args[1], level = args[2];
      if (!id || !level) throw new Error('Usage: set-level <studentId> <level>');
      out(tutor.setLevel(id, level));
      break;
    }
    case 'lesson': {
      const id = args[1];
      if (!id) throw new Error('Usage: lesson <studentId>');
      out(tutor.generateLesson(id));
      break;
    }
    case 'text': {
      const id = args[1], textId = args[2];
      if (!id || !textId) throw new Error('Usage: text <studentId> <textId>');
      out(tutor.getText(id, textId));
      break;
    }
    case 'check': {
      const id = args[1], textId = args[2], qIdx = args[3], answer = args[4];
      if (!id || !textId || qIdx == null || answer == null) throw new Error('Usage: check <studentId> <textId> <qIndex> <answer>');
      out(tutor.checkAnswer(id, textId, qIdx, answer));
      break;
    }
    case 'record': {
      const id = args[1], textId = args[2], score = parseInt(args[3]), total = parseInt(args[4]);
      if (!id || !textId || isNaN(score) || isNaN(total)) throw new Error('Usage: record <studentId> <textId> <score> <total>');
      out(tutor.recordAssessment(id, textId, score, total));
      break;
    }
    case 'progress': {
      const id = args[1];
      if (!id) throw new Error('Usage: progress <studentId>');
      out(tutor.getProgress(id));
      break;
    }
    case 'report': {
      const id = args[1];
      if (!id) throw new Error('Usage: report <studentId>');
      out(tutor.getReport(id));
      break;
    }
    case 'next': {
      const id = args[1];
      if (!id) throw new Error('Usage: next <studentId>');
      out(tutor.getNextTexts(id));
      break;
    }
    case 'texts': {
      const level = args[1] || null;
      out(tutor.getTextCatalog(level));
      break;
    }
    case 'students': {
      out({ students: tutor.listStudents() });
      break;
    }
    case 'help':
      out({ commands: ['start', 'set-level', 'lesson', 'text', 'check', 'record',
                   'progress', 'report', 'next', 'texts', 'students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + cmd,
        commands: ['start', 'set-level', 'lesson', 'text', 'check', 'record',
                   'progress', 'report', 'next', 'texts', 'students'],
      });
  }
});
