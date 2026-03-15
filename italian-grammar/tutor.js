#!/usr/bin/env node
// Italian Grammar Tutor — discovery-based grammar teaching with FSRS spaced repetition
'use strict';

const SKILL_NAME = 'italian-grammar';

const core = require('../_lib/core');
const { CEFR, MASTERY_THRESHOLD, DEFAULT_RETENTION,
        dataDir, loadProfile, saveProfile, listProfiles,
        calcMastery, masteryLabel,
        fsrsRetention, fsrsNextReview, fsrsUpdateStability, fsrsUpdateDifficulty,
        shuffle, pick, norm, today, runCLI } = core;

// ─── Embedded Grammar Data ──────────────────────────────────────────────────

const TOPICS = [
  // ── A1 ──
  { id: 'articles-definite', name: 'Articoli determinativi (il/lo/la/l\'/i/gli/le)', level: 'A1', category: 'articles',
    scoba: `The noun starts with:
  → s + consonant (studente), z, gn, ps, x, y, i+vowel?
      → Masculine singular: LO  → Plural: GLI
  → Vowel?
      → Masculine singular: L'  → Plural: GLI
      → Feminine singular: L'   → Plural: LE
  → Regular consonant?
      → Masculine singular: IL  → Plural: I
      → Feminine singular: LA   → Plural: LE
Examples: il libro/i libri, lo studente/gli studenti, l'uomo/gli uomini, la casa/le case, l'amica/le amiche`,
    exercises: [
      { type: 'fill', prompt: '___ studente è bravo.', answer: 'lo', hint: 's + consonant → lo' },
      { type: 'fill', prompt: '___ amico di Marco è simpatico.', answer: "l'", hint: 'Masculine vowel → l\'' },
      { type: 'fill', prompt: '___ zaino è pesante.', answer: 'lo', hint: 'z → lo' },
      { type: 'error', prompt: 'Il studente studia molto.', answer: 'Lo studente studia molto.', hint: 's + consonant → lo, not il' },
    ] },
  { id: 'articles-indefinite', name: 'Articoli indeterminativi (un/uno/una/un\')', level: 'A1', category: 'articles',
    scoba: `Masculine:
  → s+cons, z, gn, ps, x, y, i+vowel? → UNO (uno studente, uno zaino)
  → Otherwise → UN (un libro, un amico — NO apostrophe!)
Feminine:
  → Before vowel → UN' (un'amica — WITH apostrophe)
  → Before consonant → UNA (una casa, una studentessa)
CRITICAL: un amico (NO apostrophe) vs un'amica (WITH apostrophe)`,
    exercises: [
      { type: 'fill', prompt: 'Ho ___ amica italiana.', answer: "un'", hint: 'Feminine + vowel → un\' (with apostrophe)' },
      { type: 'fill', prompt: 'Marco è ___ studente.', answer: 'uno', hint: 's + consonant → uno' },
      { type: 'fill', prompt: 'Cerco ___ amico per giocare.', answer: 'un', hint: 'Masculine + vowel → un (NO apostrophe)' },
      { type: 'error', prompt: "Ho un amica italiana.", answer: "Ho un'amica italiana.", hint: 'Feminine + vowel needs apostrophe → un\'' },
    ] },
  { id: 'essere-avere-present', name: 'Essere e avere al presente', level: 'A1', category: 'verbs',
    scoba: `ESSERE (to be): sono, sei, è, siamo, siete, sono
AVERE (to have): ho, hai, ha, abbiamo, avete, hanno
Key uses:
  → ESSERE: identity, nationality, profession, location, description
    "Sono italiano." "Maria è a Roma." "Siamo stanchi."
  → AVERE: possession, age, physical states
    "Ho un gatto." "Hai vent'anni." "Ha fame."
  → AVERE for sensations: fame, sete, freddo, caldo, sonno, paura, ragione, torto`,
    exercises: [
      { type: 'fill', prompt: 'Io ___ (essere) studente.', answer: 'sono', hint: 'Identity → essere, first person' },
      { type: 'fill', prompt: 'Lei ___ (avere) trent\'anni.', answer: 'ha', hint: 'Age → avere, third person' },
      { type: 'fill', prompt: 'Noi ___ (avere) fame.', answer: 'abbiamo', hint: 'Physical state (fame) → avere' },
      { type: 'error', prompt: 'Io sono vent\'anni.', answer: 'Io ho vent\'anni.', hint: 'Age uses avere, not essere' },
    ] },
  { id: 'present-regular', name: 'Verbi regolari al presente (-are/-ere/-ire)', level: 'A1', category: 'verbs',
    scoba: `-ARE (parlare): parlo, parli, parla, parliamo, parlate, parlano
-ERE (scrivere): scrivo, scrivi, scrive, scriviamo, scrivete, scrivono
-IRE (sentire): sento, senti, sente, sentiamo, sentite, sentono
-IRE with -isc- (finire): finisco, finisci, finisce, finiamo, finite, finiscono
  → -isc- verbs: capire, preferire, pulire, spedire, costruire`,
    exercises: [
      { type: 'fill', prompt: 'Io ___ (parlare) italiano.', answer: 'parlo', hint: '-are: -o for io' },
      { type: 'fill', prompt: 'Tu ___ (scrivere) una lettera.', answer: 'scrivi', hint: '-ere: -i for tu' },
      { type: 'fill', prompt: 'Lei ___ (capire) tutto.', answer: 'capisce', hint: '-ire with -isc-: capisce for lei' },
      { type: 'fill', prompt: 'Noi ___ (finire) il lavoro.', answer: 'finiamo', hint: '-isc- drops for noi/voi: finiamo' },
    ] },
  { id: 'adjective-agreement', name: 'Accordo degli aggettivi', level: 'A1', category: 'agreement',
    scoba: `4-form adjectives (-o/-a/-i/-e):
  il ragazzo alto → la ragazza alta → i ragazzi alti → le ragazze alte
2-form adjectives (-e/-i):
  il ragazzo intelligente → la ragazza intelligente
  i ragazzi intelligenti → le ragazze intelligenti
Position: usually AFTER noun (la macchina rossa)
  Before noun: bello, buono, grande, piccolo, brutto, giovane, vecchio
  bello/buono follow article pattern: bel libro, buon amico, bell'idea`,
    exercises: [
      { type: 'fill', prompt: 'Le ragazze sono molt___ simpatic___.', answer: 'o e', hint: 'Feminine plural → molto → molte? No: molto is adverb (invariable). simpatiche (f.pl.)' },
      { type: 'fill', prompt: 'Un ___ (bello) giorno di sole.', answer: 'bel', hint: 'bello before consonant → bel (follows article pattern)' },
      { type: 'error', prompt: 'La casa è molto grande e bello.', answer: 'La casa è molto grande e bella.', hint: 'casa is feminine → bella, not bello' },
    ] },
  { id: 'possessives', name: 'Aggettivi possessivi con articolo', level: 'A1', category: 'determiners',
    scoba: `Possessives REQUIRE the article (unlike Spanish/English):
  il mio libro, la mia casa, i miei libri, le mie case
  il tuo, la tua, i tuoi, le tue
  il suo, la sua, i suoi, le sue (his/her/formal your)
  il nostro, la nostra, i nostri, le nostre
  il vostro, la vostra, i vostri, le vostre
  il loro, la loro, i loro, le loro (invariable)
EXCEPTION: Family members SINGULAR without article:
  mio padre, mia madre, mio fratello, mia sorella
  BUT: il mio papà, la mia mamma (affectionate), i miei fratelli (plural)`,
    exercises: [
      { type: 'fill', prompt: '___ ___ (my) madre è italiana.', answer: 'mia', hint: 'Family singular = no article: mia madre' },
      { type: 'fill', prompt: 'Dove sono ___ ___ (your, informal) libri?', answer: 'i tuoi', hint: 'Non-family plural → article + possessive: i tuoi libri' },
      { type: 'error', prompt: 'La mia sorella si chiama Anna.', answer: 'Mia sorella si chiama Anna.', hint: 'Family singular: no article → mia sorella' },
    ] },
  { id: 'preposizioni-semplici', name: 'Preposizioni semplici', level: 'A1', category: 'prepositions',
    scoba: `a = to, at, in (place): Vado a Roma. Sono a casa.
di = of, from, about: Il libro di Marco. Sono di Milano.
da = from, since, at (someone's): Vengo da Napoli. Vado dal dottore.
in = in, to (countries, regions, means): Vivo in Italia. Vado in treno.
con = with: Vado con Marco. Caffè con latte.
su = on, about: Il libro è su tavolo. Un articolo su Dante.
per = for, through, by: Un regalo per te. Passo per il centro.
tra/fra = between, among, in (time): Tra un'ora. Fra Roma e Napoli.`,
    exercises: [
      { type: 'fill', prompt: 'Vado ___ Roma domani.', answer: 'a', hint: 'To a city → a' },
      { type: 'fill', prompt: 'Il libro ___ Marco è interessante.', answer: 'di', hint: 'Possession → di' },
      { type: 'fill', prompt: 'Vengo ___ Napoli.', answer: 'da', hint: 'From (origin/coming from) → da' },
    ] },
  { id: 'preposizioni-articolate', name: 'Preposizioni articolate', level: 'A1', category: 'prepositions',
    scoba: `Preposition + article merge into one word:
       il    lo    la    l'    i     gli   le
  di → del   dello della dell' dei   degli delle
  a  → al    allo  alla  all'  ai    agli  alle
  da → dal   dallo dalla dall' dai   dagli dalle
  in → nel   nello nella nell' nei   negli nelle
  su → sul   sullo sulla sull' sui   sugli sulle
  con/per/tra/fra do NOT combine: con il, per la, tra i`,
    exercises: [
      { type: 'fill', prompt: 'Vado ___ (a + il) cinema.', answer: 'al', hint: 'a + il = al' },
      { type: 'fill', prompt: 'Il libro è ___ (su + il) tavolo.', answer: 'sul', hint: 'su + il = sul' },
      { type: 'fill', prompt: 'Vengo ___ (da + la) stazione.', answer: 'dalla', hint: 'da + la = dalla' },
      { type: 'error', prompt: 'Vado a il cinema stasera.', answer: 'Vado al cinema stasera.', hint: 'a + il must merge → al' },
    ] },

  // ── A2 ──
  { id: 'passato-prossimo-avere', name: 'Passato prossimo con avere', level: 'A2', category: 'verbs',
    scoba: `avere (present) + past participle:
  -are → -ato: parlare → parlato (ho parlato)
  -ere → -uto: vendere → venduto (ho venduto)
  -ire → -ito: finire → finito (ho finito)
Common irregulars: fatto (fare), scritto (scrivere), letto (leggere),
  detto (dire), visto (vedere), preso (prendere), aperto (aprire),
  messo (mettere), chiuso (chiudere), risposto (rispondere)`,
    exercises: [
      { type: 'fill', prompt: 'Ieri io ___ (mangiare) una pizza.', answer: 'ho mangiato', hint: 'Avere + -ato' },
      { type: 'fill', prompt: 'Tu ___ (scrivere) una lettera.', answer: 'hai scritto', hint: 'Irregular: scrivere → scritto' },
      { type: 'fill', prompt: 'Lei ___ (leggere) il giornale.', answer: 'ha letto', hint: 'Irregular: leggere → letto' },
    ] },
  { id: 'passato-prossimo-essere', name: 'Passato prossimo con essere', level: 'A2', category: 'verbs',
    scoba: `essere (present) + past participle (AGREES with subject):
  Verbs of motion/change: andare, venire, partire, arrivare, uscire,
    entrare, tornare, nascere, morire, crescere, diventare, restare
  State verbs: essere, stare, rimanere, sembrare, piacere
  Reflexives: alzarsi, lavarsi, vestirsi
Agreement: -o (m.sg), -a (f.sg), -i (m.pl), -e (f.pl)
  "Marco è andato." "Maria è andata." "Loro sono andati/e."`,
    exercises: [
      { type: 'fill', prompt: 'Maria ___ (andare) a Roma.', answer: 'è andata', hint: 'Andare uses essere + feminine agreement → è andata' },
      { type: 'fill', prompt: 'I ragazzi ___ (partire) ieri.', answer: 'sono partiti', hint: 'Partire uses essere + masculine plural → sono partiti' },
      { type: 'error', prompt: 'Maria ha andato al cinema.', answer: 'Maria è andata al cinema.', hint: 'Andare uses essere, not avere; agree with feminine → andata' },
    ] },
  { id: 'imperfetto', name: 'Imperfetto', level: 'A2', category: 'verbs',
    scoba: `Formation: stem + -avo/-avi/-ava/-avamo/-avate/-avano (1st conj.)
  parlare → parlavo, parlavi, parlava, parlavamo, parlavate, parlavano
  scrivere → scrivevo, scrivevi, scriveva...
  sentire → sentivo, sentivi, sentiva...
Irregulars: essere (ero, eri, era, eravamo, eravate, erano),
  fare (facevo), dire (dicevo), bere (bevevo)
Uses: habitual past, background/description, ongoing past action`,
    exercises: [
      { type: 'fill', prompt: 'Da bambino ___ (giocare) sempre all\'aperto.', answer: 'giocavo', hint: 'Habitual past → imperfetto' },
      { type: 'fill', prompt: 'Quando ___ (essere) piccola, vivevo a Roma.', answer: 'ero', hint: 'Essere imperfetto: ero' },
      { type: 'fill', prompt: '___ (fare) bello e gli uccelli cantavano.', answer: 'faceva', hint: 'Background description → imperfetto; fare → faceva' },
    ] },
  { id: 'futuro-semplice', name: 'Futuro semplice', level: 'A2', category: 'verbs',
    scoba: `Formation: infinitive + -ò, -ai, -à, -emo, -ete, -anno
  parlare → parlerò, parlerai, parlerà, parleremo, parlerete, parleranno
  (-are verbs change -a- to -e-)
Irregular stems: essere → sar-, avere → avr-, andare → andr-, fare → far-,
  venire → verr-, potere → potr-, dovere → dovr-, volere → vorr-,
  vedere → vedr-, sapere → sapr-, vivere → vivr-`,
    exercises: [
      { type: 'fill', prompt: 'Domani ___ (andare, io) al mare.', answer: 'andrò', hint: 'Andare irregular stem: andr- + -ò' },
      { type: 'fill', prompt: 'L\'anno prossimo ___ (essere, noi) in Italia.', answer: 'saremo', hint: 'Essere irregular stem: sar- + -emo' },
      { type: 'fill', prompt: 'Quando ___ (venire, tu) a trovarmi?', answer: 'verrai', hint: 'Venire irregular stem: verr- + -ai' },
    ] },
  { id: 'pronomi-diretti', name: 'Pronomi diretti', level: 'A2', category: 'pronouns',
    scoba: `mi (me), ti (you), lo (him/it m.), la (her/it f.), La (you formal)
ci (us), vi (you pl.), li (them m.), le (them f.)
Position: BEFORE conjugated verb: "Lo vedo." "La compro."
With infinitive: attached to end: "Voglio vederlo." = "Lo voglio vedere."
With passato prossimo + avere: participle agrees with lo/la/li/le:
  "La mela? L'ho mangiata." "I libri? Li ho comprati."`,
    exercises: [
      { type: 'fill', prompt: 'Vedi Marco? Sì, ___ vedo.', answer: 'lo', hint: 'Marco = masculine → lo' },
      { type: 'fill', prompt: 'Compri le mele? Sì, ___ compro.', answer: 'le', hint: 'Le mele = feminine plural → le' },
      { type: 'fill', prompt: 'Hai visto Maria? Sì, ___ ho vist___.', answer: "l' a", hint: 'la → l\' before ho; participle agrees: vista' },
    ] },
  { id: 'verbi-riflessivi', name: 'Verbi riflessivi', level: 'A2', category: 'verbs',
    scoba: `mi, ti, si, ci, vi, si + verb:
  alzarsi: mi alzo, ti alzi, si alza, ci alziamo, vi alzate, si alzano
Passato prossimo: ALWAYS with essere (participle agrees):
  "Mi sono alzato/a." "Si è lavata." "Ci siamo divertiti."
Common: alzarsi, svegliarsi, lavarsi, vestirsi, sentirsi, divertirsi,
  arrabbiarsi, preoccuparsi, chiamarsi, trovarsi`,
    exercises: [
      { type: 'fill', prompt: 'La mattina ___ (alzarsi, io) alle sette.', answer: 'mi alzo', hint: 'Reflexive: mi + alzo' },
      { type: 'fill', prompt: 'Maria ___ (divertirsi) molto alla festa.', answer: 'si è divertita', hint: 'Reflexive passato prossimo: si è + agrees with feminine → divertita' },
      { type: 'error', prompt: 'Mi ho alzato presto.', answer: 'Mi sono alzato presto.', hint: 'Reflexives use essere, not avere' },
    ] },

  // ── B1 ──
  { id: 'pp-vs-imperfetto', name: 'Passato prossimo vs imperfetto', level: 'B1', category: 'verbs',
    scoba: `Is the action a COMPLETED, DEFINED event in the past?
  → YES → Passato prossimo: "Ho mangiato una mela."
  → NO → Was it a HABITUAL or REPEATED action?
            → YES → Imperfetto: "Mangiavo una mela ogni giorno."
            → NO → Was it a DESCRIPTION, BACKGROUND, or STATE?
                      → YES → Imperfetto: "Faceva bello."
                      → NO → Passato prossimo (default for events)
Key pattern: imperfetto = background/ongoing, pp = foreground/interruption
  "Mangiavo (background) quando il telefono ha suonato (interruption)."`,
    exercises: [
      { type: 'fill', prompt: 'Ieri ___ (piovere) quando ___ (uscire, io) di casa.', answer: 'pioveva sono uscito', hint: 'Background (rain) → imperfetto; event (going out) → pp' },
      { type: 'fill', prompt: 'Da bambino ___ (andare) a scuola a piedi ogni giorno.', answer: 'andavo', hint: 'Habitual past → imperfetto' },
      { type: 'fill', prompt: 'Ieri sera ___ (cenare, noi) al ristorante.', answer: 'abbiamo cenato', hint: 'Single completed event → passato prossimo' },
      { type: 'error', prompt: 'Ieri ho piovuto tutto il giorno.', answer: 'Ieri pioveva tutto il giorno.', hint: 'Ongoing weather = background → imperfetto; also piovere uses essere/impersonal' },
    ] },
  { id: 'congiuntivo-presente', name: 'Congiuntivo presente', level: 'B1', category: 'verbs',
    scoba: `Main clause expresses:
  WILL/DESIRE (volere che, desiderare che)?
  EMOTION (essere contento che, avere paura che)?
  DOUBT/UNCERTAINTY (dubitare che, è possibile che)?
  NECESSITY (bisogna che, è necessario che)?
  OPINION (pensare che, credere che)?
    → YES → CONGIUNTIVO: "Bisogna che tu venga."
  CERTAINTY/DECLARATION (so che, è certo che)?
    → INDICATIVE: "So che viene."
  Conjunction requires it (benché, sebbene, affinché, a meno che, prima che)?
    → CONGIUNTIVO: "Benché piova..."
Note: "penso che" ALWAYS takes congiuntivo in Italian`,
    exercises: [
      { type: 'fill', prompt: 'Voglio che tu ___ (venire) alla festa.', answer: 'venga', hint: 'Volere che → congiuntivo' },
      { type: 'fill', prompt: 'Penso che lui ___ (essere) simpatico.', answer: 'sia', hint: 'Pensare che → congiuntivo; essere → sia' },
      { type: 'fill', prompt: 'Bisogna che voi ___ (studiare) di più.', answer: 'studiate', hint: 'Bisogna che → congiuntivo' },
      { type: 'error', prompt: 'Penso che viene domani.', answer: 'Penso che venga domani.', hint: 'Pensare che requires congiuntivo → venga' },
    ] },
  { id: 'condizionale-presente', name: 'Condizionale presente', level: 'B1', category: 'verbs',
    scoba: `Formation: infinitive + -ei, -esti, -ebbe, -emmo, -este, -ebbero
  parlare → parlerei; scrivere → scriverei; finire → finirei
  (-are changes -a- to -e-)
Irregular stems: same as futuro (sar-, avr-, andr-, far-, verr-, potr-...)
Uses: polite requests (vorrei), advice (dovresti), hypothetical
  "Vorrei un caffè." "Dovresti studiare di più."
  "Se avessi tempo, viaggerei."`,
    exercises: [
      { type: 'fill', prompt: '___ (volere, io) un cappuccino, per favore.', answer: 'vorrei', hint: 'Polite request → condizionale; volere → vorrei' },
      { type: 'fill', prompt: 'Se avessi tempo, ___ (viaggiare, io) per il mondo.', answer: 'viaggerei', hint: 'Hypothetical → condizionale' },
      { type: 'fill', prompt: 'Tu ___ (dovere) parlare con lui.', answer: 'dovresti', hint: 'Advice → condizionale; dovere → dovresti' },
    ] },
  { id: 'pronomi-relativi', name: 'Pronomi relativi', level: 'B1', category: 'pronouns',
    scoba: `che = who/which/that (subject or direct object):
  "La ragazza che parla è Maria." "Il libro che ho letto è bello."
cui = whom/which (after preposition):
  "La persona di cui parlo..." "La città in cui vivo..."
il quale/la quale/i quali/le quali = which/who (formal, after prepositions):
  "La ragione per la quale sono qui..."
chi = he/she who, whoever: "Chi dorme non piglia pesci."`,
    exercises: [
      { type: 'fill', prompt: 'Il film ___ ho visto ieri era bello.', answer: 'che', hint: 'Direct object relative → che' },
      { type: 'fill', prompt: 'La persona di ___ parlo è il mio professore.', answer: 'cui', hint: 'After preposition → cui' },
      { type: 'fill', prompt: '___ dorme non piglia pesci.', answer: 'chi', hint: 'He who / whoever → chi' },
    ] },
  { id: 'doppi-pronomi', name: 'Doppi pronomi', level: 'B1', category: 'pronouns',
    scoba: `When indirect + direct pronouns combine:
  mi + lo/la/li/le → me lo, me la, me li, me le
  ti + lo → te lo, te la, te li, te le
  gli/le + lo → glielo, gliela, glieli, gliele (written as ONE word)
  ci + lo → ce lo, ce la, ce li, ce le
  vi + lo → ve lo, ve la, ve li, ve le
Order: INDIRECT first, then DIRECT
  "Me lo dai?" (Will you give it to me?)
  "Gliel'ho detto." (I told it to him/her.)`,
    exercises: [
      { type: 'fill', prompt: 'Puoi dare il libro a Marco? Sì, ___ do subito.', answer: 'glielo', hint: 'gli (to him) + lo (it) = glielo' },
      { type: 'fill', prompt: 'Hai detto la verità a Maria? Sì, ___ ho dett___.', answer: "gliel' a", hint: 'glie + la → gliel\' + detta (agreement with la)' },
      { type: 'fill', prompt: 'Mi dai le chiavi? Sì, ___ ___ do.', answer: 'te le', hint: 'ti → te + le = te le' },
    ] },
  { id: 'stare-gerundio', name: 'Stare + gerundio (progressivo)', level: 'B1', category: 'verbs',
    scoba: `stare (conjugated) + gerund (-ando/-endo):
  parlare → parlando; scrivere → scrivendo; finire → finendo
  Irregular: fare → facendo, dire → dicendo, bere → bevendo
Present: "Sto mangiando." (I am eating.)
Imperfetto: "Stavo parlando." (I was speaking.)
More restricted than English -ing: ONLY for actions in progress NOW
  NOT: "Domani sto andando..." → "Domani vado..."`,
    exercises: [
      { type: 'fill', prompt: 'Che cosa ___ (stare + fare) adesso?', answer: 'stai facendo', hint: 'stare present + fare gerund = stai facendo' },
      { type: 'fill', prompt: '___ (stare + parlare, io) al telefono quando sei arrivato.', answer: 'stavo parlando', hint: 'stare imperfetto + gerund' },
      { type: 'error', prompt: 'Domani sto andando a Roma.', answer: 'Domani vado a Roma.', hint: 'Stare + gerundio only for NOW, not future plans' },
    ] },

  // ── B2 ──
  { id: 'congiuntivo-avanzato', name: 'Congiuntivo (avanzato)', level: 'B2', category: 'verbs',
    scoba: `Conjunctions ALWAYS requiring congiuntivo:
  benché, sebbene, nonostante (che), malgrado
  affinché, perché (= so that), a meno che (non)
  prima che, senza che, a patto che, purché
Congiuntivo imperfetto (se + hypothesis):
  "Se avessi tempo, viaggerei." (If I had time, I would travel.)
  Formation: -assi, -assi, -asse, -assimo, -aste, -assero (-are)
Congiuntivo vs indicativo:
  "Penso che sia..." (opinion → congiuntivo)
  "So che è..." (certainty → indicativo)`,
    exercises: [
      { type: 'fill', prompt: 'Benché ___ (piovere), esco lo stesso.', answer: 'piova', hint: 'Benché always → congiuntivo' },
      { type: 'fill', prompt: 'Se ___ (avere, io) più soldi, comprerei una casa.', answer: 'avessi', hint: 'Se + hypothesis → congiuntivo imperfetto' },
      { type: 'fill', prompt: 'A meno che non ___ (esserci) problemi, parto domani.', answer: 'ci siano', hint: 'A meno che non → congiuntivo' },
    ] },
  { id: 'periodo-ipotetico', name: 'Periodo ipotetico (tutti i tipi)', level: 'B2', category: 'syntax',
    scoba: `Type 1 (realtà): se + presente → presente/futuro
  "Se piove, resto a casa." "Se studi, passerai l'esame."
Type 2 (possibilità): se + congiuntivo imperfetto → condizionale presente
  "Se avessi tempo, viaggerei."
Type 3 (irrealtà passata): se + congiuntivo trapassato → condizionale passato
  "Se avessi studiato, avrei passato l'esame."
Mixed: se + trapassato → condizionale presente (past cause, present result)
  "Se avessi studiato medicina, sarei dottore adesso."`,
    exercises: [
      { type: 'fill', prompt: 'Se ___ (piovere), resterò a casa.', answer: 'piove', hint: 'Type 1 (real) → se + presente' },
      { type: 'fill', prompt: 'Se ___ (potere, io), verrei alla festa.', answer: 'potessi', hint: 'Type 2 → se + congiuntivo imperfetto' },
      { type: 'fill', prompt: 'Se avessi studiato, ___ (passare) l\'esame.', answer: 'avrei passato', hint: 'Type 3 → condizionale passato' },
      { type: 'error', prompt: 'Se avrei tempo, viaggerei.', answer: 'Se avessi tempo, viaggerei.', hint: 'Se clause → never condizionale; use congiuntivo imperfetto' },
    ] },
  { id: 'passato-remoto', name: 'Passato remoto', level: 'B2', category: 'verbs',
    scoba: `Regional/register context:
  Southern Italian daily speech?
    → Passato remoto for ALL past events: "Ieri mangiai..."
  Northern Italian speech?
    → Passato prossimo for ALL past events: "Ieri ho mangiato..."
  Standard/written Italian?
    → Recent or still-relevant → pp: "Stamattina ho mangiato..."
    → Distant past or narrative → remoto: "Nel 1492 Colombo scoprì..."
  Literary/formal writing?
    → Default to passato remoto for narration
Regular: parlai, parlasti, parlò, parlammo, parlaste, parlarono
Key irregulars: fui, ebbi, feci, dissi, scrissi, lessi, presi, misi, vissi`,
    exercises: [
      { type: 'fill', prompt: 'Dante ___ (scrivere) la Divina Commedia nel XIV secolo.', answer: 'scrisse', hint: 'Historical/literary → passato remoto; scrivere → scrisse' },
      { type: 'fill', prompt: 'Colombo ___ (scoprire) l\'America nel 1492.', answer: 'scoprì', hint: 'Historical event → passato remoto' },
      { type: 'fill', prompt: 'Garibaldi ___ (essere) un eroe del Risorgimento.', answer: 'fu', hint: 'essere → fu (passato remoto)' },
    ] },
  { id: 'accordo-participio', name: 'Accordo del participio passato', level: 'B2', category: 'agreement',
    scoba: `With ESSERE: always agrees with subject
  "Maria è partita." "I ragazzi sono andati."
With AVERE + preceding direct object pronoun: agrees
  "La mela? L'ho mangiata." "I libri? Li ho comprati."
  "Le ragazze che ho visto/viste." (with "che" → optional in modern Italian)
With AVERE + NO preceding pronoun: NO agreement
  "Ho mangiato la mela." (NOT "mangiata")
Reflexive verbs: follow essere rules
  "Maria si è lavata." "Si sono guardati."`,
    exercises: [
      { type: 'fill', prompt: 'Le lettere? Le ho ___ (scrivere) ieri.', answer: 'scritte', hint: 'Le (f.pl.) preceding → agrees: scritte' },
      { type: 'fill', prompt: 'Maria si è ___ (vestire) in fretta.', answer: 'vestita', hint: 'Reflexive → essere rules → agrees with Maria: vestita' },
      { type: 'error', prompt: 'La torta? L\'ho comprato ieri.', answer: 'La torta? L\'ho comprata ieri.', hint: 'la (f.) preceding → agrees: comprata' },
    ] },
  { id: 'fare-causativo', name: 'Fare + infinito (causativo)', level: 'B2', category: 'syntax',
    scoba: `fare + infinitive = to have something done / make someone do:
  "Ho fatto riparare la macchina." (I had the car repaired.)
  "Mi faccio tagliare i capelli." (I get my hair cut.)
  "L'ho fatta riparare." (I had it repaired — agrees with la)
With pronouns: attach to fare or place before
  "Fallo entrare." / "Lo faccio entrare."
lasciare + infinitive works similarly:
  "Lasciami parlare." (Let me speak.)`,
    exercises: [
      { type: 'fill', prompt: 'Ho ___ (fare + riparare) la macchina dal meccanico.', answer: 'fatto riparare', hint: 'fare causativo + infinitive' },
      { type: 'fill', prompt: 'La professoressa ___ (fare + ripetere) la frase agli studenti.', answer: 'fa ripetere', hint: 'fare + infinitive: ha someone do something' },
      { type: 'transform', prompt: 'Rewrite: "Un meccanico ha riparato la mia macchina." using fare causativo.', answer: 'Ho fatto riparare la macchina.', hint: 'fare + infinitive removes the agent' },
    ] },
  { id: 'connettivi', name: 'Connettivi causa/conseguenza/concessione', level: 'B2', category: 'syntax',
    scoba: `Cause: poiché, dato che, siccome, in quanto, dal momento che
  "Poiché piove, resto a casa."
Consequence: di conseguenza, pertanto, perciò, quindi, dunque, cosicché
  "Ha studiato molto, pertanto ha superato l'esame."
Concession: benché + congiuntivo, nonostante + nome/congiuntivo,
  pur + gerundio, sebbene, malgrado, comunque
  "Benché piova, esco." "Pur essendo stanco, ha continuato."`,
    exercises: [
      { type: 'fill', prompt: '___ piove, resto a casa. (since/because)', answer: 'poiché', hint: 'Cause → poiché/siccome/dato che' },
      { type: 'fill', prompt: 'Ha studiato molto, ___ ha superato l\'esame. (therefore)', answer: 'pertanto', hint: 'Consequence → pertanto/perciò/di conseguenza' },
      { type: 'fill', prompt: '___ ___ (pur + essere) stanco, ha continuato a lavorare.', answer: 'pur essendo', hint: 'Concession with gerund: pur + gerundio' },
    ] },

  // ── C1 ──
  { id: 'congiuntivo-imperfetto-trapassato', name: 'Congiuntivo imperfetto e trapassato', level: 'C1', category: 'verbs',
    scoba: `Congiuntivo imperfetto: -assi, -assi, -asse, -assimo, -aste, -assero
  Used for: past subjunctive, tipo 2 hypotheticals, wishes
  "Volevo che venisse." "Se fosse qui, capirebbe."
Congiuntivo trapassato: avessi/fossi + participio passato
  Used for: tipo 3 hypotheticals, past regrets, past wishes
  "Se fosse stato qui, avrebbe capito."
  "Magari fosse venuto!" (If only he had come!)
  "Temevo che fosse partito." (I feared he had left.)`,
    exercises: [
      { type: 'fill', prompt: 'Se ___ (essere, lui) qui, avrebbe capito tutto.', answer: 'fosse stato', hint: 'Tipo 3: se + congiuntivo trapassato' },
      { type: 'fill', prompt: 'Volevo che ___ (venire, tu) alla festa.', answer: 'venissi', hint: 'Past wish → congiuntivo imperfetto' },
      { type: 'fill', prompt: 'Magari ___ (potere, io) tornare indietro!', answer: 'potessi', hint: 'Wish about present → magari + congiuntivo imperfetto' },
    ] },
  { id: 'nominalizzazione', name: 'Nominalizzazione', level: 'C1', category: 'syntax',
    scoba: `Converting verbs/adjectives to noun phrases (academic/journalistic register):
  "Il governo ha deciso..." → "La decisione del governo..."
  "I lavoratori protestano" → "La protesta dei lavoratori"
  "È necessario rafforzare..." → "Il rafforzamento di..."
  "I prezzi aumentano" → "L'aumento dei prezzi"
Common suffixes: -zione, -mento, -tura, -enza, -anza
  decidere → decisione, rafforzare → rafforzamento,
  aprire → apertura, resistere → resistenza`,
    exercises: [
      { type: 'transform', prompt: 'Nominalize: "Il governo ha deciso di investire."', answer: 'La decisione del governo di investire.', hint: 'decidere → decisione' },
      { type: 'transform', prompt: 'Nominalize: "I prezzi sono aumentati."', answer: "L'aumento dei prezzi.", hint: 'aumentare → aumento' },
      { type: 'fill', prompt: 'Il ___ (rafforzare) delle regole è necessario.', answer: 'rafforzamento', hint: 'rafforzare → rafforzamento' },
    ] },
  { id: 'inversione-stilistica', name: 'Inversione stilistica', level: 'C1', category: 'syntax',
    scoba: `Inverted word order for emphasis in literary/formal register:
  Standard: "Il professore disse..."
  Inverted: "Disse il professore..."
  Standard: "La sorpresa fu grande."
  Inverted: "Grande fu la sorpresa."
  Standard: "L'autore presenta molti argomenti."
  Inverted: "Molti sono gli argomenti che l'autore presenta."
Used in: literary narration, journalism, formal speeches`,
    exercises: [
      { type: 'transform', prompt: 'Invert for emphasis: "La sfida è grande."', answer: 'Grande è la sfida.', hint: 'Move adjective to front for emphasis' },
      { type: 'transform', prompt: 'Invert: "Il ministro ha detto che..."', answer: 'Ha detto il ministro che...', hint: 'Post-verbal subject for formal/journalistic style' },
    ] },
  { id: 'connettivi-discorso', name: 'Connettivi del discorso avanzati', level: 'C1', category: 'syntax',
    scoba: `Contrast: nondimeno, ciononostante, bensì, per contro
Consequence: a maggior ragione, tanto più che, ne consegue che
Addition: altresì, per di più, in aggiunta
Reformulation: vale a dire, ossia, in altri termini
Concession: pur ammettendo che, fermo restando che, laddove`,
    exercises: [
      { type: 'fill', prompt: 'Ha studiato molto; ___, non ha superato l\'esame. (nevertheless)', answer: 'ciononostante', hint: 'Strong contrast → ciononostante/nondimeno' },
      { type: 'fill', prompt: 'Non è pigro, ___ molto diligente. (rather/but rather)', answer: 'bensì', hint: 'Correction/opposition → bensì' },
      { type: 'fill', prompt: 'Il progetto è ambizioso. ___, richiede risorse enormi. (moreover)', answer: 'Per di più', hint: 'Addition → per di più/altresì' },
    ] },
  { id: 'registro-grammatica', name: 'Registro e grammatica', level: 'C1', category: 'syntax',
    scoba: `Formal register choices:
  Informal: passato prossimo ("Ho mangiato")
  Formal/literary: passato remoto ("Mangiai")
  Informal: "Penso che è..." (common in speech, technically wrong)
  Correct: "Penso che sia..." (congiuntivo always required)
  Informal: "Se avevo tempo, venivo." (indicative in both clauses — colloquial)
  Correct: "Se avessi avuto tempo, sarei venuto."
  Informal: "gli" for both masculine and feminine indirect
  Correct: "gli" (to him), "le" (to her)`,
    exercises: [
      { type: 'transform', prompt: 'Make formal: "Se avevo tempo, venivo."', answer: 'Se avessi avuto tempo, sarei venuto.', hint: 'Colloquial indicative → formal congiuntivo trapassato + condizionale passato' },
      { type: 'error', prompt: 'Gli ho detto a Maria di venire.', answer: 'Le ho detto di venire.', hint: 'Indirect object to Maria (f.) → le, not gli' },
      { type: 'transform', prompt: 'Make literary: "L\'Italia ha attraversato un periodo difficile."', answer: "L'Italia attraversò un periodo difficile.", hint: 'Passato prossimo → passato remoto for literary register' },
    ] },

  // ── C2 ──
  { id: 'congiuntivo-letterario', name: 'Congiuntivo imperfetto letterario', level: 'C2', category: 'verbs',
    scoba: `Literary/archaic congiuntivo forms:
  ch'egli avesse, ch'ella fosse, acciocché, quantunque
Trapassato remoto (after "dopo che", "appena", "non appena"):
  "Dopo che ebbe mangiato, uscì." (after he had eaten, he went out)
  Formation: passato remoto of avere/essere + participio passato
  Used ONLY in literary narrative, with passato remoto in main clause`,
    exercises: [
      { type: 'fill', prompt: 'Dopo che ___ (avere, lui) finito, uscì.', answer: 'ebbe', hint: 'Trapassato remoto: ebbe + participio' },
      { type: 'fill', prompt: 'Non appena ___ (arrivare, loro), cominciò la festa.', answer: 'furono arrivati', hint: 'Trapassato remoto with essere: furono + participio' },
    ] },
  { id: 'passato-remoto-padronanza', name: 'Passato remoto (padronanza)', level: 'C2', category: 'verbs',
    scoba: `Full mastery of all irregular passato remoto forms:
  essere: fui, fosti, fu, fummo, foste, furono
  avere: ebbi, avesti, ebbe, avemmo, aveste, ebbero
  fare: feci, facesti, fece, facemmo, faceste, fecero
  dire: dissi, dicesti, disse, dicemmo, diceste, dissero
  vedere: vidi, vedesti, vide, vedemmo, vedeste, videro
  nascere: nacqui, nascesti, nacque, nascemmo, nasceste, nacquero
  vivere: vissi, vivesti, visse, vivemmo, viveste, vissero
  venire: venni, venisti, venne, venimmo, veniste, vennero
  prendere: presi, prendesti, prese, prendemmo, prendeste, presero
  conoscere: conobbi, conoscesti, conobbe, conoscemmo, conosceste, conobbero`,
    exercises: [
      { type: 'fill', prompt: 'Michelangelo ___ (nascere) nel 1475.', answer: 'nacque', hint: 'nascere → nacque' },
      { type: 'fill', prompt: 'I Romani ___ (conoscere) l\'arte greca.', answer: 'conobbero', hint: 'conoscere → conobbero' },
      { type: 'fill', prompt: 'Petrarca ___ (vivere) a lungo in Francia.', answer: 'visse', hint: 'vivere → visse' },
    ] },
  { id: 'figure-retoriche', name: 'Figure retoriche come grammatica', level: 'C2', category: 'syntax',
    scoba: `Litote: double negative for understatement
  "Non è male" = it's good. "Non è stupido" = he's clever.
Chiasmo: ABBA structure
  "Mangia per vivere, non vive per mangiare."
Anafora: repetition at start of clauses
  "Roma che ride, Roma che piange, Roma che spera."
Polisindeto: excessive conjunctions for rhythm
  "E mangia e beve e ride e canta."
Asindeto: no conjunctions (staccato effect)
  "Veni, vidi, vici." (Venne, vide, vinse.)`,
    exercises: [
      { type: 'fill', prompt: 'Identify the figure: "Non è una cattiva idea." →', answer: 'litote', hint: 'Double negative understatement → litote' },
      { type: 'fill', prompt: 'Identify: "Mangia per vivere, non vive per mangiare." →', answer: 'chiasmo', hint: 'ABBA reversal → chiasmo' },
      { type: 'transform', prompt: 'Create an anafora with "Italia": describe three qualities.', answer: "Italia che sogna, Italia che lotta, Italia che rinasce.", hint: 'Repeat "Italia che..." at start of each clause' },
    ] },
  { id: 'variazione-dialettale', name: 'Variazione dialettale e registro', level: 'C2', category: 'syntax',
    scoba: `Regional grammar variation:
  North: passato prossimo exclusively, even for distant past
  South: passato remoto exclusively, even for recent past
  Rome: "stare a + infinito" instead of "stare + gerundio"
    "Che stai a fare?" = "Che stai facendo?"
Informal spoken deviations:
  "gli" for both masculine and feminine (universal in speech)
  "a me mi piace" (double indirect — stigmatized but universal)
  "se avevo" instead of "se avessi" (indicative for subjunctive — colloquial)
Leísmo-like: not present in Italian (no pronoun confusion)`,
    exercises: [
      { type: 'fill', prompt: 'A Roman would say "Che stai ___?" instead of "Che stai facendo?"', answer: 'a fare', hint: 'Roman: stare a + infinitive instead of stare + gerundio' },
      { type: 'error', prompt: 'A me mi piace il gelato. (Make standard)', answer: 'A me piace il gelato. / Mi piace il gelato.', hint: 'Remove doubling: use either "a me" or "mi", not both' },
      { type: 'transform', prompt: 'Make formal: "Gli ho detto a Maria di venire."', answer: 'Le ho detto di venire.', hint: '"gli" for feminine is informal → "le" in formal register' },
    ] },
];

