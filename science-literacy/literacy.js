// Science Literacy Interactive Tutor (K-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'science-literacy');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'reading-diagrams': ['label-matching', 'picture-reading', 'simple-diagram'],
    'science-vocabulary': ['living-nonliving', 'weather-words', 'senses-words', 'material-words'],
    'following-instructions': ['step-order', 'safety-rules'],
    'recording-observations': ['draw-and-label', 'observation-sentences'],
  },
  'grade-1': {
    'reading-diagrams': ['plant-parts-diagram', 'animal-diagram', 'weather-chart'],
    'science-vocabulary': ['habitat-words', 'push-pull-words', 'light-sound-words'],
    'following-instructions': ['simple-procedure', 'materials-list'],
    'recording-observations': ['before-after', 'tally-counting'],
  },
  'grade-2': {
    'reading-diagrams': ['life-cycle-diagram', 'food-chain-diagram', 'map-reading'],
    'science-vocabulary': ['matter-words', 'landform-words', 'body-system-words'],
    'following-instructions': ['multi-step-procedure', 'recording-data'],
    'recording-observations': ['comparison-writing', 'measurement-recording'],
  },
  'grade-3': {
    'reading-informational-text': ['main-idea', 'text-features', 'cause-effect'],
    'using-evidence': ['identify-evidence', 'support-claim'],
    'interpreting-charts-graphs': ['bar-graph', 'picture-graph', 'simple-table'],
    'science-writing': ['observation-report', 'cer-introduction'],
    'technical-vocabulary': ['root-words', 'context-clues', 'precise-language'],
  },
  'grade-4': {
    'reading-informational-text': ['compare-contrast', 'sequence-process', 'author-purpose'],
    'using-evidence': ['select-relevant-evidence', 'distinguish-fact-opinion'],
    'interpreting-charts-graphs': ['line-graph', 'data-table', 'diagram-analysis'],
    'science-writing': ['cer-writing', 'summary-writing'],
    'technical-vocabulary': ['greek-latin-roots', 'multiple-meaning-words', 'tier3-terms'],
  },
  'grade-5': {
    'reading-informational-text': ['integrate-information', 'text-structure', 'primary-sources'],
    'using-evidence': ['evidence-reasoning-link', 'counter-evidence'],
    'interpreting-charts-graphs': ['multi-variable-graph', 'model-interpretation', 'scale-units'],
    'science-writing': ['lab-report-writing', 'explanatory-writing'],
    'technical-vocabulary': ['morphology-analysis', 'domain-specific-terms', 'everyday-to-scientific'],
  },
  'grade-6': {
    'analyzing-scientific-articles': ['article-structure', 'identifying-claims', 'summarizing-findings'],
    'evaluating-sources': ['source-reliability', 'sift-method', 'bias-detection'],
    'data-interpretation': ['graph-analysis', 'trend-identification', 'correlation-basics'],
    'scientific-argumentation': ['cer-advanced', 'counter-argument', 'evidence-quality'],
    'communicating-findings': ['formal-report', 'presentation-skills', 'peer-review-basics'],
  },
  'grade-7': {
    'analyzing-scientific-articles': ['research-methods', 'results-discussion', 'limitations'],
    'evaluating-sources': ['peer-review-process', 'primary-vs-secondary', 'citation-tracking'],
    'data-interpretation': ['statistical-basics', 'multi-dataset-comparison', 'error-analysis'],
    'scientific-argumentation': ['building-arguments', 'rebuttal-writing', 'logical-fallacies'],
    'communicating-findings': ['technical-writing', 'visual-data-presentation', 'audience-adaptation'],
  },
  'grade-8': {
    'analyzing-scientific-articles': ['critical-analysis', 'cross-study-comparison', 'methodology-evaluation'],
    'evaluating-sources': ['scientific-consensus', 'media-literacy', 'misinformation-detection'],
    'data-interpretation': ['advanced-graph-types', 'causation-vs-correlation', 'uncertainty-margins'],
    'scientific-argumentation': ['thesis-development', 'evidence-synthesis', 'scientific-debate'],
    'communicating-findings': ['research-paper-format', 'abstract-writing', 'collaborative-writing'],
  },
};

