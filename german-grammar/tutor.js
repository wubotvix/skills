#!/usr/bin/env node
// German Grammar Tutor — discovery-based grammar teaching with FSRS spaced repetition
'use strict';

const core = require('../_lib/core');
const { CEFR, MASTERY_THRESHOLD, DEFAULT_RETENTION,
        dataDir, loadProfile, saveProfile, listProfiles,
        calcMastery, masteryLabel,
        fsrsRetention, fsrsNextReview, fsrsUpdateStability, fsrsUpdateDifficulty,
        shuffle, pick, norm, today, runCLI } = core;

const SKILL_NAME = 'german-grammar';

// ─── Embedded Grammar Data ──────────────────────────────────────────────────

const TOPICS = [
  // ── A1 ──
  { id: 'nominativ-artikel', name: 'Nominative Articles (der/die/das)', level: 'A1', category: 'nouns',
    scoba: `What gender is the noun?
  → MASCULINE (der) — most nouns ending in -er, -ling, -ismus, -or
  → FEMININE (die) — most nouns ending in -ung, -heit, -keit, -schaft, -tion, -tät, -ie
  → NEUTER (das) — most nouns ending in -chen, -lein, -ment, -um, -tum
  → PLURAL always: die
  Exceptions exist — always learn noun WITH its article!`,
    exercises: [
      { type: 'fill', prompt: '___ (der/die/das) Haus ist groß.', answer: 'Das', hint: '-chen/-lein/-ment/-um → neuter; Haus is neuter' },
      { type: 'fill', prompt: '___ (der/die/das) Freiheit ist wichtig.', answer: 'Die', hint: '-heit → feminine' },
      { type: 'fill', prompt: '___ (der/die/das) Lehrer kommt aus Berlin.', answer: 'Der', hint: '-er (male person) → masculine' },
      { type: 'error', prompt: 'Der Mädchen spielt im Garten.', answer: 'Das Mädchen spielt im Garten.', hint: '-chen ending → always neuter, even for girls' },
      { type: 'fill', prompt: '___ (der/die/das) Zeitung liegt auf dem Tisch.', answer: 'Die', hint: '-ung → feminine' },
    ] },
  { id: 'present-regular', name: 'Present Tense (regular)', level: 'A1', category: 'verbs',
    scoba: `Regular present tense endings:
  ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en
  Examples: machen → ich mache, du machst, er macht, wir machen, ihr macht, sie machen
  Stem ending in -t/-d: add extra -e: arbeiten → du arbeitest, er arbeitet`,
    exercises: [
      { type: 'fill', prompt: 'Ich ___ (machen) meine Hausaufgaben.', answer: 'mache', hint: 'ich → -e' },
      { type: 'fill', prompt: 'Sie (they) ___ (spielen) im Park.', answer: 'spielen', hint: 'sie (pl.) → -en' },
      { type: 'fill', prompt: 'Du ___ (arbeiten) sehr viel.', answer: 'arbeitest', hint: 'Stem ends in -t → du arbeitest (extra -e)' },
      { type: 'error', prompt: 'Er arbeit jeden Tag.', answer: 'Er arbeitet jeden Tag.', hint: 'Stem ending -t → er arbeitet' },
      { type: 'transform', prompt: 'Change to wir: "Ich lerne Deutsch."', answer: 'Wir lernen Deutsch.', hint: 'wir → -en' },
    ] },
  { id: 'sein-haben', name: 'Sein & Haben (present)', level: 'A1', category: 'verbs',
    scoba: `sein (to be): ich bin, du bist, er ist, wir sind, ihr seid, sie sind
haben (to have): ich habe, du hast, er hat, wir haben, ihr habt, sie haben
  SEIN for: identity, nationality, profession, characteristics, location
  HABEN for: possession, age (Ich habe 20 Jahre / Ich bin 20 Jahre alt)`,
    exercises: [
      { type: 'fill', prompt: 'Ich ___ (sein) Student.', answer: 'bin', hint: 'Identity → sein; ich → bin' },
      { type: 'fill', prompt: 'Er ___ (haben) zwei Kinder.', answer: 'hat', hint: 'Possession → haben; er → hat' },
      { type: 'fill', prompt: 'Wir ___ (sein) in Berlin.', answer: 'sind', hint: 'Location → sein; wir → sind' },
      { type: 'error', prompt: 'Sie haben müde.', answer: 'Sie sind müde.', hint: 'State/characteristic → sein, not haben' },
    ] },
  { id: 'akkusativ', name: 'Accusative Case (basic)', level: 'A1', category: 'cases',
    scoba: `When is Accusative used?
  → DIRECT OBJECT of a verb: "Ich sehe den Mann."
  → After accusative prepositions: durch, für, gegen, ohne, um
  Only MASCULINE changes: der → den, ein → einen
  Feminine, neuter, plural stay the same:
    die → die, das → das, die (pl) → die`,
    exercises: [
      { type: 'fill', prompt: 'Ich sehe ___ (der) Mann.', answer: 'den', hint: 'Direct object + masculine → den' },
      { type: 'fill', prompt: 'Er kauft ___ (ein) Buch.', answer: 'ein', hint: 'Neuter stays: ein Buch' },
      { type: 'fill', prompt: 'Das Geschenk ist für ___ (du).', answer: 'dich', hint: 'für + accusative; du → dich' },
      { type: 'error', prompt: 'Ich habe der Hund gesehen.', answer: 'Ich habe den Hund gesehen.', hint: 'Direct object + masculine → den' },
      { type: 'fill', prompt: 'Wir gehen durch ___ (der) Park.', answer: 'den', hint: 'durch + accusative; masculine → den' },
    ] },
  { id: 'v2-word-order', name: 'V2 Word Order', level: 'A1', category: 'syntax',
    scoba: `V2 Rule: The conjugated verb is ALWAYS in position 2 in a main clause.
  Position 1 can be the subject or any other element:
  "Ich gehe morgen ins Kino." (subject first)
  "Morgen gehe ich ins Kino." (time first → verb stays 2nd → subject moves)
  "Ins Kino gehe ich morgen." (place first)
  If position 1 is NOT the subject, subject comes right after the verb.`,
    exercises: [
      { type: 'fill', prompt: 'Morgen ___ (gehen) ich ins Kino.', answer: 'gehe', hint: 'Morgen = position 1, verb = position 2' },
      { type: 'error', prompt: 'Gestern ich bin ins Kino gegangen.', answer: 'Gestern bin ich ins Kino gegangen.', hint: 'V2: Gestern (pos 1) + bin (pos 2) + ich' },
      { type: 'transform', prompt: 'Start with "Am Wochenende": "Wir spielen am Wochenende Fußball."', answer: 'Am Wochenende spielen wir Fußball.', hint: 'V2: time adverb first → verb second → subject third' },
    ] },
  { id: 'plural-nouns', name: 'Noun Plurals', level: 'A1', category: 'nouns',
    scoba: `German has 5 plural patterns:
  -e: der Tag → die Tage, der Hund → die Hunde
  -er: das Kind → die Kinder, das Buch → die Bücher (often with umlaut)
  -n/-en: die Frau → die Frauen, die Zeitung → die Zeitungen
  -s: das Auto → die Autos, das Hobby → die Hobbys (foreign words)
  (no change): der Lehrer → die Lehrer (masc -er/-el/-en)
  ALWAYS learn plural WITH the noun!`,
    exercises: [
      { type: 'fill', prompt: 'Ein Kind, zwei ___.', answer: 'Kinder', hint: 'das Kind → die Kinder (-er pattern)' },
      { type: 'fill', prompt: 'Eine Frau, zwei ___.', answer: 'Frauen', hint: 'die Frau → die Frauen (-en pattern)' },
      { type: 'fill', prompt: 'Ein Auto, zwei ___.', answer: 'Autos', hint: 'das Auto → die Autos (-s, foreign word)' },
      { type: 'fill', prompt: 'Ein Buch, zwei ___.', answer: 'Bücher', hint: 'das Buch → die Bücher (-er with umlaut)' },
    ] },

  // ── A2 ──
  { id: 'perfekt', name: 'Perfekt (conversational past)', level: 'A2', category: 'verbs',
    scoba: `Perfekt = auxiliary (haben/sein) + past participle (ge-...-t / ge-...-en)
  HABEN: most verbs — "Ich habe gekocht."
  SEIN: movement (gehen, fahren, fliegen) + state change (werden, sterben, aufwachen)
  Past participle:
    regular: ge- + stem + -t (gemacht, gekauft, gespielt)
    irregular: ge- + stem + -en (gegangen, geschrieben, getrunken)
    separable: prefix-ge-...: angefangen, aufgestanden
    inseparable (be-,ver-,er-,ent-,emp-,zer-): NO ge-: besucht, verstanden`,
    exercises: [
      { type: 'fill', prompt: 'Ich ___ (haben) gestern viel ___ (arbeiten).', answer: 'habe ... gearbeitet', hint: 'haben + ge-arbeit-et' },
      { type: 'fill', prompt: 'Er ___ (sein) nach Berlin ___ (fahren).', answer: 'ist ... gefahren', hint: 'Movement → sein; fahren → gefahren (irregular)' },
      { type: 'fill', prompt: 'Wir ___ (haben) den Film ___ (sehen).', answer: 'haben ... gesehen', hint: 'sehen → gesehen (irregular)' },
      { type: 'error', prompt: 'Ich habe nach Hause gegangen.', answer: 'Ich bin nach Hause gegangen.', hint: 'gehen = movement → sein' },
      { type: 'fill', prompt: 'Sie ___ (haben) mich ___ (besuchen).', answer: 'hat ... besucht', hint: 'be- prefix → no ge-: besucht' },
    ] },
  { id: 'dativ', name: 'Dative Case', level: 'A2', category: 'cases',
    scoba: `When is Dative used?
  → INDIRECT OBJECT: "Ich gebe dem Mann das Buch."
  → After dative prepositions: aus, bei, mit, nach, seit, von, zu, gegenüber
  → After Wechselpräpositionen (location/no movement): in, an, auf, über, unter, vor, hinter, neben, zwischen
  Articles change:
    der → dem, die → der, das → dem, die (pl) → den (+n on noun)
    ein → einem, eine → einer, ein → einem`,
    exercises: [
      { type: 'fill', prompt: 'Ich gebe ___ (die) Frau das Buch.', answer: 'der', hint: 'Indirect object + feminine → der (dative)' },
      { type: 'fill', prompt: 'Er wohnt bei ___ (sein) Bruder.', answer: 'seinem', hint: 'bei + dative; masculine → seinem' },
      { type: 'fill', prompt: 'Wir fahren mit ___ (der) Bus.', answer: 'dem', hint: 'mit + dative; masculine → dem' },
      { type: 'error', prompt: 'Ich helfe der Mann.', answer: 'Ich helfe dem Mann.', hint: 'helfen + dative; masculine → dem' },
      { type: 'fill', prompt: 'Das Bild hängt an ___ (die) Wand.', answer: 'der', hint: 'Location (no movement) → dative; feminine → der' },
    ] },
  { id: 'trennbare-verben', name: 'Separable Verbs', level: 'A2', category: 'verbs',
    scoba: `Separable prefixes detach in main clauses (present/Präteritum):
  anfangen → Ich fange morgen an. (prefix goes to END)
  aufstehen → Er steht um 7 Uhr auf.
  Common separable prefixes: ab-, an-, auf-, aus-, ein-, mit-, vor-, zu-, zurück-
  In subordinate clauses: prefix stays attached: "..., weil ich morgen anfange."
  In Perfekt: ge- goes BETWEEN prefix and stem: angefangen, aufgestanden`,
    exercises: [
      { type: 'fill', prompt: 'Ich ___ dich morgen ___ (anrufen).', answer: 'rufe ... an', hint: 'Separable: prefix "an" goes to end' },
      { type: 'fill', prompt: 'Er ___ jeden Tag um 6 Uhr ___ (aufstehen).', answer: 'steht ... auf', hint: 'Separable: prefix "auf" goes to end' },
      { type: 'error', prompt: 'Ich anrufe dich morgen.', answer: 'Ich rufe dich morgen an.', hint: 'Separable verbs: prefix detaches to end of main clause' },
      { type: 'fill', prompt: 'Wann ___ der Film ___ (anfangen)?', answer: 'fängt ... an', hint: 'anfangen: er/es fängt an (vowel change + separation)' },
    ] },
  { id: 'modalverben', name: 'Modal Verbs', level: 'A2', category: 'verbs',
    scoba: `Modal verbs: können, müssen, wollen, sollen, dürfen, mögen/möchten
  Structure: modal (pos 2) + infinitive (END)
  "Ich kann Deutsch sprechen." "Du musst nach Hause gehen."
  Conjugation is irregular in singular:
    können: ich kann, du kannst, er kann
    müssen: ich muss, du musst, er muss
    wollen: ich will, du willst, er will`,
    exercises: [
      { type: 'fill', prompt: 'Ich ___ (können) gut Deutsch sprechen.', answer: 'kann', hint: 'können: ich → kann' },
      { type: 'fill', prompt: 'Du ___ (müssen) morgen früh aufstehen.', answer: 'musst', hint: 'müssen: du → musst' },
      { type: 'error', prompt: 'Er kann gut Deutsch zu sprechen.', answer: 'Er kann gut Deutsch sprechen.', hint: 'Modal + bare infinitive (no "zu")' },
      { type: 'fill', prompt: 'Wir ___ (wollen) ins Kino gehen.', answer: 'wollen', hint: 'wollen: wir → wollen' },
    ] },
  { id: 'wechselpraepositionen', name: 'Two-Way Prepositions', level: 'A2', category: 'cases',
    scoba: `9 Wechselpräpositionen: in, an, auf, über, unter, vor, hinter, neben, zwischen
  → MOVEMENT/DIRECTION (wohin?) → ACCUSATIVE: "Ich gehe in den Park."
  → LOCATION/POSITION (wo?) → DATIVE: "Ich bin im (in dem) Park."
  Mnemonic: "An, auf, hinter, in, neben, über, unter, vor, zwischen — Wo? Dativ! Wohin? Akkusativ!"`,
    exercises: [
      { type: 'fill', prompt: 'Ich gehe in ___ (der) Park. (movement)', answer: 'den', hint: 'Wohin? → accusative; masculine → den' },
      { type: 'fill', prompt: 'Ich bin in ___ (der) Park. (location)', answer: 'dem', hint: 'Wo? → dative; masculine → dem' },
      { type: 'fill', prompt: 'Die Katze springt auf ___ (der) Tisch. (movement)', answer: 'den', hint: 'Wohin? → accusative; masculine → den' },
      { type: 'fill', prompt: 'Die Katze sitzt auf ___ (der) Tisch. (location)', answer: 'dem', hint: 'Wo? → dative; masculine → dem' },
      { type: 'error', prompt: 'Ich lege das Buch auf dem Tisch.', answer: 'Ich lege das Buch auf den Tisch.', hint: 'legen = movement → accusative' },
    ] },
  { id: 'reflexive-verben', name: 'Reflexive Verbs', level: 'A2', category: 'verbs',
    scoba: `Reflexive verbs use a reflexive pronoun (sich):
  sich freuen, sich waschen, sich interessieren
  Accusative reflexive: mich, dich, sich, uns, euch, sich
  Dative reflexive (with acc. object): mir, dir, sich, uns, euch, sich
  "Ich wasche mich." (acc) vs "Ich wasche mir die Hände." (dat)`,
    exercises: [
      { type: 'fill', prompt: 'Ich freue ___ (reflexive) auf die Ferien.', answer: 'mich', hint: 'sich freuen: ich → mich (accusative)' },
      { type: 'fill', prompt: 'Er wäscht ___ (reflexive) die Hände.', answer: 'sich', hint: 'sich waschen + body part: er → sich (dative)' },
      { type: 'error', prompt: 'Ich interessiere für Musik.', answer: 'Ich interessiere mich für Musik.', hint: 'sich interessieren is reflexive: mich' },
    ] },

  // ── B1 ──
  { id: 'nebensaetze', name: 'Subordinate Clauses (Nebensätze)', level: 'B1', category: 'syntax',
    scoba: `Subordinate conjunctions send the verb to the END:
  weil (because), dass (that), wenn (when/if), ob (whether), obwohl (although),
  als (when, past), bevor (before), nachdem (after), während (while)
  Main: "Ich gehe nach Hause."
  Sub: "..., weil ich müde bin." (verb → end)
  Starting with sub clause: "Weil ich müde bin, gehe ich nach Hause." (V2 in main clause)`,
    exercises: [
      { type: 'fill', prompt: 'Ich bleibe zu Hause, weil ich krank ___ (sein).', answer: 'bin', hint: 'weil → verb to end: krank bin' },
      { type: 'fill', prompt: 'Er sagt, dass er morgen ___ (kommen).', answer: 'kommt', hint: 'dass → verb to end: morgen kommt' },
      { type: 'error', prompt: 'Wenn ich habe Zeit, gehe ich ins Kino.', answer: 'Wenn ich Zeit habe, gehe ich ins Kino.', hint: 'wenn → verb to end: Zeit habe' },
      { type: 'transform', prompt: 'Combine with "weil": "Ich lerne Deutsch." + "Ich arbeite in Berlin."', answer: 'Ich lerne Deutsch, weil ich in Berlin arbeite.', hint: 'weil + verb to end' },
    ] },
  { id: 'adjektivdeklination', name: 'Adjective Declension', level: 'B1', category: 'nouns',
    scoba: `Three patterns for adjective endings:
  1) After der/die/das (definite): mostly -e or -en
     der große Mann, die große Frau, das große Haus, die großen Kinder
  2) After ein/eine/ein (indefinite): shows gender where article doesn't
     ein großer Mann, eine große Frau, ein großes Haus
  3) No article (zero): adjective carries FULL signal
     großer Mann, große Frau, großes Haus, große Kinder
  Key rule: the gender/case signal must appear SOMEWHERE (article OR adjective)`,
    exercises: [
      { type: 'fill', prompt: 'Der ___ (groß) Mann ist mein Vater.', answer: 'große', hint: 'After der (nominative masculine) → -e' },
      { type: 'fill', prompt: 'Ein ___ (klein) Kind spielt im Garten.', answer: 'kleines', hint: 'After ein (nominative neuter) → -es (adjective shows gender)' },
      { type: 'fill', prompt: 'Ich trinke ___ (kalt) Wasser.', answer: 'kaltes', hint: 'No article + neuter accusative → -es' },
      { type: 'error', prompt: 'Das ist eine schöner Blume.', answer: 'Das ist eine schöne Blume.', hint: 'After eine (feminine) → -e' },
      { type: 'fill', prompt: 'Ich habe den ___ (neu) Film gesehen.', answer: 'neuen', hint: 'After den (accusative masculine) → -en' },
    ] },
  { id: 'konjunktiv2', name: 'Konjunktiv II (present)', level: 'B1', category: 'verbs',
    scoba: `Konjunktiv II for unreal/hypothetical situations and polite requests:
  würde + infinitive (most verbs): "Ich würde gern kommen."
  Common short forms: wäre (sein), hätte (haben), könnte, müsste, sollte, dürfte
  "wenn" clauses: "Wenn ich reich wäre, würde ich reisen."
  Polite: "Könnten Sie mir helfen?" "Ich hätte gern einen Kaffee."`,
    exercises: [
      { type: 'fill', prompt: 'Wenn ich mehr Zeit ___ (haben), würde ich Sport machen.', answer: 'hätte', hint: 'Konjunktiv II of haben: hätte' },
      { type: 'fill', prompt: '___ (können) Sie mir bitte helfen?', answer: 'Könnten', hint: 'Polite: Konjunktiv II of können: könnten' },
      { type: 'fill', prompt: 'Wenn ich reich ___ (sein), würde ich um die Welt reisen.', answer: 'wäre', hint: 'Konjunktiv II of sein: wäre' },
      { type: 'error', prompt: 'Wenn ich bin reich, reise ich um die Welt.', answer: 'Wenn ich reich wäre, würde ich um die Welt reisen.', hint: 'Hypothetical → Konjunktiv II: wäre + würde' },
    ] },
  { id: 'komparativ-superlativ', name: 'Comparative & Superlative', level: 'B1', category: 'nouns',
    scoba: `Comparative: adjective + -er + als: "größer als", "schneller als"
  Superlative: am + adjective + -sten: "am größten", "am schnellsten"
  Or with article: der/die/das + adjective + -ste: "der größte Mann"
  Irregular: gut → besser → am besten; viel → mehr → am meisten; gern → lieber → am liebsten
  Umlaut in common adjectives: alt → älter, groß → größer, jung → jünger`,
    exercises: [
      { type: 'fill', prompt: 'Berlin ist ___ (groß) als München.', answer: 'größer', hint: 'Comparative of groß → größer (with umlaut)' },
      { type: 'fill', prompt: 'Das ist der ___ (gut) Film, den ich je gesehen habe.', answer: 'beste', hint: 'Superlative of gut: der beste' },
      { type: 'fill', prompt: 'Ich trinke ___ (gern) Tee als Kaffee.', answer: 'lieber', hint: 'Comparative of gern → lieber' },
      { type: 'error', prompt: 'Er ist mehr groß als sein Bruder.', answer: 'Er ist größer als sein Bruder.', hint: 'Use -er ending, not "mehr" for short adjectives' },
    ] },
  { id: 'praeteritum', name: 'Präteritum (simple past)', level: 'B1', category: 'verbs',
    scoba: `Präteritum: mainly used in written/formal German and with sein/haben/modals in speech.
  Regular: stem + -te, -test, -te, -ten, -tet, -ten (machte, machtest, machte...)
  Irregular: stem changes (ging, kam, schrieb, sprach...)
  Haben: hatte; Sein: war; Werden: wurde
  In spoken German: mostly replaced by Perfekt except sein/haben/modals`,
    exercises: [
      { type: 'fill', prompt: 'Gestern ___ (sein) ich zu Hause.', answer: 'war', hint: 'Präteritum of sein: ich war' },
      { type: 'fill', prompt: 'Als Kind ___ (haben) ich einen Hund.', answer: 'hatte', hint: 'Präteritum of haben: ich hatte' },
      { type: 'fill', prompt: 'Er ___ (gehen) gestern ins Kino.', answer: 'ging', hint: 'Präteritum of gehen: ging (irregular)' },
      { type: 'fill', prompt: 'Sie ___ (können) nicht kommen.', answer: 'konnte', hint: 'Präteritum of können: konnte' },
    ] },
  { id: 'genitiv', name: 'Genitive Case', level: 'B1', category: 'cases',
    scoba: `Genitive = possession/ownership:
  der → des (+s/-es on noun), die → der, das → des (+s/-es on noun), die (pl) → der
  "Das Auto des Mannes" (the man's car)
  "Die Tasche der Frau" (the woman's bag)
  Genitive prepositions: wegen, trotz, während, statt/anstatt
  In spoken German: often replaced by von + dative: "das Auto von dem Mann"`,
    exercises: [
      { type: 'fill', prompt: 'Das ist das Auto ___ (der) Lehrers.', answer: 'des', hint: 'Genitive masculine: der → des (+ -s on noun)' },
      { type: 'fill', prompt: 'Die Farbe ___ (das) Hauses ist weiß.', answer: 'des', hint: 'Genitive neuter: das → des (+ -es on noun)' },
      { type: 'fill', prompt: 'Trotz ___ (das) schlechten Wetters gehen wir spazieren.', answer: 'des', hint: 'trotz + genitive: das → des' },
      { type: 'error', prompt: 'Das Buch von der Frau liegt auf dem Tisch.', answer: 'Das Buch der Frau liegt auf dem Tisch.', hint: 'Written German prefers genitive: die → der' },
    ] },

  // ── B2 ──
  { id: 'passiv', name: 'Passive Voice (Vorgangspassiv)', level: 'B2', category: 'verbs',
    scoba: `Passive = werden + past participle:
  Present: "Das Buch wird gelesen."
  Perfekt: "Das Buch ist gelesen worden."
  Präteritum: "Das Buch wurde gelesen."
  With modal: "Das Buch muss gelesen werden."
  Agent: von + dative: "Das Buch wird von dem Lehrer gelesen."
  Zustandspassiv: sein + PP: "Das Fenster ist geöffnet." (state result)`,
    exercises: [
      { type: 'fill', prompt: 'Das Haus ___ (werden) gerade gebaut.', answer: 'wird', hint: 'Present passive: wird + gebaut' },
      { type: 'fill', prompt: 'Der Brief ___ (werden) gestern geschrieben.', answer: 'wurde', hint: 'Präteritum passive: wurde + geschrieben' },
      { type: 'transform', prompt: 'Make passive: "Der Koch kocht das Essen."', answer: 'Das Essen wird (vom Koch) gekocht.', hint: 'Object becomes subject + werden + past participle' },
      { type: 'error', prompt: 'Das Fenster wird geöffnet. (It describes the state.)', answer: 'Das Fenster ist geöffnet.', hint: 'State = Zustandspassiv (sein + PP), not Vorgangspassiv' },
    ] },
  { id: 'relativsaetze', name: 'Relative Clauses', level: 'B2', category: 'syntax',
    scoba: `Relative pronoun matches GENDER/NUMBER of the noun it refers to.
  CASE is determined by its function in the relative clause.
  Nom: der, die, das, die | Acc: den, die, das, die | Dat: dem, der, dem, denen | Gen: dessen, deren, dessen, deren
  "Der Mann, der dort steht, ist mein Lehrer." (nom masculine)
  "Das Buch, das ich lese, ist spannend." (acc neuter)
  Verb goes to END of relative clause.`,
    exercises: [
      { type: 'fill', prompt: 'Die Frau, ___ (relative) dort sitzt, ist meine Mutter.', answer: 'die', hint: 'Feminine + nominative (subject of relative clause) → die' },
      { type: 'fill', prompt: 'Der Film, ___ (relative) wir gestern gesehen haben, war gut.', answer: 'den', hint: 'Masculine + accusative (object) → den' },
      { type: 'fill', prompt: 'Das Kind, ___ (relative) ich das Buch gegeben habe, ist mein Neffe.', answer: 'dem', hint: 'Neuter + dative (indirect object) → dem' },
      { type: 'error', prompt: 'Der Mann, der ich kenne, ist nett.', answer: 'Der Mann, den ich kenne, ist nett.', hint: 'kennen takes accusative: masculine → den' },
    ] },
  { id: 'konjunktiv2-vergangenheit', name: 'Konjunktiv II (past)', level: 'B2', category: 'verbs',
    scoba: `Past hypothetical: hätte/wäre + past participle
  "Wenn ich mehr gelernt hätte, hätte ich die Prüfung bestanden."
  "Wenn ich früher aufgestanden wäre, wäre ich nicht zu spät gekommen."
  Use wäre with movement/sein verbs, hätte with all others.`,
    exercises: [
      { type: 'fill', prompt: 'Wenn ich das gewusst ___ (haben), hätte ich dir geholfen.', answer: 'hätte', hint: 'Past Konjunktiv II: hätte + gewusst' },
      { type: 'fill', prompt: 'Wenn er schneller gelaufen ___ (sein), hätte er den Bus erreicht.', answer: 'wäre', hint: 'laufen → movement → wäre + gelaufen' },
      { type: 'error', prompt: 'Wenn ich hätte mehr Zeit, würde ich dir helfen.', answer: 'Wenn ich mehr Zeit hätte, würde ich dir helfen.', hint: 'In wenn-clause: verb goes to end' },
    ] },
  { id: 'indirekte-rede', name: 'Indirect Speech (Konjunktiv I)', level: 'B2', category: 'verbs',
    scoba: `Konjunktiv I for indirect speech (reported speech):
  er/sie/es: stem + -e: "Er sagt, er komme morgen."
  If Konj. I = indicative, use Konj. II: "Sie sagen, sie kämen morgen." (not "kommen")
  Mainly in formal/written German (news, academic).
  Spoken German usually: "Er sagt, dass er morgen kommt." (indicative + dass)`,
    exercises: [
      { type: 'fill', prompt: 'Er sagt, er ___ (sein) krank.', answer: 'sei', hint: 'Konjunktiv I of sein: er sei' },
      { type: 'fill', prompt: 'Sie behauptet, sie ___ (haben) nichts gewusst.', answer: 'habe', hint: 'Konjunktiv I of haben: sie habe' },
      { type: 'transform', prompt: 'Indirect speech: Er sagt: "Ich komme morgen."', answer: 'Er sagt, er komme morgen.', hint: 'Konjunktiv I: er komme' },
    ] },

  // ── C1 ──
  { id: 'partizip-erweitert', name: 'Extended Participial Attributes', level: 'C1', category: 'syntax',
    scoba: `Pre-nominal participial constructions (very common in academic/formal German):
  "der gestern von dem Lehrer korrigierte Test" = "the test corrected by the teacher yesterday"
  Structure: article + [modifiers + participle] + noun
  Equivalent to a relative clause: "der Test, der gestern vom Lehrer korrigiert wurde"
  Present participle: -d (der schlafende Hund = the sleeping dog)
  Past participle: ge-...-t/en (das gelesene Buch = the read book)`,
    exercises: [
      { type: 'transform', prompt: 'Rewrite as participial attribute: "der Hund, der schläft"', answer: 'der schlafende Hund', hint: 'Present participle: schlafend + adjective ending -e' },
      { type: 'transform', prompt: 'Rewrite as relative clause: "die neu gebaute Brücke"', answer: 'die Brücke, die neu gebaut wurde', hint: 'Past participle → passive relative clause' },
    ] },
  { id: 'nominal-stil', name: 'Nominal Style (Nominalstil)', level: 'C1', category: 'syntax',
    scoba: `Academic/formal German prefers nouns over verbs:
  Verbal: "Weil die Bevölkerung wächst, steigt der Bedarf."
  Nominal: "Aufgrund des Bevölkerungswachstums steigt der Bedarf."
  Common conversions: verb → noun (wachsen → das Wachstum, steigen → der Anstieg)
  Prepositions: wegen, aufgrund, infolge, durch, mittels, zwecks (+ genitive)`,
    exercises: [
      { type: 'transform', prompt: 'Nominalize: "Weil die Kosten steigen, müssen wir sparen."', answer: 'Aufgrund des Kostenanstiegs müssen wir sparen.', hint: 'steigen → Anstieg; weil → aufgrund + genitive' },
      { type: 'transform', prompt: 'Verbalize: "Nach der Ankunft des Zuges..."', answer: 'Nachdem der Zug angekommen ist/war...', hint: 'Ankunft → ankommen; nach → nachdem' },
    ] },
  { id: 'konzessive-saetze', name: 'Concessive Clauses', level: 'C1', category: 'syntax',
    scoba: `Concessive = "even though/despite":
  obwohl/obgleich/obschon + Nebensatz: "Obwohl es regnet, gehen wir spazieren."
  trotzdem (adverb): "Es regnet. Trotzdem gehen wir spazieren." (V2!)
  trotz + genitive: "Trotz des Regens gehen wir spazieren."
  wenn ... auch / selbst wenn: "Selbst wenn es regnet, gehen wir."`,
    exercises: [
      { type: 'fill', prompt: '___ (obwohl) es kalt ist, gehe ich schwimmen.', answer: 'Obwohl', hint: 'Concessive conjunction: obwohl + verb to end' },
      { type: 'transform', prompt: 'Rewrite with trotzdem: "Obwohl es regnet, gehen wir spazieren."', answer: 'Es regnet. Trotzdem gehen wir spazieren.', hint: 'trotzdem is an adverb → V2 in the next clause' },
    ] },

  // ── C2 ──
  { id: 'futur2', name: 'Futur II (future perfect)', level: 'C2', category: 'verbs',
    scoba: `Futur II = werden + past participle + haben/sein
  "Er wird das Buch gelesen haben." (He will have read the book.)
  Often used for SPECULATION about the past:
  "Er wird wohl krank gewesen sein." (He was probably sick.)
  Rarely used for actual future perfect — Perfekt is preferred.`,
    exercises: [
      { type: 'fill', prompt: 'Bis morgen ___ (werden) ich die Arbeit beendet haben.', answer: 'werde', hint: 'Futur II: werden + PP + haben' },
      { type: 'fill', prompt: 'Er ___ (werden) wohl schon nach Hause gegangen sein.', answer: 'wird', hint: 'Speculation: wird + PP + sein' },
    ] },
  { id: 'register-variation', name: 'Register & Regional Variation', level: 'C2', category: 'syntax',
    scoba: `Formal written German vs. spoken German differences:
  Genitive (written) vs. von + dative (spoken)
  Präteritum (written) vs. Perfekt (spoken)
  Konjunktiv I (written indirect speech) vs. indicative + dass (spoken)
  Participial attributes (written) vs. relative clauses (spoken)
  Regional: Austrian Perfekt preference, Swiss no Präteritum, Bavarian dative for accusative`,
    exercises: [
      { type: 'transform', prompt: 'Make formal: "Das Auto von meinem Vater ist rot."', answer: 'Das Auto meines Vaters ist rot.', hint: 'Spoken von+dative → written genitive' },
      { type: 'transform', prompt: 'Make informal: "Der gestern von mir gelesene Artikel war interessant."', answer: 'Der Artikel, den ich gestern gelesen habe, war interessant.', hint: 'Participial attribute → relative clause + Perfekt' },
    ] },
];

