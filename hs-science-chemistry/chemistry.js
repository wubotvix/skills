// eClaw HS Chemistry Tutor (10-12). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-science-chemistry');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'atomic-structure': [
    'atomic-models', 'electron-configuration', 'quantum-numbers', 'isotopes',
    'electromagnetic-spectrum', 'periodic-trends-atomic'
  ],
  'periodic-table': [
    'periodic-law', 'group-properties', 'atomic-radius', 'ionization-energy',
    'electronegativity', 'electron-affinity'
  ],
  'chemical-bonding': [
    'ionic-bonding', 'covalent-bonding', 'metallic-bonding', 'lewis-structures',
    'vsepr-molecular-geometry', 'intermolecular-forces', 'polarity'
  ],
  'chemical-reactions': [
    'balancing-equations', 'reaction-types', 'net-ionic-equations',
    'oxidation-states', 'activity-series', 'predicting-products'
  ],
  'stoichiometry': [
    'mole-concept', 'molar-mass', 'mole-conversions', 'mass-to-mass',
    'limiting-reagent', 'percent-yield', 'solution-stoichiometry'
  ],
  'states-of-matter': [
    'kinetic-molecular-theory', 'gas-laws', 'ideal-gas-law', 'phase-changes',
    'heating-curves', 'vapor-pressure'
  ],
  'solutions': [
    'solubility', 'concentration-units', 'molarity', 'dilution',
    'colligative-properties', 'solubility-rules'
  ],
  'acids-bases': [
    'acid-base-definitions', 'ph-scale', 'strong-vs-weak', 'ka-kb',
    'buffers', 'titration', 'neutralization'
  ],
  'thermochemistry': [
    'exo-endothermic', 'calorimetry', 'hess-law', 'bond-energies',
    'enthalpy-of-formation', 'entropy-gibbs'
  ],
};

