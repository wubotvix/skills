// eClaw MS Life Science Interactive Tutor (6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-science-life');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'cells': ['cell-theory', 'cell-organelles', 'plant-vs-animal-cells', 'levels-of-organization'],
    'body-systems': ['digestive-system', 'circulatory-system', 'respiratory-system', 'nervous-system', 'musculoskeletal-system'],
    'energy-in-organisms': ['photosynthesis', 'cellular-respiration', 'complementary-processes'],
  },
  'grade-7': {
    'ecosystems': ['food-webs', 'energy-pyramids', 'matter-cycling', 'carrying-capacity'],
    'biodiversity': ['biodiversity-importance', 'human-impacts-on-ecosystems', 'invasive-species'],
    'organism-interactions': ['predator-prey', 'symbiosis', 'competition'],
  },
  'grade-8': {
    'genetics': ['genes-and-chromosomes', 'dominant-recessive', 'punnett-squares', 'mutations'],
    'heredity': ['sexual-vs-asexual', 'genetic-variation', 'environmental-vs-genetic'],
    'evolution': ['fossil-evidence', 'common-ancestry', 'natural-selection', 'adaptation', 'artificial-selection'],
  },
};

const QUESTION_BANKS = {
  'grade-6': {
    'cell-theory': {
      questions: [
        { q: 'What are the three parts of cell theory?', a: 'All living things are made of cells, cells are the basic unit of life, and all cells come from existing cells', type: 'open' },
        { q: 'True or false: Some living things are not made of cells.', a: 'false', type: 'tf' },
        { q: 'Where do new cells come from?', a: 'existing cells', type: 'short' },
        { q: 'Who is credited with first observing cells in cork?', a: 'Robert Hooke', type: 'short' },
        { q: 'What is the basic unit of structure and function in all living things?', a: 'the cell', type: 'short' },
        { q: 'True or false: Cells can arise spontaneously from non-living matter.', a: 'false', type: 'tf' },
        { q: 'What instrument allowed scientists to discover cells?', a: 'microscope', type: 'short' },
        { q: 'Can a single cell be a complete organism?', a: 'yes', type: 'short' },
      ],
    },
    'cell-organelles': {
      questions: [
        { q: 'What organelle is known as the "powerhouse of the cell"?', a: 'mitochondria', type: 'short' },
        { q: 'What organelle controls the cell and contains DNA?', a: 'nucleus', type: 'short' },
        { q: 'What structure controls what enters and exits the cell?', a: 'cell membrane', type: 'short' },
        { q: 'Where does photosynthesis occur in a plant cell?', a: 'chloroplast', type: 'short' },
        { q: 'What organelle makes proteins?', a: 'ribosome', type: 'short' },
        { q: 'What is the jelly-like substance that fills the cell?', a: 'cytoplasm', type: 'short' },
        { q: 'What organelle stores water and nutrients in plant cells?', a: 'vacuole', type: 'short' },
        { q: 'What does the mitochondria do?', a: 'converts food into energy (ATP)', type: 'open' },
      ],
    },
    'plant-vs-animal-cells': {
      questions: [
        { q: 'Name one structure found in plant cells but NOT animal cells.', a: ['cell wall', 'chloroplast', 'large central vacuole'], type: 'multi' },
        { q: 'Do animal cells have a cell wall?', a: 'no', type: 'short' },
        { q: 'What gives plant cells their rigid, rectangular shape?', a: 'cell wall', type: 'short' },
        { q: 'Which type of cell has chloroplasts?', a: 'plant cell', type: 'short' },
        { q: 'Do both plant and animal cells have a nucleus?', a: 'yes', type: 'short' },
        { q: 'Do both plant and animal cells have mitochondria?', a: 'yes', type: 'short' },
        { q: 'Which cell type typically has a large central vacuole?', a: 'plant cell', type: 'short' },
        { q: 'What organelle in plant cells captures light energy?', a: 'chloroplast', type: 'short' },
      ],
    },
    'levels-of-organization': {
      questions: [
        { q: 'Put these in order from smallest to largest: organ, cell, organ system, tissue, organism', a: 'cell, tissue, organ, organ system, organism', type: 'short' },
        { q: 'What is a group of similar cells working together called?', a: 'tissue', type: 'short' },
        { q: 'What is a group of tissues working together called?', a: 'organ', type: 'short' },
        { q: 'Give an example of an organ system.', a: ['digestive system', 'circulatory system', 'respiratory system', 'nervous system', 'skeletal system', 'muscular system'], type: 'multi' },
        { q: 'What is the smallest level of organization in a living thing?', a: 'cell', type: 'short' },
        { q: 'What level of organization is the heart?', a: 'organ', type: 'short' },
        { q: 'What level of organization is blood?', a: 'tissue', type: 'short' },
        { q: 'What is the highest level of organization?', a: 'organism', type: 'short' },
      ],
    },
    'digestive-system': {
      questions: [
        { q: 'What is the main function of the digestive system?', a: 'break down food into nutrients the body can absorb', type: 'open' },
        { q: 'Where does most chemical digestion and nutrient absorption occur?', a: 'small intestine', type: 'short' },
        { q: 'What organ produces bile to help digest fats?', a: 'liver', type: 'short' },
        { q: 'What is the muscular tube that moves food from mouth to stomach?', a: 'esophagus', type: 'short' },
        { q: 'What does the stomach use to break down food?', a: ['acid', 'hydrochloric acid', 'stomach acid', 'enzymes'], type: 'multi' },
        { q: 'What is the main function of the large intestine?', a: 'absorb water', type: 'short' },
        { q: 'What wave-like muscle contractions move food through the digestive tract?', a: 'peristalsis', type: 'short' },
        { q: 'Where does mechanical digestion begin?', a: 'mouth', type: 'short' },
      ],
    },
    'circulatory-system': {
      questions: [
        { q: 'What organ pumps blood throughout the body?', a: 'heart', type: 'short' },
        { q: 'What type of blood vessel carries blood AWAY from the heart?', a: 'artery', type: 'short' },
        { q: 'What type of blood vessel carries blood TOWARD the heart?', a: 'vein', type: 'short' },
        { q: 'What are the tiny blood vessels where gas exchange occurs?', a: 'capillaries', type: 'short' },
        { q: 'What does blood carry to cells throughout the body?', a: ['oxygen', 'nutrients', 'oxygen and nutrients'], type: 'multi' },
        { q: 'How many chambers does the human heart have?', a: '4', type: 'short' },
        { q: 'What component of blood carries oxygen?', a: 'red blood cells', type: 'short' },
        { q: 'What component of blood fights infection?', a: 'white blood cells', type: 'short' },
      ],
    },
    'respiratory-system': {
      questions: [
        { q: 'What gas do we inhale that our cells need?', a: 'oxygen', type: 'short' },
        { q: 'What gas do we exhale as a waste product?', a: 'carbon dioxide', type: 'short' },
        { q: 'Where does gas exchange occur in the lungs?', a: 'alveoli', type: 'short' },
        { q: 'What muscle contracts to help you breathe in?', a: 'diaphragm', type: 'short' },
        { q: 'What is the tube that carries air from the mouth/nose to the lungs?', a: 'trachea', type: 'short' },
        { q: 'What are the two large organs where gas exchange happens?', a: 'lungs', type: 'short' },
        { q: 'What system works closely with the respiratory system to deliver oxygen?', a: 'circulatory system', type: 'short' },
        { q: 'True or false: Breathing and cellular respiration are the same thing.', a: 'false', type: 'tf' },
      ],
    },
    'nervous-system': {
      questions: [
        { q: 'What is the control center of the nervous system?', a: 'brain', type: 'short' },
        { q: 'What type of cell transmits electrical signals in the nervous system?', a: ['neuron', 'nerve cell'], type: 'multi' },
        { q: 'What is a quick, automatic response to a stimulus called?', a: 'reflex', type: 'short' },
        { q: 'What are the two main parts of the central nervous system?', a: 'brain and spinal cord', type: 'short' },
        { q: 'What do sensory receptors detect?', a: 'stimuli', type: 'short' },
        { q: 'What part of the nervous system includes nerves throughout the body?', a: 'peripheral nervous system', type: 'short' },
        { q: 'What do we call information detected by the senses?', a: ['stimulus', 'stimuli'], type: 'multi' },
        { q: 'True or false: The nervous system only controls voluntary actions.', a: 'false', type: 'tf' },
      ],
    },
    'musculoskeletal-system': {
      questions: [
        { q: 'What are the two systems that work together to allow movement?', a: 'muscular and skeletal', type: 'short' },
        { q: 'What connects muscle to bone?', a: 'tendon', type: 'short' },
        { q: 'What connects bone to bone?', a: 'ligament', type: 'short' },
        { q: 'What is the function of the skeletal system?', a: ['support', 'protection', 'movement', 'support and protection'], type: 'multi' },
        { q: 'What type of muscle is found in the heart?', a: 'cardiac muscle', type: 'short' },
        { q: 'What type of muscle can you control voluntarily?', a: 'skeletal muscle', type: 'short' },
        { q: 'Approximately how many bones are in the adult human body?', a: '206', type: 'short' },
        { q: 'What is the place where two bones meet called?', a: 'joint', type: 'short' },
      ],
    },
    'photosynthesis': {
      questions: [
        { q: 'What is the equation for photosynthesis in words?', a: 'carbon dioxide + water + light energy -> glucose + oxygen', type: 'open' },
        { q: 'Where does photosynthesis take place?', a: ['chloroplast', 'chloroplasts'], type: 'multi' },
        { q: 'What is the source of energy for photosynthesis?', a: ['sunlight', 'light', 'sun'], type: 'multi' },
        { q: 'What gas do plants absorb during photosynthesis?', a: 'carbon dioxide', type: 'short' },
        { q: 'What gas do plants release during photosynthesis?', a: 'oxygen', type: 'short' },
        { q: 'What sugar do plants produce during photosynthesis?', a: 'glucose', type: 'short' },
        { q: 'True or false: Plants get their food from the soil.', a: 'false', type: 'tf' },
        { q: 'What pigment in chloroplasts captures light energy?', a: 'chlorophyll', type: 'short' },
      ],
    },
    'cellular-respiration': {
      questions: [
        { q: 'What is the equation for cellular respiration in words?', a: 'glucose + oxygen -> carbon dioxide + water + energy (ATP)', type: 'open' },
        { q: 'Where does cellular respiration take place?', a: ['mitochondria', 'mitochondrion'], type: 'multi' },
        { q: 'What is the purpose of cellular respiration?', a: 'to release energy (ATP) from food', type: 'open' },
        { q: 'Do both plants and animals perform cellular respiration?', a: 'yes', type: 'short' },
        { q: 'What molecule is the main energy currency of cells?', a: 'ATP', type: 'short' },
        { q: 'True or false: Cellular respiration is the same as breathing.', a: 'false', type: 'tf' },
        { q: 'What gas is used in cellular respiration?', a: 'oxygen', type: 'short' },
        { q: 'What gas is released as a waste product of cellular respiration?', a: 'carbon dioxide', type: 'short' },
      ],
    },
    'complementary-processes': {
      questions: [
        { q: 'How are photosynthesis and cellular respiration related?', a: 'the products of one are the reactants of the other', type: 'open' },
        { q: 'Which process produces glucose: photosynthesis or cellular respiration?', a: 'photosynthesis', type: 'short' },
        { q: 'Which process uses glucose for energy?', a: 'cellular respiration', type: 'short' },
        { q: 'What gas produced by photosynthesis is used in cellular respiration?', a: 'oxygen', type: 'short' },
        { q: 'What gas produced by cellular respiration is used in photosynthesis?', a: 'carbon dioxide', type: 'short' },
        { q: 'True or false: Only plants do photosynthesis, but all organisms do cellular respiration.', a: 'false', type: 'tf' },
        { q: 'Where does the energy in food originally come from?', a: ['the sun', 'sunlight', 'sun'], type: 'multi' },
        { q: 'True or false: Energy is created during cellular respiration.', a: 'false', type: 'tf' },
      ],
    },
  },
  'grade-7': {
    'food-webs': {
      questions: [
        { q: 'What is the difference between a food chain and a food web?', a: 'A food web shows multiple interconnected food chains in an ecosystem', type: 'open' },
        { q: 'What do arrows in a food chain represent?', a: 'the direction of energy flow', type: 'short' },
        { q: 'What organisms are at the base of most food webs?', a: ['producers', 'plants', 'autotrophs'], type: 'multi' },
        { q: 'What are organisms that eat producers called?', a: ['primary consumers', 'herbivores'], type: 'multi' },
        { q: 'What role do decomposers play in a food web?', a: 'break down dead organisms and recycle nutrients', type: 'open' },
        { q: 'What would happen to a food web if all the producers died?', a: 'all consumers would eventually die because energy enters through producers', type: 'open' },
        { q: 'What is an organism that makes its own food called?', a: ['producer', 'autotroph'], type: 'multi' },
        { q: 'What is an organism that eats other organisms for energy called?', a: ['consumer', 'heterotroph'], type: 'multi' },
      ],
    },
    'energy-pyramids': {
      questions: [
        { q: 'In an energy pyramid, which level has the MOST energy?', a: ['producers', 'bottom level', 'base'], type: 'multi' },
        { q: 'Approximately what percentage of energy transfers from one trophic level to the next?', a: '10', type: 'short' },
        { q: 'Why are there fewer top predators than producers in an ecosystem?', a: 'there is less energy available at higher trophic levels', type: 'open' },
        { q: 'What happens to the other 90% of energy at each level?', a: 'it is lost as heat through life processes', type: 'open' },
        { q: 'Which trophic level has the most organisms?', a: 'producers', type: 'short' },
        { q: 'True or false: Energy is recycled in an ecosystem like matter is.', a: 'false', type: 'tf' },
        { q: 'What is a trophic level?', a: 'a feeding level in a food chain or food web', type: 'open' },
        { q: 'Why does an energy pyramid get narrower at the top?', a: 'less energy is available at each higher level', type: 'open' },
      ],
    },
    'matter-cycling': {
      questions: [
        { q: 'Name one biogeochemical cycle.', a: ['carbon cycle', 'nitrogen cycle', 'water cycle', 'phosphorus cycle'], type: 'multi' },
        { q: 'True or false: Matter is recycled in ecosystems but energy is not.', a: 'true', type: 'tf' },
        { q: 'What process returns carbon from organisms to the atmosphere?', a: ['cellular respiration', 'decomposition', 'burning'], type: 'multi' },
        { q: 'What process removes carbon from the atmosphere?', a: 'photosynthesis', type: 'short' },
        { q: 'Where is most of Earth\'s water stored?', a: ['oceans', 'the ocean'], type: 'multi' },
        { q: 'What is the role of decomposers in matter cycling?', a: 'they break down dead matter and release nutrients back into the soil and atmosphere', type: 'open' },
        { q: 'True or false: Atoms are destroyed when organisms die.', a: 'false', type: 'tf' },
        { q: 'What drives the water cycle?', a: ['the sun', 'solar energy', 'sunlight'], type: 'multi' },
      ],
    },
    'carrying-capacity': {
      questions: [
        { q: 'What is carrying capacity?', a: 'the maximum number of organisms an environment can support', type: 'open' },
        { q: 'What happens when a population exceeds carrying capacity?', a: 'the population decreases due to limited resources', type: 'open' },
        { q: 'Name a factor that limits population size.', a: ['food', 'water', 'space', 'shelter', 'predators', 'disease'], type: 'multi' },
        { q: 'What are resources that limit population growth called?', a: 'limiting factors', type: 'short' },
        { q: 'True or false: Carrying capacity is always the same for a species.', a: 'false', type: 'tf' },
        { q: 'What shape does a population graph make when it reaches carrying capacity?', a: ['S-curve', 'S-shaped', 'S'], type: 'multi' },
        { q: 'Does adding more resources increase or decrease carrying capacity?', a: 'increase', type: 'short' },
        { q: 'What is competition for resources an example of?', a: 'limiting factor', type: 'short' },
      ],
    },
    'biodiversity-importance': {
      questions: [
        { q: 'What is biodiversity?', a: 'the variety of life in an ecosystem or on Earth', type: 'open' },
        { q: 'Why is biodiversity important for ecosystem resilience?', a: 'more species means the ecosystem can better recover from disturbances', type: 'open' },
        { q: 'True or false: An ecosystem with only a few species is more stable than one with many.', a: 'false', type: 'tf' },
        { q: 'What happens to a food web if a key species is removed?', a: 'other populations are affected and the ecosystem can become unstable', type: 'open' },
        { q: 'What is a keystone species?', a: 'a species that has a large impact on its ecosystem relative to its population size', type: 'open' },
        { q: 'Name one human activity that reduces biodiversity.', a: ['deforestation', 'pollution', 'habitat destruction', 'overhunting', 'urbanization'], type: 'multi' },
        { q: 'What is extinction?', a: 'when the last member of a species dies and the species no longer exists', type: 'open' },
        { q: 'True or false: Biodiversity only refers to the number of animal species.', a: 'false', type: 'tf' },
      ],
    },
    'human-impacts-on-ecosystems': {
      questions: [
        { q: 'Name one way humans negatively impact ecosystems.', a: ['pollution', 'deforestation', 'habitat destruction', 'overfishing', 'burning fossil fuels'], type: 'multi' },
        { q: 'What is habitat destruction?', a: 'the process of destroying natural habitats so organisms can no longer survive there', type: 'open' },
        { q: 'How does pollution affect ecosystems?', a: 'it can harm or kill organisms and disrupt food webs', type: 'open' },
        { q: 'Name one way humans can help protect ecosystems.', a: ['conservation', 'recycling', 'reducing pollution', 'creating protected areas', 'planting trees'], type: 'multi' },
        { q: 'What is deforestation?', a: 'the clearing of forests, usually for agriculture or development', type: 'open' },
        { q: 'How does burning fossil fuels affect the environment?', a: 'it releases greenhouse gases that contribute to climate change', type: 'open' },
        { q: 'What is an endangered species?', a: 'a species at risk of extinction', type: 'open' },
        { q: 'True or false: Humans can have positive impacts on ecosystems.', a: 'true', type: 'tf' },
      ],
    },
    'invasive-species': {
      questions: [
        { q: 'What is an invasive species?', a: 'a non-native species that causes harm to the ecosystem it is introduced to', type: 'open' },
        { q: 'Why are invasive species harmful to ecosystems?', a: 'they compete with native species for resources and often have no natural predators', type: 'open' },
        { q: 'Name one example of an invasive species.', a: ['kudzu', 'zebra mussel', 'Asian carp', 'European starling', 'fire ants', 'cane toad'], type: 'multi' },
        { q: 'How do invasive species often arrive in new ecosystems?', a: ['human activity', 'ships', 'trade', 'accidental introduction', 'intentional release'], type: 'multi' },
        { q: 'Why do invasive species often grow quickly in new environments?', a: 'they often have no natural predators or competitors in the new environment', type: 'open' },
        { q: 'True or false: All non-native species are invasive.', a: 'false', type: 'tf' },
        { q: 'What can happen to native species when an invasive species takes over?', a: 'native species may decline or go extinct', type: 'open' },
        { q: 'What is one way to control invasive species?', a: ['removal', 'biological control', 'prevention', 'trapping'], type: 'multi' },
      ],
    },
    'predator-prey': {
      questions: [
        { q: 'When the predator population increases, what typically happens to the prey population?', a: 'it decreases', type: 'short' },
        { q: 'When prey populations decrease, what happens to predator populations?', a: 'they decrease because there is less food', type: 'open' },
        { q: 'What pattern do predator-prey populations show over time?', a: 'cyclical rises and falls', type: 'open' },
        { q: 'In a predator-prey graph, which population peaks first?', a: 'prey', type: 'short' },
        { q: 'True or false: Predators always drive prey to extinction.', a: 'false', type: 'tf' },
        { q: 'Give an example of a predator-prey relationship.', a: ['wolf and rabbit', 'lion and zebra', 'fox and mouse', 'owl and mouse', 'shark and fish'], type: 'multi' },
        { q: 'What would happen if all predators were removed from an ecosystem?', a: 'prey populations would increase rapidly, then crash due to resource depletion', type: 'open' },
        { q: 'What is the role of predators in maintaining ecosystem balance?', a: 'they control prey populations and prevent overgrazing', type: 'open' },
      ],
    },
    'symbiosis': {
      questions: [
        { q: 'What is symbiosis?', a: 'a close, long-term interaction between two different species', type: 'open' },
        { q: 'In mutualism, how many species benefit?', a: 'both', type: 'short' },
        { q: 'What type of symbiosis benefits one organism and harms the other?', a: 'parasitism', type: 'short' },
        { q: 'What type of symbiosis benefits one organism and has no effect on the other?', a: 'commensalism', type: 'short' },
        { q: 'A bee pollinating a flower is an example of what type of symbiosis?', a: 'mutualism', type: 'short' },
        { q: 'A tick feeding on a dog is an example of what type of symbiosis?', a: 'parasitism', type: 'short' },
        { q: 'A barnacle on a whale is an example of what type of symbiosis?', a: 'commensalism', type: 'short' },
        { q: 'Name the three types of symbiosis.', a: 'mutualism, commensalism, and parasitism', type: 'short' },
      ],
    },
    'competition': {
      questions: [
        { q: 'What is competition in an ecosystem?', a: 'when organisms struggle for the same limited resources', type: 'open' },
        { q: 'What is the difference between interspecific and intraspecific competition?', a: 'interspecific is between different species; intraspecific is within the same species', type: 'open' },
        { q: 'What do organisms typically compete for?', a: ['food', 'water', 'space', 'shelter', 'mates', 'sunlight'], type: 'multi' },
        { q: 'What happens when two species compete for the same niche?', a: 'one species may outcompete the other, leading to competitive exclusion', type: 'open' },
        { q: 'True or false: Competition only occurs between different species.', a: 'false', type: 'tf' },
        { q: 'What is a niche?', a: 'the role an organism plays in its ecosystem, including its habitat and resource use', type: 'open' },
        { q: 'How does competition affect population size?', a: 'it limits population growth by reducing available resources', type: 'open' },
        { q: 'Two plants growing next to each other competing for sunlight is what type of interaction?', a: 'competition', type: 'short' },
      ],
    },
  },
  'grade-8': {
    'genes-and-chromosomes': {
      questions: [
        { q: 'What molecule carries genetic information?', a: 'DNA', type: 'short' },
        { q: 'Where are chromosomes found in a cell?', a: 'nucleus', type: 'short' },
        { q: 'What is a gene?', a: 'a segment of DNA that codes for a specific protein or trait', type: 'open' },
        { q: 'How many chromosomes do human body cells have?', a: '46', type: 'short' },
        { q: 'What are different versions of the same gene called?', a: 'alleles', type: 'short' },
        { q: 'What do genes code for?', a: 'proteins', type: 'short' },
        { q: 'What is a genotype?', a: 'the combination of alleles an organism has for a trait', type: 'open' },
        { q: 'What is a phenotype?', a: 'the physical appearance or expression of a trait', type: 'open' },
      ],
    },
    'dominant-recessive': {
      questions: [
        { q: 'How is a dominant allele represented?', a: 'capital letter', type: 'short' },
        { q: 'How is a recessive allele represented?', a: 'lowercase letter', type: 'short' },
        { q: 'How many copies of a recessive allele are needed to show the recessive trait?', a: '2', type: 'short' },
        { q: 'What is a heterozygous genotype?', a: 'having two different alleles for a trait (e.g., Bb)', type: 'open' },
        { q: 'What is a homozygous genotype?', a: 'having two identical alleles for a trait (e.g., BB or bb)', type: 'open' },
        { q: 'If B is dominant for brown eyes and b is recessive for blue eyes, what phenotype does Bb have?', a: 'brown eyes', type: 'short' },
        { q: 'True or false: A dominant allele always means it is the most common in a population.', a: 'false', type: 'tf' },
        { q: 'Can two brown-eyed parents have a blue-eyed child?', a: 'yes, if both parents are heterozygous (Bb)', type: 'open' },
      ],
    },
    'punnett-squares': {
      questions: [
        { q: 'What tool do we use to predict the probability of offspring genotypes?', a: 'Punnett square', type: 'short' },
        { q: 'Cross Bb x Bb: What fraction of offspring are expected to be bb?', a: '1/4', type: 'short' },
        { q: 'Cross Bb x Bb: What fraction of offspring show the dominant phenotype?', a: '3/4', type: 'short' },
        { q: 'Cross BB x bb: What are all the offspring genotypes?', a: 'Bb', type: 'short' },
        { q: 'Cross Bb x bb: What fraction of offspring are heterozygous?', a: '1/2', type: 'short' },
        { q: 'What goes on the outside of a Punnett square?', a: 'the alleles from each parent', type: 'short' },
        { q: 'If the Punnett square result is 25% BB, 50% Bb, 25% bb, what is the phenotype ratio?', a: '3:1', type: 'short' },
        { q: 'True or false: Punnett squares give exact results, not probabilities.', a: 'false', type: 'tf' },
      ],
    },
    'mutations': {
      questions: [
        { q: 'What is a mutation?', a: 'a change in the DNA sequence', type: 'open' },
        { q: 'True or false: All mutations are harmful.', a: 'false', type: 'tf' },
        { q: 'What are the three possible effects of a mutation?', a: 'harmful, helpful, or neutral', type: 'short' },
        { q: 'What causes mutations?', a: ['errors in DNA replication', 'radiation', 'chemicals', 'UV light', 'random errors'], type: 'multi' },
        { q: 'Can mutations be passed to offspring?', a: 'yes, if they occur in reproductive cells', type: 'open' },
        { q: 'Give an example of a beneficial mutation.', a: ['sickle cell trait resistance to malaria', 'antibiotic resistance in bacteria', 'lactose tolerance'], type: 'multi' },
        { q: 'What is the relationship between mutations and genetic variation?', a: 'mutations are a source of new genetic variation', type: 'open' },
        { q: 'True or false: Mutations only affect one gene at a time.', a: 'false', type: 'tf' },
      ],
    },
    'sexual-vs-asexual': {
      questions: [
        { q: 'How many parents are involved in sexual reproduction?', a: '2', type: 'short' },
        { q: 'How many parents are involved in asexual reproduction?', a: '1', type: 'short' },
        { q: 'Which type of reproduction produces more genetic variation?', a: 'sexual', type: 'short' },
        { q: 'What are offspring of asexual reproduction called?', a: 'clones', type: 'short' },
        { q: 'Name one type of asexual reproduction.', a: ['binary fission', 'budding', 'fragmentation', 'vegetative propagation'], type: 'multi' },
        { q: 'Why is genetic variation important for a species?', a: 'it helps the species survive changing environments', type: 'open' },
        { q: 'True or false: Bacteria reproduce sexually.', a: 'false', type: 'tf' },
        { q: 'What is an advantage of asexual reproduction?', a: 'it is faster and requires only one parent', type: 'open' },
      ],
    },
    'genetic-variation': {
      questions: [
        { q: 'What are two sources of genetic variation?', a: 'mutation and sexual reproduction', type: 'short' },
        { q: 'What process during meiosis increases genetic variation?', a: ['crossing over', 'independent assortment'], type: 'multi' },
        { q: 'True or false: All members of a species have identical DNA.', a: 'false', type: 'tf' },
        { q: 'Why does sexual reproduction produce genetically unique offspring?', a: 'each parent contributes a different combination of alleles', type: 'open' },
        { q: 'What is the difference between genotype and phenotype?', a: 'genotype is the genetic makeup; phenotype is the physical expression', type: 'open' },
        { q: 'Can the environment affect phenotype?', a: 'yes', type: 'short' },
        { q: 'True or false: Identical twins have identical genotypes but can have different phenotypes.', a: 'true', type: 'tf' },
        { q: 'What is genetic variation?', a: 'differences in DNA sequences among individuals of a species', type: 'open' },
      ],
    },
    'environmental-vs-genetic': {
      questions: [
        { q: 'Is height determined by genes, environment, or both?', a: 'both', type: 'short' },
        { q: 'Give an example of a trait influenced mainly by genetics.', a: ['blood type', 'eye color', 'earlobe shape'], type: 'multi' },
        { q: 'Give an example of a trait influenced mainly by environment.', a: ['language spoken', 'scars', 'tanned skin', 'muscle mass from exercise'], type: 'multi' },
        { q: 'True or false: A plant grown in poor soil will be shorter, but its genes for height have not changed.', a: 'true', type: 'tf' },
        { q: 'Can an organism pass on traits acquired from the environment?', a: 'no', type: 'short' },
        { q: 'What do we call traits influenced by both genes and environment?', a: 'multifactorial traits', type: 'short' },
        { q: 'If a bodybuilder has large muscles from exercise, will their children be born muscular?', a: 'no, acquired traits are not inherited', type: 'open' },
        { q: 'True or false: Only genetic factors affect an organism\'s phenotype.', a: 'false', type: 'tf' },
      ],
    },
    'fossil-evidence': {
      questions: [
        { q: 'What do fossils provide evidence for?', a: 'evolution and how life has changed over time', type: 'open' },
        { q: 'What is a transitional fossil?', a: 'a fossil that shows features of both an ancestral species and a descendant species', type: 'open' },
        { q: 'Name a famous transitional fossil.', a: ['Archaeopteryx', 'Tiktaalik', 'Ambulocetus'], type: 'multi' },
        { q: 'In undisturbed rock layers, where are the oldest fossils found?', a: ['bottom', 'lowest layers'], type: 'multi' },
        { q: 'What type of rock are most fossils found in?', a: 'sedimentary', type: 'short' },
        { q: 'True or false: The fossil record is complete and shows every species that ever lived.', a: 'false', type: 'tf' },
        { q: 'What can scientists learn from comparing fossils from different time periods?', a: 'how species have changed and evolved over time', type: 'open' },
        { q: 'What is the law of superposition?', a: 'in undisturbed rock layers, older layers are on the bottom and younger layers are on top', type: 'open' },
      ],
    },
    'common-ancestry': {
      questions: [
        { q: 'What are homologous structures?', a: 'structures in different species that share a common origin but may have different functions', type: 'open' },
        { q: 'A human arm, whale flipper, and bat wing are all examples of what?', a: 'homologous structures', type: 'short' },
        { q: 'What do homologous structures suggest about species?', a: 'they share a common ancestor', type: 'open' },
        { q: 'What do embryological similarities between species suggest?', a: 'common ancestry', type: 'short' },
        { q: 'True or false: Humans evolved from modern monkeys.', a: 'false', type: 'tf' },
        { q: 'What does a phylogenetic tree show?', a: 'the evolutionary relationships among species', type: 'open' },
        { q: 'What are vestigial structures?', a: 'structures that have lost their original function through evolution', type: 'open' },
        { q: 'Give an example of a vestigial structure.', a: ['human appendix', 'whale hip bones', 'wisdom teeth', 'tailbone'], type: 'multi' },
      ],
    },
    'natural-selection': {
      questions: [
        { q: 'What are the four conditions needed for natural selection?', a: 'variation, overproduction, selection, and inheritance', type: 'open' },
        { q: 'Who is credited with developing the theory of natural selection?', a: ['Charles Darwin', 'Darwin'], type: 'multi' },
        { q: 'What does "survival of the fittest" really mean?', a: 'organisms best adapted to their environment are more likely to survive and reproduce', type: 'open' },
        { q: 'True or false: Organisms choose to evolve adaptations they need.', a: 'false', type: 'tf' },
        { q: 'Does natural selection act on individuals or populations?', a: 'populations', type: 'short' },
        { q: 'What is fitness in the context of natural selection?', a: 'an organism\'s ability to survive and reproduce in its environment', type: 'open' },
        { q: 'True or false: Natural selection is directed toward making organisms "better."', a: 'false', type: 'tf' },
        { q: 'What provides the variation that natural selection acts upon?', a: ['mutations', 'genetic variation', 'sexual reproduction'], type: 'multi' },
      ],
    },
    'adaptation': {
      questions: [
        { q: 'What is an adaptation?', a: 'a trait that helps an organism survive and reproduce in its environment', type: 'open' },
        { q: 'Give an example of a structural adaptation.', a: ['camouflage', 'thick fur', 'webbed feet', 'sharp claws', 'long neck'], type: 'multi' },
        { q: 'Give an example of a behavioral adaptation.', a: ['migration', 'hibernation', 'nocturnal activity', 'playing dead'], type: 'multi' },
        { q: 'How do adaptations arise in a population?', a: 'through natural selection over many generations', type: 'open' },
        { q: 'True or false: An individual organism can develop an adaptation during its lifetime.', a: 'false', type: 'tf' },
        { q: 'What happens to organisms that are poorly adapted to their environment?', a: 'they are less likely to survive and reproduce', type: 'open' },
        { q: 'Can an adaptation become unhelpful if the environment changes?', a: 'yes', type: 'short' },
        { q: 'What is mimicry?', a: 'when one species resembles another species or its environment for protection', type: 'open' },
      ],
    },
    'artificial-selection': {
      questions: [
        { q: 'What is artificial selection?', a: 'when humans selectively breed organisms for desired traits', type: 'open' },
        { q: 'How is artificial selection different from natural selection?', a: 'humans choose which traits to select for, rather than the environment', type: 'open' },
        { q: 'Give an example of artificial selection.', a: ['dog breeds', 'crop varieties', 'livestock breeding', 'corn', 'broccoli from wild mustard'], type: 'multi' },
        { q: 'What did all domestic dog breeds descend from?', a: ['wolves', 'gray wolves'], type: 'multi' },
        { q: 'True or false: Artificial selection is a modern invention.', a: 'false', type: 'tf' },
        { q: 'What trait did farmers select for when developing modern corn from teosinte?', a: ['larger ears', 'bigger kernels', 'more kernels'], type: 'multi' },
        { q: 'Can artificial selection lead to health problems in animals?', a: 'yes', type: 'short' },
        { q: 'What evidence does artificial selection provide for evolution?', a: 'it shows that traits can change over generations through selection', type: 'open' },
      ],
    },
  },
};

