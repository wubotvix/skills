// College Math Differential Equations Interactive Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-math-differential-equations');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'first-order-odes': ['separable', 'linear-first-order', 'exact-equations', 'bernoulli', 'applications-first-order'],
  'second-order-linear': ['constant-coefficients', 'undetermined-coefficients', 'variation-of-parameters', 'applications-second-order'],
  'systems-of-odes': ['matrix-methods', 'eigenvalue-approach', 'phase-portraits', 'stability-classification'],
  'laplace-transforms': ['forward-transforms', 'inverse-transforms', 'solving-ivps', 'step-functions', 'convolution'],
  'series-solutions': ['power-series-method', 'ordinary-points', 'frobenius-method', 'bessel-legendre'],
  'numerical-methods': ['euler-method', 'improved-euler', 'runge-kutta', 'error-analysis'],
  'intro-pdes': ['heat-equation', 'wave-equation', 'laplace-equation', 'separation-of-variables'],
};

const PROBLEM_BANKS = {
  'separable': {
    type: 'compute',
    instruction: 'Solve the separable ODE.',
    problems: [
      { prompt: 'dy/dx = xy. Solve.', answer: 'y = Ce^(x^2/2)', solution: 'dy/y = x dx. ln|y| = x^2/2 + C. y = Ce^(x^2/2).' },
      { prompt: 'dy/dx = y^2. Solve.', answer: 'y = -1/(x+C)', solution: 'dy/y^2 = dx. -1/y = x+C. y = -1/(x+C).' },
      { prompt: 'dy/dx = x/y. Solve.', answer: 'y^2 = x^2 + C', solution: 'y dy = x dx. y^2/2 = x^2/2 + C.' },
      { prompt: 'dy/dx = e^(x+y). Solve.', answer: '-e^(-y) = e^x + C', solution: 'e^(-y) dy = e^x dx. -e^(-y) = e^x + C.' },
      { prompt: 'dy/dx = (1+y^2)/(1+x^2). Solve.', answer: 'arctan(y) = arctan(x) + C', solution: 'dy/(1+y^2) = dx/(1+x^2). Integrate both sides.' },
      { prompt: 'dy/dx = y/x, y(1)=2. Solve.', answer: 'y = 2x', solution: 'dy/y = dx/x. ln|y|=ln|x|+C. y=Cx. y(1)=2 gives C=2.' },
    ],
  },
  'linear-first-order': {
    type: 'compute',
    instruction: 'Solve the first-order linear ODE.',
    problems: [
      { prompt: "y' + 2y = 4. Solve.", answer: 'y = 2 + Ce^(-2x)', solution: 'IF=e^(2x). (ye^(2x))\' = 4e^(2x). ye^(2x) = 2e^(2x)+C.' },
      { prompt: "y' + y = e^x. Solve.", answer: 'y = e^x/2 + Ce^(-x)', solution: 'IF=e^x. (ye^x)\' = e^(2x). ye^x = e^(2x)/2 + C.' },
      { prompt: "y' - 3y = 0. Solve.", answer: 'y = Ce^(3x)', solution: 'IF=e^(-3x). (ye^(-3x))\' = 0. y = Ce^(3x).' },
      { prompt: "xy' + y = x^2, x>0. Solve.", answer: 'y = x^2/3 + C/x', solution: 'y\' + y/x = x. IF=x. (xy)\' = x^2. xy = x^3/3 + C.' },
      { prompt: "y' + y/x = sin(x)/x, x>0. Solve.", answer: 'y = (-cos(x) + C)/x', solution: 'IF=x. (xy)\' = sin(x). xy = -cos(x) + C.' },
    ],
  },
  'exact-equations': {
    type: 'compute',
    instruction: 'Solve the exact ODE or show it is not exact.',
    problems: [
      { prompt: '(2xy + 3)dx + (x^2 + 4y)dy = 0. Solve.', answer: 'x^2*y + 3x + 2y^2 = C', solution: 'M_y=2x=N_x. F=x^2*y+3x+2y^2=C.' },
      { prompt: '(y*cos(x) + 2x)dx + sin(x)dy = 0. Solve.', answer: 'y*sin(x) + x^2 = C', solution: 'M_y=cos(x)=N_x. F=y*sin(x)+x^2.' },
      { prompt: '(3x^2 + y)dx + (x + 2y)dy = 0. Solve.', answer: 'x^3 + xy + y^2 = C', solution: 'M_y=1=N_x. Exact. F=x^3+xy+y^2.' },
      { prompt: '(2x + y)dx + (x + 6y)dy = 0. Is it exact?', answer: 'yes', solution: 'M_y=1, N_x=1. Exact. F=x^2+xy+3y^2.' },
    ],
  },
  'bernoulli': {
    type: 'compute',
    instruction: 'Solve the Bernoulli equation.',
    problems: [
      { prompt: "y' + y = y^2. Solve.", answer: 'y = 1/(1 + Ce^x)', solution: 'v=y^(-1). v\'-v=-1. IF=e^(-x). v=1+Ce^x. y=1/(1+Ce^x).' },
      { prompt: "y' - y/x = xy^2. Solve.", answer: 'y = x/(-x^2/2 + C)', solution: 'v=y^(-1). v\'+v/x=-x. Solve linear ODE for v.' },
      { prompt: "y' + y = y^3. Solve.", answer: 'y^(-2) = 1 + Ce^(2x)', solution: 'v=y^(-2). v\'-2v=-2. Solve for v.' },
    ],
  },
  'applications-first-order': {
    type: 'word-problem',
    instruction: 'Set up and solve the differential equation model.',
    problems: [
      { prompt: 'Population doubles every 5 years. P(0)=1000. Find P(t).', answer: 'P(t) = 1000 * 2^(t/5)', solution: 'dP/dt=kP. P=1000*e^(kt). 2000=1000*e^(5k). k=ln(2)/5.' },
      { prompt: 'Newton\'s cooling: dT/dt = -0.1(T-20), T(0)=90. Find T(t).', answer: 'T(t) = 20 + 70*e^(-0.1t)', solution: 'T-20=70*e^(-0.1t). T=20+70*e^(-0.1t).' },
      { prompt: 'Tank: 100L brine, 2g/L flows in at 3L/min, mixed out at 3L/min. x(0)=50g. Find x(t).', answer: 'x(t) = 200 - 150*e^(-3t/100)', solution: 'dx/dt = 6 - 3x/100. Linear ODE.' },
      { prompt: 'Half-life of 10 years. Find decay constant k.', answer: 'k = ln(2)/10', solution: 'N=N0*e^(-kt). 1/2=e^(-10k). k=ln(2)/10.' },
    ],
  },
  'constant-coefficients': {
    type: 'compute',
    instruction: 'Solve the second-order constant-coefficient ODE.',
    problems: [
      { prompt: "y'' - 5y' + 6y = 0. Solve.", answer: 'y = C1*e^(2x) + C2*e^(3x)', solution: 'r^2-5r+6=(r-2)(r-3)=0. Distinct real roots.' },
      { prompt: "y'' - 4y' + 4y = 0. Solve.", answer: 'y = (C1 + C2*x)*e^(2x)', solution: 'r^2-4r+4=(r-2)^2=0. Repeated root r=2.' },
      { prompt: "y'' + 4y = 0. Solve.", answer: 'y = C1*cos(2x) + C2*sin(2x)', solution: 'r^2+4=0. r=+/-2i. Complex roots.' },
      { prompt: "y'' + 2y' + 5y = 0. Solve.", answer: 'y = e^(-x)*(C1*cos(2x) + C2*sin(2x))', solution: 'r^2+2r+5=0. r=-1+/-2i.' },
      { prompt: "y'' - y = 0. Solve.", answer: 'y = C1*e^x + C2*e^(-x)', solution: 'r^2-1=0. r=+/-1.' },
      { prompt: "y'' + 9y = 0, y(0)=1, y'(0)=0. Solve.", answer: 'y = cos(3x)', solution: 'General: C1cos3x+C2sin3x. y(0)=C1=1. y\'(0)=3C2=0.' },
    ],
  },
  'undetermined-coefficients': {
    type: 'compute',
    instruction: 'Find the particular solution using undetermined coefficients.',
    problems: [
      { prompt: "y'' + y = 3x. Find y_p.", answer: 'y_p = 3x', solution: 'Guess y_p=Ax+B. y_p\'\'=0. 0+Ax+B=3x. A=3,B=0.' },
      { prompt: "y'' - y = e^(2x). Find y_p.", answer: 'y_p = e^(2x)/3', solution: 'Guess Ae^(2x). 4A-A=1. A=1/3.' },
      { prompt: "y'' + 4y = cos(2x). Find y_p.", answer: 'y_p = (x/4)*sin(2x)', solution: 'cos(2x) is in y_h! Multiply by x: y_p=x(Acos2x+Bsin2x). B=1/4, A=0.' },
      { prompt: "y'' + y' = x^2. Find y_p.", answer: 'y_p = x^3/3 - x^2 + 2x', solution: 'Guess Ax^3+Bx^2+Cx (since constant is in y_h for y\'+y\'\'). Determine A,B,C.' },
      { prompt: "y'' - 3y' + 2y = e^x. Find y_p.", answer: 'y_p = -x*e^x', solution: 'e^x is in y_h (r=1). Guess Axe^x. Solve for A=-1.' },
    ],
  },
  'variation-of-parameters': {
    type: 'compute',
    instruction: 'Find the particular solution using variation of parameters.',
    problems: [
      { prompt: "y'' + y = sec(x). Find y_p.", answer: 'y_p = x*sin(x) + cos(x)*ln|cos(x)|', solution: 'y_h=C1cosx+C2sinx. W=1. u1=-integral(sec(x)sin(x))dx, u2=integral(sec(x)cos(x))dx.' },
      { prompt: "y'' + y = tan(x). Find y_p.", answer: 'y_p = -cos(x)*ln|sec(x)+tan(x)|', solution: 'Variation of parameters with y1=cosx, y2=sinx.' },
      { prompt: "y'' - y = 1/cosh(x). Method?", answer: 'variation of parameters', solution: 'Undetermined coefficients cannot handle 1/cosh(x). Must use VoP.' },
    ],
  },
  'applications-second-order': {
    type: 'word-problem',
    instruction: 'Model and solve the physical system.',
    problems: [
      { prompt: 'Undamped spring: m=1, k=4, x(0)=1, x\'(0)=0. Find x(t).', answer: 'x(t) = cos(2t)', solution: 'x\'\'+4x=0. x=cos(2t) with initial conditions.' },
      { prompt: 'Damped spring: m=1, c=2, k=5, x(0)=0, x\'(0)=3. Find x(t).', answer: 'x(t) = (3/2)*e^(-t)*sin(2t)', solution: 'x\'\'+2x\'+5x=0. r=-1+/-2i. x=e^(-t)(Acos2t+Bsin2t). A=0, 2B=3.' },
      { prompt: 'LC circuit: L=1, C=1/4. Find natural frequency.', answer: 'omega = 2', solution: 'omega = 1/sqrt(LC) = 1/sqrt(1/4) = 2.' },
      { prompt: 'Resonance occurs when forcing frequency equals ___', answer: 'natural frequency', solution: 'Resonance: omega_f = omega_0 = sqrt(k/m).' },
    ],
  },
  'matrix-methods': {
    type: 'compute',
    instruction: 'Solve the system using matrix methods.',
    problems: [
      { prompt: "x'=2x+y, y'=x+2y. Write in matrix form and solve.", answer: 'X(t) = C1*e^(3t)*(1,1) + C2*e^t*(1,-1)', solution: 'A=[[2,1],[1,2]]. Eigenvalues 3,1. Eigenvectors (1,1),(1,-1).' },
      { prompt: "x'=x, y'=2y. Solve.", answer: 'x=C1*e^t, y=C2*e^(2t)', solution: 'Diagonal system. Decoupled.' },
      { prompt: "x'=3x-y, y'=x+y. Find eigenvalues of the system matrix.", answer: '2 and 2', solution: 'A=[[3,-1],[1,1]]. tr=4, det=4. lambda=(4+/-0)/2=2 (repeated).' },
    ],
  },
  'eigenvalue-approach': {
    type: 'compute',
    instruction: 'Solve using the eigenvalue method.',
    problems: [
      { prompt: "X'=[[1,2],[0,3]]X. Solve.", answer: 'X = C1*e^t*(1,0) + C2*e^(3t)*(1,1)', solution: 'Eigenvalues 1,3. For lambda=1: v=(1,0). For lambda=3: v=(1,1).' },
      { prompt: "X'=[[0,-1],[1,0]]X. Solve.", answer: 'X = C1*(cos(t),sin(t)) + C2*(-sin(t),cos(t))', solution: 'Eigenvalues +/-i. Real solution involves sin and cos.' },
    ],
  },
  'phase-portraits': {
    type: 'analyze',
    instruction: 'Classify the equilibrium and describe the phase portrait.',
    problems: [
      { prompt: 'Eigenvalues -1 and -3. Classify.', answer: 'stable node (sink)', solution: 'Both negative real: asymptotically stable node.' },
      { prompt: 'Eigenvalues 2 and -1. Classify.', answer: 'saddle point', solution: 'Opposite signs: saddle. Unstable.' },
      { prompt: 'Eigenvalues -1+2i and -1-2i. Classify.', answer: 'stable spiral', solution: 'Complex with negative real part: stable spiral focus.' },
      { prompt: 'Eigenvalues 3i and -3i. Classify.', answer: 'center', solution: 'Purely imaginary: center (ellipses). Stable but not asymptotically.' },
      { prompt: 'Eigenvalues 1+i and 1-i. Classify.', answer: 'unstable spiral', solution: 'Complex with positive real part: unstable spiral.' },
    ],
  },
  'stability-classification': {
    type: 'analyze',
    instruction: 'Determine stability of the equilibrium.',
    problems: [
      { prompt: 'tr(A) < 0 and det(A) > 0. Stability?', answer: 'asymptotically stable', solution: 'Both eigenvalues have negative real parts.' },
      { prompt: 'det(A) < 0. Stability?', answer: 'unstable (saddle)', solution: 'Eigenvalues have opposite signs: saddle point.' },
      { prompt: 'tr(A) = 0 and det(A) > 0. Stability?', answer: 'stable center (not asymptotically stable)', solution: 'Purely imaginary eigenvalues: center.' },
    ],
  },
  'forward-transforms': {
    type: 'compute',
    instruction: 'Find the Laplace transform.',
    problems: [
      { prompt: 'L{1}', answer: '1/s', solution: 'L{1} = 1/s, s>0.' },
      { prompt: 'L{e^(3t)}', answer: '1/(s-3)', solution: 'L{e^(at)} = 1/(s-a). Here a=3.' },
      { prompt: 'L{sin(2t)}', answer: '2/(s^2+4)', solution: 'L{sin(bt)} = b/(s^2+b^2).' },
      { prompt: 'L{t^3}', answer: '6/s^4', solution: 'L{t^n} = n!/s^(n+1). 3!/s^4 = 6/s^4.' },
      { prompt: 'L{e^(-t)*cos(3t)}', answer: '(s+1)/((s+1)^2+9)', solution: 'First shift: replace s with s+1 in s/(s^2+9).' },
      { prompt: 'L{t*e^(2t)}', answer: '1/(s-2)^2', solution: 'L{t*e^(at)} = 1/(s-a)^2.' },
    ],
  },
  'inverse-transforms': {
    type: 'compute',
    instruction: 'Find the inverse Laplace transform.',
    problems: [
      { prompt: 'L^(-1){1/(s-5)}', answer: 'e^(5t)', solution: 'Standard: 1/(s-a) -> e^(at).' },
      { prompt: 'L^(-1){3/(s^2+9)}', answer: 'sin(3t)', solution: '3/(s^2+9) = b/(s^2+b^2) with b=3.' },
      { prompt: 'L^(-1){s/(s^2+4)}', answer: 'cos(2t)', solution: 's/(s^2+b^2) -> cos(bt).' },
      { prompt: 'L^(-1){2/s^3}', answer: 't^2', solution: '2/s^3 = 2!/(s^3). L^(-1) = t^2.' },
      { prompt: 'L^(-1){1/((s-1)(s-2))}', answer: 'e^(2t) - e^t', solution: 'PF: -1/(s-1)+1/(s-2). Result: -e^t+e^(2t).' },
    ],
  },
  'solving-ivps': {
    type: 'compute',
    instruction: 'Solve the IVP using Laplace transforms.',
    problems: [
      { prompt: "y'' + y = 0, y(0)=1, y'(0)=0. Solve using Laplace.", answer: 'y = cos(t)', solution: 's^2Y-s+Y=0. Y=s/(s^2+1). y=cos(t).' },
      { prompt: "y' + 2y = 6, y(0)=0. Solve.", answer: 'y = 3(1-e^(-2t))', solution: 'sY+2Y=6/s. Y=6/(s(s+2)). PF: 3/s-3/(s+2).' },
      { prompt: "y'' - y = 0, y(0)=0, y'(0)=1. Solve.", answer: 'y = sinh(t)', solution: 's^2Y-1-Y=0. Y=1/(s^2-1). y=sinh(t).' },
    ],
  },
  'step-functions': {
    type: 'compute',
    instruction: 'Find the Laplace transform involving step functions.',
    problems: [
      { prompt: 'L{u(t-3)}', answer: 'e^(-3s)/s', solution: 'L{u(t-a)} = e^(-as)/s.' },
      { prompt: 'L{u(t-2)*e^(t-2)}', answer: 'e^(-2s)/(s-1)', solution: 'Second shift: e^(-2s)*L{e^t} = e^(-2s)/(s-1).' },
      { prompt: 'f(t) = 0 for t<1, f(t) = t-1 for t>=1. Find L{f}.', answer: 'e^(-s)/s^2', solution: 'f(t)=(t-1)u(t-1). L = e^(-s)/s^2.' },
    ],
  },
  'convolution': {
    type: 'compute',
    instruction: 'Compute the convolution or use the convolution theorem.',
    problems: [
      { prompt: 'f*g where f(t)=1, g(t)=t.', answer: 't^2/2', solution: 'integral_0^t 1*(t-tau)dtau = t^2/2.' },
      { prompt: 'L^(-1){1/(s^2(s+1))} using convolution.', answer: 't - 1 + e^(-t)', solution: '1/s^2 * 1/(s+1). f=t, g=e^(-t). Convolve.' },
      { prompt: 'L{f*g} = ?', answer: 'F(s)*G(s)', solution: 'Convolution theorem: L{f*g} = F(s)G(s).' },
    ],
  },
  'power-series-method': {
    type: 'compute',
    instruction: 'Find the power series solution.',
    problems: [
      { prompt: "y' = y, y(0)=1. Find the series solution.", answer: 'y = sum x^n/n! = e^x', solution: 'y=sum a_n x^n. a_{n+1}(n+1)=a_n. a_n=1/n!.' },
      { prompt: "y'' + y = 0. Find the recurrence.", answer: 'a_{n+2} = -a_n/((n+1)(n+2))', solution: 'sum (n+2)(n+1)a_{n+2}x^n + sum a_n x^n = 0.' },
      { prompt: "y' = 2xy, y(0)=1. Series solution.", answer: 'y = e^(x^2)', solution: 'y=sum a_n x^n. Recurrence gives a_{2k}=1/k!. y=e^(x^2).' },
    ],
  },
  'ordinary-points': {
    type: 'analyze',
    instruction: 'Classify the point as ordinary, regular singular, or irregular singular.',
    problems: [
      { prompt: "y'' + xy' + y = 0 at x=0.", answer: 'ordinary point', solution: 'Coefficients are analytic at x=0.' },
      { prompt: "x^2 y'' + xy' + (x^2-1)y = 0 at x=0.", answer: 'regular singular point', solution: 'Bessel equation. xP(x)=1, x^2Q(x)=x^2-1 are analytic.' },
      { prompt: "x^3 y'' + y = 0 at x=0.", answer: 'irregular singular point', solution: 'P=0, Q=1/x^3. x^2*Q=1/x is not analytic.' },
    ],
  },
  'frobenius-method': {
    type: 'compute',
    instruction: 'Apply the Frobenius method.',
    problems: [
      { prompt: "2xy'' + y' + y = 0. Find the indicial equation.", answer: 'r(2r-1) = 0', solution: 'x=0 is regular singular. Indicial: 2r(r-1)+r = 2r^2-r = r(2r-1)=0.' },
      { prompt: 'Roots of indicial equation r(r-1)+r-1/4=0.', answer: 'r = 1/2 and r = -1/2', solution: 'r^2 - 1/4 = 0. r = +/- 1/2.' },
    ],
  },
  'bessel-legendre': {
    type: 'analyze',
    instruction: 'Answer the question about special functions.',
    problems: [
      { prompt: 'What is the Bessel equation of order n?', answer: "x^2y'' + xy' + (x^2-n^2)y = 0", solution: 'Standard form with parameter n.' },
      { prompt: 'Legendre polynomials P_n(x) satisfy what equation?', answer: "(1-x^2)y'' - 2xy' + n(n+1)y = 0", solution: 'Legendre equation.' },
      { prompt: 'Are Bessel functions J_0(x) and Y_0(x) linearly independent?', answer: 'yes', solution: 'J_0 is bounded at 0, Y_0 has a logarithmic singularity.' },
    ],
  },
  'euler-method': {
    type: 'compute',
    instruction: 'Apply Euler\'s method.',
    problems: [
      { prompt: "y' = y, y(0)=1, h=0.5. Find y(1) using Euler's method.", answer: '2.25', solution: 'y_1=1+0.5*1=1.5. y_2=1.5+0.5*1.5=2.25. (Exact: e=2.718...)' },
      { prompt: "y' = x+y, y(0)=1, h=0.1. Find y(0.1).", answer: '1.1', solution: 'y_1 = 1 + 0.1*(0+1) = 1.1.' },
      { prompt: "y' = -2y, y(0)=3, h=0.25. Find y(0.5).", answer: '0.75', solution: 'y_1=3+0.25*(-2*3)=3-1.5=1.5. y_2=1.5+0.25*(-2*1.5)=1.5-0.75=0.75.' },
    ],
  },
  'improved-euler': {
    type: 'compute',
    instruction: 'Apply the improved Euler (Heun) method.',
    problems: [
      { prompt: "y' = y, y(0)=1, h=1. Find y(1) using improved Euler.", answer: '2.5', solution: 'Predictor: y*=1+1*1=2. Corrector: y_1=1+0.5*(1+2)=2.5.' },
      { prompt: 'What is the order of accuracy of improved Euler?', answer: 'second order', solution: 'Heun\'s method is O(h^2).' },
    ],
  },
  'runge-kutta': {
    type: 'analyze',
    instruction: 'Answer the question about Runge-Kutta methods.',
    problems: [
      { prompt: 'What is the order of accuracy of the classical RK4 method?', answer: 'fourth order', solution: 'RK4 is O(h^4).' },
      { prompt: 'How many function evaluations per step does RK4 require?', answer: '4', solution: 'k1, k2, k3, k4 — four evaluations.' },
      { prompt: 'What is the advantage of RK4 over Euler?', answer: 'much higher accuracy for same step size', solution: 'Error is O(h^4) vs O(h) for Euler.' },
    ],
  },
  'error-analysis': {
    type: 'analyze',
    instruction: 'Answer the question about numerical error.',
    problems: [
      { prompt: 'Local truncation error of Euler method is O(?).', answer: 'O(h^2)', solution: 'Local error O(h^2), global error O(h).' },
      { prompt: 'If step size is halved in Euler method, global error is approximately...', answer: 'halved', solution: 'Global error is O(h), so halving h halves the error.' },
      { prompt: 'Name two sources of error in numerical ODE solving.', answer: 'truncation error and round-off error', solution: 'Truncation from discretization, round-off from finite precision.' },
    ],
  },
  'heat-equation': {
    type: 'compute',
    instruction: 'Solve or analyze the heat equation.',
    problems: [
      { prompt: 'u_t = k*u_xx on [0,L], u(0,t)=u(L,t)=0. What is the form of the solution?', answer: 'u = sum B_n * sin(n*pi*x/L) * e^(-k*n^2*pi^2*t/L^2)', solution: 'Separation of variables: X\'\'=-lambda X, T\'=-k*lambda T.' },
      { prompt: 'Classify: u_t = 3*u_xx.', answer: 'parabolic', solution: 'Heat equation is parabolic.' },
      { prompt: 'Physical meaning of u_t = k*u_xx?', answer: 'heat diffusion — temperature smooths out over time', solution: 'Thermal diffusivity k controls rate of smoothing.' },
    ],
  },
  'wave-equation': {
    type: 'compute',
    instruction: 'Solve or analyze the wave equation.',
    problems: [
      { prompt: 'u_tt = c^2*u_xx on [0,L] with fixed ends. Form of solution?', answer: 'u = sum (A_n*cos(n*pi*c*t/L) + B_n*sin(n*pi*c*t/L))*sin(n*pi*x/L)', solution: 'Separation of variables with standing wave solutions.' },
      { prompt: 'Classify: u_tt = 4*u_xx.', answer: 'hyperbolic', solution: 'Wave equation is hyperbolic. c=2.' },
      { prompt: 'D\'Alembert solution of u_tt=c^2*u_xx on entire line?', answer: 'u(x,t) = f(x+ct) + g(x-ct)', solution: 'General solution: right-traveling + left-traveling wave.' },
    ],
  },
  'laplace-equation': {
    type: 'compute',
    instruction: 'Solve or analyze the Laplace equation.',
    problems: [
      { prompt: 'Classify: u_xx + u_yy = 0.', answer: 'elliptic', solution: 'Laplace equation is elliptic. Models steady-state.' },
      { prompt: 'Laplace equation on disk: u_rr + (1/r)u_r + (1/r^2)u_{tt} = 0. Solution form?', answer: 'u = A_0 + sum r^n*(A_n*cos(n*theta)+B_n*sin(n*theta))', solution: 'Separation in polar coordinates.' },
      { prompt: 'Maximum principle for Laplace equation states?', answer: 'max/min of harmonic function occur on the boundary', solution: 'A harmonic function cannot have interior extrema.' },
    ],
  },
  'separation-of-variables': {
    type: 'compute',
    instruction: 'Apply separation of variables.',
    problems: [
      { prompt: 'u_t = u_xx. Assume u=X(x)T(t). What ODEs do you get?', answer: "X''/X = T'/T = -lambda (constant)", solution: 'X\'\'+ lambda X = 0, T\' + lambda T = 0.' },
      { prompt: 'With u(0,t)=u(pi,t)=0, what are the eigenvalues?', answer: 'lambda_n = n^2, n=1,2,3,...', solution: 'X\'\'+lambda X=0, X(0)=X(pi)=0. X_n=sin(nx), lambda_n=n^2.' },
      { prompt: 'For the wave equation u_tt=c^2*u_xx with fixed ends, what is the n-th natural frequency?', answer: 'omega_n = n*pi*c/L', solution: 'From eigenvalue lambda_n = (n*pi/L)^2. omega_n = c*sqrt(lambda_n).' },
    ],
  },
};

