// Romanian Vocabulary Tutor — complete implementation with embedded data
// Usage: node tutor.js <command> [args...]
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'romanian-vocabulary';
const MAX_NEW_PER_SESSION = 7;

// -- Embedded Word Banks by CEFR Level ----------------------------------------

const WORD_BANKS = {
  A1: [
    // Greetings
    { word: 'bună ziua', article: null, gender: null, category: 'greetings', definition: 'good day / hello (formal)',
      exampleSentence: 'Bună ziua, doamnă Popescu!', collocations: ['a spune bună ziua'], falseFriends: null },
    { word: 'mulțumesc', article: null, gender: null, category: 'greetings', definition: 'thank you',
      exampleSentence: 'Mulțumesc foarte mult pentru ajutor.', collocations: ['mulțumesc mult', 'vă mulțumesc'], falseFriends: null },
    { word: 'la revedere', article: null, gender: null, category: 'greetings', definition: 'goodbye (formal)',
      exampleSentence: 'La revedere și drum bun!', collocations: ['a spune la revedere'], falseFriends: null },
    { word: 'vă rog', article: null, gender: null, category: 'greetings', definition: 'please (formal)',
      exampleSentence: 'Vă rog, un bilet la Cluj.', collocations: ['vă rog frumos'], falseFriends: null },
    // Food
    { word: 'apă', article: null, gender: 'f', category: 'food', definition: 'water',
      exampleSentence: 'Apa este foarte rece.', collocations: ['apă minerală', 'pahar de apă', 'apă plată'], falseFriends: null },
    { word: 'pâine', article: null, gender: 'f', category: 'food', definition: 'bread',
      exampleSentence: 'Cumpăr pâine de la brutărie.', collocations: ['pâine proaspătă', 'felie de pâine'], falseFriends: null },
    { word: 'lapte', article: null, gender: 'n', category: 'food', definition: 'milk',
      exampleSentence: 'Beau lapte la micul dejun.', collocations: ['lapte de vacă', 'cafea cu lapte'], falseFriends: null },
    { word: 'măr', article: null, gender: 'n', category: 'food', definition: 'apple',
      exampleSentence: 'Mărul roșu este foarte dulce.', collocations: ['suc de mere', 'plăcintă cu mere'], falseFriends: null },
    // Family
    { word: 'mamă', article: null, gender: 'f', category: 'family', definition: 'mother',
      exampleSentence: 'Mama mea gătește foarte bine.', collocations: ['limba maternă', 'de mamă'], falseFriends: null },
    { word: 'tată', article: null, gender: 'm', category: 'family', definition: 'father',
      exampleSentence: 'Tatăl meu lucrează la spital.', collocations: ['tată de familie'], falseFriends: null },
    { word: 'frate', article: null, gender: 'm', category: 'family', definition: 'brother',
      exampleSentence: 'Fratele meu mare se cheamă Ion.', collocations: ['frate mai mare', 'frate geamăn'], falseFriends: null },
    { word: 'prieten', article: null, gender: 'm', category: 'family', definition: 'friend',
      exampleSentence: 'Prietenul meu locuiește aproape.', collocations: ['cel mai bun prieten', 'prieten apropiat'], falseFriends: null },
    // Everyday objects
    { word: 'casă', article: null, gender: 'f', category: 'everyday', definition: 'house',
      exampleSentence: 'Casa are o grădină mare.', collocations: ['acasă', 'casă de vacanță'], falseFriends: null },
    { word: 'carte', article: null, gender: 'f', category: 'everyday', definition: 'book',
      exampleSentence: 'Citesc o carte în fiecare săptămână.', collocations: ['carte de bucate', 'carte poștală'], falseFriends: null },
    { word: 'masă', article: null, gender: 'f', category: 'everyday', definition: 'table',
      exampleSentence: 'Masa din sufragerie este din lemn.', collocations: ['a pune masa', 'masă rotundă'], falseFriends: null },
    { word: 'stradă', article: null, gender: 'f', category: 'everyday', definition: 'street',
      exampleSentence: 'Strada este plină de oameni.', collocations: ['pe stradă', 'strada principală'], falseFriends: null },
    // Time
    { word: 'zi', article: null, gender: 'f', category: 'time', definition: 'day',
      exampleSentence: 'Astăzi este o zi frumoasă.', collocations: ['în fiecare zi', 'zi de naștere', 'zi lucrătoare'], falseFriends: null },
    { word: 'noapte', article: null, gender: 'f', category: 'time', definition: 'night',
      exampleSentence: 'Noaptea este foarte liniștită.', collocations: ['noapte bună', 'peste noapte'], falseFriends: null },
    { word: 'astăzi', article: null, gender: null, category: 'time', definition: 'today',
      exampleSentence: 'Astăzi mergem în parc.', collocations: ['de astăzi'], falseFriends: null },
    { word: 'mare', article: null, gender: null, category: 'adjectives', definition: 'big / large; sea',
      exampleSentence: 'Acest oraș este foarte mare.', collocations: ['Marea Neagră', 'în mare măsură'], falseFriends: null },
  ],

  A2: [
    // Travel
    { word: 'bagaj', article: null, gender: 'n', category: 'travel', definition: 'luggage',
      exampleSentence: 'Bagajul meu este prea greu.', collocations: ['bagaj de mână', 'a face bagajul'], falseFriends: null },
    { word: 'bilet', article: null, gender: 'n', category: 'travel', definition: 'ticket',
      exampleSentence: 'Am nevoie de un bilet de tren.', collocations: ['bilet dus-întors', 'bilet de avion', 'a cumpăra un bilet'], falseFriends: null },
    { word: 'gară', article: null, gender: 'f', category: 'travel', definition: 'train station',
      exampleSentence: 'Gara este în centrul orașului.', collocations: ['gară centrală', 'gara de nord'], falseFriends: null },
    { word: 'valiză', article: null, gender: 'f', category: 'travel', definition: 'suitcase',
      exampleSentence: 'Trebuie să fac valiza diseară.', collocations: ['a face valiza', 'valiză de călătorie'], falseFriends: null },
    // Food expanded
    { word: 'carne', article: null, gender: 'f', category: 'food', definition: 'meat',
      exampleSentence: 'Carnea de porc este preferata mea.', collocations: ['carne de vită', 'carne tocată', 'carne la grătar'], falseFriends: null },
    { word: 'pește', article: null, gender: 'm', category: 'food', definition: 'fish',
      exampleSentence: 'Peștele proaspăt este mai gustos.', collocations: ['pește la grătar', 'pește prăjit'], falseFriends: null },
    { word: 'notă de plată', article: null, gender: 'f', category: 'food', definition: 'bill / check',
      exampleSentence: 'Nota de plată, vă rog.', collocations: ['a cere nota de plată'], falseFriends: null },
    { word: 'bacșiș', article: null, gender: 'n', category: 'food', definition: 'tip (gratuity)',
      exampleSentence: 'Am lăsat un bacșiș generos.', collocations: ['a lăsa bacșiș', 'a da bacșiș'], falseFriends: null },
    // Shopping
    { word: 'magazin', article: null, gender: 'n', category: 'shopping', definition: 'store / shop',
      exampleSentence: 'Magazinul se închide la nouă.', collocations: ['magazin alimentar', 'magazin de haine'],
      falseFriends: { en: '"magazine" in English is "revistă" in Romanian' } },
    { word: 'preț', article: null, gender: 'n', category: 'shopping', definition: 'price',
      exampleSentence: 'Prețul fructelor a crescut.', collocations: ['preț bun', 'preț fix', 'la jumătate de preț'], falseFriends: null },
    { word: 'bani', article: null, gender: 'm', category: 'shopping', definition: 'money',
      exampleSentence: 'Nu am suficienți bani.', collocations: ['a câștiga bani', 'a economisi bani', 'bani gheață'], falseFriends: null },
    { word: 'ieftin', article: null, gender: null, category: 'shopping', definition: 'cheap / inexpensive',
      exampleSentence: 'Acest restaurant este foarte ieftin.', collocations: ['mai ieftin', 'ieftin de tot'], falseFriends: null },
    // Weather
    { word: 'ploaie', article: null, gender: 'f', category: 'weather', definition: 'rain',
      exampleSentence: 'Ploaia nu s-a oprit de ieri.', collocations: ['ploaie torențială', 'zi de ploaie'], falseFriends: null },
    { word: 'soare', article: null, gender: 'n', category: 'weather', definition: 'sun',
      exampleSentence: 'Astăzi este mult soare.', collocations: ['bătaie de soare', 'ochelari de soare', 'apus de soare'], falseFriends: null },
    { word: 'frig', article: null, gender: 'n', category: 'weather', definition: 'cold',
      exampleSentence: 'Iarna este foarte frig.', collocations: ['mi-e frig', 'frig de crapă pietrele'], falseFriends: null },
    // Health
    { word: 'cap', article: null, gender: 'n', category: 'health', definition: 'head',
      exampleSentence: 'Mă doare capul.', collocations: ['durere de cap', 'din cap'], falseFriends: null },
    { word: 'doctor', article: null, gender: 'm', category: 'health', definition: 'doctor',
      exampleSentence: 'Am programare la doctor mâine.', collocations: ['a merge la doctor', 'doctor de familie'], falseFriends: null },
    { word: 'bolnav', article: null, gender: null, category: 'health', definition: 'sick / ill',
      exampleSentence: 'Fiul meu este bolnav astăzi.', collocations: ['a fi bolnav', 'a se îmbolnăvi'], falseFriends: null },
    { word: 'rețetă', article: null, gender: 'f', category: 'health', definition: 'prescription; recipe',
      exampleSentence: 'Doctorul mi-a dat o rețetă.', collocations: ['rețetă medicală', 'rețetă de bucătărie'], falseFriends: null },
    { word: 'durere', article: null, gender: 'f', category: 'health', definition: 'pain / ache',
      exampleSentence: 'Am o durere puternică în spate.', collocations: ['durere de cap', 'durere de stomac', 'a calma durerea'], falseFriends: null },
  ],

  B1: [
    // Work
    { word: 'companie', article: null, gender: 'f', category: 'work', definition: 'company',
      exampleSentence: 'Lucrez într-o companie de tehnologie.', collocations: ['companie privată', 'a înființa o companie'], falseFriends: null },
    { word: 'ședință', article: null, gender: 'f', category: 'work', definition: 'meeting',
      exampleSentence: 'Ședința începe la zece.', collocations: ['a avea o ședință', 'sală de ședințe'], falseFriends: null },
    { word: 'salariu', article: null, gender: 'n', category: 'work', definition: 'salary',
      exampleSentence: 'Mi se va mări salariul anul acesta.', collocations: ['salariu fix', 'salariu minim'], falseFriends: null },
    { word: 'șef', article: null, gender: 'm', category: 'work', definition: 'boss',
      exampleSentence: 'Șeful meu este exigent dar corect.', collocations: ['șef de departament'], falseFriends: null },
    // Emotions
    { word: 'speranță', article: null, gender: 'f', category: 'emotions', definition: 'hope',
      exampleSentence: 'Am speranța că totul va fi bine.', collocations: ['a pierde speranța', 'rază de speranță'], falseFriends: null },
    { word: 'mândru', article: null, gender: null, category: 'emotions', definition: 'proud',
      exampleSentence: 'Sunt foarte mândru de fiica mea.', collocations: ['a fi mândru de', 'mândrie'], falseFriends: null },
    { word: 'îngrijorat', article: null, gender: null, category: 'emotions', definition: 'worried',
      exampleSentence: 'Sunt îngrijorat pentru examen.', collocations: ['a fi îngrijorat de/pentru'], falseFriends: null },
    // False friends
    { word: 'eventual', article: null, gender: null, category: 'abstract', definition: 'possibly / perhaps',
      exampleSentence: 'Eventual putem merge și noi.', collocations: ['eventual, dacă...'],
      falseFriends: { en: '"eventually" is "în cele din urmă" in Romanian' } },
    { word: 'actual', article: null, gender: null, category: 'abstract', definition: 'current / present',
      exampleSentence: 'Situația actuală este complicată.', collocations: ['în prezent', 'la momentul actual'],
      falseFriends: { en: '"actual" (real) is "real" or "adevărat"' } },
    { word: 'a realiza', article: null, gender: null, category: 'abstract', definition: 'to achieve / accomplish',
      exampleSentence: 'Vrem să realizăm acest proiect împreună.', collocations: ['a realiza un obiectiv', 'a realiza un studiu'],
      falseFriends: { en: '"to realize" (understand) is "a-și da seama"' } },
    { word: 'sensibil', article: null, gender: null, category: 'abstract', definition: 'sensitive',
      exampleSentence: 'Este o persoană foarte sensibilă.', collocations: ['a fi sensibil la', 'temă sensibilă'],
      falseFriends: { en: '"sensible" (reasonable) is "rezonabil" or "înțelept"' } },
    { word: 'magazin', article: null, gender: 'n', category: 'shopping', definition: 'store / shop',
      exampleSentence: 'Magazinul este deschis până la nouă.', collocations: ['magazin alimentar', 'a merge la magazin'],
      falseFriends: { en: '"magazine" is "revistă" in Romanian' } },
    // Education
    { word: 'materie', article: null, gender: 'f', category: 'education', definition: 'school subject',
      exampleSentence: 'Matematica este materia mea preferată.', collocations: ['materie obligatorie'], falseFriends: null },
    { word: 'notițe', article: null, gender: 'f', category: 'education', definition: 'notes',
      exampleSentence: 'Iau notițe la toate cursurile.', collocations: ['a lua notițe', 'caiet de notițe'], falseFriends: null },
    { word: 'bursă', article: null, gender: 'f', category: 'education', definition: 'scholarship / grant',
      exampleSentence: 'Am obținut o bursă pentru studii la Cluj.', collocations: ['bursă de studii', 'bursier'], falseFriends: null },
    // Daily life
    { word: 'obicei', article: null, gender: 'n', category: 'daily', definition: 'habit / custom',
      exampleSentence: 'Am obiceiul să mă plimb după cină.', collocations: ['de obicei', 'obicei vechi'], falseFriends: null },
    { word: 'a se muta', article: null, gender: null, category: 'daily', definition: 'to move (change residence)',
      exampleSentence: 'Ne-am mutat la București luna trecută.', collocations: ['a se muta în altă casă'], falseFriends: null },
    { word: 'a închiria', article: null, gender: null, category: 'daily', definition: 'to rent',
      exampleSentence: 'Vreau să închiriez un apartament în centru.', collocations: ['a închiria un apartament', 'chirie'], falseFriends: null },
    { word: 'a se plânge', article: null, gender: null, category: 'daily', definition: 'to complain',
      exampleSentence: 'Se plânge mereu de zgomot.', collocations: ['a se plânge de'], falseFriends: null },
  ],

  B2: [
    { word: 'concediere', article: null, gender: 'f', category: 'work', definition: 'dismissal / layoff',
      exampleSentence: 'Concedierea a fost complet neașteptată.', collocations: ['concediere colectivă', 'scrisoare de concediere'], falseFriends: null },
    { word: 'promovare', article: null, gender: 'f', category: 'work', definition: 'promotion',
      exampleSentence: 'După cinci ani, a obținut o promovare.', collocations: ['a obține o promovare'], falseFriends: null },
    { word: 'performanță', article: null, gender: 'f', category: 'work', definition: 'performance',
      exampleSentence: 'Performanța echipei s-a îmbunătățit mult.', collocations: ['performanță înaltă', 'performanță academică'], falseFriends: null },
    { word: 'antreprenor', article: null, gender: 'm', category: 'work', definition: 'entrepreneur',
      exampleSentence: 'Este un antreprenor cu multă viziune.', collocations: ['spirit antreprenorial', 'tânăr antreprenor'], falseFriends: null },
    // Society
    { word: 'inegalitate', article: null, gender: 'f', category: 'society', definition: 'inequality',
      exampleSentence: 'Inegalitatea socială rămâne o problemă.', collocations: ['inegalitate de gen', 'a lupta împotriva inegalității'], falseFriends: null },
    { word: 'cetățenie', article: null, gender: 'f', category: 'society', definition: 'citizenship',
      exampleSentence: 'A solicitat cetățenia română.', collocations: ['a obține cetățenia', 'dublă cetățenie'], falseFriends: null },
    { word: 'manifestație', article: null, gender: 'f', category: 'society', definition: 'demonstration / protest',
      exampleSentence: 'A fost o manifestație pașnică în piață.', collocations: ['a organiza o manifestație'], falseFriends: null },
    { word: 'compromis', article: null, gender: 'n', category: 'society', definition: 'commitment / compromise',
      exampleSentence: 'Angajamentul față de mediu este fundamental.', collocations: ['a ajunge la un compromis', 'fără compromis'], falseFriends: null },
    // Abstract
    { word: 'nuanță', article: null, gender: 'f', category: 'abstract', definition: 'nuance / shade',
      exampleSentence: 'Există o nuanță importantă în această frază.', collocations: ['cu nuanțe', 'nuanță de sens'], falseFriends: null },
    { word: 'a aborda', article: null, gender: null, category: 'abstract', definition: 'to address / to tackle',
      exampleSentence: 'Vreau să abordez o chestiune importantă.', collocations: ['a aborda o problemă', 'a aborda o temă'], falseFriends: null },
    { word: 'indispensabil', article: null, gender: null, category: 'abstract', definition: 'essential / indispensable',
      exampleSentence: 'Dicționarul este indispensabil pentru acest curs.', collocations: ['a fi indispensabil'], falseFriends: null },
    { word: 'a profita de', article: null, gender: null, category: 'abstract', definition: 'to take advantage of',
      exampleSentence: 'Trebuie să profităm de vremea bună.', collocations: ['a profita de ocazie', 'a profita de timp'], falseFriends: null },
    // False friends B2
    { word: 'librărie', article: null, gender: 'f', category: 'everyday', definition: 'bookstore',
      exampleSentence: 'Am cumpărat o carte de la librărie.', collocations: ['librărie online'],
      falseFriends: { en: '"library" is "bibliotecă" in Romanian' } },
    // Environment
    { word: 'mediu înconjurător', article: null, gender: 'n', category: 'environment', definition: 'environment (natural)',
      exampleSentence: 'Trebuie să protejăm mediul înconjurător.', collocations: ['protecția mediului', 'mediu sănătos'], falseFriends: null },
    { word: 'durabil', article: null, gender: null, category: 'environment', definition: 'sustainable',
      exampleSentence: 'Avem nevoie de o dezvoltare mai durabilă.', collocations: ['dezvoltare durabilă', 'energie durabilă'], falseFriends: null },
    { word: 'resursă', article: null, gender: 'f', category: 'environment', definition: 'resource',
      exampleSentence: 'Resursele naturale sunt limitate.', collocations: ['resurse naturale', 'resurse umane'], falseFriends: null },
    { word: 'amprentă', article: null, gender: 'f', category: 'environment', definition: 'footprint / trace',
      exampleSentence: 'Trebuie să reducem amprenta de carbon.', collocations: ['amprentă de carbon', 'amprentă ecologică'], falseFriends: null },
  ],

  C1: [
    { word: 'domeniu', article: null, gender: 'n', category: 'academic', definition: 'field / domain / scope',
      exampleSentence: 'În domeniul cercetării, rezultatele sunt promițătoare.', collocations: ['în domeniul', 'domeniu profesional'], falseFriends: null },
    { word: 'a aborda', article: null, gender: null, category: 'academic', definition: 'to address / to tackle',
      exampleSentence: 'Este necesar să abordăm această temă cu seriozitate.', collocations: ['a aborda o temă', 'a aborda o problemă'], falseFriends: null },
    { word: 'a îndeplini', article: null, gender: null, category: 'academic', definition: 'to fulfill / to carry out',
      exampleSentence: 'Îndeplinește un rol esențial în companie.', collocations: ['a îndeplini o funcție', 'a îndeplini un obiectiv'], falseFriends: null },
    { word: 'a cuprinde', article: null, gender: null, category: 'academic', definition: 'to encompass / to include',
      exampleSentence: 'Studiul cuprinde o perioadă de zece ani.', collocations: ['a cuprinde un domeniu', 'a cuprinde mai multe aspecte'], falseFriends: null },
    // Connectors
    { word: 'cu toate acestea', article: null, gender: null, category: 'connectors', definition: 'nevertheless / however',
      exampleSentence: 'Planul este riscant; cu toate acestea, merită încercat.', collocations: [], falseFriends: null },
    { word: 'în ciuda', article: null, gender: null, category: 'connectors', definition: 'despite / in spite of',
      exampleSentence: 'În ciuda dificultăților, a continuat.', collocations: ['în ciuda faptului că'], falseFriends: null },
    { word: 'în schimb', article: null, gender: null, category: 'connectors', definition: 'on the other hand / instead',
      exampleSentence: 'El preferă cinema; ea, în schimb, preferă teatrul.', collocations: [], falseFriends: null },
    // Idiomatic
    { word: 'a ține cont de', article: null, gender: null, category: 'idiomatic', definition: 'to take into account',
      exampleSentence: 'Trebuie să ținem cont de toate opiniile.', collocations: ['ținând cont de'], falseFriends: null },
    { word: 'a-și da seama', article: null, gender: null, category: 'idiomatic', definition: 'to realize / to become aware',
      exampleSentence: 'Nu mi-am dat seama că era atât de târziu.', collocations: ['îmi dau seama'], falseFriends: null },
    { word: 'a face față', article: null, gender: null, category: 'idiomatic', definition: 'to cope with / to face',
      exampleSentence: 'Ea a făcut față situației imediat.', collocations: ['a face față unei provocări'], falseFriends: null },
    // Abstract
    { word: 'dorință', article: null, gender: 'f', category: 'abstract', definition: 'desire / wish',
      exampleSentence: 'Dorința lui de a reuși este admirabilă.', collocations: ['dorință arzătoare', 'cu dorință'], falseFriends: null },
    { word: 'treptat', article: null, gender: null, category: 'abstract', definition: 'gradual',
      exampleSentence: 'Se observă o schimbare treptată a atitudinilor.', collocations: ['în mod treptat', 'schimbare treptată'], falseFriends: null },
    // Formal
    { word: 'a procesa', article: null, gender: null, category: 'formal', definition: 'to process (paperwork)',
      exampleSentence: 'Trebuie să procesez permisul de ședere.', collocations: ['a procesa o cerere', 'a procesa documentele'], falseFriends: null },
    { word: 'în vigoare', article: null, gender: null, category: 'formal', definition: 'in force / current / valid',
      exampleSentence: 'Legea în vigoare interzice această practică.', collocations: ['legislație în vigoare'], falseFriends: null },
  ],

  C2: [
    // Literary
    { word: 'dor', article: null, gender: 'n', category: 'literary', definition: 'longing / yearning (untranslatable Romanian concept)',
      exampleSentence: 'Mi-e dor de casă, de pădurile din copilărie.', collocations: ['mi-e dor de', 'dor de casă', 'dor de țară'], falseFriends: null },
    { word: 'a zăbovi', article: null, gender: null, category: 'literary', definition: 'to linger / to tarry (literary)',
      exampleSentence: 'A zăbovit în grădină până la apus.', collocations: ['a zăbovi asupra unui subiect'], falseFriends: null },
    { word: 'a tânji', article: null, gender: null, category: 'literary', definition: 'to yearn / to long for',
      exampleSentence: 'Tânjea după libertate.', collocations: ['a tânji după ceva'], falseFriends: null },
    { word: 'a zăvorî', article: null, gender: null, category: 'literary', definition: 'to bolt / to lock away',
      exampleSentence: 'Și-a zăvorît amintirile în suflet.', collocations: ['a zăvorî ușa'], falseFriends: null },
    // Colloquial
    { word: 'mișto', article: null, gender: null, category: 'colloquial', definition: 'cool / great (informal, Romania)',
      exampleSentence: 'Filmul ăla a fost super mișto!', collocations: ['e mișto', 'ce mișto'], falseFriends: null },
    { word: 'nasol', article: null, gender: null, category: 'colloquial', definition: 'bad / rough (informal)',
      exampleSentence: 'Situația e destul de nasolă.', collocations: ['e nasol', 'nasol rău'], falseFriends: null },
    { word: 'a se descurca', article: null, gender: null, category: 'colloquial', definition: 'to manage / to get by',
      exampleSentence: 'Mă descurc și singur, mulțumesc.', collocations: ['a se descurca bine', 'descurcăreț'], falseFriends: null },
    // Proverbs / fixed
    { word: 'a da din lac în puț', article: null, gender: null, category: 'idiomatic', definition: 'to go from bad to worse',
      exampleSentence: 'Cu decizia asta, am dat din lac în puț.', collocations: [], falseFriends: null },
    { word: 'a bate câmpii', article: null, gender: null, category: 'idiomatic', definition: 'to talk nonsense / beat around the bush',
      exampleSentence: 'Nu mai bate câmpii și spune ce vrei.', collocations: [], falseFriends: null },
    { word: 'floare la ureche', article: null, gender: null, category: 'idiomatic', definition: 'a piece of cake / very easy',
      exampleSentence: 'Examenul a fost floare la ureche.', collocations: ['a fi floare la ureche'], falseFriends: null },
    // Academic
    { word: 'a elucida', article: null, gender: null, category: 'academic', definition: 'to elucidate / to clarify',
      exampleSentence: 'Au încercat să elucideze cauzele accidentului.', collocations: ['a elucida o chestiune'], falseFriends: null },
    { word: 'a invoca', article: null, gender: null, category: 'academic', definition: 'to invoke / to put forward',
      exampleSentence: 'A invocat argumente foarte convingătoare.', collocations: ['a invoca un argument', 'a invoca motive'], falseFriends: null },
  ],
};

