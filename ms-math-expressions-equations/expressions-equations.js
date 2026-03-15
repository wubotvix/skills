// eClaw MS Math Expressions & Equations Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-math-expressions-equations');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'expressions': ['writing-expressions', 'evaluating-expressions', 'equivalent-expressions'],
    'properties': ['commutative-associative', 'distributive-property'],
    'equations': ['one-step-addition', 'one-step-multiplication'],
    'inequalities': ['writing-inequalities', 'graphing-inequalities'],
    'variables': ['dependent-independent'],
  },
  'grade-7': {
    'simplifying': ['combining-like-terms', 'distributive-with-rationals'],
    'rewriting': ['equivalent-forms'],
    'equations': ['two-step-equations', 'equations-from-context'],
    'inequalities': ['two-step-inequalities'],
  },
  'grade-8': {
    'exponents': ['product-rule', 'quotient-rule', 'power-rule', 'zero-negative-exponents'],
    'roots': ['square-roots', 'cube-roots'],
    'linear-equations': ['slope-intercept', 'multi-step-linear', 'variables-both-sides', 'special-cases'],
    'systems': ['systems-graphing', 'systems-substitution', 'systems-elimination'],
  },
};

const PROBLEM_BANKS = {
  'grade-6': {
    'writing-expressions': {
      problems: [
        { prompt: 'Write an expression: "five more than a number n"', answer: 'n + 5' },
        { prompt: 'Write an expression: "three times a number x"', answer: '3x' },
        { prompt: 'Write an expression: "a number y decreased by 7"', answer: 'y - 7' },
        { prompt: 'Write an expression: "a number divided by 4"', answer: 'n/4' },
        { prompt: 'Write an expression: "twice a number plus 9"', answer: '2n + 9' },
        { prompt: 'Write an expression: "10 less than 4 times a number"', answer: '4n - 10' },
        { prompt: 'Write an expression: "the sum of a number and 12"', answer: 'n + 12' },
        { prompt: 'Write an expression: "half of a number minus 3"', answer: 'n/2 - 3' },
      ],
    },
    'evaluating-expressions': {
      problems: [
        { prompt: 'Evaluate 3a + 2 when a = 4', answer: '14', numeric: 14 },
        { prompt: 'Evaluate 5x - 7 when x = 3', answer: '8', numeric: 8 },
        { prompt: 'Evaluate 2(n + 6) when n = 5', answer: '22', numeric: 22 },
        { prompt: 'Evaluate x² + 3 when x = 4', answer: '19', numeric: 19 },
        { prompt: 'Evaluate 10 - 2y when y = 3', answer: '4', numeric: 4 },
        { prompt: 'Evaluate 4a + b when a = 3, b = 5', answer: '17', numeric: 17 },
        { prompt: 'Evaluate (m + n)/2 when m = 8, n = 12', answer: '10', numeric: 10 },
        { prompt: 'Evaluate 3 + 2(4 - 1)² [order of operations]', answer: '21', numeric: 21 },
      ],
    },
    'equivalent-expressions': {
      problems: [
        { prompt: 'Are 2(x + 3) and 2x + 6 equivalent?', answer: 'yes' },
        { prompt: 'Are 3x + 5 and 5 + 3x equivalent?', answer: 'yes', hint: 'Commutative property' },
        { prompt: 'Simplify: 4x + 3x', answer: '7x' },
        { prompt: 'Simplify: 5a + 2 + 3a - 1', answer: '8a + 1' },
        { prompt: 'Are 2(x + 4) and 2x + 4 equivalent?', answer: 'no', hint: '2(x+4) = 2x + 8' },
        { prompt: 'Simplify: 6y - 2y + 3', answer: '4y + 3' },
      ],
    },
    'commutative-associative': {
      problems: [
        { prompt: 'Name the property: a + b = b + a', answer: 'commutative' },
        { prompt: 'Name the property: (2 × 3) × 4 = 2 × (3 × 4)', answer: 'associative' },
        { prompt: 'Rewrite using commutative property: 7 + x', answer: 'x + 7' },
        { prompt: 'Name the property: (a + b) + c = a + (b + c)', answer: 'associative' },
        { prompt: 'Is subtraction commutative? 5 - 3 vs 3 - 5', answer: 'no' },
        { prompt: 'Name the property: xy = yx', answer: 'commutative' },
      ],
    },
    'distributive-property': {
      problems: [
        { prompt: 'Expand: 3(x + 4)', answer: '3x + 12' },
        { prompt: 'Expand: 5(2a - 3)', answer: '10a - 15' },
        { prompt: 'Expand: 2(3x + 7)', answer: '6x + 14' },
        { prompt: 'Factor: 12x + 8 using GCF', answer: '4(3x + 2)' },
        { prompt: 'Expand: 4(y + 2) + 3', answer: '4y + 11', hint: '4y + 8 + 3 = 4y + 11' },
        { prompt: 'Expand: 7(n - 1)', answer: '7n - 7' },
      ],
    },
    'one-step-addition': {
      problems: [
        { prompt: 'Solve: x + 5 = 12', answer: '7', numeric: 7 },
        { prompt: 'Solve: n + 8 = 15', answer: '7', numeric: 7 },
        { prompt: 'Solve: y - 3 = 10', answer: '13', numeric: 13 },
        { prompt: 'Solve: a + 12 = 20', answer: '8', numeric: 8 },
        { prompt: 'Solve: m - 7 = 4', answer: '11', numeric: 11 },
        { prompt: 'Solve: x + 2.5 = 6', answer: '3.5', numeric: 3.5 },
        { prompt: 'Solve: p - 15 = 0', answer: '15', numeric: 15 },
        { prompt: 'Solve: w + 1/4 = 3/4', answer: '1/2', hint: '3/4 - 1/4 = 2/4 = 1/2' },
      ],
    },
    'one-step-multiplication': {
      problems: [
        { prompt: 'Solve: 3x = 15', answer: '5', numeric: 5 },
        { prompt: 'Solve: 7n = 42', answer: '6', numeric: 6 },
        { prompt: 'Solve: x/4 = 8', answer: '32', numeric: 32 },
        { prompt: 'Solve: 5a = 35', answer: '7', numeric: 7 },
        { prompt: 'Solve: m/6 = 3', answer: '18', numeric: 18 },
        { prompt: 'Solve: 2.5x = 10', answer: '4', numeric: 4 },
        { prompt: 'Solve: 9y = 0', answer: '0', numeric: 0 },
        { prompt: 'Solve: n/3 = 7', answer: '21', numeric: 21 },
      ],
    },
    'writing-inequalities': {
      problems: [
        { prompt: '"A number is greater than 5." Write the inequality.', answer: 'x > 5' },
        { prompt: '"A number is at most 10." Write the inequality.', answer: 'x ≤ 10' },
        { prompt: '"Temperature is below 32°F." Write the inequality.', answer: 't < 32' },
        { prompt: '"You must be at least 13 to sign up." Write the inequality.', answer: 'a ≥ 13' },
        { prompt: '"Speed cannot exceed 65 mph." Write the inequality.', answer: 's ≤ 65' },
        { prompt: '"A number is no less than -3." Write the inequality.', answer: 'x ≥ -3' },
      ],
    },
    'graphing-inequalities': {
      problems: [
        { prompt: 'x > 3: open or closed circle at 3? Shade which direction?', answer: 'open circle, shade right' },
        { prompt: 'x ≤ -1: open or closed circle at -1? Shade which direction?', answer: 'closed circle, shade left' },
        { prompt: 'x ≥ 0: describe the graph', answer: 'closed circle at 0, shade right' },
        { prompt: 'x < 5: describe the graph', answer: 'open circle at 5, shade left' },
        { prompt: 'Which inequality shows an open circle at 2, shading right?', answer: 'x > 2' },
        { prompt: 'Which inequality shows a closed circle at -4, shading left?', answer: 'x ≤ -4' },
      ],
    },
    'dependent-independent': {
      problems: [
        { prompt: 'Hours worked (h) and money earned (m = 10h). Which is independent?', answer: 'hours worked', hint: 'You choose how many hours; money depends on it' },
        { prompt: 'Age and height. Which is independent?', answer: 'age' },
        { prompt: 'Number of items and total cost. Which is dependent?', answer: 'total cost' },
        { prompt: 'Temperature and time of day. Which is independent?', answer: 'time of day' },
        { prompt: 'Study hours and test score. Which is dependent?', answer: 'test score' },
        { prompt: 'Distance = 5 × time. Which variable goes on the x-axis?', answer: 'time', hint: 'Independent variable on x-axis' },
      ],
    },
  },
  'grade-7': {
    'combining-like-terms': {
      problems: [
        { prompt: 'Simplify: 4x + 3 + 2x - 1', answer: '6x + 2' },
        { prompt: 'Simplify: 7a - 2a + 5 - 3', answer: '5a + 2' },
        { prompt: 'Simplify: 3y + 4 + y + 6', answer: '4y + 10' },
        { prompt: 'Simplify: 8m - 3m - 2 + 7', answer: '5m + 5' },
        { prompt: 'Simplify: -2x + 5 + 6x - 3', answer: '4x + 2' },
        { prompt: 'Simplify: 3.5n + 2.5n - 4', answer: '6n - 4' },
        { prompt: 'Simplify: 1/2 x + 3/2 x + 4', answer: '2x + 4' },
        { prompt: 'Simplify: -a + 3 + 4a - 7', answer: '3a - 4' },
      ],
    },
    'distributive-with-rationals': {
      problems: [
        { prompt: 'Expand: -2(3x - 4)', answer: '-6x + 8' },
        { prompt: 'Expand: 1/2(6x + 10)', answer: '3x + 5' },
        { prompt: 'Expand: -3(2a + 5)', answer: '-6a - 15' },
        { prompt: 'Expand and simplify: 2(x + 3) + 3(x - 1)', answer: '5x + 3', hint: '2x+6+3x-3' },
        { prompt: 'Expand: -(x - 7)', answer: '-x + 7' },
        { prompt: 'Expand: 0.5(8y - 6)', answer: '4y - 3' },
        { prompt: 'Expand: -4(1/2 n + 3)', answer: '-2n - 12' },
        { prompt: 'Expand and simplify: 3(2x - 1) - 2(x + 4)', answer: '4x - 11', hint: '6x-3-2x-8' },
      ],
    },
    'equivalent-forms': {
      problems: [
        { prompt: 'Rewrite 2(x + 3) - 4 in simplest form', answer: '2x + 2' },
        { prompt: 'Factor: 6x + 9', answer: '3(2x + 3)' },
        { prompt: 'Are 3(x - 2) + 6 and 3x equivalent?', answer: 'yes', hint: '3x-6+6=3x' },
        { prompt: 'Rewrite: 4(a + 1) + 2(a - 3) in simplest form', answer: '6a - 2' },
        { prompt: 'Factor: 10y - 15', answer: '5(2y - 3)' },
        { prompt: 'Rewrite: 5x + 10 as a product', answer: '5(x + 2)' },
      ],
    },
    'two-step-equations': {
      problems: [
        { prompt: 'Solve: 2x + 3 = 11', answer: '4', numeric: 4 },
        { prompt: 'Solve: 4x - 7 = 13', answer: '5', numeric: 5 },
        { prompt: 'Solve: 3n + 5 = 20', answer: '5', numeric: 5 },
        { prompt: 'Solve: -2x + 8 = 2', answer: '3', numeric: 3 },
        { prompt: 'Solve: x/3 + 4 = 10', answer: '18', numeric: 18 },
        { prompt: 'Solve: 5y - 1 = 24', answer: '5', numeric: 5 },
        { prompt: 'Solve: -3a + 12 = 0', answer: '4', numeric: 4 },
        { prompt: 'Solve: 7 + 2m = 19', answer: '6', numeric: 6 },
      ],
    },
    'equations-from-context': {
      problems: [
        { prompt: 'Maria has $5 more than twice what Joe has. Maria has $23. Write and solve for Joe.', answer: '9', numeric: 9, hint: '2x + 5 = 23 → x = 9' },
        { prompt: 'A taxi charges $3 base + $2/mile. Total was $17. How many miles?', answer: '7', numeric: 7, hint: '3 + 2m = 17' },
        { prompt: 'Three friends split a bill equally plus $4 tip each. Each pays $15. What was the total bill?', answer: '33', numeric: 33, hint: 'b/3 + 4 = 15 → b = 33' },
        { prompt: 'You have $50. Shirts cost $12 each, plus $8 for a hat. How many shirts can you buy?', answer: '3', numeric: 3, hint: '12s + 8 ≤ 50 → s ≤ 3.5' },
        { prompt: 'Perimeter of a rectangle is 30. Width is 5. Find the length.', answer: '10', numeric: 10, hint: '2L + 2(5) = 30' },
        { prompt: 'Tom is 4 years older than twice Ann\'s age. Tom is 18. How old is Ann?', answer: '7', numeric: 7 },
      ],
    },
    'two-step-inequalities': {
      problems: [
        { prompt: 'Solve: 2x + 3 > 11', answer: 'x > 4' },
        { prompt: 'Solve: 3n - 5 ≤ 10', answer: 'n ≤ 5' },
        { prompt: 'Solve: -4x + 8 > 0', answer: 'x < 2', hint: 'Divide by -4, flip the sign!' },
        { prompt: 'Solve: 5a - 2 ≥ 13', answer: 'a ≥ 3' },
        { prompt: 'Solve: -2y + 6 < 12', answer: 'y > -3', hint: 'Flip when dividing by negative' },
        { prompt: 'Solve: x/2 + 1 > 5', answer: 'x > 8' },
        { prompt: 'Solve: -3m - 6 ≤ 9', answer: 'm ≥ -5' },
        { prompt: 'Solve: 7 - x > 3', answer: 'x < 4' },
      ],
    },
  },
  'grade-8': {
    'product-rule': {
      problems: [
        { prompt: 'Simplify: x³ × x⁴', answer: 'x^7' },
        { prompt: 'Simplify: 2³ × 2⁵', answer: '2^8', hint: 'Add exponents: 3+5=8' },
        { prompt: 'Simplify: a² × a × a⁵', answer: 'a^8' },
        { prompt: 'Simplify: 5² × 5⁴', answer: '5^6' },
        { prompt: 'Simplify: (3x²)(4x³)', answer: '12x^5' },
        { prompt: 'Simplify: (-2y³)(3y²)', answer: '-6y^5' },
      ],
    },
    'quotient-rule': {
      problems: [
        { prompt: 'Simplify: x⁷ ÷ x³', answer: 'x^4' },
        { prompt: 'Simplify: 10⁶ ÷ 10²', answer: '10^4' },
        { prompt: 'Simplify: a⁵ / a', answer: 'a^4' },
        { prompt: 'Simplify: 8x⁶ / 2x²', answer: '4x^4' },
        { prompt: 'Simplify: 12y⁸ / 4y³', answer: '3y^5' },
        { prompt: 'Simplify: n⁹ / n⁹', answer: '1', hint: 'n^0 = 1' },
      ],
    },
    'power-rule': {
      problems: [
        { prompt: 'Simplify: (x³)²', answer: 'x^6' },
        { prompt: 'Simplify: (2⁴)³', answer: '2^12' },
        { prompt: 'Simplify: (a²b³)⁴', answer: 'a^8 b^12' },
        { prompt: 'Simplify: (3x²)³', answer: '27x^6' },
        { prompt: 'Simplify: (y⁵)²', answer: 'y^10' },
        { prompt: 'Simplify: (2²)⁵', answer: '2^10' },
      ],
    },
    'zero-negative-exponents': {
      problems: [
        { prompt: 'Evaluate: 5⁰', answer: '1', numeric: 1 },
        { prompt: 'Evaluate: 2⁻³', answer: '1/8', hint: '1/2³ = 1/8' },
        { prompt: 'Simplify: x⁻²', answer: '1/x^2' },
        { prompt: 'Evaluate: 10⁻²', answer: '0.01', numeric: 0.01 },
        { prompt: 'Evaluate: (-3)⁰', answer: '1', numeric: 1 },
        { prompt: 'Simplify: 4⁻¹', answer: '1/4' },
        { prompt: 'Evaluate: 3⁻² × 3⁴', answer: '9', numeric: 9, hint: '3^(-2+4) = 3² = 9' },
        { prompt: 'Simplify: (2x)⁰', answer: '1', numeric: 1 },
      ],
    },
    'square-roots': {
      problems: [
        { prompt: 'Evaluate: √144', answer: '12', numeric: 12 },
        { prompt: 'Evaluate: √81', answer: '9', numeric: 9 },
        { prompt: 'Evaluate: √(1/4)', answer: '1/2' },
        { prompt: 'Solve: x² = 49', answer: '±7' },
        { prompt: 'Evaluate: √196', answer: '14', numeric: 14 },
        { prompt: 'Solve: x² = 100', answer: '±10' },
        { prompt: 'Evaluate: √(9/16)', answer: '3/4' },
        { prompt: 'Evaluate: √225', answer: '15', numeric: 15 },
      ],
    },
    'cube-roots': {
      problems: [
        { prompt: 'Evaluate: ∛8', answer: '2', numeric: 2 },
        { prompt: 'Evaluate: ∛27', answer: '3', numeric: 3 },
        { prompt: 'Evaluate: ∛125', answer: '5', numeric: 5 },
        { prompt: 'Evaluate: ∛(-64)', answer: '-4', numeric: -4 },
        { prompt: 'Evaluate: ∛1000', answer: '10', numeric: 10 },
        { prompt: 'Solve: x³ = 216', answer: '6', numeric: 6 },
      ],
    },
    'slope-intercept': {
      problems: [
        { prompt: 'Identify slope and y-intercept: y = 3x + 7', answer: 'slope=3, y-intercept=7' },
        { prompt: 'Identify slope and y-intercept: y = -2x + 1', answer: 'slope=-2, y-intercept=1' },
        { prompt: 'Write in slope-intercept form: 2x + y = 8', answer: 'y = -2x + 8' },
        { prompt: 'Write in slope-intercept form: 3x - y = 6', answer: 'y = 3x - 6' },
        { prompt: 'A line has slope 4 and passes through (0, -3). Write the equation.', answer: 'y = 4x - 3' },
        { prompt: 'Identify slope and y-intercept: y = -x + 5', answer: 'slope=-1, y-intercept=5' },
      ],
    },
    'multi-step-linear': {
      problems: [
        { prompt: 'Solve: 3(x + 2) = 21', answer: '5', numeric: 5 },
        { prompt: 'Solve: 2(3x - 4) + 6 = 16', answer: '3', numeric: 3, hint: '6x-8+6=16 → 6x=18' },
        { prompt: 'Solve: 4(x - 1) - 2x = 10', answer: '7', numeric: 7, hint: '4x-4-2x=10 → 2x=14' },
        { prompt: 'Solve: 5(2n + 1) = 35', answer: '3', numeric: 3 },
        { prompt: 'Solve: -2(x + 3) + 4 = -8', answer: '3', numeric: 3 },
        { prompt: 'Solve: 3(4 - x) = 6', answer: '2', numeric: 2 },
      ],
    },
    'variables-both-sides': {
      problems: [
        { prompt: 'Solve: 5x + 2 = 3x + 10', answer: '4', numeric: 4 },
        { prompt: 'Solve: 7a - 3 = 4a + 9', answer: '4', numeric: 4 },
        { prompt: 'Solve: 2(x + 1) = x + 5', answer: '3', numeric: 3 },
        { prompt: 'Solve: 6n - 8 = 2n + 12', answer: '5', numeric: 5 },
        { prompt: 'Solve: 3(2x - 1) = 4x + 7', answer: '5', numeric: 5, hint: '6x-3=4x+7 → 2x=10' },
        { prompt: 'Solve: 9 - 2y = 3y - 1', answer: '2', numeric: 2 },
      ],
    },
    'special-cases': {
      problems: [
        { prompt: 'Solve: 2x + 1 = 2x + 5. How many solutions?', answer: 'no solution', hint: '1 = 5 is false' },
        { prompt: 'Solve: 3(x + 2) = 3x + 6. How many solutions?', answer: 'infinitely many', hint: '3x+6=3x+6 is always true' },
        { prompt: 'Solve: 4x - 4 = 4(x - 1). How many solutions?', answer: 'infinitely many' },
        { prompt: 'Solve: 5x + 3 = 5x - 2. How many solutions?', answer: 'no solution' },
        { prompt: 'Solve: 2(x + 4) = 2x + 8. How many solutions?', answer: 'infinitely many' },
        { prompt: 'Solve: x + 7 = x + 7. How many solutions?', answer: 'infinitely many' },
      ],
    },
    'systems-graphing': {
      problems: [
        { prompt: 'Solve by graphing: y = x + 1 and y = -x + 5. Where do they intersect?', answer: '(2, 3)', hint: 'x+1=-x+5 → 2x=4 → x=2, y=3' },
        { prompt: 'Solve: y = 2x and y = x + 3. Intersection?', answer: '(3, 6)' },
        { prompt: 'Solve: y = -x + 4 and y = x - 2. Intersection?', answer: '(3, 1)' },
        { prompt: 'Do y = 2x + 1 and y = 2x + 5 intersect?', answer: 'no', hint: 'Parallel lines, same slope' },
        { prompt: 'Solve: y = 3x - 1 and y = -2x + 9. Intersection?', answer: '(2, 5)' },
        { prompt: 'Solve: y = x and y = -x + 6. Intersection?', answer: '(3, 3)' },
      ],
    },
    'systems-substitution': {
      problems: [
        { prompt: 'Solve: y = 2x + 1, 3x + y = 16', answer: '(3, 7)', hint: '3x + 2x + 1 = 16 → 5x = 15' },
        { prompt: 'Solve: x = 4y, 2x + 3y = 22', answer: '(8, 2)', hint: '2(4y)+3y=22 → 11y=22' },
        { prompt: 'Solve: y = x - 3, 2x + y = 12', answer: '(5, 2)' },
        { prompt: 'Solve: y = 3x, x + y = 8', answer: '(2, 6)' },
        { prompt: 'Solve: x = 2y + 1, 3x - y = 13', answer: '(5, 2)' },
        { prompt: 'Solve: y = -x + 5, 2x + y = 7', answer: '(2, 3)' },
      ],
    },
    'systems-elimination': {
      problems: [
        { prompt: 'Solve: x + y = 10, x - y = 4', answer: '(7, 3)', hint: 'Add equations: 2x=14' },
        { prompt: 'Solve: 2x + y = 13, x - y = 2', answer: '(5, 3)', hint: 'Add: 3x=15' },
        { prompt: 'Solve: 3x + 2y = 16, x + 2y = 8', answer: '(4, 2)', hint: 'Subtract: 2x=8' },
        { prompt: 'Solve: 2x + 3y = 12, 4x - 3y = 6', answer: '(3, 2)', hint: 'Add: 6x=18' },
        { prompt: 'Solve: x + 3y = 7, 2x + y = 9', answer: '(4, 1)' },
        { prompt: 'Solve: 5x + y = 17, 3x + y = 11', answer: '(3, 2)', hint: 'Subtract: 2x=6' },
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

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9./=^×≤≥<>+() -]/g, '').replace(/\s+/g, ' '); }

function generateExercise(grade, skill, count = 5) {
  const bank = PROBLEM_BANKS[grade]?.[skill];
  if (!bank) return { error: `No problem bank for ${grade}/${skill}` };
  const items = pick(bank.problems, count).map(p => ({
    prompt: p.prompt, answer: p.answer, ...(p.hint && { hint: p.hint }),
  }));
  return { type: 'expressions-equations', skill, grade, count: items.length, instruction: 'Solve each problem. Show your work.', items };
}

function checkAnswer(type, expected, answer) {
  const ne = norm(expected); const na = norm(answer);
  if (ne === na) return true;
  const numE = parseFloat(expected); const numA = parseFloat(answer);
  if (!isNaN(numE) && !isNaN(numA) && Math.abs(numE - numA) < 0.01) return true;
  if (ne.replace(/\s/g, '') === na.replace(/\s/g, '')) return true;
  return false;
}

class ExpressionsEquations {
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
    const p = loadProfile(id); const grade = p.grade || 'grade-6'; const gs = SKILLS[grade] || {};
    const results = {}; let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(gs)) {
      results[cat] = {};
      for (const sk of skills) { total++; const d = p.skills[`${grade}/${cat}/${sk}`]; results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' }; if (d && d.mastery >= MASTERY_THRESHOLD) mastered++; }
    }
    return { studentId: id, grade, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id); const grade = p.grade || 'grade-6'; const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS[grade] || {})) {
      for (const sk of skills) { const d = p.skills[`${grade}/${cat}/${sk}`]; const m = d ? d.mastery : 0; if (m < MASTERY_THRESHOLD) candidates.push({ grade, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' }); }
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, grade, next: candidates.slice(0, count) };
  }

  getReport(id) { const p = loadProfile(id); return { studentId: id, grade: p.grade, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }
  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }

  getSkillCatalog(grade) {
    const gs = SKILLS[grade]; if (!gs) return { grade, error: `Unknown grade. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0; const catalog = {};
    for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; }
    return { grade, skills: catalog, totalSkills: total };
  }

  generateExercise(grade, skill, count = 5) { return generateExercise(grade, skill, count); }
  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  generateLesson(id) {
    const p = loadProfile(id); const grade = p.grade || 'grade-6';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient!`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    return { studentId: id, grade, targetSkill: target, exercise, lessonPlan: { review: 'Review prerequisite algebra concepts (2-3 min)', teach: `Introduce/reinforce: ${target.category} → ${target.skill}`, practice: `Complete ${exercise.count || 0} practice items`, apply: 'Apply concept using the balance model' } };
  }
}

module.exports = ExpressionsEquations;

if (require.main === module) {
  const args = process.argv.slice(2); const cmd = args[0]; const api = new ExpressionsEquations();
  const out = d => console.log(JSON.stringify(d, null, 2));
  try {
    switch (cmd) {
      case 'start': { const [, id, grade] = args; if (!id) throw new Error('Usage: start <id> [grade]'); if (grade) api.setGrade(id, grade); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const grade = loadProfile(id).grade || 'grade-6'; if (skill) { out(api.generateExercise(grade, skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); out(api.checkAnswer(type, expected, answer)); break; }
      case 'record': { const [, id, grade, cat, skill, sc, tot, ...notes] = args; if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]'); out(api.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? api.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(api.setGrade(id, g)); break; }
      default: out({ usage: 'node expressions-equations.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
