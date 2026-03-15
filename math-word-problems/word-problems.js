// eClaw Math Word Problems Interactive Coach (K-6). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'math-word-problems');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'join': ['join-result-unknown', 'join-change-unknown'],
    'separate': ['separate-result-unknown', 'separate-change-unknown'],
    'part-part-whole': ['whole-unknown'],
    'compare': ['compare-difference'],
  },
  'grade-1': {
    'join': ['join-result-unknown-20', 'join-change-unknown-20', 'join-start-unknown'],
    'separate': ['separate-result-unknown-20', 'separate-change-unknown-20'],
    'part-part-whole': ['whole-unknown-20', 'part-unknown'],
    'compare': ['compare-difference-20', 'compare-larger-unknown'],
  },
  'grade-2': {
    'add-sub-two-digit': ['add-two-digit', 'sub-two-digit'],
    'equal-groups-intro': ['equal-groups-product', 'equal-groups-sharing'],
    'two-step-intro': ['two-step-add-sub'],
    'compare-two-digit': ['compare-two-digit-difference'],
  },
  'grade-3': {
    'multiplication': ['equal-groups-multiply', 'array-problems', 'multiplicative-compare'],
    'division': ['equal-sharing', 'equal-grouping', 'division-with-remainder'],
    'two-step-mixed': ['two-step-add-multiply', 'two-step-sub-multiply'],
    'fractions-intro': ['fraction-of-set'],
  },
  'grade-4': {
    'multi-step': ['multi-step-add-sub', 'multi-step-multiply-divide', 'multi-step-mixed'],
    'multiplicative-comparison': ['times-as-many', 'times-as-many-unknown-multiplier'],
    'fractions': ['fraction-add-sub', 'fraction-of-whole-number'],
    'measurement': ['elapsed-time', 'perimeter-area'],
  },
  'grade-5': {
    'fraction-operations': ['fraction-add-unlike', 'fraction-multiply', 'fraction-word-problems'],
    'decimal-problems': ['decimal-add-sub', 'decimal-multiply'],
    'volume': ['volume-word-problems'],
    'multi-step-advanced': ['multi-step-fractions', 'multi-step-decimals'],
  },
  'grade-6': {
    'ratios': ['ratio-problems', 'unit-rate', 'equivalent-ratios'],
    'percentages': ['percent-of-number', 'percent-discount', 'percent-change'],
    'rates': ['rate-problems', 'speed-distance-time'],
    'complex-multi-step': ['multi-step-ratio', 'multi-step-percent'],
  },
};

