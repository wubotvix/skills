// College Math Real Analysis Interactive Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-math-real-analysis');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'real-number-system': ['completeness-axiom', 'supremum-infimum', 'archimedean-property', 'density-of-rationals'],
  'sequences': ['convergence-epsilon-n', 'monotone-convergence', 'bolzano-weierstrass', 'cauchy-criterion', 'limsup-liminf'],
  'series': ['convergence-tests-comparison', 'ratio-root-tests', 'integral-test', 'alternating-series', 'absolute-vs-conditional'],
  'topology-of-r': ['open-closed-sets', 'limit-points-closure', 'compactness-heine-borel', 'connectedness'],
  'continuity': ['epsilon-delta', 'sequential-criterion', 'uniform-continuity', 'intermediate-value-theorem', 'extreme-value-theorem'],
  'differentiation': ['derivative-definition', 'mean-value-theorem', 'rolles-theorem', 'taylors-theorem', 'lhopital'],
  'riemann-integration': ['partitions-darboux-sums', 'integrability-criteria', 'ftc-part-one', 'ftc-part-two'],
  'sequences-of-functions': ['pointwise-convergence', 'uniform-convergence', 'weierstrass-m-test', 'term-by-term-operations'],
  'metric-spaces': ['abstract-metrics', 'completeness-metric', 'compactness-metric', 'contraction-mapping'],
};

