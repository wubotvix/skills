// eClaw Culture & Society Interactive Tutor (K-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'socialstudies-culture');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'identity': ['who-am-i', 'my-family', 'what-makes-me-special'],
    'community': ['my-school', 'my-neighborhood', 'people-around-me'],
    'celebrations': ['family-celebrations', 'community-celebrations'],
  },
  'grade-1': {
    'family-structures': ['different-families', 'family-roles', 'family-traditions'],
    'similarities-differences': ['same-and-different', 'respecting-differences'],
    'celebrations': ['holidays-around-world', 'why-we-celebrate'],
  },
  'grade-2': {
    'community-cultures': ['cultural-neighborhoods', 'food-and-culture', 'language-diversity'],
    'immigration': ['why-people-move', 'immigrant-stories'],
    'traditions': ['customs-and-traditions', 'cultural-artifacts'],
  },
  'grade-3': {
    'cultural-universals': ['food-shelter-clothing', 'family-and-education', 'stories-and-art'],
    'indigenous-cultures': ['native-american-regions', 'indigenous-traditions'],
    'cultural-exchange': ['sharing-cultures', 'cultural-borrowing'],
  },
  'grade-4': {
    'us-cultural-regions': ['northeast-culture', 'south-culture', 'midwest-culture', 'west-culture'],
    'immigration-waves': ['early-immigration', 'ellis-island-era', 'modern-immigration'],
    'identity-and-culture': ['cultural-identity', 'heritage-and-pride'],
  },
  'grade-5': {
    'cultural-conflict': ['misunderstanding-cultures', 'conflict-resolution'],
    'cultural-contributions': ['arts-and-music', 'science-and-innovation', 'food-and-language'],
    'empathy-and-understanding': ['walking-in-others-shoes', 'perspective-taking'],
  },
  'grade-6': {
    'world-cultures': ['asia-cultures', 'africa-cultures', 'europe-cultures', 'americas-cultures'],
    'ancient-cultures': ['mesopotamia', 'egypt', 'indus-valley', 'china'],
    'cultural-diffusion': ['silk-road', 'trade-and-culture', 'technology-spread'],
    'world-religions': ['major-religions-overview', 'religion-and-culture'],
  },
  'grade-7': {
    'culture-and-identity': ['identity-formation', 'cultural-norms', 'subcultures'],
    'social-institutions': ['family-systems', 'education-systems', 'religious-institutions'],
    'cultural-change': ['globalization-effects', 'modernization', 'cultural-preservation'],
    'media-and-culture': ['media-influence', 'pop-culture', 'cultural-representation'],
  },
  'grade-8': {
    'cultural-anthropology': ['ethnography-basics', 'cultural-relativism', 'ethnocentrism'],
    'power-and-culture': ['dominant-cultures', 'marginalized-voices', 'cultural-resistance'],
    'diaspora': ['african-diaspora', 'global-migration', 'refugee-experiences'],
    'global-citizenship': ['human-rights', 'cultural-competence', 'global-responsibility'],
  },
};

