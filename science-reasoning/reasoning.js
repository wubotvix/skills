// eClaw Science Reasoning Interactive Tutor (K-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'science-reasoning');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'K-2': {
    'observations': ['making-observations', 'asking-questions', 'sorting-evidence'],
    'simple-reasoning': ['because-statements', 'pattern-recognition', 'predictions'],
    'models': ['drawing-models', 'using-pictures', 'simple-diagrams'],
  },
  '3-5': {
    'cer-writing': ['claims', 'evidence', 'reasoning', 'full-cer'],
    'crosscutting-concepts': ['patterns', 'cause-and-effect', 'systems', 'scale', 'structure-function'],
    'evidence-evaluation': ['strong-vs-weak-evidence', 'multiple-sources', 'correlation-vs-causation'],
    'scientific-models': ['interpreting-models', 'building-models', 'revising-models'],
    'argumentation': ['supporting-claims', 'respectful-disagreement', 'evaluating-arguments'],
  },
  '6-8': {
    'advanced-cer': ['cer-with-rebuttal', 'extended-cer', 'peer-review-cer'],
    'crosscutting-advanced': ['energy-and-matter', 'stability-and-change', 'systems-thinking'],
    'model-revision': ['testing-models', 'revising-with-data', 'competing-models'],
    'scientific-argumentation': ['evaluating-competing-claims', 'scientific-media-claims', 'designing-arguments'],
    'evidence-advanced': ['data-interpretation', 'experimental-evidence', 'statistical-reasoning'],
  },
};

