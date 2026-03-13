// eClaw ELA Writing Interactive Tutor (K-6). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ela-writing');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'narrative': ['draw-and-write'],
    'conventions': ['simple-sentences'],
    'organization': ['sequence-words'],
  },
  'grade-1': {
    'narrative': ['narrative-sequence'],
    'informational': ['informational-facts'],
    'opinion': ['opinion-reason'],
    'craft': ['sentence-expansion'],
  },
  'grade-2': {
    'narrative': ['narrative-details'],
    'informational': ['informational-paragraph'],
    'opinion': ['opinion-with-reasons'],
    'craft': ['show-dont-tell'],
    'revision': ['revision-arms'],
  },
  'grade-3': {
    'narrative': ['narrative-dialogue'],
    'informational': ['informational-multiparagraph'],
    'opinion': ['opinion-organized'],
    'craft': ['strong-leads', 'transitions'],
    'editing': ['editing-cups'],
  },
  'grade-4': {
    'narrative': ['narrative-pacing'],
    'informational': ['informational-evidence'],
    'opinion': ['argument-with-facts'],
    'craft': ['sentence-variety', 'revision-strategies'],
    'editing': ['editing-advanced'],
  },
  'grade-5': {
    'narrative': ['narrative-techniques'],
    'informational': ['informational-structure'],
    'opinion': ['argument-counterpoint'],
    'craft': ['voice-word-choice', 'combine-reduce-sentences'],
  },
  'grade-6': {
    'narrative': ['narrative-craft'],
    'informational': ['informational-formal'],
    'opinion': ['argument-evidence-based'],
    'craft': ['style-tone', 'paragraph-cohesion'],
  },
};

// ── Content Banks ──