// ─── Grammar Tutor Class ────────────────────────────────────────────────────

class GrammarTutor {
  constructor() {
    this.dir = dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    const p = loadProfile(this.dir, studentId);
    if (!p.level) p.level = 'A1';
    if (!p.skills) p.skills = {};
    if (!p.sessions) p.sessions = [];
    return p;
  }

  _save(p) { saveProfile(this.dir, p); }

  setLevel(studentId, level) {
    const lv = level.toUpperCase();
    if (!CEFR.includes(lv)) throw new Error('Invalid CEFR level: ' + level);
    const p = this.getProfile(studentId);
    p.level = lv;
    this._save(p);
    return { studentId, level: lv };
  }

  _topicsForLevel(level) {
    const idx = CEFR.indexOf(level);
    return TOPICS.filter(t => CEFR.indexOf(t.level) <= idx);
  }

  generateLesson(studentId, topicId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = this._topicsForLevel(level);

    let topic;
    if (topicId) {
      topic = TOPICS.find(t => t.id === topicId);
      if (!topic) throw new Error('Topic not found: ' + topicId);
    } else {
      const seen = new Set(Object.keys(p.skills));
      const unseen = available.filter(t => !seen.has(t.id));
      const candidates = unseen.length ? unseen : available;
      topic = pick(candidates, 1)[0];
    }

    const exercises = pick(shuffle(topic.exercises.slice()), Math.min(3, topic.exercises.length));

    return {
      studentId, level, date: today(),
      topic: { id: topic.id, name: topic.name, level: topic.level, category: topic.category },
      scoba: topic.scoba,
      exercises: exercises.map((e, i) => ({
        index: i + 1, type: e.type, prompt: e.prompt, hint: e.hint,
      })),
      sessionFlow: [
        { step: 1, name: 'Expose', note: 'Present 3-4 example sentences with the target form' },
        { step: 2, name: 'Discover', note: 'Ask: "What pattern do you notice?"' },
        { step: 3, name: 'Confirm', note: 'Show SCOBA decision flowchart' },
        { step: 4, name: 'Practice', note: `${exercises.length} exercises (fill/error/transform)` },
        { step: 5, name: 'Check', note: 'Graduated feedback: implicit cue → question → partial → explicit' },
        { step: 6, name: 'Record', note: 'FSRS grade 1-4' },
      ],
    };
  }

