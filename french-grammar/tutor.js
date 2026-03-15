#!/usr/bin/env node
// French Grammar Tutor — discovery-based grammar teaching with FSRS spaced repetition
'use strict';

const core = require('../_lib/core');
const { CEFR, MASTERY_THRESHOLD, DEFAULT_RETENTION,
        dataDir, loadProfile, saveProfile, listProfiles,
        calcMastery, masteryLabel,
        fsrsRetention, fsrsNextReview, fsrsUpdateStability, fsrsUpdateDifficulty,
        shuffle, pick, norm, today, runCLI } = core;

const SKILL_NAME = 'french-grammar';

// ─── Embedded Grammar Data ──────────────────────────────────────────────────

const TOPICS = [
  // ── A1 ──
  { id: 'present-regular', name: 'Present Tense (regular)', level: 'A1', category: 'verbs',
    scoba: `Regular present tense endings:
  -ER verbs (parler): -e, -es, -e, -ons, -ez, -ent
  -IR verbs (finir):   -is, -is, -it, -issons, -issez, -issent
  -RE verbs (vendre):  -s, -s, -, -ons, -ez, -ent`,
    exercises: [
      { type: 'fill', prompt: 'Je ___ (parler) français.', answer: 'parle', hint: '-ER: je → -e' },
      { type: 'fill', prompt: 'Ils ___ (finir) le travail.', answer: 'finissent', hint: '-IR: ils → -issent' },
      { type: 'fill', prompt: 'Nous ___ (vendre) notre maison.', answer: 'vendons', hint: '-RE: nous → -ons' },
      { type: 'fill', prompt: 'Tu ___ (regarder) la télévision.', answer: 'regardes', hint: '-ER: tu → -es' },
      { type: 'error', prompt: 'Elle parle bien et mangent beaucoup.', answer: 'Elle parle bien et mange beaucoup.', hint: 'Subject is elle (3rd sing) for both verbs' },
      { type: 'transform', prompt: 'Change subject to nous: "Je choisis un livre."', answer: 'Nous choisissons un livre.', hint: '-IR: nous → -issons' },
    ] },
  { id: 'gender-articles', name: 'Gender & Articles', level: 'A1', category: 'nouns',
    scoba: `Masculine: le (the), un (a) — often ending in consonant or -ment, -age, -eau
Feminine: la (the), une (a) — often ending in -tion, -sion, -ité, -ure, -ette
L' before vowel/mute h: l'homme, l'eau
Plural: les, des — add -s (usually silent)`,
    exercises: [
      { type: 'fill', prompt: '___ (le/la) maison est grande.', answer: 'la', hint: 'maison is feminine' },
      { type: 'fill', prompt: '___ (le/la) problème est difficile.', answer: 'le', hint: 'problème is masculine (ends in -ème)' },
      { type: 'fill', prompt: "J'ai ___ (un/une) livre nouveau.", answer: 'un', hint: 'livre is masculine' },
      { type: 'error', prompt: 'Le situation est compliquée.', answer: 'La situation est compliquée.', hint: '-tion ending → feminine' },
      { type: 'fill', prompt: '___ (Les/Des) enfants jouent dehors.', answer: 'Les', hint: 'Specific children → les' },
    ] },
  { id: 'partitive-articles', name: 'Partitive Articles', level: 'A1', category: 'nouns',
    scoba: `Partitive articles for uncountable quantities:
  du (masc.) — Je mange du pain.
  de la (fem.) — Je bois de la soupe.
  de l' (before vowel) — Je bois de l'eau.
  des (plural) — J'achète des pommes.
After negation: de/d' — Je ne mange pas de pain.`,
    exercises: [
      { type: 'fill', prompt: 'Je mange ___ (du/de la/de l\') pain.', answer: 'du', hint: 'pain is masculine → du' },
      { type: 'fill', prompt: 'Elle boit ___ (du/de la/de l\') eau.', answer: "de l'", hint: 'eau starts with vowel → de l\'' },
      { type: 'fill', prompt: 'Je ne mange pas ___ viande.', answer: 'de', hint: 'After negation → de' },
      { type: 'error', prompt: 'Je bois de lait.', answer: 'Je bois du lait.', hint: 'Affirmative → du (masc.)' },
    ] },
  { id: 'adjective-agreement', name: 'Adjective Agreement', level: 'A1', category: 'nouns',
    scoba: `Adjectives must match the noun in gender and number:
  grand / grande / grands / grandes
  intelligent / intelligente / intelligents / intelligentes
Most adjectives follow the noun: "la maison blanche"
BANGS adjectives precede: Beau, Âge, Nombre, Gentil/Grand, Petit/Sort`,
    exercises: [
      { type: 'fill', prompt: 'Les filles sont très ___ (grand).', answer: 'grandes', hint: 'Feminine plural → -es' },
      { type: 'fill', prompt: 'La voiture est ___ (rouge).', answer: 'rouge', hint: 'No change (ends in -e already)' },
      { type: 'error', prompt: 'Les fleurs sont beau.', answer: 'Les fleurs sont belles.', hint: 'beau → belles (fem. pl.)' },
      { type: 'transform', prompt: 'Make plural: "Le chat noir."', answer: 'Les chats noirs.', hint: 'Both noun and adjective become plural' },
    ] },
  { id: 'aller-infinitive', name: 'Aller + Infinitive (near future)', level: 'A1', category: 'verbs',
    scoba: `Near future: aller (conjugated) + infinitive
  Je vais étudier. (I'm going to study.)
  Ils vont manger. (They're going to eat.)`,
    exercises: [
      { type: 'fill', prompt: 'Demain nous ___ (aller / voyager) à Lyon.', answer: 'allons voyager', hint: 'nous → allons + infinitive' },
      { type: 'fill', prompt: 'Elle ___ (aller / acheter) un nouveau sac.', answer: 'va acheter', hint: 'elle → va + infinitive' },
      { type: 'error', prompt: 'Je aller étudier demain.', answer: 'Je vais étudier demain.', hint: 'aller must be conjugated: je → vais' },
    ] },
  { id: 'il-y-a', name: 'Il y a', level: 'A1', category: 'verbs',
    scoba: `Il y a = there is / there are (existence, no agreement)
  "Il y a un chat dans le jardin."
  "Il y a des livres sur la table."
  Il y a + duration = ago: "Il y a deux ans" (two years ago)`,
    exercises: [
      { type: 'fill', prompt: '___ un restaurant près d\'ici.', answer: 'Il y a', hint: 'Existence → il y a' },
      { type: 'fill', prompt: 'Je suis arrivé ___ trois jours.', answer: 'il y a', hint: 'Duration ago → il y a' },
      { type: 'error', prompt: 'Il y a beaucoup des gens.', answer: 'Il y a beaucoup de gens.', hint: 'After beaucoup → de, not des' },
    ] },

  // ── A2 ──
  { id: 'passe-compose-avoir', name: 'Passé Composé with Avoir', level: 'A2', category: 'verbs',
    scoba: `Passé composé = avoir (conjugated) + past participle
  -ER → -é:  j'ai parlé, tu as mangé
  -IR → -i:  j'ai fini, elle a choisi
  -RE → -u:  j'ai vendu, il a attendu
Irregular: fait, dit, écrit, pris, mis, vu, lu, bu, eu, été`,
    exercises: [
      { type: 'fill', prompt: 'Hier j\'___ (manger) une pizza.', answer: 'ai mangé', hint: 'avoir: j\' → ai + -ER → -é' },
      { type: 'fill', prompt: 'Elle ___ (finir) ses devoirs.', answer: 'a fini', hint: 'avoir: elle → a + -IR → -i' },
      { type: 'fill', prompt: 'Nous ___ (prendre) le train.', answer: 'avons pris', hint: 'prendre → pris (irregular)' },
      { type: 'error', prompt: 'J\'ai mangé et j\'ai bu un café hier.', answer: 'J\'ai mangé et j\'ai bu un café hier.', hint: 'This sentence is actually correct!' },
    ] },
  { id: 'passe-compose-etre', name: 'Passé Composé with Être', level: 'A2', category: 'verbs',
    scoba: `DR MRS VANDERTRAMP verbs use être:
  Devenir, Revenir, Monter, Rester, Sortir, Venir, Aller,
  Naître, Descendre, Entrer, Retourner, Tomber, Rentrer,
  Arriver, Mourir, Partir
  + all reflexive verbs
Past participle agrees with SUBJECT: elle est allée, ils sont partis`,
    exercises: [
      { type: 'fill', prompt: 'Elle ___ (aller) au cinéma.', answer: 'est allée', hint: 'aller uses être; elle → agreement -ée' },
      { type: 'fill', prompt: 'Ils ___ (partir) hier soir.', answer: 'sont partis', hint: 'partir uses être; ils → -is' },
      { type: 'error', prompt: 'Elle a allé au marché.', answer: 'Elle est allée au marché.', hint: 'aller uses être, not avoir; add agreement -ée' },
      { type: 'transform', prompt: 'Change to feminine: "Il est arrivé."', answer: 'Elle est arrivée.', hint: 'Agreement: elle → -ée' },
    ] },
  { id: 'reflexive-verbs', name: 'Reflexive Verbs', level: 'A2', category: 'verbs',
    scoba: `Reflexive = action on oneself. Pronoun before conjugated verb:
  je me lève, tu te lèves, il/elle se lève, nous nous levons, vous vous levez, ils/elles se lèvent
Common: se lever, se coucher, se doucher, s'habiller, se promener, s'appeler
Passé composé: always with être, agreement with subject`,
    exercises: [
      { type: 'fill', prompt: 'Je ___ (se lever) à sept heures.', answer: 'me lève', hint: 'je → me + lève' },
      { type: 'fill', prompt: 'Elles ___ (se coucher) tard.', answer: 'se couchent', hint: 'elles → se + couchent' },
      { type: 'error', prompt: 'Je lève à six heures.', answer: 'Je me lève à six heures.', hint: 'Reflexive verb needs pronoun: me' },
      { type: 'transform', prompt: 'Put in passé composé: "Elle se lève tôt."', answer: 'Elle s\'est levée tôt.', hint: 'Reflexive PC: être + agreement' },
    ] },
  { id: 'direct-object-pronouns', name: 'Direct Object Pronouns', level: 'A2', category: 'pronouns',
    scoba: `me, te, le/la, nous, vous, les
Placed BEFORE conjugated verb: "Je le vois." (I see him/it.)
With infinitive: before infinitive: "Je vais le voir."
In passé composé: before avoir: "Je l'ai vu." (agreement with le/la/les before avoir!)`,
    exercises: [
      { type: 'fill', prompt: 'Le livre ? Je ___ lis tous les jours.', answer: 'le', hint: 'le livre → le (masc. sing.)' },
      { type: 'fill', prompt: 'Les fleurs ? Marie ___ achète au marché.', answer: 'les', hint: 'les fleurs → les (plural)' },
      { type: 'transform', prompt: 'Replace the object: "Je mange la pomme."', answer: 'Je la mange.', hint: 'la pomme → la, before verb' },
    ] },
  { id: 'comparatives', name: 'Comparatives', level: 'A2', category: 'syntax',
    scoba: `plus + adj/adv + que  (more ... than)
moins + adj/adv + que  (less ... than)
aussi + adj/adv + que  (as ... as)
Irregular: bon → meilleur, bien → mieux, mauvais → pire`,
    exercises: [
      { type: 'fill', prompt: 'Paris est ___ grand ___ Lyon.', answer: 'plus que', hint: 'more than → plus ... que' },
      { type: 'fill', prompt: 'Ce film est ___ (bon) que l\'autre.', answer: 'meilleur', hint: 'bon → meilleur (irregular)' },
      { type: 'error', prompt: 'Elle chante plus bon que moi.', answer: 'Elle chante mieux que moi.', hint: 'bien → mieux, not plus bon' },
    ] },

  // ── B1 ──
  { id: 'imparfait', name: 'Imparfait', level: 'B1', category: 'verbs',
    scoba: `Imperfect tense: nous-stem of present + endings:
  -ais, -ais, -ait, -ions, -iez, -aient
Uses: habitual past, description, background, ongoing action
Exception: être → j'étais (ét- stem)`,
    exercises: [
      { type: 'fill', prompt: 'Quand j\'étais petit, je ___ (jouer) dans le jardin.', answer: 'jouais', hint: 'Habitual past → imparfait: je → -ais' },
      { type: 'fill', prompt: 'Il ___ (faire) beau ce jour-là.', answer: 'faisait', hint: 'Description/background → imparfait' },
      { type: 'error', prompt: 'Quand j\'ai été petit, j\'aimais le chocolat.', answer: 'Quand j\'étais petit, j\'aimais le chocolat.', hint: 'Background state → imparfait, not passé composé' },
    ] },
  { id: 'pc-vs-imparfait', name: 'Passé Composé vs Imparfait', level: 'B1', category: 'verbs',
    scoba: `What are you expressing?
  → COMPLETED ACTION (specific time, once)?
      → PASSÉ COMPOSÉ: "Hier, j'ai mangé une pizza."
  → HABITUAL ACTION (used to)?
      → IMPARFAIT: "Je mangeais toujours des pizzas."
  → BACKGROUND/DESCRIPTION?
      → IMPARFAIT: "Il faisait beau."
  → INTERRUPTING ACTION?
      → PC interrupts IMPARFAIT: "Je dormais quand le téléphone a sonné."
  → DURATION with time limits?
      → PC: "J'ai habité à Paris pendant cinq ans."
  → ONGOING with no endpoint?
      → IMPARFAIT: "J'habitais à Paris (quand...)"`,
    exercises: [
      { type: 'fill', prompt: 'Hier il ___ (pleuvoir) quand je ___ (sortir).', answer: 'pleuvait suis sorti', hint: 'Background (imparfait) + interrupting action (PC)' },
      { type: 'fill', prompt: 'Quand j\'___ (être) enfant, je ___ (manger) beaucoup de bonbons.', answer: 'étais mangeais', hint: 'Both habitual/background → imparfait' },
      { type: 'error', prompt: 'Hier j\'allais au cinéma.', answer: 'Hier je suis allé au cinéma.', hint: 'Hier + completed action → passé composé' },
    ] },
  { id: 'subjunctive-intro', name: 'Subjunctive (introduction)', level: 'B1', category: 'verbs',
    scoba: `Subjunctive after: il faut que, je veux que, je souhaite que,
  il est important que, pour que, avant que, bien que
Formation: ils-stem of present + -e, -es, -e, -ions, -iez, -ent
Irregulars: être (sois), avoir (aie), aller (aille), faire (fasse), pouvoir (puisse), savoir (sache)`,
    exercises: [
      { type: 'fill', prompt: 'Il faut que tu ___ (faire) tes devoirs.', answer: 'fasses', hint: 'il faut que → subjunctive; faire → fass-' },
      { type: 'fill', prompt: 'Je veux que Marie ___ (venir) à la fête.', answer: 'vienne', hint: 'je veux que → subjunctive; venir → vienn-' },
      { type: 'error', prompt: 'Il faut que tu viens demain.', answer: 'Il faut que tu viennes demain.', hint: 'il faut que → subjunctive' },
    ] },
  { id: 'relative-pronouns', name: 'Relative Pronouns (qui/que/dont/où)', level: 'B1', category: 'pronouns',
    scoba: `qui = subject (who/which): "L'homme qui parle..."
que = direct object (whom/which): "Le livre que je lis..."
dont = of which/whose: "La femme dont je parle..."
où = where/when: "La ville où j'habite..."`,
    exercises: [
      { type: 'fill', prompt: 'Le garçon ___ parle est mon frère.', answer: 'qui', hint: 'Subject of parle → qui' },
      { type: 'fill', prompt: 'Le film ___ j\'ai vu était excellent.', answer: 'que', hint: 'Direct object of ai vu → que' },
      { type: 'fill', prompt: 'La ville ___ j\'habite est petite.', answer: 'où', hint: 'Place → où' },
      { type: 'fill', prompt: 'L\'homme ___ je t\'ai parlé est professeur.', answer: 'dont', hint: 'parler de → dont' },
    ] },
  { id: 'conditional', name: 'Conditional', level: 'B1', category: 'verbs',
    scoba: `Formation: future stem + imparfait endings (-ais, -ais, -ait, -ions, -iez, -aient)
Uses: polite requests, wishes, hypothetical, reported speech
  "Je voudrais un café." (polite)
  "Si j'avais le temps, je voyagerais." (hypothetical)`,
    exercises: [
      { type: 'fill', prompt: 'Je ___ (vouloir) un café, s\'il vous plaît.', answer: 'voudrais', hint: 'Polite request → conditional' },
      { type: 'fill', prompt: 'Si j\'avais de l\'argent, je ___ (voyager) partout.', answer: 'voyagerais', hint: 'si + imparfait → conditional' },
      { type: 'error', prompt: 'Si j\'ai le temps, je viendrais.', answer: 'Si j\'avais le temps, je viendrais.', hint: 'si + conditional needs imparfait in the si-clause' },
    ] },
  { id: 'pronoun-y-en', name: 'Pronouns Y and En', level: 'B1', category: 'pronouns',
    scoba: `Y replaces à + noun (place or thing): "J'y vais." (I'm going there)
En replaces de + noun (quantity/partitive): "J'en veux." (I want some)
  "Tu as des pommes ?" — "Oui, j'en ai trois."
  "Tu vas à Paris ?" — "Oui, j'y vais."
Order: subject + (ne) + me/te/se/nous/vous + le/la/les + lui/leur + y + en + verb`,
    exercises: [
      { type: 'fill', prompt: 'Tu vas à Paris ? — Oui, j\'___ vais demain.', answer: 'y', hint: 'à Paris → y' },
      { type: 'fill', prompt: 'Tu veux du café ? — Oui, j\'___ veux bien.', answer: 'en', hint: 'du café (partitive) → en' },
      { type: 'transform', prompt: 'Replace with en: "J\'ai trois chats."', answer: 'J\'en ai trois.', hint: 'Quantity → en + number' },
    ] },

  // ── B2 ──
  { id: 'subjunctive-full', name: 'Full Subjunctive Usage', level: 'B2', category: 'verbs',
    scoba: `Subjunctive required after:
  Emotions: je suis content que, j'ai peur que, il est dommage que
  Doubt: je doute que, il est possible que, il n'est pas certain que
  Wishes: je souhaite que, j'aimerais que
  Necessity: il faut que, il est nécessaire que
  Conjunctions: pour que, avant que, bien que, à moins que, quoique
NOT after: je pense que (affirmative), je crois que (affirmative), il est certain que, après que`,
    exercises: [
      { type: 'fill', prompt: 'Je suis content que tu ___ (être) là.', answer: 'sois', hint: 'Emotion → subjunctive; être → sois' },
      { type: 'fill', prompt: 'Bien qu\'il ___ (pleuvoir), nous sommes sortis.', answer: 'pleuve', hint: 'bien que → subjunctive' },
      { type: 'error', prompt: 'Je pense qu\'il vienne demain.', answer: 'Je pense qu\'il viendra demain.', hint: 'je pense que (affirmative) → indicative' },
    ] },
  { id: 'plus-que-parfait', name: 'Plus-que-parfait', level: 'B2', category: 'verbs',
    scoba: `Formation: imparfait of avoir/être + past participle
Use: action completed BEFORE another past action
  "J'avais déjà mangé quand il est arrivé."
  "Elle était partie avant mon arrivée."
Same être/avoir rules as passé composé`,
    exercises: [
      { type: 'fill', prompt: 'Quand je suis arrivé, ils ___ déjà ___ (partir).', answer: 'étaient partis', hint: 'Earlier past action → plus-que-parfait; partir uses être' },
      { type: 'fill', prompt: 'Elle ___ (finir) ses devoirs avant le dîner.', answer: 'avait fini', hint: 'Earlier past → plus-que-parfait with avoir' },
      { type: 'error', prompt: 'J\'ai déjà mangé quand il est arrivé.', answer: 'J\'avais déjà mangé quand il est arrivé.', hint: 'Earlier action → plus-que-parfait' },
    ] },
  { id: 'si-clauses', name: 'Si Clauses (conditionals)', level: 'B2', category: 'verbs',
    scoba: `Three types:
  1. Si + present → future: "Si tu viens, je serai content."
  2. Si + imparfait → conditional: "Si tu venais, je serais content."
  3. Si + plus-que-parfait → conditional past: "Si tu étais venu, j'aurais été content."
NEVER: si + future, si + conditional`,
    exercises: [
      { type: 'fill', prompt: 'Si j\'___ (avoir) plus de temps, je voyagerais.', answer: 'avais', hint: 'Si + conditional → imparfait in si-clause' },
      { type: 'fill', prompt: 'Si tu ___ (venir) hier, tu aurais vu le spectacle.', answer: 'étais venu', hint: 'Si + cond. past → plus-que-parfait' },
      { type: 'error', prompt: 'Si j\'aurais de l\'argent, j\'achèterais une maison.', answer: 'Si j\'avais de l\'argent, j\'achèterais une maison.', hint: 'Never si + conditional' },
    ] },
  { id: 'passive-voice', name: 'Passive Voice', level: 'B2', category: 'syntax',
    scoba: `être (conjugated in any tense) + past participle + par + agent
  "Le gâteau est mangé par les enfants."
  "La lettre a été écrite par Marie."
Past participle agrees with SUBJECT in passive
Alternative: on + active: "On parle français ici."`,
    exercises: [
      { type: 'fill', prompt: 'Le livre ___ (écrire — passé composé passif) par Victor Hugo.', answer: 'a été écrit', hint: 'Passive PC: a été + past participle' },
      { type: 'transform', prompt: 'Make passive: "Marie a écrit cette lettre."', answer: 'Cette lettre a été écrite par Marie.', hint: 'Agreement: lettre (fem.) → écrite' },
      { type: 'error', prompt: 'La maison a été construit par mon père.', answer: 'La maison a été construite par mon père.', hint: 'Agreement: maison (fem.) → construite' },
    ] },
  { id: 'reported-speech', name: 'Reported Speech', level: 'B2', category: 'syntax',
    scoba: `Direct → Indirect speech:
  "Je viens" → Il dit qu'il vient (present → present, same time)
  "Je viens" → Il a dit qu'il venait (present → imparfait, past reporting)
  "Je viendrai" → Il a dit qu'il viendrait (future → conditional)
  "J'ai fait" → Il a dit qu'il avait fait (PC → PQP)
Time shifts: aujourd'hui → ce jour-là, demain → le lendemain, hier → la veille`,
    exercises: [
      { type: 'fill', prompt: 'Il a dit qu\'il ___ (venir) demain.', answer: 'viendrait', hint: 'Future in direct → conditional in indirect (past reporting)' },
      { type: 'fill', prompt: 'Elle a dit qu\'elle ___ (manger) une pizza.', answer: 'avait mangé', hint: 'PC in direct → PQP in indirect' },
      { type: 'transform', prompt: 'Report: "Marie dit : «Je suis fatiguée.»" (past reporting)', answer: 'Marie a dit qu\'elle était fatiguée.', hint: 'Present → imparfait; je → elle' },
    ] },

  // ── C1 ──
  { id: 'past-subjunctive', name: 'Past Subjunctive', level: 'C1', category: 'verbs',
    scoba: `Formation: subjunctive of avoir/être + past participle
  "Je suis content qu'il ait réussi."
  "Bien qu'elle soit partie, je ne suis pas triste."
Use: subjunctive context + completed past action`,
    exercises: [
      { type: 'fill', prompt: 'Je regrette qu\'il ___ (partir).', answer: 'soit parti', hint: 'Regret → subjunctive; past action → past subj.; partir uses être' },
      { type: 'fill', prompt: 'Bien qu\'elle ___ (finir) tard, elle est venue.', answer: 'ait fini', hint: 'bien que → subjunctive; past action → past subj. with avoir' },
    ] },
  { id: 'passe-simple', name: 'Passé Simple', level: 'C1', category: 'verbs',
    scoba: `Literary past tense (written French only, formal narration):
  -ER: -ai, -as, -a, -âmes, -âtes, -èrent
  -IR/-RE: -is, -is, -it, -îmes, -îtes, -irent
  Key irregulars: être → fut, avoir → eut, faire → fit, venir → vint, voir → vit
Recognize for reading; rarely produce in conversation`,
    exercises: [
      { type: 'fill', prompt: '"Il ___ (aller) vers la porte et sortit." (literary)', answer: 'alla', hint: 'aller → all- + passé simple -a' },
      { type: 'fill', prompt: '"Elle ___ (voir) la lumière et sourit." (literary)', answer: 'vit', hint: 'voir → vit (irregular passé simple)' },
      { type: 'transform', prompt: 'Rewrite in passé composé: "Il prit son chapeau."', answer: 'Il a pris son chapeau.', hint: 'Passé simple → passé composé for modern French' },
    ] },
  { id: 'concessive-clauses', name: 'Concessive Clauses', level: 'C1', category: 'syntax',
    scoba: `bien que + subjunctive = although
quoique + subjunctive = although
malgré + noun = despite
avoir beau + infinitive = no matter how much (try)
  "J'ai beau essayer, je n'y arrive pas."
même si + indicative = even if
  "Même si tu viens, je ne changerai pas d'avis."`,
    exercises: [
      { type: 'fill', prompt: '___ qu\'il fasse froid, nous sortons. (although)', answer: 'Bien', hint: 'Although → bien que + subj.' },
      { type: 'fill', prompt: 'J\'ai ___ chercher, je ne trouve pas mes clés.', answer: 'beau', hint: 'avoir beau = no matter how much' },
      { type: 'error', prompt: 'Même si tu viennes, ça ne changera rien.', answer: 'Même si tu viens, ça ne changera rien.', hint: 'même si → indicative, not subjunctive' },
    ] },
  { id: 'discourse-markers', name: 'Discourse Markers & Connectors', level: 'C1', category: 'syntax',
    scoba: `Addition: de plus, en outre, par ailleurs, qui plus est
Contrast: cependant, néanmoins, toutefois, en revanche, or
Cause: étant donné que, vu que, dans la mesure où
Consequence: par conséquent, de ce fait, si bien que, d'où
Concession: certes...mais, il n'en reste pas moins que`,
    exercises: [
      { type: 'fill', prompt: 'J\'ai beaucoup étudié ; ___, j\'ai réussi l\'examen. (therefore)', answer: 'par conséquent', hint: 'Consequence → par conséquent' },
      { type: 'fill', prompt: 'Je n\'aime pas le café ; ___, je préfère le thé. (on the other hand)', answer: 'en revanche', hint: 'Contrast → en revanche' },
      { type: 'fill', prompt: 'C\'est un bon restaurant. ___, c\'est le meilleur de la ville. (in fact)', answer: 'De fait', hint: 'Strengthening → de fait' },
    ] },

  // ── C2 ──
  { id: 'passe-anterieur', name: 'Passé Antérieur', level: 'C2', category: 'verbs',
    scoba: `Literary tense: passé simple of avoir/être + past participle
  "Quand il eut fini, il sortit."
Used in subordinate clauses after quand, lorsque, après que, dès que
Only found in formal literary writing.`,
    exercises: [
      { type: 'fill', prompt: '"Dès qu\'il ___ (finir), il sortit." (literary)', answer: 'eut fini', hint: 'Passé antérieur: eut + past participle' },
      { type: 'transform', prompt: 'Modernize: "Quand il eut mangé, il partit."', answer: 'Quand il avait mangé, il est parti.', hint: 'Passé antérieur → plus-que-parfait / passé composé' },
    ] },
  { id: 'literary-subjunctive', name: 'Literary Subjunctive (Imparfait du Subjonctif)', level: 'C2', category: 'verbs',
    scoba: `Archaic form, literary texts only:
  Formation from passé simple: -sse, -sses, -^t, -ssions, -ssiez, -ssent
  "Il fallait qu'il fît ce travail." (modern: fasse)
  "Je voulais qu'elle vînt." (modern: vienne)
Recognize for reading; do not produce in conversation`,
    exercises: [
      { type: 'fill', prompt: '"Il fallait qu\'il ___ (faire) ce travail." (literary)', answer: 'fît', hint: 'Literary subjunctive of faire' },
      { type: 'transform', prompt: 'Modernize: "Je voulais qu\'elle vînt."', answer: 'Je voulais qu\'elle vienne.', hint: 'Literary subj. → modern present subj.' },
    ] },
  { id: 'register-grammar', name: 'Register-Dependent Grammar', level: 'C2', category: 'syntax',
    scoba: `Formal written: ne...pas always, inversion questions, passé simple
Standard spoken: ne-dropping, est-ce que questions, passé composé
Very informal: omission of ne, subject doubling ("moi, je..."),
  c'est...qui/que for focus, ça replaces cela
Quebec specifics: tu-veux-tu? pattern, icitte, pantoute`,
    exercises: [
      { type: 'transform', prompt: 'Make informal: "Je ne sais pas ce que c\'est."', answer: 'Je sais pas c\'est quoi.', hint: 'Drop ne, restructure question' },
      { type: 'transform', prompt: 'Make formal: "Y a pas de problème."', answer: 'Il n\'y a pas de problème.', hint: 'Add il, restore ne...pas' },
      { type: 'fill', prompt: '(Quebec informal) Tu ___ -tu venir demain ?', answer: 'veux', hint: 'Quebec pattern: tu + verb + -tu?' },
    ] },
  { id: 'subtle-mood', name: 'Subtle Mood Distinctions', level: 'C2', category: 'verbs',
    scoba: `Relative clauses with known vs unknown antecedent:
  "Je cherche l'homme qui PARLE anglais." (I know who — indicative)
  "Je cherche un homme qui PARLE anglais." (anyone — subjunctive)
After superlatives: subjunctive is common
  "C'est le meilleur film que j'aie jamais vu."
After il semble que: subjunctive; il me semble que: indicative`,
    exercises: [
      { type: 'fill', prompt: 'Je cherche quelqu\'un qui ___ (savoir) parler chinois.', answer: 'sache', hint: 'Unknown antecedent (quelqu\'un) → subjunctive' },
      { type: 'fill', prompt: 'C\'est le plus beau livre que j\'___ (lire) cette année.', answer: 'aie lu', hint: 'After superlative → past subjunctive' },
      { type: 'fill', prompt: 'Il n\'y a personne qui ___ (pouvoir) résoudre ça.', answer: 'puisse', hint: 'Negative antecedent (personne) → subjunctive' },
    ] },
];

