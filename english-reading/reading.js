// English Reading Comprehension Lab (A1-C2). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'english-reading');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'a1': {
    'comprehension-strategies': ['sign-reading', 'simple-message-gist'],
    'vocabulary-from-context': ['word-picture-match'],
    'text-analysis': ['true-false-basic'],
  },
  'a2': {
    'comprehension-strategies': ['email-comprehension', 'short-story-comprehension'],
    'vocabulary-from-context': ['scanning-for-info'],
    'text-analysis': ['sequencing-events'],
  },
  'b1': {
    'comprehension-strategies': ['inference-questions', 'author-purpose'],
    'vocabulary-from-context': ['vocabulary-in-context'],
    'text-analysis': ['paragraph-main-idea', 'text-structure-id'],
  },
  'b2': {
    'comprehension-strategies': ['critical-reading', 'argument-evaluation'],
    'vocabulary-from-context': ['complex-inference'],
    'text-analysis': ['academic-reading'],
  },
  'c1': {
    'comprehension-strategies': ['evaluating-sources', 'rhetorical-analysis-reading'],
    'vocabulary-from-context': ['implicit-bias'],
    'text-analysis': ['research-paper-reading'],
  },
  'c2': {
    'comprehension-strategies': ['literary-interpretation', 'cultural-reference'],
    'vocabulary-from-context': ['advanced-synthesis'],
    'text-analysis': ['ambiguity-resolution'],
  },
};

