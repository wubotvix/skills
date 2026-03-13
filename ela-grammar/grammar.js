// eClaw ELA Grammar & Conventions Interactive Tutor (K-6). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ela-grammar');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'capitalization': ['sentence-start', 'pronoun-i'],
    'punctuation': ['period', 'question-mark', 'exclamation-point'],
    'nouns': ['common-nouns'],
    'verbs': ['action-words'],
    'sentences': ['complete-sentences'],
  },
  'grade-1': {
    'nouns': ['common-proper', 'possessive-nouns'],
    'pronouns': ['personal-pronouns'],
    'verbs': ['past-present-future'],
    'adjectives': ['descriptive-adjectives'],
    'sentences': ['simple-compound'],
    'conjunctions': ['basic-conjunctions'],
    'capitalization': ['dates-names'],
    'punctuation': ['commas-series-dates'],
  },
  'grade-2': {
    'nouns': ['collective-nouns', 'irregular-plurals'],
    'pronouns': ['reflexive-pronouns'],
    'verbs': ['irregular-past-tense'],
    'adjectives': ['expand-with-adjectives'],
    'adverbs': ['basic-adverbs'],
    'sentences': ['expand-rearrange'],
    'punctuation': ['apostrophes-contractions', 'commas-letters'],
    'capitalization': ['holidays-places'],
  },
  'grade-3': {
    'nouns': ['abstract-nouns'],
    'verbs': ['regular-irregular', 'simple-tenses'],
    'adjectives': ['comparative-superlative'],
    'adverbs': ['adverb-vs-adjective'],
    'sentences': ['simple-compound-complex'],
    'conjunctions': ['fanboys'],
    'punctuation': ['commas-addresses', 'quotation-marks'],
    'possessives': ['singular-plural-possessives'],
  },
  'grade-4': {
    'pronouns': ['relative-pronouns'],
    'verbs': ['progressive-tenses', 'modal-verbs'],
    'adjectives': ['adjective-order'],
    'prepositions': ['prepositional-phrases'],
    'sentences': ['confused-words', 'fragments-run-ons'],
    'punctuation': ['comma-compound-sentence'],
    'capitalization': ['titles-of-works'],
  },
  'grade-5': {
    'verbs': ['perfect-tenses', 'consistent-tense'],
    'conjunctions': ['correlative-conjunctions'],
    'interjections': ['interjections'],
    'punctuation': ['comma-introductory', 'titles-formatting'],
    'sentences': ['combine-reduce'],
  },
  'grade-6': {
    'pronouns': ['pronoun-cases', 'intensive-pronouns', 'pronoun-antecedent'],
    'verbs': ['tense-shifts'],
    'sentences': ['vary-patterns'],
    'punctuation': ['nonrestrictive-elements'],
    'style': ['consistency-style-tone'],
  },
};

// ── Content Banks ──

