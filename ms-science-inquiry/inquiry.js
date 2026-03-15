// eClaw MS Scientific Inquiry Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-science-inquiry');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'asking-questions': ['testable-questions', 'observation-vs-inference', 'scientific-vs-nonscientific'],
    'variables': ['independent-variable', 'dependent-variable', 'controlled-variables'],
    'data-basics': ['data-tables', 'basic-graphing', 'recording-observations'],
    'lab-safety': ['safety-equipment', 'safety-rules', 'hazard-symbols'],
  },
  'grade-7': {
    'hypothesis': ['if-then-because', 'testable-hypotheses', 'null-hypothesis'],
    'experimental-design': ['control-groups', 'sample-size', 'repeated-trials'],
    'graphing-analysis': ['line-graphs', 'bar-graphs', 'interpreting-graphs'],
    'fair-testing': ['identifying-flaws', 'improving-experiments', 'reliability-validity'],
  },
  'grade-8': {
    'error-analysis': ['systematic-error', 'random-error', 'percent-error'],
    'statistical-reasoning': ['mean-median-mode', 'variability', 'significant-results'],
    'evaluating-designs': ['peer-review-process', 'replication', 'bias-in-experiments'],
    'science-practices': ['asking-questions', 'developing-models', 'planning-investigations', 'analyzing-data', 'constructing-explanations', 'engaging-in-argument', 'obtaining-information', 'communicating-results'],
  },
};

