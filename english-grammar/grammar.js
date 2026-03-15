// English Grammar Interactive Tutor (A1-C2). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'english-grammar');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'a1': {
    'verb-tenses': ['present-simple-be', 'present-simple', 'present-continuous-intro'],
    'nouns-articles': ['singular-plural', 'a-an-the-basics', 'countable-uncountable-intro'],
    'sentence-structure': ['svo-word-order', 'negatives-be', 'negatives-do', 'yes-no-questions', 'wh-questions-basic'],
    'prepositions': ['in-on-at-place', 'in-on-at-time'],
    'pronouns': ['subject-pronouns', 'object-pronouns', 'possessive-adjectives'],
  },
  'a2': {
    'verb-tenses': ['past-simple-regular', 'past-simple-irregular', 'present-continuous', 'be-going-to'],
    'comparisons': ['comparatives', 'superlatives'],
    'modals': ['can-could', 'must-have-to', 'should'],
    'connectors': ['and-but-or-so-because'],
    'quantifiers': ['some-any', 'much-many-a-lot'],
  },
  'b1': {
    'verb-tenses': ['present-perfect-simple', 'present-perfect-vs-past', 'future-will-vs-going-to'],
    'conditionals': ['zero-conditional', 'first-conditional', 'second-conditional'],
    'passive': ['present-passive', 'past-passive'],
    'relative-clauses': ['who-which-that', 'defining-vs-non-defining'],
    'reported-speech': ['reported-statements-intro'],
  },
  'b2': {
    'verb-tenses': ['past-perfect', 'future-continuous', 'future-perfect'],
    'conditionals': ['third-conditional', 'mixed-conditionals'],
    'passive': ['advanced-passive', 'causative-have-get'],
    'reported-speech': ['reported-questions', 'reported-commands'],
    'wish': ['wish-past', 'wish-past-perfect', 'if-only'],
  },
  'c1': {
    'advanced-structures': ['inversion-negative', 'cleft-sentences', 'participle-clauses'],
    'modals': ['modal-perfect-deduction', 'modal-continuous'],
    'connectors': ['discourse-markers', 'advanced-linking'],
    'noun-clauses': ['nominal-that-clauses', 'wh-noun-clauses'],
    'subjunctive': ['formal-subjunctive', 'were-to'],
  },
  'c2': {
    'style': ['fronting', 'extraposition', 'ellipsis-substitution'],
    'discourse': ['theme-rheme', 'cohesion-devices', 'register-shifting'],
    'nuance': ['hedging-modals', 'distancing', 'emphasis-patterns'],
  },
};

