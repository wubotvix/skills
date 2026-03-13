// eClaw ELA Vocabulary Interactive Tutor (K-6). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ela-vocabulary');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'synonyms': ['basic-synonyms'],
    'antonyms': ['basic-antonyms'],
    'categories': ['categories'],
    'spelling': ['cvc-spelling'],
  },
  'grade-1': {
    'synonyms-antonyms': ['synonyms-antonyms'],
    'meaning': ['shades-of-meaning'],
    'categories': ['sorting-categories'],
    'spelling': ['short-vowel-spelling', 'long-vowel-spelling'],
  },
  'grade-2': {
    'context-clues': ['context-clues-definition', 'context-clues-synonym'],
    'homophones': ['homophones-basic'],
    'multiple-meanings': ['multiple-meanings'],
    'word-parts': ['prefixes-un-re', 'suffixes-ful-less'],
    'spelling': ['vowel-team-spelling'],
  },
  'grade-3': {
    'context-clues': ['context-clues-all'],
    'word-parts': ['prefixes-dis-mis-non', 'suffixes-tion-ment-ness'],
    'roots': ['latin-roots-basic'],
    'homophones': ['homophones-advanced'],
    'meaning': ['shades-of-meaning-advanced'],
    'spelling': ['spelling-rules'],
  },
  'grade-4': {
    'roots': ['greek-latin-roots'],
    'context-clues': ['context-in-text'],
    'figurative': ['figurative-meanings'],
    'relationships': ['word-relationships'],
    'word-parts': ['prefix-suffix-combo'],
    'domain': ['domain-vocabulary'],
    'spelling': ['advanced-spelling'],
  },
  'grade-5': {
    'morphology': ['morphology-analysis'],
    'meaning': ['connotation-denotation'],
    'relationships': ['analogies'],
    'origins': ['etymology-basics'],
    'academic': ['academic-vocabulary'],
    'spelling': ['spelling-patterns-advanced'],
  },
  'grade-6': {
    'origins': ['word-origins'],
    'meaning': ['nuance-tone'],
    'domain': ['technical-vocabulary'],
    'strategy': ['word-analysis-strategy'],
    'morphology': ['advanced-morphology'],
  },
};

// ── Content Banks ──