const EXERCISE_BANKS = {
  'kindergarten': {
    'draw-and-write': {
      items: [
        { type: 'prompt', prompt: 'Draw a picture of your favorite animal. Then write one sentence about it.', genre: 'narrative', hint: 'What does your animal look like? What does it do?' },
        { type: 'prompt', prompt: 'Draw what you did today. Write a sentence about your picture.', genre: 'narrative', hint: 'Start with: Today I...' },
        { type: 'prompt', prompt: 'Draw your family. Write who is in your picture.', genre: 'narrative', hint: 'Start with: This is my...' },
        { type: 'prompt', prompt: 'Draw your favorite food. Write why you like it.', genre: 'opinion', hint: 'Start with: I like...' },
        { type: 'prompt', prompt: 'Draw a picture of the park. Write what you see.', genre: 'informational', hint: 'Start with: I see...' },
        { type: 'prompt', prompt: 'Draw something that makes you happy. Write about it.', genre: 'narrative', hint: 'Start with: I am happy when...' },
      ],
    },
    'simple-sentences': {
      items: [
        { fragment: 'the big dog', answer: 'The big dog runs fast.', rule: 'A sentence needs a subject AND an action. Start with a capital letter and end with a period.' },
        { fragment: 'my mom', answer: 'My mom is nice.', rule: 'Tell what the subject does or is.' },
        { fragment: 'ran fast', answer: 'The cat ran fast.', rule: 'A sentence needs someone doing the action.' },
        { fragment: 'I like', answer: 'I like to play.', rule: 'Finish the thought — what do you like?' },
        { fragment: 'the red ball', answer: 'The red ball bounced high.', rule: 'A sentence needs an action word (verb).' },
        { fragment: 'we went', answer: 'We went to the park.', rule: 'Tell where, when, or how.' },
        { fragment: 'she is', answer: 'She is my friend.', rule: 'Finish the thought.' },
        { fragment: 'a little bird', answer: 'A little bird sang a song.', rule: 'A sentence needs a subject and a verb.' },
      ],
    },
    'sequence-words': {
      items: [
        { sentence: '___, I woke up.', options: ['First', 'Then', 'Finally'], answer: 'First', rule: '"First" starts a sequence.' },
        { sentence: '___, I ate breakfast.', options: ['First', 'Then', 'Finally'], answer: 'Then', rule: '"Then" continues the sequence.' },
        { sentence: '___, I went to school.', options: ['First', 'Next', 'Finally'], answer: 'Finally', rule: '"Finally" ends the sequence.' },
        { sentence: '___, we got our coats.', options: ['First', 'Then', 'Last'], answer: 'First', rule: '"First" shows what happened at the beginning.' },
        { sentence: '___, we went outside.', options: ['First', 'Next', 'Last'], answer: 'Next', rule: '"Next" shows what happened after.' },
        { sentence: '___, we played tag.', options: ['First', 'Then', 'Last'], answer: 'Last', rule: '"Last" shows the end.' },
        { sentence: '___, mix the batter.', options: ['First', 'Then', 'Finally'], answer: 'First', rule: '"First" tells step one.' },
        { sentence: '___, pour it in the pan.', options: ['First', 'Then', 'Finally'], answer: 'Then', rule: '"Then" tells the next step.' },
      ],
    },
  },
  'grade-1': {
    'narrative-sequence': {
      items: [
        { type: 'prompt', prompt: 'Write 3 sentences about something fun you did. Use the words First, Then, and Last.', genre: 'narrative', hint: 'Tell what happened in order: First... Then... Last...' },
        { type: 'prompt', prompt: 'Write about a time you played with a friend. Include a beginning, middle, and end.', genre: 'narrative', hint: 'What happened first? What happened next? How did it end?' },
        { type: 'prompt', prompt: 'Tell about your morning. Write at least 3 sentences in order.', genre: 'narrative', hint: 'First I woke up. Then... Finally...' },
        { type: 'prompt', prompt: 'Write about a trip to the store. What happened first, next, and last?', genre: 'narrative', hint: 'Tell the events in the order they happened.' },
        { type: 'prompt', prompt: 'Write about a time you learned something new. Use sequence words.', genre: 'narrative', hint: 'First, Next, Then, Finally' },
        { type: 'prompt', prompt: 'Tell about your favorite day ever. Write what happened in order.', genre: 'narrative', hint: 'Start with the beginning of the day.' },
      ],
    },
    'informational-facts': {
      items: [
        { type: 'prompt', prompt: 'Write 3 facts about your favorite animal.', genre: 'informational', hint: 'Start with: [Animal] is... They can... They eat...' },
        { type: 'prompt', prompt: 'Write about a season. Tell 3 things about it.', genre: 'informational', hint: 'Name the season. Tell what happens, what you wear, and what you do.' },
        { type: 'prompt', prompt: 'Teach someone about your school. Write at least 3 facts.', genre: 'informational', hint: 'Where is it? What do you learn? Who is there?' },
        { type: 'prompt', prompt: 'Write 3 facts about a fruit or vegetable.', genre: 'informational', hint: 'What color is it? How does it taste? Where does it grow?' },
        { type: 'prompt', prompt: 'Write about weather. Tell 3 things you know.', genre: 'informational', hint: 'What kinds of weather are there? What do they look like?' },
        { type: 'prompt', prompt: 'Teach someone how to brush their teeth. Write the steps.', genre: 'informational', hint: 'First... Then... Next... Finally...' },
      ],
    },
    'opinion-reason': {
      items: [
        { type: 'prompt', prompt: 'What is the best pet? Write your opinion and give one reason.', genre: 'opinion', hint: 'I think ___ is the best pet because...' },
        { type: 'prompt', prompt: 'What is your favorite food? Tell why you like it.', genre: 'opinion', hint: 'My favorite food is ___ because...' },
        { type: 'prompt', prompt: 'Should kids have longer recess? Give your opinion and a reason.', genre: 'opinion', hint: 'I think ___ because...' },
        { type: 'prompt', prompt: 'What is the best season? Write your opinion and why.', genre: 'opinion', hint: 'I think ___ is the best season because...' },
        { type: 'prompt', prompt: 'What is the best game to play? Give your opinion with a reason.', genre: 'opinion', hint: 'The best game is ___ because...' },
        { type: 'prompt', prompt: 'Should kids help with chores? Share your opinion.', genre: 'opinion', hint: 'I think kids should/should not help with chores because...' },
      ],
    },
    'sentence-expansion': {
      items: [
        { base: 'The dog ran.', expanded: 'The big brown dog ran quickly across the yard.', hint: 'Add: What kind of dog? How did it run? Where?' },
        { base: 'I ate lunch.', expanded: 'I ate a yummy sandwich for lunch at school.', hint: 'Add: What did you eat? Where? When?' },
        { base: 'She played.', expanded: 'She played with her best friend at the park after school.', hint: 'Add: With whom? Where? When?' },
        { base: 'The bird sang.', expanded: 'The tiny blue bird sang a beautiful song in the tree.', hint: 'Add: What kind of bird? What did it sing? Where?' },
        { base: 'He was happy.', expanded: 'He was so happy because he scored the winning goal.', hint: 'Add: How happy? Why was he happy?' },
        { base: 'We went home.', expanded: 'We went home after the exciting field trip to the zoo.', hint: 'Add: When? After what? What kind of trip?' },
      ],
    },
  },
  'grade-2': {
    'narrative-details': {
      items: [
        { type: 'prompt', prompt: 'Write about a time you were surprised. Include what you saw, heard, and felt.', genre: 'narrative', hint: 'Use your senses! What did you see? Hear? Feel inside?' },
        { type: 'prompt', prompt: 'Write about a time you helped someone. Include actions, thoughts, and feelings.', genre: 'narrative', hint: 'What did you do? What were you thinking? How did you feel?' },
        { type: 'prompt', prompt: 'Write about a rainy day adventure. Use details that let the reader picture it.', genre: 'narrative', hint: 'Describe what you saw, heard, and felt.' },
        { type: 'prompt', prompt: 'Tell about a time you were brave. What happened? How did you feel?', genre: 'narrative', hint: 'Include your thoughts and feelings, not just actions.' },
        { type: 'prompt', prompt: 'Write about a special birthday. Include details about who, what, where, and how you felt.', genre: 'narrative', hint: 'Paint a picture with your words.' },
        { type: 'prompt', prompt: 'Write about a time you lost something. Include your feelings and how you searched.', genre: 'narrative', hint: 'Tell your thoughts and feelings as the story goes.' },
      ],
    },
    'informational-paragraph': {
      items: [
        { type: 'prompt', prompt: 'Write a paragraph about an animal you know a lot about. Include a topic sentence, 3 facts, and a closing sentence.', genre: 'informational', hint: 'Topic sentence → Fact 1 → Fact 2 → Fact 3 → Closing sentence' },
        { type: 'prompt', prompt: 'Write a paragraph teaching someone how to play your favorite game.', genre: 'informational', hint: 'Start: [Game] is a fun game. Then give the rules. End with why it is fun.' },
        { type: 'prompt', prompt: 'Write a paragraph about a community helper (firefighter, teacher, doctor). Include facts.', genre: 'informational', hint: 'Who are they? What do they do? Why are they important?' },
        { type: 'prompt', prompt: 'Write a paragraph about a place you have visited. Include interesting facts.', genre: 'informational', hint: 'Where is it? What can you do there? What makes it special?' },
        { type: 'prompt', prompt: 'Write a paragraph about your favorite sport. Include rules and facts.', genre: 'informational', hint: 'How do you play? How many players? What equipment do you need?' },
        { type: 'prompt', prompt: 'Write a paragraph about the water cycle. Explain the steps.', genre: 'informational', hint: 'Evaporation → Condensation → Precipitation → Collection' },
      ],
    },
    'opinion-with-reasons': {
      items: [
        { type: 'prompt', prompt: 'Should schools have homework? State your opinion and give 2 reasons with examples.', genre: 'opinion', hint: 'Opinion → Reason 1 + example → Reason 2 + example → Conclusion' },
        { type: 'prompt', prompt: 'What is the best book you have ever read? Convince someone to read it. Give 2 reasons.', genre: 'opinion', hint: 'I think ___ is the best book. First... Also... That is why...' },
        { type: 'prompt', prompt: 'Should kids be allowed to have phones? Give your opinion with 2 reasons.', genre: 'opinion', hint: 'State opinion → Reason 1 → Reason 2 → Conclusion' },
        { type: 'prompt', prompt: 'What is the best field trip your class could take? Give 2 reasons.', genre: 'opinion', hint: 'I believe we should go to ___ because... Another reason is...' },
        { type: 'prompt', prompt: 'Dogs or cats — which is the better pet? Give your opinion and 2 reasons.', genre: 'opinion', hint: 'State your choice. Give two strong reasons. End with a closing sentence.' },
        { type: 'prompt', prompt: 'Should recess be longer? Write your opinion with 2 reasons.', genre: 'opinion', hint: 'I think... One reason is... Another reason is... In conclusion...' },
      ],
    },
    'show-dont-tell': {
      items: [
        { telling: 'She was scared.', showing: 'Her hands trembled. She pressed herself against the wall, holding her breath.', hint: 'Use body language, actions, and senses instead of naming the emotion.' },
        { telling: 'The pizza was good.', showing: 'The warm cheese stretched from the plate to my mouth as I took the first bite.', hint: 'Describe what you see, smell, taste, or feel.' },
        { telling: 'He was angry.', showing: 'He slammed his fist on the table. "That\'s NOT fair!" he shouted.', hint: 'Show the emotion through actions and dialogue.' },
        { telling: 'It was a cold day.', showing: 'Icicles hung from the rooftop, and my breath made little white clouds in the air.', hint: 'Use sensory details — what do you see, feel, hear?' },
        { telling: 'She was happy.', showing: 'She jumped up and down, clapping her hands, and a huge grin spread across her face.', hint: 'What does her body do? What does her face look like?' },
        { telling: 'The room was messy.', showing: 'Clothes covered the floor, books spilled off the shelves, and a half-eaten sandwich sat on the desk.', hint: 'List specific things someone would see.' },
        { telling: 'He was tired.', showing: 'His eyelids drooped, and he yawned so wide his jaw cracked. He could barely hold his head up.', hint: 'Show what his body is doing.' },
        { telling: 'The storm was bad.', showing: 'Lightning cracked across the sky, thunder shook the windows, and rain pounded on the roof like a thousand drums.', hint: 'Use sounds, sights, and comparisons.' },
      ],
    },
    'revision-arms': {
      items: [
        { draft: 'I went to the park. It was fun. I went home.', strategy: 'add', revised: 'I went to the park with my best friend. We played on the swings and raced down the slide. It was so much fun! Then we walked home together.', instruction: 'ADD details to make this writing more interesting. What details are missing?' },
        { draft: 'My dog is nice. I love my dog. My dog plays. My dog is fun. I really love my dog.', strategy: 'remove', revised: 'My dog is the best. He loves to play fetch and always greets me with a wagging tail.', instruction: 'REMOVE repeated ideas. Which sentences say the same thing?' },
        { draft: 'We ate cake. We opened presents. We played games. First we arrived at the party.', strategy: 'move', revised: 'First we arrived at the party. We played games. Then we ate cake. Finally we opened presents.', instruction: 'MOVE sentences so they are in the right order.' },
        { draft: 'The food was good. The movie was good. The day was good.', strategy: 'substitute', revised: 'The food was delicious. The movie was thrilling. The day was unforgettable.', instruction: 'SUBSTITUTE stronger, more specific words for "good."' },
        { draft: 'I got a bike. I was happy. I rode it.', strategy: 'add', revised: 'On my birthday, I got a shiny red bike with silver handles. I was so happy I could barely breathe! I jumped on and rode it all the way down the street, the wind blowing through my hair.', instruction: 'ADD sensory details and feelings to bring the story to life.' },
        { draft: 'We went to the beach and I like the beach because the beach is fun and the beach has waves.', strategy: 'substitute', revised: 'We went to the beach. I love it there because the crashing waves are so exciting.', instruction: 'SUBSTITUTE to avoid repeating "the beach" so many times.' },
      ],
    },
  },
  'grade-3': {
    'narrative-dialogue': {
      items: [
        { type: 'prompt', prompt: 'Write a short story where two friends solve a problem. Include at least 3 lines of dialogue.', genre: 'narrative', hint: 'Use quotation marks. Example: "Let me help you," said Maria.' },
        { type: 'prompt', prompt: 'Write a scene where a student asks the teacher a question. Use dialogue to show personality.', genre: 'narrative', hint: 'Use said, asked, whispered, shouted — vary your dialogue tags.' },
        { type: 'prompt', prompt: 'Write a conversation between you and a family member about a big decision. Use dialogue.', genre: 'narrative', hint: 'New speaker = new paragraph. Use actions between dialogue.' },
        { type: 'prompt', prompt: 'Write a scene where a character discovers something surprising. Include dialogue showing their reaction.', genre: 'narrative', hint: 'Show excitement, shock, or curiosity through what characters say and do.' },
        { type: 'prompt', prompt: 'Write about two characters who disagree about something. Use dialogue to show both sides.', genre: 'narrative', hint: '"I think we should..." vs "But what about..."' },
        { type: 'prompt', prompt: 'Write a scene at the dinner table. Use dialogue to reveal something about each character.', genre: 'narrative', hint: 'What people say and how they say it shows who they are.' },
      ],
    },
    'informational-multiparagraph': {
      items: [
        { type: 'prompt', prompt: 'Write 3 paragraphs about an animal: introduction, body (habitat and diet), and conclusion.', genre: 'informational', hint: 'Para 1: Introduce the animal. Para 2: Facts about habitat and diet. Para 3: Conclude with why this animal is interesting.' },
        { type: 'prompt', prompt: 'Write 3 paragraphs explaining how something works (a game, a machine, a process).', genre: 'informational', hint: 'Para 1: What is it? Para 2: How does it work? Para 3: Why does it matter?' },
        { type: 'prompt', prompt: 'Write 3 paragraphs about a famous person. Include an intro, facts, and why they are important.', genre: 'informational', hint: 'Group related information into paragraphs.' },
        { type: 'prompt', prompt: 'Write 3 paragraphs about a holiday: what it is, how people celebrate, and why it matters.', genre: 'informational', hint: 'Introduction → Details → Conclusion. Use linking words.' },
        { type: 'prompt', prompt: 'Write a short report about the solar system. Include an introduction, at least 4 facts, and a conclusion.', genre: 'informational', hint: 'Use topic sentences for each paragraph.' },
        { type: 'prompt', prompt: 'Write 3 paragraphs about an important invention: what it is, who invented it, and how it changed the world.', genre: 'informational', hint: 'Use facts, definitions, and details.' },
      ],
    },
    'opinion-organized': {
      items: [
        { type: 'prompt', prompt: 'Write an opinion piece: What is the most important school subject? Give 3 organized reasons.', genre: 'opinion', hint: 'Introduction with opinion → Reason 1 with details → Reason 2 → Reason 3 → Conclusion' },
        { type: 'prompt', prompt: 'Should kids play sports? Write an organized opinion with an introduction, 2-3 reasons, and a conclusion.', genre: 'opinion', hint: 'Use linking words: First, Also, In addition, Finally, In conclusion' },
        { type: 'prompt', prompt: 'What is the best way to spend a weekend? Organize your opinion with reasons and a conclusion.', genre: 'opinion', hint: 'State your opinion clearly. Support each reason with details.' },
        { type: 'prompt', prompt: 'Should animals be kept in zoos? Write your opinion with organized reasons.', genre: 'opinion', hint: 'Introduction → Reason 1 + details → Reason 2 + details → Conclusion' },
        { type: 'prompt', prompt: 'Which is better: reading books or watching movies? Write an organized argument.', genre: 'opinion', hint: 'Use linking words to connect your ideas.' },
        { type: 'prompt', prompt: 'Should students wear uniforms? Give your opinion with 3 reasons.', genre: 'opinion', hint: 'First reason... Second reason... Most importantly...' },
      ],
    },
    'strong-leads': {
      items: [
        { weak: 'This is a story about my dog.', leadType: 'action', strong: 'My dog burst through the door, tracking muddy paw prints across the clean kitchen floor.', instruction: 'Rewrite this weak lead as an ACTION lead — start with something happening.' },
        { weak: 'I am going to tell you about my vacation.', leadType: 'dialogue', strong: '"Are we there yet?" I asked for the hundredth time, pressing my face against the car window.', instruction: 'Rewrite this lead as a DIALOGUE lead — start with someone talking.' },
        { weak: 'This story is about a scary night.', leadType: 'question', strong: 'Have you ever heard a sound in the dark that made your heart stop?', instruction: 'Rewrite this lead as a QUESTION lead — start by asking the reader something.' },
        { weak: 'I want to tell you about my best friend.', leadType: 'setting', strong: 'In the small yellow house next to mine lives the funniest person I know.', instruction: 'Rewrite this lead as a SETTING lead — describe where or when.' },
        { weak: 'This is about a time I was surprised.', leadType: 'sound', strong: 'CRASH! The glass shattered into a thousand sparkling pieces on the floor.', instruction: 'Rewrite this lead as a SOUND lead — start with a noise.' },
        { weak: 'My report is about dolphins.', leadType: 'question', strong: 'Did you know that dolphins can hold their breath for up to 10 minutes?', instruction: 'Rewrite this lead as a QUESTION lead — hook the reader with an interesting question.' },
        { weak: 'This is a story about a snow day.', leadType: 'setting', strong: 'A thick white blanket of snow covered every rooftop, tree, and car on our street.', instruction: 'Rewrite this lead as a SETTING lead — paint a picture of the scene.' },
        { weak: 'I will tell you about my soccer game.', leadType: 'action', strong: 'I planted my foot and kicked the ball as hard as I could toward the goal.', instruction: 'Rewrite this lead as an ACTION lead — jump right into the action.' },
      ],
    },
    'transitions': {
      items: [
        { sentence: 'I studied hard for the test. ___, I got an A.', options: ['As a result', 'However', 'First'], answer: 'As a result', category: 'cause-effect' },
        { sentence: 'She loved swimming. ___, she was afraid of deep water.', options: ['However', 'Therefore', 'Also'], answer: 'However', category: 'contrast' },
        { sentence: 'Dogs are loyal. ___, they are fun to play with.', options: ['In addition', 'However', 'Finally'], answer: 'In addition', category: 'adding' },
        { sentence: '___, preheat the oven to 350 degrees.', options: ['First', 'Finally', 'However'], answer: 'First', category: 'sequence' },
        { sentence: 'We mixed the batter. ___, we poured it into the pan.', options: ['Next', 'However', 'In conclusion'], answer: 'Next', category: 'sequence' },
        { sentence: '___, reading is fun and makes you smarter.', options: ['In conclusion', 'First', 'Meanwhile'], answer: 'In conclusion', category: 'concluding' },
        { sentence: 'The hero entered the cave. ___, a dragon appeared.', options: ['Suddenly', 'In addition', 'First'], answer: 'Suddenly', category: 'narrative-time' },
        { sentence: 'She packed her bags. ___, she headed to the airport.', options: ['Then', 'However', 'In conclusion'], answer: 'Then', category: 'sequence' },
      ],
    },
    'editing-cups': {
      items: [
        { draft: 'me and sarah went to the park on tuesday', errors: ['capitalization', 'capitalization', 'capitalization', 'punctuation'], corrected: 'Sarah and I went to the park on Tuesday.', focus: 'C-U: Capitalize proper nouns, days; use correct pronoun form; add period.' },
        { draft: 'the dog runned to the stor and barked loud', errors: ['capitalization', 'usage', 'spelling', 'punctuation'], corrected: 'The dog ran to the store and barked loudly.', focus: 'C-U-P-S: Capital T, ran (not runned), store (spelling), period, loudly (adverb).' },
        { draft: 'their going to there house for they\'re party', errors: ['usage', 'usage', 'usage', 'punctuation'], corrected: 'They\'re going to their house for their party.', focus: 'U: They\'re = they are; their = belonging to them.' },
        { draft: 'i like cats dogs and fish', errors: ['capitalization', 'punctuation', 'punctuation'], corrected: 'I like cats, dogs, and fish.', focus: 'C-P: Capitalize I; commas in a list; period.' },
        { draft: 'we was going to the libary but it was close', errors: ['usage', 'spelling', 'spelling', 'punctuation'], corrected: 'We were going to the library, but it was closed.', focus: 'U-S-P: were (not was), library, closed, comma before but, period.' },
        { draft: 'him and me goed to the park yesterday', errors: ['usage', 'usage', 'punctuation'], corrected: 'He and I went to the park yesterday.', focus: 'U-P: He (not Him), I (not me), went (not goed), period.' },
        { draft: 'does you want to come to my house on wendsday', errors: ['usage', 'spelling', 'punctuation'], corrected: 'Do you want to come to my house on Wednesday?', focus: 'U-S-P: Do (not Does), Wednesday, question mark.' },
        { draft: 'the boy said i want to go home', errors: ['capitalization', 'punctuation', 'punctuation'], corrected: 'The boy said, "I want to go home."', focus: 'C-P: Comma after said, quotation marks, capitalize I, period inside quotes.' },
      ],
    },
  },
  'grade-4': {
    'narrative-pacing': {
      items: [
        { type: 'prompt', prompt: 'Write a scene where time slows down during an exciting moment. Stretch the important part with details.', genre: 'narrative', hint: 'Slow the pace: describe each second, thought, and sensation during the big moment.' },
        { type: 'prompt', prompt: 'Write a story where you speed through boring parts and slow down for the exciting parts.', genre: 'narrative', hint: 'Fast: "The next few days were uneventful." Slow: Describe every detail of the key scene.' },
        { type: 'prompt', prompt: 'Rewrite this rushed scene with better pacing: "I saw the ball coming. I caught it. We won."', genre: 'narrative', hint: 'Stretch the moment — what did you see, feel, think? Describe it in slow motion.' },
        { type: 'prompt', prompt: 'Write a suspenseful scene. Use short sentences and sensory details to build tension.', genre: 'narrative', hint: 'Short sentences = fast pace = tension. "I heard a creak. Then silence. Then another."' },
        { type: 'prompt', prompt: 'Write a narrative where the character waits for something. Show the slow passage of time.', genre: 'narrative', hint: 'Use details about the environment, the character\'s thoughts, and small actions.' },
        { type: 'prompt', prompt: 'Write the climax of a story in slow motion, then speed up for the resolution.', genre: 'narrative', hint: 'Big moment = lots of detail. After it is resolved = summarize quickly.' },
      ],
    },
    'informational-evidence': {
      items: [
        { type: 'prompt', prompt: 'Write an informational paragraph about recycling. Include at least 2 facts and 1 statistic or example.', genre: 'informational', hint: 'Topic sentence → Fact 1 → Fact 2 → Specific example or statistic → Conclusion' },
        { type: 'prompt', prompt: 'Write about an endangered animal. Support your information with specific facts and details.', genre: 'informational', hint: 'Include: where it lives, what threatens it, specific numbers if possible.' },
        { type: 'prompt', prompt: 'Explain why exercise is important. Use facts, definitions, and details as evidence.', genre: 'informational', hint: 'Don\'t just say "it\'s good for you." Use specific evidence.' },
        { type: 'prompt', prompt: 'Write about a historical event. Include specific dates, names, and facts as evidence.', genre: 'informational', hint: 'Who? When? Where? What happened? Why did it matter? Use evidence.' },
        { type: 'prompt', prompt: 'Write about a science topic using domain-specific vocabulary. Include facts as evidence.', genre: 'informational', hint: 'Use the real science words. Define them if needed.' },
        { type: 'prompt', prompt: 'Write 2 paragraphs about healthy eating. Include evidence from facts, examples, or definitions.', genre: 'informational', hint: 'Organize by subtopic. Use headings if helpful.' },
      ],
    },
    'argument-with-facts': {
      items: [
        { type: 'prompt', prompt: 'Should schools start later in the morning? Write an argument with facts and details supporting your opinion.', genre: 'opinion', hint: 'Claim → Reason 1 + fact → Reason 2 + fact → Conclusion. Use evidence, not just feelings.' },
        { type: 'prompt', prompt: 'Should plastic bags be banned? Write an argument supported by facts and evidence.', genre: 'opinion', hint: 'State your claim. Give reasons. Support each reason with a fact or detail.' },
        { type: 'prompt', prompt: 'Should students have more field trips? Argue your position with facts and specific examples.', genre: 'opinion', hint: 'Facts and examples are more convincing than "I just think so."' },
        { type: 'prompt', prompt: 'Should kids have a say in family decisions? Support your argument with reasons and facts.', genre: 'opinion', hint: 'Group related ideas together. Use linking words and phrases.' },
        { type: 'prompt', prompt: 'Is too much screen time bad for kids? Write your argument with evidence.', genre: 'opinion', hint: 'Use facts like "Studies show..." and specific examples.' },
        { type: 'prompt', prompt: 'Should school lunches be healthier? Write an organized argument with facts.', genre: 'opinion', hint: 'Claim → 3 supported reasons → Strong conclusion.' },
      ],
    },
    'sentence-variety': {
      items: [
        { boring: 'I went to the store. I bought apples. I went home. I made pie.', improved: 'After going to the store, I bought crisp red apples. Once I got home, I made a delicious apple pie.', method: 'Vary openings — start with a prepositional phrase or dependent clause.' },
        { boring: 'The dog barked. The cat ran. The bird flew away. The squirrel hid.', improved: 'When the dog barked, the cat ran and the bird flew away. Even the squirrel scrambled to hide.', method: 'Combine sentences and vary structure (simple, compound, complex).' },
        { boring: 'She is nice. She is funny. She is smart. She is my best friend.', improved: 'My best friend is the nicest, funniest, and smartest person I know.', method: 'Combine repetitive sentences into one with a series.' },
        { boring: 'We played soccer. We scored three goals. We won the game. We celebrated.', improved: 'We played soccer and scored three goals! After winning the game, we celebrated with cheers and high-fives.', method: 'Mix short and long sentences. Add details.' },
        { boring: 'The room was dark. It was quiet. I was scared. I turned on the light.', improved: 'The room was dark and eerily quiet. Heart pounding, I reached for the light switch.', method: 'Use -ing phrases, combine with "and," vary sentence length.' },
        { boring: 'He ran. He jumped. He climbed. He won.', improved: 'Running as fast as he could, he leaped over every obstacle. After climbing the final wall, he crossed the finish line first.', method: 'Start with -ing words. Use "after" clauses. Vary length.' },
      ],
    },
    'revision-strategies': {
      items: [
        { draft: 'My summer was fun. I went swimming. I ate ice cream. I played with friends. It was a good summer.', strategy: 'add-details', revised: 'My summer was packed with adventures. At the lake, I spent hours diving off the dock into the cool, clear water. On hot afternoons, I devoured strawberry ice cream that dripped down my arm. Best of all, my friends and I built the most epic fort in the neighborhood.', instruction: 'Revise by ADDING specific details to each general statement.' },
        { draft: 'I like my teacher because she is nice. She gives us treats sometimes. She also lets us have free time. And she reads us stories. She is really nice.', strategy: 'remove-repetition', revised: 'I like my teacher because she makes our classroom feel special. She surprises us with treats, gives us free time to explore, and reads the most exciting stories aloud.', instruction: 'REMOVE repetition and combine related ideas.' },
        { draft: 'We arrived at camp. I was nervous. I met my cabin mates. We played games. I stopped being nervous. We became friends.', strategy: 'add-dialogue-thoughts', revised: 'We arrived at camp and my stomach flip-flopped. "What if nobody likes me?" I worried. Then my cabin mate grinned. "Want to play capture the flag?" she asked. By that evening, my worries had melted away.', instruction: 'Revise by ADDING dialogue and inner thoughts.' },
        { draft: 'The big bad wolf came to the house. He blew the house down. The pig ran away.', strategy: 'substitute-vivid', revised: 'The ferocious wolf prowled up to the straw house. He huffed and puffed with all his might until the flimsy walls collapsed. The terrified pig sprinted to his brother\'s house.', instruction: 'SUBSTITUTE bland words with vivid, specific language.' },
        { draft: 'I woke up. I got dressed. I ate breakfast. I went to school. I had a test. I was worried. I took the test. I passed!', strategy: 'pace-and-focus', revised: 'The morning flew by in a blur. Before I knew it, I was sitting at my desk, staring at the test. My pencil trembled in my hand. I took a deep breath, read the first question, and smiled — I actually knew the answer! When I got my grade back, I had passed!', instruction: 'Revise by speeding through unimportant parts and slowing down the key moment.' },
        { draft: 'My dog got lost. We looked for him. We found him. We were happy.', strategy: 'expand-and-move', revised: 'When I came home from school, the backyard gate was wide open and Max was gone. We searched every street in the neighborhood, calling his name until our voices were hoarse. Finally, we heard a familiar bark from behind the neighbor\'s shed. There he was, tail wagging, as if nothing had happened.', instruction: 'EXPAND with details and MOVE readers through the experience.' },
      ],
    },
    'editing-advanced': {
      items: [
        { draft: 'the boy who lives next door he is my freind and we play everyday after school', errors: ['capitalization', 'usage', 'spelling', 'punctuation'], corrected: 'The boy who lives next door is my friend, and we play every day after school.', focus: 'Capitalize first word; remove "he" (double subject); friend; every day (two words); comma + period.' },
        { draft: 'Their was too many people at the mall me and my mom couldnt find no parking spaces', errors: ['usage', 'usage', 'punctuation', 'usage'], corrected: 'There were too many people at the mall. My mom and I couldn\'t find any parking spaces.', focus: 'There (not Their); were (not was); My mom and I; couldn\'t find any (double negative); two sentences.' },
        { draft: 'I readed the book called charlottes web and it was wrote by E.B. white', errors: ['usage', 'punctuation', 'usage', 'capitalization'], corrected: 'I read the book called Charlotte\'s Web, and it was written by E.B. White.', focus: 'read (not readed); Charlotte\'s Web (italics, capitals, possessive); written; White capitalized.' },
        { draft: 'the teacher asked do you want to go to recess early and everyone said yes', errors: ['capitalization', 'punctuation', 'punctuation', 'punctuation'], corrected: 'The teacher asked, "Do you want to go to recess early?" and everyone said, "Yes!"', focus: 'Capitalize The; comma before dialogue; quotation marks; question mark; exclamation point.' },
        { draft: 'me and him doesnt like brocolli but we eated it anyways', errors: ['usage', 'usage', 'spelling', 'usage', 'punctuation'], corrected: 'He and I don\'t like broccoli, but we ate it anyway.', focus: 'He and I; don\'t (not doesnt); broccoli; ate; anyway; comma before but; period.' },
        { draft: 'on saturday november 15 2025 I wented to a football game in dallas texas', errors: ['capitalization', 'punctuation', 'usage', 'capitalization', 'punctuation'], corrected: 'On Saturday, November 15, 2025, I went to a football game in Dallas, Texas.', focus: 'Capitalize Saturday, November, Dallas, Texas; commas in dates and city/state; went (not wented); period.' },
      ],
    },
  },
  'grade-5': {
    'narrative-techniques': {
      items: [
        { type: 'prompt', prompt: 'Write a narrative using at least 3 techniques: dialogue, pacing, description, and/or inner thoughts.', genre: 'narrative', hint: 'Slow down key moments with description and thoughts. Speed through transitions.' },
        { type: 'prompt', prompt: 'Write a scene where the setting mirrors the character\'s mood. Use descriptive language.', genre: 'narrative', hint: 'Happy character = sunny, bright setting. Sad character = gray, rainy setting.' },
        { type: 'prompt', prompt: 'Write a narrative with a flashback. Start in the present, go back to an earlier event, then return to the present.', genre: 'narrative', hint: 'Use transitions like "I remembered when..." or "That day, three years ago..."' },
        { type: 'prompt', prompt: 'Write a scene from two different characters\' perspectives. Show how the same event looks different to each.', genre: 'narrative', hint: 'First, write Character A\'s view. Then Character B\'s view of the same moment.' },
        { type: 'prompt', prompt: 'Write a narrative where foreshadowing hints at what will happen later. Use details that take on meaning later.', genre: 'narrative', hint: 'Plant a detail early that becomes important later. "I should have noticed the dark clouds..."' },
        { type: 'prompt', prompt: 'Write a personal narrative about a moment that changed how you think about something. Use reflection.', genre: 'narrative', hint: 'End with what you learned or how you changed. Show growth.' },
      ],
    },
    'informational-structure': {
      items: [
        { type: 'prompt', prompt: 'Write an informational piece with clear structure: introduction, 3 body paragraphs with headings, and conclusion.', genre: 'informational', hint: 'Each body paragraph should cover one subtopic. Use headings.' },
        { type: 'prompt', prompt: 'Write a compare-contrast informational piece about two related topics. Use organizational structure.', genre: 'informational', hint: 'Point-by-point: compare Feature 1, then Feature 2, etc. Use transition words.' },
        { type: 'prompt', prompt: 'Write a cause-and-effect informational piece. Organize logically.', genre: 'informational', hint: 'State the cause. Then explain multiple effects with evidence. Use "as a result," "consequently."' },
        { type: 'prompt', prompt: 'Write a problem-solution informational piece. Include evidence for the solution.', genre: 'informational', hint: 'Para 1: Problem. Para 2-3: Solutions with evidence. Para 4: Conclusion.' },
        { type: 'prompt', prompt: 'Write an informational piece with precise language and domain-specific vocabulary about a topic you know well.', genre: 'informational', hint: 'Use the exact terms from that field. Define them when needed.' },
        { type: 'prompt', prompt: 'Write a how-to article organized in chronological order with an introduction and conclusion.', genre: 'informational', hint: 'Intro → Step 1 → Step 2 → Step 3 → Conclusion with tips.' },
      ],
    },
    'argument-counterpoint': {
      items: [
        { type: 'prompt', prompt: 'Should homework be banned? Write an argument that includes a counterargument and your response to it.', genre: 'opinion', hint: 'State your claim. Give reasons. Then say "Some might argue..." and explain why they are wrong or why your side is stronger.' },
        { type: 'prompt', prompt: 'Should kids have social media accounts? Include a counterargument paragraph.', genre: 'opinion', hint: 'Introduce → Your reasons → Counterargument → Your rebuttal → Conclusion' },
        { type: 'prompt', prompt: 'Should zoos exist? Write an argument that acknowledges the other side.', genre: 'opinion', hint: '"While some believe..., the evidence shows..." Then give your strongest point.' },
        { type: 'prompt', prompt: 'Should students grade their teachers? Argue your position and address what opponents would say.', genre: 'opinion', hint: 'A strong argument addresses the other side and explains why your side is better.' },
        { type: 'prompt', prompt: 'Should school be year-round? Include and respond to the strongest counterargument.', genre: 'opinion', hint: 'Find the BEST argument against you. Address it honestly. Then show why your argument wins.' },
        { type: 'prompt', prompt: 'Should competitive sports be required in schools? Argue with a counterpoint and rebuttal.', genre: 'opinion', hint: 'Claim → Reasons + evidence → Counterargument → Rebuttal → Conclusion' },
      ],
    },
    'voice-word-choice': {
      items: [
        { bland: 'The food was nice and the people were nice.', vivid: 'The savory aroma of roasted chicken filled the room as everyone laughed and swapped stories around the table.', instruction: 'Rewrite with vivid, specific word choices. Replace vague words like "nice" and "good."' },
        { bland: 'I walked down the street. It was hot. I was tired.', vivid: 'I trudged down the shimmering pavement, heat rising in waves as sweat trickled down my neck.', instruction: 'Replace plain verbs and add sensory details to create voice.' },
        { bland: 'The old house was scary. Nobody wanted to go in.', vivid: 'The abandoned house loomed at the end of the lane, its broken windows staring like hollow eyes. Not a single kid dared cross the overgrown path to its door.', instruction: 'Use figurative language and precise adjectives to create mood.' },
        { bland: 'She was a good leader. Everyone liked her.', vivid: 'She led with quiet confidence, always the first to volunteer and the last to take credit. Her classmates respected her without her ever having to demand it.', instruction: 'Show through specific actions and details rather than vague praise.' },
        { bland: 'Spring is pretty. Flowers bloom. Birds sing.', vivid: 'Spring erupts in a riot of color — daffodils push through the thawing earth while robins trill their bright melodies from every branch.', instruction: 'Replace generic descriptions with precise, energetic language.' },
        { bland: 'The game was exciting and we won.', vivid: 'With ten seconds left and the score tied, I held my breath as the ball sailed toward the goal — and swished through the net. Our team erupted in cheers.', instruction: 'Slow down the moment and use precise words to recreate the excitement.' },
      ],
    },
    'combine-reduce-sentences': {
      items: [
        { short: ['The girl was tall.', 'The girl was athletic.', 'The girl won the race.'], combined: 'The tall, athletic girl won the race.', method: 'Combine adjectives into one sentence.' },
        { short: ['We went to the museum.', 'We saw dinosaur bones.', 'We learned about fossils.'], combined: 'At the museum, we saw dinosaur bones and learned about fossils.', method: 'Use a prepositional phrase opener and join with "and."' },
        { short: ['He studied every night.', 'He practiced with flashcards.', 'He passed the test.'], combined: 'After studying every night and practicing with flashcards, he passed the test.', method: 'Use "after" + gerund to combine.' },
        { short: ['The storm was fierce.', 'The storm knocked down trees.', 'The storm caused power outages.'], combined: 'The fierce storm knocked down trees and caused power outages throughout the town.', method: 'Move the adjective into the subject; join predicates with "and."' },
        { short: ['She is my neighbor.', 'She is kind.', 'She always helps us.'], combined: 'My kind neighbor always helps us.', method: 'Reduce by embedding the adjective and removing redundancy.' },
        { short: ['The river was wide.', 'The river was deep.', 'We could not cross it.'], combined: 'We could not cross the wide, deep river.', method: 'Combine adjectives and restructure.' },
      ],
    },
  },
  'grade-6': {
    'narrative-craft': {
      items: [
        { type: 'prompt', prompt: 'Write a narrative that engages the reader from the first line. Develop characters through their actions and dialogue, not just description.', genre: 'narrative', hint: 'Show who characters are through what they DO and SAY, not just how they look.' },
        { type: 'prompt', prompt: 'Write a story with a reflective conclusion. The character should learn or realize something.', genre: 'narrative', hint: 'End not just with what happened, but with what the character understood about themselves or the world.' },
        { type: 'prompt', prompt: 'Write a narrative that uses symbolism. Choose an object that represents something deeper.', genre: 'narrative', hint: 'A wilting plant might symbolize neglect; a lighthouse might represent hope.' },
        { type: 'prompt', prompt: 'Write a scene that manages pacing — slow motion for tension, quick summary for transitions, and a satisfying resolution.', genre: 'narrative', hint: 'Vary paragraph and sentence length to control how fast the reader moves.' },
        { type: 'prompt', prompt: 'Write a narrative where the setting is almost like a character — it affects the mood and the plot.', genre: 'narrative', hint: 'Don\'t just describe the setting. Let it influence what happens and how characters feel.' },
        { type: 'prompt', prompt: 'Write a narrative from an unusual point of view (an animal, an object, a bystander). Develop a unique voice.', genre: 'narrative', hint: 'How would a park bench see the world? What would a stray cat think about?' },
      ],
    },
    'informational-formal': {
      items: [
        { type: 'prompt', prompt: 'Write a formal informational essay with an introduction, 3 body paragraphs, and a conclusion. Maintain a formal, academic tone throughout.', genre: 'informational', hint: 'Avoid "I think" and casual language. Use precise vocabulary and transitions.' },
        { type: 'prompt', prompt: 'Write an informational piece that uses text features: headings, a diagram description, and domain-specific vocabulary.', genre: 'informational', hint: 'Use headings to organize. Include vocabulary specific to the field.' },
        { type: 'prompt', prompt: 'Write an informational piece about a global issue. Include relevant facts, definitions, and quotations.', genre: 'informational', hint: 'Maintain formal tone. Use evidence: "According to...", "Research shows..."' },
        { type: 'prompt', prompt: 'Write a compare-contrast essay in formal style about two related scientific concepts.', genre: 'informational', hint: 'Use academic language and appropriate transitions: "In contrast," "Similarly," "However."' },
        { type: 'prompt', prompt: 'Write a research-style report on a historical event. Use formal tone and cite specific details.', genre: 'informational', hint: 'Formal = no slang, no "I," precise language, objective tone.' },
        { type: 'prompt', prompt: 'Write an informational piece explaining a complex process. Use clear organization and appropriate transitions.', genre: 'informational', hint: 'Break complex ideas into clear steps or categories. Define key terms.' },
      ],
    },
    'argument-evidence-based': {
      items: [
        { type: 'prompt', prompt: 'Write an evidence-based argument on a school policy issue. Include a claim, reasons, evidence, counterargument, rebuttal, and conclusion.', genre: 'opinion', hint: 'Claim → Reason 1 + evidence → Reason 2 + evidence → Counterargument + rebuttal → Conclusion' },
        { type: 'prompt', prompt: 'Write an argument about an environmental issue. Use specific evidence (statistics, expert opinions, examples).', genre: 'opinion', hint: 'Every reason needs evidence. "Because I said so" is not evidence.' },
        { type: 'prompt', prompt: 'Write a formal argument: Should students learn a second language starting in kindergarten? Use evidence.', genre: 'opinion', hint: 'Maintain formal style. Use evidence like "Studies show..." and specific examples.' },
        { type: 'prompt', prompt: 'Write an argument about a community issue. Support with clear reasons and relevant evidence.', genre: 'opinion', hint: 'Use words to clarify relationships: "because," "therefore," "as a result."' },
        { type: 'prompt', prompt: 'Write an argument for or against standardized testing. Use multiple sources of evidence.', genre: 'opinion', hint: 'Strong arguments use varied evidence: facts, statistics, examples, expert quotes.' },
        { type: 'prompt', prompt: 'Write a persuasive letter to a local official about an issue you care about. Use formal tone and evidence.', genre: 'opinion', hint: 'Formal letter format. Clear claim. Supported reasons. Call to action.' },
      ],
    },
    'style-tone': {
      items: [
        { wrong: 'The experiment was very scientific. Basically we mixed stuff and it was super cool and crazy.', issue: 'Inconsistent tone — shifts from formal to slang.', fix: 'The experiment yielded remarkable results. When we combined the two compounds, the reaction produced an unexpected color change.', instruction: 'Fix the style/tone inconsistency. Keep it formal throughout.' },
        { wrong: 'Dear Principal Johnson, Yo, we need better lunches fr. The food is mid and nobody eats it. Please fix this.', issue: 'Informal slang in a formal letter.', fix: 'Dear Principal Johnson, I am writing to request improvements to our school lunch program. Many students find the current options unappealing, and a significant amount of food goes to waste daily.', instruction: 'Rewrite in a tone appropriate for a formal letter.' },
        { wrong: 'The majestic mountains towered above. LOL it was so pretty I literally died.', issue: 'Literary tone broken by internet slang.', fix: 'The majestic mountains towered above, their snow-capped peaks glowing in the afternoon sun. The beauty of the scene left me breathless.', instruction: 'Maintain a consistent literary tone throughout.' },
        { wrong: 'In this essay, I will prove that recycling is important. Recycling is like, totally important for the Earth and stuff.', issue: 'Academic introduction followed by vague, casual language.', fix: 'In this essay, I will demonstrate the importance of recycling. This practice conserves natural resources, reduces landfill waste, and decreases pollution.', instruction: 'Match the academic tone established in the first sentence.' },
        { wrong: 'The Civil War was a pivotal moment in American history. It was gnarly and tons of people got wrecked.', issue: 'Academic tone collapses into casual slang.', fix: 'The Civil War was a pivotal moment in American history. The conflict claimed over 600,000 lives and fundamentally transformed the nation.', instruction: 'Maintain formal, academic tone when writing about historical topics.' },
        { wrong: 'My grandmother is the kindest person ever. She be making cookies and giving hugs 24/7 no cap.', issue: 'Heartfelt personal essay tone shifts to internet slang.', fix: 'My grandmother is the kindest person I know. She always has a batch of cookies in the oven and a warm hug waiting whenever I visit.', instruction: 'Keep the warm personal tone consistent without slang.' },
      ],
    },
    'paragraph-cohesion': {
      items: [
        { disorganized: 'Dogs need exercise. Some dogs are small. Dogs eat kibble. Walking your dog is fun. Dogs can live 10-15 years. You should walk your dog daily.', organized: 'Dogs need daily exercise to stay healthy and happy. Walking your dog is not only fun but also essential for their well-being. A daily walk helps prevent obesity and behavioral problems, contributing to a longer, healthier life.', instruction: 'Reorganize into a cohesive paragraph focused on ONE main idea.' },
        { disorganized: 'The Amazon is in South America. Trees are being cut down. Many animals live there. Deforestation is bad. The Amazon produces oxygen. We should protect it.', organized: 'The Amazon rainforest, located in South America, is one of the most important ecosystems on Earth. It produces a significant portion of the world\'s oxygen and is home to countless animal species. Unfortunately, deforestation threatens this vital resource. Protecting the Amazon is essential for the health of our planet.', instruction: 'Reorganize into a cohesive paragraph with a topic sentence, supporting details, and conclusion.' },
        { disorganized: 'Libraries have books. You can use computers there. Reading is important. My library has a reading program. Libraries are free. Everyone should have a library card.', organized: 'Libraries are invaluable community resources that everyone should take advantage of. They offer free access to thousands of books, computers, and programs like summer reading challenges. Because reading is fundamental to education and personal growth, having a library card is one of the best investments a person can make.', instruction: 'Create cohesion by connecting ideas with transitions and grouping related thoughts.' },
        { disorganized: 'Exercise makes you strong. Too much sugar is bad. Sleep is important. Drink water. Eating vegetables is healthy. You should take care of your body.', organized: 'Taking care of your body requires attention to several daily habits. First, eating well — choosing vegetables over sugary snacks — provides the fuel your body needs. In addition, regular exercise builds strength and endurance. Finally, getting enough sleep and staying hydrated allow your body to recover and function at its best.', instruction: 'Group related ideas and use transitions to create a cohesive paragraph with a clear topic sentence.' },
        { disorganized: 'Martin Luther King Jr. gave speeches. He believed in equality. The March on Washington happened in 1963. He won the Nobel Peace Prize. He led the civil rights movement. His dream changed America.', organized: 'Martin Luther King Jr. was a transformative leader of the civil rights movement who believed deeply in equality for all people. Through powerful speeches, including his famous address at the 1963 March on Washington, he inspired millions to fight for justice. His contributions earned him the Nobel Peace Prize and, more importantly, helped change America forever.', instruction: 'Create a cohesive paragraph with chronological flow and clear connections between ideas.' },
        { disorganized: 'Space is big. Astronauts train for years. The Moon has no atmosphere. Mars might have water. NASA launches rockets. Space exploration is expensive but worth it.', organized: 'Space exploration, though expensive, is one of humanity\'s most worthwhile endeavors. Astronauts train for years to venture into the vast unknown, where discoveries await. From learning that Mars might have water to studying the Moon\'s atmosphere-free surface, each mission expands our understanding of the universe. The investment in programs like NASA continues to yield knowledge that benefits all of humanity.', instruction: 'Unify scattered facts into a paragraph with a clear thesis and supporting evidence.' },
      ],
    },
  },
};

