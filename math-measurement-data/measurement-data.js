// eClaw Math Measurement & Data Interactive Tutor (K-6). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'math-measurement-data');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'comparison': ['compare-length', 'compare-weight', 'compare-capacity'],
    'sorting': ['sort-by-attribute', 'classify-and-count'],
  },
  'grade-1': {
    'nonstandard-measurement': ['measure-with-objects', 'compare-nonstandard'],
    'standard-units-intro': ['inches-intro', 'centimeters-intro'],
    'time': ['time-to-hour', 'time-to-half-hour'],
    'data': ['organize-categories', 'picture-graphs-read'],
  },
  'grade-2': {
    'length-tools': ['measure-inches', 'measure-centimeters'],
    'estimation': ['estimate-length'],
    'length-operations': ['length-word-problems'],
    'time': ['time-to-five-min', 'am-pm'],
    'money': ['count-coins', 'count-bills-coins'],
    'data': ['line-plots-intro', 'bar-graphs-read'],
  },
  'grade-3': {
    'liquid-volume': ['liters', 'milliliters'],
    'mass': ['grams', 'kilograms'],
    'time': ['time-to-minute', 'elapsed-time'],
    'perimeter': ['measure-perimeter', 'calculate-perimeter'],
    'area': ['area-counting-squares', 'area-rectangles'],
    'data': ['scaled-picture-graphs', 'scaled-bar-graphs'],
  },
  'grade-4': {
    'unit-conversions': ['length-conversions', 'weight-conversions', 'capacity-conversions', 'time-conversions'],
    'area-perimeter': ['area-formula', 'perimeter-formula', 'area-perimeter-relate'],
    'angles': ['identify-angles', 'measure-angles', 'add-subtract-angles'],
    'data': ['line-plots-fractions'],
  },
  'grade-5': {
    'volume': ['cubic-units', 'volume-formula', 'additive-volume'],
    'metric-conversions': ['metric-length', 'metric-mass', 'metric-capacity'],
    'customary-conversions': ['customary-length', 'customary-weight', 'customary-capacity'],
    'data': ['fraction-line-plots', 'coordinate-graphing'],
  },
  'grade-6': {
    'statistical-questions': ['identify-statistical-questions'],
    'measures-of-center': ['mean', 'median', 'mode'],
    'measures-of-spread': ['range', 'interquartile-range'],
    'data-displays': ['histograms', 'box-plots', 'dot-plots'],
    'distribution': ['shape-of-distribution', 'outliers'],
    'probability': ['likelihood', 'experimental-vs-theoretical'],
  },
};

