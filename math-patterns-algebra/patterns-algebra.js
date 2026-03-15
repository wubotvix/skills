// eClaw Math Patterns & Algebraic Thinking Interactive Tutor (K-6). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'math-patterns-algebra');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'repeating-patterns': ['identify-patterns', 'extend-patterns', 'create-patterns', 'copy-patterns', 'translate-patterns'],
  },
  'grade-1': {
    'count-patterns': ['skip-count-2s', 'skip-count-5s', 'skip-count-10s'],
    'addition-patterns': ['doubles', 'plus-ten'],
    'properties-intro': ['commutative-addition'],
    'missing-values': ['missing-addend'],
    'equality': ['equal-sign-meaning', 'true-false-equations'],
  },
  'grade-2': {
    'skip-counting-extended': ['skip-count-2s-5s-10s', 'skip-count-100s'],
    'even-odd': ['even-odd-patterns'],
    'additive-patterns': ['plus-ten-pattern', 'repeated-addition'],
    'equality-extended': ['unknown-left-side'],
  },
  'grade-3': {
    'multiplication-patterns': ['times-0-1', 'times-2-5-10'],
    'properties': ['commutative-multiplication', 'associative-multiplication', 'distributive-property'],
    'arithmetic-patterns': ['addition-table-patterns', 'multiplication-table-patterns'],
    'two-step': ['two-step-unknowns'],
  },
  'grade-4': {
    'number-patterns': ['generate-pattern', 'pattern-features'],
    'input-output': ['complete-table', 'find-the-rule'],
    'multi-step': ['equations-one-unknown'],
    'factors-multiples': ['factor-pairs', 'prime-composite'],
  },
  'grade-5': {
    'numerical-expressions': ['write-expressions', 'evaluate-expressions'],
    'order-of-operations': ['pemdas-basics'],
    'translating': ['words-to-expressions'],
    'coordinate-plane': ['plot-ordered-pairs', 'graph-a-rule'],
    'two-rules': ['compare-two-patterns'],
  },
  'grade-6': {
    'variables': ['variable-as-unknown', 'variable-as-quantity'],
    'algebraic-expressions': ['write-algebraic', 'evaluate-algebraic'],
    'equivalent-expressions': ['distributive-expand', 'combine-like-terms'],
    'one-step-equations': ['solve-add-sub', 'solve-mult-div'],
    'inequalities': ['inequality-meaning', 'inequality-on-number-line'],
    'dependent-independent': ['identify-variables', 'tables-and-graphs'],
  },
};

