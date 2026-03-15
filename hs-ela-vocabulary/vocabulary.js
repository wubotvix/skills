// eClaw HS ELA Vocabulary Interactive Tutor (9-12). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-ela-vocabulary');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-9': {
    'context-clues-advanced': ['inference-from-contrast', 'inference-from-restatement', 'inference-from-example'],
    'greek-latin-roots-tier1': ['common-prefixes', 'common-roots', 'common-suffixes'],
    'word-families': ['noun-verb-adj-adv', 'derivational-patterns'],
    'academic-vocabulary-9': ['tier2-foundations', 'cross-curricular-terms'],
    'connotation-spectrum': ['positive-negative-neutral', 'synonym-ranking'],
    'dictionary-strategies': ['guide-words-entries', 'multiple-meanings'],
  },
  'grade-10': {
    'sat-act-vocabulary': ['tone-attitude-words', 'argument-rhetoric-words', 'change-development-words'],
    'connotation-register': ['formality-levels', 'audience-awareness'],
    'advanced-roots': ['greek-combining-forms', 'latin-verb-roots'],
    'domain-vocabulary-10': ['literary-analysis-terms', 'science-writing-terms'],
    'figurative-expression': ['idiom-origins', 'metaphor-vocabulary'],
    'word-nuance': ['near-synonym-distinctions', 'context-dependent-meaning'],
  },
  'grade-11': {
    'advanced-morphology': ['complex-derivations', 'productive-affixes'],
    'discipline-specific-terms': ['rhetoric-terms', 'philosophy-terms', 'social-science-terms'],
    'etymology-patterns': ['latin-to-english', 'greek-to-english', 'language-borrowing'],
    'ap-vocabulary': ['ap-lang-terms', 'ap-lit-terms'],
    'word-analysis-complex': ['unfamiliar-word-deconstruction', 'context-plus-morphology'],
    'semantic-fields': ['word-clusters', 'conceptual-mapping'],
  },
  'grade-12': {
    'precise-diction': ['word-choice-revision', 'eliminating-vagueness'],
    'tone-through-word-choice': ['tone-matching', 'tone-shifting'],
    'college-vocabulary': ['college-level-reading-words', 'academic-writing-words'],
    'register-flexibility': ['register-shifting', 'code-switching-written'],
    'vocabulary-as-style': ['authorial-diction-analysis', 'style-imitation'],
    'advanced-etymology': ['semantic-drift', 'doublets-and-cognates'],
  },
};

// ── Content Banks ──

const ROOTS_BANK = {
  prefixes: [
    { prefix: 'ante-', meaning: 'before', examples: ['antecedent', 'antebellum', 'anteroom'] },
    { prefix: 'anti-', meaning: 'against', examples: ['antithesis', 'antipathy', 'antidote'] },
    { prefix: 'bene-', meaning: 'good, well', examples: ['benevolent', 'benediction', 'benefactor'] },
    { prefix: 'circum-', meaning: 'around', examples: ['circumscribe', 'circumvent', 'circumlocution'] },
    { prefix: 'contra-', meaning: 'against', examples: ['contradict', 'contravene', 'contrary'] },
    { prefix: 'de-', meaning: 'down, away', examples: ['denigrate', 'deprecate', 'delineate'] },
    { prefix: 'dis-', meaning: 'not, apart', examples: ['disparity', 'disseminate', 'dissonance'] },
    { prefix: 'ex-', meaning: 'out of', examples: ['extricate', 'exonerate', 'expatriate'] },
    { prefix: 'hyper-', meaning: 'excessive', examples: ['hyperbole', 'hyperactive', 'hypercritical'] },
    { prefix: 'in-/im-', meaning: 'not, into', examples: ['indelible', 'immutable', 'impervious'] },
    { prefix: 'inter-', meaning: 'between', examples: ['interpolate', 'interlocutor', 'interstice'] },
    { prefix: 'mal-', meaning: 'bad', examples: ['malevolent', 'malfeasance', 'malignant'] },
    { prefix: 'mis-', meaning: 'wrong', examples: ['misconstrue', 'misnomer', 'misanthrope'] },
    { prefix: 'omni-', meaning: 'all', examples: ['omniscient', 'omnipotent', 'omnivorous'] },
    { prefix: 'per-', meaning: 'through', examples: ['permeate', 'pervasive', 'perfunctory'] },
    { prefix: 'post-', meaning: 'after', examples: ['posthumous', 'posterity', 'postscript'] },
    { prefix: 'pre-', meaning: 'before', examples: ['precursor', 'precedent', 'preeminent'] },
    { prefix: 'pro-', meaning: 'forward, for', examples: ['propensity', 'proponent', 'proliferate'] },
    { prefix: 'sub-', meaning: 'under', examples: ['subversive', 'subjugate', 'surreptitious'] },
    { prefix: 'trans-', meaning: 'across', examples: ['transcend', 'transgress', 'transient'] },
  ],
  roots: [
    { root: '-anthro-', meaning: 'human', examples: ['misanthrope', 'philanthropy', 'anthropology'] },
    { root: '-belli-', meaning: 'war', examples: ['bellicose', 'belligerent', 'antebellum'] },
    { root: '-cred-', meaning: 'believe', examples: ['credulous', 'incredulous', 'credence'] },
    { root: '-dict-', meaning: 'say, speak', examples: ['dictate', 'contradict', 'malediction'] },
    { root: '-duc-', meaning: 'lead', examples: ['conducive', 'induce', 'deduce'] },
    { root: '-fac-/-fic-', meaning: 'make, do', examples: ['efficacy', 'proficient', 'malefactor'] },
    { root: '-graph-', meaning: 'write', examples: ['biography', 'orthography', 'demographic'] },
    { root: '-log-/-loqui-', meaning: 'speak', examples: ['eloquent', 'loquacious', 'soliloquy'] },
    { root: '-morph-', meaning: 'form, shape', examples: ['amorphous', 'metamorphosis', 'anthropomorphic'] },
    { root: '-path-', meaning: 'feeling', examples: ['apathy', 'empathy', 'antipathy'] },
    { root: '-phil-', meaning: 'love', examples: ['philanthropy', 'philosophy', 'bibliophile'] },
    { root: '-scrib-/-script-', meaning: 'write', examples: ['circumscribe', 'prescribe', 'nondescript'] },
    { root: '-spec-/-spic-', meaning: 'look, see', examples: ['circumspect', 'perspicacious', 'auspicious'] },
    { root: '-ten-/-tain-', meaning: 'hold', examples: ['tenacious', 'sustain', 'untenable'] },
    { root: '-ven-/-vent-', meaning: 'come', examples: ['circumvent', 'intervene', 'convention'] },
    { root: '-ver-', meaning: 'truth', examples: ['veracity', 'verisimilitude', 'aver'] },
    { root: '-voc-/-vok-', meaning: 'call, voice', examples: ['equivocate', 'provoke', 'advocate'] },
    { root: '-sent-/-sens-', meaning: 'feel', examples: ['sentient', 'consensus', 'dissension'] },
  ],
  suffixes: [
    { suffix: '-ous/-ious', meaning: 'full of', examples: ['copious', 'tenacious', 'surreptitious'] },
    { suffix: '-tion/-sion', meaning: 'act or state', examples: ['aberration', 'digression', 'fabrication'] },
    { suffix: '-ible/-able', meaning: 'capable of', examples: ['indelible', 'malleable', 'incontrovertible'] },
    { suffix: '-ity/-ty', meaning: 'state or quality', examples: ['veracity', 'duplicity', 'sagacity'] },
    { suffix: '-ment', meaning: 'result or action', examples: ['impediment', 'embellishment', 'discernment'] },
    { suffix: '-ive', meaning: 'tending to', examples: ['conducive', 'subversive', 'pensive'] },
    { suffix: '-ence/-ance', meaning: 'state or quality', examples: ['ambivalence', 'perseverance', 'eloquence'] },
  ],
};

