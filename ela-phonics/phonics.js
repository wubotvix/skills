/**
 * AutoClaw ELA Phonics Interactive Tutor
 * No external dependencies. Node.js built-in APIs only.
 *
 * CLI Usage (all output is JSON for LLM consumption):
 *   node phonics.js start <studentId> [grade]
 *   node phonics.js lesson <studentId>
 *   node phonics.js exercise <studentId> <type>
 *   node phonics.js check <studentId> <exerciseType> <prompt> <studentAnswer>
 *   node phonics.js record <studentId> <grade> <category> <skill> <score> <total> [notes]
 *   node phonics.js progress <studentId>
 *   node phonics.js report <studentId>
 *   node phonics.js next <studentId>
 *   node phonics.js catalog [grade]
 *   node phonics.js students
 *   node phonics.js set-grade <studentId> <grade>
 */

const fs = require('fs');
const path = require('path');

const AGENT_DIR = path.join(__dirname, '..', '..', 'autoclaw', 'agent-id');
const DATA_DIR = path.join(AGENT_DIR, 'data', 'ela-phonics');
const MASTERY_THRESHOLD = 0.8;

// ── Skill Catalog ────────────────────────────────────────

const SKILLS = {
  'pre-k': {
    'phonological-awareness': ['rhyme-recognition', 'rhyme-production', 'syllable-counting', 'initial-sounds', 'blending-onset-rime'],
  },
  'kindergarten': {
    'letter-sounds': ['letter-names-and-sounds'],
    'short-vowels': ['short-a', 'short-e', 'short-i', 'short-o', 'short-u'],
    'cvc-words': ['cvc-blending', 'cvc-segmenting'],
    'sight-words': ['high-frequency-set-1'],
  },
  'grade-1': {
    'consonant-digraphs': ['sh', 'ch', 'th', 'wh', 'ck'],
    'initial-blends': ['bl-cr-fl-gr', 'sn-st-tr'],
    'final-blends': ['nd-nk', 'mp-lt-ft'],
    'silent-e': ['cvce-long-vowels'],
    'vowel-teams': ['ai-ay', 'ee-ea', 'oa-ow'],
    'r-controlled': ['ar', 'er-ir-ur', 'or'],
    'inflectional-endings': ['s-es', 'ed', 'ing'],
  },
  'grade-2': {
    'vowel-teams-extended': ['oi-oy', 'ou-ow', 'au-aw', 'oo'],
    'soft-c-g': ['soft-c', 'soft-g'],
    'silent-letters': ['kn-wr', 'gn-mb'],
    'syllable-types': ['closed', 'open', 'vce', 'vowel-team', 'r-controlled', 'consonant-le'],
    'multisyllabic': ['two-syllable-words'],
    'contractions': ['common-contractions'],
    'prefixes-suffixes-intro': ['un-re', 'ful-less-ly'],
  },
  'grade-3': {
    'multisyllabic-advanced': ['three-plus-syllable-words'],
    'prefixes': ['un-re-pre', 'dis-mis-non'],
    'suffixes': ['tion-sion', 'ment-ness', 'able-ible'],
    'latin-roots': ['struct-port-dict'],
    'irregular-spellings': ['ough-patterns'],
    'homophones': ['their-there-theyre', 'to-too-two'],
  },
};

// ── Word Banks ───────────────────────────────────────────

