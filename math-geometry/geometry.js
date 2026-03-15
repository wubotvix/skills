// eClaw Math Geometry Interactive Tutor (K-6). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'math-geometry');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'shape-recognition': ['identify-2d-shapes', 'identify-3d-shapes'],
    'attributes': ['describe-shapes', 'spatial-words'],
    'composing': ['compose-2d-shapes'],
  },
  'grade-1': {
    'defining-attributes': ['defining-vs-non-defining'],
    '2d-vs-3d': ['flat-vs-solid'],
    'composing': ['combine-shapes'],
    'partitioning': ['halves', 'quarters'],
  },
  'grade-2': {
    'shape-properties': ['sides-and-angles', 'faces-edges-vertices'],
    'partitioning': ['equal-parts-2-3-4'],
    'arrays': ['rows-and-columns'],
  },
  'grade-3': {
    'perimeter': ['count-side-lengths', 'rectangle-perimeter-formula'],
    'area': ['count-unit-squares', 'rectangle-area-formula'],
    'area-vs-perimeter': ['same-perim-diff-area'],
    'quadrilateral-families': ['classify-quadrilaterals'],
  },
  'grade-4': {
    'angles': ['identify-angle-types', 'measure-angles', 'angle-relationships'],
    'lines': ['parallel-perpendicular'],
    'symmetry': ['lines-of-symmetry'],
    'classify-triangles': ['by-angles', 'by-sides'],
    'classify-quadrilaterals': ['quad-hierarchy'],
  },
  'grade-5': {
    'coordinate-plane': ['plot-first-quadrant', 'read-coordinates'],
    'shape-hierarchy': ['quad-classification-hierarchy'],
    'volume': ['count-unit-cubes', 'volume-formula'],
    'composite-figures': ['composite-area'],
  },
  'grade-6': {
    'coordinate-plane-full': ['four-quadrants', 'plot-polygons'],
    'surface-area': ['nets-of-3d', 'calculate-surface-area'],
    'area-triangles': ['triangle-area-formula'],
    'area-polygons': ['decompose-polygons'],
  },
};

