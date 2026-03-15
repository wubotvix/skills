// eClaw MS Math Statistics & Probability Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-math-statistics-probability');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'statistical-questions': ['recognizing-statistical-questions', 'data-collection-methods'],
    'measures-of-center': ['mean', 'median', 'mode'],
    'measures-of-spread': ['range', 'interquartile-range', 'mean-absolute-deviation'],
    'data-displays': ['dot-plots', 'histograms', 'box-plots'],
  },
  'grade-7': {
    'sampling': ['random-sampling', 'representative-samples', 'comparative-inferences'],
    'probability-basics': ['probability-scale', 'experimental-vs-theoretical', 'probability-models'],
    'compound-events': ['sample-spaces', 'tree-diagrams', 'compound-probability'],
  },
  'grade-8': {
    'scatter-plots': ['constructing-scatter-plots', 'patterns-of-association', 'line-of-best-fit'],
    'linear-models': ['interpreting-slope-intercept', 'using-linear-models', 'residuals'],
    'two-way-tables': ['constructing-two-way-tables', 'relative-frequency', 'associations-in-data'],
  },
};

const PROBLEM_BANKS = {
  'grade-6': {
    'recognizing-statistical-questions': {
      problems: [
        { prompt: 'Is this a statistical question? "How old am I?"', answer: 'no', hint: 'Only one answer, no variability' },
        { prompt: 'Is this a statistical question? "How old are the students in my class?"', answer: 'yes', hint: 'Answers vary from student to student' },
        { prompt: 'Is this a statistical question? "What is the capital of France?"', answer: 'no', hint: 'Single definite answer' },
        { prompt: 'Is this a statistical question? "How many hours per week do 7th graders spend on homework?"', answer: 'yes', hint: 'Varies from student to student' },
        { prompt: 'Write a statistical question about favorite foods.', answer: 'What are the favorite foods of students in our school?', hint: 'Must expect variability in answers' },
        { prompt: 'Is this a statistical question? "How tall is the Statue of Liberty?"', answer: 'no' },
        { prompt: 'Is this a statistical question? "How many pets do families in our town have?"', answer: 'yes' },
        { prompt: 'What makes a question "statistical"?', answer: 'it anticipates variability in the data', hint: 'Different people/things give different answers' },
      ],
    },
    'data-collection-methods': {
      problems: [
        { prompt: 'What is a survey?', answer: 'a method of collecting data by asking people questions', hint: 'Questionnaires, interviews, polls' },
        { prompt: 'What is an observation study?', answer: 'collecting data by watching and recording without interfering', hint: 'No manipulation of variables' },
        { prompt: 'What is bias in data collection?', answer: 'a systematic error that makes results unrepresentative', hint: 'Results do not reflect the true population' },
        { prompt: 'A school surveys only honor roll students about homework. Is this biased?', answer: 'yes', hint: 'Not representative of all students' },
        { prompt: 'What is a census?', answer: 'collecting data from every member of a population', hint: 'Everyone is included' },
        { prompt: 'Why is random sampling important?', answer: 'it reduces bias and makes results more representative', hint: 'Every member has an equal chance of being selected' },
      ],
    },
    'mean': {
      problems: [
        { prompt: 'Find the mean: 4, 8, 6, 10, 2', answer: '6', numeric: 6, hint: 'Sum = 30, count = 5' },
        { prompt: 'Find the mean: 12, 15, 18, 21, 24', answer: '18', numeric: 18 },
        { prompt: 'The mean of 5 numbers is 20. What is their sum?', answer: '100', numeric: 100 },
        { prompt: 'Scores: 85, 90, 78, 92, 95. What is the mean?', answer: '88', numeric: 88 },
        { prompt: 'Find the mean: 3, 7, 7, 10, 13', answer: '8', numeric: 8 },
        { prompt: 'The mean of 4, 6, 8, and x is 7. What is x?', answer: '10', numeric: 10, hint: '4+6+8+x = 28' },
        { prompt: 'Find the mean of 100, 200, 300', answer: '200', numeric: 200 },
        { prompt: 'How does an outlier affect the mean?', answer: 'it pulls the mean toward the outlier value', hint: 'Outliers have a big effect on the mean' },
      ],
    },
    'median': {
      problems: [
        { prompt: 'Find the median: 3, 7, 9, 12, 15', answer: '9', numeric: 9, hint: 'Middle value when sorted' },
        { prompt: 'Find the median: 4, 8, 1, 6, 3, 10', answer: '5', numeric: 5, hint: 'Sorted: 1,3,4,6,8,10. Average of 4 and 6' },
        { prompt: 'Find the median: 22, 18, 30, 25, 15, 28, 20', answer: '22', numeric: 22 },
        { prompt: 'Find the median: 5, 5, 5, 10, 15, 20', answer: '7.5', numeric: 7.5 },
        { prompt: 'The median is less affected by outliers than the mean. True or false?', answer: 'true' },
        { prompt: 'Find the median: 100, 2, 3, 4, 5', answer: '4', numeric: 4 },
        { prompt: 'Find the median: 11, 13, 15, 17', answer: '14', numeric: 14 },
        { prompt: 'When is the median a better measure of center than the mean?', answer: 'when the data has outliers or is skewed' },
      ],
    },
    'mode': {
      problems: [
        { prompt: 'Find the mode: 3, 5, 5, 7, 8, 5, 9', answer: '5', numeric: 5 },
        { prompt: 'Find the mode: 2, 4, 6, 8', answer: 'no mode', hint: 'All values appear once' },
        { prompt: 'Find the mode: 1, 2, 2, 3, 3, 4', answer: '2 and 3', hint: 'Bimodal' },
        { prompt: 'Find the mode: red, blue, red, green, red, blue', answer: 'red' },
        { prompt: 'Can the mode be used with non-numeric data?', answer: 'yes', hint: 'Mode works with categories too' },
        { prompt: 'Find the mode: 10, 20, 30, 20, 10, 20', answer: '20', numeric: 20 },
      ],
    },
    'range': {
      problems: [
        { prompt: 'Find the range: 3, 7, 12, 5, 20', answer: '17', numeric: 17, hint: '20 - 3' },
        { prompt: 'Find the range: -5, 3, 8, -2, 10', answer: '15', numeric: 15, hint: '10 - (-5)' },
        { prompt: 'Scores: 65, 78, 82, 91, 100. What is the range?', answer: '35', numeric: 35 },
        { prompt: 'Data: 50, 50, 50, 50. What is the range?', answer: '0', numeric: 0 },
        { prompt: 'Find the range: 2.5, 3.1, 1.8, 4.2, 3.7', answer: '2.4', numeric: 2.4 },
        { prompt: 'Does the range tell you about most of the data or just the extremes?', answer: 'just the extremes' },
      ],
    },
    'interquartile-range': {
      problems: [
        { prompt: 'Data: 2, 4, 5, 7, 8, 10, 12. Find Q1.', answer: '4', numeric: 4, hint: 'Median of lower half' },
        { prompt: 'Data: 2, 4, 5, 7, 8, 10, 12. Find Q3.', answer: '10', numeric: 10, hint: 'Median of upper half' },
        { prompt: 'Data: 2, 4, 5, 7, 8, 10, 12. Find the IQR.', answer: '6', numeric: 6, hint: 'Q3 - Q1 = 10 - 4' },
        { prompt: 'Data: 1, 3, 5, 7, 9, 11, 13, 15. What is the IQR?', answer: '8', numeric: 8, hint: 'Q1=4, Q3=12' },
        { prompt: 'What does the IQR measure?', answer: 'the spread of the middle 50% of the data' },
        { prompt: 'Is the IQR affected by outliers?', answer: 'no', hint: 'It only uses the middle 50%' },
      ],
    },
    'mean-absolute-deviation': {
      problems: [
        { prompt: 'Data: 2, 4, 6, 8, 10. Mean = 6. Find the MAD.', answer: '2.4', numeric: 2.4, hint: 'Deviations: 4,2,0,2,4. Sum=12, MAD=12/5' },
        { prompt: 'What does MAD stand for?', answer: 'mean absolute deviation' },
        { prompt: 'What does a small MAD indicate?', answer: 'data values are close to the mean', hint: 'Low variability' },
        { prompt: 'Data: 5, 5, 5, 5, 5. What is the MAD?', answer: '0', numeric: 0, hint: 'No deviation from mean' },
        { prompt: 'Data: 10, 20, 30. Mean = 20. Find the MAD.', answer: '6.67', numeric: 6.67, hint: 'Deviations: 10,0,10. Sum=20, MAD=20/3' },
        { prompt: 'Why do we use absolute values when computing MAD?', answer: 'so negative and positive deviations do not cancel out' },
      ],
    },
    'dot-plots': {
      problems: [
        { prompt: 'A dot plot shows: 2(x3), 3(x5), 4(x2), 5(x1). What is the mode?', answer: '3', numeric: 3 },
        { prompt: 'What does each dot represent in a dot plot?', answer: 'one data value', hint: 'Each observation is a dot' },
        { prompt: 'A dot plot of test scores clusters around 85. What does this suggest?', answer: 'most students scored near 85' },
        { prompt: 'When is a dot plot most useful?', answer: 'for small to moderate data sets to show individual values' },
        { prompt: 'A dot plot shows a gap between 5 and 10. What might this indicate?', answer: 'no data values between 5 and 10' },
        { prompt: 'Can you find the median from a dot plot?', answer: 'yes', hint: 'Count dots from left to middle' },
      ],
    },
    'histograms': {
      problems: [
        { prompt: 'How is a histogram different from a bar graph?', answer: 'histograms show continuous data in intervals with no gaps; bar graphs show categories', hint: 'Bars touch in histograms' },
        { prompt: 'A histogram has these bars: 0-10(4), 10-20(8), 20-30(6), 30-40(2). How many data values total?', answer: '20', numeric: 20 },
        { prompt: 'In a histogram, what does the height of a bar represent?', answer: 'the frequency (count) of data values in that interval' },
        { prompt: 'A histogram is skewed right. Where is the tail?', answer: 'on the right side', hint: 'Tail extends to higher values' },
        { prompt: 'Can you find the exact median from a histogram?', answer: 'no', hint: 'You only know the interval, not exact values' },
        { prompt: 'A histogram shows most data in the 60-80 range with few values above 90. Describe the shape.', answer: 'skewed right', hint: 'Tail on the right' },
      ],
    },
    'box-plots': {
      problems: [
        { prompt: 'What five values make up a box plot?', answer: 'minimum, Q1, median, Q3, maximum', hint: 'The five-number summary' },
        { prompt: 'In a box plot, what does the box represent?', answer: 'the middle 50% of the data (IQR)', hint: 'From Q1 to Q3' },
        { prompt: 'A box plot has min=10, Q1=20, median=30, Q3=45, max=60. What is the IQR?', answer: '25', numeric: 25 },
        { prompt: 'The whiskers of a box plot extend to what values?', answer: 'the minimum and maximum', hint: 'The extreme values' },
        { prompt: 'If the median line is closer to Q1, is the data skewed left or right?', answer: 'right', hint: 'More spread on the right side of the median' },
        { prompt: 'Can you determine the mean from a box plot?', answer: 'no', hint: 'Box plots show medians and quartiles, not means' },
      ],
    },
  },
  'grade-7': {
    'random-sampling': {
      problems: [
        { prompt: 'What is a random sample?', answer: 'a sample where every member of the population has an equal chance of being selected' },
        { prompt: 'A school wants to survey student opinions. They ask every 10th student entering the building. What type of sampling is this?', answer: 'systematic', hint: 'Regular intervals' },
        { prompt: 'Why might a convenience sample be biased?', answer: 'it only includes easily accessible people, who may not represent the whole population' },
        { prompt: 'A random sample of 100 from a town of 5,000 finds 60% prefer pizza. About how many townspeople prefer pizza?', answer: '3000', numeric: 3000 },
        { prompt: 'Which produces more reliable results: a random sample of 200 or a convenience sample of 500?', answer: 'random sample of 200', hint: 'Random sampling reduces bias' },
        { prompt: 'What does "representative" mean for a sample?', answer: 'the sample mirrors the characteristics of the whole population' },
      ],
    },
    'representative-samples': {
      problems: [
        { prompt: 'A phone survey only reaches people with landlines. Is this representative of all adults?', answer: 'no', hint: 'Many people only have cell phones' },
        { prompt: 'How can you make a sample more representative?', answer: 'use random selection and ensure the sample is large enough' },
        { prompt: 'A school surveys only the chess club about after-school activities. Is this representative?', answer: 'no', hint: 'Chess club members may have different preferences' },
        { prompt: 'What is sampling variability?', answer: 'different random samples from the same population will give slightly different results' },
        { prompt: 'As sample size increases, what happens to sampling variability?', answer: 'it decreases', hint: 'Larger samples are more stable' },
        { prompt: 'A survey of 50 students in one class vs. 50 random students from the whole school. Which is more representative?', answer: '50 random students from the whole school' },
      ],
    },
    'comparative-inferences': {
      problems: [
        { prompt: 'Class A median score: 78. Class B median score: 85. What can you infer?', answer: 'Class B typically scored higher than Class A' },
        { prompt: 'Two groups have the same median but Group X has a larger IQR. What does this mean?', answer: 'Group X has more variability in scores' },
        { prompt: 'If two box plots overlap significantly, can you say one group is clearly better?', answer: 'no', hint: 'Significant overlap means the groups are similar' },
        { prompt: 'Group A: mean=72, MAD=3. Group B: mean=78, MAD=8. Which group is more consistent?', answer: 'Group A', hint: 'Smaller MAD = more consistent' },
        { prompt: 'The difference in medians is 10 and both IQRs are about 5. Is the difference meaningful?', answer: 'yes', hint: 'Difference is about 2 IQRs, which is significant' },
        { prompt: 'What visual display is best for comparing two data sets?', answer: 'side-by-side box plots', hint: 'Easy to compare center and spread' },
      ],
    },
    'probability-scale': {
      problems: [
        { prompt: 'Probability ranges from ___ to ___.', answer: '0 to 1' },
        { prompt: 'A probability of 0 means the event is ___?', answer: 'impossible' },
        { prompt: 'A probability of 1 means the event is ___?', answer: 'certain' },
        { prompt: 'What is the probability of flipping heads on a fair coin?', answer: '0.5', numeric: 0.5 },
        { prompt: 'An event has probability 0.75. Is it likely or unlikely?', answer: 'likely' },
        { prompt: 'If P(rain) = 0.3, what is P(no rain)?', answer: '0.7', numeric: 0.7, hint: 'Complement: 1 - 0.3' },
        { prompt: 'A probability of 0.01 means the event is ___?', answer: 'very unlikely' },
        { prompt: 'Can a probability be negative?', answer: 'no' },
      ],
    },
    'experimental-vs-theoretical': {
      problems: [
        { prompt: 'You flip a coin 100 times and get 53 heads. What is the experimental probability of heads?', answer: '0.53', numeric: 0.53 },
        { prompt: 'What is the theoretical probability of rolling a 3 on a fair die?', answer: '1/6' },
        { prompt: 'As you increase the number of trials, experimental probability gets closer to ___?', answer: 'theoretical probability', hint: 'Law of Large Numbers' },
        { prompt: 'A spinner has 4 equal sections: red, blue, green, yellow. What is P(blue)?', answer: '0.25', numeric: 0.25 },
        { prompt: 'You draw a card from a deck 50 times (with replacement) and get 15 hearts. Experimental P(heart)?', answer: '0.3', numeric: 0.3, hint: '15/50' },
        { prompt: 'Theoretical P(heads) = 0.5. You flip 10 times and get 7 heads. Is this unusual?', answer: 'not very unusual', hint: 'Small sample sizes can vary a lot' },
      ],
    },
    'probability-models': {
      problems: [
        { prompt: 'A bag has 3 red and 7 blue marbles. What is P(red)?', answer: '0.3', numeric: 0.3, hint: '3/10' },
        { prompt: 'A bag has 5 red, 3 blue, 2 green marbles. What is P(not green)?', answer: '0.8', numeric: 0.8, hint: '8/10' },
        { prompt: 'Two events are complementary. P(A) = 0.35. What is P(not A)?', answer: '0.65', numeric: 0.65 },
        { prompt: 'A spinner has sections: 1/4 red, 1/3 blue, rest yellow. What fraction is yellow?', answer: '5/12', hint: '1 - 1/4 - 1/3 = 1 - 3/12 - 4/12 = 5/12' },
        { prompt: 'Is a model where each outcome is equally likely called uniform or non-uniform?', answer: 'uniform' },
        { prompt: 'A die is loaded so P(6) = 0.4. Is this a uniform probability model?', answer: 'no' },
      ],
    },
    'sample-spaces': {
      problems: [
        { prompt: 'List the sample space for flipping two coins.', answer: 'HH, HT, TH, TT', hint: '4 outcomes' },
        { prompt: 'How many outcomes when rolling two dice?', answer: '36', numeric: 36, hint: '6 x 6' },
        { prompt: 'How many outcomes when flipping a coin and rolling a die?', answer: '12', numeric: 12, hint: '2 x 6' },
        { prompt: 'A menu has 3 entrees and 4 desserts. How many meal combinations?', answer: '12', numeric: 12 },
        { prompt: 'You pick one letter from {A, B, C} and one number from {1, 2}. How many outcomes?', answer: '6', numeric: 6 },
        { prompt: 'What is the Fundamental Counting Principle?', answer: 'multiply the number of options at each stage to find total outcomes' },
      ],
    },
    'tree-diagrams': {
      problems: [
        { prompt: 'A tree diagram for flipping 3 coins has how many final branches?', answer: '8', numeric: 8, hint: '2 x 2 x 2' },
        { prompt: 'A tree diagram shows: ice cream (2 flavors) x topping (3 options). How many total outcomes?', answer: '6', numeric: 6 },
        { prompt: 'What is the purpose of a tree diagram?', answer: 'to organize and count all possible outcomes of multiple events' },
        { prompt: 'Outfit choices: 3 shirts, 2 pants, 2 shoes. How many outfits? (Use tree diagram thinking)', answer: '12', numeric: 12 },
        { prompt: 'A tree diagram for rolling a die then flipping a coin has how many end points?', answer: '12', numeric: 12 },
        { prompt: 'Can tree diagrams help find probabilities?', answer: 'yes', hint: 'Multiply along branches, add across desired outcomes' },
      ],
    },
    'compound-probability': {
      problems: [
        { prompt: 'P(heads) = 0.5 and P(rolling 6) = 1/6. What is P(heads AND rolling 6) if independent?', answer: '1/12', hint: '0.5 x 1/6' },
        { prompt: 'A bag has 4 red and 6 blue. You draw two with replacement. P(both red)?', answer: '4/25', hint: '4/10 x 4/10 = 16/100' },
        { prompt: 'A bag has 4 red and 6 blue. You draw two WITHOUT replacement. P(both red)?', answer: '2/15', hint: '4/10 x 3/9 = 12/90' },
        { prompt: 'P(rain Monday) = 0.3, P(rain Tuesday) = 0.4. If independent, P(rain both days)?', answer: '0.12', numeric: 0.12 },
        { prompt: 'Two spinners: one has {1,2,3}, the other {A,B}. P(2 and B)?', answer: '1/6', hint: '1/3 x 1/2' },
        { prompt: 'What does it mean for two events to be independent?', answer: 'the outcome of one event does not affect the probability of the other' },
      ],
    },
  },
  'grade-8': {
    'constructing-scatter-plots': {
      problems: [
        { prompt: 'What goes on the x-axis of a scatter plot?', answer: 'the independent (explanatory) variable' },
        { prompt: 'What goes on the y-axis of a scatter plot?', answer: 'the dependent (response) variable' },
        { prompt: 'Data: (1,2), (2,4), (3,5), (4,8), (5,9). Does this show positive or negative association?', answer: 'positive' },
        { prompt: 'Data: (1,10), (2,8), (3,7), (4,3), (5,2). Positive, negative, or no association?', answer: 'negative' },
        { prompt: 'A scatter plot shows no pattern. What type of association?', answer: 'no association' },
        { prompt: 'What is the difference between correlation and causation?', answer: 'correlation means two variables move together; causation means one actually causes the other' },
      ],
    },
    'patterns-of-association': {
      problems: [
        { prompt: 'Study hours vs. test scores shows a positive linear pattern. What does this mean?', answer: 'more study hours is associated with higher test scores' },
        { prompt: 'A scatter plot looks curved, not straight. Is the association linear or nonlinear?', answer: 'nonlinear' },
        { prompt: 'Temperature vs. hot chocolate sales shows a negative association. Explain.', answer: 'as temperature increases, hot chocolate sales decrease' },
        { prompt: 'A point far from the overall pattern is called a(n) ___?', answer: 'outlier' },
        { prompt: 'Shoe size vs. IQ shows no association. What does the scatter plot look like?', answer: 'randomly scattered with no clear pattern' },
        { prompt: 'A cluster in a scatter plot indicates what?', answer: 'a group of data points with similar values' },
      ],
    },
    'line-of-best-fit': {
      problems: [
        { prompt: 'What is a line of best fit?', answer: 'a straight line that best represents the trend in a scatter plot' },
        { prompt: 'A line of best fit should have roughly equal numbers of points ___ and ___ the line.', answer: 'above and below' },
        { prompt: 'Line of best fit: y = 2x + 10. Predict y when x = 20.', answer: '50', numeric: 50 },
        { prompt: 'Is it appropriate to use a line of best fit if the scatter plot shows a curved pattern?', answer: 'no', hint: 'Linear model only works for linear patterns' },
        { prompt: 'Using a line of best fit to predict beyond the data range is called ___?', answer: 'extrapolation' },
        { prompt: 'Using a line of best fit to predict within the data range is called ___?', answer: 'interpolation' },
      ],
    },
    'interpreting-slope-intercept': {
      problems: [
        { prompt: 'In y = 3x + 50, if x is weeks and y is savings in dollars, what does the slope mean?', answer: 'savings increase by $3 per week' },
        { prompt: 'In y = 3x + 50, what does the y-intercept (50) mean?', answer: 'the starting savings is $50' },
        { prompt: 'A line of best fit: y = -2x + 100. What does the negative slope indicate?', answer: 'y decreases as x increases' },
        { prompt: 'Height (cm) = 5 x age + 50. What is the predicted height at age 10?', answer: '100', numeric: 100 },
        { prompt: 'A model shows y = 0.8x + 15. What is the rate of change?', answer: '0.8', numeric: 0.8 },
        { prompt: 'In context, the y-intercept often represents what?', answer: 'the initial or starting value' },
      ],
    },
    'using-linear-models': {
      problems: [
        { prompt: 'Model: y = 4x + 20. Find y when x = 8.', answer: '52', numeric: 52 },
        { prompt: 'Model: y = -1.5x + 30. When does y = 0?', answer: '20', numeric: 20, hint: '0 = -1.5x + 30' },
        { prompt: 'A model predicts y = 45 when x = 10. The actual value is 48. What is the residual?', answer: '3', numeric: 3, hint: 'Actual - Predicted' },
        { prompt: 'If a model gives a negative prediction for a real-world quantity that cannot be negative, what does this suggest?', answer: 'the model is not valid for that input value' },
        { prompt: 'Model: Cost = 25 + 3n where n is number of items. What is the cost for 15 items?', answer: '70', numeric: 70 },
        { prompt: 'Two models predict different values. How do you decide which is better?', answer: 'compare residuals; the model with smaller residuals is better' },
      ],
    },
    'residuals': {
      problems: [
        { prompt: 'Predicted: 80, Actual: 85. What is the residual?', answer: '5', numeric: 5, hint: 'Actual - Predicted' },
        { prompt: 'A positive residual means the model ___ the actual value.', answer: 'underestimated', hint: 'Actual > Predicted' },
        { prompt: 'A negative residual means the model ___ the actual value.', answer: 'overestimated', hint: 'Actual < Predicted' },
        { prompt: 'If residuals show a pattern (not random), what does this suggest?', answer: 'the linear model may not be appropriate' },
        { prompt: 'Predicted: 50, Actual: 47. What is the residual?', answer: '-3', numeric: -3 },
        { prompt: 'What should a residual plot look like for a good linear model?', answer: 'randomly scattered around zero with no pattern' },
      ],
    },
    'constructing-two-way-tables': {
      problems: [
        { prompt: 'A survey asks 100 students about sport (soccer/basketball) and grade (6/7). What goes in rows and columns?', answer: 'one variable in rows, the other in columns' },
        { prompt: 'In a two-way table, what do the values inside the cells represent?', answer: 'the count (frequency) of observations in that combination' },
        { prompt: 'What is a marginal frequency?', answer: 'the total for a row or column' },
        { prompt: 'What is a joint frequency?', answer: 'the frequency in a specific cell of the table' },
        { prompt: 'A two-way table has 3 rows and 4 columns. How many cells?', answer: '12', numeric: 12 },
        { prompt: 'Where do you find marginal frequencies in a two-way table?', answer: 'in the totals row and totals column', hint: 'The margins/edges' },
      ],
    },
    'relative-frequency': {
      problems: [
        { prompt: 'A cell has 20 out of 100 total. What is the relative frequency?', answer: '0.20', numeric: 0.20 },
        { prompt: 'A row total is 40 out of 100 total. A cell in that row is 15. What is the row relative frequency?', answer: '0.375', numeric: 0.375, hint: '15/40' },
        { prompt: 'What is the difference between joint and marginal relative frequency?', answer: 'joint is cell/total; marginal is row or column total/total' },
        { prompt: 'All relative frequencies in a table should sum to ___?', answer: '1', numeric: 1 },
        { prompt: 'Why use relative frequency instead of raw counts?', answer: 'to compare groups of different sizes fairly' },
        { prompt: 'A row relative frequency of 0.60 for "likes pizza" among 7th graders means what?', answer: '60% of 7th graders like pizza' },
      ],
    },
    'associations-in-data': {
      problems: [
        { prompt: 'In a two-way table, how do you check if two variables are associated?', answer: 'compare the row (or column) relative frequencies; if they differ, there may be an association' },
        { prompt: 'If the row relative frequencies are the same across all rows, is there an association?', answer: 'no', hint: 'Same proportions = no association' },
        { prompt: 'A table shows 80% of athletes eat breakfast vs. 50% of non-athletes. Is there an association?', answer: 'yes', hint: 'Different proportions suggest association' },
        { prompt: 'What does "no association" mean in a two-way table?', answer: 'the distribution of one variable is the same regardless of the other variable' },
        { prompt: 'Can a two-way table prove causation?', answer: 'no', hint: 'It shows association, not causation' },
        { prompt: 'A study finds an association between exercise and grades. What could explain this besides exercise causing better grades?', answer: 'a third variable like discipline or health', hint: 'Confounding variables' },
      ],
    },
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

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9./× ^()-]/g, '').replace(/\s+/g, ' '); }