const CONTENT_BANKS = {
  'kindergarten': {
    'who-am-i': {
      items: [
        { prompt: 'What are some things that make you YOU?', answer: 'name family likes and dislikes', type: 'open', acceptedKeywords: ['name', 'family', 'like', 'favorite', 'look', 'feel'] },
        { prompt: 'True or false: Everyone is exactly the same.', answer: 'false', type: 'exact' },
        { prompt: 'What is something you are good at?', answer: 'any positive skill or trait', type: 'open', acceptedKeywords: ['good', 'can', 'like', 'draw', 'read', 'run', 'sing', 'help', 'build'] },
        { prompt: 'What makes you different from your best friend?', answer: 'different likes appearances or families', type: 'open', acceptedKeywords: ['different', 'like', 'look', 'family', 'food', 'color', 'game'] },
        { prompt: 'Is it good that people are different? Why?', answer: 'yes because differences make the world interesting', type: 'open', acceptedKeywords: ['yes', 'interest', 'learn', 'special', 'good', 'fun', 'different'] },
      ],
    },
    'my-family': {
      items: [
        { prompt: 'What is a family?', answer: 'people who love and take care of each other', type: 'open', acceptedKeywords: ['love', 'care', 'together', 'live', 'help', 'people'] },
        { prompt: 'Are all families the same?', answer: 'no families come in many different forms', type: 'open', acceptedKeywords: ['no', 'different', 'many', 'kinds', 'types'] },
        { prompt: 'Name some people who might be in a family.', answer: 'parents siblings grandparents aunts uncles', type: 'open', acceptedKeywords: ['mom', 'dad', 'parent', 'brother', 'sister', 'grandma', 'grandpa', 'aunt', 'uncle'] },
        { prompt: 'What does your family do together?', answer: 'eat play celebrate or talk', type: 'open', acceptedKeywords: ['eat', 'play', 'talk', 'celebrat', 'cook', 'read', 'game', 'trip'] },
        { prompt: 'Why is family important?', answer: 'they love you help you and take care of you', type: 'open', acceptedKeywords: ['love', 'help', 'care', 'safe', 'support', 'teach', 'learn'] },
      ],
    },
    'what-makes-me-special': {
      items: [
        { prompt: 'What is something special about you that no one else has?', answer: 'personal trait or quality', type: 'open', acceptedKeywords: ['name', 'story', 'family', 'talent', 'like', 'finger', 'unique'] },
        { prompt: 'Can two people be special in different ways?', answer: 'yes everyone has their own special qualities', type: 'open', acceptedKeywords: ['yes', 'different', 'own', 'special', 'unique'] },
        { prompt: 'What does special mean?', answer: 'unique and important', type: 'open', acceptedKeywords: ['unique', 'important', 'different', 'one', 'only', 'matter'] },
        { prompt: 'Is anyone NOT special?', answer: 'no everyone is special in their own way', type: 'open', acceptedKeywords: ['no', 'everyone', 'all', 'special', 'own way'] },
        { prompt: 'How can you celebrate what makes someone else special?', answer: 'by being kind and showing interest in them', type: 'open', acceptedKeywords: ['kind', 'interest', 'listen', 'learn', 'ask', 'compliment', 'friend'] },
      ],
    },
    'my-school': {
      items: [
        { prompt: 'Who are some people at your school?', answer: 'teachers students principal and staff', type: 'open', acceptedKeywords: ['teacher', 'student', 'principal', 'friend', 'nurse', 'janitor', 'cook'] },
        { prompt: 'What do you do at school?', answer: 'learn play and make friends', type: 'open', acceptedKeywords: ['learn', 'play', 'read', 'write', 'friend', 'math', 'art'] },
        { prompt: 'Why is school a community?', answer: 'because people work and learn together', type: 'open', acceptedKeywords: ['together', 'people', 'work', 'learn', 'help', 'share'] },
        { prompt: 'How can you be a good member of your school community?', answer: 'by being kind following rules and helping others', type: 'open', acceptedKeywords: ['kind', 'rule', 'help', 'respect', 'share', 'listen'] },
        { prompt: 'What makes your school special?', answer: 'the people and what they do together', type: 'open', acceptedKeywords: ['people', 'teacher', 'friend', 'together', 'learn', 'fun', 'special'] },
      ],
    },
    'my-neighborhood': {
      items: [
        { prompt: 'What is a neighborhood?', answer: 'the area around your home where people live', type: 'open', acceptedKeywords: ['area', 'home', 'live', 'place', 'near', 'around', 'people'] },
        { prompt: 'Who lives in your neighborhood?', answer: 'families and neighbors', type: 'open', acceptedKeywords: ['famil', 'neighbor', 'people', 'friend', 'kid'] },
        { prompt: 'What places might be in a neighborhood?', answer: 'stores parks schools and homes', type: 'open', acceptedKeywords: ['store', 'park', 'school', 'home', 'church', 'library', 'playground'] },
        { prompt: 'How can neighbors help each other?', answer: 'by sharing watching out for each other and being friendly', type: 'open', acceptedKeywords: ['share', 'help', 'friend', 'watch', 'kind', 'wave', 'care'] },
        { prompt: 'Is every neighborhood the same?', answer: 'no neighborhoods are all different', type: 'open', acceptedKeywords: ['no', 'different', 'unique', 'each'] },
      ],
    },
    'people-around-me': {
      items: [
        { prompt: 'Do all people look the same?', answer: 'no people look different and that is beautiful', type: 'open', acceptedKeywords: ['no', 'different', 'beautiful', 'special', 'unique'] },
        { prompt: 'Do all people speak the same language?', answer: 'no people speak many different languages', type: 'open', acceptedKeywords: ['no', 'different', 'many', 'language'] },
        { prompt: 'What is one thing all people need?', answer: 'food water love or shelter', type: 'open', acceptedKeywords: ['food', 'water', 'love', 'shelter', 'home', 'care', 'family'] },
        { prompt: 'How are all people the same?', answer: 'we all have feelings needs and families', type: 'open', acceptedKeywords: ['feel', 'need', 'family', 'love', 'same', 'human', 'eat', 'sleep'] },
        { prompt: 'What can you learn from someone who is different from you?', answer: 'new things like food games and words', type: 'open', acceptedKeywords: ['new', 'learn', 'food', 'game', 'word', 'story', 'different', 'culture'] },
      ],
    },
    'family-celebrations': {
      items: [
        { prompt: 'What does your family celebrate?', answer: 'birthdays holidays or traditions', type: 'open', acceptedKeywords: ['birthday', 'holiday', 'tradition', 'dinner', 'party', 'thanksgiv'] },
        { prompt: 'Why do families celebrate?', answer: 'to be together and share happy times', type: 'open', acceptedKeywords: ['together', 'happy', 'share', 'love', 'fun', 'remember', 'special'] },
        { prompt: 'Does every family celebrate the same things?', answer: 'no different families celebrate different things', type: 'open', acceptedKeywords: ['no', 'different'] },
        { prompt: 'What is a tradition?', answer: 'something a family or group does the same way again and again', type: 'open', acceptedKeywords: ['same', 'again', 'repeat', 'always', 'every', 'way', 'custom'] },
        { prompt: 'Name one celebration food from any culture.', answer: 'any cultural food', type: 'open', acceptedKeywords: ['cake', 'turkey', 'tamale', 'dumpling', 'pie', 'rice', 'latke', 'cookie'] },
      ],
    },
    'community-celebrations': {
      items: [
        { prompt: 'What is a community celebration?', answer: 'a celebration where many people in the community come together', type: 'open', acceptedKeywords: ['community', 'together', 'people', 'many', 'celebrate', 'share'] },
        { prompt: 'Name a community celebration.', answer: 'parade festival or holiday event', type: 'open', acceptedKeywords: ['parade', 'festival', 'fair', 'holiday', 'firework', 'fourth', 'cinco'] },
        { prompt: 'Why do communities celebrate together?', answer: 'to bring people together and share joy', type: 'open', acceptedKeywords: ['together', 'share', 'joy', 'connect', 'community', 'fun', 'people'] },
        { prompt: 'How can celebrations teach you about other cultures?', answer: 'you learn about their food music and traditions', type: 'open', acceptedKeywords: ['food', 'music', 'tradition', 'learn', 'new', 'culture', 'dance'] },
        { prompt: 'Is it okay to join a celebration from a different culture?', answer: 'yes if you are respectful', type: 'open', acceptedKeywords: ['yes', 'respect', 'learn', 'welcome', 'invit'] },
      ],
    },
  },
  'grade-1': {
    'different-families': {
      items: [
        { prompt: 'Name three different types of families.', answer: 'single parent two parent grandparent-led or blended', type: 'open', acceptedKeywords: ['single', 'two', 'grandparent', 'blend', 'foster', 'adopt', 'extended'] },
        { prompt: 'True or false: A family must have a mom and a dad.', answer: 'false', type: 'exact' },
        { prompt: 'What do all families have in common?', answer: 'love and caring for each other', type: 'open', acceptedKeywords: ['love', 'care', 'together', 'help', 'support'] },
        { prompt: 'Can a family be just two people?', answer: 'yes', type: 'open', acceptedKeywords: ['yes'] },
        { prompt: 'Why is it important to respect all kinds of families?', answer: 'because every family is special and deserves respect', type: 'open', acceptedKeywords: ['respect', 'special', 'different', 'love', 'deserve', 'all', 'kind'] },
      ],
    },
    'family-roles': {
      items: [
        { prompt: 'What do parents or guardians do in a family?', answer: 'take care of children and provide for the family', type: 'open', acceptedKeywords: ['care', 'provide', 'protect', 'love', 'teach', 'feed', 'help'] },
        { prompt: 'What can children do to help their family?', answer: 'do chores be kind and help each other', type: 'open', acceptedKeywords: ['chore', 'help', 'kind', 'clean', 'share', 'listen', 'cooperat'] },
        { prompt: 'Do grandparents have a role in families?', answer: 'yes they share stories wisdom and help care for children', type: 'open', acceptedKeywords: ['yes', 'story', 'wisdom', 'care', 'help', 'teach', 'love'] },
        { prompt: 'Are family roles the same in every culture?', answer: 'no different cultures have different family roles', type: 'open', acceptedKeywords: ['no', 'different', 'culture', 'varies'] },
        { prompt: 'Why does everyone in a family have a role?', answer: 'so the family works well together', type: 'open', acceptedKeywords: ['together', 'work', 'help', 'team', 'share', 'cooperat'] },
      ],
    },
    'family-traditions': {
      items: [
        { prompt: 'What is a family tradition?', answer: 'something a family does regularly that is passed down', type: 'open', acceptedKeywords: ['regular', 'pass', 'always', 'every', 'special', 'custom', 'repeat', 'same'] },
        { prompt: 'Give an example of a family tradition.', answer: 'holiday dinner game night or special recipes', type: 'open', acceptedKeywords: ['dinner', 'game', 'recipe', 'holiday', 'story', 'trip', 'prayer', 'song'] },
        { prompt: 'Where do family traditions come from?', answer: 'from culture heritage and family history', type: 'open', acceptedKeywords: ['culture', 'heritage', 'history', 'parent', 'grandparent', 'country', 'ancestor'] },
        { prompt: 'Can families create new traditions?', answer: 'yes', type: 'open', acceptedKeywords: ['yes'] },
        { prompt: 'Why are traditions important?', answer: 'they connect families to their past and to each other', type: 'open', acceptedKeywords: ['connect', 'past', 'together', 'remember', 'belong', 'identity', 'bond'] },
      ],
    },
    'same-and-different': {
      items: [
        { prompt: 'Name one way people are the same everywhere.', answer: 'everyone needs food water and love', type: 'open', acceptedKeywords: ['food', 'water', 'love', 'family', 'sleep', 'feel', 'need'] },
        { prompt: 'Name one way people can be different.', answer: 'language food traditions or appearance', type: 'open', acceptedKeywords: ['language', 'food', 'tradition', 'look', 'clothe', 'religion', 'music'] },
        { prompt: 'Is being different a good thing or a bad thing?', answer: 'a good thing because we learn from each other', type: 'open', acceptedKeywords: ['good', 'learn', 'interest', 'special', 'wonder'] },
        { prompt: 'What does diversity mean?', answer: 'having many different kinds of people', type: 'open', acceptedKeywords: ['different', 'many', 'variety', 'kinds', 'people'] },
        { prompt: 'How can differences make a community stronger?', answer: 'different people bring different ideas and skills', type: 'open', acceptedKeywords: ['different', 'idea', 'skill', 'strength', 'learn', 'better', 'variety'] },
      ],
    },
    'respecting-differences': {
      items: [
        { prompt: 'What does respect mean?', answer: 'treating others the way they want to be treated', type: 'open', acceptedKeywords: ['treat', 'kind', 'value', 'care', 'listen', 'polite'] },
        { prompt: 'How can you show respect for someone who is different from you?', answer: 'by listening being kind and asking questions', type: 'open', acceptedKeywords: ['listen', 'kind', 'ask', 'learn', 'polite', 'interest', 'friend'] },
        { prompt: 'Is it okay to be curious about someone\'s culture?', answer: 'yes as long as you are respectful', type: 'open', acceptedKeywords: ['yes', 'respect', 'polite', 'ask', 'learn'] },
        { prompt: 'What should you do if someone makes fun of another person\'s culture?', answer: 'stand up for them and tell an adult', type: 'open', acceptedKeywords: ['stand up', 'tell', 'adult', 'stop', 'wrong', 'help', 'kind'] },
        { prompt: 'True or false: Your way of doing things is the only right way.', answer: 'false', type: 'exact' },
      ],
    },
    'holidays-around-world': {
      items: [
        { prompt: 'What is Diwali?', answer: 'the hindu festival of lights', type: 'open', acceptedKeywords: ['hindu', 'light', 'india', 'festival', 'lamp'] },
        { prompt: 'What is Chinese New Year?', answer: 'the celebration of the new year in the chinese calendar', type: 'open', acceptedKeywords: ['chinese', 'new year', 'lunar', 'celebration', 'dragon'] },
        { prompt: 'What is Hanukkah?', answer: 'a jewish holiday celebrating the miracle of light', type: 'open', acceptedKeywords: ['jewish', 'light', 'menorah', 'candle', 'miracle', 'eight'] },
        { prompt: 'What do many holidays have in common?', answer: 'food family music and celebration', type: 'open', acceptedKeywords: ['food', 'family', 'music', 'celebrat', 'together', 'light', 'joy'] },
        { prompt: 'Why is it fun to learn about holidays from other cultures?', answer: 'you learn new things and see how people celebrate differently', type: 'open', acceptedKeywords: ['learn', 'new', 'different', 'fun', 'interest', 'culture'] },
      ],
    },
    'why-we-celebrate': {
      items: [
        { prompt: 'Why do people celebrate?', answer: 'to remember important events and share happiness', type: 'open', acceptedKeywords: ['remember', 'important', 'happy', 'together', 'share', 'joy'] },
        { prompt: 'Can celebrations be sad?', answer: 'yes some celebrations honor people who have passed or difficult events', type: 'open', acceptedKeywords: ['yes', 'honor', 'remember', 'sad', 'passed', 'memorial'] },
        { prompt: 'What is one celebration that honors a person?', answer: 'martin luther king jr day or presidents day', type: 'open', acceptedKeywords: ['mlk', 'martin', 'king', 'president', 'lincoln', 'washington', 'veteran'] },
        { prompt: 'How do celebrations bring people together?', answer: 'people share food stories and time', type: 'open', acceptedKeywords: ['share', 'food', 'story', 'time', 'together', 'commun', 'gather'] },
        { prompt: 'What new celebration would you create?', answer: 'any thoughtful answer', type: 'open', acceptedKeywords: ['day', 'celebrat', 'honor', 'because', 'important', 'would'] },
      ],
    },
  },
  'grade-2': {
    'cultural-neighborhoods': {
      items: [
        { prompt: 'What is a cultural neighborhood?', answer: 'an area where people of a shared culture live and have businesses', type: 'open', acceptedKeywords: ['culture', 'people', 'area', 'shared', 'business', 'live', 'community'] },
        { prompt: 'Name an example of a cultural neighborhood.', answer: 'chinatown little italy or koreatown', type: 'open', acceptedKeywords: ['chinatown', 'little italy', 'koreatown', 'barrio', 'japantown'] },
        { prompt: 'What might you find in a cultural neighborhood?', answer: 'restaurants shops and signs in different languages', type: 'open', acceptedKeywords: ['restaurant', 'shop', 'sign', 'language', 'food', 'store', 'temple', 'church'] },
        { prompt: 'Why do people form cultural neighborhoods?', answer: 'to be near people who share their culture and language', type: 'open', acceptedKeywords: ['share', 'culture', 'language', 'comfort', 'support', 'community', 'near'] },
        { prompt: 'How can visiting a cultural neighborhood help you learn?', answer: 'you experience food language and traditions firsthand', type: 'open', acceptedKeywords: ['food', 'language', 'tradition', 'experience', 'learn', 'see', 'taste'] },
      ],
    },
    'food-and-culture': {
      items: [
        { prompt: 'How does food connect to culture?', answer: 'every culture has special foods and recipes passed down through generations', type: 'open', acceptedKeywords: ['special', 'recipe', 'generation', 'tradition', 'pass', 'family', 'culture'] },
        { prompt: 'Name a food from another culture.', answer: 'sushi tacos pasta curry or dim sum', type: 'open', acceptedKeywords: ['sushi', 'taco', 'pasta', 'curry', 'dim sum', 'pizza', 'noodle', 'rice', 'falafel'] },
        { prompt: 'Why do different cultures eat different foods?', answer: 'because of geography climate and tradition', type: 'open', acceptedKeywords: ['geography', 'climate', 'tradition', 'grow', 'available', 'land', 'history'] },
        { prompt: 'Have you ever tried food from another culture?', answer: 'open ended', type: 'open', acceptedKeywords: ['yes', 'tried', 'ate', 'liked', 'food', 'restaurant'] },
        { prompt: 'How is sharing food a way to share culture?', answer: 'food tells stories about where people come from', type: 'open', acceptedKeywords: ['story', 'share', 'learn', 'together', 'culture', 'connect', 'come from'] },
      ],
    },
    'language-diversity': {
      items: [
        { prompt: 'How many languages are spoken in the world? A) About 100 B) About 7000 C) About 500', answer: 'b', type: 'multiple-choice' },
        { prompt: 'What does bilingual mean?', answer: 'speaking two languages', type: 'open', acceptedKeywords: ['two', 'language', 'speak', '2'] },
        { prompt: 'Why is it good to learn another language?', answer: 'you can talk to more people and understand other cultures', type: 'open', acceptedKeywords: ['talk', 'people', 'understand', 'culture', 'communicat', 'brain', 'travel'] },
        { prompt: 'How do you say hello in Spanish?', answer: 'hola', type: 'open', acceptedKeywords: ['hola'] },
        { prompt: 'Is one language better than another?', answer: 'no all languages are equally valuable', type: 'open', acceptedKeywords: ['no', 'equal', 'all', 'valuable', 'same', 'important'] },
      ],
    },
    'why-people-move': {
      items: [
        { prompt: 'Why do people move to a new country?', answer: 'for safety jobs freedom or family', type: 'open', acceptedKeywords: ['safe', 'job', 'freedom', 'family', 'opportunity', 'war', 'better', 'escape'] },
        { prompt: 'What is an immigrant?', answer: 'a person who moves to a new country to live', type: 'open', acceptedKeywords: ['person', 'move', 'country', 'new', 'live'] },
        { prompt: 'Is it easy or hard to move to a new country?', answer: 'usually hard because you leave behind familiar things', type: 'open', acceptedKeywords: ['hard', 'difficult', 'leave', 'new', 'language', 'miss', 'family'] },
        { prompt: 'What do immigrants bring to their new country?', answer: 'their culture food traditions and skills', type: 'open', acceptedKeywords: ['culture', 'food', 'tradition', 'skill', 'language', 'idea', 'story'] },
        { prompt: 'How can you help someone who is new to your community?', answer: 'be friendly show them around and include them', type: 'open', acceptedKeywords: ['friend', 'show', 'include', 'help', 'kind', 'welcom', 'talk'] },
      ],
    },
    'immigrant-stories': {
      items: [
        { prompt: 'Why is it important to listen to immigrant stories?', answer: 'to understand their experiences and show empathy', type: 'open', acceptedKeywords: ['understand', 'experience', 'empathy', 'learn', 'know', 'respect', 'story'] },
        { prompt: 'What challenges do immigrants face?', answer: 'language barriers homesickness and learning new customs', type: 'open', acceptedKeywords: ['language', 'homesick', 'custom', 'new', 'miss', 'learn', 'fit in', 'discrimin'] },
        { prompt: 'What is the Statue of Liberty a symbol of?', answer: 'freedom and welcome to immigrants', type: 'open', acceptedKeywords: ['freedom', 'welcome', 'immigrant', 'liberty', 'hope'] },
        { prompt: 'True or false: America has always been a country of immigrants.', answer: 'true', type: 'exact' },
        { prompt: 'How do immigrant families keep their culture alive in a new country?', answer: 'by keeping traditions language and cooking from their homeland', type: 'open', acceptedKeywords: ['tradition', 'language', 'cook', 'food', 'celebrat', 'story', 'music', 'homeland'] },
      ],
    },
    'customs-and-traditions': {
      items: [
        { prompt: 'What is a custom?', answer: 'a usual way of doing things in a culture', type: 'open', acceptedKeywords: ['usual', 'way', 'culture', 'do', 'practice', 'habit', 'normal'] },
        { prompt: 'Name a custom from your culture.', answer: 'any cultural practice', type: 'open', acceptedKeywords: ['shake', 'hand', 'bow', 'hug', 'prayer', 'holiday', 'meal', 'greeting'] },
        { prompt: 'Why do cultures have different customs?', answer: 'because they developed in different places with different histories', type: 'open', acceptedKeywords: ['different', 'place', 'history', 'develop', 'geography', 'belief'] },
        { prompt: 'What should you do if a custom seems strange to you?', answer: 'be respectful and try to learn about it', type: 'open', acceptedKeywords: ['respect', 'learn', 'ask', 'understand', 'open', 'mind'] },
        { prompt: 'Can customs change over time?', answer: 'yes customs can change as societies change', type: 'open', acceptedKeywords: ['yes', 'change', 'evolv', 'time', 'new', 'adapt'] },
      ],
    },
    'cultural-artifacts': {
      items: [
        { prompt: 'What is a cultural artifact?', answer: 'an object made by people that tells about their culture', type: 'open', acceptedKeywords: ['object', 'people', 'culture', 'made', 'tell', 'show', 'learn'] },
        { prompt: 'Give an example of a cultural artifact.', answer: 'pottery clothing tools or artwork', type: 'open', acceptedKeywords: ['pottery', 'cloth', 'tool', 'art', 'mask', 'jewelry', 'weapon', 'instrument'] },
        { prompt: 'What can artifacts teach us about a culture?', answer: 'how people lived what they valued and what they made', type: 'open', acceptedKeywords: ['live', 'value', 'made', 'history', 'believe', 'create', 'use'] },
        { prompt: 'Where can you see cultural artifacts?', answer: 'in museums', type: 'open', acceptedKeywords: ['museum'] },
        { prompt: 'If you could save one artifact from your family, what would it be?', answer: 'any meaningful family object', type: 'open', acceptedKeywords: ['photo', 'recipe', 'book', 'quilt', 'jewelry', 'letter', 'toy', 'special'] },
      ],
    },
  },
  'grade-3': {
    'food-shelter-clothing': {
      items: [
        { prompt: 'What are cultural universals?', answer: 'things all cultures have in common', type: 'open', acceptedKeywords: ['all', 'common', 'culture', 'same', 'every', 'share', 'universal'] },
        { prompt: 'All cultures have food, shelter, and clothing. But are they the same everywhere?', answer: 'no they are different based on climate geography and tradition', type: 'open', acceptedKeywords: ['no', 'different', 'climate', 'geography', 'tradition', 'varies'] },
        { prompt: 'Why do people in different places eat different foods?', answer: 'because different foods grow in different climates', type: 'open', acceptedKeywords: ['grow', 'climate', 'different', 'available', 'land', 'geography'] },
        { prompt: 'Why do houses look different around the world?', answer: 'because of climate available materials and cultural style', type: 'open', acceptedKeywords: ['climate', 'material', 'style', 'weather', 'available', 'culture'] },
        { prompt: 'Why do people in different cultures wear different clothing?', answer: 'climate traditions religion and available materials', type: 'open', acceptedKeywords: ['climate', 'tradition', 'religion', 'material', 'weather', 'culture'] },
      ],
    },
    'family-and-education': {
      items: [
        { prompt: 'Do all cultures have families?', answer: 'yes but family structures vary', type: 'open', acceptedKeywords: ['yes', 'vary', 'different', 'structure', 'all'] },
        { prompt: 'Do all cultures educate children?', answer: 'yes though methods differ', type: 'open', acceptedKeywords: ['yes', 'differ', 'method', 'way', 'all'] },
        { prompt: 'In some cultures, who teaches children besides schools?', answer: 'elders family community or religious leaders', type: 'open', acceptedKeywords: ['elder', 'family', 'community', 'religious', 'parent', 'grandparent'] },
        { prompt: 'Why is education a cultural universal?', answer: 'every culture needs to pass on knowledge to the next generation', type: 'open', acceptedKeywords: ['pass', 'knowledge', 'generation', 'next', 'learn', 'teach', 'need'] },
        { prompt: 'How is school different in other countries?', answer: 'different schedules uniforms subjects and teaching styles', type: 'open', acceptedKeywords: ['different', 'schedule', 'uniform', 'subject', 'style', 'language', 'hours'] },
      ],
    },
    'stories-and-art': {
      items: [
        { prompt: 'Why do all cultures tell stories?', answer: 'to teach lessons share history and entertain', type: 'open', acceptedKeywords: ['teach', 'lesson', 'history', 'entertain', 'share', 'pass', 'value'] },
        { prompt: 'What is a folktale?', answer: 'a traditional story passed down through generations', type: 'open', acceptedKeywords: ['traditional', 'story', 'pass', 'generation', 'told', 'old'] },
        { prompt: 'Name one type of art found in many cultures.', answer: 'music dance painting pottery or weaving', type: 'open', acceptedKeywords: ['music', 'dance', 'paint', 'pottery', 'weav', 'sculpt', 'sing'] },
        { prompt: 'How does art reflect culture?', answer: 'it shows what people value believe and experience', type: 'open', acceptedKeywords: ['value', 'believe', 'experience', 'show', 'reflect', 'express'] },
        { prompt: 'What can you learn about a culture from its stories?', answer: 'their values beliefs and history', type: 'open', acceptedKeywords: ['value', 'belief', 'history', 'lesson', 'important', 'culture'] },
      ],
    },
    'native-american-regions': {
      items: [
        { prompt: 'Name two Native American cultural regions.', answer: 'eastern woodlands plains southwest northwest coast or arctic', type: 'open', acceptedKeywords: ['woodland', 'plain', 'southwest', 'northwest', 'arctic', 'southeast', 'great basin'] },
        { prompt: 'How did geography affect Native American cultures?', answer: 'the land and climate shaped their food housing and traditions', type: 'open', acceptedKeywords: ['land', 'climate', 'food', 'housing', 'tradition', 'geography', 'shape'] },
        { prompt: 'What did Plains peoples use for shelter?', answer: 'tipis made from buffalo hides', type: 'open', acceptedKeywords: ['tipi', 'buffalo', 'hide', 'tent'] },
        { prompt: 'What did Southwest peoples like the Pueblo build?', answer: 'adobe houses made from clay and sun-dried bricks', type: 'open', acceptedKeywords: ['adobe', 'clay', 'brick', 'pueblo', 'stone'] },
        { prompt: 'True or false: All Native Americans had the same culture.', answer: 'false', type: 'exact' },
      ],
    },
    'indigenous-traditions': {
      items: [
        { prompt: 'Why is oral tradition important in indigenous cultures?', answer: 'stories and knowledge were passed down through speaking and listening', type: 'open', acceptedKeywords: ['story', 'knowledge', 'pass', 'speak', 'listen', 'oral', 'generation', 'tell'] },
        { prompt: 'What is a powwow?', answer: 'a gathering of Native Americans for dancing singing and celebration', type: 'open', acceptedKeywords: ['gather', 'dance', 'sing', 'celebrat', 'native', 'ceremony'] },
        { prompt: 'Why is the land important in many indigenous cultures?', answer: 'they see the land as sacred and connected to their identity', type: 'open', acceptedKeywords: ['sacred', 'connect', 'identity', 'spiritual', 'respect', 'mother', 'belong'] },
        { prompt: 'Are indigenous cultures still alive today?', answer: 'yes they are living cultures that continue to thrive', type: 'open', acceptedKeywords: ['yes', 'living', 'today', 'alive', 'continu', 'thrive'] },
        { prompt: 'Why should we learn about indigenous cultures?', answer: 'to respect their history understand their contributions and appreciate diversity', type: 'open', acceptedKeywords: ['respect', 'history', 'contribut', 'divers', 'learn', 'understand'] },
      ],
    },
    'sharing-cultures': {
      items: [
        { prompt: 'What is cultural exchange?', answer: 'when cultures share ideas foods and traditions with each other', type: 'open', acceptedKeywords: ['share', 'idea', 'food', 'tradition', 'culture', 'each other', 'exchange'] },
        { prompt: 'Give an example of cultural exchange.', answer: 'pizza from italy becoming popular in america', type: 'open', acceptedKeywords: ['pizza', 'food', 'music', 'dance', 'language', 'sport', 'art', 'fashion'] },
        { prompt: 'Is cultural exchange positive or negative?', answer: 'usually positive as long as it is respectful', type: 'open', acceptedKeywords: ['positive', 'good', 'respect', 'learn', 'both', 'enriching'] },
        { prompt: 'How does cultural exchange make communities richer?', answer: 'more foods ideas art and ways of thinking', type: 'open', acceptedKeywords: ['food', 'idea', 'art', 'think', 'diverse', 'rich', 'more', 'new'] },
        { prompt: 'Can you think of something in your daily life that came from another culture?', answer: 'food words music technology or clothing', type: 'open', acceptedKeywords: ['food', 'word', 'music', 'technolog', 'cloth', 'sport', 'game'] },
      ],
    },
    'cultural-borrowing': {
      items: [
        { prompt: 'What is the difference between cultural exchange and cultural appropriation?', answer: 'exchange is mutual and respectful while appropriation takes without understanding or respect', type: 'open', acceptedKeywords: ['respect', 'mutual', 'takes', 'without', 'understand', 'exchange', 'appropriat'] },
        { prompt: 'Is it okay to enjoy food from another culture?', answer: 'yes appreciating food is a form of cultural exchange', type: 'open', acceptedKeywords: ['yes', 'appreciat', 'exchange', 'enjoy', 'respect'] },
        { prompt: 'When does cultural borrowing become a problem?', answer: 'when it disrespects sacred or important cultural elements', type: 'open', acceptedKeywords: ['disrespect', 'sacred', 'important', 'without', 'permission', 'mock', 'stereotyp'] },
        { prompt: 'How can you share in another culture respectfully?', answer: 'learn about it ask questions and show respect', type: 'open', acceptedKeywords: ['learn', 'ask', 'respect', 'understand', 'permission', 'listen'] },
        { prompt: 'Why should you learn the meaning behind cultural practices?', answer: 'to understand and respect their significance', type: 'open', acceptedKeywords: ['understand', 'respect', 'significan', 'meaning', 'important', 'why'] },
      ],
    },
  },
  'grade-4': {
    'northeast-culture': {
      items: [
        { prompt: 'Name one cultural influence found in the Northeast United States.', answer: 'European immigration shaped food language and architecture', type: 'open', acceptedKeywords: ['European', 'immigra', 'food', 'language', 'architecture', 'Irish', 'Italian'] },
        { prompt: 'Why is New York City considered a cultural melting pot?', answer: 'people from many cultures live and share traditions there', type: 'open', acceptedKeywords: ['many', 'culture', 'tradition', 'diverse', 'world', 'people', 'share'] },
        { prompt: 'What is a cultural melting pot?', answer: 'a place where many cultures blend together', type: 'open', acceptedKeywords: ['many', 'culture', 'blend', 'mix', 'together', 'combine'] },
        { prompt: 'How did Irish immigrants influence Northeast culture?', answer: 'they brought traditions like St. Patrick\'s Day and Irish music', type: 'open', acceptedKeywords: ['St. Patrick', 'music', 'tradition', 'food', 'church', 'dance'] },
        { prompt: 'What role did the port of Ellis Island play in shaping Northeastern culture?', answer: 'millions of immigrants entered the US through Ellis Island bringing their cultures', type: 'open', acceptedKeywords: ['immigrant', 'enter', 'culture', 'million', 'arrive', 'brought'] },
        { prompt: 'Name a food tradition in the Northeast that came from immigrants.', answer: 'pizza from Italian immigrants or bagels from Jewish immigrants', type: 'open', acceptedKeywords: ['pizza', 'Italian', 'bagel', 'Jewish', 'clam', 'chowder', 'food'] },
      ],
    },
    'south-culture': {
      items: [
        { prompt: 'What cultures have influenced the American South?', answer: 'African American Native American and European cultures', type: 'open', acceptedKeywords: ['African', 'Native', 'European', 'Black', 'indigenous', 'culture'] },
        { prompt: 'How did African Americans shape Southern culture?', answer: 'through music like jazz and blues food and traditions', type: 'open', acceptedKeywords: ['music', 'jazz', 'blues', 'food', 'tradition', 'gospel', 'spiritual'] },
        { prompt: 'What is Southern hospitality?', answer: 'a cultural tradition of being welcoming and generous to guests', type: 'open', acceptedKeywords: ['welcom', 'generous', 'guest', 'kind', 'friendly', 'polite'] },
        { prompt: 'Name a food associated with Southern culture.', answer: 'barbecue cornbread or fried chicken', type: 'open', acceptedKeywords: ['barbecue', 'cornbread', 'fried chicken', 'grits', 'gumbo', 'collard'] },
        { prompt: 'How did the history of slavery affect Southern culture?', answer: 'it created lasting cultural contributions from African Americans while also causing deep injustice', type: 'open', acceptedKeywords: ['African American', 'music', 'injustice', 'contribut', 'lasting', 'culture', 'legacy'] },
        { prompt: 'What is Mardi Gras and where is it celebrated?', answer: 'a festive celebration held in New Orleans Louisiana', type: 'open', acceptedKeywords: ['New Orleans', 'Louisiana', 'festival', 'celebrat', 'parade', 'carnival'] },
      ],
    },
    'midwest-culture': {
      items: [
        { prompt: 'What cultural values are associated with the Midwest?', answer: 'hard work friendliness and community', type: 'open', acceptedKeywords: ['hard work', 'friend', 'community', 'honest', 'family', 'neighbor'] },
        { prompt: 'How did German and Scandinavian immigrants influence Midwest culture?', answer: 'they brought farming traditions foods and festivals', type: 'open', acceptedKeywords: ['farm', 'food', 'festival', 'tradition', 'brat', 'sausage', 'Lutheran'] },
        { prompt: 'Why is the Midwest sometimes called the heartland?', answer: 'because it is in the center of the country and has farming communities', type: 'open', acceptedKeywords: ['center', 'farm', 'heart', 'middle', 'agriculture', 'country'] },
        { prompt: 'What industries shape Midwest culture?', answer: 'farming and manufacturing', type: 'open', acceptedKeywords: ['farm', 'manufactur', 'agriculture', 'auto', 'factory', 'industry'] },
        { prompt: 'How do state fairs reflect Midwest culture?', answer: 'they celebrate farming community and local traditions', type: 'open', acceptedKeywords: ['farm', 'community', 'tradition', 'local', 'food', 'agriculture', 'celebrat'] },
        { prompt: 'Name a cultural tradition from the Midwest.', answer: 'county fairs potluck dinners or high school football', type: 'open', acceptedKeywords: ['fair', 'potluck', 'football', 'harvest', 'dinner', 'festival'] },
      ],
    },
    'west-culture': {
      items: [
        { prompt: 'What cultures have influenced the American West?', answer: 'Native American Hispanic Asian and European cultures', type: 'open', acceptedKeywords: ['Native', 'Hispanic', 'Asian', 'European', 'Mexican', 'Chinese', 'Japanese'] },
        { prompt: 'How did the Gold Rush affect Western culture?', answer: 'it brought people from around the world creating a diverse culture', type: 'open', acceptedKeywords: ['diverse', 'world', 'people', 'culture', 'different', 'many'] },
        { prompt: 'How have Asian immigrants influenced West Coast culture?', answer: 'through food festivals language and business', type: 'open', acceptedKeywords: ['food', 'festival', 'language', 'business', 'Chinatown', 'restaurant'] },
        { prompt: 'What is the cultural significance of Hollywood?', answer: 'it shapes American culture through movies and entertainment', type: 'open', acceptedKeywords: ['movie', 'entertainment', 'film', 'culture', 'influence', 'media'] },
        { prompt: 'How has Mexican culture influenced the American West?', answer: 'through food language music and architecture', type: 'open', acceptedKeywords: ['food', 'language', 'Spanish', 'music', 'architecture', 'taco', 'fiesta'] },
        { prompt: 'What is unique about the cultural diversity of the West?', answer: 'it has influences from many different countries and cultures all mixed together', type: 'open', acceptedKeywords: ['many', 'different', 'culture', 'diverse', 'mix', 'country', 'influence'] },
      ],
    },
    'early-immigration': {
      items: [
        { prompt: 'Who were some of the earliest immigrants to America?', answer: 'English Spanish French and Dutch settlers', type: 'open', acceptedKeywords: ['English', 'Spanish', 'French', 'Dutch', 'settler', 'European'] },
        { prompt: 'Why did early immigrants come to America?', answer: 'for religious freedom land and economic opportunity', type: 'open', acceptedKeywords: ['religious', 'freedom', 'land', 'economic', 'opportunity', 'escape', 'better'] },
        { prompt: 'What challenges did early immigrants face?', answer: 'long sea voyages harsh conditions and unfamiliar land', type: 'open', acceptedKeywords: ['sea', 'voyage', 'harsh', 'unfamiliar', 'disease', 'danger', 'hard'] },
        { prompt: 'How did early European immigrants affect Native Americans?', answer: 'they took land spread disease and disrupted Native cultures', type: 'open', acceptedKeywords: ['land', 'disease', 'disrupt', 'culture', 'took', 'displac'] },
        { prompt: 'What crops and traditions did early immigrants bring with them?', answer: 'wheat livestock and European farming traditions', type: 'open', acceptedKeywords: ['wheat', 'livestock', 'farm', 'tradition', 'crop', 'European'] },
        { prompt: 'True or false: All early immigrants came willingly.', answer: 'false — many Africans were brought by force through the slave trade', type: 'open', acceptedKeywords: ['false', 'slave', 'force', 'African', 'not willing', 'involuntary'] },
      ],
    },
    'ellis-island-era': {
      items: [
        { prompt: 'When was Ellis Island open as an immigration station?', answer: 'from 1892 to 1954', type: 'open', acceptedKeywords: ['1892', '1954', 'late 1800s', 'early 1900s'] },
        { prompt: 'Where is Ellis Island located?', answer: 'in New York Harbor near the Statue of Liberty', type: 'open', acceptedKeywords: ['New York', 'harbor', 'Statue of Liberty', 'near'] },
        { prompt: 'How many immigrants passed through Ellis Island?', answer: 'about 12 million', type: 'open', acceptedKeywords: ['12 million', 'million', 'twelve'] },
        { prompt: 'What countries did many Ellis Island immigrants come from?', answer: 'Italy Ireland Poland Russia and Germany', type: 'open', acceptedKeywords: ['Italy', 'Ireland', 'Poland', 'Russia', 'Germany', 'European'] },
        { prompt: 'What did immigrants have to do at Ellis Island?', answer: 'pass medical exams and answer questions about their identity', type: 'open', acceptedKeywords: ['medical', 'exam', 'question', 'inspect', 'check', 'test'] },
        { prompt: 'Why do many Americans trace their family history through Ellis Island?', answer: 'because many of their ancestors arrived through that immigration station', type: 'open', acceptedKeywords: ['ancestor', 'arrived', 'family', 'history', 'came through', 'heritage'] },
      ],
    },
    'modern-immigration': {
      items: [
        { prompt: 'Where do most modern immigrants to the US come from?', answer: 'Latin America and Asia', type: 'open', acceptedKeywords: ['Latin America', 'Asia', 'Mexico', 'China', 'India', 'Central America'] },
        { prompt: 'How has immigration changed America\'s culture?', answer: 'it has made America more diverse with new foods languages and traditions', type: 'open', acceptedKeywords: ['diverse', 'food', 'language', 'tradition', 'new', 'culture', 'rich'] },
        { prompt: 'What is a visa?', answer: 'an official document that allows someone to enter or stay in a country', type: 'open', acceptedKeywords: ['document', 'allow', 'enter', 'country', 'permission', 'stay'] },
        { prompt: 'What challenges do modern immigrants face?', answer: 'language barriers finding jobs and adjusting to a new culture', type: 'open', acceptedKeywords: ['language', 'job', 'adjust', 'new', 'culture', 'barrier', 'discrimin'] },
        { prompt: 'How can communities welcome new immigrants?', answer: 'by offering language classes being inclusive and celebrating diversity', type: 'open', acceptedKeywords: ['language', 'inclusive', 'divers', 'welcom', 'help', 'support', 'class'] },
        { prompt: 'Why do people continue to immigrate to the United States?', answer: 'for better opportunities safety and to join family', type: 'open', acceptedKeywords: ['opportunit', 'safe', 'family', 'better', 'freedom', 'job', 'education'] },
      ],
    },
    'cultural-identity': {
      items: [
        { prompt: 'What is cultural identity?', answer: 'the sense of belonging to a group based on shared culture', type: 'open', acceptedKeywords: ['belong', 'group', 'shared', 'culture', 'identity', 'who you are'] },
        { prompt: 'What shapes a person\'s cultural identity?', answer: 'family language religion traditions and community', type: 'open', acceptedKeywords: ['family', 'language', 'religion', 'tradition', 'community', 'food', 'values'] },
        { prompt: 'Can someone have more than one cultural identity?', answer: 'yes many people identify with multiple cultures', type: 'open', acceptedKeywords: ['yes', 'multiple', 'more than one', 'many', 'both', 'several'] },
        { prompt: 'How can learning about your cultural identity be helpful?', answer: 'it helps you understand yourself and feel proud of your heritage', type: 'open', acceptedKeywords: ['understand', 'proud', 'heritage', 'self', 'know', 'connect'] },
        { prompt: 'Why is it important to respect other people\'s cultural identities?', answer: 'because everyone deserves to feel valued and accepted', type: 'open', acceptedKeywords: ['value', 'accept', 'respect', 'deserv', 'important', 'dignity'] },
        { prompt: 'How can cultural identity change over time?', answer: 'as people move learn and interact with other cultures', type: 'open', acceptedKeywords: ['move', 'learn', 'interact', 'change', 'grow', 'new', 'experience'] },
      ],
    },
    'heritage-and-pride': {
      items: [
        { prompt: 'What is heritage?', answer: 'traditions and history passed down from previous generations', type: 'open', acceptedKeywords: ['tradition', 'history', 'pass', 'generation', 'family', 'ancestor'] },
        { prompt: 'How can you learn about your heritage?', answer: 'talk to family members look at old photos and research family history', type: 'open', acceptedKeywords: ['family', 'photo', 'research', 'talk', 'ask', 'story', 'genealogy'] },
        { prompt: 'Why should people feel proud of their heritage?', answer: 'because it connects them to their ancestors and their story', type: 'open', acceptedKeywords: ['connect', 'ancestor', 'story', 'belong', 'roots', 'history'] },
        { prompt: 'What is a heritage festival?', answer: 'a celebration of a culture\'s traditions food and art', type: 'open', acceptedKeywords: ['celebrat', 'culture', 'tradition', 'food', 'art', 'music', 'festival'] },
        { prompt: 'Is it possible to celebrate your heritage AND appreciate other cultures?', answer: 'yes being proud of your own culture does not mean you cannot respect others', type: 'open', acceptedKeywords: ['yes', 'both', 'proud', 'respect', 'appreciate', 'others'] },
        { prompt: 'What is Heritage Month and why do we have them?', answer: 'months dedicated to celebrating the contributions of specific cultural groups', type: 'open', acceptedKeywords: ['month', 'celebrat', 'contribut', 'cultural', 'group', 'honor', 'recogniz'] },
      ],
    },
  },
  'grade-5': {
    'misunderstanding-cultures': {
      items: [
        { prompt: 'What is a cultural misunderstanding?', answer: 'when people misinterpret another culture\'s actions or beliefs', type: 'open', acceptedKeywords: ['misinterpret', 'culture', 'action', 'belief', 'confus', 'wrong', 'misread'] },
        { prompt: 'Give an example of a cultural misunderstanding.', answer: 'in some cultures nodding means no while in others it means yes', type: 'open', acceptedKeywords: ['nod', 'gesture', 'greeting', 'eye contact', 'custom', 'mean', 'different'] },
        { prompt: 'What causes cultural misunderstandings?', answer: 'lack of knowledge about other cultures and assumptions', type: 'open', acceptedKeywords: ['lack', 'knowledge', 'assumption', 'stereotype', 'ignorance', 'not knowing'] },
        { prompt: 'How can cultural misunderstandings lead to conflict?', answer: 'people may feel disrespected or offended without meaning to be', type: 'open', acceptedKeywords: ['disrespect', 'offend', 'conflict', 'hurt', 'angry', 'misunderstand'] },
        { prompt: 'What is the best way to avoid cultural misunderstandings?', answer: 'learn about other cultures ask respectful questions and keep an open mind', type: 'open', acceptedKeywords: ['learn', 'ask', 'respect', 'open mind', 'listen', 'educate'] },
        { prompt: 'What is ethnocentrism?', answer: 'believing your own culture is better than others', type: 'open', acceptedKeywords: ['own culture', 'better', 'superior', 'judg', 'believe', 'center'] },
      ],
    },
    'conflict-resolution': {
      items: [
        { prompt: 'What is conflict resolution?', answer: 'finding peaceful ways to settle disagreements', type: 'open', acceptedKeywords: ['peaceful', 'settle', 'disagree', 'solve', 'resolve', 'solution'] },
        { prompt: 'How can understanding culture help resolve conflicts?', answer: 'by seeing the other person\'s perspective and respecting differences', type: 'open', acceptedKeywords: ['perspective', 'respect', 'difference', 'understand', 'see', 'other'] },
        { prompt: 'What is compromise?', answer: 'when both sides give up something to reach an agreement', type: 'open', acceptedKeywords: ['both', 'give up', 'agree', 'middle', 'share', 'meet'] },
        { prompt: 'Name one step in resolving a cultural conflict.', answer: 'listen to both sides with respect', type: 'open', acceptedKeywords: ['listen', 'both', 'respect', 'talk', 'understand', 'hear'] },
        { prompt: 'Why is empathy important in conflict resolution?', answer: 'it helps you understand how the other person feels', type: 'open', acceptedKeywords: ['understand', 'feel', 'other', 'perspective', 'care', 'compassion'] },
        { prompt: 'Can conflicts have positive outcomes?', answer: 'yes they can lead to better understanding and stronger relationships', type: 'open', acceptedKeywords: ['yes', 'better', 'understand', 'stronger', 'learn', 'grow', 'positive'] },
      ],
    },
    'arts-and-music': {
      items: [
        { prompt: 'How has African American culture contributed to American music?', answer: 'through jazz blues gospel hip hop and rock and roll', type: 'open', acceptedKeywords: ['jazz', 'blues', 'gospel', 'hip hop', 'rock', 'music', 'rhythm'] },
        { prompt: 'Name a musical instrument that originated in another culture.', answer: 'drums from Africa sitar from India or guitar from Spain', type: 'open', acceptedKeywords: ['drum', 'sitar', 'guitar', 'flute', 'Africa', 'India', 'instrument'] },
        { prompt: 'How does art reflect a culture\'s values?', answer: 'art shows what a culture thinks is important and beautiful', type: 'open', acceptedKeywords: ['important', 'beautiful', 'value', 'show', 'reflect', 'express', 'believe'] },
        { prompt: 'What is folk art?', answer: 'art made by ordinary people using traditional methods', type: 'open', acceptedKeywords: ['ordinary', 'people', 'traditional', 'method', 'handmade', 'community'] },
        { prompt: 'How has immigration influenced American arts?', answer: 'immigrants brought diverse art forms music and traditions that enriched American culture', type: 'open', acceptedKeywords: ['diverse', 'art', 'music', 'tradition', 'enriched', 'brought', 'new'] },
        { prompt: 'Why is it important to preserve traditional arts?', answer: 'they connect people to their cultural heritage and history', type: 'open', acceptedKeywords: ['connect', 'heritage', 'history', 'culture', 'preserve', 'identity', 'past'] },
      ],
    },
    'science-and-innovation': {
      items: [
        { prompt: 'Name a scientific contribution from the ancient Arab world.', answer: 'algebra astronomy or advances in medicine', type: 'open', acceptedKeywords: ['algebra', 'astronomy', 'medicine', 'math', 'science', 'number'] },
        { prompt: 'What did ancient Chinese culture contribute to the world?', answer: 'paper gunpowder the compass and printing', type: 'open', acceptedKeywords: ['paper', 'gunpowder', 'compass', 'printing', 'silk', 'invention'] },
        { prompt: 'How do cultural contributions in science benefit everyone?', answer: 'discoveries from one culture are used by people all over the world', type: 'open', acceptedKeywords: ['everyone', 'world', 'discover', 'share', 'benefit', 'all', 'global'] },
        { prompt: 'What did ancient Indian mathematicians contribute?', answer: 'the number zero and the decimal system', type: 'open', acceptedKeywords: ['zero', 'decimal', 'number', 'math'] },
        { prompt: 'Why is it important to recognize scientific contributions from many cultures?', answer: 'because innovation comes from people of all backgrounds', type: 'open', acceptedKeywords: ['all', 'background', 'culture', 'everyone', 'recogniz', 'diverse', 'contribut'] },
        { prompt: 'How does cultural exchange help scientific progress?', answer: 'sharing ideas across cultures leads to new discoveries and innovation', type: 'open', acceptedKeywords: ['sharing', 'ideas', 'discover', 'innovation', 'new', 'progress', 'collaborate'] },
      ],
    },
    'food-and-language': {
      items: [
        { prompt: 'How have different cultures contributed to American food?', answer: 'Italian pizza Mexican tacos Chinese stir fry and more', type: 'open', acceptedKeywords: ['pizza', 'taco', 'Chinese', 'Indian', 'food', 'cuisine', 'Italian'] },
        { prompt: 'What is fusion food?', answer: 'food that combines elements from different cultural cuisines', type: 'open', acceptedKeywords: ['combin', 'different', 'culture', 'cuisin', 'mix', 'blend'] },
        { prompt: 'How do languages borrow words from each other?', answer: 'through cultural contact trade and immigration', type: 'open', acceptedKeywords: ['contact', 'trade', 'immigra', 'borrow', 'influence', 'share'] },
        { prompt: 'Name an English word borrowed from another language.', answer: 'kindergarten from German or piano from Italian', type: 'open', acceptedKeywords: ['kindergarten', 'piano', 'chocolate', 'safari', 'yoga', 'tsunami'] },
        { prompt: 'Why is language diversity valuable?', answer: 'each language carries unique ideas and ways of understanding the world', type: 'open', acceptedKeywords: ['unique', 'idea', 'understand', 'world', 'valuable', 'perspective', 'culture'] },
        { prompt: 'How does food help preserve cultural identity?', answer: 'traditional recipes connect people to their heritage and ancestors', type: 'open', acceptedKeywords: ['traditional', 'recipe', 'heritage', 'ancestor', 'connect', 'identity', 'culture'] },
      ],
    },
  },
  'grade-6': {
    'world-religions-overview': {
      items: [
        { prompt: 'Name five major world religions.', answer: 'Christianity Islam Hinduism Buddhism and Judaism', type: 'open', acceptedKeywords: ['Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Judaism'] },
        { prompt: 'How does religion shape culture?', answer: 'it influences holidays food customs art and values', type: 'open', acceptedKeywords: ['holiday', 'food', 'custom', 'art', 'value', 'influence', 'shape'] },
        { prompt: 'What is monotheism?', answer: 'belief in one god', type: 'open', acceptedKeywords: ['one', 'god', 'single', 'belief'] },
        { prompt: 'What is polytheism?', answer: 'belief in many gods', type: 'open', acceptedKeywords: ['many', 'god', 'multiple', 'belief'] },
        { prompt: 'Why is religious tolerance important in diverse societies?', answer: 'so people of different beliefs can live together peacefully', type: 'open', acceptedKeywords: ['different', 'belief', 'peacef', 'together', 'respect', 'coexist'] },
        { prompt: 'How do ancient religions still influence modern cultures?', answer: 'through holidays traditions laws and moral values', type: 'open', acceptedKeywords: ['holiday', 'tradition', 'law', 'moral', 'value', 'influence', 'still'] },
      ],
    },
    'ancient-civilizations-culture': {
      items: [
        { prompt: 'What cultural achievements came from ancient Egypt?', answer: 'pyramids hieroglyphics and advances in math and medicine', type: 'open', acceptedKeywords: ['pyramid', 'hieroglyphic', 'math', 'medicine', 'architecture', 'writing'] },
        { prompt: 'How did ancient Greece influence Western culture?', answer: 'through democracy philosophy theater and the Olympics', type: 'open', acceptedKeywords: ['democracy', 'philosophy', 'theater', 'Olympic', 'art', 'science'] },
        { prompt: 'What cultural contributions came from ancient Rome?', answer: 'law engineering roads and the Latin language', type: 'open', acceptedKeywords: ['law', 'engineer', 'road', 'Latin', 'language', 'arch', 'government'] },
        { prompt: 'How did trade routes like the Silk Road spread culture?', answer: 'merchants carried goods ideas religions and art between civilizations', type: 'open', acceptedKeywords: ['goods', 'idea', 'religion', 'art', 'merchant', 'spread', 'exchange'] },
        { prompt: 'What is cultural diffusion?', answer: 'the spread of cultural ideas and practices from one society to another', type: 'open', acceptedKeywords: ['spread', 'cultural', 'idea', 'practice', 'society', 'another', 'transfer'] },
        { prompt: 'Name a cultural legacy from ancient Mesopotamia.', answer: 'writing (cuneiform) the wheel and the 60-minute hour', type: 'open', acceptedKeywords: ['writing', 'cuneiform', 'wheel', '60', 'hour', 'law', 'code'] },
      ],
    },
    'cultural-preservation': {
      items: [
        { prompt: 'What does it mean to preserve a culture?', answer: 'to protect and maintain cultural traditions and practices for future generations', type: 'open', acceptedKeywords: ['protect', 'maintain', 'tradition', 'practice', 'future', 'generation', 'keep'] },
        { prompt: 'Why are endangered languages a concern?', answer: 'when a language dies unique knowledge and cultural perspectives are lost', type: 'open', acceptedKeywords: ['die', 'lost', 'knowledge', 'perspective', 'unique', 'culture'] },
        { prompt: 'How can museums help preserve culture?', answer: 'by collecting and displaying artifacts and teaching about different cultures', type: 'open', acceptedKeywords: ['collect', 'display', 'artifact', 'teach', 'culture', 'exhibit'] },
        { prompt: 'What is UNESCO and how does it protect culture?', answer: 'a UN organization that identifies and protects World Heritage Sites', type: 'open', acceptedKeywords: ['UN', 'United Nations', 'Heritage', 'Site', 'protect', 'world'] },
        { prompt: 'How can technology help preserve culture?', answer: 'by recording languages documenting traditions and sharing them digitally', type: 'open', acceptedKeywords: ['record', 'document', 'digital', 'share', 'online', 'video', 'archive'] },
        { prompt: 'Why should indigenous cultures be preserved?', answer: 'they hold unique knowledge and perspectives that enrich humanity', type: 'open', acceptedKeywords: ['unique', 'knowledge', 'perspective', 'enrich', 'wisdom', 'important', 'heritage'] },
      ],
    },
    'stereotypes-prejudice': {
      items: [
        { prompt: 'What is a stereotype?', answer: 'an oversimplified belief about a group of people', type: 'open', acceptedKeywords: ['oversimpl', 'belief', 'group', 'people', 'generaliz', 'assume'] },
        { prompt: 'What is prejudice?', answer: 'a negative opinion formed without knowledge or reason', type: 'open', acceptedKeywords: ['negative', 'opinion', 'without', 'knowledge', 'unfair', 'judgment', 'bias'] },
        { prompt: 'How do stereotypes harm people?', answer: 'they reduce individuals to unfair generalizations and can lead to discrimination', type: 'open', acceptedKeywords: ['unfair', 'generaliz', 'discrimin', 'hurt', 'reduce', 'harm', 'limit'] },
        { prompt: 'How can you challenge stereotypes?', answer: 'get to know people as individuals and question assumptions', type: 'open', acceptedKeywords: ['individual', 'question', 'assumption', 'know', 'learn', 'challenge', 'meet'] },
        { prompt: 'What is the difference between a stereotype and a fact about a culture?', answer: 'facts are true and nuanced while stereotypes are oversimplified and often wrong', type: 'open', acceptedKeywords: ['fact', 'true', 'nuanced', 'oversimpl', 'wrong', 'different', 'generaliz'] },
        { prompt: 'How can media perpetuate stereotypes?', answer: 'by showing limited or exaggerated portrayals of cultural groups', type: 'open', acceptedKeywords: ['limited', 'exaggerat', 'portrayal', 'show', 'media', 'one-sided', 'inaccurate'] },
      ],
    },
  },
  'grade-7': {
    'globalization-and-culture': {
      items: [
        { prompt: 'What is cultural globalization?', answer: 'the worldwide spread and mixing of cultural ideas practices and products', type: 'open', acceptedKeywords: ['worldwide', 'spread', 'mixing', 'cultural', 'idea', 'practice', 'product'] },
        { prompt: 'How has the internet affected cultural exchange?', answer: 'it allows instant sharing of music art ideas and traditions worldwide', type: 'open', acceptedKeywords: ['instant', 'sharing', 'music', 'art', 'idea', 'worldwide', 'connect'] },
        { prompt: 'What is cultural homogenization?', answer: 'when cultures become more similar due to globalization', type: 'open', acceptedKeywords: ['similar', 'same', 'globalization', 'uniform', 'lose', 'diversity'] },
        { prompt: 'Can globalization threaten local cultures?', answer: 'yes local traditions may be replaced by dominant global culture', type: 'open', acceptedKeywords: ['yes', 'local', 'replace', 'dominant', 'global', 'threaten', 'lose'] },
        { prompt: 'How can cultures resist homogenization?', answer: 'by actively preserving traditions language and cultural practices', type: 'open', acceptedKeywords: ['preserv', 'tradition', 'language', 'practice', 'maintain', 'protect'] },
        { prompt: 'What are some positive effects of cultural globalization?', answer: 'greater understanding cross-cultural learning and access to diverse ideas', type: 'open', acceptedKeywords: ['understand', 'learning', 'diverse', 'access', 'idea', 'awareness', 'connect'] },
        { prompt: 'Give an example of a globally shared cultural product.', answer: 'Hollywood movies K-pop music or social media platforms', type: 'open', acceptedKeywords: ['movie', 'music', 'social media', 'brand', 'food', 'fashion', 'sport'] },
      ],
    },
    'cultural-imperialism': {
      items: [
        { prompt: 'What is cultural imperialism?', answer: 'when a powerful culture dominates or replaces weaker cultures', type: 'open', acceptedKeywords: ['powerful', 'dominat', 'replace', 'weaker', 'culture', 'impose'] },
        { prompt: 'How did European colonialism affect indigenous cultures?', answer: 'colonizers often suppressed local languages religions and traditions', type: 'open', acceptedKeywords: ['suppress', 'language', 'religion', 'tradition', 'destroy', 'ban', 'force'] },
        { prompt: 'What are boarding schools in the context of Native American history?', answer: 'schools that forced Native children to abandon their culture and adopt European ways', type: 'open', acceptedKeywords: ['forced', 'abandon', 'culture', 'European', 'Native', 'assimilat'] },
        { prompt: 'How can cultural imperialism happen today without colonization?', answer: 'through media economics and technology spreading dominant culture', type: 'open', acceptedKeywords: ['media', 'economic', 'technology', 'dominant', 'spread', 'soft power'] },
        { prompt: 'Why is cultural diversity valuable to humanity?', answer: 'diverse cultures provide different solutions ideas and perspectives', type: 'open', acceptedKeywords: ['different', 'solution', 'idea', 'perspective', 'valuable', 'rich', 'diverse'] },
        { prompt: 'What is the difference between cultural exchange and cultural imperialism?', answer: 'exchange is mutual and voluntary while imperialism is forced and one-sided', type: 'open', acceptedKeywords: ['mutual', 'voluntary', 'forced', 'one-sided', 'exchange', 'equal'] },
      ],
    },
    'human-rights-and-culture': {
      items: [
        { prompt: 'What is the Universal Declaration of Human Rights?', answer: 'a UN document stating the basic rights all people deserve', type: 'open', acceptedKeywords: ['UN', 'basic', 'rights', 'people', 'deserve', 'universal', 'declaration'] },
        { prompt: 'Can cultural practices conflict with human rights?', answer: 'yes some traditional practices may violate basic human rights', type: 'open', acceptedKeywords: ['yes', 'traditional', 'violate', 'basic', 'rights', 'conflict'] },
        { prompt: 'What is cultural relativism?', answer: 'the idea that a culture should be understood by its own standards', type: 'open', acceptedKeywords: ['own standards', 'understand', 'culture', 'judg', 'context', 'perspective'] },
        { prompt: 'How do you balance cultural respect with human rights?', answer: 'respect cultures while still protecting basic human dignity and rights', type: 'open', acceptedKeywords: ['respect', 'protect', 'dignity', 'rights', 'balance', 'both'] },
        { prompt: 'What is religious freedom?', answer: 'the right to practice any religion or none without persecution', type: 'open', acceptedKeywords: ['practice', 'religion', 'right', 'persecuti', 'any', 'free', 'none'] },
        { prompt: 'How can cultures evolve to better support human rights?', answer: 'through education dialogue and internal cultural reform', type: 'open', acceptedKeywords: ['education', 'dialogue', 'reform', 'change', 'evolve', 'progress'] },
      ],
    },
  },
  'grade-8': {
    'identity-intersectionality': {
      items: [
        { prompt: 'What is intersectionality?', answer: 'the way different aspects of identity like race gender and class overlap and interact', type: 'open', acceptedKeywords: ['different', 'identity', 'race', 'gender', 'class', 'overlap', 'interact'] },
        { prompt: 'How can a person\'s cultural identity be shaped by multiple factors?', answer: 'race ethnicity gender religion and socioeconomic status all contribute', type: 'open', acceptedKeywords: ['race', 'ethnicity', 'gender', 'religion', 'socioeconomic', 'multiple', 'factor'] },
        { prompt: 'What is assimilation?', answer: 'when a person or group adopts the dominant culture losing their original culture', type: 'open', acceptedKeywords: ['adopt', 'dominant', 'culture', 'lose', 'original', 'absorb'] },
        { prompt: 'What is multiculturalism?', answer: 'a society that values and maintains multiple cultural traditions', type: 'open', acceptedKeywords: ['value', 'multiple', 'cultural', 'tradition', 'maintain', 'diverse', 'coexist'] },
        { prompt: 'How does socioeconomic class interact with cultural identity?', answer: 'it can affect access to education cultural resources and opportunities', type: 'open', acceptedKeywords: ['education', 'resource', 'opportunity', 'access', 'affect', 'class'] },
        { prompt: 'Why is understanding intersectionality important?', answer: 'it helps us see how different forms of discrimination and privilege overlap', type: 'open', acceptedKeywords: ['discrimin', 'privilege', 'overlap', 'understand', 'different', 'complex'] },
      ],
    },
    'cultural-movements': {
      items: [
        { prompt: 'What was the Harlem Renaissance?', answer: 'a cultural movement in the 1920s celebrating African American art music and literature', type: 'open', acceptedKeywords: ['1920s', 'African American', 'art', 'music', 'literature', 'Harlem', 'cultural'] },
        { prompt: 'How did the Civil Rights Movement change American culture?', answer: 'it challenged segregation and discrimination promoting equality and inclusion', type: 'open', acceptedKeywords: ['segregation', 'discrimin', 'equality', 'inclusion', 'challenge', 'change'] },
        { prompt: 'What cultural impact did the Women\'s Rights Movement have?', answer: 'it changed expectations about gender roles in work education and society', type: 'open', acceptedKeywords: ['gender', 'role', 'work', 'education', 'society', 'equal', 'change'] },
        { prompt: 'How has hip hop culture influenced global culture?', answer: 'through music fashion language and social commentary worldwide', type: 'open', acceptedKeywords: ['music', 'fashion', 'language', 'social', 'worldwide', 'global', 'influence'] },
        { prompt: 'What is a counterculture movement?', answer: 'a cultural movement that opposes mainstream values and norms', type: 'open', acceptedKeywords: ['oppose', 'mainstream', 'value', 'norm', 'reject', 'alternative', 'challenge'] },
        { prompt: 'How do social media movements like #BlackLivesMatter reflect cultural change?', answer: 'they use technology to raise awareness and mobilize people around cultural issues', type: 'open', acceptedKeywords: ['technology', 'awareness', 'mobilize', 'cultural', 'change', 'raise', 'activist'] },
      ],
    },
    'cultural-analysis': {
      items: [
        { prompt: 'What tools do anthropologists use to study culture?', answer: 'fieldwork interviews observation and ethnography', type: 'open', acceptedKeywords: ['fieldwork', 'interview', 'observation', 'ethnograph', 'research', 'study'] },
        { prompt: 'What is an ethnography?', answer: 'a detailed written study of a specific culture based on immersive research', type: 'open', acceptedKeywords: ['detail', 'study', 'culture', 'research', 'written', 'immersive'] },
        { prompt: 'How can you analyze a cultural artifact?', answer: 'examine its materials purpose who made it when and what it reveals about the culture', type: 'open', acceptedKeywords: ['material', 'purpose', 'who', 'when', 'reveal', 'culture', 'context'] },
        { prompt: 'What is cultural bias in research?', answer: 'when a researcher\'s own cultural background affects their interpretation', type: 'open', acceptedKeywords: ['researcher', 'background', 'affect', 'interpret', 'bias', 'perspective'] },
        { prompt: 'Why is it important to study culture from multiple perspectives?', answer: 'to get a more complete and accurate understanding', type: 'open', acceptedKeywords: ['complete', 'accurate', 'understand', 'multiple', 'perspective', 'full'] },
        { prompt: 'How can cultural analysis help solve modern social problems?', answer: 'by understanding the cultural roots of issues and finding culturally appropriate solutions', type: 'open', acceptedKeywords: ['understand', 'root', 'cultural', 'solution', 'appropriate', 'issue'] },
      ],
    },
    'social-justice': {
      items: [
        { prompt: 'What is social justice?', answer: 'fair distribution of resources opportunities and privileges in society', type: 'open', acceptedKeywords: ['fair', 'distribut', 'resource', 'opportunit', 'privilege', 'society', 'equal'] },
        { prompt: 'How does cultural understanding relate to social justice?', answer: 'understanding cultures helps identify and address systemic inequalities', type: 'open', acceptedKeywords: ['understand', 'culture', 'systemic', 'inequalit', 'address', 'identify'] },
        { prompt: 'What is systemic racism?', answer: 'racism embedded in social institutions and systems rather than just individual behavior', type: 'open', acceptedKeywords: ['institution', 'system', 'embedded', 'structural', 'racism', 'not just individual'] },
        { prompt: 'How can education promote social justice?', answer: 'by teaching diverse perspectives critical thinking and empathy', type: 'open', acceptedKeywords: ['diverse', 'perspective', 'critical', 'thinking', 'empathy', 'teach', 'awareness'] },
        { prompt: 'What does it mean to be an ally?', answer: 'supporting and advocating for a group that faces discrimination', type: 'open', acceptedKeywords: ['support', 'advocat', 'discrimin', 'group', 'help', 'stand'] },
        { prompt: 'How can young people take action for social justice?', answer: 'by educating themselves speaking up volunteering and supporting inclusive policies', type: 'open', acceptedKeywords: ['educate', 'speak', 'volunteer', 'inclusive', 'action', 'advocate', 'voice'] },
      ],
    },
  },
};

