// Belarusian Vocabulary Tutor — complete implementation with embedded data
// Usage: node tutor.js <command> [args...]
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'belarusian-vocabulary';
const MAX_NEW_PER_SESSION = 7;

// ─── Embedded Word Banks by CEFR Level ───────────────────────────────────────

const WORD_BANKS = {
  A1: [
    // Greetings
    { word: 'прывітанне', article: null, gender: null, category: 'greetings', definition: 'hello',
      exampleSentence: 'Прывітанне, як справы?', collocations: ['сказаць прывітанне'], trasiankaFlag: null },
    { word: 'да пабачэння', article: null, gender: null, category: 'greetings', definition: 'goodbye',
      exampleSentence: 'Да пабачэння, убачымся заўтра.', collocations: ['сказаць да пабачэння'], trasiankaFlag: 'Don\'t use *до свидания (Russian)' },
    { word: 'добры дзень', article: null, gender: null, category: 'greetings', definition: 'good day / hello (formal)',
      exampleSentence: 'Добры дзень, спадарыня Новік.', collocations: ['пажадаць добрага дня'], trasiankaFlag: 'Note дзень not *день (дзеканне)' },
    { word: 'дзякуй', article: null, gender: null, category: 'greetings', definition: 'thank you',
      exampleSentence: 'Вялікі дзякуй за дапамогу.', collocations: ['вялікі дзякуй', 'дзякуй вам'], trasiankaFlag: 'Don\'t use *спасибо (Russian)' },
    { word: 'калі ласка', article: null, gender: null, category: 'greetings', definition: 'please / you\'re welcome',
      exampleSentence: 'Дайце мне кнігу, калі ласка.', collocations: ['калі ласка, сядайце'], trasiankaFlag: 'Don\'t use *пожалуйста (Russian)' },
    // Food
    { word: 'вада', article: null, gender: 'f', category: 'food', definition: 'water',
      exampleSentence: 'Вада вельмі халодная.', collocations: ['мінеральная вада', 'шклянка вады'], trasiankaFlag: 'аканне: Russian вода → Belarusian вада' },
    { word: 'хлеб', article: null, gender: 'm', category: 'food', definition: 'bread',
      exampleSentence: 'Я купляю хлеб у пякарні.', collocations: ['хлеб з маслам', 'скібка хлеба'], trasiankaFlag: null },
    { word: 'малако', article: null, gender: 'n', category: 'food', definition: 'milk',
      exampleSentence: 'Я п\'ю малако на снеданак.', collocations: ['кава з малаком', 'свежае малако'], trasiankaFlag: 'аканне: Russian молоко → Belarusian малако' },
    { word: 'бульба', article: null, gender: 'f', category: 'food', definition: 'potato',
      exampleSentence: 'Бульба — галоўная ежа ў Беларусі.', collocations: ['смажаная бульба', 'бульбяная каша'], trasiankaFlag: 'Don\'t use *картошка (Russian). Бульба is distinctly Belarusian' },
    // Family
    { word: 'маці', article: null, gender: 'f', category: 'family', definition: 'mother',
      exampleSentence: 'Мая маці добра гатуе.', collocations: ['родная маці', 'маці-гераіня'], trasiankaFlag: null },
    { word: 'бацька', article: null, gender: 'm', category: 'family', definition: 'father',
      exampleSentence: 'Мой бацька працуе ў бальніцы.', collocations: ['бацька сям\'і'], trasiankaFlag: null },
    { word: 'сябар', article: null, gender: 'm', category: 'family', definition: 'friend (m.)',
      exampleSentence: 'Мой сябар жыве побач з маім домам.', collocations: ['лепшы сябар', 'блізкі сябар'], trasiankaFlag: 'Don\'t use *друг (Russian)' },
    { word: 'сяброўка', article: null, gender: 'f', category: 'family', definition: 'friend (f.)',
      exampleSentence: 'Мая сяброўка вучыцца ва ўніверсітэце.', collocations: ['лепшая сяброўка'], trasiankaFlag: 'Don\'t use *подруга (Russian)' },
    // Everyday
    { word: 'дом', article: null, gender: 'm', category: 'everyday', definition: 'house / home',
      exampleSentence: 'Наш дом мае вялікі сад.', collocations: ['дома', 'дамоў', 'ісці дадому'], trasiankaFlag: null },
    { word: 'кніга', article: null, gender: 'f', category: 'everyday', definition: 'book',
      exampleSentence: 'Я чытаю кнігу кожны тыдзень.', collocations: ['цікавая кніга', 'чытаць кнігу'], trasiankaFlag: null },
    { word: 'горад', article: null, gender: 'm', category: 'everyday', definition: 'city',
      exampleSentence: 'Мінск — вялікі горад.', collocations: ['у горадзе', 'за горадам'], trasiankaFlag: 'аканне: Russian город → Belarusian горад' },
    // Time
    { word: 'дзень', article: null, gender: 'm', category: 'time', definition: 'day',
      exampleSentence: 'Сёння прыгожы дзень.', collocations: ['добры дзень', 'кожны дзень'], trasiankaFlag: 'дзеканне: Russian день → Belarusian дзень' },
    { word: 'тыдзень', article: null, gender: 'm', category: 'time', definition: 'week',
      exampleSentence: 'На гэтым тыдні ў мяне шмат працы.', collocations: ['на тыдні', 'кожны тыдзень'], trasiankaFlag: 'Don\'t use *неделя (Russian)' },
    { word: 'прыгожы', article: null, gender: null, category: 'adjectives', definition: 'beautiful / handsome',
      exampleSentence: 'Гэты горад вельмі прыгожы.', collocations: ['прыгожы дзень', 'прыгожая дзяўчына'], trasiankaFlag: 'Don\'t use *красивый (Russian)' },
    { word: 'вельмі', article: null, gender: null, category: 'adverbs', definition: 'very',
      exampleSentence: 'Гэта вельмі цікава.', collocations: ['вельмі добра', 'вельмі дзякуй'], trasiankaFlag: 'Don\'t use *очень (Russian)' },
  ],

  A2: [
    // Travel
    { word: 'вакзал', article: null, gender: 'm', category: 'travel', definition: 'railway station',
      exampleSentence: 'Вакзал знаходзіцца далёка ад цэнтра.', collocations: ['чыгуначны вакзал', 'аўтавакзал'], trasiankaFlag: null },
    { word: 'білет', article: null, gender: 'm', category: 'travel', definition: 'ticket',
      exampleSentence: 'Мне трэба купіць білет на цягнік.', collocations: ['білет у адзін бок', 'зваротны білет'], trasiankaFlag: null },
    { word: 'падарожжа', article: null, gender: 'n', category: 'travel', definition: 'journey / trip',
      exampleSentence: 'Падарожжа ў Полацк было цікавым.', collocations: ['далёкае падарожжа', 'ехаць у падарожжа'], trasiankaFlag: null },
    { word: 'валізка', article: null, gender: 'f', category: 'travel', definition: 'suitcase',
      exampleSentence: 'Я збіраю валізку сёння ўвечары.', collocations: ['сабраць валізку'], trasiankaFlag: null },
    // Food expanded
    { word: 'мяса', article: null, gender: 'n', category: 'food', definition: 'meat',
      exampleSentence: 'Мяса ў гэтым рэстаране вельмі смачнае.', collocations: ['мяса з бульбай', 'свежае мяса'], trasiankaFlag: null },
    { word: 'рыба', article: null, gender: 'f', category: 'food', definition: 'fish',
      exampleSentence: 'Свежая рыба больш смачная.', collocations: ['смажаная рыба', 'рыба на грылі'], trasiankaFlag: null },
    { word: 'кава', article: null, gender: 'f', category: 'food', definition: 'coffee',
      exampleSentence: 'Я п\'ю каву кожную раніцу.', collocations: ['кава з малаком', 'моцная кава'], trasiankaFlag: 'Don\'t use *кофе (Russian). Кава is Belarusian (from Polish kawa)' },
    { word: 'дранікі', article: null, gender: 'pl', category: 'food', definition: 'potato pancakes (national dish)',
      exampleSentence: 'Дранікі — самая вядомая беларуская страва.', collocations: ['дранікі з мясам', 'дранікі са смятанай'], trasiankaFlag: null },
    // Shopping
    { word: 'крама', article: null, gender: 'f', category: 'shopping', definition: 'shop / store',
      exampleSentence: 'Крама зачыняецца а дзявятай.', collocations: ['прадуктовая крама', 'кніжная крама'], trasiankaFlag: 'Don\'t use *магазин (Russian). Крама is Belarusian' },
    { word: 'кошт', article: null, gender: 'm', category: 'shopping', definition: 'price / cost',
      exampleSentence: 'Кошт садавіны вырас.', collocations: ['нізкі кошт', 'высокі кошт'], trasiankaFlag: null },
    { word: 'грошы', article: null, gender: 'pl', category: 'shopping', definition: 'money',
      exampleSentence: 'У мяне няма дастаткова грошай.', collocations: ['зарабляць грошы', 'ашчаджваць грошы'], trasiankaFlag: null },
    { word: 'танны', article: null, gender: null, category: 'shopping', definition: 'cheap / inexpensive',
      exampleSentence: 'Гэты рэстаран вельмі танны.', collocations: ['танны тавар'], trasiankaFlag: null },
    // Weather
    { word: 'дождж', article: null, gender: 'm', category: 'weather', definition: 'rain',
      exampleSentence: 'Дождж не спыняецца з учора.', collocations: ['моцны дождж', 'пад дажджом'], trasiankaFlag: null },
    { word: 'сонца', article: null, gender: 'n', category: 'weather', definition: 'sun',
      exampleSentence: 'Сёння шмат сонца.', collocations: ['на сонцы', 'сонечнае надвор\'е'], trasiankaFlag: null },
    // Health
    { word: 'галава', article: null, gender: 'f', category: 'health', definition: 'head',
      exampleSentence: 'У мяне баліць галава.', collocations: ['галаўны боль', 'ад галавы'], trasiankaFlag: 'аканне: Russian голова → Belarusian галава' },
    { word: 'лекар', article: null, gender: 'm', category: 'health', definition: 'doctor',
      exampleSentence: 'Заўтра ў мяне сустрэча з лекарам.', collocations: ['ісці да лекара'], trasiankaFlag: null },
    { word: 'хворы', article: null, gender: null, category: 'health', definition: 'sick / ill',
      exampleSentence: 'Мой сын сёння хворы.', collocations: ['захварэць', 'быць хворым'], trasiankaFlag: null },
    { word: 'боль', article: null, gender: 'm', category: 'health', definition: 'pain / ache',
      exampleSentence: 'У мяне моцны боль у спіне.', collocations: ['галаўны боль', 'зубны боль'], trasiankaFlag: null },
    { word: 'цікавы', article: null, gender: null, category: 'adjectives', definition: 'interesting',
      exampleSentence: 'Гэты фільм вельмі цікавы.', collocations: ['цікавая кніга', 'цікавы чалавек'], trasiankaFlag: 'Don\'t use *интересный (Russian)' },
    { word: 'зараз', article: null, gender: null, category: 'time', definition: 'now',
      exampleSentence: 'Зараз я іду дадому.', collocations: ['зараз жа', 'прама зараз'], trasiankaFlag: 'Don\'t use *сейчас (Russian)' },
  ],

  B1: [
    // Work
    { word: 'прадпрыемства', article: null, gender: 'n', category: 'work', definition: 'enterprise / company',
      exampleSentence: 'Я працую на прадпрыемстве тэхналогій.', collocations: ['прыватнае прадпрыемства', 'дзяржаўнае прадпрыемства'], trasiankaFlag: null },
    { word: 'сустрэча', article: null, gender: 'f', category: 'work', definition: 'meeting',
      exampleSentence: 'Сустрэча пачынаецца а дзесятай.', collocations: ['мець сустрэчу', 'дзелавая сустрэча'], trasiankaFlag: null },
    { word: 'заробак', article: null, gender: 'm', category: 'work', definition: 'salary / wages',
      exampleSentence: 'Мне павысяць заробак у гэтым годзе.', collocations: ['мінімальны заробак', 'атрымліваць заробак'], trasiankaFlag: null },
    { word: 'кіраўнік', article: null, gender: 'm', category: 'work', definition: 'boss / manager',
      exampleSentence: 'Мой кіраўнік вельмі патрабавальны, але справядлівы.', collocations: ['кіраўнік аддзела'], trasiankaFlag: null },
    // Emotions
    { word: 'надзея', article: null, gender: 'f', category: 'emotions', definition: 'hope',
      exampleSentence: 'У мяне ёсць надзея, што ўсё будзе добра.', collocations: ['страціць надзею', 'мець надзею'], trasiankaFlag: null },
    { word: 'ганарысты', article: null, gender: null, category: 'emotions', definition: 'proud',
      exampleSentence: 'Я вельмі ганаруся сваёй дачкой.', collocations: ['быць ганарыстым', 'адчуваць гонар'], trasiankaFlag: null },
    { word: 'занепакоены', article: null, gender: null, category: 'emotions', definition: 'worried',
      exampleSentence: 'Я занепакоены экзаменам.', collocations: ['быць занепакоеным'], trasiankaFlag: null },
    // Abstract / Belarusian-specific
    { word: 'ведаць', article: null, gender: null, category: 'verbs', definition: 'to know',
      exampleSentence: 'Я не ведаю адказу.', collocations: ['ведаць на памяць', 'ведаць пра'], trasiankaFlag: 'Don\'t use *знать (Russian). Ведаць is Belarusian' },
    { word: 'размаўляць', article: null, gender: null, category: 'verbs', definition: 'to speak / converse',
      exampleSentence: 'Мы размаўляем па-беларуску.', collocations: ['размаўляць па тэлефоне'], trasiankaFlag: 'More Belarusian than гаварыць' },
    { word: 'спадабацца', article: null, gender: null, category: 'verbs', definition: 'to like (perfective)',
      exampleSentence: 'Мне вельмі спадабаўся гэты фільм.', collocations: ['спадабацца каму-небудзь'], trasiankaFlag: 'Don\'t use *понравиться (Russian)' },
    { word: 'шкадаваць', article: null, gender: null, category: 'verbs', definition: 'to regret / feel sorry',
      exampleSentence: 'Я шкадую, што не прыйшоў.', collocations: ['шкадаваць пра нешта'], trasiankaFlag: 'Don\'t use *жалеть (Russian)' },
    // Education
    { word: 'навучанне', article: null, gender: 'n', category: 'education', definition: 'education / learning',
      exampleSentence: 'Навучанне ва ўніверсітэце працягваецца пяць гадоў.', collocations: ['вышэйшае навучанне'], trasiankaFlag: null },
    // Daily life
    { word: 'звычка', article: null, gender: 'f', category: 'daily', definition: 'habit / custom',
      exampleSentence: 'У мяне ёсць звычка гуляць пасля вячэры.', collocations: ['дрэнная звычка', 'як звычайна'], trasiankaFlag: null },
    { word: 'пераехаць', article: null, gender: null, category: 'daily', definition: 'to move (change residence)',
      exampleSentence: 'Мы пераехалі ў Мінск мінулым месяцам.', collocations: ['пераехаць у новы дом'], trasiankaFlag: null },
    { word: 'наймаць', article: null, gender: null, category: 'daily', definition: 'to rent',
      exampleSentence: 'Я хачу наняць кватэру ў цэнтры.', collocations: ['наняць кватэру', 'наняць пакой'], trasiankaFlag: null },
    // Aspect pairs
    { word: 'чытаць / прачытаць', article: null, gender: null, category: 'aspect', definition: 'to read (impf/pf)',
      exampleSentence: 'Я чытаю кнігу. / Я прачытаў кнігу.', collocations: ['чытаць услых', 'прачытаць да канца'], trasiankaFlag: null },
    { word: 'пісаць / напісаць', article: null, gender: null, category: 'aspect', definition: 'to write (impf/pf)',
      exampleSentence: 'Я пішу ліст. / Я напісаў ліст.', collocations: ['пісаць ліст', 'напісаць дыктант'], trasiankaFlag: null },
    { word: 'рабіць / зрабіць', article: null, gender: null, category: 'aspect', definition: 'to do/make (impf/pf)',
      exampleSentence: 'Я раблю хатнюю працу. / Я зрабіў хатнюю працу.', collocations: ['рабіць памылку', 'зрабіць выбар'], trasiankaFlag: null },
    { word: 'купляць / купіць', article: null, gender: null, category: 'aspect', definition: 'to buy (impf/pf)',
      exampleSentence: 'Я купляю хлеб кожны дзень. / Я купіў новую кнігу.', collocations: ['купляць прадукты', 'купіць падарунак'], trasiankaFlag: null },
  ],

  B2: [
    // Work advanced
    { word: 'звальненне', article: null, gender: 'n', category: 'work', definition: 'dismissal / layoff',
      exampleSentence: 'Звальненне было зусім нечаканым.', collocations: ['звальненне з працы', 'пісьмо аб звальненні'], trasiankaFlag: null },
    { word: 'павышэнне', article: null, gender: 'n', category: 'work', definition: 'promotion / raise',
      exampleSentence: 'Пасля пяці гадоў ён атрымаў павышэнне.', collocations: ['атрымаць павышэнне'], trasiankaFlag: null },
    { word: 'прадукцыйнасць', article: null, gender: 'f', category: 'work', definition: 'productivity / performance',
      exampleSentence: 'Прадукцыйнасць каманды значна палепшылася.', collocations: ['высокая прадукцыйнасць'], trasiankaFlag: null },
    // Society
    { word: 'няроўнасць', article: null, gender: 'f', category: 'society', definition: 'inequality',
      exampleSentence: 'Сацыяльная няроўнасць застаецца праблемай.', collocations: ['гендарная няроўнасць', 'эканамічная няроўнасць'], trasiankaFlag: null },
    { word: 'грамадзянства', article: null, gender: 'n', category: 'society', definition: 'citizenship',
      exampleSentence: 'Ён падаў заяўку на беларускае грамадзянства.', collocations: ['атрымаць грамадзянства', 'падвойнае грамадзянства'], trasiankaFlag: null },
    { word: 'пратэст', article: null, gender: 'm', category: 'society', definition: 'protest / demonstration',
      exampleSentence: 'Мірны пратэст адбыўся на плошчы.', collocations: ['мірны пратэст', 'масавы пратэст'], trasiankaFlag: null },
    // Abstract
    { word: 'адценне', article: null, gender: 'n', category: 'abstract', definition: 'nuance / shade',
      exampleSentence: 'У гэтым сказе ёсць важнае адценне значэння.', collocations: ['адценне значэння', 'з адценнямі'], trasiankaFlag: null },
    { word: 'скарыстаць', article: null, gender: null, category: 'abstract', definition: 'to take advantage of / use',
      exampleSentence: 'Трэба скарыстаць добрае надвор\'е.', collocations: ['скарыстаць магчымасць', 'скарыстаць час'], trasiankaFlag: null },
    { word: 'неабходны', article: null, gender: null, category: 'abstract', definition: 'necessary / essential',
      exampleSentence: 'Слоўнік неабходны для гэтага курсу.', collocations: ['быць неабходным', 'неабходная ўмова'], trasiankaFlag: null },
    // Environment
    { word: 'навакольнае асяроддзе', article: null, gender: 'n', category: 'environment', definition: 'environment (natural)',
      exampleSentence: 'Мы павінны ахоўваць навакольнае асяроддзе.', collocations: ['ахова навакольнага асяроддзя'], trasiankaFlag: null },
    { word: 'устойлівы', article: null, gender: null, category: 'environment', definition: 'sustainable',
      exampleSentence: 'Нам патрэбна больш устойлівае развіццё.', collocations: ['устойлівае развіццё', 'устойлівая энергетыка'], trasiankaFlag: null },
    // Belarusian culture
    { word: 'спадчына', article: null, gender: 'f', category: 'culture', definition: 'heritage / legacy',
      exampleSentence: 'Культурная спадчына Беларусі вельмі багатая.', collocations: ['культурная спадчына', 'нацыянальная спадчына'], trasiankaFlag: null },
    { word: 'вышываная кашуля', article: null, gender: 'f', category: 'culture', definition: 'embroidered shirt (traditional)',
      exampleSentence: 'Вышываная кашуля — сімвал беларускай культуры.', collocations: ['насіць вышыванку'], trasiankaFlag: null },
    // Collocations
    { word: 'прымаць рашэнне', article: null, gender: null, category: 'collocations', definition: 'to make a decision',
      exampleSentence: 'Трэба прыняць рашэнне сёння.', collocations: ['важнае рашэнне', 'прыняць правільнае рашэнне'], trasiankaFlag: null },
    { word: 'звяртаць увагу', article: null, gender: null, category: 'collocations', definition: 'to pay attention',
      exampleSentence: 'Звярніце ўвагу на гэты факт.', collocations: ['звяртаць увагу на'], trasiankaFlag: null },
    { word: 'мець рацыю', article: null, gender: null, category: 'collocations', definition: 'to be right',
      exampleSentence: 'Ты маеш рацыю.', collocations: ['не мець рацыі'], trasiankaFlag: null },
    { word: 'браць удзел', article: null, gender: null, category: 'collocations', definition: 'to take part',
      exampleSentence: 'Я хачу браць удзел у спаборніцтвах.', collocations: ['актыўны ўдзел'], trasiankaFlag: null },
    { word: 'кахаць', article: null, gender: null, category: 'emotions', definition: 'to love (romantic)',
      exampleSentence: 'Я кахаю цябе.', collocations: ['кахаць усім сэрцам'], trasiankaFlag: 'Distinctly Belarusian. Russian: любить' },
    { word: 'абяцаць', article: null, gender: null, category: 'verbs', definition: 'to promise',
      exampleSentence: 'Я абяцаю прыйсці заўтра.', collocations: ['абяцаць дапамогу'], trasiankaFlag: 'Don\'t use *обещать (Russian)' },
    { word: 'дапамагаць / дапамагчы', article: null, gender: null, category: 'aspect', definition: 'to help (impf/pf)',
      exampleSentence: 'Ён заўсёды дапамагае сябрам.', collocations: ['дапамагаць + dative'], trasiankaFlag: 'Don\'t use *помогать (Russian). Different prefix' },
  ],

  C1: [
    // Academic
    { word: 'сфера', article: null, gender: 'f', category: 'academic', definition: 'sphere / field / scope',
      exampleSentence: 'У сферы даследаванняў вынікі абнадзейлівыя.', collocations: ['у сферы', 'сфера дзейнасці'], trasiankaFlag: null },
    { word: 'закранаць', article: null, gender: null, category: 'academic', definition: 'to address / tackle / touch upon',
      exampleSentence: 'Неабходна закрануць гэтую тэму сур\'ёзна.', collocations: ['закрануць пытанне', 'закрануць праблему'], trasiankaFlag: null },
    { word: 'выконваць', article: null, gender: null, category: 'academic', definition: 'to perform / fulfill (a role)',
      exampleSentence: 'Ён выконвае ключавую ролю ў прадпрыемстве.', collocations: ['выконваць ролю', 'выконваць абавязкі'], trasiankaFlag: null },
    { word: 'ахопліваць', article: null, gender: null, category: 'academic', definition: 'to encompass / cover / span',
      exampleSentence: 'Даследаванне ахоплівае дзесяцігадовы перыяд.', collocations: ['ахопліваць тэму', 'шырока ахопліваць'], trasiankaFlag: null },
    // Connectors
    { word: 'тым не менш', article: null, gender: null, category: 'connectors', definition: 'nevertheless / however',
      exampleSentence: 'План рызыкоўны; тым не менш, варта паспрабаваць.', collocations: [], trasiankaFlag: null },
    { word: 'нягледзячы на', article: null, gender: null, category: 'connectors', definition: 'despite / in spite of',
      exampleSentence: 'Нягледзячы на цяжкасці, ён працягваў.', collocations: ['нягледзячы на тое, што'], trasiankaFlag: null },
    { word: 'наадварот', article: null, gender: null, category: 'connectors', definition: 'on the contrary',
      exampleSentence: 'Ён аддае перавагу кіно; яна, наадварот, аддае перавагу тэатру.', collocations: [], trasiankaFlag: null },
    // Idiomatic
    { word: 'разлічваць на', article: null, gender: null, category: 'idiomatic', definition: 'to count on / rely on',
      exampleSentence: 'Ты можаш разлічваць на мяне.', collocations: ['разлічваць на дапамогу'], trasiankaFlag: null },
    { word: 'лічыць за відавочнае', article: null, gender: null, category: 'idiomatic', definition: 'to take for granted',
      exampleSentence: 'Не лічы за відавочнае, што ўсё будзе добра.', collocations: [], trasiankaFlag: null },
    // Formal
    { word: 'афармляць', article: null, gender: null, category: 'formal', definition: 'to process / formalize (paperwork)',
      exampleSentence: 'Мне трэба аформіць дазвол на пражыванне.', collocations: ['аформіць візу', 'аформіць дакументы'], trasiankaFlag: null },
    { word: 'дзейны', article: null, gender: null, category: 'formal', definition: 'in force / current / valid',
      exampleSentence: 'Дзейны закон забараняе гэтую практыку.', collocations: ['дзейнае заканадаўства'], trasiankaFlag: null },
    // Proverbs
    { word: 'без працы не будзе палацаў', article: null, gender: null, category: 'proverbs', definition: 'no pain, no gain (lit: without work there\'ll be no palaces)',
      exampleSentence: 'Як кажуць, без працы не будзе палацаў.', collocations: [], trasiankaFlag: null },
    { word: 'сваё балота кожнай жабе мілае', article: null, gender: null, category: 'proverbs', definition: 'there\'s no place like home (lit: every frog loves its own swamp)',
      exampleSentence: 'Я не хачу пераязджаць — сваё балота кожнай жабе мілае.', collocations: [], trasiankaFlag: null },
    { word: 'не ўсё тое золата, што блішчыць', article: null, gender: null, category: 'proverbs', definition: 'not all that glitters is gold',
      exampleSentence: 'Будзь асцярожны: не ўсё тое золата, што блішчыць.', collocations: [], trasiankaFlag: null },
    // Abstract advanced
    { word: 'паступовы', article: null, gender: null, category: 'abstract', definition: 'gradual',
      exampleSentence: 'Назіраецца паступовая змена ў стаўленні.', collocations: ['паступовая змена', 'паступовае паляпшэнне'], trasiankaFlag: null },
    { word: 'непазбежны', article: null, gender: null, category: 'abstract', definition: 'unavoidable / inevitable',
      exampleSentence: 'Рэформа сістэмы — непазбежная задача.', collocations: ['непазбежны вынік'], trasiankaFlag: null },
    { word: 'свядомасць', article: null, gender: 'f', category: 'abstract', definition: 'consciousness / awareness',
      exampleSentence: 'Нацыянальная свядомасць расце.', collocations: ['нацыянальная свядомасць', 'грамадская свядомасць'], trasiankaFlag: null },
    { word: 'адметнасць', article: null, gender: 'f', category: 'abstract', definition: 'distinctiveness / uniqueness',
      exampleSentence: 'Адметнасць беларускай культуры заслугоўвае ўвагі.', collocations: ['культурная адметнасць', 'моўная адметнасць'], trasiankaFlag: null },
    { word: 'трасянка', article: null, gender: 'f', category: 'linguistics', definition: 'Trasianka (Russian-Belarusian mixed speech)',
      exampleSentence: 'Трасянка — гэта змешанае руска-беларускае маўленне.', collocations: ['гаварыць на трасянцы', 'пазбягаць трасянкі'], trasiankaFlag: 'Know the word, avoid the practice' },
  ],

  C2: [
    // Literary
    { word: 'натхненне', article: null, gender: 'n', category: 'literary', definition: 'inspiration',
      exampleSentence: 'Натхненне прыйшло нечакана.', collocations: ['знайсці натхненне', 'крыніца натхнення'], trasiankaFlag: null },
    { word: 'суцяшэнне', article: null, gender: 'n', category: 'literary', definition: 'consolation / comfort',
      exampleSentence: 'Ён знайшоў суцяшэнне ў паэзіі.', collocations: ['знайсці суцяшэнне'], trasiankaFlag: null },
    { word: 'спрадвечны', article: null, gender: null, category: 'literary', definition: 'eternal / primordial',
      exampleSentence: 'Спрадвечнае пытанне ідэнтычнасці.', collocations: ['спрадвечнае пытанне'], trasiankaFlag: null },
    { word: 'сузіранне', article: null, gender: 'n', category: 'literary', definition: 'contemplation',
      exampleSentence: 'Ён аддаўся сузіранню прыроды.', collocations: ['ціхае сузіранне'], trasiankaFlag: null },
    // Discourse markers
    { word: 'дарэчы', article: null, gender: null, category: 'discourse', definition: 'by the way / incidentally',
      exampleSentence: 'Дарэчы, я забыўся сказаць...', collocations: ['дарэчы кажучы'], trasiankaFlag: 'Don\'t use *кстати (Russian)' },
    { word: 'бадай', article: null, gender: null, category: 'discourse', definition: 'perhaps / probably',
      exampleSentence: 'Бадай, гэта лепшы варыянт.', collocations: ['бадай што'], trasiankaFlag: null },
    { word: 'мусіць', article: null, gender: null, category: 'discourse', definition: 'probably / must (epistemic)',
      exampleSentence: 'Ён, мусіць, ужо пайшоў.', collocations: ['мусіць быць'], trasiankaFlag: 'Distinctly Belarusian. No direct Russian equivalent as discourse marker' },
    // Proverbs advanced
    { word: 'хто рана ўстае, таму Бог дае', article: null, gender: null, category: 'proverbs', definition: 'the early bird catches the worm',
      exampleSentence: 'Устань раней — хто рана ўстае, таму Бог дае.', collocations: [], trasiankaFlag: null },
    { word: 'мая хата з краю', article: null, gender: null, category: 'proverbs', definition: 'not my problem (ironic)',
      exampleSentence: '«Мая хата з краю» — небяспечная пазіцыя.', collocations: [], trasiankaFlag: null },
    { word: 'добрае слова і каменю мілае', article: null, gender: null, category: 'proverbs', definition: 'a good word is dear even to stone',
      exampleSentence: 'Памятай: добрае слова і каменю мілае.', collocations: [], trasiankaFlag: null },
    // Register variation
    { word: 'кватэра', article: null, gender: 'f', category: 'everyday', definition: 'apartment',
      exampleSentence: 'Яна жыве ў невялікай кватэры.', collocations: ['здаваць кватэру', 'наймаць кватэру'], trasiankaFlag: 'Don\'t use *квартира (Russian)' },
    { word: 'хадзіць', article: null, gender: null, category: 'verbs', definition: 'to walk / go (habitual)',
      exampleSentence: 'Я хаджу ў школу кожны дзень.', collocations: ['хадзіць у краму', 'хадзіць пешшу'], trasiankaFlag: 'дзеканне: Russian ходить → Belarusian хадзіць' },
    { word: 'дзяўчына', article: null, gender: 'f', category: 'everyday', definition: 'girl / young woman',
      exampleSentence: 'Гэтая дзяўчына вучыцца ва ўніверсітэце.', collocations: ['маладая дзяўчына'], trasiankaFlag: 'дзеканне: Russian девушка → Belarusian дзяўчына (completely different)' },
    { word: 'глядзець', article: null, gender: null, category: 'verbs', definition: 'to look / watch',
      exampleSentence: 'Я гляджу фільм.', collocations: ['глядзець у акно', 'глядзець тэлевізар'], trasiankaFlag: 'Don\'t use *смотреть (Russian)' },
    // Diminutives
    { word: 'сонейка', article: null, gender: 'n', category: 'diminutives', definition: 'little sun (diminutive of сонца)',
      exampleSentence: 'Сонейка выглянула з-за хмар.', collocations: ['яснае сонейка'], trasiankaFlag: null },
    { word: 'сэрцайка', article: null, gender: 'n', category: 'diminutives', definition: 'little heart (diminutive of сэрца)',
      exampleSentence: 'Маё сэрцайка б\'ецца хутка.', collocations: [], trasiankaFlag: null },
    { word: 'хлебчык', article: null, gender: 'm', category: 'diminutives', definition: 'little bread (diminutive of хлеб)',
      exampleSentence: 'Дай мне хлебчыку, калі ласка.', collocations: [], trasiankaFlag: null },
    // Advanced verbs
    { word: 'спасцігнуць', article: null, gender: null, category: 'academic', definition: 'to comprehend / grasp',
      exampleSentence: 'Цяжка спасцігнуць увесь маштаб праблемы.', collocations: ['спасцігнуць ісціну'], trasiankaFlag: null },
    { word: 'ўвасобіць', article: null, gender: null, category: 'academic', definition: 'to embody / realize',
      exampleSentence: 'Ён увасобіў свае мары ў жыццё.', collocations: ['увасобіць ідэю'], trasiankaFlag: null },
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
    prompt: `What does "${targetWord.word}" mean?`,
    options,
    answer: targetWord.definition,
    word: targetWord.word,
    trasiankaFlag: targetWord.trasiankaFlag,
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
      prompt: `Complete the sentence with the correct word:\n"${sentence.replace(targetWord.word, '________')}"`,
      answer: targetWord.word,
      hint: targetWord.definition,
      word: targetWord.word,
    };
  }
  return {
    type: 'fill-in-blank',
    prompt: `Fill in the blank:\n"${blanked}"`,
    answer: targetWord.word,
    hint: targetWord.definition,
    word: targetWord.word,
  };
}

