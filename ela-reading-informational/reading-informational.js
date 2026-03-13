// eClaw ELA Reading: Informational Text Interactive Tutor (K-6). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ela-reading-informational');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'comprehension': ['topic-identification', 'key-details-basic', 'picture-information', 'ask-answer-questions'],
  },
  'grade-1': {
    'comprehension': ['main-topic', 'retell-key-details', 'text-features-basic', 'who-what-where-when'],
  },
  'grade-2': {
    'comprehension': ['main-topic-multiparagraph', 'text-features-captions-bold', 'author-purpose-basic', 'compare-two-texts'],
  },
  'grade-3': {
    'comprehension': ['main-idea-details', 'text-features-locate', 'text-structure-basic', 'author-purpose-pov', 'context-vocabulary-nf'],
  },
  'grade-4': {
    'comprehension': ['main-idea-summarize', 'text-structure-identify', 'evidence-explain', 'author-reasoning', 'interpret-visuals', 'integrate-two-texts'],
  },
  'grade-5': {
    'comprehension': ['multiple-main-ideas', 'compare-text-structures', 'quote-accurately', 'analyze-author-evidence', 'multiple-sources'],
  },
  'grade-6': {
    'comprehension': ['central-idea-summary', 'cite-evidence', 'analyze-development', 'author-craft-purpose', 'evaluate-argument', 'multimedia-integration'],
  },
};

// ── Passage & Question Banks ──

