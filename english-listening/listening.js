// English Listening Comprehension Lab (A1-C2). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'english-listening');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'a1': {
    'decoding': ['word-recognition', 'number-listening', 'alphabet-spelling'],
    'comprehension': ['simple-instructions', 'basic-gist', 'greeting-recognition'],
  },
  'a2': {
    'decoding': ['keyword-recognition', 'dialogue-gap-fill'],
    'comprehension': ['short-conversation', 'announcement', 'sequencing-events'],
    'connected-speech': ['contractions-listening', 'basic-reductions'],
  },
  'b1': {
    'decoding': ['dictation-sentences', 'connected-speech-intro'],
    'comprehension': ['main-idea-extraction', 'detail-questions', 'inference-basic'],
    'note-taking': ['note-completion', 'summary-completion'],
  },
  'b2': {
    'decoding': ['rapid-speech-decoding', 'accent-variation'],
    'comprehension': ['lecture-comprehension', 'attitude-recognition', 'implicit-meaning'],
    'note-taking': ['lecture-notes', 'argument-tracking'],
  },
  'c1': {
    'comprehension': ['complex-argument', 'multiple-speakers', 'irony-detection', 'academic-lecture'],
    'connected-speech': ['elision-recognition', 'assimilation-recognition'],
  },
  'c2': {
    'comprehension': ['dialectal-variation', 'nuanced-tone', 'advanced-inference', 'spontaneous-speech'],
  },
};

