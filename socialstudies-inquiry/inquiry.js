// eClaw Social Studies Inquiry & Evidence Interactive Tutor (K-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'socialstudies-inquiry');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'see-think-wonder': ['what-do-you-see', 'what-do-you-think', 'what-do-you-wonder'],
    'how-do-we-know': ['asking-how-we-know', 'sources-of-info'],
    'sequencing': ['first-next-last', 'ordering-events'],
  },
  'grade-1': {
    'see-think-wonder': ['detailed-observations', 'making-inferences'],
    'i-wonder-questions': ['asking-good-questions', 'big-vs-small-questions'],
    'sources-of-info': ['people-as-sources', 'books-and-pictures'],
  },
  'grade-2': {
    'primary-secondary': ['what-is-primary-source', 'what-is-secondary-source', 'telling-them-apart'],
    'five-ws-of-sources': ['who-made-it', 'when-was-it-made', 'why-was-it-made'],
    'simple-evidence': ['finding-evidence', 'using-evidence'],
  },
  'grade-3': {
    'supporting-questions': ['breaking-down-questions', 'research-questions'],
    'source-types': ['documents', 'artifacts', 'interviews'],
    'evidence-based-claims': ['making-claims', 'supporting-with-evidence'],
  },
  'grade-4': {
    'source-reliability': ['evaluating-sources', 'author-purpose', 'comparing-accounts'],
    'corroboration': ['checking-multiple-sources', 'finding-agreement'],
    'compelling-questions': ['what-makes-compelling', 'driving-inquiry'],
  },
  'grade-5': {
    'cer-arguments': ['claim-evidence-reasoning', 'building-arguments'],
    'soapstone-intro': ['speaker-occasion-audience', 'purpose-subject-tone'],
    'research-skills': ['finding-sources', 'note-taking', 'avoiding-plagiarism'],
  },
  'grade-6': {
    'full-source-analysis': ['document-analysis', 'image-analysis', 'data-analysis'],
    'evaluating-bias': ['identifying-bias', 'perspective-and-bias', 'media-bias'],
    'constructing-arguments': ['thesis-statements', 'evidence-selection', 'counterarguments'],
  },
  'grade-7': {
    'historiography': ['how-history-is-written', 'changing-interpretations'],
    'research-methods': ['research-design', 'primary-source-research', 'digital-research'],
    'synthesizing-sources': ['comparing-perspectives', 'building-narrative', 'drawing-conclusions'],
    'academic-argument': ['academic-writing', 'citing-evidence', 'logical-reasoning'],
  },
  'grade-8': {
    'advanced-analysis': ['contextualizing-sources', 'evaluating-interpretations', 'historiographic-debate'],
    'independent-research': ['research-questions', 'methodology', 'presenting-findings'],
    'civic-argumentation': ['evidence-based-policy', 'taking-informed-action', 'democratic-deliberation'],
  },
};

