// eClaw HS Math Geometry Interactive Tutor (Grades 9-10). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-math-geometry');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'foundations': {
    'angles': ['angle-types', 'angle-pairs', 'angle-in-triangle'],
    'parallel-lines': ['transversal-angles', 'proving-parallel'],
    'basic-triangles': ['classify-triangles', 'triangle-inequality', 'exterior-angle'],
  },
  'proofs': {
    'triangle-congruence': ['sss', 'sas', 'asa-aas', 'hl', 'cpctc'],
    'similarity': ['aa-similarity', 'sas-sss-similarity', 'proportional-reasoning'],
    'quadrilaterals': ['parallelogram-properties', 'special-quadrilaterals'],
  },
  'advanced': {
    'right-triangles': ['pythagorean-theorem', 'special-right-triangles', 'trig-ratios-intro'],
    'circles': ['central-inscribed-angles', 'arc-length-sector', 'tangent-lines'],
    'area-volume': ['polygon-area', 'surface-area', 'volume-formulas'],
    'coordinate-geo': ['distance-midpoint', 'slope-proofs', 'equation-of-circle'],
    'transformations': ['translations', 'reflections', 'rotations', 'dilations'],
  },
};

const PROBLEM_BANKS = {
  'foundations': {
    'angle-types': {
      problems: [
        { prompt: 'Classify a 75-degree angle', answer: 'acute', solution: '0 < 75 < 90, so acute' },
        { prompt: 'Classify a 90-degree angle', answer: 'right', solution: 'Exactly 90 degrees = right angle' },
        { prompt: 'Classify a 135-degree angle', answer: 'obtuse', solution: '90 < 135 < 180, so obtuse' },
        { prompt: 'Classify a 180-degree angle', answer: 'straight', solution: 'Exactly 180 degrees = straight angle' },
        { prompt: 'What is the complement of a 35-degree angle?', answer: '55', solution: '90 - 35 = 55 degrees' },
        { prompt: 'What is the supplement of a 110-degree angle?', answer: '70', solution: '180 - 110 = 70 degrees' },
        { prompt: 'Two complementary angles: one is 3x, other is 2x. Find x.', answer: '18', solution: '3x + 2x = 90, 5x = 90, x = 18' },
      ],
    },
    'angle-pairs': {
      problems: [
        { prompt: 'Vertical angles measure 3x + 10 and 5x - 20. Find x.', answer: '15', solution: '3x + 10 = 5x - 20, 30 = 2x, x = 15' },
        { prompt: 'Two supplementary angles: one is 4x, other is 2x + 30. Find x.', answer: '25', solution: '4x + 2x + 30 = 180, 6x = 150, x = 25' },
        { prompt: 'Are vertical angles always congruent?', answer: 'yes', solution: 'Vertical angles theorem: vertical angles are congruent' },
        { prompt: 'Linear pair angles sum to what?', answer: '180', solution: 'Linear pair angles are supplementary = 180 degrees' },
        { prompt: 'If angle A = 47 degrees, find its vertical angle.', answer: '47', solution: 'Vertical angles are congruent' },
        { prompt: 'Two angles form a linear pair. One is 65 degrees. Find the other.', answer: '115', solution: '180 - 65 = 115' },
      ],
    },
    'angle-in-triangle': {
      problems: [
        { prompt: 'Triangle angles are 50, 60, and x. Find x.', answer: '70', solution: '50 + 60 + x = 180, x = 70' },
        { prompt: 'Triangle angles are x, 2x, and 3x. Find x.', answer: '30', solution: 'x + 2x + 3x = 180, 6x = 180, x = 30' },
        { prompt: 'An isosceles triangle has a vertex angle of 40. Find each base angle.', answer: '70', solution: '(180 - 40)/2 = 70' },
        { prompt: 'Can a triangle have angles 90, 50, and 50?', answer: 'no', solution: '90 + 50 + 50 = 190, not 180' },
        { prompt: 'An equilateral triangle has angles of what measure?', answer: '60', solution: '180/3 = 60 each' },
        { prompt: 'Triangle angles are 45, 45, and x. Find x.', answer: '90', solution: '180 - 45 - 45 = 90 (right triangle)' },
      ],
    },
    'transversal-angles': {
      problems: [
        { prompt: 'Parallel lines cut by transversal: corresponding angles are 3x + 10 and 5x - 30. Find x.', answer: '20', solution: '3x + 10 = 5x - 30, 40 = 2x, x = 20' },
        { prompt: 'Alternate interior angles with parallel lines are always...', answer: 'congruent', solution: 'Alternate Interior Angles Theorem' },
        { prompt: 'Co-interior (same-side interior) angles with parallel lines sum to...', answer: '180', solution: 'Same-side interior angles are supplementary' },
        { prompt: 'Parallel lines: alternate exterior angles are 2x + 15 and 4x - 25. Find x.', answer: '20', solution: '2x + 15 = 4x - 25, 40 = 2x, x = 20' },
        { prompt: 'If corresponding angles are NOT equal, are the lines parallel?', answer: 'no', solution: 'Converse: lines are parallel only if corresponding angles are congruent' },
      ],
    },
    'proving-parallel': {
      problems: [
        { prompt: 'What must be true for two lines cut by a transversal to be parallel? (corresponding angles)', answer: 'corresponding angles must be congruent', solution: 'Converse of Corresponding Angles Postulate' },
        { prompt: 'Lines l and m: alternate interior angles are 55 and 55. Parallel?', answer: 'yes', solution: 'Congruent alternate interior angles => parallel' },
        { prompt: 'Lines l and m: same-side interior angles are 100 and 70. Parallel?', answer: 'no', solution: '100 + 70 = 170, not 180' },
        { prompt: 'Lines l and m: corresponding angles are 3x and 2x + 20. Find x for parallel.', answer: '20', solution: '3x = 2x + 20, x = 20' },
      ],
    },
    'classify-triangles': {
      problems: [
        { prompt: 'Classify by sides: 3, 3, 3', answer: 'equilateral', solution: 'All sides equal' },
        { prompt: 'Classify by sides: 5, 5, 8', answer: 'isosceles', solution: 'Exactly two sides equal' },
        { prompt: 'Classify by sides: 3, 4, 5', answer: 'scalene', solution: 'No sides equal' },
        { prompt: 'Classify by angles: 60, 70, 50', answer: 'acute', solution: 'All angles less than 90' },
        { prompt: 'Classify by angles: 30, 60, 90', answer: 'right', solution: 'One angle equals 90' },
        { prompt: 'Classify by angles: 20, 130, 30', answer: 'obtuse', solution: 'One angle greater than 90' },
      ],
    },
    'triangle-inequality': {
      problems: [
        { prompt: 'Can sides 3, 4, 8 form a triangle?', answer: 'no', solution: '3 + 4 = 7 < 8, violates triangle inequality' },
        { prompt: 'Can sides 5, 7, 10 form a triangle?', answer: 'yes', solution: '5+7=12>10, 5+10=15>7, 7+10=17>5' },
        { prompt: 'Two sides are 6 and 10. What is the range for the third side?', answer: '4 < x < 16', solution: '|10-6| < x < 10+6' },
        { prompt: 'Can sides 1, 1, 2 form a triangle?', answer: 'no', solution: '1 + 1 = 2, not greater than 2' },
        { prompt: 'Two sides are 8 and 3. What is the range for the third side?', answer: '5 < x < 11', solution: '|8-3| < x < 8+3' },
      ],
    },
    'exterior-angle': {
      problems: [
        { prompt: 'Remote interior angles are 50 and 70. Find the exterior angle.', answer: '120', solution: 'Exterior = sum of remote interior = 50 + 70 = 120' },
        { prompt: 'Exterior angle is 110, one remote interior is 45. Find the other.', answer: '65', solution: '110 - 45 = 65' },
        { prompt: 'Exterior angle is 3x, remote interiors are x and x + 20. Find x.', answer: '20', solution: '3x = x + x + 20, 3x = 2x + 20, x = 20' },
        { prompt: 'Can an exterior angle of a triangle be 90 degrees?', answer: 'yes', solution: 'If remote interiors sum to 90 (e.g., 45 and 45)' },
      ],
    },
  },
  'proofs': {
    'sss': {
      problems: [
        { prompt: 'Triangle ABC: AB=5, BC=7, CA=9. Triangle DEF: DE=5, EF=7, FD=9. Congruent by?', answer: 'SSS', solution: 'All three pairs of sides congruent' },
        { prompt: 'If all three sides of one triangle equal all three sides of another, what postulate?', answer: 'SSS', solution: 'Side-Side-Side Congruence Postulate' },
        { prompt: 'AB=DE, BC=EF, AC=DF. State the triangle congruence.', answer: 'triangle ABC is congruent to triangle DEF by SSS', solution: 'Match corresponding vertices by matching sides' },
        { prompt: 'Two equilateral triangles both have side length 6. Congruent?', answer: 'yes, by SSS', solution: 'All three pairs of sides are 6 = 6' },
      ],
    },
    'sas': {
      problems: [
        { prompt: 'AB=DE, angle B = angle E, BC=EF. Congruent by?', answer: 'SAS', solution: 'Two sides and the included angle' },
        { prompt: 'Why must the angle be BETWEEN the two sides for SAS?', answer: 'SSA is ambiguous and does not prove congruence', solution: 'The included angle uniquely determines the triangle' },
        { prompt: 'AB=5, BC=8, angle B=60. DE=5, EF=8, angle E=60. Congruent?', answer: 'yes, by SAS', solution: 'Two sides and included angle match' },
        { prompt: 'AB=DE, AC=DF, angle A = angle D. Congruent by?', answer: 'SAS', solution: 'Angle A is between sides AB and AC' },
      ],
    },
    'asa-aas': {
      problems: [
        { prompt: 'Angle A = angle D, AB = DE, angle B = angle E. Congruent by?', answer: 'ASA', solution: 'Two angles and the included side' },
        { prompt: 'Angle A = angle D, angle B = angle E, BC = EF. Congruent by?', answer: 'AAS', solution: 'Two angles and a non-included side' },
        { prompt: 'If two angles of one triangle equal two angles of another, are the triangles congruent?', answer: 'not necessarily', solution: 'AAA proves similarity, not congruence (need a side)' },
        { prompt: 'Angle P = 40, angle Q = 60, PQ = 7. Angle X = 40, angle Y = 60, XY = 7. Congruent?', answer: 'yes, by ASA', solution: 'PQ and XY are the sides between the equal angles' },
      ],
    },
    'hl': {
      problems: [
        { prompt: 'Right triangle: hypotenuse=10, leg=6. Another right triangle: hypotenuse=10, leg=6. Congruent?', answer: 'yes, by HL', solution: 'Hypotenuse-Leg theorem for right triangles' },
        { prompt: 'When can you use HL?', answer: 'only for right triangles', solution: 'HL requires both triangles to be right triangles' },
        { prompt: 'Right triangles with hypotenuse 13 and leg 5. What is the other leg?', answer: '12', solution: 'sqrt(13^2 - 5^2) = sqrt(169 - 25) = sqrt(144) = 12' },
        { prompt: 'Is HL valid for non-right triangles?', answer: 'no', solution: 'HL is specifically for right triangles only' },
      ],
    },
    'cpctc': {
      problems: [
        { prompt: 'What does CPCTC stand for?', answer: 'Corresponding Parts of Congruent Triangles are Congruent', solution: 'Used AFTER proving triangles congruent' },
        { prompt: 'Triangles ABC and DEF are congruent by SAS. Name the part: AC corresponds to?', answer: 'DF', solution: 'Match the order of vertices' },
        { prompt: 'After proving triangle PQR congruent to triangle XYZ, can we conclude PQ = XY?', answer: 'yes, by CPCTC', solution: 'Corresponding sides of congruent triangles' },
        { prompt: 'Can you use CPCTC BEFORE proving triangles congruent?', answer: 'no', solution: 'Must prove congruence first, then apply CPCTC' },
      ],
    },
    'aa-similarity': {
      problems: [
        { prompt: 'Triangle 1: angles 40, 60, 80. Triangle 2: angles 40, 60, 80. Similar?', answer: 'yes, by AA', solution: 'Two pairs of congruent angles (third is automatic)' },
        { prompt: 'Triangle 1: angles 30, 90. Triangle 2: angles 30, 90. Similar?', answer: 'yes, by AA', solution: 'Two angles match; third must be 60 in both' },
        { prompt: 'Similar triangles have sides 3,4,5 and 6,8,10. What is the scale factor?', answer: '2', solution: '6/3 = 8/4 = 10/5 = 2' },
        { prompt: 'Angle A = Angle D, Angle B = Angle E. Are triangles ABC and DEF similar?', answer: 'yes, by AA', solution: 'Two pairs of congruent angles suffice' },
      ],
    },
    'sas-sss-similarity': {
      problems: [
        { prompt: 'Triangle 1: sides 3, 5. Triangle 2: sides 6, 10. Included angles equal. Similar by?', answer: 'SAS similarity', solution: 'Sides proportional (ratio 2) with included angle congruent' },
        { prompt: 'Triangle 1: sides 2, 3, 4. Triangle 2: sides 4, 6, 8. Similar?', answer: 'yes, by SSS similarity', solution: 'All ratios equal: 4/2 = 6/3 = 8/4 = 2' },
        { prompt: 'Triangle 1: sides 5, 7, 9. Triangle 2: sides 10, 14, 20. Similar?', answer: 'no', solution: '10/5=2, 14/7=2, but 20/9 is not 2' },
        { prompt: 'Scale factor is 3. Original side is 7. Find corresponding side.', answer: '21', solution: '7 * 3 = 21' },
      ],
    },
    'proportional-reasoning': {
      problems: [
        { prompt: 'In similar triangles, sides are 4, 6, x and 8, 12, 14. Find x.', answer: '7', solution: 'Scale factor = 8/4 = 2; x = 14/2 = 7' },
        { prompt: 'A 6-ft person casts a 4-ft shadow. A tree casts a 20-ft shadow. Tree height?', answer: '30', solution: '6/4 = x/20, x = 30' },
        { prompt: 'Similar triangles with perimeters 12 and 18. Scale factor?', answer: '3/2', solution: '18/12 = 3/2' },
        { prompt: 'Scale factor is 5. Original area is 12. New area?', answer: '300', solution: 'Area scales by k^2: 12 * 25 = 300' },
      ],
    },
    'parallelogram-properties': {
      problems: [
        { prompt: 'In a parallelogram, opposite sides are...', answer: 'congruent and parallel', solution: 'Definition and properties of parallelogram' },
        { prompt: 'Parallelogram ABCD: angle A = 70. Find angle B.', answer: '110', solution: 'Consecutive angles are supplementary: 180 - 70 = 110' },
        { prompt: 'Parallelogram ABCD: angle A = 70. Find angle C.', answer: '70', solution: 'Opposite angles are congruent' },
        { prompt: 'Do diagonals of a parallelogram bisect each other?', answer: 'yes', solution: 'Diagonals bisect each other in all parallelograms' },
        { prompt: 'Parallelogram: one side is 8, opposite side is?', answer: '8', solution: 'Opposite sides of a parallelogram are congruent' },
      ],
    },
    'special-quadrilaterals': {
      problems: [
        { prompt: 'What special property do rectangle diagonals have?', answer: 'they are congruent', solution: 'Rectangle diagonals are congruent and bisect each other' },
        { prompt: 'What special property do rhombus diagonals have?', answer: 'they are perpendicular', solution: 'Rhombus diagonals are perpendicular bisectors of each other' },
        { prompt: 'Is every square a rectangle?', answer: 'yes', solution: 'A square has all rectangle properties plus all sides congruent' },
        { prompt: 'Is every rectangle a square?', answer: 'no', solution: 'A rectangle need not have all four sides congruent' },
        { prompt: 'A quadrilateral has exactly one pair of parallel sides. What is it?', answer: 'trapezoid', solution: 'Definition of trapezoid' },
      ],
    },
  },
  'advanced': {
    'pythagorean-theorem': {
      problems: [
        { prompt: 'Find c: a = 3, b = 4', answer: '5', solution: 'c = sqrt(9 + 16) = sqrt(25) = 5' },
        { prompt: 'Find a: b = 5, c = 13', answer: '12', solution: 'a = sqrt(169 - 25) = sqrt(144) = 12' },
        { prompt: 'Is 7, 24, 25 a right triangle?', answer: 'yes', solution: '49 + 576 = 625 = 25^2' },
        { prompt: 'Find the diagonal of a rectangle with sides 6 and 8', answer: '10', solution: 'd = sqrt(36 + 64) = sqrt(100) = 10' },
        { prompt: 'Find c: a = 5, b = 12', answer: '13', solution: 'c = sqrt(25 + 144) = sqrt(169) = 13' },
        { prompt: 'Is 5, 6, 8 a right triangle?', answer: 'no', solution: '25 + 36 = 61, not 64' },
      ],
    },
    'special-right-triangles': {
      problems: [
        { prompt: '45-45-90 triangle with leg = 5. Find hypotenuse.', answer: '5*sqrt(2)', solution: 'Hypotenuse = leg * sqrt(2)' },
        { prompt: '30-60-90 triangle with short leg = 4. Find hypotenuse.', answer: '8', solution: 'Hypotenuse = 2 * short leg' },
        { prompt: '30-60-90 triangle with short leg = 4. Find long leg.', answer: '4*sqrt(3)', solution: 'Long leg = short leg * sqrt(3)' },
        { prompt: '45-45-90 triangle with hypotenuse = 10. Find each leg.', answer: '5*sqrt(2)', solution: 'Leg = hypotenuse / sqrt(2) = 10*sqrt(2)/2 = 5*sqrt(2)' },
        { prompt: '30-60-90 triangle with hypotenuse = 12. Find short leg.', answer: '6', solution: 'Short leg = hypotenuse / 2 = 6' },
        { prompt: '30-60-90 triangle with long leg = 9*sqrt(3). Find short leg.', answer: '9', solution: 'Short leg = long leg / sqrt(3) = 9' },
      ],
    },
    'trig-ratios-intro': {
      problems: [
        { prompt: 'Right triangle: opposite = 3, hypotenuse = 5. Find sin(A).', answer: '3/5', solution: 'sin = opposite / hypotenuse = 3/5' },
        { prompt: 'Right triangle: adjacent = 4, hypotenuse = 5. Find cos(A).', answer: '4/5', solution: 'cos = adjacent / hypotenuse = 4/5' },
        { prompt: 'Right triangle: opposite = 3, adjacent = 4. Find tan(A).', answer: '3/4', solution: 'tan = opposite / adjacent = 3/4' },
        { prompt: 'SOH CAH TOA: what does SOH mean?', answer: 'sin = opposite / hypotenuse', solution: 'Sin = Opposite / Hypotenuse' },
        { prompt: 'If sin(A) = 5/13, and hypotenuse = 13, find opposite side.', answer: '5', solution: 'opposite = sin(A) * hypotenuse = 5' },
      ],
    },
    'central-inscribed-angles': {
      problems: [
        { prompt: 'Central angle is 80 degrees. Find the intercepted arc.', answer: '80', solution: 'Central angle = intercepted arc' },
        { prompt: 'Inscribed angle is 35 degrees. Find the intercepted arc.', answer: '70', solution: 'Inscribed angle = half the intercepted arc; arc = 2 * 35 = 70' },
        { prompt: 'Intercepted arc is 120 degrees. Find the inscribed angle.', answer: '60', solution: 'Inscribed angle = arc / 2 = 120 / 2 = 60' },
        { prompt: 'An inscribed angle intercepts a semicircle. What is the angle?', answer: '90', solution: 'Semicircle = 180 degrees arc; inscribed angle = 180/2 = 90' },
        { prompt: 'Two inscribed angles intercept the same arc of 100 degrees. Are they equal?', answer: 'yes, both are 50', solution: 'Inscribed angles on the same arc are congruent' },
      ],
    },
    'arc-length-sector': {
      problems: [
        { prompt: 'Circle radius 10, central angle 90 degrees. Find arc length. (Use pi)', answer: '5*pi', solution: 'Arc = (90/360) * 2*pi*10 = (1/4) * 20*pi = 5*pi' },
        { prompt: 'Circle radius 6, central angle 60 degrees. Find sector area. (Use pi)', answer: '6*pi', solution: 'Area = (60/360) * pi * 36 = (1/6) * 36*pi = 6*pi' },
        { prompt: 'Circle radius 8, central angle 45 degrees. Find arc length. (Use pi)', answer: '2*pi', solution: 'Arc = (45/360) * 2*pi*8 = (1/8)*16*pi = 2*pi' },
        { prompt: 'Circle radius 5, full circle. Find circumference. (Use pi)', answer: '10*pi', solution: 'C = 2*pi*r = 2*pi*5 = 10*pi' },
      ],
    },
    'tangent-lines': {
      problems: [
        { prompt: 'A tangent meets a radius at what angle?', answer: '90', solution: 'Tangent is perpendicular to radius at point of tangency' },
        { prompt: 'Two tangent segments from external point are 8 each. If radius is 6, find distance from center to external point.', answer: '10', solution: 'Right triangle: 6^2 + 8^2 = 100, distance = 10' },
        { prompt: 'Tangent segment from point P is 12, distance from P to center is 13. Find radius.', answer: '5', solution: 'r^2 + 12^2 = 13^2, r^2 = 169 - 144 = 25, r = 5' },
        { prompt: 'Two tangent segments from the same external point are always...', answer: 'congruent', solution: 'Two-tangent theorem' },
      ],
    },
    'polygon-area': {
      problems: [
        { prompt: 'Triangle: base 10, height 6. Find area.', answer: '30', solution: 'A = (1/2)(10)(6) = 30' },
        { prompt: 'Parallelogram: base 8, height 5. Find area.', answer: '40', solution: 'A = bh = 8 * 5 = 40' },
        { prompt: 'Trapezoid: bases 6 and 10, height 4. Find area.', answer: '32', solution: 'A = (1/2)(6+10)(4) = (1/2)(16)(4) = 32' },
        { prompt: 'Rectangle: length 12, width 7. Find area.', answer: '84', solution: 'A = lw = 12 * 7 = 84' },
        { prompt: 'Circle: radius 5. Find area. (Use pi)', answer: '25*pi', solution: 'A = pi*r^2 = 25*pi' },
        { prompt: 'Regular hexagon: side 4, apothem 2*sqrt(3). Find area.', answer: '24*sqrt(3)', solution: 'A = (1/2)(apothem)(perimeter) = (1/2)(2*sqrt(3))(24) = 24*sqrt(3)' },
      ],
    },
    'surface-area': {
      problems: [
        { prompt: 'Rectangular prism: 3 x 4 x 5. Find surface area.', answer: '94', solution: 'SA = 2(3*4 + 3*5 + 4*5) = 2(12 + 15 + 20) = 94' },
        { prompt: 'Cube with side 6. Find surface area.', answer: '216', solution: 'SA = 6s^2 = 6(36) = 216' },
        { prompt: 'Cylinder: r=3, h=7. Find surface area. (Use pi)', answer: '60*pi', solution: 'SA = 2*pi*r^2 + 2*pi*r*h = 18*pi + 42*pi = 60*pi' },
        { prompt: 'Sphere: r=4. Find surface area. (Use pi)', answer: '64*pi', solution: 'SA = 4*pi*r^2 = 4*pi*16 = 64*pi' },
      ],
    },
    'volume-formulas': {
      problems: [
        { prompt: 'Rectangular prism: 3 x 4 x 5. Find volume.', answer: '60', solution: 'V = lwh = 3*4*5 = 60' },
        { prompt: 'Cylinder: r=3, h=10. Find volume. (Use pi)', answer: '90*pi', solution: 'V = pi*r^2*h = pi*9*10 = 90*pi' },
        { prompt: 'Cone: r=4, h=9. Find volume. (Use pi)', answer: '48*pi', solution: 'V = (1/3)*pi*r^2*h = (1/3)*pi*16*9 = 48*pi' },
        { prompt: 'Sphere: r=3. Find volume. (Use pi)', answer: '36*pi', solution: 'V = (4/3)*pi*r^3 = (4/3)*pi*27 = 36*pi' },
        { prompt: 'Pyramid: square base side 6, height 10. Find volume.', answer: '120', solution: 'V = (1/3)*B*h = (1/3)*36*10 = 120' },
      ],
    },
    'distance-midpoint': {
      problems: [
        { prompt: 'Distance between (1, 2) and (4, 6)', answer: '5', solution: 'sqrt((4-1)^2 + (6-2)^2) = sqrt(9+16) = 5' },
        { prompt: 'Midpoint of (2, 8) and (6, 4)', answer: '(4, 6)', solution: '((2+6)/2, (8+4)/2) = (4, 6)' },
        { prompt: 'Distance between (-3, 1) and (5, 7)', answer: '10', solution: 'sqrt(64 + 36) = sqrt(100) = 10' },
        { prompt: 'Midpoint of (-1, 5) and (7, -3)', answer: '(3, 1)', solution: '((-1+7)/2, (5+(-3))/2) = (3, 1)' },
        { prompt: 'Distance between (0, 0) and (5, 12)', answer: '13', solution: 'sqrt(25 + 144) = sqrt(169) = 13' },
      ],
    },
    'slope-proofs': {
      problems: [
        { prompt: 'Lines with slopes 3 and 3. Parallel or perpendicular?', answer: 'parallel', solution: 'Same slope => parallel' },
        { prompt: 'Lines with slopes 2 and -1/2. Parallel or perpendicular?', answer: 'perpendicular', solution: 'Product = 2 * (-1/2) = -1 => perpendicular' },
        { prompt: 'Line through (0,0) and (3,6). Slope?', answer: '2', solution: '(6-0)/(3-0) = 2' },
        { prompt: 'Line y = 3x + 1. Find slope of a perpendicular line.', answer: '-1/3', solution: 'Negative reciprocal of 3 is -1/3' },
        { prompt: 'Quadrilateral ABCD: AB slope 2, CD slope 2, BC slope -3, AD slope -3. What shape?', answer: 'parallelogram', solution: 'Opposite sides have equal slopes => parallel' },
      ],
    },
    'equation-of-circle': {
      problems: [
        { prompt: 'Write equation: center (0,0), radius 5', answer: 'x^2 + y^2 = 25', solution: '(x-0)^2 + (y-0)^2 = 5^2' },
        { prompt: 'Write equation: center (3, -2), radius 4', answer: '(x-3)^2 + (y+2)^2 = 16', solution: '(x-h)^2 + (y-k)^2 = r^2' },
        { prompt: 'Find center and radius: (x-1)^2 + (y-5)^2 = 9', answer: 'center (1,5), radius 3', solution: 'h=1, k=5, r=sqrt(9)=3' },
        { prompt: 'Find center and radius: x^2 + y^2 = 49', answer: 'center (0,0), radius 7', solution: 'h=0, k=0, r=sqrt(49)=7' },
      ],
    },
    'translations': {
      problems: [
        { prompt: 'Translate (3, 5) by <2, -3>', answer: '(5, 2)', solution: '(3+2, 5+(-3)) = (5, 2)' },
        { prompt: 'Translate (-1, 4) by <5, 1>', answer: '(4, 5)', solution: '(-1+5, 4+1) = (4, 5)' },
        { prompt: 'What translation maps (2, 7) to (5, 3)?', answer: '<3, -4>', solution: '(5-2, 3-7) = (3, -4)' },
        { prompt: 'Does a translation change the size or shape?', answer: 'no', solution: 'Translations are rigid motions (isometries)' },
      ],
    },
    'reflections': {
      problems: [
        { prompt: 'Reflect (3, 5) over the x-axis', answer: '(3, -5)', solution: '(x, y) -> (x, -y)' },
        { prompt: 'Reflect (3, 5) over the y-axis', answer: '(-3, 5)', solution: '(x, y) -> (-x, y)' },
        { prompt: 'Reflect (2, 7) over the line y = x', answer: '(7, 2)', solution: '(x, y) -> (y, x)' },
        { prompt: 'Reflect (-4, 1) over the x-axis', answer: '(-4, -1)', solution: '(x, y) -> (x, -y)' },
      ],
    },
    'rotations': {
      problems: [
        { prompt: 'Rotate (3, 5) 90 degrees CCW about the origin', answer: '(-5, 3)', solution: '(x, y) -> (-y, x)' },
        { prompt: 'Rotate (2, -1) 180 degrees about the origin', answer: '(-2, 1)', solution: '(x, y) -> (-x, -y)' },
        { prompt: 'Rotate (4, 0) 90 degrees CW about the origin', answer: '(0, -4)', solution: '(x, y) -> (y, -x)' },
        { prompt: 'Rotate (1, 3) 270 degrees CCW about the origin', answer: '(3, -1)', solution: '270 CCW = 90 CW: (x, y) -> (y, -x)' },
      ],
    },
    'dilations': {
      problems: [
        { prompt: 'Dilate (3, 5) by factor 2, center origin', answer: '(6, 10)', solution: '(3*2, 5*2) = (6, 10)' },
        { prompt: 'Dilate (8, 4) by factor 1/2, center origin', answer: '(4, 2)', solution: '(8*(1/2), 4*(1/2)) = (4, 2)' },
        { prompt: 'Is a dilation a rigid motion?', answer: 'no', solution: 'Dilations change size (unless scale factor is 1)' },
        { prompt: 'Dilate (6, -3) by factor 3, center origin', answer: '(18, -9)', solution: '(6*3, -3*3) = (18, -9)' },
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

function norm(s) { return String(s).toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^a-z0-9 +\-*/^().=<>!,]/g, ''); }

// Exercise generation

function generateExercise(level, skill, count = 5) {
  const bank = PROBLEM_BANKS[level]?.[skill];
  if (!bank) return { error: `No problem bank for ${level}/${skill}` };
  const items = pick(bank.problems, count).map(p => ({
    prompt: p.prompt, answer: p.answer, solution: p.solution, type: 'geometry',
  }));
  return { type: 'geometry', skill, level, count: items.length, instruction: 'Solve each geometry problem.', items };
}

function checkAnswer(type, expected, answer) {
  return { correct: norm(expected) === norm(answer), expected, studentAnswer: answer };
}

// Public API

class HSGeometry {
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
    const gs = SKILLS[level] || {};
    const results = {};
    let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(gs)) {
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
    const gs = SKILLS[level];
    if (!gs) return { level, error: `Unknown level. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0;
    const catalog = {};
    for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; }
    return { level, skills: catalog, totalSkills: total };
  }

  generateExercise(level, skill, count = 5) { return generateExercise(level, skill, count); }
  checkAnswer(type, expected, answer) { return checkAnswer(type, expected, answer); }

  generateLesson(id) {
    const p = loadProfile(id);
    const level = p.level || 'foundations';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient!`, level };
    const exercise = generateExercise(level, target.skill, 5);
    return {
      studentId: id, level, targetSkill: target, exercise,
      lessonPlan: {
        review: 'Review prerequisite concepts (3-5 min)',
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        reflect: 'Summarize the theorem or property in your own words',
      },
    };
  }
}

module.exports = HSGeometry;

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new HSGeometry();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': { const [, id, level] = args; if (!id) throw new Error('Usage: start <id> [level]'); if (level) api.setLevel(id, level); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const level = loadProfile(id).level || 'foundations'; if (skill) { out(api.generateExercise(level, skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); out(api.checkAnswer(type, expected, answer)); break; }
      case 'record': { const [, id, level, cat, skill, sc, tot, ...notes] = args; if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total>'); out(api.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? api.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(api.setLevel(id, l)); break; }
      default: out({ usage: 'node geometry.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
