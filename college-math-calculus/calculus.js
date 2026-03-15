// College Math Calculus Interactive Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-math-calculus');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'calc-1': {
    'limits': ['intuitive-limits', 'limit-laws', 'squeeze-theorem', 'epsilon-delta', 'continuity'],
    'derivatives-rules': ['power-rule', 'product-quotient', 'chain-rule', 'implicit-diff', 'trig-derivatives'],
    'applications-derivatives': ['related-rates', 'optimization', 'lhopital', 'curve-sketching', 'mvt'],
    'integrals': ['riemann-sums', 'ftc', 'u-substitution', 'area-between-curves'],
  },
  'calc-2': {
    'techniques-integration': ['by-parts', 'trig-integrals', 'trig-substitution', 'partial-fractions', 'improper-integrals'],
    'applications-integrals': ['volume-revolution', 'arc-length', 'surface-area', 'work-applications'],
    'sequences-series': ['sequences', 'series-convergence', 'taylor-maclaurin'],
    'parametric-polar': ['parametric-curves', 'polar-coordinates'],
  },
  'calc-3': {
    'multivariable-intro': ['partial-derivatives', 'gradient', 'directional-derivatives', 'chain-rule-multi', 'lagrange-multipliers'],
    'vector-calculus': ['line-integrals', 'greens-theorem', 'surface-integrals', 'stokes-theorem', 'divergence-theorem'],
  },
};