const PROBLEM_BANKS = {
  'kindergarten': {
    'identify-2d-shapes': {
      items: [
        { shape: 'circle', sides: 0, description: 'perfectly round, no corners' },
        { shape: 'square', sides: 4, description: '4 equal sides and 4 corners' },
        { shape: 'triangle', sides: 3, description: '3 sides and 3 corners' },
        { shape: 'rectangle', sides: 4, description: '4 sides and 4 corners, opposite sides equal' },
        { shape: 'hexagon', sides: 6, description: '6 sides and 6 corners' },
        { shape: 'circle', sides: 0, description: 'looks like a ball or the sun' },
        { shape: 'triangle', sides: 3, description: 'looks like a slice of pizza' },
        { shape: 'square', sides: 4, description: 'looks like a window or a cracker' },
        { shape: 'rectangle', sides: 4, description: 'looks like a door or a book' },
        { shape: 'hexagon', sides: 6, description: 'looks like a honeycomb cell' },
      ],
    },
    'identify-3d-shapes': {
      items: [
        { shape: 'sphere', description: 'perfectly round like a ball, rolls in every direction' },
        { shape: 'cube', description: '6 square faces, looks like a dice or block' },
        { shape: 'cylinder', description: '2 circle faces and a curved surface, like a can' },
        { shape: 'cone', description: '1 circle face and a point on top, like an ice cream cone' },
        { shape: 'sphere', description: 'shaped like a basketball' },
        { shape: 'cube', description: 'shaped like a box with all sides the same' },
        { shape: 'cylinder', description: 'shaped like a tube of paper towels' },
        { shape: 'cone', description: 'shaped like a party hat' },
        { shape: 'sphere', description: 'shaped like the Earth' },
        { shape: 'cube', description: 'shaped like a sugar cube' },
      ],
    },
    'describe-shapes': {
      items: [
        { shape: 'triangle', prompt: 'How many sides does a triangle have?', answer: '3', type: 'number' },
        { shape: 'square', prompt: 'How many corners does a square have?', answer: '4', type: 'number' },
        { shape: 'rectangle', prompt: 'How many sides does a rectangle have?', answer: '4', type: 'number' },
        { shape: 'circle', prompt: 'Does a circle have any corners?', answer: 'no', type: 'yesno' },
        { shape: 'hexagon', prompt: 'How many sides does a hexagon have?', answer: '6', type: 'number' },
        { shape: 'triangle', prompt: 'How many corners does a triangle have?', answer: '3', type: 'number' },
        { shape: 'circle', prompt: 'Does a circle have any straight sides?', answer: 'no', type: 'yesno' },
        { shape: 'square', prompt: 'Are all 4 sides of a square the same length?', answer: 'yes', type: 'yesno' },
        { shape: 'hexagon', prompt: 'How many corners does a hexagon have?', answer: '6', type: 'number' },
        { shape: 'rectangle', prompt: 'How many corners does a rectangle have?', answer: '4', type: 'number' },
      ],
    },
    'spatial-words': {
      items: [
        { scene: 'The cat is ON the table.', prompt: 'Where is the cat?', answer: 'on', word: 'on' },
        { scene: 'The ball is UNDER the chair.', prompt: 'Where is the ball?', answer: 'under', word: 'under' },
        { scene: 'The bird is ABOVE the tree.', prompt: 'Where is the bird?', answer: 'above', word: 'above' },
        { scene: 'The dog is BESIDE the house.', prompt: 'Where is the dog?', answer: 'beside', word: 'beside' },
        { scene: 'The fish is BELOW the boat.', prompt: 'Where is the fish?', answer: 'below', word: 'below' },
        { scene: 'The book is BEHIND the lamp.', prompt: 'Where is the book?', answer: 'behind', word: 'behind' },
        { scene: 'The toy is IN FRONT OF the box.', prompt: 'Where is the toy?', answer: 'in front of', word: 'in front of' },
        { scene: 'The cup is NEXT TO the plate.', prompt: 'Where is the cup?', answer: 'next to', word: 'next to' },
        { scene: 'The hat is ON TOP OF the shelf.', prompt: 'Where is the hat?', answer: 'on top of', word: 'on top of' },
        { scene: 'The mouse is INSIDE the hole.', prompt: 'Where is the mouse?', answer: 'inside', word: 'inside' },
      ],
    },
    'compose-2d-shapes': {
      items: [
        { prompt: 'Put 2 triangles together. What shape can you make?', answer: 'square', accept: ['square', 'rectangle', 'parallelogram', 'diamond', 'rhombus'] },
        { prompt: 'Put 2 squares side by side. What shape do you get?', answer: 'rectangle', accept: ['rectangle'] },
        { prompt: 'Put 6 triangles together around a point. What shape?', answer: 'hexagon', accept: ['hexagon'] },
        { prompt: 'Put 2 rectangles side by side. What bigger shape?', answer: 'rectangle', accept: ['rectangle', 'square'] },
        { prompt: 'Put 4 triangles together. What shape can you make?', answer: 'square', accept: ['square', 'rectangle', 'diamond', 'rhombus'] },
        { prompt: 'Put 2 triangles together to make a rectangle. How?', answer: 'rectangle', accept: ['rectangle'] },
        { prompt: 'Put 3 triangles together. What shape can you make?', answer: 'trapezoid', accept: ['trapezoid', 'triangle'] },
        { prompt: 'Use 4 squares to make a bigger square. How many rows?', answer: '2', accept: ['2'] },
      ],
    },
  },
  'grade-1': {
    'defining-vs-non-defining': {
      items: [
        { prompt: 'Is "has 3 sides" a defining attribute of a triangle?', answer: 'yes', explanation: 'All triangles must have 3 sides.' },
        { prompt: 'Is "is blue" a defining attribute of a triangle?', answer: 'no', explanation: 'Color does not define a shape.' },
        { prompt: 'Is "has 4 right angles" a defining attribute of a rectangle?', answer: 'yes', explanation: 'All rectangles must have 4 right angles.' },
        { prompt: 'Is "is small" a defining attribute of a circle?', answer: 'no', explanation: 'Size does not define a shape.' },
        { prompt: 'Is "has 0 corners" a defining attribute of a circle?', answer: 'yes', explanation: 'Circles have no corners.' },
        { prompt: 'Is "is red" a defining attribute of a square?', answer: 'no', explanation: 'Color does not define a shape.' },
        { prompt: 'Is "has 4 equal sides" a defining attribute of a square?', answer: 'yes', explanation: 'All squares must have 4 equal sides.' },
        { prompt: 'Is "is made of wood" a defining attribute of a rectangle?', answer: 'no', explanation: 'Material does not define a shape.' },
        { prompt: 'Is "has 6 sides" a defining attribute of a hexagon?', answer: 'yes', explanation: 'All hexagons must have 6 sides.' },
        { prompt: 'Is "is tilted" a defining attribute of a triangle?', answer: 'no', explanation: 'Orientation does not define a shape.' },
      ],
    },
    'flat-vs-solid': {
      items: [
        { shape: 'circle', answer: '2d', label: 'flat (2D)' },
        { shape: 'sphere', answer: '3d', label: 'solid (3D)' },
        { shape: 'square', answer: '2d', label: 'flat (2D)' },
        { shape: 'cube', answer: '3d', label: 'solid (3D)' },
        { shape: 'triangle', answer: '2d', label: 'flat (2D)' },
        { shape: 'cone', answer: '3d', label: 'solid (3D)' },
        { shape: 'rectangle', answer: '2d', label: 'flat (2D)' },
        { shape: 'cylinder', answer: '3d', label: 'solid (3D)' },
        { shape: 'hexagon', answer: '2d', label: 'flat (2D)' },
        { shape: 'rectangular prism', answer: '3d', label: 'solid (3D)' },
      ],
    },
    'combine-shapes': {
      items: [
        { prompt: 'Combine 2 triangles to make a new shape. What is it?', answer: 'rectangle', accept: ['rectangle', 'square', 'parallelogram', 'rhombus'] },
        { prompt: 'Combine a triangle and a square. What can you make?', answer: 'pentagon', accept: ['pentagon', 'house shape', 'house'] },
        { prompt: 'Combine 2 squares. What shape do you get?', answer: 'rectangle', accept: ['rectangle'] },
        { prompt: 'Combine 4 small squares into one big shape. What is it?', answer: 'square', accept: ['square', 'rectangle'] },
        { prompt: 'Combine a rectangle and a triangle on top. What does it look like?', answer: 'house', accept: ['house', 'pentagon', 'arrow'] },
        { prompt: 'Combine 3 triangles. What can you make?', answer: 'trapezoid', accept: ['trapezoid', 'triangle'] },
      ],
    },
    'halves': {
      items: [
        { prompt: 'Cut a circle into 2 equal parts. What is each part called?', answer: 'half', accept: ['half', 'a half', 'one half'] },
        { prompt: 'You have a sandwich cut into 2 equal pieces. How many halves?', answer: '2', accept: ['2', 'two'] },
        { prompt: 'Is a circle split into 2 UNEQUAL parts split into halves?', answer: 'no', accept: ['no'] },
        { prompt: 'You eat 1 half of a cookie. How much is left?', answer: '1 half', accept: ['1 half', 'one half', 'half', '1/2'] },
        { prompt: 'A rectangle is split into 2 equal parts. What fraction is each part?', answer: '1/2', accept: ['1/2', 'one half', 'half', 'a half'] },
        { prompt: 'How many halves make a whole?', answer: '2', accept: ['2', 'two'] },
      ],
    },
    'quarters': {
      items: [
        { prompt: 'Cut a square into 4 equal parts. What is each part called?', answer: 'quarter', accept: ['quarter', 'a quarter', 'one quarter', 'fourth', 'one fourth'] },
        { prompt: 'How many quarters make a whole?', answer: '4', accept: ['4', 'four'] },
        { prompt: 'You eat 1 quarter of a pizza. How many quarters are left?', answer: '3', accept: ['3', 'three'] },
        { prompt: 'A circle is split into 4 equal parts. What fraction is each part?', answer: '1/4', accept: ['1/4', 'one quarter', 'quarter', 'one fourth', 'a quarter'] },
        { prompt: 'Are 2 quarters the same as 1 half?', answer: 'yes', accept: ['yes'] },
        { prompt: 'How many quarters are in a circle?', answer: '4', accept: ['4', 'four'] },
      ],
    },
  },
  'grade-2': {
    'sides-and-angles': {
      items: [
        { prompt: 'How many sides does a pentagon have?', answer: '5' },
        { prompt: 'How many angles does a triangle have?', answer: '3' },
        { prompt: 'How many sides does an octagon have?', answer: '8' },
        { prompt: 'A shape has 4 sides and 4 right angles. Could it be a rectangle?', answer: 'yes' },
        { prompt: 'How many sides does a quadrilateral have?', answer: '4' },
        { prompt: 'How many angles does a hexagon have?', answer: '6' },
        { prompt: 'A shape has 3 sides. What is it called?', answer: 'triangle' },
        { prompt: 'A shape has 4 equal sides and 4 right angles. What is it?', answer: 'square' },
        { prompt: 'How many angles does a quadrilateral have?', answer: '4' },
        { prompt: 'How many sides does a triangle have?', answer: '3' },
      ],
    },
    'faces-edges-vertices': {
      items: [
        { shape: 'cube', prompt: 'How many faces does a cube have?', answer: '6' },
        { shape: 'cube', prompt: 'How many edges does a cube have?', answer: '12' },
        { shape: 'cube', prompt: 'How many vertices (corners) does a cube have?', answer: '8' },
        { shape: 'rectangular prism', prompt: 'How many faces does a rectangular prism have?', answer: '6' },
        { shape: 'triangular prism', prompt: 'How many faces does a triangular prism have?', answer: '5' },
        { shape: 'square pyramid', prompt: 'How many faces does a square pyramid have?', answer: '5' },
        { shape: 'square pyramid', prompt: 'How many vertices does a square pyramid have?', answer: '5' },
        { shape: 'square pyramid', prompt: 'How many edges does a square pyramid have?', answer: '8' },
        { shape: 'triangular prism', prompt: 'How many edges does a triangular prism have?', answer: '9' },
        { shape: 'triangular prism', prompt: 'How many vertices does a triangular prism have?', answer: '6' },
      ],
    },
    'equal-parts-2-3-4': {
      items: [
        { prompt: 'Divide a rectangle into 3 equal parts. What fraction is each?', answer: '1/3', accept: ['1/3', 'one third', 'a third'] },
        { prompt: 'Divide a circle into 4 equal parts. What fraction is each?', answer: '1/4', accept: ['1/4', 'one fourth', 'a fourth', 'one quarter', 'a quarter'] },
        { prompt: 'Divide a square into 2 equal parts. What fraction is each?', answer: '1/2', accept: ['1/2', 'one half', 'a half'] },
        { prompt: 'You shade 2 out of 3 equal parts. What fraction is shaded?', answer: '2/3', accept: ['2/3', 'two thirds'] },
        { prompt: 'You shade 3 out of 4 equal parts. What fraction is shaded?', answer: '3/4', accept: ['3/4', 'three fourths', 'three quarters'] },
        { prompt: 'A pie is cut into 3 equal slices. You eat 1 slice. What fraction did you eat?', answer: '1/3', accept: ['1/3', 'one third', 'a third'] },
        { prompt: 'A bar is split into 4 equal pieces. You take 2. What fraction?', answer: '2/4', accept: ['2/4', '1/2', 'one half', 'two fourths'] },
        { prompt: 'Is a rectangle split into 3 UNEQUAL parts split into thirds?', answer: 'no', accept: ['no'] },
      ],
    },
    'rows-and-columns': {
      items: [
        { prompt: 'An array has 3 rows and 4 columns. How many squares total?', answer: '12' },
        { prompt: 'An array has 2 rows and 5 columns. How many squares total?', answer: '10' },
        { prompt: 'An array has 4 rows and 4 columns. How many squares total?', answer: '16' },
        { prompt: 'An array has 5 rows and 3 columns. How many squares total?', answer: '15' },
        { prompt: 'An array has 2 rows and 6 columns. How many squares total?', answer: '12' },
        { prompt: 'You see 3 rows of 3 dots. How many dots total?', answer: '9' },
        { prompt: 'You see 4 rows of 5 stars. How many stars total?', answer: '20' },
        { prompt: 'You see 2 rows of 8 circles. How many circles total?', answer: '16' },
        { prompt: 'An array has 6 rows and 2 columns. How many total?', answer: '12' },
        { prompt: 'An array has 3 rows and 7 columns. How many total?', answer: '21' },
      ],
    },
  },
  'grade-3': {
    'count-side-lengths': {
      items: [
        { prompt: 'A triangle has sides 3 cm, 4 cm, 5 cm. What is the perimeter?', answer: '12', unit: 'cm' },
        { prompt: 'A square has sides of 6 cm. What is the perimeter?', answer: '24', unit: 'cm' },
        { prompt: 'A pentagon has all sides 4 in. What is the perimeter?', answer: '20', unit: 'in' },
        { prompt: 'A shape has sides 5, 3, 5, 3. What is the perimeter?', answer: '16', unit: 'units' },
        { prompt: 'A triangle has sides 7, 7, 7. What is the perimeter?', answer: '21', unit: 'units' },
        { prompt: 'A hexagon has all sides 3 cm. What is the perimeter?', answer: '18', unit: 'cm' },
        { prompt: 'A shape has sides 2, 6, 2, 6. What is the perimeter?', answer: '16', unit: 'units' },
        { prompt: 'A quadrilateral has sides 4, 5, 6, 7. What is the perimeter?', answer: '22', unit: 'units' },
        { prompt: 'An octagon has all sides 2 in. What is the perimeter?', answer: '16', unit: 'in' },
        { prompt: 'A triangle has sides 10, 8, 6. What is the perimeter?', answer: '24', unit: 'units' },
      ],
    },
    'rectangle-perimeter-formula': {
      items: [
        { prompt: 'Rectangle: length=8, width=3. P = 2(l+w). What is P?', answer: '22', l: 8, w: 3 },
        { prompt: 'Rectangle: length=10, width=5. What is the perimeter?', answer: '30', l: 10, w: 5 },
        { prompt: 'Rectangle: length=12, width=4. What is the perimeter?', answer: '32', l: 12, w: 4 },
        { prompt: 'Rectangle: length=7, width=7. What is the perimeter?', answer: '28', l: 7, w: 7 },
        { prompt: 'Rectangle: length=15, width=6. What is the perimeter?', answer: '42', l: 15, w: 6 },
        { prompt: 'Rectangle: length=9, width=2. What is the perimeter?', answer: '22', l: 9, w: 2 },
        { prompt: 'Rectangle: length=20, width=10. What is the perimeter?', answer: '60', l: 20, w: 10 },
        { prompt: 'Rectangle: length=11, width=3. What is the perimeter?', answer: '28', l: 11, w: 3 },
        { prompt: 'Perimeter is 24. Length is 8. What is the width?', answer: '4', l: 8, hint: 'P=2(l+w), so 24=2(8+w)' },
        { prompt: 'Perimeter is 30. Width is 5. What is the length?', answer: '10', w: 5, hint: 'P=2(l+w), so 30=2(l+5)' },
      ],
    },
    'count-unit-squares': {
      items: [
        { prompt: 'A grid shows 3 rows of 4 squares. What is the area?', answer: '12', unit: 'square units' },
        { prompt: 'A grid shows 5 rows of 5 squares. What is the area?', answer: '25', unit: 'square units' },
        { prompt: 'A grid shows 2 rows of 7 squares. What is the area?', answer: '14', unit: 'square units' },
        { prompt: 'A grid shows 4 rows of 6 squares. What is the area?', answer: '24', unit: 'square units' },
        { prompt: 'A grid shows 6 rows of 3 squares. What is the area?', answer: '18', unit: 'square units' },
        { prompt: 'A grid shows 1 row of 10 squares. What is the area?', answer: '10', unit: 'square units' },
        { prompt: 'A grid shows 3 rows of 3 squares. What is the area?', answer: '9', unit: 'square units' },
        { prompt: 'A grid shows 4 rows of 4 squares. What is the area?', answer: '16', unit: 'square units' },
        { prompt: 'A grid shows 7 rows of 2 squares. What is the area?', answer: '14', unit: 'square units' },
        { prompt: 'A grid shows 5 rows of 8 squares. What is the area?', answer: '40', unit: 'square units' },
      ],
    },
    'rectangle-area-formula': {
      items: [
        { prompt: 'Rectangle: length=6, width=4. A = l * w. What is the area?', answer: '24', l: 6, w: 4 },
        { prompt: 'Rectangle: length=9, width=3. What is the area?', answer: '27', l: 9, w: 3 },
        { prompt: 'Rectangle: length=10, width=10. What is the area?', answer: '100', l: 10, w: 10 },
        { prompt: 'Rectangle: length=8, width=5. What is the area?', answer: '40', l: 8, w: 5 },
        { prompt: 'Rectangle: length=12, width=7. What is the area?', answer: '84', l: 12, w: 7 },
        { prompt: 'Rectangle: length=15, width=4. What is the area?', answer: '60', l: 15, w: 4 },
        { prompt: 'Area is 36. Length is 9. What is the width?', answer: '4', l: 9, hint: 'A=l*w, so 36=9*w' },
        { prompt: 'Area is 48. Width is 6. What is the length?', answer: '8', w: 6, hint: 'A=l*w, so 48=l*6' },
        { prompt: 'Rectangle: length=11, width=9. What is the area?', answer: '99', l: 11, w: 9 },
        { prompt: 'Rectangle: length=7, width=7. What is the area?', answer: '49', l: 7, w: 7 },
      ],
    },
    'same-perim-diff-area': {
      items: [
        { prompt: 'Rectangle A: 1x11 (P=24, A=11). Rectangle B: 6x6 (P=24, A=36). Same perimeter. Same area?', answer: 'no' },
        { prompt: 'Rectangle 2x8 has P=20, A=16. Rectangle 4x6 has P=20, A=24. Which has more area?', answer: '4x6', accept: ['4x6', '4 x 6', '4 by 6'] },
        { prompt: 'Two rectangles both have perimeter 16. One is 2x6 (A=12). One is 4x4 (A=16). Which has more area?', answer: '4x4', accept: ['4x4', '4 x 4', '4 by 4', 'the square'] },
        { prompt: 'Can two shapes have the same perimeter but different areas?', answer: 'yes' },
        { prompt: 'Can two shapes have the same area but different perimeters?', answer: 'yes' },
        { prompt: 'Rectangle 3x5 (P=16, A=15). Rectangle 1x7 (P=16, A=7). Same perimeter?', answer: 'yes' },
        { prompt: 'A 3x9 rectangle and a 5x7 rectangle. Which has the bigger perimeter?', answer: 'equal', accept: ['equal', 'same', 'they are equal', 'neither'], hint: 'P=24 vs P=24 — trick question, they are equal!' },
        { prompt: 'Rectangle 2x10 (A=20). Rectangle 4x5 (A=20). Same area?', answer: 'yes' },
      ],
    },
    'classify-quadrilaterals': {
      items: [
        { prompt: '4 sides, 4 right angles, opposite sides equal. What is this shape?', answer: 'rectangle', accept: ['rectangle'] },
        { prompt: '4 equal sides, 4 right angles. What shape?', answer: 'square', accept: ['square'] },
        { prompt: '4 equal sides, opposite angles equal, but no right angles. What shape?', answer: 'rhombus', accept: ['rhombus', 'diamond'] },
        { prompt: 'Opposite sides parallel and equal. What family of shapes?', answer: 'parallelogram', accept: ['parallelogram'] },
        { prompt: 'Exactly one pair of parallel sides. What shape?', answer: 'trapezoid', accept: ['trapezoid', 'trapezium'] },
        { prompt: 'Is a square also a rectangle?', answer: 'yes' },
        { prompt: 'Is a rectangle always a square?', answer: 'no' },
        { prompt: 'Is a square also a rhombus?', answer: 'yes' },
        { prompt: 'Name a quadrilateral with no parallel sides.', answer: 'irregular quadrilateral', accept: ['irregular quadrilateral', 'quadrilateral', 'kite', 'irregular'] },
        { prompt: 'A shape has 4 sides. What general name fits all 4-sided shapes?', answer: 'quadrilateral', accept: ['quadrilateral'] },
      ],
    },
  },
  'grade-4': {
    'identify-angle-types': {
      items: [
        { prompt: 'An angle measures 45°. What type is it?', answer: 'acute', explanation: 'Less than 90°' },
        { prompt: 'An angle measures 90°. What type is it?', answer: 'right', explanation: 'Exactly 90°' },
        { prompt: 'An angle measures 120°. What type is it?', answer: 'obtuse', explanation: 'Between 90° and 180°' },
        { prompt: 'An angle measures 180°. What type is it?', answer: 'straight', explanation: 'Exactly 180°' },
        { prompt: 'An angle measures 30°. What type?', answer: 'acute' },
        { prompt: 'An angle measures 150°. What type?', answer: 'obtuse' },
        { prompt: 'An angle measures 89°. What type?', answer: 'acute' },
        { prompt: 'An angle measures 91°. What type?', answer: 'obtuse' },
        { prompt: 'An angle measures 60°. What type?', answer: 'acute' },
        { prompt: 'An angle measures 175°. What type?', answer: 'obtuse' },
        { prompt: 'The corner of a book makes what type of angle?', answer: 'right' },
        { prompt: 'An angle measures 10°. What type?', answer: 'acute' },
      ],
    },
    'measure-angles': {
      items: [
        { prompt: 'A triangle has angles 60°, 80°, and ?°. What is the missing angle?', answer: '40', hint: 'Angles in a triangle sum to 180°.' },
        { prompt: 'A triangle has angles 90°, 45°, and ?°. Missing angle?', answer: '45' },
        { prompt: 'A triangle has angles 30°, 60°, and ?°. Missing angle?', answer: '90' },
        { prompt: 'A triangle has angles 70°, 70°, and ?°. Missing angle?', answer: '40' },
        { prompt: 'A straight line is 180°. One angle is 110°. What is the other?', answer: '70' },
        { prompt: 'A right angle is 90°. One part is 35°. What is the other part?', answer: '55' },
        { prompt: 'Two angles are complementary. One is 25°. What is the other?', answer: '65', hint: 'Complementary angles sum to 90°.' },
        { prompt: 'Two angles are supplementary. One is 130°. What is the other?', answer: '50', hint: 'Supplementary angles sum to 180°.' },
        { prompt: 'A triangle has angles 50°, 50°, and ?°. Missing angle?', answer: '80' },
        { prompt: 'A quadrilateral has angles 90°, 90°, 90°, and ?°. Missing angle?', answer: '90', hint: 'Angles in a quadrilateral sum to 360°.' },
      ],
    },
    'angle-relationships': {
      items: [
        { prompt: 'Do complementary angles add up to 90° or 180°?', answer: '90' },
        { prompt: 'Do supplementary angles add up to 90° or 180°?', answer: '180' },
        { prompt: 'Angles in a triangle always sum to how many degrees?', answer: '180' },
        { prompt: 'Angles in a quadrilateral always sum to how many degrees?', answer: '360' },
        { prompt: 'Two complementary angles: one is 40°. What is the other?', answer: '50' },
        { prompt: 'Two supplementary angles: one is 75°. What is the other?', answer: '105' },
        { prompt: 'A right angle plus what angle makes a straight angle (180°)?', answer: '90' },
        { prompt: 'Three angles of a quadrilateral are 80°, 100°, 90°. What is the fourth?', answer: '90' },
      ],
    },
    'parallel-perpendicular': {
      items: [
        { prompt: 'Two lines that never cross are called what?', answer: 'parallel', accept: ['parallel'] },
        { prompt: 'Two lines that cross at a right angle (90°) are called what?', answer: 'perpendicular', accept: ['perpendicular'] },
        { prompt: 'Railroad tracks are an example of what type of lines?', answer: 'parallel', accept: ['parallel'] },
        { prompt: 'The corner of a piece of paper shows which type of lines?', answer: 'perpendicular', accept: ['perpendicular'] },
        { prompt: 'Lines that cross but NOT at 90° are called what?', answer: 'intersecting', accept: ['intersecting'] },
        { prompt: 'Do parallel lines ever meet?', answer: 'no' },
        { prompt: 'The letter L shows which type of lines?', answer: 'perpendicular', accept: ['perpendicular'] },
        { prompt: 'The top and bottom edges of a rectangle are what to each other?', answer: 'parallel', accept: ['parallel'] },
        { prompt: 'The top and side edges of a rectangle are what to each other?', answer: 'perpendicular', accept: ['perpendicular'] },
        { prompt: 'An X shows two lines that are what?', answer: 'intersecting', accept: ['intersecting'] },
      ],
    },
    'lines-of-symmetry': {
      items: [
        { prompt: 'How many lines of symmetry does a square have?', answer: '4' },
        { prompt: 'How many lines of symmetry does a rectangle (non-square) have?', answer: '2' },
        { prompt: 'How many lines of symmetry does an equilateral triangle have?', answer: '3' },
        { prompt: 'How many lines of symmetry does an isosceles triangle have?', answer: '1' },
        { prompt: 'How many lines of symmetry does a scalene triangle have?', answer: '0' },
        { prompt: 'How many lines of symmetry does a regular hexagon have?', answer: '6' },
        { prompt: 'How many lines of symmetry does a circle have?', answer: 'infinite', accept: ['infinite', 'infinity', 'unlimited', 'infinitely many'] },
        { prompt: 'Does the letter A have a line of symmetry?', answer: 'yes' },
        { prompt: 'Does the letter F have a line of symmetry?', answer: 'no' },
        { prompt: 'How many lines of symmetry does a regular pentagon have?', answer: '5' },
      ],
    },
    'by-angles': {
      items: [
        { prompt: 'A triangle with all angles less than 90° is called what?', answer: 'acute', accept: ['acute', 'acute triangle'] },
        { prompt: 'A triangle with one 90° angle is called what?', answer: 'right', accept: ['right', 'right triangle'] },
        { prompt: 'A triangle with one angle greater than 90° is called what?', answer: 'obtuse', accept: ['obtuse', 'obtuse triangle'] },
        { prompt: 'Triangle with angles 60°, 60°, 60°. What type?', answer: 'acute' },
        { prompt: 'Triangle with angles 90°, 45°, 45°. What type?', answer: 'right' },
        { prompt: 'Triangle with angles 120°, 30°, 30°. What type?', answer: 'obtuse' },
        { prompt: 'Triangle with angles 80°, 50°, 50°. What type?', answer: 'acute' },
        { prompt: 'Triangle with angles 90°, 60°, 30°. What type?', answer: 'right' },
        { prompt: 'Can a triangle have two right angles?', answer: 'no' },
        { prompt: 'Can a triangle have two obtuse angles?', answer: 'no' },
      ],
    },
    'by-sides': {
      items: [
        { prompt: 'A triangle with all 3 sides equal is called what?', answer: 'equilateral', accept: ['equilateral', 'equilateral triangle'] },
        { prompt: 'A triangle with exactly 2 sides equal is called what?', answer: 'isosceles', accept: ['isosceles', 'isosceles triangle'] },
        { prompt: 'A triangle with no sides equal is called what?', answer: 'scalene', accept: ['scalene', 'scalene triangle'] },
        { prompt: 'Sides: 5, 5, 5. What type of triangle?', answer: 'equilateral' },
        { prompt: 'Sides: 5, 5, 3. What type of triangle?', answer: 'isosceles' },
        { prompt: 'Sides: 3, 4, 5. What type of triangle?', answer: 'scalene' },
        { prompt: 'Sides: 7, 7, 10. What type of triangle?', answer: 'isosceles' },
        { prompt: 'Sides: 6, 8, 10. What type of triangle?', answer: 'scalene' },
        { prompt: 'All equilateral triangles are also isosceles. True or false?', answer: 'true', accept: ['true', 'yes'] },
        { prompt: 'Sides: 9, 9, 9. What type of triangle?', answer: 'equilateral' },
      ],
    },
    'quad-hierarchy': {
      items: [
        { prompt: 'Is every square a rectangle?', answer: 'yes' },
        { prompt: 'Is every rectangle a square?', answer: 'no' },
        { prompt: 'Is every square a rhombus?', answer: 'yes' },
        { prompt: 'Is every rhombus a square?', answer: 'no' },
        { prompt: 'Is every rectangle a parallelogram?', answer: 'yes' },
        { prompt: 'Is every parallelogram a rectangle?', answer: 'no' },
        { prompt: 'Is every square a parallelogram?', answer: 'yes' },
        { prompt: 'Is a trapezoid a parallelogram?', answer: 'no' },
        { prompt: 'What do all parallelograms have in common?', answer: '2 pairs of parallel sides', accept: ['2 pairs of parallel sides', 'opposite sides parallel', 'two pairs of parallel sides'] },
        { prompt: 'A square is a special type of what? (name two)', answer: 'rectangle and rhombus', accept: ['rectangle and rhombus', 'rhombus and rectangle', 'rectangle', 'rhombus'] },
      ],
    },
  },
  'grade-5': {
    'plot-first-quadrant': {
      items: [
        { prompt: 'Plot the point (3, 5). Which direction do you go first?', answer: 'right', explanation: 'x goes right, then y goes up' },
        { prompt: 'What is the point at the origin?', answer: '(0, 0)', accept: ['(0, 0)', '(0,0)', '0, 0', '0,0'] },
        { prompt: 'Point A is at x=4, y=2. What are its coordinates?', answer: '(4, 2)', accept: ['(4, 2)', '(4,2)', '4, 2'] },
        { prompt: 'To plot (7, 3): go right ___ and up ___.', answer: 'right 7 up 3', accept: ['right 7 up 3', '7 and 3', '7, 3'] },
        { prompt: 'Which axis is horizontal: x or y?', answer: 'x', accept: ['x', 'x-axis'] },
        { prompt: 'Which axis is vertical: x or y?', answer: 'y', accept: ['y', 'y-axis'] },
        { prompt: 'In (x, y), which number comes first?', answer: 'x', accept: ['x'] },
        { prompt: 'Point (0, 5) is on which axis?', answer: 'y', accept: ['y', 'y-axis'] },
        { prompt: 'Point (3, 0) is on which axis?', answer: 'x', accept: ['x', 'x-axis'] },
        { prompt: 'Plot (6, 6). Is this point on the line y = x?', answer: 'yes' },
      ],
    },
    'read-coordinates': {
      items: [
        { prompt: 'A point is 5 right and 3 up from the origin. Coordinates?', answer: '(5, 3)', accept: ['(5, 3)', '(5,3)', '5, 3'] },
        { prompt: 'A point is 0 right and 7 up. Coordinates?', answer: '(0, 7)', accept: ['(0, 7)', '(0,7)', '0, 7'] },
        { prompt: 'A point is 4 right and 0 up. Coordinates?', answer: '(4, 0)', accept: ['(4, 0)', '(4,0)', '4, 0'] },
        { prompt: 'A point is at the origin. Coordinates?', answer: '(0, 0)', accept: ['(0, 0)', '(0,0)', '0, 0'] },
        { prompt: 'A point is 8 right and 2 up. Coordinates?', answer: '(8, 2)', accept: ['(8, 2)', '(8,2)', '8, 2'] },
        { prompt: 'A point is 1 right and 9 up. Coordinates?', answer: '(1, 9)', accept: ['(1, 9)', '(1,9)', '1, 9'] },
        { prompt: 'A point is 10 right and 10 up. Coordinates?', answer: '(10, 10)', accept: ['(10, 10)', '(10,10)', '10, 10'] },
        { prompt: 'Distance from (1, 2) to (1, 7)? Count the spaces up.', answer: '5' },
        { prompt: 'Distance from (2, 3) to (6, 3)? Count the spaces right.', answer: '4' },
        { prompt: 'Distance from (0, 0) to (0, 8)?', answer: '8' },
      ],
    },
    'quad-classification-hierarchy': {
      items: [
        { prompt: 'Square => Rectangle => Parallelogram => Quadrilateral. True?', answer: 'true', accept: ['true', 'yes'] },
        { prompt: 'A square is a special type of rectangle AND a special type of rhombus. True?', answer: 'true', accept: ['true', 'yes'] },
        { prompt: 'All rectangles are parallelograms. True or false?', answer: 'true', accept: ['true', 'yes'] },
        { prompt: 'All parallelograms are rectangles. True or false?', answer: 'false', accept: ['false', 'no'] },
        { prompt: 'A rhombus has 4 equal sides. A square has 4 equal sides and 4 right angles. So is every rhombus a square?', answer: 'no' },
        { prompt: 'Name the most specific shape: 4 equal sides, 4 right angles.', answer: 'square' },
        { prompt: 'Name the most specific shape: 4 sides, opposite sides parallel, 4 right angles, opposite sides equal but NOT all equal.', answer: 'rectangle' },
        { prompt: 'Name the most specific shape: 4 sides, exactly 1 pair of parallel sides.', answer: 'trapezoid' },
      ],
    },
    'count-unit-cubes': {
      items: [
        { prompt: 'A box is 3 cubes long, 2 cubes wide, 2 cubes tall. How many cubes?', answer: '12' },
        { prompt: 'A box is 4 cubes long, 3 cubes wide, 2 cubes tall. How many cubes?', answer: '24' },
        { prompt: 'A box is 5 cubes long, 5 cubes wide, 1 cube tall. How many cubes?', answer: '25' },
        { prompt: 'A box is 2 cubes long, 2 cubes wide, 2 cubes tall. How many cubes?', answer: '8' },
        { prompt: 'A box is 3 cubes long, 3 cubes wide, 3 cubes tall. How many cubes?', answer: '27' },
        { prompt: 'A box is 6 cubes long, 2 cubes wide, 1 cube tall. How many cubes?', answer: '12' },
        { prompt: 'A box is 4 cubes long, 4 cubes wide, 4 cubes tall. How many cubes?', answer: '64' },
        { prompt: 'A layer has 12 cubes. There are 3 layers. Total cubes?', answer: '36' },
        { prompt: 'A layer has 20 cubes. There are 5 layers. Total cubes?', answer: '100' },
        { prompt: 'A box is 10 cubes long, 1 cube wide, 1 cube tall. How many cubes?', answer: '10' },
      ],
    },
    'volume-formula': {
      items: [
        { prompt: 'V = l * w * h. Length=5, width=3, height=4. Volume?', answer: '60', unit: 'cubic units' },
        { prompt: 'Rectangular prism: 8 x 6 x 2. Volume?', answer: '96', unit: 'cubic units' },
        { prompt: 'Cube with side 5. Volume?', answer: '125', unit: 'cubic units' },
        { prompt: 'Rectangular prism: 10 x 4 x 3. Volume?', answer: '120', unit: 'cubic units' },
        { prompt: 'Rectangular prism: 7 x 7 x 7. Volume?', answer: '343', unit: 'cubic units' },
        { prompt: 'Rectangular prism: 12 x 5 x 2. Volume?', answer: '120', unit: 'cubic units' },
        { prompt: 'Volume is 60. Length=5, width=4. What is the height?', answer: '3', hint: 'V=l*w*h, so 60=5*4*h' },
        { prompt: 'Volume is 100. Length=10, height=5. What is the width?', answer: '2', hint: 'V=l*w*h, so 100=10*w*5' },
        { prompt: 'Cube with side 10. Volume?', answer: '1000', unit: 'cubic units' },
        { prompt: 'Rectangular prism: 9 x 3 x 3. Volume?', answer: '81', unit: 'cubic units' },
      ],
    },
    'composite-area': {
      items: [
        { prompt: 'L-shape: rectangle 6x4 plus rectangle 3x2. Total area?', answer: '30', explanation: '6*4=24 + 3*2=6 = 30' },
        { prompt: 'T-shape: rectangle 8x2 on top of rectangle 2x6. Total area?', answer: '28', explanation: '8*2=16 + 2*6=12 = 28' },
        { prompt: 'Two squares: 5x5 and 3x3 side by side. Total area?', answer: '34', explanation: '25 + 9 = 34' },
        { prompt: 'Rectangle 10x8 with a 2x2 square cut out. Remaining area?', answer: '76', explanation: '80 - 4 = 76' },
        { prompt: 'Rectangle 12x6 with a 3x3 square cut from the corner. Area?', answer: '63', explanation: '72 - 9 = 63' },
        { prompt: 'Two rectangles: 4x10 and 4x5. Total area?', answer: '60', explanation: '40 + 20 = 60' },
        { prompt: 'Rectangle 8x8 with a 4x4 square cut out. Remaining area?', answer: '48', explanation: '64 - 16 = 48' },
        { prompt: 'L-shape: rectangle 10x3 plus rectangle 4x3. Total area?', answer: '42', explanation: '30 + 12 = 42' },
      ],
    },
  },
  'grade-6': {
    'four-quadrants': {
      items: [
        { prompt: 'Point (3, -2). Which quadrant?', answer: 'IV', accept: ['IV', '4', 'fourth', 'quadrant 4', 'quadrant IV'] },
        { prompt: 'Point (-4, 5). Which quadrant?', answer: 'II', accept: ['II', '2', 'second', 'quadrant 2', 'quadrant II'] },
        { prompt: 'Point (-3, -6). Which quadrant?', answer: 'III', accept: ['III', '3', 'third', 'quadrant 3', 'quadrant III'] },
        { prompt: 'Point (7, 2). Which quadrant?', answer: 'I', accept: ['I', '1', 'first', 'quadrant 1', 'quadrant I'] },
        { prompt: 'Point (-5, 0). On which axis?', answer: 'x-axis', accept: ['x-axis', 'x axis', 'x'] },
        { prompt: 'Point (0, -3). On which axis?', answer: 'y-axis', accept: ['y-axis', 'y axis', 'y'] },
        { prompt: 'Reflect (4, 3) over the x-axis. New point?', answer: '(4, -3)', accept: ['(4, -3)', '(4,-3)', '4, -3'] },
        { prompt: 'Reflect (4, 3) over the y-axis. New point?', answer: '(-4, 3)', accept: ['(-4, 3)', '(-4,3)', '-4, 3'] },
        { prompt: 'Distance from (2, 3) to (2, -5)?', answer: '8' },
        { prompt: 'Distance from (-3, 1) to (5, 1)?', answer: '8' },
      ],
    },
    'plot-polygons': {
      items: [
        { prompt: 'Plot a square with vertices (1,1), (1,4), (4,4), (4,1). What is its side length?', answer: '3' },
        { prompt: 'Rectangle with vertices (0,0), (6,0), (6,3), (0,3). Perimeter?', answer: '18' },
        { prompt: 'Rectangle with vertices (0,0), (6,0), (6,3), (0,3). Area?', answer: '18' },
        { prompt: 'Triangle with vertices (0,0), (4,0), (2,3). What is the base?', answer: '4' },
        { prompt: 'Triangle with vertices (0,0), (4,0), (2,3). What is the height?', answer: '3' },
        { prompt: 'Square with vertices (2,2), (2,7), (7,7), (7,2). Side length?', answer: '5' },
        { prompt: 'Square with vertices (2,2), (2,7), (7,7), (7,2). Perimeter?', answer: '20' },
        { prompt: 'Rectangle vertices (1,1), (1,5), (8,5), (8,1). Area?', answer: '28', explanation: 'l=7, w=4, A=28' },
      ],
    },
    'nets-of-3d': {
      items: [
        { prompt: 'How many faces appear in the net of a cube?', answer: '6' },
        { prompt: 'A cube net has squares. What shape are ALL the faces?', answer: 'square', accept: ['square', 'squares'] },
        { prompt: 'How many faces appear in the net of a rectangular prism?', answer: '6' },
        { prompt: 'How many faces appear in the net of a triangular prism?', answer: '5' },
        { prompt: 'The net of a triangular prism has how many rectangles?', answer: '3' },
        { prompt: 'The net of a triangular prism has how many triangles?', answer: '2' },
        { prompt: 'The net of a square pyramid has how many triangles?', answer: '4' },
        { prompt: 'The net of a square pyramid has how many squares?', answer: '1' },
        { prompt: 'How many faces appear in the net of a square pyramid?', answer: '5' },
        { prompt: 'If you fold the net of a cube, every face meets how many other faces?', answer: '4' },
      ],
    },
    'calculate-surface-area': {
      items: [
        { prompt: 'Cube with side 3. SA = 6 * s^2. Surface area?', answer: '54', unit: 'square units' },
        { prompt: 'Cube with side 5. Surface area?', answer: '150', unit: 'square units' },
        { prompt: 'Rectangular prism: l=4, w=3, h=2. SA=2(lw+lh+wh). Surface area?', answer: '52', unit: 'square units' },
        { prompt: 'Rectangular prism: l=6, w=5, h=4. Surface area?', answer: '148', unit: 'square units' },
        { prompt: 'Rectangular prism: l=10, w=3, h=2. Surface area?', answer: '112', unit: 'square units' },
        { prompt: 'Cube with side 1. Surface area?', answer: '6', unit: 'square units' },
        { prompt: 'Cube with side 10. Surface area?', answer: '600', unit: 'square units' },
        { prompt: 'Rectangular prism: l=8, w=4, h=3. Surface area?', answer: '136', unit: 'square units' },
        { prompt: 'Rectangular prism: l=5, w=5, h=5. Surface area?', answer: '150', unit: 'square units', hint: 'This is actually a cube!' },
        { prompt: 'Rectangular prism: l=7, w=2, h=3. Surface area?', answer: '82', unit: 'square units' },
      ],
    },
    'triangle-area-formula': {
      items: [
        { prompt: 'Triangle: base=6, height=4. A = 1/2 * b * h. Area?', answer: '12' },
        { prompt: 'Triangle: base=10, height=5. Area?', answer: '25' },
        { prompt: 'Triangle: base=8, height=3. Area?', answer: '12' },
        { prompt: 'Triangle: base=12, height=8. Area?', answer: '48' },
        { prompt: 'Triangle: base=7, height=4. Area?', answer: '14' },
        { prompt: 'Triangle: base=20, height=10. Area?', answer: '100' },
        { prompt: 'Triangle: base=9, height=6. Area?', answer: '27' },
        { prompt: 'Triangle area is 30. Base is 10. What is the height?', answer: '6', hint: 'A=1/2*b*h, so 30=1/2*10*h' },
        { prompt: 'Triangle area is 24. Height is 8. What is the base?', answer: '6', hint: 'A=1/2*b*h, so 24=1/2*b*8' },
        { prompt: 'Triangle: base=15, height=4. Area?', answer: '30' },
      ],
    },
    'decompose-polygons': {
      items: [
        { prompt: 'A parallelogram: base=8, height=5. Area = b * h. Area?', answer: '40' },
        { prompt: 'A trapezoid: bases 6 and 10, height 4. A = 1/2*(b1+b2)*h. Area?', answer: '32' },
        { prompt: 'Split a hexagon into 6 triangles, each with area 3. Total area?', answer: '18' },
        { prompt: 'An L-shape: rectangle 10x4 plus rectangle 6x4. Total area?', answer: '64', explanation: '40 + 24 = 64' },
        { prompt: 'Rectangle 8x6 with a triangle (base 4, height 3) cut out. Area?', answer: '42', explanation: '48 - 6 = 42' },
        { prompt: 'A parallelogram: base=12, height=7. Area?', answer: '84' },
        { prompt: 'A trapezoid: bases 5 and 9, height 6. Area?', answer: '42' },
        { prompt: 'Compose: rectangle 5x8 plus triangle base=5, height=4. Total area?', answer: '50', explanation: '40 + 10 = 50' },
        { prompt: 'A parallelogram: base=10, height=3. Area?', answer: '30' },
        { prompt: 'A trapezoid: bases 8 and 12, height 5. Area?', answer: '50' },
      ],
    },
  },
};