const PASSAGE_BANKS = {
  'kindergarten': {
    'topic-identification': {
      items: [
        { passage: 'Dogs can be big or small. Some dogs have long fur. Other dogs have short fur. All dogs need food and water.', question: 'What is this text about?', answer: 'dogs', options: ['dogs', 'cats', 'water'], hint: 'Think about what every sentence talks about.' },
        { passage: 'The sun gives us light. It keeps us warm. Plants need the sun to grow. The sun is a star.', question: 'What is this text about?', answer: 'the sun', options: ['the sun', 'plants', 'stars'], hint: 'What is mentioned in every sentence?' },
        { passage: 'Apples can be red, green, or yellow. They grow on trees. Apples are a healthy snack.', question: 'What is this text about?', answer: 'apples', options: ['apples', 'trees', 'colors'], hint: 'What word appears again and again?' },
        { passage: 'Rain falls from clouds. Rain fills lakes and rivers. Plants drink rain from the soil.', question: 'What is this text about?', answer: 'rain', options: ['rain', 'clouds', 'plants'], hint: 'What word keeps coming up?' },
        { passage: 'Fish live in water. Some fish live in the ocean. Other fish live in ponds. Fish use fins to swim.', question: 'What is this text about?', answer: 'fish', options: ['fish', 'the ocean', 'swimming'], hint: 'Every sentence tells about the same thing.' },
        { passage: 'Bears are big animals. Some bears are brown. Some bears are black. Bears eat fish and berries.', question: 'What is this text about?', answer: 'bears', options: ['bears', 'berries', 'fish'], hint: 'What animal does every sentence describe?' },
      ],
    },
    'key-details-basic': {
      items: [
        { passage: 'Frogs live near ponds. They eat bugs. Frogs can jump very far.', question: 'What do frogs eat?', answer: 'bugs', options: ['bugs', 'fish', 'plants'], hint: 'Look at the second sentence.' },
        { passage: 'The moon shines at night. It looks round and bright. The moon goes around the Earth.', question: 'When does the moon shine?', answer: 'at night', options: ['at night', 'in the morning', 'all day'], hint: 'Read the first sentence again.' },
        { passage: 'Bees make honey. They live in hives. Bees fly from flower to flower.', question: 'Where do bees live?', answer: 'in hives', options: ['in hives', 'in trees', 'in flowers'], hint: 'Find the sentence about where bees live.' },
        { passage: 'Penguins are birds that cannot fly. They swim very well. Penguins live where it is cold.', question: 'Can penguins fly?', answer: 'no', options: ['no', 'yes', 'sometimes'], hint: 'Check the first sentence carefully.' },
        { passage: 'An ant is very small. Ants live in groups. They work together to find food.', question: 'How do ants find food?', answer: 'they work together', options: ['they work together', 'they work alone', 'they ask bees'], hint: 'Read the last sentence.' },
        { passage: 'Turtles have hard shells. The shell keeps them safe. Turtles move very slowly.', question: 'What keeps turtles safe?', answer: 'their shell', options: ['their shell', 'their speed', 'their size'], hint: 'What does the text say about the shell?' },
      ],
    },
    'picture-information': {
      items: [
        { passage: 'A caterpillar eats leaves. Then it makes a cocoon. Later it becomes a butterfly.', question: 'If there was a picture of a cocoon, what would it help you understand?', answer: 'what a cocoon looks like', options: ['what a cocoon looks like', 'what a leaf tastes like', 'how far butterflies fly'], hint: 'A picture shows you what something looks like.' },
        { passage: 'Some deserts are very hot. They have lots of sand. Not much rain falls in a desert.', question: 'What would a picture of a desert show you?', answer: 'what a desert looks like', options: ['what a desert looks like', 'how rain forms', 'what a forest looks like'], hint: 'The picture would match the topic.' },
        { passage: 'A baby bird hatches from an egg. Its mother feeds it worms. Soon the baby bird learns to fly.', question: 'A picture of a nest with eggs helps you understand what?', answer: 'where baby birds come from', options: ['where baby birds come from', 'what worms eat', 'how clouds form'], hint: 'The picture would show the beginning of the story.' },
        { passage: 'Rabbits have long ears. They hop to move around. Rabbits eat carrots and grass.', question: 'What would a picture of a rabbit help you learn?', answer: 'what a rabbit looks like', options: ['what a rabbit looks like', 'what grass tastes like', 'how to hop'], hint: 'A picture of the animal shows its features.' },
        { passage: 'Snowflakes fall from the sky in winter. Each snowflake has a different shape. Snow is white and cold.', question: 'A picture of snowflakes up close would show you what?', answer: 'their different shapes', options: ['their different shapes', 'how snow melts', 'why winter is cold'], hint: 'The text says each snowflake has a different shape.' },
        { passage: 'A volcano is a mountain with an opening at the top. Hot lava can come out of it.', question: 'What would a picture of a volcano help you understand?', answer: 'what a volcano looks like', options: ['what a volcano looks like', 'how to climb a mountain', 'what clouds are'], hint: 'Pictures help us see things we may never see in person.' },
      ],
    },
    'ask-answer-questions': {
      items: [
        { passage: 'Elephants are the biggest land animals. They use their trunks to drink water and grab food.', question: 'What do elephants use their trunks for?', answer: 'to drink water and grab food', options: ['to drink water and grab food', 'to run fast', 'to hide'], hint: 'Look for what the trunk does.' },
        { passage: 'There are four seasons: spring, summer, fall, and winter. Each season has different weather.', question: 'How many seasons are there?', answer: 'four', options: ['four', 'three', 'two'], hint: 'The first sentence tells you the number.' },
        { passage: 'The ocean is full of salt water. Many animals live in the ocean, like fish and whales.', question: 'What kind of water is in the ocean?', answer: 'salt water', options: ['salt water', 'fresh water', 'warm water'], hint: 'Read the first sentence carefully.' },
        { passage: 'Bats come out at night. They use sound to find their way in the dark. Bats eat insects.', question: 'When do bats come out?', answer: 'at night', options: ['at night', 'in the morning', 'at noon'], hint: 'The very first sentence tells you.' },
        { passage: 'Seeds need water and sunlight to grow. First a tiny root grows down. Then a stem pushes up.', question: 'What do seeds need to grow?', answer: 'water and sunlight', options: ['water and sunlight', 'rocks and sand', 'wind and ice'], hint: 'Find what the first sentence says seeds need.' },
        { passage: 'A compass shows which way is north. Explorers use a compass so they do not get lost.', question: 'Why do explorers use a compass?', answer: 'so they do not get lost', options: ['so they do not get lost', 'to measure time', 'to find water'], hint: 'Why would you need to know which direction is north?' },
      ],
    },
  },
  'grade-1': {
    'main-topic': {
      items: [
        { passage: 'Whales are the largest animals on Earth. Blue whales can be 100 feet long. Even baby whales are very big. Whales live in the ocean and breathe air.', question: 'What is the main topic of this text?', answer: 'whales', options: ['whales', 'the ocean', 'baby animals'], hint: 'What does every sentence tell about?' },
        { passage: 'Many birds fly south in the fall. They go where it is warm. In spring, birds fly back home. This trip is called migration.', question: 'What is the main topic?', answer: 'bird migration', options: ['bird migration', 'spring weather', 'flying lessons'], hint: 'What is the text mostly about?' },
        { passage: 'Your teeth help you eat food. Front teeth bite food. Back teeth chew food. You must brush your teeth every day.', question: 'What is the main topic?', answer: 'teeth', options: ['teeth', 'food', 'brushing'], hint: 'What word appears in every sentence?' },
        { passage: 'Ants live in colonies underground. Each ant has a job. Some ants find food. Other ants guard the colony.', question: 'What is the main topic?', answer: 'ants and their colony', options: ['ants and their colony', 'underground homes', 'finding food'], hint: 'All the sentences are about the same group of animals.' },
        { passage: 'Water can be a solid, liquid, or gas. Ice is solid water. Steam is water as a gas. When ice melts, it becomes liquid water.', question: 'What is the main topic?', answer: 'forms of water', options: ['forms of water', 'ice cubes', 'steam engines'], hint: 'The text explains different forms of the same thing.' },
        { passage: 'George Washington was the first president of the United States. He led the army in the war. Many people call him the Father of Our Country.', question: 'What is the main topic?', answer: 'George Washington', options: ['George Washington', 'the army', 'the United States'], hint: 'Who is every sentence about?' },
      ],
    },
    'retell-key-details': {
      items: [
        { passage: 'Caterpillars hatch from tiny eggs. They eat leaves and grow bigger. Then they form a chrysalis. Finally, a butterfly comes out.', question: 'What happens after the caterpillar eats leaves?', answer: 'it forms a chrysalis', options: ['it forms a chrysalis', 'it lays eggs', 'it flies away'], hint: 'Follow the order: eggs, eating, then what?' },
        { passage: 'Recycling means using things again. Paper, glass, and plastic can be recycled. Recycling helps keep Earth clean.', question: 'What things can be recycled?', answer: 'paper, glass, and plastic', options: ['paper, glass, and plastic', 'only paper', 'food and water'], hint: 'The second sentence lists them.' },
        { passage: 'Abraham Lincoln was the 16th president. He worked to end slavery. He was born in a log cabin in Kentucky.', question: 'Where was Lincoln born?', answer: 'in a log cabin in Kentucky', options: ['in a log cabin in Kentucky', 'in the White House', 'in a city'], hint: 'Find the sentence that tells where he was born.' },
        { passage: 'A thermometer measures temperature. When it is hot, the number goes up. When it is cold, the number goes down.', question: 'What does a thermometer measure?', answer: 'temperature', options: ['temperature', 'weight', 'speed'], hint: 'The first sentence tells you exactly.' },
        { passage: 'Dolphins are mammals, not fish. They breathe air and feed milk to their babies. Dolphins are very smart animals.', question: 'Are dolphins fish?', answer: 'no, they are mammals', options: ['no, they are mammals', 'yes', 'they are birds'], hint: 'Read the very first sentence.' },
        { passage: 'Honey bees do a special dance to talk to other bees. The dance shows where flowers are. Other bees follow the directions to find food.', question: 'Why do honey bees dance?', answer: 'to show where flowers are', options: ['to show where flowers are', 'for fun', 'to stay warm'], hint: 'What does the dance tell other bees?' },
      ],
    },
    'text-features-basic': {
      items: [
        { passage: 'A book about dinosaurs has a table of contents. It lists chapters like "Meat Eaters" on page 5 and "Plant Eaters" on page 12.', question: 'What does a table of contents help you do?', answer: 'find what page a topic is on', options: ['find what page a topic is on', 'learn new words', 'see pictures'], hint: 'It lists chapters and page numbers.' },
        { passage: 'A glossary is at the back of a book. It lists hard words and their meanings in ABC order.', question: 'What does a glossary do?', answer: 'tells what hard words mean', options: ['tells what hard words mean', 'lists chapters', 'shows pictures'], hint: 'What do you find in a glossary?' },
        { passage: 'The heading at the top of the page says "Life in the Arctic." Below the heading, the text is about Arctic animals.', question: 'What does a heading tell you?', answer: 'what the section is about', options: ['what the section is about', 'who wrote the book', 'what page you are on'], hint: 'A heading introduces the section topic.' },
        { passage: 'In a nonfiction book about space, the word "orbit" is in bold. Bold words are important vocabulary.', question: 'Why is the word "orbit" in bold?', answer: 'it is an important vocabulary word', options: ['it is an important vocabulary word', 'it is a name', 'it is a mistake'], hint: 'Bold text signals something important.' },
        { passage: 'Under a photograph of a rainforest, it says "The Amazon rainforest is home to millions of species." This sentence is a caption.', question: 'What is a caption?', answer: 'words that explain a picture', options: ['words that explain a picture', 'a chapter title', 'the author name'], hint: 'A caption goes with a photograph or picture.' },
        { passage: 'A nonfiction book has an index at the back. It lists topics in ABC order with page numbers so you can find them quickly.', question: 'How is an index organized?', answer: 'in ABC order', options: ['in ABC order', 'by chapter', 'by date'], hint: 'Like a dictionary, it uses alphabetical order.' },
      ],
    },
    'who-what-where-when': {
      items: [
        { passage: 'In 1969, astronaut Neil Armstrong walked on the moon. He was the first person to do this. Millions of people watched on TV.', question: 'WHO walked on the moon?', answer: 'Neil Armstrong', options: ['Neil Armstrong', 'a scientist', 'the president'], hint: 'The text names a specific astronaut.' },
        { passage: 'Earthquakes happen when rocks deep underground shift and move. The ground shakes and buildings can fall.', question: 'WHAT happens during an earthquake?', answer: 'the ground shakes', options: ['the ground shakes', 'it rains hard', 'wind blows'], hint: 'What does the text say happens?' },
        { passage: 'Polar bears live in the Arctic. It is very cold there. Thick fur keeps the bears warm.', question: 'WHERE do polar bears live?', answer: 'in the Arctic', options: ['in the Arctic', 'in the desert', 'in the forest'], hint: 'Find the place name in the first sentence.' },
        { passage: 'Every spring, cherry blossoms bloom in Washington, D.C. Thousands of people visit to see the pink and white flowers.', question: 'WHEN do cherry blossoms bloom?', answer: 'in spring', options: ['in spring', 'in winter', 'in summer'], hint: 'What season is mentioned?' },
        { passage: 'Benjamin Franklin flew a kite in a storm to learn about electricity. This experiment was very dangerous.', question: 'WHY did Benjamin Franklin fly a kite in a storm?', answer: 'to learn about electricity', options: ['to learn about electricity', 'for fun', 'to catch lightning'], hint: 'What was he trying to learn?' },
        { passage: 'Sea turtles travel thousands of miles through the ocean. They swim back to the same beach where they were born to lay their eggs.', question: 'WHERE do sea turtles lay their eggs?', answer: 'on the beach where they were born', options: ['on the beach where they were born', 'in the deep ocean', 'on any beach'], hint: 'Find the sentence about laying eggs.' },
      ],
    },
  },
  'grade-2': {
    'main-topic-multiparagraph': {
      items: [
        { passage: 'Bats are the only mammals that can fly. They have wings made of thin skin. Most bats come out at night.\n\nBats help people in many ways. Some bats eat insects like mosquitoes. Other bats spread seeds that help plants grow.', question: 'What is the main topic of both paragraphs?', answer: 'bats and why they are important', options: ['bats and why they are important', 'insects', 'flying animals'], hint: 'What connects both paragraphs together?' },
        { passage: 'The Sahara Desert in Africa is very hot and dry. Very little rain falls there. Sand dunes can be as tall as buildings.\n\nSome animals still live in the Sahara. Camels store water in their bodies. Scorpions hide under rocks during the day.', question: 'What is the main topic?', answer: 'the Sahara Desert', options: ['the Sahara Desert', 'camels', 'Africa'], hint: 'Both paragraphs describe the same place.' },
        { passage: 'Thomas Edison invented the light bulb. Before his invention, people used candles and oil lamps to see at night.\n\nEdison also invented the phonograph, which played sound recordings. He had over 1,000 patents for his ideas.', question: 'What is the main topic?', answer: 'Thomas Edison and his inventions', options: ['Thomas Edison and his inventions', 'light bulbs', 'candles'], hint: 'Who are both paragraphs about?' },
        { passage: 'Volcanoes are mountains with openings at the top. Hot melted rock called lava can erupt from them.\n\nVolcanoes can be found all over the world. Many are along the edges of the Pacific Ocean in an area called the Ring of Fire.', question: 'What is the main topic?', answer: 'volcanoes', options: ['volcanoes', 'the Pacific Ocean', 'mountains'], hint: 'What word appears in both paragraphs?' },
        { passage: 'Butterflies start life as tiny eggs on leaves. Caterpillars hatch and eat until they are big. Then they make a chrysalis.\n\nInside the chrysalis, an amazing change happens. The caterpillar becomes a butterfly with colorful wings. Then it flies away.', question: 'What is the main topic?', answer: 'how a caterpillar becomes a butterfly', options: ['how a caterpillar becomes a butterfly', 'leaves and plants', 'colorful wings'], hint: 'Both paragraphs follow a process from start to finish.' },
        { passage: 'The human body has 206 bones. Bones give the body its shape and protect organs inside. The skull protects the brain.\n\nBones are alive and growing. Kids have more bones than adults because some bones join together as you grow.', question: 'What is the main topic?', answer: 'bones in the human body', options: ['bones in the human body', 'the brain', 'growing up'], hint: 'What do both paragraphs describe?' },
      ],
    },
    'text-features-captions-bold': {
      items: [
        { passage: 'The word "habitat" is in bold in a book about animals. At the bottom of the page is a definition: habitat — the place where an animal lives.', question: 'Why is "habitat" in bold?', answer: 'it is a key vocabulary word', options: ['it is a key vocabulary word', 'it is a name', 'it is a title'], hint: 'Bold words signal important terms to learn.' },
        { passage: 'Under a picture of the Grand Canyon, the caption reads: "The Grand Canyon was carved by the Colorado River over millions of years."', question: 'What does the caption tell you?', answer: 'how the Grand Canyon was formed', options: ['how the Grand Canyon was formed', 'who lives there', 'how deep it is'], hint: 'Read what the caption says.' },
        { passage: 'A chart shows three columns: Animal, Habitat, and Diet. The row for "Penguin" shows "Antarctica" and "Fish."', question: 'What information does the chart give about penguins?', answer: 'where they live and what they eat', options: ['where they live and what they eat', 'how tall they are', 'how they swim'], hint: 'Look at the column headings.' },
        { passage: 'A subheading says "How Plants Make Food." The paragraph below explains photosynthesis.', question: 'What does the subheading help you predict?', answer: 'the section will explain how plants make food', options: ['the section will explain how plants make food', 'the section is about animals', 'the section is about cooking'], hint: 'Subheadings preview what a section is about.' },
        { passage: 'A diagram shows the water cycle with arrows. Labels say "evaporation," "condensation," and "precipitation."', question: 'What does the diagram help you understand?', answer: 'the steps of the water cycle', options: ['the steps of the water cycle', 'how fish swim', 'why oceans are salty'], hint: 'Diagrams show how something works step by step.' },
        { passage: 'A map in a book about the 50 states shows each state in a different color. A key at the bottom explains which color means which region.', question: 'What does the map key do?', answer: 'explains what the colors mean', options: ['explains what the colors mean', 'lists state capitals', 'shows rivers'], hint: 'A map key decodes symbols and colors on a map.' },
      ],
    },
    'author-purpose-basic': {
      items: [
        { passage: 'Washing your hands with soap kills germs. You should wash your hands before eating and after using the bathroom. Clean hands help you stay healthy.', question: 'Why did the author write this?', answer: 'to inform readers about handwashing', options: ['to inform readers about handwashing', 'to entertain with a story', 'to sell soap'], hint: 'Is the author trying to inform, persuade, or entertain?' },
        { passage: 'Everyone should recycle! Recycling saves trees and keeps trash out of the ocean. Please put cans and bottles in the blue bin.', question: 'What is the author trying to do?', answer: 'persuade readers to recycle', options: ['persuade readers to recycle', 'tell a funny story', 'describe the ocean'], hint: 'Words like "should" and "please" give a clue.' },
        { passage: 'The Earth spins on its axis once every 24 hours. This is why we have day and night. The side facing the sun has daytime.', question: 'Why did the author write this text?', answer: 'to explain why we have day and night', options: ['to explain why we have day and night', 'to make you laugh', 'to convince you the sun is important'], hint: 'The author is sharing facts to teach you something.' },
        { passage: 'Dogs are the best pets in the world. They are loyal, fun, and always happy to see you. Everyone should adopt a dog today!', question: 'What is the author trying to do?', answer: 'persuade readers that dogs are the best pets', options: ['persuade readers that dogs are the best pets', 'teach about dog breeds', 'explain how dogs are born'], hint: 'The author uses strong opinions and tells you what to do.' },
        { passage: 'Mars is the fourth planet from the sun. It is called the Red Planet because of its reddish soil. Scientists have sent robots to explore Mars.', question: 'Why did the author write this?', answer: 'to inform readers about Mars', options: ['to inform readers about Mars', 'to persuade you to visit Mars', 'to entertain you with a Mars story'], hint: 'The author shares facts without opinions.' },
        { passage: 'Drink more water every day! Water keeps your brain sharp and your body strong. Soda and juice have too much sugar.', question: 'What is the author trying to do?', answer: 'persuade readers to drink more water', options: ['persuade readers to drink more water', 'teach how water is made', 'tell a funny story about water'], hint: 'The exclamation point and "should" language are persuasive clues.' },
      ],
    },
    'compare-two-texts': {
      items: [
        { passage: 'Text A: "Sharks have been around for millions of years. They have rows of sharp teeth. Most sharks eat fish."\n\nText B: "Dolphins are mammals that live in the ocean. They are very smart. Dolphins eat fish and squid."', question: 'What do both texts have in common?', answer: 'both animals live in the ocean and eat fish', options: ['both animals live in the ocean and eat fish', 'both are about mammals', 'both are about teeth'], hint: 'What is similar in both texts?' },
        { passage: 'Text A: "The Arctic is a frozen area around the North Pole. Polar bears and seals live there."\n\nText B: "The Sahara Desert is a hot, dry area in Africa. Camels and scorpions live there."', question: 'How are these texts different?', answer: 'one describes a cold place and one describes a hot place', options: ['one describes a cold place and one describes a hot place', 'they are about the same animals', 'both describe oceans'], hint: 'Compare the climate of each place.' },
        { passage: 'Text A: "Apples grow on trees in orchards. They can be red, green, or yellow."\n\nText B: "Strawberries grow on small plants close to the ground. They are red and have tiny seeds on the outside."', question: 'How are apples and strawberries different in how they grow?', answer: 'apples grow on trees and strawberries grow on small plants', options: ['apples grow on trees and strawberries grow on small plants', 'they both grow underground', 'they grow in the same way'], hint: 'Where does each fruit grow?' },
        { passage: 'Text A: "Bicycles have two wheels and pedals. You use your legs to make a bicycle move."\n\nText B: "Cars have four wheels and an engine. You use gasoline to make a car move."', question: 'What do both texts explain?', answer: 'how each vehicle moves', options: ['how each vehicle moves', 'how to build a car', 'why bikes are better'], hint: 'Both texts describe how something works.' },
        { passage: 'Text A: "Abraham Lincoln was the 16th president. He helped end slavery in America."\n\nText B: "George Washington was the 1st president. He led the country after the Revolutionary War."', question: 'What do both texts have in common?', answer: 'both are about U.S. presidents', options: ['both are about U.S. presidents', 'both are about wars', 'both are about slavery'], hint: 'What role did both people share?' },
        { passage: 'Text A: "Frogs begin life as tadpoles in the water. They grow legs and lose their tails."\n\nText B: "Butterflies begin life as caterpillars. They form a chrysalis before getting wings."', question: 'What do these texts have in common?', answer: 'both describe animals that go through big changes', options: ['both describe animals that go through big changes', 'both are about insects', 'both are about water animals'], hint: 'Both animals start as one thing and become another.' },
      ],
    },
  },
  'grade-3': {
    'main-idea-details': {
      items: [
        { passage: 'Honeybees are important to farmers. Bees carry pollen from one flower to another, which helps plants make fruit. Without bees, we would lose many of the foods we eat, like apples, almonds, and blueberries.', question: 'What is the main idea?', answer: 'honeybees are important because they help plants produce food', options: ['honeybees are important because they help plants produce food', 'bees like flowers', 'apples grow on trees'], hint: 'What is the author\'s most important point about bees?' },
        { passage: 'The Great Wall of China is over 13,000 miles long. It was built over many centuries to protect China from invaders. Today, millions of tourists visit the wall every year.', question: 'What is the main idea?', answer: 'the Great Wall of China is a long, historic structure built for protection', options: ['the Great Wall of China is a long, historic structure built for protection', 'China has tourists', 'walls are made of stone'], hint: 'What does the text mostly tell you about the Great Wall?' },
        { passage: 'Camels are well suited for life in the desert. Their humps store fat, which gives them energy when food is scarce. Wide feet keep them from sinking in sand. They can close their nostrils during sandstorms.', question: 'What is the main idea?', answer: 'camels have features that help them survive in the desert', options: ['camels have features that help them survive in the desert', 'camels have humps', 'deserts have sandstorms'], hint: 'All the details support one big idea about camels.' },
        { passage: 'The rainforest has more species of plants and animals than any other place on Earth. Scientists discover new species there every year. Sadly, large parts of the rainforest are being cut down.', question: 'Which detail supports the main idea that rainforests are important?', answer: 'they have more species than any other place', options: ['they have more species than any other place', 'scientists work there', 'trees are being cut down'], hint: 'Which fact shows why the rainforest matters?' },
        { passage: 'Robots are being used in more and more places. In hospitals, robots help doctors do surgery. In warehouses, robots move boxes. Some robots even vacuum your house.', question: 'What is the main idea?', answer: 'robots are being used in many different places', options: ['robots are being used in many different places', 'robots can vacuum', 'hospitals use technology'], hint: 'What big point do all the details support?' },
        { passage: 'Owls are excellent hunters. They can turn their heads almost all the way around to spot prey. Their large eyes help them see in the dark. Soft feathers let them fly without making a sound.', question: 'Which detail supports the idea that owls are great hunters?', answer: 'soft feathers let them fly silently', options: ['soft feathers let them fly silently', 'owls are birds', 'owls live in trees'], hint: 'Which detail explains how they catch prey?' },
      ],
    },
    'text-features-locate': {
      items: [
        { passage: 'You are reading a book about weather. The table of contents lists: Ch. 1 Clouds (p. 4), Ch. 2 Rain (p. 12), Ch. 3 Tornadoes (p. 20).', question: 'Which page would you turn to to learn about tornadoes?', answer: 'page 20', options: ['page 20', 'page 4', 'page 12'], hint: 'Use the table of contents to find the right chapter.' },
        { passage: 'A book about the ocean has an index. Under "C" you see: coral reef 15, 22; crabs 8; currents 30.', question: 'On which pages can you find information about coral reefs?', answer: 'pages 15 and 22', options: ['pages 15 and 22', 'page 8', 'page 30'], hint: 'Look at the numbers next to "coral reef."' },
        { passage: 'A science book has a glossary. It includes: magnet — an object that attracts iron; mass — how much matter an object has; molecule — tiny particles.', question: 'What does "mass" mean according to the glossary?', answer: 'how much matter an object has', options: ['how much matter an object has', 'an object that attracts iron', 'tiny particles'], hint: 'Find "mass" and read its definition.' },
        { passage: 'The subheading says "Migration Patterns." The paragraph describes how monarch butterflies fly south every fall.', question: 'What did the subheading help you predict about the paragraph?', answer: 'it would be about how animals move from place to place', options: ['it would be about how animals move from place to place', 'it would be about butterfly colors', 'it would be about spring'], hint: 'Migration means moving from one place to another.' },
        { passage: 'A timeline in a history book shows: 1776 — Declaration signed, 1789 — Washington becomes president, 1803 — Louisiana Purchase.', question: 'What happened first according to the timeline?', answer: 'the Declaration was signed in 1776', options: ['the Declaration was signed in 1776', 'Washington became president', 'the Louisiana Purchase'], hint: 'The earliest date comes first on a timeline.' },
        { passage: 'A sidebar next to a paragraph about Benjamin Franklin says: "Fun Fact: Franklin invented swim fins when he was just 11 years old!"', question: 'What is the purpose of this sidebar?', answer: 'to share an interesting extra detail', options: ['to share an interesting extra detail', 'to start a new chapter', 'to correct an error'], hint: 'A sidebar adds bonus information related to the topic.' },
      ],
    },
    'text-structure-basic': {
      items: [
        { passage: 'First, a seed is planted in soil. Next, the seed gets water and sunlight. Then a sprout pushes up through the dirt. Finally, the plant grows leaves and flowers.', question: 'What text structure is used?', answer: 'sequence', options: ['sequence', 'cause and effect', 'compare and contrast'], hint: 'Look for order words like first, next, then, finally.' },
        { passage: 'Because the weather turned very cold, the pond froze solid. As a result, the ducks had to fly south to find open water.', question: 'What text structure is used?', answer: 'cause and effect', options: ['cause and effect', 'sequence', 'problem and solution'], hint: 'Look for words like "because" and "as a result."' },
        { passage: 'Frogs and toads are alike in some ways. Both are amphibians and eat insects. However, frogs have smooth, wet skin while toads have dry, bumpy skin.', question: 'What text structure is used?', answer: 'compare and contrast', options: ['compare and contrast', 'cause and effect', 'description'], hint: 'Look for words like "alike," "both," and "however."' },
        { passage: 'Many sea animals get tangled in plastic trash. To solve this problem, some towns have banned plastic bags. Volunteers also clean beaches to remove litter.', question: 'What text structure is used?', answer: 'problem and solution', options: ['problem and solution', 'sequence', 'compare and contrast'], hint: 'There is a problem and ways to fix it.' },
        { passage: 'The Amazon parrot is a colorful bird. It has bright green feathers, a red patch on its head, and yellow on its wings. It lives in tropical forests.', question: 'What text structure is used?', answer: 'description', options: ['description', 'sequence', 'cause and effect'], hint: 'The author describes what the bird looks like.' },
        { passage: 'Since factories put smoke into the air, the air quality got worse. Therefore, many people started having breathing problems.', question: 'What text structure is used?', answer: 'cause and effect', options: ['cause and effect', 'problem and solution', 'compare and contrast'], hint: '"Since" and "therefore" signal cause and effect.' },
      ],
    },
    'author-purpose-pov': {
      items: [
        { passage: 'I believe school lunch should include more fresh fruits and vegetables. Students who eat healthy foods do better on tests. We should demand healthier options!', question: 'What is the author\'s purpose?', answer: 'to persuade readers that school lunch should be healthier', options: ['to persuade readers that school lunch should be healthier', 'to describe a lunch menu', 'to explain how food is grown'], hint: 'The author uses "I believe" and "we should" — these are persuasive words.' },
        { passage: 'Spiders are NOT insects. Insects have six legs, but spiders have eight. Many people are afraid of spiders, but most spiders are harmless and actually help us by eating pests.', question: 'How does the author feel about spiders?', answer: 'the author thinks spiders are helpful and misunderstood', options: ['the author thinks spiders are helpful and misunderstood', 'the author is afraid of spiders', 'the author wants to sell spiders'], hint: 'Look for how the author describes spiders — positive or negative?' },
        { passage: 'Wolves once roamed across North America. By the 1900s, they were nearly gone. Some people want to bring wolves back, but ranchers worry wolves will harm their cattle.', question: 'Does the author take one side or present both sides?', answer: 'the author presents both sides', options: ['the author presents both sides', 'the author is against wolves', 'the author only supports wolves'], hint: 'The author shares what both groups think.' },
        { passage: 'Our town needs a new park! The old park has broken swings and no shade. A new park would give families a safe, fun place to gather.', question: 'What is the author\'s point of view?', answer: 'the town should build a new park', options: ['the town should build a new park', 'parks are not important', 'the old park is fine'], hint: 'What does the author want to happen?' },
        { passage: 'The Pacific Ocean is the largest ocean on Earth. It covers more area than all the land on the planet combined. It is also the deepest ocean.', question: 'What is the author\'s purpose?', answer: 'to inform readers about the Pacific Ocean', options: ['to inform readers about the Pacific Ocean', 'to persuade readers to visit', 'to entertain with a story'], hint: 'The author shares facts without opinions.' },
        { passage: 'Some scientists say screen time is bad for kids. Other scientists say some screen time can be educational. Both groups agree that balance is important.', question: 'Does the author take a side?', answer: 'no, the author presents different views and a shared agreement', options: ['no, the author presents different views and a shared agreement', 'yes, the author says screens are bad', 'yes, the author says screens are good'], hint: 'Notice how the author shows both opinions.' },
      ],
    },
    'context-vocabulary-nf': {
      items: [
        { passage: 'Nocturnal animals, such as owls and bats, are active at night and sleep during the day.', question: 'What does "nocturnal" mean?', answer: 'active at night', options: ['active at night', 'very loud', 'able to fly'], hint: 'The sentence explains the word right after it.' },
        { passage: 'The drought, a long period without rain, caused crops to dry up and rivers to shrink.', question: 'What does "drought" mean?', answer: 'a long period without rain', options: ['a long period without rain', 'a big storm', 'a type of plant'], hint: 'The definition is given between the commas.' },
        { passage: 'Erosion slowly wears away rocks and soil. Wind and water are the main causes of erosion along coastlines.', question: 'What does "erosion" mean?', answer: 'wearing away of rocks and soil', options: ['wearing away of rocks and soil', 'building up of mountains', 'a type of weather'], hint: 'Read what erosion does in the first sentence.' },
        { passage: 'The Arctic tundra is a frigid place where temperatures can drop to 40 degrees below zero.', question: 'What does "frigid" mean?', answer: 'extremely cold', options: ['extremely cold', 'very wet', 'very dark'], hint: 'The temperature clue tells you what frigid means.' },
        { passage: 'Herbivores are animals that eat only plants. Cows, deer, and rabbits are all herbivores.', question: 'What does "herbivore" mean?', answer: 'an animal that eats only plants', options: ['an animal that eats only plants', 'an animal that eats meat', 'a type of plant'], hint: 'The text defines the word right after saying it.' },
        { passage: 'Unlike most reptiles, which are solitary, sea turtles sometimes gather in large groups to nest. These gatherings can include hundreds of turtles.', question: 'What does "solitary" mean?', answer: 'living or being alone', options: ['living or being alone', 'living in water', 'moving slowly'], hint: '"Unlike...solitary" is contrasted with "gather in large groups."' },
      ],
    },
  },
  'grade-4': {
    'main-idea-summarize': {
      items: [
        { passage: 'The Amazon River is the second longest river in the world. It flows through South America and empties into the Atlantic Ocean. The river is home to thousands of species of fish, including piranhas and electric eels. The surrounding rainforest depends on the river for water.', question: 'Write a one-sentence summary of this passage.', answer: 'the Amazon River is a long, important river in South America that supports many species and the rainforest', hint: 'Include the topic and the most important details.' },
        { passage: 'Ancient Egyptians built the pyramids as tombs for their pharaohs. The Great Pyramid of Giza took about 20 years and thousands of workers to build. Huge stone blocks were cut and moved without modern machines. The pyramids still stand after over 4,000 years.', question: 'What is the main idea?', answer: 'the ancient Egyptians built impressive pyramids as tombs that still stand today', options: ['the ancient Egyptians built impressive pyramids as tombs that still stand today', 'pyramids are made of stone', 'Egypt is in Africa'], hint: 'What is the most important point about the pyramids?' },
        { passage: 'Wind turbines convert wind into electricity. They are usually built in windy areas like plains or coastlines. Wind energy does not produce pollution, making it a clean source of power. However, turbines can be noisy and may affect birds.', question: 'What is the main idea?', answer: 'wind turbines produce clean electricity but have some drawbacks', options: ['wind turbines produce clean electricity but have some drawbacks', 'wind is noisy', 'birds live near turbines'], hint: 'What big point does the author make about wind turbines?' },
        { passage: 'Coral reefs are sometimes called the "rainforests of the sea." They are home to about 25% of all ocean species. Reefs protect coastlines from strong waves. Climate change and pollution are causing reefs to shrink.', question: 'Summarize the passage in one sentence.', answer: 'coral reefs are important ocean ecosystems that support many species and protect coasts but are threatened by climate change', hint: 'Combine the key details into one sentence.' },
        { passage: 'The human heart beats about 100,000 times a day. It pumps blood through a network of blood vessels that, if laid end to end, would stretch over 60,000 miles. The heart never stops working, even when you sleep.', question: 'What is the main idea?', answer: 'the human heart works constantly to pump blood through a vast network', options: ['the human heart works constantly to pump blood through a vast network', 'hearts beat 100,000 times', 'blood vessels are long'], hint: 'What is the most important point about the heart?' },
        { passage: 'Harriet Tubman escaped slavery and then risked her life to help others escape through the Underground Railroad. She made about 13 trips back to the South and guided around 70 people to freedom. During the Civil War, she also served as a spy for the Union Army.', question: 'Summarize the passage.', answer: 'Harriet Tubman escaped slavery and bravely helped many others reach freedom through the Underground Railroad', hint: 'Focus on who she was and her most important actions.' },
      ],
    },
    'text-structure-identify': {
      items: [
        { passage: 'The invention of the printing press changed the world. Before the press, books were copied by hand, which took months. After the press was invented, books could be printed quickly. As a result, more people learned to read.', question: 'What text structure does this passage use?', answer: 'cause and effect', options: ['cause and effect', 'problem and solution', 'description'], hint: '"As a result" and "before/after" signal cause and effect.' },
        { passage: 'Many schools are dealing with too much food waste in the cafeteria. To address this, some schools have started composting programs. Students separate food scraps, which are turned into soil for the school garden.', question: 'What text structure is used?', answer: 'problem and solution', options: ['problem and solution', 'compare and contrast', 'sequence'], hint: 'There is a problem and a way to fix it.' },
        { passage: 'Ancient Greece and Ancient Rome were both powerful civilizations. Both built great buildings and had strong armies. However, Greece focused more on philosophy and democracy, while Rome built a vast empire with advanced roads and laws.', question: 'What text structure is used?', answer: 'compare and contrast', options: ['compare and contrast', 'cause and effect', 'description'], hint: '"Both" and "however" signal comparison.' },
        { passage: 'To make a fossil, an animal first dies near water. Mud covers its body. Over millions of years, minerals replace the bones. Eventually, the fossil is uncovered by wind or water.', question: 'What text structure is used?', answer: 'sequence', options: ['sequence', 'problem and solution', 'compare and contrast'], hint: 'Look for order words: first, over time, eventually.' },
        { passage: 'The Sonoran Desert in Arizona is a land of extremes. Temperatures can reach 120°F in summer. Saguaro cacti stand tall with thick green arms. Roadrunners dash across the sandy ground. Colorful sunsets paint the sky every evening.', question: 'What text structure is used?', answer: 'description', options: ['description', 'sequence', 'cause and effect'], hint: 'The author describes what the desert looks and feels like.' },
        { passage: 'Because Earth tilts on its axis, different parts of the planet get different amounts of sunlight throughout the year. This tilt is the reason we have seasons. When the Northern Hemisphere tilts toward the sun, it is summer there.', question: 'What text structure is used?', answer: 'cause and effect', options: ['cause and effect', 'compare and contrast', 'problem and solution'], hint: '"Because" and "the reason" signal cause and effect.' },
      ],
    },
    'evidence-explain': {
      items: [
        { passage: 'Dolphins are considered one of the smartest animals. They can learn tricks, recognize themselves in mirrors, and communicate with each other using clicks and whistles.', question: 'What evidence supports the claim that dolphins are smart?', answer: 'they learn tricks, recognize themselves in mirrors, and communicate with clicks', options: ['they learn tricks, recognize themselves in mirrors, and communicate with clicks', 'they live in the ocean', 'they swim fast'], hint: 'Which details prove the claim about intelligence?' },
        { passage: 'Exercise is important for staying healthy. Studies show that active kids have stronger bones and muscles. Exercise also helps students focus better in school.', question: 'What evidence shows that exercise helps students?', answer: 'active kids have stronger bones and muscles and focus better in school', options: ['active kids have stronger bones and muscles and focus better in school', 'exercise is popular', 'kids like to play'], hint: 'Find the specific benefits mentioned.' },
        { passage: 'The Dust Bowl of the 1930s was one of the worst environmental disasters in U.S. history. Strong winds blew away topsoil because farmers had removed the native grasses. Huge dust storms destroyed crops and forced families to leave their homes.', question: 'What caused the Dust Bowl according to the text?', answer: 'farmers removed native grasses so wind blew away the topsoil', options: ['farmers removed native grasses so wind blew away the topsoil', 'it rained too much', 'an earthquake hit the plains'], hint: 'Look for the word "because" to find the cause.' },
        { passage: 'Manatees are in danger of extinction. Boat strikes injure many manatees each year. Loss of warm-water habitats also threatens their survival. Conservation groups are working to protect them.', question: 'What evidence shows manatees are in danger?', answer: 'boat strikes injure them and they are losing warm-water habitats', options: ['boat strikes injure them and they are losing warm-water habitats', 'they are large animals', 'conservation groups exist'], hint: 'What specific threats does the text mention?' },
        { passage: 'Benjamin Franklin proved that lightning is electricity. In 1752, he flew a kite during a thunderstorm with a metal key attached. When lightning struck, the key gave off a spark, confirming his theory.', question: 'What evidence proved Franklin\'s theory?', answer: 'the metal key sparked when lightning struck the kite', options: ['the metal key sparked when lightning struck the kite', 'he flew a kite', 'it was raining'], hint: 'What specific result proved lightning is electricity?' },
        { passage: 'Plastic pollution is harming ocean life. Sea turtles mistake plastic bags for jellyfish and eat them. Seabirds have been found with stomachs full of plastic pieces.', question: 'What evidence shows plastic harms ocean animals?', answer: 'turtles eat plastic bags and seabirds are found with plastic in their stomachs', options: ['turtles eat plastic bags and seabirds are found with plastic in their stomachs', 'plastic is in the ocean', 'jellyfish are clear'], hint: 'Find the specific examples of harm to animals.' },
      ],
    },
    'author-reasoning': {
      items: [
        { passage: 'Zoos help protect endangered species. Many animals that were nearly extinct, like the California condor, have been saved through zoo breeding programs. Zoos also educate millions of visitors about wildlife.', question: 'What reasons does the author give to support zoos?', answer: 'zoos save endangered species through breeding programs and educate visitors', options: ['zoos save endangered species through breeding programs and educate visitors', 'zoos are fun to visit', 'animals live in cages'], hint: 'What two reasons does the author provide?' },
        { passage: 'Students should have longer recess. Research shows that physical activity helps kids concentrate. Students who have more play time perform better on tests and have fewer behavior problems.', question: 'What evidence does the author use to support longer recess?', answer: 'research shows activity helps concentration, test scores improve, and behavior problems decrease', options: ['research shows activity helps concentration, test scores improve, and behavior problems decrease', 'kids like recess', 'recess is fun'], hint: 'Find the specific research results mentioned.' },
        { passage: 'Electric cars are better for the environment than gas cars. They produce zero emissions while driving. As electricity comes from cleaner sources like solar and wind, electric cars will become even greener.', question: 'What is the author\'s main argument?', answer: 'electric cars are better for the environment', options: ['electric cars are better for the environment', 'electric cars are cheaper', 'gas cars are faster'], hint: 'What point is the author trying to prove?' },
        { passage: 'Space exploration is worth the cost. Satellites give us weather forecasts, GPS, and internet. Medical research in space has led to better heart monitors and water purification systems on Earth.', question: 'How does the author support the claim that space exploration is worth the cost?', answer: 'by listing useful inventions and technologies that came from space research', options: ['by listing useful inventions and technologies that came from space research', 'by describing how cool space is', 'by explaining rocket science'], hint: 'What examples does the author give to prove the point?' },
        { passage: 'Homework helps students practice what they learn in school. However, too much homework can cause stress and take away family time. Experts recommend no more than 10 minutes per grade level each night.', question: 'Does the author think homework is entirely good or bad?', answer: 'the author sees both benefits and drawbacks of homework', options: ['the author sees both benefits and drawbacks of homework', 'the author thinks homework is always good', 'the author is against all homework'], hint: 'The author uses "however" to show a different perspective.' },
        { passage: 'Farmers markets are good for communities. They provide fresh, local food that doesn\'t travel far. They support local farmers and create a gathering place for neighbors.', question: 'What reasons does the author give to support farmers markets?', answer: 'they provide fresh local food, support local farmers, and bring the community together', options: ['they provide fresh local food, support local farmers, and bring the community together', 'they are cheaper than stores', 'they sell organic food only'], hint: 'The author lists three specific benefits.' },
      ],
    },
    'interpret-visuals': {
      items: [
        { passage: 'A bar graph shows rainfall in inches for four months: March (3 in.), April (5 in.), May (4 in.), June (2 in.).', question: 'Which month had the most rain?', answer: 'April', options: ['April', 'March', 'June'], hint: 'Find the tallest bar on the graph.' },
        { passage: 'A diagram of the water cycle shows arrows going from the ocean up to clouds (evaporation), from clouds to rain (precipitation), and from rain flowing back to the ocean (collection).', question: 'What happens after evaporation according to the diagram?', answer: 'water forms clouds and then precipitation falls', options: ['water forms clouds and then precipitation falls', 'water freezes', 'the ocean dries up'], hint: 'Follow the arrows from evaporation to the next step.' },
        { passage: 'A pie chart shows how a student spends a school day: Instruction 50%, Lunch/Recess 20%, Specials 15%, Transitions 15%.', question: 'What takes up the most time in a school day?', answer: 'instruction', options: ['instruction', 'lunch and recess', 'specials'], hint: 'Find the largest slice of the pie chart.' },
        { passage: 'A timeline shows: 1903 — Wright Brothers first flight, 1927 — Lindbergh crosses Atlantic, 1969 — Moon landing, 2004 — Mars rover lands.', question: 'How many years passed between the first flight and the moon landing?', answer: '66 years', options: ['66 years', '42 years', '100 years'], hint: 'Subtract 1903 from 1969.' },
        { passage: 'A food web diagram shows arrows from grass to rabbits, from rabbits to foxes, and from grass to deer, and from deer to wolves.', question: 'According to the food web, what do foxes eat?', answer: 'rabbits', options: ['rabbits', 'grass', 'wolves'], hint: 'Follow the arrow that points to foxes.' },
        { passage: 'A map shows the Oregon Trail from Missouri to Oregon. Cities marked along the trail include Independence, Fort Kearny, Fort Laramie, and Oregon City.', question: 'Where did the Oregon Trail begin?', answer: 'Missouri', options: ['Missouri', 'Oregon', 'Fort Laramie'], hint: 'The trail goes from east to west — find the starting point.' },
      ],
    },
    'integrate-two-texts': {
      items: [
        { passage: 'Text A: "Solar energy comes from the sun. Solar panels turn sunlight into electricity. Solar energy is renewable and clean."\n\nText B: "Wind energy uses turbines to generate electricity. Like solar, wind is renewable. However, wind turbines work best in open, windy areas."', question: 'Using both texts, name two types of renewable energy.', answer: 'solar energy and wind energy', options: ['solar energy and wind energy', 'solar and coal', 'wind and gas'], hint: 'Each text describes a different renewable source.' },
        { passage: 'Text A: "Wolves hunt in packs. They chase large prey like elk and deer. Wolves run up to 40 miles per hour."\n\nText B: "Mountain lions hunt alone. They stalk and ambush their prey. Mountain lions can leap 40 feet in one jump."', question: 'How do wolves and mountain lions hunt differently?', answer: 'wolves hunt in packs by chasing prey while mountain lions hunt alone by ambushing', options: ['wolves hunt in packs by chasing prey while mountain lions hunt alone by ambushing', 'they both hunt the same way', 'neither one hunts'], hint: 'Compare the hunting styles described in each text.' },
        { passage: 'Text A: "Rosa Parks refused to give up her bus seat in 1955. Her arrest sparked the Montgomery Bus Boycott."\n\nText B: "Martin Luther King Jr. led the Montgomery Bus Boycott. The boycott lasted over a year and helped end bus segregation."', question: 'Using both texts, what caused the Montgomery Bus Boycott?', answer: 'Rosa Parks was arrested for not giving up her bus seat', options: ['Rosa Parks was arrested for not giving up her bus seat', 'Martin Luther King organized it for no reason', 'buses were too crowded'], hint: 'Text A explains what started it; Text B explains what happened next.' },
        { passage: 'Text A: "The Arctic is warming twice as fast as the rest of the world. Sea ice is melting at an alarming rate."\n\nText B: "Polar bears depend on sea ice to hunt seals. As ice disappears, polar bears have to swim farther and find less food."', question: 'Using both texts, why are polar bears in danger?', answer: 'Arctic warming is melting the sea ice that polar bears need for hunting', options: ['Arctic warming is melting the sea ice that polar bears need for hunting', 'polar bears cannot swim', 'seals are leaving the Arctic'], hint: 'Connect the cause from Text A with the effect in Text B.' },
        { passage: 'Text A: "Ancient Romans built roads that connected their empire. Many Roman roads still exist today."\n\nText B: "The U.S. Interstate Highway System was built in the 1950s. It connected all major cities across America."', question: 'What do both texts have in common?', answer: 'both describe road systems that connected large areas', options: ['both describe road systems that connected large areas', 'both are about ancient history', 'both describe bridges'], hint: 'What similar purpose did both road systems serve?' },
        { passage: 'Text A: "Earthquakes happen when tectonic plates shift suddenly. They can cause buildings to collapse."\n\nText B: "Engineers now design earthquake-resistant buildings. These buildings flex instead of cracking during an earthquake."', question: 'Using both texts, how have people responded to the danger of earthquakes?', answer: 'engineers designed buildings that flex to survive earthquakes', options: ['engineers designed buildings that flex to survive earthquakes', 'people moved away from earthquake zones', 'earthquakes stopped happening'], hint: 'Text A shows the problem; Text B shows the response.' },
      ],
    },
  },
  'grade-5': {
    'multiple-main-ideas': {
      items: [
        { passage: 'The Nile River is the longest river in Africa. It flows northward for over 4,000 miles. Ancient Egyptians depended on the Nile for farming because its floods deposited rich soil. Today, the Nile still provides water for millions of people and is important for transportation and trade.', question: 'What are the two main ideas?', answer: 'the Nile is an important geographic feature and it has supported people from ancient times to today', options: ['the Nile is an important geographic feature and it has supported people from ancient times to today', 'the Nile is long and goes north', 'Egypt is in Africa'], hint: 'One idea is about what the Nile is; the other is about why it matters.' },
        { passage: 'Octopuses are highly intelligent sea creatures. They can solve puzzles, open jars, and even escape from tanks. They are also masters of disguise, changing color and texture to blend in with their surroundings in milliseconds.', question: 'What are the two main ideas?', answer: 'octopuses are very intelligent and they can camouflage themselves', options: ['octopuses are very intelligent and they can camouflage themselves', 'octopuses live in the sea', 'octopuses open jars'], hint: 'The passage describes two remarkable abilities.' },
        { passage: 'The Industrial Revolution changed how goods were made. Machines in factories replaced work done by hand. It also changed where people lived. Many families moved from farms to cities to work in factories.', question: 'What are the two main ideas?', answer: 'the Industrial Revolution changed manufacturing and changed where people lived', options: ['the Industrial Revolution changed manufacturing and changed where people lived', 'factories had machines', 'people moved to cities'], hint: 'Look for two major changes described in the text.' },
        { passage: 'Vaccines have saved millions of lives by preventing deadly diseases like polio and measles. They work by teaching the body\'s immune system to recognize and fight viruses. However, some diseases mutate rapidly, which is why new flu vaccines are needed every year.', question: 'What are the two main ideas?', answer: 'vaccines prevent deadly diseases by training the immune system, but some diseases require updated vaccines', options: ['vaccines prevent deadly diseases by training the immune system, but some diseases require updated vaccines', 'polio was deadly', 'the flu changes'], hint: 'One idea is about how vaccines help; the other is about a challenge.' },
        { passage: 'The Grand Canyon is one of the most spectacular natural formations on Earth. It stretches 277 miles long and is over a mile deep. The canyon also tells the story of Earth\'s history. Its rock layers reveal nearly two billion years of geological changes.', question: 'What are the two main ideas?', answer: 'the Grand Canyon is an impressive natural feature and its rock layers reveal Earth history', options: ['the Grand Canyon is an impressive natural feature and its rock layers reveal Earth history', 'the canyon is deep', 'rocks are old'], hint: 'One idea is about its size; the other is about what it teaches us.' },
        { passage: 'Monarch butterflies travel up to 3,000 miles each fall to reach their winter homes in Mexico. This incredible journey uses internal compasses and the position of the sun. Climate change and habitat loss are making this migration harder and threatening monarch populations.', question: 'What are the two main ideas?', answer: 'monarchs make an incredible migration journey and their migration is threatened by climate change', options: ['monarchs make an incredible migration journey and their migration is threatened by climate change', 'butterflies go to Mexico', 'monarchs use the sun'], hint: 'One idea describes the amazing journey; the other describes a problem.' },
      ],
    },
    'compare-text-structures': {
      items: [
        { passage: 'Text A uses time-order words: "First settlers arrived, then they built houses, next they planted crops, finally the town grew."\n\nText B explains: "Because settlers built near a river, they had fresh water. As a result, the town grew quickly."', question: 'How do the text structures differ?', answer: 'Text A uses sequence structure while Text B uses cause and effect', options: ['Text A uses sequence structure while Text B uses cause and effect', 'both use sequence', 'both use cause and effect'], hint: 'Look at the signal words in each text.' },
        { passage: 'Text A: "Hurricanes and tornadoes are both dangerous storms. However, hurricanes form over warm ocean water, while tornadoes form over land."\n\nText B: "A hurricane begins as warm ocean air rises. Then winds start to spin. Next, the storm gets stronger. Finally, it hits land."', question: 'How are the structures different?', answer: 'Text A uses compare and contrast while Text B uses sequence', options: ['Text A uses compare and contrast while Text B uses sequence', 'both use compare and contrast', 'both describe a problem'], hint: 'Text A has "however" and "while"; Text B has "then," "next," "finally."' },
        { passage: 'Text A: "Too many deer are destroying gardens and crops. To solve this, some areas allow controlled hunting seasons."\n\nText B: "The deer population has grown because natural predators like wolves were removed. Therefore, deer now outnumber the food supply."', question: 'How do the structures differ?', answer: 'Text A uses problem and solution while Text B uses cause and effect', options: ['Text A uses problem and solution while Text B uses cause and effect', 'both use problem and solution', 'both use description'], hint: '"To solve this" signals problem/solution; "because" signals cause/effect.' },
        { passage: 'Text A describes a coral reef: "Bright fish dart between colorful coral branches. Sea anemones wave gently in the current."\n\nText B explains: "Coral reefs are dying because ocean temperatures are rising. As a result, many marine species are losing their homes."', question: 'How do the structures differ?', answer: 'Text A uses description while Text B uses cause and effect', options: ['Text A uses description while Text B uses cause and effect', 'both use description', 'both use cause and effect'], hint: 'Text A paints a picture; Text B explains why something happens.' },
        { passage: 'Text A: "Step 1: Collect materials. Step 2: Mix ingredients. Step 3: Pour into mold. Step 4: Let it dry."\n\nText B: "Concrete is strong and durable, similar to stone. Unlike wood, concrete does not rot or burn easily."', question: 'How do the structures differ?', answer: 'Text A uses sequence while Text B uses compare and contrast', options: ['Text A uses sequence while Text B uses compare and contrast', 'both use sequence', 'both compare'], hint: 'Text A has numbered steps; Text B uses "similar to" and "unlike."' },
        { passage: 'Text A: "Pollution is harming the lake. The town decided to ban dumping and build a water treatment plant."\n\nText B: "Lake Erie is 241 miles long. It is the shallowest of the five Great Lakes. Its waters are home to walleye and perch."', question: 'How do the structures differ?', answer: 'Text A uses problem and solution while Text B uses description', options: ['Text A uses problem and solution while Text B uses description', 'both describe a lake', 'both identify problems'], hint: 'Text A identifies a problem and a fix; Text B just describes.' },
      ],
    },
    'quote-accurately': {
      items: [
        { passage: 'The text states: "The cheetah is the fastest land animal, reaching speeds of up to 70 miles per hour."', question: 'According to the text, how fast can a cheetah run?', answer: 'up to 70 miles per hour', options: ['up to 70 miles per hour', 'up to 100 miles per hour', 'up to 50 miles per hour'], hint: 'Quote the exact number from the text.' },
        { passage: 'The article says: "Scientists estimate that the Amazon rainforest produces about 20 percent of the world\'s oxygen."', question: 'How much of the world\'s oxygen does the Amazon produce?', answer: 'about 20 percent', options: ['about 20 percent', 'about 50 percent', 'about 10 percent'], hint: 'Use the exact words from the text.' },
        { passage: 'The passage reads: "Unlike reptiles, amphibians must keep their skin moist because they absorb water through it rather than drinking."', question: 'According to the text, why must amphibians keep their skin moist?', answer: 'because they absorb water through their skin rather than drinking', options: ['because they absorb water through their skin rather than drinking', 'because they live in water', 'because they are cold'], hint: 'Find the reason stated after "because."' },
        { passage: 'The author writes: "The International Space Station orbits Earth approximately every 90 minutes, meaning astronauts see about 16 sunrises every day."', question: 'How many sunrises do astronauts see each day?', answer: 'about 16', options: ['about 16', 'about 8', 'about 24'], hint: 'Quote the exact number from the passage.' },
        { passage: 'The text explains: "Bald eagles were once endangered but made a remarkable recovery after the pesticide DDT was banned in 1972."', question: 'According to the text, what helped bald eagles recover?', answer: 'banning the pesticide DDT in 1972', options: ['banning the pesticide DDT in 1972', 'building more nests', 'feeding them fish'], hint: 'What specific action does the text mention?' },
        { passage: 'The article states: "The human brain uses about 20 percent of the body\'s total energy, even though it makes up only 2 percent of body weight."', question: 'How much energy does the brain use according to the text?', answer: 'about 20 percent of the body\'s total energy', options: ['about 20 percent of the body\'s total energy', 'about 50 percent', 'about 2 percent'], hint: 'Be careful — there are two percentages. Which one is about energy?' },
      ],
    },
    'analyze-author-evidence': {
      items: [
        { passage: 'The author argues that school should start later for teenagers. She cites a study showing that teens who start school after 8:30 AM get better grades. She also notes that the American Academy of Pediatrics recommends later start times.', question: 'What types of evidence does the author use?', answer: 'a research study and an expert recommendation', options: ['a research study and an expert recommendation', 'personal stories', 'no evidence is given'], hint: 'Look for where the evidence comes from — a study and an organization.' },
        { passage: 'The author claims that reading every day makes you smarter. He supports this by explaining that reading builds vocabulary, improves memory, and strengthens critical thinking skills. However, he does not cite any specific studies.', question: 'Is the author\'s evidence strong or weak? Why?', answer: 'it is somewhat weak because the author makes claims without citing specific studies', options: ['it is somewhat weak because the author makes claims without citing specific studies', 'it is very strong because the claims sound true', 'it is perfect evidence'], hint: 'Does the author back up claims with proof?' },
        { passage: 'The writer argues that homework should be limited. She points to a Stanford study that found too much homework causes stress and sleep loss. She also shares stories from students who felt overwhelmed. Critics argue that homework builds discipline.', question: 'What makes this argument balanced?', answer: 'the author includes both evidence for her position and the opposing view', options: ['the author includes both evidence for her position and the opposing view', 'the author ignores other opinions', 'the author only uses stories'], hint: 'Does the author acknowledge the other side?' },
        { passage: 'An article claims that video games improve hand-eye coordination. The only evidence is that the author\'s nephew plays games and is good at sports.', question: 'Why is this evidence weak?', answer: 'it relies on one personal example rather than research or data', options: ['it relies on one personal example rather than research or data', 'it is about video games', 'the author is not a doctor'], hint: 'One person\'s experience doesn\'t prove something is true for everyone.' },
        { passage: 'The author argues that protecting wetlands is critical. She provides data showing wetlands filter 90% of pollutants from water. She cites the EPA and includes a case study of a town that restored its wetlands and reduced flooding by 60%.', question: 'What makes this evidence convincing?', answer: 'the author uses specific data, a government source, and a real-world example', options: ['the author uses specific data, a government source, and a real-world example', 'the author mentions a town', 'the author talks about water'], hint: 'Look at the variety and quality of evidence used.' },
        { passage: 'An advertisement says: "9 out of 10 dentists recommend BrightSmile toothpaste!" The ad does not say how many dentists were surveyed or who conducted the survey.', question: 'Why should you question this claim?', answer: 'the source and methods of the survey are not provided', options: ['the source and methods of the survey are not provided', 'dentists are not experts', 'toothpaste does not work'], hint: 'Missing details about how evidence was gathered is a red flag.' },
      ],
    },
    'multiple-sources': {
      items: [
        { passage: 'Source 1: "Pluto was reclassified as a dwarf planet in 2006 because it has not cleared its orbital path of other debris."\n\nSource 2: "Some scientists disagree with Pluto\'s reclassification and argue it should still be considered a planet based on its round shape and atmosphere."', question: 'What do you learn from reading both sources that you wouldn\'t learn from just one?', answer: 'that Pluto\'s classification is debated among scientists', options: ['that Pluto\'s classification is debated among scientists', 'that Pluto is a planet', 'that Pluto has no atmosphere'], hint: 'Each source gives a different perspective on the same topic.' },
        { passage: 'Source 1 (encyclopedia): "Honeybees pollinate about one-third of the food humans eat."\n\nSource 2 (news article): "Bee populations have dropped 40% in the last decade due to pesticides and habitat loss."\n\nSource 3 (interview with beekeeper): "I\'ve lost half my hives in five years. We need to stop using certain chemicals."', question: 'How does each source add to your understanding?', answer: 'the encyclopedia gives facts, the news gives data on the problem, and the beekeeper gives a personal perspective', options: ['the encyclopedia gives facts, the news gives data on the problem, and the beekeeper gives a personal perspective', 'they all say the same thing', 'only the encyclopedia matters'], hint: 'Each source contributes a different type of information.' },
        { passage: 'Source 1: "Mars has the largest volcano in the solar system, Olympus Mons."\n\nSource 2: "Mars once had liquid water on its surface, based on mineral evidence found by rovers."', question: 'Using both sources, what two important facts about Mars can you share?', answer: 'Mars has the solar system\'s largest volcano and once had liquid water', options: ['Mars has the solar system\'s largest volcano and once had liquid water', 'Mars has water now', 'Mars is close to Earth'], hint: 'Pull one key fact from each source.' },
        { passage: 'Source 1 (textbook): "The Boston Tea Party occurred in 1773 when colonists dumped tea into the harbor."\n\nSource 2 (letter from a colonist): "We disguised ourselves as Mohawks and threw every last chest of tea into the water. We would not be taxed without a voice!"', question: 'What does Source 2 add that Source 1 does not?', answer: 'a firsthand account with personal details and emotional perspective', options: ['a firsthand account with personal details and emotional perspective', 'the date of the event', 'a neutral summary'], hint: 'Source 2 is a primary source — written by someone who was there.' },
        { passage: 'Source 1: "Wind farms generate clean energy but can harm migrating birds."\n\nSource 2: "New wind turbine designs with slower blade speeds have reduced bird deaths by 70%."', question: 'How does Source 2 update the information in Source 1?', answer: 'it shows that newer technology is addressing the bird safety concern', options: ['it shows that newer technology is addressing the bird safety concern', 'it contradicts Source 1 completely', 'it has nothing to do with Source 1'], hint: 'Source 2 provides a solution to the problem mentioned in Source 1.' },
        { passage: 'Source 1: "Ancient Romans built aqueducts to carry water to cities."\n\nSource 2: "Some Roman aqueducts still stand today and a few are still in use, showing how well they were engineered."', question: 'What conclusion can you draw from both sources?', answer: 'Roman engineering was so advanced that structures they built thousands of years ago still function', options: ['Roman engineering was so advanced that structures they built thousands of years ago still function', 'Romans only built aqueducts', 'aqueducts are no longer useful'], hint: 'Combine what both sources tell you about Roman building quality.' },
      ],
    },
  },
  'grade-6': {
    'central-idea-summary': {
      items: [
        { passage: 'The discovery of penicillin in 1928 by Alexander Fleming revolutionized medicine. Before antibiotics, even small infections could be fatal. Fleming noticed that mold killed bacteria in a petri dish, leading to the development of the first antibiotic. Today, antibiotics save millions of lives, though overuse has led to drug-resistant bacteria.', question: 'What is the central idea?', answer: 'the discovery of penicillin transformed medicine by fighting infections, but overuse now poses new challenges', options: ['the discovery of penicillin transformed medicine by fighting infections, but overuse now poses new challenges', 'Fleming found mold in a dish', 'bacteria are dangerous'], hint: 'Identify the main point and the complication the author raises.' },
        { passage: 'Social media connects people across the globe instantly. It has helped organize social movements, reunite families, and share vital information during emergencies. However, it has also spread misinformation, increased cyberbullying, and raised concerns about mental health, especially among young people.', question: 'Write an objective summary.', answer: 'social media has both connected people and created significant concerns including misinformation and mental health effects', hint: 'Include both the benefits and the problems without taking sides.' },
        { passage: 'The Great Pacific Garbage Patch is a massive collection of floating trash in the Pacific Ocean, estimated to be twice the size of Texas. Most of it is microplastics that are nearly impossible to clean up. Marine animals ingest these plastics, and the toxins enter the food chain, eventually affecting humans.', question: 'What is the central idea?', answer: 'the Great Pacific Garbage Patch is a massive and dangerous pollution problem that affects ocean life and humans', options: ['the Great Pacific Garbage Patch is a massive and dangerous pollution problem that affects ocean life and humans', 'there is trash in the ocean', 'Texas is big'], hint: 'What is the author\'s most important message?' },
        { passage: 'The human genome was fully sequenced in 2003 after 13 years of research by scientists worldwide. This achievement opened the door to personalized medicine, allowing doctors to tailor treatments based on a patient\'s DNA. It also raised ethical questions about genetic privacy and discrimination.', question: 'Summarize the passage objectively.', answer: 'sequencing the human genome enabled personalized medicine but also raised ethical concerns about genetic privacy', hint: 'Cover the achievement, its benefit, and the concern.' },
        { passage: 'Artificial intelligence is transforming industries from healthcare to transportation. AI can diagnose diseases faster than doctors and drive cars without human input. Yet experts warn that AI could eliminate millions of jobs and raise questions about accountability when machines make mistakes.', question: 'What is the central idea?', answer: 'AI is transforming society with powerful capabilities but also raises serious concerns about jobs and accountability', options: ['AI is transforming society with powerful capabilities but also raises serious concerns about jobs and accountability', 'AI diagnoses diseases', 'cars can drive themselves'], hint: 'The central idea captures both the promise and the peril.' },
        { passage: 'Invasive species cost the U.S. economy an estimated $120 billion per year. These non-native organisms, introduced through trade and travel, outcompete native species for resources. The Asian carp, for example, has devastated native fish populations in the Mississippi River basin.', question: 'What is the central idea?', answer: 'invasive species cause massive economic and ecological damage by outcompeting native species', options: ['invasive species cause massive economic and ecological damage by outcompeting native species', 'Asian carp live in the Mississippi', 'trade is bad'], hint: 'Focus on the overall problem, not just one example.' },
      ],
    },
    'cite-evidence': {
      items: [
        { passage: 'According to the article, "Renewable energy sources now account for 29% of global electricity generation, up from just 19% a decade ago." The author notes this growth has been driven primarily by falling costs of solar and wind technology.', question: 'What percentage of global electricity comes from renewables?', answer: '29 percent', options: ['29 percent', '19 percent', '50 percent'], hint: 'Cite the current figure, not the one from a decade ago.' },
        { passage: 'The passage states that the Amazon rainforest "contains approximately 10% of all species on Earth" and that deforestation has already destroyed "an area roughly the size of France."', question: 'Cite two pieces of evidence about the Amazon from the text.', answer: 'it contains 10% of all species and an area the size of France has been destroyed', options: ['it contains 10% of all species and an area the size of France has been destroyed', 'it is in South America and it rains a lot', 'France is in Europe'], hint: 'Pull the two quoted facts directly from the text.' },
        { passage: 'The author argues that sleep is essential for learning. She cites research showing that "students who sleep fewer than 7 hours per night score 15% lower on tests." She adds that during sleep, "the brain consolidates memories and processes new information."', question: 'What evidence supports the claim that sleep affects test scores?', answer: 'students who sleep fewer than 7 hours score 15% lower on tests', options: ['students who sleep fewer than 7 hours score 15% lower on tests', 'sleep is important', 'brains consolidate memories'], hint: 'Find the specific statistic about test scores.' },
        { passage: 'The text explains that "the Dead Sea is nearly ten times saltier than the ocean, with a salinity of about 34%." It notes that this extreme salt content means "no fish or plants can survive in its waters," which is how it got its name.', question: 'Why is it called the Dead Sea? Cite evidence.', answer: 'because no fish or plants can survive in its extremely salty waters', options: ['because no fish or plants can survive in its extremely salty waters', 'because it is old', 'because it is below sea level'], hint: 'The text directly explains the name.' },
        { passage: 'The author claims that urban gardens improve communities. As evidence, she describes a Chicago program where "vacant lots were transformed into gardens, reducing neighborhood crime by 30% and increasing property values."', question: 'What specific evidence supports the claim about urban gardens?', answer: 'a Chicago program turned vacant lots into gardens, reducing crime by 30% and raising property values', options: ['a Chicago program turned vacant lots into gardens, reducing crime by 30% and raising property values', 'gardens have flowers', 'Chicago is a big city'], hint: 'Cite the specific program and its measurable results.' },
        { passage: 'The text states that "coral bleaching events have increased fivefold since the 1980s." Scientists quoted in the article warn that "if ocean temperatures rise another 2°C, up to 99% of coral reefs could disappear."', question: 'Cite evidence showing coral reefs are in danger.', answer: 'bleaching events have increased fivefold and 99% of reefs could disappear if temperatures rise 2 more degrees', options: ['bleaching events have increased fivefold and 99% of reefs could disappear if temperatures rise 2 more degrees', 'coral is colorful', 'the ocean is warming'], hint: 'Pull the specific numbers from the text.' },
      ],
    },
    'analyze-development': {
      items: [
        { passage: 'Marie Curie was born in Poland in 1867. She moved to Paris to study physics and chemistry. Working in a small lab, she discovered two elements: polonium and radium. She became the first woman to win a Nobel Prize and later won a second in a different field.', question: 'How does the author develop Marie Curie as a key individual?', answer: 'by tracing her journey from student to groundbreaking scientist with historic achievements', options: ['by tracing her journey from student to groundbreaking scientist with historic achievements', 'by describing Poland', 'by listing Nobel Prize winners'], hint: 'Follow the progression from her origins to her accomplishments.' },
        { passage: 'The Civil Rights Movement began with individual acts of courage. Rosa Parks refused to give up her bus seat. Students sat at segregated lunch counters. Thousands marched from Selma to Montgomery. These acts built into a national movement that changed American law.', question: 'How does the author show the development of the Civil Rights Movement?', answer: 'by showing how individual acts of courage built into a larger national movement', options: ['by showing how individual acts of courage built into a larger national movement', 'by listing laws', 'by describing one person'], hint: 'The author moves from small individual actions to a large movement.' },
        { passage: 'Climate change began as a scientific observation in the 1800s. By the mid-1900s, researchers confirmed that carbon dioxide levels were rising. In the 2000s, extreme weather events made the issue urgent. Today, nations worldwide are working on climate agreements.', question: 'How is the idea of climate change developed in this passage?', answer: 'chronologically, from early scientific observation to global urgency and action', options: ['chronologically, from early scientific observation to global urgency and action', 'by comparing two countries', 'by describing weather events only'], hint: 'Notice how the author moves through time periods.' },
        { passage: 'The internet started as a military communication network in the 1960s. Universities adopted it for research. By the 1990s, the World Wide Web made it accessible to everyone. Today, over 5 billion people use the internet daily for work, communication, and entertainment.', question: 'How does the author develop the idea of the internet\'s growth?', answer: 'by showing its expansion from a military tool to a global network used by billions', options: ['by showing its expansion from a military tool to a global network used by billions', 'by explaining how computers work', 'by describing websites'], hint: 'Track how the audience grew at each stage.' },
        { passage: 'The author introduces the water crisis by describing a village in Kenya where children walk five miles daily for water. She then presents data showing 2 billion people lack clean water globally. Finally, she explains how solar-powered purifiers are providing solutions.', question: 'How does the author develop the reader\'s understanding?', answer: 'by starting with a personal story, expanding to global data, then offering a solution', options: ['by starting with a personal story, expanding to global data, then offering a solution', 'by listing statistics only', 'by comparing two countries'], hint: 'The author moves from personal to global to solutions.' },
        { passage: 'Darwin observed finches on the Galapagos Islands with different beak shapes. He noticed that each beak type matched the food available on that island. Over decades, he developed his theory that species change over time through natural selection.', question: 'How did Darwin\'s key idea develop?', answer: 'through careful observation of specific evidence that led to a broader theory', options: ['through careful observation of specific evidence that led to a broader theory', 'he read about it in a book', 'he invented the idea instantly'], hint: 'Follow the path from observation to conclusion.' },
      ],
    },
    'author-craft-purpose': {
      items: [
        { passage: 'The author opens the article about endangered tigers with: "Imagine walking through a forest and never hearing a tiger\'s roar again." The rest of the article presents facts about declining tiger populations.', question: 'Why does the author begin with "Imagine..."?', answer: 'to create an emotional connection and make the reader care about the issue', options: ['to create an emotional connection and make the reader care about the issue', 'to describe a real event', 'to test the reader\'s imagination'], hint: 'How does this opening make you feel?' },
        { passage: 'An article about ocean pollution uses words like "choking," "suffocating," and "drowning in waste" to describe the effect of plastic on marine life.', question: 'Why does the author use these word choices?', answer: 'to create vivid imagery that emphasizes the severity of the problem', options: ['to create vivid imagery that emphasizes the severity of the problem', 'to describe how fish breathe', 'to be scientifically accurate'], hint: 'These strong words create a specific emotional effect.' },
        { passage: 'A science article about Mars ends with: "Whether humans will one day walk on Mars is no longer a question of if, but when." The author has spent the article describing recent technological advances.', question: 'What is the author\'s purpose in the concluding sentence?', answer: 'to convey confidence that Mars exploration is inevitable given the advances described', options: ['to convey confidence that Mars exploration is inevitable given the advances described', 'to state a proven fact', 'to discourage space travel'], hint: 'The ending reflects the author\'s overall argument.' },
        { passage: 'The author writes about factory farming from the perspective of a farmer who switched to humane practices: "I realized my animals were suffering. I couldn\'t sleep at night. So I changed everything."', question: 'Why did the author choose to include the farmer\'s personal voice?', answer: 'to make the argument more persuasive through a relatable, firsthand experience', options: ['to make the argument more persuasive through a relatable, firsthand experience', 'to teach farming techniques', 'to entertain the reader'], hint: 'Personal stories connect emotionally with readers.' },
        { passage: 'A history article about child labor in the 1800s includes a photograph of a 10-year-old working in a coal mine alongside the text. The caption reads: "Lewis Hine took this photo in 1911 to expose the reality of child labor."', question: 'How does the author use the photograph to support the purpose?', answer: 'the photograph provides powerful visual evidence that makes the reality of child labor undeniable', options: ['the photograph provides powerful visual evidence that makes the reality of child labor undeniable', 'it decorates the page', 'it shows mining equipment'], hint: 'Why is seeing more powerful than just reading about it?' },
        { passage: 'An editorial begins with statistics: "1 in 5 children in America goes to bed hungry." The author then tells the story of one specific child named Maria. The article ends by asking readers to donate to food banks.', question: 'How does the author\'s structure serve the purpose?', answer: 'the statistic establishes the scale, the personal story creates empathy, and the ending calls readers to action', options: ['the statistic establishes the scale, the personal story creates empathy, and the ending calls readers to action', 'the author just lists facts', 'the author tells a bedtime story'], hint: 'Each section of the article serves a different persuasive function.' },
      ],
    },
    'evaluate-argument': {
      items: [
        { passage: 'An article argues: "All schools should require uniforms. Uniforms reduce bullying, save families money, and eliminate distracting fashion competition." No studies or sources are cited.', question: 'Is this argument well-supported? Why or why not?', answer: 'the claims are reasonable but unsupported because no evidence or sources are cited', options: ['the claims are reasonable but unsupported because no evidence or sources are cited', 'it is well-supported because the claims sound true', 'it is wrong because uniforms are bad'], hint: 'Are the claims backed up with proof?' },
        { passage: 'An author claims: "Sugary drinks cause obesity." She cites a 10-year Harvard study of 120,000 people showing that those who drank one sugary beverage daily gained significantly more weight than those who did not.', question: 'Is this claim well-supported?', answer: 'yes, it is supported by a large, long-term study from a reputable institution', options: ['yes, it is supported by a large, long-term study from a reputable institution', 'no, it is just one study', 'no, Harvard is not reliable'], hint: 'Consider the size, length, and source of the study.' },
        { passage: 'A blogger writes: "Cell phones are destroying our children\'s brains. Everyone I know says their kids are addicted. We need to ban phones for anyone under 18."', question: 'What weaknesses exist in this argument?', answer: 'it uses personal anecdotes instead of research and proposes an extreme solution without evidence', options: ['it uses personal anecdotes instead of research and proposes an extreme solution without evidence', 'it is well-reasoned and balanced', 'cell phones are fine for kids'], hint: '"Everyone I know" is not evidence, and "ban for all" is extreme.' },
        { passage: 'A report argues that renewable energy can replace fossil fuels. It includes data from the Department of Energy, cost comparisons over 20 years, and case studies from countries that have already transitioned. It also acknowledges challenges like energy storage.', question: 'What makes this argument strong?', answer: 'it uses government data, long-term analysis, real-world examples, and acknowledges opposing challenges', options: ['it uses government data, long-term analysis, real-world examples, and acknowledges opposing challenges', 'it mentions the government', 'it is about energy'], hint: 'Strong arguments use varied evidence and address counterpoints.' },
        { passage: 'An advertisement claims: "Our vitamin supplement makes you smarter! Clinical studies prove it!" In small print, it says the study was conducted by the vitamin company itself with only 20 participants.', question: 'Why should you be skeptical of this claim?', answer: 'the study was conducted by the company selling the product and had too few participants to be reliable', options: ['the study was conducted by the company selling the product and had too few participants to be reliable', 'vitamins cannot work', 'all advertisements lie'], hint: 'Consider who conducted the study and how many people were tested.' },
        { passage: 'An editorial argues against building a new highway. It cites traffic data, environmental impact studies, and input from affected residents. However, it does not address the economic benefits that supporters have raised.', question: 'What would make this argument more convincing?', answer: 'addressing the opposing economic arguments and explaining why the drawbacks outweigh the benefits', options: ['addressing the opposing economic arguments and explaining why the drawbacks outweigh the benefits', 'removing all data', 'adding more emotional language'], hint: 'Ignoring the other side weakens an argument.' },
      ],
    },
    'multimedia-integration': {
      items: [
        { passage: 'A textbook chapter about earthquakes includes a map showing fault lines, a diagram of tectonic plates, and a photograph of earthquake damage. The text explains what causes earthquakes and their effects.', question: 'How do the visual elements enhance the text?', answer: 'the map shows where earthquakes occur, the diagram explains the cause, and the photo shows real effects', options: ['the map shows where earthquakes occur, the diagram explains the cause, and the photo shows real effects', 'they make the page look nice', 'they replace the need to read'], hint: 'Each visual adds a different type of understanding.' },
        { passage: 'A documentary about climate change includes interviews with scientists, satellite images of melting glaciers over 30 years, and animated graphs showing rising temperatures.', question: 'What does each media type contribute?', answer: 'interviews provide expert credibility, satellite images show visible change, and graphs present data trends', options: ['interviews provide expert credibility, satellite images show visible change, and graphs present data trends', 'they all show the same thing', 'only the interviews matter'], hint: 'Each format communicates information differently.' },
        { passage: 'A website about the solar system includes a written article, an interactive 3D model of the planets, and a video narrated by an astronaut.', question: 'What can the 3D model show that the article alone cannot?', answer: 'the relative sizes and positions of planets in a way you can explore visually', options: ['the relative sizes and positions of planets in a way you can explore visually', 'the same text information', 'nothing the article doesn\'t cover'], hint: 'Interactive media lets you see and explore spatial relationships.' },
        { passage: 'A news report about a hurricane includes a written article with statistics, a weather radar animation showing the storm\'s path, and firsthand video from residents.', question: 'How does the resident video add to the written article?', answer: 'it shows the human impact and emotional reality that statistics alone cannot convey', options: ['it shows the human impact and emotional reality that statistics alone cannot convey', 'it replaces the article', 'it provides different statistics'], hint: 'Video captures experiences that numbers cannot.' },
        { passage: 'A podcast about ancient Rome lets listeners hear a historian describe gladiator battles while sound effects recreate the noise of the Colosseum.', question: 'What does audio add that a textbook cannot provide?', answer: 'an immersive, sensory experience that helps listeners feel present in the historical setting', options: ['an immersive, sensory experience that helps listeners feel present in the historical setting', 'more accurate facts', 'the same information in a different format'], hint: 'Sound creates an experience that text alone cannot.' },
        { passage: 'A museum exhibit about space exploration includes astronaut suits behind glass, touchscreen timelines, a written history panel, and a short film about the moon landing.', question: 'Why is a museum more effective than a single textbook for learning about this topic?', answer: 'it combines physical artifacts, interactive technology, text, and film for a multi-sensory learning experience', options: ['it combines physical artifacts, interactive technology, text, and film for a multi-sensory learning experience', 'museums are bigger than books', 'textbooks have more information'], hint: 'Multiple formats engage different senses and learning styles.' },
      ],
    },
  },
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
  const bank = PASSAGE_BANKS[grade]?.[skill];
  if (!bank) return { error: `No exercise bank for ${grade}/${skill}` };

  const items = bank.items;
  if (!items || !items.length) return { error: `Empty exercise bank for ${grade}/${skill}` };

  const selected = pick(items, count);

  // All reading-informational exercises are passage-based comprehension
  return {
    type: 'passage-comprehension',
    skill,
    grade,
    count: selected.length,
    instruction: 'Read the passage and answer the question.',
    items: selected.map(i => ({
      passage: i.passage,
      question: i.question,
      answer: i.answer,
      options: i.options || [],
      hint: i.hint || '',
    })),
  };
}