// ─── Class ──────────────────────────────────────────────────────────────────

class GrammarTutor {
  constructor() {
    this.dir = dataDir(SKILL_NAME);
  }

  getProfile(studentId) {
    return loadProfile(this.dir, studentId);
  }

  _save(p) {
    saveProfile(this.dir, p);
  }

  setLevel(studentId, level) {
    level = level.toUpperCase();
    if (!CEFR.includes(level)) throw new Error(`Invalid level. Use: ${CEFR.join(', ')}`);
    const p = this.getProfile(studentId);
    p.level = level;
    this._save(p);
    return { studentId, level };
  }

  getTopicCatalog(level) {
    const topics = level ? TOPICS.filter(t => t.level === level) : TOPICS;
    return topics.map(t => ({ id: t.id, name: t.name, level: t.level, category: t.category, exercises: t.exercises.length }));
  }

  getScoba(topicId) {
    const t = TOPICS.find(t => t.id === topicId);
    if (!t) throw new Error(`Unknown topic: ${topicId}`);
    return { id: t.id, name: t.name, level: t.level, scoba: t.scoba };
  }

  generateLesson(studentId, topicId) {
    const p = this.getProfile(studentId);
    const t = topicId ? TOPICS.find(t => t.id === topicId) : this._nextTopic(p);
    if (!t) throw new Error(topicId ? `Unknown topic: ${topicId}` : 'No topics available. Set a level first.');
    const exercises = pick(t.exercises, 3);
    return {
      topic: { id: t.id, name: t.name, level: t.level, category: t.category },
      scoba: t.scoba,
      exercises: exercises.map((e, i) => ({ n: i + 1, type: e.type, prompt: e.prompt })),
      flow: [
        'Step 1: Read the SCOBA decision flowchart above.',
        'Step 2: Try each exercise below.',
        'Step 3: Use "check <n> <answer>" to check your answers.',
        'Step 4: Use "record <studentId> <topicId> <grade 1-4>" to log mastery.',
      ],
    };
  }

