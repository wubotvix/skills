#!/usr/bin/env node
'use strict';

const SKILL_NAME = 'italian-reading';

const core = require('../_lib/core');

// ---------------------------------------------------------------------------
// Embedded reading texts by CEFR level
// ---------------------------------------------------------------------------

const TEXTS = {
  A1: [
    {
      id: 'a1-bar',
      title: 'Al bar',
      type: 'dialogue',
      text:
        '— Buongiorno! Desidera?\n' +
        '— Buongiorno. Vorrei un caffè macchiato, per favore.\n' +
        '— Grande o piccolo?\n' +
        '— Piccolo. E anche un cornetto alla crema.\n' +
        '— Certo. Al banco o al tavolo?\n' +
        '— Al banco, grazie. Quanto viene?\n' +
        '— Due euro e cinquanta.\n' +
        '— Ecco a lei. Grazie!\n' +
        '— Grazie a lei. Buona giornata!',
      vocabulary: [
        { word: 'desidera', definition: 'would you like (formal)', example: 'Che cosa desidera ordinare?' },
        { word: 'cornetto', definition: 'croissant (Italian breakfast pastry)', example: 'Un cornetto alla crema e un caffè.' },
        { word: 'al banco', definition: 'at the counter', example: 'Al banco costa meno che al tavolo.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Che cosa ordina il cliente da bere?',
          options: ['Un tè', 'Un caffè macchiato', 'Un cappuccino', 'Un succo'],
          answer: 1,
          explanation: 'Il cliente dice "Vorrei un caffè macchiato."',
        },
        {
          question: 'Dove consuma?',
          options: ['Al tavolo', 'Al banco', 'A casa', 'Non dice'],
          answer: 1,
          explanation: 'Il cliente dice "Al banco, grazie."',
        },
        {
          question: 'Quanto costa in tutto?',
          options: ['Un euro e cinquanta', 'Due euro', 'Due euro e cinquanta', 'Tre euro'],
          answer: 2,
          explanation: 'Il barista dice "Due euro e cinquanta."',
        },
      ],
    },
    {
      id: 'a1-famiglia',
      title: 'La mia famiglia',
      type: 'narrative',
      text:
        'Mi chiamo Anna. Ho venticinque anni e vivo a Roma. La mia famiglia è piccola. ' +
        'Mio padre si chiama Carlo e ha cinquantadue anni. È professore. Mia madre ' +
        'si chiama Maria e ha quarantanove anni. È medico. Ho un fratello. ' +
        'Si chiama Pietro e ha ventidue anni. Pietro studia all\'università. ' +
        'Il fine settimana mangiamo tutti insieme a casa dei miei genitori.',
      vocabulary: [
        { word: 'vivo', definition: 'I live', example: 'Vivo in un appartamento piccolo.' },
        { word: 'medico', definition: 'doctor', example: 'Il medico lavora all\'ospedale.' },
        { word: 'il fine settimana', definition: 'the weekend', example: 'Il fine settimana mi riposo.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Dove vive Anna?',
          options: ['A Milano', 'A Roma', 'A Firenze', 'A Napoli'],
          answer: 1,
          explanation: 'Anna dice "vivo a Roma."',
        },
        {
          question: 'Qual è la professione della madre di Anna?',
          options: ['Professoressa', 'Infermiera', 'Medico', 'Avvocato'],
          answer: 2,
          explanation: 'Il testo dice "Mia madre... È medico."',
        },
        {
          question: 'Che cosa fa Pietro?',
          options: ['Lavora', 'Studia all\'università', 'Viaggia', 'Cucina'],
          answer: 1,
          explanation: 'Il testo dice "Pietro studia all\'università."',
        },
      ],
    },
    {
      id: 'a1-giornata',
      title: 'La mia giornata',
      type: 'narrative',
      text:
        'Tutti i giorni mi alzo alle sette di mattina. Faccio colazione con caffè e frutta. ' +
        'Alle otto vado al lavoro in autobus. Lavoro in un ufficio dalle nove alle cinque. ' +
        'A mezzogiorno mangio un panino al parco. Il pomeriggio torno a casa e cucino ' +
        'la cena. Dopo cena guardo la televisione o leggo un libro. Vado a letto alle undici.',
      vocabulary: [
        { word: 'mi alzo', definition: 'I get up', example: 'Mi alzo presto la mattina.' },
        { word: 'panino', definition: 'sandwich (on a roll)', example: 'Un panino al prosciutto.' },
        { word: 'vado a letto', definition: 'I go to bed', example: 'Vado a letto tardi il venerdì.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Come va al lavoro?',
          options: ['In macchina', 'In metro', 'In autobus', 'A piedi'],
          answer: 2,
          explanation: 'Il testo dice "vado al lavoro in autobus."',
        },
        {
          question: 'Dove mangia a mezzogiorno?',
          options: ['In ufficio', 'Al ristorante', 'A casa', 'Al parco'],
          answer: 3,
          explanation: 'Il testo dice "mangio un panino al parco."',
        },
        {
          question: 'A che ora va a letto?',
          options: ['Alle dieci', 'Alle undici', 'A mezzanotte', 'Alle nove'],
          answer: 1,
          explanation: 'Il testo dice "Vado a letto alle undici."',
        },
      ],
    },
  ],

  A2: [
    {
      id: 'a2-vacanze',
      title: 'Le mie vacanze al mare',
      type: 'narrative',
      text:
        'L\'estate scorsa sono andato in vacanza al mare con la mia famiglia. Abbiamo viaggiato in macchina ' +
        'per quattro ore. L\'albergo era vicino alla spiaggia e aveva una piscina molto ' +
        'grande. Tutti i giorni ci alzavamo tardi e facevamo colazione in albergo. La ' +
        'mattina andavamo in spiaggia. L\'acqua era un po\' fredda, ma ai bambini piaceva ' +
        'tantissimo nuotare. Il pomeriggio passeggiavamo per il paese e mangiavamo il gelato. Una ' +
        'sera abbiamo cenato in una trattoria di pesce. La frittura mista era squisita. Sono state ' +
        'le vacanze più belle della mia vita.',
      vocabulary: [
        { word: 'trattoria', definition: 'informal restaurant', example: 'Conosciamo una buona trattoria vicino al porto.' },
        { word: 'passeggiavamo', definition: 'we used to stroll', example: 'Passeggiavamo lungo il mare ogni sera.' },
        { word: 'squisita', definition: 'exquisite, delicious', example: 'La pasta era squisita.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Come hanno viaggiato?',
          options: ['In treno', 'In aereo', 'In macchina', 'In autobus'],
          answer: 2,
          explanation: 'Il testo dice "Abbiamo viaggiato in macchina per quattro ore."',
        },
        {
          question: 'Com\'era l\'acqua del mare?',
          options: ['Calda', 'Un po\' fredda', 'Molto fredda', 'Perfetta'],
          answer: 1,
          explanation: 'Il testo dice "L\'acqua era un po\' fredda."',
        },
        {
          question: 'Che cosa hanno mangiato alla trattoria?',
          options: ['Pizza', 'Pasta', 'Frittura mista', 'Insalata'],
          answer: 2,
          explanation: 'Il testo dice "abbiamo cenato in una trattoria di pesce. La frittura mista era squisita."',
        },
      ],
    },
    {
      id: 'a2-mercato',
      title: 'Al mercato rionale',
      type: 'dialogue',
      text:
        '— Buongiorno. Ha dei pomodori freschi?\n' +
        '— Sì, certo. Questi sono dell\'orto di stamattina. Quanti ne vuole?\n' +
        '— Me ne metta un chilo, per favore. E le fragole? Sono buone?\n' +
        '— Buonissime. Dolcissime questa settimana.\n' +
        '— Allora mezzo chilo di fragole. Quant\'è in tutto?\n' +
        '— Il chilo di pomodori, due euro. Le fragole, tre euro. Cinque euro in tutto.\n' +
        '— Ecco a lei. Ha un sacchetto?\n' +
        '— Sì, ecco. Buona giornata!',
      vocabulary: [
        { word: 'orto', definition: 'vegetable garden', example: 'I pomodori vengono dall\'orto.' },
        { word: 'dolcissime', definition: 'very sweet (superlative)', example: 'Le fragole sono dolcissime quest\'anno.' },
        { word: 'sacchetto', definition: 'small bag', example: 'Mi dà un sacchetto, per favore?' },
      ],
      comprehensionQuestions: [
        {
          question: 'Da dove vengono i pomodori?',
          options: ['Dal supermercato', 'Dall\'orto di stamattina', 'Dall\'estero', 'Non dice'],
          answer: 1,
          explanation: 'Il venditore dice "Questi sono dell\'orto di stamattina."',
        },
        {
          question: 'Quanto costano le fragole?',
          options: ['Due euro', 'Tre euro', 'Cinque euro', 'Un euro'],
          answer: 1,
          explanation: 'Il venditore dice "Le fragole, tre euro."',
        },
        {
          question: 'Come sono le fragole questa settimana?',
          options: ['Acide', 'Dolcissime', 'Un po\' verdi', 'Normali'],
          answer: 1,
          explanation: 'Il venditore dice "Dolcissime questa settimana."',
        },
      ],
    },
    {
      id: 'a2-citta',
      title: 'Una passeggiata per Firenze',
      type: 'narrative',
      text:
        'Sabato scorso sono andato a Firenze con un amico. Siamo arrivati alla stazione di Santa Maria Novella ' +
        'alle dieci di mattina. Prima siamo andati al Duomo — la cattedrale è enorme e bellissima. Poi abbiamo ' +
        'attraversato il Ponte Vecchio, dove ci sono tanti negozi di gioielli. A pranzo abbiamo mangiato un ' +
        'panino al lampredotto, un piatto tipico fiorentino. Il pomeriggio abbiamo visitato la Galleria degli ' +
        'Uffizi. C\'erano molti quadri famosi, come la Nascita di Venere di Botticelli. La sera abbiamo cenato ' +
        'in una trattoria e abbiamo preso la bistecca alla fiorentina. Era enorme!',
      vocabulary: [
        { word: 'lampredotto', definition: 'Florentine street food (tripe sandwich)', example: 'Il lampredotto è un piatto tipico di Firenze.' },
        { word: 'gioielli', definition: 'jewelry', example: 'Sul Ponte Vecchio vendono gioielli d\'oro.' },
        { word: 'bistecca alla fiorentina', definition: 'Florentine T-bone steak', example: 'La bistecca alla fiorentina si mangia al sangue.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Dove sono arrivati la mattina?',
          options: ['Al Duomo', 'Alla Galleria degli Uffizi', 'Alla stazione di Santa Maria Novella', 'Al Ponte Vecchio'],
          answer: 2,
          explanation: 'Il testo dice "Siamo arrivati alla stazione di Santa Maria Novella."',
        },
        {
          question: 'Che cosa hanno mangiato a pranzo?',
          options: ['La bistecca', 'Un panino al lampredotto', 'La pizza', 'La pasta'],
          answer: 1,
          explanation: 'Il testo dice "abbiamo mangiato un panino al lampredotto."',
        },
        {
          question: 'Quale opera famosa hanno visto agli Uffizi?',
          options: ['La Gioconda', 'La Nascita di Venere', 'L\'Ultima Cena', 'Il David'],
          answer: 1,
          explanation: 'Il testo dice "la Nascita di Venere di Botticelli."',
        },
      ],
    },
  ],

  B1: [
    {
      id: 'b1-lavoro-remoto',
      title: 'Il lavoro da remoto in Italia',
      type: 'article',
      text:
        'Lo smart working ha trasformato il mondo del lavoro in Italia. Prima della pandemia, ' +
        'solo il 2% dei lavoratori italiani lavorava da casa regolarmente. Oggi la percentuale ' +
        'è salita al 15%, con punte del 30% nelle grandi città come Milano e Roma.\n\n' +
        'I vantaggi sono evidenti: meno tempo nel traffico, più flessibilità e un migliore ' +
        'equilibrio tra vita privata e lavoro. Tuttavia, non tutti sono entusiasti. Molti ' +
        'lavoratori si lamentano della solitudine e della difficoltà di separare il lavoro ' +
        'dalla vita personale. Inoltre, in Italia la cultura del "presenzialismo" — l\'idea ' +
        'che bisogna essere fisicamente in ufficio per dimostrare il proprio impegno — è ' +
        'ancora forte, soprattutto nelle aziende tradizionali.\n\n' +
        'Il governo italiano ha introdotto una legge sullo smart working che garantisce ai ' +
        'lavoratori il diritto alla disconnessione. Secondo gli esperti, il futuro sarà ' +
        'probabilmente un modello ibrido: alcuni giorni in ufficio e altri a casa.',
      vocabulary: [
        { word: 'smart working', definition: 'remote work (Italian English borrowing)', example: 'Lo smart working è diventato molto comune.' },
        { word: 'presenzialismo', definition: 'culture of physical presence at work', example: 'Il presenzialismo è un problema nelle aziende italiane.' },
        { word: 'diritto alla disconnessione', definition: 'right to disconnect (from work)', example: 'I lavoratori hanno il diritto alla disconnessione dopo le 18.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Qual era la percentuale di lavoratori da remoto prima della pandemia?',
          options: ['Il 15%', 'Il 30%', 'Il 2%', 'Il 10%'],
          answer: 2,
          explanation: 'Il testo dice "Prima della pandemia, solo il 2% dei lavoratori italiani lavorava da casa."',
        },
        {
          question: 'Che cos\'è il "presenzialismo"?',
          options: ['Lavorare da casa', 'L\'idea che bisogna essere fisicamente in ufficio', 'Il diritto alla disconnessione', 'Un modello ibrido'],
          answer: 1,
          explanation: 'Il testo lo definisce come "l\'idea che bisogna essere fisicamente in ufficio per dimostrare il proprio impegno."',
        },
        {
          question: 'Quale sarà probabilmente il futuro del lavoro secondo gli esperti?',
          options: ['Tutto da remoto', 'Tutto in ufficio', 'Un modello ibrido', 'Non dice'],
          answer: 2,
          explanation: 'Il testo dice "il futuro sarà probabilmente un modello ibrido."',
        },
      ],
    },
    {
      id: 'b1-cucina',
      title: 'La vera pasta alla carbonara',
      type: 'article',
      text:
        'La pasta alla carbonara è uno dei piatti più famosi della cucina romana e italiana. ' +
        'Tuttavia, nel mondo circolano molte versioni "sbagliate" che fanno inorridire gli ' +
        'italiani. Ecco la ricetta tradizionale e gli errori da evitare.\n\n' +
        'Gli ingredienti sono solo cinque: spaghetti (o rigatoni), guanciale, uova, pecorino ' +
        'romano e pepe nero. Tutto qui. La panna non si usa MAI nella carbonara autentica. ' +
        'Anche la pancetta è un\'alternativa accettabile ma non tradizionale — il guanciale ha ' +
        'un sapore diverso e più intenso.\n\n' +
        'Il segreto è la temperatura: la crema di uova e pecorino va aggiunta alla pasta ' +
        'fuori dal fuoco, mescolando velocemente. Se la padella è troppo calda, le uova ' +
        'diventano una frittata. Se è troppo fredda, la crema resta liquida. La consistenza ' +
        'perfetta è cremosa, mai liquida e mai rappresa.\n\n' +
        'Per gli italiani, la carbonara non è solo un piatto — è un\'identità culturale.',
      vocabulary: [
        { word: 'guanciale', definition: 'cured pork cheek (key carbonara ingredient)', example: 'Il guanciale è diverso dalla pancetta.' },
        { word: 'pecorino romano', definition: 'hard sheep\'s milk cheese from Lazio', example: 'La carbonara si fa con il pecorino, non con il parmigiano.' },
        { word: 'rappresa', definition: 'curdled, set (of eggs)', example: 'Le uova non devono diventare rapprese.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Quanti ingredienti ha la carbonara tradizionale?',
          options: ['Tre', 'Cinque', 'Sette', 'Dieci'],
          answer: 1,
          explanation: 'Il testo dice "Gli ingredienti sono solo cinque."',
        },
        {
          question: 'Quale ingrediente NON si usa mai nella carbonara autentica?',
          options: ['Il pecorino', 'Il pepe nero', 'La panna', 'Le uova'],
          answer: 2,
          explanation: 'Il testo dice "La panna non si usa MAI nella carbonara autentica."',
        },
        {
          question: 'Qual è il segreto della carbonara perfetta?',
          options: ['Usare molta panna', 'La temperatura giusta per la crema', 'Cuocere molto le uova', 'Usare il parmigiano'],
          answer: 1,
          explanation: 'Il testo dice "Il segreto è la temperatura" — la crema va aggiunta fuori dal fuoco.',
        },
      ],
    },
  ],

  B2: [
    {
      id: 'b2-bella-figura',
      title: 'La bella figura: un concetto italiano',
      type: 'essay',
      text:
        'Per capire la società italiana bisogna capire il concetto di "bella figura". Non si ' +
        'tratta semplicemente di vestirsi bene o di avere buone maniere — è un codice sociale ' +
        'complesso che permea ogni aspetto della vita quotidiana.\n\n' +
        'La bella figura riguarda l\'impressione che si fa sugli altri: come ci si presenta, ' +
        'come si parla, come si trattano gli ospiti, persino come si serve il caffè. Un ' +
        'italiano non offrirebbe mai un caffè in una tazza di plastica a un ospite — sarebbe ' +
        'una "brutta figura", una mancanza di rispetto.\n\n' +
        'Questo concetto ha radici profonde nella cultura italiana, dove l\'identità personale ' +
        'è strettamente legata alla percezione sociale. Il filosofo Antonio Ferrara ha ' +
        'sostenuto che la bella figura rappresenta una forma di "etica estetica" — l\'idea ' +
        'che il modo in cui si fanno le cose sia importante quanto ciò che si fa.\n\n' +
        'I critici sostengono che la bella figura possa portare a una società superficiale, ' +
        'dove l\'apparenza conta più della sostanza. Tuttavia, i suoi difensori rispondono che ' +
        'si tratta di una forma di rispetto reciproco: prendersi cura di come ci si presenta ' +
        'significa rispettare chi ci sta intorno.\n\n' +
        'Che la si ami o la si critichi, la bella figura resta un pilastro dell\'identità ' +
        'italiana — e capirla è essenziale per chiunque voglia comprendere davvero l\'Italia.',
      vocabulary: [
        { word: 'bella figura', definition: 'making a good impression (core Italian social concept)', example: 'In Italia è importante fare bella figura.' },
        { word: 'permeare', definition: 'to permeate, pervade', example: 'Questo concetto permea la cultura italiana.' },
        { word: 'brutta figura', definition: 'making a bad impression, embarrassment', example: 'Non fare brutta figura davanti agli ospiti!' },
      ],
      comprehensionQuestions: [
        {
          question: 'Secondo il testo, la bella figura riguarda solo il modo di vestirsi?',
          options: ['Sì, solo l\'abbigliamento', 'No, è un codice sociale complesso', 'Sì, e le buone maniere', 'Non viene spiegato'],
          answer: 1,
          explanation: 'Il testo dice "Non si tratta semplicemente di vestirsi bene... è un codice sociale complesso."',
        },
        {
          question: 'Come definisce Antonio Ferrara la bella figura?',
          options: ['Una forma di superficialità', 'Una forma di etica estetica', 'Un problema sociale', 'Una tradizione superata'],
          answer: 1,
          explanation: 'Il testo dice che Ferrara "ha sostenuto che la bella figura rappresenta una forma di etica estetica."',
        },
        {
          question: 'Qual è la critica principale alla bella figura?',
          options: ['Costa troppo', 'Può portare a una società superficiale', 'È troppo formale', 'Non esiste davvero'],
          answer: 1,
          explanation: 'Il testo dice "la bella figura possa portare a una società superficiale, dove l\'apparenza conta più della sostanza."',
        },
      ],
    },
    {
      id: 'b2-nord-sud',
      title: 'La Questione Meridionale',
      type: 'essay',
      text:
        'Il divario economico e sociale tra il Nord e il Sud dell\'Italia — la cosiddetta ' +
        '"Questione Meridionale" — è uno dei problemi più antichi e persistenti del paese. ' +
        'Risale all\'unificazione del 1861 e, nonostante decenni di politiche di sviluppo, ' +
        'rimane una ferita aperta.\n\n' +
        'I numeri parlano chiaro: il PIL pro capite del Mezzogiorno è circa il 55% di quello ' +
        'del Nord. La disoccupazione giovanile nel Sud supera il 40%, contro il 15% del Nord. ' +
        'Le infrastrutture — trasporti, sanità, istruzione — presentano differenze marcate.\n\n' +
        'Le cause sono molteplici e dibattute. Alcuni economisti sottolineano i fattori storici: ' +
        'il Sud borbonico aveva un\'economia prevalentemente agricola, mentre il Nord aveva già ' +
        'iniziato l\'industrializzazione. Altri puntano sulle politiche post-unitarie che avrebbero ' +
        'favorito lo sviluppo settentrionale a scapito del Mezzogiorno. Non si può ignorare, ' +
        'inoltre, il ruolo della criminalità organizzata — Mafia, Camorra, \'Ndrangheta — che ' +
        'ha ostacolato lo sviluppo economico in alcune regioni.\n\n' +
        'Tuttavia, il Sud non è solo problemi. È anche una terra di straordinaria ricchezza ' +
        'culturale, paesaggistica e gastronomica. Città come Napoli, Palermo e Lecce ' +
        'stanno vivendo una rinascita culturale e turistica. La sfida resta quella di ' +
        'trasformare questa ricchezza in sviluppo sostenibile.',
      vocabulary: [
        { word: 'Questione Meridionale', definition: 'the Southern Question (Italy\'s North-South divide)', example: 'La Questione Meridionale esiste dall\'unificazione.' },
        { word: 'Mezzogiorno', definition: 'Southern Italy (literally: midday/noon)', example: 'Il Mezzogiorno comprende Campania, Puglia, Calabria, Sicilia e Sardegna.' },
        { word: 'a scapito di', definition: 'at the expense of', example: 'Lo sviluppo del Nord è avvenuto a scapito del Sud.' },
      ],
      comprehensionQuestions: [
        {
          question: 'A quando risale la Questione Meridionale?',
          options: ['Al dopoguerra', 'All\'unificazione del 1861', 'Agli anni Sessanta', 'All\'epoca romana'],
          answer: 1,
          explanation: 'Il testo dice "Risale all\'unificazione del 1861."',
        },
        {
          question: 'Qual è il PIL pro capite del Mezzogiorno rispetto al Nord?',
          options: ['Il 75%', 'Il 55%', 'Il 85%', 'Il 40%'],
          answer: 1,
          explanation: 'Il testo dice "il PIL pro capite del Mezzogiorno è circa il 55% di quello del Nord."',
        },
        {
          question: 'Qual è il tono del testo verso il Sud?',
          options: ['Solo negativo', 'Solo positivo', 'Equilibrato — problemi ma anche ricchezze', 'Indifferente'],
          answer: 2,
          explanation: 'Il testo presenta i problemi ma conclude riconoscendo "straordinaria ricchezza culturale" e "rinascita."',
        },
      ],
    },
  ],

  C1: [
    {
      id: 'c1-pirandello',
      title: 'Il relativismo pirandelliano',
      type: 'literary-analysis',
      text:
        'Luigi Pirandello, premio Nobel per la letteratura nel 1934, ha costruito ' +
        'la sua opera intorno a un\'intuizione fondamentale: l\'impossibilità di ' +
        'conoscere se stessi e gli altri. In "Uno, nessuno e centomila" (1926), ' +
        'il protagonista Vitangelo Moscarda scopre che il suo naso è storto — un ' +
        'dettaglio banale che innesca una crisi esistenziale devastante.\n\n' +
        'Se gli altri lo vedono diversamente da come lui si vede, chi è davvero? ' +
        'Moscarda comprende di essere "uno" per se stesso, "centomila" per gli ' +
        'altri che lo percepiscono ognuno a modo proprio, e infine "nessuno", ' +
        'perché nessuna di queste identità è più vera delle altre.\n\n' +
        'Questo relativismo gnoseologico attraversa tutta l\'opera pirandelliana. ' +
        'Nel teatro — "Sei personaggi in cerca d\'autore", "Enrico IV", "Così è ' +
        '(se vi pare)" — Pirandello demolisce sistematicamente la distinzione tra ' +
        'realtà e finzione, tra maschera e volto. La celebre battuta di Laudisi ' +
        'in "Così è (se vi pare)" — "Io sono colui che mi si crede" — riassume ' +
        'un\'intera filosofia.\n\n' +
        'La modernità di Pirandello sta nell\'aver anticipato temi che il ' +
        'postmodernismo avrebbe sviluppato decenni dopo: la frammentazione ' +
        'dell\'identità, la costruzione sociale della realtà, l\'impossibilità ' +
        'di una verità oggettiva. Leggere Pirandello oggi significa confrontarsi ' +
        'con domande che l\'era dei social media ha reso più urgenti che mai: ' +
        'chi siamo quando nessuno ci guarda? E soprattutto: esiste una risposta?',
      vocabulary: [
        { word: 'gnoseologico', definition: 'epistemological, relating to knowledge', example: 'Il relativismo gnoseologico riguarda la possibilità di conoscere la realtà.' },
        { word: 'maschera', definition: 'mask (also: social persona in Pirandello)', example: 'Per Pirandello, tutti portiamo una maschera.' },
        { word: 'frammentazione', definition: 'fragmentation', example: 'La frammentazione dell\'identità è un tema postmoderno.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Che cosa innesca la crisi di Moscarda?',
          options: ['Un tradimento', 'La scoperta che il suo naso è storto', 'La morte di un parente', 'Un viaggio'],
          answer: 1,
          explanation: 'Il testo dice che "Moscarda scopre che il suo naso è storto — un dettaglio banale che innesca una crisi esistenziale."',
        },
        {
          question: 'Che cosa significa il titolo "Uno, nessuno e centomila"?',
          options: ['Il numero di personaggi', 'Le tre fasi della vita', 'Uno per sé, centomila per gli altri, nessuno come identità vera', 'Un gioco di numeri'],
          answer: 2,
          explanation: 'Il testo spiega: "uno" per se stesso, "centomila" per gli altri, "nessuno" perché nessuna identità è più vera.',
        },
        {
          question: 'In che modo Pirandello anticipa il postmodernismo?',
          options: ['Con lo stile di scrittura', 'Con i temi di frammentazione dell\'identità e costruzione sociale della realtà', 'Con l\'uso della tecnologia', 'Non lo anticipa'],
          answer: 1,
          explanation: 'Il testo dice che Pirandello ha "anticipato temi che il postmodernismo avrebbe sviluppato: frammentazione dell\'identità, costruzione sociale della realtà."',
        },
      ],
    },
    {
      id: 'c1-economia-verde',
      title: 'L\'Italia e la transizione ecologica',
      type: 'article',
      text:
        'L\'Italia si trova in una posizione paradossale rispetto alla transizione ecologica. ' +
        'Da un lato, il paese è tra i leader europei nell\'economia circolare: ricicla il 79% ' +
        'dei rifiuti, ben al di sopra della media UE del 53%. Le piccole e medie imprese ' +
        'italiane, tradizionalmente innovative nell\'uso efficiente delle risorse, hanno fatto ' +
        'della sostenibilità un vantaggio competitivo.\n\n' +
        'Dall\'altro lato, l\'Italia dipende ancora pesantemente dal gas naturale — circa il 40% ' +
        'del mix energetico — e la percentuale di energie rinnovabili, pur crescendo, resta ' +
        'al 20%, lontana dagli obiettivi europei del 42% entro il 2030. Le procedure ' +
        'autorizzative per nuovi impianti eolici e solari sono tra le più lente d\'Europa, ' +
        'con tempi medi di 5-7 anni a causa della burocrazia e delle opposizioni locali.\n\n' +
        'Il Piano Nazionale di Ripresa e Resilienza (PNRR) destina circa 60 miliardi di euro ' +
        'alla rivoluzione verde. Tuttavia, gli esperti avvertono che senza una semplificazione ' +
        'radicale delle procedure, gran parte di questi fondi rischia di non essere spesa nei ' +
        'tempi previsti. La sfida non è solo tecnologica o finanziaria, ma profondamente ' +
        'burocratica e culturale.',
      vocabulary: [
        { word: 'economia circolare', definition: 'circular economy (recycling-focused)', example: 'L\'Italia è un leader nell\'economia circolare.' },
        { word: 'PNRR', definition: 'Piano Nazionale di Ripresa e Resilienza (Italy\'s recovery plan)', example: 'Il PNRR finanzia la transizione ecologica.' },
        { word: 'procedure autorizzative', definition: 'permit/authorization procedures', example: 'Le procedure autorizzative sono molto lente in Italia.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Perché la posizione dell\'Italia è definita "paradossale"?',
          options: ['È il paese più inquinante', 'È leader nel riciclo ma dipendente dal gas e lenta nelle rinnovabili', 'Non ha un piano ambientale', 'Produce solo energia nucleare'],
          answer: 1,
          explanation: 'Il testo contrasta il primato nel riciclo (79%) con la dipendenza dal gas e la lentezza nelle procedure per le rinnovabili.',
        },
        {
          question: 'Quanto ricicla l\'Italia rispetto alla media UE?',
          options: ['53% vs 79%', '79% vs 53%', '42% vs 20%', '40% vs 20%'],
          answer: 1,
          explanation: 'Il testo dice: "ricicla il 79% dei rifiuti, ben al di sopra della media UE del 53%."',
        },
        {
          question: 'Qual è il problema principale secondo gli esperti?',
          options: ['Mancanza di fondi', 'Tecnologia inadeguata', 'Burocrazia e lentezza delle procedure', 'Opposizione popolare'],
          answer: 2,
          explanation: 'Il testo dice "senza una semplificazione radicale delle procedure, gran parte di questi fondi rischia di non essere spesa."',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// ReadingTutor class
// ---------------------------------------------------------------------------

class ReadingTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.readingStats) {
      p.readingStats = {};
    }
    return p;
  }

  _save(p) {
    core.saveProfile(this.dir, p);
  }

  setLevel(studentId, level) {
    const lev = level.toUpperCase();
    if (!core.CEFR.includes(lev)) throw new Error(`Invalid level: ${level}. Use one of: ${core.CEFR.join(', ')}`);
    if (lev === 'C2') throw new Error('C2 texts are not yet available. Maximum level is C1.');
    const p = this.getProfile(studentId);
    p.level = lev;
    this._save(p);
    return { studentId, level: lev, message: `Level set to ${lev}.` };
  }

  getTextCatalog(level) {
    if (level) {
      const lev = level.toUpperCase();
      const texts = TEXTS[lev];
      if (!texts) return { error: `No texts for level ${lev}.` };
      return { level: lev, texts: texts.map(t => ({ id: t.id, title: t.title, type: t.type })) };
    }
    const catalog = {};
    for (const lev of Object.keys(TEXTS)) {
      catalog[lev] = TEXTS[lev].map(t => ({ id: t.id, title: t.title, type: t.type }));
    }
    return catalog;
  }

  _textsForLevel(level) {
    return TEXTS[level] || [];
  }

  _findText(textId) {
    for (const lev of Object.keys(TEXTS)) {
      const t = TEXTS[lev].find(t => t.id === textId);
      if (t) return { text: t, level: lev };
    }
    return null;
  }

  generateLesson(studentId) {
    const p = this.getProfile(studentId);
    if (!p.level) throw new Error('No level set. Use set-level first.');
    const texts = this._textsForLevel(p.level);
    if (!texts.length) throw new Error(`No texts available for level ${p.level}.`);

    const stats = p.readingStats || {};
    const unattempted = texts.filter(t => !stats[t.id] || !stats[t.id].attempts || stats[t.id].attempts.length === 0);
    const chosen = unattempted.length > 0 ? core.pick(unattempted, 1)[0] : core.pick(texts, 1)[0];

    return {
      studentId,
      level: p.level,
      text: {
        id: chosen.id,
        title: chosen.title,
        type: chosen.type,
        text: chosen.text,
        vocabulary: chosen.vocabulary,
      },
      questions: chosen.comprehensionQuestions.map((q, i) => ({
        index: i,
        question: q.question,
        options: q.options.map((o, j) => `${j}) ${o}`),
      })),
      instructions: 'Leggi il testo con attenzione. Poi rispondi alle domande di comprensione usando il numero dell\'opzione (0-3).',
    };
  }

  getText(studentId, textId) {
    const found = this._findText(textId);
    if (!found) throw new Error(`Text not found: ${textId}`);
    const t = found.text;
    return {
      id: t.id,
      title: t.title,
      type: t.type,
      level: found.level,
      text: t.text,
      vocabulary: t.vocabulary,
      questionCount: t.comprehensionQuestions.length,
    };
  }

  checkAnswer(studentId, textId, qIndex, answer) {
    const found = this._findText(textId);
    if (!found) throw new Error(`Text not found: ${textId}`);
    const t = found.text;
    const qi = parseInt(qIndex, 10);
    if (qi < 0 || qi >= t.comprehensionQuestions.length) {
      throw new Error(`Invalid question index: ${qIndex}. Text has ${t.comprehensionQuestions.length} questions.`);
    }
    const q = t.comprehensionQuestions[qi];
    const ans = parseInt(answer, 10);
    const correct = ans === q.answer;
    return {
      textId,
      questionIndex: qi,
      correct,
      yourAnswer: ans,
      correctAnswer: q.answer,
      correctOption: q.options[q.answer],
      explanation: q.explanation,
    };
  }

  recordAssessment(studentId, textId, score, total) {
    const found = this._findText(textId);
    if (!found) throw new Error(`Text not found: ${textId}`);
    const p = this.getProfile(studentId);
    if (!p.readingStats) p.readingStats = {};
    if (!p.readingStats[textId]) {
      p.readingStats[textId] = {
        attempts: [],
        stability: 1,
        difficulty: 5,
        nextReview: core.today(),
      };
    }
    const st = p.readingStats[textId];
    const s = parseInt(score, 10);
    const t = parseInt(total, 10);
    st.attempts.push({ score: s, total: t, date: core.today() });

    const grade = s === t ? 4 : s >= t * 0.7 ? 3 : s >= t * 0.5 ? 2 : 1;
    st.stability = core.fsrsUpdateStability(st.stability, st.difficulty, grade);
    st.difficulty = core.fsrsUpdateDifficulty(st.difficulty, grade);
    st.nextReview = (() => {
      const days = core.fsrsNextReview(st.stability);
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    })();

    p.assessments.push({
      type: 'reading',
      textId,
      score: s,
      total: t,
      date: core.today(),
    });

    this._save(p);
    return {
      studentId,
      textId,
      score: s,
      total: t,
      mastery: core.calcMastery(st.attempts),
      nextReview: st.nextReview,
    };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const stats = p.readingStats || {};
    const textIds = Object.keys(stats);
    const totalAttempts = textIds.reduce((sum, id) => sum + (stats[id].attempts || []).length, 0);
    const masteries = textIds.map(id => core.calcMastery(stats[id].attempts));
    const avgMastery = masteries.length ? Math.round(masteries.reduce((a, b) => a + b, 0) / masteries.length * 100) / 100 : 0;

    return {
      studentId,
      level: p.level || 'not set',
      textsAttempted: textIds.length,
      totalAttempts,
      averageMastery: avgMastery,
      masteryLabel: core.masteryLabel(avgMastery),
    };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const stats = p.readingStats || {};
    const details = [];
    for (const textId of Object.keys(stats)) {
      const st = stats[textId];
      const found = this._findText(textId);
      const mastery = core.calcMastery(st.attempts);
      details.push({
        textId,
        title: found ? found.text.title : textId,
        level: found ? found.level : '?',
        attempts: st.attempts.length,
        lastScore: st.attempts.length ? st.attempts[st.attempts.length - 1] : null,
        mastery,
        masteryLabel: core.masteryLabel(mastery),
        nextReview: st.nextReview,
      });
    }
    return {
      studentId,
      level: p.level || 'not set',
      createdAt: p.createdAt,
      texts: details,
    };
  }

  getNextTexts(studentId) {
    const p = this.getProfile(studentId);
    if (!p.level) throw new Error('No level set. Use set-level first.');
    const stats = p.readingStats || {};
    const todayStr = core.today();

    const due = [];
    for (const textId of Object.keys(stats)) {
      const st = stats[textId];
      if (st.nextReview <= todayStr) {
        const found = this._findText(textId);
        due.push({
          textId,
          title: found ? found.text.title : textId,
          level: found ? found.level : '?',
          nextReview: st.nextReview,
          mastery: core.calcMastery(st.attempts),
        });
      }
    }

    const texts = this._textsForLevel(p.level);
    const unattempted = texts
      .filter(t => !stats[t.id])
      .map(t => ({ textId: t.id, title: t.title, level: p.level, nextReview: 'new', mastery: 0 }));

    return {
      studentId,
      level: p.level,
      dueForReview: due,
      newTexts: unattempted,
    };
  }

  listStudents() {
    return { students: core.listProfiles(this.dir) };
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new ReadingTutor();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const [, sid, level] = args;
      if (!sid) throw new Error('Usage: start <studentId> [level]');
      if (level) tutor.setLevel(sid, level);
      const p = tutor.getProfile(sid);
      tutor._save(p);
      out({ message: `Profile loaded for ${sid}.`, level: p.level || 'not set' });
      break;
    }
    case 'set-level': {
      const [, sid, level] = args;
      if (!sid || !level) throw new Error('Usage: set-level <studentId> <level>');
      out(tutor.setLevel(sid, level));
      break;
    }
    case 'lesson': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: lesson <studentId>');
      out(tutor.generateLesson(sid));
      break;
    }
    case 'text': {
      const [, sid, textId] = args;
      if (!sid || !textId) throw new Error('Usage: text <studentId> <textId>');
      out(tutor.getText(sid, textId));
      break;
    }
    case 'check': {
      const [, sid, textId, qIndex, answer] = args;
      if (!sid || !textId || qIndex === undefined || answer === undefined) {
        throw new Error('Usage: check <studentId> <textId> <qIndex> <answer>');
      }
      out(tutor.checkAnswer(sid, textId, qIndex, answer));
      break;
    }
    case 'record': {
      const [, sid, textId, score, total] = args;
      if (!sid || !textId || score === undefined || total === undefined) {
        throw new Error('Usage: record <studentId> <textId> <score> <total>');
      }
      out(tutor.recordAssessment(sid, textId, score, total));
      break;
    }
    case 'progress': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: progress <studentId>');
      out(tutor.getProgress(sid));
      break;
    }
    case 'report': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: report <studentId>');
      out(tutor.getReport(sid));
      break;
    }
    case 'next': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: next <studentId>');
      out(tutor.getNextTexts(sid));
      break;
    }
    case 'texts': {
      const [, level] = args;
      out(tutor.getTextCatalog(level || null));
      break;
    }
    case 'students': {
      out({ students: tutor.listStudents() });
      break;
    }

    case 'help':
      out({ info: 'Use one of the commands listed in SKILL.md' });
      break;
    default:
      out({
        error: `Unknown command: ${cmd}`,
        commands: ['start', 'set-level', 'lesson', 'text', 'check', 'record', 'progress', 'report', 'next', 'texts', 'students'],
      });
  }
});