const CONTENT_BANKS = {
  'atomic-models': {
    questions: [
      { q: 'What model of the atom has electrons in specific energy levels or shells?', a: 'bohr model', alt: ['bohr'], type: 'recall' },
      { q: 'In the quantum mechanical model, what describes the probability of finding an electron?', a: 'orbital', alt: ['electron cloud', 'probability cloud'], type: 'concept' },
      { q: 'Who proposed the nuclear model of the atom based on the gold foil experiment?', a: 'rutherford', alt: ['ernest rutherford'], type: 'recall' },
      { q: 'What did J.J. Thomson discover?', a: 'the electron', alt: ['electrons'], type: 'recall' },
      { q: 'What is the plum pudding model?', a: 'electrons embedded in a positive sphere', alt: ['thomsons model'], type: 'concept' },
      { q: 'What subatomic particle was discovered by Chadwick?', a: 'neutron', type: 'recall' },
      { q: 'What experiment led to the discovery of the nucleus?', a: 'gold foil experiment', alt: ['rutherfords gold foil experiment'], type: 'recall' },
      { q: 'What is the charge of a proton?', a: 'positive', alt: ['+1', 'plus one'], type: 'recall' },
    ],
  },
  'electron-configuration': {
    questions: [
      { q: 'What is the Aufbau principle?', a: 'electrons fill lowest energy orbitals first', alt: ['fill from lowest to highest energy'], type: 'concept' },
      { q: "What does Hund's rule state?", a: 'electrons fill orbitals singly before pairing', alt: ['one electron per orbital before doubling up'], type: 'concept' },
      { q: 'What does the Pauli exclusion principle state?', a: 'no two electrons can have the same four quantum numbers', alt: ['max two electrons per orbital with opposite spins'], type: 'concept' },
      { q: 'Write the electron configuration for oxygen (Z=8).', a: '1s2 2s2 2p4', alt: ['1s2 2s2 2p4'], type: 'recall' },
      { q: 'How many electrons can the 3d subshell hold?', a: '10', alt: ['ten'], type: 'recall' },
      { q: 'What is the electron configuration of sodium (Z=11)?', a: '1s2 2s2 2p6 3s1', type: 'recall' },
      { q: 'What are valence electrons?', a: 'electrons in the outermost energy level', alt: ['outer shell electrons'], type: 'concept' },
      { q: 'How many valence electrons does carbon have?', a: '4', alt: ['four'], type: 'recall' },
    ],
  },
  'quantum-numbers': {
    questions: [
      { q: 'What does the principal quantum number (n) describe?', a: 'energy level or shell', alt: ['size of orbital', 'energy level'], type: 'concept' },
      { q: 'What does the angular momentum quantum number (l) describe?', a: 'shape of the orbital', alt: ['orbital shape', 'subshell'], type: 'concept' },
      { q: 'What does the magnetic quantum number (ml) describe?', a: 'orientation of the orbital in space', alt: ['spatial orientation'], type: 'concept' },
      { q: 'What are the two possible values for the spin quantum number (ms)?', a: '+1/2 and -1/2', alt: ['plus half and minus half', 'up and down'], type: 'recall' },
      { q: 'If n=3, what are the possible values of l?', a: '0 1 2', alt: ['0, 1, 2'], type: 'recall' },
      { q: 'What shape corresponds to l=0?', a: 's', alt: ['spherical', 's orbital'], type: 'recall' },
      { q: 'What shape corresponds to l=1?', a: 'p', alt: ['dumbbell', 'p orbital'], type: 'recall' },
      { q: 'How many orbitals are in a d subshell?', a: '5', alt: ['five'], type: 'recall' },
    ],
  },
  'isotopes': {
    questions: [
      { q: 'What are isotopes?', a: 'atoms of the same element with different numbers of neutrons', alt: ['same protons different neutrons'], type: 'concept' },
      { q: 'How do you calculate the number of neutrons in an atom?', a: 'mass number minus atomic number', alt: ['a - z'], type: 'recall' },
      { q: 'What is average atomic mass?', a: 'weighted average of all isotope masses based on abundance', alt: ['weighted average of isotopes'], type: 'concept' },
      { q: 'Carbon-12 and Carbon-14 differ in what?', a: 'number of neutrons', alt: ['neutrons'], type: 'recall' },
      { q: 'What instrument separates isotopes by mass?', a: 'mass spectrometer', alt: ['mass spectrometry', 'mass spec'], type: 'recall' },
      { q: 'If an element has two isotopes: 75% mass 35 and 25% mass 37, what is the average atomic mass?', a: '35.5', alt: ['35.50'], type: 'calculation' },
    ],
  },
  'electromagnetic-spectrum': {
    questions: [
      { q: 'What is the relationship between wavelength and frequency?', a: 'inversely proportional', alt: ['as wavelength increases frequency decreases'], type: 'concept' },
      { q: 'What equation relates the speed of light, wavelength, and frequency?', a: 'c = lambda times nu', alt: ['c = wavelength x frequency', 'c equals lambda nu'], type: 'recall' },
      { q: 'Which has more energy: red light or blue light?', a: 'blue light', alt: ['blue'], type: 'recall' },
      { q: 'What causes an element to emit a line spectrum?', a: 'electrons dropping from higher to lower energy levels', alt: ['electron transitions', 'energy level changes'], type: 'concept' },
      { q: 'What is photoelectron spectroscopy (PES) used for?', a: 'determining electron configuration and binding energies', alt: ['measuring electron energies'], type: 'concept' },
      { q: 'What equation gives the energy of a photon?', a: 'e = hf', alt: ['e = h nu', 'energy equals planck constant times frequency'], type: 'recall' },
    ],
  },
  'periodic-trends-atomic': {
    questions: [
      { q: 'How does atomic radius change across a period (left to right)?', a: 'decreases', alt: ['gets smaller'], type: 'recall' },
      { q: 'How does atomic radius change down a group?', a: 'increases', alt: ['gets larger'], type: 'recall' },
      { q: 'Why does atomic radius decrease across a period?', a: 'increasing nuclear charge pulls electrons closer', alt: ['more protons attract electrons more'], type: 'concept' },
      { q: 'How does ionization energy change across a period?', a: 'increases', alt: ['gets larger'], type: 'recall' },
      { q: 'How does electronegativity change across a period?', a: 'increases', alt: ['gets larger'], type: 'recall' },
      { q: 'Which element has the highest electronegativity?', a: 'fluorine', alt: ['f'], type: 'recall' },
    ],
  },
  'periodic-law': {
    questions: [
      { q: 'What does the periodic law state?', a: 'properties of elements repeat periodically when arranged by atomic number', alt: ['recurring properties by atomic number'], type: 'concept' },
      { q: 'Who created the first widely accepted periodic table?', a: 'mendeleev', alt: ['dmitri mendeleev'], type: 'recall' },
      { q: 'What property did Mendeleev use to arrange elements?', a: 'atomic mass', alt: ['atomic weight'], type: 'recall' },
      { q: 'What property is now used to arrange the periodic table?', a: 'atomic number', type: 'recall' },
      { q: 'What are groups on the periodic table?', a: 'vertical columns of elements with similar properties', alt: ['columns', 'families'], type: 'recall' },
      { q: 'What are periods on the periodic table?', a: 'horizontal rows', alt: ['rows'], type: 'recall' },
    ],
  },
  'group-properties': {
    questions: [
      { q: 'What are Group 1 elements called?', a: 'alkali metals', type: 'recall' },
      { q: 'What are Group 2 elements called?', a: 'alkaline earth metals', type: 'recall' },
      { q: 'What are Group 17 elements called?', a: 'halogens', type: 'recall' },
      { q: 'What are Group 18 elements called?', a: 'noble gases', type: 'recall' },
      { q: 'Why are noble gases unreactive?', a: 'they have full valence electron shells', alt: ['complete outer shell', 'stable electron configuration'], type: 'concept' },
      { q: 'How many valence electrons do alkali metals have?', a: '1', alt: ['one'], type: 'recall' },
    ],
  },
  'atomic-radius': {
    questions: [
      { q: 'Which is larger: Na or Cl?', a: 'na', alt: ['sodium'], type: 'recall' },
      { q: 'Which is larger: Li or K?', a: 'k', alt: ['potassium'], type: 'recall' },
      { q: 'Why does atomic radius increase down a group?', a: 'additional electron shells are added', alt: ['more energy levels'], type: 'concept' },
      { q: 'Is a cation larger or smaller than its parent atom?', a: 'smaller', type: 'recall' },
      { q: 'Is an anion larger or smaller than its parent atom?', a: 'larger', type: 'recall' },
      { q: 'Rank these in order of increasing atomic radius: O, S, Se', a: 'o s se', alt: ['o < s < se'], type: 'recall' },
    ],
  },
  'ionization-energy': {
    questions: [
      { q: 'What is ionization energy?', a: 'energy required to remove an electron from an atom', alt: ['energy to remove outermost electron'], type: 'concept' },
      { q: 'Which has higher ionization energy: Na or Mg?', a: 'mg', alt: ['magnesium'], type: 'recall' },
      { q: 'Why do noble gases have high ionization energy?', a: 'their electron configuration is very stable', alt: ['full valence shell is hard to disrupt'], type: 'concept' },
      { q: 'What is successive ionization energy?', a: 'energy to remove the 2nd 3rd etc electrons', alt: ['removing additional electrons'], type: 'concept' },
      { q: 'Why is there a large jump in successive IE when a core electron is removed?', a: 'core electrons are much closer to the nucleus and more tightly held', alt: ['core electrons harder to remove'], type: 'concept' },
      { q: 'How does ionization energy change down a group?', a: 'decreases', type: 'recall' },
    ],
  },
  'electronegativity': {
    questions: [
      { q: 'What is electronegativity?', a: 'the ability of an atom to attract shared electrons in a bond', alt: ['tendency to pull bonding electrons'], type: 'concept' },
      { q: 'Who developed the electronegativity scale?', a: 'linus pauling', alt: ['pauling'], type: 'recall' },
      { q: 'Do metals or nonmetals have higher electronegativity?', a: 'nonmetals', type: 'recall' },
      { q: 'What type of bond forms when the electronegativity difference is greater than 1.7?', a: 'ionic', alt: ['ionic bond'], type: 'recall' },
      { q: 'What type of bond forms when the electronegativity difference is 0.4-1.7?', a: 'polar covalent', alt: ['polar covalent bond'], type: 'recall' },
      { q: 'What type of bond has an electronegativity difference less than 0.4?', a: 'nonpolar covalent', alt: ['nonpolar covalent bond', 'pure covalent'], type: 'recall' },
    ],
  },
  'electron-affinity': {
    questions: [
      { q: 'What is electron affinity?', a: 'energy change when an atom gains an electron', alt: ['energy released or absorbed when gaining an electron'], type: 'concept' },
      { q: 'Which group has the highest electron affinity?', a: 'halogens', alt: ['group 17'], type: 'recall' },
      { q: 'Why do halogens have high electron affinity?', a: 'they need only one electron to complete their valence shell', alt: ['one electron from full shell'], type: 'concept' },
      { q: 'Why do noble gases have essentially zero electron affinity?', a: 'their valence shell is already full', alt: ['no room for another electron'], type: 'concept' },
      { q: 'How does electron affinity generally change across a period?', a: 'becomes more negative (increases)', alt: ['increases'], type: 'recall' },
      { q: 'A more negative electron affinity means what?', a: 'the atom more readily gains an electron', alt: ['more energy released on gaining electron'], type: 'concept' },
    ],
  },
  'ionic-bonding': {
    questions: [
      { q: 'What is an ionic bond?', a: 'a bond formed by the transfer of electrons from a metal to a nonmetal', alt: ['electrostatic attraction between ions'], type: 'concept' },
      { q: 'What type of structure do ionic compounds form?', a: 'crystal lattice', alt: ['lattice structure', 'crystalline structure'], type: 'recall' },
      { q: 'Do ionic compounds conduct electricity when dissolved in water?', a: 'yes', type: 'tf' },
      { q: 'What is lattice energy?', a: 'energy required to separate an ionic compound into gaseous ions', alt: ['energy of ionic lattice formation'], type: 'concept' },
      { q: 'Which ionic compound has a higher melting point: NaCl or MgO?', a: 'mgo', alt: ['magnesium oxide'], type: 'recall' },
      { q: 'Why does MgO have a higher melting point than NaCl?', a: 'higher charges on ions create stronger attraction', alt: ['2+ and 2- charges vs 1+ and 1-'], type: 'concept' },
    ],
  },
  'covalent-bonding': {
    questions: [
      { q: 'What is a covalent bond?', a: 'a bond formed by sharing electrons between nonmetals', alt: ['electron sharing between atoms'], type: 'concept' },
      { q: 'What is a single covalent bond?', a: 'sharing of one pair of electrons', alt: ['two shared electrons'], type: 'recall' },
      { q: 'What is a double bond?', a: 'sharing of two pairs of electrons', alt: ['four shared electrons'], type: 'recall' },
      { q: 'What is bond order?', a: 'number of electron pairs shared between two atoms', alt: ['number of bonds between atoms'], type: 'concept' },
      { q: 'What is formal charge?', a: 'the charge an atom would have if bonding electrons were shared equally', alt: ['theoretical charge on atom in molecule'], type: 'concept' },
      { q: 'What is resonance?', a: 'two or more valid lewis structures for the same molecule', alt: ['delocalized electrons represented by multiple structures'], type: 'concept' },
    ],
  },
  'metallic-bonding': {
    questions: [
      { q: 'What is the sea of electrons model?', a: 'metallic bonding where valence electrons are delocalized and shared among all metal atoms', alt: ['electrons flow freely among metal cations'], type: 'concept' },
      { q: 'Why are metals good conductors?', a: 'delocalized electrons can move freely', alt: ['free electrons carry current'], type: 'concept' },
      { q: 'Why are metals malleable?', a: 'layers of atoms can slide past each other without breaking bonds', alt: ['delocalized electrons allow reshaping'], type: 'concept' },
      { q: 'What is an alloy?', a: 'a mixture of two or more metals', alt: ['metal mixture'], type: 'recall' },
      { q: 'Why are alloys often harder than pure metals?', a: 'different sized atoms disrupt regular layers preventing sliding', alt: ['atoms of different size resist sliding'], type: 'concept' },
      { q: 'Name a common alloy.', a: 'steel', alt: ['bronze', 'brass', 'stainless steel'], type: 'recall' },
    ],
  },
  'lewis-structures': {
    questions: [
      { q: 'What do dots represent in a Lewis structure?', a: 'valence electrons', type: 'recall' },
      { q: 'How many valence electrons does nitrogen have?', a: '5', alt: ['five'], type: 'recall' },
      { q: 'How many total valence electrons does CO2 have?', a: '16', alt: ['sixteen'], type: 'calculation' },
      { q: 'What is a lone pair?', a: 'a pair of electrons not involved in bonding', alt: ['nonbonding electron pair', 'unshared pair'], type: 'concept' },
      { q: 'What is the octet rule?', a: 'atoms tend to gain lose or share electrons to have 8 valence electrons', alt: ['8 electrons in outer shell'], type: 'concept' },
      { q: 'What are exceptions to the octet rule?', a: 'elements like b be p s and expanded octets', alt: ['boron hydrogen expanded octets'], type: 'recall' },
    ],
  },
  'vsepr-molecular-geometry': {
    questions: [
      { q: 'What does VSEPR stand for?', a: 'valence shell electron pair repulsion', type: 'recall' },
      { q: 'What molecular geometry does 4 bonding pairs and 0 lone pairs give?', a: 'tetrahedral', type: 'recall' },
      { q: 'What molecular geometry does 3 bonding pairs and 1 lone pair give?', a: 'trigonal pyramidal', alt: ['pyramidal'], type: 'recall' },
      { q: 'What molecular geometry does 2 bonding pairs and 2 lone pairs give?', a: 'bent', alt: ['angular', 'v-shaped'], type: 'recall' },
      { q: 'What is the bond angle in a tetrahedral molecule?', a: '109.5 degrees', alt: ['109.5'], type: 'recall' },
      { q: 'What is the geometry of CO2?', a: 'linear', type: 'recall' },
      { q: 'What geometry has 3 bonding pairs and 0 lone pairs?', a: 'trigonal planar', type: 'recall' },
      { q: 'What is the bond angle in a trigonal planar molecule?', a: '120 degrees', alt: ['120'], type: 'recall' },
    ],
  },
  'intermolecular-forces': {
    questions: [
      { q: 'What are the three main types of intermolecular forces?', a: 'london dispersion dipole-dipole hydrogen bonding', alt: ['ldf dipole-dipole h-bonding'], type: 'recall' },
      { q: 'Which IMF is the weakest?', a: 'london dispersion forces', alt: ['ldf', 'van der waals'], type: 'recall' },
      { q: 'What conditions are needed for hydrogen bonding?', a: 'h bonded to n o or f', alt: ['hydrogen attached to nitrogen oxygen or fluorine'], type: 'recall' },
      { q: 'How do intermolecular forces affect boiling point?', a: 'stronger imfs lead to higher boiling points', alt: ['stronger forces mean higher bp'], type: 'concept' },
      { q: 'Why do larger molecules have stronger London dispersion forces?', a: 'more electrons create larger temporary dipoles', alt: ['more surface area and electrons'], type: 'concept' },
      { q: 'Which has a higher boiling point: HF or HCl?', a: 'hf', alt: ['hydrogen fluoride'], type: 'recall' },
    ],
  },
  'polarity': {
    questions: [
      { q: 'What makes a molecule polar?', a: 'unequal electron sharing and asymmetric geometry', alt: ['asymmetric distribution of charge'], type: 'concept' },
      { q: 'Is CO2 polar or nonpolar?', a: 'nonpolar', type: 'recall' },
      { q: 'Is H2O polar or nonpolar?', a: 'polar', type: 'recall' },
      { q: 'Why is H2O polar even though it has polar bonds?', a: 'the bent geometry creates a net dipole', alt: ['asymmetric shape gives net dipole'], type: 'concept' },
      { q: 'Why is CO2 nonpolar even though it has polar bonds?', a: 'the linear geometry cancels the dipoles', alt: ['symmetric shape cancels dipoles'], type: 'concept' },
      { q: 'What does "like dissolves like" mean?', a: 'polar solutes dissolve in polar solvents and nonpolar in nonpolar', alt: ['similar polarity dissolves'], type: 'concept' },
    ],
  },
  'balancing-equations': {
    questions: [
      { q: 'What law requires chemical equations to be balanced?', a: 'law of conservation of mass', alt: ['conservation of mass'], type: 'recall' },
      { q: 'Balance: _H2 + _O2 -> _H2O', a: '2 1 2', alt: ['2h2 + o2 -> 2h2o'], type: 'calculation' },
      { q: 'Balance: _Fe + _O2 -> _Fe2O3', a: '4 3 2', alt: ['4fe + 3o2 -> 2fe2o3'], type: 'calculation' },
      { q: 'Balance: _CH4 + _O2 -> _CO2 + _H2O', a: '1 2 1 2', alt: ['ch4 + 2o2 -> co2 + 2h2o'], type: 'calculation' },
      { q: 'What can you change when balancing an equation?', a: 'coefficients only', alt: ['only the coefficients'], type: 'recall' },
      { q: 'Balance: _N2 + _H2 -> _NH3', a: '1 3 2', alt: ['n2 + 3h2 -> 2nh3'], type: 'calculation' },
    ],
  },
  'reaction-types': {
    questions: [
      { q: 'What is a synthesis reaction?', a: 'two or more substances combine to form one product', alt: ['a + b -> ab', 'combination reaction'], type: 'concept' },
      { q: 'What is a decomposition reaction?', a: 'one substance breaks into two or more products', alt: ['ab -> a + b'], type: 'concept' },
      { q: 'What is a single replacement reaction?', a: 'one element replaces another in a compound', alt: ['a + bc -> ac + b'], type: 'concept' },
      { q: 'What is a double replacement reaction?', a: 'ions in two compounds switch partners', alt: ['ab + cd -> ad + cb'], type: 'concept' },
      { q: 'What is a combustion reaction?', a: 'a substance reacts with oxygen producing heat and light', alt: ['burning with o2'], type: 'concept' },
      { q: 'What are the products of complete combustion of a hydrocarbon?', a: 'co2 and h2o', alt: ['carbon dioxide and water'], type: 'recall' },
    ],
  },
  'net-ionic-equations': {
    questions: [
      { q: 'What is a spectator ion?', a: 'an ion that appears unchanged on both sides of the equation', alt: ['ion not involved in the reaction'], type: 'concept' },
      { q: 'What is a net ionic equation?', a: 'an equation showing only the species that participate in the reaction', alt: ['equation without spectator ions'], type: 'concept' },
      { q: 'In the reaction NaCl(aq) + AgNO3(aq), what is the precipitate?', a: 'agcl', alt: ['silver chloride'], type: 'recall' },
      { q: 'What does (aq) mean after a formula?', a: 'dissolved in water', alt: ['aqueous', 'in solution'], type: 'recall' },
      { q: 'How do you determine what dissociates in solution?', a: 'strong electrolytes (strong acids bases and soluble salts) fully dissociate', alt: ['soluble ionic compounds and strong acids/bases'], type: 'concept' },
      { q: 'What is a precipitate?', a: 'an insoluble solid formed in a reaction', alt: ['solid product from mixing solutions'], type: 'concept' },
    ],
  },
  'oxidation-states': {
    questions: [
      { q: 'What is oxidation?', a: 'loss of electrons', alt: ['losing electrons', 'increase in oxidation state'], type: 'recall' },
      { q: 'What is reduction?', a: 'gain of electrons', alt: ['gaining electrons', 'decrease in oxidation state'], type: 'recall' },
      { q: 'What mnemonic helps remember oxidation and reduction?', a: 'oil rig', alt: ['oilrig', 'oxidation is loss reduction is gain'], type: 'recall' },
      { q: 'What is the oxidation state of oxygen in most compounds?', a: '-2', alt: ['minus 2'], type: 'recall' },
      { q: 'What is the oxidation state of hydrogen in most compounds?', a: '+1', alt: ['plus 1'], type: 'recall' },
      { q: 'What is the oxidation state of any element in its elemental form?', a: '0', alt: ['zero'], type: 'recall' },
    ],
  },
  'activity-series': {
    questions: [
      { q: 'What does the activity series rank?', a: 'metals by their reactivity', alt: ['how easily metals lose electrons'], type: 'concept' },
      { q: 'Can a less active metal replace a more active metal in a compound?', a: 'no', type: 'tf' },
      { q: 'Is lithium or gold more reactive?', a: 'lithium', type: 'recall' },
      { q: 'Can zinc replace copper in CuSO4 solution?', a: 'yes', type: 'tf' },
      { q: 'Can copper replace silver in AgNO3 solution?', a: 'yes', type: 'tf' },
      { q: 'Why are noble metals like gold and platinum at the bottom of the activity series?', a: 'they are very unreactive and resistant to oxidation', alt: ['least reactive metals'], type: 'concept' },
    ],
  },
  'predicting-products': {
    questions: [
      { q: 'What are the products of NaOH + HCl?', a: 'nacl + h2o', alt: ['sodium chloride and water', 'salt and water'], type: 'recall' },
      { q: 'What type of reaction is: 2Na + Cl2 -> 2NaCl?', a: 'synthesis', alt: ['combination'], type: 'recall' },
      { q: 'What type of reaction is: CaCO3 -> CaO + CO2?', a: 'decomposition', type: 'recall' },
      { q: 'Predict: Mg + 2HCl -> ?', a: 'mgcl2 + h2', alt: ['magnesium chloride and hydrogen gas'], type: 'recall' },
      { q: 'What forms when an acid reacts with a base?', a: 'salt and water', alt: ['water and a salt'], type: 'recall' },
      { q: 'Complete combustion of C3H8 produces what?', a: '3co2 + 4h2o', alt: ['carbon dioxide and water'], type: 'recall' },
    ],
  },
  'mole-concept': {
    questions: [
      { q: 'What is a mole?', a: '6.022 x 10^23 particles', alt: ['avogadros number of particles'], type: 'recall' },
      { q: "What is Avogadro's number?", a: '6.022 x 10^23', alt: ['6.022e23', '6.02 x 10^23'], type: 'recall' },
      { q: 'What is molar mass?', a: 'the mass of one mole of a substance in grams', alt: ['grams per mole'], type: 'concept' },
      { q: 'What is the molar mass of water (H2O)?', a: '18 g/mol', alt: ['18', '18.02'], type: 'recall' },
      { q: 'How many molecules are in 2 moles of H2O?', a: '1.204 x 10^24', alt: ['about 1.2 x 10^24', '12.04 x 10^23'], type: 'calculation' },
      { q: 'How do you convert grams to moles?', a: 'divide by molar mass', alt: ['grams / molar mass'], type: 'recall' },
    ],
  },
  'molar-mass': {
    questions: [
      { q: 'What is the molar mass of NaCl?', a: '58.44 g/mol', alt: ['58.44', '58.5'], type: 'calculation' },
      { q: 'What is the molar mass of CO2?', a: '44.01 g/mol', alt: ['44', '44.01'], type: 'calculation' },
      { q: 'What is the molar mass of O2?', a: '32 g/mol', alt: ['32', '32.00'], type: 'calculation' },
      { q: 'Where do you find atomic masses for calculating molar mass?', a: 'the periodic table', alt: ['periodic table'], type: 'recall' },
      { q: 'What is the molar mass of glucose (C6H12O6)?', a: '180 g/mol', alt: ['180', '180.16'], type: 'calculation' },
      { q: 'What is the molar mass of CaCO3?', a: '100.09 g/mol', alt: ['100', '100.09'], type: 'calculation' },
    ],
  },
  'mole-conversions': {
    questions: [
      { q: 'How many moles are in 36 grams of water?', a: '2 moles', alt: ['2', 'two'], type: 'calculation' },
      { q: 'What is the mass of 0.5 moles of NaCl?', a: '29.22 g', alt: ['29.2', 'about 29 g'], type: 'calculation' },
      { q: 'How many moles are in 3.011 x 10^23 atoms of carbon?', a: '0.5', alt: ['0.5 moles', 'half a mole'], type: 'calculation' },
      { q: 'What volume does 1 mole of any gas occupy at STP?', a: '22.4 l', alt: ['22.4 liters', '22.4'], type: 'recall' },
      { q: 'How many grams is 3 moles of O2?', a: '96 g', alt: ['96', '96 grams'], type: 'calculation' },
      { q: 'Convert 88 g of CO2 to moles.', a: '2 moles', alt: ['2'], type: 'calculation' },
    ],
  },
  'mass-to-mass': {
    questions: [
      { q: 'In 2H2 + O2 -> 2H2O, how many grams of water form from 4g of H2?', a: '36 g', alt: ['36', '36 grams'], type: 'calculation' },
      { q: 'What is the first step in a mass-to-mass stoichiometry problem?', a: 'convert grams to moles', alt: ['find moles of given'], type: 'recall' },
      { q: 'What ratio do you use to convert moles of reactant to moles of product?', a: 'mole ratio from the balanced equation', alt: ['coefficient ratio', 'stoichiometric ratio'], type: 'concept' },
      { q: 'In N2 + 3H2 -> 2NH3, how many moles of NH3 from 3 moles of H2?', a: '2', alt: ['2 moles'], type: 'calculation' },
      { q: 'What is the last step in a mass-to-mass calculation?', a: 'convert moles to grams', alt: ['moles times molar mass'], type: 'recall' },
      { q: 'What are the three steps of stoichiometry in order?', a: 'grams to moles mole ratio moles to grams', alt: ['g->mol->mol->g'], type: 'recall' },
    ],
  },
  'limiting-reagent': {
    questions: [
      { q: 'What is the limiting reagent?', a: 'the reactant that runs out first and limits the amount of product', alt: ['reactant that is completely consumed'], type: 'concept' },
      { q: 'What is the excess reagent?', a: 'the reactant left over after the reaction', alt: ['reactant not fully consumed'], type: 'concept' },
      { q: 'How do you determine the limiting reagent?', a: 'calculate moles of product from each reactant and the one giving less product is limiting', alt: ['compare mole ratios'], type: 'concept' },
      { q: 'In 2H2 + O2 -> 2H2O, if you have 3 mol H2 and 2 mol O2, what limits?', a: 'h2', alt: ['hydrogen'], type: 'calculation' },
      { q: 'How much product is calculated using the limiting or excess reagent?', a: 'limiting', alt: ['limiting reagent'], type: 'recall' },
      { q: 'If you have 10g of Na and 10g of Cl2, which is limiting in 2Na + Cl2 -> 2NaCl?', a: 'cl2', alt: ['chlorine'], type: 'calculation' },
    ],
  },
  'percent-yield': {
    questions: [
      { q: 'What is the formula for percent yield?', a: 'actual yield / theoretical yield x 100', alt: ['(actual/theoretical) x 100'], type: 'recall' },
      { q: 'What is theoretical yield?', a: 'the maximum amount of product predicted by stoichiometry', alt: ['calculated product amount'], type: 'concept' },
      { q: 'What is actual yield?', a: 'the amount of product actually obtained in the experiment', alt: ['measured product amount'], type: 'concept' },
      { q: 'Can percent yield be greater than 100%?', a: 'not ideally but it can due to impurities or measurement error', alt: ['usually no'], type: 'concept' },
      { q: 'If theoretical yield is 50g and actual yield is 40g, what is percent yield?', a: '80%', alt: ['80', 'eighty percent'], type: 'calculation' },
      { q: 'Why is actual yield usually less than theoretical yield?', a: 'side reactions incomplete reactions and losses during collection', alt: ['not all reactants convert', 'practical losses'], type: 'concept' },
    ],
  },
  'solution-stoichiometry': {
    questions: [
      { q: 'What is molarity?', a: 'moles of solute per liter of solution', alt: ['mol/l', 'concentration in mol/l'], type: 'concept' },
      { q: 'What is the dilution equation?', a: 'm1v1 = m2v2', alt: ['c1v1 = c2v2'], type: 'recall' },
      { q: 'How many moles are in 500 mL of 2M NaCl?', a: '1 mole', alt: ['1'], type: 'calculation' },
      { q: 'What volume of 0.5M HCl contains 0.25 moles?', a: '500 ml', alt: ['0.5 l', '500', '0.5 liters'], type: 'calculation' },
      { q: 'What is a titration?', a: 'a procedure to determine concentration using a known solution', alt: ['adding solution of known concentration to find unknown'], type: 'concept' },
      { q: 'At the equivalence point of a titration, what is true?', a: 'moles of acid equal moles of base', alt: ['stoichiometric amounts have reacted'], type: 'concept' },
    ],
  },
  'kinetic-molecular-theory': {
    questions: [
      { q: 'What does kinetic molecular theory describe?', a: 'the behavior of particles in gases', alt: ['gas particle motion and properties'], type: 'concept' },
      { q: 'What is the relationship between temperature and average kinetic energy?', a: 'directly proportional', alt: ['higher temp means higher ke'], type: 'concept' },
      { q: 'In an ideal gas, are there attractive forces between particles?', a: 'no', type: 'tf' },
      { q: 'What causes gas pressure?', a: 'collisions of gas particles with container walls', alt: ['particle collisions with walls'], type: 'concept' },
      { q: 'What is a Maxwell-Boltzmann distribution?', a: 'a graph showing the range of particle speeds in a gas', alt: ['speed distribution of gas molecules'], type: 'concept' },
      { q: 'What happens to particle speed when temperature increases?', a: 'average speed increases', alt: ['particles move faster'], type: 'recall' },
    ],
  },
  'gas-laws': {
    questions: [
      { q: "What is Boyle's law?", a: 'at constant temperature pressure and volume are inversely proportional', alt: ['p1v1 = p2v2', 'pv = constant'], type: 'concept' },
      { q: "What is Charles's law?", a: 'at constant pressure volume and temperature are directly proportional', alt: ['v1/t1 = v2/t2'], type: 'concept' },
      { q: "What is Gay-Lussac's law?", a: 'at constant volume pressure and temperature are directly proportional', alt: ['p1/t1 = p2/t2'], type: 'concept' },
      { q: 'What temperature scale must be used in gas law calculations?', a: 'kelvin', alt: ['k'], type: 'recall' },
      { q: 'If you double the pressure on a gas at constant temperature, what happens to volume?', a: 'it is halved', alt: ['cut in half', 'decreases by half'], type: 'concept' },
      { q: "What is Dalton's law of partial pressures?", a: 'total pressure equals the sum of partial pressures', alt: ['ptotal = p1 + p2 + ...'], type: 'concept' },
    ],
  },
  'ideal-gas-law': {
    questions: [
      { q: 'What is the ideal gas law equation?', a: 'pv = nrt', alt: ['pv=nrt'], type: 'recall' },
      { q: 'What does R represent in PV=nRT?', a: 'the ideal gas constant', alt: ['gas constant', '0.0821 l atm / mol k', '8.314 j/mol k'], type: 'recall' },
      { q: 'What are the conditions at STP?', a: '0 degrees celsius and 1 atm', alt: ['273 k and 1 atm', '273.15 k and 101.325 kpa'], type: 'recall' },
      { q: 'What volume does 2 moles of gas occupy at STP?', a: '44.8 l', alt: ['44.8 liters', '44.8'], type: 'calculation' },
      { q: 'When does a real gas deviate most from ideal behavior?', a: 'at high pressure and low temperature', alt: ['high p low t'], type: 'concept' },
      { q: 'Calculate pressure if n=1mol, T=273K, V=22.4L.', a: '1 atm', alt: ['1', 'one atmosphere'], type: 'calculation' },
    ],
  },
  'phase-changes': {
    questions: [
      { q: 'What is melting?', a: 'solid to liquid', alt: ['solid -> liquid'], type: 'recall' },
      { q: 'What is vaporization?', a: 'liquid to gas', alt: ['liquid -> gas'], type: 'recall' },
      { q: 'What is sublimation?', a: 'solid to gas', alt: ['solid -> gas directly'], type: 'recall' },
      { q: 'What is deposition?', a: 'gas to solid', alt: ['gas -> solid directly'], type: 'recall' },
      { q: 'Is energy absorbed or released during melting?', a: 'absorbed', alt: ['endothermic'], type: 'recall' },
      { q: 'Is energy absorbed or released during condensation?', a: 'released', alt: ['exothermic'], type: 'recall' },
    ],
  },
  'heating-curves': {
    questions: [
      { q: 'What happens to temperature during a phase change on a heating curve?', a: 'it remains constant', alt: ['stays the same', 'plateau'], type: 'concept' },
      { q: 'What is the flat section at 0 degrees C on a water heating curve?', a: 'melting or freezing', alt: ['phase change from solid to liquid'], type: 'recall' },
      { q: 'What is the flat section at 100 degrees C on a water heating curve?', a: 'boiling or condensation', alt: ['phase change from liquid to gas'], type: 'recall' },
      { q: 'Where is the energy going during a phase change plateau?', a: 'breaking or forming intermolecular forces', alt: ['overcoming imfs', 'changing potential energy'], type: 'concept' },
      { q: 'What formula calculates energy during a temperature change?', a: 'q = mcdeltaT', alt: ['q = mc delta t', 'q equals m c delta t'], type: 'recall' },
      { q: 'What formula calculates energy during a phase change?', a: 'q = m times heat of fusion or vaporization', alt: ['q = mhf or q = mhv', 'q = ml'], type: 'recall' },
    ],
  },
  'vapor-pressure': {
    questions: [
      { q: 'What is vapor pressure?', a: 'the pressure exerted by a vapor in equilibrium with its liquid', alt: ['pressure of gas above a liquid'], type: 'concept' },
      { q: 'How does temperature affect vapor pressure?', a: 'higher temperature increases vapor pressure', alt: ['directly proportional'], type: 'concept' },
      { q: 'When does boiling occur?', a: 'when vapor pressure equals atmospheric pressure', alt: ['vp = atm pressure'], type: 'concept' },
      { q: 'Which has a higher vapor pressure: a volatile or nonvolatile liquid?', a: 'volatile', type: 'recall' },
      { q: 'What is a volatile liquid?', a: 'a liquid that evaporates easily', alt: ['high vapor pressure liquid'], type: 'concept' },
      { q: 'How does elevation affect boiling point?', a: 'higher elevation means lower atmospheric pressure so lower boiling point', alt: ['lower bp at higher altitude'], type: 'concept' },
    ],
  },
  'solubility': {
    questions: [
      { q: 'What is solubility?', a: 'the maximum amount of solute that dissolves in a given amount of solvent', alt: ['how much dissolves'], type: 'concept' },
      { q: 'What does "saturated" mean?', a: 'the solution contains the maximum amount of dissolved solute', alt: ['no more solute can dissolve'], type: 'concept' },
      { q: 'How does temperature generally affect solubility of solids?', a: 'solubility increases with temperature', alt: ['more dissolves at higher temp'], type: 'concept' },
      { q: 'How does temperature affect solubility of gases?', a: 'solubility decreases with temperature', alt: ['less gas dissolves when hot'], type: 'concept' },
      { q: 'How does pressure affect gas solubility?', a: 'higher pressure increases gas solubility', alt: ["henry's law", 'more gas dissolves at higher pressure'], type: 'concept' },
      { q: 'What is a supersaturated solution?', a: 'a solution containing more solute than it can normally hold at that temperature', alt: ['beyond saturated'], type: 'concept' },
    ],
  },
  'concentration-units': {
    questions: [
      { q: 'What is molarity (M)?', a: 'moles of solute per liter of solution', alt: ['mol/l'], type: 'recall' },
      { q: 'What is molality (m)?', a: 'moles of solute per kilogram of solvent', alt: ['mol/kg'], type: 'recall' },
      { q: 'What is mass percent?', a: 'mass of solute divided by total mass times 100', alt: ['(mass solute / total mass) x 100'], type: 'recall' },
      { q: 'What is parts per million (ppm)?', a: 'mg of solute per liter of solution or mg per kg', alt: ['1 part in 1 million'], type: 'recall' },
      { q: 'Which concentration unit changes with temperature: molarity or molality?', a: 'molarity', type: 'recall' },
      { q: 'Why does molarity change with temperature?', a: 'volume changes with temperature but mass does not', alt: ['volume expands or contracts'], type: 'concept' },
    ],
  },
  'molarity': {
    questions: [
      { q: 'What is the molarity of a solution with 2 mol NaCl in 500 mL?', a: '4 m', alt: ['4', '4 mol/l'], type: 'calculation' },
      { q: 'How many moles are in 250 mL of 0.1M HCl?', a: '0.025 mol', alt: ['0.025', '25 mmol'], type: 'calculation' },
      { q: 'What volume of 2M NaOH contains 0.5 mol?', a: '250 ml', alt: ['0.25 l', '250'], type: 'calculation' },
      { q: 'How do you prepare 1L of 0.5M NaCl?', a: 'dissolve 29.22g nacl in water to make 1l of solution', alt: ['29.2g nacl diluted to 1l'], type: 'concept' },
      { q: 'What is the formula for molarity?', a: 'm = mol / l', alt: ['m = n/v', 'moles divided by liters'], type: 'recall' },
      { q: 'Convert 2.5L of 0.2M to moles.', a: '0.5 mol', alt: ['0.5'], type: 'calculation' },
    ],
  },
  'dilution': {
    questions: [
      { q: 'What is the dilution equation?', a: 'm1v1 = m2v2', alt: ['c1v1 = c2v2'], type: 'recall' },
      { q: 'You dilute 100mL of 6M HCl to 600mL. What is the new concentration?', a: '1 m', alt: ['1', '1 mol/l'], type: 'calculation' },
      { q: 'What happens to concentration when you add solvent?', a: 'it decreases', alt: ['gets more dilute'], type: 'concept' },
      { q: 'How much 12M HCl do you need to make 500mL of 3M?', a: '125 ml', alt: ['125'], type: 'calculation' },
      { q: 'Does dilution change the number of moles of solute?', a: 'no', type: 'tf' },
      { q: 'When diluting acids, should you add acid to water or water to acid?', a: 'add acid to water', alt: ['acid to water'], type: 'recall' },
    ],
  },
  'colligative-properties': {
    questions: [
      { q: 'What are colligative properties?', a: 'properties that depend on the number of solute particles not their identity', alt: ['properties based on particle count'], type: 'concept' },
      { q: 'Name four colligative properties.', a: 'boiling point elevation freezing point depression vapor pressure lowering osmotic pressure', alt: ['bp elevation fp depression vp lowering osmosis'], type: 'recall' },
      { q: 'How does adding salt to water affect its boiling point?', a: 'raises it', alt: ['increases', 'higher boiling point'], type: 'recall' },
      { q: 'How does adding salt to water affect its freezing point?', a: 'lowers it', alt: ['decreases', 'lower freezing point'], type: 'recall' },
      { q: 'Why do we salt roads in winter?', a: 'to lower the freezing point of water', alt: ['freezing point depression'], type: 'concept' },
      { q: 'Which produces more particles in solution: NaCl or glucose?', a: 'nacl', alt: ['sodium chloride'], type: 'recall' },
    ],
  },
  'solubility-rules': {
    questions: [
      { q: 'Are all sodium and potassium salts soluble?', a: 'yes', type: 'tf' },
      { q: 'Are all nitrate salts soluble?', a: 'yes', type: 'tf' },
      { q: 'Is AgCl soluble or insoluble?', a: 'insoluble', type: 'recall' },
      { q: 'Is NaNO3 soluble or insoluble?', a: 'soluble', type: 'recall' },
      { q: 'Are most carbonates soluble or insoluble?', a: 'insoluble', alt: ['insoluble except group 1 and ammonium'], type: 'recall' },
      { q: 'Are most hydroxides soluble or insoluble?', a: 'insoluble', alt: ['insoluble except group 1 and some group 2'], type: 'recall' },
    ],
  },
  'acid-base-definitions': {
    questions: [
      { q: 'What is an Arrhenius acid?', a: 'produces h+ ions in water', alt: ['releases hydrogen ions in solution'], type: 'concept' },
      { q: 'What is a Bronsted-Lowry acid?', a: 'a proton donor', alt: ['donates h+'], type: 'concept' },
      { q: 'What is a Bronsted-Lowry base?', a: 'a proton acceptor', alt: ['accepts h+'], type: 'concept' },
      { q: 'What is a Lewis acid?', a: 'an electron pair acceptor', alt: ['accepts electron pair'], type: 'concept' },
      { q: 'What is a Lewis base?', a: 'an electron pair donor', alt: ['donates electron pair'], type: 'concept' },
      { q: 'What is a conjugate acid-base pair?', a: 'two species that differ by one proton', alt: ['acid and its deprotonated form'], type: 'concept' },
    ],
  },
  'ph-scale': {
    questions: [
      { q: 'What does pH measure?', a: 'the concentration of hydrogen ions in a solution', alt: ['acidity', 'h+ concentration'], type: 'concept' },
      { q: 'What is the pH range?', a: '0 to 14', alt: ['0-14'], type: 'recall' },
      { q: 'Is a solution with pH 3 acidic or basic?', a: 'acidic', type: 'recall' },
      { q: 'What is the pH of a neutral solution at 25C?', a: '7', type: 'recall' },
      { q: 'What is the formula for pH?', a: 'ph = -log[h+]', alt: ['negative log of hydrogen ion concentration'], type: 'recall' },
      { q: 'If [H+] = 10^-4 M, what is the pH?', a: '4', type: 'calculation' },
    ],
  },
  'strong-vs-weak': {
    questions: [
      { q: 'What is a strong acid?', a: 'an acid that completely ionizes in water', alt: ['fully dissociates'], type: 'concept' },
      { q: 'Name three strong acids.', a: 'hcl hno3 h2so4', alt: ['hydrochloric nitric sulfuric'], type: 'recall' },
      { q: 'What is a weak acid?', a: 'an acid that only partially ionizes in water', alt: ['partially dissociates'], type: 'concept' },
      { q: 'Is acetic acid strong or weak?', a: 'weak', type: 'recall' },
      { q: 'Name a strong base.', a: 'naoh', alt: ['sodium hydroxide', 'koh', 'potassium hydroxide'], type: 'recall' },
      { q: 'Does strong vs weak refer to concentration?', a: 'no it refers to degree of ionization', alt: ['no'], type: 'concept' },
    ],
  },
  'ka-kb': {
    questions: [
      { q: 'What is Ka?', a: 'the acid dissociation constant', alt: ['acid ionization constant', 'equilibrium constant for acid dissociation'], type: 'concept' },
      { q: 'A larger Ka means what?', a: 'a stronger acid', alt: ['more ionization', 'more dissociation'], type: 'concept' },
      { q: 'What is the relationship between Ka and Kb for a conjugate pair?', a: 'ka x kb = kw', alt: ['ka times kb equals 10^-14'], type: 'recall' },
      { q: 'What is Kw at 25C?', a: '1.0 x 10^-14', alt: ['10^-14'], type: 'recall' },
      { q: 'If Ka for an acid is 1.8 x 10^-5, is it strong or weak?', a: 'weak', type: 'recall' },
      { q: 'What is pKa?', a: '-log(ka)', alt: ['negative log of ka'], type: 'recall' },
    ],
  },
  'buffers': {
    questions: [
      { q: 'What is a buffer?', a: 'a solution that resists changes in ph', alt: ['solution that maintains stable ph'], type: 'concept' },
      { q: 'What components make up a buffer?', a: 'a weak acid and its conjugate base', alt: ['weak acid + salt of conjugate base', 'weak base + conjugate acid'], type: 'recall' },
      { q: 'What is the Henderson-Hasselbalch equation?', a: 'ph = pka + log([a-]/[ha])', alt: ['ph = pka + log(base/acid)'], type: 'recall' },
      { q: 'What happens when you add a small amount of acid to a buffer?', a: 'the conjugate base neutralizes it and ph stays nearly constant', alt: ['base component neutralizes acid'], type: 'concept' },
      { q: 'Buffer capacity is highest when what condition is met?', a: 'when concentrations of acid and conjugate base are equal', alt: ['ph = pka', 'equal amounts'], type: 'concept' },
      { q: 'Give an example of a biological buffer system.', a: 'carbonic acid bicarbonate buffer', alt: ['h2co3/hco3-', 'blood buffer'], type: 'recall' },
    ],
  },
  'titration': {
    questions: [
      { q: 'What is the equivalence point?', a: 'the point where moles of acid equal moles of base', alt: ['stoichiometric point', 'complete neutralization'], type: 'concept' },
      { q: 'What is an indicator?', a: 'a substance that changes color at a specific ph range', alt: ['chemical that shows endpoint'], type: 'concept' },
      { q: 'What indicator is commonly used in strong acid-strong base titrations?', a: 'phenolphthalein', type: 'recall' },
      { q: 'What is the pH at the equivalence point of a strong acid-strong base titration?', a: '7', type: 'recall' },
      { q: 'In a titration of weak acid with strong base, is the equivalence point above or below 7?', a: 'above 7', alt: ['basic', 'greater than 7'], type: 'recall' },
      { q: 'What is the endpoint of a titration?', a: 'the point where the indicator changes color', alt: ['visible color change'], type: 'concept' },
    ],
  },
  'neutralization': {
    questions: [
      { q: 'What is a neutralization reaction?', a: 'an acid reacts with a base to form salt and water', alt: ['acid + base -> salt + water'], type: 'concept' },
      { q: 'What is the net ionic equation for neutralization of a strong acid and strong base?', a: 'h+ + oh- -> h2o', alt: ['hydrogen ion plus hydroxide yields water'], type: 'recall' },
      { q: 'What salt forms from HCl + NaOH?', a: 'nacl', alt: ['sodium chloride'], type: 'recall' },
      { q: 'What is produced when H2SO4 reacts with KOH?', a: 'k2so4 and h2o', alt: ['potassium sulfate and water'], type: 'recall' },
      { q: 'Is neutralization exothermic or endothermic?', a: 'exothermic', type: 'recall' },
      { q: 'How many moles of NaOH are needed to neutralize 1 mole of H2SO4?', a: '2', alt: ['two'], type: 'calculation' },
    ],
  },
  'exo-endothermic': {
    questions: [
      { q: 'What is an exothermic reaction?', a: 'a reaction that releases energy to the surroundings', alt: ['gives off heat'], type: 'concept' },
      { q: 'What is an endothermic reaction?', a: 'a reaction that absorbs energy from the surroundings', alt: ['takes in heat'], type: 'concept' },
      { q: 'Is the sign of delta H negative for exothermic or endothermic?', a: 'exothermic', type: 'recall' },
      { q: 'Is combustion exothermic or endothermic?', a: 'exothermic', type: 'recall' },
      { q: 'Is photosynthesis exothermic or endothermic?', a: 'endothermic', type: 'recall' },
      { q: 'In an energy diagram, which has higher energy for an exothermic reaction: reactants or products?', a: 'reactants', type: 'recall' },
    ],
  },
  'calorimetry': {
    questions: [
      { q: 'What is calorimetry?', a: 'the measurement of heat changes in a reaction', alt: ['measuring heat transfer'], type: 'concept' },
      { q: 'What is the formula for heat transfer?', a: 'q = mcdeltaT', alt: ['q = mc delta t'], type: 'recall' },
      { q: 'What is the specific heat of water?', a: '4.184 j/g c', alt: ['4.184', '4.18 j/gc'], type: 'recall' },
      { q: 'If 100g of water increases by 10C, how much heat was absorbed?', a: '4184 j', alt: ['4184', '4.184 kj'], type: 'calculation' },
      { q: 'What is a coffee cup calorimeter used for?', a: 'measuring heat at constant pressure', alt: ['simple calorimetry'], type: 'recall' },
      { q: 'What is a bomb calorimeter used for?', a: 'measuring heat at constant volume', alt: ['combustion calorimetry'], type: 'recall' },
    ],
  },
  'hess-law': {
    questions: [
      { q: "What does Hess's law state?", a: 'the total enthalpy change is the same regardless of the pathway', alt: ['enthalpy is a state function'], type: 'concept' },
      { q: 'How do you use Hess\'s law?', a: 'add enthalpy changes of individual steps to find overall delta h', alt: ['sum the steps'], type: 'concept' },
      { q: 'If you reverse a reaction, what happens to delta H?', a: 'the sign changes', alt: ['it becomes opposite'], type: 'recall' },
      { q: 'If you multiply a reaction by a coefficient, what happens to delta H?', a: 'it is multiplied by the same coefficient', alt: ['delta h is also multiplied'], type: 'recall' },
      { q: 'What is standard enthalpy of formation?', a: 'delta h for forming one mole of a compound from its elements in standard states', alt: ['delta hf'], type: 'concept' },
      { q: 'What is the standard enthalpy of formation of an element in its standard state?', a: '0', alt: ['zero'], type: 'recall' },
    ],
  },
  'bond-energies': {
    questions: [
      { q: 'Does breaking bonds require or release energy?', a: 'require', alt: ['requires energy', 'endothermic'], type: 'recall' },
      { q: 'Does forming bonds require or release energy?', a: 'release', alt: ['releases energy', 'exothermic'], type: 'recall' },
      { q: 'How do you estimate delta H using bond energies?', a: 'sum of bonds broken minus sum of bonds formed', alt: ['energy in - energy out'], type: 'concept' },
      { q: 'If it takes more energy to break bonds than is released forming new ones, is the reaction endothermic or exothermic?', a: 'endothermic', type: 'recall' },
      { q: 'Which is stronger: a single bond or a double bond?', a: 'double bond', type: 'recall' },
      { q: 'Which is shorter: a single bond or a triple bond?', a: 'triple bond', type: 'recall' },
    ],
  },
  'enthalpy-of-formation': {
    questions: [
      { q: 'What symbol represents standard enthalpy of formation?', a: 'delta hf degree', alt: ['delta hf', 'delta h naught f'], type: 'recall' },
      { q: 'How do you calculate delta H for a reaction using enthalpies of formation?', a: 'sum of delta hf products minus sum of delta hf reactants', alt: ['products - reactants'], type: 'concept' },
      { q: 'What is the enthalpy of formation of O2(g)?', a: '0', alt: ['zero'], type: 'recall' },
      { q: 'What is the standard state of carbon?', a: 'graphite', type: 'recall' },
      { q: 'What conditions define standard state?', a: '25 degrees c and 1 atm', alt: ['298 k and 1 atm'], type: 'recall' },
      { q: 'Can enthalpies of formation be used with Hess\'s law?', a: 'yes', type: 'tf' },
    ],
  },
  'entropy-gibbs': {
    questions: [
      { q: 'What is entropy?', a: 'a measure of disorder or randomness in a system', alt: ['measure of dispersal of energy'], type: 'concept' },
      { q: 'What is the Gibbs free energy equation?', a: 'delta g = delta h - t delta s', alt: ['dg = dh - tds'], type: 'recall' },
      { q: 'If delta G is negative, is the reaction spontaneous?', a: 'yes', type: 'tf' },
      { q: 'What combination of delta H and delta S is always spontaneous?', a: 'negative delta h and positive delta s', alt: ['exothermic with increasing entropy'], type: 'concept' },
      { q: 'What does it mean when delta G = 0?', a: 'the system is at equilibrium', alt: ['equilibrium'], type: 'concept' },
      { q: 'Does entropy generally increase or decrease when a solid dissolves?', a: 'increases', type: 'recall' },
    ],
  },
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
  return { studentId: id, level: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
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

function generateExercise(skill, count = 5) {
  const bank = CONTENT_BANKS[skill];
  if (!bank || !bank.questions) return { error: `No content bank for skill: ${skill}` };
  const items = pick(bank.questions, count).map(q => ({
    prompt: q.q, answer: q.a, type: q.type,
    ...(q.alt ? { acceptedAnswers: [q.a, ...q.alt] } : {}),
  }));
  return { skill, count: items.length, items };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(r => norm(r) === norm(answer));
  return norm(expected) === norm(answer);
}

// Public API

class Chemistry {
  getProfile(id) { const p = loadProfile(id); return { studentId: p.studentId, level: p.level, createdAt: p.createdAt, totalAssessments: p.assessments.length }; }

  setLevel(id, level) {
    const valid = ['standard', 'ap'];
    if (!valid.includes(level)) throw new Error(`Unknown level: ${level}. Valid: ${valid.join(', ')}`);
    const p = loadProfile(id); p.level = level; saveProfile(p);
    return { studentId: id, level };
  }

  recordAssessment(id, skill, score, total, notes = '') {
    if (!CONTENT_BANKS[skill]) throw new Error(`Unknown skill: ${skill}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id);
    const entry = { date: new Date().toISOString(), skill, score, total, notes };
    p.assessments.push(entry);
    if (!p.skills[skill]) p.skills[skill] = { attempts: [] };
    p.skills[skill].attempts.push({ date: entry.date, score, total });
    p.skills[skill].mastery = calcMastery(p.skills[skill].attempts);
    p.skills[skill].label = masteryLabel(p.skills[skill].mastery);
    saveProfile(p);
    return { studentId: id, skill, score: `${score}/${total}`, mastery: p.skills[skill].mastery, label: p.skills[skill].label };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const results = {};
    let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(SKILLS)) {
      results[cat] = {};
      for (const sk of skills) {
        total++;
        const d = p.skills[sk];
        results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
      }
    }
    return { studentId: id, level: p.level, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id);
    const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS)) {
      for (const sk of skills) {
        const d = p.skills[sk];
        const m = d ? d.mastery : 0;
        if (m < MASTERY_THRESHOLD) candidates.push({ category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' });
      }
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, next: candidates.slice(0, count) };
  }

  getReport(id) { const p = loadProfile(id); return { studentId: id, level: p.level, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }

  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }

  getSkillCatalog() {
    const catalog = {};
    let total = 0;
    for (const [cat, skills] of Object.entries(SKILLS)) { total += skills.length; catalog[cat] = [...skills]; }
    return { skills: catalog, totalSkills: total };
  }

  generateExercise(skill, count = 5) { return generateExercise(skill, count); }

  generateLesson(id) {
    const p = loadProfile(id);
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: 'All skills are proficient!', level: p.level };
    const exercise = generateExercise(target.skill, 5);
    return {
      studentId: id, level: p.level, targetSkill: target, exercise,
      lessonPlan: {
        review: 'Review previously learned concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: `Connect ${target.skill} to real-world chemistry applications`,
      },
    };
  }

  checkAnswer(type, expected, answer) {
    let exp = expected;
    try { exp = JSON.parse(expected); } catch {}
    if (Array.isArray(exp)) return { correct: exp.some(r => norm(r) === norm(answer)), expected: exp, studentAnswer: answer };
    return { correct: norm(exp) === norm(answer), expected: exp, studentAnswer: answer };
  }
}

module.exports = Chemistry;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new Chemistry();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': { const [, id, level] = args; if (!id) throw new Error('Usage: start <id> [level]'); if (level) api.setLevel(id, level); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); if (skill) { out(api.generateExercise(skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); out(api.checkAnswer(type, expected, answer)); break; }
      case 'record': { const [, id, skill, sc, tot, ...notes] = args; if (!id || !skill || !sc || !tot) throw new Error('Usage: record <id> <skill> <score> <total>'); out(api.recordAssessment(id, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { out(api.getSkillCatalog()); break; }
      case 'students': { out(api.listStudents()); break; }
      default: out({ usage: 'node chemistry.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students'] });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
