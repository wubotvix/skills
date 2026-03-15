// eClaw MS Scientific Reasoning Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-science-reasoning');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'patterns': ['identifying-patterns', 'classifying-patterns', 'using-patterns-to-predict'],
    'cause-and-effect': ['identifying-cause-effect', 'multiple-causes', 'chain-of-events'],
    'simple-cer': ['writing-claims', 'identifying-evidence', 'basic-reasoning'],
    'systems-intro': ['system-components', 'inputs-outputs', 'system-boundaries'],
  },
  'grade-7': {
    'systems-thinking': ['feedback-loops', 'emergent-properties', 'system-models'],
    'energy-matter': ['energy-flow', 'matter-cycling', 'conservation-laws'],
    'structure-function': ['form-follows-function', 'adaptations', 'design-purpose'],
    'model-reasoning': ['using-models', 'model-limitations', 'revising-models'],
  },
  'grade-8': {
    'scale-proportion': ['orders-of-magnitude', 'scale-models', 'proportional-relationships'],
    'stability-change': ['equilibrium', 'rates-of-change', 'tipping-points'],
    'evaluating-arguments': ['argument-structure', 'counterarguments', 'evidence-quality'],
    'reasoning-errors': ['correlation-vs-causation', 'logical-fallacies', 'overgeneralization'],
  },
};