const PROBLEM_BANKS = {
  'kindergarten': {
    'identify-patterns': {
      patterns: [
        { sequence: ['red', 'blue', 'red', 'blue', 'red', 'blue'], type: 'AB', answer: 'AB' },
        { sequence: ['clap', 'clap', 'stomp', 'clap', 'clap', 'stomp'], type: 'AAB', answer: 'AAB' },
        { sequence: ['circle', 'square', 'triangle', 'circle', 'square', 'triangle'], type: 'ABC', answer: 'ABC' },
        { sequence: ['big', 'small', 'small', 'big', 'small', 'small'], type: 'ABB', answer: 'ABB' },
        { sequence: ['star', 'heart', 'star', 'heart', 'star', 'heart'], type: 'AB', answer: 'AB' },
        { sequence: ['red', 'red', 'blue', 'red', 'red', 'blue'], type: 'AAB', answer: 'AAB' },
        { sequence: ['cat', 'dog', 'bird', 'cat', 'dog', 'bird'], type: 'ABC', answer: 'ABC' },
        { sequence: ['up', 'down', 'down', 'up', 'down', 'down'], type: 'ABB', answer: 'ABB' },
        { sequence: ['sun', 'moon', 'sun', 'moon', 'sun', 'moon'], type: 'AB', answer: 'AB' },
        { sequence: ['snap', 'snap', 'clap', 'snap', 'snap', 'clap'], type: 'AAB', answer: 'AAB' },
      ],
    },
    'extend-patterns': {
      patterns: [
        { sequence: ['red', 'blue', 'red', 'blue'], answer: 'red', prompt: 'red, blue, red, blue, ___' },
        { sequence: ['A', 'B', 'B', 'A', 'B', 'B'], answer: 'A', prompt: 'A, B, B, A, B, B, ___' },
        { sequence: ['circle', 'square', 'circle', 'square'], answer: 'circle', prompt: 'circle, square, circle, square, ___' },
        { sequence: ['clap', 'clap', 'stomp', 'clap', 'clap'], answer: 'stomp', prompt: 'clap, clap, stomp, clap, clap, ___' },
        { sequence: ['1', '2', '3', '1', '2'], answer: '3', prompt: '1, 2, 3, 1, 2, ___' },
        { sequence: ['big', 'small', 'big', 'small'], answer: 'big', prompt: 'big, small, big, small, ___' },
        { sequence: ['red', 'red', 'blue', 'red', 'red'], answer: 'blue', prompt: 'red, red, blue, red, red, ___' },
        { sequence: ['sun', 'star', 'moon', 'sun', 'star'], answer: 'moon', prompt: 'sun, star, moon, sun, star, ___' },
        { sequence: ['hop', 'skip', 'hop', 'skip'], answer: 'hop', prompt: 'hop, skip, hop, skip, ___' },
        { sequence: ['A', 'B', 'C', 'A', 'B'], answer: 'C', prompt: 'A, B, C, A, B, ___' },
      ],
    },
    'create-patterns': {
      prompts: [
        { type: 'AB', prompt: 'Make an AB pattern using colors.', example: 'red, blue, red, blue, red, blue' },
        { type: 'ABB', prompt: 'Make an ABB pattern using shapes.', example: 'circle, square, square, circle, square, square' },
        { type: 'ABC', prompt: 'Make an ABC pattern using animals.', example: 'cat, dog, fish, cat, dog, fish' },
        { type: 'AAB', prompt: 'Make an AAB pattern using sounds.', example: 'clap, clap, stomp, clap, clap, stomp' },
        { type: 'AB', prompt: 'Make an AB pattern using body movements.', example: 'jump, sit, jump, sit, jump, sit' },
      ],
    },
    'copy-patterns': {
      patterns: [
        { given: 'red, blue, red, blue, red, blue', answer: 'red, blue, red, blue, red, blue' },
        { given: 'clap, stomp, clap, stomp, clap, stomp', answer: 'clap, stomp, clap, stomp, clap, stomp' },
        { given: 'A, B, B, A, B, B', answer: 'A, B, B, A, B, B' },
        { given: 'circle, circle, square, circle, circle, square', answer: 'circle, circle, square, circle, circle, square' },
        { given: 'big, small, big, small, big, small', answer: 'big, small, big, small, big, small' },
      ],
    },
    'translate-patterns': {
      translations: [
        { from: 'clap, stomp, clap, stomp', to: 'Use colors instead', type: 'AB', example: 'red, blue, red, blue' },
        { from: 'A, B, B, A, B, B', to: 'Use shapes instead', type: 'ABB', example: 'circle, square, square, circle, square, square' },
        { from: 'red, green, red, green', to: 'Use sounds instead', type: 'AB', example: 'snap, clap, snap, clap' },
        { from: 'hop, skip, jump, hop, skip, jump', to: 'Use letters instead', type: 'ABC', example: 'A, B, C, A, B, C' },
        { from: 'star, star, moon, star, star, moon', to: 'Use numbers instead', type: 'AAB', example: '1, 1, 2, 1, 1, 2' },
      ],
    },
  },
  'grade-1': {
    'skip-count-2s': {
      sequences: [
        { start: 0, step: 2, given: [0, 2, 4, 6], answer: 8, prompt: '0, 2, 4, 6, ___' },
        { start: 2, step: 2, given: [2, 4, 6, 8], answer: 10, prompt: '2, 4, 6, 8, ___' },
        { start: 10, step: 2, given: [10, 12, 14, 16], answer: 18, prompt: '10, 12, 14, 16, ___' },
        { start: 4, step: 2, given: [4, 6, 8, 10], answer: 12, prompt: '4, 6, 8, 10, ___' },
        { start: 6, step: 2, given: [6, 8, 10, 12], answer: 14, prompt: '6, 8, 10, 12, ___' },
        { start: 14, step: 2, given: [14, 16, 18, 20], answer: 22, prompt: '14, 16, 18, 20, ___' },
        { start: 0, step: 2, given: [0, 2, 4], answer: 6, prompt: '0, 2, 4, ___' },
        { start: 8, step: 2, given: [8, 10, 12, 14], answer: 16, prompt: '8, 10, 12, 14, ___' },
      ],
    },
    'skip-count-5s': {
      sequences: [
        { start: 0, step: 5, given: [0, 5, 10, 15], answer: 20, prompt: '0, 5, 10, 15, ___' },
        { start: 5, step: 5, given: [5, 10, 15, 20], answer: 25, prompt: '5, 10, 15, 20, ___' },
        { start: 10, step: 5, given: [10, 15, 20, 25], answer: 30, prompt: '10, 15, 20, 25, ___' },
        { start: 20, step: 5, given: [20, 25, 30, 35], answer: 40, prompt: '20, 25, 30, 35, ___' },
        { start: 30, step: 5, given: [30, 35, 40, 45], answer: 50, prompt: '30, 35, 40, 45, ___' },
        { start: 0, step: 5, given: [0, 5, 10], answer: 15, prompt: '0, 5, 10, ___' },
        { start: 15, step: 5, given: [15, 20, 25, 30], answer: 35, prompt: '15, 20, 25, 30, ___' },
        { start: 40, step: 5, given: [40, 45, 50, 55], answer: 60, prompt: '40, 45, 50, 55, ___' },
      ],
    },
    'skip-count-10s': {
      sequences: [
        { start: 0, step: 10, given: [0, 10, 20, 30], answer: 40, prompt: '0, 10, 20, 30, ___' },
        { start: 10, step: 10, given: [10, 20, 30, 40], answer: 50, prompt: '10, 20, 30, 40, ___' },
        { start: 20, step: 10, given: [20, 30, 40, 50], answer: 60, prompt: '20, 30, 40, 50, ___' },
        { start: 50, step: 10, given: [50, 60, 70, 80], answer: 90, prompt: '50, 60, 70, 80, ___' },
        { start: 30, step: 10, given: [30, 40, 50, 60], answer: 70, prompt: '30, 40, 50, 60, ___' },
        { start: 0, step: 10, given: [0, 10, 20], answer: 30, prompt: '0, 10, 20, ___' },
        { start: 60, step: 10, given: [60, 70, 80, 90], answer: 100, prompt: '60, 70, 80, 90, ___' },
        { start: 40, step: 10, given: [40, 50, 60, 70], answer: 80, prompt: '40, 50, 60, 70, ___' },
      ],
    },
    'doubles': {
      problems: [
        { a: 1, answer: 2, prompt: '1 + 1 = ___' },
        { a: 2, answer: 4, prompt: '2 + 2 = ___' },
        { a: 3, answer: 6, prompt: '3 + 3 = ___' },
        { a: 4, answer: 8, prompt: '4 + 4 = ___' },
        { a: 5, answer: 10, prompt: '5 + 5 = ___' },
        { a: 6, answer: 12, prompt: '6 + 6 = ___' },
        { a: 7, answer: 14, prompt: '7 + 7 = ___' },
        { a: 8, answer: 16, prompt: '8 + 8 = ___' },
        { a: 9, answer: 18, prompt: '9 + 9 = ___' },
        { a: 10, answer: 20, prompt: '10 + 10 = ___' },
      ],
    },
    'plus-ten': {
      problems: [
        { a: 3, answer: 13, prompt: '3 + 10 = ___' },
        { a: 7, answer: 17, prompt: '7 + 10 = ___' },
        { a: 12, answer: 22, prompt: '12 + 10 = ___' },
        { a: 5, answer: 15, prompt: '5 + 10 = ___' },
        { a: 18, answer: 28, prompt: '18 + 10 = ___' },
        { a: 25, answer: 35, prompt: '25 + 10 = ___' },
        { a: 9, answer: 19, prompt: '9 + 10 = ___' },
        { a: 14, answer: 24, prompt: '14 + 10 = ___' },
        { a: 30, answer: 40, prompt: '30 + 10 = ___' },
        { a: 1, answer: 11, prompt: '1 + 10 = ___' },
      ],
    },
    'commutative-addition': {
      problems: [
        { a: 3, b: 5, answer: 'yes', prompt: 'Is 3 + 5 the same as 5 + 3?' },
        { a: 7, b: 2, answer: 'yes', prompt: 'Is 7 + 2 the same as 2 + 7?' },
        { a: 4, b: 6, answer: 'yes', prompt: 'Is 4 + 6 the same as 6 + 4?' },
        { a: 8, b: 1, answer: 'yes', prompt: 'Is 8 + 1 the same as 1 + 8?' },
        { a: 9, b: 3, answer: 'yes', prompt: 'Does 9 + 3 = 3 + 9?' },
        { a: 5, b: 5, answer: 'yes', prompt: 'Does 5 + 5 = 5 + 5?' },
        { a: 2, b: 8, answer: 10, prompt: 'If 8 + 2 = 10, then 2 + 8 = ___' },
        { a: 6, b: 3, answer: 9, prompt: 'If 6 + 3 = 9, then 3 + 6 = ___' },
        { a: 7, b: 4, answer: 11, prompt: 'If 7 + 4 = 11, then 4 + 7 = ___' },
        { a: 1, b: 9, answer: 10, prompt: 'If 1 + 9 = 10, then 9 + 1 = ___' },
      ],
    },
    'missing-addend': {
      problems: [
        { equation: '3 + ___ = 7', answer: 4, a: 3, sum: 7 },
        { equation: '5 + ___ = 9', answer: 4, a: 5, sum: 9 },
        { equation: '___ + 4 = 10', answer: 6, a: 4, sum: 10 },
        { equation: '2 + ___ = 8', answer: 6, a: 2, sum: 8 },
        { equation: '___ + 5 = 12', answer: 7, a: 5, sum: 12 },
        { equation: '7 + ___ = 15', answer: 8, a: 7, sum: 15 },
        { equation: '___ + 3 = 11', answer: 8, a: 3, sum: 11 },
        { equation: '6 + ___ = 13', answer: 7, a: 6, sum: 13 },
        { equation: '4 + ___ = 9', answer: 5, a: 4, sum: 9 },
        { equation: '___ + 8 = 14', answer: 6, a: 8, sum: 14 },
      ],
    },
    'equal-sign-meaning': {
      problems: [
        { prompt: 'Does 3 + 5 = 8?', answer: 'yes' },
        { prompt: 'Does 8 = 3 + 5?', answer: 'yes' },
        { prompt: 'Does 4 + 4 = 3 + 5?', answer: 'yes' },
        { prompt: 'Does 2 + 6 = 4 + 4?', answer: 'yes' },
        { prompt: 'Does 7 = 7?', answer: 'yes' },
        { prompt: 'Does 5 + 1 = 3 + 4?', answer: 'no' },
        { prompt: 'Does 10 = 6 + 4?', answer: 'yes' },
        { prompt: 'Does 3 + 3 = 2 + 4?', answer: 'yes' },
        { prompt: 'Does 9 = 5 + 5?', answer: 'no' },
        { prompt: 'Does 1 + 7 = 2 + 6?', answer: 'yes' },
      ],
    },
    'true-false-equations': {
      problems: [
        { equation: '5 + 3 = 8', answer: 'true' },
        { equation: '4 + 2 = 7', answer: 'false' },
        { equation: '6 = 2 + 4', answer: 'true' },
        { equation: '3 + 5 = 4 + 4', answer: 'true' },
        { equation: '7 + 1 = 9', answer: 'false' },
        { equation: '10 = 10', answer: 'true' },
        { equation: '2 + 3 = 3 + 2', answer: 'true' },
        { equation: '5 + 4 = 4 + 6', answer: 'false' },
        { equation: '8 = 5 + 3', answer: 'true' },
        { equation: '6 + 3 = 10 - 1', answer: 'true' },
      ],
    },
  },
  'grade-2': {
    'skip-count-2s-5s-10s': {
      sequences: [
        { step: 2, given: [12, 14, 16, 18], answer: 20, prompt: '12, 14, 16, 18, ___' },
        { step: 5, given: [25, 30, 35, 40], answer: 45, prompt: '25, 30, 35, 40, ___' },
        { step: 10, given: [40, 50, 60, 70], answer: 80, prompt: '40, 50, 60, 70, ___' },
        { step: 2, given: [22, 24, 26, 28], answer: 30, prompt: '22, 24, 26, 28, ___' },
        { step: 5, given: [50, 55, 60, 65], answer: 70, prompt: '50, 55, 60, 65, ___' },
        { step: 10, given: [70, 80, 90, 100], answer: 110, prompt: '70, 80, 90, 100, ___' },
        { step: 2, given: [30, 32, 34, 36], answer: 38, prompt: '30, 32, 34, 36, ___' },
        { step: 5, given: [75, 80, 85, 90], answer: 95, prompt: '75, 80, 85, 90, ___' },
      ],
    },
    'skip-count-100s': {
      sequences: [
        { step: 100, given: [100, 200, 300, 400], answer: 500, prompt: '100, 200, 300, 400, ___' },
        { step: 100, given: [200, 300, 400, 500], answer: 600, prompt: '200, 300, 400, 500, ___' },
        { step: 100, given: [500, 600, 700, 800], answer: 900, prompt: '500, 600, 700, 800, ___' },
        { step: 100, given: [150, 250, 350, 450], answer: 550, prompt: '150, 250, 350, 450, ___' },
        { step: 100, given: [310, 410, 510, 610], answer: 710, prompt: '310, 410, 510, 610, ___' },
        { step: 100, given: [0, 100, 200, 300], answer: 400, prompt: '0, 100, 200, 300, ___' },
      ],
    },
    'even-odd-patterns': {
      problems: [
        { prompt: 'Is 4 + 6 even or odd?', a: 4, b: 6, answer: 'even', rule: 'even + even = even' },
        { prompt: 'Is 3 + 5 even or odd?', a: 3, b: 5, answer: 'even', rule: 'odd + odd = even' },
        { prompt: 'Is 4 + 3 even or odd?', a: 4, b: 3, answer: 'odd', rule: 'even + odd = odd' },
        { prompt: 'Is 2 + 8 even or odd?', a: 2, b: 8, answer: 'even', rule: 'even + even = even' },
        { prompt: 'Is 7 + 5 even or odd?', a: 7, b: 5, answer: 'even', rule: 'odd + odd = even' },
        { prompt: 'Is 6 + 1 even or odd?', a: 6, b: 1, answer: 'odd', rule: 'even + odd = odd' },
        { prompt: 'Is 9 + 3 even or odd?', a: 9, b: 3, answer: 'even', rule: 'odd + odd = even' },
        { prompt: 'Is 8 + 5 even or odd?', a: 8, b: 5, answer: 'odd', rule: 'even + odd = odd' },
        { prompt: 'Is 12 even or odd?', answer: 'even' },
        { prompt: 'Is 15 even or odd?', answer: 'odd' },
      ],
    },
    'plus-ten-pattern': {
      sequences: [
        { given: [34, 44, 54, 64], answer: 74, prompt: '34, 44, 54, 64, ___' },
        { given: [17, 27, 37, 47], answer: 57, prompt: '17, 27, 37, 47, ___' },
        { given: [23, 33, 43, 53], answer: 63, prompt: '23, 33, 43, 53, ___' },
        { given: [51, 61, 71, 81], answer: 91, prompt: '51, 61, 71, 81, ___' },
        { given: [8, 18, 28, 38], answer: 48, prompt: '8, 18, 28, 38, ___' },
        { given: [45, 55, 65, 75], answer: 85, prompt: '45, 55, 65, 75, ___' },
        { given: [66, 76, 86, 96], answer: 106, prompt: '66, 76, 86, 96, ___' },
        { given: [12, 22, 32, 42], answer: 52, prompt: '12, 22, 32, 42, ___' },
      ],
    },
    'repeated-addition': {
      problems: [
        { groups: 3, each: 4, prompt: '4 + 4 + 4 = ___ (3 groups of 4)', answer: 12 },
        { groups: 4, each: 2, prompt: '2 + 2 + 2 + 2 = ___ (4 groups of 2)', answer: 8 },
        { groups: 5, each: 3, prompt: '3 + 3 + 3 + 3 + 3 = ___ (5 groups of 3)', answer: 15 },
        { groups: 2, each: 6, prompt: '6 + 6 = ___ (2 groups of 6)', answer: 12 },
        { groups: 3, each: 5, prompt: '5 + 5 + 5 = ___ (3 groups of 5)', answer: 15 },
        { groups: 4, each: 5, prompt: '5 + 5 + 5 + 5 = ___ (4 groups of 5)', answer: 20 },
        { groups: 2, each: 9, prompt: '9 + 9 = ___ (2 groups of 9)', answer: 18 },
        { groups: 3, each: 3, prompt: '3 + 3 + 3 = ___ (3 groups of 3)', answer: 9 },
        { groups: 5, each: 2, prompt: '2 + 2 + 2 + 2 + 2 = ___ (5 groups of 2)', answer: 10 },
        { groups: 4, each: 4, prompt: '4 + 4 + 4 + 4 = ___ (4 groups of 4)', answer: 16 },
      ],
    },
    'unknown-left-side': {
      problems: [
        { equation: '___ = 3 + 5', answer: 8 },
        { equation: '___ = 7 + 4', answer: 11 },
        { equation: '___ = 10 - 3', answer: 7 },
        { equation: '___ = 6 + 6', answer: 12 },
        { equation: '___ = 9 + 5', answer: 14 },
        { equation: '___ = 15 - 8', answer: 7 },
        { equation: '___ = 8 + 7', answer: 15 },
        { equation: '___ = 12 - 4', answer: 8 },
        { equation: '___ = 2 + 9', answer: 11 },
        { equation: '___ = 20 - 5', answer: 15 },
      ],
    },
  },
  'grade-3': {
    'times-0-1': {
      problems: [
        { prompt: '5 x 0 = ___', answer: 0 },
        { prompt: '0 x 8 = ___', answer: 0 },
        { prompt: '7 x 1 = ___', answer: 7 },
        { prompt: '1 x 4 = ___', answer: 4 },
        { prompt: '0 x 100 = ___', answer: 0 },
        { prompt: '1 x 9 = ___', answer: 9 },
        { prompt: '6 x 0 = ___', answer: 0 },
        { prompt: '1 x 12 = ___', answer: 12 },
        { prompt: '3 x 1 = ___', answer: 3 },
        { prompt: '0 x 0 = ___', answer: 0 },
      ],
    },
    'times-2-5-10': {
      problems: [
        { prompt: '2 x 6 = ___', answer: 12 },
        { prompt: '5 x 4 = ___', answer: 20 },
        { prompt: '10 x 3 = ___', answer: 30 },
        { prompt: '2 x 9 = ___', answer: 18 },
        { prompt: '5 x 7 = ___', answer: 35 },
        { prompt: '10 x 8 = ___', answer: 80 },
        { prompt: '2 x 5 = ___', answer: 10 },
        { prompt: '5 x 9 = ___', answer: 45 },
        { prompt: '10 x 6 = ___', answer: 60 },
        { prompt: '2 x 8 = ___', answer: 16 },
        { prompt: '5 x 5 = ___', answer: 25 },
        { prompt: '10 x 10 = ___', answer: 100 },
      ],
    },
    'commutative-multiplication': {
      problems: [
        { prompt: 'If 4 x 7 = 28, then 7 x 4 = ___', answer: 28 },
        { prompt: 'If 3 x 8 = 24, then 8 x 3 = ___', answer: 24 },
        { prompt: 'If 6 x 5 = 30, then 5 x 6 = ___', answer: 30 },
        { prompt: 'If 9 x 2 = 18, then 2 x 9 = ___', answer: 18 },
        { prompt: 'Is 3 x 7 the same as 7 x 3?', answer: 'yes' },
        { prompt: 'Is 5 x 8 the same as 8 x 5?', answer: 'yes' },
        { prompt: 'If 4 x 9 = 36, then 9 x 4 = ___', answer: 36 },
        { prompt: 'If 6 x 7 = 42, then 7 x 6 = ___', answer: 42 },
        { prompt: 'Does 2 x 5 = 5 x 2?', answer: 'yes' },
        { prompt: 'If 8 x 4 = 32, then 4 x 8 = ___', answer: 32 },
      ],
    },
    'associative-multiplication': {
      problems: [
        { prompt: '(2 x 3) x 4 = ___', answer: 24, steps: '6 x 4 = 24' },
        { prompt: '2 x (3 x 4) = ___', answer: 24, steps: '2 x 12 = 24' },
        { prompt: '(5 x 2) x 3 = ___', answer: 30, steps: '10 x 3 = 30' },
        { prompt: '5 x (2 x 3) = ___', answer: 30, steps: '5 x 6 = 30' },
        { prompt: '(4 x 2) x 5 = ___', answer: 40, steps: '8 x 5 = 40' },
        { prompt: '4 x (2 x 5) = ___', answer: 40, steps: '4 x 10 = 40' },
        { prompt: '(3 x 3) x 2 = ___', answer: 18, steps: '9 x 2 = 18' },
        { prompt: '3 x (3 x 2) = ___', answer: 18, steps: '3 x 6 = 18' },
        { prompt: '(2 x 5) x 6 = ___', answer: 60, steps: '10 x 6 = 60' },
        { prompt: '2 x (5 x 6) = ___', answer: 60, steps: '2 x 30 = 60' },
      ],
    },
    'distributive-property': {
      problems: [
        { prompt: '7 x 8 = 7 x (5 + 3) = (7x5) + (7x3) = ___', answer: 56, expanded: '35 + 21 = 56' },
        { prompt: '6 x 7 = 6 x (5 + 2) = (6x5) + (6x2) = ___', answer: 42, expanded: '30 + 12 = 42' },
        { prompt: '8 x 6 = 8 x (5 + 1) = (8x5) + (8x1) = ___', answer: 48, expanded: '40 + 8 = 48' },
        { prompt: '9 x 6 = 9 x (5 + 1) = (9x5) + (9x1) = ___', answer: 54, expanded: '45 + 9 = 54' },
        { prompt: '4 x 12 = 4 x (10 + 2) = (4x10) + (4x2) = ___', answer: 48, expanded: '40 + 8 = 48' },
        { prompt: '3 x 14 = 3 x (10 + 4) = (3x10) + (3x4) = ___', answer: 42, expanded: '30 + 12 = 42' },
        { prompt: '5 x 13 = 5 x (10 + 3) = (5x10) + (5x3) = ___', answer: 65, expanded: '50 + 15 = 65' },
        { prompt: '6 x 8 = 6 x (5 + 3) = (6x5) + (6x3) = ___', answer: 48, expanded: '30 + 18 = 48' },
      ],
    },
    'addition-table-patterns': {
      problems: [
        { prompt: 'In the addition table, what pattern do you see in the +2 column: 2, 4, 6, 8, ___?', answer: 10 },
        { prompt: 'In the addition table, what pattern do you see in the +5 column: 5, 10, 15, 20, ___?', answer: 25 },
        { prompt: 'What is 6 + 3? And what is 3 + 6?', answer: 9 },
        { prompt: 'In the +9 row: 9, 18, 27, 36, ___?', answer: 45 },
        { prompt: 'The diagonal of the addition table shows doubles: 2, 4, 6, 8, ___?', answer: 10 },
        { prompt: 'In the +3 column: 3, 6, 9, 12, ___?', answer: 15 },
        { prompt: 'In the +4 column: 4, 8, 12, 16, ___?', answer: 20 },
        { prompt: 'In the +7 row: 7, 14, 21, 28, ___?', answer: 35 },
      ],
    },
    'multiplication-table-patterns': {
      problems: [
        { prompt: 'In the x3 row: 3, 6, 9, 12, 15, ___?', answer: 18 },
        { prompt: 'In the x4 row: 4, 8, 12, 16, 20, ___?', answer: 24 },
        { prompt: 'In the x6 row: 6, 12, 18, 24, 30, ___?', answer: 36 },
        { prompt: 'All numbers in the x5 row end in ___ or ___.', answer: '0 or 5', acceptedAnswers: ['0 or 5', '5 or 0', '0 and 5', '5 and 0'] },
        { prompt: 'In the x9 row: 9, 18, 27, 36, 45, ___?', answer: 54 },
        { prompt: 'The digits of multiples of 9 always add up to ___', answer: 9 },
        { prompt: 'In the x7 row: 7, 14, 21, 28, ___?', answer: 35 },
        { prompt: 'In the x8 row: 8, 16, 24, 32, ___?', answer: 40 },
      ],
    },
    'two-step-unknowns': {
      problems: [
        { equation: '3 x 4 + n = 15', answer: 3, prompt: '3 x 4 + n = 15. What is n?' },
        { equation: '2 x 5 + n = 13', answer: 3, prompt: '2 x 5 + n = 13. What is n?' },
        { equation: 'n + 3 x 2 = 10', answer: 4, prompt: 'n + 3 x 2 = 10. What is n?' },
        { equation: '4 x 3 - n = 10', answer: 2, prompt: '4 x 3 - n = 10. What is n?' },
        { equation: '5 x 2 + n = 15', answer: 5, prompt: '5 x 2 + n = 15. What is n?' },
        { equation: '3 x 6 - n = 15', answer: 3, prompt: '3 x 6 - n = 15. What is n?' },
        { equation: '2 x 8 + n = 20', answer: 4, prompt: '2 x 8 + n = 20. What is n?' },
        { equation: 'n x 3 + 1 = 10', answer: 3, prompt: 'n x 3 + 1 = 10. What is n?' },
      ],
    },
  },
  'grade-4': {
    'generate-pattern': {
      problems: [
        { rule: 'Start at 1, add 3', start: 1, step: 3, answer: [1, 4, 7, 10, 13], prompt: 'Start at 1, add 3 each time. Write the first 5 numbers.' },
        { rule: 'Start at 2, add 5', start: 2, step: 5, answer: [2, 7, 12, 17, 22], prompt: 'Start at 2, add 5 each time. Write the first 5 numbers.' },
        { rule: 'Start at 0, add 4', start: 0, step: 4, answer: [0, 4, 8, 12, 16], prompt: 'Start at 0, add 4 each time. Write the first 5 numbers.' },
        { rule: 'Start at 5, add 6', start: 5, step: 6, answer: [5, 11, 17, 23, 29], prompt: 'Start at 5, add 6 each time. Write the first 5 numbers.' },
        { rule: 'Start at 3, multiply by 2', start: 3, factor: 2, answer: [3, 6, 12, 24, 48], prompt: 'Start at 3, multiply by 2 each time. Write the first 5 numbers.' },
        { rule: 'Start at 1, multiply by 3', start: 1, factor: 3, answer: [1, 3, 9, 27, 81], prompt: 'Start at 1, multiply by 3 each time. Write the first 5 numbers.' },
        { rule: 'Start at 10, subtract 2', start: 10, step: -2, answer: [10, 8, 6, 4, 2], prompt: 'Start at 10, subtract 2 each time. Write the first 5 numbers.' },
        { rule: 'Start at 100, subtract 7', start: 100, step: -7, answer: [100, 93, 86, 79, 72], prompt: 'Start at 100, subtract 7 each time. Write the first 5 numbers.' },
      ],
    },
    'pattern-features': {
      problems: [
        { sequence: [1, 4, 7, 10, 13], prompt: 'Look at: 1, 4, 7, 10, 13. Are all the numbers odd?', answer: 'no', feature: 'alternates odd/even' },
        { sequence: [2, 4, 6, 8, 10], prompt: 'Look at: 2, 4, 6, 8, 10. Are all the numbers even?', answer: 'yes', feature: 'all even' },
        { sequence: [5, 10, 15, 20, 25], prompt: 'Look at: 5, 10, 15, 20, 25. Do all numbers end in 0 or 5?', answer: 'yes', feature: 'multiples of 5' },
        { sequence: [3, 6, 12, 24, 48], prompt: 'Look at: 3, 6, 12, 24, 48. Does each number double?', answer: 'yes', feature: 'doubles each time' },
        { sequence: [1, 3, 5, 7, 9], prompt: 'Look at: 1, 3, 5, 7, 9. Are all the numbers odd?', answer: 'yes', feature: 'all odd' },
        { sequence: [4, 8, 12, 16, 20], prompt: 'Look at: 4, 8, 12, 16, 20. Are all numbers multiples of 4?', answer: 'yes', feature: 'multiples of 4' },
        { sequence: [10, 8, 6, 4, 2], prompt: 'Look at: 10, 8, 6, 4, 2. Is this pattern going up or down?', answer: 'down', feature: 'decreasing by 2' },
        { sequence: [1, 4, 9, 16, 25], prompt: 'Look at: 1, 4, 9, 16, 25. These are all ___ numbers (perfect what?).', answer: 'square', feature: 'perfect squares' },
      ],
    },
    'complete-table': {
      tables: [
        { rule: 'x 3', input: [1, 2, 3, 4, 5], output: [3, 6, 9, null, null], missing: [12, 15], prompt: 'Rule: multiply by 3. Input: 1,2,3,4,5. Output: 3,6,9,___,___' },
        { rule: '+ 7', input: [1, 2, 3, 4, 5], output: [8, 9, 10, null, null], missing: [11, 12], prompt: 'Rule: add 7. Input: 1,2,3,4,5. Output: 8,9,10,___,___' },
        { rule: 'x 2 + 1', input: [1, 2, 3, 4, 5], output: [3, 5, 7, null, null], missing: [9, 11], prompt: 'Rule: multiply by 2, add 1. Input: 1,2,3,4,5. Output: 3,5,7,___,___' },
        { rule: 'x 4', input: [2, 3, 4, 5, 6], output: [8, 12, 16, null, null], missing: [20, 24], prompt: 'Rule: multiply by 4. Input: 2,3,4,5,6. Output: 8,12,16,___,___' },
        { rule: '- 3', input: [10, 9, 8, 7, 6], output: [7, 6, 5, null, null], missing: [4, 3], prompt: 'Rule: subtract 3. Input: 10,9,8,7,6. Output: 7,6,5,___,___' },
        { rule: 'x 5 - 1', input: [1, 2, 3, 4, 5], output: [4, 9, 14, null, null], missing: [19, 24], prompt: 'Rule: multiply by 5, subtract 1. Input: 1,2,3,4,5. Output: 4,9,14,___,___' },
      ],
    },
    'find-the-rule': {
      tables: [
        { input: [1, 2, 3, 4], output: [5, 10, 15, 20], answer: 'x 5', prompt: 'Input: 1,2,3,4 -> Output: 5,10,15,20. What is the rule?' },
        { input: [1, 2, 3, 4], output: [3, 5, 7, 9], answer: 'x 2 + 1', prompt: 'Input: 1,2,3,4 -> Output: 3,5,7,9. What is the rule?', acceptedAnswers: ['x 2 + 1', 'times 2 plus 1', 'multiply by 2 add 1', '2n + 1', '2x + 1'] },
        { input: [1, 2, 3, 4], output: [4, 7, 10, 13], answer: 'x 3 + 1', prompt: 'Input: 1,2,3,4 -> Output: 4,7,10,13. What is the rule?', acceptedAnswers: ['x 3 + 1', 'times 3 plus 1', 'multiply by 3 add 1', '3n + 1', '3x + 1'] },
        { input: [2, 4, 6, 8], output: [1, 2, 3, 4], answer: '/ 2', prompt: 'Input: 2,4,6,8 -> Output: 1,2,3,4. What is the rule?', acceptedAnswers: ['/ 2', 'divide by 2', 'n/2', 'x/2', 'half'] },
        { input: [1, 2, 3, 4], output: [6, 7, 8, 9], answer: '+ 5', prompt: 'Input: 1,2,3,4 -> Output: 6,7,8,9. What is the rule?', acceptedAnswers: ['+ 5', 'add 5', 'plus 5', 'n + 5', 'x + 5'] },
        { input: [1, 2, 3, 4], output: [2, 4, 6, 8], answer: 'x 2', prompt: 'Input: 1,2,3,4 -> Output: 2,4,6,8. What is the rule?', acceptedAnswers: ['x 2', 'times 2', 'multiply by 2', '2n', '2x', 'double'] },
      ],
    },
    'equations-one-unknown': {
      problems: [
        { equation: 'n + 15 = 23', answer: 8, prompt: 'Solve: n + 15 = 23' },
        { equation: 'n - 7 = 12', answer: 19, prompt: 'Solve: n - 7 = 12' },
        { equation: '3 x n = 21', answer: 7, prompt: 'Solve: 3 x n = 21' },
        { equation: 'n / 4 = 5', answer: 20, prompt: 'Solve: n / 4 = 5' },
        { equation: '2 x n + 3 = 11', answer: 4, prompt: 'Solve: 2 x n + 3 = 11' },
        { equation: 'n + 24 = 50', answer: 26, prompt: 'Solve: n + 24 = 50' },
        { equation: '5 x n = 45', answer: 9, prompt: 'Solve: 5 x n = 45' },
        { equation: 'n - 18 = 32', answer: 50, prompt: 'Solve: n - 18 = 32' },
        { equation: 'n / 6 = 8', answer: 48, prompt: 'Solve: n / 6 = 8' },
        { equation: '4 x n - 2 = 14', answer: 4, prompt: 'Solve: 4 x n - 2 = 14' },
      ],
    },
    'factor-pairs': {
      problems: [
        { number: 12, answer: '1,12 2,6 3,4', prompt: 'List all factor pairs of 12.', pairs: [[1,12],[2,6],[3,4]] },
        { number: 18, answer: '1,18 2,9 3,6', prompt: 'List all factor pairs of 18.', pairs: [[1,18],[2,9],[3,6]] },
        { number: 24, answer: '1,24 2,12 3,8 4,6', prompt: 'List all factor pairs of 24.', pairs: [[1,24],[2,12],[3,8],[4,6]] },
        { number: 16, answer: '1,16 2,8 4,4', prompt: 'List all factor pairs of 16.', pairs: [[1,16],[2,8],[4,4]] },
        { number: 20, answer: '1,20 2,10 4,5', prompt: 'List all factor pairs of 20.', pairs: [[1,20],[2,10],[4,5]] },
        { number: 36, answer: '1,36 2,18 3,12 4,9 6,6', prompt: 'List all factor pairs of 36.', pairs: [[1,36],[2,18],[3,12],[4,9],[6,6]] },
        { number: 10, answer: '1,10 2,5', prompt: 'List all factor pairs of 10.', pairs: [[1,10],[2,5]] },
        { number: 30, answer: '1,30 2,15 3,10 5,6', prompt: 'List all factor pairs of 30.', pairs: [[1,30],[2,15],[3,10],[5,6]] },
      ],
    },
    'prime-composite': {
      problems: [
        { number: 7, answer: 'prime', prompt: 'Is 7 prime or composite?' },
        { number: 12, answer: 'composite', prompt: 'Is 12 prime or composite?' },
        { number: 11, answer: 'prime', prompt: 'Is 11 prime or composite?' },
        { number: 15, answer: 'composite', prompt: 'Is 15 prime or composite?' },
        { number: 2, answer: 'prime', prompt: 'Is 2 prime or composite?' },
        { number: 9, answer: 'composite', prompt: 'Is 9 prime or composite?' },
        { number: 23, answer: 'prime', prompt: 'Is 23 prime or composite?' },
        { number: 21, answer: 'composite', prompt: 'Is 21 prime or composite?' },
        { number: 29, answer: 'prime', prompt: 'Is 29 prime or composite?' },
        { number: 1, answer: 'neither', prompt: 'Is 1 prime or composite?', acceptedAnswers: ['neither', 'not prime', 'not composite', 'neither prime nor composite'] },
      ],
    },
  },
  'grade-5': {
    'write-expressions': {
      problems: [
        { words: 'the sum of 8 and 3', answer: '8 + 3', prompt: 'Write a numerical expression for: the sum of 8 and 3' },
        { words: '2 times the difference of 10 and 4', answer: '2 x (10 - 4)', prompt: 'Write a numerical expression for: 2 times the difference of 10 and 4', acceptedAnswers: ['2 x (10 - 4)', '2 * (10 - 4)', '2(10 - 4)', '2 x (10-4)'] },
        { words: 'add 7 and 5, then multiply by 3', answer: '(7 + 5) x 3', prompt: 'Write a numerical expression for: add 7 and 5, then multiply by 3', acceptedAnswers: ['(7 + 5) x 3', '(7 + 5) * 3', '3 x (7 + 5)', '3(7 + 5)'] },
        { words: 'subtract 3 from 15, then divide by 4', answer: '(15 - 3) / 4', prompt: 'Write a numerical expression for: subtract 3 from 15, then divide by 4', acceptedAnswers: ['(15 - 3) / 4', '(15 - 3) ÷ 4'] },
        { words: 'half of 20', answer: '20 / 2', prompt: 'Write a numerical expression for: half of 20', acceptedAnswers: ['20 / 2', '20 ÷ 2', '20/2'] },
        { words: 'the product of 6 and 9', answer: '6 x 9', prompt: 'Write a numerical expression for: the product of 6 and 9', acceptedAnswers: ['6 x 9', '6 * 9', '6(9)', '9 x 6'] },
        { words: '3 squared plus 4', answer: '3^2 + 4', prompt: 'Write a numerical expression for: 3 squared plus 4', acceptedAnswers: ['3^2 + 4', '3² + 4', '9 + 4'] },
        { words: 'double 7, then subtract 5', answer: '2 x 7 - 5', prompt: 'Write a numerical expression for: double 7, then subtract 5', acceptedAnswers: ['2 x 7 - 5', '2 * 7 - 5', '7 x 2 - 5', '14 - 5'] },
      ],
    },
    'evaluate-expressions': {
      problems: [
        { expression: '3 + 4 x 2', answer: 11, prompt: 'Evaluate: 3 + 4 x 2' },
        { expression: '(3 + 4) x 2', answer: 14, prompt: 'Evaluate: (3 + 4) x 2' },
        { expression: '20 - 3 x 5', answer: 5, prompt: 'Evaluate: 20 - 3 x 5' },
        { expression: '2 x (8 + 2)', answer: 20, prompt: 'Evaluate: 2 x (8 + 2)' },
        { expression: '(12 - 4) / 2', answer: 4, prompt: 'Evaluate: (12 - 4) / 2' },
        { expression: '5 + 3^2', answer: 14, prompt: 'Evaluate: 5 + 3^2' },
        { expression: '(6 + 4) x (3 + 2)', answer: 50, prompt: 'Evaluate: (6 + 4) x (3 + 2)' },
        { expression: '100 / (4 x 5)', answer: 5, prompt: 'Evaluate: 100 / (4 x 5)' },
        { expression: '2^3 + 7', answer: 15, prompt: 'Evaluate: 2^3 + 7' },
        { expression: '(15 - 5) / (2 + 3)', answer: 2, prompt: 'Evaluate: (15 - 5) / (2 + 3)' },
      ],
    },
    'pemdas-basics': {
      problems: [
        { expression: '6 + 2 x 3', answer: 12, prompt: 'Evaluate using order of operations: 6 + 2 x 3' },
        { expression: '(6 + 2) x 3', answer: 24, prompt: 'Evaluate using order of operations: (6 + 2) x 3' },
        { expression: '10 - 8 / 4', answer: 8, prompt: 'Evaluate using order of operations: 10 - 8 / 4' },
        { expression: '3 x 4 + 2 x 5', answer: 22, prompt: 'Evaluate using order of operations: 3 x 4 + 2 x 5' },
        { expression: '(2 + 3)^2', answer: 25, prompt: 'Evaluate using order of operations: (2 + 3)^2' },
        { expression: '4^2 - 6', answer: 10, prompt: 'Evaluate using order of operations: 4^2 - 6' },
        { expression: '2 x (3 + 5) - 4', answer: 12, prompt: 'Evaluate using order of operations: 2 x (3 + 5) - 4' },
        { expression: '30 / 5 + 2 x 3', answer: 12, prompt: 'Evaluate using order of operations: 30 / 5 + 2 x 3' },
        { expression: '(10 - 2) x (1 + 3)', answer: 32, prompt: 'Evaluate using order of operations: (10 - 2) x (1 + 3)' },
        { expression: '5 + 4^2 / 8', answer: 7, prompt: 'Evaluate using order of operations: 5 + 4^2 / 8' },
      ],
    },
    'words-to-expressions': {
      problems: [
        { phrase: '5 more than a number', answer: 'n + 5', prompt: 'Write an expression: 5 more than a number', acceptedAnswers: ['n + 5', 'x + 5', 'a + 5'] },
        { phrase: '3 less than a number', answer: 'n - 3', prompt: 'Write an expression: 3 less than a number', acceptedAnswers: ['n - 3', 'x - 3', 'a - 3'] },
        { phrase: 'twice a number', answer: '2n', prompt: 'Write an expression: twice a number', acceptedAnswers: ['2n', '2x', '2 x n', '2 * n', 'n x 2'] },
        { phrase: 'a number divided by 4', answer: 'n / 4', prompt: 'Write an expression: a number divided by 4', acceptedAnswers: ['n / 4', 'x / 4', 'n/4', 'n ÷ 4'] },
        { phrase: '3 times a number plus 7', answer: '3n + 7', prompt: 'Write an expression: 3 times a number plus 7', acceptedAnswers: ['3n + 7', '3x + 7', '3 x n + 7', '3 * n + 7'] },
        { phrase: 'half a number minus 2', answer: 'n/2 - 2', prompt: 'Write an expression: half a number minus 2', acceptedAnswers: ['n/2 - 2', 'n / 2 - 2', 'x/2 - 2', '0.5n - 2'] },
        { phrase: '8 more than twice a number', answer: '2n + 8', prompt: 'Write an expression: 8 more than twice a number', acceptedAnswers: ['2n + 8', '2x + 8', '8 + 2n'] },
        { phrase: '6 less than 3 times a number', answer: '3n - 6', prompt: 'Write an expression: 6 less than 3 times a number', acceptedAnswers: ['3n - 6', '3x - 6'] },
      ],
    },
    'plot-ordered-pairs': {
      problems: [
        { point: [2, 3], prompt: 'Plot the point (2, 3). Where do you go?', answer: 'right 2, up 3' },
        { point: [5, 1], prompt: 'Plot the point (5, 1). Where do you go?', answer: 'right 5, up 1' },
        { point: [0, 4], prompt: 'Plot the point (0, 4). Where do you go?', answer: 'right 0, up 4' },
        { point: [3, 0], prompt: 'Plot the point (3, 0). Where do you go?', answer: 'right 3, up 0' },
        { point: [4, 4], prompt: 'Plot the point (4, 4). Where do you go?', answer: 'right 4, up 4' },
        { point: [1, 5], prompt: 'Plot the point (1, 5). Where do you go?', answer: 'right 1, up 5' },
        { point: [0, 0], prompt: 'Plot the point (0, 0). What is this point called?', answer: 'origin', acceptedAnswers: ['origin', 'the origin', '(0,0)'] },
        { point: [3, 2], prompt: 'Plot the point (3, 2). Which number tells you how far RIGHT?', answer: '3' },
      ],
    },
    'graph-a-rule': {
      problems: [
        { rule: 'y = x + 1', pairs: [[0,1],[1,2],[2,3],[3,4]], prompt: 'For the rule y = x + 1, what is y when x = 3?', answer: 4 },
        { rule: 'y = 2x', pairs: [[0,0],[1,2],[2,4],[3,6]], prompt: 'For the rule y = 2x, what is y when x = 4?', answer: 8 },
        { rule: 'y = x + 3', pairs: [[0,3],[1,4],[2,5],[3,6]], prompt: 'For the rule y = x + 3, what is y when x = 5?', answer: 8 },
        { rule: 'y = 2x + 1', pairs: [[0,1],[1,3],[2,5],[3,7]], prompt: 'For the rule y = 2x + 1, what is y when x = 4?', answer: 9 },
        { rule: 'y = 3x', pairs: [[0,0],[1,3],[2,6],[3,9]], prompt: 'For the rule y = 3x, what is y when x = 5?', answer: 15 },
        { rule: 'y = x - 1', pairs: [[1,0],[2,1],[3,2],[4,3]], prompt: 'For the rule y = x - 1, what is y when x = 6?', answer: 5 },
      ],
    },
    'compare-two-patterns': {
      problems: [
        { ruleA: 'add 3', seqA: [0, 3, 6, 9, 12], ruleB: 'add 6', seqB: [0, 6, 12, 18, 24], prompt: 'Pattern A: 0,3,6,9,12 (add 3). Pattern B: 0,6,12,18,24 (add 6). Each term in B is ___ times the matching term in A.', answer: 2 },
        { ruleA: 'add 1', seqA: [0, 1, 2, 3, 4], ruleB: 'add 4', seqB: [0, 4, 8, 12, 16], prompt: 'Pattern A: 0,1,2,3,4 (add 1). Pattern B: 0,4,8,12,16 (add 4). Each term in B is ___ times the matching term in A.', answer: 4 },
        { ruleA: 'add 2', seqA: [0, 2, 4, 6, 8], ruleB: 'add 6', seqB: [0, 6, 12, 18, 24], prompt: 'Pattern A: 0,2,4,6,8 (add 2). Pattern B: 0,6,12,18,24 (add 6). Each term in B is ___ times the matching term in A.', answer: 3 },
        { ruleA: 'add 5', seqA: [0, 5, 10, 15, 20], ruleB: 'add 10', seqB: [0, 10, 20, 30, 40], prompt: 'Pattern A: 0,5,10,15,20 (add 5). Pattern B: 0,10,20,30,40 (add 10). Each term in B is ___ times the matching term in A.', answer: 2 },
        { ruleA: 'add 1', seqA: [0, 1, 2, 3, 4], ruleB: 'add 3', seqB: [0, 3, 6, 9, 12], prompt: 'Pattern A: 0,1,2,3,4 (add 1). Pattern B: 0,3,6,9,12 (add 3). Each term in B is ___ times the matching term in A.', answer: 3 },
      ],
    },
  },
  'grade-6': {
    'variable-as-unknown': {
      problems: [
        { prompt: 'I am thinking of a number. If I add 5, I get 12. What is the number?', equation: 'n + 5 = 12', answer: 7 },
        { prompt: 'A number times 3 is 18. What is the number?', equation: '3n = 18', answer: 6 },
        { prompt: 'I subtract 8 from a number and get 15. What is the number?', equation: 'n - 8 = 15', answer: 23 },
        { prompt: 'A number divided by 4 is 9. What is the number?', equation: 'n / 4 = 9', answer: 36 },
        { prompt: 'I double a number and add 3, getting 17. What is the number?', equation: '2n + 3 = 17', answer: 7 },
        { prompt: 'If I triple a number and subtract 5, I get 16. What is the number?', equation: '3n - 5 = 16', answer: 7 },
        { prompt: 'A number plus 12 equals 30. What is the number?', equation: 'n + 12 = 30', answer: 18 },
        { prompt: 'Half a number is 10. What is the number?', equation: 'n / 2 = 10', answer: 20 },
      ],
    },
    'variable-as-quantity': {
      problems: [
        { prompt: 'A movie ticket costs $8. If you buy t tickets, write the total cost.', answer: '8t', acceptedAnswers: ['8t', '8 x t', '8*t'] },
        { prompt: 'You earn $12 per hour. Write your earnings for h hours.', answer: '12h', acceptedAnswers: ['12h', '12 x h', '12*h'] },
        { prompt: 'A pizza has 8 slices. Write how many slices are in p pizzas.', answer: '8p', acceptedAnswers: ['8p', '8 x p', '8*p'] },
        { prompt: 'You have 50 stickers and give away s of them. Write how many you have left.', answer: '50 - s', acceptedAnswers: ['50 - s', '50-s'] },
        { prompt: 'A book costs d dollars. You buy 3 of them and pay $5 for shipping. Write the total cost.', answer: '3d + 5', acceptedAnswers: ['3d + 5', '3 x d + 5', '5 + 3d'] },
        { prompt: 'There are 24 hours in a day. Write how many hours are in d days.', answer: '24d', acceptedAnswers: ['24d', '24 x d', '24*d'] },
      ],
    },
    'write-algebraic': {
      problems: [
        { phrase: '5 more than x', answer: 'x + 5', prompt: 'Write an algebraic expression: 5 more than x' },
        { phrase: '3 times y minus 2', answer: '3y - 2', prompt: 'Write an algebraic expression: 3 times y minus 2', acceptedAnswers: ['3y - 2', '3 x y - 2', '3*y - 2'] },
        { phrase: 'x divided by 6', answer: 'x / 6', prompt: 'Write an algebraic expression: x divided by 6', acceptedAnswers: ['x / 6', 'x/6', 'x ÷ 6'] },
        { phrase: 'twice the sum of n and 4', answer: '2(n + 4)', prompt: 'Write an algebraic expression: twice the sum of n and 4', acceptedAnswers: ['2(n + 4)', '2 x (n + 4)', '2*(n + 4)', '2n + 8'] },
        { phrase: 'the product of 7 and m', answer: '7m', prompt: 'Write an algebraic expression: the product of 7 and m', acceptedAnswers: ['7m', '7 x m', '7*m', 'm x 7'] },
        { phrase: '10 decreased by twice a number', answer: '10 - 2n', prompt: 'Write an algebraic expression: 10 decreased by twice a number', acceptedAnswers: ['10 - 2n', '10 - 2x', '10 - 2 x n'] },
        { phrase: 'the quotient of y and 3, plus 8', answer: 'y/3 + 8', prompt: 'Write an algebraic expression: the quotient of y and 3, plus 8', acceptedAnswers: ['y/3 + 8', 'y / 3 + 8', 'y ÷ 3 + 8', '8 + y/3'] },
        { phrase: 'a number squared minus 1', answer: 'n^2 - 1', prompt: 'Write an algebraic expression: a number squared minus 1', acceptedAnswers: ['n^2 - 1', 'x^2 - 1', 'n² - 1', 'x² - 1'] },
      ],
    },
    'evaluate-algebraic': {
      problems: [
        { expression: '3x + 2', variable: 'x', value: 4, answer: 14, prompt: 'Evaluate 3x + 2 when x = 4' },
        { expression: '5n - 7', variable: 'n', value: 3, answer: 8, prompt: 'Evaluate 5n - 7 when n = 3' },
        { expression: '2(y + 3)', variable: 'y', value: 5, answer: 16, prompt: 'Evaluate 2(y + 3) when y = 5' },
        { expression: 'x^2 + 1', variable: 'x', value: 6, answer: 37, prompt: 'Evaluate x^2 + 1 when x = 6' },
        { expression: '(n + 4) / 2', variable: 'n', value: 8, answer: 6, prompt: 'Evaluate (n + 4) / 2 when n = 8' },
        { expression: '4m - 2m + 5', variable: 'm', value: 3, answer: 11, prompt: 'Evaluate 4m - 2m + 5 when m = 3' },
        { expression: '10 - 2x', variable: 'x', value: 3, answer: 4, prompt: 'Evaluate 10 - 2x when x = 3' },
        { expression: '(3a + 1) / 2', variable: 'a', value: 5, answer: 8, prompt: 'Evaluate (3a + 1) / 2 when a = 5' },
        { expression: 'x^2 - x', variable: 'x', value: 4, answer: 12, prompt: 'Evaluate x^2 - x when x = 4' },
        { expression: '2(n - 1) + 3', variable: 'n', value: 7, answer: 15, prompt: 'Evaluate 2(n - 1) + 3 when n = 7' },
      ],
    },
    'distributive-expand': {
      problems: [
        { expression: '2(x + 3)', answer: '2x + 6', prompt: 'Expand: 2(x + 3)' },
        { expression: '3(y - 4)', answer: '3y - 12', prompt: 'Expand: 3(y - 4)' },
        { expression: '5(a + 2)', answer: '5a + 10', prompt: 'Expand: 5(a + 2)' },
        { expression: '4(n - 1)', answer: '4n - 4', prompt: 'Expand: 4(n - 1)' },
        { expression: '6(x + 5)', answer: '6x + 30', prompt: 'Expand: 6(x + 5)' },
        { expression: '2(3m + 1)', answer: '6m + 2', prompt: 'Expand: 2(3m + 1)' },
        { expression: '3(2x - 5)', answer: '6x - 15', prompt: 'Expand: 3(2x - 5)' },
        { expression: '7(y + 1)', answer: '7y + 7', prompt: 'Expand: 7(y + 1)' },
      ],
    },
    'combine-like-terms': {
      problems: [
        { expression: '3x + 5x', answer: '8x', prompt: 'Simplify: 3x + 5x' },
        { expression: '7n - 2n', answer: '5n', prompt: 'Simplify: 7n - 2n' },
        { expression: '4a + 3 + 2a', answer: '6a + 3', prompt: 'Simplify: 4a + 3 + 2a' },
        { expression: '5y + 2 + 3y + 4', answer: '8y + 6', prompt: 'Simplify: 5y + 2 + 3y + 4' },
        { expression: '6m - m + 7', answer: '5m + 7', prompt: 'Simplify: 6m - m + 7' },
        { expression: '2x + 3x + x', answer: '6x', prompt: 'Simplify: 2x + 3x + x' },
        { expression: '10n - 4n + 2 - 1', answer: '6n + 1', prompt: 'Simplify: 10n - 4n + 2 - 1' },
        { expression: '3a + 5b + 2a + b', answer: '5a + 6b', prompt: 'Simplify: 3a + 5b + 2a + b' },
      ],
    },
    'solve-add-sub': {
      problems: [
        { equation: 'x + 5 = 12', answer: 7, prompt: 'Solve: x + 5 = 12' },
        { equation: 'n - 3 = 10', answer: 13, prompt: 'Solve: n - 3 = 10' },
        { equation: 'y + 8 = 20', answer: 12, prompt: 'Solve: y + 8 = 20' },
        { equation: 'a - 15 = 7', answer: 22, prompt: 'Solve: a - 15 = 7' },
        { equation: 'x + 24 = 50', answer: 26, prompt: 'Solve: x + 24 = 50' },
        { equation: 'm - 9 = 16', answer: 25, prompt: 'Solve: m - 9 = 16' },
        { equation: 'n + 17 = 30', answer: 13, prompt: 'Solve: n + 17 = 30' },
        { equation: 'y - 22 = 8', answer: 30, prompt: 'Solve: y - 22 = 8' },
        { equation: 'x + 6 = 6', answer: 0, prompt: 'Solve: x + 6 = 6' },
        { equation: 'a - 1 = 99', answer: 100, prompt: 'Solve: a - 1 = 99' },
      ],
    },
    'solve-mult-div': {
      problems: [
        { equation: '3x = 24', answer: 8, prompt: 'Solve: 3x = 24' },
        { equation: 'n / 4 = 7', answer: 28, prompt: 'Solve: n / 4 = 7' },
        { equation: '5y = 45', answer: 9, prompt: 'Solve: 5y = 45' },
        { equation: 'a / 6 = 8', answer: 48, prompt: 'Solve: a / 6 = 8' },
        { equation: '7m = 56', answer: 8, prompt: 'Solve: 7m = 56' },
        { equation: 'x / 3 = 12', answer: 36, prompt: 'Solve: x / 3 = 12' },
        { equation: '8n = 72', answer: 9, prompt: 'Solve: 8n = 72' },
        { equation: 'y / 5 = 10', answer: 50, prompt: 'Solve: y / 5 = 10' },
        { equation: '4x = 0', answer: 0, prompt: 'Solve: 4x = 0' },
        { equation: '9a = 81', answer: 9, prompt: 'Solve: 9a = 81' },
      ],
    },
    'inequality-meaning': {
      problems: [
        { prompt: 'Is 3 > 5 true or false?', answer: 'false' },
        { prompt: 'Is 8 < 12 true or false?', answer: 'true' },
        { prompt: 'If x > 4, could x be 4?', answer: 'no' },
        { prompt: 'If x >= 4, could x be 4?', answer: 'yes', acceptedAnswers: ['yes'] },
        { prompt: 'If y < 10, name a value y could be.', answer: 'any number less than 10', acceptedAnswers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-1'] },
        { prompt: 'Write an inequality: n is at least 5', answer: 'n >= 5', acceptedAnswers: ['n >= 5', 'n ≥ 5'] },
        { prompt: 'Write an inequality: x is less than 20', answer: 'x < 20' },
        { prompt: 'If n <= 7, what is the largest whole number n can be?', answer: 7 },
      ],
    },
    'inequality-on-number-line': {
      problems: [
        { inequality: 'x > 3', prompt: 'For x > 3, is the circle at 3 open or closed?', answer: 'open' },
        { inequality: 'x >= 5', prompt: 'For x >= 5, is the circle at 5 open or closed?', answer: 'closed' },
        { inequality: 'x < 7', prompt: 'For x < 7, does the arrow point left or right?', answer: 'left' },
        { inequality: 'x > 2', prompt: 'For x > 2, does the arrow point left or right?', answer: 'right' },
        { inequality: 'x <= 4', prompt: 'For x <= 4, is the circle at 4 open or closed?', answer: 'closed' },
        { inequality: 'x < 10', prompt: 'For x < 10, is the circle at 10 open or closed?', answer: 'open' },
        { inequality: 'x >= 0', prompt: 'For x >= 0, does the arrow point left or right?', answer: 'right' },
        { inequality: 'x <= 6', prompt: 'For x <= 6, does the arrow point left or right?', answer: 'left' },
      ],
    },
    'identify-variables': {
      problems: [
        { prompt: 'A plant grows 2 cm per day. Days = d, height = h. Which is independent?', answer: 'd', acceptedAnswers: ['d', 'days', 'day'] },
        { prompt: 'You earn $10 per hour. Hours = h, earnings = e. Which is dependent?', answer: 'e', acceptedAnswers: ['e', 'earnings'] },
        { prompt: 'A car uses 1 gallon per 30 miles. Miles = m, gallons = g. Which is independent?', answer: 'm', acceptedAnswers: ['m', 'miles'] },
        { prompt: 'Temperature rises 3 degrees per hour. Time = t, temp = T. Which depends on the other?', answer: 'T', acceptedAnswers: ['T', 'temp', 'temperature'] },
        { prompt: 'You read 20 pages per hour. Hours = h, pages = p. Which is independent?', answer: 'h', acceptedAnswers: ['h', 'hours'] },
        { prompt: 'A pool fills at 5 gallons per minute. Time = t, gallons = g. Which is dependent?', answer: 'g', acceptedAnswers: ['g', 'gallons'] },
      ],
    },
    'tables-and-graphs': {
      problems: [
        { rule: 'y = 2x', table: { x: [1,2,3,4], y: [2,4,6,null] }, prompt: 'For y = 2x, complete the table: x=4, y=___', answer: 8 },
        { rule: 'y = x + 3', table: { x: [1,2,3,4], y: [4,5,6,null] }, prompt: 'For y = x + 3, complete the table: x=4, y=___', answer: 7 },
        { rule: 'y = 3x - 1', table: { x: [1,2,3,4], y: [2,5,8,null] }, prompt: 'For y = 3x - 1, complete the table: x=4, y=___', answer: 11 },
        { rule: 'y = x/2', table: { x: [2,4,6,8], y: [1,2,3,null] }, prompt: 'For y = x/2, complete the table: x=8, y=___', answer: 4 },
        { rule: 'y = 5x + 2', table: { x: [1,2,3,4], y: [7,12,17,null] }, prompt: 'For y = 5x + 2, complete the table: x=4, y=___', answer: 22 },
        { rule: 'y = 4x', table: { x: [1,2,3,4], y: [4,8,12,null] }, prompt: 'For y = 4x, complete the table: x=4, y=___', answer: 16 },
      ],
    },
  },
};

const EXPLORATIONS = {
  'kindergarten': [
    { title: 'Pattern Hunt', focus: 'repeating patterns', prompt: 'Look around your room. Can you find 3 patterns? Describe each one. Is it an AB, ABB, or ABC pattern?' },
    { title: 'Pattern Builder', focus: 'create patterns', prompt: 'Use 2 colors to make an AB pattern with 8 items. Now use 3 colors to make an ABC pattern with 9 items.' },
  ],
  'grade-1': [
    { title: 'Hundred Chart Exploration', focus: 'skip counting', prompt: 'Count by 2s starting at 0. Color those numbers on a hundred chart. What shape do the colored numbers make?' },
    { title: 'Balance Challenge', focus: 'equal sign', prompt: 'Can you find 3 different ways to make both sides of the equal sign balance? Example: 5 + 3 = 4 + 4' },
  ],
  'grade-2': [
    { title: 'Even and Odd Detective', focus: 'even/odd', prompt: 'Add pairs of numbers. When do you get even answers? When do you get odd answers? Can you find the rule?' },
    { title: 'Groups of Things', focus: 'repeated addition', prompt: 'You have 4 bags with 3 apples each. How many apples? Write it as repeated addition AND as one number sentence.' },
  ],
  'grade-3': [
    { title: 'Multiplication Patterns', focus: 'times tables', prompt: 'Look at the 9s times table: 9, 18, 27, 36... What happens to the tens digit? What about the ones digit? What do the digits always add up to?' },
    { title: 'Break It Apart', focus: 'distributive property', prompt: 'Can you use the distributive property to solve 8 x 7? Break 7 into two easier numbers and show your work.' },
  ],
  'grade-4': [
    { title: 'Function Machine', focus: 'input/output', prompt: 'I put in 3 and get 11. I put in 5 and get 17. I put in 1 and get 5. What is my rule? Test it with a new number!' },
    { title: 'Growing Patterns', focus: 'number patterns', prompt: 'A pattern starts at 2 and each term is 3 more than the last. Write the first 8 terms. Are any terms even? Is there a pattern to which are even?' },
  ],
  'grade-5': [
    { title: 'Order Matters!', focus: 'order of operations', prompt: 'Calculate 3 + 4 x 2 and (3 + 4) x 2. Why are the answers different? Can you write a problem where parentheses change the answer?' },
    { title: 'Coordinate Art', focus: 'coordinate plane', prompt: 'Plot these points and connect them: (1,1), (3,5), (5,1). What shape did you make? Now create your own shape with at least 4 points.' },
  ],
  'grade-6': [
    { title: 'Equation Balance', focus: 'solving equations', prompt: 'Solve 2x + 5 = 17 using a balance scale model. Draw or describe each step. What do you do to both sides?' },
    { title: 'Variables Everywhere', focus: 'expressions', prompt: 'Write an algebraic expression for a real-life situation. Example: If pizza costs $12 and drinks cost $3 each, the total for d drinks is 12 + 3d. Create your own!' },
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

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 /+\-*^>=<.]/g, ''); }