function makeMatchingExercise(level) {
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const items = core.pick(bank, 5);
  const pairs = items.map(w => ({ word: w.word, definition: w.definition }));
  return {
    type: 'matching',
    prompt: 'Match each word with its definition.',
    pairs,
    shuffledDefinitions: core.shuffle(pairs.map(p => p.definition)),
    words: pairs.map(p => p.word),
  };
}

function makeContextGuessExercise(targetWord) {
  return {
    type: 'context-guess',
    prompt: `Read the sentence and guess the meaning of the underlined word:\n"${targetWord.exampleSentence}"\n\nWhat does "${targetWord.word}" mean?`,
    answer: targetWord.definition,
    word: targetWord.word,
    trasiankaFlag: targetWord.trasiankaFlag,
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
    prompt: `Which is a common collocation with "${targetWord.word}"?`,
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
    if (!Array.isArray(userAnswer)) return { correct: false, message: 'Provide matched pairs.' };
    const correctCount = userAnswer.filter(ua =>
      exercise.pairs.some(p => normalise(p.word) === normalise(ua.word) && normalise(p.definition) === normalise(ua.definition))
    ).length;
    return {
      correct: correctCount === exercise.pairs.length,
      score: correctCount,
      total: exercise.pairs.length,
      message: correctCount === exercise.pairs.length ? 'Цудоўна!' : `${correctCount}/${exercise.pairs.length} correct.`,
    };
  }

  const expected = normalise(exercise.answer);
  const given = normalise(userAnswer);

  if (given === expected) {
    return { correct: true, message: 'Правільна! Малайчына.' };
  }

  if (expected.includes(given) && given.length > 2) {
    return { correct: true, partial: true, message: `Close enough — the full answer is "${exercise.answer}".` };
  }

  return {
    correct: false,
    message: `Not quite. The answer is "${exercise.answer}".`,
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
        gender: w.gender,
        definition: w.definition,
        exampleSentence: w.exampleSentence,
        collocations: w.collocations,
        trasiankaFlag: w.trasiankaFlag,
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
      return { [lvl]: (WORD_BANKS[lvl] || []).map(w => ({ word: w.word, gender: w.gender, definition: w.definition, category: w.category, trasiankaFlag: w.trasiankaFlag })) };
    }
    const catalog = {};
    for (const l of core.CEFR) {
      if (WORD_BANKS[l]) {
        catalog[l] = WORD_BANKS[l].map(w => ({ word: w.word, gender: w.gender, definition: w.definition, category: w.category, trasiankaFlag: w.trasiankaFlag }));
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