const QUESTION_BANKS = {
  'grade-6': {
    'identifying-patterns': {
      questions: [
        { q: 'Temperatures recorded over a week: 68, 72, 75, 71, 69, 73, 76. What pattern do you notice?', a: 'temperatures fluctuate but show a slight upward trend', type: 'open' },
        { q: 'What is a pattern in science?', a: 'a regular, repeated arrangement or sequence that can be observed in data or nature', type: 'open' },
        { q: 'Monarch butterflies migrate south every fall. What type of pattern is this?', a: 'cyclical or seasonal pattern', type: 'short' },
        { q: 'Why are patterns useful in science?', a: 'they help us make predictions and understand how things work', type: 'open' },
        { q: 'Earthquakes occur more frequently along plate boundaries. What CCC does this illustrate?', a: 'patterns', type: 'short' },
        { q: 'The periodic table organizes elements by repeating properties. What is this pattern called?', a: 'periodicity', type: 'short' },
      ],
    },
    'classifying-patterns': {
      questions: [
        { q: 'Is "day and night" a linear or cyclical pattern?', a: 'cyclical', type: 'short' },
        { q: 'Is population growth that doubles each generation linear or exponential?', a: 'exponential', type: 'short' },
        { q: 'Name the three main types of patterns.', a: 'linear, cyclical, and exponential', type: 'open' },
        { q: 'The phases of the moon repeat every 29.5 days. What type of pattern?', a: 'cyclical', type: 'short' },
        { q: 'A spring stretches proportionally to the force applied. What type of pattern?', a: 'linear', type: 'short' },
        { q: 'Bacteria doubling every 20 minutes. What type of pattern?', a: 'exponential', type: 'short' },
      ],
    },
    'using-patterns-to-predict': {
      questions: [
        { q: 'High tides occur roughly every 12.5 hours. If high tide is at 6 AM, when is the next?', a: '6:30 PM', type: 'short' },
        { q: 'How do scientists use patterns to make predictions?', a: 'by observing past trends and assuming similar conditions will produce similar results', type: 'open' },
        { q: 'A plant grows 2 cm per week. Predict its height after 6 weeks if it starts at 5 cm.', a: '17 cm', type: 'short' },
        { q: 'Can patterns always predict the future?', a: 'no — conditions may change, breaking the pattern', type: 'open' },
        { q: 'Weather forecasts use patterns from atmospheric data. Why are they sometimes wrong?', a: 'weather systems are complex and small changes can lead to different outcomes', type: 'open' },
        { q: 'If a volcano erupts every 50 years and last erupted 48 years ago, should people be concerned?', a: 'yes — the pattern suggests an eruption may be approaching, but patterns are not exact', type: 'open' },
      ],
    },
    'identifying-cause-effect': {
      questions: [
        { q: 'What is the difference between cause and effect?', a: 'a cause is what makes something happen; an effect is what happens as a result', type: 'open' },
        { q: 'A plant in a dark closet wilts. Identify cause and effect.', a: 'cause: lack of light; effect: plant wilts', type: 'open' },
        { q: 'How do scientists determine cause and effect?', a: 'through controlled experiments that isolate one variable at a time', type: 'open' },
        { q: 'Adding fertilizer makes plants grow taller. Which is the cause?', a: 'adding fertilizer', type: 'short' },
        { q: 'Can correlation prove causation?', a: 'no — two things happening together does not mean one caused the other', type: 'open' },
        { q: 'What signal words indicate cause and effect?', a: 'because, therefore, as a result, leads to, due to, consequently', type: 'open' },
      ],
    },
    'multiple-causes': {
      questions: [
        { q: 'Can an effect have more than one cause?', a: 'yes — most real-world effects have multiple contributing causes', type: 'open' },
        { q: 'A student does poorly on a test. What might be multiple causes?', a: 'lack of study, poor sleep, test anxiety, difficulty of material', type: 'open' },
        { q: 'A forest dies. Could this have multiple causes?', a: 'yes — drought, disease, pollution, and insects could all contribute', type: 'open' },
        { q: 'Why is it important to consider multiple causes in science?', a: 'oversimplifying to one cause can lead to incorrect conclusions', type: 'open' },
        { q: 'Climate change is caused by multiple factors. Name two.', a: 'burning fossil fuels and deforestation', type: 'open' },
        { q: 'What is a contributing factor?', a: 'a cause that helps produce an effect but may not be the only cause', type: 'open' },
      ],
    },
    'chain-of-events': {
      questions: [
        { q: 'What is a causal chain?', a: 'a series of events where each event causes the next one', type: 'open' },
        { q: 'Describe a causal chain: deforestation leads to...', a: 'soil erosion, which leads to sediment in rivers, which harms aquatic life', type: 'open' },
        { q: 'In a food chain, if rabbits disappear, what happens to foxes?', a: 'fox population decreases due to lack of food', type: 'open' },
        { q: 'The greenhouse effect is a causal chain. Describe it.', a: 'CO2 increases → more heat trapped → temperatures rise → ice melts → sea levels rise', type: 'open' },
        { q: 'Why are causal chains important in understanding environmental issues?', a: 'they show how one change can cascade through a system with far-reaching effects', type: 'open' },
        { q: 'Can a causal chain form a loop?', a: 'yes — this creates a feedback loop', type: 'short' },
      ],
    },
    'writing-claims': {
      questions: [
        { q: 'What is a scientific claim?', a: 'a statement that answers a question and can be supported by evidence', type: 'open' },
        { q: 'Write a claim: Does temperature affect how fast sugar dissolves?', a: 'Sugar dissolves faster in warmer water than in cooler water.', type: 'open' },
        { q: 'Should a claim be an opinion or supported by data?', a: 'supported by data', type: 'short' },
        { q: 'Is "I think plants need light" a strong scientific claim?', a: 'no — it sounds like an opinion, not a data-supported statement', type: 'open' },
        { q: 'Rewrite as a claim: "The experiment showed something about gravity."', a: 'Objects fall at the same rate regardless of mass when air resistance is eliminated.', type: 'open' },
        { q: 'Should a claim be specific or vague?', a: 'specific', type: 'short' },
      ],
    },
    'identifying-evidence': {
      questions: [
        { q: 'What counts as evidence in science?', a: 'data from observations, measurements, or experiments', type: 'open' },
        { q: 'A student claims plants need light. What evidence could support this?', a: 'data showing plants in light grew more than plants in darkness', type: 'open' },
        { q: 'Is "my friend told me" scientific evidence?', a: 'no — it is an anecdote, not systematic data', type: 'open' },
        { q: 'What makes evidence strong?', a: 'it is specific, measurable, reproducible, and relevant to the claim', type: 'open' },
        { q: 'Should evidence come before or after making a claim?', a: 'evidence should be gathered first, then used to support the claim', type: 'open' },
        { q: 'Can evidence disprove a claim?', a: 'yes — evidence that contradicts a claim weakens or refutes it', type: 'short' },
      ],
    },
    'basic-reasoning': {
      questions: [
        { q: 'What is reasoning in CER?', a: 'the scientific explanation that connects the evidence to the claim', type: 'open' },
        { q: 'Claim: Salt lowers the freezing point of water. Evidence: Saltwater froze at -2°C while pure water froze at 0°C. What is the reasoning?', a: 'Salt disrupts the crystal formation of ice, requiring lower temperatures for freezing.', type: 'open' },
        { q: 'Why is reasoning necessary? Why not just state the claim and evidence?', a: 'reasoning explains WHY the evidence supports the claim using scientific principles', type: 'open' },
        { q: 'Where does reasoning come from?', a: 'scientific principles, laws, or theories that explain the phenomenon', type: 'open' },
        { q: 'Is "because the data shows it" good reasoning?', a: 'no — reasoning should explain the mechanism, not just restate the evidence', type: 'open' },
        { q: 'Complete: The plant in light grew more (claim) because it produced 5 cm vs 1 cm (evidence) due to ___ (reasoning).', a: 'photosynthesis requiring light energy to produce food for growth', type: 'open' },
      ],
    },
    'system-components': {
      questions: [
        { q: 'What is a system?', a: 'a group of interacting parts that form a complex whole', type: 'open' },
        { q: 'Name the components of an ecosystem.', a: 'living organisms (biotic) and non-living elements (abiotic) like water, soil, sunlight', type: 'open' },
        { q: 'What is the difference between a system and its surroundings?', a: 'a system is the part being studied; surroundings are everything outside the system boundary', type: 'open' },
        { q: 'Is the human body a system?', a: 'yes — it has interacting organ systems that work together', type: 'short' },
        { q: 'Name two components of the water cycle system.', a: 'evaporation and precipitation', type: 'open' },
        { q: 'Can a system have sub-systems?', a: 'yes — for example, the digestive system is a sub-system of the human body', type: 'short' },
      ],
    },
    'inputs-outputs': {
      questions: [
        { q: 'What are inputs to a system?', a: 'energy, matter, or information that enters the system', type: 'open' },
        { q: 'What are outputs of a system?', a: 'energy, matter, or information that leaves the system', type: 'open' },
        { q: 'In photosynthesis, what are the inputs?', a: 'sunlight, water, and carbon dioxide', type: 'open' },
        { q: 'In photosynthesis, what are the outputs?', a: 'glucose and oxygen', type: 'open' },
        { q: 'A factory takes in raw materials and produces products. Identify inputs and outputs.', a: 'inputs: raw materials and energy; outputs: products and waste', type: 'open' },
        { q: 'Can an output of one system be an input to another?', a: 'yes — for example, oxygen from photosynthesis is an input for cellular respiration', type: 'short' },
      ],
    },
    'system-boundaries': {
      questions: [
        { q: 'What is a system boundary?', a: 'the dividing line between the system being studied and its surroundings', type: 'open' },
        { q: 'Why do scientists define system boundaries?', a: 'to focus on specific interactions and make the system manageable to study', type: 'open' },
        { q: 'Is an ecosystem boundary always sharp and clear?', a: 'no — ecosystem boundaries are often gradual and overlapping', type: 'open' },
        { q: 'What is an open system?', a: 'a system that exchanges both energy and matter with its surroundings', type: 'open' },
        { q: 'What is a closed system?', a: 'a system that exchanges energy but not matter with its surroundings', type: 'open' },
        { q: 'Is Earth a closed or open system for matter?', a: 'approximately closed — very little matter enters or leaves', type: 'short' },
      ],
    },
  },
  'grade-7': {
    'feedback-loops': {
      questions: [
        { q: 'What is a positive feedback loop?', a: 'a loop where the output amplifies the original change, making it bigger', type: 'open' },
        { q: 'What is a negative feedback loop?', a: 'a loop where the output counteracts the original change, restoring balance', type: 'open' },
        { q: 'Body temperature regulation (sweating when hot) is what type of feedback?', a: 'negative', type: 'short' },
        { q: 'Ice melting → less reflection → more warming → more melting. What type of feedback?', a: 'positive', type: 'short' },
        { q: 'Which feedback loop promotes stability?', a: 'negative feedback', type: 'short' },
        { q: 'Give an example of a positive feedback loop in nature.', a: 'melting permafrost releases methane, which causes more warming, which melts more permafrost', type: 'open' },
      ],
    },
    'emergent-properties': {
      questions: [
        { q: 'What is an emergent property?', a: 'a property of a system that its individual parts do not have', type: 'open' },
        { q: 'Water molecules are not wet individually. Wetness is a(n) ___ property.', a: 'emergent', type: 'short' },
        { q: 'Is consciousness an emergent property of brain cells?', a: 'yes — individual neurons do not have consciousness, but the brain as a system does', type: 'open' },
        { q: 'Why can you not predict emergent properties by studying parts alone?', a: 'emergent properties arise from interactions between parts, not from the parts themselves', type: 'open' },
        { q: 'A flock of birds creates complex patterns. Is this an emergent property?', a: 'yes — individual birds follow simple rules but the flock shows complex behavior', type: 'short' },
        { q: 'Give an example of an emergent property in ecosystems.', a: 'biodiversity, food web stability, or nutrient cycling', type: 'open' },
      ],
    },
    'system-models': {
      questions: [
        { q: 'Why do scientists use system models?', a: 'to represent complex systems, understand interactions, and make predictions', type: 'open' },
        { q: 'What should a system model include?', a: 'components, boundaries, inputs/outputs, and interactions between parts', type: 'open' },
        { q: 'A food web diagram is a model of what system?', a: 'an ecosystem\'s energy and matter flow through feeding relationships', type: 'open' },
        { q: 'Can a model perfectly represent a real system?', a: 'no — all models are simplifications', type: 'short' },
        { q: 'What is the advantage of a computer model over a physical model?', a: 'it can simulate changes over time and test many scenarios quickly', type: 'open' },
        { q: 'When should a model be revised?', a: 'when new data shows the model does not accurately represent or predict the system', type: 'open' },
      ],
    },
    'energy-flow': {
      questions: [
        { q: 'In an ecosystem, energy flows in what direction?', a: 'from the sun to producers to consumers — it flows one way', type: 'open' },
        { q: 'What happens to energy at each level of a food chain?', a: 'about 90% is lost as heat; only about 10% passes to the next level', type: 'open' },
        { q: 'Why are there fewer top predators than herbivores?', a: 'less energy is available at higher trophic levels', type: 'open' },
        { q: 'Does energy cycle or flow through ecosystems?', a: 'energy flows — it does not cycle', type: 'short' },
        { q: 'What is the ultimate source of energy for most ecosystems?', a: 'the sun', type: 'short' },
        { q: 'What happens to energy that is "lost" at each trophic level?', a: 'it is released as heat through cellular respiration', type: 'open' },
      ],
    },
    'matter-cycling': {
      questions: [
        { q: 'Does matter cycle or flow through ecosystems?', a: 'matter cycles — it is recycled and reused', type: 'short' },
        { q: 'Name two biogeochemical cycles.', a: 'carbon cycle and nitrogen cycle', type: 'open' },
        { q: 'How does decomposition contribute to matter cycling?', a: 'decomposers break down dead organisms and return nutrients to the soil', type: 'open' },
        { q: 'In the carbon cycle, how does carbon move from the atmosphere to living things?', a: 'through photosynthesis — plants absorb CO2', type: 'open' },
        { q: 'How does matter differ from energy in ecosystems?', a: 'matter is recycled and conserved; energy flows through and is eventually lost as heat', type: 'open' },
        { q: 'What role do bacteria play in the nitrogen cycle?', a: 'they convert nitrogen between forms that organisms can and cannot use', type: 'open' },
      ],
    },
    'conservation-laws': {
      questions: [
        { q: 'What is the law of conservation of mass?', a: 'matter cannot be created or destroyed in a chemical reaction', type: 'open' },
        { q: 'What is the law of conservation of energy?', a: 'energy cannot be created or destroyed, only transformed from one form to another', type: 'open' },
        { q: 'If 50g of reactants go into a reaction, how much product is formed?', a: '50g', type: 'short', hint: 'Mass is conserved' },
        { q: 'When wood burns, where does the mass go?', a: 'into gases (CO2, water vapor) and ash — total mass is conserved', type: 'open' },
        { q: 'A ball rolling downhill converts what type of energy to what?', a: 'potential energy to kinetic energy', type: 'open' },
        { q: 'If energy is conserved, why do we say we "use up" energy?', a: 'energy is transformed into less useful forms like heat, not destroyed', type: 'open' },
      ],
    },
    'form-follows-function': {
      questions: [
        { q: 'What does "structure determines function" mean?', a: 'the shape and composition of something determines what it can do', type: 'open' },
        { q: 'How does the structure of a bird wing relate to its function?', a: 'the curved shape creates lift, enabling flight', type: 'open' },
        { q: 'Red blood cells are disc-shaped. How does this help their function?', a: 'the shape increases surface area for oxygen exchange', type: 'open' },
        { q: 'Root hairs are long and thin. How does this structure help?', a: 'it increases surface area for absorbing water and nutrients', type: 'open' },
        { q: 'The heart has thick, muscular walls. Why?', a: 'to pump blood with enough force to circulate throughout the body', type: 'open' },
        { q: 'Give an example of structure-function in non-living systems.', a: 'a bridge\'s arch shape distributes weight evenly', type: 'open' },
      ],
    },
    'adaptations': {
      questions: [
        { q: 'What is an adaptation?', a: 'a trait that helps an organism survive and reproduce in its environment', type: 'open' },
        { q: 'Polar bears have thick fur. What is the function of this structure?', a: 'insulation to retain body heat in cold environments', type: 'open' },
        { q: 'Cacti have spines instead of leaves. What is the advantage?', a: 'reduces water loss through transpiration and deters herbivores', type: 'open' },
        { q: 'How does the structure-function CCC help explain adaptations?', a: 'adaptations are structures that evolved because their function improved survival', type: 'open' },
        { q: 'Is camouflage a structural or behavioral adaptation?', a: 'structural', type: 'short' },
        { q: 'Migration is what type of adaptation?', a: 'behavioral', type: 'short' },
      ],
    },
    'design-purpose': {
      questions: [
        { q: 'In engineering, how does structure relate to function?', a: 'engineers design structures specifically to perform intended functions', type: 'open' },
        { q: 'A thermos has a vacuum between two walls. What is the function?', a: 'to prevent heat transfer and keep liquids hot or cold', type: 'open' },
        { q: 'Why are airplane wings shaped like a curved airfoil?', a: 'the shape creates lower pressure above the wing, producing lift', type: 'open' },
        { q: 'How is engineering design similar to natural adaptation?', a: 'both match structure to function, but engineering is intentional while adaptation is through natural selection', type: 'open' },
        { q: 'A bridge uses triangles in its design. Why?', a: 'triangles distribute force evenly and are the strongest geometric shape', type: 'open' },
        { q: 'What is biomimicry?', a: 'designing solutions inspired by structures and functions found in nature', type: 'open' },
      ],
    },
    'using-models': {
      questions: [
        { q: 'How do scientists use models to explain phenomena?', a: 'models represent processes, relationships, or systems that are hard to observe directly', type: 'open' },
        { q: 'A Bohr model of an atom shows electrons in orbits. What does it help explain?', a: 'the arrangement of electrons and energy levels in an atom', type: 'open' },
        { q: 'How can models help predict outcomes?', a: 'by simulating conditions and showing what might happen under different scenarios', type: 'open' },
        { q: 'Climate models are used to predict future temperatures. What inputs do they need?', a: 'greenhouse gas levels, solar output, ocean patterns, and other factors', type: 'open' },
        { q: 'What is the difference between a descriptive model and a predictive model?', a: 'descriptive models explain current phenomena; predictive models forecast future outcomes', type: 'open' },
        { q: 'Why do scientists use multiple models for the same system?', a: 'different models capture different aspects or levels of detail', type: 'open' },
      ],
    },
    'model-limitations': {
      questions: [
        { q: 'Why are all models incomplete?', a: 'they simplify reality and cannot include every variable or interaction', type: 'open' },
        { q: 'A food chain model is simpler than a food web. What is lost?', a: 'the complexity of multiple feeding relationships and interconnections', type: 'open' },
        { q: 'Can models be wrong?', a: 'yes — models are approximations that may not match reality in all cases', type: 'short' },
        { q: 'What famous saying about models captures their limitation?', a: 'All models are wrong, but some are useful.', type: 'open' },
        { q: 'A flat map of Earth distorts shapes and sizes. What is this an example of?', a: 'model limitation — the 2D map cannot perfectly represent a 3D sphere', type: 'open' },
        { q: 'How do scientists deal with model limitations?', a: 'by acknowledging limitations, comparing multiple models, and updating models with new data', type: 'open' },
      ],
    },
    'revising-models': {
      questions: [
        { q: 'When should a scientific model be revised?', a: 'when new evidence shows the model does not accurately explain or predict observations', type: 'open' },
        { q: 'The model of the atom changed from Thomson to Bohr to quantum. Why?', a: 'new experimental evidence required better explanations', type: 'open' },
        { q: 'Is model revision a sign of weakness in science?', a: 'no — it is a strength that shows science is self-correcting', type: 'open' },
        { q: 'What might prompt revision of a climate model?', a: 'unexpected temperature data, new understanding of feedback loops, or improved computing', type: 'open' },
        { q: 'How does peer review contribute to model revision?', a: 'other scientists identify weaknesses and suggest improvements', type: 'open' },
        { q: 'Can a model ever be "finished" or perfect?', a: 'no — models can always be improved as knowledge grows', type: 'short' },
      ],
    },
  },
  'grade-8': {
    'orders-of-magnitude': {
      questions: [
        { q: 'What is an order of magnitude?', a: 'a factor of ten — a way to compare the relative size of numbers', type: 'open' },
        { q: 'An atom is about 10^-10 m. A cell is about 10^-5 m. How many orders of magnitude apart?', a: '5', type: 'short' },
        { q: 'Why is understanding scale important in science?', a: 'many phenomena occur at scales very different from human experience', type: 'open' },
        { q: 'Earth is about 10^7 m in diameter. The sun is about 10^9 m. How many times larger is the sun?', a: 'about 100 times (2 orders of magnitude)', type: 'open' },
        { q: 'A bacterium is about 10^-6 m. A virus is about 10^-8 m. Which is larger?', a: 'the bacterium', type: 'short' },
        { q: 'Why do scientists use powers of 10?', a: 'to express very large or very small numbers concisely', type: 'open' },
      ],
    },
    'scale-models': {
      questions: [
        { q: 'What is the purpose of a scale model?', a: 'to represent something that is too large or too small to study at actual size', type: 'open' },
        { q: 'A model of the solar system cannot show planets and distances at the same scale. Why?', a: 'the distances are so much larger than the planet sizes that one or the other would be invisible', type: 'open' },
        { q: 'How does scale affect the properties we can observe?', a: 'properties like surface tension, gravity effects, and heat transfer behave differently at different scales', type: 'open' },
        { q: 'Why does a model cell need to be scaled up?', a: 'real cells are too small to see details without magnification', type: 'open' },
        { q: 'A map with scale 1:100,000 means 1 cm on the map equals what?', a: '1 km in reality (100,000 cm = 1 km)', type: 'short' },
        { q: 'What is lost when you scale down a model?', a: 'fine details and the true behavior of materials at the original scale', type: 'open' },
      ],
    },
    'proportional-relationships': {
      questions: [
        { q: 'What is a proportional relationship?', a: 'when two quantities change at a constant rate relative to each other', type: 'open' },
        { q: 'As the radius of a circle doubles, what happens to the area?', a: 'it quadruples (increases by a factor of 4)', type: 'open' },
        { q: 'Surface area increases as the square, but volume increases as the cube. Why does this matter for organisms?', a: 'larger organisms have relatively less surface area for their volume, affecting heat loss and nutrient absorption', type: 'open' },
        { q: 'Why can an elephant not be scaled up to twice its size and function normally?', a: 'its legs would need to be proportionally much thicker to support the increased weight', type: 'open' },
        { q: 'In the equation F = ma, what happens to force if mass doubles?', a: 'force doubles (direct proportion)', type: 'short' },
        { q: 'Why does the surface-area-to-volume ratio matter in biology?', a: 'it affects how efficiently organisms exchange materials and regulate temperature', type: 'open' },
      ],
    },
    'equilibrium': {
      questions: [
        { q: 'What is equilibrium in a system?', a: 'a state where opposing forces or processes are balanced and the system is stable', type: 'open' },
        { q: 'Is a population at carrying capacity in equilibrium?', a: 'yes — births and deaths are roughly equal', type: 'short' },
        { q: 'What is dynamic equilibrium?', a: 'a state where processes continue but the overall state remains stable', type: 'open' },
        { q: 'How does negative feedback maintain equilibrium?', a: 'it counteracts changes, pushing the system back toward the set point', type: 'open' },
        { q: 'What can disrupt an ecosystem equilibrium?', a: 'invasive species, natural disasters, climate change, or human activity', type: 'open' },
        { q: 'Is the temperature of a healthy human body an example of equilibrium?', a: 'yes — the body maintains ~37°C through homeostasis', type: 'short' },
      ],
    },
    'rates-of-change': {
      questions: [
        { q: 'What is a rate of change?', a: 'how quickly a quantity changes over time', type: 'open' },
        { q: 'If a glacier retreats 10 meters per year, what is its rate of change?', a: '-10 meters per year', type: 'short' },
        { q: 'Why is rate of change important for understanding climate change?', a: 'the speed of change determines whether organisms and systems can adapt', type: 'open' },
        { q: 'A population grows slowly at first, then rapidly. What does this pattern suggest?', a: 'exponential growth — the rate of change itself is increasing', type: 'open' },
        { q: 'How do scientists measure rates of change in nature?', a: 'by comparing measurements taken at different times', type: 'open' },
        { q: 'Can a rate of change be negative?', a: 'yes — it means the quantity is decreasing', type: 'short' },
      ],
    },
    'tipping-points': {
      questions: [
        { q: 'What is a tipping point?', a: 'a threshold beyond which a system changes dramatically and often irreversibly', type: 'open' },
        { q: 'Give an example of a tipping point in climate science.', a: 'the collapse of ice sheets, which accelerates sea level rise once a threshold is passed', type: 'open' },
        { q: 'Why are tipping points concerning?', a: 'once crossed, the system may not return to its original state even if conditions change back', type: 'open' },
        { q: 'A lake gradually becomes more polluted. Suddenly, all fish die. What happened?', a: 'the pollution crossed a tipping point where conditions became unlivable', type: 'open' },
        { q: 'How does stability relate to tipping points?', a: 'tipping points mark the boundary of a system\'s stability — beyond it, the system shifts to a new state', type: 'open' },
        { q: 'Can tipping points be predicted?', a: 'sometimes, with enough data and understanding of the system', type: 'open' },
      ],
    },
    'argument-structure': {
      questions: [
        { q: 'What are the three parts of a scientific argument?', a: 'claim, evidence, and reasoning', type: 'open' },
        { q: 'How is a scientific argument different from everyday arguing?', a: 'scientific arguments are based on evidence and logic, not emotions', type: 'open' },
        { q: 'What makes evidence relevant to a claim?', a: 'it directly supports or relates to the specific claim being made', type: 'open' },
        { q: 'How many pieces of evidence should a strong argument have?', a: 'multiple pieces from different sources', type: 'open' },
        { q: 'What role does reasoning play in connecting evidence to a claim?', a: 'it explains WHY the evidence supports the claim using scientific principles', type: 'open' },
        { q: 'Can two scientists look at the same evidence and reach different conclusions?', a: 'yes — which is why argumentation and peer review are important', type: 'short' },
      ],
    },
    'counterarguments': {
      questions: [
        { q: 'What is a counterargument?', a: 'an argument that opposes or challenges your claim', type: 'open' },
        { q: 'Why should you address counterarguments in your writing?', a: 'it strengthens your argument by showing you have considered alternative explanations', type: 'open' },
        { q: 'How do you respond to a counterargument?', a: 'acknowledge it, then explain why your evidence and reasoning are stronger', type: 'open' },
        { q: 'Is ignoring counterarguments a sign of a strong or weak argument?', a: 'weak — strong arguments address opposing views', type: 'short' },
        { q: 'A climate skeptic says "the climate has always changed." How do you respond?', a: 'acknowledge natural cycles, then show evidence that current rate and cause (human CO2) are unprecedented', type: 'open' },
        { q: 'Can a counterargument actually improve your understanding?', a: 'yes — considering alternative views helps refine your thinking', type: 'short' },
      ],
    },
    'evidence-quality': {
      questions: [
        { q: 'What makes evidence high quality?', a: 'it is specific, measurable, reproducible, recent, and from a credible source', type: 'open' },
        { q: 'Which is stronger evidence: one person\'s testimony or a controlled study with 1000 participants?', a: 'the controlled study', type: 'short' },
        { q: 'What is anecdotal evidence?', a: 'evidence based on personal experience rather than systematic study', type: 'open' },
        { q: 'Why is peer-reviewed evidence considered more reliable?', a: 'it has been evaluated by experts for methodology and validity', type: 'open' },
        { q: 'Sample size of 5 vs. 500: which provides stronger evidence?', a: '500 — larger samples are more reliable', type: 'short' },
        { q: 'How does replication affect evidence quality?', a: 'results that can be replicated are more trustworthy', type: 'open' },
      ],
    },
    'correlation-vs-causation': {
      questions: [
        { q: 'What is the difference between correlation and causation?', a: 'correlation means two things happen together; causation means one causes the other', type: 'open' },
        { q: 'Ice cream sales and drowning rates both increase in summer. Does ice cream cause drowning?', a: 'no — both are caused by a third variable: hot weather', type: 'open' },
        { q: 'What is a confounding variable?', a: 'a hidden variable that affects both the observed variables, creating a false association', type: 'open' },
        { q: 'How can scientists establish causation?', a: 'through controlled experiments that isolate variables', type: 'open' },
        { q: '"Countries with more TVs have higher life expectancy." Does TV cause longer life?', a: 'no — wealth is likely the confounding variable that correlates with both', type: 'open' },
        { q: 'What phrase summarizes this concept?', a: 'correlation does not imply causation', type: 'open' },
      ],
    },
    'logical-fallacies': {
      questions: [
        { q: 'What is a logical fallacy?', a: 'an error in reasoning that makes an argument invalid', type: 'open' },
        { q: '"Everyone believes it, so it must be true." What fallacy is this?', a: 'appeal to popularity (bandwagon)', type: 'short' },
        { q: '"A famous actor says this diet works." What fallacy?', a: 'appeal to authority (the actor is not a nutrition expert)', type: 'short' },
        { q: '"We cannot prove aliens do NOT exist, so they must exist." What fallacy?', a: 'argument from ignorance', type: 'short' },
        { q: '"After I wore my lucky socks, I aced the test." What fallacy?', a: 'post hoc (confusing correlation with causation)', type: 'short' },
        { q: 'Why is recognizing fallacies important in science?', a: 'to evaluate arguments critically and avoid being misled', type: 'open' },
      ],
    },
    'overgeneralization': {
      questions: [
        { q: 'What is overgeneralization?', a: 'drawing a broad conclusion from too little evidence', type: 'open' },
        { q: '"I met two rude people from that city, so everyone there is rude." Is this valid reasoning?', a: 'no — it is overgeneralization from a tiny sample', type: 'open' },
        { q: '"All swans are white" was believed until black swans were found in Australia. What error was this?', a: 'overgeneralization — the conclusion was based on limited observation', type: 'open' },
        { q: 'How can you avoid overgeneralization in science?', a: 'use large, representative samples and limit conclusions to what the data supports', type: 'open' },
        { q: 'A study of 10 college students claims to represent all humans. What is the problem?', a: 'the sample is too small and not representative of the whole population', type: 'open' },
        { q: 'What is the difference between "some" and "all" in scientific claims?', a: 'responsible science uses qualifiers like "some," "many," or "often" rather than absolute claims', type: 'open' },
      ],
    },
  },
};

