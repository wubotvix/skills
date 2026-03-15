#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'french-listening';

// ---------------------------------------------------------------------------
// Embedded exercise data by CEFR level
// ---------------------------------------------------------------------------

const EXERCISES = {
  A1: [
    {
      id: 'a1-dict-boulangerie',
      title: 'A la boulangerie',
      type: 'dictation',
      transcript: 'Bonjour. Je voudrais une baguette et deux croissants, s\'il vous plaît.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Bonjour. Je voudrais une baguette et deux croissants, s\'il vous plaît.',
          explanation: 'Note the apostrophe in "s\'il" (si + il). "Voudrais" is the conditional of vouloir, used for polite requests. "Croissants" has a silent final -s.'
        }
      ],
      vocabulary: ['boulangerie', 'voudrais', 's\'il vous plaît'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-dict-presentation',
      title: 'Présentation personnelle',
      type: 'dictation',
      transcript: 'Je m\'appelle Marie et j\'ai vingt-cinq ans. Je suis de Lyon.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Je m\'appelle Marie et j\'ai vingt-cinq ans. Je suis de Lyon.',
          explanation: 'Note the elisions: "m\'appelle" (me + appelle), "j\'ai" (je + ai). "Vingt-cinq" is hyphenated. "Ans" has a silent final -s.'
        }
      ],
      vocabulary: ['s\'appeler', 'avoir ... ans', 'être de'],
      connectedSpeechFeatures: ['elision: je → j\'']
    },
    {
      id: 'a1-mp-dessus-dessous',
      title: 'Dessus vs dessous',
      type: 'minimal-pairs',
      transcript: 'Le chat est ___ la table.',
      questions: [
        {
          question: 'You hear /dəsy/. Is the cat "dessus" (on top of) or "dessous" (under) the table?',
          answer: 'dessus',
          explanation: '"Dessus" /dəsy/ means on top. "Dessous" /dəsu/ means underneath. The vowel difference /y/ vs /u/ is key — /y/ is the French front rounded vowel (as in "tu").'
        }
      ],
      vocabulary: ['dessus', 'dessous'],
      connectedSpeechFeatures: ['/y/ vs /u/ contrast']
    },
    {
      id: 'a1-mp-tu-tout',
      title: 'Tu vs tout',
      type: 'minimal-pairs',
      transcript: '___ est prêt.',
      questions: [
        {
          question: 'You hear /tu/. Is it "tu" (you) or "tout" (everything/all)?',
          answer: 'tout',
          explanation: '"Tu" is pronounced /ty/ with the front rounded vowel. "Tout" is pronounced /tu/ with the back rounded vowel. Here /tu/ = tout (everything is ready).'
        }
      ],
      vocabulary: ['tu', 'tout'],
      connectedSpeechFeatures: ['/y/ vs /u/ front-back contrast']
    },
    {
      id: 'a1-gap-nombre',
      title: 'Informations personnelles',
      type: 'gap-fill',
      transcript: 'Je ___ Paul et j\'___ trente ans.',
      questions: [
        {
          question: 'Fill in the blanks with the correct verb forms.',
          answer: 'm\'appelle, ai',
          explanation: '"Je m\'appelle" uses the reflexive verb s\'appeler. "J\'ai" uses avoir for expressing age in French (not être as in English).'
        }
      ],
      vocabulary: ['s\'appeler', 'avoir ... ans'],
      connectedSpeechFeatures: ['elision: je + ai → j\'ai']
    },
    {
      id: 'a1-comp-cafe',
      title: 'Au café',
      type: 'comprehension',
      transcript: 'SERVEUR: Bonjour, qu\'est-ce que vous désirez?\nCLIENT: Bonjour. Un café crème et un croissant, s\'il vous plaît.\nSERVEUR: Très bien. C\'est tout?\nCLIENT: Oui, c\'est tout, merci.\nSERVEUR: Ça fait trois euros cinquante.\nCLIENT: Voilà. Merci.\nSERVEUR: Merci à vous. Bonne journée!',
      questions: [
        {
          question: 'Qu\'est-ce que le client commande?',
          answer: 'Un café crème et un croissant.',
          explanation: 'The client says "Un café crème et un croissant, s\'il vous plaît."'
        },
        {
          question: 'Combien ça coûte?',
          answer: 'Trois euros cinquante (3,50€).',
          explanation: 'The waiter says "Ça fait trois euros cinquante."'
        }
      ],
      vocabulary: ['qu\'est-ce que', 'désirer', 'ça fait', 'bonne journée'],
      connectedSpeechFeatures: ['elision: qu\'est-ce que']
    }
  ],

  A2: [
    {
      id: 'a2-dict-vacances',
      title: 'Projets de vacances',
      type: 'dictation',
      transcript: 'L\'été dernier, nous sommes allés en Bretagne. Il a plu presque tous les jours, mais c\'était quand même super.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'L\'été dernier, nous sommes allés en Bretagne. Il a plu presque tous les jours, mais c\'était quand même super.',
          explanation: '"Sommes allés" — passé composé with être (aller is a movement verb). "Plu" is the past participle of pleuvoir. "C\'était" = elision of ce + était. "Quand même" = nonetheless.'
        }
      ],
      vocabulary: ['l\'été dernier', 'pleuvoir → plu', 'quand même'],
      connectedSpeechFeatures: ['liaison: nous‿sommes‿allés', 'enchaînement: c\'était‿quand']
    },
    {
      id: 'a2-dict-marche',
      title: 'Au marché',
      type: 'dictation',
      transcript: 'Je voudrais un kilo de pommes de terre et une livre de tomates, s\'il vous plaît.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Je voudrais un kilo de pommes de terre et une livre de tomates, s\'il vous plaît.',
          explanation: '"Pommes de terre" (potatoes) is a compound noun — literally "apples of the earth." "Une livre" is half a kilogram. Note liaison is optional here.'
        }
      ],
      vocabulary: ['pommes de terre', 'une livre', 'un kilo de'],
      connectedSpeechFeatures: ['optional liaison: un‿kilo']
    },
    {
      id: 'a2-mp-an-on',
      title: 'Nasal vowels: an vs on',
      type: 'minimal-pairs',
      transcript: 'Il a ___ cousin(s).',
      questions: [
        {
          question: 'You hear a nasal vowel. Is it "cent" /sɑ̃/ or "son" /sɔ̃/?',
          answer: 'cent',
          explanation: '/ɑ̃/ (as in "cent", "an", "en") is produced with a lower tongue position. /ɔ̃/ (as in "son", "on", "bon") is more rounded and back. "Cent cousins" = 100 cousins.'
        }
      ],
      vocabulary: ['cent', 'son'],
      connectedSpeechFeatures: ['nasal vowel contrast: /ɑ̃/ vs /ɔ̃/']
    },
    {
      id: 'a2-mp-in-an',
      title: 'Nasal vowels: in vs an',
      type: 'minimal-pairs',
      transcript: 'C\'est mon ___ .',
      questions: [
        {
          question: 'You hear /vɛ̃/. Is it "vin" (wine) or "vent" (wind)?',
          answer: 'vin',
          explanation: '"Vin" /vɛ̃/ uses the nasal vowel /ɛ̃/ (as in "in", "ain", "ein"). "Vent" /vɑ̃/ uses /ɑ̃/ (as in "an", "en"). The tongue height differs: /ɛ̃/ is higher and more fronted.'
        }
      ],
      vocabulary: ['vin', 'vent'],
      connectedSpeechFeatures: ['nasal vowel contrast: /ɛ̃/ vs /ɑ̃/']
    },
    {
      id: 'a2-gap-liaison',
      title: 'Liaisons obligatoires',
      type: 'gap-fill',
      transcript: 'Nous_avons ___ enfants.',
      questions: [
        {
          question: 'You hear /nuzavɔ̃dezɑ̃fɑ̃/. How many children? Fill the blank.',
          answer: 'des',
          explanation: 'Liaison: "nous‿avons" = /nuzavɔ̃/, "des‿enfants" = /dezɑ̃fɑ̃/. The -s in "nous" and "des" is pronounced as /z/ before a vowel. This is obligatory liaison.'
        }
      ],
      vocabulary: ['liaison obligatoire', 'des', 'enfants'],
      connectedSpeechFeatures: ['liaison: nous‿avons /z/', 'liaison: des‿enfants /z/']
    },
    {
      id: 'a2-comp-gare',
      title: 'A la gare',
      type: 'comprehension',
      transcript: 'VOYAGEUR: Bonjour, je voudrais un aller-retour pour Marseille, s\'il vous plaît.\nGUICHETIER: Pour quelle date?\nVOYAGEUR: Pour le 15 mars. Le matin si possible.\nGUICHETIER: Il y a un TGV à 8h15 et un autre à 10h30.\nVOYAGEUR: Le premier, s\'il vous plaît. En seconde classe.\nGUICHETIER: Très bien. Ça fait soixante-douze euros.',
      questions: [
        {
          question: 'Quelle est la destination du voyageur?',
          answer: 'Marseille',
          explanation: 'The traveler says "un aller-retour pour Marseille."'
        },
        {
          question: 'Quel train choisit-il?',
          answer: 'Le TGV de 8h15.',
          explanation: 'He says "Le premier, s\'il vous plaît" — the first option was 8h15.'
        },
        {
          question: 'Combien coûte le billet?',
          answer: 'Soixante-douze euros (72€).',
          explanation: '"Ça fait soixante-douze euros." Note "soixante-douze" = 60 + 12 in French counting.'
        }
      ],
      vocabulary: ['aller-retour', 'guichetier', 'TGV', 'seconde classe'],
      connectedSpeechFeatures: ['enchaînement: un‿aller', 'enchaînement: un‿autre']
    }
  ],

  B1: [
    {
      id: 'b1-dict-logement',
      title: 'Recherche de logement',
      type: 'dictation',
      transcript: 'Je cherche un appartement de deux pièces dans le centre-ville. Il faudrait qu\'il soit lumineux et pas trop cher.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Je cherche un appartement de deux pièces dans le centre-ville. Il faudrait qu\'il soit lumineux et pas trop cher.',
          explanation: '"Il faudrait qu\'il soit" uses the conditional of falloir + subjunctive of être. The subjunctive is triggered by the expression of necessity. "Centre-ville" is hyphenated.'
        }
      ],
      vocabulary: ['deux-pièces', 'centre-ville', 'il faudrait que + subjonctif'],
      connectedSpeechFeatures: ['enchaînement: pas‿trop', 'elision: qu\'il']
    },
    {
      id: 'b1-dict-travail',
      title: 'Entretien d\'embauche',
      type: 'dictation',
      transcript: 'J\'ai travaillé pendant trois ans dans une entreprise informatique où je m\'occupais du service clientèle.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'J\'ai travaillé pendant trois ans dans une entreprise informatique où je m\'occupais du service clientèle.',
          explanation: 'Passé composé "j\'ai travaillé" for the completed work period. Imparfait "m\'occupais" for the habitual role. "Où" (where) as a relative pronoun. "Clientèle" has a grave accent.'
        }
      ],
      vocabulary: ['entretien d\'embauche', 's\'occuper de', 'clientèle'],
      connectedSpeechFeatures: ['liaison: trois‿ans /z/', 'enchaînement: dans‿une']
    },
    {
      id: 'b1-mp-eu-ou',
      title: '/ø/ vs /u/',
      type: 'minimal-pairs',
      transcript: 'Il est ___ .',
      questions: [
        {
          question: 'You hear /ʒø/. Is this "jeu" (game) or "joue" (cheek/plays)?',
          answer: 'jeu',
          explanation: '"Jeu" /ʒø/ uses the closed front rounded vowel /ø/ (as in "deux", "bleu"). "Joue" /ʒu/ uses the back rounded vowel /u/. This /ø/ vs /u/ contrast is uniquely challenging for English speakers.'
        }
      ],
      vocabulary: ['jeu', 'joue'],
      connectedSpeechFeatures: ['/ø/ vs /u/ contrast']
    },
    {
      id: 'b1-gap-enchainement',
      title: 'Enchaînement consonantique',
      type: 'gap-fill',
      transcript: '___ ___ une bonne idée.',
      questions: [
        {
          question: 'You hear /sɛtynbɔnide/. Reconstruct the standard written form for the first two words.',
          answer: 'C\'est une',
          explanation: 'Enchaînement: the final /t/ of "c\'est" links to the vowel of "une" → /sɛ.tyn/. Then "bonne" links to "idée" → /bɔ.ni.de/. Words flow together without pauses in spoken French.'
        }
      ],
      vocabulary: ['c\'est', 'enchaînement'],
      connectedSpeechFeatures: ['enchaînement: c\'est‿une', 'enchaînement: bonne‿idée']
    },
    {
      id: 'b1-comp-coloc',
      title: 'Problèmes de colocation',
      type: 'comprehension',
      transcript: 'LÉA: Tu sais, ça fait trois semaines que Thomas ne fait pas la vaisselle. J\'en ai vraiment marre.\n\nJULIEN: Ouais, j\'ai remarqué aussi. Et en plus, il met sa musique à fond le soir. On pourrait lui en parler?\n\nLÉA: J\'ai déjà essayé, mais il dit toujours qu\'il va s\'en occuper et il ne fait rien. Je pense qu\'il faudrait qu\'on organise une réunion de coloc.\n\nJULIEN: Bonne idée. Ce serait mieux de poser des règles claires pour tout le monde.',
      questions: [
        {
          question: 'De quoi se plaint Léa?',
          answer: 'Thomas ne fait pas la vaisselle depuis trois semaines.',
          explanation: '"Ça fait trois semaines que Thomas ne fait pas la vaisselle." The structure "ça fait + time + que" expresses duration.'
        },
        {
          question: 'Quel autre problème mentionne Julien?',
          answer: 'Thomas met sa musique très fort le soir.',
          explanation: '"Il met sa musique à fond le soir." "À fond" = at full blast.'
        },
        {
          question: 'Quelle solution propose Léa?',
          answer: 'Organiser une réunion de colocation.',
          explanation: '"Il faudrait qu\'on organise une réunion de coloc." Note the subjunctive "organise" after "il faudrait que."'
        }
      ],
      vocabulary: ['j\'en ai marre', 'à fond', 'coloc(ation)', 's\'en occuper'],
      connectedSpeechFeatures: ['elision: qu\'on, qu\'il', 'informal: ouais = oui']
    },
    {
      id: 'b1-note-sante',
      title: 'Reportage: le système de santé',
      type: 'note-taking',
      transcript: 'Le système de santé français est souvent considéré comme l\'un des meilleurs au monde. La Sécurité sociale, créée en 1945, rembourse environ soixante-dix pour cent des frais médicaux. Le reste est généralement couvert par une mutuelle complémentaire. Cependant, le système fait face à plusieurs défis. D\'abord, les déserts médicaux : dans les zones rurales, il est de plus en plus difficile de trouver un médecin généraliste. Ensuite, le temps d\'attente aux urgences dépasse souvent quatre heures. Enfin, le déficit de la Sécurité sociale se creuse chaque année.',
      questions: [
        {
          question: 'What percentage of medical costs does Social Security reimburse?',
          answer: 'About 70% (soixante-dix pour cent).',
          explanation: '"La Sécurité sociale rembourse environ soixante-dix pour cent des frais médicaux."'
        },
        {
          question: 'Quels sont les trois défis mentionnés?',
          answer: 'Les déserts médicaux, les temps d\'attente aux urgences (plus de 4h), et le déficit croissant.',
          explanation: 'Organized with discourse markers: "D\'abord... Ensuite... Enfin..." — a classic three-point structure.'
        }
      ],
      vocabulary: ['Sécurité sociale', 'mutuelle', 'désert médical', 'urgences', 'déficit'],
      connectedSpeechFeatures: ['discourse markers: d\'abord, ensuite, enfin', 'liaison: les‿urgences']
    }
  ],

  B2: [
    {
      id: 'b2-dict-negation',
      title: 'Ne-dropping informel',
      type: 'dictation',
      transcript: 'Je sais pas si je vais pouvoir venir. C\'est que j\'ai un tas de trucs à faire.',
      questions: [
        {
          question: 'Write the full standard form. You hear: "J\'sais pas si j\'vais pouvoir v\'nir. C\'est qu\'j\'ai un tas d\'trucs à faire."',
          answer: 'Je ne sais pas si je vais pouvoir venir. C\'est que j\'ai un tas de trucs à faire.',
          explanation: 'Ne-dropping is nearly universal in spoken French: "je ne sais pas" → "j\'sais pas." The /ə/ in "je", "de", "venir" is also dropped (e muet deletion). "C\'est que" is a hedging device.'
        }
      ],
      vocabulary: ['c\'est que', 'un tas de', 'trucs'],
      connectedSpeechFeatures: ['ne-dropping: je ne sais pas → j\'sais pas', 'e muet deletion: de → d\'', 'hedging with "c\'est que"']
    },
    {
      id: 'b2-dict-soutenu',
      title: 'Registre soutenu',
      type: 'dictation',
      transcript: 'Il n\'en demeure pas moins que les résultats obtenus sont en deçà de nos attentes.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Il n\'en demeure pas moins que les résultats obtenus sont en deçà de nos attentes.',
          explanation: '"Il n\'en demeure pas moins que" = nevertheless / the fact remains that. "En deçà de" = below, falling short of. This is a formal register expression typical of written French used in speeches.'
        }
      ],
      vocabulary: ['il n\'en demeure pas moins que', 'en deçà de', 'attentes'],
      connectedSpeechFeatures: ['formal register: ne retained', 'enchaînement: résultats‿obtenus']
    },
    {
      id: 'b2-gap-emuet',
      title: 'E muet et réductions',
      type: 'gap-fill',
      transcript: '___ ___ ___ que tu veux.',
      questions: [
        {
          question: 'You hear: /ʒətdisakətyvu/. Reconstruct the standard form.',
          answer: 'Je te dis ce',
          explanation: 'Massive e muet deletion: "je te dis ce que tu veux" → /ʒtdissktyvu/. In fast speech, the /ə/ in "je", "te", "ce", "que" can all drop, creating dense consonant clusters.'
        }
      ],
      vocabulary: ['e muet', 'dire'],
      connectedSpeechFeatures: ['e muet deletion chain', 'consonant cluster simplification']
    },
    {
      id: 'b2-comp-debat',
      title: 'Débat sur la gentrification',
      type: 'comprehension',
      transcript: 'MODÉRATRICE: Notre sujet du jour, c\'est la gentrification des quartiers populaires dans les grandes villes françaises. On a deux points de vue. Allez-y.\n\nINTERVENANT 1: Écoutez, le problème, c\'est pas que des commerces nouveaux arrivent dans le quartier — ça, en soi, c\'est plutôt bien. Le problème, c\'est quand les loyers augmentent tellement que les gens qui ont vécu là toute leur vie n\'ont plus les moyens de rester. Et c\'est exactement ce qui se passe dans des quartiers comme Belleville à Paris ou la Croix-Rousse à Lyon.\n\nINTERVENANT 2: Oui, mais il faut aussi reconnaître que l\'investissement apporte des améliorations en termes d\'infrastructures, de sécurité, de services... Le quartier s\'améliore objectivement. La vraie question, c\'est comment faire en sorte que ces améliorations profitent à tout le monde, pas seulement à ceux qui arrivent avec plus de pouvoir d\'achat.',
      questions: [
        {
          question: 'Quelle est la position de l\'Intervenant 1?',
          answer: 'La gentrification fait monter les loyers et chasse les résidents historiques.',
          explanation: 'Intervenant 1 argues rising rents force out long-time residents: "les gens qui ont vécu là toute leur vie n\'ont plus les moyens de rester."'
        },
        {
          question: 'Quels exemples de quartiers gentrifiés sont donnés?',
          answer: 'Belleville à Paris et la Croix-Rousse à Lyon.',
          explanation: 'Specific French examples supporting the argument.'
        },
        {
          question: 'Quelle concession fait l\'Intervenant 2?',
          answer: 'L\'investissement apporte des améliorations en infrastructures, sécurité et services.',
          explanation: 'Uses "il faut aussi reconnaître que" — a concession move before pivoting to the real question.'
        },
        {
          question: 'Quelle est la question clé selon l\'Intervenant 2?',
          answer: 'Comment faire en sorte que les améliorations profitent à tout le monde.',
          explanation: '"La vraie question, c\'est comment faire en sorte que ces améliorations profitent à tout le monde."'
        }
      ],
      vocabulary: ['gentrification', 'loyer', 'investissement', 'pouvoir d\'achat', 'en sorte que'],
      connectedSpeechFeatures: ['ne-dropping: c\'est pas que', 'enchaînement: c\'est‿exactement', 'informal: écoutez as filler']
    },
    {
      id: 'b2-note-urbanisme',
      title: 'Conférence: urbanisme et biodiversité',
      type: 'note-taking',
      transcript: 'Ce que nous avons constaté ces dernières années, c\'est que l\'urbanisation affecte la biodiversité — et pas toujours de la manière qu\'on pourrait croire. S\'il est vrai que l\'expansion des villes détruit généralement des habitats naturels, des recherches récentes suggèrent que les espaces verts urbains — parcs, jardins, toitures végétalisées — peuvent abriter une variété surprenante d\'espèces. Une étude menée à Paris a montré que les parcs urbains contenaient cinquante-cinq pour cent des espèces d\'oiseaux qu\'on trouve dans les forêts environnantes. Une autre étude, à Montpellier, a documenté plus de quatre-vingts espèces de papillons dans les jardins de la ville. Cela ne signifie pas que l\'urbanisation soit bonne pour la biodiversité, mais qu\'un urbanisme intelligent peut atténuer significativement les dommages.',
      questions: [
        {
          question: 'What is the main argument of the lecture?',
          answer: 'Urban green spaces can host a surprising variety of species, so smart urban planning can mitigate biodiversity loss.',
          explanation: 'Nuanced view: urbanization harms biodiversity, BUT urban green spaces partially compensate.'
        },
        {
          question: 'Quelles données apporte l\'étude de Paris?',
          answer: 'Les parcs urbains contenaient 55% des espèces d\'oiseaux des forêts environnantes.',
          explanation: 'Specific statistic supporting the main claim.'
        },
        {
          question: 'Qu\'a-t-on trouvé à Montpellier?',
          answer: 'Plus de quatre-vingts espèces de papillons dans les jardins urbains.',
          explanation: 'Second piece of evidence. Note "quatre-vingts" (80) — the French vigesimal counting system.'
        }
      ],
      vocabulary: ['urbanisme', 'biodiversité', 'habitat', 'abriter', 'toitures végétalisées', 'atténuer'],
      connectedSpeechFeatures: ['formal register', 'liaison: les‿espaces', 'enchaînement: des‿espèces']
    }
  ],

  C1: [
    {
      id: 'c1-dict-quebec',
      title: 'Conversation informelle québécoise',
      type: 'dictation',
      transcript: 'Écoute, as-tu vu ce qui s\'est passé avec le loyer? Le propriétaire veut l\'augmenter de trente pour cent.',
      questions: [
        {
          question: 'Write the standard form. You hear: "Écoute, t\'as-tu vu c\'qui s\'est passé avec le loyer? Le proprio veut l\'augmenter de trente pour cent, là."',
          answer: 'Écoute, as-tu vu ce qui s\'est passé avec le loyer? Le propriétaire veut l\'augmenter de trente pour cent.',
          explanation: 'Quebec features: "t\'as-tu" = emphatic question form (double "tu"). "C\'qui" = ce qui (reduction). "Proprio" = propriétaire (truncation). "Là" as a discourse marker (ubiquitous in Quebec French).'
        }
      ],
      vocabulary: ['proprio (québécois)', 'loyer', 'augmenter', 'là (marqueur discursif)'],
      connectedSpeechFeatures: ['Quebec: tu-question doubling', 'truncation: proprio', 'discourse marker: là']
    },
    {
      id: 'c1-dict-rapide',
      title: 'Parole très rapide',
      type: 'dictation',
      transcript: 'Écoute, la vérité c\'est que ça ne me dit rien, mais bon, si tu veux on y va.',
      questions: [
        {
          question: 'Write the standard form. You hear: "Écoute, la vérité c\'est qu\'ça m\'dit rien, mais bon, si tu veux on y va."',
          answer: 'Écoute, la vérité c\'est que ça ne me dit rien, mais bon, si tu veux on y va.',
          explanation: 'Ne-dropping: "ne me dit rien" → "m\'dit rien." E muet deletion: "que" → "qu\'" before "ça", "me" → "m\'". "Mais bon" = filler expressing resignation. "Ça ne me dit rien" = I don\'t feel like it.'
        }
      ],
      vocabulary: ['ça ne me dit rien', 'mais bon', 'on y va'],
      connectedSpeechFeatures: ['ne-dropping', 'e muet chain deletion', 'filler: mais bon']
    },
    {
      id: 'c1-gap-reductions',
      title: 'Réductions régionales',
      type: 'gap-fill',
      transcript: '___ ___ tu fais ça?',
      questions: [
        {
          question: 'You hear: "Pourquoi qu\'tu fais ça?" — reconstruct the standard form.',
          answer: 'Pourquoi est-ce que',
          explanation: 'In very informal French, "pourquoi est-ce que" reduces to "pourquoi que" or even "pourquoi qu\'." The formal inversion "pourquoi fais-tu cela?" is at the other extreme.'
        }
      ],
      vocabulary: ['pourquoi est-ce que', 'registre familier'],
      connectedSpeechFeatures: ['question reduction: est-ce que → que', 'e muet deletion']
    },
    {
      id: 'c1-gap-condense',
      title: 'Groupe verbal condensé',
      type: 'gap-fill',
      transcript: '___ ___ ___ travailler davantage.',
      questions: [
        {
          question: 'Fill the blanks. The spoken form compresses a modal verb cluster.',
          answer: 'Tu aurais dû',
          explanation: '"Tu aurais dû (travailler davantage)" — conditionnel passé of devoir. In fast speech: "t\'aurais dû" with the /y/ of "tu" dropping. Expresses past regret/obligation.'
        }
      ],
      vocabulary: ['conditionnel passé', 'devoir', 'davantage'],
      connectedSpeechFeatures: ['tu → t\' reduction', 'modal cluster compression']
    },
    {
      id: 'c1-comp-quebec',
      title: 'Problème de logement (Québec)',
      type: 'comprehension',
      transcript: 'MARTIN: Écoute, t\'as-tu vu c\'qui s\'est passé avec le loyer, là? Le proprio veut l\'augmenter de trente pour cent. Trente! On est ben fous si on accepte ça.\n\nLUCIE: Ah non... Pis qu\'est-ce que vous allez faire? Parce que déménager là maintenant, ça serait tout un bordel, avec la job pis toute.\n\nMARTIN: Ben oui, mais quelle option on a? Si on reste, on va être dans la marde. Pis en plus le gars répare rien — ça fait deux mois qu\'on lui demande de réparer le chauffage.\n\nLUCIE: Moi, à ta place, j\'enverrais une mise en demeure. Ça les énerve en masse.',
      questions: [
        {
          question: 'De combien le propriétaire veut-il augmenter le loyer?',
          answer: 'De trente pour cent.',
          explanation: 'Stated twice for emphasis: "trente pour cent. Trente!"'
        },
        {
          question: 'Que signifie "tout un bordel" dans ce contexte?',
          answer: 'Un gros problème / un désastre.',
          explanation: '"Bordel" is informal Quebecois/French for a chaotic mess. "Ça serait tout un bordel" = it would be a real disaster.'
        },
        {
          question: 'Quel problème supplémentaire ont-ils avec le propriétaire?',
          answer: 'Il ne répare pas le chauffage malgré deux mois de demandes.',
          explanation: '"Ça fait deux mois qu\'on lui demande de réparer le chauffage." Duration structure with ça fait...que.'
        },
        {
          question: 'Que recommande Lucie?',
          answer: 'Envoyer une mise en demeure (formal legal notice).',
          explanation: '"J\'enverrais une mise en demeure. Ça les énerve en masse." "En masse" = a lot (Quebecism). A "mise en demeure" is a formal legal notice in Quebec/French law.'
        }
      ],
      vocabulary: ['bordel', 'la job (québ.)', 'être dans la marde', 'mise en demeure', 'en masse'],
      connectedSpeechFeatures: ['Quebec: t\'as-tu, pis (puis), ben (bien)', 'joual features: la job, toute', 'ne-dropping throughout']
    },
    {
      id: 'c1-note-numerique',
      title: 'Conférence: fracture numérique en Afrique francophone',
      type: 'note-taking',
      transcript: 'La transformation numérique en Afrique francophone présente un panorama contradictoire. D\'un côté, la région a connu une croissance explosive du commerce en ligne — rien qu\'en deux mille vingt, les transactions numériques ont augmenté de quarante-deux pour cent, portées par la pandémie. Des pays comme la Côte d\'Ivoire, le Sénégal et la République démocratique du Congo mènent cette tendance. Toutefois, une fracture numérique alarmante persiste : environ quarante-cinq pour cent de la population d\'Afrique francophone n\'a toujours pas accès à l\'internet haut débit. Dans les zones rurales du Mali, du Burkina Faso et du Niger, ce chiffre dépasse les soixante-quinze pour cent. Cela signifie que l\'économie numérique crée une nouvelle forme d\'inégalité. Ceux qui ont la connectivité accèdent aux emplois à distance, à la formation en ligne et aux services financiers numériques. Ceux qui ne l\'ont pas en sont exclus. La solution ne se résume pas aux infrastructures — elle requiert aussi une alphabétisation numérique et des politiques publiques garantissant un accès équitable.',
      questions: [
        {
          question: 'Quelle est la contradiction centrale décrite par le conférencier?',
          answer: 'Croissance explosive du commerce en ligne coexiste avec une grave fracture numérique — 45% n\'ont pas de haut débit.',
          explanation: 'Structured around "d\'un côté... toutefois" — classic contrast pattern.'
        },
        {
          question: 'De quel pourcentage les transactions numériques ont-elles augmenté en 2020?',
          answer: '42%.',
          explanation: '"Les transactions numériques ont augmenté de quarante-deux pour cent."'
        },
        {
          question: 'Quels pays mènent la tendance du commerce en ligne?',
          answer: 'La Côte d\'Ivoire, le Sénégal et la RDC.',
          explanation: 'Three specific Francophone African countries given as examples.'
        },
        {
          question: 'Quel est le taux d\'exclusion numérique dans les zones rurales?',
          answer: 'Plus de 75% sans internet haut débit.',
          explanation: '"Dans les zones rurales du Mali, du Burkina Faso et du Niger, ce chiffre dépasse les soixante-quinze pour cent."'
        },
        {
          question: 'Quelles solutions sont proposées au-delà des infrastructures?',
          answer: 'Alphabétisation numérique et politiques publiques d\'accès équitable.',
          explanation: '"Elle requiert aussi une alphabétisation numérique et des politiques publiques garantissant un accès équitable."'
        }
      ],
      vocabulary: ['fracture numérique', 'haut débit', 'commerce en ligne', 'alphabétisation numérique', 'accès équitable', 'inégalité'],
      connectedSpeechFeatures: ['academic register', 'd\'un côté... toutefois contrast', 'numbers in speech']
    }
  ],

  C2: [
    {
      id: 'c2-dict-verlan',
      title: 'Parler jeune et verlan',
      type: 'dictation',
      transcript: 'Regarde, le mec est bizarre. Il nous a dit qu\'il allait s\'en occuper et au final il n\'a rien fait du tout.',
      questions: [
        {
          question: 'Write the standard form. You hear: "Mate, le keum il est chelou. Il nous a dit qu\'il allait s\'en occ et au final il a rien foutu."',
          answer: 'Regarde, le mec est bizarre. Il nous a dit qu\'il allait s\'en occuper et au final il n\'a rien fait du tout.',
          explanation: 'Verlan: "mate" = regarde (from "mater"), "keum" = mec (reversed), "chelou" = louche (reversed, meaning weird). "Foutu" = fait (vulgar). "Occ" = truncation of "occuper." Multiple layers of informal register.'
        }
      ],
      vocabulary: ['mater → mate', 'mec → keum', 'louche → chelou', 'foutre'],
      connectedSpeechFeatures: ['verlan inversions', 'truncation', 'argot des jeunes']
    },
    {
      id: 'c2-dict-belge',
      title: 'Français belge informel',
      type: 'dictation',
      transcript: 'Je suis allé au magasin ce matin pour acheter des tartines et du sirop de Liège, mais il n\'y avait plus rien.',
      questions: [
        {
          question: 'Write the standard France-French equivalent. You hear Belgian French with "nonante" and "une fois."',
          answer: 'Je suis allé au magasin ce matin pour acheter des tartines et du sirop de Liège, mais il n\'y avait plus rien.',
          explanation: 'Belgian French: "septante/nonante" instead of "soixante-dix/quatre-vingt-dix." "Tartines" = slices of bread (more common in Belgium than in France). "Sirop de Liège" is a Belgian specialty. "Une fois" as a discourse filler is stereotypical Belgian.'
        }
      ],
      vocabulary: ['tartine (belge)', 'sirop de Liège', 'septante/nonante', 'une fois (marqueur)'],
      connectedSpeechFeatures: ['Belgian counting: septante, nonante', 'Belgian discourse markers']
    },
    {
      id: 'c2-dict-africain',
      title: 'Français d\'Afrique de l\'Ouest',
      type: 'dictation',
      transcript: 'Mon frère est parti au marché ce matin pour acheter du poisson frais, mais les prix ont encore augmenté. La vie est devenue vraiment chère.',
      questions: [
        {
          question: 'Write the standard form. The speaker uses West African French features.',
          answer: 'Mon frère est parti au marché ce matin pour acheter du poisson frais, mais les prix ont encore augmenté. La vie est devenue vraiment chère.',
          explanation: 'West African French features: characteristic intonation patterns, /r/ may be a tap rather than uvular, tendency toward syllable-timed rhythm. "La vie est chère" is a universal francophone complaint with particular resonance in West Africa.'
        }
      ],
      vocabulary: ['marché', 'poisson frais', 'augmenter', 'la vie est chère'],
      connectedSpeechFeatures: ['West African rhythm patterns', 'tap /r/ vs uvular /ʁ/', 'syllable-timed delivery']
    },
    {
      id: 'c2-mp-ironie',
      title: 'Détection de l\'ironie',
      type: 'minimal-pairs',
      transcript: 'Context: A colleague arrives 45 minutes late to a meeting. The boss says: "C\'est tellement aimable à vous de nous honorer de votre présence."',
      questions: [
        {
          question: 'Is the boss being sincere or ironic? Explain how you know.',
          answer: 'ironic',
          explanation: 'The elevated register ("honorer de votre présence") is absurdly formal for the situation. The exaggerated politeness signals irony — the boss is criticizing the tardiness. "Tellement" adds emphasis that reinforces the sarcastic reading.'
        }
      ],
      vocabulary: ['honorer', 'présence', 'ironie', 'registre décalé'],
      connectedSpeechFeatures: ['register mismatch as irony signal']
    },
    {
      id: 'c2-comp-varietes',
      title: 'Identification des variétés régionales',
      type: 'comprehension',
      transcript: 'Version A: "Écoute, t\'as-tu vu? Le gars y a rien fait pantoute. On est dans la marde, là."\nVersion B: "Mate, le keum il a rien foutu. On est dans la merde, frère."\nVersion C: "Écoutez, le type n\'a strictement rien fait. Nous sommes dans une situation délicate."',
      questions: [
        {
          question: 'De quelle région ou registre est chaque version?',
          answer: 'A = Québec, B = France (argot des jeunes / banlieue), C = France (registre soutenu)',
          explanation: 'A: Quebec markers (t\'as-tu, pantoute, là, y = il). B: verlan/argot (mate, keum, foutu, frère). C: formal register (ne...rien retained, "strictement", "situation délicate").'
        },
        {
          question: 'Quels traits linguistiques identifient chaque variété?',
          answer: 'A: tu-doubling + pantoute + là; B: verlan + argot + frère; C: négation complète + vocabulaire soutenu',
          explanation: 'Register markers: colloquial Quebec vs youth argot vs formal standard. All three say the same thing with completely different linguistic codes.'
        }
      ],
      vocabulary: ['pantoute (québ.)', 'verlan', 'registre soutenu', 'variété régionale'],
      connectedSpeechFeatures: ['accent identification', 'register and sociolect markers']
    },
    {
      id: 'c2-note-francophonie',
      title: 'Conférence: l\'avenir de la francophonie',
      type: 'note-taking',
      transcript: 'La francophonie constitue l\'un des espaces linguistiques les plus dynamiques au monde. Avec environ trois cents millions de locuteurs actuels, le français est la cinquième langue la plus parlée au niveau mondial. Mais c\'est en Afrique que se joue l\'avenir de la langue. D\'ici deux mille cinquante, les projections démographiques suggèrent que le nombre de francophones pourrait atteindre sept cents millions, dont plus de quatre-vingts pour cent en Afrique subsaharienne. Le continent africain comptera alors plus de francophones que l\'Europe, l\'Amérique du Nord et le reste du monde réunis. Cette évolution pose des questions fondamentales. Premièrement, le français tel qu\'il est parlé en Afrique est déjà profondément différent du français hexagonal — enrichi de néologismes, d\'emprunts aux langues locales, de structures syntaxiques originales. Faut-il voir ces évolutions comme une menace pour l\'unité de la langue ou comme une richesse? Deuxièmement, la politique linguistique coloniale a laissé des traces profondes : dans de nombreux pays africains, le français reste la langue de l\'élite et de l\'administration, tandis que les langues locales dominent la vie quotidienne. Cette diglossie crée des inégalités d\'accès à l\'éducation et à l\'emploi.',
      questions: [
        {
          question: 'Combien de francophones y aura-t-il en 2050 selon les projections?',
          answer: 'Sept cents millions (700 millions), dont plus de 80% en Afrique subsaharienne.',
          explanation: 'Opening projection to frame the scale of the demographic shift.'
        },
        {
          question: 'Avec quoi le français africain est-il enrichi?',
          answer: 'Des néologismes, des emprunts aux langues locales, des structures syntaxiques originales.',
          explanation: 'Three categories of enrichment showing African French as a living, evolving language.'
        },
        {
          question: 'Quel héritage problématique de la colonisation est mentionné?',
          answer: 'La diglossie : le français reste langue de l\'élite et de l\'administration, les langues locales dominent le quotidien.',
          explanation: '"Cette diglossie crée des inégalités d\'accès à l\'éducation et à l\'emploi."'
        },
        {
          question: 'Quelle question fondamentale le conférencier pose-t-il sur l\'évolution du français?',
          answer: 'Les évolutions du français africain sont-elles une menace pour l\'unité de la langue ou une richesse?',
          explanation: 'Key rhetorical question framing the debate about linguistic variation vs. standardization.'
        }
      ],
      vocabulary: ['francophonie', 'diglossie', 'néologisme', 'français hexagonal', 'subsaharienne', 'politique linguistique'],
      connectedSpeechFeatures: ['academic register', 'complex subordination', 'premièrement... deuxièmement structure']
    }
  ]
};

