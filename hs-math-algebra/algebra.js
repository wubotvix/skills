// eClaw HS Math Algebra Interactive Tutor (Grades 9-11). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-math-algebra');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'algebra-1': {
    'foundations': ['order-of-operations', 'real-number-properties', 'evaluating-expressions'],
    'linear-equations': ['one-variable', 'literal-equations', 'proportions'],
    'linear-inequalities': ['one-variable-ineq', 'compound-inequalities', 'absolute-value-ineq'],
    'linear-functions': ['slope', 'slope-intercept', 'point-slope', 'standard-form'],
    'systems': ['graphing-systems', 'substitution', 'elimination'],
    'exponents-polynomials': ['exponent-rules', 'polynomial-operations', 'factoring-gcf'],
    'quadratics-intro': ['factoring-trinomials', 'quadratic-formula', 'graphing-parabolas'],
  },
  'algebra-2': {
    'polynomial-functions': ['polynomial-division', 'factor-theorem', 'zeros-of-polynomials'],
    'quadratics-deep': ['completing-the-square', 'discriminant', 'complex-solutions'],
    'rational-expressions': ['simplifying-rational', 'rational-equations', 'rational-operations'],
    'radical-expressions': ['simplifying-radicals', 'radical-equations', 'rational-exponents'],
    'exponential-functions': ['growth-decay', 'compound-interest', 'exponential-equations'],
    'logarithmic-functions': ['log-properties', 'log-equations', 'change-of-base'],
    'sequences-series': ['arithmetic-sequences', 'geometric-sequences', 'sigma-notation'],
  },
};