const PROBLEM_BANKS = {
  'calc-1': {
    'intuitive-limits': {
      type: 'compute',
      instruction: 'Evaluate the limit.',
      problems: [
        { prompt: 'lim(x->2) (x^2 - 4)/(x - 2)', answer: '4', solution: 'Factor: (x+2)(x-2)/(x-2) = x+2. At x=2: 4.' },
        { prompt: 'lim(x->0) sin(x)/x', answer: '1', solution: 'Standard limit: lim sin(x)/x = 1.' },
        { prompt: 'lim(x->3) (x^2 - 9)/(x - 3)', answer: '6', solution: 'Factor: (x+3)(x-3)/(x-3) = x+3. At x=3: 6.' },
        { prompt: 'lim(x->1) (x^3 - 1)/(x - 1)', answer: '3', solution: 'Factor: (x-1)(x^2+x+1)/(x-1) = x^2+x+1. At x=1: 3.' },
        { prompt: 'lim(x->0) (e^x - 1)/x', answer: '1', solution: 'Standard limit or L\'Hopital: e^x/1 at x=0 = 1.' },
        { prompt: 'lim(x->inf) (3x^2 + 1)/(x^2 - 5)', answer: '3', solution: 'Divide by x^2: (3 + 1/x^2)/(1 - 5/x^2) -> 3.' },
        { prompt: 'lim(x->0) tan(x)/x', answer: '1', solution: 'tan(x)/x = sin(x)/(x*cos(x)). Both standard limits give 1.' },
        { prompt: 'lim(x->4) (sqrt(x) - 2)/(x - 4)', answer: '1/4', solution: 'Rationalize: 1/(sqrt(x)+2). At x=4: 1/4.' },
      ],
    },
    'limit-laws': {
      type: 'compute',
      instruction: 'Use limit laws to evaluate the limit.',
      problems: [
        { prompt: 'lim(x->2) [3x^2 + 2x - 1]', answer: '15', solution: '3(4) + 2(2) - 1 = 12 + 4 - 1 = 15.' },
        { prompt: 'lim(x->1) [(x+1)(x^2+3)]', answer: '8', solution: '(1+1)(1+3) = 2*4 = 8.' },
        { prompt: 'lim(x->3) (2x+1)/(x-1)', answer: '7/2', solution: '(6+1)/(3-1) = 7/2.' },
        { prompt: 'lim(x->0) [x^2 + cos(x)]', answer: '1', solution: '0 + cos(0) = 1.' },
        { prompt: 'lim(x->1) sqrt(3x + 1)', answer: '2', solution: 'sqrt(3+1) = sqrt(4) = 2.' },
        { prompt: 'lim(x->2) (x^3 - 3x + 5)', answer: '7', solution: '8 - 6 + 5 = 7.' },
      ],
    },
    'squeeze-theorem': {
      type: 'compute',
      instruction: 'Use the Squeeze Theorem to evaluate the limit.',
      problems: [
        { prompt: 'lim(x->0) x^2 * sin(1/x)', answer: '0', solution: '-x^2 <= x^2*sin(1/x) <= x^2, both bounds -> 0.' },
        { prompt: 'lim(x->0) x * cos(1/x)', answer: '0', solution: '-|x| <= x*cos(1/x) <= |x|, both -> 0.' },
        { prompt: 'lim(x->inf) cos(x)/x', answer: '0', solution: '-1/x <= cos(x)/x <= 1/x, both -> 0.' },
        { prompt: 'lim(x->0) x^2 * cos(1/x^2)', answer: '0', solution: '-x^2 <= x^2*cos(1/x^2) <= x^2, both -> 0.' },
        { prompt: 'lim(n->inf) sin(n)/n', answer: '0', solution: '-1/n <= sin(n)/n <= 1/n, both -> 0.' },
      ],
    },
    'epsilon-delta': {
      type: 'proof',
      instruction: 'Provide the value of delta in terms of epsilon for the epsilon-delta proof.',
      problems: [
        { prompt: 'Prove lim(x->3) (2x+1) = 7. What delta works?', answer: 'epsilon/2', solution: '|2x+1-7| = 2|x-3| < epsilon when |x-3| < epsilon/2.' },
        { prompt: 'Prove lim(x->1) (3x-2) = 1. What delta works?', answer: 'epsilon/3', solution: '|3x-2-1| = 3|x-1| < epsilon when |x-1| < epsilon/3.' },
        { prompt: 'Prove lim(x->2) (5x) = 10. What delta works?', answer: 'epsilon/5', solution: '|5x-10| = 5|x-2| < epsilon when |x-2| < epsilon/5.' },
        { prompt: 'Prove lim(x->0) (4x+3) = 3. What delta works?', answer: 'epsilon/4', solution: '|4x+3-3| = 4|x| < epsilon when |x| < epsilon/4.' },
        { prompt: 'Prove lim(x->5) (x+1) = 6. What delta works?', answer: 'epsilon', solution: '|x+1-6| = |x-5| < epsilon when |x-5| < epsilon.' },
      ],
    },
    'continuity': {
      type: 'analyze',
      instruction: 'Determine if the function is continuous at the given point. Answer YES or NO and explain.',
      problems: [
        { prompt: 'f(x) = (x^2-1)/(x-1) at x=1', answer: 'no', solution: 'f(1) is undefined (0/0). Not continuous.' },
        { prompt: 'f(x) = |x| at x=0', answer: 'yes', solution: 'f(0)=0, lim=0, continuous.' },
        { prompt: 'f(x) = 1/x at x=0', answer: 'no', solution: 'f(0) is undefined. Not continuous.' },
        { prompt: 'f(x) = x^2 + 3x at x=2', answer: 'yes', solution: 'Polynomial, continuous everywhere. f(2) = 10.' },
        { prompt: 'f(x) = floor(x) at x=1', answer: 'no', solution: 'Left limit = 0, right limit = 1. Jump discontinuity.' },
        { prompt: 'f(x) = sin(x)/x, f(0)=1, at x=0', answer: 'yes', solution: 'lim sin(x)/x = 1 = f(0). Continuous.' },
      ],
    },
    'power-rule': {
      type: 'compute',
      instruction: 'Find the derivative.',
      problems: [
        { prompt: 'd/dx [x^5]', answer: '5x^4', solution: 'Power rule: 5x^4.' },
        { prompt: 'd/dx [3x^4 - 2x^2 + 7]', answer: '12x^3 - 4x', solution: '12x^3 - 4x + 0.' },
        { prompt: 'd/dx [x^(-3)]', answer: '-3x^(-4)', solution: 'Power rule: -3x^(-4).' },
        { prompt: 'd/dx [sqrt(x)]', answer: '1/(2*sqrt(x))', solution: 'd/dx x^(1/2) = (1/2)x^(-1/2).' },
        { prompt: 'd/dx [x^7 + 4x^3 - x]', answer: '7x^6 + 12x^2 - 1', solution: 'Term by term: 7x^6 + 12x^2 - 1.' },
        { prompt: 'd/dx [1/x^2]', answer: '-2/x^3', solution: 'd/dx x^(-2) = -2x^(-3) = -2/x^3.' },
        { prompt: 'd/dx [x^(3/2)]', answer: '(3/2)x^(1/2)', solution: 'Power rule: (3/2)x^(1/2).' },
        { prompt: 'd/dx [6x^5 - x^3 + 2x]', answer: '30x^4 - 3x^2 + 2', solution: 'Term by term.' },
      ],
    },
    'product-quotient': {
      type: 'compute',
      instruction: 'Find the derivative using product or quotient rule.',
      problems: [
        { prompt: 'd/dx [x^2 * sin(x)]', answer: '2x*sin(x) + x^2*cos(x)', solution: 'Product rule: f\'g + fg\' = 2x*sin(x) + x^2*cos(x).' },
        { prompt: 'd/dx [(x+1)/(x-1)]', answer: '-2/(x-1)^2', solution: 'Quotient rule: [(x-1)-(x+1)]/(x-1)^2 = -2/(x-1)^2.' },
        { prompt: 'd/dx [x * e^x]', answer: 'e^x + x*e^x', solution: 'Product rule: e^x + x*e^x = (1+x)e^x.' },
        { prompt: 'd/dx [x^3 * ln(x)]', answer: '3x^2*ln(x) + x^2', solution: 'Product rule: 3x^2*ln(x) + x^3*(1/x) = 3x^2*ln(x) + x^2.' },
        { prompt: 'd/dx [sin(x)/x]', answer: '(x*cos(x) - sin(x))/x^2', solution: 'Quotient rule: (cos(x)*x - sin(x))/x^2.' },
        { prompt: 'd/dx [e^x / x^2]', answer: '(x^2*e^x - 2x*e^x)/x^4', solution: 'Quotient rule. Simplifies to e^x(x-2)/x^3.' },
      ],
    },
    'chain-rule': {
      type: 'compute',
      instruction: 'Find the derivative using the chain rule.',
      problems: [
        { prompt: 'd/dx [sin(3x)]', answer: '3*cos(3x)', solution: 'Chain rule: cos(3x)*3.' },
        { prompt: 'd/dx [(2x+1)^5]', answer: '10*(2x+1)^4', solution: 'Chain rule: 5(2x+1)^4 * 2 = 10(2x+1)^4.' },
        { prompt: 'd/dx [e^(x^2)]', answer: '2x*e^(x^2)', solution: 'Chain rule: e^(x^2) * 2x.' },
        { prompt: 'd/dx [ln(x^2 + 1)]', answer: '2x/(x^2+1)', solution: 'Chain rule: (1/(x^2+1)) * 2x.' },
        { prompt: 'd/dx [cos(x^3)]', answer: '-3x^2*sin(x^3)', solution: 'Chain rule: -sin(x^3) * 3x^2.' },
        { prompt: 'd/dx [sqrt(4x+1)]', answer: '2/sqrt(4x+1)', solution: 'Chain rule: (1/2)(4x+1)^(-1/2)*4 = 2/sqrt(4x+1).' },
        { prompt: 'd/dx [tan(2x)]', answer: '2*sec^2(2x)', solution: 'Chain rule: sec^2(2x)*2.' },
        { prompt: 'd/dx [(x^2+3)^(-2)]', answer: '-4x*(x^2+3)^(-3)', solution: 'Chain rule: -2(x^2+3)^(-3)*2x.' },
      ],
    },
    'implicit-diff': {
      type: 'compute',
      instruction: 'Find dy/dx using implicit differentiation.',
      problems: [
        { prompt: 'x^2 + y^2 = 25. Find dy/dx.', answer: '-x/y', solution: '2x + 2y(dy/dx) = 0, so dy/dx = -x/y.' },
        { prompt: 'xy = 6. Find dy/dx.', answer: '-y/x', solution: 'y + x(dy/dx) = 0, so dy/dx = -y/x.' },
        { prompt: 'x^3 + y^3 = 6xy. Find dy/dx.', answer: '(6y - 3x^2)/(3y^2 - 6x)', solution: '3x^2 + 3y^2(dy/dx) = 6y + 6x(dy/dx). Solve for dy/dx.' },
        { prompt: 'sin(xy) = x. Find dy/dx.', answer: '(1 - y*cos(xy))/(x*cos(xy))', solution: 'cos(xy)(y + x dy/dx) = 1. Solve for dy/dx.' },
        { prompt: 'x^2*y + y^3 = 8. Find dy/dx.', answer: '-2xy/(x^2 + 3y^2)', solution: '2xy + x^2(dy/dx) + 3y^2(dy/dx) = 0. Solve for dy/dx.' },
      ],
    },
    'trig-derivatives': {
      type: 'compute',
      instruction: 'Find the derivative.',
      problems: [
        { prompt: 'd/dx [sin(x) + cos(x)]', answer: 'cos(x) - sin(x)', solution: 'cos(x) - sin(x).' },
        { prompt: 'd/dx [tan(x)]', answer: 'sec^2(x)', solution: 'Standard: sec^2(x).' },
        { prompt: 'd/dx [sec(x)]', answer: 'sec(x)*tan(x)', solution: 'Standard: sec(x)tan(x).' },
        { prompt: 'd/dx [arcsin(x)]', answer: '1/sqrt(1-x^2)', solution: 'Standard inverse trig derivative.' },
        { prompt: 'd/dx [arctan(x)]', answer: '1/(1+x^2)', solution: 'Standard: 1/(1+x^2).' },
        { prompt: 'd/dx [x*sin(x)]', answer: 'sin(x) + x*cos(x)', solution: 'Product rule.' },
        { prompt: 'd/dx [cot(x)]', answer: '-csc^2(x)', solution: 'Standard: -csc^2(x).' },
      ],
    },
    'related-rates': {
      type: 'word-problem',
      instruction: 'Solve the related rates problem.',
      problems: [
        { prompt: 'A circle\'s radius grows at 2 cm/s. How fast is the area growing when r=5?', answer: '20*pi', solution: 'A=pi*r^2, dA/dt=2*pi*r*dr/dt=2*pi*5*2=20*pi cm^2/s.' },
        { prompt: 'A 10-ft ladder slides down a wall. The base moves out at 1 ft/s. How fast does the top slide when the base is 6 ft out?', answer: '-3/4', solution: 'x^2+y^2=100. 2x(dx/dt)+2y(dy/dt)=0. y=8. dy/dt=-6/(2*8)=-3/4 ft/s.' },
        { prompt: 'A sphere\'s volume increases at 4*pi cm^3/s. How fast does the radius increase when r=2?', answer: '1/4', solution: 'V=(4/3)pi*r^3. dV/dt=4*pi*r^2*dr/dt. dr/dt=4*pi/(4*pi*4)=1/4 cm/s.' },
        { prompt: 'A cone (r/h=1/3) is filled at 2 m^3/min. How fast does the depth rise when h=6?', answer: '1/(2*pi)', solution: 'r=h/3, V=pi*h^3/27. dV/dt=pi*h^2/9 * dh/dt. dh/dt = 18/(pi*36) = 1/(2*pi).' },
      ],
    },
    'optimization': {
      type: 'word-problem',
      instruction: 'Find the optimal value.',
      problems: [
        { prompt: 'Find two positive numbers whose sum is 20 and whose product is maximum.', answer: '10 and 10', solution: 'P=x(20-x), P\'=20-2x=0, x=10. Max product=100.' },
        { prompt: 'Find the dimensions of a rectangle with perimeter 40 and maximum area.', answer: '10 by 10', solution: 'A=x(20-x), max at x=10. A=100.' },
        { prompt: 'Minimize f(x)=x^2+2/x for x>0.', answer: 'x=1', solution: 'f\'=2x-2/x^2=0, x^3=1, x=1. f(1)=3.' },
        { prompt: 'A box with square base and open top has volume 32. Minimize surface area.', answer: 'base 4, height 2', solution: 'S=x^2+4*32/x. S\'=2x-128/x^2=0. x=4, h=32/16=2.' },
      ],
    },
    'lhopital': {
      type: 'compute',
      instruction: 'Evaluate the limit using L\'Hopital\'s Rule.',
      problems: [
        { prompt: 'lim(x->0) sin(x)/x', answer: '1', solution: '0/0 form. L\'Hopital: cos(x)/1 = 1.' },
        { prompt: 'lim(x->0) (e^x - 1)/x', answer: '1', solution: '0/0 form. L\'Hopital: e^x/1 = 1.' },
        { prompt: 'lim(x->inf) x/e^x', answer: '0', solution: 'inf/inf. L\'Hopital: 1/e^x -> 0.' },
        { prompt: 'lim(x->0) (1-cos(x))/x^2', answer: '1/2', solution: '0/0. L\'Hopital twice: sin(x)/2x -> cos(x)/2 = 1/2.' },
        { prompt: 'lim(x->0) x*ln(x)', answer: '0', solution: 'Rewrite as ln(x)/(1/x). L\'Hopital: (1/x)/(-1/x^2)=-x->0.' },
        { prompt: 'lim(x->inf) ln(x)/sqrt(x)', answer: '0', solution: 'inf/inf. L\'Hopital: (1/x)/(1/(2sqrt(x))) = 2/sqrt(x) -> 0.' },
      ],
    },
    'curve-sketching': {
      type: 'analyze',
      instruction: 'Analyze the function. Find critical points and determine intervals of increase/decrease.',
      problems: [
        { prompt: 'f(x) = x^3 - 3x. Find critical points and classify.', answer: 'x=-1 (local max), x=1 (local min)', solution: 'f\'=3x^2-3=0 at x=+/-1. f\'\'=6x. f\'\'(-1)=-6<0 (max), f\'\'(1)=6>0 (min).' },
        { prompt: 'f(x) = x^4 - 4x^3. Find critical points.', answer: 'x=0, x=3', solution: 'f\'=4x^3-12x^2=4x^2(x-3)=0. x=0,3. x=3 is local min.' },
        { prompt: 'f(x) = x*e^(-x). Find the absolute max.', answer: 'x=1, max=1/e', solution: 'f\'=e^(-x)-x*e^(-x)=e^(-x)(1-x)=0 at x=1. f(1)=1/e.' },
        { prompt: 'f(x) = ln(x)/x for x>0. Find the maximum.', answer: 'x=e, max=1/e', solution: 'f\'=(1-ln(x))/x^2=0 at ln(x)=1, x=e. f(e)=1/e.' },
      ],
    },
    'mvt': {
      type: 'compute',
      instruction: 'Apply the Mean Value Theorem. Find the value c.',
      problems: [
        { prompt: 'f(x)=x^2 on [0,2]. Find c such that f\'(c)=(f(2)-f(0))/(2-0).', answer: '1', solution: 'f\'(c)=2c=(4-0)/2=2. c=1.' },
        { prompt: 'f(x)=x^3 on [0,3]. Find c.', answer: 'sqrt(3)', solution: 'f\'(c)=3c^2=(27-0)/3=9. c^2=3, c=sqrt(3).' },
        { prompt: 'f(x)=sqrt(x) on [1,4]. Find c.', answer: '9/4', solution: 'f\'(c)=1/(2sqrt(c))=(2-1)/3=1/3. sqrt(c)=3/2, c=9/4.' },
        { prompt: 'f(x)=1/x on [1,2]. Find c.', answer: 'sqrt(2)', solution: 'f\'(c)=-1/c^2=(-1/2)/1=-1/2. c^2=2, c=sqrt(2).' },
      ],
    },
    'riemann-sums': {
      type: 'compute',
      instruction: 'Compute the Riemann sum.',
      problems: [
        { prompt: 'Left Riemann sum for f(x)=x^2 on [0,2] with n=4.', answer: '1.75', solution: 'dx=0.5. Sum: 0^2+0.5^2+1^2+1.5^2 = 0+0.25+1+2.25 = 3.5. Times 0.5 = 1.75.' },
        { prompt: 'Right Riemann sum for f(x)=x on [0,4] with n=4.', answer: '10', solution: 'dx=1. Sum: 1+2+3+4 = 10.' },
        { prompt: 'Midpoint sum for f(x)=x^2 on [0,2] with n=2.', answer: '2.5', solution: 'dx=1. Midpoints: 0.5, 1.5. Sum: 0.25+2.25 = 2.5.' },
        { prompt: 'Left Riemann sum for f(x)=1/x on [1,3] with n=4.', answer: '77/60', solution: 'dx=0.5. f(1)+f(1.5)+f(2)+f(2.5) = 1+2/3+1/2+2/5 = 77/30. Times 0.5 = 77/60.' },
      ],
    },
    'ftc': {
      type: 'compute',
      instruction: 'Evaluate the definite integral using the Fundamental Theorem of Calculus.',
      problems: [
        { prompt: 'integral from 0 to 2 of x^2 dx', answer: '8/3', solution: '[x^3/3] from 0 to 2 = 8/3.' },
        { prompt: 'integral from 0 to pi of sin(x) dx', answer: '2', solution: '[-cos(x)] from 0 to pi = -(-1)-(-1) = 2.' },
        { prompt: 'integral from 1 to e of (1/x) dx', answer: '1', solution: '[ln(x)] from 1 to e = 1 - 0 = 1.' },
        { prompt: 'integral from 0 to 1 of e^x dx', answer: 'e-1', solution: '[e^x] from 0 to 1 = e - 1.' },
        { prompt: 'integral from 1 to 4 of sqrt(x) dx', answer: '14/3', solution: '[(2/3)x^(3/2)] from 1 to 4 = (2/3)(8-1) = 14/3.' },
        { prompt: 'd/dx integral from 0 to x of t^3 dt', answer: 'x^3', solution: 'FTC Part I: the derivative is the integrand at x.' },
      ],
    },
    'u-substitution': {
      type: 'compute',
      instruction: 'Evaluate the integral using u-substitution.',
      problems: [
        { prompt: 'integral of 2x*cos(x^2) dx', answer: 'sin(x^2) + C', solution: 'u=x^2, du=2x dx. integral cos(u)du = sin(u)+C.' },
        { prompt: 'integral of x*e^(x^2) dx', answer: '(1/2)*e^(x^2) + C', solution: 'u=x^2, du=2x dx. (1/2)*integral e^u du = (1/2)e^(x^2)+C.' },
        { prompt: 'integral of (3x^2)/(x^3+1) dx', answer: 'ln|x^3+1| + C', solution: 'u=x^3+1, du=3x^2 dx. integral du/u = ln|u|+C.' },
        { prompt: 'integral of sin(5x) dx', answer: '(-1/5)*cos(5x) + C', solution: 'u=5x, du=5dx. (1/5)*integral sin(u)du = -cos(5x)/5+C.' },
        { prompt: 'integral of x*sqrt(x^2+1) dx', answer: '(1/3)*(x^2+1)^(3/2) + C', solution: 'u=x^2+1, du=2x dx. (1/2)*integral u^(1/2) du = (1/3)u^(3/2)+C.' },
      ],
    },
    'area-between-curves': {
      type: 'compute',
      instruction: 'Find the area between the curves.',
      problems: [
        { prompt: 'Area between y=x^2 and y=x from x=0 to x=1.', answer: '1/6', solution: 'integral_0^1 (x - x^2) dx = [x^2/2 - x^3/3] = 1/2 - 1/3 = 1/6.' },
        { prompt: 'Area between y=x^2 and y=4.', answer: '32/3', solution: 'x from -2 to 2. integral_{-2}^2 (4-x^2) dx = [4x-x^3/3] = 32/3.' },
        { prompt: 'Area between y=sqrt(x) and y=x from x=0 to x=1.', answer: '1/6', solution: 'integral_0^1 (sqrt(x)-x) dx = [2x^(3/2)/3-x^2/2] = 2/3-1/2=1/6.' },
        { prompt: 'Area between y=e^x and y=1 from x=0 to x=1.', answer: 'e-2', solution: 'integral_0^1 (e^x - 1) dx = [e^x - x] = (e-1)-1 = e-2.' },
      ],
    },
  },
  'calc-2': {
    'by-parts': {
      type: 'compute',
      instruction: 'Evaluate the integral using integration by parts.',
      problems: [
        { prompt: 'integral of x*e^x dx', answer: 'x*e^x - e^x + C', solution: 'u=x, dv=e^x dx. uv - integral v du = x*e^x - e^x + C.' },
        { prompt: 'integral of x*sin(x) dx', answer: '-x*cos(x) + sin(x) + C', solution: 'u=x, dv=sin(x)dx. -x*cos(x) + integral cos(x)dx.' },
        { prompt: 'integral of ln(x) dx', answer: 'x*ln(x) - x + C', solution: 'u=ln(x), dv=dx. x*ln(x) - integral dx = x*ln(x)-x+C.' },
        { prompt: 'integral of x^2*e^x dx', answer: 'x^2*e^x - 2x*e^x + 2*e^x + C', solution: 'By parts twice. Tabular method: x^2,2x,2 / e^x,e^x,e^x.' },
        { prompt: 'integral of x*cos(x) dx', answer: 'x*sin(x) + cos(x) + C', solution: 'u=x, dv=cos(x)dx. x*sin(x) - integral sin(x)dx = x*sin(x)+cos(x)+C.' },
        { prompt: 'integral of arctan(x) dx', answer: 'x*arctan(x) - (1/2)*ln(1+x^2) + C', solution: 'u=arctan(x), dv=dx. x*arctan(x) - integral x/(1+x^2)dx.' },
      ],
    },
    'trig-integrals': {
      type: 'compute',
      instruction: 'Evaluate the trigonometric integral.',
      problems: [
        { prompt: 'integral of sin^2(x) dx', answer: 'x/2 - sin(2x)/4 + C', solution: 'Half-angle: sin^2=(1-cos2x)/2. Integrate.' },
        { prompt: 'integral of cos^3(x) dx', answer: 'sin(x) - sin^3(x)/3 + C', solution: 'cos^3=cos*(1-sin^2). u=sin(x).' },
        { prompt: 'integral of sin^3(x)*cos^2(x) dx', answer: '-cos^3(x)/3 + cos^5(x)/5 + C', solution: 'sin^3=sin*(1-cos^2). u=cos(x).' },
        { prompt: 'integral of tan^2(x) dx', answer: 'tan(x) - x + C', solution: 'tan^2 = sec^2 - 1. Integrate: tan(x) - x + C.' },
        { prompt: 'integral of sec^3(x) dx', answer: '(1/2)*sec(x)*tan(x) + (1/2)*ln|sec(x)+tan(x)| + C', solution: 'By parts with u=sec(x), dv=sec^2(x)dx, then use identity.' },
      ],
    },
    'trig-substitution': {
      type: 'compute',
      instruction: 'Evaluate the integral using trig substitution.',
      problems: [
        { prompt: 'integral of dx/sqrt(4-x^2)', answer: 'arcsin(x/2) + C', solution: 'x=2sin(t). dx=2cos(t)dt. sqrt(4-4sin^2)=2cos(t). Result: arcsin(x/2)+C.' },
        { prompt: 'integral of dx/(x^2+9)', answer: '(1/3)*arctan(x/3) + C', solution: 'x=3tan(t). Standard form: (1/3)arctan(x/3)+C.' },
        { prompt: 'integral of sqrt(1-x^2) dx', answer: '(1/2)*arcsin(x) + (1/2)*x*sqrt(1-x^2) + C', solution: 'x=sin(t). integral cos^2(t)dt = t/2 + sin(2t)/4.' },
        { prompt: 'integral of dx/sqrt(x^2+1)', answer: 'ln|x + sqrt(x^2+1)| + C', solution: 'x=tan(t). integral sec(t)dt = ln|sec(t)+tan(t)|+C.' },
        { prompt: 'integral of x^2/sqrt(9-x^2) dx', answer: '(9/2)*arcsin(x/3) - (x/2)*sqrt(9-x^2) + C', solution: 'x=3sin(t). integral 9sin^2(t)dt.' },
      ],
    },
    'partial-fractions': {
      type: 'compute',
      instruction: 'Evaluate the integral using partial fractions.',
      problems: [
        { prompt: 'integral of dx/((x-1)(x+1))', answer: '(1/2)*ln|x-1| - (1/2)*ln|x+1| + C', solution: '1/((x-1)(x+1)) = (1/2)/(x-1) - (1/2)/(x+1).' },
        { prompt: 'integral of (2x+3)/(x^2+3x+2) dx', answer: 'ln|x+1| + ln|x+2| + C', solution: 'Factor: (x+1)(x+2). PF: 1/(x+1) + 1/(x+2).' },
        { prompt: 'integral of x/(x^2-1) dx', answer: '(1/2)*ln|x^2-1| + C', solution: 'Or note x/(x^2-1) has u-sub with u=x^2-1, or PF: (1/2)/(x-1)+(1/2)/(x+1).' },
        { prompt: 'integral of dx/(x^2(x+1))', answer: '-ln|x| - 1/x + ln|x+1| + C', solution: 'PF: A/x + B/x^2 + C/(x+1). A=-1, B=1, C=1.' },
        { prompt: 'integral of (3x+5)/((x+1)(x+2)) dx', answer: '2*ln|x+1| + ln|x+2| + C', solution: 'PF: 2/(x+1) + 1/(x+2).' },
      ],
    },
    'improper-integrals': {
      type: 'compute',
      instruction: 'Evaluate the improper integral or determine if it diverges.',
      problems: [
        { prompt: 'integral from 1 to infinity of 1/x^2 dx', answer: '1', solution: 'lim_{b->inf} [-1/x] from 1 to b = 0-(-1) = 1.' },
        { prompt: 'integral from 1 to infinity of 1/x dx', answer: 'diverges', solution: 'lim_{b->inf} ln(b) = infinity. Diverges.' },
        { prompt: 'integral from 0 to 1 of 1/sqrt(x) dx', answer: '2', solution: 'lim_{a->0+} [2sqrt(x)] from a to 1 = 2-0 = 2.' },
        { prompt: 'integral from 0 to infinity of e^(-x) dx', answer: '1', solution: 'lim_{b->inf} [-e^(-x)] from 0 to b = 0-(-1) = 1.' },
        { prompt: 'integral from 1 to infinity of 1/x^(3/2) dx', answer: '2', solution: '[-2/sqrt(x)] from 1 to inf = 0-(-2) = 2.' },
      ],
    },
    'volume-revolution': {
      type: 'compute',
      instruction: 'Find the volume of revolution.',
      problems: [
        { prompt: 'y=x^2 from x=0 to x=2 revolved about x-axis (disk method).', answer: '32*pi/5', solution: 'V=pi*integral_0^2 x^4 dx = pi[x^5/5] = 32*pi/5.' },
        { prompt: 'y=sqrt(x) from x=0 to x=4 revolved about x-axis.', answer: '8*pi', solution: 'V=pi*integral_0^4 x dx = pi[x^2/2] = 8*pi.' },
        { prompt: 'y=x from x=0 to x=1 revolved about y-axis (shell method).', answer: '2*pi/3', solution: 'V=2*pi*integral_0^1 x*x dx = 2*pi[x^3/3] = 2*pi/3.' },
        { prompt: 'y=1/x from x=1 to x=3 revolved about x-axis.', answer: '2*pi/3', solution: 'V=pi*integral_1^3 1/x^2 dx = pi[-1/x] = pi(1-1/3) = 2*pi/3.' },
      ],
    },
    'arc-length': {
      type: 'compute',
      instruction: 'Set up or evaluate the arc length integral.',
      problems: [
        { prompt: 'Arc length of y=x^(3/2) from x=0 to x=4.', answer: '(1/27)*(40*sqrt(10)-8)', solution: 'L=integral sqrt(1+(3/2*sqrt(x))^2)dx = integral sqrt(1+9x/4)dx.' },
        { prompt: 'Arc length of y=(2/3)*x^(3/2) from x=0 to x=3.', answer: '14/3', solution: 'y\'=sqrt(x). L=integral_0^3 sqrt(1+x)dx = [(2/3)(1+x)^(3/2)]_0^3 = (2/3)(8-1) = 14/3.' },
        { prompt: 'Arc length of y=x^2/2 from x=0 to x=1.', answer: 'integral from 0 to 1 of sqrt(1+x^2) dx', solution: 'y\'=x. L=integral sqrt(1+x^2)dx (requires trig sub).' },
      ],
    },
    'surface-area': {
      type: 'compute',
      instruction: 'Set up the surface area integral for revolution about the x-axis.',
      problems: [
        { prompt: 'y=sqrt(x) from x=1 to x=4, revolved about x-axis.', answer: '2*pi*integral_1^4 sqrt(x)*sqrt(1+1/(4x)) dx', solution: 'SA = 2*pi*integral f(x)*sqrt(1+f\'(x)^2) dx.' },
        { prompt: 'y=x from x=0 to x=1, revolved about x-axis.', answer: 'pi*sqrt(2)', solution: 'SA=2*pi*integral_0^1 x*sqrt(2) dx = pi*sqrt(2).' },
      ],
    },
    'work-applications': {
      type: 'word-problem',
      instruction: 'Compute the work done.',
      problems: [
        { prompt: 'A spring with k=10 N/m is stretched 0.5m from natural length. Find the work.', answer: '1.25 J', solution: 'W=integral_0^0.5 10x dx = 5(0.25) = 1.25 J.' },
        { prompt: 'Pump water from a full cylindrical tank (radius 2m, height 5m) to the top. Density=1000 kg/m^3.', answer: '50000*pi*g', solution: 'W=integral_0^5 1000*g*pi*4*(5-y)dy = 4000*pi*g*[5y-y^2/2] = 50000*pi*g.' },
        { prompt: 'A 50-lb rope (100 ft) hangs from a cliff. Lift it all. Find the work.', answer: '2500 ft-lb', solution: 'W=integral_0^100 (0.5)*x dx = 0.25*10000 = 2500 ft-lb.' },
      ],
    },
    'sequences': {
      type: 'compute',
      instruction: 'Determine if the sequence converges or diverges. If it converges, find the limit.',
      problems: [
        { prompt: 'a_n = (2n+1)/(3n-1)', answer: '2/3', solution: 'Divide by n: (2+1/n)/(3-1/n) -> 2/3.' },
        { prompt: 'a_n = (-1)^n / n', answer: '0', solution: '|a_n| = 1/n -> 0. By squeeze theorem, a_n -> 0.' },
        { prompt: 'a_n = n / e^n', answer: '0', solution: 'Exponential dominates polynomial. L\'Hopital: 1/e^n -> 0.' },
        { prompt: 'a_n = (1 + 1/n)^n', answer: 'e', solution: 'Definition of e: lim (1+1/n)^n = e.' },
        { prompt: 'a_n = sin(n)/n', answer: '0', solution: '-1/n <= sin(n)/n <= 1/n. By squeeze theorem, limit is 0.' },
        { prompt: 'a_n = n^2 / (n+1)', answer: 'diverges', solution: 'n^2/(n+1) ~ n -> infinity. Diverges.' },
      ],
    },
    'series-convergence': {
      type: 'analyze',
      instruction: 'Determine if the series converges or diverges. State the test used.',
      problems: [
        { prompt: 'sum n=1 to inf of 1/n^2', answer: 'converges', solution: 'p-series with p=2>1. Converges (to pi^2/6).' },
        { prompt: 'sum n=1 to inf of 1/n', answer: 'diverges', solution: 'Harmonic series (p-series with p=1). Diverges.' },
        { prompt: 'sum n=0 to inf of (1/2)^n', answer: 'converges', solution: 'Geometric series with |r|=1/2<1. Converges to 1/(1-1/2)=2.' },
        { prompt: 'sum n=1 to inf of n/(n^2+1)', answer: 'diverges', solution: 'Limit comparison with 1/n: n/(n^2+1) / (1/n) = n^2/(n^2+1) -> 1. Since harmonic diverges, this diverges.' },
        { prompt: 'sum n=1 to inf of (-1)^(n+1)/n', answer: 'converges', solution: 'Alternating series: 1/n is decreasing and -> 0. Converges conditionally (to ln 2).' },
        { prompt: 'sum n=0 to inf of n!/n^n', answer: 'converges', solution: 'Ratio test: a_{n+1}/a_n = (n/(n+1))^n -> 1/e < 1. Converges.' },
      ],
    },
    'taylor-maclaurin': {
      type: 'compute',
      instruction: 'Find the Taylor or Maclaurin series.',
      problems: [
        { prompt: 'Maclaurin series for e^x up to x^4.', answer: '1 + x + x^2/2 + x^3/6 + x^4/24', solution: 'e^x = sum x^n/n!. First 5 terms: 1+x+x^2/2!+x^3/3!+x^4/4!.' },
        { prompt: 'Maclaurin series for sin(x) up to x^5.', answer: 'x - x^3/6 + x^5/120', solution: 'sin(x) = sum (-1)^n x^(2n+1)/(2n+1)!. First 3 terms.' },
        { prompt: 'Maclaurin series for cos(x) up to x^4.', answer: '1 - x^2/2 + x^4/24', solution: 'cos(x) = sum (-1)^n x^(2n)/(2n)!. First 3 terms.' },
        { prompt: 'Maclaurin series for 1/(1-x).', answer: '1 + x + x^2 + x^3 + ...', solution: 'Geometric series: sum x^n for |x|<1.' },
        { prompt: 'Maclaurin series for ln(1+x) up to x^4.', answer: 'x - x^2/2 + x^3/3 - x^4/4', solution: 'ln(1+x) = sum (-1)^(n+1) x^n/n. First 4 terms.' },
        { prompt: 'Taylor series for e^x centered at a=1, up to (x-1)^2.', answer: 'e + e*(x-1) + e*(x-1)^2/2', solution: 'f^(n)(1)=e for all n. T(x)=e*sum (x-1)^n/n!.' },
      ],
    },
    'parametric-curves': {
      type: 'compute',
      instruction: 'Solve the parametric curve problem.',
      problems: [
        { prompt: 'x=cos(t), y=sin(t), 0<=t<=2*pi. Find dy/dx.', answer: '-cos(t)/sin(t)', solution: 'dy/dx = (dy/dt)/(dx/dt) = cos(t)/(-sin(t)) = -cot(t).' },
        { prompt: 'x=t^2, y=t^3. Find dy/dx.', answer: '3t/2', solution: 'dy/dx = (3t^2)/(2t) = 3t/2.' },
        { prompt: 'x=2cos(t), y=3sin(t). Eliminate the parameter.', answer: 'x^2/4 + y^2/9 = 1', solution: 'cos(t)=x/2, sin(t)=y/3. cos^2+sin^2=1 gives x^2/4+y^2/9=1.' },
        { prompt: 'x=t, y=t^2, 0<=t<=1. Find the arc length.', answer: 'integral from 0 to 1 of sqrt(1+4t^2) dt', solution: 'L=integral sqrt((dx/dt)^2+(dy/dt)^2) dt = integral sqrt(1+4t^2) dt.' },
        { prompt: 'x=e^t, y=e^(-t). Find d^2y/dx^2.', answer: '2*e^(-3t)', solution: 'dy/dx = -e^(-2t). d/dt(dy/dx) = 2e^(-2t). d^2y/dx^2 = 2e^(-2t)/e^t = 2e^(-3t).' },
      ],
    },
    'polar-coordinates': {
      type: 'compute',
      instruction: 'Solve the polar coordinates problem.',
      problems: [
        { prompt: 'Convert (x,y)=(1,1) to polar coordinates.', answer: '(sqrt(2), pi/4)', solution: 'r=sqrt(1+1)=sqrt(2). theta=arctan(1/1)=pi/4.' },
        { prompt: 'Find the area enclosed by r=2*cos(theta).', answer: 'pi', solution: 'A=(1/2)*integral_0^pi (2cos(theta))^2 d(theta) = 2*integral_0^pi cos^2(theta) = pi.' },
        { prompt: 'Convert r=3 to rectangular form.', answer: 'x^2 + y^2 = 9', solution: 'r=3 means r^2=9, so x^2+y^2=9.' },
        { prompt: 'Find dy/dx for r=1+cos(theta) at theta=pi/2.', answer: '1', solution: 'x=r*cos, y=r*sin. At theta=pi/2: r=1, dr/dθ=-1. dy/dx = (dy/dθ)/(dx/dθ) = (dr*sin+r*cos)/(dr*cos-r*sin) = (-1·1+1·0)/(-1·0-1·1) = -1/(-1) = 1.' },
        { prompt: 'Area inside r=2 and outside r=2(1-cos(theta)).', answer: '8 - pi', solution: 'Intersection at theta=pi/2, 3pi/2. A=(1/2)∫_{-π/2}^{π/2} [4 - 4(1-cosθ)^2] dθ = (1/2)(16-2π) = 8-π.' },
      ],
    },
  },
  'calc-3': {
    'partial-derivatives': {
      type: 'compute',
      instruction: 'Find the partial derivative.',
      problems: [
        { prompt: 'f(x,y) = x^2*y + y^3. Find df/dx.', answer: '2xy', solution: 'Treat y as constant: df/dx = 2xy.' },
        { prompt: 'f(x,y) = x^2*y + y^3. Find df/dy.', answer: 'x^2 + 3y^2', solution: 'Treat x as constant: df/dy = x^2 + 3y^2.' },
        { prompt: 'f(x,y) = e^(xy). Find df/dx.', answer: 'y*e^(xy)', solution: 'Chain rule: df/dx = y*e^(xy).' },
        { prompt: 'f(x,y) = ln(x^2+y^2). Find df/dx.', answer: '2x/(x^2+y^2)', solution: 'Chain rule: 2x/(x^2+y^2).' },
        { prompt: 'f(x,y,z) = xyz + z^2. Find df/dz.', answer: 'xy + 2z', solution: 'Treat x,y as constant: xy + 2z.' },
        { prompt: 'f(x,y) = sin(x)*cos(y). Find d^2f/dxdy.', answer: '-cos(x)*sin(y)', solution: 'df/dx=cos(x)cos(y). d/dy of that = -cos(x)sin(y).' },
      ],
    },
    'gradient': {
      type: 'compute',
      instruction: 'Find the gradient vector.',
      problems: [
        { prompt: 'f(x,y) = x^2 + xy + y^2. Find grad f.', answer: '(2x+y, x+2y)', solution: 'grad f = (df/dx, df/dy) = (2x+y, x+2y).' },
        { prompt: 'f(x,y) = e^x*sin(y). Find grad f.', answer: '(e^x*sin(y), e^x*cos(y))', solution: 'grad f = (e^x*sin(y), e^x*cos(y)).' },
        { prompt: 'f(x,y,z) = x^2+y^2+z^2. Find grad f at (1,2,3).', answer: '(2,4,6)', solution: 'grad f = (2x,2y,2z). At (1,2,3): (2,4,6).' },
        { prompt: 'f(x,y) = x^2*y - y^3. Find grad f at (1,1).', answer: '(2,-2)', solution: 'grad f = (2xy, x^2-3y^2). At (1,1): (2,-2).' },
      ],
    },
    'directional-derivatives': {
      type: 'compute',
      instruction: 'Find the directional derivative.',
      problems: [
        { prompt: 'f(x,y)=x^2+y^2 at (1,1) in direction u=(1/sqrt(2), 1/sqrt(2)).', answer: '2*sqrt(2)', solution: 'grad f = (2,2). D_u f = (2,2) . u = 4/sqrt(2) = 2sqrt(2).' },
        { prompt: 'f(x,y)=xy at (3,4) in direction of v=(3,4).', answer: '24/5', solution: 'grad f=(y,x)=(4,3). u=(3/5,4/5). D_u=(4)(3/5)+(3)(4/5)=12/5+12/5=24/5.' },
        { prompt: 'f(x,y)=e^x*cos(y) at (0,0) in direction u=(0,1).', answer: '0', solution: 'grad f=(e^x*cos(y), -e^x*sin(y))=(1,0) at (0,0). D_u=0.' },
      ],
    },
    'chain-rule-multi': {
      type: 'compute',
      instruction: 'Apply the multivariable chain rule.',
      problems: [
        { prompt: 'z=x^2+y^2, x=t, y=t^2. Find dz/dt.', answer: '2t + 4t^3', solution: 'dz/dt = 2x*1 + 2y*2t = 2t + 4t^3.' },
        { prompt: 'z=xy, x=cos(t), y=sin(t). Find dz/dt.', answer: 'cos(2t)', solution: 'dz/dt = y*(-sin(t)) + x*cos(t) = -sin^2(t)+cos^2(t) = cos(2t).' },
        { prompt: 'z=e^(x+y), x=t^2, y=3t. Find dz/dt at t=0.', answer: '3', solution: 'dz/dt = e^(x+y)*(2t+3). At t=0: e^0*3 = 3.' },
      ],
    },
    'lagrange-multipliers': {
      type: 'compute',
      instruction: 'Use Lagrange multipliers to find the extremum.',
      problems: [
        { prompt: 'Maximize f(x,y)=xy subject to x+y=10.', answer: '25', solution: 'grad f = lambda*grad g: (y,x) = lambda(1,1). So x=y. x+y=10 gives x=y=5. f=25.' },
        { prompt: 'Minimize f(x,y)=x^2+y^2 subject to x+y=1.', answer: '1/2', solution: '(2x,2y) = lambda(1,1). x=y. x+y=1 gives x=y=1/2. f=1/2.' },
        { prompt: 'Maximize f(x,y,z)=xyz subject to x+y+z=12, x,y,z>0.', answer: '64', solution: 'By symmetry x=y=z=4. f=64.' },
      ],
    },
    'line-integrals': {
      type: 'compute',
      instruction: 'Evaluate the line integral.',
      problems: [
        { prompt: 'integral_C (x+y) ds, C: r(t)=(t,t) for t in [0,1].', answer: 'sqrt(2)', solution: '|r\'|=sqrt(2). integral_0^1 2t*sqrt(2) dt = sqrt(2).' },
        { prompt: 'integral_C F.dr, F=(y,x), C: r(t)=(cos(t),sin(t)), t in [0,pi/2].', answer: '0', solution: 'F=(y,x)=(sin t, cos t), r\'=(-sin t, cos t). F.r\' = -sin^2t+cos^2t = cos(2t). Integral = [sin(2t)/2]_0^{pi/2} = 0.' },
        { prompt: 'integral_C y dx + x dy, C: straight line from (0,0) to (1,1).', answer: '1', solution: 'r(t)=(t,t). dx=dt, dy=dt. integral_0^1 (t+t)dt = 1.' },
      ],
    },
    'greens-theorem': {
      type: 'compute',
      instruction: 'Apply Green\'s Theorem.',
      problems: [
        { prompt: 'Evaluate integral_C (y dx - x dy), C: unit circle CCW.', answer: '-2*pi', solution: 'dN/dx - dM/dy = -1-1 = -2. Double integral over disk: -2*pi*1^2 = -2*pi.' },
        { prompt: 'integral_C (x^2 dx + xy dy), C: boundary of [0,1]x[0,1] CCW.', answer: '1/2', solution: 'dN/dx - dM/dy = y - 0 = y. integral_0^1 integral_0^1 y dy dx = 1/2.' },
        { prompt: 'Use Green\'s to find area of ellipse x^2/a^2+y^2/b^2=1.', answer: 'pi*a*b', solution: 'A = (1/2) integral_C (x dy - y dx). For ellipse: pi*a*b.' },
      ],
    },
    'surface-integrals': {
      type: 'compute',
      instruction: 'Set up or evaluate the surface integral.',
      problems: [
        { prompt: 'integral_S z dS, S: z=x+y over [0,1]x[0,1].', answer: 'sqrt(3)', solution: '|n| = sqrt(1+1+1) = sqrt(3). integral_0^1 integral_0^1 (x+y)*sqrt(3) dA = sqrt(3).' },
        { prompt: 'Flux of F=(0,0,1) through z=0, 0<=x,y<=1 (upward normal).', answer: '1', solution: 'n=(0,0,1). F.n=1. integral = 1.' },
      ],
    },
    'stokes-theorem': {
      type: 'compute',
      instruction: 'Apply Stokes\' Theorem.',
      problems: [
        { prompt: 'F=(y,-x,z). Verify Stokes\' for S: z=0, x^2+y^2<=1.', answer: '-2*pi', solution: 'curl F = (0,0,-2). integral_S curl F . dS = -2*pi*1^2 = -2*pi.' },
        { prompt: 'F=(-y,x,0). Find integral_C F.dr where C is unit circle in z=0.', answer: '2*pi', solution: 'curl F = (0,0,2). By Stokes: integral_S 2 dA = 2*pi.' },
      ],
    },
    'divergence-theorem': {
      type: 'compute',
      instruction: 'Apply the Divergence Theorem.',
      problems: [
        { prompt: 'F=(x,y,z). Flux through unit sphere.', answer: '4*pi', solution: 'div F = 3. integral_V 3 dV = 3*(4*pi/3) = 4*pi.' },
        { prompt: 'F=(x^2,y^2,z^2). Flux through cube [0,1]^3.', answer: '3', solution: 'div F = 2x+2y+2z. integral = 3*integral_0^1 2u du = 3*1 = 3.' },
        { prompt: 'F=(x,0,0). Flux through sphere of radius R.', answer: '(4/3)*pi*R^3', solution: 'div F = 1. integral_V 1 dV = (4/3)*pi*R^3.' },
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
  return { studentId: id, course: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
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

function norm(s) { return String(s).toLowerCase().trim().replace(/\s+/g, ' '); }

// Exercise generation

function generateExercise(course, skill, count = 5) {
  const bank = PROBLEM_BANKS[course]?.[skill];
  if (!bank) return { error: `No problem bank for ${course}/${skill}` };
  const items = pick(bank.problems, count);
  return { type: bank.type, skill, course, count: items.length, instruction: bank.instruction, items };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  const ne = norm(expected), na = norm(answer);
  if (ne === na) return true;
  // Allow some flexibility for equivalent forms
  if (ne.replace(/[*\s]/g, '') === na.replace(/[*\s]/g, '')) return true;
  return false;
}

// Public API

class Calculus {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, course: p.course, createdAt: p.createdAt, totalAssessments: p.assessments.length };
  }

  setCourse(id, course) {
    if (!SKILLS[course]) throw new Error(`Unknown course: ${course}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    const p = loadProfile(id); p.course = course; saveProfile(p);
    return { studentId: id, course };
  }

  recordAssessment(id, course, category, skill, score, total, notes = '') {
    if (!SKILLS[course]) throw new Error(`Unknown course: ${course}`);
    if (!SKILLS[course][category]) throw new Error(`Unknown category '${category}' for ${course}`);
    if (!SKILLS[course][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${course}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);

    const p = loadProfile(id);
    if (!p.course) p.course = course;
    const entry = { date: new Date().toISOString(), course, category, skill, score, total, notes };
    p.assessments.push(entry);
    const key = `${course}/${category}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p);
    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const course = p.course || 'calc-1';
    const gs = SKILLS[course] || {};
    const results = {};
    let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(gs)) {
      results[cat] = {};
      for (const sk of skills) {
        total++;
        const d = p.skills[`${course}/${cat}/${sk}`];
        results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
      }
    }
    return { studentId: id, course, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id);
    const course = p.course || 'calc-1';
    const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS[course] || {})) {
      for (const sk of skills) {
        const d = p.skills[`${course}/${cat}/${sk}`];
        const m = d ? d.mastery : 0;
        if (m < MASTERY_THRESHOLD) candidates.push({ course, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' });
      }
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, course, next: candidates.slice(0, count) };
  }

  getReport(id) {
    const p = loadProfile(id);
    return { studentId: id, course: p.course, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }

  getSkillCatalog(course) {
    const gs = SKILLS[course];
    if (!gs) return { course, error: `Unknown course. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0;
    const catalog = {};
    for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; }
    return { course, skills: catalog, totalSkills: total };
  }

  generateExercise(course, skill, count = 5) { return generateExercise(course, skill, count); }

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  generateLesson(id) {
    const p = loadProfile(id);
    const course = p.course || 'calc-1';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${course} level are proficient! Ready for next course.`, course };
    const exercise = generateExercise(course, target.skill, 5);
    return {
      studentId: id, course, targetSkill: target, exercise,
      lessonPlan: {
        review: 'Review prerequisite concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice problems`,
        apply: 'Work through one applied or conceptual problem',
      },
    };
  }
}

module.exports = Calculus;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new Calculus();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, course] = args;
        if (!id) throw new Error('Usage: start <id> [course]');
        if (course) api.setCourse(id, course);
        out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const course = loadProfile(id).course || 'calc-1';
        if (skill) { out(api.generateExercise(course, skill, 5)); }
        else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(course, n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(api.checkAnswer(type, expected, answer));
        break;
      }
      case 'record': {
        const [, id, course, cat, skill, sc, tot, ...notes] = args;
        if (!id || !course || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <course> <cat> <skill> <score> <total>');
        out(api.recordAssessment(id, course, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, c] = args; out(c ? api.getSkillCatalog(c) : { courses: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-course': { const [, id, c] = args; if (!id || !c) throw new Error('Usage: set-course <id> <course>'); out(api.setCourse(id, c)); break; }
      default: out({ usage: 'node calculus.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-course'], courses: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