const PHENOMENA = {
  'grade-6': [
    { title: 'The Trillion-Cell Human', focus: 'cells', text: 'A single fertilized egg becomes a trillion-cell human body.', drivingQuestion: 'How does one cell become a whole organism with so many different types of cells?' },
    { title: 'The Unstoppable Heart', focus: 'body-systems', text: 'Your heart beats about 100,000 times per day without you ever thinking about it.', drivingQuestion: 'How do body systems work together without your conscious control?' },
    { title: 'The Giant Redwood', focus: 'energy-in-organisms', text: 'A giant redwood tree weighs 2 million pounds but grew from a tiny seed.', drivingQuestion: 'Where does all the mass of a tree come from if not the soil?' },
    { title: 'The Breathing Plant', focus: 'energy-in-organisms', text: 'At night, plants take in oxygen and release carbon dioxide, just like animals.', drivingQuestion: 'If plants make oxygen, why do they also need it?' },
  ],
  'grade-7': [
    { title: 'Wolves and Rivers', focus: 'ecosystems', text: 'When wolves were removed from Yellowstone, the rivers actually changed course.', drivingQuestion: 'How can one species affect an entire ecosystem, including its physical features?' },
    { title: 'The Disappearing Island', focus: 'biodiversity', text: 'When invasive brown tree snakes arrived on Guam, most native bird species went extinct.', drivingQuestion: 'How can a single invasive species devastate an island ecosystem?' },
    { title: 'Cycling Populations', focus: 'organism-interactions', text: 'Snowshoe hare and lynx populations rise and fall in a regular 10-year cycle.', drivingQuestion: 'Why do predator and prey populations follow predictable cycles?' },
  ],
  'grade-8': [
    { title: 'Tongue Rolling Mystery', focus: 'genetics', text: 'Some people can roll their tongue and others cannot, even in the same family.', drivingQuestion: 'Why do siblings with the same parents sometimes have different traits?' },
    { title: 'The Identical Twins', focus: 'heredity', text: 'Identical twins have the same DNA but can have different fingerprints, heights, and personalities.', drivingQuestion: 'If genes determine traits, why are identical twins not truly identical?' },
    { title: 'Whale Hip Bones', focus: 'evolution', text: 'Whales have tiny hip bones hidden inside their bodies that serve no purpose.', drivingQuestion: 'Why would an ocean animal have leg bones it never uses?' },
    { title: 'The Peppered Moths', focus: 'evolution', text: 'During the Industrial Revolution, dark-colored peppered moths became more common than light-colored ones.', drivingQuestion: 'How can a population change over time without any individual organism changing?' },
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

function generateExercise(grade, skill, count = 5) {
  const bank = QUESTION_BANKS[grade]?.[skill];
  if (!bank || !bank.questions) return { error: `No question bank for ${grade}/${skill}` };

  const items = pick(bank.questions, count).map(q => ({
    prompt: q.q,
    answer: Array.isArray(q.a) ? q.a[0] : q.a,
    acceptedAnswers: Array.isArray(q.a) ? q.a : [q.a],
    type: q.type,
  }));

  return { type: 'life-science', skill, grade, count: items.length, instruction: 'Answer each question about life science.', items };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(r => norm(r) === norm(answer));
  if (type === 'tf') return norm(expected) === norm(answer);
  return norm(expected) === norm(answer);
}

// Public API

class MSLifeScience {
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
    const grade = p.grade || 'grade-6';
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
    const grade = p.grade || 'grade-6';
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

  getPhenomenon(grade) {
    const phenom = PHENOMENA[grade];
    if (!phenom) return { error: `No phenomena for ${grade}. Available: ${Object.keys(PHENOMENA).join(', ')}` };
    return pick(phenom, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-6';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const phenom = PHENOMENA[grade] ? pick(PHENOMENA[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, phenomenon: phenom,
      lessonPlan: {
        engage: phenom ? `Phenomenon: ${phenom.title} — ${phenom.drivingQuestion}` : 'Explore a puzzling life science observation',
        explore: `Investigate: ${target.category} > ${target.skill}`,
        explain: `Build understanding with ${exercise.count || 0} practice items`,
        elaborate: 'Apply knowledge to a new biological context',
        evaluate: 'Check understanding with CER response or self-assessment',
      },
    };
  }
}

module.exports = MSLifeScience;

// CLI: node life-science.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new MSLifeScience();
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
        const grade = loadProfile(id).grade || 'grade-6';
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
      case 'phenomenon': { const [, g] = args; if (!g) throw new Error('Usage: phenomenon <grade>'); out(api.getPhenomenon(g)); break; }
      default: out({ usage: 'node life-science.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','phenomenon'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
