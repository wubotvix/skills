// eClaw Current Events & Media Literacy Interactive Tutor (K-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'socialstudies-current-events');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'real-vs-pretend': ['real-and-make-believe', 'stories-vs-news'],
    'community-awareness': ['whats-happening-around-us', 'helpers-in-the-news'],
    'feelings-about-news': ['news-can-be-scary', 'finding-helpers'],
  },
  'grade-1': {
    'real-vs-pretend': ['fact-vs-fiction', 'news-vs-stories'],
    'community-news': ['local-news', 'school-news'],
    'identifying-helpers': ['heroes-in-news', 'people-making-difference'],
  },
  'grade-2': {
    'five-ws': ['who-what-when-where-why', 'finding-the-five-ws'],
    'kid-news-sources': ['reliable-kid-news', 'comparing-sources'],
    'fact-vs-opinion': ['fact-or-opinion', 'spotting-opinions'],
  },
  'grade-3': {
    'five-ws-depth': ['asking-deeper-questions', 'summarizing-news'],
    'fact-vs-opinion': ['opinion-clue-words', 'separating-fact-opinion'],
    'connecting-news': ['news-and-social-studies', 'news-and-community'],
  },
  'grade-4': {
    'source-evaluation': ['who-made-this', 'purpose-of-source', 'checking-sources'],
    'bias-intro': ['what-is-bias', 'spotting-bias'],
    'perspective': ['multiple-perspectives', 'missing-voices'],
  },
  'grade-5': {
    'source-evaluation': ['sift-method', 'lateral-reading', 'website-evaluation'],
    'bias-detection': ['loaded-language', 'bias-by-omission', 'photo-bias'],
    'historical-parallels': ['news-echoes-history', 'patterns-in-events'],
  },
  'grade-6': {
    'propaganda': ['propaganda-techniques', 'advertising-vs-news', 'emotional-appeals'],
    'digital-literacy': ['social-media-news', 'deepfakes-and-manipulation', 'digital-footprint'],
    'comparative-media': ['how-outlets-differ', 'international-perspectives'],
    'informed-opinion': ['building-informed-opinions', 'civil-discussion'],
  },
  'grade-7': {
    'media-ecosystems': ['how-news-is-made', 'business-of-news', 'citizen-journalism'],
    'algorithms': ['filter-bubbles', 'echo-chambers', 'algorithmic-bias'],
    'investigative': ['investigative-journalism', 'whistleblowers', 'freedom-of-press'],
    'news-production': ['writing-news', 'editing-and-framing', 'visual-journalism'],
  },
  'grade-8': {
    'advanced-analysis': ['rhetoric-in-media', 'logical-fallacies', 'satire-vs-news'],
    'data-literacy': ['reading-data-in-news', 'misleading-statistics', 'polls-and-surveys'],
    'citizen-journalism': ['reporting-responsibly', 'social-media-activism', 'media-ethics'],
    'media-and-democracy': ['press-and-democracy', 'censorship', 'information-access'],
  },
};