const MENTOR_SENTENCES = {
  'kindergarten': [
    { sentence: 'I like to play at the park.', focus: 'complete sentence', notice: 'Subject (I) + verb (like) + details (to play at the park)' },
    { sentence: 'First, I woke up. Then, I ate. Last, I went to school.', focus: 'sequence words', notice: 'First, Then, Last — tells events in order' },
  ],
  'grade-1': [
    { sentence: 'The fluffy white bunny hopped across the green, green grass.', focus: 'sentence expansion', notice: 'Adjectives add detail: fluffy, white, green' },
    { sentence: 'I think dogs are the best pets because they are loyal and fun.', focus: 'opinion + reason', notice: 'States opinion clearly and gives a reason with "because"' },
  ],
  'grade-2': [
    { sentence: 'Her hands shook as she slowly opened the mysterious box.', focus: 'show don\'t tell', notice: 'Shows nervousness through actions (hands shook, slowly) instead of saying "she was nervous"' },
    { sentence: 'First, gather your supplies. Next, mix the ingredients. Then, bake for 20 minutes. Finally, let it cool.', focus: 'transitions', notice: 'Sequence words guide the reader through steps' },
  ],
  'grade-3': [
    { sentence: '"Wait for me!" called Sam, racing down the sidewalk with his backpack bouncing.', focus: 'dialogue + action', notice: 'Dialogue in quotes, action tag (racing), sensory detail (bouncing backpack)' },
    { sentence: 'SPLASH! I hit the water feet-first and felt the icy cold rush over me.', focus: 'strong lead', notice: 'Starts with a sound (onomatopoeia) and jumps into action' },
  ],
  'grade-4': [
    { sentence: 'Time seemed to freeze as the ball sailed through the air, spinning end over end, while the entire crowd held its breath.', focus: 'pacing', notice: 'The sentence stretches the moment with details, slowing time for the reader' },
    { sentence: 'While some argue that homework builds discipline, the evidence suggests that excessive homework actually increases stress without improving learning.', focus: 'counterargument', notice: 'Acknowledges the other side (While some argue...) before presenting evidence' },
  ],
  'grade-5': [
    { sentence: 'She didn\'t just walk into the room — she burst through the door like a hurricane, scattering papers and turning every head.', focus: 'voice and word choice', notice: 'Strong verb (burst), simile (like a hurricane), vivid details create voice' },
    { sentence: 'After studying every night and practicing with flashcards, he finally passed the test that had haunted him for weeks.', focus: 'sentence combining', notice: 'Three ideas (studying, practicing, passing) combined into one flowing sentence' },
  ],
  'grade-6': [
    { sentence: 'The abandoned factory stood silent at the edge of town, its broken windows watching the street like hollow eyes — a monument to what the town had lost.', focus: 'narrative craft', notice: 'Setting as character, personification (windows watching), symbolism (monument to loss), dash for emphasis' },
    { sentence: 'Although proponents of year-round schooling cite improved retention, research consistently demonstrates that students benefit from extended breaks, which allow for rest, creativity, and real-world learning experiences.', focus: 'formal argument', notice: 'Academic tone, counterargument + rebuttal in one sentence, precise vocabulary, evidence-based' },
  ],
};

