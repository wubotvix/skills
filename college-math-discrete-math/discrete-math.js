// College Math Discrete Mathematics Interactive Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-math-discrete-math');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'logic-proofs': ['propositional-logic', 'truth-tables', 'logical-equivalences', 'predicates-quantifiers', 'direct-proof', 'contrapositive-proof', 'proof-by-contradiction'],
  'sets-functions': ['set-operations', 'power-sets', 'cartesian-products', 'injections', 'surjections', 'bijections', 'inverse-functions'],
  'induction': ['weak-induction', 'strong-induction', 'structural-induction', 'well-ordering'],
  'combinatorics': ['counting-principles', 'permutations', 'combinations', 'binomial-theorem', 'inclusion-exclusion', 'pigeonhole', 'stars-and-bars'],
  'graph-theory': ['graph-basics', 'paths-cycles', 'trees', 'euler-circuits', 'hamilton-paths', 'graph-coloring', 'planarity'],
  'number-theory': ['divisibility', 'primes-factorization', 'gcd-lcm', 'modular-arithmetic', 'euler-fermat', 'rsa-basics'],
  'recurrences': ['linear-recurrences', 'generating-functions', 'master-theorem'],
};

const PROBLEM_BANKS = {
  'propositional-logic': {
    problems: [
      { prompt: 'Write the negation of "If it rains, then the ground is wet" (p -> q)', answer: 'p and not q', solution: 'Negation of p->q is p ∧ ¬q: "It rains AND the ground is NOT wet"' },
      { prompt: 'Is (p -> q) logically equivalent to (not q -> not p)?', answer: 'yes', solution: 'This is the contrapositive. p->q ≡ ¬q->¬p. Always equivalent.' },
      { prompt: 'Simplify: not (p and q)', answer: 'not p or not q', solution: "De Morgan's Law: ¬(p ∧ q) ≡ ¬p ∨ ¬q" },
      { prompt: 'Is (p or q) -> r equivalent to (p -> r) and (q -> r)?', answer: 'yes', solution: 'Distributing implication over disjunction in antecedent: equivalent.' },
      { prompt: 'What is the converse of p -> q?', answer: 'q -> p', solution: 'Converse swaps hypothesis and conclusion. Note: NOT logically equivalent to original.' },
    ],
  },
  'truth-tables': {
    problems: [
      { prompt: 'How many rows does a truth table with 3 variables have?', answer: '8', solution: '2^3 = 8 rows (all combinations of T/F for 3 variables)' },
      { prompt: 'Evaluate (T -> F)', answer: 'F', solution: 'An implication is false ONLY when the hypothesis is true and conclusion is false.' },
      { prompt: 'Evaluate (F -> F)', answer: 'T', solution: 'When hypothesis is false, implication is vacuously true.' },
      { prompt: 'Is (p -> q) ∧ (q -> p) equivalent to p <-> q?', answer: 'yes', solution: 'The biconditional is defined as both directions of implication.' },
      { prompt: 'How many distinct Boolean functions of 2 variables exist?', answer: '16', solution: 'Truth table has 4 rows, each output can be T or F: 2^4 = 16' },
    ],
  },
  'logical-equivalences': {
    problems: [
      { prompt: 'Simplify: not (not p)', answer: 'p', solution: 'Double negation law: ¬(¬p) ≡ p' },
      { prompt: 'Simplify: p or (p and q)', answer: 'p', solution: 'Absorption law: p ∨ (p ∧ q) ≡ p' },
      { prompt: 'Simplify: (p and q) or (p and not q)', answer: 'p', solution: 'Factor: p ∧ (q ∨ ¬q) = p ∧ T = p' },
      { prompt: 'Write p -> q using only not and or', answer: 'not p or q', solution: 'Material implication: p → q ≡ ¬p ∨ q' },
      { prompt: 'Simplify: not (p or (not p and q))', answer: 'not p and not q', solution: '¬(p ∨ (¬p ∧ q)) = ¬p ∧ ¬(¬p ∧ q) = ¬p ∧ (p ∨ ¬q) = ¬p ∧ ¬q' },
    ],
  },
  'predicates-quantifiers': {
    problems: [
      { prompt: 'Negate: "For all x, P(x)"', answer: 'There exists x such that not P(x)', solution: '¬(∀x P(x)) ≡ ∃x ¬P(x)' },
      { prompt: 'Negate: "There exists x such that for all y, P(x,y)"', answer: 'For all x, there exists y such that not P(x,y)', solution: '¬(∃x ∀y P(x,y)) ≡ ∀x ∃y ¬P(x,y)' },
      { prompt: 'Is "∀x ∃y (x+y=0)" true over the integers?', answer: 'yes', solution: 'For any x, choose y=-x. Then x+y=0. True.' },
      { prompt: 'Is "∃y ∀x (x+y=0)" true over the integers?', answer: 'no', solution: 'No single y works for ALL x. Order of quantifiers matters!' },
    ],
  },
  'direct-proof': {
    problems: [
      { prompt: 'Prove: If n is even, then n^2 is even. (State the key step)', answer: 'n=2k, so n^2=4k^2=2(2k^2)', solution: 'n=2k for some integer k. n^2=(2k)^2=4k^2=2(2k^2). Since 2k^2 is integer, n^2 is even.' },
      { prompt: 'Prove: The sum of two even integers is even. (State key step)', answer: '2a + 2b = 2(a+b)', solution: 'Let m=2a, n=2b. m+n = 2a+2b = 2(a+b). Since a+b is integer, sum is even.' },
      { prompt: 'Prove: If n is odd, then n^2 is odd. (State key step)', answer: 'n=2k+1, n^2=4k^2+4k+1=2(2k^2+2k)+1', solution: 'n=2k+1. n^2=4k^2+4k+1=2(2k^2+2k)+1. This is odd (form 2m+1).' },
    ],
  },
  'contrapositive-proof': {
    problems: [
      { prompt: 'To prove "if n^2 is even then n is even", what do you prove instead by contrapositive?', answer: 'if n is odd then n^2 is odd', solution: 'Contrapositive of (A->B) is (¬B->¬A). Prove: if n is odd, then n^2 is odd.' },
      { prompt: 'Prove by contrapositive: If x+y >= 2, then x>=1 or y>=1.', answer: 'Assume x<1 and y<1, then x+y<2', solution: 'Contrapositive: if x<1 and y<1, then x+y<2. Direct: x<1, y<1 => x+y<2.' },
    ],
  },
  'proof-by-contradiction': {
    problems: [
      { prompt: 'Prove sqrt(2) is irrational. What assumption starts the proof?', answer: 'Assume sqrt(2) = a/b in lowest terms', solution: 'Assume sqrt(2)=a/b, gcd(a,b)=1. Then 2=a^2/b^2, 2b^2=a^2. So a is even. Then a=2k, 4k^2=2b^2, b is even. Contradiction with gcd(a,b)=1.' },
      { prompt: 'Prove there are infinitely many primes. What do you assume?', answer: 'Assume finitely many primes p1,...,pn', solution: 'Consider N=p1*p2*...*pn+1. N is not divisible by any pi (remainder 1). So N has a prime factor not in our list. Contradiction.' },
    ],
  },
  'set-operations': {
    problems: [
      { prompt: 'If A={1,2,3} and B={2,3,4}, find A ∩ B', answer: '{2, 3}', solution: 'A ∩ B = elements in both A and B = {2, 3}' },
      { prompt: 'If A={1,2,3} and B={2,3,4}, find A ∪ B', answer: '{1, 2, 3, 4}', solution: 'A ∪ B = elements in A or B (or both) = {1,2,3,4}' },
      { prompt: 'If A={1,2,3} and B={2,3,4}, find A - B', answer: '{1}', solution: 'A - B = elements in A but not B = {1}' },
      { prompt: 'If A={1,2,3} and B={2,3,4}, find A △ B (symmetric difference)', answer: '{1, 4}', solution: 'A △ B = (A-B) ∪ (B-A) = {1} ∪ {4} = {1,4}' },
      { prompt: 'Simplify: A ∩ (A ∪ B)', answer: 'A', solution: 'Absorption law: A ∩ (A ∪ B) = A' },
    ],
  },
  'power-sets': {
    problems: [
      { prompt: 'Find |P({1,2,3})| (size of the power set)', answer: '8', solution: '|P(A)| = 2^|A| = 2^3 = 8' },
      { prompt: 'List all elements of P({a,b})', answer: '{∅, {a}, {b}, {a,b}}', solution: 'P({a,b}) = {∅, {a}, {b}, {a,b}}. 2^2=4 subsets.' },
      { prompt: 'Is {1,2} ∈ P({1,2,3})?', answer: 'yes', solution: '{1,2} is a subset of {1,2,3}, so it is an element of the power set.' },
      { prompt: 'How many elements does P(P({a})) have?', answer: '4', solution: 'P({a}) = {∅, {a}}, which has 2 elements. P(P({a})) has 2^2 = 4 elements.' },
    ],
  },
  'cartesian-products': {
    problems: [
      { prompt: 'If A={1,2} and B={a,b}, find |A × B|', answer: '4', solution: '|A×B| = |A|*|B| = 2*2 = 4. Elements: (1,a),(1,b),(2,a),(2,b)' },
      { prompt: 'Is A × B = B × A in general?', answer: 'no', solution: '(1,a) ∈ A×B but (1,a) ∉ B×A (unless A=B). Order matters in ordered pairs.' },
    ],
  },
  'injections': {
    problems: [
      { prompt: 'Is f(x)=2x from Z to Z injective?', answer: 'yes', solution: 'If 2a=2b then a=b. So f is injective (one-to-one).' },
      { prompt: 'Is f(x)=x^2 from Z to Z injective?', answer: 'no', solution: 'f(1)=f(-1)=1 but 1≠-1. Not injective.' },
      { prompt: 'If |A|=5, |B|=3, can there be an injection from A to B?', answer: 'no', solution: 'By pigeonhole: 5 elements into 3 slots means at least two share a target. No injection possible.' },
    ],
  },
  'surjections': {
    problems: [
      { prompt: 'Is f(x)=2x from Z to Z surjective?', answer: 'no', solution: 'No integer maps to 1 (would need x=1/2). Not surjective.' },
      { prompt: 'Is f(x)=x+1 from Z to Z surjective?', answer: 'yes', solution: 'For any y, choose x=y-1. Then f(x)=y. Surjective.' },
      { prompt: 'If |A|=3, |B|=5, can there be a surjection from A to B?', answer: 'no', solution: '3 inputs can hit at most 3 distinct outputs, but B has 5. Not surjective.' },
    ],
  },
  'bijections': {
    problems: [
      { prompt: 'Is f(x)=x+1 from Z to Z a bijection?', answer: 'yes', solution: 'Injective (x+1=y+1 => x=y) and surjective (for any y, x=y-1 works). Bijection.' },
      { prompt: 'If f:A->B is a bijection, what can you say about |A| and |B|?', answer: '|A| = |B|', solution: 'Bijections establish a one-to-one correspondence, so sets have equal cardinality.' },
      { prompt: 'Find a bijection from {1,2,3} to {a,b,c}', answer: 'f(1)=a, f(2)=b, f(3)=c (any permutation works)', solution: 'Any one-to-one onto function. E.g., 1->a, 2->b, 3->c.' },
    ],
  },
  'inverse-functions': {
    problems: [
      { prompt: 'If f(x)=2x+3, find f^{-1}(x)', answer: '(x-3)/2', solution: 'y=2x+3 => x=(y-3)/2. So f^{-1}(x)=(x-3)/2.' },
      { prompt: 'Does f(x)=x^2 (from R to R) have an inverse?', answer: 'no', solution: 'Not injective (f(1)=f(-1)). No inverse exists on all of R. (Restrict to x>=0 and it does.)' },
    ],
  },
  'weak-induction': {
    problems: [
      { prompt: 'Prove by induction: 1+2+...+n = n(n+1)/2. What is the base case?', answer: 'n=1: 1 = 1(2)/2 = 1', solution: 'Base case n=1: LHS=1, RHS=1(2)/2=1. ✓' },
      { prompt: 'In the inductive step for sum = n(n+1)/2, assume P(k). Show P(k+1). What do you add to both sides?', answer: 'k+1', solution: '1+...+k+(k+1) = k(k+1)/2 + (k+1) = (k+1)(k+2)/2. This is P(k+1). ✓' },
      { prompt: 'Prove: 2^n > n for all n >= 1. What is the inductive step?', answer: '2^(k+1) = 2*2^k > 2k >= k+1 (for k>=1)', solution: 'Assume 2^k>k. Then 2^(k+1)=2*2^k>2k>=k+1 for k>=1.' },
    ],
  },
  'strong-induction': {
    problems: [
      { prompt: 'Prove every integer n>=2 has a prime factorization. Why is strong induction needed?', answer: 'If n is composite, n=ab where a,b < n, and we need P(a) and P(b)', solution: 'If n is prime, done. If composite, n=ab with 2<=a,b<n. By strong induction hypothesis, a and b have prime factorizations. Combine them.' },
      { prompt: 'In strong induction, the inductive hypothesis assumes P(j) for all j with base <= j <= k. True or false?', answer: 'true', solution: 'Strong induction assumes ALL previous cases, not just P(k). This is the key difference from weak induction.' },
    ],
  },
  'structural-induction': {
    problems: [
      { prompt: 'To prove a property for all binary trees, what are the base case and inductive step?', answer: 'Base: empty/leaf tree. Step: if P holds for subtrees T1,T2, then P holds for Tree(T1,T2)', solution: 'Base: single leaf (or empty tree). Inductive: assume property for left and right subtrees, prove for combined tree.' },
    ],
  },
  'well-ordering': {
    problems: [
      { prompt: 'State the Well-Ordering Principle for natural numbers', answer: 'Every nonempty subset of N has a least element', solution: 'WOP: Every nonempty subset of the natural numbers contains a smallest element. Equivalent to induction.' },
    ],
  },
  'counting-principles': {
    problems: [
      { prompt: 'A restaurant has 5 appetizers and 8 entrees. How many meals (1 app + 1 entree)?', answer: '40', solution: 'Product rule: 5 × 8 = 40' },
      { prompt: 'How many 3-digit numbers have all distinct digits?', answer: '648', solution: 'First digit: 9 choices (1-9). Second: 9 (0-9 minus first). Third: 8. Total: 9×9×8 = 648' },
      { prompt: 'How many bit strings of length 8 start with 1 or end with 00?', answer: '128 + 64 - 32 = 160', solution: 'Start with 1: 2^7=128. End with 00: 2^6=64. Both: 2^5=32. By inclusion-exclusion: 160.' },
    ],
  },
  'permutations': {
    problems: [
      { prompt: 'How many ways to arrange 5 distinct books on a shelf?', answer: '120', solution: '5! = 120' },
      { prompt: 'How many ways to choose and arrange 3 people from 10 for president, VP, secretary?', answer: '720', solution: 'P(10,3) = 10×9×8 = 720' },
      { prompt: 'How many permutations of the letters in MISSISSIPPI?', answer: '34650', solution: '11!/(4!*4!*2!) = 34650. (4 S, 4 I, 2 P, 1 M)' },
    ],
  },
  'combinations': {
    problems: [
      { prompt: 'C(10,3) = ?', answer: '120', solution: 'C(10,3) = 10!/(3!*7!) = (10*9*8)/(3*2*1) = 120' },
      { prompt: 'A committee of 5 is chosen from 12 people. How many ways?', answer: '792', solution: 'C(12,5) = 12!/(5!*7!) = 792' },
      { prompt: 'How many ways to choose a 5-card poker hand from 52 cards?', answer: '2598960', solution: 'C(52,5) = 52!/(5!*47!) = 2,598,960' },
      { prompt: 'Prove C(n,k) = C(n,n-k) combinatorially', answer: 'Choosing k items to include = choosing n-k items to exclude', solution: 'Every k-subset determines a complementary (n-k)-subset. Bijection between the two families.' },
    ],
  },
  'binomial-theorem': {
    problems: [
      { prompt: 'Expand (x+y)^3 using the binomial theorem', answer: 'x^3 + 3x^2y + 3xy^2 + y^3', solution: 'Sum C(3,k)x^(3-k)y^k for k=0..3: x^3+3x^2y+3xy^2+y^3' },
      { prompt: 'What is the coefficient of x^4y^6 in (x+y)^10?', answer: '210', solution: 'C(10,6) = C(10,4) = 210' },
      { prompt: 'What is the sum of all binomial coefficients C(n,0)+C(n,1)+...+C(n,n)?', answer: '2^n', solution: 'Set x=y=1 in (x+y)^n: 2^n = sum of C(n,k)' },
    ],
  },
  'inclusion-exclusion': {
    problems: [
      { prompt: 'In a class of 30: 18 play soccer, 15 play basketball, 10 play both. How many play neither?', answer: '7', solution: '|S ∪ B| = 18+15-10 = 23. Neither = 30-23 = 7.' },
      { prompt: 'How many integers from 1-100 are divisible by 2 or 3?', answer: '67', solution: 'Div by 2: 50. Div by 3: 33. Div by 6: 16. By IE: 50+33-16=67.' },
      { prompt: 'State the inclusion-exclusion formula for |A ∪ B ∪ C|', answer: '|A|+|B|+|C|-|A∩B|-|A∩C|-|B∩C|+|A∩B∩C|', solution: 'Add singles, subtract pairs, add triple intersection.' },
    ],
  },
  'pigeonhole': {
    problems: [
      { prompt: 'If 13 people are in a room, prove at least 2 share a birth month.', answer: '13 people, 12 months: by pigeonhole, at least 2 share a month', solution: '13 pigeons in 12 holes: at least one hole has >= 2. (ceil(13/12) = 2)' },
      { prompt: 'Among any 5 integers, prove at least 2 have the same remainder mod 4.', answer: '5 integers, 4 possible remainders: pigeonhole gives a repeat', solution: 'Remainders mod 4: {0,1,2,3} = 4 holes. 5 integers = 5 pigeons. At least 2 share a remainder.' },
      { prompt: 'In any group of 6 people, prove at least 3 are mutual acquaintances or 3 are mutual strangers.', answer: 'Ramsey theory / pigeonhole on edges from one vertex', solution: 'Pick person A. Of 5 others, at least 3 are friends or 3 are strangers (pigeonhole). Among those 3: if any pair is also friends of A -> 3 mutual friends. Otherwise all 3 are mutual strangers.' },
    ],
  },
  'stars-and-bars': {
    problems: [
      { prompt: 'How many ways to put 10 identical balls into 3 distinct boxes?', answer: '66', solution: 'Stars and bars: C(10+3-1, 3-1) = C(12,2) = 66' },
      { prompt: 'How many nonnegative integer solutions to x+y+z=7?', answer: '36', solution: 'C(7+3-1, 3-1) = C(9,2) = 36' },
      { prompt: 'How many ways to distribute 8 identical cookies to 4 children, each getting at least 1?', answer: '35', solution: 'Give 1 to each first: distribute 4 among 4. C(4+3,3) = C(7,3) = 35' },
    ],
  },
  'graph-basics': {
    problems: [
      { prompt: 'A graph has 5 vertices. What is the maximum number of edges (simple graph)?', answer: '10', solution: 'C(5,2) = 10. Complete graph K5 has 10 edges.' },
      { prompt: 'If a graph has 6 vertices each of degree 4, how many edges?', answer: '12', solution: 'Sum of degrees = 2|E|. 6×4 = 24 = 2|E|. |E| = 12.' },
      { prompt: 'State the Handshaking Lemma', answer: 'Sum of all vertex degrees = 2 * number of edges', solution: 'Each edge contributes 2 to the total degree count.' },
    ],
  },
  'paths-cycles': {
    problems: [
      { prompt: 'What is the length of the shortest cycle in K4 (complete graph on 4)?', answer: '3', solution: 'K4 contains triangles (3-cycles). Shortest possible cycle is 3.' },
      { prompt: 'Can a graph with 5 vertices and 3 edges be connected?', answer: 'yes', solution: 'A path graph on 4 vertices uses 3 edges and is connected. Add an isolated 5th vertex: not connected. But a tree on 4 vertices + edge to 5th: 4 edges. So with 3 edges: possible if a tree on 4 vertices (yes, connected on those 4).' },
    ],
  },
  'trees': {
    problems: [
      { prompt: 'A tree with n vertices has how many edges?', answer: 'n-1', solution: 'Fundamental property of trees: |E| = |V| - 1.' },
      { prompt: 'How many labeled trees on 4 vertices exist?', answer: '16', solution: "Cayley's formula: n^(n-2) = 4^2 = 16" },
      { prompt: 'Is every tree bipartite?', answer: 'yes', solution: 'Trees have no cycles, hence no odd cycles. All trees are bipartite.' },
    ],
  },
  'euler-circuits': {
    problems: [
      { prompt: 'When does a connected graph have an Euler circuit?', answer: 'When every vertex has even degree', solution: 'Euler circuit exists iff graph is connected and all vertices have even degree.' },
      { prompt: 'Does K5 have an Euler circuit?', answer: 'yes', solution: 'K5: every vertex has degree 4 (even). Connected. Has Euler circuit.' },
      { prompt: 'When does a connected graph have an Euler path (not circuit)?', answer: 'When exactly 2 vertices have odd degree', solution: 'Euler path (not circuit) iff exactly 2 vertices have odd degree. Path goes from one odd-degree vertex to the other.' },
    ],
  },
  'hamilton-paths': {
    problems: [
      { prompt: 'Does K5 have a Hamiltonian cycle?', answer: 'yes', solution: 'All complete graphs Kn for n>=3 have Hamiltonian cycles.' },
      { prompt: "State Dirac's theorem for Hamiltonian cycles", answer: 'If every vertex has degree >= n/2, then graph has a Hamiltonian cycle', solution: "Dirac's theorem: If G has n>=3 vertices and every vertex has degree >= n/2, then G is Hamiltonian." },
    ],
  },
  'graph-coloring': {
    problems: [
      { prompt: 'What is the chromatic number of K4?', answer: '4', solution: 'In K4, every vertex is adjacent to every other. Need 4 colors.' },
      { prompt: 'What is the chromatic number of any tree (n>=2)?', answer: '2', solution: 'Trees are bipartite. Bipartite graphs have chromatic number 2.' },
      { prompt: 'What is the chromatic number of C5 (5-cycle)?', answer: '3', solution: 'Odd cycles require 3 colors. (Even cycles need only 2.)' },
    ],
  },
  'planarity': {
    problems: [
      { prompt: 'Is K4 planar?', answer: 'yes', solution: 'K4 can be drawn without crossing edges. (4 vertices, 6 edges, satisfies E<=3V-6.)' },
      { prompt: 'Is K5 planar?', answer: 'no', solution: "Kuratowski's theorem: K5 is not planar. Also 10 > 3(5)-6 = 9, violating Euler's formula bound." },
      { prompt: "State Euler's formula for connected planar graphs", answer: 'V - E + F = 2', solution: "Euler's formula: Vertices - Edges + Faces = 2 for any connected planar graph." },
    ],
  },
  'divisibility': {
    problems: [
      { prompt: 'Prove: if a|b and b|c, then a|c', answer: 'b=ak, c=bl=akl, so a|c', solution: 'a|b means b=ak. b|c means c=bl. So c=akl=a(kl). Thus a|c.' },
      { prompt: 'What is the Division Algorithm statement?', answer: 'For a,b (b>0): a = bq + r where 0 <= r < b', solution: 'For any integers a,b with b>0, there exist unique q,r with a=bq+r and 0<=r<b.' },
    ],
  },
  'primes-factorization': {
    problems: [
      { prompt: 'Find the prime factorization of 360', answer: '2^3 * 3^2 * 5', solution: '360 = 2*180 = 2*2*90 = 2*2*2*45 = 2^3*45 = 2^3*9*5 = 2^3*3^2*5' },
      { prompt: 'Is 91 prime?', answer: 'no', solution: '91 = 7 × 13. Not prime.' },
      { prompt: 'How many divisors does 12 have?', answer: '6', solution: '12 = 2^2 * 3^1. Divisors: (2+1)(1+1) = 6. They are: 1,2,3,4,6,12.' },
    ],
  },
  'gcd-lcm': {
    problems: [
      { prompt: 'Find gcd(48, 18) using Euclidean algorithm', answer: '6', solution: '48 = 2*18 + 12. 18 = 1*12 + 6. 12 = 2*6 + 0. gcd = 6.' },
      { prompt: 'Find lcm(12, 15)', answer: '60', solution: 'lcm(a,b) = a*b/gcd(a,b) = 12*15/3 = 60.' },
      { prompt: 'Express gcd(48,18)=6 as a linear combination of 48 and 18', answer: '6 = 48*(-1) + 18*3', solution: 'Back-substitute: 6=18-1*12=18-1*(48-2*18)=3*18-48. So 6=(-1)*48+3*18.' },
    ],
  },
  'modular-arithmetic': {
    problems: [
      { prompt: 'Find 17 mod 5', answer: '2', solution: '17 = 3*5 + 2, so 17 mod 5 = 2' },
      { prompt: 'Find 3^100 mod 4', answer: '1', solution: '3 ≡ -1 (mod 4). (-1)^100 = 1. So 3^100 ≡ 1 (mod 4).' },
      { prompt: 'Solve 3x ≡ 1 (mod 7)', answer: 'x ≡ 5 (mod 7)', solution: '3*5 = 15 = 2*7+1 ≡ 1 (mod 7). So x ≡ 5 (mod 7).' },
      { prompt: 'Find the last digit of 7^2023', answer: '3', solution: 'Powers of 7 mod 10 cycle: 7,9,3,1 (period 4). 2023 mod 4 = 3. 7^3 mod 10 = 3.' },
    ],
  },
  'euler-fermat': {
    problems: [
      { prompt: "Find phi(12) (Euler's totient)", answer: '4', solution: 'Numbers 1-12 coprime to 12: {1,5,7,11}. phi(12) = 4. Or: 12(1-1/2)(1-1/3) = 4.' },
      { prompt: "Use Fermat's Little Theorem: 2^10 mod 11", answer: '1', solution: "FLT: a^(p-1) ≡ 1 (mod p) when gcd(a,p)=1. 2^10 ≡ 1 (mod 11)." },
      { prompt: "Compute 3^100 mod 7 using Fermat's Little Theorem", answer: '4', solution: '3^6 ≡ 1 (mod 7). 100 = 16*6+4. 3^100 = (3^6)^16 * 3^4 ≡ 1*81 ≡ 81 mod 7 = 4.' },
    ],
  },
  'rsa-basics': {
    problems: [
      { prompt: 'In RSA, if p=3, q=11, what is n?', answer: '33', solution: 'n = p*q = 3*11 = 33' },
      { prompt: 'In RSA with p=3, q=11, what is phi(n)?', answer: '20', solution: 'phi(n) = (p-1)(q-1) = 2*10 = 20' },
      { prompt: 'In RSA with phi(n)=20 and e=3, find d', answer: '7', solution: 'd*e ≡ 1 (mod 20). 3*7 = 21 ≡ 1 (mod 20). d=7.' },
    ],
  },
  'linear-recurrences': {
    problems: [
      { prompt: 'Solve a_n = 3a_{n-1} with a_0=2', answer: 'a_n = 2*3^n', solution: 'Characteristic equation: r=3. General: A*3^n. a_0=A=2. So a_n=2*3^n.' },
      { prompt: 'Find the characteristic equation for a_n = 5a_{n-1} - 6a_{n-2}', answer: 'r^2 - 5r + 6 = 0', solution: 'r^2-5r+6=0 -> (r-2)(r-3)=0. Roots: r=2,3. General: A*2^n+B*3^n.' },
      { prompt: 'Solve the Fibonacci recurrence F_n = F_{n-1}+F_{n-2}, F_0=0, F_1=1. What are the characteristic roots?', answer: '(1+sqrt(5))/2 and (1-sqrt(5))/2', solution: 'r^2=r+1 -> r^2-r-1=0. r=(1±sqrt(5))/2. Golden ratio and conjugate.' },
    ],
  },
  'generating-functions': {
    problems: [
      { prompt: 'What is the generating function for the sequence 1,1,1,1,...?', answer: '1/(1-x)', solution: 'sum x^n = 1/(1-x) for |x|<1. Coefficients are all 1.' },
      { prompt: 'What is the generating function for {1, 2, 3, 4, ...}?', answer: '1/(1-x)^2', solution: 'sum (n+1)x^n = 1/(1-x)^2. Or: d/dx[1/(1-x)] = 1/(1-x)^2 gives coefficients n+1.' },
    ],
  },
  'master-theorem': {
    problems: [
      { prompt: 'Solve T(n)=2T(n/2)+n using the Master Theorem', answer: 'O(n log n)', solution: 'a=2, b=2, f(n)=n. n^(log_2(2))=n. Case 2: T(n)=Θ(n log n).' },
      { prompt: 'Solve T(n)=4T(n/2)+n using the Master Theorem', answer: 'O(n^2)', solution: 'a=4, b=2, n^(log_2(4))=n^2. f(n)=n=O(n^(2-ε)). Case 1: T(n)=Θ(n^2).' },
      { prompt: 'Solve T(n)=T(n/2)+1 (binary search)', answer: 'O(log n)', solution: 'a=1, b=2, n^(log_2(1))=n^0=1. f(n)=1. Case 2: T(n)=Θ(log n).' },
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
  return { type: 'math', skill, count: items.length, instruction: 'Solve each problem. Show your reasoning.', items };
}

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
}

function resolveSkill(skill) {
  for (const [cat, skills] of Object.entries(SKILLS)) {
    if (skills.includes(skill)) return { category: cat, skill };
  }
  return null;
}

// Public API

class DiscreteMath {
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
        apply: 'Work a proof or application problem',
      },
    };
  }
}

module.exports = DiscreteMath;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new DiscreteMath();
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
      default: out({ usage: 'node discrete-math.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students'] });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
