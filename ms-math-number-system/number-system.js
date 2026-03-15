// eClaw MS Math Number System Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-math-number-system');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'fraction-operations': ['dividing-fractions', 'multi-digit-operations', 'decimal-operations'],
    'factors-multiples': ['gcf', 'lcm', 'distributive-property'],
    'integers': ['integers-number-line', 'absolute-value', 'ordering-integers'],
    'coordinate-plane': ['four-quadrant-plotting', 'coordinate-distance'],
  },
  'grade-7': {
    'integer-operations': ['adding-integers', 'subtracting-integers', 'multiplying-integers', 'dividing-integers'],
    'rational-operations': ['rational-addition', 'rational-multiplication', 'rational-division'],
    'conversions': ['fraction-decimal', 'decimal-percent', 'fraction-percent'],
    'properties': ['additive-inverse', 'multiplicative-inverse', 'operation-properties'],
  },
  'grade-8': {
    'number-classification': ['rational-vs-irrational', 'classifying-reals'],
    'irrational-numbers': ['approximating-square-roots', 'locating-irrationals'],
    'scientific-notation': ['converting-to-sci-notation', 'converting-from-sci-notation', 'sci-notation-operations'],
  },
};

const PROBLEM_BANKS = {
  'grade-6': {
    'dividing-fractions': {
      problems: [
        { prompt: 'Compute: 2/3 ÷ 1/4', answer: '8/3', numeric: 8/3, hint: 'Keep-Change-Flip: 2/3 × 4/1' },
        { prompt: 'Compute: 3/5 ÷ 2/5', answer: '3/2', numeric: 1.5, hint: 'Same denominator: 3÷2' },
        { prompt: 'Compute: 7/8 ÷ 1/2', answer: '7/4', numeric: 7/4, hint: '7/8 × 2/1' },
        { prompt: 'Compute: 4/9 ÷ 2/3', answer: '2/3', numeric: 2/3, hint: '4/9 × 3/2 = 12/18 = 2/3' },
        { prompt: 'Compute: 5/6 ÷ 5/12', answer: '2', numeric: 2, hint: '5/6 × 12/5 = 60/30 = 2' },
        { prompt: 'Compute: 1/3 ÷ 2/9', answer: '3/2', numeric: 1.5, hint: '1/3 × 9/2 = 9/6 = 3/2' },
        { prompt: 'Compute: 3/4 ÷ 3/8', answer: '2', numeric: 2, hint: '3/4 × 8/3 = 24/12 = 2' },
        { prompt: 'Compute: 2/7 ÷ 4/7', answer: '1/2', numeric: 0.5, hint: 'Same denom: 2÷4 = 1/2' },
      ],
    },
    'multi-digit-operations': {
      problems: [
        { prompt: 'Compute: 234 × 56', answer: '13104', numeric: 13104 },
        { prompt: 'Compute: 4368 ÷ 12', answer: '364', numeric: 364 },
        { prompt: 'Compute: 1575 ÷ 25', answer: '63', numeric: 63 },
        { prompt: 'Compute: 847 × 23', answer: '19481', numeric: 19481 },
        { prompt: 'Compute: 9126 ÷ 18', answer: '507', numeric: 507 },
        { prompt: 'Compute: 365 × 48', answer: '17520', numeric: 17520 },
      ],
    },
    'decimal-operations': {
      problems: [
        { prompt: 'Compute: 3.45 + 2.678', answer: '6.128', numeric: 6.128 },
        { prompt: 'Compute: 10.5 - 3.27', answer: '7.23', numeric: 7.23 },
        { prompt: 'Compute: 2.4 × 3.5', answer: '8.4', numeric: 8.4 },
        { prompt: 'Compute: 7.56 ÷ 1.2', answer: '6.3', numeric: 6.3 },
        { prompt: 'Compute: 0.125 × 8', answer: '1', numeric: 1 },
        { prompt: 'Compute: 15.6 ÷ 0.4', answer: '39', numeric: 39 },
      ],
    },
    'gcf': {
      problems: [
        { prompt: 'Find the GCF of 12 and 18', answer: '6', numeric: 6 },
        { prompt: 'Find the GCF of 24 and 36', answer: '12', numeric: 12 },
        { prompt: 'Find the GCF of 15 and 35', answer: '5', numeric: 5 },
        { prompt: 'Find the GCF of 28 and 42', answer: '14', numeric: 14 },
        { prompt: 'Find the GCF of 48 and 60', answer: '12', numeric: 12 },
        { prompt: 'Find the GCF of 30 and 45', answer: '15', numeric: 15 },
      ],
    },
    'lcm': {
      problems: [
        { prompt: 'Find the LCM of 4 and 6', answer: '12', numeric: 12 },
        { prompt: 'Find the LCM of 8 and 12', answer: '24', numeric: 24 },
        { prompt: 'Find the LCM of 5 and 7', answer: '35', numeric: 35 },
        { prompt: 'Find the LCM of 6 and 9', answer: '18', numeric: 18 },
        { prompt: 'Find the LCM of 10 and 15', answer: '30', numeric: 30 },
        { prompt: 'Find the LCM of 12 and 16', answer: '48', numeric: 48 },
      ],
    },
    'distributive-property': {
      problems: [
        { prompt: 'Use distributive property: 3(4 + 5)', answer: '27', numeric: 27, hint: '3×4 + 3×5 = 12+15' },
        { prompt: 'Use distributive property: 6(10 + 3)', answer: '78', numeric: 78, hint: '60+18' },
        { prompt: 'Rewrite using GCF: 24 + 36', answer: '12(2+3)', hint: 'GCF is 12' },
        { prompt: 'Use distributive property: 5(20 - 3)', answer: '85', numeric: 85, hint: '100-15' },
        { prompt: 'Rewrite using GCF: 18 + 27', answer: '9(2+3)', hint: 'GCF is 9' },
        { prompt: 'Use distributive property: 8(7 + 2)', answer: '72', numeric: 72 },
      ],
    },
    'integers-number-line': {
      problems: [
        { prompt: 'Order from least to greatest: 3, -5, 0, -2, 7', answer: '-5, -2, 0, 3, 7' },
        { prompt: 'Which is greater: -4 or -9?', answer: '-4', hint: '-4 is closer to zero' },
        { prompt: 'Order from least to greatest: -1, 4, -6, 2, -3', answer: '-6, -3, -1, 2, 4' },
        { prompt: 'Which is greater: -12 or -3?', answer: '-3', hint: '-3 is closer to zero' },
        { prompt: 'Place on number line: -7 is to the ___ of -2', answer: 'left' },
        { prompt: 'What integer is 5 units left of 3 on the number line?', answer: '-2', numeric: -2 },
      ],
    },
    'absolute-value': {
      problems: [
        { prompt: 'Evaluate: |-8|', answer: '8', numeric: 8 },
        { prompt: 'Evaluate: |5|', answer: '5', numeric: 5 },
        { prompt: 'Evaluate: |-3| + |4|', answer: '7', numeric: 7 },
        { prompt: 'Evaluate: |7 - 12|', answer: '5', numeric: 5 },
        { prompt: 'Evaluate: |-6| - |-2|', answer: '4', numeric: 4 },
        { prompt: 'Which has greater absolute value: -9 or 7?', answer: '-9', hint: '|-9|=9 > |7|=7' },
        { prompt: 'Evaluate: |-15|', answer: '15', numeric: 15 },
        { prompt: 'Evaluate: |0|', answer: '0', numeric: 0 },
      ],
    },
    'ordering-integers': {
      problems: [
        { prompt: 'Order from least to greatest: -8, 3, -1, 0, 5, -5', answer: '-8, -5, -1, 0, 3, 5' },
        { prompt: 'Insert < or >: -7 ___ -3', answer: '<' },
        { prompt: 'Insert < or >: 0 ___ -4', answer: '>' },
        { prompt: 'What integer is between -5 and -3?', answer: '-4', numeric: -4 },
        { prompt: 'Insert < or >: -10 ___ -15', answer: '>' },
        { prompt: 'Order from greatest to least: -2, 6, -9, 1', answer: '6, 1, -2, -9' },
      ],
    },
    'four-quadrant-plotting': {
      problems: [
        { prompt: 'What quadrant is the point (3, -2) in?', answer: 'IV', hint: 'Positive x, negative y' },
        { prompt: 'What quadrant is the point (-4, 5) in?', answer: 'II' },
        { prompt: 'What quadrant is the point (-1, -3) in?', answer: 'III' },
        { prompt: 'What quadrant is the point (2, 7) in?', answer: 'I' },
        { prompt: 'The point (0, -5) lies on which axis?', answer: 'y-axis' },
        { prompt: 'What are the coordinates of the origin?', answer: '(0, 0)' },
      ],
    },
    'coordinate-distance': {
      problems: [
        { prompt: 'Distance between (2, 0) and (-3, 0)?', answer: '5', numeric: 5 },
        { prompt: 'Distance between (0, 4) and (0, -2)?', answer: '6', numeric: 6 },
        { prompt: 'Distance between (-1, 3) and (4, 3)?', answer: '5', numeric: 5 },
        { prompt: 'Distance between (-3, -1) and (-3, 5)?', answer: '6', numeric: 6 },
        { prompt: 'Distance between (7, 2) and (7, -4)?', answer: '6', numeric: 6 },
        { prompt: 'Distance between (-5, 0) and (3, 0)?', answer: '8', numeric: 8 },
      ],
    },
  },
  'grade-7': {
    'adding-integers': {
      problems: [
        { prompt: 'Compute: -5 + 8', answer: '3', numeric: 3 },
        { prompt: 'Compute: -12 + (-7)', answer: '-19', numeric: -19 },
        { prompt: 'Compute: 15 + (-20)', answer: '-5', numeric: -5 },
        { prompt: 'Compute: -9 + 9', answer: '0', numeric: 0 },
        { prompt: 'Compute: -3 + (-8) + 6', answer: '-5', numeric: -5 },
        { prompt: 'Compute: 25 + (-13)', answer: '12', numeric: 12 },
        { prompt: 'Compute: -7 + (-4) + 11', answer: '0', numeric: 0 },
        { prompt: 'Compute: -100 + 45', answer: '-55', numeric: -55 },
      ],
    },
    'subtracting-integers': {
      problems: [
        { prompt: 'Compute: 5 - 12', answer: '-7', numeric: -7 },
        { prompt: 'Compute: -8 - 3', answer: '-11', numeric: -11 },
        { prompt: 'Compute: -4 - (-9)', answer: '5', numeric: 5 },
        { prompt: 'Compute: 0 - (-6)', answer: '6', numeric: 6 },
        { prompt: 'Compute: -15 - (-15)', answer: '0', numeric: 0 },
        { prompt: 'Compute: 7 - (-3)', answer: '10', numeric: 10 },
        { prompt: 'Compute: -20 - 5', answer: '-25', numeric: -25 },
        { prompt: 'Compute: -1 - (-8)', answer: '7', numeric: 7 },
      ],
    },
    'multiplying-integers': {
      problems: [
        { prompt: 'Compute: -6 × 7', answer: '-42', numeric: -42 },
        { prompt: 'Compute: -4 × (-9)', answer: '36', numeric: 36 },
        { prompt: 'Compute: 8 × (-5)', answer: '-40', numeric: -40 },
        { prompt: 'Compute: -3 × (-3) × (-1)', answer: '-9', numeric: -9 },
        { prompt: 'Compute: -12 × 0', answer: '0', numeric: 0 },
        { prompt: 'Compute: -2 × (-5) × 4', answer: '40', numeric: 40 },
        { prompt: 'Compute: (-7) × (-8)', answer: '56', numeric: 56 },
        { prompt: 'Compute: 11 × (-3)', answer: '-33', numeric: -33 },
      ],
    },
    'dividing-integers': {
      problems: [
        { prompt: 'Compute: -24 ÷ 6', answer: '-4', numeric: -4 },
        { prompt: 'Compute: -36 ÷ (-9)', answer: '4', numeric: 4 },
        { prompt: 'Compute: 45 ÷ (-5)', answer: '-9', numeric: -9 },
        { prompt: 'Compute: -56 ÷ (-8)', answer: '7', numeric: 7 },
        { prompt: 'Compute: 0 ÷ (-3)', answer: '0', numeric: 0 },
        { prompt: 'Compute: -72 ÷ 8', answer: '-9', numeric: -9 },
        { prompt: 'Compute: -100 ÷ (-25)', answer: '4', numeric: 4 },
        { prompt: 'Compute: 63 ÷ (-7)', answer: '-9', numeric: -9 },
      ],
    },
    'rational-addition': {
      problems: [
        { prompt: 'Compute: -3/4 + 1/2', answer: '-1/4', numeric: -0.25 },
        { prompt: 'Compute: 2/3 + (-5/6)', answer: '-1/6', numeric: -1/6 },
        { prompt: 'Compute: -1/5 + (-3/10)', answer: '-1/2', numeric: -0.5, hint: 'LCD=10: -2/10 + -3/10' },
        { prompt: 'Compute: 3/8 + (-1/4)', answer: '1/8', numeric: 0.125 },
        { prompt: 'Compute: -2.5 + 1.75', answer: '-0.75', numeric: -0.75 },
        { prompt: 'Compute: -1/3 + 5/6', answer: '1/2', numeric: 0.5 },
        { prompt: 'Compute: -4.2 + (-3.8)', answer: '-8', numeric: -8 },
        { prompt: 'Compute: 7/10 + (-3/5)', answer: '1/10', numeric: 0.1 },
      ],
    },
    'rational-multiplication': {
      problems: [
        { prompt: 'Compute: -2/3 × 3/4', answer: '-1/2', numeric: -0.5 },
        { prompt: 'Compute: -5/6 × (-3/10)', answer: '1/4', numeric: 0.25 },
        { prompt: 'Compute: 4/7 × (-7/8)', answer: '-1/2', numeric: -0.5 },
        { prompt: 'Compute: -1.5 × 4', answer: '-6', numeric: -6 },
        { prompt: 'Compute: -2/5 × (-5/2)', answer: '1', numeric: 1 },
        { prompt: 'Compute: 0.3 × (-0.7)', answer: '-0.21', numeric: -0.21 },
      ],
    },
    'rational-division': {
      problems: [
        { prompt: 'Compute: -3/4 ÷ 1/2', answer: '-3/2', numeric: -1.5 },
        { prompt: 'Compute: 5/6 ÷ (-2/3)', answer: '-5/4', numeric: -1.25 },
        { prompt: 'Compute: -7/8 ÷ (-7/4)', answer: '1/2', numeric: 0.5 },
        { prompt: 'Compute: -2.4 ÷ 0.6', answer: '-4', numeric: -4 },
        { prompt: 'Compute: 4/9 ÷ (-8/3)', answer: '-1/6', numeric: -1/6 },
        { prompt: 'Compute: -1/3 ÷ (-2/9)', answer: '3/2', numeric: 1.5 },
      ],
    },
    'fraction-decimal': {
      problems: [
        { prompt: 'Convert 3/8 to a decimal', answer: '0.375', numeric: 0.375 },
        { prompt: 'Convert 0.6 to a fraction in simplest form', answer: '3/5' },
        { prompt: 'Convert 5/11 to a decimal (round to 3 places)', answer: '0.455', numeric: 0.455 },
        { prompt: 'Convert 0.125 to a fraction in simplest form', answer: '1/8' },
        { prompt: 'Convert 7/20 to a decimal', answer: '0.35', numeric: 0.35 },
        { prompt: 'Convert 2/9 to a repeating decimal', answer: '0.222...', hint: '2÷9=0.2 repeating' },
      ],
    },
    'decimal-percent': {
      problems: [
        { prompt: 'Convert 0.45 to a percent', answer: '45%' },
        { prompt: 'Convert 72% to a decimal', answer: '0.72', numeric: 0.72 },
        { prompt: 'Convert 0.08 to a percent', answer: '8%' },
        { prompt: 'Convert 125% to a decimal', answer: '1.25', numeric: 1.25 },
        { prompt: 'Convert 0.005 to a percent', answer: '0.5%' },
        { prompt: 'Convert 33.3% to a decimal', answer: '0.333', numeric: 0.333 },
      ],
    },
    'fraction-percent': {
      problems: [
        { prompt: 'Convert 3/4 to a percent', answer: '75%' },
        { prompt: 'Convert 40% to a fraction in simplest form', answer: '2/5' },
        { prompt: 'Convert 1/8 to a percent', answer: '12.5%' },
        { prompt: 'Convert 60% to a fraction in simplest form', answer: '3/5' },
        { prompt: 'Convert 5/6 to a percent (round to 1 decimal)', answer: '83.3%' },
        { prompt: 'Convert 150% to a fraction', answer: '3/2' },
      ],
    },
    'additive-inverse': {
      problems: [
        { prompt: 'What is the additive inverse of 7?', answer: '-7', numeric: -7 },
        { prompt: 'What is the additive inverse of -3/4?', answer: '3/4' },
        { prompt: 'Verify: 5 + (-5) = ?', answer: '0', numeric: 0 },
        { prompt: 'What is the additive inverse of -12?', answer: '12', numeric: 12 },
        { prompt: 'What is the additive inverse of 0?', answer: '0', numeric: 0 },
        { prompt: 'Verify: -2.5 + 2.5 = ?', answer: '0', numeric: 0 },
      ],
    },
    'multiplicative-inverse': {
      problems: [
        { prompt: 'What is the multiplicative inverse of 5?', answer: '1/5' },
        { prompt: 'What is the multiplicative inverse of 2/3?', answer: '3/2' },
        { prompt: 'Verify: 4 × (1/4) = ?', answer: '1', numeric: 1 },
        { prompt: 'What is the multiplicative inverse of -7?', answer: '-1/7' },
        { prompt: 'What is the multiplicative inverse of -3/8?', answer: '-8/3' },
        { prompt: 'Does 0 have a multiplicative inverse?', answer: 'no', hint: 'Division by zero is undefined' },
      ],
    },
    'operation-properties': {
      problems: [
        { prompt: 'Name the property: a + b = b + a', answer: 'commutative' },
        { prompt: 'Name the property: (ab)c = a(bc)', answer: 'associative' },
        { prompt: 'Name the property: a(b + c) = ab + ac', answer: 'distributive' },
        { prompt: 'Name the property: a + 0 = a', answer: 'identity' },
        { prompt: 'Name the property: a × 1 = a', answer: 'identity' },
        { prompt: 'Is subtraction commutative? Give an example.', answer: 'no', hint: '5-3=2 but 3-5=-2' },
      ],
    },
  },
  'grade-8': {
    'rational-vs-irrational': {
      problems: [
        { prompt: 'Is √9 rational or irrational?', answer: 'rational', hint: '√9 = 3' },
        { prompt: 'Is √2 rational or irrational?', answer: 'irrational' },
        { prompt: 'Is 0.333... rational or irrational?', answer: 'rational', hint: '0.333... = 1/3' },
        { prompt: 'Is π rational or irrational?', answer: 'irrational' },
        { prompt: 'Is √(49/16) rational or irrational?', answer: 'rational', hint: '= 7/4' },
        { prompt: 'Is √5 rational or irrational?', answer: 'irrational' },
        { prompt: 'Is 0.121212... rational or irrational?', answer: 'rational', hint: 'Repeating = rational' },
        { prompt: 'Is √(1/4) rational or irrational?', answer: 'rational', hint: '= 1/2' },
      ],
    },
    'classifying-reals': {
      problems: [
        { prompt: 'Classify -7: natural, whole, integer, rational, or irrational?', answer: 'integer, rational', hint: 'Negative, so not natural or whole' },
        { prompt: 'Classify 0: natural, whole, integer, rational, or irrational?', answer: 'whole, integer, rational' },
        { prompt: 'Classify 3/5: natural, whole, integer, rational, or irrational?', answer: 'rational' },
        { prompt: 'Classify √10: rational or irrational?', answer: 'irrational' },
        { prompt: 'Classify 8: natural, whole, integer, or rational?', answer: 'natural, whole, integer, rational' },
        { prompt: 'Classify -2.5: integer, rational, or irrational?', answer: 'rational' },
      ],
    },
    'approximating-square-roots': {
      problems: [
        { prompt: '√10 is between which two consecutive integers?', answer: '3 and 4', hint: '3²=9, 4²=16' },
        { prompt: '√50 is between which two consecutive integers?', answer: '7 and 8', hint: '7²=49, 8²=64' },
        { prompt: 'Approximate √20 to one decimal place', answer: '4.5', numeric: 4.5, hint: '4.4²=19.36, 4.5²=20.25' },
        { prompt: '√30 is between which two consecutive integers?', answer: '5 and 6', hint: '5²=25, 6²=36' },
        { prompt: 'Approximate √8 to one decimal place', answer: '2.8', numeric: 2.8, hint: '2.8²=7.84, 2.9²=8.41' },
        { prompt: '√75 is between which two consecutive integers?', answer: '8 and 9', hint: '8²=64, 9²=81' },
      ],
    },
    'locating-irrationals': {
      problems: [
        { prompt: 'Which is closer to √15: 3.8 or 3.9?', answer: '3.9', hint: '3.8²=14.44, 3.9²=15.21' },
        { prompt: 'Place √3 on a number line. Between which tenths?', answer: '1.7 and 1.8', hint: '1.7²=2.89, 1.8²=3.24' },
        { prompt: 'Which is greater: √7 or 2.6?', answer: '√7', hint: '2.6²=6.76, √7≈2.646' },
        { prompt: 'Order: √5, 2.3, 2.2', answer: '2.2, √5, 2.3', hint: '√5≈2.236' },
        { prompt: 'Is 3.14 greater or less than π?', answer: 'less', hint: 'π≈3.14159...' },
        { prompt: 'Which is greater: √12 or 3.5?', answer: '3.5', hint: '3.5²=12.25 > 12' },
      ],
    },
    'converting-to-sci-notation': {
      problems: [
        { prompt: 'Write 45000 in scientific notation', answer: '4.5 × 10^4' },
        { prompt: 'Write 0.0032 in scientific notation', answer: '3.2 × 10^-3' },
        { prompt: 'Write 7800000 in scientific notation', answer: '7.8 × 10^6' },
        { prompt: 'Write 0.00056 in scientific notation', answer: '5.6 × 10^-4' },
        { prompt: 'Write 920 in scientific notation', answer: '9.2 × 10^2' },
        { prompt: 'Write 0.107 in scientific notation', answer: '1.07 × 10^-1' },
      ],
    },
    'converting-from-sci-notation': {
      problems: [
        { prompt: 'Write 3.6 × 10^5 in standard form', answer: '360000', numeric: 360000 },
        { prompt: 'Write 2.1 × 10^-3 in standard form', answer: '0.0021', numeric: 0.0021 },
        { prompt: 'Write 8.04 × 10^7 in standard form', answer: '80400000', numeric: 80400000 },
        { prompt: 'Write 5.5 × 10^-2 in standard form', answer: '0.055', numeric: 0.055 },
        { prompt: 'Write 1.0 × 10^0 in standard form', answer: '1', numeric: 1 },
        { prompt: 'Write 9.99 × 10^4 in standard form', answer: '99900', numeric: 99900 },
      ],
    },
    'sci-notation-operations': {
      problems: [
        { prompt: '(3 × 10^4) × (2 × 10^3) = ?', answer: '6 × 10^7', hint: 'Multiply coefficients, add exponents' },
        { prompt: '(8 × 10^6) ÷ (4 × 10^2) = ?', answer: '2 × 10^4', hint: 'Divide coefficients, subtract exponents' },
        { prompt: '(5 × 10^3) × (3 × 10^-2) = ?', answer: '1.5 × 10^2', hint: '15 × 10^1 = 1.5 × 10^2' },
        { prompt: '(6 × 10^5) ÷ (3 × 10^-1) = ?', answer: '2 × 10^6', hint: '6÷3=2, 5-(-1)=6' },
        { prompt: '(2.5 × 10^4) + (3.0 × 10^3) = ?', answer: '2.8 × 10^4', hint: 'Match exponents: 2.5 + 0.3 = 2.8' },
        { prompt: '(7 × 10^8) × (4 × 10^-3) = ?', answer: '2.8 × 10^6', hint: '28 × 10^5 = 2.8 × 10^6' },
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
  return { type: 'number-system', skill, grade, count: items.length, instruction: 'Solve each problem. Show your work.', items };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  const ne = norm(expected);
  const na = norm(answer);
  if (ne === na) return true;
  // Try numeric comparison
  const numE = parseFloat(expected);
  const numA = parseFloat(answer);
  if (!isNaN(numE) && !isNaN(numA) && Math.abs(numE - numA) < 0.01) return true;
  // Flexible matching for common equivalents
  if (ne.replace(/\s/g, '') === na.replace(/\s/g, '')) return true;
  return false;
}

// Public API

class NumberSystem {
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
        review: 'Review previously learned number concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Apply concept to a real-world context',
      },
    };
  }
}

module.exports = NumberSystem;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new NumberSystem();
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
      default: out({ usage: 'node number-system.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