const SAT_WORDS = {
  'tone-attitude': [
    { word: 'ambivalent', definition: 'having mixed or contradictory feelings', pos: 'adj', example: 'She felt ambivalent about the promotion, excited yet anxious.', etymology: 'Latin ambi- (both) + valere (to be strong)' },
    { word: 'sardonic', definition: 'grimly mocking or cynical', pos: 'adj', example: 'His sardonic smile suggested he found the irony amusing.', etymology: 'Greek sardonios, perhaps from a Sardinian plant causing convulsive laughter' },
    { word: 'wistful', definition: 'having a feeling of vague or regretful longing', pos: 'adj', example: 'She gazed with wistful eyes at her childhood home.', etymology: 'Possibly from obsolete wistly (intently)' },
    { word: 'pragmatic', definition: 'dealing with things sensibly and realistically', pos: 'adj', example: 'The pragmatic leader focused on achievable goals rather than ideals.', etymology: 'Greek pragmatikos (relating to fact), from pragma (deed)' },
    { word: 'earnest', definition: 'showing sincere and intense conviction', pos: 'adj', example: 'Her earnest plea for reform moved the entire assembly.', etymology: 'Old English eornoste (serious, zealous)' },
    { word: 'reticent', definition: 'not revealing thoughts or feelings readily', pos: 'adj', example: 'The reticent witness offered only brief, guarded answers.', etymology: 'Latin reticere (to keep silent), from re- + tacere (to be silent)' },
    { word: 'indignant', definition: 'feeling anger aroused by something unjust', pos: 'adj', example: 'Citizens grew indignant at the government\'s broken promises.', etymology: 'Latin indignari (to regard as unworthy)' },
    { word: 'fervent', definition: 'having or displaying passionate intensity', pos: 'adj', example: 'She was a fervent advocate for environmental protection.', etymology: 'Latin fervere (to boil, glow)' },
  ],
  'argument-rhetoric': [
    { word: 'substantiate', definition: 'provide evidence to support or prove', pos: 'v', example: 'She needed data to substantiate her hypothesis.', etymology: 'Latin substantia (being, essence)' },
    { word: 'refute', definition: 'prove a statement or theory to be wrong', pos: 'v', example: 'New evidence refuted the long-held assumption about the artifact\'s origin.', etymology: 'Latin refutare (to drive back, rebut)' },
    { word: 'concede', definition: 'admit that something is true after first resisting', pos: 'v', example: 'He conceded that the opposing argument had some merit.', etymology: 'Latin concedere (to yield, withdraw)' },
    { word: 'corroborate', definition: 'confirm or give support to a statement', pos: 'v', example: 'Two witnesses corroborated the defendant\'s alibi.', etymology: 'Latin corroborare (to strengthen), from robur (oak, strength)' },
    { word: 'undermine', definition: 'erode the base or foundation of', pos: 'v', example: 'The scandal threatened to undermine public trust in the institution.', etymology: 'Middle English underminen (to dig beneath)' },
    { word: 'assert', definition: 'state a fact or belief confidently and forcefully', pos: 'v', example: 'The author asserts that education reform is overdue.', etymology: 'Latin asserere (to claim, join to oneself)' },
    { word: 'elucidate', definition: 'make something clear; explain', pos: 'v', example: 'The professor elucidated the complex theory with a simple analogy.', etymology: 'Latin elucidare (to make light), from lux (light)' },
    { word: 'extrapolate', definition: 'extend conclusions beyond known data', pos: 'v', example: 'From the initial results, researchers extrapolated a broader trend.', etymology: 'Latin extra- (outside) + polire (to polish, smooth)' },
  ],
  'change-development': [
    { word: 'fluctuate', definition: 'rise and fall irregularly', pos: 'v', example: 'Temperatures fluctuate dramatically between day and night in the desert.', etymology: 'Latin fluctuare (to wave), from fluctus (wave)' },
    { word: 'diminish', definition: 'make or become less', pos: 'v', example: 'His enthusiasm did not diminish despite repeated setbacks.', etymology: 'Latin diminuere (to break into small pieces)' },
    { word: 'catalyze', definition: 'cause or accelerate a process', pos: 'v', example: 'The discovery catalyzed a revolution in medical treatment.', etymology: 'Greek katalysis (dissolution), from kata- (down) + lyein (to loosen)' },
    { word: 'proliferate', definition: 'increase rapidly in number', pos: 'v', example: 'Social media platforms have proliferated in the last decade.', etymology: 'Latin proles (offspring) + ferre (to bear)' },
    { word: 'evolve', definition: 'develop gradually over time', pos: 'v', example: 'The author\'s style evolved significantly between her first and last novels.', etymology: 'Latin evolvere (to unroll), from e- (out) + volvere (to roll)' },
    { word: 'stagnate', definition: 'cease developing or making progress', pos: 'v', example: 'Without new investment, the economy will stagnate.', etymology: 'Latin stagnare (to form a pool), from stagnum (standing water)' },
  ],
  'positive-attributes': [
    { word: 'astute', definition: 'having sharp judgment; shrewd', pos: 'adj', example: 'The astute investor recognized the opportunity before anyone else.', etymology: 'Latin astutus (crafty), from astus (craft, cunning)' },
    { word: 'diligent', definition: 'having careful and persistent effort', pos: 'adj', example: 'Her diligent research uncovered previously unknown documents.', etymology: 'Latin diligere (to value highly, love)' },
    { word: 'eloquent', definition: 'fluent or persuasive in speaking or writing', pos: 'adj', example: 'His eloquent speech brought the audience to tears.', etymology: 'Latin eloqui (to speak out), from e- + loqui (to speak)' },
    { word: 'resilient', definition: 'able to recover quickly from difficulties', pos: 'adj', example: 'The resilient community rebuilt after the hurricane.', etymology: 'Latin resilire (to leap back)' },
    { word: 'innovative', definition: 'featuring new methods; advanced and original', pos: 'adj', example: 'Her innovative approach transformed the field of renewable energy.', etymology: 'Latin innovare (to renew), from novus (new)' },
    { word: 'tenacious', definition: 'holding fast; persistent and determined', pos: 'adj', example: 'The tenacious reporter pursued the story for months.', etymology: 'Latin tenax (holding fast), from tenere (to hold)' },
  ],
  'negative-attributes': [
    { word: 'dogmatic', definition: 'inclined to lay down principles as undeniably true', pos: 'adj', example: 'His dogmatic insistence on tradition stifled innovation.', etymology: 'Greek dogmatikos, from dogma (opinion, decree)' },
    { word: 'pedantic', definition: 'excessively concerned with minor details or rules', pos: 'adj', example: 'The pedantic editor corrected every trivial comma placement.', etymology: 'Italian pedante (teacher), possibly from Greek paideuein (to teach)' },
    { word: 'complacent', definition: 'showing smug satisfaction with oneself', pos: 'adj', example: 'The team grew complacent after their early success.', etymology: 'Latin complacere (to be very pleasing)' },
    { word: 'duplicitous', definition: 'deceitful; double-dealing', pos: 'adj', example: 'The duplicitous diplomat secretly aided both sides of the conflict.', etymology: 'Latin duplex (twofold), from duo (two) + plicare (to fold)' },
    { word: 'myopic', definition: 'lacking foresight or intellectual insight', pos: 'adj', example: 'The company\'s myopic focus on short-term profits ignored long-term risks.', etymology: 'Greek myops (to shut the eyes), from myein (to close) + ops (eye)' },
    { word: 'obstinate', definition: 'stubbornly refusing to change one\'s opinion', pos: 'adj', example: 'The obstinate negotiator refused every reasonable compromise.', etymology: 'Latin obstinare (to persist), from ob- (against) + stare (to stand)' },
  ],
};

const CONNOTATION_BANK = [
  { neutral: 'thin', spectrum: ['emaciated', 'skinny', 'thin', 'slender', 'svelte'], order: 'neg-to-pos' },
  { neutral: 'unusual', spectrum: ['bizarre', 'odd', 'unusual', 'unique', 'extraordinary'], order: 'neg-to-pos' },
  { neutral: 'careful', spectrum: ['obsessive', 'fussy', 'careful', 'meticulous', 'scrupulous'], order: 'neg-to-pos' },
  { neutral: 'confident', spectrum: ['arrogant', 'cocky', 'confident', 'self-assured', 'commanding'], order: 'neg-to-pos' },
  { neutral: 'talk', spectrum: ['harangue', 'chatter', 'talk', 'discuss', 'deliberate'], order: 'neg-to-pos' },
  { neutral: 'old', spectrum: ['decrepit', 'dated', 'old', 'mature', 'venerable'], order: 'neg-to-pos' },
  { neutral: 'firm', spectrum: ['obstinate', 'stubborn', 'firm', 'resolute', 'steadfast'], order: 'neg-to-pos' },
  { neutral: 'ask', spectrum: ['interrogate', 'pry', 'ask', 'inquire', 'investigate'], order: 'neg-to-pos' },
  { neutral: 'group', spectrum: ['mob', 'crowd', 'group', 'assembly', 'congregation'], order: 'neg-to-pos' },
  { neutral: 'smell', spectrum: ['stench', 'odor', 'smell', 'scent', 'fragrance'], order: 'neg-to-pos' },
];

const CONTEXT_PASSAGES = [
  { passage: 'Though her colleagues dismissed the idea as impractical, she remained ___ in her belief that the project could succeed.', word: 'steadfast', options: ['steadfast', 'obstinate', 'complacent', 'ambivalent'], skill: 'inference-from-contrast', hint: '"Though...dismissed" signals contrast with her belief.' },
  { passage: 'The detective\'s ___ attention to detail—noting a thread on the carpet, a faint scent of perfume—ultimately solved the case.', word: 'meticulous', options: ['meticulous', 'cursory', 'negligible', 'sporadic'], skill: 'inference-from-example', hint: 'The examples (thread, scent) show extreme care.' },
  { passage: 'The medication, once considered a panacea—that is, a ___ for all ailments—was found to have serious side effects.', word: 'remedy', options: ['remedy', 'symptom', 'diagnosis', 'ailment'], skill: 'inference-from-restatement', hint: '"That is" signals a restatement of "panacea."' },
  { passage: 'Unlike her garrulous sister who talked nonstop, Maria was ___, preferring to listen before speaking.', word: 'reticent', options: ['reticent', 'eloquent', 'loquacious', 'boisterous'], skill: 'inference-from-contrast', hint: '"Unlike...garrulous" signals the opposite of talkative.' },
  { passage: 'The author\'s prose was anything but turgid; instead, her writing was ___ and clear, every word precisely chosen.', word: 'concise', options: ['concise', 'verbose', 'ornate', 'turgid'], skill: 'inference-from-contrast', hint: '"Anything but turgid" + "clear" + "precisely chosen" = the opposite of overblown.' },
  { passage: 'Her philanthropy—her generous donations to hospitals, schools, and shelters—revealed a truly ___ spirit.', word: 'benevolent', options: ['benevolent', 'malevolent', 'indifferent', 'parsimonious'], skill: 'inference-from-example', hint: 'Generous donations to many causes show goodwill.' },
  { passage: 'The new policy was meant to ameliorate, or ___, the harsh conditions faced by workers in the factory.', word: 'improve', options: ['improve', 'worsen', 'maintain', 'analyze'], skill: 'inference-from-restatement', hint: '"Or" signals a restatement of "ameliorate."' },
  { passage: 'The CEO\'s ___ approach to leadership—refusing to consider any feedback—eventually led to the company\'s decline.', word: 'dogmatic', options: ['dogmatic', 'pragmatic', 'innovative', 'collaborative'], skill: 'inference-from-example', hint: '"Refusing to consider any feedback" shows rigid thinking.' },
  { passage: 'While the first experiment yielded ___ results with only minor changes, the second produced a dramatic transformation.', word: 'negligible', options: ['negligible', 'substantial', 'volatile', 'unprecedented'], skill: 'inference-from-contrast', hint: '"Only minor changes" contrasted with "dramatic transformation."' },
  { passage: 'The speaker\'s words were so ___ that many in the audience were moved to tears, later calling it the most powerful speech they had ever heard.', word: 'eloquent', options: ['eloquent', 'mundane', 'terse', 'incomprehensible'], skill: 'inference-from-example', hint: '"Moved to tears" and "most powerful speech" show effective language.' },
];

const ETYMOLOGY_BANK = [
  { word: 'sanguine', origin: 'Latin sanguineus (of blood)', history: 'Medieval belief that blood made people cheerful; shifted from "bloody" to "optimistic."', modern: 'Optimistic, especially in difficult situations.' },
  { word: 'salary', origin: 'Latin salarium (salt money)', history: 'Roman soldiers were partly paid in salt, a valuable commodity for preserving food.', modern: 'Fixed regular payment from an employer.' },
  { word: 'candidate', origin: 'Latin candidatus (clothed in white)', history: 'Roman office-seekers wore white togas to symbolize purity of character.', modern: 'A person who applies for a job or is nominated for election.' },
  { word: 'quarantine', origin: 'Italian quarantina (forty days)', history: 'Ships arriving in Venice during plague had to anchor offshore for 40 days.', modern: 'A period of isolation to prevent spread of disease.' },
  { word: 'meticulous', origin: 'Latin meticulosus (fearful)', history: 'From metus (fear); originally meant timid, then shifted to meaning extremely careful.', modern: 'Showing great attention to detail.' },
  { word: 'nice', origin: 'Latin nescius (ignorant)', history: 'Evolved from "foolish" to "fussy" to "delicate" to "pleasant" over 700 years.', modern: 'Pleasant, agreeable, satisfactory.' },
  { word: 'muscle', origin: 'Latin musculus (little mouse)', history: 'Romans thought flexing muscles looked like mice moving under the skin.', modern: 'Tissue that produces movement by contraction.' },
  { word: 'disaster', origin: 'Italian disastro (ill-starred)', history: 'From dis- (bad) + astro (star); blamed on unfavorable planetary alignment.', modern: 'A sudden catastrophic event causing damage or suffering.' },
  { word: 'villain', origin: 'Latin villanus (farmhand)', history: 'Originally a feudal serf; upper classes equated low birth with low morals.', modern: 'A wicked person or a character opposing the hero.' },
  { word: 'trivial', origin: 'Latin trivium (crossroads)', history: 'From tri- (three) + via (road); common knowledge discussed at crossroads.', modern: 'Of little value or importance.' },
];

