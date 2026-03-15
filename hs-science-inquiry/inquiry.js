// eClaw HS Scientific Inquiry Tutor (Grades 9-12). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-science-inquiry');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  standard: {
    'experimental-design': ['variables-and-controls', 'hypothesis-formulation', 'sample-size-and-replication', 'randomization'],
    'data-analysis': ['descriptive-statistics', 'graphing-and-visualization', 'data-cleaning', 'identifying-trends'],
    'statistical-reasoning': ['p-values-significance', 'correlation-vs-causation', 'confidence-intervals', 'variability-measures'],
    'scientific-modeling': ['physical-models', 'mathematical-models', 'model-evaluation', 'model-limitations'],
    'lab-techniques': ['measurement-precision', 'significant-figures', 'error-analysis', 'lab-safety-protocols'],
    'research-communication': ['imrad-structure', 'cer-writing', 'peer-review-basics', 'scientific-presentations'],
  },
  advanced: {
    'experimental-design': ['variables-and-controls', 'hypothesis-formulation', 'sample-size-and-replication', 'randomization', 'factorial-designs'],
    'data-analysis': ['descriptive-statistics', 'graphing-and-visualization', 'data-cleaning', 'identifying-trends', 'multivariate-analysis'],
    'statistical-reasoning': ['p-values-significance', 'correlation-vs-causation', 'confidence-intervals', 'variability-measures', 't-tests-and-chi-square'],
    'scientific-modeling': ['physical-models', 'mathematical-models', 'model-evaluation', 'model-limitations', 'computational-models'],
    'lab-techniques': ['measurement-precision', 'significant-figures', 'error-analysis', 'lab-safety-protocols', 'advanced-instrumentation'],
    'research-communication': ['imrad-structure', 'cer-writing', 'peer-review-basics', 'scientific-presentations', 'literature-reviews'],
  },
};

