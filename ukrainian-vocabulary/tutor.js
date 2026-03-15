// Ukrainian Vocabulary Tutor — complete implementation with embedded data
// Usage: node tutor.js <command> [args...]
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'ukrainian-vocabulary';
const MAX_NEW_PER_SESSION = 7;

// ─── Embedded Word Banks by CEFR Level ───────────────────────────────────────

const WORD_BANKS = {
  A1: [
    // Greetings
    { word: 'привіт', article: null, category: 'greetings', definition: 'hello (informal)',
      exampleSentence: 'Привіт, як справи?', collocations: ['привіт усім', 'сказати привіт'], falseFriends: null },
    { word: 'добрий день', article: null, category: 'greetings', definition: 'good day / hello (formal)',
      exampleSentence: 'Добрий день, пане директоре!', collocations: ['добрий ранок', 'добрий вечір'], falseFriends: null },
    { word: 'дякую', article: null, category: 'greetings', definition: 'thank you',
      exampleSentence: 'Дякую за допомогу!', collocations: ['дякую вам', 'щиро дякую'], falseFriends: { ru: 'НЕ "спасибо" — це російське слово' } },
    { word: 'будь ласка', article: null, category: 'greetings', definition: 'please / you\'re welcome',
      exampleSentence: 'Дайте мені каву, будь ласка.', collocations: ['будь ласка, сідайте'], falseFriends: { ru: 'НЕ "пожалуйста"' } },
    // Food
    { word: 'хліб', article: 'ч', category: 'food', definition: 'bread',
      exampleSentence: 'Купи хліб у магазині.', collocations: ['білий хліб', 'чорний хліб', 'шматок хліба'], falseFriends: null },
    { word: 'кава', article: 'ж', category: 'food', definition: 'coffee',
      exampleSentence: 'Я п\'ю каву щоранку.', collocations: ['кава з молоком', 'міцна кава', 'чашка кави'], falseFriends: { ru: 'НЕ "кофе" (рос.) — від польського kawa' } },
    { word: 'вода', article: 'ж', category: 'food', definition: 'water',
      exampleSentence: 'Дайте склянку води, будь ласка.', collocations: ['мінеральна вода', 'питна вода'], falseFriends: null },
    { word: 'молоко', article: 'с', category: 'food', definition: 'milk',
      exampleSentence: 'Молоко дуже корисне для здоров\'я.', collocations: ['свіже молоко', 'коров\'яче молоко'], falseFriends: null },
    // Family
    { word: 'мáма', article: 'ж', category: 'family', definition: 'mother',
      exampleSentence: 'Моя мама готує найсмачніший борщ.', collocations: ['рідна мама', 'мамо (vocative!)'], falseFriends: null },
    { word: 'тáто', article: 'ч', category: 'family', definition: 'father',
      exampleSentence: 'Мій тато працює інженером.', collocations: ['рідний тато', 'тату (vocative!)'], falseFriends: null },
    { word: 'друг', article: 'ч', category: 'family', definition: 'friend (male)',
      exampleSentence: 'Мій найкращий друг живе у Львові.', collocations: ['найкращий друг', 'вірний друг', 'друже (vocative!)'], falseFriends: null },
    { word: 'подрýга', article: 'ж', category: 'family', definition: 'friend (female)',
      exampleSentence: 'Моя подруга студентка.', collocations: ['найкраща подруга', 'подруго (vocative!)'], falseFriends: null },
    // Everyday objects
    { word: 'дім', article: 'ч', category: 'everyday', definition: 'house / home',
      exampleSentence: 'Наш дім знаходиться біля парку.', collocations: ['великий дім', 'рідний дім', 'іти додому'], falseFriends: null },
    { word: 'книжка', article: 'ж', category: 'everyday', definition: 'book',
      exampleSentence: 'Я читаю цікаву книжку.', collocations: ['нова книжка', 'книжка з бібліотеки'], falseFriends: { ru: 'кни́жка (укр.) = кни́га (рос.) — інша форма' } },
    { word: 'місто', article: 'с', category: 'everyday', definition: 'city',
      exampleSentence: 'Київ — велике і гарне місто.', collocations: ['рідне місто', 'центр міста'], falseFriends: { ru: 'місто (city) ≠ место (place) — хибний друг!' } },
    { word: 'вýлиця', article: 'ж', category: 'everyday', definition: 'street',
      exampleSentence: 'На нашій вулиці багато дерев.', collocations: ['головна вулиця', 'йти по вулиці'], falseFriends: null },
    // Time
    { word: 'день', article: 'ч', category: 'time', definition: 'day',
      exampleSentence: 'Сьогодні чудовий день.', collocations: ['щодня', 'цілий день', 'робочий день'], falseFriends: null },
    { word: 'тиждень', article: 'ч', category: 'time', definition: 'week',
      exampleSentence: 'Минулого тижня я був у Львові.', collocations: ['цього тижня', 'наступного тижня'], falseFriends: { ru: '"тиждень" ≠ "неделя" (рос.) — зовсім інше слово!' } },
    { word: 'зáраз', article: null, category: 'time', definition: 'now',
      exampleSentence: 'Я зараз зайнятий.', collocations: ['прямо зараз', 'от зараз'], falseFriends: { ru: '"зараз" ≠ "сейчас" (рос.)' } },
    { word: 'гáрний', article: null, category: 'adjectives', definition: 'beautiful / nice',
      exampleSentence: 'Яка гарна погода сьогодні!', collocations: ['гарний день', 'гарна дівчина', 'гарне місто'], falseFriends: { ru: '"гарний" — укр. слово (НЕ "красивый")' } },
  ],

  A2: [
    // Travel
    { word: 'подорож', article: 'ж', category: 'travel', definition: 'trip / journey',
      exampleSentence: 'Подорож до Одеси тривала шість годин.', collocations: ['подорож потягом', 'цікава подорож'], falseFriends: null },
    { word: 'квитóк', article: 'ч', category: 'travel', definition: 'ticket',
      exampleSentence: 'Купи квиток на потяг до Львова.', collocations: ['зворотний квиток', 'квиток в один бік'], falseFriends: null },
    { word: 'вокзáл', article: 'ч', category: 'travel', definition: 'train station',
      exampleSentence: 'Ми зустрінемося на вокзалі.', collocations: ['залізничний вокзал', 'автовокзал'], falseFriends: null },
    { word: 'парасóлька', article: 'ж', category: 'travel', definition: 'umbrella',
      exampleSentence: 'Візьми парасольку, бо буде дощ.', collocations: ['розкрити парасольку', 'складна парасолька'], falseFriends: { ru: '"парасолька" ≠ "зонтик" (рос.) — від італ. parasole' } },
    // Food (expanded)
    { word: 'борщ', article: 'ч', category: 'food', definition: 'borscht (beetroot soup)',
      exampleSentence: 'Мама варить борщ щонеділі.', collocations: ['червоний борщ', 'зелений борщ', 'тарілка борщу'], falseFriends: null },
    { word: 'варéники', article: null, category: 'food', definition: 'varenyky (dumplings)',
      exampleSentence: 'Вареники з вишнями — мої улюблені.', collocations: ['вареники з картоплею', 'ліпити вареники'], falseFriends: null },
    { word: 'рахýнок', article: 'ч', category: 'food', definition: 'bill / check (at restaurant)',
      exampleSentence: 'Рахунок, будь ласка.', collocations: ['оплатити рахунок', 'банківський рахунок'], falseFriends: null },
    // Shopping
    { word: 'магазин', article: 'ч', category: 'shopping', definition: 'shop / store',
      exampleSentence: 'Цей магазин працює до дев\'ятої.', collocations: ['продуктовий магазин', 'книжковий магазин'], falseFriends: null },
    { word: 'ціна', article: 'ж', category: 'shopping', definition: 'price',
      exampleSentence: 'Яка ціна цієї сукні?', collocations: ['висока ціна', 'за ціною'], falseFriends: null },
    { word: 'гроші', article: null, category: 'shopping', definition: 'money',
      exampleSentence: 'У мене немає грошей.', collocations: ['заробляти гроші', 'витрачати гроші'], falseFriends: null },
    { word: 'дешевий', article: null, category: 'shopping', definition: 'cheap / inexpensive',
      exampleSentence: 'Цей ресторан дуже дешевий.', collocations: ['дешевше', 'дешевий готель'], falseFriends: null },
    // Weather
    { word: 'дощ', article: 'ч', category: 'weather', definition: 'rain',
      exampleSentence: 'Надворі йде дощ.', collocations: ['сильний дощ', 'під дощем', 'іти під дощем'], falseFriends: null },
    { word: 'сонце', article: 'с', category: 'weather', definition: 'sun',
      exampleSentence: 'Сьогодні яскраво світить сонце.', collocations: ['яскраве сонце', 'сонечко (diminutive!)'], falseFriends: null },
    { word: 'хóлодно', article: null, category: 'weather', definition: 'cold (it\'s cold)',
      exampleSentence: 'Взимку в Україні дуже холодно.', collocations: ['мені холодно', 'надворі холодно'], falseFriends: null },
    // Health
    { word: 'лікар', article: 'ч', category: 'health', definition: 'doctor',
      exampleSentence: 'Мені потрібно піти до лікаря.', collocations: ['сімейний лікар', 'лікарю (vocative!)'], falseFriends: null },
    { word: 'хворий', article: null, category: 'health', definition: 'sick / ill',
      exampleSentence: 'Він хворий і не прийде на роботу.', collocations: ['захворіти', 'хвора дитина'], falseFriends: null },
    { word: 'ліки', article: null, category: 'health', definition: 'medicine / medication',
      exampleSentence: 'Лікар виписав мені ліки від кашлю.', collocations: ['приймати ліки', 'рецептурні ліки'], falseFriends: null },
    { word: 'біль', article: 'ч', category: 'health', definition: 'pain / ache',
      exampleSentence: 'У мене сильний головний біль.', collocations: ['головний біль', 'зубний біль'], falseFriends: null },
    { word: 'вибáчте', article: null, category: 'greetings', definition: 'excuse me / sorry (formal)',
      exampleSentence: 'Вибачте, як пройти до метро?', collocations: ['вибачте за затримку', 'перепрошую'],
      falseFriends: { ru: '"вибачте" ≠ "извините" (рос.)' } },
  ],

  B1: [
    // Work
    { word: 'компáнія', article: 'ж', category: 'work', definition: 'company',
      exampleSentence: 'Я працюю в IT-компанії.', collocations: ['велика компанія', 'створити компанію'], falseFriends: null },
    { word: 'нарáда', article: 'ж', category: 'work', definition: 'meeting',
      exampleSentence: 'Нарада починається о десятій.', collocations: ['виробнича нарада', 'провести нараду'], falseFriends: null },
    { word: 'зарплáта', article: 'ж', category: 'work', definition: 'salary',
      exampleSentence: 'Мені підвищили зарплату.', collocations: ['мінімальна зарплата', 'отримати зарплату'], falseFriends: null },
    { word: 'керівник', article: 'ч', category: 'work', definition: 'manager / boss',
      exampleSentence: 'Наш керівник дуже вимогливий.', collocations: ['керівник відділу', 'керівнику (vocative!)'], falseFriends: null },
    // Emotions
    { word: 'надія', article: 'ж', category: 'emotions', definition: 'hope',
      exampleSentence: 'Маю надію, що все буде добре.', collocations: ['втрачати надію', 'давати надію'], falseFriends: null },
    { word: 'пишáтися', article: null, category: 'emotions', definition: 'to be proud',
      exampleSentence: 'Я пишаюся своєю дочкою.', collocations: ['пишатися + instrumental'], falseFriends: null },
    { word: 'хвилювáтися', article: null, category: 'emotions', definition: 'to worry',
      exampleSentence: 'Не хвилюйся, все буде добре!', collocations: ['хвилюватися через + accusative', 'хвилюватися за + accusative'], falseFriends: null },
    // Ukrainian-Russian differences cluster
    { word: 'але', article: null, category: 'function', definition: 'but',
      exampleSentence: 'Він хотів, але не зміг.', collocations: ['але ж', 'але водночас'],
      falseFriends: { ru: '"але" ≠ "но" (рос.)' } },
    { word: 'або', article: null, category: 'function', definition: 'or',
      exampleSentence: 'Кава або чай?', collocations: ['або...або...'],
      falseFriends: { ru: '"або" ≠ "или" (рос.)' } },
    { word: 'дуже', article: null, category: 'function', definition: 'very',
      exampleSentence: 'Це дуже цікава книжка.', collocations: ['дуже добре', 'дуже дякую'],
      falseFriends: { ru: '"дуже" ≠ "очень" (рос.)' } },
    { word: 'завждú', article: null, category: 'function', definition: 'always',
      exampleSentence: 'Він завжди допомагає друзям.', collocations: ['як завжди', 'завжди і всюди'],
      falseFriends: { ru: '"завжди" ≠ "всегда" (рос.)' } },
    // Education
    { word: 'навчáння', article: 'с', category: 'education', definition: 'studies / education / training',
      exampleSentence: 'Навчання в університеті тривало п\'ять років.', collocations: ['дистанційне навчання', 'навчальний рік'], falseFriends: null },
    { word: 'іспит', article: 'ч', category: 'education', definition: 'exam',
      exampleSentence: 'Завтра у мене іспит з математики.', collocations: ['скласти іспит', 'вступний іспит'], falseFriends: null },
    // Daily life
    { word: 'звúчка', article: 'ж', category: 'daily', definition: 'habit / custom',
      exampleSentence: 'У мене є звичка рано вставати.', collocations: ['корисна звичка', 'шкідлива звичка', 'як завжди'], falseFriends: null },
    { word: 'переїхати', article: null, category: 'daily', definition: 'to move (change residence)',
      exampleSentence: 'Ми переїхали до нової квартири.', collocations: ['переїхати до міста', 'переїхати за кордон'], falseFriends: null },
    { word: 'цікáвий', article: null, category: 'adjectives', definition: 'interesting',
      exampleSentence: 'Це дуже цікавий фільм.', collocations: ['цікавий факт', 'мені цікаво'],
      falseFriends: { ru: '"цікавий" ≠ "интересный" (рос.) — від польс. ciekawy' } },
    { word: 'використовувати', article: null, category: 'daily', definition: 'to use',
      exampleSentence: 'Я використовую цю програму щодня.', collocations: ['використовувати можливість'],
      falseFriends: { ru: '"використовувати" ≠ "использовать" (рос.)' } },
  ],

  B2: [
    // Society
    { word: 'суспíльство', article: 'с', category: 'society', definition: 'society',
      exampleSentence: 'Сучасне суспільство швидко змінюється.', collocations: ['громадянське суспільство', 'суспільна думка'], falseFriends: null },
    { word: 'громáда', article: 'ж', category: 'society', definition: 'community',
      exampleSentence: 'Наша громада організувала благодійну акцію.', collocations: ['територіальна громада', 'об\'єднана громада'], falseFriends: null },
    { word: 'нерівність', article: 'ж', category: 'society', definition: 'inequality',
      exampleSentence: 'Соціальна нерівність залишається проблемою.', collocations: ['гендерна нерівність', 'подолати нерівність'], falseFriends: null },
    { word: 'громадянин', article: 'ч', category: 'society', definition: 'citizen',
      exampleSentence: 'Кожен громадянин має право голосу.', collocations: ['громадянин України', 'громадянине (vocative!)'], falseFriends: null },
    // Abstract
    { word: 'відтінок', article: 'ч', category: 'abstract', definition: 'nuance / shade',
      exampleSentence: 'У цій фразі є важливий відтінок.', collocations: ['смисловий відтінок', 'відтінок значення'], falseFriends: null },
    { word: 'порýшувати', article: null, category: 'abstract', definition: 'to raise (an issue) / to violate',
      exampleSentence: 'Хочу порушити важливе питання.', collocations: ['порушити питання', 'порушити закон'], falseFriends: null },
    { word: 'необхідний', article: null, category: 'abstract', definition: 'essential / necessary',
      exampleSentence: 'Словник необхідний для цього курсу.', collocations: ['необхідна умова', 'вкрай необхідний'], falseFriends: null },
    { word: 'скористáтися', article: null, category: 'abstract', definition: 'to take advantage of / make use of',
      exampleSentence: 'Скористайтеся цією нагодою.', collocations: ['скористатися можливістю', 'скористатися порадою'], falseFriends: null },
    // False friends
    { word: 'врóдливий', article: null, category: 'adjectives', definition: 'beautiful / handsome',
      exampleSentence: 'Який вродливий хлопець!', collocations: ['вродлива жінка', 'вродливе обличчя'],
      falseFriends: { ru: '"вродливий" (beautiful) ≠ "уродливый" (ugly) — ХИБНИЙ ДРУГ!' } },
    { word: 'неділя', article: 'ж', category: 'time', definition: 'Sunday',
      exampleSentence: 'У неділю ми ходимо до церкви.', collocations: ['щонеділі', 'минулої неділі'],
      falseFriends: { ru: '"неділя" (Sunday) ≠ "неделя" (week) — ХИБНИЙ ДРУГ!' } },
    { word: 'чоловік', article: 'ч', category: 'family', definition: 'husband / man',
      exampleSentence: 'Мій чоловік працює лікарем.', collocations: ['чоловік і дружина', 'молодий чоловік'],
      falseFriends: { ru: '"чоловік" (husband) ≠ "человек" (person) — ХИБНИЙ ДРУГ!' } },
    // Environment
    { word: 'довкілля', article: 'с', category: 'environment', definition: 'environment (natural)',
      exampleSentence: 'Ми повинні берегти довкілля.', collocations: ['охорона довкілля', 'забруднення довкілля'], falseFriends: null },
    { word: 'стáлий', article: null, category: 'environment', definition: 'sustainable / steady',
      exampleSentence: 'Нам потрібен сталий розвиток.', collocations: ['сталий розвиток', 'стала енергетика'], falseFriends: null },
    { word: 'ресурс', article: 'ч', category: 'environment', definition: 'resource',
      exampleSentence: 'Природні ресурси обмежені.', collocations: ['природні ресурси', 'людські ресурси'], falseFriends: null },
    { word: 'спадщина', article: 'ж', category: 'abstract', definition: 'heritage / legacy',
      exampleSentence: 'Культурна спадщина України дуже багата.', collocations: ['культурна спадщина', 'історична спадщина'], falseFriends: null },
    { word: 'рідна мова', article: null, category: 'abstract', definition: 'native language / mother tongue',
      exampleSentence: 'Українська — моя рідна мова.', collocations: ['рідна мова', 'рідномовний'], falseFriends: null },
  ],

  C1: [
    // Academic
    { word: 'сфера', article: 'ж', category: 'academic', definition: 'sphere / field',
      exampleSentence: 'У сфері освіти відбуваються значні зміни.', collocations: ['у сфері', 'сфера діяльності'], falseFriends: null },
    { word: 'розглядáти', article: null, category: 'academic', definition: 'to consider / examine',
      exampleSentence: 'Розглянемо це питання детальніше.', collocations: ['розглядати питання', 'розглядати справу'], falseFriends: null },
    { word: 'виконувати', article: null, category: 'academic', definition: 'to carry out / fulfill',
      exampleSentence: 'Він виконує важливу роль у компанії.', collocations: ['виконувати обов\'язки', 'виконувати роботу'], falseFriends: null },
    { word: 'охоплювати', article: null, category: 'academic', definition: 'to encompass / cover',
      exampleSentence: 'Дослідження охоплює десять років.', collocations: ['охоплювати період', 'охоплювати тему'], falseFriends: null },
    // Connectors
    { word: 'водночáс', article: null, category: 'connectors', definition: 'at the same time / however',
      exampleSentence: 'Він талановитий, водночас скромний.', collocations: ['водночас із тим'], falseFriends: null },
    { word: 'незважáючи на', article: null, category: 'connectors', definition: 'despite / in spite of',
      exampleSentence: 'Незважаючи на труднощі, вони продовжили.', collocations: ['незважаючи на все'], falseFriends: null },
    { word: 'натомість', article: null, category: 'connectors', definition: 'instead / on the other hand',
      exampleSentence: 'Він не прийшов. Натомість, зателефонував.', collocations: [], falseFriends: null },
    // Idiomatic
    { word: 'мати рáцію', article: null, category: 'idiomatic', definition: 'to be right',
      exampleSentence: 'Ви маєте рацію, я помилився.', collocations: ['мати рацію'], falseFriends: null },
    { word: 'брáти учáсть', article: null, category: 'idiomatic', definition: 'to participate / take part',
      exampleSentence: 'Ми беремо участь у конференції.', collocations: ['брати участь у + locative'], falseFriends: null },
    { word: 'звертáти увáгу', article: null, category: 'idiomatic', definition: 'to pay attention',
      exampleSentence: 'Зверніть увагу на ці деталі.', collocations: ['звертати увагу на + accusative'], falseFriends: null },
    // Formal/legal
    { word: 'оформлювати', article: null, category: 'formal', definition: 'to process / handle (paperwork)',
      exampleSentence: 'Потрібно оформити документи.', collocations: ['оформити візу', 'оформити заявку'], falseFriends: null },
    { word: 'чинний', article: null, category: 'formal', definition: 'in force / current / valid',
      exampleSentence: 'Чинне законодавство забороняє це.', collocations: ['чинний закон', 'чинна норма'], falseFriends: null },
    { word: 'ухвáлити', article: null, category: 'formal', definition: 'to adopt / pass (a law)',
      exampleSentence: 'Рада ухвалила новий закон.', collocations: ['ухвалити рішення', 'ухвалити закон'], falseFriends: null },
    { word: 'упродовж', article: null, category: 'formal', definition: 'throughout / during',
      exampleSentence: 'Упродовж тижня відбудуться зміни.', collocations: ['упродовж року', 'упродовж усього часу'], falseFriends: null },
    // Abstract
    { word: 'поступóвий', article: null, category: 'abstract', definition: 'gradual',
      exampleSentence: 'Спостерігається поступовий прогрес.', collocations: ['поступова зміна', 'поступовий перехід'], falseFriends: null },
    { word: 'невідкладний', article: null, category: 'abstract', definition: 'urgent / pressing',
      exampleSentence: 'Це невідкладне питання.', collocations: ['невідкладна допомога', 'невідкладна потреба'], falseFriends: null },
  ],

  C2: [
    // Literary
    { word: 'марнотá', article: 'ж', category: 'literary', definition: 'vanity / futility',
      exampleSentence: 'Все — марнота, говорив Еклезіяст.', collocations: ['марнота марнот'], falseFriends: null },
    { word: 'стáтися', article: null, category: 'literary', definition: 'to happen / occur (literary)',
      exampleSentence: 'Що сталося того вечора, змінило все.', collocations: ['сталося так, що'], falseFriends: null },
    { word: 'розмéжування', article: 'с', category: 'literary', definition: 'demarcation / delimitation',
      exampleSentence: 'Розмежування понять є необхідним.', collocations: ['розмежування відповідальності'], falseFriends: null },
    // Proverbs
    { word: 'не кажи гоп', article: null, category: 'idiomatic', definition: 'don\'t count your chickens (lit: don\'t say "hop")',
      exampleSentence: 'Не кажи гоп, поки не перескочиш.', collocations: [], falseFriends: null },
    { word: 'як кіт наплакав', article: null, category: 'idiomatic', definition: 'very little (lit: as much as a cat cried)',
      exampleSentence: 'Грошей у мене — як кіт наплакав.', collocations: [], falseFriends: null },
    { word: 'робити з мухи слона', article: null, category: 'idiomatic', definition: 'make a mountain of a molehill (lit: make elephant from fly)',
      exampleSentence: 'Не роби з мухи слона!', collocations: [], falseFriends: null },
    // Diminutives
    { word: 'сонечко', article: 'с', category: 'diminutive', definition: 'little sun (term of endearment)',
      exampleSentence: 'Доброго ранку, сонечко!', collocations: ['моє сонечко'], falseFriends: { note: 'Diminutive of сонце — used as a term of endearment' } },
    { word: 'серденько', article: 'с', category: 'diminutive', definition: 'little heart (term of endearment)',
      exampleSentence: 'Не плач, серденько.', collocations: ['моє серденько'], falseFriends: { note: 'Diminutive of серце' } },
    // Academic
    { word: 'уникати', article: null, category: 'academic', definition: 'to avoid',
      exampleSentence: 'Слід уникати надмірних узагальнень.', collocations: ['уникати помилок', 'уникати відповідальності'], falseFriends: null },
    { word: 'лежáти в óснові', article: null, category: 'academic', definition: 'to underlie',
      exampleSentence: 'Ці причини лежать в основі конфлікту.', collocations: ['лежати в основі'], falseFriends: null },
    { word: 'з\'ясувáти', article: null, category: 'academic', definition: 'to clarify / elucidate',
      exampleSentence: 'Спробуємо з\'ясувати причини.', collocations: ['з\'ясувати обставини', 'з\'ясувати питання'], falseFriends: null },
    { word: 'висувáти', article: null, category: 'academic', definition: 'to put forward / advance (argument)',
      exampleSentence: 'Він висунув переконливі аргументи.', collocations: ['висувати аргументи', 'висувати гіпотезу'], falseFriends: null },
    // Register
    { word: 'халепа', article: 'ж', category: 'colloquial', definition: 'trouble / pickle (informal)',
      exampleSentence: 'От халепа, знову запізнився!', collocations: ['от халепа'], falseFriends: null },
    { word: 'файний', article: null, category: 'regional', definition: 'nice / fine (western Ukrainian)',
      exampleSentence: 'Файна погода сьогодні!', collocations: ['файний хлопець'],
      falseFriends: { note: 'Western Ukrainian (Galician). Standard: гарний.' } },
  ],
};