const QUESTION_BANKS = {
  'grade-6': {
    'testable-questions': {
      questions: [
        { q: 'Is "Does the amount of sunlight affect plant growth?" a testable question?', a: 'yes', type: 'short' },
        { q: 'Is "Why is blue the best color?" a testable question?', a: 'no', type: 'short', hint: 'Opinions cannot be tested scientifically' },
        { q: 'Rewrite "Is Brand X better?" as a testable question.', a: 'Does Brand X clean more stains than Brand Y in 10 minutes?', type: 'open' },
        { q: 'What makes a question testable?', a: 'it can be answered through observation, measurement, or experiment', type: 'open' },
        { q: 'Is "What is the effect of temperature on dissolving rate?" testable?', a: 'yes', type: 'short' },
        { q: 'Is "Do ghosts exist?" a scientific question?', a: 'no', type: 'short', hint: 'Cannot be tested with evidence' },
      ],
    },
    'observation-vs-inference': {
      questions: [
        { q: '"The rock is gray and rough." Is this an observation or an inference?', a: 'observation', type: 'short' },
        { q: '"The animal must have been running from a predator." Observation or inference?', a: 'inference', type: 'short' },
        { q: 'What is the difference between an observation and an inference?', a: 'observations use senses directly; inferences are explanations based on observations', type: 'open' },
        { q: '"The liquid turned blue." Observation or inference?', a: 'observation', type: 'short' },
        { q: '"The plant died because it did not get enough water." Observation or inference?', a: 'inference', type: 'short' },
        { q: 'Can the same evidence lead to different inferences?', a: 'yes', type: 'short' },
      ],
    },
    'scientific-vs-nonscientific': {
      questions: [
        { q: 'Which can science answer: "What is the boiling point of water?" or "What is the meaning of life?"', a: 'what is the boiling point of water', type: 'short' },
        { q: 'Can science answer moral questions like "Is lying wrong?"', a: 'no', type: 'short' },
        { q: 'What types of questions can science answer?', a: 'questions about the natural world that can be tested with evidence', type: 'open' },
        { q: 'Is "Which religion is correct?" a scientific question?', a: 'no', type: 'short' },
        { q: 'Is "What causes earthquakes?" a scientific question?', a: 'yes', type: 'short' },
        { q: 'Why can science not answer questions about personal values?', a: 'values are subjective and cannot be measured or tested', type: 'open' },
      ],
    },
    'independent-variable': {
      questions: [
        { q: 'In an experiment testing how fertilizer affects plant height, what is the independent variable?', a: 'the amount of fertilizer', type: 'short' },
        { q: 'What is an independent variable?', a: 'the variable the experimenter deliberately changes', type: 'open' },
        { q: 'In testing how temperature affects dissolving rate, what is the IV?', a: 'temperature', type: 'short' },
        { q: 'How many independent variables should a good experiment have?', a: 'one', type: 'short', hint: 'To isolate cause and effect' },
        { q: 'Another name for the independent variable is the ___ variable.', a: 'manipulated', type: 'short' },
        { q: 'In testing how light color affects plant growth, what is the IV?', a: 'light color', type: 'short' },
      ],
    },
    'dependent-variable': {
      questions: [
        { q: 'In an experiment testing how fertilizer affects plant height, what is the dependent variable?', a: 'plant height', type: 'short' },
        { q: 'What is a dependent variable?', a: 'the variable that is measured or observed in response to the independent variable', type: 'open' },
        { q: 'The DV is also called the ___ variable.', a: 'responding', type: 'short' },
        { q: 'In testing how study time affects test scores, what is the DV?', a: 'test scores', type: 'short' },
        { q: 'Does the experimenter change the DV directly?', a: 'no', type: 'short', hint: 'It changes in response to the IV' },
        { q: 'In testing how water temperature affects fish activity, what is the DV?', a: 'fish activity level', type: 'short' },
      ],
    },
    'controlled-variables': {
      questions: [
        { q: 'What are controlled variables (constants)?', a: 'variables that are kept the same throughout the experiment', type: 'open' },
        { q: 'In testing fertilizer on plants, name one controlled variable.', a: ['amount of water', 'sunlight', 'soil type', 'plant species', 'pot size'], type: 'multi' },
        { q: 'Why must you control variables in an experiment?', a: 'to make sure any changes are caused by the independent variable, not something else', type: 'open' },
        { q: 'If you change two things at once in an experiment, what is the problem?', a: 'you cannot tell which change caused the result', type: 'open' },
        { q: 'True or false: An experiment should have many controlled variables.', a: 'true', type: 'short' },
        { q: 'In testing music and studying, if one group uses headphones and the other speakers, is this a controlled variable?', a: 'no', type: 'short', hint: 'Audio delivery method should be the same' },
      ],
    },
    'data-tables': {
      questions: [
        { q: 'In a data table, where does the independent variable go?', a: 'the first column (or left column)', type: 'short' },
        { q: 'What should every column in a data table have?', a: 'a header with the variable name and units', type: 'open' },
        { q: 'Why do scientists record data in tables?', a: 'to organize data for easy reading, comparison, and analysis', type: 'open' },
        { q: 'Should you include units of measurement in your data table?', a: 'yes', type: 'short' },
        { q: 'What goes in the rows of a data table?', a: 'the individual trials or measurements', type: 'short' },
        { q: 'Should you include a title for your data table?', a: 'yes', type: 'short' },
      ],
    },
    'basic-graphing': {
      questions: [
        { q: 'What goes on the x-axis of a graph?', a: 'the independent variable', type: 'short' },
        { q: 'What goes on the y-axis of a graph?', a: 'the dependent variable', type: 'short' },
        { q: 'What three things must every graph have?', a: 'title, labeled axes with units, and appropriate scale', type: 'open' },
        { q: 'When should you use a bar graph instead of a line graph?', a: 'when the independent variable is categorical, not continuous', type: 'open' },
        { q: 'What does a line going upward on a graph indicate?', a: 'the dependent variable increases as the independent variable increases', type: 'open' },
        { q: 'Should the scale on your axes start at zero?', a: 'usually yes, unless the data range makes this impractical', type: 'open' },
      ],
    },
    'recording-observations': {
      questions: [
        { q: 'What are quantitative observations?', a: 'observations that involve numbers or measurements', type: 'open' },
        { q: 'What are qualitative observations?', a: 'observations that describe qualities like color, shape, smell, or texture', type: 'open' },
        { q: '"The liquid is 25 mL." Is this quantitative or qualitative?', a: 'quantitative', type: 'short' },
        { q: '"The solution turned cloudy." Is this quantitative or qualitative?', a: 'qualitative', type: 'short' },
        { q: 'Why should you record observations immediately?', a: 'to avoid forgetting details or introducing errors', type: 'open' },
        { q: 'Should you change data that does not match your hypothesis?', a: 'no', type: 'short', hint: 'Record what actually happened' },
      ],
    },
    'safety-equipment': {
      questions: [
        { q: 'When should you wear safety goggles in the lab?', a: 'whenever working with chemicals, heat, or anything that could splash or shatter', type: 'open' },
        { q: 'What should you use to pick up hot glassware?', a: 'tongs or heat-resistant gloves', type: 'short' },
        { q: 'Where should you know the location of in every lab?', a: ['fire extinguisher', 'eyewash station', 'first aid kit', 'fire blanket'], type: 'multi' },
        { q: 'Should you wear open-toed shoes in the lab?', a: 'no', type: 'short' },
        { q: 'What do you use to clean up a chemical spill?', a: 'follow teacher instructions and use appropriate spill kit materials', type: 'open' },
        { q: 'Should long hair be tied back in the lab?', a: 'yes', type: 'short' },
      ],
    },
    'safety-rules': {
      questions: [
        { q: 'Should you ever taste chemicals in the lab?', a: 'no', type: 'short' },
        { q: 'What should you do if you break glass in the lab?', a: 'tell the teacher immediately and do not pick it up with bare hands', type: 'open' },
        { q: 'What is the first thing to do if a chemical splashes in your eye?', a: 'go to the eyewash station and flush for 15 minutes', type: 'open' },
        { q: 'Should you eat or drink in the lab?', a: 'no', type: 'short' },
        { q: 'What should you do before starting any lab?', a: 'read all instructions and listen to the teacher', type: 'open' },
        { q: 'What should you do at the end of every lab?', a: 'clean up, wash hands, and return materials', type: 'open' },
      ],
    },
    'hazard-symbols': {
      questions: [
        { q: 'What does a skull and crossbones symbol mean?', a: 'toxic or poisonous', type: 'short' },
        { q: 'What does a flame symbol mean?', a: 'flammable', type: 'short' },
        { q: 'What does a corrosion symbol (liquid dripping on hand/surface) mean?', a: 'corrosive — can burn skin or damage materials', type: 'short' },
        { q: 'Why are hazard symbols important?', a: 'they warn about dangers so you can take proper safety precautions', type: 'open' },
        { q: 'What does an exclamation mark hazard symbol indicate?', a: 'irritant or health hazard', type: 'short' },
        { q: 'What does a biohazard symbol mean?', a: 'biological hazard — infectious materials present', type: 'short' },
      ],
    },
  },
  'grade-7': {
    'if-then-because': {
      questions: [
        { q: 'Write a hypothesis in if-then-because format about plants and light.', a: 'If plants receive more sunlight, then they will grow taller, because sunlight provides energy for photosynthesis.', type: 'open' },
        { q: 'What are the three parts of an if-then-because hypothesis?', a: 'the condition (if), the prediction (then), and the reasoning (because)', type: 'open' },
        { q: 'Is "Plants need sun" a proper hypothesis?', a: 'no', type: 'short', hint: 'No testable prediction or reasoning' },
        { q: 'What does the "because" part of a hypothesis provide?', a: 'scientific reasoning for why you expect that result', type: 'open' },
        { q: 'Rewrite: "Salt water freezes slower." as a proper hypothesis.', a: 'If salt is added to water, then it will freeze at a lower temperature, because salt lowers the freezing point.', type: 'open' },
        { q: 'Can a hypothesis be proven wrong?', a: 'yes', type: 'short', hint: 'A good hypothesis is falsifiable' },
      ],
    },
    'testable-hypotheses': {
      questions: [
        { q: 'What makes a hypothesis testable?', a: 'it makes a specific, measurable prediction that can be confirmed or disproven by experiment', type: 'open' },
        { q: 'Is "My lucky charm helps me do well on tests" a testable hypothesis?', a: 'no', type: 'short', hint: 'Cannot control for luck or belief effects easily' },
        { q: 'Is "Adding more baking soda will produce more gas in the vinegar reaction" testable?', a: 'yes', type: 'short' },
        { q: 'What should a hypothesis predict?', a: 'a specific, measurable outcome based on the independent variable', type: 'open' },
        { q: 'If your experiment disproves your hypothesis, is the experiment a failure?', a: 'no', type: 'short', hint: 'Disproving a hypothesis is still valuable scientific knowledge' },
        { q: 'Should a hypothesis be a guess or based on prior knowledge?', a: 'based on prior knowledge and reasoning', type: 'short' },
      ],
    },
    'null-hypothesis': {
      questions: [
        { q: 'What is a null hypothesis?', a: 'a statement that there is no relationship or no effect between the variables', type: 'open' },
        { q: 'If testing whether music affects study performance, what is the null hypothesis?', a: 'music has no effect on study performance', type: 'open' },
        { q: 'Why do scientists use null hypotheses?', a: 'to provide a baseline for comparison and determine if results are significant', type: 'open' },
        { q: 'If your results support the null hypothesis, what happened?', a: 'the independent variable had no significant effect', type: 'open' },
        { q: 'The null hypothesis is sometimes called H-sub-___?', a: '0', type: 'short' },
        { q: 'What is the alternative hypothesis?', a: 'the hypothesis that there IS an effect or relationship', type: 'open' },
      ],
    },
    'control-groups': {
      questions: [
        { q: 'What is a control group?', a: 'the group that does not receive the experimental treatment, used for comparison', type: 'open' },
        { q: 'In testing a new plant fertilizer, what would the control group receive?', a: 'no fertilizer (or regular water only)', type: 'short' },
        { q: 'Why is a control group necessary?', a: 'to show what happens without the treatment so you can compare', type: 'open' },
        { q: 'What is the experimental group?', a: 'the group that receives the treatment being tested', type: 'short' },
        { q: 'Can an experiment have more than one experimental group?', a: 'yes', type: 'short', hint: 'You can test different levels of the IV' },
        { q: 'In a drug trial, what is a placebo?', a: 'a fake treatment given to the control group to account for the placebo effect', type: 'open' },
      ],
    },
    'sample-size': {
      questions: [
        { q: 'Why is a larger sample size better in experiments?', a: 'it provides more reliable results and reduces the effect of random variation', type: 'open' },
        { q: 'An experiment tests 3 plants in each group. Is this a good sample size?', a: 'no', type: 'short', hint: 'Too small to be reliable' },
        { q: 'What is the minimum recommended sample size for a science fair project?', a: 'at least 10-20 per group', type: 'short' },
        { q: 'How does small sample size affect conclusions?', a: 'results may be due to chance rather than the treatment', type: 'open' },
        { q: 'If one plant in your experiment dies, how does a large sample size help?', a: 'losing one subject has less impact on the overall results', type: 'open' },
        { q: 'Which is more reliable: testing 5 students or 50 students?', a: '50 students', type: 'short' },
      ],
    },
    'repeated-trials': {
      questions: [
        { q: 'Why should you repeat an experiment multiple times?', a: 'to check if results are consistent and reliable', type: 'open' },
        { q: 'How many trials should you typically run?', a: 'at least 3, preferably more', type: 'short' },
        { q: 'If results vary a lot across trials, what does this suggest?', a: 'the results may not be reliable or there are uncontrolled variables', type: 'open' },
        { q: 'What should you do with data from repeated trials?', a: 'calculate the average (mean) of all trials', type: 'short' },
        { q: 'Can you trust results from a single trial?', a: 'no', type: 'short', hint: 'Could be due to random variation' },
        { q: 'What is replication in science?', a: 'other scientists repeating the experiment to verify the results', type: 'open' },
      ],
    },
    'line-graphs': {
      questions: [
        { q: 'When should you use a line graph?', a: 'when both variables are continuous and you want to show change over time or a trend', type: 'open' },
        { q: 'Should you connect every point in a line graph with straight lines?', a: 'use a line of best fit unless tracking change over time', type: 'open' },
        { q: 'A line going downward from left to right shows what kind of relationship?', a: 'negative or inverse relationship', type: 'short' },
        { q: 'What does a flat (horizontal) line on a graph mean?', a: 'no change in the dependent variable', type: 'short' },
        { q: 'What does a steep line indicate?', a: 'a rapid rate of change', type: 'short' },
        { q: 'Temperature vs. time for a heating experiment. Which type of graph?', a: 'line graph', type: 'short' },
      ],
    },
    'bar-graphs': {
      questions: [
        { q: 'When should you use a bar graph?', a: 'when the independent variable is categorical (groups, not continuous)', type: 'open' },
        { q: 'Average test scores by class period. What graph should you use?', a: 'bar graph', type: 'short' },
        { q: 'Should bars in a bar graph touch?', a: 'no', type: 'short', hint: 'Gaps between bars show separate categories' },
        { q: 'What does the height of a bar represent?', a: 'the value of the dependent variable for that category', type: 'short' },
        { q: 'Favorite pizza toppings in a class. What graph?', a: 'bar graph', type: 'short' },
        { q: 'Can a bar graph compare multiple groups?', a: 'yes', type: 'short', hint: 'Use grouped or stacked bars' },
      ],
    },
    'interpreting-graphs': {
      questions: [
        { q: 'On a graph, a steep upward line means what about the rate of change?', a: 'the rate of change is high (fast increase)', type: 'open' },
        { q: 'What does the area where two lines cross on a graph represent?', a: 'the point where both variables have equal values', type: 'open' },
        { q: 'A graph shows plant height vs. days. Growth slows after day 10. What might explain this?', a: 'the plant may be reaching its maximum height or running out of resources', type: 'open' },
        { q: 'What should you always check first when reading a graph?', a: 'the title and axis labels to understand what is being shown', type: 'open' },
        { q: 'A graph has no title or axis labels. What is the problem?', a: 'you cannot interpret the data without knowing what the axes represent', type: 'open' },
        { q: 'What does it mean if a graph shows no pattern?', a: 'there may be no relationship between the variables', type: 'open' },
      ],
    },
    'identifying-flaws': {
      questions: [
        { q: 'An experiment changes both temperature AND light. What is the flaw?', a: 'two independent variables are changed at once, so you cannot determine which caused the effect', type: 'open' },
        { q: 'A student tests how sugar affects plant growth but uses different amounts of water for each plant. What is the flaw?', a: 'water is not controlled, so it could affect results instead of sugar', type: 'open' },
        { q: 'An experiment has only 2 plants per group. What is the concern?', a: 'sample size is too small to draw reliable conclusions', type: 'open' },
        { q: 'A student only runs the experiment once. What should they do differently?', a: 'run multiple trials to ensure results are consistent', type: 'open' },
        { q: 'An experiment has no control group. Why is this a problem?', a: 'there is nothing to compare the results to', type: 'open' },
        { q: 'A student measures plant height using different rulers. Why is this a problem?', a: 'inconsistent measuring tools introduce measurement error', type: 'open' },
      ],
    },
    'improving-experiments': {
      questions: [
        { q: 'How can you improve an experiment with too few trials?', a: 'increase the number of trials and average the results', type: 'open' },
        { q: 'How can you reduce bias in an experiment?', a: 'use random assignment, blind procedures, and standardized methods', type: 'open' },
        { q: 'Your results do not support your hypothesis. What should you do?', a: 'accept the results, consider what they mean, and possibly redesign the experiment', type: 'open' },
        { q: 'How can you make measurements more accurate?', a: 'use precise instruments, take multiple measurements, and calibrate equipment', type: 'open' },
        { q: 'What is a confounding variable?', a: 'an uncontrolled variable that could affect the results and lead to incorrect conclusions', type: 'open' },
        { q: 'How can peer review improve an experiment?', a: 'other scientists can identify flaws, suggest improvements, and verify methods', type: 'open' },
      ],
    },
    'reliability-validity': {
      questions: [
        { q: 'What does "reliability" mean in science?', a: 'getting consistent results when the experiment is repeated', type: 'open' },
        { q: 'What does "validity" mean in science?', a: 'the experiment actually measures what it claims to measure', type: 'open' },
        { q: 'Can an experiment be reliable but not valid?', a: 'yes', type: 'short', hint: 'You can get consistent wrong results' },
        { q: 'How do you increase reliability?', a: 'repeat trials, use standardized procedures, and increase sample size', type: 'open' },
        { q: 'How do you increase validity?', a: 'control variables, use appropriate measurements, and eliminate bias', type: 'open' },
        { q: 'If different scientists get the same results, is the experiment reliable?', a: 'yes', type: 'short' },
      ],
    },
  },
  'grade-8': {
    'systematic-error': {
      questions: [
        { q: 'What is systematic error?', a: 'a consistent, repeatable error that shifts all measurements in the same direction', type: 'open' },
        { q: 'A scale always reads 5 grams too high. What type of error is this?', a: 'systematic', type: 'short' },
        { q: 'How can you detect systematic error?', a: 'compare your measurements to a known standard or calibrate your equipment', type: 'open' },
        { q: 'Can repeating an experiment fix systematic error?', a: 'no', type: 'short', hint: 'The same error repeats every time' },
        { q: 'Give an example of systematic error.', a: 'a thermometer that always reads 2 degrees too high', type: 'open' },
        { q: 'How do you fix systematic error?', a: 'calibrate instruments, correct measurement technique, or apply a correction factor', type: 'open' },
      ],
    },
    'random-error': {
      questions: [
        { q: 'What is random error?', a: 'unpredictable variation in measurements that can go in either direction', type: 'open' },
        { q: 'How can you reduce random error?', a: 'take more measurements and average them', type: 'open' },
        { q: 'Is random error the same in every trial?', a: 'no', type: 'short', hint: 'It varies unpredictably' },
        { q: 'A student measures the same distance 5 times: 10.2, 9.8, 10.1, 10.3, 9.9. Is this random or systematic error?', a: 'random', type: 'short' },
        { q: 'What causes random error?', a: 'slight variations in technique, environment, or instruments that are hard to control', type: 'open' },
        { q: 'Can random error be completely eliminated?', a: 'no, but it can be minimized', type: 'short' },
      ],
    },
    'percent-error': {
      questions: [
        { q: 'What is the formula for percent error?', a: '|experimental - accepted| / accepted × 100', type: 'open' },
        { q: 'Experimental value: 9.5. Accepted value: 10.0. What is the percent error?', a: '5%', type: 'short' },
        { q: 'A student calculates density as 2.8 g/mL. The accepted value is 2.7 g/mL. What is the percent error? (round to 1 decimal)', a: '3.7%', type: 'short' },
        { q: 'Is a percent error of 0.5% good or bad?', a: 'good', type: 'short', hint: 'Very close to the accepted value' },
        { q: 'What does a high percent error suggest?', a: 'significant errors in the experiment or measurements', type: 'open' },
        { q: 'Why do we use absolute value in the percent error formula?', a: 'so the error is always positive regardless of whether the measurement is too high or too low', type: 'open' },
      ],
    },
    'mean-median-mode': {
      questions: [
        { q: 'Data: 12, 15, 12, 18, 20. What is the mean?', a: '15.4', type: 'short' },
        { q: 'Data: 12, 15, 12, 18, 20. What is the median?', a: '15', type: 'short' },
        { q: 'Data: 12, 15, 12, 18, 20. What is the mode?', a: '12', type: 'short' },
        { q: 'When is the median preferred over the mean?', a: 'when there are outliers that would distort the mean', type: 'open' },
        { q: 'Can a data set have no mode?', a: 'yes', type: 'short' },
        { q: 'Which measure of center is most affected by outliers?', a: 'mean', type: 'short' },
      ],
    },
    'variability': {
      questions: [
        { q: 'What does high variability in data indicate?', a: 'the data values are spread out widely', type: 'open' },
        { q: 'What does low variability indicate?', a: 'data values are clustered close together', type: 'open' },
        { q: 'Name two measures of variability.', a: 'range and standard deviation', type: 'open' },
        { q: 'If all measurements are the same, what is the variability?', a: 'zero', type: 'short' },
        { q: 'High variability in an experiment suggests what about the procedure?', a: 'the procedure may need improvement or there are uncontrolled variables', type: 'open' },
        { q: 'What is the range of: 4, 8, 12, 6, 10?', a: '8', type: 'short', hint: '12 - 4' },
      ],
    },
    'significant-results': {
      questions: [
        { q: 'What does "statistically significant" mean?', a: 'the results are unlikely to have occurred by chance alone', type: 'open' },
        { q: 'If two groups differ by only 1% with high variability, is the difference likely significant?', a: 'no', type: 'short' },
        { q: 'Why do scientists look for significant results?', a: 'to determine if the independent variable actually had an effect', type: 'open' },
        { q: 'Can a large sample size help determine significance?', a: 'yes', type: 'short', hint: 'Larger samples provide more reliable data' },
        { q: 'If results overlap between groups, what does this suggest?', a: 'the difference may not be significant', type: 'open' },
        { q: 'What is a p-value used for?', a: 'to determine the probability that results occurred by chance', type: 'open' },
      ],
    },
    'peer-review-process': {
      questions: [
        { q: 'What is peer review?', a: 'the process where other scientists evaluate a study before it is published', type: 'open' },
        { q: 'Why is peer review important?', a: 'it helps catch errors, improve methods, and ensure quality of published research', type: 'open' },
        { q: 'Who are the "peers" in peer review?', a: 'other scientists with expertise in the same field', type: 'open' },
        { q: 'Can peer-reviewed studies still contain errors?', a: 'yes', type: 'short', hint: 'Peer review reduces but does not eliminate errors' },
        { q: 'Is a blog post as reliable as a peer-reviewed article?', a: 'no', type: 'short' },
        { q: 'What happens if reviewers find serious flaws?', a: 'the paper may be rejected or sent back for revisions', type: 'open' },
      ],
    },
    'replication': {
      questions: [
        { q: 'What is replication in science?', a: 'repeating an experiment to see if the same results can be obtained', type: 'open' },
        { q: 'Why is replication important?', a: 'it confirms that results are real and not due to error or chance', type: 'open' },
        { q: 'If an experiment cannot be replicated, what does this suggest?', a: 'the original results may not be reliable', type: 'open' },
        { q: 'For replication, should a different scientist perform the experiment?', a: 'ideally yes, to reduce experimenter bias', type: 'open' },
        { q: 'What is the "replication crisis"?', a: 'the finding that many published studies cannot be reproduced', type: 'open' },
        { q: 'What must a researcher share for others to replicate their work?', a: 'detailed methods, materials, and procedures', type: 'open' },
      ],
    },
    'bias-in-experiments': {
      questions: [
        { q: 'What is confirmation bias?', a: 'the tendency to look for or interpret data in ways that support your existing beliefs', type: 'open' },
        { q: 'How can a double-blind study reduce bias?', a: 'neither the subjects nor the researchers know who is in the control or experimental group', type: 'open' },
        { q: 'What is selection bias?', a: 'when the sample is not randomly selected and does not represent the population', type: 'open' },
        { q: 'A company tests its own product and finds it is the best. Why should we be skeptical?', a: 'the company has a financial incentive to show positive results (conflict of interest)', type: 'open' },
        { q: 'How does randomization reduce bias?', a: 'it ensures groups are equivalent and differences are not due to pre-existing conditions', type: 'open' },
        { q: 'What is observer bias?', a: 'when the researcher\'s expectations influence how they record or interpret data', type: 'open' },
      ],
    },
    'asking-questions': {
      questions: [
        { q: 'What type of questions do scientists ask?', a: 'questions that can be investigated empirically and answered with evidence', type: 'open' },
        { q: 'How do scientific questions differ from everyday questions?', a: 'they are specific, measurable, and answerable through systematic investigation', type: 'open' },
        { q: 'Why might new questions arise from the results of an experiment?', a: 'results often reveal new patterns or unexpected findings that need further investigation', type: 'open' },
        { q: 'What is the role of curiosity in scientific inquiry?', a: 'curiosity drives scientists to explore the unknown and ask new questions', type: 'open' },
        { q: 'Give an example of a question that could lead to an engineering design challenge.', a: 'How can we design a bridge that holds the most weight using only 50 straws?', type: 'open' },
        { q: 'How can reading scientific literature help generate questions?', a: 'it shows what is already known and where gaps in knowledge exist', type: 'open' },
      ],
    },
    'developing-models': {
      questions: [
        { q: 'What is a scientific model?', a: 'a simplified representation of a system or process used to explain or predict phenomena', type: 'open' },
        { q: 'Give three types of scientific models.', a: 'physical models, mathematical models, and computer models', type: 'open' },
        { q: 'Why are models always incomplete?', a: 'they simplify reality and cannot include every detail of a complex system', type: 'open' },
        { q: 'When should a model be revised?', a: 'when new evidence shows the model does not accurately explain or predict', type: 'open' },
        { q: 'A globe is a model of Earth. What are its limitations?', a: 'it cannot show all details of terrain, weather, or real-time changes', type: 'open' },
        { q: 'How can models help scientists communicate ideas?', a: 'they provide visual or mathematical representations that are easier to understand and discuss', type: 'open' },
      ],
    },
    'planning-investigations': {
      questions: [
        { q: 'What must every investigation have clearly defined?', a: 'a question, variables, procedure, and method of data collection', type: 'open' },
        { q: 'Why is it important to write a detailed procedure?', a: 'so the experiment can be repeated by others and results verified', type: 'open' },
        { q: 'What factors should you consider when planning sample size?', a: 'variability in the population, desired confidence, and practical constraints', type: 'open' },
        { q: 'What is an operational definition?', a: 'a specific description of how a variable will be measured in an experiment', type: 'open' },
        { q: 'Why should you plan your data table before starting?', a: 'to ensure you collect all necessary data in an organized way', type: 'open' },
        { q: 'What ethical considerations apply to investigations?', a: 'safety, informed consent, humane treatment of organisms, and honest reporting', type: 'open' },
      ],
    },
    'analyzing-data': {
      questions: [
        { q: 'What is the first step in analyzing experimental data?', a: 'organize the data in tables and look for patterns', type: 'open' },
        { q: 'Why should you look for outliers in your data?', a: 'they may indicate errors or interesting phenomena worth investigating', type: 'open' },
        { q: 'How do graphs help with data analysis?', a: 'they reveal patterns, trends, and relationships that are hard to see in raw numbers', type: 'open' },
        { q: 'What should you do if your data does not support your hypothesis?', a: 'accept the data, analyze why, and report honestly', type: 'open' },
        { q: 'What is the difference between data and evidence?', a: 'data is the raw measurements; evidence is data used to support or refute a claim', type: 'open' },
        { q: 'Why is it important to include measures of variability when reporting results?', a: 'they show how reliable and consistent the data is', type: 'open' },
      ],
    },
    'constructing-explanations': {
      questions: [
        { q: 'What is a scientific explanation?', a: 'an account that connects evidence to scientific principles to explain a phenomenon', type: 'open' },
        { q: 'What is the CER framework?', a: 'Claim, Evidence, Reasoning — a structure for scientific explanations', type: 'open' },
        { q: 'What is the difference between a hypothesis and an explanation?', a: 'a hypothesis is a prediction before testing; an explanation accounts for results after testing', type: 'open' },
        { q: 'Can a scientific explanation change?', a: 'yes, as new evidence is discovered', type: 'short' },
        { q: 'What role does evidence play in a scientific explanation?', a: 'it supports or refutes the claim with specific data', type: 'open' },
        { q: 'What role does reasoning play?', a: 'it connects the evidence to the claim using scientific principles', type: 'open' },
      ],
    },
    'engaging-in-argument': {
      questions: [
        { q: 'What is a scientific argument?', a: 'a reasoned case for or against a claim supported by evidence', type: 'open' },
        { q: 'How is a scientific argument different from a disagreement?', a: 'scientific arguments use evidence and logic rather than emotions or opinions', type: 'open' },
        { q: 'What should you do if someone presents strong evidence against your claim?', a: 'consider their evidence, revise your claim if warranted', type: 'open' },
        { q: 'Why is debate important in science?', a: 'it tests ideas, reveals flaws, and leads to stronger conclusions', type: 'open' },
        { q: 'What is a counterargument?', a: 'an argument that opposes or challenges another claim', type: 'open' },
        { q: 'Should scientific arguments be based on authority or evidence?', a: 'evidence', type: 'short' },
      ],
    },
    'obtaining-information': {
      questions: [
        { q: 'What makes a source credible in science?', a: 'peer review, reputable publisher, author expertise, and supporting evidence', type: 'open' },
        { q: 'Should you rely on a single source for scientific information?', a: 'no', type: 'short', hint: 'Use multiple sources to corroborate' },
        { q: 'How can you evaluate if a website is a reliable science source?', a: 'check the author, publisher, date, evidence cited, and whether it is peer-reviewed', type: 'open' },
        { q: 'What is the difference between primary and secondary sources?', a: 'primary sources report original research; secondary sources summarize or interpret others\' research', type: 'open' },
        { q: 'Why is it important to cite sources?', a: 'to give credit, allow verification, and avoid plagiarism', type: 'open' },
        { q: 'Is Wikipedia a primary source?', a: 'no', type: 'short' },
      ],
    },
    'communicating-results': {
      questions: [
        { q: 'What sections should a lab report include?', a: 'title, purpose, hypothesis, materials, procedure, data, analysis, and conclusion', type: 'open' },
        { q: 'Why is it important to communicate results clearly?', a: 'so others can understand, evaluate, and replicate the work', type: 'open' },
        { q: 'What role do visuals (graphs, diagrams) play in communicating results?', a: 'they make data patterns easier to see and understand', type: 'open' },
        { q: 'Should you include results that did not support your hypothesis?', a: 'yes', type: 'short', hint: 'All data must be reported honestly' },
        { q: 'What is the difference between results and conclusions?', a: 'results are what happened; conclusions are what the results mean', type: 'open' },
        { q: 'Why should a conclusion address the original question?', a: 'to show whether the investigation answered what it set out to answer', type: 'open' },
      ],
    },
  },
};

