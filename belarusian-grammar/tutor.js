#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');
const { CEFR, MASTERY_THRESHOLD, DEFAULT_RETENTION,
        dataDir, loadProfile, saveProfile, listProfiles,
        calcMastery, masteryLabel,
        fsrsRetention, fsrsNextReview, fsrsUpdateStability, fsrsUpdateDifficulty,
        shuffle, pick, norm, today, runCLI } = core;

const SKILL_NAME = 'belarusian-grammar';

// ─── Embedded Grammar Data ──────────────────────────────────────────────────

const TOPICS = [
  // ── A1 ──
  { id: 'gender-basics', name: 'Gender (м/ж/н)', level: 'A1', category: 'nouns',
    scoba: `Belarusian has 3 genders (NO articles):
  → Masculine: consonant ending — стол, горад, хлопец
  → Feminine: -а/-я ending — кніга, зямля, вуліца
  → Neuter: -а/-о/-е ending — акно, мора, поле
  Exceptions: дзень (m.), ноч (f. — soft sign)`,
    exercises: [
      { type: 'fill', prompt: 'Які род? "кніга" (м/ж/н)', answer: 'ж', hint: 'Ends in -а → feminine' },
      { type: 'fill', prompt: 'Які род? "стол" (м/ж/н)', answer: 'м', hint: 'Ends in consonant → masculine' },
      { type: 'fill', prompt: 'Які род? "акно" (м/ж/н)', answer: 'н', hint: 'Ends in -о → neuter' },
      { type: 'fill', prompt: 'Які род? "ноч" (м/ж/н)', answer: 'ж', hint: 'Soft-sign nouns: ноч is feminine' },
      { type: 'error', prompt: 'Новы кніга ляжыць на стале.', answer: 'Новая кніга ляжыць на стале.', hint: 'кніга is feminine → новая' },
    ] },
  { id: 'present-tense', name: 'Present Tense Conjugation', level: 'A1', category: 'verbs',
    scoba: `1st conjugation (-аць: чытаць — to read):
  я чытаю, ты чытаеш, ён/яна чытае, мы чытаем, вы чытаеце, яны чытаюць
2nd conjugation (-ыць/-іць: гаварыць — to speak):
  я гавару, ты гаворыш, ён/яна гаворыць, мы гаворым, вы гаворыце, яны гавораць`,
    exercises: [
      { type: 'fill', prompt: 'Я ___ (чытаць) кнігу.', answer: 'чытаю', hint: '1st conj: я → -ю' },
      { type: 'fill', prompt: 'Яны ___ (гаварыць) па-беларуску.', answer: 'гавораць', hint: '2nd conj: яны → -аць' },
      { type: 'fill', prompt: 'Ты ___ (жыць) у Мінску.', answer: 'жывеш', hint: 'жыць: ты жывеш' },
      { type: 'error', prompt: 'Мы чытае кнігу.', answer: 'Мы чытаем кнігу.', hint: 'мы → -ем for 1st conjugation' },
    ] },
  { id: 'nominative-accusative', name: 'Nominative & Accusative Cases', level: 'A1', category: 'cases',
    scoba: `Nominative (Назоўны): хто? што? — Subject
  "Студэнт чытае кнігу."
Accusative (Вінавальны): каго? што? — Direct object
  Inanimate masc. = Nominative: Я бачу стол.
  Animate masc. = Genitive form: Я бачу студэнта.
  Feminine -а → -у: Я чытаю кнігу.
  Neuter = Nominative: Я бачу акно.`,
    exercises: [
      { type: 'fill', prompt: 'Я бачу ___ (кніга).', answer: 'кнігу', hint: 'Feminine acc: -а → -у' },
      { type: 'fill', prompt: 'Я бачу ___ (стол).', answer: 'стол', hint: 'Inanimate masc acc = nominative' },
      { type: 'fill', prompt: 'Я бачу ___ (студэнт).', answer: 'студэнта', hint: 'Animate masc acc = genitive form' },
      { type: 'error', prompt: 'Я чытаю кніга.', answer: 'Я чытаю кнігу.', hint: 'Direct object → accusative: кніга → кнігу' },
    ] },
  { id: 'possessives', name: 'Possessive Pronouns', level: 'A1', category: 'pronouns',
    scoba: `мой/мая/маё/мае — my
твой/твая/тваё/твае — your (informal)
яго — his, яе — her, яго — its (do NOT decline!)
наш/наша/нашае/нашы — our
ваш/ваша/вашае/вашы — your (formal/plural)
іх — their (do NOT decline!)`,
    exercises: [
      { type: 'fill', prompt: '___ (my, f.) кніга на стале.', answer: 'Мая', hint: 'кніга is feminine → мая' },
      { type: 'fill', prompt: 'Гэта ___ (his) дом.', answer: 'яго', hint: 'His = яго (indeclinable)' },
      { type: 'fill', prompt: '___ (our, n.) акно вялікае.', answer: 'Нашае', hint: 'акно is neuter → нашае' },
    ] },
  { id: 'basic-questions', name: 'Basic Questions', level: 'A1', category: 'syntax',
    scoba: `Хто? — Who?  Што? — What?  Дзе? — Where?
Калі? — When?  Чаму? — Why?  Як? — How?
Колькі? — How much/many?  Які? — Which?`,
    exercises: [
      { type: 'fill', prompt: '___ гэта? — Гэта мой сябар. (Who?)', answer: 'Хто', hint: 'Asking about a person → Хто' },
      { type: 'fill', prompt: '___ ты жывеш? — У Мінску. (Where?)', answer: 'Дзе', hint: 'Asking about location → Дзе' },
      { type: 'fill', prompt: '___ каштуе хлеб? (How much?)', answer: 'Колькі', hint: 'Asking about price → Колькі' },
    ] },

  // ── A2 ──
  { id: 'past-tense', name: 'Past Tense', level: 'A2', category: 'verbs',
    scoba: `Past tense endings:
  Masculine: -ў (ён чытаў) — NOT Russian -л!
  Feminine: -ла (яна чытала)
  Neuter: -ло (яно чытала)
  Plural: -лі (яны чыталі)
Note: masc. -ў is the same [w] as ў letter.`,
    exercises: [
      { type: 'fill', prompt: 'Ён ___ (чытаць) кнігу ўчора.', answer: 'чытаў', hint: 'Masculine past → -ў' },
      { type: 'fill', prompt: 'Яна ___ (рабіць) дамашнюю работу.', answer: 'рабіла', hint: 'Feminine past → -ла' },
      { type: 'fill', prompt: 'Яны ___ (ісці) дадому.', answer: 'ішлі', hint: 'Plural past → -лі' },
      { type: 'error', prompt: 'Ён чытал кнігу.', answer: 'Ён чытаў кнігу.', hint: 'Belarusian masc. past = -ў, not Russian -л' },
    ] },
  { id: 'genitive', name: 'Genitive Case', level: 'A2', category: 'cases',
    scoba: `Genitive (Родны): каго? чаго? — Possession, absence, partitive
  Masculine: -а/-у: стала, настаўніка
  Feminine: -ы/-і: кнігі, зямлі
  Neuter: -а: акна
  Absence: Няма + genitive: "Няма хлеба." (There is no bread.)
  Possession: "Кніга студэнта." (The student's book.)`,
    exercises: [
      { type: 'fill', prompt: 'Няма ___ (хлеб).', answer: 'хлеба', hint: 'Masculine genitive: хлеб → хлеба' },
      { type: 'fill', prompt: 'Кніга ___ (настаўнік).', answer: 'настаўніка', hint: 'Masculine animate genitive → -а' },
      { type: 'fill', prompt: 'Няма ___ (вада).', answer: 'вады', hint: 'Feminine genitive: вада → вады' },
      { type: 'error', prompt: 'Няма хлеб.', answer: 'Няма хлеба.', hint: 'Absence requires genitive: няма + gen.' },
    ] },
  { id: 'locative', name: 'Locative Case', level: 'A2', category: 'cases',
    scoba: `Locative (Месны): аб кім? аб чым? — Location with prepositions у/на
  Masculine: -е/-у: у магазіне, у горадзе (consonant mutation г→дз!)
  Feminine: -е/-ы: у кнізе (г→з mutation), на рабоце
  Neuter: -е: у акне
  Note: у→ў after vowels: "Я быў у магазіне" but "Яна ў магазіне"`,
    exercises: [
      { type: 'fill', prompt: 'Я жыву ў ___ (Мінск).', answer: 'Мінску', hint: 'Masculine locative: Мінск → Мінску' },
      { type: 'fill', prompt: 'Кніга на ___ (стол).', answer: 'стале', hint: 'Masculine locative: стол → стале' },
      { type: 'fill', prompt: 'Яна на ___ (работа).', answer: 'рабоце', hint: 'Feminine locative: работа → рабоце' },
      { type: 'error', prompt: 'Я жыву ў Мінск.', answer: 'Я жыву ў Мінску.', hint: 'Location requires locative: у + locative' },
    ] },
  { id: 'adjective-agreement', name: 'Adjective Agreement', level: 'A2', category: 'nouns',
    scoba: `Adjectives agree in gender, number, case:
  Masc: новы дом   Fem: новая кніга   Neut: новае акно   Pl: новыя дамы
  Hard stem (-ы): новы/новая/новае/новыя
  Soft stem (-і): сіні/сіняя/сіняе/сінія`,
    exercises: [
      { type: 'fill', prompt: '___ (вялікі) кніга ляжыць на стале.', answer: 'Вялікая', hint: 'кніга is feminine → вялікая' },
      { type: 'fill', prompt: 'Гэта ___ (новы) акно.', answer: 'новае', hint: 'акно is neuter → новае' },
      { type: 'error', prompt: 'Гэта новы кніга.', answer: 'Гэта новая кніга.', hint: 'кніга = feminine → новая' },
    ] },
  { id: 'numbers-case', name: 'Numbers + Case', level: 'A2', category: 'nouns',
    scoba: `1 + Nominative singular: адзін стол
2-4 + Nominative plural: два сталы
5-20 + Genitive plural: пяць сталоў
21 = like 1, 22-24 = like 2-4, etc.`,
    exercises: [
      { type: 'fill', prompt: 'Тры ___ (кніга).', answer: 'кнігі', hint: '2-4 + nom. plural' },
      { type: 'fill', prompt: 'Пяць ___ (стол).', answer: 'сталоў', hint: '5+ + gen. plural' },
      { type: 'fill', prompt: 'Адна ___ (кніга).', answer: 'кніга', hint: '1 + nom. singular' },
    ] },

  // ── B1 ──
  { id: 'dative', name: 'Dative Case', level: 'B1', category: 'cases',
    scoba: `Dative (Давальны): каму? чаму? — Indirect object, recipient
  Masculine: -у: студэнту, настаўніку
  Feminine: -е/-ы: кнізе (г→з!), сястры
  Neuter: -у: акну
  Usage: Я даў кнігу студэнту. Мне падабаецца.`,
    exercises: [
      { type: 'fill', prompt: 'Я даў кнігу ___ (студэнт).', answer: 'студэнту', hint: 'Masc dative: -у' },
      { type: 'fill', prompt: '___ (я) падабаецца гэтая кніга.', answer: 'Мне', hint: 'Dative of я = мне' },
      { type: 'fill', prompt: 'Ён напісаў ліст ___ (сястра).', answer: 'сястры', hint: 'Feminine dative: сястра → сястры' },
    ] },
  { id: 'instrumental', name: 'Instrumental Case', level: 'B1', category: 'cases',
    scoba: `Instrumental (Творны): кім? чым? — Instrument, accompaniment
  Masculine: -ам/-ом: алоўкам, сталом (stressed о stays!)
  Feminine: -ай/-ёй: кнігай, зямлёй
  Neuter: -ам/-ом: акном
  With з: з сябрам (with a friend), з малаком (with milk)`,
    exercises: [
      { type: 'fill', prompt: 'Ён піша ___ (аловак).', answer: 'алоўкам', hint: 'Masc instrumental: аловак → алоўкам' },
      { type: 'fill', prompt: 'Я іду з ___ (сябар).', answer: 'сябрам', hint: 'Masc instrumental: сябар → сябрам' },
      { type: 'fill', prompt: 'Кава з ___ (малако).', answer: 'малаком', hint: 'Neuter instrumental: малако → малаком' },
    ] },
  { id: 'aspect-basic', name: 'Verbal Aspect (basic)', level: 'B1', category: 'verbs',
    scoba: `Is the action...
  ├── Repeated/habitual? → IMPERFECTIVE (незакончаны від)
  │   "Ён штодня чытае газету."
  ├── Happening now? → IMPERFECTIVE
  │   "Яна зараз піша ліст."
  ├── Completed (one-time, result)? → PERFECTIVE (закончаны від)
  │   "Ён прачытаў кнігу."
  └── Sequential actions? → PERFECTIVE (each)
      "Ён увайшоў, сеў і пачаў чытаць."`,
    exercises: [
      { type: 'fill', prompt: 'Ён штодня ___ (чытаць/прачытаць) газету.', answer: 'чытае', hint: 'Habitual → imperfective' },
      { type: 'fill', prompt: 'Учора ён ___ (чытаць/прачытаць) ўсю кнігу.', answer: 'прачытаў', hint: 'Completed → perfective' },
      { type: 'fill', prompt: 'Яна зараз ___ (пісаць/напісаць) ліст.', answer: 'піша', hint: 'In progress → imperfective' },
    ] },
  { id: 'conditional', name: 'Conditional (бы)', level: 'B1', category: 'verbs',
    scoba: `Conditional = past tense + бы particle:
  Я чытаў бы (I would read — masc.)
  Яна чытала б (She would read)
  Каб + past: Каб я ведаў, я б сказаў. (If I had known, I would have said.)`,
    exercises: [
      { type: 'fill', prompt: 'Я ___ бы вам, каб ведаў. (сказаць)', answer: 'сказаў', hint: 'Conditional: past tense + бы' },
      { type: 'fill', prompt: 'Каб у мяне быў час, я ___ бы кнігу. (чытаць)', answer: 'чытаў', hint: 'каб + past ... verb-past бы' },
      { type: 'transform', prompt: 'Make conditional: "Я іду ў кіно."', answer: 'Я ішоў бы ў кіно.', hint: 'Past tense + бы' },
    ] },
  { id: 'comparative', name: 'Comparative & Superlative', level: 'B1', category: 'nouns',
    scoba: `Comparative: -ейш-/-эйш- or больш/менш + adjective
  новы → навейшы (newer), вялікі → большы (bigger)
  больш цікавы (more interesting)
Superlative: най- + comparative: найвялікшы, найлепшы
  самы + adjective: самы цікавы`,
    exercises: [
      { type: 'fill', prompt: 'Гэты дом ___ (big-er) за той.', answer: 'большы', hint: 'вялікі → большы' },
      { type: 'fill', prompt: 'Гэта ___ (most interesting) кніга.', answer: 'самая цікавая', hint: 'самы + adj agreeing in gender' },
    ] },
  { id: 'motion-verbs', name: 'Motion Verbs', level: 'B1', category: 'verbs',
    scoba: `Unidirectional / Multidirectional pairs:
  ісці / хадзіць — go (on foot)
  ехаць / ездзіць — go (by vehicle)
  бегчы / бегаць — run
  несці / насіць — carry
  весці / вадзіць — lead
  ляцець / лятаць — fly`,
    exercises: [
      { type: 'fill', prompt: 'Я ___ (хадзіць) у школу штодня.', answer: 'хаджу', hint: 'Habitual → multidirectional: хадзіць' },
      { type: 'fill', prompt: 'Зараз я ___ (ісці) дадому.', answer: 'іду', hint: 'Right now, one direction → unidirectional: ісці' },
      { type: 'fill', prompt: 'Ён часта ___ (ездзіць) у Гродна.', answer: 'ездзіць', hint: 'Habitual by vehicle → multidirectional' },
    ] },

  // ── B2 ──
  { id: 'participles', name: 'Participles (дзеепрыметнікі)', level: 'B2', category: 'verbs',
    scoba: `Active present: чытаючы (while reading — verbal adverb more common)
Active past: прачытаўшы (having read — verbal adverb)
Passive: напісаны (written), прачытаная (read-f)
Note: Belarusian prefers verbal adverbs (дзеепрыслоўі) over participles.`,
    exercises: [
      { type: 'fill', prompt: 'Кніга, ___ (напісаць — passive) Быкавым, вельмі вядомая.', answer: 'напісаная', hint: 'Passive participle: напісаная (f. agrees with кніга)' },
      { type: 'fill', prompt: '___ (прачытаць — having read) кнігу, ён заснуў.', answer: 'Прачытаўшы', hint: 'Perfective verbal adverb: прачытаўшы' },
    ] },
  { id: 'kab-subjunctive', name: 'Каб + Past (Subjunctive)', level: 'B2', category: 'verbs',
    scoba: `каб + past tense = purpose / wish / subjunctive:
  "Я прыйшоў, каб дапамагчы." (I came to help.)
  "Каб ён ведаў!" (If only he knew!)
  "Мне трэба, каб ты прыйшоў." (I need you to come.)`,
    exercises: [
      { type: 'fill', prompt: 'Я прыйшоў, ___ дапамагчы. (in order to)', answer: 'каб', hint: 'Purpose clause → каб' },
      { type: 'fill', prompt: 'Мне трэба, каб ты ___ (прыйсці).', answer: 'прыйшоў', hint: 'каб + past tense form' },
      { type: 'transform', prompt: 'Express a wish: "He knows about this."', answer: 'Каб ён ведаў пра гэта!', hint: 'каб + past tense for wishes' },
    ] },
  { id: 'passive', name: 'Passive Constructions', level: 'B2', category: 'syntax',
    scoba: `Passive with -ся: Дом будуецца. (The house is being built.)
Passive with быць + participle: Кніга была напісана ў 1966. (The book was written in 1966.)
Impersonal: Тут не курыцца. (No smoking here — lit. it is not smoked here.)`,
    exercises: [
      { type: 'fill', prompt: 'Гэты дом ___ (будаваць-passive) зараз.', answer: 'будуецца', hint: 'Present passive: будаваць → будуецца' },
      { type: 'fill', prompt: 'Кніга была ___ (напісаць) Якубам Коласам.', answer: 'напісана', hint: 'Short passive participle: напісана' },
    ] },
  { id: 'prepositions-cases', name: 'Preposition + Case', level: 'B2', category: 'cases',
    scoba: `у/ў + Loc: location (у магазіне)    у/ў + Acc: direction (у магазін)
на + Loc: on/at (на рабоце)          на + Acc: onto (на работу)
з + Gen: from (з магазіна)           з + Inst: with (з сябрам)
да + Gen: to (да магазіна)           ад + Gen: from person (ад сябра)
для + Gen: for (для цябе)           без + Gen: without (без вады)
пра + Acc: about (пра Беларусь)     за + Inst: behind (за домам)`,
    exercises: [
      { type: 'fill', prompt: 'Я іду ___ магазін. (direction)', answer: 'у', hint: 'Direction → у + accusative' },
      { type: 'fill', prompt: 'Я быў ___ магазіне. (location)', answer: 'у', hint: 'Location → у + locative' },
      { type: 'fill', prompt: 'Я іду ___ сябрам. (with)', answer: 'з', hint: 'Accompaniment → з + instrumental' },
      { type: 'error', prompt: 'Я іду да магазін.', answer: 'Я іду да магазіна.', hint: 'да requires genitive: магазін → магазіна' },
    ] },

  // ── C1 ──
  { id: 'advanced-aspect', name: 'Advanced Aspect Usage', level: 'C1', category: 'verbs',
    scoba: `Negation + aspect:
  "Ніколі не чытаў" (never read — impf, general)
  "Не паспеў прачытаць" (didn't manage to read — pf, specific failure)
Aspect with modals:
  "Пачаў чытаць" (began reading — impf after начинать)
  "Паспеў прачытаць" (managed to read — pf for result)`,
    exercises: [
      { type: 'fill', prompt: 'Ён ніколі не ___ (чытаць/прачытаць) гэтую кнігу.', answer: 'чытаў', hint: 'General negation "never" → imperfective' },
      { type: 'fill', prompt: 'Я не паспеў ___ (чытаць/прачытаць) ліст.', answer: 'прачытаць', hint: 'Specific failure to complete → perfective' },
    ] },
  { id: 'taraszkievica', name: 'Taraškievica vs Narkamaŭka', level: 'C1', category: 'syntax',
    scoba: `Two orthographic norms:
  Narkamaŭka (official, 1933): Government, education, state media
  Taraškievica (classic): Independent media, diaspora, cultural
Key differences: loanword handling, some suffix forms
Learner should recognize BOTH when reading.`,
    exercises: [
      { type: 'fill', prompt: 'Which norm is used in official Belarusian education?', answer: 'Narkamaŭka', hint: 'The 1933 reform = official/state norm' },
      { type: 'fill', prompt: 'Which norm do Наша Ніва and Белсат typically use?', answer: 'Taraškievica', hint: 'Independent media often uses the classic norm' },
    ] },
  { id: 'word-order', name: 'Advanced Word Order', level: 'C1', category: 'syntax',
    scoba: `Default: SVO — Ён чытае кнігу.
Topicalization: OVS — Кнігу ён чытае (the book, he's reading).
Focus: new info goes at end (rheme position).
Emphatic: Не ён гэта зрабіў! (It wasn't HE who did it!)`,
    exercises: [
      { type: 'transform', prompt: 'Topicalize the object: "Я люблю гэту кнігу."', answer: 'Гэту кнігу я люблю.', hint: 'Move object to front for emphasis' },
      { type: 'fill', prompt: 'Neutral word order is: S__ (SVO/SOV/VSO)', answer: 'SVO', hint: 'Belarusian default = Subject-Verb-Object' },
    ] },
  { id: 'discourse-markers', name: 'Discourse Markers', level: 'C1', category: 'syntax',
    scoba: `Contrast: аднак, тым не менш, у той жа час, наадварот
Consequence: таму, у выніку, адсюль вынікае
Addition: акрамя таго, больш за тое, да таго ж
Reformulation: гэта значыць, інакш кажучы, іншымі словамі`,
    exercises: [
      { type: 'fill', prompt: 'Ён шмат вучыўся; ___, ён здаў экзамен. (therefore)', answer: 'таму', hint: 'Consequence → таму' },
      { type: 'fill', prompt: 'Мне не падабаецца кава; ___, я п\'ю гарбату. (on the contrary)', answer: 'наадварот', hint: 'Contrast → наадварот' },
    ] },

  // ── C2 ──
  { id: 'literary-forms', name: 'Literary/Archaic Forms', level: 'C2', category: 'syntax',
    scoba: `Vestigial vocative: Божа! (God!), Браце! (Brother!)
Literary register: participles, inversions, complex syntax
Dialectal forms in literature (esp. Быкаў, Колас)
Taraškievica-specific forms in diaspora texts`,
    exercises: [
      { type: 'fill', prompt: 'The vestigial vocative of Бог is: ___', answer: 'Божа', hint: 'Exclamation form: Божа!' },
      { type: 'fill', prompt: 'Belarusian has ___ productive cases (not counting vestigial vocative).', answer: '6', hint: 'Назоўны, Родны, Давальны, Вінавальны, Творны, Месны' },
    ] },
  { id: 'register-variation', name: 'Register Variation', level: 'C2', category: 'syntax',
    scoba: `Registers in Belarusian:
  Размоўны (colloquial): particles, diminutives, ты
  Нейтральны (neutral): standard
  Навуковы (academic): technical terms, passive
  Публіцыстычны (journalistic): media style
  Афіцыйна-дзелавы (official): bureaucratic
  Мастацкі (literary): figurative language`,
    exercises: [
      { type: 'fill', prompt: 'Bureaucratic/official register is called: ___-дзелавы.', answer: 'Афіцыйна', hint: 'Official-business register' },
      { type: 'fill', prompt: 'Which register uses figurative language? ___', answer: 'Мастацкі', hint: 'Literary/artistic register' },
    ] },
];