const EXERCISE_BANKS = {
  'kindergarten': {
    'sentence-start': {
      items: [
        { wrong: 'the cat sat.', right: 'The cat sat.', rule: 'Start a sentence with a capital letter.' },
        { wrong: 'my dog is big.', right: 'My dog is big.', rule: 'Start a sentence with a capital letter.' },
        { wrong: 'we like to run.', right: 'We like to run.', rule: 'Start a sentence with a capital letter.' },
        { wrong: 'he has a hat.', right: 'He has a hat.', rule: 'Start a sentence with a capital letter.' },
        { wrong: 'it is hot.', right: 'It is hot.', rule: 'Start a sentence with a capital letter.' },
        { wrong: 'she can jump.', right: 'She can jump.', rule: 'Start a sentence with a capital letter.' },
        { wrong: 'a fish swam.', right: 'A fish swam.', rule: 'Start a sentence with a capital letter.' },
        { wrong: 'that is fun.', right: 'That is fun.', rule: 'Start a sentence with a capital letter.' },
      ],
    },
    'pronoun-i': {
      items: [
        { wrong: 'i like cats.', right: 'I like cats.', rule: 'The word "I" is always a capital letter.' },
        { wrong: 'Can i go?', right: 'Can I go?', rule: 'The word "I" is always a capital letter.' },
        { wrong: 'He and i ran.', right: 'He and I ran.', rule: 'The word "I" is always a capital letter.' },
        { wrong: 'i am happy.', right: 'I am happy.', rule: 'The word "I" is always a capital letter.' },
        { wrong: 'Mom and i baked.', right: 'Mom and I baked.', rule: 'The word "I" is always a capital letter.' },
        { wrong: 'i see a dog.', right: 'I see a dog.', rule: 'The word "I" is always a capital letter.' },
      ],
    },
    'period': {
      items: [
        { sentence: 'The cat sat on the mat', answer: '.', type: 'statement' },
        { sentence: 'I like to play', answer: '.', type: 'statement' },
        { sentence: 'The dog is big', answer: '.', type: 'statement' },
        { sentence: 'She has a red hat', answer: '.', type: 'statement' },
        { sentence: 'We went to the park', answer: '.', type: 'statement' },
        { sentence: 'He can run fast', answer: '.', type: 'statement' },
      ],
    },
    'question-mark': {
      items: [
        { sentence: 'Do you like cats', answer: '?', type: 'question' },
        { sentence: 'Where is the dog', answer: '?', type: 'question' },
        { sentence: 'Can I go now', answer: '?', type: 'question' },
        { sentence: 'What is your name', answer: '?', type: 'question' },
        { sentence: 'Is it time to eat', answer: '?', type: 'question' },
        { sentence: 'How old are you', answer: '?', type: 'question' },
      ],
    },
    'exclamation-point': {
      items: [
        { sentence: 'Wow, that is cool', answer: '!', type: 'exclamation' },
        { sentence: 'Look out', answer: '!', type: 'exclamation' },
        { sentence: 'I love it', answer: '!', type: 'exclamation' },
        { sentence: 'That was amazing', answer: '!', type: 'exclamation' },
        { sentence: 'Stop right there', answer: '!', type: 'exclamation' },
        { sentence: 'Happy birthday', answer: '!', type: 'exclamation' },
      ],
    },
    'common-nouns': {
      items: [
        { sentence: 'The ___ ran fast.', options: ['dog', 'quickly', 'run'], answer: 'dog', pos: 'noun' },
        { sentence: 'I see a big ___.', options: ['happy', 'tree', 'jump'], answer: 'tree', pos: 'noun' },
        { sentence: 'The ___ is red.', options: ['ball', 'fast', 'eat'], answer: 'ball', pos: 'noun' },
        { sentence: 'A ___ flew by.', options: ['soft', 'bird', 'fly'], answer: 'bird', pos: 'noun' },
        { sentence: 'My ___ is nice.', options: ['run', 'mom', 'big'], answer: 'mom', pos: 'noun' },
        { sentence: 'We went to the ___.', options: ['park', 'happy', 'walk'], answer: 'park', pos: 'noun' },
        { sentence: 'The ___ is on the table.', options: ['book', 'tall', 'read'], answer: 'book', pos: 'noun' },
        { sentence: 'I ate a ___.', options: ['fast', 'cookie', 'eat'], answer: 'cookie', pos: 'noun' },
      ],
    },
    'action-words': {
      items: [
        { sentence: 'The dog can ___.', options: ['run', 'big', 'hat'], answer: 'run', pos: 'verb' },
        { sentence: 'I ___ my food.', options: ['red', 'eat', 'plate'], answer: 'eat', pos: 'verb' },
        { sentence: 'She ___ to school.', options: ['walks', 'tall', 'book'], answer: 'walks', pos: 'verb' },
        { sentence: 'He ___ a picture.', options: ['blue', 'draws', 'paper'], answer: 'draws', pos: 'verb' },
        { sentence: 'They ___ in the pool.', options: ['swim', 'wet', 'water'], answer: 'swim', pos: 'verb' },
        { sentence: 'We ___ a song.', options: ['loud', 'sing', 'song'], answer: 'sing', pos: 'verb' },
        { sentence: 'The cat ___ on the bed.', options: ['soft', 'sleeps', 'pillow'], answer: 'sleeps', pos: 'verb' },
        { sentence: 'I ___ my teeth.', options: ['white', 'brush', 'mouth'], answer: 'brush', pos: 'verb' },
      ],
    },
    'complete-sentences': {
      items: [
        { text: 'The cat sat.', answer: 'yes', reason: 'Has a subject (cat) and action (sat).' },
        { text: 'Ran fast.', answer: 'no', reason: 'Missing a subject — WHO ran fast?' },
        { text: 'I like dogs.', answer: 'yes', reason: 'Has a subject (I) and action (like).' },
        { text: 'Big red ball.', answer: 'no', reason: 'Missing an action — what did the ball DO?' },
        { text: 'She is happy.', answer: 'yes', reason: 'Has a subject (she) and verb (is).' },
        { text: 'Under the tree.', answer: 'no', reason: 'Missing a subject and action.' },
        { text: 'We play games.', answer: 'yes', reason: 'Has a subject (we) and action (play).' },
        { text: 'Very quickly.', answer: 'no', reason: 'Missing a subject and action.' },
      ],
    },
  },
  'grade-1': {
    'common-proper': {
      items: [
        { word: 'dog', answer: 'common', explanation: 'A general animal, not a specific name.' },
        { word: 'Rex', answer: 'proper', explanation: 'A specific name — always capitalize!' },
        { word: 'city', answer: 'common', explanation: 'A general place.' },
        { word: 'Chicago', answer: 'proper', explanation: 'A specific city name — capitalize!' },
        { word: 'book', answer: 'common', explanation: 'A general thing.' },
        { word: 'Harry Potter', answer: 'proper', explanation: 'A specific name — capitalize!' },
        { word: 'school', answer: 'common', explanation: 'A general place.' },
        { word: 'Lincoln Elementary', answer: 'proper', explanation: 'A specific school name — capitalize!' },
        { word: 'teacher', answer: 'common', explanation: 'A general person.' },
        { word: 'Mrs. Smith', answer: 'proper', explanation: 'A specific person\'s name — capitalize!' },
      ],
    },
    'possessive-nouns': {
      items: [
        { prompt: 'The bone belongs to the dog.', answer: "the dog's bone", rule: "Add 's to show ownership." },
        { prompt: 'The hat belongs to Mom.', answer: "Mom's hat", rule: "Add 's to a name." },
        { prompt: 'The toy belongs to the cat.', answer: "the cat's toy", rule: "Add 's to show ownership." },
        { prompt: 'The book belongs to Sam.', answer: "Sam's book", rule: "Add 's to a name." },
        { prompt: 'The nest belongs to the bird.', answer: "the bird's nest", rule: "Add 's to show ownership." },
      ],
    },
    'personal-pronouns': {
      items: [
        { sentence: '___ is my friend.', options: ['He', 'Him', 'His'], answer: 'He', rule: 'He is a subject pronoun.' },
        { sentence: 'I gave it to ___.', options: ['she', 'her', 'hers'], answer: 'her', rule: 'Her is an object pronoun.' },
        { sentence: '___ like pizza.', options: ['They', 'Them', 'Their'], answer: 'They', rule: 'They is a subject pronoun.' },
        { sentence: 'Give the ball to ___.', options: ['I', 'me', 'my'], answer: 'me', rule: 'Me is an object pronoun.' },
        { sentence: '___ went to the park.', options: ['She', 'Her', 'Hers'], answer: 'She', rule: 'She is a subject pronoun.' },
        { sentence: 'Mom helped ___.', options: ['we', 'us', 'our'], answer: 'us', rule: 'Us is an object pronoun.' },
      ],
    },
    'past-present-future': {
      items: [
        { word: 'walk', past: 'walked', present: 'walk/walks', future: 'will walk' },
        { word: 'jump', past: 'jumped', present: 'jump/jumps', future: 'will jump' },
        { word: 'play', past: 'played', present: 'play/plays', future: 'will play' },
        { word: 'talk', past: 'talked', present: 'talk/talks', future: 'will talk' },
        { word: 'help', past: 'helped', present: 'help/helps', future: 'will help' },
        { word: 'look', past: 'looked', present: 'look/looks', future: 'will look' },
        { word: 'cook', past: 'cooked', present: 'cook/cooks', future: 'will cook' },
        { word: 'clean', past: 'cleaned', present: 'clean/cleans', future: 'will clean' },
      ],
    },
    'descriptive-adjectives': {
      items: [
        { sentence: 'The ___ dog barked.', options: ['big', 'run', 'dog'], answer: 'big' },
        { sentence: 'I see a ___ flower.', options: ['pretty', 'walk', 'she'], answer: 'pretty' },
        { sentence: 'She has a ___ dress.', options: ['eat', 'red', 'fast'], answer: 'red' },
        { sentence: 'The ___ boy smiled.', options: ['happy', 'jump', 'ball'], answer: 'happy' },
        { sentence: 'We found a ___ rock.', options: ['tiny', 'swim', 'river'], answer: 'tiny' },
        { sentence: 'He ate a ___ apple.', options: ['green', 'run', 'plate'], answer: 'green' },
      ],
    },
    'simple-compound': {
      items: [
        { type: 'combine', s1: 'I like cats.', s2: 'I like dogs.', answer: 'I like cats and dogs.', conjunction: 'and' },
        { type: 'combine', s1: 'She is tall.', s2: 'He is short.', answer: 'She is tall, but he is short.', conjunction: 'but' },
        { type: 'combine', s1: 'We can play inside.', s2: 'We can play outside.', answer: 'We can play inside or outside.', conjunction: 'or' },
        { type: 'combine', s1: 'It rained.', s2: 'We stayed inside.', answer: 'It rained, so we stayed inside.', conjunction: 'so' },
        { type: 'combine', s1: 'He was tired.', s2: 'He went to bed.', answer: 'He was tired, so he went to bed.', conjunction: 'so' },
      ],
    },
    'basic-conjunctions': {
      items: [
        { sentence: 'I like cats ___ dogs.', options: ['and', 'but', 'or'], answer: 'and', rule: '"And" adds things together.' },
        { sentence: 'She is small ___ strong.', options: ['and', 'but', 'or'], answer: 'but', rule: '"But" shows contrast.' },
        { sentence: 'Do you want milk ___ juice?', options: ['and', 'but', 'or'], answer: 'or', rule: '"Or" gives a choice.' },
        { sentence: 'I was cold, ___ I put on a coat.', options: ['and', 'so', 'but'], answer: 'so', rule: '"So" shows a result.' },
        { sentence: 'He ran fast ___ he was late.', options: ['or', 'because', 'but'], answer: 'because', rule: '"Because" gives a reason.' },
        { sentence: 'We played ___ ate lunch.', options: ['and', 'but', 'or'], answer: 'and', rule: '"And" adds actions together.' },
      ],
    },
    'dates-names': {
      items: [
        { wrong: 'My birthday is january 5.', right: 'My birthday is January 5.', rule: 'Capitalize months.' },
        { wrong: 'I met sarah at school.', right: 'I met Sarah at school.', rule: 'Capitalize people\'s names.' },
        { wrong: 'We play on monday.', right: 'We play on Monday.', rule: 'Capitalize days of the week.' },
        { wrong: 'My friend ben is nice.', right: 'My friend Ben is nice.', rule: 'Capitalize people\'s names.' },
        { wrong: 'It snowed in december.', right: 'It snowed in December.', rule: 'Capitalize months.' },
        { wrong: 'I see dr. jones today.', right: 'I see Dr. Jones today.', rule: 'Capitalize titles and names.' },
      ],
    },
    'commas-series-dates': {
      items: [
        { wrong: 'I like red blue and green.', right: 'I like red, blue, and green.', rule: 'Use commas to separate items in a list.' },
        { wrong: 'We ate apples bananas and grapes.', right: 'We ate apples, bananas, and grapes.', rule: 'Use commas to separate items in a list.' },
        { wrong: 'My birthday is June 5 2020.', right: 'My birthday is June 5, 2020.', rule: 'Use a comma between the day and the year.' },
        { wrong: 'She has a cat a dog and a fish.', right: 'She has a cat, a dog, and a fish.', rule: 'Use commas to separate items in a list.' },
        { wrong: 'Today is March 10 2025.', right: 'Today is March 10, 2025.', rule: 'Use a comma between the day and the year.' },
      ],
    },
  },
  'grade-2': {
    'collective-nouns': {
      items: [
        { prompt: 'A ___ of cows', answer: 'herd', options: ['herd', 'flock', 'pack'] },
        { prompt: 'A ___ of birds', answer: 'flock', options: ['flock', 'herd', 'team'] },
        { prompt: 'A ___ of wolves', answer: 'pack', options: ['pack', 'flock', 'herd'] },
        { prompt: 'A ___ of fish', answer: 'school', options: ['school', 'pack', 'bunch'] },
        { prompt: 'A ___ of players', answer: 'team', options: ['team', 'flock', 'herd'] },
        { prompt: 'A ___ of bees', answer: 'swarm', options: ['swarm', 'pack', 'flock'] },
        { prompt: 'A ___ of grapes', answer: 'bunch', options: ['bunch', 'team', 'herd'] },
        { prompt: 'A ___ of lions', answer: 'pride', options: ['pride', 'pack', 'flock'] },
      ],
    },
    'irregular-plurals': {
      items: [
        { singular: 'child', plural: 'children' }, { singular: 'mouse', plural: 'mice' },
        { singular: 'goose', plural: 'geese' }, { singular: 'tooth', plural: 'teeth' },
        { singular: 'foot', plural: 'feet' }, { singular: 'man', plural: 'men' },
        { singular: 'woman', plural: 'women' }, { singular: 'person', plural: 'people' },
        { singular: 'leaf', plural: 'leaves' }, { singular: 'wolf', plural: 'wolves' },
        { singular: 'knife', plural: 'knives' }, { singular: 'life', plural: 'lives' },
      ],
    },
    'reflexive-pronouns': {
      items: [
        { sentence: 'I made it ___.', answer: 'myself' },
        { sentence: 'She dressed ___.', answer: 'herself' },
        { sentence: 'He hurt ___.', answer: 'himself' },
        { sentence: 'We did it ___.', answer: 'ourselves' },
        { sentence: 'They helped ___.', answer: 'themselves' },
        { sentence: 'The cat cleaned ___.', answer: 'itself' },
      ],
    },
    'irregular-past-tense': {
      items: [
        { present: 'sit', past: 'sat', wrong: 'sitted' }, { present: 'run', past: 'ran', wrong: 'runned' },
        { present: 'see', past: 'saw', wrong: 'seed' }, { present: 'go', past: 'went', wrong: 'goed' },
        { present: 'come', past: 'came', wrong: 'comed' }, { present: 'eat', past: 'ate', wrong: 'eated' },
        { present: 'tell', past: 'told', wrong: 'telled' }, { present: 'hide', past: 'hid', wrong: 'hided' },
        { present: 'give', past: 'gave', wrong: 'gived' }, { present: 'take', past: 'took', wrong: 'taked' },
        { present: 'write', past: 'wrote', wrong: 'writed' }, { present: 'think', past: 'thought', wrong: 'thinked' },
      ],
    },
    'expand-with-adjectives': {
      items: [
        { base: 'The dog ran.', expanded: 'The big brown dog ran.', added: 'big, brown' },
        { base: 'A cat slept.', expanded: 'A fluffy orange cat slept.', added: 'fluffy, orange' },
        { base: 'The ball bounced.', expanded: 'The shiny red ball bounced.', added: 'shiny, red' },
        { base: 'A bird sang.', expanded: 'A tiny blue bird sang.', added: 'tiny, blue' },
        { base: 'The girl smiled.', expanded: 'The happy little girl smiled.', added: 'happy, little' },
      ],
    },
    'basic-adverbs': {
      items: [
        { sentence: 'The turtle walked ___.', options: ['slowly', 'slow', 'turtle'], answer: 'slowly', rule: 'Adverbs tell HOW something happens.' },
        { sentence: 'She sang ___.', options: ['beautiful', 'beautifully', 'beauty'], answer: 'beautifully', rule: 'Many adverbs end in -ly.' },
        { sentence: 'He ran ___.', options: ['quick', 'quickly', 'quicker'], answer: 'quickly', rule: 'Adverbs describe verbs.' },
        { sentence: 'They worked ___.', options: ['careful', 'carefully', 'care'], answer: 'carefully', rule: 'Adverbs tell how an action is done.' },
        { sentence: 'The baby cried ___.', options: ['loud', 'loudly', 'louder'], answer: 'loudly', rule: 'Adverbs end in -ly to describe how.' },
      ],
    },
    'expand-rearrange': {
      items: [
        { short: ['The boy ate.', 'He was hungry.'], combined: 'The hungry boy ate.', method: 'Move adjective into the sentence.' },
        { short: ['The girl ran.', 'She ran to the park.'], combined: 'The girl ran to the park.', method: 'Add the detail.' },
        { short: ['It was cold.', 'We wore coats.'], combined: 'Because it was cold, we wore coats.', method: 'Use "because" to connect.' },
        { short: ['The dog is brown.', 'The dog is friendly.'], combined: 'The friendly brown dog plays.', method: 'Combine adjectives.' },
      ],
    },
    'apostrophes-contractions': {
      items: [
        { full: 'do not', contraction: "don't" }, { full: 'cannot', contraction: "can't" },
        { full: 'I am', contraction: "I'm" }, { full: 'it is', contraction: "it's" },
        { full: 'we are', contraction: "we're" }, { full: 'they are', contraction: "they're" },
        { full: 'did not', contraction: "didn't" }, { full: 'is not', contraction: "isn't" },
        { full: 'I will', contraction: "I'll" }, { full: 'he is', contraction: "he's" },
      ],
    },
    'commas-letters': {
      items: [
        { wrong: 'Dear Mom', right: 'Dear Mom,', rule: 'Use a comma after the greeting in a letter.' },
        { wrong: 'Love Sam', right: 'Love, Sam', rule: 'Use a comma before the name in a closing.' },
        { wrong: 'Dear Teacher', right: 'Dear Teacher,', rule: 'Use a comma after the greeting.' },
        { wrong: 'Your friend Alex', right: 'Your friend, Alex', rule: 'Use a comma before the name in a closing.' },
        { wrong: 'Dear Grandma', right: 'Dear Grandma,', rule: 'Use a comma after the greeting in a letter.' },
      ],
    },
    'holidays-places': {
      items: [
        { wrong: 'We celebrate thanksgiving.', right: 'We celebrate Thanksgiving.', rule: 'Capitalize holidays.' },
        { wrong: 'I live in new york.', right: 'I live in New York.', rule: 'Capitalize cities and states.' },
        { wrong: 'We went to disney world.', right: 'We went to Disney World.', rule: 'Capitalize specific place names.' },
        { wrong: 'happy halloween!', right: 'Happy Halloween!', rule: 'Capitalize holidays.' },
        { wrong: 'She flew to california.', right: 'She flew to California.', rule: 'Capitalize state names.' },
        { wrong: 'We love the fourth of july.', right: 'We love the Fourth of July.', rule: 'Capitalize holidays.' },
      ],
    },
  },
  'grade-3': {
    'abstract-nouns': {
      items: [
        { word: 'courage', type: 'abstract', explanation: 'You can\'t touch courage — it\'s an idea or feeling.' },
        { word: 'table', type: 'concrete', explanation: 'You can touch a table — it\'s a real thing.' },
        { word: 'freedom', type: 'abstract', explanation: 'Freedom is an idea, not something you can hold.' },
        { word: 'happiness', type: 'abstract', explanation: 'Happiness is a feeling.' },
        { word: 'apple', type: 'concrete', explanation: 'You can see and touch an apple.' },
        { word: 'love', type: 'abstract', explanation: 'Love is a feeling you can\'t see or touch.' },
        { word: 'friendship', type: 'abstract', explanation: 'Friendship is an idea about relationships.' },
        { word: 'bicycle', type: 'concrete', explanation: 'You can see and ride a bicycle.' },
        { word: 'honesty', type: 'abstract', explanation: 'Honesty is a quality or value.' },
        { word: 'music', type: 'concrete', explanation: 'You can hear music with your ears.' },
      ],
    },
    'regular-irregular': {
      items: [
        { verb: 'walk', past: 'walked', type: 'regular' }, { verb: 'play', past: 'played', type: 'regular' },
        { verb: 'go', past: 'went', type: 'irregular' }, { verb: 'run', past: 'ran', type: 'irregular' },
        { verb: 'help', past: 'helped', type: 'regular' }, { verb: 'see', past: 'saw', type: 'irregular' },
        { verb: 'eat', past: 'ate', type: 'irregular' }, { verb: 'jump', past: 'jumped', type: 'regular' },
        { verb: 'sing', past: 'sang', type: 'irregular' }, { verb: 'talk', past: 'talked', type: 'regular' },
        { verb: 'swim', past: 'swam', type: 'irregular' }, { verb: 'think', past: 'thought', type: 'irregular' },
      ],
    },
    'simple-tenses': {
      items: [
        { sentence: 'Yesterday, she ___ to school.', answer: 'walked', tense: 'past', verb: 'walk' },
        { sentence: 'Right now, he ___ his homework.', answer: 'does', tense: 'present', verb: 'do' },
        { sentence: 'Tomorrow, they ___ the game.', answer: 'will play', tense: 'future', verb: 'play' },
        { sentence: 'Last week, we ___ a movie.', answer: 'watched', tense: 'past', verb: 'watch' },
        { sentence: 'Every day, she ___ breakfast.', answer: 'eats', tense: 'present', verb: 'eat' },
        { sentence: 'Next year, I ___ to camp.', answer: 'will go', tense: 'future', verb: 'go' },
      ],
    },
    'comparative-superlative': {
      items: [
        { base: 'big', comparative: 'bigger', superlative: 'biggest' },
        { base: 'tall', comparative: 'taller', superlative: 'tallest' },
        { base: 'happy', comparative: 'happier', superlative: 'happiest' },
        { base: 'fast', comparative: 'faster', superlative: 'fastest' },
        { base: 'good', comparative: 'better', superlative: 'best' },
        { base: 'bad', comparative: 'worse', superlative: 'worst' },
        { base: 'small', comparative: 'smaller', superlative: 'smallest' },
        { base: 'funny', comparative: 'funnier', superlative: 'funniest' },
      ],
    },
    'adverb-vs-adjective': {
      items: [
        { sentence: 'She is a ___ runner.', answer: 'fast', pos: 'adjective', rule: 'Adjective describes the noun "runner".' },
        { sentence: 'She runs ___.', answer: 'fast', pos: 'adverb', rule: 'Adverb describes the verb "runs".' },
        { sentence: 'He gave a ___ answer.', answer: 'quick', pos: 'adjective', rule: 'Adjective describes "answer".' },
        { sentence: 'He answered ___.', answer: 'quickly', pos: 'adverb', rule: 'Adverb describes "answered".' },
        { sentence: 'The ___ cat purred.', answer: 'quiet', pos: 'adjective', rule: 'Adjective describes "cat".' },
        { sentence: 'The cat purred ___.', answer: 'quietly', pos: 'adverb', rule: 'Adverb describes "purred".' },
      ],
    },
    'simple-compound-complex': {
      items: [
        { sentence: 'The dog ran.', answer: 'simple', explanation: 'One subject + one verb = simple.' },
        { sentence: 'The dog ran, and the cat hid.', answer: 'compound', explanation: 'Two independent clauses joined by "and".' },
        { sentence: 'When the dog ran, the cat hid.', answer: 'complex', explanation: 'Independent clause + dependent clause (starts with "when").' },
        { sentence: 'I like pizza.', answer: 'simple', explanation: 'One subject + one verb = simple.' },
        { sentence: 'I like pizza, but she likes tacos.', answer: 'compound', explanation: 'Two independent clauses joined by "but".' },
        { sentence: 'Because it rained, we stayed inside.', answer: 'complex', explanation: 'Dependent clause ("because...") + independent clause.' },
        { sentence: 'She smiled.', answer: 'simple', explanation: 'One subject + one verb = simple.' },
        { sentence: 'If you study hard, you will do well.', answer: 'complex', explanation: 'Dependent clause ("if...") + independent clause.' },
      ],
    },
    'fanboys': {
      items: [
        { sentence: 'I was tired, ___ I went to bed.', answer: 'so', hint: 'Shows a result.' },
        { sentence: 'She studied, ___ she still failed.', answer: 'yet', hint: 'Shows surprise or contrast.' },
        { sentence: 'He didn\'t eat breakfast, ___ did he eat lunch.', answer: 'nor', hint: 'Adds a negative.' },
        { sentence: 'We can go to the park, ___ we can stay home.', answer: 'or', hint: 'Gives a choice.' },
        { sentence: 'I like reading, ___ I also like drawing.', answer: 'and', hint: 'Adds information.' },
        { sentence: 'She fell down, ___ she got back up.', answer: 'but', hint: 'Shows contrast.' },
      ],
    },
    'commas-addresses': {
      items: [
        { wrong: 'Chicago Illinois', right: 'Chicago, Illinois', rule: 'Use a comma between city and state.' },
        { wrong: 'Austin Texas', right: 'Austin, Texas', rule: 'Use a comma between city and state.' },
        { wrong: 'New York New York', right: 'New York, New York', rule: 'Use a comma between city and state.' },
        { wrong: 'Miami Florida', right: 'Miami, Florida', rule: 'Use a comma between city and state.' },
        { wrong: 'Portland Oregon', right: 'Portland, Oregon', rule: 'Use a comma between city and state.' },
      ],
    },
    'quotation-marks': {
      items: [
        { wrong: 'She said, I love this book.', right: 'She said, "I love this book."', rule: 'Put quotation marks around the exact words someone says.' },
        { wrong: 'Let\'s go! he shouted.', right: '"Let\'s go!" he shouted.', rule: 'Put quotation marks around dialogue.' },
        { wrong: 'Mom asked, Are you ready?', right: 'Mom asked, "Are you ready?"', rule: 'Put quotation marks around the exact words.' },
        { wrong: 'I\'m hungry, said the boy.', right: '"I\'m hungry," said the boy.', rule: 'Put quotation marks around dialogue.' },
        { wrong: 'Look at that! she cried.', right: '"Look at that!" she cried.', rule: 'Quotation marks go around the speaker\'s exact words.' },
      ],
    },
    'singular-plural-possessives': {
      items: [
        { prompt: 'the toy of the cat', answer: "the cat's toy", rule: "Singular: add 's" },
        { prompt: 'the room of the kids', answer: "the kids' room", rule: "Plural ending in s: add only '" },
        { prompt: 'the bikes of the children', answer: "the children's bikes", rule: "Plural NOT ending in s: add 's" },
        { prompt: 'the hat of the boy', answer: "the boy's hat", rule: "Singular: add 's" },
        { prompt: 'the toys of the dogs', answer: "the dogs' toys", rule: "Plural ending in s: add only '" },
        { prompt: 'the shoes of the women', answer: "the women's shoes", rule: "Plural NOT ending in s: add 's" },
      ],
    },
  },
  'grade-4': {
    'relative-pronouns': {
      items: [
        { sentence: 'The girl ___ won the race is my sister.', answer: 'who', rule: '"Who" refers to people.' },
        { sentence: 'The book ___ I read was great.', answer: 'that', rule: '"That" refers to things.' },
        { sentence: 'The boy ___ dog ran away was sad.', answer: 'whose', rule: '"Whose" shows possession.' },
        { sentence: 'The cake, ___ was chocolate, was delicious.', answer: 'which', rule: '"Which" adds extra info about things.' },
        { sentence: 'The teacher ___ helped me was kind.', answer: 'who', rule: '"Who" refers to people.' },
        { sentence: 'The house ___ we visited was old.', answer: 'that', rule: '"That" can refer to things and places.' },
      ],
    },
    'progressive-tenses': {
      items: [
        { sentence: 'She ___ reading right now.', answer: 'is reading', tense: 'present progressive' },
        { sentence: 'They ___ playing when it rained.', answer: 'were playing', tense: 'past progressive' },
        { sentence: 'He ___ studying tomorrow at noon.', answer: 'will be studying', tense: 'future progressive' },
        { sentence: 'I ___ eating dinner at 6 PM yesterday.', answer: 'was eating', tense: 'past progressive' },
        { sentence: 'We ___ watching a movie now.', answer: 'are watching', tense: 'present progressive' },
        { sentence: 'She ___ traveling next week.', answer: 'will be traveling', tense: 'future progressive' },
      ],
    },
    'modal-verbs': {
      items: [
        { sentence: 'You ___ brush your teeth every night.', answer: 'should', meaning: 'advice' },
        { sentence: '___ I go to the bathroom?', answer: 'May', meaning: 'permission' },
        { sentence: 'You ___ not run in the halls.', answer: 'must', meaning: 'strong rule' },
        { sentence: 'She ___ swim very well.', answer: 'can', meaning: 'ability' },
        { sentence: 'It ___ rain tomorrow.', answer: 'might', meaning: 'possibility' },
        { sentence: 'We ___ finish our homework first.', answer: 'must', meaning: 'requirement' },
      ],
    },
    'adjective-order': {
      items: [
        { wrong: 'the red big ball', right: 'the big red ball', rule: 'Size comes before color.' },
        { wrong: 'a wooden old table', right: 'an old wooden table', rule: 'Age comes before material.' },
        { wrong: 'a French beautiful painting', right: 'a beautiful French painting', rule: 'Opinion comes before origin.' },
        { wrong: 'three blue small fish', right: 'three small blue fish', rule: 'Number → size → color.' },
        { wrong: 'a square large box', right: 'a large square box', rule: 'Size comes before shape.' },
      ],
    },
    'prepositional-phrases': {
      items: [
        { sentence: 'The cat sat ___ the table.', options: ['under', 'quietly', 'big'], answer: 'under' },
        { sentence: 'We walked ___ the park.', options: ['through', 'happy', 'tree'], answer: 'through' },
        { sentence: 'The book is ___ the shelf.', options: ['on', 'read', 'blue'], answer: 'on' },
        { sentence: 'She hid ___ the door.', options: ['behind', 'open', 'brown'], answer: 'behind' },
        { sentence: 'The bird flew ___ the clouds.', options: ['above', 'white', 'fast'], answer: 'above' },
        { sentence: 'They played ___ school.', options: ['after', 'big', 'run'], answer: 'after' },
      ],
    },
    'confused-words': {
      items: [
        { sentence: '___ going to the store.', options: ["They're", "Their", "There"], answer: "They're", rule: "They're = They are" },
        { sentence: 'I went ___ the park.', options: ["to", "too", "two"], answer: "to", rule: "to = direction" },
        { sentence: '___ are ___ many people here.', options: ["There, too", "Their, two", "They're, to"], answer: "There, too", rule: "There = place; too = also/excessive" },
        { sentence: 'The ___ of them lost ___ way.', options: ["two, their", "too, there", "to, they're"], answer: "two, their", rule: "two = number 2; their = belonging to them" },
        { sentence: "It's ___ hot ___ play outside.", options: ["too, to", "to, too", "two, to"], answer: "too, to", rule: "too = excessively; to = infinitive" },
      ],
    },
    'fragments-run-ons': {
      items: [
        { text: 'Because it was raining.', type: 'fragment', fix: 'I stayed inside because it was raining.', rule: 'Add an independent clause.' },
        { text: 'I went to the park I played on the swings.', type: 'run-on', fix: 'I went to the park, and I played on the swings.', rule: 'Add a comma and conjunction, or use a period.' },
        { text: 'Running down the street.', type: 'fragment', fix: 'The boy was running down the street.', rule: 'Add a subject and helping verb.' },
        { text: 'She likes cats he likes dogs.', type: 'run-on', fix: 'She likes cats, but he likes dogs.', rule: 'Separate with punctuation and conjunction.' },
        { text: 'The tall building on the corner.', type: 'fragment', fix: 'The tall building on the corner is a library.', rule: 'Add a verb — what about the building?' },
        { text: 'I was hungry I ate lunch I felt better.', type: 'run-on', fix: 'I was hungry, so I ate lunch. Then I felt better.', rule: 'Break into separate sentences or use conjunctions.' },
      ],
    },
    'comma-compound-sentence': {
      items: [
        { wrong: 'I like pizza and she likes tacos.', right: 'I like pizza, and she likes tacos.', rule: 'Comma before the conjunction in a compound sentence.' },
        { wrong: 'He ran fast but he lost the race.', right: 'He ran fast, but he lost the race.', rule: 'Comma before "but" joining two complete thoughts.' },
        { wrong: 'We can stay or we can leave.', right: 'We can stay, or we can leave.', rule: 'Comma before "or" joining two complete thoughts.' },
        { wrong: 'She studied hard so she passed.', right: 'She studied hard, so she passed.', rule: 'Comma before "so" in a compound sentence.' },
      ],
    },
    'titles-of-works': {
      items: [
        { wrong: 'I read charlotte\'s web.', right: 'I read Charlotte\'s Web.', rule: 'Capitalize important words in book titles.' },
        { wrong: 'We watched the lion king.', right: 'We watched The Lion King.', rule: 'Capitalize important words in movie titles.' },
        { wrong: 'She sang happy birthday.', right: 'She sang "Happy Birthday."', rule: 'Capitalize and quote song titles.' },
        { wrong: 'We read the poem the road not taken.', right: 'We read the poem "The Road Not Taken."', rule: 'Capitalize and quote poem titles.' },
      ],
    },
  },
  'grade-5': {
    'perfect-tenses': {
      items: [
        { sentence: 'She ___ already eaten.', answer: 'has', tense: 'present perfect', full: 'has eaten' },
        { sentence: 'They ___ finished before I arrived.', answer: 'had', tense: 'past perfect', full: 'had finished' },
        { sentence: 'By tomorrow, I ___ completed my project.', answer: 'will have', tense: 'future perfect', full: 'will have completed' },
        { sentence: 'He ___ never seen snow.', answer: 'has', tense: 'present perfect', full: 'has seen' },
        { sentence: 'We ___ left before the storm hit.', answer: 'had', tense: 'past perfect', full: 'had left' },
        { sentence: 'By Friday, she ___ read three books.', answer: 'will have', tense: 'future perfect', full: 'will have read' },
      ],
    },
    'consistent-tense': {
      items: [
        { wrong: 'She walks to school and talked to her friend.', right: 'She walked to school and talked to her friend.', error: 'Mixed present and past tense.' },
        { wrong: 'He opened the door and sees a cat.', right: 'He opened the door and saw a cat.', error: 'Mixed past and present tense.' },
        { wrong: 'They will go to the park and played games.', right: 'They will go to the park and play games.', error: 'Mixed future and past tense.' },
        { wrong: 'I eat breakfast and went to school.', right: 'I ate breakfast and went to school.', error: 'Mixed present and past tense.' },
        { wrong: 'She was reading a book and falls asleep.', right: 'She was reading a book and fell asleep.', error: 'Mixed past progressive and present tense.' },
      ],
    },
    'correlative-conjunctions': {
      items: [
        { sentence: '___ you study hard ___ you will fail.', answer: 'Either...or', pair: 'either/or' },
        { sentence: '___ did she sing ___ did she dance.', answer: 'Neither...nor', pair: 'neither/nor' },
        { sentence: 'He is ___ smart ___ funny.', answer: 'both...and', pair: 'both/and' },
        { sentence: '___ is it cold, ___ it is raining.', answer: 'Not only...but also', pair: 'not only/but also' },
        { sentence: '___ you come ___ you don\'t, I\'ll be there.', answer: 'Whether...or', pair: 'whether/or' },
      ],
    },
    'interjections': {
      items: [
        { sentence: '___! That was close!', options: ['Wow', 'Then', 'And'], answer: 'Wow', emotion: 'surprise' },
        { sentence: '___! That hurts!', options: ['Ouch', 'Well', 'So'], answer: 'Ouch', emotion: 'pain' },
        { sentence: '___! We won the game!', options: ['Hooray', 'Because', 'But'], answer: 'Hooray', emotion: 'excitement' },
        { sentence: '___! I forgot my homework.', options: ['Oh no', 'Yes', 'And'], answer: 'Oh no', emotion: 'worry' },
        { sentence: '___! Look at that rainbow!', options: ['Wow', 'But', 'Or'], answer: 'Wow', emotion: 'amazement' },
      ],
    },
    'comma-introductory': {
      items: [
        { wrong: 'After dinner we watched a movie.', right: 'After dinner, we watched a movie.', rule: 'Comma after introductory phrase.' },
        { wrong: 'Before the game started the coach gave a speech.', right: 'Before the game started, the coach gave a speech.', rule: 'Comma after introductory clause.' },
        { wrong: 'However I think we should try again.', right: 'However, I think we should try again.', rule: 'Comma after introductory word.' },
        { wrong: 'In the morning we eat breakfast.', right: 'In the morning, we eat breakfast.', rule: 'Comma after introductory phrase.' },
        { wrong: 'Finally the bus arrived.', right: 'Finally, the bus arrived.', rule: 'Comma after introductory word.' },
      ],
    },
    'titles-formatting': {
      items: [
        { title: 'Harry Potter (book)', format: 'italics', rule: 'Italicize titles of long works (books, movies, plays).' },
        { title: 'Twinkle Twinkle Little Star (song)', format: 'quotes', rule: 'Use quotation marks for short works (songs, poems, articles).' },
        { title: 'The Lion King (movie)', format: 'italics', rule: 'Italicize movie titles.' },
        { title: 'The Road Not Taken (poem)', format: 'quotes', rule: 'Use quotation marks for poem titles.' },
        { title: 'Time Magazine (magazine)', format: 'italics', rule: 'Italicize magazine titles.' },
      ],
    },
    'combine-reduce': {
      items: [
        { short: ['The dog was big.', 'The dog was brown.', 'The dog barked loudly.'], combined: 'The big brown dog barked loudly.', method: 'Combine using adjectives.' },
        { short: ['The boy ran fast.', 'He won the race.'], combined: 'The boy ran fast and won the race.', method: 'Join with "and".' },
        { short: ['She is my teacher.', 'She is kind.', 'She helps everyone.'], combined: 'My kind teacher helps everyone.', method: 'Reduce and combine.' },
        { short: ['It was a rainy day.', 'We stayed inside.', 'We played board games.'], combined: 'On the rainy day, we stayed inside and played board games.', method: 'Combine with introductory phrase.' },
      ],
    },
  },
  'grade-6': {
    'pronoun-cases': {
      items: [
        { sentence: '___ went to the store.', options: ['She', 'Her'], answer: 'She', case: 'subjective' },
        { sentence: 'Give the book to ___.', options: ['he', 'him'], answer: 'him', case: 'objective' },
        { sentence: 'That backpack is ___.', options: ['my', 'mine'], answer: 'mine', case: 'possessive' },
        { sentence: '___ and I played soccer.', options: ['He', 'Him'], answer: 'He', case: 'subjective' },
        { sentence: 'Between you and ___, it\'s a secret.', options: ['I', 'me'], answer: 'me', case: 'objective' },
        { sentence: 'The choice is ___.', options: ['your', 'yours'], answer: 'yours', case: 'possessive' },
      ],
    },
    'intensive-pronouns': {
      items: [
        { sentence: 'The president ___ signed the bill.', answer: 'himself', rule: 'Emphasizes the subject.' },
        { sentence: 'I ___ will handle this.', answer: 'myself', rule: 'Emphasizes the subject.' },
        { sentence: 'The students ___ organized the event.', answer: 'themselves', rule: 'Emphasizes the subject.' },
        { sentence: 'She ___ made the decision.', answer: 'herself', rule: 'Emphasizes the subject.' },
        { sentence: 'We ___ painted the mural.', answer: 'ourselves', rule: 'Emphasizes the subject.' },
      ],
    },
    'pronoun-antecedent': {
      items: [
        { wrong: 'Each student should bring their pencil.', right: 'Each student should bring his or her pencil.', rule: '"Each" is singular, so the pronoun should be singular.' },
        { wrong: 'The team won his game.', right: 'The team won its game.', rule: '"Team" is a thing, so use "its".' },
        { wrong: 'Everyone raised their hand.', right: 'Everyone raised his or her hand.', rule: '"Everyone" is singular.' },
        { wrong: 'Neither boy forgot their homework.', right: 'Neither boy forgot his homework.', rule: '"Neither" is singular.' },
        { wrong: 'The girls lost his ball.', right: 'The girls lost their ball.', rule: '"Girls" is plural, so use "their".' },
      ],
    },
    'tense-shifts': {
      items: [
        { wrong: 'She was reading when the phone rings.', right: 'She was reading when the phone rang.', error: 'Shift from past to present.' },
        { wrong: 'He walked into the room and sees the mess.', right: 'He walked into the room and saw the mess.', error: 'Shift from past to present.' },
        { wrong: 'They are playing outside when it started raining.', right: 'They were playing outside when it started raining.', error: 'Shift from present to past.' },
        { wrong: 'I will go to the store and bought milk.', right: 'I will go to the store and buy milk.', error: 'Shift from future to past.' },
      ],
    },
    'vary-patterns': {
      items: [
        { boring: 'I went to the store. I bought apples. I went home. I made pie.', improved: 'After going to the store to buy apples, I went home and made a delicious pie.', method: 'Combine choppy sentences and vary openings.' },
        { boring: 'The dog was big. The dog was loud. The dog scared me.', improved: 'The big, loud dog scared me.', method: 'Combine with adjectives to reduce repetition.' },
        { boring: 'She is smart. She studies hard. She gets good grades.', improved: 'Because she studies hard, this smart student gets good grades.', method: 'Vary sentence beginnings and combine.' },
      ],
    },
    'nonrestrictive-elements': {
      items: [
        { wrong: 'My sister who lives in Boston is a doctor.', right: 'My sister, who lives in Boston, is a doctor.', rule: 'Use commas around extra (nonrestrictive) information.' },
        { wrong: 'The Eiffel Tower which is in Paris is famous.', right: 'The Eiffel Tower, which is in Paris, is famous.', rule: 'Use commas around nonrestrictive clauses.' },
        { wrong: 'Mr. Smith our neighbor fixed the fence.', right: 'Mr. Smith, our neighbor, fixed the fence.', rule: 'Use commas around appositives.' },
        { wrong: 'The movie however was boring.', right: 'The movie, however, was boring.', rule: 'Use commas around parenthetical words.' },
        { wrong: 'My best friend Sara loves dogs.', right: 'My best friend, Sara, loves dogs.', rule: 'Use commas around appositives.' },
      ],
    },
    'consistency-style-tone': {
      items: [
        { wrong: 'The experiment was conducted carefully. Then we totally messed up the data lol.', issue: 'Shift from formal to informal tone.', fix: 'The experiment was conducted carefully. However, errors occurred during data recording.' },
        { wrong: 'Dear Sir, Wassup? I am writing to apply for the job.', issue: 'Mix of informal greeting with formal letter.', fix: 'Dear Sir, I am writing to apply for the position.' },
        { wrong: 'The results showed significant improvement. Its pretty cool actually.', issue: 'Shift from academic to casual tone.', fix: 'The results showed significant improvement. This finding is noteworthy.' },
      ],
    },
  },
};