const CONTENT_BANKS = {
  'kindergarten': {
    'real-and-make-believe': {
      items: [
        { prompt: 'Is a talking dragon real or make-believe?', answer: 'make-believe', type: 'open', acceptedKeywords: ['make-believe', 'pretend', 'not real', 'fake', 'fiction'] },
        { prompt: 'Is rain falling from clouds real or make-believe?', answer: 'real', type: 'exact' },
        { prompt: 'A dog flying an airplane — real or make-believe?', answer: 'make-believe', type: 'open', acceptedKeywords: ['make-believe', 'pretend', 'not real', 'fake'] },
        { prompt: 'Firefighters helping people — real or make-believe?', answer: 'real', type: 'exact' },
        { prompt: 'How can you tell if something is real?', answer: 'you can see it touch it or someone trustworthy tells you', type: 'open', acceptedKeywords: ['see', 'touch', 'trust', 'really happen', 'proof', 'true'] },
      ],
    },
    'stories-vs-news': {
      items: [
        { prompt: 'What is the difference between a story and the news?', answer: 'news tells about real things that happened and stories can be made up', type: 'open', acceptedKeywords: ['real', 'happened', 'made up', 'true', 'fiction', 'fact'] },
        { prompt: 'Is a fairy tale news? A) Yes B) No', answer: 'b', type: 'multiple-choice' },
        { prompt: 'Where do people get news?', answer: 'TV newspaper radio or internet', type: 'open', acceptedKeywords: ['tv', 'newspaper', 'radio', 'internet', 'phone', 'computer', 'television'] },
        { prompt: 'Does news always have to be about bad things?', answer: 'no news can be about good things too', type: 'open', acceptedKeywords: ['no', 'good', 'happy', 'positive', 'both'] },
        { prompt: 'If someone tells you something happened, how can you check?', answer: 'ask a trusted adult or check a reliable source', type: 'open', acceptedKeywords: ['ask', 'adult', 'parent', 'teacher', 'check', 'source', 'trusted'] },
      ],
    },
    'whats-happening-around-us': {
      items: [
        { prompt: 'What is something that happened in your school this week?', answer: 'any school event', type: 'open', acceptedKeywords: ['school', 'class', 'recess', 'teacher', 'field', 'assembly', 'lunch'] },
        { prompt: 'Why is it good to know what is happening around you?', answer: 'to be safe and understand your community', type: 'open', acceptedKeywords: ['safe', 'understand', 'know', 'community', 'help', 'informed'] },
        { prompt: 'What is a community event?', answer: 'something that happens in your town for everyone', type: 'open', acceptedKeywords: ['town', 'everyone', 'together', 'community', 'people', 'event'] },
        { prompt: 'True or false: Only adults need to know about what happens in the world.', answer: 'false', type: 'exact' },
        { prompt: 'What is one way you learn about things happening around you?', answer: 'from parents teachers or friends', type: 'open', acceptedKeywords: ['parent', 'teacher', 'friend', 'family', 'school', 'talk', 'tell'] },
      ],
    },
    'helpers-in-the-news': {
      items: [
        { prompt: 'When there is a flood, who helps people?', answer: 'firefighters rescue workers and volunteers', type: 'open', acceptedKeywords: ['firefight', 'rescue', 'volunteer', 'police', 'coast guard', 'helper'] },
        { prompt: 'When something bad happens, why should we look for the helpers?', answer: 'because helpers show us that people care and want to fix things', type: 'open', acceptedKeywords: ['care', 'fix', 'help', 'good', 'hope', 'kind', 'better'] },
        { prompt: 'Name someone who helps in your community every day.', answer: 'teachers doctors police or firefighters', type: 'open', acceptedKeywords: ['teacher', 'doctor', 'police', 'firefight', 'nurse', 'mail', 'bus'] },
        { prompt: 'True or false: There are always helpers when something bad happens.', answer: 'true', type: 'exact' },
        { prompt: 'How can YOU be a helper?', answer: 'by being kind and helping others', type: 'open', acceptedKeywords: ['kind', 'help', 'share', 'care', 'volunteer', 'donate'] },
      ],
    },
    'news-can-be-scary': {
      items: [
        { prompt: 'Is it normal to feel scared when you hear bad news?', answer: 'yes it is a normal feeling', type: 'open', acceptedKeywords: ['yes', 'normal', 'okay', 'natural', 'fine'] },
        { prompt: 'What should you do if news makes you feel scared?', answer: 'talk to a trusted adult about your feelings', type: 'open', acceptedKeywords: ['talk', 'adult', 'parent', 'teacher', 'feel', 'trusted'] },
        { prompt: 'True or false: Most of the world is actually safe most of the time.', answer: 'true', type: 'exact' },
        { prompt: 'Why do news shows often show scary things?', answer: 'because unusual and dramatic events get more attention', type: 'open', acceptedKeywords: ['attention', 'unusual', 'dramatic', 'interest', 'watch', 'important'] },
        { prompt: 'What is one thing that makes you feel safe?', answer: 'family friends home or school', type: 'open', acceptedKeywords: ['family', 'friend', 'home', 'school', 'parent', 'safe', 'love', 'teacher'] },
      ],
    },
    'finding-helpers': {
      items: [
        { prompt: 'Mr. Rogers said: "Look for the helpers." What did he mean?', answer: 'when bad things happen there are always people helping', type: 'open', acceptedKeywords: ['help', 'people', 'bad', 'happen', 'always', 'good'] },
        { prompt: 'After a storm, who are the helpers?', answer: 'rescue workers neighbors and volunteers', type: 'open', acceptedKeywords: ['rescue', 'neighbor', 'volunteer', 'firefight', 'police', 'helper'] },
        { prompt: 'Can kids be helpers too?', answer: 'yes', type: 'open', acceptedKeywords: ['yes'] },
        { prompt: 'How do helpers make things better?', answer: 'they fix problems help people and keep everyone safe', type: 'open', acceptedKeywords: ['fix', 'help', 'safe', 'better', 'care', 'solve'] },
        { prompt: 'Name one way to help someone who is sad about bad news.', answer: 'listen to them be kind or give them a hug', type: 'open', acceptedKeywords: ['listen', 'kind', 'hug', 'talk', 'comfort', 'friend', 'care'] },
      ],
    },
  },
  'grade-1': {
    'fact-vs-fiction': {
      items: [
        { prompt: 'What is a fact?', answer: 'something that is true and can be proven', type: 'open', acceptedKeywords: ['true', 'proven', 'real', 'happened', 'check'] },
        { prompt: 'What is fiction?', answer: 'a made up story', type: 'open', acceptedKeywords: ['made up', 'not real', 'pretend', 'story', 'imagin'] },
        { prompt: '"Cats have four legs." Fact or fiction?', answer: 'fact', type: 'exact' },
        { prompt: '"A cat flew to the moon." Fact or fiction?', answer: 'fiction', type: 'exact' },
        { prompt: 'How can you check if something is a fact?', answer: 'look it up in a book or ask a trusted adult', type: 'open', acceptedKeywords: ['look', 'book', 'ask', 'check', 'adult', 'source', 'trusted'] },
      ],
    },
    'news-vs-stories': {
      items: [
        { prompt: 'News is about things that really ___. A) might happen B) happened C) are make-believe', answer: 'b', type: 'multiple-choice' },
        { prompt: 'A story about a magic carpet is: A) News B) Fiction', answer: 'b', type: 'multiple-choice' },
        { prompt: 'A report about a new park opening is: A) News B) Fiction', answer: 'a', type: 'multiple-choice' },
        { prompt: 'Why is it important to know the difference between news and stories?', answer: 'so you know what is real and what is made up', type: 'open', acceptedKeywords: ['real', 'made up', 'true', 'know', 'difference', 'believe'] },
        { prompt: 'Where can you find real news?', answer: 'newspapers TV news and trusted websites', type: 'open', acceptedKeywords: ['newspaper', 'tv', 'website', 'radio', 'trusted'] },
      ],
    },
    'local-news': {
      items: [
        { prompt: 'What is local news?', answer: 'news about things happening in your town or city', type: 'open', acceptedKeywords: ['town', 'city', 'local', 'community', 'neighborhood', 'near'] },
        { prompt: 'Give an example of local news.', answer: 'a new store opening or a community event', type: 'open', acceptedKeywords: ['store', 'event', 'school', 'park', 'road', 'weather', 'community'] },
        { prompt: 'Why is local news important?', answer: 'it tells you about things that affect your daily life', type: 'open', acceptedKeywords: ['affect', 'daily', 'life', 'know', 'community', 'matter', 'near'] },
        { prompt: 'Who reports local news?', answer: 'local reporters and journalists', type: 'open', acceptedKeywords: ['reporter', 'journalist', 'newspaper', 'tv', 'station'] },
        { prompt: 'Is local news more or less important than national news?', answer: 'both are important in different ways', type: 'open', acceptedKeywords: ['both', 'important', 'different'] },
      ],
    },
    'school-news': {
      items: [
        { prompt: 'What could be in a school newspaper?', answer: 'sports results events and student achievements', type: 'open', acceptedKeywords: ['sport', 'event', 'student', 'achievement', 'class', 'lunch', 'field trip'] },
        { prompt: 'Who can report school news?', answer: 'students and teachers', type: 'open', acceptedKeywords: ['student', 'teacher', 'kid', 'anyone'] },
        { prompt: 'Is school news real news?', answer: 'yes it reports real events at school', type: 'open', acceptedKeywords: ['yes', 'real', 'true', 'happened'] },
        { prompt: 'Why would you want to know school news?', answer: 'to know what is happening at your school', type: 'open', acceptedKeywords: ['know', 'happening', 'school', 'involved', 'informed', 'events'] },
        { prompt: 'What is one piece of news from your school this week?', answer: 'any school event', type: 'open', acceptedKeywords: ['school', 'class', 'teacher', 'game', 'test', 'project', 'field'] },
      ],
    },
    'heroes-in-news': {
      items: [
        { prompt: 'What makes someone a hero in the news?', answer: 'they help others often at risk to themselves', type: 'open', acceptedKeywords: ['help', 'others', 'brave', 'risk', 'save', 'kind', 'courage'] },
        { prompt: 'Does a hero have to be famous?', answer: 'no ordinary people can be heroes', type: 'open', acceptedKeywords: ['no', 'ordinary', 'anyone', 'everyday', 'regular'] },
        { prompt: 'Name a quality that heroes have.', answer: 'bravery kindness or selflessness', type: 'open', acceptedKeywords: ['brave', 'kind', 'selfless', 'courage', 'caring', 'help'] },
        { prompt: 'Can kids be heroes?', answer: 'yes', type: 'open', acceptedKeywords: ['yes'] },
        { prompt: 'Why do news stories about heroes matter?', answer: 'they inspire us to be good and help others', type: 'open', acceptedKeywords: ['inspir', 'good', 'help', 'hope', 'show', 'positive', 'motivat'] },
      ],
    },
    'people-making-difference': {
      items: [
        { prompt: 'What does it mean to make a difference?', answer: 'doing something that changes things for the better', type: 'open', acceptedKeywords: ['change', 'better', 'help', 'improv', 'positive', 'good'] },
        { prompt: 'Name one person who made a difference in history.', answer: 'martin luther king jr rosa parks or anyone notable', type: 'open', acceptedKeywords: ['king', 'rosa', 'parks', 'gandhi', 'lincoln', 'mandela', 'any name'] },
        { prompt: 'Can one person really make a difference?', answer: 'yes one person can start a movement or help many people', type: 'open', acceptedKeywords: ['yes', 'one', 'start', 'help', 'change', 'movement'] },
        { prompt: 'How can you make a difference in your community?', answer: 'by volunteering being kind or speaking up', type: 'open', acceptedKeywords: ['volunteer', 'kind', 'speak', 'help', 'clean', 'donate', 'stand'] },
        { prompt: 'Why are stories about people making a difference important?', answer: 'they show that positive change is possible', type: 'open', acceptedKeywords: ['positive', 'change', 'possible', 'inspir', 'hope', 'show', 'motivat'] },
      ],
    },
  },
  'grade-2': {
    'who-what-when-where-why': {
      items: [
        { prompt: 'What are the 5 W\'s?', answer: 'who what when where why', type: 'open', acceptedKeywords: ['who', 'what', 'when', 'where', 'why'] },
        { prompt: 'A news story says "Firefighters rescued a cat from a tree yesterday at the park." What is the WHO?', answer: 'firefighters', type: 'open', acceptedKeywords: ['firefight'] },
        { prompt: 'In the same story, what is the WHAT?', answer: 'rescued a cat from a tree', type: 'open', acceptedKeywords: ['rescued', 'cat', 'tree', 'saved'] },
        { prompt: 'In the same story, what is the WHEN?', answer: 'yesterday', type: 'open', acceptedKeywords: ['yesterday'] },
        { prompt: 'Why are the 5 W\'s important for understanding news?', answer: 'they help you understand the complete story', type: 'open', acceptedKeywords: ['understand', 'complete', 'story', 'information', 'full', 'know', 'detail'] },
      ],
    },
    'finding-the-five-ws': {
      items: [
        { prompt: '"The mayor opened a new library on Main Street on Monday to give kids more books." Find the WHO.', answer: 'the mayor', type: 'open', acceptedKeywords: ['mayor'] },
        { prompt: 'In the same story, find the WHAT.', answer: 'opened a new library', type: 'open', acceptedKeywords: ['opened', 'library', 'new'] },
        { prompt: 'Find the WHERE.', answer: 'main street', type: 'open', acceptedKeywords: ['main street'] },
        { prompt: 'Find the WHEN.', answer: 'monday', type: 'open', acceptedKeywords: ['monday'] },
        { prompt: 'Find the WHY.', answer: 'to give kids more books', type: 'open', acceptedKeywords: ['kids', 'books', 'give', 'more', 'read'] },
      ],
    },
    'reliable-kid-news': {
      items: [
        { prompt: 'Name a news source made for kids.', answer: 'newsela scholastic news or time for kids', type: 'open', acceptedKeywords: ['newsela', 'scholastic', 'time for kids', 'dogo', 'cnn 10'] },
        { prompt: 'Why are kid news sources helpful?', answer: 'they explain news in a way kids can understand', type: 'open', acceptedKeywords: ['understand', 'kid', 'explain', 'simple', 'age', 'appropriate'] },
        { prompt: 'Is everything on the internet true? A) Yes B) No', answer: 'b', type: 'multiple-choice' },
        { prompt: 'Who should you ask if you are not sure a news source is reliable?', answer: 'a parent teacher or librarian', type: 'open', acceptedKeywords: ['parent', 'teacher', 'librarian', 'adult', 'trusted'] },
        { prompt: 'What makes a news source reliable?', answer: 'it checks facts uses real reporters and corrects mistakes', type: 'open', acceptedKeywords: ['fact', 'check', 'reporter', 'correct', 'trust', 'real', 'true'] },
      ],
    },
    'comparing-sources': {
      items: [
        { prompt: 'Why should you check more than one source?', answer: 'to make sure the information is accurate', type: 'open', acceptedKeywords: ['accurate', 'sure', 'correct', 'true', 'check', 'verify', 'compare'] },
        { prompt: 'If two sources say the same thing, is it more likely to be true?', answer: 'yes', type: 'open', acceptedKeywords: ['yes', 'likely', 'more', 'probably'] },
        { prompt: 'What if two sources disagree?', answer: 'look for more sources and think about which is more reliable', type: 'open', acceptedKeywords: ['more', 'source', 'reliable', 'check', 'find', 'think', 'research'] },
        { prompt: 'Is a friend\'s opinion the same as a news source?', answer: 'no a news source should use facts', type: 'open', acceptedKeywords: ['no', 'fact', 'different', 'opinion', 'source'] },
        { prompt: 'What does "verify" mean?', answer: 'to check if something is true', type: 'open', acceptedKeywords: ['check', 'true', 'confirm', 'make sure', 'prove'] },
      ],
    },
    'fact-or-opinion': {
      items: [
        { prompt: 'What is the difference between a fact and an opinion?', answer: 'a fact can be proven and an opinion is what someone thinks', type: 'open', acceptedKeywords: ['proven', 'think', 'feel', 'check', 'believe', 'true'] },
        { prompt: '"Dogs have four legs." Fact or opinion?', answer: 'fact', type: 'exact' },
        { prompt: '"Dogs are the best pets." Fact or opinion?', answer: 'opinion', type: 'exact' },
        { prompt: '"The earth revolves around the sun." Fact or opinion?', answer: 'fact', type: 'exact' },
        { prompt: '"Summer is the best season." Fact or opinion?', answer: 'opinion', type: 'exact' },
      ],
    },
    'spotting-opinions': {
      items: [
        { prompt: 'What words often signal an opinion?', answer: 'I think I feel best worst should', type: 'open', acceptedKeywords: ['think', 'feel', 'best', 'worst', 'should', 'believe', 'probably', 'favorite'] },
        { prompt: '"I think pizza is delicious." Is this a fact or opinion?', answer: 'opinion', type: 'exact' },
        { prompt: '"The temperature is 75 degrees." Fact or opinion?', answer: 'fact', type: 'exact' },
        { prompt: '"Everyone should recycle." Fact or opinion?', answer: 'opinion', type: 'exact' },
        { prompt: 'Can a news article contain both facts and opinions?', answer: 'yes and you should be able to tell them apart', type: 'open', acceptedKeywords: ['yes', 'both', 'tell', 'apart', 'identify', 'separate'] },
      ],
    },
  },
  'grade-3': {
    'asking-deeper-questions': {
      items: [
        { prompt: 'After reading a news article, what question should you ask besides the 5 W\'s?', answer: 'how do I know this is true or what is the source', type: 'open', acceptedKeywords: ['true', 'source', 'reliable', 'proof', 'evidence', 'how', 'know'] },
        { prompt: 'What is a follow-up question?', answer: 'a question that digs deeper into the story', type: 'open', acceptedKeywords: ['deeper', 'more', 'follow', 'next', 'detail', 'dig', 'learn'] },
        { prompt: 'A story says a new playground is being built. What deeper question could you ask?', answer: 'who is paying for it or when will it be finished', type: 'open', acceptedKeywords: ['pay', 'cost', 'when', 'finish', 'why', 'where', 'who decided'] },
        { prompt: 'Why is asking questions about news important?', answer: 'to understand the full story and think critically', type: 'open', acceptedKeywords: ['understand', 'full', 'critical', 'think', 'complete', 'informed'] },
        { prompt: 'What is the most important question to ask about any news?', answer: 'is this true and how do I know', type: 'open', acceptedKeywords: ['true', 'know', 'proof', 'evidence', 'reliable', 'source'] },
      ],
    },
    'summarizing-news': {
      items: [
        { prompt: 'What is a summary?', answer: 'a short version that includes the main points', type: 'open', acceptedKeywords: ['short', 'main', 'point', 'brief', 'important', 'key'] },
        { prompt: 'What should a news summary include?', answer: 'the 5 Ws who what when where and why', type: 'open', acceptedKeywords: ['who', 'what', 'when', 'where', 'why', '5 w'] },
        { prompt: 'Should a summary include every detail?', answer: 'no just the most important information', type: 'open', acceptedKeywords: ['no', 'important', 'main', 'key', 'not every'] },
        { prompt: 'How long should a good summary be?', answer: 'a few sentences', type: 'open', acceptedKeywords: ['few', 'sentence', 'short', 'brief', 'paragraph'] },
        { prompt: 'Why is summarizing news a useful skill?', answer: 'it helps you understand and remember the key information', type: 'open', acceptedKeywords: ['understand', 'remember', 'key', 'important', 'communicate', 'share'] },
      ],
    },
    'opinion-clue-words': {
      items: [
        { prompt: 'List 3 words that signal an opinion.', answer: 'think believe should best worst probably', type: 'open', acceptedKeywords: ['think', 'believe', 'should', 'best', 'worst', 'probably', 'feel', 'favorite'] },
        { prompt: '"Schools should start later." Is this a fact or opinion?', answer: 'opinion', type: 'exact' },
        { prompt: '"The fastest animal is the cheetah." Fact or opinion?', answer: 'fact', type: 'exact' },
        { prompt: '"I believe reading is the most important skill." Spot the clue word.', answer: 'believe', type: 'open', acceptedKeywords: ['believe'] },
        { prompt: '"This is the best movie ever made." How many opinion clue words are there?', answer: 'one or two — best and ever', type: 'open', acceptedKeywords: ['best', 'one', 'two', '1', '2'] },
      ],
    },
    'separating-fact-opinion': {
      items: [
        { prompt: '"George Washington was the first president." Fact or opinion?', answer: 'fact', type: 'exact' },
        { prompt: '"George Washington was the greatest president." Fact or opinion?', answer: 'opinion', type: 'exact' },
        { prompt: 'How can you test if something is a fact?', answer: 'check if it can be proven or verified with evidence', type: 'open', acceptedKeywords: ['proven', 'verified', 'evidence', 'check', 'confirm', 'source', 'test'] },
        { prompt: 'Can opinions be valuable even though they are not facts?', answer: 'yes opinions can be well-informed and helpful', type: 'open', acceptedKeywords: ['yes', 'valuable', 'helpful', 'informed', 'important', 'perspective'] },
        { prompt: 'Why is it dangerous to confuse opinions with facts?', answer: 'you might believe something that is not true', type: 'open', acceptedKeywords: ['believe', 'not true', 'misled', 'wrong', 'confused', 'mislead'] },
      ],
    },
    'news-and-social-studies': {
      items: [
        { prompt: 'How does current events connect to social studies?', answer: 'current events show social studies concepts in real life', type: 'open', acceptedKeywords: ['real life', 'connect', 'social studies', 'history', 'government', 'geography'] },
        { prompt: 'A news story about an election connects to which social studies topic?', answer: 'civics and government', type: 'open', acceptedKeywords: ['civic', 'government', 'democracy', 'voting'] },
        { prompt: 'A story about trade between countries connects to what?', answer: 'economics or geography', type: 'open', acceptedKeywords: ['economic', 'geography', 'trade', 'global'] },
        { prompt: 'Why should students follow current events?', answer: 'to be informed citizens and understand the world', type: 'open', acceptedKeywords: ['informed', 'citizen', 'understand', 'world', 'know', 'important'] },
        { prompt: 'How is history connected to current events?', answer: 'current events are shaped by history and will become history', type: 'open', acceptedKeywords: ['shaped', 'history', 'past', 'become', 'connect', 'repeat', 'learn'] },
      ],
    },
    'news-and-community': {
      items: [
        { prompt: 'How does local news affect your community?', answer: 'it informs people about local issues decisions and events', type: 'open', acceptedKeywords: ['inform', 'issue', 'decision', 'event', 'local', 'know', 'affect'] },
        { prompt: 'Why should communities pay attention to news?', answer: 'to participate in decisions that affect them', type: 'open', acceptedKeywords: ['participat', 'decision', 'affect', 'involved', 'informed', 'vote'] },
        { prompt: 'Can news help solve community problems?', answer: 'yes by making people aware of problems and inspiring action', type: 'open', acceptedKeywords: ['yes', 'aware', 'action', 'inspire', 'solve', 'attention'] },
        { prompt: 'What is a town hall meeting?', answer: 'a public meeting where community members discuss issues', type: 'open', acceptedKeywords: ['public', 'meeting', 'community', 'discuss', 'issue', 'voice'] },
        { prompt: 'How can YOU stay informed about your community?', answer: 'read local news attend events and talk to neighbors', type: 'open', acceptedKeywords: ['read', 'news', 'attend', 'event', 'talk', 'neighbor', 'local'] },
      ],
    },
  },
  'grade-4': {
    'who-made-this': {
      items: [
        { prompt: 'Why is it important to know who created a news source?', answer: 'because the creator\'s identity can affect the information included', type: 'open', acceptedKeywords: ['creator', 'affect', 'information', 'bias', 'perspective', 'who', 'trust'] },
        { prompt: 'What is the difference between a reporter and a blogger?', answer: 'reporters follow journalism standards while bloggers may share personal opinions', type: 'open', acceptedKeywords: ['reporter', 'standard', 'blogger', 'opinion', 'journalism', 'fact', 'personal'] },
        { prompt: 'If a toy company writes a news article about toys, should you be cautious?', answer: 'yes they may have a bias toward promoting their own products', type: 'open', acceptedKeywords: ['yes', 'bias', 'promot', 'product', 'sell', 'interest', 'cautious'] },
        { prompt: 'What questions should you ask about who made a source?', answer: 'who are they what is their expertise and what is their purpose', type: 'open', acceptedKeywords: ['who', 'expert', 'purpose', 'qualif', 'why', 'credib'] },
        { prompt: 'Is a source from a university more reliable than one from an anonymous website?', answer: 'generally yes because universities have standards for accuracy', type: 'open', acceptedKeywords: ['yes', 'university', 'standard', 'accura', 'trust', 'reliable'] },
        { prompt: 'What is an expert source?', answer: 'someone who has deep knowledge about a specific topic', type: 'open', acceptedKeywords: ['deep', 'knowledge', 'specific', 'topic', 'trained', 'studied', 'profession'] },
      ],
    },
    'purpose-of-source': {
      items: [
        { prompt: 'What are the main purposes of a news source?', answer: 'to inform persuade entertain or sell something', type: 'open', acceptedKeywords: ['inform', 'persuad', 'entertain', 'sell', 'purpose'] },
        { prompt: 'How can you tell if a source is trying to persuade you?', answer: 'it uses emotional language and presents only one side', type: 'open', acceptedKeywords: ['emotional', 'language', 'one side', 'persuad', 'opinion', 'convinc'] },
        { prompt: 'What is the purpose of an advertisement?', answer: 'to convince you to buy or support something', type: 'open', acceptedKeywords: ['buy', 'support', 'convinc', 'sell', 'product', 'persuad'] },
        { prompt: 'What is the purpose of a news report?', answer: 'to inform the public about events using facts', type: 'open', acceptedKeywords: ['inform', 'public', 'event', 'fact', 'report', 'tell'] },
        { prompt: 'Can one source have more than one purpose?', answer: 'yes a source can both inform and entertain', type: 'open', acceptedKeywords: ['yes', 'both', 'more than one', 'multiple', 'combin'] },
        { prompt: 'Why does knowing a source\'s purpose help you evaluate it?', answer: 'because the purpose affects what information is included or left out', type: 'open', acceptedKeywords: ['affect', 'information', 'include', 'left out', 'bias', 'trust', 'evaluat'] },
      ],
    },
    'checking-sources': {
      items: [
        { prompt: 'What are three things to check about a news source?', answer: 'who made it when was it made and is it supported by other sources', type: 'open', acceptedKeywords: ['who', 'when', 'other sources', 'check', 'author', 'date', 'verify'] },
        { prompt: 'Why should you check the date of a news article?', answer: 'because information can become outdated', type: 'open', acceptedKeywords: ['outdate', 'old', 'change', 'new', 'date', 'current', 'time'] },
        { prompt: 'What does it mean to verify information?', answer: 'to check that it is true by finding it in other reliable sources', type: 'open', acceptedKeywords: ['check', 'true', 'other', 'reliable', 'source', 'confirm', 'verify'] },
        { prompt: 'If you can only find a claim in one source, what should you do?', answer: 'be cautious and look for more sources to confirm it', type: 'open', acceptedKeywords: ['cautious', 'more', 'source', 'confirm', 'careful', 'skeptic', 'look'] },
        { prompt: 'What is a credible source?', answer: 'a source that is trustworthy and based on evidence', type: 'open', acceptedKeywords: ['trustworthy', 'evidence', 'reliable', 'credible', 'accurate', 'fact'] },
        { prompt: 'Why do reliable news organizations issue corrections?', answer: 'to fix mistakes and maintain their credibility', type: 'open', acceptedKeywords: ['fix', 'mistake', 'credibil', 'correct', 'accura', 'trust', 'honest'] },
      ],
    },
    'what-is-bias': {
      items: [
        { prompt: 'What is bias?', answer: 'a tendency to favor one perspective over others', type: 'open', acceptedKeywords: ['favor', 'perspective', 'one side', 'tendency', 'lean', 'unfair'] },
        { prompt: 'Does everyone have some bias?', answer: 'yes all people have biases based on their experiences', type: 'open', acceptedKeywords: ['yes', 'all', 'everyone', 'experience', 'background', 'natural'] },
        { prompt: 'How can bias affect a news story?', answer: 'it can change what facts are included and how the story is told', type: 'open', acceptedKeywords: ['fact', 'include', 'change', 'story', 'told', 'perspective', 'affect'] },
        { prompt: 'Can a news source be biased and still contain facts?', answer: 'yes a source can have true facts but present them in a biased way', type: 'open', acceptedKeywords: ['yes', 'true', 'fact', 'present', 'biased', 'still'] },
        { prompt: 'What is confirmation bias?', answer: 'the tendency to believe information that matches what you already think', type: 'open', acceptedKeywords: ['already think', 'believe', 'match', 'agree', 'tend', 'confirm'] },
        { prompt: 'How can you reduce the effect of bias on your understanding?', answer: 'by reading multiple sources with different perspectives', type: 'open', acceptedKeywords: ['multiple', 'source', 'different', 'perspective', 'read', 'compare', 'variety'] },
      ],
    },
    'spotting-bias': {
      items: [
        { prompt: 'What clues suggest a news source might be biased?', answer: 'emotional language one-sided arguments and missing viewpoints', type: 'open', acceptedKeywords: ['emotional', 'language', 'one-sided', 'missing', 'viewpoint', 'opinion'] },
        { prompt: 'A headline says "Amazing New Policy Saves the Day!" Is this showing bias?', answer: 'yes the word amazing shows a positive bias', type: 'open', acceptedKeywords: ['yes', 'amazing', 'positive', 'bias', 'opinion', 'loaded'] },
        { prompt: 'What is loaded language?', answer: 'words chosen to create an emotional reaction rather than inform', type: 'open', acceptedKeywords: ['emotional', 'reaction', 'words', 'chosen', 'influence', 'manipulat', 'feeling'] },
        { prompt: 'How can photos be used to show bias?', answer: 'by choosing photos that make someone look good or bad', type: 'open', acceptedKeywords: ['choose', 'photo', 'good', 'bad', 'angle', 'select', 'manipulat'] },
        { prompt: 'What is the difference between a news article and an editorial?', answer: 'a news article reports facts while an editorial shares opinions', type: 'open', acceptedKeywords: ['news', 'fact', 'editorial', 'opinion', 'report', 'share'] },
        { prompt: 'If a story only interviews people from one side, what kind of bias is that?', answer: 'bias by omission — leaving out important perspectives', type: 'open', acceptedKeywords: ['omission', 'leaving out', 'one side', 'missing', 'perspective', 'incomplete'] },
      ],
    },
    'multiple-perspectives': {
      items: [
        { prompt: 'Why is it important to hear multiple perspectives on a news story?', answer: 'because different people experience the same event differently', type: 'open', acceptedKeywords: ['different', 'experience', 'event', 'perspective', 'understand', 'complete'] },
        { prompt: 'A new park is built. Who might have different perspectives about it?', answer: 'neighbors businesses environmentalists and city officials', type: 'open', acceptedKeywords: ['neighbor', 'business', 'environment', 'city', 'official', 'children', 'different'] },
        { prompt: 'How can reading different perspectives make you a better citizen?', answer: 'it helps you understand issues fully and make informed decisions', type: 'open', acceptedKeywords: ['understand', 'fully', 'informed', 'decision', 'complete', 'better'] },
        { prompt: 'What does "there are two sides to every story" mean?', answer: 'every situation can be seen from different viewpoints', type: 'open', acceptedKeywords: ['different', 'viewpoint', 'side', 'situation', 'perspective', 'see'] },
        { prompt: 'How can you find multiple perspectives on a topic?', answer: 'read different news sources and talk to different people', type: 'open', acceptedKeywords: ['different', 'news', 'source', 'talk', 'people', 'read', 'variety'] },
        { prompt: 'Is any single perspective ever the complete truth?', answer: 'no each perspective only shows part of the whole picture', type: 'open', acceptedKeywords: ['no', 'part', 'whole', 'incomplete', 'partial', 'not complete'] },
      ],
    },
    'missing-voices': {
      items: [
        { prompt: 'What does it mean when voices are "missing" from a story?', answer: 'some people affected by the story were not included or quoted', type: 'open', acceptedKeywords: ['not included', 'affected', 'people', 'left out', 'miss', 'not heard', 'absent'] },
        { prompt: 'Whose voices are often missing from news stories?', answer: 'children minorities immigrants and people in poverty', type: 'open', acceptedKeywords: ['children', 'minorit', 'immigrant', 'poverty', 'marginal', 'underrepresent'] },
        { prompt: 'Why does it matter if certain voices are missing?', answer: 'the story becomes incomplete and may not represent the full truth', type: 'open', acceptedKeywords: ['incomplete', 'full', 'truth', 'matter', 'represent', 'miss', 'unfair'] },
        { prompt: 'How can you identify missing voices in a news story?', answer: 'ask who is affected but not quoted or represented', type: 'open', acceptedKeywords: ['affected', 'not quoted', 'represent', 'who', 'ask', 'miss'] },
        { prompt: 'What can journalists do to include more voices?', answer: 'interview diverse sources and seek out underrepresented perspectives', type: 'open', acceptedKeywords: ['diverse', 'source', 'interview', 'underrepresent', 'seek', 'include'] },
        { prompt: 'How can citizen journalism help include missing voices?', answer: 'ordinary people can share their own stories and experiences', type: 'open', acceptedKeywords: ['ordinary', 'people', 'share', 'story', 'experience', 'their own', 'citizen'] },
      ],
    },
  },
  'grade-5': {
    'sift-method': {
      items: [
        { prompt: 'What does SIFT stand for?', answer: 'Stop Investigate the source Find better coverage Trace claims', type: 'open', acceptedKeywords: ['Stop', 'Investigate', 'Find', 'Trace', 'source', 'coverage', 'claim'] },
        { prompt: 'Why is the first step of SIFT to "Stop"?', answer: 'to avoid reacting emotionally and sharing misinformation', type: 'open', acceptedKeywords: ['react', 'emotional', 'misinformation', 'pause', 'think', 'share', 'stop'] },
        { prompt: 'What does "Investigate the source" mean?', answer: 'find out who published the information and if they are credible', type: 'open', acceptedKeywords: ['who', 'published', 'credible', 'reliable', 'source', 'find out'] },
        { prompt: 'What does "Find better coverage" mean?', answer: 'look for the same story from other trusted news sources', type: 'open', acceptedKeywords: ['other', 'trusted', 'source', 'same story', 'look', 'compare'] },
        { prompt: 'What does "Trace claims" mean?', answer: 'find the original source of a claim to check its accuracy', type: 'open', acceptedKeywords: ['original', 'source', 'claim', 'check', 'accura', 'trace', 'where'] },
        { prompt: 'When should you use the SIFT method?', answer: 'anytime you encounter a claim that seems surprising or too good to be true', type: 'open', acceptedKeywords: ['surprising', 'encounter', 'claim', 'anytime', 'question', 'unsure'] },
      ],
    },
    'lateral-reading': {
      items: [
        { prompt: 'What is lateral reading?', answer: 'checking what other sources say about a website or claim instead of just reading the site itself', type: 'open', acceptedKeywords: ['other sources', 'check', 'website', 'claim', 'outside', 'different'] },
        { prompt: 'Why is lateral reading better than just reading one website carefully?', answer: 'because a biased site can look professional but other sources reveal the truth', type: 'open', acceptedKeywords: ['biased', 'professional', 'other', 'source', 'truth', 'reveal', 'outside'] },
        { prompt: 'How do fact-checkers use lateral reading?', answer: 'they open new tabs to see what other sources say about the same claim', type: 'open', acceptedKeywords: ['new tab', 'other sources', 'claim', 'check', 'compare', 'verify'] },
        { prompt: 'If a website claims a scientific breakthrough, what should you do?', answer: 'search for the claim in other reputable science sources', type: 'open', acceptedKeywords: ['search', 'other', 'reputable', 'science', 'source', 'check', 'verify'] },
        { prompt: 'What might you discover through lateral reading?', answer: 'that the source is unreliable or the claim is not supported by evidence', type: 'open', acceptedKeywords: ['unreliable', 'not supported', 'evidence', 'discover', 'false', 'biased'] },
        { prompt: 'Professional fact-checkers spend most of their time on the original site. True or false?', answer: 'false — they quickly leave to check other sources', type: 'open', acceptedKeywords: ['false', 'leave', 'other sources', 'quickly', 'lateral'] },
      ],
    },
    'website-evaluation': {
      items: [
        { prompt: 'What should you check when evaluating a website?', answer: 'the author domain purpose and when it was last updated', type: 'open', acceptedKeywords: ['author', 'domain', 'purpose', 'updated', 'date', 'who', 'when'] },
        { prompt: 'What does the domain name tell you about a website?', answer: 'it can indicate if it is a government educational commercial or organization site', type: 'open', acceptedKeywords: ['government', 'edu', 'com', 'org', 'indicate', 'type', 'domain'] },
        { prompt: 'Is a .com website always reliable?', answer: 'no anyone can create a .com website', type: 'open', acceptedKeywords: ['no', 'anyone', 'create', 'not always', 'unreliable'] },
        { prompt: 'What does .edu mean in a web address?', answer: 'it is an educational institution', type: 'open', acceptedKeywords: ['education', 'institution', 'school', 'university', 'college'] },
        { prompt: 'What is a red flag that a website might not be reliable?', answer: 'no author listed many pop-up ads or extreme claims without evidence', type: 'open', acceptedKeywords: ['no author', 'ads', 'extreme', 'claims', 'no evidence', 'red flag'] },
        { prompt: 'Why should you check when a website was last updated?', answer: 'outdated information may no longer be accurate', type: 'open', acceptedKeywords: ['outdated', 'accurate', 'old', 'update', 'current', 'change'] },
      ],
    },
    'loaded-language': {
      items: [
        { prompt: 'What is loaded language in news?', answer: 'words with strong emotional connotations used to influence the reader', type: 'open', acceptedKeywords: ['emotional', 'connotation', 'influence', 'reader', 'words', 'feeling', 'manipulat'] },
        { prompt: '"Politician slams opponent" vs. "Politician disagrees with opponent." Which uses loaded language?', answer: 'the first one — "slams" is more emotionally charged', type: 'open', acceptedKeywords: ['first', 'slams', 'emotional', 'charged', 'strong'] },
        { prompt: 'How can loaded language affect how you feel about a news story?', answer: 'it can make you feel angry sympathetic or fearful about the topic', type: 'open', acceptedKeywords: ['feel', 'angry', 'sympathetic', 'fear', 'emotion', 'affect', 'influence'] },
        { prompt: 'How can you identify loaded language?', answer: 'look for words that create strong feelings rather than just stating facts', type: 'open', acceptedKeywords: ['strong', 'feeling', 'fact', 'emotion', 'word', 'identify', 'look'] },
        { prompt: 'Why do some news sources use loaded language?', answer: 'to attract readers and create emotional reactions', type: 'open', acceptedKeywords: ['attract', 'reader', 'emotional', 'reaction', 'attention', 'click', 'engage'] },
        { prompt: 'Rewrite this headline without loaded language: "Outrageous tax hike crushes families."', answer: 'tax increase will affect family budgets', type: 'open', acceptedKeywords: ['tax', 'increase', 'affect', 'budget', 'neutral', 'family'] },
      ],
    },
    'bias-by-omission': {
      items: [
        { prompt: 'What is bias by omission?', answer: 'leaving out important information or perspectives', type: 'open', acceptedKeywords: ['leaving out', 'important', 'information', 'perspective', 'omit', 'miss'] },
        { prompt: 'How is bias by omission different from lying?', answer: 'the facts presented are true but the story is incomplete', type: 'open', acceptedKeywords: ['true', 'incomplete', 'miss', 'not all', 'fact', 'partial'] },
        { prompt: 'A story about a new factory mentions jobs created but not pollution. What kind of bias is this?', answer: 'bias by omission — important negative effects are left out', type: 'open', acceptedKeywords: ['omission', 'left out', 'pollution', 'negative', 'miss', 'incomplete'] },
        { prompt: 'How can you detect bias by omission?', answer: 'ask what information might be missing and check other sources', type: 'open', acceptedKeywords: ['missing', 'other sources', 'ask', 'check', 'what else', 'compare'] },
        { prompt: 'Why is bias by omission particularly dangerous?', answer: 'because you do not know what you are not being told', type: 'open', acceptedKeywords: ['do not know', 'not told', 'hidden', 'dangerous', 'unaware', 'miss'] },
        { prompt: 'Can bias by omission be unintentional?', answer: 'yes reporters may not realize they are leaving out important information', type: 'open', acceptedKeywords: ['yes', 'unintentional', 'not realize', 'accident', 'unaware'] },
      ],
    },
    'photo-bias': {
      items: [
        { prompt: 'How can a photograph create bias in a news story?', answer: 'the angle timing and selection of a photo can change how you perceive the story', type: 'open', acceptedKeywords: ['angle', 'timing', 'selection', 'change', 'perceive', 'influence'] },
        { prompt: 'Two photos show the same rally. One shows a large crowd; the other shows a small group. What determines which is used?', answer: 'the editors choice which may reflect their bias', type: 'open', acceptedKeywords: ['editor', 'choice', 'bias', 'select', 'decide', 'perspective'] },
        { prompt: 'What is photo manipulation?', answer: 'digitally altering a photo to change its appearance or meaning', type: 'open', acceptedKeywords: ['alter', 'change', 'digital', 'edit', 'manipulat', 'modify'] },
        { prompt: 'Why should you be skeptical of photos on social media?', answer: 'they can be edited taken out of context or completely fake', type: 'open', acceptedKeywords: ['edited', 'context', 'fake', 'manipulat', 'altered', 'skeptic'] },
        { prompt: 'What is a caption and how can it create bias?', answer: 'text under a photo that can frame how you interpret the image', type: 'open', acceptedKeywords: ['text', 'under', 'frame', 'interpret', 'image', 'influence'] },
        { prompt: 'How can you verify if a photo is genuine?', answer: 'use reverse image search to find the original source and context', type: 'open', acceptedKeywords: ['reverse', 'image search', 'original', 'source', 'context', 'verify'] },
      ],
    },
    'news-echoes-history': {
      items: [
        { prompt: 'How can current events echo historical events?', answer: 'similar patterns of conflict migration or social change repeat over time', type: 'open', acceptedKeywords: ['pattern', 'repeat', 'similar', 'conflict', 'migration', 'social', 'history'] },
        { prompt: 'Give an example of a current event that echoes history.', answer: 'modern refugee crises echo historical migrations', type: 'open', acceptedKeywords: ['refugee', 'migration', 'war', 'rights', 'movement', 'protest', 'epidemic'] },
        { prompt: 'Why is it helpful to compare current events to history?', answer: 'to better understand causes effects and possible outcomes', type: 'open', acceptedKeywords: ['understand', 'cause', 'effect', 'outcome', 'learn', 'context', 'pattern'] },
        { prompt: 'What phrase means "history repeats itself"?', answer: 'those who do not learn from history are doomed to repeat it', type: 'open', acceptedKeywords: ['repeat', 'learn', 'history', 'doomed', 'cycle', 'pattern'] },
        { prompt: 'How can knowing history help you understand the news?', answer: 'it provides context and helps you see deeper causes', type: 'open', acceptedKeywords: ['context', 'deeper', 'cause', 'understand', 'background', 'why'] },
        { prompt: 'Is every historical comparison accurate?', answer: 'no you must check if the situations are truly similar', type: 'open', acceptedKeywords: ['no', 'check', 'similar', 'truly', 'compare', 'careful', 'not always'] },
      ],
    },
    'patterns-in-events': {
      items: [
        { prompt: 'What is a pattern in current events?', answer: 'something that happens repeatedly in similar situations', type: 'open', acceptedKeywords: ['repeat', 'similar', 'happen', 'again', 'pattern', 'recurring'] },
        { prompt: 'Name a recurring pattern in world events.', answer: 'economic booms and busts or cycles of peace and conflict', type: 'open', acceptedKeywords: ['economic', 'boom', 'bust', 'peace', 'conflict', 'cycle', 'recession'] },
        { prompt: 'How can recognizing patterns help predict future events?', answer: 'if you see the pattern starting you can anticipate what might happen next', type: 'open', acceptedKeywords: ['anticipat', 'predict', 'next', 'happen', 'see', 'pattern', 'expect'] },
        { prompt: 'Are patterns always exact repetitions?', answer: 'no similar events happen but with different details and circumstances', type: 'open', acceptedKeywords: ['no', 'similar', 'different', 'details', 'not exact', 'circumstance'] },
        { prompt: 'Why is pattern recognition an important media literacy skill?', answer: 'it helps you see the bigger picture and understand why events happen', type: 'open', acceptedKeywords: ['bigger picture', 'understand', 'why', 'context', 'import', 'skill'] },
        { prompt: 'Can understanding patterns help prevent negative events?', answer: 'yes if people recognize warning signs they can take action', type: 'open', acceptedKeywords: ['yes', 'warning', 'sign', 'action', 'prevent', 'recogniz', 'learn'] },
      ],
    },
  },
  'grade-6': {
    'propaganda-techniques': {
      items: [
        { prompt: 'What is propaganda?', answer: 'information used to promote a particular point of view often misleadingly', type: 'open', acceptedKeywords: ['information', 'promot', 'point of view', 'mislead', 'influence', 'persuad'] },
        { prompt: 'What is the bandwagon technique?', answer: 'suggesting everyone is doing something so you should too', type: 'open', acceptedKeywords: ['everyone', 'doing', 'join', 'popular', 'follow', 'should'] },
        { prompt: 'What is the testimonial technique?', answer: 'using a famous person to endorse a product or idea', type: 'open', acceptedKeywords: ['famous', 'person', 'endorse', 'celebrity', 'support', 'promote'] },
        { prompt: 'What is the fear appeal technique?', answer: 'using fear to convince people to take a specific action', type: 'open', acceptedKeywords: ['fear', 'convinc', 'scare', 'action', 'threat', 'danger'] },
        { prompt: 'What is name-calling in propaganda?', answer: 'using negative labels to make someone or something look bad', type: 'open', acceptedKeywords: ['negative', 'label', 'bad', 'name', 'attack', 'discredit'] },
        { prompt: 'How can you protect yourself from propaganda?', answer: 'by recognizing the techniques and thinking critically', type: 'open', acceptedKeywords: ['recogniz', 'technique', 'critical', 'think', 'aware', 'question'] },
      ],
    },
    'advertising-vs-news': {
      items: [
        { prompt: 'What is the main difference between advertising and news?', answer: 'advertising tries to sell something while news aims to inform', type: 'open', acceptedKeywords: ['sell', 'inform', 'advertis', 'news', 'difference', 'product'] },
        { prompt: 'What is native advertising?', answer: 'advertising designed to look like regular news content', type: 'open', acceptedKeywords: ['look like', 'news', 'content', 'disguised', 'appear', 'blend'] },
        { prompt: 'Why is it important to tell advertising from news?', answer: 'so you know when someone is trying to sell you something vs inform you', type: 'open', acceptedKeywords: ['sell', 'inform', 'know', 'difference', 'aware', 'important'] },
        { prompt: 'What clues indicate something is advertising rather than news?', answer: 'it promotes a specific product or includes a call to buy', type: 'open', acceptedKeywords: ['product', 'buy', 'promot', 'brand', 'call to action', 'sponsored'] },
        { prompt: 'What does "sponsored content" mean?', answer: 'content that a company paid to have published', type: 'open', acceptedKeywords: ['company', 'paid', 'publish', 'sponsor', 'money', 'bought'] },
        { prompt: 'Can advertising contain facts?', answer: 'yes but the facts are selected to make the product look good', type: 'open', acceptedKeywords: ['yes', 'select', 'product', 'good', 'cherry pick', 'chosen'] },
      ],
    },
    'emotional-appeals': {
      items: [
        { prompt: 'What is an emotional appeal?', answer: 'a message designed to make you feel a strong emotion rather than think logically', type: 'open', acceptedKeywords: ['emotion', 'feel', 'strong', 'logic', 'message', 'design'] },
        { prompt: 'Name three emotions commonly used in media manipulation.', answer: 'fear anger and sympathy', type: 'open', acceptedKeywords: ['fear', 'anger', 'sympathy', 'pride', 'guilt', 'joy', 'outrage'] },
        { prompt: 'Why are emotional appeals effective?', answer: 'because emotions can override logical thinking', type: 'open', acceptedKeywords: ['emotion', 'override', 'logic', 'think', 'powerful', 'react', 'feeling'] },
        { prompt: 'How can you recognize when your emotions are being manipulated?', answer: 'notice if content is making you feel very strongly before presenting evidence', type: 'open', acceptedKeywords: ['notice', 'strong', 'feeling', 'evidence', 'manipulat', 'aware', 'before'] },
        { prompt: 'Is using emotion in media always wrong?', answer: 'no but it should be balanced with facts and evidence', type: 'open', acceptedKeywords: ['no', 'balanced', 'fact', 'evidence', 'not always', 'context'] },
        { prompt: 'What should you do when a news story makes you very angry or scared?', answer: 'pause check other sources and look for the facts behind the emotion', type: 'open', acceptedKeywords: ['pause', 'check', 'source', 'fact', 'stop', 'think', 'calm'] },
      ],
    },
    'social-media-news': {
      items: [
        { prompt: 'How is getting news from social media different from traditional news?', answer: 'social media is not always fact-checked and anyone can post', type: 'open', acceptedKeywords: ['not fact-checked', 'anyone', 'post', 'different', 'unverif', 'curated'] },
        { prompt: 'What is a viral post?', answer: 'content that is shared rapidly by many people online', type: 'open', acceptedKeywords: ['shared', 'rapidly', 'many', 'people', 'online', 'spread'] },
        { prompt: 'Does viral content always mean it is true?', answer: 'no viral content can be false misleading or manipulated', type: 'open', acceptedKeywords: ['no', 'false', 'mislead', 'manipulat', 'not true', 'not always'] },
        { prompt: 'What responsibility do you have before sharing news on social media?', answer: 'verify it is true and from a reliable source', type: 'open', acceptedKeywords: ['verify', 'true', 'reliable', 'source', 'check', 'confirm'] },
        { prompt: 'What are bots on social media?', answer: 'automated accounts that spread content without human action', type: 'open', acceptedKeywords: ['automated', 'account', 'spread', 'not human', 'fake', 'robot', 'program'] },
        { prompt: 'How can misinformation spread on social media?', answer: 'people share it without checking if it is true creating a chain reaction', type: 'open', acceptedKeywords: ['share', 'without checking', 'chain', 'spread', 'fast', 'viral', 'unchecked'] },
      ],
    },
    'deepfakes-and-manipulation': {
      items: [
        { prompt: 'What is a deepfake?', answer: 'a video or audio that uses AI to make it look like someone said or did something they did not', type: 'open', acceptedKeywords: ['AI', 'video', 'audio', 'fake', 'look like', 'manipulat', 'artificial'] },
        { prompt: 'Why are deepfakes dangerous?', answer: 'they can spread false information and damage reputations', type: 'open', acceptedKeywords: ['false', 'information', 'damage', 'reputation', 'dangerous', 'mislead', 'trust'] },
        { prompt: 'How can you spot a potential deepfake?', answer: 'look for unnatural movements blinking patterns or mismatched audio', type: 'open', acceptedKeywords: ['unnatural', 'movement', 'blink', 'mismatch', 'audio', 'look', 'odd'] },
        { prompt: 'What should you do if you suspect a video is a deepfake?', answer: 'do not share it and check reliable sources for the original', type: 'open', acceptedKeywords: ['not share', 'check', 'reliable', 'source', 'original', 'verify'] },
        { prompt: 'How has AI changed the challenge of evaluating media?', answer: 'it can create very convincing fake content that is hard to detect', type: 'open', acceptedKeywords: ['convincing', 'fake', 'hard', 'detect', 'create', 'AI'] },
        { prompt: 'What is digital literacy?', answer: 'the ability to find evaluate create and communicate information using digital technology', type: 'open', acceptedKeywords: ['find', 'evaluate', 'create', 'communicat', 'digital', 'technology', 'ability'] },
      ],
    },
    'digital-footprint': {
      items: [
        { prompt: 'What is a digital footprint?', answer: 'the trail of data you leave behind when using the internet', type: 'open', acceptedKeywords: ['trail', 'data', 'leave', 'internet', 'online', 'behind'] },
        { prompt: 'Why does your digital footprint matter?', answer: 'it can affect your reputation and future opportunities', type: 'open', acceptedKeywords: ['reputation', 'future', 'opportunit', 'affect', 'matter', 'permanent'] },
        { prompt: 'Can you completely erase your digital footprint?', answer: 'it is very difficult because data can be copied and stored by many services', type: 'open', acceptedKeywords: ['difficult', 'copied', 'stored', 'hard', 'permanent', 'no'] },
        { prompt: 'What should you think about before posting something online?', answer: 'whether you would be comfortable with everyone seeing it forever', type: 'open', acceptedKeywords: ['everyone', 'forever', 'comfortable', 'think', 'permanent', 'public'] },
        { prompt: 'How does your digital footprint relate to media literacy?', answer: 'being aware of your footprint is part of being a responsible digital citizen', type: 'open', acceptedKeywords: ['aware', 'responsible', 'digital citizen', 'footprint', 'media', 'literate'] },
        { prompt: 'What is the difference between a passive and active digital footprint?', answer: 'active is what you deliberately post and passive is data collected about you', type: 'open', acceptedKeywords: ['active', 'post', 'passive', 'collected', 'deliberate', 'data'] },
      ],
    },
    'how-outlets-differ': {
      items: [
        { prompt: 'Why do different news outlets report the same story differently?', answer: 'they have different editorial perspectives audiences and priorities', type: 'open', acceptedKeywords: ['editorial', 'perspective', 'audience', 'priorit', 'different', 'focus'] },
        { prompt: 'What is an editorial stance?', answer: 'the general political or ideological position of a news organization', type: 'open', acceptedKeywords: ['political', 'ideolog', 'position', 'news', 'organization', 'viewpoint'] },
        { prompt: 'How can comparing outlets help you understand a story better?', answer: 'you see what different outlets emphasize and what they leave out', type: 'open', acceptedKeywords: ['different', 'emphasize', 'leave out', 'compare', 'better', 'complete'] },
        { prompt: 'Name one way to compare news coverage across outlets.', answer: 'read the same story from multiple sources and note differences', type: 'open', acceptedKeywords: ['multiple', 'source', 'same story', 'note', 'difference', 'compare'] },
        { prompt: 'Do all news outlets have equal quality?', answer: 'no some have stronger fact-checking and editorial standards', type: 'open', acceptedKeywords: ['no', 'fact-check', 'standard', 'quality', 'differ', 'some'] },
        { prompt: 'What is a media bias chart?', answer: 'a tool that rates news sources on their political leaning and reliability', type: 'open', acceptedKeywords: ['rate', 'source', 'political', 'lean', 'reliab', 'tool', 'chart'] },
      ],
    },
    'international-perspectives': {
      items: [
        { prompt: 'Why is it valuable to read news from other countries?', answer: 'it gives you perspectives you might not get from domestic media', type: 'open', acceptedKeywords: ['perspective', 'other', 'domestic', 'different', 'view', 'world'] },
        { prompt: 'How might a US news story about a trade deal differ from how another country reports it?', answer: 'each country focuses on how the deal affects their own people', type: 'open', acceptedKeywords: ['own', 'people', 'focus', 'affect', 'different', 'perspective'] },
        { prompt: 'What challenges exist when reading international news?', answer: 'language barriers different cultural contexts and unfamiliar political systems', type: 'open', acceptedKeywords: ['language', 'cultural', 'context', 'political', 'barrier', 'unfamiliar'] },
        { prompt: 'Name one international news source.', answer: 'BBC Reuters Al Jazeera or NHK', type: 'open', acceptedKeywords: ['BBC', 'Reuters', 'Al Jazeera', 'NHK', 'AP', 'France 24'] },
        { prompt: 'How can international perspectives reduce bias?', answer: 'they expose you to viewpoints beyond your own country and culture', type: 'open', acceptedKeywords: ['viewpoint', 'beyond', 'country', 'culture', 'expose', 'broader', 'different'] },
        { prompt: 'Is any country\'s media completely unbiased?', answer: 'no all media exists within cultural and political contexts that shape coverage', type: 'open', acceptedKeywords: ['no', 'all', 'cultural', 'political', 'context', 'shape', 'bias'] },
      ],
    },
    'building-informed-opinions': {
      items: [
        { prompt: 'What is an informed opinion?', answer: 'an opinion based on evidence and careful consideration of multiple perspectives', type: 'open', acceptedKeywords: ['evidence', 'careful', 'multiple', 'perspective', 'based on', 'consider'] },
        { prompt: 'How is an informed opinion different from an uninformed one?', answer: 'informed opinions are supported by evidence while uninformed ones are based on feelings alone', type: 'open', acceptedKeywords: ['evidence', 'support', 'feeling', 'research', 'inform', 'fact'] },
        { prompt: 'What steps should you take to form an informed opinion?', answer: 'research the topic from multiple sources consider different views then decide', type: 'open', acceptedKeywords: ['research', 'multiple', 'source', 'different', 'view', 'decide', 'consider'] },
        { prompt: 'Can your informed opinion change?', answer: 'yes if you encounter new evidence or compelling arguments', type: 'open', acceptedKeywords: ['yes', 'new', 'evidence', 'change', 'compell', 'argument', 'learn'] },
        { prompt: 'Why is it important for citizens to have informed opinions?', answer: 'so they can participate meaningfully in democracy', type: 'open', acceptedKeywords: ['participate', 'democracy', 'meaningful', 'citizen', 'vote', 'decide'] },
        { prompt: 'What is the difference between an opinion and a well-argued position?', answer: 'a well-argued position is backed by evidence and logical reasoning', type: 'open', acceptedKeywords: ['evidence', 'logical', 'reason', 'backed', 'support', 'argument'] },
      ],
    },
    'civil-discussion': {
      items: [
        { prompt: 'What is civil discussion?', answer: 'a respectful conversation where people share different views without personal attacks', type: 'open', acceptedKeywords: ['respect', 'conversation', 'different', 'view', 'without', 'attack', 'polite'] },
        { prompt: 'Why is civil discussion important in a democracy?', answer: 'it allows people to understand each other and find common ground', type: 'open', acceptedKeywords: ['understand', 'common ground', 'democracy', 'people', 'together', 'disagree'] },
        { prompt: 'What are the rules of a good civil discussion?', answer: 'listen respectfully use evidence stay on topic and avoid personal attacks', type: 'open', acceptedKeywords: ['listen', 'respect', 'evidence', 'topic', 'attack', 'rule'] },
        { prompt: 'How can you disagree with someone respectfully?', answer: 'acknowledge their point then explain why you see it differently using evidence', type: 'open', acceptedKeywords: ['acknowledge', 'point', 'explain', 'different', 'evidence', 'respect'] },
        { prompt: 'What should you do if a discussion becomes heated?', answer: 'take a break refocus on facts and remind yourself of shared goals', type: 'open', acceptedKeywords: ['break', 'fact', 'calm', 'refocus', 'shared', 'goal', 'pause'] },
        { prompt: 'Can civil discussion change people\'s minds?', answer: 'yes respectful dialogue is more persuasive than hostile argument', type: 'open', acceptedKeywords: ['yes', 'respect', 'dialogue', 'persuasive', 'change', 'mind'] },
      ],
    },
  },
  'grade-7': {
    'how-news-is-made': {
      items: [
        { prompt: 'What are the main steps in producing a news story?', answer: 'identify the story research interview write edit and publish', type: 'open', acceptedKeywords: ['research', 'interview', 'write', 'edit', 'publish', 'identify'] },
        { prompt: 'What is an editor\'s role in news production?', answer: 'to review stories for accuracy fairness and quality before publication', type: 'open', acceptedKeywords: ['review', 'accuracy', 'fairness', 'quality', 'publication', 'check'] },
        { prompt: 'What is a news cycle?', answer: 'the regular schedule by which news is gathered and distributed', type: 'open', acceptedKeywords: ['schedule', 'regular', 'gather', 'distribut', 'cycle', 'time'] },
        { prompt: 'How has the 24-hour news cycle changed journalism?', answer: 'it created pressure to publish quickly sometimes sacrificing accuracy', type: 'open', acceptedKeywords: ['pressure', 'quickly', 'accuracy', 'fast', 'sacrifice', '24 hour', 'speed'] },
        { prompt: 'What is a news beat?', answer: 'a specific topic area that a reporter covers regularly', type: 'open', acceptedKeywords: ['specific', 'topic', 'reporter', 'cover', 'regular', 'area', 'speciali'] },
        { prompt: 'What ethical standards should journalists follow?', answer: 'accuracy fairness independence and accountability', type: 'open', acceptedKeywords: ['accuracy', 'fairness', 'independen', 'accountab', 'ethical', 'truth'] },
      ],
    },
    'business-of-news': {
      items: [
        { prompt: 'How do most news organizations make money?', answer: 'through advertising subscriptions and sponsorships', type: 'open', acceptedKeywords: ['advertising', 'subscription', 'sponsor', 'money', 'revenue', 'ads'] },
        { prompt: 'How can the business model of news affect its content?', answer: 'outlets may prioritize stories that attract viewers and advertisers', type: 'open', acceptedKeywords: ['viewers', 'advertiser', 'attract', 'prioritiz', 'content', 'audience'] },
        { prompt: 'What is clickbait?', answer: 'sensational headlines designed to get people to click', type: 'open', acceptedKeywords: ['sensational', 'headline', 'click', 'attract', 'exaggerat', 'mislead'] },
        { prompt: 'Why is a free press important for democracy?', answer: 'it holds those in power accountable and informs citizens', type: 'open', acceptedKeywords: ['accountab', 'power', 'inform', 'citizen', 'democracy', 'check'] },
        { prompt: 'What happens when news organizations close in a community?', answer: 'people lose access to local information creating a news desert', type: 'open', acceptedKeywords: ['lose', 'access', 'local', 'information', 'news desert', 'community'] },
        { prompt: 'What is the difference between nonprofit and for-profit news?', answer: 'nonprofit news is funded by donations and focuses on public service', type: 'open', acceptedKeywords: ['donation', 'public service', 'nonprofit', 'profit', 'fund', 'mission'] },
      ],
    },
    'citizen-journalism': {
      items: [
        { prompt: 'What is citizen journalism?', answer: 'when ordinary people report news using phones and social media', type: 'open', acceptedKeywords: ['ordinary', 'people', 'report', 'phone', 'social media', 'not professional'] },
        { prompt: 'What is one advantage of citizen journalism?', answer: 'it can cover events that professional journalists cannot reach', type: 'open', acceptedKeywords: ['cover', 'event', 'professional', 'reach', 'fast', 'on the scene'] },
        { prompt: 'What is one disadvantage of citizen journalism?', answer: 'it may lack fact-checking and professional standards', type: 'open', acceptedKeywords: ['fact-check', 'standard', 'lack', 'profess', 'accuracy', 'bias'] },
        { prompt: 'How has citizen journalism played a role in social movements?', answer: 'by documenting events that mainstream media might not cover', type: 'open', acceptedKeywords: ['document', 'event', 'mainstream', 'cover', 'awareness', 'witness'] },
        { prompt: 'What ethical considerations should citizen journalists keep in mind?', answer: 'accuracy privacy consent and context', type: 'open', acceptedKeywords: ['accuracy', 'privacy', 'consent', 'context', 'ethical', 'responsible'] },
        { prompt: 'How can you evaluate citizen journalism content?', answer: 'check if it can be verified by other sources and look for the original context', type: 'open', acceptedKeywords: ['verify', 'other sources', 'context', 'check', 'confirm', 'original'] },
      ],
    },
    'filter-bubbles': {
      items: [
        { prompt: 'What is a filter bubble?', answer: 'when algorithms show you only content that matches your existing views', type: 'open', acceptedKeywords: ['algorithm', 'content', 'match', 'existing', 'view', 'show', 'only'] },
        { prompt: 'How do filter bubbles form?', answer: 'algorithms track what you click and show more of the same', type: 'open', acceptedKeywords: ['algorithm', 'click', 'track', 'same', 'more', 'personali'] },
        { prompt: 'Why are filter bubbles problematic for informed citizenship?', answer: 'they limit exposure to different perspectives and create a distorted view', type: 'open', acceptedKeywords: ['limit', 'different', 'perspective', 'distort', 'one-sided', 'narrow'] },
        { prompt: 'How can you break out of a filter bubble?', answer: 'deliberately seek diverse sources and viewpoints', type: 'open', acceptedKeywords: ['diverse', 'source', 'deliberat', 'seek', 'different', 'viewpoint'] },
        { prompt: 'What is the relationship between filter bubbles and polarization?', answer: 'filter bubbles can increase division by reinforcing existing beliefs', type: 'open', acceptedKeywords: ['division', 'reinforc', 'existing', 'belief', 'polariz', 'extrem'] },
        { prompt: 'Who benefits from filter bubbles?', answer: 'social media companies because engaged users see more ads', type: 'open', acceptedKeywords: ['social media', 'compan', 'ads', 'engag', 'profit', 'money'] },
      ],
    },
    'echo-chambers': {
      items: [
        { prompt: 'What is an echo chamber?', answer: 'an environment where a person only encounters beliefs that match their own', type: 'open', acceptedKeywords: ['environment', 'only', 'match', 'own', 'belief', 'same', 'reinforce'] },
        { prompt: 'How is an echo chamber different from a filter bubble?', answer: 'echo chambers are often created by social choices while filter bubbles are created by algorithms', type: 'open', acceptedKeywords: ['social', 'choice', 'algorithm', 'people', 'technology', 'different'] },
        { prompt: 'What dangers do echo chambers pose?', answer: 'they can radicalize views spread misinformation and increase division', type: 'open', acceptedKeywords: ['radical', 'misinformation', 'division', 'extrem', 'danger', 'narrow'] },
        { prompt: 'How can you recognize if you are in an echo chamber?', answer: 'if everyone you follow agrees with you and you never see opposing views', type: 'open', acceptedKeywords: ['everyone', 'agree', 'never', 'opposing', 'same', 'recogniz'] },
        { prompt: 'What can you do to avoid echo chambers?', answer: 'follow diverse voices and engage with respectful disagreement', type: 'open', acceptedKeywords: ['diverse', 'voice', 'disagree', 'different', 'follow', 'engage'] },
        { prompt: 'How do echo chambers affect democratic society?', answer: 'they make it harder for people to understand each other and compromise', type: 'open', acceptedKeywords: ['understand', 'compromise', 'harder', 'society', 'democratic', 'division'] },
      ],
    },
    'algorithmic-bias': {
      items: [
        { prompt: 'What is algorithmic bias?', answer: 'when algorithms produce unfair or discriminatory outcomes', type: 'open', acceptedKeywords: ['algorithm', 'unfair', 'discriminat', 'outcome', 'bias', 'result'] },
        { prompt: 'How can algorithms in news feeds create bias?', answer: 'by prioritizing certain types of content over others', type: 'open', acceptedKeywords: ['prioritiz', 'certain', 'content', 'over', 'others', 'favor'] },
        { prompt: 'Are algorithms neutral?', answer: 'no they reflect the biases of the people who created them and the data they learn from', type: 'open', acceptedKeywords: ['no', 'bias', 'people', 'created', 'data', 'reflect'] },
        { prompt: 'How can algorithmic bias affect what news you see?', answer: 'you may see more sensational or one-sided content because it gets more engagement', type: 'open', acceptedKeywords: ['sensational', 'one-sided', 'engagement', 'see', 'click', 'show'] },
        { prompt: 'What can be done about algorithmic bias?', answer: 'transparency in algorithms regulation and user awareness', type: 'open', acceptedKeywords: ['transparency', 'regulat', 'awareness', 'user', 'fix', 'account'] },
        { prompt: 'Why should citizens understand how algorithms work?', answer: 'to make better decisions about the information they consume', type: 'open', acceptedKeywords: ['better', 'decision', 'information', 'consume', 'understand', 'aware'] },
      ],
    },
    'investigative-journalism': {
      items: [
        { prompt: 'What is investigative journalism?', answer: 'in-depth reporting that uncovers hidden truths and holds the powerful accountable', type: 'open', acceptedKeywords: ['in-depth', 'uncover', 'hidden', 'truth', 'accountab', 'powerful'] },
        { prompt: 'Name a famous example of investigative journalism.', answer: 'Watergate which led to President Nixon\'s resignation', type: 'open', acceptedKeywords: ['Watergate', 'Nixon', 'Pentagon Papers', 'Panama Papers', 'Spotlight'] },
        { prompt: 'Why is investigative journalism important for democracy?', answer: 'it exposes corruption and wrongdoing that those in power try to hide', type: 'open', acceptedKeywords: ['expose', 'corruption', 'power', 'hide', 'democracy', 'accountab'] },
        { prompt: 'What skills do investigative journalists need?', answer: 'research skills persistence critical thinking and source development', type: 'open', acceptedKeywords: ['research', 'persist', 'critical', 'source', 'skill', 'determin'] },
        { prompt: 'What is a whistleblower?', answer: 'someone who exposes wrongdoing within an organization', type: 'open', acceptedKeywords: ['expose', 'wrongdoing', 'organization', 'inside', 'report', 'reveal'] },
        { prompt: 'Why might investigative journalism be under threat?', answer: 'it is expensive time-consuming and powerful people may try to stop it', type: 'open', acceptedKeywords: ['expensive', 'time', 'powerful', 'stop', 'threat', 'costly'] },
      ],
    },
    'writing-news': {
      items: [
        { prompt: 'What is the inverted pyramid structure in news writing?', answer: 'putting the most important information first and details later', type: 'open', acceptedKeywords: ['most important', 'first', 'detail', 'later', 'pyramid', 'top'] },
        { prompt: 'Why is the lead (first paragraph) the most important part of a news story?', answer: 'it summarizes the key facts and hooks the reader', type: 'open', acceptedKeywords: ['summariz', 'key', 'fact', 'hook', 'reader', 'main', 'first'] },
        { prompt: 'What is objectivity in journalism?', answer: 'reporting facts without inserting personal opinions or bias', type: 'open', acceptedKeywords: ['fact', 'without', 'opinion', 'bias', 'neutral', 'personal'] },
        { prompt: 'What does "attribution" mean in journalism?', answer: 'identifying who said or provided the information', type: 'open', acceptedKeywords: ['who', 'said', 'provided', 'source', 'credit', 'identify'] },
        { prompt: 'Why must journalists check facts before publishing?', answer: 'to ensure accuracy and maintain public trust', type: 'open', acceptedKeywords: ['accuracy', 'trust', 'ensure', 'check', 'correct', 'credib'] },
        { prompt: 'What is the difference between hard news and a feature story?', answer: 'hard news reports events while features explore topics in depth with a narrative style', type: 'open', acceptedKeywords: ['hard news', 'event', 'feature', 'depth', 'narrative', 'story'] },
      ],
    },
    'editing-and-framing': {
      items: [
        { prompt: 'What is framing in media?', answer: 'how a story is presented to influence how the audience interprets it', type: 'open', acceptedKeywords: ['present', 'influence', 'audience', 'interpret', 'how', 'perspective'] },
        { prompt: 'How can the same event be framed differently?', answer: 'by emphasizing different aspects using different sources or different headlines', type: 'open', acceptedKeywords: ['different', 'emphasiz', 'aspect', 'source', 'headline', 'focus'] },
        { prompt: 'What role does an editor play in framing?', answer: 'they decide what stories to cover how to present them and which details to include', type: 'open', acceptedKeywords: ['decide', 'stories', 'present', 'detail', 'include', 'choose'] },
        { prompt: 'How can editing change the meaning of a quote?', answer: 'by removing context or cutting words the meaning can change significantly', type: 'open', acceptedKeywords: ['context', 'cutting', 'meaning', 'change', 'remove', 'edit'] },
        { prompt: 'What is gate-keeping in media?', answer: 'the process of deciding what information reaches the public', type: 'open', acceptedKeywords: ['deciding', 'information', 'public', 'control', 'select', 'choose'] },
        { prompt: 'How does framing affect public opinion?', answer: 'it shapes how people think about issues by highlighting certain aspects', type: 'open', acceptedKeywords: ['shape', 'think', 'highlight', 'certain', 'aspect', 'opinion', 'public'] },
      ],
    },
    'visual-journalism': {
      items: [
        { prompt: 'What is visual journalism?', answer: 'using images videos infographics and data visualizations to tell news stories', type: 'open', acceptedKeywords: ['image', 'video', 'infographic', 'data', 'visual', 'story'] },
        { prompt: 'Why can a photograph be more powerful than words?', answer: 'it shows reality directly and creates an immediate emotional impact', type: 'open', acceptedKeywords: ['reality', 'direct', 'emotional', 'impact', 'show', 'immedi', 'powerful'] },
        { prompt: 'What is an infographic?', answer: 'a visual representation of information or data designed to be easy to understand', type: 'open', acceptedKeywords: ['visual', 'information', 'data', 'easy', 'understand', 'represent', 'graphic'] },
        { prompt: 'How can data visualizations mislead viewers?', answer: 'by using misleading scales cherry-picked data or confusing design', type: 'open', acceptedKeywords: ['mislead', 'scale', 'cherry-pick', 'data', 'confus', 'design'] },
        { prompt: 'What ethical issues exist in photojournalism?', answer: 'consent privacy dignity of subjects and not staging photos', type: 'open', acceptedKeywords: ['consent', 'privacy', 'dignity', 'staging', 'ethical', 'subject'] },
        { prompt: 'How has video journalism changed news?', answer: 'it provides direct visual evidence and makes stories more immediate and engaging', type: 'open', acceptedKeywords: ['direct', 'visual', 'evidence', 'immediate', 'engaging', 'video'] },
      ],
    },
  },
  'grade-8': {
    'rhetoric-in-media': {
      items: [
        { prompt: 'What is rhetoric?', answer: 'the art of effective persuasion through speaking or writing', type: 'open', acceptedKeywords: ['persuasion', 'effective', 'speaking', 'writing', 'art', 'communicat'] },
        { prompt: 'What are the three rhetorical appeals?', answer: 'ethos (credibility) pathos (emotion) and logos (logic)', type: 'open', acceptedKeywords: ['ethos', 'pathos', 'logos', 'credib', 'emotion', 'logic'] },
        { prompt: 'How do news commentators use rhetorical appeals?', answer: 'they establish credibility appeal to emotions and use logical arguments', type: 'open', acceptedKeywords: ['credib', 'emotion', 'logical', 'argument', 'appeal', 'persuad'] },
        { prompt: 'How can understanding rhetoric help you evaluate media?', answer: 'you can identify how messages try to persuade you and think more critically', type: 'open', acceptedKeywords: ['identify', 'persuad', 'critical', 'think', 'evaluate', 'aware'] },
        { prompt: 'What is a rhetorical question in media?', answer: 'a question not meant to be answered but to make a point or influence thinking', type: 'open', acceptedKeywords: ['not answered', 'point', 'influence', 'think', 'rhetorical', 'persuad'] },
        { prompt: 'How can you use rhetoric responsibly when sharing your own views?', answer: 'by being honest using evidence and respecting your audience', type: 'open', acceptedKeywords: ['honest', 'evidence', 'respect', 'audience', 'responsible', 'ethical'] },
      ],
    },
    'logical-fallacies': {
      items: [
        { prompt: 'What is a logical fallacy?', answer: 'an error in reasoning that weakens an argument', type: 'open', acceptedKeywords: ['error', 'reasoning', 'weaken', 'argument', 'flaw', 'logic'] },
        { prompt: 'What is an ad hominem fallacy?', answer: 'attacking the person making the argument instead of the argument itself', type: 'open', acceptedKeywords: ['attack', 'person', 'instead', 'argument', 'character'] },
        { prompt: 'What is a straw man fallacy?', answer: 'misrepresenting someone\'s argument to make it easier to attack', type: 'open', acceptedKeywords: ['misrepresent', 'argument', 'easier', 'attack', 'distort'] },
        { prompt: 'What is a false dichotomy?', answer: 'presenting only two options when more exist', type: 'open', acceptedKeywords: ['two', 'option', 'only', 'more', 'exist', 'either or'] },
        { prompt: 'What is an appeal to authority fallacy?', answer: 'claiming something is true because an authority figure says so without evidence', type: 'open', acceptedKeywords: ['authority', 'true', 'without', 'evidence', 'expert', 'because'] },
        { prompt: 'Why is recognizing logical fallacies important for media literacy?', answer: 'it helps you identify weak arguments and manipulative techniques', type: 'open', acceptedKeywords: ['identify', 'weak', 'argument', 'manipulat', 'technique', 'recognize'] },
        { prompt: 'What is the slippery slope fallacy?', answer: 'arguing that one event will lead to extreme consequences without evidence', type: 'open', acceptedKeywords: ['one event', 'extreme', 'consequence', 'without evidence', 'chain', 'lead'] },
      ],
    },
    'satire-vs-news': {
      items: [
        { prompt: 'What is satire?', answer: 'humor or exaggeration used to criticize or comment on real issues', type: 'open', acceptedKeywords: ['humor', 'exaggerat', 'criticiz', 'comment', 'real', 'issue'] },
        { prompt: 'How is satire different from fake news?', answer: 'satire is intentional humor while fake news intentionally deceives', type: 'open', acceptedKeywords: ['humor', 'intentional', 'deceiv', 'different', 'joke', 'fake'] },
        { prompt: 'Name a satirical news source.', answer: 'The Onion or The Babylon Bee', type: 'open', acceptedKeywords: ['Onion', 'Babylon Bee', 'Daily Show', 'satir'] },
        { prompt: 'Why do people sometimes mistake satire for real news?', answer: 'because satire can look like real news especially when shared out of context', type: 'open', acceptedKeywords: ['look like', 'real', 'context', 'confus', 'mistake', 'shared'] },
        { prompt: 'What role does satire play in a democratic society?', answer: 'it uses humor to hold the powerful accountable and promote critical thinking', type: 'open', acceptedKeywords: ['humor', 'accountab', 'powerful', 'critical', 'think', 'check'] },
        { prompt: 'How can you tell if something is satire?', answer: 'check the source look for exaggeration and see if the site labels itself as satire', type: 'open', acceptedKeywords: ['source', 'exaggerat', 'label', 'check', 'site', 'humor'] },
      ],
    },
    'reading-data-in-news': {
      items: [
        { prompt: 'Why is data used in news stories?', answer: 'to provide evidence support claims and help readers understand trends', type: 'open', acceptedKeywords: ['evidence', 'support', 'claim', 'understand', 'trend', 'data'] },
        { prompt: 'What should you look for when a news story presents a graph?', answer: 'the scale labels source and whether it accurately represents the data', type: 'open', acceptedKeywords: ['scale', 'label', 'source', 'accurat', 'represent', 'axis'] },
        { prompt: 'What is the difference between correlation and causation?', answer: 'correlation means two things happen together and causation means one causes the other', type: 'open', acceptedKeywords: ['correlation', 'causation', 'together', 'cause', 'difference', 'relate'] },
        { prompt: 'Why is sample size important when interpreting data?', answer: 'a small sample may not accurately represent the larger population', type: 'open', acceptedKeywords: ['small', 'sample', 'represent', 'population', 'accurate', 'enough'] },
        { prompt: 'How can a graph be made to look misleading?', answer: 'by starting the y-axis at a number other than zero or using inconsistent scales', type: 'open', acceptedKeywords: ['y-axis', 'zero', 'scale', 'inconsist', 'truncat', 'mislead'] },
        { prompt: 'What questions should you ask about data in the news?', answer: 'who collected it how was it collected and what does it actually show', type: 'open', acceptedKeywords: ['who', 'how', 'collected', 'show', 'source', 'method'] },
      ],
    },
    'misleading-statistics': {
      items: [
        { prompt: 'How can statistics be used to mislead?', answer: 'by cherry-picking data using misleading averages or ignoring context', type: 'open', acceptedKeywords: ['cherry-pick', 'mislead', 'average', 'context', 'ignor', 'select'] },
        { prompt: 'What is the difference between mean median and mode?', answer: 'mean is average median is the middle value and mode is the most common', type: 'open', acceptedKeywords: ['mean', 'average', 'median', 'middle', 'mode', 'common'] },
        { prompt: 'How can percentages be misleading?', answer: 'a 100% increase sounds big but could be from 1 to 2', type: 'open', acceptedKeywords: ['100%', 'sounds', 'small number', 'context', 'mislead', 'actual'] },
        { prompt: 'What is cherry-picking data?', answer: 'selecting only the data that supports your argument and ignoring the rest', type: 'open', acceptedKeywords: ['select', 'support', 'argument', 'ignor', 'rest', 'only', 'choosing'] },
        { prompt: 'A headline says "Crime Doubles!" but the number went from 2 to 4 in a city of 100,000. Is this misleading?', answer: 'yes because the actual numbers are very small relative to the population', type: 'open', acceptedKeywords: ['yes', 'small', 'number', 'population', 'mislead', 'relative', 'context'] },
        { prompt: 'How can you protect yourself from misleading statistics?', answer: 'look at the actual numbers ask for context and check the source', type: 'open', acceptedKeywords: ['actual', 'number', 'context', 'source', 'check', 'look'] },
      ],
    },
    'polls-and-surveys': {
      items: [
        { prompt: 'What is the difference between a poll and a survey?', answer: 'a poll usually asks one question while a survey asks many', type: 'open', acceptedKeywords: ['one question', 'many', 'poll', 'survey', 'difference', 'more'] },
        { prompt: 'What makes a poll reliable?', answer: 'a large random sample good methodology and unbiased questions', type: 'open', acceptedKeywords: ['large', 'random', 'sample', 'methodology', 'unbiased', 'question'] },
        { prompt: 'What is a leading question in a survey?', answer: 'a question worded to push the respondent toward a particular answer', type: 'open', acceptedKeywords: ['worded', 'push', 'particular', 'answer', 'bias', 'influence'] },
        { prompt: 'What is the margin of error?', answer: 'the range within which the true result likely falls', type: 'open', acceptedKeywords: ['range', 'true', 'result', 'falls', 'accuracy', 'uncertainty'] },
        { prompt: 'Why might online polls be unreliable?', answer: 'they are not random and can be manipulated by bots or organized groups', type: 'open', acceptedKeywords: ['not random', 'manipulat', 'bot', 'self-select', 'unreliable'] },
        { prompt: 'What should you look for when news cites a poll?', answer: 'who conducted it sample size methodology and margin of error', type: 'open', acceptedKeywords: ['who', 'sample size', 'methodology', 'margin of error', 'conduct'] },
      ],
    },
    'reporting-responsibly': {
      items: [
        { prompt: 'What does it mean to report responsibly as a citizen?', answer: 'sharing only verified information and considering the impact of what you share', type: 'open', acceptedKeywords: ['verified', 'information', 'impact', 'share', 'responsible', 'accurate'] },
        { prompt: 'Before sharing a story on social media, what should you do?', answer: 'verify the source check if it is current and consider its accuracy', type: 'open', acceptedKeywords: ['verify', 'source', 'check', 'current', 'accuracy', 'confirm'] },
        { prompt: 'What is the harm of sharing misinformation?', answer: 'it can mislead people cause panic and damage trust', type: 'open', acceptedKeywords: ['mislead', 'panic', 'damage', 'trust', 'harm', 'false'] },
        { prompt: 'What responsibility do social media platforms have regarding misinformation?', answer: 'they should moderate content flag misinformation and promote reliable sources', type: 'open', acceptedKeywords: ['moderate', 'flag', 'misinformation', 'reliable', 'responsible', 'platform'] },
        { prompt: 'What is media ethics?', answer: 'principles and standards that guide responsible media creation and consumption', type: 'open', acceptedKeywords: ['principles', 'standard', 'responsible', 'guide', 'media', 'ethical'] },
        { prompt: 'How can you be a responsible digital citizen?', answer: 'verify before sharing think critically respect privacy and contribute constructively', type: 'open', acceptedKeywords: ['verify', 'share', 'critical', 'privacy', 'respect', 'constructi'] },
      ],
    },
    'social-media-activism': {
      items: [
        { prompt: 'What is social media activism?', answer: 'using social media platforms to promote awareness and action on social issues', type: 'open', acceptedKeywords: ['social media', 'promot', 'awareness', 'action', 'social', 'issue'] },
        { prompt: 'What is a hashtag movement?', answer: 'a social media campaign organized around a hashtag to raise awareness', type: 'open', acceptedKeywords: ['hashtag', 'campaign', 'awareness', 'raise', 'organiz', 'movement'] },
        { prompt: 'What is slacktivism?', answer: 'supporting a cause through social media without taking meaningful action', type: 'open', acceptedKeywords: ['social media', 'without', 'meaningful', 'action', 'support', 'online only'] },
        { prompt: 'Can social media activism create real change?', answer: 'yes it can raise awareness organize protests and influence policy', type: 'open', acceptedKeywords: ['yes', 'awareness', 'organiz', 'protest', 'influence', 'policy', 'change'] },
        { prompt: 'What are the limitations of social media activism?', answer: 'it can oversimplify issues create outrage without understanding and lack follow-through', type: 'open', acceptedKeywords: ['oversimpl', 'outrage', 'lack', 'follow-through', 'limit', 'shallow'] },
        { prompt: 'How can social media activism complement traditional activism?', answer: 'by raising awareness widely while traditional methods create lasting change', type: 'open', acceptedKeywords: ['awareness', 'widely', 'traditional', 'lasting', 'complement', 'combine'] },
      ],
    },
    'media-ethics': {
      items: [
        { prompt: 'What are the core principles of journalism ethics?', answer: 'truth accuracy fairness independence and accountability', type: 'open', acceptedKeywords: ['truth', 'accuracy', 'fairness', 'independence', 'accountab'] },
        { prompt: 'What is a conflict of interest in journalism?', answer: 'when a journalist\'s personal interests could affect their reporting', type: 'open', acceptedKeywords: ['personal', 'interest', 'affect', 'reporting', 'bias', 'conflict'] },
        { prompt: 'Should journalists protect their sources?', answer: 'yes protecting sources encourages whistleblowers and ensures a free flow of information', type: 'open', acceptedKeywords: ['yes', 'protect', 'source', 'whistleblower', 'free', 'information'] },
        { prompt: 'What ethical dilemma do journalists face when reporting on victims?', answer: 'balancing the public\'s right to know with the victim\'s privacy and dignity', type: 'open', acceptedKeywords: ['balance', 'public', 'right', 'privacy', 'dignity', 'victim'] },
        { prompt: 'What is the role of a press council or ombudsman?', answer: 'to handle complaints about media coverage and uphold standards', type: 'open', acceptedKeywords: ['complaint', 'coverage', 'standard', 'uphold', 'handle', 'oversight'] },
        { prompt: 'How should journalists handle breaking news when facts are uncertain?', answer: 'report what is confirmed clearly label what is unconfirmed and correct errors quickly', type: 'open', acceptedKeywords: ['confirmed', 'label', 'unconfirmed', 'correct', 'error', 'quick'] },
      ],
    },
    'press-and-democracy': {
      items: [
        { prompt: 'Why is a free press considered essential for democracy?', answer: 'it informs citizens holds government accountable and enables public debate', type: 'open', acceptedKeywords: ['inform', 'citizen', 'accountab', 'government', 'debate', 'public'] },
        { prompt: 'What does the First Amendment say about the press?', answer: 'Congress shall make no law abridging the freedom of the press', type: 'open', acceptedKeywords: ['freedom', 'press', 'Congress', 'law', 'First Amendment', 'abridge'] },
        { prompt: 'What is censorship?', answer: 'the suppression of information or expression by authorities', type: 'open', acceptedKeywords: ['suppress', 'information', 'expression', 'author', 'control', 'block'] },
        { prompt: 'How do authoritarian governments control the press?', answer: 'through censorship state-owned media and intimidation of journalists', type: 'open', acceptedKeywords: ['censorship', 'state-owned', 'intimidat', 'control', 'jail', 'ban'] },
        { prompt: 'What is press freedom and why does it matter?', answer: 'the ability of journalists to report freely which is essential for an informed citizenry', type: 'open', acceptedKeywords: ['freely', 'report', 'essential', 'informed', 'citizen', 'ability'] },
        { prompt: 'How can citizens support press freedom?', answer: 'by supporting quality journalism staying informed and defending press rights', type: 'open', acceptedKeywords: ['support', 'quality', 'journalism', 'informed', 'defend', 'rights'] },
      ],
    },
    'censorship': {
      items: [
        { prompt: 'What are different forms of censorship?', answer: 'government censorship self-censorship and corporate censorship', type: 'open', acceptedKeywords: ['government', 'self', 'corporate', 'censor', 'form', 'type'] },
        { prompt: 'What is self-censorship?', answer: 'when people or journalists avoid certain topics out of fear', type: 'open', acceptedKeywords: ['avoid', 'topic', 'fear', 'self', 'censor', 'choose'] },
        { prompt: 'How does internet censorship work in some countries?', answer: 'governments block websites filter content and monitor online activity', type: 'open', acceptedKeywords: ['block', 'website', 'filter', 'monitor', 'government', 'control'] },
        { prompt: 'What is the Great Firewall?', answer: 'China\'s internet censorship system that blocks access to many foreign websites', type: 'open', acceptedKeywords: ['China', 'internet', 'block', 'foreign', 'website', 'censor'] },
        { prompt: 'Is content moderation the same as censorship?', answer: 'not always — moderation can protect against harm while censorship suppresses speech', type: 'open', acceptedKeywords: ['not always', 'moderat', 'harm', 'protect', 'speech', 'different'] },
        { prompt: 'How can VPNs help people in censored countries?', answer: 'they allow access to blocked websites by routing traffic through other countries', type: 'open', acceptedKeywords: ['access', 'blocked', 'route', 'traffic', 'countries', 'bypass'] },
      ],
    },
    'information-access': {
      items: [
        { prompt: 'What is the digital divide?', answer: 'the gap between people who have access to technology and those who do not', type: 'open', acceptedKeywords: ['gap', 'access', 'technology', 'have', 'not', 'divide'] },
        { prompt: 'How does the digital divide affect access to information?', answer: 'people without internet access cannot access online news education or resources', type: 'open', acceptedKeywords: ['internet', 'access', 'news', 'education', 'resource', 'cannot'] },
        { prompt: 'What is net neutrality?', answer: 'the principle that internet providers should treat all content equally', type: 'open', acceptedKeywords: ['internet', 'provider', 'equally', 'content', 'treat', 'neutral'] },
        { prompt: 'Why is equal access to information important for democracy?', answer: 'because informed citizens need access to diverse information to participate', type: 'open', acceptedKeywords: ['informed', 'citizen', 'access', 'diverse', 'participate', 'democracy'] },
        { prompt: 'What is an information ecosystem?', answer: 'the interconnected network of sources platforms and consumers of information', type: 'open', acceptedKeywords: ['network', 'source', 'platform', 'consumer', 'interconnect', 'ecosystem'] },
        { prompt: 'How can communities bridge the digital divide?', answer: 'through public libraries community Wi-Fi and digital literacy programs', type: 'open', acceptedKeywords: ['library', 'community', 'Wi-Fi', 'digital literacy', 'program', 'access'] },
      ],
    },
  },
};