const CONTENT_BANKS = {
  'K-2': {
    'making-observations': {
      items: [
        { prompt: 'You see a plant on the windowsill leaning toward the light. What do you observe?', answer: 'the plant is leaning toward the light', type: 'open', acceptedKeywords: ['lean', 'light', 'window', 'bend', 'toward'] },
        { prompt: 'You put ice in a cup on a warm day. What do you observe happening?', answer: 'the ice is melting', type: 'open', acceptedKeywords: ['melt', 'water', 'smaller', 'liquid'] },
        { prompt: 'You drop a ball and a feather at the same time. What do you observe?', answer: 'the ball falls faster than the feather', type: 'open', acceptedKeywords: ['ball', 'fast', 'feather', 'slow', 'first'] },
        { prompt: 'You mix red paint and yellow paint together. What do you observe?', answer: 'orange', type: 'open', acceptedKeywords: ['orange', 'new color', 'changed'] },
        { prompt: 'A puddle is on the sidewalk in the morning. By afternoon it is gone. What happened?', answer: 'the water evaporated', type: 'open', acceptedKeywords: ['evaporat', 'dried', 'sun', 'gone', 'air'] },
        { prompt: 'You hear thunder after you see lightning. What do you notice about the order?', answer: 'lightning comes before thunder', type: 'open', acceptedKeywords: ['lightning', 'first', 'before', 'thunder', 'after'] },
        { prompt: 'You blow on your hands when they are cold. What do you observe?', answer: 'your hands feel warmer', type: 'open', acceptedKeywords: ['warm', 'hot', 'heat', 'better'] },
        { prompt: 'An ice cream cone is dripping on a hot day. What is happening?', answer: 'the ice cream is melting from the heat', type: 'open', acceptedKeywords: ['melt', 'hot', 'drip', 'warm', 'liquid'] },
      ],
    },
    'asking-questions': {
      items: [
        { prompt: 'You notice birds fly south in fall. Which is a good science question? A) Why do birds fly south? B) Birds are pretty.', answer: 'a', type: 'multiple-choice' },
        { prompt: 'A seed grows into a plant. Which is a science question? A) Plants are green. B) What does a seed need to grow?', answer: 'b', type: 'multiple-choice' },
        { prompt: 'Your shadow is long in the morning and short at noon. Which is a good question? A) Why does my shadow change size? B) Shadows are cool.', answer: 'a', type: 'multiple-choice' },
        { prompt: 'It rains some days and not others. Which is a science question? A) I like sunny days. B) What makes it rain?', answer: 'b', type: 'multiple-choice' },
        { prompt: 'A magnet sticks to the fridge but not to wood. Which is a good question? A) Why do magnets stick to some things? B) Magnets are fun.', answer: 'a', type: 'multiple-choice' },
        { prompt: 'Leaves change color in autumn. Which is a science question? A) Fall is my favorite season. B) Why do leaves change color?', answer: 'b', type: 'multiple-choice' },
      ],
    },
    'sorting-evidence': {
      items: [
        { prompt: 'Which is evidence? A) I think it will rain. B) The sky is full of dark clouds.', answer: 'b', type: 'multiple-choice' },
        { prompt: 'Which is evidence? A) The thermometer reads 90°F. B) I feel like it is hot.', answer: 'a', type: 'multiple-choice' },
        { prompt: 'Which is evidence? A) Dogs are the best pets. B) The dog wagged its tail when it saw its owner.', answer: 'b', type: 'multiple-choice' },
        { prompt: 'Which is evidence? A) The plant grew 2 inches in one week. B) Plants probably like music.', answer: 'a', type: 'multiple-choice' },
        { prompt: 'Which is an observation, not an opinion? A) The rock is heavy. B) The rock weighs 5 pounds.', answer: 'b', type: 'multiple-choice' },
        { prompt: 'Which is evidence? A) I measured 3 cups of water. B) I think there was enough water.', answer: 'a', type: 'multiple-choice' },
      ],
    },
    'because-statements': {
      items: [
        { prompt: 'Finish: "The ice melted because ___." What is a good reason?', answer: 'it was warm', type: 'open', acceptedKeywords: ['warm', 'hot', 'heat', 'temperature', 'sun'] },
        { prompt: 'Finish: "The plant grew tall because ___."', answer: 'it got sunlight and water', type: 'open', acceptedKeywords: ['sun', 'light', 'water', 'soil', 'nutrients'] },
        { prompt: 'Finish: "The ball rolled downhill because ___."', answer: 'gravity pulled it down', type: 'open', acceptedKeywords: ['gravity', 'hill', 'slope', 'down', 'pull'] },
        { prompt: 'Finish: "The puppy was panting because ___."', answer: 'it was hot or tired', type: 'open', acceptedKeywords: ['hot', 'tired', 'warm', 'ran', 'exercise', 'thirsty'] },
        { prompt: 'Finish: "We wear coats in winter because ___."', answer: 'it is cold outside', type: 'open', acceptedKeywords: ['cold', 'warm', 'freeze', 'temperature', 'cool'] },
        { prompt: 'Finish: "The cookie crumbled because ___."', answer: 'it was dry or brittle', type: 'open', acceptedKeywords: ['dry', 'hard', 'brittle', 'broke', 'crispy', 'old'] },
      ],
    },
    'pattern-recognition': {
      items: [
        { prompt: 'Monday: sunny, Tuesday: rainy, Wednesday: sunny, Thursday: rainy. What comes next?', answer: 'sunny', type: 'exact' },
        { prompt: 'A caterpillar eats, makes a cocoon, becomes a butterfly. What is this pattern called?', answer: 'life cycle', type: 'open', acceptedKeywords: ['life cycle', 'metamorphosis', 'change', 'grow'] },
        { prompt: 'Spring, Summer, Fall, Winter, Spring... What pattern is this?', answer: 'seasons', type: 'open', acceptedKeywords: ['season', 'repeat', 'cycle', 'year'] },
        { prompt: 'Day, Night, Day, Night... What causes this pattern?', answer: 'earth spinning', type: 'open', acceptedKeywords: ['earth', 'spin', 'rotat', 'sun', 'turn'] },
        { prompt: 'Every time you push harder, the ball goes farther. What is the pattern?', answer: 'more force means more distance', type: 'open', acceptedKeywords: ['push', 'hard', 'far', 'force', 'more'] },
        { prompt: '2 legs, 4 legs, 6 legs, 8 legs — these could be a human, dog, insect, spider. What is the pattern?', answer: 'number of legs increases by 2', type: 'open', acceptedKeywords: ['legs', 'increase', 'more', '2', 'two'] },
      ],
    },
    'predictions': {
      items: [
        { prompt: 'If you put a metal spoon and a wooden spoon in hot water, which will feel hot first?', answer: 'metal', type: 'exact' },
        { prompt: 'If you water one plant but not the other, what will happen to the plant with no water?', answer: 'it will wilt or die', type: 'open', acceptedKeywords: ['wilt', 'die', 'dry', 'brown', 'droop'] },
        { prompt: 'If you add more weight to a toy car going down a ramp, will it go faster or slower?', answer: 'faster', type: 'exact' },
        { prompt: 'If you put food coloring in warm water and cold water, where will it spread faster?', answer: 'warm water', type: 'open', acceptedKeywords: ['warm', 'hot'] },
        { prompt: 'What will happen if you leave a banana on the counter for two weeks?', answer: 'it will turn brown and rot', type: 'open', acceptedKeywords: ['brown', 'rot', 'mushy', 'spoil', 'decay', 'old'] },
        { prompt: 'If you mix baking soda and vinegar, what do you predict will happen?', answer: 'it will fizz or bubble', type: 'open', acceptedKeywords: ['fizz', 'bubble', 'foam', 'react', 'gas', 'explod'] },
      ],
    },
    'drawing-models': {
      items: [
        { prompt: 'Draw a model of the water cycle. What are the 3 main parts you should include?', answer: 'evaporation, condensation, precipitation', type: 'open', acceptedKeywords: ['evaporat', 'condens', 'precipit', 'rain', 'cloud', 'sun'] },
        { prompt: 'If you draw a model of a food chain, what comes first?', answer: 'a plant or the sun', type: 'open', acceptedKeywords: ['plant', 'sun', 'grass', 'producer', 'flower'] },
        { prompt: 'Draw a model of day and night. What two things do you need to show?', answer: 'the earth and the sun', type: 'open', acceptedKeywords: ['earth', 'sun', 'spin', 'rotat', 'light', 'dark'] },
        { prompt: 'In a model of an animal habitat, what 4 things should you include?', answer: 'food, water, shelter, space', type: 'open', acceptedKeywords: ['food', 'water', 'shelter', 'space', 'home'] },
        { prompt: 'Draw a model showing how a seed grows. What stages should you include?', answer: 'seed, sprout, seedling, plant', type: 'open', acceptedKeywords: ['seed', 'sprout', 'root', 'grow', 'plant', 'leaf'] },
      ],
    },
    'using-pictures': {
      items: [
        { prompt: 'A picture shows a tree with rings. What can we learn from counting the rings?', answer: 'the age of the tree', type: 'open', acceptedKeywords: ['age', 'old', 'year', 'how long'] },
        { prompt: 'A diagram shows arrows from the sun to a plant to a rabbit to a fox. What does this show?', answer: 'a food chain', type: 'open', acceptedKeywords: ['food chain', 'energy', 'eat', 'food web'] },
        { prompt: 'A picture shows the moon in different shapes over a month. What does this show?', answer: 'moon phases', type: 'open', acceptedKeywords: ['phase', 'moon', 'change', 'shape', 'cycle'] },
        { prompt: 'A diagram shows water going up from a lake, forming clouds, then raining. What is this?', answer: 'the water cycle', type: 'open', acceptedKeywords: ['water cycle', 'evaporat', 'rain', 'cycle'] },
        { prompt: 'A picture shows a caterpillar, cocoon, and butterfly in order. What does this show?', answer: 'metamorphosis or life cycle', type: 'open', acceptedKeywords: ['life cycle', 'metamorphosis', 'change', 'grow', 'stages'] },
      ],
    },
    'simple-diagrams': {
      items: [
        { prompt: 'In a diagram of the sun, earth, and moon, which is the biggest?', answer: 'the sun', type: 'open', acceptedKeywords: ['sun'] },
        { prompt: 'A Venn diagram compares cats and dogs. Where do you put "has fur"?', answer: 'in the middle where they overlap', type: 'open', acceptedKeywords: ['middle', 'overlap', 'both', 'shared'] },
        { prompt: 'A bar graph shows Plant A grew 5 inches and Plant B grew 3 inches. Which grew more?', answer: 'plant a', type: 'open', acceptedKeywords: ['a', 'plant a', 'first'] },
        { prompt: 'A picture shows layers of rock. Which layer was formed first — top or bottom?', answer: 'bottom', type: 'exact' },
        { prompt: 'A diagram shows the parts of a flower. What part makes seeds?', answer: 'the pistil or ovary', type: 'open', acceptedKeywords: ['pistil', 'ovary', 'ovule', 'center', 'middle'] },
      ],
    },
  },
  '3-5': {
    'claims': {
      items: [
        { prompt: 'Which is a scientific claim? A) I like butterflies. B) Butterflies go through metamorphosis. C) Butterflies are pretty.', answer: 'b', type: 'multiple-choice' },
        { prompt: 'Which is the best claim? A) Plants need light. B) Plants grow taller with more sunlight because light provides energy for photosynthesis. C) Plants are cool.', answer: 'b', type: 'multiple-choice' },
        { prompt: 'A student says "Magnets attract all metals." Is this a good claim to test?', answer: 'yes', type: 'open', acceptedKeywords: ['yes', 'test', 'experiment', 'try', 'check'] },
        { prompt: 'Turn this opinion into a claim: "Sugar is bad." Make it testable.', answer: 'eating too much sugar causes tooth decay', type: 'open', acceptedKeywords: ['sugar', 'caus', 'affect', 'increas', 'health', 'tooth', 'weight'] },
        { prompt: 'Which is a claim that can be tested? A) Earth is the best planet. B) Earth rotates once every 24 hours. C) Space is scary.', answer: 'b', type: 'multiple-choice' },
        { prompt: 'Write a claim about what happens when you heat water.', answer: 'water evaporates when heated', type: 'open', acceptedKeywords: ['heat', 'boil', 'evaporat', 'steam', 'gas', 'temperature'] },
      ],
    },
    'evidence': {
      items: [
        { prompt: 'Claim: "Plants need sunlight to grow." Which is the best evidence? A) I think plants like sun. B) Plants in sunlight grew 5cm; plants in dark grew 0cm. C) My mom told me.', answer: 'b', type: 'multiple-choice' },
        { prompt: 'Which is stronger evidence? A) One student said it worked. B) Three trials all showed the same result.', answer: 'b', type: 'multiple-choice' },
        { prompt: 'Claim: "Metal conducts heat faster than wood." What evidence would you need?', answer: 'measure temperature change over time for both materials', type: 'open', acceptedKeywords: ['measur', 'temperature', 'time', 'both', 'compar', 'thermometer'] },
        { prompt: 'A student claims heavier objects fall faster. They drop a book and a pencil. Is this good evidence? Why or why not?', answer: 'not great because shape and air resistance differ', type: 'open', acceptedKeywords: ['air', 'shape', 'size', 'fair', 'control', 'resistance', 'variable'] },
        { prompt: 'Which counts as evidence? A) Data from an experiment. B) A guess about what might happen. C) What you hope will happen.', answer: 'a', type: 'multiple-choice' },
        { prompt: 'You claim exercise raises heart rate. What data would you collect?', answer: 'heart rate before and after exercise', type: 'open', acceptedKeywords: ['heart rate', 'pulse', 'before', 'after', 'beats', 'measur'] },
      ],
    },
    'reasoning': {
      items: [
        { prompt: 'Claim: "Plants need light." Evidence: "Plants in sunlight grew 5cm; plants in dark grew 0cm." Write the reasoning that connects them.', answer: 'the data shows plants with light grew but plants without light did not which proves light is needed for growth', type: 'open', acceptedKeywords: ['light', 'grew', 'need', 'energy', 'photosynthesis', 'data shows', 'because', 'proves'] },
        { prompt: 'Why is reasoning important in CER? A) It makes your paragraph longer. B) It explains WHY your evidence supports your claim. C) It sounds smart.', answer: 'b', type: 'multiple-choice' },
        { prompt: 'Evidence: "Ice melted in 5 minutes at room temperature." Claim: "Heat causes ice to melt." What reasoning connects these?', answer: 'room temperature is warmer than freezing so the heat energy transferred to the ice causing it to change state', type: 'open', acceptedKeywords: ['heat', 'energy', 'warm', 'temperature', 'transfer', 'state', 'melt'] },
        { prompt: 'What is the difference between evidence and reasoning?', answer: 'evidence is the data and reasoning explains why the data supports the claim', type: 'open', acceptedKeywords: ['data', 'why', 'explain', 'connect', 'support', 'link'] },
        { prompt: 'A student writes: "My claim is right because I said so." Is this good reasoning?', answer: 'no', type: 'open', acceptedKeywords: ['no', 'not', 'need evidence', 'explain', 'science', 'why'] },
      ],
    },
    'full-cer': {
      items: [
        { prompt: 'Write a CER: Do heavier objects fall faster? (Hint: In a vacuum, they fall at the same rate.)', answer: 'claim evidence reasoning about gravity', type: 'open', acceptedKeywords: ['claim', 'evidence', 'gravity', 'same', 'rate', 'air', 'vacuum'] },
        { prompt: 'Write a CER: Does salt dissolve faster in hot water or cold water?', answer: 'claim evidence reasoning about dissolving and temperature', type: 'open', acceptedKeywords: ['claim', 'evidence', 'hot', 'fast', 'dissolv', 'temperature', 'energy', 'molecule'] },
        { prompt: 'Identify the parts: "Animals in the Arctic have thick fur (claim). Polar bears have 2-inch thick fur and survive at -40°F (evidence). Thick fur traps air which insulates against cold (reasoning)."', answer: 'claim then evidence then reasoning', type: 'open', acceptedKeywords: ['claim', 'evidence', 'reasoning', 'correct', 'right', 'labeled'] },
        { prompt: 'What is missing? "Claim: Exercise is good for you. Evidence: People who exercise have lower rates of heart disease." What part is missing?', answer: 'reasoning', type: 'exact' },
        { prompt: 'Write a CER about whether plants need water to survive.', answer: 'claim evidence reasoning about plant water needs', type: 'open', acceptedKeywords: ['claim', 'evidence', 'water', 'plant', 'grow', 'wilt', 'need'] },
      ],
    },
    'patterns': {
      items: [
        { prompt: 'Temperatures for 5 days: 70, 72, 75, 78, 80. What pattern do you see?', answer: 'temperature is increasing each day', type: 'open', acceptedKeywords: ['increas', 'rising', 'going up', 'higher', 'warmer', 'more'] },
        { prompt: 'What crosscutting concept is this: "The tides follow a regular schedule, rising and falling twice a day."', answer: 'patterns', type: 'exact' },
        { prompt: 'Animals that live in cold places tend to have thick fur. Animals in hot places have thin fur. What pattern is this?', answer: 'adaptation to climate', type: 'open', acceptedKeywords: ['adapt', 'climate', 'environment', 'pattern', 'fur', 'temperature'] },
        { prompt: 'Sunrise times get earlier in spring and later in fall. What kind of pattern is this?', answer: 'seasonal or cyclical pattern', type: 'open', acceptedKeywords: ['season', 'cycl', 'repeat', 'pattern', 'year'] },
        { prompt: 'The more sugar you add to water, the sweeter it tastes. What pattern exists between the variables?', answer: 'as one increases the other increases', type: 'open', acceptedKeywords: ['increas', 'more', 'direct', 'proportion', 'relationship'] },
      ],
    },
    'cause-and-effect': {
      items: [
        { prompt: 'Cause: It rained heavily for 3 days. What is a possible effect?', answer: 'flooding', type: 'open', acceptedKeywords: ['flood', 'water', 'overflow', 'rise', 'wet', 'mud'] },
        { prompt: 'Effect: The candle went out. What could be the cause?', answer: 'wind blew it out or it ran out of wax', type: 'open', acceptedKeywords: ['wind', 'blow', 'wax', 'oxygen', 'air', 'ran out'] },
        { prompt: 'A forest fire destroys all the trees. What effect will this have on animals?', answer: 'animals lose their habitat', type: 'open', acceptedKeywords: ['habitat', 'home', 'food', 'leave', 'move', 'die', 'lost'] },
        { prompt: 'Cause: A volcano erupts. Name two effects.', answer: 'lava flow and ash cloud', type: 'open', acceptedKeywords: ['lava', 'ash', 'destroy', 'smoke', 'rock', 'hot', 'air quality', 'climate'] },
        { prompt: 'Is this cause-and-effect or correlation? "Students who eat breakfast score higher on tests."', answer: 'correlation', type: 'open', acceptedKeywords: ['correlat', 'not cause', 'might', 'other factors', 'not necessarily'] },
      ],
    },
    'systems': {
      items: [
        { prompt: 'Name the parts of the digestive system (a body system).', answer: 'mouth stomach intestines', type: 'open', acceptedKeywords: ['mouth', 'stomach', 'intestin', 'esophag', 'organ'] },
        { prompt: 'In an ecosystem, what happens if you remove all the predators?', answer: 'prey population increases and can overgraze', type: 'open', acceptedKeywords: ['prey', 'increas', 'grow', 'overgraze', 'too many', 'unbalance'] },
        { prompt: 'A bicycle is a system. Name 3 parts that work together.', answer: 'wheels pedals chain', type: 'open', acceptedKeywords: ['wheel', 'pedal', 'chain', 'gear', 'brake', 'frame', 'handlebar'] },
        { prompt: 'What happens to a system when one part breaks?', answer: 'the whole system may not work properly', type: 'open', acceptedKeywords: ['not work', 'break', 'stop', 'fail', 'affect', 'whole'] },
        { prompt: 'The water cycle is a system. What are its main parts?', answer: 'evaporation condensation precipitation', type: 'open', acceptedKeywords: ['evaporat', 'condens', 'precipit', 'collect', 'runoff'] },
      ],
    },
    'scale': {
      items: [
        { prompt: 'Why do scientists use microscopes?', answer: 'to see things too small for our eyes', type: 'open', acceptedKeywords: ['small', 'tiny', 'see', 'magnif', 'cell', 'detail'] },
        { prompt: 'A model of the solar system in a classroom cannot show true scale. Why not?', answer: 'the real distances and sizes are too enormous', type: 'open', acceptedKeywords: ['big', 'huge', 'large', 'far', 'distance', 'size', 'enormous', 'fit'] },
        { prompt: 'Bacteria are too small to see. Whales are the biggest animals. What crosscutting concept relates to both?', answer: 'scale proportion and quantity', type: 'open', acceptedKeywords: ['scale', 'size', 'proportion', 'quantity'] },
        { prompt: 'Why is a map smaller than the real land it shows?', answer: 'to fit a large area into something we can use', type: 'open', acceptedKeywords: ['fit', 'small', 'represent', 'scale', 'large', 'size'] },
        { prompt: 'Time scale: An earthquake lasts seconds. Mountain building takes millions of years. Why is time scale important in science?', answer: 'different processes happen at very different rates', type: 'open', acceptedKeywords: ['different', 'rate', 'fast', 'slow', 'time', 'long', 'short'] },
      ],
    },
    'structure-function': {
      items: [
        { prompt: 'A bird has a sharp curved beak. What does the beak structure tell you about its function?', answer: 'it is used for tearing meat so the bird is a predator', type: 'open', acceptedKeywords: ['tear', 'meat', 'prey', 'hunt', 'sharp', 'eat', 'predator', 'rip'] },
        { prompt: 'Why are bones hollow in birds?', answer: 'to be lightweight for flying', type: 'open', acceptedKeywords: ['light', 'fly', 'weight', 'flight', 'less heavy'] },
        { prompt: 'A cactus has thick stems and no leaves. How does this structure help it survive?', answer: 'stores water and reduces water loss', type: 'open', acceptedKeywords: ['water', 'store', 'desert', 'dry', 'conserv', 'save', 'less loss'] },
        { prompt: 'Roots grow downward. How does this structure relate to function?', answer: 'to absorb water and nutrients from the soil and anchor the plant', type: 'open', acceptedKeywords: ['water', 'nutrient', 'soil', 'anchor', 'absorb', 'hold'] },
        { prompt: 'A duck has webbed feet. What is the function of this structure?', answer: 'to swim and paddle in water', type: 'open', acceptedKeywords: ['swim', 'water', 'paddle', 'push', 'move'] },
      ],
    },
    'strong-vs-weak-evidence': {
      items: [
        { prompt: 'Which is stronger evidence? A) "My friend said vinegar cleans well." B) "In our experiment, vinegar removed 90% of stains in 3 trials."', answer: 'b', type: 'multiple-choice' },
        { prompt: 'A student does an experiment once and gets a result. Is this strong or weak evidence?', answer: 'weak', type: 'open', acceptedKeywords: ['weak', 'one', 'not enough', 'repeat', 'more trials', 'once'] },
        { prompt: 'Which makes evidence stronger? A) More trials. B) Bigger font on the poster. C) A colorful graph.', answer: 'a', type: 'multiple-choice' },
        { prompt: 'A website says "9 out of 10 doctors agree" but does not name the doctors or study. Is this strong evidence?', answer: 'no', type: 'open', acceptedKeywords: ['no', 'weak', 'not', 'source', 'who', 'unknown', 'vague'] },
        { prompt: 'How can you make an experiment give stronger evidence?', answer: 'repeat it multiple times and control variables', type: 'open', acceptedKeywords: ['repeat', 'trial', 'control', 'variable', 'multiple', 'fair'] },
      ],
    },
    'multiple-sources': {
      items: [
        { prompt: 'Why should scientists check more than one source?', answer: 'to verify information and avoid errors', type: 'open', acceptedKeywords: ['verif', 'check', 'confirm', 'error', 'reliable', 'sure', 'accurate'] },
        { prompt: 'Two studies on plant growth give different results. What should you do?', answer: 'look at their methods to find differences and look for more studies', type: 'open', acceptedKeywords: ['method', 'more', 'different', 'compare', 'why', 'investigate', 'look'] },
        { prompt: 'Source A says chocolate is healthy. Source B says it is not. What should a scientist do?', answer: 'look at the evidence in both and find more studies', type: 'open', acceptedKeywords: ['evidence', 'both', 'more', 'compar', 'study', 'data', 'research'] },
        { prompt: 'Which is more trustworthy? A) A blog post by someone you don\'t know. B) A peer-reviewed journal article.', answer: 'b', type: 'multiple-choice' },
        { prompt: 'If 10 studies say exercise helps memory and 1 says it does not, what can you conclude?', answer: 'the evidence mostly supports that exercise helps memory', type: 'open', acceptedKeywords: ['most', 'evidence', 'support', 'help', 'majority', 'likely', 'probably'] },
      ],
    },
    'correlation-vs-causation': {
      items: [
        { prompt: 'Ice cream sales and drowning rates both increase in summer. Does ice cream cause drowning?', answer: 'no', type: 'open', acceptedKeywords: ['no', 'correlat', 'summer', 'heat', 'hot', 'not cause', 'third', 'both'] },
        { prompt: 'What is the difference between correlation and causation?', answer: 'correlation means two things happen together and causation means one actually causes the other', type: 'open', acceptedKeywords: ['together', 'cause', 'happen', 'relat', 'not mean', 'one makes'] },
        { prompt: 'Students who read more get higher grades. Does reading cause higher grades?', answer: 'not necessarily it could be a correlation', type: 'open', acceptedKeywords: ['not necessarily', 'correlat', 'maybe', 'other', 'might', 'could'] },
        { prompt: 'How can you test if A causes B?', answer: 'do a controlled experiment where you change only A and measure B', type: 'open', acceptedKeywords: ['experiment', 'control', 'variable', 'change', 'test', 'measure'] },
        { prompt: 'Towns with more fire trucks have more fires. Do fire trucks cause fires?', answer: 'no bigger towns need more fire trucks and have more fires', type: 'open', acceptedKeywords: ['no', 'bigger', 'more people', 'correlat', 'not cause', 'size', 'population'] },
      ],
    },
    'interpreting-models': {
      items: [
        { prompt: 'A food web shows arrows pointing from prey to predator. What do the arrows represent?', answer: 'the flow of energy', type: 'open', acceptedKeywords: ['energy', 'flow', 'eat', 'transfer', 'food'] },
        { prompt: 'A model shows the earth tilted on its axis. What does this help explain?', answer: 'seasons', type: 'open', acceptedKeywords: ['season', 'summer', 'winter', 'tilt', 'light'] },
        { prompt: 'A diagram of the rock cycle has arrows between igneous, sedimentary, and metamorphic. What do the arrows show?', answer: 'how one rock type can change into another', type: 'open', acceptedKeywords: ['change', 'transform', 'become', 'process', 'turn into'] },
        { prompt: 'A model shows layers of the earth. What are the main layers from outside to inside?', answer: 'crust mantle core', type: 'open', acceptedKeywords: ['crust', 'mantle', 'core'] },
        { prompt: 'A particle model shows molecules far apart and moving fast. What state of matter is this?', answer: 'gas', type: 'exact' },
      ],
    },
    'building-models': {
      items: [
        { prompt: 'You want to build a model of the solar system. What key features must you include?', answer: 'sun and planets in order with relative sizes', type: 'open', acceptedKeywords: ['sun', 'planet', 'order', 'size', 'orbit', 'distance'] },
        { prompt: 'How would you model erosion in a classroom?', answer: 'pour water over sand or soil on a slope', type: 'open', acceptedKeywords: ['water', 'sand', 'soil', 'pour', 'slope', 'tilt', 'stream'] },
        { prompt: 'What is one limitation of any model?', answer: 'it cannot show everything about the real thing', type: 'open', acceptedKeywords: ['not everything', 'simplif', 'limit', 'real', 'perfect', 'exact', 'missing'] },
        { prompt: 'Why do scientists build models?', answer: 'to explain and test ideas about things they cannot directly observe', type: 'open', acceptedKeywords: ['explain', 'test', 'understand', 'predict', 'observe', 'show', 'represent'] },
        { prompt: 'You build a model volcano with baking soda and vinegar. What does this model well? What does it NOT model well?', answer: 'models the eruption shape but not the heat or real lava', type: 'open', acceptedKeywords: ['erupt', 'shape', 'not heat', 'not lava', 'not real', 'limit', 'similar', 'different'] },
      ],
    },
    'revising-models': {
      items: [
        { prompt: 'You build a model showing the sun going around the earth. New data shows earth goes around the sun. What should you do?', answer: 'revise the model to show earth orbiting the sun', type: 'open', acceptedKeywords: ['revis', 'change', 'fix', 'update', 'earth', 'around', 'sun'] },
        { prompt: 'Why do scientists revise models?', answer: 'when new evidence does not match the model', type: 'open', acceptedKeywords: ['new', 'evidence', 'data', 'not match', 'wrong', 'better', 'improv'] },
        { prompt: 'A student\'s model predicts a plant will grow 10cm but it only grew 3cm. What should the student do?', answer: 'revise the model and investigate why it was different', type: 'open', acceptedKeywords: ['revis', 'change', 'investigate', 'why', 'different', 'wrong', 'check'] },
        { prompt: 'Is it a failure when a model needs to be revised?', answer: 'no revising models is a normal part of science', type: 'open', acceptedKeywords: ['no', 'normal', 'science', 'learn', 'improve', 'better', 'good'] },
        { prompt: 'Scientists used to model the atom as a solid ball. Now they model it as mostly empty space with a nucleus. Why did the model change?', answer: 'new experiments showed the atom is mostly empty space', type: 'open', acceptedKeywords: ['new', 'experiment', 'evidence', 'data', 'discover', 'empty', 'found'] },
      ],
    },
    'supporting-claims': {
      items: [
        { prompt: 'Your classmate says "Recycling is pointless." How would you respond using evidence?', answer: 'provide data about how much recycling reduces landfill waste', type: 'open', acceptedKeywords: ['evidence', 'data', 'landfill', 'waste', 'reduce', 'resource', 'save', 'example'] },
        { prompt: 'What makes a scientific argument strong? List 2 things.', answer: 'clear claim supported by evidence and logical reasoning', type: 'open', acceptedKeywords: ['evidence', 'reasoning', 'claim', 'data', 'logic', 'support'] },
        { prompt: 'Claim: "Dogs are smarter than cats." How would you find evidence to support or refute this?', answer: 'look at research studies comparing animal intelligence', type: 'open', acceptedKeywords: ['research', 'study', 'test', 'experiment', 'compar', 'measur', 'data'] },
        { prompt: '"Because I said so" — is this a good way to support a claim in science?', answer: 'no you need evidence and reasoning', type: 'open', acceptedKeywords: ['no', 'evidence', 'data', 'reason', 'proof', 'not enough'] },
        { prompt: 'You claim your school should start later. What evidence would you gather?', answer: 'research on sleep and student performance', type: 'open', acceptedKeywords: ['sleep', 'research', 'stud', 'perform', 'grade', 'health', 'data'] },
      ],
    },
    'respectful-disagreement': {
      items: [
        { prompt: 'Your partner says magnets attract all metals. You know that is not true. What is a respectful way to disagree?', answer: 'I see why you think that but actually some metals like aluminum are not attracted to magnets', type: 'open', acceptedKeywords: ['respect', 'actually', 'but', 'evidence', 'test', 'not all', 'aluminum', 'let me show'] },
        { prompt: 'Which is more respectful? A) "You\'re wrong!" B) "I have different evidence. Can I share it?"', answer: 'b', type: 'multiple-choice' },
        { prompt: 'Why is respectful disagreement important in science?', answer: 'it helps us find the truth by examining different ideas', type: 'open', acceptedKeywords: ['truth', 'idea', 'learn', 'better', 'understand', 'different', 'improve', 'evidence'] },
        { prompt: 'A classmate presents data that contradicts yours. What should you do first?', answer: 'look at their data carefully before responding', type: 'open', acceptedKeywords: ['look', 'listen', 'check', 'data', 'understand', 'review', 'compar', 'consider'] },
        { prompt: 'Finish: "I disagree because ___" with a scientific reason.', answer: 'provide evidence-based reasoning', type: 'open', acceptedKeywords: ['evidence', 'data', 'experiment', 'research', 'show', 'found'] },
      ],
    },
    'evaluating-arguments': {
      items: [
        { prompt: 'Student A says "Plants need light" with data from an experiment. Student B says "Plants need light" because the teacher said so. Whose argument is stronger?', answer: 'student a', type: 'open', acceptedKeywords: ['a', 'student a', 'first', 'experiment', 'data'] },
        { prompt: 'An argument says "We should save water because California had a drought." Is this a strong argument? Why?', answer: 'it uses a real example as evidence but could be stronger with more data', type: 'open', acceptedKeywords: ['example', 'evidence', 'real', 'could', 'more', 'data', 'strong', 'some'] },
        { prompt: 'What makes a scientific argument weak? List 2 things.', answer: 'no evidence and no reasoning', type: 'open', acceptedKeywords: ['no evidence', 'opinion', 'no reason', 'guess', 'no data', 'bias', 'one source'] },
        { prompt: 'An ad says "Scientists agree this product works!" but shows no data. Is this a good scientific argument?', answer: 'no it provides no data or specific evidence', type: 'open', acceptedKeywords: ['no', 'weak', 'no data', 'no evidence', 'vague', 'not specific', 'who'] },
        { prompt: 'How do you evaluate if an argument is strong?', answer: 'check if it has a clear claim supported by evidence and connected by reasoning', type: 'open', acceptedKeywords: ['claim', 'evidence', 'reasoning', 'data', 'support', 'connect', 'logic'] },
      ],
    },
  },
  '6-8': {
    'cer-with-rebuttal': {
      items: [
        { prompt: 'What is a rebuttal in CER?', answer: 'a response to a counterargument that defends your claim', type: 'open', acceptedKeywords: ['counter', 'against', 'defend', 'respond', 'oppos', 'address', 'argue'] },
        { prompt: 'Claim: "Climate change is caused by human activities." What is a possible counterargument, and how would you rebut it?', answer: 'counter that climate changes naturally and rebut with evidence that current rate exceeds natural variation', type: 'open', acceptedKeywords: ['natural', 'rate', 'fast', 'evidence', 'data', 'human', 'CO2', 'greenhouse'] },
        { prompt: 'Write a rebuttal: Someone says "Vaccines are unnecessary because diseases disappeared on their own."', answer: 'diseases declined because of vaccines and they return when vaccination rates drop', type: 'open', acceptedKeywords: ['vaccin', 'return', 'data', 'evidence', 'declin', 'measles', 'outbreak', 'rate'] },
        { prompt: 'Why does including a rebuttal make your CER stronger?', answer: 'it shows you have considered opposing views and can still defend your claim', type: 'open', acceptedKeywords: ['oppos', 'consider', 'stronger', 'defend', 'address', 'thorough', 'complete'] },
        { prompt: 'Claim: "Renewable energy should replace fossil fuels." Add a counterargument and rebuttal.', answer: 'counter that renewables are unreliable and rebut with evidence of improving technology and storage', type: 'open', acceptedKeywords: ['counter', 'rebut', 'technology', 'storage', 'cost', 'reliable', 'improv', 'battery'] },
      ],
    },
    'extended-cer': {
      items: [
        { prompt: 'Write an extended CER about whether antibiotics should be used for viral infections.', answer: 'claim no evidence that antibiotics target bacteria not viruses reasoning about mechanisms rebuttal about misuse', type: 'open', acceptedKeywords: ['claim', 'evidence', 'bacteria', 'virus', 'resistance', 'reason', 'rebut'] },
        { prompt: 'How does extended CER differ from basic CER?', answer: 'it includes counterargument and rebuttal plus deeper reasoning', type: 'open', acceptedKeywords: ['counter', 'rebuttal', 'deeper', 'more', 'extend', 'thorough'] },
        { prompt: 'In extended CER, how many pieces of evidence should you ideally include?', answer: 'at least two or three from different sources', type: 'open', acceptedKeywords: ['two', 'three', 'multiple', 'more than one', '2', '3', 'several', 'different'] },
        { prompt: 'Write the reasoning section of a CER about why exercise improves mental health.', answer: 'exercise releases endorphins which improve mood and reduce stress hormones as shown by the evidence', type: 'open', acceptedKeywords: ['endorphin', 'mood', 'stress', 'brain', 'chemical', 'evidence', 'shows', 'because'] },
        { prompt: 'A peer\'s CER is missing reasoning. What feedback would you give?', answer: 'you need to explain WHY your evidence supports your claim by connecting them with scientific principles', type: 'open', acceptedKeywords: ['why', 'connect', 'explain', 'principle', 'link', 'support', 'how'] },
      ],
    },
    'peer-review-cer': {
      items: [
        { prompt: 'What should you look for when peer reviewing a CER? Name 3 things.', answer: 'clear claim, relevant evidence, logical reasoning connecting them', type: 'open', acceptedKeywords: ['claim', 'evidence', 'reasoning', 'logic', 'connect', 'clear', 'support'] },
        { prompt: 'A classmate\'s CER says "Recycling is good because everyone says so." What feedback would you give?', answer: 'they need specific evidence and data instead of an appeal to popularity', type: 'open', acceptedKeywords: ['evidence', 'data', 'specific', 'not everyone', 'popularity', 'need', 'improve'] },
        { prompt: 'Why is peer review important in science?', answer: 'it catches errors and improves the quality of scientific work', type: 'open', acceptedKeywords: ['error', 'improve', 'quality', 'catch', 'better', 'check', 'valid', 'mistake'] },
        { prompt: 'How should you give feedback on a weak CER?', answer: 'be specific about what is missing and suggest improvements respectfully', type: 'open', acceptedKeywords: ['specific', 'respect', 'suggest', 'improve', 'help', 'missing', 'constructive'] },
        { prompt: 'After peer review, your partner found a flaw in your reasoning. What should you do?', answer: 'revise your reasoning to address the flaw', type: 'open', acceptedKeywords: ['revis', 'fix', 'change', 'improve', 'address', 'update', 'correct'] },
      ],
    },
    'energy-and-matter': {
      items: [
        { prompt: 'In a food chain, what happens to energy as it moves from producer to top predator?', answer: 'energy decreases at each level about 10 percent is passed on', type: 'open', acceptedKeywords: ['decreas', 'less', 'lost', '10', 'percent', 'heat', 'transfer', 'reduce'] },
        { prompt: 'What is the law of conservation of matter?', answer: 'matter cannot be created or destroyed only changed in form', type: 'open', acceptedKeywords: ['not created', 'not destroyed', 'conserv', 'change', 'form', 'same amount'] },
        { prompt: 'When a log burns, where does the matter go?', answer: 'it becomes ash gases like CO2 and water vapor', type: 'open', acceptedKeywords: ['ash', 'gas', 'CO2', 'carbon', 'water', 'vapor', 'smoke', 'air'] },
        { prompt: 'How does energy flow differently from matter cycling in an ecosystem?', answer: 'energy flows one way while matter cycles and is reused', type: 'open', acceptedKeywords: ['one way', 'flow', 'cycle', 'reuse', 'recycle', 'different', 'direction'] },
        { prompt: 'Photosynthesis converts light energy into what?', answer: 'chemical energy stored in glucose', type: 'open', acceptedKeywords: ['chemical', 'glucose', 'sugar', 'food', 'stored', 'energy'] },
      ],
    },
    'stability-and-change': {
      items: [
        { prompt: 'An ecosystem is stable. A new predator is introduced. What might happen?', answer: 'the ecosystem will be disrupted and may eventually reach a new balance', type: 'open', acceptedKeywords: ['disrupt', 'change', 'balance', 'new', 'prey', 'decreas', 'affect', 'equilibrium'] },
        { prompt: 'What does stability mean in a system?', answer: 'the system stays in a relatively constant state', type: 'open', acceptedKeywords: ['constant', 'same', 'steady', 'balance', 'equilibrium', 'not chang', 'maintain'] },
        { prompt: 'Give an example of slow change on earth.', answer: 'erosion or continental drift', type: 'open', acceptedKeywords: ['erosion', 'continental', 'drift', 'weather', 'mountain', 'slow', 'gradual', 'plate'] },
        { prompt: 'Give an example of rapid change on earth.', answer: 'earthquake volcano or hurricane', type: 'open', acceptedKeywords: ['earthquake', 'volcano', 'hurricane', 'tsunami', 'flood', 'erupt', 'fast'] },
        { prompt: 'Why is the concept of stability and change important for understanding climate?', answer: 'climate can be stable for long periods but human actions are causing rapid change', type: 'open', acceptedKeywords: ['stable', 'rapid', 'human', 'chang', 'time', 'long', 'fast', 'slow', 'CO2'] },
      ],
    },
    'systems-thinking': {
      items: [
        { prompt: 'What is a feedback loop? Give an example.', answer: 'when the output of a system affects its input like body temperature regulation', type: 'open', acceptedKeywords: ['output', 'input', 'loop', 'cycle', 'affect', 'temperature', 'feedback', 'regulate'] },
        { prompt: 'In the carbon cycle, name 3 places carbon can be stored.', answer: 'atmosphere oceans and living organisms or fossil fuels', type: 'open', acceptedKeywords: ['atmosphere', 'ocean', 'living', 'fossil', 'soil', 'rock', 'plant', 'organism'] },
        { prompt: 'How can a small change in one part of a system cause a large effect?', answer: 'through cascading effects or feedback loops that amplify the change', type: 'open', acceptedKeywords: ['cascad', 'feedback', 'amplif', 'chain', 'ripple', 'connect', 'depend'] },
        { prompt: 'Describe the human body as a system of systems.', answer: 'multiple organ systems work together like circulatory respiratory and nervous systems', type: 'open', acceptedKeywords: ['organ', 'system', 'together', 'circulat', 'respirat', 'nervous', 'digest', 'work'] },
        { prompt: 'What makes a system "open" vs "closed"?', answer: 'an open system exchanges matter and energy with surroundings a closed system does not', type: 'open', acceptedKeywords: ['exchange', 'matter', 'energy', 'surround', 'open', 'closed', 'in', 'out'] },
      ],
    },
    'testing-models': {
      items: [
        { prompt: 'How do you test if a model is accurate?', answer: 'compare its predictions to actual data from observations or experiments', type: 'open', acceptedKeywords: ['predict', 'data', 'compar', 'observ', 'experiment', 'test', 'actual', 'real'] },
        { prompt: 'A model predicts it will rain tomorrow. It does not rain. What does this tell you?', answer: 'the model may need revision or the prediction had uncertainty', type: 'open', acceptedKeywords: ['revis', 'wrong', 'improv', 'uncertain', 'not perfect', 'adjust', 'update'] },
        { prompt: 'Why do weather models become less accurate for predictions further in the future?', answer: 'small uncertainties compound over time making long range predictions less reliable', type: 'open', acceptedKeywords: ['uncertain', 'compound', 'time', 'far', 'complex', 'variable', 'chaos', 'less reliable'] },
        { prompt: 'A model of population growth predicts exponential increase. What factor might it be missing?', answer: 'limited resources or carrying capacity', type: 'open', acceptedKeywords: ['resource', 'carrying capacity', 'food', 'space', 'limit', 'competition', 'predator'] },
        { prompt: 'What is the value of a model that turns out to be wrong?', answer: 'it helps us understand what we got wrong and guides improvements', type: 'open', acceptedKeywords: ['learn', 'improv', 'understand', 'wrong', 'guide', 'better', 'knowledge'] },
      ],
    },
    'revising-with-data': {
      items: [
        { prompt: 'New fossil evidence shows a dinosaur had feathers. How should the model of that species be revised?', answer: 'update the model to include feathers and reconsider its classification', type: 'open', acceptedKeywords: ['feather', 'update', 'revis', 'change', 'add', 'classif', 'bird'] },
        { prompt: 'A model of plate tectonics originally did not explain why plates move. What data helped revise it?', answer: 'data about convection currents in the mantle', type: 'open', acceptedKeywords: ['convection', 'mantle', 'heat', 'current', 'flow', 'magma'] },
        { prompt: 'When should a model be abandoned vs revised?', answer: 'revise when the core idea is sound but details need updating and abandon when fundamental assumptions are wrong', type: 'open', acceptedKeywords: ['fundamental', 'core', 'detail', 'abandon', 'revis', 'wrong', 'sound', 'basic'] },
        { prompt: 'Climate models from 30 years ago underestimated warming. How have they been revised?', answer: 'updated with better data on greenhouse gases feedback loops and ice sheet dynamics', type: 'open', acceptedKeywords: ['data', 'greenhouse', 'feedback', 'ice', 'better', 'updated', 'improv'] },
        { prompt: 'A cell model shows a simple blob. A microscope reveals complex organelles. How should the model change?', answer: 'add organelles like nucleus mitochondria and other structures', type: 'open', acceptedKeywords: ['organelle', 'nucleus', 'mitochond', 'detail', 'complex', 'add', 'structure'] },
      ],
    },
    'competing-models': {
      items: [
        { prompt: 'Two models explain extinction of dinosaurs: asteroid impact vs volcanic activity. How do scientists decide?', answer: 'by comparing which model is better supported by the available evidence', type: 'open', acceptedKeywords: ['evidence', 'data', 'compar', 'support', 'test', 'predict', 'both'] },
        { prompt: 'Why is it healthy for science to have competing models?', answer: 'competition drives investigation and better understanding', type: 'open', acceptedKeywords: ['investigat', 'better', 'test', 'improve', 'understand', 'question', 'progress'] },
        { prompt: 'Wave vs particle models of light: why do scientists use both?', answer: 'because light behaves as both depending on the situation', type: 'open', acceptedKeywords: ['both', 'wave', 'particle', 'situation', 'depend', 'different', 'behav'] },
        { prompt: 'How do you decide between two competing models?', answer: 'choose the one that explains more data and makes better predictions', type: 'open', acceptedKeywords: ['data', 'predict', 'explain', 'more', 'better', 'evidence', 'test'] },
        { prompt: 'Can two competing models both be partially correct?', answer: 'yes different models can explain different aspects of the same phenomenon', type: 'open', acceptedKeywords: ['yes', 'different', 'aspect', 'part', 'both', 'partial', 'complement'] },
      ],
    },
    'evaluating-competing-claims': {
      items: [
        { prompt: 'Company A says their product "boosts immunity." Company B says it has "no proven health benefits." How do you evaluate?', answer: 'look for peer reviewed studies and check what evidence each side provides', type: 'open', acceptedKeywords: ['peer review', 'study', 'evidence', 'data', 'research', 'proof', 'source'] },
        { prompt: 'Two scientists disagree about the cause of a disease. What should you evaluate about each claim?', answer: 'the quality and quantity of evidence supporting each claim', type: 'open', acceptedKeywords: ['evidence', 'quality', 'quantity', 'data', 'study', 'support', 'research'] },
        { prompt: 'A claim has one study supporting it. Another claim has 20 studies. Which is likely stronger?', answer: 'the claim with 20 studies because more evidence is more reliable', type: 'open', acceptedKeywords: ['20', 'more', 'reliable', 'studies', 'evidence', 'stronger', 'replicated'] },
        { prompt: 'What role does bias play when evaluating competing claims?', answer: 'bias can influence how evidence is collected and interpreted so check for conflicts of interest', type: 'open', acceptedKeywords: ['bias', 'influence', 'conflict', 'interest', 'interpret', 'fund', 'fair'] },
        { prompt: 'How do scientific communities resolve competing claims?', answer: 'through continued research peer review and building scientific consensus', type: 'open', acceptedKeywords: ['research', 'peer review', 'consensus', 'evidence', 'debate', 'replicate', 'community'] },
      ],
    },
    'scientific-media-claims': {
      items: [
        { prompt: 'A headline says "Scientists discover miracle cure!" What questions should you ask?', answer: 'what was the study how large was it and has it been peer reviewed', type: 'open', acceptedKeywords: ['study', 'peer review', 'how many', 'evidence', 'source', 'size', 'replicated'] },
        { prompt: 'An article says "Studies show chocolate prevents cancer." Only one small study was done. Is the headline accurate?', answer: 'no it overstates the evidence from a single small study', type: 'open', acceptedKeywords: ['no', 'overstate', 'one', 'small', 'not enough', 'exaggerat', 'mislead'] },
        { prompt: 'How can you check if a scientific claim in the media is reliable?', answer: 'find the original study check if it was peer reviewed and look for replication', type: 'open', acceptedKeywords: ['original', 'study', 'peer review', 'replic', 'source', 'check', 'journal'] },
        { prompt: 'What is the difference between a preliminary finding and a scientific consensus?', answer: 'a preliminary finding is from one or few studies while consensus is agreement from many studies', type: 'open', acceptedKeywords: ['one', 'few', 'many', 'agreement', 'preliminary', 'consensus', 'multiple', 'replicated'] },
        { prompt: 'A social media post says "WiFi causes cancer" with no sources. How would you evaluate this?', answer: 'look for peer reviewed research on the topic and note the lack of sources', type: 'open', acceptedKeywords: ['peer review', 'research', 'no source', 'evidence', 'study', 'check', 'not reliable'] },
      ],
    },
    'designing-arguments': {
      items: [
        { prompt: 'Design an argument for why schools should teach climate science. Include claim, evidence, and reasoning.', answer: 'claim evidence from research on climate literacy and reasoning about informed citizenship', type: 'open', acceptedKeywords: ['claim', 'evidence', 'reasoning', 'climate', 'research', 'citizen', 'inform', 'science'] },
        { prompt: 'What makes a scientific argument different from a regular argument?', answer: 'it must be based on evidence and logical reasoning not opinions or emotions', type: 'open', acceptedKeywords: ['evidence', 'logic', 'reason', 'not opinion', 'data', 'not emotion', 'scientific'] },
        { prompt: 'Design an argument about whether genetic engineering of food is safe. What evidence would you need?', answer: 'peer reviewed studies on health effects environmental impact and long term data', type: 'open', acceptedKeywords: ['study', 'health', 'environment', 'data', 'long term', 'peer review', 'evidence'] },
        { prompt: 'How should you structure a scientific argument for maximum persuasiveness?', answer: 'start with a clear claim provide multiple pieces of evidence explain reasoning and address counterarguments', type: 'open', acceptedKeywords: ['claim', 'evidence', 'reasoning', 'counter', 'structure', 'clear', 'multiple'] },
        { prompt: 'Anticipate and address a counterargument to: "Space exploration is worth the cost."', answer: 'counter that money should go to earth problems and rebut with examples of technology benefits from space research', type: 'open', acceptedKeywords: ['counter', 'rebut', 'technology', 'benefit', 'earth', 'cost', 'return', 'investment'] },
      ],
    },
    'data-interpretation': {
      items: [
        { prompt: 'A graph shows temperature rising and CO2 rising together. What can you conclude?', answer: 'they are correlated but you need more analysis to determine causation', type: 'open', acceptedKeywords: ['correlat', 'together', 'relat', 'caus', 'more', 'analysis', 'not necessarily'] },
        { prompt: 'A data table shows 5 plants in sun grew an average of 12cm and 5 in shade grew 4cm. Is this enough data to draw a conclusion?', answer: 'it suggests a trend but more trials would strengthen the conclusion', type: 'open', acceptedKeywords: ['suggest', 'trend', 'more', 'trials', 'sample', 'small', 'strengthen', 'repeat'] },
        { prompt: 'What is an outlier and what should you do with it?', answer: 'a data point far from others investigate why but do not automatically remove it', type: 'open', acceptedKeywords: ['far', 'different', 'investigate', 'not remove', 'check', 'why', 'keep', 'examine'] },
        { prompt: 'A bar graph shows average test scores by study hours. What type of relationship might this show?', answer: 'a positive correlation between study hours and test scores', type: 'open', acceptedKeywords: ['positive', 'correlat', 'more', 'higher', 'relationship', 'increas'] },
        { prompt: 'Why is it important to look at sample size when interpreting data?', answer: 'larger samples are more representative and reliable than small ones', type: 'open', acceptedKeywords: ['large', 'represent', 'reliable', 'small', 'more', 'accurate', 'trust'] },
      ],
    },
    'experimental-evidence': {
      items: [
        { prompt: 'What is a controlled experiment?', answer: 'an experiment where all variables are kept the same except the one being tested', type: 'open', acceptedKeywords: ['variable', 'same', 'one', 'change', 'control', 'test', 'constant'] },
        { prompt: 'Why is a control group important?', answer: 'it provides a baseline to compare results against', type: 'open', acceptedKeywords: ['baseline', 'compar', 'without', 'normal', 'reference', 'against'] },
        { prompt: 'An experiment tests fertilizer on plants but uses different amounts of water for each. What is wrong?', answer: 'water is not controlled so you cannot tell if results are from fertilizer or water', type: 'open', acceptedKeywords: ['water', 'control', 'variable', 'not fair', 'confound', 'cannot tell', 'both'] },
        { prompt: 'Why should experiments be repeatable?', answer: 'to confirm results are reliable and not due to chance', type: 'open', acceptedKeywords: ['confirm', 'reliable', 'chance', 'consistent', 'trust', 'valid', 'same results'] },
        { prompt: 'What is the difference between independent and dependent variables?', answer: 'independent is what you change and dependent is what you measure', type: 'open', acceptedKeywords: ['change', 'measure', 'manipulat', 'respond', 'cause', 'effect'] },
      ],
    },
    'statistical-reasoning': {
      items: [
        { prompt: 'What does it mean when scientists say results are "statistically significant"?', answer: 'the results are unlikely to be due to chance alone', type: 'open', acceptedKeywords: ['chance', 'unlikely', 'not random', 'real', 'confident', 'not luck', 'meaningful'] },
        { prompt: 'Mean, median, mode — which is most affected by outliers?', answer: 'mean', type: 'exact' },
        { prompt: 'A study of 10 people shows a drug works. A study of 10,000 shows it does not. Which is more reliable?', answer: 'the study of 10000 because larger samples are more reliable', type: 'open', acceptedKeywords: ['10000', 'larger', 'more', 'reliable', 'sample', 'bigger'] },
        { prompt: 'What is sampling bias and why does it matter?', answer: 'when the sample does not represent the population leading to unreliable conclusions', type: 'open', acceptedKeywords: ['represent', 'population', 'not fair', 'unreliable', 'skew', 'select', 'mislead'] },
        { prompt: 'A graph shows a correlation of 0.95 between two variables. What does this mean?', answer: 'there is a very strong positive relationship between the variables', type: 'open', acceptedKeywords: ['strong', 'positive', 'relationship', 'close', 'correlat', 'connected', 'related'] },
      ],
    },
  },
};