const WRITING_PROMPTS = {
  'kindergarten': [
    { prompt: 'Draw and write about your favorite toy.', genre: 'narrative' },
    { prompt: 'What is your favorite animal? Write why.', genre: 'opinion' },
    { prompt: 'Write about something you can do all by yourself.', genre: 'informational' },
  ],
  'grade-1': [
    { prompt: 'Write about a time you tried something new.', genre: 'narrative' },
    { prompt: 'What makes a good friend? Write your opinion.', genre: 'opinion' },
    { prompt: 'Teach someone how to make a sandwich.', genre: 'informational' },
  ],
  'grade-2': [
    { prompt: 'Write about a time you overcame a fear.', genre: 'narrative' },
    { prompt: 'Should kids have allowance? Give reasons.', genre: 'opinion' },
    { prompt: 'Write about an animal habitat.', genre: 'informational' },
  ],
  'grade-3': [
    { prompt: 'Write a story with a surprise ending.', genre: 'narrative' },
    { prompt: 'What is the most important invention? Argue your case.', genre: 'opinion' },
    { prompt: 'Write a report about a country you would like to visit.', genre: 'informational' },
  ],
  'grade-4': [
    { prompt: 'Write about a moment that changed your perspective.', genre: 'narrative' },
    { prompt: 'Should kids be allowed to vote? Make your argument with facts.', genre: 'opinion' },
    { prompt: 'Explain a natural disaster and how to prepare for it.', genre: 'informational' },
  ],
  'grade-5': [
    { prompt: 'Write a narrative about a character who makes a difficult choice.', genre: 'narrative' },
    { prompt: 'Argue for or against school uniforms. Include counterarguments.', genre: 'opinion' },
    { prompt: 'Compare and contrast two ecosystems.', genre: 'informational' },
  ],
  'grade-6': [
    { prompt: 'Write a narrative where the ending changes the meaning of the beginning.', genre: 'narrative' },
    { prompt: 'Write an evidence-based argument about a local issue.', genre: 'opinion' },
    { prompt: 'Write a formal research report on a scientific discovery.', genre: 'informational' },
  ],
};

