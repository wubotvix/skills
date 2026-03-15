const core = require('../_lib/core');

const SKILL_NAME = 'italian-writing';

// ── Correction categories ──────────────────────────────────────────────────
const CORRECTION_CATEGORIES = [
  'gender', 'agreement', 'essere-auxiliary', 'tense',
  'congiuntivo', 'prepositions', 'spelling', 'punctuation',
];

// ── Prompts by CEFR level ──────────────────────────────────────────────────
const PROMPTS = {
  A1: [
    {
      id: 'a1-personal-1', category: 'personal', title: 'Cartolina dalle vacanze',
      type: 'postcard',
      instructions: 'Scrivi una cartolina a un amico dal luogo di vacanza. Includi: dove sei, che tempo fa, cosa fai ogni giorno. (30-50 parole)',
      targetStructures: ['present tense regular verbs', 'essere/stare + location', 'fare for weather'],
      rubric: {
        content: 'Mentions location, weather, and daily activity',
        grammar: 'Correct present tense conjugation of regular -are/-ere/-ire verbs',
        vocabulary: 'Basic travel and weather words used appropriately',
        organization: 'Greeting, body, farewell structure',
      },
      modelResponse: 'Caro Marco, sono a Rimini. Fa molto caldo e c\'è il sole. Ogni giorno vado in spiaggia e mangio il gelato. La sera passeggio sul lungomare. La città è molto bella. A presto! Giulia',
    },
    {
      id: 'a1-personal-2', category: 'personal', title: 'La mia famiglia',
      type: 'description',
      instructions: 'Descrivi la tua famiglia. Includi: nomi, età, professioni e qualcosa che piace fare. (40-60 parole)',
      targetStructures: ['essere for descriptions', 'avere for age', 'possessive adjectives with articles'],
      rubric: {
        content: 'Names at least 3 family members with details',
        grammar: 'Correct use of essere/avere; gender agreement with adjectives; possessives with articles (il mio, la mia)',
        vocabulary: 'Family terms, numbers, professions',
        organization: 'Logical grouping of family members',
      },
      modelResponse: 'La mia famiglia è piccola. Mio padre si chiama Carlo e ha 45 anni. È professore. Mia madre si chiama Maria e ha 42 anni. È dottoressa. Mia sorella Anna ha 12 anni. È studentessa. Il fine settimana ci piace andare al parco.',
    },
    {
      id: 'a1-formal-1', category: 'formal', title: 'Prenotazione albergo',
      type: 'email',
      instructions: 'Scrivi una breve email per prenotare una camera d\'albergo. Includi: date, tipo di camera, numero di persone. (30-50 parole)',
      targetStructures: ['vorrei + infinitive', 'numbers and dates', 'formal Lei register'],
      rubric: {
        content: 'Includes dates, room type, number of guests',
        grammar: 'Correct formal register (Lei); vorrei + infinitive',
        vocabulary: 'Hotel vocabulary: camera, prenotazione, notte',
        organization: 'Greeting, request, sign-off',
      },
      modelResponse: 'Gentile signore, vorrei prenotare una camera doppia per due persone dal 15 al 20 giugno. Quanto costa a notte? La ringrazio per la Sua attenzione. Cordiali saluti, Pietro Rossi',
    },
    {
      id: 'a1-creative-1', category: 'creative', title: 'La mia giornata perfetta',
      type: 'narrative',
      instructions: 'Descrivi la tua giornata perfetta dalla mattina alla sera. Usa espressioni di tempo. (40-60 parole)',
      targetStructures: ['time expressions', 'reflexive verbs', 'present tense sequence'],
      rubric: {
        content: 'Covers morning, afternoon, and evening with activities',
        grammar: 'Correct reflexive verb forms; time expressions',
        vocabulary: 'Daily routine vocabulary',
        organization: 'Chronological order with time markers',
      },
      modelResponse: 'La mattina mi sveglio alle nove. Faccio colazione con la mia famiglia. Alle undici vado al mare. Il pomeriggio mangio in un ristorante. La sera passeggio per la città e prendo un gelato. Mi addormento alle undici. È perfetto!',
    },
  ],
  A2: [
    {
      id: 'a2-personal-1', category: 'personal', title: 'Il mio ultimo fine settimana',
      type: 'narrative',
      instructions: 'Racconta cosa hai fatto lo scorso fine settimana. Includi almeno 4 attività e di\' con chi eri. (60-80 parole)',
      targetStructures: ['passato prossimo with avere and essere', 'time markers: sabato, dopo, poi'],
      rubric: {
        content: 'At least 4 activities with companions mentioned',
        grammar: 'Correct passato prossimo forms; essere vs avere auxiliary selection; past participle agreement',
        vocabulary: 'Leisure activities, time connectors',
        organization: 'Chronological narrative with connectors',
      },
      modelResponse: 'Sabato mattina sono andato al mercato con mia madre e abbiamo comprato la frutta fresca. Dopo abbiamo mangiato a casa di mia nonna. Il pomeriggio ho giocato a calcio con i miei amici al parco. Domenica mi sono alzato tardi. Poi ho studiato italiano e la sera ho visto un film con mio fratello. È stato un fine settimana molto divertente.',
    },
    {
      id: 'a2-personal-2', category: 'personal', title: 'Lettera a un amico di penna',
      type: 'letter',
      instructions: 'Scrivi una lettera informale a un nuovo amico di penna. Presentati, parla dei tuoi gusti e fagli delle domande. (70-90 parole)',
      targetStructures: ['piacere construction', 'indirect object pronouns', 'question formation'],
      rubric: {
        content: 'Self-introduction, likes/dislikes, questions to the friend',
        grammar: 'Correct piacere structure; indirect pronouns (mi, ti, gli/le)',
        vocabulary: 'Hobbies, interests, personality adjectives',
        organization: 'Informal letter format with greeting and questions',
      },
      modelResponse: 'Ciao Marco! Mi chiamo Lucia e ho 16 anni. Abito a Firenze, una città bellissima in Toscana. Mi piace molto la musica e suono la chitarra. Mi piace anche leggere i romanzi di avventura. Non mi piacciono per niente gli sport, sono troppo noiosi! E tu? Cosa ti piace fare nel tempo libero? Ti piace la musica? Aspetto la tua risposta. Un abbraccio, Lucia',
    },
    {
      id: 'a2-formal-1', category: 'formal', title: 'Reclamo per un prodotto',
      type: 'email',
      instructions: 'Scrivi un\'email di reclamo perché hai comprato un prodotto che è arrivato rotto. Spiega cosa è successo e cosa vuoi. (60-80 parole)',
      targetStructures: ['passato prossimo for narrating events', 'condizionale for polite requests'],
      rubric: {
        content: 'States problem clearly, explains what happened, requests solution',
        grammar: 'Passato prossimo narration; condizionale for polite requests',
        vocabulary: 'Shopping and complaint vocabulary',
        organization: 'Problem statement, details, request, closing',
      },
      modelResponse: 'Gentili signori, il 3 marzo ho comprato una lampada nel vostro negozio online. Quando è arrivato il pacco, la lampada era rotta. Vorrei ricevere una nuova lampada o il rimborso dei miei soldi. Allego una foto del prodotto danneggiato. Attendo una vostra risposta al più presto. Distinti saluti, Roberto Bianchi',
    },
    {
      id: 'a2-creative-1', category: 'creative', title: 'Una storia con le parole',
      type: 'narrative',
      instructions: 'Guarda queste parole e scrivi una storia breve che le includa tutte: gatto, pioggia, finestra, cioccolato, sorpresa. (60-90 parole)',
      targetStructures: ['passato prossimo vs imperfetto basic', 'descriptive adjectives', 'sequencing'],
      rubric: {
        content: 'All 5 words included in a coherent story',
        grammar: 'Appropriate use of passato prossimo and imperfetto',
        vocabulary: 'Descriptive language, all trigger words used naturally',
        organization: 'Beginning, middle, end structure',
      },
      modelResponse: 'Era un pomeriggio di pioggia. Il mio gatto era seduto sulla finestra e guardava la strada. Io ho preparato un cioccolato caldo e mi sono seduto a leggere. All\'improvviso il gatto è saltato dalla finestra e ha corso alla porta. Ho aperto la porta e ho trovato una scatola. Era una sorpresa della mia amica! Dentro c\'era un libro e dei biscotti. È stato un pomeriggio perfetto.',
    },
  ],
  B1: [
    {
      id: 'b1-personal-1', category: 'personal', title: 'Un cambiamento importante nella mia vita',
      type: 'essay',
      instructions: 'Scrivi di un cambiamento importante nella tua vita (trasloco, nuovo lavoro, nuovo hobby). Spiega perché l\'hai fatto, come ti sei sentito e cosa hai imparato. (100-140 parole)',
      targetStructures: ['passato prossimo vs imperfetto contrast', 'past emotions with imperfetto', 'cause/effect connectors'],
      rubric: {
        content: 'Describes change, motivation, feelings, and lesson learned',
        grammar: 'Consistent passato prossimo/imperfetto distinction; correct connector usage',
        vocabulary: 'Emotions vocabulary, cause-effect language (perché, per questo, quindi)',
        organization: 'Introduction, development with timeline, reflection/conclusion',
      },
      modelResponse: 'Due anni fa ho deciso di trasferirmi dal mio paese a Milano per studiare all\'università. All\'inizio avevo molta paura perché non conoscevo nessuno e tutto era diverso. I primi mesi sono stati difficili: mi sentivo solo e mi mancava la mia famiglia. Tuttavia, poco a poco ho fatto amicizia con i compagni di corso e ho cominciato a godermi la città. Ho imparato a cucinare, a organizzare il mio tempo e a essere più indipendente. Adesso so che è stata la decisione migliore della mia vita perché mi ha aiutato a crescere come persona. A volte i cambiamenti fanno paura, ma sono necessari.',
    },
    {
      id: 'b1-formal-1', category: 'formal', title: 'Lettera di candidatura',
      type: 'letter',
      instructions: 'Scrivi una lettera formale per candidarti come cameriere/a in un ristorante. Includi la tua esperienza, disponibilità e perché vuoi il lavoro. Usa il registro formale con Lei. (100-130 parole)',
      targetStructures: ['formal register Lei', 'passato prossimo for experience', 'condizionale for polite language'],
      rubric: {
        content: 'States position, relevant experience, availability, motivation',
        grammar: 'Consistent formal register (Lei); passato prossimo; condizionale for politeness',
        vocabulary: 'Work vocabulary, formal expressions (mi rivolgo a Lei, allego)',
        organization: 'Formal letter structure: header, greeting, body paragraphs, closing',
      },
      modelResponse: 'Gentile direttore, mi rivolgo a Lei per candidarmi al posto di cameriere pubblicato sul Suo sito web. Ho lavorato per due anni al ristorante La Tavola, dove ho acquisito esperienza nel servizio ai clienti e al tavolo. Sono una persona responsabile, organizzata e mi piace lavorare in squadra. Sono disponibile tutti i fine settimana e i pomeriggi durante la settimana. Mi piacerebbe lavorare nel Suo ristorante perché ha un\'ottima reputazione e sarei felice di far parte del Suo team. Allego il mio curriculum per la Sua considerazione. Resto a Sua disposizione per un colloquio. Distinti saluti, Elena Russo',
    },
    {
      id: 'b1-academic-1', category: 'academic', title: 'Vantaggi e svantaggi dei social media',
      type: 'essay',
      instructions: 'Scrivi un tema sui vantaggi e gli svantaggi dei social media. Dai almeno due esempi per ciascuno e la tua opinione personale. (120-150 parole)',
      targetStructures: ['opinion expressions', 'contrast connectors (tuttavia, d\'altra parte)', 'congiuntivo presente with doubt/opinion'],
      rubric: {
        content: 'At least 2 advantages, 2 disadvantages, personal opinion',
        grammar: 'Correct use of contrast connectors; congiuntivo with opinions (credo che, penso che)',
        vocabulary: 'Technology vocabulary, discourse markers',
        organization: 'Introduction, advantages paragraph, disadvantages paragraph, conclusion',
      },
      modelResponse: 'I social media fanno parte della nostra vita quotidiana, ma hanno aspetti positivi e negativi. Da un lato, ci permettono di comunicare con persone di tutto il mondo e di condividere informazioni rapidamente. Inoltre, sono utili per trovare lavoro e imparare cose nuove. Dall\'altro lato, i social media possono creare dipendenza, soprattutto tra i giovani. È anche possibile che influenzino la nostra autostima perché confrontiamo sempre la nostra vita con quella degli altri. Secondo me, i social media sono uno strumento utile se li usiamo con moderazione. È importante che non passiamo troppo tempo connessi e che manteniamo le nostre relazioni nella vita reale. In conclusione, credo che dobbiamo essere responsabili nel loro uso.',
    },
    {
      id: 'b1-creative-1', category: 'creative', title: 'Continua la storia',
      type: 'narrative',
      instructions: 'Continua questa storia: "Quando ho aperto la porta dell\'appartamento, tutto era diverso. I mobili erano spariti e in mezzo al salotto c\'era..." Scrivi cosa è successo dopo. (100-140 parole)',
      targetStructures: ['trapassato prossimo', 'narrative tenses', 'direct speech'],
      rubric: {
        content: 'Coherent continuation with conflict/resolution; creative details',
        grammar: 'Correct trapassato prossimo; consistent narrative tenses; punctuated dialogue',
        vocabulary: 'Descriptive and emotional language',
        organization: 'Builds suspense, develops plot, reaches resolution',
      },
      modelResponse: '...una valigia enorme di colore rosso. Mi sono avvicinato piano perché avevo paura. Quando l\'ho aperta, ho trovato dentro un biglietto che diceva: "Non preoccuparti. Guarda dalla finestra." Sono andato alla finestra e ho visto che in strada c\'era un camion dei traslochi. In quel momento è suonato il telefono. Era mia sorella. "Sorpresa! Abbiamo rinnovato il tuo appartamento mentre eri in viaggio", mi ha detto ridendo. Non ci potevo credere. Quando sono sceso in strada, la mia famiglia aveva preparato tutti i mobili nuovi. Abbiamo portato tutto su e alla fine l\'appartamento era bellissimo. Era stata la migliore sorpresa della mia vita. Quella sera abbiamo festeggiato con una cena tutti insieme.',
    },
  ],
  B2: [
    {
      id: 'b2-personal-1', category: 'personal', title: 'Riflessione su un viaggio che ti ha cambiato',
      type: 'essay',
      instructions: 'Scrivi di un viaggio che ha cambiato la tua prospettiva. Descrivi il luogo, un\'esperienza concreta e come ti ha trasformato. Usa connettivi variati e vocabolario preciso. (140-180 parole)',
      targetStructures: ['congiuntivo in relative clauses', 'advanced connectors (nonostante, malgrado)', 'nominalizzazione'],
      rubric: {
        content: 'Vivid description, specific anecdote, reflection on personal change',
        grammar: 'Congiuntivo in subordinate clauses; advanced connector variety',
        vocabulary: 'Rich descriptive language; precise emotional vocabulary',
        organization: 'Engaging introduction, narrative body, reflective conclusion',
      },
      modelResponse: 'Non avrei mai immaginato che un viaggio in Sicilia potesse cambiare il mio modo di vedere il mondo. Ero partito cercando spiagge e buon cibo, ma ho trovato qualcosa di molto più profondo. Una mattina, una signora anziana mi ha invitato nel suo laboratorio di ceramiche a Caltagirone. Mentre mi insegnava a dipingere le maioliche, mi ha spiegato che ogni disegno raccontava la storia della sua comunità. Mi sono reso conto che, malgrado viviamo in un mondo globalizzato, ci sono conoscenze ancestrali che nessuna tecnologia può sostituire. Quell\'esperienza mi ha fatto mettere in discussione la mia ossessione per la produttività. Nonostante ciò, la cosa più preziosa non è stata la tecnica che ho imparato, bensì la pazienza che ho osservato in ogni gesto di quella donna. Da allora, cerco di dedicare più tempo ai processi e meno ai risultati. La Sicilia mi ha insegnato che la vera ricchezza non si misura in efficienza.',
    },
    {
      id: 'b2-formal-1', category: 'formal', title: 'Lettera al direttore di un giornale',
      type: 'letter',
      instructions: 'Scrivi una lettera al direttore di un giornale esprimendo la tua opinione sulla chiusura al traffico del centro città. Argomenta a favore o contro con dati e ragioni. Usa il registro formale con Lei. (140-180 parole)',
      targetStructures: ['congiuntivo with value judgments', 'impersonal constructions (si + verbo)', 'condizionale for hypothetical'],
      rubric: {
        content: 'Clear position, at least 3 arguments, counterargument addressed',
        grammar: 'Congiuntivo with opinion/value; impersonal si; condizionale for hypotheticals',
        vocabulary: 'Formal argumentation language; urban planning vocabulary',
        organization: 'Position statement, arguments with evidence, counterargument, conclusion',
      },
      modelResponse: 'Egregio direttore, Le scrivo in merito alla proposta di vietare la circolazione delle auto nel centro città. Ritengo che sia fondamentale che le autorità prendano provvedimenti per migliorare la qualità dell\'aria. In primo luogo, è stato dimostrato che l\'inquinamento nel centro supera i limiti raccomandati dall\'OMS. Se si limitasse il traffico, i livelli di inquinamento si ridurrebbero fino al 40%. In secondo luogo, le città europee che hanno creato zone pedonali hanno visto un aumento del commercio locale. È vero che alcuni commercianti temono di perdere clienti; tuttavia, l\'esperienza di altre città italiane dimostra il contrario. Infine, è necessario che si investa in un trasporto pubblico efficiente come alternativa. Non sarebbe giusto vietare le auto senza offrire opzioni valide. In definitiva, sostengo questa misura a condizione che sia accompagnata da un piano integrale di mobilità. Distinti saluti, Carmen Ferretti',
    },
    {
      id: 'b2-academic-1', category: 'academic', title: 'Tema argomentativo: educazione bilingue',
      type: 'essay',
      instructions: 'Scrivi un tema argomentativo sul fatto che l\'educazione bilingue debba essere obbligatoria. Presenta tesi, argomenti, controargomento e conclusione. (150-200 parole)',
      targetStructures: ['congiuntivo in concessive clauses', 'passive constructions', 'academic hedging (è opportuno segnalare, conviene sottolineare)'],
      rubric: {
        content: 'Clear thesis, 2-3 supporting arguments, counterargument, conclusion',
        grammar: 'Congiuntivo in concessive/purpose clauses; passive voice; hedging',
        vocabulary: 'Academic register; education terminology; hedging expressions',
        organization: 'Thesis introduction, body paragraphs with topic sentences, balanced conclusion',
      },
      modelResponse: 'Negli ultimi decenni l\'educazione bilingue è stata oggetto di un intenso dibattito. È opportuno segnalare che, sebbene presenti delle sfide, i benefici cognitivi e professionali giustificano la sua implementazione obbligatoria. In primo luogo, numerosi studi hanno dimostrato che il bilinguismo migliora la flessibilità cognitiva e ritarda il deterioramento mentale. Conviene sottolineare che questi benefici si massimizzano quando l\'esposizione comincia nell\'infanzia. In secondo luogo, in un mercato del lavoro globalizzato, la padronanza di due lingue costituisce un vantaggio competitivo indiscutibile. Sebbene sia comprensibile che alcuni genitori temano che l\'educazione bilingue possa rallentare l\'apprendimento dei contenuti, le ricerche indicano che, a lungo termine, gli alunni bilingui eguagliano o superano i loro compagni monolingui. Tuttavia, è indispensabile che venga garantita una formazione adeguata del corpo docente e che vengano destinate risorse sufficienti. In conclusione, l\'educazione bilingue obbligatoria rappresenterebbe un investimento nel capitale umano della nostra società.',
    },
    {
      id: 'b2-creative-1', category: 'creative', title: 'Microracconto: l\'oggetto perduto',
      type: 'narrative',
      instructions: 'Scrivi un microracconto su qualcuno che trova un oggetto misterioso. Cura lo stile letterario: usa metafore, ritmo e un finale a sorpresa. (120-160 parole)',
      targetStructures: ['literary past tenses (passato remoto)', 'metaphor and simile', 'sentence rhythm variation'],
      rubric: {
        content: 'Complete micro-narrative with mystery element and surprise ending',
        grammar: 'Fluent past tense narration (passato remoto for literary effect); varied sentence structures',
        vocabulary: 'Literary language; sensory details; figurative expressions',
        organization: 'Compressed narrative arc; impactful ending',
      },
      modelResponse: 'La trovò sul marciapiede, tra due pozzanghere che riflettevano un cielo plumbeo. Era una chiave di bronzo, antica, con un\'incisione che sembrava un labirinto. Se la mise in tasca come chi custodisce una promessa. Per settimane provò serrature: quella della soffitta della nonna, quella del diario mai scritto, quella dell\'armadio dove conservava lettere mai spedite. Nessuna cedeva. Una notte insonne, mentre si rigirava nel letto, sentì il metallo freddo contro la coscia. La tirò fuori e, senza pensarci, l\'avvicinò al proprio petto. Si incastrò. Un clic lieve, quasi impercettibile. Allora ricordò tutto ciò che aveva dimenticato di proposito: la voce di suo padre, l\'odore del mare a settembre, la risata che aveva messo a tacere. La chiave non apriva porte. Apriva persone.',
    },
  ],
  C1: [
    {
      id: 'c1-academic-1', category: 'academic', title: 'Analisi critica di un fenomeno culturale',
      type: 'essay',
      instructions: 'Scrivi un\'analisi critica sulla gentrificazione culturale (o un fenomeno simile). Analizza cause, conseguenze e proposte. Usa registro accademico con sfumature. (180-230 parole)',
      targetStructures: ['congiuntivo in hypothetical se clauses', 'nominalizzazione', 'academic hedging and distancing'],
      rubric: {
        content: 'Nuanced analysis with causes, effects, proposals; avoids oversimplification',
        grammar: 'Complex subordination; condizionale/congiuntivo hypotheticals; impersonal constructions',
        vocabulary: 'Academic lexis; abstract nominalizations; discipline-specific terms',
        organization: 'Introduction with framing, analytical body, nuanced conclusion',
      },
      modelResponse: 'La gentrificazione culturale costituisce uno dei fenomeni più controversi dell\'urbanizzazione contemporanea. La si potrebbe definire come il processo mediante il quale l\'arrivo di nuovi residenti con maggiore potere d\'acquisto trasforma non soltanto l\'economia, bensì il tessuto culturale di un quartiere. Tra le cause si annoverano la speculazione immobiliare e la mercificazione del patrimonio culturale. Se è vero che la riqualificazione urbana può migliorare le infrastrutture, non si deve ignorare che frequentemente comporta lo spostamento di comunità radicate. Il caso del quartiere Testaccio a Roma illustra questa tensione: quello che un tempo era un rione operaio ha subito una metamorfosi che, qualora non fosse stata accompagnata da politiche abitative sociali, avrebbe determinato l\'espulsione totale dei suoi abitanti originari. Sarebbe riduttivo attribuire tale fenomeno esclusivamente al mercato; le politiche pubbliche svolgono un ruolo determinante. Sarebbe auspicabile che le amministrazioni implementassero meccanismi di tutela del commercio tradizionale e garantissero il diritto all\'abitazione. In definitiva, la gentrificazione culturale ci obbliga a ripensare quale modello di città intendiamo costruire e per chi.',
    },
    {
      id: 'c1-formal-1', category: 'formal', title: 'Relazione professionale con raccomandazioni',
      type: 'report',
      instructions: 'Redigi una relazione per la direzione della tua azienda raccomandando l\'implementazione del telelavoro parziale. Includi contesto, dati, vantaggi, rischi e raccomandazione finale. (180-230 parole)',
      targetStructures: ['passive and impersonal constructions', 'condizionale for recommendations', 'formal hedging (sarebbe opportuno, converrebbe)'],
      rubric: {
        content: 'Context, evidence, balanced analysis, actionable recommendation',
        grammar: 'Passive/impersonal; modal verbs for hedging; condizionale for advice',
        vocabulary: 'Business register; report language (si raccomanda, è opportuno evidenziare)',
        organization: 'Numbered sections or clear heading structure; executive summary tone',
      },
      modelResponse: 'Relazione sull\'implementazione del telelavoro parziale. 1. Contesto: Dopo l\'esperienza maturata negli ultimi anni, si è constatato che il modello di lavoro esclusivamente in presenza risulta sempre meno competitivo. La presente relazione analizza la fattibilità di un modello ibrido. 2. Dati rilevanti: Secondo uno studio dell\'Università di Stanford, la produttività aumenta del 13% nei dipendenti che lavorano da remoto. Inoltre, il nostro sondaggio interno rivela che il 78% del personale valuta positivamente questa modalità. 3. Vantaggi: Si ridurrebbero i costi operativi di circa il 20%. Inoltre, ci si potrebbe attendere un miglioramento della conciliazione vita-lavoro, che diminuirebbe il turnover del personale. 4. Rischi: Converrebbe segnalare che l\'isolamento sociale potrebbe incidere sul lavoro di squadra. Sarebbe altresì necessario investire in strumenti digitali di collaborazione. 5. Raccomandazione: Si raccomanda di implementare un modello di tre giorni in presenza e due di telelavoro per un periodo di prova di sei mesi, al termine del quale si valuterebbero i risultati. Tale implementazione dovrebbe essere accompagnata da una formazione sulla gestione da remoto per i responsabili di team.',
    },
    {
      id: 'c1-creative-1', category: 'creative', title: 'Colonna d\'opinione con ironia',
      type: 'opinion',
      instructions: 'Scrivi una colonna d\'opinione ironica sull\'ossessione contemporanea per la produttività. Usa umorismo, riferimenti culturali e uno stile letterario curato. (160-210 parole)',
      targetStructures: ['irony and understatement', 'rhetorical questions', 'congiuntivo in independent clauses (magari, forse che)'],
      rubric: {
        content: 'Clear ironic thesis; humor that serves the argument; cultural references',
        grammar: 'Rhetorical structures; congiuntivo for wishes/doubt; varied subordination',
        vocabulary: 'Journalistic register with literary flair; ironic tone markers',
        organization: 'Hook opening, escalating irony, reflective closing',
      },
      modelResponse: 'Svegliati alle cinque, medita, corri dieci chilometri, fai colazione con un frullato verde e abbi scritto tre pagine del tuo romanzo prima dell\'alba. Benvenuti nell\'era in cui riposare è peccato e l\'ozio una malattia da curare con app di produttività. Forse i nostri nonni, che si sedevano a prendere il caffè al bar senza cronometro, erano degli incoscienti. O forse sapevano qualcosa che noi abbiamo dimenticato. Oggi ottimizziamo il sonno, gamifichiamo la lettura e trasformiamo ogni passeggiata in una "sessione di mindfulness con obiettivi misurabili". Magari qualcuno ci spiegasse quando abbiamo perso il diritto di non fare assolutamente nulla. La cosa più ironica è che questa ossessione per il rendimento ci ha resi profondamente inefficienti: spendiamo più energia a organizzare le nostre liste di cose da fare che a farle. Nel frattempo, i guru della produttività ci vendono corsi su come recuperare il tempo che perdiamo comprando corsi. Chissà, forse la rivoluzione del ventunesimo secolo non sarà tecnologica ma la più antica di tutte: sedersi, guardare dalla finestra e lasciare che il tempo faccia quello che gli pare.',
    },
    {
      id: 'c1-personal-1', category: 'personal', title: 'Saggio riflessivo: identità e lingua',
      type: 'essay',
      instructions: 'Rifletti su come imparare l\'italiano ha influenzato la tua identità o il tuo modo di pensare. Esplora il rapporto tra lingua e pensiero. (160-200 parole)',
      targetStructures: ['abstract vocabulary', 'complex conditional (a + infinito)', 'concessive structures'],
      rubric: {
        content: 'Personal and philosophical depth; specific examples of language-thought link',
        grammar: 'Complex subordination; alternative conditional forms; concessive clauses',
        vocabulary: 'Abstract/philosophical lexis; metalinguistic awareness',
        organization: 'Personal hook, philosophical exploration, insightful conclusion',
      },
      modelResponse: 'Se non avessi cominciato a studiare italiano, probabilmente continuerei a credere che le emozioni siano universali. Ma quando ho scoperto che in italiano si può provare la "nostalgia" — quel sentimento profondo che intreccia mancanza e dolcezza — ho capito che ogni lingua ritaglia la realtà in modo diverso. Imparare l\'italiano non mi ha dato solo uno strumento di comunicazione; mi ha regalato un nuovo modo di stare al mondo. In italiano si dice "mi manca" — il soggetto grammaticale è la cosa assente, non io che sento la mancanza. Questa inversione, che all\'inizio mi sembrava un capriccio grammaticale, nasconde una filosofia: siamo in relazione con ciò che ci manca, non ne siamo i padroni. Per quanto non padroneggi tutte le sfumature del congiuntivo, riconosco che pensare in italiano mi ha reso più tollerante verso l\'ambiguità. Il congiuntivo, dopotutto, è il modo del possibile, del desiderato, dell\'incerto. Se qualcosa mi ha insegnato questa lingua è che non tutto deve essere categorico. A volte, "può darsi che" è più onesto di "sono sicuro che". E in quel dubbio abita una saggezza che la mia lingua madre non mi aveva mostrato.',
    },
  ],
  C2: [
    {
      id: 'c2-academic-1', category: 'academic', title: 'Saggio accademico: lingua e ideologia',
      type: 'essay',
      instructions: 'Scrivi un saggio accademico su come il linguaggio costruisce realtà ideologiche. Analizza un esempio concreto (media, politica, pubblicità). Registro accademico rigoroso. (200-260 parole)',
      targetStructures: ['nominalization chains', 'academic distancing (si potrebbe sostenere)', 'intertextuality'],
      rubric: {
        content: 'Sophisticated thesis; concrete example analyzed in depth; theoretical grounding',
        grammar: 'Native-level subordination; impeccable register consistency; zero errors expected',
        vocabulary: 'Academic discourse; critical theory terminology; precise and varied',
        organization: 'Academic essay with thesis, analytical framework, evidence, implications',
      },
      modelResponse: 'Il linguaggio, lungi dal costituire un veicolo neutro di trasmissione informativa, opera come meccanismo di costruzione ideologica. Come osservava Fairclough, ogni atto discorsivo implica una scelta — e ogni scelta, un\'esclusione. Si consideri il trattamento mediatico dei movimenti migratori. Quando un mezzo di comunicazione impiega "ondata di immigrati" anziché "arrivo di persone migranti", non sta descrivendo la realtà: la sta configurando. La metafora del disastro naturale disumanizza il soggetto e naturalizza la percezione di minaccia. Si potrebbe sostenere che si tratti di mere convenzioni stilistiche; tuttavia, la ricerca in linguistica cognitiva ha dimostrato che le metafore concettuali plasmano i quadri interpretativi del destinatario. La nominalizzazione costituisce un altro strumento ideologicamente connotato: trasformare "la polizia ha sgomberato le famiglie" in "lo sgombero delle famiglie" cancella l\'agente e sfuma la responsabilità. Questo fenomeno, che Fowler definì "mistificazione sintattica", risulta particolarmente efficace proprio perché passa inosservato. Si potrebbe concludere che l\'alfabetizzazione critica — la capacità di smontare questi meccanismi — dovrebbe occupare un posto centrale nell\'istruzione. In caso contrario, rischiamo di abitare un mondo le cui coordinate ideologiche sono state tracciate da altri senza che ne siamo nemmeno consapevoli.',
    },
    {
      id: 'c2-creative-1', category: 'creative', title: 'Racconto breve: voci multiple',
      type: 'narrative',
      instructions: 'Scrivi un racconto breve che impieghi almeno due voci narrative distinte (prima persona, terza, monologo interiore, ecc.) sullo stesso avvenimento. Cura lo stile letterario. (200-260 parole)',
      targetStructures: ['narrative voice shifts', 'literary congiuntivo (imperfetto)', 'rhetorical and poetic devices'],
      rubric: {
        content: 'At least 2 distinct narrative voices; same event from different perspectives',
        grammar: 'Flawless command of all tenses including passato remoto; deliberate stylistic choices',
        vocabulary: 'Literary register; sensory precision; voice differentiation through lexis',
        organization: 'Clear voice transitions; structural choice serves the narrative',
      },
      modelResponse: 'I. La donna sulla banchina. Lo vidi salire sul treno con quella valigia che sembrava contenere il peso di tutti gli addii. Non si voltò. Non si voltano mai quelli che se ne vanno davvero. Rimasi sulla banchina con le mani vuote e quella sensazione — come spiegarla? — che qualcuno avesse strappato una pagina dal libro che stavamo scrivendo insieme. Il treno si allontanò e la banchina si riempì di un silenzio che sapeva di metallo e di pioggia imminente. II. L\'uomo sul treno. Se lei sapesse che ogni passo verso il vagone fu un atto di vigliaccheria travestito da coraggio. Sedersi. Non guardare indietro. Così si sopravvive: trasformando le fughe in decisioni. La valigia pesa esattamente quanto pesano le cose che non si dicono. Il treno parte e il paesaggio comincia a disfarsi come un ricordo che si sta già trasformando in finzione. III. Il controllore. Un altro passeggero con gli occhi rossi. Un\'altra donna immobile sulla banchina. Questo treno trasporta da trent\'anni storie che nessuno gli racconta. Oblitero il biglietto. Roma-Milano. Solo andata. I biglietti di sola andata sono sempre più pesanti.',
    },
    {
      id: 'c2-formal-1', category: 'formal', title: 'Discorso inaugurale',
      type: 'speech',
      instructions: 'Redigi un discorso inaugurale per un congresso internazionale sulla diversità linguistica. Tono solenne ma accessibile, con citazioni o allusioni culturali. (200-260 parole)',
      targetStructures: ['rhetorical parallelism', 'congiuntivo in exhortations', 'elevated register with accessibility'],
      rubric: {
        content: 'Appropriate gravitas; cultural references; call to action',
        grammar: 'Impeccable formal register; rhetorical structures; congiuntivo exhortations',
        vocabulary: 'Ceremonial language; precise and evocative; culturally resonant',
        organization: 'Salutation, framing, thematic development, peroration',
      },
      modelResponse: 'Illustrissime autorità, stimati colleghi, cari amici della parola: racconta Calvino che la leggerezza non è superficialità, ma planare sulle cose dall\'alto. Permettetemi di suggerire che lo stesso valga per le lingue: ciascuna plana sulla realtà con un\'angolazione irripetibile. Ci riuniamo oggi per celebrare non l\'uniformità, bensì la differenza. Ciascuna delle seimila lingue che ancora respirano su questo pianeta è un archivio insostituibile di sapere, una cartografia unica del possibile. Quando muore una lingua — e ne muore una ogni due settimane — non scompare soltanto un codice: si estingue un modo di nominare la pioggia, di contare il tempo, di immaginare il sacro. Che questo congresso sia, dunque, un atto di resistenza. Che ogni relazione ci ricordi che la diversità linguistica non è un problema da risolvere, ma un patrimonio da custodire. Che non ci accontentiamo di documentare ciò che si perde, ma che lavoriamo affinché le lingue vivano dove devono vivere: sulle labbra di chi le ha ereditate. Ci auguriamo che, al termine di queste giornate, usciamo di qui con la convinzione che difendere una lingua significa difendere il diritto di una comunità a sognare nei propri termini. Grazie.',
    },
    {
      id: 'c2-personal-1', category: 'personal', title: 'Saggio letterario: il silenzio',
      type: 'essay',
      instructions: 'Scrivi un saggio letterario (stile libero, personale, curato) sul silenzio: cosa significa, quando lo cerchiamo, quando ci spaventa. Cerca un equilibrio tra riflessione e poesia. (200-260 parole)',
      targetStructures: ['all tenses and moods at will', 'figurative language', 'sentence rhythm as meaning'],
      rubric: {
        content: 'Philosophical depth with personal resonance; original perspective',
        grammar: 'Complete mastery; deliberate stylistic choices indistinguishable from native',
        vocabulary: 'Rich, precise, literary; sensory and abstract in balance',
        organization: 'Essayistic freedom with internal coherence; resonant ending',
      },
      modelResponse: 'Ci sono silenzi che pesano e silenzi che galleggiano. Quello di una biblioteca è di velluto; quello di un ospedale, di vetro. Il silenzio dopo una discussione ha lame, e quello che segue un bacio sa di pane appena sfornato. Impariamo a parlare, ma nessuno ci insegna a tacere. Eppure, quasi tutto ciò che conta accade ai margini della parola: nella pausa prima di dire "ti amo", nello spazio tra la domanda e la risposta, in quell\'istante in cui una platea trattiene il fiato prima di applaudire. Cerchiamo il silenzio quando la vita fa troppo rumore. Saliamo montagne, ci chiudiamo in stanze, meditiamo con app che, paradossalmente, non smettono di parlarci. Ma il silenzio vero non è fuori: è in quella zona del pensiero dove le parole non si sono ancora coagulate, dove l\'idea è ancora sensazione. Ciò che ci spaventa non è l\'assenza di suono, ma ciò che quell\'assenza rivela. Nel silenzio ci troviamo faccia a faccia con noi stessi senza l\'armatura del discorso, senza la possibilità di travestirci da ciò che diciamo. Forse per questo i mistici — Francesco d\'Assisi, Chiara — cercavano il silenzio come chi cerca la verità: sapevano che Dio, se esiste, parla sottovoce. O non parla. E in quel non-parlare, dice tutto.',
    },
  ],
};