const PROBLEM_BANKS = {
  'algebra-1': {
    'order-of-operations': {
      problems: [
        { prompt: 'Evaluate: 3 + 4 * 2', answer: '11', solution: '3 + 8 = 11' },
        { prompt: 'Evaluate: (5 + 3) * 2 - 4', answer: '12', solution: '8 * 2 - 4 = 16 - 4 = 12' },
        { prompt: 'Evaluate: 2^3 + 5 * 2 - 1', answer: '17', solution: '8 + 10 - 1 = 17' },
        { prompt: 'Evaluate: 24 / (8 - 2) + 1', answer: '5', solution: '24 / 6 + 1 = 4 + 1 = 5' },
        { prompt: 'Evaluate: 5 * (3 + 2^2) - 10', answer: '25', solution: '5 * (3 + 4) - 10 = 5 * 7 - 10 = 35 - 10 = 25' },
        { prompt: 'Evaluate: 18 - 3 * 4 + 2', answer: '8', solution: '18 - 12 + 2 = 8' },
        { prompt: 'Evaluate: (12 + 8) / 4 - 3', answer: '2', solution: '20 / 4 - 3 = 5 - 3 = 2' },
        { prompt: 'Evaluate: 6 + 2 * (5 - 1)^2', answer: '38', solution: '6 + 2 * 16 = 6 + 32 = 38' },
      ],
    },
    'real-number-properties': {
      problems: [
        { prompt: 'Which property? 3 + 5 = 5 + 3', answer: 'commutative', solution: 'Commutative property of addition: a + b = b + a' },
        { prompt: 'Which property? 4 * (2 + 3) = 4*2 + 4*3', answer: 'distributive', solution: 'Distributive property: a(b + c) = ab + ac' },
        { prompt: 'Which property? (2 + 3) + 4 = 2 + (3 + 4)', answer: 'associative', solution: 'Associative property of addition' },
        { prompt: 'Which property? 7 * 1 = 7', answer: 'identity', solution: 'Multiplicative identity: a * 1 = a' },
        { prompt: 'Which property? 5 + 0 = 5', answer: 'identity', solution: 'Additive identity: a + 0 = a' },
        { prompt: 'Which property? 6 + (-6) = 0', answer: 'inverse', solution: 'Additive inverse: a + (-a) = 0' },
        { prompt: 'Which property? 3 * 5 = 5 * 3', answer: 'commutative', solution: 'Commutative property of multiplication' },
        { prompt: 'Simplify using distributive: 3(x + 4)', answer: '3x + 12', solution: '3 * x + 3 * 4 = 3x + 12' },
      ],
    },
    'evaluating-expressions': {
      problems: [
        { prompt: 'Evaluate 2x + 3 when x = 5', answer: '13', solution: '2(5) + 3 = 10 + 3 = 13' },
        { prompt: 'Evaluate x^2 - 4x + 1 when x = 3', answer: '-2', solution: '9 - 12 + 1 = -2' },
        { prompt: 'Evaluate 3a - 2b when a = 4, b = 5', answer: '2', solution: '12 - 10 = 2' },
        { prompt: 'Evaluate |x - 7| when x = 3', answer: '4', solution: '|3 - 7| = |-4| = 4' },
        { prompt: 'Evaluate (x + y)^2 when x = 2, y = 3', answer: '25', solution: '(2 + 3)^2 = 5^2 = 25' },
        { prompt: 'Evaluate -x^2 + 6x when x = 4', answer: '8', solution: '-16 + 24 = 8' },
        { prompt: 'Evaluate 5x/(x+1) when x = 4', answer: '4', solution: '20/5 = 4' },
        { prompt: 'Evaluate sqrt(x^2 + 9) when x = 4', answer: '5', solution: 'sqrt(16 + 9) = sqrt(25) = 5' },
      ],
    },
    'one-variable': {
      problems: [
        { prompt: 'Solve: 2x + 5 = 11', answer: '3', solution: '2x = 6, x = 3' },
        { prompt: 'Solve: 3x - 7 = 14', answer: '7', solution: '3x = 21, x = 7' },
        { prompt: 'Solve: 5(x - 2) = 15', answer: '5', solution: '5x - 10 = 15, 5x = 25, x = 5' },
        { prompt: 'Solve: 4x + 3 = 2x + 9', answer: '3', solution: '2x = 6, x = 3' },
        { prompt: 'Solve: 3(2x + 1) = 4x + 7', answer: '2', solution: '6x + 3 = 4x + 7, 2x = 4, x = 2' },
        { prompt: 'Solve: (x + 5)/3 = 4', answer: '7', solution: 'x + 5 = 12, x = 7' },
        { prompt: 'Solve: -2x + 8 = 3x - 7', answer: '3', solution: '-5x = -15, x = 3' },
        { prompt: 'Solve: 7 - 3(x - 1) = 1', answer: '3', solution: '7 - 3x + 3 = 1, 10 - 3x = 1, 3x = 9, x = 3' },
      ],
    },
    'literal-equations': {
      problems: [
        { prompt: 'Solve for x: ax + b = c', answer: 'x = (c - b)/a', solution: 'ax = c - b, x = (c - b)/a' },
        { prompt: 'Solve for h: A = (1/2)bh', answer: 'h = 2A/b', solution: '2A = bh, h = 2A/b' },
        { prompt: 'Solve for r: C = 2*pi*r', answer: 'r = C/(2*pi)', solution: 'r = C/(2*pi)' },
        { prompt: 'Solve for t: d = rt', answer: 't = d/r', solution: 't = d/r' },
        { prompt: 'Solve for w: P = 2l + 2w', answer: 'w = (P - 2l)/2', solution: '2w = P - 2l, w = (P - 2l)/2' },
        { prompt: 'Solve for b: A = (a + b)/2', answer: 'b = 2A - a', solution: '2A = a + b, b = 2A - a' },
      ],
    },
    'proportions': {
      problems: [
        { prompt: 'Solve: x/3 = 8/6', answer: '4', solution: '6x = 24, x = 4' },
        { prompt: 'Solve: 5/x = 10/14', answer: '7', solution: '10x = 70, x = 7' },
        { prompt: 'Solve: (x+1)/4 = 3/2', answer: '5', solution: '2(x+1) = 12, 2x + 2 = 12, x = 5' },
        { prompt: 'Solve: 3/5 = 9/x', answer: '15', solution: '3x = 45, x = 15' },
        { prompt: 'If 4 apples cost $3, how much do 12 apples cost?', answer: '9', solution: '4/3 = 12/x, 4x = 36, x = 9' },
        { prompt: 'Solve: 2/(x-1) = 6/9', answer: '4', solution: '6(x-1) = 18, 6x - 6 = 18, x = 4' },
      ],
    },
    'one-variable-ineq': {
      problems: [
        { prompt: 'Solve: 2x + 3 > 7', answer: 'x > 2', solution: '2x > 4, x > 2' },
        { prompt: 'Solve: 3x - 5 <= 10', answer: 'x <= 5', solution: '3x <= 15, x <= 5' },
        { prompt: 'Solve: -4x > 12', answer: 'x < -3', solution: 'Divide by -4, flip sign: x < -3' },
        { prompt: 'Solve: 5 - 2x >= 1', answer: 'x <= 2', solution: '-2x >= -4, x <= 2' },
        { prompt: 'Solve: 3(x + 2) < 15', answer: 'x < 3', solution: '3x + 6 < 15, 3x < 9, x < 3' },
        { prompt: 'Solve: -x/2 + 4 > 6', answer: 'x < -4', solution: '-x/2 > 2, -x > 4, x < -4' },
      ],
    },
    'compound-inequalities': {
      problems: [
        { prompt: 'Solve: -3 < 2x + 1 < 7', answer: '-2 < x < 3', solution: '-4 < 2x < 6, -2 < x < 3' },
        { prompt: 'Solve: 1 <= 3x - 2 <= 10', answer: '1 <= x <= 4', solution: '3 <= 3x <= 12, 1 <= x <= 4' },
        { prompt: 'Solve: x + 3 > 5 OR x - 1 < -4', answer: 'x > 2 or x < -3', solution: 'x > 2 or x < -3' },
        { prompt: 'Solve: -5 <= 2x - 3 < 7', answer: '-1 <= x < 5', solution: '-2 <= 2x < 10, -1 <= x < 5' },
        { prompt: 'Solve: 4x + 1 > 9 AND 2x - 3 < 11', answer: '2 < x < 7', solution: 'x > 2 and x < 7' },
      ],
    },
    'absolute-value-ineq': {
      problems: [
        { prompt: 'Solve: |x - 3| < 5', answer: '-2 < x < 8', solution: '-5 < x - 3 < 5, -2 < x < 8' },
        { prompt: 'Solve: |2x + 1| > 7', answer: 'x > 3 or x < -4', solution: '2x + 1 > 7 or 2x + 1 < -7' },
        { prompt: 'Solve: |x| <= 4', answer: '-4 <= x <= 4', solution: '-4 <= x <= 4' },
        { prompt: 'Solve: |3x - 6| < 9', answer: '-1 < x < 5', solution: '-9 < 3x - 6 < 9, -3 < 3x < 15, -1 < x < 5' },
        { prompt: 'Solve: |x + 2| >= 6', answer: 'x >= 4 or x <= -8', solution: 'x + 2 >= 6 or x + 2 <= -6' },
      ],
    },
    'slope': {
      problems: [
        { prompt: 'Find the slope between (1, 2) and (3, 8)', answer: '3', solution: '(8-2)/(3-1) = 6/2 = 3' },
        { prompt: 'Find the slope between (-2, 5) and (4, -1)', answer: '-1', solution: '(-1-5)/(4-(-2)) = -6/6 = -1' },
        { prompt: 'Find the slope between (0, 3) and (6, 3)', answer: '0', solution: '(3-3)/(6-0) = 0/6 = 0 (horizontal line)' },
        { prompt: 'Find the slope of y = 4x - 7', answer: '4', solution: 'In y = mx + b form, m = 4' },
        { prompt: 'Find the slope between (2, -1) and (5, 8)', answer: '3', solution: '(8-(-1))/(5-2) = 9/3 = 3' },
        { prompt: 'Find the slope of 2x + 3y = 12', answer: '-2/3', solution: '3y = -2x + 12, y = (-2/3)x + 4, m = -2/3' },
      ],
    },
    'slope-intercept': {
      problems: [
        { prompt: 'Write in slope-intercept form: 2x + y = 5', answer: 'y = -2x + 5', solution: 'y = -2x + 5' },
        { prompt: 'Find the y-intercept of y = 3x - 7', answer: '-7', solution: 'When x = 0: y = -7' },
        { prompt: 'Write the equation with slope 2 and y-intercept -3', answer: 'y = 2x - 3', solution: 'y = mx + b = 2x + (-3)' },
        { prompt: 'Write in slope-intercept form: 4x - 2y = 10', answer: 'y = 2x - 5', solution: '-2y = -4x + 10, y = 2x - 5' },
        { prompt: 'Find slope and y-intercept of y = -x + 4', answer: 'm = -1, b = 4', solution: 'Slope = -1, y-intercept = 4' },
      ],
    },
    'point-slope': {
      problems: [
        { prompt: 'Write equation through (2, 3) with slope 4', answer: 'y - 3 = 4(x - 2)', solution: 'y - y1 = m(x - x1)' },
        { prompt: 'Write equation through (1, -2) and (3, 4)', answer: 'y + 2 = 3(x - 1)', solution: 'm = (4-(-2))/(3-1) = 3; y - (-2) = 3(x - 1)' },
        { prompt: 'Write equation through (-1, 5) with slope -2', answer: 'y - 5 = -2(x + 1)', solution: 'y - 5 = -2(x - (-1))' },
        { prompt: 'Convert y - 4 = 2(x - 1) to slope-intercept', answer: 'y = 2x + 2', solution: 'y - 4 = 2x - 2, y = 2x + 2' },
        { prompt: 'Write equation through (0, 6) and (3, 0)', answer: 'y - 6 = -2(x - 0)', solution: 'm = (0-6)/(3-0) = -2' },
      ],
    },
    'standard-form': {
      problems: [
        { prompt: 'Write y = 3x - 2 in standard form Ax + By = C', answer: '3x - y = 2', solution: '-3x + y = -2 or 3x - y = 2' },
        { prompt: 'Find x-intercept of 2x + 3y = 12', answer: '6', solution: 'Set y = 0: 2x = 12, x = 6' },
        { prompt: 'Find y-intercept of 5x - 2y = 10', answer: '-5', solution: 'Set x = 0: -2y = 10, y = -5' },
        { prompt: 'Write y + 1 = 4(x - 2) in standard form', answer: '4x - y = 9', solution: 'y + 1 = 4x - 8, -4x + y = -9, 4x - y = 9' },
        { prompt: 'Are 2x + 3y = 6 and 4x + 6y = 12 the same line?', answer: 'yes', solution: 'Second is 2 times the first; same line' },
      ],
    },
    'graphing-systems': {
      problems: [
        { prompt: 'How many solutions? y = 2x + 1 and y = 2x - 3', answer: '0', solution: 'Parallel lines (same slope, different intercepts), no solution' },
        { prompt: 'How many solutions? y = x + 2 and y = -x + 4', answer: '1', solution: 'Different slopes intersect at one point' },
        { prompt: 'Find intersection: y = x + 1 and y = 3', answer: '(2, 3)', solution: '3 = x + 1, x = 2; point is (2, 3)' },
        { prompt: 'How many solutions? y = 3x + 2 and 2y = 6x + 4', answer: 'infinite', solution: 'Same line: 2y = 6x + 4 simplifies to y = 3x + 2' },
        { prompt: 'Find intersection: y = 2x and y = -x + 6', answer: '(2, 4)', solution: '2x = -x + 6, 3x = 6, x = 2, y = 4' },
      ],
    },
    'substitution': {
      problems: [
        { prompt: 'Solve: y = 2x - 1, 3x + y = 9', answer: '(2, 3)', solution: '3x + (2x-1) = 9, 5x = 10, x = 2, y = 3' },
        { prompt: 'Solve: x = 3y + 1, 2x - y = 7', answer: '(4, 1)', solution: '2(3y+1) - y = 7, 6y + 2 - y = 7, 5y = 5, y = 1, x = 4' },
        { prompt: 'Solve: y = x + 3, 2x + y = 12', answer: '(3, 6)', solution: '2x + (x+3) = 12, 3x = 9, x = 3, y = 6' },
        { prompt: 'Solve: y = -x + 5, 3x + 2y = 14', answer: '(4, 1)', solution: '3x + 2(-x+5) = 14, 3x - 2x + 10 = 14, x = 4, y = 1' },
        { prompt: 'Solve: x + y = 10, y = 4x', answer: '(2, 8)', solution: 'x + 4x = 10, 5x = 10, x = 2, y = 8' },
      ],
    },
    'elimination': {
      problems: [
        { prompt: 'Solve: x + y = 7, x - y = 3', answer: '(5, 2)', solution: 'Add: 2x = 10, x = 5, y = 2' },
        { prompt: 'Solve: 2x + 3y = 12, 2x - 3y = 0', answer: '(3, 2)', solution: 'Add: 4x = 12, x = 3, y = 2' },
        { prompt: 'Solve: 3x + y = 10, x + y = 4', answer: '(3, 1)', solution: 'Subtract: 2x = 6, x = 3, y = 1' },
        { prompt: 'Solve: 2x + 5y = 24, 3x - 5y = 1', answer: '(5, 2.8)', solution: 'Add: 5x = 25, x = 5, 5y = 14, y = 2.8' },
        { prompt: 'Solve: 4x + 3y = 25, 2x + 3y = 17', answer: '(4, 3)', solution: 'Subtract: 2x = 8, x = 4, y = 3' },
      ],
    },
    'exponent-rules': {
      problems: [
        { prompt: 'Simplify: x^3 * x^5', answer: 'x^8', solution: 'Product rule: x^(3+5) = x^8' },
        { prompt: 'Simplify: (x^4)^3', answer: 'x^12', solution: 'Power rule: x^(4*3) = x^12' },
        { prompt: 'Simplify: x^7 / x^2', answer: 'x^5', solution: 'Quotient rule: x^(7-2) = x^5' },
        { prompt: 'Simplify: (2x)^3', answer: '8x^3', solution: '2^3 * x^3 = 8x^3' },
        { prompt: 'Simplify: x^(-3)', answer: '1/x^3', solution: 'Negative exponent: x^(-3) = 1/x^3' },
        { prompt: 'Simplify: (x^2 * y^3)^2', answer: 'x^4 * y^6', solution: 'x^(2*2) * y^(3*2) = x^4 * y^6' },
        { prompt: 'Evaluate: 5^0', answer: '1', solution: 'Any nonzero base to the 0 power = 1' },
        { prompt: 'Simplify: (3x^2)^2 * x^3', answer: '9x^7', solution: '9x^4 * x^3 = 9x^7' },
      ],
    },
    'polynomial-operations': {
      problems: [
        { prompt: 'Add: (3x^2 + 2x - 1) + (x^2 - 5x + 4)', answer: '4x^2 - 3x + 3', solution: 'Combine like terms' },
        { prompt: 'Subtract: (5x^2 - 3x) - (2x^2 + x - 4)', answer: '3x^2 - 4x + 4', solution: 'Distribute negative, combine' },
        { prompt: 'Multiply: 3x(2x^2 - 4x + 1)', answer: '6x^3 - 12x^2 + 3x', solution: 'Distribute 3x' },
        { prompt: 'Multiply: (x + 3)(x - 5)', answer: 'x^2 - 2x - 15', solution: 'FOIL: x^2 - 5x + 3x - 15' },
        { prompt: 'Multiply: (2x + 1)(x + 4)', answer: '2x^2 + 9x + 4', solution: 'FOIL: 2x^2 + 8x + x + 4' },
        { prompt: 'Expand: (x + 3)^2', answer: 'x^2 + 6x + 9', solution: '(x+3)(x+3) = x^2 + 3x + 3x + 9' },
        { prompt: 'Multiply: (x + 4)(x - 4)', answer: 'x^2 - 16', solution: 'Difference of squares: a^2 - b^2' },
      ],
    },
    'factoring-gcf': {
      problems: [
        { prompt: 'Factor: 6x^2 + 9x', answer: '3x(2x + 3)', solution: 'GCF = 3x: 3x(2x + 3)' },
        { prompt: 'Factor: 12x^3 - 8x^2 + 4x', answer: '4x(3x^2 - 2x + 1)', solution: 'GCF = 4x' },
        { prompt: 'Factor: 15x^2y - 10xy^2', answer: '5xy(3x - 2y)', solution: 'GCF = 5xy' },
        { prompt: 'Factor: x^2 - 25', answer: '(x + 5)(x - 5)', solution: 'Difference of squares' },
        { prompt: 'Factor: 4x^2 - 9', answer: '(2x + 3)(2x - 3)', solution: 'Difference of squares: (2x)^2 - 3^2' },
        { prompt: 'Factor: x^3 + 8', answer: '(x + 2)(x^2 - 2x + 4)', solution: 'Sum of cubes: a^3 + b^3' },
      ],
    },
    'factoring-trinomials': {
      problems: [
        { prompt: 'Factor: x^2 + 5x + 6', answer: '(x + 2)(x + 3)', solution: 'Find two numbers: 2 * 3 = 6, 2 + 3 = 5' },
        { prompt: 'Factor: x^2 - 7x + 12', answer: '(x - 3)(x - 4)', solution: '-3 * -4 = 12, -3 + -4 = -7' },
        { prompt: 'Factor: x^2 + x - 12', answer: '(x + 4)(x - 3)', solution: '4 * -3 = -12, 4 + -3 = 1' },
        { prompt: 'Factor: x^2 - x - 20', answer: '(x - 5)(x + 4)', solution: '-5 * 4 = -20, -5 + 4 = -1' },
        { prompt: 'Factor: 2x^2 + 7x + 3', answer: '(2x + 1)(x + 3)', solution: 'AC method: 2*3=6, factors 1,6: (2x+1)(x+3)' },
        { prompt: 'Factor: x^2 + 6x + 9', answer: '(x + 3)^2', solution: 'Perfect square trinomial' },
        { prompt: 'Factor: 3x^2 - 10x - 8', answer: '(3x + 2)(x - 4)', solution: 'AC = -24, factors 2, -12' },
        { prompt: 'Factor: x^2 - 9x + 20', answer: '(x - 4)(x - 5)', solution: '-4 * -5 = 20, -4 + -5 = -9' },
      ],
    },
    'quadratic-formula': {
      problems: [
        { prompt: 'Solve x^2 - 5x + 6 = 0 using quadratic formula', answer: 'x = 2 or x = 3', solution: 'x = (5 +/- sqrt(25-24))/2 = (5 +/- 1)/2' },
        { prompt: 'Solve 2x^2 + 3x - 2 = 0', answer: 'x = 1/2 or x = -2', solution: 'x = (-3 +/- sqrt(9+16))/4 = (-3 +/- 5)/4' },
        { prompt: 'Solve x^2 - 4x + 4 = 0', answer: 'x = 2', solution: 'x = (4 +/- sqrt(16-16))/2 = 4/2 = 2 (double root)' },
        { prompt: 'Find the discriminant of x^2 + 3x + 5 = 0', answer: '-11', solution: 'b^2 - 4ac = 9 - 20 = -11 (no real solutions)' },
        { prompt: 'Solve x^2 - 6x + 5 = 0', answer: 'x = 1 or x = 5', solution: 'x = (6 +/- sqrt(36-20))/2 = (6 +/- 4)/2' },
        { prompt: 'Solve 3x^2 - 12x + 9 = 0', answer: 'x = 1 or x = 3', solution: 'x = (12 +/- sqrt(144-108))/6 = (12 +/- 6)/6' },
      ],
    },
    'graphing-parabolas': {
      problems: [
        { prompt: 'Find the vertex of y = x^2 - 4x + 3', answer: '(2, -1)', solution: 'x = -b/2a = 4/2 = 2, y = 4 - 8 + 3 = -1' },
        { prompt: 'Does y = -2x^2 + 3 open up or down?', answer: 'down', solution: 'a = -2 < 0, opens down' },
        { prompt: 'Find the axis of symmetry of y = x^2 + 6x + 5', answer: 'x = -3', solution: 'x = -b/2a = -6/2 = -3' },
        { prompt: 'Find the y-intercept of y = 2x^2 - 3x + 1', answer: '1', solution: 'Set x = 0: y = 1' },
        { prompt: 'Find the vertex of y = (x - 3)^2 + 2', answer: '(3, 2)', solution: 'Vertex form y = (x-h)^2 + k, vertex (h, k)' },
        { prompt: 'Find x-intercepts of y = x^2 - 9', answer: 'x = 3 or x = -3', solution: '0 = x^2 - 9 = (x+3)(x-3)' },
      ],
    },
  },
  'algebra-2': {
    'polynomial-division': {
      problems: [
        { prompt: 'Divide (x^2 + 5x + 6) by (x + 2)', answer: 'x + 3', solution: 'Polynomial long division or factor: (x+2)(x+3)/(x+2) = x+3' },
        { prompt: 'Use synthetic division: (x^3 - 8) / (x - 2)', answer: 'x^2 + 2x + 4', solution: 'Synthetic with 2: coefficients 1, 0, 0, -8 -> 1, 2, 4, 0' },
        { prompt: 'Find remainder: (x^3 + 2x - 5) / (x - 1)', answer: '-2', solution: 'Remainder Theorem: f(1) = 1 + 2 - 5 = -2' },
        { prompt: 'Divide (2x^2 + 7x + 3) by (x + 3)', answer: '2x + 1', solution: '(2x+1)(x+3)/(x+3) = 2x+1' },
        { prompt: 'Find remainder: (x^4 - 1) / (x - 1)', answer: '0', solution: 'f(1) = 1 - 1 = 0, so (x-1) is a factor' },
      ],
    },
    'factor-theorem': {
      problems: [
        { prompt: 'Is (x - 2) a factor of x^3 - 3x^2 + 4?', answer: 'yes', solution: 'f(2) = 8 - 12 + 4 = 0' },
        { prompt: 'Is (x + 1) a factor of x^3 + 2x^2 - x - 2?', answer: 'yes', solution: 'f(-1) = -1 + 2 + 1 - 2 = 0' },
        { prompt: 'Is (x - 3) a factor of x^2 + x - 6?', answer: 'no', solution: 'f(3) = 9 + 3 - 6 = 6, not zero' },
        { prompt: 'Find k if (x - 1) is a factor of x^2 + kx - 3', answer: '2', solution: 'f(1) = 1 + k - 3 = 0, k = 2' },
        { prompt: 'Is (x + 3) a factor of x^3 + 27?', answer: 'yes', solution: 'f(-3) = -27 + 27 = 0; sum of cubes' },
      ],
    },
    'zeros-of-polynomials': {
      problems: [
        { prompt: 'Find all zeros of f(x) = x^3 - 6x^2 + 11x - 6', answer: '1, 2, 3', solution: 'Factor: (x-1)(x-2)(x-3)' },
        { prompt: 'How many zeros can a degree 4 polynomial have?', answer: 'at most 4', solution: 'A degree n polynomial has at most n real zeros' },
        { prompt: 'Find zeros of f(x) = x^2(x - 3)', answer: '0 (multiplicity 2), 3', solution: 'x = 0 (double), x = 3' },
        { prompt: 'List possible rational zeros of x^3 - 2x + 4', answer: '+/-1, +/-2, +/-4', solution: 'Rational Root Theorem: factors of 4 / factors of 1' },
        { prompt: 'Find zeros of f(x) = x^4 - 5x^2 + 4', answer: '+/-1, +/-2', solution: 'Let u = x^2: u^2 - 5u + 4 = (u-1)(u-4), x = +/-1, +/-2' },
      ],
    },
    'completing-the-square': {
      problems: [
        { prompt: 'Complete the square: x^2 + 6x + __', answer: '9', solution: '(6/2)^2 = 9; x^2 + 6x + 9 = (x+3)^2' },
        { prompt: 'Solve by completing the square: x^2 + 4x = 5', answer: 'x = 1 or x = -5', solution: 'x^2 + 4x + 4 = 9, (x+2)^2 = 9, x = -2 +/- 3' },
        { prompt: 'Write in vertex form: y = x^2 - 8x + 12', answer: 'y = (x - 4)^2 - 4', solution: 'y = (x^2 - 8x + 16) - 16 + 12 = (x-4)^2 - 4' },
        { prompt: 'Complete the square: x^2 - 10x + __', answer: '25', solution: '(-10/2)^2 = 25' },
        { prompt: 'Solve: x^2 - 2x - 8 = 0 by completing the square', answer: 'x = 4 or x = -2', solution: '(x-1)^2 = 9, x = 1 +/- 3' },
      ],
    },
    'discriminant': {
      problems: [
        { prompt: 'Find discriminant and # of real solutions: x^2 + 4x + 4 = 0', answer: '0, one repeated', solution: 'D = 16 - 16 = 0' },
        { prompt: 'Find discriminant: 2x^2 - 3x + 5 = 0', answer: '-31, no real solutions', solution: 'D = 9 - 40 = -31 < 0' },
        { prompt: 'Find discriminant: x^2 - 5x + 2 = 0', answer: '17, two real solutions', solution: 'D = 25 - 8 = 17 > 0' },
        { prompt: 'For what k does x^2 + kx + 9 = 0 have one solution?', answer: 'k = 6 or k = -6', solution: 'D = k^2 - 36 = 0, k = +/-6' },
        { prompt: 'Find discriminant: 3x^2 + 2x - 1 = 0', answer: '16, two real solutions', solution: 'D = 4 + 12 = 16 > 0' },
      ],
    },
    'complex-solutions': {
      problems: [
        { prompt: 'Simplify: sqrt(-25)', answer: '5i', solution: 'sqrt(-25) = sqrt(25) * sqrt(-1) = 5i' },
        { prompt: 'Solve: x^2 + 4 = 0', answer: 'x = 2i or x = -2i', solution: 'x^2 = -4, x = +/- 2i' },
        { prompt: 'Simplify: (3 + 2i) + (1 - 5i)', answer: '4 - 3i', solution: '(3+1) + (2-5)i = 4 - 3i' },
        { prompt: 'Simplify: (2 + i)(3 - i)', answer: '7 + i', solution: '6 - 2i + 3i - i^2 = 6 + i + 1 = 7 + i' },
        { prompt: 'Solve: x^2 - 2x + 5 = 0', answer: 'x = 1 + 2i or x = 1 - 2i', solution: 'D = 4-20 = -16, x = (2 +/- 4i)/2' },
        { prompt: 'Find the conjugate of 3 - 4i', answer: '3 + 4i', solution: 'Change sign of imaginary part' },
      ],
    },
    'simplifying-rational': {
      problems: [
        { prompt: 'Simplify: (x^2 - 9)/(x + 3)', answer: 'x - 3', solution: '(x+3)(x-3)/(x+3) = x - 3, x != -3' },
        { prompt: 'Simplify: (x^2 + 5x + 6)/(x + 2)', answer: 'x + 3', solution: '(x+2)(x+3)/(x+2) = x + 3' },
        { prompt: 'Simplify: (2x^2 - 8)/(x^2 - 4)', answer: '2', solution: '2(x^2-4)/(x^2-4) = 2' },
        { prompt: 'State the domain restriction of 5/(x - 7)', answer: 'x != 7', solution: 'Denominator cannot be zero' },
        { prompt: 'Simplify: (x^2 - 1)/(x^2 + 3x + 2)', answer: '(x - 1)/(x + 2)', solution: '(x+1)(x-1)/((x+1)(x+2))' },
      ],
    },
    'rational-equations': {
      problems: [
        { prompt: 'Solve: 3/x + 1/2 = 5/x', answer: '4', solution: 'Multiply by 2x: 6 + x = 10, x = 4' },
        { prompt: 'Solve: x/(x-2) = 3/(x-2) + 2', answer: '1', solution: 'x/(x-2) - 3/(x-2) = 2, (x-3)/(x-2) = 2, x-3 = 2(x-2), x-3 = 2x-4, x = 1 (check domain: x != 2, OK)' },
        { prompt: 'Solve: 1/(x+1) + 1/(x-1) = 4/(x^2-1)', answer: '2', solution: 'LCD = (x+1)(x-1): (x-1) + (x+1) = 4, 2x = 4, x = 2' },
        { prompt: 'Solve: 2/x = 6/(x + 4)', answer: '2', solution: '2(x+4) = 6x, 2x + 8 = 6x, 8 = 4x, x = 2' },
      ],
    },
    'rational-operations': {
      problems: [
        { prompt: 'Add: 1/x + 2/x', answer: '3/x', solution: 'Same denominator: (1+2)/x = 3/x' },
        { prompt: 'Add: 1/(x+1) + 1/(x-1)', answer: '2x/(x^2 - 1)', solution: 'LCD = (x+1)(x-1): (x-1+x+1)/((x+1)(x-1)) = 2x/(x^2-1)' },
        { prompt: 'Multiply: (x+2)/3 * 9/(x+2)', answer: '3', solution: 'Cancel (x+2): 9/3 = 3' },
        { prompt: 'Divide: (x^2-4)/x / (x+2)/x', answer: 'x - 2', solution: 'Multiply by reciprocal: (x^2-4)/x * x/(x+2) = (x-2)' },
      ],
    },
    'simplifying-radicals': {
      problems: [
        { prompt: 'Simplify: sqrt(72)', answer: '6*sqrt(2)', solution: 'sqrt(36*2) = 6*sqrt(2)' },
        { prompt: 'Simplify: sqrt(50) + sqrt(18)', answer: '8*sqrt(2)', solution: '5*sqrt(2) + 3*sqrt(2) = 8*sqrt(2)' },
        { prompt: 'Simplify: sqrt(x^6)', answer: 'x^3', solution: '(x^6)^(1/2) = x^3 (assuming x >= 0)' },
        { prompt: 'Simplify: 3*sqrt(12)', answer: '6*sqrt(3)', solution: '3*sqrt(4*3) = 3*2*sqrt(3) = 6*sqrt(3)' },
        { prompt: 'Rationalize: 5/sqrt(3)', answer: '5*sqrt(3)/3', solution: 'Multiply by sqrt(3)/sqrt(3)' },
        { prompt: 'Simplify: sqrt(48) - sqrt(27)', answer: 'sqrt(3)', solution: '4*sqrt(3) - 3*sqrt(3) = sqrt(3)' },
      ],
    },
    'radical-equations': {
      problems: [
        { prompt: 'Solve: sqrt(x) = 5', answer: '25', solution: 'Square both sides: x = 25' },
        { prompt: 'Solve: sqrt(x + 3) = 4', answer: '13', solution: 'x + 3 = 16, x = 13' },
        { prompt: 'Solve: sqrt(2x - 1) = 3', answer: '5', solution: '2x - 1 = 9, 2x = 10, x = 5' },
        { prompt: 'Solve: sqrt(x + 7) = x - 5', answer: '9', solution: 'x + 7 = x^2 - 10x + 25, x^2 - 11x + 18 = 0, (x-9)(x-2)=0. Check: x=9 works, x=2 is extraneous' },
        { prompt: 'Solve: cbrt(x - 1) = 2', answer: '9', solution: 'x - 1 = 8, x = 9' },
      ],
    },
    'rational-exponents': {
      problems: [
        { prompt: 'Evaluate: 8^(2/3)', answer: '4', solution: '(8^(1/3))^2 = 2^2 = 4' },
        { prompt: 'Evaluate: 27^(1/3)', answer: '3', solution: 'Cube root of 27 = 3' },
        { prompt: 'Simplify: x^(1/2) * x^(3/2)', answer: 'x^2', solution: 'x^(1/2 + 3/2) = x^(4/2) = x^2' },
        { prompt: 'Evaluate: 16^(3/4)', answer: '8', solution: '(16^(1/4))^3 = 2^3 = 8' },
        { prompt: 'Rewrite sqrt(x^3) using rational exponents', answer: 'x^(3/2)', solution: '(x^3)^(1/2) = x^(3/2)' },
        { prompt: 'Evaluate: 32^(2/5)', answer: '4', solution: '(32^(1/5))^2 = 2^2 = 4' },
      ],
    },
    'growth-decay': {
      problems: [
        { prompt: 'A population of 500 grows 3% per year. What is it after 10 years? (Round to nearest integer)', answer: '672', solution: '500 * 1.03^10 = 500 * 1.3439 = 672' },
        { prompt: 'Is y = 0.85^x growth or decay?', answer: 'decay', solution: 'Base 0.85 < 1, so exponential decay' },
        { prompt: 'A car worth $20,000 depreciates 15% per year. Value after 3 years? (Round to nearest dollar)', answer: '12283', solution: '20000 * 0.85^3 = 20000 * 0.6141 = 12283' },
        { prompt: 'Write the equation: initial value 100, doubles every 5 years', answer: 'y = 100 * 2^(t/5)', solution: 'y = 100 * 2^(t/5)' },
        { prompt: 'Is y = 3 * 1.07^x growth or decay?', answer: 'growth', solution: 'Base 1.07 > 1, so exponential growth' },
      ],
    },
    'compound-interest': {
      problems: [
        { prompt: '$1000 at 5% compounded annually for 3 years. Final amount? (Nearest cent)', answer: '1157.63', solution: '1000 * 1.05^3 = 1000 * 1.157625 = 1157.63' },
        { prompt: '$2000 at 4% compounded quarterly for 2 years. Final amount? (Nearest cent)', answer: '2165.71', solution: '2000 * (1 + 0.04/4)^(4*2) = 2000 * 1.01^8 = 2165.71' },
        { prompt: '$500 at 6% compounded monthly for 1 year. Final amount? (Nearest cent)', answer: '530.84', solution: '500 * (1 + 0.06/12)^12 = 500 * 1.005^12 = 530.84' },
        { prompt: 'What is the formula for compound interest?', answer: 'A = P(1 + r/n)^(nt)', solution: 'P = principal, r = rate, n = compoundings/year, t = years' },
      ],
    },
    'exponential-equations': {
      problems: [
        { prompt: 'Solve: 2^x = 32', answer: '5', solution: '2^5 = 32' },
        { prompt: 'Solve: 3^x = 81', answer: '4', solution: '3^4 = 81' },
        { prompt: 'Solve: 5^(x-1) = 125', answer: '4', solution: '5^3 = 125, x - 1 = 3, x = 4' },
        { prompt: 'Solve: 4^x = 8', answer: '3/2', solution: '2^(2x) = 2^3, 2x = 3, x = 3/2' },
        { prompt: 'Solve: 2^(2x) = 16', answer: '2', solution: '2^(2x) = 2^4, 2x = 4, x = 2' },
        { prompt: 'Solve: 9^x = 27', answer: '3/2', solution: '3^(2x) = 3^3, 2x = 3, x = 3/2' },
      ],
    },
    'log-properties': {
      problems: [
        { prompt: 'Evaluate: log_2(16)', answer: '4', solution: '2^4 = 16' },
        { prompt: 'Evaluate: log_10(1000)', answer: '3', solution: '10^3 = 1000' },
        { prompt: 'Expand: log(xy)', answer: 'log(x) + log(y)', solution: 'Product rule of logarithms' },
        { prompt: 'Expand: log(x^3)', answer: '3*log(x)', solution: 'Power rule of logarithms' },
        { prompt: 'Condense: log(a) + log(b) - log(c)', answer: 'log(ab/c)', solution: 'Product rule then quotient rule' },
        { prompt: 'Evaluate: ln(e^5)', answer: '5', solution: 'ln and e are inverse functions' },
        { prompt: 'Evaluate: log_3(27)', answer: '3', solution: '3^3 = 27' },
        { prompt: 'Expand: log(x^2/y)', answer: '2*log(x) - log(y)', solution: 'Quotient then power rule' },
      ],
    },
    'log-equations': {
      problems: [
        { prompt: 'Solve: log_2(x) = 5', answer: '32', solution: 'x = 2^5 = 32' },
        { prompt: 'Solve: log(x) + log(x-3) = 1', answer: '5', solution: 'log(x(x-3)) = 1, x^2 - 3x = 10, x^2 - 3x - 10 = 0, (x-5)(x+2) = 0, x = 5' },
        { prompt: 'Solve: ln(x) = 3', answer: 'e^3', solution: 'x = e^3 (approximately 20.09)' },
        { prompt: 'Solve: 2*log_3(x) = 4', answer: '9', solution: 'log_3(x) = 2, x = 3^2 = 9' },
        { prompt: 'Solve: log_5(x + 6) = 2', answer: '19', solution: 'x + 6 = 25, x = 19' },
      ],
    },
    'change-of-base': {
      problems: [
        { prompt: 'Evaluate log_5(30) using change of base (to 2 decimal places)', answer: '2.11', solution: 'log(30)/log(5) = 1.4771/0.6990 = 2.11' },
        { prompt: 'Rewrite log_3(7) using natural log', answer: 'ln(7)/ln(3)', solution: 'Change of base: log_a(b) = ln(b)/ln(a)' },
        { prompt: 'Evaluate log_2(10) to 2 decimal places', answer: '3.32', solution: 'log(10)/log(2) = 1/0.3010 = 3.32' },
        { prompt: 'Evaluate log_4(20) to 2 decimal places', answer: '2.16', solution: 'log(20)/log(4) = 1.3010/0.6021 = 2.16' },
      ],
    },
    'arithmetic-sequences': {
      problems: [
        { prompt: 'Find the 10th term: 3, 7, 11, 15, ...', answer: '39', solution: 'a_n = 3 + (n-1)*4; a_10 = 3 + 36 = 39' },
        { prompt: 'Find the common difference: 5, 12, 19, 26, ...', answer: '7', solution: '12 - 5 = 7' },
        { prompt: 'Find the sum of the first 20 terms: a_1 = 2, d = 3', answer: '610', solution: 'a_20 = 2 + 57 = 59; S = 20*(2+59)/2 = 610' },
        { prompt: 'Write a formula for the nth term: 10, 7, 4, 1, ...', answer: 'a_n = 13 - 3n', solution: 'a_n = 10 + (n-1)(-3) = 13 - 3n' },
        { prompt: 'Find n if a_1 = 5, d = 4, a_n = 41', answer: '10', solution: '41 = 5 + (n-1)*4, 36 = 4(n-1), n = 10' },
      ],
    },
    'geometric-sequences': {
      problems: [
        { prompt: 'Find the 6th term: 2, 6, 18, 54, ...', answer: '486', solution: 'a_n = 2 * 3^(n-1); a_6 = 2 * 243 = 486' },
        { prompt: 'Find the common ratio: 4, 12, 36, 108, ...', answer: '3', solution: '12/4 = 3' },
        { prompt: 'Find the sum of the first 5 terms: a_1 = 3, r = 2', answer: '93', solution: 'S = 3*(1-32)/(1-2) = 3*31 = 93' },
        { prompt: 'Find the 4th term: 5, -10, 20, ...', answer: '-40', solution: 'r = -2; a_4 = 5*(-2)^3 = -40' },
        { prompt: 'Does the geometric series 8 + 4 + 2 + 1 + ... converge?', answer: 'yes, sum = 16', solution: '|r| = 1/2 < 1; S = 8/(1 - 1/2) = 16' },
      ],
    },
    'sigma-notation': {
      problems: [
        { prompt: 'Evaluate: sum(k, k=1 to 5)', answer: '15', solution: '1 + 2 + 3 + 4 + 5 = 15' },
        { prompt: 'Evaluate: sum(2k, k=1 to 4)', answer: '20', solution: '2 + 4 + 6 + 8 = 20' },
        { prompt: 'Evaluate: sum(k^2, k=1 to 4)', answer: '30', solution: '1 + 4 + 9 + 16 = 30' },
        { prompt: 'Write in sigma notation: 3 + 6 + 9 + 12 + 15', answer: 'sum(3k, k=1 to 5)', solution: 'Each term is 3k for k = 1 to 5' },
        { prompt: 'Evaluate: sum(3, k=1 to 10)', answer: '30', solution: 'Constant 3 summed 10 times = 30' },
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

function norm(s) { return String(s).toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^a-z0-9 +\-*/^().=<>!,]/g, ''); }

// Exercise generation

function generateExercise(level, skill, count = 5) {
  const bank = PROBLEM_BANKS[level]?.[skill];
  if (!bank) return { error: `No problem bank for ${level}/${skill}` };
  const items = pick(bank.problems, count).map(p => ({
    prompt: p.prompt,
    answer: p.answer,
    solution: p.solution,
    type: 'math',
  }));
  return { type: 'math', skill, level, count: items.length, instruction: 'Solve each problem. Show your work.', items };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  return { correct: norm(expected) === norm(answer), expected, studentAnswer: answer };
}

// Public API

class Algebra {
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
    const level = p.level || 'algebra-1';
    const gs = SKILLS[level] || {};
    const results = {};
    let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(gs)) {
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
    const level = p.level || 'algebra-1';
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
    const gs = SKILLS[level];
    if (!gs) return { level, error: `Unknown level. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0;
    const catalog = {};
    for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; }
    return { level, skills: catalog, totalSkills: total };
  }

  generateExercise(level, skill, count = 5) { return generateExercise(level, skill, count); }

  checkAnswer(type, expected, answer) { return checkAnswer(type, expected, answer); }

  generateLesson(id) {
    const p = loadProfile(id);
    const level = p.level || 'algebra-1';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Ready for next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    return {
      studentId: id, level, targetSkill: target, exercise,
      lessonPlan: {
        review: 'Review prerequisite concepts (3-5 min)',
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        reflect: 'Summarize the key idea and common pitfalls',
      },
    };
  }
}

module.exports = Algebra;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new Algebra();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, level] = args;
        if (!id) throw new Error('Usage: start <id> [level]');
        if (level) api.setLevel(id, level);
        out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const level = loadProfile(id).level || 'algebra-1';
        if (skill) { out(api.generateExercise(level, skill, 5)); }
        else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(api.checkAnswer(type, expected, answer));
        break;
      }
      case 'record': {
        const [, id, level, cat, skill, sc, tot, ...notes] = args;
        if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total>');
        out(api.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? api.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(api.setLevel(id, l)); break; }
      default: out({ usage: 'node algebra.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
