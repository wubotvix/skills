// eClaw HS Math Statistics & Probability Tutor (Grades 9-12). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-math-statistics');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'descriptive': {
    'center': ['mean', 'median', 'mode', 'weighted-mean', 'trimmed-mean'],
    'spread': ['range', 'iqr', 'variance', 'standard-deviation', 'coefficient-of-variation'],
    'shape': ['skewness', 'modality', 'outlier-detection', 'normal-shape', 'transformations'],
    'displays': ['histogram', 'boxplot', 'stemplot', 'dotplot', 'scatterplot'],
    'comparing': ['side-by-side-boxplots', 'back-to-back-stemplots', 'comparing-distributions', 'z-scores', 'percentiles'],
  },
  'probability': {
    'sample-spaces': ['listing-outcomes', 'tree-diagrams', 'two-way-tables', 'venn-diagrams', 'sample-space-size'],
    'basic-rules': ['complement-rule', 'addition-rule', 'multiplication-rule', 'conditional-probability', 'independence'],
    'counting': ['permutations', 'combinations', 'with-replacement', 'without-replacement', 'multinomial'],
    'distributions': ['binomial', 'geometric', 'expected-value', 'standard-deviation-discrete', 'normal-distribution'],
    'normal': ['z-scores-normal', 'standard-normal-table', 'normal-calculations', 'empirical-rule', 'normal-assessment'],
  },
  'inference': {
    'sampling': ['sampling-methods', 'bias', 'sampling-distribution', 'central-limit-theorem', 'standard-error'],
    'confidence': ['confidence-interval-concept', 'ci-for-proportion', 'ci-for-mean', 'margin-of-error', 'sample-size-determination'],
    'hypothesis': ['null-alternative', 'test-statistic', 'p-value', 'significance-level', 'type-i-type-ii-errors'],
    'chi-square': ['goodness-of-fit', 'test-of-independence', 'expected-counts', 'chi-square-statistic', 'degrees-of-freedom'],
    'regression': ['least-squares', 'correlation', 'r-squared', 'residual-analysis', 'inference-for-slope'],
  },
};

