// eClaw HS Math Problem Solving & Reasoning Tutor (Grades 9-12). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-math-problem-solving');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'foundations': {
    'polya-method': ['understand-problem', 'devise-plan', 'carry-out-plan', 'look-back', 'restate-problem'],
    'heuristics': ['draw-diagram', 'make-table', 'guess-and-check', 'work-backwards', 'simplify-problem'],
    'logic-basics': ['conditional-statements', 'converse-inverse-contrapositive', 'truth-tables', 'logical-equivalence', 'quantifiers'],
    'direct-proof': ['algebraic-proof', 'divisibility-proofs', 'even-odd-proofs', 'inequality-proofs', 'geometric-proofs'],
    'casework': ['two-cases', 'parity-cases', 'sign-cases', 'modular-cases', 'exhaustive-cases'],
  },
  'intermediate': {
    'contradiction': ['assume-negation', 'irrationality-proofs', 'infinitude-proofs', 'uniqueness-proofs', 'pigeonhole-principle'],
    'induction': ['base-case', 'inductive-step', 'sum-formulas', 'inequality-induction', 'strong-induction'],
    'combinatorics': ['counting-principles', 'permutations', 'combinations', 'stars-and-bars', 'inclusion-exclusion'],
    'number-theory': ['divisibility-rules', 'gcd-lcm', 'modular-arithmetic', 'prime-factorization', 'diophantine-equations'],
    'modeling': ['define-variables', 'write-equations', 'interpret-solutions', 'optimization-setup', 'validate-model'],
  },
  'competition': {
    'amc-strategies': ['time-management', 'answer-choices', 'plug-in-values', 'pattern-recognition', 'estimation'],
    'aime-level': ['clever-algebra', 'geometric-insight', 'counting-advanced', 'number-theory-advanced', 'multi-step-synthesis'],
    'invariants': ['identify-invariant', 'coloring-arguments', 'parity-invariants', 'monovariant', 'conservation-laws'],
    'extremal-principle': ['maximum-minimum', 'greedy-algorithms', 'boundary-cases', 'optimization-arguments', 'extremal-graphs'],
  },
};