const ITEM_BANKS = {
  'a1': {
    'present-simple-be': {
      type: 'fill-in',
      instruction: 'Fill in the blank with the correct form of "be".',
      items: [
        { sentence: 'I ___ a student.', answer: 'am', options: ['am', 'is', 'are', 'be'] },
        { sentence: 'She ___ from Brazil.', answer: 'is', options: ['am', 'is', 'are', 'be'] },
        { sentence: 'They ___ happy.', answer: 'are', options: ['am', 'is', 'are', 'be'] },
        { sentence: 'He ___ a teacher.', answer: 'is', options: ['am', 'is', 'are', 'be'] },
        { sentence: 'We ___ friends.', answer: 'are', options: ['am', 'is', 'are', 'be'] },
        { sentence: 'You ___ very kind.', answer: 'are', options: ['am', 'is', 'are', 'be'] },
        { sentence: 'It ___ cold today.', answer: 'is', options: ['am', 'is', 'are', 'be'] },
        { sentence: 'I ___ not tired.', answer: 'am', options: ['am', 'is', 'are', 'be'] },
        { sentence: 'The cats ___ outside.', answer: 'are', options: ['am', 'is', 'are', 'be'] },
        { sentence: 'My name ___ Maria.', answer: 'is', options: ['am', 'is', 'are', 'be'] },
      ],
    },
    'present-simple': {
      type: 'fill-in',
      instruction: 'Fill in the blank with the correct present simple form.',
      items: [
        { sentence: 'She ___ to school every day.', answer: 'goes', options: ['go', 'goes', 'going', 'gone'] },
        { sentence: 'They ___ coffee in the morning.', answer: 'drink', options: ['drink', 'drinks', 'drinking', 'drank'] },
        { sentence: 'He ___ English very well.', answer: 'speaks', options: ['speak', 'speaks', 'speaking', 'spoke'] },
        { sentence: 'I ___ in a small apartment.', answer: 'live', options: ['live', 'lives', 'living', 'lived'] },
        { sentence: 'The train ___ at 8 o\'clock.', answer: 'leaves', options: ['leave', 'leaves', 'leaving', 'left'] },
        { sentence: 'We ___ dinner at 7 PM.', answer: 'eat', options: ['eat', 'eats', 'eating', 'ate'] },
        { sentence: 'My sister ___ in a bank.', answer: 'works', options: ['work', 'works', 'working', 'worked'] },
        { sentence: 'Dogs ___ bones.', answer: 'like', options: ['like', 'likes', 'liking', 'liked'] },
        { sentence: 'He never ___ breakfast.', answer: 'eats', options: ['eat', 'eats', 'eating', 'ate'] },
        { sentence: 'It ___ a lot in London.', answer: 'rains', options: ['rain', 'rains', 'raining', 'rained'] },
      ],
    },
    'present-continuous-intro': {
      type: 'fill-in',
      instruction: 'Fill in the blank with the correct present continuous form.',
      items: [
        { sentence: 'I ___ (read) a book right now.', answer: 'am reading', options: ['am reading', 'is reading', 'are reading', 'read'] },
        { sentence: 'She ___ (cook) dinner.', answer: 'is cooking', options: ['am cooking', 'is cooking', 'are cooking', 'cooks'] },
        { sentence: 'They ___ (play) in the park.', answer: 'are playing', options: ['am playing', 'is playing', 'are playing', 'plays'] },
        { sentence: 'We ___ (wait) for the bus.', answer: 'are waiting', options: ['am waiting', 'is waiting', 'are waiting', 'waits'] },
        { sentence: 'He ___ (sleep) now.', answer: 'is sleeping', options: ['am sleeping', 'is sleeping', 'are sleeping', 'sleeps'] },
        { sentence: 'The baby ___ (cry).', answer: 'is crying', options: ['am crying', 'is crying', 'are crying', 'cries'] },
        { sentence: 'You ___ (sit) in my chair.', answer: 'are sitting', options: ['am sitting', 'is sitting', 'are sitting', 'sits'] },
        { sentence: 'I ___ (not/work) today.', answer: 'am not working', options: ['am not working', 'is not working', 'are not working', 'not work'] },
      ],
    },
    'singular-plural': {
      type: 'transformation',
      instruction: 'Write the plural form of the noun.',
      items: [
        { prompt: 'cat', answer: 'cats' }, { prompt: 'box', answer: 'boxes' },
        { prompt: 'child', answer: 'children' }, { prompt: 'city', answer: 'cities' },
        { prompt: 'tooth', answer: 'teeth' }, { prompt: 'bus', answer: 'buses' },
        { prompt: 'man', answer: 'men' }, { prompt: 'baby', answer: 'babies' },
        { prompt: 'knife', answer: 'knives' }, { prompt: 'mouse', answer: 'mice' },
      ],
    },
    'a-an-the-basics': {
      type: 'fill-in',
      instruction: 'Fill in the blank with a, an, or the.',
      items: [
        { sentence: 'I have ___ cat.', answer: 'a', options: ['a', 'an', 'the'] },
        { sentence: 'She is ___ engineer.', answer: 'an', options: ['a', 'an', 'the'] },
        { sentence: '___ sun is shining.', answer: 'the', options: ['a', 'an', 'the'] },
        { sentence: 'He ate ___ apple.', answer: 'an', options: ['a', 'an', 'the'] },
        { sentence: 'Please close ___ door.', answer: 'the', options: ['a', 'an', 'the'] },
        { sentence: 'I need ___ umbrella.', answer: 'an', options: ['a', 'an', 'the'] },
        { sentence: 'She is ___ doctor.', answer: 'a', options: ['a', 'an', 'the'] },
        { sentence: '___ moon is beautiful tonight.', answer: 'the', options: ['a', 'an', 'the'] },
        { sentence: 'I saw ___ bird in the garden.', answer: 'a', options: ['a', 'an', 'the'] },
        { sentence: 'Can you pass me ___ salt?', answer: 'the', options: ['a', 'an', 'the'] },
      ],
    },
    'countable-uncountable-intro': {
      type: 'classify',
      instruction: 'Is this noun countable (C) or uncountable (U)?',
      items: [
        { word: 'water', answer: 'U' }, { word: 'book', answer: 'C' },
        { word: 'rice', answer: 'U' }, { word: 'apple', answer: 'C' },
        { word: 'money', answer: 'U' }, { word: 'chair', answer: 'C' },
        { word: 'music', answer: 'U' }, { word: 'pen', answer: 'C' },
        { word: 'information', answer: 'U' }, { word: 'egg', answer: 'C' },
      ],
    },
    'svo-word-order': {
      type: 'reorder',
      instruction: 'Put the words in the correct order to make a sentence.',
      items: [
        { words: ['likes', 'she', 'coffee'], answer: 'she likes coffee' },
        { words: ['a', 'dog', 'I', 'have'], answer: 'I have a dog' },
        { words: ['plays', 'football', 'he'], answer: 'he plays football' },
        { words: ['read', 'books', 'we'], answer: 'we read books' },
        { words: ['eat', 'they', 'lunch', 'at', 'noon'], answer: 'they eat lunch at noon' },
        { words: ['speaks', 'English', 'Maria'], answer: 'Maria speaks English' },
        { words: ['the', 'children', 'play', 'in', 'park', 'the'], answer: 'the children play in the park' },
        { words: ['works', 'my', 'father', 'in', 'office', 'an'], answer: 'my father works in an office' },
      ],
    },
    'negatives-be': {
      type: 'transformation',
      instruction: 'Make the sentence negative.',
      items: [
        { prompt: 'She is happy.', answer: 'She is not happy.' },
        { prompt: 'They are students.', answer: 'They are not students.' },
        { prompt: 'I am tired.', answer: 'I am not tired.' },
        { prompt: 'He is a doctor.', answer: 'He is not a doctor.' },
        { prompt: 'We are ready.', answer: 'We are not ready.' },
        { prompt: 'It is cold.', answer: 'It is not cold.' },
        { prompt: 'You are late.', answer: 'You are not late.' },
        { prompt: 'The book is on the table.', answer: 'The book is not on the table.' },
      ],
    },
    'negatives-do': {
      type: 'transformation',
      instruction: 'Make the sentence negative.',
      items: [
        { prompt: 'She likes coffee.', answer: "She doesn't like coffee." },
        { prompt: 'They play tennis.', answer: "They don't play tennis." },
        { prompt: 'He works on Sundays.', answer: "He doesn't work on Sundays." },
        { prompt: 'I eat meat.', answer: "I don't eat meat." },
        { prompt: 'We live in Paris.', answer: "We don't live in Paris." },
        { prompt: 'She speaks French.', answer: "She doesn't speak French." },
        { prompt: 'The bus stops here.', answer: "The bus doesn't stop here." },
        { prompt: 'They want coffee.', answer: "They don't want coffee." },
      ],
    },
    'yes-no-questions': {
      type: 'transformation',
      instruction: 'Turn the statement into a yes/no question.',
      items: [
        { prompt: 'She is a teacher.', answer: 'Is she a teacher?' },
        { prompt: 'They like pizza.', answer: 'Do they like pizza?' },
        { prompt: 'He plays guitar.', answer: 'Does he play guitar?' },
        { prompt: 'You are happy.', answer: 'Are you happy?' },
        { prompt: 'We need help.', answer: 'Do we need help?' },
        { prompt: 'She has a car.', answer: 'Does she have a car?' },
        { prompt: 'It is raining.', answer: 'Is it raining?' },
        { prompt: 'They work here.', answer: 'Do they work here?' },
      ],
    },
    'wh-questions-basic': {
      type: 'fill-in',
      instruction: 'Fill in the blank with the correct question word.',
      items: [
        { sentence: '___ is your name?', answer: 'What', options: ['What', 'Where', 'Who', 'When'] },
        { sentence: '___ do you live?', answer: 'Where', options: ['What', 'Where', 'Who', 'When'] },
        { sentence: '___ is your birthday?', answer: 'When', options: ['What', 'Where', 'Who', 'When'] },
        { sentence: '___ is your teacher?', answer: 'Who', options: ['What', 'Where', 'Who', 'When'] },
        { sentence: '___ are you sad?', answer: 'Why', options: ['Why', 'Where', 'Who', 'When'] },
        { sentence: '___ old are you?', answer: 'How', options: ['How', 'What', 'Who', 'When'] },
        { sentence: '___ books do you have?', answer: 'How many', options: ['How many', 'How much', 'What', 'Which'] },
        { sentence: '___ one do you want?', answer: 'Which', options: ['Which', 'What', 'Who', 'How'] },
      ],
    },
    'in-on-at-place': {
      type: 'fill-in',
      instruction: 'Fill in the blank with in, on, or at.',
      items: [
        { sentence: 'She lives ___ London.', answer: 'in', options: ['in', 'on', 'at'] },
        { sentence: 'The book is ___ the table.', answer: 'on', options: ['in', 'on', 'at'] },
        { sentence: 'I am ___ home.', answer: 'at', options: ['in', 'on', 'at'] },
        { sentence: 'He is ___ the kitchen.', answer: 'in', options: ['in', 'on', 'at'] },
        { sentence: 'We met ___ the bus stop.', answer: 'at', options: ['in', 'on', 'at'] },
        { sentence: 'The picture is ___ the wall.', answer: 'on', options: ['in', 'on', 'at'] },
        { sentence: 'She works ___ a hospital.', answer: 'in', options: ['in', 'on', 'at'] },
        { sentence: 'I am ___ school.', answer: 'at', options: ['in', 'on', 'at'] },
      ],
    },
    'in-on-at-time': {
      type: 'fill-in',
      instruction: 'Fill in the blank with in, on, or at.',
      items: [
        { sentence: 'I wake up ___ 7 o\'clock.', answer: 'at', options: ['in', 'on', 'at'] },
        { sentence: 'We have class ___ Monday.', answer: 'on', options: ['in', 'on', 'at'] },
        { sentence: 'She was born ___ 1990.', answer: 'in', options: ['in', 'on', 'at'] },
        { sentence: 'I study ___ the morning.', answer: 'in', options: ['in', 'on', 'at'] },
        { sentence: 'The party is ___ Saturday.', answer: 'on', options: ['in', 'on', 'at'] },
        { sentence: 'He arrives ___ noon.', answer: 'at', options: ['in', 'on', 'at'] },
        { sentence: 'It snows ___ winter.', answer: 'in', options: ['in', 'on', 'at'] },
        { sentence: 'The meeting is ___ March 5th.', answer: 'on', options: ['in', 'on', 'at'] },
      ],
    },
    'subject-pronouns': {
      type: 'fill-in',
      instruction: 'Replace the underlined word with the correct subject pronoun.',
      items: [
        { sentence: '___ is a good student. (Maria)', answer: 'She', options: ['He', 'She', 'It', 'They'] },
        { sentence: '___ are very tall. (The boys)', answer: 'They', options: ['He', 'She', 'It', 'They'] },
        { sentence: '___ is on the table. (The book)', answer: 'It', options: ['He', 'She', 'It', 'They'] },
        { sentence: '___ plays football. (Tom)', answer: 'He', options: ['He', 'She', 'It', 'They'] },
        { sentence: '___ are my friends. (Lisa and I)', answer: 'We', options: ['We', 'They', 'You', 'I'] },
        { sentence: '___ like chocolate. (My parents)', answer: 'They', options: ['He', 'She', 'We', 'They'] },
        { sentence: '___ am a student.', answer: 'I', options: ['I', 'He', 'She', 'We'] },
        { sentence: '___ are from Japan. (Yuki)', answer: 'She', options: ['He', 'She', 'It', 'They'] },
      ],
    },
    'object-pronouns': {
      type: 'fill-in',
      instruction: 'Fill in the blank with the correct object pronoun.',
      items: [
        { sentence: 'I love ___. (my mother)', answer: 'her', options: ['him', 'her', 'it', 'them'] },
        { sentence: 'She called ___. (John)', answer: 'him', options: ['him', 'her', 'it', 'them'] },
        { sentence: 'Can you help ___? (my friends and me)', answer: 'us', options: ['us', 'them', 'me', 'you'] },
        { sentence: 'I gave ___ a book. (Tom)', answer: 'him', options: ['him', 'her', 'it', 'them'] },
        { sentence: 'Please tell ___. (the students)', answer: 'them', options: ['him', 'her', 'us', 'them'] },
        { sentence: 'She likes ___. (the cake)', answer: 'it', options: ['him', 'her', 'it', 'them'] },
        { sentence: 'He saw ___ at the park. (you and me)', answer: 'us', options: ['us', 'them', 'me', 'you'] },
        { sentence: 'Can you hear ___? (I)', answer: 'me', options: ['me', 'him', 'her', 'us'] },
      ],
    },
    'possessive-adjectives': {
      type: 'fill-in',
      instruction: 'Fill in the blank with the correct possessive adjective.',
      items: [
        { sentence: 'I love ___ dog.', answer: 'my', options: ['my', 'his', 'her', 'your'] },
        { sentence: 'She is doing ___ homework.', answer: 'her', options: ['my', 'his', 'her', 'your'] },
        { sentence: 'They sold ___ house.', answer: 'their', options: ['our', 'his', 'her', 'their'] },
        { sentence: 'He drives ___ car to work.', answer: 'his', options: ['my', 'his', 'her', 'your'] },
        { sentence: 'We finished ___ project.', answer: 'our', options: ['our', 'his', 'her', 'their'] },
        { sentence: 'The cat licked ___ paw.', answer: 'its', options: ['its', 'his', 'her', 'their'] },
        { sentence: 'Is this ___ book? (you)', answer: 'your', options: ['my', 'his', 'her', 'your'] },
        { sentence: 'I forgot ___ keys.', answer: 'my', options: ['my', 'his', 'her', 'your'] },
      ],
    },
  },
  'a2': {
    'past-simple-regular': {
      type: 'fill-in',
      instruction: 'Fill in the blank with the past simple form of the verb.',
      items: [
        { sentence: 'She ___ (walk) to school yesterday.', answer: 'walked', options: ['walk', 'walked', 'walks', 'walking'] },
        { sentence: 'They ___ (play) football last weekend.', answer: 'played', options: ['play', 'played', 'plays', 'playing'] },
        { sentence: 'I ___ (study) English last night.', answer: 'studied', options: ['study', 'studied', 'studies', 'studying'] },
        { sentence: 'He ___ (cook) dinner for us.', answer: 'cooked', options: ['cook', 'cooked', 'cooks', 'cooking'] },
        { sentence: 'We ___ (arrive) at 10 PM.', answer: 'arrived', options: ['arrive', 'arrived', 'arrives', 'arriving'] },
        { sentence: 'She ___ (stop) the car suddenly.', answer: 'stopped', options: ['stop', 'stopped', 'stops', 'stopping'] },
        { sentence: 'They ___ (watch) a movie.', answer: 'watched', options: ['watch', 'watched', 'watches', 'watching'] },
        { sentence: 'I ___ (call) you three times.', answer: 'called', options: ['call', 'called', 'calls', 'calling'] },
      ],
    },
    'past-simple-irregular': {
      type: 'fill-in',
      instruction: 'Fill in the blank with the past simple form.',
      items: [
        { sentence: 'She ___ (go) to the store.', answer: 'went', options: ['go', 'went', 'gone', 'going'] },
        { sentence: 'I ___ (eat) breakfast early.', answer: 'ate', options: ['eat', 'ate', 'eaten', 'eating'] },
        { sentence: 'They ___ (see) a movie.', answer: 'saw', options: ['see', 'saw', 'seen', 'seeing'] },
        { sentence: 'He ___ (take) the bus.', answer: 'took', options: ['take', 'took', 'taken', 'taking'] },
        { sentence: 'We ___ (have) a great time.', answer: 'had', options: ['have', 'had', 'has', 'having'] },
        { sentence: 'She ___ (buy) a new dress.', answer: 'bought', options: ['buy', 'bought', 'buys', 'buying'] },
        { sentence: 'I ___ (write) a letter.', answer: 'wrote', options: ['write', 'wrote', 'written', 'writing'] },
        { sentence: 'They ___ (come) to the party.', answer: 'came', options: ['come', 'came', 'comes', 'coming'] },
        { sentence: 'He ___ (think) about it.', answer: 'thought', options: ['think', 'thought', 'thinks', 'thinking'] },
        { sentence: 'We ___ (know) the answer.', answer: 'knew', options: ['know', 'knew', 'known', 'knowing'] },
      ],
    },
    'present-continuous': {
      type: 'error-correction',
      instruction: 'Find and correct the error in the sentence.',
      items: [
        { sentence: 'She is work right now.', corrected: 'She is working right now.', error: 'work → working' },
        { sentence: 'They are plaing football.', corrected: 'They are playing football.', error: 'plaing → playing' },
        { sentence: 'He is runing fast.', corrected: 'He is running fast.', error: 'runing → running' },
        { sentence: 'I am have lunch now.', corrected: 'I am having lunch now.', error: 'have → having' },
        { sentence: 'We is watching TV.', corrected: 'We are watching TV.', error: 'is → are' },
        { sentence: 'She are reading a book.', corrected: 'She is reading a book.', error: 'are → is' },
        { sentence: 'I am not go to school today.', corrected: 'I am not going to school today.', error: 'go → going' },
        { sentence: 'They is eating dinner.', corrected: 'They are eating dinner.', error: 'is → are' },
      ],
    },
    'be-going-to': {
      type: 'transformation',
      instruction: 'Rewrite using "be going to" for future plans.',
      items: [
        { prompt: 'I / visit / my grandmother', answer: 'I am going to visit my grandmother.' },
        { prompt: 'She / study / medicine', answer: 'She is going to study medicine.' },
        { prompt: 'They / buy / a new car', answer: 'They are going to buy a new car.' },
        { prompt: 'We / travel / to Japan', answer: 'We are going to travel to Japan.' },
        { prompt: 'He / learn / to cook', answer: 'He is going to learn to cook.' },
        { prompt: 'I / not / work / tomorrow', answer: 'I am not going to work tomorrow.' },
        { prompt: 'She / not / come / to the party', answer: 'She is not going to come to the party.' },
        { prompt: 'They / move / to London', answer: 'They are going to move to London.' },
      ],
    },
    'comparatives': {
      type: 'fill-in',
      instruction: 'Fill in the comparative form.',
      items: [
        { sentence: 'She is ___ than her sister. (tall)', answer: 'taller', options: ['tall', 'taller', 'tallest', 'more tall'] },
        { sentence: 'This book is ___ than that one. (interesting)', answer: 'more interesting', options: ['interesting', 'more interesting', 'interestinger', 'most interesting'] },
        { sentence: 'Dogs are ___ than cats. (friendly)', answer: 'friendlier', options: ['friendly', 'friendlier', 'more friendly', 'friendliest'] },
        { sentence: 'English is ___ than Chinese. (easy)', answer: 'easier', options: ['easy', 'easier', 'more easy', 'easiest'] },
        { sentence: 'Gold is ___ than silver. (expensive)', answer: 'more expensive', options: ['expensive', 'more expensive', 'expensiver', 'most expensive'] },
        { sentence: 'He is ___ than me. (old)', answer: 'older', options: ['old', 'older', 'more old', 'oldest'] },
        { sentence: 'This test was ___ than the last one. (bad)', answer: 'worse', options: ['bad', 'worse', 'badder', 'worst'] },
        { sentence: 'Her cooking is ___ than mine. (good)', answer: 'better', options: ['good', 'better', 'gooder', 'best'] },
      ],
    },
    'superlatives': {
      type: 'fill-in',
      instruction: 'Fill in the superlative form.',
      items: [
        { sentence: 'She is the ___ student in class. (smart)', answer: 'smartest', options: ['smart', 'smarter', 'smartest', 'most smart'] },
        { sentence: 'This is the ___ movie I\'ve seen. (bad)', answer: 'worst', options: ['bad', 'worse', 'worst', 'baddest'] },
        { sentence: 'It was the ___ day of the year. (hot)', answer: 'hottest', options: ['hot', 'hotter', 'hottest', 'most hot'] },
        { sentence: 'She is the ___ person I know. (kind)', answer: 'kindest', options: ['kind', 'kinder', 'kindest', 'most kind'] },
        { sentence: 'This is the ___ building in the city. (tall)', answer: 'tallest', options: ['tall', 'taller', 'tallest', 'most tall'] },
        { sentence: 'He is the ___ player on the team. (good)', answer: 'best', options: ['good', 'better', 'best', 'goodest'] },
        { sentence: 'It was the ___ experience of my life. (beautiful)', answer: 'most beautiful', options: ['beautiful', 'more beautiful', 'most beautiful', 'beautifulest'] },
        { sentence: 'This is the ___ question on the test. (difficult)', answer: 'most difficult', options: ['difficult', 'difficulter', 'most difficult', 'difficultest'] },
      ],
    },
    'can-could': {
      type: 'fill-in',
      instruction: 'Fill in with can, can\'t, could, or couldn\'t.',
      items: [
        { sentence: 'I ___ swim when I was five.', answer: "couldn't", options: ['can', "can't", 'could', "couldn't"] },
        { sentence: 'She ___ speak three languages.', answer: 'can', options: ['can', "can't", 'could', "couldn't"] },
        { sentence: '___ you help me, please?', answer: 'Could', options: ['Can', "Can't", 'Could', "Couldn't"] },
        { sentence: 'He ___ ride a bike when he was three.', answer: 'could', options: ['can', "can't", 'could', "couldn't"] },
        { sentence: 'I ___ see without my glasses.', answer: "can't", options: ['can', "can't", 'could', "couldn't"] },
        { sentence: 'We ___ go to the party last night.', answer: "couldn't", options: ['can', "can't", 'could', "couldn't"] },
        { sentence: 'She ___ play the piano very well.', answer: 'can', options: ['can', "can't", 'could', "couldn't"] },
        { sentence: '___ I borrow your pen?', answer: 'Can', options: ['Can', "Can't", 'Could', "Couldn't"] },
      ],
    },
    'must-have-to': {
      type: 'fill-in',
      instruction: 'Fill in with must, mustn\'t, have to, or don\'t have to.',
      items: [
        { sentence: 'You ___ drive on the left in the UK.', answer: 'must', options: ['must', "mustn't", 'have to', "don't have to"] },
        { sentence: 'You ___ use your phone in class.', answer: "mustn't", options: ['must', "mustn't", 'have to', "don't have to"] },
        { sentence: 'I ___ wear a uniform at work.', answer: 'have to', options: ['must', "mustn't", 'have to', "don't have to"] },
        { sentence: 'It\'s Sunday. You ___ go to school.', answer: "don't have to", options: ['must', "mustn't", 'have to', "don't have to"] },
        { sentence: 'You ___ be quiet in the library.', answer: 'must', options: ['must', "mustn't", 'have to', "don't have to"] },
        { sentence: 'She ___ cook tonight; we\'re eating out.', answer: "doesn't have to", options: ['must', "mustn't", 'has to', "doesn't have to"] },
        { sentence: 'You ___ touch that! It\'s dangerous.', answer: "mustn't", options: ['must', "mustn't", 'have to', "don't have to"] },
        { sentence: 'We ___ finish this report by Friday.', answer: 'have to', options: ['must', "mustn't", 'have to', "don't have to"] },
      ],
    },
    'should': {
      type: 'fill-in',
      instruction: 'Fill in with should or shouldn\'t.',
      items: [
        { sentence: 'You ___ eat more vegetables.', answer: 'should', options: ['should', "shouldn't"] },
        { sentence: 'You ___ stay up too late.', answer: "shouldn't", options: ['should', "shouldn't"] },
        { sentence: 'She ___ see a doctor.', answer: 'should', options: ['should', "shouldn't"] },
        { sentence: 'He ___ drive so fast.', answer: "shouldn't", options: ['should', "shouldn't"] },
        { sentence: 'We ___ be more careful.', answer: 'should', options: ['should', "shouldn't"] },
        { sentence: 'You ___ drink so much coffee.', answer: "shouldn't", options: ['should', "shouldn't"] },
        { sentence: 'They ___ study harder.', answer: 'should', options: ['should', "shouldn't"] },
        { sentence: 'I ___ spend so much money.', answer: "shouldn't", options: ['should', "shouldn't"] },
      ],
    },
    'and-but-or-so-because': {
      type: 'fill-in',
      instruction: 'Fill in with and, but, or, so, or because.',
      items: [
        { sentence: 'I like tea ___ coffee.', answer: 'and', options: ['and', 'but', 'or', 'so', 'because'] },
        { sentence: 'He was tired ___ he went to bed early.', answer: 'so', options: ['and', 'but', 'or', 'so', 'because'] },
        { sentence: 'She studied hard ___ she didn\'t pass.', answer: 'but', options: ['and', 'but', 'or', 'so', 'because'] },
        { sentence: 'Do you want tea ___ coffee?', answer: 'or', options: ['and', 'but', 'or', 'so', 'because'] },
        { sentence: 'I stayed home ___ I was sick.', answer: 'because', options: ['and', 'but', 'or', 'so', 'because'] },
        { sentence: 'She is smart ___ kind.', answer: 'and', options: ['and', 'but', 'or', 'so', 'because'] },
        { sentence: 'It was raining ___ we took an umbrella.', answer: 'so', options: ['and', 'but', 'or', 'so', 'because'] },
        { sentence: 'The food was good ___ expensive.', answer: 'but', options: ['and', 'but', 'or', 'so', 'because'] },
      ],
    },
    'some-any': {
      type: 'fill-in',
      instruction: 'Fill in with some or any.',
      items: [
        { sentence: 'There are ___ books on the table.', answer: 'some', options: ['some', 'any'] },
        { sentence: 'Is there ___ milk in the fridge?', answer: 'any', options: ['some', 'any'] },
        { sentence: 'I don\'t have ___ money.', answer: 'any', options: ['some', 'any'] },
        { sentence: 'Can I have ___ water?', answer: 'some', options: ['some', 'any'] },
        { sentence: 'There aren\'t ___ chairs in the room.', answer: 'any', options: ['some', 'any'] },
        { sentence: 'She bought ___ flowers.', answer: 'some', options: ['some', 'any'] },
        { sentence: 'Do you have ___ questions?', answer: 'any', options: ['some', 'any'] },
        { sentence: 'Would you like ___ tea?', answer: 'some', options: ['some', 'any'] },
      ],
    },
    'much-many-a-lot': {
      type: 'fill-in',
      instruction: 'Fill in with much, many, or a lot of.',
      items: [
        { sentence: 'How ___ sugar do you want?', answer: 'much', options: ['much', 'many', 'a lot of'] },
        { sentence: 'How ___ people came to the party?', answer: 'many', options: ['much', 'many', 'a lot of'] },
        { sentence: 'She has ___ friends.', answer: 'a lot of', options: ['much', 'many', 'a lot of'] },
        { sentence: 'I don\'t have ___ time.', answer: 'much', options: ['much', 'many', 'a lot of'] },
        { sentence: 'There are ___ cars on the road.', answer: 'a lot of', options: ['much', 'many', 'a lot of'] },
        { sentence: 'How ___ water do we need?', answer: 'much', options: ['much', 'many', 'a lot of'] },
        { sentence: 'She doesn\'t eat ___ meat.', answer: 'much', options: ['much', 'many', 'a lot of'] },
        { sentence: 'How ___ languages do you speak?', answer: 'many', options: ['much', 'many', 'a lot of'] },
      ],
    },
  },
  'b1': {
    'present-perfect-simple': {
      type: 'fill-in',
      instruction: 'Fill in with the correct present perfect form.',
      items: [
        { sentence: 'I ___ (visit) Paris three times.', answer: 'have visited', options: ['have visited', 'has visited', 'visited', 'visiting'] },
        { sentence: 'She ___ (live) here since 2010.', answer: 'has lived', options: ['have lived', 'has lived', 'lived', 'living'] },
        { sentence: 'They ___ never ___ (try) sushi.', answer: 'have tried', options: ['have tried', 'has tried', 'tried', 'trying'] },
        { sentence: 'He ___ (break) his arm.', answer: 'has broken', options: ['have broken', 'has broken', 'broke', 'breaking'] },
        { sentence: 'We ___ (know) each other for years.', answer: 'have known', options: ['have known', 'has known', 'knew', 'knowing'] },
        { sentence: 'She ___ already ___ (finish) the book.', answer: 'has finished', options: ['have finished', 'has finished', 'finished', 'finishing'] },
        { sentence: 'I ___ (not/see) that movie yet.', answer: "haven't seen", options: ["haven't seen", "hasn't seen", "didn't see", 'not seeing'] },
        { sentence: '___ you ever ___ (be) to Japan?', answer: 'Have been', options: ['Have been', 'Has been', 'Did be', 'Were'] },
      ],
    },
    'present-perfect-vs-past': {
      type: 'fill-in',
      instruction: 'Choose present perfect or past simple.',
      items: [
        { sentence: 'I ___ (go) to Rome last year.', answer: 'went', options: ['went', 'have gone', 'have went', 'has gone'] },
        { sentence: 'She ___ (work) here since 2018.', answer: 'has worked', options: ['worked', 'has worked', 'have worked', 'was working'] },
        { sentence: 'We ___ (see) that film yesterday.', answer: 'saw', options: ['saw', 'have seen', 'has seen', 'see'] },
        { sentence: 'I ___ (never/eat) Thai food.', answer: 'have never eaten', options: ['have never eaten', 'never ate', 'has never eaten', 'never eat'] },
        { sentence: 'They ___ (move) to Berlin in 2020.', answer: 'moved', options: ['moved', 'have moved', 'has moved', 'moving'] },
        { sentence: 'He ___ (be) a teacher for 10 years.', answer: 'has been', options: ['was', 'has been', 'have been', 'is'] },
        { sentence: 'I ___ (lose) my keys. Can you help?', answer: 'have lost', options: ['lost', 'have lost', 'has lost', 'lose'] },
        { sentence: 'She ___ (graduate) in 2019.', answer: 'graduated', options: ['graduated', 'has graduated', 'have graduated', 'graduates'] },
      ],
    },
    'future-will-vs-going-to': {
      type: 'fill-in',
      instruction: 'Fill in with will or be going to.',
      items: [
        { sentence: 'Look at those clouds! It ___ rain.', answer: 'is going to', options: ['will', 'is going to'] },
        { sentence: 'I think she ___ pass the exam.', answer: 'will', options: ['will', 'is going to'] },
        { sentence: 'We ___ have a baby! (planned)', answer: 'are going to', options: ['will', 'are going to'] },
        { sentence: 'Don\'t worry, I ___ help you.', answer: 'will', options: ['will', 'am going to'] },
        { sentence: 'He ___ start a new job next week. (arranged)', answer: 'is going to', options: ['will', 'is going to'] },
        { sentence: 'I ___ probably be late tonight.', answer: 'will', options: ['will', 'am going to'] },
        { sentence: 'They ___ build a house. (decided)', answer: 'are going to', options: ['will', 'are going to'] },
        { sentence: 'I\'m sure you ___ love this book.', answer: 'will', options: ['will', 'are going to'] },
      ],
    },
    'zero-conditional': {
      type: 'fill-in',
      instruction: 'Complete the zero conditional sentence.',
      items: [
        { sentence: 'If you heat water to 100°C, it ___.', answer: 'boils', options: ['boils', 'will boil', 'would boil', 'boiled'] },
        { sentence: 'If it ___, the grass gets wet.', answer: 'rains', options: ['rains', 'will rain', 'rained', 'would rain'] },
        { sentence: 'If you ___ ice cream in the sun, it melts.', answer: 'leave', options: ['leave', 'will leave', 'left', 'would leave'] },
        { sentence: 'Plants die if they ___ get water.', answer: "don't", options: ["don't", "won't", "didn't", "wouldn't"] },
        { sentence: 'If you mix red and blue, you ___ purple.', answer: 'get', options: ['get', 'will get', 'got', 'would get'] },
        { sentence: 'If the temperature ___ below zero, water freezes.', answer: 'drops', options: ['drops', 'will drop', 'dropped', 'would drop'] },
      ],
    },
    'first-conditional': {
      type: 'fill-in',
      instruction: 'Complete the first conditional sentence.',
      items: [
        { sentence: 'If it rains, I ___ (take) an umbrella.', answer: 'will take', options: ['will take', 'would take', 'take', 'took'] },
        { sentence: 'If she ___ (study) hard, she will pass.', answer: 'studies', options: ['studies', 'will study', 'studied', 'would study'] },
        { sentence: 'We will be late if we ___ (not/hurry).', answer: "don't hurry", options: ["don't hurry", "won't hurry", "didn't hurry", "wouldn't hurry"] },
        { sentence: 'If you ___ (eat) too much, you will feel sick.', answer: 'eat', options: ['eat', 'will eat', 'ate', 'would eat'] },
        { sentence: 'If I see her, I ___ (tell) her.', answer: 'will tell', options: ['will tell', 'would tell', 'tell', 'told'] },
        { sentence: 'He ___ (be) angry if you are late.', answer: 'will be', options: ['will be', 'would be', 'is', 'was'] },
        { sentence: 'If we ___ (leave) now, we will catch the train.', answer: 'leave', options: ['leave', 'will leave', 'left', 'would leave'] },
        { sentence: 'If they ___ (not/come), we will start without them.', answer: "don't come", options: ["don't come", "won't come", "didn't come", "wouldn't come"] },
      ],
    },
    'second-conditional': {
      type: 'fill-in',
      instruction: 'Complete the second conditional sentence.',
      items: [
        { sentence: 'If I ___ (be) rich, I would travel the world.', answer: 'were', options: ['were', 'was', 'am', 'would be'] },
        { sentence: 'If she had more time, she ___ (learn) French.', answer: 'would learn', options: ['would learn', 'will learn', 'learns', 'learned'] },
        { sentence: 'I ___ (buy) a house if I had enough money.', answer: 'would buy', options: ['would buy', 'will buy', 'buy', 'bought'] },
        { sentence: 'If he ___ (know) the answer, he would tell us.', answer: 'knew', options: ['knew', 'knows', 'would know', 'will know'] },
        { sentence: 'If I ___ (be) you, I would study harder.', answer: 'were', options: ['were', 'was', 'am', 'would be'] },
        { sentence: 'She ___ (not/go) if she knew the truth.', answer: "wouldn't go", options: ["wouldn't go", "won't go", "doesn't go", "didn't go"] },
        { sentence: 'What ___ you ___ (do) if you won the lottery?', answer: 'would do', options: ['would do', 'will do', 'do', 'did'] },
        { sentence: 'If we ___ (live) in Japan, we would eat sushi every day.', answer: 'lived', options: ['lived', 'live', 'would live', 'will live'] },
      ],
    },
    'present-passive': {
      type: 'transformation',
      instruction: 'Rewrite in the passive voice.',
      items: [
        { prompt: 'They make cars in Japan.', answer: 'Cars are made in Japan.' },
        { prompt: 'People speak English worldwide.', answer: 'English is spoken worldwide.' },
        { prompt: 'They grow coffee in Brazil.', answer: 'Coffee is grown in Brazil.' },
        { prompt: 'Someone cleans the office every day.', answer: 'The office is cleaned every day.' },
        { prompt: 'They sell tickets online.', answer: 'Tickets are sold online.' },
        { prompt: 'They teach classes in English.', answer: 'Classes are taught in English.' },
        { prompt: 'People eat rice in Asia.', answer: 'Rice is eaten in Asia.' },
        { prompt: 'They write the reports weekly.', answer: 'The reports are written weekly.' },
      ],
    },
    'past-passive': {
      type: 'transformation',
      instruction: 'Rewrite in the passive voice.',
      items: [
        { prompt: 'Shakespeare wrote Hamlet.', answer: 'Hamlet was written by Shakespeare.' },
        { prompt: 'They built the bridge in 1990.', answer: 'The bridge was built in 1990.' },
        { prompt: 'Someone stole my bag.', answer: 'My bag was stolen.' },
        { prompt: 'They painted the house blue.', answer: 'The house was painted blue.' },
        { prompt: 'The police arrested the thief.', answer: 'The thief was arrested by the police.' },
        { prompt: 'They discovered the island in 1500.', answer: 'The island was discovered in 1500.' },
        { prompt: 'Someone broke the window.', answer: 'The window was broken.' },
        { prompt: 'They invited 200 guests.', answer: '200 guests were invited.' },
      ],
    },
    'who-which-that': {
      type: 'fill-in',
      instruction: 'Fill in with who, which, or that.',
      items: [
        { sentence: 'The woman ___ lives next door is a doctor.', answer: 'who', options: ['who', 'which', 'that'] },
        { sentence: 'The book ___ I bought is very interesting.', answer: 'that', options: ['who', 'which', 'that'] },
        { sentence: 'She is the person ___ helped me.', answer: 'who', options: ['who', 'which', 'that'] },
        { sentence: 'The car ___ is parked outside is mine.', answer: 'which', options: ['who', 'which', 'that'] },
        { sentence: 'The students ___ passed the exam are happy.', answer: 'who', options: ['who', 'which', 'that'] },
        { sentence: 'The movie ___ we saw was boring.', answer: 'that', options: ['who', 'which', 'that'] },
        { sentence: 'I met a man ___ speaks five languages.', answer: 'who', options: ['who', 'which', 'that'] },
        { sentence: 'The house ___ has a red door is for sale.', answer: 'which', options: ['who', 'which', 'that'] },
      ],
    },
    'defining-vs-non-defining': {
      type: 'classify',
      instruction: 'Is this a defining (D) or non-defining (ND) relative clause?',
      items: [
        { sentence: 'The man who lives upstairs is noisy.', answer: 'D', explanation: 'Identifies which man — essential info' },
        { sentence: 'My brother, who lives in London, is a doctor.', answer: 'ND', explanation: 'Extra info about a specific person — commas' },
        { sentence: 'The book that I borrowed was great.', answer: 'D', explanation: 'Identifies which book' },
        { sentence: 'Paris, which is the capital of France, is beautiful.', answer: 'ND', explanation: 'Extra info — we know which city' },
        { sentence: 'Students who study hard usually pass.', answer: 'D', explanation: 'Identifies which students' },
        { sentence: 'My car, which I bought last year, broke down.', answer: 'ND', explanation: 'Extra info — only one car' },
        { sentence: 'The restaurant that we went to was expensive.', answer: 'D', explanation: 'Identifies which restaurant' },
        { sentence: 'Einstein, who was born in Germany, won the Nobel Prize.', answer: 'ND', explanation: 'Extra info about a known person' },
      ],
    },
    'reported-statements-intro': {
      type: 'transformation',
      instruction: 'Change to reported speech.',
      items: [
        { prompt: '"I am tired," she said.', answer: 'She said she was tired.' },
        { prompt: '"We are leaving," they said.', answer: 'They said they were leaving.' },
        { prompt: '"I like pizza," he said.', answer: 'He said he liked pizza.' },
        { prompt: '"I will call you," she said.', answer: 'She said she would call me.' },
        { prompt: '"I can swim," he said.', answer: 'He said he could swim.' },
        { prompt: '"I have finished," she said.', answer: 'She said she had finished.' },
        { prompt: '"We don\'t know," they said.', answer: "They said they didn't know." },
        { prompt: '"I am going home," he said.', answer: 'He said he was going home.' },
      ],
    },
  },
  'b2': {
    'past-perfect': {
      type: 'fill-in',
      instruction: 'Fill in with the past perfect form.',
      items: [
        { sentence: 'By the time I arrived, she ___ (leave).', answer: 'had left', options: ['had left', 'has left', 'left', 'was leaving'] },
        { sentence: 'He ___ (never/see) snow before that trip.', answer: 'had never seen', options: ['had never seen', 'has never seen', 'never saw', 'was never seeing'] },
        { sentence: 'They ___ (already/eat) when we arrived.', answer: 'had already eaten', options: ['had already eaten', 'have already eaten', 'already ate', 'were already eating'] },
        { sentence: 'I realized I ___ (forget) my wallet.', answer: 'had forgotten', options: ['had forgotten', 'have forgotten', 'forgot', 'was forgetting'] },
        { sentence: 'She ___ (study) French before she moved to Paris.', answer: 'had studied', options: ['had studied', 'has studied', 'studied', 'was studying'] },
        { sentence: 'We ___ (not/finish) when the bell rang.', answer: "hadn't finished", options: ["hadn't finished", "haven't finished", "didn't finish", "weren't finishing"] },
      ],
    },
    'future-continuous': {
      type: 'fill-in',
      instruction: 'Fill in with the future continuous form.',
      items: [
        { sentence: 'This time tomorrow, I ___ (fly) to Paris.', answer: 'will be flying', options: ['will be flying', 'will fly', 'am flying', 'fly'] },
        { sentence: 'She ___ (work) at 8 PM tonight.', answer: 'will be working', options: ['will be working', 'will work', 'is working', 'works'] },
        { sentence: 'They ___ (not/sleep) when we arrive.', answer: "won't be sleeping", options: ["won't be sleeping", "won't sleep", "aren't sleeping", "don't sleep"] },
        { sentence: 'At noon, we ___ (have) lunch.', answer: 'will be having', options: ['will be having', 'will have', 'are having', 'have'] },
        { sentence: 'He ___ (wait) for us at the station.', answer: 'will be waiting', options: ['will be waiting', 'will wait', 'is waiting', 'waits'] },
        { sentence: 'This time next year, I ___ (study) at university.', answer: 'will be studying', options: ['will be studying', 'will study', 'am studying', 'study'] },
      ],
    },
    'future-perfect': {
      type: 'fill-in',
      instruction: 'Fill in with the future perfect form.',
      items: [
        { sentence: 'By next year, I ___ (finish) my degree.', answer: 'will have finished', options: ['will have finished', 'will finish', 'have finished', 'finish'] },
        { sentence: 'She ___ (leave) by the time you arrive.', answer: 'will have left', options: ['will have left', 'will leave', 'has left', 'leaves'] },
        { sentence: 'By 2030, they ___ (build) the new bridge.', answer: 'will have built', options: ['will have built', 'will build', 'have built', 'build'] },
        { sentence: 'I ___ (read) 50 books by December.', answer: 'will have read', options: ['will have read', 'will read', 'have read', 'read'] },
        { sentence: 'We ___ (not/finish) by then.', answer: "won't have finished", options: ["won't have finished", "won't finish", "haven't finished", "don't finish"] },
        { sentence: 'By Friday, he ___ (work) here for 10 years.', answer: 'will have worked', options: ['will have worked', 'will work', 'has worked', 'works'] },
      ],
    },
    'third-conditional': {
      type: 'fill-in',
      instruction: 'Complete the third conditional sentence.',
      items: [
        { sentence: 'If I ___ (know), I would have told you.', answer: 'had known', options: ['had known', 'knew', 'would know', 'have known'] },
        { sentence: 'If she had studied, she ___ (pass).', answer: 'would have passed', options: ['would have passed', 'would pass', 'passed', 'had passed'] },
        { sentence: 'We ___ (not/miss) the train if we had left earlier.', answer: "wouldn't have missed", options: ["wouldn't have missed", "wouldn't miss", "didn't miss", "hadn't missed"] },
        { sentence: 'If they ___ (invite) me, I would have gone.', answer: 'had invited', options: ['had invited', 'invited', 'would invite', 'have invited'] },
        { sentence: 'He ___ (not/get) the job if he hadn\'t prepared.', answer: "wouldn't have gotten", options: ["wouldn't have gotten", "wouldn't get", "didn't get", "hadn't gotten"] },
        { sentence: 'If it ___ (not/rain), we would have had a picnic.', answer: "hadn't rained", options: ["hadn't rained", "didn't rain", "wouldn't rain", "hasn't rained"] },
      ],
    },
    'mixed-conditionals': {
      type: 'fill-in',
      instruction: 'Complete the mixed conditional sentence.',
      items: [
        { sentence: 'If I ___ (be) taller, I would have joined the team. (general → past)', answer: 'were', options: ['were', 'had been', 'was', 'would be'] },
        { sentence: 'If she had taken the job, she ___ (live) in New York now. (past → present)', answer: 'would be living', options: ['would be living', 'would have lived', 'lived', 'had lived'] },
        { sentence: 'If he ___ (not/break) his leg, he would be playing now.', answer: "hadn't broken", options: ["hadn't broken", "didn't break", "wouldn't break", "hasn't broken"] },
        { sentence: 'If I ___ (speak) French, I would have gotten that job.', answer: 'spoke', options: ['spoke', 'had spoken', 'speak', 'would speak'] },
        { sentence: 'If we had saved money, we ___ (be) rich now.', answer: 'would be', options: ['would be', 'would have been', 'were', 'had been'] },
        { sentence: 'If she ___ (be) more careful, she wouldn\'t have crashed.', answer: 'were', options: ['were', 'had been', 'was', 'would be'] },
      ],
    },
    'advanced-passive': {
      type: 'transformation',
      instruction: 'Rewrite in the passive voice.',
      items: [
        { prompt: 'They are building a new hospital.', answer: 'A new hospital is being built.' },
        { prompt: 'Someone had already told her.', answer: 'She had already been told.' },
        { prompt: 'They will complete the project tomorrow.', answer: 'The project will be completed tomorrow.' },
        { prompt: 'People believe he is innocent.', answer: 'He is believed to be innocent.' },
        { prompt: 'They should have informed us.', answer: 'We should have been informed.' },
        { prompt: 'They have repaired the road.', answer: 'The road has been repaired.' },
      ],
    },
    'causative-have-get': {
      type: 'transformation',
      instruction: 'Rewrite using the causative (have/get something done).',
      items: [
        { prompt: 'A mechanic repaired my car.', answer: 'I had my car repaired.' },
        { prompt: 'A hairdresser cut her hair.', answer: 'She had her hair cut.' },
        { prompt: 'A painter painted their house.', answer: 'They had their house painted.' },
        { prompt: 'A dentist checked his teeth.', answer: 'He had his teeth checked.' },
        { prompt: 'A tailor shortened my trousers.', answer: 'I had my trousers shortened.' },
        { prompt: 'An electrician fixed the wiring.', answer: 'We had the wiring fixed.' },
      ],
    },
    'reported-questions': {
      type: 'transformation',
      instruction: 'Change to reported speech.',
      items: [
        { prompt: '"Where do you live?" she asked.', answer: 'She asked where I lived.' },
        { prompt: '"Are you coming?" he asked.', answer: 'He asked if I was coming.' },
        { prompt: '"What time does the train leave?" she asked.', answer: 'She asked what time the train left.' },
        { prompt: '"Do you like coffee?" he asked.', answer: 'He asked if I liked coffee.' },
        { prompt: '"Why are you late?" she asked.', answer: 'She asked why I was late.' },
        { prompt: '"Have you finished?" he asked.', answer: 'He asked if I had finished.' },
      ],
    },
    'reported-commands': {
      type: 'transformation',
      instruction: 'Change to reported speech.',
      items: [
        { prompt: '"Close the door," she said.', answer: 'She told me to close the door.' },
        { prompt: '"Don\'t touch that," he said.', answer: 'He told me not to touch that.' },
        { prompt: '"Sit down," the teacher said.', answer: 'The teacher told us to sit down.' },
        { prompt: '"Please help me," she said.', answer: 'She asked me to help her.' },
        { prompt: '"Don\'t be late," he said.', answer: 'He told me not to be late.' },
        { prompt: '"Wait here," she said.', answer: 'She told me to wait there.' },
      ],
    },
    'wish-past': {
      type: 'transformation',
      instruction: 'Complete the wish sentence about the present.',
      items: [
        { prompt: 'I don\'t speak French. I wish...', answer: 'I wish I spoke French.' },
        { prompt: 'She is not here. I wish...', answer: 'I wish she were here.' },
        { prompt: 'It rains a lot. I wish...', answer: "I wish it didn't rain so much." },
        { prompt: 'I don\'t have a car. I wish...', answer: 'I wish I had a car.' },
        { prompt: 'He is always late. I wish...', answer: "He wishes he weren't always late." },
        { prompt: 'We live in a small flat. We wish...', answer: "We wish we didn't live in a small flat." },
      ],
    },
    'wish-past-perfect': {
      type: 'transformation',
      instruction: 'Complete the wish sentence about the past.',
      items: [
        { prompt: 'I didn\'t study. I wish...', answer: 'I wish I had studied.' },
        { prompt: 'She told him. She wishes...', answer: "She wishes she hadn't told him." },
        { prompt: 'We missed the flight. We wish...', answer: "We wish we hadn't missed the flight." },
        { prompt: 'I ate too much. I wish...', answer: "I wish I hadn't eaten so much." },
        { prompt: 'He didn\'t come. I wish...', answer: 'I wish he had come.' },
        { prompt: 'They sold the house. They wish...', answer: "They wish they hadn't sold the house." },
      ],
    },
    'if-only': {
      type: 'fill-in',
      instruction: 'Complete the sentence with the correct form.',
      items: [
        { sentence: 'If only I ___ (have) more time!', answer: 'had', options: ['had', 'have', 'would have', 'had had'] },
        { sentence: 'If only she ___ (not/leave) yesterday.', answer: "hadn't left", options: ["hadn't left", "didn't leave", "wouldn't leave", "hasn't left"] },
        { sentence: 'If only it ___ (stop) raining!', answer: 'would stop', options: ['would stop', 'stopped', 'stops', 'had stopped'] },
        { sentence: 'If only I ___ (know) about it sooner.', answer: 'had known', options: ['had known', 'knew', 'know', 'would know'] },
        { sentence: 'If only we ___ (be) there!', answer: 'were', options: ['were', 'are', 'had been', 'would be'] },
        { sentence: 'If only he ___ (listen) to me!', answer: 'would listen', options: ['would listen', 'listened', 'listens', 'had listened'] },
      ],
    },
  },
  'c1': {
    'inversion-negative': {
      type: 'transformation',
      instruction: 'Rewrite starting with the underlined word/phrase (inversion).',
      items: [
        { prompt: 'I have never seen such beauty. → Never...', answer: 'Never have I seen such beauty.' },
        { prompt: 'She rarely goes out. → Rarely...', answer: 'Rarely does she go out.' },
        { prompt: 'I had hardly sat down when the phone rang. → Hardly...', answer: 'Hardly had I sat down when the phone rang.' },
        { prompt: 'He not only lied but also stole. → Not only...', answer: 'Not only did he lie, but he also stole.' },
        { prompt: 'We little knew what would happen. → Little...', answer: 'Little did we know what would happen.' },
        { prompt: 'She had no sooner arrived than it started raining. → No sooner...', answer: 'No sooner had she arrived than it started raining.' },
      ],
    },
    'cleft-sentences': {
      type: 'transformation',
      instruction: 'Rewrite as a cleft sentence for emphasis.',
      items: [
        { prompt: 'John broke the window. (emphasize John)', answer: 'It was John who broke the window.' },
        { prompt: 'She needs a holiday. (emphasize a holiday)', answer: 'What she needs is a holiday.' },
        { prompt: 'I don\'t like his attitude. (emphasize his attitude)', answer: "It's his attitude that I don't like." },
        { prompt: 'They left on Friday. (emphasize Friday)', answer: 'It was on Friday that they left.' },
        { prompt: 'She wants to travel. (emphasize to travel)', answer: 'What she wants is to travel.' },
        { prompt: 'The noise bothers me. (emphasize the noise)', answer: "It's the noise that bothers me." },
      ],
    },
    'participle-clauses': {
      type: 'transformation',
      instruction: 'Rewrite using a participle clause.',
      items: [
        { prompt: 'Because she was tired, she went to bed early.', answer: 'Being tired, she went to bed early.' },
        { prompt: 'After he finished work, he went home.', answer: 'Having finished work, he went home.' },
        { prompt: 'Because it was built in 1900, the house needs repairs.', answer: 'Built in 1900, the house needs repairs.' },
        { prompt: 'While she was walking home, she saw a fox.', answer: 'Walking home, she saw a fox.' },
        { prompt: 'Because he had not eaten all day, he was starving.', answer: 'Not having eaten all day, he was starving.' },
        { prompt: 'Since the book was written in French, I couldn\'t read it.', answer: "Written in French, I couldn't read it." },
      ],
    },
    'modal-perfect-deduction': {
      type: 'fill-in',
      instruction: 'Fill in with must have, can\'t have, might have, or could have.',
      items: [
        { sentence: 'She ___ (pass) — she studied so hard!', answer: 'must have passed', options: ['must have passed', "can't have passed", 'might have passed', 'could have passed'] },
        { sentence: 'He ___ (be) at the party — he was in hospital.', answer: "can't have been", options: ['must have been', "can't have been", 'might have been', 'could have been'] },
        { sentence: 'I\'m not sure, but she ___ (leave) early.', answer: 'might have left', options: ['must have left', "can't have left", 'might have left', 'should have left'] },
        { sentence: 'The road is wet. It ___ (rain) last night.', answer: 'must have rained', options: ['must have rained', "can't have rained", 'might have rained', 'should have rained'] },
        { sentence: 'He ___ (forget). He always remembers.', answer: "can't have forgotten", options: ['must have forgotten', "can't have forgotten", 'might have forgotten', 'should have forgotten'] },
        { sentence: 'She ___ (take) a taxi — I\'m not sure how she got here.', answer: 'could have taken', options: ['must have taken', "can't have taken", 'could have taken', 'should have taken'] },
      ],
    },
    'modal-continuous': {
      type: 'fill-in',
      instruction: 'Fill in with the correct modal + continuous form.',
      items: [
        { sentence: 'She ___ (work) — the light in her office is on.', answer: 'must be working', options: ['must be working', "can't be working", 'might be working', 'should be working'] },
        { sentence: 'He ___ (sleep) — I can hear music from his room.', answer: "can't be sleeping", options: ['must be sleeping', "can't be sleeping", 'might be sleeping', 'should be sleeping'] },
        { sentence: 'They ___ (wait) for us. Let\'s hurry.', answer: 'might be waiting', options: ['must be waiting', "can't be waiting", 'might be waiting', 'should be waiting'] },
        { sentence: 'You ___ (joke)! That\'s impossible!', answer: 'must be joking', options: ['must be joking', "can't be joking", 'might be joking', 'should be joking'] },
        { sentence: 'She ___ (study) — the exam is tomorrow.', answer: 'should be studying', options: ['must be studying', "can't be studying", 'might be studying', 'should be studying'] },
        { sentence: 'He ___ (lie). His story doesn\'t make sense.', answer: 'could be lying', options: ['must be lying', "can't be lying", 'could be lying', 'should be lying'] },
      ],
    },
    'discourse-markers': {
      type: 'fill-in',
      instruction: 'Fill in with the appropriate discourse marker.',
      items: [
        { sentence: '___, the results were surprising.', answer: 'On the whole', options: ['On the whole', 'In contrast', 'Furthermore', 'Nevertheless'] },
        { sentence: 'The project was difficult. ___, we finished on time.', answer: 'Nevertheless', options: ['Furthermore', 'Nevertheless', 'In addition', 'On the whole'] },
        { sentence: '___ to the cost, the project had quality issues.', answer: 'In addition', options: ['In contrast', 'Nevertheless', 'In addition', 'On the whole'] },
        { sentence: 'Urban areas are crowded. ___, rural areas are sparsely populated.', answer: 'In contrast', options: ['In contrast', 'Furthermore', 'In addition', 'Nevertheless'] },
        { sentence: '___, I believe this is the best approach.', answer: 'All things considered', options: ['All things considered', 'In contrast', 'Furthermore', 'Nevertheless'] },
        { sentence: 'She is talented. ___, she is hardworking.', answer: 'Furthermore', options: ['In contrast', 'Nevertheless', 'Furthermore', 'On the whole'] },
      ],
    },
    'advanced-linking': {
      type: 'fill-in',
      instruction: 'Fill in with the correct linking word/phrase.',
      items: [
        { sentence: '___ the rain, we went for a walk.', answer: 'Despite', options: ['Despite', 'Because of', 'Due to', 'Owing to'] },
        { sentence: 'The event was cancelled ___ bad weather.', answer: 'due to', options: ['despite', 'in spite of', 'due to', 'although'] },
        { sentence: '___ she was ill, she came to work.', answer: 'Although', options: ['Although', 'Because', 'Since', 'Due to'] },
        { sentence: '___ to the delay, the project was extended.', answer: 'Owing', options: ['Owing', 'Despite', 'Although', 'Whereas'] },
        { sentence: 'He passed ___ working very little.', answer: 'despite', options: ['despite', 'because of', 'due to', 'owing to'] },
        { sentence: '___ it is expensive, it is worth buying.', answer: 'Even though', options: ['Even though', 'Because', 'Due to', 'Despite'] },
      ],
    },
    'nominal-that-clauses': {
      type: 'transformation',
      instruction: 'Combine into one sentence using a that-clause.',
      items: [
        { prompt: 'She is innocent. Everyone believes it.', answer: 'Everyone believes that she is innocent.' },
        { prompt: 'He will come. It is certain.', answer: 'It is certain that he will come.' },
        { prompt: 'The plan works. She suggested it.', answer: 'She suggested that the plan works.' },
        { prompt: 'They are leaving. It is obvious.', answer: 'It is obvious that they are leaving.' },
        { prompt: 'We should act now. I propose it.', answer: 'I propose that we should act now.' },
        { prompt: 'He was lying. It became clear.', answer: 'It became clear that he was lying.' },
      ],
    },
    'wh-noun-clauses': {
      type: 'transformation',
      instruction: 'Rewrite using a wh-noun clause.',
      items: [
        { prompt: 'Where did she go? I don\'t know.', answer: "I don't know where she went." },
        { prompt: 'What happened? Nobody knows.', answer: 'Nobody knows what happened.' },
        { prompt: 'Why did he leave? Tell me.', answer: 'Tell me why he left.' },
        { prompt: 'How does this work? I wonder.', answer: 'I wonder how this works.' },
        { prompt: 'Who called? She asked.', answer: 'She asked who called.' },
        { prompt: 'When will they arrive? We don\'t know.', answer: "We don't know when they will arrive." },
      ],
    },
    'formal-subjunctive': {
      type: 'fill-in',
      instruction: 'Fill in the subjunctive form.',
      items: [
        { sentence: 'The committee recommended that he ___ (attend).', answer: 'attend', options: ['attend', 'attends', 'attended', 'would attend'] },
        { sentence: 'It is essential that she ___ (be) present.', answer: 'be', options: ['be', 'is', 'was', 'were'] },
        { sentence: 'He insisted that the report ___ (be) finished.', answer: 'be', options: ['be', 'is', 'was', 'would be'] },
        { sentence: 'They demanded that he ___ (resign).', answer: 'resign', options: ['resign', 'resigns', 'resigned', 'would resign'] },
        { sentence: 'It is vital that everyone ___ (know) the rules.', answer: 'know', options: ['know', 'knows', 'knew', 'would know'] },
        { sentence: 'She suggested that we ___ (leave) early.', answer: 'leave', options: ['leave', 'leaves', 'left', 'would leave'] },
      ],
    },
    'were-to': {
      type: 'fill-in',
      instruction: 'Complete with "were to" constructions.',
      items: [
        { sentence: 'If I ___ to lose my job, I\'d move abroad.', answer: 'were', options: ['were', 'was', 'would be', 'am'] },
        { sentence: 'If she ___ to find out, she\'d be furious.', answer: 'were', options: ['were', 'was', 'would be', 'is'] },
        { sentence: 'If they ___ to offer me the job, I\'d accept.', answer: 'were', options: ['were', 'was', 'would be', 'are'] },
        { sentence: 'If the economy ___ to collapse, many would suffer.', answer: 'were', options: ['were', 'was', 'would be', 'is'] },
        { sentence: 'If we ___ to start over, what would we change?', answer: 'were', options: ['were', 'was', 'would be', 'are'] },
        { sentence: 'If he ___ to apologize, would you forgive him?', answer: 'were', options: ['were', 'was', 'would be', 'is'] },
      ],
    },
  },
  'c2': {
    'fronting': {
      type: 'transformation',
      instruction: 'Rewrite the sentence using fronting for emphasis.',
      items: [
        { prompt: 'The view was stunning.', answer: 'Stunning was the view.' },
        { prompt: 'His dedication is remarkable.', answer: 'Remarkable is his dedication.' },
        { prompt: 'A small cottage stood at the end of the lane.', answer: 'At the end of the lane stood a small cottage.' },
        { prompt: 'The sound of music came from the room.', answer: 'From the room came the sound of music.' },
        { prompt: 'The real problem lies here.', answer: 'Here lies the real problem.' },
        { prompt: 'A great oak tree stood in the middle of the field.', answer: 'In the middle of the field stood a great oak tree.' },
      ],
    },
    'extraposition': {
      type: 'transformation',
      instruction: 'Rewrite using extraposition (It... construction).',
      items: [
        { prompt: 'That he lied is obvious.', answer: 'It is obvious that he lied.' },
        { prompt: 'To learn a language takes time.', answer: 'It takes time to learn a language.' },
        { prompt: 'That she will win seems likely.', answer: 'It seems likely that she will win.' },
        { prompt: 'Whether he agrees doesn\'t matter.', answer: "It doesn't matter whether he agrees." },
        { prompt: 'To complete this by Friday will be difficult.', answer: 'It will be difficult to complete this by Friday.' },
        { prompt: 'That they survived was a miracle.', answer: 'It was a miracle that they survived.' },
      ],
    },
    'ellipsis-substitution': {
      type: 'fill-in',
      instruction: 'Complete the response using ellipsis or substitution.',
      items: [
        { sentence: '"Are you coming?" "I hope ___."', answer: 'so', options: ['so', 'it', 'that', 'to'] },
        { sentence: '"Will it rain?" "I don\'t think ___."', answer: 'so', options: ['so', 'it', 'that', 'this'] },
        { sentence: '"She passed!" "Yes, I believe ___."', answer: 'so', options: ['so', 'it', 'that', 'too'] },
        { sentence: '"Is he leaving?" "It seems ___."', answer: 'so', options: ['so', 'it', 'that', 'like'] },
        { sentence: '"He likes jazz." "So ___ I."', answer: 'do', options: ['do', 'am', 'like', 'does'] },
        { sentence: '"She can\'t swim." "Neither ___ I."', answer: 'can', options: ['can', 'do', 'am', 'could'] },
      ],
    },
    'theme-rheme': {
      type: 'classify',
      instruction: 'Identify the theme (T) and rheme (R) in the sentence. What is the theme?',
      items: [
        { sentence: 'The government has announced new measures.', answer: 'The government', explanation: 'The government = theme (known info); has announced new measures = rheme (new info)' },
        { sentence: 'In the morning, we set off for the mountains.', answer: 'In the morning', explanation: 'Marked theme — adverbial fronted for context' },
        { sentence: 'What concerned us was the lack of progress.', answer: 'What concerned us', explanation: 'Thematic equative — wh-clause as theme' },
        { sentence: 'It was John who broke the vase.', answer: 'It', explanation: 'Cleft sentence — existential theme, focus on John' },
        { sentence: 'Rarely do we see such talent.', answer: 'Rarely', explanation: 'Marked theme via inversion for emphasis' },
        { sentence: 'There seems to be a problem.', answer: 'There', explanation: 'Existential theme — introduces new information' },
      ],
    },
    'cohesion-devices': {
      type: 'fill-in',
      instruction: 'Choose the best cohesion device.',
      items: [
        { sentence: 'The project succeeded. ___ was largely due to teamwork.', answer: 'This', options: ['This', 'It', 'That', 'Which'] },
        { sentence: 'Sales rose in Q1. ___, profits declined.', answer: 'However', options: ['However', 'Therefore', 'Moreover', 'Furthermore'] },
        { sentence: 'We hired two analysts. The ___ had more experience.', answer: 'former', options: ['former', 'latter', 'first', 'other'] },
        { sentence: 'She proposed a new approach. ___ doing so, she challenged convention.', answer: 'In', options: ['In', 'By', 'For', 'With'] },
        { sentence: 'The results were poor. ___ were they unexpected.', answer: 'Nor', options: ['Nor', 'Neither', 'Not', 'And'] },
        { sentence: 'He made several points, the most important of ___ was funding.', answer: 'which', options: ['which', 'them', 'that', 'those'] },
      ],
    },
    'register-shifting': {
      type: 'transformation',
      instruction: 'Rewrite the sentence in the indicated register.',
      items: [
        { prompt: 'Gonna grab some food. → Formal', answer: 'I intend to get something to eat.' },
        { prompt: 'The committee has resolved to terminate the contract. → Informal', answer: "They've decided to end the deal." },
        { prompt: 'It is imperative that action be taken. → Neutral', answer: 'We need to take action.' },
        { prompt: 'The data suggests a correlation. → Informal', answer: 'The numbers seem to be connected.' },
        { prompt: "Can't make it tonight. → Formal", answer: 'I regret that I am unable to attend this evening.' },
        { prompt: 'Your attendance is required. → Informal', answer: 'You need to be there.' },
      ],
    },
    'hedging-modals': {
      type: 'fill-in',
      instruction: 'Choose the most appropriate hedging expression.',
      items: [
        { sentence: 'The results ___ indicate a trend.', answer: 'would seem to', options: ['would seem to', 'definitely', 'certainly', 'obviously'] },
        { sentence: 'This ___ be attributed to external factors.', answer: 'could', options: ['could', 'must', 'will', 'shall'] },
        { sentence: 'It is ___ the case that further research is needed.', answer: 'arguably', options: ['arguably', 'definitely', 'certainly', 'obviously'] },
        { sentence: 'The evidence ___ supports this hypothesis.', answer: 'tentatively', options: ['tentatively', 'absolutely', 'completely', 'undoubtedly'] },
        { sentence: 'One ___ argue that the policy has failed.', answer: 'might', options: ['might', 'must', 'shall', 'will'] },
        { sentence: 'There appears to be ___ connection between the variables.', answer: 'some', options: ['some', 'a definite', 'an absolute', 'an obvious'] },
      ],
    },
    'distancing': {
      type: 'transformation',
      instruction: 'Rewrite using a distancing strategy.',
      items: [
        { prompt: 'He is guilty. → Use "It is said..."', answer: 'It is said that he is guilty.' },
        { prompt: 'The economy will crash. → Use "It is claimed..."', answer: 'It is claimed that the economy will crash.' },
        { prompt: 'She stole the money. → Use "allegedly"', answer: 'She allegedly stole the money.' },
        { prompt: 'This method works. → Use "appear to"', answer: 'This method appears to work.' },
        { prompt: 'They are responsible. → Use "It has been suggested..."', answer: 'It has been suggested that they are responsible.' },
        { prompt: 'The drug cures cancer. → Use "is thought to"', answer: 'The drug is thought to cure cancer.' },
      ],
    },
    'emphasis-patterns': {
      type: 'transformation',
      instruction: 'Rewrite for stronger emphasis.',
      items: [
        { prompt: 'I enjoyed the concert very much.', answer: 'I absolutely loved the concert.' },
        { prompt: 'The proposal is interesting.', answer: 'The proposal is nothing short of fascinating.' },
        { prompt: 'He helped a lot.', answer: 'He was instrumental in helping.' },
        { prompt: 'This is important.', answer: 'This is of paramount importance.' },
        { prompt: 'She worked hard.', answer: 'She worked tirelessly.' },
        { prompt: 'The results are good.', answer: 'The results are exceptionally good.' },
      ],
    },
  },
};