  generateExercise(studentId, topicId, type) {
    const topic = topicId ? TOPICS.find(t => t.id === topicId) : null;
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';

    let exercises;
    if (topic) {
      exercises = topic.exercises;
    } else {
      const available = this._topicsForLevel(level);
      const randomTopic = pick(available, 1)[0];
      exercises = randomTopic.exercises;
    }

    if (type) {
      const filtered = exercises.filter(e => e.type === type);
      if (filtered.length) exercises = filtered;
    }

    const ex = pick(exercises, 1)[0];
    return { type: ex.type, prompt: ex.prompt, hint: ex.hint, topicId: topic ? topic.id : 'random' };
  }

  checkAnswer(topicId, exerciseIndex, userAnswer) {
    const topic = TOPICS.find(t => t.id === topicId);
    if (!topic) throw new Error('Topic not found: ' + topicId);
    const ex = topic.exercises[exerciseIndex];
    if (!ex) throw new Error('Exercise not found at index: ' + exerciseIndex);

    if (ex.answer.includes('...')) {
      const expectedParts = ex.answer.split('...').map(p => norm(p.trim()));
      const givenParts = userAnswer.split('...').map(p => norm(p.trim()));

      if (expectedParts.length === givenParts.length && expectedParts.every((ep, i) => ep === givenParts[i])) {
        return { correct: true, message: 'Richtig! Gut gemacht.' };
      }

      return {
        correct: false,
        expected: ex.answer,
        hint: ex.hint,
        message: `Nicht ganz. Expected: "${ex.answer}". Hint: ${ex.hint}`,
      };
    }

    const expected = norm(ex.answer);
    const given = norm(userAnswer);

    if (given === expected) {
      return { correct: true, message: 'Richtig! Gut gemacht.' };
    }

    if (expected.includes(given) && given.length > 1) {
      return { correct: true, partial: true, message: `Fast! Full answer: "${ex.answer}"`, hint: ex.hint };
    }

    return {
      correct: false,
      expected: ex.answer,
      hint: ex.hint,
      message: `Nicht ganz. Expected: "${ex.answer}". Hint: ${ex.hint}`,
    };
  }

