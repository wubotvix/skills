// Russian Vocabulary Tutor — complete implementation with embedded data
// Usage: node tutor.js <command> [args...]
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'russian-vocabulary';
const MAX_NEW_PER_SESSION = 7;

// ─── Embedded Word Banks by CEFR Level ───────────────────────────────────────

const WORD_BANKS = {
  A1: [
    // Greetings
    { word: 'здра́вствуйте', gender: null, category: 'greetings', definition: 'hello (formal)',
      exampleSentence: 'Здра́вствуйте, как ва́ши дела́?', collocations: ['здра́вствуйте, дорого́й', 'здра́вствуйте, колле́ги'], falseFriends: null, aspectPair: null },
    { word: 'до свида́ния', gender: null, category: 'greetings', definition: 'goodbye',
      exampleSentence: 'До свида́ния, до за́втра!', collocations: ['сказа́ть до свида́ния', 'до ско́рого свида́ния'], falseFriends: null, aspectPair: null },
    { word: 'спаси́бо', gender: null, category: 'greetings', definition: 'thank you',
      exampleSentence: 'Большо́е спаси́бо за по́мощь!', collocations: ['спаси́бо большо́е', 'спаси́бо за'], falseFriends: null, aspectPair: null },
    { word: 'пожа́луйста', gender: null, category: 'greetings', definition: 'please / you are welcome',
      exampleSentence: 'Дайте, пожа́луйста, меню́.', collocations: ['пожа́луйста', 'бу́дьте добры́'], falseFriends: null, aspectPair: null },
    // Food
    { word: 'хлеб', gender: 'м', category: 'food', definition: 'bread',
      exampleSentence: 'Купи́, пожа́луйста, хле́ба.', collocations: ['чёрный хлеб', 'бе́лый хлеб', 'кусо́к хле́ба'], falseFriends: null, aspectPair: null },
    { word: 'молоко́', gender: 'с', category: 'food', definition: 'milk',
      exampleSentence: 'Я пью молоко́ ка́ждое у́тро.', collocations: ['стака́н молока́', 'молоко́ с ка́шей'], falseFriends: null, aspectPair: null },
    { word: 'вода́', gender: 'ж', category: 'food', definition: 'water',
      exampleSentence: 'Да́йте стака́н воды́, пожа́луйста.', collocations: ['пить во́ду', 'холо́дная вода́', 'минера́льная вода́'], falseFriends: null, aspectPair: null },
    { word: 'ча́й', gender: 'м', category: 'food', definition: 'tea',
      exampleSentence: 'Хоти́те ча́й с са́харом?', collocations: ['чёрный ча́й', 'зелёный ча́й', 'пить чай'], falseFriends: null, aspectPair: null },
    // Family
    { word: 'ма́ма', gender: 'ж', category: 'family', definition: 'mom',
      exampleSentence: 'Моя́ ма́ма о́чень хорошо́ гото́вит.', collocations: ['ма́ма и па́па', 'лю́бимая ма́ма'], falseFriends: null, aspectPair: null },
    { word: 'па́па', gender: 'м', category: 'family', definition: 'dad',
      exampleSentence: 'Мой па́па рабо́тает в больни́це.', collocations: ['па́па и ма́ма', 'мой па́па'], falseFriends: null, aspectPair: null },
    { word: 'брат', gender: 'м', category: 'family', definition: 'brother',
      exampleSentence: 'У меня́ есть ста́рший брат.', collocations: ['ста́рший брат', 'мла́дший брат'], falseFriends: null, aspectPair: null },
    { word: 'друг', gender: 'м', category: 'family', definition: 'friend',
      exampleSentence: 'Мой друг живёт ря́дом.', collocations: ['лу́чший друг', 'ста́рый друг', 'друг дру́га'], falseFriends: null, aspectPair: null },
    // Everyday
    { word: 'дом', gender: 'м', category: 'everyday', definition: 'house / home',
      exampleSentence: 'Наш дом стои́т на ти́хой у́лице.', collocations: ['до́ма', 'идти́ домо́й', 'до́мик'], falseFriends: null, aspectPair: null },
    { word: 'кни́га', gender: 'ж', category: 'everyday', definition: 'book',
      exampleSentence: 'Я чита́ю интере́сную кни́гу.', collocations: ['кни́жный магази́н', 'кни́жка', 'учéбник'], falseFriends: { en: 'library = библиоте́ка (not кни́га)' }, aspectPair: null },
    { word: 'стол', gender: 'м', category: 'everyday', definition: 'table / desk',
      exampleSentence: 'Кни́ги лежа́т на столе́.', collocations: ['за столо́м', 'пи́сьменный стол', 'обе́денный стол'], falseFriends: null, aspectPair: null },
    { word: 'у́лица', gender: 'ж', category: 'everyday', definition: 'street',
      exampleSentence: 'На у́лице хо́лодно.', collocations: ['идти́ по у́лице', 'гла́вная у́лица'], falseFriends: null, aspectPair: null },
    // Time
    { word: 'день', gender: 'м', category: 'time', definition: 'day',
      exampleSentence: 'Како́й сего́дня прекра́сный день!', collocations: ['ка́ждый день', 'до́брый день', 'рабо́чий день'], falseFriends: null, aspectPair: null },
    { word: 'ночь', gender: 'ж', category: 'time', definition: 'night',
      exampleSentence: 'Споко́йной но́чи!', collocations: ['но́чью', 'до́брой но́чи', 'всю ночь'], falseFriends: null, aspectPair: null },
    { word: 'сего́дня', gender: null, category: 'time', definition: 'today',
      exampleSentence: 'Сего́дня хоро́шая пого́да.', collocations: ['сего́дня у́тром', 'сего́дня ве́чером'], falseFriends: null, aspectPair: null },
    { word: 'большо́й', gender: null, category: 'adjectives', definition: 'big / large',
      exampleSentence: 'Москва́ — большо́й го́род.', collocations: ['большо́й дом', 'Большо́й теа́тр'], falseFriends: { en: 'Bolshoi Theatre' }, aspectPair: null },
  ],

  A2: [
    // Travel
    { word: 'вокза́л', gender: 'м', category: 'travel', definition: 'train station',
      exampleSentence: 'По́езд отправля́ется с Ленингра́дского вокза́ла.', collocations: ['железнодоро́жный вокза́л', 'е́хать на вокза́л'], falseFriends: null, aspectPair: null },
    { word: 'биле́т', gender: 'м', category: 'travel', definition: 'ticket',
      exampleSentence: 'Мне ну́жно купи́ть биле́т на по́езд.', collocations: ['биле́т туда́ и обра́тно', 'купи́ть биле́т'], falseFriends: null, aspectPair: null },
    { word: 'чемода́н', gender: 'м', category: 'travel', definition: 'suitcase',
      exampleSentence: 'Мой чемода́н сли́шком тяжёлый.', collocations: ['собра́ть чемода́н', 'чемода́н на колёсиках'], falseFriends: null, aspectPair: null },
    { word: 'са́молёт', gender: 'м', category: 'travel', definition: 'airplane',
      exampleSentence: 'Самолёт вылета́ет в де́вять часо́в.', collocations: ['лете́ть на самолёте', 'биле́т на самолёт'], falseFriends: null, aspectPair: null },
    // Shopping
    { word: 'магази́н', gender: 'м', category: 'shopping', definition: 'store / shop',
      exampleSentence: 'Магази́н закрыва́ется в де́вять.', collocations: ['продукто́вый магази́н', 'ходи́ть по магази́нам'], falseFriends: { en: 'magazine = журна́л (not магази́н!)' }, aspectPair: null },
    { word: 'цена́', gender: 'ж', category: 'shopping', definition: 'price',
      exampleSentence: 'Кака́я цена́ э́того пальто́?', collocations: ['высо́кая цена́', 'ни́зкая цена́', 'по цене́'], falseFriends: null, aspectPair: null },
    { word: 'де́ньги', gender: null, category: 'shopping', definition: 'money (pl. only)',
      exampleSentence: 'У меня́ нет де́нег.', collocations: ['зараба́тывать де́ньги', 'копи́ть де́ньги', 'нали́чные де́ньги'], falseFriends: null, aspectPair: null },
    { word: 'дёшево', gender: null, category: 'shopping', definition: 'cheap / inexpensive',
      exampleSentence: 'Здесь мо́жно дёшево пое́сть.', collocations: ['о́чень дёшево', 'деше́вле'], falseFriends: null, aspectPair: null },
    // Weather
    { word: 'дождь', gender: 'м', category: 'weather', definition: 'rain',
      exampleSentence: 'На у́лице идёт дождь.', collocations: ['си́льный дождь', 'под дождём', 'идёт дождь'], falseFriends: null, aspectPair: null },
    { word: 'со́лнце', gender: 'с', category: 'weather', definition: 'sun',
      exampleSentence: 'Сего́дня све́тит со́лнце.', collocations: ['на со́лнце', 'со́лнечный день', 'со́лнечные очки́'], falseFriends: null, aspectPair: null },
    { word: 'хо́лодно', gender: null, category: 'weather', definition: 'cold (adv.)',
      exampleSentence: 'Зимо́й в Росси́и о́чень хо́лодно.', collocations: ['мне хо́лодно', 'на у́лице хо́лодно'], falseFriends: null, aspectPair: null },
    // Health
    { word: 'голова́', gender: 'ж', category: 'health', definition: 'head',
      exampleSentence: 'У меня́ боли́т голова́.', collocations: ['головна́я боль', 'поверну́ть го́лову'], falseFriends: null, aspectPair: null },
    { word: 'врач', gender: 'м', category: 'health', definition: 'doctor',
      exampleSentence: 'Мне ну́жно пойти́ к врачу́.', collocations: ['вы́звать врача́', 'приём у врача́'], falseFriends: null, aspectPair: null },
    { word: 'аптéка', gender: 'ж', category: 'health', definition: 'pharmacy',
      exampleSentence: 'Аптéка нахо́дится за у́глом.', collocations: ['купи́ть в аптéке', 'ближа́йшая аптéка'], falseFriends: null, aspectPair: null },
    // Verbs
    { word: 'ходи́ть / идти́', gender: null, category: 'verbs', definition: 'to go (on foot) — multi/unidirectional',
      exampleSentence: 'Я хожу́ на рабо́ту пешко́м. / Я иду́ в магази́н.', collocations: ['ходи́ть пешко́м', 'идти́ домо́й'], falseFriends: null, aspectPair: 'unidirectional/multidirectional pair' },
    { word: 'е́здить / е́хать', gender: null, category: 'verbs', definition: 'to go (by transport) — multi/unidirectional',
      exampleSentence: 'Мы е́здим на да́чу ка́ждые выходны́е. / Мы е́дем в Петербу́рг.', collocations: ['е́хать на маши́не', 'е́здить на рабо́ту'], falseFriends: null, aspectPair: 'unidirectional/multidirectional pair' },
    { word: 'покупа́ть / купи́ть', gender: null, category: 'verbs', definition: 'to buy (impf./pf.)',
      exampleSentence: 'Я обы́чно покупа́ю хлеб в э́том магази́не. / Я купи́л но́вую кни́гу.', collocations: ['купи́ть пода́рок', 'покупа́ть проду́кты'], falseFriends: null, aspectPair: 'покупа́ть (impf.) / купи́ть (pf.)' },
    { word: 'нра́виться / понра́виться', gender: null, category: 'verbs', definition: 'to like / to be pleasing',
      exampleSentence: 'Мне нра́вится э́тот го́род. / Мне понра́вился фильм.', collocations: ['мне нра́вится', 'тебе́ нра́вится'], falseFriends: null, aspectPair: 'нра́виться (impf.) / понра́виться (pf.)' },
    { word: 'гото́вить / пригото́вить', gender: null, category: 'verbs', definition: 'to cook / prepare (impf./pf.)',
      exampleSentence: 'Она́ лю́бит гото́вить. / Я пригото́вил у́жин.', collocations: ['гото́вить обе́д', 'гото́вить к экза́мену'], falseFriends: null, aspectPair: 'гото́вить (impf.) / пригото́вить (pf.)' },
    { word: 'рабо́тать', gender: null, category: 'verbs', definition: 'to work',
      exampleSentence: 'Я рабо́таю в о́фисе.', collocations: ['рабо́тать учи́телем', 'рабо́тать над прое́ктом'], falseFriends: null, aspectPair: null },
  ],

  B1: [
    // Abstract / opinions
    { word: 'мне́ние', gender: 'с', category: 'opinions', definition: 'opinion',
      exampleSentence: 'По моему́ мне́нию, э́то хоро́шая иде́я.', collocations: ['по мое́му мне́нию', 'вы́сказать мне́ние', 'обще́ственное мне́ние'], falseFriends: null, aspectPair: null },
    { word: 'реше́ние', gender: 'с', category: 'opinions', definition: 'decision / solution',
      exampleSentence: 'Мы при́няли ва́жное реше́ние.', collocations: ['приня́ть реше́ние', 'пра́вильное реше́ние'], falseFriends: null, aspectPair: null },
    { word: 'возмо́жность', gender: 'ж', category: 'abstract', definition: 'opportunity / possibility',
      exampleSentence: 'У меня́ есть возмо́жность пое́хать в Росси́ю.', collocations: ['дать возмо́жность', 'упусти́ть возмо́жность'], falseFriends: null, aspectPair: null },
    { word: 'опыт', gender: 'м', category: 'work', definition: 'experience',
      exampleSentence: 'У меня́ большо́й о́пыт рабо́ты.', collocations: ['о́пыт рабо́ты', 'жи́зненный о́пыт', 'без о́пыта'], falseFriends: null, aspectPair: null },
    // Aspect pairs
    { word: 'чита́ть / прочита́ть', gender: null, category: 'aspect-pairs', definition: 'to read (impf./pf.)',
      exampleSentence: 'Я чита́л ка́ждый день. / Я прочита́л всю кни́гу.', collocations: ['чита́ть кни́гу', 'прочита́ть статью́'], falseFriends: null, aspectPair: 'чита́ть (impf.) / прочита́ть (pf.)' },
    { word: 'писа́ть / написа́ть', gender: null, category: 'aspect-pairs', definition: 'to write (impf./pf.)',
      exampleSentence: 'Он пи́шет пи́сьма ка́ждую неде́лю. / Она́ написа́ла рома́н.', collocations: ['писа́ть письмо́', 'написа́ть сочине́ние'], falseFriends: null, aspectPair: 'писа́ть (impf.) / написа́ть (pf.)' },
    { word: 'де́лать / сде́лать', gender: null, category: 'aspect-pairs', definition: 'to do / make (impf./pf.)',
      exampleSentence: 'Что ты де́лаешь? / Я сде́лал дома́шнее зада́ние.', collocations: ['де́лать заря́дку', 'сде́лать оши́бку', 'де́лать уро́ки'], falseFriends: null, aspectPair: 'де́лать (impf.) / сде́лать (pf.)' },
    { word: 'говори́ть / сказа́ть', gender: null, category: 'aspect-pairs', definition: 'to speak, say (impf./pf.)',
      exampleSentence: 'Он хорошо́ говори́т по-ру́сски. / Она́ сказа́ла «да».', collocations: ['говори́ть пра́вду', 'сказа́ть сло́во'], falseFriends: null, aspectPair: 'говори́ть (impf.) / сказа́ть (pf.)' },
    { word: 'откры́вать / откры́ть', gender: null, category: 'aspect-pairs', definition: 'to open (impf./pf.)',
      exampleSentence: 'Магази́н открыва́ется в де́вять. / Он откры́л дверь.', collocations: ['откры́ть окно́', 'открыва́ть счёт'], falseFriends: null, aspectPair: 'откры́вать (impf.) / откры́ть (pf.)' },
    // Work
    { word: 'сотру́дник', gender: 'м', category: 'work', definition: 'colleague / employee',
      exampleSentence: 'Мой сотру́дник — о́чень отве́тственный челове́к.', collocations: ['сотру́дник компа́нии', 'но́вый сотру́дник'], falseFriends: null, aspectPair: null },
    { word: 'зарпла́та', gender: 'ж', category: 'work', definition: 'salary',
      exampleSentence: 'Зарпла́та прихо́дит два ра́за в ме́сяц.', collocations: ['высо́кая зарпла́та', 'получа́ть зарпла́ту'], falseFriends: null, aspectPair: null },
    // Emotions
    { word: 'ра́дость', gender: 'ж', category: 'emotions', definition: 'joy',
      exampleSentence: 'Кака́я ра́дость — вас ви́деть!', collocations: ['с ра́достью', 'ра́дость жи́зни'], falseFriends: null, aspectPair: null },
    { word: 'грусть', gender: 'ж', category: 'emotions', definition: 'sadness',
      exampleSentence: 'Грусть прошла́ быстро.', collocations: ['гру́стный', 'грусти́ть'], falseFriends: null, aspectPair: null },
    // Education
    { word: 'университе́т', gender: 'м', category: 'education', definition: 'university',
      exampleSentence: 'Он учится в университе́те.', collocations: ['поступи́ть в университе́т', 'зако́нчить университе́т'], falseFriends: null, aspectPair: null },
    { word: 'экза́мен', gender: 'м', category: 'education', definition: 'exam',
      exampleSentence: 'За́втра у меня́ экза́мен по ру́сскому языку́.', collocations: ['сдать экза́мен', 'провали́ть экза́мен', 'гото́виться к экза́мену'], falseFriends: null, aspectPair: null },
    // Media
    { word: 'но́вости', gender: null, category: 'media', definition: 'news (pl.)',
      exampleSentence: 'Ты слы́шал после́дние но́вости?', collocations: ['смотре́ть но́вости', 'после́дние но́вости'], falseFriends: null, aspectPair: null },
    { word: 'фами́лия', gender: 'ж', category: 'personal-data', definition: 'surname / last name',
      exampleSentence: 'Как ва́ша фами́лия?', collocations: ['и́мя и фами́лия', 'деви́чья фами́лия'], falseFriends: { en: 'family = семья́ (not фами́лия!)' }, aspectPair: null },
    { word: 'актуа́льный', gender: null, category: 'false-friends', definition: 'current / relevant (NOT actual)',
      exampleSentence: 'Э́то о́чень актуа́льная пробле́ма.', collocations: ['актуа́льный вопро́с', 'актуа́льная те́ма'], falseFriends: { en: 'actual = действи́тельный, настоя́щий' }, aspectPair: null },
  ],

  B2: [
    { word: 'влия́ние', gender: 'с', category: 'abstract', definition: 'influence / impact',
      exampleSentence: 'Кли́мат ока́зывает влия́ние на здоро́вье.', collocations: ['ока́зывать влия́ние', 'под влия́нием'], falseFriends: null, aspectPair: null },
    { word: 'иссле́дование', gender: 'с', category: 'academic', definition: 'research / study',
      exampleSentence: 'Иссле́дование показа́ло интере́сные результа́ты.', collocations: ['провести́ иссле́дование', 'нау́чное иссле́дование'], falseFriends: null, aspectPair: null },
    { word: 'разви́тие', gender: 'с', category: 'abstract', definition: 'development',
      exampleSentence: 'Разви́тие техноло́гий меня́ет наш мир.', collocations: ['экономи́ческое разви́тие', 'в проце́ссе разви́тия'], falseFriends: null, aspectPair: null },
    { word: 'обеспе́чивать / обеспе́чить', gender: null, category: 'formal-verbs', definition: 'to ensure / provide (impf./pf.)',
      exampleSentence: 'Мы обеспе́чиваем ка́чество проду́кции.', collocations: ['обеспе́чить безопа́сность', 'обеспе́чивать усло́вия'], falseFriends: null, aspectPair: 'обеспе́чивать (impf.) / обеспе́чить (pf.)' },
    { word: 'предполага́ть / предположи́ть', gender: null, category: 'formal-verbs', definition: 'to suppose / assume (impf./pf.)',
      exampleSentence: 'Мо́жно предположи́ть, что результа́ты бу́дут положи́тельными.', collocations: ['предполага́ть возмо́жность', 'предположи́ть что'], falseFriends: null, aspectPair: 'предполага́ть (impf.) / предположи́ть (pf.)' },
    { word: 'явля́ться', gender: null, category: 'formal-verbs', definition: 'to be / constitute (formal synonym of быть)',
      exampleSentence: 'Москва́ явля́ется столи́цей Росси́и.', collocations: ['явля́ться при́чиной', 'явля́ться ча́стью'], falseFriends: null, aspectPair: null },
    { word: 'сре́дство', gender: 'с', category: 'abstract', definition: 'means / remedy / funds',
      exampleSentence: 'Образова́ние — сре́дство для дости́жения успе́ха.', collocations: ['сре́дства ма́ссовой информа́ции', 'лека́рственное сре́дство', 'дене́жные сре́дства'], falseFriends: null, aspectPair: null },
    { word: 'о́бщество', gender: 'с', category: 'society', definition: 'society',
      exampleSentence: 'Совреме́нное о́бщество быстро меня́ется.', collocations: ['гражда́нское о́бщество', 'член о́бщества'], falseFriends: null, aspectPair: null },
    { word: 'значи́тельный', gender: null, category: 'adjectives', definition: 'significant / considerable',
      exampleSentence: 'Он сде́лал значи́тельный вклад в нау́ку.', collocations: ['значи́тельная часть', 'значи́тельно бо́льше'], falseFriends: null, aspectPair: null },
    { word: 'существе́нный', gender: null, category: 'adjectives', definition: 'essential / substantial',
      exampleSentence: 'Э́то существе́нный вопро́с для нас.', collocations: ['существе́нное разли́чие', 'существе́нная по́мощь'], falseFriends: null, aspectPair: null },
    { word: 'симпати́чный', gender: null, category: 'false-friends', definition: 'likeable / attractive (NOT sympathetic)',
      exampleSentence: 'Он о́чень симпати́чный молодо́й челове́к.', collocations: ['симпати́чная де́вушка'], falseFriends: { en: 'sympathetic = сочу́вствующий' }, aspectPair: null },
    { word: 'коне́чно', gender: null, category: 'discourse', definition: 'of course',
      exampleSentence: 'Коне́чно, я помогу́ тебе́!', collocations: ['коне́чно же', 'коне́чно, нет'], falseFriends: null, aspectPair: null },
    { word: 'одна́ко', gender: null, category: 'discourse', definition: 'however',
      exampleSentence: 'Одна́ко э́то не так про́сто.', collocations: ['одна́ко', 'одна́ко же'], falseFriends: null, aspectPair: null },
    { word: 'впроче́м', gender: null, category: 'discourse', definition: 'however / though / then again',
      exampleSentence: 'Впроче́м, э́то не ва́жно.', collocations: ['а впроче́м'], falseFriends: null, aspectPair: null },
    { word: 'таки́м о́бразом', gender: null, category: 'discourse', definition: 'thus / in this way',
      exampleSentence: 'Таки́м о́бразом, мы мо́жем сде́лать вы́вод...', collocations: ['таки́м о́бразом'], falseFriends: null, aspectPair: null },
    { word: 'аккура́тный', gender: null, category: 'false-friends', definition: 'neat / tidy (NOT accurate)',
      exampleSentence: 'У неё о́чень аккура́тный по́черк.', collocations: ['аккура́тный челове́к', 'аккура́тно'], falseFriends: { en: 'accurate = то́чный' }, aspectPair: null },
    { word: 'ко́нтроль', gender: 'м', category: 'false-friends', definition: 'supervision / check (NOT control)',
      exampleSentence: 'Контро́ль ка́чества — ва́жная проце́сс.', collocations: ['контро́ль ка́чества', 'под контро́лем'], falseFriends: { en: 'control = управле́ние' }, aspectPair: null },
    { word: 'откла́дывать / отложи́ть', gender: null, category: 'formal-verbs', definition: 'to postpone / put off (impf./pf.)',
      exampleSentence: 'Не откла́дывай на за́втра то, что мо́жно сде́лать сего́дня.', collocations: ['отложи́ть встре́чу', 'откла́дывать де́ньги'], falseFriends: null, aspectPair: 'откла́дывать (impf.) / отложи́ть (pf.)' },
    { word: 'нарушать / наруши́ть', gender: null, category: 'formal-verbs', definition: 'to violate / break (impf./pf.)',
      exampleSentence: 'Он наруши́л пра́вила.', collocations: ['наруши́ть зако́н', 'наруша́ть поря́док'], falseFriends: null, aspectPair: 'наруша́ть (impf.) / наруши́ть (pf.)' },
    { word: 'вме́сте с тем', gender: null, category: 'discourse', definition: 'at the same time / nevertheless',
      exampleSentence: 'Вме́сте с тем, ну́жно учи́тывать и други́е фа́кторы.', collocations: ['вме́сте с тем'], falseFriends: null, aspectPair: null },
  ],

  C1: [
    { word: 'целесообра́зность', gender: 'ж', category: 'academic', definition: 'expediency / advisability',
      exampleSentence: 'Целесообра́зность э́той рефо́рмы вызыва́ет сомне́ния.', collocations: ['целесообра́зность реше́ния'], falseFriends: null, aspectPair: null },
    { word: 'представля́ется', gender: null, category: 'hedging', definition: 'it appears / it seems (academic)',
      exampleSentence: 'Представля́ется возмо́жным утвержда́ть...', collocations: ['представля́ется целесообра́зным', 'представля́ется необходи́мым'], falseFriends: null, aspectPair: null },
    { word: 'в рáмках', gender: null, category: 'academic', definition: 'within the framework of',
      exampleSentence: 'В ра́мках да́нного иссле́дования...', collocations: ['в ра́мках зако́на', 'в ра́мках прое́кта'], falseFriends: null, aspectPair: null },
    { word: 'осуществля́ть / осуществи́ть', gender: null, category: 'formal-verbs', definition: 'to implement / carry out (impf./pf.)',
      exampleSentence: 'Компа́ния осуществля́ет поста́вки в де́сять стран.', collocations: ['осуществи́ть план', 'осуществля́ть контро́ль'], falseFriends: null, aspectPair: 'осуществля́ть (impf.) / осуществи́ть (pf.)' },
    { word: 'обусло́вленный', gender: null, category: 'academic', definition: 'conditioned by / caused by',
      exampleSentence: 'Рост цен обусло́влен инфля́цией.', collocations: ['обусло́вленный причи́нами', 'обусло́влен факто́рами'], falseFriends: null, aspectPair: null },
    { word: 'вышеизло́женный', gender: null, category: 'bureaucratic', definition: 'above-mentioned / aforesaid',
      exampleSentence: 'На основа́нии вышеизло́женного прошу́...', collocations: ['на основа́нии вышеизло́женного'], falseFriends: null, aspectPair: null },
    { word: 'подразумева́ть', gender: null, category: 'academic', definition: 'to imply / presuppose',
      exampleSentence: 'Э́то подразумева́ет изме́нение подхо́да.', collocations: ['подразумева́ть что', 'что подразумева́ется'], falseFriends: null, aspectPair: null },
    { word: 'свиде́тельствовать', gender: null, category: 'academic', definition: 'to testify / indicate',
      exampleSentence: 'Да́нные свиде́тельствуют о ро́сте.', collocations: ['свиде́тельствовать о', 'что свиде́тельствует'], falseFriends: null, aspectPair: null },
    { word: 'тем не ме́нее', gender: null, category: 'discourse', definition: 'nevertheless',
      exampleSentence: 'Тем не ме́нее, результа́ты оказа́лись положи́тельными.', collocations: ['тем не ме́нее'], falseFriends: null, aspectPair: null },
    { word: 'сле́довательно', gender: null, category: 'discourse', definition: 'consequently / therefore',
      exampleSentence: 'Сле́довательно, мо́жно сде́лать вы́вод...', collocations: ['сле́довательно'], falseFriends: null, aspectPair: null },
    { word: 'предпринима́тель', gender: 'м', category: 'business', definition: 'entrepreneur',
      exampleSentence: 'Успе́шный предпринима́тель до́лжен уме́ть рискова́ть.', collocations: ['ча́стный предпринима́тель', 'ма́лый предпринима́тель', 'предпринима́тель года́'], falseFriends: null, aspectPair: null },
    { word: 'обстоя́тельство', gender: 'с', category: 'abstract', definition: 'circumstance',
      exampleSentence: 'При да́нных обстоя́тельствах э́то лу́чшее реше́ние.', collocations: ['стече́ние обстоя́тельств', 'при обстоя́тельствах', 'смягча́ющее обстоя́тельство'], falseFriends: null, aspectPair: null },
    { word: 'достове́рный', gender: null, category: 'quality', definition: 'reliable / authentic',
      exampleSentence: 'Нам ну́жны достове́рные да́нные для ана́лиза.', collocations: ['достове́рная информа́ция', 'достове́рный исто́чник', 'достове́рные фа́кты'], falseFriends: null, aspectPair: null },
    { word: 'правоме́рность', gender: 'ж', category: 'legal', definition: 'legitimacy',
      exampleSentence: 'Правоме́рность э́того реше́ния мо́жно оспо́рить в суде́.', collocations: ['правоме́рность де́йствий', 'правоме́рность реше́ния', 'подтверди́ть правоме́рность'], falseFriends: null, aspectPair: null },
    { word: 'содержа́тельный', gender: null, category: 'quality', definition: 'substantive / meaningful',
      exampleSentence: 'Докла́д был о́чень содержа́тельным и интере́сным.', collocations: ['содержа́тельный разгово́р', 'содержа́тельная статья́', 'содержа́тельный отве́т'], falseFriends: null, aspectPair: null },
    { word: 'неоднозна́чный', gender: null, category: 'quality', definition: 'ambiguous',
      exampleSentence: 'Результа́ты иссле́дования оказа́лись неоднозна́чными.', collocations: ['неоднозна́чная ситуа́ция', 'неоднозна́чный отве́т', 'неоднозна́чная оце́нка'], falseFriends: null, aspectPair: null },
    { word: 'взаимоде́йствие', gender: 'с', category: 'abstract', definition: 'interaction',
      exampleSentence: 'Взаимоде́йствие ме́жду отде́лами ну́жно улу́чшить.', collocations: ['взаимоде́йствие с', 'тесно́е взаимоде́йствие', 'межкульту́рное взаимоде́йствие'], falseFriends: null, aspectPair: null },
    { word: 'обоснова́ние', gender: 'с', category: 'abstract', definition: 'justification',
      exampleSentence: 'Необходи́мо предста́вить обоснова́ние для э́того прое́кта.', collocations: ['нау́чное обоснова́ние', 'обоснова́ние реше́ния', 'без обоснова́ния'], falseFriends: null, aspectPair: null },
    { word: 'целесообра́зный', gender: null, category: 'quality', definition: 'expedient / advisable',
      exampleSentence: 'Счита́ем целесообра́зным продо́лжить рабо́ту над прое́ктом.', collocations: ['целесообра́зное реше́ние', 'экономи́чески целесообра́зный', 'целесообра́зный подхо́д'], falseFriends: null, aspectPair: null },
    { word: 'совоку́пность', gender: 'ж', category: 'abstract', definition: 'aggregate / totality',
      exampleSentence: 'Совоку́пность э́тих фа́кторов определя́ет результа́т.', collocations: ['в совоку́пности', 'совоку́пность фа́кторов', 'совоку́пность да́нных'], falseFriends: null, aspectPair: null },
  ],

  C2: [
    { word: 'канцеляри́т', gender: 'м', category: 'stylistic', definition: 'bureaucratese (pejorative term for bureaucratic language)',
      exampleSentence: 'Писа́тель высмеива́л канцеляри́т в свои́х расска́зах.', collocations: ['страда́ть канцеляри́том'], falseFriends: null, aspectPair: null },
    { word: 'просторе́чие', gender: 'с', category: 'stylistic', definition: 'substandard speech / vernacular',
      exampleSentence: 'Сло́во «ло́жить» — просторе́чие.', collocations: ['просторе́чное выраже́ние'], falseFriends: null, aspectPair: null },
    { word: 'ина́че говоря́', gender: null, category: 'discourse', definition: 'in other words',
      exampleSentence: 'Ина́че говоря́, ситуа́ция измени́лась.', collocations: ['ина́че говоря́', 'и́ли ина́че'], falseFriends: null, aspectPair: null },
    { word: 'ме́жду тем', gender: null, category: 'discourse', definition: 'meanwhile / in the meantime',
      exampleSentence: 'Ме́жду тем, вопро́с остаётся открытым.', collocations: ['ме́жду тем'], falseFriends: null, aspectPair: null },
    { word: 'так ска́зать', gender: null, category: 'discourse', definition: 'so to speak',
      exampleSentence: 'Он, так сказа́ть, специали́ст в э́той о́бласти.', collocations: ['так сказа́ть', 'е́сли мо́жно так сказа́ть'], falseFriends: null, aspectPair: null },
    { word: 'паради́гма', gender: 'ж', category: 'academic', definition: 'paradigm',
      exampleSentence: 'Но́вая нау́чная паради́гма измени́ла наш по́дход к иссле́дованиям.', collocations: ['сме́на паради́гмы', 'нау́чная паради́гма', 'паради́гма мышле́ния'], falseFriends: null, aspectPair: null },
    { word: 'неотъе́млемый', gender: null, category: 'quality', definition: 'inalienable',
      exampleSentence: 'Свобо́да сло́ва — неотъе́млемое пра́во ка́ждого гражда́нина.', collocations: ['неотъе́млемая часть', 'неотъе́млемое пра́во', 'неотъе́млемый элеме́нт'], falseFriends: null, aspectPair: null },
    { word: 'аутенти́чный', gender: null, category: 'quality', definition: 'authentic',
      exampleSentence: 'Рестора́н предлага́ет аутенти́чную ита́льянскую ку́хню.', collocations: ['аутенти́чный текст', 'аутенти́чный исто́чник', 'аутенти́чное исполне́ние'], falseFriends: null, aspectPair: null },
    { word: 'интроспе́кция', gender: 'ж', category: 'psychology', definition: 'introspection',
      exampleSentence: 'Интроспе́кция помога́ет лу́чше поня́ть свои́ мотива́ции.', collocations: ['ме́тод интроспе́кции', 'глубо́кая интроспе́кция', 'интроспе́кция созна́ния'], falseFriends: null, aspectPair: null },
    { word: 'амбивале́нтность', gender: 'ж', category: 'psychology', definition: 'ambivalence',
      exampleSentence: 'Амбивале́нтность его́ чувств не позволя́ла приня́ть реше́ние.', collocations: ['эмоциона́льная амбивале́нтность', 'амбивале́нтность отноше́ния', 'амбивале́нтность чувств'], falseFriends: null, aspectPair: null },
    { word: 'дискурси́вный', gender: null, category: 'academic', definition: 'discursive',
      exampleSentence: 'Дискурси́вный ана́лиз выя́вил скры́тые стру́ктуры вла́сти.', collocations: ['дискурси́вный ана́лиз', 'дискурси́вная пра́ктика', 'дискурси́вное простра́нство'], falseFriends: null, aspectPair: null },
    { word: 'апелли́ровать', gender: null, category: 'legal', definition: 'to appeal',
      exampleSentence: 'Адвока́т реши́л апелли́ровать к вы́сшей инста́нции.', collocations: ['апелли́ровать к суду́', 'апелли́ровать к фа́ктам', 'апелли́ровать к ра́зуму'], falseFriends: null, aspectPair: null },
    { word: 'когнити́вный', gender: null, category: 'academic', definition: 'cognitive',
      exampleSentence: 'Когнити́вные спосо́бности разви́ваются в тече́ние всей жи́зни.', collocations: ['когнити́вная психоло́гия', 'когнити́вные фу́нкции', 'когнити́вный диссона́нс'], falseFriends: null, aspectPair: null },
    { word: 'трансценде́нтный', gender: null, category: 'philosophy', definition: 'transcendent',
      exampleSentence: 'Кант разделя́л трансценде́нтное и трансцендента́льное позна́ние.', collocations: ['трансценде́нтный мир', 'трансценде́нтное бытие́', 'трансценде́нтный о́пыт'], falseFriends: null, aspectPair: null },
    { word: 'рефлекси́вный', gender: null, category: 'academic', definition: 'reflexive',
      exampleSentence: 'Рефлекси́вный по́дход тре́бует постоя́нного самоана́лиза.', collocations: ['рефлекси́вный ана́лиз', 'рефлекси́вное мышле́ние', 'рефлекси́вная пра́ктика'], falseFriends: null, aspectPair: null },
    { word: 'детермини́зм', gender: 'м', category: 'philosophy', definition: 'determinism',
      exampleSentence: 'Детермини́зм утвержда́ет, что все собы́тия причи́нно обусло́влены.', collocations: ['нау́чный детермини́зм', 'биологи́ческий детермини́зм', 'лингвисти́ческий детермини́зм'], falseFriends: null, aspectPair: null },
    { word: 'пертурба́ция', gender: 'ж', category: 'science', definition: 'perturbation',
      exampleSentence: 'Пертурба́ции в о́рбите плане́ты вы́званы гравита́цией сосе́дних тел.', collocations: ['гравитацио́нная пертурба́ция', 'пертурба́ция о́рбиты', 'пертурба́ция систе́мы'], falseFriends: null, aspectPair: null },
    { word: 'метакогни́ция', gender: 'ж', category: 'psychology', definition: 'metacognition',
      exampleSentence: 'Метакогни́ция позволя́ет челове́ку оце́нивать со́бственные мысли́тельные проце́ссы.', collocations: ['разви́тие метакогни́ции', 'стра́тегии метакогни́ции', 'метакогни́ция в обуче́нии'], falseFriends: null, aspectPair: null },
    { word: 'эпистемоло́гия', gender: 'ж', category: 'philosophy', definition: 'epistemology',
      exampleSentence: 'Эпистемоло́гия изуча́ет приро́ду и грани́цы челове́ческого позна́ния.', collocations: ['социа́льная эпистемоло́гия', 'вопро́сы эпистемоло́гии', 'эпистемоло́гия нау́ки'], falseFriends: null, aspectPair: null },
    { word: 'герменевти́ка', gender: 'ж', category: 'philosophy', definition: 'hermeneutics',
      exampleSentence: 'Герменевти́ка как нау́ка о толкова́нии те́кстов возникла ещё в анти́чности.', collocations: ['филосо́фская герменевти́ка', 'герменевти́ка те́кста', 'ме́тоды герменевти́ки'], falseFriends: null, aspectPair: null },
  ],
};