const NEWS_SCENARIOS = {
  'kindergarten': [
    { title: 'The New Playground', description: 'Your town is building a new playground! The local news has a story about it with pictures. Let\'s look at the story together. What do you see? Who is building it? Where will it be?', discussion: 'Practice identifying real news about the community.' },
    { title: 'The Weather Report', description: 'The weather person says a big storm is coming tomorrow. How does the weather report help us? What should we do to get ready?', discussion: 'News helps us prepare and stay safe.' },
  ],
  'grade-1': [
    { title: 'School Spirit Day', description: 'Your school announces Spirit Day next Friday. Is this news or a story? Who made this announcement? Why is it happening?', discussion: 'Practice identifying school news and the 5 W\'s.' },
    { title: 'The Community Hero', description: 'A neighbor rescued a dog stuck in a storm drain. The local paper wrote about it. What makes this person a hero? Is this fact or fiction?', discussion: 'Real heroes in our community.' },
  ],
  'grade-2': [
    { title: 'Two Reports About the Same Event', description: 'Two different news sources report on the school science fair. One focuses on the winners. The other focuses on how many students participated. Both are true. How can two true stories be different?', discussion: 'Different sources emphasize different things.' },
    { title: 'Fact Detective', description: 'Read these statements about animals. Sort them into FACTS and OPINIONS. "Elephants are the largest land animals" (fact). "Elephants are the coolest animals" (opinion).', discussion: 'Practice distinguishing facts from opinions.' },
  ],
  'grade-3': [
    { title: 'The Lunchroom Debate', description: 'The school is considering changing the lunch menu. The school newspaper has an article with facts about nutrition AND an editorial with opinions. Can you separate the facts from the opinions?', discussion: 'Identifying facts and opinions in real articles.' },
    { title: 'Follow the Story', description: 'A local park needs repairs. Follow the news story through the 5 W\'s and ask deeper questions: Who decides? Where does the money come from? When will it happen?', discussion: 'Asking deeper questions about community news.' },
  ],
  'grade-4': [
    { title: 'Who Made This?', description: 'Three different websites report on the same environmental issue. One is from a newspaper, one from a company, and one from a blog. How do you evaluate which is most reliable?', discussion: 'Source evaluation skills.' },
  ],
  'grade-5': [
    { title: 'The SIFT Test', description: 'A social media post claims a new study proves video games make kids smarter. Use the SIFT method: Stop, Investigate the source, Find better coverage, Trace the claim. What do you find?', discussion: 'Applying SIFT to evaluate media claims.' },
  ],
  'grade-6': [
    { title: 'Spot the Propaganda', description: 'Examine three different advertisements. Which propaganda techniques do they use? Bandwagon? Testimonial? Fear? How do these techniques try to influence you?', discussion: 'Identifying propaganda techniques in media.' },
  ],
  'grade-7': [
    { title: 'The Filter Bubble Experiment', description: 'Two students search for the same topic on their phones. They get different results. Why? How do algorithms decide what you see? Is this a problem?', discussion: 'Understanding how algorithms shape our news.' },
  ],
  'grade-8': [
    { title: 'Data in the News', description: 'A news headline says "Crime Skyrockets 50%!" But the actual numbers went from 2 incidents to 3. Is the headline misleading? How can data be used to mislead?', discussion: 'Critical data literacy and misleading statistics.' },
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

class CurrentEvents {
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

  getNews(grade) {
    const scenarios = NEWS_SCENARIOS[grade];
    if (!scenarios) return { error: `No news scenarios for ${grade}. Available: ${Object.keys(NEWS_SCENARIOS).join(', ')}` };
    return pick(scenarios, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const scenario = NEWS_SCENARIOS[grade] ? pick(NEWS_SCENARIOS[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, newsScenario: scenario,
      lessonPlan: {
        review: 'Review previously learned media literacy skills (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: scenario ? `News analysis: "${scenario.title}"` : 'Apply media literacy to a real news example',
        reflect: 'What questions should you always ask about news?',
      },
    };
  }
}

module.exports = CurrentEvents;

// CLI: node current-events.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new CurrentEvents();
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
      case 'news': { const [, g] = args; if (!g) throw new Error('Usage: news <grade>'); out(api.getNews(g)); break; }
      default: out({ usage: 'node current-events.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','news'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
