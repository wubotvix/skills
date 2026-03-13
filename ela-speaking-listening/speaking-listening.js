// eClaw ELA Speaking & Listening Interactive Tutor (K-6). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ela-speaking-listening');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'discussion': ['take-turns'],
    'describe': ['describe-familiar'],
    'speaking': ['speak-audibly'],
    'listening': ['listen-respond'],
  },
  'grade-1': {
    'discussion': ['build-on-talk'],
    'questioning': ['ask-answer-questions'],
    'comprehension': ['retell-details'],
    'speaking': ['complete-sentences'],
  },
  'grade-2': {
    'discussion': ['discuss-with-partner'],
    'comprehension': ['recount-key-ideas'],
    'questioning': ['ask-clarification'],
    'presentation': ['audio-recording'],
  },
  'grade-3': {
    'discussion': ['prepared-discussion'],
    'comprehension': ['determine-main-idea-oral'],
    'presentation': ['report-with-facts'],
    'register': ['formal-vs-informal'],
  },
  'grade-4': {
    'discussion': ['follow-roles'],
    'comprehension': ['paraphrase-presentation'],
    'evaluation': ['identify-evidence-speaker'],
    'presentation': ['present-with-facts'],
  },
  'grade-5': {
    'discussion': ['pose-respond-questions'],
    'comprehension': ['summarize-speaker-points'],
    'presentation': ['present-with-multimedia'],
    'register': ['adapt-speech'],
  },
  'grade-6': {
    'discussion': ['set-goals-discussion'],
    'media': ['interpret-diverse-media'],
    'evaluation': ['evaluate-speaker-argument'],
    'presentation': ['present-claims-findings'],
  },
};

// ── Accountable Talk Stems ──

const TALK_STEMS = {
  agree: ['I agree with ___ because...', 'Building on what ___ said...', 'I also think that because...'],
  disagree: ['I see it differently because...', 'I respectfully disagree because...', 'I understand your point, but...'],
  clarify: ['Can you explain what you mean by...?', 'Are you saying that...?', 'Could you say more about...?'],
  evidence: ['What in the text supports that?', 'Can you give an example?', 'What evidence shows that?'],
  summarize: ['So what you\'re saying is...', 'To summarize...', 'The main point is...'],
  connect: ['That connects to...', 'That reminds me of...', 'This is similar to...'],
};

// ── Content Banks ──

