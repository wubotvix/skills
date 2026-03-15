// English Vocabulary Builder (A1-C2). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'english-vocabulary');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'a1': {
    'everyday-nouns': ['family', 'food-drink', 'home-objects', 'body-parts'],
    'basic-verbs': ['daily-routines', 'common-actions'],
    'basic-adjectives': ['colours-shapes', 'feelings-basic', 'size-quantity'],
    'numbers-time': ['numbers-1-100', 'days-months', 'telling-time'],
  },
  'a2': {
    'travel': ['transport', 'directions', 'accommodation'],
    'shopping-services': ['shops-products', 'money-prices'],
    'health-body': ['illness-symptoms', 'doctor-pharmacy'],
    'weather-nature': ['weather-words', 'animals-nature'],
    'phrasal-verbs-basic': ['get-phrasal', 'go-phrasal', 'take-phrasal'],
  },
  'b1': {
    'work-education': ['jobs-workplace', 'education-study'],
    'emotions-opinions': ['emotions-advanced', 'opinion-expressions'],
    'collocations': ['verb-noun-collocations', 'adjective-noun-collocations'],
    'word-formation': ['prefixes-basic', 'suffixes-basic'],
    'idioms-intro': ['body-idioms', 'animal-idioms'],
  },
  'b2': {
    'academic-vocabulary': ['awl-set-1', 'awl-set-2'],
    'advanced-collocations': ['adverb-adjective', 'verb-preposition'],
    'phrasal-verbs-advanced': ['bring-phrasal', 'come-phrasal', 'put-phrasal'],
    'idioms-advanced': ['business-idioms', 'time-idioms'],
    'register': ['formal-informal-pairs', 'academic-vs-general'],
  },
  'c1': {
    'nuanced-synonyms': ['say-synonyms', 'big-synonyms', 'good-bad-synonyms'],
    'nominalization': ['verb-to-noun', 'adjective-to-noun'],
    'connotation': ['positive-negative-neutral', 'euphemism-dysphemism'],
    'academic-advanced': ['awl-set-3', 'discipline-specific'],
  },
  'c2': {
    'low-frequency': ['literary-vocabulary', 'archaic-formal'],
    'figurative': ['metaphor-metonymy', 'irony-understatement'],
    'domain-specific': ['legal-vocabulary', 'scientific-vocabulary'],
  },
};

