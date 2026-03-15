// eClaw History Interactive Tutor (K-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'socialstudies-history');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'past-and-present': ['long-ago-vs-today', 'changes-over-time'],
    'personal-history': ['my-timeline', 'family-stories'],
    'community': ['community-helpers-past-present', 'holidays-and-remembrance'],
  },
  'grade-1': {
    'past-and-present': ['comparing-past-present', 'old-and-new-technology'],
    'family-history': ['family-traditions', 'generational-stories'],
    'national-symbols': ['us-symbols', 'important-americans'],
  },
  'grade-2': {
    'local-history': ['our-community-history', 'local-landmarks'],
    'native-americans': ['first-peoples', 'native-cultures'],
    'timelines': ['reading-timelines', 'creating-timelines'],
  },
  'grade-3': {
    'state-history': ['early-state-history', 'state-symbols-and-leaders'],
    'native-peoples': ['native-nations-of-region', 'cultural-contributions'],
    'cause-and-effect': ['why-things-happened', 'consequences-of-events'],
  },
  'grade-4': {
    'exploration': ['age-of-exploration', 'explorers-and-impact'],
    'colonial-era': ['thirteen-colonies', 'colonial-life'],
    'revolution': ['causes-of-revolution', 'declaration-of-independence', 'key-figures'],
  },
  'grade-5': {
    'constitution': ['constitutional-convention', 'we-the-people', 'bill-of-rights'],
    'westward-expansion': ['manifest-destiny', 'trails-and-territories', 'impact-on-natives'],
    'civil-war': ['causes-of-civil-war', 'key-events', 'reconstruction'],
  },
  'grade-6': {
    'early-humans': ['hunter-gatherers', 'neolithic-revolution', 'early-civilizations'],
    'river-valley-civilizations': ['mesopotamia', 'egypt', 'indus-valley', 'china'],
    'greece-and-rome': ['greek-democracy', 'roman-republic', 'classical-legacy'],
    'medieval-world': ['feudalism', 'world-religions', 'trade-networks'],
  },
  'grade-7': {
    'age-of-exploration': ['european-exploration', 'columbian-exchange', 'colonialism'],
    'renaissance-reformation': ['renaissance-ideas', 'reformation', 'scientific-revolution'],
    'enlightenment': ['enlightenment-thinkers', 'influence-on-revolution'],
    'revolutions': ['american-revolution', 'french-revolution', 'haitian-revolution'],
    'industrialization': ['industrial-revolution', 'social-changes', 'imperialism'],
  },
  'grade-8': {
    'constitution-depth': ['federalists-vs-antifederalists', 'amendments-and-change'],
    'civil-rights': ['abolition', 'civil-rights-movement', 'key-legislation'],
    'world-wars': ['world-war-i', 'world-war-ii', 'home-front'],
    'cold-war-modern': ['cold-war', 'civil-rights-era', 'modern-america'],
    'historical-thinking': ['primary-sources', 'multiple-perspectives', 'historical-significance'],
  },
};