const WORD_OF_DAY_BANK = [
  { word: 'perspicacious', definition: 'having keen mental perception and understanding', pos: 'adj', example: 'The perspicacious critic noticed the subtle allusions others missed.', roots: 'Latin perspicax, from per- (through) + specere (to look)', family: ['perspicacity (n)', 'perspicaciously (adv)'] },
  { word: 'equivocate', definition: 'use ambiguous language to conceal the truth', pos: 'v', example: 'The politician equivocated rather than giving a direct answer.', roots: 'Latin aequivocus, from aequus (equal) + vox (voice)', family: ['equivocation (n)', 'equivocal (adj)', 'unequivocal (adj)'] },
  { word: 'ephemeral', definition: 'lasting for a very short time', pos: 'adj', example: 'The ephemeral beauty of cherry blossoms reminds us to appreciate each moment.', roots: 'Greek ephemeros (lasting only a day), from epi- (on) + hemera (day)', family: ['ephemerality (n)', 'ephemera (n)'] },
  { word: 'ubiquitous', definition: 'present, appearing, or found everywhere', pos: 'adj', example: 'Smartphones have become ubiquitous in modern society.', roots: 'Latin ubique (everywhere), from ubi (where)', family: ['ubiquity (n)', 'ubiquitously (adv)'] },
  { word: 'sycophant', definition: 'a person who acts obsequiously to gain advantage', pos: 'n', example: 'The executive surrounded herself with sycophants who never challenged her ideas.', roots: 'Greek sykophantes (informer), from sykon (fig) + phainein (to show)', family: ['sycophantic (adj)', 'sycophancy (n)'] },
  { word: 'recalcitrant', definition: 'having an obstinately uncooperative attitude', pos: 'adj', example: 'The recalcitrant student refused to follow classroom rules.', roots: 'Latin recalcitrare (to kick back), from re- (back) + calcitrare (to kick)', family: ['recalcitrance (n)'] },
  { word: 'pulchritude', definition: 'beauty', pos: 'n', example: 'The poet wrote odes to the pulchritude of the natural world.', roots: 'Latin pulchritudo (beauty), from pulcher (beautiful)', family: ['pulchritudinous (adj)'] },
  { word: 'magnanimous', definition: 'generous or forgiving, especially toward a rival', pos: 'adj', example: 'In a magnanimous gesture, the victor praised her opponent\'s effort.', roots: 'Latin magnanimus, from magnus (great) + animus (soul)', family: ['magnanimity (n)', 'magnanimously (adv)'] },
  { word: 'obfuscate', definition: 'make obscure or unclear', pos: 'v', example: 'Legal jargon often obfuscates the meaning of important documents.', roots: 'Latin obfuscare, from ob- (over) + fuscare (to darken)', family: ['obfuscation (n)', 'obfuscatory (adj)'] },
  { word: 'cacophony', definition: 'a harsh, discordant mixture of sounds', pos: 'n', example: 'The cacophony of car horns and construction filled the city street.', roots: 'Greek kakophonia, from kakos (bad) + phone (sound)', family: ['cacophonous (adj)', 'euphony (antonym)'] },
  { word: 'insipid', definition: 'lacking flavor or interest; dull', pos: 'adj', example: 'The critic found the novel insipid, devoid of any original thought.', roots: 'Latin insipidus, from in- (not) + sapidus (tasty), from sapere (to taste)', family: ['insipidity (n)', 'insipidly (adv)'] },
  { word: 'inexorable', definition: 'impossible to stop or prevent', pos: 'adj', example: 'The inexorable march of technology continues to reshape society.', roots: 'Latin inexorabilis, from in- (not) + exorare (to prevail upon)', family: ['inexorably (adv)', 'inexorability (n)'] },
  { word: 'verisimilitude', definition: 'the appearance of being true or real', pos: 'n', example: 'The historical novel achieved verisimilitude through meticulous period detail.', roots: 'Latin verisimilitudo, from verus (true) + similis (similar)', family: ['verisimilar (adj)'] },
  { word: 'languid', definition: 'lacking energy or vitality; weak or faint', pos: 'adj', example: 'The languid summer afternoon invited long naps on the porch.', roots: 'Latin languidus, from languere (to be faint)', family: ['languor (n)', 'languidly (adv)', 'languish (v)'] },
];

const REGISTER_BANK = [
  { concept: 'making a mistake', levels: { intimate: 'I messed up bad', casual: 'I made a mistake', consultative: 'I committed an error', formal: 'An oversight was made', frozen: 'A transgression has been duly noted' } },
  { concept: 'disagreeing', levels: { intimate: "No way, that's wrong", casual: 'I don\'t really agree', consultative: 'I see it differently', formal: 'I respectfully disagree with that assessment', frozen: 'The dissenting opinion holds that...' } },
  { concept: 'asking for help', levels: { intimate: 'Help me out here!', casual: 'Could you give me a hand?', consultative: 'Would you be able to assist me?', formal: 'I would appreciate your assistance in this matter', frozen: 'The petitioner humbly requests the aid of...' } },
  { concept: 'expressing anger', levels: { intimate: "I'm so mad I could scream", casual: "That really ticks me off", consultative: 'I find this quite frustrating', formal: 'This situation has caused considerable consternation', frozen: 'The aggrieved party registers its vehement objection' } },
  { concept: 'praising someone', levels: { intimate: "You're the best!", casual: 'Great job on that', consultative: 'Your work is commendable', formal: 'Your contribution has been exemplary', frozen: 'It is hereby recognized that outstanding merit has been demonstrated' } },
];

const DOMAIN_VOCAB = {
  'literary-analysis': [
    { term: 'motif', definition: 'a recurring element that has symbolic significance', example: 'The motif of water appears throughout the novel, symbolizing rebirth.' },
    { term: 'verisimilitude', definition: 'the appearance of being real or true in a work of fiction', example: 'The dialogue\'s verisimilitude made the characters feel authentic.' },
    { term: 'denouement', definition: 'the final outcome or resolution of a plot', example: 'In the denouement, all the mysteries are resolved and the characters find peace.' },
    { term: 'bildungsroman', definition: 'a novel about a young person\'s moral and psychological growth', example: 'Jane Eyre is a classic bildungsroman tracing the heroine\'s journey to adulthood.' },
    { term: 'allegory', definition: 'a narrative in which characters and events represent abstract ideas', example: 'Animal Farm is an allegory for the Russian Revolution.' },
    { term: 'juxtaposition', definition: 'placing two things close together for contrasting effect', example: 'The juxtaposition of wealth and poverty highlighted the story\'s social critique.' },
  ],
  'rhetoric': [
    { term: 'polemic', definition: 'a strong written or spoken attack on a position', example: 'The essay was a polemic against corporate greed.' },
    { term: 'invective', definition: 'insulting or abusive language', example: 'The candidate\'s speech devolved into personal invective.' },
    { term: 'apologia', definition: 'a formal written defense of one\'s opinions or conduct', example: 'The scientist published an apologia defending her controversial methods.' },
    { term: 'encomium', definition: 'a speech or piece of writing that praises someone highly', example: 'The eulogy was an encomium celebrating her lifelong contributions.' },
    { term: 'antithesis', definition: 'a contrast of ideas expressed through parallel structure', example: '"It was the best of times, it was the worst of times" is a famous antithesis.' },
    { term: 'chiasmus', definition: 'reversal of grammatical structures in successive clauses', example: '"Ask not what your country can do for you; ask what you can do for your country."' },
  ],
  'philosophy': [
    { term: 'epistemology', definition: 'the branch of philosophy concerned with knowledge', example: 'Epistemology asks: how do we know what we know?' },
    { term: 'ontology', definition: 'the branch of philosophy concerned with the nature of being', example: 'Ontology examines what it means for something to exist.' },
    { term: 'empirical', definition: 'based on observation or experience rather than theory', example: 'The claim required empirical evidence, not just speculation.' },
    { term: 'dialectic', definition: 'the art of investigating truth through discussion', example: 'Socratic dialectic uses questions to expose contradictions in reasoning.' },
    { term: 'existential', definition: 'relating to existence, especially human existence', example: 'The novel explores existential themes of freedom and responsibility.' },
    { term: 'heuristic', definition: 'a practical problem-solving approach, not guaranteed to be optimal', example: 'The "rule of thumb" is a common heuristic for quick decisions.' },
  ],
};

const WORD_FAMILIES = [
  { root: '-duc-/-duct-', meaning: 'lead', family: ['conduct', 'deduce', 'induce', 'produce', 'reduce', 'educate', 'conducive', 'induction'] },
  { root: '-spec-/-spect-', meaning: 'look, see', family: ['inspect', 'spectacle', 'perspective', 'circumspect', 'retrospect', 'prospect', 'introspect', 'auspicious'] },
  { root: '-scrib-/-script-', meaning: 'write', family: ['describe', 'prescribe', 'inscribe', 'circumscribe', 'manuscript', 'transcript', 'nondescript', 'conscription'] },
  { root: '-port-', meaning: 'carry', family: ['transport', 'import', 'export', 'report', 'deport', 'portable', 'comport', 'purport'] },
  { root: '-vert-/-vers-', meaning: 'turn', family: ['convert', 'revert', 'divert', 'subvert', 'avert', 'versatile', 'controversial', 'introvert'] },
  { root: '-cred-', meaning: 'believe', family: ['credible', 'credulous', 'incredible', 'accredit', 'creed', 'credential', 'credence', 'discredit'] },
  { root: '-voc-/-vok-', meaning: 'call, voice', family: ['invoke', 'provoke', 'revoke', 'evoke', 'advocate', 'equivocate', 'vociferous', 'vocabulary'] },
  { root: '-path-', meaning: 'feeling, suffering', family: ['empathy', 'sympathy', 'apathy', 'antipathy', 'pathology', 'psychopath', 'pathos', 'pathetic'] },
];

const SEMANTIC_DRIFT = [
  { word: 'nice', stages: ['foolish (1300s)', 'fussy (1400s)', 'delicate (1500s)', 'agreeable (1700s)', 'pleasant (modern)'], type: 'amelioration' },
  { word: 'villain', stages: ['farmhand (1300s)', 'person of low birth (1400s)', 'scoundrel (1500s)', 'evil person (modern)'], type: 'pejoration' },
  { word: 'silly', stages: ['blessed, happy (1200s)', 'innocent (1300s)', 'pitiable (1400s)', 'weak (1500s)', 'foolish (modern)'], type: 'pejoration' },
  { word: 'awful', stages: ['full of awe (1200s)', 'inspiring wonder (1400s)', 'very bad (1800s)'], type: 'pejoration' },
  { word: 'terrific', stages: ['causing terror (1600s)', 'very great (1800s)', 'wonderful (modern)'], type: 'amelioration' },
];

