// eClaw ELA Reading: Literature Interactive Tutor (K-6). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ela-reading-literature');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'story-elements': ['character-identification', 'setting-identification', 'retell-events'],
    'comprehension': ['problem-solution-basic', 'picture-clues'],
  },
  'grade-1': {
    'story-elements': ['character-description', 'setting-importance', 'key-details-retell'],
    'comprehension': ['problem-solution', 'text-to-self'],
  },
  'grade-2': {
    'character': ['character-response'],
    'theme': ['lesson-moral'],
    'point-of-view': ['character-viewpoints'],
    'structure': ['beginning-middle-end'],
    'vocabulary': ['context-vocabulary'],
  },
  'grade-3': {
    'character': ['character-traits-motives'],
    'theme': ['theme-message'],
    'point-of-view': ['narrator-vs-character-pov'],
    'structure': ['chapters-scenes-stanzas'],
    'figurative-language': ['literal-vs-figurative'],
    'comparing': ['compare-same-author'],
  },
  'grade-4': {
    'theme': ['theme-with-evidence'],
    'character': ['character-depth'],
    'point-of-view': ['first-vs-third-person'],
    'figurative-language': ['simile-metaphor-idiom'],
    'structure': ['structure-analysis'],
    'comparing': ['compare-themes-genres'],
  },
  'grade-5': {
    'theme': ['multiple-themes'],
    'character': ['character-comparison'],
    'point-of-view': ['narrator-influence'],
    'figurative-language': ['personification-hyperbole'],
    'structure': ['structure-fit'],
    'comparing': ['compare-across-cultures'],
  },
  'grade-6': {
    'theme': ['theme-development'],
    'character': ['character-development'],
    'point-of-view': ['author-pov-craft'],
    'figurative-language': ['word-choice-tone'],
    'structure': ['structural-analysis'],
    'comparing': ['genre-comparison'],
  },
};

// ── Content Banks ──