// ─── Class ──────────────────────────────────────────────────────────────────

class GrammarTutor {
  constructor() {
    this.dir = dataDir(SKILL_NAME);
  }

  // ── Profile ──

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

  // ── Topic Catalog ──

  getTopicCatalog(level) {
    const topics = level ? TOPICS.filter(t => t.level === level) : TOPICS;
    return topics.map(t => ({ id: t.id, name: t.name, level: t.level, category: t.category, exercises: t.exercises.length }));
  }

  getScoba(topicId) {
    const t = TOPICS.find(t => t.id === topicId);
    if (!t) throw new Error(`Unknown topic: ${topicId}`);
    return { id: t.id, name: t.name, level: t.level, scoba: t.scoba };
  }

  // ── Lesson Generation ──

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

  // ── Exercise Generation ──

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

  // ── Answer Checking ──

  checkAnswer(topicId, exerciseIndex, userAnswer) {
    const t = TOPICS.find(t => t.id === topicId);
    if (!t) throw new Error(`Unknown topic: ${topicId}`);
    const idx = exerciseIndex - 1;
    if (idx < 0 || idx >= t.exercises.length) throw new Error(`Exercise index out of range (1-${t.exercises.length}).`);
    const ex = t.exercises[idx];
    const correct = norm(userAnswer) === norm(ex.answer);
    return {
      correct,
      expected: ex.answer,
      given: userAnswer,
      hint: correct ? null : ex.hint,
      type: ex.type,
    };
  }

