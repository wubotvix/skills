#!/usr/bin/env node
// Russian Grammar Tutor — discovery-based grammar teaching with FSRS spaced repetition
'use strict';

const core = require('../_lib/core');
const { CEFR, MASTERY_THRESHOLD, DEFAULT_RETENTION,
        dataDir, loadProfile, saveProfile, listProfiles,
        calcMastery, masteryLabel,
        fsrsRetention, fsrsNextReview, fsrsUpdateStability, fsrsUpdateDifficulty,
        shuffle, pick, norm, today, runCLI } = core;

const SKILL_NAME = 'russian-grammar';

// ─── Embedded Grammar Data ──────────────────────────────────────────────────

const TOPICS = [
  // ── A1 ──
  { id: 'gender-nouns', name: 'Gender of Nouns', level: 'A1', category: 'nouns',
    scoba: `What is the last letter of the noun?
  → Consonant or -й?
      → MASCULINE: студе́нт, музе́й
  → -а or -я?
      → FEMININE: кни́га, неде́ля
  → -о or -е?
      → NEUTER: окно́, мо́ре
  → -ь (soft sign)?
      → Could be MASC or FEM — must memorize!
      MASC: день, слова́рь | FEM: ночь, тетра́дь`,
    exercises: [
      { type: 'fill', prompt: 'Э́то но́в___ кни́га. (new book)', answer: 'ая', hint: 'кни́га ends in -а → feminine → но́вая' },
      { type: 'fill', prompt: 'Э́то больш___ окно́. (big window)', answer: 'о́е', hint: 'окно́ ends in -о → neuter → большо́е' },
      { type: 'fill', prompt: 'Э́то ста́р___ дом. (old house)', answer: 'ый', hint: 'дом ends in consonant → masculine → ста́рый' },
      { type: 'error', prompt: 'Э́то но́вый кни́га.', answer: 'Э́то но́вая кни́га.', hint: 'кни́га is feminine → но́вая' },
    ] },
  { id: 'present-1st-conj', name: 'Present Tense: 1st Conjugation (-ать)', level: 'A1', category: 'verbs',
    scoba: `1st conjugation (-ать verbs): знать, де́лать, чита́ть
  я → -ю (зна́ю)
  ты → -ешь (зна́ешь)
  он/она́ → -ет (зна́ет)
  мы → -ем (зна́ем)
  вы → -ете (зна́ете)
  они́ → -ют (зна́ют)`,
    exercises: [
      { type: 'fill', prompt: 'Я ___ (чита́ть) кни́гу.', answer: 'чита́ю', hint: 'я → -ю' },
      { type: 'fill', prompt: 'Они́ ___ (де́лать) уро́ки.', answer: 'де́лают', hint: 'они́ → -ют' },
      { type: 'fill', prompt: 'Ты ___ (знать) э́того челове́ка?', answer: 'зна́ешь', hint: 'ты → -ешь' },
      { type: 'error', prompt: 'Мы чита́ют кни́гу.', answer: 'Мы чита́ем кни́гу.', hint: 'мы → -ем, not -ют' },
    ] },
  { id: 'present-2nd-conj', name: 'Present Tense: 2nd Conjugation (-ить)', level: 'A1', category: 'verbs',
    scoba: `2nd conjugation (-ить verbs): говори́ть, люби́ть, учи́ть
  я → -ю/-у (говорю́)
  ты → -ишь (говори́шь)
  он/она́ → -ит (говори́т)
  мы → -им (говори́м)
  вы → -ите (говори́те)
  они́ → -ят/-ат (говоря́т)`,
    exercises: [
      { type: 'fill', prompt: 'Она́ ___ (говори́ть) по-ру́сски.', answer: 'говори́т', hint: 'она́ → -ит' },
      { type: 'fill', prompt: 'Вы ___ (люби́ть) му́зыку?', answer: 'лю́бите', hint: 'вы → -ите' },
      { type: 'fill', prompt: 'Они́ ___ (учи́ть) ру́сский язы́к.', answer: 'у́чат', hint: 'они́ → -ат' },
    ] },
  { id: 'nominative-case', name: 'Nominative Case (Именительный)', level: 'A1', category: 'cases',
    scoba: `The nominative case is the "dictionary form":
  → WHO or WHAT is doing the action? → NOMINATIVE
  → Used after "э́то" (this is): "Э́то кни́га."
  → Used as subject: "Студе́нт чита́ет."`,
    exercises: [
      { type: 'fill', prompt: 'Э́то мо___ кни́га. (my book)', answer: 'я́', hint: 'кни́га is feminine → моя́' },
      { type: 'fill', prompt: '___ (кто) э́то?', answer: 'Кто', hint: 'Nominative question word for people' },
    ] },
  { id: 'accusative-basic', name: 'Accusative Case (basic)', level: 'A1', category: 'cases',
    scoba: `Accusative = direct object (WHAT do you see/read/want?)
  → Masculine inanimate = same as nominative (Я ви́жу дом.)
  → Masculine animate = same as genitive (Я ви́жу студе́нта.)
  → Feminine -а → -у (Я ви́жу кни́гу.)
  → Feminine -я → -ю (Я ви́жу неде́лю.)
  → Neuter = same as nominative (Я ви́жу окно́.)`,
    exercises: [
      { type: 'fill', prompt: 'Я чита́ю ___ (кни́га).', answer: 'кни́гу', hint: 'Feminine -а → -у in accusative' },
      { type: 'fill', prompt: 'Я ви́жу ___ (студе́нт).', answer: 'студе́нта', hint: 'Animate masculine → genitive form = accusative' },
      { type: 'error', prompt: 'Я чита́ю кни́га.', answer: 'Я чита́ю кни́гу.', hint: 'Direct object needs accusative: -а → -у' },
    ] },
  { id: 'u-menya-est', name: 'У меня́ есть... (I have)', level: 'A1', category: 'constructions',
    scoba: `"Having" in Russian uses genitive of possessor + есть:
  → У меня́ есть кни́га. (I have a book.)
  → У тебя́ есть маши́на? (Do you have a car?)
  Negation: У меня́ нет + GENITIVE
  → У меня́ нет кни́ги. (I don't have a book.)`,
    exercises: [
      { type: 'fill', prompt: 'У ___ (я) есть соба́ка.', answer: 'меня́', hint: 'я → меня́ (genitive)' },
      { type: 'fill', prompt: 'У меня́ нет ___ (маши́на).', answer: 'маши́ны', hint: 'Negation: нет + genitive (-а → -ы)' },
    ] },

  // ── A2 ──
  { id: 'genitive-case', name: 'Genitive Case (Родительный)', level: 'A2', category: 'cases',
    scoba: `Genitive answers: кого́? чего́? (of whom? of what?)
  → Possession: кни́га студе́нта (student's book)
  → Absence: нет студе́нта (no student)
  → After numbers 2-4: два студе́нта
  → After numbers 5+: пять студе́нтов
  Masc: -∅ → -а/-я | Fem: -а → -ы/-и | Neut: -о → -а`,
    exercises: [
      { type: 'fill', prompt: 'У меня́ нет ___ (брат).', answer: 'бра́та', hint: 'Masculine genitive: consonant + -а' },
      { type: 'fill', prompt: 'Э́то кни́га ___ (учи́тель).', answer: 'учи́теля', hint: 'Masculine soft: -ь → -я' },
      { type: 'fill', prompt: 'Пять ___ (студе́нт).', answer: 'студе́нтов', hint: '5+ requires genitive plural: -ов' },
      { type: 'error', prompt: 'У меня́ нет кни́га.', answer: 'У меня́ нет кни́ги.', hint: 'нет + genitive: -а → -и' },
    ] },
  { id: 'prepositional-case', name: 'Prepositional Case (Предложный)', level: 'A2', category: 'cases',
    scoba: `Prepositional answers: о ком? о чём? где? (about whom? where?)
  → Location: в шко́ле (in school), на рабо́те (at work)
  → About: о кни́ге (about the book)
  Most nouns → -е: дом → в до́ме, кни́га → о кни́ге
  Exceptions: -ий → -ии, -ие → -ии, -ия → -ии`,
    exercises: [
      { type: 'fill', prompt: 'Я живу́ в ___ (Москва́).', answer: 'Москве́', hint: 'Feminine -а → -е in prepositional' },
      { type: 'fill', prompt: 'Он рабо́тает в ___ (больни́ца).', answer: 'больни́це', hint: 'Feminine -а → -е' },
      { type: 'error', prompt: 'Я живу́ в Москва́.', answer: 'Я живу́ в Москве́.', hint: 'в + location requires prepositional case' },
    ] },
  { id: 'dative-case', name: 'Dative Case (Дательный)', level: 'A2', category: 'cases',
    scoba: `Dative answers: кому́? чему́? (to whom? to what?)
  → Indirect object: Я дал кни́гу студе́нту.
  → Age: Мне два́дцать лет. (I am 20.)
  → Impersonal: Мне хо́лодно. (I am cold.)
  Masc: -∅ → -у/-ю | Fem: -а → -е | Neut: -о → -у`,
    exercises: [
      { type: 'fill', prompt: '___ (я) два́дцать лет.', answer: 'Мне', hint: 'Age uses dative: я → мне' },
      { type: 'fill', prompt: 'Я дал кни́гу ___ (сестра́).', answer: 'сестре́', hint: 'Feminine -а → -е in dative' },
    ] },
  { id: 'past-tense', name: 'Past Tense', level: 'A2', category: 'verbs',
    scoba: `Russian past tense agrees with GENDER, not person:
  → Masc: он чита́л
  → Fem: она́ чита́ла
  → Neut: оно́ чита́ло
  → Plural: они́ чита́ли
  Form: stem + -л/-ла/-ло/-ли`,
    exercises: [
      { type: 'fill', prompt: 'Она́ ___ (чита́ть) кни́гу.', answer: 'чита́ла', hint: 'Feminine past: stem + -ла' },
      { type: 'fill', prompt: 'Мы ___ (де́лать) уро́ки.', answer: 'де́лали', hint: 'Plural past: stem + -ли' },
      { type: 'error', prompt: 'Она́ чита́л кни́гу.', answer: 'Она́ чита́ла кни́гу.', hint: 'она́ = feminine → чита́ла (not чита́л)' },
    ] },
  { id: 'adjective-agreement', name: 'Adjective Agreement', level: 'A2', category: 'nouns',
    scoba: `Adjectives agree with nouns in gender, number, and case:
  → Masc: но́вый дом, большо́й го́род
  → Fem: но́вая кни́га, больша́я шко́ла
  → Neut: но́вое окно́, большо́е о́зеро
  → Plural: но́вые дома́, больши́е го́рода`,
    exercises: [
      { type: 'fill', prompt: 'Э́то ___ (краси́вый) де́вушка.', answer: 'краси́вая', hint: 'де́вушка is feminine → краси́вая' },
      { type: 'fill', prompt: '___ (ру́сский) язы́к.', answer: 'Ру́сский', hint: 'язы́к is masculine → ру́сский' },
      { type: 'error', prompt: 'Э́то но́вый кни́га.', answer: 'Э́то но́вая кни́га.', hint: 'кни́га is feminine → но́вая' },
    ] },
  { id: 'reflexive-verbs', name: 'Reflexive Verbs (-ся/-сь)', level: 'A2', category: 'verbs',
    scoba: `Reflexive verbs end in -ся (after consonants) or -сь (after vowels):
  → учи́ть = to teach | учи́ться = to study/learn
  → начина́ть = to begin (something) | начина́ться = to begin (itself)
  After consonant: -ся (учи́тся)
  After vowel: -сь (учи́лась)`,
    exercises: [
      { type: 'fill', prompt: 'Я ___ (учи́ться) в университе́те.', answer: 'учу́сь', hint: 'я учу́сь (after vowel → -сь)' },
      { type: 'fill', prompt: 'Она́ ___ (занима́ться) спо́ртом.', answer: 'занима́ется', hint: 'она́ + -ется' },
    ] },

  // ── B1 ──
  { id: 'instrumental-case', name: 'Instrumental Case (Творительный)', level: 'B1', category: 'cases',
    scoba: `Instrumental answers: кем? чем? (by whom? with what?)
  → With: с дру́гом (with a friend)
  → Instrument: писа́ть ру́чкой (write with a pen)
  → After быть in past/future: Он был студе́нтом.
  Masc: -∅ → -ом/-ем | Fem: -а → -ой/-ей | Neut: -о → -ом`,
    exercises: [
      { type: 'fill', prompt: 'Я пишу́ ___ (ру́чка).', answer: 'ру́чкой', hint: 'Feminine instrumental: -а → -ой' },
      { type: 'fill', prompt: 'Он был ___ (студе́нт).', answer: 'студе́нтом', hint: 'After быть in past: instrumental' },
      { type: 'fill', prompt: 'Я иду́ с ___ (друг).', answer: 'дру́гом', hint: 'с + instrumental: -∅ → -ом' },
    ] },
  { id: 'verbal-aspect', name: 'Verbal Aspect (Imperfective/Perfective)', level: 'B1', category: 'verbs',
    scoba: `Is the action...
  REPEATED / HABITUAL / ONGOING PROCESS?
    → IMPERFECTIVE (де́лать, чита́ть)
  SINGLE COMPLETED RESULT?
    → PERFECTIVE (сде́лать, прочита́ть)
  IN PROGRESS (past or present)?
    → IMPERFECTIVE
  SEQUENTIAL CHAIN (first X, then Y, then Z)?
    → PERFECTIVE for each action
  GENERAL / NAMED (Did you ever...?)?
    → IMPERFECTIVE
  NEGATED COMMAND (Don't do X!)?
    → IMPERFECTIVE imperative
  SPECIFIC REQUEST (Do X now!)?
    → PERFECTIVE imperative`,
    exercises: [
      { type: 'fill', prompt: 'Я ка́ждый день ___ (чита́ть/прочита́ть) газе́ту.', answer: 'чита́ю', hint: 'Habitual (ка́ждый день) → imperfective' },
      { type: 'fill', prompt: 'Вчера́ я ___ (чита́ть/прочита́ть) э́ту кни́гу.', answer: 'прочита́л', hint: 'Completed result (finished the book) → perfective' },
      { type: 'error', prompt: 'Я ка́ждый день прочита́ю газе́ту.', answer: 'Я ка́ждый день чита́ю газе́ту.', hint: 'Habitual action → imperfective' },
    ] },
  { id: 'motion-verbs-basic', name: 'Verbs of Motion (basic)', level: 'B1', category: 'verbs',
    scoba: `Is the movement...
  ONE DIRECTION, ONE TRIP, RIGHT NOW?
    → UNIDIRECTIONAL (идти́, е́хать)
  HABITUAL / ROUND TRIP / GENERAL ABILITY?
    → MULTIDIRECTIONAL (ходи́ть, е́здить)
  ON FOOT?
    → идти́ / ходи́ть
  BY VEHICLE?
    → е́хать / е́здить`,
    exercises: [
      { type: 'fill', prompt: 'Я сейча́с ___ (идти́/ходи́ть) в магази́н.', answer: 'иду́', hint: 'Right now, one direction → unidirectional: идти́' },
      { type: 'fill', prompt: 'Я ка́ждый день ___ (идти́/ходи́ть) в магази́н.', answer: 'хожу́', hint: 'Every day (habitual) → multidirectional: ходи́ть' },
      { type: 'error', prompt: 'Я иду́ в магази́н ка́ждый день.', answer: 'Я хожу́ в магази́н ка́ждый день.', hint: 'Habitual/repeated → multidirectional (ходи́ть)' },
    ] },
  { id: 'conditional-mood', name: 'Conditional Mood (бы + past)', level: 'B1', category: 'verbs',
    scoba: `Conditional = бы + past tense form:
  → Е́сли бы я знал, я бы пришёл. (If I had known, I would have come.)
  → Я бы хоте́л... (I would like...)
  бы can go after the verb or after е́сли:
  → Е́сли бы... → condition
  → verb + бы → result`,
    exercises: [
      { type: 'fill', prompt: 'Е́сли бы я ___ (знать), я бы пришёл.', answer: 'знал', hint: 'бы + past tense form' },
      { type: 'fill', prompt: 'Я ___ (хоте́ть) бы пое́хать в Росси́ю.', answer: 'хоте́л', hint: 'бы + past tense form of хоте́ть' },
    ] },
  { id: 'comparative', name: 'Comparative Adjectives', level: 'B1', category: 'nouns',
    scoba: `Short comparative: adjective stem + -ее/-ей
  → быстр-ее (faster), интересн-ее (more interesting)
  Analytical: бо́лее + adjective
  → бо́лее интере́сный (more interesting)
  Irregular: хоро́ший → лу́чше, плохо́й → ху́же, большо́й → бо́льше, ма́ленький → ме́ньше`,
    exercises: [
      { type: 'fill', prompt: 'Э́та кни́га ___ (интере́сный) чем та.', answer: 'интере́снее', hint: 'Comparative: stem + -ее' },
      { type: 'fill', prompt: 'Он говори́т по-ру́сски ___ (хоро́ший) чем я.', answer: 'лу́чше', hint: 'Irregular: хоро́ший → лу́чше' },
    ] },

  // ── B2 ──
  { id: 'participles', name: 'Participles (причастия)', level: 'B2', category: 'verbs',
    scoba: `Active present: -ущ-/-ющ- (1st conj), -ащ-/-ящ- (2nd conj)
  → чита́ющий (reading), говоря́щий (speaking)
  Active past: -вш- (after vowel), -ш- (after consonant)
  → прочита́вший (who had read), принёсший (who had brought)
  Passive present: -ем- (1st conj), -им- (2nd conj)
  → чита́емый (being read), люби́мый (beloved)
  Passive past: -нн-/-енн-/-т-
  → прочи́танный (read), откры́тый (opened)`,
    exercises: [
      { type: 'fill', prompt: 'Студе́нт, ___ (чита́ть — active present) кни́гу, сиде́л у окна́.', answer: 'чита́ющий', hint: '1st conj active present: -ющий' },
      { type: 'fill', prompt: 'Кни́га, ___ (прочита́ть — passive past) мной, была́ интере́сной.', answer: 'прочи́танная', hint: 'Passive past: -нная (fem agrees with кни́га)' },
    ] },
  { id: 'verbal-adverbs', name: 'Verbal Adverbs (деепричастия)', level: 'B2', category: 'verbs',
    scoba: `Imperfective verbal adverb: stem + -я/-а (simultaneous action)
  → чита́я (while reading), де́лая (while doing)
  Perfective verbal adverb: stem + -в/-вши (prior action)
  → прочита́в (having read), сде́лав (having done)`,
    exercises: [
      { type: 'fill', prompt: '___ (чита́ть — impf verbal adverb) кни́гу, он пил чай.', answer: 'Чита́я', hint: 'Imperfective: stem + -я (simultaneous)' },
      { type: 'fill', prompt: '___ (прочита́ть — pf verbal adverb) кни́гу, он лёг спать.', answer: 'Прочита́в', hint: 'Perfective: stem + -в (prior action)' },
    ] },
  { id: 'kotoryj-clauses', name: 'Relative Clauses (кото́рый)', level: 'B2', category: 'syntax',
    scoba: `кото́рый agrees in gender/number with the noun it refers to,
  but its CASE depends on its function in the relative clause:
  → Студе́нт, кото́рый чита́ет... (nominative — subject)
  → Кни́га, кото́рую я чита́ю... (accusative — direct object)
  → Друг, с кото́рым я говори́л... (instrumental — with)`,
    exercises: [
      { type: 'fill', prompt: 'Де́вушка, ___ (кото́рый) я ви́дел, — моя́ сестра́.', answer: 'кото́рую', hint: 'Direct object (ви́дел кого?) + feminine → кото́рую' },
      { type: 'fill', prompt: 'Челове́к, с ___ (кото́рый) я говори́л, — мой друг.', answer: 'кото́рым', hint: 'с + instrumental + masculine → кото́рым' },
    ] },
  { id: 'chtoby-subjunctive', name: 'Чтобы + Past Tense (Subjunctive)', level: 'B2', category: 'syntax',
    scoba: `что́бы + past tense = purpose/desire with different subjects:
  → Я хочу́, что́бы он пришёл. (I want him to come.)
  → Я сказа́л э́то, что́бы ты зна́л. (I said this so you'd know.)
  Same subject → что́бы + infinitive:
  → Я пришёл, что́бы помо́чь. (I came to help.)`,
    exercises: [
      { type: 'fill', prompt: 'Я хочу́, что́бы он ___ (прийти́).', answer: 'пришёл', hint: 'Different subjects: что́бы + past tense' },
      { type: 'fill', prompt: 'Я пришёл, что́бы ___ (помо́чь).', answer: 'помо́чь', hint: 'Same subject: что́бы + infinitive' },
    ] },

  // ── C1 ──
  { id: 'advanced-aspect', name: 'Advanced Aspect Usage', level: 'C1', category: 'verbs',
    scoba: `Aspect in negation:
  → Impf negation = "didn't do at all": Я не чита́л э́ту кни́гу.
  → Pf negation = "failed to": Я не прочита́л э́ту кни́гу.
  Aspect with начина́ть/продолжа́ть/конча́ть:
  → Always IMPERFECTIVE infinitive after these verbs
  → Он на́чал чита́ть. (NOT *на́чал прочита́ть)`,
    exercises: [
      { type: 'fill', prompt: 'Он на́чал ___ (чита́ть/прочита́ть).', answer: 'чита́ть', hint: 'After начина́ть → always imperfective' },
      { type: 'fill', prompt: 'Я не ___ (чита́ть/прочита́ть) э́ту кни́гу. (I never read it)', answer: 'чита́л', hint: 'Never did it at all → imperfective negation' },
    ] },
  { id: 'verbal-nouns', name: 'Verbal Nouns (отглагольные)', level: 'C1', category: 'nouns',
    scoba: `Verbal nouns are formed from verb stems:
  → чита́ть → чте́ние (reading)
  → писа́ть → написа́ние (writing)
  → испо́льзовать → испо́льзование (usage)
  Used in academic/formal register instead of verb clauses.`,
    exercises: [
      { type: 'fill', prompt: '___ (чита́ть — verbal noun) кни́г расширя́ет кругозо́р.', answer: 'Чте́ние', hint: 'Verbal noun of чита́ть → чте́ние' },
      { type: 'transform', prompt: 'Rewrite formally: "Когда́ мы испо́льзуем компью́тер..."', answer: 'При испо́льзовании компью́тера...', hint: 'Use verbal noun + при + prepositional' },
    ] },
  { id: 'discourse-connectors', name: 'Discourse Connectors', level: 'C1', category: 'syntax',
    scoba: `Formal connectors for academic/professional Russian:
  → тем не ме́нее (nevertheless)
  → в связи́ с (in connection with)
  → всле́дствие (as a result of)
  → несмотря́ на (despite)
  → принима́я во внима́ние (taking into account)`,
    exercises: [
      { type: 'fill', prompt: '___ (despite) трудности, он продо́лжил рабо́ту.', answer: 'Несмотря́ на', hint: 'несмотря́ на + accusative' },
      { type: 'fill', prompt: 'Он устал, ___ (nevertheless) продо́лжил рабо́тать.', answer: 'тем не ме́нее', hint: 'Formal connector for "nevertheless"' },
    ] },

  // ── C2 ──
  { id: 'bureaucratic-russian', name: 'Bureaucratic Russian (Канцелярит)', level: 'C2', category: 'syntax',
    scoba: `Official Russian features:
  → Passive constructions: "Реше́ние бы́ло при́нято" (A decision was made)
  → Nominal style: "осуществле́ние ме́р" vs "осуществля́ть ме́ры"
  → Fixed formulas: "На основа́нии вышеизло́женного..."
  → Chain genitives: "реше́ние прави́тельства стра́ны"`,
    exercises: [
      { type: 'transform', prompt: 'Rewrite in bureaucratic style: "Мы приня́ли реше́ние."', answer: 'Реше́ние бы́ло при́нято.', hint: 'Use passive construction' },
    ] },
  { id: 'colloquial-grammar', name: 'Colloquial Grammar', level: 'C2', category: 'syntax',
    scoba: `Spoken Russian shortcuts:
  → чё/чо = что (what)
  → щас = сейча́с (now)
  → ваще́ = вообще́ (in general)
  → грю = говорю́ (I say)
  → Ellipsis: "Ты ку́да?" = "Ты куда́ идёшь?"`,
    exercises: [
      { type: 'fill', prompt: 'Formal equivalent of "чё хо́чешь?"', answer: 'Что ты хо́чешь?', hint: 'чё = что (colloquial reduction)' },
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
    if (!p.sessions) p.sessions = [];
    return p;
  }

  _save(p) { saveProfile(this.dir, p); }

  setLevel(id, level) {
    const lv = level.toUpperCase();
    if (!CEFR.includes(lv)) throw new Error('Invalid CEFR level');
    const p = this.getProfile(id);
    p.level = lv;
    this._save(p);
    return { studentId: id, level: lv };
  }

  topicsForLevel(level) {
    const idx = CEFR.indexOf(level);
    return TOPICS.filter(t => CEFR.indexOf(t.level) <= idx);
  }

  generateLesson(id, topicId) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    let topic;
    if (topicId) {
      topic = TOPICS.find(t => t.id === topicId);
      if (!topic) throw new Error('Topic not found: ' + topicId);
    } else {
      const avail = this.topicsForLevel(level);
      const studied = new Set(Object.keys(p.skills));
      let fresh = avail.filter(t => !studied.has(t.id));
      if (!fresh.length) fresh = avail;
      topic = pick(fresh, 1)[0];
    }

    const exercises = pick(topic.exercises || [], 3);
    return {
      studentId: id, level, topic: { id: topic.id, name: topic.name, level: topic.level, category: topic.category },
      scoba: topic.scoba,
      exercises: exercises.map((e, i) => ({ index: i, ...e })),
    };
  }

  generateExercise(id, topicId, type) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const avail = topicId ? TOPICS.filter(t => t.id === topicId) : this.topicsForLevel(level);
    const topic = pick(avail, 1)[0];
    if (!topic) throw new Error('No topics available');
    let exercises = topic.exercises || [];
    if (type) exercises = exercises.filter(e => e.type === type);
    if (!exercises.length) exercises = topic.exercises || [];
    const ex = pick(exercises, 1)[0];
    return { studentId: id, topic: topic.id, topicName: topic.name, ...ex };
  }

  checkAnswer(topicId, index, answer) {
    const topic = TOPICS.find(t => t.id === topicId);
    if (!topic) throw new Error('Topic not found');
    const ex = (topic.exercises || [])[index];
    if (!ex) throw new Error('Exercise not found at index ' + index);
    const correct = norm(answer) === norm(ex.answer);
    return { correct, expected: ex.answer, given: answer, hint: correct ? null : ex.hint };
  }

  recordGrade(id, topicId, grade) {
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
    const interval = fsrsNextReview(sk.stability, DEFAULT_RETENTION);
    const d = new Date(); d.setDate(d.getDate() + interval);
    sk.nextReview = d.toISOString().slice(0, 10);
    sk.attempts.push({ score: grade >= 3 ? 1 : 0, total: 1, date: today() });
    p.assessments.push({ topicId, grade, date: today() });
    this._save(p);

    const m = calcMastery(sk.attempts);
    return { studentId: id, topicId, grade, mastery: masteryLabel(m), nextReview: sk.nextReview, interval };
  }

  getProgress(id) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const avail = this.topicsForLevel(level);
    const byCat = {};
    for (const t of avail) {
      if (!byCat[t.category]) byCat[t.category] = { total: 0, studied: 0, mastered: 0, items: [] };
      const cat = byCat[t.category];
      cat.total++;
      const sk = p.skills[t.id];
      const m = sk ? calcMastery(sk.attempts) : 0;
      if (sk) cat.studied++;
      if (m >= MASTERY_THRESHOLD) cat.mastered++;
      cat.items.push({ id: t.id, name: t.name, mastery: m, label: masteryLabel(m), nextReview: sk ? sk.nextReview : null });
    }
    return { studentId: id, level, categories: byCat };
  }

  getReport(id) {
    const progress = this.getProgress(id);
    const p = this.getProfile(id);
    const next = this.getNextTopics(id);
    return { ...progress, assessmentCount: p.assessments.length, recommendations: next };
  }

  getNextTopics(id, count) {
    count = count || 5;
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const avail = this.topicsForLevel(level);
    const td = today();
    const due = [];
    const fresh = [];
    for (const t of avail) {
      const sk = p.skills[t.id];
      if (!sk) { fresh.push({ id: t.id, name: t.name, reason: 'new' }); continue; }
      if (sk.nextReview && sk.nextReview <= td) {
        due.push({ id: t.id, name: t.name, reason: 'due', nextReview: sk.nextReview });
      }
    }
    return { due: due.slice(0, count), new: fresh.slice(0, count) };
  }

  getScoba(topicId) {
    const t = TOPICS.find(t => t.id === topicId);
    if (!t) throw new Error('Topic not found: ' + topicId);
    return { id: t.id, name: t.name, level: t.level, scoba: t.scoba };
  }

  listTopics(level) {
    let list = TOPICS;
    if (level) list = list.filter(t => t.level === level.toUpperCase());
    return list.map(t => ({ id: t.id, name: t.name, level: t.level, category: t.category }));
  }

  listStudents() { return listProfiles(this.dir); }
}

