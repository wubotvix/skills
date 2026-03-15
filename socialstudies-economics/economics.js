// eClaw Economics Interactive Tutor (K-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'socialstudies-economics');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'wants-and-needs': ['identifying-needs', 'identifying-wants', 'needs-vs-wants'],
    'goods-and-services': ['what-are-goods', 'what-are-services'],
    'jobs': ['community-jobs', 'why-people-work'],
  },
  'grade-1': {
    'wants-and-needs': ['sorting-wants-needs', 'limited-resources'],
    'money-basics': ['coins-and-bills', 'using-money'],
    'sharing-and-trading': ['trading-items', 'fair-trades'],
  },
  'grade-2': {
    'scarcity': ['what-is-scarcity', 'making-choices'],
    'opportunity-cost': ['what-you-give-up', 'decision-making'],
    'producers-consumers': ['who-produces', 'who-consumes', 'both-roles'],
  },
  'grade-3': {
    'resources': ['natural-resources', 'human-resources', 'capital-resources'],
    'specialization': ['why-specialize', 'interdependence'],
    'saving': ['why-save', 'saving-vs-spending', 'budgeting-basics'],
  },
  'grade-4': {
    'supply-and-demand': ['what-is-supply', 'what-is-demand', 'price-changes'],
    'markets': ['how-markets-work', 'competition'],
    'entrepreneurship': ['what-is-entrepreneur', 'starting-a-business'],
  },
  'grade-5': {
    'financial-literacy': ['earning-money', 'saving-and-investing', 'smart-spending'],
    'taxes': ['what-are-taxes', 'where-taxes-go'],
    'economic-regions': ['us-economic-regions', 'resources-and-industry'],
  },
  'grade-6': {
    'economic-systems': ['traditional-economy', 'market-economy', 'command-economy', 'mixed-economy'],
    'international-trade': ['why-countries-trade', 'imports-and-exports', 'trade-barriers'],
    'ancient-economies': ['barter-systems', 'early-money', 'trade-routes'],
  },
  'grade-7': {
    'market-structures': ['perfect-competition', 'monopoly', 'oligopoly'],
    'business-cycles': ['expansion-and-recession', 'unemployment', 'inflation'],
    'banking': ['how-banks-work', 'interest', 'credit'],
    'personal-finance': ['budgeting', 'investing-basics', 'consumer-protection'],
  },
  'grade-8': {
    'macroeconomics': ['gdp', 'economic-indicators', 'fiscal-policy'],
    'monetary-policy': ['federal-reserve', 'money-supply', 'interest-rates'],
    'trade-policy': ['free-trade-vs-protectionism', 'trade-agreements', 'globalization-economics'],
    'economic-inequality': ['income-distribution', 'poverty', 'economic-mobility'],
  },
};

