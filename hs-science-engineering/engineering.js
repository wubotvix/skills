// eClaw HS Engineering Design Interactive Tutor (9-12). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-science-engineering');
const MASTERY_THRESHOLD = 0.8;

/* ------------------------------------------------------------------ */
/*  SKILLS — standard is a subset, advanced adds more per category    */
/* ------------------------------------------------------------------ */

const SKILLS = {
  standard: {
    'engineering-design': [
      'define-problem',
      'research-background',
      'generate-solutions',
      'prototype-and-test',
    ],
    'materials-science': [
      'material-properties',
      'material-classes',
      'material-selection',
      'material-testing',
    ],
    'structural-analysis': [
      'loads-and-forces',
      'stress-and-strain',
      'factor-of-safety',
      'structural-types',
    ],
    'energy-systems': [
      'energy-conversion',
      'efficiency',
      'renewable-sources',
      'grid-fundamentals',
    ],
    'computational-modeling': [
      'cad-basics',
      'simulation-intro',
      'algorithmic-thinking',
      'data-analysis',
    ],
    'ethics-in-engineering': [
      'codes-of-ethics',
      'safety-responsibility',
      'environmental-impact',
      'equity-and-access',
    ],
  },
  advanced: {
    'engineering-design': [
      'define-problem',
      'research-background',
      'generate-solutions',
      'prototype-and-test',
      'optimization-cycles',
    ],
    'materials-science': [
      'material-properties',
      'material-classes',
      'material-selection',
      'material-testing',
      'composites-and-alloys',
    ],
    'structural-analysis': [
      'loads-and-forces',
      'stress-and-strain',
      'factor-of-safety',
      'structural-types',
      'failure-modes',
    ],
    'energy-systems': [
      'energy-conversion',
      'efficiency',
      'renewable-sources',
      'grid-fundamentals',
      'thermodynamics-basics',
    ],
    'computational-modeling': [
      'cad-basics',
      'simulation-intro',
      'algorithmic-thinking',
      'data-analysis',
      'finite-element-concepts',
    ],
    'ethics-in-engineering': [
      'codes-of-ethics',
      'safety-responsibility',
      'environmental-impact',
      'equity-and-access',
      'whistleblowing-and-integrity',
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  CONTENT_BANKS — 6-8 questions per skill                           */
/* ------------------------------------------------------------------ */

const CONTENT_BANKS = {
  /* ============ ENGINEERING DESIGN ============ */
  'define-problem': {
    questions: [
      { q: 'What is the first step of the engineering design process?', a: 'define the problem', alt: ['identify the problem', 'problem definition'], type: 'short' },
      { q: 'Why must engineers distinguish between needs and wants when defining a problem?', a: 'needs are essential requirements while wants are desirable but optional, and confusing them leads to scope creep', alt: [], type: 'open' },
      { q: 'What are design criteria?', a: 'the specific requirements a solution must satisfy', alt: ['requirements the solution must meet'], type: 'open' },
      { q: 'What are design constraints?', a: 'limitations or restrictions on the design such as budget, time, or materials', alt: ['limitations on the design'], type: 'open' },
      { q: 'True or false: A well-defined problem statement includes both criteria and constraints.', a: 'true', alt: [], type: 'tf' },
      { q: 'What is a design brief?', a: 'a document that outlines the problem, criteria, constraints, and context for a design project', alt: [], type: 'open' },
      { q: 'Why is stakeholder analysis important during problem definition?', a: 'it ensures the design addresses the needs of all people affected by the solution', alt: [], type: 'open' },
      { q: 'What is the difference between a specification and a requirement?', a: 'a specification is a measurable, quantified version of a requirement', alt: ['specifications are measurable requirements'], type: 'open' },
    ],
  },
  'research-background': {
    questions: [
      { q: 'Why do engineers conduct background research before generating solutions?', a: 'to understand existing solutions, relevant science, and the problem context', alt: [], type: 'open' },
      { q: 'What is a patent search?', a: 'reviewing existing patents to find prior solutions and avoid infringement', alt: ['searching for existing patents'], type: 'open' },
      { q: 'What is a literature review in engineering?', a: 'a systematic examination of published research and technical papers relevant to the design problem', alt: [], type: 'open' },
      { q: 'True or false: Engineers should ignore existing solutions and start from scratch.', a: 'false', alt: [], type: 'tf' },
      { q: 'What is benchmarking in engineering design?', a: 'comparing your design goals against existing products or standards', alt: ['comparing against existing solutions'], type: 'open' },
      { q: 'Name one source of technical information engineers use during research.', a: 'technical journals', alt: ['textbooks', 'patent databases', 'industry standards', 'manufacturer data sheets'], type: 'multi' },
      { q: 'Why is understanding the science behind a problem important for engineering?', a: 'it allows engineers to predict behavior and make informed design decisions', alt: [], type: 'open' },
      { q: 'What is biomimicry?', a: 'designing solutions inspired by structures and processes found in nature', alt: ['imitating nature in design'], type: 'open' },
    ],
  },
  'generate-solutions': {
    questions: [
      { q: 'Why should engineers generate multiple solutions before choosing one?', a: 'to explore a wide range of possibilities and find the best approach', alt: ['to compare options and select the best'], type: 'open' },
      { q: 'What is a morphological chart?', a: 'a structured method that lists sub-functions and possible solutions for each to generate combinations', alt: [], type: 'open' },
      { q: 'True or false: During brainstorming, all ideas should be evaluated immediately.', a: 'false', alt: [], type: 'tf' },
      { q: 'What is a Pugh matrix?', a: 'a decision matrix that compares design concepts against a reference design using weighted criteria', alt: ['a concept selection matrix'], type: 'open' },
      { q: 'What is the purpose of a feasibility study?', a: 'to determine whether a proposed solution can be practically implemented within constraints', alt: [], type: 'open' },
      { q: 'Name one ideation technique besides brainstorming.', a: 'SCAMPER', alt: ['mind mapping', 'sketching', 'TRIZ', '6-3-5 method', 'morphological chart'], type: 'multi' },
      { q: 'What is convergent thinking in the design process?', a: 'narrowing down many ideas to select the most promising solution', alt: [], type: 'open' },
      { q: 'Why are rough sketches valuable in the ideation phase?', a: 'they quickly communicate ideas and reveal design flaws before investing resources', alt: [], type: 'open' },
    ],
  },
  'prototype-and-test': {
    questions: [
      { q: 'What is the difference between a proof-of-concept and a functional prototype?', a: 'a proof-of-concept validates a key idea while a functional prototype demonstrates the complete design', alt: [], type: 'open' },
      { q: 'Why is rapid prototyping valuable in engineering?', a: 'it allows fast iteration and early detection of design problems', alt: [], type: 'open' },
      { q: 'What is destructive testing?', a: 'testing a product until it fails to determine its limits', alt: ['testing to failure'], type: 'open' },
      { q: 'True or false: A prototype must be the same scale as the final product.', a: 'false', alt: [], type: 'tf' },
      { q: 'What is a controlled variable in an engineering test?', a: 'a variable that is kept constant so it does not affect the results', alt: ['a variable held constant during testing'], type: 'open' },
      { q: 'Why should engineers run multiple trials when testing?', a: 'to ensure results are reliable and not due to random variation', alt: ['to get reliable data'], type: 'open' },
      { q: 'Name one rapid prototyping technology.', a: '3D printing', alt: ['laser cutting', 'CNC machining', 'stereolithography'], type: 'multi' },
      { q: 'What is user testing?', a: 'having the intended users interact with the prototype to gather feedback', alt: [], type: 'open' },
    ],
  },
  'optimization-cycles': {
    questions: [
      { q: 'What is design optimization?', a: 'systematically improving a design to best meet criteria within constraints', alt: ['making the best possible design'], type: 'open' },
      { q: 'What is a design variable in optimization?', a: 'a parameter that can be changed to improve performance', alt: [], type: 'open' },
      { q: 'True or false: Optimization always means minimizing cost.', a: 'false', alt: [], type: 'tf' },
      { q: 'What is a Pareto front?', a: 'the set of solutions where no objective can be improved without worsening another', alt: ['the set of non-dominated solutions'], type: 'open' },
      { q: 'Why should only one variable be changed per iteration?', a: 'so the effect of that change can be isolated and measured', alt: [], type: 'open' },
      { q: 'What is the difference between local and global optimization?', a: 'local finds the best solution nearby while global finds the best overall solution', alt: [], type: 'open' },
      { q: 'What is a sensitivity analysis?', a: 'determining how changes in input variables affect the output of a design', alt: [], type: 'open' },
      { q: 'When should engineers stop iterating on a design?', a: 'when further improvements are negligible or constraints like time and budget are reached', alt: [], type: 'open' },
    ],
  },

  /* ============ MATERIALS SCIENCE ============ */
  'material-properties': {
    questions: [
      { q: 'What is tensile strength?', a: 'the maximum stress a material can withstand while being stretched before breaking', alt: ['maximum pulling stress before failure'], type: 'open' },
      { q: 'What is ductility?', a: 'the ability of a material to deform plastically without fracturing', alt: ['ability to be drawn into wire'], type: 'open' },
      { q: 'What is hardness?', a: 'a material\'s resistance to surface deformation such as scratching or indentation', alt: ['resistance to indentation'], type: 'open' },
      { q: 'True or false: A material can be strong but brittle.', a: 'true', alt: [], type: 'tf' },
      { q: 'What is thermal conductivity?', a: 'a measure of how well a material transfers heat', alt: ['the rate at which a material conducts heat'], type: 'open' },
      { q: 'What is Young\'s modulus?', a: 'the ratio of stress to strain in the elastic region, measuring stiffness', alt: ['modulus of elasticity', 'a measure of stiffness'], type: 'open' },
      { q: 'What is fatigue in materials?', a: 'weakening caused by repeated cyclic loading below the ultimate strength', alt: ['failure from repeated loading'], type: 'open' },
      { q: 'What is the difference between elastic and plastic deformation?', a: 'elastic deformation is reversible while plastic deformation is permanent', alt: [], type: 'open' },
    ],
  },
  'material-classes': {
    questions: [
      { q: 'Name the four main classes of engineering materials.', a: 'metals, ceramics, polymers, composites', alt: ['metals ceramics polymers composites'], type: 'short' },
      { q: 'What characterizes metals as engineering materials?', a: 'good conductors of heat and electricity, ductile, strong, and can be alloyed', alt: [], type: 'open' },
      { q: 'What characterizes ceramics?', a: 'hard, brittle, heat-resistant, and electrically insulating', alt: [], type: 'open' },
      { q: 'True or false: Polymers are generally good thermal conductors.', a: 'false', alt: [], type: 'tf' },
      { q: 'What is a composite material?', a: 'a material made from two or more constituent materials with different properties', alt: ['a combination of materials'], type: 'open' },
      { q: 'Give an example of a composite material.', a: 'carbon fiber reinforced polymer', alt: ['fiberglass', 'reinforced concrete', 'plywood', 'CFRP'], type: 'multi' },
      { q: 'Why are semiconductors important in engineering?', a: 'they enable electronic devices by controlling electrical conductivity', alt: [], type: 'open' },
      { q: 'What class of materials is rubber?', a: 'polymer', alt: ['elastomer', 'polymers'], type: 'short' },
    ],
  },
  'material-selection': {
    questions: [
      { q: 'What factors must engineers consider when selecting materials?', a: 'mechanical properties, cost, availability, manufacturability, and environmental impact', alt: [], type: 'open' },
      { q: 'What is an Ashby chart?', a: 'a material selection plot that maps two properties against each other to compare material classes', alt: ['a materials property chart'], type: 'open' },
      { q: 'Why might an engineer choose aluminum over steel for an aircraft?', a: 'aluminum has a higher strength-to-weight ratio, reducing aircraft weight', alt: ['lighter weight', 'better strength-to-weight ratio'], type: 'open' },
      { q: 'True or false: The strongest material is always the best choice.', a: 'false', alt: [], type: 'tf' },
      { q: 'What is corrosion resistance and why does it matter in material selection?', a: 'the ability to withstand degradation from the environment; it affects durability and maintenance costs', alt: [], type: 'open' },
      { q: 'What is the strength-to-weight ratio?', a: 'a material\'s strength divided by its density, indicating efficiency', alt: ['specific strength'], type: 'open' },
      { q: 'Why consider recyclability when selecting materials?', a: 'to reduce environmental impact and comply with sustainability goals', alt: [], type: 'open' },
      { q: 'What is biocompatibility?', a: 'the ability of a material to function in contact with living tissue without causing harm', alt: [], type: 'open' },
    ],
  },
  'material-testing': {
    questions: [
      { q: 'What does a tensile test measure?', a: 'the stress-strain behavior of a material when pulled until failure', alt: ['how a material responds to pulling force'], type: 'open' },
      { q: 'What is a hardness test?', a: 'a test that measures resistance to indentation, such as Rockwell or Brinell', alt: ['measures resistance to surface deformation'], type: 'open' },
      { q: 'What is an impact test?', a: 'a test that measures a material\'s resistance to sudden force, such as the Charpy test', alt: ['measures toughness under sudden loading'], type: 'open' },
      { q: 'True or false: Non-destructive testing damages the material being tested.', a: 'false', alt: [], type: 'tf' },
      { q: 'Name one non-destructive testing method.', a: 'ultrasonic testing', alt: ['X-ray', 'radiography', 'magnetic particle inspection', 'dye penetrant'], type: 'multi' },
      { q: 'What does a stress-strain curve show?', a: 'the relationship between applied stress and resulting strain in a material', alt: [], type: 'open' },
      { q: 'What is the yield point on a stress-strain curve?', a: 'the stress at which the material begins to deform plastically', alt: ['where permanent deformation begins'], type: 'open' },
      { q: 'Why is fatigue testing important for aircraft components?', a: 'aircraft parts experience repeated cyclic loads and must resist fatigue failure', alt: [], type: 'open' },
    ],
  },
  'composites-and-alloys': {
    questions: [
      { q: 'What is an alloy?', a: 'a mixture of a metal with one or more other elements to improve properties', alt: ['a metal mixture'], type: 'open' },
      { q: 'Why is steel stronger than pure iron?', a: 'the addition of carbon creates a crystal structure that resists deformation', alt: ['carbon strengthens the iron lattice'], type: 'open' },
      { q: 'What is the matrix phase in a composite?', a: 'the continuous material that surrounds and supports the reinforcement', alt: ['the binding material'], type: 'open' },
      { q: 'True or false: Carbon fiber is stronger than steel by weight.', a: 'true', alt: [], type: 'tf' },
      { q: 'What is fiber-reinforced polymer?', a: 'a composite with strong fibers embedded in a polymer matrix', alt: ['FRP'], type: 'open' },
      { q: 'Name one advantage of composites over metals.', a: 'higher strength-to-weight ratio', alt: ['lighter weight', 'corrosion resistance', 'design flexibility'], type: 'multi' },
      { q: 'What is stainless steel and what makes it stain-resistant?', a: 'an alloy of iron with chromium; the chromium forms a protective oxide layer', alt: [], type: 'open' },
      { q: 'What is a laminate composite?', a: 'a composite made of layers of different materials bonded together', alt: ['layered composite'], type: 'open' },
    ],
  },

  /* ============ STRUCTURAL ANALYSIS ============ */
  'loads-and-forces': {
    questions: [
      { q: 'What is a dead load?', a: 'the permanent static weight of the structure itself', alt: ['the weight of the structure'], type: 'open' },
      { q: 'What is a live load?', a: 'a temporary or variable load such as people, furniture, or vehicles', alt: ['variable or moving loads'], type: 'open' },
      { q: 'What is a dynamic load?', a: 'a load that changes over time, such as wind or earthquake forces', alt: ['a time-varying load'], type: 'open' },
      { q: 'True or false: Wind is an example of a static load.', a: 'false', alt: [], type: 'tf' },
      { q: 'What is a point load?', a: 'a concentrated force applied at a single location', alt: ['a force at one point'], type: 'open' },
      { q: 'What is a distributed load?', a: 'a force spread over an area or length of a structure', alt: ['a load spread over a surface'], type: 'open' },
      { q: 'Name one type of load that bridges must resist.', a: 'traffic load', alt: ['dead load', 'wind load', 'live load', 'seismic load'], type: 'multi' },
      { q: 'What is a load path?', a: 'the route through which forces travel from the point of application to the foundation', alt: [], type: 'open' },
    ],
  },
  'stress-and-strain': {
    questions: [
      { q: 'What is engineering stress?', a: 'force divided by the original cross-sectional area', alt: ['force per unit area'], type: 'open' },
      { q: 'What is strain?', a: 'the change in length divided by the original length', alt: ['deformation per unit length'], type: 'open' },
      { q: 'What are the units of stress in SI?', a: 'pascals', alt: ['Pa', 'N/m^2', 'newtons per square meter'], type: 'short' },
      { q: 'True or false: Strain has no units.', a: 'true', alt: [], type: 'tf' },
      { q: 'What is shear stress?', a: 'stress caused by forces acting parallel to the cross-section', alt: ['tangential stress'], type: 'open' },
      { q: 'What is Hooke\'s Law?', a: 'stress is proportional to strain in the elastic region', alt: ['sigma equals E times epsilon'], type: 'open' },
      { q: 'What happens when stress exceeds the yield strength?', a: 'the material deforms plastically and does not return to its original shape', alt: ['permanent deformation occurs'], type: 'open' },
      { q: 'What is compressive stress?', a: 'stress from forces that squeeze or compress a material', alt: ['stress from pushing forces'], type: 'open' },
    ],
  },
  'factor-of-safety': {
    questions: [
      { q: 'What is the factor of safety?', a: 'the ratio of the material\'s ultimate strength to the maximum expected stress', alt: ['strength divided by expected load'], type: 'open' },
      { q: 'If a cable has ultimate strength of 10000 N and the expected load is 2500 N, what is the factor of safety?', a: '4', alt: ['4.0'], type: 'short' },
      { q: 'Why do engineers use a factor of safety greater than 1?', a: 'to account for uncertainties in loads, material properties, and manufacturing', alt: ['to ensure the structure can handle unexpected loads'], type: 'open' },
      { q: 'True or false: A factor of safety of exactly 1 means the structure is perfectly safe.', a: 'false', alt: [], type: 'tf' },
      { q: 'What happens if the factor of safety is too high?', a: 'the design becomes unnecessarily heavy, expensive, or wasteful of materials', alt: ['overdesigned and costly'], type: 'open' },
      { q: 'What typical factor of safety is used for structural steel in buildings?', a: '1.5 to 2', alt: ['about 2', '1.67', '2'], type: 'short' },
      { q: 'Why do aircraft require careful factor-of-safety selection?', a: 'excess weight directly reduces performance and fuel efficiency', alt: [], type: 'open' },
      { q: 'What is a margin of safety?', a: 'the factor of safety minus one, expressed as a fraction or percentage', alt: [], type: 'open' },
    ],
  },
  'structural-types': {
    questions: [
      { q: 'What is a truss?', a: 'a structure made of triangular units connected at joints to distribute loads', alt: ['a triangulated frame structure'], type: 'open' },
      { q: 'Why are triangles used in trusses?', a: 'triangles are inherently rigid and do not deform under load like rectangles', alt: ['triangles cannot collapse like rectangles'], type: 'open' },
      { q: 'What is a beam?', a: 'a horizontal structural member that resists bending', alt: ['a structural element that spans a gap'], type: 'open' },
      { q: 'True or false: An arch converts vertical loads into compressive forces along its curve.', a: 'true', alt: [], type: 'tf' },
      { q: 'What is a cantilever?', a: 'a beam fixed at one end and free at the other', alt: ['a projecting beam supported at one end'], type: 'open' },
      { q: 'Name one advantage of suspension bridges.', a: 'they can span very long distances', alt: ['long span capability', 'flexible deck'], type: 'multi' },
      { q: 'What is a column?', a: 'a vertical structural member that carries compressive loads', alt: ['a vertical support'], type: 'open' },
      { q: 'What structural type uses cables in tension to support a deck?', a: 'cable-stayed bridge', alt: ['suspension bridge'], type: 'short' },
    ],
  },
  'failure-modes': {
    questions: [
      { q: 'What is buckling?', a: 'sudden lateral deflection of a structural member under compressive load', alt: ['sideways collapse under compression'], type: 'open' },
      { q: 'What is fatigue failure?', a: 'fracture caused by repeated cyclic loading below the material\'s ultimate strength', alt: ['failure from repeated stress cycles'], type: 'open' },
      { q: 'What is creep?', a: 'slow, permanent deformation under constant stress over long periods, especially at high temperatures', alt: ['time-dependent deformation'], type: 'open' },
      { q: 'True or false: Brittle fracture occurs with significant plastic deformation.', a: 'false', alt: [], type: 'tf' },
      { q: 'What is corrosion-induced failure?', a: 'structural failure caused by material degradation from chemical reactions with the environment', alt: [], type: 'open' },
      { q: 'What famous bridge collapsed due to resonance from wind?', a: 'Tacoma Narrows Bridge', alt: ['Tacoma Narrows', 'Galloping Gertie'], type: 'short' },
      { q: 'What is stress concentration?', a: 'a localized increase in stress at a geometric discontinuity like a hole or notch', alt: ['increased stress at a discontinuity'], type: 'open' },
      { q: 'How can engineers prevent fatigue failure?', a: 'by designing for lower stress levels, using fatigue-resistant materials, and regular inspection', alt: [], type: 'open' },
    ],
  },

  /* ============ ENERGY SYSTEMS ============ */
  'energy-conversion': {
    questions: [
      { q: 'What is energy conversion?', a: 'the transformation of energy from one form to another', alt: ['changing energy from one type to another'], type: 'open' },
      { q: 'What energy conversion occurs in a coal power plant?', a: 'chemical energy to thermal energy to mechanical energy to electrical energy', alt: ['chemical to thermal to mechanical to electrical'], type: 'open' },
      { q: 'True or false: Energy can be created and destroyed according to thermodynamics.', a: 'false', alt: [], type: 'tf' },
      { q: 'What energy conversion occurs in a solar photovoltaic panel?', a: 'light energy directly to electrical energy', alt: ['solar to electrical', 'radiant to electrical'], type: 'open' },
      { q: 'What is a generator?', a: 'a device that converts mechanical energy into electrical energy', alt: ['converts motion to electricity'], type: 'open' },
      { q: 'What is the law of conservation of energy?', a: 'energy cannot be created or destroyed, only transformed from one form to another', alt: ['first law of thermodynamics'], type: 'open' },
      { q: 'What energy conversion occurs in a battery?', a: 'chemical energy to electrical energy', alt: ['chemical to electrical'], type: 'open' },
      { q: 'Name one form of wasted energy in most energy conversions.', a: 'heat', alt: ['thermal energy', 'friction heat', 'sound'], type: 'multi' },
    ],
  },
  'efficiency': {
    questions: [
      { q: 'How is energy efficiency calculated?', a: 'useful energy output divided by total energy input, multiplied by 100 percent', alt: ['output over input times 100'], type: 'open' },
      { q: 'If a motor uses 500 J and produces 350 J of useful work, what is its efficiency?', a: '70%', alt: ['70', '0.70', '70 percent'], type: 'short' },
      { q: 'True or false: A machine can be 100 percent efficient.', a: 'false', alt: [], type: 'tf' },
      { q: 'What is the typical efficiency of an incandescent light bulb?', a: 'about 5 percent', alt: ['5%', '5 to 10 percent', 'around 5%', '2-5%'], type: 'short' },
      { q: 'Why is efficiency important in engineering design?', a: 'higher efficiency means less wasted energy, lower costs, and reduced environmental impact', alt: [], type: 'open' },
      { q: 'What is the Carnot efficiency?', a: 'the theoretical maximum efficiency of a heat engine operating between two temperatures', alt: [], type: 'open' },
      { q: 'How do LED lights compare to incandescent bulbs in efficiency?', a: 'LEDs are much more efficient, converting more electrical energy into light', alt: ['LEDs are more efficient'], type: 'open' },
      { q: 'What is cogeneration?', a: 'simultaneously generating electricity and useful heat from the same energy source', alt: ['combined heat and power'], type: 'open' },
    ],
  },
  'renewable-sources': {
    questions: [
      { q: 'Name three renewable energy sources.', a: 'solar, wind, hydroelectric', alt: ['solar wind hydro', 'wind solar geothermal', 'biomass solar wind'], type: 'short' },
      { q: 'What makes an energy source renewable?', a: 'it is naturally replenished on a human timescale and will not run out', alt: ['it replenishes naturally'], type: 'open' },
      { q: 'What is the main disadvantage of solar and wind energy?', a: 'intermittency, meaning they depend on weather and time of day', alt: ['they are intermittent', 'variability'], type: 'open' },
      { q: 'True or false: Geothermal energy depends on sunlight.', a: 'false', alt: [], type: 'tf' },
      { q: 'How does a wind turbine generate electricity?', a: 'wind turns the blades which spin a generator to produce electricity', alt: ['wind spins blades connected to a generator'], type: 'open' },
      { q: 'What is a capacity factor?', a: 'the ratio of actual energy output to the maximum possible output over a period', alt: [], type: 'open' },
      { q: 'Why is energy storage important for renewable energy?', a: 'it allows energy generated during peak production to be used when generation is low', alt: ['to handle intermittency'], type: 'open' },
      { q: 'What is a photovoltaic cell?', a: 'a device that converts sunlight directly into electricity using semiconductor materials', alt: ['solar cell'], type: 'open' },
    ],
  },
  'grid-fundamentals': {
    questions: [
      { q: 'What is the electrical grid?', a: 'the network of power generation, transmission, and distribution infrastructure', alt: ['the power distribution network'], type: 'open' },
      { q: 'Why do power lines use high voltage for long-distance transmission?', a: 'higher voltage reduces current and therefore reduces resistive energy losses', alt: ['to reduce transmission losses'], type: 'open' },
      { q: 'What is a transformer used for in the grid?', a: 'to change voltage levels between generation, transmission, and distribution', alt: ['to step up or step down voltage'], type: 'open' },
      { q: 'True or false: The grid must constantly balance supply and demand in real time.', a: 'true', alt: [], type: 'tf' },
      { q: 'What is a microgrid?', a: 'a small-scale, localized power grid that can operate independently or connected to the main grid', alt: ['a local power grid'], type: 'open' },
      { q: 'What happens if electricity demand exceeds supply on the grid?', a: 'frequency drops and rolling blackouts or brownouts may occur', alt: ['blackouts can occur'], type: 'open' },
      { q: 'What is baseload power?', a: 'the minimum level of electricity demand over a period, supplied by continuously running plants', alt: ['minimum constant demand'], type: 'open' },
      { q: 'Name one type of energy storage used for grid stabilization.', a: 'battery storage', alt: ['pumped hydro', 'flywheel', 'compressed air', 'lithium-ion batteries'], type: 'multi' },
    ],
  },
  'thermodynamics-basics': {
    questions: [
      { q: 'What is the first law of thermodynamics?', a: 'energy cannot be created or destroyed, only transformed', alt: ['conservation of energy'], type: 'open' },
      { q: 'What is the second law of thermodynamics?', a: 'entropy of an isolated system always increases; heat flows from hot to cold', alt: ['entropy always increases'], type: 'open' },
      { q: 'What is entropy?', a: 'a measure of disorder or randomness in a system', alt: ['measure of disorder'], type: 'open' },
      { q: 'True or false: Heat can spontaneously flow from cold to hot.', a: 'false', alt: [], type: 'tf' },
      { q: 'What is a heat engine?', a: 'a device that converts thermal energy into mechanical work', alt: ['converts heat to work'], type: 'open' },
      { q: 'What are the three modes of heat transfer?', a: 'conduction, convection, radiation', alt: ['conduction convection radiation'], type: 'short' },
      { q: 'Why can no real engine achieve Carnot efficiency?', a: 'real engines have irreversible processes like friction and heat loss', alt: ['irreversibilities prevent it'], type: 'open' },
      { q: 'What is specific heat capacity?', a: 'the amount of heat needed to raise the temperature of one unit mass by one degree', alt: ['heat per unit mass per degree'], type: 'open' },
    ],
  },

  /* ============ COMPUTATIONAL MODELING ============ */
  'cad-basics': {
    questions: [
      { q: 'What does CAD stand for?', a: 'computer-aided design', alt: ['computer aided design'], type: 'short' },
      { q: 'Name one advantage of CAD over hand drafting.', a: 'easy to modify and iterate designs', alt: ['precision', 'faster changes', 'digital storage', 'sharing'], type: 'multi' },
      { q: 'What is a 3D model in CAD?', a: 'a digital representation of a physical object with length, width, and height', alt: ['a three-dimensional digital representation'], type: 'open' },
      { q: 'True or false: CAD software can simulate how a design will perform under stress.', a: 'true', alt: [], type: 'tf' },
      { q: 'What is parametric modeling?', a: 'defining a model using parameters and constraints so changes propagate automatically', alt: ['using parameters to define geometry'], type: 'open' },
      { q: 'What is an assembly in CAD?', a: 'a model composed of multiple parts fitted together', alt: ['multiple parts joined in one model'], type: 'open' },
      { q: 'Name one common CAD software package.', a: 'SolidWorks', alt: ['AutoCAD', 'Fusion 360', 'CATIA', 'Inventor', 'Onshape', 'Creo'], type: 'multi' },
      { q: 'What is a technical drawing generated from a CAD model?', a: 'a 2D representation with dimensions, tolerances, and annotations for manufacturing', alt: ['an engineering drawing'], type: 'open' },
    ],
  },
  'simulation-intro': {
    questions: [
      { q: 'What is engineering simulation?', a: 'using computer models to predict how a design will behave under real-world conditions', alt: ['computer-based testing of designs'], type: 'open' },
      { q: 'Why do engineers use simulation before building physical prototypes?', a: 'it saves time and money by identifying problems before manufacturing', alt: ['to reduce cost and time'], type: 'open' },
      { q: 'What is computational fluid dynamics (CFD)?', a: 'simulation of fluid flow and heat transfer using numerical methods', alt: ['computer simulation of fluid behavior'], type: 'open' },
      { q: 'True or false: Simulation results are always perfectly accurate.', a: 'false', alt: [], type: 'tf' },
      { q: 'What is model validation?', a: 'comparing simulation results with experimental data to verify accuracy', alt: ['checking simulation against real data'], type: 'open' },
      { q: 'What inputs does a structural simulation typically require?', a: 'geometry, material properties, loads, and boundary conditions', alt: [], type: 'open' },
      { q: 'What is a mesh in simulation?', a: 'the division of the model into small elements for numerical computation', alt: ['discretization of geometry into elements'], type: 'open' },
      { q: 'Name one type of engineering simulation.', a: 'finite element analysis', alt: ['CFD', 'thermal simulation', 'stress analysis', 'modal analysis'], type: 'multi' },
    ],
  },
  'algorithmic-thinking': {
    questions: [
      { q: 'What is an algorithm?', a: 'a step-by-step procedure for solving a problem or completing a task', alt: ['a set of instructions to solve a problem'], type: 'open' },
      { q: 'What is decomposition in computational thinking?', a: 'breaking a complex problem into smaller, manageable sub-problems', alt: ['dividing a problem into parts'], type: 'open' },
      { q: 'What is abstraction?', a: 'focusing on essential features while ignoring irrelevant details', alt: ['simplifying by removing unnecessary details'], type: 'open' },
      { q: 'True or false: Pseudocode is a programming language that can be compiled.', a: 'false', alt: [], type: 'tf' },
      { q: 'What is pattern recognition in engineering problem-solving?', a: 'identifying recurring features or solutions that can be applied to new problems', alt: ['finding similarities across problems'], type: 'open' },
      { q: 'Why is algorithmic thinking useful for engineers?', a: 'it provides systematic approaches to solve complex problems efficiently', alt: [], type: 'open' },
      { q: 'What is a flowchart?', a: 'a diagram that represents an algorithm or process using shapes and arrows', alt: ['a visual representation of a process'], type: 'open' },
      { q: 'What is iteration in programming?', a: 'repeating a set of instructions until a condition is met', alt: ['looping'], type: 'open' },
    ],
  },
  'data-analysis': {
    questions: [
      { q: 'Why is data analysis important in engineering?', a: 'it provides evidence-based insights for design decisions', alt: ['to make informed decisions'], type: 'open' },
      { q: 'What is the mean of test data?', a: 'the sum of all values divided by the number of values', alt: ['average'], type: 'open' },
      { q: 'What is standard deviation?', a: 'a measure of how spread out data points are from the mean', alt: ['a measure of data variability'], type: 'open' },
      { q: 'True or false: A scatter plot shows the relationship between two variables.', a: 'true', alt: [], type: 'tf' },
      { q: 'What is a trend line?', a: 'a line fitted to data points to show the general direction of the data', alt: ['line of best fit', 'regression line'], type: 'open' },
      { q: 'What is an outlier?', a: 'a data point significantly different from the rest of the data set', alt: ['an extreme data point'], type: 'open' },
      { q: 'When should engineers discard outliers?', a: 'only when there is a clear reason such as measurement error, never arbitrarily', alt: [], type: 'open' },
      { q: 'What type of chart compares categories?', a: 'bar chart', alt: ['bar graph'], type: 'short' },
    ],
  },
  'finite-element-concepts': {
    questions: [
      { q: 'What is finite element analysis (FEA)?', a: 'a numerical method that divides a structure into small elements to calculate stress, strain, and deformation', alt: ['a method to simulate structural behavior using mesh elements'], type: 'open' },
      { q: 'What is a node in FEA?', a: 'a point where elements connect and where calculations are performed', alt: ['a connection point between elements'], type: 'open' },
      { q: 'What are boundary conditions in FEA?', a: 'constraints that define how the model is supported and loaded', alt: ['fixed supports and applied loads'], type: 'open' },
      { q: 'True or false: A finer mesh always gives more accurate results without any downsides.', a: 'false', alt: [], type: 'tf' },
      { q: 'What is mesh convergence?', a: 'refining the mesh until the results stop changing significantly', alt: ['the point where finer mesh no longer changes results'], type: 'open' },
      { q: 'What types of elements are used in FEA?', a: 'triangles and quadrilaterals in 2D, tetrahedra and hexahedra in 3D', alt: ['tets and hexes', 'triangular and quadrilateral'], type: 'open' },
      { q: 'Why is FEA important in modern engineering?', a: 'it allows testing designs virtually before manufacturing, saving time and cost', alt: [], type: 'open' },
      { q: 'What is a stress contour plot?', a: 'a color-coded visualization showing stress distribution across a structure', alt: ['color map of stress values'], type: 'open' },
    ],
  },

  /* ============ ETHICS IN ENGINEERING ============ */
  'codes-of-ethics': {
    questions: [
      { q: 'What is a code of ethics in engineering?', a: 'a set of principles and standards that guide professional conduct', alt: ['professional conduct guidelines'], type: 'open' },
      { q: 'What is the first fundamental canon of NSPE engineering ethics?', a: 'hold paramount the safety, health, and welfare of the public', alt: ['public safety is paramount', 'protect the public'], type: 'open' },
      { q: 'True or false: Engineers are only responsible to their employers, not the public.', a: 'false', alt: [], type: 'tf' },
      { q: 'What does NSPE stand for?', a: 'National Society of Professional Engineers', alt: [], type: 'short' },
      { q: 'Why are codes of ethics important for the engineering profession?', a: 'they build public trust and ensure engineers act responsibly', alt: [], type: 'open' },
      { q: 'What should an engineer do if asked to approve an unsafe design?', a: 'refuse and report the safety concern through proper channels', alt: ['refuse to approve it'], type: 'open' },
      { q: 'What is professional licensure?', a: 'a legal certification that an engineer has met education, experience, and exam requirements to practice', alt: ['PE license'], type: 'open' },
      { q: 'What is conflict of interest in engineering?', a: 'when personal interests could compromise professional judgment', alt: [], type: 'open' },
    ],
  },
  'safety-responsibility': {
    questions: [
      { q: 'What is a safety factor and why is it used?', a: 'a multiplier applied to design loads to account for uncertainty and ensure safety', alt: ['a margin of safety in design'], type: 'open' },
      { q: 'What is a failure mode and effects analysis (FMEA)?', a: 'a systematic method for identifying potential failures and their consequences', alt: ['a risk assessment method'], type: 'open' },
      { q: 'True or false: Engineers can be held legally liable for design failures that harm people.', a: 'true', alt: [], type: 'tf' },
      { q: 'What is risk assessment in engineering?', a: 'evaluating the probability and severity of potential hazards', alt: ['identifying and analyzing hazards'], type: 'open' },
      { q: 'What caused the Challenger space shuttle disaster?', a: 'O-ring failure due to cold temperatures, worsened by management ignoring engineer warnings', alt: ['O-ring failure', 'failed O-rings in cold weather'], type: 'open' },
      { q: 'What is the precautionary principle?', a: 'when there is uncertainty about harm, take preventive action rather than wait for proof', alt: [], type: 'open' },
      { q: 'Why must engineers consider worst-case scenarios?', a: 'to ensure designs remain safe even under extreme or unexpected conditions', alt: [], type: 'open' },
      { q: 'What is redundancy in safety engineering?', a: 'including backup systems so that if one component fails, the system still functions', alt: ['backup systems'], type: 'open' },
    ],
  },
  'environmental-impact': {
    questions: [
      { q: 'What is a life-cycle assessment?', a: 'an analysis of the environmental impact of a product from raw materials to disposal', alt: ['LCA', 'cradle-to-grave analysis'], type: 'open' },
      { q: 'What is sustainable engineering?', a: 'designing solutions that meet present needs without compromising future generations', alt: ['engineering that considers long-term environmental impact'], type: 'open' },
      { q: 'True or false: Engineers have a responsibility to minimize environmental harm.', a: 'true', alt: [], type: 'tf' },
      { q: 'What is the carbon footprint of a product?', a: 'the total greenhouse gas emissions produced during its lifecycle', alt: ['total CO2 emissions over its life'], type: 'open' },
      { q: 'What is design for disassembly?', a: 'designing products so components can be easily separated for recycling or reuse', alt: [], type: 'open' },
      { q: 'What is cradle-to-cradle design?', a: 'a design philosophy where all materials are either safely returned to nature or recycled into new products', alt: [], type: 'open' },
      { q: 'Name one way engineers can reduce environmental impact.', a: 'use renewable materials', alt: ['reduce waste', 'design for recyclability', 'improve energy efficiency', 'use less material'], type: 'multi' },
      { q: 'What is green engineering?', a: 'designing products and processes that minimize pollution and resource use', alt: [], type: 'open' },
    ],
  },
  'equity-and-access': {
    questions: [
      { q: 'What is universal design?', a: 'designing products and environments usable by all people without adaptation', alt: ['design for everyone'], type: 'open' },
      { q: 'Why should engineers consider equity in their designs?', a: 'to ensure solutions benefit all communities and do not disproportionately harm marginalized groups', alt: [], type: 'open' },
      { q: 'True or false: Technology always benefits all people equally.', a: 'false', alt: [], type: 'tf' },
      { q: 'What is the digital divide?', a: 'the gap between those who have access to technology and those who do not', alt: ['unequal access to technology'], type: 'open' },
      { q: 'Give an example of engineering for equity.', a: 'designing affordable water purification for developing communities', alt: ['low-cost prosthetics', 'accessible buildings', 'affordable housing design'], type: 'multi' },
      { q: 'What is accessibility in engineering design?', a: 'ensuring products and spaces can be used by people with disabilities', alt: ['designing for people with disabilities'], type: 'open' },
      { q: 'Why is diverse representation important in engineering teams?', a: 'diverse perspectives lead to more creative and inclusive designs', alt: [], type: 'open' },
      { q: 'What is appropriate technology?', a: 'technology designed to be suitable for the social, economic, and environmental conditions of the community it serves', alt: [], type: 'open' },
    ],
  },
  'whistleblowing-and-integrity': {
    questions: [
      { q: 'What is whistleblowing in engineering?', a: 'reporting unethical or unsafe practices to authorities when internal channels fail', alt: ['reporting wrongdoing'], type: 'open' },
      { q: 'True or false: Whistleblowers are always protected by law.', a: 'false', alt: [], type: 'tf' },
      { q: 'What should an engineer do first when discovering unethical practices?', a: 'report through internal channels such as supervisors or ethics committees', alt: ['report internally first'], type: 'open' },
      { q: 'Name one famous engineering whistleblower case.', a: 'Roger Boisjoly and the Challenger disaster', alt: ['Challenger O-ring', 'Ford Pinto', 'Deepwater Horizon'], type: 'multi' },
      { q: 'What is professional integrity?', a: 'consistently acting in accordance with ethical principles even under pressure', alt: ['honesty and ethical behavior'], type: 'open' },
      { q: 'Why might an engineer face pressure to compromise ethics?', a: 'due to schedule, budget, or business pressures from management', alt: [], type: 'open' },
      { q: 'What is informed consent in engineering?', a: 'ensuring that affected parties understand risks before decisions are made', alt: [], type: 'open' },
      { q: 'What role does documentation play in ethical engineering?', a: 'it creates a record of decisions and warnings that supports accountability', alt: [], type: 'open' },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  SCENARIOS — for scenario command                                  */
/* ------------------------------------------------------------------ */

const SCENARIOS = {
  standard: [
    {
      title: 'Bridge Redesign Challenge',
      passage: 'Your city needs to replace an aging pedestrian bridge over a river. The current bridge is a simple beam design rated for 50 pedestrians. The new bridge must handle 200 pedestrians, include accessibility ramps, and be built within a $2 million budget. The river is 30 meters wide. Environmental regulations require minimal disturbance to the riverbed. Local residents want the bridge to be aesthetically pleasing.',
      questions: [
        'What are the criteria and constraints for this design problem?',
        'What structural type would you recommend and why?',
        'How would you balance cost with the aesthetic requirements?',
      ],
    },
    {
      title: 'Solar-Powered School',
      passage: 'A rural school with 500 students has no connection to the electrical grid and currently uses diesel generators that cost $3000 per month. The school wants to switch to solar power. The roof area is 800 square meters, the region receives an average of 5 peak sun hours per day, and the school uses approximately 200 kWh per day. Budget for the project is $150,000.',
      questions: [
        'Calculate whether the roof area is sufficient for the needed solar panels.',
        'What energy storage solution would you recommend for nighttime use?',
        'What is the payback period compared to continuing diesel use?',
      ],
    },
    {
      title: 'Material Selection for Prosthetic Limb',
      passage: 'An engineering team is designing a lower-leg prosthetic for active adults. The prosthetic must withstand repeated impact forces of up to 3 times body weight, be lightweight for comfort, resist corrosion from sweat, and cost under $500 to manufacture. Current designs use titanium alloy, but the team is exploring alternatives.',
      questions: [
        'What material properties are most critical for this application?',
        'Compare carbon fiber composite vs titanium for this use case.',
        'What ethical considerations should guide the design for affordability?',
      ],
    },
  ],
  advanced: [
    {
      title: 'Earthquake-Resistant High-Rise',
      passage: 'A 40-story residential tower is planned for a seismically active zone (Zone 4). The building must withstand a magnitude 7.0 earthquake with a return period of 475 years. The design must incorporate base isolation or damping systems. Soil conditions show soft clay to 15 meters depth overlying bedrock. The budget is $120 million, and the building must house 400 units.',
      questions: [
        'What structural system would you choose and what factor of safety would you apply?',
        'Compare base isolation vs tuned mass dampers for this scenario.',
        'How does the soft clay layer affect your foundation design?',
      ],
    },
    {
      title: 'Microgrid for Island Community',
      passage: 'A remote island community of 2000 residents currently relies entirely on imported diesel fuel costing $1.5 million annually. The island receives strong trade winds (average 7 m/s) and abundant sunshine (6 peak sun hours). Peak demand is 1.5 MW. The community wants 90% renewable energy within 5 years. Shipping large components to the island is expensive and limited by port capacity.',
      questions: [
        'Design an energy mix using wind, solar, and storage to meet the 90% target.',
        'What grid stabilization challenges arise with high renewable penetration?',
        'Perform a basic economic analysis comparing the renewable system to continued diesel use.',
      ],
    },
    {
      title: 'Autonomous Vehicle Ethics Simulation',
      passage: 'Your team is developing decision-making algorithms for an autonomous vehicle. The vehicle must handle a scenario where sensor failure occurs at 60 km/h on a two-lane road. The algorithm must decide between swerving left (oncoming lane, potential head-on collision), swerving right (pedestrian sidewalk), or emergency braking (rear-end collision risk from following vehicle). Simulation data shows each option has different risk profiles.',
      questions: [
        'What ethical framework should guide the algorithm design?',
        'How would you use computational modeling to evaluate each scenario?',
        'Who bears responsibility when an autonomous system causes harm?',
      ],
    },
    {
      title: 'Composite Wing Spar Optimization',
      passage: 'An aerospace company is redesigning a wing spar from aluminum 7075-T6 to carbon fiber reinforced polymer (CFRP). The spar must resist bending moments up to 450 kN-m and shear forces up to 120 kN. The current aluminum spar weighs 85 kg. The target weight reduction is 35%. The laminate layup must be optimized for multidirectional loading. Manufacturing must be feasible with autoclave curing at the existing facility.',
      questions: [
        'What laminate stacking sequence would you propose and why?',
        'How would you validate the FEA model against physical testing?',
        'What failure modes are unique to composite structures compared to metals?',
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  FILE I/O                                                          */
/* ------------------------------------------------------------------ */

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function profilePath(id) {
  return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json');
}

function loadProfile(id) {
  const fp = profilePath(id);
  if (fs.existsSync(fp)) {
    try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch {
      fs.renameSync(fp, fp + '.corrupt.' + Date.now());
    }
  }
  return { studentId: id, level: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
}

function saveProfile(p) {
  ensureDataDir();
  fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8');
}

/* ------------------------------------------------------------------ */
/*  HELPERS                                                           */
/* ------------------------------------------------------------------ */

function calcMastery(attempts) {
  if (!attempts || !attempts.length) return 0;
  const recent = attempts.slice(-5).filter(a => a.total > 0);
  if (!recent.length) return 0;
  return Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100;
}

function masteryLabel(r) {
  if (r >= 0.9) return 'mastered';
  if (r >= MASTERY_THRESHOLD) return 'proficient';
  if (r >= 0.6) return 'developing';
  if (r > 0) return 'emerging';
  return 'not-started';
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr, n) {
  return shuffle(arr).slice(0, Math.min(n, arr.length));
}

function resolveSkillKey(level, skillName) {
  const cats = SKILLS[level];
  if (!cats) return null;
  for (const [cat, skills] of Object.entries(cats)) {
    if (skills.includes(skillName)) return { level, category: cat, skill: skillName };
  }
  return null;
}

function norm(s) {
  return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, '');
}

/* ------------------------------------------------------------------ */
/*  EXERCISE GENERATION — picks 5 random questions                    */
/* ------------------------------------------------------------------ */

function generateExercise(level, skill, count = 5) {
  const bank = CONTENT_BANKS[skill];
  if (!bank || !bank.questions) return { error: `No content bank for skill "${skill}"` };
  const resolved = resolveSkillKey(level, skill);
  if (!resolved) return { error: `Skill "${skill}" not found in level "${level}"` };
  const items = pick(bank.questions, count).map(q => {
    const accepted = Array.isArray(q.a) ? [...q.a] : [q.a];
    if (q.alt && q.alt.length) {
      const existing = new Set(accepted.map(norm));
      q.alt.forEach(a => { if (!existing.has(norm(a))) accepted.push(a); });
    }
    return {
      prompt: q.q,
      answer: Array.isArray(q.a) ? q.a[0] : q.a,
      acceptedAnswers: accepted,
      type: q.type,
    };
  });
  return {
    type: 'engineering',
    skill: resolved.skill,
    category: resolved.category,
    level,
    count: items.length,
    instruction: 'Answer each question about engineering.',
    items,
  };
}

/* ------------------------------------------------------------------ */
/*  ANSWER CHECKING with normalization                                */
/* ------------------------------------------------------------------ */

function checkAnswer(type, expected, answer) {
  const studentNorm = norm(answer);
  if (Array.isArray(expected)) {
    return expected.some(r => norm(r) === studentNorm);
  }
  return norm(expected) === studentNorm;
}

/* ------------------------------------------------------------------ */
/*  MAIN CLASS — Engineering                                          */
/* ------------------------------------------------------------------ */

class Engineering {
  start(id, level) {
    if (level) this.setLevel(id, level);
    const p = loadProfile(id);
    return {
      action: 'start',
      profile: { studentId: p.studentId, level: p.level, createdAt: p.createdAt, totalAssessments: p.assessments.length },
      nextSkills: this.next(id),
    };
  }

  lesson(id) {
    const p = loadProfile(id);
    const level = p.level || 'standard';
    const target = this.next(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Consider advancing to the next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    const scenario = SCENARIOS[level] ? pick(SCENARIOS[level], 1)[0] : null;
    return {
      studentId: id,
      level,
      targetSkill: target,
      exercise,
      scenario: scenario || null,
      lessonPlan: {
        engage: scenario ? `Scenario: ${scenario.title}` : 'Present a real-world engineering challenge',
        explore: `Investigate: ${target.category} > ${target.skill}`,
        explain: `Build understanding with ${exercise.count || 0} practice items`,
        elaborate: 'Apply concepts to a design scenario with real constraints',
        evaluate: 'Reflect on engineering process and document learning',
      },
    };
  }

  exercise(id, skill) {
    const p = loadProfile(id);
    const level = p.level || 'standard';
    if (skill) {
      return generateExercise(level, skill, 5);
    }
    const n = this.next(id, 1).next;
    if (n.length) return generateExercise(level, n[0].skill, 5);
    return { message: 'All skills proficient at current level!' };
  }

  check(id, type, expected, answer) {
    let exp = expected;
    if (typeof exp === 'string') {
      try { exp = JSON.parse(exp); } catch { /* keep as string */ }
    }
    return { correct: checkAnswer(type, exp, answer), expected: exp, studentAnswer: answer };
  }

  record(id, level, category, skill, score, total, notes) {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    if (!SKILLS[level][category]) throw new Error(`Unknown category "${category}" for level ${level}`);
    if (!SKILLS[level][category].includes(skill)) throw new Error(`Unknown skill "${skill}" in ${level}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);

    const p = loadProfile(id);
    if (!p.level) p.level = level;
    const entry = { date: new Date().toISOString(), level, category, skill, score, total, notes: notes || '' };
    p.assessments.push(entry);

    const key = `${level}/${category}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p);

    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  progress(id) {
    const p = loadProfile(id);
    const level = p.level || 'standard';
    const cats = SKILLS[level] || {};
    const results = {};
    let mastered = 0;
    let total = 0;

    for (const [cat, skills] of Object.entries(cats)) {
      results[cat] = {};
      for (const sk of skills) {
        total++;
        const d = p.skills[`${level}/${cat}/${sk}`];
        results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
      }
    }

    return { studentId: id, level, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  report(id) {
    const p = loadProfile(id);
    return {
      studentId: id,
      level: p.level,
      progress: this.progress(id),
      recentAssessments: p.assessments.slice(-20).reverse(),
    };
  }

  next(id, count) {
    const n = count || 5;
    const p = loadProfile(id);
    const level = p.level || 'standard';
    const candidates = [];

    for (const [cat, skills] of Object.entries(SKILLS[level] || {})) {
      for (const sk of skills) {
        const d = p.skills[`${level}/${cat}/${sk}`];
        const m = d ? d.mastery : 0;
        if (m < MASTERY_THRESHOLD) {
          candidates.push({ level, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' });
        }
      }
    }

    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, level, next: candidates.slice(0, n) };
  }

  catalog(level) {
    if (!level) return { levels: Object.keys(SKILLS) };
    const cats = SKILLS[level];
    if (!cats) return { level, error: `Unknown level. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0;
    const catalog = {};
    for (const [cat, skills] of Object.entries(cats)) {
      total += skills.length;
      catalog[cat] = [...skills];
    }
    return { level, skills: catalog, totalSkills: total };
  }

  setLevel(id, level) {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    const p = loadProfile(id);
    p.level = level;
    saveProfile(p);
    return { studentId: id, level };
  }

  scenario(level) {
    const scenes = SCENARIOS[level];
    if (!scenes) return { error: `No scenarios for level "${level}". Available: ${Object.keys(SCENARIOS).join(', ')}` };
    return pick(scenes, 1)[0];
  }

  students() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }
}

module.exports = Engineering;

/* ------------------------------------------------------------------ */
/*  CLI DISPATCH                                                      */
/* ------------------------------------------------------------------ */

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new Engineering();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, level] = args;
        if (!id) throw new Error('Usage: start <id> [level]');
        out(api.start(id, level || null));
        break;
      }
      case 'lesson': {
        const [, id] = args;
        if (!id) throw new Error('Usage: lesson <id>');
        out(api.lesson(id));
        break;
      }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        out(api.exercise(id, skill || null));
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(api.check(args[1], type, expected, answer));
        break;
      }
      case 'record': {
        const [, id, level, cat, skill, sc, tot, ...notes] = args;
        if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total> [notes]');
        out(api.record(id, level, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': {
        const [, id] = args;
        if (!id) throw new Error('Usage: progress <id>');
        out(api.progress(id));
        break;
      }
      case 'report': {
        const [, id] = args;
        if (!id) throw new Error('Usage: report <id>');
        out(api.report(id));
        break;
      }
      case 'next': {
        const [, id, n] = args;
        if (!id) throw new Error('Usage: next <id> [count]');
        out(api.next(id, n ? Number(n) : 5));
        break;
      }
      case 'catalog': {
        const [, level] = args;
        out(api.catalog(level || null));
        break;
      }
      case 'set-level': {
        const [, id, level] = args;
        if (!id || !level) throw new Error('Usage: set-level <id> <level>');
        out(api.setLevel(id, level));
        break;
      }
      case 'scenario': {
        const [, level] = args;
        if (!level) throw new Error('Usage: scenario <level>');
        out(api.scenario(level));
        break;
      }
      case 'students': {
        out(api.students());
        break;
      }
      default:
        out({
          usage: 'node engineering.js <command> [args]',
          commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'set-level', 'scenario', 'students'],
          levels: Object.keys(SKILLS),
        });
    }
  } catch (err) {
    out({ error: err.message });
    process.exit(1);
  }
}