const PROBLEM_BANKS = {
  'foundations': {
    'understand-problem': {
      problems: [
        { prompt: 'Three consecutive integers sum to 72. What are they? First: identify what you know and what you need to find.', answer: '23, 24, 25', hint: 'Let the integers be n, n+1, n+2. What equation can you write?' },
        { prompt: 'A rectangle has perimeter 30 and area 54. Find its dimensions. What are the unknowns?', answer: '9 and 6', hint: 'Two unknowns: length and width. Two equations: 2l+2w=30, lw=54.' },
        { prompt: 'How many diagonals does a 10-sided polygon have?', answer: '35', hint: 'Each vertex connects to n-3 others via diagonals. Total = n(n-3)/2.' },
        { prompt: 'Find two numbers whose sum is 20 and whose product is maximum.', answer: '10 and 10', hint: 'If x + y = 20, maximize xy = x(20-x).' },
        { prompt: 'A snail climbs 3 feet per day and slides back 2 feet at night. How many days to climb a 10-foot wall?', answer: '8', hint: 'Net progress is 1 ft/day, but on the last day it reaches the top before sliding.' },
      ],
    },
    'devise-plan': {
      problems: [
        { prompt: 'Plan a strategy: find all pairs (x,y) of positive integers with 1/x + 1/y = 1/6.', answer: 'rewrite as (x-6)(y-6)=36, find factor pairs', hint: 'Clear fractions to get xy = 6x + 6y, then rearrange to factor.' },
        { prompt: 'Plan: prove that the sum of the first n odd numbers equals n^2.', answer: 'use induction or visual proof with L-shapes', hint: 'Consider mathematical induction or building squares with L-shaped regions.' },
        { prompt: 'Plan: find the last two digits of 7^100.', answer: 'use modular arithmetic mod 100', hint: 'Find the pattern of 7^n mod 100.' },
        { prompt: 'Plan: how many squares are on a standard 8x8 chessboard?', answer: 'count squares of each size 1x1 through 8x8', hint: 'k×k squares: (9-k)^2 choices. Sum from k=1 to 8.' },
        { prompt: 'Plan: prove that sqrt(2) is irrational.', answer: 'proof by contradiction', hint: 'Assume sqrt(2) = p/q in lowest terms, derive a contradiction.' },
      ],
    },
    'carry-out-plan': {
      problems: [
        { prompt: 'Execute: find the sum 1 + 2 + 3 + ... + 100 using Gauss\'s method.', answer: '5050', hint: 'Pair first and last: 1+100=101, 2+99=101, ... 50 pairs.' },
        { prompt: 'Execute: find all integer solutions to x^2 - y^2 = 24.', answer: '(5,1), (-5,-1), (-5,1), (5,-1), (7,5), (-7,-5), (-7,5), (7,-5)', hint: 'Factor: (x-y)(x+y)=24. List factor pairs of 24.' },
        { prompt: 'Execute: how many ways can you make change for 25 cents using pennies, nickels, and dimes?', answer: '12', hint: 'Systematically count: 0,1,2 dimes, then fill with nickels/pennies.' },
        { prompt: 'Execute: find the units digit of 3^2024.', answer: '1', hint: 'Pattern: 3,9,7,1,3,9,7,1,... Period 4. 2024 mod 4 = 0.' },
        { prompt: 'Execute: simplify (1 + 1/1)(1 + 1/2)(1 + 1/3)...(1 + 1/99).', answer: '100', hint: 'Each factor: (k+1)/k. Product telescopes.' },
      ],
    },
    'look-back': {
      problems: [
        { prompt: 'You found that x=5 solves x^2 - 3x - 10 = 0. Verify and find the other root.', answer: 'x=5 checks (25-15-10=0), other root x=-2', hint: 'Factor: (x-5)(x+2)=0. Or: sum of roots = 3, product = -10.' },
        { prompt: 'You calculated that a triangle with sides 5,12,13 has area 30. Does this make sense?', answer: 'yes, it is a right triangle, area = (5)(12)/2 = 30', hint: 'Check: 5^2 + 12^2 = 25 + 144 = 169 = 13^2.' },
        { prompt: 'Can you generalize: the sum of first n odd numbers is n^2. What about first n even numbers?', answer: 'n(n+1)', hint: '2+4+6+...+2n = 2(1+2+...+n) = 2·n(n+1)/2.' },
        { prompt: 'You solved a rate problem and got t = -3 hours. What went wrong?', answer: 'time cannot be negative, check equation setup', hint: 'Reexamine the problem setup and signs in the equation.' },
        { prompt: 'A student claims 0.999... < 1. Provide a convincing argument that 0.999... = 1.', answer: 'let x = 0.999..., then 10x = 9.999..., so 9x = 9, x = 1', hint: 'Use algebra, or note 1/3 = 0.333..., so 3(1/3) = 0.999... = 1.' },
      ],
    },
    'restate-problem': {
      problems: [
        { prompt: 'Restate: "Find all x where |2x - 3| < 5" without absolute value.', answer: '-1 < x < 4', hint: '-5 < 2x - 3 < 5, so -2 < 2x < 8.' },
        { prompt: 'Restate: "The product of two consecutive integers is 156" as an equation.', answer: 'n(n+1) = 156', hint: 'Let the integers be n and n+1.' },
        { prompt: 'Restate geometrically: "Minimize x^2 + y^2 subject to x + y = 10."', answer: 'find the point on x+y=10 closest to the origin', hint: 'x^2 + y^2 is the squared distance from the origin.' },
        { prompt: 'Restate: "How many subsets does a 5-element set have?" as a counting problem.', answer: '2^5 = 32, each element is either in or out', hint: 'Each element has 2 choices: include or exclude.' },
        { prompt: 'Restate: "There is no largest prime" as a proof goal.', answer: 'for any finite set of primes, there exists a prime not in the set', hint: 'The negation: assume finitely many primes and find a contradiction.' },
      ],
    },
    'draw-diagram': {
      problems: [
        { prompt: 'Two circles of radius 5 have centers 6 apart. Describe how a diagram helps find the area of overlap.', answer: 'diagram shows lens-shaped region; use two circular segments', hint: 'Draw both circles and their intersection points to find the angles.' },
        { prompt: 'A 10-foot ladder leans against a wall. Base is 6 feet from wall. Draw and find height.', answer: '8 feet', hint: 'Right triangle: 6^2 + h^2 = 10^2.' },
        { prompt: 'Three friends A, B, C. A is 3 mi from B, B is 4 mi from C, A is 5 mi from C. What kind of triangle?', answer: 'right triangle (3-4-5)', hint: 'Draw the triangle and check: 3^2 + 4^2 = 5^2.' },
        { prompt: 'A goat is tied to a corner of a 10x10 barn with a 15-foot rope. What area can it graze?', answer: '3/4 of circle r=15 plus two 1/4 circles r=5', hint: 'Draw the barn and rope reach around corners.' },
        { prompt: 'Visualize: how many regions do 4 lines in general position create?', answer: '11', hint: 'n lines create n(n+1)/2 + 1 regions. Draw them one at a time.' },
      ],
    },
    'make-table': {
      problems: [
        { prompt: 'Make a table to find: which perfect squares end in the digit 6?', answer: 'squares ending in 6 come from numbers ending in 4 or 6', hint: 'List 1^2 through 10^2 and look at last digits.' },
        { prompt: 'Table approach: how many ways to climb 6 stairs taking 1 or 2 steps at a time?', answer: '13', hint: 'Build up: f(1)=1, f(2)=2, f(3)=3, f(4)=5, f(5)=8, f(6)=13.' },
        { prompt: 'Make a table: powers of 2 mod 7 for n=0 to 6.', answer: '1, 2, 4, 1, 2, 4, 1', hint: 'Compute 2^n mod 7 for each n. Period is 3.' },
        { prompt: 'Table: find all (x,y) with x,y positive integers, x+y≤5.', answer: '10 pairs', hint: 'x=1: y=1,2,3,4. x=2: y=1,2,3. x=3: y=1,2. x=4: y=1.' },
        { prompt: 'Tabulate: remainders when n^2 is divided by 4, for n=0,1,2,3.', answer: '0, 1, 0, 1', hint: 'Squares mod 4 are only 0 or 1. This is useful for proving things about even/odd.' },
      ],
    },
    'guess-and-check': {
      problems: [
        { prompt: 'Find two numbers that multiply to 36 and add to 13.', answer: '4 and 9', hint: 'List factor pairs of 36: (1,36),(2,18),(3,12),(4,9),(6,6).' },
        { prompt: 'Find a two-digit number that equals 4 times the sum of its digits.', answer: '12, 24, 36, or 48', hint: 'If the number is 10a+b, then 10a+b = 4(a+b), so 6a = 3b, b=2a. a=1..4 gives 12,24,36,48.' },
        { prompt: 'Find three consecutive integers whose product is 120.', answer: '4, 5, 6', hint: 'Cube root of 120 ≈ 4.9, so try around 5.' },
        { prompt: 'Find a Pythagorean triple where the hypotenuse is 25.', answer: '7, 24, 25', hint: 'Try: 25^2=625. 625-576=49=7^2. Or: 625-400=225=15^2 gives (15,20,25).' },
        { prompt: 'Find x: x^3 + x = 30', answer: '3', hint: 'Try x=3: 27 + 3 = 30. Check!' },
      ],
    },
    'work-backwards': {
      problems: [
        { prompt: 'After doubling money, spending $10, then tripling what remained, you have $60. How much did you start with?', answer: '$15', hint: 'Before tripling: 60/3=20. Before spending: 20+10=30. Before doubling: 30/2=15.' },
        { prompt: 'A number is tripled, then 5 is added, then result is halved to get 13. Find the number.', answer: '7', hint: 'Before halving: 26. Before adding 5: 21. Before tripling: 7.' },
        { prompt: 'After 3 rounds of "double and subtract 1", the result is 9. What was the start?', answer: '2', hint: 'Before last round: (9+1)/2=5. Then (5+1)/2=3. Then (3+1)/2=2. Check: 2→3→5→9. ✓' },
        { prompt: 'You remove half the marbles plus 1 three times and have 1 left. How many did you start with?', answer: '22', hint: 'Before last removal: (1+1)*2=4. Before second: (4+1)*2=10. Before first: (10+1)*2=22.' },
        { prompt: 'A sequence ends ..., 32, 16, 8, 4, 2. Each term is half the previous. What is the 1st term if there are 8 terms?', answer: '256', hint: '2 * 2^6 = 128... Actually: a_8=2, a_1 = 2*2^6 = 128. Wait: count carefully.' },
      ],
    },
    'simplify-problem': {
      problems: [
        { prompt: 'Simplify: find 1/1·2 + 1/2·3 + 1/3·4 + ... + 1/99·100.', answer: '99/100', hint: 'Partial fractions: 1/k(k+1) = 1/k - 1/(k+1). Telescopes!' },
        { prompt: 'Simplify: how many 0s at the end of 100!?', answer: '24', hint: 'Count factors of 5: floor(100/5)+floor(100/25)+floor(100/125) = 20+4+0.' },
        { prompt: 'Instead of summing 1^3+2^3+...+10^3 directly, what simpler formula exists?', answer: '3025 (equals (1+2+...+10)^2 = 55^2)', hint: 'The sum of cubes equals the square of the sum.' },
        { prompt: 'Simplify the problem: is 2^30 > 10^9?', answer: 'yes', hint: '2^10 = 1024 > 10^3, so 2^30 = (2^10)^3 > (10^3)^3 = 10^9.' },
        { prompt: 'Reduce: find the GCD of 252 and 198.', answer: '18', hint: 'Use Euclidean algorithm: 252=1(198)+54, 198=3(54)+36, 54=1(36)+18, 36=2(18).' },
      ],
    },
    'conditional-statements': {
      problems: [
        { prompt: 'Write the converse of: "If it rains, then the ground is wet."', answer: 'if the ground is wet, then it rains', hint: 'Converse swaps hypothesis and conclusion.' },
        { prompt: 'Write the contrapositive of: "If n is even, then n^2 is even."', answer: 'if n^2 is odd, then n is odd', hint: 'Negate both and swap.' },
        { prompt: 'Is this valid: "All dogs are animals. Fido is a dog. Therefore Fido is an animal."?', answer: 'yes, valid (modus ponens)', hint: 'This follows the pattern: if P then Q; P; therefore Q.' },
        { prompt: 'Identify the error: "If it snows, schools close. Schools are closed. Therefore it snowed."', answer: 'affirming the consequent (invalid)', hint: 'Schools might close for other reasons.' },
        { prompt: '"If a number is divisible by 6, it is divisible by 3." True or false?', answer: 'true', hint: '6 = 2×3, so divisibility by 6 implies divisibility by 3.' },
      ],
    },
    'converse-inverse-contrapositive': {
      problems: [
        { prompt: 'Given "If P then Q": state inverse.', answer: 'if not P then not Q', hint: 'Negate both parts without swapping.' },
        { prompt: 'Given "If x>5, then x>3": is the converse true?', answer: 'no', hint: 'Converse: "if x>3 then x>5" — false (x=4 is a counterexample).' },
        { prompt: 'If a statement is true, must its converse be true?', answer: 'no', hint: 'A statement and its converse are not logically equivalent.' },
        { prompt: 'If a statement is true, must its contrapositive be true?', answer: 'yes', hint: 'A statement and its contrapositive are logically equivalent.' },
        { prompt: 'Write all four forms for: "If n^2 is odd, then n is odd."', answer: 'converse: if n odd then n^2 odd; inverse: if n^2 even then n even; contra: if n even then n^2 even', hint: 'Converse swaps, inverse negates, contrapositive does both.' },
      ],
    },
    'truth-tables': {
      problems: [
        { prompt: 'How many rows does a truth table with 3 variables have?', answer: '8', hint: '2^3 = 8.' },
        { prompt: 'Evaluate: T AND F', answer: 'F', hint: 'AND requires both true.' },
        { prompt: 'Evaluate: T OR F', answer: 'T', hint: 'OR requires at least one true.' },
        { prompt: 'Evaluate: NOT (T AND F)', answer: 'T', hint: 'T AND F = F, NOT F = T.' },
        { prompt: 'Is P → Q equivalent to NOT P OR Q?', answer: 'yes', hint: 'Build truth tables for both — they match.' },
      ],
    },
    'logical-equivalence': {
      problems: [
        { prompt: 'Are "P and Q" and "Q and P" logically equivalent?', answer: 'yes', hint: 'AND is commutative.' },
        { prompt: 'Simplify: NOT (P AND Q) using De Morgan\'s law.', answer: '(NOT P) OR (NOT Q)', hint: 'De Morgan: negate each part and flip AND/OR.' },
        { prompt: 'Simplify: NOT (P OR Q) using De Morgan\'s law.', answer: '(NOT P) AND (NOT Q)', hint: 'Negate each part and flip OR to AND.' },
        { prompt: 'Is "P → Q" equivalent to "NOT Q → NOT P"?', answer: 'yes', hint: 'A conditional equals its contrapositive.' },
        { prompt: 'Simplify: P OR (P AND Q)', answer: 'P', hint: 'Absorption law: if P is true, the whole thing is true regardless of Q.' },
      ],
    },
    'quantifiers': {
      problems: [
        { prompt: 'Negate: "For all x, x^2 ≥ 0."', answer: 'there exists x such that x^2 < 0', hint: 'Negate ∀ to ∃ and negate the predicate.' },
        { prompt: 'Negate: "There exists a prime number that is even."', answer: 'for all prime numbers, none is even', hint: 'Negate ∃ to ∀ and negate the predicate.' },
        { prompt: 'Write formally: "Every positive number has a positive square root."', answer: 'for all x > 0, there exists y > 0 such that y^2 = x', hint: 'Use ∀ and ∃ quantifiers.' },
        { prompt: 'Is "∀x ∃y (x + y = 0)" true for real numbers?', answer: 'yes', hint: 'For any x, choose y = -x.' },
        { prompt: 'Is "∃y ∀x (x + y = 0)" true for real numbers?', answer: 'no', hint: 'No single y works for ALL x.' },
      ],
    },
    'algebraic-proof': {
      problems: [
        { prompt: 'Prove: the sum of two even numbers is even.', answer: '2a + 2b = 2(a+b), which is even', hint: 'Let the numbers be 2a and 2b.' },
        { prompt: 'Prove: (a+b)^2 = a^2 + 2ab + b^2.', answer: 'expand (a+b)(a+b) using distributive property', hint: '(a+b)(a+b) = a(a+b) + b(a+b) = a^2 + ab + ba + b^2.' },
        { prompt: 'Prove: the product of two odd numbers is odd.', answer: '(2a+1)(2b+1) = 4ab+2a+2b+1 = 2(2ab+a+b)+1', hint: 'Write odd numbers as 2a+1 and 2b+1.' },
        { prompt: 'Prove: n^2 - n is always even for integer n.', answer: 'n^2 - n = n(n-1), product of consecutive integers is even', hint: 'Factor as n(n-1). One of n, n-1 must be even.' },
        { prompt: 'Prove: if a|b and a|c, then a|(b+c).', answer: 'b=ak, c=am, so b+c=a(k+m)', hint: 'Write b and c as multiples of a.' },
      ],
    },
    'divisibility-proofs': {
      problems: [
        { prompt: 'Prove: n^3 - n is divisible by 6 for all integers n.', answer: 'n^3-n = n(n-1)(n+1), three consecutive integers', hint: 'Factor: product of 3 consecutive integers is divisible by 3! = 6.' },
        { prompt: 'Prove: 3 | (n^3 + 2n) for all integers n.', answer: 'n^3+2n = n(n^2+2); check n=0,1,2 mod 3', hint: 'n^3 + 2n = n(n^2+2). If n≡0: done. If n≡1: 1(3)=3. If n≡2: 2(6)=12.' },
        { prompt: 'Prove: 8 | (n^2 - 1) when n is odd.', answer: 'n=2k+1, n^2-1=4k^2+4k=4k(k+1), k(k+1) is even', hint: 'Write n=2k+1. Then n^2-1 = 4k(k+1). Since k(k+1) is even, 8 divides it.' },
        { prompt: 'Is 5 | (3^n - 1) for n=1,2,3,4? Find the pattern.', answer: 'true when 4|n', hint: '3^1-1=2, 3^2-1=8, 3^3-1=26, 3^4-1=80. Pattern: 3^n mod 5 cycles with period 4.' },
        { prompt: 'Prove: 6 | n(n+1)(n+2) for all integers n.', answer: 'product of 3 consecutive integers, divisible by 2 and 3', hint: 'Among any 3 consecutive integers, one is divisible by 3 and at least one by 2.' },
      ],
    },
    'even-odd-proofs': {
      problems: [
        { prompt: 'Prove: if n^2 is even, then n is even.', answer: 'contrapositive: if n is odd, then n^2 is odd. (2k+1)^2 = 4k^2+4k+1 = odd.', hint: 'Use the contrapositive approach.' },
        { prompt: 'Prove: even + odd = odd.', answer: '2a + (2b+1) = 2(a+b) + 1, which is odd', hint: 'Write even as 2a and odd as 2b+1.' },
        { prompt: 'Prove: odd × even = even.', answer: '(2a+1)(2b) = 4ab + 2b = 2(2ab+b), even', hint: 'The product has a factor of 2.' },
        { prompt: 'True or false: the sum of two irrational numbers is always irrational.', answer: 'false', hint: 'Counterexample: sqrt(2) + (-sqrt(2)) = 0.' },
        { prompt: 'Prove: the square of any integer is either 0 or 1 mod 4.', answer: '(2k)^2=4k^2≡0, (2k+1)^2=4k^2+4k+1≡1', hint: 'Consider even and odd cases separately.' },
      ],
    },
    'inequality-proofs': {
      problems: [
        { prompt: 'Prove: a^2 + b^2 ≥ 2ab for all real a, b.', answer: 'a^2 - 2ab + b^2 ≥ 0, i.e., (a-b)^2 ≥ 0', hint: 'Rearrange to get a perfect square.' },
        { prompt: 'Prove: AM-GM for two numbers: (a+b)/2 ≥ sqrt(ab) for a,b > 0.', answer: 'square both sides: (a+b)^2/4 ≥ ab, i.e., a^2-2ab+b^2 ≥ 0', hint: 'Equivalent to (a-b)^2 ≥ 0.' },
        { prompt: 'Prove: |a + b| ≤ |a| + |b| (triangle inequality).', answer: 'square both sides: a^2+2ab+b^2 ≤ a^2+2|a||b|+b^2, so ab ≤ |a||b|', hint: 'Square both sides and compare.' },
        { prompt: 'Prove: for positive x, x + 1/x ≥ 2.', answer: 'x + 1/x - 2 = (x-1)^2/x ≥ 0 for x > 0', hint: 'Apply AM-GM: (x + 1/x)/2 ≥ sqrt(x·1/x) = 1.' },
        { prompt: 'Prove: if 0 < a < b, then a^2 < b^2.', answer: 'b^2-a^2 = (b-a)(b+a) > 0 since both factors positive', hint: 'Factor the difference of squares.' },
      ],
    },
    'geometric-proofs': {
      problems: [
        { prompt: 'Prove: the sum of angles in a triangle is 180°.', answer: 'draw a line parallel to one side through the opposite vertex', hint: 'Alternate interior angles with the parallel line.' },
        { prompt: 'Prove: the diagonals of a parallelogram bisect each other.', answer: 'use congruent triangles (ASA)', hint: 'Opposite sides are parallel and equal, giving congruent triangles.' },
        { prompt: 'Prove: the angle inscribed in a semicircle is 90°.', answer: 'Thales theorem: use the inscribed angle theorem', hint: 'The central angle is 180° (diameter), inscribed angle is half.' },
        { prompt: 'Prove: in an isosceles triangle, the base angles are equal.', answer: 'draw the altitude/median from vertex, get two congruent triangles', hint: 'SAS or SSS congruence with the altitude.' },
        { prompt: 'Prove: the median to the hypotenuse of a right triangle equals half the hypotenuse.', answer: 'use the circumscribed circle: hypotenuse is diameter', hint: 'The midpoint of the hypotenuse is the circumcenter.' },
      ],
    },
    'two-cases': {
      problems: [
        { prompt: 'Prove: n^2 + n is even for all integers n. Use cases: n even, n odd.', answer: 'n even: n^2+n=even+even=even. n odd: n^2+n=odd+odd=even.', hint: 'Split into even and odd cases.' },
        { prompt: 'Prove: |x| = x or |x| = -x. Use cases.', answer: 'case x≥0: |x|=x. case x<0: |x|=-x', hint: 'Definition of absolute value splits into two cases.' },
        { prompt: 'Prove: max(a,b) = (a+b+|a-b|)/2.', answer: 'case a≥b: (a+b+a-b)/2=a. case a<b: (a+b+b-a)/2=b', hint: 'Split on which is larger.' },
        { prompt: 'Solve: |x-3| = 2x-1 using cases.', answer: 'x=4/3', hint: 'Case x≥3: x-3=2x-1, x=-2 (reject, not ≥3). Case x<3: 3-x=2x-1, x=4/3. Check: |4/3-3|=5/3, 2(4/3)-1=5/3. ✓' },
        { prompt: 'Prove: the product n(n+1) is even by cases.', answer: 'n even: n(n+1) has factor 2. n odd: n+1 is even, has factor 2.', hint: 'One of two consecutive integers must be even.' },
      ],
    },
    'parity-cases': {
      problems: [
        { prompt: 'Prove: n^2 mod 4 is either 0 or 1.', answer: 'n even: (2k)^2=4k^2≡0. n odd: (2k+1)^2=4k^2+4k+1≡1.', hint: 'Two cases based on parity of n.' },
        { prompt: 'If a+b is even, prove a and b have the same parity.', answer: 'if a,b both even or both odd, sum is even. if different parity, sum is odd.', hint: 'Check all four combinations of parity.' },
        { prompt: 'Can three odd numbers sum to 100?', answer: 'no', hint: 'odd+odd+odd = odd, but 100 is even.' },
        { prompt: 'Prove: n^3 and n have the same parity.', answer: 'n even: n^3 even. n odd: n^3 odd.', hint: 'Even cubed is even, odd cubed is odd.' },
        { prompt: 'If n^2 is divisible by 3, must n be divisible by 3?', answer: 'yes', hint: 'Check n≡0,1,2 mod 3: only n≡0 gives n^2≡0.' },
      ],
    },
    'sign-cases': {
      problems: [
        { prompt: 'Solve: x|x| = 4.', answer: 'x = 2', hint: 'If x>0: x^2=4, x=2. If x<0: -x^2=4, impossible.' },
        { prompt: 'For which x is x^3 > x?', answer: 'x > 1 or -1 < x < 0', hint: 'x^3 - x = x(x-1)(x+1) > 0. Use sign analysis.' },
        { prompt: 'Solve: (x-1)(x+2)(x-3) > 0.', answer: '-2 < x < 1 or x > 3', hint: 'Sign changes at x=-2, 1, 3. Test intervals.' },
        { prompt: 'Prove: |xy| = |x| · |y| using cases.', answer: 'four cases for signs of x and y, each confirms the equality', hint: 'Consider ++, +-, -+, -- cases.' },
        { prompt: 'For which x is 1/x > x?', answer: '0 < x < 1 or x < -1', hint: '1/x - x > 0, so (1-x^2)/x > 0.' },
      ],
    },
    'modular-cases': {
      problems: [
        { prompt: 'Prove: n^3 ≡ n (mod 3) for all integers n.', answer: 'n≡0: 0≡0. n≡1: 1≡1. n≡2: 8≡2.', hint: 'Check all three residues mod 3.' },
        { prompt: 'Find the remainder when 7^100 is divided by 5.', answer: '1', hint: '7≡2 mod 5. Powers of 2 mod 5: 2,4,3,1,2,4,3,1... period 4. 100 mod 4 = 0.' },
        { prompt: 'Prove: n^2 mod 3 is 0 or 1.', answer: 'n≡0: 0. n≡1: 1. n≡2: 4≡1.', hint: 'Three cases: n ≡ 0, 1, or 2 mod 3.' },
        { prompt: 'What is the last digit of 3^2025?', answer: '3', hint: 'Last digits cycle: 3,9,7,1. 2025 mod 4 = 1.' },
        { prompt: 'Prove: no perfect square ends in 2, 3, 7, or 8.', answer: 'check 0-9 squared mod 10: only 0,1,4,5,6,9 appear', hint: 'Compute n^2 mod 10 for n=0,...,9.' },
      ],
    },
    'exhaustive-cases': {
      problems: [
        { prompt: 'Find all single-digit primes.', answer: '2, 3, 5, 7', hint: 'Check each: 1 no, 2 yes, 3 yes, 4 no, 5 yes, 6 no, 7 yes, 8 no, 9 no.' },
        { prompt: 'How many ways can you pick 2 items from {A,B,C,D}? List them.', answer: '6: AB, AC, AD, BC, BD, CD', hint: 'C(4,2) = 6. List systematically.' },
        { prompt: 'Solve: x^2 ≡ 1 (mod 8). Check all residues.', answer: 'x ≡ 1, 3, 5, 7 (mod 8)', hint: 'Check 0^2=0, 1^2=1, 2^2=4, 3^2=1, 4^2=0, 5^2=1, 6^2=4, 7^2=1.' },
        { prompt: 'Find all integers n with |n| < 4 and n^2 < 10.', answer: '-3, -2, -1, 0, 1, 2, 3', hint: 'n ∈ {-3,-2,-1,0,1,2,3}. Check: all have n^2 ≤ 9 < 10.' },
        { prompt: 'Prove: among any 5 integers, two have the same remainder mod 4.', answer: 'pigeonhole: 4 possible remainders, 5 integers', hint: 'By the Pigeonhole Principle, two share a remainder.' },
      ],
    },
  },
  'intermediate': {
    'assume-negation': {
      problems: [
        { prompt: 'Prove by contradiction: sqrt(2) is irrational.', answer: 'assume sqrt(2)=p/q in lowest terms, then p^2=2q^2, so p is even, then q is even, contradiction', hint: 'Assume it is rational and derive that both numerator and denominator are even.' },
        { prompt: 'Prove: there is no smallest positive rational number.', answer: 'assume r is smallest, then r/2 is smaller and still positive rational', hint: 'Take your supposed smallest and divide by 2.' },
        { prompt: 'Prove: if n^2 is even, n is even (by contradiction).', answer: 'assume n odd, then n^2 = (2k+1)^2 = odd, contradicts n^2 even', hint: 'Assume n is odd and show n^2 must be odd.' },
        { prompt: 'Prove: there are infinitely many primes (Euclid).', answer: 'assume finite list p1...pn, consider N=p1·p2·...·pn + 1, N not divisible by any pi', hint: 'The number N = product + 1 has a prime factor not in the list.' },
        { prompt: 'Prove: log_2(3) is irrational.', answer: 'assume log_2(3)=p/q, then 2^(p/q)=3, 2^p=3^q, impossible (even≠odd)', hint: '2^p is even, 3^q is odd. Contradiction.' },
      ],
    },
    'irrationality-proofs': {
      problems: [
        { prompt: 'Prove sqrt(3) is irrational.', answer: 'assume sqrt(3)=p/q, then p^2=3q^2, so 3|p, write p=3k, then 9k^2=3q^2, 3|q, contradiction', hint: 'Same structure as sqrt(2) proof but with divisibility by 3.' },
        { prompt: 'Is sqrt(4) irrational?', answer: 'no, sqrt(4) = 2', hint: 'sqrt(4) is a perfect square.' },
        { prompt: 'Prove: sqrt(2) + sqrt(3) is irrational.', answer: 'assume rational, square to get 5+2sqrt(6) rational, so sqrt(6) rational, contradiction', hint: 'If a = sqrt(2)+sqrt(3) is rational, then a^2 = 5 + 2sqrt(6).' },
        { prompt: 'Prove: the sum of a rational and irrational number is irrational.', answer: 'assume r + i = q (rational), then i = q - r (rational), contradiction', hint: 'If the sum were rational, the irrational number would be rational too.' },
        { prompt: 'Is 0.101001000100001... (pattern continues) rational?', answer: 'no, irrational', hint: 'The decimal representation is non-terminating and non-repeating.' },
      ],
    },
    'infinitude-proofs': {
      problems: [
        { prompt: 'Prove there are infinitely many even numbers.', answer: 'for any even number 2n, 2(n+1) is a larger even number', hint: 'No largest even number exists because you can always add 2.' },
        { prompt: 'Prove there are infinitely many primes of the form 4k+3.', answer: 'assume finitely many, form N=4(p1·p2·...·pn)-1, N≡3 mod 4, must have a factor ≡3 mod 4', hint: 'Similar to Euclid but consider residues mod 4.' },
        { prompt: 'Prove: between any two rationals, there is another rational.', answer: 'the average (a+b)/2 is rational and strictly between a and b', hint: 'Take the average of the two rationals.' },
        { prompt: 'Prove there are infinitely many multiples of 7.', answer: 'for any multiple 7n, 7(n+1) is a larger one', hint: 'No largest multiple exists.' },
        { prompt: 'Prove: the set of integers is infinite.', answer: 'for any integer n, n+1 is a larger integer', hint: 'Successor function provides a larger element.' },
      ],
    },
    'uniqueness-proofs': {
      problems: [
        { prompt: 'Prove: the additive identity (0) is unique.', answer: 'suppose 0 and 0\' are both identities, then 0=0+0\'=0\'', hint: 'Apply both identity properties to each other.' },
        { prompt: 'Prove: the multiplicative inverse of a nonzero real is unique.', answer: 'if ab=1 and ac=1, then b=b·1=b(ac)=(ba)c=1·c=c', hint: 'Assume two inverses exist and show they must be equal.' },
        { prompt: 'Prove: the empty set is unique.', answer: 'if A and B are both empty, then A⊆B and B⊆A, so A=B', hint: 'Any two empty sets are subsets of each other.' },
        { prompt: 'Prove: the solution to ax=b (a≠0) is unique.', answer: 'if ax1=b and ax2=b, then a(x1-x2)=0, since a≠0, x1=x2', hint: 'Subtract one equation from the other.' },
        { prompt: 'Prove: every integer has a unique representation in base 10.', answer: 'division algorithm gives unique quotients/remainders at each step', hint: 'The uniqueness of the division algorithm is the key.' },
      ],
    },
    'pigeonhole-principle': {
      problems: [
        { prompt: 'Among 13 people, prove at least 2 share a birth month.', answer: '12 months, 13 people, pigeonhole gives at least 2 in one month', hint: '13 pigeons in 12 holes means some hole has ≥ 2.' },
        { prompt: 'Pick 5 numbers from {1,...,8}. Prove two sum to 9.', answer: 'pairs summing to 9: {1,8},{2,7},{3,6},{4,5}. 5 numbers from 4 pairs.', hint: 'The four complementary pairs are the pigeonholes.' },
        { prompt: 'In a room of 367 people, must two share a birthday?', answer: 'yes', hint: '366 possible birthdays (including Feb 29), 367 > 366.' },
        { prompt: 'Among any 10 integers, prove two have the same last digit.', answer: '10 possible last digits (0-9), 10 numbers, by PHP two match', hint: '10 pigeonholes (digits 0-9), 10 numbers.' },
        { prompt: 'Choose 6 numbers from {1,...,10}. Prove some two differ by 5.', answer: 'pairs differing by 5: {1,6},{2,7},{3,8},{4,9},{5,10}. 6 from 5 pairs.', hint: 'Five pigeonholes, six numbers.' },
      ],
    },
    'base-case': {
      problems: [
        { prompt: 'Verify the base case for: 1+2+...+n = n(n+1)/2.', answer: 'n=1: LHS=1, RHS=1(2)/2=1. Base case holds.', hint: 'Plug in n=1.' },
        { prompt: 'Verify base case for: 2^n > n for n ≥ 1.', answer: 'n=1: 2^1=2 > 1. True.', hint: 'Check n=1.' },
        { prompt: 'Verify base case for: n! > 2^n for n ≥ 4.', answer: 'n=4: 4!=24 > 2^4=16. True.', hint: 'The base case starts at n=4, not n=1.' },
        { prompt: 'Verify base case for: 1+3+5+...+(2n-1) = n^2.', answer: 'n=1: LHS=1, RHS=1^2=1. True.', hint: 'Just one odd number in the sum for n=1.' },
        { prompt: 'Verify base case for: 3 | (4^n - 1).', answer: 'n=1: 4^1-1=3. 3|3. True.', hint: 'Check n=1.' },
      ],
    },
    'inductive-step': {
      problems: [
        { prompt: 'Inductive step for: sum of first n odds = n^2. Assume true for k, prove for k+1.', answer: 'k^2 + (2(k+1)-1) = k^2 + 2k + 1 = (k+1)^2', hint: 'Add the next odd number (2k+1) to both sides.' },
        { prompt: 'Inductive step for: 1+2+...+n = n(n+1)/2.', answer: 'k(k+1)/2 + (k+1) = (k+1)(k+2)/2', hint: 'Add (k+1) to k(k+1)/2 and simplify.' },
        { prompt: 'Inductive step for: 3 | (4^n - 1).', answer: '4^(k+1)-1 = 4·4^k - 1 = 4(4^k-1) + 3. Both terms divisible by 3.', hint: 'Write 4^(k+1) = 4 · 4^k and manipulate.' },
        { prompt: 'Inductive step for: 2^n > n. Assume 2^k > k, prove 2^(k+1) > k+1.', answer: '2^(k+1) = 2·2^k > 2k ≥ k+1 for k ≥ 1', hint: 'Double both sides of the hypothesis.' },
        { prompt: 'What is the critical mistake in a faulty induction proof?', answer: 'usually the inductive step fails for a specific small case', hint: 'Check that the step is valid for ALL k ≥ base case.' },
      ],
    },
    'sum-formulas': {
      problems: [
        { prompt: 'Prove by induction: 1+2+...+n = n(n+1)/2.', answer: 'base n=1: 1=1. step: k(k+1)/2+(k+1)=(k+1)(k+2)/2', hint: 'Standard induction proof.' },
        { prompt: 'Prove: 1^2+2^2+...+n^2 = n(n+1)(2n+1)/6.', answer: 'base n=1: 1=1. step: add (k+1)^2 and simplify', hint: 'k(k+1)(2k+1)/6 + (k+1)^2 = (k+1)(k+2)(2k+3)/6.' },
        { prompt: 'Prove: 1+3+5+...+(2n-1) = n^2.', answer: 'base n=1: 1=1. step: k^2 + (2k+1) = (k+1)^2', hint: 'Add the next odd number to both sides.' },
        { prompt: 'Prove: 1+r+r^2+...+r^n = (r^(n+1)-1)/(r-1).', answer: 'base n=0: 1=(r-1)/(r-1). step: multiply and simplify', hint: 'Add r^(k+1) to both sides.' },
        { prompt: 'Derive: 1+2+4+...+2^n = 2^(n+1) - 1.', answer: 'geometric series with r=2: (2^(n+1)-1)/(2-1)', hint: 'Apply the geometric series formula.' },
      ],
    },
    'inequality-induction': {
      problems: [
        { prompt: 'Prove by induction: 2^n ≥ n+1 for n ≥ 1.', answer: 'base n=1: 2≥2. step: 2^(k+1)=2·2^k ≥ 2(k+1)=2k+2 ≥ k+2', hint: 'Double both sides of the hypothesis.' },
        { prompt: 'Prove: n! ≥ 2^n for n ≥ 4.', answer: 'base n=4: 24≥16. step: (k+1)!=k!·(k+1) ≥ 2^k·(k+1) ≥ 2^k·2 = 2^(k+1)', hint: 'For k ≥ 4, (k+1) ≥ 2, so multiplying preserves the inequality.' },
        { prompt: 'Prove: (1+x)^n ≥ 1+nx for x ≥ -1, n ≥ 1 (Bernoulli).', answer: 'base n=1: 1+x≥1+x. step: (1+x)^(k+1)=(1+x)^k(1+x) ≥ (1+kx)(1+x) = 1+(k+1)x+kx^2 ≥ 1+(k+1)x', hint: 'Multiply hypothesis by (1+x) ≥ 0 and drop the kx^2 ≥ 0 term.' },
        { prompt: 'Prove: 3^n > n^2 for n ≥ 2.', answer: 'base n=2: 9>4. step needs 3·k^2 > (k+1)^2 for large enough k', hint: 'Show 3k^2 > k^2 + 2k + 1 by showing 2k^2 - 2k - 1 > 0 for k ≥ 2.' },
        { prompt: 'Prove: 1/1^2 + 1/2^2 + ... + 1/n^2 ≤ 2 - 1/n for n ≥ 1.', answer: 'base n=1: 1≤1. step: add 1/(k+1)^2 ≤ 1/k - 1/(k+1)', hint: 'Note 1/(k+1)^2 ≤ 1/(k(k+1)) = 1/k - 1/(k+1).' },
      ],
    },
    'strong-induction': {
      problems: [
        { prompt: 'Prove every integer ≥ 2 has a prime factorization using strong induction.', answer: 'if n prime, done. if n composite, n=ab with 2≤a,b<n, apply hypothesis to each', hint: 'Strong induction: assume true for ALL values 2,...,k.' },
        { prompt: 'Prove: every amount ≥ 8 cents can be made with 3¢ and 5¢ stamps.', answer: 'base: 8=3+5, 9=3+3+3, 10=5+5. step: for n≥11, use n-3 (which is ≥8)', hint: 'Base cases: 8, 9, 10. Then for n ≥ 11, subtract 3 and use strong hypothesis.' },
        { prompt: 'What makes strong induction different from regular induction?', answer: 'strong induction assumes the statement for ALL values up to k, not just k', hint: 'The hypothesis is stronger: true for 1, 2, ..., k (not just k).' },
        { prompt: 'Prove: every positive integer can be written as a sum of distinct powers of 2.', answer: 'strong induction on n. If n even, n=2m, use hypothesis on m. If n odd, n=2m+1.', hint: 'This is essentially proving binary representation exists.' },
        { prompt: 'Prove: Fibonacci numbers satisfy F_n < 2^n.', answer: 'base F_1=1<2, F_2=1<4. step: F_(k+1)=F_k+F_(k-1) < 2^k+2^(k-1) < 2^(k+1)', hint: 'Use strong induction and the recursive definition.' },
      ],
    },
    'counting-principles': {
      problems: [
        { prompt: 'How many 3-digit numbers use only odd digits?', answer: '125', hint: '5 choices for each of 3 positions: 5^3.' },
        { prompt: 'How many ways to arrange 4 books on a shelf?', answer: '24', hint: '4! = 24.' },
        { prompt: 'A menu has 3 appetizers, 5 mains, 2 desserts. How many meals?', answer: '30', hint: 'Multiplication principle: 3 × 5 × 2.' },
        { prompt: 'How many subsets does {a,b,c,d,e} have?', answer: '32', hint: '2^5 = 32.' },
        { prompt: 'License plates: 3 letters then 4 digits. How many possible?', answer: '175760000', hint: '26^3 × 10^4 = 17576 × 10000.' },
      ],
    },
    'permutations': {
      problems: [
        { prompt: 'How many ways can 8 runners finish 1st, 2nd, 3rd?', answer: '336', hint: 'P(8,3) = 8 × 7 × 6.' },
        { prompt: 'How many arrangements of the letters in MATH?', answer: '24', hint: '4! = 24 (all distinct letters).' },
        { prompt: 'How many arrangements of the letters in MISSISSIPPI?', answer: '34650', hint: '11!/(4!4!2!) for repeated letters.' },
        { prompt: 'How many 5-letter "words" from {A,B,C,D,E,F} with no repeats?', answer: '720', hint: 'P(6,5) = 6 × 5 × 4 × 3 × 2.' },
        { prompt: 'In how many ways can 6 people sit in a circle?', answer: '120', hint: 'Circular permutations: (6-1)! = 5!.' },
      ],
    },
    'combinations': {
      problems: [
        { prompt: 'How many ways to choose a committee of 3 from 10 people?', answer: '120', hint: 'C(10,3) = 10!/(3!7!) = 120.' },
        { prompt: 'How many 5-card hands from a 52-card deck?', answer: '2598960', hint: 'C(52,5) = 52!/(5!47!).' },
        { prompt: 'C(n,0) + C(n,1) + ... + C(n,n) = ?', answer: '2^n', hint: 'This counts all subsets of an n-element set.' },
        { prompt: 'How many diagonals in a convex 12-gon?', answer: '54', hint: 'C(12,2) - 12 = 66 - 12 = 54.' },
        { prompt: 'Prove: C(n,k) = C(n,n-k).', answer: 'choosing k to include = choosing n-k to exclude', hint: 'Both equal n!/(k!(n-k)!).' },
      ],
    },
    'stars-and-bars': {
      problems: [
        { prompt: 'How many solutions to x+y+z = 10 with x,y,z ≥ 0?', answer: '66', hint: 'C(10+3-1, 3-1) = C(12,2).' },
        { prompt: 'Distribute 8 identical cookies to 3 children (each gets ≥ 1).', answer: '21', hint: 'Give each child 1 first: 5 remaining. C(5+2,2) = C(7,2) = 21.' },
        { prompt: 'How many ways to put 5 identical balls into 4 distinct boxes?', answer: '56', hint: 'C(5+4-1, 4-1) = C(8,3).' },
        { prompt: 'Solutions to a+b+c+d = 7 with a,b,c,d ≥ 0?', answer: '120', hint: 'C(7+4-1, 4-1) = C(10,3).' },
        { prompt: 'How many monomials of degree 3 in variables x,y,z?', answer: '10', hint: 'Same as solutions to a+b+c=3: C(5,2) = 10.' },
      ],
    },
    'inclusion-exclusion': {
      problems: [
        { prompt: '|A|=30, |B|=20, |A∩B|=10. Find |A∪B|.', answer: '40', hint: '|A∪B| = |A|+|B|-|A∩B| = 30+20-10.' },
        { prompt: 'How many integers 1-100 are divisible by 2 or 3?', answer: '67', hint: 'Div by 2: 50. Div by 3: 33. Div by 6: 16. Answer: 50+33-16.' },
        { prompt: 'How many integers 1-1000 are not divisible by 2, 3, or 5?', answer: '266', hint: 'Use inclusion-exclusion to count those divisible by 2,3, or 5, then subtract from 1000.' },
        { prompt: 'Derangements: how many permutations of {1,2,3,4} have no fixed points?', answer: '9', hint: 'D(4) = 4!(1-1+1/2-1/6+1/24) = 24(9/24) = 9.' },
        { prompt: 'How many onto functions from {1,2,3,4} to {a,b,c}?', answer: '36', hint: 'By inclusion-exclusion: 3^4 - C(3,1)2^4 + C(3,2)1^4 = 81-48+3.' },
      ],
    },
    'divisibility-rules': {
      problems: [
        { prompt: 'Is 4,536 divisible by 9?', answer: 'yes', hint: 'Digit sum: 4+5+3+6 = 18, which is divisible by 9.' },
        { prompt: 'Is 7,284 divisible by 4?', answer: 'yes', hint: 'Last two digits: 84 ÷ 4 = 21.' },
        { prompt: 'State the divisibility rule for 11.', answer: 'alternating sum of digits is divisible by 11', hint: 'Sum of odd-position digits minus sum of even-position digits.' },
        { prompt: 'Is 123,456 divisible by 8?', answer: 'yes', hint: 'Last 3 digits: 456 ÷ 8 = 57.' },
        { prompt: 'Is 31,416 divisible by 6?', answer: 'yes', hint: 'Even (div by 2) and digit sum = 15 (div by 3).' },
      ],
    },
    'gcd-lcm': {
      problems: [
        { prompt: 'Find GCD(48, 36) using the Euclidean algorithm.', answer: '12', hint: '48 = 1(36) + 12. 36 = 3(12) + 0. GCD = 12.' },
        { prompt: 'Find LCM(12, 18).', answer: '36', hint: 'LCM = (12 × 18)/GCD(12,18) = 216/6 = 36.' },
        { prompt: 'Find GCD(100, 75).', answer: '25', hint: '100 = 1(75) + 25. 75 = 3(25) + 0.' },
        { prompt: 'Prove: GCD(a,b) × LCM(a,b) = a × b.', answer: 'follows from prime factorization: GCD takes min powers, LCM takes max powers', hint: 'For each prime, min + max = the two original powers summed.' },
        { prompt: 'Find GCD(1001, 770).', answer: '77', hint: '1001 = 1(770) + 231. 770 = 3(231) + 77. 231 = 3(77).' },
      ],
    },
    'modular-arithmetic': {
      problems: [
        { prompt: 'Compute: 17 × 23 mod 10', answer: '1', hint: '7 × 3 = 21 ≡ 1 mod 10.' },
        { prompt: 'Solve: 3x ≡ 1 (mod 7)', answer: 'x ≡ 5 (mod 7)', hint: '3(5) = 15 = 2(7) + 1.' },
        { prompt: 'Find 2^10 mod 11.', answer: '1', hint: 'By Fermat\'s Little Theorem: 2^10 ≡ 1 mod 11.' },
        { prompt: 'What day is 100 days after Monday?', answer: 'Wednesday', hint: '100 mod 7 = 2. Monday + 2 = Wednesday.' },
        { prompt: 'Compute: 7^2024 mod 10.', answer: '1', hint: 'Powers of 7 mod 10: 7,9,3,1,7,9,3,1... period 4. 2024 mod 4 = 0.' },
      ],
    },
    'prime-factorization': {
      problems: [
        { prompt: 'Find the prime factorization of 360.', answer: '2^3 × 3^2 × 5', hint: '360 = 8 × 45 = 8 × 9 × 5.' },
        { prompt: 'How many divisors does 360 have?', answer: '24', hint: '(3+1)(2+1)(1+1) = 4×3×2.' },
        { prompt: 'Find the prime factorization of 2310.', answer: '2 × 3 × 5 × 7 × 11', hint: '2310 = 2 × 1155 = 2 × 3 × 385 = ...' },
        { prompt: 'What is the smallest number with exactly 12 divisors?', answer: '60', hint: '12 = 6×2 = 4×3 = 3×2×2. Try 2^5×3, 2^3×3^2, 2^2×3×5.' },
        { prompt: 'Find the sum of divisors of 12.', answer: '28', hint: '1+2+3+4+6+12 = 28. (12 is NOT perfect since 28 ≠ 2×12.)' },
      ],
    },
    'diophantine-equations': {
      problems: [
        { prompt: 'Find all positive integer solutions: 3x + 5y = 26.', answer: '(2,4) and (7,1)', hint: 'Try y=1: x=7. y=2: x not integer. y=3: x not integer. y=4: x=2.' },
        { prompt: 'Does 6x + 9y = 10 have integer solutions?', answer: 'no', hint: 'GCD(6,9)=3, but 3 does not divide 10.' },
        { prompt: 'Find all positive integer solutions: x^2 - y^2 = 15.', answer: '(4,1) and (8,7)', hint: '(x-y)(x+y)=15. Factor pairs: (1,15),(3,5).' },
        { prompt: 'Chicken-rabbit problem: 35 heads, 94 legs. How many of each?', answer: '23 chickens, 12 rabbits', hint: '2c + 4r = 94, c + r = 35. Solve.' },
        { prompt: 'Find one solution to 7x + 11y = 1 (extended Euclidean).', answer: 'x=-3, y=2', hint: '11 = 1(7) + 4. 7 = 1(4) + 3. 4 = 1(3) + 1. Back-substitute.' },
      ],
    },
    'define-variables': {
      problems: [
        { prompt: 'A car travels at 60 mph for t hours, then 40 mph for (5-t) hours, covering 250 miles. Set up the equation.', answer: '60t + 40(5-t) = 250', hint: 'Distance = rate × time for each segment.' },
        { prompt: 'A rectangle\'s length is 3 more than twice its width. Perimeter is 42. Define variables and write equations.', answer: 'w = width, l = 2w+3, 2l+2w = 42', hint: 'Two unknowns, two relationships.' },
        { prompt: 'A store sells pens at $2 and notebooks at $5. Revenue from 100 items is $350. Set up system.', answer: 'p + n = 100, 2p + 5n = 350', hint: 'Two unknowns: number of pens and notebooks.' },
        { prompt: 'Mixture: 20% acid solution mixed with 50% to get 10L of 30%. Set up.', answer: 'x + y = 10, 0.2x + 0.5y = 3', hint: 'Volume balance and acid balance.' },
        { prompt: 'Two trains leave same station in opposite directions at 50 and 70 mph. When are they 360 miles apart?', answer: '50t + 70t = 360, t = 3 hours', hint: 'Combined distance = sum of individual distances.' },
      ],
    },
    'write-equations': {
      problems: [
        { prompt: 'The area of a triangle with base b and height b+4 is 48. Write the equation.', answer: 'b(b+4)/2 = 48', hint: 'A = (1/2)bh.' },
        { prompt: 'Compound interest: $1000 at r% compounded annually is $1210 after 2 years. Write equation.', answer: '1000(1+r)^2 = 1210', hint: 'A = P(1+r)^t.' },
        { prompt: 'A ball is thrown up at 64 ft/s from 80 ft high. Write height equation.', answer: 'h(t) = -16t^2 + 64t + 80', hint: 'Standard form: h = -16t^2 + v_0·t + h_0.' },
        { prompt: 'The sum of a number and its reciprocal is 10/3. Write equation.', answer: 'x + 1/x = 10/3', hint: 'Let x be the number.' },
        { prompt: 'A wire of length 20 is bent into a rectangle. Maximize area. Write as function of one variable.', answer: 'A(w) = w(10-w)', hint: 'If width = w, then length = (20-2w)/2 = 10-w.' },
      ],
    },
    'interpret-solutions': {
      problems: [
        { prompt: 'Solving a distance problem, you get t = -2 and t = 5. Interpret.', answer: 't = 5 hours (reject t = -2 since time is positive)', hint: 'Negative time has no physical meaning in this context.' },
        { prompt: 'A profit function gives break-even at x = 50 and x = 200. Interpret.', answer: 'profit is positive for 50 < x < 200 units', hint: 'Profit is zero at break-even points, positive between them.' },
        { prompt: 'An optimization gives max revenue at price $45 with R = $2025. What does this mean?', answer: 'charging $45 per unit maximizes total revenue at $2025', hint: 'The vertex of the revenue parabola.' },
        { prompt: 'A quadratic has discriminant < 0 in a distance problem. Interpret.', answer: 'no solution: the objects never meet', hint: 'No real roots means no real-world intersection.' },
        { prompt: 'You find the population reaches 0 at t = 15 years. What does this imply?', answer: 'the population goes extinct after 15 years', hint: 'The model predicts population declining to zero.' },
      ],
    },
    'optimization-setup': {
      problems: [
        { prompt: 'Farmer has 200 ft of fence for 3 sides of a rectangular pen (4th is a barn). Maximize area.', answer: 'A = x(200-2x), max at x=50, A=5000', hint: 'If x = perpendicular side, then parallel side = 200-2x.' },
        { prompt: 'Minimize perimeter of a rectangle with area 100.', answer: 'P = 2x + 200/x, min at x=10, P=40 (square)', hint: 'If width = x, length = 100/x.' },
        { prompt: 'Find two positive numbers with sum 20 that maximize product.', answer: '10 and 10, product = 100', hint: 'P = x(20-x) = -x^2 + 20x, max at vertex x = 10.' },
        { prompt: 'A box with square base and open top has volume 32. Minimize surface area.', answer: 'S = x^2 + 128/x, min at x=4, S=48', hint: 'V = x^2h = 32, so h = 32/x^2. S = x^2 + 4xh.' },
        { prompt: 'Ticket price $10 sells 100 tickets. Each $1 increase loses 5 sales. Maximize revenue.', answer: 'R = (10+x)(100-5x), max at x=5, price=$15, R=$1125', hint: 'R = (10+x)(100-5x) = 1000+50x-5x^2. Vertex at x=-50/(-10)=5.' },
      ],
    },
    'validate-model': {
      problems: [
        { prompt: 'A linear model predicts 200 students in year 10 and -50 in year 60. Is this reasonable?', answer: 'no, negative population is impossible; model breaks down', hint: 'Linear models often fail for long-term predictions.' },
        { prompt: 'Your exponential growth model gives a population of 10^15 after 100 years. Comment.', answer: 'unreasonable; real populations face carrying capacity limits', hint: 'Exponential growth cannot continue forever.' },
        { prompt: 'A model predicts a ball at height -10 feet. What went wrong?', answer: 'the ball hit the ground; model valid only while h ≥ 0', hint: 'The domain of the model should be restricted.' },
        { prompt: 'Your regression has R^2 = 0.35. Is it a good model?', answer: 'weak; only explains 35% of variance', hint: 'R^2 should be close to 1 for a good fit.' },
        { prompt: 'You use data from ages 20-40 to predict health outcomes at age 80. Concern?', answer: 'extrapolation beyond data range is unreliable', hint: 'Models are most reliable within the range of the original data.' },
      ],
    },
  },
  'competition': {
    'time-management': {
      problems: [
        { prompt: 'AMC 10 has 25 problems in 75 minutes. What is the ideal time per problem?', answer: '3 minutes', hint: '75/25 = 3 minutes each.' },
        { prompt: 'Strategy: you have 10 minutes left and 5 problems. What do you do?', answer: 'skip hardest, focus on problems where you can make progress', hint: 'Prioritize problems you can solve; guessing penalty matters.' },
        { prompt: 'AMC scoring: 6 points correct, 1.5 points blank, 0 wrong. You are unsure of 3 answers. Strategy?', answer: 'leave blank unless you can eliminate 2+ choices', hint: 'Expected value of guessing randomly: 6/5 = 1.2 < 1.5.' },
        { prompt: 'You solved problem 15 but are unsure. Spend 5 more minutes verifying or move to 16?', answer: 'verify quickly (2 min max), then move on', hint: 'A secure answer is worth more than a maybe on the next.' },
        { prompt: 'In a competition, you\'re stuck. What\'s the best use of your time?', answer: 'skip and return; subconscious may process it', hint: 'Mark it and move on. Fresh eyes later.' },
      ],
    },
    'answer-choices': {
      problems: [
        { prompt: 'Problem asks for the area of a triangle with sides 3,4,5. Choices: (A)5 (B)6 (C)7 (D)8 (E)10. Quick!', answer: '6', hint: 'Right triangle: area = (3)(4)/2 = 6.' },
        { prompt: 'Choices are 12, 24, 36, 48, 60. The answer must be divisible by both 4 and 6. Eliminate.', answer: '12, 24, 36, 48, 60 all work; need more info', hint: 'LCM(4,6) = 12. All choices are multiples of 12.' },
        { prompt: 'The answer to a counting problem must be positive. Eliminate negative choices.', answer: 'eliminate any negative or zero answers', hint: 'Counting problems always have positive integer answers.' },
        { prompt: 'Problem has symmetry in x and y. Which answer preserves this symmetry?', answer: 'the answer must also be symmetric in x and y', hint: 'If swapping x and y doesn\'t change the problem, the answer should also be unchanged.' },
        { prompt: 'Approximate: 2^10 + 2^9. Choices: 768, 1024, 1536, 2048, 3072.', answer: '1536', hint: '2^10 + 2^9 = 1024 + 512 = 1536.' },
      ],
    },
    'plug-in-values': {
      problems: [
        { prompt: 'If f(x) = f(1-x) for all x, and f(3) = 7, find f(-2).', answer: '7', hint: 'f(-2) = f(1-(-2)) = f(3) = 7.' },
        { prompt: 'For all positive n: 1+2+...+n = n(n+1)/2. Find 1+2+...+1000.', answer: '500500', hint: '1000(1001)/2 = 500500.' },
        { prompt: 'If x + 1/x = 5, find x^2 + 1/x^2.', answer: '23', hint: 'Square both sides: x^2 + 2 + 1/x^2 = 25.' },
        { prompt: 'A polynomial p(x) satisfies p(1)=3, p(2)=5, p(3)=7. Guess p(x).', answer: 'p(x) = 2x + 1', hint: 'Linear pattern: each value increases by 2.' },
        { prompt: 'If a*b = a+b+ab, find 2*3.', answer: '11', hint: '2 + 3 + 2(3) = 11.' },
      ],
    },
    'pattern-recognition': {
      problems: [
        { prompt: '1, 1, 2, 3, 5, 8, 13, ... What is the 10th term?', answer: '55', hint: 'Fibonacci sequence. Continue: 21, 34, 55.' },
        { prompt: 'What is the units digit of 7^7^7?', answer: '3', hint: '7^1→7, 7^2→9, 7^3→3, 7^4→1. Period 4. 7^7 mod 4 = 3. So units = 7^3 mod 10 = 3.' },
        { prompt: '1^3 + 2^3 + ... + n^3 = (1+2+...+n)^2. Find 1^3+2^3+...+5^3.', answer: '225', hint: '(1+2+3+4+5)^2 = 15^2 = 225.' },
        { prompt: 'The sequence 2, 6, 12, 20, 30, ... What is the general term?', answer: 'n(n+1)', hint: '2=1(2), 6=2(3), 12=3(4), 20=4(5), 30=5(6).' },
        { prompt: 'In Pascal\'s triangle, what is the sum of row n?', answer: '2^n', hint: 'C(n,0)+C(n,1)+...+C(n,n) = 2^n.' },
      ],
    },
    'estimation': {
      problems: [
        { prompt: 'Estimate: sqrt(83).', answer: 'approximately 9.1', hint: '9^2=81, 10^2=100. 83 is close to 81.' },
        { prompt: 'Estimate: 998 × 1003 without a calculator.', answer: 'approximately 1000994', hint: '(1000-2)(1000+3) = 10^6 + 3000 - 2000 - 6 = 1000994.' },
        { prompt: 'Which is bigger: 2^40 or 10^12?', answer: '2^40', hint: '2^10 ≈ 10^3, so 2^40 = (2^10)^4 ≈ 10^12. Actually 2^40 = 1.0995 × 10^12 > 10^12.' },
        { prompt: 'Estimate: 1/7 as a decimal.', answer: '0.142857...', hint: '7 × 14 = 98 ≈ 100, so 1/7 ≈ 0.14.' },
        { prompt: 'Estimate: how many digits does 2^100 have?', answer: '31', hint: 'log_10(2^100) = 100 × log_10(2) ≈ 100 × 0.301 = 30.1. So 31 digits.' },
      ],
    },
    'clever-algebra': {
      problems: [
        { prompt: 'Find: 999^2 + 999 + 1000.', answer: '1000000', hint: '999^2 + 999 + 1000 = 999(999+1) + 1000 = 999(1000) + 1000 = 1000(999+1) = 1000000.' },
        { prompt: 'Simplify: (x^2+1)/(x+1) + (x^2+1)/(x-1) when x=sqrt(2).', answer: '6sqrt(2)', hint: 'Common denominator: (x+1)(x-1)=x^2-1. Numerator: (x^2+1)(x-1)+(x^2+1)(x+1)=(x^2+1)(2x). Result: 2x(x^2+1)/(x^2-1). For x=sqrt(2): 2sqrt(2)(3)/(2-1) = 6sqrt(2).' },
        { prompt: 'If x + y = 10 and xy = 21, find x^2 + y^2.', answer: '58', hint: 'x^2 + y^2 = (x+y)^2 - 2xy = 100 - 42.' },
        { prompt: 'Find: (a-b)(a+b) + (b-c)(b+c) + (c-a)(c+a).', answer: '0', hint: 'a^2-b^2 + b^2-c^2 + c^2-a^2 = 0.' },
        { prompt: 'Compute: 20^2 - 19^2 + 18^2 - 17^2 + ... + 2^2 - 1^2.', answer: '210', hint: 'Pair: (20^2-19^2)+(18^2-17^2)+... = 39+35+31+...+3. Arithmetic series.' },
      ],
    },
    'geometric-insight': {
      problems: [
        { prompt: 'Three circles of radius 1 are mutually tangent. Find the area between them.', answer: 'sqrt(3) - pi/2', hint: 'Connect centers to form equilateral triangle side 2. Area = sqrt(3) - 3(60°/360°)π(1)^2.' },
        { prompt: 'A square has vertices on a circle of radius 5. Find the square\'s area.', answer: '50', hint: 'Diagonal = diameter = 10. Side = 10/sqrt(2). Area = 50.' },
        { prompt: 'What is the area of the largest rectangle inscribed in a circle of radius r?', answer: '2r^2', hint: 'The square maximizes area. Side = r sqrt(2), area = 2r^2.' },
        { prompt: 'Two circles of radius 5 overlap such that each passes through the other\'s center. Find overlap area.', answer: '(25/6)(4pi - 3sqrt(3))', hint: 'Center distance=5. Central angle 2π/3 at each center. A = 2·(r²/2)(θ-sinθ) = 25(2π/3-√3/2) = (25/6)(4π-3√3).' },
        { prompt: 'A regular hexagon has side length 6. Find its area.', answer: '54sqrt(3)', hint: 'Area = (3sqrt(3)/2) × s^2 = (3sqrt(3)/2)(36).' },
      ],
    },
    'counting-advanced': {
      problems: [
        { prompt: 'How many ways can 10 people be divided into 2 teams of 5?', answer: '126', hint: 'C(10,5)/2 = 252/2 = 126 (divide by 2 since teams are unlabeled).' },
        { prompt: 'How many lattice paths from (0,0) to (6,4) using steps R and U?', answer: '210', hint: 'C(10,4) = 210. Choose 4 U\'s among 10 steps.' },
        { prompt: 'Catalan number: how many valid arrangements of 5 pairs of parentheses?', answer: '42', hint: 'C_5 = C(10,5)/6 = 252/6 = 42.' },
        { prompt: 'How many surjections from {1,2,3,4,5} to {a,b,c}?', answer: '150', hint: 'By inclusion-exclusion: 3^5 - 3(2^5) + 3(1) = 243 - 96 + 3 = 150.' },
        { prompt: 'How many 5-digit numbers have digits in strictly increasing order?', answer: '126', hint: 'Choose 5 digits from {1,...,9}: C(9,5) = 126. Order is forced.' },
      ],
    },
    'number-theory-advanced': {
      problems: [
        { prompt: 'Find the last two digits of 3^100.', answer: '01', hint: '3^20 ≡ 1 (mod 100) by Euler\'s theorem (φ(100)=40). Actually compute: 3^4=81, 3^20=(81)^5 mod 100.' },
        { prompt: 'How many zeros at the end of 50!?', answer: '12', hint: 'floor(50/5) + floor(50/25) = 10 + 2 = 12.' },
        { prompt: 'Find the sum of all divisors of 100.', answer: '217', hint: '100 = 2^2 × 5^2. σ(100) = (1+2+4)(1+5+25) = 7 × 31.' },
        { prompt: 'Solve: x^2 ≡ 1 (mod 24). Find all solutions 0 ≤ x < 24.', answer: '1, 5, 7, 11, 13, 17, 19, 23', hint: 'x^2-1 = (x-1)(x+1) ≡ 0 mod 24. Check all odd x.' },
        { prompt: 'What is φ(100)?', answer: '40', hint: 'φ(100) = 100(1-1/2)(1-1/5) = 100(1/2)(4/5).' },
      ],
    },
    'multi-step-synthesis': {
      problems: [
        { prompt: 'Find the area of triangle with vertices (0,0), (4,0), (1,3).', answer: '6', hint: 'Area = |x1(y2-y3)+x2(y3-y1)+x3(y1-y2)|/2 = |0+12-0|/2 = 6.' },
        { prompt: 'A number is 3 mod 5 and 2 mod 7. Find the smallest positive such number.', answer: '23', hint: 'CRT: x=5a+3=7b+2. Try a=0,1,2,3,4: 3,8,13,18,23. 23 mod 7 = 2. Yes!' },
        { prompt: 'How many integers 1-1000 are perfect squares or perfect cubes?', answer: '38', hint: 'Squares: 31. Cubes: 10. Sixth powers: 3. By inclusion-exclusion: 31+10-3=38.' },
        { prompt: 'In how many ways can you tile a 2×10 board with dominoes?', answer: '89', hint: 'Fibonacci-like: f(n) = f(n-1) + f(n-2). f(1)=1, f(2)=2, ..., f(10)=89.' },
        { prompt: 'If a+b+c=0, find (a^3+b^3+c^3)/(abc).', answer: '3', hint: 'a^3+b^3+c^3 = 3abc when a+b+c=0.' },
      ],
    },
    'identify-invariant': {
      problems: [
        { prompt: 'A 8×8 board has opposite corners removed. Can you tile with 1×2 dominoes?', answer: 'no', hint: 'Color the board like a chessboard. Both removed squares are the same color.' },
        { prompt: 'Start with (1,1). Each step: (a,b) → (a+b, a) or (a, a+b). Can you reach (3,5)?', answer: 'yes', hint: 'Trace: (1,1)→(2,1)→(3,1)→(3,4)→(3,7)... Try other paths.' },
        { prompt: 'Numbers 1-100 on board. Erase two, write their difference. Repeat. Can the last number be 0?', answer: 'no', hint: 'Sum has fixed parity. 1+2+...+100=5050 (even). Each operation preserves sum parity.' },
        { prompt: 'A circle has n points labeled +1 or -1. Product of adjacent pairs: all +1 or all -1? What\'s the invariant?', answer: 'the product of all n numbers is invariant', hint: 'Each step replaces numbers but the overall product is preserved.' },
        { prompt: 'Three piles: 11, 7, 6 coins. Each move: double the smaller of two piles by taking from larger. Can all piles equal 8?', answer: 'yes', hint: 'Total is 24, and 8+8+8=24. Check that moves can achieve this.' },
      ],
    },
    'coloring-arguments': {
      problems: [
        { prompt: 'Can a 10×10 board be tiled by 1×4 pieces?', answer: 'yes', hint: '100/4 = 25. Place them in rows of 10 = 4+4+2... try 2.5 per row with offsets.' },
        { prompt: 'Color a chessboard with 4 colors in columns. What does this reveal about L-tromino tiling?', answer: 'each L-tromino covers cells of specific color combinations', hint: 'The coloring constrains which positions each piece can occupy.' },
        { prompt: 'A 7×7 board. Remove one corner square. Can you tile with 1×2 dominoes?', answer: 'yes', hint: '49-1=48 squares, 24 dominoes needed. Checkerboard: 25 of one color, 24 of other. Corner is from 25-color, leaving 24-24. Equal colors, so tiling is possible.' },
        { prompt: 'On a standard chessboard, can a knight visit all 64 squares exactly once?', answer: 'yes', hint: 'A knight\'s tour exists. The coloring argument shows it alternates colors.' },
        { prompt: '2n people sit in a circle, n in red shirts, n in blue. Show someone has same-color neighbors.', answer: 'pigeonhole: consider blocks of same color', hint: 'If colors perfectly alternated, no same-color neighbors. But the transition between colors forces it.' },
      ],
    },
    'parity-invariants': {
      problems: [
        { prompt: 'Can you rearrange 1,2,3,...,n by swapping adjacent elements to reverse the order? How many swaps?', answer: 'n(n-1)/2 swaps', hint: 'Each swap changes the number of inversions by exactly 1.' },
        { prompt: 'Start with 1. Allowed operations: add 2 or multiply by 3. Can you reach 24?', answer: 'no', hint: 'Starting from 1 (odd), adding 2 keeps parity, multiplying by 3 keeps parity. 24 is even.' },
        { prompt: 'Three glasses: 2 up, 1 down. Each move flips exactly 2. Can all face up?', answer: 'no', hint: 'Parity: start with 2 up (even). Each move changes up-count by 0 or ±2 (stays even). Need 3 up (odd).' },
        { prompt: 'A dragon has 100 heads. A knight can cut off 15 or 10 heads, but 5 or 2 grow back. Can the dragon lose all heads?', answer: 'no', hint: 'Net -10 or -8. To reach 0, last cut needs 10 heads (cut 10, net -8 from 8) or 15 (cut 15, net -10 from 10). But cutting 10 requires ≥10 heads and cutting 15 requires ≥15 — cannot execute from 8 or 10.' },
        { prompt: 'Tokens numbered 1-10. Swap any two. After an even number of swaps, can you get 2,1,3,4,...,10?', answer: 'no', hint: 'That permutation is a single transposition (odd). Even swaps give even permutations.' },
      ],
    },
    'monovariant': {
      problems: [
        { prompt: 'Replace any two numbers a,b on a board with (a+b)/2, (a+b)/2. What happens to the sum of squares?', answer: 'it decreases (or stays same if a=b)', hint: '2((a+b)/2)^2 = (a+b)^2/2 ≤ a^2+b^2 by QM-AM.' },
        { prompt: 'Start with n positive integers. Replace max with max-min. What is the monovariant?', answer: 'the maximum decreases (and is bounded below by 0)', hint: 'The max is a decreasing monovariant.' },
        { prompt: 'A process that always decreases a non-negative integer quantity must...', answer: 'terminate', hint: 'A strictly decreasing sequence of non-negative integers is finite.' },
        { prompt: 'Replace (a,b) with (|a-b|, a+b). Track a^2 + b^2.', answer: 'a^2+b^2 is unchanged (invariant, not monovariant)', hint: '(a-b)^2 + (a+b)^2 = 2a^2 + 2b^2... Wait, that doubles. Recheck.' },
        { prompt: 'Ants on a 1m stick walking toward each other. When two meet, they turn around. Track the system.', answer: 'equivalent to ants passing through each other; all fall off within 1 unit of time', hint: 'The position of each ant is the monovariant moving toward an end.' },
      ],
    },
    'conservation-laws': {
      problems: [
        { prompt: 'In a room, each handshake involves 2 people. If there are H handshakes, what is conserved?', answer: 'sum of handshakes per person = 2H (always even)', hint: 'Each handshake adds 1 to two people\'s counts.' },
        { prompt: 'A graph has vertices with degrees d1, d2, ..., dn. What is always true?', answer: 'sum of degrees = 2 × number of edges', hint: 'Each edge contributes 1 to each endpoint\'s degree.' },
        { prompt: 'Prove: in any graph, the number of vertices with odd degree is even.', answer: 'sum of degrees = 2|E| (even). Even sum means even number of odd summands.', hint: 'Use the handshaking lemma.' },
        { prompt: 'Moving coins between piles. Each move: take 1 from pile A and 1 from pile B, add to pile C. Invariant?', answer: 'total coins and parity of each pile', hint: 'Total is conserved: A+B+C = constant. Each pile changes by ±1.' },
        { prompt: 'In a chemical reaction, what quantity is always conserved?', answer: 'mass (conservation of mass) / atoms of each element', hint: 'Atoms are neither created nor destroyed.' },
      ],
    },
    'maximum-minimum': {
      problems: [
        { prompt: 'Find the minimum value of x^2 + y^2 subject to x + y = 10.', answer: '50', hint: 'y = 10-x. Minimize x^2+(10-x)^2 = 2x^2-20x+100. Min at x=5: 50.' },
        { prompt: 'Find the maximum area of a rectangle with perimeter 20.', answer: '25', hint: 'Sides x and 10-x. Area x(10-x). Max at x=5: 25.' },
        { prompt: 'Minimize |x-1| + |x-5| + |x-8|.', answer: '7', hint: 'Minimum at the median point x=5: |5-1|+0+|5-8| = 4+3 = 7.' },
        { prompt: 'Find max of xy given x+y=S, x,y>0.', answer: 'S^2/4', hint: 'AM-GM: xy ≤ ((x+y)/2)^2 = S^2/4.' },
        { prompt: 'Among all triangles with perimeter 12, which has the largest area?', answer: 'equilateral triangle with side 4, area 4sqrt(3)', hint: 'By isoperimetric inequality for triangles, equilateral maximizes area.' },
      ],
    },
    'greedy-algorithms': {
      problems: [
        { prompt: 'Make change for 73¢ using fewest coins (25¢, 10¢, 5¢, 1¢).', answer: '7 coins: 2(25) + 2(10) + 3(1)', hint: 'Take as many large coins as possible: 2 quarters, 2 dimes, 3 pennies.' },
        { prompt: 'Fractional knapsack: items (weight,value): (2,10),(3,14),(4,16). Capacity 7. Maximize value.', answer: '32', hint: 'By value/weight: 5, 4.67, 4. Take all of item 1 (w=2,v=10), all of item 2 (w=3,v=14), 2/4 of item 3 (w=2,v=8). Total: 10+14+8=32.' },
        { prompt: 'Schedule jobs to minimize total waiting time: durations 3, 1, 4, 1, 5.', answer: 'sort ascending: 1,1,3,4,5. Total wait: 0+1+2+5+9=17', hint: 'Shortest Job First minimizes total waiting time.' },
        { prompt: 'Does greedy always give optimal solutions?', answer: 'no, only for certain problem structures (matroids)', hint: 'Greedy works for MST, Huffman coding, but not general knapsack.' },
        { prompt: 'Interval scheduling: pick maximum non-overlapping intervals from (1,3),(2,5),(4,6),(5,8),(7,9).', answer: '3: (1,3),(4,6),(7,9)', hint: 'Greedy: always pick the interval that finishes earliest.' },
      ],
    },
    'boundary-cases': {
      problems: [
        { prompt: 'Find max of f(x)=x(1-x) on [0,1]. Where does the max occur?', answer: '1/4 at x=1/2', hint: 'Check: interior critical point x=1/2 and boundary x=0,1.' },
        { prompt: 'If a continuous function on [a,b] has no interior critical points, where is the max?', answer: 'at x=a or x=b', hint: 'Extreme Value Theorem: max occurs at boundary.' },
        { prompt: 'Maximize x+y subject to x^2+y^2≤1.', answer: 'sqrt(2)', hint: 'Max on boundary: x+y = sqrt(2) when x=y=1/sqrt(2).' },
        { prompt: 'Integer optimization: maximize 3x+5y, x+y≤10, x,y≥0 integers.', answer: '50 at (0,10)', hint: 'Check boundary: y=10 gives 50. Compare interior points.' },
        { prompt: 'Find all solutions: x^2 ≤ x. What are the boundary points?', answer: '0 ≤ x ≤ 1, boundaries at x=0 and x=1', hint: 'x^2 - x ≤ 0, so x(x-1) ≤ 0.' },
      ],
    },
    'optimization-arguments': {
      problems: [
        { prompt: 'Prove: among all rectangles with fixed perimeter, the square has the largest area.', answer: 'AM-GM: area = lw ≤ ((l+w)/2)^2, equality when l=w', hint: 'Use AM-GM on l and w with l+w = P/2.' },
        { prompt: 'Prove: among all rectangles with fixed area, the square has the smallest perimeter.', answer: 'AM-GM: P = 2(l+w) ≥ 2(2sqrt(lw)) = 4sqrt(A)', hint: 'AM ≥ GM: (l+w)/2 ≥ sqrt(lw).' },
        { prompt: 'Place n points on a circle. How do you maximize the sum of pairwise distances?', answer: 'equally spaced (regular polygon vertices)', hint: 'Symmetry argument: the optimal configuration must have the same symmetry as the circle.' },
        { prompt: 'Minimize f(x) = x + 4/x for x > 0.', answer: '4 at x=2', hint: 'AM-GM: x + 4/x ≥ 2sqrt(4) = 4.' },
        { prompt: 'What is the triangle inequality and why is it important in optimization?', answer: 'for any triangle sides a,b,c: a+b>c; constrains feasible region', hint: 'It limits which combinations of side lengths can form triangles.' },
      ],
    },
    'extremal-graphs': {
      problems: [
        { prompt: 'What is the maximum number of edges in a triangle-free graph on n vertices?', answer: 'floor(n^2/4)', hint: 'Turan\'s theorem: the complete bipartite graph K_{n/2,n/2}.' },
        { prompt: 'A graph on 6 vertices has no triangle. Max edges?', answer: '9', hint: 'K_{3,3} has 9 edges and no triangle.' },
        { prompt: 'What is the minimum number of edges to guarantee a graph on n vertices is connected?', answer: 'C(n-1,2) + 1', hint: 'K_{n-1} plus an isolated vertex has C(n-1,2) edges and is disconnected.' },
        { prompt: 'A tournament on n players: everyone plays everyone once. How many games?', answer: 'C(n,2) = n(n-1)/2', hint: 'Each pair plays exactly once.' },
        { prompt: 'Prove: every graph has an even number of odd-degree vertices.', answer: 'sum of degrees = 2|E|; odd count of odd numbers would give odd sum', hint: 'Handshaking lemma: degree sum is even.' },
      ],
    },
  },
};