const CONTENT_BANKS = {
  // ── Experimental Design ──
  'variables-and-controls': {
    questions: [
      { q: 'What is an independent variable (IV)?', a: 'the variable deliberately changed by the researcher', alt: ['the variable the researcher changes', 'the manipulated variable'], type: 'open' },
      { q: 'What is a dependent variable (DV)?', a: 'the variable measured in response to the independent variable', alt: ['the variable being measured', 'the responding variable'], type: 'open' },
      { q: 'What is a controlled variable?', a: 'a variable kept constant so it does not affect the results', alt: ['a variable held constant', 'a constant'], type: 'open' },
      { q: 'What is the purpose of a control group?', a: 'to provide a baseline for comparison with the experimental group', alt: ['to serve as a comparison baseline'], type: 'open' },
      { q: 'In an experiment testing fertilizer on plant growth, what is the DV?', a: 'plant growth', alt: ['the growth of the plant', 'how much the plant grows'], type: 'short' },
      { q: 'Why is it important to change only one variable at a time?', a: 'so you can attribute any observed effect to that specific variable', alt: ['to isolate the cause of any observed change'], type: 'open' },
      { q: 'What is a confounding variable?', a: 'an uncontrolled variable that may influence the dependent variable and distort results', alt: ['a variable that could affect results but is not controlled'], type: 'open' },
    ],
  },
  'hypothesis-formulation': {
    questions: [
      { q: 'What is a scientific hypothesis?', a: 'a testable prediction about the relationship between variables', alt: ['a testable explanation or prediction'], type: 'open' },
      { q: 'What format does an if-then-because hypothesis follow?', a: 'if the IV is changed, then the DV will change, because of a scientific reason', alt: ['if iv then dv because reasoning'], type: 'open' },
      { q: 'What is a null hypothesis?', a: 'a statement predicting no relationship or no difference between variables', alt: ['a hypothesis that states there is no effect'], type: 'open' },
      { q: 'Can a hypothesis be proven true?', a: 'no', type: 'short' },
      { q: 'What makes a hypothesis testable?', a: 'it must be specific enough to design an experiment that could support or refute it', alt: ['it can be investigated through experimentation'], type: 'open' },
      { q: 'What should you do if data does not support your hypothesis?', a: 'accept the data, analyze possible reasons, and revise or reject the hypothesis', alt: ['reject or revise the hypothesis based on the evidence'], type: 'open' },
      { q: 'Is "Plants like sunlight" a good hypothesis? Why or why not?', a: 'no, because it is vague and not measurable or testable', alt: ['no it is not testable'], type: 'open' },
    ],
  },
  'sample-size-and-replication': {
    questions: [
      { q: 'Why is a large sample size important in experiments?', a: 'it reduces the effect of random variation and increases reliability of results', alt: ['it makes results more reliable'], type: 'open' },
      { q: 'What is replication in scientific experiments?', a: 'repeating an experiment to verify results', alt: ['performing the experiment multiple times'], type: 'open' },
      { q: 'What is the difference between replication and repeated trials?', a: 'repeated trials are within one experiment; replication is independent re-testing by others', alt: ['repeated trials are by the same person replication is by others'], type: 'open' },
      { q: 'How does sample size affect statistical power?', a: 'larger samples increase statistical power, making it easier to detect real effects', alt: ['larger samples increase power'], type: 'open' },
      { q: 'A study uses only 3 participants. Is this a strong design?', a: 'no', type: 'short' },
      { q: 'What is sampling bias?', a: 'a systematic error in selecting participants that makes the sample unrepresentative', alt: ['when the sample does not represent the population'], type: 'open' },
    ],
  },
  'randomization': {
    questions: [
      { q: 'What is randomization in experimental design?', a: 'randomly assigning subjects to groups to minimize bias', alt: ['random assignment to treatment groups'], type: 'open' },
      { q: 'Why is random assignment important?', a: 'it helps ensure groups are comparable and reduces confounding variables', alt: ['it reduces bias between groups'], type: 'open' },
      { q: 'What is random sampling?', a: 'selecting participants from a population so every individual has an equal chance of being chosen', alt: ['every member of the population has an equal chance of selection'], type: 'open' },
      { q: 'How is random assignment different from random sampling?', a: 'random sampling selects who participates; random assignment determines which group they join', alt: ['sampling is about selection, assignment is about grouping'], type: 'open' },
      { q: 'What is a blind experiment?', a: 'an experiment where participants do not know which group they are in', alt: ['participants dont know their treatment group'], type: 'open' },
      { q: 'What is a double-blind experiment?', a: 'neither the participants nor the researchers know group assignments during data collection', alt: ['both participants and researchers are unaware of group assignments'], type: 'open' },
    ],
  },
  'factorial-designs': {
    questions: [
      { q: 'What is a factorial design?', a: 'an experiment that tests multiple independent variables and their interactions simultaneously', alt: ['an experiment with two or more independent variables'], type: 'open' },
      { q: 'What is a 2x2 factorial design?', a: 'a design with two independent variables each having two levels', alt: ['two factors each with two levels'], type: 'open' },
      { q: 'What is an interaction effect?', a: 'when the effect of one variable depends on the level of another variable', alt: ['when two variables combined produce a different effect than either alone'], type: 'open' },
      { q: 'What is a main effect?', a: 'the overall effect of one independent variable on the dependent variable, ignoring other variables', alt: ['the effect of one iv across all levels of other ivs'], type: 'open' },
      { q: 'How many conditions does a 2x3 factorial design have?', a: '6', type: 'short' },
      { q: 'Why are factorial designs more efficient than testing one variable at a time?', a: 'they test multiple variables and interactions in a single experiment using fewer total subjects', alt: ['they reveal interactions and use fewer resources'], type: 'open' },
    ],
  },

  // ── Data Analysis ──
  'descriptive-statistics': {
    questions: [
      { q: 'What is the mean?', a: 'the sum of all values divided by the number of values', alt: ['the average'], type: 'open' },
      { q: 'What is the median?', a: 'the middle value when data are ordered from least to greatest', alt: ['the middle value in a sorted dataset'], type: 'open' },
      { q: 'When is the median preferred over the mean?', a: 'when the data has outliers or is skewed', alt: ['when there are outliers'], type: 'open' },
      { q: 'What is the mode?', a: 'the value that occurs most frequently in a dataset', alt: ['the most common value'], type: 'open' },
      { q: 'What is standard deviation?', a: 'a measure of how spread out data values are from the mean', alt: ['average distance from the mean'], type: 'open' },
      { q: 'What does a small standard deviation indicate?', a: 'data points are clustered close to the mean', alt: ['low variability', 'data is tightly clustered'], type: 'open' },
      { q: 'What is range?', a: 'the difference between the highest and lowest values', alt: ['max minus min'], type: 'short' },
    ],
  },
  'graphing-and-visualization': {
    questions: [
      { q: 'When should you use a bar graph?', a: 'when comparing categorical data or groups', alt: ['for categorical data'], type: 'open' },
      { q: 'When should you use a line graph?', a: 'when showing changes over time or continuous data', alt: ['for continuous data or trends over time'], type: 'open' },
      { q: 'When should you use a scatter plot?', a: 'when showing the relationship between two continuous variables', alt: ['to display correlation between two variables'], type: 'open' },
      { q: 'Which axis typically shows the independent variable?', a: 'the x-axis', alt: ['x axis', 'horizontal axis'], type: 'short' },
      { q: 'Why must graphs include labeled axes with units?', a: 'so the reader can understand what is being measured and compare values accurately', alt: ['for clarity and accurate interpretation'], type: 'open' },
      { q: 'What is a histogram used for?', a: 'displaying the frequency distribution of continuous data', alt: ['showing frequency of data in intervals'], type: 'open' },
      { q: 'What is a best-fit line?', a: 'a line drawn through a scatter plot that best represents the overall trend in the data', alt: ['a trend line that minimizes distance to data points'], type: 'open' },
    ],
  },
  'data-cleaning': {
    questions: [
      { q: 'What is an outlier?', a: 'a data point significantly different from other observations', alt: ['an unusually high or low value'], type: 'open' },
      { q: 'Should outliers always be removed from a dataset?', a: 'no', type: 'short' },
      { q: 'What should you do before removing an outlier?', a: 'investigate whether it resulted from an error or is a legitimate data point', alt: ['determine if it is an error or real data'], type: 'open' },
      { q: 'What is data validation?', a: 'checking data for accuracy, completeness, and consistency', alt: ['verifying data is correct and complete'], type: 'open' },
      { q: 'What is missing data and how should it be handled?', a: 'absent values in a dataset that should be documented and addressed with appropriate methods', alt: ['gaps in data that need documentation and handling'], type: 'open' },
      { q: 'Why is it important to record raw data before cleaning?', a: 'to preserve the original measurements and allow others to verify the cleaning process', alt: ['to keep an unaltered record for verification'], type: 'open' },
    ],
  },
  'identifying-trends': {
    questions: [
      { q: 'What is a trend in data?', a: 'a general direction or pattern in data over time or across conditions', alt: ['a consistent pattern in data'], type: 'open' },
      { q: 'What is a positive correlation?', a: 'as one variable increases, the other also increases', alt: ['both variables increase together'], type: 'open' },
      { q: 'What is a negative correlation?', a: 'as one variable increases, the other decreases', alt: ['one variable increases while the other decreases'], type: 'open' },
      { q: 'What does it mean if there is no correlation?', a: 'there is no consistent relationship between the two variables', alt: ['the variables are not related'], type: 'open' },
      { q: 'What is an interpolation?', a: 'estimating a value within the range of known data points', alt: ['predicting within the data range'], type: 'open' },
      { q: 'What is an extrapolation?', a: 'estimating a value beyond the range of known data points', alt: ['predicting beyond the data range'], type: 'open' },
    ],
  },
  'multivariate-analysis': {
    questions: [
      { q: 'What is multivariate analysis?', a: 'statistical analysis involving more than two variables simultaneously', alt: ['analysis of multiple variables at once'], type: 'open' },
      { q: 'What is a lurking variable?', a: 'an unmeasured variable that influences the relationship between studied variables', alt: ['a hidden variable affecting results'], type: 'open' },
      { q: 'What is regression analysis?', a: 'a method for modeling the relationship between a dependent variable and one or more independent variables', alt: ['modeling how variables are related mathematically'], type: 'open' },
      { q: 'What does R-squared measure?', a: 'the proportion of variance in the dependent variable explained by the independent variables', alt: ['how well the model fits the data'], type: 'open' },
      { q: 'What is a scatterplot matrix?', a: 'a grid of scatterplots showing relationships between all pairs of variables', alt: ['multiple scatterplots comparing all variable pairs'], type: 'open' },
      { q: 'Why might you use multivariate analysis instead of analyzing one variable at a time?', a: 'it reveals interactions and relationships that single-variable analysis would miss', alt: ['it shows how variables interact together'], type: 'open' },
    ],
  },

  // ── Statistical Reasoning ──
  'p-values-significance': {
    questions: [
      { q: 'What is a p-value?', a: 'the probability of observing results at least as extreme as the data, assuming the null hypothesis is true', alt: ['probability of the data given the null hypothesis'], type: 'open' },
      { q: 'What is the conventional threshold for statistical significance?', a: '0.05', alt: ['p < 0.05', '5 percent'], type: 'short' },
      { q: 'If p = 0.03, is the result statistically significant at alpha = 0.05?', a: 'yes', type: 'short' },
      { q: 'Does a statistically significant result always mean the effect is important?', a: 'no', type: 'short' },
      { q: 'What is a Type I error?', a: 'rejecting the null hypothesis when it is actually true (false positive)', alt: ['a false positive'], type: 'open' },
      { q: 'What is a Type II error?', a: 'failing to reject the null hypothesis when it is actually false (false negative)', alt: ['a false negative'], type: 'open' },
      { q: 'Why should you not rely solely on p-values to interpret results?', a: 'p-values do not measure effect size, practical importance, or whether the hypothesis is true', alt: ['they dont show effect size or practical significance'], type: 'open' },
    ],
  },
  'correlation-vs-causation': {
    questions: [
      { q: 'What is the difference between correlation and causation?', a: 'correlation means two variables move together; causation means one variable directly causes the other', alt: ['correlation is association, causation is one causing the other'], type: 'open' },
      { q: 'Does correlation prove causation?', a: 'no', type: 'short' },
      { q: 'What type of study can establish causation?', a: 'a controlled experiment with random assignment', alt: ['a randomized controlled experiment'], type: 'open' },
      { q: 'Ice cream sales and drowning rates are correlated. Does ice cream cause drowning?', a: 'no, both are related to a confounding variable such as hot weather', alt: ['no, it is a confounding variable'], type: 'open' },
      { q: 'What is a third variable problem?', a: 'when an unmeasured variable causes both of the observed variables to change', alt: ['a confounding variable causing both observed changes'], type: 'open' },
      { q: 'What are three criteria for establishing causation?', a: 'correlation, temporal precedence (cause before effect), and elimination of alternative explanations', alt: ['association, time order, and no confounds'], type: 'open' },
    ],
  },
  'confidence-intervals': {
    questions: [
      { q: 'What is a confidence interval?', a: 'a range of values that is likely to contain the true population parameter', alt: ['a range likely containing the true value'], type: 'open' },
      { q: 'What does a 95% confidence interval mean?', a: 'if the study were repeated many times, 95% of the intervals would contain the true parameter', alt: ['95 percent of repeated samples would capture the true value'], type: 'open' },
      { q: 'What happens to a confidence interval as sample size increases?', a: 'the interval becomes narrower', alt: ['it gets narrower', 'it shrinks'], type: 'open' },
      { q: 'Is a 99% CI wider or narrower than a 95% CI?', a: 'wider', type: 'short' },
      { q: 'If a 95% CI for a mean difference is (2.1, 5.3), does it include zero?', a: 'no', type: 'short' },
      { q: 'What does it suggest if a confidence interval for a treatment effect includes zero?', a: 'the treatment effect may not be statistically significant', alt: ['the effect might not be real', 'no significant effect'], type: 'open' },
    ],
  },
  'variability-measures': {
    questions: [
      { q: 'What does variability describe in a dataset?', a: 'how spread out or dispersed the data values are', alt: ['the spread of data'], type: 'open' },
      { q: 'Name three common measures of variability.', a: 'range, variance, and standard deviation', alt: ['range variance standard deviation'], type: 'open' },
      { q: 'What is variance?', a: 'the average of the squared differences from the mean', alt: ['average squared deviation from the mean'], type: 'open' },
      { q: 'How are variance and standard deviation related?', a: 'standard deviation is the square root of variance', alt: ['sd is the square root of variance'], type: 'open' },
      { q: 'What is the interquartile range (IQR)?', a: 'the difference between the 75th and 25th percentiles', alt: ['Q3 minus Q1'], type: 'open' },
      { q: 'Why is the IQR more robust than range?', a: 'it is not affected by outliers since it only uses the middle 50% of data', alt: ['it ignores outliers'], type: 'open' },
    ],
  },
  't-tests-and-chi-square': {
    questions: [
      { q: 'When is a t-test used?', a: 'to compare the means of two groups and determine if they are significantly different', alt: ['to compare two group means'], type: 'open' },
      { q: 'What is the difference between a paired and an independent t-test?', a: 'paired compares the same subjects under two conditions; independent compares two different groups', alt: ['paired is same subjects, independent is different groups'], type: 'open' },
      { q: 'When is a chi-square test used?', a: 'to test whether observed frequencies differ from expected frequencies for categorical data', alt: ['for comparing categorical data frequencies'], type: 'open' },
      { q: 'What type of data does a chi-square test require?', a: 'categorical data', alt: ['categorical', 'nominal or ordinal data'], type: 'short' },
      { q: 'What are degrees of freedom?', a: 'the number of values free to vary in a statistical calculation', alt: ['values free to vary when computing a statistic'], type: 'open' },
      { q: 'What assumption must be met for a standard t-test?', a: 'the data should be approximately normally distributed', alt: ['normal distribution', 'data is normally distributed'], type: 'open' },
    ],
  },

  // ── Scientific Modeling ──
  'physical-models': {
    questions: [
      { q: 'What is a physical model in science?', a: 'a tangible three-dimensional representation of an object or system', alt: ['a 3d representation of a real object or system'], type: 'open' },
      { q: 'Give an example of a physical model.', a: 'a globe representing Earth', alt: ['a globe', 'a model of the solar system', 'a molecular model'], type: 'short' },
      { q: 'What is a limitation of physical models?', a: 'they cannot show all features or processes accurately, especially at different scales', alt: ['they are not perfectly accurate or to scale'], type: 'open' },
      { q: 'Why are physical models useful in science?', a: 'they help visualize structures and processes that are too large, small, or complex to observe directly', alt: ['they help visualize things we cannot see directly'], type: 'open' },
      { q: 'How is a scale model different from a full-size model?', a: 'a scale model is proportionally smaller or larger than the real object', alt: ['it is proportionally resized'], type: 'open' },
      { q: 'Should a model include every detail of what it represents?', a: 'no, models are simplifications that focus on relevant features', alt: ['no models are simplifications'], type: 'open' },
    ],
  },
  'mathematical-models': {
    questions: [
      { q: 'What is a mathematical model?', a: 'an equation or set of equations that describes a system or process', alt: ['a mathematical representation of a real system'], type: 'open' },
      { q: 'Give an example of a mathematical model in science.', a: 'the equation for population growth, or F = ma', alt: ['f equals ma', 'population growth equation', 'ideal gas law'], type: 'short' },
      { q: 'What is a parameter in a mathematical model?', a: 'a value in the model that can be adjusted to fit real-world data', alt: ['an adjustable constant in a model'], type: 'open' },
      { q: 'Why are assumptions necessary in mathematical models?', a: 'to simplify complex reality into a solvable form', alt: ['they simplify the system to make it solvable'], type: 'open' },
      { q: 'What does it mean to "fit" a model to data?', a: 'adjusting model parameters so the model output closely matches observed data', alt: ['calibrating parameters to match data'], type: 'open' },
      { q: 'Can a mathematical model perfectly predict every outcome?', a: 'no', type: 'short' },
    ],
  },
  'model-evaluation': {
    questions: [
      { q: 'How do you evaluate whether a model is good?', a: 'by comparing its predictions to observed data and checking how well they match', alt: ['compare predictions to real data'], type: 'open' },
      { q: 'What is model validation?', a: 'testing a model against independent data not used to build it', alt: ['testing the model on new data'], type: 'open' },
      { q: 'What should you do if a model fails to predict observations?', a: 'revise the model, check assumptions, or consider alternative models', alt: ['revise or replace the model'], type: 'open' },
      { q: 'What is the trade-off between model simplicity and accuracy?', a: 'simpler models are easier to use but may miss important details; complex models may be more accurate but harder to interpret', alt: ['simple models are less accurate but more practical'], type: 'open' },
      { q: 'Why is it important to test a model with multiple datasets?', a: 'to ensure the model generalizes well and is not overfit to one dataset', alt: ['to check that it works beyond one dataset'], type: 'open' },
      { q: 'What is overfitting?', a: 'when a model fits the training data too closely and fails to generalize to new data', alt: ['fitting noise instead of the real pattern'], type: 'open' },
    ],
  },
  'model-limitations': {
    questions: [
      { q: 'Why do all models have limitations?', a: 'because models are simplifications of reality and cannot capture every variable or interaction', alt: ['they simplify reality'], type: 'open' },
      { q: 'What is the phrase "All models are wrong, but some are useful" attributed to?', a: 'George Box', alt: ['george box', 'box'], type: 'short' },
      { q: 'How can the scale of a model introduce limitations?', a: 'features may be distorted or invisible at different scales', alt: ['scale changes can distort or hide features'], type: 'open' },
      { q: 'What is an assumption in the context of a model?', a: 'a simplification or condition accepted as true to make the model workable', alt: ['a condition taken as true for simplicity'], type: 'open' },
      { q: 'Why should model limitations be reported?', a: 'so users know the boundaries of the model and do not over-interpret its predictions', alt: ['to prevent misuse or over-interpretation'], type: 'open' },
      { q: 'Can a model be useful even if it is not perfectly accurate?', a: 'yes', type: 'short' },
    ],
  },
  'computational-models': {
    questions: [
      { q: 'What is a computational model?', a: 'a computer program that simulates a system or process using mathematical rules', alt: ['a computer simulation of a system'], type: 'open' },
      { q: 'What is a simulation?', a: 'running a computational model to observe how a system behaves under given conditions', alt: ['using a model to predict system behavior'], type: 'open' },
      { q: 'Name one advantage of computational models over physical experiments.', a: 'they can test scenarios that are too dangerous, expensive, or time-consuming to do physically', alt: ['they can simulate dangerous or costly experiments'], type: 'open' },
      { q: 'What is an agent-based model?', a: 'a model where individual agents follow rules and collective behavior emerges from their interactions', alt: ['a model simulating individual agents and their interactions'], type: 'open' },
      { q: 'What programming concepts are commonly used in computational models?', a: 'loops, conditionals, variables, and functions', alt: ['loops conditionals variables functions'], type: 'open' },
      { q: 'Why is it important to validate computational models against real data?', a: 'to ensure the simulation accurately represents the real system', alt: ['to check that the simulation matches reality'], type: 'open' },
    ],
  },

  // ── Lab Techniques ──
  'measurement-precision': {
    questions: [
      { q: 'What is the difference between accuracy and precision?', a: 'accuracy is how close a measurement is to the true value; precision is how close repeated measurements are to each other', alt: ['accuracy is closeness to true value, precision is repeatability'], type: 'open' },
      { q: 'Can measurements be precise but not accurate?', a: 'yes', type: 'short' },
      { q: 'What is calibration?', a: 'adjusting an instrument so its readings match a known standard', alt: ['setting an instrument to a known standard'], type: 'open' },
      { q: 'What is the smallest division on a graduated cylinder called?', a: 'the smallest increment or graduation', alt: ['the graduation', 'the smallest increment'], type: 'short' },
      { q: 'How should you read the volume in a graduated cylinder?', a: 'at the bottom of the meniscus at eye level', alt: ['read at the meniscus at eye level'], type: 'open' },
      { q: 'Why should you repeat measurements multiple times?', a: 'to improve reliability and identify random errors', alt: ['to increase reliability'], type: 'open' },
      { q: 'What is resolution of a measuring instrument?', a: 'the smallest change in a quantity that the instrument can detect', alt: ['the smallest detectable change'], type: 'open' },
    ],
  },
  'significant-figures': {
    questions: [
      { q: 'What are significant figures?', a: 'the digits in a measurement that are known with certainty plus one estimated digit', alt: ['digits that carry meaning about precision'], type: 'open' },
      { q: 'How many significant figures are in 0.00340?', a: '3', type: 'short' },
      { q: 'How many significant figures are in 1200?', a: '2', alt: ['2 or 4 depending on context'], type: 'short' },
      { q: 'When multiplying, how do you determine significant figures in the answer?', a: 'use the fewest number of significant figures from the measurements being multiplied', alt: ['use the fewest sig figs from the inputs'], type: 'open' },
      { q: 'When adding, how do you determine decimal places in the answer?', a: 'use the fewest number of decimal places from the measurements being added', alt: ['use the fewest decimal places'], type: 'open' },
      { q: 'Why do significant figures matter in science?', a: 'they communicate the precision of a measurement', alt: ['they show how precise a measurement is'], type: 'open' },
    ],
  },
  'error-analysis': {
    questions: [
      { q: 'What is systematic error?', a: 'a consistent error in the same direction caused by flawed equipment or procedure', alt: ['a consistent repeatable error from a flawed method'], type: 'open' },
      { q: 'What is random error?', a: 'unpredictable fluctuations in measurements caused by uncontrollable factors', alt: ['unpredictable variation in measurements'], type: 'open' },
      { q: 'How do you calculate percent error?', a: '|(experimental - accepted) / accepted| x 100', alt: ['absolute value of experimental minus accepted divided by accepted times 100'], type: 'open' },
      { q: 'Can systematic error be reduced by averaging more trials?', a: 'no', type: 'short' },
      { q: 'Can random error be reduced by averaging more trials?', a: 'yes', type: 'short' },
      { q: 'What is propagation of error?', a: 'the way uncertainties in measurements combine and affect the uncertainty of a calculated result', alt: ['how measurement errors compound in calculations'], type: 'open' },
    ],
  },
  'lab-safety-protocols': {
    questions: [
      { q: 'What should you do first if a chemical splashes in your eye?', a: 'rinse with water at the eyewash station for at least 15 minutes', alt: ['use the eyewash station', 'rinse with water'], type: 'open' },
      { q: 'What does MSDS (or SDS) stand for?', a: 'Material Safety Data Sheet (or Safety Data Sheet)', alt: ['material safety data sheet', 'safety data sheet'], type: 'short' },
      { q: 'Why should long hair be tied back in the lab?', a: 'to prevent it from catching fire or getting caught in equipment', alt: ['to prevent it from contacting flames or equipment'], type: 'open' },
      { q: 'What is the proper way to smell a chemical in the lab?', a: 'waft the fumes toward your nose with your hand', alt: ['wafting', 'fan the vapors toward you'], type: 'open' },
      { q: 'What PPE should you wear when handling acids?', a: 'safety goggles, gloves, and a lab coat or apron', alt: ['goggles gloves and lab coat'], type: 'open' },
      { q: 'Where should you dispose of broken glass?', a: 'in a designated broken glass container, not the regular trash', alt: ['in the broken glass container'], type: 'open' },
    ],
  },
  'advanced-instrumentation': {
    questions: [
      { q: 'What does a spectrophotometer measure?', a: 'the amount of light absorbed or transmitted by a solution at specific wavelengths', alt: ['light absorbance or transmittance'], type: 'open' },
      { q: 'What is chromatography used for?', a: 'separating mixtures into their individual components', alt: ['separating components of a mixture'], type: 'open' },
      { q: 'What is a centrifuge used for?', a: 'separating substances of different densities by spinning at high speeds', alt: ['separating substances by density using spinning'], type: 'open' },
      { q: 'What does a pH meter measure?', a: 'the acidity or alkalinity of a solution', alt: ['the pH of a solution'], type: 'short' },
      { q: 'What is an autoclave used for in a lab?', a: 'sterilizing equipment and materials using high-pressure steam', alt: ['sterilizing with high pressure steam'], type: 'open' },
      { q: 'Why is proper instrument calibration critical before use?', a: 'to ensure measurements are accurate and reliable', alt: ['to get accurate results'], type: 'open' },
    ],
  },

  // ── Research Communication ──
  'imrad-structure': {
    questions: [
      { q: 'What does IMRaD stand for?', a: 'Introduction, Methods, Results, and Discussion', alt: ['introduction methods results and discussion'], type: 'open' },
      { q: 'What goes in the Introduction section of a scientific paper?', a: 'background information, the research question, and the purpose or hypothesis', alt: ['background, research question, and hypothesis'], type: 'open' },
      { q: 'What goes in the Methods section?', a: 'a detailed description of how the experiment was conducted so others can replicate it', alt: ['a description of the procedure for replication'], type: 'open' },
      { q: 'What goes in the Results section?', a: 'the data and findings presented objectively without interpretation', alt: ['data and findings without interpretation'], type: 'open' },
      { q: 'What goes in the Discussion section?', a: 'interpretation of results, comparison to other studies, limitations, and conclusions', alt: ['interpretation, comparison, limitations, and conclusions'], type: 'open' },
      { q: 'What is an abstract?', a: 'a brief summary of the entire paper, including purpose, methods, results, and conclusions', alt: ['a summary of the paper'], type: 'open' },
    ],
  },
  'cer-writing': {
    questions: [
      { q: 'What does CER stand for?', a: 'Claim, Evidence, Reasoning', alt: ['claim evidence reasoning'], type: 'short' },
      { q: 'What is a claim in CER?', a: 'a statement that answers the question or addresses the problem', alt: ['an answer to the research question'], type: 'open' },
      { q: 'What counts as evidence in CER?', a: 'specific data or observations that support the claim', alt: ['data supporting the claim'], type: 'open' },
      { q: 'What is the role of reasoning in CER?', a: 'it connects the evidence to the claim using scientific principles', alt: ['it explains why the evidence supports the claim'], type: 'open' },
      { q: 'Why is CER important in science?', a: 'it ensures arguments are logically structured and evidence-based', alt: ['it structures scientific arguments with evidence'], type: 'open' },
      { q: 'Can a claim be valid without evidence?', a: 'no', type: 'short' },
      { q: 'Should reasoning reference scientific concepts or laws?', a: 'yes', type: 'short' },
    ],
  },
  'peer-review-basics': {
    questions: [
      { q: 'What is peer review?', a: 'the process where other experts evaluate a scientific paper before publication', alt: ['expert evaluation of a paper before publication'], type: 'open' },
      { q: 'Why is peer review important?', a: 'it catches errors, validates methodology, and maintains quality in scientific publishing', alt: ['it ensures quality and catches errors'], type: 'open' },
      { q: 'Is a peer-reviewed source more credible than a non-reviewed one?', a: 'yes', type: 'short' },
      { q: 'What should a peer reviewer evaluate?', a: 'methodology, data analysis, conclusions, originality, and clarity', alt: ['methods, analysis, conclusions, and clarity'], type: 'open' },
      { q: 'Does peer review guarantee a paper is correct?', a: 'no', type: 'short' },
      { q: 'What is a conflict of interest in peer review?', a: 'when a reviewer has a personal or financial interest that could bias their evaluation', alt: ['a bias that could affect the review'], type: 'open' },
    ],
  },
  'scientific-presentations': {
    questions: [
      { q: 'What makes an effective scientific poster?', a: 'clear layout, concise text, informative visuals, and logical flow from introduction to conclusion', alt: ['clear visuals, concise text, and logical organization'], type: 'open' },
      { q: 'What should you include when presenting data in a talk?', a: 'clear graphs or tables, labeled axes, a description of what the data shows, and its significance', alt: ['labeled graphs and explanation of significance'], type: 'open' },
      { q: 'Why is it important to anticipate audience questions?', a: 'to prepare thorough answers and demonstrate deep understanding of the research', alt: ['to be prepared and show understanding'], type: 'open' },
      { q: 'What is the purpose of a scientific conference?', a: 'to share research findings, receive feedback, and collaborate with other scientists', alt: ['to share and discuss research'], type: 'open' },
      { q: 'How should you handle a question you cannot answer?', a: 'acknowledge the limitation honestly and suggest how it could be investigated', alt: ['be honest and suggest future investigation'], type: 'open' },
      { q: 'What is the difference between a poster and an oral presentation?', a: 'a poster allows individual viewing and conversation; an oral presentation is delivered to a group in real time', alt: ['posters are self-paced, talks are live'], type: 'open' },
    ],
  },
  'literature-reviews': {
    questions: [
      { q: 'What is a literature review?', a: 'a comprehensive summary and analysis of existing research on a topic', alt: ['a summary of existing research on a topic'], type: 'open' },
      { q: 'Why is a literature review important before starting research?', a: 'it identifies what is already known, gaps in knowledge, and how the new study fits in', alt: ['to know what has been done and find gaps'], type: 'open' },
      { q: 'What is a primary source in scientific literature?', a: 'an original research article reporting new data or findings', alt: ['an original research paper'], type: 'open' },
      { q: 'What is a secondary source?', a: 'a publication that summarizes, reviews, or interprets primary sources', alt: ['a review or summary of original research'], type: 'open' },
      { q: 'What is a citation?', a: 'a reference to the source of information used in a paper', alt: ['a reference to a source'], type: 'short' },
      { q: 'What is plagiarism?', a: 'using someone else\'s work or ideas without proper attribution', alt: ['copying without giving credit'], type: 'open' },
    ],
  },
};