const WORD_BANKS = {
  'pre-k': {
    'rhyme-recognition': {
      pairs: [
        ['cat', 'hat', true], ['dog', 'log', true], ['sun', 'fun', true],
        ['fish', 'dish', true], ['cake', 'lake', true], ['pen', 'hen', true],
        ['ball', 'tall', true], ['ring', 'sing', true], ['bed', 'red', true],
        ['fox', 'box', true], ['cat', 'dog', false], ['sun', 'hat', false],
        ['pen', 'cup', false], ['ball', 'fish', false], ['bed', 'top', false],
        ['man', 'can', true], ['pig', 'wig', true], ['hop', 'mop', true],
        ['bug', 'rug', true], ['hill', 'fill', true],
      ],
    },
    'rhyme-production': {
      prompts: [
        { word: 'cat', rhymes: ['bat', 'hat', 'mat', 'sat', 'fat', 'rat', 'pat', 'flat'] },
        { word: 'dog', rhymes: ['log', 'fog', 'hog', 'jog', 'bog', 'frog'] },
        { word: 'sun', rhymes: ['fun', 'run', 'bun', 'gun', 'nun', 'pun'] },
        { word: 'bed', rhymes: ['red', 'fed', 'led', 'med', 'shed', 'sled'] },
        { word: 'ring', rhymes: ['sing', 'king', 'wing', 'thing', 'bring', 'swing'] },
        { word: 'cake', rhymes: ['lake', 'make', 'bake', 'rake', 'take', 'fake', 'shake'] },
        { word: 'hop', rhymes: ['mop', 'top', 'pop', 'stop', 'drop', 'shop'] },
        { word: 'bug', rhymes: ['rug', 'hug', 'mug', 'jug', 'tug', 'plug', 'slug'] },
        { word: 'man', rhymes: ['can', 'fan', 'pan', 'ran', 'tan', 'van', 'plan'] },
        { word: 'hill', rhymes: ['fill', 'will', 'bill', 'pill', 'still', 'grill', 'spill'] },
      ],
    },
    'syllable-counting': {
      words: [
        ['cat', 1], ['dog', 1], ['apple', 2], ['banana', 3], ['elephant', 3],
        ['butterfly', 3], ['sun', 1], ['paper', 2], ['computer', 3], ['fish', 1],
        ['baby', 2], ['dinosaur', 3], ['tree', 1], ['water', 2], ['umbrella', 3],
        ['book', 1], ['happy', 2], ['family', 3], ['cup', 1], ['table', 2],
        ['bicycle', 3], ['car', 1], ['kitten', 2], ['beautiful', 3], ['hat', 1],
      ],
    },
    'initial-sounds': {
      words: [
        ['fish', 'f'], ['ball', 'b'], ['cat', 'c'], ['dog', 'd'], ['egg', 'e'],
        ['goat', 'g'], ['hat', 'h'], ['jump', 'j'], ['kite', 'k'], ['lion', 'l'],
        ['moon', 'm'], ['nest', 'n'], ['pig', 'p'], ['rain', 'r'], ['sun', 's'],
        ['top', 't'], ['van', 'v'], ['web', 'w'], ['yo-yo', 'y'], ['zebra', 'z'],
      ],
    },
    'blending-onset-rime': {
      words: [
        ['/c/', '/at/', 'cat'], ['/b/', '/at/', 'bat'], ['/s/', '/it/', 'sit'],
        ['/h/', '/op/', 'hop'], ['/r/', '/un/', 'run'], ['/p/', '/ig/', 'pig'],
        ['/d/', '/og/', 'dog'], ['/m/', '/an/', 'man'], ['/f/', '/in/', 'fin'],
        ['/b/', '/ed/', 'bed'], ['/t/', '/op/', 'top'], ['/c/', '/up/', 'cup'],
        ['/h/', '/en/', 'hen'], ['/p/', '/an/', 'pan'], ['/s/', '/un/', 'sun'],
      ],
    },
  },
  'kindergarten': {
    'letter-names-and-sounds': {
      letters: [
        ['A', '/æ/', 'apple'], ['B', '/b/', 'ball'], ['C', '/k/', 'cat'],
        ['D', '/d/', 'dog'], ['E', '/ɛ/', 'egg'], ['F', '/f/', 'fish'],
        ['G', '/g/', 'goat'], ['H', '/h/', 'hat'], ['I', '/ɪ/', 'igloo'],
        ['J', '/dʒ/', 'jump'], ['K', '/k/', 'kite'], ['L', '/l/', 'lion'],
        ['M', '/m/', 'moon'], ['N', '/n/', 'nest'], ['O', '/ɒ/', 'octopus'],
        ['P', '/p/', 'pig'], ['Q', '/kw/', 'queen'], ['R', '/r/', 'rain'],
        ['S', '/s/', 'sun'], ['T', '/t/', 'top'], ['U', '/ʌ/', 'umbrella'],
        ['V', '/v/', 'van'], ['W', '/w/', 'web'], ['X', '/ks/', 'fox'],
        ['Y', '/j/', 'yellow'], ['Z', '/z/', 'zebra'],
      ],
    },
    'short-a': { words: ['cat', 'bat', 'hat', 'mat', 'sat', 'rat', 'fan', 'man', 'can', 'pan', 'tap', 'map', 'nap', 'cap', 'bag', 'tag', 'rag', 'wag', 'jam', 'ham'] },
    'short-e': { words: ['bed', 'red', 'fed', 'led', 'hen', 'pen', 'ten', 'men', 'net', 'pet', 'set', 'wet', 'jet', 'get', 'leg', 'beg', 'peg', 'gem', 'yes', 'yet'] },
    'short-i': { words: ['sit', 'bit', 'fit', 'hit', 'kit', 'lit', 'pit', 'win', 'pin', 'fin', 'bin', 'tin', 'dig', 'big', 'pig', 'wig', 'fig', 'six', 'mix', 'fix'] },
    'short-o': { words: ['hot', 'pot', 'dot', 'got', 'lot', 'not', 'cot', 'top', 'hop', 'mop', 'pop', 'cop', 'dog', 'log', 'fog', 'hog', 'jog', 'box', 'fox', 'sob'] },
    'short-u': { words: ['cup', 'pup', 'up', 'bus', 'gum', 'hug', 'bug', 'rug', 'mug', 'jug', 'tug', 'dug', 'sun', 'run', 'fun', 'bun', 'gun', 'nun', 'cut', 'nut'] },
    'cvc-blending': {
      words: [
        { sounds: ['/k/', '/æ/', '/t/'], word: 'cat' },
        { sounds: ['/d/', '/ɒ/', '/g/'], word: 'dog' },
        { sounds: ['/s/', '/ɪ/', '/t/'], word: 'sit' },
        { sounds: ['/h/', '/ɒ/', '/t/'], word: 'hot' },
        { sounds: ['/k/', '/ʌ/', '/p/'], word: 'cup' },
        { sounds: ['/b/', '/æ/', '/t/'], word: 'bat' },
        { sounds: ['/p/', '/ɪ/', '/g/'], word: 'pig' },
        { sounds: ['/r/', '/ʌ/', '/n/'], word: 'run' },
        { sounds: ['/m/', '/æ/', '/p/'], word: 'map' },
        { sounds: ['/b/', '/ɛ/', '/d/'], word: 'bed' },
        { sounds: ['/f/', '/ɪ/', '/n/'], word: 'fin' },
        { sounds: ['/h/', '/ɛ/', '/n/'], word: 'hen' },
        { sounds: ['/t/', '/ɒ/', '/p/'], word: 'top' },
        { sounds: ['/g/', '/ʌ/', '/m/'], word: 'gum' },
        { sounds: ['/n/', '/ɛ/', '/t/'], word: 'net' },
      ],
    },
    'cvc-segmenting': {
      words: [
        { word: 'cat', sounds: '/k/ /æ/ /t/' },
        { word: 'dog', sounds: '/d/ /ɒ/ /g/' },
        { word: 'sit', sounds: '/s/ /ɪ/ /t/' },
        { word: 'hot', sounds: '/h/ /ɒ/ /t/' },
        { word: 'cup', sounds: '/k/ /ʌ/ /p/' },
        { word: 'bat', sounds: '/b/ /æ/ /t/' },
        { word: 'pig', sounds: '/p/ /ɪ/ /g/' },
        { word: 'run', sounds: '/r/ /ʌ/ /n/' },
        { word: 'map', sounds: '/m/ /æ/ /p/' },
        { word: 'bed', sounds: '/b/ /ɛ/ /d/' },
        { word: 'fin', sounds: '/f/ /ɪ/ /n/' },
        { word: 'hen', sounds: '/h/ /ɛ/ /n/' },
        { word: 'top', sounds: '/t/ /ɒ/ /p/' },
        { word: 'gum', sounds: '/g/ /ʌ/ /m/' },
        { word: 'net', sounds: '/n/ /ɛ/ /t/' },
      ],
    },
    'high-frequency-set-1': {
      words: ['the', 'a', 'is', 'to', 'and', 'I', 'it', 'in', 'he', 'she', 'we', 'my', 'you', 'was', 'are', 'do', 'no', 'go', 'so', 'me'],
    },
  },
  'grade-1': {
    'sh': { words: ['ship', 'shop', 'fish', 'dish', 'wish', 'shut', 'shed', 'shell', 'shin', 'shelf', 'shout', 'shade', 'shape', 'share', 'shine'] },
    'ch': { words: ['chip', 'chop', 'chin', 'chat', 'chest', 'check', 'chick', 'child', 'lunch', 'much', 'such', 'rich', 'each', 'teach', 'reach'] },
    'th': { words: ['this', 'that', 'them', 'then', 'thin', 'thick', 'thing', 'think', 'bath', 'math', 'path', 'with', 'both', 'teeth', 'thank'] },
    'wh': { words: ['what', 'when', 'where', 'which', 'while', 'white', 'whale', 'wheel', 'whip', 'whisper', 'wheat', 'whine', 'whole', 'whom', 'why'] },
    'ck': { words: ['back', 'pack', 'rack', 'black', 'crack', 'track', 'deck', 'neck', 'check', 'kick', 'pick', 'sick', 'trick', 'rock', 'sock'] },
    'bl-cr-fl-gr': { words: ['black', 'blue', 'block', 'blow', 'blank', 'crab', 'crop', 'crisp', 'cross', 'crust', 'flag', 'flip', 'flat', 'frog', 'grab', 'grin', 'grip', 'grow', 'green', 'grand'] },
    'sn-st-tr': { words: ['snap', 'snip', 'snow', 'snug', 'snack', 'step', 'stop', 'stick', 'stone', 'stamp', 'trip', 'tree', 'trick', 'truck', 'train'] },
    'nd-nk': { words: ['and', 'band', 'hand', 'land', 'sand', 'find', 'kind', 'mind', 'wind', 'bend', 'bank', 'tank', 'rank', 'sank', 'sink', 'pink', 'link', 'think', 'drink', 'trunk'] },
    'mp-lt-ft': { words: ['camp', 'damp', 'lamp', 'stamp', 'jump', 'bump', 'pump', 'dump', 'belt', 'felt', 'melt', 'bolt', 'jolt', 'soft', 'left', 'gift', 'lift', 'drift', 'craft', 'swift'] },
    'cvce-long-vowels': { words: ['cake', 'make', 'bake', 'lake', 'bike', 'like', 'hike', 'kite', 'bone', 'home', 'hope', 'rope', 'cute', 'huge', 'mule', 'tune', 'game', 'name', 'time', 'note'] },
    'ai-ay': { words: ['rain', 'pain', 'main', 'train', 'brain', 'wait', 'tail', 'mail', 'nail', 'sail', 'day', 'play', 'say', 'way', 'stay', 'pay', 'may', 'ray', 'hay', 'clay'] },
    'ee-ea': { words: ['see', 'tree', 'free', 'three', 'bee', 'feed', 'seed', 'need', 'week', 'keep', 'eat', 'sea', 'tea', 'read', 'beat', 'heat', 'meat', 'clean', 'dream', 'team'] },
    'oa-ow': { words: ['boat', 'coat', 'goat', 'road', 'load', 'soap', 'oak', 'foam', 'moan', 'toast', 'grow', 'show', 'know', 'snow', 'blow', 'flow', 'low', 'slow', 'row', 'bow'] },
    'ar': { words: ['car', 'bar', 'far', 'star', 'jar', 'arm', 'farm', 'barn', 'dark', 'park', 'card', 'hard', 'yard', 'art', 'cart', 'part', 'start', 'sharp', 'charm', 'march'] },
    'er-ir-ur': { words: ['her', 'fern', 'term', 'herd', 'verb', 'bird', 'girl', 'sir', 'stir', 'first', 'fur', 'burn', 'turn', 'hurt', 'curl', 'nurse', 'purse', 'church', 'burst', 'third'] },
    'or': { words: ['for', 'or', 'corn', 'horn', 'torn', 'born', 'fort', 'sort', 'sport', 'storm', 'fork', 'pork', 'cork', 'more', 'store', 'score', 'shore', 'snore', 'horse', 'north'] },
    's-es': { words: ['cats', 'dogs', 'cups', 'beds', 'hats', 'boxes', 'foxes', 'wishes', 'dishes', 'brushes', 'buses', 'dresses', 'glasses', 'classes', 'kisses'] },
    'ed': { words: ['jumped', 'walked', 'talked', 'asked', 'helped', 'played', 'rained', 'waited', 'needed', 'wanted', 'liked', 'baked', 'hoped', 'named', 'smiled'] },
    'ing': { words: ['jumping', 'walking', 'talking', 'playing', 'running', 'sitting', 'making', 'coming', 'going', 'helping', 'eating', 'reading', 'sleeping', 'swimming', 'getting'] },
  },
  'grade-2': {
    'oi-oy': { words: ['oil', 'boil', 'coin', 'join', 'point', 'noise', 'voice', 'choice', 'soil', 'foil', 'boy', 'toy', 'joy', 'enjoy', 'royal', 'loyal', 'destroy', 'annoy', 'employ', 'voyage'] },
    'ou-ow': { words: ['out', 'our', 'house', 'mouse', 'cloud', 'loud', 'found', 'round', 'sound', 'ground', 'cow', 'how', 'now', 'town', 'down', 'brown', 'crown', 'frown', 'flower', 'power'] },
    'au-aw': { words: ['cause', 'pause', 'sauce', 'haul', 'fault', 'vault', 'launch', 'caught', 'taught', 'August', 'saw', 'paw', 'jaw', 'law', 'raw', 'draw', 'straw', 'crawl', 'yawn', 'dawn'] },
    'oo': { words: ['moon', 'soon', 'spoon', 'room', 'food', 'cool', 'pool', 'school', 'tooth', 'roof', 'book', 'cook', 'look', 'hook', 'took', 'good', 'wood', 'foot', 'stood', 'wool'] },
    'soft-c': { words: ['cent', 'cell', 'city', 'circle', 'center', 'certain', 'cereal', 'cycle', 'ice', 'rice', 'nice', 'place', 'space', 'face', 'dance', 'prince', 'fence', 'pencil', 'decide', 'peace'] },
    'soft-g': { words: ['gem', 'age', 'page', 'cage', 'stage', 'change', 'large', 'giant', 'gentle', 'ginger', 'giraffe', 'general', 'magic', 'energy', 'orange', 'bridge', 'badge', 'fudge', 'edge', 'judge'] },
    'kn-wr': { words: ['know', 'knew', 'knit', 'knot', 'knee', 'kneel', 'knife', 'knight', 'knock', 'knob', 'write', 'wrong', 'wrap', 'wrist', 'wreck', 'wren', 'wreath', 'wrote', 'written', 'wrestle'] },
    'gn-mb': { words: ['gnat', 'gnaw', 'gnome', 'sign', 'design', 'align', 'assign', 'resign', 'climb', 'lamb', 'comb', 'thumb', 'numb', 'bomb', 'crumb', 'limb', 'dumb', 'plumb', 'tomb', 'debt'] },
    'closed': { words: ['rabbit', 'napkin', 'pencil', 'basket', 'kitten', 'button', 'mitten', 'puppet', 'sunset', 'insect'] },
    'open': { words: ['paper', 'tiger', 'spider', 'robot', 'music', 'student', 'human', 'pilot', 'moment', 'hotel'] },
    'vce': { words: ['compete', 'compute', 'mistake', 'explode', 'invite', 'escape', 'costume', 'reptile', 'compose', 'include'] },
    'vowel-team': { words: ['rainbow', 'peanut', 'seaweed', 'sailboat', 'daydream', 'rooftop', 'teammate', 'oatmeal', 'northeast', 'downtown'] },
    'r-controlled': { words: ['garden', 'market', 'carpet', 'forest', 'morning', 'corner', 'thirty', 'turkey', 'perfect', 'birthday'] },
    'consonant-le': { words: ['table', 'little', 'apple', 'bottle', 'middle', 'candle', 'purple', 'simple', 'turtle', 'puzzle'] },
    'two-syllable-words': { words: ['rabbit', 'paper', 'table', 'basket', 'sunset', 'garden', 'morning', 'corner', 'kitten', 'apple', 'butter', 'hammer', 'ladder', 'pepper', 'dinner'] },
    'common-contractions': {
      pairs: [
        ["don't", 'do not'], ["can't", 'cannot'], ["won't", 'will not'], ["didn't", 'did not'],
        ["isn't", 'is not'], ["wasn't", 'was not'], ["aren't", 'are not'], ["weren't", 'were not'],
        ["I'm", 'I am'], ["I'll", 'I will'], ["I've", 'I have'], ["he's", 'he is'],
        ["she's", 'she is'], ["it's", 'it is'], ["we're", 'we are'], ["they're", 'they are'],
        ["you're", 'you are'], ["we've", 'we have'], ["they've", 'they have'], ["let's", 'let us'],
      ],
    },
    'un-re': { words: [['undo', 'un', 'do'], ['unhappy', 'un', 'happy'], ['unlike', 'un', 'like'], ['unlock', 'un', 'lock'], ['unfair', 'un', 'fair'], ['redo', 're', 'do'], ['reread', 're', 'read'], ['rewrite', 're', 'write'], ['rebuild', 're', 'build'], ['replay', 're', 'play']] },
    'ful-less-ly': { words: [['careful', 'care', 'ful'], ['helpful', 'help', 'ful'], ['hopeful', 'hope', 'ful'], ['thankful', 'thank', 'ful'], ['cheerful', 'cheer', 'ful'], ['careless', 'care', 'less'], ['helpless', 'help', 'less'], ['hopeless', 'hope', 'less'], ['slowly', 'slow', 'ly'], ['quickly', 'quick', 'ly']] },
  },
  'grade-3': {
    'three-plus-syllable-words': { words: [['beautiful', 'beau-ti-ful', 3], ['unhappy', 'un-hap-py', 3], ['wonderful', 'won-der-ful', 3], ['butterfly', 'but-ter-fly', 3], ['important', 'im-por-tant', 3], ['remember', 're-mem-ber', 3], ['together', 'to-geth-er', 3], ['different', 'dif-fer-ent', 3], ['understand', 'un-der-stand', 3], ['comfortable', 'com-for-ta-ble', 4]] },
    'un-re-pre': { words: [['undo', 'un-', 'do'], ['unhappy', 'un-', 'happy'], ['unfair', 'un-', 'fair'], ['redo', 're-', 'do'], ['rewrite', 're-', 'write'], ['review', 're-', 'view'], ['preview', 'pre-', 'view'], ['prepay', 'pre-', 'pay'], ['preheat', 'pre-', 'heat'], ['preschool', 'pre-', 'school']] },
    'dis-mis-non': { words: [['disagree', 'dis-', 'agree'], ['disappear', 'dis-', 'appear'], ['discover', 'dis-', 'cover'], ['dislike', 'dis-', 'like'], ['misspell', 'mis-', 'spell'], ['misplace', 'mis-', 'place'], ['mislead', 'mis-', 'lead'], ['nonsense', 'non-', 'sense'], ['nonfiction', 'non-', 'fiction'], ['nonstop', 'non-', 'stop']] },
    'tion-sion': { words: ['action', 'nation', 'station', 'question', 'direction', 'attention', 'education', 'population', 'information', 'celebration', 'vision', 'mission', 'decision', 'television', 'discussion'] },
    'ment-ness': { words: ['movement', 'payment', 'treatment', 'agreement', 'apartment', 'darkness', 'kindness', 'sadness', 'weakness', 'happiness', 'excitement', 'government', 'statement', 'illness', 'goodness'] },
    'able-ible': { words: ['comfortable', 'reasonable', 'enjoyable', 'valuable', 'remarkable', 'possible', 'terrible', 'horrible', 'invisible', 'flexible', 'washable', 'breakable', 'readable', 'sensible', 'visible'] },
    'struct-port-dict': {
      roots: [
        { root: 'struct', meaning: 'build', words: ['structure', 'construct', 'instruct', 'destruction', 'reconstruct'] },
        { root: 'port', meaning: 'carry', words: ['transport', 'import', 'export', 'report', 'support'] },
        { root: 'dict', meaning: 'say/speak', words: ['dictionary', 'predict', 'contradict', 'dictate', 'verdict'] },
      ],
    },
    'ough-patterns': {
      groups: [
        { pattern: 'ough = /uː/', words: ['through'] },
        { pattern: 'ough = /oʊ/', words: ['though', 'dough'] },
        { pattern: 'ough = /ɔː/', words: ['thought', 'bought', 'brought', 'fought', 'sought'] },
        { pattern: 'ough = /ɒf/', words: ['cough'] },
        { pattern: 'ough = /ʌf/', words: ['rough', 'tough', 'enough'] },
      ],
    },
    'their-there-theyre': {
      sentences: [
        { sentence: '___ going to the park.', answer: "They're", explanation: "They're = They are" },
        { sentence: 'The book is over ___.', answer: 'there', explanation: 'there = a place' },
        { sentence: 'The kids brought ___ lunches.', answer: 'their', explanation: 'their = belonging to them' },
        { sentence: '___ is a cat in the yard.', answer: 'There', explanation: 'There = a place / existence' },
        { sentence: 'I like ___ new house.', answer: 'their', explanation: 'their = belonging to them' },
        { sentence: '___ happy about the trip.', answer: "They're", explanation: "They're = They are" },
        { sentence: 'Put the toys ___.', answer: 'there', explanation: 'there = a place' },
        { sentence: '___ dog is very friendly.', answer: 'Their', explanation: 'Their = belonging to them' },
      ],
    },
    'to-too-two': {
      sentences: [
        { sentence: 'I want ___ go home.', answer: 'to', explanation: 'to = direction or infinitive' },
        { sentence: 'She ate ___ much candy.', answer: 'too', explanation: 'too = also or excessively' },
        { sentence: 'I have ___ brothers.', answer: 'two', explanation: 'two = the number 2' },
        { sentence: 'Can I come ___?', answer: 'too', explanation: 'too = also' },
        { sentence: 'We walked ___ the store.', answer: 'to', explanation: 'to = direction' },
        { sentence: 'She has ___ cats and ___ dogs.', answer: 'two, two', explanation: 'two = the number 2' },
        { sentence: 'It is ___ hot outside.', answer: 'too', explanation: 'too = excessively' },
        { sentence: 'Give it ___ me.', answer: 'to', explanation: 'to = direction' },
      ],
    },
  },
};

