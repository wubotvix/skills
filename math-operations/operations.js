// eClaw Math Operations Interactive Tutor (K-6). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'math-operations');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'addition-foundations': ['add-within-5', 'add-within-10', 'counting-on'],
    'subtraction-foundations': ['subtract-within-5', 'subtract-within-10'],
    'composing-decomposing': ['compose-to-5', 'compose-to-10'],
  },
  'grade-1': {
    'addition-to-20': ['add-within-10-fluent', 'make-10', 'doubles', 'near-doubles', 'add-within-20'],
    'subtraction-to-20': ['subtract-within-10-fluent', 'subtract-within-20', 'think-addition'],
    'fact-families': ['fact-families-to-10', 'fact-families-to-20'],
    'missing-addend': ['missing-addend-to-10', 'missing-addend-to-20'],
  },
  'grade-2': {
    'add-multi-digit': ['add-within-100', 'add-within-1000-no-regroup', 'add-within-1000-regroup'],
    'subtract-multi-digit': ['subtract-within-100', 'subtract-within-1000-no-regroup', 'subtract-within-1000-regroup'],
    'estimation': ['estimate-sums', 'estimate-differences'],
    'intro-multiplication': ['equal-groups', 'skip-counting', 'arrays'],
  },
  'grade-3': {
    'multiplication-facts': ['multiply-by-0-1', 'multiply-by-2', 'multiply-by-5', 'multiply-by-10', 'multiply-by-3', 'multiply-by-4', 'multiply-by-6', 'multiply-by-7', 'multiply-by-8', 'multiply-by-9'],
    'division-facts': ['divide-by-1', 'divide-by-2', 'divide-by-5', 'divide-by-3-4', 'divide-by-6-7-8-9'],
    'properties': ['commutative', 'distributive'],
    'multiply-by-multiples': ['multiply-by-10-100'],
    'two-step-problems': ['two-step-add-multiply'],
  },
  'grade-4': {
    'multi-digit-multiply': ['multiply-4d-by-1d', 'multiply-2d-by-2d'],
    'multi-digit-divide': ['divide-2d-by-1d', 'divide-3d-by-1d', 'divide-4d-by-1d'],
    'remainders': ['division-with-remainders'],
    'factors-multiples': ['find-factors', 'find-multiples', 'gcf-lcm'],
  },
  'grade-5': {
    'fluent-multiply': ['multi-digit-multiplication'],
    'fluent-divide': ['multi-digit-division'],
    'decimal-operations': ['add-decimals', 'subtract-decimals', 'multiply-decimals', 'divide-decimals'],
    'order-of-operations': ['no-parens', 'with-parens', 'with-exponents'],
    'powers-of-10': ['multiply-by-powers-of-10', 'divide-by-powers-of-10'],
  },
  'grade-6': {
    'integer-operations': ['add-integers', 'subtract-integers', 'multiply-integers', 'divide-integers'],
    'fraction-operations': ['add-fractions', 'subtract-fractions', 'multiply-fractions', 'divide-fractions'],
    'decimal-fluency': ['complex-decimal-calculations'],
    'full-pemdas': ['pemdas-with-fractions', 'pemdas-with-decimals'],
    'distributive-property': ['expand-expressions', 'factor-expressions'],
  },
};

// Helpers for generating problems

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }

function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; }
function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }

function genProblems(generatorFn, count) {
  const problems = [];
  const seen = new Set();
  let attempts = 0;
  while (problems.length < count && attempts < count * 10) {
    attempts++;
    const p = generatorFn();
    const key = p.prompt;
    if (!seen.has(key)) { seen.add(key); problems.push(p); }
  }
  return problems;
}

// Problem Banks — each skill returns an array of { prompt, answer, explanation? }

