// College Math Probability & Statistics Interactive Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-math-probability-statistics');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'probability-foundations': ['sample-spaces', 'axioms-of-probability', 'conditional-probability', 'bayes-theorem', 'independence'],
  'random-variables': ['pmf-pdf-cdf', 'expectation', 'variance', 'moment-generating-functions', 'transformations'],
  'discrete-distributions': ['bernoulli-binomial', 'geometric-negative-binomial', 'poisson', 'hypergeometric'],
  'continuous-distributions': ['uniform', 'normal', 'exponential-gamma', 'beta', 'chi-squared-t-f'],
  'joint-distributions': ['marginals', 'conditional-distributions', 'covariance-correlation', 'independence-joint'],
  'limit-theorems': ['law-of-large-numbers', 'central-limit-theorem', 'normal-approximation'],
  'estimation': ['point-estimation', 'mle', 'method-of-moments', 'confidence-intervals', 'sufficiency'],
  'hypothesis-testing': ['neyman-pearson', 'z-t-tests', 'chi-squared-tests', 'f-tests', 'p-values-power'],
  'regression': ['simple-linear-regression', 'multiple-regression', 'anova', 'residual-analysis', 'model-selection'],
  'bayesian-statistics': ['prior-posterior', 'conjugate-families', 'credible-intervals', 'map-estimation'],
};

