// eClaw HS Math Trigonometry Interactive Tutor (Grades 10-12). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-math-trigonometry');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'right-triangle': {
    'soh-cah-toa': ['basic-ratios', 'find-sides', 'find-angles'],
    'applications': ['elevation-depression', 'word-problems'],
  },
  'unit-circle': {
    'radian-measure': ['degree-radian-convert', 'arc-length'],
    'special-angles': ['quadrant-i-values', 'all-quadrants', 'reference-angles'],
    'trig-graphs': ['sine-cosine-graphs', 'amplitude-period', 'tangent-graph'],
  },
  'advanced': {
    'identities': ['pythagorean-identities', 'sum-difference', 'double-angle'],
    'equations': ['linear-trig-eq', 'quadratic-trig-eq', 'general-solutions'],
    'oblique-triangles': ['law-of-sines', 'law-of-cosines', 'area-formulas'],
    'inverse-trig': ['arcsin-arccos-arctan', 'compositions'],
  },
};

const PROBLEM_BANKS = {
  'right-triangle': {
    'basic-ratios': {
      problems: [
        { prompt: 'Right triangle: opposite=3, hypotenuse=5. Find sin(A).', answer: '3/5', solution: 'sin = opp/hyp = 3/5' },
        { prompt: 'Right triangle: adjacent=4, hypotenuse=5. Find cos(A).', answer: '4/5', solution: 'cos = adj/hyp = 4/5' },
        { prompt: 'Right triangle: opposite=5, adjacent=12. Find tan(A).', answer: '5/12', solution: 'tan = opp/adj = 5/12' },
        { prompt: 'If sin(A)=8/17, find cos(A). (Right triangle, A acute)', answer: '15/17', solution: 'adj = sqrt(17^2 - 8^2) = sqrt(225) = 15; cos = 15/17' },
        { prompt: 'Right triangle: opp=7, hyp=25. Find adj.', answer: '24', solution: 'adj = sqrt(625-49) = sqrt(576) = 24' },
        { prompt: 'If tan(A)=3/4, find sin(A).', answer: '3/5', solution: 'hyp = sqrt(9+16) = 5; sin = 3/5' },
      ],
    },
    'find-sides': {
      problems: [
        { prompt: 'Right triangle: angle=30, hyp=10. Find opposite.', answer: '5', solution: 'sin(30)=1/2; opp = 10 * 1/2 = 5' },
        { prompt: 'Right triangle: angle=60, adj=4. Find opposite.', answer: '4*sqrt(3)', solution: 'tan(60)=sqrt(3); opp = 4*sqrt(3)' },
        { prompt: 'Right triangle: angle=45, hyp=8. Find each leg.', answer: '4*sqrt(2)', solution: 'sin(45)=sqrt(2)/2; leg = 8*sqrt(2)/2 = 4*sqrt(2)' },
        { prompt: 'Right triangle: angle=30, opp=6. Find hyp.', answer: '12', solution: 'sin(30)=1/2; hyp = 6/(1/2) = 12' },
        { prompt: 'Right triangle: angle=45, leg=7. Find hyp.', answer: '7*sqrt(2)', solution: 'hyp = leg * sqrt(2) = 7*sqrt(2)' },
      ],
    },
    'find-angles': {
      problems: [
        { prompt: 'sin(A)=1/2. Find angle A (acute).', answer: '30', solution: 'sin(30) = 1/2' },
        { prompt: 'cos(A)=sqrt(2)/2. Find angle A (acute).', answer: '45', solution: 'cos(45) = sqrt(2)/2' },
        { prompt: 'tan(A)=1. Find angle A (acute).', answer: '45', solution: 'tan(45) = 1' },
        { prompt: 'tan(A)=sqrt(3). Find angle A (acute).', answer: '60', solution: 'tan(60) = sqrt(3)' },
        { prompt: 'cos(A)=1/2. Find angle A (acute).', answer: '60', solution: 'cos(60) = 1/2' },
      ],
    },
    'elevation-depression': {
      problems: [
        { prompt: 'From 50m high, angle of depression to a boat is 30. Distance from base?', answer: '50*sqrt(3)', solution: 'tan(30) = 50/d; d = 50/tan(30) = 50*sqrt(3)' },
        { prompt: 'Angle of elevation to top of 100m building from 100m away is?', answer: '45', solution: 'tan(A) = 100/100 = 1; A = 45' },
        { prompt: 'From ground, angle of elevation 60 to a kite, string is 80m. Height?', answer: '40*sqrt(3)', solution: 'sin(60) = h/80; h = 80*sqrt(3)/2 = 40*sqrt(3)' },
        { prompt: 'A ladder leans against a wall at 60 degrees. Base is 3m from wall. Ladder length?', answer: '6', solution: 'cos(60) = 3/L; L = 3/(1/2) = 6' },
      ],
    },
    'word-problems': {
      problems: [
        { prompt: 'A ramp rises 5m over a horizontal distance of 12m. Find the angle.', answer: 'arctan(5/12)', solution: 'tan(A) = 5/12; A = arctan(5/12) approx 22.6 degrees' },
        { prompt: 'A 20-ft ladder at 75 degrees to ground. How far up the wall?', answer: '20*sin(75)', solution: 'h = 20*sin(75) approx 19.3 ft' },
        { prompt: 'Shadow of a 40-ft pole is 40 ft. Sun angle?', answer: '45', solution: 'tan(A) = 40/40 = 1; A = 45 degrees' },
        { prompt: 'Two ships: one 5km North, other 5km East. Angle between them from port?', answer: '90', solution: 'Perpendicular directions form 90 degrees' },
      ],
    },
  },
  'unit-circle': {
    'degree-radian-convert': {
      problems: [
        { prompt: 'Convert 180 degrees to radians', answer: 'pi', solution: '180 * pi/180 = pi' },
        { prompt: 'Convert 90 degrees to radians', answer: 'pi/2', solution: '90 * pi/180 = pi/2' },
        { prompt: 'Convert pi/3 radians to degrees', answer: '60', solution: 'pi/3 * 180/pi = 60' },
        { prompt: 'Convert 270 degrees to radians', answer: '3*pi/2', solution: '270 * pi/180 = 3pi/2' },
        { prompt: 'Convert 5*pi/6 radians to degrees', answer: '150', solution: '5pi/6 * 180/pi = 150' },
        { prompt: 'Convert 45 degrees to radians', answer: 'pi/4', solution: '45 * pi/180 = pi/4' },
        { prompt: 'Convert 2*pi/3 radians to degrees', answer: '120', solution: '2pi/3 * 180/pi = 120' },
        { prompt: 'Convert 360 degrees to radians', answer: '2*pi', solution: '360 * pi/180 = 2pi' },
      ],
    },
    'arc-length': {
      problems: [
        { prompt: 'Radius 6, central angle pi/3. Find arc length.', answer: '2*pi', solution: 's = r*theta = 6 * pi/3 = 2pi' },
        { prompt: 'Radius 10, central angle pi/2. Find arc length.', answer: '5*pi', solution: 's = 10 * pi/2 = 5pi' },
        { prompt: 'Arc length 12, radius 4. Find central angle in radians.', answer: '3', solution: 'theta = s/r = 12/4 = 3 radians' },
        { prompt: 'Radius 8, central angle 2pi. Find arc length.', answer: '16*pi', solution: 'Full circle: s = 8 * 2pi = 16pi = circumference' },
        { prompt: 'Radius 5, central angle 60 degrees. Find arc length.', answer: '5*pi/3', solution: '60 deg = pi/3 rad; s = 5 * pi/3 = 5pi/3' },
      ],
    },
    'quadrant-i-values': {
      problems: [
        { prompt: 'sin(30) or sin(pi/6)', answer: '1/2', solution: 'Unit circle: y-coordinate at pi/6' },
        { prompt: 'cos(60) or cos(pi/3)', answer: '1/2', solution: 'Unit circle: x-coordinate at pi/3' },
        { prompt: 'sin(45) or sin(pi/4)', answer: 'sqrt(2)/2', solution: 'Unit circle: 45-45-90 triangle ratio' },
        { prompt: 'tan(60) or tan(pi/3)', answer: 'sqrt(3)', solution: 'sin(60)/cos(60) = (sqrt(3)/2)/(1/2) = sqrt(3)' },
        { prompt: 'cos(0)', answer: '1', solution: 'Point (1, 0) on unit circle' },
        { prompt: 'sin(pi/2) or sin(90)', answer: '1', solution: 'Point (0, 1) on unit circle' },
      ],
    },
    'all-quadrants': {
      problems: [
        { prompt: 'sin(150) or sin(5*pi/6)', answer: '1/2', solution: 'QII: sin positive; ref angle 30, sin(30) = 1/2' },
        { prompt: 'cos(120) or cos(2*pi/3)', answer: '-1/2', solution: 'QII: cos negative; ref angle 60, cos(60) = 1/2' },
        { prompt: 'sin(210) or sin(7*pi/6)', answer: '-1/2', solution: 'QIII: sin negative; ref angle 30' },
        { prompt: 'cos(315) or cos(7*pi/4)', answer: 'sqrt(2)/2', solution: 'QIV: cos positive; ref angle 45' },
        { prompt: 'tan(135) or tan(3*pi/4)', answer: '-1', solution: 'QII: tan negative; ref angle 45, tan(45) = 1' },
        { prompt: 'sin(270) or sin(3*pi/2)', answer: '-1', solution: 'Point (0, -1) on unit circle' },
        { prompt: 'cos(180) or cos(pi)', answer: '-1', solution: 'Point (-1, 0) on unit circle' },
        { prompt: 'tan(240) or tan(4*pi/3)', answer: 'sqrt(3)', solution: 'QIII: tan positive; ref angle 60' },
      ],
    },
    'reference-angles': {
      problems: [
        { prompt: 'Find reference angle for 150 degrees', answer: '30', solution: '180 - 150 = 30' },
        { prompt: 'Find reference angle for 225 degrees', answer: '45', solution: '225 - 180 = 45' },
        { prompt: 'Find reference angle for 300 degrees', answer: '60', solution: '360 - 300 = 60' },
        { prompt: 'Find reference angle for 5*pi/4', answer: 'pi/4', solution: '5pi/4 - pi = pi/4' },
        { prompt: 'Find reference angle for 2*pi/3', answer: 'pi/3', solution: 'pi - 2pi/3 = pi/3' },
        { prompt: 'Find reference angle for 330 degrees', answer: '30', solution: '360 - 330 = 30' },
      ],
    },
    'sine-cosine-graphs': {
      problems: [
        { prompt: 'What is the period of y = sin(x)?', answer: '2*pi', solution: 'One full cycle of sine takes 2pi' },
        { prompt: 'What is the range of y = cos(x)?', answer: '[-1, 1]', solution: 'Cosine oscillates between -1 and 1' },
        { prompt: 'Where does sin(x) = 0 on [0, 2pi]?', answer: '0, pi, 2*pi', solution: 'Sin crosses zero at these points' },
        { prompt: 'Maximum value of y = sin(x)?', answer: '1', solution: 'sin(pi/2) = 1' },
        { prompt: 'At what x does cos(x) first reach its minimum on [0, 2pi]?', answer: 'pi', solution: 'cos(pi) = -1' },
      ],
    },
    'amplitude-period': {
      problems: [
        { prompt: 'y = 3sin(2x). Find amplitude.', answer: '3', solution: 'Amplitude = |a| = 3' },
        { prompt: 'y = 3sin(2x). Find period.', answer: 'pi', solution: 'Period = 2pi/|b| = 2pi/2 = pi' },
        { prompt: 'y = -2cos(x/3). Find amplitude.', answer: '2', solution: 'Amplitude = |-2| = 2' },
        { prompt: 'y = -2cos(x/3). Find period.', answer: '6*pi', solution: 'Period = 2pi/(1/3) = 6pi' },
        { prompt: 'y = sin(4x) + 1. Find midline.', answer: 'y = 1', solution: 'Vertical shift d = 1' },
        { prompt: 'y = 5cos(pi*x). Find period.', answer: '2', solution: 'Period = 2pi/pi = 2' },
      ],
    },
    'tangent-graph': {
      problems: [
        { prompt: 'What is the period of y = tan(x)?', answer: 'pi', solution: 'Tangent repeats every pi' },
        { prompt: 'Where are the vertical asymptotes of y = tan(x)?', answer: 'x = pi/2 + n*pi', solution: 'cos(x) = 0 at these points' },
        { prompt: 'What is the range of y = tan(x)?', answer: 'all real numbers', solution: 'Tangent takes all real values' },
        { prompt: 'y = tan(2x). Find period.', answer: 'pi/2', solution: 'Period = pi/|b| = pi/2' },
      ],
    },
  },
  'advanced': {
    'pythagorean-identities': {
      problems: [
        { prompt: 'If sin(x)=3/5, find cos(x) (x in QI).', answer: '4/5', solution: 'cos^2 = 1 - sin^2 = 1 - 9/25 = 16/25; cos = 4/5' },
        { prompt: 'Simplify: sin^2(x) + cos^2(x)', answer: '1', solution: 'Fundamental Pythagorean identity' },
        { prompt: 'Simplify: 1 + tan^2(x)', answer: 'sec^2(x)', solution: 'Second Pythagorean identity' },
        { prompt: 'If cos(x)=5/13 (QI), find sin(x).', answer: '12/13', solution: 'sin = sqrt(1 - 25/169) = sqrt(144/169) = 12/13' },
        { prompt: 'Simplify: sec^2(x) - tan^2(x)', answer: '1', solution: 'Rearrangement of 1 + tan^2 = sec^2' },
        { prompt: 'If sin(x)=sqrt(2)/2 and cos(x)=sqrt(2)/2, find tan(x).', answer: '1', solution: 'tan = sin/cos = 1' },
      ],
    },
    'sum-difference': {
      problems: [
        { prompt: 'Find exact value: sin(75) using sin(45+30)', answer: '(sqrt(6)+sqrt(2))/4', solution: 'sin45*cos30 + cos45*sin30 = (sqrt(2)/2)(sqrt(3)/2) + (sqrt(2)/2)(1/2)' },
        { prompt: 'cos(A+B) = ?', answer: 'cosA*cosB - sinA*sinB', solution: 'Cosine sum formula' },
        { prompt: 'sin(A-B) = ?', answer: 'sinA*cosB - cosA*sinB', solution: 'Sine difference formula' },
        { prompt: 'Find exact value: cos(15) using cos(45-30)', answer: '(sqrt(6)+sqrt(2))/4', solution: 'cos45*cos30 + sin45*sin30' },
        { prompt: 'Simplify: sin(x)cos(pi/6) + cos(x)sin(pi/6)', answer: 'sin(x + pi/6)', solution: 'Sine sum formula: sin(A+B)' },
      ],
    },
    'double-angle': {
      problems: [
        { prompt: 'sin(2x) = ?', answer: '2*sin(x)*cos(x)', solution: 'Double angle formula for sine' },
        { prompt: 'If sin(x)=3/5 and cos(x)=4/5, find sin(2x).', answer: '24/25', solution: 'sin(2x) = 2(3/5)(4/5) = 24/25' },
        { prompt: 'cos(2x) using cos only: cos(2x) = ?', answer: '2*cos^2(x) - 1', solution: 'Double angle form using cosine' },
        { prompt: 'If cos(x)=3/5 (QI), find cos(2x).', answer: '-7/25', solution: 'cos(2x) = 2(9/25) - 1 = 18/25 - 25/25 = -7/25' },
        { prompt: 'tan(2x) = ?', answer: '2*tan(x)/(1 - tan^2(x))', solution: 'Double angle formula for tangent' },
      ],
    },
    'linear-trig-eq': {
      problems: [
        { prompt: 'Solve: 2sin(x) = 1 on [0, 2pi)', answer: 'x = pi/6, 5*pi/6', solution: 'sin(x) = 1/2; QI: pi/6, QII: 5pi/6' },
        { prompt: 'Solve: cos(x) = -1 on [0, 2pi)', answer: 'x = pi', solution: 'cos(pi) = -1' },
        { prompt: 'Solve: tan(x) = 1 on [0, 2pi)', answer: 'x = pi/4, 5*pi/4', solution: 'QI: pi/4, QIII: 5pi/4' },
        { prompt: 'Solve: 2cos(x) + sqrt(3) = 0 on [0, 2pi)', answer: 'x = 5*pi/6, 7*pi/6', solution: 'cos(x) = -sqrt(3)/2; QII and QIII' },
        { prompt: 'Solve: sin(x) = 0 on [0, 2pi)', answer: 'x = 0, pi', solution: 'sin = 0 at 0 and pi (2pi not included)' },
      ],
    },
    'quadratic-trig-eq': {
      problems: [
        { prompt: 'Solve: 2sin^2(x) - sin(x) - 1 = 0 on [0, 2pi)', answer: 'x = pi/2, 7*pi/6, 11*pi/6', solution: '(2sin(x)+1)(sin(x)-1)=0; sin=-1/2 or sin=1' },
        { prompt: 'Solve: cos^2(x) = 1/4 on [0, 2pi)', answer: 'x = pi/3, 2*pi/3, 4*pi/3, 5*pi/3', solution: 'cos(x) = +/-1/2; four solutions' },
        { prompt: 'Solve: 2cos^2(x) - 1 = 0 on [0, 2pi)', answer: 'x = pi/4, 3*pi/4, 5*pi/4, 7*pi/4', solution: 'cos^2 = 1/2; cos = +/-sqrt(2)/2' },
        { prompt: 'Solve: tan^2(x) = 3 on [0, 2pi)', answer: 'x = pi/3, 2*pi/3, 4*pi/3, 5*pi/3', solution: 'tan = +/-sqrt(3); four solutions' },
      ],
    },
    'general-solutions': {
      problems: [
        { prompt: 'General solution: sin(x) = 1/2', answer: 'x = pi/6 + 2n*pi or x = 5*pi/6 + 2n*pi', solution: 'Add 2n*pi to each solution in [0, 2pi)' },
        { prompt: 'General solution: cos(x) = 0', answer: 'x = pi/2 + n*pi', solution: 'cos = 0 at pi/2 and 3pi/2; pattern: pi/2 + npi' },
        { prompt: 'General solution: tan(x) = 1', answer: 'x = pi/4 + n*pi', solution: 'Tangent repeats every pi' },
      ],
    },
    'law-of-sines': {
      problems: [
        { prompt: 'Triangle: A=30, B=45, a=10. Find b.', answer: '10*sqrt(2)', solution: 'a/sinA = b/sinB; 10/sin30 = b/sin45; b = 20*sin45 = 10*sqrt(2)' },
        { prompt: 'Triangle: A=30, a=5, b=8. How many triangles possible?', answer: '2 (ambiguous case)', solution: 'b*sinA = 4 < a < b: two triangles' },
        { prompt: 'Triangle: A=90, a=10, B=30. Find b.', answer: '5', solution: '10/sin90 = b/sin30; b = 10*(1/2) = 5' },
        { prompt: 'State the law of sines.', answer: 'a/sinA = b/sinB = c/sinC', solution: 'Ratio of side to sine of opposite angle is constant' },
      ],
    },
    'law-of-cosines': {
      problems: [
        { prompt: 'Triangle: a=5, b=7, C=60. Find c.', answer: 'sqrt(39)', solution: 'c^2 = 25 + 49 - 2(5)(7)cos60 = 74 - 35 = 39' },
        { prompt: 'Triangle: a=3, b=4, c=5. Find angle C.', answer: '90', solution: 'cos(C) = (9+16-25)/(2*3*4) = 0; C = 90' },
        { prompt: 'Triangle: a=8, b=6, c=10. Find angle C.', answer: 'arccos(0) = 90', solution: 'cos(C) = (64+36-100)/96 = 0' },
        { prompt: 'When do you use law of cosines?', answer: 'SAS or SSS', solution: 'Use for SAS (find third side) or SSS (find angles)' },
      ],
    },
    'area-formulas': {
      problems: [
        { prompt: 'Triangle: a=6, b=8, C=30. Find area.', answer: '12', solution: 'Area = (1/2)(6)(8)sin(30) = (1/2)(48)(1/2) = 12' },
        { prompt: 'Triangle: a=10, b=7, C=90. Find area.', answer: '35', solution: 'Area = (1/2)(10)(7)sin(90) = (1/2)(70)(1) = 35' },
        { prompt: 'Triangle: sides 3, 4, 5. Find area using Heron.', answer: '6', solution: 's = 6; Area = sqrt(6*3*2*1) = sqrt(36) = 6' },
        { prompt: 'Triangle: a=5, b=5, C=60. Find area.', answer: '25*sqrt(3)/4', solution: 'Area = (1/2)(5)(5)sin60 = (25/2)(sqrt(3)/2) = 25sqrt(3)/4' },
      ],
    },
    'arcsin-arccos-arctan': {
      problems: [
        { prompt: 'Evaluate: arcsin(1/2)', answer: 'pi/6 or 30 degrees', solution: 'sin(pi/6) = 1/2; range of arcsin is [-pi/2, pi/2]' },
        { prompt: 'Evaluate: arccos(0)', answer: 'pi/2 or 90 degrees', solution: 'cos(pi/2) = 0; range of arccos is [0, pi]' },
        { prompt: 'Evaluate: arctan(1)', answer: 'pi/4 or 45 degrees', solution: 'tan(pi/4) = 1; range of arctan is (-pi/2, pi/2)' },
        { prompt: 'Evaluate: arcsin(-sqrt(2)/2)', answer: '-pi/4 or -45 degrees', solution: 'sin(-pi/4) = -sqrt(2)/2' },
        { prompt: 'What is the range of arcsin(x)?', answer: '[-pi/2, pi/2]', solution: 'Restricted domain of sin gives this range for inverse' },
      ],
    },
    'compositions': {
      problems: [
        { prompt: 'Find: sin(arcsin(0.5))', answer: '0.5', solution: 'sin and arcsin are inverses: sin(arcsin(x)) = x for |x| <= 1' },
        { prompt: 'Find: cos(arctan(3/4))', answer: '4/5', solution: 'Draw triangle: opp=3, adj=4, hyp=5; cos = 4/5' },
        { prompt: 'Find: tan(arcsin(5/13))', answer: '5/12', solution: 'adj = sqrt(169-25) = 12; tan = 5/12' },
        { prompt: 'Find: sin(arccos(3/5))', answer: '4/5', solution: 'opp = sqrt(25-9) = 4; sin = 4/5' },
      ],
    },
  },
};