const PROBLEM_BANKS = {
  'descriptive': {
    'mean': {
      problems: [
        { prompt: 'Find the mean of: 12, 15, 18, 22, 23', answer: '18', hint: 'Sum = 90, n = 5, mean = 90/5.' },
        { prompt: 'Find the mean of: 3, 7, 7, 9, 14', answer: '8', hint: 'Sum = 40, n = 5.' },
        { prompt: 'Test scores: 85, 90, 78, 92, 88. Find the mean.', answer: '86.6', hint: 'Sum = 433, mean = 433/5 = 86.6.' },
        { prompt: 'If the mean of 5 numbers is 20, what is their sum?', answer: '100', hint: 'Sum = mean × n = 20 × 5.' },
        { prompt: 'Data: 4, 8, 6, 10, 7. One more value makes mean = 7. Find it.', answer: '7', hint: 'Current sum = 35. Need sum = 42. Value = 7.' },
        { prompt: 'Heights (in): 62, 65, 68, 71, 74. Mean?', answer: '68', hint: 'Sum = 340, n = 5.' },
      ],
    },
    'median': {
      problems: [
        { prompt: 'Find the median of: 3, 8, 1, 7, 5', answer: '5', hint: 'Sorted: 1, 3, 5, 7, 8. Middle value.' },
        { prompt: 'Find the median of: 12, 4, 8, 15, 6, 10', answer: '9', hint: 'Sorted: 4, 6, 8, 10, 12, 15. Average of 8 and 10.' },
        { prompt: 'Data: 100, 2, 3, 4, 5. Find mean and median. Which better represents the data?', answer: 'mean=22.8, median=4; median better', hint: '100 is an outlier that pulls the mean up.' },
        { prompt: 'Find the median of: 5, 5, 5, 5, 5', answer: '5', hint: 'All values are the same.' },
        { prompt: 'Salaries: $30k, $35k, $40k, $45k, $200k. Median?', answer: '40000', hint: 'Middle value of sorted data.' },
      ],
    },
    'mode': {
      problems: [
        { prompt: 'Find the mode of: 2, 3, 3, 5, 7, 7, 7, 8', answer: '7', hint: '7 appears 3 times (most frequent).' },
        { prompt: 'Find the mode of: 1, 2, 3, 4, 5', answer: 'no mode', hint: 'All values appear once.' },
        { prompt: 'Find the mode(s) of: 1, 1, 2, 2, 3', answer: '1 and 2 (bimodal)', hint: 'Both 1 and 2 appear twice.' },
        { prompt: 'Shoe sizes sold: 8, 9, 9, 10, 10, 10, 11, 11. Mode?', answer: '10', hint: 'Size 10 sold most often (3 times).' },
        { prompt: 'For which type of data is mode most useful?', answer: 'categorical/nominal data', hint: 'Mean and median require numerical values.' },
      ],
    },
    'weighted-mean': {
      problems: [
        { prompt: 'Grades: HW (20%) = 90, Tests (50%) = 80, Final (30%) = 75. Weighted mean?', answer: '80.5', hint: '0.2(90) + 0.5(80) + 0.3(75) = 18 + 40 + 22.5.' },
        { prompt: 'Three classes: 30 students avg 85, 20 students avg 90, 10 students avg 78. Overall mean?', answer: '85.8', hint: '(30×85 + 20×90 + 10×78)/60.' },
        { prompt: 'GPA: A(4)×3cr, B(3)×4cr, A(4)×2cr. Calculate GPA.', answer: '3.56', hint: '(4×3 + 3×4 + 4×2)/(3+4+2) = 32/9.' },
        { prompt: 'Stock portfolio: $5000 at 8%, $3000 at 5%, $2000 at 12%. Weighted return?', answer: '7.9%', hint: '(5000×8 + 3000×5 + 2000×12)/10000.' },
        { prompt: 'Why is weighted mean different from regular mean?', answer: 'different items contribute different amounts based on their importance/frequency', hint: 'Weights reflect relative importance.' },
      ],
    },
    'trimmed-mean': {
      problems: [
        { prompt: 'Data: 1, 5, 6, 7, 8, 9, 50. Find 10% trimmed mean.', answer: '7', hint: 'Remove top and bottom 10% (1 value each): 5,6,7,8,9. Mean = 7.' },
        { prompt: 'Why use a trimmed mean instead of the regular mean?', answer: 'to reduce the influence of outliers', hint: 'Trimming removes extreme values.' },
        { prompt: 'Data: 2, 3, 4, 5, 6, 7, 8, 9, 10, 100. Find 20% trimmed mean.', answer: '6.5', hint: 'Remove 2 from each end: 4,5,6,7,8,9. Mean = 39/6.' },
        { prompt: 'Which is more resistant to outliers: mean, median, or trimmed mean?', answer: 'median (most resistant), then trimmed mean, then mean (least)', hint: 'Median ignores all but the middle value(s).' },
        { prompt: 'Data: 10, 12, 13, 14, 15, 16, 18. What % trim removes 10 and 18?', answer: 'about 14% (1/7 from each side)', hint: 'Removing 1 of 7 from each side.' },
      ],
    },
    'range': {
      problems: [
        { prompt: 'Find the range of: 3, 7, 12, 15, 21', answer: '18', hint: 'Range = max - min = 21 - 3.' },
        { prompt: 'Temperatures: 45, 52, 48, 61, 55, 43. Range?', answer: '18', hint: '61 - 43 = 18.' },
        { prompt: 'Data A: range 5. Data B: range 20. Which is more spread out?', answer: 'Data B', hint: 'Larger range = more spread.' },
        { prompt: 'Why is range sensitive to outliers?', answer: 'it only uses the two most extreme values', hint: 'One outlier can dramatically change the range.' },
        { prompt: 'Data: 10, 10, 10, 10, 10. Range?', answer: '0', hint: 'All values are the same.' },
      ],
    },
    'iqr': {
      problems: [
        { prompt: 'Data: 2, 4, 6, 8, 10, 12, 14. Find Q1, Q3, and IQR.', answer: 'Q1=4, Q3=12, IQR=8', hint: 'Q1 = median of lower half, Q3 = median of upper half.' },
        { prompt: 'Data: 1, 3, 5, 7, 9, 11. Find IQR.', answer: '6', hint: 'Q1=3, Q3=9, IQR=6.' },
        { prompt: 'Using the 1.5×IQR rule, are any values outliers in: 1, 2, 3, 4, 5, 6, 20?', answer: 'yes, 20', hint: 'Q1=2, Q3=6, IQR=4. Upper fence = 6+6=12. 20 > 12.' },
        { prompt: 'Why is IQR preferred over range?', answer: 'IQR is resistant to outliers since it uses middle 50%', hint: 'Range uses extremes; IQR uses quartiles.' },
        { prompt: 'Data: 5, 5, 5, 5, 5, 5, 5. IQR?', answer: '0', hint: 'All values equal, so Q1 = Q3.' },
      ],
    },
    'variance': {
      problems: [
        { prompt: 'Find the population variance of: 2, 4, 6, 8, 10. (Mean = 6)', answer: '8', hint: 'Σ(x-mean)^2/n = (16+4+0+4+16)/5.' },
        { prompt: 'Find the sample variance of: 3, 5, 7. (Mean = 5)', answer: '4', hint: 'Σ(x-mean)^2/(n-1) = (4+0+4)/2.' },
        { prompt: 'Why do we divide by n-1 for sample variance?', answer: 'Bessel\'s correction: n-1 gives an unbiased estimate', hint: 'Dividing by n underestimates the population variance.' },
        { prompt: 'If all data values are the same, what is the variance?', answer: '0', hint: 'No deviation from the mean.' },
        { prompt: 'If you add 10 to every value, what happens to the variance?', answer: 'unchanged', hint: 'Shifting data doesn\'t change spread.' },
      ],
    },
    'standard-deviation': {
      problems: [
        { prompt: 'Data: 2, 4, 4, 4, 5, 5, 7, 9. Mean = 5. Find the population SD.', answer: '2', hint: 'Variance = (9+1+1+1+0+0+4+16)/8 = 4. SD = sqrt(4) = 2.' },
        { prompt: 'Scores: 70, 80, 90. Sample SD?', answer: '10', hint: 'Mean=80. Variance = (100+0+100)/2 = 100. SD = 10.' },
        { prompt: 'What are the units of standard deviation vs variance?', answer: 'SD has same units as data; variance has squared units', hint: 'SD = sqrt(variance), so units return to original scale.' },
        { prompt: 'If you multiply all values by 3, what happens to SD?', answer: 'SD is multiplied by 3', hint: 'Scaling data by c multiplies SD by |c|.' },
        { prompt: 'Which has more variability: SD=5 or SD=12?', answer: 'SD=12', hint: 'Larger SD means more spread.' },
      ],
    },
    'coefficient-of-variation': {
      problems: [
        { prompt: 'Mean=50, SD=10. Find CV.', answer: '20%', hint: 'CV = (SD/mean) × 100 = (10/50) × 100.' },
        { prompt: 'Set A: mean=100, SD=15. Set B: mean=50, SD=10. Which is more variable relative to its mean?', answer: 'Set B (CV=20% vs 15%)', hint: 'CV_A = 15%, CV_B = 20%.' },
        { prompt: 'When is CV useful?', answer: 'when comparing variability between groups with different means or units', hint: 'CV is unitless, so it allows comparison across different scales.' },
        { prompt: 'Heights: mean=170cm, SD=10cm. Weights: mean=70kg, SD=12kg. Which varies more?', answer: 'weights (CV=17.1% vs 5.9%)', hint: 'Compare CV = SD/mean for each.' },
        { prompt: 'Can CV be negative?', answer: 'no (if mean is positive)', hint: 'SD is always ≥ 0, and CV assumes positive mean.' },
      ],
    },
    'skewness': {
      problems: [
        { prompt: 'Data: 1, 2, 2, 3, 3, 3, 4, 4, 10. Is it skewed? Which direction?', answer: 'right-skewed (positively skewed)', hint: 'The outlier 10 pulls the tail to the right.' },
        { prompt: 'In a right-skewed distribution, what is the relationship between mean and median?', answer: 'mean > median', hint: 'The tail pulls the mean toward it.' },
        { prompt: 'Income distributions are typically what shape?', answer: 'right-skewed', hint: 'A few very high incomes pull the mean up.' },
        { prompt: 'A symmetric distribution has skewness equal to what?', answer: '0', hint: 'No direction of skew.' },
        { prompt: 'Data: 1, 5, 6, 6, 7, 7, 7, 8, 8. Skew direction?', answer: 'left-skewed (negatively skewed)', hint: 'The tail extends to the left (lower values).' },
      ],
    },
    'modality': {
      problems: [
        { prompt: 'A histogram has one clear peak. Describe its modality.', answer: 'unimodal', hint: 'One peak = one mode.' },
        { prompt: 'Test scores show peaks at 65 and 90. Describe.', answer: 'bimodal', hint: 'Two distinct peaks.' },
        { prompt: 'A uniform distribution has what modality?', answer: 'no mode (uniform)', hint: 'All values are equally frequent.' },
        { prompt: 'Heights of adults (combined M and F) often appear...', answer: 'bimodal', hint: 'Male and female height distributions create two peaks.' },
        { prompt: 'A distribution with 3 peaks is called...', answer: 'multimodal (trimodal)', hint: 'Multiple peaks = multimodal.' },
      ],
    },
    'outlier-detection': {
      problems: [
        { prompt: 'Data: 2, 3, 4, 5, 6, 7, 25. Q1=3, Q3=7, IQR=4. Is 25 an outlier?', answer: 'yes', hint: 'Upper fence = Q3 + 1.5(IQR) = 7 + 6 = 13. 25 > 13.' },
        { prompt: 'Mean=50, SD=5. Is x=65 unusual using the 2-SD rule?', answer: 'yes, z=(65-50)/5=3, more than 2 SDs away', hint: 'Values more than 2 SDs from mean are unusual.' },
        { prompt: 'Name two methods for detecting outliers.', answer: '1.5×IQR rule and z-score method (|z|>2 or 3)', hint: 'Box-plot method uses fences; z-score uses standard deviations.' },
        { prompt: 'Should outliers always be removed?', answer: 'no, investigate first — they may be real or errors', hint: 'Outliers might be data entry errors OR genuine extreme values.' },
        { prompt: 'Data: 10, 11, 12, 13, 14, 15, 16. Any outliers by the 1.5×IQR rule?', answer: 'no', hint: 'Q1=11, Q3=15, IQR=4. Fences: 5 and 21. All within.' },
      ],
    },
    'normal-shape': {
      problems: [
        { prompt: 'Describe the key features of a normal distribution.', answer: 'symmetric, bell-shaped, mean=median=mode', hint: 'The classic bell curve.' },
        { prompt: 'What percentage of data falls within 1 SD of the mean (empirical rule)?', answer: '68%', hint: '68-95-99.7 rule.' },
        { prompt: 'What percentage falls within 2 SDs?', answer: '95%', hint: 'Second tier of the empirical rule.' },
        { prompt: 'What percentage falls within 3 SDs?', answer: '99.7%', hint: 'Third tier: almost all data.' },
        { prompt: 'If mean=100 and SD=15, what range contains 95% of data?', answer: '70 to 130', hint: '100 ± 2(15) = 100 ± 30.' },
      ],
    },
    'transformations': {
      problems: [
        { prompt: 'If you add 5 to every value, what happens to mean and SD?', answer: 'mean increases by 5, SD unchanged', hint: 'Adding a constant shifts center but not spread.' },
        { prompt: 'If you multiply every value by 2, what happens to mean and SD?', answer: 'both are multiplied by 2', hint: 'Scaling affects both center and spread.' },
        { prompt: 'Transform x to z: x=75, mean=60, SD=10. Find z.', answer: '1.5', hint: 'z = (x - mean)/SD = (75-60)/10.' },
        { prompt: 'A right-skewed dataset might be improved by what transformation?', answer: 'log or square root transformation', hint: 'These compress the right tail.' },
        { prompt: 'If z = -2, mean = 50, SD = 5, find x.', answer: '40', hint: 'x = mean + z × SD = 50 + (-2)(5).' },
      ],
    },
    'histogram': {
      problems: [
        { prompt: 'Data: 1,2,2,3,3,3,4,4,5. How many bars in a histogram with bins [1-2),[2-3),[3-4),[4-5],[5-6)?', answer: '5 bars with heights 1,2,3,2,1', hint: 'Count values in each bin.' },
        { prompt: 'What does the height of a histogram bar represent?', answer: 'frequency (or relative frequency) of values in that bin', hint: 'Taller bars = more observations in that range.' },
        { prompt: 'Histograms are for what type of data?', answer: 'quantitative (numerical) data', hint: 'Not for categorical data (use bar charts for those).' },
        { prompt: 'How does bin width affect a histogram?', answer: 'too narrow: noisy. too wide: loses detail', hint: 'Moderate bin width balances detail and smoothness.' },
        { prompt: 'What is the difference between a histogram and a bar chart?', answer: 'histogram: quantitative data, adjacent bars. bar chart: categorical, separated bars', hint: 'Histograms show continuous data; bar charts show categories.' },
      ],
    },
    'boxplot': {
      problems: [
        { prompt: 'Data: 2, 4, 6, 8, 10, 12, 14. Identify the 5-number summary.', answer: 'min=2, Q1=4, median=8, Q3=12, max=14', hint: 'Min, Q1, median, Q3, max.' },
        { prompt: 'What do the whiskers of a boxplot extend to?', answer: 'smallest and largest non-outlier values (within 1.5×IQR)', hint: 'Whiskers stop at the fences or the most extreme non-outlier.' },
        { prompt: 'How are outliers shown on a boxplot?', answer: 'as individual dots beyond the whiskers', hint: 'Points beyond 1.5×IQR from quartiles.' },
        { prompt: 'A boxplot has Q1=20, Q3=40 (IQR=20). Is a value of -15 an outlier?', answer: 'yes', hint: 'Lower fence = Q1 - 1.5×IQR = 20 - 30 = -10. Since -15 < -10, it is below the lower fence and is an outlier.' },
        { prompt: 'What can you NOT determine from a boxplot?', answer: 'exact data values, sample size, or shape details', hint: 'Boxplots summarize; they don\'t show individual points or multimodality.' },
      ],
    },
    'stemplot': {
      problems: [
        { prompt: 'Data: 12, 15, 21, 23, 24, 31, 35. Create a stem-and-leaf plot.', answer: '1|25, 2|134, 3|15', hint: 'Stems are tens digits, leaves are units.' },
        { prompt: 'What advantage does a stemplot have over a histogram?', answer: 'preserves individual data values', hint: 'You can read back exact values from a stemplot.' },
        { prompt: 'Stemplot: 3|2 5 7, 4|1 1 6 8, 5|0 3. How many data points?', answer: '9', hint: 'Count all leaves: 3 + 4 + 2 = 9.' },
        { prompt: 'What is a split stem?', answer: 'splitting each stem into two (leaves 0-4 and 5-9)', hint: 'Doubles the number of stems for more detail.' },
        { prompt: 'Stemplots work best for data sets of what size?', answer: 'small to moderate (about 15-50 values)', hint: 'Too many values make stemplots unwieldy.' },
      ],
    },
    'dotplot': {
      problems: [
        { prompt: 'Data: 1, 2, 2, 3, 3, 3, 4. How many dots at value 3?', answer: '3', hint: 'Three occurrences of 3.' },
        { prompt: 'When is a dot plot most useful?', answer: 'for small datasets to show individual values and distribution shape', hint: 'Good for seeing clusters, gaps, and outliers.' },
        { prompt: 'A dotplot shows 5 dots at x=7, 3 at x=8, 1 at x=12. Is 12 a potential outlier?', answer: 'possibly, it is separated from the cluster', hint: 'Visual inspection shows a gap.' },
        { prompt: 'What is the difference between a dotplot and a histogram?', answer: 'dotplot shows individual points; histogram groups into bins', hint: 'Dotplots preserve exact values.' },
        { prompt: 'Can dotplots show bimodal distributions?', answer: 'yes, through visible clusters at two values', hint: 'Two groups of concentrated dots.' },
      ],
    },
    'scatterplot': {
      problems: [
        { prompt: 'A scatterplot shows points trending up-right. What is the association?', answer: 'positive association', hint: 'As x increases, y tends to increase.' },
        { prompt: 'Name the 4 things to describe in a scatterplot.', answer: 'direction, form, strength, unusual features', hint: 'Direction (pos/neg), form (linear/curved), strength (strong/weak), outliers.' },
        { prompt: 'Can you determine causation from a scatterplot?', answer: 'no, only association', hint: 'Correlation does not imply causation.' },
        { prompt: 'What does a scatterplot with points in a random cloud suggest?', answer: 'no association between the variables', hint: 'No pattern means no linear relationship.' },
        { prompt: 'Study hours vs test score shows a strong positive linear pattern. Describe.', answer: 'strong positive linear association: more study hours relates to higher scores', hint: 'Always describe in context.' },
      ],
    },
    'side-by-side-boxplots': {
      problems: [
        { prompt: 'Class A: median 75, IQR 10. Class B: median 80, IQR 25. Compare.', answer: 'B has higher center but more variability', hint: 'Compare center (median) and spread (IQR).' },
        { prompt: 'What is the advantage of side-by-side boxplots?', answer: 'easy comparison of center, spread, and outliers across groups', hint: 'Same scale lets you compare distributions visually.' },
        { prompt: 'Two boxplots overlap a lot. What does this suggest?', answer: 'the distributions are similar; differences may not be significant', hint: 'Overlap suggests groups aren\'t clearly different.' },
        { prompt: 'Boys median height: 170cm. Girls median height: 160cm. What display would you use?', answer: 'side-by-side boxplots', hint: 'Comparing two groups on the same quantitative variable.' },
        { prompt: 'What can side-by-side boxplots NOT show?', answer: 'shape (unimodal vs bimodal), exact values, sample sizes', hint: 'Boxplots summarize but hide distributional details.' },
      ],
    },
    'back-to-back-stemplots': {
      problems: [
        { prompt: 'When would you use a back-to-back stemplot?', answer: 'comparing two small datasets with similar ranges', hint: 'Shared stems with leaves extending both directions.' },
        { prompt: 'Left leaves: 8 5 3 | Stem 7 | Right leaves: 1 4 6 9. How many total values?', answer: '7', hint: 'Left: 3 values, Right: 4 values.' },
        { prompt: 'What is the advantage over side-by-side boxplots?', answer: 'preserves individual data values and shows shape', hint: 'Stemplots show more detail than boxplots.' },
        { prompt: 'What is the limitation?', answer: 'only works for two groups with similar ranges', hint: 'Can\'t extend to 3+ groups easily.' },
        { prompt: 'Read: left 9 7 5 | 4 | 2 3 8. What are the left group\'s values?', answer: '45, 47, 49', hint: 'Left leaves read away from stem: 45, 47, 49.' },
      ],
    },
    'comparing-distributions': {
      problems: [
        { prompt: 'When comparing distributions, what 4 features should you address?', answer: 'shape, center, spread, outliers', hint: 'SOCS: Shape, Outliers, Center, Spread.' },
        { prompt: 'Group A: mean 50, SD 5. Group B: mean 60, SD 5. Compare.', answer: 'B has higher center; same spread', hint: 'Same variability, different locations.' },
        { prompt: 'Always compare distributions in...', answer: 'context of the data', hint: 'Use variable names and units, not just numbers.' },
        { prompt: 'One distribution is right-skewed, the other symmetric. Which measure of center is better for comparing?', answer: 'median (resistant to skewness)', hint: 'Mean is pulled by skew; median is not.' },
        { prompt: 'Template: "The distribution of ___ for Group A is ___ than Group B because ___."', answer: 'fill in: variable, higher/lower/more spread, with evidence', hint: 'Always: what, comparison word, evidence.' },
      ],
    },
    'z-scores': {
      problems: [
        { prompt: 'Score 85, mean 75, SD 5. Find the z-score.', answer: '2', hint: 'z = (85-75)/5 = 2.' },
        { prompt: 'A z-score of -1.5 means the value is...', answer: '1.5 standard deviations below the mean', hint: 'Negative z = below mean.' },
        { prompt: 'Math: score 90, mean 80, SD 10. English: score 85, mean 70, SD 5. Which is relatively better?', answer: 'English (z=3 vs z=1)', hint: 'Compare z-scores: Math z=1, English z=3.' },
        { prompt: 'What z-score corresponds to the mean?', answer: '0', hint: 'z = (mean - mean)/SD = 0.' },
        { prompt: 'Find x if z=2.5, mean=100, SD=16.', answer: '140', hint: 'x = mean + z(SD) = 100 + 2.5(16).' },
      ],
    },
    'percentiles': {
      problems: [
        { prompt: 'A student scores at the 85th percentile. What does this mean?', answer: '85% of scores fall at or below this value', hint: 'Percentile = percentage at or below.' },
        { prompt: 'Q1 corresponds to what percentile?', answer: '25th percentile', hint: '25% of data is at or below Q1.' },
        { prompt: 'The median corresponds to what percentile?', answer: '50th percentile', hint: 'Half the data is at or below the median.' },
        { prompt: 'In a normal distribution, what percentile is one SD above the mean?', answer: 'approximately 84th percentile', hint: '50% + 34% (half of 68%) = 84%.' },
        { prompt: 'If you are at the 90th percentile in height, are you tall or short?', answer: 'tall — taller than 90% of the reference group', hint: '90% are shorter than you.' },
      ],
    },
  },
  'probability': {
    'listing-outcomes': {
      problems: [
        { prompt: 'List the sample space for flipping 2 coins.', answer: '{HH, HT, TH, TT}', hint: '2 outcomes for each of 2 coins.' },
        { prompt: 'How many outcomes when rolling 2 dice?', answer: '36', hint: '6 × 6 = 36.' },
        { prompt: 'List the sample space for picking a card suit.', answer: '{hearts, diamonds, clubs, spades}', hint: '4 suits in a standard deck.' },
        { prompt: 'Sample space for flipping 3 coins? How many outcomes?', answer: '8', hint: '2^3 = 8 outcomes.' },
        { prompt: 'Rolling a die and flipping a coin simultaneously. How many outcomes?', answer: '12', hint: '6 × 2 = 12.' },
      ],
    },
    'tree-diagrams': {
      problems: [
        { prompt: 'Draw a tree: first pick R or B (equal), then pick 1,2,3 (equal). P(R and 2)?', answer: '1/6', hint: '(1/2)(1/3) = 1/6.' },
        { prompt: 'Rain 40%, then umbrella given rain 80%, umbrella given no rain 10%. P(umbrella)?', answer: '0.38', hint: '0.4(0.8) + 0.6(0.1) = 0.32 + 0.06.' },
        { prompt: 'Two-stage: P(A)=0.3, P(B|A)=0.5, P(B|not A)=0.2. Find P(B).', answer: '0.29', hint: 'P(B) = 0.3(0.5) + 0.7(0.2) = 0.15 + 0.14.' },
        { prompt: 'In the previous problem, find P(A|B).', answer: '0.517', hint: 'P(A|B) = P(A and B)/P(B) = 0.15/0.29.' },
        { prompt: 'A bag has 3R, 2B. Pick 2 without replacement. P(both red)?', answer: '3/10', hint: 'P(R1)×P(R2|R1) = (3/5)(2/4) = 6/20.' },
      ],
    },
    'two-way-tables': {
      problems: [
        { prompt: 'Table: Male/Athlete:30, Male/Non:70, Female/Athlete:20, Female/Non:80. P(Athlete)?', answer: '0.25', hint: '(30+20)/(30+70+20+80) = 50/200.' },
        { prompt: 'From the same table, P(Male|Athlete)?', answer: '0.6', hint: '30/50 = 0.6.' },
        { prompt: 'Are gender and athlete status independent in this table?', answer: 'no', hint: 'P(Male)=0.5, P(Male|Athlete)=0.6. These differ, so not independent.' },
        { prompt: 'What does a marginal probability refer to?', answer: 'probability from the row or column totals', hint: 'The "margins" of the table.' },
        { prompt: 'What does a conditional probability refer to in a two-way table?', answer: 'probability within a specific row or column', hint: 'Restrict to one category and find proportions.' },
      ],
    },
    'venn-diagrams': {
      problems: [
        { prompt: 'P(A)=0.6, P(B)=0.5, P(A∩B)=0.3. Find P(A∪B).', answer: '0.8', hint: 'P(A∪B) = P(A)+P(B)-P(A∩B) = 0.6+0.5-0.3.' },
        { prompt: 'P(A)=0.4, P(B)=0.3, A and B mutually exclusive. P(A∪B)?', answer: '0.7', hint: 'Mutually exclusive: P(A∩B)=0. P(A∪B)=0.4+0.3.' },
        { prompt: 'P(A)=0.7, P(A∪B)=0.9, P(A∩B)=0.2. Find P(B).', answer: '0.4', hint: 'P(B) = P(A∪B) - P(A) + P(A∩B) = 0.9-0.7+0.2.' },
        { prompt: 'P(A)=0.5, P(B)=0.4, P(A∩B)=0.2. Find P(neither A nor B).', answer: '0.3', hint: 'P(A∪B) = 0.7, so P(neither) = 1-0.7.' },
        { prompt: 'P(A only, not B) = P(A) - P(A∩B). If P(A)=0.6, P(A∩B)=0.15, find P(A only).', answer: '0.45', hint: '0.6 - 0.15 = 0.45.' },
      ],
    },
    'sample-space-size': {
      problems: [
        { prompt: 'A password is 4 digits (0-9). How many possible passwords?', answer: '10000', hint: '10^4 = 10000.' },
        { prompt: 'Choose 3 toppings from 10 for a pizza. How many ways?', answer: '120', hint: 'C(10,3) = 120.' },
        { prompt: 'License plate: 3 letters then 3 digits. How many?', answer: '17576000', hint: '26^3 × 10^3.' },
        { prompt: 'How many ways to arrange 5 people in a line?', answer: '120', hint: '5! = 120.' },
        { prompt: 'How many binary strings of length 8?', answer: '256', hint: '2^8 = 256.' },
      ],
    },
    'complement-rule': {
      problems: [
        { prompt: 'P(rain) = 0.3. P(no rain)?', answer: '0.7', hint: 'P(A\') = 1 - P(A).' },
        { prompt: 'P(at least one head in 3 flips)?', answer: '7/8', hint: '1 - P(all tails) = 1 - (1/2)^3 = 7/8.' },
        { prompt: 'P(at least one 6 in 4 rolls)?', answer: '1 - (5/6)^4 ≈ 0.518', hint: '1 - P(no sixes) = 1 - (5/6)^4.' },
        { prompt: 'When is the complement rule most useful?', answer: 'when "at least one" is easier computed via complement', hint: '"At least one" = 1 - "none".' },
        { prompt: 'P(A) + P(A\') = ?', answer: '1', hint: 'Fundamental: an event either happens or it doesn\'t.' },
      ],
    },
    'addition-rule': {
      problems: [
        { prompt: 'P(A)=0.4, P(B)=0.5, P(A∩B)=0.1. P(A or B)?', answer: '0.8', hint: 'P(A∪B) = P(A)+P(B)-P(A∩B).' },
        { prompt: 'Events are mutually exclusive: P(A)=0.3, P(B)=0.2. P(A or B)?', answer: '0.5', hint: 'Mutually exclusive: just add.' },
        { prompt: 'P(King or Heart) from a standard deck?', answer: '16/52 = 4/13', hint: '4 kings + 13 hearts - 1 king of hearts = 16.' },
        { prompt: 'When can you just add probabilities (no subtraction)?', answer: 'when events are mutually exclusive (disjoint)', hint: 'No overlap means no double-counting.' },
        { prompt: 'P(even or greater than 4) on a die roll?', answer: '4/6 = 2/3', hint: 'Even: {2,4,6}. >4: {5,6}. Union: {2,4,5,6}. P = 4/6.' },
      ],
    },
    'multiplication-rule': {
      problems: [
        { prompt: 'P(A)=0.5, P(B|A)=0.6. P(A and B)?', answer: '0.3', hint: 'P(A∩B) = P(A)×P(B|A) = 0.5×0.6.' },
        { prompt: 'Independent events: P(A)=0.3, P(B)=0.4. P(A and B)?', answer: '0.12', hint: 'Independent: P(A∩B) = P(A)×P(B).' },
        { prompt: 'Draw 2 cards without replacement. P(both aces)?', answer: '1/221', hint: '(4/52)(3/51) = 12/2652 = 1/221.' },
        { prompt: 'Flip a fair coin 5 times. P(all heads)?', answer: '1/32', hint: '(1/2)^5 = 1/32.' },
        { prompt: 'Bag: 4R, 6B. Pick 2 with replacement. P(both red)?', answer: '4/25', hint: '(4/10)(4/10) = 16/100.' },
      ],
    },
    'conditional-probability': {
      problems: [
        { prompt: 'P(A)=0.6, P(B)=0.5, P(A∩B)=0.3. Find P(A|B).', answer: '0.6', hint: 'P(A|B) = P(A∩B)/P(B) = 0.3/0.5.' },
        { prompt: 'Of 100 students, 40 play sports, 30 play music, 10 play both. P(music|sports)?', answer: '0.25', hint: 'P(M|S) = P(M∩S)/P(S) = 10/40.' },
        { prompt: 'Bayes: P(Disease)=0.01, P(+|Disease)=0.95, P(+|No Disease)=0.05. P(Disease|+)?', answer: '0.161', hint: 'P(+) = 0.01(0.95)+0.99(0.05)=0.059. P(D|+)=0.0095/0.059.' },
        { prompt: 'If P(A|B) = P(A), what does this tell you?', answer: 'A and B are independent', hint: 'Knowing B doesn\'t change the probability of A.' },
        { prompt: 'P(rain|cloudy) = 0.4, P(cloudy) = 0.6. P(rain and cloudy)?', answer: '0.24', hint: 'P(R∩C) = P(R|C)×P(C).' },
      ],
    },
    'independence': {
      problems: [
        { prompt: 'P(A)=0.3, P(B)=0.5, P(A∩B)=0.15. Are A and B independent?', answer: 'yes', hint: 'P(A)×P(B) = 0.15 = P(A∩B).' },
        { prompt: 'P(A)=0.4, P(B)=0.5, P(A∩B)=0.3. Independent?', answer: 'no', hint: 'P(A)×P(B) = 0.2 ≠ 0.3.' },
        { prompt: 'Rolling two dice: are the outcomes independent?', answer: 'yes', hint: 'One die doesn\'t affect the other.' },
        { prompt: 'Drawing cards without replacement: are draws independent?', answer: 'no', hint: 'The composition changes after each draw.' },
        { prompt: 'Can mutually exclusive events (both P>0) be independent?', answer: 'no', hint: 'If A occurs, B cannot, so P(B|A)=0 ≠ P(B).' },
      ],
    },
    'permutations': {
      problems: [
        { prompt: 'How many ways to arrange 5 books on a shelf?', answer: '120', hint: '5! = 120.' },
        { prompt: 'How many ways can 8 runners finish 1st, 2nd, 3rd?', answer: '336', hint: 'P(8,3) = 8×7×6.' },
        { prompt: 'How many arrangements of STATISTICS?', answer: '50400', hint: '10!/(3!3!2!1!1!) for S×3, T×3, I×1, A×1, C×1... Wait: S(3),T(3),A(1),I(2),C(1). So 10!/(3!3!2!)=50400.' },
        { prompt: 'In how many ways can 5 people sit in a circle?', answer: '24', hint: '(5-1)! = 4! = 24.' },
        { prompt: 'How many 3-letter codes from A-Z with no repeats?', answer: '15600', hint: '26×25×24.' },
      ],
    },
    'combinations': {
      problems: [
        { prompt: 'Choose 3 from 10 people. How many ways?', answer: '120', hint: 'C(10,3) = 120.' },
        { prompt: 'How many 5-card poker hands?', answer: '2598960', hint: 'C(52,5).' },
        { prompt: 'How many ways to choose 2 boys from 5 and 3 girls from 4?', answer: '40', hint: 'C(5,2)×C(4,3) = 10×4.' },
        { prompt: 'C(n,0) + C(n,1) + ... + C(n,n) = ?', answer: '2^n', hint: 'Total subsets of an n-element set.' },
        { prompt: 'C(10,7) = C(10,?)', answer: '3', hint: 'C(n,k) = C(n,n-k).' },
      ],
    },
    'with-replacement': {
      problems: [
        { prompt: 'Pick a ball from {R,G,B}, replace, pick again. How many outcomes?', answer: '9', hint: '3×3 = 9.' },
        { prompt: 'Roll a die 3 times. How many possible sequences?', answer: '216', hint: '6^3 = 216.' },
        { prompt: 'A 4-digit PIN (digits 0-9, repeats allowed). How many PINs?', answer: '10000', hint: '10^4.' },
        { prompt: 'Pick 5 items from 8 with replacement. How many ways (order matters)?', answer: '32768', hint: '8^5.' },
        { prompt: 'Key difference: with vs without replacement?', answer: 'with replacement: outcomes are independent. without: dependent.', hint: 'Replacement restores the original probabilities.' },
      ],
    },
    'without-replacement': {
      problems: [
        { prompt: 'Draw 2 cards from 52 without replacement. How many ordered outcomes?', answer: '2652', hint: '52×51.' },
        { prompt: 'Draw 2 from 52 (order doesn\'t matter). How many?', answer: '1326', hint: 'C(52,2) = 52×51/2.' },
        { prompt: 'Bag: 5R, 3B. Draw 2. P(both red)?', answer: '10/28 = 5/14', hint: 'C(5,2)/C(8,2) = 10/28.' },
        { prompt: 'Committee of 3 from 12 people. How many?', answer: '220', hint: 'C(12,3) = 220.' },
        { prompt: 'Draw 5 from a deck. P(all hearts)?', answer: 'C(13,5)/C(52,5) = 33/66640', hint: '1287/2598960.' },
      ],
    },
    'multinomial': {
      problems: [
        { prompt: 'Arrange the letters in MISSISSIPPI. How many ways?', answer: '34650', hint: '11!/(4!4!2!1!) — M(1), I(4), S(4), P(2).' },
        { prompt: 'Distribute 12 balls into 3 labeled groups of 4. How many ways?', answer: '34650', hint: '12!/(4!4!4!) = 34650. If groups were unlabeled, divide by 3! to get 5775.' },
        { prompt: 'Multinomial coefficient: 10!/(3!3!4!) = ?', answer: '4200', hint: 'Distribute 10 into groups of 3, 3, and 4.' },
        { prompt: '10 people split into teams of 5, 3, 2. How many ways?', answer: '2520', hint: '10!/(5!3!2!) = 2520.' },
        { prompt: 'How many ways to arrange AABBCC?', answer: '90', hint: '6!/(2!2!2!) = 720/8 = 90.' },
      ],
    },
    'binomial': {
      problems: [
        { prompt: 'Flip a coin 10 times. P(exactly 6 heads)?', answer: '210/1024 ≈ 0.205', hint: 'C(10,6)(0.5)^10 = 210/1024.' },
        { prompt: 'P(success) = 0.3, n = 5. P(exactly 2 successes)?', answer: '0.3087', hint: 'C(5,2)(0.3)^2(0.7)^3.' },
        { prompt: 'What are the conditions for a binomial distribution?', answer: 'fixed n, 2 outcomes, independent, same p', hint: 'Binary, Independent, Number fixed, Same probability (BINS).' },
        { prompt: 'n=20, p=0.4. Find the expected value.', answer: '8', hint: 'E(X) = np = 20(0.4).' },
        { prompt: 'n=20, p=0.4. Find the standard deviation.', answer: '2.19', hint: 'SD = sqrt(npq) = sqrt(20×0.4×0.6) = sqrt(4.8).' },
      ],
    },
    'geometric': {
      problems: [
        { prompt: 'P(success) = 0.2. P(first success on 4th trial)?', answer: '0.1024', hint: '(0.8)^3(0.2) = 0.1024.' },
        { prompt: 'P(success) = 0.5. Expected number of trials until first success?', answer: '2', hint: 'E(X) = 1/p = 1/0.5.' },
        { prompt: 'P(success) = 0.1. P(first success within first 3 trials)?', answer: '0.271', hint: '1 - (0.9)^3 = 1 - 0.729.' },
        { prompt: 'What is the key difference between binomial and geometric?', answer: 'binomial: fixed n, count successes. geometric: count trials until first success.', hint: 'Binomial has fixed trials; geometric has random trials.' },
        { prompt: 'P=0.3. P(need more than 5 trials)?', answer: '0.168', hint: 'P(X>5) = (1-p)^5 = (0.7)^5.' },
      ],
    },
    'expected-value': {
      problems: [
        { prompt: 'Die roll. X = outcome. Find E(X).', answer: '3.5', hint: '(1+2+3+4+5+6)/6 = 3.5.' },
        { prompt: 'Game: win $10 with P=0.3, lose $5 with P=0.7. Expected value?', answer: '-$0.50', hint: '10(0.3) + (-5)(0.7) = 3 - 3.5.' },
        { prompt: 'If E(X) < 0 in a gambling game, what does this mean?', answer: 'on average, you lose money per play', hint: 'Negative expected value = house advantage.' },
        { prompt: 'X: 1(0.2), 2(0.5), 3(0.3). Find E(X).', answer: '2.1', hint: '1(0.2)+2(0.5)+3(0.3) = 0.2+1+0.9.' },
        { prompt: 'E(aX + b) = ?', answer: 'aE(X) + b', hint: 'Expected value is linear.' },
      ],
    },
    'standard-deviation-discrete': {
      problems: [
        { prompt: 'X: 0(0.5), 1(0.5). Find SD(X).', answer: '0.5', hint: 'E(X)=0.5. Var=0.5(0.25)+0.5(0.25)=0.25. SD=0.5.' },
        { prompt: 'Var(X) = 16. Find SD(X).', answer: '4', hint: 'SD = sqrt(Var).' },
        { prompt: 'If Var(X) = 9, find Var(2X+3).', answer: '36', hint: 'Var(aX+b) = a^2 Var(X) = 4(9).' },
        { prompt: 'X: 1(0.25), 2(0.5), 3(0.25). E(X)=2. Find Var(X).', answer: '0.5', hint: '0.25(1)+0.5(0)+0.25(1) = 0.5.' },
        { prompt: 'What does a larger SD mean for a random variable?', answer: 'more variability in outcomes; outcomes are less predictable', hint: 'Larger SD = more spread in possible values.' },
      ],
    },
    'normal-distribution': {
      problems: [
        { prompt: 'SAT scores: N(1060, 195). What % score above 1255?', answer: 'about 16%', hint: 'z = (1255-1060)/195 = 1. Above 1 SD: about 16%.' },
        { prompt: 'Heights: N(170, 10)cm. P(height < 150)?', answer: 'about 2.5%', hint: 'z = (150-170)/10 = -2. Below -2: about 2.5%.' },
        { prompt: 'N(100, 15). Between what values is 95% of data?', answer: '70 to 130', hint: 'mean ± 2SD = 100 ± 30.' },
        { prompt: 'Find z for x=85 if mean=70, SD=10.', answer: '1.5', hint: 'z = (85-70)/10.' },
        { prompt: 'What z-score has 90% of data below it?', answer: 'z ≈ 1.28', hint: 'Look up 0.90 in z-table.' },
      ],
    },
    'z-scores-normal': {
      problems: [
        { prompt: 'z = 1.5. What percentile is this approximately?', answer: '93.3%', hint: 'From z-table: 0.9332.' },
        { prompt: 'z = -0.5. P(Z < -0.5)?', answer: '0.3085', hint: 'From z-table.' },
        { prompt: 'Find P(Z > 2).', answer: '0.0228', hint: '1 - 0.9772.' },
        { prompt: 'Find P(-1 < Z < 1).', answer: '0.6827', hint: '68% by empirical rule, or 0.8413-0.1587.' },
        { prompt: 'What z-score cuts off the top 5%?', answer: 'z ≈ 1.645', hint: '0.95 in the table.' },
      ],
    },
    'standard-normal-table': {
      problems: [
        { prompt: 'Using z-table: P(Z < 1.96)?', answer: '0.975', hint: 'This is the critical value for 95% confidence.' },
        { prompt: 'P(Z < 0)?', answer: '0.5', hint: 'The standard normal is symmetric around 0.' },
        { prompt: 'P(Z < -1.96)?', answer: '0.025', hint: 'Symmetric: 1 - 0.975.' },
        { prompt: 'Find z such that P(Z < z) = 0.90.', answer: '1.28', hint: 'Look up 0.90 in the body of the table.' },
        { prompt: 'P(0 < Z < 1.5)?', answer: '0.4332', hint: 'P(Z<1.5) - P(Z<0) = 0.9332 - 0.5.' },
      ],
    },
    'normal-calculations': {
      problems: [
        { prompt: 'X ~ N(500, 100). Find P(X > 650).', answer: '0.0668', hint: 'z = (650-500)/100 = 1.5. P(Z>1.5) ≈ 0.0668.' },
        { prompt: 'X ~ N(50, 8). Find P(42 < X < 58).', answer: '0.6827', hint: 'z1=-1, z2=1. P = 0.6827.' },
        { prompt: 'X ~ N(200, 25). What value has 10% below it?', answer: '168', hint: 'z ≈ -1.28. x = 200 + (-1.28)(25) = 168.' },
        { prompt: 'X ~ N(70, 5). P(X < 62)?', answer: '0.0548', hint: 'z = (62-70)/5 = -1.6. P ≈ 0.0548.' },
        { prompt: 'X ~ N(1000, 200). What score is at the 75th percentile?', answer: '1135', hint: 'z ≈ 0.675. x = 1000 + 0.675(200).' },
      ],
    },
    'empirical-rule': {
      problems: [
        { prompt: 'N(100,10). What % between 80 and 120?', answer: '95%', hint: 'That\'s mean ± 2SD.' },
        { prompt: 'N(50,5). What % above 65?', answer: '0.15%', hint: '65 = mean + 3SD. Above 3SD: 0.15%.' },
        { prompt: 'N(170,10)cm. What % between 160 and 180?', answer: '68%', hint: 'mean ± 1SD.' },
        { prompt: 'Birth weight N(3.5kg, 0.5kg). What % weigh between 2.5 and 4.5 kg?', answer: '95%', hint: '3.5 ± 2(0.5).' },
        { prompt: 'IQ: N(100,15). What % have IQ above 145?', answer: '0.15%', hint: '145 = 100 + 3(15). Above 3SD.' },
      ],
    },
    'normal-assessment': {
      problems: [
        { prompt: 'How do you assess if data is approximately normal?', answer: 'histogram (bell-shaped), normal probability plot (straight line), empirical rule check', hint: 'Multiple methods for assessing normality.' },
        { prompt: 'A normal probability plot shows a straight line. What does this suggest?', answer: 'data is approximately normally distributed', hint: 'Linearity = normality.' },
        { prompt: 'A histogram is strongly right-skewed. Is the data normal?', answer: 'no', hint: 'Normal distributions are symmetric.' },
        { prompt: 'Data: 68% within 1SD, 95% within 2SD, 99.5% within 3SD. Normal?', answer: 'approximately yes', hint: 'Close to the 68-95-99.7 rule.' },
        { prompt: 'A QQ-plot curves upward at the right end. What shape is the data?', answer: 'right-skewed', hint: 'Departures from the line indicate non-normality.' },
      ],
    },
  },
  'inference': {
    'sampling-methods': {
      problems: [
        { prompt: 'Every 10th person entering a store is surveyed. What method?', answer: 'systematic sampling', hint: 'Regular interval selection.' },
        { prompt: 'All students are numbered and 50 are chosen by random number generator. Method?', answer: 'simple random sample (SRS)', hint: 'Every subset of size 50 equally likely.' },
        { prompt: 'Students are divided by grade, then randomly sampled from each. Method?', answer: 'stratified random sampling', hint: 'Strata = grades.' },
        { prompt: 'A few classes are randomly selected and all students in those classes are surveyed. Method?', answer: 'cluster sampling', hint: 'Clusters = classes.' },
        { prompt: 'An online poll lets anyone respond. Is this good sampling?', answer: 'no, voluntary response bias', hint: 'Only people with strong opinions tend to respond.' },
      ],
    },
    'bias': {
      problems: [
        { prompt: 'A phone survey only calls landlines. What bias?', answer: 'undercoverage (excludes cell-only households)', hint: 'Younger people often lack landlines.' },
        { prompt: 'A survey about exercise is given at a gym. Bias?', answer: 'selection bias / convenience sample', hint: 'Gym-goers exercise more than the general population.' },
        { prompt: '"Do you agree that taxes are too high?" What kind of bias?', answer: 'response bias (leading question)', hint: 'The wording pushes toward a particular answer.' },
        { prompt: 'Only 20% of mailed surveys are returned. Concern?', answer: 'nonresponse bias', hint: 'Respondents may differ from non-respondents.' },
        { prompt: 'How do you reduce bias in sampling?', answer: 'use random selection, avoid convenience/voluntary samples', hint: 'Randomization is the key to reducing bias.' },
      ],
    },
    'sampling-distribution': {
      problems: [
        { prompt: 'What is a sampling distribution?', answer: 'the distribution of a statistic over all possible samples of the same size', hint: 'It describes how a statistic varies from sample to sample.' },
        { prompt: 'Population mean = 50. What is the mean of the sampling distribution of x-bar?', answer: '50', hint: 'The mean of x-bar equals the population mean (unbiased).' },
        { prompt: 'Population SD = 20, n = 100. What is the standard error of x-bar?', answer: '2', hint: 'SE = σ/sqrt(n) = 20/10.' },
        { prompt: 'As sample size increases, what happens to the sampling distribution?', answer: 'it becomes narrower (less variability)', hint: 'SE decreases as n increases.' },
        { prompt: 'Population proportion p = 0.4, n = 100. SE of p-hat?', answer: '0.049', hint: 'SE = sqrt(p(1-p)/n) = sqrt(0.24/100).' },
      ],
    },
    'central-limit-theorem': {
      problems: [
        { prompt: 'State the Central Limit Theorem.', answer: 'for large n, the sampling distribution of x-bar is approximately normal, regardless of population shape', hint: 'The CLT makes the normal distribution universally useful.' },
        { prompt: 'How large must n be for CLT to apply?', answer: 'generally n ≥ 30', hint: 'Rule of thumb: 30 or more. Less if population is near-normal.' },
        { prompt: 'Population is uniform. n=50. What shape is the distribution of x-bar?', answer: 'approximately normal (by CLT)', hint: 'CLT applies since n ≥ 30.' },
        { prompt: 'Why is CLT important?', answer: 'it allows us to use normal-based inference even for non-normal populations', hint: 'Without CLT, we\'d need to know the population shape.' },
        { prompt: 'Population mean = 100, SD = 30, n = 36. P(x-bar > 110)?', answer: '0.0228', hint: 'SE = 30/6 = 5. z = (110-100)/5 = 2. P(Z>2) ≈ 0.0228.' },
      ],
    },
    'standard-error': {
      problems: [
        { prompt: 'What is standard error?', answer: 'the standard deviation of the sampling distribution of a statistic', hint: 'SE measures how much a statistic varies from sample to sample.' },
        { prompt: 'SE of mean: σ = 15, n = 25. Find SE.', answer: '3', hint: 'SE = σ/sqrt(n) = 15/5.' },
        { prompt: 'To halve the SE, you must multiply n by...', answer: '4', hint: 'SE = σ/sqrt(n). To halve: sqrt(n) doubles, so n quadruples.' },
        { prompt: 'p-hat = 0.6, n = 100. SE of p-hat?', answer: '0.049', hint: 'SE = sqrt(p-hat(1-p-hat)/n) = sqrt(0.24/100).' },
        { prompt: 'Why is larger n better?', answer: 'smaller SE means more precise estimates', hint: 'More data = less sampling variability.' },
      ],
    },
    'confidence-interval-concept': {
      problems: [
        { prompt: 'What does a 95% confidence interval mean?', answer: '95% of all such intervals from repeated sampling will contain the true parameter', hint: 'It\'s about the procedure, not this specific interval.' },
        { prompt: 'If you increase confidence from 90% to 99%, what happens to interval width?', answer: 'wider', hint: 'More confidence requires a wider net.' },
        { prompt: 'CI = (45, 55). What is the point estimate and margin of error?', answer: 'point estimate: 50, margin of error: 5', hint: 'Center and half-width of the interval.' },
        { prompt: 'Can we say "there is a 95% probability the true mean is in this interval"?', answer: 'no — the true mean is fixed, not random', hint: 'The interval is random, not the parameter.' },
        { prompt: 'To narrow a CI without changing confidence level, what do you do?', answer: 'increase sample size', hint: 'More data reduces the margin of error.' },
      ],
    },
    'ci-for-proportion': {
      problems: [
        { prompt: 'p-hat = 0.6, n = 100, z* = 1.96. Find the 95% CI.', answer: '(0.504, 0.696)', hint: 'ME = 1.96 × sqrt(0.6×0.4/100) = 1.96(0.049) ≈ 0.096.' },
        { prompt: 'Conditions for a CI for proportion?', answer: 'random sample, np-hat ≥ 10 and n(1-p-hat) ≥ 10, independence (n < 10% of population)', hint: 'Normal condition and independence condition.' },
        { prompt: '200 surveyed, 120 said yes. Find p-hat and 95% CI.', answer: 'p-hat=0.6, CI ≈ (0.532, 0.668)', hint: 'SE = sqrt(0.6×0.4/200) ≈ 0.0346. ME = 1.96(0.0346) ≈ 0.068.' },
        { prompt: 'A poll reports 52% ± 3%. What is the margin of error?', answer: '3%', hint: 'The ± value is the margin of error.' },
        { prompt: 'What z* value gives 99% confidence?', answer: '2.576', hint: 'Leaving 0.5% in each tail.' },
      ],
    },
    'ci-for-mean': {
      problems: [
        { prompt: 'x-bar=50, s=10, n=25. Find 95% CI using t* ≈ 2.064.', answer: '(45.87, 54.13)', hint: 'ME = t* × s/sqrt(n) = 2.064(10/5) = 4.13.' },
        { prompt: 'When do you use t vs z for a CI for a mean?', answer: 'use t when σ is unknown (use sample SD s)', hint: 't accounts for extra uncertainty from estimating σ.' },
        { prompt: 'What are the conditions for a t-interval?', answer: 'random sample, nearly normal population (or n≥30), independence', hint: 'Similar to z-interval but less strict with larger n.' },
        { prompt: 'As n increases, the t-distribution approaches what?', answer: 'the standard normal (z) distribution', hint: 'With many degrees of freedom, t → z.' },
        { prompt: 'Degrees of freedom for a one-sample t-interval?', answer: 'n - 1', hint: 'One less than sample size.' },
      ],
    },
    'margin-of-error': {
      problems: [
        { prompt: 'ME = z* × SE. If z*=1.96 and SE=2.5, find ME.', answer: '4.9', hint: '1.96 × 2.5.' },
        { prompt: 'How does doubling sample size affect ME?', answer: 'ME decreases by factor of sqrt(2) ≈ 1.414', hint: 'SE = σ/sqrt(n). Doubling n divides SE by sqrt(2).' },
        { prompt: 'A 95% CI is (42, 58). What is the ME?', answer: '8', hint: 'ME = (58-42)/2.' },
        { prompt: 'Which gives a smaller ME: 90% or 95% confidence?', answer: '90%', hint: 'Lower confidence = smaller z* = smaller ME.' },
        { prompt: 'ME = 3% is desired for a proportion near 0.5. Using z*=1.96, what n is needed?', answer: '1068', hint: 'n = (z*/ME)^2 × p(1-p) = (1.96/0.03)^2 × 0.25 ≈ 1068.' },
      ],
    },
    'sample-size-determination': {
      problems: [
        { prompt: 'For a proportion: want ME ≤ 0.04, 95% confidence, p unknown. Find min n.', answer: '601', hint: 'Use p=0.5 (worst case). n = (1.96/0.04)^2(0.25) = 600.25, round up.' },
        { prompt: 'For a mean: want ME ≤ 5, 95% confidence, σ=20. Find n.', answer: '62', hint: 'n = (z*σ/ME)^2 = (1.96×20/5)^2 = 61.47, round up to 62.' },
        { prompt: 'Why use p=0.5 when p is unknown?', answer: 'p(1-p) is maximized at p=0.5, giving the largest (most conservative) n', hint: '0.5×0.5 = 0.25, the maximum of p(1-p).' },
        { prompt: 'To cut ME in half, multiply n by...', answer: '4', hint: 'ME is proportional to 1/sqrt(n).' },
        { prompt: 'Budget allows n=400. What ME for a proportion at 95% confidence?', answer: '0.049', hint: 'ME = 1.96√(0.25/400) = 1.96(0.025).' },
      ],
    },
    'null-alternative': {
      problems: [
        { prompt: 'A company claims batteries last 500 hours. You think they last less. Write H0 and Ha.', answer: 'H0: μ = 500, Ha: μ < 500', hint: 'H0 is the claim; Ha is what you suspect.' },
        { prompt: 'A coin is fair? H0 and Ha?', answer: 'H0: p = 0.5, Ha: p ≠ 0.5', hint: 'Two-sided test: could be unfair either way.' },
        { prompt: 'What does H0 always contain?', answer: 'an equality (=, ≤, ≥)', hint: 'Null hypothesis is the "no difference/no effect" claim.' },
        { prompt: 'A new drug is tested. H0: no effect. Ha: the drug works. Which error is worse?', answer: 'Type I (approving an ineffective drug) — though context matters', hint: 'Depends on consequences: false positive vs false negative.' },
        { prompt: 'Is the alternative hypothesis one-sided or two-sided: "the new method is different"?', answer: 'two-sided (Ha: μ ≠ μ0)', hint: '"Different" doesn\'t specify a direction.' },
      ],
    },
    'test-statistic': {
      problems: [
        { prompt: 'x-bar=52, μ0=50, s=8, n=64. Calculate the t-statistic.', answer: '2', hint: 't = (x-bar - μ0)/(s/sqrt(n)) = 2/(8/8) = 2.' },
        { prompt: 'p-hat=0.55, p0=0.5, n=200. Calculate z-statistic.', answer: '1.414', hint: 'z = (0.55-0.5)/sqrt(0.5×0.5/200) = 0.05/0.0354.' },
        { prompt: 'What does a large test statistic (in absolute value) indicate?', answer: 'the sample result is far from H0, evidence against H0', hint: 'Large |test stat| = small p-value = more evidence against H0.' },
        { prompt: 'Which test statistic: testing a proportion or a mean?', answer: 'proportion: z-statistic. mean (σ unknown): t-statistic.', hint: 'z for proportions, t for means when σ is unknown.' },
        { prompt: 'If the test statistic is 0, what does this mean?', answer: 'the sample result exactly equals H0 value; no evidence against H0', hint: 'The data perfectly matches the null hypothesis.' },
      ],
    },
    'p-value': {
      problems: [
        { prompt: 'What is a p-value?', answer: 'probability of observing a result as extreme as (or more than) the sample, assuming H0 is true', hint: 'How likely is this data IF the null is correct?' },
        { prompt: 'p-value = 0.03, α = 0.05. Decision?', answer: 'reject H0', hint: 'p < α means reject.' },
        { prompt: 'p-value = 0.08, α = 0.05. Decision?', answer: 'fail to reject H0', hint: 'p > α means insufficient evidence.' },
        { prompt: 'A small p-value means...', answer: 'the data is unlikely under H0; evidence against H0', hint: 'Small p = strong evidence against the null.' },
        { prompt: 'Does p-value = 0.01 mean there\'s a 1% chance H0 is true?', answer: 'no — p-value is not the probability H0 is true', hint: 'Common misconception. P-value assumes H0 is true.' },
      ],
    },
    'significance-level': {
      problems: [
        { prompt: 'What is α?', answer: 'the probability of Type I error; the threshold for rejecting H0', hint: 'We reject H0 when p-value < α.' },
        { prompt: 'Common values of α?', answer: '0.05, 0.01, 0.10', hint: '0.05 is most common.' },
        { prompt: 'If you decrease α from 0.05 to 0.01, what happens?', answer: 'harder to reject H0; fewer Type I errors but more Type II errors', hint: 'Stricter criterion means fewer false positives.' },
        { prompt: 'α should be chosen before or after collecting data?', answer: 'before', hint: 'Choosing after looking at data would be cheating.' },
        { prompt: '"Statistically significant" means p < α. Does this mean "practically important"?', answer: 'no — statistical significance ≠ practical significance', hint: 'A tiny effect can be "significant" with large n.' },
      ],
    },
    'type-i-type-ii-errors': {
      problems: [
        { prompt: 'Type I error: reject H0 when H0 is actually...', answer: 'true (false positive)', hint: 'Type I = false alarm.' },
        { prompt: 'Type II error: fail to reject H0 when H0 is actually...', answer: 'false (false negative)', hint: 'Type II = missed detection.' },
        { prompt: 'P(Type I error) = ?', answer: 'α', hint: 'By definition, α is the Type I error rate.' },
        { prompt: 'Power = 1 - P(Type II error). If power = 0.8, what is P(Type II)?', answer: '0.2', hint: 'β = 1 - power.' },
        { prompt: 'How do you increase power?', answer: 'increase n, increase α, or have a larger effect size', hint: 'More data or a bigger effect makes detection easier.' },
      ],
    },
    'goodness-of-fit': {
      problems: [
        { prompt: 'Die rolled 60 times. Expected count per face?', answer: '10', hint: '60/6 = 10 per face.' },
        { prompt: 'Observed: 8,12,9,11,10,10. Expected: all 10. Compute chi-square.', answer: '1.6', hint: 'Σ(O-E)^2/E = (4+4+1+1+0+0)/10.' },
        { prompt: 'What is H0 in a goodness-of-fit test?', answer: 'the data follows the specified distribution', hint: 'H0: observed proportions match expected proportions.' },
        { prompt: 'Degrees of freedom for a goodness-of-fit test with k categories?', answer: 'k - 1', hint: 'One less than the number of categories.' },
        { prompt: 'What is the minimum expected count condition?', answer: 'all expected counts ≥ 5', hint: 'Needed for the chi-square approximation to be valid.' },
      ],
    },
    'test-of-independence': {
      problems: [
        { prompt: 'In a chi-square test of independence, H0 states...', answer: 'the two variables are independent (no association)', hint: 'No relationship between the row and column variables.' },
        { prompt: 'Two-way table: 3 rows, 4 columns. Degrees of freedom?', answer: '6', hint: 'df = (r-1)(c-1) = 2×3.' },
        { prompt: 'Expected count formula in a two-way table?', answer: '(row total × column total) / grand total', hint: 'The expected count if variables were independent.' },
        { prompt: 'A large chi-square statistic suggests...', answer: 'strong evidence against independence (variables are associated)', hint: 'Large discrepancy between observed and expected.' },
        { prompt: 'Conditions for chi-square test of independence?', answer: 'random sample, all expected counts ≥ 5, independent observations', hint: 'Same conditions as goodness-of-fit.' },
      ],
    },
    'expected-counts': {
      problems: [
        { prompt: 'Row total = 40, Column total = 60, Grand total = 200. Expected count?', answer: '12', hint: '(40 × 60)/200 = 12.' },
        { prompt: 'Row total = 50, Column total = 100, Grand total = 250. Expected count?', answer: '20', hint: '(50 × 100)/250.' },
        { prompt: 'Why do we need expected counts ≥ 5?', answer: 'the chi-square approximation breaks down with small expected counts', hint: 'The sampling distribution is only approximately chi-square for large counts.' },
        { prompt: 'If an expected count is 3, what can you do?', answer: 'combine categories or use Fisher\'s exact test', hint: 'Merge small categories to meet the condition.' },
        { prompt: 'In goodness-of-fit: n=50, 5 equal categories. Expected count each?', answer: '10', hint: '50/5 = 10.' },
      ],
    },
    'chi-square-statistic': {
      problems: [
        { prompt: 'Formula for chi-square statistic?', answer: 'Σ (observed - expected)^2 / expected', hint: 'Sum over all cells.' },
        { prompt: 'O=15, E=10. Contribution to chi-square?', answer: '2.5', hint: '(15-10)^2/10 = 25/10.' },
        { prompt: 'Can chi-square be negative?', answer: 'no — it is a sum of squared terms divided by positive numbers', hint: 'All terms are non-negative.' },
        { prompt: 'What does chi-square = 0 mean?', answer: 'perfect match between observed and expected', hint: 'Every O exactly equals E.' },
        { prompt: 'Large chi-square means what?', answer: 'large discrepancy; evidence against H0', hint: 'The data doesn\'t fit the model well.' },
      ],
    },
    'degrees-of-freedom': {
      problems: [
        { prompt: 'Goodness-of-fit: 6 categories. df?', answer: '5', hint: 'k - 1 = 6 - 1.' },
        { prompt: 'Test of independence: 4 rows, 3 columns. df?', answer: '6', hint: '(4-1)(3-1) = 3×2.' },
        { prompt: 'One-sample t-test: n = 20. df?', answer: '19', hint: 'n - 1.' },
        { prompt: 'Why do degrees of freedom matter?', answer: 'they determine the shape of the t or chi-square distribution', hint: 'Different df = different critical values.' },
        { prompt: 'As df increases, the chi-square distribution shifts...', answer: 'to the right (larger mean)', hint: 'Mean of chi-square = df.' },
      ],
    },
    'least-squares': {
      problems: [
        { prompt: 'In y = a + bx, what does b represent?', answer: 'the slope: predicted change in y for a 1-unit increase in x', hint: 'b = Σ(x-x̄)(y-ȳ) / Σ(x-x̄)².' },
        { prompt: 'Regression line passes through what point?', answer: '(x̄, ȳ)', hint: 'The point of means always lies on the line.' },
        { prompt: 'y-hat = 3 + 2x. Predict y when x = 5.', answer: '13', hint: '3 + 2(5) = 13.' },
        { prompt: 'What does "least squares" minimize?', answer: 'the sum of squared residuals', hint: 'Minimize Σ(y - ŷ)².' },
        { prompt: 'Regression line: y-hat = 20 - 0.5x. Interpret the slope.', answer: 'for each 1-unit increase in x, y decreases by 0.5 on average', hint: 'Negative slope = negative association.' },
      ],
    },
    'correlation': {
      problems: [
        { prompt: 'r = 0.85. Describe the association.', answer: 'strong positive linear association', hint: 'Close to 1 = strong positive.' },
        { prompt: 'r = -0.3. Describe.', answer: 'weak negative linear association', hint: 'Close to 0 = weak; negative = inverse.' },
        { prompt: 'r ranges from...', answer: '-1 to 1', hint: '-1 ≤ r ≤ 1.' },
        { prompt: 'Does r = 0 mean no relationship?', answer: 'no — it means no LINEAR relationship (could be curved)', hint: 'r only measures linear association.' },
        { prompt: 'If you switch x and y, does r change?', answer: 'no', hint: 'Correlation is symmetric.' },
      ],
    },
    'r-squared': {
      problems: [
        { prompt: 'r = 0.8. Find r².', answer: '0.64', hint: 'r² = (0.8)² = 0.64.' },
        { prompt: 'Interpret r² = 0.64.', answer: '64% of the variability in y is explained by x', hint: 'r² = proportion of variance explained.' },
        { prompt: 'r² = 0.36. What is r?', answer: '±0.6', hint: 'r = ±√(0.36). Need context to determine sign.' },
        { prompt: 'Can r² exceed 1?', answer: 'no, 0 ≤ r² ≤ 1', hint: 'r² is a proportion.' },
        { prompt: 'Model A: r²=0.9. Model B: r²=0.5. Which fits better?', answer: 'Model A', hint: 'Higher r² = more variance explained.' },
      ],
    },
    'residual-analysis': {
      problems: [
        { prompt: 'What is a residual?', answer: 'observed y minus predicted y (y - ŷ)', hint: 'How far the actual point is from the line.' },
        { prompt: 'A residual plot shows a curved pattern. What does this indicate?', answer: 'the linear model is not appropriate; try a nonlinear model', hint: 'Residuals should be randomly scattered if linear is appropriate.' },
        { prompt: 'What should a good residual plot look like?', answer: 'random scatter with no pattern, centered around 0', hint: 'No curves, no fans, no trends.' },
        { prompt: 'A residual plot shows a funnel shape (spreading out). What\'s the issue?', answer: 'heteroscedasticity: variance of residuals is not constant', hint: 'Non-constant variance violates an assumption.' },
        { prompt: 'Sum of residuals for a least-squares line is always...', answer: '0', hint: 'A property of the least-squares line.' },
      ],
    },
    'inference-for-slope': {
      problems: [
        { prompt: 'H0 for testing if there is a linear relationship?', answer: 'H0: β = 0 (slope is zero, no linear relationship)', hint: 'β = 0 means x does not predict y.' },
        { prompt: 'Conditions for inference about slope?', answer: 'linearity, independence, normal residuals, equal variance', hint: 'LINE: Linear, Independent, Normal, Equal variance.' },
        { prompt: 't-statistic for slope: b = 2.5, SE(b) = 0.5. t = ?', answer: '5', hint: 't = b/SE(b) = 2.5/0.5.' },
        { prompt: 'p-value for t=5 with df=30 is very small. Conclusion?', answer: 'reject H0; strong evidence of a linear relationship', hint: 'Large t = small p = reject H0.' },
        { prompt: '95% CI for slope: b ± t*×SE(b). b=3, SE=0.8, t*=2.1. Find CI.', answer: '(1.32, 4.68)', hint: '3 ± 2.1(0.8) = 3 ± 1.68.' },
      ],
    },
  },
};