// ── File I/O ──

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

// ── Helpers ──

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

// ── Exercise Generation ──

function generateExercise(grade, skill, count = 5) {
  const bank = EXERCISE_BANKS[grade]?.[skill];
  if (!bank) return { error: `No exercise bank for ${grade}/${skill}` };

  const items = bank.items;
  if (!items || !items.length) return { error: `Empty exercise bank for ${grade}/${skill}` };

  const selected = pick(items, count);
  const first = selected[0];

  // Writing prompts
  if (first.type === 'prompt') {
    return { type: 'writing-prompt', skill, grade, count: selected.length, instruction: 'Respond to the writing prompt below.', items: selected.map(i => ({ prompt: i.prompt, genre: i.genre, hint: i.hint })) };
  }
  // Complete the sentence fragment
  if (first.fragment !== undefined) {
    return { type: 'complete-sentence', skill, grade, count: selected.length, instruction: 'Turn this fragment into a complete sentence.', items: selected.map(i => ({ prompt: i.fragment, answer: i.answer, rule: i.rule })) };
  }
  // Fill-in with options (sequence words, transitions)
  if (first.sentence !== undefined && first.options !== undefined) {
    return { type: 'fill-in-choice', skill, grade, count: selected.length, instruction: 'Choose the correct word to fill in the blank.', items: selected.map(i => ({ prompt: i.sentence, options: i.options, answer: i.answer, rule: i.rule || i.category || '' })) };
  }
  // Show don't tell
  if (first.telling !== undefined) {
    return { type: 'show-dont-tell', skill, grade, count: selected.length, instruction: 'Rewrite the "telling" sentence to SHOW the emotion or detail instead.', items: selected.map(i => ({ prompt: i.telling, answer: i.showing, hint: i.hint })) };
  }
  // Strong leads
  if (first.weak !== undefined && first.leadType !== undefined) {
    return { type: 'fix-lead', skill, grade, count: selected.length, instruction: 'Rewrite this weak lead using the specified technique.', items: selected.map(i => ({ prompt: i.weak, leadType: i.leadType, answer: i.strong, instruction: i.instruction })) };
  }
  // Revision (ARMS)
  if (first.draft !== undefined && first.strategy !== undefined && first.revised !== undefined) {
    return { type: 'revision', skill, grade, count: selected.length, instruction: 'Revise this draft using the strategy described.', items: selected.map(i => ({ prompt: i.draft, strategy: i.strategy, answer: i.revised, instruction: i.instruction })) };
  }
  // Editing (CUPS)
  if (first.draft !== undefined && first.errors !== undefined) {
    return { type: 'editing', skill, grade, count: selected.length, instruction: 'Find and fix ALL errors in this sentence (Capitalization, Usage, Punctuation, Spelling).', items: selected.map(i => ({ prompt: i.draft, answer: i.corrected, errors: i.errors, focus: i.focus })) };
  }
  // Sentence variety / improvement
  if (first.boring !== undefined && first.improved !== undefined) {
    return { type: 'improve-sentences', skill, grade, count: selected.length, instruction: 'Improve this choppy or repetitive writing using sentence variety.', items: selected.map(i => ({ prompt: i.boring, answer: i.improved, method: i.method })) };
  }
  // Sentence combining
  if (first.short !== undefined && first.combined !== undefined) {
    return { type: 'combine-sentences', skill, grade, count: selected.length, instruction: 'Combine these sentences into one better sentence.', items: selected.map(i => ({ prompt: i.short.join(' | '), answer: i.combined, method: i.method })) };
  }
  // Voice and word choice
  if (first.bland !== undefined && first.vivid !== undefined) {
    return { type: 'voice-word-choice', skill, grade, count: selected.length, instruction: 'Rewrite with vivid, precise word choices and strong voice.', items: selected.map(i => ({ prompt: i.bland, answer: i.vivid, instruction: i.instruction })) };
  }
  // Style/tone fix
  if (first.wrong !== undefined && first.issue !== undefined) {
    return { type: 'style-tone-fix', skill, grade, count: selected.length, instruction: 'Identify and fix the style/tone inconsistency.', items: selected.map(i => ({ prompt: i.wrong, issue: i.issue, answer: i.fix, instruction: i.instruction })) };
  }
  // Paragraph cohesion
  if (first.disorganized !== undefined) {
    return { type: 'paragraph-cohesion', skill, grade, count: selected.length, instruction: 'Reorganize these scattered sentences into a cohesive paragraph.', items: selected.map(i => ({ prompt: i.disorganized, answer: i.organized, instruction: i.instruction })) };
  }
  // Sentence expansion
  if (first.base !== undefined && first.expanded !== undefined) {
    return { type: 'expand-sentence', skill, grade, count: selected.length, instruction: 'Expand this short sentence by adding details.', items: selected.map(i => ({ prompt: i.base, answer: i.expanded, hint: i.hint })) };
  }

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
}