// File I/O and helpers (same architecture as phonics.js)

function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }
function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }
function loadProfile(id) { const fp = profilePath(id); if (fs.existsSync(fp)) { try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); } } return { studentId: id, level: null, createdAt: new Date().toISOString(), assessments: [], skills: {} }; }
function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }
function calcMastery(attempts) { if (!attempts || !attempts.length) return 0; const recent = attempts.slice(-5).filter(a => a.total > 0); return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0; }
function masteryLabel(r) { return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started'; }
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }
function norm(s) { return String(s).toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^a-z0-9 +\-*/^().=<>!,]/g, ''); }

function generateExercise(level, skill, count = 5) {
  const bank = PROBLEM_BANKS[level]?.[skill];
  if (!bank) return { error: `No problem bank for ${level}/${skill}` };
  const items = pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer, solution: p.solution, type: 'trigonometry' }));
  return { type: 'trigonometry', skill, level, count: items.length, instruction: 'Solve each trigonometry problem.', items };
}

function checkAnswer(type, expected, answer) { return { correct: norm(expected) === norm(answer), expected, studentAnswer: answer }; }

class Trigonometry {
  getProfile(id) { const p = loadProfile(id); return { studentId: p.studentId, level: p.level, createdAt: p.createdAt, totalAssessments: p.assessments.length }; }
  setLevel(id, level) { if (!SKILLS[level]) throw new Error(`Unknown level: ${level}. Valid: ${Object.keys(SKILLS).join(', ')}`); const p = loadProfile(id); p.level = level; saveProfile(p); return { studentId: id, level }; }