const MENTOR_SENTENCES = {
  'kindergarten': [
    { sentence: 'The little dog barked.', focus: 'complete sentence', notice: 'Subject (dog) + verb (barked)' },
    { sentence: 'I see a big, red ball.', focus: 'adjectives', notice: 'Two adjectives describe the ball' },
  ],
  'grade-1': [
    { sentence: 'Max and Ruby played in the park, and they had fun.', focus: 'compound sentence', notice: 'Two ideas joined by "and"' },
    { sentence: "The bird's song filled the quiet morning.", focus: 'possessive noun', notice: "Apostrophe-s shows the song belongs to the bird" },
  ],
  'grade-2': [
    { sentence: 'The brave little mouse quietly crept past the sleeping cat.', focus: 'adjectives and adverbs', notice: 'Adjectives (brave, little, sleeping) and adverb (quietly) add detail' },
    { sentence: "The children's laughter echoed through the playground.", focus: 'irregular possessive', notice: "children's — irregular plural possessive" },
  ],
  'grade-3': [
    { sentence: 'Although it was raining, the team played their best game.', focus: 'complex sentence', notice: 'Starts with a dependent clause ("although...")' },
    { sentence: '"I can do this," she whispered to herself, and she did.', focus: 'dialogue + compound', notice: 'Quotation marks, comma inside quotes, compound ending' },
  ],
  'grade-4': [
    { sentence: 'The girl who loved reading spent every afternoon at the library, which was her favorite place.', focus: 'relative clauses', notice: '"who loved reading" and "which was her favorite place" add info' },
    { sentence: 'Before the sun rose, the farmer was already working in the fields.', focus: 'introductory clause + progressive', notice: 'Comma after introductory clause; past progressive tense' },
  ],
  'grade-5': [
    { sentence: 'Not only had she finished her homework, but she had also cleaned her room.', focus: 'correlative conjunctions + perfect tense', notice: '"Not only...but also" + past perfect tense' },
    { sentence: 'After years of practice, he had finally mastered the piano — his greatest achievement.', focus: 'dash + perfect tense', notice: 'Dash sets off an appositive; past perfect tense' },
  ],
  'grade-6': [
    { sentence: 'The city, which had been quiet for decades, suddenly buzzed with the energy of change — an energy that was, quite frankly, long overdue.', focus: 'nonrestrictive elements + style', notice: 'Commas around "which" clause, dash for emphasis, parenthetical "quite frankly"' },
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

// ── Exercise Generation ──

function generateExercise(grade, skill, count = 5) {
  const bank = EXERCISE_BANKS[grade]?.[skill];
  if (!bank) return { error: `No exercise bank for ${grade}/${skill}` };

  const items = bank.items;
  if (!items || !items.length) return { error: `Empty exercise bank for ${grade}/${skill}` };

  const selected = pick(items, count);

  // Determine exercise type from skill name and item structure
  if (selected[0].wrong !== undefined && selected[0].right !== undefined) {
    return { type: 'fix-it', skill, grade, count: selected.length, instruction: 'Fix the error in this sentence.', items: selected.map(i => ({ prompt: i.wrong, answer: i.right, rule: i.rule || i.error || '' })) };
  }
  if (selected[0].sentence !== undefined && selected[0].answer !== undefined && selected[0].options) {
    return { type: 'fill-in-choice', skill, grade, count: selected.length, instruction: 'Choose the correct word to fill in the blank.', items: selected.map(i => ({ prompt: i.sentence, options: i.options, answer: i.answer, rule: i.rule || '' })) };
  }
  if (selected[0].sentence !== undefined && selected[0].answer !== undefined) {
    return { type: 'fill-in', skill, grade, count: selected.length, instruction: 'Fill in the blank with the correct answer.', items: selected.map(i => ({ prompt: i.sentence || i.prompt, answer: i.answer, hint: i.hint || i.rule || i.tense || '' })) };
  }
  if (selected[0].text !== undefined && selected[0].answer !== undefined) {
    return { type: 'identify', skill, grade, count: selected.length, instruction: 'Answer the question about this text.', items: selected.map(i => ({ prompt: i.text, answer: i.answer, reason: i.reason || i.explanation || '' })) };
  }
  if (selected[0].prompt !== undefined && selected[0].answer !== undefined) {
    return { type: 'prompt-response', skill, grade, count: selected.length, instruction: 'Answer the question.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, options: i.options, rule: i.rule || '' })) };
  }
  if (selected[0].singular !== undefined) {
    return { type: 'plural', skill, grade, count: selected.length, instruction: 'What is the plural of this word?', items: selected.map(i => ({ prompt: `What is the plural of "${i.singular}"?`, answer: i.plural, singular: i.singular })) };
  }
  if (selected[0].present !== undefined && selected[0].past !== undefined) {
    const tenses = ['past', 'present', 'future'];
    return { type: 'verb-form', skill, grade, count: selected.length, instruction: 'Give the correct form of this verb.',
      items: selected.map(i => {
        const t = tenses[Math.floor(Math.random() * 3)];
        const answer = t === 'past' ? i.past : t === 'present' ? i.present : i.future;
        return { prompt: `${t} tense of "${i.word}"?`, answer, tense: t, wrong_form: i.wrong || '' };
      })};
  }
  if (selected[0].base !== undefined && selected[0].comparative !== undefined) {
    const mode = Math.random() > 0.5 ? 'comparative' : 'superlative';
    return { type: 'comparison', skill, grade, count: selected.length, instruction: `Give the ${mode} form.`, items: selected.map(i => ({ prompt: `${mode} of "${i.base}"?`, answer: i[mode], base: i.base })) };
  }
  if (selected[0].word !== undefined && selected[0].type !== undefined) {
    return { type: 'classify', skill, grade, count: selected.length, instruction: 'Classify this word.', items: selected.map(i => ({ prompt: `Is "${i.word}" abstract or concrete?`, answer: i.type, explanation: i.explanation })) };
  }
  if (selected[0].verb !== undefined && selected[0].past !== undefined) {
    return { type: 'verb-classify', skill, grade, count: selected.length, instruction: 'Is this verb regular or irregular? What is its past tense?', items: selected.map(i => ({ prompt: `"${i.verb}" — regular or irregular? Past tense?`, answer: `${i.type}, ${i.past}`, verb: i.verb, past: i.past, verbType: i.type })) };
  }
  if (selected[0].full !== undefined && selected[0].contraction !== undefined) {
    return { type: 'contraction', skill, grade, count: selected.length, instruction: 'Write the contraction.', items: selected.map(i => Math.random() > 0.5
      ? { prompt: `Contraction for "${i.full}"?`, answer: i.contraction }
      : { prompt: `What does "${i.contraction}" stand for?`, answer: i.full }
    )};
  }
  if (selected[0].short !== undefined && selected[0].combined !== undefined) {
    return { type: 'combine', skill, grade, count: selected.length, instruction: 'Combine these sentences into one better sentence.', items: selected.map(i => ({ prompt: i.short.join(' | '), answer: i.combined, method: i.method })) };
  }
  if (selected[0].boring !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Improve this choppy or repetitive writing.', items: selected.map(i => ({ prompt: i.boring, answer: i.improved, method: i.method })) };
  }
  if (selected[0].title !== undefined) {
    return { type: 'format', skill, grade, count: selected.length, instruction: 'Should this title be in italics or quotation marks?', items: selected.map(i => ({ prompt: i.title, answer: i.format, rule: i.rule })) };
  }
  if (selected[0].issue !== undefined) {
    return { type: 'tone-fix', skill, grade, count: selected.length, instruction: 'Identify and fix the style/tone issue.', items: selected.map(i => ({ prompt: i.wrong, issue: i.issue, answer: i.fix })) };
  }

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
}

// ── Public API ──

class Grammar {
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

  getMentorSentence(grade) {
    const sentences = MENTOR_SENTENCES[grade];
    if (!sentences) return { error: `No mentor sentences for ${grade}.` };
    return pick(sentences, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const mentor = MENTOR_SENTENCES[grade] ? pick(MENTOR_SENTENCES[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, mentorSentence: mentor,
      lessonPlan: {
        mentor: mentor ? `Study: "${mentor.sentence}" — Focus: ${mentor.focus}` : 'Review a sentence from recent reading.',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Use this grammar pattern in your own writing.',
      },
    };
  }
}

module.exports = Grammar;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const gr = new Grammar();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) gr.setGrade(id, grade);
        out({ action: 'start', profile: gr.getProfile(id), nextSkills: gr.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(gr.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'kindergarten';
        if (skill) { out(gr.generateExercise(grade, skill, 5)); }
        else { const n = gr.getNextSkills(id, 1).next; out(n.length ? gr.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(gr.checkAnswer(type, expected, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(gr.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(gr.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(gr.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(gr.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? gr.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(gr.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(gr.setGrade(id, g)); break; }
      case 'mentor': { const [, g] = args; if (!g) throw new Error('Usage: mentor <grade>'); out(gr.getMentorSentence(g)); break; }
      default: out({ usage: 'node grammar.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','mentor'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