  generateExercise(studentId, topicId, type) {
    const p = this.getProfile(studentId);
    let pool;
    if (topicId) {
      const t = TOPICS.find(t => t.id === topicId);
      if (!t) throw new Error(`Unknown topic: ${topicId}`);
      pool = t.exercises;
    } else {
      const level = p.level || 'A1';
      const levelTopics = TOPICS.filter(t => t.level === level);
      pool = levelTopics.flatMap(t => t.exercises);
    }
    if (type) pool = pool.filter(e => e.type === type);
    if (!pool.length) throw new Error('No exercises match the criteria.');
    const ex = pick(pool, 1)[0];
    return { type: ex.type, prompt: ex.prompt, _answer: ex.answer, _hint: ex.hint };
  }

  checkAnswer(topicId, exerciseIndex, userAnswer) {
    const t = TOPICS.find(t => t.id === topicId);
    if (!t) throw new Error(`Unknown topic: ${topicId}`);
    const idx = exerciseIndex - 1;
    if (idx < 0 || idx >= t.exercises.length) throw new Error(`Exercise index out of range (1-${t.exercises.length}).`);
    const ex = t.exercises[idx];
    const correct = norm(userAnswer) === norm(ex.answer);
    return {
      correct,
      expected: ex.answer,
      given: userAnswer,
      hint: correct ? null : ex.hint,
      type: ex.type,
    };
  }