// File I/O

function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }

function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }

function loadProfile(id) {
  const fp = profilePath(id);
  if (fs.existsSync(fp)) {
    try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
    catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); }
  }
  return { studentId: id, level: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
}

function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }

// Helpers

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

function resolveSkillKey(level, skill) {
  const ls = SKILLS[level];
  if (!ls) return null;
  for (const [cat, skills] of Object.entries(ls)) { if (skills.includes(skill)) return { level, category: cat, skill }; }
  return null;
}

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

// Exercise generation

function exResult(type, skill, level, instruction, items) { return { type, skill, level, count: items.length, instruction, items }; }

function generateExercise(level, skill, count = 5) {
  const bank = ITEM_BANKS[level]?.[skill];
  if (!bank) return { error: `No item bank for ${level}/${skill}` };

  const items = pick(bank.items, count);
  return exResult(bank.type, skill, level, bank.instruction, items);
}

// Answer checking

function checkAnswer(type, expected, answer) {
  if (type === 'classify') return norm(expected) === norm(answer);
  return norm(expected) === norm(answer);
}

// Public API

class Grammar {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, level: p.level, createdAt: p.createdAt, totalAssessments: p.assessments.length };
  }

  setLevel(id, level) {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    const p = loadProfile(id); p.level = level; saveProfile(p);
    return { studentId: id, level };
  }

  recordAssessment(id, level, category, skill, score, total, notes = '') {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}`);
    if (!SKILLS[level][category]) throw new Error(`Unknown category '${category}' for ${level}`);
    if (!SKILLS[level][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${level}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);

    const p = loadProfile(id);
    if (!p.level) p.level = level;
    const entry = { date: new Date().toISOString(), level, category, skill, score, total, notes };
    p.assessments.push(entry);
    const key = `${level}/${category}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p);
    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const level = p.level || 'a1';
    const ls = SKILLS[level] || {};
    const results = {};
    let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(ls)) {
      results[cat] = {};
      for (const sk of skills) {
        total++;
        const d = p.skills[`${level}/${cat}/${sk}`];
        results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
      }
    }
    return { studentId: id, level, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id);
    const level = p.level || 'a1';
    const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS[level] || {})) {
      for (const sk of skills) {
        const d = p.skills[`${level}/${cat}/${sk}`];
        const m = d ? d.mastery : 0;
        if (m < MASTERY_THRESHOLD) candidates.push({ level, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' });
      }
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, level, next: candidates.slice(0, count) };
  }

  getReport(id) {
    const p = loadProfile(id);
    return { studentId: id, level: p.level, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }

  getSkillCatalog(level) {
    const ls = SKILLS[level];
    if (!ls) return { level, error: `Unknown level. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0;
    const catalog = {};
    for (const [cat, skills] of Object.entries(ls)) { total += skills.length; catalog[cat] = [...skills]; }
    return { level, skills: catalog, totalSkills: total };
  }

  generateExercise(level, skill, count = 5) { return generateExercise(level, skill, count); }

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  generateLesson(id) {
    const p = loadProfile(id);
    const level = p.level || 'a1';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Ready for next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    return {
      studentId: id, level, targetSkill: target, exercise,
      lessonPlan: {
        discover: `Show 3-4 example sentences demonstrating: ${target.category} → ${target.skill}`,
        confirm: 'Ask: "What pattern do you notice?" — guide to rule statement',
        practice: `Complete ${exercise.count || 0} practice items`,
        produce: 'Free production: write 2-3 original sentences using the pattern',
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
        const [, id, level] = args;
        if (!id) throw new Error('Usage: start <id> [level]');
        if (level) gr.setLevel(id, level);
        out({ action: 'start', profile: gr.getProfile(id), nextSkills: gr.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(gr.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const level = loadProfile(id).level || 'a1';
        if (skill) { out(gr.generateExercise(level, skill, 5)); }
        else { const n = gr.getNextSkills(id, 1).next; out(n.length ? gr.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient at current level!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(gr.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, level, cat, skill, sc, tot, ...notes] = args;
        if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total> [notes]');
        out(gr.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(gr.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(gr.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(gr.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? gr.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(gr.setLevel(id, l)); break; }
      case 'students': { out(gr.listStudents()); break; }
      default: out({ usage: 'node grammar.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
