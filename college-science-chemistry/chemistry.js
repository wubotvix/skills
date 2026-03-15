// College Chemistry Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-science-chemistry');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'introductory': {
    'atomic-theory': ['quantum-numbers', 'electron-configurations', 'periodic-trends', 'effective-nuclear-charge', 'atomic-spectra'],
    'chemical-bonding-advanced': ['lewis-structures', 'vsepr-geometry', 'hybridization', 'molecular-orbital-theory', 'bond-polarity'],
    'thermodynamics': ['enthalpy', 'hess-law', 'entropy-intro', 'gibbs-free-energy', 'calorimetry'],
    'kinetics': ['rate-laws', 'reaction-order', 'integrated-rate-laws', 'arrhenius-equation', 'catalysis'],
  },
  'intermediate': {
    'equilibrium': ['equilibrium-constants', 'ice-tables', 'le-chatelier', 'reaction-quotient', 'solubility-product'],
    'electrochemistry': ['galvanic-cells', 'standard-potentials', 'nernst-equation', 'electrolysis', 'faraday-law'],
    'organic-chemistry-intro': ['functional-groups', 'nomenclature', 'stereochemistry', 'sn1-sn2', 'e1-e2'],
    'spectroscopy': ['h-nmr', 'c13-nmr', 'infrared', 'mass-spectrometry', 'uv-vis'],
  },
  'upper-division': {
    'atomic-theory': ['schrodinger-equation', 'orbital-shapes', 'many-electron-atoms', 'term-symbols', 'spin-orbit-coupling'],
    'thermodynamics': ['statistical-thermo', 'partition-functions', 'phase-equilibria', 'colligative-properties', 'chemical-potential'],
    'kinetics': ['collision-theory', 'transition-state-theory', 'enzyme-kinetics', 'chain-reactions', 'photochemistry'],
    'electrochemistry': ['corrosion', 'batteries-fuel-cells', 'electroanalytical', 'membrane-potentials', 'industrial-electrochem'],
  },
};