const PROBLEM_BANKS = {
  'kindergarten': {
    'join-result-unknown': {
      problems: [
        { story: 'You have 3 toy cars. Your friend gives you 2 more toy cars. How many toy cars do you have now?', answer: 5, equation: '3 + 2 = 5', sentence: 'You have 5 toy cars now.' },
        { story: 'There are 4 birds in a tree. 3 more birds fly to the tree. How many birds are in the tree now?', answer: 7, equation: '4 + 3 = 7', sentence: 'There are 7 birds in the tree.' },
        { story: 'Sam has 2 apples. Mom gives him 5 more apples. How many apples does Sam have now?', answer: 7, equation: '2 + 5 = 7', sentence: 'Sam has 7 apples now.' },
        { story: 'There are 6 ducks in the pond. 2 more ducks come. How many ducks are in the pond?', answer: 8, equation: '6 + 2 = 8', sentence: 'There are 8 ducks in the pond.' },
        { story: 'Mia has 1 cookie. Dad gives her 4 more cookies. How many cookies does Mia have?', answer: 5, equation: '1 + 4 = 5', sentence: 'Mia has 5 cookies.' },
        { story: 'There are 5 red balls and 3 blue balls in a box. How many balls are in the box?', answer: 8, equation: '5 + 3 = 8', sentence: 'There are 8 balls in the box.' },
        { story: 'You see 4 cats. Then you see 4 more cats. How many cats do you see?', answer: 8, equation: '4 + 4 = 8', sentence: 'You see 8 cats.' },
        { story: 'Lily picks 3 flowers. Then she picks 6 more flowers. How many flowers does Lily have?', answer: 9, equation: '3 + 6 = 9', sentence: 'Lily has 9 flowers.' },
      ],
    },
    'join-change-unknown': {
      problems: [
        { story: 'You have 3 stickers. Your friend gives you some more. Now you have 7 stickers. How many stickers did your friend give you?', answer: 4, equation: '3 + ? = 7', sentence: 'Your friend gave you 4 stickers.' },
        { story: 'Sam has 2 crayons. He gets some more. Now he has 6 crayons. How many crayons did he get?', answer: 4, equation: '2 + ? = 6', sentence: 'Sam got 4 crayons.' },
        { story: 'There are 4 fish in a tank. Some more fish are added. Now there are 9 fish. How many fish were added?', answer: 5, equation: '4 + ? = 9', sentence: '5 fish were added.' },
        { story: 'Mia has 5 blocks. She gets more blocks. Now she has 8 blocks. How many blocks did she get?', answer: 3, equation: '5 + ? = 8', sentence: 'Mia got 3 blocks.' },
        { story: 'You have 1 book. You get some more books. Now you have 6 books. How many books did you get?', answer: 5, equation: '1 + ? = 6', sentence: 'You got 5 books.' },
        { story: 'There are 3 dogs in the yard. More dogs come. Now there are 8 dogs. How many dogs came?', answer: 5, equation: '3 + ? = 8', sentence: '5 dogs came to the yard.' },
      ],
    },
    'separate-result-unknown': {
      problems: [
        { story: 'You have 7 grapes. You eat 3 grapes. How many grapes do you have left?', answer: 4, equation: '7 - 3 = 4', sentence: 'You have 4 grapes left.' },
        { story: 'There are 8 butterflies. 5 fly away. How many butterflies are left?', answer: 3, equation: '8 - 5 = 3', sentence: 'There are 3 butterflies left.' },
        { story: 'Sam has 9 balloons. 4 balloons pop. How many balloons does Sam have?', answer: 5, equation: '9 - 4 = 5', sentence: 'Sam has 5 balloons.' },
        { story: 'There are 6 cupcakes on a plate. You eat 2. How many cupcakes are left?', answer: 4, equation: '6 - 2 = 4', sentence: 'There are 4 cupcakes left.' },
        { story: 'Mia has 10 beads. She gives 3 to her friend. How many beads does Mia have?', answer: 7, equation: '10 - 3 = 7', sentence: 'Mia has 7 beads.' },
        { story: 'There are 5 frogs on a log. 2 frogs jump off. How many frogs are on the log?', answer: 3, equation: '5 - 2 = 3', sentence: 'There are 3 frogs on the log.' },
      ],
    },
    'separate-change-unknown': {
      problems: [
        { story: 'You have 8 crackers. You eat some. Now you have 5 crackers. How many crackers did you eat?', answer: 3, equation: '8 - ? = 5', sentence: 'You ate 3 crackers.' },
        { story: 'There are 9 birds on a wire. Some fly away. Now there are 4 birds. How many flew away?', answer: 5, equation: '9 - ? = 4', sentence: '5 birds flew away.' },
        { story: 'Sam has 7 toy trucks. He loses some. Now he has 3 trucks. How many did he lose?', answer: 4, equation: '7 - ? = 3', sentence: 'Sam lost 4 toy trucks.' },
        { story: 'Lily had 10 stickers. She gave some away. Now she has 6. How many did she give away?', answer: 4, equation: '10 - ? = 6', sentence: 'Lily gave away 4 stickers.' },
        { story: 'There were 6 cookies on the tray. Some were eaten. Now there are 2. How many were eaten?', answer: 4, equation: '6 - ? = 2', sentence: '4 cookies were eaten.' },
      ],
    },
    'whole-unknown': {
      problems: [
        { story: 'There are 4 red apples and 3 green apples on the table. How many apples are on the table?', answer: 7, equation: '4 + 3 = 7', sentence: 'There are 7 apples on the table.' },
        { story: 'Sam has 5 big marbles and 2 small marbles. How many marbles does Sam have?', answer: 7, equation: '5 + 2 = 7', sentence: 'Sam has 7 marbles.' },
        { story: 'In the park there are 3 boys and 6 girls. How many children are in the park?', answer: 9, equation: '3 + 6 = 9', sentence: 'There are 9 children in the park.' },
        { story: 'Mia has 4 dolls and 5 stuffed animals. How many toys does she have?', answer: 9, equation: '4 + 5 = 9', sentence: 'Mia has 9 toys.' },
        { story: 'On the shelf there are 2 tall books and 6 short books. How many books are on the shelf?', answer: 8, equation: '2 + 6 = 8', sentence: 'There are 8 books on the shelf.' },
      ],
    },
    'compare-difference': {
      problems: [
        { story: 'Anna has 7 crayons. Ben has 4 crayons. How many more crayons does Anna have than Ben?', answer: 3, equation: '7 - 4 = 3', sentence: 'Anna has 3 more crayons than Ben.' },
        { story: 'There are 8 cats and 5 dogs at the pet store. How many more cats are there than dogs?', answer: 3, equation: '8 - 5 = 3', sentence: 'There are 3 more cats than dogs.' },
        { story: 'Sam read 9 books. Mia read 6 books. How many more books did Sam read than Mia?', answer: 3, equation: '9 - 6 = 3', sentence: 'Sam read 3 more books than Mia.' },
        { story: 'The blue team has 5 points. The red team has 8 points. How many fewer points does the blue team have?', answer: 3, equation: '8 - 5 = 3', sentence: 'The blue team has 3 fewer points.' },
        { story: 'Lily has 10 stickers. Jake has 7 stickers. How many more stickers does Lily have?', answer: 3, equation: '10 - 7 = 3', sentence: 'Lily has 3 more stickers than Jake.' },
      ],
    },
  },
  'grade-1': {
    'join-result-unknown-20': {
      problems: [
        { story: 'There are 8 children on the playground. 7 more children come out to play. How many children are on the playground now?', answer: 15, equation: '8 + 7 = 15', sentence: 'There are 15 children on the playground.' },
        { story: 'Sam has 9 baseball cards. He buys 6 more. How many baseball cards does Sam have now?', answer: 15, equation: '9 + 6 = 15', sentence: 'Sam has 15 baseball cards.' },
        { story: 'A hen laid 7 eggs on Monday and 8 eggs on Tuesday. How many eggs did she lay in all?', answer: 15, equation: '7 + 8 = 15', sentence: 'The hen laid 15 eggs in all.' },
        { story: 'Mia picked 11 flowers. Then she picked 5 more. How many flowers does Mia have?', answer: 16, equation: '11 + 5 = 16', sentence: 'Mia has 16 flowers.' },
        { story: 'There are 6 red fish and 9 blue fish in the tank. How many fish are in the tank?', answer: 15, equation: '6 + 9 = 15', sentence: 'There are 15 fish in the tank.' },
        { story: 'Jake scored 8 points in the first half and 12 points in the second half. How many points did he score?', answer: 20, equation: '8 + 12 = 20', sentence: 'Jake scored 20 points.' },
      ],
    },
    'join-change-unknown-20': {
      problems: [
        { story: 'Emma has 8 beads. She gets some more beads. Now she has 14 beads. How many beads did she get?', answer: 6, equation: '8 + ? = 14', sentence: 'Emma got 6 beads.' },
        { story: 'There are 9 cars in the parking lot. More cars arrive. Now there are 17 cars. How many cars arrived?', answer: 8, equation: '9 + ? = 17', sentence: '8 cars arrived.' },
        { story: 'Sam has 7 pennies. He finds some more. Now he has 15 pennies. How many did he find?', answer: 8, equation: '7 + ? = 15', sentence: 'Sam found 8 pennies.' },
        { story: 'A bus had 11 passengers. More people got on. Now there are 19 passengers. How many people got on?', answer: 8, equation: '11 + ? = 19', sentence: '8 people got on the bus.' },
        { story: 'Lily read 6 pages before lunch. She read more after lunch. She read 18 pages total. How many pages did she read after lunch?', answer: 12, equation: '6 + ? = 18', sentence: 'Lily read 12 pages after lunch.' },
      ],
    },
    'join-start-unknown': {
      problems: [
        { story: 'Sam had some marbles. His friend gave him 5 more. Now he has 12 marbles. How many did Sam start with?', answer: 7, equation: '? + 5 = 12', sentence: 'Sam started with 7 marbles.' },
        { story: 'A girl had some stickers. She got 8 more stickers. Now she has 15. How many did she start with?', answer: 7, equation: '? + 8 = 15', sentence: 'She started with 7 stickers.' },
        { story: 'There were some birds in a tree. 6 more landed. Now there are 13 birds. How many were there at first?', answer: 7, equation: '? + 6 = 13', sentence: 'There were 7 birds at first.' },
        { story: 'Jake had some coins. He earned 9 more. Now he has 16 coins. How many did he start with?', answer: 7, equation: '? + 9 = 16', sentence: 'Jake started with 7 coins.' },
        { story: 'Some children were playing. 4 more came. Now there are 11 children. How many were playing at first?', answer: 7, equation: '? + 4 = 11', sentence: '7 children were playing at first.' },
      ],
    },
    'separate-result-unknown-20': {
      problems: [
        { story: 'There are 16 birds on a fence. 9 fly away. How many birds are left on the fence?', answer: 7, equation: '16 - 9 = 7', sentence: 'There are 7 birds left on the fence.' },
        { story: 'Sam has 14 grapes. He eats 6. How many grapes does Sam have left?', answer: 8, equation: '14 - 6 = 8', sentence: 'Sam has 8 grapes left.' },
        { story: 'There were 18 balloons at the party. 7 popped. How many balloons are left?', answer: 11, equation: '18 - 7 = 11', sentence: 'There are 11 balloons left.' },
        { story: 'Emma had 15 crayons. She gave 8 to her sister. How many crayons does Emma have now?', answer: 7, equation: '15 - 8 = 7', sentence: 'Emma has 7 crayons now.' },
        { story: 'A farmer had 20 eggs. 12 hatched into chicks. How many eggs are left?', answer: 8, equation: '20 - 12 = 8', sentence: 'There are 8 eggs left.' },
      ],
    },
    'separate-change-unknown-20': {
      problems: [
        { story: 'Mia had 15 stickers. She gave some to her friend. Now she has 9. How many did she give away?', answer: 6, equation: '15 - ? = 9', sentence: 'Mia gave away 6 stickers.' },
        { story: 'There were 18 cookies. Some were eaten. Now there are 11. How many were eaten?', answer: 7, equation: '18 - ? = 11', sentence: '7 cookies were eaten.' },
        { story: 'Sam had 13 toy cars. He lost some. Now he has 5. How many did he lose?', answer: 8, equation: '13 - ? = 5', sentence: 'Sam lost 8 toy cars.' },
        { story: 'A shelf had 20 books. Some fell off. Now there are 14 books. How many fell off?', answer: 6, equation: '20 - ? = 14', sentence: '6 books fell off the shelf.' },
        { story: 'Jake had 17 raisins. He ate some. Now he has 9. How many did he eat?', answer: 8, equation: '17 - ? = 9', sentence: 'Jake ate 8 raisins.' },
      ],
    },
    'whole-unknown-20': {
      problems: [
        { story: 'There are 9 boys and 8 girls in a class. How many children are in the class?', answer: 17, equation: '9 + 8 = 17', sentence: 'There are 17 children in the class.' },
        { story: 'Sam has 7 red pens and 6 blue pens. How many pens does Sam have?', answer: 13, equation: '7 + 6 = 13', sentence: 'Sam has 13 pens.' },
        { story: 'A bag has 11 big buttons and 8 small buttons. How many buttons are in the bag?', answer: 19, equation: '11 + 8 = 19', sentence: 'There are 19 buttons in the bag.' },
        { story: 'On a farm there are 12 brown cows and 7 white cows. How many cows are on the farm?', answer: 19, equation: '12 + 7 = 19', sentence: 'There are 19 cows on the farm.' },
        { story: 'Mia found 8 seashells in the morning and 9 in the afternoon. How many seashells did she find?', answer: 17, equation: '8 + 9 = 17', sentence: 'Mia found 17 seashells.' },
      ],
    },
    'part-unknown': {
      problems: [
        { story: 'There are 15 animals at the zoo. 8 are monkeys and the rest are lions. How many are lions?', answer: 7, equation: '15 - 8 = 7', sentence: 'There are 7 lions.' },
        { story: 'Sam has 13 marbles. 5 are blue. The rest are green. How many are green?', answer: 8, equation: '13 - 5 = 8', sentence: 'There are 8 green marbles.' },
        { story: 'A class has 18 students. 10 are girls. How many are boys?', answer: 8, equation: '18 - 10 = 8', sentence: 'There are 8 boys.' },
        { story: 'Mia has 16 beads. 9 are round. The rest are square. How many are square?', answer: 7, equation: '16 - 9 = 7', sentence: 'There are 7 square beads.' },
        { story: 'There are 14 fruit in a bowl. 6 are apples. The rest are oranges. How many are oranges?', answer: 8, equation: '14 - 6 = 8', sentence: 'There are 8 oranges.' },
      ],
    },
    'compare-difference-20': {
      problems: [
        { story: 'Sam has 15 stickers. Emma has 9 stickers. How many more stickers does Sam have than Emma?', answer: 6, equation: '15 - 9 = 6', sentence: 'Sam has 6 more stickers than Emma.' },
        { story: 'The blue jar has 18 candies. The red jar has 11 candies. How many more candies are in the blue jar?', answer: 7, equation: '18 - 11 = 7', sentence: 'The blue jar has 7 more candies.' },
        { story: 'Anna read 14 pages. Ben read 8 pages. How many more pages did Anna read?', answer: 6, equation: '14 - 8 = 6', sentence: 'Anna read 6 more pages than Ben.' },
        { story: 'Team A scored 17 points. Team B scored 12 points. How many fewer points did Team B score?', answer: 5, equation: '17 - 12 = 5', sentence: 'Team B scored 5 fewer points.' },
        { story: 'Mia is 16 inches tall. Her plant is 9 inches tall. How much taller is Mia than her plant?', answer: 7, equation: '16 - 9 = 7', sentence: 'Mia is 7 inches taller than her plant.' },
      ],
    },
    'compare-larger-unknown': {
      problems: [
        { story: 'Emma has 8 stickers. Sam has 5 more stickers than Emma. How many stickers does Sam have?', answer: 13, equation: '8 + 5 = 13', sentence: 'Sam has 13 stickers.' },
        { story: 'Ben is 9 years old. His dad is 25 years older. How old is his dad?', answer: 34, equation: '9 + 25 = 34', sentence: 'His dad is 34 years old.' },
        { story: 'A red ribbon is 7 inches long. A blue ribbon is 6 inches longer. How long is the blue ribbon?', answer: 13, equation: '7 + 6 = 13', sentence: 'The blue ribbon is 13 inches long.' },
        { story: 'Lily scored 11 points. Jake scored 8 more points than Lily. How many points did Jake score?', answer: 19, equation: '11 + 8 = 19', sentence: 'Jake scored 19 points.' },
        { story: 'A cat weighs 6 pounds. A dog weighs 9 pounds more than the cat. How much does the dog weigh?', answer: 15, equation: '6 + 9 = 15', sentence: 'The dog weighs 15 pounds.' },
      ],
    },
  },
  'grade-2': {
    'add-two-digit': {
      problems: [
        { story: 'A school has 34 second graders and 28 third graders. How many students is that in all?', answer: 62, equation: '34 + 28 = 62', sentence: 'There are 62 students in all.' },
        { story: 'Sam collected 45 leaves. Mia collected 37 leaves. How many leaves did they collect together?', answer: 82, equation: '45 + 37 = 82', sentence: 'They collected 82 leaves together.' },
        { story: 'A store sold 56 apples on Monday and 38 apples on Tuesday. How many apples were sold?', answer: 94, equation: '56 + 38 = 94', sentence: 'The store sold 94 apples.' },
        { story: 'There are 29 red balloons and 43 blue balloons at the fair. How many balloons are there?', answer: 72, equation: '29 + 43 = 72', sentence: 'There are 72 balloons at the fair.' },
        { story: 'Emma read 47 pages last week and 35 pages this week. How many pages did she read?', answer: 82, equation: '47 + 35 = 82', sentence: 'Emma read 82 pages.' },
      ],
    },
    'sub-two-digit': {
      problems: [
        { story: 'There were 73 books on the shelf. The children checked out 28 books. How many books are left?', answer: 45, equation: '73 - 28 = 45', sentence: 'There are 45 books left on the shelf.' },
        { story: 'A farmer had 85 eggs. He sold 47. How many eggs does the farmer have now?', answer: 38, equation: '85 - 47 = 38', sentence: 'The farmer has 38 eggs now.' },
        { story: 'Sam had 62 cents. He spent 35 cents on a pencil. How much money does he have left?', answer: 27, equation: '62 - 35 = 27', sentence: 'Sam has 27 cents left.' },
        { story: 'There are 91 children at the school picnic. 54 go home. How many are still at the picnic?', answer: 37, equation: '91 - 54 = 37', sentence: 'There are 37 children still at the picnic.' },
        { story: 'A bus has 50 seats. 23 seats are taken. How many seats are empty?', answer: 27, equation: '50 - 23 = 27', sentence: 'There are 27 empty seats.' },
      ],
    },
    'equal-groups-product': {
      problems: [
        { story: 'There are 4 tables in the lunchroom. Each table has 5 chairs. How many chairs are there?', answer: 20, equation: '4 x 5 = 20', sentence: 'There are 20 chairs.' },
        { story: 'Sam has 3 bags of marbles. Each bag has 6 marbles. How many marbles does Sam have?', answer: 18, equation: '3 x 6 = 18', sentence: 'Sam has 18 marbles.' },
        { story: 'There are 5 rows of flowers. Each row has 4 flowers. How many flowers are there?', answer: 20, equation: '5 x 4 = 20', sentence: 'There are 20 flowers.' },
        { story: 'A baker made 3 trays of cookies. Each tray has 8 cookies. How many cookies did he make?', answer: 24, equation: '3 x 8 = 24', sentence: 'The baker made 24 cookies.' },
        { story: 'There are 2 fish tanks. Each tank has 9 fish. How many fish are there?', answer: 18, equation: '2 x 9 = 18', sentence: 'There are 18 fish.' },
      ],
    },
    'equal-groups-sharing': {
      problems: [
        { story: '12 cookies are shared equally among 3 friends. How many cookies does each friend get?', answer: 4, equation: '12 / 3 = 4', sentence: 'Each friend gets 4 cookies.' },
        { story: 'Sam has 15 stickers to share equally among 5 friends. How many stickers does each friend get?', answer: 3, equation: '15 / 5 = 3', sentence: 'Each friend gets 3 stickers.' },
        { story: '18 pencils are put equally into 3 boxes. How many pencils are in each box?', answer: 6, equation: '18 / 3 = 6', sentence: 'There are 6 pencils in each box.' },
        { story: '20 apples are shared equally into 4 baskets. How many apples are in each basket?', answer: 5, equation: '20 / 4 = 5', sentence: 'There are 5 apples in each basket.' },
        { story: '16 children split into 4 equal teams. How many children are on each team?', answer: 4, equation: '16 / 4 = 4', sentence: 'There are 4 children on each team.' },
      ],
    },
    'two-step-add-sub': {
      problems: [
        { story: 'Sam had 25 baseball cards. He bought 12 more. Then he gave 8 to his friend. How many cards does Sam have now?', answer: 29, equation: '25 + 12 - 8 = 29', sentence: 'Sam has 29 baseball cards now.' },
        { story: 'A bus had 32 passengers. At the first stop, 8 got off and 5 got on. How many passengers are on the bus now?', answer: 29, equation: '32 - 8 + 5 = 29', sentence: 'There are 29 passengers on the bus.' },
        { story: 'Mia had 40 beads. She used 15 for a bracelet and 12 for a necklace. How many beads does she have left?', answer: 13, equation: '40 - 15 - 12 = 13', sentence: 'Mia has 13 beads left.' },
        { story: 'A store had 50 apples. They sold 23 in the morning and got 18 more delivered. How many apples do they have now?', answer: 45, equation: '50 - 23 + 18 = 45', sentence: 'The store has 45 apples now.' },
        { story: 'Emma earned 30 points. She lost 7 points, then earned 15 more. How many points does Emma have?', answer: 38, equation: '30 - 7 + 15 = 38', sentence: 'Emma has 38 points.' },
      ],
    },
    'compare-two-digit-difference': {
      problems: [
        { story: 'The library has 64 picture books and 38 chapter books. How many more picture books are there?', answer: 26, equation: '64 - 38 = 26', sentence: 'There are 26 more picture books.' },
        { story: 'Sam ran 52 meters. Emma ran 75 meters. How much farther did Emma run?', answer: 23, equation: '75 - 52 = 23', sentence: 'Emma ran 23 meters farther.' },
        { story: 'Team A scored 81 points. Team B scored 67 points. How many more points did Team A score?', answer: 14, equation: '81 - 67 = 14', sentence: 'Team A scored 14 more points.' },
        { story: 'A sunflower is 93 cm tall. A rose is 58 cm tall. How much taller is the sunflower?', answer: 35, equation: '93 - 58 = 35', sentence: 'The sunflower is 35 cm taller.' },
        { story: 'Mia collected 46 shells. Jake collected 72 shells. How many fewer shells did Mia collect?', answer: 26, equation: '72 - 46 = 26', sentence: 'Mia collected 26 fewer shells.' },
      ],
    },
  },
  'grade-3': {
    'equal-groups-multiply': {
      problems: [
        { story: 'There are 6 teams in a soccer league. Each team has 8 players. How many players are in the league?', answer: 48, equation: '6 x 8 = 48', sentence: 'There are 48 players in the league.' },
        { story: 'A baker puts 7 muffins in each box. She fills 9 boxes. How many muffins is that?', answer: 63, equation: '7 x 9 = 63', sentence: 'That is 63 muffins.' },
        { story: 'Sam reads 5 pages every night. How many pages does he read in 7 nights?', answer: 35, equation: '5 x 7 = 35', sentence: 'Sam reads 35 pages in 7 nights.' },
        { story: 'There are 4 shelves. Each shelf holds 9 books. How many books can the shelves hold?', answer: 36, equation: '4 x 9 = 36', sentence: 'The shelves can hold 36 books.' },
        { story: 'A pack of juice boxes has 8 boxes. Mom buys 6 packs. How many juice boxes is that?', answer: 48, equation: '8 x 6 = 48', sentence: 'That is 48 juice boxes.' },
      ],
    },
    'array-problems': {
      problems: [
        { story: 'A garden has 5 rows with 7 tomato plants in each row. How many tomato plants are there?', answer: 35, equation: '5 x 7 = 35', sentence: 'There are 35 tomato plants.' },
        { story: 'Chairs in the auditorium are arranged in 8 rows of 9. How many chairs are there?', answer: 72, equation: '8 x 9 = 72', sentence: 'There are 72 chairs.' },
        { story: 'A parking lot has 6 rows with 8 cars in each row. How many cars are in the lot?', answer: 48, equation: '6 x 8 = 48', sentence: 'There are 48 cars in the lot.' },
        { story: 'A tile floor has 9 rows with 9 tiles in each row. How many tiles are there?', answer: 81, equation: '9 x 9 = 81', sentence: 'There are 81 tiles.' },
        { story: 'Desks in a classroom are in 4 rows with 7 desks in each row. How many desks are there?', answer: 28, equation: '4 x 7 = 28', sentence: 'There are 28 desks.' },
      ],
    },
    'multiplicative-compare': {
      problems: [
        { story: 'Sam has 4 toy cars. His brother has 3 times as many. How many toy cars does his brother have?', answer: 12, equation: '3 x 4 = 12', sentence: 'His brother has 12 toy cars.' },
        { story: 'A kitten weighs 3 pounds. A dog weighs 5 times as much. How much does the dog weigh?', answer: 15, equation: '5 x 3 = 15', sentence: 'The dog weighs 15 pounds.' },
        { story: 'Emma saved $8. Her mom saved 4 times as much. How much did her mom save?', answer: 32, equation: '4 x 8 = 32', sentence: 'Her mom saved $32.' },
        { story: 'A pencil costs 6 cents. A marker costs 7 times as much. How much does the marker cost?', answer: 42, equation: '7 x 6 = 42', sentence: 'The marker costs 42 cents.' },
        { story: 'Mia ran 9 laps. Jake ran 2 times as many. How many laps did Jake run?', answer: 18, equation: '2 x 9 = 18', sentence: 'Jake ran 18 laps.' },
      ],
    },
    'equal-sharing': {
      problems: [
        { story: '36 stickers are shared equally among 6 children. How many stickers does each child get?', answer: 6, equation: '36 / 6 = 6', sentence: 'Each child gets 6 stickers.' },
        { story: 'Sam has 42 trading cards. He divides them equally into 7 piles. How many cards are in each pile?', answer: 6, equation: '42 / 7 = 6', sentence: 'There are 6 cards in each pile.' },
        { story: 'A farmer has 54 oranges to pack into boxes of 9. How many oranges go in each box?', answer: 6, equation: '54 / 9 = 6', sentence: 'Each box gets 6 oranges.' },
        { story: '48 children are divided into 8 equal teams. How many children are on each team?', answer: 6, equation: '48 / 8 = 6', sentence: 'There are 6 children on each team.' },
        { story: 'A teacher has 35 pencils to share among 5 students. How many pencils does each student get?', answer: 7, equation: '35 / 5 = 7', sentence: 'Each student gets 7 pencils.' },
      ],
    },
    'equal-grouping': {
      problems: [
        { story: 'A baker has 24 cookies. She puts 6 cookies in each bag. How many bags does she need?', answer: 4, equation: '24 / 6 = 4', sentence: 'The baker needs 4 bags.' },
        { story: 'There are 32 children. Each table seats 4. How many tables are needed?', answer: 8, equation: '32 / 4 = 8', sentence: '8 tables are needed.' },
        { story: 'Sam has 45 photos. Each page in his album holds 9 photos. How many pages does he need?', answer: 5, equation: '45 / 9 = 5', sentence: 'Sam needs 5 pages.' },
        { story: 'A store has 56 bottles. Each shelf holds 8 bottles. How many shelves are needed?', answer: 7, equation: '56 / 8 = 7', sentence: '7 shelves are needed.' },
        { story: 'There are 30 eggs. Each carton holds 6 eggs. How many cartons are needed?', answer: 5, equation: '30 / 6 = 5', sentence: '5 cartons are needed.' },
      ],
    },
    'division-with-remainder': {
      problems: [
        { story: '25 children need to ride in vans. Each van holds 6 children. How many vans are needed?', answer: 5, equation: '25 / 6 = 4 R 1, so 5 vans', sentence: '5 vans are needed (4 full vans and 1 more for the remaining child).' },
        { story: 'Sam has 17 stickers to share equally among 3 friends. How many does each get, and how many are left over?', answer: 5, equation: '17 / 3 = 5 R 2', sentence: 'Each friend gets 5 stickers with 2 left over.' },
        { story: 'A baker has 29 cupcakes. Each box holds 4. How many boxes can she fill completely?', answer: 7, equation: '29 / 4 = 7 R 1', sentence: 'She can fill 7 boxes completely with 1 cupcake left over.' },
        { story: '50 children are going on a field trip. Each bus holds 12 children. How many buses are needed?', answer: 5, equation: '50 / 12 = 4 R 2, so 5 buses', sentence: '5 buses are needed.' },
        { story: 'Mia has 23 flowers. She makes bouquets of 5 flowers each. How many bouquets can she make?', answer: 4, equation: '23 / 5 = 4 R 3', sentence: 'Mia can make 4 bouquets with 3 flowers left over.' },
      ],
    },
    'two-step-add-multiply': {
      problems: [
        { story: 'Mom buys 3 packs of juice boxes with 8 in each pack. She already had 5 juice boxes at home. How many juice boxes does she have now?', answer: 29, equation: '3 x 8 + 5 = 29', sentence: 'Mom has 29 juice boxes now.' },
        { story: 'Sam earned $7 each day for 4 days. Then he found $5 on the ground. How much money does he have?', answer: 33, equation: '7 x 4 + 5 = 33', sentence: 'Sam has $33.' },
        { story: 'Each row in the theater has 9 seats. There are 6 rows, plus 4 extra seats in the back. How many seats are there?', answer: 58, equation: '9 x 6 + 4 = 58', sentence: 'There are 58 seats.' },
        { story: 'A teacher gave 5 pencils to each of her 8 students. She had 12 pencils left. How many pencils did she start with?', answer: 52, equation: '5 x 8 + 12 = 52', sentence: 'The teacher started with 52 pencils.' },
        { story: 'There are 4 bags of oranges with 6 in each bag, plus 3 loose oranges. How many oranges in all?', answer: 27, equation: '4 x 6 + 3 = 27', sentence: 'There are 27 oranges in all.' },
      ],
    },
    'two-step-sub-multiply': {
      problems: [
        { story: 'Sam had 50 stickers. He gave 6 stickers to each of his 7 friends. How many stickers does he have left?', answer: 8, equation: '50 - 6 x 7 = 8', sentence: 'Sam has 8 stickers left.' },
        { story: 'A store had 80 apples. They put 9 apples in each of 8 bags. How many apples are left?', answer: 8, equation: '80 - 9 x 8 = 8', sentence: 'There are 8 apples left.' },
        { story: 'Mia had $45. She bought 4 books at $8 each. How much money does she have left?', answer: 13, equation: '45 - 4 x 8 = 13', sentence: 'Mia has $13 left.' },
        { story: 'A farmer had 60 eggs. He packed 7 eggs in each of 6 boxes. How many eggs are left?', answer: 18, equation: '60 - 7 x 6 = 18', sentence: 'There are 18 eggs left.' },
        { story: 'There were 100 candies. Each of 9 children took 8 candies. How many candies are left?', answer: 28, equation: '100 - 9 x 8 = 28', sentence: 'There are 28 candies left.' },
      ],
    },
    'fraction-of-set': {
      problems: [
        { story: 'There are 12 cookies. Sam eats 1/3 of them. How many cookies does Sam eat?', answer: 4, equation: '12 / 3 = 4', sentence: 'Sam eats 4 cookies.' },
        { story: 'A class has 20 students. 1/4 of them are wearing hats. How many students are wearing hats?', answer: 5, equation: '20 / 4 = 5', sentence: '5 students are wearing hats.' },
        { story: 'Mia has 18 beads. She uses 1/3 for a bracelet. How many beads does she use?', answer: 6, equation: '18 / 3 = 6', sentence: 'Mia uses 6 beads.' },
        { story: 'There are 24 chairs. 1/6 of them are blue. How many chairs are blue?', answer: 4, equation: '24 / 6 = 4', sentence: '4 chairs are blue.' },
        { story: 'A garden has 30 flowers. 1/5 of them are roses. How many are roses?', answer: 6, equation: '30 / 5 = 6', sentence: '6 of the flowers are roses.' },
      ],
    },
  },
  'grade-4': {
    'multi-step-add-sub': {
      problems: [
        { story: 'A school has 245 students. 128 are in the lower grades and the rest are in the upper grades. 67 upper graders are boys. How many upper graders are girls?', answer: 50, equation: '245 - 128 = 117; 117 - 67 = 50', sentence: '50 upper graders are girls.' },
        { story: 'Sam earned $156 in January, $203 in February, and spent $175. How much does he have?', answer: 184, equation: '156 + 203 - 175 = 184', sentence: 'Sam has $184.' },
        { story: 'A store received 350 shirts. They sold 127 on Monday and 98 on Tuesday. How many shirts are left?', answer: 125, equation: '350 - 127 - 98 = 125', sentence: 'There are 125 shirts left.' },
        { story: 'Mia scored 89 points, then 76 points, then 95 points on three tests. Her goal was 275 total. Did she reach it? By how much was she over or under?', answer: 15, equation: '89 + 76 + 95 = 260; 275 - 260 = 15 under', sentence: 'She was 15 points under her goal.' },
        { story: 'A parking garage has 450 spaces. There are 238 cars in the morning. 85 leave and 112 arrive by noon. How many empty spaces are there at noon?', answer: 185, equation: '238 - 85 + 112 = 265; 450 - 265 = 185', sentence: 'There are 185 empty spaces at noon.' },
      ],
    },
    'multi-step-multiply-divide': {
      problems: [
        { story: 'A bakery makes 8 trays of cookies with 12 cookies each. They pack them in boxes of 6. How many boxes do they need?', answer: 16, equation: '8 x 12 = 96; 96 / 6 = 16', sentence: 'They need 16 boxes.' },
        { story: 'Sam buys 5 bags of apples with 8 apples each. He shares them equally among 4 friends. How many apples does each friend get?', answer: 10, equation: '5 x 8 = 40; 40 / 4 = 10', sentence: 'Each friend gets 10 apples.' },
        { story: 'A farmer planted 9 rows of corn with 15 plants per row. He divides the harvest equally among 3 markets. How many plants worth of corn goes to each market?', answer: 45, equation: '9 x 15 = 135; 135 / 3 = 45', sentence: 'Each market gets 45 plants worth of corn.' },
        { story: 'A school ordered 6 boxes of pencils with 24 in each box. They share them equally among 8 classes. How many pencils does each class get?', answer: 18, equation: '6 x 24 = 144; 144 / 8 = 18', sentence: 'Each class gets 18 pencils.' },
        { story: 'Mia walks 7 blocks to school and 7 blocks home, 5 days a week. How many blocks does she walk in 4 weeks?', answer: 280, equation: '7 x 2 = 14; 14 x 5 = 70; 70 x 4 = 280', sentence: 'Mia walks 280 blocks in 4 weeks.' },
      ],
    },
    'multi-step-mixed': {
      problems: [
        { story: 'A toy store had 200 action figures. They sold 45 on Saturday and 3 times as many on Sunday. How many are left?', answer: 20, equation: '45 x 3 = 135; 200 - 45 - 135 = 20', sentence: 'There are 20 action figures left.' },
        { story: 'Emma buys 3 packs of markers for $5 each and 2 notebooks for $3 each. She pays with a $25 bill. How much change does she get?', answer: 4, equation: '3 x 5 + 2 x 3 = 21; 25 - 21 = 4', sentence: 'Emma gets $4 in change.' },
        { story: 'A farmer has 84 chickens in 7 equal coops. He sells 3 coops of chickens. How many chickens does he have left?', answer: 48, equation: '84 / 7 = 12; 12 x 3 = 36; 84 - 36 = 48', sentence: 'The farmer has 48 chickens left.' },
        { story: 'Sam ran 8 laps on Monday and twice as many on Tuesday. Each lap is 200 meters. How far did he run in total?', answer: 4800, equation: '8 + 16 = 24; 24 x 200 = 4800', sentence: 'Sam ran 4,800 meters in total.' },
        { story: 'A florist has 120 roses. She makes bouquets of 8 roses each and sells each bouquet for $12. She sells all the bouquets. How much money does she earn?', answer: 180, equation: '120 / 8 = 15; 15 x 12 = 180', sentence: 'The florist earns $180.' },
      ],
    },
    'times-as-many': {
      problems: [
        { story: 'A horse weighs 6 times as much as a large dog. The dog weighs 45 kg. How much does the horse weigh?', answer: 270, equation: '6 x 45 = 270', sentence: 'The horse weighs 270 kg.' },
        { story: 'Anna has 14 books. Her shelf holds 3 times as many. How many books can the shelf hold?', answer: 42, equation: '3 x 14 = 42', sentence: 'The shelf can hold 42 books.' },
        { story: 'A building is 8 times as tall as a fence. The fence is 6 feet tall. How tall is the building?', answer: 48, equation: '8 x 6 = 48', sentence: 'The building is 48 feet tall.' },
        { story: 'Sam has 125 stamps. That is 5 times as many as Emma has. How many stamps does Emma have?', answer: 25, equation: '125 / 5 = 25', sentence: 'Emma has 25 stamps.' },
        { story: 'A train ticket costs 4 times as much as a bus ticket. A bus ticket costs $9. How much more does a train ticket cost than a bus ticket?', answer: 27, equation: '4 x 9 = 36; 36 - 9 = 27', sentence: 'A train ticket costs $27 more than a bus ticket.' },
      ],
    },
    'times-as-many-unknown-multiplier': {
      problems: [
        { story: 'Sam has 36 trading cards. Emma has 9. How many times as many cards does Sam have as Emma?', answer: 4, equation: '36 / 9 = 4', sentence: 'Sam has 4 times as many cards as Emma.' },
        { story: 'A sunflower is 72 inches tall. A tulip is 8 inches tall. The sunflower is how many times as tall?', answer: 9, equation: '72 / 8 = 9', sentence: 'The sunflower is 9 times as tall.' },
        { story: 'Dad is 42 years old. His daughter is 7. Dad is how many times as old?', answer: 6, equation: '42 / 7 = 6', sentence: 'Dad is 6 times as old as his daughter.' },
        { story: 'A whale swims 56 miles. A turtle swims 8 miles. The whale swims how many times as far?', answer: 7, equation: '56 / 8 = 7', sentence: 'The whale swims 7 times as far.' },
        { story: 'There are 48 chairs in the auditorium and 6 in the office. How many times as many chairs are in the auditorium?', answer: 8, equation: '48 / 6 = 8', sentence: 'The auditorium has 8 times as many chairs.' },
      ],
    },
    'fraction-add-sub': {
      problems: [
        { story: 'A pizza is cut into 8 slices. Tom eats 3/8 and Sara eats 2/8. What fraction of the pizza did they eat?', answer: '5/8', equation: '3/8 + 2/8 = 5/8', sentence: 'They ate 5/8 of the pizza.' },
        { story: 'Sam drank 4/6 of his water bottle. What fraction is left?', answer: '2/6', equation: '6/6 - 4/6 = 2/6', sentence: '2/6 of the water is left.' },
        { story: 'Mia walked 2/5 of a mile to school and 1/5 of a mile to the library. How far did she walk?', answer: '3/5', equation: '2/5 + 1/5 = 3/5', sentence: 'Mia walked 3/5 of a mile.' },
        { story: 'A jar was 7/10 full of jelly beans. Sam ate 3/10 of the jar. What fraction is left?', answer: '4/10', equation: '7/10 - 3/10 = 4/10', sentence: '4/10 of the jar is left.' },
        { story: 'Emma finished 1/4 of her homework before dinner and 2/4 after dinner. What fraction did she finish?', answer: '3/4', equation: '1/4 + 2/4 = 3/4', sentence: 'Emma finished 3/4 of her homework.' },
      ],
    },
    'fraction-of-whole-number': {
      problems: [
        { story: 'Sam has 24 marbles. He gives 1/4 of them to his friend. How many marbles does he give away?', answer: 6, equation: '24 / 4 = 6', sentence: 'Sam gives away 6 marbles.' },
        { story: 'There are 36 students in a class. 2/3 of them are girls. How many are girls?', answer: 24, equation: '36 / 3 x 2 = 24', sentence: '24 students are girls.' },
        { story: 'A recipe needs 3/4 of 20 cups of flour. How many cups of flour are needed?', answer: 15, equation: '20 / 4 x 3 = 15', sentence: '15 cups of flour are needed.' },
        { story: 'Mia read 2/5 of a 40-page book. How many pages did she read?', answer: 16, equation: '40 / 5 x 2 = 16', sentence: 'Mia read 16 pages.' },
        { story: 'A garden has 30 plants. 1/6 of them are tomatoes. How many tomato plants are there?', answer: 5, equation: '30 / 6 = 5', sentence: 'There are 5 tomato plants.' },
      ],
    },
    'elapsed-time': {
      problems: [
        { story: 'A movie starts at 2:15 PM and ends at 4:00 PM. How long is the movie?', answer: '1 hour 45 minutes', equation: '4:00 - 2:15 = 1:45', sentence: 'The movie is 1 hour and 45 minutes long.' },
        { story: 'Sam started homework at 3:30 PM. He finished 1 hour and 20 minutes later. What time did he finish?', answer: '4:50 PM', equation: '3:30 + 1:20 = 4:50', sentence: 'Sam finished at 4:50 PM.' },
        { story: 'A train left at 9:45 AM and arrived at 11:30 AM. How long was the trip?', answer: '1 hour 45 minutes', equation: '11:30 - 9:45 = 1:45', sentence: 'The trip was 1 hour and 45 minutes.' },
        { story: 'Mia needs to be at school by 8:00 AM. It takes her 35 minutes to get ready and 15 minutes to walk. What time should she wake up?', answer: '7:10 AM', equation: '8:00 - 0:50 = 7:10', sentence: 'Mia should wake up at 7:10 AM.' },
        { story: 'A soccer game starts at 10:00 AM. Each half is 30 minutes with a 10-minute halftime. What time does the game end?', answer: '11:10 AM', equation: '30 + 10 + 30 = 70 min; 10:00 + 1:10 = 11:10', sentence: 'The game ends at 11:10 AM.' },
      ],
    },
    'perimeter-area': {
      problems: [
        { story: 'A rectangular garden is 12 feet long and 8 feet wide. What is its perimeter?', answer: 40, equation: '2 x (12 + 8) = 40', sentence: 'The perimeter is 40 feet.' },
        { story: 'A square classroom has sides of 9 meters. What is its area?', answer: 81, equation: '9 x 9 = 81', sentence: 'The area is 81 square meters.' },
        { story: 'A rectangular pool is 15 meters long and 6 meters wide. What is its area?', answer: 90, equation: '15 x 6 = 90', sentence: 'The area is 90 square meters.' },
        { story: 'Sam wants to put a fence around his yard. It is 20 feet long and 14 feet wide. How much fencing does he need?', answer: 68, equation: '2 x (20 + 14) = 68', sentence: 'Sam needs 68 feet of fencing.' },
        { story: 'A square tile has sides of 5 inches. What is its perimeter and area?', answer: '20 inches perimeter, 25 square inches area', equation: '4 x 5 = 20; 5 x 5 = 25', sentence: 'The perimeter is 20 inches and the area is 25 square inches.' },
      ],
    },
  },
  'grade-5': {
    'fraction-add-unlike': {
      problems: [
        { story: 'Sam ate 1/3 of a pie. Emma ate 1/4 of the same pie. What fraction of the pie did they eat together?', answer: '7/12', equation: '4/12 + 3/12 = 7/12', sentence: 'They ate 7/12 of the pie together.' },
        { story: 'Mia jogged 2/3 of a mile and then walked 1/6 of a mile. How far did she go in all?', answer: '5/6', equation: '4/6 + 1/6 = 5/6', sentence: 'Mia went 5/6 of a mile.' },
        { story: 'A recipe uses 1/2 cup of sugar and 1/3 cup of brown sugar. How much sugar is that in all?', answer: '5/6', equation: '3/6 + 2/6 = 5/6', sentence: 'That is 5/6 of a cup of sugar.' },
        { story: 'Sam finished 3/5 of his project on Monday and 1/4 on Tuesday. How much has he finished?', answer: '17/20', equation: '12/20 + 5/20 = 17/20', sentence: 'Sam has finished 17/20 of his project.' },
        { story: 'A tank was 7/8 full. 1/4 of the water was used. What fraction is left?', answer: '5/8', equation: '7/8 - 2/8 = 5/8', sentence: '5/8 of the tank is left.' },
      ],
    },
    'fraction-multiply': {
      problems: [
        { story: 'Sam needs 2/3 of a cup of flour. He wants to make 4 batches. How much flour does he need?', answer: '8/3 or 2 2/3', equation: '2/3 x 4 = 8/3 = 2 2/3', sentence: 'Sam needs 2 2/3 cups of flour.' },
        { story: 'A ribbon is 3/4 of a meter long. Mia uses 1/2 of it. How much ribbon does she use?', answer: '3/8', equation: '3/4 x 1/2 = 3/8', sentence: 'Mia uses 3/8 of a meter.' },
        { story: 'A recipe calls for 5/6 of a cup of milk. Emma wants to make 1/2 of the recipe. How much milk does she need?', answer: '5/12', equation: '5/6 x 1/2 = 5/12', sentence: 'Emma needs 5/12 of a cup of milk.' },
        { story: '2/5 of the class likes soccer. Of those who like soccer, 3/4 also like basketball. What fraction of the class likes both?', answer: '6/20 or 3/10', equation: '2/5 x 3/4 = 6/20 = 3/10', sentence: '3/10 of the class likes both.' },
        { story: 'Sam has 3/8 of a pizza. He eats 2/3 of what he has. What fraction of the whole pizza did he eat?', answer: '6/24 or 1/4', equation: '3/8 x 2/3 = 6/24 = 1/4', sentence: 'Sam ate 1/4 of the whole pizza.' },
      ],
    },
    'fraction-word-problems': {
      problems: [
        { story: 'Emma has 5/6 of a yard of fabric. She uses 1/3 of a yard. How much fabric does she have left?', answer: '1/2', equation: '5/6 - 2/6 = 3/6 = 1/2', sentence: 'Emma has 1/2 of a yard left.' },
        { story: 'Sam walked 3/4 of a mile to the store and 1/2 of a mile to the park. How much farther was the store?', answer: '1/4', equation: '3/4 - 2/4 = 1/4', sentence: 'The store was 1/4 of a mile farther.' },
        { story: 'A tank is 2/3 full. After using some water, it is 1/4 full. What fraction of the tank was used?', answer: '5/12', equation: '8/12 - 3/12 = 5/12', sentence: '5/12 of the tank was used.' },
        { story: 'Mia ate 1/4 of a cake. Jake ate 1/3 of the same cake. Who ate more, and by how much?', answer: '1/12', equation: '4/12 - 3/12 = 1/12', sentence: 'Jake ate 1/12 more than Mia.' },
        { story: 'A bottle holds 7/8 of a liter. Sam drinks 3/8 of a liter. How much is left?', answer: '4/8 or 1/2', equation: '7/8 - 3/8 = 4/8 = 1/2', sentence: 'There is 1/2 of a liter left.' },
      ],
    },
    'decimal-add-sub': {
      problems: [
        { story: 'Sam buys a notebook for $3.75 and a pen for $1.50. How much does he spend?', answer: 5.25, equation: '3.75 + 1.50 = 5.25', sentence: 'Sam spends $5.25.' },
        { story: 'Mia had $20.00. She spent $12.65 on a book. How much money does she have left?', answer: 7.35, equation: '20.00 - 12.65 = 7.35', sentence: 'Mia has $7.35 left.' },
        { story: 'A runner ran 3.6 km on Monday and 4.25 km on Tuesday. How far did she run in total?', answer: 7.85, equation: '3.6 + 4.25 = 7.85', sentence: 'She ran 7.85 km in total.' },
        { story: 'A board is 8.5 feet long. Sam cuts off 2.75 feet. How long is the remaining piece?', answer: 5.75, equation: '8.5 - 2.75 = 5.75', sentence: 'The remaining piece is 5.75 feet long.' },
        { story: 'Emma scored 9.4 in the first round and 8.75 in the second round. What is her total score?', answer: 18.15, equation: '9.4 + 8.75 = 18.15', sentence: 'Her total score is 18.15.' },
      ],
    },
    'decimal-multiply': {
      problems: [
        { story: 'Gas costs $3.50 per gallon. Sam buys 4 gallons. How much does he pay?', answer: 14.00, equation: '3.50 x 4 = 14.00', sentence: 'Sam pays $14.00.' },
        { story: 'Each piece of ribbon is 2.5 meters. Mia needs 6 pieces. How much ribbon does she need?', answer: 15.0, equation: '2.5 x 6 = 15.0', sentence: 'Mia needs 15 meters of ribbon.' },
        { story: 'A tile is 0.75 feet long. Sam lays 8 tiles in a row. How long is the row?', answer: 6.0, equation: '0.75 x 8 = 6.0', sentence: 'The row is 6 feet long.' },
        { story: 'Each apple weighs 0.3 kg. A bag has 12 apples. How much do the apples weigh?', answer: 3.6, equation: '0.3 x 12 = 3.6', sentence: 'The apples weigh 3.6 kg.' },
        { story: 'Sam earns $8.25 per hour. He works for 3 hours. How much does he earn?', answer: 24.75, equation: '8.25 x 3 = 24.75', sentence: 'Sam earns $24.75.' },
      ],
    },
    'volume-word-problems': {
      problems: [
        { story: 'A box is 5 cm long, 4 cm wide, and 3 cm tall. What is its volume?', answer: 60, equation: '5 x 4 x 3 = 60', sentence: 'The volume is 60 cubic centimeters.' },
        { story: 'A fish tank is 12 inches long, 8 inches wide, and 10 inches tall. What is its volume?', answer: 960, equation: '12 x 8 x 10 = 960', sentence: 'The volume is 960 cubic inches.' },
        { story: 'Sam builds a tower with blocks. The base is 3 blocks long and 2 blocks wide. The tower is 4 blocks tall. How many blocks does he use?', answer: 24, equation: '3 x 2 x 4 = 24', sentence: 'Sam uses 24 blocks.' },
        { story: 'A planter box is 6 feet long, 2 feet wide, and 1.5 feet deep. What volume of soil does it need?', answer: 18, equation: '6 x 2 x 1.5 = 18', sentence: 'It needs 18 cubic feet of soil.' },
        { story: 'A cube has edges of 7 cm. What is its volume?', answer: 343, equation: '7 x 7 x 7 = 343', sentence: 'The volume is 343 cubic centimeters.' },
      ],
    },
    'multi-step-fractions': {
      problems: [
        { story: 'A baker made 120 cookies. She sold 1/3 on Monday and 1/4 of the remaining on Tuesday. How many are left?', answer: 60, equation: '120 / 3 = 40; 120 - 40 = 80; 80 / 4 = 20; 80 - 20 = 60', sentence: 'There are 60 cookies left.' },
        { story: 'Sam had $60. He spent 1/4 on a book and 1/3 of what was left on lunch. How much does he have?', answer: 30, equation: '60 / 4 = 15; 60 - 15 = 45; 45 / 3 = 15; 45 - 15 = 30', sentence: 'Sam has $30 left.' },
        { story: 'A garden is 3/4 planted with vegetables. Of the vegetable area, 2/3 is tomatoes. What fraction of the whole garden is tomatoes?', answer: '1/2', equation: '3/4 x 2/3 = 6/12 = 1/2', sentence: '1/2 of the garden is tomatoes.' },
        { story: 'Mia has 48 beads. She uses 1/6 for earrings and 1/4 for a bracelet. How many beads does she have left?', answer: 28, equation: '48/6 = 8; 48/4 = 12; 48 - 8 - 12 = 28', sentence: 'Mia has 28 beads left.' },
        { story: 'A pool was 5/6 full. After a party, it was only 1/2 full. What fraction of the pool was used?', answer: '1/3', equation: '5/6 - 3/6 = 2/6 = 1/3', sentence: '1/3 of the pool was used.' },
      ],
    },
    'multi-step-decimals': {
      problems: [
        { story: 'Emma buys 3 shirts at $12.50 each and returns one shirt. She also buys socks for $4.75. How much does she spend?', answer: 29.75, equation: '3 x 12.50 = 37.50; 37.50 - 12.50 = 25.00; 25.00 + 4.75 = 29.75', sentence: 'Emma spends $29.75.' },
        { story: 'Sam earns $9.50 per hour. He works 3 hours on Saturday and 4 hours on Sunday. How much does he earn?', answer: 66.50, equation: '3 + 4 = 7; 7 x 9.50 = 66.50', sentence: 'Sam earns $66.50.' },
        { story: 'A runner runs 2.4 km per day for 5 days. Another runner runs 1.8 km per day for 7 days. Who runs farther and by how much?', answer: 0.6, equation: '2.4 x 5 = 12.0; 1.8 x 7 = 12.6; 12.6 - 12.0 = 0.6', sentence: 'The second runner runs 0.6 km farther.' },
        { story: 'Mia buys 2.5 kg of apples at $2.40 per kg and 1.5 kg of oranges at $3.20 per kg. How much does she spend?', answer: 10.80, equation: '2.5 x 2.40 = 6.00; 1.5 x 3.20 = 4.80; 6.00 + 4.80 = 10.80', sentence: 'Mia spends $10.80.' },
        { story: 'A car uses 0.08 gallons per mile. Sam drives 12.5 miles to school and 12.5 miles home. How many gallons does he use?', answer: 2.0, equation: '12.5 + 12.5 = 25; 25 x 0.08 = 2.0', sentence: 'Sam uses 2 gallons.' },
      ],
    },
  },
  'grade-6': {
    'ratio-problems': {
      problems: [
        { story: 'The ratio of boys to girls in a class is 3:4. There are 28 students. How many are boys?', answer: 12, equation: '3 + 4 = 7 parts; 28 / 7 = 4 per part; 3 x 4 = 12', sentence: 'There are 12 boys.' },
        { story: 'A recipe uses flour and sugar in a 5:2 ratio. If you use 10 cups of flour, how many cups of sugar do you need?', answer: 4, equation: '10 / 5 = 2; 2 x 2 = 4', sentence: 'You need 4 cups of sugar.' },
        { story: 'Red and blue marbles are in a bag in a 3:5 ratio. There are 40 marbles total. How many are red?', answer: 15, equation: '3 + 5 = 8; 40 / 8 = 5; 3 x 5 = 15', sentence: 'There are 15 red marbles.' },
        { story: 'A map has a scale of 1:50,000. Two cities are 6 cm apart on the map. What is the real distance in km?', answer: 3, equation: '6 x 50,000 = 300,000 cm = 3 km', sentence: 'The real distance is 3 km.' },
        { story: 'Sam mixes paint in a ratio of 2 parts blue to 3 parts white. He wants 15 liters total. How much blue paint does he need?', answer: 6, equation: '2 + 3 = 5; 15 / 5 = 3; 2 x 3 = 6', sentence: 'Sam needs 6 liters of blue paint.' },
      ],
    },
    'unit-rate': {
      problems: [
        { story: 'Sam types 180 words in 3 minutes. What is his typing rate in words per minute?', answer: 60, equation: '180 / 3 = 60', sentence: 'Sam types 60 words per minute.' },
        { story: 'A car travels 240 miles on 8 gallons of gas. What is the gas mileage in miles per gallon?', answer: 30, equation: '240 / 8 = 30', sentence: 'The car gets 30 miles per gallon.' },
        { story: '5 pounds of apples cost $8.75. What is the cost per pound?', answer: 1.75, equation: '8.75 / 5 = 1.75', sentence: 'Apples cost $1.75 per pound.' },
        { story: 'A factory makes 432 toys in 6 hours. How many toys does it make per hour?', answer: 72, equation: '432 / 6 = 72', sentence: 'The factory makes 72 toys per hour.' },
        { story: 'Mia earns $52.50 for 7 hours of work. What is her hourly wage?', answer: 7.50, equation: '52.50 / 7 = 7.50', sentence: 'Mia earns $7.50 per hour.' },
      ],
    },
    'equivalent-ratios': {
      problems: [
        { story: 'A recipe uses 2 cups of flour for every 3 eggs. If you use 8 cups of flour, how many eggs do you need?', answer: 12, equation: '8 / 2 = 4; 3 x 4 = 12', sentence: 'You need 12 eggs.' },
        { story: 'For every 5 laps Sam runs, he drinks 2 cups of water. If he runs 20 laps, how many cups does he drink?', answer: 8, equation: '20 / 5 = 4; 2 x 4 = 8', sentence: 'Sam drinks 8 cups of water.' },
        { story: 'The ratio of cats to dogs at a shelter is 4:7. If there are 16 cats, how many dogs are there?', answer: 28, equation: '16 / 4 = 4; 7 x 4 = 28', sentence: 'There are 28 dogs.' },
        { story: 'A garden has roses and tulips in a ratio of 3:5. If there are 25 tulips, how many roses are there?', answer: 15, equation: '25 / 5 = 5; 3 x 5 = 15', sentence: 'There are 15 roses.' },
        { story: 'For every $3 Sam saves, he spends $7. If he saved $18, how much did he spend?', answer: 42, equation: '18 / 3 = 6; 7 x 6 = 42', sentence: 'Sam spent $42.' },
      ],
    },
    'percent-of-number': {
      problems: [
        { story: 'Sam scored 85% on a test with 60 questions. How many questions did he get right?', answer: 51, equation: '0.85 x 60 = 51', sentence: 'Sam got 51 questions right.' },
        { story: 'A class has 30 students. 40% of them walk to school. How many students walk?', answer: 12, equation: '0.40 x 30 = 12', sentence: '12 students walk to school.' },
        { story: 'Mia saves 25% of her $120 allowance each month. How much does she save?', answer: 30, equation: '0.25 x 120 = 30', sentence: 'Mia saves $30.' },
        { story: 'A school has 450 students. 60% signed up for the field trip. How many signed up?', answer: 270, equation: '0.60 x 450 = 270', sentence: '270 students signed up.' },
        { story: 'Sam earned $80. He gave 15% to charity. How much did he give?', answer: 12, equation: '0.15 x 80 = 12', sentence: 'Sam gave $12 to charity.' },
      ],
    },
    'percent-discount': {
      problems: [
        { story: 'A bike costs $180. It is on sale for 25% off. What is the sale price?', answer: 135, equation: '180 x 0.25 = 45; 180 - 45 = 135', sentence: 'The sale price is $135.' },
        { story: 'A jacket costs $60 and is 30% off. How much do you save?', answer: 18, equation: '60 x 0.30 = 18', sentence: 'You save $18.' },
        { story: 'A tablet costs $250. There is a 20% discount. What is the final price?', answer: 200, equation: '250 x 0.20 = 50; 250 - 50 = 200', sentence: 'The final price is $200.' },
        { story: 'Sam buys shoes that were $75, now 40% off. How much does he pay?', answer: 45, equation: '75 x 0.40 = 30; 75 - 30 = 45', sentence: 'Sam pays $45.' },
        { story: 'A $120 camera is on sale for 15% off. What is the sale price?', answer: 102, equation: '120 x 0.15 = 18; 120 - 18 = 102', sentence: 'The sale price is $102.' },
      ],
    },
    'percent-change': {
      problems: [
        { story: 'A town had 2,000 people last year. The population grew by 5%. How many people live there now?', answer: 2100, equation: '2000 x 0.05 = 100; 2000 + 100 = 2100', sentence: '2,100 people live there now.' },
        { story: 'A shirt was $40 last month. The price increased by 10%. What is the new price?', answer: 44, equation: '40 x 0.10 = 4; 40 + 4 = 44', sentence: 'The new price is $44.' },
        { story: 'Sam had 80 trading cards. He lost 25% of them. How many does he have now?', answer: 60, equation: '80 x 0.25 = 20; 80 - 20 = 60', sentence: 'Sam has 60 trading cards now.' },
        { story: 'A store sold 150 ice creams on Monday. On Tuesday sales decreased by 20%. How many did they sell Tuesday?', answer: 120, equation: '150 x 0.20 = 30; 150 - 30 = 120', sentence: 'They sold 120 ice creams on Tuesday.' },
        { story: 'Mia could do 25 push-ups last month. She improved by 40%. How many can she do now?', answer: 35, equation: '25 x 0.40 = 10; 25 + 10 = 35', sentence: 'Mia can do 35 push-ups now.' },
      ],
    },
    'rate-problems': {
      problems: [
        { story: 'A printer prints 12 pages per minute. How many pages will it print in 25 minutes?', answer: 300, equation: '12 x 25 = 300', sentence: 'The printer will print 300 pages.' },
        { story: 'Sam reads 45 pages per hour. How long will it take him to read a 270-page book?', answer: 6, equation: '270 / 45 = 6', sentence: 'It will take Sam 6 hours.' },
        { story: 'A faucet leaks 3 cups per hour. How many cups will it leak in a day?', answer: 72, equation: '3 x 24 = 72', sentence: 'It will leak 72 cups in a day.' },
        { story: 'A machine fills 8 bottles per minute. How many minutes to fill 200 bottles?', answer: 25, equation: '200 / 8 = 25', sentence: 'It takes 25 minutes to fill 200 bottles.' },
        { story: 'Mia earns $12 per hour. She wants to buy a $156 game. How many hours must she work?', answer: 13, equation: '156 / 12 = 13', sentence: 'Mia must work 13 hours.' },
      ],
    },
    'speed-distance-time': {
      problems: [
        { story: 'Car A drives 240 miles in 4 hours. Car B drives 200 miles in 3 hours. Which car is faster?', answer: 'Car B', equation: 'Car A: 240/4 = 60 mph; Car B: 200/3 = 66.7 mph', sentence: 'Car B is faster at about 66.7 mph compared to Car A at 60 mph.' },
        { story: 'Sam bikes at 15 miles per hour. How far can he bike in 3 hours?', answer: 45, equation: '15 x 3 = 45', sentence: 'Sam can bike 45 miles.' },
        { story: 'A train travels at 80 km per hour. How long does it take to travel 320 km?', answer: 4, equation: '320 / 80 = 4', sentence: 'It takes 4 hours.' },
        { story: 'Mia walks at 3 mph and jogs at 6 mph. She walks for 2 hours then jogs for 1 hour. How far does she go?', answer: 12, equation: '3 x 2 + 6 x 1 = 12', sentence: 'Mia goes 12 miles.' },
        { story: 'Two towns are 150 miles apart. Sam drives at 50 mph. Emma drives at 60 mph from the other town. They leave at the same time driving toward each other. When do they meet?', answer: '1 hour 21.8 minutes', equation: '50 + 60 = 110 mph; 150 / 110 = 1.36 hours', sentence: 'They meet in about 1 hour and 22 minutes.' },
      ],
    },
    'multi-step-ratio': {
      problems: [
        { story: 'In a school, the ratio of teachers to students is 1:15. There are 480 students. The school hires 8 more teachers. What is the new ratio of teachers to students?', answer: '1:12', equation: '480 / 15 = 32 teachers; 32 + 8 = 40; 40:480 = 1:12', sentence: 'The new ratio is 1:12.' },
        { story: 'Sam mixes red and yellow paint in a 2:3 ratio. He makes 10 liters total. Then he adds 2 more liters of red. What is the new ratio?', answer: '6:6 or 1:1', equation: '10: red = 4, yellow = 6; 4 + 2 = 6 red; 6:6 = 1:1', sentence: 'The new ratio is 1:1.' },
        { story: 'A bag has red and blue beads in a 3:5 ratio. There are 40 beads. Sam adds 12 red beads. How many of each color are there now?', answer: '27 red, 25 blue', equation: '40/8 = 5; red = 15, blue = 25; 15 + 12 = 27', sentence: 'There are 27 red and 25 blue beads.' },
        { story: 'The ratio of fiction to nonfiction books at a library is 5:3. There are 240 books total. They buy 20 more nonfiction books. What is the new ratio?', answer: '150:110 or 15:11', equation: 'fiction = 150, nonfiction = 90; 90 + 20 = 110; 150:110 = 15:11', sentence: 'The new ratio is 15:11.' },
        { story: 'A class has boys and girls in a 2:3 ratio. There are 25 students. 5 new boys join. What fraction of the class are girls now?', answer: '1/2', equation: 'boys = 10, girls = 15; 10 + 5 = 15; 15/30 = 1/2', sentence: '1/2 of the class are girls.' },
      ],
    },
    'multi-step-percent': {
      problems: [
        { story: 'A jacket costs $80. It is 25% off, and then there is 10% sales tax on the sale price. What is the total cost?', answer: 66, equation: '80 x 0.75 = 60; 60 x 1.10 = 66', sentence: 'The total cost is $66.' },
        { story: 'Sam earned $200. He saved 30% and spent 45% on food. How much is left for other things?', answer: 50, equation: '200 x 0.30 = 60; 200 x 0.45 = 90; 200 - 60 - 90 = 50', sentence: '$50 is left for other things.' },
        { story: 'A store marked up a $50 item by 40%, then put it on sale for 20% off. What is the sale price?', answer: 56, equation: '50 x 1.40 = 70; 70 x 0.80 = 56', sentence: 'The sale price is $56.' },
        { story: 'Mia scored 72% on a 50-question test. She needs 80% to pass. How many more questions did she need to get right?', answer: 4, equation: '50 x 0.72 = 36; 50 x 0.80 = 40; 40 - 36 = 4', sentence: 'Mia needed 4 more questions right.' },
        { story: 'A population of 5,000 grew 10% in year 1 and 20% in year 2. What is the population after 2 years?', answer: 6600, equation: '5000 x 1.10 = 5500; 5500 x 1.20 = 6600', sentence: 'The population is 6,600 after 2 years.' },
      ],
    },
  },
};