// ─── Exercise Types ──────────────────────────────────────────────────────────

const EXERCISE_TYPES = ['definition', 'fill-in-blank', 'matching', 'context-guess', 'collocation'];

function makeDefinitionExercise(targetWord, level) {
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const distractors = core.pick(bank.filter(w => w.word !== targetWord.word), 3)
    .map(w => w.definition);
  const options = core.shuffle([targetWord.definition, ...distractors]);
  return {
    type: 'definition',
    prompt: `Що означає "${targetWord.article ? targetWord.article + '. ' : ''}${targetWord.word}"?`,
    options,
    answer: targetWord.definition,
    word: targetWord.word,
  };
}

function makeFillInBlankExercise(targetWord) {
  const sentence = targetWord.exampleSentence;
  const escapedWord = targetWord.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedWord, 'i');
  const blanked = sentence.replace(regex, '________');
  if (blanked === sentence) {
    return {
      type: 'fill-in-blank',
      prompt: `Доповніть речення правильним словом:\n"${sentence.replace(targetWord.word, '________')}"`,
      answer: targetWord.word,
      hint: targetWord.definition,
      word: targetWord.word,
    };
  }
  return {
    type: 'fill-in-blank',
    prompt: `Заповніть пропуск:\n"${blanked}"`,
    answer: targetWord.word,
    hint: targetWord.definition,
    word: targetWord.word,
  };
}

