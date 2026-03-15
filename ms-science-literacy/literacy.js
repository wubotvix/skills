// eClaw MS Science Literacy Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-science-literacy');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'text-features': ['headings-subheadings', 'captions-labels', 'diagrams-illustrations', 'glossary-index'],
    'vocabulary': ['word-parts-prefixes', 'word-parts-suffixes', 'context-clues', 'science-tier-3-words'],
    'reading-data': ['reading-data-tables', 'reading-simple-graphs', 'comparing-data-sets'],
  },
  'grade-7': {
    'graph-interpretation': ['line-graph-trends', 'bar-graph-comparison', 'pie-charts', 'identifying-graph-errors'],
    'lab-report-writing': ['purpose-hypothesis', 'methods-materials', 'results-data', 'conclusion-cer'],
    'source-evaluation': ['primary-vs-secondary', 'credible-sources', 'identifying-bias'],
  },
  'grade-8': {
    'evaluating-claims': ['claim-evidence-reasoning', 'distinguishing-fact-opinion', 'evaluating-argument-strength', 'pseudoscience-detection'],
    'research-communication': ['summarizing-research', 'citing-sources', 'multimedia-presentation', 'peer-feedback'],
  },
};

const QUESTION_BANKS = {
  'grade-6': {
    'headings-subheadings': {
      questions: [
        { q: 'What is the purpose of headings in a science text?', a: 'to organize content and help readers find information quickly', type: 'open' },
        { q: 'If a chapter heading is "Properties of Matter" and a subheading is "Physical Properties," what comes next?', a: 'specific information about physical properties like color, density, melting point', type: 'open' },
        { q: 'How can you use headings to preview a chapter before reading?', a: 'skim headings and subheadings to get an overview of the main topics', type: 'open' },
        { q: 'True or false: Subheadings are always more specific than headings.', a: 'true', type: 'tf' },
        { q: 'A section titled "The Water Cycle" likely contains what subtopics?', a: 'evaporation, condensation, precipitation, collection', type: 'open' },
        { q: 'How do headings help you study?', a: 'they break content into manageable chunks and highlight main ideas', type: 'open' },
      ],
    },
    'captions-labels': {
      questions: [
        { q: 'What is the purpose of a caption under a photograph in a science text?', a: 'to explain what the image shows and how it relates to the text', type: 'open' },
        { q: 'What are labels on a diagram used for?', a: 'to identify and name specific parts or structures in the diagram', type: 'open' },
        { q: 'A diagram of a cell has arrows pointing to different parts. What are these arrows called?', a: 'labels or callouts', type: 'short' },
        { q: 'Should you skip captions when reading a science textbook?', a: 'no', type: 'short', hint: 'Captions often contain important information not in the main text' },
        { q: 'What information does an axis label on a graph provide?', a: 'the variable name and unit of measurement', type: 'open' },
        { q: 'Why is it important that every figure in a lab report has a caption?', a: 'so readers understand what the figure shows without guessing', type: 'open' },
      ],
    },
    'diagrams-illustrations': {
      questions: [
        { q: 'How is reading a diagram different from reading a paragraph?', a: 'diagrams communicate spatial relationships and processes visually rather than with words', type: 'open' },
        { q: 'A flow chart showing the steps of photosynthesis uses arrows. What do the arrows represent?', a: 'the sequence or direction of the process', type: 'open' },
        { q: 'Why do science texts include both words and diagrams?', a: 'some concepts are easier to understand visually than through text alone', type: 'open' },
        { q: 'What should you look at first when reading a diagram?', a: 'the title and any labels or legends', type: 'open' },
        { q: 'A cross-section diagram of Earth shows layers. What does "cross-section" mean?', a: 'a view showing the inside as if it were cut open', type: 'open' },
        { q: 'Can a diagram be misleading? How?', a: 'yes, through incorrect scale, missing labels, or oversimplification', type: 'open' },
      ],
    },
    'glossary-index': {
      questions: [
        { q: 'What is the difference between a glossary and an index?', a: 'a glossary defines terms; an index lists topics with page numbers', type: 'open' },
        { q: 'Where would you find the definition of "photosynthesis" in a textbook?', a: 'in the glossary', type: 'short' },
        { q: 'Where would you find every page that mentions "volcanoes"?', a: 'in the index', type: 'short' },
        { q: 'Why are glossary terms usually in bold in the text?', a: 'to signal that the word is an important vocabulary term defined in the glossary', type: 'open' },
        { q: 'How is a glossary different from a dictionary?', a: 'a glossary only includes terms used in that specific text', type: 'open' },
        { q: 'If a glossary defines "homeostasis" differently than your teacher, which should you follow?', a: 'ask your teacher, as the textbook definition may differ from the classroom usage', type: 'open' },
      ],
    },
    'word-parts-prefixes': {
      questions: [
        { q: 'What does the prefix "bio-" mean?', a: 'life', type: 'short' },
        { q: 'What does the prefix "geo-" mean?', a: 'earth', type: 'short' },
        { q: 'What does the prefix "thermo-" mean?', a: 'heat', type: 'short' },
        { q: 'What does the prefix "photo-" mean?', a: 'light', type: 'short' },
        { q: 'Using the prefix "hydro-" (water), what does "hydroelectric" mean?', a: 'electricity generated by water power', type: 'open' },
        { q: 'What does the prefix "micro-" mean?', a: 'small', type: 'short' },
        { q: 'What does the prefix "eco-" mean?', a: 'environment or habitat', type: 'short' },
        { q: 'Using "endo-" (within) and "therm" (heat), what is an endotherm?', a: 'an organism that generates heat from within (warm-blooded)', type: 'open' },
      ],
    },
    'word-parts-suffixes': {
      questions: [
        { q: 'What does the suffix "-ology" mean?', a: 'study of', type: 'short' },
        { q: 'What does the suffix "-synthesis" mean?', a: 'putting together', type: 'short' },
        { q: 'Using "-ology" (study of) and "bio-" (life), what is biology?', a: 'the study of life', type: 'open' },
        { q: 'What does the suffix "-phyte" mean?', a: 'plant', type: 'short' },
        { q: 'What does the suffix "-vore" mean?', a: 'eater', type: 'short' },
        { q: 'Using "-vore" and "herbi-" (plant), what is an herbivore?', a: 'an animal that eats plants', type: 'open' },
        { q: 'What does "-scope" mean?', a: 'instrument for viewing', type: 'short' },
        { q: 'What does "-meter" mean?', a: 'instrument for measuring', type: 'short' },
      ],
    },
    'context-clues': {
      questions: [
        { q: '"The metamorphic rock, which had been changed by heat and pressure, was very hard." What does metamorphic mean?', a: 'changed by heat and pressure', type: 'open' },
        { q: 'What are context clues?', a: 'words or phrases near an unknown word that help you figure out its meaning', type: 'open' },
        { q: '"Unlike herbivores, which eat only plants, omnivores eat both plants and animals." What does omnivore mean?', a: 'an animal that eats both plants and animals', type: 'open' },
        { q: 'Name three types of context clues.', a: 'definition, example, and contrast', type: 'open' },
        { q: '"The arid desert receives less than 10 inches of rain per year." What does arid mean?', a: 'very dry', type: 'short' },
        { q: '"Photosynthesis, the process by which plants make food from sunlight, occurs in the leaves." What clue type is used here?', a: 'definition (set off by commas)', type: 'short' },
      ],
    },
    'science-tier-3-words': {
      questions: [
        { q: 'What is a Tier 3 vocabulary word?', a: 'a domain-specific technical term used mainly in one subject area', type: 'open' },
        { q: 'Is "photosynthesis" a Tier 2 or Tier 3 word?', a: 'Tier 3', type: 'short', hint: 'It is specific to science' },
        { q: 'Is "analyze" a Tier 2 or Tier 3 word?', a: 'Tier 2', type: 'short', hint: 'It is used across many subjects' },
        { q: 'Why is it important to learn Tier 3 words in science?', a: 'they are essential for understanding and communicating science concepts', type: 'open' },
        { q: 'What is a good strategy for learning science vocabulary?', a: 'break words into parts (prefix, root, suffix) and connect to known words', type: 'open' },
        { q: 'Give an example of a Tier 3 word from earth science.', a: ['tectonic', 'seismograph', 'lithosphere', 'magma', 'subduction'], type: 'multi' },
      ],
    },
    'reading-data-tables': {
      questions: [
        { q: 'What should you read first when looking at a data table?', a: 'the title and column headers', type: 'open' },
        { q: 'In a data table, what do rows typically represent?', a: 'individual observations, trials, or categories', type: 'open' },
        { q: 'Why are units important in data tables?', a: 'without units, the numbers have no meaning', type: 'open' },
        { q: 'A table shows plant height over 5 weeks. What is the independent variable?', a: 'time (weeks)', type: 'short' },
        { q: 'How can you spot trends in a data table?', a: 'look for numbers that consistently increase, decrease, or stay the same', type: 'open' },
        { q: 'What should you do if a data table entry says "N/A"?', a: 'recognize that data was not available or not applicable for that observation', type: 'open' },
      ],
    },
    'reading-simple-graphs': {
      questions: [
        { q: 'What three things should you check on every graph?', a: 'title, axis labels, and scale', type: 'open' },
        { q: 'A bar graph shows rainfall by month. Which month had the most rain?', a: 'the month with the tallest bar', type: 'open' },
        { q: 'What does it mean when a line graph goes upward?', a: 'the dependent variable is increasing', type: 'open' },
        { q: 'A graph has no title. Why is this a problem?', a: 'you do not know what the graph is about or what it shows', type: 'open' },
        { q: 'How do you find a specific value on a line graph?', a: 'find the point on the x-axis, go up to the line, then read across to the y-axis', type: 'open' },
        { q: 'What does a legend (key) on a graph tell you?', a: 'what each color, symbol, or line represents', type: 'open' },
      ],
    },
    'comparing-data-sets': {
      questions: [
        { q: 'Two groups of plants: one with fertilizer grew an average of 15 cm, one without grew 10 cm. What can you say?', a: 'the fertilized plants grew more on average, suggesting fertilizer may help growth', type: 'open' },
        { q: 'Why should you calculate averages when comparing groups?', a: 'averages summarize the data and make comparison easier', type: 'open' },
        { q: 'Two data sets have the same mean but different ranges. What does this tell you?', a: 'one data set has more spread or variability than the other', type: 'open' },
        { q: 'Can you conclude cause and effect from a data comparison alone?', a: 'not always — you need a controlled experiment', type: 'open' },
        { q: 'What visual tool is best for comparing two data sets side by side?', a: 'a double bar graph or side-by-side box plots', type: 'open' },
        { q: 'When comparing data from two experiments, what must be the same?', a: 'the methods, measurements, and controlled variables', type: 'open' },
      ],
    },
  },
  'grade-7': {
    'line-graph-trends': {
      questions: [
        { q: 'A line graph of temperature over 24 hours shows a peak at 2 PM. What does this represent?', a: 'the highest temperature of the day', type: 'open' },
        { q: 'A line graph shows population growth that curves upward steeply. What type of growth is this?', a: 'exponential growth', type: 'short' },
        { q: 'How do you describe a trend that levels off?', a: 'the rate of change is decreasing; the value is approaching a plateau', type: 'open' },
        { q: 'Can a line graph show two variables at once?', a: 'yes, by using two different lines or a dual y-axis', type: 'open' },
        { q: 'A line graph shows a zigzag pattern. What does this indicate?', a: 'the values fluctuate up and down with no clear trend', type: 'open' },
        { q: 'What is interpolation?', a: 'estimating a value between two known data points on a graph', type: 'open' },
      ],
    },
    'bar-graph-comparison': {
      questions: [
        { q: 'A grouped bar graph compares test scores of boys and girls across 3 subjects. How do you read it?', a: 'compare the heights of paired bars within each subject group', type: 'open' },
        { q: 'When is a stacked bar graph useful?', a: 'when you want to show parts of a whole within each category', type: 'open' },
        { q: 'A bar graph shows the number of species in 5 ecosystems. What are the categories?', a: 'the ecosystems', type: 'short' },
        { q: 'If two bars are nearly the same height, what can you conclude?', a: 'the values are similar and differences may not be significant', type: 'open' },
        { q: 'Why should bar graph axes start at zero?', a: 'to avoid exaggerating differences between bars', type: 'open' },
        { q: 'A bar graph comparing two studies uses different scales. Why is this misleading?', a: 'it makes the results look comparable when they may not be', type: 'open' },
      ],
    },
    'pie-charts': {
      questions: [
        { q: 'What does a pie chart show?', a: 'parts of a whole — how categories make up 100% of something', type: 'open' },
        { q: 'A pie chart shows Earth is 71% water. What fraction is approximately land?', a: '29%', type: 'short' },
        { q: 'When should you NOT use a pie chart?', a: 'when showing change over time or when there are too many categories', type: 'open' },
        { q: 'All slices of a pie chart must add up to what?', a: '100%', type: 'short' },
        { q: 'A pie chart shows the composition of air. The largest slice is 78%. What gas is this?', a: 'nitrogen', type: 'short' },
        { q: 'Why are pie charts with many small slices hard to read?', a: 'small differences are difficult to distinguish visually', type: 'open' },
      ],
    },
    'identifying-graph-errors': {
      questions: [
        { q: 'A graph has no axis labels. What is missing?', a: 'the variable names and units of measurement', type: 'open' },
        { q: 'A y-axis starts at 50 instead of 0 for a bar graph. How does this distort the data?', a: 'it exaggerates the differences between bars', type: 'open' },
        { q: 'A line graph connects data points that should be separate categories. What is the error?', a: 'it should be a bar graph, not a line graph, for categorical data', type: 'open' },
        { q: 'A graph has no title. Why is this a problem?', a: 'readers cannot determine what the graph represents', type: 'open' },
        { q: 'The intervals on a y-axis go 0, 10, 20, 50, 100. What is wrong?', a: 'the scale is inconsistent, which distorts the visual representation', type: 'open' },
        { q: 'A 3D bar graph makes some bars look bigger due to perspective. What should be used instead?', a: 'a 2D bar graph for accurate visual comparison', type: 'open' },
      ],
    },
    'purpose-hypothesis': {
      questions: [
        { q: 'What should the "Purpose" section of a lab report state?', a: 'the question the experiment is trying to answer', type: 'open' },
        { q: 'Where does the hypothesis go in a lab report?', a: 'in the introduction, after the background and before the procedure', type: 'open' },
        { q: 'Should you write your hypothesis before or after doing the experiment?', a: 'before', type: 'short' },
        { q: 'A good hypothesis includes what three parts?', a: 'if (condition), then (prediction), because (reasoning)', type: 'open' },
        { q: 'What background information should come before the hypothesis?', a: 'relevant scientific concepts that explain why you expect certain results', type: 'open' },
        { q: 'Should the purpose be written as a question or a statement?', a: 'either can work, but it should be clear and specific', type: 'open' },
      ],
    },
    'methods-materials': {
      questions: [
        { q: 'Why should lab procedures be written as numbered steps?', a: 'so others can follow them exactly and replicate the experiment', type: 'open' },
        { q: 'What should a materials list include?', a: 'every item used, with specific quantities and sizes', type: 'open' },
        { q: 'Should the methods section include results?', a: 'no', type: 'short', hint: 'Methods describe what you did, not what happened' },
        { q: 'Why should you write procedures in past tense?', a: 'because the experiment has already been done', type: 'open' },
        { q: 'What voice should lab reports use?', a: 'third person, passive voice (e.g., "the solution was heated")', type: 'open' },
        { q: 'Should safety precautions be mentioned in the methods?', a: 'yes', type: 'short' },
      ],
    },
    'results-data': {
      questions: [
        { q: 'What goes in the results section?', a: 'data tables, graphs, and descriptions of what happened — no interpretation', type: 'open' },
        { q: 'Should you include all data, even unexpected results?', a: 'yes', type: 'short' },
        { q: 'What is the difference between results and discussion?', a: 'results report what happened; discussion explains what it means', type: 'open' },
        { q: 'Every data table and graph should have what?', a: 'a title, labels, and units', type: 'open' },
        { q: 'Should you describe trends you see in the data in the results section?', a: 'briefly, but save interpretation for the discussion', type: 'open' },
        { q: 'If an experiment has three trials, how should results be presented?', a: 'show individual trials and the average', type: 'open' },
      ],
    },
    'conclusion-cer': {
      questions: [
        { q: 'What does CER stand for?', a: 'Claim, Evidence, Reasoning', type: 'open' },
        { q: 'What is the "Claim" in a CER conclusion?', a: 'a statement that answers the original question or addresses the hypothesis', type: 'open' },
        { q: 'What is the "Evidence" in CER?', a: 'specific data from the experiment that supports the claim', type: 'open' },
        { q: 'What is the "Reasoning" in CER?', a: 'a scientific explanation connecting the evidence to the claim', type: 'open' },
        { q: 'Should a conclusion say "my hypothesis was right"?', a: 'no — it should state whether the data supported or did not support the hypothesis', type: 'open' },
        { q: 'What should you include at the end of a conclusion?', a: 'sources of error and suggestions for future experiments', type: 'open' },
      ],
    },
    'primary-vs-secondary': {
      questions: [
        { q: 'What is a primary source in science?', a: 'an original research study published in a scientific journal', type: 'open' },
        { q: 'What is a secondary source?', a: 'a source that summarizes or interprets primary research', type: 'open' },
        { q: 'Is a science textbook a primary or secondary source?', a: 'secondary', type: 'short' },
        { q: 'Is a lab report you wrote from your own experiment primary or secondary?', a: 'primary', type: 'short' },
        { q: 'Is a newspaper article about a new study primary or secondary?', a: 'secondary', type: 'short' },
        { q: 'Why do scientists prefer primary sources?', a: 'they can evaluate the methods and data directly', type: 'open' },
      ],
    },
    'credible-sources': {
      questions: [
        { q: 'What makes a science source credible?', a: 'peer review, author expertise, reputable publisher, recent date, cited evidence', type: 'open' },
        { q: 'Is a .edu website generally more credible than a .com for science?', a: 'generally yes, but always evaluate the specific content', type: 'open' },
        { q: 'A website sells a "miracle cure" and cites no studies. Is this credible?', a: 'no', type: 'short' },
        { q: 'What does "peer-reviewed" mean?', a: 'the research was evaluated by other experts before publication', type: 'open' },
        { q: 'Should you use Wikipedia as your only source for a science report?', a: 'no', type: 'short', hint: 'Use it as a starting point, then find primary sources' },
        { q: 'Name a credible scientific organization.', a: ['NASA', 'NIH', 'CDC', 'NOAA', 'WHO', 'NSF'], type: 'multi' },
      ],
    },
    'identifying-bias': {
      questions: [
        { q: 'A toothpaste company funds a study showing their product is best. What bias is this?', a: 'funding bias or conflict of interest', type: 'open' },
        { q: 'What is confirmation bias in science?', a: 'favoring data that supports what you already believe', type: 'open' },
        { q: 'How can you detect bias in a science article?', a: 'check who funded it, look for balanced coverage, and see if claims match the evidence', type: 'open' },
        { q: 'A study only interviews people who volunteer. What bias is this?', a: 'self-selection bias', type: 'short' },
        { q: 'How does peer review help reduce bias?', a: 'independent reviewers can spot biased methods or interpretations', type: 'open' },
        { q: 'Is all bias intentional?', a: 'no, bias can be unconscious', type: 'short' },
      ],
    },
  },
  'grade-8': {
    'claim-evidence-reasoning': {
      questions: [
        { q: 'Write a claim about what happens to ice when heated.', a: 'Ice melts into liquid water when heated above 0 degrees Celsius.', type: 'open' },
        { q: 'What makes evidence strong?', a: 'it is specific, measurable, relevant, and from a reliable source', type: 'open' },
        { q: 'What connects the evidence to the claim?', a: 'reasoning — scientific principles that explain WHY the evidence supports the claim', type: 'open' },
        { q: 'A student writes: "Plants need light." Is this a complete CER?', a: 'no — it has a claim but no specific evidence or reasoning', type: 'open' },
        { q: 'How many pieces of evidence should a strong CER have?', a: 'at least two, from different sources or experiments', type: 'open' },
        { q: 'Can the same evidence support different claims?', a: 'sometimes, which is why reasoning is critical for connecting them', type: 'open' },
      ],
    },
    'distinguishing-fact-opinion': {
      questions: [
        { q: '"Water boils at 100°C at sea level." Fact or opinion?', a: 'fact', type: 'short' },
        { q: '"Climate change is the most important issue of our time." Fact or opinion?', a: 'opinion', type: 'short', hint: '"Most important" is a value judgment' },
        { q: 'How can you tell if a statement is a scientific fact?', a: 'it can be verified through observation, measurement, or experiment', type: 'open' },
        { q: '"Evolution is just a theory." Is this an accurate use of the word "theory"?', a: 'no — in science, a theory is well-supported by evidence, not just a guess', type: 'open' },
        { q: '"Organic food is healthier." Is this a fact or a claim that needs evidence?', a: 'a claim that needs evidence', type: 'short' },
        { q: 'Can opinions be based on facts?', a: 'yes — informed opinions are supported by evidence but still involve judgment', type: 'open' },
      ],
    },
    'evaluating-argument-strength': {
      questions: [
        { q: 'What makes a scientific argument strong?', a: 'a clear claim, sufficient relevant evidence, sound reasoning, and no logical fallacies', type: 'open' },
        { q: 'An argument cites one study from 1990. Is this sufficient?', a: 'probably not — more recent and multiple sources would strengthen it', type: 'open' },
        { q: 'What is a logical fallacy?', a: 'an error in reasoning that undermines the logic of an argument', type: 'open' },
        { q: 'A claim is supported by a celebrity endorsement. Is this strong evidence?', a: 'no — celebrity status does not equal scientific expertise', type: 'open' },
        { q: '"Everyone knows that..." is what type of argument flaw?', a: 'appeal to popularity (bandwagon fallacy)', type: 'open' },
        { q: 'How do you evaluate if evidence is relevant?', a: 'check if it directly relates to and supports the specific claim being made', type: 'open' },
      ],
    },
    'pseudoscience-detection': {
      questions: [
        { q: 'What is pseudoscience?', a: 'claims or practices that appear scientific but lack evidence and do not follow the scientific method', type: 'open' },
        { q: 'Name three red flags of pseudoscience.', a: 'no peer review, unfalsifiable claims, and reliance on anecdotes instead of data', type: 'open' },
        { q: 'A product claims to cure all diseases with no side effects. Red flag?', a: 'yes — no single treatment cures everything', type: 'short' },
        { q: '"Ancient wisdom" is used as evidence for a health claim. Is this scientific?', a: 'no — age of a belief does not make it scientifically valid', type: 'open' },
        { q: 'How is science different from pseudoscience?', a: 'science uses testable hypotheses, controlled experiments, peer review, and changes with evidence', type: 'open' },
        { q: 'A website claims NASA is hiding evidence. What reasoning error is this?', a: 'conspiracy thinking — dismissing evidence by claiming a cover-up', type: 'open' },
      ],
    },
    'summarizing-research': {
      questions: [
        { q: 'What should a research summary include?', a: 'the question, methods, key findings, and conclusions of the study', type: 'open' },
        { q: 'Should a summary include your personal opinion?', a: 'no — save that for the analysis or discussion', type: 'short' },
        { q: 'How long should a research summary be?', a: 'brief — one paragraph that captures the essential findings', type: 'open' },
        { q: 'What is an abstract?', a: 'a brief summary at the beginning of a research paper', type: 'open' },
        { q: 'When summarizing, should you copy exact sentences?', a: 'no — use your own words to avoid plagiarism', type: 'short' },
        { q: 'What makes a good summary different from a bad one?', a: 'a good summary captures main ideas accurately without unnecessary details', type: 'open' },
      ],
    },
    'citing-sources': {
      questions: [
        { q: 'Why is citing sources important in science?', a: 'to give credit, allow verification, and show the evidence base for claims', type: 'open' },
        { q: 'What is plagiarism?', a: 'using someone else\'s words or ideas without giving credit', type: 'open' },
        { q: 'What information should a citation include?', a: 'author, title, publication, date, and where to find it', type: 'open' },
        { q: 'When should you cite a source?', a: 'whenever you use someone else\'s ideas, data, or exact words', type: 'open' },
        { q: 'Do you need to cite common knowledge like "water boils at 100°C"?', a: 'no — widely known facts do not need citations', type: 'short' },
        { q: 'What is a bibliography?', a: 'a list of all sources used in a report or paper', type: 'open' },
      ],
    },
    'multimedia-presentation': {
      questions: [
        { q: 'What are the advantages of using multimedia to communicate science?', a: 'it engages multiple senses, can show processes in motion, and reaches wider audiences', type: 'open' },
        { q: 'What should every slide in a science presentation include?', a: 'a clear point, relevant visuals, and minimal text', type: 'open' },
        { q: 'When is a video more effective than a diagram?', a: 'when showing processes, motion, or change over time', type: 'open' },
        { q: 'What is data visualization?', a: 'representing data in visual formats like graphs, maps, or infographics', type: 'open' },
        { q: 'Should you read your slides word-for-word during a presentation?', a: 'no — slides should support your talk, not replace it', type: 'short' },
        { q: 'How can animations help explain science?', a: 'they can show invisible processes like molecular movement or geological time', type: 'open' },
      ],
    },
    'peer-feedback': {
      questions: [
        { q: 'What is constructive peer feedback?', a: 'specific, helpful comments that identify strengths and suggest improvements', type: 'open' },
        { q: 'Why is peer feedback valuable in science?', a: 'it mimics the peer review process and helps improve work through different perspectives', type: 'open' },
        { q: 'What should you focus on when giving feedback on a lab report?', a: 'clarity, accuracy of data, strength of evidence, and logical reasoning', type: 'open' },
        { q: 'How should you respond to critical feedback?', a: 'consider it objectively, ask questions for clarity, and use it to improve', type: 'open' },
        { q: '"I liked it" — is this useful feedback?', a: 'no — it is vague and does not help with improvement', type: 'short' },
        { q: 'Should peer feedback be anonymous?', a: 'it can be — anonymity may lead to more honest feedback', type: 'open' },
      ],
    },
  },
};