// ─── Class ──────────────────────────────────────────────────────────────────

class GrammarTutor {
  constructor() {
    this.dir = dataDir(SKILL_NAME);
  }

  getProfile(studentId) {
    return loadProfile(this.dir, studentId);
  }

  _save(p) {
    saveProfile(this.dir, p);
  }

  setLevel(studentId, level) {
    level = level.toUpperCase();
    if (!CEFR.includes(level)) throw new Error(`Invalid level. Use: ${CEFR.join(', ')}`);
    const p = this.getProfile(studentId);
    p.level = level;
    this._save(p);
    return { studentId, level };
  }

  getTopicCatalog(level) {
    const topics = level ? TOPICS.filter(t => t.level === level) : TOPICS;
    return topics.map(t => ({ id: t.id, name: t.name, level: t.level, category: t.category, exercises: t.exercises.length }));
  }

  getScoba(topicId) {
    const t = TOPICS.find(t => t.id === topicId);
    if (!t) throw new Error(`Unknown topic: ${topicId}`);
    return { id: t.id, name: t.name, level: t.level, scoba: t.scoba };
  }

  generateLesson(studentId, topicId) {
    const p = this.getProfile(studentId);
    const t = topicId ? TOPICS.find(t => t.id === topicId) : this._nextTopic(p);
    if (!t) throw new Error(topicId ? `Unknown topic: ${topicId}` : 'No topics available. Set a level first.');
    const exercises = pick(t.exercises, 3);
    return {
      topic: { id: t.id, name: t.name, level: t.level, category: t.category },
      scoba: t.scoba,
      exercises: exercises.map((e, i) => ({ n: i + 1, type: e.type, prompt: e.prompt })),
      flow: [
        'Step 1: Read the SCOBA decision flowchart above.',
        'Step 2: Try each exercise below.',
        'Step 3: Use "check <topicId> <n> <answer>" to check your answers.',
        'Step 4: Use "record <studentId> <topicId> <grade 1-4>" to log mastery.',
      ],
    };
  }

