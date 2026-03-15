// Italian Vocabulary Tutor — complete implementation with embedded data
// Usage: node tutor.js <command> [args...]
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'italian-vocabulary';
const MAX_NEW_PER_SESSION = 7;

// ─── Embedded Word Banks by CEFR Level ───────────────────────────────────────

const WORD_BANKS = {
  A1: [
    // Greetings
    { word: 'ciao', article: null, category: 'greetings', definition: 'hello / goodbye (informal)',
      exampleSentence: 'Ciao, come stai?', collocations: ['dire ciao', 'ciao a tutti'], falseFriends: null },
    { word: 'buongiorno', article: null, category: 'greetings', definition: 'good morning / good day',
      exampleSentence: 'Buongiorno, signora Rossi.', collocations: ['dare il buongiorno'], falseFriends: null },
    { word: 'grazie', article: null, category: 'greetings', definition: 'thank you',
      exampleSentence: 'Grazie mille per il tuo aiuto.', collocations: ['grazie mille', 'grazie tante', 'grazie a Dio'], falseFriends: null },
    { word: 'prego', article: null, category: 'greetings', definition: "you're welcome / please (formal) / after you",
      exampleSentence: 'Prego, si accomodi.', collocations: ['prego, entri'], falseFriends: null },
    // Food
    { word: 'acqua', article: "l'", category: 'food', definition: 'water',
      exampleSentence: "L'acqua minerale e fresca.", collocations: ['acqua minerale', 'acqua frizzante', 'acqua naturale'], falseFriends: null },
    { word: 'pane', article: 'il', category: 'food', definition: 'bread',
      exampleSentence: 'Compro il pane dal fornaio.', collocations: ['pane integrale', 'fetta di pane'], falseFriends: null },
    { word: 'latte', article: 'il', category: 'food', definition: 'milk',
      exampleSentence: 'Prendo il latte con il caffe.', collocations: ['latte intero', 'latte scremato', 'caffe latte'], falseFriends: null },
    { word: 'mela', article: 'la', category: 'food', definition: 'apple',
      exampleSentence: 'La mela rossa e molto dolce.', collocations: ['succo di mela', 'torta di mele'], falseFriends: null },
    // Family
    { word: 'madre', article: 'la', category: 'family', definition: 'mother',
      exampleSentence: 'Mia madre cucina molto bene.', collocations: ['lingua madre', 'festa della mamma'], falseFriends: null },
    { word: 'padre', article: 'il', category: 'family', definition: 'father',
      exampleSentence: 'Mio padre lavora in ospedale.', collocations: ['padre di famiglia', 'Santo Padre'], falseFriends: null },
    { word: 'fratello', article: 'il', category: 'family', definition: 'brother',
      exampleSentence: 'Mio fratello maggiore si chiama Marco.', collocations: ['fratello minore', 'fratello gemello'], falseFriends: null },
    { word: 'amico', article: "l'", category: 'family', definition: 'friend (m.)',
      exampleSentence: 'Il mio amico abita vicino a casa mia.', collocations: ['migliore amico', 'amico intimo', 'fare amicizia'], falseFriends: null },
    // Everyday objects
    { word: 'casa', article: 'la', category: 'everyday', definition: 'house / home',
      exampleSentence: 'La casa ha un giardino grande.', collocations: ['a casa', 'casalinga', 'casa editrice'], falseFriends: null },
    { word: 'libro', article: 'il', category: 'everyday', definition: 'book',
      exampleSentence: 'Leggo un libro ogni settimana.', collocations: ['libro di testo', 'libro tascabile'], falseFriends: { en: 'library (which is "biblioteca")' } },
    { word: 'tavolo', article: 'il', category: 'everyday', definition: 'table',
      exampleSentence: 'Il tavolo della cucina e di legno.', collocations: ['apparecchiare il tavolo', 'tavola rotonda'], falseFriends: null },
    { word: 'strada', article: 'la', category: 'everyday', definition: 'street / road',
      exampleSentence: 'La strada e piena di gente.', collocations: ['strada principale', 'attraversare la strada'], falseFriends: null },
    // Time
    { word: 'giorno', article: 'il', category: 'time', definition: 'day',
      exampleSentence: 'Oggi e un giorno molto bello.', collocations: ['tutti i giorni', 'buon giorno', 'giorno festivo'], falseFriends: null },
    { word: 'notte', article: 'la', category: 'time', definition: 'night',
      exampleSentence: 'La notte e molto tranquilla qui.', collocations: ['buonanotte', 'di notte', 'la notte scorsa'], falseFriends: null },
    { word: 'oggi', article: null, category: 'time', definition: 'today',
      exampleSentence: 'Oggi andiamo al parco.', collocations: ['oggi come oggi', 'al giorno d\'oggi'], falseFriends: null },
    { word: 'grande', article: null, category: 'adjectives', definition: 'big / large / great',
      exampleSentence: 'Questa citta e molto grande.', collocations: ['in grande', 'alla grande'], falseFriends: null },
  ],

  A2: [
    // Travel
    { word: 'bagaglio', article: 'il', category: 'travel', definition: 'luggage / baggage',
      exampleSentence: 'Il mio bagaglio pesa troppo.', collocations: ['bagaglio a mano', 'ritiro bagagli'], falseFriends: null },
    { word: 'biglietto', article: 'il', category: 'travel', definition: 'ticket',
      exampleSentence: 'Devo comprare un biglietto del treno.', collocations: ['biglietto di andata', 'biglietto di andata e ritorno', 'fare il biglietto'], falseFriends: null },
    { word: 'stazione', article: 'la', category: 'travel', definition: 'station / season',
      exampleSentence: 'La stazione dei treni e lontana.', collocations: ['stazione ferroviaria', 'stazione dell\'anno'], falseFriends: null },
    { word: 'valigia', article: 'la', category: 'travel', definition: 'suitcase',
      exampleSentence: 'Devo fare la valigia stasera.', collocations: ['fare la valigia', 'valigia di viaggio'], falseFriends: null },
    // Food (expanded)
    { word: 'carne', article: 'la', category: 'food', definition: 'meat',
      exampleSentence: 'La carne di vitello e la mia preferita.', collocations: ['carne di manzo', 'carne macinata', 'carne alla griglia'], falseFriends: null },
    { word: 'pesce', article: 'il', category: 'food', definition: 'fish',
      exampleSentence: 'Il pesce fresco e piu buono.', collocations: ['pesce alla griglia', 'pesce fritto', 'pesce spada'], falseFriends: null },
    { word: 'conto', article: 'il', category: 'food', definition: 'bill / check (at restaurant); account',
      exampleSentence: 'Il conto, per favore.', collocations: ['chiedere il conto', 'conto in banca', 'tenere conto di', 'rendersi conto'],
      falseFriends: { en: 'count (verb is "contare")' } },
    { word: 'mancia', article: 'la', category: 'food', definition: 'tip (gratuity)',
      exampleSentence: 'In Italia la mancia non e obbligatoria.', collocations: ['lasciare la mancia', 'dare la mancia'], falseFriends: null },
    // Shopping
    { word: 'negozio', article: 'il', category: 'shopping', definition: 'shop / store',
      exampleSentence: 'Il negozio chiude alle nove.', collocations: ['negozio di abbigliamento', 'andare per negozi'], falseFriends: null },
    { word: 'prezzo', article: 'il', category: 'shopping', definition: 'price',
      exampleSentence: 'Il prezzo della frutta e salito.', collocations: ['buon prezzo', 'prezzo fisso', 'a meta prezzo'], falseFriends: null },
    { word: 'soldi', article: 'i', category: 'shopping', definition: 'money',
      exampleSentence: 'Non ho abbastanza soldi.', collocations: ['guadagnare soldi', 'risparmiare soldi', 'soldi contanti'], falseFriends: null },
    { word: 'economico', article: null, category: 'shopping', definition: 'cheap / inexpensive / economic',
      exampleSentence: 'Questo ristorante e molto economico.', collocations: ['piu economico', 'soluzione economica'], falseFriends: null },
    // Weather
    { word: 'pioggia', article: 'la', category: 'weather', definition: 'rain',
      exampleSentence: 'La pioggia non smette da ieri.', collocations: ['pioggia torrenziale', 'giorno di pioggia', 'sotto la pioggia'], falseFriends: null },
    { word: 'sole', article: 'il', category: 'weather', definition: 'sun',
      exampleSentence: "Oggi c'e molto sole.", collocations: ['prendere il sole', 'occhiali da sole', 'tramonto'], falseFriends: null },
    { word: 'freddo', article: 'il', category: 'weather', definition: 'cold',
      exampleSentence: "D'inverno fa molto freddo.", collocations: ['fare freddo', 'avere freddo', 'freddo polare'], falseFriends: null },
    // Health
    { word: 'testa', article: 'la', category: 'health', definition: 'head',
      exampleSentence: 'Mi fa male la testa.', collocations: ['mal di testa', 'dalla testa ai piedi', 'perdere la testa'], falseFriends: null },
    { word: 'medico', article: 'il', category: 'health', definition: 'doctor',
      exampleSentence: 'Ho un appuntamento dal medico domani.', collocations: ['andare dal medico', 'medico di base'], falseFriends: null },
    { word: 'malato', article: null, category: 'health', definition: 'sick / ill',
      exampleSentence: 'Mio figlio e malato oggi.', collocations: ['ammalarsi', 'sentirsi male'], falseFriends: null },
    { word: 'ricetta', article: 'la', category: 'health', definition: 'prescription; recipe',
      exampleSentence: 'Il medico mi ha dato una ricetta.', collocations: ['ricetta medica', 'ricetta di cucina'], falseFriends: null },
    { word: 'dolore', article: 'il', category: 'health', definition: 'pain / ache',
      exampleSentence: 'Ho un forte dolore alla schiena.', collocations: ['mal di testa', 'mal di stomaco', 'alleviare il dolore'], falseFriends: null },
  ],

  B1: [
    // Work
    { word: 'azienda', article: "l'", category: 'work', definition: 'company / business',
      exampleSentence: 'Lavoro in un\'azienda di tecnologia.', collocations: ['azienda privata', 'fondare un\'azienda', 'azienda familiare'], falseFriends: null },
    { word: 'riunione', article: 'la', category: 'work', definition: 'meeting',
      exampleSentence: 'La riunione comincia alle dieci.', collocations: ['avere una riunione', 'sala riunioni', 'convocare una riunione'], falseFriends: null },
    { word: 'stipendio', article: 'lo', category: 'work', definition: 'salary / wages',
      exampleSentence: 'Mi aumenteranno lo stipendio quest\'anno.', collocations: ['stipendio fisso', 'ricevere lo stipendio', 'stipendio minimo'], falseFriends: null },
    { word: 'capo', article: 'il', category: 'work', definition: 'boss / head',
      exampleSentence: 'Il mio capo e molto esigente ma giusto.', collocations: ['capo di stato', 'capo reparto'], falseFriends: null },
    { word: 'domanda', article: 'la', category: 'work', definition: 'question; application / request',
      exampleSentence: 'Ho inviato la domanda di lavoro ieri.', collocations: ['fare domanda', 'domanda di assunzione', 'presentare domanda'], falseFriends: null },
    // Emotions
    { word: 'speranza', article: 'la', category: 'emotions', definition: 'hope',
      exampleSentence: 'Ho speranza che tutto vada bene.', collocations: ['perdere la speranza', 'avere speranza', 'raggio di speranza'], falseFriends: null },
    { word: 'orgoglioso', article: null, category: 'emotions', definition: 'proud',
      exampleSentence: 'Sono molto orgoglioso di mia figlia.', collocations: ['essere orgoglioso di', 'sentirsi orgoglioso'], falseFriends: null },
    { word: 'preoccupato', article: null, category: 'emotions', definition: 'worried',
      exampleSentence: "Sono preoccupato per l'esame.", collocations: ['essere preoccupato per', 'stare in pensiero'], falseFriends: null },
    { word: 'vergogna', article: 'la', category: 'emotions', definition: 'shame / embarrassment',
      exampleSentence: 'Mi vergogno a parlare in pubblico.', collocations: ['avere vergogna', 'che vergogna', 'senza vergogna'], falseFriends: null },
    // False friends
    { word: 'successo', article: 'il', category: 'abstract', definition: 'success; past participle of succedere',
      exampleSentence: 'Il film e stato un grande successo.', collocations: ['avere successo', 'successo strepitoso', 'con successo'],
      falseFriends: { en: '"success" is correct; but "successo" also = "happened" (past participle)' } },
    { word: 'realizzare', article: null, category: 'abstract', definition: 'to carry out / accomplish; to realize (understand)',
      exampleSentence: 'Vogliamo realizzare il progetto insieme.', collocations: ['realizzare un progetto', 'realizzare un sogno'],
      falseFriends: { en: 'Can mean both "to realize" and "to accomplish" in Italian' } },
    { word: 'attuale', article: null, category: 'abstract', definition: 'current / present',
      exampleSentence: 'La situazione attuale e complicata.', collocations: ['attualmente', 'momento attuale'],
      falseFriends: { en: '"actual" (real) is "effettivo" or "reale"' } },
    { word: 'sensibile', article: null, category: 'abstract', definition: 'sensitive',
      exampleSentence: 'E una persona molto sensibile.', collocations: ['essere sensibile a', 'tema sensibile'],
      falseFriends: { en: '"sensible" (reasonable) is "sensato" or "ragionevole"' } },
    // Education
    { word: 'materia', article: 'la', category: 'education', definition: 'school subject',
      exampleSentence: 'La matematica e la mia materia preferita.', collocations: ['materia scolastica', 'passare una materia'], falseFriends: null },
    { word: 'appunti', article: 'gli', category: 'education', definition: 'notes (class notes)',
      exampleSentence: 'Prendo appunti in tutte le lezioni.', collocations: ['prendere appunti', 'ricopiare gli appunti'], falseFriends: null },
    { word: 'borsa di studio', article: 'la', category: 'education', definition: 'scholarship',
      exampleSentence: 'Ho ottenuto una borsa di studio per Milano.', collocations: ['ottenere una borsa di studio', 'borsista'], falseFriends: null },
    // Daily life
    { word: 'abitudine', article: "l'", category: 'daily', definition: 'habit / custom',
      exampleSentence: "Ho l'abitudine di passeggiare dopo cena.", collocations: ["avere l'abitudine di", 'come al solito', 'per abitudine'], falseFriends: null },
    { word: 'trasferirsi', article: null, category: 'daily', definition: 'to move (change residence)',
      exampleSentence: 'Ci siamo trasferiti a Roma il mese scorso.', collocations: ['trasferirsi in un\'altra citta'], falseFriends: null },
    { word: 'affittare', article: null, category: 'daily', definition: 'to rent',
      exampleSentence: 'Voglio affittare un appartamento in centro.', collocations: ['affittare un appartamento', 'affitto mensile', 'in affitto'], falseFriends: null },
  ],

  B2: [
    // Work (advanced)
    { word: 'licenziamento', article: 'il', category: 'work', definition: 'dismissal / layoff',
      exampleSentence: 'Il licenziamento e stato completamente inaspettato.', collocations: ['licenziamento ingiusto', 'lettera di licenziamento'], falseFriends: null },
    { word: 'promozione', article: 'la', category: 'work', definition: 'promotion (at work)',
      exampleSentence: 'Dopo cinque anni ha ottenuto una promozione.', collocations: ['ottenere una promozione', 'promozione sul lavoro'], falseFriends: null },
    { word: 'rendimento', article: 'il', category: 'work', definition: 'performance / yield',
      exampleSentence: 'Il rendimento della squadra e migliorato molto.', collocations: ['alto rendimento', 'rendimento scolastico'], falseFriends: null },
    { word: 'imprenditore', article: "l'", category: 'work', definition: 'entrepreneur',
      exampleSentence: "E un imprenditore con molta visione.", collocations: ['spirito imprenditoriale', 'giovane imprenditore'], falseFriends: null },
    // Society
    { word: 'disuguaglianza', article: 'la', category: 'society', definition: 'inequality',
      exampleSentence: 'La disuguaglianza sociale resta un problema.', collocations: ['disuguaglianza di genere', 'lottare contro la disuguaglianza'], falseFriends: null },
    { word: 'cittadinanza', article: 'la', category: 'society', definition: 'citizenship',
      exampleSentence: 'Ha richiesto la cittadinanza italiana.', collocations: ['ottenere la cittadinanza', 'doppia cittadinanza'], falseFriends: null },
    { word: 'manifestazione', article: 'la', category: 'society', definition: 'demonstration / protest; event',
      exampleSentence: "C'e stata una manifestazione pacifica in piazza.", collocations: ['organizzare una manifestazione', 'manifestazione di piazza'], falseFriends: null },
    { word: 'impegno', article: "l'", category: 'society', definition: 'commitment / engagement',
      exampleSentence: "L'impegno per l'ambiente e fondamentale.", collocations: ['prendere un impegno', 'senza impegno', 'impegno sociale'], falseFriends: null },
    // Abstract
    { word: 'sfumatura', article: 'la', category: 'abstract', definition: 'nuance / shade',
      exampleSentence: "C'e una sfumatura importante in quella frase.", collocations: ['con sfumature', 'sfumatura di significato'], falseFriends: null },
    { word: 'sollevare', article: null, category: 'abstract', definition: 'to raise (a question) / to lift',
      exampleSentence: 'Vorrei sollevare una questione importante.', collocations: ['sollevare un problema', 'sollevare una questione'], falseFriends: null },
    { word: 'indispensabile', article: null, category: 'abstract', definition: 'essential / indispensable',
      exampleSentence: 'Il dizionario e indispensabile per questo corso.', collocations: ['essere indispensabile', 'risultare indispensabile'], falseFriends: null },
    { word: 'approfittare', article: null, category: 'abstract', definition: 'to take advantage of',
      exampleSentence: 'Bisogna approfittare del bel tempo.', collocations: ["approfittare dell'occasione", 'approfittare del tempo'], falseFriends: null },
    // False friends (B2)
    { word: 'incinta', article: null, category: 'health', definition: 'pregnant',
      exampleSentence: 'Mia sorella e incinta di cinque mesi.', collocations: ['essere incinta', 'rimanere incinta'],
      falseFriends: { en: 'Note: "eccitato" has a sexual connotation; use "entusiasta" for "excited"' } },
    { word: 'raffreddore', article: 'il', category: 'health', definition: 'common cold',
      exampleSentence: 'Ho un brutto raffreddore.', collocations: ['avere il raffreddore', 'prendere il raffreddore'],
      falseFriends: null },
    { word: 'cartella', article: 'la', category: 'everyday', definition: 'folder / schoolbag',
      exampleSentence: 'Metti i documenti nella cartella blu.', collocations: ['cartella clinica', 'cartella scolastica'],
      falseFriends: null },
    // Environment
    { word: 'ambiente', article: "l'", category: 'environment', definition: 'environment',
      exampleSentence: "Dobbiamo proteggere l'ambiente.", collocations: ["proteggere l'ambiente", 'impatto ambientale', 'ambiente urbano'], falseFriends: null },
    { word: 'sostenibile', article: null, category: 'environment', definition: 'sustainable',
      exampleSentence: 'Abbiamo bisogno di uno sviluppo piu sostenibile.', collocations: ['sviluppo sostenibile', 'energia sostenibile'], falseFriends: null },
    { word: 'risorsa', article: 'la', category: 'environment', definition: 'resource',
      exampleSentence: 'Le risorse naturali sono limitate.', collocations: ['risorse naturali', 'risorse umane', 'risorsa rinnovabile'], falseFriends: null },
  ],

  C1: [
    // Academic
    { word: 'ambito', article: "l'", category: 'academic', definition: 'sphere / field / scope',
      exampleSentence: "Nell'ambito della ricerca, i risultati sono promettenti.", collocations: ["nell'ambito di", 'ambito lavorativo', 'ambito accademico'], falseFriends: null },
    { word: 'affrontare', article: null, category: 'academic', definition: 'to address / to tackle / to face',
      exampleSentence: 'E necessario affrontare questo tema con serieta.', collocations: ['affrontare un tema', 'affrontare un problema'], falseFriends: null },
    { word: 'svolgere', article: null, category: 'academic', definition: 'to carry out / to perform (a role)',
      exampleSentence: "Svolge un ruolo chiave nell'azienda.", collocations: ['svolgere un ruolo', 'svolgere un compito', 'svolgere funzioni'], falseFriends: null },
    { word: 'trasmettere', article: null, category: 'academic', definition: 'to transmit / to convey',
      exampleSentence: 'E difficile trasmettere questa idea in un\'altra lingua.', collocations: ['trasmettere un messaggio', 'trasmettere conoscenze'], falseFriends: null },
    { word: 'abbracciare', article: null, category: 'academic', definition: 'to embrace / to encompass',
      exampleSentence: 'Lo studio abbraccia un periodo di dieci anni.', collocations: ['abbracciare un tema', 'abbracciare una causa'], falseFriends: null },
    // Connectors
    { word: 'tuttavia', article: null, category: 'connectors', definition: 'nevertheless / however',
      exampleSentence: 'Il piano e rischioso; tuttavia, vale la pena tentare.', collocations: [], falseFriends: null },
    { word: 'nonostante', article: null, category: 'connectors', definition: 'despite / in spite of',
      exampleSentence: 'Nonostante le difficolta, ha continuato.', collocations: ['nonostante tutto', 'nonostante che + congiuntivo'], falseFriends: null },
    { word: 'invece', article: null, category: 'connectors', definition: 'on the other hand / instead',
      exampleSentence: 'Lui preferisce il cinema; lei, invece, preferisce il teatro.', collocations: ['invece di'], falseFriends: null },
    // Idiomatic
    { word: 'contare su', article: null, category: 'idiomatic', definition: 'to count on / rely on',
      exampleSentence: 'Puoi contare su di me per qualsiasi cosa.', collocations: ['contare su qualcuno'], falseFriends: null },
    { word: 'dare per scontato', article: null, category: 'idiomatic', definition: 'to take for granted',
      exampleSentence: 'Non dare per scontato che tutto andra bene.', collocations: ['dare qualcosa per scontato'], falseFriends: null },
    { word: 'farsi carico', article: null, category: 'idiomatic', definition: 'to take charge of / take responsibility for',
      exampleSentence: 'Si e fatta carico della situazione immediatamente.', collocations: ['farsi carico di qualcosa'], falseFriends: null },
    // Abstract
    { word: 'desiderio', article: 'il', category: 'abstract', definition: 'desire / wish',
      exampleSentence: 'Il suo desiderio di migliorarsi e ammirevole.', collocations: ['desiderio ardente', 'esprimere un desiderio'], falseFriends: null },
    { word: 'graduale', article: null, category: 'abstract', definition: 'gradual',
      exampleSentence: 'Si osserva un cambiamento graduale negli atteggiamenti.', collocations: ['in modo graduale', 'cambiamento graduale'], falseFriends: null },
    { word: 'svincolare', article: null, category: 'abstract', definition: 'to free / to release / to dissociate',
      exampleSentence: "E impossibile svincolare l'economia dalla politica.", collocations: ['svincolarsi da', 'svincolare qualcosa da qualcosa'], falseFriends: null },
    { word: 'inevitabile', article: null, category: 'abstract', definition: 'unavoidable / inevitable',
      exampleSentence: 'La riforma del sistema e un compito inevitabile.', collocations: ['responsabilita inevitabile'], falseFriends: null },
    // Formal
    { word: 'sbrigare', article: null, category: 'formal', definition: 'to handle / to process / to deal with',
      exampleSentence: 'Devo sbrigare le pratiche per il permesso di soggiorno.', collocations: ['sbrigare una pratica', 'sbrigarsi'], falseFriends: null },
    { word: 'vigente', article: null, category: 'formal', definition: 'in force / current / valid',
      exampleSentence: 'La legge vigente vieta questa pratica.', collocations: ['legislazione vigente', 'norma vigente'], falseFriends: null },
    { word: 'pronunciarsi', article: null, category: 'formal', definition: 'to rule / to issue a ruling / to express an opinion',
      exampleSentence: 'Il tribunale si e pronunciato a favore del querelante.', collocations: ['pronunciarsi su', 'pronunciarsi a favore'], falseFriends: null },
    { word: 'rescindere', article: null, category: 'formal', definition: 'to rescind / cancel (a contract)',
      exampleSentence: "L'azienda ha deciso di rescindere il contratto.", collocations: ['rescindere un contratto', 'rescindere un accordo'], falseFriends: null },
  ],

  C2: [
    // Literary
    { word: 'occorrere', article: null, category: 'literary', definition: 'to be necessary / to need (formal)',
      exampleSentence: 'Occorre agire con prudenza.', collocations: ['occorre che + congiuntivo'], falseFriends: null },
    { word: 'accadere', article: null, category: 'literary', definition: 'to happen / occur',
      exampleSentence: 'I fatti che accaddero quella estate cambiarono tutto.', collocations: ['accadere un evento'], falseFriends: null },
    { word: 'demarcazione', article: 'la', category: 'literary', definition: 'demarcation / delimitation',
      exampleSentence: 'La demarcazione tra i due concetti non e chiara.', collocations: ['linea di demarcazione'], falseFriends: null },
    { word: 'intravedere', article: null, category: 'literary', definition: 'to glimpse / to make out',
      exampleSentence: 'Si puo intravedere un cambiamento all\'orizzonte politico.', collocations: ['intravedere una soluzione'], falseFriends: null },
    // Colloquial
    { word: 'sgobbare', article: null, category: 'colloquial', definition: 'to work hard / to slog (informal)',
      exampleSentence: 'Ho sgobbato tutto il giorno senza fermarmi.', collocations: ['sgobbare molto', 'sgobbare sui libri'], falseFriends: null },
    { word: 'figo', article: null, category: 'colloquial', definition: 'cool / great (informal)',
      exampleSentence: 'Quel film e troppo figo!', collocations: ['troppo figo', 'che figata'], falseFriends: null },
    { word: 'allucinante', article: null, category: 'colloquial', definition: 'unbelievable / mind-blowing (informal)',
      exampleSentence: 'Il concerto e stato allucinante!', collocations: ['roba allucinante'], falseFriends: null },
    // Idiomatic
    { word: 'non farcela', article: null, category: 'idiomatic', definition: 'to not be able to cope / to not manage',
      exampleSentence: 'Con tutti questi ordini, non ce la facciamo.', collocations: ['non farcela piu'], falseFriends: null },
    { word: 'alla lettera', article: null, category: 'idiomatic', definition: 'to the letter / literally',
      exampleSentence: 'Segue le regole alla lettera.', collocations: ['prendere alla lettera', 'seguire alla lettera'], falseFriends: null },
    { word: 'azzeccarci', article: null, category: 'idiomatic', definition: 'to hit the nail on the head / to get it right',
      exampleSentence: 'Con quel commento, ci hai azzeccato.', collocations: ['azzeccarci in pieno'], falseFriends: null },
    // Academic
    { word: 'eludere', article: null, category: 'academic', definition: 'to evade / to elude / to bypass',
      exampleSentence: 'Non possiamo eludere le responsabilita etiche.', collocations: ['eludere un problema', 'eludere la legge'], falseFriends: null },
    { word: 'sottostare', article: null, category: 'academic', definition: 'to underlie / to be subject to',
      exampleSentence: 'Le cause che sottostanno al conflitto sono complesse.', collocations: ['sottostare a qualcosa'], falseFriends: null },
    { word: 'concatenare', article: null, category: 'academic', definition: 'to link together / concatenate',
      exampleSentence: 'Si sono concatenati vari errori che hanno provocato la crisi.', collocations: ['concatenare idee', 'concatenare fatti'], falseFriends: null },
    { word: 'chiarire', article: null, category: 'academic', definition: 'to clarify / to elucidate',
      exampleSentence: 'Hanno cercato di chiarire le cause dell\'incidente.', collocations: ['chiarire una questione', 'chiarire un equivoco'], falseFriends: null },
    { word: 'addurre', article: null, category: 'academic', definition: 'to put forward (an argument) / to adduce',
      exampleSentence: 'Ha addotto argomenti molto convincenti.', collocations: ['addurre un argomento', 'addurre ragioni'], falseFriends: null },
    // Regional
    { word: 'boh', article: null, category: 'regional', definition: 'I dunno / who knows (very Italian)',
      exampleSentence: 'Che vuoi mangiare stasera? — Boh, non so.', collocations: [],
      falseFriends: { note: 'Universally Italian; often accompanied by a shrug' } },
    { word: 'magari', article: null, category: 'regional', definition: 'maybe / I wish / if only',
      exampleSentence: 'Magari potessimo tornare in vacanza!', collocations: ['magari fosse vero'],
      falseFriends: { note: 'Extremely versatile — context determines meaning (wish, possibility, acceptance)' } },
    { word: 'daje', article: null, category: 'regional', definition: 'come on! / let\'s go! (Roman)',
      exampleSentence: 'Daje, che ce la facciamo!', collocations: [],
      falseFriends: { note: 'Roman dialect — standard Italian uses "dai" or "forza"' } },
    { word: 'guaglio', article: null, category: 'regional', definition: 'boy / young man (Neapolitan)',
      exampleSentence: 'Guaglio, vieni qua!', collocations: [],
      falseFriends: { note: 'Neapolitan — standard Italian: "ragazzo"' } },
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
      message: correctCount === exercise.pairs.length ? 'Perfetto!' : `${correctCount}/${exercise.pairs.length} correct.`,
    };
  }

  const expected = normalise(exercise.answer);
  const given = normalise(userAnswer);

  if (given === expected) {
    return { correct: true, message: 'Corretto! Ben fatto.' };
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