// ─── Exercise types ─────────────────────────────────────────────────────────

const EXERCISE_TYPES = ['definition', 'fill-in-blank', 'matching', 'context-guess', 'collocation'];

function makeDefinitionExercise(targetWord, level) {
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const distractors = core.pick(bank.filter(w => w.word !== targetWord.word), 3).map(w => w.definition);
  const options = core.shuffle([targetWord.definition, ...distractors]);
  return {
    type: 'definition',
    prompt: `Что означает "${targetWord.word}"?`,
    options,
    answer: targetWord.definition,
    word: targetWord.word,
  };
}

function makeFillInBlankExercise(targetWord) {
  const sentence = targetWord.exampleSentence.replace(
    new RegExp(targetWord.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').split('/')[0].trim(), 'i'), '___'
  );
  return {
    type: 'fill-in-blank',
    prompt: 'Fill in the blank:',
    sentence,
    answer: targetWord.word.split('/')[0].trim(),
    word: targetWord.word,
    hint: targetWord.definition,
  };
}

function makeMatchingExercise(level) {
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const items = core.pick(bank, 5);
  return {
    type: 'matching',
    prompt: 'Match each word to its definition.',
    pairs: items.map(w => ({ word: w.word, definition: w.definition })),
    words: items.map(w => w.word),
    shuffledDefinitions: core.shuffle(items.map(w => w.definition)),
  };
}

function makeContextGuessExercise(targetWord) {
  return {
    type: 'context-guess',
    prompt: `Read the sentence and guess the meaning:\n"${targetWord.exampleSentence}"`,
    targetWord: targetWord.word,
    answer: targetWord.definition,
    word: targetWord.word,
  };
}

function makeCollocationExercise(targetWord, level) {
  if (!targetWord.collocations || !targetWord.collocations.length) {
    return makeDefinitionExercise(targetWord, level);
  }
  const correct = core.pick(targetWord.collocations, 1)[0];
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const distractors = core.pick(
    bank.filter(w => w.collocations && w.collocations.length && w.word !== targetWord.word),
    3
  ).map(w => w.collocations[0]);
  const options = core.shuffle([correct, ...distractors]);
  return {
    type: 'collocation',
    prompt: `Which is a natural collocation with "${targetWord.word}"?`,
    options,
    answer: correct,
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
      message: correctCount === exercise.pairs.length ? 'Отли́чно!' : `${correctCount}/${exercise.pairs.length} correct.`,
    };
  }

  const expected = normalise(exercise.answer);
  const given = normalise(userAnswer);

  if (given === expected) {
    return { correct: true, message: 'Пра́вильно! Мо́лодец.' };
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
        falseFriends: w.falseFriends,
        aspectPair: w.aspectPair,
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
      return { [lvl]: (WORD_BANKS[lvl] || []).map(w => ({ word: w.word, gender: w.gender, definition: w.definition, category: w.category })) };
    }
    const catalog = {};
    for (const l of core.CEFR) {
      if (WORD_BANKS[l]) {
        catalog[l] = WORD_BANKS[l].map(w => ({ word: w.word, gender: w.gender, definition: w.definition, category: w.category }));
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