const LESSON_CONTEXTS = {
  'descriptive': [
    { title: 'Understanding Data', focus: 'center and spread', context: 'Before any analysis, we need to understand our data: what\'s typical? how spread out? any unusual values? This is the foundation of all statistics.' },
    { title: 'Visualizing Distributions', focus: 'displays and shape', context: 'A picture is worth a thousand data points. The right display reveals patterns that numbers alone can hide.' },
    { title: 'Comparing Groups', focus: 'comparative analysis', context: 'Statistics often asks: "Is this group different from that group?" Comparing distributions is how we start to answer.' },
  ],
  'probability': [
    { title: 'Chance and Randomness', focus: 'sample spaces and basic rules', context: 'Probability is the language of uncertainty. It lets us quantify how likely events are in a random world.' },
    { title: 'Counting and Distributions', focus: 'combinatorics and probability models', context: 'Many probability problems boil down to systematic counting. Distributions give us ready-made models for common scenarios.' },
    { title: 'The Normal Distribution', focus: 'normal curve and z-scores', context: 'The normal distribution appears everywhere in nature and statistics. Understanding it is essential for inference.' },
  ],
  'inference': [
    { title: 'From Sample to Population', focus: 'sampling and estimation', context: 'We almost never see the whole population. Inference lets us draw conclusions about the many from the few.' },
    { title: 'Confidence and Testing', focus: 'confidence intervals and hypothesis tests', context: 'Confidence intervals tell us the range of plausible values. Hypothesis tests tell us whether an effect is real or just noise.' },
    { title: 'Relationships and Models', focus: 'regression and chi-square', context: 'Is there a pattern? Is it real? Regression and chi-square tests help us find and validate relationships in data.' },
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

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 /.%≈()\-,'"]/g, ''); }

// Exercise generation

function exResult(type, skill, level, instruction, items) { return { type, skill, level, count: items.length, instruction, items }; }

function generateExercise(level, skill, count = 5) {
  const bank = PROBLEM_BANKS[level]?.[skill];
  if (!bank || !bank.problems) return { error: `No problem bank for ${level}/${skill}` };
  return exResult('solve', skill, level, 'Solve the following problem. Always interpret in context.',
    pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer, hint: p.hint })));
}