const EXERCISE_BANKS = {
  'kindergarten': {
    'take-turns': {
      items: [
        { scenario: 'Your friend is telling a story about their pet. What should you do?', options: ['Listen quietly and wait for your turn', 'Start talking about your pet right away', 'Walk away'], answer: 'Listen quietly and wait for your turn', rule: 'Good listeners wait for their turn to speak.' },
        { scenario: 'The teacher asks a question. Three students want to answer. What should happen?', options: ['Everyone shouts their answer', 'Raise hands and take turns', 'Only the loudest person talks'], answer: 'Raise hands and take turns', rule: 'We raise our hands and take turns so everyone can be heard.' },
        { scenario: 'You are in a group and someone is talking. You have something to say. What do you do?', options: ['Interrupt them quickly', 'Wait until they finish, then share', 'Whisper to someone else'], answer: 'Wait until they finish, then share', rule: 'Wait until the speaker is done before you talk.' },
        { scenario: 'Your partner finished talking. What do you do next?', options: ['Say nothing', 'Respond to what they said', 'Change the subject'], answer: 'Respond to what they said', rule: 'Good partners respond to what the other person says.' },
        { scenario: 'During circle time, your friend tells about their weekend. What is a kind thing to do?', options: ['Look at them and listen', 'Play with your shoes', 'Talk to your neighbor'], answer: 'Look at them and listen', rule: 'Look at the speaker and listen carefully.' },
        { scenario: 'Two friends both want to share first. What is a fair way to decide?', options: ['The louder one goes first', 'Take turns — one goes first today, the other tomorrow', 'Neither one shares'], answer: 'Take turns — one goes first today, the other tomorrow', rule: 'Taking turns is fair for everyone.' },
      ],
    },
    'describe-familiar': {
      items: [
        { prompt: 'Describe your favorite toy. Tell what it looks like and why you like it.', sampleAnswer: 'My favorite toy is a red truck. It has big wheels and I like to push it on the floor.', criteria: ['names the toy', 'gives a detail about appearance', 'tells why they like it'], type: 'open-describe' },
        { prompt: 'Describe a pet or animal you know. What does it look like? What does it do?', sampleAnswer: 'My cat is orange and fluffy. She likes to sleep on my bed and purr.', criteria: ['names the animal', 'describes appearance', 'tells what it does'], type: 'open-describe' },
        { prompt: 'Tell about your family. Who is in your family?', sampleAnswer: 'My family has my mom, my dad, and my little brother. We like to play games together.', criteria: ['names family members', 'shares a detail'], type: 'open-describe' },
        { prompt: 'Describe your favorite food. What does it taste like?', sampleAnswer: 'I love pizza. It is warm and cheesy and the crust is crunchy.', criteria: ['names the food', 'gives sensory details'], type: 'open-describe' },
        { prompt: 'Tell about your bedroom. What is in it?', sampleAnswer: 'My bedroom has a bed with a blue blanket and a shelf with books.', criteria: ['names the place', 'describes items in it'], type: 'open-describe' },
        { prompt: 'Describe what you see outside your window right now.', sampleAnswer: 'I see a big tree with green leaves and a blue sky.', criteria: ['names things seen', 'uses describing words'], type: 'open-describe' },
      ],
    },
    'speak-audibly': {
      items: [
        { scenario: 'You are sharing your drawing with the class, but you are whispering. What should you change?', options: ['Speak louder so everyone can hear', 'Speak even softer', 'Stop sharing'], answer: 'Speak louder so everyone can hear', rule: 'Speak loudly enough for everyone to hear you.' },
        { scenario: 'Your teacher says, "I can\'t hear you." What should you do?', options: ['Say it again louder and clearer', 'Just sit down', 'Whisper it again'], answer: 'Say it again louder and clearer', rule: 'If someone can\'t hear you, speak up.' },
        { scenario: 'You want to tell the class about your weekend. Which is the best way?', options: ['Mumble while looking at the floor', 'Speak clearly while looking at the class', 'Shout as loud as you can'], answer: 'Speak clearly while looking at the class', rule: 'Speak clearly and look at your audience.' },
        { scenario: 'When sharing in a group, you should speak...', options: ['So softly only you can hear', 'Loud enough for your group to hear', 'So loudly that you disturb other groups'], answer: 'Loud enough for your group to hear', rule: 'Match your volume to your audience.' },
        { scenario: 'A friend asks you a question. What is the best way to answer?', options: ['Use a full sentence and clear voice', 'Shrug without saying anything', 'Say one word very quietly'], answer: 'Use a full sentence and clear voice', rule: 'Answer clearly in a full sentence.' },
        { scenario: 'You are telling a story. You start talking very fast. What should you do?', options: ['Keep going fast', 'Slow down so people can understand', 'Stop talking'], answer: 'Slow down so people can understand', rule: 'Speak at a pace others can follow.' },
      ],
    },
    'listen-respond': {
      items: [
        { scenario: 'Your teacher reads a story about a bear who finds honey. She asks: "What did the bear find?" What should you say?', answer: 'The bear found honey.', type: 'listen-question' },
        { scenario: 'A classmate says: "I went to the zoo and saw elephants." What is a good response?', options: ['That sounds fun! What did the elephants do?', 'I don\'t care.', 'I want to talk about something else.'], answer: 'That sounds fun! What did the elephants do?', rule: 'Respond to what you heard and ask a question.' },
        { scenario: 'The teacher says: "Today we will learn about butterflies." She asks you to tell a partner one thing you already know about butterflies. What do you do?', options: ['Tell your partner one fact about butterflies', 'Talk about something else', 'Say nothing'], answer: 'Tell your partner one fact about butterflies', rule: 'Listen to directions and respond to the topic.' },
        { scenario: 'Your friend says they feel sad because their goldfish died. What is a kind response?', options: ['I\'m sorry about your fish. That must be sad.', 'So what? Get a new one.', 'I don\'t like fish anyway.'], answer: 'I\'m sorry about your fish. That must be sad.', rule: 'Good listeners respond with kindness.' },
        { scenario: 'The teacher says to draw a picture of your favorite season. Which shows good listening?', options: ['Drawing your favorite season', 'Drawing your friend', 'Drawing whatever you want'], answer: 'Drawing your favorite season', rule: 'Good listeners follow directions.' },
        { scenario: 'A friend tells you about their birthday party. What question could you ask?', answer: 'What did you do at the party?', type: 'listen-question' },
      ],
    },
  },
  'grade-1': {
    'build-on-talk': {
      items: [
        { partnerSaid: 'I think the character was brave because she went into the dark cave.', options: ['I agree because she was also scared but still went in.', 'I like pizza.', 'Whatever.'], answer: 'I agree because she was also scared but still went in.', stem: 'I agree because...', rule: 'Build on what your partner said by adding a reason.' },
        { partnerSaid: 'My favorite season is summer because I can swim.', options: ['I also like summer because I can play outside all day.', 'No, winter is better.', 'I don\'t want to talk about this.'], answer: 'I also like summer because I can play outside all day.', stem: 'I also think...because...', rule: 'Add your own idea that connects to your partner\'s.' },
        { partnerSaid: 'I think dogs are the best pets because they are friendly.', options: ['Building on that, dogs also help people feel happy.', 'Cats are better.', 'So what?'], answer: 'Building on that, dogs also help people feel happy.', stem: 'Building on that...', rule: 'Use a talk stem to build on ideas.' },
        { partnerSaid: 'The story was about a boy who lost his teddy bear.', options: ['I noticed that too. He was really sad until he found it.', 'Teddy bears are for babies.', 'I wasn\'t listening.'], answer: 'I noticed that too. He was really sad until he found it.', stem: 'I noticed that too...', rule: 'Show you listened and add a detail.' },
        { partnerSaid: 'I think we should recycle because it helps the Earth.', options: ['That\'s a good point. We can also reuse things.', 'Who cares?', 'I want to go outside.'], answer: 'That\'s a good point. We can also reuse things.', stem: 'That\'s a good point. We can also...', rule: 'Agree and extend with a new idea.' },
        { partnerSaid: 'Plants need sunlight to grow.', options: ['That\'s true, and they also need water and soil.', 'I don\'t like plants.', 'Can we talk about something else?'], answer: 'That\'s true, and they also need water and soil.', stem: 'That\'s true, and they also...', rule: 'Confirm and add new information.' },
      ],
    },
    'ask-answer-questions': {
      items: [
        { speakerSaid: 'I visited my grandma last weekend. We baked cookies together.', question: 'What kind of cookies did you bake?', type: 'ask-about-details', rule: 'Ask questions to learn more details.' },
        { speakerSaid: 'The story was about a frog who wanted to fly.', question: 'How did the frog try to fly?', type: 'ask-about-details', rule: 'Ask about what happened in the story.' },
        { speakerSaid: 'My favorite book is about a magic treehouse.', question: 'What happens in the book?', type: 'ask-about-details', rule: 'Ask a question to learn more.' },
        { passage: 'Sam went to the farm. He saw cows, pigs, and chickens. His favorite animal was the pig because it was funny.', question: 'What was Sam\'s favorite animal at the farm?', answer: 'The pig', rule: 'Listen for specific details to answer questions.' },
        { passage: 'Maya likes to paint. She paints flowers, trees, and rainbows. She uses bright colors.', question: 'What does Maya like to paint?', answer: 'Flowers, trees, and rainbows', rule: 'Listen for key details.' },
        { passage: 'The class went on a field trip to the museum. They saw dinosaur bones and old paintings.', question: 'Where did the class go?', answer: 'The museum', rule: 'Listen for the main facts.' },
      ],
    },
    'retell-details': {
      items: [
        { story: 'A little bird fell out of its nest. A kind girl found it. She put it back in the tree. The mama bird was happy.', retellCheck: ['bird fell out of nest', 'girl found it', 'put it back', 'mama bird was happy'], question: 'What happened first in the story?', answer: 'A little bird fell out of its nest.', rule: 'Retell events in order.' },
        { story: 'Tom wanted a puppy. He asked his parents every day. Finally, on his birthday, he got a brown puppy named Max.', retellCheck: ['Tom wanted a puppy', 'asked his parents', 'got a puppy on birthday', 'named Max'], question: 'What did Tom get on his birthday?', answer: 'A brown puppy named Max.', rule: 'Remember key details when retelling.' },
        { story: 'It was raining. Lily couldn\'t play outside. She built a fort with blankets inside. She read books in her fort all day.', retellCheck: ['raining', 'couldn\'t play outside', 'built a fort', 'read books'], question: 'Why couldn\'t Lily play outside?', answer: 'Because it was raining.', rule: 'Retell the reason things happened.' },
        { story: 'The three friends went to the park. They played on the swings and the slide. Then they had a picnic under a tree.', retellCheck: ['three friends', 'went to park', 'played on swings and slide', 'had picnic'], question: 'What did the friends do at the park?', answer: 'They played on the swings and slide and had a picnic.', rule: 'Retell important events.' },
        { story: 'A caterpillar ate lots of leaves. It made a cocoon. After two weeks, a butterfly came out.', retellCheck: ['caterpillar ate leaves', 'made cocoon', 'butterfly came out'], question: 'What came out of the cocoon?', answer: 'A butterfly.', rule: 'Retell the outcome.' },
        { story: 'Ben lost his lunchbox at school. He looked in his classroom and the gym. He found it in the cafeteria.', retellCheck: ['lost lunchbox', 'looked in classroom and gym', 'found in cafeteria'], question: 'Where did Ben find his lunchbox?', answer: 'In the cafeteria.', rule: 'Remember specific details.' },
      ],
    },
    'complete-sentences': {
      items: [
        { fragment: 'the dog', correction: 'The dog is big and brown.', rule: 'Add a verb and details to make a complete sentence.', type: 'expand' },
        { fragment: 'because it was raining', correction: 'We stayed inside because it was raining.', rule: 'A complete sentence needs a subject and verb.', type: 'expand' },
        { scenario: 'Your teacher asks what you did this weekend. Which is a complete sentence?', options: ['Went to the park.', 'I went to the park with my family.', 'Park.'], answer: 'I went to the park with my family.', rule: 'Speak in complete sentences with a subject and verb.' },
        { scenario: 'Someone asks what your favorite color is. Which is the best answer?', options: ['Blue.', 'My favorite color is blue because it reminds me of the sky.', 'Um.'], answer: 'My favorite color is blue because it reminds me of the sky.', rule: 'Give a complete answer with a reason.' },
        { scenario: 'A friend asks what happened in the book. Which answer is a complete sentence?', options: ['The boy found a magic key and opened a secret door.', 'A key. Secret door.', 'Found it.'], answer: 'The boy found a magic key and opened a secret door.', rule: 'Use complete sentences when sharing information.' },
        { scenario: 'The teacher asks you to describe the weather. Which is best?', options: ['Cold.', 'It is cold and windy outside today.', 'Weather.'], answer: 'It is cold and windy outside today.', rule: 'Speak in complete sentences with details.' },
      ],
    },
  },
  'grade-2': {
    'discuss-with-partner': {
      items: [
        { topic: 'Should students have more recess time?', stemToUse: 'I think...because...', sampleResponse: 'I think students should have more recess because it helps us focus better in class.', criteria: ['states an opinion', 'gives a reason', 'uses complete sentence'], type: 'discussion-prompt' },
        { topic: 'What makes a good friend?', stemToUse: 'A good friend is someone who...', sampleResponse: 'A good friend is someone who listens to you and is kind when you are sad.', criteria: ['defines quality', 'gives example'], type: 'discussion-prompt' },
        { partnerSaid: 'I think the main character was selfish because he didn\'t share.', options: ['I see it differently. He was scared, not selfish, because he thought he would lose his things.', 'No, you\'re wrong.', 'OK.'], answer: 'I see it differently. He was scared, not selfish, because he thought he would lose his things.', rule: 'Disagree respectfully and explain your thinking.' },
        { partnerSaid: 'Recycling is important because it helps the planet.', options: ['I agree, and I want to add that recycling also saves energy.', 'Sure.', 'I don\'t recycle.'], answer: 'I agree, and I want to add that recycling also saves energy.', rule: 'Build on your partner\'s idea with new information.' },
        { scenario: 'You and your partner are discussing a story. Your partner hasn\'t spoken yet. What should you do?', options: ['Ask them what they think', 'Keep talking about your own ideas', 'Ignore them'], answer: 'Ask them what they think', rule: 'Good partners make sure everyone gets to share.' },
        { scenario: 'During a partner discussion, you realize you weren\'t listening. What should you do?', options: ['Ask your partner to repeat what they said', 'Pretend you were listening', 'Change the subject'], answer: 'Ask your partner to repeat what they said', rule: 'It\'s OK to ask someone to repeat — that shows you care.' },
      ],
    },
    'recount-key-ideas': {
      items: [
        { passage: 'The speaker talked about how honeybees make honey. First, bees collect nectar from flowers. Then they bring it back to the hive. Other bees fan the nectar with their wings until it becomes thick honey.', question: 'What are the key steps in making honey?', answer: 'Bees collect nectar, bring it to the hive, and fan it until it becomes honey.', rule: 'Recount the main steps in order.' },
        { passage: 'The presenter explained that the water cycle has three main parts: evaporation, condensation, and precipitation. Water evaporates from lakes, forms clouds, and falls as rain.', question: 'What are the three parts of the water cycle?', answer: 'Evaporation, condensation, and precipitation.', rule: 'Identify the key ideas from a presentation.' },
        { passage: 'The librarian told us about different types of books. Fiction books are made-up stories. Nonfiction books are about real things. She said both kinds are important for good readers.', question: 'What was the main point?', answer: 'There are two types of books — fiction and nonfiction — and both are important.', rule: 'Summarize the main point in your own words.' },
        { passage: 'A firefighter visited our class. She told us three fire safety rules: stop, drop, and roll if your clothes catch fire; crawl low under smoke; and have a meeting place outside your home.', question: 'What were the fire safety rules?', answer: 'Stop drop and roll, crawl low under smoke, and have a meeting place outside.', rule: 'Recount specific details from a speaker.' },
        { passage: 'The science teacher explained why leaves change color in fall. Trees stop making green chlorophyll. Then we can see the yellow and orange colors that were hidden underneath.', question: 'Why do leaves change color?', answer: 'Trees stop making chlorophyll and the hidden yellow and orange colors show.', rule: 'Recount the cause and effect.' },
        { passage: 'Our principal announced that the school will start a garden. Students will plant vegetables and flowers. Each class will take turns watering and caring for the plants.', question: 'What is the school starting and who will help?', answer: 'A school garden where each class takes turns caring for plants.', rule: 'Recount who, what, and how.' },
      ],
    },
    'ask-clarification': {
      items: [
        { speakerSaid: 'Animals have different adaptations to survive.', bestQuestion: 'What do you mean by adaptations?', options: ['What do you mean by adaptations?', 'Do you like animals?', 'Can we talk about something else?'], answer: 'What do you mean by adaptations?', rule: 'Ask for clarification when you hear an unfamiliar word.' },
        { speakerSaid: 'The character changed a lot by the end of the story.', bestQuestion: 'Can you give an example of how the character changed?', options: ['Can you give an example of how the character changed?', 'I liked the story.', 'What story?'], answer: 'Can you give an example of how the character changed?', rule: 'Ask for examples to understand better.' },
        { speakerSaid: 'There are many reasons why we should protect the rainforest.', bestQuestion: 'What is one reason we should protect the rainforest?', options: ['What is one reason we should protect the rainforest?', 'Where is the rainforest?', 'I don\'t like rain.'], answer: 'What is one reason we should protect the rainforest?', rule: 'Ask about specifics when a claim is general.' },
        { speakerSaid: 'The experiment didn\'t work the way we expected.', bestQuestion: 'What did you expect to happen?', options: ['What did you expect to happen?', 'That\'s bad.', 'Can I go next?'], answer: 'What did you expect to happen?', rule: 'Ask about expectations to understand surprises.' },
        { speakerSaid: 'This reminds me of another book we read.', bestQuestion: 'Which book does it remind you of and why?', options: ['Which book does it remind you of and why?', 'I don\'t remember.', 'OK.'], answer: 'Which book does it remind you of and why?', rule: 'Ask follow-up questions to deepen the conversation.' },
        { speakerSaid: 'I think the ending was unfair.', bestQuestion: 'Are you saying the character deserved something different?', options: ['Are you saying the character deserved something different?', 'No it wasn\'t.', 'Whatever.'], answer: 'Are you saying the character deserved something different?', rule: 'Paraphrase to check your understanding.' },
      ],
    },
    'audio-recording': {
      items: [
        { task: 'You are going to record yourself reading a poem. What should you do to prepare?', options: ['Practice reading it aloud several times first', 'Read it once silently and then record', 'Just press record and hope for the best'], answer: 'Practice reading it aloud several times first', rule: 'Practice before recording to sound your best.' },
        { task: 'When recording a story, your voice should be...', options: ['Clear, expressive, and at a good pace', 'As fast as possible to save time', 'In a whisper so you don\'t bother anyone'], answer: 'Clear, expressive, and at a good pace', rule: 'Use expression and pace when recording.' },
        { task: 'You are recording a retelling of a story. What should you include?', options: ['The beginning, middle, and end in order', 'Only the ending', 'Random details you remember'], answer: 'The beginning, middle, and end in order', rule: 'Organize your retelling with beginning, middle, end.' },
        { task: 'After recording, you listen back and notice you spoke too fast. What should you do?', options: ['Record it again at a slower pace', 'Leave it as is', 'Add more words to fill time'], answer: 'Record it again at a slower pace', rule: 'Listen to your recording and improve it.' },
        { task: 'You want your poem recording to be interesting. What can you do with your voice?', options: ['Change your tone and speed to match the mood', 'Read in a flat, boring voice', 'Shout the whole time'], answer: 'Change your tone and speed to match the mood', rule: 'Use vocal expression to make recordings engaging.' },
        { task: 'What makes a good audio recording of a story?', options: ['Clear voice, good pacing, and expression', 'Background noise and mumbling', 'Reading as fast as possible'], answer: 'Clear voice, good pacing, and expression', rule: 'Good recordings are clear, paced well, and expressive.' },
      ],
    },
  },
  'grade-3': {
    'prepared-discussion': {
      items: [
        { topic: 'Should schools have uniforms?', prepTask: 'Write two reasons for your opinion.', samplePrep: 'I think schools should not have uniforms because: 1) students should express themselves through clothing, 2) uniforms cost extra money for families.', criteria: ['has a clear opinion', 'gives two reasons', 'stays on topic'], type: 'discussion-prompt' },
        { topic: 'Is it better to read a book or watch the movie version?', prepTask: 'Think of one advantage of each.', samplePrep: 'Books let you imagine the characters yourself, but movies let you see special effects.', criteria: ['considers both sides', 'gives specific reasons'], type: 'discussion-prompt' },
        { scenario: 'Before a group discussion about a story, you should...', options: ['Reread the text and write down your thoughts', 'Wait to hear what others say and agree with them', 'Skip the reading and just guess'], answer: 'Reread the text and write down your thoughts', rule: 'Come prepared with notes and ideas.' },
        { scenario: 'During a discussion, someone goes off topic. What should you do?', options: ['Politely say, "Can we get back to our question?"', 'Go off topic too', 'Tell them they\'re wrong'], answer: 'Politely say, "Can we get back to our question?"', rule: 'Help keep the discussion on track.' },
        { scenario: 'You prepared notes but someone already said your idea. What do you do?', options: ['Say, "I agree with that, and I want to add..."', 'Say nothing since it was already said', 'Get upset that someone took your idea'], answer: 'Say, "I agree with that, and I want to add..."', rule: 'Build on shared ideas and add new thinking.' },
        { scenario: 'Your discussion group can\'t agree. What is the best next step?', options: ['Ask each person to share their evidence', 'Vote and the majority wins immediately', 'Stop talking about it'], answer: 'Ask each person to share their evidence', rule: 'Use evidence to support different viewpoints.' },
      ],
    },
    'determine-main-idea-oral': {
      items: [
        { passage: 'A speaker said: "Butterflies go through four stages. First they are an egg. Then a caterpillar. Next they form a chrysalis. Finally, they become a butterfly. This is called metamorphosis."', question: 'What is the main idea?', answer: 'Butterflies go through four stages of metamorphosis.', rule: 'The main idea is the most important point the speaker makes.' },
        { passage: 'The presenter explained: "Many animals migrate in the fall. Birds fly south where it\'s warmer. Whales swim to warmer waters. Monarch butterflies travel thousands of miles. They all migrate to find food and warmth."', question: 'What is the main idea?', answer: 'Many animals migrate in the fall to find food and warmth.', rule: 'Look for what all the details have in common.' },
        { passage: 'The guest speaker said: "Reading every day is one of the best things you can do. It builds your vocabulary, improves your writing, and helps you learn about the world. Even 15 minutes a day makes a big difference."', question: 'What is the main idea?', answer: 'Reading every day has many benefits.', rule: 'The main idea ties all the supporting details together.' },
        { passage: 'Our teacher explained: "Ancient Egyptians built pyramids as tombs for pharaohs. It took thousands of workers many years to build one pyramid. They used huge stone blocks, each weighing several tons."', question: 'What is the main idea?', answer: 'Ancient Egyptians built large pyramids as tombs for pharaohs.', rule: 'Identify what the speaker mostly talked about.' },
        { passage: 'The scientist told us: "Recycling helps in three big ways. It reduces trash in landfills. It saves natural resources like trees and water. And it uses less energy than making new things from scratch."', question: 'What is the main idea?', answer: 'Recycling helps the environment in three important ways.', rule: 'The main idea is supported by specific details.' },
        { passage: 'The coach said: "Teamwork is the key to winning. Each player has a role. When everyone does their job and supports each other, the whole team succeeds. No one player can win alone."', question: 'What is the main idea?', answer: 'Teamwork is essential for a team to succeed.', rule: 'The main idea is often stated first, then supported with details.' },
      ],
    },
    'report-with-facts': {
      items: [
        { topic: 'Dolphins', prepFramework: 'PREP', sampleReport: 'Point: Dolphins are amazing ocean mammals. Reason: They are very intelligent and social. Example: Dolphins use clicks and whistles to communicate and work together to catch fish. Point again: Dolphins truly are some of the smartest animals in the sea.', criteria: ['states main point', 'gives a reason', 'includes specific facts', 'restates the point'], type: 'presentation-plan' },
        { topic: 'The Water Cycle', prepFramework: 'PREP', sampleReport: 'Point: The water cycle keeps water moving around Earth. Reason: Water changes form as it moves through the cycle. Example: Water evaporates from oceans, forms clouds through condensation, and falls as precipitation like rain or snow. Point again: The water cycle is nature\'s way of recycling water.', criteria: ['states main point', 'gives a reason', 'includes facts', 'restates'], type: 'presentation-plan' },
        { scenario: 'You are giving a report on your state animal. Which is the best opening?', options: ['The state animal of Texas is the armadillo, and today I\'ll share three interesting facts about it.', 'Um, so, I\'m going to talk about animals I guess.', 'Animals are cool.'], answer: 'The state animal of Texas is the armadillo, and today I\'ll share three interesting facts about it.', rule: 'Start with a clear topic statement.' },
        { scenario: 'During your report, you should...', options: ['Speak clearly, look at the audience, and share facts', 'Read everything from your paper without looking up', 'Rush through it as fast as you can'], answer: 'Speak clearly, look at the audience, and share facts', rule: 'Good reporters speak clearly and engage the audience.' },
        { scenario: 'You are planning a report on penguins. What should you do first?', options: ['Research facts and organize them with PREP', 'Just start talking and see what happens', 'Copy what a friend says'], answer: 'Research facts and organize them with PREP', rule: 'Plan and organize before presenting.' },
        { scenario: 'At the end of your report, you should...', options: ['Restate your main point and ask if there are questions', 'Just stop talking suddenly', 'Say "I\'m done" and sit down'], answer: 'Restate your main point and ask if there are questions', rule: 'End by restating your point and inviting questions.' },
      ],
    },
    'formal-vs-informal': {
      items: [
        { sentence: 'Hey, what\'s up?', register: 'informal', context: 'greeting a friend', formal: 'Good morning, how are you?' },
        { sentence: 'Dear Principal Johnson, I am writing to request permission for a field trip.', register: 'formal', context: 'letter to principal', informal: 'Hey, can we go on a trip?' },
        { sentence: 'That book was, like, totally awesome!', register: 'informal', context: 'talking with friends', formal: 'That book was excellent and very enjoyable.' },
        { sentence: 'I would like to present my research on volcanoes.', register: 'formal', context: 'classroom presentation', informal: 'So I looked up stuff about volcanoes.' },
        { sentence: 'Gonna grab some lunch, wanna come?', register: 'informal', context: 'texting a friend', formal: 'Would you like to join me for lunch?' },
        { sentence: 'Thank you for the opportunity to speak today.', register: 'formal', context: 'beginning a speech', informal: 'Thanks for letting me talk.' },
        { scenario: 'You are asking the librarian for help finding a book. Which is more appropriate?', options: ['Excuse me, could you help me find a book about space?', 'Yo, where are the space books?'], answer: 'Excuse me, could you help me find a book about space?', rule: 'Use formal language with adults and in professional settings.' },
        { scenario: 'You are presenting a book report to the class. How should you speak?', options: ['Using clear, formal language', 'Using slang and casual language'], answer: 'Using clear, formal language', rule: 'Presentations use formal register.' },
      ],
    },
  },
  'grade-4': {
    'follow-roles': {
      items: [
        { role: 'Discussion Leader', responsibility: 'Ask questions to start and guide the discussion.', scenario: 'You are the discussion leader. The group is silent. What should you do?', options: ['Ask an open-ended question about the topic', 'Wait for someone else to start', 'Tell everyone what to think'], answer: 'Ask an open-ended question about the topic', rule: 'The discussion leader keeps the conversation going with questions.' },
        { role: 'Note Taker', responsibility: 'Write down key ideas the group discusses.', scenario: 'You are the note taker. Two people are sharing ideas at once. What should you do?', options: ['Ask them to take turns so you can capture both ideas', 'Only write down the louder person\'s idea', 'Stop taking notes'], answer: 'Ask them to take turns so you can capture both ideas', rule: 'The note taker ensures all important ideas are recorded.' },
        { role: 'Timekeeper', responsibility: 'Make sure the group stays on schedule.', scenario: 'You are the timekeeper. The group has spent too long on the first question. What should you say?', options: ['"We have 5 minutes left. Let\'s move to the next question."', 'Nothing — just let them keep talking', '"Hurry up, you\'re wasting time!"'], answer: '"We have 5 minutes left. Let\'s move to the next question."', rule: 'The timekeeper politely helps the group manage time.' },
        { role: 'Connector', responsibility: 'Link ideas between group members.', scenario: 'You are the connector. Maria said the character was brave, and then John said the character was determined. What could you say?', options: ['"Maria and John both noticed the character\'s strength — being brave and determined go together."', '"Those are different ideas."', '"Who\'s right?"'], answer: '"Maria and John both noticed the character\'s strength — being brave and determined go together."', rule: 'The connector finds links between different people\'s ideas.' },
        { scenario: 'In a group discussion, one person hasn\'t spoken yet. What should the leader do?', options: ['Invite them to share by asking their opinion', 'Ignore them and keep discussing', 'Tell them they have to talk'], answer: 'Invite them to share by asking their opinion', rule: 'Leaders make sure everyone participates.' },
        { scenario: 'Your role is to pose questions that connect to what others say. A classmate shares that the setting of the story seems dark and scary. What question could you ask?', options: ['"How does the dark setting affect the way the characters feel?"', '"What\'s your favorite color?"', '"Do you like scary movies?"'], answer: '"How does the dark setting affect the way the characters feel?"', rule: 'Pose questions that deepen the discussion.' },
      ],
    },
    'paraphrase-presentation': {
      items: [
        { original: 'The speaker said that honeybees are crucial to our food supply because they pollinate about one-third of the crops we eat, including apples, almonds, and blueberries.', goodParaphrase: 'Honeybees help produce much of our food by pollinating many crops like apples and blueberries.', badParaphrase: 'Bees are bugs that live in hives.', question: 'Which is a good paraphrase?', options: ['Honeybees help produce much of our food by pollinating many crops like apples and blueberries.', 'Bees are bugs that live in hives.', 'The speaker said that honeybees are crucial to our food supply.'], answer: 'Honeybees help produce much of our food by pollinating many crops like apples and blueberries.', rule: 'A paraphrase restates the key idea in your own words.' },
        { original: 'The presenter explained that the Great Wall of China was built over many centuries by different dynasties to protect against invasions from the north.', question: 'Paraphrase this in your own words.', answer: 'The Great Wall was built over a long time by many rulers to defend China from northern invaders.', rule: 'Keep the main idea but use different words.' },
        { original: 'According to the speaker, getting enough sleep is essential for students because it helps their brains process what they learned during the day and prepares them for new learning.', question: 'What is the main point to paraphrase?', answer: 'Sleep helps students\' brains learn and remember.', rule: 'Focus on the central idea when paraphrasing.' },
        { original: 'The guest said that plastic pollution in the ocean harms sea animals because they mistake plastic bags for jellyfish and eat them, which makes them sick.', question: 'Paraphrase the speaker\'s main point.', answer: 'Ocean plastic hurts sea animals that eat it by mistake.', rule: 'Paraphrase captures meaning in fewer words.' },
        { original: 'The scientist explained that fossils are the preserved remains of plants and animals that lived millions of years ago, and they help us understand what life was like in the past.', question: 'Paraphrase this.', answer: 'Fossils are ancient remains that show us what life was like long ago.', rule: 'A good paraphrase keeps the meaning but changes the wording.' },
        { original: 'The teacher said that volcanoes form when hot melted rock called magma rises from deep inside the Earth and breaks through the surface.', question: 'Put this in your own words.', answer: 'Volcanoes are created when magma from deep underground pushes up and erupts.', rule: 'Use your own words to show understanding.' },
      ],
    },
    'identify-evidence-speaker': {
      items: [
        { claim: 'A speaker says: "Dogs make the best pets."', evidence: '"Studies show that dog owners exercise 30 minutes more per day and report feeling less lonely."', question: 'What evidence does the speaker use?', answer: 'Studies about exercise and loneliness in dog owners.', hasEvidence: true, rule: 'Evidence includes facts, data, or research.' },
        { claim: 'A speaker says: "We should eat more vegetables."', evidence: '"I just think they taste good."', question: 'Is this strong evidence?', answer: 'No, this is an opinion, not evidence.', hasEvidence: false, rule: 'Personal opinions are not strong evidence.' },
        { claim: 'A speaker says: "Our school should start a recycling program."', evidence: '"Last year, our school threw away 2,000 pounds of recyclable materials. A recycling program could reduce our waste by 40 percent."', question: 'What evidence supports the claim?', answer: 'Statistics about waste amounts and potential reduction.', hasEvidence: true, rule: 'Numbers and statistics are strong evidence.' },
        { claim: 'A speaker says: "Reading makes you smarter."', evidence: '"Everyone knows that reading is good for you."', question: 'Is this strong evidence?', answer: 'No — "everyone knows" is not specific evidence.', hasEvidence: false, rule: 'Vague claims like "everyone knows" are not evidence.' },
        { claim: 'A speaker says: "Helmets save lives."', evidence: '"According to the CDC, wearing a helmet reduces the risk of head injury by 85 percent."', question: 'What makes this evidence strong?', answer: 'It cites a specific source (CDC) with a specific statistic (85%).', hasEvidence: true, rule: 'Strong evidence names specific sources and data.' },
        { claim: 'A speaker says: "Recess should be longer."', evidence: '"A study by the American Academy of Pediatrics found that students who have more recess time show better focus and behavior in class."', question: 'What evidence does the speaker provide?', answer: 'A study from the American Academy of Pediatrics about recess and focus.', hasEvidence: true, rule: 'Research studies provide credible evidence.' },
      ],
    },
    'present-with-facts': {
      items: [
        { topic: 'Endangered Animals', prepFramework: 'PREP', samplePresentation: 'Point: Many animals are endangered and need our help. Reason: Human activities like deforestation and pollution destroy their habitats. Example: The giant panda nearly went extinct because bamboo forests were cut down, but conservation efforts have helped their numbers grow. Point again: By protecting habitats, we can save endangered species.', criteria: ['clear main point', 'factual reasons', 'specific example', 'conclusion restates point'], type: 'presentation-plan' },
        { scenario: 'You are presenting about the solar system. Which opening is best?', options: ['Our solar system has eight planets, and today I\'ll explain what makes each one unique.', 'Space is cool, I guess. Let me tell you stuff.', 'So, um, planets.'], answer: 'Our solar system has eight planets, and today I\'ll explain what makes each one unique.', rule: 'Start with a clear, factual topic sentence.' },
        { scenario: 'During your presentation, you realize you forgot a fact. What should you do?', options: ['Skip it smoothly and continue with what you know', 'Stop and say "I forgot everything"', 'Make up a fact'], answer: 'Skip it smoothly and continue with what you know', rule: 'Stay composed and continue confidently.' },
        { scenario: 'You are presenting and someone asks a question you don\'t know the answer to. What should you say?', options: ['"That\'s a great question. I\'m not sure, but I can look it up."', '"I don\'t know, don\'t ask me that."', 'Just ignore the question.'], answer: '"That\'s a great question. I\'m not sure, but I can look it up."', rule: 'It\'s OK not to know everything — offer to find out.' },
        { scenario: 'What makes a presentation engaging for the audience?', options: ['Eye contact, clear voice, interesting facts, and visual aids', 'Reading everything from a paper without looking up', 'Talking as fast as possible'], answer: 'Eye contact, clear voice, interesting facts, and visual aids', rule: 'Engage your audience with delivery and content.' },
        { scenario: 'You need to present at a pace the audience can follow. What does that mean?', options: ['Speak at a steady speed, pausing after important points', 'Talk as fast as you can', 'Speak very slowly with long pauses between every word'], answer: 'Speak at a steady speed, pausing after important points', rule: 'Pace yourself — not too fast, not too slow.' },
      ],
    },
  },
  'grade-5': {
    'pose-respond-questions': {
      items: [
        { context: 'Your group is discussing whether zoos are good for animals.', goodQuestion: 'What evidence do we have that zoos help with conservation versus keeping animals in unnatural environments?', badQuestion: 'Do you like zoos?', type: 'identify-better-question', options: ['What evidence do we have that zoos help with conservation versus keeping animals in unnatural environments?', 'Do you like zoos?', 'Have you been to a zoo?'], answer: 'What evidence do we have that zoos help with conservation versus keeping animals in unnatural environments?', rule: 'Good discussion questions require evidence and thinking, not just yes/no.' },
        { partnerSaid: 'I think the author wrote this story to teach us about perseverance.', goodResponse: 'I agree, and I noticed the character failed three times before succeeding, which supports your idea. But could the author also be teaching us about asking for help?', type: 'model-response', rule: 'Build on ideas, cite evidence, and extend thinking.' },
        { context: 'Your group is discussing how technology affects learning.', scenario: 'Someone says technology is bad for kids. What\'s the best response?', options: ['Can you explain what specific evidence makes you think that? I\'ve read that some technology tools actually improve learning.', 'No, you\'re wrong.', 'OK I guess.'], answer: 'Can you explain what specific evidence makes you think that? I\'ve read that some technology tools actually improve learning.', rule: 'Ask for evidence and share your own respectfully.' },
        { context: 'Discussing a novel.', classmateSaid: 'The main character should have just run away.', goodResponse: 'What makes you say that? I think staying showed courage, especially on page 47 when she stood up to the bully.', type: 'model-response', rule: 'Respond with questions and text evidence.' },
        { scenario: 'During a discussion, you want to draw a conclusion. What should you say?', options: ['"Based on everything we\'ve discussed, it seems like the key idea is..."', '"I think we\'re done talking."', '"My opinion is right."'], answer: '"Based on everything we\'ve discussed, it seems like the key idea is..."', rule: 'Draw conclusions by synthesizing what the group discussed.' },
        { scenario: 'Someone makes a point you hadn\'t considered. What is the best response?', options: ['"That\'s an interesting perspective I hadn\'t thought of. It makes me reconsider because..."', '"I don\'t agree."', '"Whatever."'], answer: '"That\'s an interesting perspective I hadn\'t thought of. It makes me reconsider because..."', rule: 'Be open to changing your thinking based on new ideas.' },
      ],
    },
    'summarize-speaker-points': {
      items: [
        { speech: 'The speaker argued that school lunch should be healthier. She made three points: first, many students eat too much sugar at lunch; second, healthier meals improve focus in afternoon classes; and third, schools that switched to healthier menus saw fewer visits to the nurse.', question: 'Summarize the speaker\'s argument.', answer: 'The speaker argued for healthier school lunches because students eat too much sugar, healthy food improves focus, and healthier menus led to fewer nurse visits.', rule: 'A summary captures the claim and key supporting points.' },
        { speech: 'The presenter claimed that homework should be limited to 30 minutes per night. He supported this with research showing that too much homework causes stress, reduces family time, and doesn\'t always improve grades.', question: 'How does the speaker support his claim?', answer: 'He cites research showing excessive homework causes stress, reduces family time, and doesn\'t improve grades.', rule: 'Identify how each point supports the main claim.' },
        { speech: 'The guest speaker told us about climate change. She explained that the Earth is warming because of greenhouse gases from cars and factories. She showed data that temperatures have risen 1.5 degrees in 100 years. She said we can help by using less energy.', question: 'What are the speaker\'s main points?', answer: 'Earth is warming due to greenhouse gases, temperatures rose 1.5 degrees in 100 years, and we can help by using less energy.', rule: 'Identify the key facts and solutions the speaker presents.' },
        { speech: 'The author visited our school and said writing is like building a house. First you need a foundation — that\'s your main idea. Then you add walls — those are your supporting details. Finally, you add a roof — that\'s your conclusion that holds everything together.', question: 'Summarize the author\'s analogy.', answer: 'The author compared writing to building a house: the foundation is the main idea, walls are supporting details, and the roof is the conclusion.', rule: 'When summarizing analogies, explain both the comparison and what each part represents.' },
        { speech: 'The historian explained that the American Revolution happened for several reasons. Colonists were upset about paying taxes without having a say in government. They also wanted the freedom to make their own laws and trade with whomever they chose.', question: 'Summarize why the Revolution happened according to the speaker.', answer: 'Colonists wanted representation in government, freedom to make their own laws, and freedom to trade.', rule: 'Summarize causes or reasons as a list of key points.' },
        { speech: 'The nutritionist said breakfast is the most important meal. Students who eat breakfast score higher on tests, have more energy, and are more focused. She recommended a balanced breakfast with protein, whole grains, and fruit.', question: 'What is the speaker\'s claim and evidence?', answer: 'Claim: breakfast is the most important meal. Evidence: students who eat it score higher, have more energy, and focus better.', rule: 'Distinguish between the claim and the evidence.' },
      ],
    },
    'present-with-multimedia': {
      items: [
        { scenario: 'You are presenting about ocean pollution. Which multimedia element would BEST support your presentation?', options: ['A graph showing the increase in plastic waste in the ocean over 20 years', 'A funny cartoon unrelated to the topic', 'A plain white slide with small text'], answer: 'A graph showing the increase in plastic waste in the ocean over 20 years', rule: 'Multimedia should directly support and strengthen your message.' },
        { scenario: 'You are creating slides for a presentation. What is the best approach?', options: ['Use images and key words — don\'t read everything from the slide', 'Fill each slide with long paragraphs', 'Use as many animations as possible'], answer: 'Use images and key words — don\'t read everything from the slide', rule: 'Slides support your talk — they shouldn\'t replace it.' },
        { scenario: 'Your presentation includes a short video clip. When should you play it?', options: ['Right when it connects to the point you are making', 'At the very beginning before you say anything', 'At the very end after you are done talking'], answer: 'Right when it connects to the point you are making', rule: 'Time multimedia to reinforce the specific point you are making.' },
        { scenario: 'You want to show data about students\' favorite school subjects. What is the best visual?', options: ['A bar graph or pie chart', 'A page of numbers in a list', 'A picture of a classroom'], answer: 'A bar graph or pie chart', rule: 'Use charts and graphs to make data visual and clear.' },
        { scenario: 'What should you do while showing a multimedia element?', options: ['Explain what the audience is seeing and why it matters', 'Stay silent and let them figure it out', 'Talk about something unrelated while it plays'], answer: 'Explain what the audience is seeing and why it matters', rule: 'Always explain how your multimedia connects to your point.' },
        { scenario: 'Your presentation is about the rainforest. You want to help the audience understand its beauty. What multimedia would work best?', options: ['High-quality photos of the rainforest with brief captions', 'A long text description read aloud from a paper', 'A map with no labels'], answer: 'High-quality photos of the rainforest with brief captions', rule: 'Visuals can convey meaning that words alone cannot.' },
      ],
    },
    'adapt-speech': {
      items: [
        { situation: 'Explaining your science project to a kindergartner', bestApproach: 'Use simple words and short sentences; maybe show a picture.', options: ['Use simple words and short sentences; maybe show a picture.', 'Use the same scientific vocabulary as in your report.', 'Don\'t bother — they won\'t understand anyway.'], answer: 'Use simple words and short sentences; maybe show a picture.', rule: 'Adapt your language to your audience\'s level.' },
        { situation: 'Asking the principal to change a school rule', bestApproach: 'Use polite, formal language and provide reasons with evidence.', options: ['Use polite, formal language and provide reasons with evidence.', 'Use slang and demand the change.', 'Just complain about how unfair it is.'], answer: 'Use polite, formal language and provide reasons with evidence.', rule: 'Formal situations require formal language and evidence.' },
        { situation: 'Telling your friends about a movie you saw', bestApproach: 'Use casual, enthusiastic language.', options: ['Use casual, enthusiastic language.', 'Write a formal review and read it to them.', 'Give a one-word answer.'], answer: 'Use casual, enthusiastic language.', rule: 'Casual settings allow informal, expressive language.' },
        { situation: 'Presenting a book report to the class', bestApproach: 'Use clear, formal language with an organized structure.', options: ['Use clear, formal language with an organized structure.', 'Wing it and use lots of "um" and "like".', 'Mumble through it quickly.'], answer: 'Use clear, formal language with an organized structure.', rule: 'Classroom presentations require formal, organized speech.' },
        { situation: 'Leaving a voicemail for a doctor\'s office', bestApproach: 'Speak clearly and formally, stating your name and reason for calling.', options: ['Speak clearly and formally, stating your name and reason for calling.', 'Talk fast and use slang.', 'Just hang up.'], answer: 'Speak clearly and formally, stating your name and reason for calling.', rule: 'Professional calls require clear, formal speech.' },
        { situation: 'Comforting a sad friend', bestApproach: 'Use a gentle, caring tone with supportive words.', options: ['Use a gentle, caring tone with supportive words.', 'Use a loud, cheerful voice.', 'Give a formal speech about emotions.'], answer: 'Use a gentle, caring tone with supportive words.', rule: 'Adapt your tone to the emotional situation.' },
      ],
    },
  },
  'grade-6': {
    'set-goals-discussion': {
      items: [
        { scenario: 'Your group is starting a discussion about a controversial topic. What should you do first?', options: ['Set discussion goals: what we want to figure out, how much time we have, and ground rules', 'Just start arguing your point right away', 'Let whoever is loudest lead'], answer: 'Set discussion goals: what we want to figure out, how much time we have, and ground rules', rule: 'Effective discussions start with clear goals and ground rules.' },
        { scenario: 'Your discussion group has 15 minutes. There are three questions to discuss. What is a good plan?', options: ['Spend about 4 minutes on each question with 3 minutes for final summary', 'Spend all 15 minutes on the first question', 'Don\'t plan — just see what happens'], answer: 'Spend about 4 minutes on each question with 3 minutes for final summary', rule: 'Setting time goals ensures all topics are covered.' },
        { scenario: 'During a discussion, one person keeps dominating. What should the group do?', options: ['Politely say, "Let\'s make sure everyone has a chance to share their perspective."', 'Let them keep talking', 'Talk over them'], answer: 'Politely say, "Let\'s make sure everyone has a chance to share their perspective."', rule: 'Groups should ensure equitable participation.' },
        { scenario: 'Your discussion goal was to determine the author\'s purpose. The group keeps drifting to plot summary. What should you do?', options: ['"These are good observations about the plot. How do they help us figure out the author\'s purpose?"', '"Stop talking about the plot."', 'Go along with the plot discussion.'], answer: '"These are good observations about the plot. How do they help us figure out the author\'s purpose?"', rule: 'Redirect discussion back to goals without dismissing contributions.' },
        { scenario: 'At the end of a discussion, what should the group do?', options: ['Summarize key ideas, identify areas of agreement and disagreement, and reflect on the discussion process', 'Just stop talking when time is up', 'Have the leader tell everyone the right answer'], answer: 'Summarize key ideas, identify areas of agreement and disagreement, and reflect on the discussion process', rule: 'Debrief discussions to consolidate learning.' },
        { scenario: 'You prepared for the discussion but your group members didn\'t. What should you do?', options: ['Share your preparation and model the kind of evidence-based discussion you want to have', 'Refuse to participate since they didn\'t prepare', 'Do all the talking yourself'], answer: 'Share your preparation and model the kind of evidence-based discussion you want to have', rule: 'Model good preparation and evidence use to elevate the group.' },
      ],
    },
    'interpret-diverse-media': {
      items: [
        { media: 'A documentary about coral reef destruction shows underwater footage of bleached coral alongside healthy coral.', question: 'How does the visual comparison strengthen the message?', answer: 'Seeing healthy and bleached coral side by side makes the impact of destruction vivid and undeniable.', rule: 'Visual comparisons help audiences understand the scale of a problem.' },
        { media: 'A podcast about immigration features interviews with three families who share their personal stories.', question: 'Why does the podcaster use personal stories instead of just statistics?', answer: 'Personal stories create emotional connection and help listeners understand the human impact beyond numbers.', rule: 'Different media techniques serve different purposes.' },
        { media: 'An infographic shows that screen time for teens has increased 50% in five years, using large bold numbers and a rising arrow graphic.', question: 'How do the design choices affect how you understand the information?', answer: 'The large numbers and rising arrow make the increase feel dramatic and urgent.', rule: 'Design choices in media influence how we interpret information.' },
        { media: 'A news article about a new park uses a photo of smiling children playing. A letter opposing the park uses a photo of the same area showing a crowded parking lot.', question: 'How do the different photos shape each message?', answer: 'Each source chose images that support their position — happy children favor the park, crowded parking opposes it.', rule: 'Media creators select images that support their message.' },
        { media: 'A historical speech is presented as text, as an audio recording, and as a video of the delivery. You notice the speaker\'s voice trembles during the audio and he pounds the podium in the video.', question: 'What do the audio and video versions add that the text alone cannot?', answer: 'They reveal the speaker\'s emotion and emphasis, showing passion that text cannot convey.', rule: 'Different formats reveal different aspects of the same message.' },
        { media: 'A website about climate change includes interactive maps, charts, and video testimonials.', question: 'Why might a website use multiple types of media together?', answer: 'Different media types reach different learning styles and together provide a more complete and convincing picture.', rule: 'Multiple media types create a stronger, more accessible message.' },
      ],
    },
    'evaluate-speaker-argument': {
      items: [
        { argument: 'A speaker says: "Social media should be banned for kids under 13. Studies show it increases anxiety, cyberbullying affects 37% of young users, and children\'s brains aren\'t developed enough to handle addictive algorithms."', question: 'Is this argument well-supported?', answer: 'Yes — the speaker provides research, a specific statistic, and a scientific reason.', evaluation: 'well-supported', rule: 'Strong arguments combine multiple types of evidence.' },
        { argument: 'A speaker says: "Pizza is the best food because everyone loves it and my mom makes the best pizza ever."', question: 'Evaluate the strength of this argument.', answer: 'Weak — "everyone loves it" is an overgeneralization, and "my mom makes the best" is personal opinion, not evidence.', evaluation: 'weak', rule: 'Overgeneralizations and personal anecdotes are weak evidence.' },
        { argument: 'A speaker says: "Schools should start later because a study from the University of Minnesota found that schools with later start times saw a 70% reduction in car accidents involving teen drivers."', question: 'What makes this evidence credible?', answer: 'It names a specific institution and provides a specific statistic from research.', evaluation: 'credible', rule: 'Credible evidence names sources and provides specific data.' },
        { argument: 'A speaker says: "Video games are terrible for kids. They cause violence, and everyone who plays them becomes aggressive."', question: 'What logical problems do you notice?', answer: 'The speaker uses an absolute claim ("everyone") with no evidence and assumes causation without proof.', evaluation: 'flawed', rule: 'Watch for absolute claims and unsupported cause-and-effect statements.' },
        { argument: 'A celebrity says: "You should buy this vitamin supplement because I take it every day and I feel great."', question: 'Is this a strong argument? Why or why not?', answer: 'No — a celebrity endorsement is not scientific evidence, and one person\'s experience doesn\'t prove it works.', evaluation: 'weak', rule: 'Celebrity endorsements and anecdotal evidence are not reliable proof.' },
        { argument: 'A speaker says: "Renewable energy is the future. Solar panel costs have dropped 89% since 2010, wind energy now employs 120,000 Americans, and 30 countries get over 20% of their electricity from renewables."', question: 'Evaluate the evidence.', answer: 'Strong — three specific, verifiable facts with numbers that support the claim from different angles.', evaluation: 'well-supported', rule: 'Multiple specific facts from different angles make a strong argument.' },
      ],
    },
    'present-claims-findings': {
      items: [
        { topic: 'Should schools require community service?', prepFramework: 'PREP', samplePresentation: 'Point: Schools should require community service for graduation. Reason: It builds empathy, teaches responsibility, and connects students to their communities. Example: A study of 500 high schools found students who completed service learning scored higher on civic engagement measures and reported greater life satisfaction. Schools in Maryland, which requires service, saw volunteering rates continue after graduation. Point again: Requiring community service prepares students to be engaged, responsible citizens.', criteria: ['clear claim', 'multiple reasons', 'specific evidence with source', 'real-world example', 'strong conclusion'], type: 'presentation-plan' },
        { scenario: 'You are presenting a claim. What is the best way to organize your findings?', options: ['State your claim, present evidence in logical order, address a counterargument, and conclude', 'List random facts with no organization', 'Start with your conclusion and end with your claim'], answer: 'State your claim, present evidence in logical order, address a counterargument, and conclude', rule: 'Organize claims logically: claim, evidence, counterargument, conclusion.' },
        { scenario: 'During your presentation, you make eye contact, vary your tone, and pause after key points. Why does this matter?', options: ['It makes your argument more persuasive and keeps the audience engaged', 'It doesn\'t matter — only the facts matter', 'It makes you look nervous'], answer: 'It makes your argument more persuasive and keeps the audience engaged', rule: 'Delivery skills make your argument more effective.' },
        { scenario: 'You want to present a counterargument in your presentation. Why is this effective?', options: ['It shows you\'ve considered other perspectives and makes your argument stronger', 'It confuses the audience', 'It weakens your own argument'], answer: 'It shows you\'ve considered other perspectives and makes your argument stronger', rule: 'Addressing counterarguments strengthens your credibility.' },
        { scenario: 'Your presentation includes the claim: "Our school should switch to solar energy." Which evidence sequence is most logical?', options: ['1) Current energy costs, 2) Solar savings data, 3) Environmental benefits, 4) Success story from another school', '1) Solar panels are cool, 2) My uncle has solar, 3) The sun is hot', '1) Conclusion, 2) Evidence, 3) Claim'], answer: '1) Current energy costs, 2) Solar savings data, 3) Environmental benefits, 4) Success story from another school', rule: 'Sequence evidence logically from problem to solution to example.' },
        { scenario: 'What should you do if an audience member challenges your claim with a point you hadn\'t considered?', options: ['Acknowledge the point, explain how it fits with or challenges your claim, and remain respectful', 'Ignore them', 'Get defensive and argue'], answer: 'Acknowledge the point, explain how it fits with or challenges your claim, and remain respectful', rule: 'Handle challenges respectfully and thoughtfully.' },
      ],
    },
  },
};