// ── Decodable Texts ──────────────────────────────────────

const DECODABLE_TEXTS = {
  'kindergarten': [
    { title: 'The Cat', focus: 'short-a CVC', text: 'The cat sat on a mat. The cat had a hat. The fat cat napped on the mat.' },
    { title: 'The Pet', focus: 'short-e CVC', text: 'Ben has a pet hen. The hen is red. The hen sat in a bed of wet hay.' },
    { title: 'The Big Pig', focus: 'short-i CVC', text: 'A big pig did a jig. The pig hid in a pit. The pig bit a fig.' },
    { title: 'The Hot Pot', focus: 'short-o CVC', text: 'Mom got a hot pot. She put it on top. The pot has a lot of soup.' },
    { title: 'The Fun Run', focus: 'short-u CVC', text: 'The pup had fun in the sun. He dug in the mud. The pup ran and ran.' },
  ],
  'grade-1': [
    { title: 'The Ship', focus: 'digraphs sh/ch/th', text: 'The ship went on the sea. The fish swam with the ship. Chad sat on the deck and ate a chip. "This is the best trip!" he said with a grin.' },
    { title: 'The Cake', focus: 'silent-e', text: 'Jane made a cake. She put it by the lake. Mike rode his bike to take a bite. "This cake is nice!" he said. "I hope you make more!"' },
    { title: 'Rain Day', focus: 'vowel teams ai/ay/ee/ea', text: 'It rained all day. Jay waited by the window. He could see the rain on the green trees. "Maybe the rain will go away," said Jay. "Then we can play and read by the sea."' },
    { title: 'The Farm', focus: 'r-controlled', text: 'The farmer went to the barn. A bird sat on the car. The horse ran far. "Turn left at the corn!" said the farmer. The girl saw a turtle near the fern.' },
  ],
  'grade-2': [
    { title: 'The Royal Toy', focus: 'oi/oy ou/ow', text: 'The boy found a royal coin in the ground. He shouted with joy! "How did you find it?" asked his pal. The boy pointed down. "It was in the brown soil near our house."' },
    { title: 'The Little Riddle', focus: 'syllable types', text: 'A purple turtle sat at a table. "Here is a riddle," he said to the poodle. "What is simple but also a puzzle?" The poodle smiled. "A bubble!" she giggled.' },
    { title: "The Knight's Quest", focus: 'silent letters', text: 'The knight knew the way. He climbed the hill and knocked on the door. A gnome answered with a wrench. "I know you wrote to me," said the gnome. "Come in and have some lamb."' },
  ],
  'grade-3': [
    { title: 'The Discovery', focus: 'prefixes/suffixes', text: 'The explorer made an incredible discovery. She was uncomfortable in the darkness, but her excitement was unstoppable. The underground cave was beautiful and mysterious. "This is the most remarkable adventure!" she said with happiness.' },
    { title: 'Through the Rough', focus: 'ough patterns', text: 'Though the road was rough, they fought through. They thought about giving up, but brought enough courage. They coughed in the dusty air. Finally, they broke through to the other side.' },
  ],
};

