// eClaw Science Engineering Interactive Tutor (K-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'science-engineering');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'asking-defining-problems': ['identify-a-problem', 'ask-questions-about-needs', 'describe-what-to-solve'],
    'designing-solutions': ['sketch-an-idea', 'pick-materials', 'explain-your-plan'],
    'building-testing': ['build-from-plan', 'test-your-design', 'observe-results'],
    'comparing-solutions': ['compare-two-designs', 'pick-the-better-one', 'explain-why-better'],
  },
  'grade-1': {
    'asking-defining-problems': ['identify-a-problem', 'ask-questions-about-needs', 'describe-what-to-solve'],
    'designing-solutions': ['sketch-an-idea', 'pick-materials', 'explain-your-plan'],
    'building-testing': ['build-from-plan', 'test-your-design', 'observe-results'],
    'comparing-solutions': ['compare-two-designs', 'pick-the-better-one', 'explain-why-better'],
  },
  'grade-2': {
    'asking-defining-problems': ['identify-a-problem', 'ask-questions-about-needs', 'describe-what-to-solve'],
    'designing-solutions': ['sketch-an-idea', 'pick-materials', 'explain-your-plan'],
    'building-testing': ['build-from-plan', 'test-your-design', 'observe-results'],
    'comparing-solutions': ['compare-two-designs', 'pick-the-better-one', 'explain-why-better'],
  },
  'grade-3': {
    'defining-criteria-constraints': ['state-criteria', 'identify-constraints', 'distinguish-criteria-vs-constraints'],
    'brainstorming-solutions': ['generate-multiple-ideas', 'evaluate-ideas-against-criteria', 'select-promising-solution'],
    'prototyping': ['sketch-detailed-design', 'list-materials-and-steps', 'build-prototype'],
    'testing-improving': ['plan-a-fair-test', 'collect-test-data', 'identify-improvements'],
    'engineering-design-process': ['name-the-steps', 'apply-full-process', 'reflect-on-iteration'],
  },
  'grade-4': {
    'defining-criteria-constraints': ['state-criteria', 'identify-constraints', 'distinguish-criteria-vs-constraints'],
    'brainstorming-solutions': ['generate-multiple-ideas', 'evaluate-ideas-against-criteria', 'select-promising-solution'],
    'prototyping': ['sketch-detailed-design', 'list-materials-and-steps', 'build-prototype'],
    'testing-improving': ['plan-a-fair-test', 'collect-test-data', 'identify-improvements'],
    'engineering-design-process': ['name-the-steps', 'apply-full-process', 'reflect-on-iteration'],
  },
  'grade-5': {
    'defining-criteria-constraints': ['state-criteria', 'identify-constraints', 'distinguish-criteria-vs-constraints'],
    'brainstorming-solutions': ['generate-multiple-ideas', 'evaluate-ideas-against-criteria', 'select-promising-solution'],
    'prototyping': ['sketch-detailed-design', 'list-materials-and-steps', 'build-prototype'],
    'testing-improving': ['plan-a-fair-test', 'collect-test-data', 'identify-improvements'],
    'engineering-design-process': ['name-the-steps', 'apply-full-process', 'reflect-on-iteration'],
  },
  'grade-6': {
    'systems-thinking': ['identify-system-parts', 'describe-interactions', 'predict-system-behavior'],
    'trade-offs-optimization': ['identify-trade-offs', 'evaluate-competing-criteria', 'optimize-a-design'],
    'modeling-simulation': ['build-a-model', 'use-model-to-predict', 'refine-model-with-data'],
    'failure-analysis': ['identify-failure-point', 'determine-root-cause', 'propose-fix'],
    'iterative-design': ['plan-multiple-iterations', 'use-data-to-revise', 'document-design-evolution'],
  },
  'grade-7': {
    'systems-thinking': ['identify-system-parts', 'describe-interactions', 'predict-system-behavior'],
    'trade-offs-optimization': ['identify-trade-offs', 'evaluate-competing-criteria', 'optimize-a-design'],
    'modeling-simulation': ['build-a-model', 'use-model-to-predict', 'refine-model-with-data'],
    'failure-analysis': ['identify-failure-point', 'determine-root-cause', 'propose-fix'],
    'iterative-design': ['plan-multiple-iterations', 'use-data-to-revise', 'document-design-evolution'],
  },
  'grade-8': {
    'systems-thinking': ['identify-system-parts', 'describe-interactions', 'predict-system-behavior'],
    'trade-offs-optimization': ['identify-trade-offs', 'evaluate-competing-criteria', 'optimize-a-design'],
    'modeling-simulation': ['build-a-model', 'use-model-to-predict', 'refine-model-with-data'],
    'failure-analysis': ['identify-failure-point', 'determine-root-cause', 'propose-fix'],
    'iterative-design': ['plan-multiple-iterations', 'use-data-to-revise', 'document-design-evolution'],
  },
};