function generatePassage(grade, skill) {
  const bank = PASSAGE_BANKS[grade]?.[skill];
  if (!bank) return { error: `No passage bank for ${grade}/${skill}` };
  const item = pick(bank.items, 1)[0];
  return { passage: item.passage, question: item.question, hint: item.hint || '', options: item.options || [] };
}

function checkAnswer(expected, answer) {
  return norm(expected) === norm(answer);
}

// ── Public API ──

class ReadingInformational {
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

  generatePassage(grade, skill) { return generatePassage(grade, skill); }

  checkAnswer(expected, answer) { return { correct: checkAnswer(expected, answer), expected, studentAnswer: answer }; }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const passage = generatePassage(grade, target.skill);
    return {
      studentId: id, grade, targetSkill: target, exercise, samplePassage: passage,
      lessonPlan: {
        preview: `Survey the text: read the title, look at any features, predict the topic.`,
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} comprehension questions`,
        apply: 'Use this reading strategy with a new nonfiction text.',
      },
    };
  }
}

module.exports = ReadingInformational;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const ri = new ReadingInformational();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) ri.setGrade(id, grade);
        out({ action: 'start', profile: ri.getProfile(id), nextSkills: ri.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(ri.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'kindergarten';
        if (skill) { out(ri.generateExercise(grade, skill, 5)); }
        else { const n = ri.getNextSkills(id, 1).next; out(n.length ? ri.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , expected, answer] = args;
        if (expected === undefined || answer === undefined) throw new Error('Usage: check <id> <expected> <answer>');
        out(ri.checkAnswer(expected, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(ri.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(ri.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(ri.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(ri.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? ri.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(ri.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(ri.setGrade(id, g)); break; }
      case 'passage': {
        const [, grade, skill] = args;
        if (!grade || !skill) throw new Error('Usage: passage <grade> <skill>');
        out(ri.generatePassage(grade, skill));
        break;
      }
      default: out({ usage: 'node reading-informational.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','passage'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