  recordAssessment(studentId, topicId, grade) {
    grade = Number(grade);
    if (![1, 2, 3, 4].includes(grade)) throw new Error('Grade must be 1 (Again), 2 (Hard), 3 (Good), or 4 (Easy).');
    const t = TOPICS.find(t => t.id === topicId);
    if (!t) throw new Error(`Unknown topic: ${topicId}`);
    const p = this.getProfile(studentId);
    if (!p.skills[topicId]) {
      p.skills[topicId] = { D: 5, S: 1, lastReview: null, attempts: [] };
    }
    const sk = p.skills[topicId];
    sk.S = fsrsUpdateStability(sk.S, sk.D, grade);
    sk.D = fsrsUpdateDifficulty(sk.D, grade);
    sk.lastReview = today();
    sk.attempts.push({ date: today(), score: grade >= 3 ? 1 : 0, total: 1 });
    p.assessments.push({ topicId, grade, date: today() });
    this._save(p);
    const mastery = calcMastery(sk.attempts);
    return {
      topicId, grade,
      gradeLabel: ['', 'Again', 'Hard', 'Good', 'Easy'][grade],
      D: sk.D, S: sk.S,
      nextReview: fsrsNextReview(sk.S, DEFAULT_RETENTION),
      mastery, masteryLabel: masteryLabel(mastery),
    };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const levelTopics = TOPICS.filter(t => t.level === level);
    const skills = levelTopics.map(t => {
      const sk = p.skills[t.id];
      if (!sk) return { id: t.id, name: t.name, status: 'not-started', mastery: 0 };
      const mastery = calcMastery(sk.attempts);
      const daysSince = sk.lastReview ? Math.floor((Date.now() - new Date(sk.lastReview).getTime()) / 86400000) : null;
      const R = sk.lastReview ? fsrsRetention(daysSince, sk.S) : 0;
      return {
        id: t.id, name: t.name, mastery, status: masteryLabel(mastery),
        D: sk.D, S: sk.S, R: Math.round(R * 100) / 100,
        nextReview: fsrsNextReview(sk.S, DEFAULT_RETENTION),
        dueForReview: R < DEFAULT_RETENTION,
      };
    });
    const totalMastery = skills.length ? Math.round(skills.reduce((s, sk) => s + sk.mastery, 0) / skills.length * 100) / 100 : 0;
    return { studentId, level, totalMastery, skills };
  }