  recordAssessment(id, level, category, skill, score, total, notes = '') {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}`); if (!SKILLS[level][category]) throw new Error(`Unknown category`); if (!SKILLS[level][category].includes(skill)) throw new Error(`Unknown skill`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive'); if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id); if (!p.level) p.level = level;
    const entry = { date: new Date().toISOString(), level, category, skill, score, total, notes }; p.assessments.push(entry);
    const key = `${level}/${category}/${skill}`; if (!p.skills[key]) p.skills[key] = { attempts: [] }; p.skills[key].attempts.push({ date: entry.date, score, total }); p.skills[key].mastery = calcMastery(p.skills[key].attempts); p.skills[key].label = masteryLabel(p.skills[key].mastery); saveProfile(p);
    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  getProgress(id) { const p = loadProfile(id); const level = p.level || 'right-triangle'; const gs = SKILLS[level] || {}; const results = {}; let mastered = 0, total = 0; for (const [cat, skills] of Object.entries(gs)) { results[cat] = {}; for (const sk of skills) { total++; const d = p.skills[`${level}/${cat}/${sk}`]; results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' }; if (d && d.mastery >= MASTERY_THRESHOLD) mastered++; } } return { studentId: id, level, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results }; }
  getNextSkills(id, count = 5) { const p = loadProfile(id); const level = p.level || 'right-triangle'; const candidates = []; for (const [cat, skills] of Object.entries(SKILLS[level] || {})) { for (const sk of skills) { const d = p.skills[`${level}/${cat}/${sk}`]; const m = d ? d.mastery : 0; if (m < MASTERY_THRESHOLD) candidates.push({ level, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' }); } } const order = { developing: 0, emerging: 1, 'not-started': 2 }; candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery); return { studentId: id, level, next: candidates.slice(0, count) }; }
  getReport(id) { const p = loadProfile(id); return { studentId: id, level: p.level, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }
  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }
  getSkillCatalog(level) { const gs = SKILLS[level]; if (!gs) return { level, error: `Unknown level. Valid: ${Object.keys(SKILLS).join(', ')}` }; let total = 0; const catalog = {}; for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; } return { level, skills: catalog, totalSkills: total }; }
  generateExercise(level, skill, count = 5) { return generateExercise(level, skill, count); }
  checkAnswer(type, expected, answer) { return checkAnswer(type, expected, answer); }

  generateLesson(id) {
    const p = loadProfile(id); const level = p.level || 'right-triangle'; const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient!`, level };
    const exercise = generateExercise(level, target.skill, 5);
    return { studentId: id, level, targetSkill: target, exercise, lessonPlan: { review: 'Review prerequisite concepts (3-5 min)', teach: `Introduce/reinforce: ${target.category} > ${target.skill}`, practice: `Complete ${exercise.count || 0} practice items`, reflect: 'Connect back to unit circle and fundamental identities' } };
  }
}

module.exports = Trigonometry;

if (require.main === module) {
  const args = process.argv.slice(2); const cmd = args[0]; const api = new Trigonometry(); const out = d => console.log(JSON.stringify(d, null, 2));
  try {
    switch (cmd) {
      case 'start': { const [, id, level] = args; if (!id) throw new Error('Usage: start <id> [level]'); if (level) api.setLevel(id, level); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const level = loadProfile(id).level || 'right-triangle'; if (skill) { out(api.generateExercise(level, skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); out(api.checkAnswer(type, expected, answer)); break; }
      case 'record': { const [, id, level, cat, skill, sc, tot, ...notes] = args; if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total>'); out(api.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? api.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(api.setLevel(id, l)); break; }
      default: out({ usage: 'node trigonometry.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