// Exercise generation

function exResult(type, skill, grade, instruction, items) { return { type, skill, grade, count: items.length, instruction, items }; }

function generateExercise(grade, skill, count = 5) {
  const bank = PROBLEM_BANKS[grade]?.[skill];
  if (!bank) return { error: `No problem bank for ${grade}/${skill}` };

  // Kindergarten pattern types
  if (bank.patterns) {
    if (skill === 'identify-patterns')
      return exResult('identify-pattern', skill, grade, 'What type of pattern is this? (AB, ABB, ABC, AAB)',
        pick(bank.patterns, count).map(p => ({ prompt: `What type of pattern? ${p.sequence.join(', ')}`, sequence: p.sequence, answer: p.answer })));
    if (skill === 'extend-patterns')
      return exResult('extend-pattern', skill, grade, 'What comes next in the pattern?',
        pick(bank.patterns, count).map(p => ({ prompt: p.prompt, answer: p.answer })));
    if (skill === 'copy-patterns')
      return exResult('copy-pattern', skill, grade, 'Copy this pattern exactly.',
        pick(bank.patterns, count).map(p => ({ prompt: `Copy: ${p.given}`, answer: p.answer })));
  }

  if (bank.prompts && skill === 'create-patterns')
    return exResult('create-pattern', skill, grade, 'Create a pattern of the given type.',
      pick(bank.prompts, count).map(p => ({ prompt: p.prompt, type: p.type, example: p.example, answer: p.type })));

  if (bank.translations)
    return exResult('translate-pattern', skill, grade, 'Translate the pattern using different items.',
      pick(bank.translations, count).map(t => ({ prompt: `Pattern: ${t.from}. ${t.to}.`, type: t.type, example: t.example, answer: t.type })));

  // Sequence / skip counting types
  if (bank.sequences)
    return exResult('sequence', skill, grade, 'What number comes next in the pattern?',
      pick(bank.sequences, count).map(s => ({ prompt: s.prompt, answer: s.answer })));

  // Standard problems with prompt/answer
  if (bank.problems)
    return exResult('solve', skill, grade, 'Solve each problem.',
      pick(bank.problems, count).map(p => {
        const item = { prompt: p.prompt || p.equation, answer: p.answer };
        if (p.acceptedAnswers) item.acceptedAnswers = p.acceptedAnswers;
        if (p.rule) item.hint = p.rule;
        if (p.steps) item.steps = p.steps;
        if (p.expanded) item.expanded = p.expanded;
        if (p.equation) item.equation = p.equation;
        return item;
      }));

  // Input/output tables
  if (bank.tables) {
    if (skill === 'complete-table')
      return exResult('complete-table', skill, grade, 'Complete the missing values in the table.',
        pick(bank.tables, count).map(t => ({ prompt: t.prompt, rule: t.rule, missing: t.missing, answer: t.missing.join(', ') })));
    if (skill === 'find-the-rule')
      return exResult('find-rule', skill, grade, "What's the rule? Look at the input and output values.",
        pick(bank.tables, count).map(t => ({ prompt: t.prompt, input: t.input, output: t.output, answer: t.answer, acceptedAnswers: t.acceptedAnswers || [t.answer] })));
  }

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected))
    return expected.some(r => norm(r) === norm(answer));
  return norm(expected) === norm(answer);
}

