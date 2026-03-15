// eClaw MS Math Geometry Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-math-geometry');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'area': ['area-triangles', 'area-quadrilaterals', 'area-polygons'],
    'coordinate-geometry': ['polygons-coordinate-plane'],
    'surface-area': ['nets-surface-area'],
    'volume': ['volume-rectangular-prism'],
  },
  'grade-7': {
    'scale': ['scale-drawings', 'scale-factor'],
    'circles': ['circumference', 'area-circles'],
    'angles': ['complementary-supplementary', 'vertical-adjacent'],
    'composite': ['composite-area', 'composite-volume'],
    'triangles': ['triangle-inequality'],
  },
  'grade-8': {
    'transformations': ['translations', 'reflections', 'rotations', 'dilations'],
    'congruence-similarity': ['congruence-transformations', 'similarity-transformations'],
    'angle-relationships': ['parallel-lines-transversals', 'triangle-angle-sum'],
    'pythagorean': ['pythagorean-theorem', 'pythagorean-converse', 'distance-formula'],
  },
};

const PROBLEM_BANKS = {
  'grade-6': {
    'area-triangles': {
      problems: [
        { prompt: 'Find the area of a triangle with base 10 and height 6.', answer: '30', numeric: 30, hint: 'A = (1/2)(10)(6) = 30' },
        { prompt: 'Find the area of a triangle with base 8 and height 5.', answer: '20', numeric: 20 },
        { prompt: 'A triangle has area 24 and base 8. What is the height?', answer: '6', numeric: 6, hint: '24 = (1/2)(8)(h) → h=6' },
        { prompt: 'Find the area of a triangle with base 12 and height 7.', answer: '42', numeric: 42 },
        { prompt: 'Find the area of a triangle with base 15 and height 4.', answer: '30', numeric: 30 },
        { prompt: 'A triangle has area 36 and height 9. What is the base?', answer: '8', numeric: 8 },
      ],
    },
    'area-quadrilaterals': {
      problems: [
        { prompt: 'Find the area of a parallelogram with base 9 and height 4.', answer: '36', numeric: 36 },
        { prompt: 'Find the area of a rectangle with length 12 and width 5.', answer: '60', numeric: 60 },
        { prompt: 'Find the area of a trapezoid with bases 6 and 10, height 4.', answer: '32', numeric: 32, hint: 'A = (1/2)(6+10)(4) = 32' },
        { prompt: 'A parallelogram has base 7 and height 8. Find the area.', answer: '56', numeric: 56 },
        { prompt: 'A trapezoid has bases 5 and 9, height 6. Find the area.', answer: '42', numeric: 42 },
        { prompt: 'A rectangle has area 48 and length 8. Find the width.', answer: '6', numeric: 6 },
      ],
    },
    'area-polygons': {
      problems: [
        { prompt: 'An irregular polygon can be split into a rectangle (4×6) and triangle (base 4, height 3). Total area?', answer: '30', numeric: 30, hint: '24 + 6 = 30' },
        { prompt: 'A hexagonal garden is made of 6 triangles, each with base 3 and height 2.6. Total area?', answer: '23.4', numeric: 23.4 },
        { prompt: 'An L-shape: 8×3 rectangle minus 2×3 rectangle. Area?', answer: '18', numeric: 18, hint: '24 - 6 = 18' },
        { prompt: 'A pentagon can be split into a rectangle (5×4) and triangle (base 5, height 3). Area?', answer: '27.5', numeric: 27.5 },
        { prompt: 'A shape combines a square (side 5) and triangle (base 5, height 4). Total area?', answer: '35', numeric: 35 },
        { prompt: 'An irregular shape is a 10×6 rectangle with a 3×2 rectangle cut out. Area?', answer: '54', numeric: 54 },
      ],
    },
    'polygons-coordinate-plane': {
      problems: [
        { prompt: 'Rectangle with vertices (1,2), (7,2), (7,5), (1,5). Find the perimeter.', answer: '18', numeric: 18, hint: 'Length=6, Width=3, P=2(6+3)' },
        { prompt: 'Same rectangle: (1,2), (7,2), (7,5), (1,5). Find the area.', answer: '18', numeric: 18 },
        { prompt: 'Triangle with vertices (0,0), (6,0), (3,4). Find the area.', answer: '12', numeric: 12, hint: 'base=6, height=4, A=(1/2)(6)(4)' },
        { prompt: 'Square with vertices (2,1), (5,1), (5,4), (2,4). Side length?', answer: '3', numeric: 3 },
        { prompt: 'Rectangle with vertices (-3,1), (4,1), (4,-2), (-3,-2). Find the area.', answer: '21', numeric: 21 },
        { prompt: 'Triangle with vertices (0,0), (8,0), (4,6). Find the area.', answer: '24', numeric: 24 },
      ],
    },
    'nets-surface-area': {
      problems: [
        { prompt: 'Find the surface area of a rectangular prism: 4×3×5.', answer: '94', numeric: 94, hint: 'SA = 2(12+20+15) = 94' },
        { prompt: 'A cube has side length 3. Surface area?', answer: '54', numeric: 54, hint: '6 × 3² = 54' },
        { prompt: 'Rectangular prism: 6×2×4. Surface area?', answer: '88', numeric: 88, hint: '2(12+24+8)=88' },
        { prompt: 'A cube has side length 5. Surface area?', answer: '150', numeric: 150 },
        { prompt: 'Rectangular prism: 10×3×2. Surface area?', answer: '112', numeric: 112 },
        { prompt: 'Rectangular prism: 7×4×3. Surface area?', answer: '122', numeric: 122 },
      ],
    },
    'volume-rectangular-prism': {
      problems: [
        { prompt: 'Find the volume of a rectangular prism: 5×3×4.', answer: '60', numeric: 60 },
        { prompt: 'Find the volume: length 8, width 2.5, height 4.', answer: '80', numeric: 80 },
        { prompt: 'A prism has volume 120 and base area 24. Height?', answer: '5', numeric: 5 },
        { prompt: 'Find the volume: 6×3×7.', answer: '126', numeric: 126 },
        { prompt: 'Find the volume: 3.5×2×4.', answer: '28', numeric: 28 },
        { prompt: 'A cube has side 4. Volume?', answer: '64', numeric: 64 },
      ],
    },
  },
  'grade-7': {
    'scale-drawings': {
      problems: [
        { prompt: 'Map scale: 1 cm = 50 km. Two cities are 3.5 cm apart. Actual distance?', answer: '175 km', numeric: 175 },
        { prompt: 'Scale: 1 inch = 8 feet. A room is 2.5 inches on the plan. Actual length?', answer: '20 feet', numeric: 20 },
        { prompt: 'Actual length is 120 m. Scale is 1:600. Drawing length?', answer: '0.2 m', numeric: 0.2 },
        { prompt: 'Scale: 1 cm = 25 km. Actual distance is 200 km. Map distance?', answer: '8 cm', numeric: 8 },
        { prompt: 'A model car is 1:24 scale. Actual car is 4.8 m. Model length?', answer: '0.2 m', numeric: 0.2 },
        { prompt: 'Scale: 1 in = 5 ft. A wall is 3 in on the plan. Actual height?', answer: '15 feet', numeric: 15 },
      ],
    },
    'scale-factor': {
      problems: [
        { prompt: 'Original triangle sides: 3, 4, 5. Scale factor 3. New sides?', answer: '9, 12, 15' },
        { prompt: 'Rectangle 4×6 scaled by factor 2.5. New dimensions?', answer: '10×15' },
        { prompt: 'Original side: 8. Scaled side: 20. Scale factor?', answer: '2.5', numeric: 2.5 },
        { prompt: 'A square has side 5. After scaling by 3, what is the new area?', answer: '225', numeric: 225, hint: 'New side=15, area=225' },
        { prompt: 'Original perimeter: 24. Scale factor: 1/2. New perimeter?', answer: '12', numeric: 12 },
        { prompt: 'Side 6 scaled to 9. What is the scale factor?', answer: '1.5', numeric: 1.5 },
      ],
    },
    'circumference': {
      problems: [
        { prompt: 'Find the circumference of a circle with radius 7. (Use π ≈ 3.14)', answer: '43.96', numeric: 43.96, hint: 'C = 2πr = 2(3.14)(7)' },
        { prompt: 'Find the circumference with diameter 10. (Use π ≈ 3.14)', answer: '31.4', numeric: 31.4 },
        { prompt: 'A circle has circumference 62.8. Find the radius. (Use π ≈ 3.14)', answer: '10', numeric: 10 },
        { prompt: 'Find the circumference with radius 5. (Use π ≈ 3.14)', answer: '31.4', numeric: 31.4 },
        { prompt: 'A wheel has diameter 24 inches. Distance in one rotation? (Use π ≈ 3.14)', answer: '75.36 inches', numeric: 75.36 },
        { prompt: 'Find the circumference with diameter 14. (Use π ≈ 3.14)', answer: '43.96', numeric: 43.96 },
      ],
    },
    'area-circles': {
      problems: [
        { prompt: 'Find the area of a circle with radius 5. (Use π ≈ 3.14)', answer: '78.5', numeric: 78.5, hint: 'A = πr² = 3.14(25)' },
        { prompt: 'Find the area with radius 10. (Use π ≈ 3.14)', answer: '314', numeric: 314 },
        { prompt: 'Find the area with diameter 8. (Use π ≈ 3.14)', answer: '50.24', numeric: 50.24, hint: 'r=4, A=3.14(16)' },
        { prompt: 'A circle has area 153.86. Find the radius. (Use π ≈ 3.14)', answer: '7', numeric: 7 },
        { prompt: 'Find the area with radius 3. (Use π ≈ 3.14)', answer: '28.26', numeric: 28.26 },
        { prompt: 'A pizza has diameter 16 inches. Area? (Use π ≈ 3.14)', answer: '200.96', numeric: 200.96 },
      ],
    },
    'complementary-supplementary': {
      problems: [
        { prompt: 'Two angles are complementary. One is 35°. Find the other.', answer: '55', numeric: 55 },
        { prompt: 'Two angles are supplementary. One is 110°. Find the other.', answer: '70', numeric: 70 },
        { prompt: 'Are 45° and 45° complementary, supplementary, or neither?', answer: 'complementary' },
        { prompt: 'Are 90° and 90° complementary, supplementary, or neither?', answer: 'supplementary' },
        { prompt: 'Two angles are supplementary. One is 3x and the other is 2x + 10. Find x.', answer: '34', numeric: 34, hint: '3x + 2x + 10 = 180' },
        { prompt: 'Two angles are complementary. One is 2x and the other is x + 15. Find x.', answer: '25', numeric: 25 },
      ],
    },
    'vertical-adjacent': {
      problems: [
        { prompt: 'Two vertical angles: one is 72°. What is the other?', answer: '72', numeric: 72 },
        { prompt: 'Two intersecting lines form angles. One is 130°. Find the adjacent angle.', answer: '50', numeric: 50, hint: 'Adjacent angles are supplementary' },
        { prompt: 'Vertical angles are always ___.', answer: 'equal' },
        { prompt: 'Adjacent angles on a straight line sum to ___ degrees.', answer: '180', numeric: 180 },
        { prompt: 'Two vertical angles: one is 5x, the other is 3x + 20. Find x.', answer: '10', numeric: 10 },
        { prompt: 'One angle is 65°. Its vertical angle is ___. Its adjacent angle is ___.', answer: '65 and 115' },
      ],
    },
    'composite-area': {
      problems: [
        { prompt: 'L-shape: large rectangle 10×6, small rectangle 4×3 removed. Area?', answer: '48', numeric: 48 },
        { prompt: 'A shape is a rectangle (8×5) with a semicircle (diameter 5) on top. Area? (π≈3.14)', answer: '49.81', numeric: 49.81, hint: '40 + (1/2)(3.14)(2.5²) ≈ 40+9.81' },
        { prompt: 'Two triangles share a base of 6. Heights are 4 and 3. Combined area?', answer: '21', numeric: 21, hint: '(1/2)(6)(4) + (1/2)(6)(3) = 12+9' },
        { prompt: 'A rectangle 12×8 with a triangle (base 12, height 5) on top. Total area?', answer: '126', numeric: 126 },
        { prompt: 'A square (side 10) with a quarter-circle (r=10) cut out. Remaining area? (π≈3.14)', answer: '21.5', numeric: 21.5 },
        { prompt: 'Rectangle 6×4 plus triangle base 6, height 3. Total area?', answer: '33', numeric: 33 },
      ],
    },
    'composite-volume': {
      problems: [
        { prompt: 'An L-shaped prism: 8×3×4 minus 3×3×4. Volume?', answer: '60', numeric: 60 },
        { prompt: 'A prism (5×4×6) topped by a prism (5×4×2). Total volume?', answer: '160', numeric: 160 },
        { prompt: 'Two rectangular prisms: 3×3×10 and 3×3×5. Combined volume?', answer: '135', numeric: 135 },
        { prompt: 'A block 10×6×4 with a 2×2×4 hole cut through. Volume?', answer: '224', numeric: 224 },
        { prompt: 'Stack of two cubes: side 3 on top of side 5. Total volume?', answer: '152', numeric: 152 },
        { prompt: 'T-shape prism: top 6×2×3, bottom 2×4×3. Volume?', answer: '60', numeric: 60 },
      ],
    },
    'triangle-inequality': {
      problems: [
        { prompt: 'Can sides 3, 4, 5 form a triangle?', answer: 'yes', hint: '3+4>5, 3+5>4, 4+5>3' },
        { prompt: 'Can sides 1, 2, 5 form a triangle?', answer: 'no', hint: '1+2=3 < 5' },
        { prompt: 'Can sides 7, 7, 12 form a triangle?', answer: 'yes', hint: '7+7=14 > 12' },
        { prompt: 'Can sides 3, 3, 6 form a triangle?', answer: 'no', hint: '3+3=6, not greater than 6' },
        { prompt: 'Two sides are 5 and 8. What is the range for the third side?', answer: '3 < x < 13' },
        { prompt: 'Can sides 6, 8, 10 form a triangle?', answer: 'yes' },
      ],
    },
  },
  'grade-8': {
    'translations': {
      problems: [
        { prompt: 'Translate (3, 5) right 4 and down 2. New coordinates?', answer: '(7, 3)' },
        { prompt: 'Translate (-1, 2) by vector (3, -4). New coordinates?', answer: '(2, -2)' },
        { prompt: 'A(1,1), B(4,1), C(4,3) translated left 5. New vertices?', answer: '(-4,1), (-1,1), (-1,3)' },
        { prompt: 'Point (5, -3) translated to (2, 1). What was the translation?', answer: 'left 3, up 4' },
        { prompt: 'Translate (0, 0) by vector (-2, 6). New point?', answer: '(-2, 6)' },
        { prompt: 'Translate (-3, 4) right 7 and up 1. New coordinates?', answer: '(4, 5)' },
      ],
    },
    'reflections': {
      problems: [
        { prompt: 'Reflect (3, 5) over the y-axis. New coordinates?', answer: '(-3, 5)' },
        { prompt: 'Reflect (4, -2) over the x-axis. New coordinates?', answer: '(4, 2)' },
        { prompt: 'Reflect (-1, 3) over the y-axis. New coordinates?', answer: '(1, 3)' },
        { prompt: 'Reflect (2, -7) over the x-axis. New coordinates?', answer: '(2, 7)' },
        { prompt: 'Reflect (5, 1) over the line y = x. New coordinates?', answer: '(1, 5)' },
        { prompt: 'A point reflects to (-4, 3) over the y-axis. Original point?', answer: '(4, 3)' },
      ],
    },
    'rotations': {
      problems: [
        { prompt: 'Rotate (3, 1) 90° clockwise about the origin. New coordinates?', answer: '(1, -3)' },
        { prompt: 'Rotate (2, 5) 180° about the origin. New coordinates?', answer: '(-2, -5)' },
        { prompt: 'Rotate (-1, 4) 90° counterclockwise about the origin. New coordinates?', answer: '(-4, -1)' },
        { prompt: 'Rotate (4, 0) 90° clockwise about the origin. New coordinates?', answer: '(0, -4)' },
        { prompt: 'Rotate (3, 3) 180° about the origin. New coordinates?', answer: '(-3, -3)' },
        { prompt: 'Rotate (-2, 1) 270° clockwise about the origin. New coordinates?', answer: '(-1, -2)', hint: '270° CW = 90° CCW' },
      ],
    },
    'dilations': {
      problems: [
        { prompt: 'Dilate (3, 4) with scale factor 2 centered at origin. New coordinates?', answer: '(6, 8)' },
        { prompt: 'Dilate (8, 6) with scale factor 1/2 centered at origin. New coordinates?', answer: '(4, 3)' },
        { prompt: 'Dilate (5, -10) with scale factor 3 centered at origin. New coordinates?', answer: '(15, -30)' },
        { prompt: 'A triangle with vertices (2,1),(4,1),(3,4) is dilated by factor 2. New vertices?', answer: '(4,2), (8,2), (6,8)' },
        { prompt: 'Original side: 5. After dilation, side is 15. Scale factor?', answer: '3', numeric: 3 },
        { prompt: 'Dilate (4, -2) with scale factor 0.5 centered at origin. New coordinates?', answer: '(2, -1)' },
      ],
    },
    'congruence-transformations': {
      problems: [
        { prompt: 'Triangle A has vertices (1,1),(3,1),(2,4). Triangle B has vertices (5,1),(7,1),(6,4). What single transformation maps A to B?', answer: 'translation right 4' },
        { prompt: 'Which transformations preserve congruence? Translation, reflection, rotation, or dilation?', answer: 'translation, reflection, rotation' },
        { prompt: 'Triangle A (1,2),(3,2),(2,5) and Triangle B (-1,2),(-3,2),(-2,5). Transformation?', answer: 'reflection over y-axis' },
        { prompt: 'Does a dilation with scale factor 1 preserve congruence?', answer: 'yes' },
        { prompt: 'Are two congruent figures always similar?', answer: 'yes' },
        { prompt: 'A figure is reflected then translated. Is the image congruent to the original?', answer: 'yes' },
      ],
    },
    'similarity-transformations': {
      problems: [
        { prompt: 'Triangle A has sides 3,4,5. Triangle B has sides 6,8,10. Similar? Scale factor?', answer: 'yes, scale factor 2' },
        { prompt: 'What transformations can produce similar figures?', answer: 'translation, reflection, rotation, and dilation' },
        { prompt: 'Rectangle A: 4×6. Rectangle B: 6×9. Similar?', answer: 'yes', hint: 'Scale factor 1.5' },
        { prompt: 'Triangle A sides: 5,7,9. Triangle B sides: 10,14,18. Scale factor?', answer: '2', numeric: 2 },
        { prompt: 'Are all circles similar?', answer: 'yes' },
        { prompt: 'Rectangle A: 3×5. Rectangle B: 6×8. Similar?', answer: 'no', hint: '3/6=0.5 but 5/8=0.625' },
      ],
    },
    'parallel-lines-transversals': {
      problems: [
        { prompt: 'Parallel lines cut by a transversal. One angle is 65°. Find its corresponding angle.', answer: '65', numeric: 65 },
        { prompt: 'Alternate interior angles: one is 120°. Find the other.', answer: '120', numeric: 120 },
        { prompt: 'Co-interior (same-side interior) angles: one is 70°. Find the other.', answer: '110', numeric: 110 },
        { prompt: 'A transversal creates an angle of 55° with one parallel line. Find all 8 angles.', answer: '55, 125, 55, 125, 55, 125, 55, 125' },
        { prompt: 'Alternate exterior angles: one is 3x + 10, the other is 5x - 20. Find x.', answer: '15', numeric: 15 },
        { prompt: 'Corresponding angles: one is 2x + 30, the other is 4x - 10. Find x.', answer: '20', numeric: 20 },
      ],
    },
    'triangle-angle-sum': {
      problems: [
        { prompt: 'A triangle has angles 50° and 70°. Find the third angle.', answer: '60', numeric: 60 },
        { prompt: 'A triangle has angles x, 2x, and 3x. Find x.', answer: '30', numeric: 30, hint: 'x+2x+3x=180 → 6x=180' },
        { prompt: 'An isosceles triangle has a vertex angle of 40°. Find each base angle.', answer: '70', numeric: 70 },
        { prompt: 'Exterior angle is 130°. One remote interior angle is 55°. Find the other.', answer: '75', numeric: 75 },
        { prompt: 'A right triangle has one angle of 35°. Find the other acute angle.', answer: '55', numeric: 55 },
        { prompt: 'Triangle angles are (x+10), (2x-5), and (x+15). Find x.', answer: '40', numeric: 40 },
      ],
    },
    'pythagorean-theorem': {
      problems: [
        { prompt: 'Right triangle: legs 3 and 4. Find the hypotenuse.', answer: '5', numeric: 5 },
        { prompt: 'Right triangle: legs 5 and 12. Find the hypotenuse.', answer: '13', numeric: 13 },
        { prompt: 'Right triangle: leg 6, hypotenuse 10. Find the other leg.', answer: '8', numeric: 8, hint: '10²-6²=100-36=64, √64=8' },
        { prompt: 'A ladder is 13 ft long, base is 5 ft from wall. How high does it reach?', answer: '12', numeric: 12 },
        { prompt: 'Right triangle: legs 8 and 15. Find the hypotenuse.', answer: '17', numeric: 17 },
        { prompt: 'Right triangle: leg 9, hypotenuse 15. Find the other leg.', answer: '12', numeric: 12 },
        { prompt: 'Right triangle: legs 7 and 24. Find the hypotenuse.', answer: '25', numeric: 25 },
        { prompt: 'A TV is 48 in wide and 36 in tall. Diagonal?', answer: '60', numeric: 60 },
      ],
    },
    'pythagorean-converse': {
      problems: [
        { prompt: 'Sides 5, 12, 13. Is it a right triangle?', answer: 'yes', hint: '5²+12²=25+144=169=13²' },
        { prompt: 'Sides 4, 5, 6. Is it a right triangle?', answer: 'no', hint: '4²+5²=41≠36=6²' },
        { prompt: 'Sides 8, 15, 17. Is it a right triangle?', answer: 'yes', hint: '64+225=289=17²' },
        { prompt: 'Sides 6, 7, 10. Is it a right triangle?', answer: 'no', hint: '36+49=85≠100' },
        { prompt: 'Sides 9, 12, 15. Is it a right triangle?', answer: 'yes', hint: '81+144=225=15²' },
        { prompt: 'Sides 10, 24, 26. Is it a right triangle?', answer: 'yes', hint: '100+576=676=26²' },
      ],
    },
    'distance-formula': {
      problems: [
        { prompt: 'Distance between (1, 2) and (4, 6)?', answer: '5', numeric: 5, hint: '√(9+16)=√25=5' },
        { prompt: 'Distance between (0, 0) and (3, 4)?', answer: '5', numeric: 5 },
        { prompt: 'Distance between (-3, 1) and (5, -5)?', answer: '10', numeric: 10, hint: '√(64+36)=√100' },
        { prompt: 'Distance between (2, -1) and (-1, 3)?', answer: '5', numeric: 5, hint: '√(9+16)=√25' },
        { prompt: 'Distance between (-4, -3) and (4, 3)?', answer: '10', numeric: 10 },
        { prompt: 'Distance between (1, 1) and (7, 9)?', answer: '10', numeric: 10, hint: '√(36+64)=√100' },
      ],
    },
  },
};

