#!/usr/bin/env node
'use strict';

const SKILL_NAME = 'italian-listening';

const core = require('../_lib/core');

// ---------------------------------------------------------------------------
// Embedded exercise data by CEFR level
// ---------------------------------------------------------------------------

const EXERCISES = {
  A1: [
    {
      id: 'a1-dict-farmacia',
      title: 'In farmacia',
      type: 'dictation',
      transcript: 'Buongiorno. Ho bisogno di qualcosa per il mal di testa, per favore.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Buongiorno. Ho bisogno di qualcosa per il mal di testa, per favore.',
          explanation: 'Note the H in "ho" (I have, not "o" = or). "Mal di testa" is the fixed phrase for headache.'
        }
      ],
      vocabulary: ['mal di testa', 'avere bisogno di', 'per favore'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-dict-presentazione',
      title: 'Presentazione personale',
      type: 'dictation',
      transcript: 'Mi chiamo Maria e ho venticinque anni. Sono di Firenze.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Mi chiamo Maria e ho venticinque anni. Sono di Firenze.',
          explanation: '"Ho" with H (verb avere). "Venticinque" is one word. Accent on "è" (is) vs "e" (and).'
        }
      ],
      vocabulary: ['chiamarsi', 'avere anni', 'essere di'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-mp-pala-palla',
      title: 'Pala vs palla',
      type: 'minimal-pairs',
      transcript: 'Il bambino gioca con la ___.',
      questions: [
        {
          question: 'Which word fits: "pala" (shovel) or "palla" (ball)?',
          answer: 'palla',
          explanation: 'Children play with balls (palla), not shovels (pala). Single vs double /l/ changes meaning — this is a geminate contrast.'
        }
      ],
      vocabulary: ['pala', 'palla', 'giocare', 'bambino'],
      connectedSpeechFeatures: ['geminate consonant /l/ vs /ll/']
    },
    {
      id: 'a1-mp-capello-cappello',
      title: 'Capello vs cappello',
      type: 'minimal-pairs',
      transcript: 'Ha un bel ___ sulla testa.',
      questions: [
        {
          question: 'Which word fits: "capello" (hair) or "cappello" (hat)?',
          answer: 'cappello',
          explanation: 'You wear a hat (cappello) on your head, not a single hair (capello). Double /pp/ changes the meaning.'
        }
      ],
      vocabulary: ['capello', 'cappello', 'testa'],
      connectedSpeechFeatures: ['geminate consonant /p/ vs /pp/']
    },
    {
      id: 'a1-comp-bar',
      title: 'Al bar',
      type: 'comprehension',
      transcript: 'BARISTA: Buongiorno! Desidera?\nCLIENTE: Un caffè macchiato, per favore. E un cornetto alla crema.\nBARISTA: Certo. Al banco o al tavolo?\nCLIENTE: Al banco, grazie.\nBARISTA: Sono due euro e cinquanta.',
      questions: [
        {
          question: 'Che cosa ordina il cliente da bere?',
          answer: 'un caffè macchiato',
          explanation: 'Il cliente dice "Un caffè macchiato, per favore."'
        },
        {
          question: 'Dove consuma, al banco o al tavolo?',
          answer: 'al banco',
          explanation: 'Il cliente risponde "Al banco, grazie." (In Italy, consuming at the counter is cheaper.)'
        },
        {
          question: 'Quanto costa in tutto?',
          answer: 'due euro e cinquanta',
          explanation: 'Il barista dice "Sono due euro e cinquanta" (€2.50).'
        }
      ],
      vocabulary: ['barista', 'desidera', 'al banco', 'al tavolo', 'cornetto'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-comp-hotel',
      title: 'In albergo',
      type: 'comprehension',
      transcript: "RECEPTIONIST: Buonasera. Ha una prenotazione?\nCLIENTE: Sì, a nome Rossi. Una camera doppia per tre notti.\nRECEPTIONIST: Perfetto. Camera duecentoquindici, secondo piano. La colazione è dalle sette alle dieci nella sala ristorante.\nCLIENTE: Grazie mille.",
      questions: [
        {
          question: 'Che tipo di camera ha prenotato?',
          answer: 'una camera doppia',
          explanation: 'Il cliente dice "una camera doppia" — a double room.'
        },
        {
          question: 'Per quante notti?',
          answer: 'tre notti',
          explanation: '"Per tre notti" — three nights.'
        },
        {
          question: 'A che ora è la colazione?',
          answer: 'dalle sette alle dieci',
          explanation: 'Il receptionist dice: "dalle sette alle dieci nella sala ristorante."'
        }
      ],
      vocabulary: ['prenotazione', 'camera doppia', 'piano', 'colazione', 'sala ristorante'],
      connectedSpeechFeatures: []
    }
  ],

  A2: [
    {
      id: 'a2-dict-indicazioni',
      title: 'Chiedere indicazioni',
      type: 'dictation',
      transcript: 'Scusi, sa dov\'è la stazione dei treni? Vada dritto e giri a sinistra.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Scusi, sa dov\'è la stazione dei treni? Vada dritto e giri a sinistra.',
          explanation: '"Dov\'è" = dove + è (elision). "Stazione" with single z. "Vada" and "giri" are formal imperatives (Lei form).'
        }
      ],
      vocabulary: ['scusi', 'stazione', 'dritto', 'girare', 'sinistra'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a2-dict-meteo',
      title: 'Le previsioni del tempo',
      type: 'dictation',
      transcript: 'Domani pioverà nel pomeriggio, quindi porta l\'ombrello. Le temperature saranno tra quindici e venti gradi.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Domani pioverà nel pomeriggio, quindi porta l\'ombrello. Le temperature saranno tra quindici e venti gradi.',
          explanation: '"Pioverà" — future tense with accent. "L\'ombrello" — masculine with elision. "Saranno" — essere future.'
        }
      ],
      vocabulary: ['piovere', 'ombrello', 'temperatura', 'gradi'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a2-gap-homophones',
      title: 'H-word homophones',
      type: 'gap-fill',
      transcript: 'Non ___ capito niente.',
      questions: [
        {
          question: 'Fill the blank: "Non ___ capito niente." (ho or o?)',
          answer: 'ho',
          explanation: '"Ho" (I have) with H, not "o" (or). Test: can you replace with "avevo"? "Non avevo capito" works → ho with H.'
        }
      ],
      vocabulary: ['avere', 'capire'],
      connectedSpeechFeatures: ['H-word homophone: ho/o']
    },
    {
      id: 'a2-mp-note-notte',
      title: 'Note vs notte',
      type: 'minimal-pairs',
      transcript: 'Leggo le ___ sul quaderno.',
      questions: [
        {
          question: 'Which word fits: "note" (notes) or "notte" (night)?',
          answer: 'note',
          explanation: 'You read notes (note) in a notebook, not night (notte). Single /t/ vs double /tt/ changes meaning.'
        }
      ],
      vocabulary: ['note', 'notte', 'quaderno', 'leggere'],
      connectedSpeechFeatures: ['geminate consonant /t/ vs /tt/']
    },
    {
      id: 'a2-comp-medico',
      title: 'Dal medico',
      type: 'comprehension',
      transcript: "MEDICO: Che cosa c'è che non va?\nPAZIENTE: Mi fa male la gola e ho la febbre da ieri.\nMEDICO: Vediamo. Apra la bocca, per favore. Sì, la gola è molto rossa. Le prescrivo un antibiotico. Prenda una compressa ogni otto ore per sette giorni. E riposi molto.\nPAZIENTE: Posso andare a lavorare?\nMEDICO: Meglio stia a casa due o tre giorni.",
      questions: [
        {
          question: 'Quali sono i sintomi del paziente?',
          answer: 'mal di gola e febbre',
          explanation: '"Mi fa male la gola e ho la febbre da ieri."'
        },
        {
          question: 'Ogni quante ore deve prendere la compressa?',
          answer: 'ogni otto ore',
          explanation: 'Il medico prescrive: "Prenda una compressa ogni otto ore."'
        },
        {
          question: 'Quanti giorni deve restare a casa?',
          answer: 'due o tre giorni',
          explanation: 'Il medico consiglia: "Meglio stia a casa due o tre giorni."'
        }
      ],
      vocabulary: ['gola', 'febbre', 'antibiotico', 'compressa', 'riposare'],
      connectedSpeechFeatures: ['formal imperative: apra, prenda, stia']
    },
    {
      id: 'a2-comp-mercato',
      title: 'Al mercato',
      type: 'comprehension',
      transcript: "— Buongiorno. Ha dei pomodori freschi?\n— Sì, certo. Questi sono dell'orto di oggi. Quanti ne vuole?\n— Me ne metta un chilo, per favore. E le fragole? Sono buone?\n— Buonissime. Dolcissime questa settimana.\n— Va bene, mezzo chilo di fragole. Quant'è?\n— Il chilo di pomodori, due euro. Le fragole, tre euro. Cinque euro in tutto.\n— Ecco a lei. Ha un sacchetto?\n— Sì, prego. Buona giornata!",
      questions: [
        {
          question: 'Da dove vengono i pomodori?',
          answer: "dall'orto di oggi",
          explanation: 'Il venditore dice "Questi sono dell\'orto di oggi."'
        },
        {
          question: 'Quanto costano le fragole?',
          answer: 'tre euro',
          explanation: 'Il venditore dice "Le fragole, tre euro."'
        },
        {
          question: "Com'è la frutta questa settimana?",
          answer: 'dolcissima',
          explanation: 'Il venditore dice "Dolcissime questa settimana."'
        }
      ],
      vocabulary: ['pomodori', 'orto', 'fragole', 'sacchetto', 'dolcissimo'],
      connectedSpeechFeatures: ['partitive ne: "quanti ne vuole", "me ne metta"']
    }
  ],

  B1: [
    {
      id: 'b1-dict-informale',
      title: 'Racconto informale',
      type: 'dictation',
      transcript: "Allora, sai cosa mi ha detto? Che non viene più alla festa perché ha litigato con Marco.",
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: "Allora, sai cosa mi ha detto? Che non viene più alla festa perché ha litigato con Marco.",
          explanation: '"Più" always with accent. "Perché" with acute accent (é). "Ha litigato" — avere + past participle.'
        }
      ],
      vocabulary: ['allora', 'litigare', 'non...più'],
      connectedSpeechFeatures: ['discourse marker: allora']
    },
    {
      id: 'b1-gap-informale',
      title: 'Contrazioni informali',
      type: 'gap-fill',
      transcript: "'___ film è bellissimo, devi vederlo!",
      questions: [
        {
          question: "Fill the blank: \"'___ film è bellissimo\" — what informal form replaces a standard word?",
          answer: 'sto',
          explanation: "'Sto = questo (this). Common informal contraction in spoken Italian: 'sto, 'sta = questo, questa."
        }
      ],
      vocabulary: ['questo', "'sto"],
      connectedSpeechFeatures: ['informal contraction: \'sto = questo']
    },
    {
      id: 'b1-mp-caro-carro',
      title: 'Caro vs carro',
      type: 'minimal-pairs',
      transcript: 'Il ristorante è molto ___.',
      questions: [
        {
          question: 'Which word fits: "caro" (expensive/dear) or "carro" (cart)?',
          answer: 'caro',
          explanation: 'A restaurant is expensive (caro), not a cart (carro). Single /r/ vs double /rr/.'
        }
      ],
      vocabulary: ['caro', 'carro', 'ristorante'],
      connectedSpeechFeatures: ['geminate consonant /r/ vs /rr/']
    },
    {
      id: 'b1-comp-telefonata',
      title: 'Telefonata al ristorante',
      type: 'comprehension',
      transcript: "RISTORANTE: Trattoria Da Luigi, buonasera.\nCLIENTE: Buonasera, vorrei prenotare un tavolo per stasera.\nRISTORANTE: Per quante persone?\nCLIENTE: Siamo in quattro. Verso le otto e mezza.\nRISTORANTE: Mi dispiace, alle otto e mezza è tutto pieno. Abbiamo un tavolo alle nove e un quarto.\nCLIENTE: Va bene, alle nove e un quarto. A nome Bianchi.\nRISTORANTE: Perfetto, signor Bianchi. A stasera!",
      questions: [
        {
          question: 'Per quante persone è la prenotazione?',
          answer: 'quattro',
          explanation: 'Il cliente dice "Siamo in quattro."'
        },
        {
          question: "A che ora voleva il tavolo originariamente?",
          answer: 'alle otto e mezza',
          explanation: 'Il cliente chiede "Verso le otto e mezza."'
        },
        {
          question: 'A che ora è il tavolo disponibile?',
          answer: 'alle nove e un quarto',
          explanation: 'Il ristorante propone "alle nove e un quarto."'
        }
      ],
      vocabulary: ['prenotare', 'tavolo', 'tutto pieno', 'a nome'],
      connectedSpeechFeatures: ['conditional: vorrei']
    },
    {
      id: 'b1-note-citta',
      title: 'La mia città',
      type: 'note-taking',
      transcript: "Mi chiamo Giulia e vivo a Bologna, una città nel nord Italia famosa per l'università, che è la più antica d'Europa, fondata nel 1088. Bologna è anche conosciuta come la città dei portici — ci sono circa 40 chilometri di portici nel centro storico. Ma Bologna è soprattutto famosa per la cucina: le tagliatelle al ragù, i tortellini e la mortadella sono piatti tipici. Il centro è piccolo e si gira facilmente a piedi o in bicicletta. D'inverno fa freddo, ma l'atmosfera è calda e accogliente.",
      questions: [
        {
          question: 'List the 3 key points about Bologna mentioned.',
          answer: "1. Oldest university in Europe (1088). 2. City of porticos (~40km). 3. Famous cuisine (tagliatelle, tortellini, mortadella).",
          explanation: 'The three main themes are: university, porticos, and food — the classic trio that defines Bologna.'
        }
      ],
      vocabulary: ['portici', 'centro storico', 'tagliatelle al ragù', 'accogliente'],
      connectedSpeechFeatures: []
    }
  ],

  B2: [
    {
      id: 'b2-dict-veloce',
      title: 'Parlato veloce e naturale',
      type: 'dictation',
      transcript: "Cioè, praticamente gli ho detto che non ero d'accordo e lui si è arrabbiato tantissimo.",
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: "Cioè, praticamente gli ho detto che non ero d'accordo e lui si è arrabbiato tantissimo.",
          explanation: '"Cioè" — accented final vowel. "D\'accordo" with apostrophe. "Si è arrabbiato" — reflexive with essere. Double b in "arrabbiato".'
        }
      ],
      vocabulary: ['cioè', 'praticamente', "d'accordo", 'arrabbiarsi'],
      connectedSpeechFeatures: ['discourse markers: cioè, praticamente']
    },
    {
      id: 'b2-gap-raddoppiamento',
      title: 'Raddoppiamento sintattico',
      type: 'gap-fill',
      transcript: 'In Central Italian speech, how would "a casa" be pronounced?',
      questions: [
        {
          question: 'The preposition "a" triggers raddoppiamento sintattico on the next consonant. How is "a casa" pronounced?',
          answer: '/ak.ˈka.za/',
          explanation: 'In Central/Southern Italian, "a" triggers doubling of the following consonant: a casa → /ak.ˈka.za/. Northern speakers do NOT use raddoppiamento sintattico.'
        }
      ],
      vocabulary: ['raddoppiamento sintattico'],
      connectedSpeechFeatures: ['raddoppiamento sintattico: a → doubled consonant']
    },
    {
      id: 'b2-mp-pena-penna',
      title: 'Pena vs penna',
      type: 'minimal-pairs',
      transcript: 'Mi serve una ___ per scrivere.',
      questions: [
        {
          question: 'Which word fits: "pena" (penalty/pity) or "penna" (pen)?',
          answer: 'penna',
          explanation: 'You need a pen (penna) to write, not a penalty (pena). Double /nn/ changes meaning.'
        }
      ],
      vocabulary: ['pena', 'penna', 'scrivere'],
      connectedSpeechFeatures: ['geminate consonant /n/ vs /nn/']
    },
    {
      id: 'b2-comp-colloquio',
      title: 'Un colloquio di lavoro',
      type: 'comprehension',
      transcript: "INTERVISTATORE: Bene, mi parli della sua esperienza professionale.\nCANDIDATO: Dopo la laurea in economia ho lavorato per tre anni in una società di consulenza a Milano. Mi occupavo di analisi di mercato e gestione dei clienti. Poi ho deciso di cambiare perché cercavo un ruolo con più responsabilità.\nINTERVISTATORE: E perché ha scelto la nostra azienda?\nCANDIDATO: Perché il vostro approccio all'innovazione mi ha sempre colpito. Inoltre, credo che le mie competenze nell'analisi dei dati possano essere utili per il vostro team.\nINTERVISTATORE: Qual è il suo punto debole, secondo Lei?\nCANDIDATO: Direi che a volte sono troppo perfezionista, ma sto imparando a delegare di più.",
      questions: [
        {
          question: 'Dove ha lavorato prima il candidato?',
          answer: 'in una società di consulenza a Milano',
          explanation: 'Il candidato dice "ho lavorato per tre anni in una società di consulenza a Milano."'
        },
        {
          question: 'Perché ha cambiato lavoro?',
          answer: 'cercava un ruolo con più responsabilità',
          explanation: '"Ho deciso di cambiare perché cercavo un ruolo con più responsabilità."'
        },
        {
          question: 'Quale punto debole menziona?',
          answer: 'essere troppo perfezionista',
          explanation: '"Direi che a volte sono troppo perfezionista."'
        }
      ],
      vocabulary: ['colloquio', 'società di consulenza', 'competenze', 'delegare', 'punto debole'],
      connectedSpeechFeatures: ['formal register: Lei, mi parli, secondo Lei']
    },
    {
      id: 'b2-note-economia',
      title: 'L\'economia italiana',
      type: 'note-taking',
      transcript: "L'economia italiana è la terza più grande dell'Eurozona e l'ottava a livello mondiale. Il paese è noto per il suo settore manifatturiero, in particolare nel Nord, dove si concentrano le industrie della moda, dell'automobile e della meccanica di precisione. Tuttavia, l'Italia affronta sfide significative: un debito pubblico elevato, che supera il 140% del PIL, una crescita economica lenta rispetto alla media europea, e un divario persistente tra Nord e Sud. D'altra parte, il settore del turismo resta un pilastro fondamentale, con oltre 60 milioni di visitatori all'anno, e il Made in Italy continua a essere un marchio di eccellenza riconosciuto a livello globale.",
      questions: [
        {
          question: 'Identify 4 key points from this passage.',
          answer: '1. 3rd largest economy in Eurozone, 8th worldwide. 2. Strong manufacturing (fashion, auto, precision mechanics) in North. 3. Challenges: high debt (>140% GDP), slow growth, North-South divide. 4. Tourism (60M visitors/year) and Made in Italy brand as strengths.',
          explanation: 'The passage balances strengths and challenges of the Italian economy.'
        }
      ],
      vocabulary: ['Eurozona', 'manifatturiero', 'debito pubblico', 'PIL', 'Made in Italy'],
      connectedSpeechFeatures: ['formal connectors: tuttavia, d\'altra parte']
    }
  ],

  C1: [
    {
      id: 'c1-dict-molto-veloce',
      title: 'Parlato molto veloce',
      type: 'dictation',
      transcript: "Boh, non lo so — cioè, tipo, lui voleva fare 'sta cosa e io gli ho detto 'ma figurati' e niente, si è offeso.",
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: "Boh, non lo so — cioè, tipo, lui voleva fare 'sta cosa e io gli ho detto 'ma figurati' e niente, si è offeso.",
          explanation: "Heavy informal features: boh (dunno), cioè (I mean), tipo (like), 'sta = questa, figurati (don't worry/no way), niente (as filler). Si è offeso — reflexive with essere."
        }
      ],
      vocabulary: ['boh', 'tipo', 'figurati', 'offendersi'],
      connectedSpeechFeatures: ["informal markers: boh, cioè, tipo, 'sta, niente as filler"]
    },
    {
      id: 'c1-comp-dibattito',
      title: 'Dibattito radiofonico',
      type: 'comprehension',
      transcript: "CONDUTTORE: Passiamo al tema del giorno: la fuga dei cervelli. Professoressa Marini, i dati sono allarmanti.\nMARINI: Esattamente. Negli ultimi dieci anni, oltre 250.000 laureati italiani hanno lasciato il paese. Non si tratta solo di medici e ingegneri — anche ricercatori, artisti e imprenditori. Il problema non è tanto che partano, quanto che non tornino.\nCONDUTTORE: Dottor Ferretti, è d'accordo?\nFERRETTI: In parte. Bisogna però distinguere tra mobilità, che è positiva, e fuga, che indica un problema strutturale. Il nodo è che l'Italia investe poco in ricerca — l'1,4% del PIL contro il 3% della Germania. Finché non cambierà questa realtà, i giovani talenti andranno dove ci sono opportunità.",
      questions: [
        {
          question: 'Quanti laureati hanno lasciato l\'Italia in dieci anni?',
          answer: 'oltre 250.000',
          explanation: 'La professoressa Marini cita "oltre 250.000 laureati."'
        },
        {
          question: 'Qual è la distinzione che fa il dottor Ferretti?',
          answer: 'tra mobilità (positiva) e fuga (problema strutturale)',
          explanation: 'Ferretti distingue "tra mobilità, che è positiva, e fuga, che indica un problema strutturale."'
        },
        {
          question: 'Quanto investe l\'Italia in ricerca rispetto alla Germania?',
          answer: '1,4% del PIL contro il 3%',
          explanation: '"L\'Italia investe... l\'1,4% del PIL contro il 3% della Germania."'
        }
      ],
      vocabulary: ['fuga dei cervelli', 'laureati', 'ricerca', 'PIL', 'nodo'],
      connectedSpeechFeatures: ['formal speech: si tratta di, finché, quanto che']
    },
    {
      id: 'c1-gap-regionale',
      title: 'Espressioni regionali',
      type: 'gap-fill',
      transcript: "Rewrite in standard Italian: \"Ao', ma che stai a di'?\"",
      questions: [
        {
          question: 'Restate this Romanesco expression in standard Italian: "Ao\', ma che stai a di\'?"',
          answer: 'Ma che cosa stai dicendo?',
          explanation: "Romanesco: Ao' = attention-getter (no standard equivalent). 'Che stai a di'' = 'Che cosa stai dicendo?' Roman uses 'stare a + infinitive' instead of 'stare + gerundio'."
        }
      ],
      vocabulary: ["ao'", "stare a + inf (Roman)", "di' = dire"],
      connectedSpeechFeatures: ['regional: Roman stare a + infinitive']
    },
    {
      id: 'c1-note-conferenza',
      title: 'Conferenza accademica',
      type: 'note-taking',
      transcript: "Oggi vorrei esaminare il fenomeno della gentrificazione nei centri storici italiani, con particolare riferimento al caso di Firenze. Negli ultimi vent'anni, il centro storico fiorentino ha subito una trasformazione radicale: il numero di residenti è calato del 65%, mentre gli affitti turistici sono aumentati del 300%. Questo processo ha conseguenze culturali profonde: le botteghe artigiane vengono sostituite da catene internazionali, e la lingua stessa del quartiere cambia, con l'inglese che diventa la lingua franca del commercio. Tuttavia, va riconosciuto che il turismo genera circa il 13% del PIL regionale. La sfida, quindi, non è eliminare il turismo ma trovare un equilibrio sostenibile tra valorizzazione culturale e vivibilità per i residenti.",
      questions: [
        {
          question: 'Identify 5 key points from this academic talk.',
          answer: '1. Topic: gentrification in Italian historic centers (focus: Florence). 2. Residents dropped 65% in 20 years. 3. Tourist rentals up 300%. 4. Cultural impact: artisan shops replaced, English as lingua franca. 5. Tourism = 13% regional GDP; challenge is sustainable balance.',
          explanation: 'The talk presents data-driven analysis of gentrification with a balanced conclusion.'
        }
      ],
      vocabulary: ['gentrificazione', 'centro storico', 'botteghe artigiane', 'affitti turistici', 'valorizzazione'],
      connectedSpeechFeatures: ['academic register: con particolare riferimento, va riconosciuto che']
    }
  ],

  C2: [
    {
      id: 'c2-dict-romanesco',
      title: 'Parlato regionale — Romanesco',
      type: 'dictation',
      transcript: "Ao', ma che stai a di'? Quello è un pezzo de pane, mica t'ha fatto niente — e tu te la prendi?",
      questions: [
        {
          question: 'Write the full sentence you heard, then rewrite in standard Italian.',
          answer: "Ao', ma che stai a di'? Quello è un pezzo de pane, mica t'ha fatto niente — e tu te la prendi? → Ma che cosa stai dicendo? Quello è una brava persona, non ti ha fatto niente — e tu ti offendi?",
          explanation: "Romanesco features: Ao' (attention-getter), stare a + inf (Roman progressive), de = di, pezzo de pane = very kind person (bread metaphor), prendersela = to take offense."
        }
      ],
      vocabulary: ["ao'", "pezzo de pane", "mica", "prendersela"],
      connectedSpeechFeatures: ['regional: full Romanesco register']
    },
    {
      id: 'c2-comp-napoletano',
      title: 'Italiano regionale — Napoletano',
      type: 'comprehension',
      transcript: "Ue', guaglio', famme 'n caffelatte e 'na sfogliatella. Quanto vene? Ma che, la farmacia sta chiusa pure oggi? Aggio aspettato mezz'ora ieri e niente, non c'era nisciuno.",
      questions: [
        {
          question: 'Rewrite this in standard Italian.',
          answer: "Ragazzo, fammi un caffelatte e una sfogliatella. Quanto viene? Ma che, la farmacia è chiusa anche oggi? Ho aspettato mezz'ora ieri e niente, non c'era nessuno.",
          explanation: "Napoletano-influenced: Ue' (attention), guaglio' (ragazzo), famme (fammi), 'n = un, 'na = una, vene = viene, pure = anche, aggio = ho, nisciuno = nessuno."
        },
        {
          question: 'From which region does this speaker likely come?',
          answer: 'Napoli / Campania (Southern Italy)',
          explanation: "Key markers: ue', guaglio', aggio, nisciuno, pure — all Neapolitan-influenced Italian."
        }
      ],
      vocabulary: ["guaglio'", "sfogliatella", "aggio", "nisciuno"],
      connectedSpeechFeatures: ['regional: Neapolitan-influenced Italian']
    },
    {
      id: 'c2-gap-sarcasmo',
      title: 'Sarcasmo e ironia',
      type: 'gap-fill',
      transcript: '"Ma certo, perché è notoriamente facile trovare lavoro in Italia con una laurea in filosofia."',
      questions: [
        {
          question: 'Is the speaker being sincere or sarcastic? Explain.',
          answer: 'Sarcastic. The speaker means the opposite — it is very difficult to find work with a philosophy degree in Italy.',
          explanation: '"Ma certo" and "notoriamente" signal irony. The speaker uses mock-certainty to express the opposite meaning. Italian sarcasm often uses exaggerated agreement ("ma certo", "sicuramente", "come no").'
        }
      ],
      vocabulary: ['notoriamente', 'ma certo (ironic)', 'come no'],
      connectedSpeechFeatures: ['irony markers: ma certo, notoriamente']
    },
    {
      id: 'c2-note-letterario',
      title: 'Analisi letteraria — Calvino',
      type: 'note-taking',
      transcript: "Nelle Lezioni americane, Calvino identifica sei qualità per la letteratura del nuovo millennio: leggerezza, rapidità, esattezza, visibilità, molteplicità e coerenza — quest'ultima rimasta incompiuta. La leggerezza non è superficialità ma capacità di planare sopra la pesantezza del mondo. Calvino contrappone la leggerezza di Cavalcanti alla gravità di Dante, suggerendo che la letteratura può alleggerire il peso dell'esistenza attraverso la precisione linguistica. La rapidità è il tempo mentale della narrazione, non la fretta: è l'economia di mezzi che produce il massimo effetto col minimo di parole. L'esattezza è il nemico della vaghezza, la ricerca della parola giusta che Flaubert chiamava le mot juste.",
      questions: [
        {
          question: 'Identify the 6 qualities Calvino proposed and summarize his concept of "leggerezza".',
          answer: '6 qualities: leggerezza, rapidità, esattezza, visibilità, molteplicità, coerenza (unfinished). Leggerezza = not superficiality but ability to soar above the heaviness of the world; contrasts Cavalcanti (light) with Dante (heavy); literature lightens existence through linguistic precision.',
          explanation: 'Calvino\'s "Six Memos for the Next Millennium" (Lezioni americane) is a foundational text in Italian literary criticism.'
        }
      ],
      vocabulary: ['leggerezza', 'molteplicità', 'le mot juste', 'alleggerire'],
      connectedSpeechFeatures: ['literary/academic register']
    }
  ]
};