const PROBLEM_BANKS = {
  'kindergarten': {
    'add-within-5': () => genProblems(() => {
      const a = randInt(0, 5), b = randInt(0, 5 - a);
      return { prompt: `${a} + ${b} = ?`, answer: a + b, explanation: `${a} and ${b} together make ${a + b}` };
    }, 20),
    'add-within-10': () => genProblems(() => {
      const a = randInt(0, 10), b = randInt(0, 10 - a);
      return { prompt: `${a} + ${b} = ?`, answer: a + b, explanation: `${a} + ${b} = ${a + b}` };
    }, 20),
    'counting-on': () => genProblems(() => {
      const a = randInt(5, 10), b = randInt(1, 3);
      const steps = Array.from({ length: b }, (_, i) => a + i + 1).join(', ');
      return { prompt: `${a} + ${b} = ? (Start at ${a} and count on ${b})`, answer: a + b, explanation: `${a}...${steps}. The answer is ${a + b}` };
    }, 20),
    'subtract-within-5': () => genProblems(() => {
      const a = randInt(1, 5), b = randInt(0, a);
      return { prompt: `${a} - ${b} = ?`, answer: a - b, explanation: `${a} take away ${b} leaves ${a - b}` };
    }, 20),
    'subtract-within-10': () => genProblems(() => {
      const a = randInt(1, 10), b = randInt(0, a);
      return { prompt: `${a} - ${b} = ?`, answer: a - b, explanation: `${a} - ${b} = ${a - b}` };
    }, 20),
    'compose-to-5': () => genProblems(() => {
      const total = randInt(2, 5), a = randInt(0, total);
      return { prompt: `${a} + ? = ${total}`, answer: total - a, explanation: `${a} + ${total - a} = ${total}` };
    }, 15),
    'compose-to-10': () => genProblems(() => {
      const total = randInt(2, 10), a = randInt(0, total);
      return { prompt: `${a} + ? = ${total}`, answer: total - a, explanation: `${a} + ${total - a} = ${total}` };
    }, 20),
  },
  'grade-1': {
    'add-within-10-fluent': () => genProblems(() => {
      const a = randInt(0, 10), b = randInt(0, 10 - a);
      return { prompt: `${a} + ${b} = ?`, answer: a + b };
    }, 20),
    'make-10': () => genProblems(() => {
      const a = randInt(6, 9), b = randInt(2, 9);
      const complement = 10 - a;
      const sum = a + b;
      return { prompt: `${a} + ${b} = ?`, answer: sum, explanation: `Make 10: ${a} + ${complement} = 10, then 10 + ${b - complement} = ${sum}` };
    }, 20),
    'doubles': () => genProblems(() => {
      const a = randInt(1, 10);
      return { prompt: `${a} + ${a} = ?`, answer: a * 2, explanation: `Double ${a} is ${a * 2}` };
    }, 10),
    'near-doubles': () => genProblems(() => {
      const a = randInt(1, 9), b = a + 1;
      return { prompt: `${a} + ${b} = ?`, answer: a + b, explanation: `${a} + ${a} = ${a * 2}, plus 1 more = ${a + b}` };
    }, 15),
    'add-within-20': () => genProblems(() => {
      const a = randInt(1, 19), b = randInt(1, 20 - a);
      return { prompt: `${a} + ${b} = ?`, answer: a + b };
    }, 20),
    'subtract-within-10-fluent': () => genProblems(() => {
      const a = randInt(1, 10), b = randInt(0, a);
      return { prompt: `${a} - ${b} = ?`, answer: a - b };
    }, 20),
    'subtract-within-20': () => genProblems(() => {
      const a = randInt(2, 20), b = randInt(1, a);
      return { prompt: `${a} - ${b} = ?`, answer: a - b };
    }, 20),
    'think-addition': () => genProblems(() => {
      const a = randInt(2, 10), b = randInt(1, 10);
      const sum = a + b;
      return { prompt: `${sum} - ${a} = ? (Think: ${a} + ? = ${sum})`, answer: b, explanation: `${a} + ${b} = ${sum}, so ${sum} - ${a} = ${b}` };
    }, 20),
    'fact-families-to-10': () => genProblems(() => {
      const a = randInt(1, 9), b = randInt(1, 10 - a), c = a + b;
      const ops = [`${a} + ${b} = ?`, `${b} + ${a} = ?`, `${c} - ${a} = ?`, `${c} - ${b} = ?`];
      const answers = [c, c, b, a];
      const i = randInt(0, 3);
      return { prompt: ops[i], answer: answers[i], explanation: `Fact family: ${a}, ${b}, ${c}` };
    }, 20),
    'fact-families-to-20': () => genProblems(() => {
      const a = randInt(1, 10), b = randInt(1, 10), c = a + b;
      const ops = [`${a} + ${b} = ?`, `${b} + ${a} = ?`, `${c} - ${a} = ?`, `${c} - ${b} = ?`];
      const answers = [c, c, b, a];
      const i = randInt(0, 3);
      return { prompt: ops[i], answer: answers[i], explanation: `Fact family: ${a}, ${b}, ${c}` };
    }, 20),
    'missing-addend-to-10': () => genProblems(() => {
      const total = randInt(2, 10), a = randInt(0, total);
      return { prompt: `${a} + ___ = ${total}`, answer: total - a };
    }, 20),
    'missing-addend-to-20': () => genProblems(() => {
      const total = randInt(5, 20), a = randInt(1, total - 1);
      return { prompt: `${a} + ___ = ${total}`, answer: total - a };
    }, 20),
  },
  'grade-2': {
    'add-within-100': () => genProblems(() => {
      const a = randInt(10, 90), b = randInt(5, 100 - a);
      return { prompt: `${a} + ${b} = ?`, answer: a + b };
    }, 20),
    'add-within-1000-no-regroup': () => genProblems(() => {
      const a1 = randInt(1, 4), a2 = randInt(0, 4), a3 = randInt(0, 4);
      const b1 = randInt(1, 9 - a1), b2 = randInt(0, 9 - a2), b3 = randInt(0, 9 - a3);
      const a = a1 * 100 + a2 * 10 + a3, b = b1 * 100 + b2 * 10 + b3;
      return { prompt: `${a} + ${b} = ?`, answer: a + b, explanation: 'No regrouping needed' };
    }, 20),
    'add-within-1000-regroup': () => genProblems(() => {
      const a = randInt(100, 700), b = randInt(100, 999 - a);
      return { prompt: `${a} + ${b} = ?`, answer: a + b };
    }, 20),
    'subtract-within-100': () => genProblems(() => {
      const a = randInt(20, 99), b = randInt(5, a);
      return { prompt: `${a} - ${b} = ?`, answer: a - b };
    }, 20),
    'subtract-within-1000-no-regroup': () => genProblems(() => {
      const a1 = randInt(3, 9), a2 = randInt(3, 9), a3 = randInt(3, 9);
      const b1 = randInt(1, a1 - 1), b2 = randInt(0, a2 - 1), b3 = randInt(0, a3 - 1);
      const a = a1 * 100 + a2 * 10 + a3, b = b1 * 100 + b2 * 10 + b3;
      return { prompt: `${a} - ${b} = ?`, answer: a - b, explanation: 'No regrouping needed' };
    }, 20),
    'subtract-within-1000-regroup': () => genProblems(() => {
      const a = randInt(200, 999), b = randInt(100, a - 1);
      return { prompt: `${a} - ${b} = ?`, answer: a - b };
    }, 20),
    'estimate-sums': () => genProblems(() => {
      const a = randInt(10, 90), b = randInt(10, 90);
      const ra = Math.round(a / 10) * 10, rb = Math.round(b / 10) * 10;
      return { prompt: `Estimate: ${a} + ${b} ≈ ? (round to nearest 10)`, answer: ra + rb, explanation: `${a} ≈ ${ra}, ${b} ≈ ${rb}, so ${ra} + ${rb} = ${ra + rb}` };
    }, 20),
    'estimate-differences': () => genProblems(() => {
      const a = randInt(30, 99), b = randInt(10, a - 5);
      const ra = Math.round(a / 10) * 10, rb = Math.round(b / 10) * 10;
      return { prompt: `Estimate: ${a} - ${b} ≈ ? (round to nearest 10)`, answer: ra - rb, explanation: `${a} ≈ ${ra}, ${b} ≈ ${rb}, so ${ra} - ${rb} = ${ra - rb}` };
    }, 20),
    'equal-groups': () => genProblems(() => {
      const groups = randInt(2, 5), per = randInt(2, 5);
      return { prompt: `${groups} groups of ${per} = ?`, answer: groups * per, explanation: `${groups} × ${per} = ${groups * per}` };
    }, 20),
    'skip-counting': () => genProblems(() => {
      const by = [2, 5, 10][randInt(0, 2)], times = randInt(3, 8);
      const seq = Array.from({ length: times }, (_, i) => by * (i + 1));
      return { prompt: `Skip count by ${by}: ${seq.slice(0, -1).join(', ')}, ___`, answer: seq[seq.length - 1], explanation: `${by} × ${times} = ${seq[seq.length - 1]}` };
    }, 20),
    'arrays': () => genProblems(() => {
      const rows = randInt(2, 5), cols = randInt(2, 5);
      return { prompt: `An array has ${rows} rows and ${cols} columns. How many total?`, answer: rows * cols, explanation: `${rows} × ${cols} = ${rows * cols}` };
    }, 20),
  },
  'grade-3': {
    'multiply-by-0-1': () => genProblems(() => {
      const f = randInt(0, 1), n = randInt(0, 10);
      return { prompt: `${n} × ${f} = ?`, answer: n * f, explanation: f === 0 ? 'Any number times 0 is 0' : 'Any number times 1 is itself' };
    }, 20),
    'multiply-by-2': () => genProblems(() => {
      const n = randInt(0, 12);
      return { prompt: `${n} × 2 = ?`, answer: n * 2, explanation: `Double ${n} is ${n * 2}` };
    }, 15),
    'multiply-by-5': () => genProblems(() => {
      const n = randInt(0, 12);
      return { prompt: `${n} × 5 = ?`, answer: n * 5, explanation: `Half of ${n} × 10 = half of ${n * 10} = ${n * 5}` };
    }, 15),
    'multiply-by-10': () => genProblems(() => {
      const n = randInt(0, 12);
      return { prompt: `${n} × 10 = ?`, answer: n * 10, explanation: `${n} with a zero: ${n * 10}` };
    }, 15),
    'multiply-by-3': () => genProblems(() => {
      const n = randInt(0, 12);
      return { prompt: `${n} × 3 = ?`, answer: n * 3, explanation: `${n} × 2 = ${n * 2}, plus one more ${n} = ${n * 3}` };
    }, 15),
    'multiply-by-4': () => genProblems(() => {
      const n = randInt(0, 12);
      return { prompt: `${n} × 4 = ?`, answer: n * 4, explanation: `Double-double: ${n} × 2 = ${n * 2}, × 2 = ${n * 4}` };
    }, 15),
    'multiply-by-6': () => genProblems(() => {
      const n = randInt(0, 12);
      return { prompt: `${n} × 6 = ?`, answer: n * 6, explanation: `${n} × 5 = ${n * 5}, plus ${n} = ${n * 6}` };
    }, 15),
    'multiply-by-7': () => genProblems(() => {
      const n = randInt(0, 12);
      return { prompt: `${n} × 7 = ?`, answer: n * 7 };
    }, 15),
    'multiply-by-8': () => genProblems(() => {
      const n = randInt(0, 12);
      return { prompt: `${n} × 8 = ?`, answer: n * 8, explanation: `Double-double-double: ${n}→${n * 2}→${n * 4}→${n * 8}` };
    }, 15),
    'multiply-by-9': () => genProblems(() => {
      const n = randInt(0, 12);
      return { prompt: `${n} × 9 = ?`, answer: n * 9, explanation: `${n} × 10 = ${n * 10}, minus ${n} = ${n * 9}` };
    }, 15),
    'divide-by-1': () => genProblems(() => {
      const n = randInt(0, 12);
      return { prompt: `${n} ÷ 1 = ?`, answer: n, explanation: 'Any number divided by 1 is itself' };
    }, 15),
    'divide-by-2': () => genProblems(() => {
      const n = randInt(1, 12), product = n * 2;
      return { prompt: `${product} ÷ 2 = ?`, answer: n, explanation: `Half of ${product} is ${n}` };
    }, 15),
    'divide-by-5': () => genProblems(() => {
      const n = randInt(1, 12), product = n * 5;
      return { prompt: `${product} ÷ 5 = ?`, answer: n, explanation: `Think: 5 × ? = ${product}. Answer: ${n}` };
    }, 15),
    'divide-by-3-4': () => genProblems(() => {
      const d = randInt(3, 4), n = randInt(1, 12), product = n * d;
      return { prompt: `${product} ÷ ${d} = ?`, answer: n, explanation: `Think: ${d} × ? = ${product}. Answer: ${n}` };
    }, 20),
    'divide-by-6-7-8-9': () => genProblems(() => {
      const d = randInt(6, 9), n = randInt(1, 12), product = n * d;
      return { prompt: `${product} ÷ ${d} = ?`, answer: n, explanation: `Think: ${d} × ? = ${product}. Answer: ${n}` };
    }, 20),
    'commutative': () => genProblems(() => {
      const a = randInt(2, 9), b = randInt(2, 9);
      return { prompt: `If ${a} × ${b} = ${a * b}, then ${b} × ${a} = ?`, answer: a * b, explanation: `Commutative property: order doesn't matter` };
    }, 15),
    'distributive': () => genProblems(() => {
      const a = randInt(2, 9), b = randInt(2, 5), c = randInt(1, 5);
      const result = a * (b + c);
      return { prompt: `${a} × ${b + c} = ${a} × ${b} + ${a} × ${c} = ${a * b} + ${a * c} = ?`, answer: result, explanation: `Distributive property: ${a} × (${b} + ${c}) = ${result}` };
    }, 15),
    'multiply-by-10-100': () => genProblems(() => {
      const n = randInt(1, 99), m = [10, 100][randInt(0, 1)];
      return { prompt: `${n} × ${m} = ?`, answer: n * m, explanation: m === 10 ? `Add one zero: ${n * m}` : `Add two zeros: ${n * m}` };
    }, 20),
    'two-step-add-multiply': () => genProblems(() => {
      const a = randInt(2, 5), b = randInt(2, 5), c = randInt(1, 10);
      const result = a * b + c;
      return { prompt: `${a} × ${b} + ${c} = ?`, answer: result, explanation: `First: ${a} × ${b} = ${a * b}. Then: ${a * b} + ${c} = ${result}` };
    }, 20),
  },
  'grade-4': {
    'multiply-4d-by-1d': () => genProblems(() => {
      const a = randInt(1000, 9999), b = randInt(2, 9);
      return { prompt: `${a} × ${b} = ?`, answer: a * b };
    }, 20),
    'multiply-2d-by-2d': () => genProblems(() => {
      const a = randInt(11, 99), b = randInt(11, 99);
      return { prompt: `${a} × ${b} = ?`, answer: a * b };
    }, 20),
    'divide-2d-by-1d': () => genProblems(() => {
      const d = randInt(2, 9), q = randInt(2, 11), n = d * q;
      return { prompt: `${n} ÷ ${d} = ?`, answer: q };
    }, 20),
    'divide-3d-by-1d': () => genProblems(() => {
      const d = randInt(2, 9), q = randInt(11, 110), n = d * q;
      return { prompt: `${n} ÷ ${d} = ?`, answer: q };
    }, 20),
    'divide-4d-by-1d': () => genProblems(() => {
      const d = randInt(2, 9), q = randInt(100, 1100), n = d * q;
      return { prompt: `${n} ÷ ${d} = ?`, answer: q };
    }, 20),
    'division-with-remainders': () => genProblems(() => {
      const d = randInt(2, 9), q = randInt(3, 30), r = randInt(1, d - 1), n = d * q + r;
      return { prompt: `${n} ÷ ${d} = ? R ?`, answer: `${q} R ${r}`, answerNum: q, remainder: r, explanation: `${d} × ${q} = ${d * q}, remainder ${r}` };
    }, 20),
    'find-factors': () => genProblems(() => {
      const n = [12, 16, 18, 20, 24, 28, 30, 36, 40, 42, 48, 50, 56, 60, 72][randInt(0, 14)];
      const factors = [];
      for (let i = 1; i <= n; i++) { if (n % i === 0) factors.push(i); }
      return { prompt: `List all factors of ${n}`, answer: factors.join(', '), factors, explanation: `Factors come in pairs: ${factors.filter(f => f * f <= n).map(f => `${f}×${n / f}`).join(', ')}` };
    }, 15),
    'find-multiples': () => genProblems(() => {
      const n = randInt(2, 12), count = 5;
      const multiples = Array.from({ length: count }, (_, i) => n * (i + 1));
      return { prompt: `List the first 5 multiples of ${n}`, answer: multiples.join(', '), multiples };
    }, 15),
    'gcf-lcm': () => genProblems(() => {
      const a = randInt(4, 20), b = randInt(4, 20);
      const g = gcd(a, b), l = lcm(a, b);
      const type = randInt(0, 1);
      return type === 0
        ? { prompt: `GCF of ${a} and ${b} = ?`, answer: g, explanation: `Greatest common factor of ${a} and ${b} is ${g}` }
        : { prompt: `LCM of ${a} and ${b} = ?`, answer: l, explanation: `Least common multiple of ${a} and ${b} is ${l}` };
    }, 20),
  },
  'grade-5': {
    'multi-digit-multiplication': () => genProblems(() => {
      const a = randInt(100, 999), b = randInt(10, 99);
      return { prompt: `${a} × ${b} = ?`, answer: a * b };
    }, 20),
    'multi-digit-division': () => genProblems(() => {
      const d = randInt(11, 50), q = randInt(10, 200), n = d * q;
      return { prompt: `${n} ÷ ${d} = ?`, answer: q };
    }, 20),
    'add-decimals': () => genProblems(() => {
      const a = (randInt(10, 999) / 10), b = (randInt(10, 999) / 10);
      const sum = Math.round((a + b) * 100) / 100;
      return { prompt: `${a.toFixed(1)} + ${b.toFixed(1)} = ?`, answer: sum };
    }, 20),
    'subtract-decimals': () => genProblems(() => {
      const a = (randInt(100, 999) / 10), b = (randInt(10, Math.floor(a * 10)) / 10);
      const diff = Math.round((a - b) * 100) / 100;
      return { prompt: `${a.toFixed(1)} - ${b.toFixed(1)} = ?`, answer: diff };
    }, 20),
    'multiply-decimals': () => genProblems(() => {
      const a = (randInt(11, 99) / 10), b = randInt(2, 9);
      const product = Math.round(a * b * 10) / 10;
      return { prompt: `${a.toFixed(1)} × ${b} = ?`, answer: product };
    }, 20),
    'divide-decimals': () => genProblems(() => {
      const d = randInt(2, 9), q = (randInt(11, 99) / 10), n = Math.round(d * q * 10) / 10;
      return { prompt: `${n} ÷ ${d} = ?`, answer: q };
    }, 20),
    'no-parens': () => genProblems(() => {
      const a = randInt(2, 10), b = randInt(2, 5), c = randInt(1, 10);
      const type = randInt(0, 1);
      if (type === 0) {
        const result = a + b * c;
        return { prompt: `${a} + ${b} × ${c} = ?`, answer: result, explanation: `Multiply first: ${b} × ${c} = ${b * c}, then add: ${a} + ${b * c} = ${result}` };
      }
      const result = a * b - c;
      return { prompt: `${a} × ${b} - ${c} = ?`, answer: result, explanation: `Multiply first: ${a} × ${b} = ${a * b}, then subtract: ${a * b} - ${c} = ${result}` };
    }, 20),
    'with-parens': () => genProblems(() => {
      const a = randInt(2, 10), b = randInt(1, 8), c = randInt(1, 5);
      const result = (a + b) * c;
      return { prompt: `(${a} + ${b}) × ${c} = ?`, answer: result, explanation: `Parentheses first: ${a} + ${b} = ${a + b}, then multiply: ${a + b} × ${c} = ${result}` };
    }, 20),
    'with-exponents': () => genProblems(() => {
      const base = randInt(2, 6), exp = randInt(2, 3), c = randInt(1, 10);
      const powered = Math.pow(base, exp);
      const type = randInt(0, 1);
      if (type === 0) {
        return { prompt: `${base}^${exp} + ${c} = ?`, answer: powered + c, explanation: `${base}^${exp} = ${powered}, then ${powered} + ${c} = ${powered + c}` };
      }
      return { prompt: `${c} × ${base}^${exp} = ?`, answer: c * powered, explanation: `${base}^${exp} = ${powered}, then ${c} × ${powered} = ${c * powered}` };
    }, 20),
    'multiply-by-powers-of-10': () => genProblems(() => {
      const n = (randInt(1, 999) / 10), p = [10, 100, 1000][randInt(0, 2)];
      const result = Math.round(n * p * 100) / 100;
      return { prompt: `${n} × ${p} = ?`, answer: result, explanation: `Move decimal point ${String(p).length - 1} place(s) right` };
    }, 20),
    'divide-by-powers-of-10': () => genProblems(() => {
      const n = randInt(10, 9999), p = [10, 100, 1000][randInt(0, 2)];
      const result = Math.round(n / p * 1000) / 1000;
      return { prompt: `${n} ÷ ${p} = ?`, answer: result, explanation: `Move decimal point ${String(p).length - 1} place(s) left` };
    }, 20),
  },
  'grade-6': {
    'add-integers': () => genProblems(() => {
      const a = randInt(-20, 20), b = randInt(-20, 20);
      const sign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
      return { prompt: `${a} ${sign} = ?`, answer: a + b };
    }, 20),
    'subtract-integers': () => genProblems(() => {
      const a = randInt(-20, 20), b = randInt(-20, 20);
      const sign = b >= 0 ? `- ${b}` : `- (${b})`;
      return { prompt: `${a} ${sign} = ?`, answer: a - b, explanation: `${a} - ${b} = ${a} + ${-b} = ${a - b}` };
    }, 20),
    'multiply-integers': () => genProblems(() => {
      const a = randInt(-12, 12), b = randInt(-12, 12);
      return { prompt: `${a < 0 ? `(${a})` : a} × ${b < 0 ? `(${b})` : b} = ?`, answer: a * b, explanation: a * b >= 0 ? 'Same signs → positive' : 'Different signs → negative' };
    }, 20),
    'divide-integers': () => genProblems(() => {
      const d = randInt(1, 12) * (randInt(0, 1) ? 1 : -1), q = randInt(1, 12) * (randInt(0, 1) ? 1 : -1);
      const n = d * q;
      return { prompt: `${n < 0 ? `(${n})` : n} ÷ ${d < 0 ? `(${d})` : d} = ?`, answer: q, explanation: q >= 0 ? 'Same signs → positive' : 'Different signs → negative' };
    }, 20),
    'add-fractions': () => genProblems(() => {
      const d1 = randInt(2, 6), d2 = randInt(2, 6);
      const n1 = randInt(1, d1 - 1), n2 = randInt(1, d2 - 1);
      const cd = lcm(d1, d2);
      const num = n1 * (cd / d1) + n2 * (cd / d2);
      const g = gcd(Math.abs(num), cd);
      const rn = num / g, rd = cd / g;
      const ans = rn >= rd ? (rn % rd === 0 ? `${rn / rd}` : `${Math.floor(rn / rd)} ${rn % rd}/${rd}`) : `${rn}/${rd}`;
      return { prompt: `${n1}/${d1} + ${n2}/${d2} = ?`, answer: ans, answerNumerator: rn, answerDenominator: rd };
    }, 20),
    'subtract-fractions': () => genProblems(() => {
      const d1 = randInt(2, 6), d2 = randInt(2, 6);
      let n1 = randInt(1, d1 - 1), n2 = randInt(1, d2 - 1);
      const cd = lcm(d1, d2);
      let num = n1 * (cd / d1) - n2 * (cd / d2);
      if (num < 0) { [n1, n2] = [n2, n1]; num = -num; }
      if (num === 0) { n1 = n2 + 1; num = n1 * (cd / d1) - n2 * (cd / d2); }
      const g = gcd(num, cd);
      const rn = num / g, rd = cd / g;
      const ans = rd === 1 ? `${rn}` : `${rn}/${rd}`;
      return { prompt: `${n1}/${d1} - ${n2}/${d2} = ?`, answer: ans };
    }, 20),
    'multiply-fractions': () => genProblems(() => {
      const n1 = randInt(1, 7), d1 = randInt(2, 8), n2 = randInt(1, 7), d2 = randInt(2, 8);
      const rn = n1 * n2, rd = d1 * d2;
      const g = gcd(rn, rd);
      const sn = rn / g, sd = rd / g;
      const ans = sd === 1 ? `${sn}` : (sn > sd ? `${Math.floor(sn / sd)} ${sn % sd}/${sd}` : `${sn}/${sd}`);
      return { prompt: `${n1}/${d1} × ${n2}/${d2} = ?`, answer: ans, explanation: `Multiply straight across: ${rn}/${rd} = ${ans}` };
    }, 20),
    'divide-fractions': () => genProblems(() => {
      const n1 = randInt(1, 6), d1 = randInt(2, 6), n2 = randInt(1, 6), d2 = randInt(2, 6);
      const rn = n1 * d2, rd = d1 * n2;
      const g = gcd(rn, rd);
      const sn = rn / g, sd = rd / g;
      const ans = sd === 1 ? `${sn}` : (sn > sd ? `${Math.floor(sn / sd)} ${sn % sd}/${sd}` : `${sn}/${sd}`);
      return { prompt: `${n1}/${d1} ÷ ${n2}/${d2} = ?`, answer: ans, explanation: `Flip and multiply: ${n1}/${d1} × ${d2}/${n2} = ${rn}/${rd} = ${ans}` };
    }, 20),
    'complex-decimal-calculations': () => genProblems(() => {
      const a = Math.round(randInt(10, 99) * 10) / 100;
      const b = Math.round(randInt(10, 99) * 10) / 100;
      const op = ['+', '-', '×'][randInt(0, 2)];
      let result;
      if (op === '+') result = Math.round((a + b) * 100) / 100;
      else if (op === '-') { const [x, y] = a >= b ? [a, b] : [b, a]; result = Math.round((x - y) * 100) / 100; return { prompt: `${x.toFixed(2)} - ${y.toFixed(2)} = ?`, answer: result }; }
      else result = Math.round(a * b * 100) / 100;
      return { prompt: `${a.toFixed(2)} ${op} ${b.toFixed(2)} = ?`, answer: result };
    }, 20),
    'pemdas-with-fractions': () => genProblems(() => {
      const a = randInt(1, 5), b = randInt(1, 5), d = randInt(2, 5);
      const n = randInt(1, d - 1);
      const result = a + b * n;
      return { prompt: `${a} + ${b} × ${n} = ?`, answer: result, explanation: `Multiply first: ${b} × ${n} = ${b * n}, then add: ${a} + ${b * n} = ${result}` };
    }, 20),
    'pemdas-with-decimals': () => genProblems(() => {
      const a = randInt(1, 10), b = randInt(1, 5), c = randInt(1, 10);
      const result = (a + b) * c;
      return { prompt: `(${a} + ${b}) × ${c} = ?`, answer: result, explanation: `Parentheses first: ${a + b}, then multiply: ${a + b} × ${c} = ${result}` };
    }, 20),
    'expand-expressions': () => genProblems(() => {
      const a = randInt(2, 9), b = randInt(1, 10), c = randInt(1, 10);
      const result = a * b + a * c;
      return { prompt: `${a}(${b} + ${c}) = ?`, answer: result, explanation: `${a} × ${b} + ${a} × ${c} = ${a * b} + ${a * c} = ${result}` };
    }, 20),
    'factor-expressions': () => genProblems(() => {
      const a = randInt(2, 6), b = randInt(1, 8), c = randInt(1, 8);
      const ab = a * b, ac = a * c;
      return { prompt: `${ab} + ${ac} = ${a}(? + ?)`, answer: `${a}(${b} + ${c})`, factor: a, terms: [b, c], explanation: `Factor out ${a}: ${a} × ${b} + ${a} × ${c}` };
    }, 20),
  },
};