const SPATIAL_CHALLENGES = {
  'kindergarten': [
    { challenge: 'I am a shape with 3 sides and 3 corners. What am I?', answer: 'triangle' },
    { challenge: 'I am round with no corners. What am I?', answer: 'circle' },
    { challenge: 'I look like a ball. What 3D shape am I?', answer: 'sphere' },
    { challenge: 'I have 4 equal sides and 4 corners. What am I?', answer: 'square' },
    { challenge: 'I look like a can of soup. What 3D shape am I?', answer: 'cylinder' },
  ],
  'grade-1': [
    { challenge: 'If you cut a square diagonally, what 2 shapes do you get?', answer: '2 triangles' },
    { challenge: 'If you fold a rectangle in half, what shape do you see?', answer: 'rectangle (or square)' },
    { challenge: 'A door is what shape?', answer: 'rectangle' },
    { challenge: 'A pizza slice is what shape?', answer: 'triangle' },
    { challenge: 'A stop sign has 8 sides. What shape is it?', answer: 'octagon' },
  ],
  'grade-2': [
    { challenge: 'A cube has how many faces? Edges? Vertices?', answer: '6 faces, 12 edges, 8 vertices' },
    { challenge: 'If you unfold a cereal box, what shapes do you see?', answer: '6 rectangles' },
    { challenge: 'A soccer ball is most like what 3D shape?', answer: 'sphere' },
    { challenge: 'Picture a pyramid. How many triangular faces does a square pyramid have?', answer: '4' },
    { challenge: 'If you slice a cylinder straight across, what shape is the cross-section?', answer: 'circle' },
  ],
  'grade-3': [
    { challenge: 'Two rectangles both have perimeter 20. One is 1x9, one is 5x5. Which has more area?', answer: '5x5 (area 25 vs 9)' },
    { challenge: 'A room is 4m by 3m. How many 1m-square tiles to cover the floor?', answer: '12' },
    { challenge: 'You walk around a rectangular park 10m x 5m. How far did you walk?', answer: '30 meters' },
    { challenge: 'Can a shape have a perimeter of 12 and an area of 9?', answer: 'Yes! A 3x3 square.' },
    { challenge: 'Is a square a rectangle? Why?', answer: 'Yes, it has 4 sides and 4 right angles.' },
  ],
  'grade-4': [
    { challenge: 'A clock shows 3:00. What type of angle do the hands make?', answer: 'right angle (90°)' },
    { challenge: 'A clock shows 6:00. What type of angle?', answer: 'straight angle (180°)' },
    { challenge: 'Triangle angles: 60° and 80°. What is the third angle?', answer: '40°' },
    { challenge: 'How many lines of symmetry does the letter H have?', answer: '2' },
    { challenge: 'Rotate a right triangle 180°. Does it change shape?', answer: 'No, same shape, different orientation.' },
  ],
  'grade-5': [
    { challenge: 'A box is 4x3x2. How many unit cubes fit inside?', answer: '24' },
    { challenge: 'Plot (2,3) and (2,7). Distance between them?', answer: '4 units' },
    { challenge: 'A square is always a rectangle. But is a rectangle always a square?', answer: 'No' },
    { challenge: 'Two boxes: 6x2x2 and 3x4x2. Same volume?', answer: 'Yes, both 24 cubic units.' },
    { challenge: 'An L-shape is made of two 3x3 squares overlapping by a 1x3 strip. Area?', answer: '15 square units' },
  ],
  'grade-6': [
    { challenge: 'Reflect (3, 4) over the x-axis. Where does it land?', answer: '(3, -4)' },
    { challenge: 'Triangle: base 10, height 6. Area?', answer: '30 square units' },
    { challenge: 'Cube with side 4. Surface area?', answer: '96 square units' },
    { challenge: 'A trapezoid has bases 5 and 11, height 4. Area?', answer: '32 square units' },
    { challenge: 'Point (-2, -5) is in which quadrant?', answer: 'Quadrant III' },
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

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 /(),.-]/g, ''); }

