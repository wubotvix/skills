// eClaw MS Math Problem Solving Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-math-problem-solving');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'word-problems': ['multi-step-arithmetic', 'fraction-decimal-context', 'ratio-reasoning', 'unit-rate-problems'],
    'area-volume': ['area-composite-figures', 'surface-area-nets', 'volume-rectangular-prisms'],
    'reasoning': ['pattern-recognition', 'draw-a-diagram', 'work-backwards'],
  },
  'grade-7': {
    'percent-applications': ['percent-increase-decrease', 'tax-tip-markup', 'simple-interest', 'percent-error'],
    'algebraic-word-problems': ['translating-to-equations', 'two-step-equations-context', 'inequality-contexts'],
    'proportional-reasoning': ['scale-drawings', 'proportion-word-problems', 'similar-figures'],
  },
  'grade-8': {
    'linear-modeling': ['slope-intercept-context', 'comparing-linear-functions', 'systems-in-context'],
    'pythagorean-applications': ['distance-problems', 'real-world-pythagorean', 'coordinate-distance'],
    'data-driven-arguments': ['scatter-plot-analysis', 'trend-interpretation', 'statistical-reasoning'],
  },
};

const PROBLEM_BANKS = {
  'grade-6': {
    'multi-step-arithmetic': {
      problems: [
        { prompt: 'A store sells notebooks for $3 each and pens for $2 each. Maria buys 4 notebooks and 6 pens. How much does she spend?', answer: '24', numeric: 24, hint: '4 x $3 + 6 x $2' },
        { prompt: 'A baker makes 144 muffins. He puts 12 in each box. He sells each box for $8. How much does he earn if he sells all boxes?', answer: '96', numeric: 96, hint: '144 / 12 = 12 boxes, then 12 x $8' },
        { prompt: 'Sam has $50. He buys 3 books at $9 each and a pencil case for $7. How much money does he have left?', answer: '16', numeric: 16, hint: '3 x $9 + $7 = $34, then $50 - $34' },
        { prompt: 'A movie theater has 15 rows with 20 seats each. If 187 seats are occupied, how many are empty?', answer: '113', numeric: 113, hint: '15 x 20 = 300 total seats' },
        { prompt: 'A garden is 12 meters long and 8 meters wide. A path 1 meter wide runs around the inside. What is the area of the path?', answer: '36', numeric: 36, hint: 'Outer area - Inner area: 96 - 60 = 36' },
        { prompt: 'Luis earns $12 per hour. He works 5 hours on Monday and 3 hours on Tuesday. After buying lunch for $9, how much does he have?', answer: '87', numeric: 87, hint: '(5+3) x $12 - $9' },
      ],
    },
    'fraction-decimal-context': {
      problems: [
        { prompt: 'A recipe calls for 2/3 cup of sugar. If you want to make 1.5 batches, how much sugar do you need? (as a fraction)', answer: '1', numeric: 1, hint: '2/3 x 3/2 = 1' },
        { prompt: 'A rope is 8.4 meters long. If you cut it into pieces that are 1.2 meters each, how many pieces do you get?', answer: '7', numeric: 7, hint: '8.4 / 1.2' },
        { prompt: 'A pizza is cut into 8 slices. Tom eats 3/8 and Jerry eats 1/4. What fraction of the pizza is left?', answer: '3/8', hint: '3/8 + 2/8 = 5/8 eaten, so 3/8 left' },
        { prompt: 'A tank is 3/5 full. It holds 200 gallons when full. How many gallons are in the tank?', answer: '120', numeric: 120, hint: '3/5 x 200' },
        { prompt: 'A shirt costs $24.50. It is on sale for 1/2 off. What is the sale price?', answer: '12.25', numeric: 12.25, hint: '$24.50 / 2' },
        { prompt: 'Maya ran 2.75 miles on Monday, 3.5 miles on Wednesday, and 1.25 miles on Friday. How far did she run in total?', answer: '7.5', numeric: 7.5 },
      ],
    },
    'ratio-reasoning': {
      problems: [
        { prompt: 'The ratio of boys to girls in a class is 3:5. If there are 15 boys, how many girls are there?', answer: '25', numeric: 25, hint: '15/3 = 5, so 5 x 5 = 25' },
        { prompt: 'A map has a scale of 1 inch = 50 miles. Two cities are 3.5 inches apart on the map. How far apart are they in miles?', answer: '175', numeric: 175, hint: '3.5 x 50' },
        { prompt: 'A recipe uses 2 cups of flour for every 3 cups of milk. If you use 9 cups of milk, how many cups of flour do you need?', answer: '6', numeric: 6, hint: '9/3 = 3 groups, 3 x 2 = 6' },
        { prompt: 'In a bag of marbles, the ratio of red to blue is 4:7. If there are 44 marbles total, how many are red?', answer: '16', numeric: 16, hint: '4+7=11 parts, 44/11=4 per part, 4x4=16' },
        { prompt: 'A car travels 180 miles on 6 gallons of gas. How far can it travel on 10 gallons?', answer: '300', numeric: 300, hint: '180/6 = 30 mpg, 30 x 10' },
        { prompt: 'The ratio of cats to dogs at a shelter is 5:3. If there are 24 dogs, how many cats are there?', answer: '40', numeric: 40 },
      ],
    },
    'unit-rate-problems': {
      problems: [
        { prompt: 'A 12-pack of soda costs $4.80. What is the cost per can?', answer: '0.40', numeric: 0.40, hint: '$4.80 / 12' },
        { prompt: 'A runner covers 5 miles in 40 minutes. What is the rate in minutes per mile?', answer: '8', numeric: 8, hint: '40 / 5' },
        { prompt: 'Brand A: 16 oz for $3.20. Brand B: 20 oz for $3.80. Which is the better buy?', answer: 'Brand B', hint: 'A: $0.20/oz, B: $0.19/oz. B is cheaper per oz.' },
        { prompt: 'A factory produces 450 widgets in 6 hours. How many widgets per hour?', answer: '75', numeric: 75 },
        { prompt: 'A car travels 280 miles in 4 hours. What is the speed in miles per hour?', answer: '70', numeric: 70 },
        { prompt: 'A printer prints 120 pages in 8 minutes. How many pages per minute?', answer: '15', numeric: 15 },
      ],
    },
    'area-composite-figures': {
      problems: [
        { prompt: 'An L-shaped room is made of two rectangles: one 10x6 and one 4x3. What is the total area?', answer: '72', numeric: 72, hint: '10x6=60, 4x3=12, 60+12=72' },
        { prompt: 'A rectangular yard (20m x 15m) has a square pool (5m x 5m) in it. What is the area of the yard NOT covered by the pool?', answer: '275', numeric: 275, hint: '300 - 25' },
        { prompt: 'Find the area of a figure made of a 8x5 rectangle with a triangle (base 8, height 3) on top.', answer: '52', numeric: 52, hint: '40 + 0.5(8)(3)=12' },
        { prompt: 'A room is a 12x10 rectangle with a 4x4 square cut from one corner. What is the area?', answer: '104', numeric: 104 },
        { prompt: 'Two squares, one 6x6 and one 4x4, overlap with a 2x2 shared area. What is the total area covered?', answer: '48', numeric: 48, hint: '36+16-4' },
        { prompt: 'A trapezoid has bases of 10 and 6, with a height of 4. What is its area?', answer: '32', numeric: 32, hint: '(10+6)/2 x 4' },
      ],
    },
    'surface-area-nets': {
      problems: [
        { prompt: 'Find the surface area of a rectangular prism: length=5, width=3, height=4.', answer: '94', numeric: 94, hint: '2(15+20+12)' },
        { prompt: 'A cube has edges of length 6. What is its surface area?', answer: '216', numeric: 216, hint: '6 x 6^2' },
        { prompt: 'Find the surface area of a rectangular prism: 10 x 2 x 3.', answer: '112', numeric: 112, hint: '2(20+30+6)' },
        { prompt: 'A cube has a surface area of 150 square cm. What is the length of each edge?', answer: '5', numeric: 5, hint: '150/6 = 25, sqrt(25) = 5' },
        { prompt: 'A rectangular prism has dimensions 8 x 4 x 2. What is its surface area?', answer: '112', numeric: 112 },
        { prompt: 'How many faces does a rectangular prism have?', answer: '6', numeric: 6 },
      ],
    },
    'volume-rectangular-prisms': {
      problems: [
        { prompt: 'Find the volume of a rectangular prism: length=8, width=5, height=3.', answer: '120', numeric: 120 },
        { prompt: 'A box is 12 cm long, 4 cm wide, and 6 cm tall. What is its volume?', answer: '288', numeric: 288 },
        { prompt: 'A pool is 10m long, 5m wide, and 2m deep. How many cubic meters of water does it hold?', answer: '100', numeric: 100 },
        { prompt: 'A cube has volume 64 cubic inches. What is the length of each edge?', answer: '4', numeric: 4, hint: 'Cube root of 64' },
        { prompt: 'A container has a base area of 24 sq ft and a height of 5 ft. What is its volume?', answer: '120', numeric: 120 },
        { prompt: 'Two boxes: A is 6x4x3, B is 5x5x3. Which has greater volume?', answer: 'B', hint: 'A=72, B=75' },
      ],
    },
    'pattern-recognition': {
      problems: [
        { prompt: 'What is the next number: 2, 6, 18, 54, ...?', answer: '162', numeric: 162, hint: 'Each number is multiplied by 3' },
        { prompt: 'What is the 10th term of the sequence: 3, 7, 11, 15, ...?', answer: '39', numeric: 39, hint: 'Start 3, add 4 each time: 3 + 4(9) = 39' },
        { prompt: 'If the pattern is 1, 4, 9, 16, 25, what is the 7th term?', answer: '49', numeric: 49, hint: 'Perfect squares: n^2' },
        { prompt: 'What is the next number: 1, 1, 2, 3, 5, 8, ...?', answer: '13', numeric: 13, hint: 'Fibonacci: add previous two' },
        { prompt: 'A sequence starts: 100, 90, 81, 72.9, ... What is the pattern?', answer: 'multiply by 0.9', hint: 'Each term is 90% of the previous' },
        { prompt: 'How many squares in a 4x4 grid? (Count all sizes)', answer: '30', numeric: 30, hint: '16+9+4+1' },
      ],
    },
    'draw-a-diagram': {
      problems: [
        { prompt: 'A rectangular garden is twice as long as it is wide. The perimeter is 36 meters. What are the dimensions?', answer: '6 by 12', hint: 'Width = w, length = 2w, 2(w+2w) = 36' },
        { prompt: 'Three friends stand in a line. Ana is between Ben and Cal. Ben is not first. What is the order?', answer: 'Cal, Ana, Ben', hint: 'Draw positions: if Ben is not first...' },
        { prompt: 'A square room has a perimeter of 48 feet. What is the area?', answer: '144', numeric: 144, hint: 'Side = 48/4 = 12' },
        { prompt: 'Two trains leave the same station going opposite directions at 60 mph and 40 mph. How far apart are they after 2 hours?', answer: '200', numeric: 200, hint: '(60+40) x 2' },
        { prompt: 'A fence post is placed every 8 feet along a 64-foot fence. How many posts are needed?', answer: '9', numeric: 9, hint: '64/8 = 8 sections, so 9 posts (fence-post problem)' },
        { prompt: 'A ladder leans against a wall. The base is 6 ft from the wall and the top reaches 8 ft high. How long is the ladder?', answer: '10', numeric: 10, hint: 'Pythagorean: 6^2 + 8^2 = 100' },
      ],
    },
    'work-backwards': {
      problems: [
        { prompt: 'After spending half her money and then $5 more, Jen has $15. How much did she start with?', answer: '40', numeric: 40, hint: '15+5=20, 20x2=40' },
        { prompt: 'A number is tripled, then 7 is subtracted. The result is 20. What was the original number?', answer: '9', numeric: 9, hint: '20+7=27, 27/3=9' },
        { prompt: 'After a 25% discount, a jacket costs $60. What was the original price?', answer: '80', numeric: 80, hint: '60 / 0.75' },
        { prompt: 'I think of a number, double it, add 8, then divide by 3. The result is 10. What was my number?', answer: '11', numeric: 11, hint: '10x3=30, 30-8=22, 22/2=11' },
        { prompt: 'A bus starts empty. At stop 1, 8 people get on. At stop 2, 3 get off and 5 get on. At stop 3, 4 get off. How many are on the bus?', answer: '6', numeric: 6 },
        { prompt: 'After giving away 1/3 of her stickers and then 10 more, Lisa has 30 left. How many did she start with?', answer: '60', numeric: 60, hint: '30+10=40, 40 is 2/3, so full is 60' },
      ],
    },
  },
  'grade-7': {
    'percent-increase-decrease': {
      problems: [
        { prompt: 'A shirt was $40 and is now $50. What is the percent increase?', answer: '25%', hint: '10/40 = 0.25 = 25%' },
        { prompt: 'A population drops from 800 to 600. What is the percent decrease?', answer: '25%', hint: '200/800 = 0.25' },
        { prompt: 'A stock goes from $120 to $90. What is the percent decrease?', answer: '25%', hint: '30/120' },
        { prompt: 'A town grows from 5,000 to 6,500 people. What is the percent increase?', answer: '30%', hint: '1500/5000' },
        { prompt: 'After a 20% decrease, a price is $64. What was the original price?', answer: '80', numeric: 80, hint: '64 / 0.80' },
        { prompt: 'After a 15% increase, a salary is $46,000. What was the original salary?', answer: '40000', numeric: 40000, hint: '46000 / 1.15' },
      ],
    },
    'tax-tip-markup': {
      problems: [
        { prompt: 'A meal costs $45. You want to leave a 20% tip. What is the total with tip?', answer: '54', numeric: 54, hint: '45 x 1.20' },
        { prompt: 'A $30 item has 8% sales tax. What is the total cost?', answer: '32.40', numeric: 32.40, hint: '30 x 1.08' },
        { prompt: 'A store buys a shirt for $15 and marks it up 60%. What is the selling price?', answer: '24', numeric: 24, hint: '15 x 1.60' },
        { prompt: 'A $80 dinner with 7% tax and 18% tip (on pre-tax amount). What is the total?', answer: '100', numeric: 100, hint: 'Tax: $5.60, Tip: $14.40, Total: $100' },
        { prompt: 'An item sells for $75 after a 50% markup. What was the wholesale cost?', answer: '50', numeric: 50, hint: '75 / 1.50' },
        { prompt: 'A tip of $9 was 15% of the bill. What was the bill?', answer: '60', numeric: 60, hint: '9 / 0.15' },
      ],
    },
    'simple-interest': {
      problems: [
        { prompt: 'Find the simple interest: P=$500, r=4%, t=3 years.', answer: '60', numeric: 60, hint: 'I = 500 x 0.04 x 3' },
        { prompt: 'Find the simple interest: P=$1200, r=5%, t=2 years.', answer: '120', numeric: 120, hint: 'I = 1200 x 0.05 x 2' },
        { prompt: 'You invest $800 at 3% simple interest for 5 years. What is the total amount?', answer: '920', numeric: 920, hint: 'I=120, Total=800+120' },
        { prompt: 'A loan of $2000 at 6% simple interest for 4 years. How much interest is owed?', answer: '480', numeric: 480 },
        { prompt: 'If you earned $150 in simple interest on $1000 at 5%, how many years was it invested?', answer: '3', numeric: 3, hint: '150 = 1000 x 0.05 x t' },
        { prompt: 'What rate earns $200 interest on $2500 in 4 years?', answer: '2%', hint: '200 = 2500 x r x 4, r=0.02' },
      ],
    },
    'percent-error': {
      problems: [
        { prompt: 'Estimated: 50, Actual: 45. What is the percent error?', answer: '11.1%', hint: '|50-45|/45 x 100 = 11.1%' },
        { prompt: 'Estimated: 100, Actual: 120. What is the percent error?', answer: '16.7%', hint: '|100-120|/120 x 100' },
        { prompt: 'A student measures 8.3 cm. The actual length is 8.0 cm. What is the percent error?', answer: '3.75%', hint: '0.3/8.0 x 100' },
        { prompt: 'Predicted temperature: 72F. Actual: 68F. What is the percent error? (round to 1 decimal)', answer: '5.9%', hint: '4/68 x 100' },
        { prompt: 'A recipe calls for 2.5 cups. You measure 2.4 cups. What is the percent error?', answer: '4%', hint: '0.1/2.5 x 100' },
        { prompt: 'Estimated weight: 150 lbs. Actual: 145 lbs. What is the percent error? (round to 1 decimal)', answer: '3.4%', hint: '5/145 x 100' },
      ],
    },
    'translating-to-equations': {
      problems: [
        { prompt: 'Five more than twice a number is 17. Write and solve the equation.', answer: '6', numeric: 6, hint: '2x + 5 = 17, x = 6' },
        { prompt: 'The sum of three consecutive integers is 42. What are they?', answer: '13, 14, 15', hint: 'x + (x+1) + (x+2) = 42' },
        { prompt: 'A number decreased by 8 equals 3 times the number. What is the number?', answer: '-4', numeric: -4, hint: 'x - 8 = 3x' },
        { prompt: 'The perimeter of a rectangle is 30. The length is 3 more than the width. Find the dimensions.', answer: '6 by 9', hint: '2(w + w+3) = 30' },
        { prompt: 'Four times a number minus 7 is 25. What is the number?', answer: '8', numeric: 8, hint: '4x - 7 = 25' },
        { prompt: 'The quotient of a number and 3, increased by 5, is 11. What is the number?', answer: '18', numeric: 18, hint: 'x/3 + 5 = 11' },
      ],
    },
    'two-step-equations-context': {
      problems: [
        { prompt: 'A taxi charges $3 plus $2 per mile. The total fare was $17. How many miles was the trip?', answer: '7', numeric: 7, hint: '3 + 2m = 17' },
        { prompt: 'A gym membership costs $25/month plus a $50 sign-up fee. After paying $200 total, how many months have you been a member?', answer: '6', numeric: 6, hint: '50 + 25m = 200' },
        { prompt: 'You buy 3 shirts and a $10 hat. The total is $55. How much is each shirt?', answer: '15', numeric: 15, hint: '3s + 10 = 55' },
        { prompt: 'After depositing $75 and then withdrawing $20, your account has $180. What was the starting balance?', answer: '125', numeric: 125 },
        { prompt: 'A cell phone plan charges $35/month plus $0.10 per text. Your bill is $42.50. How many texts did you send?', answer: '75', numeric: 75 },
        { prompt: 'You earn $8/hour babysitting. After buying a $22 book, you have $42. How many hours did you babysit?', answer: '8', numeric: 8 },
      ],
    },
    'inequality-contexts': {
      problems: [
        { prompt: 'You have at most $50 to spend. Each book costs $8. What is the maximum number of books you can buy?', answer: '6', numeric: 6, hint: '8b <= 50, b <= 6.25, so 6 books' },
        { prompt: 'You need at least 80 points to pass. You have 52 points with 4 assignments left. How many points per assignment do you need?', answer: '7', numeric: 7, hint: '52 + 4x >= 80' },
        { prompt: 'A ride requires you to be taller than 48 inches. Write this as an inequality.', answer: 'h > 48' },
        { prompt: 'A parking garage charges $5 plus $2/hour. You have $19. What is the maximum whole number of hours you can park?', answer: '7', numeric: 7, hint: '5 + 2h <= 19' },
        { prompt: 'Temperature must stay below 40F for the ice rink. Write an inequality.', answer: 't < 40' },
        { prompt: 'A elevator holds at most 2000 lbs. Each person weighs about 160 lbs. How many people can ride?', answer: '12', numeric: 12, hint: '160p <= 2000' },
      ],
    },
    'scale-drawings': {
      problems: [
        { prompt: 'A blueprint has scale 1 in = 4 ft. A room measures 3.5 in on the blueprint. How long is the actual room?', answer: '14', numeric: 14, hint: '3.5 x 4' },
        { prompt: 'A model car is 1:24 scale. The model is 8 inches long. How long is the real car in inches?', answer: '192', numeric: 192 },
        { prompt: 'On a map, 2 cm = 50 km. Two cities are 7 cm apart. What is the actual distance?', answer: '175', numeric: 175, hint: '7 x 25' },
        { prompt: 'A room is 15 ft long. On a scale drawing (1 in = 3 ft), how long should it be drawn?', answer: '5', numeric: 5 },
        { prompt: 'A 6-foot person casts a 4-foot shadow. A tree casts a 20-foot shadow. How tall is the tree?', answer: '30', numeric: 30 },
        { prompt: 'A map scale is 1:50000. A distance of 3 cm on the map represents how many km?', answer: '1.5', numeric: 1.5, hint: '3 x 50000 = 150000 cm = 1.5 km' },
      ],
    },
    'proportion-word-problems': {
      problems: [
        { prompt: 'If 5 oranges cost $3, how much do 12 oranges cost?', answer: '7.20', numeric: 7.20, hint: '3/5 = x/12' },
        { prompt: 'A car uses 3 gallons for every 90 miles. How many gallons for 210 miles?', answer: '7', numeric: 7 },
        { prompt: 'If 8 workers can build a wall in 6 days, how long would 12 workers take?', answer: '4', numeric: 4, hint: 'Inverse proportion: 8x6 = 12xd' },
        { prompt: 'A recipe for 4 servings uses 6 cups of flour. How much flour for 10 servings?', answer: '15', numeric: 15 },
        { prompt: 'In a class, the ratio of boys to girls is 3:5. If there are 40 students, how many boys?', answer: '15', numeric: 15 },
        { prompt: '3 painters can paint a house in 8 hours. At the same rate, how long for 6 painters?', answer: '4', numeric: 4 },
      ],
    },
    'similar-figures': {
      problems: [
        { prompt: 'Two similar triangles have sides in ratio 2:5. If the smaller has a side of 6, what is the corresponding side of the larger?', answer: '15', numeric: 15 },
        { prompt: 'Two similar rectangles: one is 4x6, the other has width 10. What is its length?', answer: '15', numeric: 15, hint: '4/10 = 6/x' },
        { prompt: 'The scale factor between two similar figures is 3:1. If the smaller has area 12, what is the area of the larger?', answer: '108', numeric: 108, hint: 'Area scales by 3^2 = 9' },
        { prompt: 'A triangle has sides 3, 4, 5. A similar triangle has shortest side 9. What is its longest side?', answer: '15', numeric: 15 },
        { prompt: 'Two similar pentagons have perimeters 20 and 30. What is the scale factor?', answer: '2:3', hint: '20/30 = 2/3' },
        { prompt: 'A photo is 4x6. You enlarge it so the short side is 10 inches. What is the long side?', answer: '15', numeric: 15 },
      ],
    },
  },
  'grade-8': {
    'slope-intercept-context': {
      problems: [
        { prompt: 'A plumber charges $50 plus $30/hour. Write the equation for cost (y) based on hours (x).', answer: 'y = 30x + 50' },
        { prompt: 'A plant is 3 cm tall and grows 2 cm per week. How tall is it after 8 weeks?', answer: '19', numeric: 19, hint: 'y = 2(8) + 3' },
        { prompt: 'A gym costs $20/month plus $100 sign-up. After how many months does the total reach $400?', answer: '15', numeric: 15, hint: '20m + 100 = 400' },
        { prompt: 'Temperature drops from 68F at 2 degrees per hour. Write the equation and find the temp after 5 hours.', answer: '58', numeric: 58, hint: 'y = 68 - 2x' },
        { prompt: 'A candle is 12 inches tall and burns at 0.5 inches per hour. When will it be 8 inches tall?', answer: '8', numeric: 8, hint: '12 - 0.5t = 8' },
        { prompt: 'A lake has 200 fish. The population grows by 15 per month. How many after 10 months?', answer: '350', numeric: 350 },
      ],
    },
    'comparing-linear-functions': {
      problems: [
        { prompt: 'Plan A: $10 + $2/mile. Plan B: $4/mile, no base fee. At how many miles do they cost the same?', answer: '5', numeric: 5, hint: '10+2m = 4m' },
        { prompt: 'Tank A starts with 100 gal, drains 5 gal/min. Tank B starts with 60 gal, fills 3 gal/min. When are they equal?', answer: '5', numeric: 5, hint: '100-5t = 60+3t' },
        { prompt: 'Line A: y = 3x + 1. Line B: y = -x + 9. Where do they intersect?', answer: '(2, 7)', hint: '3x+1 = -x+9, x=2' },
        { prompt: 'Job A pays $12/hr. Job B pays $50/day + $8/hr. For an 8-hour day, which pays more?', answer: 'B', hint: 'A: $96, B: $114' },
        { prompt: 'Streaming A: $15/month. Streaming B: $8/month + $1/movie. At how many movies are they equal?', answer: '7', numeric: 7 },
        { prompt: 'Car A depreciates from $20,000 at $2,000/year. Car B from $15,000 at $1,000/year. When are they worth the same?', answer: '5', numeric: 5 },
      ],
    },
    'systems-in-context': {
      problems: [
        { prompt: 'Adult tickets cost $12, child tickets cost $7. A group buys 10 tickets for $95. How many adult tickets?', answer: '5', numeric: 5, hint: 'a + c = 10, 12a + 7c = 95' },
        { prompt: 'A boat goes 24 miles upstream in 3 hours and 24 miles downstream in 2 hours. What is the boat speed in still water?', answer: '10', numeric: 10, hint: 'b-c=8, b+c=12' },
        { prompt: 'A store sells pencils for $0.50 and pens for $1.25. You buy 14 items for $10. How many pens?', answer: '4', numeric: 4 },
        { prompt: 'The sum of two numbers is 40. Their difference is 12. What are the two numbers?', answer: '26 and 14', hint: 'x+y=40, x-y=12' },
        { prompt: 'Mix a 30% solution and a 70% solution to get 100 mL of a 45% solution. How much of the 30% solution?', answer: '62.5', numeric: 62.5 },
        { prompt: 'A farmer has chickens and cows. There are 30 heads and 86 legs. How many cows?', answer: '13', numeric: 13, hint: 'c+k=30, 4c+2k=86' },
      ],
    },
    'distance-problems': {
      problems: [
        { prompt: 'Find the distance between (1, 2) and (4, 6).', answer: '5', numeric: 5, hint: 'sqrt(9+16)=5' },
        { prompt: 'A right triangle has legs of 5 and 12. What is the hypotenuse?', answer: '13', numeric: 13 },
        { prompt: 'Find the distance between (-3, 1) and (5, -5).', answer: '10', numeric: 10, hint: 'sqrt(64+36)' },
        { prompt: 'A 10-foot ladder leans against a wall. The base is 6 feet from the wall. How high does it reach?', answer: '8', numeric: 8 },
        { prompt: 'Find the distance between (0, 0) and (8, 15).', answer: '17', numeric: 17 },
        { prompt: 'A rectangular room is 9 ft by 12 ft. What is the diagonal distance?', answer: '15', numeric: 15 },
      ],
    },
    'real-world-pythagorean': {
      problems: [
        { prompt: 'A 13-foot ladder reaches 12 feet up a wall. How far is the base from the wall?', answer: '5', numeric: 5, hint: '13^2 - 12^2 = 25' },
        { prompt: 'A baseball diamond is a square with 90-foot sides. How far is it from home plate to second base?', answer: '127.3', numeric: 127.3, hint: 'sqrt(90^2 + 90^2) = 90*sqrt(2)' },
        { prompt: 'A kite string is 100 feet long. The kite is directly above a point 60 feet from you. How high is the kite?', answer: '80', numeric: 80 },
        { prompt: 'A ship sails 5 km north and then 12 km east. How far is it from the starting point?', answer: '13', numeric: 13 },
        { prompt: 'A ramp is 15 feet long and rises 9 feet. What is the horizontal distance?', answer: '12', numeric: 12 },
        { prompt: 'A TV is advertised as 50-inch (diagonal). It is 30 inches tall. How wide is it?', answer: '40', numeric: 40 },
      ],
    },
    'coordinate-distance': {
      problems: [
        { prompt: 'Find the midpoint of (2, 8) and (6, 4).', answer: '(4, 6)' },
        { prompt: 'Is the triangle with vertices (0,0), (3,4), (6,0) isosceles?', answer: 'yes', hint: 'Two sides have length 5' },
        { prompt: 'Find the perimeter of a triangle with vertices (0,0), (4,0), (0,3).', answer: '12', numeric: 12, hint: '4 + 3 + 5' },
        { prompt: 'A circle has center (3, 4) and passes through (6, 8). What is the radius?', answer: '5', numeric: 5 },
        { prompt: 'Find the midpoint of (-2, 5) and (8, -3).', answer: '(3, 1)' },
        { prompt: 'What is the distance from the origin to (5, 12)?', answer: '13', numeric: 13 },
      ],
    },
    'scatter-plot-analysis': {
      problems: [
        { prompt: 'A scatter plot shows study hours vs. test scores trending upward. What type of association is this?', answer: 'positive', hint: 'As one increases, the other increases' },
        { prompt: 'Height and shoe size show a positive correlation. Does this mean taller people CAUSE bigger feet?', answer: 'no', hint: 'Correlation does not imply causation' },
        { prompt: 'What does it mean if a scatter plot shows no association?', answer: 'the variables are not related', hint: 'No pattern in the data' },
        { prompt: 'A line of best fit has equation y = 2x + 10. Predict y when x = 15.', answer: '40', numeric: 40 },
        { prompt: 'A data point far from the line of best fit is called a(n) ___?', answer: 'outlier' },
        { prompt: 'Ice cream sales and drowning rates both increase in summer. Are they causally related?', answer: 'no', hint: 'Both are related to a third variable: hot weather' },
      ],
    },
    'trend-interpretation': {
      problems: [
        { prompt: 'A line of best fit shows y = -3x + 100. What does the slope mean in context if x is weeks and y is inventory?', answer: 'inventory decreases by 3 per week', hint: 'Slope = rate of change' },
        { prompt: 'A positive trend in temperature data over 50 years suggests what?', answer: 'temperatures are increasing over time', hint: 'Positive trend = increasing' },
        { prompt: 'Data: (1, 10), (2, 20), (3, 28), (4, 42). Is this more linear or nonlinear?', answer: 'nonlinear', hint: 'The rate of change is not constant' },
        { prompt: 'If r = 0.95 for a correlation, is the linear association strong or weak?', answer: 'strong', hint: 'Close to 1 = strong positive' },
        { prompt: 'A trend line predicts 200 sales in month 12. Actual sales are 180. Is this an overestimate or underestimate?', answer: 'overestimate' },
        { prompt: 'Why is extrapolating far beyond the data range risky?', answer: 'the trend may not continue', hint: 'Patterns can change outside the observed range' },
      ],
    },
    'statistical-reasoning': {
      problems: [
        { prompt: 'A survey of 50 students at one school found 70% prefer pizza. Can we conclude all teens prefer pizza?', answer: 'no', hint: 'Sample is too small and not representative of all teens' },
        { prompt: 'What makes a sample representative?', answer: 'it reflects the diversity and characteristics of the whole population', hint: 'Random, large enough, unbiased' },
        { prompt: 'A study shows a new drug is effective. Later studies cannot replicate the results. What should you conclude?', answer: 'the original result may have been a fluke or the study had issues', hint: 'Replication is key to science' },
        { prompt: 'Mean = 75, Median = 60. Is the data skewed left or right?', answer: 'right', hint: 'Mean > median = right skew' },
        { prompt: 'Why is sample size important in statistics?', answer: 'larger samples are more likely to represent the population accurately', hint: 'Reduces sampling error' },
        { prompt: 'A graph starts its y-axis at 90 instead of 0. How does this mislead?', answer: 'it exaggerates differences between data points', hint: 'Truncated axis makes changes look bigger' },
      ],
    },
  },
};