const PROBLEM_BANKS = {
  'kindergarten': {
    'compare-length': {
      items: [
        { prompt: 'Which is longer: a pencil or a crayon?', answer: 'pencil', choices: ['pencil', 'crayon'] },
        { prompt: 'Which is taller: a door or a chair?', answer: 'door', choices: ['door', 'chair'] },
        { prompt: 'Which is shorter: a cat or a giraffe?', answer: 'cat', choices: ['cat', 'giraffe'] },
        { prompt: 'Which is longer: a bus or a car?', answer: 'bus', choices: ['bus', 'car'] },
        { prompt: 'Which is taller: a tree or a flower?', answer: 'tree', choices: ['tree', 'flower'] },
        { prompt: 'Which is shorter: a fork or a broom?', answer: 'fork', choices: ['fork', 'broom'] },
        { prompt: 'Which is longer: a jump rope or a shoelace?', answer: 'jump rope', choices: ['jump rope', 'shoelace'] },
        { prompt: 'Which is taller: a house or a doghouse?', answer: 'house', choices: ['house', 'doghouse'] },
        { prompt: 'Which is shorter: a worm or a snake?', answer: 'worm', choices: ['worm', 'snake'] },
        { prompt: 'Which is longer: a football field or a classroom?', answer: 'football field', choices: ['football field', 'classroom'] },
      ],
    },
    'compare-weight': {
      items: [
        { prompt: 'Which is heavier: a watermelon or a grape?', answer: 'watermelon', choices: ['watermelon', 'grape'] },
        { prompt: 'Which is lighter: a feather or a rock?', answer: 'feather', choices: ['feather', 'rock'] },
        { prompt: 'Which is heavier: a dog or a hamster?', answer: 'dog', choices: ['dog', 'hamster'] },
        { prompt: 'Which is lighter: a balloon or a bowling ball?', answer: 'balloon', choices: ['balloon', 'bowling ball'] },
        { prompt: 'Which is heavier: a backpack full of books or an empty backpack?', answer: 'backpack full of books', choices: ['backpack full of books', 'empty backpack'] },
        { prompt: 'Which is lighter: a pillow or a brick?', answer: 'pillow', choices: ['pillow', 'brick'] },
        { prompt: 'Which is heavier: an elephant or a horse?', answer: 'elephant', choices: ['elephant', 'horse'] },
        { prompt: 'Which is lighter: a pencil or a laptop?', answer: 'pencil', choices: ['pencil', 'laptop'] },
        { prompt: 'Which is heavier: a gallon of milk or an apple?', answer: 'gallon of milk', choices: ['gallon of milk', 'apple'] },
        { prompt: 'Which is lighter: a sock or a boot?', answer: 'sock', choices: ['sock', 'boot'] },
      ],
    },
    'compare-capacity': {
      items: [
        { prompt: 'Which holds more: a bathtub or a cup?', answer: 'bathtub', choices: ['bathtub', 'cup'] },
        { prompt: 'Which holds less: a spoon or a bucket?', answer: 'spoon', choices: ['spoon', 'bucket'] },
        { prompt: 'Which holds more: a swimming pool or a sink?', answer: 'swimming pool', choices: ['swimming pool', 'sink'] },
        { prompt: 'Which holds less: a thimble or a glass?', answer: 'thimble', choices: ['thimble', 'glass'] },
        { prompt: 'Which holds more: a fish tank or a cereal bowl?', answer: 'fish tank', choices: ['fish tank', 'cereal bowl'] },
        { prompt: 'Which holds less: a teaspoon or a pot?', answer: 'teaspoon', choices: ['teaspoon', 'pot'] },
        { prompt: 'Which holds more: a water bottle or a lake?', answer: 'lake', choices: ['water bottle', 'lake'] },
        { prompt: 'Which holds less: a mug or a bathtub?', answer: 'mug', choices: ['mug', 'bathtub'] },
      ],
    },
    'sort-by-attribute': {
      items: [
        { prompt: 'Sort these by size (smallest to biggest): basketball, tennis ball, beach ball', answer: 'tennis ball, basketball, beach ball', acceptedAnswers: ['tennis ball, basketball, beach ball'] },
        { prompt: 'Sort these by length (shortest to longest): pencil, crayon, ruler', answer: 'crayon, pencil, ruler', acceptedAnswers: ['crayon, pencil, ruler'] },
        { prompt: 'Sort these by weight (lightest to heaviest): feather, apple, watermelon', answer: 'feather, apple, watermelon', acceptedAnswers: ['feather, apple, watermelon'] },
        { prompt: 'Sort these by height (shortest to tallest): ant, cat, giraffe', answer: 'ant, cat, giraffe', acceptedAnswers: ['ant, cat, giraffe'] },
        { prompt: 'Sort these by size (smallest to biggest): grape, orange, pumpkin', answer: 'grape, orange, pumpkin', acceptedAnswers: ['grape, orange, pumpkin'] },
        { prompt: 'Sort these by weight (lightest to heaviest): leaf, book, backpack', answer: 'leaf, book, backpack', acceptedAnswers: ['leaf, book, backpack'] },
      ],
    },
    'classify-and-count': {
      items: [
        { prompt: 'You have 3 red blocks, 2 blue blocks, and 4 green blocks. How many blocks in all?', answer: '9' },
        { prompt: 'A basket has 5 apples and 3 bananas. How many more apples than bananas?', answer: '2' },
        { prompt: 'There are 4 circles and 6 squares. How many shapes in all?', answer: '10' },
        { prompt: 'You see 2 dogs, 3 cats, and 1 bird. How many animals in all?', answer: '6' },
        { prompt: 'A jar has 7 red marbles and 3 blue marbles. How many more red than blue?', answer: '4' },
        { prompt: 'There are 5 big buttons and 5 small buttons. How many buttons total?', answer: '10' },
      ],
    },
  },
  'grade-1': {
    'measure-with-objects': {
      items: [
        { prompt: 'A book is 8 paper clips long. A pencil is 5 paper clips long. Which is longer?', answer: 'book' },
        { prompt: 'Your desk is 12 cubes long. Your book is 6 cubes long. How many cubes longer is your desk?', answer: '6' },
        { prompt: 'A ribbon is 10 paper clips long. A string is 7 paper clips long. How much longer is the ribbon?', answer: '3' },
        { prompt: 'A crayon is 4 cubes long. How many crayons placed end to end make 12 cubes?', answer: '3' },
        { prompt: 'A shoe is 9 paper clips long. A hand span is 6 paper clips. How much longer is the shoe?', answer: '3' },
        { prompt: 'You measured a table as 15 cubes long. Your friend measured it as 10 hand spans. Who used a bigger unit?', answer: 'friend', hint: 'Fewer units means each unit is bigger' },
      ],
    },
    'compare-nonstandard': {
      items: [
        { prompt: 'A desk is 6 hand spans long. A bookshelf is 9 hand spans long. Which is longer?', answer: 'bookshelf' },
        { prompt: 'A rug is 12 footsteps long. A hallway is 20 footsteps long. How many more footsteps is the hallway?', answer: '8' },
        { prompt: 'A table is 14 cubes long. A chair is 8 cubes long. How much longer is the table?', answer: '6' },
        { prompt: 'A window is 5 hand spans wide. A door is 4 hand spans wide. Which is wider?', answer: 'window' },
        { prompt: 'A path is 25 footsteps. A driveway is 18 footsteps. How much longer is the path?', answer: '7' },
      ],
    },
    'inches-intro': {
      items: [
        { prompt: 'A paper clip is about 1 inch long. About how many inches is 3 paper clips in a row?', answer: '3' },
        { prompt: 'Your finger is about 1 inch wide. A card is about 3 inches wide. How many fingers wide is the card?', answer: '3' },
        { prompt: 'A crayon is about 4 inches long. Is a crayon closer to 1 inch or 5 inches?', answer: '5 inches' },
        { prompt: 'A marker is about 6 inches long. About how many paper clips long is that?', answer: '6' },
        { prompt: 'Which is about 1 inch: a car, a paper clip, or a baseball bat?', answer: 'paper clip' },
      ],
    },
    'centimeters-intro': {
      items: [
        { prompt: 'A pencil eraser is about 1 centimeter wide. About how many centimeters is 5 erasers in a row?', answer: '5' },
        { prompt: 'Your pinky finger is about 1 cm wide. A book is about 15 cm wide. About how many pinky fingers is that?', answer: '15' },
        { prompt: 'Which is about 1 centimeter: a door, a ladybug, or a table?', answer: 'ladybug' },
        { prompt: 'A cube is 1 cm on each side. How long is a row of 10 cubes?', answer: '10 cm', acceptedAnswers: ['10', '10 cm'] },
        { prompt: 'A pencil is about 19 cm long. Is that closer to 10 cm or 20 cm?', answer: '20 cm', acceptedAnswers: ['20', '20 cm'] },
      ],
    },
    'time-to-hour': {
      items: [
        { prompt: 'The short hand points to 3 and the long hand points to 12. What time is it?', answer: '3:00', acceptedAnswers: ['3:00', "3 o'clock"] },
        { prompt: 'The short hand points to 7 and the long hand points to 12. What time is it?', answer: '7:00', acceptedAnswers: ['7:00', "7 o'clock"] },
        { prompt: 'The short hand points to 12 and the long hand points to 12. What time is it?', answer: '12:00', acceptedAnswers: ['12:00', "12 o'clock"] },
        { prompt: 'The short hand points to 9 and the long hand points to 12. What time is it?', answer: '9:00', acceptedAnswers: ['9:00', "9 o'clock"] },
        { prompt: 'The short hand points to 1 and the long hand points to 12. What time is it?', answer: '1:00', acceptedAnswers: ['1:00', "1 o'clock"] },
        { prompt: 'The short hand points to 6 and the long hand points to 12. What time is it?', answer: '6:00', acceptedAnswers: ['6:00', "6 o'clock"] },
      ],
    },
    'time-to-half-hour': {
      items: [
        { prompt: 'The short hand is between 3 and 4, and the long hand points to 6. What time is it?', answer: '3:30' },
        { prompt: 'The short hand is between 8 and 9, and the long hand points to 6. What time is it?', answer: '8:30' },
        { prompt: 'The short hand is between 12 and 1, and the long hand points to 6. What time is it?', answer: '12:30' },
        { prompt: 'The short hand is between 5 and 6, and the long hand points to 6. What time is it?', answer: '5:30' },
        { prompt: 'The short hand is between 10 and 11, and the long hand points to 6. What time is it?', answer: '10:30' },
        { prompt: 'It is 2:30. Where does the long hand point?', answer: '6' },
      ],
    },
    'organize-categories': {
      items: [
        { prompt: 'Kids picked their favorite pet: dog, cat, dog, fish, dog, cat, fish, dog. How many picked dog?', answer: '4' },
        { prompt: 'Favorite colors: red, blue, red, green, blue, red. How many more picked red than blue?', answer: '1' },
        { prompt: 'Snack votes: apple (5), crackers (3), cheese (4). Which snack got the most votes?', answer: 'apple' },
        { prompt: 'Favorite seasons: spring (3), summer (6), fall (4), winter (2). How many kids voted in all?', answer: '15' },
        { prompt: 'Shirt colors today: blue (7), red (3), green (5). How many more blue than red?', answer: '4' },
      ],
    },
    'picture-graphs-read': {
      items: [
        { prompt: 'A picture graph shows: Apples = 4 pictures, Bananas = 6 pictures, Oranges = 3 pictures. Each picture = 1 fruit. How many bananas?', answer: '6' },
        { prompt: 'A picture graph shows: Dogs = 5, Cats = 3, Birds = 2. How many more dogs than birds?', answer: '3' },
        { prompt: 'A picture graph shows: Red = 4, Blue = 4, Green = 2. Which two colors have the same number?', answer: 'red and blue', acceptedAnswers: ['red and blue', 'red blue'] },
        { prompt: 'A picture graph shows: Soccer = 7, Baseball = 3, Basketball = 5. How many kids in all?', answer: '15' },
        { prompt: 'A picture graph shows: Sunny = 5 days, Rainy = 2 days, Cloudy = 3 days. How many more sunny than rainy days?', answer: '3' },
      ],
    },
  },
  'grade-2': {
    'measure-inches': {
      items: [
        { prompt: 'A marker measures from 0 to 5 on an inch ruler. How long is it?', answer: '5 inches', acceptedAnswers: ['5', '5 inches', '5 in'] },
        { prompt: 'A ribbon goes from 2 inches to 8 inches on a ruler. How long is the ribbon?', answer: '6 inches', acceptedAnswers: ['6', '6 inches', '6 in'] },
        { prompt: 'You measure a book as 11 inches long. Your pencil is 7 inches long. How much longer is the book?', answer: '4 inches', acceptedAnswers: ['4', '4 inches', '4 in'] },
        { prompt: 'A straw is 8 inches. A spoon is 6 inches. What is their total length end to end?', answer: '14 inches', acceptedAnswers: ['14', '14 inches', '14 in'] },
        { prompt: 'A caterpillar is 3 inches long. A worm is 5 inches long. How much shorter is the caterpillar?', answer: '2 inches', acceptedAnswers: ['2', '2 inches', '2 in'] },
      ],
    },
    'measure-centimeters': {
      items: [
        { prompt: 'A leaf measures from 0 to 7 on a centimeter ruler. How long is it?', answer: '7 cm', acceptedAnswers: ['7', '7 cm', '7 centimeters'] },
        { prompt: 'A paper clip goes from 1 cm to 4 cm on a ruler. How long is the paper clip?', answer: '3 cm', acceptedAnswers: ['3', '3 cm', '3 centimeters'] },
        { prompt: 'A crayon is 9 cm. A pen is 14 cm. How much longer is the pen?', answer: '5 cm', acceptedAnswers: ['5', '5 cm', '5 centimeters'] },
        { prompt: 'Two erasers are each 3 cm long. Placed end to end, how long are they?', answer: '6 cm', acceptedAnswers: ['6', '6 cm', '6 centimeters'] },
        { prompt: 'A key is 6 cm long. A marker is 12 cm long. The marker is how many times as long?', answer: '2', acceptedAnswers: ['2', '2 times'] },
      ],
    },
    'estimate-length': {
      items: [
        { prompt: 'A door is about how tall: 2 inches, 2 feet, or 7 feet?', answer: '7 feet', acceptedAnswers: ['7 feet', '7 ft'] },
        { prompt: 'A banana is about how long: 2 centimeters, 20 centimeters, or 2 meters?', answer: '20 centimeters', acceptedAnswers: ['20 centimeters', '20 cm'] },
        { prompt: 'A school bus is about how long: 10 inches, 10 feet, or 35 feet?', answer: '35 feet', acceptedAnswers: ['35 feet', '35 ft'] },
        { prompt: 'A water bottle is about how tall: 2 cm, 20 cm, or 200 cm?', answer: '20 cm', acceptedAnswers: ['20 cm', '20 centimeters'] },
        { prompt: 'Your thumb is about how wide: 1 cm, 10 cm, or 1 meter?', answer: '1 cm', acceptedAnswers: ['1 cm', '1 centimeter'] },
      ],
    },
    'length-word-problems': {
      items: [
        { prompt: 'Sam has a 9-inch ribbon and a 6-inch ribbon. How long are they together?', answer: '15 inches', acceptedAnswers: ['15', '15 inches'] },
        { prompt: 'A rope is 24 inches long. You cut off 10 inches. How long is the rope now?', answer: '14 inches', acceptedAnswers: ['14', '14 inches'] },
        { prompt: 'One side of a square is 5 cm. What is the total of all 4 sides?', answer: '20 cm', acceptedAnswers: ['20', '20 cm'] },
        { prompt: 'A fence post is 36 inches tall. Another is 48 inches tall. How much taller is the second?', answer: '12 inches', acceptedAnswers: ['12', '12 inches'] },
        { prompt: 'You walk 15 meters to school and 15 meters back. How far do you walk in all?', answer: '30 meters', acceptedAnswers: ['30', '30 meters', '30 m'] },
      ],
    },
    'time-to-five-min': {
      items: [
        { prompt: 'The short hand is on 4 and the long hand is on 3. What time is it?', answer: '4:15' },
        { prompt: 'The short hand is past 7 and the long hand is on 9. What time is it?', answer: '7:45' },
        { prompt: 'The short hand is on 11 and the long hand is on 6. What time is it?', answer: '11:30' },
        { prompt: 'The short hand is past 2 and the long hand is on 2. What time is it?', answer: '2:10' },
        { prompt: 'The short hand is past 6 and the long hand is on 11. What time is it?', answer: '6:55' },
        { prompt: 'What time is 20 minutes after 3:00?', answer: '3:20' },
      ],
    },
    'am-pm': {
      items: [
        { prompt: 'You eat breakfast at 7:00 in the morning. Is that 7:00 AM or 7:00 PM?', answer: 'AM', acceptedAnswers: ['AM', 'am', '7:00 AM'] },
        { prompt: 'You eat dinner at 6:00 in the evening. Is that AM or PM?', answer: 'PM', acceptedAnswers: ['PM', 'pm', '6:00 PM'] },
        { prompt: 'School starts at 8:30 in the morning. Is that AM or PM?', answer: 'AM', acceptedAnswers: ['AM', 'am'] },
        { prompt: 'You go to bed at 9:00 at night. Is that AM or PM?', answer: 'PM', acceptedAnswers: ['PM', 'pm'] },
        { prompt: 'Noon is 12:00 ___. (AM or PM)', answer: 'PM', acceptedAnswers: ['PM', 'pm'] },
        { prompt: 'Midnight is 12:00 ___. (AM or PM)', answer: 'AM', acceptedAnswers: ['AM', 'am'] },
      ],
    },
    'count-coins': {
      items: [
        { prompt: 'You have 2 quarters. How much money is that?', answer: '50 cents', acceptedAnswers: ['50', '50 cents', '$0.50', '50c'] },
        { prompt: 'You have 1 quarter, 2 dimes, and 1 nickel. How much?', answer: '50 cents', acceptedAnswers: ['50', '50 cents', '$0.50', '50c'] },
        { prompt: 'You have 3 dimes and 2 pennies. How much?', answer: '32 cents', acceptedAnswers: ['32', '32 cents', '$0.32', '32c'] },
        { prompt: 'You have 1 quarter, 1 dime, 1 nickel, and 3 pennies. How much?', answer: '43 cents', acceptedAnswers: ['43', '43 cents', '$0.43', '43c'] },
        { prompt: 'You have 4 nickels. How much money is that?', answer: '20 cents', acceptedAnswers: ['20', '20 cents', '$0.20', '20c'] },
        { prompt: 'You have 3 quarters and 2 dimes. How much?', answer: '95 cents', acceptedAnswers: ['95', '95 cents', '$0.95', '95c'] },
      ],
    },
    'count-bills-coins': {
      items: [
        { prompt: 'You have one $1 bill and 3 quarters. How much money?', answer: '$1.75', acceptedAnswers: ['$1.75', '1.75', '175 cents'] },
        { prompt: 'You have two $1 bills and 2 dimes. How much?', answer: '$2.20', acceptedAnswers: ['$2.20', '2.20'] },
        { prompt: 'You have one $5 bill and 1 quarter. How much?', answer: '$5.25', acceptedAnswers: ['$5.25', '5.25'] },
        { prompt: 'You have one $1 bill, 1 dime, and 3 pennies. How much?', answer: '$1.13', acceptedAnswers: ['$1.13', '1.13'] },
        { prompt: 'You have two $5 bills and 2 quarters. How much?', answer: '$10.50', acceptedAnswers: ['$10.50', '10.50'] },
      ],
    },
    'line-plots-intro': {
      items: [
        { prompt: 'A line plot shows X marks above numbers 1-5. Number 3 has 4 Xs, number 2 has 2 Xs, number 4 has 3 Xs. Which number appears most?', answer: '3' },
        { prompt: 'A line plot of shoe sizes: size 1 (2 Xs), size 2 (5 Xs), size 3 (3 Xs). How many students in all?', answer: '10' },
        { prompt: 'A line plot shows: 5 inches (1 X), 6 inches (4 Xs), 7 inches (2 Xs). How many objects were measured?', answer: '7' },
        { prompt: 'A line plot of pencil lengths: 4 in (3 Xs), 5 in (5 Xs), 6 in (2 Xs). How many more pencils are 5 in than 6 in?', answer: '3' },
        { prompt: 'A line plot shows ages at a party: 6 (3 Xs), 7 (4 Xs), 8 (1 X). What is the most common age?', answer: '7' },
      ],
    },
    'bar-graphs-read': {
      items: [
        { prompt: 'A bar graph shows: Pizza=8, Tacos=5, Burgers=6. How many more students chose pizza than tacos?', answer: '3' },
        { prompt: 'A bar graph shows: Spring=4, Summer=9, Fall=3, Winter=2. Which season is most popular?', answer: 'summer' },
        { prompt: 'A bar graph shows: Red=6, Blue=6, Green=3. How many students voted in all?', answer: '15' },
        { prompt: 'A bar graph shows: Dogs=7, Cats=5, Fish=3, Birds=1. How many more dogs than fish?', answer: '4' },
        { prompt: 'A bar graph shows: Monday=4, Tuesday=6, Wednesday=2. Which day had the fewest?', answer: 'Wednesday', acceptedAnswers: ['Wednesday', 'wednesday'] },
      ],
    },
  },
  'grade-3': {
    'liters': {
      items: [
        { prompt: 'A large water bottle holds 1 liter. You drink 3 bottles. How many liters did you drink?', answer: '3' },
        { prompt: 'A fish tank holds 20 liters. You pour in 8 liters. How many more liters to fill it?', answer: '12' },
        { prompt: 'You have 5 liters of juice and pour out 2 liters. How much is left?', answer: '3 liters', acceptedAnswers: ['3', '3 liters', '3 L'] },
        { prompt: 'A bucket holds 10 liters. A pot holds 4 liters. How much more does the bucket hold?', answer: '6 liters', acceptedAnswers: ['6', '6 liters', '6 L'] },
        { prompt: 'Three containers hold 2 liters, 5 liters, and 3 liters. What is the total?', answer: '10 liters', acceptedAnswers: ['10', '10 liters', '10 L'] },
      ],
    },
    'milliliters': {
      items: [
        { prompt: 'A teaspoon holds about 5 mL. How many mL in 4 teaspoons?', answer: '20 mL', acceptedAnswers: ['20', '20 mL'] },
        { prompt: 'A cup holds 250 mL. You pour out 100 mL. How much is left?', answer: '150 mL', acceptedAnswers: ['150', '150 mL'] },
        { prompt: 'A medicine dose is 10 mL. You take 3 doses. How many mL total?', answer: '30 mL', acceptedAnswers: ['30', '30 mL'] },
        { prompt: 'A bottle has 500 mL. You drink 200 mL. How much is left?', answer: '300 mL', acceptedAnswers: ['300', '300 mL'] },
        { prompt: 'Which holds more: 800 mL or 1 liter (1000 mL)?', answer: '1 liter', acceptedAnswers: ['1 liter', '1 L', '1000 mL'] },
      ],
    },
    'grams': {
      items: [
        { prompt: 'A paper clip weighs about 1 gram. About how many grams do 10 paper clips weigh?', answer: '10', acceptedAnswers: ['10', '10 grams', '10 g'] },
        { prompt: 'An apple weighs about 200 grams. Two apples weigh about how many grams?', answer: '400', acceptedAnswers: ['400', '400 grams', '400 g'] },
        { prompt: 'A pencil weighs 6 grams. A marker weighs 15 grams. How much heavier is the marker?', answer: '9 grams', acceptedAnswers: ['9', '9 grams', '9 g'] },
        { prompt: 'Which is heavier: 500 grams or 1 kilogram (1000 grams)?', answer: '1 kilogram', acceptedAnswers: ['1 kilogram', '1 kg', '1000 grams'] },
        { prompt: 'A bag of rice weighs 450 grams. You use 200 grams. How much is left?', answer: '250 grams', acceptedAnswers: ['250', '250 grams', '250 g'] },
      ],
    },
    'kilograms': {
      items: [
        { prompt: 'A pineapple weighs about 1 kg. Five pineapples weigh about how many kg?', answer: '5', acceptedAnswers: ['5', '5 kg', '5 kilograms'] },
        { prompt: 'A cat weighs 4 kg. A dog weighs 12 kg. How much more does the dog weigh?', answer: '8 kg', acceptedAnswers: ['8', '8 kg', '8 kilograms'] },
        { prompt: 'A backpack weighs 3 kg. You add 2 kg of books. How heavy is it now?', answer: '5 kg', acceptedAnswers: ['5', '5 kg', '5 kilograms'] },
        { prompt: 'A watermelon weighs 6 kg. You cut it in half. About how much does each half weigh?', answer: '3 kg', acceptedAnswers: ['3', '3 kg', '3 kilograms'] },
        { prompt: 'Three boxes weigh 2 kg, 5 kg, and 3 kg. What is the total weight?', answer: '10 kg', acceptedAnswers: ['10', '10 kg', '10 kilograms'] },
      ],
    },
    'time-to-minute': {
      items: [
        { prompt: 'The clock shows 2:37. The long hand is between which two numbers?', answer: '7 and 8', acceptedAnswers: ['7 and 8'] },
        { prompt: 'The time is 9:14. How many minutes after 9:00 is that?', answer: '14' },
        { prompt: 'The clock shows 5:52. How many minutes until 6:00?', answer: '8' },
        { prompt: 'It is 11:03. In 15 minutes, what time will it be?', answer: '11:18' },
        { prompt: 'The time is 7:46. What time was it 20 minutes ago?', answer: '7:26' },
      ],
    },
    'elapsed-time': {
      items: [
        { prompt: 'A movie starts at 2:00 PM and ends at 4:30 PM. How long is the movie?', answer: '2 hours 30 minutes', acceptedAnswers: ['2 hours 30 minutes', '2 hr 30 min', '150 minutes', '2.5 hours'] },
        { prompt: 'You start reading at 3:15 and read for 45 minutes. What time do you stop?', answer: '4:00' },
        { prompt: 'School starts at 8:00 AM and ends at 3:00 PM. How many hours is that?', answer: '7', acceptedAnswers: ['7', '7 hours'] },
        { prompt: 'You began homework at 4:30 PM and finished at 5:15 PM. How long did it take?', answer: '45 minutes', acceptedAnswers: ['45', '45 minutes', '45 min'] },
        { prompt: 'A cake goes in the oven at 10:20 AM and bakes for 35 minutes. When is it done?', answer: '10:55 AM', acceptedAnswers: ['10:55', '10:55 AM'] },
      ],
    },
    'measure-perimeter': {
      items: [
        { prompt: 'A rectangle has sides of 5 cm, 3 cm, 5 cm, and 3 cm. What is the perimeter?', answer: '16 cm', acceptedAnswers: ['16', '16 cm'] },
        { prompt: 'A square has sides of 4 inches. What is the perimeter?', answer: '16 inches', acceptedAnswers: ['16', '16 inches', '16 in'] },
        { prompt: 'A triangle has sides of 3 cm, 4 cm, and 5 cm. What is the perimeter?', answer: '12 cm', acceptedAnswers: ['12', '12 cm'] },
        { prompt: 'A rectangle is 7 m long and 2 m wide. What is the perimeter?', answer: '18 m', acceptedAnswers: ['18', '18 m', '18 meters'] },
        { prompt: 'A pentagon has 5 equal sides of 6 cm each. What is the perimeter?', answer: '30 cm', acceptedAnswers: ['30', '30 cm'] },
      ],
    },
    'calculate-perimeter': {
      items: [
        { prompt: 'A rectangle has a perimeter of 20 cm. Its length is 6 cm. What is its width?', answer: '4 cm', acceptedAnswers: ['4', '4 cm'] },
        { prompt: 'A square has a perimeter of 36 inches. What is the length of one side?', answer: '9 inches', acceptedAnswers: ['9', '9 inches', '9 in'] },
        { prompt: 'You need to put a fence around a garden that is 8 m long and 5 m wide. How many meters of fence?', answer: '26 m', acceptedAnswers: ['26', '26 m', '26 meters'] },
        { prompt: 'A rectangle is 10 ft long and 4 ft wide. What is its perimeter?', answer: '28 ft', acceptedAnswers: ['28', '28 ft', '28 feet'] },
        { prompt: 'A square garden has a perimeter of 24 m. How long is each side?', answer: '6 m', acceptedAnswers: ['6', '6 m', '6 meters'] },
      ],
    },
    'area-counting-squares': {
      items: [
        { prompt: 'A rectangle is covered by 3 rows of 4 unit squares each. What is the area?', answer: '12 square units', acceptedAnswers: ['12', '12 square units', '12 sq units'] },
        { prompt: 'A shape covers 15 unit squares. What is its area?', answer: '15 square units', acceptedAnswers: ['15', '15 square units'] },
        { prompt: 'A rectangle has 5 rows with 6 squares in each row. What is the area?', answer: '30 square units', acceptedAnswers: ['30', '30 square units'] },
        { prompt: 'A rectangle is 4 units long and 3 units wide. How many unit squares fit inside?', answer: '12', acceptedAnswers: ['12', '12 square units'] },
        { prompt: 'Two rectangles: one is 3x2=6 square units, the other is 2x4=8 square units. Total area?', answer: '14 square units', acceptedAnswers: ['14', '14 square units'] },
      ],
    },
    'area-rectangles': {
      items: [
        { prompt: 'A rectangle is 7 cm long and 3 cm wide. What is the area?', answer: '21 sq cm', acceptedAnswers: ['21', '21 sq cm', '21 square cm', '21 cm2'] },
        { prompt: 'A rug is 5 ft by 8 ft. What is the area?', answer: '40 sq ft', acceptedAnswers: ['40', '40 sq ft', '40 square feet'] },
        { prompt: 'A table top is 4 m by 2 m. What is the area?', answer: '8 sq m', acceptedAnswers: ['8', '8 sq m', '8 square meters'] },
        { prompt: 'A poster is 6 inches by 9 inches. What is the area?', answer: '54 sq in', acceptedAnswers: ['54', '54 sq in', '54 square inches'] },
        { prompt: 'A garden is 10 m long and has an area of 60 sq m. How wide is it?', answer: '6 m', acceptedAnswers: ['6', '6 m', '6 meters'] },
      ],
    },
    'scaled-picture-graphs': {
      items: [
        { prompt: 'A picture graph shows: Apples=3 pictures, Bananas=5 pictures. Each picture = 2 fruits. How many bananas?', answer: '10' },
        { prompt: 'Each picture = 5 books. The library row shows 4 pictures. How many books?', answer: '20' },
        { prompt: 'Each picture = 2 votes. Pizza has 6 pictures, Tacos has 4 pictures. How many more pizza votes?', answer: '4', hint: '(6-4)x2=4' },
        { prompt: 'Each star = 10 points. You earned 3 stars. How many points?', answer: '30' },
        { prompt: 'Each smiley = 5 students. Grade 3 has 4 smileys, Grade 4 has 6 smileys. How many students in both?', answer: '50' },
      ],
    },
    'scaled-bar-graphs': {
      items: [
        { prompt: 'A bar graph has a scale of 0, 2, 4, 6, 8, 10. The "Soccer" bar reaches 8. How many chose soccer?', answer: '8' },
        { prompt: 'A bar graph scale goes by 5s. The "Dogs" bar reaches 15 and "Cats" reaches 10. How many more dogs?', answer: '5' },
        { prompt: 'A bar graph scale goes by 10s. The "Red" bar reaches 30 and "Blue" reaches 50. Total of both?', answer: '80' },
        { prompt: 'A bar graph shows candy sold: Mon=10, Tue=25, Wed=15. Scale goes by 5s. Which day sold most?', answer: 'Tuesday', acceptedAnswers: ['Tuesday', 'tuesday', 'Tue'] },
        { prompt: 'A bar graph scale goes by 2s. The bar for "rain" reaches 14. How many rainy days?', answer: '14' },
      ],
    },
  },
  'grade-4': {
    'length-conversions': {
      items: [
        { prompt: 'How many inches are in 3 feet?', answer: '36', hint: '1 ft = 12 in' },
        { prompt: 'How many feet are in 2 yards?', answer: '6', hint: '1 yd = 3 ft' },
        { prompt: 'Convert 48 inches to feet.', answer: '4 feet', acceptedAnswers: ['4', '4 feet', '4 ft'] },
        { prompt: 'How many yards are in 15 feet?', answer: '5', acceptedAnswers: ['5', '5 yards', '5 yd'] },
        { prompt: 'Which is longer: 2 yards or 7 feet?', answer: '7 feet', acceptedAnswers: ['7 feet', '7 ft'] },
      ],
    },
    'weight-conversions': {
      items: [
        { prompt: 'How many ounces are in 2 pounds?', answer: '32', hint: '1 lb = 16 oz' },
        { prompt: 'Convert 48 ounces to pounds.', answer: '3 pounds', acceptedAnswers: ['3', '3 pounds', '3 lb'] },
        { prompt: 'How many pounds are in 1 ton?', answer: '2000', acceptedAnswers: ['2000', '2,000', '2000 pounds'] },
        { prompt: 'Which is heavier: 20 ounces or 1 pound?', answer: '20 ounces', acceptedAnswers: ['20 ounces', '20 oz'] },
        { prompt: 'A bag weighs 5 pounds. How many ounces is that?', answer: '80', acceptedAnswers: ['80', '80 ounces', '80 oz'] },
      ],
    },
    'capacity-conversions': {
      items: [
        { prompt: 'How many cups are in 1 quart?', answer: '4', hint: '2 cups = 1 pint, 2 pints = 1 quart' },
        { prompt: 'How many quarts are in 1 gallon?', answer: '4' },
        { prompt: 'How many pints are in 3 quarts?', answer: '6', hint: '1 quart = 2 pints' },
        { prompt: 'Convert 8 cups to quarts.', answer: '2 quarts', acceptedAnswers: ['2', '2 quarts', '2 qt'] },
        { prompt: 'How many cups are in 1 gallon?', answer: '16' },
      ],
    },
    'time-conversions': {
      items: [
        { prompt: 'How many minutes are in 3 hours?', answer: '180' },
        { prompt: 'How many seconds are in 2 minutes?', answer: '120' },
        { prompt: 'Convert 240 minutes to hours.', answer: '4 hours', acceptedAnswers: ['4', '4 hours', '4 hr'] },
        { prompt: 'How many hours are in 2 days?', answer: '48' },
        { prompt: 'How many minutes are in 1 hour and 15 minutes?', answer: '75' },
      ],
    },
    'area-formula': {
      items: [
        { prompt: 'A rectangle is 12 cm long and 5 cm wide. What is the area?', answer: '60 sq cm', acceptedAnswers: ['60', '60 sq cm', '60 cm2'] },
        { prompt: 'A square has sides of 9 m. What is the area?', answer: '81 sq m', acceptedAnswers: ['81', '81 sq m', '81 m2'] },
        { prompt: 'A rectangle has an area of 56 sq in and a length of 8 in. What is the width?', answer: '7 in', acceptedAnswers: ['7', '7 in', '7 inches'] },
        { prompt: 'A garden is 15 ft by 20 ft. What is the area?', answer: '300 sq ft', acceptedAnswers: ['300', '300 sq ft'] },
        { prompt: 'A room is 11 m by 8 m. How many square meters of carpet do you need?', answer: '88', acceptedAnswers: ['88', '88 sq m', '88 m2'] },
      ],
    },
    'perimeter-formula': {
      items: [
        { prompt: 'A rectangle is 14 cm long and 6 cm wide. What is the perimeter?', answer: '40 cm', acceptedAnswers: ['40', '40 cm'] },
        { prompt: 'A square has sides of 11 m. What is the perimeter?', answer: '44 m', acceptedAnswers: ['44', '44 m'] },
        { prompt: 'A rectangle has a perimeter of 30 in. Its length is 9 in. What is its width?', answer: '6 in', acceptedAnswers: ['6', '6 in', '6 inches'] },
        { prompt: 'You need border tape around a 12 ft by 8 ft bulletin board. How many feet of tape?', answer: '40 ft', acceptedAnswers: ['40', '40 ft'] },
        { prompt: 'A square pool has a perimeter of 48 m. What is the length of one side?', answer: '12 m', acceptedAnswers: ['12', '12 m'] },
      ],
    },
    'area-perimeter-relate': {
      items: [
        { prompt: 'Two rectangles both have area 24 sq cm. Rectangle A is 6x4 and Rectangle B is 8x3. Which has a greater perimeter?', answer: 'B', acceptedAnswers: ['B', 'rectangle b', 'Rectangle B', '8x3'] },
        { prompt: 'A square has area 36 sq cm. What is its perimeter?', answer: '24 cm', acceptedAnswers: ['24', '24 cm'] },
        { prompt: 'A rectangle with perimeter 20 cm has a width of 3 cm. What is the area?', answer: '21 sq cm', acceptedAnswers: ['21', '21 sq cm'] },
        { prompt: 'True or false: Two shapes with the same perimeter always have the same area.', answer: 'false' },
        { prompt: 'A rectangle has area 48 sq m and length 12 m. What is the perimeter?', answer: '32 m', acceptedAnswers: ['32', '32 m'] },
      ],
    },
    'identify-angles': {
      items: [
        { prompt: 'An angle that measures exactly 90 degrees is called a ___ angle.', answer: 'right' },
        { prompt: 'An angle that measures less than 90 degrees is called a(n) ___ angle.', answer: 'acute' },
        { prompt: 'An angle that measures more than 90 degrees but less than 180 degrees is called a(n) ___ angle.', answer: 'obtuse' },
        { prompt: 'A straight line makes an angle of ___ degrees.', answer: '180' },
        { prompt: 'The corner of a book is an example of what type of angle?', answer: 'right' },
      ],
    },
    'measure-angles': {
      items: [
        { prompt: 'An angle measures 45 degrees. Is it acute, right, or obtuse?', answer: 'acute' },
        { prompt: 'An angle measures 120 degrees. Is it acute, right, or obtuse?', answer: 'obtuse' },
        { prompt: 'A square corner measures exactly how many degrees?', answer: '90' },
        { prompt: 'An angle measures 90 degrees. Is it acute, right, or obtuse?', answer: 'right' },
        { prompt: 'An angle is 175 degrees. Is it acute, right, or obtuse?', answer: 'obtuse' },
      ],
    },
    'add-subtract-angles': {
      items: [
        { prompt: 'Two angles together make a right angle. One is 30 degrees. What is the other?', answer: '60', acceptedAnswers: ['60', '60 degrees'] },
        { prompt: 'A straight angle is 180 degrees. If one part is 110 degrees, what is the other part?', answer: '70', acceptedAnswers: ['70', '70 degrees'] },
        { prompt: 'Two angles add up to 150 degrees. One is 75 degrees. What is the other?', answer: '75', acceptedAnswers: ['75', '75 degrees'] },
        { prompt: 'A right angle is split into two angles. One is 40 degrees. What is the other?', answer: '50', acceptedAnswers: ['50', '50 degrees'] },
        { prompt: 'Three angles form a straight line (180 degrees): 60, 50, and ___?', answer: '70', acceptedAnswers: ['70', '70 degrees'] },
      ],
    },
    'line-plots-fractions': {
      items: [
        { prompt: 'A line plot shows lengths: 1/4 in (2 Xs), 1/2 in (4 Xs), 3/4 in (3 Xs), 1 in (1 X). How many objects were measured?', answer: '10' },
        { prompt: 'On the same line plot, what is the most common length?', answer: '1/2 in', acceptedAnswers: ['1/2', '1/2 in', '1/2 inch'] },
        { prompt: 'A line plot shows: 1/8 (1 X), 2/8 (3 Xs), 3/8 (2 Xs). What is the total of all the lengths?', answer: '13/8', acceptedAnswers: ['13/8', '1 5/8'] },
        { prompt: 'A line plot shows ribbon lengths: 1/4 ft (2 Xs), 1/2 ft (3 Xs), 3/4 ft (1 X). How much ribbon in all?', answer: '2 3/4 ft', acceptedAnswers: ['2 3/4', '2 3/4 ft', '11/4', '11/4 ft'] },
        { prompt: 'How many objects are shorter than 1/2 inch if the line plot shows: 1/4 (3 Xs), 1/2 (2 Xs), 3/4 (4 Xs)?', answer: '3' },
      ],
    },
  },
  'grade-5': {
    'cubic-units': {
      items: [
        { prompt: 'A rectangular prism is filled with 24 unit cubes. What is its volume?', answer: '24 cubic units', acceptedAnswers: ['24', '24 cubic units'] },
        { prompt: 'A box is 3 cubes long, 2 cubes wide, and 4 cubes tall. How many cubes fill it?', answer: '24', acceptedAnswers: ['24', '24 cubic units'] },
        { prompt: 'Each cube has a volume of 1 cubic cm. A shape is made of 15 cubes. What is the volume?', answer: '15 cubic cm', acceptedAnswers: ['15', '15 cubic cm', '15 cm3'] },
        { prompt: 'A layer has 6 unit cubes. There are 5 layers. What is the total volume?', answer: '30 cubic units', acceptedAnswers: ['30', '30 cubic units'] },
        { prompt: 'A box holds 2 layers of 3x4 cubes each. What is the volume?', answer: '24 cubic units', acceptedAnswers: ['24', '24 cubic units'] },
      ],
    },
    'volume-formula': {
      items: [
        { prompt: 'A box is 6 cm long, 4 cm wide, and 3 cm tall. Volume = l x w x h. What is the volume?', answer: '72 cubic cm', acceptedAnswers: ['72', '72 cubic cm', '72 cm3'] },
        { prompt: 'A rectangular prism: l=10 in, w=5 in, h=2 in. What is the volume?', answer: '100 cubic in', acceptedAnswers: ['100', '100 cubic in', '100 in3'] },
        { prompt: 'A cube has sides of 5 m. What is the volume?', answer: '125 cubic m', acceptedAnswers: ['125', '125 cubic m', '125 m3'] },
        { prompt: 'A box has volume 60 cubic ft. Its length is 5 ft and width is 4 ft. What is the height?', answer: '3 ft', acceptedAnswers: ['3', '3 ft', '3 feet'] },
        { prompt: 'A swimming pool is 12 m long, 6 m wide, and 2 m deep. What is the volume?', answer: '144 cubic m', acceptedAnswers: ['144', '144 cubic m', '144 m3'] },
      ],
    },
    'additive-volume': {
      items: [
        { prompt: 'An L-shaped figure: one part is 4x3x2=24 cubic cm, the other is 3x2x2=12 cubic cm. Total volume?', answer: '36 cubic cm', acceptedAnswers: ['36', '36 cubic cm'] },
        { prompt: 'A T-shape: top part 6x2x1=12, bottom part 2x2x3=12. Total volume?', answer: '24 cubic units', acceptedAnswers: ['24', '24 cubic units'] },
        { prompt: 'Two boxes stacked: Box A is 5x4x3=60, Box B is 5x4x2=40. Combined volume?', answer: '100 cubic units', acceptedAnswers: ['100', '100 cubic units'] },
        { prompt: 'A step shape: bottom step 8x4x1=32, top step 4x4x1=16. Total volume?', answer: '48 cubic units', acceptedAnswers: ['48', '48 cubic units'] },
        { prompt: 'Two rooms: Room 1 is 10x8x3=240 cubic ft, Room 2 is 6x8x3=144 cubic ft. Total volume?', answer: '384 cubic ft', acceptedAnswers: ['384', '384 cubic ft'] },
      ],
    },
    'metric-length': {
      items: [
        { prompt: 'Convert 3 meters to centimeters.', answer: '300 cm', acceptedAnswers: ['300', '300 cm'] },
        { prompt: 'Convert 5000 meters to kilometers.', answer: '5 km', acceptedAnswers: ['5', '5 km'] },
        { prompt: 'Convert 250 cm to meters.', answer: '2.5 m', acceptedAnswers: ['2.5', '2.5 m'] },
        { prompt: 'How many millimeters are in 4 centimeters?', answer: '40', acceptedAnswers: ['40', '40 mm'] },
        { prompt: 'Convert 7.5 km to meters.', answer: '7500 m', acceptedAnswers: ['7500', '7500 m'] },
      ],
    },
    'metric-mass': {
      items: [
        { prompt: 'Convert 3 kilograms to grams.', answer: '3000 g', acceptedAnswers: ['3000', '3000 g'] },
        { prompt: 'Convert 4500 grams to kilograms.', answer: '4.5 kg', acceptedAnswers: ['4.5', '4.5 kg'] },
        { prompt: 'A box weighs 2.5 kg. How many grams is that?', answer: '2500 g', acceptedAnswers: ['2500', '2500 g'] },
        { prompt: 'Which is heavier: 800 g or 1.2 kg?', answer: '1.2 kg', acceptedAnswers: ['1.2 kg'] },
        { prompt: 'Convert 750 g to kg.', answer: '0.75 kg', acceptedAnswers: ['0.75', '0.75 kg'] },
      ],
    },
    'metric-capacity': {
      items: [
        { prompt: 'Convert 2 liters to milliliters.', answer: '2000 mL', acceptedAnswers: ['2000', '2000 mL'] },
        { prompt: 'Convert 3500 mL to liters.', answer: '3.5 L', acceptedAnswers: ['3.5', '3.5 L'] },
        { prompt: 'A jug holds 1.5 L. How many mL is that?', answer: '1500 mL', acceptedAnswers: ['1500', '1500 mL'] },
        { prompt: 'Which is more: 900 mL or 1 L?', answer: '1 L', acceptedAnswers: ['1 L', '1 liter'] },
        { prompt: 'You drink 250 mL four times a day. How many liters is that?', answer: '1 L', acceptedAnswers: ['1', '1 L', '1 liter', '1000 mL'] },
      ],
    },
    'customary-length': {
      items: [
        { prompt: 'Convert 4 feet to inches.', answer: '48 inches', acceptedAnswers: ['48', '48 inches', '48 in'] },
        { prompt: 'Convert 2 miles to feet.', answer: '10560 feet', acceptedAnswers: ['10560', '10,560', '10560 feet', '10560 ft'] },
        { prompt: 'How many yards are in 18 feet?', answer: '6', acceptedAnswers: ['6', '6 yards', '6 yd'] },
        { prompt: 'Convert 5 yards to inches.', answer: '180 inches', acceptedAnswers: ['180', '180 inches', '180 in'] },
        { prompt: 'Which is longer: 100 inches or 3 yards?', answer: '3 yards', acceptedAnswers: ['3 yards', '3 yd'], hint: '3 yd = 108 in' },
      ],
    },
    'customary-weight': {
      items: [
        { prompt: 'Convert 5 pounds to ounces.', answer: '80 ounces', acceptedAnswers: ['80', '80 ounces', '80 oz'] },
        { prompt: 'Convert 64 ounces to pounds.', answer: '4 pounds', acceptedAnswers: ['4', '4 pounds', '4 lb'] },
        { prompt: 'How many pounds are in 3 tons?', answer: '6000', acceptedAnswers: ['6000', '6,000', '6000 pounds'] },
        { prompt: 'Which is heavier: 30 ounces or 2 pounds?', answer: '30 ounces', acceptedAnswers: ['30 ounces', '30 oz'] },
        { prompt: 'A baby weighs 7 pounds 8 ounces. How many total ounces?', answer: '120', acceptedAnswers: ['120', '120 ounces', '120 oz'] },
      ],
    },
    'customary-capacity': {
      items: [
        { prompt: 'Convert 3 gallons to quarts.', answer: '12 quarts', acceptedAnswers: ['12', '12 quarts', '12 qt'] },
        { prompt: 'How many cups are in 3 pints?', answer: '6', acceptedAnswers: ['6', '6 cups'] },
        { prompt: 'Convert 16 cups to gallons.', answer: '1 gallon', acceptedAnswers: ['1', '1 gallon', '1 gal'] },
        { prompt: 'How many pints are in 2 gallons?', answer: '16', acceptedAnswers: ['16', '16 pints', '16 pt'] },
        { prompt: 'Which is more: 5 quarts or 1 gallon?', answer: '5 quarts', acceptedAnswers: ['5 quarts', '5 qt'] },
      ],
    },
    'fraction-line-plots': {
      items: [
        { prompt: 'A line plot shows plant heights: 1/2 in (3 Xs), 1 in (4 Xs), 1 1/2 in (2 Xs), 2 in (1 X). How many plants?', answer: '10' },
        { prompt: 'Same plot: what is the difference between the tallest and shortest plant?', answer: '1 1/2 inches', acceptedAnswers: ['1 1/2', '1.5', '1 1/2 inches', '3/2'] },
        { prompt: 'A line plot: 1/4 lb (2 Xs), 1/2 lb (5 Xs), 3/4 lb (3 Xs). Total weight of all items?', answer: '4 3/4 lb', acceptedAnswers: ['4 3/4', '19/4', '4.75', '4 3/4 lb'] },
        { prompt: 'How many items weigh more than 1/4 lb on the same plot?', answer: '8' },
        { prompt: 'A line plot: 1/8 (1 X), 3/8 (3 Xs), 5/8 (2 Xs). What is the most common measurement?', answer: '3/8' },
      ],
    },
    'coordinate-graphing': {
      items: [
        { prompt: 'What is the name of the point (0, 0) on a coordinate plane?', answer: 'origin' },
        { prompt: 'Plot point A at (3, 5). How far right do you go?', answer: '3' },
        { prompt: 'Plot point A at (3, 5). How far up do you go?', answer: '5' },
        { prompt: 'What ordered pair is 4 units right and 2 units up from the origin?', answer: '(4, 2)', acceptedAnswers: ['(4, 2)', '4, 2', '(4,2)'] },
        { prompt: 'Point B is at (6, 1) and Point C is at (6, 7). How far apart are they?', answer: '6 units', acceptedAnswers: ['6', '6 units'] },
      ],
    },
  },
  'grade-6': {
    'identify-statistical-questions': {
      items: [
        { prompt: 'Is this a statistical question? "How old am I?" (yes or no)', answer: 'no', explanation: 'It has only one answer, no variability' },
        { prompt: 'Is this a statistical question? "How old are the students in my class?" (yes or no)', answer: 'yes', explanation: 'Different students have different ages' },
        { prompt: 'Is this a statistical question? "How many days are in a week?" (yes or no)', answer: 'no', explanation: 'Always 7, no variability' },
        { prompt: 'Is this a statistical question? "How many hours do 6th graders sleep each night?" (yes or no)', answer: 'yes', explanation: 'Different students sleep different amounts' },
        { prompt: 'Is this a statistical question? "What is the capital of France?" (yes or no)', answer: 'no', explanation: 'Only one answer: Paris' },
        { prompt: 'Is this a statistical question? "How tall are the trees in our schoolyard?" (yes or no)', answer: 'yes', explanation: 'Different trees have different heights' },
      ],
    },
    'mean': {
      items: [
        { prompt: 'Find the mean of: 4, 8, 6, 10, 2', answer: '6', hint: 'Add all, divide by 5' },
        { prompt: 'Find the mean of: 12, 15, 9, 18, 6', answer: '12', hint: '(12+15+9+18+6) / 5' },
        { prompt: 'Test scores: 80, 90, 70, 100, 85. What is the mean?', answer: '85' },
        { prompt: 'Temperatures: 72, 68, 75, 71, 74. What is the mean?', answer: '72' },
        { prompt: 'Five students read 3, 7, 2, 8, 5 books. If they shared equally, how many each? (This is the mean!)', answer: '5' },
        { prompt: 'The mean of 4 numbers is 10. Three numbers are 8, 12, and 6. What is the fourth?', answer: '14' },
      ],
    },
    'median': {
      items: [
        { prompt: 'Find the median of: 3, 7, 1, 9, 5', answer: '5', hint: 'Order first: 1, 3, 5, 7, 9. Middle = 5' },
        { prompt: 'Find the median of: 12, 4, 8, 16, 20, 6', answer: '10', hint: 'Order: 4,6,8,12,16,20. Middle two: (8+12)/2=10' },
        { prompt: 'Ages: 11, 13, 10, 12, 14. What is the median?', answer: '12' },
        { prompt: 'Scores: 85, 90, 78, 92, 88, 95. What is the median?', answer: '89', hint: 'Order: 78,85,88,90,92,95. Middle: (88+90)/2=89' },
        { prompt: 'Data: 5, 5, 5, 100. What is the median?', answer: '5', hint: 'Order: 5,5,5,100. Middle two: (5+5)/2=5' },
        { prompt: 'Which is a better measure of center for 2, 3, 4, 5, 100: mean or median?', answer: 'median', hint: 'The outlier 100 pulls the mean up' },
      ],
    },
    'mode': {
      items: [
        { prompt: 'Find the mode of: 3, 5, 3, 7, 3, 8, 5', answer: '3', hint: '3 appears most often (3 times)' },
        { prompt: 'Find the mode of: red, blue, red, green, blue, red', answer: 'red' },
        { prompt: 'Shoe sizes: 6, 7, 6, 8, 7, 6, 9. What is the mode?', answer: '6' },
        { prompt: 'Data: 4, 4, 5, 5, 6, 6. How many modes are there?', answer: '3', hint: 'Each appears twice - three modes (4, 5, 6)' },
        { prompt: 'Scores: 88, 92, 75, 88, 95, 88. What is the mode?', answer: '88' },
      ],
    },
    'range': {
      items: [
        { prompt: 'Find the range of: 12, 5, 18, 3, 9', answer: '15', hint: '18 - 3 = 15' },
        { prompt: 'Temperatures: 65, 72, 58, 80, 71. What is the range?', answer: '22', hint: '80 - 58 = 22' },
        { prompt: 'Test scores: 88, 92, 75, 100, 84. What is the range?', answer: '25' },
        { prompt: 'Heights (in cm): 140, 152, 138, 160, 145. What is the range?', answer: '22' },
        { prompt: 'Data: 10, 10, 10, 10. What is the range?', answer: '0' },
      ],
    },
    'interquartile-range': {
      items: [
        { prompt: 'Data (ordered): 2, 4, 6, 8, 10, 12, 14. Q1=4, Q3=12. What is the IQR?', answer: '8', hint: 'IQR = Q3 - Q1 = 12 - 4' },
        { prompt: 'Data: 1, 3, 5, 7, 9, 11. Q1=3, Q3=9. What is the IQR?', answer: '6' },
        { prompt: 'Data: 10, 20, 30, 40, 50, 60, 70, 80. Q1=25, Q3=65. What is the IQR?', answer: '40' },
        { prompt: 'If Q1=15 and Q3=45, what is the IQR?', answer: '30' },
        { prompt: 'The IQR describes the spread of the middle ___% of data.', answer: '50' },
      ],
    },
    'histograms': {
      items: [
        { prompt: 'A histogram bar for 60-69 has height 5. What does this mean?', answer: '5 values are between 60 and 69', acceptedAnswers: ['5 values are between 60 and 69', '5 data points in that range', '5'] },
        { prompt: 'A histogram shows test scores: 50-59 (2), 60-69 (5), 70-79 (8), 80-89 (10), 90-100 (3). How many students?', answer: '28' },
        { prompt: 'In the same histogram, which range has the most students?', answer: '80-89' },
        { prompt: 'How is a histogram different from a bar graph?', answer: 'histograms show ranges of numerical data with no gaps', acceptedAnswers: ['ranges', 'numerical data', 'continuous data', 'no gaps'] },
        { prompt: 'A histogram shows: 0-9 (1), 10-19 (4), 20-29 (6), 30-39 (2). How many values are 20 or above?', answer: '8' },
      ],
    },
    'box-plots': {
      items: [
        { prompt: 'A box plot shows min=10, Q1=20, median=30, Q3=40, max=50. What is the range?', answer: '40' },
        { prompt: 'Same box plot: What is the IQR?', answer: '20', hint: 'Q3 - Q1 = 40 - 20' },
        { prompt: 'Same box plot: What is the median?', answer: '30' },
        { prompt: 'A box plot shows the middle 50% of data between Q1 and Q3. If Q1=25 and Q3=75, what is this range?', answer: '50' },
        { prompt: 'On a box plot, the line inside the box represents the ___.', answer: 'median' },
      ],
    },
    'dot-plots': {
      items: [
        { prompt: 'A dot plot shows: 1 (3 dots), 2 (5 dots), 3 (2 dots), 4 (4 dots). How many data points total?', answer: '14' },
        { prompt: 'Same dot plot: What is the mode?', answer: '2' },
        { prompt: 'A dot plot shows ages: 10 (2), 11 (4), 12 (6), 13 (3). What is the median age?', answer: '12', hint: '15 values total, 8th value is 12' },
        { prompt: 'What advantage does a dot plot have over a table?', answer: 'you can see the shape of the data', acceptedAnswers: ['shape', 'visual', 'see the distribution', 'see the shape'] },
        { prompt: 'A dot plot shows: 5 (1), 6 (2), 7 (4), 8 (2), 9 (1). Describe the shape.', answer: 'symmetric', acceptedAnswers: ['symmetric', 'bell shaped', 'normal'] },
      ],
    },
    'shape-of-distribution': {
      items: [
        { prompt: 'Data peaks in the middle and falls evenly on both sides. What is this shape called?', answer: 'symmetric' },
        { prompt: 'Data has a long tail to the right. Is this left-skewed or right-skewed?', answer: 'right-skewed', acceptedAnswers: ['right-skewed', 'right skewed', 'skewed right'] },
        { prompt: 'Most students scored high, but a few scored very low. Is this distribution skewed left or right?', answer: 'left', acceptedAnswers: ['left', 'left-skewed', 'skewed left'] },
        { prompt: 'A group of values far from the rest of the data is called a(n) ___.', answer: 'outlier' },
        { prompt: 'Two separate groups of data with a space between them is called a(n) ___.', answer: 'gap', acceptedAnswers: ['gap', 'cluster'] },
      ],
    },
    'outliers': {
      items: [
        { prompt: 'Data: 10, 12, 11, 13, 50. Which value is an outlier?', answer: '50' },
        { prompt: 'Adding an outlier of 200 to data with mean 20. Will the mean go up or down?', answer: 'up' },
        { prompt: 'Data: 80, 82, 85, 88, 15. Which measure of center is less affected by the outlier 15: mean or median?', answer: 'median' },
        { prompt: 'Temperatures: 70, 72, 68, 75, 71, 30. Is 30 likely an outlier?', answer: 'yes' },
        { prompt: 'Should you always remove outliers from data? (yes or no)', answer: 'no', hint: 'Outliers can be real and important data points' },
      ],
    },
    'likelihood': {
      items: [
        { prompt: 'You flip a fair coin. What is the probability of heads?', answer: '1/2', acceptedAnswers: ['1/2', '0.5', '50%'] },
        { prompt: 'A bag has 3 red and 7 blue marbles. What is the probability of drawing red?', answer: '3/10', acceptedAnswers: ['3/10', '0.3', '30%'] },
        { prompt: 'Rolling a standard die, what is the probability of rolling a 4?', answer: '1/6', acceptedAnswers: ['1/6'] },
        { prompt: 'Is it certain, likely, unlikely, or impossible to roll a 7 on a standard die?', answer: 'impossible' },
        { prompt: 'A spinner has 5 equal sections: 3 blue and 2 red. What is P(blue)?', answer: '3/5', acceptedAnswers: ['3/5', '0.6', '60%'] },
        { prompt: 'If probability = 0, the event is ___. If probability = 1, the event is ___.', answer: 'impossible, certain', acceptedAnswers: ['impossible, certain', 'impossible certain'] },
      ],
    },
    'experimental-vs-theoretical': {
      items: [
        { prompt: 'You flip a coin 100 times and get 53 heads. What is the experimental probability of heads?', answer: '53/100', acceptedAnswers: ['53/100', '0.53', '53%'] },
        { prompt: 'The theoretical probability of heads is 1/2. You got 53/100. Are these exactly equal?', answer: 'no' },
        { prompt: 'As you flip a coin more and more times, the experimental probability gets closer to the ___ probability.', answer: 'theoretical' },
        { prompt: 'You roll a die 60 times. Theoretically, about how many times should you get a 3?', answer: '10', hint: '60 x 1/6 = 10' },
        { prompt: 'You rolled a 3 exactly 12 times out of 60 rolls. What is the experimental probability?', answer: '12/60', acceptedAnswers: ['12/60', '1/5', '0.2', '20%'] },
      ],
    },
  },
};