function makeMatchingExercise(level) {
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const items = core.pick(bank, 5);
  const pairs = items.map(w => ({
    word: (w.article ? w.article + '. ' : '') + w.word,
    definition: w.definition,
  }));
  return {
    type: 'matching',
    prompt: 'Підберіть кожне слово до його визначення.',
    pairs,
    shuffledDefinitions: core.shuffle(pairs.map(p => p.definition)),
    words: pairs.map(p => p.word),
  };
}

function makeContextGuessExercise(targetWord) {
  return {
    type: 'context-guess',
    prompt: `Прочитайте речення і вгадайте значення слова:\n"${targetWord.exampleSentence}"\n\nЩо означає "${targetWord.word}"?`,
    answer: targetWord.definition,
    word: targetWord.word,
    falseFriends: targetWord.falseFriends,
  };
}

function makeCollocationExercise(targetWord, level) {
  if (!targetWord.collocations || targetWord.collocations.length === 0) {
    return makeDefinitionExercise(targetWord, level);
  }
  const correctCollocation = core.pick(targetWord.collocations, 1)[0];
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const otherCollocations = [];
  for (const w of core.shuffle(bank)) {
    if (w.word !== targetWord.word && w.collocations && w.collocations.length) {
      otherCollocations.push(w.collocations[0]);
      if (otherCollocations.length >= 3) break;
    }
  }
  const options = core.shuffle([correctCollocation, ...otherCollocations]);
  return {
    type: 'collocation',
    prompt: `Яка типова колокація зі словом "${targetWord.article ? targetWord.article + '. ' : ''}${targetWord.word}"?`,
    options,
    answer: correctCollocation,
    word: targetWord.word,
  };
}

