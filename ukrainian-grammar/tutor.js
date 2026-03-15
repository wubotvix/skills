#!/usr/bin/env node
// Ukrainian Grammar Tutor — discovery-based grammar teaching with FSRS spaced repetition
'use strict';

const core = require('../_lib/core');
const { CEFR, MASTERY_THRESHOLD, DEFAULT_RETENTION,
        dataDir, loadProfile, saveProfile, listProfiles,
        calcMastery, masteryLabel,
        fsrsRetention, fsrsNextReview, fsrsUpdateStability, fsrsUpdateDifficulty,
        shuffle, pick, norm, today, runCLI } = core;

const SKILL_NAME = 'ukrainian-grammar';

// ─── Embedded Grammar Data ──────────────────────────────────────────────────

const TOPICS = [
  // ── A1 ──
  { id: 'gender-basic', name: 'Gender identification (ч/ж/с)', level: 'A1', category: 'nouns',
    scoba: `How to identify grammatical gender:
  → Ends in consonant or -о? → Usually MASCULINE (ч): студент, стіл, батько
  → Ends in -а/-я? → Usually FEMININE (ж): книга, земля, мама
  → Ends in -о/-е? → Usually NEUTER (с): місто, море, серце
  EXCEPTIONS: батько (masc. despite -о), words ending in -ь can be masc. or fem.`,
    exercises: [
      { type: 'fill', prompt: 'Це нов___ (ий/а/е) студент.', answer: 'ий', hint: 'студент = masculine → новий' },
      { type: 'fill', prompt: 'Це гарн___ (ий/а/е) книга.', answer: 'а', hint: 'книга = feminine → гарна' },
      { type: 'fill', prompt: 'Це велик___ (ий/а/е) місто.', answer: 'е', hint: 'місто = neuter → велике' },
      { type: 'error', prompt: 'Це новий книга.', answer: 'Це нова книга.', hint: 'книга is feminine → нова' },
    ] },
  { id: 'present-conj1', name: 'Present tense: 1st conjugation (-ати)', level: 'A1', category: 'verbs',
    scoba: `1st conjugation (-ати verbs like читати):
  я читаю, ти читаєш, він/вона читає
  ми читаємо, ви читаєте, вони читають`,
    exercises: [
      { type: 'fill', prompt: 'Я ___ (читати) книгу.', answer: 'читаю', hint: 'я → -ю' },
      { type: 'fill', prompt: 'Вони ___ (працювати) в офісі.', answer: 'працюють', hint: 'вони → -ють' },
      { type: 'fill', prompt: 'Ти ___ (знати) українську?', answer: 'знаєш', hint: 'ти → -єш' },
      { type: 'error', prompt: 'Ми читає книгу.', answer: 'Ми читаємо книгу.', hint: 'ми → -ємо' },
    ] },
  { id: 'present-conj2', name: 'Present tense: 2nd conjugation (-ити)', level: 'A1', category: 'verbs',
    scoba: `2nd conjugation (-ити verbs like говорити):
  я говорю, ти говориш, він/вона говорить
  ми говоримо, ви говорите, вони говорять`,
    exercises: [
      { type: 'fill', prompt: 'Я ___ (говорити) українською.', answer: 'говорю', hint: 'я → -ю (with consonant change)' },
      { type: 'fill', prompt: 'Вона ___ (любити) каву.', answer: 'любить', hint: 'він/вона → -ить' },
      { type: 'fill', prompt: 'Ми ___ (ходити) до школи.', answer: 'ходимо', hint: 'ми → -имо' },
      { type: 'error', prompt: 'Вони говорить українською.', answer: 'Вони говорять українською.', hint: 'вони → -ять' },
    ] },
  { id: 'nom-acc', name: 'Nominative & Accusative cases', level: 'A1', category: 'cases',
    scoba: `What role does the noun play?
  → Subject of the sentence? → NOMINATIVE (Називний)
    "Студент читає книгу."
  → Direct object? → ACCUSATIVE (Знахідний)
    "Я бачу студента." (animate masc. = genitive form)
    "Я читаю книгу." (feminine -а → -у)
    "Я бачу місто." (neuter = nominative form)`,
    exercises: [
      { type: 'fill', prompt: 'Я бачу ___ (мама).', answer: 'маму', hint: 'fem. -а → -у in accusative' },
      { type: 'fill', prompt: 'Він знає ___ (студент).', answer: 'студента', hint: 'animate masc. → genitive form in acc.' },
      { type: 'fill', prompt: 'Ми бачимо ___ (місто).', answer: 'місто', hint: 'neuter accusative = nominative' },
      { type: 'error', prompt: 'Я читаю книга.', answer: 'Я читаю книгу.', hint: 'книга (fem.) → книгу in accusative' },
    ] },
  { id: 'possessives', name: 'Possessive pronouns', level: 'A1', category: 'pronouns',
    scoba: `Possessives agree in gender/number with the OWNED item:
  мій/моя/моє (my), твій/твоя/твоє (your-informal)
  його (his), її (her), наш/наша/наше (our)
  ваш/ваша/ваше (your-formal/plural), їхній/їхня/їхнє (their)`,
    exercises: [
      { type: 'fill', prompt: '___ (Мій/Моя/Моє) мама працює тут.', answer: 'Моя', hint: 'мама = feminine → моя' },
      { type: 'fill', prompt: 'Де ___ (твій/твоя/твоє) місто?', answer: 'твоє', hint: 'місто = neuter → твоє' },
      { type: 'error', prompt: 'Це мій книга.', answer: 'Це моя книга.', hint: 'книга is feminine → моя' },
    ] },
  { id: 'questions-basic', name: 'Basic questions', level: 'A1', category: 'syntax',
    scoba: `Question words: хто? (who), що? (what), де? (where), коли? (when),
  як? (how), чому? (why), скільки? (how much/many), який? (which/what kind)
  Yes/no questions formed by intonation alone (no word order change).`,
    exercises: [
      { type: 'fill', prompt: '___ ти живеш? — У Києві.', answer: 'Де', hint: 'Asking about location → де' },
      { type: 'fill', prompt: '___ це коштує? — 50 гривень.', answer: 'Скільки', hint: 'Asking about price → скільки' },
      { type: 'fill', prompt: '___ ти не прийшов? — Бо я хворів.', answer: 'Чому', hint: 'Asking about reason → чому' },
    ] },

  // ── A2 ──
  { id: 'past-tense', name: 'Past tense (-в/-ла/-ло/-ли)', level: 'A2', category: 'verbs',
    scoba: `Past tense is formed from the infinitive stem + gender endings:
  Masculine: -в (він читав)
  Feminine: -ла (вона читала)
  Neuter: -ло (воно читало)
  Plural: -ли (вони читали)
  NOTE: Ukrainian uses -в (not Russian -л)!`,
    exercises: [
      { type: 'fill', prompt: 'Вчора він ___ (читати) книгу.', answer: 'читав', hint: 'masculine → -в' },
      { type: 'fill', prompt: 'Вона ___ (працювати) весь день.', answer: 'працювала', hint: 'feminine → -ла' },
      { type: 'error', prompt: 'Вони читав книгу.', answer: 'Вони читали книгу.', hint: 'plural → -ли' },
      { type: 'transform', prompt: 'Rewrite in past (fem.): "Я іду додому."', answer: 'Я ішла додому.', hint: 'іти → ішла (feminine past)' },
    ] },
  { id: 'genitive', name: 'Genitive case (Родовий)', level: 'A2', category: 'cases',
    scoba: `Genitive answers когó? чогó? Used for:
  → Possession: книга студента (student's book)
  → Absence: немає студента (there is no student)
  → Quantity: багато студентів (many students)
  → After prepositions: з, від, до, без, для, після, біля`,
    exercises: [
      { type: 'fill', prompt: 'У мене немає ___ (книга).', answer: 'книги', hint: 'fem. -а → -и in genitive' },
      { type: 'fill', prompt: 'Я іду до ___ (магазин).', answer: 'магазину', hint: 'до + genitive; masc. → -у' },
      { type: 'error', prompt: 'Це книга Олена.', answer: 'Це книга Олени.', hint: 'possession → genitive: Олена → Олени' },
    ] },
  { id: 'locative', name: 'Locative case (Місцевий)', level: 'A2', category: 'cases',
    scoba: `Locative answers на кому? на чому? Always with preposition (у/в, на):
  → Location: у магазині, на роботі
  Masc. hard: -і (or -ові): у магазині / у магазинові
  Fem. -а: -і (with consonant mutation г→з, к→ц, х→с): книга → у книзі
  Neuter -о: -і: місто → у місті`,
    exercises: [
      { type: 'fill', prompt: 'Я живу в ___ (Київ).', answer: 'Києві', hint: 'masculine → -і in locative' },
      { type: 'fill', prompt: 'Вона працює на ___ (робота).', answer: 'роботі', hint: 'feminine -а → -і' },
      { type: 'error', prompt: 'Він у магазин.', answer: 'Він у магазині.', hint: 'location needs locative case' },
    ] },
  { id: 'dative', name: 'Dative case (Давальний)', level: 'A2', category: 'cases',
    scoba: `Dative answers кому? чому? Used for:
  → Indirect object: Я дав книгу студентові/студенту.
  → With verbs: подобатися, допомагати, дзвонити
  Masc: -у or -ові (both correct, -ові more Ukrainian)
  Fem -а: -і: мама → мамі`,
    exercises: [
      { type: 'fill', prompt: 'Я дав книгу ___ (друг).', answer: 'другові', hint: 'masc. dative → -ові (or другу)' },
      { type: 'fill', prompt: 'Мені ___ (подобатися) ця книга.', answer: 'подобається', hint: 'мені + подобається' },
      { type: 'error', prompt: 'Я допомагаю мама.', answer: 'Я допомагаю мамі.', hint: 'допомагати + dative: мама → мамі' },
    ] },
  { id: 'vocative-basic', name: 'Vocative case (basic)', level: 'A2', category: 'cases',
    scoba: `Vocative (Кличний) is used for DIRECT ADDRESS — uniquely Ukrainian!
  Fem. -а → -о: мама → мамо!, Олена → Олено!
  Masc. hard → -е (with mutation г→ж, к→ч, х→ш): друг → друже!
  Masc. soft → -ю: учитель → учителю!
  Masc. -ко → -ку: батько → батьку!`,
    exercises: [
      { type: 'fill', prompt: '___ (Олена), ходи сюди!', answer: 'Олено', hint: 'fem. -а → -о in vocative' },
      { type: 'fill', prompt: '___ (друг), послухай!', answer: 'Друже', hint: 'друг → друже (г→ж mutation)' },
      { type: 'error', prompt: 'Привіт, Іван!', answer: 'Привіт, Іване!', hint: 'Direct address needs vocative: Іван → Іване' },
      { type: 'transform', prompt: 'Put into vocative: "пан директор"', answer: 'Пане директоре!', hint: 'Both words take vocative' },
    ] },
  { id: 'adjective-agreement', name: 'Adjective agreement', level: 'A2', category: 'nouns',
    scoba: `Adjectives agree with nouns in gender, number, and case:
  Masc: новий студент, Fem: нова книга, Neuter: нове місто
  Plural: нові студенти/книги/міста
  Adjective PRECEDES the noun in Ukrainian.`,
    exercises: [
      { type: 'fill', prompt: 'Це ___ (гарний) дівчина.', answer: 'гарна', hint: 'дівчина = feminine → гарна' },
      { type: 'fill', prompt: '___ (Великий) місто Київ.', answer: 'Велике', hint: 'місто = neuter → велике' },
      { type: 'error', prompt: 'Він купив новий книга.', answer: 'Він купив нову книгу.', hint: 'книга is fem. acc. → нову книгу' },
    ] },
  { id: 'comparative', name: 'Comparative degree', level: 'A2', category: 'adjectives',
    scoba: `Two ways to form comparatives:
  1. Synthetic: -іший/-ша/-ше: новий → новіший, гарний → гарніший
  2. Analytic: більш + adjective: більш цікавий
  Irregular: великий → більший, малий → менший, гарний → кращий, поганий → гірший`,
    exercises: [
      { type: 'fill', prompt: 'Ця книга ___ (цікавий) ніж та.', answer: 'цікавіша', hint: 'fem. comparative → -іша' },
      { type: 'fill', prompt: 'Він ___ (високий) за мене.', answer: 'вищий', hint: 'високий → вищий (irregular)' },
      { type: 'error', prompt: 'Це більш гарний місто.', answer: 'Це гарніше місто.', hint: 'Prefer synthetic: гарний → гарніше (neuter)' },
    ] },

  // ── B1 ──
  { id: 'instrumental', name: 'Instrumental case (Орудний)', level: 'B1', category: 'cases',
    scoba: `Instrumental answers ким? чим? Used for:
  → Instrument: писати олівцем (write with a pencil)
  → With з/із (with): з другом, зі сметаною
  → Predicate: Він є студентом.
  Masc: -ом: студентом, Fem -а: -ою: книгою, Neuter: -ом: містом`,
    exercises: [
      { type: 'fill', prompt: 'Я пишу ___ (ручка).', answer: 'ручкою', hint: 'fem. -а → -ою in instrumental' },
      { type: 'fill', prompt: 'Він працює ___ (вчитель).', answer: 'вчителем', hint: 'masc. soft → -ем' },
      { type: 'error', prompt: 'Борщ зі сметана.', answer: 'Борщ зі сметаною.', hint: 'з/зі + instrumental: сметана → сметаною' },
    ] },
  { id: 'aspect-basic', name: 'Verbal aspect (basic)', level: 'B1', category: 'verbs',
    scoba: `Is the action...
  ├── Repeated/habitual? → IMPERFECTIVE: "Він щодня читає газету."
  ├── Currently in progress? → IMPERFECTIVE: "Вона зараз пише листа."
  ├── Completed action with result? → PERFECTIVE: "Він прочитав книгу."
  ├── Single completed action? → PERFECTIVE: "Він відкрив двері."
  └── Sequential actions? → PERFECTIVE: "Він увійшов, сів і почав читати."`,
    exercises: [
      { type: 'fill', prompt: 'Він щодня ___ (читати/прочитати) газету.', answer: 'читає', hint: 'Habitual → imperfective' },
      { type: 'fill', prompt: 'Вчора він ___ (читати/прочитати) цю книгу.', answer: 'прочитав', hint: 'Completed → perfective' },
      { type: 'error', prompt: 'Він щодня прочитав газету.', answer: 'Він щодня читав газету.', hint: 'Habitual → imperfective' },
    ] },
  { id: 'conditional', name: 'Conditional mood (б/би)', level: 'B1', category: 'verbs',
    scoba: `Conditional = past tense + б/би:
  Я б читав (masc.) / Я б читала (fem.)
  Якби я знав, я б сказав. (If I had known, I would have said.)
  б after vowels, би after consonants.`,
    exercises: [
      { type: 'fill', prompt: 'Якби я ___ (мати) час, я б поїхав.', answer: 'мав', hint: 'якби + past tense' },
      { type: 'fill', prompt: 'Я ___ (хотіти — conditional) поїхати до Львова.', answer: 'хотів би', hint: 'past + б/би' },
      { type: 'error', prompt: 'Якби я знаю, я скажу.', answer: 'Якби я знав, я б сказав.', hint: 'Conditional needs past tense + б/би' },
    ] },
  { id: 'synthetic-future', name: 'Synthetic future (-тиму)', level: 'B1', category: 'verbs',
    scoba: `Three ways to form imperfective future:
  1. Analytic: Я буду читати. (like Russian)
  2. Synthetic (uniquely Ukrainian!): Я читатиму.
     -тиму, -тимеш, -тиме, -тимемо, -тимете, -тимуть
  3. Perfective present = completed future: Я прочитаю.`,
    exercises: [
      { type: 'fill', prompt: 'Я ___ (писати — synthetic future) листа.', answer: 'писатиму', hint: 'infinitive stem + -тиму' },
      { type: 'fill', prompt: 'Вони ___ (працювати — synthetic future) завтра.', answer: 'працюватимуть', hint: 'infinitive stem + -тимуть' },
      { type: 'transform', prompt: 'Rewrite using synthetic future: "Я буду читати книгу."', answer: 'Я читатиму книгу.', hint: 'буду читати → читатиму' },
    ] },
  { id: 'relative-clauses', name: 'Relative clauses (який, що, де)', level: 'B1', category: 'syntax',
    scoba: `який (which) — declines like adjective, agrees with antecedent
  що (that) — indeclinable, for things
  де (where) — for places
  "Книга, яку я читав, цікава." (яку = fem. acc.)`,
    exercises: [
      { type: 'fill', prompt: 'Хлопець, ___ (який) я бачив, мій друг.', answer: 'якого', hint: 'animate masc. acc. = gen. → якого' },
      { type: 'fill', prompt: 'Місто, ___ я народився, дуже гарне.', answer: 'де', hint: 'place → де' },
      { type: 'error', prompt: 'Книга, який я читав, цікава.', answer: 'Книга, яку я читав, цікава.', hint: 'книга is fem. acc. → яку' },
    ] },
  { id: 'motion-verbs', name: 'Verbs of motion (basic)', level: 'B1', category: 'verbs',
    scoba: `Unidirectional vs multidirectional:
  іти (one direction now) vs ходити (habitual/round-trip)
  їхати (one direction by vehicle) vs їздити (habitual)
  "Я іду до магазину." (right now, one direction)
  "Я щодня ходжу до магазину." (every day, habitual)`,
    exercises: [
      { type: 'fill', prompt: 'Зараз я ___ (іти/ходити) до парку.', answer: 'іду', hint: 'Right now, one direction → unidirectional' },
      { type: 'fill', prompt: 'Він щодня ___ (їхати/їздити) на роботу.', answer: 'їздить', hint: 'Habitual → multidirectional' },
      { type: 'error', prompt: 'Я щодня іду до школи.', answer: 'Я щодня ходжу до школи.', hint: 'Habitual → multidirectional: ходити' },
    ] },

  // ── B2 ──
  { id: 'vocative-advanced', name: 'Vocative: all patterns + mutations', level: 'B2', category: 'cases',
    scoba: `Full vocative rules:
  Masc. hard → -е: козак → козаче! (к→ч), пастух → пастуше! (х→ш)
  Masc. -ець → -че: хлопець → хлопче!
  Fem. -я (soft) → -е/-ю: земля → земле!, Наталя → Наталю!
  Both parts of title: пан директор → Пане директоре!
  Name + patronymic: Іван Петрович → Іване Петровичу!`,
    exercises: [
      { type: 'fill', prompt: 'Шановний ___ (Іван Петрович)!', answer: 'Іване Петровичу', hint: 'Both name and patronymic in vocative' },
      { type: 'fill', prompt: '___ (козак), іди сюди!', answer: 'Козаче', hint: 'к→ч mutation in vocative' },
      { type: 'transform', prompt: 'Put into vocative: "Наталя"', answer: 'Наталю!', hint: 'Soft -я → -ю' },
    ] },
  { id: 'pluperfect', name: 'Pluperfect (давноминулий час)', level: 'B2', category: 'verbs',
    scoba: `Ukrainian has a pluperfect (Russian doesn't!):
  був/була/було/були + past tense
  "Коли я прийшов, він уже був пішов." (He had already left.)`,
    exercises: [
      { type: 'fill', prompt: 'Коли ми прийшли, вона вже ___ ___ (піти — pluperfect, fem.).', answer: 'була пішла', hint: 'була + past participle' },
      { type: 'fill', prompt: 'Він ___ ___ (прочитати — pluperfect, masc.) книгу до мого приходу.', answer: 'був прочитав', hint: 'був + past participle' },
    ] },
  { id: 'verbal-adverbs', name: 'Verbal adverbs (дієприслівники)', level: 'B2', category: 'verbs',
    scoba: `Present (impf.): stem + -ючи/-ачи: читаючи (while reading)
  Past (pf.): past stem + -вши: прочитавши (having read)
  "Читаючи книгу, він заснув." (While reading, he fell asleep.)
  "Прочитавши книгу, він заснув." (Having read the book, he fell asleep.)`,
    exercises: [
      { type: 'fill', prompt: '___ (Прочитати — verbal adverb) книгу, він заснув.', answer: 'Прочитавши', hint: 'Completed action before main → perfective verbal adverb' },
      { type: 'fill', prompt: '___ (Іти — verbal adverb) додому, вона зателефонувала.', answer: 'Ідучи', hint: 'Simultaneous action → imperfective verbal adverb' },
    ] },
  { id: 'passive', name: 'Passive constructions', level: 'B2', category: 'syntax',
    scoba: `Ukrainian passive with -ся or бути + passive participle:
  "Книгу написано." (The book has been written — impersonal)
  "Ця книга була написана Шевченком." (This book was written by Shevchenko)
  Note: Impersonal passive with -но/-то is distinctly Ukrainian.`,
    exercises: [
      { type: 'fill', prompt: 'Роботу ___ (зробити — impersonal passive).', answer: 'зроблено', hint: 'Impersonal passive → -но/-то' },
      { type: 'fill', prompt: 'Ця книга була ___ (написати — passive participle) Франком.', answer: 'написана', hint: 'fem. passive participle → -на' },
    ] },
  { id: 'subjunctive', name: 'Subjunctive (щоб + past)', level: 'B2', category: 'syntax',
    scoba: `щоб/щоби + past tense form (for purpose/desire):
  "Я хочу, щоб він прийшов." (I want him to come.)
  "Я прийшов, щоб допомогти." (I came to help.)`,
    exercises: [
      { type: 'fill', prompt: 'Я хочу, щоб ти ___ (прийти).', answer: 'прийшов', hint: 'щоб + past tense form' },
      { type: 'fill', prompt: 'Вона працює, щоб ___ (заробити) гроші.', answer: 'заробити', hint: 'щоб + infinitive (same subject)' },
    ] },

  // ── C1 ──
  { id: 'participial-phrases', name: 'Complex participial phrases', level: 'C1', category: 'syntax',
    scoba: `Active participle: -ючий/-ачий (present), no past active in standard Ukrainian
  Passive participle: -ний/-тий: зроблений (done), написаний (written)
  "Написаний Шевченком вірш відомий у всьому світі."`,
    exercises: [
      { type: 'fill', prompt: 'Книга, ___ (написати — passive participle) Франком, дуже цікава.', answer: 'написана', hint: 'fem. passive participle' },
      { type: 'transform', prompt: 'Rewrite using participle: "Робота, яку зробили вчора, була складною."', answer: 'Зроблена вчора робота була складною.', hint: 'Use passive participle зроблений' },
    ] },
  { id: 'verbal-periphrases', name: 'Verbal periphrases', level: 'C1', category: 'verbs',
    scoba: `Common periphrases:
  мати + infinitive (obligation): Я маю це зробити. (I have to do this.)
  стати + infinitive (begin, formal): Він став працювати.
  бути + infinitive (fate/necessity): Їй бути лікарем.`,
    exercises: [
      { type: 'fill', prompt: 'Він ___ (мати) це зробити до завтра.', answer: 'має', hint: 'мати + inf. for obligation' },
      { type: 'fill', prompt: 'Вона ___ (стати) вивчати українську.', answer: 'стала', hint: 'стати + inf. for beginning' },
    ] },
  { id: 'discourse-markers', name: 'Discourse markers', level: 'C1', category: 'syntax',
    scoba: `Key Ukrainian discourse markers:
  отже (so/therefore), втім (however), тим не менш (nevertheless),
  по-перше (firstly), крім того (moreover), з одного боку (on one hand),
  зрештою (after all), власне (actually), відтак (consequently)`,
    exercises: [
      { type: 'fill', prompt: '___, я вважаю цю ідею цікавою. ___, є певні проблеми.', answer: 'Загалом / Втім', hint: 'Overall... However...' },
    ] },

  // ── C2 ──
  { id: 'register-style', name: 'Register and style distinctions', level: 'C2', category: 'syntax',
    scoba: `Four main registers:
  Розмовний (colloquial): particles, diminutives, ти
  Нейтральний (standard): balanced, no slang
  Науковий/книжний (academic/literary): passive, verbal nouns, complex syntax
  Офіційно-діловий (official): formulaic, канцелярит`,
    exercises: [
      { type: 'transform', prompt: 'Rewrite in official register: "Треба це зробити."', answer: 'Необхідно здійснити зазначені заходи.', hint: 'Official register uses verbal nouns and formulaic phrases' },
    ] },
  { id: 'dialectal-awareness', name: 'Dialectal awareness', level: 'C2', category: 'syntax',
    scoba: `Key dialectal features:
  Western (Galician): Polish/German loanwords, distinctive intonation
  Central (Kyiv): Standard literary norm
  Eastern: More Russian influence, surzhyk patterns
  Recognize but teach standard Ukrainian.`,
    exercises: [
      { type: 'fill', prompt: 'The Western Ukrainian word "файний" means ___ in standard Ukrainian.', answer: 'гарний', hint: 'файний (from German "fein") = гарний' },
    ] },
];