const PHENOMENA = {
  'K-2': [
    { title: 'The Disappearing Puddle', description: 'After it rains, there is a big puddle on the playground. By the time recess is over, the puddle is smaller. The next day, it is gone! Where did the water go?', reasoning: 'Use observations and "because" statements to explain evaporation.' },
    { title: 'The Leaning Plant', description: 'A plant on the windowsill is leaning toward the window. If you turn the pot around, in a few days it leans toward the window again! Why does the plant keep leaning toward the light?', reasoning: 'Observe patterns and make a claim about what plants need.' },
    { title: 'Warm and Cold Hands', description: 'When you rub your hands together really fast, they get warm! But when you blow on them, they feel cool. Why does rubbing make heat but blowing makes cold?', reasoning: 'Make observations and explain using cause-and-effect.' },
    { title: 'The Melting Race', description: 'Put an ice cube on a metal plate, a wooden plate, and a plastic plate. Which ice cube melts first? Why do they melt at different speeds?', reasoning: 'Make predictions, observe, and explain with "because" statements.' },
    { title: 'Shadow Changes', description: 'In the morning, your shadow is very long. At noon, it is very short. In the evening, it is long again. Why does your shadow change throughout the day?', reasoning: 'Look for patterns and connect them to the sun\'s position.' },
  ],
  '3-5': [
    { title: 'The Mystery of the Bouncing Egg', description: 'If you soak a raw egg in vinegar for 2 days, the shell dissolves and the egg becomes rubbery and bounces! What happened to the shell? Why does the egg bounce?', reasoning: 'Use CER: Claim about chemical reactions, Evidence from observations, Reasoning about acids and calcium.' },
    { title: 'Hot Car vs. Cool Forest', description: 'On a sunny day, the inside of a car can reach 150°F while the forest nearby stays at 80°F. Both get the same sunlight. Why is the car so much hotter?', reasoning: 'Use cause-and-effect and the crosscutting concept of energy to explain the greenhouse effect.' },
    { title: 'The Growing Mold Experiment', description: 'You put bread in three bags: one in the fridge, one on the counter, and one in a warm dark closet. After a week, the closet bread is moldiest. Why?', reasoning: 'Design a CER about optimal conditions for mold growth. Consider variables.' },
    { title: 'Fossil Shells on Mountaintops', description: 'Scientists find seashell fossils on top of mountains far from any ocean. How did ocean shells end up on a mountain?', reasoning: 'Use models and evidence to reason about geological change over time.' },
    { title: 'The Peppered Moth Mystery', description: 'Before factories, most peppered moths were light-colored. After factories made trees dark with soot, most moths became dark-colored. Why did the moth population change?', reasoning: 'Use CER to argue about natural selection and adaptation.' },
  ],
  '6-8': [
    { title: 'The Coral Bleaching Crisis', description: 'Coral reefs are turning white and dying around the world. Scientists have data showing ocean temperatures rising and coral bleaching increasing at the same time. Is warming water causing the bleaching?', reasoning: 'Design an extended CER with rebuttal. Evaluate correlation vs causation. Use systems thinking.' },
    { title: 'The Antibiotic Resistance Problem', description: 'Doctors say to always finish your full course of antibiotics, even if you feel better. Bacteria are becoming resistant to antibiotics. How are these connected?', reasoning: 'Use CER with rebuttal to explain natural selection in bacteria. Evaluate evidence from medical studies.' },
    { title: 'The Mars Water Debate', description: 'Scientists found evidence of ancient river channels on Mars and seasonal dark streaks. Some claim Mars once had oceans. Others disagree. Evaluate the competing models.', reasoning: 'Evaluate competing models using available evidence. Design arguments for and against.' },
    { title: 'Social Media and Sleep', description: 'Studies show teens who use social media more sleep less. A headline says "Social Media Destroys Teen Sleep!" Is this headline supported by the evidence?', reasoning: 'Evaluate media claims. Distinguish correlation from causation. Analyze data interpretation.' },
    { title: 'The Yellowstone Wolf Reintroduction', description: 'When wolves were reintroduced to Yellowstone in 1995, the rivers changed course. How could predators affect rivers?', reasoning: 'Use systems thinking and trophic cascades. Design an argument using ecological evidence.' },
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
    if (item.type === 'multiple-choice') {
      return { prompt: item.prompt, answer: item.answer, type: 'multiple-choice' };
    }
    if (item.type === 'exact') {
      return { prompt: item.prompt, answer: item.answer, type: 'exact' };
    }
    return { prompt: item.prompt, answer: item.answer, type: 'open', acceptedKeywords: item.acceptedKeywords || [] };
  });

  return exResult(items[0]?.type || 'open', skill, grade, `Answer each question about ${skill.replace(/-/g, ' ')}.`, items);
}