const QUESTION_BANKS = {
  'introductory': {
    'quantum-numbers': {
      questions: [
        { q: 'What are the four quantum numbers?', a: 'n, l, ml, ms', alts: ['n l ml ms', 'principal angular magnetic spin'] },
        { q: 'The principal quantum number n determines ___', a: 'energy level and size', alts: ['energy level', 'shell', 'size of orbital'] },
        { q: 'The angular momentum quantum number l ranges from ___ to ___', a: '0 to n-1', alts: ['0 to n minus 1'] },
        { q: 'For l = 1, the subshell is labeled ___', a: 'p', alts: ['p subshell'] },
        { q: 'The spin quantum number ms can be ___ or ___', a: '+1/2 or -1/2', alts: ['plus half minus half', '+1/2 and -1/2'] },
        { q: 'How many orbitals are in a d subshell?', a: '5', alts: ['five'] },
      ],
    },
    'electron-configurations': {
      questions: [
        { q: 'Write the electron configuration of carbon (Z=6).', a: '1s2 2s2 2p2', alts: ['[he] 2s2 2p2'] },
        { q: 'Hund\'s rule states that electrons fill orbitals ___', a: 'singly before pairing', alts: ['one per orbital first', 'with parallel spins first'] },
        { q: 'The Pauli exclusion principle states ___', a: 'no two electrons can have the same four quantum numbers', alts: ['each orbital holds max 2 electrons with opposite spins'] },
        { q: 'The aufbau principle means orbitals fill in order of ___', a: 'increasing energy', alts: ['lowest energy first'] },
        { q: 'What is the electron configuration of Na+ (Z=11)?', a: '1s2 2s2 2p6', alts: ['[ne]', 'same as neon'] },
        { q: 'Chromium has an anomalous configuration. It is ___ instead of expected.', a: '[Ar] 3d5 4s1', alts: ['3d5 4s1'] },
      ],
    },
    'periodic-trends': {
      questions: [
        { q: 'Ionization energy ___ (increases/decreases) across a period left to right.', a: 'increases', alts: ['increase'] },
        { q: 'Atomic radius ___ (increases/decreases) going down a group.', a: 'increases', alts: ['increase'] },
        { q: 'Electronegativity ___ (increases/decreases) across a period left to right.', a: 'increases', alts: ['increase'] },
        { q: 'Which element has the highest electronegativity?', a: 'fluorine', alts: ['f'] },
        { q: 'Electron affinity becomes more negative (more exothermic) moving ___ across a period.', a: 'right', alts: ['left to right'] },
        { q: 'Metallic character ___ (increases/decreases) going down a group.', a: 'increases', alts: ['increase'] },
      ],
    },
    'effective-nuclear-charge': {
      questions: [
        { q: 'Zeff = Z - ___', a: 'sigma (shielding)', alts: ['s', 'sigma', 'shielding constant', 'screening constant'] },
        { q: 'Core electrons provide ___ (more/less) shielding than valence electrons.', a: 'more', alts: ['much more'] },
        { q: 'Zeff ___ (increases/decreases) across a period.', a: 'increases', alts: ['increase'] },
        { q: 'Slater\'s rules are used to calculate ___', a: 'shielding constants', alts: ['effective nuclear charge', 'sigma', 'screening'] },
        { q: 'Which experiences a greater Zeff: a 2s or 2p electron in the same atom?', a: '2s', alts: ['the 2s electron'] },
        { q: 'Increasing Zeff explains why atomic radius ___ across a period.', a: 'decreases', alts: ['gets smaller', 'shrinks'] },
      ],
    },
    'atomic-spectra': {
      questions: [
        { q: 'When an electron transitions to a lower energy level, it ___ a photon.', a: 'emits', alts: ['releases'] },
        { q: 'The Balmer series involves transitions to n = ___', a: '2', alts: ['two'] },
        { q: 'The energy of a photon is E = ___', a: 'hf', alts: ['hv', 'h*f', 'h nu', 'hc/lambda'] },
        { q: 'Line spectra are evidence that electron energies are ___', a: 'quantized', alts: ['discrete'] },
        { q: 'The Rydberg formula predicts ___ for hydrogen atom transitions.', a: 'wavelengths', alts: ['wavelength', 'spectral lines'] },
        { q: 'The Lyman series involves transitions to n = ___', a: '1', alts: ['one'] },
      ],
    },
    'lewis-structures': {
      questions: [
        { q: 'The formal charge formula is: FC = valence electrons - ___', a: 'nonbonding electrons - bonds', alts: ['lone pair electrons - number of bonds', 'dots - bonds'] },
        { q: 'Structures with the lowest formal charges are generally ___', a: 'most stable', alts: ['preferred', 'best'] },
        { q: 'Resonance structures differ only in the placement of ___', a: 'electrons', alts: ['electron pairs', 'pi electrons'] },
        { q: 'How many total valence electrons does CO2 have?', a: '16', alts: ['sixteen'] },
        { q: 'An octet exception where an atom has more than 8 electrons is called an ___', a: 'expanded octet', alts: ['expanded valence shell'] },
        { q: 'Boron commonly has only ___ electrons around it.', a: '6', alts: ['six', 'an incomplete octet'] },
      ],
    },
    'vsepr-geometry': {
      questions: [
        { q: 'VSEPR stands for ___', a: 'valence shell electron pair repulsion', alts: ['valence shell electron pair repulsion theory'] },
        { q: 'A molecule with 4 electron groups and 0 lone pairs has ___ geometry.', a: 'tetrahedral', alts: ['tet'] },
        { q: 'A molecule with 3 bonding groups and 1 lone pair has ___ shape.', a: 'trigonal pyramidal', alts: ['pyramidal'] },
        { q: 'The bond angle in a tetrahedral molecule is approximately ___', a: '109.5 degrees', alts: ['109.5', '109.5°'] },
        { q: 'What is the shape of water (H2O)?', a: 'bent', alts: ['angular', 'v-shaped'] },
        { q: 'A linear molecule has ___ degree bond angle.', a: '180', alts: ['180 degrees', '180°'] },
      ],
    },
    'hybridization': {
      questions: [
        { q: 'Carbon in methane (CH4) is ___ hybridized.', a: 'sp3', alts: ['sp3 hybridized'] },
        { q: 'Carbon in ethylene (C2H4) is ___ hybridized.', a: 'sp2', alts: ['sp2 hybridized'] },
        { q: 'Carbon in acetylene (C2H2) is ___ hybridized.', a: 'sp', alts: ['sp hybridized'] },
        { q: 'sp3 hybridization gives ___ geometry.', a: 'tetrahedral', alts: ['tet'] },
        { q: 'A double bond consists of one ___ bond and one ___ bond.', a: 'sigma and pi', alts: ['sigma, pi', '1 sigma 1 pi'] },
        { q: 'How many pi bonds are in a triple bond?', a: '2', alts: ['two'] },
      ],
    },
    'molecular-orbital-theory': {
      questions: [
        { q: 'Bond order = (bonding electrons - antibonding electrons) / ___', a: '2', alts: ['two'] },
        { q: 'What is the bond order of O2?', a: '2', alts: ['two'] },
        { q: 'O2 is paramagnetic because it has ___ unpaired electrons in antibonding orbitals.', a: '2', alts: ['two'] },
        { q: 'If bond order = 0, the molecule ___', a: 'does not exist', alts: ['is unstable', 'will not form'] },
        { q: 'Bonding molecular orbitals are ___ in energy than the atomic orbitals.', a: 'lower', alts: ['lower energy'] },
        { q: 'Antibonding orbitals are designated with a ___', a: '*', alts: ['star', 'asterisk'] },
      ],
    },
    'bond-polarity': {
      questions: [
        { q: 'A polar bond forms between atoms with different ___', a: 'electronegativities', alts: ['electronegativity'] },
        { q: 'CO2 is nonpolar because its bond dipoles ___', a: 'cancel', alts: ['cancel out', 'are equal and opposite'] },
        { q: 'Water is polar because of its ___ shape.', a: 'bent', alts: ['angular'] },
        { q: 'Dipole moment is measured in ___', a: 'Debye', alts: ['debye units', 'd'] },
        { q: 'A completely ionic bond has an electronegativity difference greater than ___', a: '1.7', alts: ['1.7-2.0', 'about 2'] },
        { q: 'In a polar covalent bond, electrons are shared ___', a: 'unequally', alts: ['unequal'] },
      ],
    },
    'enthalpy': {
      questions: [
        { q: 'Enthalpy change (Delta H) is positive for ___ reactions.', a: 'endothermic', alts: ['endothermic reactions'] },
        { q: 'Breaking bonds ___ (requires/releases) energy.', a: 'requires', alts: ['absorbs'] },
        { q: 'Forming bonds ___ (requires/releases) energy.', a: 'releases', alts: ['gives off'] },
        { q: 'The standard enthalpy of formation of an element in its standard state is ___', a: '0', alts: ['zero'] },
        { q: 'Delta H_rxn = sum(Delta Hf products) - ___', a: 'sum(Delta Hf reactants)', alts: ['sum of enthalpies of formation of reactants'] },
        { q: 'An exothermic reaction has Delta H that is ___', a: 'negative', alts: ['less than zero'] },
      ],
    },
    'hess-law': {
      questions: [
        { q: 'Hess\'s law states that enthalpy change is independent of ___', a: 'the pathway', alts: ['path', 'the reaction pathway', 'route'] },
        { q: 'If a reaction is reversed, the sign of Delta H is ___', a: 'reversed', alts: ['changed', 'flipped', 'negated'] },
        { q: 'If a reaction is multiplied by a factor n, Delta H is ___', a: 'multiplied by n', alts: ['also multiplied by n'] },
        { q: 'Hess\'s law works because enthalpy is a ___ function.', a: 'state', alts: ['state function'] },
        { q: 'Delta H can be calculated using bond energies: Delta H = bonds broken - ___', a: 'bonds formed', alts: ['bonds formed energies'] },
        { q: 'Standard conditions for thermodynamics are ___ and 1 atm.', a: '25°C', alts: ['25 degrees c', '298 k', '298 kelvin'] },
      ],
    },
    'entropy-intro': {
      questions: [
        { q: 'Entropy (S) is a measure of ___', a: 'disorder or microstates', alts: ['disorder', 'randomness', 'number of microstates'] },
        { q: 'The second law of thermodynamics states that the entropy of the universe always ___', a: 'increases', alts: ['goes up'] },
        { q: 'A gas has ___ (higher/lower) entropy than a solid.', a: 'higher', alts: ['more'] },
        { q: 'At absolute zero (0 K), the entropy of a perfect crystal is ___', a: '0', alts: ['zero'] },
        { q: 'Dissolving a salt in water generally ___ (increases/decreases) entropy.', a: 'increases', alts: ['increase'] },
        { q: 'Units of entropy are ___', a: 'J/(mol·K)', alts: ['j/mol k', 'joules per mole kelvin'] },
      ],
    },
    'gibbs-free-energy': {
      questions: [
        { q: 'Delta G = Delta H - ___', a: 'T Delta S', alts: ['t*delta s', 'temperature times delta s'] },
        { q: 'A reaction is spontaneous when Delta G is ___', a: 'negative', alts: ['less than zero', '< 0'] },
        { q: 'At equilibrium, Delta G = ___', a: '0', alts: ['zero'] },
        { q: 'Delta G° = -RT ln(K) relates free energy to ___', a: 'equilibrium constant', alts: ['k', 'the equilibrium constant'] },
        { q: 'If Delta H < 0 and Delta S > 0, the reaction is spontaneous at ___', a: 'all temperatures', alts: ['any temperature', 'all T'] },
        { q: 'If Delta H > 0 and Delta S < 0, the reaction is ___ at all temperatures.', a: 'nonspontaneous', alts: ['never spontaneous', 'non-spontaneous'] },
      ],
    },
    'calorimetry': {
      questions: [
        { q: 'q = m × c × Delta T. What does c represent?', a: 'specific heat capacity', alts: ['specific heat', 'heat capacity'] },
        { q: 'The specific heat of water is approximately ___', a: '4.18 J/(g·°C)', alts: ['4.18', '4.18 j/g c', '4.184'] },
        { q: 'In a coffee-cup calorimeter, the process occurs at constant ___', a: 'pressure', alts: ['p'] },
        { q: 'In a bomb calorimeter, the process occurs at constant ___', a: 'volume', alts: ['v'] },
        { q: 'If the temperature of the solution increases, the reaction is ___', a: 'exothermic', alts: ['exo'] },
        { q: 'q_system = -q_surroundings follows from ___', a: 'conservation of energy', alts: ['first law of thermodynamics'] },
      ],
    },
    'rate-laws': {
      questions: [
        { q: 'Rate = k[A]^m[B]^n. What is k?', a: 'rate constant', alts: ['the rate constant'] },
        { q: 'The overall reaction order is the sum of ___', a: 'individual orders', alts: ['exponents', 'm + n'] },
        { q: 'Rate laws are determined ___ (experimentally/theoretically).', a: 'experimentally', alts: ['from experiment'] },
        { q: 'If doubling [A] quadruples the rate, the order with respect to A is ___', a: '2', alts: ['second', 'two'] },
        { q: 'Units of k for a first-order reaction are ___', a: '1/s', alts: ['s^-1', 'per second', 's-1'] },
        { q: 'The rate of a reaction generally ___ as temperature increases.', a: 'increases', alts: ['goes up'] },
      ],
    },
    'reaction-order': {
      questions: [
        { q: 'For a zeroth-order reaction, the rate is ___ of concentration.', a: 'independent', alts: ['not dependent'] },
        { q: 'For a first-order reaction, a plot of ln[A] vs t gives a ___', a: 'straight line', alts: ['linear plot', 'line'] },
        { q: 'For a second-order reaction, a plot of 1/[A] vs t gives a ___', a: 'straight line', alts: ['linear plot', 'line'] },
        { q: 'The half-life of a first-order reaction is t1/2 = ___', a: 'ln(2)/k', alts: ['0.693/k'] },
        { q: 'First-order half-life is ___ (dependent on/independent of) initial concentration.', a: 'independent of', alts: ['independent'] },
        { q: 'Radioactive decay follows ___ order kinetics.', a: 'first', alts: ['first-order'] },
      ],
    },
    'integrated-rate-laws': {
      questions: [
        { q: 'The integrated first-order rate law is ln[A] = ___', a: 'ln[A]0 - kt', alts: ['-kt + ln[a]0'] },
        { q: 'The integrated second-order rate law is 1/[A] = ___', a: '1/[A]0 + kt', alts: ['kt + 1/[a]0'] },
        { q: 'The integrated zero-order rate law is [A] = ___', a: '[A]0 - kt', alts: ['-kt + [a]0'] },
        { q: 'Half-life of a second-order reaction is t1/2 = ___', a: '1/(k[A]0)', alts: ['1/k[a]0'] },
        { q: 'For zero-order, half-life is t1/2 = ___', a: '[A]0/(2k)', alts: ['[a]0/2k'] },
        { q: 'Which order has a half-life that depends on initial concentration? (zero/first/second)', a: 'zero and second', alts: ['zero', 'second', 'both zero and second'] },
      ],
    },
    'arrhenius-equation': {
      questions: [
        { q: 'The Arrhenius equation is k = A × e^(___)', a: '-Ea/RT', alts: ['-ea/rt', 'negative ea over rt'] },
        { q: 'Ea represents the ___', a: 'activation energy', alts: ['energy of activation'] },
        { q: 'A in the Arrhenius equation is called the ___', a: 'frequency factor', alts: ['pre-exponential factor', 'collision frequency factor'] },
        { q: 'A plot of ln(k) vs 1/T gives a slope of ___', a: '-Ea/R', alts: ['negative ea over r'] },
        { q: 'Increasing temperature ___ (increases/decreases) the rate constant k.', a: 'increases', alts: ['increase'] },
        { q: 'A catalyst lowers the ___ of a reaction.', a: 'activation energy', alts: ['ea'] },
      ],
    },
    'catalysis': {
      questions: [
        { q: 'A catalyst ___ (changes/does not change) the equilibrium position.', a: 'does not change', alts: ['does not'] },
        { q: 'A catalyst speeds up a reaction by providing an alternative ___ with lower Ea.', a: 'pathway', alts: ['mechanism', 'reaction pathway'] },
        { q: 'An enzyme is a ___ catalyst.', a: 'biological', alts: ['protein'] },
        { q: 'A homogeneous catalyst is in the ___ phase as the reactants.', a: 'same', alts: ['same phase'] },
        { q: 'A heterogeneous catalyst is in a ___ phase from the reactants.', a: 'different', alts: ['different phase'] },
        { q: 'Catalytic converters in cars use ___ catalysts.', a: 'heterogeneous', alts: ['solid', 'surface'] },
      ],
    },
  },
  'intermediate': {
    'equilibrium-constants': {
      questions: [
        { q: 'For aA + bB <=> cC + dD, K = ___', a: '[C]^c[D]^d / [A]^a[B]^b', alts: ['products over reactants raised to stoichiometric coefficients'] },
        { q: 'Pure solids and liquids are ___ from the K expression.', a: 'excluded', alts: ['omitted', 'not included', 'left out'] },
        { q: 'Kp = Kc(RT)^(Delta n) where Delta n = ___', a: 'moles gas products - moles gas reactants', alts: ['change in moles of gas'] },
        { q: 'A large K means the equilibrium favors ___', a: 'products', alts: ['product side'] },
        { q: 'When the reaction is reversed, K_new = ___', a: '1/K', alts: ['1/k', 'reciprocal of k'] },
        { q: 'When the reaction is multiplied by n, K_new = ___', a: 'K^n', alts: ['k to the n', 'k raised to n'] },
      ],
    },
    'ice-tables': {
      questions: [
        { q: 'ICE stands for ___', a: 'Initial, Change, Equilibrium', alts: ['initial change equilibrium'] },
        { q: 'In an ICE table, the change row uses ___', a: 'stoichiometric ratios', alts: ['coefficients', 'stoichiometry'] },
        { q: 'If K is very large, the x in the denominator can be ___ as an approximation.', a: 'ignored', alts: ['neglected', 'dropped'] },
        { q: 'The 5% rule says the approximation is valid if x is less than ___% of initial concentration.', a: '5', alts: ['five'] },
        { q: 'For weak acid HA with Ka, if Ka << [HA]0, then [H+] ≈ ___', a: 'sqrt(Ka × [HA]0)', alts: ['square root of ka times c'] },
        { q: 'After solving an ICE table, you should ___ your answer by plugging back into K.', a: 'verify', alts: ['check'] },
      ],
    },
    'le-chatelier': {
      questions: [
        { q: 'Le Chatelier\'s principle states that a system at equilibrium will ___ a stress.', a: 'oppose', alts: ['counteract', 'shift to relieve'] },
        { q: 'Adding more reactant shifts equilibrium toward ___', a: 'products', alts: ['product side', 'right'] },
        { q: 'Increasing pressure shifts equilibrium toward the side with ___ moles of gas.', a: 'fewer', alts: ['less', 'fewer moles'] },
        { q: 'For an exothermic reaction, increasing temperature shifts equilibrium toward ___', a: 'reactants', alts: ['left', 'reactant side'] },
        { q: 'Adding a catalyst ___ (shifts/does not shift) the equilibrium.', a: 'does not shift', alts: ['does not'] },
        { q: 'Removing a product shifts equilibrium toward ___', a: 'products', alts: ['right', 'product side'] },
      ],
    },
    'reaction-quotient': {
      questions: [
        { q: 'Q has the same form as K but uses ___ concentrations.', a: 'current', alts: ['non-equilibrium', 'initial', 'instantaneous'] },
        { q: 'If Q < K, the reaction proceeds ___', a: 'forward', alts: ['toward products', 'to the right'] },
        { q: 'If Q > K, the reaction proceeds ___', a: 'in reverse', alts: ['toward reactants', 'to the left', 'backward'] },
        { q: 'If Q = K, the system is at ___', a: 'equilibrium', alts: ['chemical equilibrium'] },
        { q: 'Delta G = Delta G° + RT ln(___)', a: 'Q', alts: ['reaction quotient'] },
        { q: 'At equilibrium, Delta G = 0 and Q = ___', a: 'K', alts: ['equilibrium constant'] },
      ],
    },
    'solubility-product': {
      questions: [
        { q: 'Ksp is the equilibrium constant for the ___ of a sparingly soluble salt.', a: 'dissolution', alts: ['dissolving'] },
        { q: 'For AgCl, Ksp = ___', a: '[Ag+][Cl-]', alts: ['[ag+][cl-]'] },
        { q: 'If Q > Ksp, a precipitate will ___', a: 'form', alts: ['precipitate forms'] },
        { q: 'The common ion effect ___ (increases/decreases) solubility.', a: 'decreases', alts: ['lowers', 'reduces'] },
        { q: 'For BaF2, Ksp = [Ba2+][F-]^___', a: '2', alts: ['squared', 'two'] },
        { q: 'Molar solubility can be calculated from Ksp using an ___', a: 'ICE table', alts: ['ice table'] },
      ],
    },
    'galvanic-cells': {
      questions: [
        { q: 'In a galvanic cell, oxidation occurs at the ___', a: 'anode', alts: ['anode electrode'] },
        { q: 'In a galvanic cell, reduction occurs at the ___', a: 'cathode', alts: ['cathode electrode'] },
        { q: 'E°cell = E°cathode - ___', a: 'E°anode', alts: ['e anode', 'e° anode'] },
        { q: 'A positive E°cell means the reaction is ___', a: 'spontaneous', alts: ['favorable'] },
        { q: 'The salt bridge maintains ___ neutrality.', a: 'electrical', alts: ['charge', 'ionic'] },
        { q: 'Electrons flow from ___ to ___ through the external circuit.', a: 'anode to cathode', alts: ['anode, cathode'] },
      ],
    },
    'standard-potentials': {
      questions: [
        { q: 'The standard hydrogen electrode (SHE) is assigned E° = ___', a: '0 V', alts: ['0', 'zero volts', '0.00 v'] },
        { q: 'A more positive E° means a stronger ___', a: 'oxidizing agent', alts: ['tendency to be reduced'] },
        { q: 'A more negative E° means a stronger ___', a: 'reducing agent', alts: ['tendency to be oxidized'] },
        { q: 'Standard reduction potentials are measured at 25°C, 1 atm, and ___ M concentrations.', a: '1', alts: ['one', '1 m'] },
        { q: 'Delta G° = -nFE° where F = ___', a: '96485 C/mol', alts: ['96485', 'faraday constant', '96,485 c/mol'] },
        { q: 'If E°cell is positive, K is ___ (greater/less) than 1.', a: 'greater', alts: ['greater than 1'] },
      ],
    },
    'nernst-equation': {
      questions: [
        { q: 'The Nernst equation is E = E° - (RT/nF)ln(___)', a: 'Q', alts: ['reaction quotient'] },
        { q: 'At 25°C, the Nernst equation simplifies to E = E° - (0.0592/n)log(___)', a: 'Q', alts: ['reaction quotient'] },
        { q: 'At equilibrium, E = ___ and Q = K.', a: '0', alts: ['zero', '0 v'] },
        { q: 'n in the Nernst equation represents the number of ___ transferred.', a: 'electrons', alts: ['moles of electrons'] },
        { q: 'As a galvanic cell discharges, E ___ (increases/decreases) toward zero.', a: 'decreases', alts: ['drops'] },
        { q: 'A concentration cell has E° = 0 but generates voltage from ___', a: 'concentration differences', alts: ['concentration gradient'] },
      ],
    },
    'electrolysis': {
      questions: [
        { q: 'Electrolysis uses ___ energy to drive a nonspontaneous reaction.', a: 'electrical', alts: ['electric'] },
        { q: 'In electrolysis, the anode is ___ (positive/negative).', a: 'positive', alts: ['+'] },
        { q: 'Electrolysis of water produces ___ at the cathode.', a: 'hydrogen gas', alts: ['h2', 'hydrogen'] },
        { q: 'The minimum voltage needed for electrolysis is called the ___', a: 'decomposition potential', alts: ['decomposition voltage'] },
        { q: 'Electroplating is an application of ___', a: 'electrolysis', alts: ['electrodeposition'] },
        { q: 'The overpotential is extra voltage needed beyond the theoretical ___', a: 'cell potential', alts: ['decomposition potential', 'thermodynamic potential'] },
      ],
    },
    'faraday-law': {
      questions: [
        { q: 'Faraday\'s law relates the amount of substance deposited to ___', a: 'charge passed', alts: ['current and time', 'total charge'] },
        { q: 'Charge (Q) = current (I) × ___', a: 'time (t)', alts: ['time', 't'] },
        { q: 'One Faraday of charge (96485 C) deposits ___ mole of a monovalent ion.', a: '1', alts: ['one'] },
        { q: 'To deposit 1 mole of Cu2+ requires ___ Faradays.', a: '2', alts: ['two'] },
        { q: 'Moles of substance = Q / (n × F). What is n?', a: 'number of electrons transferred', alts: ['electrons per ion', 'charge on the ion'] },
        { q: 'Faraday\'s constant F = ___', a: '96485 C/mol', alts: ['96485', '96,485'] },
      ],
    },
    'functional-groups': {
      questions: [
        { q: 'An -OH group on a carbon chain is called an ___', a: 'alcohol', alts: ['hydroxyl group'] },
        { q: 'A C=O group within a carbon chain (not at the end) is a ___', a: 'ketone', alts: ['carbonyl'] },
        { q: 'A C=O group at the end of a chain with an H is an ___', a: 'aldehyde', alts: ['formyl group'] },
        { q: '-COOH is a ___ group.', a: 'carboxylic acid', alts: ['carboxyl'] },
        { q: 'An ester has the general structure ___', a: 'RCOOR\'', alts: ['r-coo-r', 'rcoor prime'] },
        { q: '-NH2 is an ___ group.', a: 'amine', alts: ['amino'] },
      ],
    },
    'nomenclature': {
      questions: [
        { q: 'The IUPAC name for CH3CH2OH is ___', a: 'ethanol', alts: ['ethan-1-ol'] },
        { q: 'The suffix -ane indicates ___', a: 'an alkane', alts: ['single bonds only', 'alkane'] },
        { q: 'The suffix -ene indicates ___', a: 'an alkene', alts: ['a double bond', 'alkene'] },
        { q: 'The prefix for a 3-carbon chain is ___', a: 'prop-', alts: ['prop', 'propane'] },
        { q: 'IUPAC naming requires numbering to give substituents the ___ numbers.', a: 'lowest', alts: ['smallest'] },
        { q: 'The IUPAC name for CH3COCH3 is ___', a: 'propanone', alts: ['propan-2-one', 'acetone'] },
      ],
    },
    'stereochemistry': {
      questions: [
        { q: 'A chiral center has ___ different substituents.', a: '4', alts: ['four'] },
        { q: 'Enantiomers are non-superimposable ___', a: 'mirror images', alts: ['mirror image'] },
        { q: 'R and S configurations are assigned using ___ priority rules.', a: 'Cahn-Ingold-Prelog', alts: ['cip', 'cahn ingold prelog'] },
        { q: 'A meso compound has chiral centers but is ___ overall.', a: 'achiral', alts: ['optically inactive', 'not chiral'] },
        { q: 'Diastereomers are stereoisomers that are NOT ___', a: 'mirror images', alts: ['enantiomers'] },
        { q: 'A racemic mixture contains equal amounts of both ___ and rotates plane-polarized light by ___.', a: 'enantiomers, 0 degrees', alts: ['enantiomers and zero degrees', 'r and s, zero'] },
      ],
    },
    'sn1-sn2': {
      questions: [
        { q: 'SN2 proceeds via ___ attack with inversion of configuration.', a: 'backside', alts: ['back-side', 'back side'] },
        { q: 'SN1 proceeds through a ___ intermediate.', a: 'carbocation', alts: ['carbo cation'] },
        { q: 'SN2 is favored by ___ (strong/weak) nucleophiles.', a: 'strong', alts: ['good'] },
        { q: 'SN1 is favored by ___ degree substrates.', a: 'tertiary', alts: ['3rd', '3°', 'third'] },
        { q: 'The rate law for SN2 is rate = k[substrate][___]', a: 'nucleophile', alts: ['nuc'] },
        { q: 'SN1 gives ___ (retention/inversion/racemization) of stereochemistry.', a: 'racemization', alts: ['racemic mixture'] },
      ],
    },
    'e1-e2': {
      questions: [
        { q: 'E2 requires an ___ geometry between the leaving group and the hydrogen.', a: 'anti-periplanar', alts: ['antiperiplanar', 'anti periplanar'] },
        { q: 'E2 is favored by ___ (strong/weak), ___ (bulky/small) bases.', a: 'strong, bulky', alts: ['strong bulky', 'strong and bulky'] },
        { q: 'E1 proceeds through a ___ intermediate.', a: 'carbocation', alts: ['carbo cation'] },
        { q: 'Zaitsev\'s rule predicts the ___ substituted alkene as major product.', a: 'more', alts: ['most', 'more substituted'] },
        { q: 'High temperature favors ___ (substitution/elimination).', a: 'elimination', alts: ['e'] },
        { q: 'E2 is a ___ (one-step/two-step) mechanism.', a: 'one-step', alts: ['concerted', 'one step'] },
      ],
    },
    'h-nmr': {
      questions: [
        { q: 'In 1H NMR, chemical shift (delta) is measured in ___', a: 'ppm', alts: ['parts per million'] },
        { q: 'TMS appears at delta = ___ and is used as a reference.', a: '0', alts: ['zero', '0 ppm'] },
        { q: 'Aromatic protons appear around delta ___ ppm.', a: '6-8', alts: ['6.5-8', '7', 'around 7'] },
        { q: 'Aldehyde protons appear around delta ___ ppm.', a: '9-10', alts: ['around 9.5', '9.5'] },
        { q: 'The n+1 rule predicts that a proton with n equivalent neighbors gives ___ peaks.', a: 'n+1', alts: ['n plus 1'] },
        { q: 'Integration of NMR peaks gives the relative number of ___', a: 'protons', alts: ['hydrogen atoms', 'h atoms'] },
      ],
    },
    'c13-nmr': {
      questions: [
        { q: '13C NMR shows peaks for each unique ___ environment.', a: 'carbon', alts: ['c'] },
        { q: 'Carbonyl carbons (C=O) appear around delta ___ ppm.', a: '170-220', alts: ['190-220', '170-210'] },
        { q: 'Aromatic carbons appear around delta ___ ppm.', a: '110-160', alts: ['120-150'] },
        { q: 'Unlike 1H NMR, 13C NMR peaks are NOT ___', a: 'integrated', alts: ['quantitative', 'proportional to number of carbons'] },
        { q: 'DEPT experiments distinguish CH3, CH2, CH, and ___ carbons.', a: 'quaternary', alts: ['c with no h'] },
        { q: 'sp3 carbons appear around delta ___ ppm.', a: '0-80', alts: ['10-60', '0-50'] },
      ],
    },
    'infrared': {
      questions: [
        { q: 'A broad absorption at 2500-3300 cm-1 is characteristic of ___', a: 'O-H (carboxylic acid)', alts: ['oh', 'carboxylic acid oh', 'broad oh'] },
        { q: 'A strong absorption at 1700-1750 cm-1 indicates ___', a: 'C=O stretch', alts: ['carbonyl', 'c=o'] },
        { q: 'A sharp absorption at 2100-2260 cm-1 indicates a ___', a: 'triple bond', alts: ['c triple c', 'c triple n', 'alkyne or nitrile'] },
        { q: 'N-H stretching appears around ___ cm-1.', a: '3300-3500', alts: ['3300-3400', '3350'] },
        { q: 'The fingerprint region is below ___ cm-1.', a: '1500', alts: ['1400'] },
        { q: 'IR spectroscopy identifies ___ in a molecule.', a: 'functional groups', alts: ['bonds', 'functional group'] },
      ],
    },
    'mass-spectrometry': {
      questions: [
        { q: 'The molecular ion peak (M+) gives the ___ of the compound.', a: 'molecular weight', alts: ['molecular mass', 'molar mass'] },
        { q: 'A loss of 15 from M+ indicates loss of ___', a: 'CH3', alts: ['methyl group', 'methyl'] },
        { q: 'A loss of 18 from M+ indicates loss of ___', a: 'H2O', alts: ['water'] },
        { q: 'The nitrogen rule states: odd M+ suggests an ___ number of nitrogen atoms.', a: 'odd', alts: ['odd number of'] },
        { q: 'M+2 peaks with a 3:1 ratio suggest the presence of ___', a: 'chlorine', alts: ['cl', 'a chlorine atom'] },
        { q: 'The base peak is the ___ peak in the spectrum.', a: 'tallest', alts: ['most intense', 'largest'] },
      ],
    },
    'uv-vis': {
      questions: [
        { q: 'UV-Vis spectroscopy measures absorption of ___ light.', a: 'ultraviolet and visible', alts: ['uv and visible', 'uv-visible'] },
        { q: 'Beer-Lambert law: A = ___', a: 'epsilon × l × c', alts: ['elc', 'molar absorptivity times path length times concentration'] },
        { q: 'Lambda max ___ (increases/decreases) with increasing conjugation.', a: 'increases', alts: ['shifts to longer wavelength', 'red shifts'] },
        { q: 'A red shift means lambda max moves to ___ wavelengths.', a: 'longer', alts: ['higher', 'lower energy'] },
        { q: 'The chromophore is the part of the molecule responsible for ___', a: 'absorption', alts: ['absorbing light', 'color'] },
        { q: 'UV-Vis is useful for measuring ___ of solutions.', a: 'concentration', alts: ['amount', 'absorbance'] },
      ],
    },
  },
  'upper-division': {
    'schrodinger-equation': {
      questions: [
        { q: 'The time-independent Schrodinger equation is H psi = ___', a: 'E psi', alts: ['e*psi', 'energy times psi'] },
        { q: 'H is the ___ operator.', a: 'Hamiltonian', alts: ['hamiltonian'] },
        { q: 'Psi (the wave function) contains all ___ about the system.', a: 'information', alts: ['knowable information'] },
        { q: '|psi|^2 gives the ___ density.', a: 'probability', alts: ['electron probability', 'probability density'] },
        { q: 'For a particle in a box, E_n = n^2 h^2 / (___)', a: '8mL^2', alts: ['8ml2', '8ml squared'] },
        { q: 'Boundary conditions require psi = 0 at the walls, leading to ___ solutions.', a: 'quantized', alts: ['discrete'] },
      ],
    },
    'orbital-shapes': {
      questions: [
        { q: 's orbitals are ___ in shape.', a: 'spherical', alts: ['sphere'] },
        { q: 'p orbitals have ___ lobes.', a: '2', alts: ['two', 'dumbbell'] },
        { q: 'd orbitals have ___ lobes (except dz2).', a: '4', alts: ['four', 'cloverleaf'] },
        { q: 'The number of nodes in an orbital = n - ___ - 1.', a: 'l', alts: ['angular momentum quantum number'] },
        { q: 'A radial node is a ___ where psi = 0.', a: 'sphere', alts: ['spherical surface'] },
        { q: 'An angular node is a ___ where psi = 0.', a: 'plane', alts: ['nodal plane'] },
      ],
    },
    'many-electron-atoms': {
      questions: [
        { q: 'The electron-electron repulsion in many-electron atoms makes exact solutions ___', a: 'impossible', alts: ['not possible', 'unsolvable analytically'] },
        { q: 'The Hartree-Fock method approximates many-electron systems using ___', a: 'self-consistent field', alts: ['scf', 'self consistent field'] },
        { q: 'Electron correlation is the difference between Hartree-Fock and ___', a: 'exact energy', alts: ['true energy', 'exact solution'] },
        { q: 'Shielding causes inner electrons to reduce the effective ___', a: 'nuclear charge', alts: ['zeff'] },
        { q: 'Penetration describes how close an electron gets to the ___', a: 'nucleus', alts: ['nuclear charge'] },
        { q: 'For a given n, s electrons penetrate ___ (more/less) than p electrons.', a: 'more', alts: ['closer'] },
      ],
    },
    'term-symbols': {
      questions: [
        { q: 'A term symbol has the format ___', a: '^(2S+1)L_J', alts: ['2s+1 l j', 'multiplicity l j'] },
        { q: '2S+1 is the spin ___', a: 'multiplicity', alts: ['spin multiplicity'] },
        { q: 'For L=0, the letter is ___', a: 'S', alts: ['s'] },
        { q: 'For L=2, the letter is ___', a: 'D', alts: ['d'] },
        { q: 'The ground state term is found using ___ rules.', a: "Hund's", alts: ['hunds rules', 'hund rules'] },
        { q: 'J ranges from |L-S| to ___', a: 'L+S', alts: ['l plus s'] },
      ],
    },
    'spin-orbit-coupling': {
      questions: [
        { q: 'Spin-orbit coupling arises from the interaction between electron ___ and orbital ___.', a: 'spin and orbital angular momentum', alts: ['spin angular momentum, orbital angular momentum'] },
        { q: 'Spin-orbit coupling is most significant for ___ (heavy/light) atoms.', a: 'heavy', alts: ['heavier'] },
        { q: 'Fine structure in atomic spectra is caused by ___', a: 'spin-orbit coupling', alts: ['spin orbit coupling'] },
        { q: 'The total angular momentum quantum number J = ___', a: 'L + S (vectorially)', alts: ['vector sum of l and s'] },
        { q: 'For a less-than-half-filled subshell, the lowest J is ___ in energy.', a: 'lowest', alts: ['ground state', 'most stable'] },
        { q: 'The spin-orbit coupling constant ___ (increases/decreases) with atomic number.', a: 'increases', alts: ['increase'] },
      ],
    },
    'statistical-thermo': {
      questions: [
        { q: 'The Boltzmann distribution gives the probability of a state proportional to e^(___)', a: '-E/kT', alts: ['-e/kt', 'negative energy over kt'] },
        { q: 'The partition function Z = sum of e^(-Ei/kT) over all ___', a: 'states', alts: ['microstates', 'energy levels'] },
        { q: 'S = kB ln(___)', a: 'Omega', alts: ['w', 'number of microstates'] },
        { q: 'The most probable macrostate has the ___ number of microstates.', a: 'largest', alts: ['greatest', 'maximum'] },
        { q: 'At high temperature, more ___ states are populated.', a: 'energy', alts: ['higher energy', 'excited'] },
        { q: 'The equipartition theorem assigns ___ kT per quadratic degree of freedom.', a: '1/2', alts: ['half kt', 'one half'] },
      ],
    },
    'partition-functions': {
      questions: [
        { q: 'The translational partition function depends on ___, mass, and temperature.', a: 'volume', alts: ['v'] },
        { q: 'The rotational partition function for a linear molecule is approximately kT/___', a: 'B*h*c', alts: ['bhc', 'rotational constant'] },
        { q: 'Internal energy can be calculated from Z: U = -d(ln Z)/d(___)', a: 'beta', alts: ['1/kt', 'beta = 1/kt'] },
        { q: 'The molecular partition function is the product of ___, rotational, vibrational, and electronic contributions.', a: 'translational', alts: ['trans'] },
        { q: 'For N indistinguishable particles, Q = Z^N / ___', a: 'N!', alts: ['n factorial'] },
        { q: 'Helmholtz free energy A = -kT ln(___)', a: 'Q', alts: ['partition function', 'z for canonical'] },
      ],
    },
    'phase-equilibria': {
      questions: [
        { q: 'The Clausius-Clapeyron equation relates vapor pressure to ___', a: 'temperature', alts: ['t'] },
        { q: 'At the triple point, ___ phases coexist.', a: '3', alts: ['three', 'solid liquid gas'] },
        { q: 'The critical point is where the distinction between ___ and ___ disappears.', a: 'liquid and gas', alts: ['liquid, gas'] },
        { q: 'Gibbs phase rule: F = C - P + ___', a: '2', alts: ['two'] },
        { q: 'F is the number of degrees of ___', a: 'freedom', alts: ['degrees of freedom'] },
        { q: 'Along a phase boundary on a P-T diagram, F = ___', a: '1', alts: ['one'] },
      ],
    },
    'colligative-properties': {
      questions: [
        { q: 'Colligative properties depend on the ___ of solute particles.', a: 'number', alts: ['concentration', 'amount'] },
        { q: 'Boiling point elevation: Delta Tb = ___', a: 'Kb × m × i', alts: ['kb m i', 'kb times molality times van t hoff factor'] },
        { q: 'The van\'t Hoff factor i accounts for ___', a: 'dissociation', alts: ['ionization', 'number of particles'] },
        { q: 'For NaCl, the ideal van\'t Hoff factor i = ___', a: '2', alts: ['two'] },
        { q: 'Osmotic pressure pi = ___', a: 'iMRT', alts: ['imrt', 'i m r t'] },
        { q: 'Freezing point ___ (elevation/depression) occurs when solute is added.', a: 'depression', alts: ['lowering'] },
      ],
    },
    'chemical-potential': {
      questions: [
        { q: 'Chemical potential mu = (dG/dn_i) at constant ___', a: 'T, P, and other n_j', alts: ['temperature pressure and other components'] },
        { q: 'At equilibrium, the chemical potential of a substance is ___ in all phases.', a: 'equal', alts: ['the same'] },
        { q: 'For an ideal gas, mu = mu° + RT ln(___)', a: 'P/P°', alts: ['pressure', 'p'] },
        { q: 'For a solute in solution, mu = mu° + RT ln(___)', a: 'activity', alts: ['a', 'concentration'] },
        { q: 'Raoult\'s law states that P_A = x_A × ___', a: 'P°_A', alts: ['pure vapor pressure', 'p star a'] },
        { q: 'Chemical potential drives mass transfer from ___ mu to ___ mu.', a: 'high to low', alts: ['higher to lower'] },
      ],
    },
    'collision-theory': {
      questions: [
        { q: 'Collision theory says reactions occur when molecules collide with sufficient ___ and proper ___.', a: 'energy and orientation', alts: ['energy, orientation'] },
        { q: 'The steric factor p accounts for ___', a: 'orientation requirements', alts: ['proper orientation', 'geometry of collision'] },
        { q: 'Not all collisions lead to reaction because some lack sufficient ___', a: 'energy', alts: ['kinetic energy', 'activation energy'] },
        { q: 'The collision frequency increases with ___', a: 'temperature', alts: ['concentration', 'temperature and concentration'] },
        { q: 'The fraction of molecules with E >= Ea follows the ___ distribution.', a: 'Boltzmann', alts: ['maxwell-boltzmann'] },
        { q: 'Collision theory predicts rate = Z × p × e^(-Ea/RT) where Z is ___', a: 'collision frequency', alts: ['collision rate', 'number of collisions per unit time'] },
      ],
    },
    'transition-state-theory': {
      questions: [
        { q: 'TST assumes a quasi-equilibrium between reactants and the ___', a: 'transition state', alts: ['activated complex'] },
        { q: 'The Eyring equation relates k to Delta G_double-dagger (___)', a: 'activation Gibbs energy', alts: ['free energy of activation', 'gibbs energy of activation'] },
        { q: 'k = (kBT/h) × e^(-Delta G‡/RT). kB is ___ and h is ___.', a: 'Boltzmann constant, Planck constant', alts: ['boltzmann and planck'] },
        { q: 'Delta G‡ = Delta H‡ - T × ___', a: 'Delta S‡', alts: ['delta s double dagger', 'activation entropy'] },
        { q: 'A large negative Delta S‡ suggests a ___ (tight/loose) transition state.', a: 'tight', alts: ['ordered', 'constrained'] },
        { q: 'TST explains why some reactions are slow even with favorable thermodynamics: high ___', a: 'activation barrier', alts: ['activation energy', 'delta g double dagger'] },
      ],
    },
    'enzyme-kinetics': {
      questions: [
        { q: 'The Michaelis-Menten equation is v = Vmax[S] / (___)', a: 'Km + [S]', alts: ['km plus s'] },
        { q: 'Km is the substrate concentration at which v = ___', a: 'Vmax/2', alts: ['half vmax', 'vmax over 2'] },
        { q: 'A competitive inhibitor increases the apparent ___', a: 'Km', alts: ['km'] },
        { q: 'An uncompetitive inhibitor decreases both apparent ___ and ___.', a: 'Km and Vmax', alts: ['vmax and km'] },
        { q: 'The catalytic efficiency of an enzyme is measured by ___', a: 'kcat/Km', alts: ['kcat over km'] },
        { q: 'A Lineweaver-Burk plot graphs 1/v vs ___', a: '1/[S]', alts: ['1 over s', 'reciprocal of substrate concentration'] },
      ],
    },
    'chain-reactions': {
      questions: [
        { q: 'A chain reaction has three stages: initiation, propagation, and ___', a: 'termination', alts: ['chain termination'] },
        { q: 'In radical halogenation, the initiation step produces ___', a: 'free radicals', alts: ['radicals'] },
        { q: 'Propagation steps regenerate ___', a: 'reactive intermediates', alts: ['radicals', 'chain carriers'] },
        { q: 'Termination occurs when two radicals ___', a: 'combine', alts: ['react', 'recombine'] },
        { q: 'The chain length is the average number of ___ cycles before termination.', a: 'propagation', alts: ['propagation steps'] },
        { q: 'Nuclear fission is a ___ chain reaction.', a: 'branching', alts: ['branched'] },
      ],
    },
    'photochemistry': {
      questions: [
        { q: 'The Stark-Einstein law states that one photon activates ___ molecule.', a: 'one', alts: ['1'] },
        { q: 'Quantum yield phi = number of events / number of ___', a: 'photons absorbed', alts: ['absorbed photons'] },
        { q: 'Fluorescence occurs when an excited molecule returns to S0 from ___', a: 'S1', alts: ['first excited singlet'] },
        { q: 'Phosphorescence involves a transition from ___ to S0.', a: 'T1', alts: ['triplet state', 'first triplet'] },
        { q: 'Intersystem crossing is a transition between states of different ___', a: 'spin multiplicity', alts: ['spin', 'multiplicity'] },
        { q: 'The Jablonski diagram shows the energy levels and transitions for ___', a: 'photophysical processes', alts: ['electronic states', 'fluorescence and phosphorescence'] },
      ],
    },
    'corrosion': {
      questions: [
        { q: 'Corrosion of iron is an ___ reaction.', a: 'electrochemical', alts: ['oxidation'] },
        { q: 'Rust has the approximate formula ___', a: 'Fe2O3·xH2O', alts: ['iron oxide', 'fe2o3', 'iron(iii) oxide'] },
        { q: 'Galvanic corrosion occurs when two ___ metals are in contact.', a: 'dissimilar', alts: ['different'] },
        { q: 'Cathodic protection uses a ___ metal as a sacrificial anode.', a: 'more active', alts: ['more reactive', 'less noble'] },
        { q: 'Zinc coating on iron is called ___', a: 'galvanization', alts: ['galvanizing', 'galvanised'] },
        { q: 'Passivation creates a protective ___ layer on the metal surface.', a: 'oxide', alts: ['thin oxide', 'passive oxide'] },
      ],
    },
    'batteries-fuel-cells': {
      questions: [
        { q: 'A primary battery is ___ (rechargeable/non-rechargeable).', a: 'non-rechargeable', alts: ['not rechargeable', 'disposable'] },
        { q: 'A secondary battery is ___ (rechargeable/non-rechargeable).', a: 'rechargeable', alts: ['rechargable'] },
        { q: 'Lithium-ion batteries use ___ intercalation.', a: 'lithium', alts: ['li+', 'lithium ion'] },
        { q: 'A hydrogen fuel cell produces ___ and ___ as products.', a: 'water and electricity', alts: ['electricity and water', 'water', 'h2o'] },
        { q: 'The theoretical efficiency of a fuel cell is ___ (limited/not limited) by Carnot.', a: 'not limited', alts: ['not carnot limited'] },
        { q: 'Lead-acid batteries are used in ___', a: 'automobiles', alts: ['cars', 'vehicles'] },
      ],
    },
    'electroanalytical': {
      questions: [
        { q: 'Potentiometry measures ___ at zero current.', a: 'potential', alts: ['voltage', 'emf'] },
        { q: 'A pH electrode is a type of ___ electrode.', a: 'ion-selective', alts: ['glass', 'ise'] },
        { q: 'Voltammetry measures current as a function of applied ___', a: 'potential', alts: ['voltage'] },
        { q: 'Cyclic voltammetry scans potential in a ___ pattern.', a: 'triangular', alts: ['forward and reverse', 'triangle wave'] },
        { q: 'Coulometry measures the total ___ passed in an electrolysis.', a: 'charge', alts: ['coulombs'] },
        { q: 'The Nernst equation is the basis for ___ measurements.', a: 'potentiometric', alts: ['potentiometry'] },
      ],
    },
    'membrane-potentials': {
      questions: [
        { q: 'The Nernst equation for a membrane gives the equilibrium potential for a single ___', a: 'ion', alts: ['ionic species'] },
        { q: 'The Goldman equation accounts for multiple ___ with different permeabilities.', a: 'ions', alts: ['ionic species'] },
        { q: 'The resting membrane potential of a neuron is about ___', a: '-70 mV', alts: ['-70mv', 'negative 70 millivolts'] },
        { q: 'Ion channels are ___ (selective/nonselective) for specific ions.', a: 'selective', alts: ['ion-selective'] },
        { q: 'The Na+/K+ ATPase pumps ___ Na+ out and ___ K+ in.', a: '3 out, 2 in', alts: ['3 sodium out 2 potassium in', '3, 2'] },
        { q: 'Membrane potential is crucial for ___ transmission.', a: 'nerve', alts: ['neural', 'signal', 'nerve impulse'] },
      ],
    },
    'industrial-electrochem': {
      questions: [
        { q: 'The Hall-Heroult process produces ___ by electrolysis.', a: 'aluminum', alts: ['al', 'aluminium'] },
        { q: 'The chlor-alkali process produces Cl2, NaOH, and ___', a: 'H2', alts: ['hydrogen', 'hydrogen gas'] },
        { q: 'Electrorefining purifies metals using ___ as the anode.', a: 'impure metal', alts: ['crude metal'] },
        { q: 'Anodizing creates a protective ___ layer on aluminum.', a: 'oxide', alts: ['aluminum oxide', 'al2o3'] },
        { q: 'Water electrolysis for hydrogen production requires a minimum voltage of ___', a: '1.23 V', alts: ['1.23', '1.23 volts'] },
        { q: 'Industrial electrolysis is energy-intensive because of ___', a: 'overpotential', alts: ['ohmic losses', 'resistance and overpotential'] },
      ],
    },
  },
};

