// eClaw Physical Science Interactive Tutor (K-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'science-physical');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'K-2': {
    'forces': ['pushes-pulls', 'force-effects'],
    'properties': ['material-properties', 'sorting-objects'],
    'states-of-matter': ['solid-liquid-gas', 'heating-cooling'],
    'sound': ['vibrations', 'loud-soft-high-low'],
    'light': ['light-sources', 'transparent-opaque'],
  },
  '3-5': {
    'forces-motion': ['balanced-unbalanced', 'friction', 'gravity-intro'],
    'magnets': ['attract-repel', 'magnetic-materials', 'poles'],
    'energy-transfer': ['heat-transfer', 'light-energy', 'sound-energy'],
    'waves': ['wave-properties', 'reflection-refraction'],
    'matter-properties': ['mixtures', 'dissolving', 'conservation-of-matter'],
    'chemical-changes': ['physical-vs-chemical', 'evidence-of-reactions'],
  },
  '6-8': {
    'atomic-model': ['atoms-elements', 'molecules-compounds', 'periodic-table-basics'],
    'chemical-reactions': ['balancing-basics', 'endothermic-exothermic', 'conservation-of-mass'],
    'particle-model': ['states-particle-motion', 'phase-changes'],
    'newtons-laws': ['inertia', 'force-equals-ma', 'action-reaction'],
    'energy': ['kinetic-potential', 'energy-conservation', 'energy-transformations'],
    'electricity': ['circuits-basics', 'series-parallel', 'voltage-current-resistance'],
    'em-spectrum': ['spectrum-order', 'wave-applications'],
  },
};

