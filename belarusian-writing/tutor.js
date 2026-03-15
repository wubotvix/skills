const core = require('../_lib/core');

// ── Correction categories ──────────────────────────────────────────────────
const CORRECTION_CATEGORIES = [
  'akanne', 'yakanne', 'uu', 'dzekanne', 'tsekanne',
  'trasianka', 'case', 'aspect', 'punctuation',
];

// ── Prompts by CEFR level ──────────────────────────────────────────────────
const PROMPTS = {
  A1: [
    {
      id: 'a1-personal-1', category: 'personal', title: 'Паштоўка з падарожжа',
      type: 'postcard',
      instructions: 'Напішыце паштоўку сябру з месца адпачынку. Уключыце: дзе вы, якое надвор\'е, што робіце кожны дзень. (30-50 слоў)',
      targetStructures: ['present tense regular verbs', 'у/на + locative', 'adjective agreement'],
      rubric: {
        content: 'Mentions location, weather, and daily activity',
        grammar: 'Correct present tense conjugation; basic case usage',
        vocabulary: 'Basic travel and weather words; no Trasianka',
        organization: 'Greeting, body, farewell structure',
      },
      modelResponse: 'Дарагі Андрэй! Я ў Мінску. Тут вельмі цёпла і сонечна. Кожны дзень я гуляю па парку і ем дранікі. Горад вельмі прыгожы. Да пабачэння! Вольга',
    },
    {
      id: 'a1-personal-2', category: 'personal', title: 'Мая сям\'я',
      type: 'description',
      instructions: 'Апішыце сваю сям\'ю. Уключыце: імёны, узрост, прафесіі і тое, што ім падабаецца рабіць. (40-60 слоў)',
      targetStructures: ['быць for descriptions', 'мець for possession', 'possessive pronouns'],
      rubric: {
        content: 'Names at least 3 family members with details',
        grammar: 'Correct gender agreement; possessive pronouns',
        vocabulary: 'Family terms, numbers, professions',
        organization: 'Logical grouping of family members',
      },
      modelResponse: 'Мая сям\'я невялікая. Майго бацьку завуць Іван, яму сорак пяць гадоў. Ён настаўнік. Маю маці завуць Алена, ёй сорак два гады. Яна лекарка. Маёй сястры Волі дванаццаць гадоў. Яна вучаніца. На выхадных мы любім гуляць у парку.',
    },
    {
      id: 'a1-formal-1', category: 'formal', title: 'Запіс у гасцініцу',
      type: 'email',
      instructions: 'Напішыце кароткі электронны ліст, каб забраніраваць пакой у гасцініцы. Уключыце: даты, тып пакоя, колькасць людзей. (30-50 слоў)',
      targetStructures: ['хацець + infinitive', 'numbers and dates', 'formal Вы'],
      rubric: {
        content: 'Includes dates, room type, number of guests',
        grammar: 'Correct formal register (Вы); хацець + infinitive',
        vocabulary: 'Hotel vocabulary: пакой, браніраванне, ноч',
        organization: 'Greeting, request, sign-off',
      },
      modelResponse: 'Паважаны спадар! Я хачу забраніраваць двухмесны пакой для двух чалавек з пятнаццатага па дваццатае чэрвеня. Колькі каштуе за ноч? Дзякуй за ўвагу. З павагай, Пятро Навіцкі',
    },
    {
      id: 'a1-creative-1', category: 'creative', title: 'Мой ідэальны дзень',
      type: 'narrative',
      instructions: 'Апішыце свой ідэальны дзень ад раніцы да вечара. Выкарыстоўвайце выразы часу. (40-60 слоў)',
      targetStructures: ['time expressions', 'reflexive verbs', 'present tense sequence'],
      rubric: {
        content: 'Covers morning, afternoon, and evening with activities',
        grammar: 'Correct verb forms; time expressions',
        vocabulary: 'Daily routine vocabulary',
        organization: 'Chronological order with time markers',
      },
      modelResponse: 'Раніцай я прачынаюся а дзявятай гадзіне. Я снедаю з сям\'ёй. Аб адзінаццатай я іду ў парк. Пасля абеду я ем у рэстарацыі. Увечары я гуляю па горадзе і ем марожанае. Я кладуся спаць аб адзінаццатай. Цудоўна!',
    },
  ],
  A2: [
    {
      id: 'a2-personal-1', category: 'personal', title: 'Мінулыя выхадныя',
      type: 'narrative',
      instructions: 'Раскажыце, што вы рабілі на мінулых выхадных. Уключыце хаця б 4 дзеянні і з кім вы былі. (60-80 слоў)',
      targetStructures: ['past tense (masculine -ў)', 'time markers', 'aspect basics'],
      rubric: {
        content: 'At least 4 activities with companions mentioned',
        grammar: 'Correct past tense forms including masculine -ў',
        vocabulary: 'Leisure activities, time connectors',
        organization: 'Chronological narrative with connectors',
      },
      modelResponse: 'У суботу раніцай я хадзіў на рынак з маці і мы купілі свежую садавіну. Потым мы абедалі ў бабулі. Пасля абеду я гуляў у футбол з сябрамі ў парку. У нядзелю я ўстаў позна. Потым я вучыў беларускую мову, а ўвечары мы глядзелі фільм з братам. Выхадныя былі вельмі добрыя.',
    },
    {
      id: 'a2-personal-2', category: 'personal', title: 'Ліст сябру',
      type: 'letter',
      instructions: 'Напішыце нефармальны ліст новаму сябру. Прадстаўцеся, раскажыце пра свае захапленні і спытайце пра яго/яе. (70-90 слоў)',
      targetStructures: ['падабацца/кахаць', 'question formation', 'dative case basics'],
      rubric: {
        content: 'Self-introduction, likes/dislikes, questions to the friend',
        grammar: 'Correct падабацца structure; question formation',
        vocabulary: 'Hobbies, interests, personality adjectives',
        organization: 'Informal letter format with greeting and questions',
      },
      modelResponse: 'Прывітанне, Марта! Мяне завуць Люся, мне шаснаццаць гадоў. Я жыву ў Гродне, вельмі прыгожым горадзе на захадзе Беларусі. Мне вельмі падабаецца музыка, я граю на гітары. Таксама мне падабаецца чытаць кнігі пра прыгоды. Мне зусім не падабаецца спорт — гэта так нудна! А табе? Што табе падабаецца рабіць у вольны час? Ці падабаецца табе музыка? Чакаю адказу. Абдымкі, Люся',
    },
    {
      id: 'a2-formal-1', category: 'formal', title: 'Скарга на тавар',
      type: 'email',
      instructions: 'Напішыце ліст-скаргу, бо вы купілі тавар, які прыйшоў зламаным. Растлумачце, што здарылася, і што вы хочаце. (60-80 слоў)',
      targetStructures: ['past tense narration', 'хацеў бы for polite requests'],
      rubric: {
        content: 'States problem clearly, explains what happened, requests solution',
        grammar: 'Past tense narration; conditional for requests',
        vocabulary: 'Shopping and complaint vocabulary',
        organization: 'Problem statement, details, request, closing',
      },
      modelResponse: 'Паважаныя спадарства! Трэцяга сакавіка я купіў лямпу ў вашай інтэрнэт-краме. Калі прыйшла пасылка, лямпа была зламаная. Я хацеў бы атрымаць новую лямпу або вяртанне грошай. Далучаю фота пашкоджанага тавару. Чакаю вашага адказу. З павагай, Раман Сідарэнка',
    },
    {
      id: 'a2-creative-1', category: 'creative', title: 'Апавяданне са словамі',
      type: 'narrative',
      instructions: 'Выкарыстайце гэтыя словы ў кароткім апавяданні: кот, дождж, акно, гарбата, здзіўленне. (60-90 слоў)',
      targetStructures: ['past tense basic', 'descriptive adjectives', 'sequencing'],
      rubric: {
        content: 'All 5 words included in a coherent story',
        grammar: 'Appropriate use of past tense; gender agreement',
        vocabulary: 'Descriptive language, all trigger words used naturally',
        organization: 'Beginning, middle, end structure',
      },
      modelResponse: 'Быў дажджлівы вечар. Мой кот сядзеў каля акна і глядзеў на вуліцу. Я зрабіў гарбату і сеў чытаць. Раптам кот саскочыў з акна і пабег да дзвярэй. Я адчыніў дзверы і знайшоў скрынку. Гэта было здзіўленне ад маёй сяброўкі! Унутры была кніга і пячэнне. Гэта быў цудоўны вечар.',
    },
  ],
  B1: [
    {
      id: 'b1-personal-1', category: 'personal', title: 'Важная перамена ў жыцці',
      type: 'essay',
      instructions: 'Напішыце пра важную перамену ў вашым жыцці (пераезд, новая праца, новае захапленне). Растлумачце чаму, як вы сябе адчувалі і чаму навучыліся. (100-140 слоў)',
      targetStructures: ['past tense narrative', 'aspect contrast (impf/pf)', 'cause/effect connectors'],
      rubric: {
        content: 'Describes change, motivation, feelings, and lesson learned',
        grammar: 'Consistent aspect usage; correct connector usage',
        vocabulary: 'Emotions vocabulary, cause-effect language (таму што, таму, таксама)',
        organization: 'Introduction, development with timeline, reflection/conclusion',
      },
      modelResponse: 'Два гады таму я вырашыў пераехаць з невялікага горада ў Мінск, каб вучыцца ва ўніверсітэце. Спачатку мне было вельмі страшна, бо я нікога не ведаў і ўсё было іншае. Першыя месяцы былі цяжкія: я адчуваў сябе адзінока і сумаваў па сям\'і. Аднак паступова я знайшоў сяброў на занятках і пачаў атрымліваць задавальненне ад гораду. Я навучыўся гатаваць, арганізоўваць свой час і быць больш самастойным. Зараз я разумею, што гэта была лепшая перамена ў маім жыцці, бо яна дапамагла мне вырасці як чалавеку.',
    },
    {
      id: 'b1-formal-1', category: 'formal', title: 'Ліст-заяўка на працу',
      type: 'letter',
      instructions: 'Напішыце фармальны ліст на пасаду кельнера/кельнеркі ў рэстаране. Уключыце досвед, графік і чаму хочаце працаваць. (100-130 слоў)',
      targetStructures: ['formal Вы register', 'past tense for experience', 'conditional for polite language'],
      rubric: {
        content: 'States position, relevant experience, availability, motivation',
        grammar: 'Consistent formal register; correct past tense; conditional politeness',
        vocabulary: 'Work vocabulary, formal expressions',
        organization: 'Formal letter structure',
      },
      modelResponse: 'Паважаны спадар дырэктар! Я звяртаюся да Вас, каб падаць заяўку на пасаду кельнера, якую Вы апублікавалі на сваім сайце. Я працаваў два гады ў рэстаране «Камяніца», дзе атрымаў досвед у абслугоўванні кліентаў. Я адказны, арганізаваны чалавек і люблю працаваць у камандзе. Я магу працаваць на выхадных і ўвечары на працоўных днях. Я хацеў бы працаваць у вашым рэстаране, бо ён мае выдатную рэпутацыю. Далучаю сваё рэзюмэ. Буду ўдзячны за магчымасць прыйсці на сумоўе. З павагай, Алесь Руіс',
    },
    {
      id: 'b1-academic-1', category: 'academic', title: 'Перавагі і недахопы сацсетак',
      type: 'essay',
      instructions: 'Напішыце эсэ пра перавагі і недахопы сацыяльных сетак. Прывядзіце хаця б два аргументы за і два супраць, і ўласную думку. (120-150 слоў)',
      targetStructures: ['opinion expressions', 'contrast connectors (аднак, з іншага боку)', 'каб + past for purpose'],
      rubric: {
        content: 'At least 2 advantages, 2 disadvantages, personal opinion',
        grammar: 'Correct use of contrast connectors; каб clauses',
        vocabulary: 'Technology vocabulary, discourse markers',
        organization: 'Introduction, advantages, disadvantages, conclusion',
      },
      modelResponse: 'Сацыяльныя сеткі — частка нашага штодзённага жыцця, але яны маюць як перавагі, так і недахопы. З аднаго боку, яны дазваляюць нам мець зносіны з людзьмі з усяго свету і хутка дзяліцца інфармацыяй. Таксама яны карысныя, каб знайсці працу і вучыцца новаму. З іншага боку, сацыяльныя сеткі могуць выклікаць залежнасць, асабліва ў моладзі. Таксама яны могуць уплываць на нашу самаацэнку, бо мы заўсёды параўноўваем сваё жыццё з жыццём іншых. На маю думку, сацыяльныя сеткі — карысны інструмент, калі мы карыстаемся імі памяркоўна. Важна, каб мы не праводзілі занадта шмат часу ў сетцы.',
    },
  ],
  B2: [
    {
      id: 'b2-personal-1', category: 'personal', title: 'Разважанне пра падарожжа',
      type: 'essay',
      instructions: 'Напішыце пра падарожжа, якое змяніла ваш светапогляд. Апішыце месца, канкрэтны досвед і як гэта вас змяніла. (140-180 слоў)',
      targetStructures: ['каб + past subjunctive', 'advanced connectors (тым не менш, нягледзячы на)', 'participles'],
      rubric: {
        content: 'Vivid description, specific anecdote, reflection on personal change',
        grammar: 'Complex subordination; advanced connector variety',
        vocabulary: 'Rich descriptive language; precise emotional vocabulary',
        organization: 'Engaging introduction, narrative body, reflective conclusion',
      },
      modelResponse: 'Я ніколі не думаў, што падарожжа ў Полацк зможа змяніць мой светапогляд. Я ехаў у пошуках гісторыі, а знайшоў нешта значна глыбейшае. Адным ранкам мясцовы гісторык запрасіў мяне ў Сафійскі сабор. Пакуль ён паказваў мне фрэскі, ён растлумачыў, што кожны малюнак захоўвае гісторыю нацыі. Я зразумеў, што, нягледзячы на жыццё ў глабалізаваным свеце, ёсць каштоўнасці, якія ніякая тэхналогія не можа замяніць. Той досвед прымусіў мяне пераасэнсаваць маё стаўленне да культурнай спадчыны. Тым не менш, найбольш каштоўным было не тое, што я даведаўся, а тая павага да мінулага, якую я ўбачыў у кожным жэсце гэтага чалавека.',
    },
    {
      id: 'b2-formal-1', category: 'formal', title: 'Ліст у рэдакцыю',
      type: 'letter',
      instructions: 'Напішыце ліст у рэдакцыю газеты пра забарону аўтамабіляў у цэнтры горада. Аргументуйце за або супраць. (140-180 слоў)',
      targetStructures: ['impersonal constructions', 'conditional for hypothetical', 'каб + past'],
      rubric: {
        content: 'Clear position, at least 3 arguments, counterargument addressed',
        grammar: 'Impersonal constructions; conditional hypotheticals',
        vocabulary: 'Formal argumentation language',
        organization: 'Position statement, arguments, counterargument, conclusion',
      },
      modelResponse: 'Паважаны рэдактар! Я пішу адносна прапановы забараніць рух аўтамабіляў у цэнтры горада. Я лічу, што ўладам неабходна прыняць меры для паляпшэння якасці паветра. Па-першае, даказана, што забруджванне ў цэнтры перавышае нормы. Калі б абмежавалі рух, узровень забруджвання знізіўся б на сорак працэнтаў. Па-другое, еўрапейскія гарады, якія стварылі пешаходныя зоны, бачылі рост мясцовага гандлю. Зразумела, што некаторыя гандляры баяцца страціць кліентаў; аднак досвед іншых гарадоў паказвае адваротнае. Нарэшце, неабходна інвеставаць у эфектыўны грамадскі транспарт як альтэрнатыву. Было б несправядліва забараняць аўтамабілі без прапановы жыццяздольных варыянтаў. У выніку, я падтрымліваю гэтую меру пры ўмове, што яна будзе суправаджацца комплексным планам мабільнасці. З павагай, Кацярына Дзялко',
    },
    {
      id: 'b2-academic-1', category: 'academic', title: 'Эсэ: двухмоўная адукацыя',
      type: 'essay',
      instructions: 'Напішыце аргументаванае эсэ пра тое, ці павінна двухмоўная адукацыя (беларуска-руская) быць абавязковай. Прадстаўце тэзіс, аргументы, контраргумент і выснову. (150-200 слоў)',
      targetStructures: ['каб + past for concessive', 'passive constructions', 'academic hedging'],
      rubric: {
        content: 'Clear thesis, 2-3 supporting arguments, counterargument, conclusion',
        grammar: 'Complex subordination; passive voice; hedging',
        vocabulary: 'Academic register; education terminology',
        organization: 'Thesis, body paragraphs, balanced conclusion',
      },
      modelResponse: 'Пытанне двухмоўнай адукацыі ў Беларусі мае асаблівую актуальнасць, улічваючы статус беларускай мовы як уразлівай. Варта адзначыць, што, нягледзячы на складанасці, карысць для кагнітыўнага развіцця і захавання культурнай спадчыны апраўдвае абавязковае ўкараненне. Па-першае, даследаванні паказалі, што двухмоўнасць паляпшае кагнітыўную гнуткасць. Па-другое, беларуская мова знаходзіцца пад пагрозай: калі яе не выкладаць сістэматычна, яна можа знікнуць на працягу некалькіх пакаленняў. Хоць зразумела, што некаторыя бацькі лічаць руску мову больш практычнай, доўгатэрміновая страта культурнай ідэнтычнасці перавешвае кароткатэрміновыя нязручнасці. Неабходна забяспечыць адпаведную падрыхтоўку настаўнікаў і дастатковыя рэсурсы. У выніку, абавязковая двухмоўная адукацыя стала б інвестыцыяй у культурны капітал нашага грамадства.',
    },
  ],
  C1: [
    {
      id: 'c1-academic-1', category: 'academic', title: 'Крытычны аналіз: мова і ідэнтычнасць',
      type: 'essay',
      instructions: 'Напішыце крытычны аналіз узаемасувязі паміж мовай і нацыянальнай ідэнтычнасцю ў Беларусі. Выкарыстоўвайце навуковы рэгістр. (180-230 слоў)',
      targetStructures: ['дзеепрыслоўныя звароты (gerund phrases)', 'nominalizations', 'academic hedging and distancing'],
      rubric: {
        content: 'Nuanced analysis with Belarusian context; avoids oversimplification',
        grammar: 'Complex subordination; impersonal constructions',
        vocabulary: 'Academic lexis; abstract nominalizations',
        organization: 'Introduction with framing, analytical body, nuanced conclusion',
      },
      modelResponse: 'Узаемасувязь паміж мовай і нацыянальнай ідэнтычнасцю ў Беларусі ўяўляе сабой адну з найбольш складаных праблем постсавецкай прасторы. Можна сцвярджаць, што моўная сітуацыя ў краіне, дзе толькі каля дванаццаці працэнтаў насельніцтва актыўна карыстаецца беларускай мовай, адлюстроўвае глыбокія гістарычныя працэсы русіфікацыі. Аднак было б спрашчэннем зводзіць пытанне ідэнтычнасці выключна да моўнага выбару. Падзеі дзве тысячы дваццатага года прадэманстравалі, што нацыянальная свядомасць можа выяўляцца праз розныя каналы, уключаючы мастацтва, гістарычную памяць і грамадзянскую актыўнасць. Тым не менш, мова застаецца ключавым маркерам культурнай адметнасці. Трасянка — змешанае руска-беларускае маўленне — ілюструе гэтую напружанасць: яна адначасова з\'яўляецца вынікам моўнай асіміляцыі і праявай жывой моўнай практыкі. Варта зрабіць выснову, што захаванне беларускай мовы патрабуе не толькі адукацыйных рэформаў, але і змянення грамадскага стаўлення да мовы як да каштоўнасці, а не толькі сродку камунікацыі.',
    },
    {
      id: 'c1-formal-1', category: 'formal', title: 'Прафесійны дакладт з рэкамендацыямі',
      type: 'report',
      instructions: 'Напішыце даклад для кіраўніцтва з рэкамендацыяй укараніць часткова дыстанцыйную працу. Уключыце кантэкст, дадзеныя, перавагі, рызыкі і рэкамендацыю. (180-230 слоў)',
      targetStructures: ['passive and impersonal constructions', 'conditional for recommendations', 'formal hedging'],
      rubric: {
        content: 'Context, evidence, balanced analysis, actionable recommendation',
        grammar: 'Passive/impersonal; modal verbs for hedging',
        vocabulary: 'Business register; report language',
        organization: 'Numbered sections; executive summary tone',
      },
      modelResponse: 'Даклад аб укараненні часткова дыстанцыйнай працы. 1. Кантэкст: Пасля досведу апошніх гадоў стала відавочна, што выключна прысутнасная мадэль працы страчвае канкурэнтаздольнасць. Дадзены даклад аналізуе мэтазгоднасць гібрыднай мадэлі. 2. Дадзеныя: Паводле даследаванняў, прадукцыйнасць павялічваецца на трынаццаць працэнтаў у работнікаў, якія працуюць дыстанцыйна. Наша ўнутранае апытанне паказала, што семдзесят восем працэнтаў калектыву станоўча ацэньваюць гэту магчымасць. 3. Перавагі: Эксплуатацыйныя выдаткі скараціліся б прыблізна на дваццаць працэнтаў. Акрамя таго, можна чакаць паляпшэння балансу працы і жыцця. 4. Рызыкі: Варта адзначыць, што ізаляцыя можа ўплываць на каманднае ўзаемадзеянне. Таксама неабходна інвеставаць у лічбавыя сродкі супрацоўніцтва. 5. Рэкамендацыя: Прапануецца ўкараніць мадэль трох дзён прысутнасці і двух дзён дыстанцыйнай працы на выпрабавальны тэрмін шэсць месяцаў.',
    },
  ],
  C2: [
    {
      id: 'c2-academic-1', category: 'academic', title: 'Навуковае эсэ: мова і ідэалогія',
      type: 'essay',
      instructions: 'Напішыце навуковае эсэ пра тое, як мова канструюе ідэалагічныя рэальнасці ў беларускім кантэксце. Прааналізуйце канкрэтны прыклад. (200-260 слоў)',
      targetStructures: ['nominalization chains', 'academic distancing', 'intertextuality'],
      rubric: {
        content: 'Sophisticated thesis; concrete Belarusian example; theoretical grounding',
        grammar: 'Native-level subordination; impeccable register consistency',
        vocabulary: 'Academic discourse; critical theory terminology',
        organization: 'Academic essay with thesis, analytical framework, evidence',
      },
      modelResponse: 'Мова, далёкая ад таго, каб быць нейтральным сродкам перадачы інфармацыі, функцыянуе як механізм канструявання ідэалагічнай рэальнасці. Як адзначаў Фэркло, кожны дыскурсіўны акт мае на ўвазе выбар — а кожны выбар — выключэнне. Разгледзім моўную сітуацыю ў Беларусі. Калі афіцыйная рыторыка ўжывае выраз «двухмоўнасць» для апісання стану, дзе руская мова дамінуе ва ўсіх сферах, яна не апісвае рэальнасць — яна яе канфігуруе. Метафара раўнапраўя маскіруе фактычную асіметрыю. Можна было б аргументаваць, што гэта толькі стылістычная канвенцыя; аднак даследаванні ў галіне кагнітыўнай лінгвістыкі даказалі, што канцэптуальныя метафары фарміруюць інтэрпрэтацыйныя рамкі рэцыпіента. Наміналізацыя ўяўляе сабой яшчэ адзін ідэалагічна нагружаны рэсурс: трансфармацыя «ўлады абмяжоўваюць выкарыстанне беларускай мовы» ў «абмежаванне выкарыстання беларускай мовы» сцірае агента і размывае адказнасць. Варта зрабіць выснову, што крытычная моўная граматнасць — здольнасць дэканструяваць гэтыя механізмы — павінна займаць цэнтральнае месца ў адукацыі.',
    },
    {
      id: 'c2-creative-1', category: 'creative', title: 'Апавяданне: дзве мовы',
      type: 'narrative',
      instructions: 'Напішыце кароткае апавяданне пра чалавека, які перажывае ўнутраны канфлікт паміж рускай і беларускай мовамі. Выкарыстоўвайце хаця б дзве апавядальныя перспектывы. (200-260 слоў)',
      targetStructures: ['narrative voice shifts', 'literary register', 'rhetorical devices'],
      rubric: {
        content: 'At least 2 narrative voices; same theme from different perspectives',
        grammar: 'Flawless command of all tenses; deliberate stylistic choices',
        vocabulary: 'Literary register; sensory precision',
        organization: 'Clear voice transitions; structural choice serves narrative',
      },
      modelResponse: 'I. Маці. Яна пачала гаварыць па-беларуску пасля пратэстаў. Раніцай за кавай, не «кофе» — «кава». Не «пожалуйста» — «калі ласка». Я бачыла, як яна шукала словы, як чалавек, які нанова вучыцца хадзіць. Часам яна спыняла сябе на паўслове і глядзела ў столь, нібы слова схавалася там, за люстрай. Мова вярталася да яе, як вясна пасля доўгай зімы — нясмела, але ўпарта. II. Дачка. Маці думае, што я не заўважаю. Але я чую, як яна шэпча ноччу, паўтараючы: «дзякуй», «прабач», «кахаю». Словы, якія яна ведала ў маленстве і забыла на чатыры дзесяцілецці. Калі я пытаюся, чаму яна перайшла, яна кажа проста: «Бо гэта мая мова.» Я не ведаю, ці яна мае рацыю. Я вырасла на рускай, думаю на рускай. Але калі я чую, як маці кажа «кахаю» замест «люблю», нешта зрушваецца ўнутры — нібы ключ павярнуўся ў замку, пра які я не ведала.',
    },
  ],
};