const SCENARIOS = {
  'grade-6': [
    { title: 'The Pond Mystery', focus: 'cause and effect + systems', text: 'A local pond that used to have clear water and many fish now has green, murky water and few fish. Nearby, a new housing development was built and a farm expanded. Using cause and effect reasoning, create a causal chain explaining what might have happened. Identify the system, its components, inputs, and outputs.' },
    { title: 'The Pattern Detective', focus: 'patterns + CER', text: 'A student measures the height of a bean plant every day for 3 weeks. Growth: Week 1: 1cm/day, Week 2: 2cm/day, Week 3: 0.5cm/day. Write a CER: What pattern do you notice? What evidence supports your claim? What scientific reasoning explains the pattern?' },
  ],
  'grade-7': [
    { title: 'The Island Ecosystem', focus: 'systems + energy/matter', text: 'An island has plants, rabbits, and foxes. A disease kills most of the foxes. Using systems thinking, energy flow, and matter cycling: What happens to the rabbit population? The plant population? What feedback loops are involved? Draw a system model.' },
    { title: 'The Bridge Challenge', focus: 'structure-function + models', text: 'Design a bridge using only paper that can hold the most weight. How does the structure of your bridge relate to its function? Build a model. What are the limitations of your model? How would you revise it after testing?' },
  ],
  'grade-8': [
    { title: 'The Climate Debate', focus: 'arguments + reasoning errors', text: 'Read these two arguments: (1) "Climate change is natural because the climate has always changed." (2) "Current warming is mostly human-caused because CO2 levels are higher than any time in 800,000 years and correlate with fossil fuel use." Evaluate both arguments for logical fallacies, evidence quality, and reasoning. Which is stronger? Why?' },
    { title: 'The Ecosystem Tipping Point', focus: 'stability/change + scale', text: 'A coral reef ecosystem is under stress from warming water (+1.5°C), ocean acidification (pH drop of 0.1), and overfishing (50% reduction). At what point does the system reach a tipping point? Consider: rates of change, scale, equilibrium, and feedback loops. What would recovery look like?' },
  ],
};

