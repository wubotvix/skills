// eClaw HS Math Precalculus Interactive Tutor (Grades 11-12). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-math-precalculus');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'functions-deep': {
    'polynomial-analysis': ['polynomial-zeros', 'end-behavior', 'factor-theorem', 'remainder-theorem', 'complex-zeros'],
    'rational-functions': ['domain-restrictions', 'vertical-asymptotes', 'horizontal-asymptotes', 'oblique-asymptotes', 'graphing-rationals'],
    'exponential-log-depth': ['exp-equations', 'log-equations', 'exp-log-applications', 'natural-log', 'change-of-base'],
    'function-composition': ['compose-functions', 'decompose-functions', 'inverse-functions', 'verifying-inverses', 'domain-of-composition'],
  },
  'conics-series': {
    'conic-sections': ['circles', 'ellipses', 'parabolas', 'hyperbolas', 'conic-identification'],
    'sequences': ['arithmetic-sequences', 'geometric-sequences', 'recursive-formulas', 'explicit-formulas', 'sequence-convergence'],
    'series': ['arithmetic-series', 'geometric-series', 'partial-sums', 'infinite-geometric-series', 'sigma-notation'],
  },
  'calc-preview': {
    'limits-intro': ['limit-concept', 'limit-tables', 'limit-graphs', 'one-sided-limits', 'limits-at-infinity'],
    'continuity': ['continuity-definition', 'removable-discontinuity', 'jump-discontinuity', 'infinite-discontinuity', 'intermediate-value-theorem'],
    'polar-parametric': ['polar-coordinates', 'polar-graphs', 'parametric-equations', 'parametric-graphs', 'converting-systems'],
    'rates-of-change': ['average-rate-of-change', 'instantaneous-rate-concept', 'secant-to-tangent', 'velocity-acceleration', 'rate-applications'],
  },
};