  recordAssessment(studentId, topicId, grade) {
    grade = parseInt(grade, 10);
    if (!isValidGrade(grade, 1, 4)) throw new Error('Grade must be 1-4');
    const p = this.getProfile(studentId);
    const topic = TOPICS.find(t => t.id === topicId);
    if (!topic) throw new Error('Unknown topic: ' + topicId);

    if (!p.skills[topicId]) {
      p.skills[topicId] = { stability: 1, difficulty: 5, lastReview: null, nextReview: null, attempts: [] };
    }
    const sk = p.skills[topicId];
    sk.stability = fsrsUpdateStability(sk.stability || 1, sk.difficulty || 5, grade);
    sk.difficulty = fsrsUpdateDifficulty(sk.difficulty || 5, grade);
    sk.lastReview = today();
    const interval = fsrsNextReview(sk.stability, DEFAULT_RETENTION);
    const d = new Date(); d.setDate(d.getDate() + interval);
    sk.nextReview = d.toISOString().slice(0, 10);
    sk.attempts.push({ grade, date: today() });

    this._save(p);

    return {
      topicId, grade, nextReview: sk.nextReview, interval,
      mastery: masteryLabel(calcMastery(sk.attempts.map(a => ({ score: a.grade >= 3 ? 1 : 0, total: 1 })))),
    };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = this._topicsForLevel(level);
    const byCategory = {};

    for (const t of available) {
      if (!byCategory[t.category]) byCategory[t.category] = { total: 0, studied: 0, mastered: 0, topics: [] };
      const cat = byCategory[t.category];
      cat.total++;
      const sk = p.skills[t.id];
      const mastery = sk ? calcMastery(sk.attempts.map(a => ({ score: a.grade >= 3 ? 1 : 0, total: 1 }))) : 0;
      const status = !sk ? 'not-started' : mastery >= MASTERY_THRESHOLD ? 'mastered' : 'in-progress';
      if (sk) cat.studied++;
      if (status === 'mastered') cat.mastered++;
      cat.topics.push({ id: t.id, name: t.name, level: t.level, status, mastery: Math.round(mastery * 100) + '%' });
    }

    return { studentId, level, categories: byCategory };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const next = this.getNextTopics(studentId);

    let totalStudied = 0, totalMastered = 0, totalItems = 0;
    for (const [, data] of Object.entries(progress.categories)) {
      totalStudied += data.studied;
      totalMastered += data.mastered;
      totalItems += data.total;
    }

    return {
      studentId, level: p.level || 'A1',
      summary: { totalItems, totalStudied, totalMastered },
      categories: progress.categories,
      recommendations: next,
    };
  }

