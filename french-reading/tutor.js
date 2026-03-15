#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'french-reading';

// ---------------------------------------------------------------------------
// Embedded reading texts by CEFR level
// ---------------------------------------------------------------------------

const TEXTS = {
  A1: [
    {
      id: 'a1-cafe',
      title: 'Au café',
      type: 'dialogue',
      text:
        '— Bonjour, qu\'est-ce que vous désirez?\n' +
        '— Bonjour. Je voudrais un café crème, s\'il vous plaît.\n' +
        '— Grand ou petit?\n' +
        '— Grand. Et aussi un croissant.\n' +
        '— Très bien. Ça fait trois euros cinquante.\n' +
        '— Voilà. Merci.\n' +
        '— De rien. Bonne journée!',
      vocabulary: [
        { word: 'désirez', definition: 'do you want (formal)', example: 'Qu\'est-ce que vous désirez boire?' },
        { word: 'croissant', definition: 'crescent-shaped pastry', example: 'Un croissant au beurre, s\'il vous plaît.' },
        { word: 'bonne journée', definition: 'have a nice day', example: 'Au revoir, bonne journée!' },
      ],
      comprehensionQuestions: [
        {
          question: 'Qu\'est-ce que le client commande à boire?',
          options: ['Un thé', 'Un café crème', 'Un jus d\'orange', 'Un chocolat chaud'],
          answer: 1,
          explanation: 'Le client dit "Je voudrais un café crème."',
        },
        {
          question: 'Quelle taille choisit-il?',
          options: ['Petit', 'Moyen', 'Grand', 'Il ne dit pas'],
          answer: 2,
          explanation: 'Quand on lui demande "Grand ou petit?", il répond "Grand."',
        },
        {
          question: 'Combien coûte la commande?',
          options: ['2,50€', '3,00€', '3,50€', '4,00€'],
          answer: 2,
          explanation: 'Le serveur dit "Ça fait trois euros cinquante."',
        },
      ],
    },
    {
      id: 'a1-famille',
      title: 'Ma famille',
      type: 'description',
      text:
        'Je m\'appelle Sophie. J\'ai vingt-trois ans et je suis étudiante à Lyon. ' +
        'J\'habite avec ma mère et mon frère. Ma mère s\'appelle Catherine, elle a ' +
        'quarante-huit ans. Elle est infirmière à l\'hôpital. Mon frère s\'appelle ' +
        'Thomas, il a dix-sept ans. Il est lycéen. Le week-end, nous aimons aller au ' +
        'marché ensemble. Mon père ne vit pas avec nous, il habite à Marseille.',
      vocabulary: [
        { word: 'étudiante', definition: 'female student', example: 'Elle est étudiante en médecine.' },
        { word: 'infirmière', definition: 'nurse (female)', example: 'Ma tante est infirmière.' },
        { word: 'lycéen', definition: 'high school student', example: 'Les lycéens ont des examens en juin.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Où habite Sophie?',
          options: ['À Paris', 'À Lyon', 'À Marseille', 'À Bordeaux'],
          answer: 1,
          explanation: 'Le texte dit "je suis étudiante à Lyon."',
        },
        {
          question: 'Que fait la mère de Sophie?',
          options: ['Elle est professeur', 'Elle est médecin', 'Elle est infirmière', 'Elle est avocate'],
          answer: 2,
          explanation: '"Elle est infirmière à l\'hôpital."',
        },
        {
          question: 'Où habite le père de Sophie?',
          options: ['À Lyon', 'À Paris', 'À Marseille', 'On ne sait pas'],
          answer: 2,
          explanation: '"Mon père ne vit pas avec nous, il habite à Marseille."',
        },
      ],
    },
    {
      id: 'a1-meteo',
      title: 'La météo de la semaine',
      type: 'informational',
      text:
        'Lundi: Il fait beau. Le soleil brille. Il fait vingt-deux degrés.\n' +
        'Mardi: Il y a des nuages. Il fait dix-huit degrés.\n' +
        'Mercredi: Il pleut. Il fait quinze degrés. Prenez un parapluie!\n' +
        'Jeudi: Il y a du vent. Il fait seize degrés.\n' +
        'Vendredi: Il fait beau et chaud. Il fait vingt-cinq degrés.\n' +
        'Bon week-end à tous!',
      vocabulary: [
        { word: 'il fait beau', definition: 'the weather is nice', example: 'Aujourd\'hui il fait beau, allons au parc.' },
        { word: 'il pleut', definition: 'it\'s raining', example: 'Il pleut depuis ce matin.' },
        { word: 'parapluie', definition: 'umbrella', example: 'N\'oublie pas ton parapluie!' },
      ],
      comprehensionQuestions: [
        {
          question: 'Quel jour faut-il prendre un parapluie?',
          options: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi'],
          answer: 2,
          explanation: 'Mercredi: "Il pleut. Prenez un parapluie!"',
        },
        {
          question: 'Quel est le jour le plus chaud?',
          options: ['Lundi', 'Mercredi', 'Jeudi', 'Vendredi'],
          answer: 3,
          explanation: 'Vendredi: "Il fait vingt-cinq degrés."',
        },
        {
          question: 'Quel temps fait-il mardi?',
          options: ['Il fait beau', 'Il y a des nuages', 'Il pleut', 'Il neige'],
          answer: 1,
          explanation: '"Mardi: Il y a des nuages."',
        },
      ],
    },
  ],

  A2: [
    {
      id: 'a2-recette',
      title: 'Recette: la quiche lorraine',
      type: 'instructional',
      text:
        'La quiche lorraine est un plat traditionnel français originaire de la région ' +
        'Lorraine. Voici la recette pour quatre personnes.\n\n' +
        'Ingrédients: une pâte brisée, 200 grammes de lardons, 3 œufs, 20 centilitres ' +
        'de crème fraîche, sel, poivre, noix de muscade.\n\n' +
        'Préparation: D\'abord, préchauffez le four à 180 degrés. Ensuite, étalez la ' +
        'pâte dans un moule. Faites revenir les lardons dans une poêle sans matière ' +
        'grasse. Répartissez-les sur la pâte. Dans un bol, mélangez les œufs, la crème, ' +
        'le sel, le poivre et la muscade. Versez ce mélange sur les lardons. Enfin, ' +
        'enfournez pendant 30 à 35 minutes. La quiche est prête quand elle est dorée!',
      vocabulary: [
        { word: 'pâte brisée', definition: 'shortcrust pastry', example: 'La pâte brisée est la base de la quiche.' },
        { word: 'lardons', definition: 'small pieces of bacon', example: 'Faites dorer les lardons à la poêle.' },
        { word: 'enfournez', definition: 'put in the oven', example: 'Enfournez le gâteau pendant 30 minutes.' },
      ],
      comprehensionQuestions: [
        {
          question: 'De quelle région vient la quiche lorraine?',
          options: ['La Bretagne', 'La Lorraine', 'La Provence', 'La Normandie'],
          answer: 1,
          explanation: '"La quiche lorraine est un plat traditionnel français originaire de la région Lorraine."',
        },
        {
          question: 'À quelle température faut-il préchauffer le four?',
          options: ['150 degrés', '180 degrés', '200 degrés', '220 degrés'],
          answer: 1,
          explanation: '"Préchauffez le four à 180 degrés."',
        },
        {
          question: 'Comment sait-on que la quiche est prête?',
          options: ['Elle est froide', 'Elle est dorée', 'Elle est liquide', 'Elle est noire'],
          answer: 1,
          explanation: '"La quiche est prête quand elle est dorée!"',
        },
      ],
    },
    {
      id: 'a2-vacances',
      title: 'Mes dernières vacances',
      type: 'narrative',
      text:
        'L\'été dernier, je suis allée en Bretagne avec ma famille. Nous avons loué ' +
        'une petite maison près de la mer, à Saint-Malo. Le premier jour, nous avons ' +
        'visité la vieille ville. Les remparts étaient magnifiques! Le deuxième jour, ' +
        'nous sommes allés à la plage. L\'eau était froide, mais les enfants se sont ' +
        'bien amusés. Le soir, nous avons mangé des crêpes dans une crêperie. C\'était ' +
        'délicieux! Le troisième jour, il a plu, alors nous sommes allés au musée de ' +
        'la mer. J\'ai beaucoup aimé ces vacances. La Bretagne est vraiment belle.',
      vocabulary: [
        { word: 'remparts', definition: 'city walls, ramparts', example: 'Les remparts de Saint-Malo datent du Moyen Âge.' },
        { word: 'crêperie', definition: 'crêpe restaurant', example: 'En Bretagne, il y a une crêperie à chaque coin de rue.' },
        { word: 'se sont amusés', definition: 'had fun (reflexive past)', example: 'Les enfants se sont bien amusés au parc.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Où la famille est-elle allée en vacances?',
          options: ['En Normandie', 'En Bretagne', 'En Provence', 'En Alsace'],
          answer: 1,
          explanation: '"Je suis allée en Bretagne avec ma famille."',
        },
        {
          question: 'Qu\'est-ce qu\'ils ont mangé le deuxième soir?',
          options: ['Des moules', 'Du poisson', 'Des crêpes', 'De la pizza'],
          answer: 2,
          explanation: '"Nous avons mangé des crêpes dans une crêperie."',
        },
        {
          question: 'Pourquoi sont-ils allés au musée le troisième jour?',
          options: ['Parce qu\'ils aiment les musées', 'Parce qu\'il a plu', 'Parce que la plage était fermée', 'Parce qu\'ils s\'ennuyaient'],
          answer: 1,
          explanation: '"Il a plu, alors nous sommes allés au musée de la mer."',
        },
      ],
    },
    {
      id: 'a2-colocation',
      title: 'Annonce: cherche colocataire',
      type: 'advertisement',
      text:
        'COLOCATION — Paris 11e\n\n' +
        'Nous cherchons un(e) colocataire pour un appartement de 3 pièces dans le ' +
        '11e arrondissement, à 5 minutes du métro Voltaire.\n\n' +
        'La chambre disponible fait 14 m². L\'appartement a un grand salon, une cuisine ' +
        'équipée et une salle de bains. Il y a aussi un petit balcon.\n\n' +
        'Nous sommes deux étudiants: Julie (24 ans, étudiante en droit) et Marc ' +
        '(25 ans, étudiant en informatique). Nous sommes calmes et non-fumeurs.\n\n' +
        'Loyer: 650€ charges comprises. Disponible à partir du 1er septembre.\n\n' +
        'Contact: coloc-paris11@email.fr',
      vocabulary: [
        { word: 'colocataire', definition: 'flatmate, roommate', example: 'Mon colocataire est très sympa.' },
        { word: 'charges comprises', definition: 'utilities included', example: 'Le loyer est de 650€ charges comprises.' },
        { word: 'arrondissement', definition: 'district (in Paris)', example: 'Le Marais est dans le 3e arrondissement.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Combien coûte le loyer?',
          options: ['550€', '600€', '650€', '700€'],
          answer: 2,
          explanation: '"Loyer: 650€ charges comprises."',
        },
        {
          question: 'Quelle est la taille de la chambre?',
          options: ['10 m²', '12 m²', '14 m²', '16 m²'],
          answer: 2,
          explanation: '"La chambre disponible fait 14 m²."',
        },
        {
          question: 'Qu\'étudie Marc?',
          options: ['Le droit', 'La médecine', 'L\'informatique', 'L\'histoire'],
          answer: 2,
          explanation: '"Marc (25 ans, étudiant en informatique)."',
        },
      ],
    },
  ],

  B1: [
    {
      id: 'b1-teletravail',
      title: 'Le télétravail en France',
      type: 'article',
      text:
        'Depuis la pandémie de 2020, le télétravail s\'est généralisé en France. Selon ' +
        'une étude de l\'INSEE, environ 30% des salariés français pratiquent le ' +
        'télétravail au moins un jour par semaine.\n\n' +
        'Les avantages sont nombreux: moins de temps dans les transports, une meilleure ' +
        'qualité de vie, et souvent une productivité accrue. Beaucoup de Français ont ' +
        'quitté les grandes villes pour s\'installer en province, où la vie est moins ' +
        'chère et plus agréable.\n\n' +
        'Cependant, le télétravail pose aussi des problèmes. L\'isolement social est la ' +
        'plainte la plus fréquente. Certains employés ont du mal à séparer leur vie ' +
        'professionnelle et leur vie personnelle. De plus, tous les métiers ne permettent ' +
        'pas de travailler à distance: les ouvriers, les soignants et les commerçants ' +
        'doivent être présents sur leur lieu de travail.\n\n' +
        'Le modèle hybride, qui combine deux ou trois jours au bureau et le reste en ' +
        'télétravail, semble être la solution préférée des Français.',
      vocabulary: [
        { word: 'INSEE', definition: 'Institut national de la statistique et des études économiques', example: 'L\'INSEE publie les chiffres du chômage.' },
        { word: 'accrue', definition: 'increased', example: 'La productivité accrue justifie le télétravail.' },
        { word: 'soignants', definition: 'healthcare workers', example: 'Les soignants sont indispensables à l\'hôpital.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Quel pourcentage de salariés français pratiquent le télétravail?',
          options: ['20%', '25%', '30%', '40%'],
          answer: 2,
          explanation: '"Environ 30% des salariés français pratiquent le télétravail au moins un jour par semaine."',
        },
        {
          question: 'Quel est le principal inconvénient du télétravail?',
          options: ['Le coût', 'L\'isolement social', 'La technologie', 'Le bruit'],
          answer: 1,
          explanation: '"L\'isolement social est la plainte la plus fréquente."',
        },
        {
          question: 'Quelle solution les Français préfèrent-ils?',
          options: ['Tout en télétravail', 'Tout au bureau', 'Le modèle hybride', 'Le travail le week-end'],
          answer: 2,
          explanation: '"Le modèle hybride semble être la solution préférée des Français."',
        },
      ],
    },
    {
      id: 'b1-greve',
      title: 'La grève à la française',
      type: 'article',
      text:
        'La France est souvent associée aux grèves et aux manifestations. En effet, le ' +
        'droit de grève est inscrit dans la Constitution depuis 1946. Les Français ' +
        'considèrent ce droit comme un acquis social fondamental.\n\n' +
        'Les secteurs les plus touchés sont les transports publics, l\'éducation nationale ' +
        'et la fonction publique. Quand la SNCF ou la RATP font grève, des millions de ' +
        'Parisiens doivent trouver des solutions alternatives pour aller au travail.\n\n' +
        'Pour les étrangers, les grèves françaises sont parfois difficiles à comprendre. ' +
        'Pourquoi les Français manifestent-ils autant? La raison est historique: depuis ' +
        'la Révolution de 1789, la contestation sociale est considérée comme un droit ' +
        'légitime. Les grandes avancées sociales — les congés payés, la semaine de 35 ' +
        'heures, la Sécurité sociale — ont souvent été obtenues grâce aux mobilisations ' +
        'populaires.\n\n' +
        'Aujourd\'hui, les opinions sont partagées. Certains pensent que les grèves sont ' +
        'nécessaires pour protéger les droits des travailleurs. D\'autres estiment qu\'elles ' +
        'perturbent la vie quotidienne et nuisent à l\'économie.',
      vocabulary: [
        { word: 'acquis social', definition: 'social right/entitlement won through struggle', example: 'Les congés payés sont un acquis social.' },
        { word: 'SNCF', definition: 'Société nationale des chemins de fer français (national railway)', example: 'La SNCF gère les TGV.' },
        { word: 'contestation', definition: 'protest, challenge to authority', example: 'La contestation sociale est une tradition française.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Depuis quand le droit de grève est-il inscrit dans la Constitution?',
          options: ['1789', '1936', '1946', '1968'],
          answer: 2,
          explanation: '"Le droit de grève est inscrit dans la Constitution depuis 1946."',
        },
        {
          question: 'Quels secteurs sont les plus touchés par les grèves?',
          options: [
            'L\'agriculture et la pêche',
            'Les transports, l\'éducation et la fonction publique',
            'Le tourisme et la restauration',
            'La banque et l\'assurance',
          ],
          answer: 1,
          explanation: '"Les secteurs les plus touchés sont les transports publics, l\'éducation nationale et la fonction publique."',
        },
        {
          question: 'Quel exemple d\'avancée sociale est mentionné dans le texte?',
          options: ['Le droit de vote', 'Les congés payés', 'Le suffrage universel', 'L\'abolition de l\'esclavage'],
          answer: 1,
          explanation: '"Les congés payés, la semaine de 35 heures, la Sécurité sociale" sont cités comme exemples.',
        },
      ],
    },
  ],

  B2: [
    {
      id: 'b2-laicite',
      title: 'La laïcité en France',
      type: 'article',
      text:
        'La laïcité est un principe fondamental de la République française. La loi de ' +
        'séparation des Églises et de l\'État, votée en 1905, garantit la liberté de ' +
        'conscience et le libre exercice des cultes, tout en établissant que la République ' +
        '"ne reconnaît, ne salarie ni ne subventionne aucun culte."\n\n' +
        'Ce principe, qui semblait faire consensus pendant des décennies, est devenu ' +
        'l\'objet de vifs débats depuis les années 1990. L\'affaire des foulards ' +
        'islamiques, en 1989, a ouvert une polémique qui n\'est toujours pas close. La ' +
        'loi de 2004 a interdit le port de signes religieux ostensibles dans les écoles ' +
        'publiques. Celle de 2010 a prohibé le voile intégral dans l\'espace public.\n\n' +
        'Ses partisans considèrent la laïcité comme un rempart contre le communautarisme ' +
        'et une garantie de l\'égalité entre les citoyens. Ses détracteurs, en revanche, ' +
        'l\'accusent d\'être devenue un instrument de discrimination, visant principalement ' +
        'les musulmans. Le philosophe Abdennour Bidar résume bien la tension: "La laïcité ' +
        'ne doit être ni un mur ni une arme, mais un espace commun de liberté."',
      vocabulary: [
        { word: 'laïcité', definition: 'secularism (French model of separation of religion and state)', example: 'La laïcité est un pilier de la République.' },
        { word: 'ostensibles', definition: 'conspicuous, ostentatious', example: 'Les signes religieux ostensibles sont interdits à l\'école.' },
        { word: 'communautarisme', definition: 'communitarianism (emphasis on community identity over national unity)', example: 'Le communautarisme est souvent critiqué en France.' },
      ],
      comprehensionQuestions: [
        {
          question: 'En quelle année la loi de séparation des Églises et de l\'État a-t-elle été votée?',
          options: ['1789', '1870', '1905', '1946'],
          answer: 2,
          explanation: '"La loi de séparation des Églises et de l\'État, votée en 1905."',
        },
        {
          question: 'Que dit Abdennour Bidar sur la laïcité?',
          options: [
            'Elle doit être un mur',
            'Elle doit être une arme',
            'Elle doit être un espace commun de liberté',
            'Elle doit être abolie',
          ],
          answer: 2,
          explanation: '"La laïcité ne doit être ni un mur ni une arme, mais un espace commun de liberté."',
        },
        {
          question: 'Qu\'a interdit la loi de 2004?',
          options: [
            'Le voile intégral dans l\'espace public',
            'Les signes religieux ostensibles dans les écoles publiques',
            'Toutes les religions',
            'La prière dans les rues',
          ],
          answer: 1,
          explanation: '"La loi de 2004 a interdit le port de signes religieux ostensibles dans les écoles publiques."',
        },
      ],
    },
    {
      id: 'b2-langues-regionales',
      title: 'Les langues régionales de France',
      type: 'article',
      text:
        'La France est souvent perçue comme un pays monolingue où tout le monde parle ' +
        'français. La réalité est pourtant bien plus complexe. Le territoire français ' +
        'abrite une trentaine de langues régionales: le breton, l\'occitan, le basque, ' +
        'le corse, l\'alsacien, le catalan, le créole, le tahitien, pour n\'en citer que ' +
        'quelques-unes.\n\n' +
        'Ces langues ont longtemps été réprimées par l\'État. Depuis la Révolution ' +
        'française, le français standard a été imposé comme unique langue de la République. ' +
        'À l\'école, les enfants qui parlaient leur langue régionale étaient punis. Cette ' +
        'politique a été redoutablement efficace: en un siècle, le nombre de locuteurs ' +
        'de langues régionales a chuté de façon dramatique.\n\n' +
        'Depuis les années 1970, des mouvements de revitalisation tentent d\'inverser la ' +
        'tendance. Les écoles Diwan en Bretagne, les Calandretas en Occitanie et les ' +
        'Ikastolak au Pays basque proposent un enseignement immersif dans la langue ' +
        'régionale. La loi Molac de 2021 a renforcé le cadre juridique de ces langues, ' +
        'même si le Conseil constitutionnel en a censuré certaines dispositions.\n\n' +
        'Le débat reste vif: faut-il protéger les langues régionales au risque de ' +
        'fragmenter l\'unité linguistique nationale, ou leur disparition constitue-t-elle ' +
        'une perte irréparable de patrimoine culturel?',
      vocabulary: [
        { word: 'réprimées', definition: 'repressed, suppressed', example: 'Les langues minoritaires ont été réprimées pendant des siècles.' },
        { word: 'redoutablement', definition: 'formidably, terribly (effectively)', example: 'Cette politique a été redoutablement efficace.' },
        { word: 'patrimoine', definition: 'heritage, cultural legacy', example: 'Le patrimoine linguistique de la France est riche.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Combien de langues régionales la France compte-t-elle environ?',
          options: ['Une dizaine', 'Une vingtaine', 'Une trentaine', 'Une cinquantaine'],
          answer: 2,
          explanation: '"Le territoire français abrite une trentaine de langues régionales."',
        },
        {
          question: 'Quel type d\'école propose un enseignement immersif en breton?',
          options: ['Les Calandretas', 'Les Ikastolak', 'Les écoles Diwan', 'Les écoles Montessori'],
          answer: 2,
          explanation: '"Les écoles Diwan en Bretagne proposent un enseignement immersif dans la langue régionale."',
        },
        {
          question: 'Quel est le dilemme central présenté dans le texte?',
          options: [
            'Faut-il enseigner l\'anglais à l\'école?',
            'Protéger les langues régionales vs. préserver l\'unité linguistique',
            'Le français doit-il être simplifié?',
            'Les langues régionales sont-elles des dialectes?',
          ],
          answer: 1,
          explanation: 'Le texte pose la question: "faut-il protéger les langues régionales au risque de fragmenter l\'unité linguistique nationale?"',
        },
      ],
    },
  ],

  C1: [
    {
      id: 'c1-memoire',
      title: 'La mémoire sélective des nations',
      type: 'article',
      text:
        'Toute nation construit son identité sur un récit qui sélectionne, ordonne et ' +
        'interprète certains événements du passé tout en en reléguant d\'autres à l\'oubli. ' +
        'Ce processus, que l\'historien français Ernest Renan a décrit comme "l\'oubli ' +
        'collectif nécessaire," n\'est pas accidentel: il répond à des besoins politiques ' +
        'et sociaux du présent.\n\n' +
        'Le cas français est particulièrement révélateur. Pendant des décennies, la mémoire ' +
        'officielle de la Seconde Guerre mondiale a privilégié le récit d\'une France ' +
        'unanimement résistante, occultant la collaboration du régime de Vichy. Il a fallu ' +
        'attendre le discours de Jacques Chirac au Vel d\'Hiv en 1995 pour que l\'État ' +
        'reconnaisse officiellement la responsabilité de la France dans la déportation ' +
        'des Juifs.\n\n' +
        'De même, la mémoire coloniale reste un terrain miné. La guerre d\'Algérie, ' +
        'longtemps qualifiée d\'"événements d\'Algérie" par le pouvoir, n\'a été officiellement ' +
        'reconnue comme guerre qu\'en 1999. Les violences policières du 17 octobre 1961 ' +
        'à Paris, où des dizaines d\'Algériens furent tués, n\'ont fait l\'objet d\'une ' +
        'reconnaissance officielle qu\'en 2012.\n\n' +
        'Comme l\'écrivait Renan, "l\'essence d\'une nation est que tous les individus ' +
        'aient beaucoup de choses en commun, et aussi que tous aient oublié bien des ' +
        'choses." La question n\'est pas de savoir s\'il faut se souvenir, mais comment le ' +
        'faire sans que la mémoire ne devienne instrument de vengeance ni l\'oubli complice ' +
        'de l\'impunité.',
      vocabulary: [
        { word: 'reléguer', definition: 'to relegate, to push aside', example: 'La société relègue certains sujets au silence.' },
        { word: 'occulter', definition: 'to conceal, to hide', example: 'On ne peut pas occulter les erreurs du passé.' },
        { word: 'terrain miné', definition: 'minefield (figurative)', example: 'La mémoire coloniale reste un terrain miné.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Qu\'a fait Jacques Chirac en 1995?',
          options: [
            'Il a déclaré la guerre',
            'Il a reconnu la responsabilité de la France dans la déportation des Juifs',
            'Il a fermé le Vel d\'Hiv',
            'Il a créé un musée',
          ],
          answer: 1,
          explanation: 'Le texte dit que Chirac a fait reconnaître "officiellement la responsabilité de la France dans la déportation des Juifs."',
        },
        {
          question: 'Quand la guerre d\'Algérie a-t-elle été officiellement reconnue comme guerre?',
          options: ['1962', '1975', '1995', '1999'],
          answer: 3,
          explanation: '"La guerre d\'Algérie n\'a été officiellement reconnue comme guerre qu\'en 1999."',
        },
        {
          question: 'Quelle est la thèse principale du texte?',
          options: [
            'Il faut tout oublier pour avancer',
            'La mémoire nationale est toujours objective',
            'Toute nation sélectionne sa mémoire selon des besoins politiques actuels',
            'Renan avait tort sur tout',
          ],
          answer: 2,
          explanation: 'Le texte argue que la mémoire nationale "sélectionne, ordonne et interprète certains événements" selon "des besoins politiques et sociaux du présent."',
        },
      ],
    },
    {
      id: 'c1-algorithmes',
      title: 'Les algorithmes et l\'illusion de l\'objectivité',
      type: 'article',
      text:
        'Il existe une croyance largement répandue selon laquelle les algorithmes seraient ' +
        'des outils neutres, incapables de discriminer parce que dépourvus de préjugés ' +
        'humains. Cette supposition, en apparence logique, se révèle profondément ' +
        'trompeuse. Les algorithmes ne surgissent pas du néant: ils sont conçus par des ' +
        'personnes, entraînés sur des données historiques et déployés dans des contextes ' +
        'sociaux concrets. À chacune de ces étapes, les biais humains peuvent s\'infiltrer ' +
        'et, plus inquiétant encore, demeurer dissimulés derrière une apparence de ' +
        'neutralité technique.\n\n' +
        'Un exemple paradigmatique nous est fourni par le système COMPAS, utilisé dans ' +
        'les tribunaux américains pour prédire la probabilité de récidive. Une enquête de ' +
        'ProPublica a révélé que l\'algorithme attribuait systématiquement un risque plus ' +
        'élevé aux accusés afro-américains qu\'aux blancs, même lorsque leurs profils ' +
        'judiciaires étaient comparables. Le biais n\'était pas codé explicitement: il ' +
        'émergeait des données historiques d\'un système judiciaire déjà inégalitaire.\n\n' +
        'Le problème s\'aggrave quand on considère que ces systèmes fonctionnent comme des ' +
        'boîtes noires. À la différence d\'un juge humain, dont le raisonnement peut être ' +
        'contesté en appel, un algorithme d\'apprentissage profond ne peut pas expliquer ' +
        'pourquoi il est parvenu à telle ou telle conclusion. Cette opacité représente un ' +
        'défi fondamental pour l\'État de droit, qui exige que toute décision affectant ' +
        'les droits d\'une personne soit transparente et susceptible de recours.\n\n' +
        'La solution ne consiste pas à rejeter la technologie, mais à exiger ce que la ' +
        'mathématicienne Cathy O\'Neil appelle des "audits algorithmiques": des évaluations ' +
        'indépendantes examinant les données d\'entraînement, les métriques de performance ' +
        'et les impacts différenciés sur les différents groupes de population.',
      vocabulary: [
        { word: 'biais', definition: 'biases', example: 'Les biais inconscients influencent nos décisions.' },
        { word: 'récidive', definition: 'recidivism, reoffending', example: 'Le taux de récidive est préoccupant.' },
        { word: 'opacité', definition: 'opacity, lack of transparency', example: 'L\'opacité du processus suscite la méfiance.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Pourquoi la croyance en la neutralité algorithmique est-elle trompeuse?',
          options: [
            'Parce que les ordinateurs font des erreurs de calcul',
            'Parce que les algorithmes sont conçus par des personnes et entraînés sur des données biaisées',
            'Parce que la technologie est mauvaise',
            'Parce que les programmeurs sont racistes',
          ],
          answer: 1,
          explanation: 'Le texte explique que les algorithmes "sont conçus par des personnes, entraînés sur des données historiques et déployés dans des contextes sociaux concrets."',
        },
        {
          question: 'Quel problème les "boîtes noires" algorithmiques posent-elles pour l\'État de droit?',
          options: [
            'Elles coûtent trop cher',
            'Elles ne peuvent pas expliquer leur raisonnement, empêchant la transparence',
            'Les juges ne savent pas les utiliser',
            'Elles ne fonctionnent pas bien',
          ],
          answer: 1,
          explanation: '"Cette opacité représente un défi fondamental pour l\'État de droit, qui exige que toute décision soit transparente et susceptible de recours."',
        },
        {
          question: 'Quelle solution Cathy O\'Neil propose-t-elle?',
          options: [
            'Interdire l\'intelligence artificielle',
            'N\'utiliser que des juges humains',
            'Des audits algorithmiques indépendants',
            'Publier le code source',
          ],
          answer: 2,
          explanation: 'Le texte propose des "audits algorithmiques: des évaluations indépendantes examinant les données d\'entraînement."',
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

  // -- Profile management --

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.readingStats) {
      p.readingStats = {};  // textId -> { attempts: [{score,total,date}], stability, difficulty, nextReview }
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

  // -- Text catalog --

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
    return TEXTS[level] || TEXTS[Object.keys(TEXTS).find(k => k === level)] || [];
  }

  _findText(textId) {
    for (const lev of Object.keys(TEXTS)) {
      const t = TEXTS[lev].find(t => t.id === textId);
      if (t) return { text: t, level: lev };
    }
    return null;
  }

  // -- Lesson generation --

  generateLesson(studentId) {
    const p = this.getProfile(studentId);
    if (!p.level) throw new Error('No level set. Use set-level first.');
    const texts = this._textsForLevel(p.level);
    if (!texts.length) throw new Error(`No texts available for level ${p.level}.`);

    // Prefer texts not yet attempted, or due for review
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
      instructions: 'Read the text carefully. Then answer the comprehension questions using the option number (0-3).',
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

  // -- Answer checking --

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

  // -- Assessment recording --

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

    // FSRS update
    const grade = s === t ? 4 : s >= t * 0.7 ? 3 : s >= t * 0.5 ? 2 : 1;
    st.stability = core.fsrsUpdateStability(st.stability, st.difficulty, grade);
    st.difficulty = core.fsrsUpdateDifficulty(st.difficulty, grade);
    st.nextReview = (() => {
      const days = core.fsrsNextReview(st.stability);
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    })();

    // Also record in the standard assessments array
    if (!p.assessments) p.assessments = [];
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

  // -- Progress & reports --

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

    // Collect texts due for review
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

    // Also suggest unattempted texts at current level
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