const PROBLEM_BANKS = {
  'functions-deep': {
    'polynomial-zeros': {
      problems: [
        { prompt: 'Find all zeros of f(x) = x^3 - 6x^2 + 11x - 6', answer: '1, 2, 3', hint: 'Try the Rational Root Theorem: possible rational zeros are factors of 6.' },
        { prompt: 'Find all zeros of f(x) = x^3 - 3x^2 - 4x + 12', answer: '2, -2, 3', hint: 'Factor by grouping: x^2(x-3) - 4(x-3).' },
        { prompt: 'Find all zeros of f(x) = x^4 - 5x^2 + 4', answer: '1, -1, 2, -2', hint: 'Substitute u = x^2 to get u^2 - 5u + 4.' },
        { prompt: 'Find all zeros of f(x) = 2x^3 - x^2 - 8x + 4', answer: '1/2, 2, -2', hint: 'Possible rational zeros: ±1, ±2, ±4, ±1/2.' },
        { prompt: 'Find all zeros of f(x) = x^3 + 2x^2 - 5x - 6', answer: '-1, 2, -3', hint: 'Test x = -1 first.' },
        { prompt: 'Find all zeros of f(x) = x^3 - 7x + 6', answer: '1, 2, -3', hint: 'Test small integers as possible zeros.' },
        { prompt: 'Find all zeros of f(x) = x^4 - 10x^2 + 9', answer: '1, -1, 3, -3', hint: 'This is a quadratic in x^2.' },
        { prompt: 'Find all zeros of f(x) = x^3 - x', answer: '0, 1, -1', hint: 'Factor out x first.' },
      ],
    },
    'end-behavior': {
      problems: [
        { prompt: 'Describe the end behavior of f(x) = 3x^4 - 2x + 1', answer: 'up-up', hint: 'Even degree, positive leading coefficient.' },
        { prompt: 'Describe the end behavior of f(x) = -2x^3 + x^2 - 5', answer: 'up-down', hint: 'Odd degree, negative leading coefficient.' },
        { prompt: 'Describe the end behavior of f(x) = x^5 - 3x^3 + x', answer: 'down-up', hint: 'Odd degree, positive leading coefficient.' },
        { prompt: 'Describe the end behavior of f(x) = -x^6 + 4x^2', answer: 'down-down', hint: 'Even degree, negative leading coefficient.' },
        { prompt: 'Describe the end behavior of f(x) = 5x^3 + 2x', answer: 'down-up', hint: 'Odd degree, positive leading coefficient.' },
        { prompt: 'Describe the end behavior of f(x) = -4x^4 + x^3 - 1', answer: 'down-down', hint: 'Even degree, negative leading coefficient.' },
        { prompt: 'Describe the end behavior of f(x) = 2x^5 - x^4 + 3', answer: 'down-up', hint: 'Odd degree, positive leading coefficient.' },
        { prompt: 'Describe the end behavior of f(x) = -x^7 + 6x', answer: 'up-down', hint: 'Odd degree, negative leading coefficient.' },
      ],
    },
    'factor-theorem': {
      problems: [
        { prompt: 'Is (x - 2) a factor of x^3 - 3x^2 + 4? Evaluate f(2).', answer: '0', hint: 'f(2) = 8 - 12 + 4 = 0, so yes.' },
        { prompt: 'Is (x + 1) a factor of x^3 + 2x^2 - x - 2? Evaluate f(-1).', answer: '0', hint: 'f(-1) = -1 + 2 + 1 - 2 = 0.' },
        { prompt: 'Is (x - 3) a factor of x^3 - 27? Evaluate f(3).', answer: '0', hint: 'f(3) = 27 - 27 = 0.' },
        { prompt: 'Is (x - 1) a factor of x^4 - 1? Evaluate f(1).', answer: '0', hint: 'f(1) = 1 - 1 = 0.' },
        { prompt: 'Is (x + 2) a factor of x^3 + 8? Evaluate f(-2).', answer: '0', hint: 'f(-2) = -8 + 8 = 0.' },
        { prompt: 'Is (x - 2) a factor of x^3 - 5x + 3? Evaluate f(2).', answer: '1', hint: 'f(2) = 8 - 10 + 3 = 1, so no.' },
      ],
    },
    'remainder-theorem': {
      problems: [
        { prompt: 'Find the remainder when x^3 + 2x^2 - 5x + 1 is divided by (x - 1).', answer: '-1', hint: 'Evaluate f(1) = 1 + 2 - 5 + 1.' },
        { prompt: 'Find the remainder when 2x^3 - x^2 + 3x - 4 is divided by (x - 2).', answer: '14', hint: 'Evaluate f(2) = 16 - 4 + 6 - 4.' },
        { prompt: 'Find the remainder when x^4 - 3x^2 + 2 is divided by (x + 1).', answer: '0', hint: 'Evaluate f(-1) = 1 - 3 + 2.' },
        { prompt: 'Find the remainder when x^3 - 4x + 6 is divided by (x - 3).', answer: '21', hint: 'Evaluate f(3) = 27 - 12 + 6.' },
        { prompt: 'Find the remainder when 3x^2 + 5x - 2 is divided by (x + 2).', answer: '0', hint: 'Evaluate f(-2) = 12 - 10 - 2.' },
      ],
    },
    'complex-zeros': {
      problems: [
        { prompt: 'Find all zeros (including complex) of f(x) = x^2 + 4', answer: '2i, -2i', hint: 'x^2 = -4, so x = ±2i.' },
        { prompt: 'Find all zeros of f(x) = x^2 + 2x + 5', answer: '-1+2i, -1-2i', hint: 'Use the quadratic formula: discriminant = 4 - 20 = -16.' },
        { prompt: 'Find all zeros of f(x) = x^3 - x^2 + x - 1', answer: '1, i, -i', hint: 'Factor by grouping: x^2(x-1) + (x-1).' },
        { prompt: 'Find all zeros of f(x) = x^2 + 9', answer: '3i, -3i', hint: 'x^2 = -9.' },
        { prompt: 'Find all zeros of f(x) = x^4 + 4', answer: '1+i, 1-i, -1+i, -1-i', hint: 'Factor as (x^2 + 2x + 2)(x^2 - 2x + 2).' },
        { prompt: 'Find all zeros of f(x) = x^2 - 6x + 13', answer: '3+2i, 3-2i', hint: 'Discriminant = 36 - 52 = -16.' },
      ],
    },
    'domain-restrictions': {
      problems: [
        { prompt: 'Find the domain of f(x) = 1/(x - 3)', answer: 'x != 3', hint: 'Denominator cannot be zero.' },
        { prompt: 'Find the domain of f(x) = 1/(x^2 - 4)', answer: 'x != 2, x != -2', hint: 'x^2 - 4 = (x-2)(x+2) cannot be zero.' },
        { prompt: 'Find the domain of f(x) = (x + 1)/(x^2 - x - 6)', answer: 'x != 3, x != -2', hint: 'Factor denominator: (x-3)(x+2).' },
        { prompt: 'Find the domain of f(x) = x/(x^2 + 1)', answer: 'all real numbers', hint: 'x^2 + 1 is always positive.' },
        { prompt: 'Find the domain of f(x) = (x - 5)/(x^2 - 25)', answer: 'x != 5, x != -5', hint: 'x^2 - 25 = (x-5)(x+5).' },
        { prompt: 'Find the domain of f(x) = 3/(x^2 - 9)', answer: 'x != 3, x != -3', hint: 'x^2 - 9 = (x-3)(x+3).' },
      ],
    },
    'vertical-asymptotes': {
      problems: [
        { prompt: 'Find the vertical asymptote(s) of f(x) = 1/(x - 5)', answer: 'x = 5', hint: 'Set denominator equal to zero.' },
        { prompt: 'Find the vertical asymptote(s) of f(x) = (x+1)/(x^2 - 4)', answer: 'x = 2, x = -2', hint: 'Factor: (x+1)/((x-2)(x+2)).' },
        { prompt: 'Find the vertical asymptote(s) of f(x) = (x-3)/(x^2-9)', answer: 'x = -3', hint: '(x-3)/((x-3)(x+3)) simplifies; x=3 is a hole, not an asymptote.' },
        { prompt: 'Find the vertical asymptote(s) of f(x) = 2x/(x^2 + x - 6)', answer: 'x = 2, x = -3', hint: 'Factor denominator: (x+3)(x-2).' },
        { prompt: 'Find the vertical asymptote(s) of f(x) = 1/(x^2 + 1)', answer: 'none', hint: 'x^2 + 1 > 0 for all real x.' },
      ],
    },
    'horizontal-asymptotes': {
      problems: [
        { prompt: 'Find the horizontal asymptote of f(x) = (3x + 1)/(x - 2)', answer: 'y = 3', hint: 'Degree same: ratio of leading coefficients.' },
        { prompt: 'Find the horizontal asymptote of f(x) = 5/(x^2 + 1)', answer: 'y = 0', hint: 'Degree of numerator < degree of denominator.' },
        { prompt: 'Find the horizontal asymptote of f(x) = (2x^2 + 1)/(x^2 - 4)', answer: 'y = 2', hint: 'Same degree: 2/1 = 2.' },
        { prompt: 'Find the horizontal asymptote of f(x) = (x^3 + 1)/(x^2 - 1)', answer: 'none', hint: 'Degree of numerator > degree of denominator.' },
        { prompt: 'Find the horizontal asymptote of f(x) = (4x - 1)/(2x + 3)', answer: 'y = 2', hint: 'Same degree: 4/2 = 2.' },
      ],
    },
    'oblique-asymptotes': {
      problems: [
        { prompt: 'Find the oblique asymptote of f(x) = (x^2 + 3x + 1)/(x + 1)', answer: 'y = x + 2', hint: 'Perform polynomial long division.' },
        { prompt: 'Find the oblique asymptote of f(x) = (2x^2 - x + 3)/(x - 1)', answer: 'y = 2x + 1', hint: 'Divide 2x^2 - x + 3 by x - 1.' },
        { prompt: 'Find the oblique asymptote of f(x) = (x^2 - 4)/(x + 1)', answer: 'y = x - 1', hint: 'Divide x^2 - 4 by x + 1.' },
        { prompt: 'Find the oblique asymptote of f(x) = (x^2 + 2x + 5)/(x - 2)', answer: 'y = x + 4', hint: 'Perform the division.' },
        { prompt: 'Find the oblique asymptote of f(x) = (3x^2 + x - 2)/(x + 2)', answer: 'y = 3x - 5', hint: 'Divide 3x^2 + x - 2 by x + 2.' },
      ],
    },
    'graphing-rationals': {
      problems: [
        { prompt: 'For f(x) = (x-1)/(x+2): find x-intercept, y-intercept, VA, HA.', answer: 'x-int: 1, y-int: -1/2, VA: x=-2, HA: y=1', hint: 'x-int: set numerator=0. y-int: f(0). VA: denom=0. HA: leading coeff ratio.' },
        { prompt: 'For f(x) = 2x/(x^2-1): find x-intercept, VA, HA.', answer: 'x-int: 0, VA: x=1 and x=-1, HA: y=0', hint: 'Factor denominator: (x-1)(x+1).' },
        { prompt: 'For f(x) = (x^2-4)/(x-2): identify the hole and simplified form.', answer: 'hole at x=2, simplified: x+2', hint: 'Factor numerator: (x-2)(x+2).' },
        { prompt: 'For f(x) = 3/(x-4): find y-intercept, VA, HA.', answer: 'y-int: -3/4, VA: x=4, HA: y=0', hint: 'f(0) = 3/(0-4) = -3/4.' },
        { prompt: 'For f(x) = (x+3)/(x^2-9): simplify and find the hole.', answer: 'hole at x=-3, simplified: 1/(x-3)', hint: 'x^2-9 = (x+3)(x-3).' },
      ],
    },
    'exp-equations': {
      problems: [
        { prompt: 'Solve: 2^x = 32', answer: '5', hint: '32 = 2^5.' },
        { prompt: 'Solve: 3^(2x) = 81', answer: '2', hint: '81 = 3^4, so 2x = 4.' },
        { prompt: 'Solve: 5^x = 125', answer: '3', hint: '125 = 5^3.' },
        { prompt: 'Solve: 4^x = 1/16', answer: '-2', hint: '1/16 = 4^(-2).' },
        { prompt: 'Solve: 2^(x+1) = 16', answer: '3', hint: '16 = 2^4, so x+1 = 4.' },
        { prompt: 'Solve: 9^x = 27', answer: '3/2', hint: '9 = 3^2 and 27 = 3^3, so 3^(2x) = 3^3.' },
      ],
    },
    'log-equations': {
      problems: [
        { prompt: 'Solve: log_2(x) = 5', answer: '32', hint: 'x = 2^5.' },
        { prompt: 'Solve: log_3(x) = 4', answer: '81', hint: 'x = 3^4.' },
        { prompt: 'Solve: log(x) + log(x-3) = 1 (base 10)', answer: '5', hint: 'log(x(x-3)) = 1, so x^2 - 3x = 10.' },
        { prompt: 'Solve: ln(x) = 0', answer: '1', hint: 'e^0 = 1.' },
        { prompt: 'Solve: log_5(x+1) = 2', answer: '24', hint: 'x + 1 = 25.' },
        { prompt: 'Solve: 2 log(x) = log(36)', answer: '6', hint: 'log(x^2) = log(36).' },
      ],
    },
    'exp-log-applications': {
      problems: [
        { prompt: 'A population doubles every 5 years. If P_0 = 100, find P after 15 years.', answer: '800', hint: 'P = 100 * 2^(15/5) = 100 * 8.' },
        { prompt: 'Half-life of a substance is 10 years. What fraction remains after 30 years?', answer: '1/8', hint: '(1/2)^(30/10) = (1/2)^3.' },
        { prompt: 'If A = 1000e^(0.05t), find t when A = 2000. Round to 1 decimal.', answer: '13.9', hint: 'e^(0.05t) = 2, so t = ln(2)/0.05.' },
        { prompt: 'An earthquake has intensity I = 10^6. Find its Richter magnitude M = log(I).', answer: '6', hint: 'log(10^6) = 6.' },
        { prompt: 'A bacteria colony triples every 4 hours. Starting with 500, how many after 12 hours?', answer: '13500', hint: '500 * 3^(12/4) = 500 * 27.' },
      ],
    },
    'natural-log': {
      problems: [
        { prompt: 'Simplify: ln(e^5)', answer: '5', hint: 'ln and e are inverse functions.' },
        { prompt: 'Simplify: e^(ln 7)', answer: '7', hint: 'e^(ln x) = x.' },
        { prompt: 'Solve: e^(2x) = 10. Give exact answer.', answer: 'ln(10)/2', hint: 'Take ln of both sides: 2x = ln(10).' },
        { prompt: 'Simplify: ln(1)', answer: '0', hint: 'e^0 = 1.' },
        { prompt: 'Simplify: ln(e) + ln(e^2)', answer: '3', hint: '1 + 2 = 3.' },
        { prompt: 'Solve: ln(x) + ln(x+2) = ln(8)', answer: '2', hint: 'ln(x(x+2)) = ln(8), so x^2 + 2x - 8 = 0.' },
      ],
    },
    'change-of-base': {
      problems: [
        { prompt: 'Evaluate log_2(10) using change of base. Round to 3 decimals.', answer: '3.322', hint: 'log_2(10) = ln(10)/ln(2).' },
        { prompt: 'Evaluate log_5(20) using change of base. Round to 3 decimals.', answer: '1.861', hint: 'log_5(20) = log(20)/log(5).' },
        { prompt: 'Rewrite log_3(7) using natural log.', answer: 'ln(7)/ln(3)', hint: 'Change of base formula: log_b(a) = ln(a)/ln(b).' },
        { prompt: 'Evaluate log_4(64) using change of base.', answer: '3', hint: 'log(64)/log(4) = log(4^3)/log(4) = 3.' },
        { prompt: 'Rewrite log_8(5) using log base 10.', answer: 'log(5)/log(8)', hint: 'Apply change of base formula directly.' },
      ],
    },
    'compose-functions': {
      problems: [
        { prompt: 'If f(x) = 2x + 1 and g(x) = x^2, find (f∘g)(3).', answer: '19', hint: 'g(3) = 9, f(9) = 19.' },
        { prompt: 'If f(x) = x - 4 and g(x) = 3x, find (g∘f)(5).', answer: '3', hint: 'f(5) = 1, g(1) = 3.' },
        { prompt: 'If f(x) = x^2 and g(x) = x + 3, find (f∘g)(x).', answer: '(x+3)^2', hint: 'f(g(x)) = f(x+3) = (x+3)^2.' },
        { prompt: 'If f(x) = sqrt(x) and g(x) = x + 9, find (f∘g)(7).', answer: '4', hint: 'g(7) = 16, f(16) = 4.' },
        { prompt: 'If f(x) = 1/x and g(x) = x - 2, find (f∘g)(5).', answer: '1/3', hint: 'g(5) = 3, f(3) = 1/3.' },
      ],
    },
    'decompose-functions': {
      problems: [
        { prompt: 'Express h(x) = (2x + 1)^3 as f(g(x)). Find f and g.', answer: 'f(x) = x^3, g(x) = 2x+1', hint: 'The outer function is cubing, the inner is 2x+1.' },
        { prompt: 'Express h(x) = sqrt(x^2 + 4) as f(g(x)). Find f and g.', answer: 'f(x) = sqrt(x), g(x) = x^2+4', hint: 'Outer: square root. Inner: x^2 + 4.' },
        { prompt: 'Express h(x) = 1/(x - 5) as f(g(x)). Find f and g.', answer: 'f(x) = 1/x, g(x) = x-5', hint: 'Outer: reciprocal. Inner: x - 5.' },
        { prompt: 'Express h(x) = |3x - 7| as f(g(x)). Find f and g.', answer: 'f(x) = |x|, g(x) = 3x-7', hint: 'Outer: absolute value. Inner: 3x - 7.' },
        { prompt: 'Express h(x) = e^(x^2) as f(g(x)). Find f and g.', answer: 'f(x) = e^x, g(x) = x^2', hint: 'Outer: e^x. Inner: x^2.' },
      ],
    },
    'inverse-functions': {
      problems: [
        { prompt: 'Find the inverse of f(x) = 3x - 7.', answer: 'f^(-1)(x) = (x+7)/3', hint: 'Swap x and y: x = 3y - 7, solve for y.' },
        { prompt: 'Find the inverse of f(x) = (x + 2)/5.', answer: 'f^(-1)(x) = 5x - 2', hint: 'x = (y+2)/5, so y = 5x - 2.' },
        { prompt: 'Find the inverse of f(x) = x^3 + 1.', answer: 'f^(-1)(x) = (x-1)^(1/3)', hint: 'x = y^3 + 1, so y = cube root of (x-1).' },
        { prompt: 'Find the inverse of f(x) = 2^x.', answer: 'f^(-1)(x) = log_2(x)', hint: 'The inverse of an exponential is a logarithm.' },
        { prompt: 'Find the inverse of f(x) = (2x+1)/(x-3).', answer: 'f^(-1)(x) = (3x+1)/(x-2)', hint: 'Cross multiply: x(y-3) = 2y+1, then solve for y.' },
      ],
    },
    'verifying-inverses': {
      problems: [
        { prompt: 'Verify: are f(x) = 2x + 3 and g(x) = (x-3)/2 inverses? Compute f(g(x)).', answer: 'x', hint: 'f(g(x)) = 2((x-3)/2) + 3 = x - 3 + 3 = x.' },
        { prompt: 'Verify: are f(x) = x^3 and g(x) = x^(1/3) inverses? Compute g(f(x)).', answer: 'x', hint: 'g(f(x)) = (x^3)^(1/3) = x.' },
        { prompt: 'Are f(x) = 3x - 1 and g(x) = (x+1)/3 inverses? Compute f(g(x)).', answer: 'x', hint: 'f((x+1)/3) = 3(x+1)/3 - 1 = x + 1 - 1 = x.' },
        { prompt: 'Are f(x) = x + 5 and g(x) = x + 5 inverses? Compute f(g(x)).', answer: 'x + 10', hint: 'f(g(x)) = (x+5) + 5 = x + 10 ≠ x. Not inverses.' },
        { prompt: 'Are f(x) = e^x and g(x) = ln(x) inverses? Compute f(g(x)).', answer: 'x', hint: 'e^(ln(x)) = x for x > 0.' },
      ],
    },
    'domain-of-composition': {
      problems: [
        { prompt: 'If f(x) = 1/x and g(x) = x - 2, find the domain of (f∘g)(x).', answer: 'x != 2', hint: 'g(x) cannot equal 0, so x - 2 ≠ 0.' },
        { prompt: 'If f(x) = sqrt(x) and g(x) = x - 5, find the domain of (f∘g)(x).', answer: 'x >= 5', hint: 'g(x) must be ≥ 0, so x - 5 ≥ 0.' },
        { prompt: 'If f(x) = ln(x) and g(x) = x^2 - 1, find the domain of (f∘g)(x).', answer: 'x > 1 or x < -1', hint: 'g(x) must be > 0, so x^2 > 1.' },
        { prompt: 'If f(x) = sqrt(x) and g(x) = 4 - x^2, find the domain of (f∘g)(x).', answer: '-2 <= x <= 2', hint: '4 - x^2 ≥ 0, so x^2 ≤ 4.' },
        { prompt: 'If f(x) = 1/(x-1) and g(x) = x^2, find the domain of (f∘g)(x).', answer: 'x != 1, x != -1', hint: 'g(x) ≠ 1, so x^2 ≠ 1.' },
      ],
    },
  },
  'conics-series': {
    'circles': {
      problems: [
        { prompt: 'Find center and radius: (x-3)^2 + (y+2)^2 = 25', answer: 'center (3,-2), r=5', hint: '(h,k) = (3,-2), r^2 = 25.' },
        { prompt: 'Write the equation of a circle with center (0,0) and radius 7.', answer: 'x^2 + y^2 = 49', hint: 'Standard form: (x-h)^2 + (y-k)^2 = r^2.' },
        { prompt: 'Convert to standard form: x^2 + y^2 - 6x + 4y - 12 = 0', answer: '(x-3)^2 + (y+2)^2 = 25', hint: 'Complete the square for x and y.' },
        { prompt: 'Find center and radius: x^2 + y^2 + 8x - 2y + 1 = 0', answer: 'center (-4,1), r=4', hint: '(x+4)^2 + (y-1)^2 = 16.' },
        { prompt: 'Find the equation of the circle with center (1,-3) passing through (4,1).', answer: '(x-1)^2 + (y+3)^2 = 25', hint: 'r = distance from (1,-3) to (4,1) = 5.' },
      ],
    },
    'ellipses': {
      problems: [
        { prompt: 'Find center, a, b for: (x-1)^2/16 + (y+2)^2/9 = 1', answer: 'center (1,-2), a=4, b=3', hint: 'Standard form: (x-h)^2/a^2 + (y-k)^2/b^2 = 1.' },
        { prompt: 'Find the foci of: x^2/25 + y^2/9 = 1', answer: '(4,0) and (-4,0)', hint: 'c^2 = a^2 - b^2 = 25 - 9 = 16, c = 4.' },
        { prompt: 'Write the equation with center (0,0), a=5 (horizontal), b=3.', answer: 'x^2/25 + y^2/9 = 1', hint: 'Horizontal major axis: x^2/a^2 + y^2/b^2 = 1.' },
        { prompt: 'Find the eccentricity of: x^2/16 + y^2/7 = 1', answer: '3/4', hint: 'c = sqrt(16-7) = 3, e = c/a = 3/4.' },
        { prompt: 'Vertices of x^2/36 + y^2/4 = 1?', answer: '(6,0), (-6,0), (0,2), (0,-2)', hint: 'a = 6 along x-axis, b = 2 along y-axis.' },
      ],
    },
    'parabolas': {
      problems: [
        { prompt: 'Find vertex and focus: y = (1/8)(x-2)^2 + 1', answer: 'vertex (2,1), focus (2,3)', hint: '4p = 8, so p = 2. Focus is p units above vertex.' },
        { prompt: 'Find vertex and directrix: x = -(1/4)y^2', answer: 'vertex (0,0), directrix x=1', hint: '4p = -4 so p = -1 (opens left). Directrix x = -p = 1.' },
        { prompt: 'Write the equation of a parabola with vertex (0,0) and focus (0,3).', answer: 'x^2 = 12y', hint: 'p = 3, so 4p = 12. Opens upward.' },
        { prompt: 'Find the focus of y^2 = 20x.', answer: '(5, 0)', hint: '4p = 20, so p = 5.' },
        { prompt: 'Find the directrix of x^2 = -8y.', answer: 'y = 2', hint: '4p = -8, p = -2. Directrix y = -p = 2.' },
      ],
    },
    'hyperbolas': {
      problems: [
        { prompt: 'Find center, a, b for: (x-1)^2/9 - (y+2)^2/16 = 1', answer: 'center (1,-2), a=3, b=4', hint: 'Horizontal transverse axis.' },
        { prompt: 'Find the asymptotes of: x^2/4 - y^2/9 = 1', answer: 'y = (3/2)x, y = -(3/2)x', hint: 'Asymptotes: y = ±(b/a)x.' },
        { prompt: 'Find the foci of: x^2/25 - y^2/144 = 1', answer: '(13,0) and (-13,0)', hint: 'c^2 = a^2 + b^2 = 25 + 144 = 169.' },
        { prompt: 'Find the vertices of: y^2/16 - x^2/9 = 1', answer: '(0,4) and (0,-4)', hint: 'Vertical transverse axis, a = 4.' },
        { prompt: 'Write asymptotes of: y^2/25 - x^2/4 = 1', answer: 'y = (5/2)x, y = -(5/2)x', hint: 'Vertical axis: y = ±(a/b)x.' },
      ],
    },
    'conic-identification': {
      problems: [
        { prompt: 'Identify: 4x^2 + 4y^2 = 16', answer: 'circle', hint: 'Same coefficients on x^2 and y^2.' },
        { prompt: 'Identify: 3x^2 + 5y^2 = 15', answer: 'ellipse', hint: 'Different positive coefficients on x^2 and y^2.' },
        { prompt: 'Identify: y = 2x^2 + 3x - 1', answer: 'parabola', hint: 'Only one variable is squared.' },
        { prompt: 'Identify: x^2 - 4y^2 = 16', answer: 'hyperbola', hint: 'One positive, one negative coefficient on squared terms.' },
        { prompt: 'Identify: 9x^2 + 9y^2 - 18x + 12y = 0', answer: 'circle', hint: 'Equal coefficients on x^2 and y^2 (both 9).' },
      ],
    },
    'arithmetic-sequences': {
      problems: [
        { prompt: 'Find the 20th term: a_1 = 3, d = 5', answer: '98', hint: 'a_n = a_1 + (n-1)d = 3 + 19(5).' },
        { prompt: 'Find d if a_1 = 7 and a_10 = 43.', answer: '4', hint: 'd = (a_10 - a_1)/(10-1) = 36/9.' },
        { prompt: 'Find a_1 if a_5 = 23 and d = 4.', answer: '7', hint: 'a_5 = a_1 + 4d, so 23 = a_1 + 16.' },
        { prompt: 'Is 100 a term of the sequence 3, 7, 11, 15, ...?', answer: 'yes, a_25', hint: '100 = 3 + (n-1)(4), so n = 25.' },
        { prompt: 'Find the common difference: 12, 7, 2, -3, ...', answer: '-5', hint: '7 - 12 = -5.' },
      ],
    },
    'geometric-sequences': {
      problems: [
        { prompt: 'Find the 8th term: a_1 = 2, r = 3', answer: '4374', hint: 'a_n = a_1 * r^(n-1) = 2 * 3^7.' },
        { prompt: 'Find r if a_1 = 5 and a_4 = 40.', answer: '2', hint: 'a_4 = a_1 * r^3, so 40 = 5r^3.' },
        { prompt: 'Find a_1 if a_3 = 36 and r = 3.', answer: '4', hint: 'a_3 = a_1 * r^2 = 9a_1.' },
        { prompt: 'Find the 6th term: a_1 = 1000, r = 1/2', answer: '31.25', hint: '1000 * (1/2)^5 = 1000/32.' },
        { prompt: 'Find r: 4, -12, 36, -108, ...', answer: '-3', hint: '-12/4 = -3.' },
      ],
    },
    'recursive-formulas': {
      problems: [
        { prompt: 'Write the first 5 terms: a_1 = 2, a_n = a_(n-1) + 3', answer: '2, 5, 8, 11, 14', hint: 'Add 3 each time.' },
        { prompt: 'Write the first 5 terms: a_1 = 1, a_n = 2*a_(n-1)', answer: '1, 2, 4, 8, 16', hint: 'Multiply by 2 each time.' },
        { prompt: 'Write a recursive formula for: 5, 10, 20, 40, ...', answer: 'a_1 = 5, a_n = 2*a_(n-1)', hint: 'Each term is double the previous.' },
        { prompt: 'Write the first 5 terms: a_1 = 1, a_2 = 1, a_n = a_(n-1) + a_(n-2)', answer: '1, 1, 2, 3, 5', hint: 'This is the Fibonacci sequence.' },
        { prompt: 'Write a recursive formula for: 3, 7, 11, 15, ...', answer: 'a_1 = 3, a_n = a_(n-1) + 4', hint: 'Common difference is 4.' },
      ],
    },
    'explicit-formulas': {
      problems: [
        { prompt: 'Write an explicit formula for: 2, 5, 8, 11, ...', answer: 'a_n = 3n - 1', hint: 'Arithmetic: a_n = a_1 + (n-1)d = 2 + 3(n-1).' },
        { prompt: 'Write an explicit formula for: 3, 6, 12, 24, ...', answer: 'a_n = 3 * 2^(n-1)', hint: 'Geometric: a_n = a_1 * r^(n-1).' },
        { prompt: 'Write an explicit formula for: 10, 7, 4, 1, ...', answer: 'a_n = 13 - 3n', hint: 'a_n = 10 + (n-1)(-3) = 13 - 3n.' },
        { prompt: 'Write an explicit formula for: 1, 1/2, 1/4, 1/8, ...', answer: 'a_n = (1/2)^(n-1)', hint: 'a_1 = 1, r = 1/2.' },
        { prompt: 'Find a_100 for: a_n = 4n + 3', answer: '403', hint: '4(100) + 3 = 403.' },
      ],
    },
    'sequence-convergence': {
      problems: [
        { prompt: 'Does the sequence a_n = 1/n converge? If so, to what?', answer: '0', hint: 'As n → ∞, 1/n → 0.' },
        { prompt: 'Does the sequence a_n = (-1)^n converge?', answer: 'diverges', hint: 'Alternates between -1 and 1 forever.' },
        { prompt: 'Does a_n = (2n+1)/(3n-1) converge? If so, to what?', answer: '2/3', hint: 'Divide top and bottom by n.' },
        { prompt: 'Does a_n = n^2/(n+1) converge?', answer: 'diverges', hint: 'Grows without bound.' },
        { prompt: 'Does a_n = (0.9)^n converge? If so, to what?', answer: '0', hint: '|r| < 1, so r^n → 0.' },
      ],
    },
    'arithmetic-series': {
      problems: [
        { prompt: 'Find S_20 for the arithmetic series: a_1 = 1, d = 3', answer: '590', hint: 'S_n = n/2 * (2a_1 + (n-1)d) = 20/2 * (2 + 57).' },
        { prompt: 'Find the sum: 2 + 5 + 8 + ... + 59', answer: '610', hint: 'n = (59-2)/3 + 1 = 20. S = 20(2+59)/2.' },
        { prompt: 'Find S_10 for: 4, 9, 14, 19, ...', answer: '265', hint: 'S = 10/2 * (2(4) + 9(5)) = 5 * 53.' },
        { prompt: 'Sum of first 100 positive integers?', answer: '5050', hint: 'S = 100(101)/2.' },
        { prompt: 'Find S_50 for: a_1 = 1, d = 2', answer: '2500', hint: 'S = 50/2 * (2 + 49*2) = 25 * 100.' },
      ],
    },
    'geometric-series': {
      problems: [
        { prompt: 'Find S_6 for: a_1 = 2, r = 3', answer: '728', hint: 'S = a_1(r^n - 1)/(r - 1) = 2(729-1)/2.' },
        { prompt: 'Find S_8 for: a_1 = 1, r = 2', answer: '255', hint: 'S = (2^8 - 1)/(2 - 1) = 255.' },
        { prompt: 'Find S_5 for: 3, 6, 12, 24, ...', answer: '93', hint: 'S = 3(2^5 - 1)/(2-1) = 3(31).' },
        { prompt: 'Find S_4 for: 1, -2, 4, -8', answer: '-5', hint: 'S = 1((-2)^4 - 1)/(-2-1) = (16-1)/(-3).' },
        { prompt: 'Find S_10 for: a_1 = 5, r = 1/2', answer: '5115/512', hint: 'S = 5(1 - (1/2)^10)/(1/2).' },
      ],
    },
    'partial-sums': {
      problems: [
        { prompt: 'Find the 4th partial sum of: 1 + 3 + 5 + 7 + ...', answer: '16', hint: 'S_4 = 1 + 3 + 5 + 7 = 16.' },
        { prompt: 'Find S_3 for: 10, 5, 5/2, ...', answer: '17.5', hint: '10 + 5 + 2.5 = 17.5.' },
        { prompt: 'Find S_5 for: 1, 1, 1, 1, 1, ...', answer: '5', hint: 'Constant sequence: sum = 5(1).' },
        { prompt: 'Find S_4 for: 2, -4, 8, -16, ...', answer: '-10', hint: '2 + (-4) + 8 + (-16) = -10.' },
        { prompt: 'Find S_6 for: 1/2, 1/4, 1/8, 1/16, 1/32, 1/64', answer: '63/64', hint: 'Geometric sum: (1/2)(1-(1/2)^6)/(1/2).' },
      ],
    },
    'infinite-geometric-series': {
      problems: [
        { prompt: 'Find the sum: 1 + 1/2 + 1/4 + 1/8 + ...', answer: '2', hint: 'S = a_1/(1-r) = 1/(1-1/2).' },
        { prompt: 'Find the sum: 3 + 1 + 1/3 + 1/9 + ...', answer: '9/2', hint: 'S = 3/(1-1/3) = 3/(2/3).' },
        { prompt: 'Does 2 + 6 + 18 + 54 + ... converge?', answer: 'diverges', hint: '|r| = 3 > 1, so it diverges.' },
        { prompt: 'Find the sum: 10 - 5 + 5/2 - 5/4 + ...', answer: '20/3', hint: 'S = 10/(1-(-1/2)) = 10/(3/2).' },
        { prompt: 'Express 0.333... as a fraction using infinite series.', answer: '1/3', hint: '3/10 + 3/100 + ... = (3/10)/(1-1/10).' },
      ],
    },
    'sigma-notation': {
      problems: [
        { prompt: 'Evaluate: Σ(k=1 to 4) k^2', answer: '30', hint: '1 + 4 + 9 + 16 = 30.' },
        { prompt: 'Evaluate: Σ(k=1 to 5) (2k - 1)', answer: '25', hint: '1 + 3 + 5 + 7 + 9 = 25.' },
        { prompt: 'Write in sigma notation: 2 + 4 + 6 + 8 + 10', answer: 'Σ(k=1 to 5) 2k', hint: 'Each term is 2k.' },
        { prompt: 'Evaluate: Σ(k=0 to 3) 3^k', answer: '40', hint: '1 + 3 + 9 + 27 = 40.' },
        { prompt: 'Evaluate: Σ(k=1 to 100) 1', answer: '100', hint: 'Sum of 100 ones.' },
      ],
    },
  },
  'calc-preview': {
    'limit-concept': {
      problems: [
        { prompt: 'Find: lim(x→3) (x^2 - 9)/(x - 3)', answer: '6', hint: 'Factor: (x-3)(x+3)/(x-3) = x+3. As x→3, this → 6.' },
        { prompt: 'Find: lim(x→0) sin(x)/x', answer: '1', hint: 'This is a fundamental limit.' },
        { prompt: 'Find: lim(x→2) (x^2 - 4)/(x - 2)', answer: '4', hint: 'Factor: (x-2)(x+2)/(x-2) = x+2.' },
        { prompt: 'Find: lim(x→1) (x^3 - 1)/(x - 1)', answer: '3', hint: 'Factor: (x-1)(x^2+x+1)/(x-1).' },
        { prompt: 'Find: lim(x→4) (sqrt(x) - 2)/(x - 4)', answer: '1/4', hint: 'Rationalize: multiply by (sqrt(x)+2)/(sqrt(x)+2).' },
      ],
    },
    'limit-tables': {
      problems: [
        { prompt: 'Use a table to estimate lim(x→0) (e^x - 1)/x', answer: '1', hint: 'Try x = 0.1, 0.01, 0.001 and x = -0.1, -0.01, -0.001.' },
        { prompt: 'Use a table to estimate lim(x→0) (1 - cos x)/x^2', answer: '1/2', hint: 'Try small values of x approaching 0.' },
        { prompt: 'Estimate lim(x→∞) (1 + 1/x)^x', answer: 'e', hint: 'Try x = 10, 100, 1000.' },
        { prompt: 'Use a table to estimate lim(x→0) tan(x)/x', answer: '1', hint: 'Try values close to 0.' },
        { prompt: 'Estimate lim(x→0) (2^x - 1)/x', answer: 'ln(2)', hint: 'Try x = 0.1, 0.01. Approaches about 0.693.' },
      ],
    },
    'limit-graphs': {
      problems: [
        { prompt: 'A graph shows f(x) approaching y=4 as x→2 from both sides but f(2)=1. What is lim(x→2) f(x)?', answer: '4', hint: 'The limit depends on what f approaches, not the actual value.' },
        { prompt: 'A graph shows f(x)→3 as x→1- and f(x)→5 as x→1+. Does lim(x→1) f(x) exist?', answer: 'no', hint: 'Left and right limits must be equal for the limit to exist.' },
        { prompt: 'A graph shows f(x)→∞ as x→0+. What is lim(x→0+) f(x)?', answer: 'infinity', hint: 'The function increases without bound.' },
        { prompt: 'If f(x) has a hole at (3,7), what is lim(x→3) f(x)?', answer: '7', hint: 'A hole means the limit exists but the function is undefined there.' },
        { prompt: 'A graph shows f(x) oscillating between -1 and 1 near x=0. Does lim(x→0) f(x) exist?', answer: 'no', hint: 'The function does not settle on a single value.' },
      ],
    },
    'one-sided-limits': {
      problems: [
        { prompt: 'Find lim(x→0+) 1/x', answer: 'infinity', hint: '1/x grows without bound as x approaches 0 from the right.' },
        { prompt: 'Find lim(x→0-) 1/x', answer: '-infinity', hint: '1/x goes to -∞ as x approaches 0 from the left.' },
        { prompt: 'For f(x) = |x|/x, find lim(x→0+) f(x)', answer: '1', hint: 'For x > 0, |x|/x = x/x = 1.' },
        { prompt: 'For f(x) = |x|/x, find lim(x→0-) f(x)', answer: '-1', hint: 'For x < 0, |x|/x = -x/x = -1.' },
        { prompt: 'Find lim(x→3+) 1/(x-3)', answer: 'infinity', hint: 'As x→3+, (x-3) is small and positive.' },
      ],
    },
    'limits-at-infinity': {
      problems: [
        { prompt: 'Find lim(x→∞) (3x^2 + 1)/(x^2 - 4)', answer: '3', hint: 'Divide by x^2: ratio of leading coefficients.' },
        { prompt: 'Find lim(x→∞) (2x + 1)/(5x - 3)', answer: '2/5', hint: 'Divide by x.' },
        { prompt: 'Find lim(x→∞) 1/x^2', answer: '0', hint: 'As x → ∞, 1/x^2 → 0.' },
        { prompt: 'Find lim(x→-∞) e^x', answer: '0', hint: 'Exponential decay as x → -∞.' },
        { prompt: 'Find lim(x→∞) (x^3 + 1)/(x^2 + 1)', answer: 'infinity', hint: 'Degree of numerator > degree of denominator.' },
      ],
    },
    'continuity-definition': {
      problems: [
        { prompt: 'Is f(x) = x^2 continuous at x = 3? Check all 3 conditions.', answer: 'yes', hint: 'f(3)=9, lim=9, f(3)=lim. All three satisfied.' },
        { prompt: 'f(x) = 1/(x-2). Is f continuous at x = 2?', answer: 'no', hint: 'f(2) is undefined (condition 1 fails).' },
        { prompt: 'f(x) = (x^2-1)/(x-1) for x≠1, f(1)=3. Is f continuous at x=1?', answer: 'no', hint: 'lim(x→1) = 2, but f(1) = 3. Condition 3 fails.' },
        { prompt: 'State the 3 conditions for continuity at x = a.', answer: 'f(a) exists, lim exists, lim = f(a)', hint: 'Definition requires all three conditions.' },
        { prompt: 'f(x) = (x^2-4)/(x-2) for x≠2, f(2)=4. Is f continuous at x=2?', answer: 'yes', hint: 'lim(x→2) = 4 and f(2) = 4.' },
      ],
    },
    'removable-discontinuity': {
      problems: [
        { prompt: 'Find and classify the discontinuity: f(x) = (x^2-9)/(x-3)', answer: 'removable at x=3', hint: 'Factor: (x-3)(x+3)/(x-3). Hole at x=3.' },
        { prompt: 'Redefine f(x) = (x^2-4)/(x-2) to be continuous at x=2.', answer: 'f(2) = 4', hint: 'lim(x→2) = 4, so define f(2) = 4.' },
        { prompt: 'Does f(x) = sin(x)/x have a removable discontinuity at x=0?', answer: 'yes', hint: 'lim(x→0) = 1, so define f(0) = 1.' },
        { prompt: 'Redefine f(x) = (x^3-8)/(x-2) to be continuous at x=2.', answer: 'f(2) = 12', hint: 'Factor: (x-2)(x^2+2x+4)/(x-2). lim = 12.' },
        { prompt: 'Is the discontinuity of f(x) = (x^2-x)/(x) at x=0 removable?', answer: 'yes', hint: 'f(x) = x(x-1)/x = x-1 for x≠0. Define f(0) = -1.' },
      ],
    },
    'jump-discontinuity': {
      problems: [
        { prompt: 'f(x) = {x+1 if x<2, x-1 if x≥2}. Is there a jump at x=2?', answer: 'yes', hint: 'Left limit = 3, right limit = 1. They differ.' },
        { prompt: 'Does |x|/x have a jump discontinuity at x=0?', answer: 'yes', hint: 'Left limit = -1, right limit = 1.' },
        { prompt: 'f(x) = floor(x). Does f have a jump at x=1?', answer: 'yes', hint: 'Left limit = 0, right limit = 1.' },
        { prompt: 'f(x) = {2x if x<1, x+3 if x≥1}. Is f continuous at x=1?', answer: 'no, jump', hint: 'Left limit = 2, right value = 4.' },
        { prompt: 'Can a jump discontinuity be removed by redefining f(a)?', answer: 'no', hint: 'The left and right limits differ; no single value works.' },
      ],
    },
    'infinite-discontinuity': {
      problems: [
        { prompt: 'Classify the discontinuity: f(x) = 1/(x-5) at x=5', answer: 'infinite', hint: 'f(x) → ±∞ as x → 5.' },
        { prompt: 'Classify: f(x) = 1/x^2 at x=0', answer: 'infinite', hint: 'f(x) → ∞ as x → 0.' },
        { prompt: 'Classify: f(x) = tan(x) at x=π/2', answer: 'infinite', hint: 'tan(x) → ±∞ as x → π/2.' },
        { prompt: 'Classify: f(x) = ln(x) at x=0', answer: 'infinite', hint: 'ln(x) → -∞ as x → 0+.' },
        { prompt: 'Is the discontinuity of 1/(x-1) at x=1 removable?', answer: 'no, infinite', hint: 'The function goes to ±∞, not a finite value.' },
      ],
    },
    'intermediate-value-theorem': {
      problems: [
        { prompt: 'f(x)=x^3-x-1 on [1,2]. f(1)=-1, f(2)=5. Does f have a zero on [1,2]?', answer: 'yes', hint: 'f is continuous and changes sign, so IVT guarantees a zero.' },
        { prompt: 'f(x)=x^2-3 on [1,2]. f(1)=-2, f(2)=1. Does f=0 for some c in (1,2)?', answer: 'yes', hint: 'Sign change from -2 to 1 guarantees a zero by IVT.' },
        { prompt: 'Why can\'t IVT be applied to f(x)=1/(x-1) on [0,2]?', answer: 'f is not continuous on [0,2]', hint: 'f is discontinuous at x=1, which is in the interval.' },
        { prompt: 'f(x)=cos(x) on [0,π]. Show there exists c where f(c)=0.', answer: 'f(0)=1, f(π)=-1, sign change', hint: 'cos is continuous, cos(0)=1 > 0, cos(π)=-1 < 0.' },
        { prompt: 'What are the hypotheses of the IVT?', answer: 'f continuous on [a,b], N between f(a) and f(b)', hint: 'Continuity on a closed interval is essential.' },
      ],
    },
    'polar-coordinates': {
      problems: [
        { prompt: 'Convert (3, π/6) from polar to rectangular.', answer: '(3sqrt(3)/2, 3/2)', hint: 'x = r cos θ, y = r sin θ.' },
        { prompt: 'Convert rectangular (1, 1) to polar.', answer: '(sqrt(2), π/4)', hint: 'r = sqrt(x^2+y^2), θ = arctan(y/x).' },
        { prompt: 'Convert (4, π/2) from polar to rectangular.', answer: '(0, 4)', hint: 'x = 4cos(π/2)=0, y = 4sin(π/2)=4.' },
        { prompt: 'Convert rectangular (-1, sqrt(3)) to polar.', answer: '(2, 2π/3)', hint: 'r = 2, θ in second quadrant.' },
        { prompt: 'Convert (2, π) from polar to rectangular.', answer: '(-2, 0)', hint: 'x = 2cos(π) = -2, y = 2sin(π) = 0.' },
      ],
    },
    'polar-graphs': {
      problems: [
        { prompt: 'Describe the graph of r = 3.', answer: 'circle of radius 3 centered at origin', hint: 'Constant r is a circle.' },
        { prompt: 'Describe the graph of r = 2sin(θ).', answer: 'circle of radius 1 centered at (0,1)', hint: 'r = 2sin(θ) is a circle tangent to origin.' },
        { prompt: 'How many petals does r = cos(3θ) have?', answer: '3', hint: 'r = cos(nθ) has n petals when n is odd.' },
        { prompt: 'How many petals does r = sin(2θ) have?', answer: '4', hint: 'r = sin(nθ) has 2n petals when n is even.' },
        { prompt: 'Describe the graph of r = 1 + cos(θ).', answer: 'cardioid', hint: 'r = a + a cos(θ) is a cardioid.' },
      ],
    },
    'parametric-equations': {
      problems: [
        { prompt: 'Eliminate the parameter: x = 2t, y = t^2', answer: 'y = x^2/4', hint: 't = x/2, so y = (x/2)^2.' },
        { prompt: 'Eliminate the parameter: x = cos(t), y = sin(t)', answer: 'x^2 + y^2 = 1', hint: 'cos^2(t) + sin^2(t) = 1.' },
        { prompt: 'Find x and y when t=2: x = t+1, y = t^2-1', answer: '(3, 3)', hint: 'x=3, y=4-1=3.' },
        { prompt: 'Eliminate the parameter: x = 3t-1, y = 2t+5', answer: 'y = (2x+17)/3', hint: 't = (x+1)/3, substitute into y equation.' },
        { prompt: 'Eliminate the parameter: x = t^2, y = t^3', answer: 'y = x^(3/2)', hint: 't = sqrt(x), y = (sqrt(x))^3.' },
      ],
    },
    'parametric-graphs': {
      problems: [
        { prompt: 'Describe the curve: x = 3cos(t), y = 3sin(t), 0 ≤ t ≤ 2π', answer: 'circle of radius 3', hint: 'x^2 + y^2 = 9.' },
        { prompt: 'Describe: x = 2cos(t), y = 5sin(t), 0 ≤ t ≤ 2π', answer: 'ellipse with a=2, b=5', hint: 'x^2/4 + y^2/25 = 1.' },
        { prompt: 'What direction is traced: x = cos(t), y = sin(t) as t increases?', answer: 'counterclockwise', hint: 'At t=0: (1,0). At t=π/2: (0,1). Moving CCW.' },
        { prompt: 'Describe: x = t, y = t^2, -∞ < t < ∞', answer: 'parabola y = x^2', hint: 'Since x = t, y = t^2 = x^2.' },
        { prompt: 'Describe: x = sec(t), y = tan(t)', answer: 'hyperbola x^2 - y^2 = 1', hint: 'sec^2(t) - tan^2(t) = 1.' },
      ],
    },
    'converting-systems': {
      problems: [
        { prompt: 'Convert r = 4cos(θ) to rectangular form.', answer: 'x^2 + y^2 = 4x', hint: 'Multiply both sides by r: r^2 = 4r cos(θ).' },
        { prompt: 'Convert x^2 + y^2 = 9 to polar form.', answer: 'r = 3', hint: 'r^2 = 9, so r = 3.' },
        { prompt: 'Convert y = x to polar form.', answer: 'θ = π/4', hint: 'tan(θ) = y/x = 1, so θ = π/4.' },
        { prompt: 'Convert r = 2/(1 + cos θ) to rectangular.', answer: 'y^2 = 4 - 4x', hint: 'r + r cos θ = 2, so r + x = 2, then sqrt(x^2+y^2) = 2-x.' },
        { prompt: 'Convert x = 3 to polar form.', answer: 'r cos(θ) = 3', hint: 'x = r cos(θ).' },
      ],
    },
    'average-rate-of-change': {
      problems: [
        { prompt: 'Find the average rate of change of f(x) = x^2 on [1, 4].', answer: '5', hint: '(f(4)-f(1))/(4-1) = (16-1)/3.' },
        { prompt: 'Find the average rate of change of f(x) = x^3 on [1, 3].', answer: '13', hint: '(27-1)/(3-1) = 26/2.' },
        { prompt: 'Find the average rate of change of f(x) = sqrt(x) on [4, 9].', answer: '1/5', hint: '(3-2)/(9-4) = 1/5.' },
        { prompt: 'Find the average rate of change of f(x) = 1/x on [1, 5].', answer: '-1/5', hint: '(1/5-1)/(5-1) = (-4/5)/4.' },
        { prompt: 'Find the average rate of change of f(x) = 2x + 3 on [0, 10].', answer: '2', hint: '(23-3)/10 = 2. Constant for linear functions.' },
      ],
    },
    'instantaneous-rate-concept': {
      problems: [
        { prompt: 'Estimate the instantaneous rate of f(x) = x^2 at x=3 using h=0.001.', answer: '6', hint: '(f(3.001)-f(3))/0.001 ≈ (9.006001-9)/0.001 ≈ 6.' },
        { prompt: 'What does the instantaneous rate of change represent geometrically?', answer: 'slope of tangent line', hint: 'It is the slope of the line tangent to the curve at that point.' },
        { prompt: 'Estimate the instantaneous rate of f(x) = x^3 at x=2 using h=0.01.', answer: '12', hint: '(f(2.01)-f(2))/0.01 ≈ 12.' },
        { prompt: 'How is instantaneous rate related to average rate?', answer: 'limit of average rate as interval shrinks to 0', hint: 'lim(h→0) [f(a+h)-f(a)]/h.' },
        { prompt: 'For f(x) = x^2, the rate at x=a equals 2a. Find the rate at x=5.', answer: '10', hint: '2(5) = 10.' },
      ],
    },
    'secant-to-tangent': {
      problems: [
        { prompt: 'Find the slope of the secant line for f(x)=x^2 between x=2 and x=2+h. Simplify.', answer: '4+h', hint: '((2+h)^2-4)/h = (4+4h+h^2-4)/h = 4+h.' },
        { prompt: 'Using the previous result, what is the tangent slope at x=2?', answer: '4', hint: 'lim(h→0) (4+h) = 4.' },
        { prompt: 'Find the secant slope of f(x)=x^3 from x=1 to x=1+h. Simplify.', answer: '3+3h+h^2', hint: 'Expand (1+h)^3 and subtract 1, divide by h.' },
        { prompt: 'What is the tangent slope of f(x)=x^3 at x=1?', answer: '3', hint: 'lim(h→0) (3+3h+h^2) = 3.' },
        { prompt: 'Secant slope of f(x)=1/x from x=a to x=a+h?', answer: '-1/(a(a+h))', hint: '(1/(a+h) - 1/a)/h = (-h/(a(a+h)))/h.' },
      ],
    },
    'velocity-acceleration': {
      problems: [
        { prompt: 'Position: s(t) = t^2 + 3t. Find average velocity on [1,4].', answer: '8', hint: '(s(4)-s(1))/(4-1) = (28-4)/3.' },
        { prompt: 'Position: s(t) = 16t^2. Estimate velocity at t=2 using h=0.01.', answer: '64', hint: '(s(2.01)-s(2))/0.01 ≈ 64.' },
        { prompt: 'If velocity v(t)=3t^2, what is the acceleration at t=2?', answer: '12', hint: 'Acceleration is the rate of change of velocity. a = 6t, a(2)=12.' },
        { prompt: 's(t)=-16t^2+64t. When does the object reach max height?', answer: 't=2', hint: 'Max when velocity = 0. v = -32t+64 = 0.' },
        { prompt: 's(t) = t^3 - 6t^2 + 9t. Find average velocity on [0,3].', answer: '0', hint: '(s(3)-s(0))/3 = (0-0)/3.' },
      ],
    },
    'rate-applications': {
      problems: [
        { prompt: 'Revenue R(x) = 100x - x^2. Find avg rate of change from x=10 to x=20.', answer: '70', hint: '(R(20)-R(10))/(20-10) = (1600-900)/10.' },
        { prompt: 'Population P(t) = 1000e^(0.05t). Find average growth rate from t=0 to t=10. Round to nearest integer.', answer: '65', hint: '(P(10)-P(0))/10 = (1000e^0.5-1000)/10 ≈ 649/10.' },
        { prompt: 'Cost C(x) = 0.01x^2 + 5x + 100. Average rate from x=100 to x=200?', answer: '8', hint: '(C(200)-C(100))/100 = (1500-700)/100.' },
        { prompt: 'Temperature T(t) = 70 + 30e^(-0.1t). Average rate from t=0 to t=10? Round to 1 decimal.', answer: '-1.9', hint: '(T(10)-T(0))/10 = (70+30e^(-1) - 100)/10.' },
        { prompt: 'If profit P(x)=50x-x^2, when is marginal profit zero?', answer: 'x=25', hint: 'Rate of change = 50-2x = 0 at x=25.' },
      ],
    },
  },
};

