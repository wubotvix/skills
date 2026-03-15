// Math Fractions Interactive Tutor (K-6). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'math-fractions');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'equal-shares': ['halves-of-shapes', 'quarters-of-shapes'],
    'fair-sharing': ['share-among-2', 'share-among-4'],
  },
  'grade-1': {
    'partitioning': ['halves', 'fourths'],
    'fraction-of-group': ['half-of-set', 'fourth-of-set'],
  },
  'grade-2': {
    'partition-shapes': ['equal-parts-id', 'partition-rectangles'],
    'unit-fractions-intro': ['unit-fractions-on-number-line', 'fraction-notation'],
  },
  'grade-3': {
    'unit-fractions': ['identify-unit-fractions', 'fractions-on-number-line'],
    'comparing': ['compare-same-denominator', 'compare-to-benchmark'],
    'equivalence': ['equivalent-fractions-visual', 'whole-numbers-as-fractions'],
  },
  'grade-4': {
    'equivalent-fractions': ['generate-equivalent', 'simplify-fractions'],
    'comparing-unlike': ['compare-unlike-denominators', 'order-fractions'],
    'mixed-numbers': ['improper-to-mixed', 'mixed-to-improper'],
    'add-subtract-like': ['add-like-denom', 'subtract-like-denom'],
    'multiply-whole': ['fraction-times-whole'],
    'decimals-intro': ['tenths', 'hundredths'],
  },
  'grade-5': {
    'add-subtract-unlike': ['add-unlike-denom', 'subtract-unlike-denom'],
    'mixed-number-ops': ['add-mixed-numbers', 'subtract-mixed-numbers'],
    'multiply-fractions': ['fraction-times-fraction', 'multiply-mixed'],
    'divide-fractions-intro': ['whole-divided-by-fraction', 'fraction-divided-by-whole'],
    'decimal-ops': ['add-decimals', 'subtract-decimals', 'multiply-decimals'],
  },
  'grade-6': {
    'divide-fractions': ['fraction-divided-by-fraction'],
    'percent-equivalence': ['fraction-to-percent', 'percent-to-fraction'],
    'ratios': ['ratio-identify', 'unit-rate'],
    'percent-problems': ['percent-of-number', 'find-the-percent'],
  },
};