const WORD_BANKS = {
  'kindergarten': {
    'basic-synonyms': {
      pairs: [
        { word: 'big', synonym: 'large' }, { word: 'small', synonym: 'little' },
        { word: 'happy', synonym: 'glad' }, { word: 'sad', synonym: 'unhappy' },
        { word: 'fast', synonym: 'quick' }, { word: 'pretty', synonym: 'beautiful' },
        { word: 'start', synonym: 'begin' }, { word: 'shut', synonym: 'close' },
        { word: 'yell', synonym: 'shout' }, { word: 'look', synonym: 'see' },
      ],
    },
    'basic-antonyms': {
      pairs: [
        { word: 'hot', antonym: 'cold' }, { word: 'big', antonym: 'small' },
        { word: 'up', antonym: 'down' }, { word: 'in', antonym: 'out' },
        { word: 'happy', antonym: 'sad' }, { word: 'fast', antonym: 'slow' },
        { word: 'day', antonym: 'night' }, { word: 'wet', antonym: 'dry' },
        { word: 'old', antonym: 'new' }, { word: 'open', antonym: 'close' },
      ],
    },
    'categories': {
      groups: [
        { category: 'Animals', words: ['cat', 'dog', 'fish', 'bird', 'frog', 'pig'], distractor: 'cup' },
        { category: 'Colors', words: ['red', 'blue', 'green', 'yellow', 'pink', 'orange'], distractor: 'hat' },
        { category: 'Food', words: ['apple', 'bread', 'milk', 'egg', 'cake', 'rice'], distractor: 'tree' },
        { category: 'Body Parts', words: ['hand', 'foot', 'eye', 'ear', 'nose', 'arm'], distractor: 'sun' },
        { category: 'Clothing', words: ['hat', 'shoe', 'sock', 'coat', 'shirt', 'pants'], distractor: 'dog' },
        { category: 'Toys', words: ['ball', 'doll', 'car', 'block', 'kite', 'drum'], distractor: 'bed' },
      ],
    },
    'cvc-spelling': {
      words: [
        { word: 'cat', hint: 'a pet that says meow' }, { word: 'dog', hint: 'a pet that barks' },
        { word: 'sun', hint: 'it shines in the sky' }, { word: 'hat', hint: 'you wear it on your head' },
        { word: 'cup', hint: 'you drink from it' }, { word: 'bed', hint: 'you sleep in it' },
        { word: 'pig', hint: 'a farm animal that oinks' }, { word: 'net', hint: 'you catch fish with it' },
        { word: 'bug', hint: 'a small crawling creature' }, { word: 'map', hint: 'shows where places are' },
      ],
    },
  },
  'grade-1': {
    'synonyms-antonyms': {
      items: [
        { word: 'angry', synonym: 'mad', antonym: 'calm' },
        { word: 'brave', synonym: 'courageous', antonym: 'afraid' },
        { word: 'kind', synonym: 'nice', antonym: 'mean' },
        { word: 'loud', synonym: 'noisy', antonym: 'quiet' },
        { word: 'easy', synonym: 'simple', antonym: 'hard' },
        { word: 'strong', synonym: 'powerful', antonym: 'weak' },
        { word: 'clean', synonym: 'tidy', antonym: 'dirty' },
        { word: 'tall', synonym: 'high', antonym: 'short' },
        { word: 'thin', synonym: 'skinny', antonym: 'thick' },
        { word: 'rich', synonym: 'wealthy', antonym: 'poor' },
      ],
    },
    'shades-of-meaning': {
      groups: [
        { base: 'happy', shades: ['glad', 'pleased', 'joyful', 'excited', 'thrilled'], order: 'mild to strong' },
        { base: 'sad', shades: ['unhappy', 'upset', 'miserable', 'heartbroken'], order: 'mild to strong' },
        { base: 'cold', shades: ['cool', 'chilly', 'cold', 'freezing', 'icy'], order: 'mild to strong' },
        { base: 'hot', shades: ['warm', 'hot', 'burning', 'boiling', 'scorching'], order: 'mild to strong' },
        { base: 'walk', shades: ['stroll', 'walk', 'march', 'stomp', 'run'], order: 'slow to fast' },
        { base: 'big', shades: ['large', 'big', 'huge', 'enormous', 'gigantic'], order: 'small to large' },
        { base: 'said', shades: ['whispered', 'said', 'called', 'shouted', 'screamed'], order: 'quiet to loud' },
        { base: 'eat', shades: ['nibble', 'eat', 'munch', 'gobble', 'devour'], order: 'gentle to intense' },
      ],
    },
    'sorting-categories': {
      groups: [
        { category: 'Fruits', words: ['apple', 'banana', 'grape', 'orange', 'peach', 'berry'], distractor: 'carrot' },
        { category: 'Vegetables', words: ['carrot', 'pea', 'corn', 'bean', 'potato', 'onion'], distractor: 'apple' },
        { category: 'Vehicles', words: ['car', 'bus', 'truck', 'train', 'boat', 'plane'], distractor: 'house' },
        { category: 'Weather', words: ['rain', 'snow', 'wind', 'sun', 'cloud', 'storm'], distractor: 'tree' },
        { category: 'Feelings', words: ['happy', 'sad', 'angry', 'scared', 'proud', 'shy'], distractor: 'red' },
        { category: 'Shapes', words: ['circle', 'square', 'triangle', 'star', 'heart', 'oval'], distractor: 'blue' },
        { category: 'Tools', words: ['hammer', 'saw', 'drill', 'wrench', 'pliers', 'tape'], distractor: 'apple' },
        { category: 'Furniture', words: ['chair', 'table', 'bed', 'desk', 'couch', 'shelf'], distractor: 'shoe' },
      ],
    },
    'short-vowel-spelling': {
      words: [
        { word: 'flag', hint: 'it waves in the wind' }, { word: 'sled', hint: 'you ride it on snow' },
        { word: 'skip', hint: 'a happy way to move' }, { word: 'drop', hint: 'to let something fall' },
        { word: 'drum', hint: 'you hit it to make music' }, { word: 'clap', hint: 'you do it with your hands' },
        { word: 'step', hint: 'you take one when you walk' }, { word: 'grin', hint: 'a big smile' },
        { word: 'stop', hint: 'the opposite of go' }, { word: 'plug', hint: 'it goes in the wall for power' },
      ],
    },
    'long-vowel-spelling': {
      words: [
        { word: 'cake', hint: 'a birthday treat', pattern: 'CVCe' },
        { word: 'bike', hint: 'you ride it with pedals', pattern: 'CVCe' },
        { word: 'bone', hint: 'a dog likes to chew this', pattern: 'CVCe' },
        { word: 'rain', hint: 'water from the sky', pattern: 'vowel team' },
        { word: 'seed', hint: 'you plant it in the ground', pattern: 'vowel team' },
        { word: 'boat', hint: 'it floats on water', pattern: 'vowel team' },
        { word: 'tube', hint: 'a hollow cylinder', pattern: 'CVCe' },
        { word: 'mail', hint: 'letters brought to your house', pattern: 'vowel team' },
        { word: 'tree', hint: 'it has leaves and branches', pattern: 'vowel team' },
        { word: 'game', hint: 'something fun to play', pattern: 'CVCe' },
      ],
    },
  },
  'grade-2': {
    'context-clues-definition': {
      items: [
        { sentence: 'A habitat is the place where an animal lives.', word: 'habitat', answer: 'the place where an animal lives', clueType: 'definition' },
        { sentence: 'The dog was famished, meaning very hungry.', word: 'famished', answer: 'very hungry', clueType: 'definition' },
        { sentence: 'A chrysalis, which is a hard shell, protects the caterpillar.', word: 'chrysalis', answer: 'a hard shell', clueType: 'definition' },
        { sentence: 'She felt jubilant, or extremely happy, when she won.', word: 'jubilant', answer: 'extremely happy', clueType: 'definition' },
        { sentence: 'The arid, or very dry, desert has little rain.', word: 'arid', answer: 'very dry', clueType: 'definition' },
        { sentence: 'A predator is an animal that hunts other animals.', word: 'predator', answer: 'an animal that hunts other animals', clueType: 'definition' },
        { sentence: 'Nocturnal means active at night.', word: 'nocturnal', answer: 'active at night', clueType: 'definition' },
        { sentence: 'The transparent, or see-through, glass was very clean.', word: 'transparent', answer: 'see-through', clueType: 'definition' },
      ],
    },
    'context-clues-synonym': {
      items: [
        { sentence: 'The enormous elephant was huge compared to the mouse.', word: 'enormous', answer: 'huge', clueType: 'synonym' },
        { sentence: 'She was elated and happy about the surprise party.', word: 'elated', answer: 'happy', clueType: 'synonym' },
        { sentence: 'The tiny, little kitten fit in one hand.', word: 'tiny', answer: 'little', clueType: 'synonym' },
        { sentence: 'He was exhausted and tired after running the race.', word: 'exhausted', answer: 'tired', clueType: 'synonym' },
        { sentence: 'The beautiful, lovely garden had many flowers.', word: 'lovely', answer: 'beautiful', clueType: 'synonym' },
        { sentence: 'The rapid, fast river carried the boat downstream.', word: 'rapid', answer: 'fast', clueType: 'synonym' },
        { sentence: 'She was furious, angry that her toy was broken.', word: 'furious', answer: 'angry', clueType: 'synonym' },
        { sentence: 'The frigid, cold wind made them shiver.', word: 'frigid', answer: 'cold', clueType: 'synonym' },
      ],
    },
    'homophones-basic': {
      items: [
        { pair: ['see', 'sea'], sentences: ['I can ___ the bird.', 'Fish live in the ___.'], answers: ['see', 'sea'] },
        { pair: ['hear', 'here'], sentences: ['I can ___ you.', 'Come over ___.'], answers: ['hear', 'here'] },
        { pair: ['write', 'right'], sentences: ['I ___ my name.', 'Turn ___ at the corner.'], answers: ['write', 'right'] },
        { pair: ['no', 'know'], sentences: ['I have ___ pencil.', 'I ___ the answer.'], answers: ['no', 'know'] },
        { pair: ['ate', 'eight'], sentences: ['She ___ lunch.', 'He has ___ crayons.'], answers: ['ate', 'eight'] },
        { pair: ['flower', 'flour'], sentences: ['A rose is a ___.', 'Bread is made from ___.'], answers: ['flower', 'flour'] },
        { pair: ['sun', 'son'], sentences: ['The ___ is bright.', 'He is their ___.'], answers: ['sun', 'son'] },
        { pair: ['blue', 'blew'], sentences: ['The sky is ___.', 'The wind ___ hard.'], answers: ['blue', 'blew'] },
      ],
    },
    'multiple-meanings': {
      items: [
        { word: 'bat', meanings: ['a stick used in baseball', 'a flying animal'], sentences: ['She hit the ball with a ___.', 'The ___ flew out of the cave.'] },
        { word: 'ring', meanings: ['jewelry for your finger', 'to make a bell sound'], sentences: ['She wore a gold ___.', 'Did you hear the bell ___?'] },
        { word: 'bark', meanings: ['the sound a dog makes', 'the outside of a tree'], sentences: ['The dog will ___ at strangers.', 'The tree ___ was rough.'] },
        { word: 'light', meanings: ['not heavy', 'brightness'], sentences: ['The feather is ___.', 'Turn on the ___.'] },
        { word: 'fall', meanings: ['to drop down', 'a season of the year'], sentences: ['Be careful not to ___.', 'Leaves change color in ___.'] },
        { word: 'match', meanings: ['a small stick that makes fire', 'a game or contest'], sentences: ['Strike a ___ carefully.', 'We watched the soccer ___.'] },
        { word: 'bank', meanings: ['edge of a river', 'where you keep money'], sentences: ['We sat on the river ___.', 'She put money in the ___.'] },
        { word: 'wave', meanings: ['to move your hand', 'water in the ocean'], sentences: ['___ goodbye to grandma.', 'A big ___ crashed on shore.'] },
      ],
    },
    'prefixes-un-re': {
      items: [
        { word: 'undo', prefix: 'un', base: 'do', meaning: 'reverse doing' },
        { word: 'unhappy', prefix: 'un', base: 'happy', meaning: 'not happy' },
        { word: 'unfair', prefix: 'un', base: 'fair', meaning: 'not fair' },
        { word: 'unlock', prefix: 'un', base: 'lock', meaning: 'reverse locking' },
        { word: 'unsafe', prefix: 'un', base: 'safe', meaning: 'not safe' },
        { word: 'redo', prefix: 're', base: 'do', meaning: 'do again' },
        { word: 'reread', prefix: 're', base: 'read', meaning: 'read again' },
        { word: 'rewrite', prefix: 're', base: 'write', meaning: 'write again' },
        { word: 'rebuild', prefix: 're', base: 'build', meaning: 'build again' },
        { word: 'replay', prefix: 're', base: 'play', meaning: 'play again' },
      ],
    },
    'suffixes-ful-less': {
      items: [
        { word: 'careful', base: 'care', suffix: 'ful', meaning: 'full of care' },
        { word: 'helpful', base: 'help', suffix: 'ful', meaning: 'full of help' },
        { word: 'hopeful', base: 'hope', suffix: 'ful', meaning: 'full of hope' },
        { word: 'thankful', base: 'thank', suffix: 'ful', meaning: 'full of thanks' },
        { word: 'cheerful', base: 'cheer', suffix: 'ful', meaning: 'full of cheer' },
        { word: 'careless', base: 'care', suffix: 'less', meaning: 'without care' },
        { word: 'helpless', base: 'help', suffix: 'less', meaning: 'without help' },
        { word: 'hopeless', base: 'hope', suffix: 'less', meaning: 'without hope' },
        { word: 'fearless', base: 'fear', suffix: 'less', meaning: 'without fear' },
        { word: 'harmless', base: 'harm', suffix: 'less', meaning: 'without harm' },
      ],
    },
    'vowel-team-spelling': {
      words: [
        { word: 'rain', hint: 'water from the sky', pattern: 'ai' },
        { word: 'boat', hint: 'floats on water', pattern: 'oa' },
        { word: 'team', hint: 'a group playing together', pattern: 'ea' },
        { word: 'seed', hint: 'plant this to grow flowers', pattern: 'ee' },
        { word: 'mail', hint: 'letters delivered to your house', pattern: 'ai' },
        { word: 'road', hint: 'cars drive on it', pattern: 'oa' },
        { word: 'peak', hint: 'the top of a mountain', pattern: 'ea' },
        { word: 'feet', hint: 'you walk on them', pattern: 'ee' },
        { word: 'tail', hint: 'a dog wags it', pattern: 'ai' },
        { word: 'goat', hint: 'a farm animal that climbs', pattern: 'oa' },
      ],
    },
  },
  'grade-3': {
    'context-clues-all': {
      items: [
        { sentence: 'Unlike her timid sister, Maria was bold and fearless.', word: 'timid', answer: 'shy or fearful', clueType: 'antonym' },
        { sentence: 'The meticulous boy carefully organized every pencil in his desk.', word: 'meticulous', answer: 'very careful and precise', clueType: 'example' },
        { sentence: 'The comedian was hilarious; the audience could not stop laughing.', word: 'hilarious', answer: 'very funny', clueType: 'inference' },
        { sentence: 'Camouflage, or colors and patterns that help animals hide, keeps them safe.', word: 'camouflage', answer: 'colors and patterns that help animals hide', clueType: 'definition' },
        { sentence: 'She was so ravenous after the hike that she ate three sandwiches.', word: 'ravenous', answer: 'extremely hungry', clueType: 'inference' },
        { sentence: 'The fragile vase broke when it fell off the table.', word: 'fragile', answer: 'easily broken', clueType: 'inference' },
        { sentence: 'The dilapidated house had broken windows and a falling roof, unlike the new house next door.', word: 'dilapidated', answer: 'old and in poor condition', clueType: 'antonym' },
        { sentence: 'An herbivore, meaning an animal that eats only plants, needs lots of greens.', word: 'herbivore', answer: 'an animal that eats only plants', clueType: 'definition' },
      ],
    },
    'prefixes-dis-mis-non': {
      items: [
        { word: 'disagree', prefix: 'dis', base: 'agree', meaning: 'not agree' },
        { word: 'disappear', prefix: 'dis', base: 'appear', meaning: 'stop being visible' },
        { word: 'dislike', prefix: 'dis', base: 'like', meaning: 'not like' },
        { word: 'disconnect', prefix: 'dis', base: 'connect', meaning: 'break the connection' },
        { word: 'misspell', prefix: 'mis', base: 'spell', meaning: 'spell wrongly' },
        { word: 'misplace', prefix: 'mis', base: 'place', meaning: 'put in the wrong place' },
        { word: 'mislead', prefix: 'mis', base: 'lead', meaning: 'lead in the wrong way' },
        { word: 'nonsense', prefix: 'non', base: 'sense', meaning: 'without sense' },
        { word: 'nonfiction', prefix: 'non', base: 'fiction', meaning: 'not fiction' },
        { word: 'nonstop', prefix: 'non', base: 'stop', meaning: 'without stopping' },
      ],
    },
    'suffixes-tion-ment-ness': {
      items: [
        { word: 'action', base: 'act', suffix: 'tion', meaning: 'the process of acting' },
        { word: 'direction', base: 'direct', suffix: 'tion', meaning: 'the act of directing' },
        { word: 'celebration', base: 'celebrate', suffix: 'tion', meaning: 'the act of celebrating' },
        { word: 'education', base: 'educate', suffix: 'tion', meaning: 'the process of educating' },
        { word: 'movement', base: 'move', suffix: 'ment', meaning: 'the act of moving' },
        { word: 'payment', base: 'pay', suffix: 'ment', meaning: 'the act of paying' },
        { word: 'excitement', base: 'excite', suffix: 'ment', meaning: 'the state of being excited' },
        { word: 'darkness', base: 'dark', suffix: 'ness', meaning: 'the state of being dark' },
        { word: 'kindness', base: 'kind', suffix: 'ness', meaning: 'the quality of being kind' },
        { word: 'happiness', base: 'happy', suffix: 'ness', meaning: 'the state of being happy' },
      ],
    },
    'latin-roots-basic': {
      roots: [
        { root: 'rupt', meaning: 'break', words: ['erupt', 'disrupt', 'interrupt', 'corrupt', 'rupture'] },
        { root: 'dict', meaning: 'say', words: ['predict', 'dictionary', 'dictate', 'contradict', 'verdict'] },
        { root: 'port', meaning: 'carry', words: ['transport', 'import', 'export', 'report', 'portable'] },
        { root: 'vis/vid', meaning: 'see', words: ['visible', 'vision', 'video', 'invisible', 'visual'] },
        { root: 'aud', meaning: 'hear', words: ['audience', 'audio', 'auditorium', 'audible', 'audition'] },
        { root: 'scrib/script', meaning: 'write', words: ['describe', 'script', 'prescribe', 'inscription', 'manuscript'] },
      ],
    },
    'homophones-advanced': {
      items: [
        { pair: ['their', 'there', "they're"], sentences: ['___ going to the park.', 'Put the book over ___.', '___ dog is big.'], answers: ["They're", 'there', 'Their'] },
        { pair: ['to', 'too', 'two'], sentences: ['I want ___ go.', 'She ate ___ much.', 'I have ___ cats.'], answers: ['to', 'too', 'two'] },
        { pair: ['your', "you're"], sentences: ['___ bag is heavy.', '___ going to love this.'], answers: ['Your', "You're"] },
        { pair: ['its', "it's"], sentences: ['The dog wagged ___ tail.', '___ raining outside.'], answers: ['its', "It's"] },
        { pair: ['piece', 'peace'], sentences: ['Can I have a ___ of cake?', 'The treaty brought ___.'], answers: ['piece', 'peace'] },
        { pair: ['break', 'brake'], sentences: ['Be careful not to ___ it.', 'Press the ___ to stop.'], answers: ['break', 'brake'] },
        { pair: ['weather', 'whether'], sentences: ['The ___ is sunny today.', 'I wonder ___ it will rain.'], answers: ['weather', 'whether'] },
        { pair: ['principal', 'principle'], sentences: ['The school ___ gave a speech.', 'Honesty is an important ___.'], answers: ['principal', 'principle'] },
      ],
    },
    'shades-of-meaning-advanced': {
      groups: [
        { base: 'angry', shades: ['annoyed', 'irritated', 'angry', 'furious', 'enraged'], order: 'mild to strong' },
        { base: 'afraid', shades: ['uneasy', 'nervous', 'afraid', 'frightened', 'terrified'], order: 'mild to strong' },
        { base: 'look', shades: ['glance', 'peek', 'look', 'stare', 'gaze'], order: 'brief to long' },
        { base: 'good', shades: ['okay', 'fine', 'good', 'great', 'excellent', 'superb'], order: 'mild to strong' },
        { base: 'bad', shades: ['poor', 'bad', 'awful', 'terrible', 'dreadful', 'horrendous'], order: 'mild to strong' },
        { base: 'laugh', shades: ['smile', 'chuckle', 'giggle', 'laugh', 'cackle', 'roar'], order: 'mild to strong' },
        { base: 'cry', shades: ['whimper', 'sniffle', 'cry', 'weep', 'sob', 'wail'], order: 'mild to strong' },
        { base: 'run', shades: ['jog', 'run', 'sprint', 'dash', 'bolt', 'race'], order: 'slow to fast' },
      ],
    },
    'spelling-rules': {
      items: [
        { word: 'hopping', rule: 'double consonant before -ing (CVC)', base: 'hop' },
        { word: 'hoped', rule: 'drop silent e before -ed', base: 'hope' },
        { word: 'babies', rule: 'change y to i before -es', base: 'baby' },
        { word: 'making', rule: 'drop silent e before -ing', base: 'make' },
        { word: 'cried', rule: 'change y to i before -ed', base: 'cry' },
        { word: 'running', rule: 'double consonant before -ing (CVC)', base: 'run' },
        { word: 'baked', rule: 'drop silent e before -ed', base: 'bake' },
        { word: 'stories', rule: 'change y to i before -es', base: 'story' },
        { word: 'sitting', rule: 'double consonant before -ing (CVC)', base: 'sit' },
        { word: 'driving', rule: 'drop silent e before -ing', base: 'drive' },
      ],
    },
  },
  'grade-4': {
    'greek-latin-roots': {
      roots: [
        { root: 'tele', meaning: 'far', origin: 'Greek', words: ['telephone', 'television', 'telescope', 'telegraph', 'teleport'] },
        { root: 'auto', meaning: 'self', origin: 'Greek', words: ['automobile', 'automatic', 'autograph', 'autobiography', 'autopilot'] },
        { root: 'bio', meaning: 'life', origin: 'Greek', words: ['biology', 'biography', 'biome', 'antibiotic', 'biodegradable'] },
        { root: 'geo', meaning: 'earth', origin: 'Greek', words: ['geography', 'geology', 'geometry', 'geothermal', 'geocache'] },
        { root: 'tract', meaning: 'pull/drag', origin: 'Latin', words: ['attract', 'tractor', 'subtract', 'contract', 'extract'] },
        { root: 'ject', meaning: 'throw', origin: 'Latin', words: ['reject', 'inject', 'project', 'eject', 'object'] },
        { root: 'cred', meaning: 'believe', origin: 'Latin', words: ['credit', 'incredible', 'credible', 'credential', 'creed'] },
        { root: 'aqua', meaning: 'water', origin: 'Latin', words: ['aquarium', 'aquatic', 'aqueduct', 'aquamarine', 'aquifer'] },
      ],
    },
    'context-in-text': {
      items: [
        { passage: 'The pioneers had to be resourceful. When their wagon wheel broke, they used branches and rope to repair it.', word: 'resourceful', answer: 'able to find ways to solve problems', clueType: 'example' },
        { passage: 'The barren land had no trees, no grass, and no flowers. Nothing grew there at all.', word: 'barren', answer: 'empty with nothing growing', clueType: 'example' },
        { passage: 'Maria was reluctant to jump off the diving board. She stood at the edge for a long time, looking nervous.', word: 'reluctant', answer: 'unwilling or hesitant', clueType: 'inference' },
        { passage: 'The pristine lake was crystal clear. You could see fish swimming near the bottom.', word: 'pristine', answer: 'perfectly clean and pure', clueType: 'inference' },
        { passage: 'Unlike his gregarious sister who loved parties, Tom preferred to be alone.', word: 'gregarious', answer: 'sociable, enjoys being with others', clueType: 'antonym' },
        { passage: 'The ancient civilization was prosperous. Its people had plenty of food, beautiful homes, and fine clothing.', word: 'prosperous', answer: 'wealthy and successful', clueType: 'example' },
        { passage: 'Erosion, the wearing away of rock and soil by wind and water, shaped the canyon over millions of years.', word: 'erosion', answer: 'wearing away of rock and soil', clueType: 'definition' },
        { passage: 'The commotion in the hallway — yelling, running, doors slamming — disrupted every classroom.', word: 'commotion', answer: 'noisy disturbance', clueType: 'example' },
      ],
    },
    'figurative-meanings': {
      items: [
        { expression: 'break the ice', meaning: 'start a conversation or ease tension', type: 'idiom', sentence: 'The new student told a joke to break the ice.' },
        { expression: 'costs an arm and a leg', meaning: 'very expensive', type: 'idiom', sentence: 'That new bike costs an arm and a leg.' },
        { expression: 'the apple of my eye', meaning: 'someone you love very much', type: 'idiom', sentence: 'My granddaughter is the apple of my eye.' },
        { expression: 'hit the books', meaning: 'study hard', type: 'idiom', sentence: 'I need to hit the books before the test.' },
        { expression: 'under the weather', meaning: 'feeling sick', type: 'idiom', sentence: 'She stayed home because she was under the weather.' },
        { expression: 'the classroom was a zoo', meaning: 'the classroom was wild and noisy', type: 'metaphor', sentence: 'With the substitute teacher, the classroom was a zoo.' },
        { expression: 'the wind whispered', meaning: 'the wind blew gently', type: 'personification', sentence: 'The wind whispered through the trees.' },
        { expression: 'as brave as a lion', meaning: 'very brave', type: 'simile', sentence: 'The firefighter was as brave as a lion.' },
      ],
    },
    'word-relationships': {
      items: [
        { type: 'synonym', word1: 'enormous', word2: 'huge', relationship: 'synonyms — both mean very big' },
        { type: 'antonym', word1: 'generous', word2: 'selfish', relationship: 'antonyms — opposite meanings' },
        { type: 'part-whole', word1: 'petal', word2: 'flower', relationship: 'part to whole — petal is part of a flower' },
        { type: 'category', word1: 'oak', word2: 'tree', relationship: 'type to category — oak is a type of tree' },
        { type: 'cause-effect', word1: 'drought', word2: 'famine', relationship: 'cause and effect — drought can cause famine' },
        { type: 'synonym', word1: 'ancient', word2: 'old', relationship: 'synonyms — both mean from long ago' },
        { type: 'antonym', word1: 'victory', word2: 'defeat', relationship: 'antonyms — opposite meanings' },
        { type: 'part-whole', word1: 'chapter', word2: 'book', relationship: 'part to whole — chapter is part of a book' },
      ],
    },
    'prefix-suffix-combo': {
      items: [
        { word: 'uncomfortable', parts: ['un', 'comfort', 'able'], meaning: 'not able to be comfortable' },
        { word: 'disagreement', parts: ['dis', 'agree', 'ment'], meaning: 'the state of not agreeing' },
        { word: 'unbreakable', parts: ['un', 'break', 'able'], meaning: 'not able to be broken' },
        { word: 'rebuilding', parts: ['re', 'build', 'ing'], meaning: 'building again' },
        { word: 'unluckily', parts: ['un', 'luck', 'ily'], meaning: 'in a way that is not lucky' },
        { word: 'mistreatment', parts: ['mis', 'treat', 'ment'], meaning: 'the act of treating wrongly' },
        { word: 'reheateable', parts: ['re', 'heat', 'able'], meaning: 'able to be heated again' },
        { word: 'disappearance', parts: ['dis', 'appear', 'ance'], meaning: 'the act of not appearing' },
        { word: 'unforgettable', parts: ['un', 'forget', 'able'], meaning: 'not able to be forgotten' },
        { word: 'replacement', parts: ['re', 'place', 'ment'], meaning: 'the act of placing again' },
      ],
    },
    'domain-vocabulary': {
      domains: [
        { domain: 'Science', words: [
          { word: 'hypothesis', definition: 'an educated guess or prediction' },
          { word: 'experiment', definition: 'a test to find out something' },
          { word: 'observation', definition: 'watching carefully and taking notes' },
          { word: 'conclusion', definition: 'what you learn from an experiment' },
          { word: 'variable', definition: 'something that can change in an experiment' },
          { word: 'data', definition: 'information collected during research' },
        ]},
        { domain: 'Social Studies', words: [
          { word: 'democracy', definition: 'government by the people' },
          { word: 'economy', definition: 'the system of making and spending money' },
          { word: 'immigrant', definition: 'a person who moves to a new country' },
          { word: 'colony', definition: 'a territory controlled by another country' },
          { word: 'constitution', definition: 'the basic laws of a government' },
          { word: 'revolution', definition: 'a big change or overthrow of government' },
        ]},
      ],
    },
    'advanced-spelling': {
      words: [
        { word: 'knowledge', hint: 'what you learn', tricky: 'silent k and silent d-g-e' },
        { word: 'different', hint: 'not the same', tricky: 'two f letters' },
        { word: 'February', hint: 'the second month', tricky: 'silent first r' },
        { word: 'library', hint: 'where you borrow books', tricky: 'two r sounds' },
        { word: 'surprise', hint: 'something unexpected', tricky: 'sur- not ser-' },
        { word: 'separate', hint: 'to keep apart', tricky: 'a-not-e in the middle' },
        { word: 'necessary', hint: 'needed', tricky: 'one c, two s' },
        { word: 'calendar', hint: 'shows the days and months', tricky: '-ar not -er ending' },
        { word: 'beautiful', hint: 'very pretty', tricky: 'beau- spelling' },
        { word: 'beginning', hint: 'the start', tricky: 'double n' },
      ],
    },
  },
  'grade-5': {
    'morphology-analysis': {
      items: [
        { word: 'unbelievable', morphemes: ['un-', 'believe', '-able'], meaning: 'not able to be believed' },
        { word: 'transportation', morphemes: ['trans-', 'port', '-ation'], meaning: 'the act of carrying across' },
        { word: 'international', morphemes: ['inter-', 'nation', '-al'], meaning: 'between nations' },
        { word: 'reconstruction', morphemes: ['re-', 'con-', 'struct', '-ion'], meaning: 'the act of building together again' },
        { word: 'irresponsible', morphemes: ['ir-', 'respons', '-ible'], meaning: 'not capable of being responsible' },
        { word: 'overproduction', morphemes: ['over-', 'product', '-ion'], meaning: 'making too much' },
        { word: 'miscommunication', morphemes: ['mis-', 'communicat', '-ion'], meaning: 'wrong communication' },
        { word: 'predetermined', morphemes: ['pre-', 'determine', '-ed'], meaning: 'decided before' },
      ],
    },
    'connotation-denotation': {
      items: [
        { word: 'cheap', denotation: 'low cost', connotation: 'negative — implies poor quality', neutral: 'inexpensive' },
        { word: 'childish', denotation: 'like a child', connotation: 'negative — implies immature', neutral: 'childlike' },
        { word: 'stubborn', denotation: 'not easily persuaded', connotation: 'negative — implies unreasonable', neutral: 'determined' },
        { word: 'nosy', denotation: 'wanting to know things', connotation: 'negative — implies rude', neutral: 'curious' },
        { word: 'slim', denotation: 'thin body', connotation: 'positive — implies attractive', neutral: 'thin' },
        { word: 'unique', denotation: 'one of a kind', connotation: 'positive — implies special', neutral: 'different' },
        { word: 'thrifty', denotation: 'careful with money', connotation: 'positive — implies wise', neutral: 'economical' },
        { word: 'vintage', denotation: 'from the past', connotation: 'positive — implies valuable', neutral: 'old' },
      ],
    },
    'analogies': {
      items: [
        { analogy: 'Hot is to cold as up is to ___', answer: 'down', type: 'antonyms' },
        { analogy: 'Puppy is to dog as kitten is to ___', answer: 'cat', type: 'young to adult' },
        { analogy: 'Pen is to write as scissors is to ___', answer: 'cut', type: 'tool to function' },
        { analogy: 'Fish is to water as bird is to ___', answer: 'air', type: 'animal to habitat' },
        { analogy: 'Page is to book as room is to ___', answer: 'house', type: 'part to whole' },
        { analogy: 'Happy is to ecstatic as sad is to ___', answer: 'devastated', type: 'degree' },
        { analogy: 'Painter is to brush as writer is to ___', answer: 'pen', type: 'person to tool' },
        { analogy: 'Bread is to bakery as medicine is to ___', answer: 'pharmacy', type: 'product to place' },
        { analogy: 'Paw is to cat as hoof is to ___', answer: 'horse', type: 'part to animal' },
        { analogy: 'Inch is to foot as minute is to ___', answer: 'hour', type: 'smaller to larger unit' },
      ],
    },
    'etymology-basics': {
      items: [
        { word: 'telephone', origin: 'Greek: tele (far) + phone (sound)', meaning: 'sound from far away' },
        { word: 'bicycle', origin: 'Latin: bi (two) + Greek: kyklos (wheel)', meaning: 'two wheels' },
        { word: 'aquarium', origin: 'Latin: aqua (water) + -arium (place for)', meaning: 'place for water' },
        { word: 'astronaut', origin: 'Greek: astron (star) + nautes (sailor)', meaning: 'star sailor' },
        { word: 'microscope', origin: 'Greek: mikros (small) + skopein (to look)', meaning: 'tool for looking at small things' },
        { word: 'photograph', origin: 'Greek: phos (light) + graphein (to write)', meaning: 'writing with light' },
        { word: 'thermometer', origin: 'Greek: thermos (heat) + metron (measure)', meaning: 'heat measurer' },
        { word: 'octopus', origin: 'Greek: okto (eight) + pous (foot)', meaning: 'eight feet' },
      ],
    },
    'academic-vocabulary': {
      items: [
        { word: 'analyze', definition: 'examine something carefully by looking at its parts', sentence: 'We will analyze the poem to find its theme.' },
        { word: 'evaluate', definition: 'judge or determine the value of something', sentence: 'Please evaluate the strength of this argument.' },
        { word: 'synthesize', definition: 'combine ideas from different sources into something new', sentence: 'Synthesize the information from both articles.' },
        { word: 'infer', definition: 'figure out something not directly stated', sentence: 'What can you infer from the character\'s actions?' },
        { word: 'contrast', definition: 'show how things are different', sentence: 'Contrast the two main characters in the story.' },
        { word: 'summarize', definition: 'briefly state the main points', sentence: 'Summarize the chapter in your own words.' },
        { word: 'justify', definition: 'give reasons to support your answer', sentence: 'Justify your answer with evidence from the text.' },
        { word: 'formulate', definition: 'create or develop a plan or idea', sentence: 'Formulate a hypothesis before the experiment.' },
      ],
    },
    'spelling-patterns-advanced': {
      items: [
        { word: 'receive', rule: 'i before e except after c', pattern: 'ei after c' },
        { word: 'believe', rule: 'i before e', pattern: 'ie' },
        { word: 'accommodate', rule: 'double c, double m', pattern: 'double letters' },
        { word: 'occurrence', rule: 'double c, double r', pattern: 'double letters' },
        { word: 'conscience', rule: 'sc makes /sh/ sound', pattern: 'silent letters' },
        { word: 'rhythm', rule: 'no vowels in common sense', pattern: 'unusual vowel' },
        { word: 'mischievous', rule: 'not mis-CHEEV-ee-us', pattern: 'commonly misspelled' },
        { word: 'lieutenant', rule: 'silent letters in middle', pattern: 'silent letters' },
        { word: 'Wednesday', rule: 'silent d-n-e-s', pattern: 'silent letters' },
        { word: 'definitely', rule: '-ite- not -ate-', pattern: 'commonly misspelled' },
      ],
    },
  },
  'grade-6': {
    'word-origins': {
      items: [
        { word: 'democracy', origin: 'Greek: demos (people) + kratos (power)', meaning: 'power of the people', context: 'government' },
        { word: 'chronic', origin: 'Greek: chronos (time)', meaning: 'lasting a long time', context: 'medical' },
        { word: 'benevolent', origin: 'Latin: bene (well) + volent (wishing)', meaning: 'well-wishing, kind', context: 'character' },
        { word: 'contradict', origin: 'Latin: contra (against) + dicere (to say)', meaning: 'to say the opposite', context: 'argument' },
        { word: 'manuscript', origin: 'Latin: manus (hand) + scriptum (written)', meaning: 'written by hand', context: 'literature' },
        { word: 'philosophy', origin: 'Greek: philos (loving) + sophia (wisdom)', meaning: 'love of wisdom', context: 'thinking' },
        { word: 'pandemic', origin: 'Greek: pan (all) + demos (people)', meaning: 'affecting all people', context: 'health' },
        { word: 'circumnavigate', origin: 'Latin: circum (around) + navigare (to sail)', meaning: 'to sail around', context: 'exploration' },
      ],
    },
    'nuance-tone': {
      items: [
        { set: ['request', 'demand', 'plead', 'insist', 'beg'], context: 'asking for something', toneOrder: 'polite to forceful: request, insist, demand; desperate: plead, beg' },
        { set: ['assertive', 'aggressive', 'confident', 'arrogant', 'bold'], context: 'showing strength', toneOrder: 'positive: confident, assertive, bold; negative: aggressive, arrogant' },
        { set: ['observe', 'scrutinize', 'glance', 'inspect', 'spy'], context: 'looking at something', toneOrder: 'casual: glance, observe; detailed: inspect, scrutinize; secretive: spy' },
        { set: ['frugal', 'stingy', 'thrifty', 'miserly', 'economical'], context: 'spending money', toneOrder: 'positive: thrifty, frugal, economical; negative: stingy, miserly' },
        { set: ['slender', 'skinny', 'scrawny', 'lean', 'gaunt'], context: 'describing thinness', toneOrder: 'positive: slender, lean; neutral: skinny; negative: scrawny, gaunt' },
        { set: ['debate', 'argue', 'quarrel', 'discuss', 'bicker'], context: 'disagreeing', toneOrder: 'formal: debate, discuss; informal: argue; negative: quarrel, bicker' },
        { set: ['persuade', 'manipulate', 'convince', 'coerce', 'influence'], context: 'changing minds', toneOrder: 'positive: persuade, convince, influence; negative: manipulate, coerce' },
        { set: ['curious', 'nosy', 'inquisitive', 'prying', 'interested'], context: 'wanting to know', toneOrder: 'positive: curious, inquisitive, interested; negative: nosy, prying' },
      ],
    },
    'technical-vocabulary': {
      domains: [
        { domain: 'Mathematics', words: [
          { word: 'integer', definition: 'a whole number, positive or negative' },
          { word: 'ratio', definition: 'a comparison of two quantities' },
          { word: 'variable', definition: 'a letter representing an unknown value' },
          { word: 'coefficient', definition: 'the number multiplied by a variable' },
          { word: 'equation', definition: 'a statement that two expressions are equal' },
          { word: 'proportion', definition: 'an equation showing two ratios are equal' },
        ]},
        { domain: 'Science', words: [
          { word: 'photosynthesis', definition: 'the process plants use to convert sunlight to food' },
          { word: 'ecosystem', definition: 'a community of living things and their environment' },
          { word: 'molecule', definition: 'the smallest unit of a substance' },
          { word: 'metamorphosis', definition: 'a major change in body form during development' },
          { word: 'hypothesis', definition: 'a testable prediction about what will happen' },
          { word: 'organism', definition: 'any living thing' },
        ]},
      ],
    },
    'word-analysis-strategy': {
      items: [
        { word: 'unprecedented', steps: ['un- = not', 'pre- = before', 'cede = go', '-ent = adjective', '-ed = past'], meaning: 'never done or experienced before' },
        { word: 'biodegradable', steps: ['bio- = life', 'de- = down/away', 'grad = step', '-able = capable of'], meaning: 'capable of being broken down by living things' },
        { word: 'electromagnetic', steps: ['electro- = electric', 'magnet = attract', '-ic = relating to'], meaning: 'relating to electricity and magnetism' },
        { word: 'autobiography', steps: ['auto- = self', 'bio- = life', 'graph = write', '-y = noun'], meaning: 'a self-written life story' },
        { word: 'incomprehensible', steps: ['in- = not', 'com- = together', 'prehend = grasp', '-ible = capable of'], meaning: 'not capable of being grasped or understood' },
        { word: 'disproportionate', steps: ['dis- = not', 'pro- = forward', 'portion = part', '-ate = having'], meaning: 'not having proper proportion' },
        { word: 'telecommunication', steps: ['tele- = far', 'com- = together', 'munic = share', '-ation = process'], meaning: 'the process of sharing information over distance' },
        { word: 'antiestablishment', steps: ['anti- = against', 'establish = set up', '-ment = state of'], meaning: 'against the established system' },
      ],
    },
    'advanced-morphology': {
      items: [
        { word: 'metamorphosis', prefix: 'meta-', root: 'morph', suffix: '-osis', rootMeaning: 'form/shape', wordMeaning: 'transformation of form' },
        { word: 'philanthropy', prefix: '', root: 'phil + anthrop', suffix: '-y', rootMeaning: 'love + human', wordMeaning: 'love of humankind, charity' },
        { word: 'synchronize', prefix: 'syn-', root: 'chron', suffix: '-ize', rootMeaning: 'time', wordMeaning: 'to make happen at the same time' },
        { word: 'pseudoscience', prefix: 'pseudo-', root: 'scien', suffix: '-ce', rootMeaning: 'false + knowledge', wordMeaning: 'false or fake science' },
        { word: 'anthropology', prefix: '', root: 'anthrop + log', suffix: '-y', rootMeaning: 'human + study', wordMeaning: 'the study of humans' },
        { word: 'hemisphere', prefix: 'hemi-', root: 'sphere', suffix: '', rootMeaning: 'half + ball', wordMeaning: 'half of a sphere' },
        { word: 'polyglot', prefix: 'poly-', root: 'glot', suffix: '', rootMeaning: 'many + tongue', wordMeaning: 'a person who speaks many languages' },
        { word: 'microbiology', prefix: 'micro-', root: 'bio + log', suffix: '-y', rootMeaning: 'small + life + study', wordMeaning: 'the study of small living things' },
      ],
    },
  },
};