  // ── Assessment Recording ──

  recordAssessment(studentId, topicId, grade) {
    grade = Number(grade);
    if (![1, 2, 3, 4].includes(grade)) throw new Error('Grade must be 1 (Again), 2 (Hard), 3 (Good), or 4 (Easy).');
    const t = TOPICS.find(t => t.id === topicId);
    if (!t) throw new Error(`Unknown topic: ${topicId}`);
    const p = this.getProfile(studentId);
    if (!p.skills[topicId]) {
      p.skills[topicId] = { D: 5, S: 1, lastReview: null, attempts: [] };
    }
    const sk = p.skills[topicId];
    sk.S = fsrsUpdateStability(sk.S, sk.D, grade);
    sk.D = fsrsUpdateDifficulty(sk.D, grade);
    sk.lastReview = today();
    sk.attempts.push({ date: today(), score: grade >= 3 ? 1 : 0, total: 1 });
    p.assessments.push({ topicId, grade, date: today() });
    this._save(p);
    const mastery = calcMastery(sk.attempts);
    return {
      topicId, grade,
      gradeLabel: ['', 'Again', 'Hard', 'Good', 'Easy'][grade],
      D: sk.D, S: sk.S,
      nextReview: fsrsNextReview(sk.S, DEFAULT_RETENTION),
      mastery, masteryLabel: masteryLabel(mastery),
    };
  }