const SCENARIOS = {
  standard: [
    {
      title: 'The Sunscreen Experiment',
      focus: 'experimental design and variables',
      text: 'A student wants to test whether SPF 30 sunscreen is more effective than SPF 15 at blocking UV radiation. Design a complete experiment: state your hypothesis, identify the IV, DV, and controlled variables, describe your control group, and explain how you would measure UV protection. What sample size would you need and why?',
    },
    {
      title: 'The Water Quality Report',
      focus: 'data analysis and communication',
      text: 'You have collected water samples from five locations along a river: upstream of a factory, at the factory discharge point, and three points downstream. You measured pH, dissolved oxygen, and nitrate levels at each. Describe how you would organize, analyze, and present this data. What graphs would you create? What statistical measures would you report? How would you write a CER paragraph about your findings?',
    },
    {
      title: 'The Vaccine Effectiveness Study',
      focus: 'statistical reasoning and experimental design',
      text: 'A news article claims a new flu vaccine is "95% effective" based on a study of 50 people. Critically evaluate this claim: What does "95% effective" likely mean? Is 50 participants enough? What would a well-designed study look like? What statistical information would you need to evaluate the claim (p-value, confidence interval)?',
    },
    {
      title: 'The Ecosystem Model',
      focus: 'scientific modeling',
      text: 'Your class is building a model of a pond ecosystem to predict what would happen if an invasive species were introduced. What type of model would you recommend (physical, mathematical, computational) and why? What variables should the model include? What are the limitations of your chosen model? How would you validate it?',
    },
  ],
  advanced: [
    {
      title: 'The Clinical Trial Design',
      focus: 'advanced experimental design and statistics',
      text: 'You are helping design a clinical trial for a new pain medication. The study must compare the new drug to both a placebo and an existing medication. Describe your experimental design: How would you use randomization and blinding? What is your factorial design? How would you determine sample size? What statistical tests would you use to analyze results? Address potential ethical concerns.',
    },
    {
      title: 'The Climate Data Analysis',
      focus: 'multivariate analysis and modeling',
      text: 'You are given 100 years of data including temperature, CO2 levels, sea level, and ice coverage for a coastal region. Describe a comprehensive analysis plan: What multivariate techniques would you use? How would you build a predictive model? What is the difference between correlation and causation in this context? How would you communicate uncertainty in your predictions? Write an abstract for your analysis.',
    },
    {
      title: 'The Peer Review Challenge',
      focus: 'research communication and critical analysis',
      text: 'You receive a draft paper claiming that a common food additive causes hyperactivity in children. The study used 30 children, no control group, and parents reported behavior changes. Write a peer review: identify methodological flaws, suggest improvements, evaluate the statistical analysis, and recommend whether the paper should be published, revised, or rejected. Use specific scientific reasoning.',
    },
    {
      title: 'The Computational Ecology Model',
      focus: 'computational modeling and validation',
      text: 'A research team built a computational model predicting that a local wolf population will decline 40% in 10 years. Describe how you would evaluate this model: What data would you need for validation? How would you test its sensitivity to different parameters? What are the limitations of computational predictions? How does this model compare to simpler mathematical approaches? Present your evaluation as a scientific memo.',
    },
  ],
};

