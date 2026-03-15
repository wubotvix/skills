// eClaw Life Science Interactive Tutor (K-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'science-life');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'K-2': {
    'living-things': ['living-vs-nonliving', 'plant-needs', 'animal-needs'],
    'plant-structures': ['roots-stems-leaves', 'flowers-seeds'],
    'animal-structures': ['body-coverings', 'external-parts'],
    'habitats': ['habitat-basics', 'land-vs-water'],
    'parent-offspring': ['resemblance', 'animal-babies'],
    'seed-dispersal': ['wind-water-animal', 'pollination'],
  },
  '3-5': {
    'life-cycles': ['complete-metamorphosis', 'amphibian-metamorphosis', 'incomplete-metamorphosis', 'plant-life-cycle'],
    'food-chains': ['producers-consumers-decomposers', 'food-webs', 'energy-flow'],
    'adaptations': ['structural-adaptations', 'behavioral-adaptations'],
    'inheritance': ['inherited-traits', 'learned-behaviors', 'environmental-effects'],
    'photosynthesis': ['plants-make-food', 'matter-cycling'],
    'cells-intro': ['basic-cell-structure', 'plant-vs-animal-cells'],
  },
  '6-8': {
    'cell-structure': ['organelles', 'cell-membrane', 'plant-vs-animal-detail'],
    'body-systems': ['digestive', 'respiratory', 'circulatory', 'nervous'],
    'reproduction': ['sexual-vs-asexual', 'genetic-diversity'],
    'genetics': ['genes-alleles', 'dominant-recessive', 'punnett-squares'],
    'natural-selection': ['variation', 'differential-survival', 'adaptation-over-time'],
    'evolution-evidence': ['fossils', 'comparative-anatomy', 'dna-evidence'],
    'ecosystem-dynamics': ['carrying-capacity', 'symbiosis', 'human-impact'],
  },
};