const CONTENT_BANKS = {
  'kindergarten': {
    'identify-a-problem': {
      questions: [
        { prompt: 'Lily\'s stuffed bear keeps falling off the shelf. What is the problem?', answer: 'The bear falls off the shelf', acceptedAnswers: ['bear falls off', 'bear keeps falling', 'stuffed bear falls', 'it falls off the shelf'] },
        { prompt: 'The classroom plants are dying because nobody remembers to water them. What is the problem?', answer: 'Nobody remembers to water the plants', acceptedAnswers: ['plants not watered', 'nobody waters plants', 'forget to water', 'plants are dying'] },
        { prompt: 'Rain gets into the sandbox and makes the sand too wet to play with. What is the problem?', answer: 'Rain gets into the sandbox', acceptedAnswers: ['rain in sandbox', 'sand gets wet', 'rain makes sand wet', 'sandbox gets wet'] },
        { prompt: 'The class pet hamster keeps escaping from its pen at recess. What is the problem?', answer: 'The hamster escapes its pen', acceptedAnswers: ['hamster escapes', 'hamster gets out', 'pen doesnt hold hamster', 'hamster keeps escaping'] },
        { prompt: 'Books keep sliding off the tilted reading table. What is the problem?', answer: 'Books slide off the table', acceptedAnswers: ['books slide off', 'books fall', 'books keep sliding', 'table is tilted'] },
        { prompt: 'The door slams shut when the wind blows. What is the problem?', answer: 'The door slams in the wind', acceptedAnswers: ['door slams', 'wind slams door', 'door shuts', 'door blows shut'] },
        { prompt: 'Crayons roll off the desk and break on the floor. What is the problem?', answer: 'Crayons roll off and break', acceptedAnswers: ['crayons roll off', 'crayons break', 'crayons fall off desk', 'crayons roll'] },
        { prompt: 'The bird feeder is empty every morning because squirrels eat all the seeds. What is the problem?', answer: 'Squirrels eat the bird seed', acceptedAnswers: ['squirrels eat seed', 'squirrels empty feeder', 'no seed for birds', 'squirrels steal food'] },
      ],
    },
    'ask-questions-about-needs': {
      questions: [
        { prompt: 'You need to build a bridge for toy cars. What is one question you should ask before you start?', answer: 'How long does the bridge need to be?', acceptedAnswers: ['how long', 'how big', 'what materials', 'how heavy', 'how wide', 'how strong'] },
        { prompt: 'You are making a container to carry water. What should you ask first?', answer: 'How much water does it need to hold?', acceptedAnswers: ['how much water', 'how big', 'what material', 'does it need a lid', 'how heavy'] },
        { prompt: 'Your friend wants a house for their pet bug. What question should you ask?', answer: 'How big is the bug?', acceptedAnswers: ['how big', 'what kind of bug', 'does it need air holes', 'what does the bug need', 'where will it live'] },
        { prompt: 'You want to keep your lunch cold without a fridge. What should you ask?', answer: 'How long does it need to stay cold?', acceptedAnswers: ['how long', 'how cold', 'what materials', 'how big is the lunch', 'where will it be'] },
        { prompt: 'The teacher wants something to hold markers. What question would you ask?', answer: 'How many markers does it need to hold?', acceptedAnswers: ['how many markers', 'how big', 'what shape', 'where will it go', 'what materials can i use'] },
        { prompt: 'You want to build a ramp for a toy car. What is a good question to ask?', answer: 'How high does the ramp need to be?', acceptedAnswers: ['how high', 'how steep', 'how long', 'how fast', 'what material'] },
      ],
    },
    'describe-what-to-solve': {
      questions: [
        { prompt: 'Ants keep getting into the picnic food. Describe what your solution must do.', answer: 'Keep ants away from the food', acceptedAnswers: ['keep ants away', 'stop ants', 'protect the food', 'block the ants', 'cover the food'] },
        { prompt: 'A ball keeps rolling into the street. Describe what your solution must do.', answer: 'Stop the ball from rolling into the street', acceptedAnswers: ['stop the ball', 'keep ball in yard', 'block the ball', 'catch the ball', 'prevent rolling'] },
        { prompt: 'The sun makes it too hot to sit on the bench. Describe what your solution must do.', answer: 'Shade the bench from the sun', acceptedAnswers: ['shade the bench', 'block the sun', 'keep bench cool', 'provide shade', 'cover the bench'] },
        { prompt: 'Pencils keep rolling off the desk. Describe what your solution must do.', answer: 'Keep pencils from rolling off', acceptedAnswers: ['stop pencils rolling', 'keep pencils on desk', 'hold the pencils', 'prevent rolling'] },
        { prompt: 'The garden gets too dry in summer. Describe what your solution must do.', answer: 'Keep the garden watered', acceptedAnswers: ['water the garden', 'keep soil wet', 'give plants water', 'prevent drying'] },
      ],
    },
    'sketch-an-idea': {
      questions: [
        { prompt: 'You want to build a rain shelter for the class pet. Which shape would be best for the roof to make rain slide off: flat, pointed, or round?', answer: 'pointed', acceptedAnswers: ['pointed', 'triangle', 'angled', 'slanted', 'round'] },
        { prompt: 'You are drawing a plan for a cup holder. What is the most important part to include in your sketch?', answer: 'The size of the hole for the cup', acceptedAnswers: ['the hole', 'cup size', 'how big', 'the opening', 'size'] },
        { prompt: 'When you sketch a design, should you draw ONE idea or MANY ideas first?', answer: 'many', acceptedAnswers: ['many', 'lots', 'more than one', 'multiple', 'several'] },
        { prompt: 'You are sketching a bridge. What should you label on your drawing?', answer: 'The parts and materials', acceptedAnswers: ['parts', 'materials', 'what its made of', 'sizes', 'labels', 'measurements'] },
        { prompt: 'A good design sketch has labels. True or false?', answer: 'true', acceptedAnswers: ['true', 'yes'] },
      ],
    },
    'pick-materials': {
      questions: [
        { prompt: 'You need to build something waterproof. Which material is better: paper or plastic wrap?', answer: 'plastic wrap', acceptedAnswers: ['plastic wrap', 'plastic', 'the plastic wrap'] },
        { prompt: 'You need a strong base for a tower. Which is better: cotton balls or wooden blocks?', answer: 'wooden blocks', acceptedAnswers: ['wooden blocks', 'blocks', 'wood'] },
        { prompt: 'You want to connect two paper tubes. Which would work: tape or water?', answer: 'tape', acceptedAnswers: ['tape'] },
        { prompt: 'Which is better for making a flexible hinge: a popsicle stick or a piece of fabric?', answer: 'fabric', acceptedAnswers: ['fabric', 'piece of fabric', 'cloth'] },
        { prompt: 'You are building a boat. Which material would float better: a rock or aluminum foil?', answer: 'aluminum foil', acceptedAnswers: ['aluminum foil', 'foil', 'the foil'] },
        { prompt: 'You need something heavy to hold your design down. Which is better: a feather or a stone?', answer: 'stone', acceptedAnswers: ['stone', 'rock', 'a stone'] },
      ],
    },
    'explain-your-plan': {
      questions: [
        { prompt: 'You plan to build a tall tower with blocks. Why did you choose blocks?', answer: 'Because blocks are strong and stackable', acceptedAnswers: ['strong', 'stackable', 'sturdy', 'they stack', 'hard', 'solid'] },
        { prompt: 'You chose tape instead of glue for your project. Why?', answer: 'Tape sticks right away, glue takes time to dry', acceptedAnswers: ['sticks fast', 'dries faster', 'works faster', 'no drying', 'quicker', 'instant'] },
        { prompt: 'You want to use a triangle shape for your bridge. Why is a triangle good?', answer: 'Triangles are strong shapes', acceptedAnswers: ['strong', 'stable', 'doesnt bend', 'sturdy', 'holds weight'] },
        { prompt: 'What is one reason you should explain your plan before building?', answer: 'So you know what to do and can get the right materials', acceptedAnswers: ['know what to do', 'get materials', 'be organized', 'have a plan', 'think first', 'be ready'] },
        { prompt: 'Your plan is to use foil to make a boat. What should your plan say about the shape?', answer: 'The shape should be wide and open to hold things', acceptedAnswers: ['wide', 'open', 'bowl shape', 'like a bowl', 'flat bottom', 'spread out'] },
      ],
    },
    'build-from-plan': {
      questions: [
        { prompt: 'You have a plan to build a tower. What should you do FIRST?', answer: 'Gather the materials listed in the plan', acceptedAnswers: ['gather materials', 'get materials', 'collect materials', 'get supplies', 'read the plan'] },
        { prompt: 'While building, you realize your plan won\'t work. What should you do?', answer: 'Change the plan and try a different way', acceptedAnswers: ['change the plan', 'try different', 'adjust', 'modify', 'fix the plan', 'redesign'] },
        { prompt: 'True or false: A prototype must be perfect.', answer: 'false', acceptedAnswers: ['false', 'no'] },
        { prompt: 'What is a prototype?', answer: 'A first version of a design to test', acceptedAnswers: ['first version', 'test version', 'model', 'first try', 'trial', 'test design', 'early version'] },
        { prompt: 'Should you follow your plan exactly or is it OK to make changes while building?', answer: 'It is OK to make changes', acceptedAnswers: ['ok to change', 'make changes', 'can change', 'its ok', 'adjust', 'yes changes are ok'] },
      ],
    },
    'test-your-design': {
      questions: [
        { prompt: 'You built a bridge for toy cars. How do you test it?', answer: 'Put a toy car on it and see if it holds', acceptedAnswers: ['put car on it', 'drive car over', 'place car', 'see if it holds', 'test with car'] },
        { prompt: 'Your boat is supposed to float and hold 5 pennies. What do you check?', answer: 'Does it float and hold 5 pennies', acceptedAnswers: ['float', 'hold pennies', 'stays floating', 'doesnt sink', 'holds 5 pennies'] },
        { prompt: 'Why is it important to test your design?', answer: 'To see if it actually works', acceptedAnswers: ['see if it works', 'check if works', 'find problems', 'know if it meets the goal', 'make sure it works'] },
        { prompt: 'You tested your tower and it fell. Is that a failure or useful information?', answer: 'Useful information', acceptedAnswers: ['useful information', 'useful', 'information', 'data', 'helpful', 'learning', 'not a failure'] },
        { prompt: 'How many times should you test your design: once or more than once?', answer: 'more than once', acceptedAnswers: ['more than once', 'multiple times', 'many times', 'several', 'a few times', 'at least twice'] },
      ],
    },
    'observe-results': {
      questions: [
        { prompt: 'Your tower held 3 blocks before falling. What should you write down?', answer: 'It held 3 blocks then fell', acceptedAnswers: ['held 3 blocks', '3 blocks', 'fell after 3', 'how many it held'] },
        { prompt: 'You tested two boats. Boat A held 4 pennies, Boat B held 7. Which worked better?', answer: 'Boat B', acceptedAnswers: ['boat b', 'b'] },
        { prompt: 'Why should you write down what happened during your test?', answer: 'So you remember what to improve', acceptedAnswers: ['remember', 'improve', 'know what to fix', 'learn from it', 'compare later', 'track results'] },
        { prompt: 'Your parachute fell fast. What did you observe about its size?', answer: 'It might be too small', acceptedAnswers: ['too small', 'small', 'not big enough', 'needs to be bigger'] },
        { prompt: 'After testing, should you think about what worked AND what didn\'t?', answer: 'yes', acceptedAnswers: ['yes', 'both', 'yes both'] },
      ],
    },
    'compare-two-designs': {
      questions: [
        { prompt: 'Bridge A holds 5 pennies. Bridge B holds 10 pennies. Which is stronger?', answer: 'Bridge B', acceptedAnswers: ['bridge b', 'b'] },
        { prompt: 'Shelter A lets water in. Shelter B keeps water out. Which meets the goal better?', answer: 'Shelter B', acceptedAnswers: ['shelter b', 'b'] },
        { prompt: 'Tower A is 20 cm tall and wobbly. Tower B is 15 cm tall and stable. If the goal is tallest AND stable, what do you notice?', answer: 'Tower A is taller but not stable, Tower B is stable but shorter', acceptedAnswers: ['a is taller but wobbly', 'b is stable but shorter', 'neither is perfect', 'trade off', 'a tall but wobbly'] },
        { prompt: 'When comparing designs, what should you check them against?', answer: 'The criteria — what the solution must do', acceptedAnswers: ['criteria', 'the goal', 'requirements', 'what it must do', 'the rules'] },
        { prompt: 'Two designs both work. How do you pick the better one?', answer: 'See which one works better or uses fewer materials', acceptedAnswers: ['works better', 'fewer materials', 'compare results', 'test both', 'which is stronger', 'which is more efficient'] },
      ],
    },
    'pick-the-better-one': {
      questions: [
        { prompt: 'Cup A holds water but tips over easily. Cup B holds water and is stable. Which is better?', answer: 'Cup B', acceptedAnswers: ['cup b', 'b'] },
        { prompt: 'Ramp A sends the car 30 cm. Ramp B sends the car 50 cm. If the goal is distance, which wins?', answer: 'Ramp B', acceptedAnswers: ['ramp b', 'b'] },
        { prompt: 'Design A uses 20 blocks. Design B uses 8 blocks. Both hold the same weight. Which uses materials more wisely?', answer: 'Design B', acceptedAnswers: ['design b', 'b'] },
        { prompt: 'Fan A blows the sailboat across the table. Fan B does not move the boat. Which is the better fan design?', answer: 'Fan A', acceptedAnswers: ['fan a', 'a'] },
        { prompt: 'Is it possible that NEITHER design is good enough and you need a new idea?', answer: 'yes', acceptedAnswers: ['yes', 'true', 'yeah'] },
      ],
    },
    'explain-why-better': {
      questions: [
        { prompt: 'You picked Design B because it held more weight. How would you explain your choice?', answer: 'Design B is better because it held more weight, which was the goal', acceptedAnswers: ['held more weight', 'stronger', 'met the goal', 'held more', 'it was stronger'] },
        { prompt: 'Why is it important to explain WHY you picked one design over another?', answer: 'So you understand what makes a good design', acceptedAnswers: ['understand', 'learn', 'know why', 'make better choices', 'explain thinking', 'use evidence'] },
        { prompt: 'You chose the wider bridge. Give one reason why wider might be better.', answer: 'Wider bridges are more stable and harder to tip', acceptedAnswers: ['more stable', 'harder to tip', 'stronger', 'holds more', 'balanced'] },
        { prompt: 'After comparing, you picked the design that used less tape. What is a reason that could matter?', answer: 'Using less material is more efficient', acceptedAnswers: ['less material', 'efficient', 'saves tape', 'less waste', 'simpler'] },
        { prompt: 'When you explain your choice, should you just say "I like it" or give a reason based on testing?', answer: 'Give a reason based on testing', acceptedAnswers: ['reason', 'testing', 'based on testing', 'give a reason', 'use data', 'evidence'] },
      ],
    },
  },
  'grade-3': {
    'state-criteria': {
      questions: [
        { prompt: 'You are building an egg protector for a 2-meter drop. State one criterion.', answer: 'The egg must not break when dropped from 2 meters', acceptedAnswers: ['egg must not break', 'protect the egg', 'egg survives', 'egg doesnt crack', 'egg stays whole'] },
        { prompt: 'What does "criteria" mean in engineering?', answer: 'What the solution MUST do to be successful', acceptedAnswers: ['what it must do', 'requirements', 'goals', 'what solution must do', 'success conditions'] },
        { prompt: 'Your solar oven must heat a marshmallow. State this as a criterion.', answer: 'The oven must raise the marshmallow temperature enough to soften it', acceptedAnswers: ['heat marshmallow', 'melt marshmallow', 'warm marshmallow', 'soften marshmallow', 'cook marshmallow'] },
        { prompt: 'A water filter must produce clear water. Is this a criterion or a constraint?', answer: 'criterion', acceptedAnswers: ['criterion', 'criteria'] },
        { prompt: 'Your bridge must hold at least 500 grams. Is "at least 500 grams" a criterion or constraint?', answer: 'criterion', acceptedAnswers: ['criterion', 'criteria'] },
        { prompt: 'Name one criterion for a good backpack design.', answer: 'It must hold books and supplies comfortably', acceptedAnswers: ['hold books', 'carry things', 'comfortable', 'fit supplies', 'hold items'] },
      ],
    },
    'identify-constraints': {
      questions: [
        { prompt: 'You can only use paper, tape, and straws. What type of limitation is this?', answer: 'A material constraint', acceptedAnswers: ['material constraint', 'materials', 'constraint', 'material limit'] },
        { prompt: 'You have 30 minutes to build and test. Is this a criterion or a constraint?', answer: 'constraint', acceptedAnswers: ['constraint'] },
        { prompt: 'Your design cannot weigh more than 200 grams. What kind of constraint is this?', answer: 'A weight constraint', acceptedAnswers: ['weight constraint', 'weight', 'mass constraint', 'weight limit'] },
        { prompt: 'The bridge must fit on the desk (60 cm). What is this constraint about?', answer: 'Size', acceptedAnswers: ['size', 'space', 'length', 'dimension', 'fit'] },
        { prompt: 'Your budget is $5 for materials. Is this a criterion or constraint?', answer: 'constraint', acceptedAnswers: ['constraint'] },
        { prompt: 'Why are constraints important in engineering?', answer: 'They force creative thinking within real-world limits', acceptedAnswers: ['creative thinking', 'real world', 'force creativity', 'limits', 'realistic', 'real limits'] },
      ],
    },
    'distinguish-criteria-vs-constraints': {
      questions: [
        { prompt: '"Must hold 10 pennies" — criterion or constraint?', answer: 'criterion', acceptedAnswers: ['criterion', 'criteria'] },
        { prompt: '"Only use paper and tape" — criterion or constraint?', answer: 'constraint', acceptedAnswers: ['constraint'] },
        { prompt: '"Must float for 30 seconds" — criterion or constraint?', answer: 'criterion', acceptedAnswers: ['criterion', 'criteria'] },
        { prompt: '"Cannot be taller than 30 cm" — criterion or constraint?', answer: 'constraint', acceptedAnswers: ['constraint'] },
        { prompt: '"Must keep the egg from breaking" — criterion or constraint?', answer: 'criterion', acceptedAnswers: ['criterion', 'criteria'] },
        { prompt: '"Time limit: 20 minutes" — criterion or constraint?', answer: 'constraint', acceptedAnswers: ['constraint'] },
        { prompt: '"Must span a 25 cm gap" — criterion or constraint?', answer: 'criterion', acceptedAnswers: ['criterion', 'criteria'] },
        { prompt: '"Budget: $3 maximum" — criterion or constraint?', answer: 'constraint', acceptedAnswers: ['constraint'] },
      ],
    },
    'generate-multiple-ideas': {
      questions: [
        { prompt: 'How many ideas should you brainstorm before picking one?', answer: 'At least 3', acceptedAnswers: ['at least 3', '3 or more', 'many', 'several', 'lots', 'multiple', '3'] },
        { prompt: 'During brainstorming, should you judge ideas right away?', answer: 'No, generate ideas first without judging', acceptedAnswers: ['no', 'no judging', 'not yet', 'generate first', 'no judgment'] },
        { prompt: 'Your problem: keep a drink cold. Name one possible solution approach.', answer: 'Wrap it in insulation material', acceptedAnswers: ['insulation', 'wrap it', 'cooler', 'ice', 'shade', 'thermos', 'foam'] },
        { prompt: 'Why is brainstorming many ideas better than going with your first idea?', answer: 'You might find a better solution', acceptedAnswers: ['better solution', 'more options', 'compare', 'best one', 'more choices', 'find better'] },
        { prompt: 'Can a silly-sounding idea lead to a good design?', answer: 'Yes, unexpected ideas can be creative solutions', acceptedAnswers: ['yes', 'yeah', 'true', 'sometimes'] },
      ],
    },
    'evaluate-ideas-against-criteria': {
      questions: [
        { prompt: 'You have 3 bridge ideas. What should you check each idea against?', answer: 'The criteria and constraints', acceptedAnswers: ['criteria', 'constraints', 'criteria and constraints', 'requirements', 'the goals'] },
        { prompt: 'Idea A meets all criteria but breaks constraints. Should you pick it?', answer: 'No, it must meet both criteria and constraints', acceptedAnswers: ['no', 'must meet both', 'no it breaks constraints', 'cant use it'] },
        { prompt: 'Idea B meets criteria and constraints. Idea C meets criteria but is too heavy. Which do you pick?', answer: 'Idea B', acceptedAnswers: ['idea b', 'b'] },
        { prompt: 'What is one way to organize your evaluation of multiple ideas?', answer: 'Make a chart comparing each idea against the criteria', acceptedAnswers: ['chart', 'table', 'list', 'compare', 'checklist', 'matrix'] },
        { prompt: 'None of your ideas fully meet the criteria. What should you do?', answer: 'Combine the best parts of different ideas or brainstorm more', acceptedAnswers: ['combine', 'brainstorm more', 'new ideas', 'mix ideas', 'combine best parts', 'try again'] },
      ],
    },
    'select-promising-solution': {
      questions: [
        { prompt: 'After evaluating, you pick the idea that best meets criteria within constraints. What is this step called?', answer: 'Selecting the most promising solution', acceptedAnswers: ['selecting', 'choosing', 'picking', 'selecting solution', 'decision'] },
        { prompt: 'Should you pick the easiest idea or the one most likely to meet criteria?', answer: 'The one most likely to meet criteria', acceptedAnswers: ['meet criteria', 'most likely', 'criteria', 'best one', 'the one that works'] },
        { prompt: 'You selected a design. Can you change your mind later?', answer: 'Yes, engineering is iterative', acceptedAnswers: ['yes', 'yeah', 'of course', 'true'] },
        { prompt: 'What should you do right after selecting your best idea?', answer: 'Make a detailed plan or sketch', acceptedAnswers: ['plan', 'sketch', 'draw', 'detailed plan', 'design it', 'make a plan'] },
        { prompt: 'Two ideas seem equally good. How do you choose?', answer: 'Pick the simpler one or the one easier to build and test', acceptedAnswers: ['simpler', 'easier', 'easier to build', 'simpler one', 'less materials', 'quicker'] },
      ],
    },
    'sketch-detailed-design': {
      questions: [
        { prompt: 'What should a detailed design sketch include?', answer: 'Labels, measurements, and materials', acceptedAnswers: ['labels', 'measurements', 'materials', 'labels and measurements', 'dimensions'] },
        { prompt: 'Why is it important to include measurements on your sketch?', answer: 'So you know exactly how big to make each part', acceptedAnswers: ['know how big', 'accuracy', 'right size', 'build correctly', 'exact size'] },
        { prompt: 'Should your sketch show just the outside or also how the inside works?', answer: 'Both, if the inside matters for how it works', acceptedAnswers: ['both', 'inside too', 'both sides', 'inside and outside'] },
        { prompt: 'You sketched your bridge. What should you label?', answer: 'Each part, the materials, and the measurements', acceptedAnswers: ['parts', 'materials', 'measurements', 'everything', 'all parts'] },
        { prompt: 'Is a quick doodle enough for a detailed design?', answer: 'No, a detailed design needs labels and measurements', acceptedAnswers: ['no', 'not enough', 'need more detail', 'needs labels'] },
      ],
    },
    'list-materials-and-steps': {
      questions: [
        { prompt: 'Why should you list materials BEFORE building?', answer: 'So you have everything you need ready', acceptedAnswers: ['have everything', 'be ready', 'prepared', 'know what you need', 'dont forget anything'] },
        { prompt: 'Your plan says: tape, 10 straws, 2 paper plates. What is this list called?', answer: 'A materials list', acceptedAnswers: ['materials list', 'supply list', 'materials', 'list of materials'] },
        { prompt: 'Should your steps be in order?', answer: 'Yes, build steps should be in order', acceptedAnswers: ['yes', 'in order', 'sequential', 'true'] },
        { prompt: 'You need to cut, fold, then tape. What happens if you tape before folding?', answer: 'It might not fit or work correctly', acceptedAnswers: ['wont work', 'wont fit', 'wrong shape', 'messed up', 'problems'] },
        { prompt: 'What should the first step usually be?', answer: 'Gather all materials', acceptedAnswers: ['gather materials', 'get materials', 'collect materials', 'get supplies'] },
      ],
    },
    'build-prototype': {
      questions: [
        { prompt: 'What is a prototype?', answer: 'An early model of a design built to test an idea', acceptedAnswers: ['early model', 'test version', 'first build', 'model to test', 'test model'] },
        { prompt: 'Does a prototype need to be perfect?', answer: 'No, it is for testing and learning', acceptedAnswers: ['no', 'not perfect', 'for testing', 'doesnt need to be'] },
        { prompt: 'While building, you discover a problem with your plan. What do you do?', answer: 'Adjust the plan and keep building', acceptedAnswers: ['adjust', 'change plan', 'fix it', 'modify', 'adapt'] },
        { prompt: 'What is more important for a prototype: looking pretty or working well?', answer: 'Working well', acceptedAnswers: ['working well', 'function', 'working', 'that it works'] },
        { prompt: 'How many prototypes might you build before your final design?', answer: 'Several — engineers often build many prototypes', acceptedAnswers: ['several', 'many', 'more than one', 'multiple', 'lots'] },
      ],
    },
    'plan-a-fair-test': {
      questions: [
        { prompt: 'What makes a test "fair"?', answer: 'You only change one thing at a time and keep everything else the same', acceptedAnswers: ['one thing at a time', 'change one variable', 'keep everything else same', 'control variables'] },
        { prompt: 'You are testing two bridge designs. What must be the same for both tests?', answer: 'The weight used, how it is placed, and the gap distance', acceptedAnswers: ['weight', 'same weight', 'same conditions', 'gap', 'same setup', 'everything except the bridge'] },
        { prompt: 'You test your catapult 3 times. Why more than once?', answer: 'To make sure results are consistent and reliable', acceptedAnswers: ['consistent', 'reliable', 'accurate', 'make sure', 'verify', 'not a fluke'] },
        { prompt: 'What should you record during testing?', answer: 'Numbers, observations, and what happened', acceptedAnswers: ['numbers', 'observations', 'data', 'results', 'what happened', 'measurements'] },
        { prompt: 'If you change the material AND the shape at the same time, is that a fair test?', answer: 'No, you changed two things', acceptedAnswers: ['no', 'not fair', 'two variables', 'no two things changed'] },
      ],
    },
    'collect-test-data': {
      questions: [
        { prompt: 'Your bridge held 350g, 375g, and 360g in three trials. What should you record?', answer: 'All three results', acceptedAnswers: ['all three', 'all results', 'every trial', '350 375 360', 'each one'] },
        { prompt: 'Should you record results that are not what you expected?', answer: 'Yes, all data is important', acceptedAnswers: ['yes', 'all data', 'yes always', 'of course'] },
        { prompt: 'What tool would you use to measure how far a car travels?', answer: 'A ruler or measuring tape', acceptedAnswers: ['ruler', 'measuring tape', 'tape measure', 'meter stick'] },
        { prompt: 'Your filter test: first try = cloudy, second try = mostly clear, third = clear. What do you see?', answer: 'The filter improved with each test', acceptedAnswers: ['improved', 'got better', 'getting clearer', 'improving', 'better each time'] },
        { prompt: 'Why should you use numbers in your test data instead of just "good" or "bad"?', answer: 'Numbers are more exact and you can compare them', acceptedAnswers: ['more exact', 'compare', 'precise', 'specific', 'accurate', 'measurable'] },
      ],
    },
    'identify-improvements': {
      questions: [
        { prompt: 'Your bridge held 300g but the goal is 500g. What should you do?', answer: 'Figure out why it failed and redesign that part', acceptedAnswers: ['redesign', 'figure out why', 'improve', 'strengthen', 'change design', 'make it stronger'] },
        { prompt: 'Your egg protector worked but weighed 400g. The limit is 200g. What should you improve?', answer: 'Reduce the weight while keeping the egg safe', acceptedAnswers: ['reduce weight', 'make lighter', 'less material', 'lighter', 'use less'] },
        { prompt: 'When improving, should you change everything at once or one thing at a time?', answer: 'One thing at a time', acceptedAnswers: ['one thing', 'one at a time', 'one change', 'one variable'] },
        { prompt: 'Your catapult shoots too far left. What is one thing you could try?', answer: 'Adjust the angle or position of the arm', acceptedAnswers: ['adjust angle', 'change position', 'aim', 'straighten', 'realign', 'fix the arm'] },
        { prompt: 'After improving and retesting, your design works. What should you do?', answer: 'Record what you changed and why it worked', acceptedAnswers: ['record', 'write down', 'document', 'note what changed', 'record changes'] },
      ],
    },
    'name-the-steps': {
      questions: [
        { prompt: 'What are the main steps of the engineering design process?', answer: 'Ask, Imagine, Plan, Create, Test, Improve', acceptedAnswers: ['ask imagine plan create test improve', 'define brainstorm plan build test improve', 'ask imagine plan create test', 'define imagine plan build test improve'] },
        { prompt: 'Which step comes first: Build or Plan?', answer: 'Plan', acceptedAnswers: ['plan'] },
        { prompt: 'After testing, what is the next step?', answer: 'Improve', acceptedAnswers: ['improve', 'iterate', 'redesign'] },
        { prompt: 'Which step involves brainstorming many ideas?', answer: 'Imagine', acceptedAnswers: ['imagine', 'brainstorm', 'brainstorming'] },
        { prompt: 'The design process is a cycle. What does that mean?', answer: 'You go through the steps more than once, improving each time', acceptedAnswers: ['repeat', 'more than once', 'iterate', 'cycle', 'go back', 'do it again', 'loop'] },
        { prompt: 'In which step do you define the problem, criteria, and constraints?', answer: 'Ask', acceptedAnswers: ['ask', 'define', 'ask/define'] },
      ],
    },
    'apply-full-process': {
      questions: [
        { prompt: 'You need to design a container that keeps ice frozen for 30 minutes using only newspaper, foil, and tape. What step are you in when you read this?', answer: 'Ask — understanding the problem', acceptedAnswers: ['ask', 'define', 'defining the problem', 'understanding the problem'] },
        { prompt: 'You just sketched 4 different container designs. What step is this?', answer: 'Imagine — brainstorming solutions', acceptedAnswers: ['imagine', 'brainstorm', 'brainstorming'] },
        { prompt: 'You picked Design C and drew it with labels and a materials list. What step?', answer: 'Plan', acceptedAnswers: ['plan', 'planning'] },
        { prompt: 'You wrapped foil around crumpled newspaper and sealed it with tape. What step?', answer: 'Create — building the prototype', acceptedAnswers: ['create', 'build', 'building'] },
        { prompt: 'You put ice inside and checked every 5 minutes. What step?', answer: 'Test', acceptedAnswers: ['test', 'testing'] },
        { prompt: 'The ice melted in 20 minutes. You decide to add more newspaper layers. What step?', answer: 'Improve', acceptedAnswers: ['improve', 'iterate', 'improving'] },
      ],
    },
    'reflect-on-iteration': {
      questions: [
        { prompt: 'Why is the first design rarely the best?', answer: 'You learn from testing what needs to change', acceptedAnswers: ['learn from testing', 'find problems', 'need to improve', 'discover issues', 'testing reveals problems'] },
        { prompt: 'You built 3 versions of your catapult. What did each version teach you?', answer: 'Each version showed what worked and what to change', acceptedAnswers: ['what worked', 'what to change', 'improvements', 'lessons', 'what to fix'] },
        { prompt: 'Real engineers at NASA test rockets many times. Why?', answer: 'Each test reveals problems to fix before the real mission', acceptedAnswers: ['find problems', 'fix problems', 'safety', 'make sure it works', 'improve', 'discover issues'] },
        { prompt: 'After 3 iterations, your design meets all criteria. What should you document?', answer: 'What you changed each time and why the final version works', acceptedAnswers: ['what changed', 'changes', 'why it works', 'the process', 'each iteration'] },
        { prompt: 'What is the difference between giving up and iterating?', answer: 'Iterating means using what you learned to try again differently', acceptedAnswers: ['try again', 'learn and change', 'use what you learned', 'keep going differently', 'try different way'] },
      ],
    },
  },
  'grade-6': {
    'identify-system-parts': {
      questions: [
        { prompt: 'A bicycle is a system. Name 3 parts of this system.', answer: 'Wheels, chain, pedals', acceptedAnswers: ['wheels', 'chain', 'pedals', 'gears', 'brakes', 'frame', 'handlebars', 'seat'] },
        { prompt: 'In a water purification system, what are the inputs?', answer: 'Dirty water and energy', acceptedAnswers: ['dirty water', 'contaminated water', 'unclean water', 'water', 'energy'] },
        { prompt: 'What is the output of a solar panel system?', answer: 'Electricity', acceptedAnswers: ['electricity', 'electrical energy', 'power', 'electric current'] },
        { prompt: 'A heating system has a thermostat. What role does the thermostat play?', answer: 'It controls or regulates the system', acceptedAnswers: ['controls', 'regulates', 'feedback', 'controller', 'turns it on and off'] },
        { prompt: 'What is a "system" in engineering?', answer: 'A group of interacting parts that work together to accomplish a function', acceptedAnswers: ['interacting parts', 'parts working together', 'group of parts', 'connected components'] },
        { prompt: 'A bridge has support beams, a deck, and foundations. If you remove the foundations, what happens to the system?', answer: 'The bridge cannot stand — each part depends on the others', acceptedAnswers: ['bridge falls', 'collapses', 'cant stand', 'doesnt work', 'fails'] },
      ],
    },
    'describe-interactions': {
      questions: [
        { prompt: 'In a catapult, how does the arm interact with the projectile?', answer: 'The arm transfers energy to launch the projectile', acceptedAnswers: ['transfers energy', 'launches', 'flings', 'pushes', 'propels'] },
        { prompt: 'In a water filter, how do the layers of sand and gravel interact with the water?', answer: 'They trap particles as water passes through, filtering it', acceptedAnswers: ['trap particles', 'filter', 'remove dirt', 'catch impurities', 'clean the water'] },
        { prompt: 'How do gears interact in a machine?', answer: 'They transfer rotational motion and can change speed or direction', acceptedAnswers: ['transfer motion', 'change speed', 'turn each other', 'transfer force', 'mesh together'] },
        { prompt: 'In a circuit, how does the battery interact with the bulb?', answer: 'The battery provides electrical energy that the bulb converts to light', acceptedAnswers: ['provides energy', 'powers', 'sends current', 'electricity flows', 'provides power'] },
        { prompt: 'A thermos has an inner wall and outer wall with a vacuum between them. How do these parts interact?', answer: 'The vacuum prevents heat transfer between inside and outside', acceptedAnswers: ['prevents heat transfer', 'insulates', 'blocks heat', 'stops conduction', 'keeps heat in'] },
      ],
    },
    'predict-system-behavior': {
      questions: [
        { prompt: 'If you add a heavier weight to a catapult, what do you predict will happen to launch distance?', answer: 'The projectile will travel a shorter distance', acceptedAnswers: ['shorter distance', 'less far', 'not as far', 'shorter', 'wont go as far'] },
        { prompt: 'If you make a wind turbine blade wider, what might happen?', answer: 'It catches more wind but may be heavier and spin slower', acceptedAnswers: ['catches more wind', 'more drag', 'slower', 'heavier', 'more force but slower'] },
        { prompt: 'A bridge has 4 support columns. You remove one. Predict the effect.', answer: 'The bridge becomes weaker and may collapse under load', acceptedAnswers: ['weaker', 'collapse', 'less strong', 'fail', 'cant hold as much'] },
        { prompt: 'You double the thickness of insulation around a container. Predict the effect on temperature.', answer: 'Temperature inside will stay stable longer', acceptedAnswers: ['stays stable', 'stays warmer', 'stays colder', 'better insulated', 'less heat loss'] },
        { prompt: 'A water filter has 3 layers. You add a 4th layer of activated charcoal. Predict the effect.', answer: 'The water will be cleaner — more layers catch more impurities', acceptedAnswers: ['cleaner water', 'more filtered', 'purer', 'catches more', 'removes more'] },
      ],
    },
    'identify-trade-offs': {
      questions: [
        { prompt: 'Making a bridge stronger often means using more material. What is the trade-off?', answer: 'Strength vs. weight and cost', acceptedAnswers: ['strength vs weight', 'strength vs cost', 'stronger but heavier', 'more material more cost'] },
        { prompt: 'A faster car design is less aerodynamic for cargo space. What is the trade-off?', answer: 'Speed vs. cargo capacity', acceptedAnswers: ['speed vs cargo', 'speed vs space', 'fast vs storage', 'aerodynamics vs space'] },
        { prompt: 'Using titanium instead of steel makes a design lighter but much more expensive. What is the trade-off?', answer: 'Weight vs. cost', acceptedAnswers: ['weight vs cost', 'lighter vs expensive', 'performance vs cost'] },
        { prompt: 'A thicker phone case protects better but makes the phone bulky. What is the trade-off?', answer: 'Protection vs. size and convenience', acceptedAnswers: ['protection vs size', 'safety vs bulk', 'protection vs convenience', 'protection vs portability'] },
        { prompt: 'What does "trade-off" mean in engineering?', answer: 'Giving up one benefit to gain another', acceptedAnswers: ['giving up one for another', 'sacrifice one benefit', 'compromise', 'balance between options'] },
      ],
    },
    'evaluate-competing-criteria': {
      questions: [
        { prompt: 'A bridge must be strong AND lightweight. These compete. How do you decide what matters more?', answer: 'Look at the specific requirements — which criterion has a higher priority?', acceptedAnswers: ['priority', 'requirements', 'which matters more', 'context', 'depends on use', 'rank them'] },
        { prompt: 'A helmet must be protective AND comfortable. If you can only optimize one, how do you choose?', answer: 'Safety is more important — optimize protection first, then comfort', acceptedAnswers: ['safety first', 'protection', 'safety', 'protect first'] },
        { prompt: 'Your robot must be fast AND accurate. Tests show faster = less accurate. What do you do?', answer: 'Find the best balance between speed and accuracy for the task', acceptedAnswers: ['balance', 'compromise', 'optimize both', 'find middle', 'trade off'] },
        { prompt: 'A building must be earthquake-resistant AND affordable. How might engineers balance these?', answer: 'Use cost-effective materials and designs that still meet safety standards', acceptedAnswers: ['cost effective', 'meet standards', 'balance cost and safety', 'smart materials', 'efficient design'] },
        { prompt: 'What tool can help you weigh competing criteria systematically?', answer: 'A decision matrix — score each design against each criterion', acceptedAnswers: ['decision matrix', 'matrix', 'scoring chart', 'rubric', 'weighted chart', 'comparison table'] },
      ],
    },
    'optimize-a-design': {
      questions: [
        { prompt: 'Your rocket flies 10 meters but the goal is 15. Name one variable you could optimize.', answer: 'Fin size, nose cone shape, or launch angle', acceptedAnswers: ['fin size', 'nose cone', 'launch angle', 'weight', 'shape', 'pressure'] },
        { prompt: 'What does "optimize" mean in engineering?', answer: 'Make the best possible design within the given constraints', acceptedAnswers: ['best possible', 'improve', 'make the best', 'maximize performance', 'best within constraints'] },
        { prompt: 'You tested 5 fin shapes. Shape C went farthest. To optimize, what do you test next?', answer: 'Variations of shape C — slightly different sizes or angles', acceptedAnswers: ['variations of c', 'modify c', 'adjust c', 'tweak c', 'change c slightly'] },
        { prompt: 'Your water filter is 90% effective. The goal is 95%. What might you optimize?', answer: 'Add finer filter material or add more filter layers', acceptedAnswers: ['finer material', 'more layers', 'better filter', 'add layer', 'finer mesh'] },
        { prompt: 'Is there always one perfect optimal solution?', answer: 'No, optimization depends on which criteria you prioritize', acceptedAnswers: ['no', 'depends', 'not always', 'depends on priorities', 'multiple solutions'] },
      ],
    },
    'build-a-model': {
      questions: [
        { prompt: 'Why do engineers build models before building the real thing?', answer: 'To test ideas cheaply and safely before committing to full scale', acceptedAnswers: ['test ideas', 'cheaper', 'safer', 'find problems early', 'save money', 'test cheaply'] },
        { prompt: 'What is the difference between a physical model and a computer model?', answer: 'Physical models are built with real materials; computer models use software simulations', acceptedAnswers: ['physical is real', 'computer is simulated', 'real vs digital', 'materials vs software', 'tangible vs virtual'] },
        { prompt: 'A scale model of a bridge is 1/10 the size. If the real bridge is 50 meters, how long is the model?', answer: '5 meters', acceptedAnswers: ['5 meters', '5m', '5'] },
        { prompt: 'What is a limitation of models?', answer: 'They cannot perfectly represent all real-world conditions', acceptedAnswers: ['not perfect', 'simplified', 'not real', 'cant represent everything', 'limited accuracy'] },
        { prompt: 'An architect builds a cardboard model of a building. What can they learn from it?', answer: 'How the design looks, if the proportions work, and basic structural ideas', acceptedAnswers: ['how it looks', 'proportions', 'structure', 'layout', 'shape', 'design review'] },
      ],
    },
    'use-model-to-predict': {
      questions: [
        { prompt: 'You built a small model bridge that holds 2 kg. Can you assume the full-size bridge holds exactly 200x more?', answer: 'No, scaling does not work linearly — materials behave differently at different sizes', acceptedAnswers: ['no', 'not exactly', 'scaling is different', 'doesnt scale linearly', 'materials behave differently'] },
        { prompt: 'A computer simulation predicts your rocket reaches 50 meters. Should you trust this exactly?', answer: 'Use it as an estimate — real conditions may differ from the simulation', acceptedAnswers: ['estimate', 'not exactly', 'may differ', 'approximation', 'close but not exact'] },
        { prompt: 'Your wind tunnel model shows high drag on Design A. What does this predict for the real design?', answer: 'The real Design A will also likely have high drag', acceptedAnswers: ['high drag', 'also high drag', 'same problem', 'drag issue', 'similar result'] },
        { prompt: 'Why do engineers test models before building prototypes?', answer: 'To predict problems and improve the design before spending time and money', acceptedAnswers: ['predict problems', 'save money', 'find issues', 'improve design', 'catch mistakes early'] },
        { prompt: 'Your model shows the container leaks at the seams. What do you predict about the real container?', answer: 'It will also leak at the seams unless you fix the design', acceptedAnswers: ['also leak', 'leak too', 'same problem', 'needs fixing', 'will leak'] },
      ],
    },
    'refine-model-with-data': {
      questions: [
        { prompt: 'Your model predicted the car would travel 3 meters but it only went 2. What should you do with your model?', answer: 'Update the model to account for what you learned — maybe add friction', acceptedAnswers: ['update model', 'add friction', 'adjust', 'revise', 'fix the model', 'calibrate'] },
        { prompt: 'Real test data shows your bridge fails at 5 kg but the model predicted 8 kg. What does this mean?', answer: 'The model is overestimating strength — it needs to be refined', acceptedAnswers: ['overestimating', 'model is wrong', 'needs refining', 'inaccurate', 'adjust model'] },
        { prompt: 'How do you improve a model?', answer: 'Compare model predictions to real test data and adjust variables', acceptedAnswers: ['compare to real data', 'adjust variables', 'test and update', 'calibrate', 'use real data'] },
        { prompt: 'Your simulation did not account for wind. After adding wind, predictions get closer to reality. What did you do?', answer: 'Refined the model by adding a variable it was missing', acceptedAnswers: ['added variable', 'refined model', 'added wind', 'improved accuracy', 'made more realistic'] },
        { prompt: 'Is a model ever "finished"?', answer: 'Models can always be improved as you learn more', acceptedAnswers: ['no', 'always improve', 'never finished', 'keep improving', 'can always be better'] },
      ],
    },
    'identify-failure-point': {
      questions: [
        { prompt: 'Your bridge collapsed in the middle. Where is the failure point?', answer: 'The center of the bridge — it lacked support there', acceptedAnswers: ['center', 'middle', 'center of bridge', 'the middle span'] },
        { prompt: 'Your water filter works for 10 minutes then leaks. Where do you look for the failure?', answer: 'The seals or connections that hold over time', acceptedAnswers: ['seals', 'connections', 'joints', 'where it leaks', 'the weak point'] },
        { prompt: 'A paper tower crumpled at the base. What failed?', answer: 'The base could not support the weight above it', acceptedAnswers: ['base', 'base too weak', 'foundation', 'bottom section', 'support at bottom'] },
        { prompt: 'Your egg protector cracked on the left side during drop. What is the failure point?', answer: 'The left side — it had less cushioning or support', acceptedAnswers: ['left side', 'weak side', 'left', 'less protected side'] },
        { prompt: 'Why is identifying the exact failure point important?', answer: 'So you can fix that specific part without redesigning everything', acceptedAnswers: ['fix specific part', 'targeted fix', 'know what to change', 'efficient improvement', 'focus repair'] },
      ],
    },
    'determine-root-cause': {
      questions: [
        { prompt: 'A bridge broke in the middle. The root cause might be: (a) weak material, (b) no center support, (c) too much weight. How do you find out?', answer: 'Test each possibility separately — rebuild with center support, try stronger material, reduce weight', acceptedAnswers: ['test each', 'test separately', 'isolate variables', 'try one change at a time', 'experiment'] },
        { prompt: 'Your rocket veers left every time. What could be a root cause?', answer: 'Fins are not symmetrical or weight is unevenly distributed', acceptedAnswers: ['asymmetric fins', 'uneven weight', 'not balanced', 'fins uneven', 'weight distribution'] },
        { prompt: 'What is the difference between a symptom and a root cause?', answer: 'A symptom is what you observe; the root cause is the underlying reason', acceptedAnswers: ['symptom is what you see', 'root cause is why', 'underlying reason', 'cause vs effect'] },
        { prompt: 'Your solar oven does not get hot enough. List one possible root cause.', answer: 'Not enough reflective surface directing sunlight to the target', acceptedAnswers: ['not enough reflection', 'poor insulation', 'air leaks', 'wrong angle', 'not sealed', 'not enough foil'] },
        { prompt: 'You found the root cause: the joint was too weak. What do you do next?', answer: 'Redesign or reinforce the joint and retest', acceptedAnswers: ['reinforce', 'redesign joint', 'fix joint', 'stronger joint', 'retest'] },
      ],
    },
    'propose-fix': {
      questions: [
        { prompt: 'Root cause: bridge base is too narrow. Propose a fix.', answer: 'Widen the base to increase stability', acceptedAnswers: ['widen base', 'wider base', 'make base wider', 'increase base width', 'broader base'] },
        { prompt: 'Root cause: parachute falls too fast due to small canopy. Propose a fix.', answer: 'Increase the canopy size to catch more air', acceptedAnswers: ['bigger canopy', 'larger canopy', 'increase canopy', 'make it bigger', 'more surface area'] },
        { prompt: 'Root cause: the glue joint fails under stress. Propose two possible fixes.', answer: 'Use stronger adhesive or add mechanical fasteners like bolts', acceptedAnswers: ['stronger glue', 'bolts', 'screws', 'better adhesive', 'reinforcement', 'more glue'] },
        { prompt: 'After proposing a fix, what must you do?', answer: 'Test the fix to see if it actually solves the problem', acceptedAnswers: ['test it', 'retest', 'verify', 'check if it works', 'test again'] },
        { prompt: 'Your fix solved one problem but created another. What is this called?', answer: 'An unintended consequence or a new trade-off', acceptedAnswers: ['unintended consequence', 'trade off', 'side effect', 'new problem', 'unexpected result'] },
      ],
    },
    'plan-multiple-iterations': {
      questions: [
        { prompt: 'You are planning a project with 3 weeks. How would you schedule iterations?', answer: 'Build and test version 1 in week 1, improve in week 2, finalize in week 3', acceptedAnswers: ['weekly iterations', 'version each week', 'build test improve each week', 'plan multiple builds'] },
        { prompt: 'Why should you plan for multiple iterations from the start?', answer: 'Because the first design almost never meets all criteria perfectly', acceptedAnswers: ['first design isnt perfect', 'need improvement', 'expect to iterate', 'designs need refinement'] },
        { prompt: 'How many iterations is typical for a well-designed engineering project?', answer: 'At least 2-3, often more for complex projects', acceptedAnswers: ['2-3', 'at least 2', 'several', 'multiple', '3 or more'] },
        { prompt: 'What should change between iterations?', answer: 'Only the specific aspects identified as needing improvement', acceptedAnswers: ['specific aspects', 'what needs improvement', 'one thing', 'identified problems', 'weak points'] },
        { prompt: 'How do you decide when to stop iterating?', answer: 'When all criteria are met within constraints, or time runs out', acceptedAnswers: ['criteria met', 'meets all criteria', 'good enough', 'time runs out', 'requirements satisfied'] },
      ],
    },
    'use-data-to-revise': {
      questions: [
        { prompt: 'Your test data shows the rocket goes 8m, 7m, 9m. The goal is 12m. What does the data tell you?', answer: 'Consistently falling short — need significant design change, not minor tweaks', acceptedAnswers: ['need big change', 'consistently short', 'significant change needed', 'not enough', 'major revision'] },
        { prompt: 'Trial 1: 5m, Trial 2 (wider fins): 9m, Trial 3 (even wider): 7m. What does the data suggest?', answer: 'There is an optimal fin size — medium is best, too wide hurts performance', acceptedAnswers: ['optimal size', 'too wide is bad', 'medium best', 'sweet spot', 'peak in middle'] },
        { prompt: 'Why is data better than guessing when making design changes?', answer: 'Data shows what actually works, not what you think might work', acceptedAnswers: ['shows what works', 'evidence based', 'objective', 'accurate', 'reliable', 'proof'] },
        { prompt: 'Your insulation test: foam = 20 min, cotton = 12 min, newspaper = 15 min. Which material should you use?', answer: 'Foam — it kept temperature stable the longest', acceptedAnswers: ['foam', 'foam 20 min', 'the foam'] },
        { prompt: 'After each test, you record data in a table. Why tables?', answer: 'Tables organize data so you can compare results easily', acceptedAnswers: ['organize', 'compare', 'easy to read', 'organized', 'comparison', 'structured'] },
      ],
    },
    'document-design-evolution': {
      questions: [
        { prompt: 'What should your engineering notebook include for each iteration?', answer: 'The design sketch, what changed, test results, and reasoning for changes', acceptedAnswers: ['sketch', 'changes', 'test results', 'reasoning', 'what changed and why'] },
        { prompt: 'Why document designs that failed?', answer: 'Failed designs teach you what does not work and prevent repeating mistakes', acceptedAnswers: ['learn from failure', 'prevent repeating', 'what doesnt work', 'important data', 'avoid same mistake'] },
        { prompt: 'You have 4 iterations documented. A teammate asks why you changed from v2 to v3. Where do you look?', answer: 'The iteration log or engineering notebook entry for version 3', acceptedAnswers: ['notebook', 'iteration log', 'log', 'documentation', 'notes for v3'] },
        { prompt: 'What is the value of a well-documented design history?', answer: 'Others can learn from your process and continue improving the design', acceptedAnswers: ['others can learn', 'continue improving', 'share knowledge', 'reproducible', 'teachable'] },
        { prompt: 'Your final report should show the journey from first idea to final design. Why?', answer: 'It demonstrates the engineering process and justifies design decisions', acceptedAnswers: ['shows process', 'justifies decisions', 'demonstrates engineering', 'explains choices', 'shows thinking'] },
      ],
    },
  },
};

