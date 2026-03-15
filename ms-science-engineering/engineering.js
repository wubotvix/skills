// eClaw MS Engineering Design Interactive Tutor (6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-science-engineering');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'define-problems': ['identify-needs', 'criteria-and-constraints', 'stakeholders', 'research-context'],
    'brainstorm': ['generate-solutions', 'evaluate-ideas', 'sketching-designs'],
  },
  'grade-7': {
    'prototype-test': ['build-prototypes', 'design-tests', 'collect-data', 'analyze-test-data'],
    'compare-designs': ['trade-off-analysis', 'decision-matrices', 'peer-review'],
  },
  'grade-8': {
    'optimize': ['iterative-improvement', 'failure-analysis', 'data-driven-redesign'],
    'communicate': ['technical-documentation', 'client-presentations', 'computational-thinking'],
    'stem-integration': ['science-connections', 'math-in-engineering', 'career-connections'],
  },
};

const QUESTION_BANKS = {
  'grade-6': {
    'identify-needs': {
      questions: [
        { q: 'What is the first step in the engineering design process?', a: 'define the problem', type: 'short' },
        { q: 'Why is it important to clearly define a problem before designing a solution?', a: 'so you know exactly what the solution needs to accomplish', type: 'open' },
        { q: 'What is a need in engineering?', a: 'a problem or situation that requires a solution', type: 'open' },
        { q: 'True or false: Engineers start building before they define the problem.', a: 'false', type: 'tf' },
        { q: 'Who should engineers consider when defining a problem?', a: ['stakeholders', 'the people affected'], type: 'multi' },
        { q: 'Give an example of an engineering problem.', a: ['clean water access', 'bridge that can hold weight', 'insulated container', 'earthquake-resistant building'], type: 'multi' },
        { q: 'True or false: Engineering problems always have only one correct solution.', a: 'false', type: 'tf' },
        { q: 'What makes an engineering problem different from a science question?', a: 'engineering seeks to design a solution; science seeks to understand a phenomenon', type: 'open' },
      ],
    },
    'criteria-and-constraints': {
      questions: [
        { q: 'What are criteria in engineering design?', a: 'the requirements the solution must meet', type: 'open' },
        { q: 'What are constraints in engineering design?', a: 'the limitations on the design', type: 'open' },
        { q: 'Give an example of a criterion.', a: ['must hold 5 kg', 'must filter water', 'must span 30 cm', 'must keep water hot for 30 min'], type: 'multi' },
        { q: 'Give an example of a constraint.', a: ['budget of $10', 'must use recycled materials', 'must be built in 2 class periods', 'maximum size 20 cm'], type: 'multi' },
        { q: 'True or false: A design can ignore constraints if it meets all criteria.', a: 'false', type: 'tf' },
        { q: 'What is a specification?', a: 'a measurable, specific version of a criterion', type: 'open' },
        { q: 'Why do engineers need both criteria AND constraints?', a: 'criteria define success and constraints define the limits within which the solution must work', type: 'open' },
        { q: 'Who determines the criteria for a design?', a: ['the client', 'stakeholders', 'the problem definition'], type: 'multi' },
      ],
    },
    'stakeholders': {
      questions: [
        { q: 'What is a stakeholder?', a: 'a person affected by or interested in the design solution', type: 'open' },
        { q: 'Why is it important to consider stakeholders?', a: 'to ensure the design meets the needs of the people it is meant to help', type: 'open' },
        { q: 'Name a potential stakeholder for a school playground design.', a: ['students', 'teachers', 'parents', 'principal', 'community members'], type: 'multi' },
        { q: 'True or false: The environment can be considered a stakeholder.', a: 'true', type: 'tf' },
        { q: 'What happens if engineers ignore stakeholder needs?', a: 'the solution may not actually solve the problem or may cause new problems', type: 'open' },
        { q: 'How can engineers learn about stakeholder needs?', a: ['interviews', 'surveys', 'research', 'observation'], type: 'multi' },
        { q: 'Can different stakeholders have conflicting needs?', a: 'yes', type: 'short' },
        { q: 'What should engineers do when stakeholder needs conflict?', a: 'find compromises and make trade-offs', type: 'open' },
      ],
    },
    'research-context': {
      questions: [
        { q: 'Why do engineers research before designing?', a: 'to understand the problem, existing solutions, and relevant science', type: 'open' },
        { q: 'What science knowledge might help design a water filter?', a: ['filtration', 'particle size', 'water quality', 'properties of materials'], type: 'multi' },
        { q: 'True or false: Engineers should ignore existing solutions and start from scratch.', a: 'false', type: 'tf' },
        { q: 'What can engineers learn from existing solutions?', a: 'what works, what does not, and how to improve', type: 'open' },
        { q: 'What is biomimicry?', a: 'designing solutions inspired by nature', type: 'open' },
        { q: 'Give an example of biomimicry.', a: ['Velcro inspired by burrs', 'bullet train inspired by kingfisher beak', 'gecko-inspired adhesives'], type: 'multi' },
        { q: 'What is a prototype?', a: 'a preliminary model of a design used for testing', type: 'open' },
        { q: 'Why is background research important before brainstorming?', a: 'it ensures ideas are informed by science and what already exists', type: 'open' },
      ],
    },
    'generate-solutions': {
      questions: [
        { q: 'What is brainstorming?', a: 'generating many ideas without judging them', type: 'open' },
        { q: 'Why should you not judge ideas during brainstorming?', a: 'to encourage creativity and generate as many ideas as possible', type: 'open' },
        { q: 'True or false: During brainstorming, quantity is more important than quality.', a: 'true', type: 'tf' },
        { q: 'What should you do after brainstorming?', a: 'evaluate ideas against criteria and constraints', type: 'open' },
        { q: 'Is it OK to build on someone else\'s idea during brainstorming?', a: 'yes', type: 'short' },
        { q: 'Name one brainstorming technique.', a: ['mind mapping', 'sketching', 'listing', 'SCAMPER', 'round-robin'], type: 'multi' },
        { q: 'Why is it good to have multiple solutions?', a: 'you can compare them and choose the best one', type: 'open' },
        { q: 'True or false: The first idea is usually the best.', a: 'false', type: 'tf' },
      ],
    },
    'evaluate-ideas': {
      questions: [
        { q: 'How do you evaluate design ideas?', a: 'compare them against criteria and constraints', type: 'open' },
        { q: 'What is a decision matrix?', a: 'a tool that scores design options against weighted criteria', type: 'open' },
        { q: 'What does it mean to weigh criteria?', a: 'assign importance to each criterion so more important ones count more', type: 'open' },
        { q: 'True or false: The cheapest design is always the best.', a: 'false', type: 'tf' },
        { q: 'What is a trade-off?', a: 'giving up one benefit to gain another', type: 'open' },
        { q: 'Give an example of a design trade-off.', a: ['stronger but heavier', 'cheaper but less durable', 'lighter but weaker'], type: 'multi' },
        { q: 'Why might engineers combine features from multiple designs?', a: 'to get the best features from each into one improved design', type: 'open' },
        { q: 'What is feasibility?', a: 'whether a design can actually be built within the given constraints', type: 'open' },
      ],
    },
    'sketching-designs': {
      questions: [
        { q: 'Why do engineers sketch before building?', a: 'to plan the design and identify potential problems before investing time and materials', type: 'open' },
        { q: 'What should a design sketch include?', a: ['labels', 'dimensions', 'materials', 'annotations'], type: 'multi' },
        { q: 'True or false: Engineering sketches need to be artistic.', a: 'false', type: 'tf' },
        { q: 'What is a blueprint?', a: 'a detailed technical drawing of a design', type: 'open' },
        { q: 'Why are labels important on a design sketch?', a: 'they communicate materials, dimensions, and function to others', type: 'open' },
        { q: 'What does a cross-section view show?', a: 'the interior of a design as if it were cut in half', type: 'open' },
        { q: 'Can a sketch reveal design flaws before building?', a: 'yes', type: 'short' },
        { q: 'What is an annotated sketch?', a: 'a sketch with written notes explaining design choices', type: 'open' },
      ],
    },
  },
  'grade-7': {
    'build-prototypes': {
      questions: [
        { q: 'What is a prototype?', a: 'a working model of a design used for testing', type: 'open' },
        { q: 'Why do engineers build prototypes?', a: 'to test whether the design works before building the final version', type: 'open' },
        { q: 'True or false: A prototype must be the same size as the final product.', a: 'false', type: 'tf' },
        { q: 'What is a rapid prototype?', a: 'a quick, rough model built to test one idea fast', type: 'open' },
        { q: 'What materials might you use for a quick prototype?', a: ['cardboard', 'tape', 'paper', 'clay', 'popsicle sticks'], type: 'multi' },
        { q: 'What should you do before building a prototype?', a: 'have a detailed plan or sketch', type: 'open' },
        { q: 'True or false: The prototype should be perfect on the first try.', a: 'false', type: 'tf' },
        { q: 'What is the difference between a model and a prototype?', a: 'a model represents the design; a prototype is a functional version that can be tested', type: 'open' },
      ],
    },
    'design-tests': {
      questions: [
        { q: 'Why do engineers test their designs?', a: 'to collect data on how well the design meets criteria', type: 'open' },
        { q: 'What makes a good engineering test?', a: 'it is fair, measurable, and directly tests whether criteria are met', type: 'open' },
        { q: 'Why should you test one variable at a time?', a: 'so you know what caused any changes in performance', type: 'open' },
        { q: 'Why are repeated trials important in testing?', a: 'to ensure results are reliable and not due to chance', type: 'open' },
        { q: 'How many trials should you run at minimum?', a: ['3', 'at least 3'], type: 'multi' },
        { q: 'True or false: If a design fails a test, the project is over.', a: 'false', type: 'tf' },
        { q: 'What should you record during testing?', a: ['data', 'observations', 'measurements', 'what happened'], type: 'multi' },
        { q: 'What is a fair test?', a: 'a test where all variables are controlled except the one being tested', type: 'open' },
      ],
    },
    'collect-data': {
      questions: [
        { q: 'What is quantitative data?', a: 'numerical data from measurements', type: 'open' },
        { q: 'What is qualitative data?', a: 'descriptive data from observations', type: 'open' },
        { q: 'Give an example of quantitative data from testing a bridge.', a: ['it held 3.2 kg', 'weight at failure was 4.5 kg'], type: 'multi' },
        { q: 'Give an example of qualitative data from testing a bridge.', a: ['it bent in the middle', 'the joints cracked first', 'the left side collapsed'], type: 'multi' },
        { q: 'Why is it important to record data during testing?', a: 'so you can analyze results and make informed improvements', type: 'open' },
        { q: 'What tool helps organize test data?', a: ['data table', 'spreadsheet', 'chart'], type: 'multi' },
        { q: 'True or false: You only need to test once if the result is clear.', a: 'false', type: 'tf' },
        { q: 'How do you calculate the mean of test results?', a: 'add all values and divide by the number of values', type: 'open' },
      ],
    },
    'analyze-test-data': {
      questions: [
        { q: 'What should you compare test results to?', a: 'the design criteria', type: 'short' },
        { q: 'If three trials give results of 4.1, 3.9, and 4.3 kg, what is the mean?', a: '4.1 kg', type: 'short' },
        { q: 'What does it mean if test results are inconsistent?', a: 'there may be a problem with the test procedure or the design is unreliable', type: 'open' },
        { q: 'True or false: Data analysis should lead to specific design improvements.', a: 'true', type: 'tf' },
        { q: 'What type of graph shows how designs compare?', a: 'bar graph', type: 'short' },
        { q: 'What should you look for when analyzing test data?', a: ['patterns', 'strengths', 'weaknesses', 'which criteria were met'], type: 'multi' },
        { q: 'How does data analysis help improve a design?', a: 'it reveals what works and what needs to change', type: 'open' },
        { q: 'What is an outlier in test data?', a: 'a data point that is very different from the others', type: 'open' },
      ],
    },
    'trade-off-analysis': {
      questions: [
        { q: 'What is a trade-off?', a: 'giving up one benefit to gain another', type: 'open' },
        { q: 'Why do all engineering designs involve trade-offs?', a: 'no design is perfect; improving one aspect often affects another', type: 'open' },
        { q: 'Give an example of a cost vs. performance trade-off.', a: ['stronger materials cost more', 'better insulation costs more money'], type: 'multi' },
        { q: 'Give an example of a weight vs. strength trade-off.', a: ['aluminum is lighter but steel is stronger', 'thinner walls are lighter but weaker'], type: 'multi' },
        { q: 'True or false: The best design has no trade-offs.', a: 'false', type: 'tf' },
        { q: 'How do engineers decide which trade-offs to make?', a: 'by prioritizing criteria based on importance to stakeholders', type: 'open' },
        { q: 'What is the environmental impact trade-off?', a: 'sustainable options may be less convenient or more expensive', type: 'open' },
        { q: 'Can trade-offs be different for different stakeholders?', a: 'yes', type: 'short' },
      ],
    },
    'decision-matrices': {
      questions: [
        { q: 'What is a decision matrix?', a: 'a table that scores design options against weighted criteria', type: 'open' },
        { q: 'What does weighting criteria mean in a decision matrix?', a: 'assigning higher importance to criteria that matter most', type: 'open' },
        { q: 'If strength has weight 5 and aesthetics has weight 1, which matters more?', a: 'strength', type: 'short' },
        { q: 'How do you calculate a weighted score?', a: 'multiply each score by its weight, then add them up', type: 'open' },
        { q: 'True or false: The design with the highest weighted total is always chosen.', a: 'false (other factors may apply)', type: 'open' },
        { q: 'What is the advantage of using a decision matrix over just guessing?', a: 'it provides a systematic, objective comparison', type: 'open' },
        { q: 'Who should help determine the weights in a decision matrix?', a: ['stakeholders', 'the team', 'the client'], type: 'multi' },
        { q: 'Can a decision matrix include both quantitative and qualitative criteria?', a: 'yes', type: 'short' },
      ],
    },
    'peer-review': {
      questions: [
        { q: 'What is peer review in engineering?', a: 'having others evaluate your design using criteria and evidence', type: 'open' },
        { q: 'Why is peer review valuable?', a: 'others may notice problems or improvements you missed', type: 'open' },
        { q: 'What should peer feedback focus on?', a: 'how well the design meets criteria and constraints', type: 'open' },
        { q: 'True or false: Peer review means criticizing the designer.', a: 'false', type: 'tf' },
        { q: 'What is constructive feedback?', a: 'specific, helpful suggestions for improvement', type: 'open' },
        { q: 'How should you respond to critical peer feedback?', a: 'consider it objectively and use it to improve your design', type: 'open' },
        { q: 'True or false: Professional engineers use peer review.', a: 'true', type: 'tf' },
        { q: 'What makes feedback constructive vs. unhelpful?', a: 'constructive feedback is specific and suggests improvements; unhelpful feedback is vague or personal', type: 'open' },
      ],
    },
  },
  'grade-8': {
    'iterative-improvement': {
      questions: [
        { q: 'What does iterative mean in engineering?', a: 'repeating cycles of testing and improving', type: 'open' },
        { q: 'Why is iteration important in engineering?', a: 'each cycle improves the design based on new data', type: 'open' },
        { q: 'How many iterations do professional engineers typically go through?', a: 'many, often dozens or more', type: 'open' },
        { q: 'True or false: The engineering design process is linear, not cyclical.', a: 'false', type: 'tf' },
        { q: 'What triggers a new iteration?', a: 'test data showing the design does not fully meet criteria', type: 'open' },
        { q: 'Should you change everything at once in a new iteration?', a: 'no, change one thing at a time so you know what caused improvement', type: 'open' },
        { q: 'What is optimization?', a: 'making the best possible design within the given constraints', type: 'open' },
        { q: 'True or false: A design is never truly finished.', a: 'true', type: 'tf' },
      ],
    },
    'failure-analysis': {
      questions: [
        { q: 'What is failure analysis?', a: 'examining why a design failed to learn from it', type: 'open' },
        { q: 'Is failure in engineering always bad?', a: 'no, failure provides critical data for improvement', type: 'open' },
        { q: 'What is the first question to ask when a design fails?', a: 'what specifically failed?', type: 'open' },
        { q: 'Name a famous engineering failure.', a: ['Tacoma Narrows Bridge', 'Titanic', 'Challenger', 'Hindenburg'], type: 'multi' },
        { q: 'What can engineers learn from failures?', a: 'what does not work and how to improve the design', type: 'open' },
        { q: 'True or false: A failure means the engineer made a mistake.', a: 'false', type: 'tf' },
        { q: 'What is root cause analysis?', a: 'finding the underlying reason for a failure, not just the symptom', type: 'open' },
        { q: 'How do you use failure analysis data?', a: 'to plan specific modifications for the next iteration', type: 'open' },
      ],
    },
    'data-driven-redesign': {
      questions: [
        { q: 'What does data-driven redesign mean?', a: 'making design changes based on evidence from testing, not guessing', type: 'open' },
        { q: 'Why is it better to use data than intuition when redesigning?', a: 'data provides objective evidence of what works and what does not', type: 'open' },
        { q: 'What kind of data helps redesign a bridge?', a: ['load test results', 'point of failure', 'deflection measurements'], type: 'multi' },
        { q: 'True or false: Redesigning should be random trial and error.', a: 'false', type: 'tf' },
        { q: 'How do you know if a redesign is an improvement?', a: 'compare new test data to previous test data', type: 'open' },
        { q: 'What should you do if your redesign makes things worse?', a: 'go back to the previous version and try a different change', type: 'open' },
        { q: 'How do control tests help in redesign?', a: 'they provide a baseline for comparison', type: 'open' },
        { q: 'What is the role of documentation in redesign?', a: 'it tracks what was changed and why, so you can learn from each iteration', type: 'open' },
      ],
    },
    'technical-documentation': {
      questions: [
        { q: 'Why is documentation important in engineering?', a: 'it records the design process, decisions, and results for others to understand and reproduce', type: 'open' },
        { q: 'What should engineering documentation include?', a: ['problem definition', 'design sketches', 'test data', 'analysis', 'conclusions'], type: 'multi' },
        { q: 'Who is the audience for technical documentation?', a: ['other engineers', 'clients', 'stakeholders', 'future designers'], type: 'multi' },
        { q: 'True or false: Documentation is only needed at the end of the project.', a: 'false', type: 'tf' },
        { q: 'What is an engineering notebook?', a: 'a record of all design work including ideas, sketches, data, and reflections', type: 'open' },
        { q: 'Why should you document failed designs?', a: 'to prevent repeating mistakes and to record what was learned', type: 'open' },
        { q: 'What makes good technical writing?', a: 'clear, specific, organized, with data and evidence', type: 'open' },
        { q: 'True or false: Diagrams and graphs are important in technical documentation.', a: 'true', type: 'tf' },
      ],
    },
    'client-presentations': {
      questions: [
        { q: 'Why do engineers present their designs to clients?', a: 'to explain design decisions, share results, and get approval', type: 'open' },
        { q: 'What should an engineering presentation include?', a: ['the problem', 'the design', 'test results', 'trade-off decisions', 'next steps'], type: 'multi' },
        { q: 'Why is it important to explain trade-offs to clients?', a: 'so they understand the reasoning behind design choices', type: 'open' },
        { q: 'True or false: Engineers only present successful designs.', a: 'false', type: 'tf' },
        { q: 'How should engineers use data in presentations?', a: 'with clear graphs, tables, and specific numbers that support their conclusions', type: 'open' },
        { q: 'What is an elevator pitch?', a: 'a brief summary of the design that can be given in about 30-60 seconds', type: 'open' },
        { q: 'Why should engineers prepare for questions?', a: 'clients and stakeholders will want to understand details and alternatives', type: 'open' },
        { q: 'What visual aids help in engineering presentations?', a: ['graphs', 'diagrams', 'prototypes', 'photos', 'slides'], type: 'multi' },
      ],
    },
    'computational-thinking': {
      questions: [
        { q: 'What is decomposition?', a: 'breaking a big problem into smaller sub-problems', type: 'open' },
        { q: 'What is pattern recognition?', a: 'identifying recurring features in successful designs', type: 'open' },
        { q: 'What is abstraction?', a: 'focusing on the most important variables and ignoring irrelevant details', type: 'open' },
        { q: 'What is an algorithm in engineering?', a: 'a step-by-step procedure for testing or building', type: 'open' },
        { q: 'Give an example of decomposition in bridge design.', a: 'divide into foundation, span, supports, and connections', type: 'open' },
        { q: 'Give an example of pattern recognition in engineering.', a: ['triangular supports appear in many strong structures', 'streamlined shapes reduce air resistance'], type: 'multi' },
        { q: 'True or false: Computational thinking is only for computer science.', a: 'false', type: 'tf' },
        { q: 'How does computational thinking help engineers?', a: 'it provides systematic approaches to solving complex problems', type: 'open' },
      ],
    },
    'science-connections': {
      questions: [
        { q: 'How does understanding thermal energy help design insulated containers?', a: 'knowing how heat transfers helps choose materials and design features that reduce heat loss', type: 'open' },
        { q: 'How does understanding forces help design bridges?', a: 'knowing about load distribution and stress helps design strong structures', type: 'open' },
        { q: 'What science concept is used in water filter design?', a: ['filtration', 'particle size', 'water quality'], type: 'multi' },
        { q: 'True or false: Engineering can be done without any science knowledge.', a: 'false', type: 'tf' },
        { q: 'How does understanding ecosystems help environmental engineers?', a: 'it helps them design solutions that work with natural systems', type: 'open' },
        { q: 'What is the connection between wave science and noise-canceling headphones?', a: 'they use wave interference to cancel out sound waves', type: 'open' },
        { q: 'How does understanding materials science help engineers?', a: 'it helps them select the right materials for the job', type: 'open' },
        { q: 'Name a science concept that applies to solar oven design.', a: ['radiation', 'thermal energy', 'reflection', 'absorption'], type: 'multi' },
      ],
    },
    'math-in-engineering': {
      questions: [
        { q: 'Why do engineers use math?', a: 'to calculate, measure, analyze data, and make precise designs', type: 'open' },
        { q: 'What math is used when calculating averages from test trials?', a: ['mean', 'arithmetic mean', 'average'], type: 'multi' },
        { q: 'How is ratio used in engineering?', a: ['scale models', 'mixing proportions', 'gear ratios'], type: 'multi' },
        { q: 'True or false: You need to be a math genius to do engineering.', a: 'false', type: 'tf' },
        { q: 'What kind of math is used to calculate the strength needed for a bridge?', a: ['multiplication', 'force calculations', 'area calculations'], type: 'multi' },
        { q: 'How do engineers use measurement?', a: 'to ensure precision and consistency in building and testing', type: 'open' },
        { q: 'What is the role of geometry in engineering?', a: 'calculating angles, areas, and volumes for designs', type: 'open' },
        { q: 'How does graphing help engineers?', a: 'it visualizes data and makes patterns and trends easier to identify', type: 'open' },
      ],
    },
    'career-connections': {
      questions: [
        { q: 'What does a civil engineer do?', a: 'designs roads, bridges, and buildings', type: 'open' },
        { q: 'What does a biomedical engineer do?', a: 'designs medical devices and prosthetics', type: 'open' },
        { q: 'What does an environmental engineer do?', a: 'solves pollution and sustainability problems', type: 'open' },
        { q: 'True or false: Engineers work alone.', a: 'false', type: 'tf' },
        { q: 'Name a type of engineer not already mentioned.', a: ['mechanical', 'aerospace', 'software', 'chemical', 'electrical', 'materials'], type: 'multi' },
        { q: 'True or false: Only certain types of people can be engineers.', a: 'false', type: 'tf' },
        { q: 'What skills are important for engineers besides math?', a: ['creativity', 'collaboration', 'problem-solving', 'communication'], type: 'multi' },
        { q: 'What does an aerospace engineer do?', a: 'designs aircraft and spacecraft', type: 'open' },
      ],
    },
  },
};