const CONTENT_BANKS = {
  'K-2': {
    'living-vs-nonliving': {
      items: [
        ['dog', 'living'], ['rock', 'nonliving'], ['tree', 'living'], ['water', 'nonliving'],
        ['bird', 'living'], ['chair', 'nonliving'], ['flower', 'living'], ['car', 'nonliving'],
        ['fish', 'living'], ['cloud', 'nonliving'], ['grass', 'living'], ['shoe', 'nonliving'],
        ['cat', 'living'], ['ball', 'nonliving'], ['worm', 'living'], ['pencil', 'nonliving'],
        ['mushroom', 'living'], ['toy', 'nonliving'], ['spider', 'living'], ['book', 'nonliving'],
      ],
    },
    'plant-needs': {
      items: [
        ['water', true], ['sunlight', true], ['air', true], ['soil', true],
        ['candy', false], ['music', false], ['paint', false], ['blanket', false],
        ['space to grow', true], ['nutrients', true], ['television', false], ['ice cream', false],
      ],
    },
    'animal-needs': {
      items: [
        ['food', true], ['water', true], ['shelter', true], ['air', true],
        ['toys', false], ['television', false], ['candy', false], ['books', false],
        ['space', true], ['warmth', true], ['a car', false], ['a phone', false],
      ],
    },
    'roots-stems-leaves': {
      items: [
        { part: 'roots', job: 'absorb water and nutrients from soil' },
        { part: 'stem', job: 'carry water and nutrients, hold plant up' },
        { part: 'leaves', job: 'make food using sunlight' },
      ],
    },
    'flowers-seeds': {
      items: [
        { part: 'flower', job: 'make seeds for new plants' },
        { part: 'fruit', job: 'protect seeds and help spread them' },
        { part: 'seed', job: 'grow into a new plant' },
      ],
    },
    'body-coverings': {
      items: [
        ['bear', 'fur'], ['robin', 'feathers'], ['snake', 'scales'], ['turtle', 'shell'],
        ['frog', 'moist skin'], ['fish', 'scales'], ['dog', 'fur'], ['eagle', 'feathers'],
        ['lizard', 'scales'], ['snail', 'shell'], ['cat', 'fur'], ['penguin', 'feathers'],
        ['alligator', 'scales'], ['crab', 'shell'], ['rabbit', 'fur'], ['parrot', 'feathers'],
      ],
    },
    'external-parts': {
      items: [
        { animal: 'bird', part: 'wings', purpose: 'flying' },
        { animal: 'fish', part: 'fins', purpose: 'swimming' },
        { animal: 'rabbit', part: 'long ears', purpose: 'hearing danger' },
        { animal: 'duck', part: 'webbed feet', purpose: 'swimming' },
        { animal: 'eagle', part: 'sharp claws', purpose: 'catching prey' },
        { animal: 'porcupine', part: 'quills', purpose: 'protection' },
      ],
    },
    'habitat-basics': {
      items: [
        ['polar bear', 'arctic'], ['camel', 'desert'], ['monkey', 'rainforest'],
        ['fish', 'ocean'], ['deer', 'forest'], ['cactus', 'desert'],
        ['penguin', 'arctic'], ['frog', 'pond'], ['eagle', 'mountains'],
        ['whale', 'ocean'], ['parrot', 'rainforest'], ['rabbit', 'grassland'],
      ],
    },
    'land-vs-water': {
      items: [
        ['dolphin', 'water'], ['horse', 'land'], ['shark', 'water'], ['elephant', 'land'],
        ['octopus', 'water'], ['lion', 'land'], ['jellyfish', 'water'], ['giraffe', 'land'],
        ['turtle', 'both'], ['frog', 'both'], ['seal', 'both'], ['crab', 'both'],
      ],
    },
    'resemblance': {
      items: [
        { parent: 'dalmatian dog', trait: 'spots', baby: 'puppy with spots' },
        { parent: 'orange cat', trait: 'orange fur', baby: 'orange kitten' },
        { parent: 'brown horse', trait: 'brown coat', baby: 'brown foal' },
        { parent: 'striped tiger', trait: 'stripes', baby: 'striped cub' },
      ],
    },
    'animal-babies': {
      items: [
        ['dog', 'puppy'], ['cat', 'kitten'], ['cow', 'calf'], ['horse', 'foal'],
        ['sheep', 'lamb'], ['pig', 'piglet'], ['duck', 'duckling'], ['hen', 'chick'],
        ['deer', 'fawn'], ['bear', 'cub'], ['goat', 'kid'], ['frog', 'tadpole'],
        ['butterfly', 'caterpillar'], ['kangaroo', 'joey'], ['swan', 'cygnet'], ['eagle', 'eaglet'],
      ],
    },
    'wind-water-animal': {
      items: [
        { seed: 'dandelion', method: 'wind', feature: 'fluffy parachute' },
        { seed: 'maple', method: 'wind', feature: 'helicopter wings' },
        { seed: 'coconut', method: 'water', feature: 'floats' },
        { seed: 'burr', method: 'animal', feature: 'hooks that stick to fur' },
        { seed: 'berry', method: 'animal', feature: 'tasty fruit eaten by birds' },
        { seed: 'acorn', method: 'animal', feature: 'buried by squirrels' },
      ],
    },
    'pollination': {
      items: [
        { pollinator: 'bee', attracted_by: 'bright colors and nectar' },
        { pollinator: 'butterfly', attracted_by: 'bright flowers and sweet smell' },
        { pollinator: 'hummingbird', attracted_by: 'red tubular flowers' },
        { pollinator: 'wind', attracted_by: 'light pollen, no petals needed' },
        { pollinator: 'bat', attracted_by: 'night-blooming flowers' },
      ],
    },
  },
  '3-5': {
    'complete-metamorphosis': {
      items: [
        { organism: 'butterfly', stages: ['egg', 'larva (caterpillar)', 'pupa (chrysalis)', 'adult butterfly'] },
        { organism: 'beetle', stages: ['egg', 'larva (grub)', 'pupa', 'adult beetle'] },
        { organism: 'ladybug', stages: ['egg', 'larva', 'pupa', 'adult ladybug'] },
      ],
    },
    'amphibian-metamorphosis': {
      items: [
        { organism: 'frog', stages: ['egg', 'tadpole', 'tadpole with legs', 'adult frog'] },
      ],
    },
    'incomplete-metamorphosis': {
      items: [
        { organism: 'grasshopper', stages: ['egg', 'nymph', 'adult'] },
        { organism: 'dragonfly', stages: ['egg', 'nymph (in water)', 'adult'] },
        { organism: 'cockroach', stages: ['egg', 'nymph', 'adult'] },
      ],
    },
    'plant-life-cycle': {
      items: [
        { stage: 'seed', description: 'contains the baby plant and food supply' },
        { stage: 'germination', description: 'seed sprouts roots and a shoot' },
        { stage: 'seedling', description: 'young plant with first leaves' },
        { stage: 'mature plant', description: 'full-grown with flowers' },
        { stage: 'pollination', description: 'pollen moves from flower to flower' },
        { stage: 'seed production', description: 'fertilized flower makes new seeds' },
      ],
    },
    'producers-consumers-decomposers': {
      items: [
        ['grass', 'producer'], ['oak tree', 'producer'], ['algae', 'producer'],
        ['rabbit', 'consumer'], ['hawk', 'consumer'], ['deer', 'consumer'],
        ['mushroom', 'decomposer'], ['bacteria', 'decomposer'], ['earthworm', 'decomposer'],
        ['corn', 'producer'], ['wolf', 'consumer'], ['mold', 'decomposer'],
        ['seaweed', 'producer'], ['mouse', 'consumer'], ['beetle', 'decomposer'],
      ],
    },
    'food-webs': {
      chains: [
        ['sun', 'grass', 'rabbit', 'fox'],
        ['sun', 'algae', 'small fish', 'big fish', 'eagle'],
        ['sun', 'oak tree', 'caterpillar', 'robin', 'hawk'],
        ['sun', 'seaweed', 'sea urchin', 'sea otter', 'orca'],
        ['sun', 'grass', 'grasshopper', 'frog', 'snake', 'hawk'],
      ],
    },
    'energy-flow': {
      items: [
        { question: 'Where does energy in a food chain start?', answer: 'the sun' },
        { question: 'What do producers use to make food?', answer: 'sunlight' },
        { question: 'When a rabbit eats grass, does it get ALL the energy the grass had?', answer: 'no, only about 10%' },
        { question: 'Why are there fewer predators than prey?', answer: 'energy is lost at each level' },
        { question: 'Where does most energy in a food chain go?', answer: 'lost as heat' },
      ],
    },
    'structural-adaptations': {
      items: [
        { animal: 'polar bear', adaptation: 'thick white fur', benefit: 'warmth and camouflage in snow' },
        { animal: 'cactus', adaptation: 'thick waxy stem', benefit: 'stores water in desert' },
        { animal: 'giraffe', adaptation: 'long neck', benefit: 'reaches leaves high in trees' },
        { animal: 'duck', adaptation: 'webbed feet', benefit: 'paddles through water' },
        { animal: 'hawk', adaptation: 'sharp curved beak', benefit: 'tears meat from prey' },
        { animal: 'arctic fox', adaptation: 'small ears', benefit: 'reduces heat loss in cold' },
        { animal: 'cactus', adaptation: 'spines instead of leaves', benefit: 'reduces water loss' },
        { animal: 'chameleon', adaptation: 'color-changing skin', benefit: 'camouflage from predators' },
      ],
    },
    'behavioral-adaptations': {
      items: [
        { animal: 'bird', behavior: 'migration', benefit: 'finds warm weather and food' },
        { animal: 'bear', behavior: 'hibernation', benefit: 'survives winter with little food' },
        { animal: 'skunk', behavior: 'spraying', benefit: 'deters predators' },
        { animal: 'dolphin', behavior: 'traveling in pods', benefit: 'safety in numbers' },
        { animal: 'squirrel', behavior: 'storing acorns', benefit: 'food for winter' },
        { animal: 'opossum', behavior: 'playing dead', benefit: 'predators lose interest' },
      ],
    },
    'inherited-traits': {
      items: [
        ['eye color', 'inherited'], ['hair color', 'inherited'], ['freckles', 'inherited'],
        ['tongue rolling', 'inherited'], ['dimples', 'inherited'], ['earlobe shape', 'inherited'],
        ['ability to ride a bike', 'learned'], ['speaking a language', 'learned'],
        ['playing piano', 'learned'], ['natural hair texture', 'inherited'],
        ['knowing math', 'learned'], ['blood type', 'inherited'],
      ],
    },
    'learned-behaviors': {
      items: [
        ['dog sitting on command', 'learned'], ['spider spinning a web', 'instinct'],
        ['bird building a nest', 'instinct'], ['child reading', 'learned'],
        ['salmon swimming upstream', 'instinct'], ['bear fishing', 'learned from parent'],
        ['baby crying', 'instinct'], ['riding a bicycle', 'learned'],
      ],
    },
    'environmental-effects': {
      items: [
        { trait: 'plant height', factor: 'amount of sunlight', effect: 'more sun = taller' },
        { trait: 'skin color', factor: 'sun exposure', effect: 'tanning from UV light' },
        { trait: 'flamingo color', factor: 'diet of shrimp', effect: 'pink from carotenoids' },
        { trait: 'tree shape', factor: 'wind direction', effect: 'grows bent away from wind' },
      ],
    },
    'plants-make-food': {
      items: [
        { question: 'What 3 things do plants need for photosynthesis?', answer: 'sunlight, water, carbon dioxide' },
        { question: 'What do plants PRODUCE during photosynthesis?', answer: 'sugar (glucose) and oxygen' },
        { question: 'Where in the plant does photosynthesis happen?', answer: 'in the leaves (chloroplasts)' },
        { question: 'What green pigment captures sunlight?', answer: 'chlorophyll' },
        { question: 'Do plants get their food from the soil?', answer: 'no, they MAKE food from sunlight and CO2' },
      ],
    },
    'matter-cycling': {
      items: [
        { question: 'When a leaf falls and decomposes, where does the matter go?', answer: 'back into the soil as nutrients' },
        { question: 'Animals breathe out CO2. What uses that CO2?', answer: 'plants use it for photosynthesis' },
        { question: 'When you eat food, what happens to the matter?', answer: 'it becomes part of your body or is released as waste/CO2' },
        { question: 'Is matter created or destroyed in an ecosystem?', answer: 'no, it cycles through living and nonliving things' },
      ],
    },
    'basic-cell-structure': {
      items: [
        { part: 'cell membrane', job: 'controls what enters and leaves the cell' },
        { part: 'nucleus', job: 'contains DNA, controls cell activities' },
        { part: 'cytoplasm', job: 'jelly-like fluid where cell work happens' },
      ],
    },
    'plant-vs-animal-cells': {
      items: [
        ['cell wall', 'plant only'], ['chloroplasts', 'plant only'],
        ['large central vacuole', 'plant only'], ['cell membrane', 'both'],
        ['nucleus', 'both'], ['cytoplasm', 'both'],
        ['mitochondria', 'both'], ['lysosomes', 'mainly animal'],
      ],
    },
  },
  '6-8': {
    'organelles': {
      items: [
        { organelle: 'nucleus', function: 'contains DNA, controls cell activities' },
        { organelle: 'mitochondria', function: 'produces energy (ATP) from food' },
        { organelle: 'ribosome', function: 'makes proteins' },
        { organelle: 'endoplasmic reticulum', function: 'transports materials in the cell' },
        { organelle: 'Golgi apparatus', function: 'packages and ships proteins' },
        { organelle: 'lysosome', function: 'breaks down waste and old parts' },
        { organelle: 'vacuole', function: 'stores water, nutrients, and waste' },
        { organelle: 'chloroplast', function: 'performs photosynthesis (plants only)' },
      ],
    },
    'cell-membrane': {
      items: [
        { question: 'What is the cell membrane made of?', answer: 'a phospholipid bilayer' },
        { question: 'What does selectively permeable mean?', answer: 'only certain substances can pass through' },
        { question: 'What is diffusion?', answer: 'movement of molecules from high to low concentration' },
        { question: 'What is osmosis?', answer: 'diffusion of water across a membrane' },
      ],
    },
    'plant-vs-animal-detail': {
      items: [
        { feature: 'cell wall', plant: 'yes (cellulose)', animal: 'no' },
        { feature: 'chloroplasts', plant: 'yes', animal: 'no' },
        { feature: 'vacuole', plant: 'one large central', animal: 'several small' },
        { feature: 'shape', plant: 'rectangular (rigid)', animal: 'round (flexible)' },
        { feature: 'energy source', plant: 'sunlight via photosynthesis', animal: 'food via cellular respiration' },
      ],
    },
    'digestive': {
      items: [
        { organ: 'mouth', function: 'chewing and saliva begin digestion' },
        { organ: 'esophagus', function: 'moves food to stomach by peristalsis' },
        { organ: 'stomach', function: 'acid and enzymes break down food' },
        { organ: 'small intestine', function: 'absorbs nutrients into blood' },
        { organ: 'large intestine', function: 'absorbs water, forms waste' },
      ],
    },
    'respiratory': {
      items: [
        { organ: 'nose/mouth', function: 'air enters and is filtered and warmed' },
        { organ: 'trachea', function: 'carries air to lungs' },
        { organ: 'bronchi', function: 'tubes that branch into each lung' },
        { organ: 'alveoli', function: 'tiny air sacs where gas exchange occurs' },
        { organ: 'diaphragm', function: 'muscle that controls breathing' },
      ],
    },
    'circulatory': {
      items: [
        { organ: 'heart', function: 'pumps blood throughout the body' },
        { organ: 'arteries', function: 'carry oxygenated blood away from heart' },
        { organ: 'veins', function: 'carry deoxygenated blood back to heart' },
        { organ: 'capillaries', function: 'tiny vessels where exchange occurs' },
        { organ: 'red blood cells', function: 'carry oxygen using hemoglobin' },
      ],
    },
    'nervous': {
      items: [
        { organ: 'brain', function: 'processes information and controls body' },
        { organ: 'spinal cord', function: 'carries signals between brain and body' },
        { organ: 'neurons', function: 'nerve cells that transmit electrical signals' },
        { organ: 'sensory receptors', function: 'detect stimuli (light, sound, touch)' },
      ],
    },
    'sexual-vs-asexual': {
      items: [
        ['two parents, offspring are unique', 'sexual'],
        ['one parent, offspring are identical', 'asexual'],
        ['budding in yeast', 'asexual'], ['humans having babies', 'sexual'],
        ['bacteria splitting in two', 'asexual'], ['flowers being pollinated', 'sexual'],
        ['starfish regrowing from a piece', 'asexual'], ['birds laying fertilized eggs', 'sexual'],
      ],
    },
    'genetic-diversity': {
      items: [
        { question: 'Why is genetic diversity important?', answer: 'helps species survive changing environments' },
        { question: 'Which type of reproduction produces more genetic diversity?', answer: 'sexual reproduction' },
        { question: 'What is a mutation?', answer: 'a random change in DNA' },
        { question: 'Can mutations be helpful?', answer: 'yes, some give survival advantages' },
      ],
    },
    'genes-alleles': {
      items: [
        { question: 'What is a gene?', answer: 'a segment of DNA that codes for a trait' },
        { question: 'What is an allele?', answer: 'a different version of the same gene' },
        { question: 'How many alleles does a person have for each gene?', answer: 'two, one from each parent' },
        { question: 'What does homozygous mean?', answer: 'two identical alleles (BB or bb)' },
        { question: 'What does heterozygous mean?', answer: 'two different alleles (Bb)' },
      ],
    },
    'dominant-recessive': {
      items: [
        { question: 'If B is dominant and b is recessive, what phenotype is Bb?', answer: 'dominant phenotype (B shows)' },
        { question: 'What genotype must you have to show a recessive trait?', answer: 'homozygous recessive (bb)' },
        { question: 'Can two brown-eyed parents have a blue-eyed child?', answer: 'yes, if both are Bb carriers' },
        { question: 'What is a carrier?', answer: 'someone with one recessive allele who does not show the trait' },
      ],
    },
    'punnett-squares': {
      items: [
        { cross: 'Bb x Bb', offspring: '1 BB, 2 Bb, 1 bb', ratio: '3 dominant : 1 recessive' },
        { cross: 'BB x bb', offspring: '4 Bb', ratio: 'all dominant (all heterozygous)' },
        { cross: 'Bb x bb', offspring: '2 Bb, 2 bb', ratio: '1 dominant : 1 recessive' },
        { cross: 'BB x Bb', offspring: '2 BB, 2 Bb', ratio: 'all dominant' },
      ],
    },
    'variation': {
      items: [
        { question: 'Why are individuals in a species different?', answer: 'genetic variation from sexual reproduction and mutations' },
        { question: 'Give an example of variation in a species', answer: 'different beak sizes in finches' },
        { question: 'Is variation helpful for a species?', answer: 'yes, it means some may survive environmental changes' },
      ],
    },
    'differential-survival': {
      items: [
        { scenario: 'Green beetles on green leaves vs brown beetles on green leaves', question: 'Which survives better?', answer: 'green beetles (camouflage from predators)' },
        { scenario: 'Fast rabbits vs slow rabbits with foxes around', question: 'Which survives better?', answer: 'fast rabbits (escape predators)' },
        { scenario: 'Thick-furred mice in a cold winter', question: 'Which survives better?', answer: 'thick-furred mice (better insulation)' },
      ],
    },
    'adaptation-over-time': {
      items: [
        { question: 'Did giraffes stretch their necks to reach leaves?', answer: 'no, giraffes with longer necks survived and passed on their genes' },
        { question: 'How long does natural selection take?', answer: 'many generations, usually thousands of years' },
        { question: 'Does evolution have a goal or direction?', answer: 'no, it depends on the current environment' },
      ],
    },
    'fossils': {
      items: [
        { question: 'What can fossils tell us about evolution?', answer: 'they show how organisms changed over time' },
        { question: 'What is a transitional fossil?', answer: 'a fossil showing features of two different groups (e.g., Tiktaalik)' },
        { question: 'Why are older fossils found in deeper rock layers?', answer: 'deeper layers were deposited first (older)' },
      ],
    },
    'comparative-anatomy': {
      items: [
        { question: 'What are homologous structures?', answer: 'similar body parts in different species from a common ancestor' },
        { question: 'Give an example of homologous structures', answer: 'human arm, whale flipper, bat wing all have same bones' },
        { question: 'What are vestigial structures?', answer: 'body parts that no longer serve a purpose (e.g., human appendix)' },
      ],
    },
    'dna-evidence': {
      items: [
        { question: 'How does DNA evidence support evolution?', answer: 'similar DNA sequences indicate shared ancestry' },
        { question: 'Humans and chimpanzees share about what percent of DNA?', answer: 'about 98-99%' },
        { question: 'What does more similar DNA between two species suggest?', answer: 'a more recent common ancestor' },
      ],
    },
    'carrying-capacity': {
      items: [
        { question: 'What is carrying capacity?', answer: 'the maximum population an environment can support' },
        { question: 'What happens when a population exceeds carrying capacity?', answer: 'competition increases, population decreases' },
        { question: 'Name a limiting factor', answer: 'food, water, space, or shelter availability' },
      ],
    },
    'symbiosis': {
      items: [
        ['clownfish and sea anemone (both benefit)', 'mutualism'],
        ['tick feeding on a dog (one benefits, one harmed)', 'parasitism'],
        ['bird nesting in a tree (one benefits, other unaffected)', 'commensalism'],
        ['bee pollinating a flower (both benefit)', 'mutualism'],
        ['tapeworm in a human intestine (one benefits, one harmed)', 'parasitism'],
        ['barnacle on a whale (one benefits, other unaffected)', 'commensalism'],
      ],
    },
    'human-impact': {
      items: [
        { action: 'deforestation', impact: 'habitat loss and reduced biodiversity' },
        { action: 'pollution', impact: 'harms organisms and ecosystems' },
        { action: 'overfishing', impact: 'disrupts food webs' },
        { action: 'conservation efforts', impact: 'protects endangered species' },
        { action: 'invasive species', impact: 'outcompete native species' },
      ],
    },
  },
};