// File I/O
function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }
function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }
function loadProfile(id) {
  const fp = profilePath(id);
  if (fs.existsSync(fp)) { try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); } }
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
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }
function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 '/-]/g, ''); }

function generateExercise(level, skill, count = 5) {
  const bank = QUESTION_BANKS[level]?.[skill];
  if (!bank || !bank.questions) return { error: `No question bank for ${level}/${skill}` };
  const items = pick(bank.questions, count).map(q => ({ prompt: q.q, answer: q.a, type: q.type || 'short-answer', acceptedAnswers: q.alts ? [q.a, ...q.alts] : [q.a] }));
  return { type: 'short-answer', skill, level, count: items.length, instruction: 'Answer each question.', items };
}

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(e => norm(e) === norm(answer));
  return norm(expected) === norm(answer);
}

class CollegeChemistry {
  getProfile(id) { const p = loadProfile(id); return { studentId: p.studentId, level: p.level, createdAt: p.createdAt, totalAssessments: p.assessments.length }; }
  setLevel(id, level) { if (!SKILLS[level]) throw new Error(`Unknown level: ${level}. Valid: ${Object.keys(SKILLS).join(', ')}`); const p = loadProfile(id); p.level = level; saveProfile(p); return { studentId: id, level }; }
  recordAssessment(id, level, category, skill, score, total, notes = '') {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}`);
    if (!SKILLS[level][category]) throw new Error(`Unknown category '${category}' for ${level}`);
    if (!SKILLS[level][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${level}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id); if (!p.level) p.level = level;
    const entry = { date: new Date().toISOString(), level, category, skill, score, total, notes }; p.assessments.push(entry);
    const key = `${level}/${category}/${skill}`; if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total }); p.skills[key].mastery = calcMastery(p.skills[key].attempts); p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p); return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }
  getProgress(id) {
    const p = loadProfile(id); const level = p.level || 'introductory'; const ls = SKILLS[level] || {}; const results = {}; let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(ls)) { results[cat] = {}; for (const sk of skills) { total++; const d = p.skills[`${level}/${cat}/${sk}`]; results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' }; if (d && d.mastery >= MASTERY_THRESHOLD) mastered++; } }
    return { studentId: id, level, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }
  getNextSkills(id, count = 5) {
    const p = loadProfile(id); const level = p.level || 'introductory'; const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS[level] || {})) { for (const sk of skills) { const d = p.skills[`${level}/${cat}/${sk}`]; const m = d ? d.mastery : 0; if (m < MASTERY_THRESHOLD) candidates.push({ level, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' }); } }
    const order = { developing: 0, emerging: 1, 'not-started': 2 }; candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, level, next: candidates.slice(0, count) };
  }
  getReport(id) { const p = loadProfile(id); return { studentId: id, level: p.level, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }
  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }
  getSkillCatalog(level) { const ls = SKILLS[level]; if (!ls) return { level, error: `Unknown level. Valid: ${Object.keys(SKILLS).join(', ')}` }; let total = 0; const catalog = {}; for (const [cat, skills] of Object.entries(ls)) { total += skills.length; catalog[cat] = [...skills]; } return { level, skills: catalog, totalSkills: total }; }
  generateExercise(level, skill, count = 5) { return generateExercise(level, skill, count); }
  checkAnswer(type, expected, answer) { let exp = expected; try { exp = JSON.parse(expected); } catch {} return { correct: checkAnswer(type, Array.isArray(exp) ? exp : [exp], answer), expected: exp, studentAnswer: answer }; }
  generateLesson(id) {
    const p = loadProfile(id); const level = p.level || 'introductory'; const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient!`, level };
    const exercise = generateExercise(level, target.skill, 5);
    return { studentId: id, level, targetSkill: target, exercise, lessonPlan: { review: 'Review previously learned concepts (2-3 min)', teach: `Introduce/reinforce: ${target.category} > ${target.skill}`, practice: `Complete ${exercise.count || 0} practice items`, apply: 'Connect to real chemical context or application' } };
  }
}

module.exports = CollegeChemistry;

if (require.main === module) {
  const args = process.argv.slice(2); const cmd = args[0]; const api = new CollegeChemistry(); const out = d => console.log(JSON.stringify(d, null, 2));
  try {
    switch (cmd) {
      case 'start': { const [, id, level] = args; if (!id) throw new Error('Usage: start <id> [level]'); if (level) api.setLevel(id, level); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const level = loadProfile(id).level || 'introductory'; if (skill) { out(api.generateExercise(level, skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); out(api.checkAnswer(type, expected, answer)); break; }
      case 'record': { const [, id, level, cat, skill, sc, tot, ...notes] = args; if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total>'); out(api.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? api.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(api.setLevel(id, l)); break; }
      default: out({ usage: 'node chemistry.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