const ITEM_BANKS = {
  'a1': {
    'family': {
      type: 'definition-match',
      instruction: 'Match the word to its definition.',
      items: [
        { word: 'mother', definition: 'a female parent', options: ['a female parent', 'a male parent', 'a female child', 'a male child'] },
        { word: 'brother', definition: 'a male sibling', options: ['a male parent', 'a male sibling', 'a female sibling', 'a male child'] },
        { word: 'grandmother', definition: 'the mother of your parent', options: ['the mother of your parent', 'the sister of your parent', 'a female parent', 'an older sister'] },
        { word: 'uncle', definition: 'the brother of your parent', options: ['the brother of your parent', 'the father of your parent', 'a male cousin', 'a male sibling'] },
        { word: 'cousin', definition: 'the child of your aunt or uncle', options: ['the child of your aunt or uncle', 'the child of your brother', 'a close friend', 'your sibling'] },
        { word: 'nephew', definition: 'the son of your brother or sister', options: ['the son of your brother or sister', 'the daughter of your brother', 'your male cousin', 'your grandson'] },
        { word: 'daughter', definition: 'a female child', options: ['a female parent', 'a female sibling', 'a female child', 'an aunt'] },
        { word: 'husband', definition: 'a married man', options: ['a married man', 'a married woman', 'a boyfriend', 'a male friend'] },
      ],
    },
    'food-drink': {
      type: 'fill-in-context',
      instruction: 'Fill in the blank with the correct food/drink word.',
      items: [
        { sentence: 'I had ___ and toast for breakfast.', answer: 'eggs', options: ['eggs', 'soup', 'steak', 'salad'] },
        { sentence: 'Can I have a glass of ___?', answer: 'water', options: ['water', 'bread', 'rice', 'cheese'] },
        { sentence: 'She put ___ and sugar in her tea.', answer: 'milk', options: ['milk', 'salt', 'pepper', 'oil'] },
        { sentence: 'We had ___ with tomato sauce for dinner.', answer: 'pasta', options: ['pasta', 'juice', 'coffee', 'cake'] },
        { sentence: 'He likes ___ on his sandwich.', answer: 'cheese', options: ['cheese', 'tea', 'soup', 'juice'] },
        { sentence: 'I bought a bag of ___ at the market.', answer: 'rice', options: ['rice', 'wine', 'beer', 'milk'] },
        { sentence: 'For dessert, we had chocolate ___.', answer: 'cake', options: ['cake', 'bread', 'fish', 'meat'] },
        { sentence: 'She drinks ___ every morning.', answer: 'coffee', options: ['coffee', 'bread', 'chicken', 'butter'] },
      ],
    },
    'home-objects': {
      type: 'definition-match',
      instruction: 'Match the word to its definition.',
      items: [
        { word: 'chair', definition: 'a piece of furniture for sitting', options: ['a piece of furniture for sitting', 'a piece of furniture for sleeping', 'a kitchen tool', 'a bathroom item'] },
        { word: 'fridge', definition: 'keeps food cold', options: ['keeps food cold', 'cooks food', 'washes clothes', 'heats the room'] },
        { word: 'lamp', definition: 'gives light', options: ['gives light', 'keeps food cold', 'plays music', 'tells time'] },
        { word: 'pillow', definition: 'you rest your head on it', options: ['you rest your head on it', 'you sit on it', 'you eat on it', 'you write on it'] },
        { word: 'mirror', definition: 'you can see yourself in it', options: ['you can see yourself in it', 'you sit on it', 'you cook with it', 'you open doors with it'] },
        { word: 'towel', definition: 'you dry yourself with it', options: ['you dry yourself with it', 'you cook with it', 'you write with it', 'you sleep under it'] },
        { word: 'shelf', definition: 'holds books or objects on a wall', options: ['holds books or objects on a wall', 'a piece of furniture for sitting', 'keeps food cold', 'gives light'] },
        { word: 'blanket', definition: 'keeps you warm in bed', options: ['keeps you warm in bed', 'keeps food cold', 'you dry yourself with it', 'gives light'] },
      ],
    },
    'body-parts': {
      type: 'fill-in-context',
      instruction: 'Fill in with the correct body part.',
      items: [
        { sentence: 'She wears glasses on her ___.', answer: 'nose', options: ['nose', 'hand', 'foot', 'knee'] },
        { sentence: 'He hurt his ___ playing football.', answer: 'knee', options: ['knee', 'ear', 'eye', 'tooth'] },
        { sentence: 'She has long ___.', answer: 'hair', options: ['hair', 'teeth', 'fingers', 'arms'] },
        { sentence: 'I write with my right ___.', answer: 'hand', options: ['hand', 'foot', 'head', 'back'] },
        { sentence: 'The baby has blue ___.', answer: 'eyes', options: ['eyes', 'hands', 'legs', 'ears'] },
        { sentence: 'He wears a hat on his ___.', answer: 'head', options: ['head', 'foot', 'hand', 'back'] },
        { sentence: 'My ___ hurts from too much walking.', answer: 'foot', options: ['foot', 'hand', 'eye', 'ear'] },
        { sentence: 'She listens to music with her ___.', answer: 'ears', options: ['ears', 'eyes', 'hands', 'nose'] },
      ],
    },
    'daily-routines': {
      type: 'fill-in-context',
      instruction: 'Fill in with the correct verb.',
      items: [
        { sentence: 'I ___ up at 7 AM every day.', answer: 'wake', options: ['wake', 'eat', 'go', 'wash'] },
        { sentence: 'She ___ a shower before breakfast.', answer: 'takes', options: ['takes', 'makes', 'does', 'goes'] },
        { sentence: 'We ___ breakfast at 8 o\'clock.', answer: 'have', options: ['have', 'make', 'take', 'do'] },
        { sentence: 'He ___ to work by bus.', answer: 'goes', options: ['goes', 'takes', 'does', 'has'] },
        { sentence: 'I ___ my teeth before bed.', answer: 'brush', options: ['brush', 'wash', 'clean', 'take'] },
        { sentence: 'She ___ dinner for the family.', answer: 'cooks', options: ['cooks', 'eats', 'does', 'takes'] },
        { sentence: 'They ___ TV in the evening.', answer: 'watch', options: ['watch', 'look', 'see', 'hear'] },
        { sentence: 'I ___ to bed at 11 PM.', answer: 'go', options: ['go', 'take', 'have', 'do'] },
      ],
    },
    'common-actions': {
      type: 'definition-match',
      instruction: 'Match the verb to its meaning.',
      items: [
        { word: 'buy', definition: 'to get something by paying money', options: ['to get something by paying money', 'to give something away', 'to make something', 'to break something'] },
        { word: 'open', definition: 'to make something not closed', options: ['to make something not closed', 'to make something closed', 'to break something', 'to fix something'] },
        { word: 'carry', definition: 'to hold and move something', options: ['to hold and move something', 'to throw something', 'to drop something', 'to hide something'] },
        { word: 'find', definition: 'to discover something', options: ['to discover something', 'to lose something', 'to hide something', 'to break something'] },
        { word: 'give', definition: 'to let someone have something', options: ['to let someone have something', 'to take something', 'to keep something', 'to sell something'] },
        { word: 'help', definition: 'to make it easier for someone', options: ['to make it easier for someone', 'to make it harder', 'to stop someone', 'to watch someone'] },
        { word: 'send', definition: 'to make something go to another place', options: ['to make something go to another place', 'to receive something', 'to keep something', 'to hide something'] },
        { word: 'wait', definition: 'to stay until something happens', options: ['to stay until something happens', 'to leave quickly', 'to run away', 'to arrive early'] },
      ],
    },
    'colours-shapes': {
      type: 'fill-in-context',
      instruction: 'Fill in the blank with a colour or shape.',
      items: [
        { sentence: 'The sky is ___ on a clear day.', answer: 'blue', options: ['blue', 'red', 'green', 'black'] },
        { sentence: 'A stop sign is ___.', answer: 'red', options: ['red', 'blue', 'green', 'yellow'] },
        { sentence: 'Grass is ___.', answer: 'green', options: ['green', 'blue', 'red', 'white'] },
        { sentence: 'A ball is ___ in shape.', answer: 'round', options: ['round', 'square', 'flat', 'long'] },
        { sentence: 'Snow is ___.', answer: 'white', options: ['white', 'black', 'grey', 'brown'] },
        { sentence: 'A box is ___ in shape.', answer: 'square', options: ['square', 'round', 'oval', 'long'] },
        { sentence: 'Bananas are ___.', answer: 'yellow', options: ['yellow', 'blue', 'red', 'white'] },
        { sentence: 'An egg is ___ in shape.', answer: 'oval', options: ['oval', 'square', 'flat', 'round'] },
      ],
    },
    'feelings-basic': {
      type: 'definition-match',
      instruction: 'Match the feeling to its meaning.',
      items: [
        { word: 'happy', definition: 'feeling good and pleased', options: ['feeling good and pleased', 'feeling bad', 'feeling scared', 'feeling tired'] },
        { word: 'angry', definition: 'feeling very annoyed', options: ['feeling very annoyed', 'feeling happy', 'feeling scared', 'feeling sad'] },
        { word: 'tired', definition: 'needing rest or sleep', options: ['needing rest or sleep', 'feeling excited', 'feeling hungry', 'feeling cold'] },
        { word: 'hungry', definition: 'wanting to eat', options: ['wanting to eat', 'wanting to sleep', 'wanting to play', 'wanting to leave'] },
        { word: 'scared', definition: 'feeling afraid', options: ['feeling afraid', 'feeling happy', 'feeling angry', 'feeling bored'] },
        { word: 'bored', definition: 'not interested; nothing to do', options: ['not interested; nothing to do', 'very excited', 'very tired', 'very hungry'] },
        { word: 'surprised', definition: 'not expecting something', options: ['not expecting something', 'expecting something', 'wanting something', 'needing something'] },
        { word: 'thirsty', definition: 'wanting to drink', options: ['wanting to drink', 'wanting to eat', 'wanting to sleep', 'wanting to run'] },
      ],
    },
    'size-quantity': {
      type: 'fill-in-context',
      instruction: 'Fill in with the correct word.',
      items: [
        { sentence: 'An elephant is very ___.', answer: 'big', options: ['big', 'small', 'thin', 'short'] },
        { sentence: 'A mouse is very ___.', answer: 'small', options: ['small', 'big', 'tall', 'heavy'] },
        { sentence: 'The Nile is a ___ river.', answer: 'long', options: ['long', 'short', 'small', 'thin'] },
        { sentence: 'She is ___ — she can reach the top shelf.', answer: 'tall', options: ['tall', 'short', 'small', 'thin'] },
        { sentence: 'This bag is very ___. I can\'t lift it.', answer: 'heavy', options: ['heavy', 'light', 'small', 'thin'] },
        { sentence: 'A feather is very ___.', answer: 'light', options: ['light', 'heavy', 'big', 'long'] },
        { sentence: 'The road is very ___. Two cars can\'t pass.', answer: 'narrow', options: ['narrow', 'wide', 'long', 'short'] },
        { sentence: 'The swimming pool is very ___.', answer: 'deep', options: ['deep', 'shallow', 'narrow', 'thin'] },
      ],
    },
    'numbers-1-100': {
      type: 'fill-in-context',
      instruction: 'Write the number word.',
      items: [
        { sentence: 'There are ___ days in a week.', answer: 'seven', options: ['five', 'six', 'seven', 'eight'] },
        { sentence: 'A year has ___ months.', answer: 'twelve', options: ['ten', 'eleven', 'twelve', 'thirteen'] },
        { sentence: 'A century is ___ years.', answer: 'one hundred', options: ['fifty', 'one hundred', 'one thousand', 'ten'] },
        { sentence: 'There are ___ hours in a day.', answer: 'twenty-four', options: ['twelve', 'twenty', 'twenty-four', 'thirty'] },
        { sentence: 'A dozen means ___.', answer: 'twelve', options: ['ten', 'twelve', 'twenty', 'fifteen'] },
        { sentence: 'She is ___ years old. (15)', answer: 'fifteen', options: ['thirteen', 'fourteen', 'fifteen', 'sixteen'] },
        { sentence: 'Half of 100 is ___.', answer: 'fifty', options: ['twenty-five', 'fifty', 'seventy-five', 'forty'] },
        { sentence: 'A triangle has ___ sides.', answer: 'three', options: ['two', 'three', 'four', 'five'] },
      ],
    },
    'days-months': {
      type: 'fill-in-context',
      instruction: 'Fill in the blank.',
      items: [
        { sentence: 'The first day of the week is ___.', answer: 'Monday', options: ['Monday', 'Sunday', 'Saturday', 'Tuesday'] },
        { sentence: 'Christmas is in ___.', answer: 'December', options: ['November', 'December', 'January', 'October'] },
        { sentence: 'The weekend days are Saturday and ___.', answer: 'Sunday', options: ['Sunday', 'Friday', 'Monday', 'Thursday'] },
        { sentence: 'Valentine\'s Day is in ___.', answer: 'February', options: ['January', 'February', 'March', 'April'] },
        { sentence: 'The day after Wednesday is ___.', answer: 'Thursday', options: ['Tuesday', 'Thursday', 'Friday', 'Monday'] },
        { sentence: 'Summer begins in ___ (Northern Hemisphere).', answer: 'June', options: ['May', 'June', 'July', 'August'] },
        { sentence: 'The last month of the year is ___.', answer: 'December', options: ['November', 'December', 'October', 'January'] },
        { sentence: 'The day before Saturday is ___.', answer: 'Friday', options: ['Thursday', 'Friday', 'Sunday', 'Wednesday'] },
      ],
    },
    'telling-time': {
      type: 'fill-in-context',
      instruction: 'Choose the correct time expression.',
      items: [
        { sentence: '3:00 = ___ o\'clock', answer: 'three', options: ['two', 'three', 'four', 'five'] },
        { sentence: '6:30 = half past ___', answer: 'six', options: ['five', 'six', 'seven', 'eight'] },
        { sentence: '4:15 = quarter past ___', answer: 'four', options: ['three', 'four', 'five', 'six'] },
        { sentence: '8:45 = quarter to ___', answer: 'nine', options: ['eight', 'nine', 'ten', 'seven'] },
        { sentence: '12:00 (day) = ___', answer: 'noon', options: ['noon', 'midnight', 'morning', 'evening'] },
        { sentence: '12:00 (night) = ___', answer: 'midnight', options: ['noon', 'midnight', 'evening', 'dawn'] },
        { sentence: '2:30 PM = half past two in the ___', answer: 'afternoon', options: ['morning', 'afternoon', 'evening', 'night'] },
        { sentence: '7:00 AM = seven o\'clock in the ___', answer: 'morning', options: ['morning', 'afternoon', 'evening', 'night'] },
      ],
    },
  },
  'a2': {
    'transport': {
      type: 'fill-in-context', instruction: 'Fill in with the correct transport word.',
      items: [
        { sentence: 'I take the ___ to work every morning.', answer: 'bus', options: ['bus', 'bicycle', 'plane', 'boat'] },
        { sentence: 'We flew to Paris by ___.', answer: 'plane', options: ['plane', 'bus', 'car', 'train'] },
        { sentence: 'She rides her ___ to school.', answer: 'bicycle', options: ['bicycle', 'plane', 'boat', 'taxi'] },
        { sentence: 'The ___ goes from London to Paris under the sea.', answer: 'train', options: ['train', 'bus', 'car', 'bike'] },
        { sentence: 'We took a ___ across the river.', answer: 'boat', options: ['boat', 'car', 'bus', 'plane'] },
        { sentence: 'I called a ___ because it was raining.', answer: 'taxi', options: ['taxi', 'bicycle', 'boat', 'train'] },
        { sentence: 'The ___ stop is on the corner.', answer: 'bus', options: ['bus', 'plane', 'boat', 'car'] },
        { sentence: 'She drives her ___ to the office.', answer: 'car', options: ['car', 'plane', 'boat', 'bicycle'] },
      ],
    },
    'directions': {
      type: 'fill-in-context', instruction: 'Fill in with the correct direction word.',
      items: [
        { sentence: 'Go ___ at the traffic lights.', answer: 'straight', options: ['straight', 'up', 'down', 'around'] },
        { sentence: 'Turn ___ at the bank.', answer: 'left', options: ['left', 'up', 'down', 'back'] },
        { sentence: 'The park is ___ the supermarket.', answer: 'opposite', options: ['opposite', 'inside', 'under', 'above'] },
        { sentence: 'The school is ___ to the hospital.', answer: 'next', options: ['next', 'under', 'behind', 'above'] },
        { sentence: 'Walk ___ the bridge to the other side.', answer: 'across', options: ['across', 'under', 'into', 'above'] },
        { sentence: 'The cinema is ___ the corner.', answer: 'around', options: ['around', 'into', 'above', 'under'] },
        { sentence: 'Go ___ the street for 100 metres.', answer: 'along', options: ['along', 'into', 'under', 'above'] },
        { sentence: 'The restaurant is ___ the first and second floor.', answer: 'between', options: ['between', 'above', 'under', 'around'] },
      ],
    },
    'accommodation': {
      type: 'definition-match', instruction: 'Match the word to its meaning.',
      items: [
        { word: 'hotel', definition: 'a building where you pay to sleep', options: ['a building where you pay to sleep', 'a type of restaurant', 'a kind of shop', 'a public park'] },
        { word: 'reservation', definition: 'booking a room in advance', options: ['booking a room in advance', 'checking out', 'cleaning a room', 'paying a bill'] },
        { word: 'reception', definition: 'the desk where you check in', options: ['the desk where you check in', 'the restaurant', 'the swimming pool', 'the car park'] },
        { word: 'single room', definition: 'a room for one person', options: ['a room for one person', 'a room for two', 'a shared room', 'a suite'] },
        { word: 'check out', definition: 'to leave and pay at the end', options: ['to leave and pay at the end', 'to arrive and get a key', 'to book a room', 'to clean a room'] },
        { word: 'hostel', definition: 'cheap accommodation with shared rooms', options: ['cheap accommodation with shared rooms', 'a luxury hotel', 'a restaurant', 'a hospital'] },
      ],
    },
    'shops-products': {
      type: 'fill-in-context', instruction: 'Fill in with the correct shop or product.',
      items: [
        { sentence: 'I buy bread at the ___.', answer: 'bakery', options: ['bakery', 'pharmacy', 'bookshop', 'butcher'] },
        { sentence: 'She bought medicine at the ___.', answer: 'pharmacy', options: ['pharmacy', 'bakery', 'bank', 'market'] },
        { sentence: 'We get meat from the ___.', answer: 'butcher', options: ['butcher', 'bakery', 'florist', 'newsagent'] },
        { sentence: 'He bought flowers at the ___.', answer: 'florist', options: ['florist', 'butcher', 'bakery', 'bank'] },
        { sentence: 'I need to get cash from the ___.', answer: 'bank', options: ['bank', 'bakery', 'pharmacy', 'florist'] },
        { sentence: 'She bought a novel at the ___.', answer: 'bookshop', options: ['bookshop', 'bank', 'florist', 'butcher'] },
      ],
    },
    'money-prices': {
      type: 'fill-in-context', instruction: 'Fill in with the correct money word.',
      items: [
        { sentence: 'How much does this ___?', answer: 'cost', options: ['cost', 'pay', 'spend', 'buy'] },
        { sentence: 'Can I pay by ___?', answer: 'card', options: ['card', 'coin', 'money', 'price'] },
        { sentence: 'The ___ for this shirt is $25.', answer: 'price', options: ['price', 'cost', 'money', 'change'] },
        { sentence: 'Here is your ___. (money returned)', answer: 'change', options: ['change', 'receipt', 'price', 'bill'] },
        { sentence: 'Could I have the ___, please? (in a restaurant)', answer: 'bill', options: ['bill', 'change', 'price', 'tip'] },
        { sentence: 'This bag is on ___. It was $50, now $30.', answer: 'sale', options: ['sale', 'cost', 'price', 'bill'] },
        { sentence: 'I ___ too much money last month.', answer: 'spent', options: ['spent', 'cost', 'paid', 'bought'] },
        { sentence: 'Do you have a ___? (proof of purchase)', answer: 'receipt', options: ['receipt', 'bill', 'change', 'card'] },
      ],
    },
    'illness-symptoms': {
      type: 'fill-in-context', instruction: 'Fill in with the correct health word.',
      items: [
        { sentence: 'I have a ___ — my head hurts.', answer: 'headache', options: ['headache', 'stomachache', 'toothache', 'backache'] },
        { sentence: 'She has a high ___.', answer: 'temperature', options: ['temperature', 'cold', 'cough', 'pain'] },
        { sentence: 'He has a sore ___.', answer: 'throat', options: ['throat', 'stomach', 'back', 'leg'] },
        { sentence: 'I\'ve been ___ all day. (vomiting)', answer: 'sick', options: ['sick', 'cold', 'tired', 'hungry'] },
        { sentence: 'She ___ and needs a tissue.', answer: 'sneezes', options: ['sneezes', 'bleeds', 'faints', 'sweats'] },
        { sentence: 'He broke his ___ playing sports.', answer: 'arm', options: ['arm', 'cold', 'fever', 'cough'] },
        { sentence: 'I feel ___ — I need to sit down.', answer: 'dizzy', options: ['dizzy', 'hungry', 'happy', 'strong'] },
        { sentence: 'I caught a ___ from the rain.', answer: 'cold', options: ['cold', 'headache', 'pain', 'cut'] },
      ],
    },
    'doctor-pharmacy': {
      type: 'definition-match', instruction: 'Match the word to its meaning.',
      items: [
        { word: 'prescription', definition: 'a doctor\'s note for medicine', options: ['a doctor\'s note for medicine', 'a medical test', 'a type of surgery', 'an appointment'] },
        { word: 'appointment', definition: 'a scheduled visit to the doctor', options: ['a scheduled visit to the doctor', 'medicine from the pharmacy', 'a hospital bed', 'a medical test'] },
        { word: 'injection', definition: 'medicine given with a needle', options: ['medicine given with a needle', 'medicine in pill form', 'a bandage', 'a type of cream'] },
        { word: 'bandage', definition: 'a strip to cover a wound', options: ['a strip to cover a wound', 'a type of pill', 'a medical test', 'a doctor\'s tool'] },
        { word: 'tablet', definition: 'a pill you swallow', options: ['a pill you swallow', 'a liquid medicine', 'a type of injection', 'a bandage'] },
        { word: 'symptoms', definition: 'signs that you are ill', options: ['signs that you are ill', 'types of medicine', 'medical tests', 'doctor\'s tools'] },
      ],
    },
    'weather-words': {
      type: 'fill-in-context', instruction: 'Fill in with the correct weather word.',
      items: [
        { sentence: 'It\'s very ___ today — the sun is shining.', answer: 'sunny', options: ['sunny', 'rainy', 'cloudy', 'snowy'] },
        { sentence: 'Take an umbrella — it\'s ___.', answer: 'raining', options: ['raining', 'sunny', 'hot', 'dry'] },
        { sentence: 'The ___ is very strong today. Hold your hat!', answer: 'wind', options: ['wind', 'rain', 'snow', 'sun'] },
        { sentence: 'It\'s ___ outside — wear a warm coat.', answer: 'freezing', options: ['freezing', 'boiling', 'sunny', 'dry'] },
        { sentence: 'There was a ___ last night with thunder and lightning.', answer: 'storm', options: ['storm', 'breeze', 'sunshine', 'heatwave'] },
        { sentence: 'The ___ is very thick — I can\'t see the road.', answer: 'fog', options: ['fog', 'rain', 'snow', 'wind'] },
      ],
    },
    'animals-nature': {
      type: 'definition-match', instruction: 'Match the word to its meaning.',
      items: [
        { word: 'forest', definition: 'a large area with many trees', options: ['a large area with many trees', 'a body of water', 'a mountain', 'a desert'] },
        { word: 'island', definition: 'land surrounded by water', options: ['land surrounded by water', 'a large area with trees', 'a high mountain', 'a deep valley'] },
        { word: 'whale', definition: 'the largest animal in the sea', options: ['the largest animal in the sea', 'a small fish', 'a type of bird', 'a land animal'] },
        { word: 'eagle', definition: 'a large bird that hunts', options: ['a large bird that hunts', 'a small singing bird', 'a sea animal', 'an insect'] },
        { word: 'desert', definition: 'a very dry area with sand', options: ['a very dry area with sand', 'a wet jungle', 'a frozen land', 'a forest'] },
        { word: 'waterfall', definition: 'water falling from a high place', options: ['water falling from a high place', 'a slow river', 'a deep lake', 'a small pond'] },
      ],
    },
    'get-phrasal': {
      type: 'fill-in-context', instruction: 'Fill in with the correct phrasal verb with "get".',
      items: [
        { sentence: 'I need to ___ early tomorrow.', answer: 'get up', options: ['get up', 'get on', 'get off', 'get over'] },
        { sentence: 'She ___ the bus at the next stop.', answer: 'gets off', options: ['gets off', 'gets up', 'gets on', 'gets over'] },
        { sentence: 'He can\'t ___ the flu.', answer: 'get over', options: ['get over', 'get up', 'get on', 'get off'] },
        { sentence: 'We ___ well with our neighbours.', answer: 'get on', options: ['get on', 'get off', 'get up', 'get over'] },
        { sentence: 'Please ___ here as soon as possible.', answer: 'get back', options: ['get back', 'get up', 'get on', 'get off'] },
        { sentence: 'I need to ___ this work by Friday.', answer: 'get through', options: ['get through', 'get up', 'get on', 'get over'] },
      ],
    },
    'go-phrasal': {
      type: 'fill-in-context', instruction: 'Fill in with the correct phrasal verb with "go".',
      items: [
        { sentence: 'The alarm ___ at 6 AM.', answer: 'goes off', options: ['goes off', 'goes on', 'goes out', 'goes up'] },
        { sentence: 'Prices ___ every year.', answer: 'go up', options: ['go up', 'go down', 'go off', 'go out'] },
        { sentence: 'Let\'s ___ for dinner tonight.', answer: 'go out', options: ['go out', 'go off', 'go on', 'go up'] },
        { sentence: 'Please ___ — I\'m listening.', answer: 'go on', options: ['go on', 'go out', 'go off', 'go back'] },
        { sentence: 'The lights ___ during the storm.', answer: 'went out', options: ['went out', 'went off', 'went on', 'went up'] },
        { sentence: 'We need to ___ to the shop and return the item.', answer: 'go back', options: ['go back', 'go out', 'go on', 'go off'] },
      ],
    },
    'take-phrasal': {
      type: 'fill-in-context', instruction: 'Fill in with the correct phrasal verb with "take".',
      items: [
        { sentence: 'The plane ___ at 3 PM.', answer: 'takes off', options: ['takes off', 'takes on', 'takes up', 'takes over'] },
        { sentence: 'She ___ her coat because it was warm.', answer: 'took off', options: ['took off', 'took on', 'took up', 'took over'] },
        { sentence: 'He ___ swimming last year.', answer: 'took up', options: ['took up', 'took off', 'took on', 'took over'] },
        { sentence: 'The new manager ___ last month.', answer: 'took over', options: ['took over', 'took off', 'took up', 'took on'] },
        { sentence: 'She ___ her mother in looks.', answer: 'takes after', options: ['takes after', 'takes off', 'takes up', 'takes on'] },
        { sentence: 'Can I ___ what I said? I\'m sorry.', answer: 'take back', options: ['take back', 'take off', 'take up', 'take on'] },
      ],
    },
  },
  'b1': {
    'jobs-workplace': {
      type: 'definition-match', instruction: 'Match the word to its meaning.',
      items: [
        { word: 'salary', definition: 'money paid monthly for work', options: ['money paid monthly for work', 'money paid hourly', 'extra money for good work', 'money for travel'] },
        { word: 'colleague', definition: 'a person you work with', options: ['a person you work with', 'your boss', 'a customer', 'a competitor'] },
        { word: 'deadline', definition: 'the last date to finish something', options: ['the last date to finish something', 'the start of a project', 'a meeting time', 'a break time'] },
        { word: 'promotion', definition: 'moving to a higher position at work', options: ['moving to a higher position at work', 'losing your job', 'starting a new company', 'retiring'] },
        { word: 'resign', definition: 'to leave your job voluntarily', options: ['to leave your job voluntarily', 'to be fired', 'to get promoted', 'to start working'] },
        { word: 'overtime', definition: 'extra hours worked beyond normal', options: ['extra hours worked beyond normal', 'a day off', 'a holiday', 'a lunch break'] },
        { word: 'applicant', definition: 'a person who applies for a job', options: ['a person who applies for a job', 'a person who hires', 'an employee', 'a manager'] },
        { word: 'commute', definition: 'the daily journey to/from work', options: ['the daily journey to/from work', 'a business trip', 'a vacation', 'a meeting'] },
      ],
    },
    'education-study': {
      type: 'fill-in-context', instruction: 'Fill in with the correct education word.',
      items: [
        { sentence: 'She got her ___ in Biology last year.', answer: 'degree', options: ['degree', 'lesson', 'homework', 'test'] },
        { sentence: 'The ___ for this essay is next Friday.', answer: 'deadline', options: ['deadline', 'lecture', 'grade', 'term'] },
        { sentence: 'He gave a ___ on climate change.', answer: 'presentation', options: ['presentation', 'exam', 'degree', 'homework'] },
        { sentence: 'I need to ___ for the exam tomorrow.', answer: 'revise', options: ['revise', 'graduate', 'enrol', 'drop'] },
        { sentence: 'She ___ in English Literature.', answer: 'majors', options: ['majors', 'fails', 'drops', 'enrols'] },
        { sentence: 'The ___ starts in September.', answer: 'semester', options: ['semester', 'lesson', 'lecture', 'exam'] },
        { sentence: 'I failed the ___ and have to retake it.', answer: 'exam', options: ['exam', 'degree', 'semester', 'lecture'] },
        { sentence: 'She wrote a 5000-word ___ on Shakespeare.', answer: 'essay', options: ['essay', 'exam', 'lecture', 'lesson'] },
      ],
    },
    'emotions-advanced': {
      type: 'definition-match', instruction: 'Match the emotion to its meaning.',
      items: [
        { word: 'frustrated', definition: 'annoyed because you cannot achieve something', options: ['annoyed because you cannot achieve something', 'very happy', 'very scared', 'very tired'] },
        { word: 'anxious', definition: 'worried about something that might happen', options: ['worried about something that might happen', 'excited about the future', 'angry at someone', 'bored with life'] },
        { word: 'relieved', definition: 'happy that something bad didn\'t happen', options: ['happy that something bad didn\'t happen', 'sad about a loss', 'angry at someone', 'confused about something'] },
        { word: 'jealous', definition: 'wanting what someone else has', options: ['wanting what someone else has', 'feeling sorry for someone', 'feeling proud', 'feeling embarrassed'] },
        { word: 'embarrassed', definition: 'feeling uncomfortable because of something you did', options: ['feeling uncomfortable because of something you did', 'feeling proud', 'feeling excited', 'feeling relaxed'] },
        { word: 'grateful', definition: 'feeling thankful', options: ['feeling thankful', 'feeling angry', 'feeling jealous', 'feeling confused'] },
        { word: 'overwhelmed', definition: 'feeling too much pressure or emotion', options: ['feeling too much pressure or emotion', 'feeling bored', 'feeling calm', 'feeling hungry'] },
        { word: 'nostalgic', definition: 'missing happy times in the past', options: ['missing happy times in the past', 'worried about the future', 'angry at the present', 'confused about life'] },
      ],
    },
    'opinion-expressions': {
      type: 'fill-in-context', instruction: 'Fill in with the correct opinion expression.',
      items: [
        { sentence: '___, I think this is a bad idea.', answer: 'Personally', options: ['Personally', 'Generally', 'Obviously', 'Apparently'] },
        { sentence: 'I ___ believe we should try again.', answer: 'strongly', options: ['strongly', 'weakly', 'slightly', 'hardly'] },
        { sentence: '___ my opinion, the plan won\'t work.', answer: 'In', options: ['In', 'At', 'On', 'By'] },
        { sentence: 'I\'m ___ sure about this.', answer: 'not', options: ['not', 'very', 'quite', 'too'] },
        { sentence: 'As ___ as I\'m concerned, it\'s fine.', answer: 'far', options: ['far', 'long', 'much', 'well'] },
        { sentence: 'I ___ with you on that point.', answer: 'agree', options: ['agree', 'disagree', 'think', 'believe'] },
      ],
    },
    'verb-noun-collocations': {
      type: 'fill-in-context', instruction: 'Choose the correct verb to complete the collocation.',
      items: [
        { sentence: '___ a decision', answer: 'make', options: ['make', 'do', 'take', 'have'] },
        { sentence: '___ homework', answer: 'do', options: ['do', 'make', 'take', 'have'] },
        { sentence: '___ a photo', answer: 'take', options: ['take', 'make', 'do', 'have'] },
        { sentence: '___ a mistake', answer: 'make', options: ['make', 'do', 'take', 'have'] },
        { sentence: '___ an exam', answer: 'take', options: ['take', 'make', 'do', 'have'] },
        { sentence: '___ a break', answer: 'have', options: ['have', 'make', 'do', 'take'] },
        { sentence: '___ progress', answer: 'make', options: ['make', 'do', 'take', 'have'] },
        { sentence: '___ research', answer: 'do', options: ['do', 'make', 'take', 'have'] },
        { sentence: '___ an effort', answer: 'make', options: ['make', 'do', 'take', 'have'] },
        { sentence: '___ the housework', answer: 'do', options: ['do', 'make', 'take', 'have'] },
      ],
    },
    'adjective-noun-collocations': {
      type: 'fill-in-context', instruction: 'Choose the correct adjective.',
      items: [
        { sentence: 'a ___ rain (very heavy)', answer: 'heavy', options: ['heavy', 'strong', 'big', 'large'] },
        { sentence: 'a ___ wind', answer: 'strong', options: ['strong', 'heavy', 'big', 'hard'] },
        { sentence: '___ traffic', answer: 'heavy', options: ['heavy', 'strong', 'big', 'hard'] },
        { sentence: 'a ___ smoker', answer: 'heavy', options: ['heavy', 'strong', 'big', 'hard'] },
        { sentence: '___ coffee (very strong)', answer: 'strong', options: ['strong', 'heavy', 'hard', 'big'] },
        { sentence: 'a ___ difference', answer: 'big', options: ['big', 'strong', 'heavy', 'hard'] },
        { sentence: '___ work', answer: 'hard', options: ['hard', 'heavy', 'strong', 'big'] },
        { sentence: 'the ___ majority', answer: 'vast', options: ['vast', 'big', 'heavy', 'strong'] },
      ],
    },
    'prefixes-basic': {
      type: 'word-formation', instruction: 'Add the correct prefix to make the opposite.',
      items: [
        { base: 'happy', answer: 'unhappy', prefix: 'un-' },
        { base: 'possible', answer: 'impossible', prefix: 'im-' },
        { base: 'agree', answer: 'disagree', prefix: 'dis-' },
        { base: 'regular', answer: 'irregular', prefix: 'ir-' },
        { base: 'patient', answer: 'impatient', prefix: 'im-' },
        { base: 'legal', answer: 'illegal', prefix: 'il-' },
        { base: 'fair', answer: 'unfair', prefix: 'un-' },
        { base: 'honest', answer: 'dishonest', prefix: 'dis-' },
        { base: 'polite', answer: 'impolite', prefix: 'im-' },
        { base: 'like', answer: 'dislike', prefix: 'dis-' },
      ],
    },
    'suffixes-basic': {
      type: 'word-formation', instruction: 'Add the correct suffix to form the new word.',
      items: [
        { base: 'teach', answer: 'teacher', suffix: '-er', pos: 'noun (person)' },
        { base: 'care', answer: 'careful', suffix: '-ful', pos: 'adjective' },
        { base: 'hope', answer: 'hopeless', suffix: '-less', pos: 'adjective' },
        { base: 'quick', answer: 'quickly', suffix: '-ly', pos: 'adverb' },
        { base: 'kind', answer: 'kindness', suffix: '-ness', pos: 'noun' },
        { base: 'enjoy', answer: 'enjoyment', suffix: '-ment', pos: 'noun' },
        { base: 'comfort', answer: 'comfortable', suffix: '-able', pos: 'adjective' },
        { base: 'act', answer: 'action', suffix: '-tion', pos: 'noun' },
      ],
    },
    'body-idioms': {
      type: 'definition-match', instruction: 'Match the idiom to its meaning.',
      items: [
        { word: 'cost an arm and a leg', definition: 'very expensive', options: ['very expensive', 'very cheap', 'very painful', 'very easy'] },
        { word: 'keep an eye on', definition: 'watch carefully', options: ['watch carefully', 'ignore', 'fight with', 'help someone'] },
        { word: 'give someone a hand', definition: 'help someone', options: ['help someone', 'hit someone', 'wave goodbye', 'shake hands'] },
        { word: 'get cold feet', definition: 'become nervous before an event', options: ['become nervous before an event', 'feel physically cold', 'run away', 'get sick'] },
        { word: 'break someone\'s heart', definition: 'make someone very sad', options: ['make someone very sad', 'make someone happy', 'surprise someone', 'make someone angry'] },
        { word: 'pull someone\'s leg', definition: 'joke with someone', options: ['joke with someone', 'hurt someone', 'help someone walk', 'trick someone'] },
      ],
    },
    'animal-idioms': {
      type: 'definition-match', instruction: 'Match the idiom to its meaning.',
      items: [
        { word: 'let the cat out of the bag', definition: 'reveal a secret', options: ['reveal a secret', 'release an animal', 'make a mess', 'start a fight'] },
        { word: 'raining cats and dogs', definition: 'raining very heavily', options: ['raining very heavily', 'animals falling', 'a pet shop', 'a zoo visit'] },
        { word: 'the elephant in the room', definition: 'an obvious problem no one mentions', options: ['an obvious problem no one mentions', 'a large animal', 'a crowded room', 'a big mistake'] },
        { word: 'kill two birds with one stone', definition: 'solve two problems at once', options: ['solve two problems at once', 'hurt animals', 'waste time', 'make a mistake'] },
        { word: 'a dark horse', definition: 'someone with hidden abilities', options: ['someone with hidden abilities', 'a scary animal', 'a night horse', 'a bad person'] },
        { word: 'straight from the horse\'s mouth', definition: 'from the original source', options: ['from the original source', 'from a stranger', 'from a book', 'from the internet'] },
      ],
    },
  },
  'b2': {
    'awl-set-1': {
      type: 'fill-in-context', instruction: 'Fill in with the correct academic word.',
      items: [
        { sentence: 'The research provides strong ___ for the theory.', answer: 'evidence', options: ['evidence', 'approach', 'context', 'method'] },
        { sentence: 'We need to ___ the data carefully before drawing conclusions.', answer: 'analyse', options: ['analyse', 'create', 'assume', 'define'] },
        { sentence: 'The ___ of the study is quite narrow.', answer: 'scope', options: ['scope', 'source', 'role', 'area'] },
        { sentence: 'This ___ is supported by recent findings.', answer: 'concept', options: ['concept', 'income', 'percent', 'sector'] },
        { sentence: 'The government needs to ___ a new policy.', answer: 'establish', options: ['establish', 'indicate', 'occur', 'derive'] },
        { sentence: 'Several ___ contributed to the failure.', answer: 'factors', options: ['factors', 'functions', 'formulas', 'features'] },
        { sentence: 'The ___ between the two groups was significant.', answer: 'contrast', options: ['contrast', 'context', 'concept', 'consent'] },
        { sentence: 'The study ___ that the treatment is effective.', answer: 'indicates', options: ['indicates', 'involves', 'issues', 'ignores'] },
      ],
    },
    'awl-set-2': {
      type: 'fill-in-context', instruction: 'Fill in with the correct academic word.',
      items: [
        { sentence: 'The results were ___ with previous studies.', answer: 'consistent', options: ['consistent', 'relevant', 'sufficient', 'apparent'] },
        { sentence: 'The ___ has been widely debated.', answer: 'issue', options: ['issue', 'item', 'image', 'impact'] },
        { sentence: 'We need to ___ an alternative solution.', answer: 'seek', options: ['seek', 'shift', 'stress', 'survey'] },
        { sentence: 'The ___ of this project is to reduce costs.', answer: 'objective', options: ['objective', 'outcome', 'output', 'option'] },
        { sentence: 'The ___ was conducted over three years.', answer: 'research', options: ['research', 'response', 'resource', 'revenue'] },
        { sentence: 'This ___ suggests a new direction.', answer: 'finding', options: ['finding', 'funding', 'feature', 'framework'] },
      ],
    },
    'adverb-adjective': {
      type: 'fill-in-context', instruction: 'Choose the correct adverb-adjective collocation.',
      items: [
        { sentence: 'I am ___ aware of the problem.', answer: 'fully', options: ['fully', 'heavily', 'deeply', 'strongly'] },
        { sentence: 'The news was ___ disappointing.', answer: 'deeply', options: ['deeply', 'fully', 'heavily', 'widely'] },
        { sentence: 'The book is ___ recommended.', answer: 'highly', options: ['highly', 'deeply', 'fully', 'strongly'] },
        { sentence: 'She is ___ opposed to the plan.', answer: 'strongly', options: ['strongly', 'deeply', 'highly', 'fully'] },
        { sentence: 'The area is ___ populated.', answer: 'densely', options: ['densely', 'heavily', 'deeply', 'strongly'] },
        { sentence: 'The custom is ___ accepted.', answer: 'widely', options: ['widely', 'deeply', 'fully', 'highly'] },
      ],
    },
    'verb-preposition': {
      type: 'fill-in-context', instruction: 'Fill in with the correct preposition.',
      items: [
        { sentence: 'She insisted ___ paying for dinner.', answer: 'on', options: ['on', 'in', 'at', 'for'] },
        { sentence: 'He apologized ___ being late.', answer: 'for', options: ['for', 'on', 'to', 'about'] },
        { sentence: 'I\'m not used ___ getting up early.', answer: 'to', options: ['to', 'for', 'with', 'of'] },
        { sentence: 'She succeeded ___ passing the exam.', answer: 'in', options: ['in', 'on', 'at', 'for'] },
        { sentence: 'Don\'t blame me ___ the mistake.', answer: 'for', options: ['for', 'on', 'to', 'with'] },
        { sentence: 'I\'m looking forward ___ the holiday.', answer: 'to', options: ['to', 'for', 'at', 'in'] },
        { sentence: 'She complained ___ the noise.', answer: 'about', options: ['about', 'for', 'on', 'to'] },
        { sentence: 'He prevented me ___ leaving.', answer: 'from', options: ['from', 'to', 'for', 'of'] },
      ],
    },
    'bring-phrasal': {
      type: 'fill-in-context', instruction: 'Fill in with the correct phrasal verb with "bring".',
      items: [
        { sentence: 'The new law was ___ last year.', answer: 'brought in', options: ['brought in', 'brought up', 'brought about', 'brought back'] },
        { sentence: 'She was ___ by her grandparents.', answer: 'brought up', options: ['brought up', 'brought in', 'brought about', 'brought back'] },
        { sentence: 'The crisis ___ major changes.', answer: 'brought about', options: ['brought about', 'brought up', 'brought in', 'brought back'] },
        { sentence: 'This song ___ memories.', answer: 'brings back', options: ['brings back', 'brings up', 'brings in', 'brings about'] },
        { sentence: 'Don\'t ___ that topic — it\'s sensitive.', answer: 'bring up', options: ['bring up', 'bring in', 'bring back', 'bring about'] },
        { sentence: 'The company ___ millions in revenue.', answer: 'brings in', options: ['brings in', 'brings up', 'brings back', 'brings about'] },
      ],
    },
    'come-phrasal': {
      type: 'fill-in-context', instruction: 'Fill in with the correct phrasal verb with "come".',
      items: [
        { sentence: 'I ___ an old friend at the market.', answer: 'came across', options: ['came across', 'came up', 'came down', 'came out'] },
        { sentence: 'Her new book ___ next month.', answer: 'comes out', options: ['comes out', 'comes up', 'comes across', 'comes down'] },
        { sentence: 'Something has ___ — I can\'t make it.', answer: 'come up', options: ['come up', 'come out', 'come across', 'come down'] },
        { sentence: 'The price of oil has ___ significantly.', answer: 'come down', options: ['come down', 'come up', 'come out', 'come across'] },
        { sentence: 'He ___ with a brilliant idea.', answer: 'came up', options: ['came up', 'came out', 'came across', 'came down'] },
        { sentence: 'The truth finally ___.', answer: 'came out', options: ['came out', 'came up', 'came across', 'came down'] },
      ],
    },
    'put-phrasal': {
      type: 'fill-in-context', instruction: 'Fill in with the correct phrasal verb with "put".',
      items: [
        { sentence: 'We had to ___ the meeting until next week.', answer: 'put off', options: ['put off', 'put up', 'put on', 'put away'] },
        { sentence: 'Can you ___ your toys, please?', answer: 'put away', options: ['put away', 'put off', 'put on', 'put up'] },
        { sentence: 'She ___ her coat and went outside.', answer: 'put on', options: ['put on', 'put off', 'put away', 'put up'] },
        { sentence: 'I can\'t ___ with this noise any longer.', answer: 'put up', options: ['put up', 'put off', 'put on', 'put away'] },
        { sentence: 'They ___ the fire quickly.', answer: 'put out', options: ['put out', 'put off', 'put up', 'put on'] },
        { sentence: 'Please ___ me ___ to Mr. Smith. (telephone)', answer: 'put through', options: ['put through', 'put off', 'put on', 'put up'] },
      ],
    },
    'business-idioms': {
      type: 'definition-match', instruction: 'Match the idiom to its meaning.',
      items: [
        { word: 'get the ball rolling', definition: 'start something', options: ['start something', 'finish something', 'fail at something', 'improve something'] },
        { word: 'think outside the box', definition: 'think creatively', options: ['think creatively', 'follow rules strictly', 'be very careful', 'work harder'] },
        { word: 'back to square one', definition: 'start again from the beginning', options: ['start again from the beginning', 'almost finished', 'halfway through', 'making progress'] },
        { word: 'cut corners', definition: 'do something cheaply or badly to save money', options: ['do something cheaply or badly to save money', 'be very precise', 'work overtime', 'start a new project'] },
        { word: 'the bottom line', definition: 'the most important point or financial result', options: ['the most important point or financial result', 'the first step', 'the deadline', 'the company name'] },
        { word: 'on the same page', definition: 'in agreement', options: ['in agreement', 'in disagreement', 'confused', 'reading together'] },
      ],
    },
    'time-idioms': {
      type: 'definition-match', instruction: 'Match the idiom to its meaning.',
      items: [
        { word: 'in the nick of time', definition: 'just in time', options: ['just in time', 'too late', 'very early', 'on schedule'] },
        { word: 'once in a blue moon', definition: 'very rarely', options: ['very rarely', 'very often', 'every night', 'every month'] },
        { word: 'around the clock', definition: '24 hours a day', options: ['24 hours a day', 'once a day', 'at midnight', 'in the morning'] },
        { word: 'behind the times', definition: 'old-fashioned', options: ['old-fashioned', 'modern', 'punctual', 'slow'] },
        { word: 'call it a day', definition: 'stop working for the day', options: ['stop working for the day', 'start early', 'work overtime', 'take a holiday'] },
        { word: 'time flies', definition: 'time passes quickly', options: ['time passes quickly', 'time passes slowly', 'time stops', 'time is money'] },
      ],
    },
    'formal-informal-pairs': {
      type: 'fill-in-context', instruction: 'Choose the formal equivalent.',
      items: [
        { sentence: 'Informal: "buy" → Formal: ___', answer: 'purchase', options: ['purchase', 'get', 'grab', 'pick up'] },
        { sentence: 'Informal: "ask for" → Formal: ___', answer: 'request', options: ['request', 'want', 'need', 'beg'] },
        { sentence: 'Informal: "get" → Formal: ___', answer: 'obtain', options: ['obtain', 'grab', 'take', 'have'] },
        { sentence: 'Informal: "help" → Formal: ___', answer: 'assist', options: ['assist', 'aid', 'fix', 'sort'] },
        { sentence: 'Informal: "start" → Formal: ___', answer: 'commence', options: ['commence', 'begin', 'kick off', 'go'] },
        { sentence: 'Informal: "end" → Formal: ___', answer: 'terminate', options: ['terminate', 'stop', 'finish', 'quit'] },
        { sentence: 'Informal: "give" → Formal: ___', answer: 'provide', options: ['provide', 'hand', 'pass', 'offer'] },
        { sentence: 'Informal: "try" → Formal: ___', answer: 'attempt', options: ['attempt', 'go for', 'have a go', 'test'] },
      ],
    },
    'academic-vs-general': {
      type: 'fill-in-context', instruction: 'Choose the academic alternative.',
      items: [
        { sentence: 'General: "show" → Academic: ___', answer: 'demonstrate', options: ['demonstrate', 'display', 'present', 'exhibit'] },
        { sentence: 'General: "about" → Academic: ___', answer: 'regarding', options: ['regarding', 'around', 'on', 'for'] },
        { sentence: 'General: "big" → Academic: ___', answer: 'significant', options: ['significant', 'huge', 'massive', 'enormous'] },
        { sentence: 'General: "but" → Academic: ___', answer: 'however', options: ['however', 'although', 'yet', 'still'] },
        { sentence: 'General: "also" → Academic: ___', answer: 'furthermore', options: ['furthermore', 'plus', 'and', 'too'] },
        { sentence: 'General: "so" → Academic: ___', answer: 'therefore', options: ['therefore', 'thus', 'hence', 'then'] },
      ],
    },
  },
  'c1': {
    'say-synonyms': {
      type: 'fill-in-context', instruction: 'Choose the most precise synonym for "say".',
      items: [
        { sentence: '"I didn\'t do it!" he ___. (say loudly + emotion)', answer: 'exclaimed', options: ['exclaimed', 'whispered', 'muttered', 'suggested'] },
        { sentence: '"Perhaps we could try again," she ___. (propose gently)', answer: 'suggested', options: ['suggested', 'demanded', 'exclaimed', 'insisted'] },
        { sentence: '"Give me the keys now!" he ___. (order firmly)', answer: 'demanded', options: ['demanded', 'whispered', 'suggested', 'mentioned'] },
        { sentence: '"I\'m sorry," she ___. (say very quietly)', answer: 'whispered', options: ['whispered', 'shouted', 'exclaimed', 'declared'] },
        { sentence: '"I will not resign," the CEO ___. (state formally)', answer: 'declared', options: ['declared', 'muttered', 'whispered', 'mentioned'] },
        { sentence: '"This is unacceptable," he ___. (say with annoyance, quietly)', answer: 'muttered', options: ['muttered', 'shouted', 'declared', 'suggested'] },
        { sentence: '"You must finish by Friday," she ___. (demand firmly)', answer: 'insisted', options: ['insisted', 'whispered', 'suggested', 'mentioned'] },
        { sentence: '"Oh, by the way, Tom called," she ___. (say casually)', answer: 'mentioned', options: ['mentioned', 'declared', 'insisted', 'demanded'] },
      ],
    },
    'big-synonyms': {
      type: 'fill-in-context', instruction: 'Choose the most precise synonym.',
      items: [
        { sentence: 'The company made a ___ profit this year. (very large)', answer: 'substantial', options: ['substantial', 'vast', 'immense', 'enormous'] },
        { sentence: 'The ___ desert stretches for miles. (extremely large area)', answer: 'vast', options: ['vast', 'big', 'large', 'huge'] },
        { sentence: 'She felt ___ pressure to succeed. (very great)', answer: 'immense', options: ['immense', 'big', 'large', 'wide'] },
        { sentence: 'There was a ___ difference between the two proposals.', answer: 'considerable', options: ['considerable', 'big', 'huge', 'massive'] },
        { sentence: 'The earthquake caused ___ destruction.', answer: 'extensive', options: ['extensive', 'big', 'large', 'wide'] },
        { sentence: 'It was a ___ achievement for the team.', answer: 'monumental', options: ['monumental', 'big', 'large', 'wide'] },
      ],
    },
    'good-bad-synonyms': {
      type: 'fill-in-context', instruction: 'Choose the most precise synonym.',
      items: [
        { sentence: 'The results were ___. (very good, impressive)', answer: 'outstanding', options: ['outstanding', 'nice', 'fine', 'okay'] },
        { sentence: 'The situation is ___. (very bad, serious)', answer: 'dire', options: ['dire', 'bad', 'poor', 'weak'] },
        { sentence: 'She gave an ___ performance. (faultless)', answer: 'impeccable', options: ['impeccable', 'good', 'nice', 'great'] },
        { sentence: 'The conditions were ___. (extremely bad)', answer: 'appalling', options: ['appalling', 'bad', 'poor', 'weak'] },
        { sentence: 'The food was ___. (extremely good)', answer: 'exquisite', options: ['exquisite', 'nice', 'good', 'tasty'] },
        { sentence: 'His behaviour was ___. (shockingly bad)', answer: 'atrocious', options: ['atrocious', 'bad', 'poor', 'rough'] },
      ],
    },
    'verb-to-noun': {
      type: 'word-formation', instruction: 'Give the noun form of the verb.',
      items: [
        { base: 'decide', answer: 'decision', suffix: '-sion' },
        { base: 'develop', answer: 'development', suffix: '-ment' },
        { base: 'fail', answer: 'failure', suffix: '-ure' },
        { base: 'apply', answer: 'application', suffix: '-ation' },
        { base: 'arrive', answer: 'arrival', suffix: '-al' },
        { base: 'permit', answer: 'permission', suffix: '-sion' },
        { base: 'grow', answer: 'growth', suffix: '-th' },
        { base: 'discover', answer: 'discovery', suffix: '-y' },
      ],
    },
    'adjective-to-noun': {
      type: 'word-formation', instruction: 'Give the noun form of the adjective.',
      items: [
        { base: 'strong', answer: 'strength', suffix: '-th' },
        { base: 'weak', answer: 'weakness', suffix: '-ness' },
        { base: 'available', answer: 'availability', suffix: '-ity' },
        { base: 'accurate', answer: 'accuracy', suffix: '-cy' },
        { base: 'silent', answer: 'silence', suffix: '-ce' },
        { base: 'important', answer: 'importance', suffix: '-ance' },
        { base: 'creative', answer: 'creativity', suffix: '-ity' },
        { base: 'lonely', answer: 'loneliness', suffix: '-ness' },
      ],
    },
    'positive-negative-neutral': {
      type: 'classify', instruction: 'Is this word positive (+), negative (-), or neutral (0) in connotation?',
      items: [
        { word: 'thrifty', answer: '+', explanation: 'Positive spin on being careful with money' },
        { word: 'cheap', answer: '-', explanation: 'Negative spin on the same quality' },
        { word: 'economical', answer: '0', explanation: 'Neutral — factual description' },
        { word: 'stubborn', answer: '-', explanation: 'Negative — unwilling to change' },
        { word: 'determined', answer: '+', explanation: 'Positive — strong-willed' },
        { word: 'slim', answer: '+', explanation: 'Positive — attractively thin' },
        { word: 'skinny', answer: '-', explanation: 'Negative — too thin' },
        { word: 'slender', answer: '+', explanation: 'Positive — gracefully thin' },
      ],
    },
    'euphemism-dysphemism': {
      type: 'definition-match', instruction: 'Match the euphemism to what it really means.',
      items: [
        { word: 'passed away', definition: 'died', options: ['died', 'moved away', 'fainted', 'retired'] },
        { word: 'let go', definition: 'fired from a job', options: ['fired from a job', 'released from prison', 'set free', 'dropped something'] },
        { word: 'economical with the truth', definition: 'lying', options: ['lying', 'being careful', 'saving money', 'studying economics'] },
        { word: 'between jobs', definition: 'unemployed', options: ['unemployed', 'commuting', 'freelancing', 'on vacation'] },
        { word: 'collateral damage', definition: 'civilian casualties in war', options: ['civilian casualties in war', 'property damage', 'financial loss', 'accidental breakage'] },
        { word: 'downsizing', definition: 'firing many employees', options: ['firing many employees', 'moving to a smaller office', 'reducing prices', 'losing weight'] },
      ],
    },
    'awl-set-3': {
      type: 'fill-in-context', instruction: 'Fill in with the correct academic word.',
      items: [
        { sentence: 'The ___ of the argument is that regulation stifles innovation.', answer: 'premise', options: ['premise', 'process', 'project', 'period'] },
        { sentence: 'The study aims to ___ the relationship between diet and health.', answer: 'examine', options: ['examine', 'exhibit', 'expand', 'exclude'] },
        { sentence: 'The ___ of this phenomenon is not yet understood.', answer: 'mechanism', options: ['mechanism', 'method', 'medium', 'measure'] },
        { sentence: 'We need a more ___ framework for analysis.', answer: 'robust', options: ['robust', 'rigid', 'rough', 'rapid'] },
        { sentence: 'The findings have ___ implications for policy.', answer: 'profound', options: ['profound', 'potential', 'partial', 'primary'] },
        { sentence: 'It is ___ to consider alternative explanations.', answer: 'imperative', options: ['imperative', 'implicit', 'inherent', 'initial'] },
      ],
    },
    'discipline-specific': {
      type: 'definition-match', instruction: 'Match the academic term to its field and meaning.',
      items: [
        { word: 'hypothesis', definition: 'a testable prediction (science)', options: ['a testable prediction (science)', 'a proven fact', 'a mathematical formula', 'a research method'] },
        { word: 'variable', definition: 'a factor that can change (research)', options: ['a factor that can change (research)', 'a constant value', 'a research question', 'a data source'] },
        { word: 'methodology', definition: 'the system of methods used (research)', options: ['the system of methods used (research)', 'the results section', 'the introduction', 'the conclusion'] },
        { word: 'paradigm', definition: 'a framework of ideas (philosophy/science)', options: ['a framework of ideas (philosophy/science)', 'a single experiment', 'a textbook', 'a lecture series'] },
        { word: 'discourse', definition: 'communication in a social context (linguistics)', options: ['communication in a social context (linguistics)', 'a type of essay', 'a speech impediment', 'a vocabulary list'] },
        { word: 'empirical', definition: 'based on observation/experiment (science)', options: ['based on observation/experiment (science)', 'based on theory only', 'based on opinion', 'based on tradition'] },
      ],
    },
  },
  'c2': {
    'literary-vocabulary': {
      type: 'definition-match', instruction: 'Match the literary/formal word to its meaning.',
      items: [
        { word: 'ephemeral', definition: 'lasting a very short time', options: ['lasting a very short time', 'lasting forever', 'very important', 'very large'] },
        { word: 'ubiquitous', definition: 'found everywhere', options: ['found everywhere', 'very rare', 'very old', 'very new'] },
        { word: 'sycophant', definition: 'a person who flatters to gain advantage', options: ['a person who flatters to gain advantage', 'a generous person', 'a wise person', 'a brave person'] },
        { word: 'quixotic', definition: 'idealistic and impractical', options: ['idealistic and impractical', 'practical and efficient', 'calm and quiet', 'loud and aggressive'] },
        { word: 'laconic', definition: 'using very few words', options: ['using very few words', 'talking a lot', 'speaking loudly', 'writing beautifully'] },
        { word: 'mellifluous', definition: 'sweet-sounding', options: ['sweet-sounding', 'harsh-sounding', 'very quiet', 'very loud'] },
        { word: 'perspicacious', definition: 'having keen insight', options: ['having keen insight', 'being confused', 'being lazy', 'being loud'] },
        { word: 'pulchritudinous', definition: 'beautiful', options: ['beautiful', 'ugly', 'ordinary', 'strange'] },
      ],
    },
    'archaic-formal': {
      type: 'definition-match', instruction: 'Match the archaic/formal word to its modern equivalent.',
      items: [
        { word: 'hitherto', definition: 'until now', options: ['until now', 'forever', 'from now on', 'occasionally'] },
        { word: 'notwithstanding', definition: 'despite', options: ['despite', 'because of', 'in addition to', 'instead of'] },
        { word: 'forthwith', definition: 'immediately', options: ['immediately', 'eventually', 'gradually', 'occasionally'] },
        { word: 'heretofore', definition: 'before now', options: ['before now', 'after now', 'right now', 'always'] },
        { word: 'whereby', definition: 'by which', options: ['by which', 'because', 'although', 'therefore'] },
        { word: 'inasmuch as', definition: 'to the extent that', options: ['to the extent that', 'in addition to', 'instead of', 'apart from'] },
      ],
    },
    'metaphor-metonymy': {
      type: 'classify', instruction: 'Is this an example of metaphor (M) or metonymy (MT)?',
      items: [
        { sentence: 'The White House issued a statement.', answer: 'MT', explanation: 'Metonymy — place stands for the president/administration' },
        { sentence: 'Time is money.', answer: 'M', explanation: 'Metaphor — time compared to money' },
        { sentence: 'The pen is mightier than the sword.', answer: 'MT', explanation: 'Metonymy — pen = writing, sword = military force' },
        { sentence: 'Life is a journey.', answer: 'M', explanation: 'Metaphor — life compared to a journey' },
        { sentence: 'Hollywood is releasing new films.', answer: 'MT', explanation: 'Metonymy — place stands for the film industry' },
        { sentence: 'She has a heart of stone.', answer: 'M', explanation: 'Metaphor — heart compared to stone' },
        { sentence: 'Wall Street reacted negatively.', answer: 'MT', explanation: 'Metonymy — place stands for financial markets' },
        { sentence: 'The world is a stage.', answer: 'M', explanation: 'Metaphor — world compared to a stage' },
      ],
    },
    'irony-understatement': {
      type: 'classify', instruction: 'Is this irony (I), understatement (U), or litotes (L)?',
      items: [
        { sentence: '"Great weather!" (said during a hurricane)', answer: 'I', explanation: 'Verbal irony — saying the opposite of what is meant' },
        { sentence: '"It was a bit of a problem." (the building burned down)', answer: 'U', explanation: 'Understatement — deliberately minimizing' },
        { sentence: '"She\'s not unattractive."', answer: 'L', explanation: 'Litotes — double negative for understatement' },
        { sentence: '"How nice of you to arrive on time." (they\'re 2 hours late)', answer: 'I', explanation: 'Verbal irony — sarcastic' },
        { sentence: '"He\'s not the worst player."', answer: 'L', explanation: 'Litotes — implying he\'s quite good via double negative' },
        { sentence: '"I\'ve had better days." (after a catastrophe)', answer: 'U', explanation: 'Understatement — massive minimization' },
      ],
    },
    'legal-vocabulary': {
      type: 'definition-match', instruction: 'Match the legal term to its meaning.',
      items: [
        { word: 'plaintiff', definition: 'the person who brings a case to court', options: ['the person who brings a case to court', 'the judge', 'the accused person', 'the lawyer'] },
        { word: 'defendant', definition: 'the person accused in court', options: ['the person accused in court', 'the judge', 'the person who brings the case', 'the witness'] },
        { word: 'verdict', definition: 'the decision of a jury', options: ['the decision of a jury', 'the crime committed', 'the sentence given', 'the evidence presented'] },
        { word: 'acquit', definition: 'to declare not guilty', options: ['to declare not guilty', 'to declare guilty', 'to arrest', 'to appeal'] },
        { word: 'jurisdiction', definition: 'the authority of a court', options: ['the authority of a court', 'the location of a crime', 'the type of law', 'the length of a sentence'] },
        { word: 'precedent', definition: 'a previous case used as an example', options: ['a previous case used as an example', 'a new law', 'a court building', 'a type of lawyer'] },
      ],
    },
    'scientific-vocabulary': {
      type: 'definition-match', instruction: 'Match the scientific term to its meaning.',
      items: [
        { word: 'catalyst', definition: 'something that speeds up a process', options: ['something that speeds up a process', 'something that slows down', 'the result of an experiment', 'a scientific instrument'] },
        { word: 'synthesis', definition: 'combining elements to form a whole', options: ['combining elements to form a whole', 'breaking something apart', 'a type of experiment', 'a research method'] },
        { word: 'entropy', definition: 'measure of disorder in a system', options: ['measure of disorder in a system', 'measure of energy', 'a type of particle', 'a chemical reaction'] },
        { word: 'osmosis', definition: 'movement of water through a membrane', options: ['movement of water through a membrane', 'movement of air', 'a chemical reaction', 'a type of energy'] },
        { word: 'symbiosis', definition: 'close interaction between two species', options: ['close interaction between two species', 'competition between species', 'a single organism', 'a type of cell'] },
        { word: 'atrophy', definition: 'wasting away of tissue or ability', options: ['wasting away of tissue or ability', 'rapid growth', 'a type of disease', 'a medical treatment'] },
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

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 '+-]/g, ''); }

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

class Vocabulary {
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
        present: `Introduce words in context: ${target.category} → ${target.skill}`,
        explore: 'Show example sentences, ask learner to guess meaning before revealing',
        practice: `Complete ${exercise.count || 0} practice items`,
        produce: 'Use 3 new words in original sentences',
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
        const [, id, level] = args;
        if (!id) throw new Error('Usage: start <id> [level]');
        if (level) voc.setLevel(id, level);
        out({ action: 'start', profile: voc.getProfile(id), nextSkills: voc.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(voc.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const level = loadProfile(id).level || 'a1';
        if (skill) { out(voc.generateExercise(level, skill, 5)); }
        else { const n = voc.getNextSkills(id, 1).next; out(n.length ? voc.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient at current level!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(voc.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, level, cat, skill, sc, tot, ...notes] = args;
        if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total> [notes]');
        out(voc.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(voc.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(voc.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(voc.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? voc.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(voc.setLevel(id, l)); break; }
      case 'students': { out(voc.listStudents()); break; }
      default: out({ usage: 'node vocabulary.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