  getNextTopics(studentId, count) {
    count = count || 5;
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const levelTopics = TOPICS.filter(t => t.level === level);
    const due = [];
    const notStarted = [];
    for (const t of levelTopics) {
      const sk = p.skills[t.id];
      if (!sk) { notStarted.push({ id: t.id, name: t.name, reason: 'not-started' }); continue; }
      const daysSince = sk.lastReview ? Math.floor((Date.now() - new Date(sk.lastReview).getTime()) / 86400000) : 999;
      const R = fsrsRetention(daysSince, sk.S);
      if (R < DEFAULT_RETENTION) {
        due.push({ id: t.id, name: t.name, reason: 'due-for-review', R: Math.round(R * 100) / 100 });
      }
    }
    return { studentId, level, next: [...due, ...notStarted].slice(0, count) };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const recentAssessments = (p.assessments || []).slice(-10).reverse();
    const byCategory = {};
    for (const t of TOPICS.filter(t => t.level === (p.level || 'A1'))) {
      if (!byCategory[t.category]) byCategory[t.category] = { total: 0, mastered: 0 };
      byCategory[t.category].total++;
      const sk = p.skills[t.id];
      if (sk && calcMastery(sk.attempts) >= MASTERY_THRESHOLD) byCategory[t.category].mastered++;
    }
    return {
      studentId, level: p.level || 'A1',
      totalMastery: progress.totalMastery,
      categoryBreakdown: byCategory,
      recentAssessments,
      topicCount: progress.skills.length,
      masteredCount: progress.skills.filter(s => s.mastery >= MASTERY_THRESHOLD).length,
    };
  }