const DOUBLETS = [
  { pair: ['regal', 'royal'], origin: 'Both from Latin regalis (kingly); regal came directly, royal through French.' },
  { pair: ['fragile', 'frail'], origin: 'Both from Latin fragilis (breakable); fragile came directly, frail through French.' },
  { pair: ['pauper', 'poor'], origin: 'Both from Latin pauper; pauper came directly, poor through French.' },
  { pair: ['camera', 'chamber'], origin: 'Both from Latin camera (vaulted room); chamber through French, camera kept Latin form.' },
  { pair: ['captain', 'chieftain'], origin: 'Both from Latin capitaneus (chief); captain through French, chieftain through Old French.' },
];

// ── Exercise Banks ──

const EXERCISE_BANKS = {
  'grade-9': {
    'inference-from-contrast': {
      items: CONTEXT_PASSAGES.filter(p => p.skill === 'inference-from-contrast').map(p => ({
        passage: p.passage, options: p.options, answer: p.word, hint: p.hint
      })),
    },
    'inference-from-restatement': {
      items: CONTEXT_PASSAGES.filter(p => p.skill === 'inference-from-restatement').map(p => ({
        passage: p.passage, options: p.options, answer: p.word, hint: p.hint
      })),
    },
    'inference-from-example': {
      items: CONTEXT_PASSAGES.filter(p => p.skill === 'inference-from-example').map(p => ({
        passage: p.passage, options: p.options, answer: p.word, hint: p.hint
      })),
    },
    'common-prefixes': {
      items: ROOTS_BANK.prefixes.map(r => ({
        prompt: `What does the prefix "${r.prefix}" mean?`, answer: r.meaning, examples: r.examples, type: 'root-meaning'
      })),
    },
    'common-roots': {
      items: ROOTS_BANK.roots.map(r => ({
        prompt: `What does the root "${r.root}" mean?`, answer: r.meaning, examples: r.examples, type: 'root-meaning'
      })),
    },
    'common-suffixes': {
      items: ROOTS_BANK.suffixes.map(r => ({
        prompt: `What does the suffix "${r.suffix}" mean?`, answer: r.meaning, examples: r.examples, type: 'root-meaning'
      })),
    },
    'noun-verb-adj-adv': {
      items: [
        { base: 'create', family: { noun: 'creation', verb: 'create', adj: 'creative', adv: 'creatively' }, prompt: 'Give the adjective form of "create".', answer: 'creative' },
        { base: 'persuade', family: { noun: 'persuasion', verb: 'persuade', adj: 'persuasive', adv: 'persuasively' }, prompt: 'Give the noun form of "persuade".', answer: 'persuasion' },
        { base: 'analyze', family: { noun: 'analysis', verb: 'analyze', adj: 'analytical', adv: 'analytically' }, prompt: 'Give the adjective form of "analyze".', answer: 'analytical' },
        { base: 'decide', family: { noun: 'decision', verb: 'decide', adj: 'decisive', adv: 'decisively' }, prompt: 'Give the adverb form of "decide".', answer: 'decisively' },
        { base: 'dominate', family: { noun: 'dominance', verb: 'dominate', adj: 'dominant', adv: 'dominantly' }, prompt: 'Give the noun form of "dominate".', answer: 'dominance' },
        { base: 'signify', family: { noun: 'significance', verb: 'signify', adj: 'significant', adv: 'significantly' }, prompt: 'Give the adverb form of "signify".', answer: 'significantly' },
        { base: 'persist', family: { noun: 'persistence', verb: 'persist', adj: 'persistent', adv: 'persistently' }, prompt: 'Give the adjective form of "persist".', answer: 'persistent' },
        { base: 'vary', family: { noun: 'variation', verb: 'vary', adj: 'variable', adv: 'variably' }, prompt: 'Give the noun form of "vary".', answer: 'variation' },
      ],
    },
    'derivational-patterns': {
      items: [
        { prompt: 'Add a suffix to "courage" to make an adjective.', answer: 'courageous', rule: '-ous turns nouns into adjectives' },
        { prompt: 'Add a prefix to "possible" to make it negative.', answer: 'impossible', rule: 'im- negates adjectives starting with p/b/m' },
        { prompt: 'Add a suffix to "govern" to make a noun.', answer: 'government', rule: '-ment turns verbs into nouns' },
        { prompt: 'Add a suffix to "happy" to make a noun.', answer: 'happiness', rule: '-ness turns adjectives into nouns' },
        { prompt: 'Add a prefix to "do" to mean "do again".', answer: 'redo', rule: 're- means again' },
        { prompt: 'Add a suffix to "act" to make a noun meaning "one who acts".', answer: 'actor', rule: '-or/-er means one who does' },
        { prompt: 'Add a suffix to "educate" to make a noun.', answer: 'education', rule: '-tion turns verbs into nouns' },
        { prompt: 'Add a prefix to "legal" to mean "not legal".', answer: 'illegal', rule: 'il- negates adjectives starting with l' },
      ],
    },
    'tier2-foundations': {
      items: SAT_WORDS['positive-attributes'].concat(SAT_WORDS['tone-attitude']).map(w => ({
        prompt: `Define "${w.word}".`, answer: w.definition, pos: w.pos, example: w.example, type: 'definition'
      })),
    },
    'cross-curricular-terms': {
      items: DOMAIN_VOCAB['philosophy'].concat(DOMAIN_VOCAB['literary-analysis'].slice(0, 3)).map(d => ({
        prompt: `Define the academic term "${d.term}".`, answer: d.definition, example: d.example, type: 'definition'
      })),
    },
    'positive-negative-neutral': {
      items: CONNOTATION_BANK.map(c => ({
        prompt: `Rank these words from most negative to most positive: ${shuffle(c.spectrum).join(', ')}`,
        answer: c.spectrum.join(', '), neutral: c.neutral, type: 'connotation-rank'
      })),
    },
    'synonym-ranking': {
      items: CONNOTATION_BANK.map(c => {
        const pair = [c.spectrum[0], c.spectrum[4]];
        return { prompt: `Which word is more positive: "${pair[0]}" or "${pair[1]}"?`, answer: pair[1], explanation: `"${pair[1]}" has a more positive connotation than "${pair[0]}".`, type: 'connotation-compare' };
      }),
    },
    'guide-words-entries': {
      items: [
        { prompt: 'A word has 3 dictionary definitions. The passage is about chemistry. Which definition do you choose?', answer: 'the one related to science/chemistry context', hint: 'Match the definition to the subject area of the passage.', type: 'strategy' },
        { prompt: 'The word "volatile" can mean "evaporating quickly" or "liable to change rapidly." In a passage about politics, which meaning applies?', answer: 'liable to change rapidly', hint: 'Context determines which meaning to apply.', type: 'strategy' },
        { prompt: '"Bank" can mean a financial institution or the side of a river. In "We walked along the bank, watching fish," which meaning?', answer: 'the side of a river', hint: 'Clues: walking along, watching fish.', type: 'strategy' },
        { prompt: '"Compound" can mean a chemical mixture, to make worse, or an enclosed area. In "The error will compound over time," which?', answer: 'to make worse', hint: 'The phrase "over time" suggests increasing severity.', type: 'strategy' },
        { prompt: '"Gravity" can mean seriousness or the force of attraction. In "The gravity of the situation demanded immediate action," which?', answer: 'seriousness', hint: '"Demanded immediate action" signals an urgent situation.', type: 'strategy' },
        { prompt: '"Culture" can mean artistic/intellectual achievement or growing organisms in a lab. In "The culture showed bacterial growth," which?', answer: 'growing organisms in a lab', hint: '"Bacterial growth" is a science context.', type: 'strategy' },
      ],
    },
    'multiple-meanings': {
      items: [
        { word: 'articulate', meanings: ['(adj) having clear, effective speech', '(v) to express clearly', '(adj) having joints or segments'], prompt: 'Use "articulate" as a verb in a sentence.', answer: 'express clearly', type: 'multiple-meaning' },
        { word: 'sanction', meanings: ['(n) official permission', '(n) a penalty for disobeying a law', '(v) to give official approval'], prompt: '"Sanction" is unusual because it can mean both approval and penalty. This is called what?', answer: 'contronym', type: 'multiple-meaning' },
        { word: 'novel', meanings: ['(n) a long fictional narrative', '(adj) new and unusual'], prompt: 'Use "novel" as an adjective.', answer: 'new and unusual', type: 'multiple-meaning' },
        { word: 'grave', meanings: ['(n) a burial place', '(adj) serious and solemn', '(v) to engrave'], prompt: '"The doctor\'s grave expression worried the family." Which meaning?', answer: 'serious and solemn', type: 'multiple-meaning' },
        { word: 'execute', meanings: ['(v) carry out a plan', '(v) put to death', '(v) perform a skillful action'], prompt: '"The gymnast executed a flawless routine." Which meaning?', answer: 'perform a skillful action', type: 'multiple-meaning' },
        { word: 'tender', meanings: ['(adj) gentle and caring', '(adj) soft or painful to touch', '(v) to offer formally', '(n) a formal offer'], prompt: '"She tendered her resignation." Which meaning?', answer: 'to offer formally', type: 'multiple-meaning' },
      ],
    },
  },
  'grade-10': {
    'tone-attitude-words': {
      items: SAT_WORDS['tone-attitude'].map(w => ({
        prompt: `In a passage, the author\'s tone is described as "${w.word}." What does this mean?`,
        answer: w.definition, example: w.example, etymology: w.etymology, type: 'sat-definition'
      })),
    },
    'argument-rhetoric-words': {
      items: SAT_WORDS['argument-rhetoric'].map(w => ({
        prompt: `The question says: "The author uses evidence to ___ the claim." Fill in: "${w.word}" means?`,
        answer: w.definition, example: w.example, etymology: w.etymology, type: 'sat-definition'
      })),
    },
    'change-development-words': {
      items: SAT_WORDS['change-development'].map(w => ({
        prompt: `Define "${w.word}" as used in SAT passages about processes and trends.`,
        answer: w.definition, example: w.example, etymology: w.etymology, type: 'sat-definition'
      })),
    },
    'formality-levels': {
      items: REGISTER_BANK.map(r => ({
        prompt: `Rewrite "${r.levels.casual}" in formal register.`,
        answer: r.levels.formal, concept: r.concept, allLevels: r.levels, type: 'register'
      })),
    },
    'audience-awareness': {
      items: REGISTER_BANK.map(r => ({
        prompt: `Which register is this? "${r.levels.frozen}"`,
        answer: 'frozen/ceremonial', concept: r.concept, type: 'register-identify'
      })),
    },
    'greek-combining-forms': {
      items: [
        { prompt: 'What does the Greek combining form "phil-" mean?', answer: 'love', examples: ['philosophy', 'philanthropy', 'bibliophile'] },
        { prompt: 'What does "mis-/miso-" mean in Greek?', answer: 'hatred', examples: ['misanthrope', 'misogyny', 'misology'] },
        { prompt: 'What does "-logy" mean?', answer: 'study of', examples: ['biology', 'etymology', 'pathology'] },
        { prompt: 'What does "auto-" mean?', answer: 'self', examples: ['autobiography', 'autonomy', 'autocratic'] },
        { prompt: 'What does "poly-" mean?', answer: 'many', examples: ['polygon', 'polyglot', 'polysemous'] },
        { prompt: 'What does "pseudo-" mean?', answer: 'false', examples: ['pseudonym', 'pseudoscience', 'pseudointellectual'] },
        { prompt: 'What does "neo-" mean?', answer: 'new', examples: ['neologism', 'neoclassical', 'neonatal'] },
        { prompt: 'What does "pan-" mean?', answer: 'all', examples: ['pandemic', 'panorama', 'panacea'] },
      ],
    },
    'latin-verb-roots': {
      items: ROOTS_BANK.roots.slice(0, 8).map(r => ({
        prompt: `The Latin root "${r.root}" means "${r.meaning}." Which word uses this root?`,
        options: [...r.examples.slice(0, 1), 'benevolent', 'ephemeral', 'ubiquitous'].sort(),
        answer: r.examples[0], type: 'root-apply'
      })),
    },
    'literary-analysis-terms': {
      items: DOMAIN_VOCAB['literary-analysis'].map(d => ({
        prompt: `Define the literary term "${d.term}".`, answer: d.definition, example: d.example, type: 'definition'
      })),
    },
    'science-writing-terms': {
      items: [
        { prompt: 'Define "hypothesis" in scientific writing.', answer: 'a proposed explanation made on the basis of limited evidence, to be tested', example: 'The hypothesis predicted that increased sunlight would accelerate growth.', type: 'definition' },
        { prompt: 'Define "correlation" in scientific writing.', answer: 'a mutual relationship between two or more things, not necessarily causal', example: 'There is a correlation between exercise and improved mood.', type: 'definition' },
        { prompt: 'Define "paradigm" in academic usage.', answer: 'a typical example or pattern; a worldview or framework of understanding', example: 'Einstein\'s work created a new paradigm in physics.', type: 'definition' },
        { prompt: 'Define "anomaly" in scientific context.', answer: 'something that deviates from what is standard, normal, or expected', example: 'The anomaly in the data prompted further investigation.', type: 'definition' },
        { prompt: 'Define "empirical" in research context.', answer: 'based on observation or experience rather than theory or pure logic', example: 'The study provided empirical evidence supporting the theory.', type: 'definition' },
        { prompt: 'What does "replicate" mean in science?', answer: 'to reproduce or repeat an experiment to verify results', example: 'Other labs attempted to replicate the findings.', type: 'definition' },
      ],
    },
    'idiom-origins': {
      items: [
        { prompt: 'What does "bite the bullet" mean and where does it come from?', answer: 'to endure a painful situation bravely', origin: 'Patients bit on bullets during surgery before anesthesia.', type: 'idiom' },
        { prompt: 'What does "turn a blind eye" mean?', answer: 'to deliberately ignore something', origin: 'Admiral Nelson allegedly held a telescope to his blind eye to avoid seeing a signal to retreat.', type: 'idiom' },
        { prompt: 'What does "the whole nine yards" mean?', answer: 'everything; the full extent', origin: 'Possibly from the length of ammunition belts in WWII fighter planes.', type: 'idiom' },
        { prompt: 'What does "red herring" mean in argument?', answer: 'a misleading clue or distraction from the real issue', origin: 'Smoked herring (which turns red) was used to train hunting dogs by misleading them off the trail.', type: 'idiom' },
        { prompt: 'What does "Pyrrhic victory" mean?', answer: 'a victory that comes at such great cost it is practically a defeat', origin: 'King Pyrrhus of Epirus won battles against Rome but lost so many men he could not continue.', type: 'idiom' },
        { prompt: 'What does "Sisyphean task" mean?', answer: 'an endless, futile labor', origin: 'In Greek myth, Sisyphus was condemned to roll a boulder uphill forever.', type: 'idiom' },
      ],
    },
    'metaphor-vocabulary': {
      items: [
        { prompt: 'What is a "dead metaphor"?', answer: 'a metaphor so common it is no longer recognized as figurative', example: '"Foot of the mountain" — we forget "foot" is metaphorical.', type: 'figurative' },
        { prompt: 'What is a "mixed metaphor"?', answer: 'combining two incompatible metaphors, often unintentionally', example: '"We\'ll burn that bridge when we come to it" mixes "cross that bridge" and "burn bridges."', type: 'figurative' },
        { prompt: 'What is an "extended metaphor"?', answer: 'a metaphor developed over several lines or an entire work', example: 'Shakespeare\'s "All the world\'s a stage" speech extends the theater metaphor.', type: 'figurative' },
        { prompt: 'What is "synecdoche"?', answer: 'using a part to represent the whole, or vice versa', example: '"All hands on deck" — "hands" represents whole sailors.', type: 'figurative' },
        { prompt: 'What is "metonymy"?', answer: 'substituting the name of an attribute or related thing for the thing itself', example: '"The pen is mightier than the sword" — pen = writing, sword = military force.', type: 'figurative' },
        { prompt: 'What is "catachresis"?', answer: 'deliberate misuse of a word or strained metaphor for rhetorical effect', example: '"I will speak daggers to her" — Shakespeare uses a physical object as verbal action.', type: 'figurative' },
      ],
    },
    'near-synonym-distinctions': {
      items: [
        { prompt: 'Distinguish between "uninterested" and "disinterested".', answer: '"Uninterested" means bored/not caring; "disinterested" means impartial/without bias.', type: 'nuance' },
        { prompt: 'Distinguish between "imply" and "infer".', answer: '"Imply" means to suggest indirectly (speaker does it); "infer" means to conclude from evidence (listener does it).', type: 'nuance' },
        { prompt: 'Distinguish between "emigrate" and "immigrate".', answer: '"Emigrate" means to leave one\'s country; "immigrate" means to enter a new country.', type: 'nuance' },
        { prompt: 'Distinguish between "notorious" and "famous".', answer: '"Notorious" means famous for something bad; "famous" is neutral or positive.', type: 'nuance' },
        { prompt: 'Distinguish between "continual" and "continuous".', answer: '"Continual" means recurring frequently; "continuous" means without interruption.', type: 'nuance' },
        { prompt: 'Distinguish between "flaunt" and "flout".', answer: '"Flaunt" means to display proudly; "flout" means to openly disregard a rule.', type: 'nuance' },
      ],
    },
    'context-dependent-meaning': {
      items: [
        { passage: 'The conductor raised his baton and the orchestra fell silent.', word: 'conductor', meaning: 'a person who directs an orchestra', otherMeaning: 'a material that transmits electricity', type: 'context-meaning' },
        { passage: 'The resolution of the conflict required compromise from both sides.', word: 'resolution', meaning: 'the settling of a dispute', otherMeaning: 'the sharpness of an image', type: 'context-meaning' },
        { passage: 'Her prose had a certain gravity that demanded careful reading.', word: 'gravity', meaning: 'seriousness or importance', otherMeaning: 'the force of attraction between masses', type: 'context-meaning' },
        { passage: 'The campaign tried to exploit the candidate\'s record on education.', word: 'exploit', meaning: 'to make use of for one\'s advantage', otherMeaning: 'a bold or daring feat', type: 'context-meaning' },
        { passage: 'The court will address the issue in the next session.', word: 'address', meaning: 'to deal with or discuss', otherMeaning: 'location where someone lives', type: 'context-meaning' },
        { passage: 'The stem of the argument rested on a single piece of evidence.', word: 'stem', meaning: 'the basis or origin of something', otherMeaning: 'the main body of a plant', type: 'context-meaning' },
      ],
    },
  },
  'grade-11': {
    'complex-derivations': {
      items: [
        { prompt: 'Break "incomprehensible" into morphemes.', answer: 'in- (not) + com- (together) + prehend (grasp) + -ible (able to be)', type: 'morphology' },
        { prompt: 'Break "disproportionate" into morphemes.', answer: 'dis- (not) + pro- (forward) + portion (part) + -ate (having)', type: 'morphology' },
        { prompt: 'Break "uncharacteristically" into morphemes.', answer: 'un- (not) + character + -istic (having quality of) + -ally (in manner of)', type: 'morphology' },
        { prompt: 'Break "reconceptualize" into morphemes.', answer: 're- (again) + con- (together) + cept (take) + -ual (relating to) + -ize (to make)', type: 'morphology' },
        { prompt: 'Break "demilitarization" into morphemes.', answer: 'de- (undo) + milit- (soldier) + -ar (relating to) + -ize (to make) + -ation (process)', type: 'morphology' },
        { prompt: 'Break "antidisestablishmentarianism" into morphemes.', answer: 'anti- (against) + dis- (undo) + establish + -ment (result) + -arian (believer) + -ism (belief)', type: 'morphology' },
      ],
    },
    'productive-affixes': {
      items: [
        { prompt: 'The suffix "-ize" turns nouns/adjectives into verbs. Create a verb from "standard".', answer: 'standardize', rule: '-ize = to make or become', type: 'affix-apply' },
        { prompt: 'The prefix "de-" can mean to reverse an action. Apply it to "centralize".', answer: 'decentralize', rule: 'de- = to undo or reverse', type: 'affix-apply' },
        { prompt: 'The suffix "-esque" means "in the style of." Apply it to "picture".', answer: 'picturesque', rule: '-esque = in the manner/style of', type: 'affix-apply' },
        { prompt: 'The suffix "-ification" turns roots into nouns of process. Apply to "class".', answer: 'classification', rule: '-ification = the process of making', type: 'affix-apply' },
        { prompt: 'The prefix "neo-" means "new." Apply it to "classical".', answer: 'neoclassical', rule: 'neo- = new form of', type: 'affix-apply' },
        { prompt: 'The prefix "counter-" means "against." Apply it to "argument".', answer: 'counterargument', rule: 'counter- = opposing', type: 'affix-apply' },
      ],
    },
    'rhetoric-terms': {
      items: DOMAIN_VOCAB['rhetoric'].map(d => ({
        prompt: `Define the rhetoric term "${d.term}".`, answer: d.definition, example: d.example, type: 'definition'
      })),
    },
    'philosophy-terms': {
      items: DOMAIN_VOCAB['philosophy'].map(d => ({
        prompt: `Define "${d.term}" as used in academic writing.`, answer: d.definition, example: d.example, type: 'definition'
      })),
    },
    'social-science-terms': {
      items: [
        { prompt: 'Define "hegemony".', answer: 'dominance of one group over others, especially in politics or culture', example: 'The empire maintained hegemony over the region for centuries.', type: 'definition' },
        { prompt: 'Define "paradigm shift".', answer: 'a fundamental change in approach or underlying assumptions', example: 'The internet caused a paradigm shift in communication.', type: 'definition' },
        { prompt: 'Define "cognitive dissonance".', answer: 'mental discomfort from holding contradictory beliefs simultaneously', example: 'He experienced cognitive dissonance when his actions conflicted with his values.', type: 'definition' },
        { prompt: 'Define "demographic".', answer: 'relating to the structure of populations; a particular sector of a population', example: 'The candidate targeted the youth demographic with social media campaigns.', type: 'definition' },
        { prompt: 'Define "sovereignty".', answer: 'supreme power or authority; the authority of a state to govern itself', example: 'The treaty recognized the nation\'s sovereignty over its territorial waters.', type: 'definition' },
        { prompt: 'Define "socioeconomic".', answer: 'relating to the interaction of social and economic factors', example: 'Socioeconomic status strongly correlates with educational outcomes.', type: 'definition' },
      ],
    },
    'latin-to-english': {
      items: ETYMOLOGY_BANK.filter(e => e.origin.includes('Latin')).map(e => ({
        prompt: `Trace the etymology of "${e.word}".`, answer: `${e.origin}. ${e.history}`, modern: e.modern, type: 'etymology'
      })),
    },
    'greek-to-english': {
      items: [
        { prompt: 'Trace the etymology of "democracy".', answer: 'Greek demokratia, from demos (people) + kratos (power/rule). Government by the people.', type: 'etymology' },
        { prompt: 'Trace the etymology of "philosophy".', answer: 'Greek philosophia, from philos (loving) + sophia (wisdom). Love of wisdom.', type: 'etymology' },
        { prompt: 'Trace the etymology of "catastrophe".', answer: 'Greek katastrophe (overturning), from kata- (down) + strephein (to turn). Originally a dramatic turning point.', type: 'etymology' },
        { prompt: 'Trace the etymology of "enthusiasm".', answer: 'Greek enthousiasmos (divine inspiration), from en- (in) + theos (god). Originally meant "possessed by a god."', type: 'etymology' },
        { prompt: 'Trace the etymology of "sarcasm".', answer: 'Greek sarkasmos (to tear flesh), from sarx (flesh). Originally described speech so cutting it tore the skin.', type: 'etymology' },
        { prompt: 'Trace the etymology of "idiot".', answer: 'Greek idiotes (private person). In Athens, someone who did not participate in public affairs was considered foolish.', type: 'etymology' },
      ],
    },
    'language-borrowing': {
      items: [
        { prompt: 'English borrowed "kindergarten" from which language and what does it literally mean?', answer: 'German: Kinder (children) + Garten (garden). Literally "children\'s garden."', type: 'borrowing' },
        { prompt: '"Tsunami" comes from which language?', answer: 'Japanese: tsu (harbor) + nami (wave). A harbor wave.', type: 'borrowing' },
        { prompt: '"Algebra" comes from which language?', answer: 'Arabic: al-jabr (the reunion of broken parts), from a 9th-century math book by al-Khwarizmi.', type: 'borrowing' },
        { prompt: '"Safari" comes from which language?', answer: 'Swahili/Arabic: safar (journey). Originally any long journey, later specialized to wildlife expeditions.', type: 'borrowing' },
        { prompt: '"Chocolate" comes from which language?', answer: 'Nahuatl (Aztec): xocolatl, possibly from xococ (bitter) + atl (water). Originally a bitter drink.', type: 'borrowing' },
        { prompt: '"Shampoo" comes from which language?', answer: 'Hindi: champo (to press/massage). Originally referred to head massage, later to the cleaning product.', type: 'borrowing' },
      ],
    },
    'ap-lang-terms': {
      items: [
        { prompt: 'Define "rhetorical situation" for AP Language.', answer: 'the context of a communication: speaker, audience, subject, purpose, and occasion', type: 'definition' },
        { prompt: 'Define "concession" in argumentative writing.', answer: 'acknowledging the validity of an opposing point before countering it', example: 'While critics raise valid concerns about cost, the long-term benefits outweigh initial expenses.', type: 'definition' },
        { prompt: 'Define "qualifier" in argumentation.', answer: 'a word or phrase that limits the scope of a claim (e.g., "most," "often," "tends to")', type: 'definition' },
        { prompt: 'Define "synthesis" in AP Lang context.', answer: 'combining ideas from multiple sources to develop a position or argument', type: 'definition' },
        { prompt: 'Define "warrant" in the Toulmin model.', answer: 'the logical connection between the claim and the evidence; the reasoning that justifies the link', type: 'definition' },
        { prompt: 'Define "exigence" in rhetorical analysis.', answer: 'the urgent issue or situation that prompts a speaker or writer to communicate', type: 'definition' },
      ],
    },
    'ap-lit-terms': {
      items: [
        { prompt: 'Define "free indirect discourse".', answer: 'narration that blends third-person narration with a character\'s voice and perspective without quotation marks', example: 'She would not go to the party. What was the point of it all?', type: 'definition' },
        { prompt: 'Define "unreliable narrator".', answer: 'a narrator whose credibility is compromised, forcing readers to question the account', example: 'In "Gone Girl," both narrators prove unreliable.', type: 'definition' },
        { prompt: 'Define "in medias res".', answer: 'beginning a narrative in the middle of the action', example: 'The Iliad begins in the final year of the Trojan War, not at the beginning.', type: 'definition' },
        { prompt: 'Define "dramatic irony".', answer: 'when the audience knows something that the characters do not', example: 'In Romeo and Juliet, the audience knows Juliet is alive while Romeo does not.', type: 'definition' },
        { prompt: 'Define "anagnorisis".', answer: 'a moment of critical discovery or recognition, especially in tragedy', example: 'Oedipus\'s realization that he has fulfilled the prophecy.', type: 'definition' },
        { prompt: 'Define "epistolary" as a literary form.', answer: 'a literary work composed of letters, diary entries, or other documents', example: 'Frankenstein uses an epistolary frame with Walton\'s letters.', type: 'definition' },
      ],
    },
    'unfamiliar-word-deconstruction': {
      items: [
        { prompt: 'Deconstruct "misanthropy": what does each part mean and what is the whole word?', answer: 'mis- (hatred) + anthrop- (human) + -y (state of) = hatred of humanity', type: 'deconstruct' },
        { prompt: 'Deconstruct "circumlocution".', answer: 'circum- (around) + locut- (speak) + -ion (act of) = speaking around a topic; using many words to avoid directness', type: 'deconstruct' },
        { prompt: 'Deconstruct "magniloquent".', answer: 'magni- (great) + loqu- (speak) + -ent (having quality) = speaking in a grand or pompous way', type: 'deconstruct' },
        { prompt: 'Deconstruct "pusillanimous".', answer: 'pusill- (very small, from Latin pusillus) + anim- (spirit/mind) + -ous (full of) = having a small spirit; cowardly', type: 'deconstruct' },
        { prompt: 'Deconstruct "verisimilitude".', answer: 'veri- (truth) + simil- (similar) + -tude (state of) = the state of appearing true or real', type: 'deconstruct' },
        { prompt: 'Deconstruct "sesquipedalian".', answer: 'sesqui- (one and a half) + pedal- (foot) + -ian (relating to) = literally a foot and a half long; using long words', type: 'deconstruct' },
      ],
    },
    'context-plus-morphology': {
      items: [
        { passage: 'The professor\'s ___ lecture put half the audience to sleep.', word: 'soporific', options: ['soporific', 'galvanizing', 'perspicacious', 'mellifluous'], hint: 'sopor- (sleep) + -ific (causing). Context confirms: put audience to sleep.', type: 'context-morph' },
        { passage: 'Her ___ nature made her beloved by all; she always put others\' needs first.', word: 'magnanimous', options: ['magnanimous', 'pusillanimous', 'parsimonious', 'acrimonious'], hint: 'magn- (great) + anim- (spirit). Context: beloved, puts others first.', type: 'context-morph' },
        { passage: 'The ___ child was always asking questions about how everything worked.', word: 'inquisitive', options: ['inquisitive', 'reticent', 'indolent', 'belligerent'], hint: 'in- (into) + quis- (ask) + -itive. Context: always asking questions.', type: 'context-morph' },
        { passage: 'The law was designed to ___ the power of large corporations.', word: 'circumscribe', options: ['circumscribe', 'proliferate', 'substantiate', 'corroborate'], hint: 'circum- (around) + scribe (write/draw). To draw limits around = to restrict.', type: 'context-morph' },
        { passage: 'After the scandal, the politician tried to ___ herself from any involvement.', word: 'extricate', options: ['extricate', 'implicate', 'corroborate', 'interpolate'], hint: 'ex- (out) + tric- (tangles). To get out of a tangle.', type: 'context-morph' },
        { passage: 'The dictator\'s ___ regime crushed all opposition and free speech.', word: 'totalitarian', options: ['totalitarian', 'egalitarian', 'humanitarian', 'utilitarian'], hint: 'total- (whole) + -arian (relating to). Context: crushed all opposition.', type: 'context-morph' },
      ],
    },
    'word-clusters': {
      items: [
        { prompt: 'Name 4 words in the semantic field of "anger" ranging from mild to intense.', answer: 'annoyed, irritated, furious, incensed', field: 'anger', type: 'semantic' },
        { prompt: 'Name 4 words in the semantic field of "speech/communication."', answer: 'whisper, state, proclaim, harangue', field: 'speech', type: 'semantic' },
        { prompt: 'Name 4 words in the semantic field of "intelligence."', answer: 'clever, astute, sagacious, perspicacious', field: 'intelligence', type: 'semantic' },
        { prompt: 'Name 4 words in the semantic field of "walking" from slow to fast.', answer: 'amble, stroll, stride, dash', field: 'walking', type: 'semantic' },
        { prompt: 'Name 4 words in the semantic field of "sadness."', answer: 'wistful, melancholy, despondent, inconsolable', field: 'sadness', type: 'semantic' },
        { prompt: 'Name 4 words in the semantic field of "deception."', answer: 'mislead, deceive, dupe, hoodwink', field: 'deception', type: 'semantic' },
      ],
    },
    'conceptual-mapping': {
      items: [
        { prompt: 'Map the word "volatile": give a synonym, antonym, and related word from a different domain.', answer: 'Synonym: unstable. Antonym: stable. Science: easily evaporated. Politics: unpredictable.', type: 'concept-map' },
        { prompt: 'Map "prolific": synonym, antonym, and two domains where it applies.', answer: 'Synonym: productive. Antonym: barren. Writing: a prolific author. Biology: prolific species.', type: 'concept-map' },
        { prompt: 'Map "endemic": synonym, antonym, and domain.', answer: 'Synonym: native. Antonym: foreign/exotic. Epidemiology: a disease endemic to a region.', type: 'concept-map' },
        { prompt: 'Map "catalyst": synonym, antonym, and two domains.', answer: 'Synonym: trigger. Antonym: inhibitor. Chemistry: speeds reactions. Social: catalyst for change.', type: 'concept-map' },
        { prompt: 'Map "integrity": give a synonym, antonym, and two different senses.', answer: 'Synonym: honesty. Antonym: corruption. Moral: personal integrity. Structural: the bridge\'s integrity.', type: 'concept-map' },
        { prompt: 'Map "radical": synonym, antonym, and three domains.', answer: 'Synonym: extreme. Antonym: moderate. Politics: radical reforms. Math: radical sign. Chemistry: free radical.', type: 'concept-map' },
      ],
    },
  },
  'grade-12': {
    'word-choice-revision': {
      items: [
        { prompt: 'Revise for precise diction: "The book was really good and had lots of interesting things in it."', answer: 'The novel was compelling, filled with nuanced characters and vivid imagery.', type: 'revision' },
        { prompt: 'Revise: "The leader was very bad at making decisions."', answer: 'The leader proved indecisive, vacillating between contradictory policies.', type: 'revision' },
        { prompt: 'Revise: "The speech was nice and people liked it."', answer: 'The speech was eloquent, resonating deeply with the audience.', type: 'revision' },
        { prompt: 'Revise: "The thing about the economy is that it\'s not doing well."', answer: 'The economy has stagnated, with GDP growth declining for three consecutive quarters.', type: 'revision' },
        { prompt: 'Revise: "She was sad about what happened."', answer: 'She was devastated by the unforeseen turn of events.', type: 'revision' },
        { prompt: 'Revise: "The old building was falling apart."', answer: 'The dilapidated structure had succumbed to decades of neglect.', type: 'revision' },
      ],
    },
    'eliminating-vagueness': {
      items: [
        { prompt: 'Replace the vague word: "The data shows stuff about climate trends."', answer: 'The data reveals significant upward trends in global temperatures.', vague: 'stuff', type: 'precision' },
        { prompt: 'Replace the vague word: "The author does a good job of showing the theme."', answer: 'The author deftly illuminates the theme through recurring imagery.', vague: 'does a good job', type: 'precision' },
        { prompt: 'Replace the vague word: "There are many things that contribute to the problem."', answer: 'Multiple socioeconomic factors exacerbate the crisis.', vague: 'things', type: 'precision' },
        { prompt: 'Replace the vague word: "It was a big deal for everyone involved."', answer: 'The decision had far-reaching consequences for all stakeholders.', vague: 'big deal', type: 'precision' },
        { prompt: 'Replace the vague word: "The experiment got interesting results."', answer: 'The experiment yielded anomalous results warranting further investigation.', vague: 'interesting', type: 'precision' },
        { prompt: 'Replace the vague word: "The place had a nice feel to it."', answer: 'The venue exuded an atmosphere of refined elegance.', vague: 'nice feel', type: 'precision' },
      ],
    },
    'tone-matching': {
      items: [
        { prompt: 'Choose the word that creates a melancholy tone: "The house stood ___ in the fading light." (a) empty (b) desolate (c) unoccupied', answer: 'desolate', tone: 'melancholy', type: 'tone' },
        { prompt: 'Choose the word for a clinical, detached tone: "The subject ___ signs of distress." (a) showed (b) exhibited (c) revealed', answer: 'exhibited', tone: 'clinical', type: 'tone' },
        { prompt: 'Choose the word for an ominous tone: "Clouds ___ on the horizon." (a) gathered (b) appeared (c) loomed', answer: 'loomed', tone: 'ominous', type: 'tone' },
        { prompt: 'Choose the word for a celebratory tone: "The crowd ___ as the final score was announced." (a) cheered (b) erupted (c) responded', answer: 'erupted', tone: 'celebratory', type: 'tone' },
        { prompt: 'Choose for an ironic tone: "The committee\'s ___ decision surprised no one." (a) predictable (b) unsurprising (c) inevitable', answer: 'inevitable', tone: 'ironic', type: 'tone' },
        { prompt: 'Choose for a reverential tone: "The audience ___ as the maestro raised his baton." (a) quieted (b) hushed (c) fell silent', answer: 'hushed', tone: 'reverential', type: 'tone' },
      ],
    },
    'tone-shifting': {
      items: [
        { prompt: 'Rewrite in a sardonic tone: "The meeting was unproductive."', answer: 'The meeting accomplished the remarkable feat of wasting everyone\'s time equally.', fromTone: 'neutral', toTone: 'sardonic', type: 'tone-shift' },
        { prompt: 'Rewrite in an optimistic tone: "The project faces many challenges."', answer: 'The project presents exciting opportunities for creative problem-solving.', fromTone: 'neutral', toTone: 'optimistic', type: 'tone-shift' },
        { prompt: 'Rewrite in a somber tone: "The old factory closed."', answer: 'The factory, once the heartbeat of the community, fell silent at last.', fromTone: 'neutral', toTone: 'somber', type: 'tone-shift' },
        { prompt: 'Rewrite in a clinical tone: "The patient was in a lot of pain."', answer: 'The patient presented with acute pain symptoms rated 8 on the 10-point scale.', fromTone: 'casual', toTone: 'clinical', type: 'tone-shift' },
        { prompt: 'Rewrite in a whimsical tone: "It started to rain."', answer: 'The sky, apparently bored with sunshine, decided to try its hand at watercolors.', fromTone: 'neutral', toTone: 'whimsical', type: 'tone-shift' },
        { prompt: 'Rewrite in an urgent tone: "We should probably address climate change."', answer: 'Climate change demands immediate, decisive action — the window for meaningful intervention is closing.', fromTone: 'tentative', toTone: 'urgent', type: 'tone-shift' },
      ],
    },
    'college-level-reading-words': {
      items: WORD_OF_DAY_BANK.slice(0, 7).map(w => ({
        prompt: `Define "${w.word}" and use it in a sentence.`, answer: w.definition, example: w.example, roots: w.roots, type: 'definition'
      })),
    },
    'academic-writing-words': {
      items: WORD_OF_DAY_BANK.slice(7).map(w => ({
        prompt: `Define "${w.word}" and identify its word family.`, answer: w.definition, family: w.family, roots: w.roots, type: 'definition'
      })),
    },
    'register-shifting': {
      items: REGISTER_BANK.map(r => ({
        prompt: `Shift this from casual to formal: "${r.levels.casual}"`,
        answer: r.levels.formal, concept: r.concept, allLevels: r.levels, type: 'register-shift'
      })),
    },
    'code-switching-written': {
      items: [
        { prompt: 'Rewrite for a peer audience: "The protagonist\'s hamartia precipitates the tragic denouement."', answer: 'The main character\'s fatal flaw is what leads to the tragic ending.', from: 'academic', to: 'casual', type: 'code-switch' },
        { prompt: 'Rewrite for an academic audience: "The author totally nails the vibe of 1920s New York."', answer: 'The author masterfully evokes the atmosphere of 1920s New York through vivid period detail.', from: 'casual', to: 'academic', type: 'code-switch' },
        { prompt: 'Rewrite for a general audience: "The patient presented with acute myocardial infarction."', answer: 'The patient suffered a heart attack.', from: 'technical', to: 'general', type: 'code-switch' },
        { prompt: 'Rewrite for a professional email: "Hey, just wanted to check in about that thing we talked about."', answer: 'I am writing to follow up on our previous discussion regarding the proposal.', from: 'casual', to: 'professional', type: 'code-switch' },
        { prompt: 'Rewrite for a literary essay: "Gatsby really wants to get back together with Daisy."', answer: 'Gatsby\'s obsessive pursuit of Daisy embodies his desperate yearning to recapture the past.', from: 'casual', to: 'literary', type: 'code-switch' },
        { prompt: 'Rewrite for social media: "The concert was an exemplary demonstration of musical virtuosity."', answer: 'That concert was absolutely incredible — pure musical genius!', from: 'formal', to: 'social', type: 'code-switch' },
      ],
    },
    'authorial-diction-analysis': {
      items: [
        { prompt: 'Hemingway uses short, simple words. What effect does this create?', answer: 'Creates directness, emotional restraint, and power through understatement. The simplicity forces readers to read between the lines.', author: 'Hemingway', type: 'diction-analysis' },
        { prompt: 'Toni Morrison uses lyrical, rhythmic prose. What effect does this achieve?', answer: 'Creates a musical quality that echoes oral storytelling traditions, deepens emotional resonance, and elevates everyday experience to mythic significance.', author: 'Morrison', type: 'diction-analysis' },
        { prompt: 'George Orwell advocated for plain, clear language. Why?', answer: 'He believed vague, pretentious language could obscure truth and enable political manipulation. Clarity in language promotes clarity in thought.', author: 'Orwell', type: 'diction-analysis' },
        { prompt: 'Shakespeare coined hundreds of words (e.g., "assassination," "lonely"). What does this reveal about his style?', answer: 'His willingness to invent words shows creative boldness and reveals that existing vocabulary was insufficient for his ideas. Language was a tool he actively shaped.', author: 'Shakespeare', type: 'diction-analysis' },
        { prompt: 'Emily Dickinson uses dashes and unusual capitalization. How does this affect diction?', answer: 'Dashes create pauses that emphasize individual words, slowing the reader. Capitalization elevates ordinary words to proper-noun status, imbuing them with symbolic weight.', author: 'Dickinson', type: 'diction-analysis' },
        { prompt: 'James Baldwin\'s prose shifts between registers. What purpose does this serve?', answer: 'Register-shifting demonstrates mastery of multiple discourses, bridges personal and political, and asserts the validity of Black American vernacular alongside formal English.', author: 'Baldwin', type: 'diction-analysis' },
      ],
    },
    'style-imitation': {
      items: [
        { prompt: 'Write a sentence about a sunset in Hemingway\'s style (short, declarative, concrete).', answer: 'The sun went down behind the hills. It was red. The river turned dark.', style: 'Hemingway', type: 'imitation' },
        { prompt: 'Write a sentence about loneliness in Dickens\'s style (elaborate, detailed, extended).', answer: 'It was a loneliness of the most profound and penetrating kind, the sort that settles upon a person like fog upon a moor, obscuring all warmth and fellowship.', style: 'Dickens', type: 'imitation' },
        { prompt: 'Describe a meal in formal academic register.', answer: 'The participants consumed a nutritionally balanced repast consisting of locally sourced ingredients prepared according to traditional culinary methods.', style: 'academic', type: 'imitation' },
        { prompt: 'Describe a storm using Romantic-era diction (sublime, grand, emotional).', answer: 'The tempest descended with terrible majesty, its furious winds howling through the trembling forest as lightning rent the heavens asunder.', style: 'Romantic', type: 'imitation' },
        { prompt: 'Write a sentence about technology in a satirical tone.', answer: 'The latest device, which does precisely what the last one did but costs twice as much, was hailed as revolutionary by people contractually obligated to say so.', style: 'satirical', type: 'imitation' },
        { prompt: 'Write about morning in sparse, minimalist style.', answer: 'Light. Coffee. Silence. Then the day began.', style: 'minimalist', type: 'imitation' },
      ],
    },
    'semantic-drift': {
      items: SEMANTIC_DRIFT.map(s => ({
        prompt: `Trace the semantic drift of "${s.word}" from its original to modern meaning.`,
        answer: s.stages.join(' -> '), driftType: s.type, type: 'semantic-drift'
      })),
    },
    'doublets-and-cognates': {
      items: DOUBLETS.map(d => ({
        prompt: `"${d.pair[0]}" and "${d.pair[1]}" are doublets. Explain their shared origin.`,
        answer: d.origin, type: 'doublet'
      })),
    },
  },
};