const STRATEGY_HINTS = {
  'kindergarten': 'Draw a picture! Use your fingers to count. Can you act it out with toys?',
  'grade-1': 'Try drawing a bar model. What do you KNOW? What do you need to FIND? Count on or count back.',
  'grade-2': 'Draw a bar model. Can you break the big number into tens and ones? Estimate first!',
  'grade-3': 'Think about equal groups. Can you draw an array? Use a bar model to show the parts.',
  'grade-4': 'Plan your steps. What do you need to find FIRST before you can answer the question? Use a bar model.',
  'grade-5': 'Find a common denominator. Draw a bar model for the fractions. Estimate to check your answer.',
  'grade-6': 'Set up a proportion. Find the unit rate. Draw a bar model or double number line. Check: does my answer make sense?',
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

function resolveSkillKey(grade, skill) {
  const gs = SKILLS[grade];
  if (!gs) return null;
  for (const [cat, skills] of Object.entries(gs)) { if (skills.includes(skill)) return { grade, category: cat, skill }; }
  return null;
}

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9/. ]/g, ''); }

// Exercise generation

function exResult(type, skill, grade, instruction, items) { return { type, skill, grade, count: items.length, instruction, items }; }

function generateExercise(grade, skill, count = 5) {
  const bank = PROBLEM_BANKS[grade]?.[skill];
  if (!bank || !bank.problems) return { error: `No problem bank for ${grade}/${skill}` };

  const selected = pick(bank.problems, count);
  return exResult('word-problem', skill, grade,
    'Solve each word problem. Show your work and write an answer sentence.',
    selected.map(p => ({
      prompt: p.story,
      answer: p.answer,
      equation: p.equation,
      answerSentence: p.sentence,
    }))
  );
}