const SCENARIOS = {
  'grade-6': [
    { title: 'The Plant Growth Experiment', focus: 'variables and data collection', text: 'You want to find out if playing music helps plants grow taller. Design an experiment. What is your IV? DV? What variables will you control? How will you collect data?' },
    { title: 'The Mystery Substance', focus: 'observation and safety', text: 'Your teacher gives you an unknown white powder. Using only safe lab techniques, how would you observe and describe it? What tests could you do? What safety precautions would you take?' },
  ],
  'grade-7': [
    { title: 'The Sports Drink Study', focus: 'experimental design', text: 'A company claims their sports drink improves athletic performance. Design an experiment to test this claim. Include: hypothesis, control group, experimental group, sample size, variables, and how you would measure performance.' },
    { title: 'The Bridge Builder', focus: 'fair testing', text: 'Three students each build a paper bridge. Student A uses 10 sheets of paper, B uses 5, and C uses 10 but a different type. They test how much weight each holds. What is wrong with this experiment? How would you redesign it?' },
  ],
  'grade-8': [
    { title: 'The Vaccine Study', focus: 'evaluating experimental design', text: 'A study of 20 people claims a new vitamin supplement prevents colds. The researchers only tested their friends. Evaluate this study: What are the flaws? How would you redesign it? What would make the results more convincing?' },
    { title: 'The Climate Data', focus: 'analyzing data and communicating results', text: 'You are given 50 years of temperature data for your city. Describe how you would analyze this data: What graphs would you create? What statistical measures would you calculate? How would you communicate your findings? What claims could you make?' },
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

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

function generateExercise(grade, skill, count = 5) {
  const bank = QUESTION_BANKS[grade]?.[skill];
  if (!bank || !bank.questions) return { error: `No question bank for ${grade}/${skill}` };
  const items = pick(bank.questions, count).map(q => ({
    prompt: q.q, answer: Array.isArray(q.a) ? q.a[0] : q.a, acceptedAnswers: Array.isArray(q.a) ? q.a : [q.a], type: q.type || 'short',
    ...(q.hint && { hint: q.hint }),
  }));
  return { type: 'inquiry', skill, grade, count: items.length, instruction: 'Answer each scientific inquiry question.', items };
}

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(r => norm(r) === norm(answer));
  return norm(expected) === norm(answer);
}

class MSInquiry {
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

  checkAnswer(type, expected, answer) {
    let exp = expected;
    if (typeof exp === 'string') {
      const bank = Object.values(QUESTION_BANKS).flatMap(g => Object.values(g)).find(b => b.questions?.some(q => q.a === exp));
      if (bank) { const q = bank.questions.find(q => q.a === exp); if (q && Array.isArray(q.a)) exp = q.a; }
    }
    return { correct: checkAnswer(type, exp, answer), expected, studentAnswer: answer };
  }

  getScenario(grade) {
    const scenarios = SCENARIOS[grade];
    if (!scenarios) return { error: `No scenarios for ${grade}. Available: ${Object.keys(SCENARIOS).join(', ')}` };
    return pick(scenarios, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-6';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const scenario = SCENARIOS[grade] ? pick(SCENARIOS[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, scenario,
      lessonPlan: {
        hook: `Investigation scenario related to: ${target.category} - ${target.skill}`,
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: scenario ? `Apply to investigation: "${scenario.title}"` : 'Design your own investigation',
        reflect: 'How would a scientist approach this differently than a non-scientist?',
      },
    };
  }
}

module.exports = MSInquiry;

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new MSInquiry();
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
      case 'scenario': { const [, g] = args; if (!g) throw new Error('Usage: scenario <grade>'); out(api.getScenario(g)); break; }
      default: out({ usage: 'node inquiry.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','scenario'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