const PROBLEM_BANKS = {
  'kindergarten': {
    'halves-of-shapes': {
      problems: [
        { prompt: 'A circle is cut into 2 equal pieces. How many halves is that?', answer: '2' },
        { prompt: 'You cut a sandwich into 2 equal parts. What is each part called?', answer: 'half' },
        { prompt: 'A square is split into 2 equal parts. Is each part a half? (yes/no)', answer: 'yes' },
        { prompt: 'If you share a cookie equally with 1 friend, how many pieces do you each get?', answer: '1' },
        { prompt: 'A rectangle is divided into 2 parts. One is big and one is small. Are they halves? (yes/no)', answer: 'no' },
        { prompt: 'How many halves make a whole?', answer: '2' },
        { prompt: 'You fold a piece of paper in half. How many equal parts are there?', answer: '2' },
        { prompt: 'A pizza is cut into 2 equal slices. What fraction is one slice?', answer: '1/2' },
        { prompt: 'True or false: A half means 2 equal parts. (true/false)', answer: 'true' },
        { prompt: 'You eat half a banana. How many halves are left?', answer: '1' },
        { prompt: 'A heart shape is cut into 2 equal pieces. Is each piece a half? (yes/no)', answer: 'yes' },
        { prompt: 'How many halves does a whole apple have?', answer: '2' },
        { prompt: 'You have half a glass of water. How many more halves to fill it?', answer: '1' },
        { prompt: 'A triangle is folded into 2 equal parts. Each part is a ___?', answer: 'half' },
        { prompt: 'If 2 halves are put together, what do you get?', answer: 'whole' },
      ],
    },
    'quarters-of-shapes': {
      problems: [
        { prompt: 'A square is cut into 4 equal pieces. What is each piece called?', answer: 'quarter' },
        { prompt: 'How many quarters make a whole?', answer: '4' },
        { prompt: 'A pizza has 4 equal slices. What fraction is one slice?', answer: '1/4' },
        { prompt: 'You fold a paper into 4 equal parts. How many parts do you have?', answer: '4' },
        { prompt: 'If you eat 1 quarter of a pie, how many quarters are left?', answer: '3' },
        { prompt: 'A circle is cut into 4 equal parts. Are the parts quarters? (yes/no)', answer: 'yes' },
        { prompt: '2 quarters of a shape is the same as how many halves?', answer: '1' },
        { prompt: 'How many quarters are in one half?', answer: '2' },
        { prompt: 'A rectangle is cut into 4 equal strips. What fraction is one strip?', answer: '1/4' },
        { prompt: 'You share a cake equally among 4 friends. Each friend gets one ___?', answer: 'quarter' },
        { prompt: 'How many equal parts does a quarter divide a shape into?', answer: '4' },
        { prompt: 'True or false: 4 quarters make a whole. (true/false)', answer: 'true' },
        { prompt: 'If a square has 4 equal parts and 2 are shaded, how many quarters are shaded?', answer: '2' },
        { prompt: 'A window has 4 equal panes. What fraction is each pane?', answer: '1/4' },
        { prompt: '3 quarters of a pie is how many pieces out of 4?', answer: '3' },
      ],
    },
    'share-among-2': {
      problems: [
        { prompt: 'Share 4 apples equally between 2 friends. How many does each get?', answer: '2' },
        { prompt: 'Share 6 stickers equally between 2 kids. How many each?', answer: '3' },
        { prompt: 'Share 10 grapes between 2 bowls. How many in each bowl?', answer: '5' },
        { prompt: 'Share 8 crackers equally between 2 plates. How many on each?', answer: '4' },
        { prompt: 'Share 2 cookies between 2 friends. How many each?', answer: '1' },
        { prompt: 'Share 12 berries equally into 2 groups. How many in each?', answer: '6' },
        { prompt: 'You have 14 blocks. Split them into 2 equal piles. How many in each pile?', answer: '7' },
        { prompt: 'Share 16 crayons between 2 boxes. How many in each box?', answer: '8' },
        { prompt: 'Share 20 pennies between 2 piggy banks. How many in each?', answer: '10' },
        { prompt: 'Share 18 raisins equally between 2 cups. How many in each?', answer: '9' },
        { prompt: 'You have 6 toy cars and 2 friends. How many does each friend get?', answer: '3' },
        { prompt: 'Share 100 dots between 2 groups. How many in each?', answer: '50' },
        { prompt: 'Share 8 fish equally into 2 tanks. How many in each tank?', answer: '4' },
        { prompt: 'Split 10 markers into 2 equal sets. How many in each set?', answer: '5' },
        { prompt: 'Share 4 slices of bread between 2 people. How many each?', answer: '2' },
      ],
    },
    'share-among-4': {
      problems: [
        { prompt: 'Share 8 candies equally among 4 kids. How many each?', answer: '2' },
        { prompt: 'Share 12 stickers among 4 friends. How many each?', answer: '3' },
        { prompt: 'Share 16 blocks among 4 piles. How many in each pile?', answer: '4' },
        { prompt: 'Share 4 cookies among 4 people. How many each?', answer: '1' },
        { prompt: 'Share 20 grapes among 4 bowls. How many in each bowl?', answer: '5' },
        { prompt: 'Share 24 cards among 4 players. How many each?', answer: '6' },
        { prompt: 'Share 40 beads among 4 necklaces. How many on each?', answer: '10' },
        { prompt: 'Share 28 crayons among 4 boxes. How many in each box?', answer: '7' },
        { prompt: 'Share 32 apples among 4 baskets. How many in each?', answer: '8' },
        { prompt: 'Share 36 flowers among 4 vases. How many in each vase?', answer: '9' },
        { prompt: 'You have 8 toy cars and 4 friends. How many does each friend get?', answer: '2' },
        { prompt: 'Share 12 fish among 4 tanks equally. How many in each tank?', answer: '3' },
        { prompt: 'Split 44 seeds into 4 equal groups. How many in each?', answer: '11' },
        { prompt: 'Share 48 marbles among 4 bags. How many in each bag?', answer: '12' },
        { prompt: 'Share 16 pencils equally among 4 desks. How many on each desk?', answer: '4' },
      ],
    },
  },
  'grade-1': {
    'halves': {
      problems: [
        { prompt: 'A rectangle is split into 2 equal parts. 1 part is shaded. What fraction is shaded?', answer: '1/2' },
        { prompt: 'How many halves make 1 whole?', answer: '2' },
        { prompt: 'Color half of 8 stars. How many stars do you color?', answer: '4' },
        { prompt: 'Half of 6 is?', answer: '3' },
        { prompt: 'Half of 10 is?', answer: '5' },
        { prompt: 'Half of 12 is?', answer: '6' },
        { prompt: 'Half of 4 is?', answer: '2' },
        { prompt: 'Half of 14 is?', answer: '7' },
        { prompt: 'Half of 20 is?', answer: '10' },
        { prompt: 'A shape is divided into 2 equal parts. Both are shaded. What fraction is shaded?', answer: '2/2' },
        { prompt: 'Is a shape split into a big piece and a small piece showing halves? (yes/no)', answer: 'no' },
        { prompt: 'Half of 16 is?', answer: '8' },
        { prompt: 'Half of 2 is?', answer: '1' },
        { prompt: 'Half of 18 is?', answer: '9' },
        { prompt: 'You eat half of 8 grapes. How many did you eat?', answer: '4' },
      ],
    },
    'fourths': {
      problems: [
        { prompt: 'A square is split into 4 equal parts. 1 is shaded. What fraction is shaded?', answer: '1/4' },
        { prompt: 'How many fourths make 1 whole?', answer: '4' },
        { prompt: 'A fourth of 8 is?', answer: '2' },
        { prompt: 'A fourth of 12 is?', answer: '3' },
        { prompt: 'A fourth of 20 is?', answer: '5' },
        { prompt: 'A fourth of 16 is?', answer: '4' },
        { prompt: '3 out of 4 equal parts are shaded. What fraction is shaded?', answer: '3/4' },
        { prompt: 'A fourth of 4 is?', answer: '1' },
        { prompt: 'A fourth of 24 is?', answer: '6' },
        { prompt: '2 fourths is the same as what simpler fraction?', answer: '1/2' },
        { prompt: 'A fourth of 40 is?', answer: '10' },
        { prompt: 'A circle is cut into 4 equal slices. You eat 2 slices. What fraction did you eat?', answer: '2/4' },
        { prompt: 'A fourth of 28 is?', answer: '7' },
        { prompt: 'A fourth of 32 is?', answer: '8' },
        { prompt: 'A fourth of 100 is?', answer: '25' },
      ],
    },
    'half-of-set': {
      problems: [
        { prompt: 'There are 6 cats. Half are sleeping. How many are sleeping?', answer: '3' },
        { prompt: 'There are 10 balloons. Half are red. How many red balloons?', answer: '5' },
        { prompt: 'There are 8 cookies. Half have sprinkles. How many have sprinkles?', answer: '4' },
        { prompt: 'There are 4 birds. Half fly away. How many fly away?', answer: '2' },
        { prompt: 'There are 12 eggs. Half are cracked. How many are cracked?', answer: '6' },
        { prompt: 'There are 14 pencils. Half are sharpened. How many are sharpened?', answer: '7' },
        { prompt: 'There are 16 flowers. Half are yellow. How many yellow flowers?', answer: '8' },
        { prompt: 'There are 20 fish. Half are goldfish. How many goldfish?', answer: '10' },
        { prompt: 'There are 2 shoes. Half is on the left foot. How many on the left?', answer: '1' },
        { prompt: 'There are 18 apples. Half are green. How many green apples?', answer: '9' },
        { prompt: 'There are 10 fingers. Half are on your left hand. How many?', answer: '5' },
        { prompt: 'There are 12 cups. Half are empty. How many are empty?', answer: '6' },
        { prompt: 'There are 8 socks. Half are blue. How many blue socks?', answer: '4' },
        { prompt: 'There are 6 candles. Half are lit. How many are lit?', answer: '3' },
        { prompt: 'There are 14 ducks. Half swim away. How many swim away?', answer: '7' },
      ],
    },
    'fourth-of-set': {
      problems: [
        { prompt: 'There are 8 apples. One fourth are red. How many are red?', answer: '2' },
        { prompt: 'There are 12 stars. One fourth are gold. How many gold stars?', answer: '3' },
        { prompt: 'There are 16 buttons. One fourth are round. How many round buttons?', answer: '4' },
        { prompt: 'There are 4 balls. One fourth is blue. How many blue balls?', answer: '1' },
        { prompt: 'There are 20 crayons. One fourth are broken. How many broken?', answer: '5' },
        { prompt: 'There are 24 flowers. One fourth are roses. How many roses?', answer: '6' },
        { prompt: 'There are 28 books. One fourth are on the shelf. How many on the shelf?', answer: '7' },
        { prompt: 'There are 40 beads. One fourth are green. How many green beads?', answer: '10' },
        { prompt: 'There are 32 tiles. One fourth are white. How many white tiles?', answer: '8' },
        { prompt: 'There are 36 cards. One fourth are face cards. How many face cards?', answer: '9' },
        { prompt: 'There are 12 cookies. One fourth have frosting. How many have frosting?', answer: '3' },
        { prompt: 'There are 8 slices of pizza. One fourth have mushrooms. How many?', answer: '2' },
        { prompt: 'There are 44 seeds. One fourth are planted. How many planted?', answer: '11' },
        { prompt: 'There are 48 stickers. One fourth are stars. How many star stickers?', answer: '12' },
        { prompt: 'There are 100 pennies. One fourth are old. How many old pennies?', answer: '25' },
      ],
    },
  },
  'grade-2': {
    'equal-parts-id': {
      problems: [
        { prompt: 'A rectangle has 3 equal rows. How many equal parts?', answer: '3' },
        { prompt: 'A circle is cut into 6 equal slices. How many equal parts?', answer: '6' },
        { prompt: 'A shape is cut into 2 unequal pieces. Does it show halves? (yes/no)', answer: 'no' },
        { prompt: 'A square is split into 4 equal squares. How many equal parts?', answer: '4' },
        { prompt: 'A bar is divided into 8 equal sections. How many equal parts?', answer: '8' },
        { prompt: 'A pie is cut into 3 equal slices. What fraction is one slice?', answer: '1/3' },
        { prompt: 'A rectangle is split into 5 equal strips. What fraction is one strip?', answer: '1/5' },
        { prompt: 'A shape has 4 parts but they are different sizes. Are they equal parts? (yes/no)', answer: 'no' },
        { prompt: 'A hexagon is divided into 6 equal triangles. What fraction is each triangle?', answer: '1/6' },
        { prompt: 'A bar is split into 2 equal halves. What fraction is each piece?', answer: '1/2' },
        { prompt: 'How many equal parts does a shape divided into thirds have?', answer: '3' },
        { prompt: 'A pizza has 8 equal slices. What fraction is 1 slice?', answer: '1/8' },
        { prompt: 'A flag is divided into 3 equal stripes. What fraction is each stripe?', answer: '1/3' },
        { prompt: 'A window has 6 equal panes. What fraction is 1 pane?', answer: '1/6' },
        { prompt: 'A chocolate bar has 10 equal pieces. What fraction is 1 piece?', answer: '1/10' },
      ],
    },
    'partition-rectangles': {
      problems: [
        { prompt: 'Partition a rectangle into 2 equal rows. How many parts?', answer: '2' },
        { prompt: 'Partition a rectangle into 3 equal columns. How many parts?', answer: '3' },
        { prompt: 'Partition a rectangle into 2 rows and 3 columns. How many parts?', answer: '6' },
        { prompt: 'Partition a rectangle into 2 rows and 2 columns. How many parts?', answer: '4' },
        { prompt: 'Partition a rectangle into 4 equal rows. How many parts?', answer: '4' },
        { prompt: 'Partition a rectangle into 3 rows and 2 columns. How many parts?', answer: '6' },
        { prompt: 'Partition a rectangle into 2 rows and 4 columns. How many parts?', answer: '8' },
        { prompt: 'A rectangle has 2 rows and 5 columns. How many equal parts?', answer: '10' },
        { prompt: 'A rectangle has 3 rows and 3 columns. How many equal parts?', answer: '9' },
        { prompt: 'A rectangle with 4 rows and 2 columns has how many equal parts?', answer: '8' },
        { prompt: 'Partition a rectangle into 5 equal rows. How many parts?', answer: '5' },
        { prompt: 'A rectangle with 3 rows and 4 columns has how many equal parts?', answer: '12' },
        { prompt: 'Partition a rectangle into 6 equal columns. How many parts?', answer: '6' },
        { prompt: 'A rectangle with 2 rows and 6 columns has how many equal parts?', answer: '12' },
        { prompt: 'A rectangle with 4 rows and 3 columns has how many equal parts?', answer: '12' },
      ],
    },
    'unit-fractions-on-number-line': {
      problems: [
        { prompt: 'What fraction is at the halfway point between 0 and 1?', answer: '1/2' },
        { prompt: 'The number line 0 to 1 is divided into 4 equal parts. What is the first mark?', answer: '1/4' },
        { prompt: 'The number line 0 to 1 is divided into 3 equal parts. What is the first mark?', answer: '1/3' },
        { prompt: 'Where is 1/2 on a number line from 0 to 1? (middle/end)', answer: 'middle' },
        { prompt: 'The number line 0 to 1 has 8 equal spaces. What is the first mark?', answer: '1/8' },
        { prompt: 'Is 1/4 closer to 0 or 1 on the number line?', answer: '0' },
        { prompt: 'Is 3/4 closer to 0 or 1 on the number line?', answer: '1' },
        { prompt: 'On a number line from 0 to 1 divided into 6 parts, what is the first mark?', answer: '1/6' },
        { prompt: 'What number is at the end of a number line from 0 to 1?', answer: '1' },
        { prompt: 'The number line 0 to 1 is divided into 5 equal parts. What is the first mark?', answer: '1/5' },
        { prompt: 'On a number line, is 1/3 to the left or right of 1/2?', answer: 'left' },
        { prompt: 'On a number line, is 2/3 to the left or right of 1/2?', answer: 'right' },
        { prompt: 'What fraction marks the 3rd space on a number line divided into 4?', answer: '3/4' },
        { prompt: 'What fraction marks the 2nd space on a number line divided into 3?', answer: '2/3' },
        { prompt: 'The number line 0 to 1 is divided into 10 equal parts. What is the first mark?', answer: '1/10' },
      ],
    },
    'fraction-notation': {
      problems: [
        { prompt: '3 out of 4 equal parts are shaded. Write the fraction.', answer: '3/4' },
        { prompt: '1 out of 3 equal parts is shaded. Write the fraction.', answer: '1/3' },
        { prompt: '5 out of 8 equal parts are shaded. Write the fraction.', answer: '5/8' },
        { prompt: '2 out of 5 equal parts are shaded. Write the fraction.', answer: '2/5' },
        { prompt: 'In the fraction 3/4, what is the numerator?', answer: '3' },
        { prompt: 'In the fraction 3/4, what is the denominator?', answer: '4' },
        { prompt: 'In the fraction 5/6, what is the numerator?', answer: '5' },
        { prompt: 'In the fraction 5/6, what is the denominator?', answer: '6' },
        { prompt: '7 out of 10 equal parts are shaded. Write the fraction.', answer: '7/10' },
        { prompt: '4 out of 6 equal parts are shaded. Write the fraction.', answer: '4/6' },
        { prompt: 'In 2/3, the bottom number tells how many ___ parts. (equal/unequal)', answer: 'equal' },
        { prompt: '6 out of 8 equal parts are shaded. Write the fraction.', answer: '6/8' },
        { prompt: '1 out of 8 equal parts is shaded. Write the fraction.', answer: '1/8' },
        { prompt: '2 out of 2 equal parts are shaded. Write the fraction.', answer: '2/2' },
        { prompt: '3 out of 6 equal parts are shaded. Write the fraction.', answer: '3/6' },
      ],
    },
  },
  'grade-3': {
    'identify-unit-fractions': {
      problems: [
        { prompt: 'What is a unit fraction with denominator 3?', answer: '1/3' },
        { prompt: 'What is a unit fraction with denominator 8?', answer: '1/8' },
        { prompt: 'Is 2/5 a unit fraction? (yes/no)', answer: 'no' },
        { prompt: 'Is 1/6 a unit fraction? (yes/no)', answer: 'yes' },
        { prompt: 'What is a unit fraction with denominator 4?', answer: '1/4' },
        { prompt: 'Is 1/1 a unit fraction? (yes/no)', answer: 'yes' },
        { prompt: 'What is a unit fraction with denominator 10?', answer: '1/10' },
        { prompt: 'Is 3/3 a unit fraction? (yes/no)', answer: 'no' },
        { prompt: 'Name a unit fraction with denominator 2.', answer: '1/2' },
        { prompt: 'What do all unit fractions have as a numerator?', answer: '1' },
        { prompt: 'Which is larger: 1/3 or 1/6?', answer: '1/3' },
        { prompt: 'Which is larger: 1/2 or 1/8?', answer: '1/2' },
        { prompt: 'Which is larger: 1/4 or 1/5?', answer: '1/4' },
        { prompt: 'Which is smaller: 1/3 or 1/10?', answer: '1/10' },
        { prompt: 'Which is smaller: 1/2 or 1/4?', answer: '1/4' },
      ],
    },
    'fractions-on-number-line': {
      problems: [
        { prompt: 'Place on the number line 0-1: 2/4 is the same point as?', answer: '1/2' },
        { prompt: 'What fraction is 3 jumps on a number line divided into 4 equal parts?', answer: '3/4' },
        { prompt: 'What fraction is 2 jumps on a number line divided into 3 equal parts?', answer: '2/3' },
        { prompt: 'What fraction is 5 jumps on a number line divided into 8 equal parts?', answer: '5/8' },
        { prompt: 'What fraction is 1 jump on a number line divided into 6 equal parts?', answer: '1/6' },
        { prompt: 'What fraction is 4 jumps on a number line divided into 4 equal parts?', answer: '4/4' },
        { prompt: '4/4 is the same as what whole number?', answer: '1' },
        { prompt: 'What fraction is 3 jumps on a number line divided into 6 equal parts?', answer: '3/6' },
        { prompt: '3/6 simplifies to?', answer: '1/2' },
        { prompt: 'What fraction is 7 jumps on a number line divided into 8 equal parts?', answer: '7/8' },
        { prompt: 'Is 2/3 to the left or right of 3/4 on a number line?', answer: 'left' },
        { prompt: 'What fraction is 4 jumps on a number line divided into 6 equal parts?', answer: '4/6' },
        { prompt: 'Is 5/8 to the left or right of 1/2 on a number line?', answer: 'right' },
        { prompt: 'What fraction is 2 jumps on a number line divided into 8 equal parts?', answer: '2/8' },
        { prompt: '2/8 simplifies to?', answer: '1/4' },
      ],
    },
    'compare-same-denominator': {
      problems: [
        { prompt: 'Which is larger: 3/8 or 5/8?', answer: '5/8' },
        { prompt: 'Which is larger: 2/5 or 4/5?', answer: '4/5' },
        { prompt: 'Which is smaller: 1/6 or 5/6?', answer: '1/6' },
        { prompt: 'Which is larger: 7/10 or 3/10?', answer: '7/10' },
        { prompt: 'Compare: 2/4 _ 3/4 (< or > or =)', answer: '<' },
        { prompt: 'Compare: 5/6 _ 2/6 (< or > or =)', answer: '>' },
        { prompt: 'Compare: 3/8 _ 3/8 (< or > or =)', answer: '=' },
        { prompt: 'Which is larger: 1/3 or 2/3?', answer: '2/3' },
        { prompt: 'Order from least to greatest: 4/7, 1/7, 6/7', answer: '1/7, 4/7, 6/7' },
        { prompt: 'Which is smaller: 5/12 or 7/12?', answer: '5/12' },
        { prompt: 'Compare: 8/10 _ 6/10 (< or > or =)', answer: '>' },
        { prompt: 'Which is larger: 3/5 or 1/5?', answer: '3/5' },
        { prompt: 'Compare: 4/9 _ 7/9 (< or > or =)', answer: '<' },
        { prompt: 'Which is smaller: 2/8 or 6/8?', answer: '2/8' },
        { prompt: 'Order from least to greatest: 5/6, 1/6, 3/6', answer: '1/6, 3/6, 5/6' },
      ],
    },
    'compare-to-benchmark': {
      problems: [
        { prompt: 'Is 3/8 more or less than 1/2?', answer: 'less' },
        { prompt: 'Is 5/6 more or less than 1/2?', answer: 'more' },
        { prompt: 'Is 2/5 more or less than 1/2?', answer: 'less' },
        { prompt: 'Is 7/10 more or less than 1/2?', answer: 'more' },
        { prompt: 'Is 3/4 closer to 1/2 or 1?', answer: '1' },
        { prompt: 'Is 1/8 closer to 0 or 1/2?', answer: '0' },
        { prompt: 'Is 4/5 closer to 1/2 or 1?', answer: '1' },
        { prompt: 'Is 1/3 more or less than 1/2?', answer: 'less' },
        { prompt: 'Is 5/8 more or less than 1/2?', answer: 'more' },
        { prompt: 'Is 2/6 more or less than 1/2?', answer: 'less' },
        { prompt: 'Is 7/12 more or less than 1/2?', answer: 'more' },
        { prompt: 'Is 4/10 more or less than 1/2?', answer: 'less' },
        { prompt: 'Is 3/5 more or less than 1/2?', answer: 'more' },
        { prompt: 'Is 1/4 closer to 0 or 1/2?', answer: '0' },
        { prompt: 'Is 9/10 closer to 1/2 or 1?', answer: '1' },
      ],
    },
    'equivalent-fractions-visual': {
      problems: [
        { prompt: '1/2 = ?/4', answer: '2/4' },
        { prompt: '1/3 = ?/6', answer: '2/6' },
        { prompt: '2/4 = ?/2', answer: '1/2' },
        { prompt: '1/2 = ?/6', answer: '3/6' },
        { prompt: '2/3 = ?/6', answer: '4/6' },
        { prompt: '1/4 = ?/8', answer: '2/8' },
        { prompt: '3/6 = ?/2', answer: '1/2' },
        { prompt: '1/2 = ?/8', answer: '4/8' },
        { prompt: '2/6 = ?/3', answer: '1/3' },
        { prompt: '4/8 = ?/4', answer: '2/4' },
        { prompt: '1/3 = ?/9', answer: '3/9' },
        { prompt: '2/4 = ?/8', answer: '4/8' },
        { prompt: '3/4 = ?/8', answer: '6/8' },
        { prompt: '1/2 = ?/10', answer: '5/10' },
        { prompt: '2/8 = ?/4', answer: '1/4' },
      ],
    },
    'whole-numbers-as-fractions': {
      problems: [
        { prompt: 'Write 1 as a fraction with denominator 4.', answer: '4/4' },
        { prompt: 'Write 1 as a fraction with denominator 3.', answer: '3/3' },
        { prompt: 'Write 2 as a fraction with denominator 1.', answer: '2/1' },
        { prompt: 'Write 3 as a fraction with denominator 1.', answer: '3/1' },
        { prompt: 'Write 1 as a fraction with denominator 8.', answer: '8/8' },
        { prompt: '6/6 equals what whole number?', answer: '1' },
        { prompt: '10/10 equals what whole number?', answer: '1' },
        { prompt: '5/1 equals what whole number?', answer: '5' },
        { prompt: 'Write 1 as a fraction with denominator 2.', answer: '2/2' },
        { prompt: '4/1 equals what whole number?', answer: '4' },
        { prompt: 'Write 1 as a fraction with denominator 6.', answer: '6/6' },
        { prompt: '7/7 equals what whole number?', answer: '1' },
        { prompt: 'Write 1 as a fraction with denominator 10.', answer: '10/10' },
        { prompt: '1/1 equals what whole number?', answer: '1' },
        { prompt: 'Write 6 as a fraction with denominator 1.', answer: '6/1' },
      ],
    },
  },
  'grade-4': {
    'generate-equivalent': {
      problems: [
        { prompt: 'Find an equivalent fraction: 1/3 = ?/12', answer: '4/12' },
        { prompt: 'Find an equivalent fraction: 2/5 = ?/10', answer: '4/10' },
        { prompt: 'Find an equivalent fraction: 3/4 = ?/16', answer: '12/16' },
        { prompt: 'Find an equivalent fraction: 1/2 = ?/12', answer: '6/12' },
        { prompt: 'Find an equivalent fraction: 2/3 = ?/9', answer: '6/9' },
        { prompt: 'Find an equivalent fraction: 5/6 = ?/12', answer: '10/12' },
        { prompt: 'Find an equivalent fraction: 3/5 = ?/15', answer: '9/15' },
        { prompt: 'Find an equivalent fraction: 1/4 = ?/20', answer: '5/20' },
        { prompt: 'Find an equivalent fraction: 4/5 = ?/20', answer: '16/20' },
        { prompt: 'Find an equivalent fraction: 2/7 = ?/14', answer: '4/14' },
        { prompt: 'Find an equivalent fraction: 3/8 = ?/24', answer: '9/24' },
        { prompt: 'Find an equivalent fraction: 1/6 = ?/18', answer: '3/18' },
        { prompt: 'Find an equivalent fraction: 5/8 = ?/16', answer: '10/16' },
        { prompt: 'Find an equivalent fraction: 7/10 = ?/20', answer: '14/20' },
        { prompt: 'Find an equivalent fraction: 2/9 = ?/18', answer: '4/18' },
      ],
    },
    'simplify-fractions': {
      problems: [
        { prompt: 'Simplify: 4/8', answer: '1/2' },
        { prompt: 'Simplify: 6/9', answer: '2/3' },
        { prompt: 'Simplify: 3/12', answer: '1/4' },
        { prompt: 'Simplify: 10/15', answer: '2/3' },
        { prompt: 'Simplify: 8/12', answer: '2/3' },
        { prompt: 'Simplify: 6/10', answer: '3/5' },
        { prompt: 'Simplify: 4/6', answer: '2/3' },
        { prompt: 'Simplify: 5/20', answer: '1/4' },
        { prompt: 'Simplify: 9/12', answer: '3/4' },
        { prompt: 'Simplify: 2/8', answer: '1/4' },
        { prompt: 'Simplify: 12/16', answer: '3/4' },
        { prompt: 'Simplify: 6/18', answer: '1/3' },
        { prompt: 'Simplify: 10/20', answer: '1/2' },
        { prompt: 'Simplify: 15/25', answer: '3/5' },
        { prompt: 'Simplify: 8/20', answer: '2/5' },
      ],
    },
    'compare-unlike-denominators': {
      problems: [
        { prompt: 'Which is larger: 1/3 or 1/4?', answer: '1/3' },
        { prompt: 'Which is larger: 2/3 or 3/5?', answer: '2/3' },
        { prompt: 'Which is larger: 3/4 or 5/8?', answer: '3/4' },
        { prompt: 'Which is larger: 1/2 or 2/5?', answer: '1/2' },
        { prompt: 'Which is larger: 3/8 or 1/2?', answer: '1/2' },
        { prompt: 'Which is larger: 2/3 or 3/4?', answer: '3/4' },
        { prompt: 'Which is larger: 5/6 or 7/8?', answer: '7/8' },
        { prompt: 'Which is larger: 1/3 or 2/6?', answer: 'equal' },
        { prompt: 'Which is larger: 4/5 or 3/4?', answer: '4/5' },
        { prompt: 'Which is larger: 1/6 or 1/5?', answer: '1/5' },
        { prompt: 'Which is larger: 5/12 or 1/2?', answer: '1/2' },
        { prompt: 'Which is larger: 2/3 or 5/8?', answer: '2/3' },
        { prompt: 'Which is larger: 7/10 or 3/4?', answer: '3/4' },
        { prompt: 'Which is larger: 3/5 or 2/3?', answer: '2/3' },
        { prompt: 'Which is larger: 4/6 or 2/3?', answer: 'equal' },
      ],
    },
    'order-fractions': {
      problems: [
        { prompt: 'Order from least to greatest: 1/2, 1/4, 3/4', answer: '1/4, 1/2, 3/4' },
        { prompt: 'Order from least to greatest: 2/3, 1/6, 1/2', answer: '1/6, 1/2, 2/3' },
        { prompt: 'Order from least to greatest: 3/8, 1/2, 1/4', answer: '1/4, 3/8, 1/2' },
        { prompt: 'Order from least to greatest: 5/6, 1/3, 2/3', answer: '1/3, 2/3, 5/6' },
        { prompt: 'Order from greatest to least: 3/4, 1/2, 7/8', answer: '7/8, 3/4, 1/2' },
        { prompt: 'Order from least to greatest: 1/5, 1/3, 1/2', answer: '1/5, 1/3, 1/2' },
        { prompt: 'Order from least to greatest: 3/10, 1/2, 4/5', answer: '3/10, 1/2, 4/5' },
        { prompt: 'Order from least to greatest: 2/5, 3/10, 1/2', answer: '3/10, 2/5, 1/2' },
        { prompt: 'Order from greatest to least: 5/6, 2/3, 1/2', answer: '5/6, 2/3, 1/2' },
        { prompt: 'Order from least to greatest: 1/8, 1/4, 1/3', answer: '1/8, 1/4, 1/3' },
        { prompt: 'Order from least to greatest: 7/12, 1/3, 3/4', answer: '1/3, 7/12, 3/4' },
        { prompt: 'Order from least to greatest: 2/5, 1/2, 3/5', answer: '2/5, 1/2, 3/5' },
        { prompt: 'Order from least to greatest: 1/6, 1/4, 1/3', answer: '1/6, 1/4, 1/3' },
        { prompt: 'Order from greatest to least: 4/5, 1/2, 3/10', answer: '4/5, 1/2, 3/10' },
        { prompt: 'Order from least to greatest: 5/8, 1/4, 7/8', answer: '1/4, 5/8, 7/8' },
      ],
    },
    'improper-to-mixed': {
      problems: [
        { prompt: 'Convert to mixed number: 7/4', answer: '1 3/4' },
        { prompt: 'Convert to mixed number: 5/3', answer: '1 2/3' },
        { prompt: 'Convert to mixed number: 9/2', answer: '4 1/2' },
        { prompt: 'Convert to mixed number: 11/4', answer: '2 3/4' },
        { prompt: 'Convert to mixed number: 7/3', answer: '2 1/3' },
        { prompt: 'Convert to mixed number: 10/3', answer: '3 1/3' },
        { prompt: 'Convert to mixed number: 13/5', answer: '2 3/5' },
        { prompt: 'Convert to mixed number: 9/4', answer: '2 1/4' },
        { prompt: 'Convert to mixed number: 8/3', answer: '2 2/3' },
        { prompt: 'Convert to mixed number: 15/4', answer: '3 3/4' },
        { prompt: 'Convert to mixed number: 17/6', answer: '2 5/6' },
        { prompt: 'Convert to mixed number: 11/8', answer: '1 3/8' },
        { prompt: 'Convert to mixed number: 14/5', answer: '2 4/5' },
        { prompt: 'Convert to mixed number: 19/6', answer: '3 1/6' },
        { prompt: 'Convert to mixed number: 22/7', answer: '3 1/7' },
      ],
    },
    'mixed-to-improper': {
      problems: [
        { prompt: 'Convert to improper fraction: 1 1/2', answer: '3/2' },
        { prompt: 'Convert to improper fraction: 2 1/3', answer: '7/3' },
        { prompt: 'Convert to improper fraction: 1 3/4', answer: '7/4' },
        { prompt: 'Convert to improper fraction: 3 1/2', answer: '7/2' },
        { prompt: 'Convert to improper fraction: 2 2/5', answer: '12/5' },
        { prompt: 'Convert to improper fraction: 1 5/6', answer: '11/6' },
        { prompt: 'Convert to improper fraction: 4 1/3', answer: '13/3' },
        { prompt: 'Convert to improper fraction: 2 3/4', answer: '11/4' },
        { prompt: 'Convert to improper fraction: 3 2/5', answer: '17/5' },
        { prompt: 'Convert to improper fraction: 1 7/8', answer: '15/8' },
        { prompt: 'Convert to improper fraction: 5 1/2', answer: '11/2' },
        { prompt: 'Convert to improper fraction: 2 5/6', answer: '17/6' },
        { prompt: 'Convert to improper fraction: 3 3/8', answer: '27/8' },
        { prompt: 'Convert to improper fraction: 4 2/3', answer: '14/3' },
        { prompt: 'Convert to improper fraction: 1 4/5', answer: '9/5' },
      ],
    },
    'add-like-denom': {
      problems: [
        { prompt: '1/5 + 2/5 = ?', answer: '3/5' },
        { prompt: '3/8 + 2/8 = ?', answer: '5/8' },
        { prompt: '1/4 + 2/4 = ?', answer: '3/4' },
        { prompt: '2/6 + 3/6 = ?', answer: '5/6' },
        { prompt: '4/10 + 3/10 = ?', answer: '7/10' },
        { prompt: '1/3 + 1/3 = ?', answer: '2/3' },
        { prompt: '5/12 + 4/12 = ?', answer: '9/12' },
        { prompt: '3/7 + 2/7 = ?', answer: '5/7' },
        { prompt: '1/8 + 5/8 = ?', answer: '6/8' },
        { prompt: '2/9 + 4/9 = ?', answer: '6/9' },
        { prompt: '1/6 + 4/6 = ?', answer: '5/6' },
        { prompt: '3/10 + 5/10 = ?', answer: '8/10' },
        { prompt: '2/5 + 2/5 = ?', answer: '4/5' },
        { prompt: '7/12 + 3/12 = ?', answer: '10/12' },
        { prompt: '1/4 + 1/4 = ?', answer: '2/4' },
      ],
    },
    'subtract-like-denom': {
      problems: [
        { prompt: '3/5 - 1/5 = ?', answer: '2/5' },
        { prompt: '5/8 - 2/8 = ?', answer: '3/8' },
        { prompt: '3/4 - 1/4 = ?', answer: '2/4' },
        { prompt: '5/6 - 2/6 = ?', answer: '3/6' },
        { prompt: '7/10 - 3/10 = ?', answer: '4/10' },
        { prompt: '2/3 - 1/3 = ?', answer: '1/3' },
        { prompt: '9/12 - 5/12 = ?', answer: '4/12' },
        { prompt: '5/7 - 2/7 = ?', answer: '3/7' },
        { prompt: '6/8 - 3/8 = ?', answer: '3/8' },
        { prompt: '7/9 - 4/9 = ?', answer: '3/9' },
        { prompt: '4/5 - 2/5 = ?', answer: '2/5' },
        { prompt: '8/10 - 5/10 = ?', answer: '3/10' },
        { prompt: '11/12 - 7/12 = ?', answer: '4/12' },
        { prompt: '4/6 - 1/6 = ?', answer: '3/6' },
        { prompt: '5/5 - 3/5 = ?', answer: '2/5' },
      ],
    },
    'fraction-times-whole': {
      problems: [
        { prompt: '3 x 1/4 = ?', answer: '3/4' },
        { prompt: '2 x 2/5 = ?', answer: '4/5' },
        { prompt: '4 x 1/3 = ?', answer: '4/3' },
        { prompt: '5 x 1/2 = ?', answer: '5/2' },
        { prompt: '3 x 2/3 = ?', answer: '6/3' },
        { prompt: '2 x 3/8 = ?', answer: '6/8' },
        { prompt: '6 x 1/4 = ?', answer: '6/4' },
        { prompt: '4 x 2/5 = ?', answer: '8/5' },
        { prompt: '3 x 3/4 = ?', answer: '9/4' },
        { prompt: '2 x 5/6 = ?', answer: '10/6' },
        { prompt: '5 x 2/3 = ?', answer: '10/3' },
        { prompt: '7 x 1/2 = ?', answer: '7/2' },
        { prompt: '4 x 3/8 = ?', answer: '12/8' },
        { prompt: '3 x 1/6 = ?', answer: '3/6' },
        { prompt: '2 x 4/5 = ?', answer: '8/5' },
      ],
    },
    'tenths': {
      problems: [
        { prompt: 'Write 3/10 as a decimal.', answer: '0.3' },
        { prompt: 'Write 7/10 as a decimal.', answer: '0.7' },
        { prompt: 'Write 0.5 as a fraction in tenths.', answer: '5/10' },
        { prompt: 'Write 1/10 as a decimal.', answer: '0.1' },
        { prompt: 'Write 0.9 as a fraction in tenths.', answer: '9/10' },
        { prompt: 'Write 6/10 as a decimal.', answer: '0.6' },
        { prompt: 'Write 0.2 as a fraction in tenths.', answer: '2/10' },
        { prompt: 'Write 10/10 as a decimal.', answer: '1.0' },
        { prompt: 'Write 0.4 as a fraction in tenths.', answer: '4/10' },
        { prompt: 'Write 8/10 as a decimal.', answer: '0.8' },
        { prompt: 'Write 0.1 as a fraction in tenths.', answer: '1/10' },
        { prompt: 'Write 5/10 as a decimal.', answer: '0.5' },
        { prompt: 'Write 0.6 as a fraction in tenths.', answer: '6/10' },
        { prompt: 'Write 2/10 as a decimal.', answer: '0.2' },
        { prompt: 'Write 0.8 as a fraction in tenths.', answer: '8/10' },
      ],
    },
    'hundredths': {
      problems: [
        { prompt: 'Write 25/100 as a decimal.', answer: '0.25' },
        { prompt: 'Write 50/100 as a decimal.', answer: '0.50' },
        { prompt: 'Write 0.75 as a fraction in hundredths.', answer: '75/100' },
        { prompt: 'Write 7/100 as a decimal.', answer: '0.07' },
        { prompt: 'Write 0.10 as a fraction in hundredths.', answer: '10/100' },
        { prompt: 'Write 33/100 as a decimal.', answer: '0.33' },
        { prompt: 'Write 0.99 as a fraction in hundredths.', answer: '99/100' },
        { prompt: 'Write 1/100 as a decimal.', answer: '0.01' },
        { prompt: 'Write 0.50 as a fraction in hundredths.', answer: '50/100' },
        { prompt: 'Write 80/100 as a decimal.', answer: '0.80' },
        { prompt: 'Write 0.05 as a fraction in hundredths.', answer: '5/100' },
        { prompt: 'Write 45/100 as a decimal.', answer: '0.45' },
        { prompt: 'Write 0.30 as a fraction in hundredths.', answer: '30/100' },
        { prompt: 'Write 60/100 as a decimal.', answer: '0.60' },
        { prompt: 'Write 0.12 as a fraction in hundredths.', answer: '12/100' },
      ],
    },
  },
  'grade-5': {
    'add-unlike-denom': {
      problems: [
        { prompt: '1/3 + 1/4 = ?', answer: '7/12' },
        { prompt: '1/2 + 1/3 = ?', answer: '5/6' },
        { prompt: '2/3 + 1/6 = ?', answer: '5/6' },
        { prompt: '1/4 + 1/6 = ?', answer: '5/12' },
        { prompt: '3/4 + 1/8 = ?', answer: '7/8' },
        { prompt: '2/5 + 1/2 = ?', answer: '9/10' },
        { prompt: '1/3 + 1/6 = ?', answer: '1/2' },
        { prompt: '3/5 + 1/4 = ?', answer: '17/20' },
        { prompt: '1/2 + 1/5 = ?', answer: '7/10' },
        { prompt: '2/3 + 1/4 = ?', answer: '11/12' },
        { prompt: '1/6 + 1/4 = ?', answer: '5/12' },
        { prompt: '3/8 + 1/4 = ?', answer: '5/8' },
        { prompt: '1/3 + 2/5 = ?', answer: '11/15' },
        { prompt: '1/2 + 3/8 = ?', answer: '7/8' },
        { prompt: '2/5 + 1/3 = ?', answer: '11/15' },
      ],
    },
    'subtract-unlike-denom': {
      problems: [
        { prompt: '1/2 - 1/3 = ?', answer: '1/6' },
        { prompt: '3/4 - 1/3 = ?', answer: '5/12' },
        { prompt: '2/3 - 1/4 = ?', answer: '5/12' },
        { prompt: '5/6 - 1/2 = ?', answer: '1/3' },
        { prompt: '3/4 - 1/6 = ?', answer: '7/12' },
        { prompt: '1/2 - 1/4 = ?', answer: '1/4' },
        { prompt: '4/5 - 1/2 = ?', answer: '3/10' },
        { prompt: '7/8 - 1/4 = ?', answer: '5/8' },
        { prompt: '2/3 - 1/6 = ?', answer: '1/2' },
        { prompt: '5/6 - 1/3 = ?', answer: '1/2' },
        { prompt: '3/4 - 1/2 = ?', answer: '1/4' },
        { prompt: '3/5 - 1/3 = ?', answer: '4/15' },
        { prompt: '7/10 - 1/5 = ?', answer: '1/2' },
        { prompt: '5/8 - 1/4 = ?', answer: '3/8' },
        { prompt: '4/5 - 2/3 = ?', answer: '2/15' },
      ],
    },
    'add-mixed-numbers': {
      problems: [
        { prompt: '1 1/4 + 2 1/4 = ?', answer: '3 1/2' },
        { prompt: '2 1/3 + 1 1/3 = ?', answer: '3 2/3' },
        { prompt: '1 2/5 + 2 1/5 = ?', answer: '3 3/5' },
        { prompt: '3 1/2 + 1 1/4 = ?', answer: '4 3/4' },
        { prompt: '2 2/3 + 1 1/6 = ?', answer: '3 5/6' },
        { prompt: '1 3/4 + 2 3/4 = ?', answer: '4 1/2' },
        { prompt: '2 1/2 + 3 1/3 = ?', answer: '5 5/6' },
        { prompt: '1 1/6 + 2 1/3 = ?', answer: '3 1/2' },
        { prompt: '4 1/5 + 1 3/5 = ?', answer: '5 4/5' },
        { prompt: '2 3/8 + 1 1/8 = ?', answer: '3 1/2' },
        { prompt: '1 1/2 + 1 1/2 = ?', answer: '3' },
        { prompt: '3 1/4 + 2 1/2 = ?', answer: '5 3/4' },
        { prompt: '2 1/3 + 2 1/2 = ?', answer: '4 5/6' },
        { prompt: '1 5/8 + 2 3/8 = ?', answer: '4' },
        { prompt: '3 2/5 + 1 4/5 = ?', answer: '5 1/5' },
      ],
    },
    'subtract-mixed-numbers': {
      problems: [
        { prompt: '3 3/4 - 1 1/4 = ?', answer: '2 1/2' },
        { prompt: '4 2/3 - 2 1/3 = ?', answer: '2 1/3' },
        { prompt: '5 1/2 - 2 1/4 = ?', answer: '3 1/4' },
        { prompt: '3 5/6 - 1 1/3 = ?', answer: '2 1/2' },
        { prompt: '4 1/2 - 1 3/4 = ?', answer: '2 3/4' },
        { prompt: '6 1/3 - 2 2/3 = ?', answer: '3 2/3' },
        { prompt: '5 3/8 - 2 1/8 = ?', answer: '3 1/4' },
        { prompt: '3 1/4 - 1 1/2 = ?', answer: '1 3/4' },
        { prompt: '7 1/5 - 3 3/5 = ?', answer: '3 3/5' },
        { prompt: '4 1/6 - 1 5/6 = ?', answer: '2 1/3' },
        { prompt: '5 - 2 1/2 = ?', answer: '2 1/2' },
        { prompt: '6 1/4 - 3 3/4 = ?', answer: '2 1/2' },
        { prompt: '4 1/3 - 1 2/3 = ?', answer: '2 2/3' },
        { prompt: '3 1/2 - 1 1/2 = ?', answer: '2' },
        { prompt: '5 2/5 - 2 4/5 = ?', answer: '2 3/5' },
      ],
    },
    'fraction-times-fraction': {
      problems: [
        { prompt: '1/2 x 1/3 = ?', answer: '1/6' },
        { prompt: '2/3 x 3/4 = ?', answer: '1/2' },
        { prompt: '1/4 x 1/2 = ?', answer: '1/8' },
        { prompt: '3/5 x 1/3 = ?', answer: '1/5' },
        { prompt: '2/3 x 1/2 = ?', answer: '1/3' },
        { prompt: '3/4 x 2/5 = ?', answer: '3/10' },
        { prompt: '1/3 x 1/4 = ?', answer: '1/12' },
        { prompt: '2/5 x 5/6 = ?', answer: '1/3' },
        { prompt: '3/8 x 2/3 = ?', answer: '1/4' },
        { prompt: '4/5 x 1/2 = ?', answer: '2/5' },
        { prompt: '1/2 x 1/2 = ?', answer: '1/4' },
        { prompt: '2/3 x 3/5 = ?', answer: '2/5' },
        { prompt: '5/6 x 3/10 = ?', answer: '1/4' },
        { prompt: '3/4 x 4/9 = ?', answer: '1/3' },
        { prompt: '1/3 x 3/7 = ?', answer: '1/7' },
      ],
    },
    'multiply-mixed': {
      problems: [
        { prompt: '1 1/2 x 2 = ?', answer: '3' },
        { prompt: '2 1/3 x 3 = ?', answer: '7' },
        { prompt: '1 1/4 x 2 = ?', answer: '2 1/2' },
        { prompt: '1 1/2 x 1 1/3 = ?', answer: '2' },
        { prompt: '2 1/2 x 2 = ?', answer: '5' },
        { prompt: '1 2/3 x 3 = ?', answer: '5' },
        { prompt: '3 1/2 x 2 = ?', answer: '7' },
        { prompt: '1 1/3 x 1 1/2 = ?', answer: '2' },
        { prompt: '2 1/4 x 4 = ?', answer: '9' },
        { prompt: '1 3/4 x 2 = ?', answer: '3 1/2' },
        { prompt: '2 1/2 x 1 1/5 = ?', answer: '3' },
        { prompt: '1 1/2 x 4 = ?', answer: '6' },
        { prompt: '3 1/3 x 3 = ?', answer: '10' },
        { prompt: '1 1/4 x 4 = ?', answer: '5' },
        { prompt: '2 2/3 x 3 = ?', answer: '8' },
      ],
    },
    'whole-divided-by-fraction': {
      problems: [
        { prompt: '6 / (1/2) = ?', answer: '12' },
        { prompt: '4 / (1/3) = ?', answer: '12' },
        { prompt: '3 / (1/4) = ?', answer: '12' },
        { prompt: '2 / (1/2) = ?', answer: '4' },
        { prompt: '5 / (1/5) = ?', answer: '25' },
        { prompt: '8 / (1/2) = ?', answer: '16' },
        { prompt: '6 / (1/3) = ?', answer: '18' },
        { prompt: '10 / (1/2) = ?', answer: '20' },
        { prompt: '3 / (1/2) = ?', answer: '6' },
        { prompt: '4 / (1/4) = ?', answer: '16' },
        { prompt: '9 / (1/3) = ?', answer: '27' },
        { prompt: '2 / (1/4) = ?', answer: '8' },
        { prompt: '7 / (1/2) = ?', answer: '14' },
        { prompt: '5 / (1/3) = ?', answer: '15' },
        { prompt: '12 / (1/4) = ?', answer: '48' },
      ],
    },
    'fraction-divided-by-whole': {
      problems: [
        { prompt: '1/2 / 3 = ?', answer: '1/6' },
        { prompt: '1/3 / 2 = ?', answer: '1/6' },
        { prompt: '1/4 / 2 = ?', answer: '1/8' },
        { prompt: '1/2 / 4 = ?', answer: '1/8' },
        { prompt: '3/4 / 3 = ?', answer: '1/4' },
        { prompt: '2/3 / 2 = ?', answer: '1/3' },
        { prompt: '1/2 / 5 = ?', answer: '1/10' },
        { prompt: '1/3 / 4 = ?', answer: '1/12' },
        { prompt: '3/5 / 3 = ?', answer: '1/5' },
        { prompt: '1/4 / 3 = ?', answer: '1/12' },
        { prompt: '2/5 / 2 = ?', answer: '1/5' },
        { prompt: '1/6 / 2 = ?', answer: '1/12' },
        { prompt: '4/5 / 4 = ?', answer: '1/5' },
        { prompt: '3/8 / 3 = ?', answer: '1/8' },
        { prompt: '5/6 / 5 = ?', answer: '1/6' },
      ],
    },
    'add-decimals': {
      problems: [
        { prompt: '0.3 + 0.5 = ?', answer: '0.8' },
        { prompt: '1.25 + 0.75 = ?', answer: '2.0' },
        { prompt: '0.6 + 0.7 = ?', answer: '1.3' },
        { prompt: '2.4 + 1.3 = ?', answer: '3.7' },
        { prompt: '0.15 + 0.25 = ?', answer: '0.40' },
        { prompt: '3.5 + 2.8 = ?', answer: '6.3' },
        { prompt: '0.99 + 0.01 = ?', answer: '1.00' },
        { prompt: '1.5 + 2.5 = ?', answer: '4.0' },
        { prompt: '0.45 + 0.55 = ?', answer: '1.00' },
        { prompt: '4.2 + 3.9 = ?', answer: '8.1' },
        { prompt: '0.8 + 0.6 = ?', answer: '1.4' },
        { prompt: '1.75 + 1.25 = ?', answer: '3.00' },
        { prompt: '2.35 + 1.65 = ?', answer: '4.00' },
        { prompt: '0.1 + 0.9 = ?', answer: '1.0' },
        { prompt: '5.5 + 3.7 = ?', answer: '9.2' },
      ],
    },
    'subtract-decimals': {
      problems: [
        { prompt: '0.8 - 0.3 = ?', answer: '0.5' },
        { prompt: '1.5 - 0.7 = ?', answer: '0.8' },
        { prompt: '2.0 - 0.75 = ?', answer: '1.25' },
        { prompt: '3.4 - 1.2 = ?', answer: '2.2' },
        { prompt: '1.00 - 0.45 = ?', answer: '0.55' },
        { prompt: '5.0 - 2.3 = ?', answer: '2.7' },
        { prompt: '0.9 - 0.4 = ?', answer: '0.5' },
        { prompt: '4.5 - 1.8 = ?', answer: '2.7' },
        { prompt: '1.0 - 0.01 = ?', answer: '0.99' },
        { prompt: '6.25 - 3.75 = ?', answer: '2.50' },
        { prompt: '3.0 - 1.5 = ?', answer: '1.5' },
        { prompt: '7.2 - 4.6 = ?', answer: '2.6' },
        { prompt: '2.50 - 1.25 = ?', answer: '1.25' },
        { prompt: '10.0 - 3.7 = ?', answer: '6.3' },
        { prompt: '8.1 - 5.9 = ?', answer: '2.2' },
      ],
    },
    'multiply-decimals': {
      problems: [
        { prompt: '0.5 x 4 = ?', answer: '2.0' },
        { prompt: '0.3 x 3 = ?', answer: '0.9' },
        { prompt: '1.5 x 2 = ?', answer: '3.0' },
        { prompt: '0.25 x 4 = ?', answer: '1.00' },
        { prompt: '0.1 x 7 = ?', answer: '0.7' },
        { prompt: '2.5 x 3 = ?', answer: '7.5' },
        { prompt: '0.4 x 5 = ?', answer: '2.0' },
        { prompt: '1.2 x 3 = ?', answer: '3.6' },
        { prompt: '0.6 x 8 = ?', answer: '4.8' },
        { prompt: '0.75 x 4 = ?', answer: '3.00' },
        { prompt: '0.2 x 9 = ?', answer: '1.8' },
        { prompt: '3.5 x 2 = ?', answer: '7.0' },
        { prompt: '0.5 x 0.5 = ?', answer: '0.25' },
        { prompt: '1.1 x 5 = ?', answer: '5.5' },
        { prompt: '0.8 x 6 = ?', answer: '4.8' },
      ],
    },
  },
  'grade-6': {
    'fraction-divided-by-fraction': {
      problems: [
        { prompt: '1/2 / (1/4) = ?', answer: '2' },
        { prompt: '2/3 / (1/6) = ?', answer: '4' },
        { prompt: '3/4 / (1/8) = ?', answer: '6' },
        { prompt: '1/3 / (1/6) = ?', answer: '2' },
        { prompt: '2/5 / (1/10) = ?', answer: '4' },
        { prompt: '3/4 / (3/8) = ?', answer: '2' },
        { prompt: '2/3 / (1/3) = ?', answer: '2' },
        { prompt: '5/6 / (1/3) = ?', answer: '5/2' },
        { prompt: '1/2 / (1/3) = ?', answer: '3/2' },
        { prompt: '3/5 / (1/5) = ?', answer: '3' },
        { prompt: '4/5 / (2/5) = ?', answer: '2' },
        { prompt: '7/8 / (1/4) = ?', answer: '7/2' },
        { prompt: '1/4 / (1/2) = ?', answer: '1/2' },
        { prompt: '5/6 / (5/12) = ?', answer: '2' },
        { prompt: '3/4 / (1/2) = ?', answer: '3/2' },
      ],
    },
    'fraction-to-percent': {
      problems: [
        { prompt: 'Convert 1/2 to a percent.', answer: '50%' },
        { prompt: 'Convert 1/4 to a percent.', answer: '25%' },
        { prompt: 'Convert 3/4 to a percent.', answer: '75%' },
        { prompt: 'Convert 1/5 to a percent.', answer: '20%' },
        { prompt: 'Convert 2/5 to a percent.', answer: '40%' },
        { prompt: 'Convert 3/5 to a percent.', answer: '60%' },
        { prompt: 'Convert 1/10 to a percent.', answer: '10%' },
        { prompt: 'Convert 3/10 to a percent.', answer: '30%' },
        { prompt: 'Convert 7/10 to a percent.', answer: '70%' },
        { prompt: 'Convert 1/8 to a percent.', answer: '12.5%' },
        { prompt: 'Convert 4/5 to a percent.', answer: '80%' },
        { prompt: 'Convert 9/10 to a percent.', answer: '90%' },
        { prompt: 'Convert 1/1 to a percent.', answer: '100%' },
        { prompt: 'Convert 1/20 to a percent.', answer: '5%' },
        { prompt: 'Convert 3/8 to a percent.', answer: '37.5%' },
      ],
    },
    'percent-to-fraction': {
      problems: [
        { prompt: 'Convert 50% to a simplified fraction.', answer: '1/2' },
        { prompt: 'Convert 25% to a simplified fraction.', answer: '1/4' },
        { prompt: 'Convert 75% to a simplified fraction.', answer: '3/4' },
        { prompt: 'Convert 20% to a simplified fraction.', answer: '1/5' },
        { prompt: 'Convert 10% to a simplified fraction.', answer: '1/10' },
        { prompt: 'Convert 40% to a simplified fraction.', answer: '2/5' },
        { prompt: 'Convert 60% to a simplified fraction.', answer: '3/5' },
        { prompt: 'Convert 80% to a simplified fraction.', answer: '4/5' },
        { prompt: 'Convert 30% to a simplified fraction.', answer: '3/10' },
        { prompt: 'Convert 90% to a simplified fraction.', answer: '9/10' },
        { prompt: 'Convert 5% to a simplified fraction.', answer: '1/20' },
        { prompt: 'Convert 15% to a simplified fraction.', answer: '3/20' },
        { prompt: 'Convert 100% to a simplified fraction.', answer: '1/1' },
        { prompt: 'Convert 70% to a simplified fraction.', answer: '7/10' },
        { prompt: 'Convert 45% to a simplified fraction.', answer: '9/20' },
      ],
    },
    'ratio-identify': {
      problems: [
        { prompt: 'There are 3 cats and 5 dogs. What is the ratio of cats to dogs?', answer: '3:5' },
        { prompt: 'A class has 12 boys and 8 girls. What is the ratio of boys to girls?', answer: '12:8' },
        { prompt: 'Simplify the ratio 6:4.', answer: '3:2' },
        { prompt: 'Simplify the ratio 10:15.', answer: '2:3' },
        { prompt: 'A bag has 4 red and 6 blue marbles. Ratio of red to total?', answer: '4:10' },
        { prompt: 'Simplify the ratio 8:12.', answer: '2:3' },
        { prompt: 'There are 5 apples for every 2 oranges. Write the ratio.', answer: '5:2' },
        { prompt: 'Simplify the ratio 9:3.', answer: '3:1' },
        { prompt: 'A recipe uses 2 cups flour and 1 cup sugar. Ratio flour to sugar?', answer: '2:1' },
        { prompt: 'Simplify the ratio 15:20.', answer: '3:4' },
        { prompt: 'There are 10 red and 10 blue blocks. Ratio of red to blue?', answer: '1:1' },
        { prompt: 'Simplify the ratio 12:18.', answer: '2:3' },
        { prompt: 'A team won 7 games and lost 3. Ratio of wins to losses?', answer: '7:3' },
        { prompt: 'Simplify the ratio 20:5.', answer: '4:1' },
        { prompt: 'Simplify the ratio 14:21.', answer: '2:3' },
      ],
    },
    'unit-rate': {
      problems: [
        { prompt: '$12 for 4 pounds. What is the unit rate per pound?', answer: '$3' },
        { prompt: '150 miles in 3 hours. What is the unit rate per hour?', answer: '50 miles' },
        { prompt: '24 apples for 6 people. How many per person?', answer: '4' },
        { prompt: '$15 for 5 notebooks. Price per notebook?', answer: '$3' },
        { prompt: '60 words in 2 minutes. Words per minute?', answer: '30' },
        { prompt: '$8.00 for 4 pens. Price per pen?', answer: '$2.00' },
        { prompt: '200 miles on 10 gallons. Miles per gallon?', answer: '20' },
        { prompt: '36 cookies for 9 kids. Cookies per kid?', answer: '4' },
        { prompt: '$20 for 8 pounds. Price per pound?', answer: '$2.50' },
        { prompt: '90 pages in 3 days. Pages per day?', answer: '30' },
        { prompt: '100 meters in 10 seconds. Meters per second?', answer: '10' },
        { prompt: '$6.00 for 3 pounds of bananas. Price per pound?', answer: '$2.00' },
        { prompt: '48 stickers shared by 8 kids. Stickers per kid?', answer: '6' },
        { prompt: '120 miles in 2 hours. Miles per hour?', answer: '60' },
        { prompt: '$9.00 for 6 muffins. Price per muffin?', answer: '$1.50' },
      ],
    },
    'percent-of-number': {
      problems: [
        { prompt: 'What is 50% of 80?', answer: '40' },
        { prompt: 'What is 25% of 60?', answer: '15' },
        { prompt: 'What is 10% of 200?', answer: '20' },
        { prompt: 'What is 75% of 40?', answer: '30' },
        { prompt: 'What is 20% of 150?', answer: '30' },
        { prompt: 'What is 50% of 120?', answer: '60' },
        { prompt: 'What is 10% of 90?', answer: '9' },
        { prompt: 'What is 25% of 200?', answer: '50' },
        { prompt: 'What is 30% of 50?', answer: '15' },
        { prompt: 'What is 75% of 120?', answer: '90' },
        { prompt: 'What is 40% of 250?', answer: '100' },
        { prompt: 'What is 5% of 200?', answer: '10' },
        { prompt: 'What is 100% of 45?', answer: '45' },
        { prompt: 'What is 15% of 60?', answer: '9' },
        { prompt: 'What is 60% of 50?', answer: '30' },
      ],
    },
    'find-the-percent': {
      problems: [
        { prompt: 'What percent of 50 is 25?', answer: '50%' },
        { prompt: 'What percent of 200 is 50?', answer: '25%' },
        { prompt: 'What percent of 80 is 20?', answer: '25%' },
        { prompt: 'What percent of 40 is 10?', answer: '25%' },
        { prompt: 'What percent of 100 is 75?', answer: '75%' },
        { prompt: 'What percent of 60 is 30?', answer: '50%' },
        { prompt: 'What percent of 200 is 100?', answer: '50%' },
        { prompt: 'What percent of 50 is 5?', answer: '10%' },
        { prompt: 'What percent of 80 is 60?', answer: '75%' },
        { prompt: 'What percent of 150 is 30?', answer: '20%' },
        { prompt: 'What percent of 25 is 5?', answer: '20%' },
        { prompt: 'What percent of 90 is 9?', answer: '10%' },
        { prompt: 'What percent of 120 is 60?', answer: '50%' },
        { prompt: 'What percent of 40 is 40?', answer: '100%' },
        { prompt: 'What percent of 500 is 50?', answer: '10%' },
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

function resolveSkillKey(grade, skill) {
  const gs = SKILLS[grade];
  if (!gs) return null;
  for (const [cat, skills] of Object.entries(gs)) { if (skills.includes(skill)) return { grade, category: cat, skill }; }
  return null;
}

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9/.% ]/g, ''); }

// Exercise generation

function exResult(type, skill, grade, instruction, items) { return { type, skill, grade, count: items.length, instruction, items }; }

function generateExercise(grade, skill, count = 5) {
  const bank = PROBLEM_BANKS[grade]?.[skill];
  if (!bank || !bank.problems) return { error: `No problem bank for ${grade}/${skill}` };

  return exResult('fraction', skill, grade, 'Solve each problem.',
    pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer })));
}