const CHALLENGES = {
  'grade-6': [
    { title: 'Paper Tower Challenge', science: 'Forces, structure', criteria: 'Build the tallest free-standing tower', constraints: 'Only 10 sheets of paper and tape; 15 minutes' },
    { title: 'Egg Drop', science: 'Forces, energy', criteria: 'Protect a raw egg from a 2-meter drop', constraints: 'Limited materials: straws, tape, cotton balls, paper' },
  ],
  'grade-7': [
    { title: 'Water Filter', science: 'Earth systems, water quality', criteria: 'Remove visible particles; improve water clarity', constraints: 'Fits in a 2-liter bottle; use available materials' },
    { title: 'Insulated Container', science: 'Thermal energy transfer', criteria: 'Keep water hot for 30 minutes', constraints: 'Only recycled materials; budget $5' },
  ],
  'grade-8': [
    { title: 'Earthquake-Resistant Structure', science: 'Plate tectonics, forces', criteria: 'Survive simulated shaking for 15 seconds', constraints: 'Maximum 30 cm tall; limited materials' },
    { title: 'Solar Oven', science: 'Energy transfer, radiation', criteria: 'Reach 65C interior temperature', constraints: 'Cardboard, aluminum foil, plastic wrap only' },
  ],
};

// File I/O + Helpers (same pattern as other skills)

