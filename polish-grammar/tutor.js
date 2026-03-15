#!/usr/bin/env node
// Polish Grammar Tutor — discovery-based grammar teaching with FSRS spaced repetition
'use strict';

const core = require('../_lib/core');
const { CEFR, MASTERY_THRESHOLD, DEFAULT_RETENTION,
        dataDir, loadProfile, saveProfile, listProfiles,
        calcMastery, masteryLabel,
        fsrsRetention, fsrsNextReview, fsrsUpdateStability, fsrsUpdateDifficulty,
        shuffle, pick, norm, today, runCLI } = core;

const SKILL_NAME = 'polish-grammar';

// ─── Embedded Grammar Data ──────────────────────────────────────────────────

const TOPICS = [
  // ── A1 ──
  { id: 'nominative-nouns', name: 'Nominative Case (Mianownik)', level: 'A1', category: 'cases',
    scoba: `The NOMINATIVE case is the base/dictionary form.
  → Used for: SUBJECT of the sentence
  → Question words: Kto? Co? (Who? What?)
  → Examples: Pies biegnie. Kobieta czyta. Dziecko śpi.
  → Gender recognition:
      Masculine: consonant ending (dom, kot, brat)
      Feminine: -a ending (kobieta, książka, szkoła)
      Neuter: -o/-e/-ę ending (okno, pole, imię)`,
    exercises: [
      { type: 'fill', prompt: '___ (Kto/Co) to jest? To jest książka.', answer: 'Co', hint: 'książka is a thing → Co?' },
      { type: 'fill', prompt: '___ (Kto/Co) czyta książkę? Mama czyta książkę.', answer: 'Kto', hint: 'Mama is a person → Kto?' },
      { type: 'fill', prompt: 'To jest ___ (duży/duża/duże) dom.', answer: 'duży', hint: 'dom is masculine → duży' },
      { type: 'fill', prompt: 'To jest ___ (nowy/nowa/nowe) szkoła.', answer: 'nowa', hint: 'szkoła is feminine → nowa' },
      { type: 'error', prompt: 'To jest duża dom.', answer: 'To jest duży dom.', hint: 'dom is masculine → duży' },
    ] },
  { id: 'accusative-basic', name: 'Accusative Case (Biernik) — basic', level: 'A1', category: 'cases',
    scoba: `The ACCUSATIVE case marks the DIRECT OBJECT.
  → Question: Kogo? Co? (Whom? What?)
  → Masculine ANIMATE: = genitive form (pies → psa, brat → brata)
  → Masculine INANIMATE: = nominative (stół → stół, dom → dom)
  → Feminine -a → -ę: kobieta → kobietę, książka → książkę
  → Neuter: = nominative (okno → okno, mleko → mleko)`,
    exercises: [
      { type: 'fill', prompt: 'Widzę ___ (pies).', answer: 'psa', hint: 'pies is masc. animate → genitive form = psa' },
      { type: 'fill', prompt: 'Czytam ___ (książka).', answer: 'książkę', hint: 'Feminine -a → -ę' },
      { type: 'fill', prompt: 'Mam ___ (stół).', answer: 'stół', hint: 'Masc. inanimate → no change' },
      { type: 'error', prompt: 'Lubię moja mama.', answer: 'Lubię moją mamę.', hint: 'Both adjective and noun take accusative: moja→moją, mama→mamę' },
    ] },
  { id: 'present-tense', name: 'Present Tense Conjugation', level: 'A1', category: 'verbs',
    scoba: `Three conjugation patterns:
  -ę/-esz (Type I): pisać → piszę, piszesz, pisze, piszemy, piszecie, piszą
  -ę/-isz/-ysz (Type II): robić → robię, robisz, robi, robimy, robicie, robią
  -am/-asz (Type III): czytać → czytam, czytasz, czyta, czytamy, czytacie, czytają
  KEY: być (to be) is irregular: jestem, jesteś, jest, jesteśmy, jesteście, są`,
    exercises: [
      { type: 'fill', prompt: 'Ja ___ (czytać) książkę.', answer: 'czytam', hint: 'czytać is Type III: ja → -am' },
      { type: 'fill', prompt: 'Oni ___ (robić) zadanie.', answer: 'robią', hint: 'robić is Type II: oni → -ią' },
      { type: 'fill', prompt: 'Ty ___ (pisać) list.', answer: 'piszesz', hint: 'pisać is Type I: ty → -esz (stem change: s→sz)' },
      { type: 'fill', prompt: 'My ___ (być) studentami.', answer: 'jesteśmy', hint: 'być: my → jesteśmy' },
      { type: 'error', prompt: 'Ona robi obiad i czytam książkę.', answer: 'Ona robi obiad i czyta książkę.', hint: 'Subject is ona → czyta' },
    ] },
  { id: 'negation', name: 'Negation with Genitive', level: 'A1', category: 'verbs',
    scoba: `Negation: nie + verb. BUT with mieć (have) and some other verbs:
  → Affirmative: Mam brata. (acc.)
  → Negative: Nie mam brata. (gen.!)
  → nie ma + genitive = "there is no"
  → "Nie ma chleba." (There is no bread.)`,
    exercises: [
      { type: 'fill', prompt: 'Nie mam ___ (czas).', answer: 'czasu', hint: 'Negation of mieć → genitive: czas → czasu' },
      { type: 'fill', prompt: 'Nie ma ___ (mleko).', answer: 'mleka', hint: 'nie ma + genitive: mleko → mleka' },
      { type: 'error', prompt: 'Nie mam brat.', answer: 'Nie mam brata.', hint: 'Negation → genitive: brat → brata' },
    ] },
  { id: 'adjective-agreement', name: 'Adjective Agreement (Nominative)', level: 'A1', category: 'nouns',
    scoba: `Adjectives agree with nouns in gender, number, case:
  Masculine: duży dom, nowy student
  Feminine: duża kobieta, nowa szkoła
  Neuter: duże okno, nowe pole
  Plural (non-masc-personal): duże domy/kobiety/okna
  Plural (masc-personal): duzi studenci, nowi nauczyciele`,
    exercises: [
      { type: 'fill', prompt: 'To jest ___ (dobry/dobra/dobre) kawa.', answer: 'dobra', hint: 'kawa is feminine → dobra' },
      { type: 'fill', prompt: 'To są ___ (nowy/nowi/nowe) studenci.', answer: 'nowi', hint: 'studenci is masc. personal pl. → nowi' },
      { type: 'error', prompt: 'To jest piękna dzień.', answer: 'To jest piękny dzień.', hint: 'dzień is masculine → piękny' },
    ] },
  { id: 'questions', name: 'Questions & Question Words', level: 'A1', category: 'syntax',
    scoba: `Czy...? = yes/no question: "Czy masz czas?"
  Kto? = Who? | Co? = What? | Gdzie? = Where?
  Kiedy? = When? | Jak? = How? | Dlaczego? = Why?
  Ile? = How much/many? | Jaki/jaka/jakie? = What kind?`,
    exercises: [
      { type: 'fill', prompt: '___ (Kto/Co/Gdzie) mieszkasz?', answer: 'Gdzie', hint: 'Asking about place → Gdzie?' },
      { type: 'fill', prompt: '___ masz braci?', answer: 'Ilu', hint: 'Asking "how many brothers" → Ilu (masc. personal)' },
    ] },

  // ── A2 ──
  { id: 'genitive-case', name: 'Genitive Case (Dopełniacz)', level: 'A2', category: 'cases',
    scoba: `The GENITIVE case — the most used case after nominative.
  → Functions: possession, negation, quantity, partitive, after certain prepositions
  → Question: Kogo? Czego?
  → Masculine: -a (animate), -u (inanimate, often): brata, domu
  → Feminine: -y/-i: kobiety, nocy
  → Neuter: -a: okna, mleka
  → Prepositions: do, z, od, bez, dla, koło, obok + genitive`,
    exercises: [
      { type: 'fill', prompt: 'To jest książka ___ (brat).', answer: 'brata', hint: 'Possession → genitive: brat → brata' },
      { type: 'fill', prompt: 'Idę do ___ (szkoła).', answer: 'szkoły', hint: 'do + genitive: szkoła → szkoły' },
      { type: 'fill', prompt: 'Nie mam ___ (pieniądze).', answer: 'pieniędzy', hint: 'Negation → genitive: pieniądze → pieniędzy' },
      { type: 'error', prompt: 'Idę do dom.', answer: 'Idę do domu.', hint: 'do + genitive: dom → domu' },
    ] },
  { id: 'locative-case', name: 'Locative Case (Miejscownik)', level: 'A2', category: 'cases',
    scoba: `The LOCATIVE case — always after a preposition (w, na, o, po, przy).
  → Question: O kim? O czym?
  → w domu (in the house), na stole (on the table), o bracie (about brother)
  → Masculine: -e/-u: w domu, na stole, o bracie (consonant changes!)
  → Feminine: -e/-i: w szkole, na ulicy
  → Neuter: -e/-u: w oknie, w mleku
  → Consonant alternations: k→c, g→dz, t→ci, d→dzi, r→rz, etc.`,
    exercises: [
      { type: 'fill', prompt: 'Mieszkam w ___ (Warszawa).', answer: 'Warszawie', hint: 'w + locative: Warszawa → Warszawie' },
      { type: 'fill', prompt: 'Książka jest na ___ (stół).', answer: 'stole', hint: 'na + locative: stół → stole' },
      { type: 'fill', prompt: 'Myślę o ___ (brat).', answer: 'bracie', hint: 'o + locative: brat → bracie (t→ci)' },
      { type: 'error', prompt: 'Jestem w szkoła.', answer: 'Jestem w szkole.', hint: 'w + locative: szkoła → szkole' },
    ] },
  { id: 'instrumental-case', name: 'Instrumental Case (Narzędnik)', level: 'A2', category: 'cases',
    scoba: `The INSTRUMENTAL case — used with z (with), after być, and for instruments.
  → Question: Kim? Czym?
  → After być: Jestem lekarzem. (I am a doctor.)
  → With z: z bratem (with brother), z siostrą (with sister)
  → Masculine: -em: bratem, studentem
  → Feminine: -ą: siostrą, mamą
  → Neuter: -em: oknem, dzieckiem`,
    exercises: [
      { type: 'fill', prompt: 'Jestem ___ (student).', answer: 'studentem', hint: 'After być → instrumental: student → studentem' },
      { type: 'fill', prompt: 'Idę z ___ (siostra).', answer: 'siostrą', hint: 'z + instrumental: siostra → siostrą' },
      { type: 'fill', prompt: 'Jem ___ (widelec).', answer: 'widelcem', hint: 'Instrument → instrumental: widelec → widelcem' },
      { type: 'error', prompt: 'Jestem nauczyciel.', answer: 'Jestem nauczycielem.', hint: 'After być → instrumental' },
    ] },
  { id: 'past-tense', name: 'Past Tense (Gender-Marked)', level: 'A2', category: 'verbs',
    scoba: `Polish past tense marks GENDER of the subject:
  Masculine: -łem (ja), -łeś (ty), -ł (on)
  Feminine: -łam (ja), -łaś (ty), -ła (ona)
  Neuter: -ło (ono)
  Plural masc-personal: -liśmy, -liście, -li
  Plural other: -łyśmy, -łyście, -ły
  Example: robić → robiłem/robiłam, robiłeś/robiłaś, robił/robiła`,
    exercises: [
      { type: 'fill', prompt: 'Wczoraj ___ (być, ja, fem) w kinie.', answer: 'byłam', hint: 'Feminine past: być → byłam' },
      { type: 'fill', prompt: 'On ___ (czytać) książkę.', answer: 'czytał', hint: 'Masculine 3rd person: czytać → czytał' },
      { type: 'fill', prompt: 'Oni ___ (iść) do szkoły.', answer: 'szli', hint: 'Masc. personal plural: iść → szli' },
      { type: 'error', prompt: 'Ona byłem zmęczona.', answer: 'Ona była zmęczona.', hint: 'ona → feminine: była' },
    ] },
  { id: 'aspect-intro', name: 'Verb Aspect Introduction', level: 'A2', category: 'verbs',
    scoba: `Every Polish verb has an ASPECT PAIR:
  IMPERFECTIVE (ongoing/repeated): robić, pisać, czytać
  PERFECTIVE (completed/single): zrobić, napisać, przeczytać
  → Imperfective: present tense, ongoing past, habitual
  → Perfective: completed past, future (present form = future!)
  → "Pisałem list." (I was writing a letter — imperfective)
  → "Napisałem list." (I wrote/finished the letter — perfective)`,
    exercises: [
      { type: 'fill', prompt: 'Wczoraj cały dzień ___ (pisać/napisać) raport.', answer: 'pisałem', hint: 'Duration "cały dzień" → imperfective' },
      { type: 'fill', prompt: 'W końcu ___ (pisać/napisać) ten raport!', answer: 'napisałem', hint: 'Completion "w końcu" → perfective' },
      { type: 'fill', prompt: 'Jutro ___ (czytać/przeczytać) tę książkę.', answer: 'przeczytam', hint: 'Future completion → perfective present form' },
      { type: 'error', prompt: 'Codziennie przeczytałem gazetę.', answer: 'Codziennie czytałem gazetę.', hint: 'Habitual "codziennie" → imperfective' },
    ] },
  { id: 'possessive-pronouns', name: 'Possessive Pronouns', level: 'A2', category: 'pronouns',
    scoba: `Possessive pronouns agree with the NOUN they modify:
  mój/moja/moje (my), twój/twoja/twoje (your-informal)
  jego (his — invariable), jej (her — invariable)
  nasz/nasza/nasze (our), wasz/wasza/wasze (your-plural)
  ich (their — invariable)
  Pana (your-formal-m), Pani (your-formal-f)`,
    exercises: [
      { type: 'fill', prompt: 'To jest ___ (my, fem) książka.', answer: 'moja', hint: 'książka is feminine → moja' },
      { type: 'fill', prompt: 'To jest ___ (our, masc) dom.', answer: 'nasz', hint: 'dom is masculine → nasz' },
      { type: 'error', prompt: 'To jest mój siostra.', answer: 'To jest moja siostra.', hint: 'siostra is feminine → moja' },
    ] },

  // ── B1 ──
  { id: 'dative-case', name: 'Dative Case (Celownik)', level: 'B1', category: 'cases',
    scoba: `The DATIVE case — indirect object, recipient, beneficiary.
  → Question: Komu? Czemu?
  → Masculine: -owi: bratu → bratowi, but: psu, ojcu (exceptions)
  → Feminine: -e/-i: kobiecie, mamie, siostrze
  → Neuter: -u: dziecku, oknu
  → "Dałem bratu książkę." (I gave my brother a book.)
  → "Pomogłem mamie." (I helped mom.)`,
    exercises: [
      { type: 'fill', prompt: 'Dałem ___ (brat) prezent.', answer: 'bratu', hint: 'Indirect object → dative: brat → bratu' },
      { type: 'fill', prompt: 'Pomogłem ___ (mama).', answer: 'mamie', hint: 'pomagać + dative: mama → mamie' },
      { type: 'error', prompt: 'Dałem siostra prezent.', answer: 'Dałem siostrze prezent.', hint: 'Dative: siostra → siostrze' },
    ] },
  { id: 'vocative-case', name: 'Vocative Case (Wołacz)', level: 'B1', category: 'cases',
    scoba: `The VOCATIVE case — direct address.
  → "Panie Profesorze!" (Professor!)
  → "Mamo!" (Mom!) "Kasiu!" (Kasia!)
  → Masculine: -e/-u: Panie, bracie, Marku
  → Feminine -a → -o: Mamo! Anno! Kasiu!
  → Formal: Pan → Panie, Pani stays Pani`,
    exercises: [
      { type: 'fill', prompt: '___! (Mama) Chodź tutaj!', answer: 'Mamo', hint: 'Vocative: mama → mamo' },
      { type: 'fill', prompt: 'Dzień dobry, ___ (Pan Kowalski)!', answer: 'Panie Kowalski', hint: 'Pan → Panie in vocative' },
    ] },
  { id: 'conditional-mood', name: 'Conditional Mood', level: 'B1', category: 'verbs',
    scoba: `Conditional = past tense form + by + person endings:
  Chciałbym / Chciałabym (I would like, m/f)
  Mógłbyś / Mogłabyś (You could, m/f)
  Gdybym miał/miała czas... (If I had time...)
  Person endings attach to -by-: -bym, -byś, -by, -byśmy, -byście, -by`,
    exercises: [
      { type: 'fill', prompt: '___ (chcieć, ja, masc) pojechać do Krakowa.', answer: 'Chciałbym', hint: 'Conditional: chciał + bym' },
      { type: 'fill', prompt: 'Gdybym ___ (mieć, fem) więcej czasu, pojechałabym na wakacje.', answer: 'miała', hint: 'Conditional gdybym + past fem: miała' },
      { type: 'error', prompt: 'Ja chciałbym iść na kino.', answer: 'Chciałbym iść do kina.', hint: 'Pro-drop (drop ja) + do + genitive (not na + accusative)' },
    ] },
  { id: 'motion-verbs', name: 'Motion Verbs (Determinate/Indeterminate)', level: 'B1', category: 'verbs',
    scoba: `Polish motion verbs come in pairs:
  DETERMINATE (one direction, now): iść, jechać, lecieć, biec
  INDETERMINATE (habitual, repeated): chodzić, jeździć, latać, biegać
  → "Idę do szkoły." (I'm going to school — right now)
  → "Chodzę do szkoły." (I go to school — regularly)
  → "Jadę do Krakowa." (I'm driving to Krakow — now)
  → "Jeżdżę do Krakowa." (I go/drive to Krakow — regularly)`,
    exercises: [
      { type: 'fill', prompt: 'Codziennie ___ (iść/chodzić) do pracy.', answer: 'chodzę', hint: 'Habitual "codziennie" → indeterminate: chodzę' },
      { type: 'fill', prompt: 'Teraz ___ (jechać/jeździć) do Warszawy.', answer: 'jadę', hint: 'Right now → determinate: jadę' },
    ] },
  { id: 'numbers-with-nouns', name: 'Numbers with Nouns', level: 'B1', category: 'nouns',
    scoba: `Complex number-noun agreement:
  1 → nominative singular: jeden kot
  2, 3, 4 → nominative plural: dwa/trzy/cztery koty
  5-21 → genitive plural: pięć kotów
  22-24 → nominative plural: dwadzieścia dwa koty
  25-31 → genitive plural: dwadzieścia pięć kotów
  Pattern repeats based on last digit (except 12-14).`,
    exercises: [
      { type: 'fill', prompt: 'Mam ___ (5, kot).', answer: 'pięć kotów', hint: '5 → genitive plural: pięć kotów' },
      { type: 'fill', prompt: 'Na stole są ___ (3, książka).', answer: 'trzy książki', hint: '3 → nominative plural: trzy książki' },
      { type: 'fill', prompt: 'W klasie jest ___ (22, student).', answer: 'dwudziestu dwóch studentów', hint: 'Masc. personal 22 → genitive: dwudziestu dwóch studentów' },
    ] },

  // ── B2 ──
  { id: 'participles', name: 'Participles', level: 'B2', category: 'verbs',
    scoba: `Active participle: -ący/-ąca/-ące (simultaneous)
  → "czytający mężczyzna" (the reading man)
  Passive participle: -ny/-ty (completed)
  → "napisany list" (a written letter)
  Adverbial participle -ąc (simultaneous): "Idąc do szkoły, spotkałem Annę."
  Adverbial participle -wszy (prior): "Przeczytawszy list, zadzwonił."`,
    exercises: [
      { type: 'fill', prompt: '___ (Iść) ulicą, zobaczyłem wypadek.', answer: 'Idąc', hint: 'Simultaneous action → -ąc: Idąc' },
      { type: 'fill', prompt: 'List został ___ (napisać).', answer: 'napisany', hint: 'Passive participle: napisać → napisany' },
    ] },
  { id: 'impersonal-constructions', name: 'Impersonal Constructions (-no/-to)', level: 'B2', category: 'verbs',
    scoba: `Polish impersonal past: -no/-to (no subject needed)
  → "Zrobiono to wczoraj." (It was done yesterday — lit. "one did it")
  → "Powiedziano mi." (I was told — lit. "one told me")
  → Very common in formal/official Polish.
  → Always takes accusative for the object.`,
    exercises: [
      { type: 'fill', prompt: '___ (powiedzieć) mi, żeby czekać.', answer: 'Powiedziano', hint: 'Impersonal -no: powiedzieć → powiedziano' },
      { type: 'fill', prompt: 'Tę decyzję ___ (podjąć) wczoraj.', answer: 'podjęto', hint: 'Impersonal -to: podjąć → podjęto' },
    ] },
  { id: 'masculine-personal-plural', name: 'Masculine Personal Plural', level: 'B2', category: 'nouns',
    scoba: `Groups containing at least one male → masculine personal plural:
  → Adjective: -i/-y: dobrzy studenci, mali chłopcy
  → Past tense: -li: biegali, pisali, byli
  → Demonstrative: ci (not te): ci mężczyźni
  All other plural (women, children, animals, things): non-masc-personal
  → Adjective: -e: dobre studentki, małe dzieci
  → Past tense: -ły: biegały, pisały, były
  → Demonstrative: te`,
    exercises: [
      { type: 'fill', prompt: '___ (ten) studenci są bardzo pracowici.', answer: 'Ci', hint: 'Masc. personal plural: ten → ci' },
      { type: 'fill', prompt: 'Kobiety ___ (być, past) zmęczone.', answer: 'były', hint: 'Non-masc-personal plural: być → były' },
      { type: 'error', prompt: 'Te mężczyźni biegały w parku.', answer: 'Ci mężczyźni biegali w parku.', hint: 'Masc. personal: te→ci, -ały→-ali' },
    ] },
  { id: 'complex-conditionals', name: 'Complex Conditionals', level: 'B2', category: 'verbs',
    scoba: `Unreal past conditionals:
  → Gdybym był wiedział... (If I had known...)
  → Gdyby nie deszcz, poszlibyśmy na spacer. (If not for the rain...)
  → Past conditional = gdyby + past + by + past
  → Regret: Szkoda, że nie poszedłem. / Żałuję, że...`,
    exercises: [
      { type: 'fill', prompt: 'Gdybym ___ (wiedzieć, masc) wcześniej, pomógłbym ci.', answer: 'wiedział', hint: 'Past conditional: gdybym + past masc: wiedział' },
      { type: 'transform', prompt: 'Rewrite as unreal past: "Jeśli mam czas, pomagam."', answer: 'Gdybym miał czas, pomógłbym.', hint: 'If I had time, I would have helped.' },
    ] },

  // ── C1 ──
  { id: 'advanced-aspect', name: 'Advanced Aspect Semantics', level: 'C1', category: 'verbs',
    scoba: `Advanced aspect uses with prefixes:
  Inceptive (za-): zaśpiewać (start singing), zapłakać (start crying)
  Completive (do-): doczytać (finish reading), dopić (finish drinking)
  Intensive (na- się): najeść się (eat one's fill), naczytać się (read a lot)
  Delimitative (po-): poczytać (read for a while), pospać (sleep for a while)`,
    exercises: [
      { type: 'fill', prompt: 'Po obiedzie ___ (czytać, delimitative) trochę i poszłam spać.', answer: 'poczytałam', hint: 'Delimitative po- + czytać → poczytać → poczytałam' },
      { type: 'fill', prompt: 'Dzieci ___ (jeść, intensive) i nie chciały deseru.', answer: 'najadły się', hint: 'Intensive na-się: najeść się → najadły się' },
    ] },
  { id: 'discourse-markers', name: 'Discourse Markers', level: 'C1', category: 'syntax',
    scoba: `Key Polish discourse markers for academic/formal speech:
  → właściwie (actually), w zasadzie (basically)
  → mianowicie (namely), z kolei (in turn)
  → otóż (well then/the thing is), tym samym (thereby)
  → co więcej (moreover), niemniej jednak (nevertheless)
  → innymi słowy (in other words), podsumowując (to sum up)`,
    exercises: [
      { type: 'fill', prompt: 'Problem jest złożony. ___, nie ma prostego rozwiązania.', answer: 'Innymi słowy', hint: 'Reformulation → Innymi słowy' },
      { type: 'fill', prompt: 'Plan ma wady. ___ warto go zrealizować.', answer: 'Niemniej jednak', hint: 'Concession → Niemniej jednak' },
    ] },

  // ── C2 ──
  { id: 'stylistic-inversion', name: 'Stylistic/Literary Inversion', level: 'C2', category: 'syntax',
    scoba: `Literary word order for emphasis and style:
  → "Wielki był to dzień." (Great was that day.)
  → "Piękna to historia." (Beautiful is this story.)
  → Predicate-first for dramatic effect
  → Common in journalism, literature, formal speeches`,
    exercises: [
      { type: 'transform', prompt: 'Rewrite with literary inversion: "To był wspaniały wieczór."', answer: 'Wspaniały był to wieczór.', hint: 'Predicate first for dramatic effect' },
    ] },
  { id: 'register-pan-pani', name: 'Advanced Pan/Pani System', level: 'C2', category: 'pragmatics',
    scoba: `Full Pan/Pani register mastery:
  → Pan/Pani + 3rd person singular verb
  → Państwo + 3rd person plural verb
  → Title stacking: Panie Profesorze, Pani Doktor
  → When to switch ty↔Pan/Pani: "Może przejdziemy na ty?"
  → Official letters: Szanowny Panie / Szanowna Pani
  → Ultra-formal: Szanowni Państwo`,
    exercises: [
      { type: 'fill', prompt: 'Szanowny ___ (Pan Dyrektor, vocative), piszę w sprawie...', answer: 'Panie Dyrektorze', hint: 'Vocative: Pan Dyrektor → Panie Dyrektorze' },
      { type: 'error', prompt: 'Czy Pani chcesz kawę?', answer: 'Czy Pani chce kawę?', hint: 'Pan/Pani → 3rd person verb: chce (not chcesz)' },
    ] },
];