function generateExercise(targetWord, level, type) {
  switch (type) {
    case 'fill-in-blank': return makeFillInBlankExercise(targetWord);
    case 'matching': return makeMatchingExercise(level);
    case 'context-guess': return makeContextGuessExercise(targetWord);
    case 'collocation': return makeCollocationExercise(targetWord, level);
    default: return makeDefinitionExercise(targetWord, level);
  }
}

// ─── Answer Checking ─────────────────────────────────────────────────────────

function checkAnswer(exercise, userAnswer) {
  const normalise = s => core.norm(s);
  if (exercise.type === 'matching') {
    if (!Array.isArray(userAnswer)) return { correct: false, message: 'Надайте відповідні пари.' };
    const correctCount = userAnswer.filter(ua =>
      exercise.pairs.some(p => normalise(p.word) === normalise(ua.word) && normalise(p.definition) === normalise(ua.definition))
    ).length;
    return {
      correct: correctCount === exercise.pairs.length,
      score: correctCount,
      total: exercise.pairs.length,
      message: correctCount === exercise.pairs.length ? 'Чудово!' : `${correctCount}/${exercise.pairs.length} правильно.`,
    };
  }

  const expected = normalise(exercise.answer);
  const given = normalise(userAnswer);

  if (given === expected) {
    return { correct: true, message: 'Правильно! Молодець!' };
  }

  if (expected.includes(given) && given.length > 2) {
    return { correct: true, partial: true, message: `Майже! Повна відповідь: "${exercise.answer}".` };
  }

  return {
    correct: false,
    message: `Не зовсім. Правильна відповідь: "${exercise.answer}".`,
    expected: exercise.answer,
  };
}