// Exercise generation

function exResult(type, skill, grade, instruction, items) { return { type, skill, grade, count: items.length, instruction, items }; }

function generateExercise(grade, skill, count = 5) {
  const bank = PROBLEM_BANKS[grade]?.[skill];
  if (!bank) return { error: `No problem bank for ${grade}/${skill}` };

  const items = bank.items;
  if (!items || !items.length) return { error: `Empty problem bank for ${grade}/${skill}` };

  // Determine exercise type and instruction based on skill
  const typeMap = {
    'identify-2d-shapes': ['identify', 'Name this 2D shape from its description.'],
    'identify-3d-shapes': ['identify', 'Name this 3D shape from its description.'],
    'describe-shapes': ['describe', 'Answer the question about this shape.'],
    'spatial-words': ['spatial', 'Use the correct spatial word to answer.'],
    'compose-2d-shapes': ['compose', 'What shape do you get when you combine these shapes?'],
    'defining-vs-non-defining': ['classify', 'Is this a defining or non-defining attribute? Answer YES or NO.'],
    'flat-vs-solid': ['classify', 'Is this shape flat (2D) or solid (3D)?'],
    'combine-shapes': ['compose', 'What shape do you get when you combine these shapes?'],
    'halves': ['fractions', 'Answer the question about halves.'],
    'quarters': ['fractions', 'Answer the question about quarters.'],
    'sides-and-angles': ['properties', 'Answer the question about sides and angles.'],
    'faces-edges-vertices': ['properties', 'Answer the question about 3D shape properties.'],
    'equal-parts-2-3-4': ['fractions', 'Answer the question about equal parts and fractions.'],
    'rows-and-columns': ['arrays', 'Find the total number of items in the array.'],
    'count-side-lengths': ['calculate', 'Add the side lengths to find the perimeter.'],
    'rectangle-perimeter-formula': ['calculate', 'Use P = 2(l + w) to find the perimeter.'],
    'count-unit-squares': ['calculate', 'Count the unit squares to find the area.'],
    'rectangle-area-formula': ['calculate', 'Use A = l * w to find the area.'],
    'same-perim-diff-area': ['reasoning', 'Think about the relationship between perimeter and area.'],
    'classify-quadrilaterals': ['classify', 'Identify or classify the quadrilateral.'],
    'identify-angle-types': ['classify', 'Classify the angle as acute, right, obtuse, or straight.'],
    'measure-angles': ['calculate', 'Find the missing angle measurement.'],
    'angle-relationships': ['reasoning', 'Use angle relationships to solve.'],
    'parallel-perpendicular': ['classify', 'Identify the type of lines.'],
    'lines-of-symmetry': ['count', 'How many lines of symmetry does this shape have?'],
    'by-angles': ['classify', 'Classify the triangle by its angles.'],
    'by-sides': ['classify', 'Classify the triangle by its sides.'],
    'quad-hierarchy': ['reasoning', 'Answer the question about the quadrilateral hierarchy.'],
    'plot-first-quadrant': ['coordinates', 'Answer the question about plotting points.'],
    'read-coordinates': ['coordinates', 'Read or identify the coordinates.'],
    'quad-classification-hierarchy': ['reasoning', 'Answer about the shape classification hierarchy.'],
    'count-unit-cubes': ['calculate', 'Count the unit cubes to find the volume.'],
    'volume-formula': ['calculate', 'Use V = l * w * h to find the volume.'],
    'composite-area': ['calculate', 'Find the area of the composite figure.'],
    'four-quadrants': ['coordinates', 'Identify the quadrant or answer the coordinate question.'],
    'plot-polygons': ['coordinates', 'Use coordinates to find measurements of the polygon.'],
    'nets-of-3d': ['reasoning', 'Answer the question about nets of 3D shapes.'],
    'calculate-surface-area': ['calculate', 'Calculate the surface area.'],
    'triangle-area-formula': ['calculate', 'Use A = 1/2 * b * h to find the triangle area.'],
    'decompose-polygons': ['calculate', 'Find the area by decomposing into simpler shapes.'],
  };

  const [type, instruction] = typeMap[skill] || ['general', 'Answer the geometry question.'];

  const picked = pick(items, count);
  const exerciseItems = picked.map(item => {
    const result = { prompt: item.prompt || item.description || item.challenge };
    if (item.shape) result.shape = item.shape;
    if (item.answer !== undefined) result.answer = String(item.answer);
    if (item.accept) result.acceptedAnswers = item.accept;
    if (item.explanation) result.explanation = item.explanation;
    if (item.hint) result.hint = item.hint;
    if (item.unit) result.unit = item.unit;
    if (item.word) result.word = item.word;
    if (item.scene) result.scene = item.scene;
    if (item.label) result.label = item.label;
    return result;
  });

  return exResult(type, skill, grade, instruction, exerciseItems);
}