// Build lookup index
const ALL_EXERCISES = {};
for (const level of Object.keys(EXERCISES)) {
  for (const ex of EXERCISES[level]) {
    ALL_EXERCISES[ex.id] = { ...ex, level };
  }
}

// ---------------------------------------------------------------------------
// ListeningTutor class
// ---------------------------------------------------------------------------

class ListeningTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    return core.loadProfile(this.dir, studentId);
  }

  _save(p) {
    core.saveProfile(this.dir, p);
  }

  setLevel(studentId, level) {
    const lev = level.toUpperCase();
    if (!core.CEFR.includes(lev)) throw new Error('Invalid level: ' + level);
    const p = this.getProfile(studentId);
    p.level = lev;
    this._save(p);
    return { studentId, level: lev };
  }

  getExerciseCatalog(level) {
    if (level) {
      const lev = level.toUpperCase();
      return (EXERCISES[lev] || []).map(e => ({
        id: e.id, title: e.title, type: e.type, level: lev,
        questionCount: e.questions.length
      }));
    }
    const catalog = {};
    for (const lev of core.CEFR) {
      if (EXERCISES[lev]) {
        catalog[lev] = EXERCISES[lev].map(e => ({
          id: e.id, title: e.title, type: e.type,
          questionCount: e.questions.length
        }));
      }
    }
    return catalog;
  }

  generateExercise(studentId, type) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    let pool = EXERCISES[level] || EXERCISES.A1;
    if (type) {
      const filtered = pool.filter(e => e.type === type);
      if (filtered.length) pool = filtered;
    }
    // Prefer unseen exercises
    const history = p.exerciseHistory || {};
    const unseen = pool.filter(e => !history[e.id]);
    const chosen = (unseen.length ? core.pick(unseen, 1) : core.pick(pool, 1))[0];
    return {
      exerciseId: chosen.id,
      type: chosen.type,
      title: chosen.title,
      level,
      transcript: chosen.transcript,
      questions: chosen.questions.map((q, i) => ({
        index: i,
        question: q.question
      })),
      vocabulary: chosen.vocabulary,
      connectedSpeechFeatures: chosen.connectedSpeechFeatures
    };
  }

  generateLesson(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const pool = EXERCISES[level] || EXERCISES.A1;

    const types = [...new Set(pool.map(e => e.type))];
    const lesson = [];
    for (const t of core.shuffle(types).slice(0, 4)) {
      const ofType = pool.filter(e => e.type === t);
      lesson.push(core.pick(ofType, 1)[0]);
    }

    return {
      studentId,
      level,
      date: core.today(),
      exercises: lesson.map(ex => ({
        exerciseId: ex.id,
        type: ex.type,
        title: ex.title,
        transcript: ex.transcript,
        questions: ex.questions.map((q, i) => ({ index: i, question: q.question })),
        vocabulary: ex.vocabulary,
        connectedSpeechFeatures: ex.connectedSpeechFeatures
      }))
    };
  }

  checkAnswer(studentId, exerciseId, answerText, questionIndex) {
    const ex = ALL_EXERCISES[exerciseId];
    if (!ex) throw new Error('Exercise not found: ' + exerciseId);

    const results = [];
    for (const q of ex.questions) {
      const normAnswer = core.norm(answerText);
      const normExpected = core.norm(q.answer);
      const exact = normAnswer === normExpected;
      const partial = !exact && normExpected.split(' ').filter(w =>
        normAnswer.split(' ').includes(w)
      ).length / normExpected.split(' ').length;

      results.push({
        question: q.question,
        expected: q.answer,
        given: answerText,
        correct: exact,
        partialScore: exact ? 1 : Math.round((partial || 0) * 100) / 100,
        explanation: q.explanation
      });
    }

    const p = this.getProfile(studentId);
    if (!p.exerciseHistory) p.exerciseHistory = {};
    p.exerciseHistory[exerciseId] = {
      lastAttempt: core.today(),
      results,
      type: ex.type,
      level: ex.level
    };
    this._save(p);

    return {
      exerciseId,
      type: ex.type,
      level: ex.level,
      results
    };
  }

  recordAssessment(studentId, exerciseId, score, total) {
    const ex = ALL_EXERCISES[exerciseId];
    if (!ex) throw new Error('Exercise not found: ' + exerciseId);

    const p = this.getProfile(studentId);
    const skillKey = `${ex.level}-${ex.type}`;

    if (!p.skills[skillKey]) {
      p.skills[skillKey] = {
        level: ex.level,
        type: ex.type,
        attempts: [],
        stability: 1,
        difficulty: 5,
        lastReview: null,
        nextReview: null
      };
    }

    const sk = p.skills[skillKey];
    sk.attempts.push({ score, total, date: core.today(), exerciseId });
    if (sk.attempts.length > 20) sk.attempts = sk.attempts.slice(-20);

    const grade = total > 0 ? Math.min(4, Math.max(1, Math.round((score / total) * 4))) : 1;
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, Math.max(1, grade));
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, Math.max(1, grade));
    sk.lastReview = core.today();
    sk.nextReview = (() => {
      const d = new Date();
      d.setDate(d.getDate() + core.fsrsNextReview(sk.stability));
      return d.toISOString().slice(0, 10);
    })();

    p.assessments.push({
      exerciseId,
      skillKey,
      score,
      total,
      date: core.today()
    });

    this._save(p);
    return {
      studentId,
      exerciseId,
      skillKey,
      score,
      total,
      mastery: core.calcMastery(sk.attempts),
      masteryLabel: core.masteryLabel(core.calcMastery(sk.attempts)),
      nextReview: sk.nextReview
    };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const progress = {};
    for (const [key, sk] of Object.entries(p.skills || {})) {
      progress[key] = {
        level: sk.level,
        type: sk.type,
        mastery: core.calcMastery(sk.attempts),
        masteryLabel: core.masteryLabel(core.calcMastery(sk.attempts)),
        attempts: (sk.attempts || []).length,
        nextReview: sk.nextReview
      };
    }
    return { studentId, level: p.level, progress };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);

    const byType = {};
    for (const [, sk] of Object.entries(p.skills || {})) {
      if (!byType[sk.type]) byType[sk.type] = { attempts: 0, totalScore: 0, totalPossible: 0 };
      for (const a of sk.attempts || []) {
        byType[sk.type].attempts++;
        byType[sk.type].totalScore += a.score;
        byType[sk.type].totalPossible += a.total;
      }
    }
    for (const t of Object.keys(byType)) {
      byType[t].accuracy = byType[t].totalPossible > 0
        ? Math.round(byType[t].totalScore / byType[t].totalPossible * 100) : 0;
    }

    const byLevel = {};
    for (const [, sk] of Object.entries(p.skills || {})) {
      if (!byLevel[sk.level]) byLevel[sk.level] = { skills: 0, mastered: 0 };
      byLevel[sk.level].skills++;
      if (core.calcMastery(sk.attempts) >= core.MASTERY_THRESHOLD) byLevel[sk.level].mastered++;
    }

    return {
      studentId,
      level: p.level,
      createdAt: p.createdAt,
      totalAssessments: (p.assessments || []).length,
      skillProgress: progress.progress,
      byType,
      byLevel,
      recentActivity: (p.assessments || []).slice(-10).reverse()
    };
  }

  getNextExercises(studentId) {
    const p = this.getProfile(studentId);
    const now = core.today();
    const due = [];

    for (const [key, sk] of Object.entries(p.skills || {})) {
      if (sk.nextReview && sk.nextReview <= now) {
        due.push({
          skillKey: key,
          level: sk.level,
          type: sk.type,
          mastery: core.calcMastery(sk.attempts),
          dueDate: sk.nextReview
        });
      }
    }

    const level = p.level || 'A1';
    const pool = EXERCISES[level] || [];
    const triedTypes = new Set(Object.values(p.skills || {})
      .filter(sk => sk.level === level)
      .map(sk => sk.type));
    const newTypes = [...new Set(pool.map(e => e.type))].filter(t => !triedTypes.has(t));

    return {
      studentId,
      level,
      dueForReview: due.sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
      newTypesToTry: newTypes
    };
  }

  listStudents() {
    return core.listProfiles(this.dir);
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new ListeningTutor();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const id = args[1];
      if (!id) throw new Error('Usage: start <studentId> [level]');
      const level = args[2] || 'A1';
      if (!core.CEFR.includes(level)) throw new Error('Invalid level: ' + level);
      const p = tutor.getProfile(id);
      if (!p.level) p.level = level;
      tutor._save(p);
      out({ studentId: id, level: p.level, status: 'ready' });
      break;
    }
    case 'set-level': {
      const id = args[1], level = args[2];
      if (!id || !level) throw new Error('Usage: set-level <studentId> <level>');
      out(tutor.setLevel(id, level));
      break;
    }
    case 'lesson': {
      const id = args[1];
      if (!id) throw new Error('Usage: lesson <studentId>');
      out(tutor.generateLesson(id));
      break;
    }
    case 'exercise': {
      const id = args[1], type = args[2] || null;
      if (!id) throw new Error('Usage: exercise <studentId> [type]');
      out(tutor.generateExercise(id, type));
      break;
    }
    case 'check': {
      const id = args[1], exId = args[2], answer = args.slice(3).join(' ');
      if (!id || !exId || !answer) throw new Error('Usage: check <studentId> <exerciseId> <answer>');
      out(tutor.checkAnswer(id, exId, answer, parseInt(args[4], 10) || null));
      break;
    }
    case 'record': {
      const id = args[1], exId = args[2], score = parseInt(args[3]), total = parseInt(args[4]);
      if (!id || !exId || isNaN(score) || isNaN(total)) throw new Error('Usage: record <studentId> <exerciseId> <score> <total>');
      out(tutor.recordAssessment(id, exId, score, total));
      break;
    }
    case 'progress': {
      const id = args[1];
      if (!id) throw new Error('Usage: progress <studentId>');
      out(tutor.getProgress(id));
      break;
    }
    case 'report': {
      const id = args[1];
      if (!id) throw new Error('Usage: report <studentId>');
      out(tutor.getReport(id));
      break;
    }
    case 'next': {
      const id = args[1];
      if (!id) throw new Error('Usage: next <studentId>');
      out(tutor.getNextExercises(id));
      break;
    }
    case 'exercises': {
      const level = args[1] || null;
      out(tutor.getExerciseCatalog(level));
      break;
    }
    case 'students': {
      out({ students: tutor.listStudents() });
      break;
    }
    case 'help':
      out({ commands: ['start', 'set-level', 'lesson', 'exercise', 'check', 'record',
                   'progress', 'report', 'next', 'exercises', 'students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + cmd,
        commands: ['start', 'set-level', 'lesson', 'exercise', 'check', 'record',
                   'progress', 'report', 'next', 'exercises', 'students']
      });
  }
});