// ── WritingTutor class ─────────────────────────────────────────────────────

class WritingTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  // Profile management

  getProfile(studentId, level) {
    const p = core.loadProfile(this.dir, studentId);
    if (level && core.CEFR.includes(level)) {
      p.level = level;
      if (!p.corrections) p.corrections = {};
      for (const cat of CORRECTION_CATEGORIES) {
        if (!p.corrections[cat]) p.corrections[cat] = { attempts: [], stability: 2, difficulty: 5 };
      }
      core.saveProfile(this.dir, p);
    } else if (!p.level) {
      p.level = 'A1';
      if (!p.corrections) p.corrections = {};
      for (const cat of CORRECTION_CATEGORIES) {
        if (!p.corrections[cat]) p.corrections[cat] = { attempts: [], stability: 2, difficulty: 5 };
      }
      core.saveProfile(this.dir, p);
    }
    return p;
  }

  setLevel(studentId, level) {
    level = level.toUpperCase();
    if (!core.CEFR.includes(level)) throw new Error(`Invalid level: ${level}. Must be one of ${core.CEFR.join(', ')}`);
    const p = this.getProfile(studentId);
    p.level = level;
    core.saveProfile(this.dir, p);
    return p;
  }

  // Prompt generation

  generatePrompt(studentId, category) {
    const p = this.getProfile(studentId);
    const levelPrompts = PROMPTS[p.level] || PROMPTS.A1;
    let pool = levelPrompts;
    if (category) {
      pool = levelPrompts.filter(pr => pr.category === category);
      if (!pool.length) pool = levelPrompts;
    }

    // Prefer prompts not yet attempted
    const attempted = new Set((p.assessments || []).map(a => a.promptId));
    const fresh = pool.filter(pr => !attempted.has(pr.id));
    const chosen = fresh.length ? core.pick(fresh, 1)[0] : core.pick(pool, 1)[0];

    return {
      studentId,
      level: p.level,
      prompt: chosen,
    };
  }

  getRubric(promptId) {
    for (const level of core.CEFR) {
      const found = (PROMPTS[level] || []).find(pr => pr.id === promptId);
      if (found) return { promptId, level, title: found.title, rubric: found.rubric, targetStructures: found.targetStructures, modelResponse: found.modelResponse };
    }
    throw new Error(`Prompt not found: ${promptId}`);
  }

  // Assessment recording

  recordAssessment(studentId, promptId, scores, corrections) {
    const p = this.getProfile(studentId);
    if (!p.assessments) p.assessments = [];
    if (!p.corrections) p.corrections = {};
    for (const cat of CORRECTION_CATEGORIES) {
      if (!p.corrections[cat]) p.corrections[cat] = { attempts: [], stability: 2, difficulty: 5 };
    }

    // Validate scores
    for (const dim of ['content', 'grammar', 'vocabulary', 'organization']) {
      const v = Number(scores[dim]);
      if (isNaN(v) || v < 1 || v > 5) throw new Error(`Score ${dim} must be 1-5, got: ${scores[dim]}`);
    }

    const assessment = {
      promptId,
      date: core.today(),
      scores: {
        content: Number(scores.content),
        grammar: Number(scores.grammar),
        vocabulary: Number(scores.vocabulary),
        organization: Number(scores.organization),
      },
      total: Number(scores.content) + Number(scores.grammar) + Number(scores.vocabulary) + Number(scores.organization),
      maxTotal: 20,
    };

    // Process corrections (e.g., { "gender": 2, "tense": 1 } = error counts)
    if (corrections && typeof corrections === 'object') {
      assessment.corrections = corrections;
      for (const [cat, count] of Object.entries(corrections)) {
        if (!CORRECTION_CATEGORIES.includes(cat)) continue;
        const rec = p.corrections[cat];
        // Each error adds a failing attempt, no errors = passing
        const errorCount = Number(count) || 0;
        if (errorCount > 0) {
          rec.attempts.push({ score: 0, total: 1, date: core.today() });
          const grade = 1; // fail
          rec.stability = core.fsrsUpdateStability(rec.stability, rec.difficulty, grade);
          rec.difficulty = core.fsrsUpdateDifficulty(rec.difficulty, grade);
        } else {
          rec.attempts.push({ score: 1, total: 1, date: core.today() });
          const grade = 4; // easy
          rec.stability = core.fsrsUpdateStability(rec.stability, rec.difficulty, grade);
          rec.difficulty = core.fsrsUpdateDifficulty(rec.difficulty, grade);
        }
      }
      // Categories not mentioned in corrections = clean (no errors)
      for (const cat of CORRECTION_CATEGORIES) {
        if (!(cat in corrections)) {
          const rec = p.corrections[cat];
          rec.attempts.push({ score: 1, total: 1, date: core.today() });
          const grade = 3; // good
          rec.stability = core.fsrsUpdateStability(rec.stability, rec.difficulty, grade);
          rec.difficulty = core.fsrsUpdateDifficulty(rec.difficulty, grade);
        }
      }
    }

    p.assessments.push(assessment);
    core.saveProfile(this.dir, p);

    return {
      studentId,
      assessment,
      overallScore: `${assessment.total}/${assessment.maxTotal}`,
    };
  }

  // Progress and reporting

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const categories = {};
    for (const cat of CORRECTION_CATEGORIES) {
      const rec = p.corrections[cat] || { attempts: [] };
      const mastery = core.calcMastery(rec.attempts);
      categories[cat] = {
        mastery,
        label: core.masteryLabel(mastery),
        attempts: rec.attempts.length,
        nextReview: rec.stability ? core.fsrsNextReview(rec.stability, core.DEFAULT_RETENTION) : null,
      };
    }

    // Overall writing scores over time
    const recent = (p.assessments || []).slice(-10);
    const avgScores = { content: 0, grammar: 0, vocabulary: 0, organization: 0 };
    if (recent.length) {
      for (const a of recent) {
        for (const dim of Object.keys(avgScores)) avgScores[dim] += a.scores[dim];
      }
      for (const dim of Object.keys(avgScores)) avgScores[dim] = Math.round(avgScores[dim] / recent.length * 10) / 10;
    }

    return {
      studentId,
      level: p.level,
      totalAssessments: (p.assessments || []).length,
      correctionCategories: categories,
      averageScores: recent.length ? avgScores : null,
    };
  }

  getNextTopics(studentId) {
    const progress = this.getProgress(studentId);
    const cats = progress.correctionCategories;
    // Sort by mastery ascending, then by next review soonest
    const sorted = CORRECTION_CATEGORIES
      .map(cat => ({ category: cat, ...cats[cat] }))
      .sort((a, b) => a.mastery - b.mastery || (a.nextReview || 999) - (b.nextReview || 999));

    return {
      studentId,
      level: progress.level,
      focusAreas: sorted.slice(0, 3).map(s => ({
        category: s.category,
        mastery: s.mastery,
        label: s.label,
        recommendation: this._recommendation(s.category, s.label),
      })),
    };
  }

  _recommendation(category, label) {
    const recs = {
      gender: 'Practice noun-adjective gender agreement. Focus on -o/-a/-e endings and irregular nouns (il problema, la mano).',
      agreement: 'Focus on subject-verb and noun-adjective number agreement. Watch -co/-go plurals (amico/amici, lago/laghi).',
      'essere-auxiliary': 'Practice passato prossimo auxiliary selection. Review motion/state verbs (sono andato) vs action verbs (ho mangiato). Check participle agreement with essere.',
      tense: 'Narrate past events mixing passato prossimo and imperfetto. Practice passato remoto for written narratives.',
      congiuntivo: 'Practice expressing wishes, doubts, and opinions using congiuntivo triggers (credo che, penso che, è necessario che).',
      prepositions: 'Review preposizioni articolate (al, del, nel, sul). Practice di/da/a/in/con usage patterns.',
      spelling: 'Review le doppie (cappello, soprattutto, appartamento). Practice accent rules (è/é, perché, città). Check H-word homophones (ho/o, hai/ai, ha/a, hanno/anno).',
      punctuation: 'Review comma usage with subordinate clauses. Practice punctuation with direct speech and formal letter conventions.',
    };
    if (label === 'mastered' || label === 'proficient') return `${category}: strong. Maintain through varied writing.`;
    return recs[category] || `Focus on ${category} in your next writing exercises.`;
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const topics = this.getNextTopics(studentId);

    return {
      studentId,
      level: p.level,
      createdAt: p.createdAt,
      totalAssessments: progress.totalAssessments,
      averageScores: progress.averageScores,
      correctionCategories: progress.correctionCategories,
      focusAreas: topics.focusAreas,
      recentAssessments: (p.assessments || []).slice(-5).map(a => ({
        promptId: a.promptId,
        date: a.date,
        score: `${a.total}/${a.maxTotal}`,
      })),
    };
  }

  listStudents() {
    return core.listProfiles(this.dir);
  }

  getPromptCatalog(level) {
    if (level) {
      if (!core.CEFR.includes(level)) throw new Error(`Invalid level: ${level}`);
      return (PROMPTS[level] || []).map(p => ({ id: p.id, category: p.category, title: p.title, type: p.type, level }));
    }
    const catalog = [];
    for (const lvl of core.CEFR) {
      for (const p of (PROMPTS[lvl] || [])) {
        catalog.push({ id: p.id, category: p.category, title: p.title, type: p.type, level: lvl });
      }
    }
    return catalog;
  }
}