  generateExercise(studentId, topicId, type) {
    const p = this.getProfile(studentId);
    let pool;
    if (topicId) {
      const t = TOPICS.find(t => t.id === topicId);
      if (!t) throw new Error(`Unknown topic: ${topicId}`);
      pool = t.exercises;
    } else {
      const level = p.level || 'A1';
      const levelTopics = TOPICS.filter(t => t.level === level);
      pool = levelTopics.flatMap(t => t.exercises);
    }
    if (type) pool = pool.filter(e => e.type === type);
    if (!pool.length) throw new Error('No exercises match the criteria.');
    const ex = pick(pool, 1)[0];
    return { type: ex.type, prompt: ex.prompt, _answer: ex.answer, _hint: ex.hint };
  }

  checkAnswer(topicId, exerciseIndex, userAnswer) {
    const t = TOPICS.find(t => t.id === topicId);
    if (!t) throw new Error(`Unknown topic: ${topicId}`);
    const idx = exerciseIndex - 1;
    if (idx < 0 || idx >= t.exercises.length) throw new Error(`Exercise index out of range (1-${t.exercises.length}).`);
    const ex = t.exercises[idx];
    const correct = norm(userAnswer) === norm(ex.answer);
    return { correct, expected: ex.answer, given: userAnswer, hint: correct ? null : ex.hint, type: ex.type };
  }