  listStudents() {
    return listProfiles(this.dir);
  }

  _nextTopic(p) {
    const level = p.level || 'A1';
    const levelTopics = TOPICS.filter(t => t.level === level);
    for (const t of levelTopics) {
      const sk = p.skills[t.id];
      if (sk && sk.lastReview) {
        const days = Math.floor((Date.now() - new Date(sk.lastReview).getTime()) / 86400000);
        if (fsrsRetention(days, sk.S) < DEFAULT_RETENTION) return t;
      }
    }
    for (const t of levelTopics) {
      if (!p.skills[t.id]) return t;
    }
    return levelTopics.reduce((best, t) => {
      const m = p.skills[t.id] ? calcMastery(p.skills[t.id].attempts) : 0;
      const bm = best && p.skills[best.id] ? calcMastery(p.skills[best.id].attempts) : 1;
      return m < bm ? t : best;
    }, levelTopics[0]);
  }
}

// ─── CLI ────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const tutor = new GrammarTutor();
  runCLI((cmd, args, out) => {
    const sid = args[1];
    switch (cmd) {
      case 'start':
        if (!sid) throw new Error('Usage: start <studentId>');
        out(tutor.getProfile(sid));
        break;
      case 'set-level':
        if (!sid || !args[2]) throw new Error('Usage: set-level <studentId> <A1|A2|B1|B2|C1|C2>');
        out(tutor.setLevel(sid, args[2].toUpperCase()));
        break;
      case 'lesson':
        if (!sid) throw new Error('Usage: lesson <studentId> [topicId]');
        out(tutor.generateLesson(sid, args[2] || null));
        break;
      case 'exercise':
        if (!sid) throw new Error('Usage: exercise <studentId> [topicId] [fill|error|transform]');
        out(tutor.generateExercise(sid, args[2] || null, args[3] || null));
        break;
      case 'check':
        if (!args[1] || !args[2] || !args[3]) throw new Error('Usage: check <topicId> <exerciseIndex> <answer...>');
        out(tutor.checkAnswer(args[1], Number(args[2]), args.slice(3).join(' ')));
        break;
      case 'record':
        if (!sid || !args[2] || !args[3]) throw new Error('Usage: record <studentId> <topicId> <grade 1-4>');
        out(tutor.recordAssessment(sid, args[2], Number(args[3])));
        break;
      case 'progress':
        if (!sid) throw new Error('Usage: progress <studentId>');
        out(tutor.getProgress(sid));
        break;
      case 'report':
        if (!sid) throw new Error('Usage: report <studentId>');
        out(tutor.getReport(sid));
        break;
      case 'next':
        if (!sid) throw new Error('Usage: next <studentId> [count]');
        out(tutor.getNextTopics(sid, args[2] ? Number(args[2]) : 5));
        break;
      case 'topics':
        out(tutor.getTopicCatalog(args[1] || null));
        break;
      case 'scoba':
        if (!args[1]) throw new Error('Usage: scoba <topicId>');
        out(tutor.getScoba(args[1]));
        break;
      case 'students':
        out({ students: tutor.listStudents() });
        break;
      case 'help':
        out({ info: 'Use one of the commands listed in SKILL.md' });
        break;
      default:
        out({
          commands: {
            'start <studentId>': 'Load or create a student profile',
            'set-level <studentId> <level>': 'Set CEFR level (A1-C2)',
            'lesson <studentId> [topicId]': 'Generate a full lesson with SCOBA + exercises',
            'exercise <studentId> [topicId] [type]': 'Generate a single exercise',
            'check <topicId> <exerciseIndex> <answer>': 'Check an answer',
            'record <studentId> <topicId> <grade>': 'Record assessment (1=Again 2=Hard 3=Good 4=Easy)',
            'progress <studentId>': 'View progress for current level',
            'report <studentId>': 'Full student report with category breakdown',
            'next <studentId> [count]': 'Get next recommended topics',
            'topics [level]': 'List all grammar topics, optionally filtered by level',
            'scoba <topicId>': 'Show the SCOBA decision flowchart for a topic',
            'students': 'List all student profiles',
          },
        });
    }
  });
}

module.exports = { GrammarTutor, TOPICS };
