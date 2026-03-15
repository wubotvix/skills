#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'belarusian-listening';

// ---------------------------------------------------------------------------
// Embedded exercise data by CEFR level
// ---------------------------------------------------------------------------

const EXERCISES = {
  A1: [
    {
      id: 'a1-dict-apteka',
      title: 'У аптэцы',
      type: 'dictation',
      transcript: 'Добры дзень. Мне трэба нешта ад галаўнога болю, калі ласка.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Добры дзень. Мне трэба нешта ад галаўнога болю, калі ласка.',
          explanation: 'Note дзень (not день — дзеканне). Галаўнога болю uses genitive case. Калі ласка = please (not Russian пожалуйста).'
        }
      ],
      vocabulary: ['галаўны боль', 'калі ласка', 'аптэка'],
      connectedSpeechFeatures: ['дзеканне: дзень']
    },
    {
      id: 'a1-dict-znakomstva',
      title: 'Знаёмства',
      type: 'dictation',
      transcript: 'Мяне завуць Марыя і мне дваццаць пяць гадоў. Я з Мінска.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Мяне завуць Марыя і мне дваццаць пяць гадоў. Я з Мінска.',
          explanation: 'Завуць (my name is, lit. they call me). Гадоў — genitive plural of год after numbers.'
        }
      ],
      vocabulary: ['завуць', 'гадоў', 'Мінск'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-mp-dzen-dym',
      title: 'Дзень vs дым',
      type: 'minimal-pairs',
      transcript: 'Сёння прыгожы ___.',
      questions: [
        {
          question: 'Which word fits: "дзень" (day) or "дым" (smoke)?',
          answer: 'дзень',
          explanation: 'A beautiful day. Note the дз [dz] sound at the start — this is дзеканне, a key Belarusian sound.'
        }
      ],
      vocabulary: ['дзень', 'дым', 'прыгожы'],
      connectedSpeechFeatures: ['дзеканне: д→дз before soft vowel']
    },
    {
      id: 'a1-mp-byts-bits',
      title: 'Быць vs біць',
      type: 'minimal-pairs',
      transcript: 'Я хачу ___ лепшым.',
      questions: [
        {
          question: 'Which word fits: "быць" [bɨtsʲ] (to be) or "біць" [bʲitsʲ] (to beat)?',
          answer: 'быць',
          explanation: 'I want to be better. The ы [ɨ] vs і [i] distinction changes meaning. Ы is a hard back vowel unique to Belarusian/Russian.'
        }
      ],
      vocabulary: ['быць', 'біць', 'лепшы'],
      connectedSpeechFeatures: ['ы vs і contrast']
    },
    {
      id: 'a1-comp-krama',
      title: 'У краме',
      type: 'comprehension',
      transcript: 'ПРАДАЎШЧЫЦА: Добры дзень. Гэта пяць рублёў пяцьдзесят капеек.\nПАКУПНІК: Вось, калі ласка. Дзесяць рублёў.\nПРАДАЎШЧЫЦА: Добра. Вашая здача: чатыры рублі пяцьдзесят. Патрэбен пакет?\nПАКУПНІК: Так, калі ласка.',
      questions: [
        {
          question: 'Колькі каштуе пакупка?',
          answer: 'пяць рублёў пяцьдзесят капеек',
          explanation: 'The seller states the price: "Гэта пяць рублёў пяцьдзесят капеек" (5.50 BYN).'
        },
        {
          question: 'Колькі плаціць пакупнік?',
          answer: 'дзесяць рублёў',
          explanation: 'The buyer hands over ten rubles.'
        },
        {
          question: 'Якая здача?',
          answer: 'чатыры рублі пяцьдзесят',
          explanation: '10.00 - 5.50 = 4.50.'
        }
      ],
      vocabulary: ['прадаўшчыца', 'здача', 'пакет', 'капеек'],
      connectedSpeechFeatures: ['дзеканне: дзесяць']
    },
    {
      id: 'a1-comp-gastsinitsa',
      title: 'У гасцініцы',
      type: 'comprehension',
      transcript: 'АДМІНІСТРАТАР: Добры вечар. У вас ёсць браніраванне?\nГОСЦЬ: Так, на імя Навіцкага. Двухмесны пакой на тры ночы.\nАДМІНІСТРАТАР: Добра. Пакой дзвесце пятнаццаць, другі паверх. Снеданак з сямой да дзесятай у сталовай.\nГОСЦЬ: Вялікі дзякуй.',
      questions: [
        {
          question: 'Які тып пакоя забраніраваны?',
          answer: 'двухмесны пакой',
          explanation: 'The guest says "двухмесны пакой" — a double room.'
        },
        {
          question: 'На колькі начэй?',
          answer: 'на тры ночы',
          explanation: '"На тры ночы" — three nights.'
        },
        {
          question: 'Калі снеданак?',
          answer: 'з сямой да дзесятай',
          explanation: 'Breakfast from seven to ten in the dining hall.'
        }
      ],
      vocabulary: ['браніраванне', 'двухмесны пакой', 'паверх', 'снеданак', 'сталовая'],
      connectedSpeechFeatures: ['дзеканне: дзвесце, дзесятай, дзякуй']
    }
  ],

  A2: [
    {
      id: 'a2-dict-nadvore',
      title: 'Прагноз надвор\'я',
      type: 'dictation',
      transcript: 'Заўтра пасля абеду будзе дождж, таму вазьміце парасон. Тэмпература будзе ад пятнаццаці да дваццаці градусаў.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Заўтра пасля абеду будзе дождж, таму вазьміце парасон. Тэмпература будзе ад пятнаццаці да дваццаці градусаў.',
          explanation: 'Note ў in заўтра [zawtra]. Пятнаццаці and дваццаці use genitive after ад...да.'
        }
      ],
      vocabulary: ['дождж', 'парасон', 'тэмпература', 'градус'],
      connectedSpeechFeatures: ['ў: заўтра']
    },
    {
      id: 'a2-dict-darogu',
      title: 'Пытаючы дарогу',
      type: 'dictation',
      transcript: 'Прабачце, ці не ведаеце, дзе знаходзіцца чыгуначны вакзал? Ідзіце проста і павярніце налева.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Прабачце, ці не ведаеце, дзе знаходзіцца чыгуначны вакзал? Ідзіце проста і павярніце налева.',
          explanation: 'Прабачце = excuse me (not Russian извините). Дзе = where (дзеканне). Знаходзіцца = is located (дзеканне).'
        }
      ],
      vocabulary: ['прабачце', 'чыгуначны вакзал', 'проста', 'павярнуць', 'налева'],
      connectedSpeechFeatures: ['дзеканне: дзе, знаходзіцца, ідзіце']
    },
    {
      id: 'a2-mp-gara-kara',
      title: 'Гара vs кара',
      type: 'minimal-pairs',
      transcript: 'Мы ўзышлі на ___.',
      questions: [
        {
          question: 'Which word fits: "гара" [ɣara] (mountain) or "кара" [kara] (punishment)?',
          answer: 'гара',
          explanation: 'We climbed the mountain. Note г [ɣ] is a velar fricative in Belarusian, not a plosive like Russian [ɡ].'
        }
      ],
      vocabulary: ['гара', 'кара', 'ўзысці'],
      connectedSpeechFeatures: ['г [ɣ] velar fricative']
    },
    {
      id: 'a2-comp-lekar',
      title: 'У лекара',
      type: 'comprehension',
      transcript: 'ЛЕКАР: Што вас турбуе?\nПАЦЫЕНТ: У мяне вельмі баліць горла і ёсць тэмпература з учора.\nЛЕКАР: Давайце паглядзім. Адкрыйце рот, калі ласка. Так, горла вельмі чырвонае. Я выпішу антыбіётык. Прымайце па адной таблетцы кожныя восем гадзін на працягу сямі дзён. І адпачывайце.\nПАЦЫЕНТ: Ці магу я ісці на працу?\nЛЕКАР: Лепш пабудзьце дома два-тры дні.',
      questions: [
        {
          question: 'Якія сімптомы ў пацыента?',
          answer: 'боль у горле і тэмпература',
          explanation: '"У мяне вельмі баліць горла і ёсць тэмпература з учора."'
        },
        {
          question: 'Як часта трэба прымаць таблетку?',
          answer: 'кожныя восем гадзін',
          explanation: '"Прымайце па адной таблетцы кожныя восем гадзін."'
        },
        {
          question: 'Колькі дзён трэба быць дома?',
          answer: 'два-тры дні',
          explanation: '"Лепш пабудзьце дома два-тры дні."'
        }
      ],
      vocabulary: ['горла', 'тэмпература', 'выпісаць', 'антыбіётык', 'таблетка', 'адпачываць'],
      connectedSpeechFeatures: ['дзеканне: паглядзім, дзён']
    },
    {
      id: 'a2-comp-plany',
      title: 'Планы на выхадныя',
      type: 'comprehension',
      transcript: 'АЛЕНА: Што ты збіраешся рабіць на гэтых выхадных?\nПАВАЛ: У суботу раніцай я іду гуляць у футбол з сябрамі. Потым хачу пайсці ў кіно. Пойдзеш з намі?\nАЛЕНА: У суботу не магу, мне трэба рыхтавацца да экзамену ў панядзелак. Але ў нядзелю я вольная.\nПАВАЛ: Тады ў нядзелю можам пайсці паабедаць у новы рэстаран, які адкрыўся ў цэнтры.',
      questions: [
        {
          question: 'Што будзе рабіць Паўал у суботу раніцай?',
          answer: 'гуляць у футбол з сябрамі',
          explanation: '"Я іду гуляць у футбол з сябрамі."'
        },
        {
          question: 'Чаму Алена не можа ў суботу?',
          answer: 'мусіць рыхтавацца да экзамену',
          explanation: '"Мне трэба рыхтавацца да экзамену ў панядзелак."'
        },
        {
          question: 'Што яны плануюць на нядзелю?',
          answer: 'пайсці паабедаць у новы рэстаран у цэнтры',
          explanation: '"Можам пайсці паабедаць у новы рэстаран, які адкрыўся ў цэнтры."'
        }
      ],
      vocabulary: ['выхадныя', 'футбол', 'кіно', 'экзамен', 'вольны'],
      connectedSpeechFeatures: ['ў: адкрыўся']
    },
    {
      id: 'a2-gap-basic',
      title: 'Запаўненне прабелаў',
      type: 'gap-fill',
      transcript: 'Я не ___ што сказаць.',
      questions: [
        {
          question: 'Fill the blank. The spoken form sounds like "Я не ведаю што сказаць".',
          answer: 'ведаю',
          explanation: '"Ведаю" (I know) — Belarusian verb. Don\'t use Russian "знаю".'
        }
      ],
      vocabulary: ['ведаць', 'сказаць'],
      connectedSpeechFeatures: []
    }
  ],

  B1: [
    {
      id: 'b1-dict-telefon',
      title: 'Тэлефонная размова',
      type: 'dictation',
      transcript: 'Слухай, а можа сустрэнемся ў суботу і сходзім на тую новую выставу, якую адкрылі ў цэнтры?',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Слухай, а можа сустрэнемся ў суботу і сходзім на тую новую выставу, якую адкрылі ў цэнтры?',
          explanation: 'Сустрэнемся (let\'s meet) — reflexive verb. Сходзім — perfective "let\'s go". Выставу — accusative of выстава.'
        }
      ],
      vocabulary: ['сустрэцца', 'выстава', 'адкрыць'],
      connectedSpeechFeatures: ['дзеканне: сходзім']
    },
    {
      id: 'b1-dict-merkavanne',
      title: 'Выказванне меркавання',
      type: 'dictation',
      transcript: 'Я лічу, што табе трэба пазваніць ёй, пакуль не стала позна, бо потым будзе цяжэй.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Я лічу, што табе трэба пазваніць ёй, пакуль не стала позна, бо потым будзе цяжэй.',
          explanation: 'Лічу (I consider/think). Бо = because (Belarusian, not Russian потому что). Цяжэй = harder (comparative).'
        }
      ],
      vocabulary: ['лічыць', 'пазваніць', 'бо'],
      connectedSpeechFeatures: ['бо vs Russian потому что']
    },
    {
      id: 'b1-comp-praca',
      title: 'Сумоўе на працу',
      type: 'comprehension',
      transcript: 'КІРАЎНІК: Раскажыце пра свой досвед працы.\nКАНДЫДАТ: Апошнія тры гады я працаваў у рэстаране "Камяніца" кельнерам. Я навучыўся працаваць з кліентамі і ў камандзе.\nКІРАЎНІК: Чаму вы хочаце змяніць працу?\nКАНДЫДАТ: Я хацеў бы развівацца ў сферы гасціннасці. Ваш рэстаран мае выдатную рэпутацыю.\nКІРАЎНІК: Які ваш графік?\nКАНДЫДАТ: Я магу працаваць увечары і на выхадных.',
      questions: [
        {
          question: 'Дзе працаваў кандыдат раней?',
          answer: 'у рэстаране "Камяніца" кельнерам',
          explanation: '"Апошнія тры гады я працаваў у рэстаране Камяніца кельнерам."'
        },
        {
          question: 'Чаму ён хоча змяніць працу?',
          answer: 'хоча развівацца ў сферы гасціннасці',
          explanation: '"Я хацеў бы развівацца ў сферы гасціннасці."'
        },
        {
          question: 'Калі ён можа працаваць?',
          answer: 'увечары і на выхадных',
          explanation: '"Я магу працаваць увечары і на выхадных."'
        }
      ],
      vocabulary: ['досвед', 'кіраўнік', 'кандыдат', 'гасціннасць', 'графік'],
      connectedSpeechFeatures: ['ў: навучыўся']
    },
    {
      id: 'b1-gap-aspekt',
      title: 'Аспект: закончаны vs незакончаны',
      type: 'gap-fill',
      transcript: 'Учора я ___ гэтую кнігу.',
      questions: [
        {
          question: 'Fill the blank. The action was completed yesterday. Choose between "чытаў" (was reading, impf.) and "прачытаў" (finished reading, pf.).',
          answer: 'прачытаў',
          explanation: '"Прачытаў" is perfective — the reading was completed. "Чытаў" would mean "I was reading" (process, not completion).'
        }
      ],
      vocabulary: ['чытаць (impf.)', 'прачытаць (pf.)'],
      connectedSpeechFeatures: ['aspect contrast']
    },
    {
      id: 'b1-langid-1',
      title: 'Мова ідэнтыфікацыя: Беларуская або Руская?',
      type: 'comprehension',
      transcript: 'Speaker says: [malaˈko], [ɣalaˈva], [dzʲɛnʲ], [ˈprawda], [bɨw]\nAnother speaker says: [mɐlaˈko], [ɡɐlaˈva], [dʲɛnʲ], [ˈpravda], [bɨl]',
      questions: [
        {
          question: 'Which speaker is using Belarusian? Explain the acoustic cues.',
          answer: 'Speaker 1 is Belarusian.',
          explanation: 'Speaker 1: full [a] in unstressed syllables (аканне), [dz] for д (дзеканне), [w] for ў (праўда), [w] in past tense (быў). Speaker 2: reduced vowels [ɐ], plosive [ɡ], [v] not [w], -л not -ў in past tense — all Russian features.'
        }
      ],
      vocabulary: ['аканне', 'дзеканне', 'ў', 'г [ɣ]'],
      connectedSpeechFeatures: ['language identification: Belarusian vs Russian']
    },
    {
      id: 'b1-comp-naviny',
      title: 'Навіны',
      type: 'note-taking',
      transcript: 'Сёння ў Мінску адкрылася новая выстава, прысвечаная творчасці Марка Шагала. Выстава размешчана ў Нацыянальным мастацкім музеі і будзе працаваць да канца сакавіка. На ёй прадстаўлена больш за пяцьдзесят работ мастака, уключаючы карціны, гравюры і малюнкі. Уваход каштуе пяць рублёў для дарослых і тры рублі для студэнтаў.',
      questions: [
        {
          question: 'Чаму прысвечана выстава?',
          answer: 'творчасці Марка Шагала',
          explanation: 'The exhibition is dedicated to the works of Marc Chagall.'
        },
        {
          question: 'Дзе размешчана выстава?',
          answer: 'у Нацыянальным мастацкім музеі',
          explanation: 'Location: National Art Museum.'
        },
        {
          question: 'Колькі работ прадстаўлена?',
          answer: 'больш за пяцьдзесят',
          explanation: 'More than fifty works.'
        },
        {
          question: 'Колькі каштуе ўваход для студэнтаў?',
          answer: 'тры рублі',
          explanation: 'Three rubles for students.'
        }
      ],
      vocabulary: ['выстава', 'творчасць', 'мастак', 'гравюра', 'уваход'],
      connectedSpeechFeatures: []
    }
  ],

  B2: [
    {
      id: 'b2-dict-mova',
      title: 'Дыскусія пра мову',
      type: 'dictation',
      transcript: 'Нягледзячы на тое, што беларуская мова мае афіцыйны статус, у штодзённым жыцці пераважае руская. Гэта стварае складаную сітуацыю для тых, хто імкнецца размаўляць па-беларуску.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Нягледзячы на тое, што беларуская мова мае афіцыйны статус, у штодзённым жыцці пераважае руская. Гэта стварае складаную сітуацыю для тых, хто імкнецца размаўляць па-беларуску.',
          explanation: 'Нягледзячы на = despite. Штодзённым = everyday (locative). Імкнецца = strives/endeavors.'
        }
      ],
      vocabulary: ['нягледзячы на', 'афіцыйны', 'пераважаць', 'імкнуцца'],
      connectedSpeechFeatures: ['дзеканне: нягледзячы']
    },
    {
      id: 'b2-comp-lektsyya',
      title: 'Лекцыя: гісторыя беларускай мовы',
      type: 'note-taking',
      transcript: 'Беларуская мова мае доўгую і складаную гісторыю. У перыяд Вялікага Княства Літоўскага старабеларуская мова была афіцыйнай мовай дзяржавы. На ёй пісаліся Статуты — юрыдычныя кодэксы, якія лічацца адным з найвялікшых дасягненняў еўрапейскай прававой думкі. Аднак пасля ўваходжання ў склад Расійскай імперыі ў васемнаццатым стагоддзі мова была паступова выціснутая з афіцыйнага ўжывання. Адраджэнне пачалося ў канцы дзевятнаццатага стагоддзя з літаратурнай дзейнасці Янкі Купалы і Якуба Коласа.',
      questions: [
        {
          question: 'Якую ролю адыгрывала старабеларуская мова ў ВКЛ?',
          answer: 'была афіцыйнай мовай дзяржавы',
          explanation: 'Old Belarusian was the official language of the Grand Duchy of Lithuania.'
        },
        {
          question: 'Што такое Статуты?',
          answer: 'юрыдычныя кодэксы ВКЛ',
          explanation: 'The Statutes were legal codes considered among the greatest achievements of European legal thought.'
        },
        {
          question: 'Калі мова была выціснутая з афіцыйнага ўжывання?',
          answer: 'пасля ўваходжання ў Расійскую імперыю ў 18-м стагоддзі',
          explanation: 'After incorporation into the Russian Empire in the 18th century.'
        },
        {
          question: 'Хто пачаў моўнае адраджэнне?',
          answer: 'Янка Купала і Якуб Колас',
          explanation: 'The revival began with the literary activities of Kupala and Kolas.'
        }
      ],
      vocabulary: ['Вялікае Княства Літоўскае', 'Статуты', 'адраджэнне', 'выціснуць'],
      connectedSpeechFeatures: ['academic register', 'дзеканне: дзяржава, дзевятнаццатага, дзейнасці']
    },
    {
      id: 'b2-mp-akanne',
      title: 'Аканне распазнаванне',
      type: 'minimal-pairs',
      transcript: 'Compare: Speaker A says [malaˈko] with full [a] vowels. Speaker B says [mɐlaˈko] with reduced vowels.',
      questions: [
        {
          question: 'Which speaker demonstrates Belarusian аканне? What is the key difference?',
          answer: 'Speaker A. Belarusian has full [a] in unstressed syllables, while Russian reduces unstressed vowels.',
          explanation: 'Аканне means unstressed о is pronounced (and written) as full [a] in Belarusian. Russian reduces it to [ɐ] or [ə]. This is the #1 acoustic cue for identifying Belarusian speech.'
        }
      ],
      vocabulary: ['аканне', 'рэдукцыя галосных'],
      connectedSpeechFeatures: ['аканне recognition']
    },
    {
      id: 'b2-gap-uu',
      title: 'Ў распазнаванне',
      type: 'gap-fill',
      transcript: 'Ён бы_ у парку.',
      questions: [
        {
          question: 'Fill the blank. The masculine past tense of быць after the subject ён.',
          answer: 'ў',
          explanation: 'Быў [bɨw] — Belarusian masculine past tense ends in -ў (not -л like Russian был). The ў [w] sound is unique to Belarusian among Slavic languages.'
        }
      ],
      vocabulary: ['быў', 'ў [w]'],
      connectedSpeechFeatures: ['ў in past tense']
    },
    {
      id: 'b2-langid-ukr',
      title: 'Мова: Беларуская або Украінская?',
      type: 'comprehension',
      transcript: 'Speaker A: [dzʲɛnʲ], [ɣara], [bɨw], [malaˈko]\nSpeaker B: [dɛnʲ], [ɦɔˈra], [buv], [mɔlɔˈkɔ]',
      questions: [
        {
          question: 'Which speaker is Belarusian and which is Ukrainian? List the cues.',
          answer: 'Speaker A is Belarusian, Speaker B is Ukrainian.',
          explanation: 'Belarusian cues: [dz] дзеканне, [ɣ] velar fricative, [w] in быў, [a] аканне. Ukrainian cues: no дзеканне [d], glottal [ɦ], [v] in був, full [ɔ] (no аканне — Ukrainian keeps о).'
        }
      ],
      vocabulary: ['дзеканне', 'аканне', 'ў'],
      connectedSpeechFeatures: ['Belarusian vs Ukrainian identification']
    }
  ],

  C1: [
    {
      id: 'c1-dict-navukovaya',
      title: 'Навуковая дыскусія',
      type: 'dictation',
      transcript: 'Можна сцвярджаць, што моўная сітуацыя ў Беларусі адлюстроўвае глыбокія гістарычныя працэсы русіфікацыі, аднак было б спрашчэннем зводзіць пытанне ідэнтычнасці выключна да моўнага выбару.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Можна сцвярджаць, што моўная сітуацыя ў Беларусі адлюстроўвае глыбокія гістарычныя працэсы русіфікацыі, аднак было б спрашчэннем зводзіць пытанне ідэнтычнасці выключна да моўнага выбару.',
          explanation: 'Academic register. Сцвярджаць = to assert. Адлюстроўвае = reflects. Спрашчэннем = oversimplification (instrumental case). Зводзіць = to reduce.'
        }
      ],
      vocabulary: ['сцвярджаць', 'адлюстроўваць', 'русіфікацыя', 'спрашчэнне', 'зводзіць'],
      connectedSpeechFeatures: ['academic register', 'complex subordination']
    },
    {
      id: 'c1-comp-debate',
      title: 'Дэбаты: мова і адукацыя',
      type: 'note-taking',
      transcript: 'СПІКЕР А: Я лічу, што выкладанне ўсіх прадметаў па-беларуску павінна быць абавязковым. Толькі так мы зможам захаваць мову для будучых пакаленняў. СПІКЕР Б: Я не згодны. Бацькі маюць права выбіраць мову навучання. Прымусовая беларусізацыя можа выклікаць адваротную рэакцыю. СПІКЕР А: Але без сістэмнага падыходу мова проста знікне. Паглядзіце на статыстыку — менш за пятнаццаць працэнтаў школ выкладаюць па-беларуску. СПІКЕР Б: Я згодны, што сітуацыя складаная, але рашэнне павінна быць паступовым і ўключаць матывацыю, а не прымус.',
      questions: [
        {
          question: 'Якую пазіцыю займае Спікер А?',
          answer: 'выкладанне ўсіх прадметаў па-беларуску павінна быць абавязковым',
          explanation: 'Speaker A advocates mandatory Belarusian-language education.'
        },
        {
          question: 'Які аргумент Спікера Б?',
          answer: 'бацькі маюць права выбіраць; прымусовая беларусізацыя можа выклікаць адваротную рэакцыю',
          explanation: 'Speaker B argues for parental choice and warns against backlash from forced policies.'
        },
        {
          question: 'Якую статыстыку прыводзіць Спікер А?',
          answer: 'менш за 15% школ выкладаюць па-беларуску',
          explanation: 'Less than 15% of schools teach in Belarusian.'
        }
      ],
      vocabulary: ['абавязковы', 'прымусовы', 'беларусізацыя', 'паступовы', 'прымус'],
      connectedSpeechFeatures: ['debate format', 'argumentation markers']
    },
    {
      id: 'c1-mp-trasiyanka',
      title: 'Трасянка распазнаванне',
      type: 'minimal-pairs',
      transcript: 'Speaker A: "Добры дзень, калі ласка, дайце мне малако і хлеб."\nSpeaker B: "Добрый дзень, пожалуйста, дайце мне малако і хлеб."',
      questions: [
        {
          question: 'Which speaker uses Trasianka? What are the Trasianka elements?',
          answer: 'Speaker B uses Trasianka.',
          explanation: '"Добрый" is Russian form (Belarusian: добры). "Пожалуйста" is Russian (Belarusian: калі ласка). Speaker B mixes Russian and Belarusian elements — this is classic Trasianka.'
        }
      ],
      vocabulary: ['трасянка', 'змешанае маўленне'],
      connectedSpeechFeatures: ['Trasianka identification']
    }
  ],

  C2: [
    {
      id: 'c2-dict-literary',
      title: 'Літаратурны ўрывак',
      type: 'dictation',
      transcript: 'Ноч ападала на вёску, як цёмная хустка на плечы змарнелай жанчыны. Зоркі блішчалі праз дзіркі ў небе, нібы хтосьці прабіваў іх цвікамі святла. І тады загаварыла зямля — ціха, як маці над калыскай.',
      questions: [
        {
          question: 'Write the literary passage you heard.',
          answer: 'Ноч ападала на вёску, як цёмная хустка на плечы змарнелай жанчыны. Зоркі блішчалі праз дзіркі ў небе, нібы хтосьці прабіваў іх цвікамі святла. І тады загаварыла зямля — ціха, як маці над калыскай.',
          explanation: 'Literary register with metaphor. Ападала = was falling. Змарнелай = worn out/exhausted (gen. adj.). Цвікамі = nails (instrumental pl.). Калыскай = cradle (instrumental).'
        }
      ],
      vocabulary: ['ападаць', 'хустка', 'змарнелы', 'зоркі', 'цвікі', 'калыска'],
      connectedSpeechFeatures: ['literary register', 'metaphorical language']
    },
    {
      id: 'c2-comp-analysis',
      title: 'Літаратурны аналіз: Васіль Быкаў',
      type: 'note-taking',
      transcript: 'Творчасць Васіля Быкава займае асаблівае месца ў беларускай літаратуры. Яго аповесці пра вайну — "Альпійская балада", "Сотнікаў", "Жураўліны крык" — перавысілі межы нацыянальнай літаратуры і сталі з\'явай сусветнага маштабу. Быкаў не апісваў бітвы і стратэгіі — ён даследаваў маральны выбар чалавека перад тварам смерці. Яго героі — не генералы, а простыя салдаты і партызаны, пастаўленыя перад немагчымым выбарам: здрада або смерць, гонар або выжыванне. Менавіта ў гэтай маральнай напружанасці і заключаецца ўніверсальнасць яго прозы.',
      questions: [
        {
          question: 'Якія творы Быкава ўзгадваюцца?',
          answer: '"Альпійская балада", "Сотнікаў", "Жураўліны крык"',
          explanation: 'Three major works are mentioned.'
        },
        {
          question: 'Чым вызначаецца падыход Быкава да тэмы вайны?',
          answer: 'ён даследаваў маральны выбар чалавека перад тварам смерці, а не апісваў бітвы і стратэгіі',
          explanation: 'Bykau explored moral choice in the face of death, not battles and strategies.'
        },
        {
          question: 'Хто яго тыповыя героі?',
          answer: 'простыя салдаты і партызаны',
          explanation: 'Ordinary soldiers and partisans, not generals.'
        },
        {
          question: 'У чым універсальнасць яго прозы?',
          answer: 'у маральнай напружанасці — дылемы здрады або смерці, гонару або выжывання',
          explanation: 'The universality lies in the moral tension of impossible choices.'
        }
      ],
      vocabulary: ['аповесць', 'маральны выбар', 'здрада', 'гонар', 'напружанасць'],
      connectedSpeechFeatures: ['academic literary analysis register']
    },
    {
      id: 'c2-langid-three',
      title: 'Тры ўсходнеславянскія мовы',
      type: 'comprehension',
      transcript: 'Speaker A: [ˈɣorat] горад, [dzʲɛnʲ] дзень, [malaˈko] малако, [bɨw] быў, [ˈprawda] праўда\nSpeaker B: [ˈɡorət] город, [dʲɛnʲ] день, [mɐlaˈko] молоко, [bɨl] был, [ˈpravda] правда\nSpeaker C: [ˈmʲistɔ] місто, [dɛnʲ] день, [mɔlɔˈkɔ] молоко, [buv] був, [ˈpravda] правда',
      questions: [
        {
          question: 'Identify each speaker\'s language and list at least 3 diagnostic features for each.',
          answer: 'A = Belarusian (г [ɣ], дзеканне [dz], аканне [a], ў [w], ў past tense). B = Russian (г [ɡ] plosive, no дзеканне, reduced vowels [ɐ], -л past tense, [v] not [w]). C = Ukrainian (different word місто, г [ɦ] glottal, full [ɔ] for о, -в past tense, no аканне).',
          explanation: 'The three East Slavic languages each have distinct phonological signatures. Belarusian: аканне + дзеканне + ў. Russian: vowel reduction + [ɡ] + -л. Ukrainian: full [ɔ] + [ɦ] + different vocabulary (місто for city).'
        }
      ],
      vocabulary: ['фанетычныя прыкметы', 'усходнеславянскія мовы'],
      connectedSpeechFeatures: ['tri-language identification']
    }
  ]
};

