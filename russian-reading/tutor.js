#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'russian-reading';

// ---------------------------------------------------------------------------
// Embedded reading texts by CEFR level
// ---------------------------------------------------------------------------

const TEXTS = {
  A1: [
    {
      id: 'a1-cafe',
      title: 'В кафе́',
      type: 'dialogue',
      text:
        '— Здра́вствуйте. Что вы бу́дете?\n' +
        '— Здра́вствуйте. Мне оди́н ко́фе с молоко́м, пожа́луйста.\n' +
        '— Большо́й и́ли ма́ленький?\n' +
        '— Большо́й. И ещё оди́н бутербро́д.\n' +
        '— Хорошо́. С вас три́ста пятьдеся́т рубле́й.\n' +
        '— Вот, пожа́луйста. Спаси́бо.\n' +
        '— Прия́тного аппети́та!',
      vocabulary: [
        { word: 'бу́дете', definition: 'will you have (formal)', example: 'Что вы бу́дете пить?' },
        { word: 'бутербро́д', definition: 'sandwich (open-faced)', example: 'Бутербро́д с сы́ром.' },
        { word: 'прия́тного аппети́та', definition: 'enjoy your meal', example: 'Прия́тного аппети́та всем!' },
      ],
      comprehensionQuestions: [
        {
          question: 'Что зака́зывает клие́нт?',
          options: ['Чай', 'Ко́фе с молоко́м', 'Сок', 'Воду́'],
          answer: 1,
          explanation: 'Клие́нт говори́т: "Мне оди́н ко́фе с молоко́м."',
        },
        {
          question: 'Како́й разме́р ко́фе?',
          options: ['Ма́ленький', 'Сре́дний', 'Большо́й', 'Не говори́т'],
          answer: 2,
          explanation: 'На вопро́с "Большо́й и́ли ма́ленький?" он отвеча́ет "Большо́й."',
        },
        {
          question: 'Ско́лько сто́ит зака́з?',
          options: ['Две́сти рубле́й', 'Три́ста рубле́й', 'Три́ста пятьдеся́т рубле́й', 'Пятьсо́т рубле́й'],
          answer: 2,
          explanation: 'Продаве́ц говори́т: "С вас три́ста пятьдеся́т рубле́й."',
        },
      ],
    },
    {
      id: 'a1-familia',
      title: 'Моя́ семья́',
      type: 'narrative',
      text:
        'Меня́ зову́т А́нна. Мне два́дцать пять лет. Я живу́ в Москве́. Моя́ семья́ небольша́я. ' +
        'Мой оте́ц — Ива́н Петро́вич. Ему́ пятьдеся́т два го́да. Он врач. Моя́ ма́ма — ' +
        'Мари́я Серге́евна. Ей со́рок де́вять лет. Она́ учи́тельница. У меня́ есть брат. ' +
        'Его́ зову́т Пётр. Ему́ два́дцать два го́да. Пётр у́чится в университе́те. ' +
        'По выходны́м мы обе́даем вме́сте у роди́телей.',
      vocabulary: [
        { word: 'живу́', definition: 'I live', example: 'Я живу́ в большо́м го́роде.' },
        { word: 'учи́тельница', definition: 'teacher (female)', example: 'Учи́тельница рабо́тает в шко́ле.' },
        { word: 'по выходны́м', definition: 'on weekends', example: 'По выходны́м я отдыха́ю.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Где живёт А́нна?',
          options: ['В Петербу́рге', 'В Москве́', 'В Каза́ни', 'В Новосиби́рске'],
          answer: 1,
          explanation: 'А́нна говори́т: "Я живу́ в Москве́."',
        },
        {
          question: 'Кто по профе́ссии ма́ма А́нны?',
          options: ['Врач', 'Медсестра́', 'Учи́тельница', 'Инжене́р'],
          answer: 2,
          explanation: 'В те́ксте: "Моя́ ма́ма — Мари́я Серге́евна. Она́ учи́тельница."',
        },
        {
          question: 'Что де́лает Пётр?',
          options: ['Рабо́тает', 'У́чится в университе́те', 'Путеше́ствует', 'Гото́вит'],
          answer: 1,
          explanation: 'В те́ксте: "Пётр у́чится в университе́те."',
        },
      ],
    },
    {
      id: 'a1-den',
      title: 'Мой день',
      type: 'narrative',
      text:
        'Ка́ждый день я встаю́ в семь часо́в утра́. За́втракаю ко́фе и ка́шу. ' +
        'В во́семь часо́в я е́ду на рабо́ту на метро́. Я рабо́таю в о́фисе с девяти́ до пяти́. ' +
        'В обе́д я ем бутербро́д в па́рке. Ве́чером я возвраща́юсь домо́й и гото́влю у́жин. ' +
        'Пото́м я смотрю́ телеви́зор и́ли чита́ю кни́гу. Я ложу́сь спать в оди́ннадцать.',
      vocabulary: [
        { word: 'встаю́', definition: 'I get up', example: 'Я встаю́ ра́но.' },
        { word: 'е́ду', definition: 'I go (by transport)', example: 'Я е́ду на рабо́ту на авто́бусе.' },
        { word: 'ложу́сь спать', definition: 'I go to bed', example: 'Я ложу́сь спать по́здно в пя́тницу.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Как челове́к е́дет на рабо́ту?',
          options: ['На авто́бусе', 'На маши́не', 'На метро́', 'Пешко́м'],
          answer: 2,
          explanation: 'В те́ксте: "Я е́ду на рабо́ту на метро́."',
        },
        {
          question: 'Где он обе́дает?',
          options: ['В рестора́не', 'В о́фисе', 'В па́рке', 'До́ма'],
          answer: 2,
          explanation: 'В те́ксте: "В обе́д я ем бутербро́д в па́рке."',
        },
        {
          question: 'Когда́ он ложи́тся спать?',
          options: ['В де́сять', 'В оди́ннадцать', 'В двена́дцать', 'Не говори́т'],
          answer: 1,
          explanation: 'В те́ксте: "Я ложу́сь спать в оди́ннадцать."',
        },
      ],
    },
  ],

  A2: [
    {
      id: 'a2-market',
      title: 'На ры́нке',
      type: 'dialogue',
      text:
        '— Здра́вствуйте! Ско́лько сто́ят э́ти помидо́ры?\n' +
        '— Две́сти рубле́й за килогра́мм.\n' +
        '— А ого́рцы?\n' +
        '— Сто пятьдеся́т. Бери́те, о́чень све́жие, сего́дня с да́чи.\n' +
        '— Да́йте, пожа́луйста, килогра́мм помидо́ров и полкило́ огурцо́в.\n' +
        '— Пожа́луйста. С вас две́сти се́мьдесят пять рубле́й.\n' +
        '— Вот три́ста. Сда́чу не на́до.\n' +
        '— Спаси́бо! Прихо́дите ещё!',
      vocabulary: [
        { word: 'ры́нок', definition: 'market', example: 'По суббо́там я хожу́ на ры́нок.' },
        { word: 'да́ча', definition: 'country house / dacha', example: 'Ле́том мы живём на да́че.' },
        { word: 'сда́ча', definition: 'change (money)', example: 'Вот ва́ша сда́ча — два́дцать пять рубле́й.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Ско́лько сто́ят помидо́ры?',
          options: ['Сто рубле́й', 'Сто пятьдеся́т', 'Две́сти рубле́й', 'Три́ста рубле́й'],
          answer: 2,
          explanation: 'Продаве́ц говори́т: "Две́сти рубле́й за килогра́мм."',
        },
        {
          question: 'Отку́да о́вощи?',
          options: ['Из магази́на', 'Из теплíцы', 'С да́чи', 'Из Ту́рции'],
          answer: 2,
          explanation: 'Продаве́ц говори́т: "Сего́дня с да́чи."',
        },
        {
          question: 'Ско́лько покупа́тель заплати́л?',
          options: ['Две́сти се́мьдесят пять', 'Две́сти', 'Три́ста', 'Три́ста пятьдеся́т'],
          answer: 2,
          explanation: 'Покупа́тель даёт три́ста и говори́т "Сда́чу не на́до."',
        },
      ],
    },
    {
      id: 'a2-weekend',
      title: 'Как я провёл выходны́е',
      type: 'narrative',
      text:
        'В суббо́ту у́тром я встал по́здно — в де́сять часо́в. Позáвтракал и пошёл ' +
        'гуля́ть в парк. Пого́да была́ прекра́сная — со́лнечно и тепло́. В па́рке я ' +
        'встре́тил свою́ подру́гу О́лю. Мы вме́сте пообе́дали в небольшо́м кафе́ ' +
        'о́коло метро́. Пото́м мы пошли́ в кино́ и посмотре́ли но́вый росси́йский фильм. ' +
        'Фильм нам о́чень понра́вился. В воскресе́нье я весь день был до́ма — ' +
        'убира́лся, гото́вил еду́ на неде́лю и чита́л кни́гу.',
      vocabulary: [
        { word: 'провёл', definition: 'spent (time)', example: 'Я хорошо́ провёл ве́чер.' },
        { word: 'встре́тил', definition: 'met', example: 'Я встре́тил дру́га на у́лице.' },
        { word: 'понра́вился', definition: 'liked (it pleased)', example: 'Мне понра́вился э́тот фильм.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Кого́ автор встре́тил в па́рке?',
          options: ['Бра́та', 'Подру́гу О́лю', 'Колле́гу', 'Никого́'],
          answer: 1,
          explanation: 'В те́ксте: "Я встре́тил свою́ подру́гу О́лю."',
        },
        {
          question: 'Понра́вился ли фильм?',
          options: ['Да, о́чень', 'Нет', 'Не говори́т', 'Не о́чень'],
          answer: 0,
          explanation: 'В те́ксте: "Фильм нам о́чень понра́вился."',
        },
        {
          question: 'Что де́лал а́втор в воскресе́нье?',
          options: ['Гуля́л', 'Ходи́л в кино́', 'Убира́лся и гото́вил', 'Рабо́тал'],
          answer: 2,
          explanation: 'В воскресе́нье он "убира́лся, гото́вил еду́ на неде́лю и чита́л кни́гу."',
        },
      ],
    },
    {
      id: 'a2-metro',
      title: 'Моско́вское метро́',
      type: 'informational',
      text:
        'Моско́вское метро́ — одно́ из са́мых краси́вых в ми́ре. Оно́ откры́лось в 1935 году́. ' +
        'Сейча́с в метро́ бо́лее двухсо́т ста́нций. Мно́гие ста́нции — настоя́щие ' +
        'произведе́ния иску́сства: мра́мор, мозáика, скульпту́ры. Метро́ рабо́тает с ' +
        'пяти́ утра́ до часа́ но́чи. По́езд хо́дит ка́ждые две-три мину́ты. Биле́т ' +
        'на одну́ пое́здку сто́ит пятьдеся́т рубле́й, но с ка́ртой "Тро́йка" деше́вле.',
      vocabulary: [
        { word: 'произведе́ние иску́сства', definition: 'work of art', example: 'Э́та карти́на — произведе́ние иску́сства.' },
        { word: 'мра́мор', definition: 'marble', example: 'Стены́ из бе́лого мра́мора.' },
        { word: 'пое́здка', definition: 'trip / ride', example: 'Одна́ пое́здка на метро́ зани́мает 20 мину́т.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Когда́ откры́лось моско́вское метро́?',
          options: ['В 1925 году́', 'В 1935 году́', 'В 1945 году́', 'В 1955 году́'],
          answer: 1,
          explanation: 'В те́ксте: "Оно́ откры́лось в 1935 году́."',
        },
        {
          question: 'До ско́льких рабо́тает метро́?',
          options: ['До двена́дцати', 'До часа́ но́чи', 'До двух но́чи', 'Кругло́суточно'],
          answer: 1,
          explanation: 'В те́ксте: "Метро́ рабо́тает с пяти́ утра́ до часа́ но́чи."',
        },
        {
          question: 'Как мо́жно сэконо́мить на метро́?',
          options: ['Купи́ть абонеме́нт', 'Испо́льзовать ка́рту "Тро́йка"', 'Е́хать но́чью', 'Не говори́т'],
          answer: 1,
          explanation: 'В те́ксте: "С ка́ртой «Тро́йка» деше́вле."',
        },
      ],
    },
  ],

  B1: [
    {
      id: 'b1-work',
      title: 'Рабо́та в Росси́и',
      type: 'informational',
      text:
        'В после́дние го́ды ры́нок труда́ в Росси́и значи́тельно измени́лся. Всё бо́льше ' +
        'люде́й рабо́тают удалённо — из до́ма и́ли из кофе́ен. Осо́бенно э́то каса́ется ' +
        'IT-специали́стов, дизáйнеров и перево́дчиков. С одно́й стороны́, удалённая рабо́та ' +
        'даёт свобо́ду: мо́жно самому́ планíровать свой день и не тра́тить вре́мя на доро́гу. ' +
        'С друго́й стороны́, мно́гие жа́луются на одино́чество и тру́дности с разделе́нием ' +
        'рабо́ты и ли́чной жи́зни. По да́нным опро́сов, о́коло 40% росси́йских рабо́тников ' +
        'хоте́ли бы рабо́тать в гибри́дном фо́рмате — два-три дня в о́фисе и остально́е вре́мя из до́ма.',
      vocabulary: [
        { word: 'удалённо', definition: 'remotely', example: 'Мно́гие сотру́дники рабо́тают удалённо.' },
        { word: 'каса́ется', definition: 'concerns / relates to', example: 'Э́то каса́ется всех.' },
        { word: 'гибри́дный', definition: 'hybrid', example: 'Гибри́дный фо́рмат рабо́ты.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Каки́е специали́сты ча́ще рабо́тают удалённо?',
          options: ['Врачи́', 'Строи́тели', 'IT-специали́сты и дизáйнеры', 'Учителя́'],
          answer: 2,
          explanation: 'В те́ксте: "Осо́бенно э́то каса́ется IT-специали́стов, дизáйнеров и перево́дчиков."',
        },
        {
          question: 'Како́й гла́вный недоста́ток удалённой рабо́ты?',
          options: ['Ни́зкая зарпла́та', 'Одино́чество', 'Мно́го рабо́ты', 'Пло́хой интерне́т'],
          answer: 1,
          explanation: 'Мно́гие жа́луются на "одино́чество и тру́дности с разделе́нием рабо́ты и ли́чной жи́зни."',
        },
        {
          question: 'Како́й форма́т рабо́ты предпочита́ют 40% опро́шенных?',
          options: ['По́лностью удалённый', 'По́лностью о́фисный', 'Гибри́дный', 'Фрила́нс'],
          answer: 2,
          explanation: 'О́коло 40% хоте́ли бы рабо́тать в "гибри́дном фо́рмате."',
        },
      ],
    },
    {
      id: 'b1-chekhov',
      title: 'А. П. Чéхов (биогра́фия)',
      type: 'narrative',
      text:
        'Анто́н Па́влович Чéхов роди́лся в 1860 году́ в Таганро́ге, на ю́ге Росси́и. ' +
        'Его́ оте́ц держа́л ма́ленькую ла́вку. Когда́ Анто́ну бы́ло шестна́дцать лет, ' +
        'семья́ перее́хала в Москву́. Чéхов посту́пил на медици́нский факульте́т ' +
        'университе́та и стал врачо́м, но одновре́менно начáл писа́ть корóткие расскáзы ' +
        'для журна́лов. Постепе́нно литерату́ра ста́ла его́ гла́вным де́лом. Он написа́л ' +
        'мно́жество расскáзов и не́сколько знамени́тых пьес: «Чáйка», «Три сестры́», ' +
        '«Ви́шнёвый сад». Чéхов у́мер в 1904 году́ от туберкулёза в во́зрасте со́рока четырёх лет.',
      vocabulary: [
        { word: 'держа́л ла́вку', definition: 'ran a shop', example: 'Его́ дед держа́л ла́вку в дере́вне.' },
        { word: 'одновре́менно', definition: 'simultaneously', example: 'Он одновре́менно рабо́тал и учи́лся.' },
        { word: 'знамени́тый', definition: 'famous', example: 'Э́то знамени́тый музе́й.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Кем по профе́ссии был Чéхов?',
          options: ['Учи́телем', 'Врачо́м', 'Инжене́ром', 'Журнали́стом'],
          answer: 1,
          explanation: 'Чéхов "посту́пил на медици́нский факульте́т и стал врачо́м."',
        },
        {
          question: 'Каки́е пье́сы написа́л Чéхов?',
          options: ['«Реви́зор» и «Го́ре от ума́»', '«Чáйка» и «Три сестры́»', '«Война́ и мир»', '«Евге́ний Оне́гин»'],
          answer: 1,
          explanation: 'В те́ксте: "«Чáйка», «Три сестры́», «Ви́шнёвый сад»."',
        },
        {
          question: 'Ско́лько лет бы́ло Чéхову, когда́ он у́мер?',
          options: ['Тридцать четы́ре', 'Со́рок четы́ре', 'Пятьдеся́т четы́ре', 'Шестьдеся́т четы́ре'],
          answer: 1,
          explanation: 'Чéхов "у́мер в 1904 году́ в во́зрасте со́рока четырёх лет."',
        },
      ],
    },
    {
      id: 'b1-blog',
      title: 'Блог: Пе́рвый раз в Росси́и',
      type: 'blog',
      text:
        'Я прие́хал в Москву́ в январе́. Бы́ло о́чень хо́лодно — ми́нус два́дцать! Но я ' +
        'был гото́в. Пе́рвое, что меня́ порази́ло, — э́то моско́вское метро́. Каки́е краси́вые ' +
        'ста́нции! Я чу́вствовал себя́ как в музе́е. Второ́е удивле́ние — э́то ру́сская ку́хня. ' +
        'Я попро́бовал борщ, пельме́ни и блины́ с икро́й. Всё бы́ло невероя́тно вку́сно! ' +
        'Тре́тье — лю́ди. Снача́ла мне показа́лось, что ру́сские о́чень серьёзные, ' +
        'но когда́ я познако́мился с ни́ми бли́же, я по́нял, что они́ о́чень тёплые ' +
        'и гостеприи́мные лю́ди. Я обяза́тельно вернýсь!',
      vocabulary: [
        { word: 'порази́ло', definition: 'amazed / struck', example: 'Меня́ порази́ла красота́ го́рода.' },
        { word: 'гостеприи́мный', definition: 'hospitable', example: 'Ру́сские — о́чень гостеприи́мный наро́д.' },
        { word: 'обяза́тельно', definition: 'definitely / without fail', example: 'Я обяза́тельно приду́.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Когда́ а́втор прие́хал в Москву́?',
          options: ['Ле́том', 'Осе́нью', 'Зимо́й', 'Весно́й'],
          answer: 2,
          explanation: 'Он прие́хал "в январе́" — э́то зима́.',
        },
        {
          question: 'Что порази́ло а́втора бо́льше всего́?',
          options: ['Пого́да', 'Метро́', 'Це́ны', 'Пробки'],
          answer: 1,
          explanation: '"Пе́рвое, что меня́ порази́ло, — э́то моско́вское метро́."',
        },
        {
          question: 'Каки́ми оказа́лись ру́сские лю́ди?',
          options: ['Серьёзными', 'Тёплыми и гостеприи́мными', 'Равноду́шными', 'Шу́мными'],
          answer: 1,
          explanation: 'А́втор по́нял, что "они́ о́чень тёплые и гостеприи́мные."',
        },
      ],
    },
  ],

  B2: [
    {
      id: 'b2-ecology',
      title: 'Экологи́ческие пробле́мы Росси́и',
      type: 'analytical',
      text:
        'Росси́я занима́ет пе́рвое ме́сто в ми́ре по террито́рии, и экологи́ческие пробле́мы стра́ны ' +
        'имéют глоба́льное значе́ние. По да́нным экспе́ртов, основны́е пробле́мы свя́заны с ' +
        'загрязне́нием во́здуха в кру́пных города́х, выру́бкой лесо́в в Сиби́ри и та́янием ' +
        'ве́чной мерзлоты́. Осо́бую трево́гу вызыва́ет озеро Байка́л — крупне́йший исто́чник ' +
        'пресно́й воды́ на плане́те. Несмотря́ на защи́тный ста́тус, озеро страда́ет от ' +
        'промы́шленных вы́бросов и тури́стической нагру́зки. С друго́й стороны́, в после́дние ' +
        'го́ды наблюда́ется ро́ст экологи́ческого сознáния сре́ди молодёжи. Волонтёрские ' +
        'о́рганизации проводя́т су́бботники по убо́рке берего́в рек и лесо́в, а в крупных ' +
        'города́х развива́ется раздéльный сбор му́сора.',
      vocabulary: [
        { word: 'ве́чная мерзлота́', definition: 'permafrost', example: 'Та́яние ве́чной мерзлоты́ угрожа́ет инфраструкту́ре.' },
        { word: 'пресна́я вода́', definition: 'fresh water', example: 'Байка́л содержи́т 20% мирово́й пресно́й воды́.' },
        { word: 'су́бботник', definition: 'community volunteer cleanup day', example: 'Мы провели́ су́бботник в па́рке.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Каки́е основны́е экологи́ческие пробле́мы Росси́и?',
          options: [
            'Наводне́ния и засу́хи',
            'Загрязне́ние, выру́бка лесо́в, та́яние мерзлоты́',
            'Землетрясе́ния',
            'Перенаселе́ние'
          ],
          answer: 1,
          explanation: 'Основны́е пробле́мы — "загрязне́ние во́здуха, выру́бка лесо́в и та́яние ве́чной мерзлоты́."',
        },
        {
          question: 'Почему́ Байка́л ва́жен?',
          options: [
            'Он са́мый глубо́кий',
            'Он крупне́йший исто́чник пресно́й воды́',
            'Та́м мно́го ры́бы',
            'Он в це́нтре Росси́и'
          ],
          answer: 1,
          explanation: 'Байка́л — "крупне́йший исто́чник пресно́й воды́ на плане́те."',
        },
        {
          question: 'Что де́лает молодёжь для экологии?',
          options: [
            'Проте́стует',
            'Провóдит су́бботники',
            'Прекраща́ет путеше́ствовать',
            'Ничего́'
          ],
          answer: 1,
          explanation: '"Волонтёрские о́рганизации проводя́т су́бботники по убо́рке берего́в рек и лесо́в."',
        },
      ],
    },
    {
      id: 'b2-dovlatov',
      title: 'Серге́й Довла́тов (отры́вок)',
      type: 'literary',
      text:
        'Я стоя́л на тротуа́ре и жда́л авто́бус. По́года была́ отврати́тельная — ' +
        'ме́лкий до́ждь со сне́гом. Ря́дом со мно́й стоя́ла же́нщина с тяжёлыми ' +
        'су́мками. Она́ вы́глядела уста́лой и расстро́енной. Я хоте́л предложи́ть ' +
        'помо́щь, но не реши́лся. В Петербу́рге не при́нято обраща́ться к незнако́мым ' +
        'лю́дям без при́чины. Авто́бус пришёл, и мы во́шли. Все ме́ста бы́ли за́няты. ' +
        'Я встал у две́ри и на́чал чита́ть газе́ту. Же́нщина с су́мками стоя́ла ря́дом. ' +
        'Каки́е-то бу́лки торча́ли из су́мки. От них шёл чуде́сный за́пах. И я по́думал: ' +
        'как стра́нно устро́ена жизнь — незнако́мый челове́к вызыва́ет у тебя́ ' +
        'сочу́вствие, но ты не мо́жешь э́то показа́ть.',
      vocabulary: [
        { word: 'отврати́тельный', definition: 'disgusting / terrible', example: 'Пого́да бы́ла отврати́тельная.' },
        { word: 'реши́лся', definition: 'dared / gathered courage', example: 'Он наконе́ц реши́лся позвони́ть.' },
        { word: 'сочу́вствие', definition: 'sympathy / compassion', example: 'Я чу́вствовал к ней сочу́вствие.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Почему́ расска́зчик не предложи́л помо́щь же́нщине?',
          options: [
            'Он не заме́тил её',
            'В Петербу́рге не при́нято обраща́ться к незнако́мым',
            'У него́ не бы́ло вре́мени',
            'Она́ не нужда́лась в по́мощи'
          ],
          answer: 1,
          explanation: '"В Петербу́рге не при́нято обраща́ться к незнако́мым лю́дям без при́чины."',
        },
        {
          question: 'О чём размышля́ет расска́зчик в конце́?',
          options: [
            'О пого́де',
            'О стра́нности жи́зни — чу́вствуешь сочу́вствие, но не мо́жешь показа́ть',
            'О вку́сных бу́лках',
            'О расписа́нии авто́бусов'
          ],
          answer: 1,
          explanation: 'Он ду́мает: "Незнако́мый челове́к вызыва́ет сочу́вствие, но ты не мо́жешь э́то показа́ть."',
        },
        {
          question: 'Како́й литерату́рный приём испо́льзует а́втор?',
          options: [
            'Дета́льное описа́ние повседне́вности для пе́редачи глубо́кой мы́сли',
            'Гиперболу́',
            'Фантáстику',
            'По́ток созна́ния'
          ],
          answer: 0,
          explanation: 'Довла́тов изве́стен описа́нием просты́х ситуа́ций, за кото́рыми скрыва́ется глубо́кий смысл.',
        },
      ],
    },
  ],

  C1: [
    {
      id: 'c1-education',
      title: 'Росси́йская систе́ма образова́ния',
      type: 'academic',
      text:
        'Систе́ма высшего образова́ния в Росси́и претерпе́ла существе́нные измене́ния ' +
        'после присоедине́ния к Боло́нскому проце́ссу в 2003 году́. Тради́ционная ' +
        'пятиле́тняя моде́ль специали́ста была́ заменена́ двухуро́вневой систе́мой ' +
        '«бакалавриа́т + магистрату́ра». Те́м не ме́нее, в о́бществе до сих пор ведётся ' +
        'диску́ссия о целесообра́зности э́той рефо́рмы. Крити́ки указы́вают, что четырёхле́тний ' +
        'бакалавриа́т не обеспе́чивает доста́точной глубины́ подгото́вки, осо́бенно в ' +
        'те́хнических и естественнонаучных специа́льностях. Сторо́нники рефо́рмы, напро́тив, ' +
        'подчёркивают, что двухуро́вневая систе́ма повыша́ет мобíльность студе́нтов и ' +
        'облегча́ет призна́ние дипло́мов за рубежо́м. Показа́тельно, что в 2022 году́ ' +
        'Росси́я объяви́ла о вы́ходе из Боло́нской систе́мы и разрабо́тке со́бственной ' +
        'наци́ональной моде́ли, сочетáющей элеме́нты специалите́та и двухуро́вневой подгото́вки.',
      vocabulary: [
        { word: 'претерпе́ть', definition: 'to undergo', example: 'Зако́ны претерпе́ли измене́ния.' },
        { word: 'целесообра́зность', definition: 'expediency / appropriateness', example: 'Целесообра́зность рефо́рмы вызыва́ет вопро́сы.' },
        { word: 'показа́тельно', definition: 'indicatively / tellingly', example: 'Показа́тельно, что результа́ты совпали́.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Како́й был гла́вный аргуме́нт про́тив Боло́нской систе́мы?',
          options: [
            'Слишком доро́го',
            'Бакалавриа́т не даёт доста́точной глубины́ подгото́вки',
            'Студе́нты не хотя́т учи́ться',
            'Нет магистрату́ры'
          ],
          answer: 1,
          explanation: 'Крити́ки указы́вают на "недоста́точную глубину́ подгото́вки" четырёхле́тнего бакалавриа́та.',
        },
        {
          question: 'Како́й аргуме́нт приво́дят сторо́нники Боло́нской систе́мы?',
          options: [
            'Деше́вле для госуда́рства',
            'Повыша́ет мобíльность и облегча́ет призна́ние дипло́мов',
            'Ле́гче учи́ться',
            'Бо́льше рабо́чих мест'
          ],
          answer: 1,
          explanation: 'Сторо́нники подчёркивают "мобíльность студе́нтов и призна́ние дипло́мов за рубежо́м."',
        },
        {
          question: 'Как э́тот текст мо́жно оха́рактеризовать стилисти́чески?',
          options: [
            'Разгово́рный',
            'Нау́чно-публицисти́ческий',
            'Худо́жественный',
            'Официа́льно-делово́й'
          ],
          answer: 1,
          explanation: 'Текст испо́льзует нау́чно-публицисти́ческий стиль: объекти́вный тон, терминоло́гия, аргуме́нты «за» и «про́тив».',
        },
      ],
    },
  ],

  C2: [
    {
      id: 'c2-bulgakov',
      title: '«Ма́стер и Маргари́та» (отры́вок)',
      type: 'literary',
      text:
        '«В час жаркого весеннего заката на Патриарших прудах появились два гражданина. ' +
        'Первый из них — приблизительно сорокалетний, одетый в серенькую летнюю пару, — ' +
        'был маленького роста, упитан, лыс, свою приличную шляпу пирожком нёс в руке, ' +
        'а на хорошо выбритом лице его помещались сверхъестественных размеров очки в ' +
        'чёрной роговой оправе. Второй — плечистый, рыжеватый, вихрастый молодой ' +
        'человек в заломленной на затылок клетчатой кепке — был в ковбойке, жёваных ' +
        'белых брюках и в чёрных тапочках.» Так начинается одно из самых загадочных ' +
        'произведений русской литературы ХХ века — роман Михаила Булгакова, который ' +
        'автор писал с 1928 по 1940 год и который был опубликован лишь в 1966 году, ' +
        'через двадцать шесть лет после его смерти.',
      vocabulary: [
        { word: 'упита́н', definition: 'plump / well-fed', example: 'Упи́танный мужчи́на сиде́л в кре́сле.' },
        { word: 'вихра́стый', definition: 'with tousled hair', example: 'Вихра́стый ма́льчик бежа́л по у́лице.' },
        { word: 'зага́дочный', definition: 'enigmatic / mysterious', example: 'Зага́дочная у́лыбка Мо́ны Ли́зы.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Где происхо́дит де́йствие откры́вающей сце́ны?',
          options: ['На Не́вском проспе́кте', 'На Патриа́рших пруда́х', 'На Кра́сной пло́щади', 'В Горьковском па́рке'],
          answer: 1,
          explanation: '"На Патриа́рших пруда́х."',
        },
        {
          question: 'Ско́лько лет прошло́ ме́жду сме́ртью Булга́кова и публика́цией рома́на?',
          options: ['Де́сять лет', 'Двадцать шесть лет', 'Пятна́дцать лет', 'Со́рок лет'],
          answer: 1,
          explanation: 'Рома́н "был опубликова́н ли́шь в 1966 году́, через два́дцать шесть лет по́сле его́ сме́рти."',
        },
        {
          question: 'Каки́м стилисти́ческим приёмом Булга́ков опи́сывает персона́жей?',
          options: [
            'Лакони́чно, без подро́бностей',
            'Дета́льный физи́ческий портре́т с ирони́ческими дета́лями',
            'Через внýтренний моноло́г',
            'Через диало́г'
          ],
          answer: 1,
          explanation: 'Булга́ков даёт дета́льные, слегка́ ирони́чные физи́ческие описа́ния ("шля́пу пирожко́м", "жёваные брю́ки").',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// ReadingTutor class
// ---------------------------------------------------------------------------

class ReadingTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId, level) {
    const p = core.loadProfile(this.dir, studentId);
    if (level) {
      const lv = level.toUpperCase();
      if (core.CEFR.includes(lv)) p.level = lv;
      core.saveProfile(this.dir, p);
    }
    if (!p.readingStats) p.readingStats = {};
    if (!p.assessments) p.assessments = [];
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

  getTextCatalog(level) {
    if (level) {
      const lev = level.toUpperCase();
      const texts = TEXTS[lev];
      if (!texts) return { error: `No texts for level ${lev}.` };
      return { level: lev, texts: texts.map(t => ({ id: t.id, title: t.title, type: t.type })) };
    }
    const catalog = {};
    for (const lev of Object.keys(TEXTS)) {
      catalog[lev] = TEXTS[lev].map(t => ({ id: t.id, title: t.title, type: t.type }));
    }
    return catalog;
  }

  _textsForLevel(level) {
    return TEXTS[level] || [];
  }

  _findText(textId) {
    for (const lev of Object.keys(TEXTS)) {
      const t = TEXTS[lev].find(t => t.id === textId);
      if (t) return { text: t, level: lev };
    }
    return null;
  }

  generateLesson(studentId) {
    const p = this.getProfile(studentId);
    if (!p.level) throw new Error('No level set. Use set-level first.');
    const texts = this._textsForLevel(p.level);
    if (!texts.length) throw new Error(`No texts available for level ${p.level}.`);

    const stats = p.readingStats || {};
    const unattempted = texts.filter(t => !stats[t.id] || !stats[t.id].attempts || stats[t.id].attempts.length === 0);
    const chosen = unattempted.length > 0 ? core.pick(unattempted, 1)[0] : core.pick(texts, 1)[0];

    return {
      studentId,
      level: p.level,
      text: {
        id: chosen.id,
        title: chosen.title,
        type: chosen.type,
        text: chosen.text,
        vocabulary: chosen.vocabulary,
      },
      questions: chosen.comprehensionQuestions.map((q, i) => ({
        index: i,
        question: q.question,
        options: q.options.map((o, j) => `${j}) ${o}`),
      })),
      instructions: 'Прочита́йте текст внима́тельно. Зате́м отве́тьте на вопро́сы, выбра́в но́мер отве́та (0-3).',
    };
  }

  getText(studentId, textId) {
    const found = this._findText(textId);
    if (!found) throw new Error(`Text not found: ${textId}`);
    const t = found.text;
    return {
      id: t.id,
      title: t.title,
      type: t.type,
      level: found.level,
      text: t.text,
      vocabulary: t.vocabulary,
      questionCount: t.comprehensionQuestions.length,
    };
  }

  checkAnswer(studentId, textId, qIndex, answer) {
    const found = this._findText(textId);
    if (!found) throw new Error(`Text not found: ${textId}`);
    const t = found.text;
    const qi = parseInt(qIndex, 10);
    if (qi < 0 || qi >= t.comprehensionQuestions.length) {
      throw new Error(`Invalid question index: ${qIndex}. Text has ${t.comprehensionQuestions.length} questions.`);
    }
    const q = t.comprehensionQuestions[qi];
    const ans = parseInt(answer, 10);
    const correct = ans === q.answer;
    return {
      textId,
      questionIndex: qi,
      correct,
      yourAnswer: ans,
      correctAnswer: q.answer,
      correctOption: q.options[q.answer],
      explanation: q.explanation,
    };
  }

  recordAssessment(studentId, textId, score, total) {
    const found = this._findText(textId);
    if (!found) throw new Error(`Text not found: ${textId}`);
    const p = this.getProfile(studentId);
    if (!p.readingStats) p.readingStats = {};
    if (!p.readingStats[textId]) {
      p.readingStats[textId] = {
        attempts: [],
        stability: 1,
        difficulty: 5,
        nextReview: core.today(),
      };
    }
    const st = p.readingStats[textId];
    const s = parseInt(score, 10);
    const t = parseInt(total, 10);
    st.attempts.push({ score: s, total: t, date: core.today() });

    const grade = s === t ? 4 : s >= t * 0.7 ? 3 : s >= t * 0.5 ? 2 : 1;
    st.stability = core.fsrsUpdateStability(st.stability, st.difficulty, grade);
    st.difficulty = core.fsrsUpdateDifficulty(st.difficulty, grade);
    st.nextReview = (() => {
      const days = core.fsrsNextReview(st.stability);
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    })();

    p.assessments.push({
      type: 'reading',
      textId,
      score: s,
      total: t,
      date: core.today(),
    });

    this._save(p);
    return {
      studentId,
      textId,
      score: s,
      total: t,
      mastery: core.calcMastery(st.attempts),
      nextReview: st.nextReview,
    };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const stats = p.readingStats || {};
    const textIds = Object.keys(stats);
    const totalAttempts = textIds.reduce((sum, id) => sum + (stats[id].attempts || []).length, 0);
    const masteries = textIds.map(id => core.calcMastery(stats[id].attempts));
    const avgMastery = masteries.length ? Math.round(masteries.reduce((a, b) => a + b, 0) / masteries.length * 100) / 100 : 0;

    return {
      studentId,
      level: p.level || 'not set',
      textsAttempted: textIds.length,
      totalAttempts,
      averageMastery: avgMastery,
      masteryLabel: core.masteryLabel(avgMastery),
    };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const stats = p.readingStats || {};
    const details = [];
    for (const textId of Object.keys(stats)) {
      const st = stats[textId];
      const found = this._findText(textId);
      const mastery = core.calcMastery(st.attempts);
      details.push({
        textId,
        title: found ? found.text.title : textId,
        level: found ? found.level : '?',
        attempts: st.attempts.length,
        lastScore: st.attempts.length ? st.attempts[st.attempts.length - 1] : null,
        mastery,
        masteryLabel: core.masteryLabel(mastery),
        nextReview: st.nextReview,
      });
    }
    return {
      studentId,
      level: p.level || 'not set',
      createdAt: p.createdAt,
      texts: details,
    };
  }

  getNextTexts(studentId) {
    const p = this.getProfile(studentId);
    if (!p.level) throw new Error('No level set. Use set-level first.');
    const stats = p.readingStats || {};
    const todayStr = core.today();

    const due = [];
    for (const textId of Object.keys(stats)) {
      const st = stats[textId];
      if (st.nextReview <= todayStr) {
        const found = this._findText(textId);
        due.push({
          textId,
          title: found ? found.text.title : textId,
          level: found ? found.level : '?',
          nextReview: st.nextReview,
          mastery: core.calcMastery(st.attempts),
        });
      }
    }

    const texts = this._textsForLevel(p.level);
    const unattempted = texts
      .filter(t => !stats[t.id])
      .map(t => ({ textId: t.id, title: t.title, level: p.level, nextReview: 'new', mastery: 0 }));

    return {
      studentId,
      level: p.level,
      dueForReview: due,
      newTexts: unattempted,
    };
  }

  listStudents() {
    return { students: core.listProfiles(this.dir) };
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new ReadingTutor();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const [, sid, level] = args;
      if (!sid) throw new Error('Usage: start <studentId> [level]');
      if (level) tutor.setLevel(sid, level);
      const p = tutor.getProfile(sid);
      tutor._save(p);
      out({ message: `Profile loaded for ${sid}.`, level: p.level || 'not set' });
      break;
    }
    case 'set-level': {
      const [, sid, level] = args;
      if (!sid || !level) throw new Error('Usage: set-level <studentId> <level>');
      out(tutor.setLevel(sid, level));
      break;
    }
    case 'lesson': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: lesson <studentId>');
      out(tutor.generateLesson(sid));
      break;
    }
    case 'text': {
      const [, sid, textId] = args;
      if (!sid || !textId) throw new Error('Usage: text <studentId> <textId>');
      out(tutor.getText(sid, textId));
      break;
    }
    case 'check': {
      const [, sid, textId, qIndex, answer] = args;
      if (!sid || !textId || qIndex === undefined || answer === undefined) {
        throw new Error('Usage: check <studentId> <textId> <qIndex> <answer>');
      }
      out(tutor.checkAnswer(sid, textId, qIndex, answer));
      break;
    }
    case 'record': {
      const [, sid, textId, score, total] = args;
      if (!sid || !textId || score === undefined || total === undefined) {
        throw new Error('Usage: record <studentId> <textId> <score> <total>');
      }
      out(tutor.recordAssessment(sid, textId, score, total));
      break;
    }
    case 'progress': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: progress <studentId>');
      out(tutor.getProgress(sid));
      break;
    }
    case 'report': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: report <studentId>');
      out(tutor.getReport(sid));
      break;
    }
    case 'next': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: next <studentId>');
      out(tutor.getNextTexts(sid));
      break;
    }
    case 'texts': {
      const [, level] = args;
      out(tutor.getTextCatalog(level || null));
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
        commands: ['start', 'set-level', 'lesson', 'text', 'check', 'record', 'progress', 'report', 'next', 'texts', 'students'],
      });
  }
});