const PROBLEM_BANKS = {
  'sample-spaces': {
    problems: [
      { prompt: 'Define a sample space. Give the sample space for rolling two dice.', answer: 'Set of all possible outcomes. S = {(i,j) : i,j in {1,...,6}}, |S| = 36', solution: 'Sample space is the set of all possible outcomes. For two dice: all ordered pairs (i,j), 6x6 = 36 outcomes.' },
      { prompt: 'What is the sample space for flipping a coin 3 times?', answer: '{HHH, HHT, HTH, HTT, THH, THT, TTH, TTT}, |S| = 8', solution: '2^3 = 8 outcomes, all sequences of H and T of length 3.' },
      { prompt: 'A card is drawn from a standard deck. What is P(King)?', answer: '4/52 = 1/13', solution: '4 kings out of 52 cards. P(King) = 4/52 = 1/13.' },
      { prompt: 'What is P(A ∪ B) if P(A) = 0.3, P(B) = 0.5, P(A ∩ B) = 0.1?', answer: '0.7', solution: 'P(A ∪ B) = P(A) + P(B) - P(A ∩ B) = 0.3 + 0.5 - 0.1 = 0.7.' },
    ],
  },
  'axioms-of-probability': {
    problems: [
      { prompt: 'State the three Kolmogorov axioms of probability.', answer: '1) P(A) >= 0, 2) P(S) = 1, 3) P(union of disjoint A_i) = sum P(A_i)', solution: 'Non-negativity, normalization, countable additivity for mutually exclusive events.' },
      { prompt: 'Prove P(A^c) = 1 - P(A) from the axioms.', answer: 'A and A^c partition S, so P(A) + P(A^c) = P(S) = 1', solution: 'A ∪ A^c = S and A ∩ A^c = ∅. By additivity: P(A) + P(A^c) = P(S) = 1. So P(A^c) = 1 - P(A).' },
      { prompt: 'Prove P(∅) = 0 from the axioms.', answer: '∅ = S^c, so P(∅) = 1 - P(S) = 1 - 1 = 0', solution: 'Or: S = S ∪ ∅ ∪ ∅ ∪ ..., so P(S) = P(S) + P(∅) + P(∅) + ..., giving P(∅) = 0.' },
    ],
  },
  'conditional-probability': {
    problems: [
      { prompt: 'Define P(A|B).', answer: 'P(A|B) = P(A ∩ B) / P(B), provided P(B) > 0', solution: 'The probability of A given B occurred, computed as the ratio of joint to marginal probability.' },
      { prompt: 'If P(A) = 0.4, P(B) = 0.5, P(A ∩ B) = 0.2, find P(A|B).', answer: '0.4', solution: 'P(A|B) = P(A ∩ B)/P(B) = 0.2/0.5 = 0.4.' },
      { prompt: 'State the Law of Total Probability.', answer: 'P(A) = sum P(A|B_i)P(B_i) where B_i partition the sample space', solution: 'If B_1,...,B_n partition S, then P(A) = Σ P(A|B_i)P(B_i).' },
    ],
  },
  'bayes-theorem': {
    problems: [
      { prompt: "State Bayes' Theorem.", answer: 'P(B|A) = P(A|B)P(B) / P(A)', solution: "Bayes: P(B_i|A) = P(A|B_i)P(B_i) / Σ_j P(A|B_j)P(B_j)." },
      { prompt: 'A test is 95% sensitive and 90% specific. Disease prevalence is 1%. If positive, what is P(disease)?', answer: 'Approximately 0.088 (8.8%)', solution: 'P(D|+) = P(+|D)P(D) / [P(+|D)P(D) + P(+|D^c)P(D^c)] = (0.95)(0.01) / [(0.95)(0.01) + (0.10)(0.99)] = 0.0095/0.1085 ≈ 0.088.' },
      { prompt: 'A factory has 3 machines: M1(50%), M2(30%), M3(20%) of production. Defect rates: 2%, 3%, 5%. A defective item is found. P(from M1)?', answer: '10/29 ≈ 0.345', solution: 'P(M1|D) = (0.02)(0.50)/[(0.02)(0.50)+(0.03)(0.30)+(0.05)(0.20)] = 0.01/0.029 = 10/29 ≈ 0.345.' },
    ],
  },
  'independence': {
    problems: [
      { prompt: 'Define independence of events A and B.', answer: 'P(A ∩ B) = P(A)P(B)', solution: 'Equivalently, P(A|B) = P(A). The occurrence of B does not affect the probability of A.' },
      { prompt: 'If A and B are independent, are A and B^c independent?', answer: 'Yes', solution: 'P(A ∩ B^c) = P(A) - P(A ∩ B) = P(A) - P(A)P(B) = P(A)(1-P(B)) = P(A)P(B^c).' },
      { prompt: 'Are disjoint events (with positive probability) independent?', answer: 'No', solution: 'If A ∩ B = ∅, then P(A ∩ B) = 0 ≠ P(A)P(B) when both have positive probability.' },
    ],
  },
  'pmf-pdf-cdf': {
    problems: [
      { prompt: 'What is the relationship between PDF and CDF for continuous random variables?', answer: 'F(x) = integral from -inf to x of f(t)dt, and f(x) = F\'(x)', solution: 'CDF is the integral of PDF; PDF is the derivative of CDF.' },
      { prompt: 'For discrete X with PMF p(x), what conditions must p satisfy?', answer: 'p(x) >= 0 for all x, and sum of p(x) = 1', solution: 'Non-negative and sums to 1 over all possible values.' },
      { prompt: 'If F(x) = 1 - e^{-2x} for x >= 0, find the PDF.', answer: 'f(x) = 2e^{-2x} for x >= 0', solution: 'f(x) = F\'(x) = 2e^{-2x}. This is Exp(lambda=2).' },
    ],
  },
  'expectation': {
    problems: [
      { prompt: 'E[aX + b] = ?', answer: 'aE[X] + b', solution: 'Linearity of expectation: E[aX+b] = aE[X] + b.' },
      { prompt: 'If X ~ Bernoulli(p), what is E[X]?', answer: 'p', solution: 'E[X] = 0(1-p) + 1(p) = p.' },
      { prompt: 'State the Law of the Unconscious Statistician (LOTUS).', answer: 'E[g(X)] = sum g(x)p(x) for discrete or integral g(x)f(x)dx for continuous', solution: 'LOTUS: compute E[g(X)] directly from the distribution of X without finding the distribution of g(X).' },
      { prompt: 'Prove E[X+Y] = E[X] + E[Y] (state the key idea).', answer: 'Linearity holds even when X and Y are dependent', solution: 'E[X+Y] = ΣΣ(x+y)p(x,y) = Σx·p_X(x) + Σy·p_Y(y) = E[X]+E[Y]. No independence needed.' },
    ],
  },
  'variance': {
    problems: [
      { prompt: 'State two equivalent formulas for Var(X).', answer: 'Var(X) = E[(X-mu)^2] = E[X^2] - (E[X])^2', solution: 'Definition: E[(X-μ)^2]. Computational: E[X^2] - (E[X])^2.' },
      { prompt: 'Var(aX + b) = ?', answer: 'a^2 Var(X)', solution: 'Var(aX+b) = a^2 Var(X). Constants shift does not change variance; scaling squares.' },
      { prompt: 'If X and Y are independent, Var(X + Y) = ?', answer: 'Var(X) + Var(Y)', solution: 'Independence makes Cov(X,Y) = 0, so Var(X+Y) = Var(X) + Var(Y).' },
    ],
  },
  'moment-generating-functions': {
    problems: [
      { prompt: 'Define the moment generating function M_X(t).', answer: 'M_X(t) = E[e^{tX}]', solution: 'MGF: M_X(t) = E[e^{tX}], defined when the expectation exists in a neighborhood of t=0.' },
      { prompt: 'How do you find E[X^n] from the MGF?', answer: 'E[X^n] = M_X^{(n)}(0), the nth derivative at t=0', solution: 'Differentiate MGF n times and evaluate at t=0 to get the nth moment.' },
      { prompt: 'What is the MGF of X ~ N(mu, sigma^2)?', answer: 'exp(mu*t + sigma^2*t^2/2)', solution: 'M_X(t) = exp(μt + σ^2t^2/2). Uniquely characterizes the normal distribution.' },
    ],
  },
  'transformations': {
    problems: [
      { prompt: 'If X ~ Exp(lambda), what is the CDF of Y = X^2?', answer: 'F_Y(y) = 1 - exp(-lambda*sqrt(y)) for y >= 0', solution: 'F_Y(y) = P(X^2 ≤ y) = P(X ≤ sqrt(y)) = 1 - exp(-λ√y) for y ≥ 0.' },
      { prompt: 'State the PDF transformation formula for Y = g(X) when g is monotone.', answer: 'f_Y(y) = f_X(g^{-1}(y)) * |d/dy g^{-1}(y)|', solution: 'Change of variables: multiply by the absolute value of the Jacobian (derivative of inverse).' },
    ],
  },
  'bernoulli-binomial': {
    problems: [
      { prompt: 'If X ~ Binomial(n,p), what are E[X] and Var(X)?', answer: 'E[X] = np, Var(X) = np(1-p)', solution: 'X = sum of n independent Bernoulli(p). E[X] = np, Var(X) = np(1-p).' },
      { prompt: 'P(X = k) for X ~ Bin(n, p)?', answer: 'C(n,k) p^k (1-p)^{n-k}', solution: 'PMF: P(X=k) = C(n,k) p^k (1-p)^{n-k} for k = 0,1,...,n.' },
      { prompt: 'A fair coin is flipped 10 times. P(exactly 3 heads)?', answer: 'C(10,3)(1/2)^10 = 120/1024 = 15/128', solution: 'C(10,3)(0.5)^3(0.5)^7 = 120/1024 ≈ 0.117.' },
    ],
  },
  'geometric-negative-binomial': {
    problems: [
      { prompt: 'If X ~ Geometric(p), what is E[X] (number of trials until first success)?', answer: '1/p', solution: 'E[X] = 1/p. Memoryless property: P(X > m+n | X > m) = P(X > n).' },
      { prompt: 'Define the Negative Binomial distribution.', answer: 'Number of trials until the rth success, PMF: C(k-1,r-1)p^r(1-p)^{k-r}', solution: 'NB(r,p): number of trials for r successes. E[X] = r/p, Var(X) = r(1-p)/p^2.' },
    ],
  },
  'poisson': {
    problems: [
      { prompt: 'If X ~ Poisson(lambda), state E[X], Var(X), and P(X=k).', answer: 'E[X] = Var(X) = lambda. P(X=k) = e^{-lambda} lambda^k / k!', solution: 'Poisson has equal mean and variance = λ. PMF: e^{-λ}λ^k/k! for k=0,1,2,...' },
      { prompt: 'If X ~ Poisson(3), find P(X = 0).', answer: 'e^{-3} ≈ 0.0498', solution: 'P(X=0) = e^{-3}(3^0)/0! = e^{-3} ≈ 0.0498.' },
      { prompt: 'If X ~ Pois(a) and Y ~ Pois(b) are independent, what is X+Y?', answer: 'Poisson(a + b)', solution: 'Sum of independent Poissons is Poisson with sum of parameters.' },
    ],
  },
  'hypergeometric': {
    problems: [
      { prompt: 'When do you use the hypergeometric instead of binomial?', answer: 'Sampling without replacement from a finite population', solution: 'Hypergeometric: drawing without replacement. Binomial: with replacement or independent trials.' },
      { prompt: 'A deck has 4 aces. Draw 5 cards. P(exactly 2 aces)?', answer: 'C(4,2)C(48,3)/C(52,5)', solution: 'Hypergeometric: C(4,2)C(48,3)/C(52,5) = 6*17296/2598960 ≈ 0.0399.' },
    ],
  },
  'uniform': {
    problems: [
      { prompt: 'If X ~ Uniform(a,b), what are E[X] and Var(X)?', answer: 'E[X] = (a+b)/2, Var(X) = (b-a)^2/12', solution: 'Uniform on [a,b]: mean is midpoint, variance is (b-a)^2/12.' },
      { prompt: 'What is the PDF of Uniform(0,1)?', answer: 'f(x) = 1 for 0 <= x <= 1, 0 otherwise', solution: 'Constant density 1/(b-a) = 1 on the interval [0,1].' },
    ],
  },
  'normal': {
    problems: [
      { prompt: 'State the 68-95-99.7 rule for the normal distribution.', answer: 'About 68% within 1 SD, 95% within 2 SD, 99.7% within 3 SD of the mean', solution: 'Empirical rule: P(|X-μ| < σ) ≈ 0.68, P(|X-μ| < 2σ) ≈ 0.95, P(|X-μ| < 3σ) ≈ 0.997.' },
      { prompt: 'If X ~ N(100, 25), what is P(X > 110)?', answer: 'P(Z > 2) ≈ 0.0228', solution: 'Z = (110-100)/5 = 2. P(Z > 2) ≈ 0.0228.' },
      { prompt: 'If X ~ N(mu, sigma^2), what is the distribution of Z = (X-mu)/sigma?', answer: 'N(0,1) — the standard normal', solution: 'Standardization: Z = (X-μ)/σ ~ N(0,1).' },
      { prompt: 'If X ~ N(mu_1, sigma_1^2) and Y ~ N(mu_2, sigma_2^2) are independent, what is X+Y?', answer: 'N(mu_1 + mu_2, sigma_1^2 + sigma_2^2)', solution: 'Sum of independent normals is normal with summed means and summed variances.' },
    ],
  },
  'exponential-gamma': {
    problems: [
      { prompt: 'State the memoryless property of the exponential distribution.', answer: 'P(X > s+t | X > s) = P(X > t)', solution: 'Given survival past time s, additional survival time has the same distribution. Only the exponential (continuous) has this.' },
      { prompt: 'If X ~ Exp(lambda), what is E[X]?', answer: '1/lambda', solution: 'E[X] = 1/λ, Var(X) = 1/λ^2.' },
      { prompt: 'The sum of n independent Exp(lambda) random variables has what distribution?', answer: 'Gamma(n, lambda)', solution: 'Sum of n iid Exp(λ) ~ Gamma(n, λ). Gamma generalizes the exponential.' },
    ],
  },
  'beta': {
    problems: [
      { prompt: 'What is the support of the Beta(alpha, beta) distribution?', answer: '[0, 1]', solution: 'Beta is defined on [0,1]. E[X] = α/(α+β).' },
      { prompt: 'What special case of Beta gives the Uniform(0,1)?', answer: 'Beta(1, 1)', solution: 'Beta(1,1) has constant density 1 on [0,1] = Uniform(0,1).' },
    ],
  },
  'chi-squared-t-f': {
    problems: [
      { prompt: 'If Z ~ N(0,1), what is Z^2?', answer: 'Chi-squared with 1 degree of freedom', solution: 'Z^2 ~ χ^2(1). Sum of k independent Z^2 ~ χ^2(k).' },
      { prompt: 'Define the t-distribution.', answer: 'T = Z/sqrt(V/k) where Z ~ N(0,1) and V ~ chi-squared(k) are independent', solution: 't-distribution with k df. Heavier tails than normal; approaches N(0,1) as k -> ∞.' },
      { prompt: 'When is the F-distribution used?', answer: 'Ratio of two independent chi-squared variables divided by their df: F = (U/m)/(V/n)', solution: 'F(m,n) = (χ^2_m/m)/(χ^2_n/n). Used in ANOVA and comparing variances.' },
    ],
  },
  'marginals': {
    problems: [
      { prompt: 'How do you get a marginal PMF from a joint PMF?', answer: 'Sum out the other variable: p_X(x) = sum_y p(x,y)', solution: 'Marginal of X: sum (or integrate) the joint over all values of Y.' },
      { prompt: 'If f(x,y) = 6xy for 0<x<1, 0<y<1-x, find f_X(x).', answer: 'f_X(x) = integral from 0 to 1-x of 6xy dy = 3x(1-x)^2', solution: 'f_X(x) = ∫_0^{1-x} 6xy dy = 6x[y^2/2]_0^{1-x} = 3x(1-x)^2 for 0<x<1.' },
    ],
  },
  'conditional-distributions': {
    problems: [
      { prompt: 'Define the conditional PDF f(y|x).', answer: 'f(y|x) = f(x,y) / f_X(x)', solution: 'Conditional density of Y given X=x is the joint divided by the marginal of X.' },
      { prompt: 'If X|Y=y ~ Poisson(y) and Y ~ Exp(1), what is E[X]?', answer: 'E[X] = E[E[X|Y]] = E[Y] = 1', solution: 'Law of iterated expectation: E[X] = E[E[X|Y]] = E[Y] = 1.' },
    ],
  },
  'covariance-correlation': {
    problems: [
      { prompt: 'Define Cov(X,Y) and correlation rho(X,Y).', answer: 'Cov(X,Y) = E[XY] - E[X]E[Y]. rho = Cov(X,Y) / (SD(X)*SD(Y))', solution: 'Covariance measures linear association. Correlation normalizes to [-1,1].' },
      { prompt: 'If X and Y are independent, what is Cov(X,Y)?', answer: '0', solution: 'Independence => E[XY] = E[X]E[Y] => Cov = 0. (Converse is false in general.)' },
      { prompt: 'Var(X + Y) = ?', answer: 'Var(X) + Var(Y) + 2Cov(X,Y)', solution: 'General formula. Reduces to Var(X)+Var(Y) when uncorrelated or independent.' },
    ],
  },
  'independence-joint': {
    problems: [
      { prompt: 'When are X and Y independent?', answer: 'f(x,y) = f_X(x)f_Y(y) for all x,y (joint = product of marginals)', solution: 'Joint factors into product of marginals. Equivalently, conditional equals marginal.' },
    ],
  },
  'law-of-large-numbers': {
    problems: [
      { prompt: 'State the Weak Law of Large Numbers.', answer: 'X_bar_n converges in probability to mu as n -> infinity', solution: 'WLLN: For iid X_i with mean μ, P(|X̄_n - μ| > ε) -> 0 for all ε > 0.' },
      { prompt: 'What is the practical interpretation of the LLN?', answer: 'Sample average approaches population mean as sample size grows', solution: 'With more data, the empirical average stabilizes around the true mean.' },
    ],
  },
  'central-limit-theorem': {
    problems: [
      { prompt: 'State the Central Limit Theorem.', answer: 'sqrt(n)(X_bar - mu)/sigma converges in distribution to N(0,1)', solution: 'CLT: For iid X_i with mean μ, variance σ^2: √n(X̄-μ)/σ →d N(0,1) as n→∞.' },
      { prompt: 'A die is rolled 100 times. Approximate P(sum > 360).', answer: 'P(Z > (360-350)/sqrt(100*35/12)) ≈ P(Z > 0.585) ≈ 0.279', solution: 'μ=3.5, σ^2=35/12. Sum ~ approx N(350, 100*35/12). Z = (360-350)/√(291.67) ≈ 0.586.' },
    ],
  },
  'normal-approximation': {
    problems: [
      { prompt: 'Use CLT to approximate P(X >= 55) when X ~ Bin(100, 0.5).', answer: 'P(Z >= (55-50)/5) = P(Z >= 1) ≈ 0.1587', solution: 'np = 50, sqrt(npq) = 5. Z = (55-50)/5 = 1. P(Z ≥ 1) ≈ 0.1587.' },
    ],
  },
  'point-estimation': {
    problems: [
      { prompt: 'Define unbiased estimator.', answer: 'An estimator theta_hat is unbiased if E[theta_hat] = theta', solution: 'The expected value of the estimator equals the true parameter value.' },
      { prompt: 'Is the sample variance S^2 = sum(X_i - X_bar)^2/(n-1) unbiased for sigma^2?', answer: 'Yes', solution: 'Dividing by n-1 (Bessel correction) makes S^2 unbiased for σ^2.' },
    ],
  },
  'mle': {
    problems: [
      { prompt: 'Describe the MLE procedure.', answer: 'Maximize the likelihood function L(theta) = product f(x_i; theta) with respect to theta', solution: 'MLE: find θ that maximizes L(θ) = Πf(x_i;θ). Usually maximize log-likelihood instead.' },
      { prompt: 'Find the MLE of p for a Bernoulli(p) sample of n trials with k successes.', answer: 'p_hat = k/n', solution: 'L(p) = p^k(1-p)^{n-k}. d/dp log L = k/p - (n-k)/(1-p) = 0. p̂ = k/n.' },
      { prompt: 'Find the MLE of lambda for Poisson(lambda) given sample mean x_bar.', answer: 'lambda_hat = x_bar', solution: 'Log L = -nλ + (Σx_i)log λ - Σlog(x_i!). d/dλ = -n + Σx_i/λ = 0. λ̂ = x̄.' },
    ],
  },
  'method-of-moments': {
    problems: [
      { prompt: 'Describe the method of moments.', answer: 'Set sample moments equal to population moments and solve for parameters', solution: 'Match E[X^k] = (1/n)Σx_i^k for k = 1, 2, ... to get enough equations for all parameters.' },
    ],
  },
  'confidence-intervals': {
    problems: [
      { prompt: 'Construct a 95% CI for the mean when sigma is known.', answer: 'X_bar +/- z_{0.025} * sigma/sqrt(n) = X_bar +/- 1.96*sigma/sqrt(n)', solution: '95% CI: X̄ ± 1.96σ/√n. The interval covers μ with 95% probability before data observed.' },
      { prompt: 'When do you use a t-interval instead of a z-interval?', answer: 'When sigma is unknown and estimated by s (sample SD)', solution: 'Use t_{n-1} distribution: X̄ ± t_{α/2,n-1} * s/√n.' },
      { prompt: 'Interpret: "We are 95% confident the mean is in [4.2, 5.8]."', answer: '95% of such intervals constructed from repeated samples contain the true mean', solution: 'Frequentist interpretation: the procedure captures μ 95% of the time. This specific interval either does or does not.' },
    ],
  },
  'sufficiency': {
    problems: [
      { prompt: 'Define a sufficient statistic.', answer: 'T is sufficient for theta if the distribution of X given T does not depend on theta', solution: 'T(X) captures all information about θ in the data. By Fisher-Neyman factorization: f(x;θ) = g(T(x),θ)h(x).' },
    ],
  },
  'neyman-pearson': {
    problems: [
      { prompt: 'State the Neyman-Pearson Lemma.', answer: 'For simple H0 vs simple H1, the most powerful test rejects when likelihood ratio exceeds a threshold', solution: 'Reject H_0 when L(θ_1)/L(θ_0) > c for a constant c determined by significance level α.' },
    ],
  },
  'z-t-tests': {
    problems: [
      { prompt: 'When do you use a z-test vs. a t-test for a population mean?', answer: 'z-test when sigma known (or large n), t-test when sigma unknown', solution: 'z-test: known σ or n>30. t-test: unknown σ, use s, t_{n-1} distribution.' },
      { prompt: 'Set up a two-sided t-test for H0: mu = 50 vs H1: mu != 50.', answer: 'Test statistic t = (X_bar - 50)/(s/sqrt(n)). Reject if |t| > t_{alpha/2, n-1}', solution: 'Compute t, compare to critical value or find p-value = 2P(T > |t|).' },
    ],
  },
  'chi-squared-tests': {
    problems: [
      { prompt: 'What does a chi-squared goodness-of-fit test assess?', answer: 'Whether observed frequencies match expected frequencies from a hypothesized distribution', solution: 'Test statistic: Σ(O_i - E_i)^2/E_i ~ χ^2(k-1-p) where p = estimated parameters.' },
      { prompt: 'In a chi-squared test of independence, what is the null hypothesis?', answer: 'The two categorical variables are independent', solution: 'H0: variables independent. Expected: E_ij = (row_i total)(col_j total)/n.' },
    ],
  },
  'f-tests': {
    problems: [
      { prompt: 'What does an F-test compare?', answer: 'Two variances: F = S_1^2/S_2^2 under H0: sigma_1^2 = sigma_2^2', solution: 'F-test: ratio of sample variances. Under H0, F ~ F(n1-1, n2-1).' },
    ],
  },
  'p-values-power': {
    problems: [
      { prompt: 'Define p-value.', answer: 'Probability of observing a test statistic as extreme as or more extreme than the observed, under H0', solution: 'Small p-value = evidence against H0. Reject if p < α (significance level).' },
      { prompt: 'Define power and Type I/II errors.', answer: 'Power = P(reject H0 | H1 true) = 1 - beta. Type I = reject true H0 (alpha). Type II = fail to reject false H0 (beta)', solution: 'Power increases with sample size, effect size, and alpha. Type I rate is controlled by alpha.' },
    ],
  },
  'simple-linear-regression': {
    problems: [
      { prompt: 'Write the simple linear regression model.', answer: 'Y = beta_0 + beta_1 X + epsilon, where epsilon ~ N(0, sigma^2)', solution: 'Y = β₀ + β₁X + ε. OLS estimates: β̂₁ = Σ(x_i-x̄)(y_i-ȳ)/Σ(x_i-x̄)^2, β̂₀ = ȳ - β̂₁x̄.' },
      { prompt: 'Interpret the slope beta_1 in linear regression.', answer: 'A one-unit increase in X is associated with a beta_1 change in E[Y], holding other factors constant', solution: 'β₁ is the average change in Y per unit change in X.' },
    ],
  },
  'multiple-regression': {
    problems: [
      { prompt: 'What does R-squared measure?', answer: 'Proportion of variance in Y explained by the model: R^2 = 1 - SS_res/SS_tot', solution: 'R² ∈ [0,1]. Higher means better fit. Adjusted R² penalizes for number of predictors.' },
    ],
  },
  'anova': {
    problems: [
      { prompt: 'What does one-way ANOVA test?', answer: 'Whether the means of 3+ groups are all equal: H0: mu_1 = mu_2 = ... = mu_k', solution: 'F = MS_between/MS_within. Large F indicates group means differ.' },
    ],
  },
  'residual-analysis': {
    problems: [
      { prompt: 'What patterns in a residual plot indicate model problems?', answer: 'Non-random patterns (curves, funnels) suggest nonlinearity or heteroscedasticity', solution: 'Good residuals: random scatter around 0. Fan shape = heteroscedasticity. Curve = nonlinear relationship.' },
    ],
  },
  'model-selection': {
    problems: [
      { prompt: 'Compare AIC and BIC for model selection.', answer: 'Both penalize complexity. BIC penalizes more heavily, favoring simpler models. AIC = -2logL + 2k, BIC = -2logL + k*log(n)', solution: 'Lower AIC/BIC = better model. BIC is more conservative (stronger penalty for parameters).' },
    ],
  },
  'prior-posterior': {
    problems: [
      { prompt: 'State Bayes\' rule for a parameter theta given data x.', answer: 'posterior is proportional to likelihood times prior: p(theta|x) ∝ f(x|theta)p(theta)', solution: 'p(θ|x) = f(x|θ)π(θ) / ∫f(x|θ)π(θ)dθ. Posterior ∝ Likelihood × Prior.' },
    ],
  },
  'conjugate-families': {
    problems: [
      { prompt: 'What is the conjugate prior for a Binomial likelihood?', answer: 'Beta distribution', solution: 'Beta prior + Binomial likelihood → Beta posterior. Beta(α,β) + Bin(n,k) → Beta(α+k, β+n-k).' },
      { prompt: 'What is the conjugate prior for a Normal likelihood (known variance)?', answer: 'Normal distribution', solution: 'Normal prior + Normal likelihood → Normal posterior. Conjugacy simplifies computation.' },
    ],
  },
  'credible-intervals': {
    problems: [
      { prompt: 'How does a Bayesian credible interval differ from a frequentist confidence interval?', answer: 'Credible interval: P(theta in CI | data) = 0.95. CI: 95% of intervals cover theta in repeated sampling', solution: 'Credible interval gives direct probability statement about parameter. CI is about the procedure.' },
    ],
  },
  'map-estimation': {
    problems: [
      { prompt: 'Define MAP estimation.', answer: 'Maximum a posteriori: theta_MAP = argmax p(theta|x) = argmax f(x|theta)p(theta)', solution: 'MAP maximizes the posterior. With uniform prior, MAP = MLE.' },
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
  return { type: 'probability-statistics', skill, count: items.length, instruction: 'Solve each problem. Show your reasoning and interpret results.', items };
}

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
}

// Public API

class ProbabilityStatistics {
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
        review: 'Review prerequisite concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} -> ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice problems`,
        apply: 'Apply to a real data scenario and interpret results',
      },
    };
  }
}

module.exports = ProbabilityStatistics;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new ProbabilityStatistics();
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
      default: out({ usage: 'node probability-statistics.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students'] });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