const WORD_PROBLEMS = {
  'kindergarten': [
    { title: 'Apples', focus: 'addition to 10', text: 'You have 3 apples. Your friend gives you 4 more. How many apples do you have now?', answer: 7 },
    { title: 'Cookies', focus: 'subtraction to 10', text: 'There are 8 cookies on a plate. You eat 3. How many cookies are left?', answer: 5 },
    { title: 'Toys', focus: 'addition to 10', text: '2 toy cars are on the floor. 5 more fall out of the box. How many toy cars are there?', answer: 7 },
    { title: 'Birds', focus: 'subtraction to 10', text: '6 birds sit on a branch. 2 fly away. How many birds are still on the branch?', answer: 4 },
    { title: 'Blocks', focus: 'composing', text: 'You need 10 blocks to build a tower. You have 6. How many more do you need?', answer: 4 },
  ],
  'grade-1': [
    { title: 'Stickers', focus: 'addition within 20', text: 'Maria has 8 stickers. She gets 7 more for good work. How many stickers does she have?', answer: 15 },
    { title: 'Crayons', focus: 'subtraction within 20', text: 'A box has 16 crayons. 9 are broken. How many good crayons are there?', answer: 7 },
    { title: 'Books', focus: 'missing addend', text: 'The shelf holds 12 books. There are 5 books on it now. How many more books can fit?', answer: 7 },
    { title: 'Marbles', focus: 'fact families', text: 'Tom has 6 red marbles and 8 blue marbles. How many marbles in all? How many more blue than red?', answer: 14 },
  ],
  'grade-2': [
    { title: 'Field Trip', focus: 'multi-digit addition', text: 'Bus A has 47 students. Bus B has 35 students. How many students are going on the field trip?', answer: 82 },
    { title: 'Savings', focus: 'multi-digit subtraction', text: 'Li had 523 pennies. She spent 248 on a toy. How many pennies does she have left?', answer: 275 },
    { title: 'Muffins', focus: 'equal groups', text: 'Mom bakes muffins in trays of 6. She fills 4 trays. How many muffins did she bake?', answer: 24 },
    { title: 'Estimation', focus: 'estimation', text: 'About how many pages have you read if you read 48 pages Monday and 33 pages Tuesday? (Round to nearest 10.)', answer: 80 },
  ],
  'grade-3': [
    { title: 'Desks', focus: 'multiplication', text: 'There are 7 rows of desks with 6 desks in each row. How many desks are there?', answer: 42 },
    { title: 'Sharing', focus: 'division', text: '45 stickers are shared equally among 5 friends. How many does each friend get?', answer: 9 },
    { title: 'Party', focus: 'two-step', text: 'Each table at the party seats 4 people. There are 8 tables. 5 extra chairs are added. How many seats in all?', answer: 37 },
    { title: 'Multiply by 10', focus: 'multiply by multiples', text: 'A school has 10 classrooms with 23 students each. How many students in the school?', answer: 230 },
  ],
  'grade-4': [
    { title: 'Auditorium', focus: 'multi-digit multiplication', text: 'The auditorium has 28 rows with 34 seats each. How many seats are there?', answer: 952 },
    { title: 'Equal Groups', focus: 'multi-digit division', text: '756 books are packed equally into 6 boxes. How many books in each box?', answer: 126 },
    { title: 'Remainders', focus: 'division with remainders', text: '155 students need to be put in groups of 8. How many groups, and how many students are left over?', answer: '19 R 3' },
    { title: 'Factors', focus: 'factors', text: 'What are all the factor pairs of 36?', answer: '1×36, 2×18, 3×12, 4×9, 6×6' },
  ],
  'grade-5': [
    { title: 'Shopping', focus: 'decimal operations', text: 'A book costs $12.75 and a pen costs $3.49. How much for both?', answer: 16.24 },
    { title: 'Order of Ops', focus: 'order of operations', text: 'Evaluate: 3 + 4 × 5 - 2', answer: 21 },
    { title: 'Powers', focus: 'powers of 10', text: 'A factory makes 245 widgets per hour. How many in 100 hours?', answer: 24500 },
    { title: 'Division', focus: 'multi-digit division', text: '2,592 marbles are divided equally into 36 bags. How many per bag?', answer: 72 },
  ],
  'grade-6': [
    { title: 'Temperature', focus: 'integer operations', text: 'The temperature was -5°F in the morning and rose 18 degrees by noon. What is the noon temperature?', answer: 13 },
    { title: 'Recipe', focus: 'fraction operations', text: 'A recipe calls for 2/3 cup of flour. You want to make 3/4 of the recipe. How much flour do you need?', answer: '1/2' },
    { title: 'PEMDAS', focus: 'order of operations', text: 'Evaluate: 2 × (3 + 5)^2 ÷ 4', answer: 32 },
    { title: 'Distributive', focus: 'distributive property', text: 'Use the distributive property to compute 7 × 98.', answer: 686 },
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
  return { studentId: id, grade: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
}

function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }

// Helpers

function calcMastery(attempts) {
  if (!attempts || !attempts.length) return 0;
  const recent = attempts.slice(-5).filter(a => a.total > 0);
  return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0;
}

function masteryLabel(r) { return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started'; }

function resolveSkillKey(grade, skill) {
  const gs = SKILLS[grade];
  if (!gs) return null;
  for (const [cat, skills] of Object.entries(gs)) { if (skills.includes(skill)) return { grade, category: cat, skill }; }
  return null;
}

function norm(s) { return String(s).toLowerCase().trim().replace(/\s+/g, ' '); }

// Exercise generation

function exResult(type, skill, grade, instruction, items) { return { type, skill, grade, count: items.length, instruction, items }; }

function generateExercise(grade, skill, count = 5) {
  const gradeBank = PROBLEM_BANKS[grade];
  if (!gradeBank) return { error: `No problem bank for grade ${grade}` };
  const generator = gradeBank[skill];
  if (!generator) return { error: `No problem bank for ${grade}/${skill}` };

  const allProblems = generator();
  const items = pick(allProblems, count);

  // Determine exercise type based on skill characteristics
  let type = 'compute';
  let instruction = 'Solve each problem.';

  if (skill.includes('compose') || skill.includes('missing-addend')) {
    type = 'missing-number';
    instruction = 'Find the missing number.';
  } else if (skill.includes('fact-families')) {
    type = 'fact-family';
    instruction = 'Solve using fact families.';
  } else if (skill.includes('estimate')) {
    type = 'estimate';
    instruction = 'Estimate by rounding to the nearest 10, then compute.';
  } else if (skill.includes('equal-groups') || skill.includes('arrays')) {
    type = 'visual-multiply';
    instruction = 'Find the total. Think about equal groups or arrays.';
  } else if (skill.includes('skip-counting')) {
    type = 'skip-count';
    instruction = 'Continue the skip-counting pattern.';
  } else if (skill.includes('commutative') || skill.includes('distributive') || skill.includes('properties')) {
    type = 'property';
    instruction = 'Use the property to solve.';
  } else if (skill.includes('find-factors')) {
    type = 'factors';
    instruction = 'List all factors of the number.';
  } else if (skill.includes('find-multiples')) {
    type = 'multiples';
    instruction = 'List the first 5 multiples.';
  } else if (skill.includes('gcf') || skill.includes('lcm')) {
    type = 'gcf-lcm';
    instruction = 'Find the GCF or LCM.';
  } else if (skill.includes('pemdas') || skill.includes('order') || skill.includes('no-parens') || skill.includes('with-parens') || skill.includes('with-exponents')) {
    type = 'order-of-operations';
    instruction = 'Use order of operations (PEMDAS) to solve.';
  } else if (skill.includes('remainder')) {
    type = 'division-remainder';
    instruction = 'Divide and give the quotient and remainder.';
  } else if (skill.includes('fraction')) {
    type = 'fraction';
    instruction = 'Compute. Simplify your answer.';
  } else if (skill.includes('integer')) {
    type = 'integer';
    instruction = 'Compute. Watch the signs!';
  } else if (skill.includes('expand') || skill.includes('factor-expressions')) {
    type = 'distributive';
    instruction = 'Use the distributive property.';
  } else if (skill.includes('decimal') || skill.includes('powers-of-10')) {
    type = 'decimal';
    instruction = 'Compute carefully with decimals.';
  }

  return exResult(type, skill, grade, instruction, items);
}

// Answer checking

function checkAnswer(type, expected, answer) {
  const ne = norm(String(expected));
  const na = norm(String(answer));
  if (ne === na) return true;
  // Numeric comparison for rounding differences
  const numE = parseFloat(String(expected));
  const numA = parseFloat(String(answer));
  if (!isNaN(numE) && !isNaN(numA) && Math.abs(numE - numA) < 0.001) return true;
  // Fraction normalization: handle "1/2" vs "1 / 2" etc.
  if (ne.replace(/ /g, '') === na.replace(/ /g, '')) return true;
  return false;
}

// Public API

class Operations {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, grade: p.grade, createdAt: p.createdAt, totalAssessments: p.assessments.length };
  }

  setGrade(id, grade) {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    const p = loadProfile(id); p.grade = grade; saveProfile(p);
    return { studentId: id, grade };
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
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const gs = SKILLS[grade] || {};
    const results = {};
    let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(gs)) {
      results[cat] = {};
      for (const sk of skills) {
        total++;
        const d = p.skills[`${grade}/${cat}/${sk}`];
        results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
      }
    }
    return { studentId: id, grade, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS[grade] || {})) {
      for (const sk of skills) {
        const d = p.skills[`${grade}/${cat}/${sk}`];
        const m = d ? d.mastery : 0;
        if (m < MASTERY_THRESHOLD) candidates.push({ grade, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' });
      }
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, grade, next: candidates.slice(0, count) };
  }

  getReport(id) {
    const p = loadProfile(id);
    return { studentId: id, grade: p.grade, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }

  getSkillCatalog(grade) {
    const gs = SKILLS[grade];
    if (!gs) return { grade, error: `Unknown grade. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0;
    const catalog = {};
    for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; }
    return { grade, skills: catalog, totalSkills: total };
  }

  generateExercise(grade, skill, count = 5) { return generateExercise(grade, skill, count); }

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  getWordProblem(grade) {
    const problems = WORD_PROBLEMS[grade];
    if (!problems) return { error: `No word problems for ${grade}. Available: ${Object.keys(WORD_PROBLEMS).join(', ')}` };
    return pick(problems, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const wordProblem = WORD_PROBLEMS[grade] ? pick(WORD_PROBLEMS[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, wordProblem,
      lessonPlan: {
        warmup: 'Review previously learned facts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: wordProblem ? `Word problem: "${wordProblem.title}"` : 'Apply skill to a real-world scenario',
        reflect: 'What strategy did you use? How did you figure it out?',
      },
    };
  }
}

module.exports = Operations;

// CLI: node operations.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const ops = new Operations();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) ops.setGrade(id, grade);
        out({ action: 'start', profile: ops.getProfile(id), nextSkills: ops.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(ops.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, type] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'kindergarten';
        if (type) { out(ops.generateExercise(grade, type, 5)); }
        else { const n = ops.getNextSkills(id, 1).next; out(n.length ? ops.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current grade!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(ops.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(ops.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(ops.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(ops.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(ops.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? ops.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(ops.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(ops.setGrade(id, g)); break; }
      case 'word': { const [, g] = args; if (!g) throw new Error('Usage: word <grade>'); out(ops.getWordProblem(g)); break; }
      default: out({ usage: 'node operations.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-grade', 'word'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