// Answer checking

function checkAnswer(type, expected, answer) {
  const ne = norm(String(expected));
  const na = norm(String(answer));
  if (ne === na) return true;
  // Handle numeric comparison
  const numE = parseFloat(expected);
  const numA = parseFloat(answer);
  if (!isNaN(numE) && !isNaN(numA) && Math.abs(numE - numA) < 0.01) return true;
  // Handle fraction equivalence (e.g., 2/6 == 1/3)
  if (String(expected).includes('/') && String(answer).includes('/')) {
    const [en, ed] = String(expected).split('/').map(Number);
    const [an, ad] = String(answer).split('/').map(Number);
    if (ed && ad && Math.abs(en / ed - an / ad) < 0.001) return true;
  }
  return false;
}

// Public API

class WordProblems {
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

  getHint(grade) {
    return { grade, hint: STRATEGY_HINTS[grade] || 'Read the problem carefully. What do you KNOW? What do you need to FIND? Draw a picture or bar model to help.' };
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const hint = STRATEGY_HINTS[grade] || '';
    // Pick one problem as a worked example
    const bank = PROBLEM_BANKS[grade]?.[target.skill];
    const workedExample = bank && bank.problems.length ? bank.problems[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, strategyHint: hint,
      workedExample: workedExample ? {
        story: workedExample.story,
        equation: workedExample.equation,
        answerSentence: workedExample.sentence,
      } : null,
      lessonPlan: {
        understand: 'Read the problem. What do you KNOW? What do you need to FIND?',
        plan: `Strategy hint: ${hint}`,
        practice: `Complete ${exercise.count || 0} practice problems`,
        reflect: 'Does your answer make sense in the story? Can you write an answer sentence?',
      },
    };
  }
}

module.exports = WordProblems;

// CLI: node word-problems.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const wp = new WordProblems();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) wp.setGrade(id, grade);
        out({ action: 'start', profile: wp.getProfile(id), nextSkills: wp.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(wp.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'kindergarten';
        if (skill) { out(wp.generateExercise(grade, skill, 5)); }
        else { const n = wp.getNextSkills(id, 1).next; out(n.length ? wp.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current grade!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(wp.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(wp.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(wp.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(wp.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(wp.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? wp.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(wp.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(wp.setGrade(id, g)); break; }
      case 'hint': { const [, g] = args; if (!g) throw new Error('Usage: hint <grade>'); out(wp.getHint(g)); break; }
      default: out({ usage: 'node word-problems.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','hint'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