// ── WritingTutor class ─────────────────────────────────────────────────────

const SKILL_NAME = 'belarusian-writing';

class WritingTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

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

  generatePrompt(studentId, category) {
    const p = this.getProfile(studentId);
    const levelPrompts = PROMPTS[p.level] || PROMPTS.A1;
    let pool = levelPrompts;
    if (category) {
      pool = levelPrompts.filter(pr => pr.category === category);
      if (!pool.length) pool = levelPrompts;
    }
    const attempted = new Set((p.assessments || []).map(a => a.promptId));
    const fresh = pool.filter(pr => !attempted.has(pr.id));
    const chosen = fresh.length ? core.pick(fresh, 1)[0] : core.pick(pool, 1)[0];
    return { studentId, level: p.level, prompt: chosen };
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
          const grade = 1;
          rec.stability = core.fsrsUpdateStability(rec.stability, rec.difficulty, grade);
          rec.difficulty = core.fsrsUpdateDifficulty(rec.difficulty, grade);
        } else {
          rec.attempts.push({ score: 1, total: 1, date: core.today() });
          const grade = 4;
          rec.stability = core.fsrsUpdateStability(rec.stability, rec.difficulty, grade);
          rec.difficulty = core.fsrsUpdateDifficulty(rec.difficulty, grade);
        }
      }
      for (const cat of CORRECTION_CATEGORIES) {
        if (!(cat in corrections)) {
          const rec = p.corrections[cat];
          rec.attempts.push({ score: 1, total: 1, date: core.today() });
          const grade = 3;
          rec.stability = core.fsrsUpdateStability(rec.stability, rec.difficulty, grade);
          rec.difficulty = core.fsrsUpdateDifficulty(rec.difficulty, grade);
        }
      }
    }

    p.assessments.push(assessment);
    core.saveProfile(this.dir, p);
    return { studentId, assessment, overallScore: `${assessment.total}/${assessment.maxTotal}` };
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
    return { studentId, level: p.level, totalAssessments: (p.assessments || []).length, correctionCategories: categories, averageScores: recent.length ? avgScores : null };
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
      akanne: 'Practice аканне: write words with unstressed о→а. Dictation from Russian cognates.',
      yakanne: 'Practice яканне: unstressed е→я after soft consonants. Convert Russian words.',
      uu: 'Review ў rules: after vowel before consonant/word-end = ў, word-initial = у, before vowel = в.',
      dzekanne: 'Practice дзеканне: д→дз before soft vowels (і, е, ё, ю, я) and ь.',
      tsekanne: 'Practice цеканне: т→ц before soft vowels. Write minimal pairs.',
      trasianka: 'Identify and replace Russian words with Belarusian equivalents. Trasianka audit drill.',
      'case': 'Practice case endings. Write descriptions using all 6 cases.',
      aspect: 'Narrate events contrasting imperfective and perfective aspect. Write timelines.',
      punctuation: 'Review comma rules: before што, які, каб, але. Practice dash for omitted быць.',
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
        promptId: a.promptId, date: a.date, score: `${a.total}/${a.maxTotal}`,
      })),
    };
  }

  listStudents() { return core.listProfiles(this.dir); }

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
        catch { throw new Error('corrections must be valid JSON, e.g. \'{"akanne":2,"trasianka":1}\''); }
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