  recordAssessment(studentId, topicId, grade) {
    grade = Number(grade);
    if (!isValidGrade(grade, 1, 4)) throw new Error('Grade must be 1-4 (1=Again 2=Hard 3=Good 4=Easy)');
    const p = this.getProfile(studentId);
    if (!p.skills) p.skills = {};
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
    sk.attempts.push({ score: grade >= 3 ? 1 : 0, total: 1, date: today() });
    this._save(p);

    const mastery = calcMastery(sk.attempts);
    return { studentId, topicId, grade, mastery, masteryLabel: masteryLabel(mastery), nextReview: sk.nextReview, interval };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const levelTopics = TOPICS.filter(t => t.level === level);
    const topicStatus = levelTopics.map(t => {
      const sk = (p.skills || {})[t.id];
      const mastery = sk ? calcMastery(sk.attempts) : 0;
      return { id: t.id, name: t.name, category: t.category, mastery, label: masteryLabel(mastery), nextReview: sk ? sk.nextReview : null };
    });
    return { studentId, level, topics: topicStatus };
  }

  getNextTopics(studentId, count) {
    const n = count || 3;
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const levelTopics = TOPICS.filter(t => t.level === level);
    const td = today();
    const due = [];
    const fresh = [];
    for (const t of levelTopics) {
      const sk = (p.skills || {})[t.id];
      if (!sk) { fresh.push(t); continue; }
      if (sk.nextReview && sk.nextReview <= td) due.push(t);
    }
    const result = [...due.slice(0, n), ...fresh.slice(0, n - due.length)];
    return { studentId, level, due: due.length, fresh: fresh.length, next: result.map(t => ({ id: t.id, name: t.name, category: t.category })) };
  }