const PASSAGES = {
  'grade-6': [
    { title: 'The Water Cycle', focus: 'text features and vocabulary', text: 'Water constantly moves through Earth\'s systems in a process called the water cycle (also known as the hydrological cycle). During evaporation, liquid water in oceans, lakes, and rivers is heated by the sun and turns into water vapor. This invisible gas rises into the atmosphere. As water vapor rises and cools, it undergoes condensation, forming tiny droplets that create clouds. When these droplets combine and become heavy enough, precipitation occurs as rain, snow, sleet, or hail. The water then flows over the ground as runoff or soaks into the soil through infiltration, eventually returning to bodies of water to begin the cycle again.' },
    { title: 'Photosynthesis', focus: 'reading diagrams and data', text: 'Plants produce their own food through photosynthesis. In this process, plants capture light energy using chlorophyll in their chloroplasts. They combine carbon dioxide (CO2) from the air with water (H2O) from the soil to produce glucose (C6H12O6) and oxygen (O2). The equation is: 6CO2 + 6H2O + light energy -> C6H12O6 + 6O2. This process occurs mainly in the leaves. Scientists measured photosynthesis rates at different light levels: low light (2 units/hr), medium light (8 units/hr), high light (12 units/hr), very high light (12 units/hr — no further increase).' },
  ],
  'grade-7': [
    { title: 'The Greenhouse Effect', focus: 'evaluating sources and claims', text: 'The greenhouse effect is a natural process that warms Earth\'s surface. When the sun\'s energy reaches Earth, some is reflected back to space and the rest is absorbed. Greenhouse gases (CO2, methane, water vapor) trap some of the outgoing heat, keeping Earth warm enough to support life. Without this effect, Earth\'s average temperature would be about -18°C instead of +15°C. However, human activities like burning fossil fuels have increased CO2 levels from 280 ppm (pre-industrial) to over 420 ppm today, enhancing the greenhouse effect and causing global warming. Multiple lines of evidence — ice cores, temperature records, sea level data — support this conclusion.' },
    { title: 'Lab Report: Effect of pH on Enzyme Activity', focus: 'lab report structure', text: 'Purpose: To determine how pH affects the rate of enzyme (catalase) activity. Hypothesis: If the pH is closer to 7 (neutral), then catalase will break down hydrogen peroxide faster, because most enzymes work best at neutral pH. Results: pH 2: 2 mL O2/min; pH 4: 5 mL; pH 7: 12 mL; pH 10: 4 mL; pH 12: 1 mL. The data shows a bell curve with peak activity at pH 7. Conclusion: The data supports the hypothesis. Catalase functions optimally at neutral pH. At extreme pH levels (2 and 12), the enzyme was largely inactive, likely due to denaturation.' },
  ],
  'grade-8': [
    { title: 'Evaluating Health Claims', focus: 'pseudoscience detection', text: 'A website claims: "Our SuperBerry Extract cures cancer, diabetes, and heart disease! Used for centuries by ancient healers, this all-natural supplement has NO side effects! One satisfied customer says: \'I took SuperBerry for a week and my tumor disappeared!\' Big Pharma doesn\'t want you to know about this miracle cure!" Analyze this claim: What red flags do you see? What scientific evidence would you need? How does this differ from a legitimate medical study?' },
    { title: 'Climate Data Analysis', focus: 'research communication', text: 'A research team analyzed temperature data from 1900-2020 for a coastal city. Key findings: Average annual temperature increased by 1.8°C. The rate of warming accelerated after 1980 (0.3°C/decade vs. 0.1°C/decade before). Sea level rose 20 cm. Extreme heat events (>35°C) increased from 2/year to 8/year. The team used multiple data sources including weather stations, satellite data, and ocean buoys. Their results were peer-reviewed and published in the Journal of Climate Research. The study was funded by a national science foundation with no conflicts of interest.' },
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

function calcMastery(attempts) {
  if (!attempts || !attempts.length) return 0;
  const recent = attempts.slice(-5).filter(a => a.total > 0);
  return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0;
}

function masteryLabel(r) { return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started'; }

function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

function generateExercise(grade, skill, count = 5) {
  const bank = QUESTION_BANKS[grade]?.[skill];
  if (!bank || !bank.questions) return { error: `No question bank for ${grade}/${skill}` };
  const items = pick(bank.questions, count).map(q => ({ prompt: q.q, answer: Array.isArray(q.a) ? q.a[0] : q.a, acceptedAnswers: Array.isArray(q.a) ? q.a : [q.a], type: q.type || 'short', ...(q.hint && { hint: q.hint }) }));
  return { type: 'literacy', skill, grade, count: items.length, instruction: 'Answer each science literacy question.', items };
}

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(r => norm(r) === norm(answer));
  return norm(expected) === norm(answer);
}

class MSLiteracy {
  getProfile(id) { const p = loadProfile(id); return { studentId: p.studentId, grade: p.grade, createdAt: p.createdAt, totalAssessments: p.assessments.length }; }

  setGrade(id, grade) {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    const p = loadProfile(id); p.grade = grade; saveProfile(p); return { studentId: id, grade };
  }

  recordAssessment(id, grade, category, skill, score, total, notes = '') {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}`);
    if (!SKILLS[grade][category]) throw new Error(`Unknown category '${category}' for ${grade}`);
    if (!SKILLS[grade][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${grade}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id); if (!p.grade) p.grade = grade;
    const entry = { date: new Date().toISOString(), grade, category, skill, score, total, notes }; p.assessments.push(entry);
    const key = `${grade}/${category}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts); p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p); return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
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
    const order = { developing: 0, emerging: 1, 'not-started': 2 }; candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, grade, next: candidates.slice(0, count) };
  }

  getReport(id) { const p = loadProfile(id); return { studentId: id, grade: p.grade, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }

  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }

  getSkillCatalog(grade) {
    const gs = SKILLS[grade]; if (!gs) return { grade, error: `Unknown grade. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0; const catalog = {}; for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; }
    return { grade, skills: catalog, totalSkills: total };
  }

  generateExercise(grade, skill, count = 5) { return generateExercise(grade, skill, count); }

  checkAnswer(type, expected, answer) {
    let exp = expected;
    if (typeof exp === 'string') { const bank = Object.values(QUESTION_BANKS).flatMap(g => Object.values(g)).find(b => b.questions?.some(q => q.a === exp)); if (bank) { const q = bank.questions.find(q => q.a === exp); if (q && Array.isArray(q.a)) exp = q.a; } }
    return { correct: checkAnswer(type, exp, answer), expected, studentAnswer: answer };
  }

  getPassage(grade) {
    const passages = PASSAGES[grade]; if (!passages) return { error: `No passages for ${grade}. Available: ${Object.keys(PASSAGES).join(', ')}` };
    return pick(passages, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id); const grade = p.grade || 'grade-6';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const passage = PASSAGES[grade] ? pick(PASSAGES[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, passage,
      lessonPlan: {
        hook: `Science reading related to: ${target.category} - ${target.skill}`,
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: passage ? `Apply literacy skills to: "${passage.title}"` : 'Practice with a science text',
        reflect: 'How do literacy skills help you think like a scientist?',
      },
    };
  }
}

module.exports = MSLiteracy;

if (require.main === module) {
  const args = process.argv.slice(2); const cmd = args[0];
  const api = new MSLiteracy(); const out = d => console.log(JSON.stringify(d, null, 2));
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
      case 'passage': { const [, g] = args; if (!g) throw new Error('Usage: passage <grade>'); out(api.getPassage(g)); break; }
      default: out({ usage: 'node literacy.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','passage'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