// Answer checking

function checkAnswer(type, expected, answer) {
  const n = norm(answer);
  if (Array.isArray(expected)) return expected.some(e => norm(e) === n);
  return norm(expected) === n;
}

// Public API

class Geometry {
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

  getSpatialChallenge(grade) {
    const challenges = SPATIAL_CHALLENGES[grade];
    if (!challenges) return { error: `No spatial challenges for ${grade}. Available: ${Object.keys(SPATIAL_CHALLENGES).join(', ')}` };
    return pick(challenges, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const challenge = SPATIAL_CHALLENGES[grade] ? pick(SPATIAL_CHALLENGES[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, spatialChallenge: challenge,
      lessonPlan: {
        warmup: 'Shape identification or spatial reasoning warm-up (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Connect to real-world examples and hands-on exploration',
        challenge: challenge ? `Spatial challenge: "${challenge.challenge}"` : 'Mental rotation or visualization puzzle',
      },
    };
  }
}

module.exports = Geometry;

// CLI: node geometry.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const geo = new Geometry();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) geo.setGrade(id, grade);
        out({ action: 'start', profile: geo.getProfile(id), nextSkills: geo.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(geo.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'kindergarten';
        if (skill) { out(geo.generateExercise(grade, skill, 5)); }
        else { const n = geo.getNextSkills(id, 1).next; out(n.length ? geo.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current grade!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(geo.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(geo.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(geo.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(geo.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(geo.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? geo.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(geo.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(geo.setGrade(id, g)); break; }
      case 'challenge': { const [, g] = args; if (!g) throw new Error('Usage: challenge <grade>'); out(geo.getSpatialChallenge(g)); break; }
      default: out({ usage: 'node geometry.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','challenge'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