const CONTENT_BANKS = {
  'kindergarten': {
    'label-matching': {
      items: [
        { prompt: 'A plant diagram shows a green part growing up from the soil. What is it called?', choices: ['root', 'stem', 'flower'], answer: 'stem' },
        { prompt: 'Which label belongs on the part of the plant underground?', choices: ['leaf', 'root', 'petal'], answer: 'root' },
        { prompt: 'The diagram shows a bright yellow part on top of the plant. What is it?', choices: ['stem', 'root', 'flower'], answer: 'flower' },
        { prompt: 'What does the flat green part of a plant that catches sunlight get called?', choices: ['leaf', 'stem', 'seed'], answer: 'leaf' },
        { prompt: 'A picture shows rain falling from a cloud. What is the cloud part called in the diagram?', choices: ['sun', 'cloud', 'wind'], answer: 'cloud' },
        { prompt: 'The diagram shows an animal with four legs and fur. Which label fits: fish, dog, or bird?', choices: ['fish', 'dog', 'bird'], answer: 'dog' },
      ],
    },
    'picture-reading': {
      items: [
        { prompt: 'The picture shows a puddle getting smaller on a sunny day. What is happening to the water?', choices: ['freezing', 'drying up', 'getting bigger'], answer: 'drying up' },
        { prompt: 'A picture shows a caterpillar, then a cocoon, then a butterfly. What does this picture show?', choices: ['how it grows', 'what it eats', 'where it lives'], answer: 'how it grows' },
        { prompt: 'The picture shows dark clouds and rain. What kind of weather is this?', choices: ['sunny', 'rainy', 'snowy'], answer: 'rainy' },
        { prompt: 'A picture shows ice cubes in a warm room. They are getting smaller. What is happening?', choices: ['freezing', 'melting', 'boiling'], answer: 'melting' },
        { prompt: 'The picture shows a bird building something in a tree with sticks. What is it making?', choices: ['a nest', 'food', 'a dam'], answer: 'a nest' },
      ],
    },
    'simple-diagram': {
      items: [
        { prompt: 'A diagram shows the sun with arrows pointing to a plant. What is the arrow showing?', choices: ['wind blowing', 'sunlight reaching the plant', 'rain falling'], answer: 'sunlight reaching the plant' },
        { prompt: 'A diagram shows a big circle labeled "Earth" and a small circle going around it labeled "Moon." What does the arrow show?', choices: ['the Moon moves around Earth', 'Earth moves around the Moon', 'they bump into each other'], answer: 'the Moon moves around Earth' },
        { prompt: 'A simple food chain diagram shows: grass -> rabbit -> fox. What does the rabbit eat?', choices: ['fox', 'grass', 'nothing'], answer: 'grass' },
      ],
    },
    'living-nonliving': {
      items: [
        { prompt: 'A dog needs food and water and can grow. Is a dog living or nonliving?', answer: 'living' },
        { prompt: 'A rock does not eat, breathe, or grow. Is a rock living or nonliving?', answer: 'nonliving' },
        { prompt: 'A flower needs water and sunlight and can make seeds. Is a flower living or nonliving?', answer: 'living' },
        { prompt: 'A toy car does not need food and cannot grow. Is a toy car living or nonliving?', answer: 'nonliving' },
        { prompt: 'A fish needs water and food and can have babies. Is a fish living or nonliving?', answer: 'living' },
        { prompt: 'A book does not breathe or grow. Is a book living or nonliving?', answer: 'nonliving' },
      ],
    },
    'weather-words': {
      items: [
        { prompt: 'When water falls from clouds as drops, scientists call it ___.', answer: 'rain' },
        { prompt: 'When the air moves and makes trees sway, we call it ___.', answer: 'wind' },
        { prompt: 'The bright object in the sky that gives us light and warmth is the ___.', answer: 'sun' },
        { prompt: 'White fluffy shapes in the sky are called ___.', answer: 'clouds' },
        { prompt: 'When water falls from the sky as white flakes in cold weather, it is called ___.', answer: 'snow' },
        { prompt: 'How hot or cold the air is outside is called the ___.', answer: 'temperature' },
      ],
    },
    'senses-words': {
      items: [
        { prompt: 'You use your eyes to do this. What sense is it?', answer: 'sight' },
        { prompt: 'You use your ears to do this. What sense is it?', answer: 'hearing' },
        { prompt: 'You use your nose to do this. What sense is it?', answer: 'smell' },
        { prompt: 'You use your tongue to do this. What sense is it?', answer: 'taste' },
        { prompt: 'You use your skin and hands to feel things. What sense is it?', answer: 'touch' },
      ],
    },
    'material-words': {
      items: [
        { prompt: 'Ice, rocks, and blocks are all ___. They keep their shape.', answer: 'solid' },
        { prompt: 'Water, juice, and milk can all be poured. They are ___.', answer: 'liquid' },
        { prompt: 'Something that is not heavy is called ___.', choices: ['rough', 'light', 'hard'], answer: 'light' },
        { prompt: 'Sandpaper feels bumpy. We say it is ___.', choices: ['smooth', 'rough', 'soft'], answer: 'rough' },
        { prompt: 'A piece of glass you can see through is called ___.', choices: ['transparent', 'opaque', 'rough'], answer: 'transparent' },
      ],
    },
    'step-order': {
      items: [
        { prompt: 'To plant a seed: 1) dig a hole, 2) put seed in, 3) cover with soil, 4) water it. What comes after putting the seed in?', answer: 'cover with soil' },
        { prompt: 'To wash your hands: 1) wet hands, 2) add soap, 3) scrub, 4) rinse. What is step 2?', answer: 'add soap' },
        { prompt: 'To observe a bug: 1) find a bug, 2) look carefully, 3) draw what you see. What do you do after you look carefully?', answer: 'draw what you see' },
      ],
    },
    'safety-rules': {
      items: [
        { prompt: 'In science, should you taste something unless your teacher says it is safe?', answer: 'no' },
        { prompt: 'Should you wash your hands after a science activity?', answer: 'yes' },
        { prompt: 'If something spills during an experiment, should you tell your teacher?', answer: 'yes' },
      ],
    },
    'draw-and-label': {
      items: [
        { prompt: 'You observed a plant. Your drawing shows a tall green part and flat green parts. What label goes on the tall part?', answer: 'stem' },
        { prompt: 'Your drawing of the sky shows a bright circle. What label should you write?', answer: 'sun' },
        { prompt: 'You drew a picture of ice melting. What should you write to describe what is happening?', choices: ['the ice is melting', 'the ice is freezing', 'the ice is growing'], answer: 'the ice is melting' },
      ],
    },
    'observation-sentences': {
      items: [
        { prompt: 'Which sentence is a good observation? A) "The leaf is green and has five points." B) "I like leaves."', answer: 'A' },
        { prompt: 'Which is a better observation? A) "It is pretty." B) "The rock is gray, smooth, and small."', answer: 'B' },
        { prompt: 'Which sentence tells what you saw, not what you think? A) "The ice cube got smaller in the sun." B) "The ice cube is sad."', answer: 'A' },
      ],
    },
  },
  'grade-1': {
    'plant-parts-diagram': {
      items: [
        { prompt: 'A plant diagram shows roots, stem, leaves, and flower. Which part soaks up water from the soil?', answer: 'roots' },
        { prompt: 'Which part of the plant carries water from the roots to the leaves?', answer: 'stem' },
        { prompt: 'Which part of the plant makes seeds?', answer: 'flower' },
        { prompt: 'Which part of the plant uses sunlight to make food?', answer: 'leaves' },
      ],
    },
    'animal-diagram': {
      items: [
        { prompt: 'A fish diagram shows fins, gills, tail, and scales. Which part helps the fish breathe underwater?', answer: 'gills' },
        { prompt: 'Which part of the fish helps it swim by pushing water?', answer: 'tail' },
        { prompt: 'A bird diagram labels wings, beak, feathers, and talons. Which part helps the bird fly?', answer: 'wings' },
        { prompt: 'Which part does a bird use to pick up food?', answer: 'beak' },
      ],
    },
    'weather-chart': {
      items: [
        { prompt: 'A weather chart shows: Monday-sunny, Tuesday-rainy, Wednesday-sunny, Thursday-cloudy. Which day was rainy?', answer: 'Tuesday' },
        { prompt: 'Looking at the same chart, how many sunny days were there?', answer: '2' },
        { prompt: 'A chart shows temperatures: morning 50F, noon 70F, evening 60F. When was it warmest?', answer: 'noon' },
      ],
    },
    'habitat-words': {
      items: [
        { prompt: 'The place where an animal lives and finds food is called its ___.', answer: 'habitat' },
        { prompt: 'Animals that eat only plants are called ___.', choices: ['herbivores', 'carnivores', 'omnivores'], answer: 'herbivores' },
        { prompt: 'A place with lots of trees, rain, and many animals is called a ___.', choices: ['desert', 'forest', 'ocean'], answer: 'forest' },
        { prompt: 'An animal that hunts other animals for food is called a ___.', choices: ['predator', 'prey', 'producer'], answer: 'predator' },
      ],
    },
    'push-pull-words': {
      items: [
        { prompt: 'When you move a wagon toward you, you are using a ___.', answer: 'pull' },
        { prompt: 'When you roll a ball away from you, you are using a ___.', answer: 'push' },
        { prompt: 'A push or a pull that makes something move is called a ___.', answer: 'force' },
        { prompt: 'When a ball rolls and then stops on carpet, the force that slowed it down is called ___.', answer: 'friction' },
      ],
    },
    'light-sound-words': {
      items: [
        { prompt: 'Something that gives off its own light, like the sun or a lamp, is called a light ___.', answer: 'source' },
        { prompt: 'When light bounces off a mirror, we say the light is ___.', choices: ['reflected', 'absorbed', 'created'], answer: 'reflected' },
        { prompt: 'Sound is made when something moves back and forth very fast. That movement is called a ___.', answer: 'vibration' },
        { prompt: 'A loud sound has a lot of ___ and a quiet sound has a little.', choices: ['volume', 'pitch', 'color'], answer: 'volume' },
      ],
    },
    'simple-procedure': {
      items: [
        { prompt: 'An experiment says: Step 1: Fill cup with water. Step 2: Add salt. Step 3: Stir. What do you do right after filling the cup?', answer: 'add salt' },
        { prompt: 'The instructions say to measure first and pour second. Should you pour before you measure?', answer: 'no' },
        { prompt: 'Why is it important to follow the steps in order during a science experiment?', choices: ['to get correct results', 'to finish faster', 'to use less materials'], answer: 'to get correct results' },
      ],
    },
    'materials-list': {
      items: [
        { prompt: 'An experiment needs: 2 cups, water, soil, seeds. How many cups do you need?', answer: '2' },
        { prompt: 'The materials list says "ruler (centimeters)." What will you use the ruler for?', choices: ['measuring', 'stirring', 'cutting'], answer: 'measuring' },
      ],
    },
    'before-after': {
      items: [
        { prompt: 'You put ice in the sun. Before: solid cube. After: puddle of water. What changed?', choices: ['it melted', 'it froze', 'it grew'], answer: 'it melted' },
        { prompt: 'Before: dry seed in soil. After two weeks: small green plant. What happened?', choices: ['the seed grew', 'the seed disappeared', 'nothing changed'], answer: 'the seed grew' },
      ],
    },
    'tally-counting': {
      items: [
        { prompt: 'You counted birds: robins IIII, blue jays II, sparrows III. How many robins did you see?', answer: '4' },
        { prompt: 'Using the same tally, which bird did you see the least?', answer: 'blue jays' },
        { prompt: 'How many total birds did you see? (robins 4 + blue jays 2 + sparrows 3)', answer: '9' },
      ],
    },
  },
  'grade-2': {
    'life-cycle-diagram': {
      items: [
        { prompt: 'A butterfly life cycle shows: egg -> caterpillar -> chrysalis -> butterfly. What comes after caterpillar?', answer: 'chrysalis' },
        { prompt: 'A frog life cycle shows: egg -> tadpole -> froglet -> adult frog. What stage has a tail and lives in water?', answer: 'tadpole' },
        { prompt: 'In a plant life cycle: seed -> sprout -> plant -> flower -> seed. Where does the cycle start again?', answer: 'seed' },
      ],
    },
    'food-chain-diagram': {
      items: [
        { prompt: 'Food chain: sun -> grass -> rabbit -> hawk. What is the producer in this chain?', answer: 'grass' },
        { prompt: 'In the chain sun -> grass -> rabbit -> hawk, what does the hawk eat?', answer: 'rabbit' },
        { prompt: 'Every food chain starts with energy from the ___. ', answer: 'sun' },
        { prompt: 'In a food chain, an animal that eats plants is called a ___.', answer: 'consumer' },
      ],
    },
    'map-reading': {
      items: [
        { prompt: 'A map shows blue areas for water and green areas for land. What does a large blue area most likely represent?', choices: ['ocean', 'forest', 'desert'], answer: 'ocean' },
        { prompt: 'On a map, a triangle symbol represents mountains. If you see many triangles in a row, what is there?', answer: 'a mountain range' },
      ],
    },
    'matter-words': {
      items: [
        { prompt: 'Anything that takes up space and has weight is called ___.', answer: 'matter' },
        { prompt: 'When you mix sugar into water and it seems to disappear, the sugar has ___.', answer: 'dissolved' },
        { prompt: 'Solid, liquid, and gas are the three states of ___.', answer: 'matter' },
        { prompt: 'When water is heated and turns into water vapor, this is called ___.', answer: 'evaporation' },
      ],
    },
    'landform-words': {
      items: [
        { prompt: 'A very tall natural formation of rock and earth is called a ___.', answer: 'mountain' },
        { prompt: 'A low area of land between hills or mountains is called a ___.', answer: 'valley' },
        { prompt: 'A large body of salt water that covers most of Earth is called an ___.', answer: 'ocean' },
        { prompt: 'A dry area that gets very little rain is called a ___.', answer: 'desert' },
      ],
    },
    'body-system-words': {
      items: [
        { prompt: 'The bones inside your body make up your ___ system.', answer: 'skeletal' },
        { prompt: 'The system that includes your heart and blood is called the ___ system.', choices: ['circulatory', 'digestive', 'respiratory'], answer: 'circulatory' },
        { prompt: 'The system that breaks down food into nutrients is the ___ system.', answer: 'digestive' },
      ],
    },
    'multi-step-procedure': {
      items: [
        { prompt: 'Step 1: Measure 100mL water. Step 2: Add 1 spoon salt. Step 3: Stir. Step 4: Observe. If you skip step 3, what might go wrong?', choices: ['salt might not dissolve', 'water would spill', 'nothing'], answer: 'salt might not dissolve' },
        { prompt: 'An experiment tells you to repeat the test 3 times. Why?', choices: ['to make sure results are reliable', 'to use more materials', 'because the teacher said so'], answer: 'to make sure results are reliable' },
      ],
    },
    'recording-data': {
      items: [
        { prompt: 'You measured a plant on Monday (3cm) and Friday (5cm). What is the best way to record this?', choices: ['in a data table', 'just remember it', 'draw a picture only'], answer: 'in a data table' },
        { prompt: 'Your data table has columns for Day and Height. On day 3, the plant is 4cm. Where does "4cm" go?', choices: ['in the Height column next to Day 3', 'in the Day column', 'in the title'], answer: 'in the Height column next to Day 3' },
      ],
    },
    'comparison-writing': {
      items: [
        { prompt: 'Which is a better comparison? A) "Rock A is bigger." B) "Rock A is 5cm wide and Rock B is 3cm wide."', answer: 'B' },
        { prompt: 'When comparing two things in science, you should use ___ instead of just saying "bigger" or "smaller."', choices: ['numbers and measurements', 'colors only', 'opinions'], answer: 'numbers and measurements' },
      ],
    },
    'measurement-recording': {
      items: [
        { prompt: 'You measured water: 250mL. What two things must you record?', choices: ['the number and the unit', 'just the number', 'just the unit'], answer: 'the number and the unit' },
        { prompt: 'A thermometer reads 22. What unit do you need to add?', choices: ['degrees Celsius or Fahrenheit', 'centimeters', 'grams'], answer: 'degrees Celsius or Fahrenheit' },
      ],
    },
  },
  'grade-3': {
    'main-idea': {
      items: [
        { prompt: 'A paragraph says: "Plants need sunlight, water, and soil to grow. Without sunlight, a plant cannot make food. Without water, it dries out." What is the main idea?', answer: 'Plants need sunlight, water, and soil to grow' },
        { prompt: 'A text about magnets says they attract iron, have two poles, and can push or pull. The main idea is about what magnets ___.', choices: ['look like', 'can do', 'are made of'], answer: 'can do' },
        { prompt: '"Fossils tell us about animals that lived long ago. Scientists find fossils in rock layers. Each layer tells about a different time." The main idea is:', choices: ['fossils help us learn about the past', 'rocks are old', 'scientists dig holes'], answer: 'fossils help us learn about the past' },
      ],
    },
    'text-features': {
      items: [
        { prompt: 'In a science textbook, important vocabulary words are printed in ___. ', choices: ['bold', 'small letters', 'cursive'], answer: 'bold' },
        { prompt: 'The words under a picture that explain what the picture shows are called a ___.', answer: 'caption' },
        { prompt: 'A list of important words and their definitions at the back of a book is called a ___.', answer: 'glossary' },
        { prompt: 'Before reading a science chapter, you should look at headings, diagrams, and bold words. This is called ___.', choices: ['previewing', 'summarizing', 'guessing'], answer: 'previewing' },
      ],
    },
    'cause-effect': {
      items: [
        { prompt: '"Because the temperature dropped below freezing, the water in the pond turned to ice." What is the cause?', answer: 'the temperature dropped below freezing' },
        { prompt: '"Plants that do not get enough water will wilt." What is the effect of not enough water?', answer: 'the plants will wilt' },
        { prompt: '"Erosion happens when wind and water carry away soil." What causes erosion?', answer: 'wind and water' },
      ],
    },
    'identify-evidence': {
      items: [
        { prompt: 'A student says "Plants need light to grow" and shows that plants in a dark closet died while plants by the window grew. Is the dead/alive plant data good evidence?', answer: 'yes' },
        { prompt: '"I think dogs are the best pets because I like them." Is "I like them" scientific evidence?', answer: 'no' },
        { prompt: 'A student claims magnets attract all metals. They tested iron (attracted) and aluminum (not attracted). Does this evidence support the claim?', answer: 'no' },
      ],
    },
    'support-claim': {
      items: [
        { prompt: 'Claim: "Warmer water dissolves sugar faster." Which evidence supports this? A) Sugar looks white. B) Sugar dissolved in 10 seconds in warm water but 45 seconds in cold water.', answer: 'B' },
        { prompt: 'Claim: "Exercise increases heart rate." Which supports this? A) Heart rates went from 70 to 110 after running. B) People wore red shirts while running.', answer: 'A' },
      ],
    },
    'bar-graph': {
      items: [
        { prompt: 'A bar graph shows rainfall: January=2in, February=3in, March=5in. Which month had the most rain?', answer: 'March' },
        { prompt: 'The bar graph shows: cats=8, dogs=12, fish=5 as class pets. How many more dogs than fish?', answer: '7' },
        { prompt: 'What does the height of each bar in a bar graph tell you?', choices: ['the amount or count', 'the color', 'the name'], answer: 'the amount or count' },
      ],
    },
    'picture-graph': {
      items: [
        { prompt: 'A picture graph uses one apple symbol = 2 apples. If there are 4 apple symbols, how many apples total?', answer: '8' },
        { prompt: 'In a picture graph, each sun symbol = 1 sunny day. March has 15 suns. How many sunny days in March?', answer: '15' },
      ],
    },
    'simple-table': {
      items: [
        { prompt: 'A data table shows: Plant A height=12cm, Plant B height=8cm, Plant C height=15cm. Which plant is tallest?', answer: 'Plant C' },
        { prompt: 'The table shows: Monday temp=65F, Tuesday temp=70F, Wednesday temp=68F. What was Tuesday temperature?', answer: '70F' },
      ],
    },
    'observation-report': {
      items: [
        { prompt: 'Which is a better observation report opening? A) "Today we looked at rocks." B) "We observed three rock samples and recorded their color, texture, and hardness."', answer: 'B' },
        { prompt: 'In an observation report, should you include your opinion or only what you observed?', answer: 'only what you observed' },
      ],
    },
    'cer-introduction': {
      items: [
        { prompt: 'In CER writing, what does the C stand for?', answer: 'claim' },
        { prompt: 'In CER writing, what does the E stand for?', answer: 'evidence' },
        { prompt: 'In CER writing, what does the R stand for?', answer: 'reasoning' },
        { prompt: 'Which part of CER tells WHY the evidence supports the claim?', answer: 'reasoning' },
      ],
    },
    'root-words': {
      items: [
        { prompt: '"Thermometer" has the root "therm." What does "therm" mean?', answer: 'heat' },
        { prompt: '"Microscope" has the root "micro." What does "micro" mean?', answer: 'small' },
        { prompt: '"Biology" has the root "bio." What does "bio" mean?', answer: 'life' },
        { prompt: '"Geology" has the root "geo." What does "geo" mean?', answer: 'earth' },
      ],
    },
    'context-clues': {
      items: [
        { prompt: '"The habitat, or natural home, of a polar bear is the Arctic." Using context clues, what does "habitat" mean?', answer: 'natural home' },
        { prompt: '"Erosion slowly wears away rock and carries soil to new places." What does erosion do based on this sentence?', answer: 'wears away rock and carries soil' },
      ],
    },
    'precise-language': {
      items: [
        { prompt: 'Which is more precise science language? A) "The stuff got hot." B) "The water temperature increased to 80 degrees Celsius."', answer: 'B' },
        { prompt: 'Instead of saying "a lot of rain," a scientist would say ___.', choices: ['25 millimeters of precipitation', 'tons of rain', 'so much rain'], answer: '25 millimeters of precipitation' },
      ],
    },
  },
  'grade-4': {
    'compare-contrast': {
      items: [
        { prompt: 'A text compares igneous and sedimentary rocks. Igneous forms from cooling lava; sedimentary forms from layers of sediment. What is one difference?', answer: 'how they form' },
        { prompt: 'Signal words like "however," "on the other hand," and "unlike" tell the reader to look for ___.', choices: ['differences', 'similarities', 'examples'], answer: 'differences' },
      ],
    },
    'sequence-process': {
      items: [
        { prompt: 'The water cycle: evaporation -> condensation -> precipitation -> collection. What happens after condensation?', answer: 'precipitation' },
        { prompt: 'Signal words like "first," "next," "then," and "finally" help show ___.', choices: ['the order of steps', 'opinions', 'definitions'], answer: 'the order of steps' },
      ],
    },
    'author-purpose': {
      items: [
        { prompt: 'A text explains how volcanoes erupt with diagrams and data. The author\'s purpose is to ___.', choices: ['inform', 'persuade', 'entertain'], answer: 'inform' },
        { prompt: 'An article argues that we should protect rainforests with statistics about species loss. The purpose is to ___.', choices: ['persuade', 'inform only', 'entertain'], answer: 'persuade' },
      ],
    },
    'select-relevant-evidence': {
      items: [
        { prompt: 'Claim: "Plants grow better in sunlight." Which evidence is relevant? A) Plant A (sunlight) grew 15cm; Plant B (shade) grew 4cm. B) The pots were both brown.', answer: 'A' },
        { prompt: 'Claim: "Heavier objects fall faster." You drop a bowling ball and a basketball from the same height and they land at the same time. Does this support the claim?', answer: 'no' },
      ],
    },
    'distinguish-fact-opinion': {
      items: [
        { prompt: '"Water boils at 100 degrees Celsius at sea level." Is this a fact or an opinion?', answer: 'fact' },
        { prompt: '"I think space exploration is the most exciting part of science." Is this a fact or an opinion?', answer: 'opinion' },
        { prompt: '"Butterflies are the prettiest insects." Is this a fact or an opinion?', answer: 'opinion' },
        { prompt: '"The Earth revolves around the Sun." Is this a fact or an opinion?', answer: 'fact' },
      ],
    },
    'line-graph': {
      items: [
        { prompt: 'A line graph shows plant growth over 4 weeks going steadily upward. What trend does the line show?', choices: ['the plant grew over time', 'the plant shrank', 'no change'], answer: 'the plant grew over time' },
        { prompt: 'A line graph shows temperature rising from 6am to 2pm then falling to 8pm. When was the highest temperature?', answer: '2pm' },
      ],
    },
    'data-table': {
      items: [
        { prompt: 'A table shows: Material=wood, floats=yes; Material=rock, floats=no; Material=plastic, floats=yes. How many materials floated?', answer: '2' },
        { prompt: 'The same table helps you conclude that ___ determines whether something floats.', choices: ['the type of material', 'the color', 'the day of the week'], answer: 'the type of material' },
      ],
    },
    'diagram-analysis': {
      items: [
        { prompt: 'A diagram of the water cycle has arrows showing water moving from the ocean to clouds to rain to rivers and back. What do the arrows represent?', answer: 'the movement or flow of water' },
        { prompt: 'A food web diagram has many arrows between organisms. More arrows pointing TO an animal means it has ___.', choices: ['more food sources', 'fewer food sources', 'no food'], answer: 'more food sources' },
      ],
    },
    'cer-writing': {
      items: [
        { prompt: 'In CER: "The plant in sunlight grew taller (claim). It grew 12cm while the dark plant grew 2cm (evidence). This shows sunlight provides energy for growth (reasoning)." Which sentence is the reasoning?', answer: 'This shows sunlight provides energy for growth' },
        { prompt: 'A student writes: "Magnets are cool." Is this a scientific claim?', answer: 'no' },
      ],
    },
    'summary-writing': {
      items: [
        { prompt: 'A good science summary includes the main idea and key supporting details but NOT ___.', choices: ['every single detail from the text', 'the main topic', 'important findings'], answer: 'every single detail from the text' },
        { prompt: 'When summarizing an experiment, what three things should you include?', choices: ['question, method, and results', 'title, date, and name', 'opinion, guess, and hope'], answer: 'question, method, and results' },
      ],
    },
    'greek-latin-roots': {
      items: [
        { prompt: '"Photosynthesis" comes from "photo" (light) and "synthesis" (putting together). So photosynthesis means ___.', answer: 'putting together with light' },
        { prompt: '"Hydro" means water. A "hydroelectric" dam uses ___ to make electricity.', answer: 'water' },
        { prompt: '"Eco" means home or environment. An "ecosystem" is a ___ with living and nonliving things interacting.', choices: ['home environment', 'type of food', 'kind of rock'], answer: 'home environment' },
      ],
    },
    'multiple-meaning-words': {
      items: [
        { prompt: 'In everyday language, "theory" means a guess. In science, "theory" means ___.', choices: ['a well-tested explanation supported by evidence', 'a random guess', 'an opinion'], answer: 'a well-tested explanation supported by evidence' },
        { prompt: 'In everyday language, "cell" means a small room. In science, "cell" means ___.', choices: ['the basic unit of life', 'a battery', 'a cage'], answer: 'the basic unit of life' },
      ],
    },
    'tier3-terms': {
      items: [
        { prompt: 'The word "photosynthesis" is a Tier 3 word because it is ___.', choices: ['specific to science', 'an everyday word', 'used in all subjects'], answer: 'specific to science' },
        { prompt: 'The word "analyze" is a Tier 2 word because it is ___.', choices: ['used across many subjects', 'only used in science', 'a basic everyday word'], answer: 'used across many subjects' },
      ],
    },
  },
  'grade-5': {
    'integrate-information': {
      items: [
        { prompt: 'One text says forests absorb CO2. Another says deforestation releases stored CO2. Combining these, what happens when forests are cut down?', answer: 'less CO2 is absorbed and stored CO2 is released' },
        { prompt: 'A diagram shows the water cycle and a text explains droughts. Using both, why do droughts happen?', choices: ['not enough precipitation returns to the ground', 'too much evaporation from the ocean', 'water stops existing'], answer: 'not enough precipitation returns to the ground' },
      ],
    },
    'text-structure': {
      items: [
        { prompt: 'A passage describes what happened to dinosaurs and why. This text structure is ___.', choices: ['cause and effect', 'compare and contrast', 'description'], answer: 'cause and effect' },
        { prompt: 'A passage explains how a caterpillar becomes a butterfly step by step. This structure is ___.', choices: ['sequence', 'problem and solution', 'compare and contrast'], answer: 'sequence' },
      ],
    },
    'primary-sources': {
      items: [
        { prompt: 'A scientist publishes their original experiment results. Is this a primary or secondary source?', answer: 'primary' },
        { prompt: 'A textbook summarizes many scientists\' findings about climate. Is this a primary or secondary source?', answer: 'secondary' },
      ],
    },
    'evidence-reasoning-link': {
      items: [
        { prompt: 'Claim: "Dark surfaces absorb more heat." Evidence: "The black paper reached 45C while white paper reached 30C." What reasoning connects them?', choices: ['Dark colors absorb more light energy, converting it to heat', 'Black is a nicer color', 'The thermometer was broken'], answer: 'Dark colors absorb more light energy, converting it to heat' },
      ],
    },
    'counter-evidence': {
      items: [
        { prompt: 'A student claims all metals are magnetic. You test copper and it is not attracted to a magnet. This is called ___.', choices: ['counter-evidence', 'supporting evidence', 'irrelevant evidence'], answer: 'counter-evidence' },
        { prompt: 'When you find counter-evidence, should you change your claim, ignore it, or hide it?', answer: 'change your claim' },
      ],
    },
    'multi-variable-graph': {
      items: [
        { prompt: 'A graph shows two lines: Plant A (with fertilizer) and Plant B (without). Plant A grows faster. What variable made the difference?', answer: 'fertilizer' },
        { prompt: 'When a graph has two lines that both go up but one is steeper, the steeper line shows ___ growth.', choices: ['faster', 'slower', 'no'], answer: 'faster' },
      ],
    },
    'model-interpretation': {
      items: [
        { prompt: 'A model shows Earth tilted on its axis orbiting the Sun. This model helps explain ___.', choices: ['why we have seasons', 'why the Moon glows', 'how rain forms'], answer: 'why we have seasons' },
        { prompt: 'All scientific models are ___ of real things, not perfect copies.', choices: ['simplified representations', 'exact copies', 'photographs'], answer: 'simplified representations' },
      ],
    },
    'scale-units': {
      items: [
        { prompt: 'A graph axis says "Temperature (C)." The C stands for ___.', answer: 'Celsius' },
        { prompt: 'If a graph goes from 0 to 100 in steps of 10, a point halfway between 30 and 40 represents ___.', answer: '35' },
      ],
    },
    'lab-report-writing': {
      items: [
        { prompt: 'The first part of a lab report states what you are trying to find out. This is called the ___.', choices: ['question', 'conclusion', 'materials list'], answer: 'question' },
        { prompt: 'In a lab report, the hypothesis is your ___ about what will happen and why.', choices: ['prediction', 'final answer', 'materials list'], answer: 'prediction' },
        { prompt: 'The "controlled variables" in an experiment are the things you keep the ___.', answer: 'same' },
      ],
    },
    'explanatory-writing': {
      items: [
        { prompt: 'Explanatory science writing should be based on ___, not personal feelings.', choices: ['evidence and facts', 'opinions', 'guesses'], answer: 'evidence and facts' },
        { prompt: 'Which transition works best in explanatory writing? "Plants make food through photosynthesis. ___, animals must eat other organisms."', choices: ['In contrast', 'For example', 'Suddenly'], answer: 'In contrast' },
      ],
    },
    'morphology-analysis': {
      items: [
        { prompt: 'Break apart "decomposer": de- (reverse) + compose (put together) + -er (one who). A decomposer is one who ___.', answer: 'breaks things apart' },
        { prompt: '"Biodegradable": bio (life) + degrade (break down) + able (can be). It means something that can be ___.', answer: 'broken down by living things' },
      ],
    },
    'domain-specific-terms': {
      items: [
        { prompt: 'In science, "mass" is the amount of matter in an object. How is this different from "weight"?', choices: ['weight depends on gravity but mass does not', 'they are the same thing', 'mass is always heavier'], answer: 'weight depends on gravity but mass does not' },
        { prompt: 'In science, "speed" means how fast something moves. "Velocity" means speed plus ___.', choices: ['direction', 'weight', 'color'], answer: 'direction' },
      ],
    },
    'everyday-to-scientific': {
      items: [
        { prompt: 'Instead of "stuff," a scientist would say ___.', choices: ['matter or material', 'things', 'stuff'], answer: 'matter or material' },
        { prompt: 'Instead of "it disappeared," a scientist might say "it ___ or ___."', choices: ['dissolved or evaporated', 'vanished or magicked', 'broke or crashed'], answer: 'dissolved or evaporated' },
      ],
    },
  },
  'grade-6': {
    'article-structure': {
      items: [
        { prompt: 'A scientific article typically begins with an ___ that summarizes the main findings.', answer: 'abstract' },
        { prompt: 'The section of an article where the scientist explains what they did is called ___.', choices: ['methods', 'results', 'abstract'], answer: 'methods' },
        { prompt: 'The section where the scientist explains what the results mean is called the ___.', answer: 'discussion' },
      ],
    },
    'identifying-claims': {
      items: [
        { prompt: '"Our data suggest that increased CO2 levels correlate with rising temperatures." Is this a claim, evidence, or reasoning?', answer: 'claim' },
        { prompt: '"The average temperature rose 1.2C over ten years." Is this a claim, evidence, or reasoning?', answer: 'evidence' },
        { prompt: '"This increase likely occurred because CO2 traps heat in the atmosphere." Is this a claim, evidence, or reasoning?', answer: 'reasoning' },
      ],
    },
    'summarizing-findings': {
      items: [
        { prompt: 'When summarizing research findings, you should include the ___, the main ___, and the key ___.', choices: ['question, method, and results', 'title, author, and date', 'pictures, colors, and fonts'], answer: 'question, method, and results' },
        { prompt: 'A good summary of a science article avoids including ___.', choices: ['your personal opinions', 'the main findings', 'the research question'], answer: 'your personal opinions' },
      ],
    },
    'source-reliability': {
      items: [
        { prompt: 'Which source is most reliable for science information? A) A peer-reviewed journal. B) A random blog post. C) A social media post.', answer: 'A' },
        { prompt: 'A website ending in .edu or .gov is generally ___ reliable than one ending in .com.', choices: ['more', 'less', 'equally'], answer: 'more' },
      ],
    },
    'sift-method': {
      items: [
        { prompt: 'In the SIFT method, S stands for ___.', answer: 'Stop' },
        { prompt: 'The I in SIFT means "Investigate the ___."', answer: 'source' },
        { prompt: 'The F in SIFT means "Find ___ coverage."', answer: 'better' },
        { prompt: 'The T in SIFT means "Trace ___."', answer: 'claims' },
      ],
    },
    'bias-detection': {
      items: [
        { prompt: 'An article about a new medicine is written by the company that sells it. This might show ___.', choices: ['bias', 'peer review', 'good science'], answer: 'bias' },
        { prompt: 'A study funded by a soda company finds that sugar is not harmful. What should you consider?', choices: ['possible conflict of interest', 'it must be true because it is a study', 'soda is healthy'], answer: 'possible conflict of interest' },
      ],
    },
    'graph-analysis': {
      items: [
        { prompt: 'A graph shows CO2 levels rising sharply since 1950. This is called an ___ trend.', choices: ['increasing', 'decreasing', 'stable'], answer: 'increasing' },
        { prompt: 'When reading a graph, you should always check the ___ on both axes to understand the scale.', answer: 'labels' },
      ],
    },
    'trend-identification': {
      items: [
        { prompt: 'Data points going upward from left to right show a ___ trend.', answer: 'positive' },
        { prompt: 'If temperature data goes up and down with seasons every year, this is called a ___ pattern.', choices: ['cyclical', 'random', 'linear'], answer: 'cyclical' },
      ],
    },
    'correlation-basics': {
      items: [
        { prompt: 'Ice cream sales and sunburn rates both increase in summer. Does ice cream CAUSE sunburns?', answer: 'no' },
        { prompt: 'When two things change together, we say they are ___. This does not mean one causes the other.', answer: 'correlated' },
      ],
    },
    'cer-advanced': {
      items: [
        { prompt: 'A strong CER response uses ___ pieces of evidence, not just one.', choices: ['multiple', 'zero', 'only personal'], answer: 'multiple' },
        { prompt: 'The reasoning in CER should connect evidence to the claim using ___.', choices: ['scientific principles', 'personal feelings', 'guesses'], answer: 'scientific principles' },
      ],
    },
    'counter-argument': {
      items: [
        { prompt: 'Addressing a counter-argument in your writing makes your argument ___.', choices: ['stronger', 'weaker', 'longer for no reason'], answer: 'stronger' },
        { prompt: 'A good counter-argument section starts with "Some might argue that..." and then ___.', choices: ['explains why that view is incomplete with evidence', 'insults the other side', 'ignores it'], answer: 'explains why that view is incomplete with evidence' },
      ],
    },
    'evidence-quality': {
      items: [
        { prompt: 'Which is stronger evidence? A) "My friend said so." B) "A controlled experiment with 100 trials showed..."', answer: 'B' },
        { prompt: 'Evidence from a single observation is ___ reliable than evidence from repeated experiments.', choices: ['less', 'more', 'equally'], answer: 'less' },
      ],
    },
    'formal-report': {
      items: [
        { prompt: 'A formal science report is written in ___ person (not "I" or "we").', choices: ['third', 'first', 'second'], answer: 'third' },
        { prompt: 'In a formal report, instead of saying "We poured the water," you would write ___.', choices: ['The water was poured', 'I dumped the water', 'Someone put water in'], answer: 'The water was poured' },
      ],
    },
    'presentation-skills': {
      items: [
        { prompt: 'When presenting scientific findings, visuals like graphs and diagrams help the audience ___.', choices: ['understand data quickly', 'get bored', 'ignore the findings'], answer: 'understand data quickly' },
      ],
    },
    'peer-review-basics': {
      items: [
        { prompt: 'Peer review means other ___ check your work before it is published.', answer: 'scientists' },
        { prompt: 'The purpose of peer review is to check for ___ and improve quality.', choices: ['errors and validity', 'spelling only', 'nice words'], answer: 'errors and validity' },
      ],
    },
  },
  'grade-7': {
    'research-methods': {
      items: [
        { prompt: 'An experiment where the scientist changes one variable and measures its effect uses a ___ variable (changed) and a ___ variable (measured).', choices: ['independent, dependent', 'dependent, independent', 'controlled, random'], answer: 'independent, dependent' },
        { prompt: 'A group in an experiment that does not receive the treatment is called the ___ group.', answer: 'control' },
      ],
    },
    'results-discussion': {
      items: [
        { prompt: 'The Results section presents data ___ interpretation, while the Discussion section ___ the data.', choices: ['without, interprets', 'with, ignores', 'after, hides'], answer: 'without, interprets' },
        { prompt: 'In the Discussion, scientists compare their results to ___ research.', choices: ['previous', 'future', 'imaginary'], answer: 'previous' },
      ],
    },
    'limitations': {
      items: [
        { prompt: 'A study tested only 5 people. This is a limitation because the sample size is too ___.', answer: 'small' },
        { prompt: 'Acknowledging limitations in your research shows ___.', choices: ['honesty and scientific integrity', 'weakness', 'failure'], answer: 'honesty and scientific integrity' },
      ],
    },
    'peer-review-process': {
      items: [
        { prompt: 'In peer review, reviewers are usually ___ who did not help with the study.', choices: ['independent experts', 'the authors friends', 'random people'], answer: 'independent experts' },
        { prompt: 'If peer reviewers find problems, the authors must ___ their paper before it can be published.', answer: 'revise' },
      ],
    },
    'primary-vs-secondary': {
      items: [
        { prompt: 'An original research paper reporting new experimental data is a ___ source.', answer: 'primary' },
        { prompt: 'A review article that summarizes 50 studies on one topic is a ___ source.', answer: 'secondary' },
        { prompt: 'A news article about a scientist discovery is a ___ source.', answer: 'secondary' },
      ],
    },
    'citation-tracking': {
      items: [
        { prompt: 'When a science article says "(Smith, 2023)" this is called a ___.', answer: 'citation' },
        { prompt: 'You should trace citations to the original source to verify that the information is ___.', choices: ['accurate', 'popular', 'long'], answer: 'accurate' },
      ],
    },
    'statistical-basics': {
      items: [
        { prompt: 'The average (mean) of 10, 20, and 30 is ___.', answer: '20' },
        { prompt: 'If an experiment is repeated 3 times with results 45, 47, and 46, the results are ___.', choices: ['consistent', 'wildly different', 'meaningless'], answer: 'consistent' },
      ],
    },
    'multi-dataset-comparison': {
      items: [
        { prompt: 'When comparing data from two experiments, the variables and methods should be as ___ as possible.', choices: ['similar', 'different', 'random'], answer: 'similar' },
        { prompt: 'Two studies on the same topic found different results. You should look at differences in their ___.', choices: ['methods and sample sizes', 'titles and authors', 'publication dates only'], answer: 'methods and sample sizes' },
      ],
    },
    'error-analysis': {
      items: [
        { prompt: 'A measurement that is always 2 grams too high has a ___ error.', choices: ['systematic', 'random', 'no'], answer: 'systematic' },
        { prompt: 'Small unpredictable variations in measurements are called ___ errors.', answer: 'random' },
      ],
    },
    'building-arguments': {
      items: [
        { prompt: 'A strong scientific argument has a clear claim, ___ evidence, and logical reasoning.', choices: ['sufficient', 'no', 'emotional'], answer: 'sufficient' },
        { prompt: 'Using data from multiple sources to support your claim makes your argument more ___.', choices: ['convincing', 'confusing', 'shorter'], answer: 'convincing' },
      ],
    },
    'rebuttal-writing': {
      items: [
        { prompt: 'A rebuttal acknowledges an opposing view and then explains why it is ___.', choices: ['insufficient or incorrect based on evidence', 'stupid', 'the same as yours'], answer: 'insufficient or incorrect based on evidence' },
        { prompt: '"While it is true that... the evidence shows..." is an example of a ___ sentence structure.', choices: ['rebuttal', 'hypothesis', 'conclusion'], answer: 'rebuttal' },
      ],
    },
    'logical-fallacies': {
      items: [
        { prompt: '"Everyone believes it, so it must be true." This fallacy is called appeal to ___.', choices: ['popularity', 'authority', 'emotion'], answer: 'popularity' },
        { prompt: '"My uncle smoked and lived to 95, so smoking is safe." This uses a single ___ to dismiss broad evidence.', choices: ['anecdote', 'study', 'experiment'], answer: 'anecdote' },
      ],
    },
    'technical-writing': {
      items: [
        { prompt: 'Technical science writing uses ___ voice: "The solution was heated" rather than "I heated the solution."', choices: ['passive', 'active', 'casual'], answer: 'passive' },
        { prompt: 'In technical writing, measurements should always include the ___.', answer: 'units' },
      ],
    },
    'visual-data-presentation': {
      items: [
        { prompt: 'A pie chart is best for showing ___.', choices: ['parts of a whole', 'changes over time', 'correlations'], answer: 'parts of a whole' },
        { prompt: 'A scatter plot is best for showing the ___ between two variables.', answer: 'relationship' },
      ],
    },
    'audience-adaptation': {
      items: [
        { prompt: 'When writing for other scientists, you can use more ___ vocabulary than when writing for the general public.', choices: ['technical', 'simple', 'emotional'], answer: 'technical' },
        { prompt: 'When explaining science to a younger audience, you should use ___ and everyday language.', choices: ['analogies', 'jargon', 'long sentences'], answer: 'analogies' },
      ],
    },
  },
  'grade-8': {
    'critical-analysis': {
      items: [
        { prompt: 'When critically reading a study, you should evaluate the sample size, method, and whether the conclusions are ___ by the data.', choices: ['supported', 'unrelated to', 'bigger than'], answer: 'supported' },
        { prompt: 'If a study claims a drug works but only tested 3 people, the main weakness is ___.', choices: ['too small a sample size', 'too many variables', 'too much data'], answer: 'too small a sample size' },
      ],
    },
    'cross-study-comparison': {
      items: [
        { prompt: 'When multiple studies reach the same conclusion, this increases our ___ in the finding.', answer: 'confidence' },
        { prompt: 'A meta-analysis combines data from many studies. This is valuable because it provides a ___ sample size.', choices: ['larger', 'smaller', 'identical'], answer: 'larger' },
      ],
    },
    'methodology-evaluation': {
      items: [
        { prompt: 'A study with no control group is harder to trust because you cannot ___.', choices: ['compare results to a baseline', 'read the abstract', 'count the pages'], answer: 'compare results to a baseline' },
        { prompt: 'Double-blind experiments reduce ___ from both researchers and participants.', answer: 'bias' },
      ],
    },
    'scientific-consensus': {
      items: [
        { prompt: 'Scientific consensus means that the ___ of scientists in a field agree based on evidence.', choices: ['majority', 'minority', 'none'], answer: 'majority' },
        { prompt: 'Scientific consensus can change when ___ provides strong contradictory evidence.', choices: ['new research', 'social media', 'popular opinion'], answer: 'new research' },
      ],
    },
    'media-literacy': {
      items: [
        { prompt: 'A headline says "Scientists say chocolate cures cancer!" The study actually found a small correlation in mice. This headline is ___.', choices: ['misleading', 'accurate', 'well-written'], answer: 'misleading' },
        { prompt: 'When a news article reports on science, you should try to find the ___ study it references.', answer: 'original' },
      ],
    },
    'misinformation-detection': {
      items: [
        { prompt: 'A website claims a miracle cure with no scientific citations. This is likely ___.', choices: ['misinformation', 'reliable science', 'peer-reviewed'], answer: 'misinformation' },
        { prompt: 'Cherry-picking data means only showing evidence that ___ your claim while ignoring the rest.', answer: 'supports' },
      ],
    },
    'advanced-graph-types': {
      items: [
        { prompt: 'A box-and-whisker plot shows the ___, median, and spread of a data set.', choices: ['range', 'color', 'title'], answer: 'range' },
        { prompt: 'A histogram groups continuous data into ___ and shows frequency.', answer: 'bins' },
      ],
    },
    'causation-vs-correlation': {
      items: [
        { prompt: '"As ice cream sales increase, drowning rates increase." This is a correlation. What is the hidden third variable?', choices: ['hot weather', 'ice cream flavors', 'pool depth'], answer: 'hot weather' },
        { prompt: 'To establish causation (not just correlation), you need a ___ experiment.', choices: ['controlled', 'observational', 'casual'], answer: 'controlled' },
      ],
    },
    'uncertainty-margins': {
      items: [
        { prompt: 'A measurement reported as "25.3 +/- 0.5 cm" means the true value is likely between ___ and ___ cm.', choices: ['24.8 and 25.8', '25.3 and 25.8', '0 and 25.3'], answer: '24.8 and 25.8' },
        { prompt: 'Error bars on a graph show the ___ in the data.', answer: 'uncertainty' },
      ],
    },
    'thesis-development': {
      items: [
        { prompt: 'A thesis statement in a science essay should make a clear ___ that the rest of the paper supports.', answer: 'claim' },
        { prompt: 'A strong thesis is specific and ___. "Climate change is bad" is too vague.', choices: ['arguable with evidence', 'short', 'emotional'], answer: 'arguable with evidence' },
      ],
    },
    'evidence-synthesis': {
      items: [
        { prompt: 'Synthesizing evidence means ___ information from multiple sources to form a conclusion.', choices: ['combining', 'ignoring', 'copying'], answer: 'combining' },
        { prompt: 'When synthesizing, you look for ___ across studies, not just list them separately.', choices: ['patterns and themes', 'page numbers', 'author names'], answer: 'patterns and themes' },
      ],
    },
    'scientific-debate': {
      items: [
        { prompt: 'In scientific debate, arguments should be based on ___, not personal attacks.', answer: 'evidence' },
        { prompt: 'A scientist who changes their position because of new evidence is showing ___.', choices: ['intellectual honesty', 'weakness', 'confusion'], answer: 'intellectual honesty' },
      ],
    },
    'research-paper-format': {
      items: [
        { prompt: 'The standard sections of a research paper are: Abstract, Introduction, Methods, Results, ___, and References.', answer: 'Discussion' },
        { prompt: 'The References section lists all sources that were ___ in the paper.', answer: 'cited' },
      ],
    },
    'abstract-writing': {
      items: [
        { prompt: 'An abstract is a brief ___ of the entire paper, usually 150-300 words.', answer: 'summary' },
        { prompt: 'An abstract should include the purpose, methods, key results, and ___.', choices: ['conclusion', 'every data point', 'personal opinion'], answer: 'conclusion' },
      ],
    },
    'collaborative-writing': {
      items: [
        { prompt: 'In collaborative science writing, it is important to maintain a ___ voice throughout the paper.', choices: ['consistent', 'different', 'casual'], answer: 'consistent' },
        { prompt: 'When multiple authors write together, they should agree on the ___ and key terms before drafting.', choices: ['outline', 'font size', 'cover image'], answer: 'outline' },
      ],
    },
  },
};