// ── File I/O ─────────────────────────────────────────────

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function profilePath(studentId) {
  const safe = String(studentId).replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(DATA_DIR, `${safe}.json`);
}

function loadProfile(studentId) {
  const fp = profilePath(studentId);
  if (fs.existsSync(fp)) {
    try {
      return JSON.parse(fs.readFileSync(fp, 'utf8'));
    } catch {
      fs.renameSync(fp, fp + '.corrupt.' + Date.now());
    }
  }
  return { studentId, grade: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
}

function saveProfile(profile) {
  ensureDataDir();
  fs.writeFileSync(profilePath(profile.studentId), JSON.stringify(profile, null, 2), 'utf8');
}

// ── Mastery Calculation ──────────────────────────────────

function calcMastery(assessments) {
  if (assessments.length === 0) return 0;
  const recent = assessments.slice(-5);
  const total = recent.reduce((sum, a) => a.total > 0 ? sum + a.score / a.total : sum, 0);
  const valid = recent.filter(a => a.total > 0).length;
  return valid === 0 ? 0 : Math.round((total / valid) * 100) / 100;
}

function masteryLabel(ratio) {
  if (ratio >= 0.9) return 'mastered';
  if (ratio >= MASTERY_THRESHOLD) return 'proficient';
  if (ratio >= 0.6) return 'developing';
  if (ratio > 0) return 'emerging';
  return 'not-started';
}

// ── Helpers ──────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr, n) {
  return shuffle(arr).slice(0, Math.min(n, arr.length));
}