// Answer checking

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
}

// Public API

class HSStatistics {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, level: p.level, createdAt: p.createdAt, totalAssessments: p.assessments.length };
  }

  setLevel(id, level) {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    const p = loadProfile(id); p.level = level; saveProfile(p);
    return { studentId: id, level };
  }

  recordAssessment(id, level, category, skill, score, total, notes = '') {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}`);
    if (!SKILLS[level][category]) throw new Error(`Unknown category '${category}' for ${level}`);
    if (!SKILLS[level][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${level}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);

    const p = loadProfile(id);
    if (!p.level) p.level = level;
    const entry = { date: new Date().toISOString(), level, category, skill, score, total, notes };
    p.assessments.push(entry);
    const key = `${level}/${category}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p);
    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const level = p.level || 'descriptive';
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

  getNextSkills(id, count = 5) {
    const p = loadProfile(id);
    const level = p.level || 'descriptive';
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

  getReport(id) {
    const p = loadProfile(id);
    return { studentId: id, level: p.level, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }

  getSkillCatalog(level) {
    const ls = SKILLS[level];
    if (!ls) return { level, error: `Unknown level. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0;
    const catalog = {};
    for (const [cat, skills] of Object.entries(ls)) { total += skills.length; catalog[cat] = [...skills]; }
    return { level, skills: catalog, totalSkills: total };
  }

  generateExercise(level, skill, count = 5) { return generateExercise(level, skill, count); }

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  generateLesson(id) {
    const p = loadProfile(id);
    const level = p.level || 'descriptive';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Ready for next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    const contexts = LESSON_CONTEXTS[level] || [];
    const context = contexts.length ? pick(contexts, 1)[0] : null;
    return {
      studentId: id, level, targetSkill: target, exercise, lessonContext: context,
      lessonPlan: {
        review: 'Review prerequisite concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: context ? `Context: ${context.context}` : 'Apply to real data scenarios',
        interpret: 'Always interpret results in context — numbers without context are meaningless in statistics',
      },
    };
  }
}

module.exports = HSStatistics;

// CLI: node statistics.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const st = new HSStatistics();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, level] = args;
        if (!id) throw new Error('Usage: start <id> [level]');
        if (level) st.setLevel(id, level);
        out({ action: 'start', profile: st.getProfile(id), nextSkills: st.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(st.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, type] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const level = loadProfile(id).level || 'descriptive';
        if (type) { out(st.generateExercise(level, type, 5)); }
        else { const n = st.getNextSkills(id, 1).next; out(n.length ? st.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient at current level!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(st.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, level, cat, skill, sc, tot, ...notes] = args;
        if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total> [notes]');
        out(st.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(st.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(st.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(st.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? st.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'students': { out(st.listStudents()); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(st.setLevel(id, l)); break; }
      default: out({ usage: 'node statistics.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
