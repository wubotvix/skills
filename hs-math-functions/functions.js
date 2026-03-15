// eClaw HS Math Functions Interactive Tutor (Grades 9-12). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-math-functions');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'intro': {
    'function-basics': ['definition-notation', 'domain-range', 'vertical-line-test'],
    'linear': ['evaluate-linear', 'graph-linear', 'write-linear'],
    'absolute-value': ['graph-abs-value', 'solve-abs-value'],
  },
  'intermediate': {
    'quadratic': ['vertex-form', 'standard-form', 'factored-form'],
    'polynomial': ['end-behavior', 'zeros-multiplicity', 'turning-points'],
    'exponential-log': ['exp-growth-decay', 'log-basics', 'exp-vs-linear'],
    'transformations': ['vertical-horizontal-shifts', 'stretches-compressions', 'reflections'],
  },
  'advanced': {
    'rational': ['asymptotes', 'holes-domain', 'graphing-rational'],
    'composition': ['compose-functions', 'decompose-functions'],
    'inverses': ['find-inverse', 'verify-inverse', 'restrict-domain'],
    'modeling': ['choose-model', 'interpret-parameters', 'compare-models'],
  },
};

const PROBLEM_BANKS = {
  'intro': {
    'definition-notation': {
      problems: [
        { prompt: 'If f(x) = 3x - 2, find f(4)', answer: '10', solution: 'f(4) = 3(4) - 2 = 12 - 2 = 10' },
        { prompt: 'If g(x) = x^2 + 1, find g(-3)', answer: '10', solution: 'g(-3) = (-3)^2 + 1 = 9 + 1 = 10' },
        { prompt: 'If h(x) = 2x^2 - x, find h(2)', answer: '6', solution: 'h(2) = 2(4) - 2 = 8 - 2 = 6' },
        { prompt: 'Is y^2 = x a function of x?', answer: 'no', solution: 'For x = 4, y = 2 or y = -2 (two outputs)' },
        { prompt: 'If f(x) = 5x + 1, find f(0)', answer: '1', solution: 'f(0) = 5(0) + 1 = 1' },
        { prompt: 'If f(x) = x^3, find f(-2)', answer: '-8', solution: 'f(-2) = (-2)^3 = -8' },
      ],
    },
    'domain-range': {
      problems: [
        { prompt: 'Find the domain of f(x) = 1/(x - 3)', answer: 'all reals except x = 3', solution: 'Denominator cannot be 0: x != 3' },
        { prompt: 'Find the domain of f(x) = sqrt(x - 4)', answer: 'x >= 4', solution: 'Radicand must be >= 0: x - 4 >= 0' },
        { prompt: 'Find the range of f(x) = x^2', answer: 'y >= 0', solution: 'x^2 is always non-negative; minimum at vertex (0,0)' },
        { prompt: 'Find the domain of f(x) = 3x + 7', answer: 'all real numbers', solution: 'Linear functions have no restrictions' },
        { prompt: 'Find the range of f(x) = |x|', answer: 'y >= 0', solution: 'Absolute value is always non-negative' },
        { prompt: 'Find the domain of f(x) = log(x)', answer: 'x > 0', solution: 'Logarithm argument must be positive' },
      ],
    },
    'vertical-line-test': {
      problems: [
        { prompt: 'Does the graph of y = x^2 pass the vertical line test?', answer: 'yes', solution: 'Each vertical line crosses the parabola at most once' },
        { prompt: 'Does x^2 + y^2 = 25 pass the vertical line test?', answer: 'no', solution: 'Circle: vertical lines can cross at two points' },
        { prompt: 'Does y = 2x + 1 pass the vertical line test?', answer: 'yes', solution: 'Every line (non-vertical) passes the test' },
        { prompt: 'Does x = y^2 pass the vertical line test?', answer: 'no', solution: 'For x = 4: y = 2 or y = -2' },
      ],
    },
    'evaluate-linear': {
      problems: [
        { prompt: 'f(x) = -2x + 7. Find f(3).', answer: '1', solution: 'f(3) = -6 + 7 = 1' },
        { prompt: 'f(x) = (1/2)x - 4. Find f(10).', answer: '1', solution: 'f(10) = 5 - 4 = 1' },
        { prompt: 'f(x) = 3x + 2. For what x does f(x) = 17?', answer: '5', solution: '3x + 2 = 17, 3x = 15, x = 5' },
        { prompt: 'f(x) = -x + 10. Find f(-3).', answer: '13', solution: 'f(-3) = -(-3) + 10 = 3 + 10 = 13' },
        { prompt: 'f(x) = 4x - 1. Find f(0) + f(1).', answer: '2', solution: 'f(0) = -1, f(1) = 3; -1 + 3 = 2' },
      ],
    },
    'graph-linear': {
      problems: [
        { prompt: 'y = 2x - 3. What is the slope?', answer: '2', solution: 'In y = mx + b form, m = 2' },
        { prompt: 'y = -x + 5. What is the y-intercept?', answer: '5', solution: 'b = 5; point (0, 5)' },
        { prompt: 'y = (3/4)x + 1. What is the slope?', answer: '3/4', solution: 'Rise 3, run 4' },
        { prompt: 'Where does y = 2x - 6 cross the x-axis?', answer: '(3, 0)', solution: '0 = 2x - 6, x = 3' },
        { prompt: 'A line passes through (0, 4) and (2, 0). What is the slope?', answer: '-2', solution: '(0 - 4)/(2 - 0) = -4/2 = -2' },
      ],
    },
    'write-linear': {
      problems: [
        { prompt: 'Write equation: slope 3, passes through (1, 5)', answer: 'y = 3x + 2', solution: '5 = 3(1) + b, b = 2' },
        { prompt: 'Write equation: passes through (2, 3) and (4, 7)', answer: 'y = 2x - 1', solution: 'm = (7-3)/(4-2) = 2; 3 = 2(2) + b, b = -1' },
        { prompt: 'A taxi charges $3 base plus $2/mile. Write f(x).', answer: 'f(x) = 2x + 3', solution: 'Rate of change = 2, initial value = 3' },
        { prompt: 'Write equation: slope -1/2, y-intercept 6', answer: 'y = (-1/2)x + 6', solution: 'Direct from y = mx + b' },
      ],
    },
    'graph-abs-value': {
      problems: [
        { prompt: 'What is the vertex of y = |x - 3| + 2?', answer: '(3, 2)', solution: 'Shifts right 3, up 2 from y = |x|' },
        { prompt: 'What is the vertex of y = |x + 1| - 4?', answer: '(-1, -4)', solution: 'Shifts left 1, down 4' },
        { prompt: 'Does y = -|x| open up or down?', answer: 'down', solution: 'Negative reflection flips the V downward' },
        { prompt: 'What is the range of y = |x| + 3?', answer: 'y >= 3', solution: 'Minimum value is 3 at vertex' },
      ],
    },
    'solve-abs-value': {
      problems: [
        { prompt: 'Solve: |x - 5| = 3', answer: 'x = 8 or x = 2', solution: 'x - 5 = 3 or x - 5 = -3' },
        { prompt: 'Solve: |2x + 1| = 7', answer: 'x = 3 or x = -4', solution: '2x + 1 = 7 or 2x + 1 = -7' },
        { prompt: 'Solve: |x| = 0', answer: 'x = 0', solution: 'Only x = 0 has |x| = 0' },
        { prompt: 'Solve: |x + 3| = -2', answer: 'no solution', solution: 'Absolute value cannot be negative' },
        { prompt: 'Solve: |3x - 6| = 12', answer: 'x = 6 or x = -2', solution: '3x - 6 = 12 -> x = 6; 3x - 6 = -12 -> x = -2' },
      ],
    },
  },
  'intermediate': {
    'vertex-form': {
      problems: [
        { prompt: 'Identify vertex: y = (x - 3)^2 + 5', answer: '(3, 5)', solution: 'y = (x-h)^2 + k, vertex = (h, k)' },
        { prompt: 'Identify vertex: y = -2(x + 1)^2 - 4', answer: '(-1, -4)', solution: 'h = -1, k = -4' },
        { prompt: 'Write in vertex form: y = x^2 - 6x + 11', answer: 'y = (x - 3)^2 + 2', solution: 'Complete the square: (x^2 - 6x + 9) + 2' },
        { prompt: 'What is the axis of symmetry of y = 2(x - 4)^2 + 1?', answer: 'x = 4', solution: 'Axis of symmetry passes through vertex: x = h' },
        { prompt: 'Does y = 3(x - 2)^2 + 1 have a minimum or maximum?', answer: 'minimum', solution: 'a = 3 > 0, opens up, so minimum at vertex' },
      ],
    },
    'standard-form': {
      problems: [
        { prompt: 'Find vertex of y = x^2 + 8x + 12', answer: '(-4, -4)', solution: 'x = -8/2 = -4, y = 16 - 32 + 12 = -4' },
        { prompt: 'Find y-intercept of y = 2x^2 - 3x + 5', answer: '5', solution: 'Set x = 0: y = 5' },
        { prompt: 'Find axis of symmetry: y = -x^2 + 6x - 5', answer: 'x = 3', solution: 'x = -6/(2*(-1)) = 3' },
        { prompt: 'Does y = -x^2 + 4x open up or down?', answer: 'down', solution: 'a = -1 < 0, opens down' },
      ],
    },
    'factored-form': {
      problems: [
        { prompt: 'Find x-intercepts: y = (x - 2)(x + 5)', answer: 'x = 2 and x = -5', solution: 'Set each factor = 0' },
        { prompt: 'Find x-intercepts: y = 3(x - 1)(x - 4)', answer: 'x = 1 and x = 4', solution: 'Zeros at x = 1 and x = 4' },
        { prompt: 'Write in factored form: y = x^2 - 3x - 10', answer: 'y = (x - 5)(x + 2)', solution: '-5 * 2 = -10, -5 + 2 = -3' },
        { prompt: 'Find vertex from y = (x - 1)(x - 5)', answer: '(3, -4)', solution: 'x = (1+5)/2 = 3, y = (3-1)(3-5) = 2(-2) = -4' },
      ],
    },
    'end-behavior': {
      problems: [
        { prompt: 'End behavior of f(x) = 2x^3 - x as x -> +infinity?', answer: 'f(x) -> +infinity', solution: 'Odd degree, positive leading coeff: rises right' },
        { prompt: 'End behavior of f(x) = -x^4 + 3x as x -> +infinity?', answer: 'f(x) -> -infinity', solution: 'Even degree, negative leading coeff: falls both ends' },
        { prompt: 'End behavior of f(x) = x^2 - 5x as x -> -infinity?', answer: 'f(x) -> +infinity', solution: 'Even degree, positive leading coeff: rises both ends' },
        { prompt: 'Degree 5, negative leading coefficient. As x -> +infinity?', answer: 'f(x) -> -infinity', solution: 'Odd degree, negative lead: falls right' },
        { prompt: 'Degree 3, positive leading coefficient. As x -> -infinity?', answer: 'f(x) -> -infinity', solution: 'Odd degree, positive lead: falls left' },
      ],
    },
    'zeros-multiplicity': {
      problems: [
        { prompt: 'f(x) = x^2(x - 3). Find zeros and multiplicities.', answer: 'x = 0 (mult 2), x = 3 (mult 1)', solution: 'x^2 gives zero at 0 with multiplicity 2' },
        { prompt: 'At a zero with even multiplicity, the graph...', answer: 'touches and turns', solution: 'Graph touches x-axis but does not cross' },
        { prompt: 'At a zero with odd multiplicity, the graph...', answer: 'crosses', solution: 'Graph crosses the x-axis' },
        { prompt: 'f(x) = (x + 1)^3(x - 2)^2. Degree?', answer: '5', solution: '3 + 2 = 5' },
        { prompt: 'f(x) = (x - 1)(x + 4)(x - 7). How many x-intercepts?', answer: '3', solution: 'Three distinct zeros, each multiplicity 1' },
      ],
    },
    'turning-points': {
      problems: [
        { prompt: 'Maximum number of turning points for a degree 4 polynomial?', answer: '3', solution: 'At most (degree - 1) turning points' },
        { prompt: 'Maximum number of turning points for a degree 3 polynomial?', answer: '2', solution: 'At most 3 - 1 = 2' },
        { prompt: 'A polynomial has 4 turning points. Minimum possible degree?', answer: '5', solution: 'Degree >= turning points + 1' },
        { prompt: 'f(x) = x^5. How many turning points?', answer: '0', solution: 'x^5 is strictly increasing, no turns' },
      ],
    },
    'exp-growth-decay': {
      problems: [
        { prompt: 'f(x) = 100 * 1.05^x. Growth or decay?', answer: 'growth', solution: 'Base 1.05 > 1: growth' },
        { prompt: 'f(x) = 500 * 0.92^x. What percentage decay per period?', answer: '8%', solution: '1 - 0.92 = 0.08 = 8% decay' },
        { prompt: 'f(x) = 200 * 2^x. Find f(3).', answer: '1600', solution: '200 * 8 = 1600' },
        { prompt: 'f(x) = 1000 * (1/2)^x. Find f(4).', answer: '62.5', solution: '1000 * (1/16) = 62.5' },
        { prompt: 'A population doubles every 3 years from 500. Write f(t).', answer: 'f(t) = 500 * 2^(t/3)', solution: 'Doubling: base 2, period 3' },
      ],
    },
    'log-basics': {
      problems: [
        { prompt: 'Evaluate log_2(32)', answer: '5', solution: '2^5 = 32' },
        { prompt: 'Evaluate log_10(0.01)', answer: '-2', solution: '10^(-2) = 0.01' },
        { prompt: 'Rewrite: 3^4 = 81 in log form', answer: 'log_3(81) = 4', solution: 'Exponent becomes log value' },
        { prompt: 'What is the domain of f(x) = log(x + 5)?', answer: 'x > -5', solution: 'Argument must be positive: x + 5 > 0' },
        { prompt: 'Evaluate ln(1)', answer: '0', solution: 'e^0 = 1, so ln(1) = 0' },
      ],
    },
    'exp-vs-linear': {
      problems: [
        { prompt: 'f(x) = 3x + 10 and g(x) = 2^x. Which is larger at x = 20?', answer: 'g(x)', solution: 'g(20) = 1048576 vs f(20) = 70' },
        { prompt: 'Linear has constant __; exponential has constant __', answer: 'rate of change; ratio', solution: 'Linear: additive change; Exponential: multiplicative change' },
        { prompt: 'Table: x=0,1,2,3 y=5,10,20,40. Linear or exponential?', answer: 'exponential', solution: 'Constant ratio of 2 between consecutive terms' },
        { prompt: 'Table: x=0,1,2,3 y=3,7,11,15. Linear or exponential?', answer: 'linear', solution: 'Constant difference of 4' },
      ],
    },
    'vertical-horizontal-shifts': {
      problems: [
        { prompt: 'f(x) = x^2. Write g(x) shifted right 3, up 2.', answer: 'g(x) = (x - 3)^2 + 2', solution: 'Right h: (x-h); up k: +k' },
        { prompt: 'How does f(x) = (x + 4)^2 compare to f(x) = x^2?', answer: 'shifted left 4', solution: 'x + 4 = x - (-4): shift left 4' },
        { prompt: 'f(x) = sqrt(x). Write g(x) shifted left 2, down 5.', answer: 'g(x) = sqrt(x + 2) - 5', solution: 'Left 2: x + 2; down 5: - 5' },
        { prompt: 'The graph of y = |x| + 3 is the graph of y = |x| shifted...', answer: 'up 3', solution: 'Adding 3 outside shifts up 3' },
      ],
    },
    'stretches-compressions': {
      problems: [
        { prompt: 'f(x) = x^2. Write g(x) vertically stretched by factor 3.', answer: 'g(x) = 3x^2', solution: 'Multiply outside: 3 * f(x)' },
        { prompt: 'Describe: g(x) = (1/2)|x| compared to f(x) = |x|', answer: 'vertical compression by 1/2', solution: 'Multiplied by 1/2 outside' },
        { prompt: 'f(x) = x^2. Write g(x) horizontally compressed by factor 2.', answer: 'g(x) = (2x)^2 = 4x^2', solution: 'Replace x with 2x for horizontal compression' },
        { prompt: 'The graph of y = 5*sqrt(x) is __ compared to y = sqrt(x)', answer: 'vertically stretched by 5', solution: 'Factor of 5 multiplied outside' },
      ],
    },
    'reflections': {
      problems: [
        { prompt: 'Reflect f(x) = x^2 over the x-axis. Write g(x).', answer: 'g(x) = -x^2', solution: 'x-axis reflection: -f(x)' },
        { prompt: 'Reflect f(x) = sqrt(x) over the y-axis. Write g(x).', answer: 'g(x) = sqrt(-x)', solution: 'y-axis reflection: f(-x)' },
        { prompt: 'g(x) = -|x + 2| + 3. Describe transformations of f(x) = |x|.', answer: 'left 2, reflect over x-axis, up 3', solution: 'Inside +2: left 2; negative: reflect x-axis; +3: up 3' },
        { prompt: 'f(x) = 2^x. Write g(x) reflected over x-axis.', answer: 'g(x) = -2^x', solution: 'Negate the output: -f(x)' },
      ],
    },
  },
  'advanced': {
    'asymptotes': {
      problems: [
        { prompt: 'Find vertical asymptote: f(x) = 1/(x - 4)', answer: 'x = 4', solution: 'Denominator = 0 at x = 4' },
        { prompt: 'Find horizontal asymptote: f(x) = (3x + 1)/(x - 2)', answer: 'y = 3', solution: 'Same degree: ratio of leading coefficients = 3/1' },
        { prompt: 'Find horizontal asymptote: f(x) = 5/(x^2 + 1)', answer: 'y = 0', solution: 'Degree numerator < degree denominator: y = 0' },
        { prompt: 'Does f(x) = (x^2 + 1)/(x - 1) have a horizontal asymptote?', answer: 'no, it has an oblique asymptote', solution: 'Degree numerator > degree denominator by 1: slant asymptote' },
        { prompt: 'Find vertical asymptotes: f(x) = x/((x-1)(x+3))', answer: 'x = 1 and x = -3', solution: 'Denominator = 0 at x = 1 and x = -3' },
      ],
    },
    'holes-domain': {
      problems: [
        { prompt: 'f(x) = (x^2-4)/(x-2). Hole or asymptote at x=2?', answer: 'hole at x = 2', solution: '(x-2)(x+2)/(x-2) cancels; hole at (2, 4)' },
        { prompt: 'f(x) = (x+1)/((x+1)(x-3)). Find the hole.', answer: 'x = -1', solution: '(x+1) cancels; hole at x = -1' },
        { prompt: 'Find domain: f(x) = (x-5)/((x-2)(x+4))', answer: 'all reals except x = 2 and x = -4', solution: 'Exclude where denominator = 0' },
        { prompt: 'f(x) = (x^2-1)/(x-1). What is f(x) simplified (x != 1)?', answer: 'x + 1', solution: '(x-1)(x+1)/(x-1) = x + 1 with hole at x = 1' },
      ],
    },
    'graphing-rational': {
      problems: [
        { prompt: 'f(x) = 1/x. What are the asymptotes?', answer: 'x = 0 (vertical), y = 0 (horizontal)', solution: 'Parent rational function' },
        { prompt: 'f(x) = 2/(x-1) + 3. Vertical asymptote?', answer: 'x = 1', solution: 'Shifted right 1 from 1/x' },
        { prompt: 'f(x) = 2/(x-1) + 3. Horizontal asymptote?', answer: 'y = 3', solution: 'Shifted up 3' },
        { prompt: 'f(x) = (x+2)/(x-3). Find the x-intercept.', answer: '(-2, 0)', solution: 'Numerator = 0: x + 2 = 0, x = -2' },
      ],
    },
    'compose-functions': {
      problems: [
        { prompt: 'f(x) = 2x + 1, g(x) = x^2. Find f(g(3)).', answer: '19', solution: 'g(3) = 9; f(9) = 2(9) + 1 = 19' },
        { prompt: 'f(x) = x - 3, g(x) = 4x. Find g(f(5)).', answer: '8', solution: 'f(5) = 2; g(2) = 8' },
        { prompt: 'f(x) = sqrt(x), g(x) = x + 9. Find f(g(7)).', answer: '4', solution: 'g(7) = 16; f(16) = 4' },
        { prompt: 'f(x) = 2x, g(x) = x + 3. Write (f o g)(x).', answer: '2(x + 3) = 2x + 6', solution: 'f(g(x)) = f(x + 3) = 2(x + 3)' },
        { prompt: 'f(x) = x^2, g(x) = x - 1. Find (g o f)(4).', answer: '15', solution: 'f(4) = 16; g(16) = 15' },
      ],
    },
    'decompose-functions': {
      problems: [
        { prompt: 'h(x) = (2x + 1)^3. Express as f(g(x)). What are f and g?', answer: 'f(x) = x^3, g(x) = 2x + 1', solution: 'Outer function cubes, inner is linear' },
        { prompt: 'h(x) = sqrt(x - 5). Express as f(g(x)).', answer: 'f(x) = sqrt(x), g(x) = x - 5', solution: 'Outer is sqrt, inner subtracts 5' },
        { prompt: 'h(x) = 1/(x^2 + 1). Express as f(g(x)).', answer: 'f(x) = 1/x, g(x) = x^2 + 1', solution: 'Outer is reciprocal, inner is quadratic' },
      ],
    },
    'find-inverse': {
      problems: [
        { prompt: 'Find inverse of f(x) = 3x + 2', answer: 'f^(-1)(x) = (x - 2)/3', solution: 'y = 3x + 2; x = 3y + 2; y = (x-2)/3' },
        { prompt: 'Find inverse of f(x) = (x - 5)/4', answer: 'f^(-1)(x) = 4x + 5', solution: 'y = (x-5)/4; 4y = x - 5; x = 4y + 5' },
        { prompt: 'Find inverse of f(x) = x^3', answer: 'f^(-1)(x) = cbrt(x)', solution: 'y = x^3; x = y^3; y = cbrt(x)' },
        { prompt: 'Find inverse of f(x) = 2^x', answer: 'f^(-1)(x) = log_2(x)', solution: 'y = 2^x; x = 2^y; y = log_2(x)' },
        { prompt: 'Find inverse of f(x) = 5x - 10', answer: 'f^(-1)(x) = (x + 10)/5', solution: 'Swap and solve: x = 5y - 10, y = (x+10)/5' },
      ],
    },
    'verify-inverse': {
      problems: [
        { prompt: 'Verify: f(x) = 2x + 3, g(x) = (x-3)/2. Is f(g(x)) = x?', answer: 'yes', solution: 'f(g(x)) = 2((x-3)/2) + 3 = (x-3) + 3 = x' },
        { prompt: 'f(x) = x^2, g(x) = sqrt(x). Is g the inverse of f?', answer: 'only for x >= 0', solution: 'f must be restricted to x >= 0 to be one-to-one' },
        { prompt: 'If f(f^(-1)(7)) = ?', answer: '7', solution: 'By definition, f(f^(-1)(x)) = x for all x in range of f' },
        { prompt: 'f(x) = 3x - 6. Find f^(-1)(f(4)).', answer: '4', solution: 'f^(-1)(f(x)) = x, so answer is 4' },
      ],
    },
    'restrict-domain': {
      problems: [
        { prompt: 'f(x) = x^2. Restrict domain so f has an inverse. Common choice?', answer: 'x >= 0', solution: 'Restricting to x >= 0 makes f one-to-one; inverse is sqrt(x)' },
        { prompt: 'f(x) = (x-3)^2 + 1. Restrict domain for inverse. Common choice?', answer: 'x >= 3', solution: 'Vertex at x = 3; restrict to right half' },
        { prompt: 'Why does f(x) = x^2 not have an inverse on all reals?', answer: 'it is not one-to-one', solution: 'f(-2) = f(2) = 4; fails horizontal line test' },
      ],
    },
    'choose-model': {
      problems: [
        { prompt: 'Population doubles every 10 years. Which model?', answer: 'exponential', solution: 'Constant multiplicative change = exponential' },
        { prompt: 'Car travels 60 mph. Distance over time model?', answer: 'linear', solution: 'Constant rate of change = linear' },
        { prompt: 'Height of projectile over time. Which model?', answer: 'quadratic', solution: 'Gravity creates parabolic path' },
        { prompt: 'Temperature oscillates between day and night. Which model?', answer: 'trigonometric (sinusoidal)', solution: 'Periodic behavior = trig' },
      ],
    },
    'interpret-parameters': {
      problems: [
        { prompt: 'f(t) = 50 * 1.03^t models a population. What does 50 represent?', answer: 'initial population', solution: 'f(0) = 50: the starting value' },
        { prompt: 'f(t) = 50 * 1.03^t. What does 1.03 represent?', answer: '3% growth per period', solution: '1 + 0.03: base > 1 means growth' },
        { prompt: 'f(x) = 2x + 150 models cost. What does 2 represent?', answer: 'cost per unit (rate of change)', solution: 'Slope = rate of change' },
        { prompt: 'f(x) = -4.9t^2 + 20t + 1. What does -4.9 represent?', answer: 'effect of gravity (m/s^2)', solution: 'Coefficient of t^2 from gravity: -(1/2)(9.8)' },
      ],
    },
    'compare-models': {
      problems: [
        { prompt: 'Linear: f(x) = 100 + 10x. Exponential: g(x) = 100 * 1.1^x. Which is larger at x = 50?', answer: 'g(x)', solution: 'g(50) = 100 * 1.1^50 = 11739 vs f(50) = 600' },
        { prompt: 'Which grows faster eventually: linear or exponential?', answer: 'exponential', solution: 'Exponential growth always overtakes linear' },
        { prompt: 'Data: (0,2), (1,6), (2,18), (3,54). Best model?', answer: 'exponential', solution: 'Constant ratio of 3: geometric growth' },
        { prompt: 'Data: (0,5), (1,8), (2,11), (3,14). Best model?', answer: 'linear', solution: 'Constant difference of 3: arithmetic growth' },
      ],
    },
  },
};

