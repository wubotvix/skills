// eClaw Civics & Government Interactive Tutor (K-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'socialstudies-civics');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'rules-and-laws': ['classroom-rules', 'why-we-have-rules'],
    'community-helpers': ['helpers-who-serve', 'roles-in-community'],
    'being-a-citizen': ['fairness', 'taking-turns', 'responsibility'],
  },
  'grade-1': {
    'rules-and-laws': ['home-school-community-rules', 'consequences'],
    'symbols-and-traditions': ['us-flag', 'pledge-of-allegiance', 'national-holidays'],
    'community-roles': ['leaders-in-community', 'how-communities-work'],
  },
  'grade-2': {
    'government-services': ['what-government-does', 'local-services'],
    'local-government': ['mayor-and-council', 'community-decisions'],
    'rights-and-responsibilities': ['basic-rights', 'citizen-responsibilities'],
  },
  'grade-3': {
    'levels-of-government': ['local-state-national', 'government-roles'],
    'elections': ['voting-basics', 'why-elections-matter'],
    'community-participation': ['civic-action', 'volunteering'],
  },
  'grade-4': {
    'constitution-intro': ['what-is-the-constitution', 'preamble'],
    'three-branches': ['legislative', 'executive', 'judicial'],
    'state-government': ['governor', 'state-legislature', 'state-courts'],
  },
  'grade-5': {
    'bill-of-rights': ['first-amendment', 'key-amendments', 'why-rights-matter'],
    'checks-and-balances': ['how-branches-check', 'separation-of-powers'],
    'civic-action': ['petitions', 'community-organizing', 'informed-citizenship'],
  },
  'grade-6': {
    'democratic-principles': ['popular-sovereignty', 'rule-of-law', 'consent-of-governed'],
    'comparative-government': ['democracy-vs-authoritarian', 'republic-vs-direct-democracy'],
    'foundations': ['enlightenment-thinkers', 'ancient-greek-democracy', 'roman-republic'],
  },
  'grade-7': {
    'state-local-depth': ['federalism', 'state-constitutions', 'local-government-structures'],
    'political-process': ['political-parties', 'interest-groups', 'campaigns-and-elections'],
    'media-and-politics': ['media-role', 'informed-voting', 'civic-discourse'],
  },
  'grade-8': {
    'constitutional-law': ['amendment-process', 'judicial-review', 'due-process'],
    'landmark-cases': ['marbury-v-madison', 'brown-v-board', 'miranda-v-arizona'],
    'civil-rights': ['civil-rights-movement', 'equal-protection', 'ongoing-struggles'],
    'civic-engagement': ['advocacy', 'civic-responsibility', 'democratic-participation'],
  },
};

