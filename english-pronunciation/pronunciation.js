// English Pronunciation Lab (A1-C2). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'english-pronunciation');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'a1': {
    'vowels': ['short-vowels', 'long-vowels', 'vowel-contrast-basic'],
    'consonants': ['voiced-voiceless-basic', 'consonant-sounds-basic', 'final-consonants'],
    'word-stress': ['two-syllable-stress', 'number-stress', 'question-intonation-basic'],
  },
  'a2': {
    'consonant-clusters': ['initial-clusters', 'final-clusters', 'cluster-simplification'],
    'endings': ['ed-endings', 's-endings', 'syllable-counting'],
    'sentence-prosody': ['sentence-stress-basic', 'thought-groups-basic', 'rising-falling-basic'],
  },
  'b1': {
    'minimal-pairs': ['vowel-minimal-pairs', 'consonant-minimal-pairs', 'near-minimal-pairs'],
    'weak-forms': ['articles-weak', 'auxiliaries-weak', 'prepositions-weak'],
    'connected-speech': ['linking-consonant-vowel', 'schwa-intro', 'rhythm-basics'],
  },
  'b2': {
    'stress-patterns': ['contrastive-stress', 'compound-stress', 'stress-shift'],
    'intonation': ['intonation-meaning', 'tag-questions', 'listing-intonation'],
    'connected-speech': ['elision', 'assimilation', 'intrusive-sounds'],
  },
  'c1': {
    'discourse-prosody': ['discourse-intonation', 'new-vs-given-info', 'prominence-focus'],
    'attitude': ['attitude-intonation', 'emotion-prosody', 'sarcasm-irony-tone'],
    'style': ['formal-vs-casual-speech', 'speech-rate-control', 'pause-placement'],
  },
  'c2': {
    'rhetorical-prosody': ['persuasive-prosody', 'rhetorical-pacing', 'climax-intonation'],
    'regional-awareness': ['accent-variation', 'dialect-features', 'global-englishes'],
    'advanced-connected': ['rapid-speech-decoding', 'coarticulation', 'prosodic-style-shifting'],
  },
};