// Exercise generation

function generateExercise(grade, skill, count = 5) {
  const bank = PROBLEM_BANKS[grade]?.[skill];
  if (!bank) return { error: `No problem bank for ${grade}/${skill}` };
  const items = pick(bank.problems, count).map(p => ({
    prompt: p.prompt,
    answer: p.answer,
    ...(p.hint && { hint: p.hint }),
  }));
  return { type: 'statistics-probability', skill, grade, count: items.length, instruction: 'Solve each problem. Show your work.', items };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  const ne = norm(expected);
  const na = norm(answer);
  if (ne === na) return true;
  const numE = parseFloat(expected);
  const numA = parseFloat(answer);
  if (!isNaN(numE) && !isNaN(numA) && Math.abs(numE - numA) < 0.01) return true;
  if (ne.replace(/\s/g, '') === na.replace(/\s/g, '')) return true;
  return false;
}

// Public API

class StatisticsProbability {
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

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-6';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    return {
      studentId: id, grade, targetSkill: target, exercise,
      lessonPlan: {
        review: 'Review previously learned statistics concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Connect to real-world data context (sports, surveys, science)',
      },
    };
  }
}

module.exports = StatisticsProbability;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new StatisticsProbability();
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
        else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(api.checkAnswer(type, expected, answer));
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
      default: out({ usage: 'node statistics-probability.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
