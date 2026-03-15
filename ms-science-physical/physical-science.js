// eClaw MS Physical Science Interactive Tutor (6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-science-physical');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'matter': ['atomic-structure', 'elements-periodic-table', 'molecules-compounds', 'states-of-matter'],
    'changes': ['physical-vs-chemical', 'conservation-of-mass', 'thermal-energy-particles'],
  },
  'grade-7': {
    'forces': ['speed-velocity', 'acceleration', 'newtons-first-law', 'newtons-second-law', 'newtons-third-law'],
    'interactions': ['balanced-unbalanced-forces', 'gravity', 'friction', 'electric-magnetic-forces'],
  },
  'grade-8': {
    'energy': ['kinetic-energy', 'potential-energy', 'energy-transfer', 'energy-transformation', 'conservation-of-energy', 'thermal-energy-transfer'],
    'waves': ['wave-properties', 'transverse-longitudinal', 'wave-behavior', 'em-spectrum', 'sound-waves', 'digital-analog'],
  },
};

const QUESTION_BANKS = {
  'grade-6': {
    'atomic-structure': {
      questions: [
        { q: 'What are the three subatomic particles?', a: 'protons, neutrons, and electrons', type: 'short' },
        { q: 'Which subatomic particle has a positive charge?', a: 'proton', type: 'short' },
        { q: 'Which subatomic particle has a negative charge?', a: 'electron', type: 'short' },
        { q: 'Which subatomic particle has no charge?', a: 'neutron', type: 'short' },
        { q: 'What defines which element an atom is?', a: 'the number of protons', type: 'short' },
        { q: 'Where are protons and neutrons located in an atom?', a: 'nucleus', type: 'short' },
        { q: 'Where are electrons located in an atom?', a: 'orbiting the nucleus in electron clouds', type: 'open' },
        { q: 'What is the atomic number?', a: 'the number of protons in an atom', type: 'open' },
      ],
    },
    'elements-periodic-table': {
      questions: [
        { q: 'What is an element?', a: 'a pure substance made of only one type of atom', type: 'open' },
        { q: 'How are elements organized in the periodic table?', a: 'by atomic number and similar properties', type: 'open' },
        { q: 'What do elements in the same column (group) have in common?', a: 'similar chemical properties', type: 'short' },
        { q: 'What is the chemical symbol for oxygen?', a: 'O', type: 'short' },
        { q: 'What is the chemical symbol for gold?', a: 'Au', type: 'short' },
        { q: 'Are metals found on the left or right side of the periodic table?', a: 'left', type: 'short' },
        { q: 'Name a property of metals.', a: ['shiny', 'conductive', 'malleable', 'ductile'], type: 'multi' },
        { q: 'True or false: All atoms of the same element are identical in number of protons.', a: 'true', type: 'tf' },
      ],
    },
    'molecules-compounds': {
      questions: [
        { q: 'What is a molecule?', a: 'two or more atoms bonded together', type: 'open' },
        { q: 'What is a compound?', a: 'a substance made of two or more different elements chemically bonded', type: 'open' },
        { q: 'What does the formula H2O tell you?', a: '2 hydrogen atoms and 1 oxygen atom', type: 'short' },
        { q: 'What does CO2 stand for?', a: 'carbon dioxide (1 carbon and 2 oxygen atoms)', type: 'open' },
        { q: 'Is O2 a compound or just a molecule?', a: 'just a molecule (only one element)', type: 'open' },
        { q: 'True or false: A compound can be separated by physical means.', a: 'false', type: 'tf' },
        { q: 'What holds atoms together in a molecule?', a: ['chemical bonds', 'bonds'], type: 'multi' },
        { q: 'What is NaCl?', a: ['sodium chloride', 'table salt', 'salt'], type: 'multi' },
      ],
    },
    'states-of-matter': {
      questions: [
        { q: 'What are the three common states of matter?', a: 'solid, liquid, and gas', type: 'short' },
        { q: 'In which state are particles packed tightly and vibrate in place?', a: 'solid', type: 'short' },
        { q: 'In which state do particles move freely and spread out?', a: 'gas', type: 'short' },
        { q: 'What happens to particle motion when temperature increases?', a: 'particles move faster', type: 'short' },
        { q: 'What is the change from solid to liquid called?', a: 'melting', type: 'short' },
        { q: 'What is the change from liquid to gas called?', a: ['evaporation', 'boiling', 'vaporization'], type: 'multi' },
        { q: 'What is the change from gas to liquid called?', a: 'condensation', type: 'short' },
        { q: 'What is sublimation?', a: 'the change from solid directly to gas', type: 'open' },
      ],
    },
    'physical-vs-chemical': {
      questions: [
        { q: 'What is a physical change?', a: 'a change in appearance or form but not in chemical composition', type: 'open' },
        { q: 'What is a chemical change?', a: 'a change that produces one or more new substances', type: 'open' },
        { q: 'Is dissolving sugar in water a physical or chemical change?', a: 'physical', type: 'short' },
        { q: 'Is burning wood a physical or chemical change?', a: 'chemical', type: 'short' },
        { q: 'Name a sign of a chemical change.', a: ['color change', 'gas production', 'temperature change', 'precipitate', 'light production', 'odor change'], type: 'multi' },
        { q: 'Is cutting paper a physical or chemical change?', a: 'physical', type: 'short' },
        { q: 'Is rusting iron a physical or chemical change?', a: 'chemical', type: 'short' },
        { q: 'True or false: A physical change creates new substances.', a: 'false', type: 'tf' },
      ],
    },
    'conservation-of-mass': {
      questions: [
        { q: 'What does the law of conservation of mass state?', a: 'matter cannot be created or destroyed in a chemical reaction', type: 'open' },
        { q: 'If 10g of reactants enter a reaction, how many grams of products are formed?', a: '10', type: 'short' },
        { q: 'In a balanced equation, what is equal on both sides?', a: 'the number of atoms of each element', type: 'open' },
        { q: 'True or false: Atoms are destroyed during a chemical reaction.', a: 'false', type: 'tf' },
        { q: 'If a sealed bag gains no mass after a reaction inside, what does that demonstrate?', a: 'conservation of mass', type: 'short' },
        { q: 'Why does burning wood seem to lose mass?', a: 'gases (CO2, water vapor) escape into the air but total mass is conserved', type: 'open' },
        { q: 'What happens to atoms during a chemical reaction?', a: 'they rearrange into new combinations but are not created or destroyed', type: 'open' },
        { q: 'Who is credited with discovering the law of conservation of mass?', a: ['Lavoisier', 'Antoine Lavoisier'], type: 'multi' },
      ],
    },
    'thermal-energy-particles': {
      questions: [
        { q: 'What does temperature measure at the particle level?', a: 'the average kinetic energy of particles', type: 'open' },
        { q: 'What is thermal energy?', a: 'the total kinetic energy of all particles in a substance', type: 'open' },
        { q: 'What happens to particles when thermal energy is added?', a: 'they move faster', type: 'short' },
        { q: 'What is an endothermic reaction?', a: 'a reaction that absorbs energy from the surroundings', type: 'open' },
        { q: 'What is an exothermic reaction?', a: 'a reaction that releases energy to the surroundings', type: 'open' },
        { q: 'Is melting ice endothermic or exothermic?', a: 'endothermic', type: 'short' },
        { q: 'Is burning fuel endothermic or exothermic?', a: 'exothermic', type: 'short' },
        { q: 'True or false: Heat is a substance that flows into objects.', a: 'false', type: 'tf' },
      ],
    },
  },
  'grade-7': {
    'speed-velocity': {
      questions: [
        { q: 'What is the formula for speed?', a: 'speed = distance / time', type: 'short' },
        { q: 'A car travels 100 meters in 5 seconds. What is its speed?', a: '20 m/s', type: 'short' },
        { q: 'What is the difference between speed and velocity?', a: 'velocity includes direction; speed does not', type: 'open' },
        { q: 'What are the standard units for speed?', a: ['m/s', 'meters per second'], type: 'multi' },
        { q: 'A runner covers 400m in 50s. What is her speed?', a: '8 m/s', type: 'short' },
        { q: 'True or false: An object moving at constant speed in a circle has constant velocity.', a: 'false', type: 'tf' },
        { q: 'On a distance-time graph, what does a steeper line mean?', a: 'faster speed', type: 'short' },
        { q: 'What does a flat line on a distance-time graph mean?', a: 'the object is not moving', type: 'short' },
      ],
    },
    'acceleration': {
      questions: [
        { q: 'What is acceleration?', a: 'a change in velocity over time', type: 'open' },
        { q: 'What are the units of acceleration?', a: ['m/s^2', 'meters per second squared'], type: 'multi' },
        { q: 'A car goes from 0 to 20 m/s in 4 seconds. What is its acceleration?', a: '5 m/s^2', type: 'short' },
        { q: 'Is slowing down a form of acceleration?', a: 'yes', type: 'short' },
        { q: 'What is negative acceleration (deceleration)?', a: 'a decrease in speed over time', type: 'open' },
        { q: 'True or false: An object can accelerate by changing direction without changing speed.', a: 'true', type: 'tf' },
        { q: 'What causes acceleration?', a: 'an unbalanced force', type: 'short' },
        { q: 'On a speed-time graph, what does a horizontal line represent?', a: 'constant speed (zero acceleration)', type: 'short' },
      ],
    },
    'newtons-first-law': {
      questions: [
        { q: 'State Newton\'s first law of motion.', a: 'an object at rest stays at rest and an object in motion stays in motion unless acted on by an unbalanced force', type: 'open' },
        { q: 'What is another name for Newton\'s first law?', a: 'law of inertia', type: 'short' },
        { q: 'What is inertia?', a: 'the tendency of an object to resist changes in its motion', type: 'open' },
        { q: 'Why do passengers lurch forward when a car stops suddenly?', a: 'their body has inertia and tends to keep moving forward', type: 'open' },
        { q: 'Does a heavier object have more or less inertia?', a: 'more', type: 'short' },
        { q: 'True or false: A force is needed to keep an object moving at constant speed on a frictionless surface.', a: 'false', type: 'tf' },
        { q: 'What is the role of friction in Newton\'s first law?', a: 'friction is an unbalanced force that slows objects down', type: 'open' },
        { q: 'A book on a table is not moving. Are forces acting on it?', a: 'yes, balanced forces (gravity and normal force)', type: 'open' },
      ],
    },
    'newtons-second-law': {
      questions: [
        { q: 'What is the formula for Newton\'s second law?', a: 'F = m x a', type: 'short' },
        { q: 'What force is needed to accelerate a 10 kg cart at 3 m/s^2?', a: '30 N', type: 'short' },
        { q: 'If force stays the same but mass doubles, what happens to acceleration?', a: 'it is halved', type: 'short' },
        { q: 'If mass stays the same but force doubles, what happens to acceleration?', a: 'it doubles', type: 'short' },
        { q: 'What is the unit of force?', a: ['Newton', 'N', 'Newtons'], type: 'multi' },
        { q: 'A 5 N force accelerates a 1 kg object. What is the acceleration?', a: '5 m/s^2', type: 'short' },
        { q: 'True or false: A heavier object needs more force to achieve the same acceleration.', a: 'true', type: 'tf' },
        { q: 'What is the relationship between force, mass, and acceleration?', a: 'force equals mass times acceleration', type: 'short' },
      ],
    },
    'newtons-third-law': {
      questions: [
        { q: 'State Newton\'s third law.', a: 'for every action there is an equal and opposite reaction', type: 'open' },
        { q: 'If you push on a wall with 10 N, how much force does the wall push back with?', a: '10 N', type: 'short' },
        { q: 'When you jump, what pushes you upward?', a: 'the ground pushes you upward as a reaction to you pushing down on the ground', type: 'open' },
        { q: 'True or false: Action and reaction forces act on the same object.', a: 'false', type: 'tf' },
        { q: 'A swimmer pushes water backward. What is the reaction force?', a: 'the water pushes the swimmer forward', type: 'open' },
        { q: 'Why don\'t action-reaction forces cancel each other out?', a: 'they act on different objects', type: 'open' },
        { q: 'A rocket pushes exhaust gases downward. What is the reaction?', a: 'the gases push the rocket upward', type: 'open' },
        { q: 'When you sit in a chair, your weight pushes down. What is the reaction force?', a: 'the chair pushes up on you (normal force)', type: 'open' },
      ],
    },
    'balanced-unbalanced-forces': {
      questions: [
        { q: 'What happens to an object when forces are balanced?', a: 'it stays at rest or continues moving at constant velocity', type: 'open' },
        { q: 'What happens to an object when forces are unbalanced?', a: 'it accelerates (changes speed or direction)', type: 'open' },
        { q: 'A box has 10 N pushing right and 10 N pushing left. Is it balanced or unbalanced?', a: 'balanced', type: 'short' },
        { q: 'A box has 15 N pushing right and 10 N pushing left. What is the net force?', a: '5 N to the right', type: 'short' },
        { q: 'What is net force?', a: 'the overall force on an object after all forces are combined', type: 'open' },
        { q: 'True or false: An object with balanced forces has zero net force.', a: 'true', type: 'tf' },
        { q: 'Can an object be moving with balanced forces acting on it?', a: 'yes, at constant velocity', type: 'short' },
        { q: 'What is a free-body diagram?', a: 'a diagram showing all forces acting on an object', type: 'open' },
      ],
    },
    'gravity': {
      questions: [
        { q: 'What is gravity?', a: 'the attractive force between all objects with mass', type: 'open' },
        { q: 'What two factors affect gravitational force?', a: 'mass and distance', type: 'short' },
        { q: 'What is the acceleration due to gravity on Earth?', a: ['9.8 m/s^2', '9.8'], type: 'multi' },
        { q: 'What is the difference between mass and weight?', a: 'mass is the amount of matter; weight is the force of gravity on an object', type: 'open' },
        { q: 'What are the units of weight?', a: ['Newtons', 'N'], type: 'multi' },
        { q: 'What is the formula for weight?', a: 'W = m x g', type: 'short' },
        { q: 'True or false: A heavier object falls faster than a lighter object in a vacuum.', a: 'false', type: 'tf' },
        { q: 'Would you weigh more or less on the Moon?', a: 'less', type: 'short' },
      ],
    },
    'friction': {
      questions: [
        { q: 'What is friction?', a: 'a force that opposes motion between surfaces in contact', type: 'open' },
        { q: 'Does friction speed up or slow down objects?', a: 'slow down', type: 'short' },
        { q: 'Name a factor that affects the amount of friction.', a: ['surface roughness', 'force pressing surfaces together', 'type of surface'], type: 'multi' },
        { q: 'Is friction always harmful?', a: 'no, friction is needed for walking, gripping, and braking', type: 'open' },
        { q: 'What are two ways to reduce friction?', a: ['lubrication', 'smoother surfaces', 'wheels', 'bearings', 'streamlining'], type: 'multi' },
        { q: 'Which has more friction: sliding or rolling?', a: 'sliding', type: 'short' },
        { q: 'What is air resistance?', a: 'friction between an object and the air', type: 'open' },
        { q: 'True or false: There is no friction in space.', a: 'false', type: 'tf' },
      ],
    },
    'electric-magnetic-forces': {
      questions: [
        { q: 'What are the two types of electric charge?', a: 'positive and negative', type: 'short' },
        { q: 'Do like charges attract or repel?', a: 'repel', type: 'short' },
        { q: 'Do opposite charges attract or repel?', a: 'attract', type: 'short' },
        { q: 'What are the two poles of a magnet?', a: 'north and south', type: 'short' },
        { q: 'Do like magnetic poles attract or repel?', a: 'repel', type: 'short' },
        { q: 'True or false: Electric and magnetic forces can act at a distance.', a: 'true', type: 'tf' },
        { q: 'What is an electromagnet?', a: 'a magnet created by running electric current through a coil of wire', type: 'open' },
        { q: 'How does distance affect the strength of electric and magnetic forces?', a: 'the force decreases as distance increases', type: 'open' },
      ],
    },
  },
  'grade-8': {
    'kinetic-energy': {
      questions: [
        { q: 'What is kinetic energy?', a: 'the energy of motion', type: 'short' },
        { q: 'What is the formula for kinetic energy?', a: 'KE = 1/2 mv^2', type: 'short' },
        { q: 'A 2 kg ball moves at 3 m/s. What is its kinetic energy?', a: '9 J', type: 'short' },
        { q: 'If speed doubles, what happens to kinetic energy?', a: 'it quadruples', type: 'short' },
        { q: 'If mass doubles (same speed), what happens to kinetic energy?', a: 'it doubles', type: 'short' },
        { q: 'What are the units of kinetic energy?', a: ['Joules', 'J'], type: 'multi' },
        { q: 'Does a parked car have kinetic energy?', a: 'no', type: 'short' },
        { q: 'Which has more KE: a 1 kg ball at 10 m/s or a 10 kg ball at 1 m/s?', a: '1 kg ball at 10 m/s (50 J vs 5 J)', type: 'open' },
      ],
    },
    'potential-energy': {
      questions: [
        { q: 'What is potential energy?', a: 'stored energy due to position or configuration', type: 'open' },
        { q: 'Name three types of potential energy.', a: 'gravitational, elastic, and chemical', type: 'short' },
        { q: 'What determines gravitational potential energy?', a: 'mass, height, and gravity', type: 'short' },
        { q: 'A book on a high shelf has what type of energy?', a: 'gravitational potential energy', type: 'short' },
        { q: 'A stretched rubber band has what type of energy?', a: 'elastic potential energy', type: 'short' },
        { q: 'Food has what type of potential energy?', a: 'chemical potential energy', type: 'short' },
        { q: 'What happens to gravitational PE as height increases?', a: 'it increases', type: 'short' },
        { q: 'True or false: A ball at the top of a hill has more potential energy than at the bottom.', a: 'true', type: 'tf' },
      ],
    },
    'energy-transfer': {
      questions: [
        { q: 'What are the three methods of thermal energy transfer?', a: 'conduction, convection, and radiation', type: 'short' },
        { q: 'What is conduction?', a: 'transfer of thermal energy through direct contact', type: 'open' },
        { q: 'What is convection?', a: 'transfer of thermal energy through the movement of fluids', type: 'open' },
        { q: 'What is radiation?', a: 'transfer of energy through electromagnetic waves', type: 'open' },
        { q: 'A metal spoon getting hot in soup is an example of what?', a: 'conduction', type: 'short' },
        { q: 'Warm air rising is an example of what?', a: 'convection', type: 'short' },
        { q: 'Heat from the Sun reaching Earth is an example of what?', a: 'radiation', type: 'short' },
        { q: 'True or false: Radiation requires a medium to travel through.', a: 'false', type: 'tf' },
      ],
    },
    'energy-transformation': {
      questions: [
        { q: 'What is energy transformation?', a: 'the change of energy from one form to another', type: 'open' },
        { q: 'In a light bulb, what energy transformation occurs?', a: 'electrical energy to light and thermal energy', type: 'open' },
        { q: 'In photosynthesis, what energy transformation occurs?', a: 'light energy to chemical energy', type: 'short' },
        { q: 'When you eat food and run, trace the energy transformations.', a: 'chemical energy to kinetic energy and thermal energy', type: 'open' },
        { q: 'A ball rolling down a hill: what transformation occurs?', a: 'potential energy to kinetic energy', type: 'short' },
        { q: 'What form of energy is almost always produced as a byproduct?', a: ['thermal energy', 'heat'], type: 'multi' },
        { q: 'A battery-powered toy converts what to what?', a: 'chemical energy to kinetic energy', type: 'short' },
        { q: 'True or false: Energy can be created during a transformation.', a: 'false', type: 'tf' },
      ],
    },
    'conservation-of-energy': {
      questions: [
        { q: 'What does the law of conservation of energy state?', a: 'energy cannot be created or destroyed, only transformed from one form to another', type: 'open' },
        { q: 'If a roller coaster starts with 1000 J of PE at the top, how much total energy does it have at the bottom (ignoring friction)?', a: '1000 J (all converted to KE)', type: 'open' },
        { q: 'Where does the "lost" energy go when a bouncing ball stops?', a: 'it is transformed into thermal energy and sound', type: 'open' },
        { q: 'True or false: Energy is used up when you turn on a light.', a: 'false', type: 'tf' },
        { q: 'Why does a perpetual motion machine not work?', a: 'energy is always lost to friction and heat; you cannot get more energy out than you put in', type: 'open' },
        { q: 'In a closed system, total energy always stays what?', a: 'the same', type: 'short' },
        { q: 'What happens to the total energy during any energy transformation?', a: 'it stays the same', type: 'short' },
        { q: 'True or false: Thermal energy from friction is "wasted" but not destroyed.', a: 'true', type: 'tf' },
      ],
    },
    'thermal-energy-transfer': {
      questions: [
        { q: 'In which direction does heat flow?', a: 'from warmer to cooler objects', type: 'short' },
        { q: 'What is thermal equilibrium?', a: 'when two objects reach the same temperature and heat transfer stops', type: 'open' },
        { q: 'True or false: Cold is a form of energy that transfers to warm objects.', a: 'false', type: 'tf' },
        { q: 'Why does a metal doorknob feel colder than a wooden door at the same temperature?', a: 'metal conducts heat away from your hand faster', type: 'open' },
        { q: 'What is a good insulator?', a: ['wood', 'plastic', 'foam', 'air', 'wool'], type: 'multi' },
        { q: 'What is a good conductor of heat?', a: ['metal', 'copper', 'aluminum', 'iron', 'silver'], type: 'multi' },
        { q: 'What is the difference between temperature and heat?', a: 'temperature is average KE of particles; heat is the transfer of thermal energy', type: 'open' },
        { q: 'Will heat flow from a 50C object to a 80C object?', a: 'no, heat flows from warmer to cooler', type: 'short' },
      ],
    },
    'wave-properties': {
      questions: [
        { q: 'What is a wave?', a: 'a disturbance that transfers energy through matter or space', type: 'open' },
        { q: 'What is amplitude?', a: 'the maximum displacement from the rest position', type: 'open' },
        { q: 'What is wavelength?', a: 'the distance between two consecutive identical points on a wave', type: 'open' },
        { q: 'What is frequency?', a: 'the number of waves that pass a point per second', type: 'open' },
        { q: 'What is the formula for wave speed?', a: 'v = frequency x wavelength', type: 'short' },
        { q: 'A wave has frequency 5 Hz and wavelength 2 m. What is its speed?', a: '10 m/s', type: 'short' },
        { q: 'What are the units of frequency?', a: ['Hz', 'Hertz'], type: 'multi' },
        { q: 'True or false: Bigger waves (higher amplitude) travel faster.', a: 'false', type: 'tf' },
      ],
    },
    'transverse-longitudinal': {
      questions: [
        { q: 'In a transverse wave, how do particles move relative to wave direction?', a: 'perpendicular', type: 'short' },
        { q: 'In a longitudinal wave, how do particles move relative to wave direction?', a: 'parallel', type: 'short' },
        { q: 'Light waves are what type of wave?', a: 'transverse', type: 'short' },
        { q: 'Sound waves are what type of wave?', a: 'longitudinal', type: 'short' },
        { q: 'What are the compressed regions in a longitudinal wave called?', a: 'compressions', type: 'short' },
        { q: 'What are the stretched-out regions in a longitudinal wave called?', a: 'rarefactions', type: 'short' },
        { q: 'A wave on a string is what type?', a: 'transverse', type: 'short' },
        { q: 'True or false: A slinky can demonstrate both transverse and longitudinal waves.', a: 'true', type: 'tf' },
      ],
    },
    'wave-behavior': {
      questions: [
        { q: 'What is reflection?', a: 'when a wave bounces off a surface', type: 'open' },
        { q: 'What is refraction?', a: 'when a wave bends as it passes from one medium to another', type: 'open' },
        { q: 'What is absorption?', a: 'when a wave\'s energy is taken in by a material', type: 'open' },
        { q: 'Why does a straw look bent in a glass of water?', a: 'refraction of light', type: 'short' },
        { q: 'An echo is an example of what wave behavior?', a: 'reflection', type: 'short' },
        { q: 'Why can you hear someone around a corner but not see them?', a: 'sound waves diffract (bend around obstacles) more than light waves', type: 'open' },
        { q: 'What determines the color of an opaque object?', a: 'the wavelengths of light it reflects', type: 'open' },
        { q: 'True or false: Light travels at the same speed in all materials.', a: 'false', type: 'tf' },
      ],
    },
    'em-spectrum': {
      questions: [
        { q: 'List the electromagnetic spectrum from lowest to highest frequency.', a: 'radio, microwave, infrared, visible, ultraviolet, X-ray, gamma', type: 'short' },
        { q: 'What type of EM wave do we see with our eyes?', a: 'visible light', type: 'short' },
        { q: 'Do all EM waves travel at the same speed in a vacuum?', a: 'yes, the speed of light', type: 'short' },
        { q: 'Which EM waves have the longest wavelength?', a: 'radio waves', type: 'short' },
        { q: 'Which EM waves have the highest energy?', a: 'gamma rays', type: 'short' },
        { q: 'What EM wave does a microwave oven use?', a: 'microwaves', type: 'short' },
        { q: 'What EM wave is used for medical imaging of bones?', a: 'X-rays', type: 'short' },
        { q: 'True or false: EM waves need a medium to travel through.', a: 'false', type: 'tf' },
      ],
    },
    'sound-waves': {
      questions: [
        { q: 'What type of wave is sound?', a: 'longitudinal', type: 'short' },
        { q: 'Does sound need a medium to travel?', a: 'yes', type: 'short' },
        { q: 'Can sound travel through a vacuum?', a: 'no', type: 'short' },
        { q: 'In which medium does sound travel fastest: solid, liquid, or gas?', a: 'solid', type: 'short' },
        { q: 'What determines the pitch of a sound?', a: 'frequency', type: 'short' },
        { q: 'What determines the loudness of a sound?', a: 'amplitude', type: 'short' },
        { q: 'True or false: Sound travels faster in warm air than cold air.', a: 'true', type: 'tf' },
        { q: 'What is the speed of sound in air approximately?', a: ['343 m/s', '340 m/s'], type: 'multi' },
      ],
    },
    'digital-analog': {
      questions: [
        { q: 'What is an analog signal?', a: 'a continuous signal that varies smoothly', type: 'open' },
        { q: 'What is a digital signal?', a: 'a signal made of discrete values (0s and 1s)', type: 'open' },
        { q: 'Which type of signal is more reliable for data transmission?', a: 'digital', type: 'short' },
        { q: 'Why are digital signals more reliable?', a: 'they can be reconstructed exactly even if degraded', type: 'open' },
        { q: 'A vinyl record produces what type of signal?', a: 'analog', type: 'short' },
        { q: 'A CD stores music in what type of signal?', a: 'digital', type: 'short' },
        { q: 'True or false: Digital signals can be copied perfectly without quality loss.', a: 'true', type: 'tf' },
        { q: 'What are the two values used in digital signals?', a: '0 and 1', type: 'short' },
      ],
    },
  },
};