// File I/O

function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }
function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }

function loadProfile(id) {
  const fp = profilePath(id);
  if (fs.existsSync(fp)) { try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); } }
  return { studentId: id, level: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
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
function norm(s) { return String(s).toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^a-z0-9 +\-*/^().=<>!,]/g, ''); }

function generateExercise(level, skill, count = 5) {
  const bank = PROBLEM_BANKS[level]?.[skill];
  if (!bank) return { error: `No problem bank for ${level}/${skill}` };
  const items = pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer, solution: p.solution, type: 'functions' }));
  return { type: 'functions', skill, level, count: items.length, instruction: 'Solve each problem.', items };
}

function checkAnswer(type, expected, answer) { return { correct: norm(expected) === norm(answer), expected, studentAnswer: answer }; }

class HSFunctions {
  getProfile(id) { const p = loadProfile(id); return { studentId: p.studentId, level: p.level, createdAt: p.createdAt, totalAssessments: p.assessments.length }; }
  setLevel(id, level) { if (!SKILLS[level]) throw new Error(`Unknown level: ${level}. Valid: ${Object.keys(SKILLS).join(', ')}`); const p = loadProfile(id); p.level = level; saveProfile(p); return { studentId: id, level }; }

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
    const p = loadProfile(id); const level = p.level || 'intro'; const gs = SKILLS[level] || {};
    const results = {}; let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(gs)) { results[cat] = {}; for (const sk of skills) { total++; const d = p.skills[`${level}/${cat}/${sk}`]; results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' }; if (d && d.mastery >= MASTERY_THRESHOLD) mastered++; } }
    return { studentId: id, level, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id); const level = p.level || 'intro'; const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS[level] || {})) { for (const sk of skills) { const d = p.skills[`${level}/${cat}/${sk}`]; const m = d ? d.mastery : 0; if (m < MASTERY_THRESHOLD) candidates.push({ level, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' }); } }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, level, next: candidates.slice(0, count) };
  }

  getReport(id) { const p = loadProfile(id); return { studentId: id, level: p.level, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }
  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }
  getSkillCatalog(level) { const gs = SKILLS[level]; if (!gs) return { level, error: `Unknown level. Valid: ${Object.keys(SKILLS).join(', ')}` }; let total = 0; const catalog = {}; for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; } return { level, skills: catalog, totalSkills: total }; }
  generateExercise(level, skill, count = 5) { return generateExercise(level, skill, count); }
  checkAnswer(type, expected, answer) { return checkAnswer(type, expected, answer); }

  generateLesson(id) {
    const p = loadProfile(id); const level = p.level || 'intro';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient!`, level };
    const exercise = generateExercise(level, target.skill, 5);
    return { studentId: id, level, targetSkill: target, exercise, lessonPlan: { review: 'Review prerequisite concepts (3-5 min)', teach: `Introduce/reinforce: ${target.category} > ${target.skill}`, practice: `Complete ${exercise.count || 0} practice items`, reflect: 'Connect to other function families and representations' } };
  }
}

module.exports = HSFunctions;

if (require.main === module) {
  const args = process.argv.slice(2); const cmd = args[0]; const api = new HSFunctions(); const out = d => console.log(JSON.stringify(d, null, 2));
  try {
    switch (cmd) {
      case 'start': { const [, id, level] = args; if (!id) throw new Error('Usage: start <id> [level]'); if (level) api.setLevel(id, level); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const level = loadProfile(id).level || 'intro'; if (skill) { out(api.generateExercise(level, skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); out(api.checkAnswer(type, expected, answer)); break; }
      case 'record': { const [, id, level, cat, skill, sc, tot, ...notes] = args; if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total>'); out(api.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? api.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(api.setLevel(id, l)); break; }
      default: out({ usage: 'node functions.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