// Answer checking

function checkAnswer(type, expected, answer, acceptedKeywords) {
  if (type === 'multiple-choice' || type === 'exact') {
    return norm(expected) === norm(answer);
  }
  if (type === 'open' && Array.isArray(acceptedKeywords) && acceptedKeywords.length > 0) {
    const a = norm(answer);
    const matched = acceptedKeywords.filter(k => a.includes(norm(k)));
    return matched.length >= Math.min(2, acceptedKeywords.length);
  }
  return norm(expected) === norm(answer);
}

// Public API

class ScienceReasoning {
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
    const grade = p.grade || 'K-2';
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
    const grade = p.grade || 'K-2';
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

  getPhenomenon(grade) {
    const phenom = PHENOMENA[grade];
    if (!phenom) return { error: `No phenomena for ${grade}. Available: ${Object.keys(PHENOMENA).join(', ')}` };
    return pick(phenom, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'K-2';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next level.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const phenomenon = PHENOMENA[grade] ? pick(PHENOMENA[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, phenomenon,
      lessonPlan: {
        review: 'Review previously learned reasoning skills (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: phenomenon ? `Explore phenomenon: "${phenomenon.title}"` : 'Apply reasoning to a real-world scenario',
        reflect: 'Reflect on what evidence and reasoning were used',
      },
    };
  }
}

module.exports = ScienceReasoning;

// CLI: node reasoning.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new ScienceReasoning();
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
        const grade = loadProfile(id).grade || 'K-2';
        if (type) { out(api.generateExercise(grade, type, 5)); }
        else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current level!' }); }
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
      case 'phenomenon': { const [, g] = args; if (!g) throw new Error('Usage: phenomenon <grade>'); out(api.getPhenomenon(g)); break; }
      default: out({ usage: 'node reasoning.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','phenomenon'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
