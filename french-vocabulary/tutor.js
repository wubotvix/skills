// French Vocabulary Tutor — complete implementation with embedded data
// Usage: node tutor.js <command> [args...]
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'french-vocabulary';
const MAX_NEW_PER_SESSION = 7;

// ─── Embedded Word Banks by CEFR Level ───────────────────────────────────────

const WORD_BANKS = {
  A1: [
    // Greetings
    { word: 'bonjour', article: null, category: 'greetings', definition: 'hello / good morning',
      exampleSentence: 'Bonjour, comment allez-vous ?', collocations: ['dire bonjour', 'bonjour à tous'], falseFriends: null },
    { word: 'au revoir', article: null, category: 'greetings', definition: 'goodbye',
      exampleSentence: 'Au revoir, à demain !', collocations: ['dire au revoir'], falseFriends: null },
    { word: 'merci', article: null, category: 'greetings', definition: 'thank you',
      exampleSentence: 'Merci beaucoup pour votre aide.', collocations: ['merci beaucoup', 'merci bien', 'Dieu merci'], falseFriends: null },
    { word: 's\'il vous plaît', article: null, category: 'greetings', definition: 'please (formal)',
      exampleSentence: 'Un café, s\'il vous plaît.', collocations: ['s\'il te plaît (informal)'], falseFriends: null },
    // Food
    { word: 'eau', article: "l'", category: 'food', definition: 'water',
      exampleSentence: "L'eau est très froide.", collocations: ['eau minérale', 'verre d\'eau', 'eau gazeuse'], falseFriends: null },
    { word: 'pain', article: 'le', category: 'food', definition: 'bread',
      exampleSentence: 'J\'achète le pain à la boulangerie.', collocations: ['pain de campagne', 'pain complet', 'tranche de pain'], falseFriends: null },
    { word: 'lait', article: 'le', category: 'food', definition: 'milk',
      exampleSentence: 'Je prends le lait avec le petit-déjeuner.', collocations: ['lait entier', 'lait écrémé', 'café au lait'], falseFriends: null },
    { word: 'pomme', article: 'la', category: 'food', definition: 'apple',
      exampleSentence: 'La pomme rouge est très sucrée.', collocations: ['jus de pomme', 'tarte aux pommes', 'pomme de terre'], falseFriends: null },
    // Family
    { word: 'mère', article: 'la', category: 'family', definition: 'mother',
      exampleSentence: 'Ma mère cuisine très bien.', collocations: ['langue maternelle', 'fête des mères'], falseFriends: null },
    { word: 'père', article: 'le', category: 'family', definition: 'father',
      exampleSentence: 'Mon père travaille à l\'hôpital.', collocations: ['père de famille', 'fête des pères'], falseFriends: null },
    { word: 'frère', article: 'le', category: 'family', definition: 'brother',
      exampleSentence: 'Mon frère aîné s\'appelle Pierre.', collocations: ['frère cadet', 'frère jumeau'], falseFriends: null },
    { word: 'ami', article: "l'", category: 'people', definition: 'friend',
      exampleSentence: 'Mon ami habite près de chez moi.', collocations: ['meilleur ami', 'ami intime', 'se faire des amis'], falseFriends: null },
    // Everyday objects
    { word: 'maison', article: 'la', category: 'everyday', definition: 'house',
      exampleSentence: 'La maison a un grand jardin.', collocations: ['à la maison', 'maison de campagne', 'femme/homme au foyer'], falseFriends: null },
    { word: 'livre', article: 'le', category: 'everyday', definition: 'book',
      exampleSentence: 'Je lis un livre chaque semaine.', collocations: ['livre de poche', 'livre scolaire'], falseFriends: { en: 'Also means "pound" (weight/currency)' } },
    { word: 'table', article: 'la', category: 'everyday', definition: 'table',
      exampleSentence: 'La table de la salle à manger est en bois.', collocations: ['mettre la table', 'table ronde', 'table de nuit'], falseFriends: null },
    { word: 'rue', article: 'la', category: 'everyday', definition: 'street',
      exampleSentence: 'La rue est pleine de monde.', collocations: ['rue principale', 'traverser la rue', 'dans la rue'], falseFriends: null },
    // Time
    { word: 'jour', article: 'le', category: 'time', definition: 'day',
      exampleSentence: "Aujourd'hui est un très beau jour.", collocations: ['tous les jours', 'jour férié', 'bon jour'], falseFriends: null },
    { word: 'nuit', article: 'la', category: 'time', definition: 'night',
      exampleSentence: 'La nuit est très calme ici.', collocations: ['bonne nuit', 'la nuit dernière', 'de nuit'], falseFriends: null },
    { word: "aujourd'hui", article: null, category: 'time', definition: 'today',
      exampleSentence: "Aujourd'hui, on va au parc.", collocations: ["d'aujourd'hui", "aujourd'hui même"], falseFriends: null },
    { word: 'grand', article: null, category: 'adjectives', definition: 'big / tall',
      exampleSentence: 'Cette ville est très grande.', collocations: ['en grand', 'grand-mère', 'grand-père'], falseFriends: null },
  ],

  A2: [
    // Travel
    { word: 'bagage', article: 'le', category: 'travel', definition: 'luggage',
      exampleSentence: 'Mon bagage pèse trop lourd.', collocations: ['bagage à main', 'enregistrer les bagages', 'récupérer les bagages'], falseFriends: null },
    { word: 'billet', article: 'le', category: 'travel', definition: 'ticket',
      exampleSentence: 'Je dois acheter un billet de train.', collocations: ['billet aller simple', 'billet aller-retour', 'prendre un billet'], falseFriends: null },
    { word: 'gare', article: 'la', category: 'travel', definition: 'train station',
      exampleSentence: 'La gare est loin du centre-ville.', collocations: ['gare routière', 'gare SNCF'], falseFriends: null },
    { word: 'valise', article: 'la', category: 'travel', definition: 'suitcase',
      exampleSentence: 'Je vais faire ma valise ce soir.', collocations: ['faire sa valise', 'valise à roulettes'], falseFriends: null },
    // Food (expanded)
    { word: 'viande', article: 'la', category: 'food', definition: 'meat',
      exampleSentence: 'La viande de bœuf est ma préférée.', collocations: ['viande rouge', 'viande hachée', 'viande grillée'], falseFriends: null },
    { word: 'poisson', article: 'le', category: 'food', definition: 'fish',
      exampleSentence: 'Le poisson frais est plus savoureux.', collocations: ['poisson grillé', 'poisson pané'], falseFriends: { en: 'Not "poison" (which is poison in French too!)' } },
    { word: 'addition', article: "l'", category: 'food', definition: 'bill / check (at restaurant)',
      exampleSentence: "L'addition, s'il vous plaît.", collocations: ['demander l\'addition'], falseFriends: { en: '"addition" in math = "addition" too, but restaurant meaning is specific' } },
    { word: 'pourboire', article: 'le', category: 'food', definition: 'tip (gratuity)',
      exampleSentence: 'Nous avons laissé un bon pourboire.', collocations: ['laisser un pourboire', 'donner un pourboire'], falseFriends: null },
    // Shopping
    { word: 'magasin', article: 'le', category: 'shopping', definition: 'store / shop',
      exampleSentence: 'Le magasin ferme à neuf heures.', collocations: ['grand magasin', 'magasin de vêtements', 'en magasin'], falseFriends: { en: 'Not "magazine" (which is "revue/magazine")' } },
    { word: 'prix', article: 'le', category: 'shopping', definition: 'price',
      exampleSentence: 'Le prix des fruits a augmenté.', collocations: ['bon prix', 'prix fixe', 'à moitié prix'], falseFriends: null },
    { word: 'argent', article: "l'", category: 'shopping', definition: 'money / silver',
      exampleSentence: "Je n'ai pas assez d'argent.", collocations: ['gagner de l\'argent', 'argent de poche', 'argent liquide'], falseFriends: null },
    { word: 'bon marché', article: null, category: 'shopping', definition: 'cheap / inexpensive',
      exampleSentence: 'Ce restaurant est très bon marché.', collocations: ['pas cher', 'meilleur marché'], falseFriends: null },
    // Weather
    { word: 'pluie', article: 'la', category: 'weather', definition: 'rain',
      exampleSentence: 'La pluie ne s\'arrête pas depuis hier.', collocations: ['pluie torrentielle', 'jour de pluie', 'sous la pluie'], falseFriends: null },
    { word: 'soleil', article: 'le', category: 'weather', definition: 'sun',
      exampleSentence: "Aujourd'hui il y a beaucoup de soleil.", collocations: ['coup de soleil', 'lunettes de soleil', 'coucher de soleil'], falseFriends: null },
    { word: 'froid', article: 'le', category: 'weather', definition: 'cold',
      exampleSentence: 'En hiver il fait très froid.', collocations: ['avoir froid', 'il fait froid', 'froid polaire'], falseFriends: null },
    // Health
    { word: 'tête', article: 'la', category: 'health', definition: 'head',
      exampleSentence: "J'ai mal à la tête.", collocations: ['mal de tête', 'en tête', 'tête-à-tête'], falseFriends: null },
    { word: 'médecin', article: 'le', category: 'health', definition: 'doctor',
      exampleSentence: "J'ai rendez-vous chez le médecin demain.", collocations: ['aller chez le médecin', 'médecin traitant', 'médecin généraliste'], falseFriends: null },
    { word: 'malade', article: null, category: 'health', definition: 'sick / ill',
      exampleSentence: 'Mon fils est malade aujourd\'hui.', collocations: ['tomber malade', 'être malade'], falseFriends: null },
    { word: 'ordonnance', article: "l'", category: 'health', definition: 'prescription',
      exampleSentence: 'Le médecin m\'a donné une ordonnance.', collocations: ['ordonnance médicale', 'sur ordonnance'], falseFriends: null },
    { word: 'douleur', article: 'la', category: 'health', definition: 'pain / ache',
      exampleSentence: "J'ai une douleur forte dans le dos.", collocations: ['douleur de tête', 'douleur d\'estomac', 'soulager la douleur'], falseFriends: null },
  ],

  B1: [
    // Work
    { word: 'entreprise', article: "l'", category: 'work', definition: 'company / business',
      exampleSentence: 'Je travaille dans une entreprise de technologie.', collocations: ['entreprise privée', 'créer une entreprise', 'entreprise familiale'], falseFriends: null },
    { word: 'réunion', article: 'la', category: 'work', definition: 'meeting',
      exampleSentence: 'La réunion commence à dix heures.', collocations: ['avoir une réunion', 'salle de réunion', 'convoquer une réunion'], falseFriends: null },
    { word: 'salaire', article: 'le', category: 'work', definition: 'salary / wages',
      exampleSentence: 'On va m\'augmenter le salaire cette année.', collocations: ['salaire fixe', 'toucher son salaire', 'salaire minimum (SMIC)'], falseFriends: null },
    { word: 'patron', article: 'le', category: 'work', definition: 'boss',
      exampleSentence: 'Mon patron est très exigeant mais juste.', collocations: ['patron d\'entreprise', 'patronne'], falseFriends: null },
    { word: 'candidature', article: 'la', category: 'work', definition: 'application (job)',
      exampleSentence: "J'ai envoyé ma candidature hier.", collocations: ['lettre de candidature', 'poser sa candidature', 'déposer une candidature'], falseFriends: null },
    // Emotions
    { word: 'espoir', article: "l'", category: 'emotions', definition: 'hope',
      exampleSentence: "J'ai l'espoir que tout ira bien.", collocations: ['perdre espoir', 'avoir l\'espoir', 'lueur d\'espoir'], falseFriends: null },
    { word: 'fier', article: null, category: 'emotions', definition: 'proud',
      exampleSentence: 'Je suis très fier de ma fille.', collocations: ['être fier de', 'se sentir fier'], falseFriends: null },
    { word: 'inquiet', article: null, category: 'emotions', definition: 'worried',
      exampleSentence: "Je suis inquiet pour l'examen.", collocations: ['être inquiet de/pour', 's\'inquiéter'], falseFriends: null },
    { word: 'honte', article: 'la', category: 'emotions', definition: 'shame / embarrassment',
      exampleSentence: "J'ai honte de parler en public.", collocations: ['avoir honte', 'faire honte', 'sans honte'], falseFriends: null },
    // False friends cluster
    { word: 'actuellement', article: null, category: 'abstract', definition: 'currently / at present',
      exampleSentence: 'Actuellement, je vis à Paris.', collocations: ['actuellement en cours'],
      falseFriends: { en: '"actually" is "en fait" in French' } },
    { word: 'librairie', article: 'la', category: 'abstract', definition: 'bookshop',
      exampleSentence: 'J\'ai acheté ce livre à la librairie.', collocations: ['librairie en ligne'],
      falseFriends: { en: '"library" is "bibliothèque" in French' } },
    { word: 'blesser', article: null, category: 'abstract', definition: 'to injure / wound',
      exampleSentence: 'Il s\'est blessé en jouant au football.', collocations: ['se blesser', 'blesser quelqu\'un'],
      falseFriends: { en: '"to bless" is "bénir" in French' } },
    { word: 'assister', article: null, category: 'abstract', definition: 'to attend / be present at',
      exampleSentence: 'J\'ai assisté à la conférence.', collocations: ['assister à'],
      falseFriends: { en: '"to assist" (help) is "aider" in French' } },
    // Education
    { word: 'matière', article: 'la', category: 'education', definition: 'school subject / material',
      exampleSentence: 'Les maths sont ma matière préférée.', collocations: ['matière première', 'en matière de'], falseFriends: null },
    { word: 'cours', article: 'le', category: 'education', definition: 'class / course / lesson',
      exampleSentence: 'Je prends des cours de français.', collocations: ['en cours', 'cours particulier', 'suivre un cours'], falseFriends: null },
    { word: 'bourse', article: 'la', category: 'education', definition: 'scholarship / stock exchange',
      exampleSentence: "J'ai obtenu une bourse pour étudier à Lyon.", collocations: ['bourse d\'études', 'bourse de valeurs'], falseFriends: { en: '"purse" is "sac à main"' } },
    // Daily life
    { word: 'habitude', article: "l'", category: 'daily', definition: 'habit / custom',
      exampleSentence: "J'ai l'habitude de me promener après le dîner.", collocations: ['avoir l\'habitude de', 'comme d\'habitude', 'd\'habitude'], falseFriends: null },
    { word: 'déménager', article: null, category: 'daily', definition: 'to move (change residence)',
      exampleSentence: 'Nous avons déménagé à Lyon le mois dernier.', collocations: ['déménager de', 'entreprise de déménagement'], falseFriends: null },
    { word: 'louer', article: null, category: 'daily', definition: 'to rent',
      exampleSentence: 'Je veux louer un appartement dans le centre.', collocations: ['louer un appartement', 'louer une voiture', 'à louer'], falseFriends: null },
  ],

  B2: [
    // Work (advanced)
    { word: 'licenciement', article: 'le', category: 'work', definition: 'dismissal / layoff',
      exampleSentence: 'Le licenciement a été complètement inattendu.', collocations: ['licenciement abusif', 'lettre de licenciement', 'licenciement économique'], falseFriends: null },
    { word: 'promotion', article: 'la', category: 'work', definition: 'promotion (at work)',
      exampleSentence: 'Après cinq ans, il a obtenu une promotion.', collocations: ['obtenir une promotion', 'promotion interne'], falseFriends: null },
    { word: 'rendement', article: 'le', category: 'work', definition: 'performance / yield',
      exampleSentence: 'Le rendement de l\'équipe s\'est beaucoup amélioré.', collocations: ['haut rendement', 'améliorer le rendement'], falseFriends: null },
    { word: 'entrepreneur', article: "l'", category: 'work', definition: 'entrepreneur',
      exampleSentence: 'C\'est un entrepreneur avec beaucoup de vision.', collocations: ['esprit d\'entrepreneur', 'jeune entrepreneur'], falseFriends: null },
    // Society
    { word: 'inégalité', article: "l'", category: 'society', definition: 'inequality',
      exampleSentence: 'L\'inégalité sociale reste un problème majeur.', collocations: ['inégalité des sexes', 'lutter contre l\'inégalité'], falseFriends: null },
    { word: 'citoyenneté', article: 'la', category: 'society', definition: 'citizenship',
      exampleSentence: 'Il a demandé la citoyenneté française.', collocations: ['obtenir la citoyenneté', 'double citoyenneté'], falseFriends: null },
    { word: 'manifestation', article: 'la', category: 'society', definition: 'demonstration / protest',
      exampleSentence: 'Il y a eu une manifestation pacifique sur la place.', collocations: ['organiser une manifestation', 'manif (informal)'], falseFriends: null },
    { word: 'engagement', article: "l'", category: 'society', definition: 'commitment / engagement',
      exampleSentence: "L'engagement envers l'environnement est fondamental.", collocations: ['prendre un engagement', 'sans engagement', 'engagement social'], falseFriends: null },
    // Abstract
    { word: 'nuance', article: 'la', category: 'abstract', definition: 'nuance / shade',
      exampleSentence: 'Il y a une nuance importante dans cette phrase.', collocations: ['avec nuance', 'sans nuance', 'nuance de sens'], falseFriends: null },
    { word: 'soulever', article: null, category: 'abstract', definition: 'to raise (a question) / to lift',
      exampleSentence: 'Je veux soulever une question importante.', collocations: ['soulever un problème', 'soulever une question'], falseFriends: null },
    { word: 'indispensable', article: null, category: 'abstract', definition: 'essential / indispensable',
      exampleSentence: 'Le dictionnaire est indispensable pour ce cours.', collocations: ['être indispensable', 'se rendre indispensable'], falseFriends: null },
    { word: 'profiter', article: null, category: 'abstract', definition: 'to take advantage of / enjoy',
      exampleSentence: 'Il faut profiter du beau temps.', collocations: ['profiter de l\'occasion', 'profiter du temps', 'en profiter'], falseFriends: null },
    // False friends (B2)
    { word: 'excité', article: null, category: 'emotions', definition: 'aroused / agitated (NOT excited)',
      exampleSentence: 'Les enfants sont très excités avant Noël.', collocations: ['être excité'],
      falseFriends: { en: '"excited" is better translated as "enthousiaste" or "impatient"' } },
    { word: 'préservatif', article: 'le', category: 'health', definition: 'condom',
      exampleSentence: 'Acheter des préservatifs à la pharmacie.', collocations: [],
      falseFriends: { en: '"preservative" (food) is "conservateur"' } },
    { word: 'coin', article: 'le', category: 'everyday', definition: 'corner / area',
      exampleSentence: 'Il habite dans le coin.', collocations: ['du coin', 'au coin de la rue', 'un coin tranquille'],
      falseFriends: { en: '"coin" (money) is "pièce de monnaie"' } },
    // Environment
    { word: 'environnement', article: "l'", category: 'environment', definition: 'environment',
      exampleSentence: 'Nous devons protéger l\'environnement.', collocations: ['protéger l\'environnement', 'respect de l\'environnement'], falseFriends: null },
    { word: 'durable', article: null, category: 'environment', definition: 'sustainable / lasting',
      exampleSentence: 'Nous avons besoin d\'un développement plus durable.', collocations: ['développement durable', 'énergie durable'], falseFriends: null },
    { word: 'ressource', article: 'la', category: 'environment', definition: 'resource',
      exampleSentence: 'Les ressources naturelles sont limitées.', collocations: ['ressources naturelles', 'ressources humaines', 'ressource renouvelable'], falseFriends: null },
    { word: 'empreinte', article: "l'", category: 'environment', definition: 'footprint / imprint',
      exampleSentence: 'Nous devons réduire notre empreinte carbone.', collocations: ['empreinte carbone', 'empreinte écologique', 'laisser une empreinte'], falseFriends: null },
  ],

  C1: [
    // Academic
    { word: 'domaine', article: 'le', category: 'academic', definition: 'field / domain / area',
      exampleSentence: 'Dans le domaine de la recherche, les résultats sont prometteurs.', collocations: ['dans le domaine de', 'domaine professionnel'], falseFriends: null },
    { word: 'aborder', article: null, category: 'academic', definition: 'to address / to tackle / to approach',
      exampleSentence: 'Il est nécessaire d\'aborder ce sujet avec sérieux.', collocations: ['aborder un sujet', 'aborder un problème'], falseFriends: null },
    { word: 'exercer', article: null, category: 'academic', definition: 'to practice / exercise (a profession)',
      exampleSentence: 'Il exerce un rôle clé dans l\'entreprise.', collocations: ['exercer une profession', 'exercer une influence', 'exercer un droit'], falseFriends: null },
    { word: 'transmettre', article: null, category: 'academic', definition: 'to transmit / convey / pass on',
      exampleSentence: 'Il est difficile de transmettre cette idée dans une autre langue.', collocations: ['transmettre un message', 'transmettre un savoir'], falseFriends: null },
    { word: 'englober', article: null, category: 'academic', definition: 'to encompass / to include',
      exampleSentence: "L'étude englobe une période de dix ans.", collocations: ['englober un sujet', 'englober plusieurs aspects'], falseFriends: null },
    // Connectors
    { word: 'néanmoins', article: null, category: 'connectors', definition: 'nevertheless / however',
      exampleSentence: 'Le plan est risqué ; néanmoins, il vaut la peine d\'essayer.', collocations: [], falseFriends: null },
    { word: 'malgré', article: null, category: 'connectors', definition: 'despite / in spite of',
      exampleSentence: 'Malgré les difficultés, il a continué.', collocations: ['malgré tout', 'malgré le fait que'], falseFriends: null },
    { word: 'en revanche', article: null, category: 'connectors', definition: 'on the other hand / however',
      exampleSentence: 'Il préfère le cinéma ; elle, en revanche, préfère le théâtre.', collocations: [], falseFriends: null },
    // Idiomatic
    { word: 'compter sur', article: null, category: 'idiomatic', definition: 'to count on / rely on',
      exampleSentence: 'Tu peux compter sur moi.', collocations: ['compter sur quelqu\'un'], falseFriends: null },
    { word: 'tenir pour acquis', article: null, category: 'idiomatic', definition: 'to take for granted',
      exampleSentence: 'Ne tiens pas pour acquis que tout ira bien.', collocations: [], falseFriends: null },
    { word: 'prendre en charge', article: null, category: 'idiomatic', definition: 'to take charge of / to cover (costs)',
      exampleSentence: 'Elle a pris en charge la situation immédiatement.', collocations: ['prise en charge'], falseFriends: null },
    // Abstract
    { word: 'enjeu', article: "l'", category: 'abstract', definition: 'stake / issue / challenge',
      exampleSentence: "L'enjeu de cette élection est considérable.", collocations: ['enjeu majeur', 'enjeux sociaux', 'enjeu de taille'], falseFriends: null },
    { word: 'progressif', article: null, category: 'abstract', definition: 'gradual / progressive',
      exampleSentence: 'On observe un changement progressif des mentalités.', collocations: ['de manière progressive', 'impôt progressif'], falseFriends: null },
    { word: 'dissocier', article: null, category: 'abstract', definition: 'to dissociate / separate',
      exampleSentence: "Il est impossible de dissocier l'économie de la politique.", collocations: ['se dissocier de'], falseFriends: null },
    { word: 'incontournable', article: null, category: 'abstract', definition: 'unavoidable / essential',
      exampleSentence: 'La réforme du système est une tâche incontournable.', collocations: ['devenir incontournable'], falseFriends: null },
    // Formal
    { word: 'effectuer', article: null, category: 'formal', definition: 'to carry out / perform',
      exampleSentence: 'Je dois effectuer les démarches pour mon visa.', collocations: ['effectuer un trajet', 'effectuer une démarche', 'effectuer un paiement'], falseFriends: null },
    { word: 'en vigueur', article: null, category: 'formal', definition: 'in force / current / valid',
      exampleSentence: 'La loi en vigueur interdit cette pratique.', collocations: ['législation en vigueur', 'entrer en vigueur'], falseFriends: null },
    { word: 'statuer', article: null, category: 'formal', definition: 'to rule / to make a ruling',
      exampleSentence: 'Le tribunal a statué en faveur du plaignant.', collocations: ['statuer sur'], falseFriends: null },
    { word: 'résilier', article: null, category: 'formal', definition: 'to terminate / cancel (a contract)',
      exampleSentence: "L'entreprise a décidé de résilier le contrat.", collocations: ['résilier un contrat', 'résilier un abonnement'], falseFriends: null },
  ],

  C2: [
    // Literary
    { word: 'il sied', article: null, category: 'literary', definition: 'it is fitting / it befits (formal/archaic)',
      exampleSentence: 'Il sied d\'agir avec prudence.', collocations: ['il sied de', 'comme il sied'], falseFriends: null },
    { word: 'advenir', article: null, category: 'literary', definition: 'to happen / come about (literary)',
      exampleSentence: 'Les événements qui advinrent cet été-là changèrent tout.', collocations: ['advienne que pourra', 'quoi qu\'il advienne'], falseFriends: null },
    { word: 'clivage', article: 'le', category: 'literary', definition: 'division / rift / cleavage',
      exampleSentence: 'Le clivage entre les deux camps est profond.', collocations: ['clivage politique', 'clivage social'], falseFriends: null },
    { word: 'entrevoir', article: null, category: 'literary', definition: 'to glimpse / to catch sight of',
      exampleSentence: 'On peut entrevoir un changement à l\'horizon.', collocations: ['entrevoir une solution', 'laisser entrevoir'], falseFriends: null },
    // Colloquial / register mastery
    { word: 'bosser', article: null, category: 'colloquial', definition: 'to work (informal)',
      exampleSentence: "J'ai bossé toute la journée sans m'arrêter.", collocations: ['bosser dur', 'aller bosser'], falseFriends: null },
    { word: 'kiffer', article: null, category: 'colloquial', definition: 'to love / enjoy (slang)',
      exampleSentence: 'Je kiffe trop ce film !', collocations: ['kiffer grave', 'je kiffe'], falseFriends: null },
    { word: 'galère', article: 'la', category: 'colloquial', definition: 'hassle / tough situation (slang)',
      exampleSentence: "C'est la galère pour trouver un appartement.", collocations: ['quelle galère', 'galérer'], falseFriends: null },
    // Idiomatic
    { word: 'ne pas être dans son assiette', article: null, category: 'idiomatic', definition: 'to feel under the weather',
      exampleSentence: 'Je ne suis pas dans mon assiette aujourd\'hui.', collocations: [], falseFriends: null },
    { word: 'à la lettre', article: null, category: 'idiomatic', definition: 'to the letter / literally',
      exampleSentence: 'Il suit les règles à la lettre.', collocations: ['prendre à la lettre', 'suivre à la lettre'], falseFriends: null },
    { word: 'mettre le doigt dessus', article: null, category: 'idiomatic', definition: 'to put one\'s finger on it',
      exampleSentence: 'Tu as mis le doigt dessus avec cette remarque.', collocations: [], falseFriends: null },
    // Academic
    { word: 'éluder', article: null, category: 'academic', definition: 'to evade / sidestep / dodge',
      exampleSentence: 'On ne peut pas éluder les responsabilités éthiques.', collocations: ['éluder une question', 'éluder un problème'], falseFriends: null },
    { word: 'sous-jacent', article: null, category: 'academic', definition: 'underlying',
      exampleSentence: 'Les causes sous-jacentes au conflit sont complexes.', collocations: ['problème sous-jacent', 'idée sous-jacente'], falseFriends: null },
    { word: 'enchaîner', article: null, category: 'academic', definition: 'to link together / to chain / to follow up',
      exampleSentence: 'Plusieurs erreurs se sont enchaînées, provoquant la crise.', collocations: ['enchaîner les idées', 'enchaîner les événements'], falseFriends: null },
    { word: 'élucider', article: null, category: 'academic', definition: 'to elucidate / to solve',
      exampleSentence: 'Ils ont tenté d\'élucider les causes de l\'accident.', collocations: ['élucider un mystère', 'élucider une affaire'], falseFriends: null },
    { word: 'avancer', article: null, category: 'academic', definition: 'to put forward / advance (an argument)',
      exampleSentence: 'Il a avancé des arguments très convaincants.', collocations: ['avancer un argument', 'avancer une hypothèse'], falseFriends: null },
    // Verlan / register
    { word: 'meuf', article: 'la', category: 'colloquial', definition: 'woman/girl (verlan of femme)',
      exampleSentence: 'C\'est une meuf sympa.', collocations: [],
      falseFriends: { note: 'Verlan: femme → meuf. Informal register only.' } },
    { word: 'relou', article: null, category: 'colloquial', definition: 'annoying (verlan of lourd)',
      exampleSentence: 'Ce mec est trop relou.', collocations: [],
      falseFriends: { note: 'Verlan: lourd → relou. Very informal.' } },
    { word: 'ouf', article: null, category: 'colloquial', definition: 'crazy (verlan of fou)',
      exampleSentence: 'C\'est ouf ce truc !', collocations: [],
      falseFriends: { note: 'Verlan: fou → ouf. Youth slang.' } },
    { word: 'la Francophonie', article: null, category: 'regional', definition: 'the French-speaking world',
      exampleSentence: 'La Francophonie compte plus de 300 millions de locuteurs.', collocations: ['espace francophone', 'Organisation internationale de la Francophonie'],
      falseFriends: null },
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
      message: correctCount === exercise.pairs.length ? 'Parfait !' : `${correctCount}/${exercise.pairs.length} correct.`,
    };
  }

  const expected = normalise(exercise.answer);
  const given = normalise(userAnswer);

  if (given === expected) {
    return { correct: true, message: 'Correct ! Très bien.' };
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