// Public API

class PatternsAlgebra {
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

  getExploration(grade) {
    const texts = EXPLORATIONS[grade];
    if (!texts) return { error: `No explorations for ${grade}. Available: ${Object.keys(EXPLORATIONS).join(', ')}` };
    return pick(texts, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const exploration = EXPLORATIONS[grade] ? pick(EXPLORATIONS[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, exploration,
      lessonPlan: {
        warmup: 'Quick pattern or review problem from recent work (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        explore: exploration ? `Investigation: "${exploration.title}"` : 'Extend with a challenge question',
        generalize: `Describe the rule or pattern in your own words`,
      },
    };
  }
}

module.exports = PatternsAlgebra;

// CLI: node patterns-algebra.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const pa = new PatternsAlgebra();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) pa.setGrade(id, grade);
        out({ action: 'start', profile: pa.getProfile(id), nextSkills: pa.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(pa.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, type] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'kindergarten';
        if (type) { out(pa.generateExercise(grade, type, 5)); }
        else { const n = pa.getNextSkills(id, 1).next; out(n.length ? pa.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current grade!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(pa.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(pa.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(pa.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(pa.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(pa.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? pa.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(pa.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(pa.setGrade(id, g)); break; }
      case 'explore': { const [, g] = args; if (!g) throw new Error('Usage: explore <grade>'); out(pa.getExploration(g)); break; }
      default: out({ usage: 'node patterns-algebra.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','explore'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