const EXERCISE_BANKS = {
  'kindergarten': {
    'character-identification': {
      items: [
        { passage: 'Bella the bunny hopped to the garden. She found a big carrot and shared it with her friend Max the mouse.', question: 'Who are the characters in this story?', answer: 'Bella the bunny and Max the mouse', hint: 'Look for names of people or animals.' },
        { passage: 'Tom the turtle walked slowly to school. His teacher, Mrs. Owl, smiled at him.', question: 'Who are the characters?', answer: 'Tom the turtle and Mrs. Owl', hint: 'Look for who the story is about.' },
        { passage: 'A little girl named Rosa picked flowers. Her dog Biscuit ran through the field beside her.', question: 'Who are the characters?', answer: 'Rosa and Biscuit', hint: 'Who is in the story?' },
        { passage: 'King Leo the lion sat on his rock. A small bird named Pip landed on his mane.', question: 'Who are the characters?', answer: 'King Leo the lion and Pip the bird', hint: 'Look for the names.' },
        { passage: 'Sam and his sister Mia built a sandcastle. Their dad helped them dig.', question: 'Who are the characters?', answer: 'Sam, Mia, and their dad', hint: 'Count all the people in the story.' },
        { passage: 'Farmer Brown fed the chickens. His cow Daisy mooed for breakfast too.', question: 'Who are the characters?', answer: 'Farmer Brown and Daisy the cow', hint: 'Look for names.' },
      ],
    },
    'setting-identification': {
      items: [
        { passage: 'The waves crashed on the sand. Lily built a castle near the water while seagulls flew overhead.', question: 'Where does this story take place?', answer: 'the beach', hint: 'Think about where you see waves and sand.' },
        { passage: 'The stars twinkled above the tent. Jake heard an owl hoot in the dark forest.', question: 'Where does this story happen?', answer: 'a campsite in the forest at night', hint: 'Think about tents and stars.' },
        { passage: 'Books lined the tall shelves. Emma whispered as she picked a picture book to read.', question: 'Where is Emma?', answer: 'the library', hint: 'Where do you find lots of books on shelves?' },
        { passage: 'Snow covered everything. Ben put on his mittens and ran outside to play.', question: 'When does this story happen?', answer: 'winter', hint: 'What season has snow?' },
        { passage: 'Desks were in neat rows. The bell rang and the children sat down.', question: 'Where does this story take place?', answer: 'a school classroom', hint: 'Where do you find desks and bells?' },
        { passage: 'Animals were in cages and pens. Mia watched the monkeys swing from branch to branch.', question: 'Where is Mia?', answer: 'the zoo', hint: 'Where do you see many animals in cages?' },
      ],
    },
    'retell-events': {
      items: [
        { passage: 'First, the cat climbed the tree. Then it got stuck on a branch. Finally, a firefighter helped it down.', question: 'What happened first, next, and last?', answer: 'First the cat climbed the tree, then it got stuck, then a firefighter helped it down', hint: 'Look for words like first, then, finally.' },
        { passage: 'Pam woke up early. She ate cereal for breakfast. Then she walked to school.', question: 'What did Pam do in order?', answer: 'She woke up, ate cereal, and walked to school', hint: 'What happened first, second, third?' },
        { passage: 'The egg cracked open. A tiny chick came out. The chick said peep peep.', question: 'What happened in order?', answer: 'The egg cracked, a chick came out, and it said peep peep', hint: 'Follow the order of events.' },
        { passage: 'Ben found a seed. He planted it in dirt. He watered it every day. A flower grew.', question: 'What happened in order?', answer: 'Ben found a seed, planted it, watered it, and a flower grew', hint: 'Tell each thing that happened.' },
        { passage: 'The dog ran to the park. It chased a ball. Then it took a nap under a tree.', question: 'Retell what happened.', answer: 'The dog ran to the park, chased a ball, and napped under a tree', hint: 'Say what happened first, next, last.' },
      ],
    },
    'problem-solution-basic': {
      items: [
        { passage: 'The ball rolled into the pond. Rosie could not reach it. Her dad used a long stick to get it back.', question: 'What was the problem and how was it solved?', answer: 'The ball was stuck in the pond. Dad used a stick to get it back.', hint: 'What went wrong? Who fixed it?' },
        { passage: 'Tim was lost in the store. He was scared. A worker helped him find his mom.', question: 'What was the problem and solution?', answer: 'Tim was lost. A worker helped him find his mom.', hint: 'What went wrong? How did it get better?' },
        { passage: 'It started to rain during the picnic. Everyone got wet. Mom opened a big umbrella.', question: 'What was the problem and solution?', answer: 'Rain started at the picnic. Mom opened an umbrella.', hint: 'What was the trouble? What fixed it?' },
        { passage: 'The puppy was hungry but the bowl was empty. Jess poured food into the bowl.', question: 'What was the problem and solution?', answer: 'The puppy had no food. Jess filled the bowl.', hint: 'What did the puppy need? Who helped?' },
        { passage: 'Mia could not find her shoe. She looked under the bed and found it there.', question: 'What was the problem and solution?', answer: 'Mia lost her shoe. She looked under the bed and found it.', hint: 'What was missing? How was it found?' },
      ],
    },
    'picture-clues': {
      items: [
        { passage: 'The boy smiled and held up a shiny gold cup. People around him were clapping.', question: 'How does the boy probably feel? What clues tell you?', answer: 'He feels happy or proud because he is smiling and people are clapping', hint: 'Look at what people do with their faces and bodies.' },
        { passage: 'The girl sat alone on the bench. Her head was down and her eyes looked red.', question: 'How does the girl feel? What clues tell you?', answer: 'She feels sad because her head is down and eyes look red', hint: 'Think about what people look like when they are sad.' },
        { passage: 'Dark clouds filled the sky. The trees were bending in the wind. Leaves flew everywhere.', question: 'What is the weather like? What clues tell you?', answer: 'It is very windy and stormy because of dark clouds, bending trees, and flying leaves', hint: 'Look at what the sky and trees are doing.' },
        { passage: 'The cat arched its back, puffed its tail, and hissed at the dog.', question: 'How does the cat feel? What clues tell you?', answer: 'The cat is scared or angry because it arched its back, puffed its tail, and hissed', hint: 'What do cats do when they are afraid?' },
        { passage: 'The table had a cake with candles. Balloons hung from the walls. Kids wore party hats.', question: 'What is happening? What clues tell you?', answer: 'It is a birthday party because there is cake with candles, balloons, and party hats', hint: 'Think about when you see cake and balloons together.' },
      ],
    },
  },
  'grade-1': {
    'character-description': {
      items: [
        { passage: 'Anna always helped her friends carry their books. When someone was sad, she would sit with them and listen.', question: 'What is Anna like? Use details from the story.', answer: 'Anna is kind and caring because she helps carry books and listens when friends are sad', hint: 'Think about what Anna does for others.' },
        { passage: 'Jake told the teacher even though his friends would be upset. He said, "I have to tell the truth."', question: 'What kind of person is Jake?', answer: 'Jake is honest because he tells the truth even when it is hard', hint: 'What does Jake believe is important?' },
        { passage: 'Milo the monkey swung from tree to tree. He made funny faces and told jokes to the other animals.', question: 'Describe Milo.', answer: 'Milo is playful and funny because he swings around and tells jokes', hint: 'What does Milo do that shows his personality?' },
        { passage: 'Rosa tried to climb the wall ten times. Each time she fell, she got up and tried again.', question: 'What word describes Rosa?', answer: 'Rosa is determined because she keeps trying even after falling', hint: 'What does it mean when someone never gives up?' },
        { passage: 'Luis spoke softly and always said please and thank you. He held doors open for people.', question: 'Describe Luis.', answer: 'Luis is polite and respectful because he uses manners and helps others', hint: 'How does Luis treat people?' },
      ],
    },
    'setting-importance': {
      items: [
        { passage: 'The desert was hot and dry. Water was hard to find. The lizard hid under a rock to stay cool.', question: 'Why is the setting important to this story?', answer: 'The hot desert makes it hard to find water, so the lizard has to hide to survive', hint: 'How does the place affect what happens?' },
        { passage: 'It was the last day of school. Streamers hung in the hallway and kids were laughing and signing yearbooks.', question: 'Why does the setting matter?', answer: 'It is the last day of school so everyone is celebrating and saying goodbye', hint: 'How does the time affect the mood?' },
        { passage: 'Snow piled up outside. The roads were closed. The family stayed inside and played games by the fire.', question: 'How does the setting affect the story?', answer: 'The heavy snow keeps the family inside so they play games together', hint: 'What does the snow make the family do?' },
        { passage: 'The dark cave was cold and dripping. Bat sounds echoed from deep inside.', question: 'How does the setting make you feel?', answer: 'The dark cold cave feels scary and mysterious because of the dripping and bat sounds', hint: 'What mood does this place create?' },
        { passage: 'The amusement park had bright lights, loud music, and the smell of popcorn. Kids screamed with joy on the rides.', question: 'What feeling does this setting create?', answer: 'The setting feels exciting and fun with bright lights, music, and happy kids', hint: 'What do you see, hear, and smell?' },
      ],
    },
    'key-details-retell': {
      items: [
        { passage: 'The fox wanted the grapes on the vine. He jumped and jumped but could not reach them. He walked away and said, "Those grapes are probably sour anyway."', question: 'Retell the key details of this story.', answer: 'A fox wanted grapes but could not reach them, so he said they were probably sour', hint: 'What did the character want? What happened? What did he say?' },
        { passage: 'Little Red Hen found some wheat seeds. She asked her friends to help plant them, but nobody would. She did all the work herself.', question: 'What are the key details?', answer: 'Little Red Hen found wheat seeds, asked for help, nobody helped, so she did it herself', hint: 'Who? What did she find? What happened?' },
        { passage: 'A boy cried "Wolf!" to trick the villagers. They came running but there was no wolf. He did it again. When a real wolf came, nobody believed him.', question: 'Retell the important details.', answer: 'A boy lied about a wolf twice. When a real wolf came, nobody believed him', hint: 'What trick did the boy play? What happened in the end?' },
        { passage: 'Maria found a lost puppy in the park. She took it home and made posters. The next day the owner came to get the puppy.', question: 'What are the key details?', answer: 'Maria found a lost puppy, made posters, and the owner came the next day', hint: 'What problem did Maria find? What did she do?' },
        { passage: 'Jack traded his cow for magic beans. His mom threw them out. A giant beanstalk grew overnight.', question: 'Retell the key details.', answer: 'Jack traded his cow for beans, his mom threw them away, and a beanstalk grew', hint: 'What did Jack do? What happened to the beans?' },
      ],
    },
    'problem-solution': {
      items: [
        { passage: 'The three pigs needed houses. The wolf blew down the straw and stick houses. The brick house was too strong for the wolf.', question: 'What was the problem and how was it solved?', answer: 'The wolf blew down weak houses. The brick house was strong enough to keep the pigs safe.', hint: 'What danger did the pigs face? Which house worked?' },
        { passage: 'Goldilocks was lost in the woods and hungry. She found a cottage with three bowls of porridge and ate the one that was just right.', question: 'What was the problem and solution?', answer: 'Goldilocks was lost and hungry. She found porridge in a cottage and ate it.', hint: 'What did Goldilocks need? How did she get it?' },
        { passage: 'The class needed money for a field trip. They decided to have a bake sale. They raised enough money in one day.', question: 'What was the problem and how was it solved?', answer: 'The class needed money. They held a bake sale and raised enough.', hint: 'What did they need? What plan did they make?' },
        { passage: 'The boat had a hole and was filling with water. Captain Cal stuffed his jacket into the hole to stop the leak.', question: 'What was the problem and solution?', answer: 'The boat had a hole filling with water. Captain Cal plugged it with his jacket.', hint: 'What was wrong with the boat? How was it fixed?' },
        { passage: 'Emma was afraid of the dark. Her mom gave her a small nightlight shaped like a star. Emma felt safe and fell asleep.', question: 'What was the problem and solution?', answer: 'Emma was afraid of the dark. A nightlight from her mom helped her feel safe.', hint: 'What scared Emma? What helped?' },
      ],
    },
    'text-to-self': {
      items: [
        { passage: 'On the first day at a new school, Leo felt butterflies in his stomach. He did not know anyone.', question: 'Can you connect this to your own life? How might Leo feel?', answer: 'Leo feels nervous and scared because being new is hard. This is like when I started something new and did not know anyone.', hint: 'Have you ever been new somewhere?' },
        { passage: 'Sara worked on her painting all week. When the art show came, she felt proud to see it hanging on the wall.', question: 'How does Sara feel? Have you ever felt like Sara?', answer: 'Sara feels proud because she worked hard on something. This is like when I finished something difficult and felt good about it.', hint: 'Have you ever worked hard on something and felt proud?' },
        { passage: 'Kai shared his last cookie with his friend even though he was still hungry.', question: 'What would you do in this situation?', answer: 'Kai was generous by sharing even though he wanted more. I might share too because friends are important.', hint: 'Would you share your last treat? Why or why not?' },
        { passage: 'When the storm knocked out the power, the family lit candles and told stories together.', question: 'Can you connect this to something in your life?', answer: 'The family made the best of a bad situation. This reminds me of a time when plans changed and we had fun anyway.', hint: 'Has something unexpected ever turned out fun?' },
        { passage: 'The puppy chewed up Nate\'s favorite shoe. Nate was upset but then the puppy licked his face and he could not stay mad.', question: 'Can you relate to how Nate feels?', answer: 'Nate went from upset to forgiving because the puppy was sweet. I have felt that way when someone I love does something annoying but then makes me smile.', hint: 'Have you ever been mad but then forgiven someone?' },
      ],
    },
  },
  'grade-2': {
    'character-response': {
      items: [
        { passage: 'When the bully knocked over her blocks, Maya took a deep breath. She calmly said, "That was not nice. Please stop."', question: 'How did Maya respond to the problem? What does this show about her?', answer: 'Maya stayed calm and spoke up instead of getting angry. This shows she is brave and handles problems with words.', hint: 'What did Maya do instead of fighting or crying?' },
        { passage: 'James dropped his ice cream cone on the ground. His lip trembled, but then he laughed and said, "At least the ants will have a feast!"', question: 'How did James react? What does this tell us?', answer: 'James was sad at first but then found humor in the situation. This shows he has a positive attitude.', hint: 'Did James stay sad or change? What did he do?' },
        { passage: 'When Zoe did not make the soccer team, she practiced every day for a month and tried out again.', question: 'How did Zoe respond to not making the team?', answer: 'Zoe practiced hard and tried again instead of giving up. This shows she is determined and resilient.', hint: 'What did Zoe do after she was disappointed?' },
        { passage: 'The new girl sat alone at lunch. Without anyone asking, Priya picked up her tray and went to sit with her.', question: 'How did Priya respond to seeing the new girl alone?', answer: 'Priya chose to sit with the new girl on her own. This shows she is kind and thoughtful.', hint: 'What did Priya do? Did anyone tell her to do it?' },
        { passage: 'When his baby sister knocked over his tower, Ben wanted to yell. Instead, he said, "It\'s okay. Let\'s build together."', question: 'How did Ben respond?', answer: 'Ben controlled his anger and invited his sister to build with him. This shows patience and kindness.', hint: 'What did Ben want to do? What did he actually do?' },
      ],
    },
    'lesson-moral': {
      items: [
        { passage: 'The tortoise raced the hare. The hare ran fast then took a nap. The tortoise kept going slowly and steadily and won the race.', question: 'What is the lesson or moral of this story?', answer: 'Slow and steady wins the race. Hard work and not giving up matters more than being fast.', hint: 'Who won? Why did they win?' },
        { passage: 'A dog carried a bone across a bridge. He saw his reflection and snapped at it, dropping his real bone into the river.', question: 'What lesson does this fable teach?', answer: 'Be happy with what you have. Being greedy can make you lose everything.', hint: 'What happened because the dog wanted more?' },
        { passage: 'The lion was caught in a net. A tiny mouse chewed through the ropes and freed him. The lion had once let the mouse go.', question: 'What is the moral?', answer: 'Even small friends can be a big help. Kindness is always worth it.', hint: 'How did the lion\'s earlier kindness help him?' },
        { passage: 'The boy who cried wolf tricked the villagers twice. When a real wolf came, nobody believed him.', question: 'What is the moral of this story?', answer: 'If you lie too much, nobody will believe you when you tell the truth.', hint: 'Why did nobody come the third time?' },
        { passage: 'The ant worked hard all summer saving food. The grasshopper played all day. When winter came, the ant had food but the grasshopper was hungry.', question: 'What lesson does this story teach?', answer: 'It is important to plan ahead and work hard. If you only play, you will not be prepared.', hint: 'Who was ready for winter? Why?' },
      ],
    },
    'character-viewpoints': {
      items: [
        { passage: 'Mom said the move to a new city would be a great adventure. But Cody frowned and said he did not want to leave his friends.', question: 'How do the two characters feel differently about the same event?', answer: 'Mom is excited and sees the move as an adventure. Cody is sad because he will miss his friends.', hint: 'What does each character think about moving?' },
        { passage: 'Dad said the puppy was too much work. But Lily said she would feed it, walk it, and clean up after it every single day.', question: 'How do Dad and Lily see things differently?', answer: 'Dad thinks the puppy will be too much work. Lily thinks she can handle the responsibility.', hint: 'What is each person worried or excited about?' },
        { passage: 'The big brother wanted to watch the scary movie. The little sister covered her eyes and said it was too frightening.', question: 'How are the viewpoints different?', answer: 'The big brother enjoys scary movies. The little sister finds them too frightening.', hint: 'How does each one feel about the same movie?' },
        { passage: 'The farmer was happy about the rain because his crops needed water. The children were sad because they could not play outside.', question: 'Why do the farmer and children feel differently about rain?', answer: 'The farmer likes rain because it helps his crops grow. The children dislike it because they cannot play outside.', hint: 'How does rain affect each group?' },
        { passage: 'Grandma loved the quiet of the countryside. Her grandson wished there were more stores and things to do.', question: 'How do their viewpoints differ?', answer: 'Grandma values peace and quiet. Her grandson wants excitement and things to do.', hint: 'What does each person like or dislike about the countryside?' },
      ],
    },
    'beginning-middle-end': {
      items: [
        { passage: 'A dragon stole the village\'s treasure. A brave girl named Kira went on a journey to get it back. She outsmarted the dragon and returned the treasure.', question: 'Identify the beginning, middle, and end.', answer: 'Beginning: A dragon stole treasure. Middle: Kira went on a journey. End: She outsmarted the dragon and returned the treasure.', hint: 'What starts the story? What is the main action? How does it end?' },
        { passage: 'Tim wanted to win the spelling bee. He studied every night for weeks. On the day of the contest, he won first place.', question: 'What happens in the beginning, middle, and end?', answer: 'Beginning: Tim wanted to win. Middle: He studied every night. End: He won first place.', hint: 'What is the goal, the effort, and the result?' },
        { passage: 'A seed fell into the ground. Rain and sun helped it grow. It became a beautiful tall sunflower.', question: 'Describe the beginning, middle, and end.', answer: 'Beginning: A seed fell. Middle: Rain and sun helped it grow. End: It became a sunflower.', hint: 'What happened first, during, and at the end?' },
        { passage: 'The baby bird fell from the nest. Its mother flew down and called to it. The baby flapped its wings and flew back up.', question: 'What are the three parts?', answer: 'Beginning: The baby bird fell. Middle: The mother flew down. End: The baby flew back up.', hint: 'What is the problem, what happens next, and the ending?' },
        { passage: 'Two friends had a big fight about a toy. They did not talk for a whole day. Finally they apologized and decided to share.', question: 'Identify the beginning, middle, and end.', answer: 'Beginning: Friends fought over a toy. Middle: They stopped talking. End: They apologized and shared.', hint: 'What started the trouble? What made it worse? How was it fixed?' },
      ],
    },
    'context-vocabulary': {
      items: [
        { passage: 'The enormous elephant could barely fit through the zoo gate. It was the biggest animal anyone had ever seen.', question: 'What does "enormous" mean? What clues help you?', answer: 'Enormous means very big. The clues are "barely fit" and "biggest animal."', hint: 'Look at the words around "enormous" for clues.' },
        { passage: 'Mia was famished after the long hike. She ate three sandwiches and a whole bag of chips.', question: 'What does "famished" mean?', answer: 'Famished means very hungry. The clue is that she ate a lot of food.', hint: 'How much did Mia eat? What does that tell you?' },
        { passage: 'The timid kitten hid under the couch whenever someone new came to visit.', question: 'What does "timid" mean?', answer: 'Timid means shy or fearful. The clue is that the kitten hides from new people.', hint: 'What does the kitten do? Why might it hide?' },
        { passage: 'Jake was thrilled when he found out he made the team. He jumped up and down and cheered.', question: 'What does "thrilled" mean?', answer: 'Thrilled means very happy or excited. The clue is that Jake jumped and cheered.', hint: 'How did Jake act? What feeling makes you jump and cheer?' },
        { passage: 'The ancient castle had crumbling walls and was covered in moss. It had been there for hundreds of years.', question: 'What does "ancient" mean?', answer: 'Ancient means very old. The clues are crumbling walls and hundreds of years.', hint: 'What tells you the castle has been there a long time?' },
      ],
    },
  },
  'grade-3': {
    'character-traits-motives': {
      items: [
        { passage: 'Even though everyone told her the mountain was too dangerous, Nyla packed her bag and started the climb. She had promised her grandmother she would bring back the special flower that grew at the top.', question: 'What are Nyla\'s character traits and motivations?', answer: 'Nyla is brave and determined. She is motivated by her promise to her grandmother and love for her family.', hint: 'Why does Nyla climb despite the danger?' },
        { passage: 'Marcus noticed the younger kids had no one to play with at recess. Every day he organized games and made sure everyone was included.', question: 'What traits does Marcus show? Why does he do this?', answer: 'Marcus is caring and a natural leader. He is motivated by wanting everyone to feel included.', hint: 'What does Marcus do and why?' },
        { passage: 'The fox pretended to be hurt so the crow would come closer. When the crow dropped her cheese to help, the fox grabbed it and ran.', question: 'What motivates the fox? What traits does the fox have?', answer: 'The fox is clever and sneaky. He is motivated by wanting the cheese and tricks the crow to get it.', hint: 'Why did the fox pretend to be hurt?' },
        { passage: 'Lena spent her allowance on art supplies for the community center instead of buying the video game she wanted.', question: 'What does this tell us about Lena?', answer: 'Lena is generous and selfless. She values helping others more than getting things for herself.', hint: 'What did Lena give up? What did she choose instead?' },
        { passage: 'When the coach asked who wanted to try the hardest position, nobody raised their hand. Then Dev slowly raised his, even though his face was pale.', question: 'What traits does Dev show?', answer: 'Dev is courageous even though he is nervous. He steps up when nobody else will.', hint: 'Was Dev confident or scared? What did he do anyway?' },
      ],
    },
    'theme-message': {
      items: [
        { passage: 'The oak tree laughed at the thin reed for bending in every breeze. But when a great storm came, the oak snapped and fell while the reed bent and survived.', question: 'What is the theme or message of this story?', answer: 'Being flexible and adaptable is a strength. Those who are too rigid may break under pressure.', hint: 'Who survived the storm? Why?' },
        { passage: 'Sara wanted to be the fastest runner so badly that she tripped others during races. Soon nobody would race with her at all.', question: 'What is the theme?', answer: 'Winning is not worth it if you hurt others. Cheating leads to losing what matters most — friends.', hint: 'What did Sara gain? What did she lose?' },
        { passage: 'The three brothers each received one stick from their father. He showed that one stick breaks easily, but three sticks bound together cannot be broken.', question: 'What is the message?', answer: 'There is strength in unity. People are stronger when they work together than when they are alone.', hint: 'What was different about the sticks together versus apart?' },
        { passage: 'Mina told a lie to avoid trouble. But the lie grew bigger as she had to tell more lies to cover the first one. Finally, the truth came out and the trouble was much worse.', question: 'What is the theme?', answer: 'Honesty is the best policy. One lie leads to more lies and makes things worse.', hint: 'What happened because of the first lie?' },
        { passage: 'The plain little bird had the most beautiful song in the forest. The colorful parrot could only squawk. All the animals loved listening to the little bird.', question: 'What is the message?', answer: 'True beauty comes from what is inside, not from outward appearance. Do not judge by looks.', hint: 'Which bird was admired? Why?' },
      ],
    },
    'narrator-vs-character-pov': {
      items: [
        { passage: 'I looked at the broken vase and felt terrible. Mom was going to be so upset. I decided to tell her the truth.', question: 'Who is telling this story? How do you know?', answer: 'A character in the story is the narrator (first person). We know because of words like "I" and "me."', hint: 'What pronoun does the narrator use?' },
        { passage: 'Tommy thought the surprise party was the best idea ever. He did not know that his sister already knew about it and was just pretending.', question: 'Who is telling this story? What does the narrator know that Tommy does not?', answer: 'A narrator outside the story (third person) is telling it. The narrator knows the sister is pretending, but Tommy does not.', hint: 'Can the narrator see inside both characters\' minds?' },
        { passage: 'I was sure I had studied enough for the test. The teacher smiled as she handed back my paper. I had gotten every answer right.', question: 'Whose point of view is this? Can we trust what the narrator tells us?', answer: 'This is first person from the student\'s point of view. We only know what this character knows and feels.', hint: 'Whose thoughts and feelings do we hear?' },
        { passage: 'Everyone in the village thought the old woman was mean. But deep down, she was just lonely and missed her family who had moved far away.', question: 'How is the narrator\'s point of view different from the villagers\'?', answer: 'The narrator knows the old woman is actually lonely, while the villagers only think she is mean.', hint: 'What do the villagers think? What does the narrator reveal?' },
        { passage: 'Alex thought the dog was scary. But the dog was actually wagging its tail and hoping for a new friend.', question: 'How is Alex\'s viewpoint different from what is really happening?', answer: 'Alex thinks the dog is scary, but the narrator tells us the dog is friendly and wants to play.', hint: 'What does Alex think? What does the narrator tell us is true?' },
      ],
    },
    'chapters-scenes-stanzas': {
      items: [
        { passage: 'Chapter 1 shows a happy family. Chapter 2 introduces a problem when Dad loses his job. Chapter 3 shows the family working together to solve the problem.', question: 'How do these chapters build on each other?', answer: 'Chapter 1 sets up the normal life, Chapter 2 introduces conflict, and Chapter 3 shows the resolution. Each chapter builds tension then resolves it.', hint: 'What does each chapter add to the story?' },
        { passage: 'In the first stanza, the poet describes a bright sunny day. In the second stanza, clouds roll in. In the third stanza, rain falls.', question: 'How do the stanzas work together?', answer: 'The stanzas show a change in weather from sunny to rainy, building a mood shift from happy to gloomy.', hint: 'How does the weather change across stanzas?' },
        { passage: 'Scene 1 takes place in the castle throne room. Scene 2 moves to the dark forest. Scene 3 returns to the castle.', question: 'Why does the setting change between scenes?', answer: 'The scenes follow the character\'s journey out of the castle and back. The structure shows departure and return.', hint: 'Where does each scene happen? What pattern do you see?' },
        { passage: 'The first part of the story is told in the present. Then a flashback shows what happened last summer. The story returns to the present at the end.', question: 'How is this story structured?', answer: 'It uses a flashback structure. The present frames the story while the middle explains the past. This helps us understand why things are happening now.', hint: 'When does each part take place?' },
        { passage: 'Part 1 tells the story from the girl\'s point of view. Part 2 tells the same events from her brother\'s point of view.', question: 'Why might the author split the story this way?', answer: 'Showing two viewpoints helps readers understand both sides and see how the same event can feel different to different people.', hint: 'Whose eyes do we see through in each part?' },
      ],
    },
    'literal-vs-figurative': {
      items: [
        { passage: 'When Mom heard the good news, she was on cloud nine all day.', question: 'Is "on cloud nine" literal or figurative? What does it mean?', answer: 'Figurative. It means extremely happy, not actually sitting on a cloud.', hint: 'Is Mom really on a cloud?' },
        { passage: 'The math test was a piece of cake for Jordan.', question: 'Is "piece of cake" literal or figurative? What does it mean?', answer: 'Figurative. It means the test was very easy, not an actual piece of cake.', hint: 'Did Jordan eat cake during the test?' },
        { passage: 'The snow blanketed the entire town overnight.', question: 'Is "blanketed" used literally or figuratively?', answer: 'Figuratively. It means the snow covered the town like a blanket would, not that an actual blanket was used.', hint: 'Did someone put a blanket on the town?' },
        { passage: 'After running the race, Tasha drank an entire bottle of water.', question: 'Is this sentence literal or figurative?', answer: 'Literal. Tasha actually drank a whole bottle of water. This is meant exactly as stated.', hint: 'Could this actually happen in real life as described?' },
        { passage: 'Mr. Garcia has a heart of gold.', question: 'Is "heart of gold" literal or figurative? What does it mean?', answer: 'Figurative. It means he is very kind and generous, not that his heart is made of gold.', hint: 'Can a heart really be made of gold?' },
        { passage: 'Time flies when you are having fun.', question: 'Is "time flies" literal or figurative?', answer: 'Figurative. It means time seems to pass quickly, not that time has wings and can fly.', hint: 'Can time actually fly?' },
      ],
    },
    'compare-same-author': {
      items: [
        { passage: 'In Story A by the same author, a shy mouse learns to speak up and saves his family. In Story B, a quiet deer finds courage to lead the herd through a storm.', question: 'How are these two stories similar?', answer: 'Both stories feature quiet, shy animal characters who find courage when their families need them. The author uses a similar theme about inner strength.', hint: 'What do the main characters have in common? What theme repeats?' },
        { passage: 'Book 1 is set in a small seaside village where a boy befriends an old fisherman. Book 2 is set in a mountain town where a girl befriends an elderly woodcarver.', question: 'Compare the settings and relationships in these books.', answer: 'Both books are set in small, close-knit communities and feature a young person forming a bond with an older mentor figure.', hint: 'What kind of places are these? Who are the main relationships between?' },
        { passage: 'In one story, the character solves the mystery by talking to neighbors. In the other, the character solves the problem by listening carefully to what people say.', question: 'What does this author value based on both stories?', answer: 'The author values communication and listening as ways to solve problems. Both characters use people skills rather than force.', hint: 'How do both characters solve their problems?' },
        { passage: 'Story A ends with the family moving to a new home and feeling hopeful. Story B ends with the friends reuniting after a long time apart and feeling grateful.', question: 'How are the endings similar?', answer: 'Both endings are hopeful and positive. They focus on new beginnings and the importance of relationships.', hint: 'What emotion do both endings share?' },
      ],
    },
  },
  'grade-4': {
    'theme-with-evidence': {
      items: [
        { passage: 'Miguel was the smallest player on the basketball team. The other kids laughed when he tried out. But Miguel practiced every morning before school. In the championship game, Miguel scored the winning basket.', question: 'What is the theme? Cite evidence from the text.', answer: 'Theme: Hard work and determination can overcome obstacles. Evidence: Miguel was laughed at for being small but practiced every morning and scored the winning basket.', hint: 'What obstacle did Miguel face? How did he overcome it?' },
        { passage: 'Ava wanted to win the science fair so much that she copied her older sister\'s project. She won first place but felt awful when her sister found out. Ava returned the ribbon and started her own project.', question: 'What is the theme? Support with evidence.', answer: 'Theme: Real achievement comes from your own effort, not cheating. Evidence: Ava felt awful after winning dishonestly and chose to do her own work instead.', hint: 'Why did Ava feel bad even though she won?' },
        { passage: 'The town had two bakeries that competed fiercely. When a flood hit, both bakers worked together to feed everyone. After that, they became friends and shared recipes.', question: 'What is the theme? Provide text evidence.', answer: 'Theme: Working together is more valuable than competing. Evidence: The bakers stopped competing during the flood and became friends who shared with each other.', hint: 'What changed the bakers\' relationship? What does the ending show?' },
        { passage: 'Grandpa told Jade, "A garden takes patience." Jade watered her seeds every day but nothing grew. She was about to give up when tiny green shoots finally appeared after three weeks.', question: 'What is the theme? Use evidence.', answer: 'Theme: Patience and persistence pay off. Evidence: Grandpa warned about patience, Jade almost gave up, but the shoots appeared after three weeks of steady care.', hint: 'What was Grandpa\'s advice? Was he right?' },
        { passage: 'The popular kids ignored Ravi because he wore old clothes. But when the class needed someone to fix the broken robot for the contest, only Ravi knew how. Suddenly everyone wanted to be his friend.', question: 'What is the theme? Give evidence.', answer: 'Theme: A person\'s worth is not based on appearance but on their skills and character. Evidence: Ravi was ignored for his clothes but valued for his knowledge when it mattered.', hint: 'Why was Ravi ignored? Why was he valued later?' },
      ],
    },
    'character-depth': {
      items: [
        { passage: 'Coach Diaz yelled at the players during practice. But after the game, she quietly pulled aside the struggling player and spent an hour helping him improve. She bought pizza for the team with her own money.', question: 'Describe Coach Diaz in depth. Use text evidence.', answer: 'Coach Diaz seems strict on the surface but is actually deeply caring. Evidence: she yells during practice (tough) but privately helps struggling players and buys pizza (generous and kind).', hint: 'How does the coach act publicly versus privately?' },
        { passage: 'Theo always joked around in class and seemed like he did not care about school. But his notebook was full of detailed drawings and stories. He stayed after school to work in the art room.', question: 'What does this passage reveal about Theo\'s true character?', answer: 'Theo appears to not care but is actually creative and dedicated. Evidence: his notebook is full of detailed work and he stays after school for art.', hint: 'Is Theo really careless? What does his notebook show?' },
        { passage: 'The queen had a fierce reputation and enemies feared her. But she had passed a law making sure every child in the kingdom could attend school for free.', question: 'Describe the queen using evidence.', answer: 'The queen is complex — fierce and powerful but also compassionate. Evidence: enemies feared her, yet she cared enough about children to give them free education.', hint: 'How do others see the queen? What do her actions reveal?' },
        { passage: 'Kim never raised her hand in class. She barely spoke to anyone. But when the new student was being teased, Kim stood up and said firmly, "Leave her alone."', question: 'What does this moment reveal about Kim?', answer: 'Kim is quiet but brave when it matters. Evidence: she never speaks up in class but defends someone being bullied, showing hidden courage.', hint: 'What is surprising about Kim\'s action?' },
        { passage: 'Mr. Lee complained about the neighborhood cats. But every evening, he left bowls of food and water on his porch for them.', question: 'What does this show about Mr. Lee?', answer: 'Mr. Lee pretends to dislike the cats but secretly cares for them. Evidence: he complains but feeds and waters them every evening.', hint: 'Do Mr. Lee\'s words match his actions?' },
      ],
    },
    'first-vs-third-person': {
      items: [
        { passage: 'Version A: "I crept down the dark hallway, my heart pounding. I had no idea what waited behind that door." Version B: "Maya crept down the dark hallway, her heart pounding. She had no idea what waited behind that door."', question: 'How does the point of view differ? How does it change the experience?', answer: 'Version A is first person (I/my) — we feel like we ARE the character. Version B is third person (she/her) — we observe Maya from outside. First person feels more immediate and personal.', hint: 'What pronouns does each version use? Which feels closer?' },
        { passage: '"I knew the answer but I was too shy to raise my hand. What if I was wrong?"', question: 'What point of view is this? What is the effect?', answer: 'First person. The effect is that we hear the character\'s private fears directly, which creates a personal, intimate feeling.', hint: 'What pronouns are used? Can we hear the character\'s thoughts?' },
        { passage: 'Jake thought the cave was empty. He did not see the bear sleeping in the shadows. It opened one eye.', question: 'What point of view is this? What advantage does it give readers?', answer: 'Third person. Readers can see the bear that Jake cannot, creating suspense and tension because we know more than the character.', hint: 'Do we know something Jake does not? How does that feel?' },
        { passage: '"I thought I was the only one who saw the shooting star. It felt like the universe was sending me a secret message."', question: 'How does first person affect this passage?', answer: 'First person makes the moment feel deeply personal and emotional. We experience the wonder through the narrator\'s eyes as if it is our own.', hint: 'How would this feel different if it said "she thought"?' },
        { passage: 'Lina smiled at everyone, but inside she felt like a glass about to shatter. Nobody at the party knew her secret.', question: 'What does third person reveal here?', answer: 'Third person lets the narrator show the contrast between Lina\'s outward smile and inner pain. We see both what others see and what Lina truly feels.', hint: 'What do the other characters see? What do we see?' },
      ],
    },
    'simile-metaphor-idiom': {
      items: [
        { passage: 'Her eyes were as bright as stars on a clear night.', question: 'Identify the figurative language and explain its meaning.', answer: 'Simile (uses "as...as"). It means her eyes were very bright and sparkly, comparing them to stars.', hint: 'Look for comparison words like "as" or "like."' },
        { passage: 'The classroom was a zoo after the teacher left the room.', question: 'What figurative language is used? What does it mean?', answer: 'Metaphor. The classroom is compared directly to a zoo, meaning it was wild, loud, and chaotic.', hint: 'Is the classroom actually a zoo? What comparison is being made?' },
        { passage: 'Dad said, "Don\'t let the cat out of the bag about Mom\'s surprise party."', question: 'What type of figurative language is this?', answer: 'Idiom. "Let the cat out of the bag" means to reveal a secret. It has nothing to do with an actual cat.', hint: 'Does this make sense if taken literally? What does it really mean?' },
        { passage: 'The snow was a white blanket covering the sleeping town.', question: 'Identify and explain the figurative language.', answer: 'Metaphor. The snow is compared to a blanket, suggesting it covers everything softly and completely, and the town seems peaceful.', hint: 'Is the snow actually a blanket?' },
        { passage: 'After the long hike, my legs felt like jelly.', question: 'What figurative language is used?', answer: 'Simile (uses "like"). It means the legs felt weak and wobbly, like jelly.', hint: 'What word signals this is a comparison?' },
        { passage: 'When Mom found out about the broken vase, I knew I was in hot water.', question: 'What type of figurative language is "in hot water"?', answer: 'Idiom. "In hot water" means in trouble. It does not refer to actual hot water.', hint: 'Is the person actually in water? What does this expression mean?' },
      ],
    },
    'structure-analysis': {
      items: [
        { passage: 'The story begins at the end — with the hero standing victorious. Then it jumps back to show how it all started, and slowly catches up to that opening moment.', question: 'What structural choice did the author make? Why?', answer: 'The author uses a flashback structure, starting at the end. This creates curiosity — readers want to know how the hero got there.', hint: 'What comes first? Why would the author start at the end?' },
        { passage: 'Each chapter is told from a different character\'s perspective. Chapter 1 is from the brother, Chapter 2 from the sister, Chapter 3 from the mother.', question: 'How is this book structured? What effect does this create?', answer: 'It uses alternating perspectives. This lets readers understand each character\'s feelings and see how they experience the same events differently.', hint: 'Whose voice do we hear in each chapter?' },
        { passage: 'The poem has four stanzas. The first and last stanzas are exactly the same, like a frame around a picture.', question: 'What structural device is used? What is its effect?', answer: 'The poem uses a framing structure with repeated stanzas. The repeated lines create a sense of completeness and emphasize the poem\'s main idea.', hint: 'What do the first and last stanzas have in common?' },
        { passage: 'The story is divided into three sections labeled "Before," "During," and "After."', question: 'Why might the author organize the story this way?', answer: 'This chronological structure clearly shows how a key event changed things. Readers can compare life before and after the event.', hint: 'What do the labels tell you about the story\'s focus?' },
        { passage: 'Short chapters alternate between the real world and the character\'s dreams. In dreams, everything is in color; the real world is described in gray tones.', question: 'How does the structure add meaning?', answer: 'The alternating structure contrasts reality and dreams. The color versus gray shows the character finds more life and hope in dreams than in real life.', hint: 'What is different between the two types of chapters?' },
      ],
    },
    'compare-themes-genres': {
      items: [
        { passage: 'In the fairy tale, a poor girl finds a magic ring that grants wishes and learns to be careful what she wishes for. In the realistic story, a girl wins a contest but realizes the prize is not as great as she imagined.', question: 'Compare the themes and genres.', answer: 'Both stories share the theme that getting what you want may not bring happiness. The fairy tale uses magic to show this, while the realistic story uses an everyday situation.', hint: 'What do both characters learn? How is the lesson delivered differently?' },
        { passage: 'A myth tells of a hero who travels to the underworld to rescue a friend, showing the power of loyalty. A realistic novel tells of a girl who stands by her friend when everyone else turns away.', question: 'Compare how these different genres explore a similar theme.', answer: 'Both explore the theme of loyalty and friendship. The myth uses an epic, supernatural journey while the novel uses a realistic social situation. Both show that true friends do not give up.', hint: 'What do both main characters do for their friends?' },
        { passage: 'A science fiction story shows a robot learning to feel emotions and becoming human-like. A folk tale tells of a wooden puppet who earns the right to become a real boy.', question: 'What theme do these stories share? How do the genres differ?', answer: 'Both explore the theme of what it means to be truly human. The sci-fi uses technology and the future, while the folk tale uses magic and tradition. Both suggest being human is about feelings, not material.', hint: 'What does each character want? How are the paths different?' },
        { passage: 'A poem describes the beauty of a single tree standing alone in a field. A short story follows a person who moves to a new town and must start over alone.', question: 'Compare the theme across these genres.', answer: 'Both explore solitude and resilience. The poem uses nature imagery to celebrate standing alone with strength. The story uses a character\'s experience to show the challenge and growth of being on your own.', hint: 'What does being alone mean in each piece?' },
      ],
    },
  },
  'grade-5': {
    'multiple-themes': {
      items: [
        { passage: 'Rosa worked two jobs to save for college while caring for her younger siblings. She often stayed up late studying after the kids were asleep. When she got accepted to college, she cried because she would miss her family but was proud of what she accomplished.', question: 'Identify two themes in this passage.', answer: 'Theme 1: Hard work and sacrifice lead to achievement. Theme 2: Family bonds create both strength and difficult choices. Evidence: Rosa works two jobs, studies late (sacrifice), and cries about leaving family (conflict between growth and love).', hint: 'What does Rosa work hard for? What emotional conflict does she face?' },
        { passage: 'The old lighthouse keeper saved every ship that passed through the storm. Nobody ever thanked him. When he retired, the whole town finally realized what he had done and built a statue in his honor.', question: 'What are two themes?', answer: 'Theme 1: True heroes do their work without seeking recognition. Theme 2: People often do not appreciate what they have until it might be gone. Evidence: The keeper saved ships without thanks; the town only honored him when he retired.', hint: 'Why did nobody thank him? What changed?' },
        { passage: 'The two rival kingdoms fought for years over a river. Both sides suffered losses. When the young princess crossed the border alone to talk to the enemy prince, they discovered their peoples wanted the same thing: peace.', question: 'Identify two themes.', answer: 'Theme 1: Communication and courage can end conflict. Theme 2: Enemies often have more in common than they realize. Evidence: The princess bravely crossed alone, and both sides actually wanted the same thing.', hint: 'What did the princess risk? What did they discover?' },
        { passage: 'The inventor failed 99 times. His friends told him to quit. On the 100th try, his machine worked. But he said the 99 failures were just as important because each one taught him something.', question: 'What are two themes?', answer: 'Theme 1: Failure is a necessary part of success. Theme 2: Persistence matters more than talent. Evidence: He failed 99 times but learned from each one, and he kept going despite friends saying to quit.', hint: 'How does the inventor view his failures? Why did he keep going?' },
      ],
    },
    'character-comparison': {
      items: [
        { passage: 'When the storm hit, Ana rushed outside to save the garden she had planted. Her brother Marco locked the doors and windows, making sure the family was safe inside.', question: 'Compare Ana and Marco. How are they similar and different?', answer: 'Both respond to the storm with action and care. Ana is driven by her passion (the garden) and acts impulsively. Marco is protective of people and thinks of safety first. Both show courage in different ways.', hint: 'What does each character protect? What does that reveal?' },
        { passage: 'Kai speaks up instantly when he sees something unfair, even if it makes people uncomfortable. His best friend Zara prefers to write letters to people in charge and organize quiet meetings.', question: 'Compare how Kai and Zara address injustice.', answer: 'Both care about fairness but act differently. Kai is bold and direct, confronting problems publicly. Zara is strategic and patient, working through systems. Both approaches show courage in different forms.', hint: 'How does each one take action? Are both effective?' },
        { passage: 'In the first chapter, the warrior says, "We must fight to protect our home." In the second chapter, the healer says, "We must find a way to live together in peace."', question: 'Compare these characters\' approaches.', answer: 'The warrior believes in fighting to solve conflict while the healer believes in peaceful solutions. Both want to protect their community but disagree on methods.', hint: 'What does each character believe is the solution?' },
        { passage: 'Nina studied alone every night and earned the highest grade. Her classmate Ray formed a study group and helped everyone pass, though his own grade was slightly lower.', question: 'Compare Nina and Ray.', answer: 'Nina is independent and focused on personal excellence. Ray is collaborative and focused on helping everyone succeed. Both are hardworking but value different outcomes — individual achievement versus group success.', hint: 'What does each character prioritize?' },
      ],
    },
    'narrator-influence': {
      items: [
        { passage: '"I never liked the new kid from the start. He walked in like he owned the place with his fancy sneakers and big smile."', question: 'How does the narrator\'s point of view influence the description?', answer: 'The narrator\'s dislike colors the description negatively. "Walked in like he owned the place" and "fancy sneakers" show jealousy or resentment. The new kid might actually just be friendly and well-dressed.', hint: 'Are the narrator\'s descriptions facts or opinions? What feelings come through?' },
        { passage: 'Everything about the old house felt wrong to me. The shadows seemed to reach for me. The stairs groaned like they were warning me to leave.', question: 'How does the narrator shape our experience of the house?', answer: 'The narrator\'s fear makes the house seem alive and threatening. The shadows "reaching" and stairs "groaning" reflect the narrator\'s scared point of view, not reality. A different narrator might describe the same house as cozy.', hint: 'Is the house actually dangerous or does the narrator make it seem that way?' },
        { passage: 'Mother always said Father was the bravest man in the village. She told us stories of his adventures every night. I believed every word.', question: 'How might the narrator\'s perspective be limited?', answer: 'The narrator only knows about the father through the mother\'s stories. The mother may exaggerate because she loves him. The narrator believes everything without question, so we may not be getting the full truth.', hint: 'Where does the narrator get information? Is the source reliable?' },
        { passage: '"My sister thinks she is so smart just because she reads big books. But I know things too — street smarts are just as important."', question: 'How does the narrator\'s viewpoint shape the story?', answer: 'The narrator feels insecure about the sister\'s intelligence and defensive about their own knowledge. This rivalry colors how the sister is described. The sister might not actually be showing off.', hint: 'What does the narrator feel about the sister? How might that affect the description?' },
      ],
    },
    'personification-hyperbole': {
      items: [
        { passage: 'The wind howled through the empty streets, rattling the doors as if demanding to be let inside.', question: 'Identify the figurative language and explain its effect.', answer: 'Personification. The wind is given human actions — howling and demanding. This makes the storm feel alive and aggressive, creating a threatening mood.', hint: 'Can wind actually howl or demand things?' },
        { passage: 'I have told you a million times to clean your room!', question: 'What figurative language is this? What is the effect?', answer: 'Hyperbole — extreme exaggeration. The speaker has not literally said it a million times. The exaggeration emphasizes frustration and makes the point that it has been said many times.', hint: 'Has the speaker really said it a million times?' },
        { passage: 'The sun smiled down on the children playing in the park, wrapping them in its warm golden arms.', question: 'Identify and explain the figurative language.', answer: 'Personification. The sun is given human qualities — smiling and having arms. This creates a warm, caring, protective feeling, as if nature is watching over the children.', hint: 'Can the sun actually smile or have arms?' },
        { passage: 'My backpack weighs a ton. I could barely make it up the stairs.', question: 'What figurative language is used?', answer: 'Hyperbole. The backpack does not actually weigh a ton. The exaggeration emphasizes how heavy it feels and how difficult it is to carry.', hint: 'Does the backpack literally weigh 2000 pounds?' },
        { passage: 'The old house groaned and sighed as the family moved out, as if saying goodbye to the people it had sheltered for years.', question: 'Identify the figurative device and its effect.', answer: 'Personification. The house is given emotions — groaning, sighing, saying goodbye. This creates sadness about leaving and suggests the house itself has memories and feelings.', hint: 'Can a house actually feel emotions?' },
        { passage: 'I was so hungry I could eat a horse.', question: 'What figurative language is this?', answer: 'Hyperbole. The speaker could not actually eat a horse. The exaggeration emphasizes extreme hunger in a humorous way.', hint: 'Would someone really eat a horse?' },
      ],
    },
    'structure-fit': {
      items: [
        { passage: 'The book switches between the present and flashbacks to the main character\'s childhood. Each flashback explains why the character acts the way she does in the present.', question: 'How does this structure serve the story?', answer: 'The flashback structure helps readers understand the character\'s motivations. By showing past events alongside present actions, the author explains cause and effect in the character\'s development.', hint: 'What do the flashbacks add that the present alone could not?' },
        { passage: 'The novel is organized as diary entries written by the main character. Each entry is dated and shows what happened that day.', question: 'How does the diary format affect the reading experience?', answer: 'The diary format makes the story feel personal and immediate, like reading someone\'s private thoughts. It limits the perspective to one character but creates deep intimacy with that character.', hint: 'How does reading a diary feel different from reading a regular story?' },
        { passage: 'The story is told in reverse, starting with the ending and working back to the beginning. The last chapter reveals the very first event.', question: 'Why might an author choose this reverse structure?', answer: 'The reverse structure creates mystery — readers know the outcome but want to understand how it happened. It shifts the focus from "what happens" to "why it happened."', hint: 'What question does the reader keep asking while reading backward?' },
        { passage: 'The poem is arranged in the shape of a tree on the page, with words branching outward. The poem is about growth and reaching upward.', question: 'How does the poem\'s structure fit its content?', answer: 'The tree shape mirrors the poem\'s theme of growth. Readers literally see the words branching and reaching up, which reinforces the message visually.', hint: 'How does the shape connect to what the poem is about?' },
      ],
    },
    'compare-across-cultures': {
      items: [
        { passage: 'A Japanese folk tale tells of a crane who repays a man\'s kindness by weaving beautiful cloth, but she must leave when he discovers her secret. A Native American tale tells of a deer who helps a hunter\'s family through winter but leaves when they become greedy.', question: 'Compare these stories across cultures.', answer: 'Both stories share the theme that magical gifts come with conditions and that greed or curiosity can destroy blessings. Both cultures use animals as grateful, magical beings. They differ in the specific lesson: one warns against curiosity, the other against greed.', hint: 'What do the animal characters do in each story? Why do they leave?' },
        { passage: 'A Greek myth tells of Icarus who flew too close to the sun with wax wings and fell. A West African tale tells of Anansi the spider who tried to own all the world\'s wisdom and spilled it everywhere.', question: 'What similar theme appears across these cultures?', answer: 'Both warn against excessive ambition and pride. Icarus\'s pride in flying causes his fall. Anansi\'s greed for all wisdom causes him to lose it. Both cultures teach that overreaching leads to loss.', hint: 'What does each character try to do? What goes wrong?' },
        { passage: 'In a Chinese tale, a student practices calligraphy for ten years before the master says he is ready. In an Irish tale, a musician plays his fiddle for seven years on a hilltop before the fairies teach him magic music.', question: 'What shared theme connects these stories?', answer: 'Both cultures value patience and long dedication. Mastery requires years of practice before rewards come. Both stories show that true skill cannot be rushed.', hint: 'How long does each character practice? What is the reward for patience?' },
        { passage: 'An Indian fable features a clever jackal who outsmarts a lion through wit. A European fable features a clever fox who outsmarts a wolf through trickery.', question: 'Compare these trickster stories.', answer: 'Both cultures use trickster animals — the jackal and the fox — who are small but outsmart larger, stronger animals through intelligence. The theme that brains beat brawn appears across cultures, though the specific animals differ.', hint: 'What animal is the trickster in each? What quality helps them win?' },
      ],
    },
  },
  'grade-6': {
    'theme-development': {
      items: [
        { passage: 'At the start, the boy hoarded his food, trusting no one. Midway through, a stranger shared bread with him without asking for anything. By the end, the boy was sharing his own food with other travelers.', question: 'Trace how the theme develops throughout the passage.', answer: 'The theme of generosity develops through the boy\'s transformation. He begins distrustful and selfish. The stranger\'s unconditional kindness plants a seed of change. By the end, the boy mirrors that generosity, showing that kindness is contagious.', hint: 'How does the boy change from beginning to end? What caused the change?' },
        { passage: 'The village celebrated the hero\'s strength in Chapter 1. In Chapter 5, the hero fails to save someone despite his strength. In the final chapter, the hero realizes true strength means asking for help.', question: 'How does the theme of strength develop?', answer: 'The meaning of "strength" evolves. It starts as physical power, is challenged by failure, and is redefined as the courage to be vulnerable and seek help. Each stage deepens the theme.', hint: 'How does the definition of strength change?' },
        { passage: 'The first poem in the collection celebrates summer\'s warmth and joy. The middle poems describe autumn\'s beauty mixed with sadness. The final poem finds peace in winter\'s quiet stillness.', question: 'How does the theme develop across the collection?', answer: 'The theme of acceptance and finding beauty in change develops through the seasons. It moves from the easy joy of summer through the bittersweet loss of autumn to the mature peace of winter, showing growth in perspective.', hint: 'What emotion is attached to each season?' },
        { passage: 'In Scene 1, the two characters are bitter enemies. In Scene 3, they are forced to work together when trapped in a cave. By Scene 5, they call each other friend.', question: 'How does the theme develop through the scenes?', answer: 'The theme that shared experience can transform enemies into friends develops through forced proximity. The crisis in the cave strips away their rivalry, revealing their common humanity. The friendship grows from survival, not choice.', hint: 'What forces the change? How does each scene build on the last?' },
      ],
    },
    'character-development': {
      items: [
        { passage: 'In the opening, Elena boasts she needs no one and pushes away anyone who offers help. After her project fails publicly, she sits alone until a classmate sits beside her. In the final scene, Elena is tutoring younger students, saying, "Everyone needs a hand sometimes."', question: 'Analyze Elena\'s character development.', answer: 'Elena develops from prideful isolation to generous connection. Her public failure humbles her, and the classmate\'s kindness shows her the value of help. Her final words echo what she learned, and she now gives to others what she once rejected.', hint: 'Compare Elena\'s beginning attitude to her ending. What event caused the shift?' },
        { passage: 'The captain started the voyage confident and giving orders. After losing half his crew in a storm, he began listening to his remaining sailors. In port, he told the harbor master, "My crew saved us. I just tried to stay out of their way."', question: 'How does the captain change?', answer: 'The captain develops from an authoritative, top-down leader to a humble, collaborative one. The crisis of the storm teaches him that leadership means trusting others. His final statement shows he has replaced ego with respect.', hint: 'How does the captain view leadership at the start versus the end?' },
        { passage: 'As a child, the narrator feared the forest and never crossed the tree line. At fifteen, she entered the forest to find her lost brother. At the story\'s end, she lives at the forest\'s edge and tends its paths.', question: 'Trace the narrator\'s character development.', answer: 'The narrator develops from fearful avoidance to courageous action to peaceful coexistence. Love for her brother gave her the courage to face her fear. Having overcome it, she embraces what once terrified her, symbolized by living at the forest\'s edge.', hint: 'What is the narrator\'s relationship with the forest at each stage?' },
        { passage: 'Marcus argued with everyone and always had to be right. When his best friend stopped talking to him, Marcus wrote in his journal, "Being right is not the same as being kind." He apologized the next day.', question: 'How does Marcus develop?', answer: 'Marcus develops from stubborn and combative to self-aware and compassionate. Losing his friend forced reflection. His journal entry shows a genuine internal shift — he now values kindness over being right, and he acts on it by apologizing.', hint: 'What made Marcus change? What does his journal show?' },
      ],
    },
    'author-pov-craft': {
      items: [
        { passage: 'The author describes the abandoned factory using words like "skeleton," "hollow eyes" (for windows), and "the building exhaled dust." The character approaches cautiously.', question: 'How does the author use craft to develop a point of view toward the factory?', answer: 'The author uses personification and dark imagery to make the factory seem like a dead or dying creature. Words like "skeleton" and "hollow eyes" create a threatening atmosphere. The author\'s craft shapes the reader to feel uneasy about the building.', hint: 'What kind of words does the author choose? What feeling do they create?' },
        { passage: 'The narrator describes the grandmother in long, flowing sentences full of warmth: "She moved slowly, like honey, and her voice could soothe a storm." The father is described in short, clipped sentences: "He spoke. He left."', question: 'How does sentence structure reveal the author\'s craft?', answer: 'The author uses long, warm sentences for the grandmother, reflecting love and comfort. The short, abrupt sentences for the father suggest distance, tension, or emotional coldness. Sentence length becomes a tool for characterization.', hint: 'How are the sentences for each character different? What do they suggest?' },
        { passage: 'The story is told entirely from the dog\'s perspective. The author writes, "The tall ones put on their outside skins and opened the big barrier. The bright place was full of interesting ground-smells."', question: 'How does the author\'s choice of narrator affect the story?', answer: 'By using the dog\'s limited understanding, the author makes ordinary things (coats, doors, outdoors, grass) seem new and strange. This defamiliarizes everyday life and creates humor while also showing the world through an innocent perspective.', hint: 'Why does the dog not know words like "coat" or "door"? What effect does this have?' },
        { passage: 'The author writes, "The test scores came back. Numbers on paper. That is what they reduced her to — a number." The author then describes the student\'s art, music, and kindness in vivid detail.', question: 'What is the author\'s point of view on testing? How do they convey it?', answer: 'The author is critical of reducing students to test scores. The flat, cold language for testing ("numbers on paper") contrasts with the rich, vivid description of the student\'s real qualities. This craft choice argues that tests miss what truly matters.', hint: 'Compare the language used for the test versus the student\'s other qualities.' },
      ],
    },
    'word-choice-tone': {
      items: [
        { passage: 'Version A: "The soldiers marched into the village." Version B: "The soldiers crept into the village." Version C: "The soldiers stormed into the village."', question: 'How does word choice change the tone in each version?', answer: 'A (marched) — neutral, orderly, routine. B (crept) — secretive, sneaky, suspenseful. C (stormed) — violent, aggressive, urgent. One word changes the entire feeling and our perception of the soldiers.', hint: 'What feeling does each verb create?' },
        { passage: 'The author describes the meal as "a feast of golden bread, ruby tomatoes, and emerald herbs spread across the wooden table like a painter\'s palette."', question: 'How does word choice create tone?', answer: 'The author uses jewel and art words (golden, ruby, emerald, palette) to create a tone of beauty and richness. The simple meal is elevated to something precious and artistic through word choice.', hint: 'What kinds of words are used to describe the food? What effect do they create?' },
        { passage: '"The old house sat quietly at the end of the lane, its windows glowing softly like half-closed eyes, drowsy and content."', question: 'What tone does the word choice create?', answer: 'The words "quietly," "softly," "drowsy," and "content" create a peaceful, sleepy tone. The house seems alive but calm and safe, inviting rather than threatening.', hint: 'What mood do these specific words create? How would the tone change with different words?' },
        { passage: 'Version A: "The child said she was hungry." Version B: "The child whimpered that she was starving, her hollow cheeks pale in the dim light."', question: 'Compare the tone of these versions.', answer: 'Version A is neutral and factual. Version B uses emotional word choice (whimpered, starving, hollow, pale, dim) to create a tone of suffering and sympathy. The details make the reader feel the child\'s pain.', hint: 'Which version makes you feel more emotion? What specific words cause that?' },
        { passage: 'The poet writes: "Not gone — merely traveling. Not lost — merely ahead. Not silent — merely whispering from a place we cannot yet hear."', question: 'How does word choice create the poem\'s tone?', answer: 'The repeated "not/merely" structure and gentle words (traveling, ahead, whispering) create a tone of comfort and hope. The poet reframes death or loss as a gentle continuation rather than an ending.', hint: 'What harsh words does the poet avoid? What gentle words replace them?' },
      ],
    },
    'structural-analysis': {
      items: [
        { passage: 'The novel opens with the last line of a letter: "And that is why I can never come home." The rest of the book is the letter itself, explaining everything that led to this sentence.', question: 'Analyze how this structural choice affects the reader.', answer: 'Opening with the conclusion creates immediate tension and mystery. Every chapter becomes an answer to "why can\'t they come home?" The reader is pulled through the entire story by this question. The structure turns a straightforward story into a suspenseful revelation.', hint: 'What question does the opening create? How does this drive the reader forward?' },
        { passage: 'The play has no intermission. Each scene flows directly into the next with no breaks. The characters never leave the single room where the play is set.', question: 'How does this structure contribute to meaning?', answer: 'The continuous, unbroken structure trapped in one room creates claustrophobia and tension. Without breaks, the audience feels the same pressure the characters feel. The structure IS the meaning — entrapment and inescapability.', hint: 'How does the lack of breaks make the audience feel?' },
        { passage: 'Every chapter ends with a one-line sentence set apart from the rest of the text. These lines slowly reveal a hidden message when read together.', question: 'Analyze the effect of this structural device.', answer: 'The isolated ending lines create a story within a story. Readers must piece them together like a puzzle, adding a layer of mystery and engagement. It rewards careful, attentive reading and adds depth to the surface narrative.', hint: 'What extra challenge does this give the reader? What reward?' },
        { passage: 'The poem\'s lines get shorter and shorter as it progresses, from ten words per line to just one word at the end.', question: 'How does the narrowing structure affect meaning?', answer: 'The shrinking lines visually and rhythmically enact the poem\'s content — perhaps narrowing focus, fading away, or building to a concentrated point. The form mirrors the content, making the final single word feel powerful and absolute.', hint: 'What happens visually as you read? How does that connect to the poem\'s meaning?' },
      ],
    },
    'genre-comparison': {
      items: [
        { passage: 'A short story describes a soldier\'s return home in prose paragraphs with detailed descriptions. A poem covers the same moment in twelve spare lines with imagery of empty boots at the door. A play opens with the family waiting, speaking their fears aloud.', question: 'Compare how each genre approaches the same theme.', answer: 'The story uses detailed narration to develop the full emotional experience. The poem uses compressed imagery (empty boots) for powerful symbolic impact. The play uses dialogue to show the family\'s different reactions in real time. Each genre\'s strengths shape how we experience the homecoming differently.', hint: 'What can each genre do that the others cannot?' },
        { passage: 'A mystery novel builds suspense over 200 pages with clues and red herrings. A mystery poem reveals the twist in the final couplet. A mystery play lets the audience see what the detective cannot.', question: 'How does genre affect the mystery experience?', answer: 'The novel uses length for gradual tension and complex clue-planting. The poem uses brevity for a sudden, surprising impact. The play uses dramatic irony, letting audiences know more than characters. Genre determines pacing, perspective, and how surprise works.', hint: 'How does the length and format of each genre change the mystery?' },
        { passage: 'A folk tale about kindness uses a simple narrative: a kind girl helps an old woman and is rewarded with gold. A poem about kindness uses metaphor: "Kindness is a river that flows both ways." A play about kindness shows two characters debating whether kindness is weakness.', question: 'Compare the approaches.', answer: 'The folk tale teaches through a clear cause-effect story. The poem captures the essence of kindness in a single image. The play explores kindness as a complex idea through conflicting viewpoints. Each genre values different things: narrative clarity, poetic image, or dramatic debate.', hint: 'How does each genre make its point about kindness?' },
        { passage: 'A fantasy novel creates a full imaginary world with maps and histories. A fantasy poem evokes a magical moment in a few vivid lines. A fantasy play relies on staging and audience imagination to create the magical world.', question: 'How do these genres handle world-building differently?', answer: 'The novel builds the world through detailed description and extensive text. The poem suggests the world through imagery, leaving much to the reader\'s imagination. The play depends on performance, sets, and the audience filling in gaps. Each asks different things of its audience.', hint: 'How much detail does each genre provide? What role does the audience play?' },
      ],
    },
  },
};