// ── File I/O ──

function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }
function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }

function loadProfile(id) {
  const fp = profilePath(id);
  if (fs.existsSync(fp)) {
    try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
    catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); }
  }
  return { studentId: id, grade: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
}

function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }

// ── Helpers ──

function calcMastery(attempts) {
  if (!attempts || !attempts.length) return 0;
  const recent = attempts.slice(-5).filter(a => a.total > 0);
  return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0;
}

function masteryLabel(r) { return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started'; }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

// ── Exercise Generation ──

function generateExercise(grade, skill, count = 5) {
  const bank = EXERCISE_BANKS[grade]?.[skill];
  if (!bank) return { error: `No exercise bank for ${grade}/${skill}` };

  const items = bank.items;
  if (!items || !items.length) return { error: `Empty exercise bank for ${grade}/${skill}` };

  const selected = pick(items, count);
  const first = selected[0];

  // Context-clue passage exercises
  if (first.passage !== undefined && first.options !== undefined) {
    return { type: 'context-clue', skill, grade, count: selected.length, instruction: 'Choose the word that best fills the blank based on context clues.', items: selected.map(i => ({ prompt: i.passage, options: i.options, answer: i.answer, hint: i.hint || '' })) };
  }
  // Root/morpheme meaning exercises
  if (first.prompt !== undefined && first.examples !== undefined) {
    return { type: 'root-meaning', skill, grade, count: selected.length, instruction: 'Give the meaning of the word part.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, examples: i.examples })) };
  }
  // Word family / derivation exercises
  if (first.prompt !== undefined && first.answer !== undefined && first.rule !== undefined) {
    return { type: 'derivation', skill, grade, count: selected.length, instruction: 'Apply the word formation rule.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, rule: i.rule })) };
  }
  // Definition exercises
  if (first.type === 'definition' || first.type === 'sat-definition') {
    return { type: 'definition', skill, grade, count: selected.length, instruction: 'Provide or identify the definition.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, example: i.example || '', etymology: i.etymology || '' })) };
  }
  // Connotation ranking
  if (first.type === 'connotation-rank' || first.type === 'connotation-compare') {
    return { type: 'connotation', skill, grade, count: selected.length, instruction: 'Analyze the connotation of these words.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, explanation: i.explanation || '' })) };
  }
  // Register exercises
  if (first.type === 'register' || first.type === 'register-identify' || first.type === 'register-shift') {
    return { type: 'register', skill, grade, count: selected.length, instruction: 'Work with formality levels and register.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, concept: i.concept || '' })) };
  }
  // Nuance / distinction exercises
  if (first.type === 'nuance') {
    return { type: 'nuance', skill, grade, count: selected.length, instruction: 'Explain the distinction between these words.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer })) };
  }
  // Morphology breakdown
  if (first.type === 'morphology' || first.type === 'deconstruct') {
    return { type: 'morphology', skill, grade, count: selected.length, instruction: 'Break the word into its component morphemes and give meanings.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer })) };
  }
  // Etymology exercises
  if (first.type === 'etymology' || first.type === 'borrowing') {
    return { type: 'etymology', skill, grade, count: selected.length, instruction: 'Trace the origin and history of the word.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, modern: i.modern || '' })) };
  }
  // Tone exercises
  if (first.type === 'tone' || first.type === 'tone-shift') {
    return { type: 'tone', skill, grade, count: selected.length, instruction: 'Select or create words that establish a specific tone.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, tone: i.tone || i.toTone || '' })) };
  }
  // Revision / precision exercises
  if (first.type === 'revision' || first.type === 'precision') {
    return { type: 'revision', skill, grade, count: selected.length, instruction: 'Revise for more precise, vivid, or appropriate diction.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer })) };
  }
  // Style / diction analysis
  if (first.type === 'diction-analysis' || first.type === 'imitation') {
    return { type: 'style', skill, grade, count: selected.length, instruction: 'Analyze or imitate authorial diction and style.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, author: i.author || i.style || '' })) };
  }
  // Idiom / figurative exercises
  if (first.type === 'idiom' || first.type === 'figurative') {
    return { type: 'figurative', skill, grade, count: selected.length, instruction: 'Identify and explain figurative language.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, origin: i.origin || i.example || '' })) };
  }
  // Context meaning / multiple meaning
  if (first.type === 'context-meaning' || first.type === 'multiple-meaning') {
    return { type: 'multiple-meaning', skill, grade, count: selected.length, instruction: 'Determine meaning from context.', items: selected.map(i => ({ prompt: i.prompt || i.passage, answer: i.answer || i.meaning, word: i.word || '' })) };
  }
  // Strategy exercises
  if (first.type === 'strategy') {
    return { type: 'strategy', skill, grade, count: selected.length, instruction: 'Apply vocabulary strategies.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, hint: i.hint || '' })) };
  }
  // Semantic field / concept map exercises
  if (first.type === 'semantic' || first.type === 'concept-map') {
    return { type: 'semantic-field', skill, grade, count: selected.length, instruction: 'Explore word relationships within semantic fields.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, field: i.field || '' })) };
  }
  // Affix application
  if (first.type === 'affix-apply') {
    return { type: 'affix', skill, grade, count: selected.length, instruction: 'Apply the affix to form a new word.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, rule: i.rule })) };
  }
  // Context + morphology combined
  if (first.type === 'context-morph') {
    return { type: 'context-morph', skill, grade, count: selected.length, instruction: 'Use context clues and morphological analysis to determine the answer.', items: selected.map(i => ({ prompt: i.passage, options: i.options, answer: i.word, hint: i.hint })) };
  }
  // Root application
  if (first.type === 'root-apply') {
    return { type: 'root-apply', skill, grade, count: selected.length, instruction: 'Identify the word that uses the given root.', items: selected.map(i => ({ prompt: i.prompt, options: i.options, answer: i.answer })) };
  }
  // Code-switching exercises
  if (first.type === 'code-switch') {
    return { type: 'code-switch', skill, grade, count: selected.length, instruction: 'Rewrite the text for a different audience or register.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, from: i.from, to: i.to })) };
  }
  // Semantic drift / doublet exercises
  if (first.type === 'semantic-drift' || first.type === 'doublet') {
    return { type: 'etymology-advanced', skill, grade, count: selected.length, instruction: 'Explore how word meanings have changed over time.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer })) };
  }

  // Generic fallback
  return { type: 'open-response', skill, grade, count: selected.length, instruction: 'Answer the following questions.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer })) };
}

function checkAnswer(expected, answer) {
  // For vocabulary, allow flexible matching
  const ne = norm(expected);
  const na = norm(answer);
  if (ne === na) return true;
  // Partial match: if the answer contains the key word
  if (ne.length > 5 && na.includes(ne)) return true;
  if (na.length > 5 && ne.includes(na)) return true;
  return false;
}

// ── Word of the Day ──

function getWordOfDay() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const idx = dayOfYear % WORD_OF_DAY_BANK.length;
  const w = WORD_OF_DAY_BANK[idx];
  return { date: new Date().toISOString().slice(0, 10), ...w };
}

// ── Public API ──

class Vocabulary {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, grade: p.grade, createdAt: p.createdAt, totalAssessments: p.assessments.length };
  }

  setGrade(id, grade) {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    const p = loadProfile(id); p.grade = grade; saveProfile(p);
    return { studentId: id, grade };
  }

  recordAssessment(id, grade, category, skill, score, total, notes = '') {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}`);
    if (!SKILLS[grade][category]) throw new Error(`Unknown category '${category}' for ${grade}`);
    if (!SKILLS[grade][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${grade}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);

    const p = loadProfile(id);
    if (!p.grade) p.grade = grade;
    const entry = { date: new Date().toISOString(), grade, category, skill, score, total, notes };
    p.assessments.push(entry);
    const key = `${grade}/${category}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p);
    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-9';
    const gs = SKILLS[grade] || {};
    const results = {};
    let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(gs)) {
      results[cat] = {};
      for (const sk of skills) {
        total++;
        const d = p.skills[`${grade}/${cat}/${sk}`];
        results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
      }
    }
    return { studentId: id, grade, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-9';
    const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS[grade] || {})) {
      for (const sk of skills) {
        const d = p.skills[`${grade}/${cat}/${sk}`];
        const m = d ? d.mastery : 0;
        if (m < MASTERY_THRESHOLD) candidates.push({ grade, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' });
      }
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, grade, next: candidates.slice(0, count) };
  }

  getReport(id) {
    const p = loadProfile(id);
    return { studentId: id, grade: p.grade, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }

  getSkillCatalog(grade) {
    const gs = SKILLS[grade];
    if (!gs) return { grade, error: `Unknown grade. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0;
    const catalog = {};
    for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; }
    return { grade, skills: catalog, totalSkills: total };
  }

  generateExercise(grade, skill, count = 5) { return generateExercise(grade, skill, count); }

  checkAnswer(expected, answer) { return { correct: checkAnswer(expected, answer), expected, studentAnswer: answer }; }

  wordOfDay() { return getWordOfDay(); }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-9';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const wod = getWordOfDay();
    return {
      studentId: id, grade, targetSkill: target, exercise, wordOfDay: wod,
      lessonPlan: {
        warmup: `Word of the Day: "${wod.word}" — ${wod.definition}`,
        teach: `Focus: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Use target vocabulary in original sentences or analytical writing.',
      },
    };
  }
}

module.exports = Vocabulary;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const voc = new Vocabulary();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) voc.setGrade(id, grade);
        out({ action: 'start', profile: voc.getProfile(id), nextSkills: voc.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(voc.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'grade-9';
        if (skill) { out(voc.generateExercise(grade, skill, 5)); }
        else { const n = voc.getNextSkills(id, 1).next; out(n.length ? voc.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, expected, answer] = args;
        if (expected === undefined || answer === undefined) throw new Error('Usage: check <expected> <answer>');
        out(voc.checkAnswer(expected, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(voc.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(voc.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(voc.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(voc.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? voc.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(voc.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(voc.setGrade(id, g)); break; }
      case 'word-of-day': { out(voc.wordOfDay()); break; }
      default: out({ usage: 'node vocabulary.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-grade', 'word-of-day'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