const PHENOMENA = {
  'grade-6': [
    { title: 'Popcorn Bag Expansion', focus: 'matter', text: 'A sealed bag of microwave popcorn expands without opening.', drivingQuestion: 'Where does the extra volume come from if no matter enters?' },
    { title: 'The Glow Stick', focus: 'changes', text: 'A glow stick lights up when you bend it.', drivingQuestion: 'What causes a glow stick to produce light when bent?' },
    { title: 'Disappearing Sugar', focus: 'matter', text: 'When you stir sugar into hot water, it seems to disappear.', drivingQuestion: 'Where did the sugar go? Was it destroyed?' },
  ],
  'grade-7': [
    { title: 'Tablecloth Trick', focus: 'forces', text: 'A tablecloth can be pulled from under dishes without moving them.', drivingQuestion: 'Why don\'t the dishes move when the cloth is pulled?' },
    { title: 'The Heavy Box', focus: 'forces', text: 'It takes more force to push a loaded shopping cart than an empty one.', drivingQuestion: 'Why does mass affect how hard it is to move an object?' },
    { title: 'Rocket Launch', focus: 'interactions', text: 'A rocket pushes exhaust gases downward and rises upward.', drivingQuestion: 'How can pushing something down make you go up?' },
  ],
  'grade-8': [
    { title: 'Warm Hands', focus: 'energy', text: 'Rubbing your hands together makes them warm.', drivingQuestion: 'Where does the heat come from if nothing is burning?' },
    { title: 'Sound Around Corners', focus: 'waves', text: 'You can hear someone around a corner but cannot see them.', drivingQuestion: 'Why does sound go around corners but light does not?' },
    { title: 'The Bouncing Ball', focus: 'energy', text: 'A ball dropped from 1 meter never bounces back to exactly 1 meter.', drivingQuestion: 'Where does the missing energy go?' },
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

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 '\/\^]/g, ''); }

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

  return { type: 'physical-science', skill, grade, count: items.length, instruction: 'Answer each question about physical science.', items };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(r => norm(r) === norm(answer));
  return norm(expected) === norm(answer);
}

// Public API

class MSPhysicalScience {
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
        engage: phenom ? `Phenomenon: ${phenom.title} — ${phenom.drivingQuestion}` : 'Explore a surprising physical science observation',
        explore: `Investigate: ${target.category} > ${target.skill}`,
        explain: `Build understanding with ${exercise.count || 0} practice items`,
        elaborate: 'Apply to a new physical scenario or connect to another domain',
        evaluate: 'Check understanding with calculation, model, or CER response',
      },
    };
  }
}

module.exports = MSPhysicalScience;

// CLI: node physical-science.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new MSPhysicalScience();
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
      default: out({ usage: 'node physical-science.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','phenomenon'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