// File I/O

function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }
function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }

function loadProfile(id) {
  const fp = profilePath(id);
  if (fs.existsSync(fp)) { try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); } }
  return { studentId: id, grade: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
}

function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }
function calcMastery(attempts) { if (!attempts || !attempts.length) return 0; const recent = attempts.slice(-5).filter(a => a.total > 0); return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0; }
function masteryLabel(r) { return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started'; }
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }
function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9.,/°() -]/g, '').replace(/\s+/g, ' '); }

function generateExercise(grade, skill, count = 5) {
  const bank = PROBLEM_BANKS[grade]?.[skill];
  if (!bank) return { error: `No problem bank for ${grade}/${skill}` };
  const items = pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer, ...(p.hint && { hint: p.hint }) }));
  return { type: 'geometry', skill, grade, count: items.length, instruction: 'Solve each problem. Show your work and include units.', items };
}

function checkAnswer(type, expected, answer) {
  const ne = norm(expected); const na = norm(answer);
  if (ne === na) return true;
  const numE = parseFloat(expected); const numA = parseFloat(answer);
  if (!isNaN(numE) && !isNaN(numA) && Math.abs(numE - numA) < 0.05) return true;
  if (ne.replace(/\s/g, '') === na.replace(/\s/g, '')) return true;
  return false;
}