function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }
function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }
function loadProfile(id) {
  const fp = profilePath(id);
  if (fs.existsSync(fp)) { try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); } }
  return { studentId: id, grade: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
}
function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }
function calcMastery(attempts) { if (!attempts || !attempts.length) return 0; const recent = attempts.slice(-5).filter(a => a.total > 0); return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0; }
function masteryLabel(r) { return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started'; }
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }
function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

function generateExercise(grade, skill, count = 5) {
  const bank = QUESTION_BANKS[grade]?.[skill];
  if (!bank || !bank.questions) return { error: `No question bank for ${grade}/${skill}` };
  const items = pick(bank.questions, count).map(q => ({ prompt: q.q, answer: Array.isArray(q.a) ? q.a[0] : q.a, acceptedAnswers: Array.isArray(q.a) ? q.a : [q.a], type: q.type }));
  return { type: 'engineering', skill, grade, count: items.length, instruction: 'Answer each question about engineering design.', items };
}

function checkAnswer(type, expected, answer) { if (Array.isArray(expected)) return expected.some(r => norm(r) === norm(answer)); return norm(expected) === norm(answer); }

class MSEngineering {
  getProfile(id) { const p = loadProfile(id); return { studentId: p.studentId, grade: p.grade, createdAt: p.createdAt, totalAssessments: p.assessments.length }; }
  setGrade(id, grade) { if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}. Valid: ${Object.keys(SKILLS).join(', ')}`); const p = loadProfile(id); p.grade = grade; saveProfile(p); return { studentId: id, grade }; }

  recordAssessment(id, grade, category, skill, score, total, notes = '') {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}`);
    if (!SKILLS[grade][category]) throw new Error(`Unknown category '${category}' for ${grade}`);
    if (!SKILLS[grade][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${grade}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id); if (!p.grade) p.grade = grade;
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
    const p = loadProfile(id); const grade = p.grade || 'grade-6'; const gs = SKILLS[grade] || {};
    const results = {}; let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(gs)) { results[cat] = {}; for (const sk of skills) { total++; const d = p.skills[`${grade}/${cat}/${sk}`]; results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' }; if (d && d.mastery >= MASTERY_THRESHOLD) mastered++; } }
    return { studentId: id, grade, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id); const grade = p.grade || 'grade-6'; const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS[grade] || {})) { for (const sk of skills) { const d = p.skills[`${grade}/${cat}/${sk}`]; const m = d ? d.mastery : 0; if (m < MASTERY_THRESHOLD) candidates.push({ grade, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' }); } }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, grade, next: candidates.slice(0, count) };
  }

  getReport(id) { const p = loadProfile(id); return { studentId: id, grade: p.grade, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }
  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }
  getSkillCatalog(grade) { const gs = SKILLS[grade]; if (!gs) return { grade, error: `Unknown grade. Valid: ${Object.keys(SKILLS).join(', ')}` }; let total = 0; const catalog = {}; for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; } return { grade, skills: catalog, totalSkills: total }; }
  generateExercise(grade, skill, count = 5) { return generateExercise(grade, skill, count); }
  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  getChallenge(grade) {
    const ch = CHALLENGES[grade];
    if (!ch) return { error: `No challenges for ${grade}. Available: ${Object.keys(CHALLENGES).join(', ')}` };
    return pick(ch, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id); const grade = p.grade || 'grade-6';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const challenge = CHALLENGES[grade] ? pick(CHALLENGES[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, designChallenge: challenge,
      lessonPlan: {
        engage: challenge ? `Challenge: ${challenge.title} — ${challenge.criteria}` : 'Present a real-world engineering problem',
        explore: `Investigate: ${target.category} > ${target.skill}`,
        explain: `Build understanding with ${exercise.count || 0} practice items`,
        elaborate: 'Apply to a design challenge with criteria and constraints',
        evaluate: 'Reflect on design process and document learning',
      },
    };
  }
}

module.exports = MSEngineering;

if (require.main === module) {
  const args = process.argv.slice(2); const cmd = args[0]; const api = new MSEngineering();
  const out = d => console.log(JSON.stringify(d, null, 2));
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
      case 'challenge': { const [, g] = args; if (!g) throw new Error('Usage: challenge <grade>'); out(api.getChallenge(g)); break; }
      default: out({ usage: 'node engineering.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','challenge'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