const STRATEGIES = [
  'Draw a diagram or picture',
  'Make a table or organized list',
  'Look for a pattern',
  'Work backwards from the answer',
  'Guess, check, and revise',
  'Write an equation',
  'Simplify the problem',
  'Consider special or extreme cases',
  'Break it into smaller parts',
  'Act it out or use manipulatives',
];

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

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9./× ^()-]/g, '').replace(/\s+/g, ' '); }

// Exercise generation

function generateExercise(grade, skill, count = 5) {
  const bank = PROBLEM_BANKS[grade]?.[skill];
  if (!bank) return { error: `No problem bank for ${grade}/${skill}` };
  const items = pick(bank.problems, count).map(p => ({
    prompt: p.prompt,
    answer: p.answer,
    ...(p.hint && { hint: p.hint }),
  }));
  return { type: 'problem-solving', skill, grade, count: items.length, instruction: 'Solve each problem. Show your work and explain your reasoning.', items, suggestedStrategies: pick(STRATEGIES, 3) };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  const ne = norm(expected);
  const na = norm(answer);
  if (ne === na) return true;
  const numE = parseFloat(expected);
  const numA = parseFloat(answer);
  if (!isNaN(numE) && !isNaN(numA) && Math.abs(numE - numA) < 0.01) return true;
  if (ne.replace(/\s/g, '') === na.replace(/\s/g, '')) return true;
  return false;
}

// Public API

class ProblemSolving {
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
        understand: 'Read the problem carefully. What is it asking? What information do you have?',
        plan: `Choose a strategy: ${pick(STRATEGIES, 2).join(' or ')}`,
        solve: `Work through ${exercise.count || 0} practice problems`,
        reflect: 'Check your answer. Does it make sense? Could you solve it a different way?',
      },
    };
  }
}

module.exports = ProblemSolving;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new ProblemSolving();
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
      default: out({ usage: 'node problem-solving.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