const COMPARISONS = {
  'kindergarten': [
    { title: 'Families Around the World', description: 'Compare what families do at dinnertime in your home, in Japan (where many families eat together and say "itadakimasu"), and in Mexico (where dinner is often later in the evening with the whole extended family). What is the same? What is different?', discussion: 'All families eat together but the foods, times, and customs differ.' },
    { title: 'Celebrations of Light', description: 'Many cultures celebrate with light: Diwali (India), Hanukkah (Jewish), Christmas (Christian), and Lantern Festival (Chinese). Why do you think so many cultures use light in celebrations?', discussion: 'Light symbolizes hope, joy, and goodness in many cultures.' },
  ],
  'grade-1': [
    { title: 'Greetings Around the World', description: 'In the US, people often shake hands. In Japan, people bow. In France, people give cheek kisses. In India, people press palms together and say "Namaste." Why do you think different cultures greet each other differently?', discussion: 'All cultures have greetings but they express respect in different ways.' },
    { title: 'Schools Everywhere', description: 'Compare schools in the US (desks, buses), Japan (students clean the school), Kenya (some students walk miles), and Finland (lots of recess). What do all schools have in common?', discussion: 'All cultures educate children but in different ways.' },
  ],
  'grade-2': [
    { title: 'Food Stories', description: 'Compare the stories behind cultural foods: dumplings in China (shaped like gold nuggets for luck), cornbread in the American South (made from local corn), and injera in Ethiopia (a shared flatbread). How does food tell a culture\'s story?', discussion: 'Food reflects geography, history, and values.' },
    { title: 'Moving to a New Place', description: 'Compare the experiences of a child moving from Mexico, a child from Syria, and a child from China to the US. What would be similar? What would be different?', discussion: 'All immigrants face challenges but each story is unique.' },
  ],
  'grade-3': [
    { title: 'Homes Around the World', description: 'Compare an igloo (Arctic), a hogan (Navajo), a longhouse (Iroquois), and a yurt (Mongolia). How does each home fit its environment?', discussion: 'Cultural universals like shelter are shaped by geography and climate.' },
    { title: 'Stories That Teach', description: 'Compare Aesop\'s fables (Greece), Anansi stories (West Africa), Coyote tales (Native American), and Jataka tales (India). What lessons do they teach? How are they similar?', discussion: 'All cultures use stories to teach values.' },
  ],
  'grade-4': [
    { title: 'Cultural Regions of the US', description: 'Compare how geography shaped culture in New England (seafood, colonial history), the South (agriculture, diverse traditions), the Midwest (farming communities), and the West (frontier spirit, diversity). What makes each region unique?', discussion: 'Geography shapes culture within a single country.' },
  ],
  'grade-5': [
    { title: 'Perspective Shift', description: 'The same event can look different from different perspectives. Consider the arrival of Columbus from the perspective of European explorers AND the Taino people. How might each group describe the same event?', discussion: 'Understanding multiple perspectives builds empathy.' },
  ],
  'grade-6': [
    { title: 'Ancient Innovations', description: 'Compare writing systems: cuneiform (Mesopotamia), hieroglyphics (Egypt), oracle bones (China), and quipu (Inca). How did each culture solve the problem of recording information?', discussion: 'Cultural universals can have very different solutions.' },
  ],
  'grade-7': [
    { title: 'Globalization and Culture', description: 'Compare a teenager\'s daily life in Tokyo, Lagos, Mumbai, and New York. How has globalization made them more similar? What remains unique? Is this good or bad?', discussion: 'Globalization creates shared experiences but can threaten cultural uniqueness.' },
  ],
  'grade-8': [
    { title: 'Cultural Identity in a Global World', description: 'Interview someone from a different cultural background (or research a story). How do they maintain their cultural identity while also participating in the broader society? What challenges do they face?', discussion: 'Navigating multiple cultural identities is a modern reality.' },
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

class Culture {
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

  getComparison(grade) {
    const comps = COMPARISONS[grade];
    if (!comps) return { error: `No comparisons for ${grade}. Available: ${Object.keys(COMPARISONS).join(', ')}` };
    return pick(comps, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const comparison = COMPARISONS[grade] ? pick(COMPARISONS[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, comparison,
      lessonPlan: {
        review: 'Review previously learned cultural concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: comparison ? `Cultural comparison: "${comparison.title}"` : 'Connect to your own cultural experiences',
        reflect: 'What did you learn about another culture today?',
      },
    };
  }
}

module.exports = Culture;

// CLI: node culture.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new Culture();
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
      case 'comparison': { const [, g] = args; if (!g) throw new Error('Usage: comparison <grade>'); out(api.getComparison(g)); break; }
      default: out({ usage: 'node culture.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','comparison'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