// ---------------------------------------------------------------------------
// Flatten exercises for quick lookup
// ---------------------------------------------------------------------------

const ALL_EXERCISES = {};
for (const level of core.CEFR) {
  if (EXERCISES[level]) {
    for (const ex of EXERCISES[level]) {
      ALL_EXERCISES[ex.id] = { ...ex, level };
    }
  }
}

// ---------------------------------------------------------------------------
// ListeningTutor class
// ---------------------------------------------------------------------------

class ListeningTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.skills) p.skills = {};
    if (!p.assessments) p.assessments = [];
    if (!p.sessions) p.sessions = [];
    if (!p.exerciseHistory) p.exerciseHistory = {};
    return p;
  }

  _save(p) { core.saveProfile(this.dir, p); }

  setLevel(studentId, level) {
    level = level.toUpperCase();
    if (!core.CEFR.includes(level)) throw new Error('Invalid CEFR level: ' + level);
    const p = this.getProfile(studentId);
    p.level = level;
    this._save(p);
    return { studentId, level };
  }

  getExerciseCatalog(level) {
    if (level) {
      return (EXERCISES[level] || []).map(e => ({
        id: e.id, title: e.title, type: e.type, level,
        questionCount: e.questions.length
      }));
    }
    const catalog = {};
    for (const lv of core.CEFR) {
      if (EXERCISES[lv]) {
        catalog[lv] = EXERCISES[lv].map(e => ({
          id: e.id, title: e.title, type: e.type,
          questionCount: e.questions.length
        }));
      }
    }
    return catalog;
  }

  generateExercise(studentId, type) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    let pool = EXERCISES[level] || EXERCISES.A1;
    if (type) {
      pool = pool.filter(e => e.type === type);
      if (!pool.length) throw new Error(`No exercises of type "${type}" at level ${level}`);
    }
    const history = p.exerciseHistory || {};
    const unseen = pool.filter(e => !history[e.id]);
    const chosen = unseen.length ? core.pick(unseen, 1)[0] : core.pick(pool, 1)[0];

    return {
      exerciseId: chosen.id,
      level,
      type: chosen.type,
      title: chosen.title,
      transcript: chosen.transcript,
      questions: chosen.questions.map((q, i) => ({ index: i, question: q.question })),
      vocabulary: chosen.vocabulary,
      connectedSpeechFeatures: chosen.connectedSpeechFeatures
    };
  }

  generateLesson(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const pool = EXERCISES[level] || EXERCISES.A1;
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

    const p = this.getProfile(studentId);
    if (!p.exerciseHistory) p.exerciseHistory = {};
    p.exerciseHistory[exerciseId] = {
      lastAttempt: core.today(),
      results,
      type: ex.type,
      level: ex.level
    };
    this._save(p);

    return { exerciseId, type: ex.type, level: ex.level, results };
  }

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

    const grade = total > 0 ? Math.min(4, Math.max(1, Math.round((score / total) * 4))) : 1;
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, Math.max(1, grade));
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, Math.max(1, grade));
    sk.lastReview = core.today();
    sk.nextReview = (() => {
      const d = new Date();
      d.setDate(d.getDate() + core.fsrsNextReview(sk.stability));
      return d.toISOString().slice(0, 10);
    })();

    p.assessments.push({ exerciseId, skillKey, score, total, date: core.today() });
    this._save(p);

    return {
      studentId, exerciseId, skillKey, score, total,
      mastery: core.calcMastery(sk.attempts),
      masteryLabel: core.masteryLabel(core.calcMastery(sk.attempts)),
      nextReview: sk.nextReview
    };
  }

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

    const byLevel = {};
    for (const [, sk] of Object.entries(p.skills || {})) {
      if (!byLevel[sk.level]) byLevel[sk.level] = { skills: 0, mastered: 0 };
      byLevel[sk.level].skills++;
      if (core.calcMastery(sk.attempts) >= core.MASTERY_THRESHOLD) byLevel[sk.level].mastered++;
    }

    return {
      studentId, level: p.level, createdAt: p.createdAt,
      totalAssessments: (p.assessments || []).length,
      skillProgress: progress.progress, byType, byLevel,
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
          skillKey: key, level: sk.level, type: sk.type,
          mastery: core.calcMastery(sk.attempts), dueDate: sk.nextReview
        });
      }
    }

    const level = p.level || 'A1';
    const pool = EXERCISES[level] || [];
    const triedTypes = new Set(Object.values(p.skills || {})
      .filter(sk => sk.level === level).map(sk => sk.type));
    const newTypes = [...new Set(pool.map(e => e.type))].filter(t => !triedTypes.has(t));

    return {
      studentId, level,
      dueForReview: due.sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
      newTypesToTry: newTypes
    };
  }

  listStudents() { return core.listProfiles(this.dir); }
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
      if (!core.CEFR.includes(level)) throw new Error('Invalid level: ' + level);
      const p = tutor.getProfile(id);
      if (!p.level) p.level = level;
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