// ─── CLI ────────────────────────────────────────────────────────────────────

const tutor = new GrammarTutor();

runCLI((cmd, args, out) => {
  const id = args[1] || 'default';
  switch (cmd) {
    case 'start':
      out(tutor.getProfile(id));
      break;
    case 'set-level':
      out(tutor.setLevel(id, args[2] || 'A1'));
      break;
    case 'lesson':
      out(tutor.generateLesson(id, args[2]));
      break;
    case 'exercise':
      out(tutor.generateExercise(id, args[2], args[3]));
      break;
    case 'check':
      out(tutor.checkAnswer(args[2], parseInt(args[3], 10), args.slice(4).join(' ')));
      break;
    case 'record':
      out(tutor.recordGrade(id, args[2], args[3]));
      break;
    case 'progress':
      out(tutor.getProgress(id));
      break;
    case 'report':
      out(tutor.getReport(id));
      break;
    case 'next':
      out(tutor.getNextTopics(id, args[2] ? parseInt(args[2], 10) : 5));
      break;
    case 'topics':
      out(tutor.listTopics(args[2]));
      break;
    case 'scoba':
      out(tutor.getScoba(args[2] || args[1]));
      break;
    case 'students':
      out({ students: tutor.listStudents() });
      break;
    case 'help':
      out({ commands: ['start','set-level','lesson','exercise','check','record','progress','report','next','topics','scoba','students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + cmd,
        commands: ['start','set-level','lesson','exercise','check','record','progress','report','next','topics','scoba','students'],
      });
  }
});