// File I/O

function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }
function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }
function loadProfile(id) { const fp = profilePath(id); if (fs.existsSync(fp)) { try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); } } return { studentId: id, grade: null, createdAt: new Date().toISOString(), assessments: [], skills: {} }; }
function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }
function calcMastery(attempts) { if (!attempts || !attempts.length) return 0; const recent = attempts.slice(-5).filter(a => a.total > 0); return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0; }
function masteryLabel(r) { return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started'; }
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }
function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

function generateExercise(grade, skill, count = 5) {
  const bank = QUESTION_BANKS[grade]?.[skill];
  if (!bank || !bank.questions) return { error: `No question bank for ${grade}/${skill}` };
  const items = pick(bank.questions, count).map(q => ({ prompt: q.q, answer: Array.isArray(q.a) ? q.a[0] : q.a, acceptedAnswers: Array.isArray(q.a) ? q.a : [q.a], type: q.type || 'short', ...(q.hint && { hint: q.hint }) }));
  return { type: 'reasoning', skill, grade, count: items.length, instruction: 'Answer each scientific reasoning question.', items };
}

function checkAnswer(type, expected, answer) { if (Array.isArray(expected)) return expected.some(r => norm(r) === norm(answer)); return norm(expected) === norm(answer); }

class MSReasoning {
  getProfile(id) { const p = loadProfile(id); return { studentId: p.studentId, grade: p.grade, createdAt: p.createdAt, totalAssessments: p.assessments.length }; }
  setGrade(id, grade) { if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}. Valid: ${Object.keys(SKILLS).join(', ')}`); const p = loadProfile(id); p.grade = grade; saveProfile(p); return { studentId: id, grade }; }
  recordAssessment(id, grade, category, skill, score, total, notes = '') {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}`); if (!SKILLS[grade][category]) throw new Error(`Unknown category '${category}' for ${grade}`);
    if (!SKILLS[grade][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${grade}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive'); if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id); if (!p.grade) p.grade = grade;
    const entry = { date: new Date().toISOString(), grade, category, skill, score, total, notes }; p.assessments.push(entry);
    const key = `${grade}/${category}/${skill}`; if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total }); p.skills[key].mastery = calcMastery(p.skills[key].attempts); p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p); return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }
  getProgress(id) { const p = loadProfile(id); const grade = p.grade || 'grade-6'; const gs = SKILLS[grade] || {}; const results = {}; let mastered = 0, total = 0; for (const [cat, skills] of Object.entries(gs)) { results[cat] = {}; for (const sk of skills) { total++; const d = p.skills[`${grade}/${cat}/${sk}`]; results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' }; if (d && d.mastery >= MASTERY_THRESHOLD) mastered++; } } return { studentId: id, grade, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results }; }
  getNextSkills(id, count = 5) { const p = loadProfile(id); const grade = p.grade || 'grade-6'; const candidates = []; for (const [cat, skills] of Object.entries(SKILLS[grade] || {})) { for (const sk of skills) { const d = p.skills[`${grade}/${cat}/${sk}`]; const m = d ? d.mastery : 0; if (m < MASTERY_THRESHOLD) candidates.push({ grade, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' }); } } const order = { developing: 0, emerging: 1, 'not-started': 2 }; candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery); return { studentId: id, grade, next: candidates.slice(0, count) }; }
  getReport(id) { const p = loadProfile(id); return { studentId: id, grade: p.grade, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }
  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }
  getSkillCatalog(grade) { const gs = SKILLS[grade]; if (!gs) return { grade, error: `Unknown grade. Valid: ${Object.keys(SKILLS).join(', ')}` }; let total = 0; const catalog = {}; for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; } return { grade, skills: catalog, totalSkills: total }; }
  generateExercise(grade, skill, count = 5) { return generateExercise(grade, skill, count); }
  checkAnswer(type, expected, answer) { let exp = expected; if (typeof exp === 'string') { const bank = Object.values(QUESTION_BANKS).flatMap(g => Object.values(g)).find(b => b.questions?.some(q => q.a === exp)); if (bank) { const q = bank.questions.find(q => q.a === exp); if (q && Array.isArray(q.a)) exp = q.a; } } return { correct: checkAnswer(type, exp, answer), expected, studentAnswer: answer }; }
  getScenario(grade) { const scenarios = SCENARIOS[grade]; if (!scenarios) return { error: `No scenarios for ${grade}. Available: ${Object.keys(SCENARIOS).join(', ')}` }; return pick(scenarios, 1)[0]; }
  generateLesson(id) {
    const p = loadProfile(id); const grade = p.grade || 'grade-6'; const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5); const scenario = SCENARIOS[grade] ? pick(SCENARIOS[grade], 1)[0] : null;
    return { studentId: id, grade, targetSkill: target, exercise, scenario, lessonPlan: { hook: `Reasoning scenario related to: ${target.category} - ${target.skill}`, teach: `Introduce/reinforce: ${target.category} > ${target.skill}`, practice: `Complete ${exercise.count || 0} practice items`, apply: scenario ? `Apply reasoning to: "${scenario.title}"` : 'Practice reasoning across domains', reflect: 'What reasoning pattern did you use? Where else could you apply it?' } };
  }
}

module.exports = MSReasoning;

if (require.main === module) {
  const args = process.argv.slice(2); const cmd = args[0]; const api = new MSReasoning(); const out = d => console.log(JSON.stringify(d, null, 2));
  try {
    switch (cmd) {
      case 'start': { const [, id, grade] = args; if (!id) throw new Error('Usage: start <id> [grade]'); if (grade) api.setGrade(id, grade); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const grade = loadProfile(id).grade || 'grade-6'; if (skill) { out(api.generateExercise(grade, skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current grade!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); let exp = expected; try { exp = JSON.parse(expected); } catch {} out(api.checkAnswer(type, exp, answer)); break; }
      case 'record': { const [, id, grade, cat, skill, sc, tot, ...notes] = args; if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]'); out(api.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? api.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(api.setGrade(id, g)); break; }
      case 'scenario': { const [, g] = args; if (!g) throw new Error('Usage: scenario <grade>'); out(api.getScenario(g)); break; }
      default: out({ usage: 'node reasoning.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','scenario'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