const READING_PASSAGES = {
  'kindergarten': [
    { title: 'The Sun and Plants', focus: 'science vocabulary', text: 'Plants need the sun to grow. The sun gives light. The light helps the plant make food. The roots drink water from the soil. The stem holds the plant up. The leaves catch the sunlight.' },
    { title: 'Rain and Puddles', focus: 'observations', text: 'It is raining today. Water falls from the clouds. Puddles form on the ground. When the sun comes out, the puddles get smaller. The water goes up into the air. This is called evaporation.' },
    { title: 'Living and Nonliving', focus: 'classification', text: 'A dog is living. It eats, breathes, and grows. A rock is nonliving. It does not eat or grow. Can you tell which things are living? Look for things that need food and water.' },
  ],
  'grade-1': [
    { title: 'Push and Pull', focus: 'forces', text: 'A push moves things away from you. A pull moves things toward you. When you kick a ball, that is a push. When you open a door, that is a pull. Pushes and pulls are forces. Forces make things move, stop, or change direction.' },
    { title: 'Animal Habitats', focus: 'habitats', text: 'Animals live in different habitats. A fish lives in water. A bird lives in a tree. A bear lives in a forest. Each habitat gives animals what they need: food, water, and shelter. If the habitat changes, animals must adapt or move.' },
  ],
  'grade-2': [
    { title: 'The Water Cycle', focus: 'water cycle', text: 'Water moves in a cycle. The sun heats water in oceans and lakes. The water evaporates and becomes water vapor. The vapor rises and cools, forming clouds through condensation. When clouds get heavy, precipitation falls as rain or snow. Water collects in rivers and flows back to the ocean.' },
    { title: 'Life Cycle of a Butterfly', focus: 'life cycles', text: 'A butterfly has four stages in its life cycle. First, an egg is laid on a leaf. The egg hatches into a caterpillar, or larva. The caterpillar eats and grows. Then it forms a chrysalis, or pupa. Inside, it transforms. Finally, a beautiful butterfly, or adult, emerges.' },
  ],
  'grade-3': [
    { title: 'Food Chains and Food Webs', focus: 'ecosystems', text: 'Energy flows through ecosystems in food chains. Producers like plants make their own food using sunlight. Consumers eat other organisms. Herbivores eat plants. Carnivores eat animals. Decomposers break down dead organisms and return nutrients to the soil. A food web shows how many food chains connect in an ecosystem.' },
    { title: 'Rocks and Minerals', focus: 'earth science', text: 'There are three types of rocks. Igneous rocks form when hot melted rock called magma cools and hardens. Sedimentary rocks form when layers of sand, mud, and shells are pressed together over time. Metamorphic rocks form when heat and pressure change existing rocks. This process is called the rock cycle.' },
  ],
  'grade-4': [
    { title: 'Energy Transfer', focus: 'physical science', text: 'Energy can move from one object to another. When a moving ball hits a still ball, energy transfers and the still ball moves. Heat energy moves from warmer objects to cooler ones. Sound energy travels as vibrations through air, water, and solids. Energy cannot be created or destroyed — it only changes form.' },
    { title: 'Weathering and Erosion', focus: 'earth science', text: 'Weathering breaks rocks into smaller pieces. Water seeps into cracks and freezes, expanding and splitting rock apart. Plant roots grow into cracks and push rocks apart. Erosion then carries these pieces away. Wind, water, ice, and gravity are agents of erosion. Over millions of years, these processes shape mountains, valleys, and canyons.' },
  ],
  'grade-5': [
    { title: 'Photosynthesis and Cellular Respiration', focus: 'life science', text: 'Plants convert light energy into chemical energy through photosynthesis. Using chlorophyll in their leaves, they combine carbon dioxide from the air with water from the soil to produce glucose and oxygen. Animals and plants both use cellular respiration to convert glucose back into usable energy. These two processes are connected: the products of one are the reactants of the other.' },
    { title: 'Earth Systems Interactions', focus: 'earth science', text: 'Earth has four major systems: the geosphere (rock and land), hydrosphere (water), atmosphere (air), and biosphere (living things). These systems constantly interact. Volcanic eruptions in the geosphere release gases into the atmosphere. Rain from the atmosphere weathers rocks in the geosphere. Living things in the biosphere affect the atmosphere by producing and consuming gases.' },
  ],
  'grade-6': [
    { title: 'Plate Tectonics', focus: 'earth science', text: 'Earth\'s outer layer is broken into large pieces called tectonic plates that float on the semi-fluid mantle below. These plates move slowly — about 2-10 centimeters per year. Where plates collide, mountains form and earthquakes occur. Where plates pull apart, new crust forms at mid-ocean ridges. Evidence for plate tectonics includes matching fossils on different continents, the fit of continental coastlines, and patterns in the age of ocean floor rocks.' },
    { title: 'Cell Theory and Structure', focus: 'life science', text: 'All living things are made of cells, which are the basic units of life. Cell theory states that all cells come from existing cells. Cells contain organelles that perform specific functions. The nucleus stores genetic information. Mitochondria produce energy through cellular respiration. Plant cells have additional structures: a cell wall for support and chloroplasts for photosynthesis.' },
  ],
  'grade-7': [
    { title: 'Natural Selection and Adaptation', focus: 'life science', text: 'Charles Darwin proposed that natural selection drives evolution. Within a population, individuals show variation in their traits. Those with traits better suited to their environment are more likely to survive and reproduce, passing those traits to offspring. Over many generations, this leads to adaptation — populations becoming better suited to their environment. This process requires variation, inheritance, selection pressure, and time.' },
    { title: 'Chemical Reactions', focus: 'physical science', text: 'In a chemical reaction, substances called reactants rearrange their atoms to form new substances called products. Evidence of a reaction includes color change, gas production, temperature change, and formation of a precipitate. The law of conservation of mass states that matter is neither created nor destroyed — the total mass of reactants equals the total mass of products. Chemical equations must be balanced to reflect this law.' },
  ],
  'grade-8': [
    { title: 'Climate Change Evidence', focus: 'earth science', text: 'Multiple independent lines of evidence support the conclusion that Earth\'s climate is changing due to human activity. Ice core data shows CO2 levels are higher than any point in 800,000 years. Global temperature records show a 1.1 degrees C increase since pre-industrial times. Sea levels have risen 20cm in the past century. Glaciers worldwide are retreating. These changes correlate strongly with increased greenhouse gas emissions from burning fossil fuels.' },
    { title: 'Genetics and Inheritance', focus: 'life science', text: 'DNA contains genes that code for proteins, which determine an organism\'s traits. Each gene has different versions called alleles. Organisms inherit two alleles for each gene — one from each parent. Dominant alleles mask the expression of recessive alleles. A Punnett square predicts the probability of offspring inheriting particular allele combinations. Mutations — changes in DNA sequence — create new alleles and are the ultimate source of genetic variation.' },
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

function resolveSkillKey(grade, skill) {
  const gs = SKILLS[grade];
  if (!gs) return null;
  for (const [cat, skills] of Object.entries(gs)) { if (skills.includes(skill)) return { grade, category: cat, skill }; }
  return null;
}

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

// Exercise generation

function exResult(type, skill, grade, instruction, items) { return { type, skill, grade, count: items.length, instruction, items }; }

function generateExercise(grade, skill, count = 5) {
  const bank = CONTENT_BANKS[grade]?.[skill];
  if (!bank) return { error: `No content bank for ${grade}/${skill}` };

  const items = bank.items;
  if (!items || !items.length) return { error: `No items for ${grade}/${skill}` };

  const selected = pick(items, count);

  // Determine exercise type from the item structure
  if (selected[0].choices) {
    return exResult('multiple-choice', skill, grade, 'Choose the best answer.',
      selected.map(item => {
        const result = { prompt: item.prompt, answer: item.answer };
        if (item.choices) result.choices = item.choices;
        return result;
      }));
  }

  return exResult('short-answer', skill, grade, 'Answer the question.',
    selected.map(item => ({ prompt: item.prompt, answer: item.answer })));
}

// Answer checking

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected))
    return expected.some(r => norm(r) === norm(answer));
  return norm(expected) === norm(answer);
}

// Public API

class ScienceLiteracy {
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

  getReadingPassage(grade) {
    const passages = READING_PASSAGES[grade];
    if (!passages) return { error: `No reading passages for ${grade}. Available: ${Object.keys(READING_PASSAGES).join(', ')}` };
    return pick(passages, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const passage = READING_PASSAGES[grade] ? pick(READING_PASSAGES[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, readingPassage: passage,
      lessonPlan: {
        activate: 'Activate prior knowledge: What do you already know about this topic? (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} — ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: passage ? `Guided reading: "${passage.title}"` : 'Apply skill to a science context',
        reflect: 'What did you learn? What are you still curious about?',
      },
    };
  }
}

module.exports = ScienceLiteracy;

// CLI: node literacy.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const sl = new ScienceLiteracy();
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
        const [, id, type] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'kindergarten';
        if (type) { out(sl.generateExercise(grade, type, 5)); }
        else { const n = sl.getNextSkills(id, 1).next; out(n.length ? sl.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current grade!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(sl.checkAnswer(type, exp, answer));
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
      case 'passage': { const [, g] = args; if (!g) throw new Error('Usage: passage <grade>'); out(sl.getReadingPassage(g)); break; }
      default: out({ usage: 'node literacy.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','passage'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