// File I/O & Helpers (same pattern)

function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }
function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }
function loadProfile(id) { const fp = profilePath(id); if (fs.existsSync(fp)) { try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); } } return { studentId: id, createdAt: new Date().toISOString(), assessments: [], skills: {} }; }
function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }
function calcMastery(attempts) { if (!attempts || !attempts.length) return 0; const recent = attempts.slice(-5).filter(a => a.total > 0); return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0; }
function masteryLabel(r) { return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started'; }
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }
function norm(s) { return String(s).toLowerCase().trim().replace(/\s+/g, ' '); }
function generateExercise(skill, count = 5) { const bank = PROBLEM_BANKS[skill]; if (!bank) return { error: `No problem bank for ${skill}` }; const items = pick(bank.problems, count); return { type: bank.type, skill, count: items.length, instruction: bank.instruction, items }; }
function checkAnswer(type, expected, answer) { return norm(expected) === norm(answer) || norm(expected).replace(/[*\s]/g, '') === norm(answer).replace(/[*\s]/g, ''); }

class DifferentialEquations {
  getProfile(id) { const p = loadProfile(id); return { studentId: p.studentId, createdAt: p.createdAt, totalAssessments: p.assessments.length }; }

  recordAssessment(id, category, skill, score, total, notes = '') {
    if (!SKILLS[category]) throw new Error(`Unknown category: ${category}`);
    if (!SKILLS[category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id);
    const entry = { date: new Date().toISOString(), category, skill, score, total, notes };
    p.assessments.push(entry);
    const key = `${category}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p);
    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  getProgress(id) {
    const p = loadProfile(id); const results = {}; let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(SKILLS)) { results[cat] = {}; for (const sk of skills) { total++; const d = p.skills[`${cat}/${sk}`]; results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' }; if (d && d.mastery >= MASTERY_THRESHOLD) mastered++; } }
    return { studentId: id, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id); const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS)) { for (const sk of skills) { const d = p.skills[`${cat}/${sk}`]; const m = d ? d.mastery : 0; if (m < MASTERY_THRESHOLD) candidates.push({ category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' }); } }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, next: candidates.slice(0, count) };
  }

  getReport(id) { const p = loadProfile(id); return { studentId: id, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }
  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }
  getSkillCatalog() { let total = 0; const catalog = {}; for (const [cat, skills] of Object.entries(SKILLS)) { total += skills.length; catalog[cat] = [...skills]; } return { skills: catalog, totalSkills: total }; }
  generateExercise(skill, count = 5) { return generateExercise(skill, count); }
  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  generateLesson(id) {
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: 'All skills proficient!' };
    const exercise = generateExercise(target.skill, 5);
    return { studentId: id, targetSkill: target, exercise, lessonPlan: { review: 'Review prerequisites (2-3 min)', teach: `Introduce: ${target.category} > ${target.skill}`, practice: `Complete ${exercise.count || 0} problems` } };
  }
}

module.exports = DifferentialEquations;

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new DifferentialEquations();
  const out = d => console.log(JSON.stringify(d, null, 2));
  try {
    switch (cmd) {
      case 'start': { const [, id] = args; if (!id) throw new Error('Usage: start <id>'); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); if (skill) { out(api.generateExercise(skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); out(api.checkAnswer(type, expected, answer)); break; }
      case 'record': { const [, id, cat, skill, sc, tot, ...notes] = args; if (!id || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <cat> <skill> <score> <total>'); out(api.recordAssessment(id, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { out(api.getSkillCatalog()); break; }
      case 'students': { out(api.listStudents()); break; }
      default: out({ usage: 'node differential-equations.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students'] });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