const CONTENT_BANKS = {
  'kindergarten': {
    'classroom-rules': {
      items: [
        { prompt: 'Why do we have rules in the classroom?', answer: 'to keep everyone safe and help us learn', type: 'open', acceptedKeywords: ['safe', 'learn', 'help', 'fair', 'order'] },
        { prompt: 'Which is a good classroom rule? A) Run in the hallways. B) Raise your hand to speak. C) Take other people\'s things.', answer: 'b', type: 'multiple-choice' },
        { prompt: 'What should you do if someone breaks a rule?', answer: 'tell a teacher', type: 'open', acceptedKeywords: ['tell', 'teacher', 'adult', 'help', 'talk'] },
        { prompt: 'True or false: Rules are the same everywhere.', answer: 'false', type: 'exact' },
        { prompt: 'Name one rule you follow at school.', answer: 'raise hand or walk in halls or be kind', type: 'open', acceptedKeywords: ['hand', 'walk', 'kind', 'listen', 'share', 'quiet', 'respect'] },
      ],
    },
    'why-we-have-rules': {
      items: [
        { prompt: 'What would happen if there were no rules on the playground?', answer: 'people might get hurt or it would be unfair', type: 'open', acceptedKeywords: ['hurt', 'unfair', 'fight', 'chaos', 'mess', 'danger'] },
        { prompt: 'Rules help us be: A) Mean B) Safe C) Bored', answer: 'b', type: 'multiple-choice' },
        { prompt: 'Who makes the rules in your classroom?', answer: 'the teacher and sometimes students together', type: 'open', acceptedKeywords: ['teacher', 'class', 'together', 'we', 'student'] },
        { prompt: 'Is "Be kind to others" a good rule? Why?', answer: 'yes because it helps everyone feel happy and included', type: 'open', acceptedKeywords: ['yes', 'happy', 'safe', 'feel', 'good', 'includ', 'respect'] },
        { prompt: 'Can rules change? Why might they need to?', answer: 'yes rules can change if they are not working well', type: 'open', acceptedKeywords: ['yes', 'change', 'better', 'not working', 'new', 'improve'] },
      ],
    },
    'helpers-who-serve': {
      items: [
        { prompt: 'Who helps put out fires in the community?', answer: 'firefighters', type: 'open', acceptedKeywords: ['firefight', 'fire'] },
        { prompt: 'Who helps if you are sick?', answer: 'doctors and nurses', type: 'open', acceptedKeywords: ['doctor', 'nurse', 'hospital'] },
        { prompt: 'Who helps keep us safe on the roads?', answer: 'police officers', type: 'open', acceptedKeywords: ['police', 'officer', 'patrol'] },
        { prompt: 'Who delivers letters and packages?', answer: 'mail carriers', type: 'open', acceptedKeywords: ['mail', 'postal', 'carrier', 'deliver'] },
        { prompt: 'Who teaches you new things at school?', answer: 'teachers', type: 'open', acceptedKeywords: ['teacher'] },
      ],
    },
    'roles-in-community': {
      items: [
        { prompt: 'What is a community?', answer: 'a group of people who live and work together in the same area', type: 'open', acceptedKeywords: ['people', 'together', 'live', 'place', 'area', 'group', 'work'] },
        { prompt: 'Name someone who helps in your community besides police and firefighters.', answer: 'librarian teacher sanitation worker or crossing guard', type: 'open', acceptedKeywords: ['librarian', 'teacher', 'trash', 'cross', 'bus', 'cook', 'janitor', 'volunteer'] },
        { prompt: 'How can YOU be a community helper?', answer: 'by being kind picking up trash or helping others', type: 'open', acceptedKeywords: ['kind', 'help', 'trash', 'clean', 'share', 'volunteer'] },
        { prompt: 'True or false: Only adults can be community helpers.', answer: 'false', type: 'exact' },
        { prompt: 'Why is every job in a community important?', answer: 'because everyone has a role that helps the community work', type: 'open', acceptedKeywords: ['every', 'help', 'need', 'role', 'work', 'important', 'together'] },
      ],
    },
    'fairness': {
      items: [
        { prompt: 'What does fairness mean?', answer: 'treating everyone equally and following the same rules', type: 'open', acceptedKeywords: ['equal', 'same', 'rule', 'share', 'treat', 'everyone'] },
        { prompt: 'Is it fair if one person gets all the crayons and no one else gets any?', answer: 'no', type: 'exact' },
        { prompt: 'What is a fair way to decide who goes first?', answer: 'take turns or pick a number', type: 'open', acceptedKeywords: ['turn', 'pick', 'number', 'vote', 'flip', 'random', 'draw'] },
        { prompt: 'If someone is being unfair, what should you do?', answer: 'talk to them nicely or tell an adult', type: 'open', acceptedKeywords: ['talk', 'tell', 'adult', 'teacher', 'words', 'explain', 'help'] },
        { prompt: 'True or false: Being fair means everyone gets exactly the same thing.', answer: 'false', type: 'exact' },
      ],
    },
    'taking-turns': {
      items: [
        { prompt: 'Why is taking turns important?', answer: 'so everyone gets a chance and it is fair', type: 'open', acceptedKeywords: ['fair', 'chance', 'everyone', 'share', 'equal'] },
        { prompt: 'What should you do while waiting for your turn?', answer: 'be patient and listen', type: 'open', acceptedKeywords: ['patient', 'wait', 'listen', 'quiet', 'calm'] },
        { prompt: 'Is taking turns only important in games?', answer: 'no it is important in many situations', type: 'open', acceptedKeywords: ['no', 'talk', 'line', 'everywhere', 'many', 'speak', 'class'] },
        { prompt: 'How is taking turns like voting?', answer: 'everyone gets their chance to participate', type: 'open', acceptedKeywords: ['everyone', 'chance', 'participat', 'voice', 'fair', 'turn'] },
        { prompt: 'What happens when people do not take turns?', answer: 'it gets messy and unfair and people get upset', type: 'open', acceptedKeywords: ['unfair', 'upset', 'fight', 'mess', 'chaos', 'angry', 'problem'] },
      ],
    },
    'responsibility': {
      items: [
        { prompt: 'What does responsibility mean?', answer: 'doing what you are supposed to do', type: 'open', acceptedKeywords: ['do', 'supposed', 'job', 'care', 'duty', 'right thing'] },
        { prompt: 'What is one responsibility you have at home?', answer: 'clean room or feed pet or do chores', type: 'open', acceptedKeywords: ['clean', 'feed', 'chore', 'help', 'bed', 'dish', 'homework'] },
        { prompt: 'What is one responsibility you have at school?', answer: 'do homework or be respectful or follow rules', type: 'open', acceptedKeywords: ['homework', 'respect', 'rule', 'listen', 'kind', 'learn', 'try'] },
        { prompt: 'Are you responsible for how you treat others?', answer: 'yes', type: 'exact' },
        { prompt: 'Why is being responsible important for a community?', answer: 'when everyone does their part the community works better', type: 'open', acceptedKeywords: ['everyone', 'part', 'work', 'better', 'together', 'help', 'community'] },
      ],
    },
  },
  'grade-1': {
    'home-school-community-rules': {
      items: [
        { prompt: 'Give an example of a rule at home.', answer: 'bedtime or no running inside', type: 'open', acceptedKeywords: ['bed', 'clean', 'run', 'eat', 'screen', 'chore', 'homework'] },
        { prompt: 'Give an example of a rule at school.', answer: 'raise hand or walk in halls', type: 'open', acceptedKeywords: ['hand', 'walk', 'quiet', 'listen', 'kind', 'respect'] },
        { prompt: 'Give an example of a community rule.', answer: 'stop at red lights or no littering', type: 'open', acceptedKeywords: ['stop', 'light', 'litter', 'speed', 'cross', 'law'] },
        { prompt: 'Are rules the same everywhere? A) Yes B) No', answer: 'b', type: 'multiple-choice' },
        { prompt: 'What is the same about all rules?', answer: 'they help keep people safe and things fair', type: 'open', acceptedKeywords: ['safe', 'fair', 'help', 'order', 'protect'] },
      ],
    },
    'consequences': {
      items: [
        { prompt: 'What is a consequence?', answer: 'what happens as a result of your actions', type: 'open', acceptedKeywords: ['happen', 'result', 'action', 'after', 'because'] },
        { prompt: 'If you follow the rules, what kind of consequence do you get?', answer: 'a positive or good consequence', type: 'open', acceptedKeywords: ['good', 'positive', 'reward', 'nice', 'happy'] },
        { prompt: 'If you break a rule, what might happen?', answer: 'you might get in trouble or face a negative consequence', type: 'open', acceptedKeywords: ['trouble', 'punish', 'consequence', 'negative', 'time out', 'lose'] },
        { prompt: 'Is it fair that rules have consequences?', answer: 'yes because consequences help people follow rules', type: 'open', acceptedKeywords: ['yes', 'fair', 'help', 'learn', 'follow', 'important'] },
        { prompt: 'What happens if there are no consequences for breaking rules?', answer: 'people would not follow the rules', type: 'open', acceptedKeywords: ['not follow', 'break', 'chaos', 'unfair', 'no reason', 'ignore'] },
      ],
    },
    'us-flag': {
      items: [
        { prompt: 'How many stars are on the US flag?', answer: '50', type: 'exact' },
        { prompt: 'What do the stars on the flag represent?', answer: 'the 50 states', type: 'open', acceptedKeywords: ['state', '50', 'fifty'] },
        { prompt: 'How many stripes are on the flag?', answer: '13', type: 'exact' },
        { prompt: 'What do the stripes represent?', answer: 'the 13 original colonies', type: 'open', acceptedKeywords: ['13', 'thirteen', 'original', 'colon', 'first'] },
        { prompt: 'What colors are on the US flag?', answer: 'red white and blue', type: 'open', acceptedKeywords: ['red', 'white', 'blue'] },
      ],
    },
    'pledge-of-allegiance': {
      items: [
        { prompt: 'What does "allegiance" mean?', answer: 'loyalty or faithfulness', type: 'open', acceptedKeywords: ['loyal', 'faithful', 'dedicate', 'promise', 'commit'] },
        { prompt: 'What do you face when saying the Pledge of Allegiance?', answer: 'the flag', type: 'open', acceptedKeywords: ['flag'] },
        { prompt: 'Where do you put your hand during the pledge?', answer: 'over your heart', type: 'open', acceptedKeywords: ['heart', 'chest'] },
        { prompt: 'What does "liberty and justice for all" mean?', answer: 'freedom and fairness for everyone', type: 'open', acceptedKeywords: ['freedom', 'fair', 'everyone', 'all', 'equal', 'right'] },
        { prompt: 'True or false: You must say the pledge.', answer: 'false', type: 'exact' },
      ],
    },
    'national-holidays': {
      items: [
        { prompt: 'What holiday celebrates America\'s birthday?', answer: 'fourth of july or independence day', type: 'open', acceptedKeywords: ['fourth', 'july', 'independence', '4th'] },
        { prompt: 'What holiday honors people who served in the military?', answer: 'veterans day', type: 'open', acceptedKeywords: ['veteran'] },
        { prompt: 'What holiday celebrates the birthday of Martin Luther King Jr.?', answer: 'martin luther king jr day', type: 'open', acceptedKeywords: ['martin', 'luther', 'king', 'mlk'] },
        { prompt: 'What do we celebrate on Thanksgiving?', answer: 'being thankful and the harvest', type: 'open', acceptedKeywords: ['thankful', 'harvest', 'grateful', 'food', 'family', 'together', 'pilgrim'] },
        { prompt: 'What holiday honors presidents?', answer: 'presidents day', type: 'open', acceptedKeywords: ['president'] },
      ],
    },
    'leaders-in-community': {
      items: [
        { prompt: 'Who is the leader of a city or town?', answer: 'the mayor', type: 'open', acceptedKeywords: ['mayor'] },
        { prompt: 'Who is the leader of the United States?', answer: 'the president', type: 'open', acceptedKeywords: ['president'] },
        { prompt: 'Who is the leader of a school?', answer: 'the principal', type: 'open', acceptedKeywords: ['principal'] },
        { prompt: 'What makes a good leader?', answer: 'being fair listening and helping others', type: 'open', acceptedKeywords: ['fair', 'listen', 'help', 'honest', 'kind', 'respect'] },
        { prompt: 'Can kids be leaders?', answer: 'yes', type: 'open', acceptedKeywords: ['yes'] },
      ],
    },
    'how-communities-work': {
      items: [
        { prompt: 'What are some things a community needs to work well?', answer: 'rules laws services and people working together', type: 'open', acceptedKeywords: ['rule', 'law', 'service', 'together', 'people', 'help', 'cooperat'] },
        { prompt: 'How are decisions made in a community?', answer: 'by voting or through elected leaders', type: 'open', acceptedKeywords: ['vote', 'elect', 'leader', 'decide', 'meeting', 'together'] },
        { prompt: 'What is a law?', answer: 'a rule that everyone in a community must follow', type: 'open', acceptedKeywords: ['rule', 'follow', 'everyone', 'must', 'community'] },
        { prompt: 'Why do communities need leaders?', answer: 'to make decisions and solve problems', type: 'open', acceptedKeywords: ['decision', 'problem', 'organiz', 'help', 'lead', 'solv'] },
        { prompt: 'How can you help your community?', answer: 'by following rules being kind and volunteering', type: 'open', acceptedKeywords: ['rule', 'kind', 'volunteer', 'help', 'clean', 'share'] },
      ],
    },
  },
  'grade-2': {
    'what-government-does': {
      items: [
        { prompt: 'What is government?', answer: 'the group of people who make and enforce rules and laws for a community', type: 'open', acceptedKeywords: ['people', 'rules', 'laws', 'make', 'enforce', 'community', 'run'] },
        { prompt: 'Name one thing the government provides.', answer: 'schools roads or public safety', type: 'open', acceptedKeywords: ['school', 'road', 'safe', 'police', 'fire', 'park', 'library', 'mail'] },
        { prompt: 'How does the government get money to pay for services?', answer: 'through taxes', type: 'open', acceptedKeywords: ['tax'] },
        { prompt: 'True or false: The government makes all the rules for everything.', answer: 'false', type: 'exact' },
        { prompt: 'Why do we need government?', answer: 'to keep order provide services and protect people', type: 'open', acceptedKeywords: ['order', 'service', 'protect', 'safe', 'help', 'fair', 'law'] },
      ],
    },
    'local-services': {
      items: [
        { prompt: 'Name a service your local government provides.', answer: 'fire department police library parks or schools', type: 'open', acceptedKeywords: ['fire', 'police', 'library', 'park', 'school', 'trash', 'road', 'water'] },
        { prompt: 'Who pays for local services like parks and libraries?', answer: 'taxpayers', type: 'open', acceptedKeywords: ['tax', 'people', 'citizen', 'community', 'pay'] },
        { prompt: 'What would happen without fire departments?', answer: 'fires would not be controlled and people could get hurt', type: 'open', acceptedKeywords: ['fire', 'hurt', 'burn', 'danger', 'no help', 'damage'] },
        { prompt: 'What is a public service? A) A store B) Something the government provides for everyone C) A private business', answer: 'b', type: 'multiple-choice' },
        { prompt: 'How can you help take care of public services like parks?', answer: 'by not littering and following the rules', type: 'open', acceptedKeywords: ['litter', 'rule', 'clean', 'care', 'respect', 'pick up'] },
      ],
    },
    'mayor-and-council': {
      items: [
        { prompt: 'What does a mayor do?', answer: 'leads the city government and makes decisions for the community', type: 'open', acceptedKeywords: ['lead', 'city', 'decision', 'govern', 'run', 'community'] },
        { prompt: 'What does a city council do?', answer: 'makes laws and decisions for the city', type: 'open', acceptedKeywords: ['law', 'decision', 'city', 'vote', 'rule', 'make'] },
        { prompt: 'How does someone become mayor?', answer: 'by being elected or voted for by the people', type: 'open', acceptedKeywords: ['elect', 'vote', 'people', 'choose', 'win'] },
        { prompt: 'Can you go to a city council meeting?', answer: 'yes they are open to the public', type: 'open', acceptedKeywords: ['yes', 'public', 'open', 'attend'] },
        { prompt: 'True or false: The mayor can do whatever they want.', answer: 'false', type: 'exact' },
      ],
    },
    'community-decisions': {
      items: [
        { prompt: 'How do communities make decisions?', answer: 'by voting and through elected leaders', type: 'open', acceptedKeywords: ['vote', 'elect', 'leader', 'meeting', 'decide', 'together'] },
        { prompt: 'What is voting?', answer: 'choosing something by letting everyone have a say', type: 'open', acceptedKeywords: ['choose', 'say', 'pick', 'voice', 'decide', 'everyone'] },
        { prompt: 'Why should people participate in community decisions?', answer: 'because decisions affect everyone', type: 'open', acceptedKeywords: ['affect', 'everyone', 'voice', 'matter', 'important', 'say'] },
        { prompt: 'Your class votes on a field trip. 15 vote for the zoo and 10 vote for the museum. Where do you go?', answer: 'the zoo because more people voted for it', type: 'open', acceptedKeywords: ['zoo', 'more', 'majority', 'most'] },
        { prompt: 'Is it okay if your choice does not win the vote?', answer: 'yes because the majority decides and that is fair', type: 'open', acceptedKeywords: ['yes', 'fair', 'majority', 'accept', 'okay', 'try again'] },
      ],
    },
    'basic-rights': {
      items: [
        { prompt: 'What is a right?', answer: 'something you are allowed to do or have', type: 'open', acceptedKeywords: ['allow', 'have', 'free', 'do', 'entitle', 'freedom'] },
        { prompt: 'Name one right that children have.', answer: 'right to go to school or right to be safe', type: 'open', acceptedKeywords: ['school', 'safe', 'speak', 'learn', 'educate', 'play', 'food'] },
        { prompt: 'Can someone take away your right to speak freely?', answer: 'no freedom of speech is protected', type: 'open', acceptedKeywords: ['no', 'protect', 'free', 'speech', 'constitut', 'right'] },
        { prompt: 'True or false: Rights come with responsibilities.', answer: 'true', type: 'exact' },
        { prompt: 'What is the difference between a right and a privilege?', answer: 'a right belongs to everyone and a privilege can be earned or taken away', type: 'open', acceptedKeywords: ['everyone', 'earn', 'taken away', 'belong', 'all', 'different'] },
      ],
    },
    'citizen-responsibilities': {
      items: [
        { prompt: 'Name one responsibility of a citizen.', answer: 'follow laws vote or pay taxes', type: 'open', acceptedKeywords: ['law', 'vote', 'tax', 'jury', 'help', 'respect', 'follow'] },
        { prompt: 'Why is following laws a responsibility?', answer: 'to keep everyone safe and maintain order', type: 'open', acceptedKeywords: ['safe', 'order', 'fair', 'everyone', 'protect', 'community'] },
        { prompt: 'Is voting a right or a responsibility?', answer: 'both', type: 'open', acceptedKeywords: ['both'] },
        { prompt: 'How can you be a responsible citizen even as a kid?', answer: 'follow rules be kind and help your community', type: 'open', acceptedKeywords: ['rule', 'kind', 'help', 'community', 'respect', 'volunteer', 'recycle'] },
        { prompt: 'What happens when citizens do not take responsibility?', answer: 'the community suffers and things become unfair', type: 'open', acceptedKeywords: ['suffer', 'unfair', 'problem', 'break', 'worse', 'not work'] },
      ],
    },
  },
  'grade-3': {
    'local-state-national': {
      items: [
        { prompt: 'Name the three levels of government.', answer: 'local state and national or federal', type: 'open', acceptedKeywords: ['local', 'state', 'national', 'federal'] },
        { prompt: 'Which level of government runs your city?', answer: 'local', type: 'exact' },
        { prompt: 'Which level of government runs the whole country?', answer: 'national or federal', type: 'open', acceptedKeywords: ['national', 'federal'] },
        { prompt: 'Who leads the state government?', answer: 'the governor', type: 'open', acceptedKeywords: ['governor'] },
        { prompt: 'Why do we need different levels of government?', answer: 'because different issues are handled at different levels', type: 'open', acceptedKeywords: ['different', 'level', 'local', 'big', 'small', 'issue', 'handle'] },
      ],
    },
    'government-roles': {
      items: [
        { prompt: 'What does the president do?', answer: 'leads the country and enforces laws', type: 'open', acceptedKeywords: ['lead', 'country', 'law', 'enforce', 'command', 'nation'] },
        { prompt: 'What does Congress do?', answer: 'makes laws for the country', type: 'open', acceptedKeywords: ['law', 'make', 'write', 'pass', 'vote'] },
        { prompt: 'What do judges do?', answer: 'interpret laws and decide if they are fair', type: 'open', acceptedKeywords: ['interpret', 'decid', 'fair', 'law', 'court', 'case', 'rule'] },
        { prompt: 'Who makes the laws in your state?', answer: 'the state legislature', type: 'open', acceptedKeywords: ['legislat', 'state', 'lawmakers', 'representatives', 'senators'] },
        { prompt: 'True or false: One person makes all the decisions in the US government.', answer: 'false', type: 'exact' },
      ],
    },
    'voting-basics': {
      items: [
        { prompt: 'How old must you be to vote in the United States?', answer: '18', type: 'exact' },
        { prompt: 'What is an election?', answer: 'when people vote to choose leaders', type: 'open', acceptedKeywords: ['vote', 'choose', 'leader', 'pick', 'decide'] },
        { prompt: 'Why is it important to vote?', answer: 'so your voice is heard in choosing leaders and decisions', type: 'open', acceptedKeywords: ['voice', 'choose', 'leader', 'matter', 'say', 'decision', 'important'] },
        { prompt: 'What is a ballot?', answer: 'the paper or form you use to vote', type: 'open', acceptedKeywords: ['paper', 'form', 'vote', 'mark', 'choose'] },
        { prompt: 'True or false: Every vote counts.', answer: 'true', type: 'exact' },
      ],
    },
    'why-elections-matter': {
      items: [
        { prompt: 'What would happen if we did not have elections?', answer: 'people would not get to choose their leaders', type: 'open', acceptedKeywords: ['not choose', 'no say', 'leader', 'dictator', 'unfair', 'no voice'] },
        { prompt: 'How do elections make government fair?', answer: 'everyone gets a say in who leads them', type: 'open', acceptedKeywords: ['everyone', 'say', 'choose', 'fair', 'equal', 'voice', 'represent'] },
        { prompt: 'What should you do before voting?', answer: 'learn about the candidates and issues', type: 'open', acceptedKeywords: ['learn', 'research', 'candidate', 'issue', 'inform', 'read', 'know'] },
        { prompt: 'Can elections change things?', answer: 'yes new leaders can change laws and policies', type: 'open', acceptedKeywords: ['yes', 'change', 'law', 'polic', 'new', 'different', 'leader'] },
        { prompt: 'Is it fair if only some people are allowed to vote?', answer: 'no everyone should have the right to vote', type: 'open', acceptedKeywords: ['no', 'unfair', 'everyone', 'right', 'equal', 'all'] },
      ],
    },
    'civic-action': {
      items: [
        { prompt: 'What is civic action?', answer: 'doing things to help your community and government', type: 'open', acceptedKeywords: ['help', 'community', 'action', 'govern', 'participat', 'improv'] },
        { prompt: 'Name one way a kid can take civic action.', answer: 'organize a cleanup write a letter or start a petition', type: 'open', acceptedKeywords: ['clean', 'letter', 'petition', 'volunteer', 'help', 'speak', 'organiz'] },
        { prompt: 'Why should people take civic action?', answer: 'to make their community better', type: 'open', acceptedKeywords: ['better', 'community', 'improv', 'change', 'help', 'difference'] },
        { prompt: 'What is a petition?', answer: 'a written request signed by many people', type: 'open', acceptedKeywords: ['request', 'sign', 'people', 'ask', 'written', 'many'] },
        { prompt: 'True or false: You have to be an adult to make a difference.', answer: 'false', type: 'exact' },
      ],
    },
    'volunteering': {
      items: [
        { prompt: 'What is volunteering?', answer: 'helping others without getting paid', type: 'open', acceptedKeywords: ['help', 'free', 'not paid', 'without pay', 'give time'] },
        { prompt: 'Name one place you could volunteer.', answer: 'food bank animal shelter library or park', type: 'open', acceptedKeywords: ['food', 'shelter', 'library', 'park', 'hospital', 'school', 'church'] },
        { prompt: 'How does volunteering help the community?', answer: 'it fills needs that people cannot pay for', type: 'open', acceptedKeywords: ['help', 'need', 'better', 'community', 'support', 'fill', 'free'] },
        { prompt: 'Can volunteering be fun?', answer: 'yes you can learn new things and meet people', type: 'open', acceptedKeywords: ['yes', 'fun', 'learn', 'meet', 'friends', 'enjoy', 'good'] },
        { prompt: 'Why do people volunteer?', answer: 'because they want to help others and make a difference', type: 'open', acceptedKeywords: ['help', 'difference', 'care', 'want', 'give', 'good'] },
      ],
    },
  },
  'grade-4': {
    'what-is-the-constitution': {
      items: [
        { prompt: 'What is the Constitution?', answer: 'the supreme law of the United States that sets up the government', type: 'open', acceptedKeywords: ['law', 'supreme', 'govern', 'rule', 'united states', 'found', 'country'] },
        { prompt: 'When was the Constitution written?', answer: '1787', type: 'exact' },
        { prompt: 'Where was the Constitution written?', answer: 'philadelphia', type: 'open', acceptedKeywords: ['philadelphia', 'philly'] },
        { prompt: 'Why do we need a Constitution?', answer: 'to set up the government and protect peoples rights', type: 'open', acceptedKeywords: ['government', 'right', 'protect', 'rule', 'set up', 'organiz', 'limit'] },
        { prompt: 'Can the Constitution be changed?', answer: 'yes through amendments', type: 'open', acceptedKeywords: ['yes', 'amendment', 'change', 'add'] },
      ],
    },
    'preamble': {
      items: [
        { prompt: 'What are the first three words of the Constitution?', answer: 'we the people', type: 'open', acceptedKeywords: ['we the people'] },
        { prompt: 'What does "We the People" mean?', answer: 'the government gets its power from the people', type: 'open', acceptedKeywords: ['people', 'power', 'citizen', 'us', 'govern', 'consent'] },
        { prompt: 'The Preamble says to "form a more perfect Union." What does that mean?', answer: 'to make the country work better together', type: 'open', acceptedKeywords: ['better', 'together', 'country', 'improv', 'unite', 'strong'] },
        { prompt: 'Name one goal listed in the Preamble.', answer: 'establish justice ensure domestic tranquility provide for common defense', type: 'open', acceptedKeywords: ['justice', 'tranquil', 'defense', 'welfare', 'liberty', 'peace'] },
        { prompt: 'What is the Preamble?', answer: 'the introduction to the Constitution that explains its purpose', type: 'open', acceptedKeywords: ['introduction', 'purpose', 'beginning', 'explains', 'why', 'start'] },
      ],
    },
    'legislative': {
      items: [
        { prompt: 'What is the legislative branch?', answer: 'congress which makes the laws', type: 'open', acceptedKeywords: ['congress', 'law', 'make', 'senate', 'house'] },
        { prompt: 'What are the two parts of Congress?', answer: 'the senate and the house of representatives', type: 'open', acceptedKeywords: ['senate', 'house', 'representative'] },
        { prompt: 'How many senators does each state have?', answer: '2', type: 'exact' },
        { prompt: 'What does Congress do?', answer: 'makes laws and controls the budget', type: 'open', acceptedKeywords: ['law', 'make', 'budget', 'tax', 'spend', 'pass', 'vote'] },
        { prompt: 'How do members of Congress get their jobs?', answer: 'they are elected by the people', type: 'open', acceptedKeywords: ['elect', 'vote', 'people', 'choose'] },
      ],
    },
    'executive': {
      items: [
        { prompt: 'What is the executive branch?', answer: 'the branch led by the president that enforces laws', type: 'open', acceptedKeywords: ['president', 'enforce', 'law', 'carry out', 'execute'] },
        { prompt: 'Who is the head of the executive branch?', answer: 'the president', type: 'open', acceptedKeywords: ['president'] },
        { prompt: 'Name one thing the president does.', answer: 'signs laws commands the military or represents the country', type: 'open', acceptedKeywords: ['sign', 'law', 'military', 'commander', 'represent', 'veto', 'enforce'] },
        { prompt: 'How long is one presidential term?', answer: '4 years', type: 'open', acceptedKeywords: ['4', 'four'] },
        { prompt: 'If the president cannot serve, who takes over?', answer: 'the vice president', type: 'open', acceptedKeywords: ['vice president'] },
      ],
    },
    'judicial': {
      items: [
        { prompt: 'What is the judicial branch?', answer: 'the courts that interpret the laws', type: 'open', acceptedKeywords: ['court', 'interpret', 'law', 'judge'] },
        { prompt: 'What is the highest court in the United States?', answer: 'the supreme court', type: 'open', acceptedKeywords: ['supreme court'] },
        { prompt: 'How many justices are on the Supreme Court?', answer: '9', type: 'exact' },
        { prompt: 'What does the Supreme Court do?', answer: 'decides if laws follow the Constitution', type: 'open', acceptedKeywords: ['decid', 'law', 'constitut', 'interpret', 'case', 'fair', 'legal'] },
        { prompt: 'How long do Supreme Court justices serve?', answer: 'for life', type: 'open', acceptedKeywords: ['life', 'forever', 'until retire', 'lifetime'] },
      ],
    },
    'governor': {
      items: [
        { prompt: 'What does a governor do?', answer: 'leads the state government and enforces state laws', type: 'open', acceptedKeywords: ['lead', 'state', 'law', 'enforce', 'govern'] },
        { prompt: 'How is a governor chosen?', answer: 'by election', type: 'open', acceptedKeywords: ['elect', 'vote', 'people', 'choose'] },
        { prompt: 'Is the governor the same as the president?', answer: 'no the governor leads a state not the whole country', type: 'open', acceptedKeywords: ['no', 'state', 'not country', 'different', 'level'] },
        { prompt: 'Name one power a governor has.', answer: 'signing state laws or leading the state national guard', type: 'open', acceptedKeywords: ['sign', 'law', 'veto', 'guard', 'budget', 'emergency'] },
        { prompt: 'Does every state have a governor?', answer: 'yes', type: 'exact' },
      ],
    },
    'state-legislature': {
      items: [
        { prompt: 'What does the state legislature do?', answer: 'makes laws for the state', type: 'open', acceptedKeywords: ['law', 'make', 'state', 'pass', 'vote'] },
        { prompt: 'Is the state legislature the same as Congress?', answer: 'no Congress makes national laws and state legislatures make state laws', type: 'open', acceptedKeywords: ['no', 'state', 'national', 'different', 'level'] },
        { prompt: 'How do state legislators get their jobs?', answer: 'they are elected by the people of the state', type: 'open', acceptedKeywords: ['elect', 'vote', 'people'] },
        { prompt: 'Can state laws be different from state to state?', answer: 'yes', type: 'exact' },
        { prompt: 'Give an example of something a state legislature might make a law about.', answer: 'speed limits education or taxes', type: 'open', acceptedKeywords: ['speed', 'school', 'tax', 'educat', 'driv', 'environment', 'health'] },
      ],
    },
    'state-courts': {
      items: [
        { prompt: 'What do state courts do?', answer: 'hear cases about state laws', type: 'open', acceptedKeywords: ['case', 'state', 'law', 'hear', 'decid', 'trial'] },
        { prompt: 'Are state courts the same as the Supreme Court?', answer: 'no the Supreme Court is a federal court', type: 'open', acceptedKeywords: ['no', 'federal', 'different', 'supreme', 'higher'] },
        { prompt: 'What is a judge?', answer: 'a person who makes decisions in court cases', type: 'open', acceptedKeywords: ['person', 'decision', 'court', 'case', 'law'] },
        { prompt: 'What is a jury?', answer: 'a group of citizens who help decide court cases', type: 'open', acceptedKeywords: ['citizen', 'group', 'decide', 'court', 'case', 'people'] },
        { prompt: 'Can a case go from state court to the Supreme Court?', answer: 'yes if it involves a constitutional question', type: 'open', acceptedKeywords: ['yes', 'constitut', 'appeal', 'higher'] },
      ],
    },
  },
  'grade-5': {
    'first-amendment': {
      items: [
        { prompt: 'What does the First Amendment protect?', answer: 'freedom of speech religion press assembly and petition', type: 'open', acceptedKeywords: ['speech', 'religion', 'press', 'assembl', 'petition'] },
        { prompt: 'Can you say anything you want because of free speech?', answer: 'no there are limits like you cannot yell fire in a crowded theater', type: 'open', acceptedKeywords: ['no', 'limit', 'danger', 'harm', 'not everything', 'fire'] },
        { prompt: 'What is freedom of the press?', answer: 'the right of newspapers and media to report freely', type: 'open', acceptedKeywords: ['newspaper', 'media', 'report', 'write', 'publish', 'free'] },
        { prompt: 'What is the right to petition?', answer: 'the right to ask the government to change something', type: 'open', acceptedKeywords: ['ask', 'government', 'change', 'request', 'sign'] },
        { prompt: 'Why is freedom of religion important?', answer: 'so people can believe and worship however they choose', type: 'open', acceptedKeywords: ['believe', 'worship', 'choose', 'free', 'practice', 'any', 'no'] },
      ],
    },
    'key-amendments': {
      items: [
        { prompt: 'Which amendment ended slavery?', answer: '13th', type: 'open', acceptedKeywords: ['13', 'thirteenth'] },
        { prompt: 'Which amendment gave women the right to vote?', answer: '19th', type: 'open', acceptedKeywords: ['19', 'nineteenth'] },
        { prompt: 'What does the Second Amendment protect?', answer: 'the right to bear arms', type: 'open', acceptedKeywords: ['arms', 'weapon', 'gun', 'bear'] },
        { prompt: 'What does the Fourth Amendment protect?', answer: 'against unreasonable searches and seizures', type: 'open', acceptedKeywords: ['search', 'seizure', 'unreasonable', 'privacy', 'warrant'] },
        { prompt: 'How many amendments are in the Bill of Rights?', answer: '10', type: 'exact' },
      ],
    },
    'why-rights-matter': {
      items: [
        { prompt: 'Why are rights important in a democracy?', answer: 'they protect individuals from government overreach', type: 'open', acceptedKeywords: ['protect', 'individual', 'government', 'free', 'limit', 'power', 'overreach'] },
        { prompt: 'What would happen without the right to free speech?', answer: 'people could not express their opinions or criticize the government', type: 'open', acceptedKeywords: ['express', 'opinion', 'criticiz', 'speak', 'punish', 'silence'] },
        { prompt: 'Can rights ever be limited?', answer: 'yes when they endanger others or conflict with other rights', type: 'open', acceptedKeywords: ['yes', 'danger', 'limit', 'conflict', 'harm', 'safety', 'others'] },
        { prompt: 'Do rights come with responsibilities?', answer: 'yes you must respect the rights of others', type: 'open', acceptedKeywords: ['yes', 'respect', 'others', 'responsib'] },
        { prompt: 'Why did the Founders include the Bill of Rights?', answer: 'to make sure the government could not take away peoples basic freedoms', type: 'open', acceptedKeywords: ['protect', 'freedom', 'government', 'limit', 'power', 'basic', 'rights'] },
      ],
    },
    'how-branches-check': {
      items: [
        { prompt: 'How can the president check Congress?', answer: 'by vetoing a law', type: 'open', acceptedKeywords: ['veto', 'reject', 'refuse'] },
        { prompt: 'How can Congress check the president?', answer: 'by overriding a veto or impeaching the president', type: 'open', acceptedKeywords: ['override', 'impeach', 'veto', 'approve', 'budget'] },
        { prompt: 'How can the Supreme Court check both branches?', answer: 'by declaring laws or actions unconstitutional', type: 'open', acceptedKeywords: ['unconstitut', 'declar', 'strike', 'invalid', 'review'] },
        { prompt: 'Why do we need checks and balances?', answer: 'so no one branch becomes too powerful', type: 'open', acceptedKeywords: ['powerful', 'no one', 'too much', 'balance', 'limit', 'prevent'] },
        { prompt: 'What happens if the president vetoes a bill?', answer: 'congress can override the veto with a two thirds vote', type: 'open', acceptedKeywords: ['override', 'two third', '2/3', 'vote', 'congress'] },
      ],
    },
    'separation-of-powers': {
      items: [
        { prompt: 'What is separation of powers?', answer: 'dividing government power among three branches', type: 'open', acceptedKeywords: ['three', 'branch', 'divid', 'power', 'separate'] },
        { prompt: 'Which branch makes laws?', answer: 'legislative', type: 'open', acceptedKeywords: ['legislat', 'congress'] },
        { prompt: 'Which branch enforces laws?', answer: 'executive', type: 'open', acceptedKeywords: ['execut', 'president'] },
        { prompt: 'Which branch interprets laws?', answer: 'judicial', type: 'open', acceptedKeywords: ['judicial', 'court', 'supreme'] },
        { prompt: 'Why is separation of powers important?', answer: 'it prevents any one group from having all the power', type: 'open', acceptedKeywords: ['prevent', 'one', 'all', 'power', 'tyran', 'protect', 'balance'] },
      ],
    },
    'petitions': {
      items: [
        { prompt: 'What is a petition?', answer: 'a formal request signed by many people asking for change', type: 'open', acceptedKeywords: ['request', 'sign', 'change', 'people', 'ask', 'formal'] },
        { prompt: 'Which amendment protects the right to petition?', answer: 'the first amendment', type: 'open', acceptedKeywords: ['first', '1st', '1'] },
        { prompt: 'Can kids write petitions?', answer: 'yes', type: 'open', acceptedKeywords: ['yes'] },
        { prompt: 'What makes a petition effective?', answer: 'having many signatures and a clear request', type: 'open', acceptedKeywords: ['many', 'signature', 'clear', 'specific', 'people', 'request'] },
        { prompt: 'Give an example of something you could petition for at school.', answer: 'longer recess new equipment or healthier lunch', type: 'open', acceptedKeywords: ['recess', 'lunch', 'equipment', 'class', 'book', 'rule', 'change'] },
      ],
    },
    'community-organizing': {
      items: [
        { prompt: 'What is community organizing?', answer: 'bringing people together to work for change', type: 'open', acceptedKeywords: ['people', 'together', 'change', 'work', 'group', 'organiz'] },
        { prompt: 'Name one way to organize people for a cause.', answer: 'hold a meeting start a campaign or create a group', type: 'open', acceptedKeywords: ['meeting', 'campaign', 'group', 'march', 'rally', 'social media', 'petition'] },
        { prompt: 'Why is community organizing important?', answer: 'one person has limited power but a group can make change', type: 'open', acceptedKeywords: ['group', 'together', 'power', 'change', 'strong', 'voice', 'more'] },
        { prompt: 'What skills does a community organizer need?', answer: 'communication leadership and the ability to work with others', type: 'open', acceptedKeywords: ['communicat', 'lead', 'listen', 'work', 'other', 'speak', 'organiz'] },
        { prompt: 'Give an example of successful community organizing.', answer: 'civil rights marches environmental cleanup campaigns', type: 'open', acceptedKeywords: ['civil right', 'march', 'cleanup', 'campaign', 'movement', 'protest', 'vote'] },
      ],
    },
    'informed-citizenship': {
      items: [
        { prompt: 'What is an informed citizen?', answer: 'someone who stays knowledgeable about issues and government', type: 'open', acceptedKeywords: ['know', 'inform', 'issue', 'government', 'learn', 'news', 'understand'] },
        { prompt: 'Why is it important to be informed before voting?', answer: 'so you can make good choices about leaders and issues', type: 'open', acceptedKeywords: ['choice', 'good', 'leader', 'issue', 'know', 'best', 'understand'] },
        { prompt: 'Where can you get reliable information about government?', answer: 'official government websites newspapers and trusted news sources', type: 'open', acceptedKeywords: ['government', 'website', 'newspaper', 'news', 'official', 'library', 'source'] },
        { prompt: 'What is the difference between a fact and an opinion in politics?', answer: 'a fact can be proven and an opinion is a personal belief', type: 'open', acceptedKeywords: ['fact', 'proven', 'opinion', 'belief', 'personal', 'true', 'verif'] },
        { prompt: 'Why should citizens pay attention to both sides of an issue?', answer: 'to make fair and informed decisions', type: 'open', acceptedKeywords: ['fair', 'inform', 'decision', 'both', 'understand', 'balanced'] },
      ],
    },
  },
  'grade-6': {
    'popular-sovereignty': {
      items: [
        { prompt: 'What is popular sovereignty?', answer: 'the idea that government power comes from the people', type: 'open', acceptedKeywords: ['power', 'people', 'citizen', 'consent', 'govern'] },
        { prompt: 'How is popular sovereignty practiced in the US?', answer: 'through voting and elections', type: 'open', acceptedKeywords: ['vote', 'election', 'choose', 'elect', 'represent'] },
        { prompt: 'Who said "government of the people, by the people, for the people"?', answer: 'abraham lincoln', type: 'open', acceptedKeywords: ['lincoln'] },
        { prompt: 'What happens when a government ignores popular sovereignty?', answer: 'it loses legitimacy and people may demand change', type: 'open', acceptedKeywords: ['legitimacy', 'change', 'revolt', 'demand', 'protest', 'lose', 'right'] },
        { prompt: 'Where in the Constitution is popular sovereignty expressed?', answer: 'in the preamble with we the people', type: 'open', acceptedKeywords: ['preamble', 'we the people', 'beginning'] },
      ],
    },
    'rule-of-law': {
      items: [
        { prompt: 'What is the rule of law?', answer: 'the principle that everyone including leaders must follow the law', type: 'open', acceptedKeywords: ['everyone', 'leader', 'follow', 'law', 'equal', 'above'] },
        { prompt: 'Why is the rule of law important?', answer: 'it ensures fairness and prevents abuse of power', type: 'open', acceptedKeywords: ['fair', 'prevent', 'abuse', 'power', 'equal', 'protect'] },
        { prompt: 'Is the president above the law?', answer: 'no even the president must follow the law', type: 'open', acceptedKeywords: ['no', 'follow', 'law', 'not above'] },
        { prompt: 'What happens in a country without rule of law?', answer: 'leaders can abuse power and people have no protection', type: 'open', acceptedKeywords: ['abuse', 'power', 'no protect', 'corrupt', 'unfair', 'chaos'] },
        { prompt: 'How does the Constitution support the rule of law?', answer: 'by setting limits on government power and establishing rights', type: 'open', acceptedKeywords: ['limit', 'power', 'right', 'law', 'constit', 'government'] },
      ],
    },
    'consent-of-governed': {
      items: [
        { prompt: 'What is consent of the governed?', answer: 'the idea that government must have the peoples agreement to rule', type: 'open', acceptedKeywords: ['people', 'agreement', 'rule', 'consent', 'permission', 'accept'] },
        { prompt: 'How do people give consent to be governed?', answer: 'through voting and participating in democracy', type: 'open', acceptedKeywords: ['vote', 'participat', 'democracy', 'election', 'consent'] },
        { prompt: 'What philosopher wrote about consent of the governed?', answer: 'john locke', type: 'open', acceptedKeywords: ['locke'] },
        { prompt: 'What can people do if they feel the government no longer has their consent?', answer: 'protest vote for change or work to reform government', type: 'open', acceptedKeywords: ['protest', 'vote', 'change', 'reform', 'petition', 'speak'] },
        { prompt: 'How did the Declaration of Independence use this idea?', answer: 'it said people have the right to change a government that does not serve them', type: 'open', acceptedKeywords: ['right', 'change', 'government', 'not serve', 'people', 'declar'] },
      ],
    },
    'democracy-vs-authoritarian': {
      items: [
        { prompt: 'What is a democracy?', answer: 'a government where the people have power through voting', type: 'open', acceptedKeywords: ['people', 'power', 'vote', 'choose', 'elect', 'citizen'] },
        { prompt: 'What is an authoritarian government?', answer: 'a government where one person or group has all the power', type: 'open', acceptedKeywords: ['one', 'power', 'control', 'all', 'dictator', 'group'] },
        { prompt: 'Name two differences between democracy and authoritarianism.', answer: 'democracy has elections and free speech while authoritarianism does not', type: 'open', acceptedKeywords: ['election', 'free', 'speech', 'vote', 'no choice', 'right', 'restrict'] },
        { prompt: 'Give an example of a democratic country.', answer: 'united states canada or france', type: 'open', acceptedKeywords: ['united states', 'canada', 'france', 'uk', 'germany', 'japan', 'india'] },
        { prompt: 'Why do people generally prefer democracy?', answer: 'because people have rights and a voice in government', type: 'open', acceptedKeywords: ['right', 'voice', 'free', 'choose', 'participat', 'represent'] },
      ],
    },
    'republic-vs-direct-democracy': {
      items: [
        { prompt: 'What is a republic?', answer: 'a government where people elect representatives to make decisions', type: 'open', acceptedKeywords: ['elect', 'representative', 'decision', 'people', 'choose'] },
        { prompt: 'What is a direct democracy?', answer: 'a government where all citizens vote on every decision', type: 'open', acceptedKeywords: ['all', 'citizen', 'vote', 'every', 'decision', 'direct'] },
        { prompt: 'Is the United States a republic or direct democracy?', answer: 'a republic', type: 'open', acceptedKeywords: ['republic'] },
        { prompt: 'Why is direct democracy difficult for a large country?', answer: 'too many people to vote on every single issue', type: 'open', acceptedKeywords: ['too many', 'every', 'issue', 'large', 'difficult', 'impractical', 'time'] },
        { prompt: 'Which ancient city used direct democracy?', answer: 'athens', type: 'open', acceptedKeywords: ['athens', 'athen'] },
      ],
    },
    'enlightenment-thinkers': {
      items: [
        { prompt: 'Name one Enlightenment thinker who influenced American government.', answer: 'john locke montesquieu or rousseau', type: 'open', acceptedKeywords: ['locke', 'montesquieu', 'rousseau', 'voltaire'] },
        { prompt: 'What idea did John Locke contribute?', answer: 'natural rights life liberty and property', type: 'open', acceptedKeywords: ['natural right', 'life', 'liberty', 'property', 'consent'] },
        { prompt: 'What idea did Montesquieu contribute?', answer: 'separation of powers into three branches', type: 'open', acceptedKeywords: ['separat', 'power', 'branch', 'three', 'divid'] },
        { prompt: 'How did Enlightenment ideas influence the Declaration of Independence?', answer: 'the ideas of natural rights and consent of the governed were included', type: 'open', acceptedKeywords: ['natural right', 'consent', 'people', 'govern', 'life', 'liberty'] },
        { prompt: 'What was the Enlightenment?', answer: 'an intellectual movement that emphasized reason and individual rights', type: 'open', acceptedKeywords: ['reason', 'rights', 'individual', 'intellectual', 'movement', 'idea', 'think'] },
      ],
    },
    'ancient-greek-democracy': {
      items: [
        { prompt: 'Where was democracy invented?', answer: 'ancient athens greece', type: 'open', acceptedKeywords: ['athens', 'greece', 'greek'] },
        { prompt: 'Who could vote in ancient Athens?', answer: 'only free adult male citizens', type: 'open', acceptedKeywords: ['male', 'citizen', 'free', 'men', 'adult'] },
        { prompt: 'Who was NOT allowed to vote in Athens?', answer: 'women slaves and foreigners', type: 'open', acceptedKeywords: ['women', 'slave', 'foreign', 'not citizen'] },
        { prompt: 'How is Athenian democracy different from American democracy?', answer: 'athens had direct democracy and the us has representative democracy', type: 'open', acceptedKeywords: ['direct', 'representative', 'vote', 'every', 'elected', 'all citizen'] },
        { prompt: 'What is the legacy of Greek democracy?', answer: 'it created the idea that citizens should govern themselves', type: 'open', acceptedKeywords: ['idea', 'citizen', 'govern', 'self', 'foundation', 'influence', 'model'] },
      ],
    },
    'roman-republic': {
      items: [
        { prompt: 'What was the Roman Republic?', answer: 'a government where citizens elected representatives', type: 'open', acceptedKeywords: ['citizen', 'elect', 'representative', 'govern', 'rome'] },
        { prompt: 'What was the Roman Senate?', answer: 'a group of leaders who made laws and advised on policy', type: 'open', acceptedKeywords: ['leader', 'law', 'make', 'advise', 'group', 'govern'] },
        { prompt: 'How did the Roman Republic influence the United States?', answer: 'the idea of a republic with elected representatives and a senate', type: 'open', acceptedKeywords: ['republic', 'senate', 'elected', 'representative', 'model', 'influence'] },
        { prompt: 'What ended the Roman Republic?', answer: 'it became an empire under julius caesar and augustus', type: 'open', acceptedKeywords: ['empire', 'caesar', 'augustus', 'emperor', 'ended', 'dictator'] },
        { prompt: 'What is a consul in Roman government?', answer: 'one of two leaders who shared executive power', type: 'open', acceptedKeywords: ['leader', 'two', 'execut', 'power', 'share', 'head'] },
      ],
    },
  },
  'grade-7': {
    'federalism': {
      items: [
        { prompt: 'What is federalism?', answer: 'a system where power is shared between national and state governments', type: 'open', acceptedKeywords: ['power', 'share', 'national', 'state', 'govern', 'divid'] },
        { prompt: 'Name one power the federal government has but states do not.', answer: 'declaring war printing money or regulating trade between states', type: 'open', acceptedKeywords: ['war', 'money', 'trade', 'military', 'immigrat', 'interstate'] },
        { prompt: 'Name one power states have.', answer: 'education drivers licenses or local police', type: 'open', acceptedKeywords: ['educat', 'license', 'police', 'school', 'election', 'marriage', 'speed'] },
        { prompt: 'What are concurrent powers?', answer: 'powers shared by both federal and state governments', type: 'open', acceptedKeywords: ['shared', 'both', 'federal', 'state', 'together'] },
        { prompt: 'Give an example of a concurrent power.', answer: 'collecting taxes or building roads', type: 'open', acceptedKeywords: ['tax', 'road', 'court', 'law', 'borrow'] },
      ],
    },
    'state-constitutions': {
      items: [
        { prompt: 'Does every state have its own constitution?', answer: 'yes', type: 'exact' },
        { prompt: 'How is a state constitution similar to the US Constitution?', answer: 'both set up government structure and protect rights', type: 'open', acceptedKeywords: ['structure', 'right', 'protect', 'govern', 'set up', 'branch'] },
        { prompt: 'Can a state constitution give MORE rights than the US Constitution?', answer: 'yes but not fewer', type: 'open', acceptedKeywords: ['yes', 'more', 'not fewer', 'additional'] },
        { prompt: 'What happens if a state law conflicts with the US Constitution?', answer: 'the us constitution wins because of the supremacy clause', type: 'open', acceptedKeywords: ['constitution', 'win', 'supremacy', 'federal', 'override', 'higher'] },
        { prompt: 'Why might state constitutions be longer than the US Constitution?', answer: 'they often include more specific details about state governance', type: 'open', acceptedKeywords: ['specific', 'detail', 'state', 'more', 'local', 'particular'] },
      ],
    },
    'local-government-structures': {
      items: [
        { prompt: 'Name two types of local government.', answer: 'city and county', type: 'open', acceptedKeywords: ['city', 'county', 'town', 'village', 'municipal', 'borough'] },
        { prompt: 'What is a city council?', answer: 'the legislative body of a city government', type: 'open', acceptedKeywords: ['legislat', 'law', 'city', 'make', 'govern', 'body'] },
        { prompt: 'What services does local government provide?', answer: 'police fire schools roads parks and water', type: 'open', acceptedKeywords: ['police', 'fire', 'school', 'road', 'park', 'water', 'trash', 'library'] },
        { prompt: 'How do most local governments get their money?', answer: 'from property taxes and local fees', type: 'open', acceptedKeywords: ['property', 'tax', 'fee', 'local'] },
        { prompt: 'Why is local government important?', answer: 'it handles the issues closest to peoples daily lives', type: 'open', acceptedKeywords: ['close', 'daily', 'direct', 'lives', 'community', 'local', 'affect'] },
      ],
    },
    'political-parties': {
      items: [
        { prompt: 'What is a political party?', answer: 'a group of people who share similar ideas about government and work to get elected', type: 'open', acceptedKeywords: ['group', 'idea', 'govern', 'elect', 'similar', 'candidate', 'share'] },
        { prompt: 'Name the two major political parties in the US.', answer: 'democratic and republican', type: 'open', acceptedKeywords: ['democrat', 'republican'] },
        { prompt: 'What is a third party?', answer: 'a political party other than the two major ones', type: 'open', acceptedKeywords: ['other', 'not', 'major', 'small', 'alternative', 'different'] },
        { prompt: 'Why do political parties exist?', answer: 'to organize people around shared ideas and win elections', type: 'open', acceptedKeywords: ['organiz', 'idea', 'election', 'win', 'together', 'share'] },
        { prompt: 'Is it required to belong to a political party?', answer: 'no you can be independent', type: 'open', acceptedKeywords: ['no', 'independent', 'not required', 'choice'] },
      ],
    },
    'interest-groups': {
      items: [
        { prompt: 'What is an interest group?', answer: 'an organization that tries to influence government policy on specific issues', type: 'open', acceptedKeywords: ['organiz', 'influence', 'policy', 'issue', 'government', 'specific'] },
        { prompt: 'How do interest groups try to influence government?', answer: 'through lobbying donating to campaigns and public awareness', type: 'open', acceptedKeywords: ['lobby', 'donat', 'campaign', 'public', 'aware', 'advertis', 'persuad'] },
        { prompt: 'Give an example of an interest group.', answer: 'environmental groups or labor unions', type: 'open', acceptedKeywords: ['environment', 'union', 'nra', 'aarp', 'aclu', 'business', 'education'] },
        { prompt: 'Are interest groups the same as political parties?', answer: 'no interest groups focus on specific issues while parties try to win elections', type: 'open', acceptedKeywords: ['no', 'specific', 'issue', 'election', 'different', 'focus'] },
        { prompt: 'Is the influence of interest groups always positive?', answer: 'not always as they can give some groups more influence than others', type: 'open', acceptedKeywords: ['not always', 'some', 'more', 'influence', 'money', 'unequal', 'both', 'debate'] },
      ],
    },
    'campaigns-and-elections': {
      items: [
        { prompt: 'What is a political campaign?', answer: 'the organized effort by a candidate to win an election', type: 'open', acceptedKeywords: ['candidate', 'win', 'election', 'effort', 'organiz', 'run'] },
        { prompt: 'What is a primary election?', answer: 'an election where party members choose their candidate', type: 'open', acceptedKeywords: ['party', 'choose', 'candidate', 'member', 'select', 'nominat'] },
        { prompt: 'What is the Electoral College?', answer: 'the system that officially elects the president through electors from each state', type: 'open', acceptedKeywords: ['elector', 'president', 'state', 'system', 'elect', 'vote'] },
        { prompt: 'Why is campaign finance a concern?', answer: 'money can give wealthy donors too much influence over elections', type: 'open', acceptedKeywords: ['money', 'influence', 'wealth', 'donor', 'fair', 'power', 'buy'] },
        { prompt: 'What role do debates play in elections?', answer: 'they let voters compare candidates positions on issues', type: 'open', acceptedKeywords: ['voter', 'compar', 'position', 'issue', 'candidate', 'hear', 'view'] },
      ],
    },
    'media-role': {
      items: [
        { prompt: 'What role does media play in a democracy?', answer: 'informing citizens and holding government accountable', type: 'open', acceptedKeywords: ['inform', 'citizen', 'accountab', 'watchdog', 'news', 'report'] },
        { prompt: 'What is the term for media as a check on government?', answer: 'the fourth estate or watchdog', type: 'open', acceptedKeywords: ['fourth estate', 'watchdog'] },
        { prompt: 'How can media bias affect politics?', answer: 'it can give people a one-sided view and influence their opinions', type: 'open', acceptedKeywords: ['one-sided', 'influence', 'opinion', 'bias', 'mislead', 'view', 'perspective'] },
        { prompt: 'How has social media changed politics?', answer: 'it allows direct communication but also spreads misinformation', type: 'open', acceptedKeywords: ['direct', 'communicat', 'misinform', 'fast', 'spread', 'fake', 'connect'] },
        { prompt: 'Why is freedom of the press important for democracy?', answer: 'so media can report the truth without government censorship', type: 'open', acceptedKeywords: ['truth', 'censorship', 'free', 'report', 'government', 'inform', 'without'] },
      ],
    },
    'informed-voting': {
      items: [
        { prompt: 'What should you research before voting?', answer: 'candidates positions on issues and their record', type: 'open', acceptedKeywords: ['candidate', 'position', 'issue', 'record', 'platform', 'plan', 'policy'] },
        { prompt: 'Where can you find nonpartisan voter information?', answer: 'voter guides from nonpartisan organizations or government websites', type: 'open', acceptedKeywords: ['voter guide', 'nonpartisan', 'government', 'website', 'league', 'library'] },
        { prompt: 'What is voter registration?', answer: 'signing up to be eligible to vote', type: 'open', acceptedKeywords: ['sign', 'eligible', 'vote', 'register', 'list'] },
        { prompt: 'What does nonpartisan mean?', answer: 'not favoring any political party', type: 'open', acceptedKeywords: ['not favor', 'no party', 'neutral', 'unbiased', 'neither', 'impartial'] },
        { prompt: 'Why is voter turnout important?', answer: 'higher turnout means the results better represent the peoples wishes', type: 'open', acceptedKeywords: ['represent', 'people', 'more', 'better', 'voice', 'wish', 'democracy'] },
      ],
    },
    'civic-discourse': {
      items: [
        { prompt: 'What is civic discourse?', answer: 'respectful discussion about public issues and policies', type: 'open', acceptedKeywords: ['respectful', 'discussion', 'public', 'issue', 'policy', 'talk', 'debate'] },
        { prompt: 'Why is respectful disagreement important in democracy?', answer: 'it allows different ideas to be heard and better solutions to emerge', type: 'open', acceptedKeywords: ['different', 'idea', 'solution', 'hear', 'better', 'democra', 'respect'] },
        { prompt: 'What makes civic discourse productive?', answer: 'listening using evidence and being willing to consider other viewpoints', type: 'open', acceptedKeywords: ['listen', 'evidence', 'consider', 'viewpoint', 'respect', 'open', 'fact'] },
        { prompt: 'How can social media both help and hurt civic discourse?', answer: 'it connects people but can create echo chambers and hostility', type: 'open', acceptedKeywords: ['connect', 'echo', 'chamber', 'hostil', 'both', 'help', 'hurt', 'polariz'] },
        { prompt: 'What is the difference between debate and argument?', answer: 'debate is structured and respectful while argument can be hostile', type: 'open', acceptedKeywords: ['structured', 'respect', 'hostil', 'evidence', 'construct', 'different', 'calm'] },
      ],
    },
  },
  'grade-8': {
    'amendment-process': {
      items: [
        { prompt: 'How many amendments does the Constitution have?', answer: '27', type: 'exact' },
        { prompt: 'What are the two steps to amend the Constitution?', answer: 'proposal by 2/3 of congress or convention and ratification by 3/4 of states', type: 'open', acceptedKeywords: ['2/3', 'congress', '3/4', 'state', 'propos', 'ratif', 'convention'] },
        { prompt: 'Why is it hard to amend the Constitution?', answer: 'it requires supermajorities to prevent frequent changes', type: 'open', acceptedKeywords: ['hard', 'supermajor', 'difficult', 'prevent', 'frequent', 'high', 'threshold'] },
        { prompt: 'What was the most recent amendment and when was it ratified?', answer: 'the 27th amendment in 1992 about congressional pay', type: 'open', acceptedKeywords: ['27', '1992', 'pay', 'congress', 'salary'] },
        { prompt: 'Why did the Founders make the Constitution amendable?', answer: 'so it could adapt to changing times while remaining stable', type: 'open', acceptedKeywords: ['adapt', 'change', 'time', 'stable', 'future', 'flexible', 'evolv'] },
      ],
    },
    'judicial-review': {
      items: [
        { prompt: 'What is judicial review?', answer: 'the power of courts to declare laws unconstitutional', type: 'open', acceptedKeywords: ['court', 'unconstitut', 'law', 'power', 'declar', 'review'] },
        { prompt: 'Which case established judicial review?', answer: 'marbury v madison', type: 'open', acceptedKeywords: ['marbury', 'madison'] },
        { prompt: 'In what year was judicial review established?', answer: '1803', type: 'exact' },
        { prompt: 'Why is judicial review important?', answer: 'it ensures laws follow the constitution and protects rights', type: 'open', acceptedKeywords: ['constitut', 'protect', 'right', 'check', 'law', 'ensure'] },
        { prompt: 'Who was the Chief Justice who established judicial review?', answer: 'john marshall', type: 'open', acceptedKeywords: ['marshall'] },
      ],
    },
    'due-process': {
      items: [
        { prompt: 'What is due process?', answer: 'the legal requirement that the government must follow fair procedures', type: 'open', acceptedKeywords: ['fair', 'procedure', 'legal', 'government', 'right', 'process'] },
        { prompt: 'Which amendments guarantee due process?', answer: 'the 5th and 14th amendments', type: 'open', acceptedKeywords: ['5th', 'fifth', '14th', 'fourteenth'] },
        { prompt: 'What is an example of due process?', answer: 'the right to a fair trial and a lawyer', type: 'open', acceptedKeywords: ['trial', 'lawyer', 'fair', 'jury', 'rights', 'hearing'] },
        { prompt: 'What is the difference between procedural and substantive due process?', answer: 'procedural is about fair procedures and substantive is about fair laws', type: 'open', acceptedKeywords: ['procedural', 'substantive', 'fair', 'procedure', 'law', 'right'] },
        { prompt: 'Why is due process essential to justice?', answer: 'it prevents the government from treating people unfairly', type: 'open', acceptedKeywords: ['prevent', 'unfair', 'protect', 'government', 'justice', 'right', 'fair'] },
      ],
    },
    'marbury-v-madison': {
      items: [
        { prompt: 'What was the key issue in Marbury v. Madison?', answer: 'whether the supreme court could declare a law unconstitutional', type: 'open', acceptedKeywords: ['supreme court', 'unconstitut', 'law', 'judicial review', 'power'] },
        { prompt: 'What year was Marbury v. Madison decided?', answer: '1803', type: 'exact' },
        { prompt: 'What principle did this case establish?', answer: 'judicial review', type: 'open', acceptedKeywords: ['judicial review'] },
        { prompt: 'Who was the Chief Justice in this case?', answer: 'john marshall', type: 'open', acceptedKeywords: ['marshall'] },
        { prompt: 'Why is this case considered one of the most important in US history?', answer: 'it gave the supreme court the power to check the other branches', type: 'open', acceptedKeywords: ['power', 'check', 'branch', 'supreme', 'constitut', 'judicial'] },
      ],
    },
    'brown-v-board': {
      items: [
        { prompt: 'What did Brown v. Board of Education rule?', answer: 'that segregation in public schools is unconstitutional', type: 'open', acceptedKeywords: ['segregat', 'unconstitut', 'school', 'equal', 'illegal'] },
        { prompt: 'What year was the Brown decision?', answer: '1954', type: 'exact' },
        { prompt: 'What earlier case did Brown overturn?', answer: 'plessy v ferguson', type: 'open', acceptedKeywords: ['plessy', 'ferguson'] },
        { prompt: 'What was "separate but equal"?', answer: 'the doctrine that segregated facilities were legal if they were equal', type: 'open', acceptedKeywords: ['segregat', 'legal', 'equal', 'facilit', 'separate'] },
        { prompt: 'Who was the chief lawyer for the NAACP in this case?', answer: 'thurgood marshall', type: 'open', acceptedKeywords: ['thurgood', 'marshall'] },
      ],
    },
    'miranda-v-arizona': {
      items: [
        { prompt: 'What did Miranda v. Arizona establish?', answer: 'that police must inform suspects of their rights before questioning', type: 'open', acceptedKeywords: ['right', 'inform', 'police', 'question', 'suspect', 'miranda'] },
        { prompt: 'What are Miranda rights?', answer: 'the right to remain silent and the right to an attorney', type: 'open', acceptedKeywords: ['silent', 'attorney', 'lawyer', 'right', 'speak'] },
        { prompt: 'What year was Miranda decided?', answer: '1966', type: 'exact' },
        { prompt: 'Which amendment protects against self-incrimination?', answer: 'the 5th amendment', type: 'open', acceptedKeywords: ['5th', 'fifth'] },
        { prompt: 'What happens if police do not read Miranda rights?', answer: 'statements made may not be used as evidence in court', type: 'open', acceptedKeywords: ['evidence', 'not used', 'thrown out', 'inadmiss', 'court', 'suppress'] },
      ],
    },
    'civil-rights-movement': {
      items: [
        { prompt: 'What was the Civil Rights Movement?', answer: 'a movement to end racial discrimination and gain equal rights', type: 'open', acceptedKeywords: ['racial', 'discriminat', 'equal', 'right', 'end', 'movement'] },
        { prompt: 'Name two leaders of the Civil Rights Movement.', answer: 'martin luther king jr and rosa parks', type: 'open', acceptedKeywords: ['king', 'rosa', 'parks', 'malcolm', 'lewis', 'marshall'] },
        { prompt: 'What was the Montgomery Bus Boycott?', answer: 'a protest against segregated buses in Montgomery Alabama', type: 'open', acceptedKeywords: ['bus', 'segregat', 'montgomery', 'protest', 'boycott'] },
        { prompt: 'What did the Civil Rights Act of 1964 do?', answer: 'it banned discrimination based on race color religion sex or national origin', type: 'open', acceptedKeywords: ['ban', 'discriminat', 'race', 'religion', 'sex', 'illegal'] },
        { prompt: 'What nonviolent strategies did the movement use?', answer: 'marches sit-ins boycotts and speeches', type: 'open', acceptedKeywords: ['march', 'sit-in', 'boycott', 'speech', 'nonviolent', 'protest', 'peaceful'] },
      ],
    },
    'equal-protection': {
      items: [
        { prompt: 'What is the Equal Protection Clause?', answer: 'the 14th amendment provision that requires equal treatment under the law', type: 'open', acceptedKeywords: ['14th', 'equal', 'treatment', 'law', 'amendment'] },
        { prompt: 'How has the Equal Protection Clause been used?', answer: 'to fight discrimination based on race gender and other characteristics', type: 'open', acceptedKeywords: ['discriminat', 'race', 'gender', 'fight', 'protect', 'equal'] },
        { prompt: 'What does "equal protection under the law" mean?', answer: 'that all people must be treated the same by the government', type: 'open', acceptedKeywords: ['all', 'same', 'government', 'treat', 'equal', 'everyone'] },
        { prompt: 'Name a case that used the Equal Protection Clause.', answer: 'brown v board of education', type: 'open', acceptedKeywords: ['brown', 'board', 'obergefell', 'loving', 'reed'] },
        { prompt: 'Is equal protection fully achieved today?', answer: 'not completely as discrimination still exists and people continue to fight for equality', type: 'open', acceptedKeywords: ['not', 'still', 'fight', 'work', 'continu', 'ongoing', 'progress'] },
      ],
    },
    'ongoing-struggles': {
      items: [
        { prompt: 'Name one civil rights issue that continues today.', answer: 'racial inequality gender discrimination or voting access', type: 'open', acceptedKeywords: ['racial', 'gender', 'voting', 'immigrat', 'disabilit', 'lgbtq', 'inequal', 'discriminat'] },
        { prompt: 'What is the difference between legal equality and actual equality?', answer: 'laws may guarantee equality but discrimination still happens in practice', type: 'open', acceptedKeywords: ['law', 'practice', 'still', 'discriminat', 'different', 'gap', 'real'] },
        { prompt: 'How can citizens help fight for equal rights?', answer: 'voting protesting contacting officials and supporting organizations', type: 'open', acceptedKeywords: ['vote', 'protest', 'contact', 'support', 'organiz', 'speak', 'educate'] },
        { prompt: 'Why is it important to learn about civil rights struggles?', answer: 'to understand history and work toward a more just society', type: 'open', acceptedKeywords: ['history', 'just', 'better', 'understand', 'learn', 'prevent', 'progress'] },
        { prompt: 'What role do courts play in civil rights today?', answer: 'they interpret laws and can expand or limit protections', type: 'open', acceptedKeywords: ['interpret', 'law', 'protect', 'expand', 'limit', 'case', 'rule'] },
      ],
    },
    'advocacy': {
      items: [
        { prompt: 'What is advocacy?', answer: 'speaking up and taking action to support a cause', type: 'open', acceptedKeywords: ['speak', 'action', 'support', 'cause', 'promote', 'fight'] },
        { prompt: 'Name one way you can advocate for an issue you care about.', answer: 'write a letter to an elected official or start a campaign', type: 'open', acceptedKeywords: ['letter', 'official', 'campaign', 'petition', 'social media', 'speak', 'protest'] },
        { prompt: 'Why is advocacy important in a democracy?', answer: 'it helps make sure government represents the peoples concerns', type: 'open', acceptedKeywords: ['represent', 'concern', 'voice', 'people', 'change', 'government', 'listen'] },
        { prompt: 'What is the difference between advocacy and lobbying?', answer: 'lobbying specifically targets lawmakers while advocacy is broader public support', type: 'open', acceptedKeywords: ['lawmaker', 'broader', 'public', 'specific', 'target', 'different'] },
        { prompt: 'Can young people be effective advocates?', answer: 'yes many young people have led successful advocacy movements', type: 'open', acceptedKeywords: ['yes', 'young', 'student', 'movement', 'success', 'example', 'voice'] },
      ],
    },
    'civic-responsibility': {
      items: [
        { prompt: 'What does civic responsibility mean?', answer: 'the duties citizens have to participate in and support their community and government', type: 'open', acceptedKeywords: ['duty', 'participat', 'community', 'government', 'citizen', 'responsib'] },
        { prompt: 'Name three civic responsibilities.', answer: 'voting paying taxes and serving on juries', type: 'open', acceptedKeywords: ['vote', 'tax', 'jury', 'law', 'inform', 'community'] },
        { prompt: 'Why is jury duty a civic responsibility?', answer: 'it ensures fair trials by having citizens participate in justice', type: 'open', acceptedKeywords: ['fair', 'trial', 'justice', 'citizen', 'participat', 'right'] },
        { prompt: 'Is civic responsibility optional?', answer: 'some parts are legal requirements and others are moral duties', type: 'open', acceptedKeywords: ['legal', 'moral', 'some', 'requir', 'duty', 'both', 'should'] },
        { prompt: 'How does civic responsibility strengthen democracy?', answer: 'when citizens participate actively the government better represents their interests', type: 'open', acceptedKeywords: ['participat', 'represent', 'interest', 'active', 'better', 'strong', 'democra'] },
      ],
    },
    'democratic-participation': {
      items: [
        { prompt: 'Name five ways to participate in democracy.', answer: 'voting volunteering contacting officials attending meetings and running for office', type: 'open', acceptedKeywords: ['vote', 'volunteer', 'contact', 'meeting', 'run', 'office', 'petition', 'campaign'] },
        { prompt: 'What is civic engagement?', answer: 'actively participating in the life of your community and government', type: 'open', acceptedKeywords: ['participat', 'community', 'government', 'active', 'involve'] },
        { prompt: 'Why do some people choose not to participate in democracy?', answer: 'they may feel their voice does not matter or face barriers like time and access', type: 'open', acceptedKeywords: ['voice', 'matter', 'barrier', 'time', 'access', 'apathy', 'feel', 'busy'] },
        { prompt: 'What happens when citizens do not participate?', answer: 'government becomes less representative and responsive', type: 'open', acceptedKeywords: ['less', 'represent', 'respond', 'weak', 'few', 'decide', 'power'] },
        { prompt: 'How can schools encourage democratic participation?', answer: 'through student government civic education and community projects', type: 'open', acceptedKeywords: ['student government', 'civic', 'educat', 'project', 'community', 'service', 'vote'] },
      ],
    },
  },
};