// ─── Tutor Class ────────────────────────────────────────────────────────────

class GrammarTutor {
  constructor() {
    this.dir = dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(id) {
    const p = loadProfile(this.dir, id);
    if (!p.level) p.level = 'A1';
    if (!p.skills) p.skills = {};
    if (!p.assessments) p.assessments = [];
    return p;
  }

  _save(p) { saveProfile(this.dir, p); }

  setLevel(id, level) {
    if (!CEFR.includes(level)) throw new Error('Invalid level: ' + level);
    const p = this.getProfile(id);
    p.level = level;
    this._save(p);
    return { studentId: id, level };
  }

  _topicsForLevel(level) {
    const idx = CEFR.indexOf(level);
    return TOPICS.filter(t => CEFR.indexOf(t.level) <= idx);
  }

  generateLesson(id, topicId) {
    const p = this.getProfile(id);
    let topic;
    if (topicId) {
      topic = TOPICS.find(t => t.id === topicId);
      if (!topic) throw new Error('Unknown topic: ' + topicId);
    } else {
      const available = this._topicsForLevel(p.level);
      const seen = new Set(Object.keys(p.skills));
      let candidates = available.filter(t => !seen.has(t.id));
      if (!candidates.length) candidates = available;
      topic = pick(candidates, 1)[0];
    }

    const exercises = pick(topic.exercises, Math.min(3, topic.exercises.length));

    return {
      studentId: id, level: p.level,
      topic: { id: topic.id, name: topic.name, level: topic.level, category: topic.category },
      scoba: topic.scoba,
      exercises: exercises.map((ex, i) => ({ index: i, ...ex })),
    };
  }

  generateExercise(id, topicId, type) {
    const p = this.getProfile(id);
    const available = this._topicsForLevel(p.level);
    let topic;
    if (topicId) {
      topic = TOPICS.find(t => t.id === topicId);
      if (!topic) throw new Error('Unknown topic: ' + topicId);
    } else {
      topic = pick(available, 1)[0];
    }
    let exercises = topic.exercises;
    if (type) exercises = exercises.filter(e => e.type === type);
    if (!exercises.length) exercises = topic.exercises;
    const ex = pick(exercises, 1)[0];
    return { studentId: id, topicId: topic.id, topicName: topic.name, ...ex };
  }

  checkAnswer(topicId, exerciseIndex, answer) {
    const topic = TOPICS.find(t => t.id === topicId);
    if (!topic) throw new Error('Unknown topic: ' + topicId);
    const ex = topic.exercises[exerciseIndex];
    if (!ex) throw new Error('Exercise not found at index ' + exerciseIndex);
    const correct = norm(answer) === norm(ex.answer);
    return { correct, expected: ex.answer, given: answer, hint: correct ? null : ex.hint };
  }

  recordAssessment(id, topicId, grade) {
    grade = Number(grade);
    if (!isValidGrade(grade, 1, 4)) throw new Error('Grade must be 1-4');
    const p = this.getProfile(id);

    if (!p.skills[topicId]) {
      p.skills[topicId] = { stability: 1, difficulty: 5, lastReview: null, nextReview: null, attempts: [] };
    }
    const sk = p.skills[topicId];
    sk.stability = fsrsUpdateStability(sk.stability, sk.difficulty, grade);
    sk.difficulty = fsrsUpdateDifficulty(sk.difficulty, grade);
    sk.lastReview = today();
    const interval = fsrsNextReview(sk.stability);
    const next = new Date(); next.setDate(next.getDate() + interval);
    sk.nextReview = next.toISOString().slice(0, 10);
    sk.attempts.push({ date: today(), grade });

    p.assessments.push({ topicId, grade, date: today() });
    this._save(p);

    const topic = TOPICS.find(t => t.id === topicId);
    return { topicId, name: topic ? topic.name : topicId, grade, nextReview: sk.nextReview, stability: sk.stability };
  }

  getProgress(id) {
    const p = this.getProfile(id);
    const available = this._topicsForLevel(p.level);
    const studied = Object.keys(p.skills).length;
    const mastered = Object.values(p.skills).filter(sk => {
      const last = sk.attempts.length ? sk.attempts[sk.attempts.length - 1].grade : 0;
      return last >= 3;
    }).length;

    const byCategory = {};
    for (const t of available) {
      if (!byCategory[t.category]) byCategory[t.category] = { total: 0, studied: 0 };
      byCategory[t.category].total++;
      if (p.skills[t.id]) byCategory[t.category].studied++;
    }

    return { studentId: id, level: p.level, totalTopics: available.length, studied, mastered, byCategory };
  }

  getReport(id) {
    const progress = this.getProgress(id);
    const p = this.getProfile(id);
    const td = today();
    const due = Object.entries(p.skills)
      .filter(([, sk]) => sk.nextReview && sk.nextReview <= td)
      .map(([topicId]) => {
        const t = TOPICS.find(x => x.id === topicId);
        return { topicId, name: t ? t.name : topicId };
      });

    return { ...progress, dueForReview: due.length, dueTopics: due, recentAssessments: (p.assessments || []).slice(-10) };
  }

  getNextTopics(id, count) {
    const p = this.getProfile(id);
    const available = this._topicsForLevel(p.level);
    const td = today();
    const due = [];
    const unstarted = [];

    for (const t of available) {
      const sk = p.skills[t.id];
      if (!sk) { unstarted.push({ id: t.id, name: t.name, level: t.level, reason: 'new' }); continue; }
      if (sk.nextReview && sk.nextReview <= td) {
        due.push({ id: t.id, name: t.name, level: t.level, reason: 'due' });
      }
    }

    const n = count ? parseInt(count) : 5;
    return { studentId: id, due: due.slice(0, n), unstarted: unstarted.slice(0, n), totalDue: due.length, totalUnstarted: unstarted.length };
  }

  listTopics(level) {
    let list = TOPICS;
    if (level) list = list.filter(t => t.level === level);
    return list.map(t => ({ id: t.id, name: t.name, level: t.level, category: t.category }));
  }

  getScoba(topicId) {
    const t = TOPICS.find(x => x.id === topicId);
    if (!t) throw new Error('Unknown topic: ' + topicId);
    return { topicId: t.id, name: t.name, level: t.level, scoba: t.scoba };
  }

  listStudents() { return listProfiles(this.dir); }
}

// ─── CLI ────────────────────────────────────────────────────────────────────

const tutor = new GrammarTutor();

runCLI((cmd, args, out) => {
  const id = args[1] || 'default';
  switch (cmd) {
    case 'start': out(tutor.getProfile(id)); tutor._save(tutor.getProfile(id)); break;
    case 'set-level': out(tutor.setLevel(id, (args[2] || '').toUpperCase())); break;
    case 'lesson': out(tutor.generateLesson(id, args[2])); break;
    case 'exercise': out(tutor.generateExercise(id, args[2], args[3])); break;
    case 'check': {
      const topicId = args[2], n = parseInt(args[3]), ans = args.slice(4).join(' ');
      out(tutor.checkAnswer(topicId, n, ans));
      break;
    }
    case 'record': out(tutor.recordAssessment(id, args[2], args[3])); break;
    case 'progress': out(tutor.getProgress(id)); break;
    case 'report': out(tutor.getReport(id)); break;
    case 'next': out(tutor.getNextTopics(id, args[2])); break;
    case 'topics': out(tutor.listTopics(args[2] ? args[2].toUpperCase() : null)); break;
    case 'scoba': out(tutor.getScoba(args[2])); break;
    case 'students': out({ students: tutor.listStudents() }); break;
    case 'help':
      out({ commands: 'Use one of the commands listed in SKILL.md' });
      break;
    default:
      out({ error: 'Unknown command: ' + cmd, commands: ['start','set-level','lesson','exercise','check','record','progress','report','next','topics','scoba','students'] });
  }
});