// ─── VocabularyTutor Class ───────────────────────────────────────────────────

class VocabularyTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.level) p.level = 'A1';
    if (!p.skills) p.skills = {};
    if (!p.sessions) p.sessions = [];
    return p;
  }

  setLevel(studentId, level) {
    level = level.toUpperCase();
    if (!core.CEFR.includes(level)) throw new Error(`Invalid CEFR level: ${level}`);
    const p = this.getProfile(studentId);
    p.level = level;
    core.saveProfile(this.dir, p);
    return { studentId, level };
  }

  generateLesson(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const bank = WORD_BANKS[level];
    if (!bank) throw new Error(`No word bank for level ${level}`);

    const seen = Object.keys(p.skills);
    const unseen = bank.filter(w => !seen.includes(w.word));
    const newWords = core.pick(unseen.length > 0 ? unseen : bank, Math.min(MAX_NEW_PER_SESSION, unseen.length || MAX_NEW_PER_SESSION));

    const exercises = newWords.map((w, i) => {
      const type = EXERCISE_TYPES[i % EXERCISE_TYPES.length];
      return generateExercise(w, level, type);
    });

    return {
      date: core.today(),
      level,
      newWords: newWords.map(w => ({
        word: w.word,
        article: w.article,
        definition: w.definition,
        exampleSentence: w.exampleSentence,
        collocations: w.collocations,
        falseFriends: w.falseFriends,
        category: w.category,
      })),
      exercises,
    };
  }

  generateExercise(studentId, type) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const bank = WORD_BANKS[level];
    if (!bank) throw new Error(`No word bank for level ${level}`);
    const targetWord = core.pick(bank, 1)[0];
    const exType = type && EXERCISE_TYPES.includes(type) ? type : core.pick(EXERCISE_TYPES, 1)[0];
    return generateExercise(targetWord, level, exType);
  }

  checkAnswer(exercise, userAnswer) {
    return checkAnswer(exercise, userAnswer);
  }

  recordAssessment(studentId, word, grade) {
    if (!core.isValidGrade(grade, 1, 4)) throw new Error('Grade must be 1-4 (1=forgot, 2=hard, 3=good, 4=easy)');
    const p = this.getProfile(studentId);

    if (!p.skills[word]) {
      p.skills[word] = {
        word,
        encounters: 0,
        stability: 1,
        difficulty: 5,
        lastReview: null,
        nextReview: null,
        attempts: [],
      };
    }
    const sk = p.skills[word];
    sk.encounters += 1;
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, grade);
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, grade);
    sk.lastReview = core.today();
    sk.nextReview = (() => {
      const days = core.fsrsNextReview(sk.stability, core.DEFAULT_RETENTION);
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    })();
    sk.attempts.push({ score: grade >= 3 ? 1 : 0, total: 1, date: core.today() });

    p.assessments.push({ word, grade, date: core.today() });
    core.saveProfile(this.dir, p);

    return {
      word,
      grade,
      mastery: core.masteryLabel(core.calcMastery(sk.attempts)),
      nextReview: sk.nextReview,
      encounters: sk.encounters,
    };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const bankSize = (WORD_BANKS[level] || []).length;
    const words = Object.keys(p.skills);
    const masteryMap = {};
    let masteredCount = 0;
    let totalEncounters = 0;

    for (const w of words) {
      const sk = p.skills[w];
      const m = core.calcMastery(sk.attempts);
      masteryMap[w] = { mastery: m, label: core.masteryLabel(m), encounters: sk.encounters };
      if (m >= core.MASTERY_THRESHOLD) masteredCount++;
      totalEncounters += sk.encounters;
    }

    return {
      studentId,
      level,
      wordsStudied: words.length,
      wordsMastered: masteredCount,
      totalInLevel: bankSize,
      totalEncounters,
      words: masteryMap,
    };
  }

  getNextTopics(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const bank = WORD_BANKS[level] || [];
    const seen = new Set(Object.keys(p.skills));
    const unseen = bank.filter(w => !seen.has(w.word));

    const categories = {};
    for (const w of unseen) {
      if (!categories[w.category]) categories[w.category] = [];
      categories[w.category].push(w.word);
    }

    return { level, unseenCount: unseen.length, byCategory: categories };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const review = this.getReviewDue(studentId);

    return {
      studentId,
      level: p.level,
      createdAt: p.createdAt,
      sessionsCount: p.assessments.length,
      ...progress,
      reviewDueCount: review.length,
      reviewDueWords: review.map(r => r.word),
    };
  }

  listStudents() {
    return core.listProfiles(this.dir);
  }

  getWordCatalog(level) {
    const lvl = level && core.CEFR.includes(level) ? level : null;
    if (lvl) {
      return { [lvl]: (WORD_BANKS[lvl] || []).map(w => ({ word: w.word, article: w.article, definition: w.definition, category: w.category })) };
    }
    const catalog = {};
    for (const l of core.CEFR) {
      if (WORD_BANKS[l]) {
        catalog[l] = WORD_BANKS[l].map(w => ({ word: w.word, article: w.article, definition: w.definition, category: w.category }));
      }
    }
    return catalog;
  }

  getReviewDue(studentId) {
    const p = this.getProfile(studentId);
    const t = core.today();
    const due = [];
    for (const [word, sk] of Object.entries(p.skills)) {
      if (sk.nextReview && sk.nextReview <= t) {
        due.push({ word, nextReview: sk.nextReview, encounters: sk.encounters, mastery: core.masteryLabel(core.calcMastery(sk.attempts)) });
      }
    }
    return due.sort((a, b) => a.nextReview.localeCompare(b.nextReview));
  }
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