// ---------------------------------------------------------------------------
// Flatten exercises for quick lookup
// ---------------------------------------------------------------------------

const ALL_EXERCISES = {};
for (const level of core.CEFR) {
  if (EXERCISES[level]) {
    for (const ex of EXERCISES[level]) {
      ALL_EXERCISES[ex.id] = { ...ex, level };
    }
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

  // ---- Profile management ----

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.skills) p.skills = {};
    if (!p.assessments) p.assessments = [];
    if (!p.sessions) p.sessions = [];
    if (!p.exerciseHistory) p.exerciseHistory = {};
    return p;
  }

  _save(p) {
    core.saveProfile(this.dir, p);
  }

  setLevel(studentId, level) {
    level = level.toUpperCase();
    if (!core.CEFR.includes(level)) throw new Error('Invalid CEFR level: ' + level);
    const p = this.getProfile(studentId);
    p.level = level;
    this._save(p);
    return { studentId, level };
  }

  // ---- Exercise catalog ----

  getExerciseCatalog(level) {
    if (level) {
      return (EXERCISES[level] || []).map(e => ({
        id: e.id, title: e.title, type: e.type, level,
        questionCount: e.questions.length
      }));
    }
    const catalog = {};
    for (const lv of core.CEFR) {
      if (EXERCISES[lv]) {
        catalog[lv] = EXERCISES[lv].map(e => ({
          id: e.id, title: e.title, type: e.type,
          questionCount: e.questions.length
        }));
      }
    }
    return catalog;
  }

  // ---- Exercise generation ----

  generateExercise(studentId, type) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    let pool = EXERCISES[level] || EXERCISES.A1;
    if (type) {
      pool = pool.filter(e => e.type === type);
      if (!pool.length) throw new Error(`No exercises of type "${type}" at level ${level}`);
    }

    // Prefer exercises not recently done
    const history = p.exerciseHistory || {};
    const unseen = pool.filter(e => !history[e.id]);
    const chosen = unseen.length ? core.pick(unseen, 1)[0] : core.pick(pool, 1)[0];

    return {
      exerciseId: chosen.id,
      level,
      type: chosen.type,
      title: chosen.title,
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

    // Pick up to 4 exercises, varying types
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

  // ---- Answer checking ----

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

    // Record in profile
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

  // ---- Assessment recording ----

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

    // FSRS update
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

  // ---- Progress & reports ----

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

    // Summary by type
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

    // Summary by level
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

    // Also suggest new exercise types not yet attempted at current level
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

  // ---- Admin ----

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