const CONTENT_BANKS = {
  'kindergarten': {
    'long-ago-vs-today': {
      items: [
        { prompt: 'Did people have cars a long, long time ago?', answer: 'no they walked or rode horses', type: 'open', acceptedKeywords: ['no', 'walk', 'horse', 'didn\'t', 'no car'] },
        { prompt: 'What did people use before telephones?', answer: 'letters or talking in person', type: 'open', acceptedKeywords: ['letter', 'talk', 'person', 'write', 'visit'] },
        { prompt: 'Are your clothes the same as clothes from long ago?', answer: 'no clothes have changed over time', type: 'open', acceptedKeywords: ['no', 'different', 'changed'] },
        { prompt: 'What is one thing that is the same now as long ago?', answer: 'people need food water and love', type: 'open', acceptedKeywords: ['food', 'water', 'love', 'family', 'shelter', 'friends'] },
        { prompt: 'What does "long ago" mean?', answer: 'a very long time in the past', type: 'open', acceptedKeywords: ['long time', 'past', 'before', 'ago', 'history'] },
      ],
    },
    'changes-over-time': {
      items: [
        { prompt: 'Name something that has changed since your grandparents were kids.', answer: 'technology clothes or schools', type: 'open', acceptedKeywords: ['technolog', 'phone', 'computer', 'tv', 'car', 'school', 'cloth'] },
        { prompt: 'Do things always stay the same?', answer: 'no things change over time', type: 'open', acceptedKeywords: ['no', 'change'] },
        { prompt: 'What is one way YOU have changed since you were a baby?', answer: 'grew bigger learned to talk or walk', type: 'open', acceptedKeywords: ['grew', 'bigger', 'talk', 'walk', 'learn', 'read', 'taller'] },
        { prompt: 'What is something that stays the same even when other things change?', answer: 'families still love each other', type: 'open', acceptedKeywords: ['love', 'family', 'friend', 'need', 'eat', 'play'] },
        { prompt: 'Why is it important to learn about changes over time?', answer: 'to understand how we got to where we are today', type: 'open', acceptedKeywords: ['understand', 'learn', 'today', 'how', 'why', 'past'] },
      ],
    },
    'my-timeline': {
      items: [
        { prompt: 'What is a timeline?', answer: 'a line that shows events in order from earliest to latest', type: 'open', acceptedKeywords: ['line', 'order', 'event', 'time', 'earliest', 'first', 'last'] },
        { prompt: 'What would be the first event on YOUR timeline?', answer: 'the day I was born', type: 'open', acceptedKeywords: ['born', 'birth', 'birthday'] },
        { prompt: 'Name something that happened to you this year that could go on your timeline.', answer: 'started school birthday or learned something new', type: 'open', acceptedKeywords: ['school', 'birthday', 'learn', 'trip', 'friend', 'moved'] },
        { prompt: 'Do events on a timeline go in any order?', answer: 'no they go in the order they happened', type: 'open', acceptedKeywords: ['no', 'order', 'when', 'happened', 'sequence', 'first'] },
        { prompt: 'Why do people make timelines?', answer: 'to remember and organize events in order', type: 'open', acceptedKeywords: ['remember', 'order', 'organiz', 'when', 'event', 'sequence'] },
      ],
    },
    'family-stories': {
      items: [
        { prompt: 'Why is it important to listen to family stories?', answer: 'to learn about your history and where you come from', type: 'open', acceptedKeywords: ['learn', 'history', 'where', 'come from', 'past', 'family', 'remember'] },
        { prompt: 'Who in your family knows stories about long ago?', answer: 'grandparents or older family members', type: 'open', acceptedKeywords: ['grandparent', 'grandma', 'grandpa', 'great', 'older', 'parent'] },
        { prompt: 'What can you learn from a family story?', answer: 'about how your family lived and what was important to them', type: 'open', acceptedKeywords: ['lived', 'important', 'history', 'past', 'tradition', 'culture'] },
        { prompt: 'How are family stories passed down?', answer: 'by telling them from generation to generation', type: 'open', acceptedKeywords: ['tell', 'generation', 'oral', 'talk', 'share', 'remember', 'pass'] },
        { prompt: 'What is one story from your family you could share?', answer: 'any family story', type: 'open', acceptedKeywords: ['grandma', 'grandpa', 'parent', 'when', 'story', 'family', 'remember'] },
      ],
    },
    'community-helpers-past-present': {
      items: [
        { prompt: 'Have communities always had helpers?', answer: 'yes every community has had people who help', type: 'open', acceptedKeywords: ['yes', 'always', 'every', 'help'] },
        { prompt: 'How were firefighters different long ago?', answer: 'they used buckets of water instead of trucks and hoses', type: 'open', acceptedKeywords: ['bucket', 'water', 'no truck', 'different', 'horse', 'hand'] },
        { prompt: 'How has the job of a teacher changed over time?', answer: 'they used to teach in one room schools and write on chalkboards', type: 'open', acceptedKeywords: ['one room', 'chalkboard', 'different', 'computer', 'book', 'change'] },
        { prompt: 'What community helper job is the same now as long ago?', answer: 'doctors still help sick people', type: 'open', acceptedKeywords: ['doctor', 'teacher', 'police', 'help', 'same', 'still'] },
        { prompt: 'What is a new community helper job that did not exist long ago?', answer: 'computer programmer or website designer', type: 'open', acceptedKeywords: ['computer', 'internet', 'techno', 'website', 'app', 'social media'] },
      ],
    },
    'holidays-and-remembrance': {
      items: [
        { prompt: 'Why do we have holidays?', answer: 'to remember important people and events', type: 'open', acceptedKeywords: ['remember', 'important', 'people', 'event', 'celebrate', 'honor'] },
        { prompt: 'What do we celebrate on the Fourth of July?', answer: 'america becoming independent', type: 'open', acceptedKeywords: ['independen', 'america', 'birthday', 'free', 'country'] },
        { prompt: 'What does Memorial Day honor?', answer: 'people who died serving in the military', type: 'open', acceptedKeywords: ['died', 'military', 'soldier', 'served', 'remember', 'war'] },
        { prompt: 'Why do we celebrate Martin Luther King Jr. Day?', answer: 'to honor his work for civil rights and equality', type: 'open', acceptedKeywords: ['civil right', 'equal', 'peace', 'dream', 'fair', 'honor'] },
        { prompt: 'What is one holiday your family celebrates?', answer: 'any holiday', type: 'open', acceptedKeywords: ['thanksgiv', 'christmas', 'hanukkah', 'easter', 'diwali', 'eid', 'birthday', 'new year'] },
      ],
    },
  },
  'grade-1': {
    'comparing-past-present': {
      items: [
        { prompt: 'How did people travel 200 years ago?', answer: 'by horse wagon or walking', type: 'open', acceptedKeywords: ['horse', 'wagon', 'walk', 'boat', 'carriage'] },
        { prompt: 'How do people travel today?', answer: 'by car bus train or airplane', type: 'open', acceptedKeywords: ['car', 'bus', 'train', 'airplane', 'plane', 'bike'] },
        { prompt: 'What did people use for light before electricity?', answer: 'candles and oil lamps', type: 'open', acceptedKeywords: ['candle', 'oil', 'lamp', 'fire', 'torch'] },
        { prompt: 'How is school different today compared to 100 years ago?', answer: 'we have computers and more books and all children can attend', type: 'open', acceptedKeywords: ['computer', 'book', 'all', 'children', 'technology', 'different', 'more'] },
        { prompt: 'What is one thing from the past you wish we still had?', answer: 'any thoughtful answer', type: 'open', acceptedKeywords: ['wish', 'past', 'old', 'miss', 'like', 'fun', 'simple'] },
      ],
    },
    'old-and-new-technology': {
      items: [
        { prompt: 'What did people use before computers?', answer: 'typewriters and handwriting', type: 'open', acceptedKeywords: ['typewriter', 'handwrit', 'paper', 'pen', 'pencil'] },
        { prompt: 'What came before cell phones?', answer: 'landline phones', type: 'open', acceptedKeywords: ['landline', 'home phone', 'telephone', 'rotary', 'wall'] },
        { prompt: 'How did people watch shows before TV?', answer: 'they listened to radio or saw live performances', type: 'open', acceptedKeywords: ['radio', 'live', 'theater', 'stage', 'perform'] },
        { prompt: 'What technology has made life easier?', answer: 'washing machines cars and computers', type: 'open', acceptedKeywords: ['washing', 'car', 'computer', 'phone', 'internet', 'microwave', 'refrigerat'] },
        { prompt: 'Can technology make things worse? Give an example.', answer: 'yes like pollution from cars or too much screen time', type: 'open', acceptedKeywords: ['yes', 'pollution', 'screen', 'addic', 'environment', 'waste', 'distract'] },
      ],
    },
    'family-traditions': {
      items: [
        { prompt: 'What is a tradition that your family has done for a long time?', answer: 'any family tradition', type: 'open', acceptedKeywords: ['holiday', 'dinner', 'recipe', 'trip', 'game', 'church', 'story', 'birthday'] },
        { prompt: 'Where do traditions come from?', answer: 'from our ancestors and cultural heritage', type: 'open', acceptedKeywords: ['ancestor', 'heritage', 'culture', 'family', 'history', 'parents', 'country'] },
        { prompt: 'Can new traditions be started?', answer: 'yes families can create new traditions', type: 'open', acceptedKeywords: ['yes', 'new', 'create', 'start'] },
        { prompt: 'Why do families keep traditions?', answer: 'to stay connected and remember their heritage', type: 'open', acceptedKeywords: ['connect', 'remember', 'heritage', 'together', 'identity', 'belong'] },
        { prompt: 'How are traditions a form of history?', answer: 'they are passed down from the past to the present', type: 'open', acceptedKeywords: ['passed', 'past', 'present', 'history', 'generation', 'down'] },
      ],
    },
    'generational-stories': {
      items: [
        { prompt: 'What is a generation?', answer: 'a group of people born around the same time', type: 'open', acceptedKeywords: ['born', 'same time', 'age', 'group', 'people'] },
        { prompt: 'How many generations might be alive in one family?', answer: 'three or four — children parents grandparents great-grandparents', type: 'open', acceptedKeywords: ['three', 'four', '3', '4', 'grandparent', 'great'] },
        { prompt: 'What can you learn from your grandparents\' stories?', answer: 'what life was like when they were young', type: 'open', acceptedKeywords: ['life', 'young', 'past', 'different', 'history', 'grew up', 'when'] },
        { prompt: 'Why should we write down family stories?', answer: 'so they are not lost when older family members pass away', type: 'open', acceptedKeywords: ['lost', 'remember', 'preserve', 'forget', 'save', 'keep'] },
        { prompt: 'What question would you ask a grandparent about the past?', answer: 'any thoughtful question about the past', type: 'open', acceptedKeywords: ['what', 'how', 'when', 'where', 'tell', 'remember', 'like'] },
      ],
    },
    'us-symbols': {
      items: [
        { prompt: 'What does the American flag represent?', answer: 'the united states and its states and history', type: 'open', acceptedKeywords: ['united states', 'state', 'country', 'freedom', 'history'] },
        { prompt: 'What is the bald eagle a symbol of?', answer: 'the united states strength and freedom', type: 'open', acceptedKeywords: ['united states', 'america', 'freedom', 'strength', 'country'] },
        { prompt: 'What does the Statue of Liberty represent?', answer: 'freedom and welcome to immigrants', type: 'open', acceptedKeywords: ['freedom', 'welcome', 'immigrant', 'liberty', 'hope'] },
        { prompt: 'What is the national anthem?', answer: 'the star spangled banner', type: 'open', acceptedKeywords: ['star spangled banner'] },
        { prompt: 'Why do countries have symbols?', answer: 'to represent what they stand for and unite people', type: 'open', acceptedKeywords: ['represent', 'stand for', 'unite', 'identity', 'together', 'country'] },
      ],
    },
    'important-americans': {
      items: [
        { prompt: 'Who was George Washington?', answer: 'the first president of the united states', type: 'open', acceptedKeywords: ['first', 'president', 'united states'] },
        { prompt: 'Who was Abraham Lincoln?', answer: 'the president who freed the slaves and preserved the union', type: 'open', acceptedKeywords: ['president', 'slave', 'free', 'union', 'civil war'] },
        { prompt: 'Who was Martin Luther King Jr.?', answer: 'a civil rights leader who fought for equality', type: 'open', acceptedKeywords: ['civil right', 'equal', 'leader', 'dream', 'peace'] },
        { prompt: 'Who was Rosa Parks?', answer: 'a woman who refused to give up her bus seat fighting segregation', type: 'open', acceptedKeywords: ['bus', 'seat', 'refuse', 'segregat', 'civil right'] },
        { prompt: 'Why is it important to learn about important Americans?', answer: 'to understand how they shaped our country', type: 'open', acceptedKeywords: ['understand', 'shaped', 'country', 'history', 'learn', 'inspire'] },
      ],
    },
  },
  'grade-2': {
    'our-community-history': {
      items: [
        { prompt: 'What is local history?', answer: 'the history of your town city or community', type: 'open', acceptedKeywords: ['town', 'city', 'community', 'local', 'area', 'neighborhood'] },
        { prompt: 'How can you learn about your community\'s history?', answer: 'visit a museum talk to elders or read local records', type: 'open', acceptedKeywords: ['museum', 'elder', 'record', 'library', 'read', 'talk', 'ask', 'visit'] },
        { prompt: 'Has your community always looked the same?', answer: 'no communities change over time', type: 'open', acceptedKeywords: ['no', 'change', 'different', 'grew', 'built'] },
        { prompt: 'What might have been in your community 100 years ago that is not there now?', answer: 'farms old buildings or different stores', type: 'open', acceptedKeywords: ['farm', 'building', 'store', 'field', 'old', 'different'] },
        { prompt: 'Why is it important to preserve local history?', answer: 'to remember where we come from and learn from the past', type: 'open', acceptedKeywords: ['remember', 'come from', 'learn', 'past', 'preserve', 'heritage'] },
      ],
    },
    'local-landmarks': {
      items: [
        { prompt: 'What is a landmark?', answer: 'an important or historic place', type: 'open', acceptedKeywords: ['important', 'historic', 'place', 'building', 'monument', 'famous'] },
        { prompt: 'Why do communities have landmarks?', answer: 'to remember important events or people', type: 'open', acceptedKeywords: ['remember', 'important', 'event', 'people', 'history', 'honor'] },
        { prompt: 'Name a national landmark.', answer: 'statue of liberty white house or mount rushmore', type: 'open', acceptedKeywords: ['statue', 'liberty', 'white house', 'rushmore', 'lincoln', 'washington', 'monument'] },
        { prompt: 'How are landmarks protected?', answer: 'by laws that prevent them from being destroyed', type: 'open', acceptedKeywords: ['law', 'protect', 'preserve', 'prevent', 'destroy', 'historic'] },
        { prompt: 'Can you think of a landmark near your home?', answer: 'any local landmark', type: 'open', acceptedKeywords: ['building', 'park', 'statue', 'bridge', 'church', 'school', 'monument', 'library'] },
      ],
    },
    'first-peoples': {
      items: [
        { prompt: 'Who were the first people to live in North America?', answer: 'native americans or indigenous peoples', type: 'open', acceptedKeywords: ['native', 'american', 'indigenous', 'first', 'indian'] },
        { prompt: 'How long have Native Americans lived in North America?', answer: 'for thousands of years', type: 'open', acceptedKeywords: ['thousand', 'long', 'many', 'years', 'ancient'] },
        { prompt: 'Did all Native Americans live the same way?', answer: 'no different groups had different cultures', type: 'open', acceptedKeywords: ['no', 'different', 'group', 'culture', 'tribe', 'nation'] },
        { prompt: 'What did Native Americans use from the land?', answer: 'animals plants and water for food shelter and clothing', type: 'open', acceptedKeywords: ['animal', 'plant', 'water', 'food', 'shelter', 'cloth', 'land'] },
        { prompt: 'Why is it important to learn about Native American history?', answer: 'to understand the first peoples and their contributions', type: 'open', acceptedKeywords: ['understand', 'first', 'contribut', 'history', 'respect', 'learn'] },
      ],
    },
    'native-cultures': {
      items: [
        { prompt: 'Name one thing Native Americans taught European settlers.', answer: 'how to grow corn or use the land', type: 'open', acceptedKeywords: ['corn', 'crop', 'grow', 'land', 'food', 'fish', 'tobacco', 'plant'] },
        { prompt: 'What are some things Native Americans are known for creating?', answer: 'pottery baskets canoes and medicine', type: 'open', acceptedKeywords: ['pottery', 'basket', 'canoe', 'medicine', 'art', 'totem', 'blanket'] },
        { prompt: 'Do Native American cultures still exist today?', answer: 'yes they are living cultures', type: 'open', acceptedKeywords: ['yes', 'today', 'still', 'living', 'alive'] },
        { prompt: 'What is a reservation?', answer: 'land set aside for Native American communities', type: 'open', acceptedKeywords: ['land', 'set aside', 'native', 'community', 'live', 'designated'] },
        { prompt: 'Why should we respect Native American cultures?', answer: 'because they have rich histories and contributions', type: 'open', acceptedKeywords: ['history', 'contribut', 'respect', 'rich', 'first', 'people', 'culture'] },
      ],
    },
    'reading-timelines': {
      items: [
        { prompt: 'On a timeline, which comes first — events on the left or right?', answer: 'the left because timelines go from oldest to newest', type: 'open', acceptedKeywords: ['left', 'oldest', 'first', 'earlier'] },
        { prompt: 'A timeline shows: 1776, 1865, 1969. Which event happened first?', answer: '1776', type: 'open', acceptedKeywords: ['1776'] },
        { prompt: 'What does a timeline show?', answer: 'events in the order they happened', type: 'open', acceptedKeywords: ['events', 'order', 'happened', 'time', 'sequence', 'when'] },
        { prompt: 'How do you read a timeline?', answer: 'from left to right or top to bottom in time order', type: 'open', acceptedKeywords: ['left', 'right', 'order', 'time', 'sequence', 'first', 'last'] },
        { prompt: 'Why are timelines useful for studying history?', answer: 'they help you see when events happened in relation to each other', type: 'open', acceptedKeywords: ['when', 'order', 'relation', 'see', 'understand', 'organize'] },
      ],
    },
    'creating-timelines': {
      items: [
        { prompt: 'What is the first step in creating a timeline?', answer: 'list the events and their dates', type: 'open', acceptedKeywords: ['list', 'event', 'date', 'collect', 'gather', 'information'] },
        { prompt: 'What do you put on a timeline?', answer: 'events with dates in order', type: 'open', acceptedKeywords: ['event', 'date', 'order', 'when', 'what happened'] },
        { prompt: 'If you were making a timeline of your life, what would be 3 events?', answer: 'born started school and a milestone', type: 'open', acceptedKeywords: ['born', 'school', 'learn', 'move', 'trip', 'sibling', 'birthday'] },
        { prompt: 'Should events on a timeline be evenly spaced?', answer: 'the spacing should reflect the actual time between events', type: 'open', acceptedKeywords: ['time', 'between', 'actual', 'space', 'reflect', 'proportional'] },
        { prompt: 'What tools can you use to create a timeline?', answer: 'paper and pencil or a computer', type: 'open', acceptedKeywords: ['paper', 'pencil', 'computer', 'ruler', 'draw', 'online'] },
      ],
    },
  },
  'grade-3': {
    'early-state-history': {
      items: [
        { prompt: 'Who lived in your state before European settlers arrived?', answer: 'native american peoples', type: 'open', acceptedKeywords: ['native', 'american', 'indigenous', 'first', 'people', 'tribe'] },
        { prompt: 'Why did settlers come to different states?', answer: 'for land religious freedom trade or resources', type: 'open', acceptedKeywords: ['land', 'religious', 'freedom', 'trade', 'resource', 'gold', 'farm', 'opportunity'] },
        { prompt: 'What is a colony?', answer: 'a settlement ruled by another country', type: 'open', acceptedKeywords: ['settlement', 'ruled', 'country', 'another', 'control'] },
        { prompt: 'How did your state become a state?', answer: 'it was admitted to the union', type: 'open', acceptedKeywords: ['admitted', 'union', 'joined', 'state', 'constitution'] },
        { prompt: 'Why is it important to know your state\'s history?', answer: 'to understand where you live and how it came to be', type: 'open', acceptedKeywords: ['understand', 'live', 'came to be', 'history', 'community', 'identity'] },
      ],
    },
    'state-symbols-and-leaders': {
      items: [
        { prompt: 'What is a state symbol?', answer: 'an official symbol that represents the state', type: 'open', acceptedKeywords: ['official', 'symbol', 'represent', 'state'] },
        { prompt: 'Name one type of state symbol.', answer: 'state bird flower flag or tree', type: 'open', acceptedKeywords: ['bird', 'flower', 'flag', 'tree', 'animal', 'song', 'motto'] },
        { prompt: 'Who is the leader of a state?', answer: 'the governor', type: 'open', acceptedKeywords: ['governor'] },
        { prompt: 'Why do states have symbols?', answer: 'to represent their identity and heritage', type: 'open', acceptedKeywords: ['represent', 'identity', 'heritage', 'pride', 'unique', 'special'] },
        { prompt: 'How are state leaders chosen?', answer: 'by election', type: 'open', acceptedKeywords: ['elect', 'vote', 'people', 'choose'] },
      ],
    },
    'native-nations-of-region': {
      items: [
        { prompt: 'What Native American groups lived in your region?', answer: 'varies by region — research your area', type: 'open', acceptedKeywords: ['tribe', 'nation', 'people', 'native', 'group', 'lived', 'area'] },
        { prompt: 'How did the geography of your region affect Native American life?', answer: 'it determined their food housing and way of life', type: 'open', acceptedKeywords: ['food', 'housing', 'life', 'geography', 'land', 'water', 'climate'] },
        { prompt: 'What happened to many Native American nations when settlers arrived?', answer: 'they lost their land and many were forced to move', type: 'open', acceptedKeywords: ['lost', 'land', 'forced', 'move', 'trail', 'removed', 'displaced'] },
        { prompt: 'Are Native American nations still present in your state today?', answer: 'yes many states have native communities and reservations', type: 'open', acceptedKeywords: ['yes', 'reservation', 'community', 'today', 'still', 'present'] },
        { prompt: 'Why should we learn about the Native nations of our region?', answer: 'to honor the first people and understand our complete history', type: 'open', acceptedKeywords: ['honor', 'first', 'complete', 'history', 'understand', 'respect'] },
      ],
    },
    'cultural-contributions': {
      items: [
        { prompt: 'Name one food that comes from Native American agriculture.', answer: 'corn beans or squash', type: 'open', acceptedKeywords: ['corn', 'bean', 'squash', 'potato', 'tomato', 'chocolate', 'peanut'] },
        { prompt: 'What form of government influenced the US Constitution?', answer: 'the iroquois confederacy', type: 'open', acceptedKeywords: ['iroquois', 'confederacy', 'haudenosaunee', 'native'] },
        { prompt: 'Name one English word that comes from a Native American language.', answer: 'canoe moose or chocolate', type: 'open', acceptedKeywords: ['canoe', 'moose', 'chocolate', 'tomato', 'skunk', 'moccasin', 'kayak'] },
        { prompt: 'How did Native Americans contribute to medicine?', answer: 'they used plants as medicines many of which are still used today', type: 'open', acceptedKeywords: ['plant', 'medicine', 'herb', 'heal', 'natural', 'cure'] },
        { prompt: 'Why is it important to recognize Native American contributions?', answer: 'because they shaped much of American culture and knowledge', type: 'open', acceptedKeywords: ['shaped', 'culture', 'knowledge', 'contribut', 'important', 'recogniz'] },
      ],
    },
    'why-things-happened': {
      items: [
        { prompt: 'What is a cause in history?', answer: 'the reason something happened', type: 'open', acceptedKeywords: ['reason', 'why', 'happened', 'led to', 'because'] },
        { prompt: 'What is an effect?', answer: 'what happened as a result', type: 'open', acceptedKeywords: ['result', 'happened', 'because of', 'consequence', 'outcome'] },
        { prompt: 'Cause: People wanted freedom. Effect: They started a revolution. What caused the revolution?', answer: 'wanting freedom', type: 'open', acceptedKeywords: ['freedom', 'want', 'libert', 'rights'] },
        { prompt: 'Can one cause have many effects?', answer: 'yes', type: 'exact' },
        { prompt: 'Why is understanding cause and effect important in history?', answer: 'to understand why events happened and learn from them', type: 'open', acceptedKeywords: ['why', 'understand', 'learn', 'happened', 'explain', 'prevent'] },
      ],
    },
    'consequences-of-events': {
      items: [
        { prompt: 'What were consequences of European exploration for Native Americans?', answer: 'disease loss of land and cultural destruction', type: 'open', acceptedKeywords: ['disease', 'land', 'lost', 'cultural', 'destroy', 'death', 'displac'] },
        { prompt: 'What is an unintended consequence?', answer: 'a result that was not planned or expected', type: 'open', acceptedKeywords: ['not planned', 'unexpected', 'surprise', 'not intend', 'accident'] },
        { prompt: 'Can historical events have both positive and negative consequences?', answer: 'yes most events have mixed results', type: 'open', acceptedKeywords: ['yes', 'both', 'positive', 'negative', 'mixed'] },
        { prompt: 'What is a long-term consequence?', answer: 'an effect that lasts a long time', type: 'open', acceptedKeywords: ['long', 'time', 'last', 'years', 'forever', 'extended', 'future'] },
        { prompt: 'What is a short-term consequence?', answer: 'an effect that happens right away and does not last long', type: 'open', acceptedKeywords: ['right away', 'short', 'immediate', 'quick', 'temporary', 'soon'] },
      ],
    },
  },
};