const ITEM_BANKS = {
  'a1': {
    'sign-reading': {
      type: 'passage-comprehension', instruction: 'Read the sign and answer the question.',
      items: [
        { passage: 'NO PARKING. Tow-away zone. Violators will be fined.', question: 'What happens if you park here?', answer: 'Your car will be towed and you will be fined', options: ['Your car will be towed and you will be fined', 'You can park for free', 'You can park for one hour', 'Nothing happens'] },
        { passage: 'OPEN Monday to Friday, 9 AM - 5 PM. Closed weekends.', question: 'Can you visit on Saturday?', answer: 'No, it is closed on weekends', options: ['No, it is closed on weekends', 'Yes, at 9 AM', 'Yes, all day', 'Only in the morning'] },
        { passage: 'EXIT ONLY. Do not enter. Use front door for entrance.', question: 'Can you go in through this door?', answer: 'No, use the front door', options: ['No, use the front door', 'Yes, anytime', 'Yes, but only at night', 'Yes, on weekdays'] },
        { passage: 'SALE! 50% off all shoes. This week only.', question: 'How much is the discount?', answer: '50%', options: ['50%', '25%', '75%', '10%'] },
        { passage: 'CAUTION: Wet floor. Please walk carefully.', question: 'Why should you be careful?', answer: 'The floor is wet', options: ['The floor is wet', 'The door is locked', 'It is very dark', 'There is no elevator'] },
        { passage: 'FREE Wi-Fi. Ask staff for the password.', question: 'How do you get the Wi-Fi password?', answer: 'Ask the staff', options: ['Ask the staff', 'Pay at the counter', 'Look on the wall', 'Call the manager'] },
      ],
    },
    'simple-message-gist': {
      type: 'passage-comprehension', instruction: 'Read the short message and answer the question.',
      items: [
        { passage: 'Hi Tom, I am at the shop. Do you need milk? Text me back. Sara.', question: 'Where is Sara?', answer: 'At the shop', options: ['At the shop', 'At home', 'At school', 'At work'] },
        { passage: 'Dear students, there is no class tomorrow. The teacher is sick. See you on Wednesday.', question: 'Why is there no class?', answer: 'The teacher is sick', options: ['The teacher is sick', 'It is a holiday', 'The school is closed', 'Students are on a trip'] },
        { passage: 'Happy birthday, Mum! I love you. See you at dinner tonight. From James.', question: 'What is the occasion?', answer: "It is Mum's birthday", options: ["It is Mum's birthday", "It is James's birthday", 'It is Christmas', 'It is a wedding'] },
        { passage: 'Bus 42 is delayed by 20 minutes. Sorry for the inconvenience.', question: 'What is the problem?', answer: 'The bus is late', options: ['The bus is late', 'The bus is cancelled', 'The bus is early', 'The bus is full'] },
        { passage: 'Meeting moved to Room 5. Same time, 2 PM. Please bring your notes.', question: 'What changed about the meeting?', answer: 'The room changed', options: ['The room changed', 'The time changed', 'The meeting is cancelled', 'The day changed'] },
        { passage: 'Lost: small black cat. Name: Milo. If found, please call 555-0198.', question: 'What should you do if you find Milo?', answer: 'Call 555-0198', options: ['Call 555-0198', 'Go to the police', 'Keep the cat', 'Post online'] },
      ],
    },
    'word-picture-match': {
      type: 'vocab-context', instruction: 'Read the sentence and choose the meaning of the word.',
      items: [
        { passage: 'The cat is sleeping on the sofa.', word: 'sofa', question: 'What does "sofa" mean?', answer: 'A soft seat for two or more people', options: ['A soft seat for two or more people', 'A type of table', 'A kind of bed', 'A kitchen item'] },
        { passage: 'She put on her coat because it was cold outside.', word: 'coat', question: 'What does "coat" mean?', answer: 'A warm piece of clothing you wear outside', options: ['A warm piece of clothing you wear outside', 'A type of shoe', 'A hat', 'A bag'] },
        { passage: 'He is watering the flowers in the garden.', word: 'garden', question: 'What does "garden" mean?', answer: 'An area outside where plants grow', options: ['An area outside where plants grow', 'A room in the house', 'A type of shop', 'A kitchen'] },
        { passage: 'The children are playing at the playground.', word: 'playground', question: 'What does "playground" mean?', answer: 'An outdoor area where children play', options: ['An outdoor area where children play', 'A classroom', 'A library', 'A swimming pool'] },
        { passage: 'I bought a loaf of bread at the bakery.', word: 'bakery', question: 'What does "bakery" mean?', answer: 'A shop that sells bread and cakes', options: ['A shop that sells bread and cakes', 'A restaurant', 'A supermarket', 'A farm'] },
        { passage: 'We crossed the bridge to get to the other side of the river.', word: 'bridge', question: 'What does "bridge" mean?', answer: 'A structure built over water to cross it', options: ['A structure built over water to cross it', 'A type of boat', 'A road', 'A wall'] },
      ],
    },
    'true-false-basic': {
      type: 'passage-comprehension', instruction: 'Read the text and decide if the statement is true or false.',
      items: [
        { passage: 'Tom is 10 years old. He has a dog called Max. Max is brown and white.', question: 'Max is a black dog. True or false?', answer: 'False', options: ['True', 'False'] },
        { passage: 'Maria lives in London. She takes the bus to school every day. Her school starts at 8:30.', question: 'Maria walks to school. True or false?', answer: 'False', options: ['True', 'False'] },
        { passage: 'The shop sells fruit and vegetables. It opens at 7 AM and closes at 9 PM.', question: 'The shop is open at 8 PM. True or false?', answer: 'True', options: ['True', 'False'] },
        { passage: 'Anna has two brothers and one sister. She is the youngest in her family.', question: 'Anna has one sister. True or false?', answer: 'True', options: ['True', 'False'] },
        { passage: 'The library is next to the park. It is free to borrow books. You can keep them for two weeks.', question: 'You must pay to borrow books. True or false?', answer: 'False', options: ['True', 'False'] },
        { passage: 'We eat lunch at 12:30. Today we had soup and sandwiches.', question: 'Lunch is at 12:30. True or false?', answer: 'True', options: ['True', 'False'] },
      ],
    },
  },
  'a2': {
    'email-comprehension': {
      type: 'passage-comprehension', instruction: 'Read the email and answer the question.',
      items: [
        { passage: 'Hi Jake, Thanks for your email. I would love to come to your party on Saturday. What time does it start? Should I bring anything? See you soon, Lily.', question: 'What does Lily want to know?', answer: 'What time the party starts', options: ['What time the party starts', 'Where the party is', 'Who is coming', 'What to wear'] },
        { passage: 'Dear Mr. Brown, I am writing to say that I cannot come to work tomorrow. I have a bad cold and the doctor told me to stay in bed. I hope to be back on Wednesday. Kind regards, Sarah.', question: 'Why can\'t Sarah come to work?', answer: 'She has a cold', options: ['She has a cold', 'She is on holiday', 'She has a meeting', 'She is moving house'] },
        { passage: 'Hello Team, Please remember that the office will be closed on Friday for cleaning. You can work from home. Make sure to take your laptop. Thanks, Manager.', question: 'What should employees do on Friday?', answer: 'Work from home', options: ['Work from home', 'Come to the office early', 'Take a day off', 'Go to another office'] },
        { passage: 'Hi Mum, I arrived safely in Paris. The hotel is very nice and close to the metro. I will send you photos tomorrow. Love, Daniel.', question: 'Where is Daniel?', answer: 'In Paris', options: ['In Paris', 'In London', 'At home', 'At the airport'] },
        { passage: 'Dear Guest, Your reservation at the Grand Hotel is confirmed for March 15-17. Check-in is after 2 PM. Breakfast is included. We look forward to your visit.', question: 'How many nights is the reservation?', answer: 'Two nights', options: ['Two nights', 'Three nights', 'One night', 'Four nights'] },
        { passage: 'Hi Class, The homework is to read pages 30-45 and answer the questions on page 46. It is due on Monday. Good luck! Mrs. Chen.', question: 'When is the homework due?', answer: 'Monday', options: ['Monday', 'Tuesday', 'Wednesday', 'Friday'] },
      ],
    },
    'short-story-comprehension': {
      type: 'passage-comprehension', instruction: 'Read the short story and answer the question.',
      items: [
        { passage: 'Last summer, Emma went to the beach with her family. They swam in the sea and built a sandcastle. In the evening, they ate fish and chips at a small restaurant near the beach.', question: 'What did Emma\'s family do in the evening?', answer: 'They ate fish and chips', options: ['They ate fish and chips', 'They swam', 'They built a sandcastle', 'They went home'] },
        { passage: 'Ben wanted to buy a present for his friend. He went to three shops but could not find anything good. Finally, he decided to make a card by hand. His friend loved it.', question: 'Why did Ben make a card?', answer: 'He could not find a good present in the shops', options: ['He could not find a good present in the shops', 'He had no money', 'His friend asked for one', 'Cards are better than gifts'] },
        { passage: 'It was raining hard, so we could not play football. Instead, we stayed inside and played board games. My brother won three times. I was not happy about that!', question: 'Why did they stay inside?', answer: 'It was raining', options: ['It was raining', 'They were tired', 'They had homework', 'It was too hot'] },
        { passage: 'Grandma always makes cookies on Sunday. This week she made chocolate cookies. She gave me four and I saved two for later. They were the best cookies ever.', question: 'How many cookies did Grandma give?', answer: 'Four', options: ['Four', 'Two', 'Six', 'Three'] },
        { passage: 'After school, Lucy went to the library. She needed a book about animals for her project. The librarian helped her find three good books. Lucy borrowed all of them.', question: 'What was Lucy\'s project about?', answer: 'Animals', options: ['Animals', 'History', 'Science', 'Art'] },
        { passage: 'Sam got a new bicycle for his birthday. He rode it to the park every day after school. One day, he fell off and hurt his knee. His mum cleaned it and put on a bandage.', question: 'What happened to Sam at the park?', answer: 'He fell off his bicycle', options: ['He fell off his bicycle', 'He lost his bicycle', 'He met a friend', 'He found a dog'] },
      ],
    },
    'scanning-for-info': {
      type: 'vocab-context', instruction: 'Scan the text quickly to find the specific information.',
      items: [
        { passage: 'City Cinema — this week: "The Lost World" at 3 PM, 6 PM, and 9 PM. Tickets: adults $12, children $7. Free popcorn with every ticket on Wednesdays.', word: 'price', question: 'How much is a child\'s ticket?', answer: '$7', options: ['$7', '$12', '$3', '$9'] },
        { passage: 'Green Park Cafe. Open daily 7 AM - 8 PM. Breakfast served until 11 AM. Lunch specials from 12 to 2 PM. Free Wi-Fi available.', word: 'breakfast', question: 'Until what time is breakfast served?', answer: '11 AM', options: ['11 AM', '8 AM', '12 PM', '7 AM'] },
        { passage: 'Yoga Class Schedule: Monday 6 PM (beginners), Wednesday 7 PM (intermediate), Saturday 10 AM (all levels). Instructor: Maria Santos. Room 12.', word: 'beginners', question: 'When is the beginners class?', answer: 'Monday 6 PM', options: ['Monday 6 PM', 'Wednesday 7 PM', 'Saturday 10 AM', 'Friday 5 PM'] },
        { passage: 'Lost and Found: A blue backpack was found in the cafeteria on Tuesday. It contains books and a water bottle. Please collect from the main office before Friday.', word: 'location', question: 'Where was the backpack found?', answer: 'In the cafeteria', options: ['In the cafeteria', 'In the classroom', 'In the library', 'In the office'] },
        { passage: 'Train to Manchester: departs 10:15 from Platform 3. Arrives 12:45. First class available. Refreshments on board. No changes required.', word: 'arrival', question: 'What time does the train arrive?', answer: '12:45', options: ['12:45', '10:15', '11:30', '1:00'] },
        { passage: 'Dr. Helen Park, Dentist. Appointments available Mon-Thu. Emergency line: 555-0177. New patients welcome. Insurance accepted.', word: 'emergency', question: 'What is the emergency phone number?', answer: '555-0177', options: ['555-0177', '555-0117', '555-0771', '555-0717'] },
      ],
    },
    'sequencing-events': {
      type: 'passage-comprehension', instruction: 'Read the text and put events in the correct order.',
      items: [
        { passage: 'First, I woke up and had breakfast. Then I walked to school. After school, I played football with my friends. Finally, I went home and did my homework.', question: 'What did the person do right after school?', answer: 'Played football', options: ['Played football', 'Did homework', 'Had breakfast', 'Walked home'] },
        { passage: 'Sara packed her suitcase the night before. In the morning, she took a taxi to the airport. She checked in and waited at the gate. Her flight left at noon.', question: 'What did Sara do first?', answer: 'Packed her suitcase', options: ['Packed her suitcase', 'Took a taxi', 'Checked in', 'Waited at the gate'] },
        { passage: 'To make tea, boil water first. Then put a tea bag in a cup. Pour the hot water over it. Wait three minutes, then remove the tea bag and add milk.', question: 'What do you do after pouring the hot water?', answer: 'Wait three minutes', options: ['Wait three minutes', 'Add milk', 'Remove the tea bag', 'Boil more water'] },
        { passage: 'The dog escaped from the garden. It ran down the street. A neighbour saw it and caught it. She brought it back home safely.', question: 'What happened after the dog ran down the street?', answer: 'A neighbour caught it', options: ['A neighbour caught it', 'It came back alone', 'It went to the park', 'It found another dog'] },
        { passage: 'We arrived at the restaurant at 7 PM. We ordered drinks first, then chose our food. The main course arrived at 7:45. We had dessert and left around 9.', question: 'What happened at 7:45?', answer: 'The main course arrived', options: ['The main course arrived', 'They ordered drinks', 'They had dessert', 'They arrived'] },
        { passage: 'Before the exam, John studied all weekend. On Monday morning, he ate a good breakfast and walked to school. He felt confident when the exam started at 9 AM.', question: 'When did John study?', answer: 'Over the weekend', options: ['Over the weekend', 'Monday morning', 'During the exam', 'After breakfast'] },
      ],
    },
  },
  'b1': {
    'inference-questions': {
      type: 'passage-comprehension', instruction: 'Read the text and make an inference.',
      items: [
        { passage: 'Maria glanced at the clock and grabbed her keys. She ran to the car without finishing her coffee. The meeting was in 15 minutes and the office was 20 minutes away.', question: 'What can you infer about Maria?', answer: 'She is going to be late for the meeting', options: ['She is going to be late for the meeting', 'She does not like coffee', 'She forgot her keys', 'She is going shopping'] },
        { passage: 'The restaurant had white tablecloths, candles on every table, and a long wine list. A single main course cost over $50. The waiter wore a formal black suit.', question: 'What kind of restaurant is this?', answer: 'An expensive, high-end restaurant', options: ['An expensive, high-end restaurant', 'A fast-food place', 'A family diner', 'A cafeteria'] },
        { passage: 'After the results were posted, some students jumped up and cheered while others stared at the board in silence. A few quietly packed their bags and left the room.', question: 'What can you infer about the students who left quietly?', answer: 'They probably did not do well', options: ['They probably did not do well', 'They were very happy', 'They already knew their results', 'They had another class'] },
        { passage: 'Mr. Chen looked at the bill and his eyes widened. He checked it twice, then called the waiter over. He pointed at several items on the list.', question: 'What can you infer?', answer: 'He thinks there is a mistake on the bill', options: ['He thinks there is a mistake on the bill', 'He is very happy', 'He wants more food', 'He is leaving a big tip'] },
        { passage: 'The neighbours had not seen Mrs. Davies for three days. Her curtains were still closed, and the newspapers were piling up at her door. They decided to call the police.', question: 'Why did the neighbours call the police?', answer: 'They were worried something was wrong', options: ['They were worried something was wrong', 'The newspapers were annoying', 'They wanted to borrow something', 'Mrs. Davies asked them to'] },
        { passage: 'The company announced it would be "restructuring" and "streamlining operations." The next day, security guards appeared at the entrance and employees were called to meetings one by one.', question: 'What is most likely happening?', answer: 'People are being made redundant', options: ['People are being made redundant', 'The company is expanding', 'New staff are being hired', 'A party is being planned'] },
      ],
    },
    'author-purpose': {
      type: 'passage-comprehension', instruction: 'Read the text and identify the author\'s purpose.',
      items: [
        { passage: 'Did you know that honey never spoils? Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still perfectly edible. Honey\'s low moisture and acidic pH make it hostile to bacteria.', question: 'What is the author\'s purpose?', answer: 'To inform readers about an interesting fact', options: ['To inform readers about an interesting fact', 'To sell honey', 'To criticize archaeology', 'To compare foods'] },
        { passage: 'We must act now to save our oceans. Every year, 8 million tons of plastic enter the sea. If we do nothing, there will be more plastic than fish by 2050. Reduce, reuse, recycle — our future depends on it.', question: 'What is the author\'s purpose?', answer: 'To persuade readers to take action', options: ['To persuade readers to take action', 'To describe ocean life', 'To explain recycling steps', 'To tell a story'] },
        { passage: 'The little boat rocked gently on the silver water. Old Mr. Finn cast his line and waited, listening to the birds. This was his favourite part of the day — just him and the river.', question: 'What is the author\'s purpose?', answer: 'To tell a story and create a mood', options: ['To tell a story and create a mood', 'To teach fishing techniques', 'To advertise a boat', 'To give directions to a river'] },
        { passage: 'Step 1: Preheat the oven to 180°C. Step 2: Mix the flour, sugar, and eggs in a large bowl. Step 3: Pour into a greased tin and bake for 25 minutes.', question: 'What is the author\'s purpose?', answer: 'To give instructions', options: ['To give instructions', 'To entertain', 'To persuade', 'To compare recipes'] },
        { passage: 'The new city park is a waste of taxpayer money. It cost $4 million and is used by fewer than 200 people per day. That money could have funded school improvements that benefit thousands.', question: 'What is the author\'s purpose?', answer: 'To argue against the park spending', options: ['To argue against the park spending', 'To describe the park', 'To encourage people to visit', 'To explain how parks are built'] },
        { passage: 'Learning to play the guitar changed my life. At first, my fingers ached and I wanted to quit. But after months of practice, I could play songs for my friends. Now music is my greatest joy.', question: 'What is the author\'s purpose?', answer: 'To share a personal experience', options: ['To share a personal experience', 'To sell guitars', 'To teach music theory', 'To review a concert'] },
      ],
    },
    'vocabulary-in-context': {
      type: 'vocab-context', instruction: 'Read the passage and determine the meaning of the highlighted word.',
      items: [
        { passage: 'The new policy was met with widespread opposition. Thousands of people took to the streets to protest, and several unions threatened to strike.', word: 'opposition', question: 'What does "opposition" mean here?', answer: 'Strong disagreement or resistance', options: ['Strong disagreement or resistance', 'Enthusiastic support', 'Confusion', 'Indifference'] },
        { passage: 'After weeks of dry weather, the crops began to wither. Farmers looked at their brown, lifeless fields with growing concern.', word: 'wither', question: 'What does "wither" mean here?', answer: 'To dry up and die', options: ['To dry up and die', 'To grow quickly', 'To change colour for fun', 'To produce fruit'] },
        { passage: 'The detective scrutinized every detail of the crime scene, examining fingerprints, footprints, and even the angle of the broken glass.', word: 'scrutinized', question: 'What does "scrutinized" mean here?', answer: 'Examined very carefully', options: ['Examined very carefully', 'Ignored completely', 'Cleaned up', 'Photographed quickly'] },
        { passage: 'Despite his affluent background, Marcus chose to live simply and donate most of his earnings to charity.', word: 'affluent', question: 'What does "affluent" mean here?', answer: 'Wealthy', options: ['Wealthy', 'Poor', 'Difficult', 'Foreign'] },
        { passage: 'The teacher tried to foster a sense of curiosity in her students by asking open-ended questions and encouraging them to explore topics independently.', word: 'foster', question: 'What does "foster" mean here?', answer: 'To encourage and develop', options: ['To encourage and develop', 'To prevent', 'To test', 'To ignore'] },
        { passage: 'The negotiations between the two countries reached a stalemate, with neither side willing to make concessions.', word: 'stalemate', question: 'What does "stalemate" mean here?', answer: 'A situation where no progress can be made', options: ['A situation where no progress can be made', 'A successful agreement', 'A celebration', 'A quick decision'] },
      ],
    },
    'paragraph-main-idea': {
      type: 'passage-comprehension', instruction: 'Read the paragraph and identify the main idea.',
      items: [
        { passage: 'Electric cars are becoming more popular each year. Battery technology has improved, making them cheaper and able to travel farther on a single charge. Many governments now offer financial incentives to encourage people to switch from petrol cars.', question: 'What is the main idea?', answer: 'Electric cars are growing in popularity due to better technology and government support', options: ['Electric cars are growing in popularity due to better technology and government support', 'Petrol cars are better', 'Batteries are expensive', 'Governments do not like cars'] },
        { passage: 'Regular exercise has been shown to reduce stress, improve mood, and boost energy levels. Even a 30-minute walk each day can make a significant difference to your mental and physical health. The key is consistency rather than intensity.', question: 'What is the main idea?', answer: 'Regular exercise, even moderate, greatly benefits health', options: ['Regular exercise, even moderate, greatly benefits health', 'Only intense exercise works', 'Walking is the only good exercise', 'Stress cannot be reduced'] },
        { passage: 'Online learning has expanded access to education for millions of people. Students in remote areas can now take courses from top universities. However, it requires strong self-discipline, and the lack of face-to-face interaction can be challenging.', question: 'What is the main idea?', answer: 'Online learning has both advantages and challenges', options: ['Online learning has both advantages and challenges', 'Online learning is always better', 'Traditional schools should close', 'Self-discipline is not important'] },
        { passage: 'The Amazon rainforest produces about 20% of the world\'s oxygen. It is home to millions of plant and animal species. Deforestation threatens this ecosystem, with an area the size of a football pitch being lost every minute.', question: 'What is the main idea?', answer: 'The Amazon is vital but under threat from deforestation', options: ['The Amazon is vital but under threat from deforestation', 'The Amazon is growing', 'Football is popular in the Amazon', 'Oxygen is not important'] },
        { passage: 'Learning a musical instrument improves brain function in several ways. It enhances memory, develops fine motor skills, and strengthens the connection between the two hemispheres of the brain. These benefits last well into old age.', question: 'What is the main idea?', answer: 'Playing a musical instrument provides lasting cognitive benefits', options: ['Playing a musical instrument provides lasting cognitive benefits', 'Only children should learn music', 'Music is just for fun', 'The brain cannot change'] },
        { passage: 'Fast fashion has made trendy clothing affordable, but at a significant environmental cost. The textile industry is one of the largest polluters globally, and most fast fashion items end up in landfill within a year of purchase.', question: 'What is the main idea?', answer: 'Fast fashion is affordable but environmentally damaging', options: ['Fast fashion is affordable but environmentally damaging', 'Everyone should buy more clothes', 'Fashion has no impact on the environment', 'Clothing lasts forever'] },
      ],
    },
    'text-structure-id': {
      type: 'text-structure', instruction: 'Read the passage and identify how the text is organized.',
      items: [
        { passage: 'Many people commute to work by car. Cars are convenient and comfortable. However, they cause traffic jams and pollution. Buses and trains, on the other hand, are more environmentally friendly but can be crowded and less flexible.', question: 'How is this text organized?', answer: 'Compare and contrast', options: ['Compare and contrast', 'Chronological order', 'Problem and solution', 'Cause and effect'] },
        { passage: 'First, the volcano begins to rumble. Then, pressure builds up underground. Next, lava pushes through cracks in the rock. Finally, the volcano erupts, sending ash and lava into the air.', question: 'How is this text organized?', answer: 'Chronological/sequential order', options: ['Chronological/sequential order', 'Compare and contrast', 'Problem and solution', 'Cause and effect'] },
        { passage: 'Too much screen time can lead to eye strain and poor sleep. The blue light from screens disrupts the body\'s natural sleep cycle, causing people to stay awake longer and feel tired the next day.', question: 'How is this text organized?', answer: 'Cause and effect', options: ['Cause and effect', 'Compare and contrast', 'Problem and solution', 'Chronological order'] },
        { passage: 'Many schools struggle with bullying. One effective approach is peer mediation, where trained students help resolve conflicts. Schools that have adopted this method report a 40% decrease in bullying incidents.', question: 'How is this text organized?', answer: 'Problem and solution', options: ['Problem and solution', 'Cause and effect', 'Compare and contrast', 'Chronological order'] },
        { passage: 'Dogs make loyal companions for several reasons. They provide emotional support and reduce loneliness. They encourage their owners to exercise. They also offer protection and can be trained to assist people with disabilities.', question: 'How is this text organized?', answer: 'Main idea and supporting details', options: ['Main idea and supporting details', 'Chronological order', 'Compare and contrast', 'Problem and solution'] },
        { passage: 'The ancient Egyptians built the pyramids over 4,000 years ago. Hundreds of years later, the Greeks constructed the Parthenon. The Roman Colosseum followed, completed in 80 AD. Each civilization left its mark on architectural history.', question: 'How is this text organized?', answer: 'Chronological/sequential order', options: ['Chronological/sequential order', 'Compare and contrast', 'Cause and effect', 'Problem and solution'] },
      ],
    },
  },
  'b2': {
    'critical-reading': {
      type: 'passage-comprehension', instruction: 'Read the passage critically and answer the question.',
      items: [
        { passage: 'A study funded by a major soft drink company found that sugar-sweetened beverages have no significant impact on obesity rates. The researchers concluded that exercise habits are far more important than diet. No independent peer review was mentioned.', question: 'What should a critical reader question about this study?', answer: 'The funding source creates a conflict of interest', options: ['The funding source creates a conflict of interest', 'Exercise is not important', 'The study must be correct', 'Sugar is healthy'] },
        { passage: '"Nine out of ten dentists recommend BrightSmile toothpaste." This claim appears on the product packaging. No details are given about who the dentists were, how they were selected, or what question they were asked.', question: 'Why should readers be skeptical?', answer: 'The claim lacks verifiable details and methodology', options: ['The claim lacks verifiable details and methodology', 'Dentists always tell the truth', 'Ten is enough for a valid study', 'Toothpaste claims are always regulated'] },
        { passage: 'The article argues that remote work is destroying city economies, citing declining restaurant revenue in downtown areas. However, it does not mention the growth of suburban businesses, home office supply sales, or reduced commuting costs for workers.', question: 'What is the main flaw in the article\'s argument?', answer: 'It presents only one side and ignores counter-evidence', options: ['It presents only one side and ignores counter-evidence', 'Remote work is definitely bad', 'City restaurants are not important', 'The article is completely wrong'] },
        { passage: 'A newspaper headline reads: "Crime Soars to Record Levels." The article reveals that crime rose by 2% compared to last year, but is still 30% lower than it was a decade ago. Reports of crime have increased due to a new online reporting system.', question: 'How is the headline misleading?', answer: 'It exaggerates a small increase and ignores the long-term decline', options: ['It exaggerates a small increase and ignores the long-term decline', 'Crime is actually at record levels', 'Online reporting is bad', 'The article is perfectly accurate'] },
        { passage: 'An opinion piece states: "Everyone knows that classical music makes children smarter." It offers no citations, no research references, and no data. The author is a piano teacher who runs a music school.', question: 'What are the weaknesses in this argument?', answer: 'No evidence provided and the author has a financial bias', options: ['No evidence provided and the author has a financial bias', 'The claim is definitely true', 'Piano teachers are always right', 'Classical music is bad for children'] },
        { passage: 'The government report highlights a 15% increase in renewable energy adoption but buries the fact that fossil fuel subsidies also increased by 20% in the same period. The report\'s title focuses exclusively on the green energy gains.', question: 'What is the report doing?', answer: 'Selectively emphasizing positive data while hiding contradictory information', options: ['Selectively emphasizing positive data while hiding contradictory information', 'Being completely transparent', 'Reporting all facts equally', 'Lying about renewable energy'] },
      ],
    },
    'argument-evaluation': {
      type: 'passage-comprehension', instruction: 'Evaluate the strength of the argument presented.',
      items: [
        { passage: 'Social media should be banned for anyone under 16. A recent study of 50 teenagers found that 80% felt anxious after using social media. Therefore, it is clearly harmful to all young people.', question: 'What weakens this argument?', answer: 'The sample size is too small to generalize to all young people', options: ['The sample size is too small to generalize to all young people', 'The argument is perfectly strong', 'Social media is always harmful', 'Teenagers never feel anxious'] },
        { passage: 'We should stop building new roads because my grandfather never needed a car and he lived to be 95. People today are just lazy. If everyone walked, we would all be healthier and roads would be unnecessary.', question: 'What logical flaw is present?', answer: 'Anecdotal evidence and oversimplification', options: ['Anecdotal evidence and oversimplification', 'The argument is well-supported', 'Walking is bad for health', 'Roads are never needed'] },
        { passage: 'Country X has universal healthcare and low crime rates. Country Y has private healthcare and high crime rates. Therefore, universal healthcare reduces crime.', question: 'What is the logical error?', answer: 'Correlation is presented as causation', options: ['Correlation is presented as causation', 'The conclusion is obviously correct', 'Country X is always better', 'Healthcare has no effects'] },
        { passage: 'Professor Smith, a world-renowned biologist, claims that investing in cryptocurrency is the best financial strategy. He says his scientific training helps him analyze market patterns better than financial experts.', question: 'Why should we question this claim?', answer: 'Expertise in biology does not transfer to financial advice', options: ['Expertise in biology does not transfer to financial advice', 'Professors are always right', 'Scientists understand everything', 'Cryptocurrency is always good'] },
        { passage: 'Either we cut education funding by 30% or the country will go bankrupt. There is no other option. We must choose to save our economy.', question: 'What is the logical flaw?', answer: 'False dilemma — only two extreme options are presented', options: ['False dilemma — only two extreme options are presented', 'The argument is correct', 'Education is not important', 'Bankruptcy is inevitable'] },
        { passage: 'Organic food must be healthier because it is more expensive. People would not pay more for something that is not better quality. The market always reflects true value.', question: 'What is wrong with this reasoning?', answer: 'Price does not determine health value; appeal to market logic is flawed', options: ['Price does not determine health value; appeal to market logic is flawed', 'Expensive things are always better', 'Organic food is definitely healthier', 'Markets are always correct'] },
      ],
    },
    'complex-inference': {
      type: 'vocab-context', instruction: 'Read the passage and make a complex inference about the underlined concept.',
      items: [
        { passage: 'The company\'s annual report emphasized "unprecedented growth" and "exciting new partnerships." However, three board members resigned the same week, and the stock price dropped 12% after the report was published.', word: 'unprecedented growth', question: 'What does the contrast between the report and the events suggest?', answer: 'The report may be overly optimistic or misleading', options: ['The report may be overly optimistic or misleading', 'The company is doing very well', 'Board members always resign during growth', 'Stock prices always fall'] },
        { passage: 'The politician said she "fully supported" the environmental bill. However, she was absent during the final vote and had accepted large donations from the oil industry throughout her campaign.', word: 'fully supported', question: 'What can you infer about her actual position?', answer: 'Her actions contradict her stated support', options: ['Her actions contradict her stated support', 'She genuinely supports the bill', 'Politicians always miss votes', 'Oil companies support the environment'] },
        { passage: 'The school described the program as "voluntary." However, students who did not participate received lower marks for "engagement," and their parents were called in for meetings about their child\'s "lack of commitment."', word: 'voluntary', question: 'What can you infer about the program?', answer: 'It is not truly voluntary — there are penalties for not participating', options: ['It is not truly voluntary — there are penalties for not participating', 'It is completely optional', 'All schools do this', 'The parents are overreacting'] },
        { passage: 'The hotel advertised "ocean views from every room." Guest reviews revealed that some rooms faced a narrow alley, with a tiny sliver of sea visible only from the bathroom window if you leaned at an angle.', word: 'ocean views', question: 'What does this reveal about the advertisement?', answer: 'It is technically true but deliberately misleading', options: ['It is technically true but deliberately misleading', 'All rooms have great views', 'Guest reviews are always wrong', 'The hotel is honest'] },
        { passage: 'The review praised the film\'s "ambitious scope" and "bold artistic choices." It also noted the audience walked out in large numbers and the film made back only 10% of its budget at the box office.', word: 'ambitious scope', question: 'What is the reviewer likely doing?', answer: 'Using polite language to describe a commercial failure', options: ['Using polite language to describe a commercial failure', 'Praising a successful film', 'Recommending the film', 'Writing a dishonest review'] },
        { passage: 'The memo stated that the company was "right-sizing" and "optimizing human resources." The following Monday, 200 employees found their keycards no longer worked and security directed them to an exit interview room.', word: 'right-sizing', question: 'What does "right-sizing" actually mean here?', answer: 'Mass layoffs disguised with corporate euphemism', options: ['Mass layoffs disguised with corporate euphemism', 'Hiring more people', 'Reorganizing desks', 'Improving employee benefits'] },
      ],
    },
    'academic-reading': {
      type: 'passage-comprehension', instruction: 'Read the academic text and answer the question.',
      items: [
        { passage: 'A longitudinal study tracked 5,000 participants over 20 years and found that those who maintained social connections had a 50% lower risk of dementia. The researchers controlled for age, education, and pre-existing health conditions, strengthening the validity of their findings.', question: 'Why is this study considered reliable?', answer: 'Large sample, long duration, and controlled variables', options: ['Large sample, long duration, and controlled variables', 'It was done recently', 'The researchers are famous', 'Everyone agrees with it'] },
        { passage: 'The meta-analysis examined 47 studies on the effectiveness of mindfulness-based stress reduction. While 38 studies showed positive effects, the authors noted significant heterogeneity in methodology, making it difficult to draw universal conclusions.', question: 'What limitation did the authors identify?', answer: 'The studies used different methods, making comparison difficult', options: ['The studies used different methods, making comparison difficult', 'Mindfulness does not work', 'Too few studies were examined', 'All studies agreed'] },
        { passage: 'Epigenetics research has revealed that environmental factors can alter gene expression without changing the DNA sequence itself. Notably, studies on Dutch famine survivors showed that stress experienced by pregnant women affected the health of their grandchildren through epigenetic mechanisms.', question: 'What is the key finding about epigenetics?', answer: 'Environmental effects can be passed across generations without DNA changes', options: ['Environmental effects can be passed across generations without DNA changes', 'DNA never changes', 'Only genetics matter', 'Famine has no long-term effects'] },
        { passage: 'The double-blind, placebo-controlled trial involved 1,200 participants randomly assigned to treatment or control groups. Results showed a statistically significant improvement (p < 0.01) in the treatment group. However, the effect size was small (d = 0.2).', question: 'What should readers note despite the statistical significance?', answer: 'The effect size was small, meaning the practical impact may be limited', options: ['The effect size was small, meaning the practical impact may be limited', 'The result is not significant', 'The study was poorly designed', 'All participants improved'] },
        { passage: 'Researchers found a strong negative correlation (r = -0.78) between air pollution levels and lung function in urban populations. The study was cross-sectional, examining data from 30 cities at a single point in time.', question: 'What is a limitation of this study design?', answer: 'Cross-sectional design cannot establish causation', options: ['Cross-sectional design cannot establish causation', 'The correlation is too weak', 'Not enough cities were studied', 'Air pollution is not measurable'] },
        { passage: 'The peer-reviewed paper proposed a novel framework for understanding language acquisition, integrating both nativist and constructivist perspectives. Critics argued that while theoretically elegant, the framework lacked empirical support and made predictions that were difficult to test.', question: 'What is the main criticism of the framework?', answer: 'It lacks empirical evidence and is hard to test', options: ['It lacks empirical evidence and is hard to test', 'It is too simple', 'It ignores language completely', 'No one read the paper'] },
      ],
    },
  },
  'c1': {
    'evaluating-sources': {
      type: 'passage-comprehension', instruction: 'Read the passage and evaluate the reliability of the source.',
      items: [
        { passage: 'A blog post titled "The Truth About Vaccines" cites a single retracted study from 1998 and includes testimonials from three parents. It does not reference any current medical literature or health organization guidelines. The blog carries advertisements for alternative medicine products.', question: 'How reliable is this source?', answer: 'Unreliable — retracted study, no current evidence, commercial bias', options: ['Unreliable — retracted study, no current evidence, commercial bias', 'Very reliable', 'Somewhat reliable', 'Cannot be determined'] },
        { passage: 'A systematic review published in The Lancet analyzed 120 randomized controlled trials across 15 countries. The authors declared no conflicts of interest. The review underwent double-blind peer review and includes a detailed methodology section.', question: 'What makes this source credible?', answer: 'Peer-reviewed, large scope, transparent methods, no conflicts', options: ['Peer-reviewed, large scope, transparent methods, no conflicts', 'It is in a famous journal', 'It has many pages', 'The authors are well-known'] },
        { passage: 'A think tank released a report arguing for deregulation of the financial industry. The think tank receives 70% of its funding from major banks and investment firms. The report does not disclose this funding source.', question: 'What is the primary concern with this source?', answer: 'Undisclosed funding creates a significant conflict of interest', options: ['Undisclosed funding creates a significant conflict of interest', 'Think tanks are always wrong', 'Deregulation is always bad', 'The report is too short'] },
        { passage: 'An investigative journalism piece in a major newspaper reveals government corruption. It cites leaked documents, includes statements from five named officials, and provides links to all primary source documents. The newspaper has won multiple awards for accuracy.', question: 'What makes this piece credible despite being journalism, not academic work?', answer: 'Named sources, primary documents, and institutional reputation for accuracy', options: ['Named sources, primary documents, and institutional reputation for accuracy', 'Newspapers are always right', 'Awards guarantee accuracy', 'Government officials always lie'] },
        { passage: 'A Wikipedia article on quantum physics is well-referenced, with 87 citations to academic papers and textbooks. The article has been reviewed by the WikiProject Physics team and marked as "Good Article" status. However, it could be edited by anyone at any time.', question: 'How should you treat this source?', answer: 'Useful starting point but verify claims through the cited primary sources', options: ['Useful starting point but verify claims through the cited primary sources', 'Completely unreliable', 'As authoritative as a textbook', 'Never use Wikipedia for anything'] },
        { passage: 'A social media influencer with 2 million followers posts a video claiming a specific supplement cured their chronic fatigue. They provide a discount code for the product. No medical studies are cited. The caption says "not medical advice."', question: 'Why is this an unreliable health source?', answer: 'Financial incentive, no evidence, anecdotal claim, disclaimer contradicts message', options: ['Financial incentive, no evidence, anecdotal claim, disclaimer contradicts message', 'Influencers are always honest', 'Two million followers means reliability', 'The disclaimer makes it fine'] },
      ],
    },
    'rhetorical-analysis-reading': {
      type: 'passage-comprehension', instruction: 'Analyze the rhetorical strategies used in the passage.',
      items: [
        { passage: 'Imagine a world where every child has access to clean water. Imagine a world where no mother has to watch her baby die from a preventable disease. This is not a fantasy — it is within our reach, if we act now.', question: 'What rhetorical device is primarily used?', answer: 'Anaphora (repetition) combined with emotional appeal (pathos)', options: ['Anaphora (repetition) combined with emotional appeal (pathos)', 'Logical argument (logos)', 'Appeal to authority (ethos)', 'Understatement'] },
        { passage: 'As a doctor with 30 years of experience and former head of the National Health Board, I can tell you with certainty that this policy will save lives. I have seen the data, treated the patients, and advised three governments on this exact issue.', question: 'What is the primary rhetorical strategy?', answer: 'Appeal to authority and credibility (ethos)', options: ['Appeal to authority and credibility (ethos)', 'Emotional manipulation', 'Statistical evidence', 'Logical reasoning'] },
        { passage: 'The data is unambiguous: countries that invested in early childhood education saw a 15% increase in GDP over 20 years. For every $1 invested, the return was $7. These are not estimates — these are measured outcomes from 30 countries.', question: 'What is the primary rhetorical strategy?', answer: 'Appeal to evidence and logic (logos)', options: ['Appeal to evidence and logic (logos)', 'Emotional appeal', 'Appeal to authority', 'Narrative storytelling'] },
        { passage: 'They came for the forests, and we said nothing. They poisoned the rivers, and we looked away. They filled the skies with smoke, and we carried on. Now they come for our children\'s future — will we still remain silent?', question: 'What rhetorical devices are used?', answer: 'Anaphora, escalation, and rhetorical question', options: ['Anaphora, escalation, and rhetorical question', 'Only statistics', 'Appeal to authority', 'Understatement'] },
        { passage: 'My opponent claims to care about working families. Yet he voted against the minimum wage increase three times. He claims to support education, yet he cut school budgets by 20%. Words are easy; his record tells a different story.', question: 'What rhetorical strategy is being used?', answer: 'Juxtaposing words against actions to undermine credibility', options: ['Juxtaposing words against actions to undermine credibility', 'Supporting the opponent', 'Using statistics', 'Making an emotional plea'] },
        { passage: 'Is it not strange that we can send a spacecraft to Mars but cannot feed every person on Earth? Is it not remarkable that we have the technology to connect billions online but cannot provide clean water to millions? The problem is not capability — it is priority.', question: 'What is the main rhetorical technique?', answer: 'Rhetorical questions with ironic contrast to expose misplaced priorities', options: ['Rhetorical questions with ironic contrast to expose misplaced priorities', 'Formal academic argument', 'Personal anecdote', 'Appeal to authority'] },
      ],
    },
    'implicit-bias': {
      type: 'vocab-context', instruction: 'Identify the implicit bias or assumption in the passage.',
      items: [
        { passage: 'The article profiles a successful female CEO and notes she "manages to balance her demanding career with being a devoted mother of three." Her male counterpart in the same feature is described only in terms of his business achievements.', word: 'balance', question: 'What implicit bias does this reveal?', answer: 'Gender bias — women are expected to justify career success against family roles', options: ['Gender bias — women are expected to justify career success against family roles', 'The article is perfectly balanced', 'Being a mother is not relevant', 'The article criticizes motherhood'] },
        { passage: 'A news report describes a protest in a wealthy suburb as "residents expressing concerns" while describing a similar protest in a low-income neighbourhood as "a crowd causing disturbances." Both events involved the same number of people and similar activities.', word: 'disturbances', question: 'What bias is present in the language?', answer: 'Socioeconomic bias — identical actions described differently based on neighbourhood wealth', options: ['Socioeconomic bias — identical actions described differently based on neighbourhood wealth', 'The reports are perfectly accurate', 'Wealthy areas never have disturbances', 'Poor areas are always dangerous'] },
        { passage: 'The history textbook states: "Europeans discovered the Americas in 1492, bringing civilization and progress to the indigenous peoples." It does not mention the existing civilizations, their achievements, or the devastating impact of colonization.', word: 'discovered', question: 'What bias does this framing contain?', answer: 'Eurocentric bias — ignoring indigenous civilizations and whitewashing colonization', options: ['Eurocentric bias — ignoring indigenous civilizations and whitewashing colonization', 'An accurate historical account', 'A balanced perspective', 'Indigenous peoples had no civilizations'] },
        { passage: 'A research paper on workplace productivity exclusively surveys office workers in corporate environments in three Western countries. It presents its findings as applicable to "the modern workforce" globally.', word: 'modern workforce', question: 'What bias is present?', answer: 'Western-centric and occupational bias — generalizing from a narrow sample', options: ['Western-centric and occupational bias — generalizing from a narrow sample', 'The study is globally valid', 'Only office work counts', 'Western countries represent everyone'] },
        { passage: 'The travel guide describes a Southeast Asian city as "chaotic but charming" and "surprisingly modern in places." It describes a European city of similar size and development as "vibrant and cosmopolitan."', word: 'surprisingly modern', question: 'What assumption underlies "surprisingly"?', answer: 'The default expectation is that non-Western cities are not modern', options: ['The default expectation is that non-Western cities are not modern', 'The guide is equally praising both cities', 'Southeast Asian cities are always chaotic', 'European cities are always better'] },
        { passage: 'A medical textbook notes that "patients from certain cultural backgrounds may have difficulty understanding treatment plans and often require extra explanation." It does not consider that the treatment plans may be poorly communicated or culturally inappropriate.', word: 'difficulty understanding', question: 'What bias does this reveal?', answer: 'It places the blame on patients rather than considering systemic communication failures', options: ['It places the blame on patients rather than considering systemic communication failures', 'Some patients are less intelligent', 'Medical texts are always unbiased', 'Cultural background is irrelevant to medicine'] },
      ],
    },
    'research-paper-reading': {
      type: 'passage-comprehension', instruction: 'Read the research extract and answer the question.',
      items: [
        { passage: 'The study employed a mixed-methods approach, combining quantitative surveys (n=2,400) with qualitative interviews (n=45). While the survey data revealed broad trends, the interviews provided nuanced understanding of participants\' lived experiences. Triangulation of data sources strengthened the overall validity of the findings.', question: 'Why did the researchers use mixed methods?', answer: 'To combine breadth of surveys with depth of interviews for stronger validity', options: ['To combine breadth of surveys with depth of interviews for stronger validity', 'Because one method was not enough', 'To make the paper longer', 'It was required by the journal'] },
        { passage: 'The authors acknowledge several limitations. The sample was drawn exclusively from urban populations, limiting generalizability to rural contexts. Additionally, the cross-sectional design precludes causal inferences. Self-reported data may be subject to social desirability bias.', question: 'How many limitations are identified?', answer: 'Three: urban-only sample, cross-sectional design, self-report bias', options: ['Three: urban-only sample, cross-sectional design, self-report bias', 'One limitation', 'Two limitations', 'No limitations'] },
        { passage: 'The literature review reveals a gap: while extensive research exists on adult second language acquisition, few studies examine the specific challenges faced by multilingual learners acquiring a fourth or fifth language. This study aims to address that gap by investigating polyglots\' metalinguistic awareness.', question: 'What gap does the study address?', answer: 'Limited research on learners acquiring a fourth or fifth language', options: ['Limited research on learners acquiring a fourth or fifth language', 'No research exists on language learning', 'Too much research on adults', 'Polyglots do not exist'] },
        { passage: 'Results were statistically significant (p < 0.001, d = 0.85), indicating a large effect size. The treatment group showed markedly higher performance on all three measures compared to the control group. Confidence intervals did not overlap between groups.', question: 'What makes these results particularly strong?', answer: 'High significance, large effect size, and non-overlapping confidence intervals', options: ['High significance, large effect size, and non-overlapping confidence intervals', 'Only the p-value matters', 'The sample was very large', 'The control group also improved'] },
        { passage: 'The theoretical framework draws on Vygotsky\'s Zone of Proximal Development and Krashen\'s Input Hypothesis, synthesizing both to propose a new model of scaffolded digital learning. The authors argue that neither theory alone adequately accounts for technology-mediated language learning.', question: 'What is the authors\' key theoretical contribution?', answer: 'A new model that integrates two existing theories for digital learning contexts', options: ['A new model that integrates two existing theories for digital learning contexts', 'Rejecting both theories entirely', 'Proving Vygotsky wrong', 'Supporting only Krashen'] },
        { passage: 'Ethical approval was obtained from the university\'s Institutional Review Board. Informed consent was collected from all participants, who were assured anonymity and the right to withdraw at any time without consequence. Data was stored on encrypted servers accessible only to the research team.', question: 'What ethical measures were taken?', answer: 'IRB approval, informed consent, anonymity, right to withdraw, and secure data storage', options: ['IRB approval, informed consent, anonymity, right to withdraw, and secure data storage', 'Only informed consent', 'No ethical measures were needed', 'The data was made public'] },
      ],
    },
  },
  'c2': {
    'literary-interpretation': {
      type: 'passage-comprehension', instruction: 'Read the literary passage and interpret its meaning.',
      items: [
        { passage: 'He had been so careful with his life, so precise in his routines, that when the earthquake came, his teacup did not even rattle. It was only later, surveying the rubble of the neighbourhood, that he realized his stillness had saved nothing but the teacup.', question: 'What does the teacup symbolize?', answer: 'The futility of controlling small things while unable to prevent larger catastrophe', options: ['The futility of controlling small things while unable to prevent larger catastrophe', 'The importance of routines', 'Good earthquake preparation', 'A love of tea'] },
        { passage: 'She returned to the village after thirty years. The house was smaller than she remembered, the garden wild. The apple tree she had climbed as a child now barely reached her shoulder. She understood then that it was not the tree that had shrunk.', question: 'What realization does the narrator have?', answer: 'Memory distorts the past; she has changed, not the place', options: ['Memory distorts the past; she has changed, not the place', 'The tree was cut down', 'The village has grown', 'Apple trees shrink over time'] },
        { passage: 'The emperor\'s new portrait showed him as he wished to be seen: taller, younger, with kind eyes and an open hand. The painter was rewarded generously. The mirror, which showed something different, was moved to a room no one visited.', question: 'What is the passage commenting on?', answer: 'How power prefers flattering fiction over uncomfortable truth', options: ['How power prefers flattering fiction over uncomfortable truth', 'The emperor was very handsome', 'Painters are always dishonest', 'Mirrors are unreliable'] },
        { passage: 'They built the wall to keep danger out. Then they built it higher, to keep ideas out. Then higher still, to keep the sky out. In the end, the only thing left inside the wall was the wall itself.', question: 'What is the allegory about?', answer: 'Excessive isolationism ultimately destroys what it claims to protect', options: ['Excessive isolationism ultimately destroys what it claims to protect', 'Walls are good for security', 'Architecture is important', 'Building materials matter'] },
        { passage: '"I forgive you," she said, in a voice that closed every door in the house. He understood that forgiveness, spoken that way, was just another word for goodbye.', question: 'What literary technique creates the meaning?', answer: 'Irony — the words say forgiveness but the subtext conveys finality and rejection', options: ['Irony — the words say forgiveness but the subtext conveys finality and rejection', 'The woman is genuinely forgiving', 'The doors literally closed', 'She is being kind'] },
        { passage: 'The old man sat on the bench where he had proposed to his wife fifty years ago. The bench was the same. The park was the same. Even the pigeons seemed the same. Only the space beside him had changed.', question: 'What creates the emotional impact?', answer: 'The contrast between everything unchanged and the one devastating absence', options: ['The contrast between everything unchanged and the one devastating absence', 'He does not like pigeons', 'The bench is uncomfortable', 'Parks do not change'] },
      ],
    },
    'cultural-reference': {
      type: 'passage-comprehension', instruction: 'Identify and explain the cultural reference in the passage.',
      items: [
        { passage: 'The CEO promised transparency, but employees joked that they were still waiting for him to pull back the curtain — after all, even the Wizard of Oz turned out to be just a man behind a machine.', question: 'What cultural reference is being made?', answer: '"The Wizard of Oz" — a powerful figure revealed to be an ordinary person using illusions', options: ['"The Wizard of Oz" — a powerful figure revealed to be an ordinary person using illusions', 'A reference to modern technology', 'A real wizard', 'A documentary about CEOs'] },
        { passage: 'She had been warned that the new job would be a Sisyphean task, but she took it anyway, believing she could succeed where others had failed. Two years later, she understood the metaphor perfectly.', question: 'What does "Sisyphean" mean in this context?', answer: 'An endlessly repetitive and futile effort, from the Greek myth of Sisyphus', options: ['An endlessly repetitive and futile effort, from the Greek myth of Sisyphus', 'A very easy task', 'A dangerous activity', 'A well-paid position'] },
        { passage: 'The politician\'s speech was full of Orwellian language — "enhanced interrogation" for torture, "collateral damage" for civilian deaths, "rightsizing" for mass layoffs. War is peace, indeed.', question: 'What cultural reference does "Orwellian" invoke?', answer: 'George Orwell\'s "1984" — the use of language to disguise or distort reality', options: ['George Orwell\'s "1984" — the use of language to disguise or distort reality', 'A type of public speaking', 'A compliment about clarity', 'A reference to good governance'] },
        { passage: 'When the startup collapsed, taking millions in investor money, the founder simply moved to another city and started again. It was a very Gatsby-esque reinvention — the past erased, the future fabricated from sheer audacity.', question: 'What does "Gatsby-esque" reference?', answer: 'F. Scott Fitzgerald\'s "The Great Gatsby" — reinventing oneself and the illusion of the American Dream', options: ['F. Scott Fitzgerald\'s "The Great Gatsby" — reinventing oneself and the illusion of the American Dream', 'A type of business strategy', 'A compliment about resilience', 'A reference to Jay-Z'] },
        { passage: 'The committee debated endlessly, rearranging their positions but achieving nothing of substance. It was, one member muttered, like rearranging deck chairs on the Titanic.', question: 'What does the Titanic reference mean here?', answer: 'Making trivial adjustments while ignoring an impending catastrophe', options: ['Making trivial adjustments while ignoring an impending catastrophe', 'Organizing a cruise', 'A reference to good planning', 'A compliment about the committee'] },
        { passage: 'He opened the box of old letters and photographs, and suddenly the past came rushing back, unbidden and overwhelming. His wife gently closed the box. "Some things," she said, "are best left in Pandora\'s keeping."', question: 'What does the Pandora reference mean?', answer: 'From Greek myth — opening something that releases uncontrollable consequences', options: ['From Greek myth — opening something that releases uncontrollable consequences', 'A type of storage box', 'A music streaming service', 'A compliment about organization'] },
      ],
    },
    'advanced-synthesis': {
      type: 'vocab-context', instruction: 'Synthesize information across the passage to answer the question.',
      items: [
        { passage: 'Study A found that bilingual children outperformed monolinguals on cognitive flexibility tasks. Study B found no difference when socioeconomic status was controlled for. Study C found advantages only in bilinguals who used both languages daily. A meta-analysis noted that publication bias may inflate positive findings in this field.', word: 'bilingual advantage', question: 'What conclusion can you synthesize from all four sources?', answer: 'The bilingual advantage is uncertain — it may depend on usage patterns, SES, and publication bias', options: ['The bilingual advantage is uncertain — it may depend on usage patterns, SES, and publication bias', 'Bilingualism always helps', 'Bilingualism never helps', 'Only Study A is correct'] },
        { passage: 'The philosopher argued that free will is an illusion, citing neuroscience showing decisions are made before conscious awareness. The psychologist countered that the subjective experience of choice is itself meaningful and functionally real. The legal scholar noted that the entire justice system depends on the assumption of agency, regardless of its metaphysical status.', word: 'free will', question: 'How do the three perspectives relate to each other?', answer: 'They operate at different levels: neurological, experiential, and institutional, and need not contradict each other', options: ['They operate at different levels: neurological, experiential, and institutional, and need not contradict each other', 'Only the philosopher is correct', 'Free will clearly exists', 'The question is meaningless'] },
        { passage: 'Economist A advocates GDP growth as the primary measure of national success. Economist B promotes the Genuine Progress Indicator, which accounts for environmental degradation and inequality. Sociologist C argues for Gross National Happiness, as practiced in Bhutan. All three cite evidence that their preferred metric best predicts citizen wellbeing.', word: 'national success', question: 'What synthesis can you draw about measuring national success?', answer: 'No single metric captures it fully; each reveals different dimensions that a comprehensive approach should integrate', options: ['No single metric captures it fully; each reveals different dimensions that a comprehensive approach should integrate', 'GDP is the only real measure', 'Happiness cannot be measured', 'Only one expert is right'] },
        { passage: 'Historical analysis shows that pandemics accelerate existing social trends. The Black Death weakened feudalism by empowering surviving workers. The 1918 flu spurred public health infrastructure. COVID-19 accelerated remote work and digital adoption. In each case, the pandemic did not create change but amplified pressures already present.', word: 'accelerate', question: 'What pattern can you synthesize across these examples?', answer: 'Pandemics act as catalysts for pre-existing societal shifts rather than creating entirely new ones', options: ['Pandemics act as catalysts for pre-existing societal shifts rather than creating entirely new ones', 'Pandemics always cause the same effects', 'Society never changes after pandemics', 'Only COVID-19 caused change'] },
        { passage: 'The architect designed buildings that blurred the line between indoors and outdoors. The composer wrote music that blurred the line between melody and noise. The novelist wrote stories that blurred the line between fiction and autobiography. Critics praised all three for "breaking boundaries." One reviewer asked whether boundaries exist to be broken, or whether some distinctions serve essential purposes.', word: 'breaking boundaries', question: 'What tension does the reviewer identify?', answer: 'That boundary-breaking is valued as inherently good, but some boundaries may serve important functions', options: ['That boundary-breaking is valued as inherently good, but some boundaries may serve important functions', 'Art should never break boundaries', 'All boundaries are meaningless', 'The critic dislikes all three artists'] },
        { passage: 'Text 1 argues that AI will replace most human jobs. Text 2 argues AI will create more jobs than it destroys. Text 3 provides historical evidence that every major technology shift caused temporary displacement followed by net job creation. Text 4 counters that AI is qualitatively different from previous technologies because it targets cognitive, not just manual, labour.', word: 'AI and employment', question: 'What nuanced position emerges from synthesizing all four texts?', answer: 'Historical patterns suggest net job creation, but AI\'s cognitive nature may make this time genuinely different', options: ['Historical patterns suggest net job creation, but AI\'s cognitive nature may make this time genuinely different', 'AI will definitely destroy all jobs', 'AI will create infinite jobs', 'Technology never affects employment'] },
      ],
    },
    'ambiguity-resolution': {
      type: 'passage-comprehension', instruction: 'Read the passage and resolve the ambiguity or multiple possible interpretations.',
      items: [
        { passage: 'The board voted to "table the motion." In American English, this means to postpone or shelve the discussion. In British English, it means the opposite — to bring the motion forward for immediate discussion. The minutes of the international meeting did not specify which meaning was intended.', question: 'Why is this ambiguity significant?', answer: 'The same phrase means opposite things in different varieties of English, affecting the outcome', options: ['The same phrase means opposite things in different varieties of English, affecting the outcome', 'The word "table" is unclear', 'All meetings are ambiguous', 'British and American English are the same'] },
        { passage: '"I never said she stole my money." This sentence has seven different meanings depending on which word is stressed. Stressing "I" implies someone else said it. Stressing "stole" implies she obtained it by other means. Stressing "my" implies she stole someone else\'s money.', question: 'What does this demonstrate about English?', answer: 'Prosodic stress can radically change meaning even when words remain identical', options: ['Prosodic stress can radically change meaning even when words remain identical', 'English has too many words', 'The sentence is grammatically wrong', 'Stress never matters in English'] },
        { passage: 'The contract states: "The company shall not be liable for damages arising from any failure to perform, except where such failure results from negligence." A lawyer for the plaintiff argued "negligence" included poor management. The defence argued it meant only direct physical carelessness.', question: 'What type of ambiguity is at issue?', answer: 'Lexical ambiguity — the scope of "negligence" is undefined and legally contested', options: ['Lexical ambiguity — the scope of "negligence" is undefined and legally contested', 'The contract is perfectly clear', 'Negligence has only one meaning', 'Lawyers always agree'] },
        { passage: 'The critic wrote: "This is a film that demands to be seen." Read as praise, it means the film is unmissable. Read as irony — given the review\'s otherwise negative tone — it could mean the film is so bad it must be witnessed to be believed. The lack of explicit evaluative language leaves the interpretation open.', question: 'What makes this review deliberately ambiguous?', answer: 'The phrase works as both high praise and devastating critique depending on tone', options: ['The phrase works as both high praise and devastating critique depending on tone', 'The reviewer forgot their opinion', 'Films cannot be ambiguous', 'All reviews are ambiguous'] },
        { passage: 'The ancient oracle declared: "A great empire will be destroyed." The king interpreted this as predicting his enemy\'s defeat and went to war. He lost. The oracle\'s prophecy was technically correct — a great empire was indeed destroyed: his own.', question: 'What type of ambiguity did the oracle exploit?', answer: 'Referential ambiguity — "a great empire" could refer to either side', options: ['Referential ambiguity — "a great empire" could refer to either side', 'The oracle was wrong', 'The king was foolish', 'Oracles are always clear'] },
        { passage: 'The letter ended: "I could not love you more." Does this mean "My love for you is at its maximum — it cannot increase"? Or does it mean "I am unable to love you more than I do, because something prevents deeper feeling"? The recipient, having just been told the relationship was over, was left to decide.', question: 'How does context shape the ambiguity?', answer: 'The breakup context makes both readings plausible — maximal love or inability to love enough', options: ['The breakup context makes both readings plausible — maximal love or inability to love enough', 'The meaning is obvious', 'Love letters are never ambiguous', 'Only one reading is possible'] },
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

class Reading {
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
        preread: 'Activate schema: discuss topic, predict content from title/images',
        present: `Focus: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        reflect: 'Metacognitive check: What strategies did you use?',
      },
    };
  }
}

module.exports = Reading;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const rd = new Reading();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': { const [, id, level] = args; if (!id) throw new Error('Usage: start <id> [level]'); if (level) rd.setLevel(id, level); out({ action: 'start', profile: rd.getProfile(id), nextSkills: rd.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(rd.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const level = loadProfile(id).level || 'a1'; if (skill) { out(rd.generateExercise(level, skill, 5)); } else { const n = rd.getNextSkills(id, 1).next; out(n.length ? rd.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); let exp = expected; try { exp = JSON.parse(expected); } catch {} out(rd.checkAnswer(type, exp, answer)); break; }
      case 'record': { const [, id, level, cat, skill, sc, tot, ...notes] = args; if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total>'); out(rd.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(rd.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(rd.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(rd.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? rd.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(rd.setLevel(id, l)); break; }
      case 'students': { out(rd.listStudents()); break; }
      default: out({ usage: 'node reading.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