// Copy K content to grade-1 and grade-2
CONTENT_BANKS['grade-1'] = CONTENT_BANKS['kindergarten'];
CONTENT_BANKS['grade-2'] = CONTENT_BANKS['kindergarten'];

// Copy grade-3 content to grade-4 and grade-5
CONTENT_BANKS['grade-4'] = CONTENT_BANKS['grade-3'];
CONTENT_BANKS['grade-5'] = CONTENT_BANKS['grade-3'];

// Copy grade-6 content to grade-7 and grade-8
CONTENT_BANKS['grade-7'] = CONTENT_BANKS['grade-6'];
CONTENT_BANKS['grade-8'] = CONTENT_BANKS['grade-6'];

const DESIGN_SCENARIOS = {
  'kindergarten': [
    { title: 'Bridge Builder', focus: 'building-testing', scenario: 'Build a bridge out of paper and tape that holds 10 pennies across a 20 cm gap.', criteria: 'Hold 10 pennies without falling', constraints: 'Only paper and tape' },
    { title: 'Boat Float', focus: 'comparing-solutions', scenario: 'Make a boat from aluminum foil that holds as many pennies as possible without sinking.', criteria: 'Hold the most pennies', constraints: 'One sheet of aluminum foil' },
    { title: 'Tallest Tower', focus: 'building-testing', scenario: 'Build the tallest free-standing tower you can using only marshmallows and spaghetti.', criteria: 'Stand on its own and be as tall as possible', constraints: '20 marshmallows and 20 spaghetti sticks' },
  ],
  'grade-1': [
    { title: 'Animal Home', focus: 'asking-defining-problems', scenario: 'Design a shelter for a toy animal that keeps it dry during a "rainstorm" (spray bottle).', criteria: 'Keep the animal dry', constraints: 'Paper, foil, tape, and a plate for the base' },
    { title: 'Wind Catcher', focus: 'designing-solutions', scenario: 'Build something that moves across the table when you blow on it with a fan.', criteria: 'Travels at least 30 cm', constraints: 'Paper, straws, and tape' },
  ],
  'grade-2': [
    { title: 'Marble Run', focus: 'building-testing', scenario: 'Create a track that makes a marble travel as slowly as possible from the top of a ramp to the bottom.', criteria: 'Marble takes at least 5 seconds', constraints: 'Cardboard tubes, tape, and a 30 cm ramp' },
    { title: 'Sound Maker', focus: 'comparing-solutions', scenario: 'Design an instrument that can make at least 2 different sounds.', criteria: 'Produce 2 distinct sounds', constraints: 'Rubber bands, boxes, tubes, and tape' },
  ],
  'grade-3': [
    { title: 'Egg Drop', focus: 'testing-improving', scenario: 'Design a container that protects a raw egg from a 2-meter drop.', criteria: 'Egg does not break', constraints: 'Limited materials, max 200g total weight' },
    { title: 'Water Filter', focus: 'engineering-design-process', scenario: 'Build a filter that cleans dirty water (soil mixed in water) until it runs clear.', criteria: 'Water comes out visibly cleaner', constraints: 'Plastic bottle, sand, gravel, cotton, coffee filter' },
  ],
  'grade-4': [
    { title: 'Solar Oven', focus: 'prototyping', scenario: 'Build an oven that uses only sunlight to melt a piece of chocolate.', criteria: 'Chocolate melts within 20 minutes', constraints: 'Cardboard box, aluminum foil, plastic wrap, tape' },
    { title: 'Catapult', focus: 'testing-improving', scenario: 'Build a catapult that launches a marshmallow to hit a target 1 meter away.', criteria: 'Hit within 15 cm of target', constraints: 'Craft sticks, rubber bands, plastic spoon, tape' },
  ],
  'grade-5': [
    { title: 'Insulation Challenge', focus: 'defining-criteria-constraints', scenario: 'Design a container that keeps an ice cube from melting for at least 30 minutes.', criteria: 'Ice remains solid for 30 minutes', constraints: 'Budget of $5 worth of priced materials' },
    { title: 'Wind Turbine', focus: 'engineering-design-process', scenario: 'Build a wind turbine that can lift a paper clip using wind from a fan.', criteria: 'Lift the paper clip off the table', constraints: 'Cardboard, straws, tape, string, paper clips' },
  ],
  'grade-6': [
    { title: 'Earthquake-Proof Building', focus: 'failure-analysis', scenario: 'Build a structure that survives a simulated earthquake (shaking a table for 10 seconds).', criteria: 'Structure remains standing after 10 seconds of shaking', constraints: 'Popsicle sticks, marshmallows, tape; max height 40 cm' },
    { title: 'Prosthetic Hand', focus: 'systems-thinking', scenario: 'Design a prosthetic hand from simple materials that can pick up 3 different objects.', criteria: 'Pick up a ball, a cup, and a pencil', constraints: 'Cardboard, string, straws, tape, rubber bands' },
  ],
  'grade-7': [
    { title: 'Bridge Load Test', focus: 'trade-offs-optimization', scenario: 'Design a bridge that spans 30 cm and holds the maximum weight.', criteria: 'Span 30 cm gap and hold maximum load', constraints: 'Popsicle sticks and wood glue only' },
    { title: 'Rube Goldberg Machine', focus: 'systems-thinking', scenario: 'Build a machine that completes a simple task (ring a bell) using at least 5 energy transfers.', criteria: 'Complete the task with 5+ distinct steps', constraints: 'Household materials only; must fit on a table' },
  ],
  'grade-8': [
    { title: 'Water Purification System', focus: 'iterative-design', scenario: 'Design a system that removes both salt and sediment from water.', criteria: 'Output water tastes less salty and is visibly clear', constraints: 'Budget constraint; must document test purity at each iteration' },
    { title: 'Rocket Launch', focus: 'modeling-simulation', scenario: 'Design an air-powered rocket for maximum altitude. Build a model to predict height, then test.', criteria: 'Fly the highest; model prediction within 20% of actual', constraints: 'Paper, tape, standardized launcher; safety goggles required' },
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

  if (bank.questions) {
    return exResult('engineering-question', skill, grade, 'Answer the following engineering question.',
      pick(bank.questions, count).map(q => ({
        prompt: q.prompt,
        answer: q.answer,
        acceptedAnswers: q.acceptedAnswers || [q.answer],
      })));
  }

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) {
    return expected.some(r => norm(r) === norm(answer));
  }
  return norm(expected) === norm(answer);
}