// ── Public API ──

class Writing {
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

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  getMentorSentence(grade) {
    const sentences = MENTOR_SENTENCES[grade];
    if (!sentences) return { error: `No mentor sentences for ${grade}.` };
    return pick(sentences, 1)[0];
  }

  getWritingPrompt(grade, genre) {
    const prompts = WRITING_PROMPTS[grade];
    if (!prompts) return { error: `No prompts for ${grade}.` };
    const filtered = genre ? prompts.filter(p => p.genre === genre) : prompts;
    if (!filtered.length) return { error: `No ${genre} prompts for ${grade}.` };
    return pick(filtered, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const mentor = MENTOR_SENTENCES[grade] ? pick(MENTOR_SENTENCES[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, mentorSentence: mentor,
      lessonPlan: {
        mentor: mentor ? `Study: "${mentor.sentence}" — Focus: ${mentor.focus}` : 'Review a sentence from recent reading.',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Apply this writing skill in your own writing.',
      },
    };
  }
}

module.exports = Writing;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const wr = new Writing();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) wr.setGrade(id, grade);
        out({ action: 'start', profile: wr.getProfile(id), nextSkills: wr.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(wr.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'kindergarten';
        if (skill) { out(wr.generateExercise(grade, skill, 5)); }
        else { const n = wr.getNextSkills(id, 1).next; out(n.length ? wr.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(wr.checkAnswer(type, expected, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(wr.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(wr.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(wr.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(wr.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? wr.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(wr.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(wr.setGrade(id, g)); break; }
      case 'prompt': { const [, g, genre] = args; if (!g) throw new Error('Usage: prompt <grade> [genre]'); out(wr.getWritingPrompt(g, genre)); break; }
      default: out({ usage: 'node writing.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','prompt'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