// ─── GrammarTutor Class ─────────────────────────────────────────────────────

class GrammarTutor {
  constructor() {
    this.dir = dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(sid) {
    const p = loadProfile(this.dir, sid);
    if (!p.skills) p.skills = {};
    if (!p.sessions) p.sessions = [];
    if (!p.assessments) p.assessments = [];
    return p;
  }

  _save(p) { saveProfile(this.dir, p); }

  setLevel(sid, level) {
    const lv = level.toUpperCase();
    if (!CEFR.includes(lv)) throw new Error('Invalid level: ' + level);
    const p = this.getProfile(sid);
    p.level = lv;
    this._save(p);
    return { studentId: sid, level: lv };
  }

  // ── Topic catalog ──

  getTopicCatalog(level) {
    let list = TOPICS;
    if (level) {
      const lv = level.toUpperCase();
      list = list.filter(t => t.level === lv);
    }
    return list.map(t => ({ id: t.id, name: t.name, level: t.level, category: t.category }));
  }

  getScoba(topicId) {
    const t = TOPICS.find(x => x.id === topicId);
    if (!t) throw new Error('Topic not found: ' + topicId);
    return { id: t.id, name: t.name, level: t.level, scoba: t.scoba };
  }

  // ── Lesson generation ──

  generateLesson(sid, topicId) {
    const p = this.getProfile(sid);
    const level = p.level || 'A1';
    let topic;
    if (topicId) {
      topic = TOPICS.find(t => t.id === topicId);
      if (!topic) throw new Error('Topic not found: ' + topicId);
    } else {
      const lvTopics = TOPICS.filter(t => t.level === level);
      const seen = new Set(Object.keys(p.skills));
      const unseen = lvTopics.filter(t => !seen.has(t.id));
      topic = (unseen.length ? pick(unseen, 1) : pick(lvTopics, 1))[0];
    }

    const exercises = (topic.exercises || []).slice(0, 3);
    return {
      studentId: sid, level, topic: { id: topic.id, name: topic.name, category: topic.category },
      scoba: topic.scoba,
      exercises: exercises.map((e, i) => ({ index: i, type: e.type, prompt: e.prompt, hint: e.hint })),
    };
  }

  generateExercise(sid, topicId, type) {
    const p = this.getProfile(sid);
    const level = p.level || 'A1';
    let topic;
    if (topicId) {
      topic = TOPICS.find(t => t.id === topicId);
      if (!topic) throw new Error('Topic not found: ' + topicId);
    } else {
      const lvTopics = TOPICS.filter(t => t.level === level);
      topic = pick(lvTopics, 1)[0];
    }
    let exercises = topic.exercises || [];
    if (type) exercises = exercises.filter(e => e.type === type);
    if (!exercises.length) throw new Error('No exercises match criteria');
    const ex = pick(exercises, 1)[0];
    return { topicId: topic.id, topicName: topic.name, type: ex.type, prompt: ex.prompt, hint: ex.hint };
  }

  checkAnswer(topicId, exIndex, answer) {
    const topic = TOPICS.find(t => t.id === topicId);
    if (!topic) throw new Error('Topic not found: ' + topicId);
    const ex = topic.exercises[exIndex];
    if (!ex) throw new Error('Exercise not found at index ' + exIndex);
    const correct = norm(answer) === norm(ex.answer);
    return { topicId, exerciseIndex: exIndex, correct, expected: ex.answer, given: answer, hint: ex.hint };
  }

  // ── SRS recording ──

  recordAssessment(sid, topicId, grade) {
    grade = Number(grade);
    if (!isValidGrade(grade, 1, 4)) throw new Error('Grade must be 1-4');
    const p = this.getProfile(sid);
    const topic = TOPICS.find(t => t.id === topicId);
    if (!topic) throw new Error('Unknown topic: ' + topicId);

    if (!p.skills[topicId]) {
      p.skills[topicId] = { difficulty: 5, stability: 1, lastReview: null, nextReview: null, attempts: [] };
    }
    const sk = p.skills[topicId];
    sk.stability = fsrsUpdateStability(sk.stability || 1, sk.difficulty || 5, grade);
    sk.difficulty = fsrsUpdateDifficulty(sk.difficulty || 5, grade);
    sk.lastReview = today();
    const interval = fsrsNextReview(sk.stability);
    const d = new Date(); d.setDate(d.getDate() + interval);
    sk.nextReview = d.toISOString().slice(0, 10);
    sk.attempts.push({ date: today(), grade, score: grade >= 3 ? 1 : 0, total: 1 });

    p.assessments.push({ topicId, grade, date: today() });
    this._save(p);
    return { studentId: sid, topicId, grade, stability: sk.stability, difficulty: sk.difficulty, nextReview: sk.nextReview, interval };
  }

  // ── Progress & reports ──

  getProgress(sid) {
    const p = this.getProfile(sid);
    const level = p.level || 'A1';
    const lvTopics = TOPICS.filter(t => t.level === level);
    const progress = {};
    for (const t of lvTopics) {
      const sk = p.skills[t.id];
      progress[t.id] = {
        name: t.name, category: t.category,
        mastery: sk ? calcMastery(sk.attempts) : 0,
        label: sk ? masteryLabel(calcMastery(sk.attempts)) : 'not-started',
        nextReview: sk ? sk.nextReview : null,
      };
    }
    return { studentId: sid, level, topics: progress };
  }

  getReport(sid) {
    const p = this.getProfile(sid);
    const progress = this.getProgress(sid);
    const next = this.getNextTopics(sid);
    return { studentId: sid, level: p.level, createdAt: p.createdAt, progress: progress.topics, recommendations: next };
  }

  getNextTopics(sid, count) {
    count = count || 5;
    const p = this.getProfile(sid);
    const level = p.level || 'A1';
    const td = today();
    const due = [];
    const fresh = [];
    for (const t of TOPICS.filter(x => x.level === level)) {
      const sk = p.skills[t.id];
      if (!sk) { fresh.push({ id: t.id, name: t.name, reason: 'new' }); continue; }
      if (sk.nextReview && sk.nextReview <= td) {
        due.push({ id: t.id, name: t.name, reason: 'due', nextReview: sk.nextReview });
      }
    }
    return { studentId: sid, level, due: due.slice(0, count), new: fresh.slice(0, count) };
  }

  listStudents() { return listProfiles(this.dir); }
}

// ─── CLI ────────────────────────────────────────────────────────────────────

{
  const tutor = new GrammarTutor();

  runCLI((cmd, args, out) => {
    const sid = args[1] || 'default';
    switch (cmd) {
      case 'start':
        if (!sid) throw new Error('Usage: start <studentId>');
        out(tutor.getProfile(sid));
        break;
      case 'set-level':
        if (!args[2]) throw new Error('Usage: set-level <studentId> <level>');
        out(tutor.setLevel(sid, args[2]));
        break;
      case 'lesson':
        out(tutor.generateLesson(sid, args[2] || null));
        break;
      case 'exercise':
        out(tutor.generateExercise(sid, args[2] || null, args[3] || null));
        break;
      case 'check':
        if (!args[1] || !args[2] || !args[3]) throw new Error('Usage: check <topicId> <exerciseIndex> <answer>');
        out(tutor.checkAnswer(args[1], Number(args[2]), args.slice(3).join(' ')));
        break;
      case 'record':
        if (!args[2] || !args[3]) throw new Error('Usage: record <studentId> <topicId> <grade>');
        out(tutor.recordAssessment(sid, args[2], Number(args[3])));
        break;
      case 'progress':
        out(tutor.getProgress(sid));
        break;
      case 'report':
        out(tutor.getReport(sid));
        break;
      case 'next':
        out(tutor.getNextTopics(sid, args[2] ? Number(args[2]) : 5));
        break;
      case 'topics':
        out(tutor.getTopicCatalog(args[1] || null));
        break;
      case 'scoba':
        if (!args[1]) throw new Error('Usage: scoba <topicId>');
        out(tutor.getScoba(args[1]));
        break;
      case 'students':
        out({ students: tutor.listStudents() });
        break;
      case 'help':
        out({ info: 'Use one of the commands listed in SKILL.md' });
        break;
      default:
        out({
          commands: {
            'start <studentId>': 'Load or create a student profile',
            'set-level <studentId> <level>': 'Set CEFR level (A1-C2)',
            'lesson <studentId> [topicId]': 'Generate a full lesson with SCOBA + exercises',
            'exercise <studentId> [topicId] [type]': 'Generate a single exercise',
            'check <topicId> <exerciseIndex> <answer>': 'Check an answer',
            'record <studentId> <topicId> <grade>': 'Record assessment (1=Again 2=Hard 3=Good 4=Easy)',
            'progress <studentId>': 'View progress for current level',
            'report <studentId>': 'Full student report with category breakdown',
            'next <studentId> [count]': 'Get next recommended topics',
            'topics [level]': 'List all grammar topics, optionally filtered by level',
            'scoba <topicId>': 'Show the SCOBA decision flowchart for a topic',
            'students': 'List all student profiles',
          },
        });
    }
  });
}

module.exports = { GrammarTutor, TOPICS };