  getNextTopics(studentId, count) {
    const n = parseInt(count, 10) || 5;
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = this._topicsForLevel(level);
    const td = today();

    const due = [];
    const unseen = [];
    for (const t of available) {
      const sk = p.skills[t.id];
      if (!sk) { unseen.push({ id: t.id, name: t.name, level: t.level, reason: 'new' }); continue; }
      if (sk.nextReview && sk.nextReview <= td) {
        due.push({ id: t.id, name: t.name, level: t.level, nextReview: sk.nextReview, reason: 'due' });
      }
    }

    return { studentId, due: due.slice(0, n), unseen: unseen.slice(0, n), totalDue: due.length, totalUnseen: unseen.length };
  }

  listTopics(level) {
    let topics = TOPICS;
    if (level) {
      const lv = level.toUpperCase();
      if (!CEFR.includes(lv)) throw new Error('Invalid level: ' + level);
      topics = TOPICS.filter(t => t.level === lv);
    }
    return topics.map(t => ({ id: t.id, name: t.name, level: t.level, category: t.category }));
  }

  getScoba(topicId) {
    const topic = TOPICS.find(t => t.id === topicId);
    if (!topic) throw new Error('Topic not found: ' + topicId);
    return { id: topic.id, name: topic.name, level: topic.level, scoba: topic.scoba };
  }

  listStudents() { return listProfiles(this.dir); }
}

// ─── Exports ─────────────────────────────────────────────────────────────────

module.exports = { GrammarTutor, TOPICS };

// ─── CLI ────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const tutor = new GrammarTutor();

  runCLI((cmd, args, out) => {
    const sid = args[1] || 'default';
    switch (cmd) {
      case 'start':
        out(tutor.getProfile(sid));
        break;
      case 'set-level':
        out(tutor.setLevel(sid, args[2] || ''));
        break;
      case 'lesson':
        out(tutor.generateLesson(sid, args[2] || null));
        break;
      case 'exercise':
        out(tutor.generateExercise(sid, args[2] || null, args[3] || null));
        break;
      case 'check':
        out(tutor.checkAnswer(args[2], parseInt(args[3], 10), args.slice(4).join(' ')));
        break;
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
        out(tutor.getNextTopics(sid, args[2]));
        break;
      case 'topics':
        out(tutor.listTopics(args[2] || null));
        break;
      case 'scoba':
        out(tutor.getScoba(args[2]));
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
}