// Answer checking

function checkAnswer(type, expected, answer) {
  const ne = norm(expected);
  const na = norm(answer);
  if (ne === na) return true;
  // Handle equivalent decimal forms: 0.5 vs 0.50, 2.0 vs 2, etc.
  const numE = parseFloat(expected);
  const numA = parseFloat(answer);
  if (!isNaN(numE) && !isNaN(numA) && numE === numA) return true;
  return false;
}

// Public API

class Fractions {
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
    const grade = p.grade || 'kindergarten';
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
    const grade = p.grade || 'kindergarten';
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
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    return {
      studentId: id, grade, targetSkill: target, exercise,
      lessonPlan: {
        review: 'Review previously learned fraction concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Apply concept to a word problem or visual model',
      },
    };
  }
}

module.exports = Fractions;

// CLI: node fractions.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const fr = new Fractions();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) fr.setGrade(id, grade);
        out({ action: 'start', profile: fr.getProfile(id), nextSkills: fr.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(fr.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'kindergarten';
        if (skill) { out(fr.generateExercise(grade, skill, 5)); }
        else { const n = fr.getNextSkills(id, 1).next; out(n.length ? fr.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current grade!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(fr.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(fr.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(fr.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(fr.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(fr.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? fr.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(fr.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(fr.setGrade(id, g)); break; }
      default: out({ usage: 'node fractions.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-grade'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