const PROBLEM_BANKS = {
  'completeness-axiom': {
    problems: [
      { prompt: 'State the Completeness Axiom (Least Upper Bound Property).', answer: 'Every nonempty subset of R that is bounded above has a least upper bound (supremum) in R', solution: 'This distinguishes R from Q. Q does not have this property (e.g., {x in Q : x^2 < 2} has no sup in Q).' },
      { prompt: 'Why does Q fail the completeness axiom? Give an example.', answer: 'S = {q in Q : q^2 < 2} is bounded above in Q but has no least upper bound in Q', solution: 'sup S = sqrt(2), which is irrational. No rational number is the least upper bound.' },
      { prompt: 'State the Greatest Lower Bound Property and explain why it follows from completeness.', answer: 'Every nonempty set bounded below has an infimum. Proof: consider -S = {-s : s in S}; sup(-S) = -inf(S)', solution: 'Negate the set, apply LUB to get sup(-S), then inf(S) = -sup(-S).' },
    ],
  },
  'supremum-infimum': {
    problems: [
      { prompt: 'Find sup and inf of S = {1/n : n in N}.', answer: 'sup = 1, inf = 0', solution: 'sup S = 1 (attained at n=1). inf S = 0 (not attained, but 1/n > 0 and can be made arbitrarily small).' },
      { prompt: 'Prove: s = sup S iff (i) s is an upper bound and (ii) for all epsilon > 0, there exists x in S with x > s - epsilon.', answer: '(i) ensures upper bound, (ii) ensures no smaller upper bound exists', solution: '(=>) If s = sup and t < s, set ε = s-t. Some x ∈ S has x > s-ε = t. (<=) s is an UB. If t < s is also UB, ε = s-t gives x > t, contradiction.' },
      { prompt: 'Find sup{(-1)^n (1 - 1/n) : n >= 1}.', answer: '1', solution: 'For even n: (1-1/n) approaches 1. For odd n: -(1-1/n) approaches -1. Sup = 1 (limit of even terms).' },
      { prompt: 'If sup A = a and sup B = b, what is sup(A + B)?', answer: 'a + b', solution: 'A+B = {x+y : x in A, y in B}. sup(A+B) = sup A + sup B = a+b.' },
    ],
  },
  'archimedean-property': {
    problems: [
      { prompt: 'State the Archimedean Property of R.', answer: 'For any x in R, there exists n in N with n > x', solution: 'Equivalently: N is unbounded in R. Or: for any epsilon > 0, there exists n with 1/n < epsilon.' },
      { prompt: 'Prove the Archimedean Property using the Completeness Axiom.', answer: 'If N were bounded, sup N = s exists. Then s-1 is not UB, so n > s-1 for some n, giving n+1 > s, contradiction', solution: 'Assume N bounded above. By completeness, s = sup N exists. s-1 < s so not UB: some n > s-1. But n+1 ∈ N and n+1 > s. Contradiction.' },
    ],
  },
  'density-of-rationals': {
    problems: [
      { prompt: 'State the Density of Q in R.', answer: 'Between any two real numbers there exists a rational number', solution: 'For a < b, there exists q ∈ Q with a < q < b. Also true for irrationals.' },
      { prompt: 'Outline the proof that Q is dense in R.', answer: 'Use Archimedean property: find n with 1/n < b-a, then find m with m/n between a and b', solution: 'Choose n with 1/n < b-a. Let m = floor(na)+1. Then m/n > a and m/n = (floor(na)+1)/n ≤ na/n + 1/n = a + 1/n < a + (b-a) = b.' },
    ],
  },
  'convergence-epsilon-n': {
    problems: [
      { prompt: 'State the epsilon-N definition: lim a_n = L.', answer: 'For every epsilon > 0, there exists N in N such that for all n >= N, |a_n - L| < epsilon', solution: 'The terms a_n get and stay within any epsilon-neighborhood of L after some index N.' },
      { prompt: 'Prove lim 1/n = 0 using the epsilon-N definition.', answer: 'Given epsilon > 0, choose N > 1/epsilon (Archimedean). Then n >= N implies 1/n <= 1/N < epsilon', solution: 'Let ε > 0. By Archimedean property, choose N ∈ N with N > 1/ε. For n ≥ N: |1/n - 0| = 1/n ≤ 1/N < ε.' },
      { prompt: 'Prove lim (3n+1)/(n+2) = 3 using epsilon-N.', answer: '|(3n+1)/(n+2) - 3| = |(-5)/(n+2)| = 5/(n+2). Choose N > 5/epsilon - 2', solution: '|(3n+1)/(n+2) - 3| = |(3n+1-3n-6)/(n+2)| = 5/(n+2). Given ε, choose N so 5/(N+2) < ε, i.e., N > 5/ε - 2.' },
      { prompt: 'Prove that limits are unique.', answer: 'If a_n -> L and a_n -> M, then |L-M| <= |L-a_n| + |a_n-M| < 2epsilon for large n, so L = M', solution: 'Triangle inequality: |L-M| ≤ |L-a_n|+|a_n-M| < ε/2 + ε/2 = ε for n large enough. Since ε arbitrary, L=M.' },
    ],
  },
  'monotone-convergence': {
    problems: [
      { prompt: 'State the Monotone Convergence Theorem.', answer: 'A bounded monotone sequence converges', solution: 'If (a_n) is increasing and bounded above, it converges to sup{a_n}. Decreasing and bounded below → inf.' },
      { prompt: 'Prove a_1 = 1, a_{n+1} = (a_n + 3)/2 converges and find the limit.', answer: 'Limit = 3. Sequence is increasing and bounded above by 3', solution: 'If a_n < 3, then a_{n+1} = (a_n+3)/2 < (3+3)/2 = 3 and a_{n+1} - a_n = (3-a_n)/2 > 0. Bounded, increasing → converges. Limit L: L = (L+3)/2 → L = 3.' },
    ],
  },
  'bolzano-weierstrass': {
    problems: [
      { prompt: 'State the Bolzano-Weierstrass Theorem.', answer: 'Every bounded sequence in R has a convergent subsequence', solution: 'Bounded sequence → exists convergent subsequence. Equivalent to completeness of R.' },
      { prompt: 'Give a bounded sequence with no limit but a convergent subsequence.', answer: 'a_n = (-1)^n. Subsequences a_{2n} = 1 -> 1 and a_{2n+1} = -1 -> -1', solution: '(-1)^n diverges but is bounded. Subsequences converge to 1 and -1.' },
    ],
  },
  'cauchy-criterion': {
    problems: [
      { prompt: 'Define Cauchy sequence.', answer: 'For every epsilon > 0, there exists N such that for all m,n >= N, |a_m - a_n| < epsilon', solution: 'Terms get arbitrarily close to each other (not to a specific limit).' },
      { prompt: 'Prove: In R, a sequence converges iff it is Cauchy.', answer: 'Convergent => Cauchy by triangle inequality. Cauchy => bounded => BW gives convergent subsequence => full sequence converges', solution: '(=>) |a_m-a_n| ≤ |a_m-L|+|L-a_n| < 2ε. (<=) Cauchy → bounded → BW → subsequence a_{n_k}→L → |a_n-L| ≤ |a_n-a_{n_k}|+|a_{n_k}-L| < 2ε.' },
    ],
  },
  'limsup-liminf': {
    problems: [
      { prompt: 'Define limsup of a sequence (a_n).', answer: 'limsup a_n = lim_{n->inf} sup{a_k : k >= n} = inf_n sup_{k>=n} a_k', solution: 'Largest subsequential limit. Also: the infimum of the tail suprema.' },
      { prompt: 'Find limsup and liminf of a_n = (-1)^n + 1/n.', answer: 'limsup = 1, liminf = -1', solution: 'Even terms: 1+1/n → 1. Odd terms: -1+1/n → -1. limsup=1, liminf=-1.' },
      { prompt: 'When does lim a_n exist in terms of limsup and liminf?', answer: 'lim a_n exists iff limsup a_n = liminf a_n, and then lim = limsup = liminf', solution: 'The sequence converges precisely when the limsup and liminf agree.' },
    ],
  },
  'convergence-tests-comparison': {
    problems: [
      { prompt: 'State the Comparison Test for series.', answer: 'If 0 <= a_n <= b_n and sum b_n converges, then sum a_n converges. If sum a_n diverges, sum b_n diverges', solution: 'Compare with a known series. Bounded partial sums of non-negative series converge.' },
      { prompt: 'Does sum 1/(n^2 + 1) converge?', answer: 'Yes, by comparison with sum 1/n^2', solution: '1/(n^2+1) < 1/n^2 and Σ1/n^2 converges (p-series, p=2>1). By comparison, converges.' },
      { prompt: 'State the Limit Comparison Test.', answer: 'If lim a_n/b_n = L with 0 < L < infinity, then sum a_n and sum b_n both converge or both diverge', solution: 'If the ratio approaches a positive finite limit, the series have the same convergence behavior.' },
    ],
  },
  'ratio-root-tests': {
    problems: [
      { prompt: 'State the Ratio Test.', answer: 'If lim |a_{n+1}/a_n| = L, then: L < 1 converges absolutely, L > 1 diverges, L = 1 inconclusive', solution: 'Compare with geometric series. Useful when factorials or exponentials are present.' },
      { prompt: 'Does sum n!/n^n converge? Use the Ratio Test.', answer: 'Yes. Ratio = (n/(n+1))^n -> 1/e < 1', solution: 'a_{n+1}/a_n = (n+1)!/(n+1)^{n+1} × n^n/n! = (n/(n+1))^n → 1/e < 1. Converges.' },
      { prompt: 'State the Root Test.', answer: 'If lim |a_n|^{1/n} = L, then: L < 1 converges absolutely, L > 1 diverges, L = 1 inconclusive', solution: 'Similar to ratio test but uses nth root. Sometimes more powerful.' },
    ],
  },
  'integral-test': {
    problems: [
      { prompt: 'State the Integral Test.', answer: 'If f is positive, decreasing on [1,inf) and a_n = f(n), then sum a_n and integral f converge or diverge together', solution: 'Compare partial sums with integral by bounding rectangles above and below the curve.' },
      { prompt: 'Use the Integral Test to determine convergence of sum 1/n^p.', answer: 'Converges if p > 1, diverges if p <= 1', solution: '∫1^∞ x^{-p}dx converges iff p>1. Same for the series.' },
    ],
  },
  'alternating-series': {
    problems: [
      { prompt: 'State the Alternating Series Test (Leibniz).', answer: 'If b_n is decreasing and lim b_n = 0, then sum (-1)^n b_n converges', solution: 'Alternating series with decreasing terms tending to 0 converges. Error bounded by first omitted term.' },
      { prompt: 'Does sum (-1)^n / sqrt(n) converge?', answer: 'Yes, by alternating series test (1/sqrt(n) decreasing to 0)', solution: 'b_n = 1/√n is decreasing and → 0. AST applies. (Note: not absolutely convergent since Σ1/√n diverges.)' },
    ],
  },
  'absolute-vs-conditional': {
    problems: [
      { prompt: 'Define absolute convergence and conditional convergence.', answer: 'Absolute: sum |a_n| converges. Conditional: sum a_n converges but sum |a_n| diverges', solution: 'Absolute convergence implies convergence. The converse is false (conditional convergence).' },
      { prompt: 'Is sum (-1)^n/n absolutely or conditionally convergent?', answer: 'Conditionally convergent', solution: 'Σ(-1)^n/n converges (AST). Σ1/n diverges (harmonic). So conditionally convergent.' },
      { prompt: "State the Riemann Rearrangement Theorem.", answer: 'A conditionally convergent series can be rearranged to converge to any real number, or to diverge', solution: 'Only absolutely convergent series are invariant under rearrangement.' },
    ],
  },
  'open-closed-sets': {
    problems: [
      { prompt: 'Define open set in R.', answer: 'S is open if for every x in S, there exists epsilon > 0 with (x-epsilon, x+epsilon) subset of S', solution: 'Every point is an interior point — has a neighborhood entirely contained in S.' },
      { prompt: 'Define closed set in R.', answer: 'S is closed if its complement R \\ S is open. Equivalently, S contains all its limit points', solution: 'Closed sets contain their boundary. Equivalently, every convergent sequence in S has its limit in S.' },
      { prompt: 'Is [0,1) open, closed, both, or neither?', answer: 'Neither open nor closed', solution: 'Not open: 0 has no neighborhood in [0,1). Not closed: 1 is a limit point not in the set.' },
      { prompt: 'Prove: arbitrary union of open sets is open. Arbitrary intersection of closed sets is closed.', answer: 'If x in union, x in some O_i, has nbhd in O_i, hence in union. Closed follows by complements', solution: 'Union of open: x ∈ ∪O_α means x ∈ O_α for some α. Since O_α open, ε-ball around x ⊆ O_α ⊆ ∪O_α.' },
    ],
  },
  'limit-points-closure': {
    problems: [
      { prompt: 'Define limit point of a set S.', answer: 'x is a limit point of S if every neighborhood of x contains a point of S different from x', solution: 'Equivalently: there exists a sequence in S \\ {x} converging to x.' },
      { prompt: 'Find all limit points of (0,1).', answer: '[0,1]', solution: 'Every point in [0,1] is a limit of sequences in (0,1). No point outside [0,1] is.' },
    ],
  },
  'compactness-heine-borel': {
    problems: [
      { prompt: 'State the Heine-Borel Theorem.', answer: 'A subset of R is compact iff it is closed and bounded', solution: 'Compact = every open cover has a finite subcover. In R^n: equivalent to closed and bounded.' },
      { prompt: 'Give an example of a closed but not compact set.', answer: '[0, infinity) — closed but unbounded', solution: '[0,∞) is closed (complement (-∞,0) is open) but unbounded, hence not compact.' },
      { prompt: 'Prove [0,1] is compact using sequences.', answer: 'Every sequence in [0,1] is bounded, so BW gives convergent subsequence. Limit is in [0,1] since [0,1] is closed', solution: 'Sequential compactness: bounded → BW → convergent subsequence. Closed → limit in set.' },
    ],
  },
  'connectedness': {
    problems: [
      { prompt: 'Define connected set in R.', answer: 'S is connected if it cannot be written as a union of two nonempty disjoint open sets (relative to S)', solution: 'In R, connected sets are exactly the intervals (including rays and R itself).' },
      { prompt: 'Are the connected subsets of R exactly the intervals?', answer: 'Yes', solution: 'A subset of R is connected iff it is an interval. Proof uses the least upper bound property.' },
    ],
  },
  'epsilon-delta': {
    problems: [
      { prompt: 'State the epsilon-delta definition of continuity at a point c.', answer: 'For every epsilon > 0, there exists delta > 0 such that |x - c| < delta implies |f(x) - f(c)| < epsilon', solution: 'Small changes in input produce small changes in output.' },
      { prompt: 'Prove f(x) = 3x + 1 is continuous at every point using epsilon-delta.', answer: '|f(x) - f(c)| = |3x+1-3c-1| = 3|x-c|. Choose delta = epsilon/3', solution: 'Given ε>0, let δ=ε/3. If |x-c|<δ, then |f(x)-f(c)| = 3|x-c| < 3δ = ε.' },
      { prompt: 'Prove f(x) = x^2 is continuous at c using epsilon-delta.', answer: '|x^2 - c^2| = |x-c||x+c|. Restrict delta <= 1, then |x+c| <= 2|c|+1. Choose delta = min(1, epsilon/(2|c|+1))', solution: 'Restrict δ ≤ 1: |x| ≤ |c|+1, so |x+c| ≤ 2|c|+1. Then |x^2-c^2| ≤ (2|c|+1)δ < ε when δ < ε/(2|c|+1).' },
    ],
  },
  'sequential-criterion': {
    problems: [
      { prompt: 'State the Sequential Criterion for continuity.', answer: 'f is continuous at c iff for every sequence x_n -> c, we have f(x_n) -> f(c)', solution: 'Equivalent to epsilon-delta. Useful for proving discontinuity (find a bad sequence).' },
      { prompt: 'Prove f(x) = 1 if x rational, 0 if irrational (Dirichlet function) is nowhere continuous.', answer: 'At any c, take rationals x_n -> c and irrationals y_n -> c. f(x_n) = 1 != 0 = f(y_n) or vice versa', solution: 'For any c, sequences of rationals and irrationals converge to c but f gives different limits. Sequential criterion fails.' },
    ],
  },
  'uniform-continuity': {
    problems: [
      { prompt: 'How does uniform continuity differ from (pointwise) continuity?', answer: 'In uniform continuity, delta depends only on epsilon, not on the point c', solution: 'Continuity: ∀c ∀ε ∃δ(c,ε). Uniform: ∀ε ∃δ(ε) ∀c. Same δ works everywhere.' },
      { prompt: 'Is f(x) = x^2 uniformly continuous on [0,1]? On R?', answer: 'Yes on [0,1] (compact set), No on R', solution: 'Continuous on compact [0,1] → uniformly continuous (theorem). On R: |x^2-y^2| = |x-y||x+y| can be large even for small |x-y| when x is large.' },
      { prompt: 'State the theorem relating compactness and uniform continuity.', answer: 'A continuous function on a compact set is uniformly continuous', solution: 'Heine-Cantor theorem: compact domain + continuous = uniformly continuous.' },
    ],
  },
  'intermediate-value-theorem': {
    problems: [
      { prompt: 'State the Intermediate Value Theorem.', answer: 'If f is continuous on [a,b] and k is between f(a) and f(b), then there exists c in (a,b) with f(c) = k', solution: 'Continuous functions on intervals achieve all intermediate values. Requires completeness of R.' },
      { prompt: 'Use IVT to prove x^3 - x - 1 = 0 has a solution in (1,2).', answer: 'f(1) = -1 < 0, f(2) = 5 > 0. By IVT, f(c) = 0 for some c in (1,2)', solution: 'f continuous, f(1) < 0 < f(2). IVT gives c ∈ (1,2) with f(c) = 0.' },
    ],
  },
  'extreme-value-theorem': {
    problems: [
      { prompt: 'State the Extreme Value Theorem.', answer: 'A continuous function on a compact (closed and bounded) set attains its maximum and minimum', solution: 'f continuous on [a,b] → there exist c,d ∈ [a,b] with f(c) ≤ f(x) ≤ f(d) for all x.' },
      { prompt: 'Why does f(x) = 1/x on (0,1) not attain a maximum?', answer: '(0,1) is not compact (not closed). f is unbounded as x -> 0+', solution: 'Domain (0,1) is not compact (missing endpoints). EVT does not apply. sup f = ∞.' },
    ],
  },
  'derivative-definition': {
    problems: [
      { prompt: 'Define f\'(c) using the limit definition.', answer: "f'(c) = lim_{h->0} (f(c+h) - f(c))/h", solution: 'The derivative is the limit of the difference quotient: rate of change at a point.' },
      { prompt: 'Prove: if f is differentiable at c, then f is continuous at c.', answer: 'f(x)-f(c) = [(f(x)-f(c))/(x-c)] * (x-c) -> f\'(c) * 0 = 0 as x -> c', solution: 'lim_{x→c} [f(x)-f(c)] = lim [(f(x)-f(c))/(x-c)] · (x-c) = f\'(c) · 0 = 0. So f(x) → f(c).' },
    ],
  },
  'mean-value-theorem': {
    problems: [
      { prompt: 'State the Mean Value Theorem.', answer: 'If f is continuous on [a,b] and differentiable on (a,b), then there exists c in (a,b) with f\'(c) = (f(b)-f(a))/(b-a)', solution: 'Some interior point has instantaneous rate equal to the average rate over [a,b].' },
      { prompt: 'Use MVT to prove: if f\'(x) = 0 on (a,b), then f is constant on [a,b].', answer: 'For any x,y in [a,b]: f(y)-f(x) = f\'(c)(y-x) = 0, so f(y) = f(x)', solution: 'By MVT, f(y)-f(x) = f\'(c)(y-x) for some c between x and y. f\'(c)=0 so f(y)=f(x).' },
      { prompt: 'Use MVT to prove: if f\'(x) > 0 on (a,b), then f is strictly increasing.', answer: 'For x < y: f(y)-f(x) = f\'(c)(y-x) > 0 since f\'(c)>0 and y-x>0', solution: 'f(y)-f(x) = f\'(c)(y-x) with c ∈ (x,y). Both factors positive, so f(y) > f(x).' },
    ],
  },
  'rolles-theorem': {
    problems: [
      { prompt: "State Rolle's Theorem.", answer: 'If f is continuous on [a,b], differentiable on (a,b), and f(a) = f(b), then there exists c in (a,b) with f\'(c) = 0', solution: 'Special case of MVT when f(a)=f(b). The function has a horizontal tangent somewhere inside.' },
    ],
  },
  'taylors-theorem': {
    problems: [
      { prompt: "State Taylor's Theorem with remainder.", answer: 'f(x) = sum_{k=0}^{n} f^{(k)}(c)(x-c)^k/k! + f^{(n+1)}(xi)(x-c)^{n+1}/(n+1)! for some xi between c and x', solution: "Lagrange form of the remainder: R_n(x) = f^{(n+1)}(ξ)(x-c)^{n+1}/(n+1)!." },
      { prompt: 'How do you show e^x = sum x^n/n! for all x?', answer: 'Show the Taylor remainder R_n(x) -> 0 as n -> infinity for all x', solution: '|R_n(x)| ≤ e^|x| |x|^{n+1}/(n+1)! → 0 since factorials grow faster than exponentials.' },
    ],
  },
  'lhopital': {
    problems: [
      { prompt: "State L'Hopital's Rule.", answer: "If lim f/g is 0/0 or inf/inf and lim f'/g' = L, then lim f/g = L", solution: "L'Hopital: indeterminate forms 0/0 or ∞/∞ can be resolved by differentiating numerator and denominator." },
      { prompt: 'Find lim_{x->0} sin(x)/x using L\'Hopital.', answer: 'cos(0)/1 = 1', solution: "0/0 form. L'Hopital: lim cos(x)/1 = 1." },
    ],
  },
  'partitions-darboux-sums': {
    problems: [
      { prompt: 'Define upper and lower Darboux sums.', answer: 'U(f,P) = sum M_i * Delta_x_i, L(f,P) = sum m_i * Delta_x_i where M_i = sup f on [x_{i-1},x_i], m_i = inf', solution: 'Upper sum: supremum on each subinterval times width. Lower sum: infimum times width.' },
      { prompt: 'When is f Riemann integrable on [a,b]?', answer: 'When sup L(f,P) = inf U(f,P) over all partitions P (upper and lower integrals agree)', solution: 'Equivalently: for every ε > 0, there exists P with U(f,P) - L(f,P) < ε.' },
    ],
  },
  'integrability-criteria': {
    problems: [
      { prompt: 'Prove every continuous function on [a,b] is Riemann integrable.', answer: 'Continuous on compact => uniformly continuous. Given epsilon, choose delta, make partition fine enough that U-L < epsilon', solution: 'Uniform continuity: |f(x)-f(y)| < ε/(b-a) when |x-y| < δ. Partition with mesh < δ: U-L < ε.' },
      { prompt: 'Is the Dirichlet function (1 on Q, 0 on irrationals) Riemann integrable on [0,1]?', answer: 'No', solution: 'Every subinterval contains both rationals and irrationals. U(f,P)=1, L(f,P)=0 for all P. Not integrable.' },
    ],
  },
  'ftc-part-one': {
    problems: [
      { prompt: 'State FTC Part I.', answer: 'If f is continuous on [a,b] and F(x) = integral from a to x of f(t)dt, then F\'(x) = f(x)', solution: 'The integral as a function of its upper limit has derivative equal to the integrand.' },
    ],
  },
  'ftc-part-two': {
    problems: [
      { prompt: 'State FTC Part II.', answer: 'If F is an antiderivative of f on [a,b] and f is integrable, then integral from a to b of f = F(b) - F(a)', solution: 'Evaluation theorem: compute definite integrals using antiderivatives.' },
    ],
  },
  'pointwise-convergence': {
    problems: [
      { prompt: 'Define pointwise convergence of f_n to f.', answer: 'For each x, lim_{n->inf} f_n(x) = f(x)', solution: 'At each individual point, the sequence of function values converges. The rate may vary with x.' },
      { prompt: 'Let f_n(x) = x^n on [0,1]. Find the pointwise limit.', answer: 'f(x) = 0 for x in [0,1) and f(1) = 1', solution: 'x^n → 0 for |x|<1 and 1^n=1. The limit is discontinuous even though each f_n is continuous.' },
    ],
  },
  'uniform-convergence': {
    problems: [
      { prompt: 'Define uniform convergence of f_n to f on S.', answer: 'For every epsilon > 0, there exists N such that for all n >= N and all x in S, |f_n(x) - f(x)| < epsilon', solution: 'N depends only on ε, not on x. The convergence rate is uniform across all points.' },
      { prompt: 'Does f_n(x) = x^n converge uniformly on [0,1]?', answer: 'No', solution: 'Pointwise limit is discontinuous at x=1, but each f_n is continuous. Uniform limit of continuous functions is continuous, so convergence is not uniform.' },
      { prompt: 'Prove: the uniform limit of continuous functions is continuous.', answer: 'Use triangle: |f(x)-f(c)| <= |f(x)-f_n(x)| + |f_n(x)-f_n(c)| + |f_n(c)-f(c)| < 3epsilon', solution: 'Fix ε. Choose n so ||f_n-f||<ε/3 (uniform). Then δ from continuity of f_n. Triangle inequality: |f(x)-f(c)| < ε.' },
    ],
  },
  'weierstrass-m-test': {
    problems: [
      { prompt: 'State the Weierstrass M-test.', answer: 'If |f_n(x)| <= M_n for all x in S and sum M_n converges, then sum f_n converges uniformly on S', solution: 'Bound each term by a constant; if constants form a convergent series, uniform convergence follows.' },
      { prompt: 'Does sum x^n/n^2 converge uniformly on [-1,1]?', answer: 'Yes, by Weierstrass M-test with M_n = 1/n^2', solution: '|x^n/n^2| ≤ 1/n^2 on [-1,1]. Σ1/n^2 converges. By M-test, uniform convergence.' },
    ],
  },
  'term-by-term-operations': {
    problems: [
      { prompt: 'When can you integrate a series term by term?', answer: 'When the series converges uniformly on [a,b]', solution: 'If Σf_n converges uniformly to f on [a,b], then ∫f = Σ∫f_n. Uniform convergence justifies interchange.' },
      { prompt: 'When can you differentiate a power series term by term?', answer: 'Inside the radius of convergence', solution: 'Power series can be differentiated term by term within the open interval of convergence.' },
    ],
  },
  'abstract-metrics': {
    problems: [
      { prompt: 'State the three axioms for a metric d on a set X.', answer: '1) d(x,y) >= 0 with equality iff x=y. 2) d(x,y) = d(y,x). 3) d(x,z) <= d(x,y) + d(y,z)', solution: 'Positive definiteness, symmetry, triangle inequality.' },
      { prompt: 'Verify that d(x,y) = |x-y| is a metric on R.', answer: 'Non-negative and = 0 iff x=y. Symmetric. Triangle inequality from |x-z| <= |x-y|+|y-z|', solution: 'Standard metric. All three axioms are properties of absolute value.' },
    ],
  },
  'completeness-metric': {
    problems: [
      { prompt: 'What does it mean for a metric space to be complete?', answer: 'Every Cauchy sequence converges (to a point in the space)', solution: 'R with the standard metric is complete. Q is not complete (Cauchy sequence can converge to irrational).' },
      { prompt: 'Is Q a complete metric space?', answer: 'No', solution: 'The sequence 1, 1.4, 1.41, 1.414, ... is Cauchy in Q but converges to √2 ∉ Q.' },
    ],
  },
  'compactness-metric': {
    problems: [
      { prompt: 'In a general metric space, what is the relationship between compactness and sequential compactness?', answer: 'In metric spaces, they are equivalent', solution: 'A metric space is compact iff it is sequentially compact iff it is complete and totally bounded.' },
    ],
  },
  'contraction-mapping': {
    problems: [
      { prompt: 'State the Banach Fixed-Point (Contraction Mapping) Theorem.', answer: 'A contraction on a complete metric space has a unique fixed point', solution: 'If d(f(x),f(y)) ≤ c·d(x,y) with 0<c<1 on a complete metric space, then f has a unique fixed point. Iteration x_{n+1}=f(x_n) converges to it.' },
      { prompt: 'Give an application of the Contraction Mapping Theorem.', answer: 'Proving existence and uniqueness for ODEs (Picard-Lindelof theorem)', solution: 'Picard iteration defines a contraction on a space of continuous functions. Fixed point = solution to the ODE.' },
    ],
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
  return { studentId: id, createdAt: new Date().toISOString(), assessments: [], skills: {} };
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

function generateExercise(skill, count = 5) {
  const bank = PROBLEM_BANKS[skill];
  if (!bank || !bank.problems) return { error: `No problem bank for ${skill}` };
  const items = pick(bank.problems, count);
  return { type: 'real-analysis', skill, count: items.length, instruction: 'Solve each problem. Provide rigorous proofs where requested.', items };
}

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
}

// Public API

class RealAnalysis {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, createdAt: p.createdAt, totalAssessments: p.assessments.length };
  }

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
    const p = loadProfile(id);
    const results = {};
    let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(SKILLS)) {
      results[cat] = {};
      for (const sk of skills) {
        total++;
        const d = p.skills[`${cat}/${sk}`];
        results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
      }
    }
    return { studentId: id, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id);
    const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS)) {
      for (const sk of skills) {
        const d = p.skills[`${cat}/${sk}`];
        const m = d ? d.mastery : 0;
        if (m < MASTERY_THRESHOLD) candidates.push({ category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' });
      }
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, next: candidates.slice(0, count) };
  }

  getReport(id) {
    const p = loadProfile(id);
    return { studentId: id, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }

  getSkillCatalog() {
    let total = 0;
    const catalog = {};
    for (const [cat, skills] of Object.entries(SKILLS)) { total += skills.length; catalog[cat] = [...skills]; }
    return { skills: catalog, totalSkills: total };
  }

  generateExercise(skill, count = 5) { return generateExercise(skill, count); }

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  generateLesson(id) {
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: 'All skills are proficient!' };
    const exercise = generateExercise(target.skill, 5);
    return {
      studentId: id, targetSkill: target, exercise,
      lessonPlan: {
        review: 'Review prerequisite definitions and theorems (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} -> ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice problems`,
        apply: 'Write a clean epsilon-delta or epsilon-N proof for a new example',
      },
    };
  }
}

module.exports = RealAnalysis;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new RealAnalysis();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id] = args;
        if (!id) throw new Error('Usage: start <id>');
        out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        if (skill) { out(api.generateExercise(skill, 5)); }
        else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(api.checkAnswer(type, expected, answer));
        break;
      }
      case 'record': {
        const [, id, cat, skill, sc, tot, ...notes] = args;
        if (!id || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <cat> <skill> <score> <total>');
        out(api.recordAssessment(id, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { out(api.getSkillCatalog()); break; }
      case 'students': { out(api.listStudents()); break; }
      default: out({ usage: 'node real-analysis.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students'] });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