const LESSON_CONTEXTS = {
  'functions-deep': [
    { title: 'Polynomial Behavior', focus: 'zeros and end behavior', context: 'Understanding polynomial zeros and end behavior connects directly to curve sketching in Calculus. Every zero is a place where the function crosses or touches the x-axis.' },
    { title: 'Rational Function Analysis', focus: 'asymptotes and domains', context: 'Rational functions introduce the concept of limits before you formally study them. Asymptotes are limits in disguise!' },
    { title: 'Exponential and Logarithmic Mastery', focus: 'exp/log equations and applications', context: 'Exponentials model growth/decay everywhere in science. Logs are essential for solving exponential equations and appear throughout calculus.' },
    { title: 'Function Composition and Inverses', focus: 'building and deconstructing functions', context: 'Composition is the heart of the Chain Rule in calculus. Understanding how functions combine is essential for differentiation.' },
  ],
  'conics-series': [
    { title: 'Conic Sections', focus: 'circles, ellipses, parabolas, hyperbolas', context: 'Conics appear everywhere from planetary orbits (ellipses) to satellite dishes (parabolas) to cooling towers (hyperbolas).' },
    { title: 'Sequences and Series', focus: 'patterns, formulas, convergence', context: 'Series are the foundation of Taylor/Maclaurin expansions in Calculus 2. Convergence is a central concept in advanced mathematics.' },
  ],
  'calc-preview': [
    { title: 'Introduction to Limits', focus: 'concept, computation, one-sided', context: 'Limits are THE fundamental concept of calculus. Derivatives and integrals are both defined using limits.' },
    { title: 'Continuity and IVT', focus: 'continuous functions and their properties', context: 'Continuity connects limits to function values. The Intermediate Value Theorem is your first taste of existence theorems.' },
    { title: 'Polar and Parametric Systems', focus: 'alternative coordinate systems', context: 'Some curves are impossible to describe with y=f(x). Polar and parametric give you the full power of coordinate geometry.' },
    { title: 'Rates of Change', focus: 'average to instantaneous', context: 'This is the bridge to derivatives. The instantaneous rate of change IS the derivative.' },
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

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 /()^+\-.']/g, ''); }

// Exercise generation

function exResult(type, skill, level, instruction, items) { return { type, skill, level, count: items.length, instruction, items }; }

function generateExercise(level, skill, count = 5) {
  const bank = PROBLEM_BANKS[level]?.[skill];
  if (!bank || !bank.problems) return { error: `No problem bank for ${level}/${skill}` };
  return exResult('solve', skill, level, 'Solve the following problem. Show your work.',
    pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer, hint: p.hint })));
}

// Answer checking

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
}

// Public API

class Precalculus {
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
    const level = p.level || 'functions-deep';
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
    const level = p.level || 'functions-deep';
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
    const level = p.level || 'functions-deep';
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
        apply: context ? `Context: ${context.context}` : 'Apply to real-world problems',
        connect: `Calculus connection: how this prepares you for AP Calc`,
      },
    };
  }
}

module.exports = Precalculus;

// CLI: node precalculus.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const pc = new Precalculus();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, level] = args;
        if (!id) throw new Error('Usage: start <id> [level]');
        if (level) pc.setLevel(id, level);
        out({ action: 'start', profile: pc.getProfile(id), nextSkills: pc.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(pc.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, type] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const level = loadProfile(id).level || 'functions-deep';
        if (type) { out(pc.generateExercise(level, type, 5)); }
        else { const n = pc.getNextSkills(id, 1).next; out(n.length ? pc.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient at current level!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(pc.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, level, cat, skill, sc, tot, ...notes] = args;
        if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total> [notes]');
        out(pc.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(pc.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(pc.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(pc.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? pc.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'students': { out(pc.listStudents()); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(pc.setLevel(id, l)); break; }
      default: out({ usage: 'node precalculus.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