const PASSAGE_BANK = {
  'kindergarten': [
    { title: 'The Lost Mitten', text: 'A bunny lost her red mitten in the snow. A bird found it and used it as a nest. When the bunny came back, the bird gave it to her. They became friends.', topics: ['character-identification', 'setting-identification', 'retell-events', 'problem-solution-basic'] },
    { title: 'The Big Puddle', text: 'After the rain, a big puddle sat in the yard. A duck splashed in it happily. A cat walked around it carefully. They both liked the rain in their own way.', topics: ['character-identification', 'picture-clues'] },
  ],
  'grade-1': [
    { title: 'The Sharing Tree', text: 'An old apple tree gave fruit to everyone in town. In winter, it had no apples left. The townspeople brought the tree water and sang songs to it. In spring, it bloomed again.', topics: ['character-description', 'setting-importance', 'key-details-retell', 'problem-solution'] },
    { title: 'Brave Squirrel', text: 'A tiny squirrel saw that the bird feeder was empty. Even though the cat sat below, the squirrel climbed up and filled it with seeds from its stash. The birds chirped a thank you.', topics: ['character-description', 'text-to-self'] },
  ],
  'grade-2': [
    { title: 'Two Snowflakes', text: 'Two snowflakes fell from the same cloud. One landed on a mitten and melted quickly. The other landed on a frozen pond and lasted all winter. Both had beautiful patterns no one else would ever see again.', topics: ['lesson-moral', 'beginning-middle-end', 'context-vocabulary'] },
    { title: 'The New Neighbor', text: 'When a new family moved next door, Malik watched from his window. He wanted to say hello but felt shy. Finally he baked cookies with his mom and brought them over. The new boy grinned and asked Malik to play.', topics: ['character-response', 'character-viewpoints'] },
  ],
  'grade-3': [
    { title: 'The Wind and the Kite', text: 'The wind bragged that it could tear any kite from the sky. A girl built a strong kite and flew it all day. The wind blew harder and harder, but the kite danced instead of breaking. The wind learned that strength is not always about force.', topics: ['theme-message', 'literal-vs-figurative', 'character-traits-motives'] },
    { title: 'The Library Ghost', text: 'Told from the librarian\'s view, the old library creaked at night. She believed it was just the building settling. But the children swore they saw a ghost reading in the corner. One day she found an open book on the floor with no explanation.', topics: ['narrator-vs-character-pov', 'chapters-scenes-stanzas'] },
  ],
  'grade-4': [
    { title: 'The River Between', text: 'Two towns sat on opposite sides of a wide river. Each thought the other was strange. When a flood threatened both, they built a bridge together. Afterward, the bridge stayed, and so did the friendship.', topics: ['theme-with-evidence', 'structure-analysis', 'compare-themes-genres'] },
    { title: 'Glass Wings', text: 'She had wings made of glass — everyone said so. They meant she was fragile. But she flew higher than anyone, and when the sun hit her wings, rainbows scattered across the ground below.', topics: ['simile-metaphor-idiom', 'character-depth', 'first-vs-third-person'] },
  ],
  'grade-5': [
    { title: 'The Mapmaker', text: 'The old mapmaker drew maps of places that did not exist yet. People laughed. But explorers who followed her maps found new lands. She said, "Every real place was imaginary first."', topics: ['multiple-themes', 'character-comparison', 'narrator-influence'] },
    { title: 'Stone Soup', text: 'A stranger came to a village where no one shared food. He put a stone in a pot of water and said he was making soup. Curious, each villager added an ingredient. By evening, everyone feasted together.', topics: ['compare-across-cultures', 'personification-hyperbole', 'structure-fit'] },
  ],
  'grade-6': [
    { title: 'The Last Lighthouse Keeper', text: 'Automated lights replaced the keepers one by one. The last keeper refused to leave. Ships still looked for his lamp. When he finally left, sailors said the coast felt darker, even though the automatic light was brighter.', topics: ['theme-development', 'character-development', 'author-pov-craft', 'word-choice-tone'] },
    { title: 'The Empty Frame', text: 'In the museum hung one empty frame. Visitors argued about what should fill it. A child said, "It is already full — it is full of what you imagine." The artist, listening from the next room, smiled.', topics: ['structural-analysis', 'genre-comparison', 'word-choice-tone'] },
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

  return {
    type: 'passage-question',
    skill,
    grade,
    count: selected.length,
    instruction: 'Read the passage carefully, then answer the question.',
    items: selected.map(i => ({
      passage: i.passage,
      question: i.question,
      answer: i.answer,
      hint: i.hint || '',
    })),
  };
}

function getPassage(grade, topic) {
  const passages = PASSAGE_BANK[grade];
  if (!passages) return { error: `No passages for ${grade}` };
  if (topic) {
    const filtered = passages.filter(p => p.topics.includes(topic));
    if (filtered.length) return pick(filtered, 1)[0];
  }
  return pick(passages, 1)[0];
}

function checkAnswer(expected, answer) {
  return norm(expected) === norm(answer);
}

// ── Public API ──

class ReadingLiterature {
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

  checkAnswer(expected, answer) { return { correct: checkAnswer(expected, answer), expected, studentAnswer: answer }; }

  getPassage(grade, topic) { return getPassage(grade, topic); }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const passage = getPassage(grade, target.skill);
    return {
      studentId: id, grade, targetSkill: target, exercise, passage,
      lessonPlan: {
        read: passage ? `Read: "${passage.title}" — ${passage.text.slice(0, 60)}...` : 'Select a short literary text.',
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        respond: 'Discuss what you noticed and how it connects to other stories.',
      },
    };
  }
}

module.exports = ReadingLiterature;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const rl = new ReadingLiterature();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) rl.setGrade(id, grade);
        out({ action: 'start', profile: rl.getProfile(id), nextSkills: rl.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(rl.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'kindergarten';
        if (skill) { out(rl.generateExercise(grade, skill, 5)); }
        else { const n = rl.getNextSkills(id, 1).next; out(n.length ? rl.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , expected, answer] = args;
        if (expected === undefined || answer === undefined) throw new Error('Usage: check <id> <expected> <answer>');
        out(rl.checkAnswer(expected, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(rl.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(rl.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(rl.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(rl.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? rl.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(rl.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(rl.setGrade(id, g)); break; }
      case 'passage': { const [, g, topic] = args; if (!g) throw new Error('Usage: passage <grade> [topic]'); out(rl.getPassage(g, topic)); break; }
      default: out({ usage: 'node reading-literature.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','passage'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