const LESSON_CONTEXTS = {
  'foundations': [
    { title: 'The Art of Problem Solving', focus: 'Polya\'s four steps', context: 'Every great mathematician started by learning HOW to think, not just WHAT to compute. Polya\'s method gives you a framework.' },
    { title: 'Logic and Proof', focus: 'building rigorous arguments', context: 'A proof is a story that convinces another mathematician. Logic gives you the grammar of that story.' },
    { title: 'Cases and Strategies', focus: 'systematic approaches', context: 'When a problem seems too hard, break it into cases. The key is knowing WHICH cases to consider.' },
  ],
  'intermediate': {
    title: 'Advanced Techniques', focus: 'proof methods and structures', context: 'Contradiction, induction, and counting are the power tools of mathematics. Each one opens doors to thousands of problems.' },
  'competition': [
    { title: 'Competition Mathematics', focus: 'AMC/AIME strategies', context: 'Competition math is about seeing patterns, using clever tricks, and managing your time. It builds mathematical maturity.' },
    { title: 'Invariants and Extremes', focus: 'advanced problem-solving tools', context: 'Some of the most elegant solutions come from finding what DOESN\'T change, or pushing to extremes.' },
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

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 /()^+\-.,'"]/g, ''); }

// Exercise generation

function exResult(type, skill, level, instruction, items) { return { type, skill, level, count: items.length, instruction, items }; }

function generateExercise(level, skill, count = 5) {
  const bank = PROBLEM_BANKS[level]?.[skill];
  if (!bank || !bank.problems) return { error: `No problem bank for ${level}/${skill}` };
  return exResult('solve', skill, level, 'Solve the following problem. Show your reasoning step by step.',
    pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer, hint: p.hint })));
}