const CONTENT_BANKS = {
  'kindergarten': {
    'what-do-you-see': {
      items: [
        { prompt: 'Look at a picture of a family eating dinner. What do you see?', answer: 'people food table', type: 'open', acceptedKeywords: ['people', 'food', 'table', 'eat', 'family', 'plate', 'sit'] },
        { prompt: 'Why is it important to look carefully before deciding what something means?', answer: 'so you notice all the details', type: 'open', acceptedKeywords: ['detail', 'notice', 'see', 'careful', 'look', 'miss'] },
        { prompt: 'What is the difference between what you SEE and what you THINK?', answer: 'see is what is actually there and think is your idea about it', type: 'open', acceptedKeywords: ['actually', 'there', 'idea', 'real', 'think', 'guess', 'opinion'] },
        { prompt: 'If you see a picture of a sunny day with people at a beach, what do you observe?', answer: 'sun beach people water sand', type: 'open', acceptedKeywords: ['sun', 'beach', 'people', 'water', 'sand', 'wave'] },
        { prompt: 'Can two people see different things in the same picture?', answer: 'yes because they might notice different details', type: 'open', acceptedKeywords: ['yes', 'different', 'notice', 'detail', 'look'] },
      ],
    },
    'what-do-you-think': {
      items: [
        { prompt: 'You see a picture of a child with a frown. What do you THINK is happening?', answer: 'the child might be sad or upset', type: 'open', acceptedKeywords: ['sad', 'upset', 'unhappy', 'cry', 'mad', 'hurt'] },
        { prompt: 'Is what you think always right?', answer: 'no you need more information to be sure', type: 'open', acceptedKeywords: ['no', 'not always', 'information', 'check', 'maybe', 'might'] },
        { prompt: 'You see a picture of an old house. What do you think about it?', answer: 'any inference about the house', type: 'open', acceptedKeywords: ['old', 'long ago', 'people', 'lived', 'built', 'history'] },
        { prompt: 'What is the difference between what you see and what you think?', answer: 'seeing is observing and thinking is making guesses about what it means', type: 'open', acceptedKeywords: ['observ', 'guess', 'mean', 'see', 'think', 'inference'] },
        { prompt: 'Why should you share what you think?', answer: 'to hear if others agree or have different ideas', type: 'open', acceptedKeywords: ['others', 'agree', 'different', 'share', 'idea', 'discuss', 'learn'] },
      ],
    },
    'what-do-you-wonder': {
      items: [
        { prompt: 'You see a picture of a very old map. What do you wonder about it?', answer: 'who made it when was it made what places does it show', type: 'open', acceptedKeywords: ['who', 'when', 'what', 'where', 'why', 'how', 'wonder'] },
        { prompt: 'Why is wondering important?', answer: 'it leads to learning and discovery', type: 'open', acceptedKeywords: ['learn', 'discover', 'find out', 'question', 'curious', 'know'] },
        { prompt: 'What is a wonder question?', answer: 'a question you are curious about', type: 'open', acceptedKeywords: ['question', 'curious', 'want to know', 'wonder', 'ask'] },
        { prompt: 'How can you find answers to your wonder questions?', answer: 'ask someone look it up or investigate', type: 'open', acceptedKeywords: ['ask', 'look', 'book', 'investigate', 'research', 'search', 'find'] },
        { prompt: 'What is something you wonder about the world?', answer: 'any genuine question', type: 'open', acceptedKeywords: ['why', 'how', 'what', 'where', 'when', 'wonder', 'question'] },
      ],
    },
    'asking-how-we-know': {
      items: [
        { prompt: 'If someone tells you a fact, what should you ask?', answer: 'how do you know that', type: 'open', acceptedKeywords: ['how', 'know', 'where', 'learn', 'source', 'sure', 'proof'] },
        { prompt: 'How do we know dinosaurs existed?', answer: 'from fossils and bones scientists found', type: 'open', acceptedKeywords: ['fossil', 'bone', 'scientist', 'found', 'evidence', 'dug'] },
        { prompt: 'How do we know what happened long ago?', answer: 'from books stories pictures and objects left behind', type: 'open', acceptedKeywords: ['book', 'story', 'picture', 'object', 'artifact', 'record', 'left behind'] },
        { prompt: 'Is it okay to say "I don\'t know" if you are not sure?', answer: 'yes it is honest and you can then try to find out', type: 'open', acceptedKeywords: ['yes', 'honest', 'find out', 'okay', 'learn', 'research'] },
        { prompt: '"How do we know?" is one of the most important questions. Why?', answer: 'because it helps us make sure information is true', type: 'open', acceptedKeywords: ['true', 'sure', 'check', 'information', 'reliable', 'accurate', 'proof'] },
      ],
    },
    'sources-of-info': {
      items: [
        { prompt: 'Where can you find information?', answer: 'books people internet and observation', type: 'open', acceptedKeywords: ['book', 'people', 'internet', 'observ', 'library', 'teacher', 'parent'] },
        { prompt: 'Who can you ask if you have a question?', answer: 'a teacher parent librarian or expert', type: 'open', acceptedKeywords: ['teacher', 'parent', 'librarian', 'expert', 'adult'] },
        { prompt: 'Is everything you read or hear true?', answer: 'no you should check information', type: 'open', acceptedKeywords: ['no', 'check', 'not always', 'verify', 'make sure'] },
        { prompt: 'What is a source?', answer: 'a place or person you get information from', type: 'open', acceptedKeywords: ['place', 'person', 'information', 'from', 'get', 'where'] },
        { prompt: 'Why is it good to use more than one source?', answer: 'to make sure the information is correct', type: 'open', acceptedKeywords: ['sure', 'correct', 'check', 'accurate', 'verify', 'compare'] },
      ],
    },
    'first-next-last': {
      items: [
        { prompt: 'What does "sequence" mean?', answer: 'the order things happen in', type: 'open', acceptedKeywords: ['order', 'happen', 'first', 'next', 'last', 'arrange'] },
        { prompt: 'Put in order: You eat breakfast, you wake up, you brush your teeth.', answer: 'wake up eat breakfast brush teeth', type: 'open', acceptedKeywords: ['wake', 'first', 'breakfast', 'then', 'brush', 'last'] },
        { prompt: 'What signal words help us know the order?', answer: 'first next then finally', type: 'open', acceptedKeywords: ['first', 'next', 'then', 'finally', 'last', 'after', 'before'] },
        { prompt: 'Why is order important in telling a story?', answer: 'so it makes sense', type: 'open', acceptedKeywords: ['sense', 'understand', 'follow', 'order', 'know', 'clear'] },
        { prompt: 'What comes first in your school day?', answer: 'arrival or morning meeting', type: 'open', acceptedKeywords: ['arrive', 'morning', 'meet', 'bell', 'come', 'first', 'start'] },
      ],
    },
    'ordering-events': {
      items: [
        { prompt: 'If event A happened in 2020 and event B happened in 2010, which came first?', answer: 'event b', type: 'open', acceptedKeywords: ['b', 'event b', '2010'] },
        { prompt: 'What tool helps us put events in order?', answer: 'a timeline', type: 'open', acceptedKeywords: ['timeline'] },
        { prompt: 'Put in order: the American Revolution, the moon landing, Christopher Columbus sails to America.', answer: 'columbus then revolution then moon landing', type: 'open', acceptedKeywords: ['columbus', 'first', 'revolution', 'moon', 'last'] },
        { prompt: 'Does the order of events matter in history?', answer: 'yes because one event can cause another', type: 'open', acceptedKeywords: ['yes', 'cause', 'matter', 'order', 'import', 'affect'] },
        { prompt: 'What is chronological order?', answer: 'arranging events from earliest to latest', type: 'open', acceptedKeywords: ['earliest', 'latest', 'order', 'time', 'first', 'last', 'date'] },
      ],
    },
  },
  'grade-1': {
    'detailed-observations': {
      items: [
        { prompt: 'How can you make a more detailed observation?', answer: 'look more carefully and describe specific things', type: 'open', acceptedKeywords: ['careful', 'specific', 'detail', 'describe', 'close', 'look', 'notice'] },
        { prompt: 'You observe an old photograph. Name 3 things to look for.', answer: 'people clothes setting', type: 'open', acceptedKeywords: ['people', 'cloth', 'setting', 'background', 'object', 'face', 'expression'] },
        { prompt: 'What is the difference between a quick look and a careful observation?', answer: 'a careful observation notices more details', type: 'open', acceptedKeywords: ['detail', 'more', 'careful', 'notice', 'time', 'thorough'] },
        { prompt: 'Why do historians look carefully at objects from the past?', answer: 'to learn about how people lived', type: 'open', acceptedKeywords: ['learn', 'people', 'lived', 'past', 'history', 'understand'] },
        { prompt: 'If you found an old coin, what observations would you make?', answer: 'what is on it how old is it what country is it from', type: 'open', acceptedKeywords: ['old', 'country', 'date', 'picture', 'word', 'metal', 'size'] },
      ],
    },
    'making-inferences': {
      items: [
        { prompt: 'What is an inference?', answer: 'a conclusion based on evidence and reasoning', type: 'open', acceptedKeywords: ['conclusion', 'evidence', 'reason', 'guess', 'think', 'based on'] },
        { prompt: 'You see old farm tools in a museum. What can you infer?', answer: 'people farmed by hand without machines', type: 'open', acceptedKeywords: ['farm', 'hand', 'no machine', 'work', 'manual', 'old'] },
        { prompt: 'A photo shows a family in heavy coats. What can you infer about the weather?', answer: 'it is cold', type: 'open', acceptedKeywords: ['cold', 'winter', 'chilly', 'cool'] },
        { prompt: 'Is an inference the same as a guess?', answer: 'no an inference is based on evidence while a guess has no evidence', type: 'open', acceptedKeywords: ['no', 'evidence', 'based on', 'not just', 'reason', 'support'] },
        { prompt: 'How can you check if your inference is correct?', answer: 'find more evidence or information', type: 'open', acceptedKeywords: ['evidence', 'information', 'check', 'find', 'more', 'source'] },
      ],
    },
    'asking-good-questions': {
      items: [
        { prompt: 'What makes a good question?', answer: 'it cannot be answered with just yes or no and it leads to investigation', type: 'open', acceptedKeywords: ['not yes no', 'investigat', 'think', 'open', 'research', 'lead', 'explore'] },
        { prompt: 'Which is a better question? A) "Did Columbus sail to America?" B) "Why did Columbus sail to America?"', answer: 'b', type: 'multiple-choice' },
        { prompt: 'What word do many good questions start with?', answer: 'why how or what', type: 'open', acceptedKeywords: ['why', 'how', 'what'] },
        { prompt: 'Turn "George Washington was president" into a question.', answer: 'what did george washington do as president or why was he important', type: 'open', acceptedKeywords: ['what', 'why', 'how', 'washington', 'president'] },
        { prompt: 'Why is asking questions important for learning?', answer: 'it drives curiosity and helps you discover new things', type: 'open', acceptedKeywords: ['curiosity', 'discover', 'learn', 'new', 'find', 'understand'] },
      ],
    },
    'big-vs-small-questions': {
      items: [
        { prompt: 'What is a "big question" in social studies?', answer: 'a question that requires deep thinking and has many possible answers', type: 'open', acceptedKeywords: ['deep', 'think', 'many', 'answer', 'complex', 'big', 'explore'] },
        { prompt: 'What is a "small question"?', answer: 'a question with a simple factual answer', type: 'open', acceptedKeywords: ['simple', 'fact', 'answer', 'one', 'quick', 'easy'] },
        { prompt: '"When was the Declaration of Independence signed?" — big or small question?', answer: 'small because it has one factual answer', type: 'open', acceptedKeywords: ['small', 'fact', 'one', 'answer'] },
        { prompt: '"Why is freedom important?" — big or small question?', answer: 'big because it requires deep thinking and has many perspectives', type: 'open', acceptedKeywords: ['big', 'deep', 'think', 'many', 'perspect'] },
        { prompt: 'Do we need both big and small questions?', answer: 'yes small questions give facts and big questions help us understand meaning', type: 'open', acceptedKeywords: ['yes', 'both', 'fact', 'meaning', 'understand', 'need'] },
      ],
    },
    'people-as-sources': {
      items: [
        { prompt: 'How can people be sources of information?', answer: 'they can share their experiences and knowledge', type: 'open', acceptedKeywords: ['experience', 'knowledge', 'share', 'tell', 'know', 'remember', 'story'] },
        { prompt: 'What is an interview?', answer: 'asking someone questions to learn from them', type: 'open', acceptedKeywords: ['ask', 'question', 'learn', 'person', 'talk'] },
        { prompt: 'Who would be a good person to ask about life 50 years ago?', answer: 'a grandparent or older person who lived during that time', type: 'open', acceptedKeywords: ['grandparent', 'older', 'lived', 'elder', 'senior'] },
        { prompt: 'Is everything a person tells you always accurate?', answer: 'not always because memories can be different from what really happened', type: 'open', acceptedKeywords: ['not always', 'memory', 'different', 'forget', 'perspective', 'bias'] },
        { prompt: 'Why is it good to talk to more than one person about the same event?', answer: 'to get different perspectives and more complete information', type: 'open', acceptedKeywords: ['different', 'perspective', 'complete', 'more', 'compare', 'view'] },
      ],
    },
    'books-and-pictures': {
      items: [
        { prompt: 'How can books help us learn about the past?', answer: 'they contain information stories and records from the past', type: 'open', acceptedKeywords: ['information', 'story', 'record', 'past', 'history', 'fact'] },
        { prompt: 'What can you learn from an old photograph?', answer: 'what people looked like how they dressed and where they lived', type: 'open', acceptedKeywords: ['people', 'looked', 'dressed', 'lived', 'place', 'time', 'clothing'] },
        { prompt: 'Are all books equally reliable?', answer: 'no some are more carefully researched than others', type: 'open', acceptedKeywords: ['no', 'research', 'some', 'reliable', 'different', 'careful', 'check'] },
        { prompt: 'Can a picture tell you something a book cannot?', answer: 'yes pictures show you exactly what things looked like', type: 'open', acceptedKeywords: ['yes', 'show', 'look', 'visual', 'see', 'exact'] },
        { prompt: 'What is a nonfiction book?', answer: 'a book about real things and facts', type: 'open', acceptedKeywords: ['real', 'fact', 'true', 'not fiction', 'information'] },
      ],
    },
  },
  'grade-2': {
    'what-is-primary-source': {
      items: [
        { prompt: 'What is a primary source?', answer: 'a firsthand account or original document from the time of an event', type: 'open', acceptedKeywords: ['firsthand', 'original', 'time', 'event', 'from', 'direct', 'was there'] },
        { prompt: 'Is a diary from the 1800s a primary source?', answer: 'yes', type: 'exact' },
        { prompt: 'Give an example of a primary source.', answer: 'a letter photograph diary or artifact from the time period', type: 'open', acceptedKeywords: ['letter', 'photo', 'diary', 'artifact', 'document', 'map', 'speech'] },
        { prompt: 'Why are primary sources important?', answer: 'they come directly from the time and give firsthand information', type: 'open', acceptedKeywords: ['direct', 'firsthand', 'time', 'real', 'original', 'actual'] },
        { prompt: 'Can a primary source be wrong or biased?', answer: 'yes because the person who made it had their own perspective', type: 'open', acceptedKeywords: ['yes', 'perspective', 'bias', 'opinion', 'view', 'one side'] },
      ],
    },
    'what-is-secondary-source': {
      items: [
        { prompt: 'What is a secondary source?', answer: 'a source that describes or interprets events but was not created at the time', type: 'open', acceptedKeywords: ['describe', 'interpret', 'not there', 'after', 'about', 'written later'] },
        { prompt: 'Is a history textbook a primary or secondary source?', answer: 'secondary', type: 'exact' },
        { prompt: 'Give an example of a secondary source.', answer: 'a textbook documentary or encyclopedia', type: 'open', acceptedKeywords: ['textbook', 'documentary', 'encyclopedia', 'biography', 'article', 'website'] },
        { prompt: 'Why are secondary sources useful?', answer: 'they help explain and organize information from many primary sources', type: 'open', acceptedKeywords: ['explain', 'organize', 'many', 'primary', 'understand', 'summary'] },
        { prompt: 'Can a secondary source be wrong?', answer: 'yes the author might have made errors or have their own perspective', type: 'open', acceptedKeywords: ['yes', 'error', 'perspective', 'wrong', 'bias', 'mistake'] },
      ],
    },
    'telling-them-apart': {
      items: [
        { prompt: 'A soldier\'s letter from World War II — primary or secondary?', answer: 'primary', type: 'exact' },
        { prompt: 'A book about World War II written in 2020 — primary or secondary?', answer: 'secondary', type: 'exact' },
        { prompt: 'A photograph taken during the Civil War — primary or secondary?', answer: 'primary', type: 'exact' },
        { prompt: 'An encyclopedia entry about Abraham Lincoln — primary or secondary?', answer: 'secondary', type: 'exact' },
        { prompt: 'How do you decide if something is a primary or secondary source?', answer: 'ask if it was created at the time of the event by someone who was there', type: 'open', acceptedKeywords: ['time', 'event', 'there', 'created', 'firsthand', 'when', 'who'] },
      ],
    },
    'who-made-it': {
      items: [
        { prompt: 'Why is it important to know WHO made a source?', answer: 'because who made it affects what information it contains', type: 'open', acceptedKeywords: ['who', 'affect', 'information', 'perspective', 'bias', 'trust', 'reliable'] },
        { prompt: 'If a candy company says candy is healthy, should you believe them?', answer: 'you should be skeptical because they want to sell candy', type: 'open', acceptedKeywords: ['skeptic', 'sell', 'bias', 'money', 'interest', 'not trust', 'careful'] },
        { prompt: 'What is the author\'s perspective?', answer: 'the way the author sees things based on their experiences', type: 'open', acceptedKeywords: ['way', 'see', 'experience', 'view', 'opinion', 'position', 'background'] },
        { prompt: 'Does the author\'s perspective matter?', answer: 'yes it shapes what they include and leave out', type: 'open', acceptedKeywords: ['yes', 'shape', 'include', 'leave out', 'matter', 'affect', 'influence'] },
        { prompt: 'What questions should you ask about who made a source?', answer: 'who are they what do they know and why did they make it', type: 'open', acceptedKeywords: ['who', 'know', 'why', 'expert', 'qualif', 'purpose', 'reason'] },
      ],
    },
    'when-was-it-made': {
      items: [
        { prompt: 'Why does it matter WHEN a source was made?', answer: 'because information and perspectives change over time', type: 'open', acceptedKeywords: ['change', 'time', 'information', 'perspective', 'different', 'when'] },
        { prompt: 'Is a source from the 1950s about civil rights likely to be different from one written today?', answer: 'yes because perspectives on civil rights have changed', type: 'open', acceptedKeywords: ['yes', 'different', 'changed', 'perspective', 'time'] },
        { prompt: 'Are older sources always less reliable?', answer: 'no but you should consider the time period they were made in', type: 'open', acceptedKeywords: ['no', 'consider', 'time', 'period', 'context', 'not always'] },
        { prompt: 'Why might a source written right after an event be different from one written years later?', answer: 'the immediate source has fresh details but the later one has more perspective', type: 'open', acceptedKeywords: ['fresh', 'detail', 'later', 'perspective', 'time', 'different', 'more information'] },
        { prompt: 'What is historical context?', answer: 'understanding the time and place in which something happened', type: 'open', acceptedKeywords: ['time', 'place', 'understanding', 'when', 'where', 'situation', 'period'] },
      ],
    },
    'why-was-it-made': {
      items: [
        { prompt: 'Why is it important to know WHY a source was made?', answer: 'because the purpose affects what information is included', type: 'open', acceptedKeywords: ['purpose', 'affect', 'information', 'include', 'reason', 'why'] },
        { prompt: 'A political poster was made to ___?', answer: 'persuade or convince people', type: 'open', acceptedKeywords: ['persuad', 'convinc', 'influence', 'support', 'vote'] },
        { prompt: 'A diary was written to ___?', answer: 'record personal thoughts and experiences', type: 'open', acceptedKeywords: ['record', 'personal', 'thought', 'experience', 'private', 'remember'] },
        { prompt: 'An advertisement was made to ___?', answer: 'sell a product', type: 'open', acceptedKeywords: ['sell', 'product', 'buy', 'money', 'convince'] },
        { prompt: 'If you know why something was made, what does it help you understand?', answer: 'whether the information might be biased', type: 'open', acceptedKeywords: ['bias', 'trust', 'reliable', 'one-sided', 'perspective', 'purpose'] },
      ],
    },
    'finding-evidence': {
      items: [
        { prompt: 'What is evidence in social studies?', answer: 'information that supports or proves a claim', type: 'open', acceptedKeywords: ['information', 'support', 'prove', 'claim', 'fact', 'data'] },
        { prompt: 'Where can you find evidence about the past?', answer: 'in primary and secondary sources', type: 'open', acceptedKeywords: ['primary', 'secondary', 'source', 'document', 'artifact', 'book'] },
        { prompt: 'Is one piece of evidence enough?', answer: 'usually no you need multiple pieces of evidence', type: 'open', acceptedKeywords: ['no', 'multiple', 'more', 'not enough', 'several'] },
        { prompt: 'What makes evidence strong?', answer: 'it is reliable comes from a trustworthy source and can be verified', type: 'open', acceptedKeywords: ['reliable', 'trustworthy', 'verified', 'multiple', 'source', 'check'] },
        { prompt: 'Can evidence be a photograph?', answer: 'yes photographs can be evidence of what things looked like', type: 'open', acceptedKeywords: ['yes', 'photograph', 'picture', 'visual', 'evidence'] },
      ],
    },
    'using-evidence': {
      items: [
        { prompt: 'How do you use evidence to answer a question?', answer: 'find relevant evidence and explain how it answers the question', type: 'open', acceptedKeywords: ['find', 'relevant', 'explain', 'answer', 'support', 'show'] },
        { prompt: 'If your claim is "Ancient Egyptians built pyramids," what evidence would you need?', answer: 'archaeological evidence photographs or historical records', type: 'open', acceptedKeywords: ['archaeolog', 'photograph', 'record', 'artifact', 'document', 'source'] },
        { prompt: 'What should you do if evidence contradicts your claim?', answer: 'reconsider your claim and look at all the evidence', type: 'open', acceptedKeywords: ['reconsider', 'change', 'look', 'evidence', 'revise', 'think'] },
        { prompt: 'Why is it important to cite your evidence?', answer: 'so others can check your sources and verify the information', type: 'open', acceptedKeywords: ['check', 'source', 'verify', 'others', 'trust', 'credit'] },
        { prompt: 'What is the difference between evidence and opinion?', answer: 'evidence is based on facts and opinion is what someone believes', type: 'open', acceptedKeywords: ['fact', 'believe', 'based on', 'proven', 'think', 'personal'] },
      ],
    },
  },
};