// ── CLI ────────────────────────────────────────────────────────────────────

const tutor = new WritingTutor();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const [, studentId, level] = args;
      if (!studentId) throw new Error('Usage: start <studentId> [level]');
      out(tutor.getProfile(studentId, level));
      break;
    }
    case 'set-level': {
      const [, studentId, level] = args;
      if (!studentId || !level) throw new Error('Usage: set-level <studentId> <level>');
      out(tutor.setLevel(studentId, level));
      break;
    }
    case 'prompt': {
      const [, studentId, category] = args;
      if (!studentId) throw new Error('Usage: prompt <studentId> [category]');
      out(tutor.generatePrompt(studentId, category));
      break;
    }
    case 'rubric': {
      const [, promptId] = args;
      if (!promptId) throw new Error('Usage: rubric <promptId>');
      out(tutor.getRubric(promptId));
      break;
    }
    case 'record': {
      const [, studentId, promptId, content, grammar, vocabulary, organization, correctionsJson] = args;
      if (!studentId || !promptId || !content) throw new Error('Usage: record <studentId> <promptId> <content> <grammar> <vocab> <org> [correctionsJson]');
      const scores = { content, grammar, vocabulary, organization };
      let corrections = null;
      if (correctionsJson) {
        try { corrections = JSON.parse(correctionsJson); }
        catch { throw new Error('corrections must be valid JSON, e.g. \'{"gender":2,"tense":1}\''); }
      }
      out(tutor.recordAssessment(studentId, promptId, scores, corrections));
      break;
    }
    case 'progress': {
      const [, studentId] = args;
      if (!studentId) throw new Error('Usage: progress <studentId>');
      out(tutor.getProgress(studentId));
      break;
    }
    case 'report': {
      const [, studentId] = args;
      if (!studentId) throw new Error('Usage: report <studentId>');
      out(tutor.getReport(studentId));
      break;
    }
    case 'prompts': {
      const [, level] = args;
      out(tutor.getPromptCatalog(level));
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
        commands: ['start', 'set-level', 'prompt', 'rubric', 'record', 'progress', 'report', 'prompts', 'students'],
      });
  }
});

module.exports = { WritingTutor, PROMPTS, CORRECTION_CATEGORIES };