class MSGeometry {
  getProfile(id) { const p = loadProfile(id); return { studentId: p.studentId, grade: p.grade, createdAt: p.createdAt, totalAssessments: p.assessments.length }; }
  setGrade(id, grade) { if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}. Valid: ${Object.keys(SKILLS).join(', ')}`); const p = loadProfile(id); p.grade = grade; saveProfile(p); return { studentId: id, grade }; }

  recordAssessment(id, grade, category, skill, score, total, notes = '') {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}`);
    if (!SKILLS[grade][category]) throw new Error(`Unknown category '${category}' for ${grade}`);
    if (!SKILLS[grade][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${grade}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id); if (!p.grade) p.grade = grade;
    const entry = { date: new Date().toISOString(), grade, category, skill, score, total, notes };
    p.assessments.push(entry); const key = `${grade}/${category}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p);
    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  getProgress(id) {
    const p = loadProfile(id); const grade = p.grade || 'grade-6'; const gs = SKILLS[grade] || {};
    const results = {}; let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(gs)) { results[cat] = {}; for (const sk of skills) { total++; const d = p.skills[`${grade}/${cat}/${sk}`]; results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' }; if (d && d.mastery >= MASTERY_THRESHOLD) mastered++; } }
    return { studentId: id, grade, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id); const grade = p.grade || 'grade-6'; const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS[grade] || {})) { for (const sk of skills) { const d = p.skills[`${grade}/${cat}/${sk}`]; const m = d ? d.mastery : 0; if (m < MASTERY_THRESHOLD) candidates.push({ grade, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' }); } }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, grade, next: candidates.slice(0, count) };
  }

  getReport(id) { const p = loadProfile(id); return { studentId: id, grade: p.grade, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }
  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }
  getSkillCatalog(grade) { const gs = SKILLS[grade]; if (!gs) return { grade, error: `Unknown grade. Valid: ${Object.keys(SKILLS).join(', ')}` }; let total = 0; const catalog = {}; for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; } return { grade, skills: catalog, totalSkills: total }; }
  generateExercise(grade, skill, count = 5) { return generateExercise(grade, skill, count); }
  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  generateLesson(id) {
    const p = loadProfile(id); const grade = p.grade || 'grade-6';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient!`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    return { studentId: id, grade, targetSkill: target, exercise, lessonPlan: { review: 'Review prerequisite geometry concepts (2-3 min)', teach: `Introduce/reinforce: ${target.category} → ${target.skill}`, practice: `Complete ${exercise.count || 0} practice items`, apply: 'Apply to a real-world geometric context' } };
  }
}

module.exports = MSGeometry;

if (require.main === module) {
  const args = process.argv.slice(2); const cmd = args[0]; const api = new MSGeometry();
  const out = d => console.log(JSON.stringify(d, null, 2));
  try {
    switch (cmd) {
      case 'start': { const [, id, grade] = args; if (!id) throw new Error('Usage: start <id> [grade]'); if (grade) api.setGrade(id, grade); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const grade = loadProfile(id).grade || 'grade-6'; if (skill) { out(api.generateExercise(grade, skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); out(api.checkAnswer(type, expected, answer)); break; }
      case 'record': { const [, id, grade, cat, skill, sc, tot, ...notes] = args; if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]'); out(api.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? api.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(api.setGrade(id, g)); break; }
      default: out({ usage: 'node geometry.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