const PASSAGES = {
  'K-2': [
    { title: 'The Hungry Plant', focus: 'plant needs', text: 'A plant needs water, sunlight, and air to grow. Its roots drink water from the soil. Its leaves catch sunlight. Without these things, the plant will wilt and die.' },
    { title: 'Baby Animals', focus: 'parent-offspring', text: 'A puppy looks like its parents. It has the same fur color and ear shape. But every puppy is a little bit different, just like you look like your parents but are still unique!' },
    { title: 'Where Animals Live', focus: 'habitats', text: 'A fish lives in water. A bird lives in trees. A polar bear lives in the cold arctic. Every animal lives in a habitat that gives it food, water, and shelter.' },
  ],
  '3-5': [
    { title: 'The Food Chain', focus: 'energy flow', text: 'Energy starts with the sun. Plants use sunlight to make food. A rabbit eats the plant. A fox eats the rabbit. At each step, some energy is lost as heat. That is why there are fewer foxes than rabbits.' },
    { title: 'Amazing Adaptations', focus: 'adaptations', text: 'A cactus has thick stems to store water and spines instead of leaves to prevent water loss. A polar bear has thick white fur for warmth and camouflage. These adaptations help organisms survive in their habitats.' },
    { title: 'Butterfly Life Cycle', focus: 'metamorphosis', text: 'A butterfly begins as a tiny egg. It hatches into a caterpillar that eats and grows. Then it forms a chrysalis. Inside, its body transforms completely. Finally, a beautiful butterfly emerges with wings.' },
  ],
  '6-8': [
    { title: 'Natural Selection in Action', focus: 'natural selection', text: 'In England, peppered moths were mostly light-colored, blending with pale tree bark. During the Industrial Revolution, soot darkened the trees. Dark moths survived better because birds could not see them. The population shifted to mostly dark moths. This is natural selection.' },
    { title: 'Inside Your Cells', focus: 'cell structure', text: 'Every cell in your body has a nucleus containing DNA. Mitochondria produce energy. Ribosomes build proteins. The cell membrane controls what enters and exits. Plant cells also have chloroplasts for photosynthesis and a rigid cell wall.' },
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
  if (!bank) return { error: `No content bank for ${grade}/${skill}` };

  if (skill === 'living-vs-nonliving')
    return exResult('classify', skill, grade, 'Is this living or nonliving?',
      pick(bank.items, count).map(([thing, cat]) => ({ prompt: `Is "${thing}" living or nonliving?`, answer: cat })));

  if (skill === 'plant-needs' || skill === 'animal-needs')
    return exResult('true-false', skill, grade, `Do ${skill === 'plant-needs' ? 'plants' : 'animals'} need this to survive? YES or NO.`,
      pick(bank.items, count).map(([item, needed]) => ({ prompt: `Do they need "${item}"?`, answer: needed ? 'yes' : 'no' })));

  if (skill === 'body-coverings')
    return exResult('match', skill, grade, 'What type of body covering does this animal have?',
      pick(bank.items, count).map(([animal, covering]) => ({ prompt: `What covers a ${animal}?`, answer: covering })));

  if (skill === 'habitat-basics')
    return exResult('match', skill, grade, 'What habitat does this organism live in?',
      pick(bank.items, count).map(([org, hab]) => ({ prompt: `Where does a ${org} live?`, answer: hab })));

  if (skill === 'land-vs-water')
    return exResult('classify', skill, grade, 'Does this animal live on land, in water, or both?',
      pick(bank.items, count).map(([animal, where]) => ({ prompt: `Where does a ${animal} live?`, answer: where })));

  if (skill === 'animal-babies')
    return exResult('match', skill, grade, 'What is the baby of this animal called?',
      pick(bank.items, count).map(([parent, baby]) => ({ prompt: `What is a baby ${parent} called?`, answer: baby })));

  if (skill === 'producers-consumers-decomposers')
    return exResult('classify', skill, grade, 'Is this a producer, consumer, or decomposer?',
      pick(bank.items, count).map(([org, role]) => ({ prompt: `What role does "${org}" play?`, answer: role })));

  if (skill === 'inherited-traits')
    return exResult('classify', skill, grade, 'Is this trait inherited or learned?',
      pick(bank.items, count).map(([trait, type]) => ({ prompt: `Is "${trait}" inherited or learned?`, answer: type })));

  if (skill === 'sexual-vs-asexual')
    return exResult('classify', skill, grade, 'Is this sexual or asexual reproduction?',
      pick(bank.items, count).map(([desc, type]) => ({ prompt: desc, answer: type })));

  if (skill === 'plant-vs-animal-cells')
    return exResult('classify', skill, grade, 'Is this found in plant cells only, animal cells only, or both?',
      pick(bank.items, count).map(([part, where]) => ({ prompt: `Where is "${part}" found?`, answer: where })));

  if (skill === 'symbiosis')
    return exResult('classify', skill, grade, 'What type of symbiosis is this: mutualism, parasitism, or commensalism?',
      pick(bank.items, count).map(([desc, type]) => ({ prompt: desc, answer: type })));

  // Generic question-answer format for items with question/answer
  if (bank.items && bank.items[0]?.question)
    return exResult('short-answer', skill, grade, 'Answer the question.',
      pick(bank.items, count).map(i => ({ prompt: i.question, answer: i.answer })));

  // Generic items with part/job or organelle/function
  if (bank.items && (bank.items[0]?.part || bank.items[0]?.organelle || bank.items[0]?.organ))
    return exResult('function-match', skill, grade, 'What is the function of this part?',
      pick(bank.items, count).map(i => ({
        prompt: `What does the ${i.part || i.organelle || i.organ} do?`,
        answer: i.job || i.function || i.purpose,
      })));

  // Generic items with animal/adaptation or scenario
  if (bank.items && (bank.items[0]?.adaptation || bank.items[0]?.behavior))
    return exResult('explain', skill, grade, 'How does this adaptation or behavior help the organism survive?',
      pick(bank.items, count).map(i => ({
        prompt: `How does "${i.adaptation || i.behavior}" help the ${i.animal}?`,
        answer: i.benefit,
      })));

  // Chains format for food webs
  if (bank.chains)
    return exResult('sequence', skill, grade, 'Put this food chain in order from producer to top predator.',
      pick(bank.chains, count).map(chain => ({
        prompt: `Order: ${shuffle(chain.slice(1)).join(', ')}`,
        answer: chain.slice(1).join(' -> '),
      })));

  // Stages format for life cycles
  if (bank.items && bank.items[0]?.stages)
    return exResult('sequence', skill, grade, 'What are the stages of this life cycle in order?',
      pick(bank.items, count).map(i => ({
        prompt: `What are the life cycle stages of a ${i.organism}?`,
        answer: i.stages.join(', '),
      })));

  // Seed dispersal and similar
  if (bank.items && bank.items[0]?.method)
    return exResult('match', skill, grade, 'How is this seed dispersed?',
      pick(bank.items, count).map(i => ({ prompt: `How does a ${i.seed} spread its seeds?`, answer: i.method })));

  // Environmental effects
  if (bank.items && bank.items[0]?.factor)
    return exResult('explain', skill, grade, 'How does this environmental factor affect the trait?',
      pick(bank.items, count).map(i => ({ prompt: `How does ${i.factor} affect ${i.trait}?`, answer: i.effect })));

  // Punnett squares
  if (bank.items && bank.items[0]?.cross)
    return exResult('genetics', skill, grade, 'What are the expected offspring from this cross?',
      pick(bank.items, count).map(i => ({ prompt: `Cross: ${i.cross}. What is the phenotype ratio?`, answer: i.ratio })));

  // Human impact
  if (bank.items && bank.items[0]?.action)
    return exResult('explain', skill, grade, 'What is the impact of this human action on ecosystems?',
      pick(bank.items, count).map(i => ({ prompt: `What is the impact of ${i.action}?`, answer: i.impact })));

  // Resemblance
  if (bank.items && bank.items[0]?.parent)
    return exResult('explain', skill, grade, 'How do offspring resemble their parents?',
      pick(bank.items, count).map(i => ({ prompt: `A ${i.parent} has ${i.trait}. What does the baby look like?`, answer: i.baby })));

  // Pollination
  if (bank.items && bank.items[0]?.pollinator)
    return exResult('match', skill, grade, 'What attracts this pollinator to flowers?',
      pick(bank.items, count).map(i => ({ prompt: `What attracts a ${i.pollinator} to flowers?`, answer: i.attracted_by })));

  // Differential survival
  if (bank.items && bank.items[0]?.scenario)
    return exResult('short-answer', skill, grade, 'Which organism survives better and why?',
      pick(bank.items, count).map(i => ({ prompt: `${i.scenario}. ${i.question}`, answer: i.answer })));

  // Cell comparison
  if (bank.items && bank.items[0]?.feature)
    return exResult('compare', skill, grade, 'Compare plant and animal cells.',
      pick(bank.items, count).map(i => ({ prompt: `${i.feature}: Plant cell?`, answer: i.plant })));

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(e => norm(e) === norm(answer));
  return norm(expected) === norm(answer);
}

// Public API

class LifeScience {
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

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  getPassage(grade) {
    const texts = PASSAGES[grade];
    if (!texts) return { error: `No passages for ${grade}. Available: ${Object.keys(PASSAGES).join(', ')}` };
    return pick(texts, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'K-2';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const passage = PASSAGES[grade] ? pick(PASSAGES[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, passage,
      lessonPlan: {
        engage: `Present a phenomenon related to ${target.category} -> ${target.skill}`,
        explore: `Complete ${exercise.count || 0} practice items`,
        explain: `Discuss the key concept behind ${target.skill}`,
        elaborate: 'Connect to real-world examples',
        evaluate: passage ? `Read passage: "${passage.title}"` : 'Reflect on what was learned',
      },
    };
  }
}

module.exports = LifeScience;

// CLI: node life-science.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new LifeScience();
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
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'K-2';
        if (skill) { out(api.generateExercise(grade, skill, 5)); }
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
      case 'passage': { const [, g] = args; if (!g) throw new Error('Usage: passage <grade>'); out(api.getPassage(g)); break; }
      default: out({ usage: 'node life-science.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','passage'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
