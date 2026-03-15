// eClaw MS Math Ratios & Proportions Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-math-ratios-proportions');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'ratio-concepts': ['ratio-language', 'equivalent-ratios', 'ratio-tables'],
    'unit-rates': ['finding-unit-rates', 'comparing-unit-rates'],
    'percents': ['percent-of-number', 'percent-as-rate'],
    'conversions': ['unit-conversions'],
  },
  'grade-7': {
    'advanced-rates': ['unit-rates-with-fractions', 'complex-unit-rates'],
    'proportional-relationships': ['recognizing-proportional', 'constant-of-proportionality', 'proportional-equations'],
    'percent-applications': ['percent-increase-decrease', 'tax-tip-discount', 'simple-interest', 'markup-markdown'],
  },
  'grade-8': {
    'slope-as-rate': ['slope-from-graph', 'slope-from-table', 'slope-from-points'],
    'proportional-graphing': ['graphing-proportional', 'comparing-proportional'],
    'linear-connections': ['similar-triangles-slope', 'deriving-y-equals-mx'],
  },
};

const PROBLEM_BANKS = {
  'grade-6': {
    'ratio-language': {
      problems: [
        { prompt: 'There are 12 boys and 18 girls. Write the ratio of boys to girls in simplest form.', answer: '2:3' },
        { prompt: 'A bag has 5 red and 8 blue marbles. What is the ratio of red to total?', answer: '5:13' },
        { prompt: 'Write "4 to 7" in colon notation.', answer: '4:7' },
        { prompt: 'A recipe uses 3 cups flour for 2 cups sugar. Ratio of flour to sugar?', answer: '3:2' },
        { prompt: 'Simplify the ratio 15:25', answer: '3:5' },
        { prompt: 'There are 6 cats and 10 dogs. Write the ratio of cats to dogs in simplest form.', answer: '3:5' },
        { prompt: 'Simplify the ratio 24:36', answer: '2:3' },
        { prompt: 'A class has 14 boys and 16 girls. Ratio of boys to total students?', answer: '7:15' },
      ],
    },
    'equivalent-ratios': {
      problems: [
        { prompt: 'Is 6:8 equivalent to 3:4?', answer: 'yes' },
        { prompt: 'Find the missing value: 2:5 = ?:15', answer: '6', numeric: 6 },
        { prompt: 'Find the missing value: 3:7 = 9:?', answer: '21', numeric: 21 },
        { prompt: 'Which is equivalent to 4:6? A) 8:10 B) 6:9 C) 2:4', answer: 'B' },
        { prompt: 'Find the missing value: 5:8 = 20:?', answer: '32', numeric: 32 },
        { prompt: 'Is 10:15 equivalent to 4:6?', answer: 'yes', hint: 'Both simplify to 2:3' },
        { prompt: 'Find the missing value: 7:3 = ?:12', answer: '28', numeric: 28 },
        { prompt: 'Find the missing value: ?:9 = 4:3', answer: '12', numeric: 12 },
      ],
    },
    'ratio-tables': {
      problems: [
        { prompt: 'Complete the ratio table for 2:5 → 4:?, 6:?, 8:?', answer: '10, 15, 20' },
        { prompt: 'A recipe uses 3 eggs per 2 cups flour. How many eggs for 10 cups?', answer: '15', numeric: 15 },
        { prompt: 'Miles:Hours = 60:1. How many miles in 4.5 hours?', answer: '270', numeric: 270 },
        { prompt: 'Red:Blue = 2:7. If there are 14 blue, how many red?', answer: '4', numeric: 4 },
        { prompt: 'Apples:Oranges = 3:4. If there are 21 apples, how many oranges?', answer: '28', numeric: 28 },
        { prompt: 'Water:Juice = 5:2. How much water for 8 cups juice?', answer: '20', numeric: 20 },
      ],
    },
    'finding-unit-rates': {
      problems: [
        { prompt: '$12 for 4 pounds. What is the unit price per pound?', answer: '$3', numeric: 3 },
        { prompt: '150 miles in 3 hours. What is the speed in mph?', answer: '50', numeric: 50 },
        { prompt: '240 words in 4 minutes. Words per minute?', answer: '60', numeric: 60 },
        { prompt: '$8.40 for 6 bottles. Price per bottle?', answer: '$1.40', numeric: 1.4 },
        { prompt: '35 problems in 7 minutes. Problems per minute?', answer: '5', numeric: 5 },
        { prompt: '$45 for 5 hours of work. Hourly rate?', answer: '$9', numeric: 9 },
        { prompt: '84 heartbeats in 60 seconds. Beats per second?', answer: '1.4', numeric: 1.4 },
        { prompt: '180 pages in 6 days. Pages per day?', answer: '30', numeric: 30 },
      ],
    },
    'comparing-unit-rates': {
      problems: [
        { prompt: 'Store A: 6 apples for $3. Store B: 10 apples for $4. Which is cheaper per apple?', answer: 'Store B', hint: 'A: $0.50/apple, B: $0.40/apple' },
        { prompt: 'Car A: 280 miles on 8 gal. Car B: 350 miles on 10 gal. Which gets better mileage?', answer: 'They are equal', hint: 'A: 35 mpg, B: 35 mpg — they are equal!' },
        { prompt: 'Runner A: 5 miles in 40 min. Runner B: 3 miles in 21 min. Who is faster?', answer: 'Runner B', hint: 'A: 8 min/mile, B: 7 min/mile' },
        { prompt: 'Pack A: 12 oz for $2.40. Pack B: 18 oz for $3.24. Which is the better buy?', answer: 'Pack B', hint: 'A: $0.20/oz, B: $0.18/oz' },
        { prompt: 'Painter A: 3 rooms in 9 hours. Painter B: 5 rooms in 12.5 hours. Who is faster?', answer: 'Painter B', hint: 'A: 3hr/room, B: 2.5hr/room' },
        { prompt: 'Plan A: $30 for 5 GB. Plan B: $48 for 10 GB. Which costs less per GB?', answer: 'Plan B', hint: 'A: $6/GB, B: $4.80/GB' },
      ],
    },
    'percent-of-number': {
      problems: [
        { prompt: 'What is 25% of 80?', answer: '20', numeric: 20 },
        { prompt: 'What is 10% of 350?', answer: '35', numeric: 35 },
        { prompt: 'What is 75% of 60?', answer: '45', numeric: 45 },
        { prompt: 'What is 40% of 150?', answer: '60', numeric: 60 },
        { prompt: '15 is what percent of 60?', answer: '25%' },
        { prompt: '36 is what percent of 90?', answer: '40%' },
        { prompt: '18 is 30% of what number?', answer: '60', numeric: 60 },
        { prompt: 'What is 5% of 200?', answer: '10', numeric: 10 },
      ],
    },
    'percent-as-rate': {
      problems: [
        { prompt: 'Express 3/4 as a percent.', answer: '75%' },
        { prompt: 'Express 45% as a fraction in simplest form.', answer: '9/20' },
        { prompt: 'Express 0.08 as a percent.', answer: '8%' },
        { prompt: 'Express 125% as a decimal.', answer: '1.25', numeric: 1.25 },
        { prompt: 'Express 7/10 as a percent.', answer: '70%' },
        { prompt: 'Express 2/5 as a percent.', answer: '40%' },
      ],
    },
    'unit-conversions': {
      problems: [
        { prompt: 'Convert 3 feet to inches. (1 ft = 12 in)', answer: '36', numeric: 36 },
        { prompt: 'Convert 5000 meters to kilometers. (1 km = 1000 m)', answer: '5', numeric: 5 },
        { prompt: 'Convert 2.5 hours to minutes.', answer: '150', numeric: 150 },
        { prompt: 'Convert 48 ounces to pounds. (1 lb = 16 oz)', answer: '3', numeric: 3 },
        { prompt: 'Convert 7 yards to feet. (1 yd = 3 ft)', answer: '21', numeric: 21 },
        { prompt: 'Convert 3600 seconds to hours.', answer: '1', numeric: 1 },
      ],
    },
  },
  'grade-7': {
    'unit-rates-with-fractions': {
      problems: [
        { prompt: 'A recipe uses 3/4 cup sugar for 1/2 batch. How much for 1 batch?', answer: '3/2', hint: '3/4 ÷ 1/2 = 3/2 cups' },
        { prompt: 'You walk 2/3 mile in 1/4 hour. What is your speed in mph?', answer: '8/3', hint: '2/3 ÷ 1/4 = 8/3 mph ≈ 2.67 mph' },
        { prompt: 'A painter covers 3/5 wall in 2/3 hour. Walls per hour?', answer: '9/10', hint: '3/5 ÷ 2/3 = 9/10' },
        { prompt: '$4.50 for 3/4 pound. Price per pound?', answer: '$6', numeric: 6, hint: '4.50 ÷ 0.75 = 6' },
        { prompt: '5/8 mile in 1/2 hour. Speed in mph?', answer: '5/4', hint: '5/8 ÷ 1/2 = 5/4 = 1.25 mph' },
        { prompt: '2/3 gallon for 1/6 of a lawn. Gallons per whole lawn?', answer: '4', numeric: 4, hint: '2/3 ÷ 1/6 = 4' },
      ],
    },
    'complex-unit-rates': {
      problems: [
        { prompt: 'A car uses 3.5 gallons for 91 miles. Miles per gallon?', answer: '26', numeric: 26 },
        { prompt: '12.6 km in 1.4 hours. Speed in km/h?', answer: '9', numeric: 9 },
        { prompt: '$15.75 for 2.25 pounds. Price per pound?', answer: '$7', numeric: 7 },
        { prompt: '4.8 liters of paint covers 24 m². Liters per m²?', answer: '0.2', numeric: 0.2 },
        { prompt: '168 words typed in 3.5 minutes. Words per minute?', answer: '48', numeric: 48 },
        { prompt: '2.4 kg of grapes costs $7.20. Price per kg?', answer: '$3', numeric: 3 },
      ],
    },
    'recognizing-proportional': {
      problems: [
        { prompt: 'Table: (1,3), (2,6), (3,9), (4,12). Is this proportional?', answer: 'yes', hint: 'y/x = 3 for all rows' },
        { prompt: 'Table: (1,5), (2,8), (3,11), (4,14). Is this proportional?', answer: 'no', hint: 'y/x varies: 5, 4, 3.67, 3.5' },
        { prompt: 'y = 4x. Is this proportional?', answer: 'yes', hint: 'Form y=kx with k=4' },
        { prompt: 'y = 2x + 3. Is this proportional?', answer: 'no', hint: 'Has +3; does not pass through origin' },
        { prompt: 'A graph is a straight line through the origin. Proportional?', answer: 'yes' },
        { prompt: 'Cost = $5/hour + $10 fee. Is cost proportional to hours?', answer: 'no', hint: 'Fixed fee means not proportional' },
      ],
    },
    'constant-of-proportionality': {
      problems: [
        { prompt: 'y = 7x. What is the constant of proportionality?', answer: '7', numeric: 7 },
        { prompt: 'Table: (2,10), (3,15), (5,25). Find k.', answer: '5', numeric: 5, hint: '10/2 = 5' },
        { prompt: '$4.50 per pound. What is k?', answer: '4.5', numeric: 4.5 },
        { prompt: 'Graph passes through (1, 3.5). What is k?', answer: '3.5', numeric: 3.5 },
        { prompt: 'Table: (4,12), (6,18), (10,30). Find k.', answer: '3', numeric: 3 },
        { prompt: 'A car travels 55 miles per hour. What is k in d = kt?', answer: '55', numeric: 55 },
      ],
    },
    'proportional-equations': {
      problems: [
        { prompt: 'k = 6. Write the proportional equation.', answer: 'y = 6x' },
        { prompt: 'A phone plan charges $0.05 per text. Write an equation for cost c and texts t.', answer: 'c = 0.05t' },
        { prompt: 'If y = 3x, find y when x = 14.', answer: '42', numeric: 42 },
        { prompt: 'If y = 8x, find x when y = 56.', answer: '7', numeric: 7 },
        { prompt: 'Bananas cost $0.60 each. Write equation and find cost of 15.', answer: '$9', numeric: 9, hint: 'c = 0.60n; c = 0.60(15) = 9' },
        { prompt: 'Distance = 45 × time. How far in 3.5 hours?', answer: '157.5', numeric: 157.5 },
      ],
    },
    'percent-increase-decrease': {
      problems: [
        { prompt: 'A shirt was $40 and is now $50. What is the percent increase?', answer: '25%', hint: '(50-40)/40 = 0.25' },
        { prompt: 'A population dropped from 800 to 600. Percent decrease?', answer: '25%', hint: '(800-600)/800 = 0.25' },
        { prompt: '$60 increased by 15%. New price?', answer: '$69', numeric: 69, hint: '60 × 1.15 = 69' },
        { prompt: '$120 decreased by 30%. New price?', answer: '$84', numeric: 84, hint: '120 × 0.70 = 84' },
        { prompt: 'A stock went from $25 to $30. Percent increase?', answer: '20%' },
        { prompt: 'A jacket was $80, now $60. Percent decrease?', answer: '25%' },
      ],
    },
    'tax-tip-discount': {
      problems: [
        { prompt: 'A meal costs $45. You tip 20%. What is the total?', answer: '$54', numeric: 54, hint: '45 × 1.20 = 54' },
        { prompt: 'A $60 jacket is 25% off. Sale price?', answer: '$45', numeric: 45 },
        { prompt: 'You buy $80 shoes. Tax is 8.5%. Total cost?', answer: '$86.80', numeric: 86.80, hint: '80 × 1.085 = 86.80' },
        { prompt: 'A $200 TV is 15% off, then 7% tax on sale price. Final cost?', answer: '$181.90', numeric: 181.90, hint: '200×0.85=170, 170×1.07=181.90' },
        { prompt: 'Dinner is $32. You leave a 15% tip. How much is the tip?', answer: '$4.80', numeric: 4.80 },
        { prompt: 'A $50 item is 40% off. What is the discount amount?', answer: '$20', numeric: 20 },
      ],
    },
    'simple-interest': {
      problems: [
        { prompt: '$1000 at 5% for 3 years. Find simple interest. (I = Prt)', answer: '$150', numeric: 150 },
        { prompt: '$500 at 4% for 2 years. Find simple interest.', answer: '$40', numeric: 40 },
        { prompt: '$2000 at 3.5% for 4 years. Find simple interest.', answer: '$280', numeric: 280 },
        { prompt: '$750 at 6% for 18 months. Find simple interest.', answer: '$67.50', numeric: 67.50, hint: '18 months = 1.5 years' },
        { prompt: '$1200 at 2% for 5 years. Total amount (principal + interest)?', answer: '$1320', numeric: 1320 },
        { prompt: 'You earned $90 interest on $600 at 5%. How many years?', answer: '3', numeric: 3 },
      ],
    },
    'markup-markdown': {
      problems: [
        { prompt: 'A store buys a shirt for $15 and marks it up 60%. Selling price?', answer: '$24', numeric: 24 },
        { prompt: 'A bike costs the store $120. They sell for $180. What is the markup percent?', answer: '50%' },
        { prompt: 'An item marked at $90 is marked down 20%. New price?', answer: '$72', numeric: 72 },
        { prompt: 'A store buys shoes for $40 and sells for $70. Markup percent?', answer: '75%', hint: '(70-40)/40 = 0.75' },
        { prompt: 'Cost price $25, markup 80%. Selling price?', answer: '$45', numeric: 45 },
        { prompt: 'An item is marked down from $150 to $105. Markdown percent?', answer: '30%' },
      ],
    },
  },
  'grade-8': {
    'slope-from-graph': {
      problems: [
        { prompt: 'A line passes through (0,0) and (4,12). What is the slope?', answer: '3', numeric: 3 },
        { prompt: 'A line passes through (0,2) and (3,8). What is the slope?', answer: '2', numeric: 2 },
        { prompt: 'A line goes through (1,5) and (3,1). What is the slope?', answer: '-2', numeric: -2 },
        { prompt: 'A horizontal line passes through (2,7). What is the slope?', answer: '0', numeric: 0 },
        { prompt: 'A line passes through (0,-3) and (2,3). What is the slope?', answer: '3', numeric: 3 },
        { prompt: 'A line passes through (-1,4) and (3,-4). What is the slope?', answer: '-2', numeric: -2 },
      ],
    },
    'slope-from-table': {
      problems: [
        { prompt: 'Table: (1,4), (2,7), (3,10), (4,13). Find the slope.', answer: '3', numeric: 3 },
        { prompt: 'Table: (0,5), (2,9), (4,13), (6,17). Find the slope.', answer: '2', numeric: 2 },
        { prompt: 'Table: (1,10), (3,6), (5,2). Find the slope.', answer: '-2', numeric: -2 },
        { prompt: 'Table: (0,-1), (1,2), (2,5), (3,8). Find the slope.', answer: '3', numeric: 3 },
        { prompt: 'Table: (2,8), (4,8), (6,8). Find the slope.', answer: '0', numeric: 0 },
        { prompt: 'Table: (0,12), (3,6), (6,0). Find the slope.', answer: '-2', numeric: -2 },
      ],
    },
    'slope-from-points': {
      problems: [
        { prompt: 'Find the slope between (2, 5) and (6, 13).', answer: '2', numeric: 2, hint: '(13-5)/(6-2) = 8/4 = 2' },
        { prompt: 'Find the slope between (-1, 3) and (4, -7).', answer: '-2', numeric: -2, hint: '(-7-3)/(4-(-1)) = -10/5' },
        { prompt: 'Find the slope between (0, 0) and (5, 15).', answer: '3', numeric: 3 },
        { prompt: 'Find the slope between (3, 7) and (3, 12).', answer: 'undefined', hint: 'Vertical line: same x-values' },
        { prompt: 'Find the slope between (-2, -4) and (4, 8).', answer: '2', numeric: 2 },
        { prompt: 'Find the slope between (1, 9) and (4, 3).', answer: '-2', numeric: -2 },
      ],
    },
    'graphing-proportional': {
      problems: [
        { prompt: 'y = 3x passes through the origin. Name two other points on this line.', answer: '(1,3) and (2,6)' },
        { prompt: 'A proportional graph passes through (4, 20). What is k?', answer: '5', numeric: 5 },
        { prompt: 'Is y = 2x + 1 proportional? Why?', answer: 'no', hint: 'Does not pass through origin (b=1)' },
        { prompt: 'The point (3, 12) is on a proportional line. Find y when x = 7.', answer: '28', numeric: 28 },
        { prompt: 'A proportional graph passes through (5, 15). Write the equation.', answer: 'y = 3x' },
        { prompt: 'y = 4x. What is y when x = 2.5?', answer: '10', numeric: 10 },
      ],
    },
    'comparing-proportional': {
      problems: [
        { prompt: 'Line A: y = 3x. Line B passes through (2, 8). Which has a greater rate?', answer: 'Line B', hint: 'B: k = 8/2 = 4 > 3' },
        { prompt: 'Runner A: table (1,6), (2,12), (3,18). Runner B: y = 5x. Who is faster?', answer: 'Runner A', hint: 'A: 6 mph, B: 5 mph' },
        { prompt: 'Plan A: $0.10/min. Plan B: (5 min, $0.60), (10 min, $1.20). Which costs less per minute?', answer: 'Plan A', hint: 'B: $0.12/min' },
        { prompt: 'Car A: 180 mi in 3 hr. Car B: y = 55x. Which is faster?', answer: 'Car A', hint: 'A: 60 mph, B: 55 mph' },
        { prompt: 'Job A pays $12/hr. Job B: (4hr, $52), (8hr, $104). Which pays more?', answer: 'Job B', hint: 'B: $13/hr' },
        { prompt: 'Hose A fills 8 gal in 2 min. Hose B: y = 3x. Which fills faster?', answer: 'Hose A', hint: 'A: 4 gal/min, B: 3 gal/min' },
      ],
    },
    'similar-triangles-slope': {
      problems: [
        { prompt: 'Two triangles on a line have vertical legs 3 and 6, horizontal legs 1 and 2. Same slope?', answer: 'yes', hint: '3/1 = 6/2 = 3' },
        { prompt: 'A line has slope 2. A triangle on the line has horizontal leg 4. What is the vertical leg?', answer: '8', numeric: 8 },
        { prompt: 'Triangle A: rise 5, run 2. Triangle B on same line: run 6. What is the rise?', answer: '15', numeric: 15 },
        { prompt: 'Why do similar triangles on a line prove the slope is constant?', answer: 'corresponding sides are proportional', hint: 'rise/run is constant for similar triangles' },
        { prompt: 'A slope triangle has rise 4, run 3. A larger similar triangle has run 9. Rise?', answer: '12', numeric: 12 },
        { prompt: 'Triangle on a line: rise=6, run=2. Slope?', answer: '3', numeric: 3 },
      ],
    },
    'deriving-y-equals-mx': {
      problems: [
        { prompt: 'A line passes through origin with slope 5. Write the equation.', answer: 'y = 5x' },
        { prompt: 'A proportional relationship has k = 2.5. Write y = mx.', answer: 'y = 2.5x' },
        { prompt: 'Distance = rate × time. If rate is 60 mph, write the equation.', answer: 'd = 60t' },
        { prompt: 'A line has slope 3 and y-intercept 0. Write y = mx + b.', answer: 'y = 3x' },
        { prompt: 'A line has slope 4 and y-intercept 2. Write the equation.', answer: 'y = 4x + 2' },
        { prompt: 'Slope = -1, passes through origin. Write the equation.', answer: 'y = -x' },
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

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9./$ =()-]/g, '').replace(/\s+/g, ' '); }

function generateExercise(grade, skill, count = 5) {
  const bank = PROBLEM_BANKS[grade]?.[skill];
  if (!bank) return { error: `No problem bank for ${grade}/${skill}` };
  const items = pick(bank.problems, count).map(p => ({
    prompt: p.prompt,
    answer: p.answer,
    ...(p.hint && { hint: p.hint }),
  }));
  return { type: 'ratios-proportions', skill, grade, count: items.length, instruction: 'Solve each problem. Show your work.', items };
}

function checkAnswer(type, expected, answer) {
  const ne = norm(expected);
  const na = norm(answer);
  if (ne === na) return true;
  const numE = parseFloat(expected.replace(/[$%,]/g, ''));
  const numA = parseFloat(answer.replace(/[$%,]/g, ''));
  if (!isNaN(numE) && !isNaN(numA) && Math.abs(numE - numA) < 0.01) return true;
  if (ne.replace(/\s/g, '') === na.replace(/\s/g, '')) return true;
  return false;
}

// Public API

class RatiosProportions {
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
    const grade = p.grade || 'grade-6';
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
    const grade = p.grade || 'grade-6';
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

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-6';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    return {
      studentId: id, grade, targetSkill: target, exercise,
      lessonPlan: {
        review: 'Review previously learned ratio concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Apply concept to a real-world context',
      },
    };
  }
}

module.exports = RatiosProportions;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new RatiosProportions();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) api.setGrade(id, grade);
        out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'grade-6';
        if (skill) { out(api.generateExercise(grade, skill, 5)); }
        else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(api.checkAnswer(type, expected, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(api.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? api.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(api.setGrade(id, g)); break; }
      default: out({ usage: 'node ratios-proportions.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