// ── Word of the Day banks ──

const WORD_OF_DAY = {
  'kindergarten': [
    { word: 'curious', definition: 'wanting to learn or know about things', sentence: 'The curious kitten sniffed everything in the room.' },
    { word: 'brave', definition: 'not afraid to do hard things', sentence: 'The brave girl climbed to the top of the slide.' },
    { word: 'gentle', definition: 'soft and kind', sentence: 'Be gentle when you hold the baby bunny.' },
    { word: 'proud', definition: 'feeling good about something you did', sentence: 'She was proud of her drawing.' },
    { word: 'cozy', definition: 'warm and comfortable', sentence: 'The blanket made a cozy spot to read.' },
    { word: 'discover', definition: 'to find something new', sentence: 'I discover new bugs in the garden every day.' },
  ],
  'grade-1': [
    { word: 'adventure', definition: 'an exciting experience', sentence: 'Going to the zoo was a great adventure.' },
    { word: 'patient', definition: 'able to wait without getting upset', sentence: 'The patient boy waited his turn.' },
    { word: 'enormous', definition: 'very, very big', sentence: 'The enormous whale swam past the boat.' },
    { word: 'imagine', definition: 'to make a picture in your mind', sentence: 'I like to imagine I can fly.' },
    { word: 'brilliant', definition: 'very bright or very smart', sentence: 'The brilliant sun lit up the whole sky.' },
    { word: 'gloomy', definition: 'dark and sad-looking', sentence: 'The gloomy sky told us rain was coming.' },
  ],
  'grade-2': [
    { word: 'persevere', definition: 'to keep trying even when it is hard', sentence: 'She had to persevere to finish the puzzle.' },
    { word: 'habitat', definition: 'the natural home of an animal or plant', sentence: 'A pond is a frog\'s habitat.' },
    { word: 'cooperate', definition: 'to work together', sentence: 'We need to cooperate to build the fort.' },
    { word: 'fragile', definition: 'easy to break', sentence: 'The fragile egg cracked when it fell.' },
    { word: 'observe', definition: 'to watch something carefully', sentence: 'We observe the caterpillar every day.' },
    { word: 'magnificent', definition: 'extremely beautiful or impressive', sentence: 'The castle was a magnificent sight.' },
  ],
  'grade-3': [
    { word: 'ambitious', definition: 'having a strong desire to succeed', sentence: 'The ambitious student studied every night.' },
    { word: 'expedition', definition: 'a journey with a purpose', sentence: 'Lewis and Clark went on an expedition west.' },
    { word: 'resourceful', definition: 'good at finding ways to solve problems', sentence: 'The resourceful girl fixed the bike herself.' },
    { word: 'consequence', definition: 'the result of something you do', sentence: 'Staying up late has the consequence of being tired.' },
    { word: 'flourish', definition: 'to grow and do well', sentence: 'With sunshine and water, the plants flourish.' },
    { word: 'reluctant', definition: 'not eager to do something', sentence: 'He was reluctant to try the new food.' },
  ],
  'grade-4': [
    { word: 'innovative', definition: 'introducing new ideas or methods', sentence: 'Her innovative design won the science fair.' },
    { word: 'perspective', definition: 'a way of looking at something', sentence: 'From a bird\'s perspective, the city looks tiny.' },
    { word: 'adversity', definition: 'a difficult situation', sentence: 'She overcame adversity to reach her goal.' },
    { word: 'elaborate', definition: 'detailed and complicated', sentence: 'He built an elaborate model of the solar system.' },
    { word: 'collaborate', definition: 'to work together on a project', sentence: 'The students will collaborate on the report.' },
    { word: 'diligent', definition: 'working hard and carefully', sentence: 'The diligent student checked her work twice.' },
  ],
  'grade-5': [
    { word: 'inevitable', definition: 'sure to happen, unavoidable', sentence: 'Change is inevitable as we grow older.' },
    { word: 'ambiguous', definition: 'having more than one meaning or unclear', sentence: 'The ambiguous directions confused everyone.' },
    { word: 'advocate', definition: 'to speak in support of something', sentence: 'She will advocate for longer recess.' },
    { word: 'resilient', definition: 'able to recover quickly from difficulty', sentence: 'The resilient community rebuilt after the storm.' },
    { word: 'scrutinize', definition: 'to examine very closely', sentence: 'The detective will scrutinize every clue.' },
    { word: 'substantiate', definition: 'to provide evidence for something', sentence: 'You must substantiate your claim with facts.' },
  ],
  'grade-6': [
    { word: 'juxtapose', definition: 'to place side by side for comparison', sentence: 'The artist juxtaposed light and dark colors.' },
    { word: 'unprecedented', definition: 'never done or known before', sentence: 'The snowstorm was unprecedented for this area.' },
    { word: 'ubiquitous', definition: 'found everywhere', sentence: 'Smartphones are ubiquitous in modern life.' },
    { word: 'pragmatic', definition: 'dealing with things in a practical way', sentence: 'The pragmatic leader focused on real solutions.' },
    { word: 'ephemeral', definition: 'lasting for only a short time', sentence: 'The beauty of the sunset was ephemeral.' },
    { word: 'eloquent', definition: 'fluent and persuasive in speaking or writing', sentence: 'The eloquent speech moved the entire audience.' },
  ],
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

function resolveSkillKey(grade, skill) {
  const gs = SKILLS[grade];
  if (!gs) return null;
  for (const [cat, skills] of Object.entries(gs)) { if (skills.includes(skill)) return { grade, category: cat, skill }; }
  return null;
}

function exResult(type, skill, grade, instruction, items) { return { type, skill, grade, count: items.length, instruction, items }; }

// ── Exercise Generation ──

function generateExercise(grade, skill, count = 5) {
  const bank = WORD_BANKS[grade]?.[skill];
  if (!bank) return { error: `No word bank for ${grade}/${skill}` };

  // Kindergarten
  if (skill === 'basic-synonyms' && bank.pairs)
    return exResult('synonym-match', skill, grade, 'What word means the same as the given word?',
      pick(bank.pairs, count).map(p => ({ prompt: `What word means the same as "${p.word}"?`, answer: p.synonym, word: p.word })));

  if (skill === 'basic-antonyms' && bank.pairs)
    return exResult('antonym-match', skill, grade, 'What word means the OPPOSITE of the given word?',
      pick(bank.pairs, count).map(p => ({ prompt: `What is the opposite of "${p.word}"?`, answer: p.antonym, word: p.word })));

  if (skill === 'categories' && bank.groups)
    return exResult('category-sort', skill, grade, 'Which word does NOT belong in this group?',
      pick(bank.groups, count).map(g => {
        const shown = shuffle([...pick(g.words, 3), g.distractor]);
        return { prompt: `Category: ${g.category}. Which word does NOT belong? ${shown.join(', ')}`, answer: g.distractor, category: g.category, words: shown };
      }));

  if (skill === 'cvc-spelling' && bank.words)
    return exResult('spelling', skill, grade, 'Spell the word that matches the clue.',
      pick(bank.words, count).map(w => ({ prompt: `Spell the word: ${w.hint}`, answer: w.word, hint: w.hint })));

  // Grade 1
  if (skill === 'synonyms-antonyms' && bank.items) {
    const mode = Math.random() > 0.5 ? 'synonym' : 'antonym';
    return exResult(mode + '-match', skill, grade, `Give the ${mode} of the word.`,
      pick(bank.items, count).map(i => ({ prompt: `What is a ${mode} of "${i.word}"?`, answer: i[mode], word: i.word })));
  }

  if (skill === 'shades-of-meaning' && bank.groups)
    return exResult('shades', skill, grade, 'Put these words in order from mildest to strongest.',
      pick(bank.groups, count).map(g => ({ prompt: `Order these words (${g.order}): ${shuffle(g.shades).join(', ')}`, answer: g.shades.join(', '), base: g.base, order: g.order })));

  if (skill === 'sorting-categories' && bank.groups)
    return exResult('category-sort', skill, grade, 'Which word does NOT belong in this group?',
      pick(bank.groups, count).map(g => {
        const shown = shuffle([...pick(g.words, 3), g.distractor]);
        return { prompt: `Category: ${g.category}. Which does NOT belong? ${shown.join(', ')}`, answer: g.distractor, category: g.category, words: shown };
      }));

  if ((skill === 'short-vowel-spelling' || skill === 'long-vowel-spelling') && bank.words)
    return exResult('spelling', skill, grade, 'Spell the word that matches the clue.',
      pick(bank.words, count).map(w => ({ prompt: `Spell the word: ${w.hint}`, answer: w.word, hint: w.hint })));

  // Grade 2
  if ((skill === 'context-clues-definition' || skill === 'context-clues-synonym') && bank.items)
    return exResult('context-clues', skill, grade, 'Use the context clues to figure out what the word means.',
      pick(bank.items, count).map(i => ({ prompt: `"${i.sentence}" — What does "${i.word}" mean?`, answer: i.answer, word: i.word, clueType: i.clueType })));

  if (skill === 'homophones-basic' && bank.items)
    return exResult('homophones', skill, grade, 'Fill in the blank with the correct homophone.',
      pick(bank.items, count).map(i => {
        const idx = Math.floor(Math.random() * i.sentences.length);
        return { prompt: `${i.sentences[idx]} (Choose: ${i.pair.join(' or ')})`, answer: i.answers[idx], pair: i.pair };
      }));

  if (skill === 'multiple-meanings' && bank.items)
    return exResult('multiple-meanings', skill, grade, 'This word has more than one meaning. What does it mean in this sentence?',
      pick(bank.items, count).map(i => {
        const idx = Math.floor(Math.random() * i.meanings.length);
        return { prompt: `"${i.sentences[idx]}" — What does "${i.word}" mean here?`, answer: i.meanings[idx], word: i.word, allMeanings: i.meanings };
      }));

  if ((skill === 'prefixes-un-re' || skill === 'prefixes-dis-mis-non') && bank.items)
    return exResult('prefix', skill, grade, 'What is the prefix and base word? What does the word mean?',
      pick(bank.items, count).map(i => ({ prompt: `Break apart "${i.word}": What is the prefix and base word?`, answer: `${i.prefix}- + ${i.base}`, word: i.word, prefix: i.prefix, base: i.base, meaning: i.meaning })));

  if ((skill === 'suffixes-ful-less' || skill === 'suffixes-tion-ment-ness') && bank.items)
    return exResult('suffix', skill, grade, 'What is the base word and suffix? What does the word mean?',
      pick(bank.items, count).map(i => ({ prompt: `Break apart "${i.word}": What is the base word and suffix?`, answer: `${i.base} + -${i.suffix}`, word: i.word, base: i.base, suffix: i.suffix, meaning: i.meaning })));

  if (skill === 'vowel-team-spelling' && bank.words)
    return exResult('spelling', skill, grade, 'Spell the word that matches the clue.',
      pick(bank.words, count).map(w => ({ prompt: `Spell the word (${w.pattern} pattern): ${w.hint}`, answer: w.word, hint: w.hint, pattern: w.pattern })));

  // Grade 3
  if (skill === 'context-clues-all' && bank.items)
    return exResult('context-clues', skill, grade, 'Use context clues to figure out the meaning of the word.',
      pick(bank.items, count).map(i => ({ prompt: `"${i.sentence}" — What does "${i.word}" mean?`, answer: i.answer, word: i.word, clueType: i.clueType })));

  if (skill === 'latin-roots-basic' && bank.roots) {
    const all = bank.roots.flatMap(r => r.words.map(w => ({ word: w, root: r.root, meaning: r.meaning })));
    return exResult('roots', skill, grade, 'What root is in this word, and what does it mean?',
      pick(all, count).map(i => ({ prompt: `What root is in "${i.word}" and what does it mean?`, word: i.word, root: i.root, meaning: i.meaning, answer: `${i.root} (${i.meaning})` })));
  }

  if (skill === 'homophones-advanced' && bank.items)
    return exResult('homophones', skill, grade, 'Fill in the blank with the correct word.',
      pick(bank.items, count).map(i => {
        const idx = Math.floor(Math.random() * i.sentences.length);
        return { prompt: `${i.sentences[idx]} (Choose: ${i.pair.join(', ')})`, answer: i.answers[idx], pair: i.pair };
      }));

  if (skill === 'shades-of-meaning-advanced' && bank.groups)
    return exResult('shades', skill, grade, 'Put these words in order from mildest to strongest.',
      pick(bank.groups, count).map(g => ({ prompt: `Order these words (${g.order}): ${shuffle(g.shades).join(', ')}`, answer: g.shades.join(', '), base: g.base, order: g.order })));

  if (skill === 'spelling-rules' && bank.items)
    return exResult('spelling-rule', skill, grade, 'Apply the spelling rule. What is the correct spelling?',
      pick(bank.items, count).map(i => ({ prompt: `Add the ending to "${i.base}": What is the correct spelling? (Rule: ${i.rule})`, answer: i.word, base: i.base, rule: i.rule })));

  // Grade 4
  if (skill === 'greek-latin-roots' && bank.roots) {
    const all = bank.roots.flatMap(r => r.words.map(w => ({ word: w, root: r.root, meaning: r.meaning, origin: r.origin })));
    return exResult('roots', skill, grade, 'What root is in this word? What does it mean? Is it Greek or Latin?',
      pick(all, count).map(i => ({ prompt: `What root is in "${i.word}"?`, word: i.word, root: i.root, meaning: i.meaning, origin: i.origin, answer: `${i.root} (${i.meaning}) — ${i.origin}` })));
  }

  if (skill === 'context-in-text' && bank.items)
    return exResult('context-clues', skill, grade, 'Read the passage. What does the word mean?',
      pick(bank.items, count).map(i => ({ prompt: `${i.passage} — What does "${i.word}" mean?`, answer: i.answer, word: i.word, clueType: i.clueType })));

  if (skill === 'figurative-meanings' && bank.items)
    return exResult('figurative', skill, grade, 'What does this expression really mean?',
      pick(bank.items, count).map(i => ({ prompt: `What does "${i.expression}" mean? (${i.type})`, answer: i.meaning, expression: i.expression, type: i.type, sentence: i.sentence })));

  if (skill === 'word-relationships' && bank.items)
    return exResult('relationships', skill, grade, 'What is the relationship between these two words?',
      pick(bank.items, count).map(i => ({ prompt: `"${i.word1}" and "${i.word2}" — What is the relationship?`, answer: i.relationship, type: i.type })));

  if (skill === 'prefix-suffix-combo' && bank.items)
    return exResult('word-parts', skill, grade, 'Break this word into its prefix, base, and suffix. What does it mean?',
      pick(bank.items, count).map(i => ({ prompt: `Break apart "${i.word}" into its parts.`, answer: i.parts.join(' + '), word: i.word, parts: i.parts, meaning: i.meaning })));

  if (skill === 'domain-vocabulary' && bank.domains) {
    const all = bank.domains.flatMap(d => d.words.map(w => ({ ...w, domain: d.domain })));
    return exResult('definition', skill, grade, 'What does this word mean?',
      pick(all, count).map(i => ({ prompt: `(${i.domain}) What does "${i.word}" mean?`, answer: i.definition, word: i.word, domain: i.domain })));
  }

  if (skill === 'advanced-spelling' && bank.words)
    return exResult('spelling', skill, grade, 'Spell this tricky word correctly.',
      pick(bank.words, count).map(w => ({ prompt: `Spell the word: ${w.hint} (Tricky part: ${w.tricky})`, answer: w.word, hint: w.hint })));

  // Grade 5
  if (skill === 'morphology-analysis' && bank.items)
    return exResult('morphology', skill, grade, 'Break this word into its morphemes (meaningful parts). What does it mean?',
      pick(bank.items, count).map(i => ({ prompt: `Break "${i.word}" into morphemes.`, answer: i.morphemes.join(' + '), word: i.word, morphemes: i.morphemes, meaning: i.meaning })));

  if (skill === 'connotation-denotation' && bank.items)
    return exResult('connotation', skill, grade, 'What is the connotation of this word? Is it positive, negative, or neutral?',
      pick(bank.items, count).map(i => ({ prompt: `"${i.word}" — What is its connotation? What is a more neutral word?`, answer: i.connotation, word: i.word, neutral: i.neutral, denotation: i.denotation })));

  if (skill === 'analogies' && bank.items)
    return exResult('analogy', skill, grade, 'Complete the analogy.',
      pick(bank.items, count).map(i => ({ prompt: i.analogy, answer: i.answer, type: i.type })));

  if (skill === 'etymology-basics' && bank.items)
    return exResult('etymology', skill, grade, 'What are the word parts and what language do they come from?',
      pick(bank.items, count).map(i => ({ prompt: `Where does "${i.word}" come from? What do its parts mean?`, answer: i.origin, word: i.word, meaning: i.meaning })));

  if (skill === 'academic-vocabulary' && bank.items)
    return exResult('definition', skill, grade, 'What does this academic word mean?',
      pick(bank.items, count).map(i => ({ prompt: `What does "${i.word}" mean?`, answer: i.definition, word: i.word, sentence: i.sentence })));

  if (skill === 'spelling-patterns-advanced' && bank.items)
    return exResult('spelling', skill, grade, 'Spell this word correctly. Pay attention to the pattern.',
      pick(bank.items, count).map(i => ({ prompt: `Spell: "${i.word}" (Rule: ${i.rule})`, answer: i.word, rule: i.rule, pattern: i.pattern })));

  // Grade 6
  if (skill === 'word-origins' && bank.items)
    return exResult('etymology', skill, grade, 'What is the origin of this word? What do its parts mean?',
      pick(bank.items, count).map(i => ({ prompt: `What is the origin of "${i.word}"? (Context: ${i.context})`, answer: i.origin, word: i.word, meaning: i.meaning })));

  if (skill === 'nuance-tone' && bank.items)
    return exResult('nuance', skill, grade, 'Arrange these words by tone/connotation. Which are positive? Negative?',
      pick(bank.items, count).map(i => ({ prompt: `These words all relate to "${i.context}": ${shuffle(i.set).join(', ')}. Sort by tone.`, answer: i.toneOrder, words: i.set, context: i.context })));

  if (skill === 'technical-vocabulary' && bank.domains) {
    const all = bank.domains.flatMap(d => d.words.map(w => ({ ...w, domain: d.domain })));
    return exResult('definition', skill, grade, 'What does this technical term mean?',
      pick(all, count).map(i => ({ prompt: `(${i.domain}) What does "${i.word}" mean?`, answer: i.definition, word: i.word, domain: i.domain })));
  }

  if (skill === 'word-analysis-strategy' && bank.items)
    return exResult('word-analysis', skill, grade, 'Break this word into parts and figure out its meaning step by step.',
      pick(bank.items, count).map(i => ({ prompt: `Analyze "${i.word}" step by step.`, answer: i.meaning, word: i.word, steps: i.steps })));

  if (skill === 'advanced-morphology' && bank.items)
    return exResult('morphology', skill, grade, 'Identify the prefix, root, and suffix. What do they mean?',
      pick(bank.items, count).map(i => ({ prompt: `Break apart "${i.word}": prefix, root, suffix?`, answer: `${i.prefix || '(none)'} + ${i.root} + ${i.suffix || '(none)'}`, word: i.word, prefix: i.prefix, root: i.root, suffix: i.suffix, rootMeaning: i.rootMeaning, wordMeaning: i.wordMeaning })));

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

// ── Answer Checking ──

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
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
    const grade = p.grade || 'kindergarten';
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
    const grade = p.grade || 'kindergarten';
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

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  getWordOfDay(grade) {
    const words = WORD_OF_DAY[grade];
    if (!words) return { error: `No word-of-day for ${grade}. Available: ${Object.keys(WORD_OF_DAY).join(', ')}` };
    return pick(words, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const wod = WORD_OF_DAY[grade] ? pick(WORD_OF_DAY[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, wordOfDay: wod,
      lessonPlan: {
        warmup: wod ? `Word of the Day: "${wod.word}" — ${wod.definition}` : 'Review a word from recent reading.',
        teach: `Introduce/reinforce: ${target.category} -> ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Use the new vocabulary in a sentence of your own.',
        review: 'Review words learned today and previous sessions.',
      },
    };
  }
}

module.exports = Vocabulary;

// CLI: node vocabulary.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const vc = new Vocabulary();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) vc.setGrade(id, grade);
        out({ action: 'start', profile: vc.getProfile(id), nextSkills: vc.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(vc.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'kindergarten';
        if (skill) { out(vc.generateExercise(grade, skill, 5)); }
        else { const n = vc.getNextSkills(id, 1).next; out(n.length ? vc.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current grade!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(vc.checkAnswer(type, expected, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(vc.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(vc.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(vc.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(vc.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? vc.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(vc.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(vc.setGrade(id, g)); break; }
      case 'word-of-day': { const [, g] = args; if (!g) throw new Error('Usage: word-of-day <grade>'); out(vc.getWordOfDay(g)); break; }
      default: out({ usage: 'node vocabulary.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','word-of-day'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