  // ── Progress & Reports ──

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const levelTopics = TOPICS.filter(t => t.level === level);
    const skills = levelTopics.map(t => {
      const sk = p.skills[t.id];
      if (!sk) return { id: t.id, name: t.name, status: 'not-started', mastery: 0 };
      const mastery = calcMastery(sk.attempts);
      const daysSince = sk.lastReview ? Math.floor((Date.now() - new Date(sk.lastReview).getTime()) / 86400000) : null;
      const R = sk.lastReview ? fsrsRetention(daysSince, sk.S) : 0;
      return {
        id: t.id, name: t.name, mastery, status: masteryLabel(mastery),
        D: sk.D, S: sk.S, R: Math.round(R * 100) / 100,
        nextReview: fsrsNextReview(sk.S, DEFAULT_RETENTION),
        dueForReview: R < DEFAULT_RETENTION,
      };
    });
    const totalMastery = skills.length ? Math.round(skills.reduce((s, sk) => s + sk.mastery, 0) / skills.length * 100) / 100 : 0;
    return { studentId, level, totalMastery, skills };
  }

  getNextTopics(studentId, count) {
    count = count || 5;
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const levelTopics = TOPICS.filter(t => t.level === level);
    const due = [];
    const notStarted = [];
    for (const t of levelTopics) {
      const sk = p.skills[t.id];
      if (!sk) { notStarted.push({ id: t.id, name: t.name, reason: 'not-started' }); continue; }
      const daysSince = sk.lastReview ? Math.floor((Date.now() - new Date(sk.lastReview).getTime()) / 86400000) : 999;
      const R = fsrsRetention(daysSince, sk.S);
      if (R < DEFAULT_RETENTION) {
        due.push({ id: t.id, name: t.name, reason: 'due-for-review', R: Math.round(R * 100) / 100 });
      }
    }
    return { studentId, level, next: [...due, ...notStarted].slice(0, count) };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const recentAssessments = (p.assessments || []).slice(-10).reverse();
    const byCategory = {};
    for (const t of TOPICS.filter(t => t.level === (p.level || 'A1'))) {
      if (!byCategory[t.category]) byCategory[t.category] = { total: 0, mastered: 0 };
      byCategory[t.category].total++;
      const sk = p.skills[t.id];
      if (sk && calcMastery(sk.attempts) >= MASTERY_THRESHOLD) byCategory[t.category].mastered++;
    }
    return {
      studentId, level: p.level || 'A1',
      totalMastery: progress.totalMastery,
      categoryBreakdown: byCategory,
      recentAssessments,
      topicCount: progress.skills.length,
      masteredCount: progress.skills.filter(s => s.mastery >= MASTERY_THRESHOLD).length,
    };
  }

  listStudents() {
    return listProfiles(this.dir);
  }

  // ── Internal ──

  _nextTopic(p) {
    const level = p.level || 'A1';
    const levelTopics = TOPICS.filter(t => t.level === level);
    for (const t of levelTopics) {
      const sk = p.skills[t.id];
      if (sk && sk.lastReview) {
        const days = Math.floor((Date.now() - new Date(sk.lastReview).getTime()) / 86400000);
        if (fsrsRetention(days, sk.S) < DEFAULT_RETENTION) return t;
      }
    }
    for (const t of levelTopics) {
      if (!p.skills[t.id]) return t;
    }
    return levelTopics.reduce((best, t) => {
      const m = p.skills[t.id] ? calcMastery(p.skills[t.id].attempts) : 0;
      const bm = best && p.skills[best.id] ? calcMastery(p.skills[best.id].attempts) : 1;
      return m < bm ? t : best;
    }, levelTopics[0]);
  }
}