function resolveSkillKey(grade, skill) {
  const gradeSkills = SKILLS[grade];
  if (!gradeSkills) return null;
  for (const [category, skills] of Object.entries(gradeSkills)) {
    if (skills.includes(skill)) return { grade, category, skill };
  }
  return null;
}

// ── Exercise Generators ──────────────────────────────────

function generateExercise(grade, skill, count = 5) {
  const bank = WORD_BANKS[grade] && WORD_BANKS[grade][skill];
  if (!bank) return { error: `No word bank for ${grade}/${skill}` };

  // Rhyme recognition
  if (skill === 'rhyme-recognition' && bank.pairs) {
    const items = pick(bank.pairs, count);
    return {
      type: 'rhyme-recognition',
      skill, grade, count: items.length,
      instruction: 'Do these two words rhyme? Answer YES or NO.',
      items: items.map(([w1, w2, rhymes]) => ({
        prompt: `Do "${w1}" and "${w2}" rhyme?`,
        answer: rhymes ? 'yes' : 'no',
        word1: w1, word2: w2,
      })),
    };
  }

  // Rhyme production
  if (skill === 'rhyme-production' && bank.prompts) {
    const items = pick(bank.prompts, count);
    return {
      type: 'rhyme-production',
      skill, grade, count: items.length,
      instruction: 'Say a word that rhymes with the given word.',
      items: items.map(p => ({
        prompt: `What rhymes with "${p.word}"?`,
        word: p.word,
        acceptedAnswers: p.rhymes,
      })),
    };
  }

  // Syllable counting
  if (skill === 'syllable-counting' && bank.words) {
    const items = pick(bank.words, count);
    return {
      type: 'syllable-counting',
      skill, grade, count: items.length,
      instruction: 'How many syllables (parts) does this word have? Clap it out!',
      items: items.map(([word, syllables]) => ({
        prompt: `How many syllables in "${word}"?`,
        word, answer: syllables,
      })),
    };
  }

  // Initial sounds
  if (skill === 'initial-sounds' && bank.words) {
    const items = pick(bank.words, count);
    return {
      type: 'initial-sounds',
      skill, grade, count: items.length,
      instruction: 'What sound does this word start with?',
      items: items.map(([word, sound]) => ({
        prompt: `What sound does "${word}" start with?`,
        word, answer: sound,
      })),
    };
  }

  // Blending onset-rime
  if (skill === 'blending-onset-rime' && bank.words) {
    const items = pick(bank.words, count);
    return {
      type: 'blend',
      skill, grade, count: items.length,
      instruction: 'Blend these sounds together. What word do they make?',
      items: items.map(([onset, rime, word]) => ({
        prompt: `${onset} + ${rime} = ?`,
        answer: word,
      })),
    };
  }

  // Letter sounds
  if (skill === 'letter-names-and-sounds' && bank.letters) {
    const items = pick(bank.letters, count);
    return {
      type: 'letter-sounds',
      skill, grade, count: items.length,
      instruction: 'What sound does this letter make?',
      items: items.map(([letter, sound, example]) => ({
        prompt: `What sound does the letter "${letter}" make?`,
        letter, answer: sound, hint: `as in "${example}"`,
      })),
    };
  }

  // CVC blending
  if (skill === 'cvc-blending' && bank.words && bank.words[0] && bank.words[0].sounds) {
    const items = pick(bank.words, count);
    return {
      type: 'blend',
      skill, grade, count: items.length,
      instruction: 'Blend these sounds together. What word do they make?',
      items: items.map(w => ({
        prompt: `${w.sounds.join(' ')} = ?`,
        sounds: w.sounds, answer: w.word,
      })),
    };
  }

  // CVC segmenting
  if (skill === 'cvc-segmenting' && bank.words && bank.words[0] && bank.words[0].sounds) {
    const items = pick(bank.words, count);
    return {
      type: 'segment',
      skill, grade, count: items.length,
      instruction: 'Break this word into its individual sounds.',
      items: items.map(w => ({
        prompt: `What are the sounds in "${w.word}"?`,
        word: w.word, answer: w.sounds,
      })),
    };
  }

  // Sight words
  if (skill === 'high-frequency-set-1') {
    const items = pick(bank.words, count);
    return {
      type: 'sight-words',
      skill, grade, count: items.length,
      instruction: 'Read this word as fast as you can! (Type it to show you know it.)',
      items: items.map(w => ({ prompt: w, answer: w })),
    };
  }

  // Contractions
  if (skill === 'common-contractions' && bank.pairs) {
    const items = pick(bank.pairs, count);
    return {
      type: 'contractions',
      skill, grade, count: items.length,
      instruction: 'What is the contraction for these words? (Or: what words make this contraction?)',
      items: items.map(([contraction, expanded]) => {
        const askExpand = Math.random() > 0.5;
        return askExpand
          ? { prompt: `What is the contraction for "${expanded}"?`, answer: contraction, expanded }
          : { prompt: `What does "${contraction}" stand for?`, answer: expanded, contraction };
      }),
    };
  }

  // Homophones (sentence fill-in)
  if ((skill === 'their-there-theyre' || skill === 'to-too-two') && bank.sentences) {
    const items = pick(bank.sentences, count);
    return {
      type: 'fill-in',
      skill, grade, count: items.length,
      instruction: 'Fill in the blank with the correct word.',
      items: items.map(s => ({
        prompt: s.sentence,
        answer: s.answer,
        explanation: s.explanation,
      })),
    };
  }

  // Latin roots
  if (skill === 'struct-port-dict' && bank.roots) {
    const allItems = [];
    for (const r of bank.roots) {
      for (const w of r.words) {
        allItems.push({ word: w, root: r.root, meaning: r.meaning });
      }
    }
    const items = pick(allItems, count);
    return {
      type: 'roots',
      skill, grade, count: items.length,
      instruction: 'What Latin root is in this word, and what does it mean?',
      items: items.map(i => ({
        prompt: `What root is in "${i.word}" and what does it mean?`,
        word: i.word, root: i.root, meaning: i.meaning,
        answer: `${i.root} (${i.meaning})`,
      })),
    };
  }

  // ough patterns
  if (skill === 'ough-patterns' && bank.groups) {
    const allWords = [];
    for (const g of bank.groups) {
      for (const w of g.words) {
        allWords.push({ word: w, pattern: g.pattern });
      }
    }
    const items = pick(allWords, count);
    return {
      type: 'decode',
      skill, grade, count: items.length,
      instruction: 'Read this word aloud. How is "ough" pronounced in this word?',
      items: items.map(i => ({
        prompt: `Read: "${i.word}" — How is "ough" said?`,
        word: i.word, answer: i.pattern,
      })),
    };
  }

  // Prefix/suffix words (grade-2 un-re, ful-less-ly and grade-3 prefixes)
  if (bank.words && Array.isArray(bank.words) && bank.words[0] && Array.isArray(bank.words[0]) && bank.words[0].length === 3) {
    const items = pick(bank.words, count);
    return {
      type: 'word-parts',
      skill, grade, count: items.length,
      instruction: 'Break this word into its prefix/suffix and base word.',
      items: items.map(w => ({
        prompt: `Break apart: "${w[0]}"`,
        word: w[0], part1: w[1], part2: w[2],
        answer: `${w[1]} + ${w[2]}`,
      })),
    };
  }

  // Multisyllabic words (grade-3)
  if (skill === 'three-plus-syllable-words' && bank.words && bank.words[0] && bank.words[0].length === 3) {
    const items = pick(bank.words, count);
    return {
      type: 'syllable-division',
      skill, grade, count: items.length,
      instruction: 'Divide this word into syllables.',
      items: items.map(([word, divided, syllableCount]) => ({
        prompt: `Divide "${word}" into syllables.`,
        word, answer: divided, syllableCount,
      })),
    };
  }

  // Default: decode/read words (most consonant/vowel pattern skills)
  if (bank.words && typeof bank.words[0] === 'string') {
    const items = pick(bank.words, count);
    return {
      type: 'decode',
      skill, grade, count: items.length,
      instruction: 'Read each word aloud. Then type it to show you can read it.',
      items: items.map(w => ({
        prompt: `Read this word: "${w}"`,
        answer: w,
      })),
    };
  }

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

// ── Answer Checking ──────────────────────────────────────

function checkAnswer(exerciseType, expected, studentAnswer) {
  const norm = s => String(s).toLowerCase().trim().replace(/[^a-z0-9 ]/g, '');

  if (exerciseType === 'rhyme-recognition') {
    const a = norm(studentAnswer);
    return a === 'yes' || a === 'no' ? a === norm(expected) : false;
  }

  if (exerciseType === 'rhyme-production') {
    // expected is an array of accepted rhymes
    if (Array.isArray(expected)) {
      return expected.some(r => norm(r) === norm(studentAnswer));
    }
    return norm(expected) === norm(studentAnswer);
  }

  if (exerciseType === 'syllable-counting' || exerciseType === 'initial-sounds') {
    return norm(expected) === norm(studentAnswer);
  }

  if (exerciseType === 'fill-in') {
    return norm(expected) === norm(studentAnswer);
  }

  // Default: string comparison
  return norm(expected) === norm(studentAnswer);
}

// ── Public API (Class) ───────────────────────────────────

class Phonics {
  async getProfile(studentId) {
    const p = loadProfile(studentId);
    return { studentId: p.studentId, grade: p.grade, createdAt: p.createdAt, totalAssessments: p.assessments.length };
  }

  async setGrade(studentId, grade) {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    const p = loadProfile(studentId);
    p.grade = grade;
    saveProfile(p);
    return { studentId, grade };
  }

  async recordAssessment(studentId, grade, category, skill, score, total, notes = '') {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}`);
    if (!SKILLS[grade][category]) throw new Error(`Unknown category '${category}' for ${grade}`);
    if (!SKILLS[grade][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${grade}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);

    const p = loadProfile(studentId);
    if (!p.grade) p.grade = grade;

    const entry = { date: new Date().toISOString(), grade, category, skill, score, total, notes };
    p.assessments.push(entry);

    const key = `${grade}/${category}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p);

    return { studentId, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  async getProgress(studentId) {
    const p = loadProfile(studentId);
    const grade = p.grade || 'pre-k';
    const gradeSkills = SKILLS[grade] || {};
    const results = {};
    let masteredCount = 0, totalCount = 0;

    for (const [category, skills] of Object.entries(gradeSkills)) {
      results[category] = {};
      for (const skill of skills) {
        totalCount++;
        const key = `${grade}/${category}/${skill}`;
        const data = p.skills[key];
        if (data) {
          results[category][skill] = { mastery: data.mastery, label: data.label };
          if (data.mastery >= MASTERY_THRESHOLD) masteredCount++;
        } else {
          results[category][skill] = { mastery: 0, label: 'not-started' };
        }
      }
    }

    return { studentId, grade, mastered: masteredCount, total: totalCount, overallPct: totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0, skills: results };
  }

  async getNextSkills(studentId, count = 5) {
    const p = loadProfile(studentId);
    const grade = p.grade || 'pre-k';
    const gradeSkills = SKILLS[grade] || {};
    const candidates = [];

    for (const [category, skills] of Object.entries(gradeSkills)) {
      for (const skill of skills) {
        const key = `${grade}/${category}/${skill}`;
        const data = p.skills[key];
        const mastery = data ? data.mastery : 0;
        if (mastery < MASTERY_THRESHOLD) {
          candidates.push({ grade, category, skill, mastery, label: data ? data.label : 'not-started' });
        }
      }
    }

    candidates.sort((a, b) => {
      const order = { developing: 0, emerging: 1, 'not-started': 2 };
      const oa = order[a.label] ?? 3, ob = order[b.label] ?? 3;
      return oa !== ob ? oa - ob : b.mastery - a.mastery;
    });

    return { studentId, grade, next: candidates.slice(0, count) };
  }

  async getReport(studentId) {
    const p = loadProfile(studentId);
    const progress = await this.getProgress(studentId);
    const recent = p.assessments.slice(-20).reverse();
    return { studentId, grade: p.grade, progress, recentAssessments: recent };
  }

  async listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }

  async getSkillCatalog(grade) {
    const gs = SKILLS[grade];
    if (!gs) return { grade, error: `Unknown grade. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0;
    const catalog = {};
    for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; }
    return { grade, skills: catalog, totalSkills: total };
  }

  async generateExercise(grade, skill, count = 5) {
    return generateExercise(grade, skill, count);
  }

  async checkAnswer(exerciseType, expected, studentAnswer) {
    return { correct: checkAnswer(exerciseType, expected, studentAnswer), expected, studentAnswer };
  }

  async getDecodableText(grade) {
    const texts = DECODABLE_TEXTS[grade];
    if (!texts) return { error: `No decodable texts for ${grade}. Available: ${Object.keys(DECODABLE_TEXTS).join(', ')}` };
    return pick(texts, 1)[0];
  }

  async generateLesson(studentId) {
    const p = loadProfile(studentId);
    const grade = p.grade || 'pre-k';
    const nextResult = await this.getNextSkills(studentId, 3);
    const target = nextResult.next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };

    const exercise = generateExercise(grade, target.skill, 5);
    const text = DECODABLE_TEXTS[grade] ? pick(DECODABLE_TEXTS[grade], 1)[0] : null;

    return {
      studentId, grade,
      targetSkill: target,
      exercise,
      decodableText: text,
      lessonPlan: {
        review: `Review previously learned patterns (2-3 min)`,
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: text ? `Read decodable text: "${text.title}"` : 'Practice reading words in sentences',
        encode: `Spell 2-3 words using the ${target.skill} pattern`,
      },
    };
  }
}

// ── CLI Dispatcher ───────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const phonics = new Phonics();

  const output = (data) => {
    console.log(JSON.stringify(data, null, 2));
  };

  try {
    switch (cmd) {
      case 'start': {
        const [, studentId, grade] = args;
        if (!studentId) throw new Error('Usage: start <studentId> [grade]');
        if (grade) await phonics.setGrade(studentId, grade);
        const profile = await phonics.getProfile(studentId);
        const next = await phonics.getNextSkills(studentId);
        output({ action: 'start', profile, nextSkills: next });
        break;
      }

      case 'lesson': {
        const [, studentId] = args;
        if (!studentId) throw new Error('Usage: lesson <studentId>');
        output(await phonics.generateLesson(studentId));
        break;
      }

      case 'exercise': {
        const [, studentId, type] = args;
        if (!studentId) throw new Error('Usage: exercise <studentId> [skill]');
        const p = loadProfile(studentId);
        const grade = p.grade || 'pre-k';
        if (type) {
          output(await phonics.generateExercise(grade, type, 5));
        } else {
          const next = await phonics.getNextSkills(studentId, 1);
          if (next.next.length === 0) {
            output({ message: 'All skills proficient at current grade!' });
          } else {
            const skill = next.next[0].skill;
            output(await phonics.generateExercise(grade, skill, 5));
          }
        }
        break;
      }

      case 'check': {
        const [, , exerciseType, expected, studentAnswer] = args;
        if (!exerciseType || expected === undefined || studentAnswer === undefined) {
          throw new Error('Usage: check <studentId> <exerciseType> <expected> <studentAnswer>');
        }
        let exp = expected;
        try { exp = JSON.parse(expected); } catch {}
        output(await phonics.checkAnswer(exerciseType, exp, studentAnswer));
        break;
      }

      case 'record': {
        const [, studentId, grade, category, skill, scoreStr, totalStr, ...notesParts] = args;
        if (!studentId || !grade || !category || !skill || !scoreStr || !totalStr) {
          throw new Error('Usage: record <studentId> <grade> <category> <skill> <score> <total> [notes]');
        }
        output(await phonics.recordAssessment(studentId, grade, category, skill, Number(scoreStr), Number(totalStr), notesParts.join(' ')));
        break;
      }

      case 'progress': {
        const [, studentId] = args;
        if (!studentId) throw new Error('Usage: progress <studentId>');
        output(await phonics.getProgress(studentId));
        break;
      }

      case 'report': {
        const [, studentId] = args;
        if (!studentId) throw new Error('Usage: report <studentId>');
        output(await phonics.getReport(studentId));
        break;
      }

      case 'next': {
        const [, studentId, countStr] = args;
        if (!studentId) throw new Error('Usage: next <studentId> [count]');
        output(await phonics.getNextSkills(studentId, countStr ? Number(countStr) : 5));
        break;
      }

      case 'catalog': {
        const [, grade] = args;
        if (!grade) {
          output({ grades: Object.keys(SKILLS) });
        } else {
          output(await phonics.getSkillCatalog(grade));
        }
        break;
      }

      case 'students': {
        output(await phonics.listStudents());
        break;
      }

      case 'set-grade': {
        const [, studentId, grade] = args;
        if (!studentId || !grade) throw new Error('Usage: set-grade <studentId> <grade>');
        output(await phonics.setGrade(studentId, grade));
        break;
      }

      case 'text': {
        const [, grade] = args;
        if (!grade) throw new Error('Usage: text <grade>');
        output(await phonics.getDecodableText(grade));
        break;
      }

      default:
        output({
          usage: 'node phonics.js <command> [args]',
          commands: {
            'start <id> [grade]': 'Start or resume a student session',
            'lesson <id>': 'Generate a full lesson with exercises',
            'exercise <id> [skill]': 'Generate exercises (auto-picks skill if omitted)',
            'check <id> <type> <expected> <answer>': 'Check a student answer',
            'record <id> <grade> <cat> <skill> <score> <total>': 'Record assessment',
            'progress <id>': 'Show student progress',
            'report <id>': 'Full report with recent history',
            'next <id> [count]': 'Get recommended next skills',
            'catalog [grade]': 'List skills for a grade',
            'students': 'List all students',
            'set-grade <id> <grade>': 'Set student grade level',
            'text <grade>': 'Get a decodable reading passage',
          },
          grades: Object.keys(SKILLS),
        });
    }
  } catch (err) {
    output({ error: err.message });
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = Phonics;