const ITEM_BANKS = {
  'a1': {
    'short-vowels': {
      type: 'phoneme-id', instruction: 'Choose the word that has a different vowel sound from the others.',
      items: [
        { prompt: 'Which word has a different vowel sound?', focus: '/æ/ vs /e/', answer: 'bed', options: ['cat', 'hat', 'bed', 'man'] },
        { prompt: 'Which word has a different vowel sound?', focus: '/ɪ/ vs /iː/', answer: 'sheep', options: ['sit', 'hit', 'sheep', 'bit'] },
        { prompt: 'Which word has a different vowel sound?', focus: '/ɒ/ vs /ʌ/', answer: 'cup', options: ['hot', 'dog', 'cup', 'not'] },
        { prompt: 'Which word has a different vowel sound?', focus: '/ʊ/ vs /uː/', answer: 'food', options: ['book', 'look', 'food', 'cook'] },
        { prompt: 'Which word has a different vowel sound?', focus: '/e/ vs /æ/', answer: 'hat', options: ['bed', 'red', 'hat', 'said'] },
        { prompt: 'Which word has a different vowel sound?', focus: '/ɪ/ vs /e/', answer: 'pen', options: ['sit', 'hit', 'pen', 'bit'] },
      ],
    },
    'long-vowels': {
      type: 'phoneme-id', instruction: 'Choose the word that has a different vowel sound.',
      items: [
        { prompt: 'Which word has a different vowel sound?', focus: '/iː/ vs /ɪ/', answer: 'hit', options: ['see', 'tree', 'hit', 'be'] },
        { prompt: 'Which word has a different vowel sound?', focus: '/ɑː/ vs /æ/', answer: 'cat', options: ['car', 'star', 'cat', 'far'] },
        { prompt: 'Which word has a different vowel sound?', focus: '/ɔː/ vs /ɒ/', answer: 'hot', options: ['door', 'four', 'hot', 'more'] },
        { prompt: 'Which word has a different vowel sound?', focus: '/uː/ vs /ʊ/', answer: 'good', options: ['blue', 'true', 'good', 'shoe'] },
        { prompt: 'Which word has a different vowel sound?', focus: '/ɜː/ vs /e/', answer: 'bed', options: ['bird', 'word', 'bed', 'nurse'] },
        { prompt: 'Which word has a different vowel sound?', focus: '/iː/ vs /e/', answer: 'red', options: ['see', 'tea', 'red', 'key'] },
      ],
    },
    'vowel-contrast-basic': {
      type: 'minimal-pair', instruction: 'Choose the correct word you hear in the sentence.',
      items: [
        { prompt: '"I need to ___ the letter." (ship or sheep?)', focus: '/ɪ/ vs /iː/', answer: 'ship', options: ['ship', 'sheep'] },
        { prompt: '"Please sit in this ___." (sit or seat?)', focus: '/ɪ/ vs /iː/', answer: 'seat', options: ['sit', 'seat'] },
        { prompt: '"He has a ___." (cap or cup?)', focus: '/æ/ vs /ʌ/', answer: 'cap', options: ['cap', 'cup'] },
        { prompt: '"Look at the ___." (man or men?)', focus: '/æ/ vs /e/', answer: 'men', options: ['man', 'men'] },
        { prompt: '"The ___ is hot." (pot or put?)', focus: '/ɒ/ vs /ʊ/', answer: 'pot', options: ['pot', 'put'] },
        { prompt: '"I like this ___." (hat or hut?)', focus: '/æ/ vs /ʌ/', answer: 'hat', options: ['hat', 'hut'] },
      ],
    },
    'voiced-voiceless-basic': {
      type: 'classify', instruction: 'Classify the initial consonant as voiced or voiceless.',
      items: [
        { prompt: 'The first sound in "bat"', answer: 'voiced', options: ['voiced', 'voiceless'] },
        { prompt: 'The first sound in "pat"', answer: 'voiceless', options: ['voiced', 'voiceless'] },
        { prompt: 'The first sound in "dog"', answer: 'voiced', options: ['voiced', 'voiceless'] },
        { prompt: 'The first sound in "top"', answer: 'voiceless', options: ['voiced', 'voiceless'] },
        { prompt: 'The first sound in "go"', answer: 'voiced', options: ['voiced', 'voiceless'] },
        { prompt: 'The first sound in "cat"', answer: 'voiceless', options: ['voiced', 'voiceless'] },
      ],
    },
    'consonant-sounds-basic': {
      type: 'phoneme-id', instruction: 'Choose the word that starts with a different sound.',
      items: [
        { prompt: 'Which word starts with a different sound?', focus: '/θ/ vs /t/', answer: 'thin', options: ['top', 'ten', 'thin', 'two'] },
        { prompt: 'Which word starts with a different sound?', focus: '/ʃ/ vs /s/', answer: 'ship', options: ['sun', 'sit', 'ship', 'see'] },
        { prompt: 'Which word starts with a different sound?', focus: '/v/ vs /b/', answer: 'very', options: ['big', 'bed', 'very', 'bus'] },
        { prompt: 'Which word starts with a different sound?', focus: '/w/ vs /v/', answer: 'vine', options: ['wet', 'win', 'vine', 'wash'] },
        { prompt: 'Which word starts with a different sound?', focus: '/dʒ/ vs /j/', answer: 'jam', options: ['yes', 'you', 'jam', 'yet'] },
        { prompt: 'Which word starts with a different sound?', focus: '/tʃ/ vs /ʃ/', answer: 'chair', options: ['she', 'shoe', 'chair', 'shop'] },
      ],
    },
    'final-consonants': {
      type: 'phoneme-id', instruction: 'Choose the word that ends with a different sound.',
      items: [
        { prompt: 'Which word ends with a different sound?', focus: '/d/ vs /t/', answer: 'played', options: ['cat', 'hat', 'played', 'sit'] },
        { prompt: 'Which word ends with a different sound?', focus: '/z/ vs /s/', answer: 'dogs', options: ['cats', 'hats', 'dogs', 'books'] },
        { prompt: 'Which word ends with a different sound?', focus: '/n/ vs /ŋ/', answer: 'sing', options: ['run', 'sun', 'sing', 'ten'] },
        { prompt: 'Which word ends with a different sound?', focus: '/k/ vs /g/', answer: 'dog', options: ['back', 'look', 'dog', 'book'] },
        { prompt: 'Which word ends with a different sound?', focus: '/θ/ vs /t/', answer: 'bath', options: ['cat', 'hat', 'bath', 'sit'] },
        { prompt: 'Which word ends with a different sound?', focus: '/v/ vs /f/', answer: 'love', options: ['off', 'half', 'love', 'leaf'] },
      ],
    },
    'two-syllable-stress': {
      type: 'stress-id', instruction: 'Which syllable is stressed? Choose first or second.',
      items: [
        { prompt: 'TAble', answer: 'first', options: ['first', 'second'] },
        { prompt: 'aLONE', answer: 'second', options: ['first', 'second'] },
        { prompt: 'HAPpy', answer: 'first', options: ['first', 'second'] },
        { prompt: 'beFORE', answer: 'second', options: ['first', 'second'] },
        { prompt: 'WAter', answer: 'first', options: ['first', 'second'] },
        { prompt: 'aWAY', answer: 'second', options: ['first', 'second'] },
      ],
    },
    'number-stress': {
      type: 'minimal-pair', instruction: 'Choose the correct number based on the stress pattern.',
      items: [
        { prompt: 'THIRteen or THIRty? (stress on FIRST syllable)', focus: '-teen vs -ty', answer: 'thirty', options: ['thirteen', 'thirty'] },
        { prompt: 'fifTEEN or FIFty? (stress on SECOND syllable)', focus: '-teen vs -ty', answer: 'fifteen', options: ['fifteen', 'fifty'] },
        { prompt: 'fourTEEN or FORty? (stress on SECOND syllable)', focus: '-teen vs -ty', answer: 'fourteen', options: ['fourteen', 'forty'] },
        { prompt: 'SIXteen or SIXty? (stress on FIRST syllable)', focus: '-teen vs -ty', answer: 'sixty', options: ['sixteen', 'sixty'] },
        { prompt: 'sevENteen or SEVenty? (stress on LAST syllable)', focus: '-teen vs -ty', answer: 'seventeen', options: ['seventeen', 'seventy'] },
        { prompt: 'EIGHteen or EIGHty? (stress on FIRST syllable)', focus: '-teen vs -ty', answer: 'eighty', options: ['eighteen', 'eighty'] },
      ],
    },
    'question-intonation-basic': {
      type: 'classify', instruction: 'Does this question type usually have rising or falling intonation?',
      items: [
        { prompt: '"Do you like coffee?" (yes/no question)', answer: 'rising', options: ['rising', 'falling'] },
        { prompt: '"Where do you live?" (wh-question)', answer: 'falling', options: ['rising', 'falling'] },
        { prompt: '"Is she a teacher?" (yes/no question)', answer: 'rising', options: ['rising', 'falling'] },
        { prompt: '"What is your name?" (wh-question)', answer: 'falling', options: ['rising', 'falling'] },
        { prompt: '"Can you swim?" (yes/no question)', answer: 'rising', options: ['rising', 'falling'] },
        { prompt: '"How old are you?" (wh-question)', answer: 'falling', options: ['rising', 'falling'] },
      ],
    },
  },
  'a2': {
    'initial-clusters': {
      type: 'phoneme-id', instruction: 'Choose the word with a different initial consonant cluster.',
      items: [
        { prompt: 'Which word has a different initial cluster?', focus: '/str/ vs /st/', answer: 'stop', options: ['strong', 'street', 'stop', 'string'] },
        { prompt: 'Which word has a different initial cluster?', focus: '/bl/ vs /br/', answer: 'brown', options: ['blue', 'black', 'brown', 'blow'] },
        { prompt: 'Which word has a different initial cluster?', focus: '/tr/ vs /dr/', answer: 'drive', options: ['tree', 'true', 'drive', 'try'] },
        { prompt: 'Which word has a different initial cluster?', focus: '/sp/ vs /spr/', answer: 'spring', options: ['speak', 'sport', 'spring', 'spell'] },
        { prompt: 'Which word has a different initial cluster?', focus: '/fl/ vs /fr/', answer: 'free', options: ['fly', 'floor', 'free', 'flat'] },
        { prompt: 'Which word has a different initial cluster?', focus: '/pl/ vs /pr/', answer: 'press', options: ['play', 'please', 'press', 'plan'] },
      ],
    },
    'final-clusters': {
      type: 'phoneme-id', instruction: 'Choose the word with a different final consonant cluster.',
      items: [
        { prompt: 'Which word has a different final cluster?', focus: '/nk/ vs /nd/', answer: 'hand', options: ['think', 'drink', 'hand', 'bank'] },
        { prompt: 'Which word has a different final cluster?', focus: '/lk/ vs /lt/', answer: 'felt', options: ['walk', 'milk', 'felt', 'talk'] },
        { prompt: 'Which word has a different final cluster?', focus: '/sts/ vs /st/', answer: 'fast', options: ['tests', 'costs', 'fast', 'lists'] },
        { prompt: 'Which word has a different final cluster?', focus: '/ft/ vs /pt/', answer: 'kept', options: ['left', 'soft', 'kept', 'lift'] },
        { prompt: 'Which word has a different final cluster?', focus: '/lz/ vs /ls/', answer: 'else', options: ['tells', 'falls', 'else', 'calls'] },
        { prompt: 'Which word has a different final cluster?', focus: '/mp/ vs /nt/', answer: 'want', options: ['jump', 'camp', 'want', 'lamp'] },
      ],
    },
    'cluster-simplification': {
      type: 'classify', instruction: 'Is the consonant cluster fully pronounced or simplified in natural speech?',
      items: [
        { prompt: '"next door" — is the /t/ in "next" usually pronounced?', answer: 'simplified', options: ['fully pronounced', 'simplified'] },
        { prompt: '"handbag" — is the /d/ in "hand" usually pronounced?', answer: 'simplified', options: ['fully pronounced', 'simplified'] },
        { prompt: '"must go" — is the /t/ in "must" usually pronounced?', answer: 'simplified', options: ['fully pronounced', 'simplified'] },
        { prompt: '"strong" — is the /str/ cluster fully pronounced?', answer: 'fully pronounced', options: ['fully pronounced', 'simplified'] },
        { prompt: '"sandwich" — is the /d/ usually fully pronounced?', answer: 'simplified', options: ['fully pronounced', 'simplified'] },
        { prompt: '"black" — is the /bl/ cluster fully pronounced?', answer: 'fully pronounced', options: ['fully pronounced', 'simplified'] },
      ],
    },
    'ed-endings': {
      type: 'classify', instruction: 'How is the -ed ending pronounced?',
      items: [
        { prompt: 'played', answer: '/d/', options: ['/t/', '/d/', '/ɪd/'] },
        { prompt: 'walked', answer: '/t/', options: ['/t/', '/d/', '/ɪd/'] },
        { prompt: 'wanted', answer: '/ɪd/', options: ['/t/', '/d/', '/ɪd/'] },
        { prompt: 'cleaned', answer: '/d/', options: ['/t/', '/d/', '/ɪd/'] },
        { prompt: 'stopped', answer: '/t/', options: ['/t/', '/d/', '/ɪd/'] },
        { prompt: 'needed', answer: '/ɪd/', options: ['/t/', '/d/', '/ɪd/'] },
      ],
    },
    's-endings': {
      type: 'classify', instruction: 'How is the -s ending pronounced?',
      items: [
        { prompt: 'cats', answer: '/s/', options: ['/s/', '/z/', '/ɪz/'] },
        { prompt: 'dogs', answer: '/z/', options: ['/s/', '/z/', '/ɪz/'] },
        { prompt: 'watches', answer: '/ɪz/', options: ['/s/', '/z/', '/ɪz/'] },
        { prompt: 'books', answer: '/s/', options: ['/s/', '/z/', '/ɪz/'] },
        { prompt: 'plays', answer: '/z/', options: ['/s/', '/z/', '/ɪz/'] },
        { prompt: 'buses', answer: '/ɪz/', options: ['/s/', '/z/', '/ɪz/'] },
      ],
    },
    'syllable-counting': {
      type: 'classify', instruction: 'How many syllables does this word have?',
      items: [
        { prompt: 'comfortable', answer: '3', options: ['3', '4', '5'] },
        { prompt: 'interesting', answer: '3', options: ['3', '4', '5'] },
        { prompt: 'chocolate', answer: '2', options: ['2', '3', '4'] },
        { prompt: 'vegetable', answer: '3', options: ['3', '4', '5'] },
        { prompt: 'different', answer: '2', options: ['2', '3', '4'] },
        { prompt: 'beautiful', answer: '3', options: ['2', '3', '4'] },
      ],
    },
    'sentence-stress-basic': {
      type: 'stress-id', instruction: 'Which word carries the main stress in this sentence?',
      items: [
        { prompt: 'I like COFFEE.', answer: 'coffee', options: ['I', 'like', 'coffee'] },
        { prompt: 'She LIVES in London.', answer: 'lives', options: ['she', 'lives', 'London'] },
        { prompt: 'I want a NEW car.', answer: 'new', options: ['I', 'want', 'new', 'car'] },
        { prompt: 'He went to the SHOP.', answer: 'shop', options: ['he', 'went', 'the', 'shop'] },
        { prompt: 'We are LEAVING tomorrow.', answer: 'leaving', options: ['we', 'are', 'leaving', 'tomorrow'] },
        { prompt: 'They BOUGHT a house.', answer: 'bought', options: ['they', 'bought', 'a', 'house'] },
      ],
    },
    'thought-groups-basic': {
      type: 'classify', instruction: 'Where would you place the natural pause in this sentence?',
      items: [
        { prompt: 'When I get home / I will cook dinner.', answer: 'after "home"', options: ['after "home"', 'after "get"', 'after "will"'] },
        { prompt: 'My brother / who lives in Paris / is a doctor.', answer: 'after "brother" and "Paris"', options: ['after "brother" and "Paris"', 'after "who" and "in"', 'no pause needed'] },
        { prompt: 'If it rains / we will stay inside.', answer: 'after "rains"', options: ['after "rains"', 'after "it"', 'after "will"'] },
        { prompt: 'Yesterday / I went to the market.', answer: 'after "yesterday"', options: ['after "yesterday"', 'after "went"', 'after "the"'] },
        { prompt: 'In the morning / I usually drink tea.', answer: 'after "morning"', options: ['after "morning"', 'after "in"', 'after "usually"'] },
        { prompt: 'The teacher / who was very kind / gave us extra time.', answer: 'after "teacher" and "kind"', options: ['after "teacher" and "kind"', 'after "who" and "very"', 'after "gave"'] },
      ],
    },
    'rising-falling-basic': {
      type: 'classify', instruction: 'What intonation pattern is used?',
      items: [
        { prompt: '"Would you like tea or coffee?" (offering a choice)', answer: 'rising on tea, falling on coffee', options: ['rising on tea, falling on coffee', 'falling on both', 'rising on both'] },
        { prompt: '"I bought apples, bananas, and oranges."', answer: 'rising on each item, falling on last', options: ['rising on each item, falling on last', 'falling on each item', 'rising on all'] },
        { prompt: '"Really?" (surprise)', answer: 'rising', options: ['rising', 'falling', 'flat'] },
        { prompt: '"That is great news!" (excitement)', answer: 'falling', options: ['rising', 'falling', 'flat'] },
        { prompt: '"You are coming, aren\'t you?" (expecting yes)', answer: 'falling', options: ['rising', 'falling', 'flat'] },
        { prompt: '"You are coming, aren\'t you?" (genuinely asking)', answer: 'rising', options: ['rising', 'falling', 'flat'] },
      ],
    },
  },
  'b1': {
    'vowel-minimal-pairs': {
      type: 'minimal-pair', instruction: 'Choose the word that correctly completes the sentence.',
      items: [
        { prompt: '"I need a ___ for the baby." (cot /ɒ/ or cut /ʌ/?)', focus: '/ɒ/ vs /ʌ/', answer: 'cot', options: ['cot', 'cut'] },
        { prompt: '"Don\'t ___ the boat." (leave /iː/ or live /ɪ/?)', focus: '/iː/ vs /ɪ/', answer: 'leave', options: ['leave', 'live'] },
        { prompt: '"She ___ the race." (won /ʌ/ or one /wʌn/?)', focus: '/ʌ/', answer: 'won', options: ['won', 'one'] },
        { prompt: '"There\'s a ___ in my shirt." (hole /əʊ/ or hall /ɔː/?)', focus: '/əʊ/ vs /ɔː/', answer: 'hole', options: ['hole', 'hall'] },
        { prompt: '"I can\'t ___ the difference." (fill /ɪ/ or feel /iː/?)', focus: '/ɪ/ vs /iː/', answer: 'feel', options: ['fill', 'feel'] },
        { prompt: '"The ___ is very warm." (pool /uː/ or pull /ʊ/?)', focus: '/uː/ vs /ʊ/', answer: 'pool', options: ['pool', 'pull'] },
      ],
    },
    'consonant-minimal-pairs': {
      type: 'minimal-pair', instruction: 'Choose the correct word based on the consonant sound.',
      items: [
        { prompt: '"I had a ___ in the garden." (path /θ/ or pass /s/?)', focus: '/θ/ vs /s/', answer: 'path', options: ['path', 'pass'] },
        { prompt: '"She ___ the car." (washed /ʃ/ or watched /tʃ/?)', focus: '/ʃ/ vs /tʃ/', answer: 'washed', options: ['washed', 'watched'] },
        { prompt: '"They ___ the decision." (made /d/ or mate /t/?)', focus: '/d/ vs /t/', answer: 'made', options: ['made', 'mate'] },
        { prompt: '"I need to ___ my hair." (brush /ʃ/ or crush /ʃ/?)', focus: '/br/ vs /kr/', answer: 'brush', options: ['brush', 'crush'] },
        { prompt: '"The ___ is on the table." (rice /s/ or rise /z/?)', focus: '/s/ vs /z/', answer: 'rice', options: ['rice', 'rise'] },
        { prompt: '"We need more ___." (light /l/ or right /r/?)', focus: '/l/ vs /r/', answer: 'light', options: ['light', 'right'] },
      ],
    },
    'near-minimal-pairs': {
      type: 'minimal-pair', instruction: 'These words sound very similar. Choose the correct one for the context.',
      items: [
        { prompt: '"The ___ is delicious." (dessert or desert?)', focus: 'stress placement', answer: 'dessert', options: ['dessert', 'desert'] },
        { prompt: '"Can you ___ the door?" (close /z/ or clothes /ðz/?)', focus: '/z/ vs /ðz/', answer: 'close', options: ['close', 'clothes'] },
        { prompt: '"I ___ the movie." (quite or quiet?)', focus: 'syllable count', answer: 'quite', options: ['quite', 'quiet'] },
        { prompt: '"The weather will ___ our plans." (affect or effect?)', focus: 'initial vowel', answer: 'affect', options: ['affect', 'effect'] },
        { prompt: '"She is the school ___." (principal or principle?)', focus: 'identical pronunciation', answer: 'principal', options: ['principal', 'principle'] },
        { prompt: '"Let me give you some ___." (advice /s/ or advise /z/?)', focus: '/s/ vs /z/', answer: 'advice', options: ['advice', 'advise'] },
      ],
    },
    'articles-weak': {
      type: 'classify', instruction: 'Is the underlined word pronounced with a weak (reduced) or strong form?',
      items: [
        { prompt: '"I saw a man." — How is "a" pronounced?', answer: 'weak /ə/', options: ['weak /ə/', 'strong /eɪ/'] },
        { prompt: '"I want a — not two — apples." — How is "a" pronounced?', answer: 'strong /eɪ/', options: ['weak /ə/', 'strong /eɪ/'] },
        { prompt: '"Go to the shop." — How is "the" pronounced?', answer: 'weak /ðə/', options: ['weak /ðə/', 'strong /ðiː/'] },
        { prompt: '"She is THE expert on this." — How is "the" pronounced?', answer: 'strong /ðiː/', options: ['weak /ðə/', 'strong /ðiː/'] },
        { prompt: '"I had an egg." — How is "an" pronounced?', answer: 'weak /ən/', options: ['weak /ən/', 'strong /æn/'] },
        { prompt: '"I said an — not the." — How is "an" pronounced?', answer: 'strong /æn/', options: ['weak /ən/', 'strong /æn/'] },
      ],
    },
    'auxiliaries-weak': {
      type: 'classify', instruction: 'Is the auxiliary verb pronounced with a weak or strong form?',
      items: [
        { prompt: '"I can swim." — How is "can" pronounced?', answer: 'weak /kən/', options: ['weak /kən/', 'strong /kæn/'] },
        { prompt: '"Yes, I CAN!" — How is "can" pronounced?', answer: 'strong /kæn/', options: ['weak /kən/', 'strong /kæn/'] },
        { prompt: '"She was sleeping." — How is "was" pronounced?', answer: 'weak /wəz/', options: ['weak /wəz/', 'strong /wɒz/'] },
        { prompt: '"Yes, she WAS." — How is "was" pronounced?', answer: 'strong /wɒz/', options: ['weak /wəz/', 'strong /wɒz/'] },
        { prompt: '"They have gone." — How is "have" pronounced?', answer: 'weak /əv/', options: ['weak /əv/', 'strong /hæv/'] },
        { prompt: '"Yes, they HAVE." — How is "have" pronounced?', answer: 'strong /hæv/', options: ['weak /əv/', 'strong /hæv/'] },
      ],
    },
    'prepositions-weak': {
      type: 'classify', instruction: 'Is the preposition pronounced with a weak or strong form?',
      items: [
        { prompt: '"I went to school." — How is "to" pronounced?', answer: 'weak /tə/', options: ['weak /tə/', 'strong /tuː/'] },
        { prompt: '"Where are you going TO?" — How is "to" pronounced?', answer: 'strong /tuː/', options: ['weak /tə/', 'strong /tuː/'] },
        { prompt: '"He comes from Spain." — How is "from" pronounced?', answer: 'weak /frəm/', options: ['weak /frəm/', 'strong /frɒm/'] },
        { prompt: '"Where is she FROM?" — How is "from" pronounced?', answer: 'strong /frɒm/', options: ['weak /frəm/', 'strong /frɒm/'] },
        { prompt: '"I am at home." — How is "at" pronounced?', answer: 'weak /ət/', options: ['weak /ət/', 'strong /æt/'] },
        { prompt: '"What are you looking AT?" — How is "at" pronounced?', answer: 'strong /æt/', options: ['weak /ət/', 'strong /æt/'] },
      ],
    },
    'linking-consonant-vowel': {
      type: 'classify', instruction: 'Identify the linking that occurs between these words.',
      items: [
        { prompt: '"turn off" — what happens between "turn" and "off"?', answer: '/n/ links to vowel: "tur-noff"', options: ['/n/ links to vowel: "tur-noff"', 'no linking', 'glottal stop'] },
        { prompt: '"an apple" — what happens between "an" and "apple"?', answer: '/n/ links to vowel: "a-napple"', options: ['/n/ links to vowel: "a-napple"', 'no linking', 'pause between words'] },
        { prompt: '"get up" — what happens between "get" and "up"?', answer: '/t/ links to vowel: "ge-tup"', options: ['/t/ links to vowel: "ge-tup"', 'no linking', '/t/ is dropped'] },
        { prompt: '"come in" — what happens between "come" and "in"?', answer: '/m/ links to vowel: "co-min"', options: ['/m/ links to vowel: "co-min"', 'no linking', 'glottal stop'] },
        { prompt: '"this evening" — what happens between "this" and "evening"?', answer: '/s/ links to vowel: "thi-sevening"', options: ['/s/ links to vowel: "thi-sevening"', 'no linking', 'pause'] },
        { prompt: '"look at" — what happens between "look" and "at"?', answer: '/k/ links to vowel: "loo-kat"', options: ['/k/ links to vowel: "loo-kat"', 'no linking', '/k/ is dropped'] },
      ],
    },
    'schwa-intro': {
      type: 'phoneme-id', instruction: 'Which syllable contains the schwa /ə/ sound?',
      items: [
        { prompt: 'In "about" /əˈbaʊt/, where is the schwa?', answer: 'first syllable', options: ['first syllable', 'second syllable'] },
        { prompt: 'In "banana" /bəˈnɑːnə/, how many schwas are there?', answer: 'two (first and last syllable)', options: ['one', 'two (first and last syllable)', 'three'] },
        { prompt: 'In "teacher" /ˈtiːtʃə/, where is the schwa?', answer: 'second syllable', options: ['first syllable', 'second syllable'] },
        { prompt: 'In "sofa" /ˈsəʊfə/, where is the schwa?', answer: 'second syllable', options: ['first syllable', 'second syllable'] },
        { prompt: 'In "photography" /fəˈtɒɡrəfi/, how many schwas are there?', answer: 'two (first and third syllable)', options: ['one', 'two (first and third syllable)', 'three'] },
        { prompt: 'In "support" /səˈpɔːt/, where is the schwa?', answer: 'first syllable', options: ['first syllable', 'second syllable'] },
      ],
    },
    'rhythm-basics': {
      type: 'classify', instruction: 'English is a stress-timed language. Identify the rhythm pattern.',
      items: [
        { prompt: '"CATS chase MICE" has the same rhythm as:', answer: '"DOGS eat BONES" (same stress pattern: S-w-S)', options: ['"DOGS eat BONES" (same stress pattern: S-w-S)', '"The CATS are CHASING" (different stress count)', '"I LIKE cats" (different pattern)'] },
        { prompt: 'How many stressed syllables in: "The BOY went to the SHOP to BUY some BREAD"?', answer: '4', options: ['3', '4', '5', '8'] },
        { prompt: '"COME and SIT DOWN" — what is the rhythm?', answer: 'S w S S (strong-weak-strong-strong)', options: ['S w S S (strong-weak-strong-strong)', 'w w S S', 'S S S S'] },
        { prompt: 'Which sentence takes roughly the same time to say? "The CATS CHASE MICE" or "The CATS are CHASING the MICE"?', answer: 'roughly the same (stress-timed)', options: ['roughly the same (stress-timed)', 'the second is much longer', 'the first is much longer'] },
        { prompt: '"I \'d like a cup of TEA" — which words are reduced (weak)?', answer: 'I\'d, a, of', options: ['I\'d, a, of', 'like, cup, tea', 'all words are strong'] },
        { prompt: 'In English rhythm, unstressed syllables are:', answer: 'shorter and quieter', options: ['shorter and quieter', 'longer and louder', 'the same length as stressed'] },
      ],
    },
  },
  'b2': {
    'contrastive-stress': {
      type: 'stress-id', instruction: 'Which word should be stressed to convey the intended meaning?',
      items: [
        { prompt: '"I didn\'t say HE stole the money." (meaning: someone else did)', answer: 'I', options: ['I', 'say', 'he', 'money'] },
        { prompt: '"I didn\'t SAY he stole the money." (meaning: I implied it)', answer: 'say', options: ['I', 'say', 'he', 'money'] },
        { prompt: '"I didn\'t say he STOLE the money." (meaning: he borrowed it)', answer: 'stole', options: ['I', 'say', 'stole', 'money'] },
        { prompt: '"I didn\'t say he stole the MONEY." (meaning: he stole something else)', answer: 'money', options: ['I', 'say', 'stole', 'money'] },
        { prompt: '"SHE gave him the book." (not someone else)', answer: 'she', options: ['she', 'gave', 'him', 'book'] },
        { prompt: '"She gave HIM the book." (not someone else)', answer: 'him', options: ['she', 'gave', 'him', 'book'] },
      ],
    },
    'compound-stress': {
      type: 'stress-id', instruction: 'Where is the main stress in this compound?',
      items: [
        { prompt: '"BLACKbird" (the bird species)', answer: 'first word', options: ['first word', 'second word', 'equal stress'] },
        { prompt: '"black BIRD" (any bird that is black)', answer: 'second word', options: ['first word', 'second word', 'equal stress'] },
        { prompt: '"GREENhouse" (for growing plants)', answer: 'first word', options: ['first word', 'second word', 'equal stress'] },
        { prompt: '"green HOUSE" (a house painted green)', answer: 'second word', options: ['first word', 'second word', 'equal stress'] },
        { prompt: '"HOT dog" (the food)', answer: 'first word', options: ['first word', 'second word', 'equal stress'] },
        { prompt: '"hot DOG" (a dog that is hot)', answer: 'second word', options: ['first word', 'second word', 'equal stress'] },
      ],
    },
    'stress-shift': {
      type: 'stress-id', instruction: 'How does the stress change when the word class changes?',
      items: [
        { prompt: '"REcord" (noun) vs "reCORD" (verb) — which is the verb?', answer: 'reCORD (stress on second syllable)', options: ['REcord (stress on first)', 'reCORD (stress on second syllable)'] },
        { prompt: '"PREsent" (noun/adj) vs "preSENT" (verb) — which is the noun?', answer: 'PREsent (stress on first)', options: ['PREsent (stress on first)', 'preSENT (stress on second)'] },
        { prompt: '"OBject" (noun) vs "obJECT" (verb) — which is the verb?', answer: 'obJECT (stress on second)', options: ['OBject (stress on first)', 'obJECT (stress on second)'] },
        { prompt: '"PERmit" (noun) vs "perMIT" (verb) — which is the noun?', answer: 'PERmit (stress on first)', options: ['PERmit (stress on first)', 'perMIT (stress on second)'] },
        { prompt: '"CONduct" (noun) vs "conDUCT" (verb) — which is the verb?', answer: 'conDUCT (stress on second)', options: ['CONduct (stress on first)', 'conDUCT (stress on second)'] },
        { prompt: '"CONtrast" (noun) vs "conTRAST" (verb) — which is the noun?', answer: 'CONtrast (stress on first)', options: ['CONtrast (stress on first)', 'conTRAST (stress on second)'] },
      ],
    },
    'intonation-meaning': {
      type: 'classify', instruction: 'What does the intonation pattern convey?',
      items: [
        { prompt: '"That\'s interesting." (with falling then rising tone)', answer: 'polite doubt or scepticism', options: ['genuine interest', 'polite doubt or scepticism', 'boredom'] },
        { prompt: '"You\'re leaving." (with rising intonation)', answer: 'surprise or disbelief (question)', options: ['statement of fact', 'surprise or disbelief (question)', 'command'] },
        { prompt: '"OK." (with sharp falling tone)', answer: 'reluctant acceptance or annoyance', options: ['enthusiastic agreement', 'reluctant acceptance or annoyance', 'indifference'] },
        { prompt: '"Thank you SO much." (with extra high pitch on "so")', answer: 'could be sarcastic', options: ['deeply grateful', 'could be sarcastic', 'neutral'] },
        { prompt: '"I suppose so..." (with falling-rising tone)', answer: 'agreement with reservations', options: ['strong agreement', 'agreement with reservations', 'disagreement'] },
        { prompt: '"Well..." (with long rising tone)', answer: 'hesitation or about to disagree', options: ['enthusiasm', 'hesitation or about to disagree', 'confirmation'] },
      ],
    },
    'tag-questions': {
      type: 'classify', instruction: 'What does the intonation on the tag question mean?',
      items: [
        { prompt: '"Nice day, ISN\'T it?" (falling tone on tag)', answer: 'expecting agreement (not a real question)', options: ['expecting agreement (not a real question)', 'genuinely asking', 'showing surprise'] },
        { prompt: '"You locked the door, DIDN\'T you?" (rising tone on tag)', answer: 'genuinely checking (unsure)', options: ['expecting agreement', 'genuinely checking (unsure)', 'making a statement'] },
        { prompt: '"She\'s French, ISN\'T she?" (falling tone)', answer: 'confirming what they think they know', options: ['genuinely asking', 'confirming what they think they know', 'expressing doubt'] },
        { prompt: '"You haven\'t finished, HAVE you?" (rising tone)', answer: 'worried or checking', options: ['accusing', 'worried or checking', 'making conversation'] },
        { prompt: '"It\'s cold, ISN\'T it?" (falling tone)', answer: 'making conversation (phatic)', options: ['genuinely asking about temperature', 'making conversation (phatic)', 'complaining'] },
        { prompt: '"You CAN swim, can\'t you?" (rising tone on tag)', answer: 'suddenly unsure, seeking reassurance', options: ['confident', 'suddenly unsure, seeking reassurance', 'making small talk'] },
      ],
    },
    'listing-intonation': {
      type: 'classify', instruction: 'What intonation pattern is used in lists?',
      items: [
        { prompt: '"I bought apples↗, bananas↗, and oranges↘." What does the final fall signal?', answer: 'the list is complete', options: ['the list is complete', 'there are more items', 'uncertainty'] },
        { prompt: '"I bought apples↗, bananas↗, oranges↗..." What does the final rise signal?', answer: 'the list continues (open list)', options: ['the list is complete', 'the list continues (open list)', 'a question'] },
        { prompt: '"Would you like tea↗ or coffee↘?" What does this pattern mean?', answer: 'choose one of these two options', options: ['choose one of these two options', 'would you like any drink?', 'I don\'t care which'] },
        { prompt: '"Would you like tea or coffee↗?" What does the final rise mean?', answer: 'would you like a drink at all? (yes/no)', options: ['choose one', 'would you like a drink at all? (yes/no)', 'I prefer tea'] },
        { prompt: '"First↗, you mix the ingredients. Then↗, you bake it. Finally↘, you serve it."', answer: 'rising marks continuation, falling marks the end', options: ['rising marks continuation, falling marks the end', 'all should be rising', 'all should be falling'] },
        { prompt: '"She speaks French↗, German↗, and Spanish↘... and possibly Italian."', answer: 'afterthought added after the "complete" list', options: ['she forgot Italian', 'afterthought added after the "complete" list', 'Italian is most important'] },
      ],
    },
    'elision': {
      type: 'classify', instruction: 'Which sound is typically elided (dropped) in natural speech?',
      items: [
        { prompt: '"next please" — which sound is elided?', answer: '/t/ in "next"', options: ['/t/ in "next"', '/p/ in "please"', 'no elision'] },
        { prompt: '"last night" — which sound is elided?', answer: '/t/ in "last"', options: ['/t/ in "last"', '/n/ in "night"', 'no elision'] },
        { prompt: '"government" — which sound is commonly elided?', answer: 'first /n/ (govermnt)', options: ['first /n/ (govermnt)', '/t/ at the end', '/g/ at the start'] },
        { prompt: '"probably" — how many syllables in fast speech?', answer: 'two (probly)', options: ['two (probly)', 'three (prob-ab-ly)', 'one'] },
        { prompt: '"library" — which sound is commonly elided?', answer: 'first /r/ (libry)', options: ['first /r/ (libry)', '/l/ at the start', 'no elision'] },
        { prompt: '"chocolate" — how many syllables in fast speech?', answer: 'two (choclat)', options: ['two (choclat)', 'three (choc-o-late)', 'one'] },
      ],
    },
    'assimilation': {
      type: 'classify', instruction: 'What type of sound change occurs?',
      items: [
        { prompt: '"ten bikes" — what happens to the /n/?', answer: '/n/ becomes /m/ (assimilates to /b/)', options: ['/n/ becomes /m/ (assimilates to /b/)', '/n/ stays the same', '/n/ is deleted'] },
        { prompt: '"good girl" — what happens to the /d/?', answer: '/d/ becomes /g/ (assimilates to /g/)', options: ['/d/ stays the same', '/d/ becomes /g/ (assimilates to /g/)', '/d/ is deleted'] },
        { prompt: '"in Paris" — what happens to the /n/?', answer: '/n/ becomes /m/ (assimilates to /p/)', options: ['/n/ becomes /m/ (assimilates to /p/)', '/n/ stays the same', '/n/ is deleted'] },
        { prompt: '"this shop" — what happens to the /s/?', answer: '/s/ can become /ʃ/ (assimilates to /ʃ/)', options: ['/s/ can become /ʃ/ (assimilates to /ʃ/)', '/s/ stays the same', '/s/ is deleted'] },
        { prompt: '"don\'t you" — what happens to /t j/?', answer: '/t/ + /j/ merge to /tʃ/ ("donchu")', options: ['/t/ + /j/ merge to /tʃ/ ("donchu")', 'both stay the same', '/j/ is deleted'] },
        { prompt: '"would you" — what happens to /d j/?', answer: '/d/ + /j/ merge to /dʒ/ ("wouldjou")', options: ['/d/ + /j/ merge to /dʒ/ ("wouldjou")', 'both stay the same', '/d/ is deleted'] },
      ],
    },
    'intrusive-sounds': {
      type: 'classify', instruction: 'What intrusive sound appears between these words?',
      items: [
        { prompt: '"law and order" — what sound appears between "law" and "and"?', answer: 'intrusive /r/ ("law-r-and")', options: ['intrusive /r/ ("law-r-and")', 'no intrusive sound', 'intrusive /w/'] },
        { prompt: '"go away" — what sound appears between "go" and "away"?', answer: 'intrusive /w/ ("go-w-away")', options: ['intrusive /r/', 'intrusive /w/ ("go-w-away")', 'no intrusive sound'] },
        { prompt: '"the end" — what sound appears between "the" and "end"?', answer: 'intrusive /j/ ("the-y-end")', options: ['intrusive /j/ ("the-y-end")', 'intrusive /r/', 'no intrusive sound'] },
        { prompt: '"idea of" — what sound appears between "idea" and "of"?', answer: 'intrusive /r/ ("idea-r-of")', options: ['intrusive /r/ ("idea-r-of")', 'intrusive /w/', 'no intrusive sound'] },
        { prompt: '"do it" — what sound appears between "do" and "it"?', answer: 'intrusive /w/ ("do-w-it")', options: ['intrusive /r/', 'intrusive /w/ ("do-w-it")', 'no intrusive sound'] },
        { prompt: '"she asked" — what sound appears between "she" and "asked"?', answer: 'intrusive /j/ ("she-y-asked")', options: ['intrusive /j/ ("she-y-asked")', 'intrusive /r/', 'no intrusive sound'] },
      ],
    },
  },
  'c1': {
    'discourse-intonation': {
      type: 'classify', instruction: 'How does intonation function at the discourse level?',
      items: [
        { prompt: 'A speaker starts a new topic with a noticeably higher pitch. This signals:', answer: 'topic shift (new information)', options: ['topic shift (new information)', 'emphasis on a word', 'a question'] },
        { prompt: 'A speaker\'s pitch range narrows towards the end of a long turn. This signals:', answer: 'approaching the end of their turn', options: ['boredom', 'approaching the end of their turn', 'uncertainty'] },
        { prompt: 'A speaker uses a high fall on a word in mid-sentence. This signals:', answer: 'the most important piece of information', options: ['surprise', 'the most important piece of information', 'a correction'] },
        { prompt: 'A speaker ends a clause with a level (flat) tone. This signals:', answer: 'the utterance is not complete (more to come)', options: ['the utterance is complete', 'the utterance is not complete (more to come)', 'indifference'] },
        { prompt: 'A speaker uses a fall-rise at the end of a statement. This signals:', answer: 'reservation or implied "but..."', options: ['certainty', 'reservation or implied "but..."', 'a question'] },
        { prompt: 'A speaker resets to a high pitch after a pause. This signals:', answer: 'beginning a new discourse segment', options: ['beginning a new discourse segment', 'correcting an error', 'emphasis'] },
      ],
    },
    'new-vs-given-info': {
      type: 'stress-id', instruction: 'Which word carries the nuclear stress based on information structure?',
      items: [
        { prompt: 'A: "Who broke the window?" B: "JOHN broke the window."', answer: 'John (new information)', options: ['John (new information)', 'broke', 'window'] },
        { prompt: 'A: "What did John break?" B: "John broke the WINDOW."', answer: 'window (new information)', options: ['John', 'broke', 'window (new information)'] },
        { prompt: 'A: "Did John break or fix the window?" B: "John BROKE the window."', answer: 'broke (new information)', options: ['John', 'broke (new information)', 'window'] },
        { prompt: '"I wanted the BLUE one, not the red one." — Why is "blue" stressed?', answer: 'contrastive new information', options: ['contrastive new information', 'it\'s the last content word', 'emphasis for emotion'] },
        { prompt: '"She said she\'d come, and she DID come." — Why is "did" stressed?', answer: 'verum focus (asserting truth)', options: ['because it\'s an auxiliary', 'verum focus (asserting truth)', 'contrastive stress on verbs'] },
        { prompt: '"A: I love Italian food. B: I love FRENCH food."', answer: 'French (contrastive with "Italian")', options: ['I (emphasising the speaker)', 'love (emphasising the feeling)', 'French (contrastive with "Italian")'] },
      ],
    },
    'prominence-focus': {
      type: 'classify', instruction: 'What type of focus does the prominence pattern create?',
      items: [
        { prompt: '"I\'ve NEVER been to Japan." (heavy stress on never)', answer: 'emphatic/scalar focus', options: ['neutral focus', 'emphatic/scalar focus', 'contrastive focus'] },
        { prompt: '"JOHN passed the exam." (not Mary)', answer: 'contrastive focus', options: ['neutral focus', 'emphatic focus', 'contrastive focus'] },
        { prompt: '"She passed the EXAM." (answering: what did she pass?)', answer: 'presentational/neutral focus', options: ['presentational/neutral focus', 'contrastive focus', 'emphatic focus'] },
        { prompt: '"He didn\'t STEAL it; he BORROWED it."', answer: 'parallel contrastive focus', options: ['parallel contrastive focus', 'emphatic focus', 'neutral focus'] },
        { prompt: '"Even SARAH noticed." (unexpected person)', answer: 'scalar focus (even = unexpected)', options: ['contrastive focus', 'neutral focus', 'scalar focus (even = unexpected)'] },
        { prompt: '"It was absolutely BRILLIANT."', answer: 'emphatic intensification', options: ['contrastive focus', 'emphatic intensification', 'neutral focus'] },
      ],
    },
    'attitude-intonation': {
      type: 'classify', instruction: 'What attitude does the intonation convey?',
      items: [
        { prompt: '"Oh, REALLY." (low fall on "really")', answer: 'boredom or disbelief', options: ['genuine interest', 'boredom or disbelief', 'excitement'] },
        { prompt: '"Oh, REALLY?" (high rise on "really")', answer: 'genuine surprise or interest', options: ['genuine surprise or interest', 'sarcasm', 'indifference'] },
        { prompt: '"That\'s NICE." (low fall, narrow pitch range)', answer: 'dismissive or uninterested', options: ['genuine appreciation', 'dismissive or uninterested', 'excitement'] },
        { prompt: '"That\'s NICE!" (high fall, wide pitch range)', answer: 'genuine enthusiasm', options: ['genuine enthusiasm', 'sarcasm', 'indifference'] },
        { prompt: '"I THOUGHT so." (fall-rise on "thought")', answer: 'smug satisfaction (I knew it)', options: ['uncertainty', 'smug satisfaction (I knew it)', 'disappointment'] },
        { prompt: '"If you SAY so..." (fall-rise, trailing off)', answer: 'doubt or disagreement politely expressed', options: ['agreement', 'doubt or disagreement politely expressed', 'enthusiasm'] },
      ],
    },
    'emotion-prosody': {
      type: 'classify', instruction: 'Which prosodic features signal this emotion?',
      items: [
        { prompt: 'Anger is typically expressed through:', answer: 'faster rate, louder, wider pitch range, tense voice', options: ['faster rate, louder, wider pitch range, tense voice', 'slower rate, quiet, narrow range', 'monotone with pauses'] },
        { prompt: 'Sadness is typically expressed through:', answer: 'slower rate, quieter, narrow pitch range, breathy voice', options: ['faster rate, louder, wide range', 'slower rate, quieter, narrow pitch range, breathy voice', 'high pitch, fast rate'] },
        { prompt: 'Excitement is typically expressed through:', answer: 'higher pitch, faster rate, wider range, louder', options: ['lower pitch, slower rate', 'higher pitch, faster rate, wider range, louder', 'monotone'] },
        { prompt: 'Boredom is typically expressed through:', answer: 'narrow pitch range, slower rate, lower energy', options: ['wide pitch range, fast rate', 'narrow pitch range, slower rate, lower energy', 'very high pitch'] },
        { prompt: 'Nervousness is typically expressed through:', answer: 'higher pitch, uneven rate, filled pauses (um, uh)', options: ['lower pitch, steady rate', 'higher pitch, uneven rate, filled pauses (um, uh)', 'monotone, slow'] },
        { prompt: 'Confidence is typically expressed through:', answer: 'steady rate, moderate pitch, clear articulation, strategic pauses', options: ['fast rate, high pitch', 'steady rate, moderate pitch, clear articulation, strategic pauses', 'quiet, narrow range'] },
      ],
    },
    'sarcasm-irony-tone': {
      type: 'classify', instruction: 'Is the utterance likely sincere or sarcastic based on the prosodic description?',
      items: [
        { prompt: '"Great job." (flat tone, no pitch movement, slightly slower)', answer: 'sarcastic', options: ['sincere', 'sarcastic'] },
        { prompt: '"Great job!" (high fall, wide pitch range, bright voice)', answer: 'sincere', options: ['sincere', 'sarcastic'] },
        { prompt: '"Oh, wonderful." (exaggerated pitch on "wonderful", then flat)', answer: 'sarcastic', options: ['sincere', 'sarcastic'] },
        { prompt: '"Thanks a lot." (lengthened "lot", flat then slight fall)', answer: 'sarcastic', options: ['sincere', 'sarcastic'] },
        { prompt: '"Thanks a lot!" (high pitch, genuine warmth, smile voice)', answer: 'sincere', options: ['sincere', 'sarcastic'] },
        { prompt: '"That went well." (eye-roll intonation: rise on "well", then sharp drop)', answer: 'sarcastic', options: ['sincere', 'sarcastic'] },
      ],
    },
    'formal-vs-casual-speech': {
      type: 'classify', instruction: 'Is this pronunciation feature typical of formal or casual speech?',
      items: [
        { prompt: 'Full pronunciation of "going to" as /ˈɡəʊɪŋ tuː/', answer: 'formal', options: ['formal', 'casual'] },
        { prompt: 'Reduced "gonna" /ˈɡɒnə/', answer: 'casual', options: ['formal', 'casual'] },
        { prompt: 'Pronouncing the /t/ in "internet" clearly', answer: 'formal', options: ['formal', 'casual'] },
        { prompt: 'Glottaling the /t/ in "internet" /ˈɪnəneʔ/', answer: 'casual', options: ['formal', 'casual'] },
        { prompt: 'Full vowels in unstressed syllables: "to" as /tuː/', answer: 'formal', options: ['formal', 'casual'] },
        { prompt: 'Reduced vowels in unstressed syllables: "to" as /tə/', answer: 'casual', options: ['formal', 'casual'] },
      ],
    },
    'speech-rate-control': {
      type: 'classify', instruction: 'When should a speaker slow down or speed up?',
      items: [
        { prompt: 'Introducing a new technical term for the first time:', answer: 'slow down', options: ['slow down', 'speed up', 'maintain pace'] },
        { prompt: 'Giving background information the audience already knows:', answer: 'speed up', options: ['slow down', 'speed up', 'maintain pace'] },
        { prompt: 'Delivering the key argument in a persuasive speech:', answer: 'slow down', options: ['slow down', 'speed up', 'maintain pace'] },
        { prompt: 'Telling a story and building excitement:', answer: 'speed up', options: ['slow down', 'speed up', 'maintain pace'] },
        { prompt: 'Reaching the climax/reveal of a story:', answer: 'slow down', options: ['slow down', 'speed up', 'maintain pace'] },
        { prompt: 'Listing routine items everyone is familiar with:', answer: 'speed up', options: ['slow down', 'speed up', 'maintain pace'] },
      ],
    },
    'pause-placement': {
      type: 'classify', instruction: 'What communicative function does the pause serve?',
      items: [
        { prompt: 'A speaker pauses before an important word:', answer: 'creating anticipation and emphasis', options: ['creating anticipation and emphasis', 'lost their place', 'hesitation'] },
        { prompt: 'A speaker pauses after delivering key information:', answer: 'allowing the audience to process', options: ['allowing the audience to process', 'thinking of what to say next', 'dramatic effect'] },
        { prompt: 'A speaker uses "um" and "uh" with pauses:', answer: 'holding the floor while thinking (filled pause)', options: ['holding the floor while thinking (filled pause)', 'nervousness only', 'bad habit'] },
        { prompt: 'A comedian pauses after a punchline:', answer: 'timing — letting the audience react', options: ['forgot the next line', 'timing — letting the audience react', 'natural breathing'] },
        { prompt: 'A teacher pauses and makes eye contact after a question:', answer: 'signalling students should think/respond', options: ['signalling students should think/respond', 'waiting for quiet', 'lost their train of thought'] },
        { prompt: 'A politician pauses between each phrase in a list of three:', answer: 'rhetorical pacing for impact', options: ['rhetorical pacing for impact', 'reading from a script', 'breathing'] },
      ],
    },
  },
  'c2': {
    'persuasive-prosody': {
      type: 'classify', instruction: 'How does prosody enhance persuasion in this context?',
      items: [
        { prompt: 'A speaker progressively increases volume and pitch range through a three-part list:', answer: 'builds emotional momentum (climactic parallelism)', options: ['builds emotional momentum (climactic parallelism)', 'losing control', 'simply getting louder'] },
        { prompt: 'A speaker drops to near-whisper for one key phrase:', answer: 'forces audience attention through contrast', options: ['lost confidence', 'forces audience attention through contrast', 'microphone problem'] },
        { prompt: 'A speaker uses measured, evenly-paced delivery for a series of facts:', answer: 'conveys authority and certainty', options: ['boring delivery', 'conveys authority and certainty', 'reading from notes'] },
        { prompt: 'A speaker uses a high-low-high pitch pattern across three sentences:', answer: 'creates a "valley" effect — the low point receives contrastive emphasis', options: ['random variation', 'creates a "valley" effect — the low point receives contrastive emphasis', 'uncertain of facts'] },
        { prompt: 'A speaker matches their audience\'s speech rate, then gradually slows:', answer: 'pacing and leading (building rapport then guiding attention)', options: ['pacing and leading (building rapport then guiding attention)', 'getting tired', 'losing interest'] },
        { prompt: 'A speaker places exactly equal stress on each word: "Every. Single. One."', answer: 'emphatic parcelling for dramatic effect', options: ['emphatic parcelling for dramatic effect', 'speaking to someone who doesn\'t understand', 'anger'] },
      ],
    },
    'rhetorical-pacing': {
      type: 'classify', instruction: 'What effect does this pacing technique achieve?',
      items: [
        { prompt: 'Short sentences delivered rapidly in sequence:', answer: 'urgency and momentum', options: ['urgency and momentum', 'running out of time', 'nervousness'] },
        { prompt: 'One very long sentence with multiple subordinate clauses:', answer: 'building complexity and suspense (periodic sentence)', options: ['poor planning', 'building complexity and suspense (periodic sentence)', 'stream of consciousness'] },
        { prompt: 'A three-second pause before the final word of a speech:', answer: 'maximum anticipation for the climax', options: ['forgot the word', 'maximum anticipation for the climax', 'technical difficulty'] },
        { prompt: 'Alternating between fast and slow passages:', answer: 'creating rhythmic contrast to maintain engagement', options: ['inconsistent style', 'creating rhythmic contrast to maintain engagement', 'poor preparation'] },
        { prompt: 'Repeating a phrase three times with increasing intensity:', answer: 'anaphoric crescendo for emotional impact', options: ['ran out of things to say', 'anaphoric crescendo for emotional impact', 'forgot they said it'] },
        { prompt: 'Ending a speech at a faster pace than it began:', answer: 'building to an energetic call-to-action', options: ['rushing to finish', 'building to an energetic call-to-action', 'poor time management'] },
      ],
    },
    'climax-intonation': {
      type: 'classify', instruction: 'How does intonation build towards a climax?',
      items: [
        { prompt: 'Pitch range progressively widens over several clauses:', answer: 'escalation towards an emotional peak', options: ['escalation towards an emotional peak', 'losing control of voice', 'random variation'] },
        { prompt: 'After sustained high energy, the speaker drops to quiet, low pitch:', answer: 'anticlimax for ironic or reflective effect', options: ['anticlimax for ironic or reflective effect', 'lost energy', 'microphone issue'] },
        { prompt: 'The speaker maintains exactly the same pitch contour for parallel structures:', answer: 'isocolon — balanced prosody mirrors balanced syntax', options: ['monotonous delivery', 'isocolon — balanced prosody mirrors balanced syntax', 'reading from a script'] },
        { prompt: 'Rising pitch across: "Not just for us. Not just for our children. But for generations to come."', answer: 'progressive elevation through tricolon', options: ['progressive elevation through tricolon', 'asking three questions', 'uncertainty increasing'] },
        { prompt: 'Speaker holds the final syllable longer than expected:', answer: 'prosodic lengthening for emphasis and finality', options: ['prosodic lengthening for emphasis and finality', 'hesitation', 'accent feature'] },
        { prompt: 'Voice quality shifts from modal to creaky at the end of a speech:', answer: 'signals intimate, personal register for emotional connection', options: ['voice is tired', 'signals intimate, personal register for emotional connection', 'health issue'] },
      ],
    },
    'accent-variation': {
      type: 'classify', instruction: 'Match the pronunciation feature to the variety of English.',
      items: [
        { prompt: 'Non-rhoticity (no /r/ in "car", "park"):', answer: 'British RP, Australian, many Southern English', options: ['British RP, Australian, many Southern English', 'General American, Irish', 'Scottish, Canadian'] },
        { prompt: 'Rhoticity (pronouncing /r/ in "car", "park"):', answer: 'General American, Scottish, Irish', options: ['British RP, Australian', 'General American, Scottish, Irish', 'South African, New Zealand'] },
        { prompt: '/æ/ raising (pronouncing "bath" like "baath"):', answer: 'General American', options: ['British RP', 'General American', 'Australian'] },
        { prompt: 'T-flapping (/t/ sounds like /d/ in "water", "better"):', answer: 'General American, Australian', options: ['British RP', 'General American, Australian', 'South African'] },
        { prompt: 'High Rising Terminal (uptalk) as a statement feature:', answer: 'Australian, New Zealand', options: ['British RP', 'General American', 'Australian, New Zealand'] },
        { prompt: 'TH-fronting (/θ/ → /f/, "think" → "fink"):', answer: 'London/Cockney, many urban British varieties', options: ['General American', 'London/Cockney, many urban British varieties', 'Australian'] },
      ],
    },
    'dialect-features': {
      type: 'classify', instruction: 'Identify the dialect feature described.',
      items: [
        { prompt: '"Y\'all" as second person plural:', answer: 'Southern American English', options: ['Southern American English', 'British English', 'Australian English'] },
        { prompt: '"Youse" as second person plural:', answer: 'Irish English, some NYC English', options: ['Southern American English', 'Irish English, some NYC English', 'Canadian English'] },
        { prompt: 'Using "wee" to mean "small":', answer: 'Scottish/Northern Irish English', options: ['Scottish/Northern Irish English', 'Australian English', 'Indian English'] },
        { prompt: 'Habitual "be" (e.g., "She be working"):', answer: 'African American Vernacular English (AAVE)', options: ['African American Vernacular English (AAVE)', 'British RP', 'Australian English'] },
        { prompt: '"No worries" as a general response:', answer: 'Australian English (now widespread)', options: ['British English', 'Australian English (now widespread)', 'Canadian English'] },
        { prompt: '"Eh?" as a tag question (e.g., "Nice day, eh?"):', answer: 'Canadian English', options: ['Canadian English', 'Australian English', 'Indian English'] },
      ],
    },
    'global-englishes': {
      type: 'classify', instruction: 'Match the pronunciation feature to the English variety.',
      items: [
        { prompt: 'Syllable-timed rhythm (instead of stress-timed):', answer: 'Indian English, Nigerian English, Singaporean English', options: ['Indian English, Nigerian English, Singaporean English', 'British RP', 'General American'] },
        { prompt: 'Retroflex consonants (tongue curled back for /t/, /d/):', answer: 'Indian English', options: ['Indian English', 'Australian English', 'South African English'] },
        { prompt: 'Merging of /v/ and /w/:', answer: 'some varieties of Indian English, German-influenced English', options: ['some varieties of Indian English, German-influenced English', 'American English', 'Australian English'] },
        { prompt: 'Final consonant cluster reduction (e.g., "tes" for "test"):', answer: 'common in many L2 English varieties worldwide', options: ['only in Asian Englishes', 'common in many L2 English varieties worldwide', 'only in African Englishes'] },
        { prompt: 'Distinctive use of particles (e.g., "lah", "leh"):', answer: 'Singaporean/Malaysian English (Singlish)', options: ['Indian English', 'Singaporean/Malaysian English (Singlish)', 'Nigerian English'] },
        { prompt: 'Vowel system closer to 5 vowels rather than 12+:', answer: 'many L2 English varieties (influenced by L1 vowel inventory)', options: ['many L2 English varieties (influenced by L1 vowel inventory)', 'British RP', 'General American'] },
      ],
    },
    'rapid-speech-decoding': {
      type: 'classify', instruction: 'Decode what is being said in rapid natural speech.',
      items: [
        { prompt: '"Djeetyet?" in rapid American English means:', answer: '"Did you eat yet?"', options: ['"Did you eat yet?"', '"Did you cheat yet?"', '"Do you need yet?"'] },
        { prompt: '"Whatcha gonna do?" in rapid speech represents:', answer: '"What are you going to do?"', options: ['"What are you going to do?"', '"What did you do?"', '"What can you do?"'] },
        { prompt: '"Ahmna go" in rapid speech means:', answer: '"I\'m going to go" (I\'m-uh-nuh)', options: ['"I\'m going to go" (I\'m-uh-nuh)', '"I am going"', '"I want to go"'] },
        { prompt: '"Lemme" in rapid speech represents:', answer: '"Let me"', options: ['"Let me"', '"Lemon"', '"Leave me"'] },
        { prompt: '"Coulda shoulda woulda" represents:', answer: '"Could have, should have, would have"', options: ['"Could have, should have, would have"', '"Could, should, would"', '"Could a, should a, would a"'] },
        { prompt: '"Dunno" in rapid speech means:', answer: '"I don\'t know"', options: ['"I don\'t know"', '"Done now"', '"Do no"'] },
      ],
    },
    'coarticulation': {
      type: 'classify', instruction: 'What coarticulation process is occurring?',
      items: [
        { prompt: '"Did you" → /dɪdʒuː/ — what is this process?', answer: 'palatalization (/d/ + /j/ → /dʒ/)', options: ['palatalization (/d/ + /j/ → /dʒ/)', 'assimilation', 'elision'] },
        { prompt: '"Won\'t you" → /wəʊntʃuː/ — what is this process?', answer: 'palatalization (/t/ + /j/ → /tʃ/)', options: ['palatalization (/t/ + /j/ → /tʃ/)', 'elision', 'linking'] },
        { prompt: 'The /k/ in "key" is produced further forward than in "car". Why?', answer: 'anticipatory coarticulation (tongue anticipates the front vowel /iː/)', options: ['anticipatory coarticulation (tongue anticipates the front vowel /iː/)', 'different phonemes', 'accent variation'] },
        { prompt: 'The /l/ in "feel" sounds different from the /l/ in "leaf". Why?', answer: 'allophonic variation (clear /l/ vs dark /l/)', options: ['allophonic variation (clear /l/ vs dark /l/)', 'they are different sounds', 'context doesn\'t matter'] },
        { prompt: '"Handbag" → /hæmbæɡ/ — what process affects the /n/?', answer: 'regressive assimilation (/n/ → /m/ before /b/)', options: ['regressive assimilation (/n/ → /m/ before /b/)', 'elision', 'progressive assimilation'] },
        { prompt: 'Nasalization of vowels before nasal consonants (e.g., /æ/ in "man"):', answer: 'anticipatory nasalization (velum lowers early)', options: ['anticipatory nasalization (velum lowers early)', 'a separate phoneme', 'accent feature'] },
      ],
    },
    'prosodic-style-shifting': {
      type: 'classify', instruction: 'How should prosody shift for this communicative context?',
      items: [
        { prompt: 'Moving from a casual chat to a formal presentation:', answer: 'slower rate, wider pitch range, clearer articulation, longer pauses', options: ['slower rate, wider pitch range, clearer articulation, longer pauses', 'faster rate, narrower range', 'no change needed'] },
        { prompt: 'Moving from lecturing to answering a student\'s personal question:', answer: 'narrower pitch range, softer volume, warmer voice quality', options: ['louder, more emphatic', 'narrower pitch range, softer volume, warmer voice quality', 'faster and more clipped'] },
        { prompt: 'Moving from reporting news to delivering a personal opinion:', answer: 'more varied pitch, slightly slower, more emphasis on evaluative words', options: ['flatter, more monotone', 'more varied pitch, slightly slower, more emphasis on evaluative words', 'louder throughout'] },
        { prompt: 'Moving from English to code-switching with another language:', answer: 'prosodic features may shift to match the other language\'s rhythm and intonation', options: ['prosodic features may shift to match the other language\'s rhythm and intonation', 'English prosody is maintained', 'volume decreases'] },
        { prompt: 'Moving from a serious discussion to telling a joke:', answer: 'timing becomes more deliberate, pitch range widens, voice quality may become more playful', options: ['timing becomes more deliberate, pitch range widens, voice quality may become more playful', 'monotone delivery', 'faster and quieter'] },
        { prompt: 'Moving from speaking to one person to addressing a crowd:', answer: 'increased volume, slower rate, wider pitch range, longer pauses between phrases', options: ['increased volume, slower rate, wider pitch range, longer pauses between phrases', 'same as one-to-one', 'faster to keep attention'] },
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

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 '\/]/g, ''); }

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
  return norm(expected) === norm(answer);
}

// Public API

class Pronunciation {
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
        model: `Describe the target sound/pattern for: ${target.category} → ${target.skill}`,
        discriminate: 'Minimal pair or listening discrimination activities',
        practice: `Complete ${exercise.count || 0} pronunciation items`,
        produce: 'Student produces the target sounds in words and sentences',
      },
    };
  }
}

module.exports = Pronunciation;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const pr = new Pronunciation();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, level] = args;
        if (!id) throw new Error('Usage: start <id> [level]');
        if (level) pr.setLevel(id, level);
        out({ action: 'start', profile: pr.getProfile(id), nextSkills: pr.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(pr.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const level = loadProfile(id).level || 'a1';
        if (skill) { out(pr.generateExercise(level, skill, 5)); }
        else { const n = pr.getNextSkills(id, 1).next; out(n.length ? pr.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient at current level!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(pr.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, level, cat, skill, sc, tot, ...notes] = args;
        if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total> [notes]');
        out(pr.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(pr.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(pr.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(pr.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? pr.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(pr.setLevel(id, l)); break; }
      case 'students': { out(pr.listStudents()); break; }
      default: out({ usage: 'node pronunciation.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