  getReport(studentId) {
    const progress = this.getProgress(studentId);
    const next = this.getNextTopics(studentId);
    const p = this.getProfile(studentId);
    const byCat = {};
    for (const t of progress.topics) {
      if (!byCat[t.category]) byCat[t.category] = { total: 0, mastered: 0 };
      byCat[t.category].total++;
      if (t.mastery >= MASTERY_THRESHOLD) byCat[t.category].mastered++;
    }
    return { studentId, level: progress.level, categories: byCat, topicProgress: progress.topics, recommendations: next.next };
  }

  listStudents() {
    return listProfiles(this.dir);
  }

  _nextTopic(p) {
    const level = p.level || 'A1';
    const levelTopics = TOPICS.filter(t => t.level === level);
    const td = today();
    const due = levelTopics.filter(t => {
      const sk = (p.skills || {})[t.id];
      return sk && sk.nextReview && sk.nextReview <= td;
    });
    if (due.length) return pick(due, 1)[0];
    const fresh = levelTopics.filter(t => !(p.skills || {})[t.id]);
    if (fresh.length) return fresh[0];
    return levelTopics.length ? pick(levelTopics, 1)[0] : null;
  }
}

// ─── CLI ────────────────────────────────────────────────────────────────────

const tutor = new GrammarTutor();