const SCENARIOS = {
  'kindergarten': [
    { title: 'The Playground Problem', description: 'Everyone wants to use the swings at recess but there are only 3 swings and 10 kids want to use them. How should we solve this problem fairly?', discussion: 'Talk about taking turns, rules, and fairness.' },
    { title: 'The Classroom Pet', description: 'Your class is getting a pet. Some kids want a hamster and some want a fish. How should the class decide?', discussion: 'Practice voting and respecting the majority decision.' },
  ],
  'grade-1': [
    { title: 'The New Rule', description: 'Someone keeps running in the hallway and almost bumped into a kindergartner. Should there be a new rule? What should it be?', discussion: 'Why do we need rules? Who should make them?' },
    { title: 'The Broken Equipment', description: 'The slide on the playground is broken. Who should fix it? How do we let them know?', discussion: 'Learn about community services and how to communicate needs.' },
  ],
  'grade-2': [
    { title: 'The Community Park', description: 'The city wants to build something new in an empty lot. Some people want a park. Others want a parking lot. How should the community decide?', discussion: 'Local government decisions and citizen participation.' },
    { title: 'The Lost Dog', description: 'You find a lost dog in your neighborhood. What community helpers and services can help?', discussion: 'Government services and community helpers working together.' },
  ],
  'grade-3': [
    { title: 'The School Budget', description: 'Your school has money for either new books for the library OR new equipment for the playground. The students get to vote. How do you decide?', discussion: 'Voting, researching issues, and accepting outcomes.' },
    { title: 'The Volunteer Fair', description: 'Your school is having a volunteer day. What causes could you help with? How do you organize people?', discussion: 'Civic action and community participation.' },
  ],
  'grade-4': [
    { title: 'The New Law', description: 'A senator wants to pass a law requiring all schools to have recess every day. Trace how this bill would become a law through the three branches.', discussion: 'How a bill becomes a law and checks and balances.' },
    { title: 'State vs Federal', description: 'Your state wants to set its own rules for school lunch nutrition. Can it? Or does the federal government decide?', discussion: 'Understanding levels of government and federalism.' },
  ],
  'grade-5': [
    { title: 'The Free Speech Debate', description: 'A student wants to wear a political T-shirt to school. The principal says no. Does the student have the right under the First Amendment?', discussion: 'First Amendment rights and their limits in schools.' },
    { title: 'The Town Hall Meeting', description: 'The town is voting on whether to allow a big company to build a factory. It would bring jobs but might pollute the river. What should citizens do?', discussion: 'Informed citizenship, civic action, and balancing interests.' },
  ],
  'grade-6': [
    { title: 'Democracy in Action', description: 'Imagine you are creating a government for a new country. Which type would you choose: direct democracy, republic, or something else? Why?', discussion: 'Compare government types using Enlightenment principles.' },
    { title: 'Ancient vs Modern', description: 'Compare voting in ancient Athens to voting in the US today. What has improved? What problems remain?', discussion: 'Democratic evolution and ongoing challenges.' },
  ],
  'grade-7': [
    { title: 'The Campaign', description: 'You are running for student body president. Design your campaign. What issues will you focus on? How will you reach voters? How will you handle opposition?', discussion: 'Campaigns, media, and democratic participation.' },
    { title: 'The Interest Group Debate', description: 'A large corporation and an environmental group both want to influence a new law. How should the government weigh their input?', discussion: 'Interest groups, lobbying, and fairness in representation.' },
  ],
  'grade-8': [
    { title: 'The Constitutional Question', description: 'A new technology allows the government to monitor all digital communications. A citizen says this violates the Fourth Amendment. What would the Supreme Court consider?', discussion: 'Constitutional law, privacy rights, and judicial review.' },
    { title: 'Civil Rights Today', description: 'Choose a current civil rights issue. Trace how it connects to the history of civil rights in America. What legal tools exist? What civic actions can people take?', discussion: 'Connecting historical civil rights to contemporary issues.' },
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

class Civics {
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

  getScenario(grade) {
    const scenarios = SCENARIOS[grade];
    if (!scenarios) return { error: `No scenarios for ${grade}. Available: ${Object.keys(SCENARIOS).join(', ')}` };
    return pick(scenarios, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const scenario = SCENARIOS[grade] ? pick(SCENARIOS[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, scenario,
      lessonPlan: {
        review: 'Review previously learned civics concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: scenario ? `Discuss civic scenario: "${scenario.title}"` : 'Apply concepts to a real-world situation',
        reflect: 'Reflect on what it means to be a good citizen',
      },
    };
  }
}

module.exports = Civics;

// CLI: node civics.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new Civics();
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
      case 'scenario': { const [, g] = args; if (!g) throw new Error('Usage: scenario <grade>'); out(api.getScenario(g)); break; }
      default: out({ usage: 'node civics.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','scenario'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
