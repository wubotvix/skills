// German Vocabulary Tutor — complete implementation with embedded data
// Usage: node tutor.js <command> [args...]
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'german-vocabulary';
const MAX_NEW_PER_SESSION = 7;

// ─── Embedded Word Banks by CEFR Level ───────────────────────────────────────

const WORD_BANKS = {
  A1: [
    // Greetings
    { word: 'hallo', article: null, category: 'greetings', definition: 'hello',
      exampleSentence: 'Hallo, wie geht es dir?', collocations: ['hallo sagen', 'hallo zusammen'], falseFriends: null },
    { word: 'tschüss', article: null, category: 'greetings', definition: 'bye (informal)',
      exampleSentence: 'Tschüss, bis morgen!', collocations: ['tschüss sagen', 'na dann tschüss'], falseFriends: null },
    { word: 'guten Morgen', article: null, category: 'greetings', definition: 'good morning',
      exampleSentence: 'Guten Morgen, Frau Müller.', collocations: ['einen guten Morgen wünschen'], falseFriends: null },
    { word: 'danke', article: null, category: 'greetings', definition: 'thank you',
      exampleSentence: 'Vielen Dank für Ihre Hilfe.', collocations: ['vielen Dank', 'danke schön', 'Gott sei Dank'], falseFriends: null },
    // Food
    { word: 'Wasser', article: 'das', category: 'food', definition: 'water',
      exampleSentence: 'Das Wasser ist sehr kalt.', collocations: ['Mineralwasser', 'ein Glas Wasser', 'Wasser mit Kohlensäure'], falseFriends: null },
    { word: 'Brot', article: 'das', category: 'food', definition: 'bread',
      exampleSentence: 'Ich kaufe das Brot beim Bäcker.', collocations: ['Brot mit Butter', 'Vollkornbrot', 'eine Scheibe Brot'], falseFriends: null },
    { word: 'Milch', article: 'die', category: 'food', definition: 'milk',
      exampleSentence: 'Ich trinke die Milch zum Frühstück.', collocations: ['Vollmilch', 'fettarme Milch', 'Kaffee mit Milch'], falseFriends: null },
    { word: 'Apfel', article: 'der', category: 'food', definition: 'apple',
      exampleSentence: 'Der rote Apfel ist sehr süß.', collocations: ['Apfelsaft', 'Apfelkuchen', 'in den sauren Apfel beißen'], falseFriends: null },
    // Family
    { word: 'Mutter', article: 'die', category: 'family', definition: 'mother',
      exampleSentence: 'Meine Mutter kocht sehr gut.', collocations: ['Muttersprache', 'Muttertag', 'alleinerziehende Mutter'], falseFriends: null },
    { word: 'Vater', article: 'der', category: 'family', definition: 'father',
      exampleSentence: 'Mein Vater arbeitet im Krankenhaus.', collocations: ['Vaterland', 'Vatertag', 'Stiefvater'], falseFriends: null },
    { word: 'Bruder', article: 'der', category: 'family', definition: 'brother',
      exampleSentence: 'Mein großer Bruder heißt Thomas.', collocations: ['Halbbruder', 'Bruder und Schwester'], falseFriends: null },
    { word: 'Freund', article: 'der', category: 'family', definition: 'friend; boyfriend',
      exampleSentence: 'Mein Freund wohnt in der Nähe.', collocations: ['bester Freund', 'Freund und Helfer', 'feste Freundin'], falseFriends: { en: 'Can mean "boyfriend" — context matters' } },
    // Everyday objects
    { word: 'Haus', article: 'das', category: 'everyday', definition: 'house',
      exampleSentence: 'Das Haus hat einen großen Garten.', collocations: ['zu Hause', 'Einfamilienhaus', 'nach Hause gehen'], falseFriends: null },
    { word: 'Buch', article: 'das', category: 'everyday', definition: 'book',
      exampleSentence: 'Ich lese jede Woche ein Buch.', collocations: ['Lehrbuch', 'Taschenbuch', 'ein Buch lesen'], falseFriends: null },
    { word: 'Tisch', article: 'der', category: 'everyday', definition: 'table',
      exampleSentence: 'Der Tisch im Esszimmer ist aus Holz.', collocations: ['den Tisch decken', 'Schreibtisch', 'am Tisch sitzen'], falseFriends: null },
    { word: 'Straße', article: 'die', category: 'everyday', definition: 'street',
      exampleSentence: 'Die Straße ist voller Menschen.', collocations: ['Hauptstraße', 'die Straße überqueren', 'auf der Straße'], falseFriends: null },
    // Time
    { word: 'Tag', article: 'der', category: 'time', definition: 'day',
      exampleSentence: 'Heute ist ein sehr schöner Tag.', collocations: ['jeden Tag', 'guten Tag', 'Feiertag'], falseFriends: null },
    { word: 'Nacht', article: 'die', category: 'time', definition: 'night',
      exampleSentence: 'Die Nacht ist hier sehr ruhig.', collocations: ['gute Nacht', 'in der Nacht', 'über Nacht'], falseFriends: null },
    { word: 'heute', article: null, category: 'time', definition: 'today',
      exampleSentence: 'Heute gehen wir in den Park.', collocations: ['heute Morgen', 'heute Abend', 'heutzutage'], falseFriends: null },
    { word: 'groß', article: null, category: 'adjectives', definition: 'big / tall',
      exampleSentence: 'Diese Stadt ist sehr groß.', collocations: ['im Großen und Ganzen', 'großartig'], falseFriends: null },
  ],

  A2: [
    // Travel
    { word: 'Gepäck', article: 'das', category: 'travel', definition: 'luggage / baggage',
      exampleSentence: 'Mein Gepäck wiegt zu viel.', collocations: ['Handgepäck', 'Gepäck aufgeben', 'Gepäck abholen'], falseFriends: null },
    { word: 'Fahrkarte', article: 'die', category: 'travel', definition: 'ticket (transport)',
      exampleSentence: 'Ich muss eine Fahrkarte kaufen.', collocations: ['Hin- und Rückfahrkarte', 'Einzelfahrkarte', 'Fahrkarte entwerten'], falseFriends: null },
    { word: 'Bahnhof', article: 'der', category: 'travel', definition: 'train station',
      exampleSentence: 'Der Bahnhof ist weit entfernt.', collocations: ['Hauptbahnhof', 'am Bahnhof ankommen', 'zum Bahnhof fahren'], falseFriends: null },
    { word: 'Koffer', article: 'der', category: 'travel', definition: 'suitcase',
      exampleSentence: 'Ich packe heute Abend meinen Koffer.', collocations: ['den Koffer packen', 'Rollkoffer', 'aus dem Koffer leben'], falseFriends: null },
    // Food (expanded)
    { word: 'Fleisch', article: 'das', category: 'food', definition: 'meat',
      exampleSentence: 'Das Rindfleisch ist mein Lieblingsgericht.', collocations: ['Rindfleisch', 'Hackfleisch', 'Fleisch braten'], falseFriends: null },
    { word: 'Fisch', article: 'der', category: 'food', definition: 'fish',
      exampleSentence: 'Der frische Fisch schmeckt besser.', collocations: ['Fisch braten', 'gebratener Fisch', 'Fischstäbchen'], falseFriends: null },
    { word: 'Rechnung', article: 'die', category: 'food', definition: 'bill / check; invoice',
      exampleSentence: 'Die Rechnung, bitte.', collocations: ['die Rechnung bezahlen', 'auf Rechnung', 'Rechnung tragen'],
      falseFriends: { en: 'Not "reckoning" — means bill/invoice' } },
    { word: 'Trinkgeld', article: 'das', category: 'food', definition: 'tip (gratuity)',
      exampleSentence: 'Wir haben ein großzügiges Trinkgeld gegeben.', collocations: ['Trinkgeld geben', 'Trinkgeld lassen'], falseFriends: null },
    // Shopping
    { word: 'Geschäft', article: 'das', category: 'shopping', definition: 'shop / business',
      exampleSentence: 'Das Geschäft schließt um neun.', collocations: ['Lebensmittelgeschäft', 'ein Geschäft machen', 'Geschäft eröffnen'], falseFriends: null },
    { word: 'Preis', article: 'der', category: 'shopping', definition: 'price',
      exampleSentence: 'Der Preis für Obst ist gestiegen.', collocations: ['guter Preis', 'halber Preis', 'Festpreis'], falseFriends: null },
    { word: 'Geld', article: 'das', category: 'shopping', definition: 'money',
      exampleSentence: 'Ich habe nicht genug Geld.', collocations: ['Geld verdienen', 'Geld sparen', 'Bargeld'], falseFriends: null },
    { word: 'billig', article: null, category: 'shopping', definition: 'cheap / inexpensive',
      exampleSentence: 'Dieses Restaurant ist sehr billig.', collocations: ['billig einkaufen', 'billiger'], falseFriends: null },
    // Weather
    { word: 'Regen', article: 'der', category: 'weather', definition: 'rain',
      exampleSentence: 'Der Regen hört seit gestern nicht auf.', collocations: ['starker Regen', 'Regentag', 'im Regen stehen'], falseFriends: null },
    { word: 'Sonne', article: 'die', category: 'weather', definition: 'sun',
      exampleSentence: 'Heute scheint die Sonne.', collocations: ['Sonnenschein', 'Sonnenbrille', 'Sonnenuntergang'], falseFriends: null },
    { word: 'kalt', article: null, category: 'weather', definition: 'cold',
      exampleSentence: 'Im Winter ist es sehr kalt.', collocations: ['kalt werden', 'mir ist kalt', 'eiskalt'], falseFriends: null },
    // Health
    { word: 'Kopf', article: 'der', category: 'health', definition: 'head',
      exampleSentence: 'Mir tut der Kopf weh.', collocations: ['Kopfschmerzen', 'den Kopf schütteln', 'Kopf hoch!'], falseFriends: null },
    { word: 'Arzt', article: 'der', category: 'health', definition: 'doctor',
      exampleSentence: 'Ich habe morgen einen Termin beim Arzt.', collocations: ['zum Arzt gehen', 'Hausarzt', 'Facharzt'], falseFriends: null },
    { word: 'krank', article: null, category: 'health', definition: 'sick / ill',
      exampleSentence: 'Mein Sohn ist heute krank.', collocations: ['krank werden', 'sich krank melden', 'Krankenhaus'], falseFriends: null },
    { word: 'Rezept', article: 'das', category: 'health', definition: 'prescription; recipe',
      exampleSentence: 'Der Arzt hat mir ein Rezept gegeben.', collocations: ['Rezept einlösen', 'Kochrezept', 'rezeptpflichtig'], falseFriends: null },
    { word: 'Schmerz', article: 'der', category: 'health', definition: 'pain / ache',
      exampleSentence: 'Ich habe starke Schmerzen im Rücken.', collocations: ['Kopfschmerzen', 'Bauchschmerzen', 'Schmerzen lindern'], falseFriends: null },
  ],

  B1: [
    // Work
    { word: 'Unternehmen', article: 'das', category: 'work', definition: 'company / enterprise',
      exampleSentence: 'Ich arbeite in einem Technologieunternehmen.', collocations: ['ein Unternehmen gründen', 'Familienunternehmen', 'mittelständisches Unternehmen'], falseFriends: null },
    { word: 'Besprechung', article: 'die', category: 'work', definition: 'meeting',
      exampleSentence: 'Die Besprechung beginnt um zehn Uhr.', collocations: ['eine Besprechung haben', 'Besprechungsraum', 'eine Besprechung einberufen'], falseFriends: null },
    { word: 'Gehalt', article: 'das', category: 'work', definition: 'salary',
      exampleSentence: 'Dieses Jahr bekomme ich eine Gehaltserhöhung.', collocations: ['festes Gehalt', 'Gehalt bekommen', 'Mindestgehalt'], falseFriends: null },
    { word: 'Chef', article: 'der', category: 'work', definition: 'boss',
      exampleSentence: 'Mein Chef ist sehr anspruchsvoll, aber fair.', collocations: ['Chefin', 'Abteilungsleiter'], falseFriends: null },
    { word: 'Bewerbung', article: 'die', category: 'work', definition: 'application (job)',
      exampleSentence: 'Ich habe gestern meine Bewerbung abgeschickt.', collocations: ['Bewerbungsschreiben', 'sich bewerben', 'Bewerbungsunterlagen'], falseFriends: null },
    // Emotions
    { word: 'Hoffnung', article: 'die', category: 'emotions', definition: 'hope',
      exampleSentence: 'Ich habe die Hoffnung, dass alles gut wird.', collocations: ['die Hoffnung verlieren', 'Hoffnung haben', 'Hoffnungsschimmer'], falseFriends: null },
    { word: 'stolz', article: null, category: 'emotions', definition: 'proud',
      exampleSentence: 'Ich bin sehr stolz auf meine Tochter.', collocations: ['stolz auf etwas sein', 'sich stolz fühlen'], falseFriends: null },
    { word: 'besorgt', article: null, category: 'emotions', definition: 'worried',
      exampleSentence: 'Ich bin besorgt wegen der Prüfung.', collocations: ['besorgt sein um/wegen', 'besorgt aussehen'], falseFriends: null },
    { word: 'Scham', article: 'die', category: 'emotions', definition: 'shame / embarrassment',
      exampleSentence: 'Mir ist es eine Scham, öffentlich zu sprechen.', collocations: ['sich schämen', 'Schamgefühl', 'schamlos'],
      falseFriends: { en: 'Not "sham" (Schwindel/Betrug)' } },
    // False friends cluster
    { word: 'Erfolg', article: 'der', category: 'abstract', definition: 'success',
      exampleSentence: 'Der Film war ein großer Erfolg.', collocations: ['Erfolg haben', 'großer Erfolg', 'erfolgreich'],
      falseFriends: { en: '"Erfolg" means success, not "a follow-up"' } },
    { word: 'bekommen', article: null, category: 'abstract', definition: 'to receive / to get',
      exampleSentence: 'Ich habe ein Geschenk bekommen.', collocations: ['Geld bekommen', 'Besuch bekommen', 'Angst bekommen'],
      falseFriends: { en: '"bekommen" means "to get/receive", NOT "to become" (which is "werden")' } },
    { word: 'aktuell', article: null, category: 'abstract', definition: 'current / up-to-date',
      exampleSentence: 'Die aktuelle Situation ist kompliziert.', collocations: ['aktuell sein', 'aktuelle Nachrichten'],
      falseFriends: { en: '"aktuell" means "current", NOT "actual" (which is "tatsächlich/eigentlich")' } },
    { word: 'sensibel', article: null, category: 'abstract', definition: 'sensitive',
      exampleSentence: 'Er ist ein sehr sensibler Mensch.', collocations: ['sensibel sein', 'sensibles Thema'],
      falseFriends: { en: '"sensibel" means "sensitive", NOT "sensible" (which is "vernünftig")' } },
    // Education
    { word: 'Fach', article: 'das', category: 'education', definition: 'subject (school)',
      exampleSentence: 'Mathematik ist mein Lieblingsfach.', collocations: ['Fach wählen', 'Hauptfach', 'Nebenfach'], falseFriends: null },
    { word: 'Notizen', article: 'die (pl.)', category: 'education', definition: 'notes',
      exampleSentence: 'Ich mache Notizen in jeder Vorlesung.', collocations: ['Notizen machen', 'sich Notizen machen'], falseFriends: null },
    { word: 'Stipendium', article: 'das', category: 'education', definition: 'scholarship / grant',
      exampleSentence: 'Ich habe ein Stipendium bekommen, um in Berlin zu studieren.', collocations: ['Stipendium beantragen', 'Stipendium erhalten', 'Stipendiat'], falseFriends: null },
    // Daily life
    { word: 'Gewohnheit', article: 'die', category: 'daily', definition: 'habit / custom',
      exampleSentence: 'Ich habe die Gewohnheit, nach dem Abendessen spazieren zu gehen.', collocations: ['aus Gewohnheit', 'eine Gewohnheit haben', 'schlechte Gewohnheit'], falseFriends: null },
    { word: 'umziehen', article: null, category: 'daily', definition: 'to move (change residence); to change clothes',
      exampleSentence: 'Wir sind letzten Monat nach München umgezogen.', collocations: ['in eine neue Wohnung umziehen', 'sich umziehen'], falseFriends: null },
    { word: 'mieten', article: null, category: 'daily', definition: 'to rent',
      exampleSentence: 'Ich möchte eine Wohnung im Zentrum mieten.', collocations: ['eine Wohnung mieten', 'ein Auto mieten', 'Mietwohnung'], falseFriends: null },
    { word: 'sich beschweren', article: null, category: 'daily', definition: 'to complain',
      exampleSentence: 'Er beschwert sich immer über den Lärm.', collocations: ['sich beschweren über', 'Beschwerde einreichen'], falseFriends: null },
  ],

  B2: [
    // Work (advanced)
    { word: 'Kündigung', article: 'die', category: 'work', definition: 'dismissal / termination',
      exampleSentence: 'Die Kündigung kam völlig unerwartet.', collocations: ['fristlose Kündigung', 'Kündigungsschreiben', 'Massenentlassung'], falseFriends: null },
    { word: 'Beförderung', article: 'die', category: 'work', definition: 'promotion (at work)',
      exampleSentence: 'Nach fünf Jahren hat er eine Beförderung bekommen.', collocations: ['eine Beförderung erhalten', 'beruflicher Aufstieg'], falseFriends: null },
    { word: 'Leistung', article: 'die', category: 'work', definition: 'performance / achievement',
      exampleSentence: 'Die Leistung des Teams hat sich stark verbessert.', collocations: ['Höchstleistung', 'Leistungsdruck', 'Leistung verbessern'], falseFriends: null },
    { word: 'Unternehmer', article: 'der', category: 'work', definition: 'entrepreneur',
      exampleSentence: 'Er ist ein Unternehmer mit viel Weitblick.', collocations: ['Unternehmergeist', 'junger Unternehmer'], falseFriends: null },
    // Society
    { word: 'Ungleichheit', article: 'die', category: 'society', definition: 'inequality',
      exampleSentence: 'Die soziale Ungleichheit ist immer noch ein Problem.', collocations: ['Geschlechterungleichheit', 'Kluft der Ungleichheit', 'gegen Ungleichheit kämpfen'], falseFriends: null },
    { word: 'Staatsbürgerschaft', article: 'die', category: 'society', definition: 'citizenship',
      exampleSentence: 'Sie hat die deutsche Staatsbürgerschaft beantragt.', collocations: ['doppelte Staatsbürgerschaft', 'Staatsbürgerschaft erwerben'], falseFriends: null },
    { word: 'Demonstration', article: 'die', category: 'society', definition: 'demonstration / protest',
      exampleSentence: 'Es gab eine friedliche Demonstration auf dem Platz.', collocations: ['eine Demonstration organisieren', 'an einer Demonstration teilnehmen'], falseFriends: null },
    { word: 'Engagement', article: 'das', category: 'society', definition: 'commitment / involvement',
      exampleSentence: 'Sein Engagement für die Umwelt ist vorbildlich.', collocations: ['soziales Engagement', 'bürgerschaftliches Engagement'],
      falseFriends: { en: 'Less "engagement ring" — more "commitment/involvement"' } },
    // Abstract / academic
    { word: 'Nuance', article: 'die', category: 'abstract', definition: 'nuance / shade',
      exampleSentence: 'Es gibt eine wichtige Nuance in diesem Satz.', collocations: ['mit Nuancen', 'ohne Nuancen', 'Bedeutungsnuance'], falseFriends: null },
    { word: 'aufwerfen', article: null, category: 'abstract', definition: 'to raise (a question)',
      exampleSentence: 'Ich möchte eine wichtige Frage aufwerfen.', collocations: ['eine Frage aufwerfen', 'ein Problem aufwerfen'], falseFriends: null },
    { word: 'unerlässlich', article: null, category: 'abstract', definition: 'essential / indispensable',
      exampleSentence: 'Das Wörterbuch ist unerlässlich für diesen Kurs.', collocations: ['unerlässlich sein', 'als unerlässlich gelten'], falseFriends: null },
    { word: 'nutzen', article: null, category: 'abstract', definition: 'to use / to take advantage of',
      exampleSentence: 'Man muss das gute Wetter nutzen.', collocations: ['die Gelegenheit nutzen', 'die Zeit nutzen', 'Nutzen ziehen aus'], falseFriends: null },
    // False friends (B2)
    { word: 'Gift', article: 'das', category: 'daily', definition: 'poison',
      exampleSentence: 'Dieses Pflanzenschutzmittel enthält Gift.', collocations: ['giftig', 'Giftmüll', 'Gift und Galle spucken'],
      falseFriends: { en: '"Gift" means "poison" in German! "Gift/present" = "Geschenk"' } },
    { word: 'Handy', article: 'das', category: 'daily', definition: 'mobile phone',
      exampleSentence: 'Wo ist mein Handy?', collocations: ['Handynummer', 'Handy aufladen'],
      falseFriends: { en: '"Handy" = mobile phone, NOT "handy/useful" (which is "praktisch/nützlich")' } },
    { word: 'Rente', article: 'die', category: 'daily', definition: 'pension / retirement',
      exampleSentence: 'Er geht nächstes Jahr in Rente.', collocations: ['in Rente gehen', 'Rentenversicherung'],
      falseFriends: { en: '"Rente" = pension, NOT "rent" (which is "Miete")' } },
    // Environment
    { word: 'Umwelt', article: 'die', category: 'environment', definition: 'environment (natural)',
      exampleSentence: 'Wir müssen die Umwelt schützen.', collocations: ['Umweltschutz', 'Umweltverschmutzung', 'umweltfreundlich'], falseFriends: null },
    { word: 'nachhaltig', article: null, category: 'environment', definition: 'sustainable',
      exampleSentence: 'Wir brauchen eine nachhaltigere Entwicklung.', collocations: ['nachhaltige Entwicklung', 'nachhaltige Energie', 'Nachhaltigkeit'], falseFriends: null },
    { word: 'Rohstoff', article: 'der', category: 'environment', definition: 'raw material / resource',
      exampleSentence: 'Die natürlichen Rohstoffe sind begrenzt.', collocations: ['Rohstoffmangel', 'erneuerbare Rohstoffe'], falseFriends: null },
    { word: 'Fußabdruck', article: 'der', category: 'environment', definition: 'footprint',
      exampleSentence: 'Wir müssen unseren ökologischen Fußabdruck verringern.', collocations: ['CO2-Fußabdruck', 'ökologischer Fußabdruck'], falseFriends: null },
  ],

  C1: [
    // Academic / formal
    { word: 'Bereich', article: 'der', category: 'academic', definition: 'area / field / domain',
      exampleSentence: 'Im Bereich der Forschung sind die Ergebnisse vielversprechend.', collocations: ['im Bereich von', 'Arbeitsbereich', 'Fachbereich'], falseFriends: null },
    { word: 'angehen', article: null, category: 'academic', definition: 'to tackle / address',
      exampleSentence: 'Wir müssen dieses Thema ernsthaft angehen.', collocations: ['ein Problem angehen', 'eine Aufgabe angehen', 'Was mich angeht...'], falseFriends: null },
    { word: 'ausüben', article: null, category: 'academic', definition: 'to exercise / to carry out (a role)',
      exampleSentence: 'Sie übt eine Schlüsselrolle im Unternehmen aus.', collocations: ['einen Beruf ausüben', 'Druck ausüben', 'Einfluss ausüben'], falseFriends: null },
    { word: 'vermitteln', article: null, category: 'academic', definition: 'to convey / mediate / teach',
      exampleSentence: 'Es ist schwer, diese Idee in einer anderen Sprache zu vermitteln.', collocations: ['Wissen vermitteln', 'einen Eindruck vermitteln', 'zwischen... vermitteln'], falseFriends: null },
    { word: 'umfassen', article: null, category: 'academic', definition: 'to encompass / comprise',
      exampleSentence: 'Die Studie umfasst einen Zeitraum von zehn Jahren.', collocations: ['ein Thema umfassen', 'umfassend'], falseFriends: null },
    // Connectors
    { word: 'dennoch', article: null, category: 'connectors', definition: 'nevertheless / yet',
      exampleSentence: 'Der Plan ist riskant; dennoch lohnt es sich, es zu versuchen.', collocations: ['und dennoch'], falseFriends: null },
    { word: 'trotz', article: null, category: 'connectors', definition: 'despite / in spite of (+Gen)',
      exampleSentence: 'Trotz der Schwierigkeiten machte sie weiter.', collocations: ['trotz allem', 'trotzdem'], falseFriends: null },
    { word: 'hingegen', article: null, category: 'connectors', definition: 'on the other hand / in contrast',
      exampleSentence: 'Er bevorzugt Kino; sie hingegen bevorzugt Theater.', collocations: [], falseFriends: null },
    // Idiomatic
    { word: 'sich verlassen auf', article: null, category: 'idiomatic', definition: 'to rely on',
      exampleSentence: 'Du kannst dich auf mich verlassen.', collocations: ['sich auf jemanden verlassen', 'zuverlässig'], falseFriends: null },
    { word: 'für selbstverständlich halten', article: null, category: 'idiomatic', definition: 'to take for granted',
      exampleSentence: 'Halte nicht alles für selbstverständlich.', collocations: ['etwas für selbstverständlich halten'], falseFriends: null },
    { word: 'die Sache in die Hand nehmen', article: null, category: 'idiomatic', definition: 'to take charge of something',
      exampleSentence: 'Sie hat die Sache sofort in die Hand genommen.', collocations: ['die Initiative ergreifen'], falseFriends: null },
    // Abstract
    { word: 'Eifer', article: 'der', category: 'abstract', definition: 'zeal / eagerness',
      exampleSentence: 'Sein Eifer, sich zu verbessern, ist bewundernswert.', collocations: ['mit Eifer', 'Übereifer', 'eifrig'], falseFriends: null },
    { word: 'allmählich', article: null, category: 'abstract', definition: 'gradual(ly)',
      exampleSentence: 'Man beobachtet einen allmählichen Wandel der Einstellungen.', collocations: ['allmählich werden', 'allmähliche Veränderung'], falseFriends: null },
    { word: 'loslösen', article: null, category: 'abstract', definition: 'to detach / dissociate',
      exampleSentence: 'Es ist unmöglich, die Wirtschaft von der Politik loszulösen.', collocations: ['sich loslösen von', 'etwas von etwas loslösen'], falseFriends: null },
    { word: 'unvermeidlich', article: null, category: 'abstract', definition: 'unavoidable / inevitable',
      exampleSentence: 'Die Reform des Systems ist eine unvermeidliche Aufgabe.', collocations: ['unvermeidliche Folgen', 'unvermeidlich sein'], falseFriends: null },
    // Formal
    { word: 'bearbeiten', article: null, category: 'formal', definition: 'to process / handle (paperwork)',
      exampleSentence: 'Ich muss meine Aufenthaltsgenehmigung bearbeiten lassen.', collocations: ['einen Antrag bearbeiten', 'Bearbeitung'], falseFriends: null },
    { word: 'gültig', article: null, category: 'formal', definition: 'valid / in force',
      exampleSentence: 'Das gültige Gesetz verbietet diese Praxis.', collocations: ['gültig sein', 'Gültigkeit', 'allgemeingültig'], falseFriends: null },
    { word: 'entscheiden', article: null, category: 'formal', definition: 'to decide / to rule',
      exampleSentence: 'Das Gericht entschied zugunsten des Klägers.', collocations: ['eine Entscheidung treffen', 'sich entscheiden für'], falseFriends: null },
    { word: 'kündigen', article: null, category: 'formal', definition: 'to terminate / cancel (a contract)',
      exampleSentence: 'Die Firma hat beschlossen, den Vertrag zu kündigen.', collocations: ['einen Vertrag kündigen', 'eine Stelle kündigen', 'Kündigung'], falseFriends: null },
  ],

  C2: [
    // Literary
    { word: 'Bedürfnis', article: 'das', category: 'literary', definition: 'need / necessity',
      exampleSentence: 'Es ist ein dringendes Bedürfnis, mit Besonnenheit zu handeln.', collocations: ['ein Bedürfnis befriedigen', 'Grundbedürfnis'], falseFriends: null },
    { word: 'sich ereignen', article: null, category: 'literary', definition: 'to occur / take place (formal)',
      exampleSentence: 'Die Ereignisse, die sich in jenem Sommer ereigneten, veränderten alles.', collocations: ['ein Unglück ereignet sich', 'Ereignis'], falseFriends: null },
    { word: 'Abgrenzung', article: 'die', category: 'literary', definition: 'demarcation / delimitation',
      exampleSentence: 'Die Abgrenzung zwischen beiden Konzepten ist nicht klar.', collocations: ['Abgrenzung von Verantwortlichkeiten', 'begriffliche Abgrenzung'], falseFriends: null },
    { word: 'erahnen', article: null, category: 'literary', definition: 'to sense / to have a presentiment of',
      exampleSentence: 'Man kann einen Wandel am politischen Horizont erahnen.', collocations: ['eine Lösung erahnen', 'die Zukunft erahnen'], falseFriends: null },
    // Colloquial
    { word: 'schuften', article: null, category: 'colloquial', definition: 'to slog / work hard (informal)',
      exampleSentence: 'Ich habe den ganzen Tag geschuftet.', collocations: ['hart schuften', 'Schufterei'], falseFriends: null },
    { word: 'geil', article: null, category: 'colloquial', definition: 'awesome / cool (informal, Germany)',
      exampleSentence: 'Das Konzert war echt geil!', collocations: ['mega geil', 'total geil'], falseFriends: null },
    { word: 'krass', article: null, category: 'colloquial', definition: 'extreme / intense / crazy (informal)',
      exampleSentence: 'Das war echt krass, was da passiert ist.', collocations: ['krass gut', 'krasser Typ'], falseFriends: null },
    // Idioms / fixed expressions
    { word: 'nicht mehr mitkommen', article: null, category: 'idiomatic', definition: 'to not be able to keep up',
      exampleSentence: 'Bei so vielen Bestellungen kommen wir nicht mehr mit.', collocations: ['nicht mitkommen bei'], falseFriends: null },
    { word: 'strikt', article: null, category: 'idiomatic', definition: 'strictly / to the letter',
      exampleSentence: 'Er hält sich strikt an die Regeln.', collocations: ['strikt einhalten', 'strikt befolgen'], falseFriends: null },
    { word: 'den Nagel auf den Kopf treffen', article: null, category: 'idiomatic', definition: 'to hit the nail on the head',
      exampleSentence: 'Mit dieser Bemerkung hast du den Nagel auf den Kopf getroffen.', collocations: ['den Nagel auf den Kopf treffen'], falseFriends: null },
    // Academic
    { word: 'umgehen', article: null, category: 'academic', definition: 'to avoid / bypass; to handle',
      exampleSentence: 'Wir können die ethischen Verantwortlichkeiten nicht umgehen.', collocations: ['ein Problem umgehen', 'mit etwas umgehen'], falseFriends: null },
    { word: 'zugrunde liegen', article: null, category: 'academic', definition: 'to underlie',
      exampleSentence: 'Die dem Konflikt zugrunde liegenden Ursachen sind komplex.', collocations: ['einer Sache zugrunde liegen', 'zugrunde liegend'], falseFriends: null },
    { word: 'verknüpfen', article: null, category: 'academic', definition: 'to link / connect',
      exampleSentence: 'Es verketteten sich mehrere Fehler, die die Krise auslösten.', collocations: ['Ideen verknüpfen', 'Fakten verknüpfen'], falseFriends: null },
    { word: 'erläutern', article: null, category: 'academic', definition: 'to elucidate / explain in detail',
      exampleSentence: 'Sie versuchten, die Ursachen des Unfalls zu erläutern.', collocations: ['eine Frage erläutern', 'näher erläutern', 'Erläuterung'], falseFriends: null },
    { word: 'anführen', article: null, category: 'academic', definition: 'to cite / to put forward (an argument)',
      exampleSentence: 'Er führte sehr überzeugende Argumente an.', collocations: ['ein Argument anführen', 'Gründe anführen', 'als Beispiel anführen'], falseFriends: null },
    // Regional variation
    { word: 'Brötchen', article: 'das', category: 'regional', definition: 'bread roll (north Germany)',
      exampleSentence: 'Ich hätte gern zwei Brötchen.', collocations: ['Brötchen holen'],
      falseFriends: { note: 'In Bavaria/Austria: "Semmel"; in Switzerland: "Brötli/Wegge"' } },
    { word: 'Fahrrad', article: 'das', category: 'regional', definition: 'bicycle',
      exampleSentence: 'Ich fahre mit dem Fahrrad zur Arbeit.', collocations: ['Fahrrad fahren'],
      falseFriends: { note: 'In parts of northern Germany also called "Rad" or colloquially "Drahtesel"' } },
    { word: 'schauen', article: null, category: 'regional', definition: 'to look (southern German/Austrian)',
      exampleSentence: 'Schau mal, was ich gefunden habe!', collocations: ['mal schauen'],
      falseFriends: { note: 'Northern Germany prefers "gucken" or "sehen"' } },
    { word: 'Karotte', article: 'die', category: 'regional', definition: 'carrot',
      exampleSentence: 'Ich kaufe ein Kilo Karotten.', collocations: ['Karottensaft'],
      falseFriends: { note: 'Also: Möhre (north), Rüebli (Swiss), gelbe Rübe (south)' } },
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
    prompt: `What does "${targetWord.article ? targetWord.article + ' ' : ''}${targetWord.word}" mean?`,
    options,
    answer: targetWord.definition,
    word: targetWord.word,
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
  const pairs = items.map(w => ({
    word: (w.article ? w.article + ' ' : '') + w.word,
    definition: w.definition,
  }));
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
    falseFriends: targetWord.falseFriends,
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
    prompt: `Which is a common collocation with "${targetWord.article ? targetWord.article + ' ' : ''}${targetWord.word}"?`,
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
      message: correctCount === exercise.pairs.length ? 'Perfekt!' : `${correctCount}/${exercise.pairs.length} correct.`,
    };
  }

  const expected = normalise(exercise.answer);
  const given = normalise(userAnswer);

  if (given === expected) {
    return { correct: true, message: 'Richtig! Gut gemacht.' };
  }

  if (expected.includes(given) && given.length > 2) {
    return { correct: true, partial: true, message: `Fast richtig — the full answer is "${exercise.answer}".` };
  }

  return {
    correct: false,
    message: `Nicht ganz. The answer is "${exercise.answer}".`,
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
        article: w.article,
        definition: w.definition,
        exampleSentence: w.exampleSentence,
        collocations: w.collocations,
        falseFriends: w.falseFriends,
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
      return { [lvl]: (WORD_BANKS[lvl] || []).map(w => ({ word: w.word, article: w.article, definition: w.definition, category: w.category })) };
    }
    const catalog = {};
    for (const l of core.CEFR) {
      if (WORD_BANKS[l]) {
        catalog[l] = WORD_BANKS[l].map(w => ({ word: w.word, article: w.article, definition: w.definition, category: w.category }));
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