const tutor = new VocabularyTutor();

core.runCLI((cmd, args, out) => {
  const sid = args[1] || 'default';
  switch (cmd) {
    case 'start':
      out(tutor.getProfile(sid));
      break;
    case 'set-level':
      out(tutor.setLevel(sid, (args[2] || '').toUpperCase()));
      break;
    case 'lesson':
      out(tutor.generateLesson(sid));
      break;
    case 'exercise':
      out(tutor.generateExercise(sid, args[2]));
      break;
    case 'check': {
      const ex = JSON.parse(args[2]);
      const ans = args.slice(3).join(' ');
      out(tutor.checkAnswer(ex, ans));
      break;
    }
    case 'record':
      out(tutor.recordAssessment(sid, args[2], parseInt(args[3], 10)));
      break;
    case 'review':
      out(tutor.getReviewDue(sid));
      break;
    case 'progress':
      out(tutor.getProgress(sid));
      break;
    case 'report':
      out(tutor.getReport(sid));
      break;
    case 'next':
      out(tutor.getNextTopics(sid));
      break;
    case 'words':
      out(tutor.getWordCatalog(args[1] ? args[2].toUpperCase() : null));
      break;
    case 'students':
      out({ students: tutor.listStudents() });
      break;
    case 'help':
      out({ info: 'Use one of the commands listed in SKILL.md' });
      break;
    default:
      out({
        usage: 'node tutor.js <command> [studentId] [args...]',
        commands: {
          start: 'Load or create student profile',
          'set-level': 'Set CEFR level (A1-C2)',
          lesson: 'Generate a lesson with new words + exercises',
          exercise: 'Generate a single exercise [type]',
          check: 'Check answer: check <id> <exerciseJSON> <answer>',
          record: 'Record assessment: record <id> <word> <grade 1-4>',
          review: 'Get words due for review',
          progress: 'Show progress summary',
          report: 'Full student report',
          next: 'Show upcoming topics by category',
          words: 'Show word catalog [level]',
          students: 'List all students',
        },
      });
  }
});