const REAL_WORLD_CONTEXTS = {
  'kindergarten': [
    { title: 'Snack Sorting', context: 'Sort your snack items by size. Which is the biggest? Smallest? Line them up from smallest to biggest!' },
    { title: 'Block Tower', context: 'Build two towers with blocks. Which tower is taller? Which uses more blocks?' },
  ],
  'grade-1': [
    { title: 'Paper Clip Measuring', context: 'Use paper clips to measure things on your desk. How many paper clips long is your pencil? Your book?' },
    { title: 'Morning Routine', context: 'What time do you wake up? What time do you eat breakfast? Show these times on a clock.' },
  ],
  'grade-2': [
    { title: 'Coin Collection', context: 'You found coins in the couch: 2 quarters, 3 dimes, and 4 pennies. How much money did you find?' },
    { title: 'Class Pet Graph', context: 'Survey your family: what pet would they pick? Make a bar graph of the results!' },
  ],
  'grade-3': [
    { title: 'Recipe Math', context: 'A recipe needs 2 liters of water. You have a 500 mL measuring cup. How many times do you fill it?' },
    { title: 'Garden Perimeter', context: 'You want to fence a garden that is 6 m long and 4 m wide. How much fencing do you need?' },
  ],
  'grade-4': [
    { title: 'Road Trip Math', context: 'Your road trip is 240 miles. You have driven 3 hours at 60 miles per hour. How far have you gone? How far is left?' },
    { title: 'Pizza Party', context: 'You need 2 gallons of juice. The store sells quarts. How many quarts do you buy?' },
  ],
  'grade-5': [
    { title: 'Aquarium Volume', context: 'Your fish tank is 60 cm long, 30 cm wide, and 40 cm tall. How much water does it hold in cubic cm?' },
    { title: 'Metric Cooking', context: 'A recipe calls for 750 mL of broth. You have a 1.5 L container. How much is left after pouring?' },
  ],
  'grade-6': [
    { title: 'Sports Statistics', context: 'A basketball player scored: 12, 15, 8, 22, 18, 15, 14 points. Find the mean, median, mode, and range.' },
    { title: 'Fair Game?', context: 'You and a friend play a dice game. You win if you roll 1-4, they win on 5-6. Is this fair? What are the probabilities?' },
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

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 /.'$]/g, ''); }

// Exercise generation

function exResult(type, skill, grade, instruction, items) { return { type, skill, grade, count: items.length, instruction, items }; }

function generateExercise(grade, skill, count) {
  count = count || 5;
  const bank = PROBLEM_BANKS[grade] && PROBLEM_BANKS[grade][skill];
  if (!bank) return { error: 'No problem bank for ' + grade + '/' + skill };

  var items = bank.items;
  if (!items || !items.length) return { error: 'Empty problem bank for ' + grade + '/' + skill };

  var type = 'solve';
  if (skill.indexOf('compare-') === 0) type = 'comparison';
  else if (skill.indexOf('sort-') === 0 || skill.indexOf('classify-') === 0) type = 'classify';
  else if (skill.indexOf('measure-') === 0 && skill.indexOf('angle') < 0) type = 'measure';
  else if (skill.indexOf('conversion') >= 0 || skill.indexOf('metric-') >= 0 || skill.indexOf('customary-') >= 0) type = 'convert';
  else if (skill.indexOf('time-') === 0 || skill === 'elapsed-time' || skill === 'am-pm') type = 'time';
  else if (skill.indexOf('count-') === 0) type = 'money';
  else if (skill.indexOf('graph') >= 0 || skill.indexOf('plot') >= 0 || skill.indexOf('histogram') >= 0 || skill.indexOf('box-plot') >= 0 || skill.indexOf('dot-plot') >= 0) type = 'data-reading';
  else if (skill === 'mean' || skill === 'median' || skill === 'mode') type = 'calculate';
  else if (skill === 'range' || skill === 'interquartile-range') type = 'calculate';
  else if (skill.indexOf('angle') >= 0) type = 'angles';
  else if (skill.indexOf('area') >= 0 || skill.indexOf('perimeter') >= 0 || skill.indexOf('volume') >= 0 || skill.indexOf('cubic') >= 0) type = 'geometry';
  else if (skill.indexOf('probability') >= 0 || skill.indexOf('likelihood') >= 0 || skill.indexOf('experimental') >= 0) type = 'probability';
  else if (skill.indexOf('statistical') >= 0 || skill.indexOf('distribution') >= 0 || skill.indexOf('outlier') >= 0 || skill.indexOf('shape') >= 0) type = 'statistics';
  else if (skill.indexOf('estimate') >= 0) type = 'estimate';

  var instruction = getInstruction(type);
  var selected = pick(items, count).map(function(item) {
    var result = { prompt: item.prompt, answer: item.answer };
    if (item.choices) result.choices = item.choices;
    if (item.acceptedAnswers) result.acceptedAnswers = item.acceptedAnswers;
    if (item.hint) result.hint = item.hint;
    if (item.explanation) result.explanation = item.explanation;
    return result;
  });

  return exResult(type, skill, grade, instruction, selected);
}

function getInstruction(type) {
  var instructions = {
    'comparison': 'Compare the two items. Which one is more?',
    'classify': 'Sort or classify the items as described.',
    'measure': 'Use the given information to find the measurement.',
    'convert': 'Convert between units. Show your work!',
    'time': 'Solve the time problem.',
    'money': 'Count the money carefully. Start with the largest value!',
    'data-reading': 'Read the data display and answer the question.',
    'calculate': 'Calculate the answer. Show your work!',
    'angles': 'Solve the angle problem.',
    'geometry': 'Use the formula or count to find the answer.',
    'probability': 'Think about the chances. Express as a fraction if you can.',
    'statistics': 'Analyze the data and answer the question.',
    'estimate': 'Use what you know about real objects to estimate.',
    'solve': 'Solve the problem. Show your thinking!',
  };
  return instructions[type] || instructions['solve'];
}

// Answer checking

function checkAnswer(type, expected, answer) {
  var a = norm(answer);
  if (typeof expected === 'string') {
    if (norm(expected) === a) return true;
  }
  if (Array.isArray(expected)) {
    return expected.some(function(e) { return norm(e) === a; });
  }
  return norm(String(expected)) === a;
}

// Public API

class MeasurementData {
  getProfile(id) {
    var p = loadProfile(id);
    return { studentId: p.studentId, grade: p.grade, createdAt: p.createdAt, totalAssessments: p.assessments.length };
  }

  setGrade(id, grade) {
    if (!SKILLS[grade]) throw new Error('Unknown grade: ' + grade + '. Valid: ' + Object.keys(SKILLS).join(', '));
    var p = loadProfile(id); p.grade = grade; saveProfile(p);
    return { studentId: id, grade: grade };
  }

  recordAssessment(id, grade, category, skill, score, total, notes) {
    notes = notes || '';
    if (!SKILLS[grade]) throw new Error('Unknown grade: ' + grade);
    if (!SKILLS[grade][category]) throw new Error("Unknown category '" + category + "' for " + grade);
    if (!SKILLS[grade][category].includes(skill)) throw new Error("Unknown skill '" + skill + "' in " + grade + '/' + category);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error('score must be 0-' + total);

    var p = loadProfile(id);
    if (!p.grade) p.grade = grade;
    var entry = { date: new Date().toISOString(), grade: grade, category: category, skill: skill, score: score, total: total, notes: notes };
    p.assessments.push(entry);
    var key = grade + '/' + category + '/' + skill;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score: score, total: total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p);
    return { studentId: id, skill: key, score: score + '/' + total, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  getProgress(id) {
    var p = loadProfile(id);
    var grade = p.grade || 'kindergarten';
    var gs = SKILLS[grade] || {};
    var results = {};
    var mastered = 0, total = 0;
    for (var cat of Object.keys(gs)) {
      results[cat] = {};
      for (var sk of gs[cat]) {
        total++;
        var d = p.skills[grade + '/' + cat + '/' + sk];
        results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
      }
    }
    return { studentId: id, grade: grade, mastered: mastered, total: total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count) {
    count = count || 5;
    var p = loadProfile(id);
    var grade = p.grade || 'kindergarten';
    var candidates = [];
    for (var cat of Object.keys(SKILLS[grade] || {})) {
      for (var sk of (SKILLS[grade][cat] || [])) {
        var d = p.skills[grade + '/' + cat + '/' + sk];
        var m = d ? d.mastery : 0;
        if (m < MASTERY_THRESHOLD) candidates.push({ grade: grade, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' });
      }
    }
    var order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort(function(a, b) { return ((order[a.label] != null ? order[a.label] : 3) - (order[b.label] != null ? order[b.label] : 3)) || (b.mastery - a.mastery); });
    return { studentId: id, grade: grade, next: candidates.slice(0, count) };
  }

  getReport(id) {
    var p = loadProfile(id);
    return { studentId: id, grade: p.grade, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() };
  }

  listStudents() {
    ensureDataDir();
    var files = fs.readdirSync(DATA_DIR).filter(function(f) { return f.endsWith('.json'); });
    return { count: files.length, students: files.map(function(f) { return f.replace(/\.json$/, ''); }) };
  }

  getSkillCatalog(grade) {
    var gs = SKILLS[grade];
    if (!gs) return { grade: grade, error: 'Unknown grade. Valid: ' + Object.keys(SKILLS).join(', ') };
    var total = 0;
    var catalog = {};
    for (var cat of Object.keys(gs)) { total += gs[cat].length; catalog[cat] = gs[cat].slice(); }
    return { grade: grade, skills: catalog, totalSkills: total };
  }

  generateExercise(grade, skill, count) { return generateExercise(grade, skill, count); }

  checkAnswer(type, expected, answer) {
    var exp = expected;
    if (typeof expected === 'object' && !Array.isArray(expected) && expected && expected.acceptedAnswers) {
      exp = expected.acceptedAnswers;
    }
    return { correct: checkAnswer(type, exp, answer), expected: expected, studentAnswer: answer };
  }

  getRealWorldContext(grade) {
    var contexts = REAL_WORLD_CONTEXTS[grade];
    if (!contexts) return { error: 'No real-world contexts for ' + grade + '. Available: ' + Object.keys(REAL_WORLD_CONTEXTS).join(', ') };
    return pick(contexts, 1)[0];
  }

  generateLesson(id) {
    var p = loadProfile(id);
    var grade = p.grade || 'kindergarten';
    var target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: 'All skills at ' + grade + ' level are proficient! Ready for next grade.', grade: grade };
    var exercise = generateExercise(grade, target.skill, 5);
    var context = REAL_WORLD_CONTEXTS[grade] ? pick(REAL_WORLD_CONTEXTS[grade], 1)[0] : null;
    return {
      studentId: id, grade: grade, targetSkill: target, exercise: exercise, realWorldContext: context,
      lessonPlan: {
        warmUp: 'Quick estimation or review of previous skill (2-3 min)',
        teach: 'Introduce/reinforce: ' + target.category + ' > ' + target.skill,
        practice: 'Complete ' + (exercise.count || 0) + ' practice items',
        apply: context ? 'Real-world connection: "' + context.title + '"' : 'Apply skill to a real-world scenario',
        reflect: 'Where do you see this in real life?',
      },
    };
  }
}

module.exports = MeasurementData;

// CLI: node measurement-data.js <command> [args]
if (require.main === module) {
  var args = process.argv.slice(2);
  var cmd = args[0];
  var md = new MeasurementData();
  var out = function(d) { console.log(JSON.stringify(d, null, 2)); };

  try {
    switch (cmd) {
      case 'start': {
        var id = args[1], grade = args[2];
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) md.setGrade(id, grade);
        out({ action: 'start', profile: md.getProfile(id), nextSkills: md.getNextSkills(id) });
        break;
      }
      case 'lesson': { var id = args[1]; if (!id) throw new Error('Usage: lesson <id>'); out(md.generateLesson(id)); break; }
      case 'exercise': {
        var id = args[1], skill = args[2];
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        var grade = loadProfile(id).grade || 'kindergarten';
        if (skill) { out(md.generateExercise(grade, skill, 5)); }
        else { var n = md.getNextSkills(id, 1).next; out(n.length ? md.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current grade!' }); }
        break;
      }
      case 'check': {
        var type = args[2], expected = args[3], answer = args[4];
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        var exp = expected; try { exp = JSON.parse(expected); } catch(e) {}
        out(md.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        var id = args[1], grade = args[2], cat = args[3], skill = args[4], sc = args[5], tot = args[6];
        var notes = args.slice(7).join(' ');
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(md.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes));
        break;
      }
      case 'progress': { var id = args[1]; if (!id) throw new Error('Usage: progress <id>'); out(md.getProgress(id)); break; }
      case 'report': { var id = args[1]; if (!id) throw new Error('Usage: report <id>'); out(md.getReport(id)); break; }
      case 'next': { var id = args[1], n = args[2]; if (!id) throw new Error('Usage: next <id> [count]'); out(md.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { var g = args[1]; out(g ? md.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(md.listStudents()); break; }
      case 'set-grade': { var id = args[1], g = args[2]; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(md.setGrade(id, g)); break; }
      default: out({ usage: 'node measurement-data.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