// ─── CLI ────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const tutor = new GrammarTutor();
  runCLI((cmd, args, out) => {
    const sid = args[1];
    switch (cmd) {
      case 'start':
        if (!sid) throw new Error('Usage: start <studentId>');
        out(tutor.getProfile(sid));
        break;
      case 'set-level':
        if (!sid || !args[2]) throw new Error('Usage: set-level <studentId> <A1|A2|B1|B2|C1|C2>');
        out(tutor.setLevel(sid, args[2].toUpperCase()));
        break;
      case 'lesson':
        if (!sid) throw new Error('Usage: lesson <studentId> [topicId]');
        out(tutor.generateLesson(sid, args[2] || null));
        break;
      case 'exercise':
        if (!sid) throw new Error('Usage: exercise <studentId> [topicId] [fill|error|transform]');
        out(tutor.generateExercise(sid, args[2] || null, args[3] || null));
        break;
      case 'check':
        if (!args[1] || !args[2] || !args[3]) throw new Error('Usage: check <topicId> <exerciseIndex> <answer...>');
        out(tutor.checkAnswer(args[1], Number(args[2]), args.slice(3).join(' ')));
        break;
      case 'record':
        if (!sid || !args[2] || !args[3]) throw new Error('Usage: record <studentId> <topicId> <grade 1-4>');
        out(tutor.recordAssessment(sid, args[2], Number(args[3])));
        break;
      case 'progress':
        if (!sid) throw new Error('Usage: progress <studentId>');
        out(tutor.getProgress(sid));
        break;
      case 'report':
        if (!sid) throw new Error('Usage: report <studentId>');
        out(tutor.getReport(sid));
        break;
      case 'next':
        if (!sid) throw new Error('Usage: next <studentId> [count]');
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