const CONTENT_BANKS = {
  'kindergarten': {
    'identifying-needs': {
      items: [
        { prompt: 'What is a need?', answer: 'something you must have to survive', type: 'open', acceptedKeywords: ['must', 'have', 'survive', 'live', 'need', 'require'] },
        { prompt: 'Is food a need or a want?', answer: 'need', type: 'exact' },
        { prompt: 'Is water a need or a want?', answer: 'need', type: 'exact' },
        { prompt: 'Is shelter a need or a want?', answer: 'need', type: 'exact' },
        { prompt: 'Name three things all people need to survive.', answer: 'food water and shelter', type: 'open', acceptedKeywords: ['food', 'water', 'shelter', 'clothing', 'air'] },
      ],
    },
    'identifying-wants': {
      items: [
        { prompt: 'What is a want?', answer: 'something you would like but do not need to survive', type: 'open', acceptedKeywords: ['like', 'not need', 'wish', 'desire', 'survive'] },
        { prompt: 'Is a toy a need or a want?', answer: 'want', type: 'exact' },
        { prompt: 'Is a video game a need or a want?', answer: 'want', type: 'exact' },
        { prompt: 'Is candy a need or a want?', answer: 'want', type: 'exact' },
        { prompt: 'Can a want become a need?', answer: 'sometimes — warm clothing in winter could be both', type: 'open', acceptedKeywords: ['sometimes', 'depend', 'maybe', 'situation', 'warm', 'weather'] },
      ],
    },
    'needs-vs-wants': {
      items: [
        { prompt: 'What is the difference between a need and a want?', answer: 'a need is required to live and a want is something you would like', type: 'open', acceptedKeywords: ['required', 'live', 'like', 'survive', 'must', 'wish'] },
        { prompt: 'A bicycle — need or want?', answer: 'want', type: 'exact' },
        { prompt: 'Clothing — need or want?', answer: 'need', type: 'exact' },
        { prompt: 'An ice cream cone — need or want?', answer: 'want', type: 'exact' },
        { prompt: 'If you had to choose between buying food or a toy, which should you buy? Why?', answer: 'food because it is a need', type: 'open', acceptedKeywords: ['food', 'need', 'survive', 'important', 'must'] },
      ],
    },
    'what-are-goods': {
      items: [
        { prompt: 'What are goods?', answer: 'things you can buy and touch', type: 'open', acceptedKeywords: ['thing', 'buy', 'touch', 'object', 'product', 'item'] },
        { prompt: 'Is a book a good? A) Yes B) No', answer: 'a', type: 'multiple-choice' },
        { prompt: 'Name three goods.', answer: 'food clothes and toys', type: 'open', acceptedKeywords: ['food', 'cloth', 'toy', 'book', 'shoe', 'car', 'phone', 'pencil'] },
        { prompt: 'Where do people buy goods?', answer: 'in stores or online', type: 'open', acceptedKeywords: ['store', 'online', 'market', 'shop', 'mall'] },
        { prompt: 'Is a banana a good?', answer: 'yes', type: 'open', acceptedKeywords: ['yes'] },
      ],
    },
    'what-are-services': {
      items: [
        { prompt: 'What is a service?', answer: 'work that someone does for others', type: 'open', acceptedKeywords: ['work', 'do', 'other', 'help', 'someone'] },
        { prompt: 'Is a haircut a good or a service?', answer: 'service', type: 'exact' },
        { prompt: 'Name three services.', answer: 'teaching healing and fixing things', type: 'open', acceptedKeywords: ['teach', 'doctor', 'fix', 'clean', 'haircut', 'drive', 'cook', 'dentist'] },
        { prompt: 'Is a firefighter providing a good or a service?', answer: 'service', type: 'exact' },
        { prompt: 'What is the difference between a good and a service?', answer: 'a good is a thing and a service is work someone does', type: 'open', acceptedKeywords: ['thing', 'work', 'touch', 'do', 'object', 'action'] },
      ],
    },
    'community-jobs': {
      items: [
        { prompt: 'Name three jobs in your community.', answer: 'teacher police officer and store worker', type: 'open', acceptedKeywords: ['teacher', 'police', 'store', 'doctor', 'nurse', 'firefight', 'bus', 'mail'] },
        { prompt: 'What does a teacher do?', answer: 'teaches children and helps them learn', type: 'open', acceptedKeywords: ['teach', 'learn', 'help', 'children', 'school'] },
        { prompt: 'What does a doctor do?', answer: 'helps people who are sick feel better', type: 'open', acceptedKeywords: ['sick', 'better', 'help', 'health', 'heal', 'medicine'] },
        { prompt: 'Do all jobs help the community?', answer: 'yes', type: 'open', acceptedKeywords: ['yes'] },
        { prompt: 'What job would you like to have when you grow up? Why?', answer: 'any job with a reason', type: 'open', acceptedKeywords: ['because', 'help', 'like', 'want', 'love', 'enjoy', 'good at'] },
      ],
    },
    'why-people-work': {
      items: [
        { prompt: 'Why do people work?', answer: 'to earn money to buy things they need and want', type: 'open', acceptedKeywords: ['money', 'earn', 'buy', 'need', 'want', 'pay'] },
        { prompt: 'What do people use money for?', answer: 'to buy food shelter clothing and other things', type: 'open', acceptedKeywords: ['buy', 'food', 'shelter', 'cloth', 'need', 'want', 'pay'] },
        { prompt: 'Can people work for other reasons besides money?', answer: 'yes like helping others or doing something they love', type: 'open', acceptedKeywords: ['yes', 'help', 'love', 'enjoy', 'volunteer', 'purpose'] },
        { prompt: 'What is a volunteer?', answer: 'someone who works without getting paid', type: 'open', acceptedKeywords: ['without', 'paid', 'free', 'not paid', 'no money', 'help'] },
        { prompt: 'True or false: Everyone who works gets paid money.', answer: 'false', type: 'exact' },
      ],
    },
  },
  'grade-1': {
    'sorting-wants-needs': {
      items: [
        { prompt: 'Sort these: water, video game, food, toy car, jacket. Which are needs?', answer: 'water food and jacket', type: 'open', acceptedKeywords: ['water', 'food', 'jacket'] },
        { prompt: 'A family has $20. Should they buy groceries or a video game first?', answer: 'groceries because food is a need', type: 'open', acceptedKeywords: ['grocer', 'food', 'need', 'first', 'important'] },
        { prompt: 'Is a cell phone a need or a want for a first grader?', answer: 'want', type: 'exact' },
        { prompt: 'Is a warm coat in winter a need or want?', answer: 'need', type: 'exact' },
        { prompt: 'Why is it important to know the difference between needs and wants?', answer: 'so you spend money on needs first', type: 'open', acceptedKeywords: ['spend', 'need', 'first', 'important', 'priority', 'money', 'smart'] },
      ],
    },
    'limited-resources': {
      items: [
        { prompt: 'What does "limited" mean?', answer: 'there is not an unlimited amount of something', type: 'open', acceptedKeywords: ['not unlimited', 'run out', 'not enough', 'finite', 'end', 'scarce'] },
        { prompt: 'If there are 10 cookies and 20 kids, are the cookies limited?', answer: 'yes', type: 'exact' },
        { prompt: 'What do you have to do when resources are limited?', answer: 'share or make choices about who gets what', type: 'open', acceptedKeywords: ['share', 'choice', 'choose', 'decide', 'divide', 'fair'] },
        { prompt: 'Is time limited?', answer: 'yes', type: 'exact' },
        { prompt: 'If you have one hour to play, and you want to play two games, what do you have to do?', answer: 'choose one or split the time', type: 'open', acceptedKeywords: ['choose', 'split', 'one', 'decide', 'half', 'pick'] },
      ],
    },
    'coins-and-bills': {
      items: [
        { prompt: 'How much is a penny worth?', answer: '1 cent', type: 'open', acceptedKeywords: ['1', 'one', 'cent'] },
        { prompt: 'How much is a nickel worth?', answer: '5 cents', type: 'open', acceptedKeywords: ['5', 'five', 'cent'] },
        { prompt: 'How much is a dime worth?', answer: '10 cents', type: 'open', acceptedKeywords: ['10', 'ten', 'cent'] },
        { prompt: 'How much is a quarter worth?', answer: '25 cents', type: 'open', acceptedKeywords: ['25', 'twenty-five', 'cent'] },
        { prompt: 'If you have 2 quarters, how much money do you have?', answer: '50 cents', type: 'open', acceptedKeywords: ['50', 'fifty', 'cent'] },
      ],
    },
    'using-money': {
      items: [
        { prompt: 'What is money used for?', answer: 'to buy goods and services', type: 'open', acceptedKeywords: ['buy', 'goods', 'service', 'pay', 'trade'] },
        { prompt: 'If a toy costs $5 and you have $3, can you buy it?', answer: 'no you need 2 more dollars', type: 'open', acceptedKeywords: ['no', 'not enough', 'need more', '2'] },
        { prompt: 'What is change?', answer: 'the money you get back when you pay more than something costs', type: 'open', acceptedKeywords: ['back', 'extra', 'more', 'pay', 'left over'] },
        { prompt: 'If something costs $1 and you pay with $5, how much change do you get?', answer: '$4', type: 'open', acceptedKeywords: ['4', 'four'] },
        { prompt: 'What is another word for the money you earn at a job?', answer: 'wages or salary or income', type: 'open', acceptedKeywords: ['wage', 'salary', 'income', 'pay', 'paycheck'] },
      ],
    },
    'trading-items': {
      items: [
        { prompt: 'What is trading?', answer: 'exchanging one thing for another', type: 'open', acceptedKeywords: ['exchang', 'swap', 'give', 'get', 'trade', 'one for another'] },
        { prompt: 'Before money existed, how did people get things they needed?', answer: 'they traded or bartered', type: 'open', acceptedKeywords: ['trade', 'barter', 'exchange', 'swap'] },
        { prompt: 'You have an apple and your friend has a sandwich. If you trade, what do you each get?', answer: 'you get the sandwich and your friend gets the apple', type: 'open', acceptedKeywords: ['sandwich', 'apple', 'trade', 'switch'] },
        { prompt: 'Why do people trade?', answer: 'because each person has something the other wants', type: 'open', acceptedKeywords: ['want', 'need', 'have', 'something', 'other'] },
        { prompt: 'What is barter?', answer: 'trading goods or services without using money', type: 'open', acceptedKeywords: ['trade', 'without money', 'no money', 'exchange', 'goods'] },
      ],
    },
    'fair-trades': {
      items: [
        { prompt: 'What makes a trade fair?', answer: 'both people are happy with what they get', type: 'open', acceptedKeywords: ['both', 'happy', 'agree', 'fair', 'equal', 'satisfied'] },
        { prompt: 'If someone trades a penny for your dollar, is that fair?', answer: 'no', type: 'exact' },
        { prompt: 'You trade 1 cookie for 1 cookie. Is this fair?', answer: 'yes', type: 'exact' },
        { prompt: 'What should you do if a trade feels unfair?', answer: 'say no or talk about making it fairer', type: 'open', acceptedKeywords: ['no', 'talk', 'fair', 'say', 'change', 'disagree', 'negotiate'] },
        { prompt: 'Why is it important for trades to be fair?', answer: 'so no one is cheated and everyone is treated well', type: 'open', acceptedKeywords: ['cheat', 'treat', 'fair', 'right', 'trust', 'happy', 'both'] },
      ],
    },
  },
  'grade-2': {
    'what-is-scarcity': {
      items: [
        { prompt: 'What is scarcity?', answer: 'when there is not enough of something for everyone who wants it', type: 'open', acceptedKeywords: ['not enough', 'limited', 'want', 'everyone', 'scarce'] },
        { prompt: 'Is scarcity only about money?', answer: 'no it can be about time food water or anything limited', type: 'open', acceptedKeywords: ['no', 'time', 'food', 'water', 'anything', 'resource', 'not just'] },
        { prompt: 'If there are 5 slices of pizza and 10 hungry kids, is there scarcity?', answer: 'yes', type: 'exact' },
        { prompt: 'Does scarcity ever go away completely?', answer: 'no because wants are unlimited but resources are limited', type: 'open', acceptedKeywords: ['no', 'unlimited', 'limited', 'always', 'never', 'want'] },
        { prompt: 'What do people do when there is scarcity?', answer: 'they make choices about how to use resources', type: 'open', acceptedKeywords: ['choice', 'decide', 'choose', 'use', 'share', 'priorit'] },
      ],
    },
    'making-choices': {
      items: [
        { prompt: 'Why do we have to make choices?', answer: 'because we cannot have everything we want', type: 'open', acceptedKeywords: ['cannot', 'everything', 'limited', 'scarcity', 'not enough', 'resources'] },
        { prompt: 'You have $10 and can buy a book for $10 OR a game for $10. What kind of decision is this?', answer: 'an economic choice because you have to pick one', type: 'open', acceptedKeywords: ['choice', 'pick', 'one', 'cannot both', 'decide', 'trade-off'] },
        { prompt: 'What is a trade-off?', answer: 'giving up one thing to get another', type: 'open', acceptedKeywords: ['give up', 'get', 'another', 'one', 'exchange', 'sacrifice'] },
        { prompt: 'Is every choice an economic choice?', answer: 'yes because time and resources are always limited', type: 'open', acceptedKeywords: ['yes', 'time', 'resources', 'limited', 'always'] },
        { prompt: 'What should you think about before making a choice?', answer: 'what you will gain and what you will give up', type: 'open', acceptedKeywords: ['gain', 'give up', 'cost', 'benefit', 'lose', 'consequence'] },
      ],
    },
    'what-you-give-up': {
      items: [
        { prompt: 'What is opportunity cost?', answer: 'the next best thing you give up when you make a choice', type: 'open', acceptedKeywords: ['give up', 'next best', 'choice', 'lose', 'miss', 'could have'] },
        { prompt: 'You choose to play soccer instead of reading. What is the opportunity cost?', answer: 'reading', type: 'open', acceptedKeywords: ['reading', 'read', 'book'] },
        { prompt: 'You buy a pizza instead of a burger. What is the opportunity cost?', answer: 'the burger', type: 'open', acceptedKeywords: ['burger', 'hamburger'] },
        { prompt: 'Does every choice have an opportunity cost?', answer: 'yes', type: 'exact' },
        { prompt: 'Why is it important to think about opportunity cost?', answer: 'to make the best decision possible', type: 'open', acceptedKeywords: ['best', 'decision', 'smart', 'wise', 'good choice', 'think'] },
      ],
    },
    'decision-making': {
      items: [
        { prompt: 'What are the steps of good decision making?', answer: 'identify the problem list options consider costs and benefits choose', type: 'open', acceptedKeywords: ['problem', 'option', 'cost', 'benefit', 'choose', 'list', 'consider'] },
        { prompt: 'You have $20 and want three things: a book ($10), a toy ($8), and candy ($5). What should you think about?', answer: 'which items you want most and which to give up', type: 'open', acceptedKeywords: ['want most', 'give up', 'priority', 'choose', 'enough', 'budget'] },
        { prompt: 'What is a pro?', answer: 'a good thing about a choice', type: 'open', acceptedKeywords: ['good', 'positive', 'benefit', 'advantage'] },
        { prompt: 'What is a con?', answer: 'a bad thing or downside of a choice', type: 'open', acceptedKeywords: ['bad', 'negative', 'downside', 'disadvantage', 'cost'] },
        { prompt: 'A pro and con list helps you make what?', answer: 'a better decision', type: 'open', acceptedKeywords: ['better', 'decision', 'choice', 'smart', 'informed'] },
      ],
    },
    'who-produces': {
      items: [
        { prompt: 'What is a producer?', answer: 'a person or business that makes goods or provides services', type: 'open', acceptedKeywords: ['make', 'goods', 'service', 'provide', 'creat', 'business'] },
        { prompt: 'Is a farmer a producer?', answer: 'yes they produce food', type: 'open', acceptedKeywords: ['yes', 'food', 'produce', 'grow'] },
        { prompt: 'Name two producers.', answer: 'farmers bakers or factory workers', type: 'open', acceptedKeywords: ['farmer', 'baker', 'factory', 'carpenter', 'chef', 'manufacturer'] },
        { prompt: 'What do producers do with the goods they make?', answer: 'sell them to consumers', type: 'open', acceptedKeywords: ['sell', 'consumer', 'buy', 'market', 'store'] },
        { prompt: 'Can a person be both a producer and a consumer?', answer: 'yes', type: 'exact' },
      ],
    },
    'who-consumes': {
      items: [
        { prompt: 'What is a consumer?', answer: 'a person who buys and uses goods or services', type: 'open', acceptedKeywords: ['buy', 'use', 'goods', 'service', 'person'] },
        { prompt: 'Are you a consumer when you buy lunch?', answer: 'yes', type: 'exact' },
        { prompt: 'Name two things consumers do.', answer: 'buy and use products', type: 'open', acceptedKeywords: ['buy', 'use', 'purchase', 'spend', 'shop'] },
        { prompt: 'What do consumers use to buy goods?', answer: 'money', type: 'open', acceptedKeywords: ['money', 'cash', 'card', 'pay'] },
        { prompt: 'Why are consumers important to the economy?', answer: 'because they buy things which keeps businesses running', type: 'open', acceptedKeywords: ['buy', 'business', 'money', 'economy', 'keep going', 'running'] },
      ],
    },
    'both-roles': {
      items: [
        { prompt: 'A baker makes bread and also buys groceries. Is the baker a producer, consumer, or both?', answer: 'both', type: 'exact' },
        { prompt: 'When are you a consumer?', answer: 'when you buy or use something', type: 'open', acceptedKeywords: ['buy', 'use', 'purchase', 'spend'] },
        { prompt: 'When could you be a producer?', answer: 'when you make something to sell like lemonade', type: 'open', acceptedKeywords: ['make', 'sell', 'create', 'lemonade', 'product', 'provide'] },
        { prompt: 'Can a company be both a producer and consumer?', answer: 'yes it makes products but also buys supplies', type: 'open', acceptedKeywords: ['yes', 'make', 'buy', 'supplies', 'both'] },
        { prompt: 'Why is it important that producers and consumers depend on each other?', answer: 'producers need consumers to buy and consumers need producers to make things', type: 'open', acceptedKeywords: ['need each other', 'buy', 'make', 'depend', 'both'] },
      ],
    },
  },
  'grade-3': {
    'natural-resources': {
      items: [
        { prompt: 'What are natural resources?', answer: 'things from nature that people use', type: 'open', acceptedKeywords: ['nature', 'use', 'earth', 'natural', 'land', 'found'] },
        { prompt: 'Name three natural resources.', answer: 'water trees and minerals', type: 'open', acceptedKeywords: ['water', 'tree', 'mineral', 'oil', 'soil', 'air', 'sun', 'coal', 'wood'] },
        { prompt: 'Are natural resources unlimited?', answer: 'no many are limited or can be used up', type: 'open', acceptedKeywords: ['no', 'limited', 'used up', 'run out', 'finite', 'scarce'] },
        { prompt: 'What is a renewable resource?', answer: 'a resource that can be replaced naturally', type: 'open', acceptedKeywords: ['replace', 'renew', 'grow back', 'natural', 'again'] },
        { prompt: 'What is a nonrenewable resource?', answer: 'a resource that cannot be easily replaced once used', type: 'open', acceptedKeywords: ['cannot', 'replace', 'limited', 'run out', 'gone', 'finite'] },
      ],
    },
    'human-resources': {
      items: [
        { prompt: 'What are human resources?', answer: 'the people who work to produce goods and services', type: 'open', acceptedKeywords: ['people', 'work', 'produce', 'labor', 'worker', 'skill'] },
        { prompt: 'Why are human resources important?', answer: 'because people use their skills and labor to create things', type: 'open', acceptedKeywords: ['skill', 'labor', 'create', 'work', 'produce', 'important'] },
        { prompt: 'How can education improve human resources?', answer: 'by giving people more skills and knowledge', type: 'open', acceptedKeywords: ['skill', 'knowledge', 'learn', 'train', 'better', 'improve'] },
        { prompt: 'Is a teacher a human resource?', answer: 'yes', type: 'exact' },
        { prompt: 'Name three workers who are human resources.', answer: 'teachers doctors and builders', type: 'open', acceptedKeywords: ['teacher', 'doctor', 'builder', 'farmer', 'engineer', 'nurse', 'driver'] },
      ],
    },
    'capital-resources': {
      items: [
        { prompt: 'What are capital resources?', answer: 'tools machines and buildings used to make goods', type: 'open', acceptedKeywords: ['tool', 'machine', 'building', 'make', 'equipment', 'factory'] },
        { prompt: 'Is a hammer a capital resource?', answer: 'yes', type: 'exact' },
        { prompt: 'Is a factory a capital resource?', answer: 'yes', type: 'exact' },
        { prompt: 'Name three capital resources.', answer: 'computers trucks and factories', type: 'open', acceptedKeywords: ['computer', 'truck', 'factory', 'machine', 'tool', 'oven', 'tractor'] },
        { prompt: 'Why do businesses need capital resources?', answer: 'to make products and provide services efficiently', type: 'open', acceptedKeywords: ['make', 'product', 'efficient', 'produce', 'work', 'help'] },
      ],
    },
    'why-specialize': {
      items: [
        { prompt: 'What is specialization?', answer: 'when people or regions focus on producing specific goods or services', type: 'open', acceptedKeywords: ['focus', 'specific', 'one thing', 'best', 'particular', 'good at'] },
        { prompt: 'Why do people specialize?', answer: 'because they can produce more and better when they focus', type: 'open', acceptedKeywords: ['more', 'better', 'focus', 'efficient', 'expert', 'faster'] },
        { prompt: 'Is a dentist specialized?', answer: 'yes they specialize in teeth', type: 'open', acceptedKeywords: ['yes', 'teeth', 'dental', 'speciali'] },
        { prompt: 'What is the benefit of specialization?', answer: 'people get better at their job and produce more', type: 'open', acceptedKeywords: ['better', 'more', 'efficient', 'expert', 'quality', 'faster'] },
        { prompt: 'If everyone specialized in only one thing, what would they need to do?', answer: 'trade with others for things they do not make', type: 'open', acceptedKeywords: ['trade', 'others', 'buy', 'exchange', 'depend'] },
      ],
    },
    'interdependence': {
      items: [
        { prompt: 'What is interdependence?', answer: 'when people depend on each other for goods and services', type: 'open', acceptedKeywords: ['depend', 'each other', 'need', 'rely', 'together'] },
        { prompt: 'Why are farmers and bakers interdependent?', answer: 'farmers grow wheat and bakers need wheat to make bread', type: 'open', acceptedKeywords: ['farmer', 'wheat', 'baker', 'bread', 'need', 'grow'] },
        { prompt: 'Are countries interdependent?', answer: 'yes countries trade with each other', type: 'open', acceptedKeywords: ['yes', 'trade', 'import', 'export', 'depend'] },
        { prompt: 'What would happen if everyone tried to make everything themselves?', answer: 'it would be inefficient and we would have fewer and worse products', type: 'open', acceptedKeywords: ['inefficient', 'fewer', 'worse', 'hard', 'difficult', 'slow', 'less'] },
        { prompt: 'How does interdependence connect to specialization?', answer: 'people specialize in what they do best and trade for the rest', type: 'open', acceptedKeywords: ['speciali', 'trade', 'best', 'rest', 'need', 'others'] },
      ],
    },
    'why-save': {
      items: [
        { prompt: 'What does it mean to save money?', answer: 'to keep money instead of spending it right away', type: 'open', acceptedKeywords: ['keep', 'not spend', 'later', 'hold', 'set aside'] },
        { prompt: 'Why is saving money important?', answer: 'to buy bigger things later or have money for emergencies', type: 'open', acceptedKeywords: ['bigger', 'later', 'emergency', 'future', 'goal', 'safe'] },
        { prompt: 'Where can you save money safely?', answer: 'in a bank or savings account', type: 'open', acceptedKeywords: ['bank', 'savings', 'account'] },
        { prompt: 'If you earn $5 a week and save $2, how much will you have saved after 4 weeks?', answer: '$8', type: 'open', acceptedKeywords: ['8', 'eight'] },
        { prompt: 'What is a savings goal?', answer: 'a specific thing you are saving money to buy', type: 'open', acceptedKeywords: ['specific', 'thing', 'buy', 'goal', 'target', 'save for'] },
      ],
    },
    'saving-vs-spending': {
      items: [
        { prompt: 'What is the difference between saving and spending?', answer: 'saving is keeping money and spending is using it to buy things', type: 'open', acceptedKeywords: ['keep', 'use', 'buy', 'hold', 'now', 'later'] },
        { prompt: 'Is it good to save all your money and never spend?', answer: 'no you need balance between saving and spending', type: 'open', acceptedKeywords: ['no', 'balance', 'both', 'need', 'some'] },
        { prompt: 'You want a $20 toy now but also want to save for a $50 game. What should you consider?', answer: 'opportunity cost and which is more important to you', type: 'open', acceptedKeywords: ['opportunity cost', 'important', 'want more', 'choose', 'wait', 'value'] },
        { prompt: 'What is impulse spending?', answer: 'buying something without thinking about it', type: 'open', acceptedKeywords: ['without thinking', 'sudden', 'quick', 'not plan', 'spur', 'moment'] },
        { prompt: 'How can you avoid impulse spending?', answer: 'wait before buying and think about if you really need it', type: 'open', acceptedKeywords: ['wait', 'think', 'need', 'plan', 'list', 'budget'] },
      ],
    },
    'budgeting-basics': {
      items: [
        { prompt: 'What is a budget?', answer: 'a plan for how to spend and save money', type: 'open', acceptedKeywords: ['plan', 'spend', 'save', 'money', 'organize'] },
        { prompt: 'Why should you make a budget?', answer: 'to make sure you have enough money for what you need', type: 'open', acceptedKeywords: ['enough', 'need', 'track', 'plan', 'control', 'manage'] },
        { prompt: 'If you get $10 allowance and plan to save $3, spend $5 on lunch, and $2 on fun, is this a budget?', answer: 'yes it plans how to use your money', type: 'open', acceptedKeywords: ['yes', 'plan', 'budget', 'organize'] },
        { prompt: 'What happens if you spend more than you earn?', answer: 'you run out of money or go into debt', type: 'open', acceptedKeywords: ['run out', 'debt', 'borrow', 'no money', 'problem', 'owe'] },
        { prompt: 'What are the three parts of a simple budget?', answer: 'income spending and saving', type: 'open', acceptedKeywords: ['income', 'spend', 'save', 'earn', 'money in', 'money out'] },
      ],
    },
  },
};