const ITEM_BANKS = {
  'a1': {
    'word-recognition': {
      type: 'dictation', instruction: 'Listen and write the word you hear.',
      items: [
        { prompt: 'The word is: "house"', answer: 'house' },
        { prompt: 'The word is: "water"', answer: 'water' },
        { prompt: 'The word is: "school"', answer: 'school' },
        { prompt: 'The word is: "happy"', answer: 'happy' },
        { prompt: 'The word is: "morning"', answer: 'morning' },
        { prompt: 'The word is: "children"', answer: 'children' },
        { prompt: 'The word is: "beautiful"', answer: 'beautiful' },
        { prompt: 'The word is: "telephone"', answer: 'telephone' },
      ],
    },
    'number-listening': {
      type: 'fill-in', instruction: 'Write the number you hear.',
      items: [
        { prompt: '"The train leaves at platform ___." (7)', answer: '7', options: ['5', '7', '9', '11'] },
        { prompt: '"There are ___ students in the class." (25)', answer: '25', options: ['15', '25', '35', '52'] },
        { prompt: '"The price is ___ dollars." (18)', answer: '18', options: ['8', '18', '80', '13'] },
        { prompt: '"My phone number is 555-___." (3492)', answer: '3492', options: ['3492', '3942', '3249', '3294'] },
        { prompt: '"The meeting is at ___ o\'clock." (3)', answer: '3', options: ['3', '4', '13', '30'] },
        { prompt: '"I need ___ eggs." (12)', answer: '12', options: ['2', '12', '20', '22'] },
        { prompt: '"She is ___ years old." (40)', answer: '40', options: ['14', '40', '44', '4'] },
        { prompt: '"The room number is ___." (315)', answer: '315', options: ['315', '350', '351', '305'] },
      ],
    },
    'alphabet-spelling': {
      type: 'dictation', instruction: 'Write the word being spelled out.',
      items: [
        { prompt: 'S-M-I-T-H', answer: 'smith' },
        { prompt: 'B-R-O-W-N', answer: 'brown' },
        { prompt: 'G-R-E-E-N', answer: 'green' },
        { prompt: 'W-H-I-T-E', answer: 'white' },
        { prompt: 'J-O-N-E-S', answer: 'jones' },
        { prompt: 'C-L-A-R-K', answer: 'clark' },
        { prompt: 'D-A-V-I-S', answer: 'davis' },
        { prompt: 'M-I-L-L-E-R', answer: 'miller' },
      ],
    },
    'simple-instructions': {
      type: 'comprehension', instruction: 'Listen and answer the question.',
      items: [
        { passage: 'Please open your books to page 10.', question: 'What should you do?', answer: 'Open books to page 10', options: ['Open books to page 10', 'Close your books', 'Write on page 10', 'Read page 20'] },
        { passage: 'Turn left at the bank, then go straight.', question: 'Where do you turn left?', answer: 'At the bank', options: ['At the bank', 'At the school', 'At the park', 'At the shop'] },
        { passage: 'Please sit down and wait for your name.', question: 'What should you do first?', answer: 'Sit down', options: ['Sit down', 'Stand up', 'Say your name', 'Leave the room'] },
        { passage: 'Write your name at the top of the page.', question: 'Where do you write your name?', answer: 'At the top of the page', options: ['At the top of the page', 'At the bottom', 'In the middle', 'On the back'] },
        { passage: 'Take the first road on the right.', question: 'Which road do you take?', answer: 'The first road on the right', options: ['The first road on the right', 'The second road', 'The road on the left', 'Go straight'] },
        { passage: 'Please close the window. It\'s cold.', question: 'Why should you close the window?', answer: "It's cold", options: ["It's cold", "It's hot", "It's raining", "It's noisy"] },
      ],
    },
    'basic-gist': {
      type: 'comprehension', instruction: 'What is this conversation mainly about?',
      items: [
        { passage: '"Hi, I\'d like a coffee please." "Sure, small or large?" "Large, please." "That\'s $4.50."', question: 'What is happening?', answer: 'Ordering coffee', options: ['Ordering coffee', 'Buying a book', 'At the doctor', 'At school'] },
        { passage: '"Excuse me, where is the bus stop?" "It\'s on the next street, turn right." "Thank you!"', question: 'What does the person want?', answer: 'To find the bus stop', options: ['To find the bus stop', 'To catch a taxi', 'To find a restaurant', 'To go home'] },
        { passage: '"How are you feeling today?" "Not great. I have a headache." "Take some medicine and rest."', question: 'What is the problem?', answer: 'The person has a headache', options: ['The person has a headache', 'The person is hungry', 'The person is lost', 'The person is late'] },
        { passage: '"What time does the film start?" "At 7:30." "Great, let\'s get tickets."', question: 'What are they planning?', answer: 'Going to a film', options: ['Going to a film', 'Eating dinner', 'Going shopping', 'Taking a bus'] },
        { passage: '"Good morning! Check-in for room 205." "Yes, here is your key. Breakfast is at 8."', question: 'Where is this?', answer: 'A hotel', options: ['A hotel', 'A restaurant', 'A school', 'An office'] },
        { passage: '"I\'d like to send this letter to France." "Sure, that\'s $2.50 for airmail."', question: 'Where is this?', answer: 'A post office', options: ['A post office', 'A bank', 'A shop', 'An airport'] },
      ],
    },
    'greeting-recognition': {
      type: 'fill-in', instruction: 'What is the best response?',
      items: [
        { prompt: '"How are you?"', answer: "I'm fine, thanks.", options: ["I'm fine, thanks.", "I'm 25.", 'Yes, please.', 'Goodbye.'] },
        { prompt: '"Nice to meet you."', answer: 'Nice to meet you too.', options: ['Nice to meet you too.', "I'm sorry.", 'Goodbye.', 'Thank you.'] },
        { prompt: '"See you later!"', answer: 'Bye! See you!', options: ['Bye! See you!', 'Nice to meet you.', 'How are you?', "I'm fine."] },
        { prompt: '"Good morning!"', answer: 'Good morning!', options: ['Good morning!', 'Good night!', 'Goodbye!', "I'm sorry."] },
        { prompt: '"Thank you very much."', answer: "You're welcome.", options: ["You're welcome.", "I'm sorry.", 'Hello.', 'Goodbye.'] },
        { prompt: '"How do you do?"', answer: 'How do you do?', options: ['How do you do?', "I'm doing homework.", "I'm 30.", 'Fine weather.'] },
      ],
    },
  },
  'a2': {
    'keyword-recognition': {
      type: 'comprehension', instruction: 'Listen for the key information.',
      items: [
        { passage: 'The train to Manchester departs from platform 6 at 14:30.', question: 'Which platform?', answer: 'Platform 6', options: ['Platform 6', 'Platform 4', 'Platform 16', 'Platform 3'] },
        { passage: 'Good evening. Tonight\'s special is grilled salmon with vegetables for $18.', question: 'How much is the special?', answer: '$18', options: ['$18', '$8', '$80', '$15'] },
        { passage: 'The museum is open Tuesday to Sunday, 9 AM to 5 PM. It is closed on Mondays.', question: 'When is it closed?', answer: 'Mondays', options: ['Mondays', 'Sundays', 'Tuesdays', 'Saturdays'] },
        { passage: 'Flight BA245 to New York is delayed by two hours. New departure time: 16:00.', question: 'How long is the delay?', answer: 'Two hours', options: ['Two hours', 'One hour', 'Three hours', 'Four hours'] },
        { passage: 'The weather forecast: sunny in the morning, rain expected in the afternoon.', question: 'When will it rain?', answer: 'In the afternoon', options: ['In the afternoon', 'In the morning', 'At night', 'All day'] },
        { passage: 'Dr. Patel\'s office hours are Monday and Wednesday, 2 PM to 5 PM.', question: 'What days are office hours?', answer: 'Monday and Wednesday', options: ['Monday and Wednesday', 'Tuesday and Thursday', 'Monday and Friday', 'Every day'] },
      ],
    },
    'dialogue-gap-fill': {
      type: 'dictation', instruction: 'Fill in the missing words from the dialogue.',
      items: [
        { passage: '"Would you like to ___ for dinner tonight?"', answer: 'go out', hint: '(2 words, means eat at a restaurant)' },
        { passage: '"I\'m sorry, I can\'t ___ it to the party."', answer: 'make', hint: '(1 word, means attend/come)' },
        { passage: '"Could you ___ me a favour?"', answer: 'do', hint: '(1 word, means help)' },
        { passage: '"Let me ___ it over and I\'ll tell you tomorrow."', answer: 'think', hint: '(1 word, means consider)' },
        { passage: '"I\'m really looking ___ to the holiday."', answer: 'forward', hint: '(1 word, part of a phrasal verb)' },
        { passage: '"We need to ___ up early tomorrow."', answer: 'get', hint: '(1 word, means rise/wake)' },
      ],
    },
    'short-conversation': {
      type: 'comprehension', instruction: 'Answer the question about the conversation.',
      items: [
        { passage: '"Hi Tom, what did you do last weekend?" "I went hiking in the mountains. It was amazing!" "Sounds great! Was the weather good?" "Yes, sunny all day."', question: 'What was the weather like?', answer: 'Sunny', options: ['Sunny', 'Rainy', 'Cloudy', 'Snowy'] },
        { passage: '"Can I help you?" "Yes, I\'m looking for a blue shirt, size medium." "Here you are. Would you like to try it on?" "Yes, please. Where is the fitting room?"', question: 'What size does the customer want?', answer: 'Medium', options: ['Small', 'Medium', 'Large', 'Extra large'] },
        { passage: '"I have a terrible headache." "Have you taken any medicine?" "Not yet." "Try some paracetamol and drink lots of water."', question: 'What advice is given?', answer: 'Take medicine and drink water', options: ['Take medicine and drink water', 'Go to hospital', 'Stay in bed', 'Call a doctor'] },
        { passage: '"Shall we eat Italian or Japanese tonight?" "How about Japanese? I had pizza yesterday." "Good idea. I know a great sushi place."', question: 'What will they eat?', answer: 'Japanese', options: ['Japanese', 'Italian', 'Chinese', 'Mexican'] },
        { passage: '"How was your holiday?" "Wonderful! We went to Greece for two weeks." "Lucky you! Did you go to any islands?" "Yes, we visited Santorini. It was beautiful."', question: 'Where did they go on holiday?', answer: 'Greece', options: ['Greece', 'Spain', 'Italy', 'Turkey'] },
        { passage: '"Excuse me, how much is this jacket?" "$85." "That\'s a bit expensive. Do you have anything cheaper?" "This one is on sale for $55."', question: 'How much is the sale jacket?', answer: '$55', options: ['$55', '$85', '$45', '$65'] },
      ],
    },
    'announcement': {
      type: 'comprehension', instruction: 'Answer the question about the announcement.',
      items: [
        { passage: 'Attention shoppers: the store will be closing in 15 minutes. Please bring your final purchases to the checkout.', question: 'What should shoppers do?', answer: 'Go to the checkout', options: ['Go to the checkout', 'Leave immediately', 'Keep shopping', 'Wait at the entrance'] },
        { passage: 'Due to a signal failure, all trains on the Northern Line are experiencing delays of up to 20 minutes. We apologize for the inconvenience.', question: 'Why are trains delayed?', answer: 'A signal failure', options: ['A signal failure', 'Bad weather', 'A strike', 'Maintenance work'] },
        { passage: 'Your attention please. Passenger Maria Santos travelling to Lisbon, your flight is now boarding at Gate 14.', question: 'Where should Maria go?', answer: 'Gate 14', options: ['Gate 14', 'Gate 4', 'Gate 40', 'Gate 41'] },
        { passage: 'The fire drill will take place this Thursday at 11 AM. When you hear the alarm, please leave the building calmly using the nearest exit.', question: 'When is the fire drill?', answer: 'Thursday at 11 AM', options: ['Thursday at 11 AM', 'Friday at 11 AM', 'Thursday at 1 PM', 'Monday at 11 AM'] },
        { passage: 'Good morning. Today\'s special offer: buy two coffees and get the third one free. Available until 2 PM.', question: 'Until when is the offer available?', answer: '2 PM', options: ['2 PM', '12 PM', '5 PM', 'All day'] },
        { passage: 'The swimming pool will be closed for maintenance from March 1st to March 15th. We apologize for any inconvenience.', question: 'How long will the pool be closed?', answer: '15 days', options: ['15 days', '1 week', '1 month', '3 days'] },
      ],
    },
    'sequencing-events': {
      type: 'fill-in', instruction: 'What happened first?',
      items: [
        { prompt: '"After breakfast, I went to school. Before that, I brushed my teeth."', answer: 'Brushed teeth', options: ['Brushed teeth', 'Had breakfast', 'Went to school', 'Woke up'] },
        { prompt: '"She arrived at 9, but the meeting had already started at 8:30."', answer: 'The meeting started', options: ['The meeting started', 'She arrived', 'They both arrived', 'The meeting ended'] },
        { prompt: '"Once I finished my homework, I watched TV. I had dinner before starting homework."', answer: 'Had dinner', options: ['Had dinner', 'Did homework', 'Watched TV', 'Went to bed'] },
        { prompt: '"He checked in at the hotel, then unpacked. Earlier, he had flown from London."', answer: 'Flew from London', options: ['Flew from London', 'Checked in', 'Unpacked', 'Booked the hotel'] },
        { prompt: '"We bought tickets online before going to the cinema. After the film, we had dinner."', answer: 'Bought tickets', options: ['Bought tickets', 'Went to cinema', 'Watched the film', 'Had dinner'] },
        { prompt: '"By the time the ambulance arrived, the neighbours had already called the police."', answer: 'Called the police', options: ['Called the police', 'Ambulance arrived', 'They arrived together', 'Nobody called'] },
      ],
    },
    'contractions-listening': {
      type: 'dictation', instruction: 'Write the full form of the contraction.',
      items: [
        { prompt: '"I\'ve" = ?', answer: 'I have' },
        { prompt: '"She\'d" (past context) = ?', answer: 'She had' },
        { prompt: '"They\'re" = ?', answer: 'They are' },
        { prompt: '"We\'ll" = ?', answer: 'We will' },
        { prompt: '"It\'s" (possession excluded) = ?', answer: 'It is' },
        { prompt: '"Who\'s" = ?', answer: 'Who is' },
        { prompt: '"Wouldn\'t" = ?', answer: 'Would not' },
        { prompt: '"Could\'ve" = ?', answer: 'Could have' },
      ],
    },
    'basic-reductions': {
      type: 'fill-in', instruction: 'What is the full/standard form of this reduced speech?',
      items: [
        { prompt: '"gonna" = ?', answer: 'going to', options: ['going to', 'gone to', 'got to', 'go to'] },
        { prompt: '"wanna" = ?', answer: 'want to', options: ['want to', 'went to', 'was to', 'won to'] },
        { prompt: '"gotta" = ?', answer: 'got to', options: ['got to', 'going to', 'get to', 'go to'] },
        { prompt: '"kinda" = ?', answer: 'kind of', options: ['kind of', 'can do', 'could of', 'king of'] },
        { prompt: '"lemme" = ?', answer: 'let me', options: ['let me', 'leave me', 'lend me', 'led me'] },
        { prompt: '"dunno" = ?', answer: "don't know", options: ["don't know", "didn't know", "do know", "does know"] },
      ],
    },
  },
  'b1': {
    'dictation-sentences': {
      type: 'dictation', instruction: 'Write the sentence exactly as you hear it.',
      items: [
        { prompt: 'Read aloud: "The weather has been unusually warm this week."', answer: 'the weather has been unusually warm this week' },
        { prompt: 'Read aloud: "Could you tell me where the nearest station is?"', answer: 'could you tell me where the nearest station is' },
        { prompt: 'Read aloud: "She\'s been working here since January."', answer: "she's been working here since january" },
        { prompt: 'Read aloud: "I wouldn\'t have gone if I\'d known about the traffic."', answer: "i wouldn't have gone if i'd known about the traffic" },
        { prompt: 'Read aloud: "The results were better than we expected."', answer: 'the results were better than we expected' },
        { prompt: 'Read aloud: "They\'re planning to move to the countryside next year."', answer: "they're planning to move to the countryside next year" },
      ],
    },
    'connected-speech-intro': {
      type: 'fill-in', instruction: 'In natural speech, how would these words typically link?',
      items: [
        { prompt: '"turn off" sounds like...', answer: 'tur-noff', options: ['tur-noff', 'turn-off', 'tur-off', 'turn off'] },
        { prompt: '"pick it up" sounds like...', answer: 'pi-ki-tup', options: ['pi-ki-tup', 'pick-it-up', 'pi-kit-up', 'pick-i-tup'] },
        { prompt: '"an apple" sounds like...', answer: 'a-napple', options: ['a-napple', 'an-apple', 'an-aple', 'a-naple'] },
        { prompt: '"last night" — what happens to the /t/?', answer: 'It is often dropped', options: ['It is often dropped', 'It is clearly said', 'It becomes /d/', 'It becomes /s/'] },
        { prompt: '"good morning" — what happens to /d/?', answer: 'It is often dropped', options: ['It is often dropped', 'It is clearly said', 'It becomes /t/', 'It becomes /n/'] },
        { prompt: '"did you" sounds like...', answer: 'didju', options: ['didju', 'did-you', 'dijoo', 'didyou'] },
      ],
    },
    'main-idea-extraction': {
      type: 'comprehension', instruction: 'What is the main idea of the passage?',
      items: [
        { passage: 'Many people are now working from home. Companies have found that productivity often stays the same or even improves. However, some workers report feeling isolated and missing the social aspects of office life.', question: 'What is the main idea?', answer: 'Working from home has both benefits and drawbacks', options: ['Working from home has both benefits and drawbacks', 'Everyone should work from home', 'Offices are closing', 'Workers are unhappy'] },
        { passage: 'The city has introduced a new bike-sharing program with 500 bikes at 50 stations. Users pay a small monthly fee and can pick up and drop off bikes at any station. The aim is to reduce traffic and pollution.', question: 'What is the main point?', answer: 'A new bike-sharing program to reduce traffic', options: ['A new bike-sharing program to reduce traffic', 'Bikes are expensive', 'The city needs more cars', 'People should walk more'] },
        { passage: 'Sleep is essential for good health. Research shows that adults need 7-9 hours per night. Lack of sleep can lead to weight gain, poor concentration, and a weaker immune system.', question: 'What is the passage mainly about?', answer: 'The importance of getting enough sleep', options: ['The importance of getting enough sleep', 'How to fall asleep faster', 'Why children need more sleep', 'Sleep disorders'] },
        { passage: 'Plastic pollution in the oceans is a growing problem. Every year, millions of tons of plastic waste end up in the sea, harming marine life. Governments and organizations are working on solutions, from banning single-use plastics to developing new recycling technologies.', question: 'What is the main topic?', answer: 'Ocean plastic pollution and efforts to address it', options: ['Ocean plastic pollution and efforts to address it', 'How to recycle at home', 'Marine biology', 'Government policies'] },
        { passage: 'Learning a second language has many cognitive benefits. Studies show it can improve memory, enhance problem-solving skills, and even delay the onset of dementia. The best time to start is as early as possible, but it\'s never too late.', question: 'What is the key message?', answer: 'Learning a second language benefits the brain', options: ['Learning a second language benefits the brain', 'Children learn faster', 'Only young people should learn languages', 'Languages are difficult'] },
        { passage: 'The restaurant industry has changed dramatically in recent years. Online ordering and food delivery apps have grown rapidly, especially since the pandemic. While convenient for customers, this shift has created challenges for traditional dine-in restaurants.', question: 'What is the passage about?', answer: 'How delivery apps are changing the restaurant industry', options: ['How delivery apps are changing the restaurant industry', 'The best restaurants', 'How to cook at home', 'Restaurant health regulations'] },
      ],
    },
    'detail-questions': {
      type: 'comprehension', instruction: 'Answer the specific detail question.',
      items: [
        { passage: 'The concert will take place on Saturday, March 15th at the City Arena. Doors open at 6:30 PM and the show starts at 8 PM. Tickets are available online for $45 or $55 at the door.', question: 'How much cheaper are online tickets?', answer: '$10 cheaper', options: ['$10 cheaper', '$5 cheaper', '$15 cheaper', 'Same price'] },
        { passage: 'Dr. Lee has been researching sleep patterns for 20 years at Stanford University. Her team discovered that people who sleep less than 6 hours a night are 4 times more likely to catch a cold.', question: 'Where does Dr. Lee work?', answer: 'Stanford University', options: ['Stanford University', 'Harvard', 'Oxford', 'MIT'] },
        { passage: 'The new library will have three floors: the ground floor for children, the first floor for adult fiction, and the second floor for non-fiction and study rooms. It opens on June 1st.', question: 'Where is adult fiction?', answer: 'First floor', options: ['First floor', 'Ground floor', 'Second floor', 'Basement'] },
        { passage: 'Maria runs 5 km every morning before work. She started running two years ago to improve her health. Last month, she completed her first half-marathon in 1 hour 55 minutes.', question: 'How long has Maria been running?', answer: 'Two years', options: ['Two years', 'One year', 'Six months', 'Five years'] },
        { passage: 'The company employs 3,500 people across 12 countries. Its headquarters are in Dublin, Ireland, and it was founded in 2005 by two university friends.', question: 'When was the company founded?', answer: '2005', options: ['2005', '2010', '2000', '2015'] },
        { passage: 'The cooking class runs every Wednesday from 6 to 8 PM. Maximum 12 students per class. The 6-week course costs $180, and all ingredients are included.', question: 'How many students can join each class?', answer: '12', options: ['12', '6', '8', '20'] },
      ],
    },
    'inference-basic': {
      type: 'comprehension', instruction: 'What can you infer from the passage?',
      items: [
        { passage: 'Sarah checked her watch for the fifth time, tapping her foot impatiently. The restaurant was empty except for her. She picked up her phone and put it down again.', question: 'What can you infer?', answer: 'Someone is late to meet her', options: ['Someone is late to meet her', 'She is enjoying her meal', 'The restaurant is closed', 'She is waiting for food'] },
        { passage: '"I\'m afraid we can\'t extend your contract, Mr. Johnson. The project has been completed and we no longer need additional staff." He nodded silently and reached for his coat.', question: 'What is happening?', answer: 'He is losing his job', options: ['He is losing his job', 'He is getting a promotion', 'He is starting a new project', 'He is going on holiday'] },
        { passage: 'Tom came home, threw his bag on the floor, and went straight to his room without saying a word. His mother heard the door slam.', question: 'How does Tom probably feel?', answer: 'Upset or angry', options: ['Upset or angry', 'Happy and excited', 'Tired but content', 'Hungry'] },
        { passage: 'The streets were covered in confetti, and music was playing from every corner. People were dancing and laughing, wearing colourful costumes and masks.', question: 'What is happening?', answer: 'A carnival or festival', options: ['A carnival or festival', 'A normal workday', 'A funeral', 'A school day'] },
        { passage: '"That was the best meal I\'ve ever had!" she said, wiping her mouth with a napkin. "We absolutely have to come back here." He smiled and asked for the bill.', question: 'What can you infer?', answer: 'They really enjoyed the restaurant', options: ['They really enjoyed the restaurant', 'The food was terrible', 'They want to leave quickly', 'They are angry about the bill'] },
        { passage: 'She put on her running shoes, filled her water bottle, and stretched her legs. The sun was just coming up over the horizon.', question: 'What is she about to do?', answer: 'Go for a morning run', options: ['Go for a morning run', 'Go to work', 'Go shopping', 'Go to bed'] },
      ],
    },
    'note-completion': {
      type: 'dictation', instruction: 'Complete the notes based on the passage.',
      items: [
        { passage: 'The library is open Monday to Friday from 9 AM to 7 PM, and Saturday from 10 AM to 4 PM. It is closed on Sundays.', prompt: 'Weekday hours: ___', answer: '9 AM to 7 PM' },
        { passage: 'The guest speaker is Professor Angela Chen from the University of Melbourne. She will talk about climate change and its effects on agriculture.', prompt: 'Topic: ___', answer: 'climate change and agriculture' },
        { passage: 'To register, students need to bring a photo ID, proof of address, and a completed application form. The registration fee is $50.', prompt: 'Documents needed: photo ID, proof of address, and ___', answer: 'a completed application form' },
        { passage: 'The hotel offers a free airport shuttle that runs every 30 minutes between 6 AM and midnight.', prompt: 'Shuttle frequency: every ___', answer: '30 minutes' },
        { passage: 'The exam will consist of three parts: multiple choice, short answer, and essay. You have 2 hours to complete all sections.', prompt: 'Total exam time: ___', answer: '2 hours' },
        { passage: 'The company was founded in Stockholm in 1985 and now has offices in 15 countries with over 8,000 employees.', prompt: 'Founded: ___ (city), ___ (year)', answer: 'Stockholm, 1985' },
      ],
    },
    'summary-completion': {
      type: 'fill-in', instruction: 'Choose the best word to complete the summary.',
      items: [
        { prompt: 'The speaker discussed the ___ of renewable energy sources like solar and wind power.', answer: 'benefits', options: ['benefits', 'problems', 'costs', 'dangers'] },
        { prompt: 'According to the lecture, ___ is the main cause of deforestation in tropical regions.', answer: 'agriculture', options: ['agriculture', 'tourism', 'mining', 'urbanization'] },
        { prompt: 'The researcher ___ that more studies are needed before drawing conclusions.', answer: 'emphasized', options: ['emphasized', 'denied', 'ignored', 'forgot'] },
        { prompt: 'The main ___ of the talk was that early intervention is key to success.', answer: 'message', options: ['message', 'problem', 'mistake', 'question'] },
        { prompt: 'The speaker ___ several examples to support her argument.', answer: 'provided', options: ['provided', 'avoided', 'removed', 'forgot'] },
        { prompt: 'In ___, the presentation covered three main areas of the new policy.', answer: 'summary', options: ['summary', 'addition', 'contrast', 'detail'] },
      ],
    },
  },
  'b2': {
    'rapid-speech-decoding': {
      type: 'dictation', instruction: 'Write what you hear (rapid natural speech).',
      items: [
        { prompt: '"Whatdya think about that?"', answer: 'what do you think about that' },
        { prompt: '"I shoulda told her earlier."', answer: 'I should have told her earlier' },
        { prompt: '"He musta been tired."', answer: 'he must have been tired' },
        { prompt: '"They\'re gonna hafta leave soon."', answer: "they're going to have to leave soon" },
        { prompt: '"Whaddaya want for dinner?"', answer: 'what do you want for dinner' },
        { prompt: '"She coulda done better."', answer: 'she could have done better' },
      ],
    },
    'accent-variation': {
      type: 'fill-in', instruction: 'Identify the feature described.',
      items: [
        { prompt: 'In British English, "bath" has /ɑː/. In American English it has...', answer: '/æ/', options: ['/æ/', '/ɑː/', '/ɒ/', '/eɪ/'] },
        { prompt: 'In American English, the /t/ in "water" often sounds like...', answer: 'a flap /ɾ/ (sounds like d)', options: ['a flap /ɾ/ (sounds like d)', 'a clear /t/', 'silent', 'a glottal stop'] },
        { prompt: 'In Australian English, "day" may sound closer to...', answer: '/daɪ/', options: ['/daɪ/', '/deɪ/', '/diː/', '/dɔɪ/'] },
        { prompt: 'In British RP, the /r/ in "car" is...', answer: 'silent (non-rhotic)', options: ['silent (non-rhotic)', 'always pronounced', 'a trill', 'a tap'] },
        { prompt: 'Scottish English tends to pronounce the /r/ in "car". This is called...', answer: 'rhotic', options: ['rhotic', 'non-rhotic', 'aspirated', 'nasalized'] },
        { prompt: 'In Irish English, "think" may be pronounced with /t/ instead of /θ/. This is called...', answer: 'TH-stopping', options: ['TH-stopping', 'TH-fronting', 'TH-dropping', 'TH-rhoticism'] },
      ],
    },
    'lecture-comprehension': {
      type: 'comprehension', instruction: 'Answer the question about the lecture extract.',
      items: [
        { passage: 'Today I want to talk about cognitive biases — systematic errors in thinking that affect our decisions. One well-known example is confirmation bias, where we tend to search for information that confirms what we already believe, while ignoring contradictory evidence.', question: 'What is confirmation bias?', answer: 'Seeking information that confirms existing beliefs', options: ['Seeking information that confirms existing beliefs', 'Changing your mind too easily', 'Forgetting important information', 'Making random decisions'] },
        { passage: 'The placebo effect is fascinating. In clinical trials, patients who receive a sugar pill — with no active ingredients — often show real improvement. This suggests that belief in a treatment can trigger genuine physiological responses.', question: 'What does the placebo effect demonstrate?', answer: 'Belief can cause real physical improvement', options: ['Belief can cause real physical improvement', 'Sugar cures diseases', 'Medicine is unnecessary', 'Doctors lie to patients'] },
        { passage: 'Urbanization is accelerating worldwide. By 2050, an estimated 68% of the world\'s population will live in cities. This creates both opportunities — better services, more jobs — and challenges, particularly in housing, transport, and environmental sustainability.', question: 'What percentage will be urban by 2050?', answer: '68%', options: ['68%', '50%', '80%', '55%'] },
        { passage: 'The speaker argued that the gig economy, while offering flexibility, often comes at the cost of job security, benefits, and a predictable income. She cited data showing that 40% of gig workers have no health insurance.', question: 'What is the main drawback of gig work mentioned?', answer: 'Lack of job security and benefits', options: ['Lack of job security and benefits', 'Too much work', 'Low flexibility', 'High taxes'] },
        { passage: 'Coral reefs support 25% of all marine species despite covering less than 1% of the ocean floor. Rising sea temperatures are causing widespread coral bleaching, which threatens entire marine ecosystems.', question: 'What causes coral bleaching?', answer: 'Rising sea temperatures', options: ['Rising sea temperatures', 'Pollution', 'Overfishing', 'Ocean currents'] },
        { passage: 'Recent research in neuroscience has challenged the idea that the brain stops developing in childhood. In fact, the prefrontal cortex — responsible for decision-making and impulse control — continues to mature until around age 25.', question: 'Until what age does the prefrontal cortex develop?', answer: 'Around 25', options: ['Around 25', 'Around 18', 'Around 12', 'Around 30'] },
      ],
    },
    'attitude-recognition': {
      type: 'fill-in', instruction: 'What is the speaker\'s attitude?',
      items: [
        { prompt: '"Well, I suppose it could work, but I have my doubts."', answer: 'Skeptical', options: ['Skeptical', 'Enthusiastic', 'Angry', 'Indifferent'] },
        { prompt: '"That\'s absolutely incredible! I never expected such results!"', answer: 'Amazed', options: ['Amazed', 'Disappointed', 'Bored', 'Confused'] },
        { prompt: '"Frankly, I think the whole project was a waste of time and money."', answer: 'Critical/dismissive', options: ['Critical/dismissive', 'Supportive', 'Neutral', 'Excited'] },
        { prompt: '"It doesn\'t really matter to me either way."', answer: 'Indifferent', options: ['Indifferent', 'Passionate', 'Angry', 'Hopeful'] },
        { prompt: '"I\'m cautiously optimistic — the signs are promising but it\'s early days."', answer: 'Cautiously hopeful', options: ['Cautiously hopeful', 'Very confident', 'Pessimistic', 'Indifferent'] },
        { prompt: '"Oh wonderful, another meeting about meetings."', answer: 'Sarcastic', options: ['Sarcastic', 'Genuine excitement', 'Confusion', 'Gratitude'] },
      ],
    },
    'implicit-meaning': {
      type: 'comprehension', instruction: 'What does the speaker really mean?',
      items: [
        { passage: '"That\'s an interesting suggestion," the manager said, looking at her watch.', question: 'What does the manager probably mean?', answer: "She's not really interested", options: ["She's not really interested", "She loves the idea", "She wants to hear more", "She's confused"] },
        { passage: '"I\'d love to help, but I\'m absolutely swamped this week."', question: 'What is the speaker really saying?', answer: "They can't help (polite refusal)", options: ["They can't help (polite refusal)", "They will definitely help", "They're asking for help", "They're angry"] },
        { passage: '"Well, that was certainly different," she said after the performance.', question: 'What does she probably mean?', answer: "She didn't like it much", options: ["She didn't like it much", "She loved it", "She wants to see it again", "She's confused"] },
        { passage: '"I wouldn\'t say it\'s the worst idea I\'ve ever heard."', question: 'The speaker thinks the idea is...', answer: 'Not great but not terrible', options: ['Not great but not terrible', 'Excellent', 'The worst ever', 'Average'] },
        { passage: '"Some people might find that approach effective." (said with raised eyebrows)', question: 'The speaker probably...', answer: 'Doubts the approach', options: ['Doubts the approach', 'Supports the approach', 'Has no opinion', 'Is confused'] },
        { passage: '"Sure, take your time. It\'s not like we have a deadline or anything."', question: 'The speaker is being...', answer: 'Sarcastic — they DO have a deadline', options: ['Sarcastic — they DO have a deadline', 'Genuinely patient', 'Confused about deadlines', 'Relaxed'] },
      ],
    },
    'lecture-notes': {
      type: 'dictation', instruction: 'Complete the lecture notes.',
      items: [
        { passage: 'The three main types of memory discussed are: sensory memory, which lasts only seconds; short-term memory, lasting about 20-30 seconds; and long-term memory, which can last a lifetime.', prompt: 'Short-term memory lasts: ___', answer: '20-30 seconds' },
        { passage: 'The researcher identified four key factors affecting employee motivation: autonomy, mastery, purpose, and social connection.', prompt: 'Four factors: autonomy, mastery, ___, and social connection', answer: 'purpose' },
        { passage: 'GDP growth in the region was 3.2% in 2024, down from 4.1% in 2023. The decline was mainly attributed to reduced consumer spending.', prompt: 'GDP 2024: ___, Cause of decline: ___', answer: '3.2%, reduced consumer spending' },
        { passage: 'The theory proposes that language acquisition has a critical period, roughly from birth to puberty, after which native-like fluency becomes significantly harder to achieve.', prompt: 'Critical period ends at approximately: ___', answer: 'puberty' },
        { passage: 'The study involved 2,000 participants across five countries. Results showed that those who exercised regularly had a 30% lower risk of depression.', prompt: 'Exercise reduced depression risk by: ___', answer: '30%' },
        { passage: 'Three sustainable energy sources were highlighted: solar, which has seen a 90% cost reduction since 2010; wind, now the cheapest source in many regions; and geothermal, which is location-dependent but highly reliable.', prompt: 'Solar cost reduction since 2010: ___', answer: '90%' },
      ],
    },
    'argument-tracking': {
      type: 'fill-in', instruction: 'Identify the speaker\'s argument structure.',
      items: [
        { prompt: '"While some argue that AI will destroy jobs, I believe it will create more than it eliminates." — This is a...', answer: 'counter-argument followed by thesis', options: ['counter-argument followed by thesis', 'simple statement', 'question', 'conclusion'] },
        { prompt: '"First... Second... Finally..." — This structure is...', answer: 'enumeration/listing', options: ['enumeration/listing', 'cause-effect', 'comparison', 'problem-solution'] },
        { prompt: '"The evidence clearly shows... Therefore, we must conclude..." — This is...', answer: 'evidence leading to conclusion', options: ['evidence leading to conclusion', 'anecdote', 'definition', 'comparison'] },
        { prompt: '"On one hand... On the other hand..." — This is...', answer: 'presenting two sides', options: ['presenting two sides', 'giving examples', 'summarizing', 'defining'] },
        { prompt: '"Some critics might object that... However..." — This is a...', answer: 'anticipating and refuting objections', options: ['anticipating and refuting objections', 'agreeing with critics', 'changing the subject', 'concluding'] },
        { prompt: '"To put it simply..." — The speaker is...', answer: 'simplifying/clarifying', options: ['simplifying/clarifying', 'adding detail', 'changing topic', 'disagreeing'] },
      ],
    },
  },
  'c1': {
    'complex-argument': {
      type: 'comprehension', instruction: 'Answer the question about the complex argument.',
      items: [
        { passage: 'While proponents of universal basic income argue it would eliminate poverty and simplify welfare systems, critics contend it would reduce work incentives and prove fiscally unsustainable. The truth likely lies somewhere in between — targeted pilot programs have shown promising results in specific contexts, but scaling them nationally presents enormous challenges.', question: 'What is the speaker\'s position?', answer: 'Cautiously moderate — sees merit in both sides', options: ['Cautiously moderate — sees merit in both sides', 'Strongly in favour', 'Strongly against', 'Completely undecided'] },
        { passage: 'The claim that social media causes depression is overly simplistic. While correlational studies show a link, causation has not been established. Moreover, social media use encompasses a wide range of activities — passive scrolling may be harmful while active engagement can be beneficial.', question: 'Why does the speaker reject a simple causal claim?', answer: 'Correlation is not causation, and usage varies', options: ['Correlation is not causation, and usage varies', 'Social media is always good', 'Research is fake', 'Depression is not real'] },
        { passage: 'The paradox of tolerance, as Popper formulated it, suggests that unlimited tolerance ultimately leads to the disappearance of tolerance itself. If a society is tolerant without limit, its ability to be tolerant is eventually seized or destroyed by the intolerant.', question: 'What is Popper\'s paradox?', answer: 'Unlimited tolerance can destroy tolerance itself', options: ['Unlimited tolerance can destroy tolerance itself', 'All tolerance is bad', 'Intolerance is always wrong', 'Society should be completely tolerant'] },
        { passage: 'Degrowth advocates challenge the fundamental assumption that economic growth is always desirable. They argue that in wealthy nations, further GDP growth does not improve wellbeing but accelerates ecological destruction. However, applying degrowth to developing nations raises serious equity concerns.', question: 'What is the equity concern?', answer: 'Developing nations may still need growth to improve living standards', options: ['Developing nations may still need growth to improve living standards', 'Rich nations should grow more', 'All growth is bad', 'GDP always helps'] },
        { passage: 'The concept of neuroplasticity has revolutionized our understanding of the brain. However, popular accounts often overstate its implications. While the brain can indeed rewire itself, there are biological constraints, and the degree of plasticity varies enormously with age, region, and type of learning.', question: 'What nuance does the speaker add?', answer: 'Plasticity is real but has limits that pop science ignores', options: ['Plasticity is real but has limits that pop science ignores', 'The brain cannot change', 'Plasticity is unlimited', 'Only children have plasticity'] },
        { passage: 'Proponents of genetic engineering in agriculture point to increased yields and reduced pesticide use. Critics raise concerns about biodiversity loss, corporate control of food supplies, and unknown long-term ecological consequences. A middle ground might involve strict regulation rather than outright bans.', question: 'What compromise does the speaker suggest?', answer: 'Strict regulation rather than banning', options: ['Strict regulation rather than banning', 'Complete ban', 'No regulation needed', 'Only organic farming'] },
      ],
    },
    'multiple-speakers': {
      type: 'comprehension', instruction: 'Who said what?',
      items: [
        { passage: 'Speaker A: "I think we should invest more in public transport." Speaker B: "But the budget is limited. We can\'t fund everything." Speaker A: "True, but if we reduce road expansion spending, we could redirect those funds." Speaker C: "I agree with A. Long-term, public transport saves money."', question: 'Who agrees with Speaker A?', answer: 'Speaker C', options: ['Speaker C', 'Speaker B', 'Nobody', 'Both B and C'] },
        { passage: 'Dr. Kim: "The data shows a clear decline in biodiversity." Prof. Shah: "I\'d argue the methodology is flawed — the sample size is too small." Dr. Kim: "Fair point, but the trend is consistent across multiple studies." Prof. Shah: "I\'m not denying the trend, just questioning its magnitude."', question: 'What does Prof. Shah question?', answer: 'The magnitude, not the existence of the trend', options: ['The magnitude, not the existence of the trend', 'The entire finding', 'Dr. Kim\'s qualifications', 'The topic itself'] },
        { passage: 'Moderator: "Should universities be free?" Student: "Absolutely — education is a right." Professor: "Ideally yes, but someone has to pay. Tax-funded models work in Scandinavia but may not transfer to larger economies." Student: "Then perhaps means-tested fees are a compromise."', question: 'What compromise does the student suggest?', answer: 'Means-tested fees', options: ['Means-tested fees', 'Completely free', 'No change', 'Higher fees'] },
        { passage: 'Manager: "We need to launch by March." Developer: "That timeline is unrealistic given the bugs." Designer: "I agree with the developer — rushing will hurt quality." Manager: "What if we launch a minimal version and iterate?"', question: 'Who is concerned about quality?', answer: 'Developer and Designer', options: ['Developer and Designer', 'Only the Manager', 'Only the Developer', 'Nobody'] },
      ],
    },
    'irony-detection': {
      type: 'comprehension', instruction: 'Is the speaker being ironic? What do they really mean?',
      items: [
        { passage: '"Oh wonderful, another email about the email policy. Just what I needed to brighten my Monday."', question: 'Is this ironic?', answer: 'Yes — they are annoyed by unnecessary emails', options: ['Yes — they are annoyed by unnecessary emails', 'No — they genuinely like the email', 'No — they love Mondays', 'Unclear'] },
        { passage: '"Of course the printer jams right before my presentation. The universe clearly wants me to succeed."', question: 'What does the speaker really feel?', answer: 'Frustrated — saying the opposite of what they mean', options: ['Frustrated — saying the opposite of what they mean', 'Happy about the situation', 'Grateful for the challenge', 'Indifferent'] },
        { passage: '"Well, at least we have our health," she said, looking at the smouldering remains of her kitchen.', question: 'The speaker is using...', answer: 'Ironic understatement to cope with disaster', options: ['Ironic understatement to cope with disaster', 'A genuine positive outlook', 'Medical advice', 'A cooking tip'] },
        { passage: '"That went well," he muttered, after his entire presentation crashed and the CEO left the room.', question: 'The speaker means...', answer: 'It went very badly', options: ['It went very badly', 'It went perfectly', 'He is satisfied', 'He wants to do it again'] },
        { passage: '"I just love standing in the rain for 45 minutes waiting for a bus that may or may not exist."', question: 'The speaker is expressing...', answer: 'Sarcastic frustration', options: ['Sarcastic frustration', 'Genuine enjoyment of rain', 'Love of public transport', 'Patience'] },
        { passage: '"What a surprise — the meeting could have been an email. Who could have predicted that?"', question: 'Is this sincere?', answer: 'No — they always expected it was unnecessary', options: ['No — they always expected it was unnecessary', 'Yes — they are genuinely surprised', 'Yes — they love meetings', 'Unclear'] },
      ],
    },
    'academic-lecture': {
      type: 'comprehension', instruction: 'Answer the question about the academic content.',
      items: [
        { passage: 'Chomsky\'s Universal Grammar hypothesis posits that humans are born with an innate language faculty — a set of principles common to all languages. This would explain why children acquire language so rapidly despite the "poverty of the stimulus" — the gap between the limited input children receive and the complex grammar they master.', question: 'What does "poverty of the stimulus" refer to?', answer: 'Limited input vs. complex grammar children acquire', options: ['Limited input vs. complex grammar children acquire', 'Children in poverty', 'Lack of education', 'Poor teaching methods'] },
        { passage: 'In behavioural economics, loss aversion refers to the tendency for people to prefer avoiding losses over acquiring equivalent gains. Kahneman and Tversky demonstrated that the pain of losing $100 is psychologically about twice as powerful as the pleasure of gaining $100.', question: 'How strong is loss aversion compared to gain?', answer: 'About twice as strong', options: ['About twice as strong', 'Equal', 'Half as strong', 'Three times as strong'] },
        { passage: 'The Sapir-Whorf hypothesis exists in two forms. The strong version — linguistic determinism — claims language determines thought. The weak version — linguistic relativity — merely suggests language influences thought. Most linguists today accept only the weak version.', question: 'Which version do most linguists accept?', answer: 'The weak version (linguistic relativity)', options: ['The weak version (linguistic relativity)', 'The strong version', 'Both equally', 'Neither'] },
        { passage: 'Foucault\'s concept of the panopticon — borrowed from Bentham\'s prison design — describes how the possibility of being watched creates self-discipline. Citizens internalize surveillance and regulate their own behaviour, making explicit control unnecessary.', question: 'What is the key insight of the panopticon concept?', answer: 'The possibility of being watched creates self-discipline', options: ['The possibility of being watched creates self-discipline', 'Prisons should be round', 'All surveillance is bad', 'People never self-regulate'] },
      ],
    },
    'elision-recognition': {
      type: 'dictation', instruction: 'Write the full form. What sound is dropped?',
      items: [
        { prompt: 'In natural speech: "nex(t) week" — what is elided?', answer: 'the /t/ in next' },
        { prompt: 'In natural speech: "han(d)bag" — what is elided?', answer: 'the /d/ in hand' },
        { prompt: 'In natural speech: "pos(t)man" — what is elided?', answer: 'the /t/ in post' },
        { prompt: 'In natural speech: "Chris(t)mas" — what is elided?', answer: 'the /t/ in Christ' },
        { prompt: 'In natural speech: "san(d)wich" — what is elided?', answer: 'the /d/ in sand' },
        { prompt: 'In natural speech: "gover(n)ment" — what is elided?', answer: 'the /n/ in govern' },
      ],
    },
    'assimilation-recognition': {
      type: 'fill-in', instruction: 'What happens to the sounds when these words connect?',
      items: [
        { prompt: '"ten boys" — the /n/ becomes...', answer: '/m/ (assimilates to bilabial)', options: ['/m/ (assimilates to bilabial)', '/ŋ/', '/n/ stays the same', '/t/'] },
        { prompt: '"good girl" — the /d/ may become...', answer: '/g/ (assimilates to velar)', options: ['/g/ (assimilates to velar)', '/b/', '/d/ stays the same', '/t/'] },
        { prompt: '"in Paris" — the /n/ becomes...', answer: '/m/ (assimilates to bilabial)', options: ['/m/ (assimilates to bilabial)', '/ŋ/', '/n/ stays the same', '/p/'] },
        { prompt: '"have to" — the /v/ becomes...', answer: '/f/ (devoices before /t/)', options: ['/f/ (devoices before /t/)', '/b/', '/v/ stays the same', '/p/'] },
        { prompt: '"used to" — the /d/ becomes...', answer: '/t/ (devoices before /t/)', options: ['/t/ (devoices before /t/)', '/s/', '/d/ stays the same', '/z/'] },
        { prompt: '"ten cats" — the /n/ becomes...', answer: '/ŋ/ (assimilates to velar)', options: ['/ŋ/ (assimilates to velar)', '/m/', '/n/ stays the same', '/t/'] },
      ],
    },
  },
  'c2': {
    'dialectal-variation': {
      type: 'fill-in', instruction: 'Identify the dialect or variety.',
      items: [
        { prompt: '"I\'m after eating my dinner" means "I have just eaten." This is...', answer: 'Irish English', options: ['Irish English', 'Scottish English', 'Australian English', 'American English'] },
        { prompt: '"He\'s gone to hospital" (no article). This is typical of...', answer: 'British English', options: ['British English', 'American English', 'Australian English', 'Indian English'] },
        { prompt: '"Y\'all" as a second-person plural is characteristic of...', answer: 'Southern American English', options: ['Southern American English', 'British English', 'Australian English', 'Canadian English'] },
        { prompt: '"She was sat there" (instead of "sitting") is common in...', answer: 'Northern British English', options: ['Northern British English', 'American English', 'Australian English', 'South African English'] },
        { prompt: '"I\'ll do the needful" is characteristic of...', answer: 'Indian English', options: ['Indian English', 'British English', 'American English', 'Australian English'] },
        { prompt: '"No worries" as a universal response is strongly associated with...', answer: 'Australian English', options: ['Australian English', 'British English', 'American English', 'Irish English'] },
      ],
    },
    'nuanced-tone': {
      type: 'comprehension', instruction: 'What is the nuanced emotional tone?',
      items: [
        { passage: '"I suppose you did your best," she said, not quite meeting his eyes.', question: 'What is the tone?', answer: 'Disappointed but trying to be kind', options: ['Disappointed but trying to be kind', 'Genuinely proud', 'Angry', 'Indifferent'] },
        { passage: '"How delightful," he murmured, as the waiter brought the wrong dish for the third time.', question: 'The speaker is feeling...', answer: 'Restrained frustration with surface politeness', options: ['Restrained frustration with surface politeness', 'Genuine delight', 'Hunger', 'Confusion'] },
        { passage: '"Well. That happened." (said after a colleague made an embarrassing mistake in a meeting)', question: 'The tone is...', answer: 'Awkward understatement, avoiding direct criticism', options: ['Awkward understatement, avoiding direct criticism', 'Enthusiasm', 'Direct criticism', 'Complete indifference'] },
        { passage: '"I\'m so happy for you," she said, her smile not quite reaching her eyes.', question: 'What does the description suggest?', answer: 'She is not genuinely happy — possibly jealous', options: ['She is not genuinely happy — possibly jealous', 'She is thrilled', 'She is confused', 'She is tired'] },
        { passage: '"Right then," he said, standing up abruptly. "I think we all know where we stand."', question: 'The speaker is...', answer: 'Ending a tense conversation with controlled displeasure', options: ['Ending a tense conversation with controlled displeasure', 'Happy with the outcome', 'Starting a new topic', 'Confused'] },
        { passage: '"Of course. Of course you did." (with a long pause between sentences)', question: 'The repetition and pause suggest...', answer: 'Processing unwelcome information, barely concealed frustration', options: ['Processing unwelcome information, barely concealed frustration', 'Enthusiastic agreement', 'Simple confirmation', 'Boredom'] },
      ],
    },
    'advanced-inference': {
      type: 'comprehension', instruction: 'What is implied but not directly stated?',
      items: [
        { passage: 'The CEO praised the departing employee\'s "unique approach to problem-solving" and wished her well in her "future endeavors." No mention was made of her replacement.', question: 'What can you infer?', answer: 'The departure may not have been entirely voluntary or positive', options: ['The departure may not have been entirely voluntary or positive', 'She was a great employee', 'She is retiring happily', 'She was promoted'] },
        { passage: '"The committee has decided to pursue a different strategic direction." No further questions were taken.', question: 'What is implied?', answer: 'The previous plan/person has been rejected and they don\'t want to discuss it', options: ['The previous plan/person has been rejected and they don\'t want to discuss it', 'The committee is excited about changes', 'Everything is going well', 'More meetings are planned'] },
        { passage: 'When asked about the merger, the spokesperson said, "We are exploring all options to maximize shareholder value." The company\'s stock dropped 8% that afternoon.', question: 'What does the stock drop suggest?', answer: 'The market interpreted this as the company being in trouble', options: ['The market interpreted this as the company being in trouble', 'Investors are happy', 'The merger is going well', 'Stock always drops'] },
        { passage: 'The review described the restaurant as having "generous portions" and "enthusiastic staff," but notably omitted any comment on the quality of the food.', question: 'What is implied about the food?', answer: 'The food quality was poor — the reviewer avoided mentioning it', options: ['The food quality was poor — the reviewer avoided mentioning it', 'The food was excellent', 'The reviewer forgot', 'Food is not important'] },
      ],
    },
    'spontaneous-speech': {
      type: 'fill-in', instruction: 'Identify the discourse feature.',
      items: [
        { prompt: '"So, like, the thing is, right, that basically..."', answer: 'Filler-heavy hesitation (planning speech in real time)', options: ['Filler-heavy hesitation (planning speech in real time)', 'Formal academic speech', 'Prepared presentation', 'Written text read aloud'] },
        { prompt: '"Sorry, what was I saying? Oh yes, so anyway..."', answer: 'Self-repair and topic resumption', options: ['Self-repair and topic resumption', 'Changing the subject', 'Ending the conversation', 'Asking a question'] },
        { prompt: '"I mean, it\'s not that I disagree exactly, but..."', answer: 'Hedged disagreement with face-saving', options: ['Hedged disagreement with face-saving', 'Strong agreement', 'Complete disagreement', 'Confusion'] },
        { prompt: '"Where was I? Right. So the point is..."', answer: 'Losing and recovering thread', options: ['Losing and recovering thread', 'Asking for directions', 'Starting a new topic', 'Ending a speech'] },
        { prompt: '"You know what I mean?" (said mid-explanation)', answer: 'Comprehension check / rapport building', options: ['Comprehension check / rapport building', 'Genuine question', 'Ending the conversation', 'Criticism'] },
        { prompt: '"It\'s funny, because — well, not funny exactly, but — you know..."', answer: 'Real-time self-correction and reformulation', options: ['Real-time self-correction and reformulation', 'Telling a joke', 'Formal speech', 'Written language'] },
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
  return norm(expected) === norm(answer);
}

// Public API

class Listening {
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
        prelisten: 'Activate schema: discuss topic, predict content',
        present: `Focus: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        reflect: 'Metacognitive check: What strategies did you use?',
      },
    };
  }
}

module.exports = Listening;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const lis = new Listening();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': { const [, id, level] = args; if (!id) throw new Error('Usage: start <id> [level]'); if (level) lis.setLevel(id, level); out({ action: 'start', profile: lis.getProfile(id), nextSkills: lis.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(lis.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const level = loadProfile(id).level || 'a1'; if (skill) { out(lis.generateExercise(level, skill, 5)); } else { const n = lis.getNextSkills(id, 1).next; out(n.length ? lis.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); let exp = expected; try { exp = JSON.parse(expected); } catch {} out(lis.checkAnswer(type, exp, answer)); break; }
      case 'record': { const [, id, level, cat, skill, sc, tot, ...notes] = args; if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total>'); out(lis.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(lis.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(lis.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(lis.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? lis.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(lis.setLevel(id, l)); break; }
      case 'students': { out(lis.listStudents()); break; }
      default: out({ usage: 'node listening.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