const SOURCES = {
  'kindergarten': [
    { title: 'The Old Photograph', description: 'Look at this photograph from 100 years ago. It shows a family standing in front of a small house. The children are wearing old-fashioned clothes. There is a horse and wagon nearby. No cars! What do you SEE? What do you THINK? What do you WONDER?', protocol: 'See-Think-Wonder: First describe what you see, then share what you think it means, then ask questions.' },
    { title: 'The Mystery Object', description: 'You found an old object in a museum: it is made of metal, has a handle, and a flat bottom with small holes in it. (It is an old-fashioned iron for pressing clothes.) What do you see? What do you think it was used for? What do you wonder about it?', protocol: 'Careful observation leads to better inferences.' },
  ],
  'grade-1': [
    { title: 'The Letter from Long Ago', description: 'Here is a letter written by a child in 1920. The child writes about riding a horse to school, doing chores on the farm, and playing marbles with friends. How is this child\'s life similar to yours? How is it different? What questions would you ask this child?', protocol: 'Compare past and present using a primary source.' },
    { title: 'The Community Map', description: 'Look at two maps of the same town: one from 1900 and one from today. The old map shows farms, a church, and a general store. The new map shows houses, a mall, and many roads. What changed? What stayed the same? Why did things change?', protocol: 'Compare sources to understand change over time.' },
  ],
  'grade-2': [
    { title: 'The Two Accounts', description: 'Two people describe the same event: a new park opening. The mayor says "This wonderful park will bring joy to all families." A neighbor says "The new park is noisy and takes away our parking." Who made each source? Why do they disagree? Which is a fact and which is an opinion?', protocol: 'Use the 5 W\'s of sources to evaluate different perspectives.' },
    { title: 'The Old Artifact', description: 'A museum has an old tool made of stone. It was found near a river. Scientists say it is 5,000 years old. Is the stone tool a primary or secondary source? What is the scientist\'s report? What can this tool tell us about the people who made it?', protocol: 'Distinguish primary and secondary sources and make evidence-based inferences.' },
  ],
  'grade-3': [
    { title: 'The Research Challenge', description: 'You want to learn about the first people in your state. Where would you look? What would be a primary source? What would be a secondary source? How would you check if the information is accurate?', protocol: 'Plan a simple research inquiry using source types.' },
  ],
  'grade-4': [
    { title: 'The Conflicting Accounts', description: 'Read two accounts of the Boston Tea Party: one from a British newspaper and one from an American colonist\'s diary. How do they describe the same event differently? Which details agree? Which disagree? What might explain the differences?', protocol: 'Corroborate sources and evaluate reliability.' },
  ],
  'grade-5': [
    { title: 'The SOAPSTONE Analysis', description: 'Analyze the Declaration of Independence using SOAPSTONE: Who is the Speaker? What is the Occasion? Who is the Audience? What is the Purpose? What is the Subject? What is the Tone?', protocol: 'Full SOAPSTONE source analysis.' },
  ],
  'grade-6': [
    { title: 'The Biased Source', description: 'Compare a propaganda poster from World War II with a newspaper article from the same era. How does each source try to influence the viewer? What bias does each show? What information is missing from each?', protocol: 'Full source analysis with bias evaluation.' },
  ],
  'grade-7': [
    { title: 'The Historiographic Question', description: 'Three historians wrote about the causes of the American Revolution. One says it was about taxes. Another says it was about ideas of liberty. A third says it was about economic independence. How can all three be right? What does this tell us about how history is written?', protocol: 'Synthesis of multiple interpretations and historiographic thinking.' },
  ],
  'grade-8': [
    { title: 'The Independent Investigation', description: 'Choose a current policy issue (education, environment, immigration, etc). Find at least three sources representing different perspectives. Evaluate each for reliability and bias. Construct an evidence-based argument for a policy position.', protocol: 'Full C3 Inquiry Arc: Question, Investigate, Evaluate, Argue, Act.' },
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

class SocialStudiesInquiry {
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

  getSource(grade) {
    const sources = SOURCES[grade];
    if (!sources) return { error: `No sources for ${grade}. Available: ${Object.keys(SOURCES).join(', ')}` };
    return pick(sources, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const source = SOURCES[grade] ? pick(SOURCES[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, sourceActivity: source,
      lessonPlan: {
        review: 'Review previously learned inquiry skills (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: source ? `Source analysis: "${source.title}"` : 'Apply inquiry skills to a new question',
        reflect: 'What evidence did you use today?',
      },
    };
  }
}

module.exports = SocialStudiesInquiry;

// CLI: node inquiry.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new SocialStudiesInquiry();
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
      case 'source': { const [, g] = args; if (!g) throw new Error('Usage: source <grade>'); out(api.getSource(g)); break; }
      default: out({ usage: 'node inquiry.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','source'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