// -- Exercise Types -----------------------------------------------------------

const EXERCISE_TYPES = ['definition', 'fill-in-blank', 'matching', 'context-guess', 'collocation'];

function makeDefinitionExercise(targetWord, level) {
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const distractors = core.pick(bank.filter(w => w.word !== targetWord.word), 3)
    .map(w => w.definition);
  const options = core.shuffle([targetWord.definition, ...distractors]);
  return {
    type: 'definition',
    prompt: `What does "${targetWord.gender ? '(' + targetWord.gender + '.) ' : ''}${targetWord.word}" mean?`,
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
    word: (w.gender ? '(' + w.gender + '.) ' : '') + w.word,
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
    prompt: `Which is a common collocation with "${targetWord.gender ? '(' + targetWord.gender + '.) ' : ''}${targetWord.word}"?`,
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

// -- Answer Checking ----------------------------------------------------------

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
      message: correctCount === exercise.pairs.length ? 'Foarte bine!' : `${correctCount}/${exercise.pairs.length} correct.`,
    };
  }

  const expected = normalise(exercise.answer);
  const given = normalise(userAnswer);

  if (given === expected) {
    return { correct: true, message: 'Corect! Foarte bine.' };
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

// -- VocabularyTutor Class ----------------------------------------------------

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
    if (!p.assessments) p.assessments = [];
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

    if (!p.assessments) p.assessments = [];
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
      sessionsCount: (p.assessments || []).length,
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

// -- CLI ----------------------------------------------------------------------

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

module.exports = { VocabularyTutor, WORD_BANKS };