const SCENARIOS = {
  'kindergarten': [
    { title: 'The Lemonade Stand', description: 'You want to set up a lemonade stand. What do you need? (Goods: lemons, cups, sugar. Service: making the lemonade.) How much would you charge? Why?', discussion: 'Goods vs services and basic pricing.' },
    { title: 'The Toy Store Dilemma', description: 'You have $5 in your piggy bank. At the toy store, you see a ball for $3 and a puzzle for $4. You cannot buy both. Which do you choose and why?', discussion: 'Scarcity, choices, and opportunity cost.' },
  ],
  'grade-1': [
    { title: 'The Class Store', description: 'Your class is setting up a pretend store. Each student has 10 "class dollars." There are books ($3), stickers ($1), pencils ($2), and erasers ($1). Make your shopping list. Can you get everything you want?', discussion: 'Limited resources and making choices.' },
    { title: 'The Trading Game', description: 'Everyone in class gets a different snack. Some people want what others have. How can you trade fairly? What makes a trade fair?', discussion: 'Trading, fairness, and value.' },
  ],
  'grade-2': [
    { title: 'The Pizza Party Budget', description: 'Your class has $50 for a pizza party. Large pizzas cost $12 each. Drinks cost $5 per pack. Plates and napkins cost $3. Plan a budget. How many pizzas can you afford?', discussion: 'Budgeting, scarcity, and making choices.' },
    { title: 'The Producer-Consumer Chain', description: 'Trace a chocolate bar from cocoa farm to your hand. Who are all the producers along the way? When do you become the consumer?', discussion: 'Producers, consumers, and how goods get to us.' },
  ],
  'grade-3': [
    { title: 'The Resource Hunt', description: 'Look around your classroom. Find examples of natural resources (wood desks), human resources (teacher), and capital resources (computer). How many can you identify?', discussion: 'Identifying the three types of resources.' },
    { title: 'The Savings Challenge', description: 'You want to buy a $30 video game. You earn $5 per week doing chores. If you save $3 per week and spend $2, how many weeks until you can buy it?', discussion: 'Saving, budgeting, and reaching financial goals.' },
  ],
  'grade-4': [
    { title: 'The Supply and Demand Fair', description: 'Your school has a bake sale. If everyone makes brownies, what happens to the price? What if only one person makes brownies? How does supply and demand affect price?', discussion: 'Supply, demand, and price.' },
  ],
  'grade-5': [
    { title: 'The Financial Plan', description: 'You get $100 for your birthday. Create a plan: How much will you save? Spend? Give? What are your priorities?', discussion: 'Financial literacy and personal values.' },
  ],
  'grade-6': [
    { title: 'The Island Economy', description: 'You are stranded on an island with 10 people. Design an economic system. Will you barter? Create money? Who decides who does what? Compare your system to traditional, market, and command economies.', discussion: 'Economic systems and their trade-offs.' },
  ],
  'grade-7': [
    { title: 'The Business Plan', description: 'Design a business. What will you sell? What are your costs? How will you set prices? What is your competition? Create a basic business plan.', discussion: 'Entrepreneurship, market structures, and financial planning.' },
  ],
  'grade-8': [
    { title: 'The Economic Policy Debate', description: 'The country is in a recession. One group argues for tax cuts and less government spending. Another argues for more government spending on infrastructure. Debate both sides using economic evidence.', discussion: 'Fiscal policy, macroeconomics, and evidence-based argument.' },
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

class Economics {
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
        review: 'Review previously learned economics concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: scenario ? `Economic scenario: "${scenario.title}"` : 'Apply concepts to a real-world decision',
        reflect: 'What economic choice did you think about today?',
      },
    };
  }
}

module.exports = Economics;

// CLI: node economics.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new Economics();
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
      default: out({ usage: 'node economics.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','scenario'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