// Public API

class Engineering {
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

  getDesignScenario(grade) {
    const scenarios = DESIGN_SCENARIOS[grade];
    if (!scenarios) return { error: `No design scenarios for ${grade}. Available: ${Object.keys(DESIGN_SCENARIOS).join(', ')}` };
    return pick(scenarios, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const scenario = DESIGN_SCENARIOS[grade] ? pick(DESIGN_SCENARIOS[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, designScenario: scenario,
      lessonPlan: {
        review: 'Review previously learned engineering concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: scenario ? `Design challenge: "${scenario.title}"` : 'Apply the skill to a real-world problem',
        reflect: 'What did you learn? What would you do differently?',
      },
    };
  }
}

module.exports = Engineering;

// CLI: node engineering.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const eng = new Engineering();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) eng.setGrade(id, grade);
        out({ action: 'start', profile: eng.getProfile(id), nextSkills: eng.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(eng.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, type] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'kindergarten';
        if (type) { out(eng.generateExercise(grade, type, 5)); }
        else { const n = eng.getNextSkills(id, 1).next; out(n.length ? eng.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current grade!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(eng.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(eng.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(eng.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(eng.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(eng.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? eng.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(eng.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(eng.setGrade(id, g)); break; }
      default: out({ usage: 'node engineering.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