const NARRATIVES = {
  'kindergarten': [
    { title: 'Long Ago and Today', passage: 'Long ago, children did not have TVs, computers, or phones. They played outside with sticks and balls. They helped on farms. They went to sleep when the sun went down because there were no electric lights. But just like you, they loved their families, played with friends, and learned new things every day.', questions: ['What did children do for fun long ago?', 'What is the same about children then and now?'] },
    { title: 'A Helper\'s Story', passage: 'A long time ago, there was a man named Benjamin Franklin. He helped his community in many ways. He started the first public library so everyone could borrow books. He started a fire company to keep people safe. He even helped write important rules for our country. One person can make a big difference!', questions: ['What did Benjamin Franklin do for his community?', 'How can one person make a difference?'] },
  ],
  'grade-1': [
    { title: 'The Story of Ruby Bridges', passage: 'In 1960, a brave six-year-old girl named Ruby Bridges walked into a school in New Orleans. She was the first Black child at that school. Some people were angry and shouted at her. But Ruby kept going to school every day. She was brave. Because of Ruby and others like her, all children can go to school together today.', questions: ['Why was Ruby Bridges brave?', 'How did her actions change things?'] },
    { title: 'Life in the Old Days', passage: 'Grandma Rosie remembers when she was little. There was no internet. She called friends on a phone attached to the wall. Her family had one TV with only three channels. She walked to school because there was no bus. "Things were different," she says, "but we still had fun. We played outside until the streetlights came on."', questions: ['What was different when Grandma Rosie was little?', 'What was the same?'] },
  ],
  'grade-2': [
    { title: 'How Our Town Began', passage: 'Many towns began near rivers. Rivers gave people water to drink, fish to eat, and a way to travel. Farmers grew crops near the river. Shops opened. More people came. Houses were built. A school was started. A church was built. Over many years, the small settlement grew into the town we know today.', questions: ['Why did towns start near rivers?', 'How did the town grow over time?'] },
  ],
  'grade-3': [
    { title: 'The Trail of Tears', passage: 'In the 1830s, the US government forced thousands of Cherokee people to leave their homeland in the Southeast. They had to walk over 1,000 miles to Oklahoma. It was cold and many had little food. About 4,000 Cherokee died on the journey. This terrible event is called the Trail of Tears. It reminds us that throughout history, powerful groups have sometimes treated others unjustly.', questions: ['What happened during the Trail of Tears?', 'Why is it important to learn about this event?'] },
  ],
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
  return { studentId: id, grade: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
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

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

// Exercise generation

function exResult(type, skill, grade, instruction, items) { return { type, skill, grade, count: items.length, instruction, items }; }

function generateExercise(grade, skill, count = 5) {
  const bank = CONTENT_BANKS[grade]?.[skill];
  if (!bank || !bank.items) return { error: `No content bank for ${grade}/${skill}` };

  const items = pick(bank.items, count).map(item => {
    if (item.type === 'multiple-choice') return { prompt: item.prompt, answer: item.answer, type: 'multiple-choice' };
    if (item.type === 'exact') return { prompt: item.prompt, answer: item.answer, type: 'exact' };
    return { prompt: item.prompt, answer: item.answer, type: 'open', acceptedKeywords: item.acceptedKeywords || [] };
  });

  return exResult(items[0]?.type || 'open', skill, grade, `Answer each question about ${skill.replace(/-/g, ' ')}.`, items);
}

// Answer checking

function checkAnswer(type, expected, answer, acceptedKeywords) {
  if (type === 'multiple-choice' || type === 'exact') return norm(expected) === norm(answer);
  if (type === 'open' && Array.isArray(acceptedKeywords) && acceptedKeywords.length > 0) {
    const a = norm(answer);
    const matched = acceptedKeywords.filter(k => a.includes(norm(k)));
    return matched.length >= Math.min(2, acceptedKeywords.length);
  }
  return norm(expected) === norm(answer);
}

// Public API

class History {
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

  checkAnswer(type, expected, answer, acceptedKeywords) { return { correct: checkAnswer(type, expected, answer, acceptedKeywords), expected, studentAnswer: answer }; }

  getNarrative(grade) {
    const narr = NARRATIVES[grade];
    if (!narr) return { error: `No narratives for ${grade}. Available: ${Object.keys(NARRATIVES).join(', ')}` };
    return pick(narr, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const narrative = NARRATIVES[grade] ? pick(NARRATIVES[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, narrative,
      lessonPlan: {
        review: 'Review previously learned history concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: narrative ? `Read narrative: "${narrative.title}"` : 'Connect history to today',
        reflect: 'What did you learn about the past today?',
      },
    };
  }
}

module.exports = History;

// CLI: node history.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new History();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) api.setGrade(id, grade);
        out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, type] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'kindergarten';
        if (type) { out(api.generateExercise(grade, type, 5)); }
        else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current grade!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(api.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(api.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? api.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(api.setGrade(id, g)); break; }
      case 'narrative': { const [, g] = args; if (!g) throw new Error('Usage: narrative <grade>'); out(api.getNarrative(g)); break; }
      default: out({ usage: 'node history.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','narrative'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