const CONTENT_BANKS = {
  'K-2': {
    'pushes-pulls': {
      items: [
        ['kicking a ball', 'push'], ['pulling a wagon', 'pull'], ['throwing a ball', 'push'],
        ['opening a drawer', 'pull'], ['closing a door', 'push'], ['tug of war', 'pull'],
        ['pressing a button', 'push'], ['dragging a sled', 'pull'], ['rolling a tire', 'push'],
        ['reeling in a fish', 'pull'], ['hitting a drum', 'push'], ['stretching a rubber band', 'pull'],
      ],
    },
    'force-effects': {
      items: [
        { question: 'What happens when you push a toy car harder?', answer: 'it goes faster and farther' },
        { question: 'What happens when you push a ball to the side?', answer: 'it changes direction' },
        { question: 'What happens when two people push a box from opposite sides equally?', answer: 'the box does not move' },
        { question: 'What happens if you stop pushing a rolling ball?', answer: 'it slows down and stops' },
      ],
    },
    'material-properties': {
      items: [
        ['wood', 'hard'], ['cotton', 'soft'], ['rubber', 'flexible'], ['glass', 'transparent'],
        ['metal', 'hard'], ['sponge', 'soft'], ['clay', 'flexible'], ['rock', 'hard'],
        ['silk', 'smooth'], ['sandpaper', 'rough'], ['ice', 'cold and hard'], ['feather', 'light'],
      ],
    },
    'sorting-objects': {
      items: [
        { question: 'How could you sort a rock, cotton ball, and rubber band?', answer: 'by hardness or flexibility' },
        { question: 'Name something that floats and something that sinks', answer: 'wood floats, rock sinks' },
        { question: 'Name something transparent and something opaque', answer: 'glass is transparent, wood is opaque' },
      ],
    },
    'solid-liquid-gas': {
      items: [
        ['ice cube', 'solid'], ['juice', 'liquid'], ['steam', 'gas'], ['rock', 'solid'],
        ['milk', 'liquid'], ['air', 'gas'], ['wood', 'solid'], ['water', 'liquid'],
        ['oxygen', 'gas'], ['sand grain', 'solid'], ['oil', 'liquid'], ['helium', 'gas'],
        ['coin', 'solid'], ['honey', 'liquid'], ['water vapor', 'gas'],
      ],
    },
    'heating-cooling': {
      items: [
        { question: 'What happens when you heat ice?', answer: 'it melts into water' },
        { question: 'What happens when you cool water enough?', answer: 'it freezes into ice' },
        { question: 'What happens when you heat water a lot?', answer: 'it boils and becomes steam' },
        { question: 'Can you un-bake a cake?', answer: 'no, some changes cannot be reversed' },
        { question: 'What happens to chocolate in a warm hand?', answer: 'it melts' },
      ],
    },
    'vibrations': {
      items: [
        { question: 'What makes sound?', answer: 'vibrations' },
        { question: 'If you pluck a guitar string, what do you see and hear?', answer: 'the string vibrates and makes sound' },
        { question: 'Put your hand on your throat and hum. What do you feel?', answer: 'vibrations' },
        { question: 'Can sound travel through water?', answer: 'yes, sound travels through solids, liquids, and gases' },
      ],
    },
    'loud-soft-high-low': {
      items: [
        { question: 'How do you make a drum sound louder?', answer: 'hit it harder' },
        { question: 'A thick rubber band vs a thin one — which sounds lower?', answer: 'the thick one' },
        { question: 'What makes a high-pitched sound?', answer: 'fast vibrations' },
        { question: 'What makes a low-pitched sound?', answer: 'slow vibrations' },
      ],
    },
    'light-sources': {
      items: [
        ['sun', true], ['moon', false], ['flashlight', true], ['mirror', false],
        ['candle', true], ['lamp', true], ['star', true], ['glass', false],
        ['fire', true], ['shiny rock', false],
      ],
    },
    'transparent-opaque': {
      items: [
        ['clear glass', 'transparent'], ['wood', 'opaque'], ['plastic wrap', 'transparent'],
        ['brick', 'opaque'], ['clean water', 'transparent'], ['cardboard', 'opaque'],
        ['frosted glass', 'translucent'], ['wax paper', 'translucent'], ['metal', 'opaque'],
        ['air', 'transparent'],
      ],
    },
  },
  '3-5': {
    'balanced-unbalanced': {
      items: [
        { question: 'A book sits still on a table. Are forces balanced or unbalanced?', answer: 'balanced' },
        { question: 'A ball rolls and speeds up. Are forces balanced or unbalanced?', answer: 'unbalanced' },
        { question: 'Two kids push a box equally from opposite sides. Balanced or unbalanced?', answer: 'balanced' },
        { question: 'You push a shopping cart and it starts moving. Balanced or unbalanced?', answer: 'unbalanced' },
        { question: 'A skydiver falls at constant speed. Balanced or unbalanced?', answer: 'balanced' },
      ],
    },
    'friction': {
      items: [
        { question: 'Why does a ball stop rolling on grass?', answer: 'friction slows it down' },
        { question: 'Which surface has more friction: ice or sandpaper?', answer: 'sandpaper' },
        { question: 'Why do shoes have treads on the bottom?', answer: 'to increase friction and prevent slipping' },
        { question: 'Is friction always unhelpful?', answer: 'no, friction helps us walk and grip things' },
      ],
    },
    'gravity-intro': {
      items: [
        { question: 'Why do things fall down?', answer: 'gravity pulls objects toward Earth' },
        { question: 'Does a heavy ball fall faster than a light ball (no air)?', answer: 'no, they fall at the same rate' },
        { question: 'Why does a feather fall slower than a rock in air?', answer: 'air resistance slows the feather more' },
        { question: 'What is weight?', answer: 'the force of gravity on an object' },
      ],
    },
    'attract-repel': {
      items: [
        { question: 'What happens when you bring two north poles together?', answer: 'they repel (push away)' },
        { question: 'What happens when you bring a north and south pole together?', answer: 'they attract (pull together)' },
        { question: 'Do all metals stick to magnets?', answer: 'no, only iron, nickel, and cobalt' },
        { question: 'Can magnets work through paper?', answer: 'yes, magnetic force passes through many materials' },
      ],
    },
    'magnetic-materials': {
      items: [
        ['iron nail', 'magnetic'], ['aluminum foil', 'not magnetic'], ['paper clip (steel)', 'magnetic'],
        ['copper penny', 'not magnetic'], ['nickel coin', 'not magnetic'], ['plastic ruler', 'not magnetic'],
        ['glass marble', 'not magnetic'], ['steel scissors', 'magnetic'], ['wood block', 'not magnetic'],
        ['rubber eraser', 'not magnetic'],
      ],
    },
    'poles': {
      items: [
        { question: 'How many poles does every magnet have?', answer: 'two: north and south' },
        { question: 'If you break a magnet in half, how many poles does each piece have?', answer: 'still two: north and south' },
        { question: 'What does a compass needle point to?', answer: 'Earth magnetic north pole' },
      ],
    },
    'heat-transfer': {
      items: [
        { question: 'Metal feels cold because...', answer: 'it conducts heat away from your hand quickly' },
        { question: 'Why do we use wooden spoons for hot pots?', answer: 'wood is a poor conductor (insulator)' },
        { question: 'How does the Sun warm the Earth?', answer: 'radiation — heat travels as light energy through space' },
        { question: 'Why does hot air rise?', answer: 'convection — warm air is less dense' },
      ],
    },
    'light-energy': {
      items: [
        { question: 'Does light travel in straight lines or curves?', answer: 'straight lines' },
        { question: 'What happens when light hits a mirror?', answer: 'it reflects (bounces off)' },
        { question: 'Why does a straw look bent in water?', answer: 'refraction — light bends when it changes speed' },
        { question: 'What color is sunlight made of?', answer: 'all colors (white light is a mix)' },
      ],
    },
    'sound-energy': {
      items: [
        { question: 'Can sound travel through a vacuum (empty space)?', answer: 'no, sound needs a medium' },
        { question: 'Does sound travel faster through air or through water?', answer: 'water (denser material)' },
        { question: 'What is an echo?', answer: 'sound reflecting off a surface' },
        { question: 'What determines pitch?', answer: 'frequency of vibrations' },
      ],
    },
    'wave-properties': {
      items: [
        { question: 'What does a wave transfer?', answer: 'energy, not matter' },
        { question: 'What is amplitude?', answer: 'the height of a wave (relates to loudness or brightness)' },
        { question: 'What is wavelength?', answer: 'the distance between two wave peaks' },
        { question: 'What is frequency?', answer: 'how many waves pass a point per second' },
      ],
    },
    'reflection-refraction': {
      items: [
        { question: 'You see yourself in a mirror. What is happening?', answer: 'light reflects off the mirror into your eyes' },
        { question: 'A pool looks shallower than it is. Why?', answer: 'refraction — light bends at the water surface' },
        { question: 'A prism splits white light into colors. What is this?', answer: 'refraction separating different wavelengths' },
      ],
    },
    'mixtures': {
      items: [
        { question: 'How can you separate sand from water?', answer: 'filtering' },
        { question: 'How can you separate salt from water?', answer: 'evaporation' },
        { question: 'How can you separate iron filings from sand?', answer: 'using a magnet' },
        { question: 'Is trail mix a mixture?', answer: 'yes, the parts can be separated' },
      ],
    },
    'dissolving': {
      items: [
        { question: 'When sugar dissolves in water, where does it go?', answer: 'it is still there, broken into tiny particles too small to see' },
        { question: 'How can you prove dissolved salt is still in water?', answer: 'evaporate the water — salt remains' },
        { question: 'Does stirring affect how fast something dissolves?', answer: 'yes, stirring speeds up dissolving' },
        { question: 'Does temperature affect dissolving?', answer: 'yes, hot water usually dissolves things faster' },
      ],
    },
    'conservation-of-matter': {
      items: [
        { question: 'If you break a cookie into crumbs, does the total weight change?', answer: 'no, matter is conserved' },
        { question: 'If you dissolve sugar in water, does total weight change?', answer: 'no, the sugar is still there' },
        { question: 'When ice melts, does the amount of matter change?', answer: 'no, only the state changes' },
      ],
    },
    'physical-vs-chemical': {
      items: [
        ['cutting paper', 'physical'], ['burning wood', 'chemical'], ['melting ice', 'physical'],
        ['rusting iron', 'chemical'], ['dissolving sugar', 'physical'], ['baking a cake', 'chemical'],
        ['breaking a stick', 'physical'], ['cooking an egg', 'chemical'], ['freezing water', 'physical'],
        ['mixing baking soda and vinegar', 'chemical'], ['tearing cloth', 'physical'], ['digesting food', 'chemical'],
      ],
    },
    'evidence-of-reactions': {
      items: [
        ['bubbles forming', true], ['color change', true], ['temperature change', true],
        ['new smell', true], ['light produced', true], ['changing shape', false],
        ['dissolving', false], ['precipitate forming', true],
      ],
    },
  },
  '6-8': {
    'atoms-elements': {
      items: [
        { question: 'What is an atom?', answer: 'the smallest unit of an element' },
        { question: 'What are the three parts of an atom?', answer: 'protons, neutrons, and electrons' },
        { question: 'What is an element?', answer: 'a pure substance made of only one type of atom' },
        { question: 'How many known elements are there?', answer: 'about 118' },
        { question: 'What determines which element an atom is?', answer: 'the number of protons' },
      ],
    },
    'molecules-compounds': {
      items: [
        { question: 'What is a molecule?', answer: 'two or more atoms bonded together' },
        { question: 'What is a compound?', answer: 'a substance made of two or more different elements bonded' },
        { question: 'Is O2 a compound?', answer: 'no, it is a molecule but not a compound (only one element)' },
        { question: 'Is H2O a compound?', answer: 'yes, it contains hydrogen and oxygen' },
        { question: 'What is the chemical formula for table salt?', answer: 'NaCl' },
      ],
    },
    'periodic-table-basics': {
      items: [
        { question: 'What are rows in the periodic table called?', answer: 'periods' },
        { question: 'What are columns in the periodic table called?', answer: 'groups or families' },
        { question: 'Elements in the same group have similar what?', answer: 'chemical properties' },
        { question: 'What does the atomic number tell you?', answer: 'the number of protons' },
      ],
    },
    'balancing-basics': {
      items: [
        { question: 'Why must chemical equations be balanced?', answer: 'atoms are not created or destroyed (conservation of mass)' },
        { question: 'In H2 + O2 -> H2O, is it balanced?', answer: 'no, oxygen is not balanced' },
        { question: 'What does the arrow in a chemical equation mean?', answer: 'yields or produces' },
      ],
    },
    'endothermic-exothermic': {
      items: [
        ['burning wood', 'exothermic'], ['cold pack', 'endothermic'], ['rusting', 'exothermic'],
        ['cooking an egg', 'endothermic'], ['combustion', 'exothermic'], ['photosynthesis', 'endothermic'],
        ['melting ice', 'endothermic'], ['freezing water', 'exothermic'],
      ],
    },
    'conservation-of-mass': {
      items: [
        { question: 'In a sealed container, baking soda and vinegar react. Does mass change?', answer: 'no, mass is conserved' },
        { question: 'Burning wood seems to lose mass. Where does the matter go?', answer: 'gases (CO2 and water vapor) escape into the air' },
        { question: 'If you collect ALL products of burning, does total mass change?', answer: 'no' },
      ],
    },
    'states-particle-motion': {
      items: [
        ['particles vibrate in fixed positions', 'solid'],
        ['particles slide past each other', 'liquid'],
        ['particles move fast in all directions', 'gas'],
        ['definite shape and volume', 'solid'],
        ['takes shape of container, definite volume', 'liquid'],
        ['fills entire container, no definite volume', 'gas'],
      ],
    },
    'phase-changes': {
      items: [
        ['solid to liquid', 'melting'], ['liquid to gas', 'evaporation/boiling'],
        ['gas to liquid', 'condensation'], ['liquid to solid', 'freezing'],
        ['solid to gas', 'sublimation'], ['gas to solid', 'deposition'],
      ],
    },
    'inertia': {
      items: [
        { question: 'What is inertia?', answer: 'the tendency of an object to resist changes in motion' },
        { question: 'Why do you lurch forward when a car stops suddenly?', answer: 'your body wants to keep moving (inertia)' },
        { question: 'State Newton\'s First Law', answer: 'an object at rest stays at rest, an object in motion stays in motion, unless acted on by a force' },
      ],
    },
    'force-equals-ma': {
      items: [
        { question: 'State Newton\'s Second Law', answer: 'Force = mass x acceleration (F=ma)' },
        { question: 'If you double the force on an object, what happens to acceleration?', answer: 'it doubles' },
        { question: 'If you double the mass but keep force the same, what happens?', answer: 'acceleration is halved' },
      ],
    },
    'action-reaction': {
      items: [
        { question: 'State Newton\'s Third Law', answer: 'for every action there is an equal and opposite reaction' },
        { question: 'A rocket pushes gas downward. What happens?', answer: 'the gas pushes the rocket upward' },
        { question: 'You push on a wall. Does the wall push back?', answer: 'yes, with equal force' },
      ],
    },
    'kinetic-potential': {
      items: [
        ['ball rolling downhill', 'kinetic'], ['book on a shelf', 'potential'],
        ['stretched rubber band', 'potential'], ['moving car', 'kinetic'],
        ['rock at top of cliff', 'potential'], ['spinning wheel', 'kinetic'],
        ['compressed spring', 'potential'], ['flying arrow', 'kinetic'],
      ],
    },
    'energy-conservation': {
      items: [
        { question: 'Can energy be created or destroyed?', answer: 'no, energy is conserved — it transforms' },
        { question: 'When a ball stops bouncing, where did the energy go?', answer: 'transformed to heat and sound' },
        { question: 'At the top of a roller coaster, what type of energy is maximum?', answer: 'potential energy' },
      ],
    },
    'energy-transformations': {
      items: [
        ['light bulb', 'electrical to light and heat'], ['solar panel', 'light to electrical'],
        ['car engine', 'chemical to kinetic and heat'], ['battery', 'chemical to electrical'],
        ['microphone', 'sound to electrical'], ['speaker', 'electrical to sound'],
        ['photosynthesis', 'light to chemical'],
      ],
    },
    'circuits-basics': {
      items: [
        { question: 'What 3 things do you need for a complete circuit?', answer: 'energy source, conductor (wire), and load (e.g., bulb)' },
        { question: 'What happens if a circuit is broken (open)?', answer: 'current stops flowing' },
        { question: 'What is a conductor?', answer: 'a material that allows electricity to flow easily' },
        { question: 'What is an insulator?', answer: 'a material that resists electrical flow' },
      ],
    },
    'series-parallel': {
      items: [
        { question: 'In a series circuit, what happens if one bulb burns out?', answer: 'all bulbs go out' },
        { question: 'In a parallel circuit, what happens if one bulb burns out?', answer: 'other bulbs stay on' },
        { question: 'Which circuit type is used in homes?', answer: 'parallel' },
      ],
    },
    'voltage-current-resistance': {
      items: [
        { question: 'What is voltage?', answer: 'the push that moves electrons (measured in volts)' },
        { question: 'What is current?', answer: 'the flow of electrons (measured in amps)' },
        { question: 'What is resistance?', answer: 'opposition to current flow (measured in ohms)' },
        { question: 'State Ohm\'s Law', answer: 'V = I x R (voltage = current x resistance)' },
      ],
    },
    'spectrum-order': {
      items: [
        { question: 'List the EM spectrum from longest to shortest wavelength', answer: 'radio, microwave, infrared, visible, ultraviolet, X-ray, gamma' },
        { question: 'Which EM wave has the most energy?', answer: 'gamma rays' },
        { question: 'Which part of the EM spectrum can humans see?', answer: 'visible light' },
      ],
    },
    'wave-applications': {
      items: [
        ['radio waves', 'communication (radio, TV, WiFi)'],
        ['microwaves', 'cooking food, cell phones'],
        ['infrared', 'thermal imaging, remote controls'],
        ['X-rays', 'medical imaging of bones'],
        ['ultraviolet', 'causes sunburn, used for sterilization'],
      ],
    },
  },
};