// ── File I/O ──

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

// ── Helpers ──

function calcMastery(attempts) {
  if (!attempts || !attempts.length) return 0;
  const recent = attempts.slice(-5).filter(a => a.total > 0);
  return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0;
}

function masteryLabel(r) {
  return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started';
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

function resolveSkillKey(input) {
  const key = String(input).toLowerCase().trim().replace(/\s+/g, '-');
  if (CONTENT_BANKS[key]) return key;
  // fuzzy match
  for (const k of Object.keys(CONTENT_BANKS)) {
    if (k.includes(key) || key.includes(k)) return k;
  }
  return key;
}

// ── Exercise Generation ──

function generateExercise(level, skill, count = 5) {
  const resolved = resolveSkillKey(skill);
  const bank = CONTENT_BANKS[resolved];
  if (!bank || !bank.questions) return { error: `No question bank for skill "${skill}" (resolved: "${resolved}")` };
  const items = pick(bank.questions, count).map(q => ({
    prompt: q.q,
    answer: q.a,
    type: q.type || 'short',
    ...(q.alt && { alternates: q.alt }),
    ...(q.hint && { hint: q.hint }),
  }));
  return { type: 'inquiry', skill: resolved, level, count: items.length, instruction: 'Answer each scientific inquiry question.', items };
}

// ── Answer Checking ──

function checkAnswer(type, expected, answer) {
  const normAnswer = norm(answer);
  if (Array.isArray(expected)) return expected.some(e => norm(e) === normAnswer);
  if (norm(expected) === normAnswer) return true;
  // check alternates from content banks
  for (const bank of Object.values(CONTENT_BANKS)) {
    for (const q of bank.questions) {
      if (q.a === expected && q.alt) {
        if (q.alt.some(a => norm(a) === normAnswer)) return true;
      }
    }
  }
  return false;
}

// ── Main Class ──

class Inquiry {
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
      scenario,
      lessonPlan: {
        hook: `Investigation scenario related to: ${target.category} — ${target.skill}`,
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: scenario ? `Apply to investigation: "${scenario.title}"` : 'Design your own investigation',
        reflect: 'How would a scientist approach this differently than a non-scientist?',
      },
    };
  }

  exercise(id, skill) {
    const p = loadProfile(id);
    const level = p.level || 'standard';
    if (skill) return generateExercise(level, skill, 5);
    const n = this.next(id, 1).next;
    return n.length ? generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient at current level!' };
  }

  check(id, type, expected, answer) {
    let exp = expected;
    try { exp = JSON.parse(expected); } catch {}
    return { correct: checkAnswer(type, exp, answer), expected, studentAnswer: answer };
  }

  record(id, level, category, skill, score, total, notes) {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    if (!SKILLS[level][category]) throw new Error(`Unknown category '${category}' for ${level}`);
    if (!SKILLS[level][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${level}/${category}`);
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
    const ls = SKILLS[level] || {};
    const results = {};
    let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(ls)) {
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
    return { studentId: id, level: p.level, progress: this.progress(id), recentAssessments: p.assessments.slice(-20).reverse() };
  }

  next(id, count) {
    count = count || 5;
    const p = loadProfile(id);
    const level = p.level || 'standard';
    const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS[level] || {})) {
      for (const sk of skills) {
        const d = p.skills[`${level}/${cat}/${sk}`];
        const m = d ? d.mastery : 0;
        if (m < MASTERY_THRESHOLD) candidates.push({ level, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' });
      }
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, level, next: candidates.slice(0, count) };
  }

  catalog(level) {
    if (!level) return { levels: Object.keys(SKILLS) };
    const ls = SKILLS[level];
    if (!ls) return { level, error: `Unknown level. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0;
    const cat = {};
    for (const [c, skills] of Object.entries(ls)) { total += skills.length; cat[c] = [...skills]; }
    return { level, skills: cat, totalSkills: total };
  }

  setLevel(id, level) {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    const p = loadProfile(id); p.level = level; saveProfile(p);
    return { studentId: id, level };
  }

  scenario(level) {
    const scenarios = SCENARIOS[level];
    if (!scenarios) return { error: `No scenarios for ${level}. Available: ${Object.keys(SCENARIOS).join(', ')}` };
    return pick(scenarios, 1)[0];
  }

  students() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }
}

// ── CLI Dispatch ──

module.exports = Inquiry;

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new Inquiry();
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
        const [, l] = args;
        out(api.catalog(l || null));
        break;
      }
      case 'set-level': {
        const [, id, l] = args;
        if (!id || !l) throw new Error('Usage: set-level <id> <level>');
        out(api.setLevel(id, l));
        break;
      }
      case 'scenario': {
        const [, l] = args;
        if (!l) throw new Error('Usage: scenario <level>');
        out(api.scenario(l));
        break;
      }
      case 'students': {
        out(api.students());
        break;
      }
      default:
        out({
          usage: 'node inquiry.js <command> [args]',
          commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'set-level', 'scenario', 'students'],
          levels: Object.keys(SKILLS),
        });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
