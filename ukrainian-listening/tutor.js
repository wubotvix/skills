#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'ukrainian-listening';

// ---------------------------------------------------------------------------
// Embedded exercise data by CEFR level
// ---------------------------------------------------------------------------

const EXERCISES = {
  A1: [
    {
      id: 'a1-dict-kaviarnia',
      title: 'У кав\'ярні',
      type: 'dictation',
      transcript: 'Добрий день. Мені, будь ласка, каву з молоком.',
      questions: [
        {
          question: 'Напишіть повне речення, яке ви почули.',
          answer: 'Добрий день. Мені, будь ласка, каву з молоком.',
          explanation: 'Note "каву" is accusative of "кава" and "молоком" is instrumental of "молоко". "Будь ласка" means please.'
        }
      ],
      vocabulary: ['кав\'ярня', 'кава', 'молоко', 'будь ласка'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-dict-znaiyomstvo',
      title: 'Знайомство',
      type: 'dictation',
      transcript: 'Мене звати Оксана. Я з Києва. Мені двадцять п\'ять років.',
      questions: [
        {
          question: 'Напишіть повне речення, яке ви почули.',
          answer: 'Мене звати Оксана. Я з Києва. Мені двадцять п\'ять років.',
          explanation: 'Note the apostrophe in п\'ять. "Києва" is genitive of "Київ" (from Kyiv). "Років" is genitive plural of "рік".'
        }
      ],
      vocabulary: ['звати', 'Київ', 'рік/років'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-mp-h-g',
      title: 'г [ɦ] vs ґ [ɡ]',
      type: 'minimal-pairs',
      transcript: 'Він любить ___ на гітарі.',
      questions: [
        {
          question: 'Яке слово підходить: "грати" [ɦratɪ] (to play) чи "ґрати" [ɡratɪ] (bars/lattice)?',
          answer: 'грати',
          explanation: '"Грати на гітарі" means to play guitar. г [ɦ] is the breathy voiced glottal fricative, the default Ukrainian "g" sound. ґ [ɡ] is the rare plosive.'
        }
      ],
      vocabulary: ['грати', 'ґрати', 'гітара'],
      connectedSpeechFeatures: ['г [ɦ] vs ґ [ɡ]']
    },
    {
      id: 'a1-mp-y-i',
      title: 'и [ɪ] vs і [i]',
      type: 'minimal-pairs',
      transcript: '___ мій найкращий друг.',
      questions: [
        {
          question: 'Яке слово підходить: "він" [wʲin] (he) чи "він" sounds the same — try: "бити" [ˈbɪtɪ] (beat) vs "біти" (doesn\'t exist). Which vowel is in "сир" — и [ɪ] or і [i]?',
          answer: 'и [ɪ]',
          explanation: 'Сир (cheese) uses и [ɪ] — the unique Ukrainian near-close near-front vowel, between Russian и and ы. It sounds like English "bit" but slightly more retracted.'
        }
      ],
      vocabulary: ['сир', 'син', 'сіль'],
      connectedSpeechFeatures: ['и [ɪ] vs і [i]']
    },
    {
      id: 'a1-comp-metro',
      title: 'У метро',
      type: 'comprehension',
      transcript: 'ПАСАЖИР: Скажіть, будь ласка, як дістатися до Хрещатика?\nКАСИР: Вам потрібна синя лінія. Їдете три зупинки.\nПАСАЖИР: Дякую! Скільки коштує квиток?\nКАСИР: Вісім гривень.',
      questions: [
        {
          question: 'Куди хоче дістатися пасажир?',
          answer: 'до Хрещатика',
          explanation: 'The passenger asks "як дістатися до Хрещатика?" — how to get to Khreshchatyk (the main street in Kyiv).'
        },
        {
          question: 'Скільки зупинок їхати?',
          answer: 'три зупинки',
          explanation: 'The cashier says "Їдете три зупинки" — ride three stops.'
        },
        {
          question: 'Скільки коштує квиток?',
          answer: 'вісім гривень',
          explanation: 'The ticket costs eight hryvnias: "Вісім гривень."'
        }
      ],
      vocabulary: ['дістатися', 'зупинка', 'квиток', 'гривня'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-comp-magazyn',
      title: 'У магазині',
      type: 'comprehension',
      transcript: 'ПРОДАВЕЦЬ: Добрий день! Чим можу допомогти?\nПОКУПЕЦЬ: Дайте, будь ласка, кілограм яблук і пів кіло сиру.\nПРОДАВЕЦЬ: Будь ласка. Ще щось?\nПОКУПЕЦЬ: Ні, дякую. Скільки з мене?\nПРОДАВЕЦЬ: Сто двадцять гривень.',
      questions: [
        {
          question: 'Що купує покупець?',
          answer: 'яблука і сир',
          explanation: 'The buyer asks for "кілограм яблук і пів кіло сиру" — a kilo of apples and half a kilo of cheese.'
        },
        {
          question: 'Скільки коштує покупка?',
          answer: 'сто двадцять гривень',
          explanation: 'The seller says "Сто двадцять гривень" — 120 hryvnias.'
        }
      ],
      vocabulary: ['продавець', 'покупець', 'кілограм', 'яблука', 'сир'],
      connectedSpeechFeatures: []
    }
  ],

  A2: [
    {
      id: 'a2-dict-doroga',
      title: 'Як пройти?',
      type: 'dictation',
      transcript: 'Вибачте, як пройти до Оперного театру? Ідіть прямо, потім поверніть ліворуч біля аптеки.',
      questions: [
        {
          question: 'Напишіть повне речення, яке ви почули.',
          answer: 'Вибачте, як пройти до Оперного театру? Ідіть прямо, потім поверніть ліворуч біля аптеки.',
          explanation: '"Оперного театру" is genitive. "Ідіть" is imperative of "іти". "Ліворуч" means to the left.'
        }
      ],
      vocabulary: ['вибачте', 'пройти', 'прямо', 'поверніть', 'ліворуч', 'аптека'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a2-dict-pohoda',
      title: 'Прогноз погоди',
      type: 'dictation',
      transcript: 'Завтра вдень буде хмарно, температура до десяти градусів. Увечері можливий дощ, візьміть парасольку.',
      questions: [
        {
          question: 'Напишіть повне речення, яке ви почули.',
          answer: 'Завтра вдень буде хмарно, температура до десяти градусів. Увечері можливий дощ, візьміть парасольку.',
          explanation: '"Вдень" (during the day), "хмарно" (cloudy), "візьміть" (imperative of "взяти"). "Парасольку" is accusative of "парасолька".'
        }
      ],
      vocabulary: ['хмарно', 'температура', 'дощ', 'парасолька'],
      connectedSpeechFeatures: ['в→[w] before consonant in "вдень"']
    },
    {
      id: 'a2-gap-fill',
      title: 'Заповніть пропуски',
      type: 'gap-fill',
      transcript: 'Я ___ знаю, що робити.',
      questions: [
        {
          question: 'Заповніть пропуск. В усному мовленні це слово часто ненаголошене: "Я не знаю, що робити."',
          answer: 'не',
          explanation: '"Не" (not) is a function word that can be weakly pronounced in connected speech, sometimes blending with the following verb.'
        }
      ],
      vocabulary: ['не', 'знати', 'робити'],
      connectedSpeechFeatures: ['weak function words']
    },
    {
      id: 'a2-mp-stress',
      title: 'Наголос: зáмок vs замóк',
      type: 'minimal-pairs',
      transcript: 'Ми відвідали старий ___.',
      questions: [
        {
          question: 'Яке слово підходить: "зáмок" (castle) чи "замóк" (lock)?',
          answer: 'зáмок',
          explanation: '"Старий зáмок" means old castle. Stress on the first syllable gives "castle"; stress on the second gives "lock". Ukrainian stress distinguishes meaning.'
        }
      ],
      vocabulary: ['зáмок (castle)', 'замóк (lock)'],
      connectedSpeechFeatures: ['stress contrast']
    },
    {
      id: 'a2-comp-likar',
      title: 'У лікаря',
      type: 'comprehension',
      transcript: 'ЛІКАР: Що вас турбує?\nПАЦІЄНТ: У мене болить горло і висока температура вже два дні.\nЛІКАР: Відкрийте рота, будь ласка. Так, горло дуже червоне. Я випишу вам ліки. Приймайте таблетки тричі на день протягом тижня. І пийте багато теплого чаю.\nПАЦІЄНТ: Чи можу я ходити на роботу?\nЛІКАР: Краще залишайтеся вдома два-три дні.',
      questions: [
        {
          question: 'Які симптоми у пацієнта?',
          answer: 'болить горло і висока температура',
          explanation: '"У мене болить горло і висока температура" — sore throat and high temperature.'
        },
        {
          question: 'Скільки разів на день приймати ліки?',
          answer: 'тричі на день',
          explanation: 'The doctor says "Приймайте таблетки тричі на день" — take tablets three times a day.'
        },
        {
          question: 'Скільки днів лікар радить не ходити на роботу?',
          answer: 'два-три дні',
          explanation: '"Краще залишайтеся вдома два-три дні" — better stay home two to three days.'
        }
      ],
      vocabulary: ['турбувати', 'горло', 'ліки', 'таблетки', 'тиждень'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a2-comp-vokzal',
      title: 'На вокзалі',
      type: 'comprehension',
      transcript: 'ПАСАЖИР: Один квиток до Львова, будь ласка.\nКАСИР: На яку дату?\nПАСАЖИР: На завтра, ранковий потяг.\nКАСИР: Є потяг о восьмій тридцять. Прибуває о чотирнадцятій. Вагон купе чи плацкарт?\nПАСАЖИР: Купе, будь ласка. Скільки коштує?\nКАСИР: Чотириста п\'ятдесят гривень.',
      questions: [
        {
          question: 'Куди їде пасажир?',
          answer: 'до Львова',
          explanation: '"Один квиток до Львова" — one ticket to Lviv.'
        },
        {
          question: 'О котрій відправляється потяг?',
          answer: 'о восьмій тридцять',
          explanation: 'The train departs at 8:30 — "о восьмій тридцять".'
        },
        {
          question: 'Скільки коштує квиток?',
          answer: 'чотириста п\'ятдесят гривень',
          explanation: '450 hryvnias — "Чотириста п\'ятдесят гривень."'
        }
      ],
      vocabulary: ['вокзал', 'квиток', 'потяг', 'вагон', 'купе', 'плацкарт'],
      connectedSpeechFeatures: []
    }
  ],

  B1: [
    {
      id: 'b1-dict-robota',
      title: 'Розмова про роботу',
      type: 'dictation',
      transcript: 'Я працюю в IT-компанії вже три роки. Мені подобається моя робота, хоча іноді буває стресово. Наша команда розробляє мобільні додатки.',
      questions: [
        {
          question: 'Напишіть повний текст, який ви почули.',
          answer: 'Я працюю в IT-компанії вже три роки. Мені подобається моя робота, хоча іноді буває стресово. Наша команда розробляє мобільні додатки.',
          explanation: '"Компанії" is locative. "Подобається" uses dative "мені". "Хоча" means although. "Розробляє" — develops.'
        }
      ],
      vocabulary: ['компанія', 'подобатися', 'хоча', 'команда', 'розробляти', 'додаток'],
      connectedSpeechFeatures: ['в→[w] before consonant']
    },
    {
      id: 'b1-dict-kyiv',
      title: 'Про Київ',
      type: 'dictation',
      transcript: 'Київ — одне з найстаріших міст Європи. Його було засновано в п\'ятому столітті. Місто розташоване на берегах Дніпра.',
      questions: [
        {
          question: 'Напишіть повний текст, який ви почули.',
          answer: 'Київ — одне з найстаріших міст Європи. Його було засновано в п\'ятому столітті. Місто розташоване на берегах Дніпра.',
          explanation: '"Найстаріших" is superlative genitive plural. "Засновано" is passive past. "Берегах" is locative plural of "берег". Note apostrophe in п\'ятому.'
        }
      ],
      vocabulary: ['найстаріший', 'засновано', 'століття', 'берег', 'Дніпро'],
      connectedSpeechFeatures: []
    },
    {
      id: 'b1-gap-aspect',
      title: 'Вид дієслова в контексті',
      type: 'gap-fill',
      transcript: 'Вчора ввечері вона довго ___ книгу, а потім ___ і пішла спати.',
      questions: [
        {
          question: 'Заповніть пропуски відповідними видовими формами дієслова "читати".',
          answer: 'читала / дочитала',
          explanation: '"Довго читала" — imperfective (process, duration); "дочитала" — perfective (completed). Aspect choice depends on whether the focus is on the process or the result.'
        }
      ],
      vocabulary: ['читати (imperf.)', 'дочитати (perf.)', 'вид дієслова'],
      connectedSpeechFeatures: ['aspect recognition in speech']
    },
    {
      id: 'b1-comp-radio',
      title: 'Новини по радіо',
      type: 'comprehension',
      transcript: 'Доброго ранку! Це ранкові новини. Головна подія дня: Верховна Рада ухвалила новий закон про освіту. Згідно з цим законом, усі школи перейдуть на українську мову навчання до кінця наступного року. Міністр освіти заявив, що реформа допоможе підвищити якість освіти в країні. Опозиція критикує закон, вважаючи терміни нереалістичними.',
      questions: [
        {
          question: 'Яку головну подію повідомляють?',
          answer: 'Верховна Рада ухвалила новий закон про освіту',
          explanation: 'The main news: parliament passed a new education law.'
        },
        {
          question: 'Коли школи мають перейти на українську мову?',
          answer: 'до кінця наступного року',
          explanation: '"Усі школи перейдуть на українську мову навчання до кінця наступного року" — by the end of next year.'
        },
        {
          question: 'Чому опозиція критикує закон?',
          answer: 'вважає терміни нереалістичними',
          explanation: 'The opposition considers the deadlines unrealistic — "вважаючи терміни нереалістичними".'
        }
      ],
      vocabulary: ['Верховна Рада', 'ухвалити', 'закон', 'освіта', 'реформа', 'опозиція'],
      connectedSpeechFeatures: ['formal register intonation']
    },
    {
      id: 'b1-note-interview',
      title: 'Інтерв\'ю з письменником',
      type: 'note-taking',
      transcript: 'ЖУРНАЛІСТ: Сергію Вікторовичу, розкажіть про ваш новий роман.\nПИСЬМЕННИК: З радістю. Мій новий роман називається "Тіні Карпат". Це історія про село в горах, яке зберігає давні традиції. Я працював над книгою два роки. Дія відбувається у тисяча дев\'ятсот тридцятих роках. Для мене було важливо показати, як люди жили до війни.\nЖУРНАЛІСТ: Коли вийде книга?\nПИСЬМЕННИК: У листопаді. Вже йде друк.',
      questions: [
        {
          question: 'Яка назва нового роману?',
          answer: 'Тіні Карпат',
          explanation: '"Мій новий роман називається «Тіні Карпат»."'
        },
        {
          question: 'Скільки часу письменник працював над книгою?',
          answer: 'два роки',
          explanation: '"Я працював над книгою два роки."'
        },
        {
          question: 'Коли відбувається дія роману?',
          answer: 'у тисяча дев\'ятсот тридцятих роках (1930-х)',
          explanation: 'The action takes place in the 1930s — "Дія відбувається у тисяча дев\'ятсот тридцятих роках."'
        },
        {
          question: 'Зверніть увагу: журналіст звертається до письменника у кличному відмінку. Яка форма?',
          answer: 'Сергію Вікторовичу',
          explanation: 'Vocative case: Сергій → Сергію, Вікторович → Вікторовичу. This is mandatory in Ukrainian direct address.'
        }
      ],
      vocabulary: ['роман', 'традиції', 'дія', 'друк', 'кличний відмінок'],
      connectedSpeechFeatures: ['vocative in natural speech']
    },
    {
      id: 'b1-mp-v-w',
      title: 'в [ʋ] vs в [w]',
      type: 'minimal-pairs',
      transcript: 'Listen for the realization of в in these words.',
      questions: [
        {
          question: 'In "вода" [wɔˈda], is the в realized as [ʋ] (approximant before vowel) or [w] (before consonant/word-final)?',
          answer: '[ʋ] or [w] — both acceptable before vowels; it varies by speaker',
          explanation: 'Ukrainian в is a labiodental approximant [ʋ] that becomes [w] before consonants (вчора [ˈwtʃɔra]) and word-finally (знов [znɔw]). Before vowels, both [ʋ] and [w] are heard.'
        }
      ],
      vocabulary: ['вода', 'вчора', 'правда', 'знов'],
      connectedSpeechFeatures: ['в allophony: [ʋ] ~ [w]']
    }
  ],

  B2: [
    {
      id: 'b2-dict-suspilstvo',
      title: 'Суспільна дискусія',
      type: 'dictation',
      transcript: 'Сучасне українське суспільство переживає значні трансформації. Децентралізація влади створює нові можливості для місцевих громад. Водночас, ці зміни вимагають відповідальності від кожного громадянина.',
      questions: [
        {
          question: 'Напишіть повний текст.',
          answer: 'Сучасне українське суспільство переживає значні трансформації. Децентралізація влади створює нові можливості для місцевих громад. Водночас, ці зміни вимагають відповідальності від кожного громадянина.',
          explanation: 'Complex vocabulary: "суспільство" (society), "децентралізація" (decentralization), "водночас" (at the same time), "громадянин" (citizen). Note consonant doubling in "відповідальності".'
        }
      ],
      vocabulary: ['суспільство', 'децентралізація', 'громада', 'водночас', 'громадянин'],
      connectedSpeechFeatures: ['formal register rhythm']
    },
    {
      id: 'b2-comp-debate',
      title: 'Телевізійна дискусія',
      type: 'comprehension',
      transcript: 'ВЕДУЧИЙ: Шановні глядачі, сьогодні ми обговорюємо питання збереження української мови. Пане професоре, як ви оцінюєте нинішню мовну ситуацію?\nПРОФЕСОР: Дякую, Андрію Олександровичу. На мою думку, ситуація покращується. За останні десять років кількість людей, які вільно володіють українською, зросла на двадцять відсотків. Проте в деяких регіонах русифікація залишається серйозною проблемою.\nВЕДУЧИЙ: А що думає наша друга гостя, пані Коваленко?\nГОСТЯ: Я вважаю, що мовне питання не можна розв\'язати лише законами. Потрібна культурна політика: фільми, музика, книжки українською.',
      questions: [
        {
          question: 'Яку тему обговорюють?',
          answer: 'збереження української мови',
          explanation: '"Ми обговорюємо питання збереження української мови" — the preservation of the Ukrainian language.'
        },
        {
          question: 'На скільки відсотків зросла кількість вільно володіючих українською?',
          answer: 'на двадцять відсотків',
          explanation: '"Кількість людей, які вільно володіють українською, зросла на двадцять відсотків."'
        },
        {
          question: 'Знайдіть кличні відмінки у тексті.',
          answer: 'Пане професоре, Андрію Олександровичу',
          explanation: 'Vocative forms: пан → пане, професор → професоре, Андрій → Андрію, Олександрович → Олександровичу. All direct address uses vocative in Ukrainian.'
        },
        {
          question: 'Що пропонує пані Коваленко?',
          answer: 'культурну політику: фільми, музику, книжки українською',
          explanation: 'She argues for cultural policy — films, music, books in Ukrainian — not just laws.'
        }
      ],
      vocabulary: ['збереження', 'володіти', 'русифікація', 'розв\'язати', 'мовне питання'],
      connectedSpeechFeatures: ['vocative in formal speech', 'formal register']
    },
    {
      id: 'b2-gap-connected',
      title: 'Зв\'язне мовлення',
      type: 'gap-fill',
      transcript: 'Що ___ він ___ на роботі?',
      questions: [
        {
          question: 'In rapid speech this sounds like [ʃtʃɔwtʃɔrawʲinbuwnarɔˈbɔtʲi]. Identify the words.',
          answer: 'Що вчора він був на роботі?',
          explanation: 'Connected speech: "що" [ʃtʃɔ], "вчора" [wtʃɔra] — в becomes [w], "він" [wʲin], "був" [buw] — final в becomes [w], "на роботі" [narɔˈbɔtʲi]. Word boundaries blur in rapid Ukrainian speech.'
        }
      ],
      vocabulary: ['вчора', 'бути', 'робота'],
      connectedSpeechFeatures: ['в→[w]', 'word boundary blurring', 'unstressed full vowels']
    },
    {
      id: 'b2-note-lecture',
      title: 'Лекція з історії',
      type: 'note-taking',
      transcript: 'Тема сьогоднішньої лекції — Козацька доба в історії України. Запорозька Січ, заснована в шістнадцятому столітті, стала унікальним явищем у європейській історії. Козаки створили військову демократію, де гетьмана обирали на загальній раді. Богдан Хмельницький очолив повстання тисяча шістсот сорок восьмого року, яке призвело до створення Козацької держави. Але Переяславська рада тисяча шістсот п\'ятдесят четвертого року поклала початок російському впливу на Україну.',
      questions: [
        {
          question: 'Коли було засновано Запорозьку Січ?',
          answer: 'у шістнадцятому столітті (16 ст.)',
          explanation: '"Запорозька Січ, заснована в шістнадцятому столітті".'
        },
        {
          question: 'Як обирали гетьмана?',
          answer: 'на загальній раді',
          explanation: '"Гетьмана обирали на загальній раді" — elected at a general council.'
        },
        {
          question: 'Яку подію згадують 1654 року?',
          answer: 'Переяславська рада',
          explanation: 'The Pereyaslav Agreement of 1654 marked the beginning of Russian influence on Ukraine.'
        }
      ],
      vocabulary: ['козацький', 'Січ', 'гетьман', 'повстання', 'Переяславська рада'],
      connectedSpeechFeatures: ['academic lecture intonation']
    },
    {
      id: 'b2-mp-shch',
      title: 'щ [ʃtʃ] — два звуки',
      type: 'minimal-pairs',
      transcript: 'Listen for Ukrainian щ vs Russian щ.',
      questions: [
        {
          question: 'In "ще" — do you hear [ʃtʃɛ] (two distinct sounds: ш+ч) or [ɕːe] (one long palatalized sound)?',
          answer: '[ʃtʃɛ] — two sounds',
          explanation: 'Ukrainian щ = [ʃtʃ], a SEQUENCE of ш + ч. Russian щ = [ɕː], one long palatalized sound. This is a key auditory cue to distinguish Ukrainian from Russian speech.'
        }
      ],
      vocabulary: ['ще', 'щастя', 'борщ', 'площа'],
      connectedSpeechFeatures: ['щ [ʃtʃ] identification']
    }
  ],

  C1: [
    {
      id: 'c1-dict-academic',
      title: 'Академічний текст',
      type: 'dictation',
      transcript: 'Дослідження засвідчує, що мовна свідомість українців зазнала суттєвих змін упродовж останнього десятиліття. Респонденти, які ідентифікують себе як україномовних, становлять нині понад шістдесят відсотків населення, що є безпрецедентним показником.',
      questions: [
        {
          question: 'Напишіть повний текст.',
          answer: 'Дослідження засвідчує, що мовна свідомість українців зазнала суттєвих змін упродовж останнього десятиліття. Респонденти, які ідентифікують себе як україномовних, становлять нині понад шістдесят відсотків населення, що є безпрецедентним показником.',
          explanation: 'Academic register: "засвідчує" (attests), "зазнала суттєвих змін" (underwent significant changes), "упродовж" (throughout), "безпрецедентний" (unprecedented). Note consonant doubling: "суттєвих".'
        }
      ],
      vocabulary: ['засвідчувати', 'свідомість', 'зазнати', 'суттєвий', 'упродовж', 'безпрецедентний'],
      connectedSpeechFeatures: ['academic tempo and rhythm']
    },
    {
      id: 'c1-comp-podcast',
      title: 'Подкаст про культуру',
      type: 'comprehension',
      transcript: 'ВЕДУЧА: Вітаю! Сьогодні у нас неймовірна гостя — Оксано Степанівно, ви щойно повернулися з Венеційської бієнале, де представляли Україну. Розкажіть про ваш проєкт.\nМИСТКИНЯ: Дякую, Маріє. Проєкт називається "Голоси землі". Це інсталяція, яка поєднує традиційні українські вишивки з цифровими технологіями. Глядач може торкнутися вишиванки, і вона "заговорить" — звучатимуть записи голосів жінок із різних регіонів України, які розповідають історії своїх родин.\nВЕДУЧА: Як відреагувала міжнародна публіка?\nМИСТКИНЯ: Неочікувано потужно. Багато хто був вражений тим, що вишивка може бути медіумом сучасного мистецтва. Проєкт отримав спеціальну відзнаку журі.',
      questions: [
        {
          question: 'Яка назва проєкту?',
          answer: 'Голоси землі',
          explanation: '"Проєкт називається «Голоси землі»."'
        },
        {
          question: 'Що поєднує інсталяція?',
          answer: 'традиційні українські вишивки з цифровими технологіями',
          explanation: 'The installation combines traditional Ukrainian embroidery with digital technologies.'
        },
        {
          question: 'Знайдіть кличні форми у діалозі.',
          answer: 'Оксано Степанівно, Маріє',
          explanation: 'Оксана → Оксано, Степанівна → Степанівно, Марія → Маріє. All vocative case.'
        },
        {
          question: 'Зверніть увагу на синтетичне майбутнє: яке слово його використовує?',
          answer: 'звучатимуть',
          explanation: '"Звучатимуть" is the synthetic future (звучати + -тимуть). This form is unique to Ukrainian — Russian uses only the analytic future.'
        }
      ],
      vocabulary: ['бієнале', 'інсталяція', 'вишивка', 'медіум', 'відзнака'],
      connectedSpeechFeatures: ['natural conversation tempo', 'synthetic future recognition']
    },
    {
      id: 'c1-note-analysis',
      title: 'Аналітичний огляд',
      type: 'note-taking',
      transcript: 'Підсумовуючи тенденції розвитку сучасної української літератури, слід зазначити кілька ключових моментів. По-перше, відбувається деканонізація — молоді автори свідомо відходять від шевченківської традиції, не заперечуючи її, а переосмислюючи. По-друге, зростає роль жіночої прози: Забужко, Матіос, Андрієвська створили новий канон. По-третє, постколоніальний дискурс визначає значну частину критичного осмислення української культурної спадщини.',
      questions: [
        {
          question: 'Назвіть три ключові тенденції.',
          answer: '1) деканонізація, 2) зростання жіночої прози, 3) постколоніальний дискурс',
          explanation: 'Three trends: decanonization of the literary tradition, rise of women\'s prose, and postcolonial discourse in critical analysis.'
        },
        {
          question: 'Яких письменниць згадано?',
          answer: 'Забужко, Матіос, Андрієвська',
          explanation: 'These three writers are named as creators of a new literary canon.'
        }
      ],
      vocabulary: ['деканонізація', 'переосмислювати', 'постколоніальний', 'дискурс', 'спадщина'],
      connectedSpeechFeatures: ['academic lecture tempo', 'complex subordination']
    }
  ],

  C2: [
    {
      id: 'c2-dict-literary',
      title: 'Літературний текст',
      type: 'dictation',
      transcript: 'І вечоріло. Сонце, мов розтоплений віск, повільно стікало за обрій. Степ замовкав, лише десь-інде озивався перепел та шелестіла трава під легким подихом вітру. Старий чумак сидів біля воза й дивився вдалечінь, згадуючи молоді літа.',
      questions: [
        {
          question: 'Напишіть повний текст.',
          answer: 'І вечоріло. Сонце, мов розтоплений віск, повільно стікало за обрій. Степ замовкав, лише десь-інде озивався перепел та шелестіла трава під легким подихом вітру. Старий чумак сидів біля воза й дивився вдалечінь, згадуючи молоді літа.',
          explanation: 'Literary register: "мов" (like/as — literary), "десь-інде" (somewhere, archaic), "перепел" (quail), "чумак" (historical — ox-cart trader), "вдалечінь" (into the distance). Note the imperfective aspect creating a descriptive, contemplative atmosphere.'
        }
      ],
      vocabulary: ['вечоріло', 'мов', 'обрій', 'десь-інде', 'перепел', 'чумак', 'вдалечінь'],
      connectedSpeechFeatures: ['literary intonation', 'slow contemplative rhythm']
    },
    {
      id: 'c2-comp-dialect',
      title: 'Діалектне мовлення',
      type: 'comprehension',
      transcript: 'ДІДУСЬ (гуцульська говірка): Ой, внучку, як я був молодий, то ходив на полонину з вівцями. Бувало, цілий місяць у горах. Варили бринзу, пекли кулешу. А вечорами грали на трембіті — далеко-далеко було чути. Тепер мало хто так живе. Молодь їде в місто.\nВНУЧКА: Діду, а ви не сумуєте за тими часами?\nДІДУСЬ: Сумую, серденько. Але час не вернеш. Головне — щоб ви пам\'ятали, звідки ваш рід.',
      questions: [
        {
          question: 'Що робив дідусь у молодості?',
          answer: 'ходив на полонину з вівцями, варив бринзу, пік кулешу, грав на трембіті',
          explanation: 'He herded sheep on mountain pastures (полонина), made brynza cheese, baked kulesh, and played the trembita (long alpine horn).'
        },
        {
          question: 'Знайдіть кличні форми.',
          answer: 'внучку, діду, серденько',
          explanation: 'Внучка → внучку, дід → діду, серденько (diminutive, already vocative-like — term of endearment). All vocative case in natural speech.'
        },
        {
          question: 'Які гуцульські/діалектні елементи ви помітили?',
          answer: 'полонина, бринза, кулеша, трембіта — regional Hutsul vocabulary',
          explanation: 'These are Hutsul cultural terms: полонина (mountain pasture), бринза (sheep cheese), кулеша (cornmeal porridge), трембіта (alpine horn). The speech also has dialectal rhythm and slightly different intonation patterns.'
        }
      ],
      vocabulary: ['полонина', 'бринза', 'кулеша', 'трембіта', 'говірка'],
      connectedSpeechFeatures: ['Hutsul dialect features', 'regional intonation']
    },
    {
      id: 'c2-note-surzhyk',
      title: 'Лінгвістичний аналіз суржику',
      type: 'note-taking',
      transcript: 'Суржик — це змішане мовлення, яке поєднує елементи української та російської мов. Термін походить від назви суміші зерен різних злаків. Лінгвісти розрізняють кілька типів суржику. Перший — фонетичний: українські слова вимовляються з російською фонетикою, наприклад, з редукцією голосних. Другий — лексичний: вживання російських слів замість українських, як-от "конєчно" замість "звичайно". Третій — граматичний: використання російських граматичних конструкцій, наприклад, "по вулиці" замість "вулицею". Для багатьох українців суржик є рідним мовленням, і його стигматизація має етичні наслідки.',
      questions: [
        {
          question: 'Назвіть три типи суржику.',
          answer: '1) фонетичний (vowel reduction), 2) лексичний (Russian words), 3) граматичний (Russian grammar)',
          explanation: 'Phonetic surzhyk: Russian pronunciation habits; lexical: Russian vocabulary substitutions; grammatical: Russian case/preposition patterns.'
        },
        {
          question: 'Який приклад лексичного суржику наведено?',
          answer: '"конєчно" замість "звичайно"',
          explanation: 'Using the Russian-influenced "конєчно" instead of standard Ukrainian "звичайно" (of course).'
        },
        {
          question: 'Яке етичне питання піднімається?',
          answer: 'стигматизація суржику як рідного мовлення',
          explanation: 'For many Ukrainians, surzhyk is their native speech, and its stigmatization raises ethical concerns.'
        }
      ],
      vocabulary: ['суржик', 'редукція', 'стигматизація', 'граматичний', 'конструкція'],
      connectedSpeechFeatures: ['academic analysis register']
    }
  ]
};

// ---------------------------------------------------------------------------
// Build flat index for lookups
// ---------------------------------------------------------------------------

const ALL_EXERCISES = {};
for (const level of Object.keys(EXERCISES)) {
  for (const ex of EXERCISES[level]) {
    ex.level = level;
    ALL_EXERCISES[ex.id] = ex;
  }
}

// ---------------------------------------------------------------------------
// Tutor class
// ---------------------------------------------------------------------------

class ListeningTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.level) p.level = 'A1';
    if (!p.skills) p.skills = {};
    if (!p.exerciseHistory) p.exerciseHistory = {};
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

  // ---- Exercise generation ----

  getExerciseCatalog(level) {
    if (level) {
      const lv = level.toUpperCase();
      return { [lv]: (EXERCISES[lv] || []).map(e => ({ id: e.id, title: e.title, type: e.type })) };
    }
    const catalog = {};
    for (const lv of core.CEFR) {
      if (EXERCISES[lv]) {
        catalog[lv] = EXERCISES[lv].map(e => ({ id: e.id, title: e.title, type: e.type }));
      }
    }
    return catalog;
  }

  generateExercise(studentId, type) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const pool = EXERCISES[level] || EXERCISES.A1;

    let filtered = type ? pool.filter(e => e.type === type) : pool;
    if (filtered.length === 0) filtered = pool;

    const chosen = core.pick(filtered, 1)[0];
    return {
      exerciseId: chosen.id,
      type: chosen.type,
      title: chosen.title,
      level,
      transcript: chosen.transcript,
      questions: chosen.questions.map((q, i) => ({
        index: i,
        question: q.question
      })),
      vocabulary: chosen.vocabulary,
      connectedSpeechFeatures: chosen.connectedSpeechFeatures
    };
  }

  generateLesson(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const pool = EXERCISES[level] || EXERCISES.A1;

    // Pick up to 4 exercises, varying types
    const types = [...new Set(pool.map(e => e.type))];
    const lesson = [];
    for (const t of core.shuffle(types).slice(0, 4)) {
      const ofType = pool.filter(e => e.type === t);
      lesson.push(core.pick(ofType, 1)[0]);
    }

    return {
      studentId,
      level,
      date: core.today(),
      exercises: lesson.map(ex => ({
        exerciseId: ex.id,
        type: ex.type,
        title: ex.title,
        transcript: ex.transcript,
        questions: ex.questions.map((q, i) => ({ index: i, question: q.question })),
        vocabulary: ex.vocabulary,
        connectedSpeechFeatures: ex.connectedSpeechFeatures
      }))
    };
  }

  // ---- Answer checking ----

  checkAnswer(studentId, exerciseId, answerText, questionIndex) {
    const ex = ALL_EXERCISES[exerciseId];
    if (!ex) throw new Error('Exercise not found: ' + exerciseId);

    const results = [];
    for (const q of ex.questions) {
      const normAnswer = core.norm(answerText);
      const normExpected = core.norm(q.answer);
      const exact = normAnswer === normExpected;
      const partial = !exact && normExpected.split(' ').filter(w =>
        normAnswer.split(' ').includes(w)
      ).length / normExpected.split(' ').length;

      results.push({
        question: q.question,
        expected: q.answer,
        given: answerText,
        correct: exact,
        partialScore: exact ? 1 : Math.round((partial || 0) * 100) / 100,
        explanation: q.explanation
      });
    }

    // Record in profile
    const p = this.getProfile(studentId);
    p.exerciseHistory[exerciseId] = {
      lastAttempt: core.today(),
      results,
      type: ex.type,
      level: ex.level
    };
    this._save(p);

    return {
      exerciseId,
      type: ex.type,
      level: ex.level,
      results
    };
  }

  // ---- Assessment recording ----

  recordAssessment(studentId, exerciseId, score, total) {
    const ex = ALL_EXERCISES[exerciseId];
    if (!ex) throw new Error('Exercise not found: ' + exerciseId);

    const p = this.getProfile(studentId);
    const skillKey = `${ex.level}-${ex.type}`;

    if (!p.skills[skillKey]) {
      p.skills[skillKey] = {
        level: ex.level,
        type: ex.type,
        attempts: [],
        stability: 1,
        difficulty: 5,
        lastReview: null,
        nextReview: null
      };
    }

    const sk = p.skills[skillKey];
    sk.attempts.push({ score, total, date: core.today(), exerciseId });
    if (sk.attempts.length > 20) sk.attempts = sk.attempts.slice(-20);

    // FSRS update
    const grade = total > 0 ? Math.min(4, Math.max(1, Math.round((score / total) * 4))) : 1;
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, Math.max(1, grade));
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, Math.max(1, grade));
    sk.lastReview = core.today();
    sk.nextReview = (() => {
      const d = new Date();
      d.setDate(d.getDate() + core.fsrsNextReview(sk.stability));
      return d.toISOString().slice(0, 10);
    })();

    p.assessments.push({
      exerciseId,
      skillKey,
      score,
      total,
      date: core.today()
    });

    this._save(p);
    return {
      studentId,
      exerciseId,
      skillKey,
      score,
      total,
      mastery: core.calcMastery(sk.attempts),
      masteryLabel: core.masteryLabel(core.calcMastery(sk.attempts)),
      nextReview: sk.nextReview
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
        nextReview: sk.nextReview
      };
    }
    return { studentId, level: p.level, progress };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);

    // Summary by type
    const byType = {};
    for (const [, sk] of Object.entries(p.skills || {})) {
      if (!byType[sk.type]) byType[sk.type] = { attempts: 0, totalScore: 0, totalPossible: 0 };
      for (const a of sk.attempts || []) {
        byType[sk.type].attempts++;
        byType[sk.type].totalScore += a.score;
        byType[sk.type].totalPossible += a.total;
      }
    }
    for (const t of Object.keys(byType)) {
      byType[t].accuracy = byType[t].totalPossible > 0
        ? Math.round(byType[t].totalScore / byType[t].totalPossible * 100) : 0;
    }

    // Summary by level
    const byLevel = {};
    for (const [, sk] of Object.entries(p.skills || {})) {
      if (!byLevel[sk.level]) byLevel[sk.level] = { skills: 0, mastered: 0 };
      byLevel[sk.level].skills++;
      if (core.calcMastery(sk.attempts) >= core.MASTERY_THRESHOLD) byLevel[sk.level].mastered++;
    }

    return {
      studentId,
      level: p.level,
      createdAt: p.createdAt,
      totalAssessments: (p.assessments || []).length,
      skillProgress: progress.progress,
      byType,
      byLevel,
      recentActivity: (p.assessments || []).slice(-10).reverse()
    };
  }

  getNextExercises(studentId) {
    const p = this.getProfile(studentId);
    const now = core.today();
    const due = [];

    for (const [key, sk] of Object.entries(p.skills || {})) {
      if (sk.nextReview && sk.nextReview <= now) {
        due.push({
          skillKey: key,
          level: sk.level,
          type: sk.type,
          mastery: core.calcMastery(sk.attempts),
          dueDate: sk.nextReview
        });
      }
    }

    // Also suggest new exercise types not yet attempted at current level
    const level = p.level || 'A1';
    const pool = EXERCISES[level] || [];
    const triedTypes = new Set(Object.values(p.skills || {})
      .filter(sk => sk.level === level)
      .map(sk => sk.type));
    const newTypes = [...new Set(pool.map(e => e.type))].filter(t => !triedTypes.has(t));

    return {
      studentId,
      level,
      dueForReview: due.sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
      newTypesToTry: newTypes
    };
  }

  // ---- Admin ----

  listStudents() {
    return core.listProfiles(this.dir);
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new ListeningTutor();

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
    case 'exercise': {
      const id = args[1], type = args[2] || null;
      if (!id) throw new Error('Usage: exercise <studentId> [type]');
      out(tutor.generateExercise(id, type));
      break;
    }
    case 'check': {
      const id = args[1], exId = args[2], answer = args.slice(3).join(' ');
      if (!id || !exId || !answer) throw new Error('Usage: check <studentId> <exerciseId> <answer>');
      out(tutor.checkAnswer(id, exId, answer, parseInt(args[4], 10) || null));
      break;
    }
    case 'record': {
      const id = args[1], exId = args[2], score = parseInt(args[3]), total = parseInt(args[4]);
      if (!id || !exId || isNaN(score) || isNaN(total)) throw new Error('Usage: record <studentId> <exerciseId> <score> <total>');
      out(tutor.recordAssessment(id, exId, score, total));
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
      out(tutor.getNextExercises(id));
      break;
    }
    case 'exercises': {
      const level = args[1] || null;
      out(tutor.getExerciseCatalog(level));
      break;
    }
    case 'students': {
      out({ students: tutor.listStudents() });
      break;
    }
    case 'help':
      out({ commands: ['start', 'set-level', 'lesson', 'exercise', 'check', 'record',
                   'progress', 'report', 'next', 'exercises', 'students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + cmd,
        commands: ['start', 'set-level', 'lesson', 'exercise', 'check', 'record',
                   'progress', 'report', 'next', 'exercises', 'students']
      });
  }
});