const PASSAGES = {
  'K-2': [
    { title: 'Push and Pull', focus: 'forces', text: 'Everything that moves needs a push or a pull. When you kick a ball, you push it with your foot. When you pull a wagon, you use force to move it. A bigger push makes things go farther!' },
    { title: 'Solid, Liquid, Gas', focus: 'states of matter', text: 'Ice is solid. Water is liquid. Steam is gas. When you heat ice, it melts into water. When you heat water, it becomes steam. Cooling reverses the changes!' },
  ],
  '3-5': [
    { title: 'Magnetic Mystery', focus: 'magnets', text: 'Magnets have two poles: north and south. Opposite poles attract. Same poles repel. Magnets only attract certain metals like iron and steel. A magnet can even work through paper!' },
    { title: 'The Energy Chain', focus: 'energy', text: 'Energy changes form but never disappears. A battery has chemical energy. It becomes electrical energy in a wire. A light bulb turns it into light and heat. Energy transforms but the total stays the same.' },
  ],
  '6-8': [
    { title: 'Newton\'s Laws', focus: 'forces', text: 'Newton discovered three laws of motion. First: objects resist changes in motion (inertia). Second: force equals mass times acceleration. Third: every action has an equal and opposite reaction. These laws explain everything from falling apples to rocket launches.' },
    { title: 'Inside the Atom', focus: 'atomic model', text: 'Atoms are made of protons and neutrons in a nucleus, with electrons orbiting around. The number of protons determines the element. Atoms bond together to form molecules and compounds that make up everything around us.' },
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

  // Two-element arrays: [item, category]
  if (bank.items && Array.isArray(bank.items[0]) && bank.items[0].length === 2 && typeof bank.items[0][1] === 'string') {
    return exResult('classify', skill, grade, 'Classify each item.',
      pick(bank.items, count).map(([item, cat]) => ({ prompt: `Classify: "${item}"`, answer: cat })));
  }

  // Light sources: [item, boolean]
  if (skill === 'light-sources' && bank.items && Array.isArray(bank.items[0]) && typeof bank.items[0][1] === 'boolean')
    return exResult('true-false', skill, grade, 'Does this produce its own light? YES or NO.',
      pick(bank.items, count).map(([item, val]) => ({ prompt: `Does "${item}" produce its own light?`, answer: val ? 'yes' : 'no' })));

  // Two-element arrays with boolean: [item, boolean]
  if (bank.items && Array.isArray(bank.items[0]) && bank.items[0].length === 2 && typeof bank.items[0][1] === 'boolean') {
    return exResult('true-false', skill, grade, 'Is this true? YES or NO.',
      pick(bank.items, count).map(([item, val]) => ({ prompt: `"${item}" — is this a sign of a chemical reaction?`, answer: val ? 'yes' : 'no' })));
  }

  // Question-answer items
  if (bank.items && bank.items[0]?.question)
    return exResult('short-answer', skill, grade, 'Answer the question.',
      pick(bank.items, count).map(i => ({ prompt: i.question, answer: i.answer })));

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(e => norm(e) === norm(answer));
  return norm(expected) === norm(answer);
}

// Public API

class PhysicalScience {
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
        engage: `Present a surprising phenomenon related to ${target.category} -> ${target.skill}`,
        explore: `Complete ${exercise.count || 0} practice items`,
        explain: `Discuss the science behind ${target.skill}`,
        elaborate: 'Connect to real-world applications',
        evaluate: passage ? `Read passage: "${passage.title}"` : 'Reflect on what was learned',
      },
    };
  }
}

module.exports = PhysicalScience;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new PhysicalScience();
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
      default: out({ usage: 'node physical-science.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','passage'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