// Answer checking

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
}

// Public API

class HSProblemSolving {
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
    const level = p.level || 'foundations';
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
    const level = p.level || 'foundations';
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
    const level = p.level || 'foundations';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Ready for next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    const contexts = Array.isArray(LESSON_CONTEXTS[level]) ? LESSON_CONTEXTS[level] : [LESSON_CONTEXTS[level]];
    const context = contexts.length ? pick(contexts, 1)[0] : null;
    return {
      studentId: id, level, targetSkill: target, exercise, lessonContext: context,
      lessonPlan: {
        review: 'Review prerequisite strategies (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: context ? `Context: ${context.context}` : 'Apply strategies to novel problems',
        reflect: 'Look back: what strategies worked? What would you do differently?',
      },
    };
  }
}

module.exports = HSProblemSolving;

// CLI: node problem-solving.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const ps = new HSProblemSolving();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, level] = args;
        if (!id) throw new Error('Usage: start <id> [level]');
        if (level) ps.setLevel(id, level);
        out({ action: 'start', profile: ps.getProfile(id), nextSkills: ps.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(ps.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, type] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const level = loadProfile(id).level || 'foundations';
        if (type) { out(ps.generateExercise(level, type, 5)); }
        else { const n = ps.getNextSkills(id, 1).next; out(n.length ? ps.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient at current level!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(ps.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, level, cat, skill, sc, tot, ...notes] = args;
        if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total> [notes]');
        out(ps.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(ps.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(ps.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(ps.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? ps.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'students': { out(ps.listStudents()); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(ps.setLevel(id, l)); break; }
      default: out({ usage: 'node problem-solving.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