// ── Discussion Prompts by Grade ──

const DISCUSSION_PROMPTS = {
  'kindergarten': [
    { prompt: 'What is your favorite thing to do outside? Tell your partner.', stem: 'I like to ___ because...' },
    { prompt: 'If you could be any animal, what would you be? Why?', stem: 'I would be a ___ because...' },
    { prompt: 'What is your favorite book? What happens in it?', stem: 'My favorite book is ___ because...' },
  ],
  'grade-1': [
    { prompt: 'Should kids have pets? Why or why not?', stem: 'I think... because...' },
    { prompt: 'What makes someone a good friend? Give examples.', stem: 'A good friend is someone who...' },
    { prompt: 'If you could visit any place, where would you go?', stem: 'I would visit ___ because...' },
  ],
  'grade-2': [
    { prompt: 'Is it ever OK to break a rule? When?', stem: 'I think... because...' },
    { prompt: 'Should students help make classroom rules? Why?', stem: 'I believe... because...' },
    { prompt: 'What is more important: being smart or being kind?', stem: 'I think ___ is more important because...' },
  ],
  'grade-3': [
    { prompt: 'Should schools ban junk food? Support your answer with reasons.', stem: 'In my opinion... because...' },
    { prompt: 'Is it better to work alone or in a group? Give evidence.', stem: 'Based on my experience...' },
    { prompt: 'Should kids have homework on weekends?', stem: 'I believe... My evidence is...' },
  ],
  'grade-4': [
    { prompt: 'Should students be allowed to grade their own work? Why or why not?', stem: 'I argue that... because...' },
    { prompt: 'Is competition good or bad for students? Use examples.', stem: 'The evidence suggests...' },
    { prompt: 'Should recess count as physical education?', stem: 'My position is... I support this with...' },
  ],
  'grade-5': [
    { prompt: 'Should kids have social media accounts? Consider multiple perspectives.', stem: 'While some argue... I believe... because...' },
    { prompt: 'Is it ethical to keep animals in zoos? Use evidence.', stem: 'After considering both sides, I think...' },
    { prompt: 'Should standardized testing be eliminated? Defend your position.', stem: 'The evidence shows... Therefore...' },
  ],
  'grade-6': [
    { prompt: 'Should voting age be lowered to 16? Evaluate arguments on both sides.', stem: 'Proponents argue... However, opponents contend... I believe... because...' },
    { prompt: 'Does social media do more harm or good for society? Cite evidence.', stem: 'When evaluating the evidence...' },
    { prompt: 'Should schools teach financial literacy as a required subject?', stem: 'The data suggests... Furthermore...' },
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

  // Open-ended description exercises
  if (selected[0].type === 'open-describe') {
    return { type: 'open-describe', skill, grade, count: selected.length, instruction: 'Describe the topic using details. Try to include at least 2-3 details.', items: selected.map(i => ({ prompt: i.prompt, sampleAnswer: i.sampleAnswer, criteria: i.criteria })) };
  }
  // Discussion prompt exercises
  if (selected[0].type === 'discussion-prompt') {
    return { type: 'discussion-prompt', skill, grade, count: selected.length, instruction: 'Respond to the discussion topic using the sentence stem. Support your answer with reasons or evidence.', items: selected.map(i => ({ prompt: i.topic, stem: i.stemToUse, sampleResponse: i.sampleResponse, criteria: i.criteria })) };
  }
  // Presentation planning exercises
  if (selected[0].type === 'presentation-plan') {
    return { type: 'presentation-plan', skill, grade, count: selected.length, instruction: 'Plan a short presentation using the PREP framework (Point, Reason, Example, Point again).', items: selected.map(i => ({ topic: i.topic, framework: i.prepFramework, samplePresentation: i.samplePresentation, criteria: i.criteria })) };
  }
  // Listen-question (open-ended listening)
  if (selected[0].type === 'listen-question') {
    return { type: 'listen-respond', skill, grade, count: selected.length, instruction: 'Listen to the scenario and respond with a good answer or question.', items: selected.map(i => ({ prompt: i.scenario, answer: i.answer })) };
  }
  // Scenario with options (most common type)
  if (selected[0].scenario !== undefined && selected[0].options) {
    return { type: 'scenario-choice', skill, grade, count: selected.length, instruction: 'Choose the best response for each scenario.', items: selected.map(i => ({ prompt: i.scenario || i.task, options: i.options, answer: i.answer, rule: i.rule || '' })) };
  }
  // Task with options
  if (selected[0].task !== undefined && selected[0].options) {
    return { type: 'scenario-choice', skill, grade, count: selected.length, instruction: 'Choose the best answer.', items: selected.map(i => ({ prompt: i.task, options: i.options, answer: i.answer, rule: i.rule || '' })) };
  }
  // Partner-said with options (build-on-talk, clarification)
  if (selected[0].partnerSaid !== undefined && selected[0].options) {
    return { type: 'respond-to-partner', skill, grade, count: selected.length, instruction: 'Read what your partner said and choose the best response.', items: selected.map(i => ({ partnerSaid: i.partnerSaid, options: i.options, answer: i.answer, stem: i.stem || '', rule: i.rule || '' })) };
  }
  // Speaker-said with options (ask-clarification)
  if (selected[0].speakerSaid !== undefined && selected[0].options) {
    return { type: 'clarification', skill, grade, count: selected.length, instruction: 'What is the best clarifying question to ask?', items: selected.map(i => ({ speakerSaid: i.speakerSaid, options: i.options, answer: i.answer, rule: i.rule || '' })) };
  }
  // Passage-based comprehension
  if (selected[0].passage !== undefined && selected[0].question !== undefined) {
    return { type: 'listening-comprehension', skill, grade, count: selected.length, instruction: 'Read the passage (imagine you are listening) and answer the question.', items: selected.map(i => ({ passage: i.passage, question: i.question, answer: i.answer, rule: i.rule || '' })) };
  }
  // Story-based retell
  if (selected[0].story !== undefined) {
    return { type: 'retell', skill, grade, count: selected.length, instruction: 'Read the story (imagine listening to it) and answer the question.', items: selected.map(i => ({ story: i.story, question: i.question, answer: i.answer, retellCheck: i.retellCheck, rule: i.rule || '' })) };
  }
  // Formal vs informal register
  if (selected[0].register !== undefined) {
    return { type: 'register', skill, grade, count: selected.length, instruction: 'Identify whether the sentence is formal or informal.', items: selected.map(i => ({ prompt: i.sentence, answer: i.register, context: i.context, formal: i.formal || '', informal: i.informal || '' })) };
  }
  // Claim/evidence evaluation
  if (selected[0].claim !== undefined) {
    return { type: 'evaluate-evidence', skill, grade, count: selected.length, instruction: 'Evaluate the speaker\'s evidence.', items: selected.map(i => ({ claim: i.claim, evidence: i.evidence, question: i.question, answer: i.answer, hasEvidence: i.hasEvidence, rule: i.rule || '' })) };
  }
  // Argument evaluation
  if (selected[0].argument !== undefined) {
    return { type: 'evaluate-argument', skill, grade, count: selected.length, instruction: 'Evaluate the strength of the speaker\'s argument.', items: selected.map(i => ({ argument: i.argument, question: i.question, answer: i.answer, evaluation: i.evaluation, rule: i.rule || '' })) };
  }
  // Speech summarization
  if (selected[0].speech !== undefined) {
    return { type: 'summarize-speech', skill, grade, count: selected.length, instruction: 'Summarize the speaker\'s key points.', items: selected.map(i => ({ speech: i.speech, question: i.question, answer: i.answer, rule: i.rule || '' })) };
  }
  // Media interpretation
  if (selected[0].media !== undefined) {
    return { type: 'media-analysis', skill, grade, count: selected.length, instruction: 'Analyze how the media format affects the message.', items: selected.map(i => ({ media: i.media, question: i.question, answer: i.answer, rule: i.rule || '' })) };
  }
  // Original paraphrase
  if (selected[0].original !== undefined) {
    if (selected[0].options) {
      return { type: 'paraphrase-choice', skill, grade, count: selected.length, instruction: 'Choose the best paraphrase.', items: selected.map(i => ({ original: i.original, options: i.options, answer: i.answer, rule: i.rule || '' })) };
    }
    return { type: 'paraphrase', skill, grade, count: selected.length, instruction: 'Paraphrase in your own words.', items: selected.map(i => ({ original: i.original, question: i.question, answer: i.answer, rule: i.rule || '' })) };
  }
  // Context-based discussion questions
  if (selected[0].context !== undefined && selected[0].options) {
    return { type: 'discussion-skill', skill, grade, count: selected.length, instruction: 'Choose the best response or question for the discussion.', items: selected.map(i => ({ context: i.context, prompt: i.scenario || i.context, options: i.options, answer: i.answer, rule: i.rule || '' })) };
  }
  // Situation-based adapt speech
  if (selected[0].situation !== undefined) {
    return { type: 'adapt-speech', skill, grade, count: selected.length, instruction: 'Choose the best way to communicate in this situation.', items: selected.map(i => ({ situation: i.situation, options: i.options, answer: i.answer, rule: i.rule || '' })) };
  }
  // Role-based exercises
  if (selected[0].role !== undefined) {
    return { type: 'discussion-role', skill, grade, count: selected.length, instruction: 'Answer based on your assigned discussion role.', items: selected.map(i => ({ role: i.role, responsibility: i.responsibility, prompt: i.scenario, options: i.options, answer: i.answer, rule: i.rule || '' })) };
  }
  // Fragment expansion
  if (selected[0].fragment !== undefined) {
    return { type: 'expand-sentence', skill, grade, count: selected.length, instruction: 'Expand the fragment into a complete sentence.', items: selected.map(i => ({ prompt: i.fragment, answer: i.correction, rule: i.rule })) };
  }
  // Model response (no options, just model)
  if (selected[0].type === 'model-response') {
    return { type: 'model-response', skill, grade, count: selected.length, instruction: 'Read the model response and practice responding similarly.', items: selected.map(i => ({ partnerSaid: i.partnerSaid || i.classmateSaid, goodResponse: i.goodResponse, rule: i.rule })) };
  }

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
}

// ── Public API ──

class SpeakingListening {
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

  getDiscussionPrompt(grade) {
    const prompts = DISCUSSION_PROMPTS[grade];
    if (!prompts) return { error: `No discussion prompts for ${grade}.` };
    const p = pick(prompts, 1)[0];
    const stems = pick(Object.values(TALK_STEMS).flat(), 3);
    return { ...p, accountableTalkStems: stems };
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const discussion = DISCUSSION_PROMPTS[grade] ? pick(DISCUSSION_PROMPTS[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, discussionPrompt: discussion,
      lessonPlan: {
        warmUp: discussion ? `Discussion: "${discussion.prompt}" — Use stem: ${discussion.stem}` : 'Discuss a topic with a partner using accountable talk.',
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Practice this speaking or listening skill in a real conversation today.',
      },
    };
  }
}

module.exports = SpeakingListening;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const sl = new SpeakingListening();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) sl.setGrade(id, grade);
        out({ action: 'start', profile: sl.getProfile(id), nextSkills: sl.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(sl.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'kindergarten';
        if (skill) { out(sl.generateExercise(grade, skill, 5)); }
        else { const n = sl.getNextSkills(id, 1).next; out(n.length ? sl.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(sl.checkAnswer(type, expected, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(sl.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(sl.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(sl.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(sl.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? sl.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(sl.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(sl.setGrade(id, g)); break; }
      case 'discussion-prompt': { const [, g] = args; if (!g) throw new Error('Usage: discussion-prompt <grade>'); out(sl.getDiscussionPrompt(g)); break; }
      default: out({ usage: 'node speaking-listening.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','discussion-prompt'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