runCLI((cmd, args, out) => {
  const sid = args[1] || 'default';
  switch (cmd) {
    case 'start':
      out(tutor.getProfile(sid));
      break;
    case 'set-level':
      out(tutor.setLevel(sid, (args[2] || '').toUpperCase()));
      break;
    case 'lesson':
      out(tutor.generateLesson(sid, args[2] || null));
      break;
    case 'exercise':
      out(tutor.generateExercise(sid, args[2] || null, args[3] || null));
      break;
    case 'check': {
      const topicId = args[2], n = parseInt(args[3], 10), answer = args.slice(4).join(' ');
      if (!topicId || isNaN(n)) throw new Error('Usage: check <topicId> <n> <answer>');
      out(tutor.checkAnswer(topicId, n, answer));
      break;
    }
    case 'record':
      out(tutor.recordAssessment(sid, args[2], args[3]));
      break;
    case 'progress':
      out(tutor.getProgress(sid));
      break;
    case 'report':
      out(tutor.getReport(sid));
      break;
    case 'next':
      out(tutor.getNextTopics(sid, args[2] ? parseInt(args[2], 10) : 3));
      break;
    case 'topics':
      out(tutor.getTopicCatalog(args[2] ? args[2].toUpperCase() : null));
      break;
    case 'scoba':
      out(tutor.getScoba(args[2]));
      break;
    case 'students':
      out({ students: tutor.listStudents() });
      break;
    case 'help':
      out({ commands: ['start', 'set-level', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'topics', 'scoba', 'students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + cmd,
        commands: ['start', 'set-level', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'topics', 'scoba', 'students'],
      });
  }
});
