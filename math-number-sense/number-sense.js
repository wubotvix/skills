// eClaw Math Number Sense Interactive Tutor (K-6). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'math-number-sense');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'counting': ['counting-to-20', 'counting-to-100'],
    'number-concepts': ['cardinality', 'ten-frames', 'number-bonds-to-10', 'composing-decomposing'],
  },
  'grade-1': {
    'place-value': ['place-value-tens-ones', 'comparing-2-digit'],
    'number-line': ['number-line-0-120', 'skip-counting-2-5-10'],
  },
  'grade-2': {
    'place-value': ['three-digit-place-value', 'expanded-form', 'word-form'],
    'comparison-estimation': ['comparing-3-digit', 'estimating-sums'],
  },
  'grade-3': {
    'place-value': ['four-digit-numbers', 'rounding-to-10', 'rounding-to-100'],
    'number-properties': ['even-odd', 'fractions-number-line'],
  },
  'grade-4': {
    'large-numbers': ['multi-digit-millions', 'rounding-any-place'],
    'factors': ['factors-multiples', 'prime-composite'],
  },
  'grade-5': {
    'decimals': ['decimal-place-value', 'powers-of-10', 'comparing-decimals', 'rounding-decimals'],
  },
  'grade-6': {
    'rational-numbers': ['negative-numbers', 'absolute-value', 'rational-numbers', 'coordinate-plane'],
  },
};

const PROBLEM_BANKS = {
  'kindergarten': {
    'counting-to-20': {
      sequences: [
        { start: 1, end: 5, missing: 3, prompt: '1, 2, ___, 4, 5' },
        { start: 3, end: 7, missing: 5, prompt: '3, 4, ___, 6, 7' },
        { start: 6, end: 10, missing: 8, prompt: '6, 7, ___, 9, 10' },
        { start: 10, end: 14, missing: 12, prompt: '10, 11, ___, 13, 14' },
        { start: 14, end: 18, missing: 16, prompt: '14, 15, ___, 17, 18' },
        { start: 1, end: 5, missing: 4, prompt: '1, 2, 3, ___, 5' },
        { start: 5, end: 9, missing: 7, prompt: '5, 6, ___, 8, 9' },
        { start: 8, end: 12, missing: 10, prompt: '8, 9, ___, 11, 12' },
        { start: 11, end: 15, missing: 13, prompt: '11, 12, ___, 14, 15' },
        { start: 15, end: 19, missing: 17, prompt: '15, 16, ___, 18, 19' },
        { start: 2, end: 6, missing: 4, prompt: '2, 3, ___, 5, 6' },
        { start: 7, end: 11, missing: 9, prompt: '7, 8, ___, 10, 11' },
        { start: 12, end: 16, missing: 14, prompt: '12, 13, ___, 15, 16' },
        { start: 16, end: 20, missing: 18, prompt: '16, 17, ___, 19, 20' },
        { start: 4, end: 8, missing: 6, prompt: '4, 5, ___, 7, 8' },
        { start: 9, end: 13, missing: 11, prompt: '9, 10, ___, 12, 13' },
        { start: 13, end: 17, missing: 15, prompt: '13, 14, ___, 16, 17' },
        { start: 17, end: 20, missing: 19, prompt: '17, 18, ___, 20' },
        { start: 1, end: 5, missing: 2, prompt: '1, ___, 3, 4, 5' },
        { start: 6, end: 10, missing: 9, prompt: '6, 7, 8, ___, 10' },
      ],
    },
    'counting-to-100': {
      sequences: [
        { start: 20, end: 25, missing: 22, prompt: '20, 21, ___, 23, 24, 25' },
        { start: 30, end: 35, missing: 32, prompt: '30, 31, ___, 33, 34, 35' },
        { start: 40, end: 45, missing: 43, prompt: '40, 41, 42, ___, 44, 45' },
        { start: 50, end: 55, missing: 52, prompt: '50, 51, ___, 53, 54, 55' },
        { start: 60, end: 65, missing: 63, prompt: '60, 61, 62, ___, 64, 65' },
        { start: 70, end: 75, missing: 72, prompt: '70, 71, ___, 73, 74, 75' },
        { start: 80, end: 85, missing: 83, prompt: '80, 81, 82, ___, 84, 85' },
        { start: 90, end: 95, missing: 91, prompt: '90, ___, 92, 93, 94, 95' },
        { start: 95, end: 100, missing: 97, prompt: '95, 96, ___, 98, 99, 100' },
        { start: 25, end: 30, missing: 27, prompt: '25, 26, ___, 28, 29, 30' },
        { start: 35, end: 40, missing: 38, prompt: '35, 36, 37, ___, 39, 40' },
        { start: 45, end: 50, missing: 47, prompt: '45, 46, ___, 48, 49, 50' },
        { start: 55, end: 60, missing: 58, prompt: '55, 56, 57, ___, 59, 60' },
        { start: 65, end: 70, missing: 67, prompt: '65, 66, ___, 68, 69, 70' },
        { start: 75, end: 80, missing: 78, prompt: '75, 76, 77, ___, 79, 80' },
        { start: 85, end: 90, missing: 88, prompt: '85, 86, 87, ___, 89, 90' },
        { start: 10, end: 100, step: 10, missing: 50, prompt: '10, 20, 30, 40, ___, 60, 70, 80, 90, 100' },
        { start: 5, end: 50, step: 5, missing: 25, prompt: '5, 10, 15, 20, ___, 30, 35, 40, 45, 50' },
        { start: 42, end: 47, missing: 44, prompt: '42, 43, ___, 45, 46, 47' },
        { start: 87, end: 92, missing: 90, prompt: '87, 88, 89, ___, 91, 92' },
      ],
    },
    'cardinality': {
      problems: [
        { prompt: 'How many apples? 🍎🍎🍎', count: 3 },
        { prompt: 'How many stars? ⭐⭐⭐⭐⭐', count: 5 },
        { prompt: 'How many circles? ●●●●●●●', count: 7 },
        { prompt: 'How many dots? ● ● ● ●', count: 4 },
        { prompt: 'How many hearts? ♥♥♥♥♥♥', count: 6 },
        { prompt: 'How many blocks? ■■', count: 2 },
        { prompt: 'How many triangles? ▲▲▲▲▲▲▲▲', count: 8 },
        { prompt: 'How many fish? 🐟', count: 1 },
        { prompt: 'How many dots? ● ● ● ● ● ● ● ● ●', count: 9 },
        { prompt: 'How many stars? ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐', count: 10 },
        { prompt: 'How many blocks? ■■■■■■■■■■■', count: 11 },
        { prompt: 'How many circles? ●●●●●●●●●●●●', count: 12 },
        { prompt: 'How many dots? ● ● ● ● ● ● ● ● ● ● ● ● ●', count: 13 },
        { prompt: 'How many triangles? ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲', count: 15 },
        { prompt: 'How many stars? ⭐⭐⭐⭐⭐ ⭐⭐⭐⭐⭐ ⭐⭐⭐⭐⭐ ⭐⭐⭐⭐⭐', count: 20 },
        { prompt: 'How many blocks? ■■■■■■■■■■■■■■■■', count: 16 },
        { prompt: 'How many dots? ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●', count: 18 },
        { prompt: 'How many circles? ●●●●●●●●●●●●●●', count: 14 },
        { prompt: 'How many hearts? ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥', count: 17 },
        { prompt: 'How many triangles? ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲', count: 19 },
      ],
    },
    'ten-frames': {
      frames: [
        { filled: 1, prompt: 'A ten frame has 1 dot filled. How many dots?', answer: 1 },
        { filled: 2, prompt: 'A ten frame has 2 dots filled. How many dots?', answer: 2 },
        { filled: 3, prompt: 'A ten frame has 3 dots filled. How many empty spaces?', answer: 7 },
        { filled: 4, prompt: 'A ten frame has 4 dots filled. How many empty spaces?', answer: 6 },
        { filled: 5, prompt: 'A ten frame has 5 dots filled. How many more to make 10?', answer: 5 },
        { filled: 6, prompt: 'A ten frame has 6 dots filled. How many empty spaces?', answer: 4 },
        { filled: 7, prompt: 'A ten frame has 7 dots filled. How many more to make 10?', answer: 3 },
        { filled: 8, prompt: 'A ten frame has 8 dots filled. How many empty spaces?', answer: 2 },
        { filled: 9, prompt: 'A ten frame has 9 dots filled. How many more to make 10?', answer: 1 },
        { filled: 10, prompt: 'A ten frame is completely filled. How many dots?', answer: 10 },
        { filled: 3, prompt: 'A ten frame has 3 dots. How many more to make 10?', answer: 7 },
        { filled: 4, prompt: 'A ten frame has 4 dots. How many more to make 10?', answer: 6 },
        { filled: 6, prompt: 'A ten frame has 6 dots. How many more to make 10?', answer: 4 },
        { filled: 2, prompt: 'A ten frame has 2 dots. How many more to make 10?', answer: 8 },
        { filled: 1, prompt: 'A ten frame has 1 dot. How many more to make 10?', answer: 9 },
        { filled: 8, prompt: 'A ten frame has 8 dots filled. How many dots?', answer: 8 },
        { filled: 5, prompt: 'A ten frame has 5 dots filled. Is the frame half full? (yes/no)', answer: 'yes' },
        { filled: 7, prompt: 'A ten frame shows 7. How many dots?', answer: 7 },
        { filled: 0, prompt: 'A ten frame is empty. How many dots?', answer: 0 },
        { filled: 9, prompt: 'A ten frame has 9 dots. How many dots?', answer: 9 },
      ],
    },
    'number-bonds-to-10': {
      bonds: [
        { a: 1, b: 9, prompt: '1 + ___ = 10', answer: 9 },
        { a: 2, b: 8, prompt: '2 + ___ = 10', answer: 8 },
        { a: 3, b: 7, prompt: '3 + ___ = 10', answer: 7 },
        { a: 4, b: 6, prompt: '4 + ___ = 10', answer: 6 },
        { a: 5, b: 5, prompt: '5 + ___ = 10', answer: 5 },
        { a: 6, b: 4, prompt: '6 + ___ = 10', answer: 4 },
        { a: 7, b: 3, prompt: '7 + ___ = 10', answer: 3 },
        { a: 8, b: 2, prompt: '8 + ___ = 10', answer: 2 },
        { a: 9, b: 1, prompt: '9 + ___ = 10', answer: 1 },
        { a: 0, b: 10, prompt: '0 + ___ = 10', answer: 10 },
        { a: 10, b: 0, prompt: '10 + ___ = 10', answer: 0 },
        { a: 1, b: 9, prompt: '___ + 9 = 10', answer: 1 },
        { a: 2, b: 8, prompt: '___ + 8 = 10', answer: 2 },
        { a: 3, b: 7, prompt: '___ + 7 = 10', answer: 3 },
        { a: 4, b: 6, prompt: '___ + 6 = 10', answer: 4 },
        { a: 5, b: 5, prompt: '___ + 5 = 10', answer: 5 },
        { a: 6, b: 4, prompt: '10 = 6 + ___', answer: 4 },
        { a: 7, b: 3, prompt: '10 = 7 + ___', answer: 3 },
        { a: 8, b: 2, prompt: '10 = ___ + 2', answer: 8 },
        { a: 9, b: 1, prompt: '10 = ___ + 1', answer: 9 },
      ],
    },
    'composing-decomposing': {
      problems: [
        { prompt: 'Break 5 into two parts: 2 + ___', answer: 3, whole: 5 },
        { prompt: 'Break 6 into two parts: 4 + ___', answer: 2, whole: 6 },
        { prompt: 'Break 7 into two parts: 3 + ___', answer: 4, whole: 7 },
        { prompt: 'Break 8 into two parts: 5 + ___', answer: 3, whole: 8 },
        { prompt: 'Break 9 into two parts: 6 + ___', answer: 3, whole: 9 },
        { prompt: 'Break 4 into two parts: 1 + ___', answer: 3, whole: 4 },
        { prompt: 'Put together: 3 + 4 = ___', answer: 7 },
        { prompt: 'Put together: 2 + 6 = ___', answer: 8 },
        { prompt: 'Put together: 5 + 4 = ___', answer: 9 },
        { prompt: 'Put together: 1 + 5 = ___', answer: 6 },
        { prompt: 'Break 10 into two parts: 7 + ___', answer: 3, whole: 10 },
        { prompt: 'Break 10 into two parts: 4 + ___', answer: 6, whole: 10 },
        { prompt: 'Put together: 6 + 3 = ___', answer: 9 },
        { prompt: 'Break 8 into two parts: 2 + ___', answer: 6, whole: 8 },
        { prompt: 'Put together: 4 + 5 = ___', answer: 9 },
        { prompt: 'Break 7 into two parts: 5 + ___', answer: 2, whole: 7 },
        { prompt: 'Put together: 3 + 3 = ___', answer: 6 },
        { prompt: 'Break 6 into two parts: 1 + ___', answer: 5, whole: 6 },
        { prompt: 'Put together: 7 + 2 = ___', answer: 9 },
        { prompt: 'Break 9 into two parts: 4 + ___', answer: 5, whole: 9 },
      ],
    },
  },
  'grade-1': {
    'place-value-tens-ones': {
      problems: [
        { number: 14, prompt: 'How many tens in 14?', answer: 1, type: 'tens' },
        { number: 14, prompt: 'How many ones in 14?', answer: 4, type: 'ones' },
        { number: 27, prompt: 'How many tens in 27?', answer: 2, type: 'tens' },
        { number: 27, prompt: 'How many ones in 27?', answer: 7, type: 'ones' },
        { number: 35, prompt: 'How many tens in 35?', answer: 3, type: 'tens' },
        { number: 35, prompt: 'How many ones in 35?', answer: 5, type: 'ones' },
        { number: 42, prompt: 'How many tens in 42?', answer: 4, type: 'tens' },
        { number: 56, prompt: 'How many ones in 56?', answer: 6, type: 'ones' },
        { number: 63, prompt: 'How many tens in 63?', answer: 6, type: 'tens' },
        { number: 78, prompt: 'How many ones in 78?', answer: 8, type: 'ones' },
        { number: 81, prompt: 'How many tens in 81?', answer: 8, type: 'tens' },
        { number: 99, prompt: 'How many ones in 99?', answer: 9, type: 'ones' },
        { number: 50, prompt: '5 tens and 0 ones = ___', answer: 50, type: 'compose' },
        { number: 36, prompt: '3 tens and 6 ones = ___', answer: 36, type: 'compose' },
        { number: 72, prompt: '7 tens and 2 ones = ___', answer: 72, type: 'compose' },
        { number: 18, prompt: '1 ten and 8 ones = ___', answer: 18, type: 'compose' },
        { number: 45, prompt: '4 tens and 5 ones = ___', answer: 45, type: 'compose' },
        { number: 60, prompt: '6 tens and 0 ones = ___', answer: 60, type: 'compose' },
        { number: 93, prompt: '9 tens and 3 ones = ___', answer: 93, type: 'compose' },
        { number: 11, prompt: '1 ten and 1 one = ___', answer: 11, type: 'compose' },
      ],
    },
    'comparing-2-digit': {
      problems: [
        { a: 23, b: 45, prompt: 'Which is greater: 23 or 45?', answer: '45', symbol: '<' },
        { a: 67, b: 34, prompt: 'Which is greater: 67 or 34?', answer: '67', symbol: '>' },
        { a: 55, b: 55, prompt: 'Compare: 55 ___ 55 (>, <, or =)', answer: '=', symbol: '=' },
        { a: 12, b: 21, prompt: 'Compare: 12 ___ 21 (>, <, or =)', answer: '<', symbol: '<' },
        { a: 89, b: 78, prompt: 'Compare: 89 ___ 78 (>, <, or =)', answer: '>', symbol: '>' },
        { a: 30, b: 30, prompt: 'Compare: 30 ___ 30 (>, <, or =)', answer: '=', symbol: '=' },
        { a: 41, b: 14, prompt: 'Which is less: 41 or 14?', answer: '14', symbol: '>' },
        { a: 56, b: 65, prompt: 'Which is less: 56 or 65?', answer: '56', symbol: '<' },
        { a: 99, b: 90, prompt: 'Compare: 99 ___ 90 (>, <, or =)', answer: '>', symbol: '>' },
        { a: 10, b: 19, prompt: 'Compare: 10 ___ 19 (>, <, or =)', answer: '<', symbol: '<' },
        { a: 77, b: 77, prompt: 'Compare: 77 ___ 77 (>, <, or =)', answer: '=', symbol: '=' },
        { a: 48, b: 84, prompt: 'Compare: 48 ___ 84 (>, <, or =)', answer: '<', symbol: '<' },
        { a: 63, b: 36, prompt: 'Which is greater: 63 or 36?', answer: '63', symbol: '>' },
        { a: 25, b: 52, prompt: 'Which is less: 25 or 52?', answer: '25', symbol: '<' },
        { a: 70, b: 70, prompt: 'Compare: 70 ___ 70 (>, <, or =)', answer: '=', symbol: '=' },
        { a: 88, b: 81, prompt: 'Compare: 88 ___ 81 (>, <, or =)', answer: '>', symbol: '>' },
        { a: 15, b: 51, prompt: 'Compare: 15 ___ 51 (>, <, or =)', answer: '<', symbol: '<' },
        { a: 33, b: 39, prompt: 'Compare: 33 ___ 39 (>, <, or =)', answer: '<', symbol: '<' },
        { a: 46, b: 46, prompt: 'Compare: 46 ___ 46 (>, <, or =)', answer: '=', symbol: '=' },
        { a: 92, b: 29, prompt: 'Compare: 92 ___ 29 (>, <, or =)', answer: '>', symbol: '>' },
      ],
    },
    'number-line-0-120': {
      problems: [
        { prompt: 'What number is between 7 and 9 on the number line?', answer: 8 },
        { prompt: 'What number is between 14 and 16?', answer: 15 },
        { prompt: 'What number comes right after 29?', answer: 30 },
        { prompt: 'What number comes right before 50?', answer: 49 },
        { prompt: 'What number is between 99 and 101?', answer: 100 },
        { prompt: 'What number comes right after 109?', answer: 110 },
        { prompt: 'What number comes right before 120?', answer: 119 },
        { prompt: 'What number is between 64 and 66?', answer: 65 },
        { prompt: 'What number comes right after 79?', answer: 80 },
        { prompt: 'What number comes right before 40?', answer: 39 },
        { prompt: 'What number is between 110 and 112?', answer: 111 },
        { prompt: 'What number comes right after 99?', answer: 100 },
        { prompt: 'What number is between 55 and 57?', answer: 56 },
        { prompt: 'What number comes right before 70?', answer: 69 },
        { prompt: 'What number comes right after 89?', answer: 90 },
        { prompt: 'What number is between 34 and 36?', answer: 35 },
        { prompt: 'What number comes right before 100?', answer: 99 },
        { prompt: 'What number is between 117 and 119?', answer: 118 },
        { prompt: 'What number comes right after 59?', answer: 60 },
        { prompt: 'What number comes right before 21?', answer: 20 },
      ],
    },
    'skip-counting-2-5-10': {
      sequences: [
        { by: 2, prompt: 'Count by 2s: 2, 4, 6, ___, 10', answer: 8 },
        { by: 2, prompt: 'Count by 2s: 10, 12, 14, ___, 18', answer: 16 },
        { by: 2, prompt: 'Count by 2s: 16, 18, ___, 22, 24', answer: 20 },
        { by: 5, prompt: 'Count by 5s: 5, 10, 15, ___, 25', answer: 20 },
        { by: 5, prompt: 'Count by 5s: 25, 30, ___, 40, 45', answer: 35 },
        { by: 5, prompt: 'Count by 5s: 45, 50, 55, ___, 65', answer: 60 },
        { by: 10, prompt: 'Count by 10s: 10, 20, 30, ___, 50', answer: 40 },
        { by: 10, prompt: 'Count by 10s: 50, 60, ___, 80, 90', answer: 70 },
        { by: 10, prompt: 'Count by 10s: 70, 80, 90, ___, 110', answer: 100 },
        { by: 2, prompt: 'Count by 2s: 20, 22, ___, 26, 28', answer: 24 },
        { by: 2, prompt: 'Count by 2s: 4, 6, 8, 10, ___', answer: 12 },
        { by: 5, prompt: 'Count by 5s: 10, 15, 20, 25, ___', answer: 30 },
        { by: 5, prompt: 'Count by 5s: 60, 65, ___, 75, 80', answer: 70 },
        { by: 10, prompt: 'Count by 10s: 20, 30, 40, 50, ___', answer: 60 },
        { by: 10, prompt: 'Count by 10s: 30, ___, 50, 60, 70', answer: 40 },
        { by: 2, prompt: 'Count by 2s: 30, 32, 34, ___, 38', answer: 36 },
        { by: 5, prompt: 'Count by 5s: 75, 80, 85, ___, 95', answer: 90 },
        { by: 10, prompt: 'Count by 10s: 40, 50, 60, ___, 80', answer: 70 },
        { by: 2, prompt: 'Count by 2s: 8, 10, ___, 14, 16', answer: 12 },
        { by: 5, prompt: 'Count by 5s: 35, 40, 45, 50, ___', answer: 55 },
      ],
    },
  },
  'grade-2': {
    'three-digit-place-value': {
      problems: [
        { number: 345, prompt: 'What digit is in the hundreds place of 345?', answer: 3, place: 'hundreds' },
        { number: 345, prompt: 'What digit is in the tens place of 345?', answer: 4, place: 'tens' },
        { number: 345, prompt: 'What digit is in the ones place of 345?', answer: 5, place: 'ones' },
        { number: 678, prompt: 'What is the value of the 6 in 678?', answer: 600, place: 'value' },
        { number: 892, prompt: 'What digit is in the hundreds place of 892?', answer: 8, place: 'hundreds' },
        { number: 205, prompt: 'What digit is in the tens place of 205?', answer: 0, place: 'tens' },
        { number: 517, prompt: 'What is the value of the 5 in 517?', answer: 500, place: 'value' },
        { number: 463, prompt: 'What is the value of the 6 in 463?', answer: 60, place: 'value' },
        { number: 129, prompt: 'What digit is in the ones place of 129?', answer: 9, place: 'ones' },
        { number: 750, prompt: 'What is the value of the 7 in 750?', answer: 700, place: 'value' },
        { number: 384, prompt: '3 hundreds, 8 tens, 4 ones = ___', answer: 384, place: 'compose' },
        { number: 609, prompt: '6 hundreds, 0 tens, 9 ones = ___', answer: 609, place: 'compose' },
        { number: 150, prompt: '1 hundred, 5 tens, 0 ones = ___', answer: 150, place: 'compose' },
        { number: 271, prompt: '2 hundreds, 7 tens, 1 one = ___', answer: 271, place: 'compose' },
        { number: 930, prompt: '9 hundreds, 3 tens, 0 ones = ___', answer: 930, place: 'compose' },
        { number: 418, prompt: 'What digit is in the tens place of 418?', answer: 1, place: 'tens' },
        { number: 562, prompt: 'What is the value of the 2 in 562?', answer: 2, place: 'value' },
        { number: 807, prompt: 'What digit is in the hundreds place of 807?', answer: 8, place: 'hundreds' },
        { number: 999, prompt: 'What is the value of the 9 in the tens place of 999?', answer: 90, place: 'value' },
        { number: 100, prompt: 'What digit is in the ones place of 100?', answer: 0, place: 'ones' },
      ],
    },
    'expanded-form': {
      problems: [
        { number: 345, prompt: 'Write 345 in expanded form.', answer: '300 + 40 + 5' },
        { number: 278, prompt: 'Write 278 in expanded form.', answer: '200 + 70 + 8' },
        { number: 506, prompt: 'Write 506 in expanded form.', answer: '500 + 6' },
        { number: 120, prompt: 'Write 120 in expanded form.', answer: '100 + 20' },
        { number: 891, prompt: 'Write 891 in expanded form.', answer: '800 + 90 + 1' },
        { number: 453, prompt: 'What number is 400 + 50 + 3?', answer: 453, reverse: true },
        { number: 729, prompt: 'What number is 700 + 20 + 9?', answer: 729, reverse: true },
        { number: 610, prompt: 'What number is 600 + 10?', answer: 610, reverse: true },
        { number: 305, prompt: 'What number is 300 + 5?', answer: 305, reverse: true },
        { number: 842, prompt: 'What number is 800 + 40 + 2?', answer: 842, reverse: true },
        { number: 167, prompt: 'Write 167 in expanded form.', answer: '100 + 60 + 7' },
        { number: 930, prompt: 'Write 930 in expanded form.', answer: '900 + 30' },
        { number: 444, prompt: 'Write 444 in expanded form.', answer: '400 + 40 + 4' },
        { number: 208, prompt: 'Write 208 in expanded form.', answer: '200 + 8' },
        { number: 715, prompt: 'Write 715 in expanded form.', answer: '700 + 10 + 5' },
        { number: 561, prompt: 'What number is 500 + 60 + 1?', answer: 561, reverse: true },
        { number: 990, prompt: 'Write 990 in expanded form.', answer: '900 + 90' },
        { number: 333, prompt: 'Write 333 in expanded form.', answer: '300 + 30 + 3' },
        { number: 104, prompt: 'What number is 100 + 4?', answer: 104, reverse: true },
        { number: 876, prompt: 'What number is 800 + 70 + 6?', answer: 876, reverse: true },
      ],
    },
    'word-form': {
      problems: [
        { number: 45, prompt: 'Write 45 in word form.', answer: 'forty-five' },
        { number: 123, prompt: 'Write 123 in word form.', answer: 'one hundred twenty-three' },
        { number: 500, prompt: 'Write 500 in word form.', answer: 'five hundred' },
        { number: 312, prompt: 'Write 312 in word form.', answer: 'three hundred twelve' },
        { number: 780, prompt: 'Write 780 in word form.', answer: 'seven hundred eighty' },
        { number: 206, prompt: 'Write 206 in word form.', answer: 'two hundred six' },
        { number: 91, prompt: 'Write 91 in word form.', answer: 'ninety-one' },
        { number: 650, prompt: 'What number is "six hundred fifty"?', answer: 650, reverse: true },
        { number: 418, prompt: 'What number is "four hundred eighteen"?', answer: 418, reverse: true },
        { number: 999, prompt: 'What number is "nine hundred ninety-nine"?', answer: 999, reverse: true },
        { number: 37, prompt: 'Write 37 in word form.', answer: 'thirty-seven' },
        { number: 564, prompt: 'Write 564 in word form.', answer: 'five hundred sixty-four' },
        { number: 800, prompt: 'Write 800 in word form.', answer: 'eight hundred' },
        { number: 111, prompt: 'Write 111 in word form.', answer: 'one hundred eleven' },
        { number: 250, prompt: 'What number is "two hundred fifty"?', answer: 250, reverse: true },
        { number: 73, prompt: 'Write 73 in word form.', answer: 'seventy-three' },
        { number: 409, prompt: 'Write 409 in word form.', answer: 'four hundred nine' },
        { number: 846, prompt: 'What number is "eight hundred forty-six"?', answer: 846, reverse: true },
        { number: 15, prompt: 'Write 15 in word form.', answer: 'fifteen' },
        { number: 302, prompt: 'What number is "three hundred two"?', answer: 302, reverse: true },
      ],
    },
    'comparing-3-digit': {
      problems: [
        { a: 345, b: 543, prompt: 'Compare: 345 ___ 543 (>, <, or =)', answer: '<' },
        { a: 678, b: 687, prompt: 'Compare: 678 ___ 687 (>, <, or =)', answer: '<' },
        { a: 500, b: 500, prompt: 'Compare: 500 ___ 500 (>, <, or =)', answer: '=' },
        { a: 891, b: 189, prompt: 'Compare: 891 ___ 189 (>, <, or =)', answer: '>' },
        { a: 234, b: 243, prompt: 'Compare: 234 ___ 243 (>, <, or =)', answer: '<' },
        { a: 756, b: 657, prompt: 'Which is greater: 756 or 657?', answer: '756' },
        { a: 412, b: 421, prompt: 'Which is less: 412 or 421?', answer: '412' },
        { a: 300, b: 299, prompt: 'Compare: 300 ___ 299 (>, <, or =)', answer: '>' },
        { a: 555, b: 555, prompt: 'Compare: 555 ___ 555 (>, <, or =)', answer: '=' },
        { a: 109, b: 190, prompt: 'Compare: 109 ___ 190 (>, <, or =)', answer: '<' },
        { a: 820, b: 802, prompt: 'Compare: 820 ___ 802 (>, <, or =)', answer: '>' },
        { a: 999, b: 100, prompt: 'Which is greater: 999 or 100?', answer: '999' },
        { a: 450, b: 450, prompt: 'Compare: 450 ___ 450 (>, <, or =)', answer: '=' },
        { a: 367, b: 376, prompt: 'Compare: 367 ___ 376 (>, <, or =)', answer: '<' },
        { a: 741, b: 714, prompt: 'Compare: 741 ___ 714 (>, <, or =)', answer: '>' },
        { a: 208, b: 280, prompt: 'Which is less: 208 or 280?', answer: '208' },
        { a: 630, b: 603, prompt: 'Compare: 630 ___ 603 (>, <, or =)', answer: '>' },
        { a: 515, b: 551, prompt: 'Compare: 515 ___ 551 (>, <, or =)', answer: '<' },
        { a: 888, b: 888, prompt: 'Compare: 888 ___ 888 (>, <, or =)', answer: '=' },
        { a: 199, b: 200, prompt: 'Compare: 199 ___ 200 (>, <, or =)', answer: '<' },
      ],
    },
    'estimating-sums': {
      problems: [
        { a: 28, b: 31, prompt: 'Estimate: 28 + 31 is about ___', answer: 60, hint: 'Round each to the nearest 10 first.' },
        { a: 47, b: 22, prompt: 'Estimate: 47 + 22 is about ___', answer: 70, hint: 'Round each to the nearest 10 first.' },
        { a: 53, b: 38, prompt: 'Estimate: 53 + 38 is about ___', answer: 90, hint: 'Round each to the nearest 10 first.' },
        { a: 15, b: 24, prompt: 'Estimate: 15 + 24 is about ___', answer: 40, hint: 'Round each to the nearest 10 first.' },
        { a: 61, b: 19, prompt: 'Estimate: 61 + 19 is about ___', answer: 80, hint: 'Round each to the nearest 10 first.' },
        { a: 72, b: 18, prompt: 'Estimate: 72 + 18 is about ___', answer: 90, hint: 'Round each to the nearest 10 first.' },
        { a: 34, b: 45, prompt: 'Estimate: 34 + 45 is about ___', answer: 80, hint: 'Round each to the nearest 10 first.' },
        { a: 86, b: 13, prompt: 'Estimate: 86 + 13 is about ___', answer: 100, hint: 'Round each to the nearest 10 first.' },
        { a: 42, b: 37, prompt: 'Estimate: 42 + 37 is about ___', answer: 80, hint: 'Round each to the nearest 10 first.' },
        { a: 25, b: 55, prompt: 'Estimate: 25 + 55 is about ___', answer: 80, hint: 'Round each to the nearest 10 first.' },
        { a: 68, b: 21, prompt: 'Estimate: 68 + 21 is about ___', answer: 90, hint: 'Round each to the nearest 10 first.' },
        { a: 11, b: 49, prompt: 'Estimate: 11 + 49 is about ___', answer: 60, hint: 'Round each to the nearest 10 first.' },
        { a: 77, b: 14, prompt: 'Estimate: 77 + 14 is about ___', answer: 90, hint: 'Round each to the nearest 10 first.' },
        { a: 33, b: 56, prompt: 'Estimate: 33 + 56 is about ___', answer: 90, hint: 'Round each to the nearest 10 first.' },
        { a: 44, b: 44, prompt: 'Estimate: 44 + 44 is about ___', answer: 80, hint: 'Round each to the nearest 10 first.' },
        { a: 91, b: 8, prompt: 'Estimate: 91 + 8 is about ___', answer: 100, hint: 'Round each to the nearest 10 first.' },
        { a: 36, b: 63, prompt: 'Estimate: 36 + 63 is about ___', answer: 100, hint: 'Round each to the nearest 10 first.' },
        { a: 19, b: 71, prompt: 'Estimate: 19 + 71 is about ___', answer: 90, hint: 'Round each to the nearest 10 first.' },
        { a: 58, b: 32, prompt: 'Estimate: 58 + 32 is about ___', answer: 90, hint: 'Round each to the nearest 10 first.' },
        { a: 85, b: 5, prompt: 'Estimate: 85 + 5 is about ___', answer: 90, hint: 'Round each to the nearest 10 first.' },
      ],
    },
  },
  'grade-3': {
    'four-digit-numbers': {
      problems: [
        { number: 2345, prompt: 'What digit is in the thousands place of 2,345?', answer: 2, place: 'thousands' },
        { number: 2345, prompt: 'What is the value of the 3 in 2,345?', answer: 300, place: 'value' },
        { number: 5678, prompt: 'What digit is in the hundreds place of 5,678?', answer: 6, place: 'hundreds' },
        { number: 1029, prompt: 'What digit is in the tens place of 1,029?', answer: 2, place: 'tens' },
        { number: 7890, prompt: 'What is the value of the 7 in 7,890?', answer: 7000, place: 'value' },
        { number: 4501, prompt: 'What digit is in the ones place of 4,501?', answer: 1, place: 'ones' },
        { number: 3256, prompt: '3 thousands, 2 hundreds, 5 tens, 6 ones = ___', answer: 3256, place: 'compose' },
        { number: 8040, prompt: '8 thousands, 0 hundreds, 4 tens, 0 ones = ___', answer: 8040, place: 'compose' },
        { number: 6100, prompt: '6 thousands, 1 hundred, 0 tens, 0 ones = ___', answer: 6100, place: 'compose' },
        { number: 9999, prompt: 'What is the value of the 9 in the hundreds place of 9,999?', answer: 900, place: 'value' },
        { number: 1234, prompt: 'Write 1,234 in expanded form.', answer: '1000 + 200 + 30 + 4' },
        { number: 5007, prompt: 'Write 5,007 in expanded form.', answer: '5000 + 7' },
        { number: 3450, prompt: 'Write 3,450 in expanded form.', answer: '3000 + 400 + 50' },
        { number: 2810, prompt: 'What digit is in the thousands place of 2,810?', answer: 2, place: 'thousands' },
        { number: 6543, prompt: 'What is the value of the 5 in 6,543?', answer: 500, place: 'value' },
        { number: 4000, prompt: '4 thousands = ___', answer: 4000, place: 'compose' },
        { number: 7362, prompt: 'What digit is in the tens place of 7,362?', answer: 6, place: 'tens' },
        { number: 1590, prompt: 'What is the value of the 1 in 1,590?', answer: 1000, place: 'value' },
        { number: 8205, prompt: 'Write 8,205 in expanded form.', answer: '8000 + 200 + 5' },
        { number: 9871, prompt: 'What digit is in the hundreds place of 9,871?', answer: 8, place: 'hundreds' },
      ],
    },
    'rounding-to-10': {
      problems: [
        { number: 23, prompt: 'Round 23 to the nearest 10.', answer: 20 },
        { number: 67, prompt: 'Round 67 to the nearest 10.', answer: 70 },
        { number: 45, prompt: 'Round 45 to the nearest 10.', answer: 50 },
        { number: 82, prompt: 'Round 82 to the nearest 10.', answer: 80 },
        { number: 38, prompt: 'Round 38 to the nearest 10.', answer: 40 },
        { number: 54, prompt: 'Round 54 to the nearest 10.', answer: 50 },
        { number: 91, prompt: 'Round 91 to the nearest 10.', answer: 90 },
        { number: 15, prompt: 'Round 15 to the nearest 10.', answer: 20 },
        { number: 76, prompt: 'Round 76 to the nearest 10.', answer: 80 },
        { number: 29, prompt: 'Round 29 to the nearest 10.', answer: 30 },
        { number: 135, prompt: 'Round 135 to the nearest 10.', answer: 140 },
        { number: 248, prompt: 'Round 248 to the nearest 10.', answer: 250 },
        { number: 372, prompt: 'Round 372 to the nearest 10.', answer: 370 },
        { number: 505, prompt: 'Round 505 to the nearest 10.', answer: 510 },
        { number: 694, prompt: 'Round 694 to the nearest 10.', answer: 690 },
        { number: 55, prompt: 'Round 55 to the nearest 10.', answer: 60 },
        { number: 11, prompt: 'Round 11 to the nearest 10.', answer: 10 },
        { number: 99, prompt: 'Round 99 to the nearest 10.', answer: 100 },
        { number: 444, prompt: 'Round 444 to the nearest 10.', answer: 440 },
        { number: 867, prompt: 'Round 867 to the nearest 10.', answer: 870 },
      ],
    },
    'rounding-to-100': {
      problems: [
        { number: 230, prompt: 'Round 230 to the nearest 100.', answer: 200 },
        { number: 670, prompt: 'Round 670 to the nearest 100.', answer: 700 },
        { number: 450, prompt: 'Round 450 to the nearest 100.', answer: 500 },
        { number: 820, prompt: 'Round 820 to the nearest 100.', answer: 800 },
        { number: 380, prompt: 'Round 380 to the nearest 100.', answer: 400 },
        { number: 149, prompt: 'Round 149 to the nearest 100.', answer: 100 },
        { number: 551, prompt: 'Round 551 to the nearest 100.', answer: 600 },
        { number: 750, prompt: 'Round 750 to the nearest 100.', answer: 800 },
        { number: 915, prompt: 'Round 915 to the nearest 100.', answer: 900 },
        { number: 285, prompt: 'Round 285 to the nearest 100.', answer: 300 },
        { number: 1234, prompt: 'Round 1,234 to the nearest 100.', answer: 1200 },
        { number: 3678, prompt: 'Round 3,678 to the nearest 100.', answer: 3700 },
        { number: 5050, prompt: 'Round 5,050 to the nearest 100.', answer: 5100 },
        { number: 2490, prompt: 'Round 2,490 to the nearest 100.', answer: 2500 },
        { number: 8150, prompt: 'Round 8,150 to the nearest 100.', answer: 8200 },
        { number: 350, prompt: 'Round 350 to the nearest 100.', answer: 400 },
        { number: 99, prompt: 'Round 99 to the nearest 100.', answer: 100 },
        { number: 501, prompt: 'Round 501 to the nearest 100.', answer: 500 },
        { number: 4444, prompt: 'Round 4,444 to the nearest 100.', answer: 4400 },
        { number: 7865, prompt: 'Round 7,865 to the nearest 100.', answer: 7900 },
      ],
    },
    'even-odd': {
      problems: [
        { number: 4, prompt: 'Is 4 even or odd?', answer: 'even' },
        { number: 7, prompt: 'Is 7 even or odd?', answer: 'odd' },
        { number: 12, prompt: 'Is 12 even or odd?', answer: 'even' },
        { number: 15, prompt: 'Is 15 even or odd?', answer: 'odd' },
        { number: 20, prompt: 'Is 20 even or odd?', answer: 'even' },
        { number: 33, prompt: 'Is 33 even or odd?', answer: 'odd' },
        { number: 48, prompt: 'Is 48 even or odd?', answer: 'even' },
        { number: 51, prompt: 'Is 51 even or odd?', answer: 'odd' },
        { number: 66, prompt: 'Is 66 even or odd?', answer: 'even' },
        { number: 79, prompt: 'Is 79 even or odd?', answer: 'odd' },
        { number: 100, prompt: 'Is 100 even or odd?', answer: 'even' },
        { number: 0, prompt: 'Is 0 even or odd?', answer: 'even' },
        { number: 1, prompt: 'Is 1 even or odd?', answer: 'odd' },
        { number: 234, prompt: 'Is 234 even or odd?', answer: 'even' },
        { number: 567, prompt: 'Is 567 even or odd?', answer: 'odd' },
        { number: 88, prompt: 'Is 88 even or odd?', answer: 'even' },
        { number: 91, prompt: 'Is 91 even or odd?', answer: 'odd' },
        { number: 2, prompt: 'Is 2 even or odd?', answer: 'even' },
        { number: 999, prompt: 'Is 999 even or odd?', answer: 'odd' },
        { number: 146, prompt: 'Is 146 even or odd?', answer: 'even' },
      ],
    },
    'fractions-number-line': {
      problems: [
        { prompt: 'Where is 1/2 on a number line from 0 to 1? (as a decimal)', answer: '0.5', fraction: '1/2' },
        { prompt: 'Where is 1/4 on a number line from 0 to 1? (as a decimal)', answer: '0.25', fraction: '1/4' },
        { prompt: 'Where is 3/4 on a number line from 0 to 1? (as a decimal)', answer: '0.75', fraction: '3/4' },
        { prompt: 'Which is greater: 1/2 or 1/4?', answer: '1/2' },
        { prompt: 'Which is greater: 3/4 or 1/2?', answer: '3/4' },
        { prompt: 'Which is less: 1/3 or 1/2?', answer: '1/3' },
        { prompt: 'What fraction is shown? The point is halfway between 0 and 1.', answer: '1/2' },
        { prompt: 'A pizza is cut into 4 slices. You eat 1 slice. What fraction did you eat?', answer: '1/4' },
        { prompt: 'A candy bar is split into 3 equal parts. You eat 2 parts. What fraction?', answer: '2/3' },
        { prompt: 'Which is greater: 2/3 or 1/3?', answer: '2/3' },
        { prompt: 'Which is less: 1/4 or 3/4?', answer: '1/4' },
        { prompt: 'A pie is cut into 8 slices. You eat 4. What fraction did you eat?', answer: '4/8' },
        { prompt: 'Is 1/2 the same as 2/4? (yes/no)', answer: 'yes' },
        { prompt: 'Which is greater: 1/2 or 1/3?', answer: '1/2' },
        { prompt: 'A rope is cut into 2 equal pieces. Each piece is what fraction?', answer: '1/2' },
        { prompt: 'Which is less: 2/4 or 3/4?', answer: '2/4' },
        { prompt: 'What fraction is 3 out of 4 equal parts?', answer: '3/4' },
        { prompt: 'Which is greater: 2/3 or 3/4?', answer: '3/4' },
        { prompt: 'A cake has 6 slices. 3 are eaten. What fraction remains?', answer: '3/6' },
        { prompt: 'Is 2/4 the same as 1/2? (yes/no)', answer: 'yes' },
      ],
    },
  },
  'grade-4': {
    'multi-digit-millions': {
      problems: [
        { number: 45678, prompt: 'What digit is in the ten-thousands place of 45,678?', answer: 4 },
        { number: 123456, prompt: 'What digit is in the hundred-thousands place of 123,456?', answer: 1 },
        { number: 789012, prompt: 'What is the value of the 7 in 789,012?', answer: 700000 },
        { number: 345678, prompt: 'What digit is in the thousands place of 345,678?', answer: 5 },
        { number: 1000000, prompt: 'How many zeros in one million?', answer: 6 },
        { number: 5432100, prompt: 'What digit is in the millions place of 5,432,100?', answer: 5 },
        { number: 2500000, prompt: 'What is the value of the 5 in 2,500,000?', answer: 500000 },
        { number: 67890, prompt: 'Write 67,890 in expanded form.', answer: '60000 + 7000 + 800 + 90' },
        { number: 100000, prompt: 'What is 100 thousands equal to?', answer: 100000 },
        { number: 3050000, prompt: 'What digit is in the ten-thousands place of 3,050,000?', answer: 5 },
        { number: 999999, prompt: 'What comes after 999,999?', answer: 1000000 },
        { number: 250000, prompt: 'How many thousands in 250,000?', answer: 250 },
        { number: 4000000, prompt: 'Write 4,000,000 in words.', answer: 'four million' },
        { number: 1500000, prompt: 'What is the value of the 1 in 1,500,000?', answer: 1000000 },
        { number: 876543, prompt: 'What digit is in the tens place of 876,543?', answer: 4 },
        { number: 300400, prompt: 'What digit is in the hundreds place of 300,400?', answer: 4 },
        { number: 9000000, prompt: 'What is 9 millions equal to?', answer: 9000000 },
        { number: 50000, prompt: 'What digit is in the ten-thousands place of 50,000?', answer: 5 },
        { number: 2345678, prompt: 'What is the value of the 3 in 2,345,678?', answer: 300000 },
        { number: 7100000, prompt: 'What digit is in the hundred-thousands place of 7,100,000?', answer: 1 },
      ],
    },
    'rounding-any-place': {
      problems: [
        { number: 4567, prompt: 'Round 4,567 to the nearest thousand.', answer: 5000, place: 'thousand' },
        { number: 12345, prompt: 'Round 12,345 to the nearest ten-thousand.', answer: 10000, place: 'ten-thousand' },
        { number: 67890, prompt: 'Round 67,890 to the nearest thousand.', answer: 68000, place: 'thousand' },
        { number: 345678, prompt: 'Round 345,678 to the nearest hundred-thousand.', answer: 300000, place: 'hundred-thousand' },
        { number: 2345, prompt: 'Round 2,345 to the nearest hundred.', answer: 2300, place: 'hundred' },
        { number: 8765, prompt: 'Round 8,765 to the nearest thousand.', answer: 9000, place: 'thousand' },
        { number: 54321, prompt: 'Round 54,321 to the nearest ten-thousand.', answer: 50000, place: 'ten-thousand' },
        { number: 1500, prompt: 'Round 1,500 to the nearest thousand.', answer: 2000, place: 'thousand' },
        { number: 99500, prompt: 'Round 99,500 to the nearest thousand.', answer: 100000, place: 'thousand' },
        { number: 450000, prompt: 'Round 450,000 to the nearest hundred-thousand.', answer: 500000, place: 'hundred-thousand' },
        { number: 3456, prompt: 'Round 3,456 to the nearest ten.', answer: 3460, place: 'ten' },
        { number: 7890, prompt: 'Round 7,890 to the nearest hundred.', answer: 7900, place: 'hundred' },
        { number: 23456, prompt: 'Round 23,456 to the nearest thousand.', answer: 23000, place: 'thousand' },
        { number: 150000, prompt: 'Round 150,000 to the nearest hundred-thousand.', answer: 200000, place: 'hundred-thousand' },
        { number: 6789, prompt: 'Round 6,789 to the nearest hundred.', answer: 6800, place: 'hundred' },
        { number: 45000, prompt: 'Round 45,000 to the nearest ten-thousand.', answer: 50000, place: 'ten-thousand' },
        { number: 5555, prompt: 'Round 5,555 to the nearest thousand.', answer: 6000, place: 'thousand' },
        { number: 2849, prompt: 'Round 2,849 to the nearest hundred.', answer: 2800, place: 'hundred' },
        { number: 73500, prompt: 'Round 73,500 to the nearest thousand.', answer: 74000, place: 'thousand' },
        { number: 999, prompt: 'Round 999 to the nearest thousand.', answer: 1000, place: 'thousand' },
      ],
    },
    'factors-multiples': {
      problems: [
        { prompt: 'List all factors of 12.', answer: '1, 2, 3, 4, 6, 12', number: 12, type: 'factors' },
        { prompt: 'List all factors of 18.', answer: '1, 2, 3, 6, 9, 18', number: 18, type: 'factors' },
        { prompt: 'Is 3 a factor of 15? (yes/no)', answer: 'yes', type: 'factor-check' },
        { prompt: 'Is 4 a factor of 18? (yes/no)', answer: 'no', type: 'factor-check' },
        { prompt: 'What are the first 5 multiples of 3?', answer: '3, 6, 9, 12, 15', type: 'multiples' },
        { prompt: 'What are the first 5 multiples of 7?', answer: '7, 14, 21, 28, 35', type: 'multiples' },
        { prompt: 'Is 24 a multiple of 6? (yes/no)', answer: 'yes', type: 'multiple-check' },
        { prompt: 'Is 25 a multiple of 4? (yes/no)', answer: 'no', type: 'multiple-check' },
        { prompt: 'List all factors of 24.', answer: '1, 2, 3, 4, 6, 8, 12, 24', number: 24, type: 'factors' },
        { prompt: 'What are the first 5 multiples of 9?', answer: '9, 18, 27, 36, 45', type: 'multiples' },
        { prompt: 'Is 7 a factor of 28? (yes/no)', answer: 'yes', type: 'factor-check' },
        { prompt: 'Is 5 a factor of 32? (yes/no)', answer: 'no', type: 'factor-check' },
        { prompt: 'List all factors of 20.', answer: '1, 2, 4, 5, 10, 20', number: 20, type: 'factors' },
        { prompt: 'What are the first 5 multiples of 4?', answer: '4, 8, 12, 16, 20', type: 'multiples' },
        { prompt: 'Is 36 a multiple of 9? (yes/no)', answer: 'yes', type: 'multiple-check' },
        { prompt: 'Is 30 a multiple of 7? (yes/no)', answer: 'no', type: 'multiple-check' },
        { prompt: 'List all factors of 16.', answer: '1, 2, 4, 8, 16', number: 16, type: 'factors' },
        { prompt: 'What are the first 5 multiples of 6?', answer: '6, 12, 18, 24, 30', type: 'multiples' },
        { prompt: 'Is 8 a factor of 48? (yes/no)', answer: 'yes', type: 'factor-check' },
        { prompt: 'List all factors of 36.', answer: '1, 2, 3, 4, 6, 9, 12, 18, 36', number: 36, type: 'factors' },
      ],
    },
    'prime-composite': {
      problems: [
        { number: 2, prompt: 'Is 2 prime or composite?', answer: 'prime' },
        { number: 4, prompt: 'Is 4 prime or composite?', answer: 'composite' },
        { number: 7, prompt: 'Is 7 prime or composite?', answer: 'prime' },
        { number: 9, prompt: 'Is 9 prime or composite?', answer: 'composite' },
        { number: 11, prompt: 'Is 11 prime or composite?', answer: 'prime' },
        { number: 13, prompt: 'Is 13 prime or composite?', answer: 'prime' },
        { number: 15, prompt: 'Is 15 prime or composite?', answer: 'composite' },
        { number: 17, prompt: 'Is 17 prime or composite?', answer: 'prime' },
        { number: 19, prompt: 'Is 19 prime or composite?', answer: 'prime' },
        { number: 21, prompt: 'Is 21 prime or composite?', answer: 'composite' },
        { number: 23, prompt: 'Is 23 prime or composite?', answer: 'prime' },
        { number: 25, prompt: 'Is 25 prime or composite?', answer: 'composite' },
        { number: 29, prompt: 'Is 29 prime or composite?', answer: 'prime' },
        { number: 31, prompt: 'Is 31 prime or composite?', answer: 'prime' },
        { number: 33, prompt: 'Is 33 prime or composite?', answer: 'composite' },
        { number: 37, prompt: 'Is 37 prime or composite?', answer: 'prime' },
        { number: 40, prompt: 'Is 40 prime or composite?', answer: 'composite' },
        { number: 1, prompt: 'Is 1 prime or composite?', answer: 'neither' },
        { number: 47, prompt: 'Is 47 prime or composite?', answer: 'prime' },
        { number: 50, prompt: 'Is 50 prime or composite?', answer: 'composite' },
      ],
    },
  },
  'grade-5': {
    'decimal-place-value': {
      problems: [
        { number: 3.45, prompt: 'What digit is in the tenths place of 3.45?', answer: 4 },
        { number: 3.45, prompt: 'What digit is in the hundredths place of 3.45?', answer: 5 },
        { number: 12.678, prompt: 'What digit is in the tenths place of 12.678?', answer: 6 },
        { number: 12.678, prompt: 'What digit is in the hundredths place of 12.678?', answer: 7 },
        { number: 12.678, prompt: 'What digit is in the thousandths place of 12.678?', answer: 8 },
        { number: 0.5, prompt: 'What is the value of the 5 in 0.5?', answer: '0.5' },
        { number: 0.07, prompt: 'What is the value of the 7 in 0.07?', answer: '0.07' },
        { number: 4.321, prompt: 'What digit is in the tenths place of 4.321?', answer: 3 },
        { number: 4.321, prompt: 'What is the value of the 2 in 4.321?', answer: '0.02' },
        { number: 8.06, prompt: 'What digit is in the tenths place of 8.06?', answer: 0 },
        { number: 8.06, prompt: 'What digit is in the hundredths place of 8.06?', answer: 6 },
        { number: 15.904, prompt: 'What digit is in the thousandths place of 15.904?', answer: 4 },
        { number: 0.123, prompt: 'Write 0.123 in expanded form.', answer: '0.1 + 0.02 + 0.003' },
        { number: 2.56, prompt: 'Write 2.56 in expanded form.', answer: '2 + 0.5 + 0.06' },
        { number: 7.008, prompt: 'What is the value of the 8 in 7.008?', answer: '0.008' },
        { number: 0.9, prompt: 'What digit is in the tenths place of 0.9?', answer: 9 },
        { number: 6.25, prompt: 'Write 6.25 as a fraction.', answer: '6 1/4' },
        { number: 3.5, prompt: 'Write 3.5 as a fraction.', answer: '3 1/2' },
        { number: 0.001, prompt: 'What place is the 1 in: 0.001?', answer: 'thousandths' },
        { number: 45.67, prompt: 'What is the value of the 6 in 45.67?', answer: '0.6' },
      ],
    },
    'powers-of-10': {
      problems: [
        { prompt: '10^1 = ___', answer: 10, exponent: 1 },
        { prompt: '10^2 = ___', answer: 100, exponent: 2 },
        { prompt: '10^3 = ___', answer: 1000, exponent: 3 },
        { prompt: '10^4 = ___', answer: 10000, exponent: 4 },
        { prompt: '10^5 = ___', answer: 100000, exponent: 5 },
        { prompt: '10^6 = ___', answer: 1000000, exponent: 6 },
        { prompt: '3.5 x 10 = ___', answer: 35 },
        { prompt: '3.5 x 100 = ___', answer: 350 },
        { prompt: '3.5 x 1000 = ___', answer: 3500 },
        { prompt: '0.45 x 10 = ___', answer: 4.5 },
        { prompt: '0.45 x 100 = ___', answer: 45 },
        { prompt: '67 ÷ 10 = ___', answer: 6.7 },
        { prompt: '67 ÷ 100 = ___', answer: 0.67 },
        { prompt: '890 ÷ 10 = ___', answer: 89 },
        { prompt: '890 ÷ 100 = ___', answer: 8.9 },
        { prompt: '2.1 x 10 = ___', answer: 21 },
        { prompt: '0.003 x 1000 = ___', answer: 3 },
        { prompt: '5400 ÷ 1000 = ___', answer: 5.4 },
        { prompt: '10^0 = ___', answer: 1, exponent: 0 },
        { prompt: '7.89 x 100 = ___', answer: 789 },
      ],
    },
    'comparing-decimals': {
      problems: [
        { a: 0.5, b: 0.50, prompt: 'Compare: 0.5 ___ 0.50 (>, <, or =)', answer: '=' },
        { a: 0.3, b: 0.7, prompt: 'Compare: 0.3 ___ 0.7 (>, <, or =)', answer: '<' },
        { a: 1.25, b: 1.3, prompt: 'Compare: 1.25 ___ 1.3 (>, <, or =)', answer: '<' },
        { a: 3.45, b: 3.42, prompt: 'Compare: 3.45 ___ 3.42 (>, <, or =)', answer: '>' },
        { a: 0.100, b: 0.1, prompt: 'Compare: 0.100 ___ 0.1 (>, <, or =)', answer: '=' },
        { a: 2.5, b: 2.05, prompt: 'Compare: 2.5 ___ 2.05 (>, <, or =)', answer: '>' },
        { a: 0.09, b: 0.9, prompt: 'Compare: 0.09 ___ 0.9 (>, <, or =)', answer: '<' },
        { a: 4.56, b: 4.560, prompt: 'Compare: 4.56 ___ 4.560 (>, <, or =)', answer: '=' },
        { a: 7.8, b: 7.08, prompt: 'Compare: 7.8 ___ 7.08 (>, <, or =)', answer: '>' },
        { a: 0.25, b: 0.3, prompt: 'Which is greater: 0.25 or 0.3?', answer: '0.3' },
        { a: 1.05, b: 1.50, prompt: 'Which is less: 1.05 or 1.50?', answer: '1.05' },
        { a: 6.7, b: 6.70, prompt: 'Compare: 6.7 ___ 6.70 (>, <, or =)', answer: '=' },
        { a: 0.456, b: 0.465, prompt: 'Compare: 0.456 ___ 0.465 (>, <, or =)', answer: '<' },
        { a: 3.9, b: 3.89, prompt: 'Compare: 3.9 ___ 3.89 (>, <, or =)', answer: '>' },
        { a: 5.01, b: 5.1, prompt: 'Compare: 5.01 ___ 5.1 (>, <, or =)', answer: '<' },
        { a: 0.99, b: 1.0, prompt: 'Compare: 0.99 ___ 1.0 (>, <, or =)', answer: '<' },
        { a: 8.200, b: 8.2, prompt: 'Compare: 8.200 ___ 8.2 (>, <, or =)', answer: '=' },
        { a: 0.15, b: 0.105, prompt: 'Compare: 0.15 ___ 0.105 (>, <, or =)', answer: '>' },
        { a: 2.34, b: 2.340, prompt: 'Compare: 2.34 ___ 2.340 (>, <, or =)', answer: '=' },
        { a: 0.6, b: 0.06, prompt: 'Which is greater: 0.6 or 0.06?', answer: '0.6' },
      ],
    },
    'rounding-decimals': {
      problems: [
        { number: 3.456, prompt: 'Round 3.456 to the nearest tenth.', answer: 3.5 },
        { number: 3.456, prompt: 'Round 3.456 to the nearest hundredth.', answer: 3.46 },
        { number: 7.891, prompt: 'Round 7.891 to the nearest tenth.', answer: 7.9 },
        { number: 7.891, prompt: 'Round 7.891 to the nearest hundredth.', answer: 7.89 },
        { number: 12.345, prompt: 'Round 12.345 to the nearest whole number.', answer: 12 },
        { number: 12.345, prompt: 'Round 12.345 to the nearest tenth.', answer: 12.3 },
        { number: 0.678, prompt: 'Round 0.678 to the nearest tenth.', answer: 0.7 },
        { number: 0.678, prompt: 'Round 0.678 to the nearest hundredth.', answer: 0.68 },
        { number: 5.555, prompt: 'Round 5.555 to the nearest tenth.', answer: 5.6 },
        { number: 5.555, prompt: 'Round 5.555 to the nearest hundredth.', answer: 5.56 },
        { number: 9.999, prompt: 'Round 9.999 to the nearest tenth.', answer: 10.0 },
        { number: 9.999, prompt: 'Round 9.999 to the nearest hundredth.', answer: 10.00 },
        { number: 2.150, prompt: 'Round 2.150 to the nearest tenth.', answer: 2.2 },
        { number: 4.444, prompt: 'Round 4.444 to the nearest whole number.', answer: 4 },
        { number: 8.065, prompt: 'Round 8.065 to the nearest tenth.', answer: 8.1 },
        { number: 8.065, prompt: 'Round 8.065 to the nearest hundredth.', answer: 8.07 },
        { number: 1.005, prompt: 'Round 1.005 to the nearest hundredth.', answer: 1.01 },
        { number: 6.749, prompt: 'Round 6.749 to the nearest tenth.', answer: 6.7 },
        { number: 3.95, prompt: 'Round 3.95 to the nearest whole number.', answer: 4 },
        { number: 0.125, prompt: 'Round 0.125 to the nearest hundredth.', answer: 0.13 },
      ],
    },
  },
  'grade-6': {
    'negative-numbers': {
      problems: [
        { prompt: 'Which is greater: -3 or -7?', answer: '-3' },
        { prompt: 'Which is greater: -1 or 0?', answer: '0' },
        { prompt: 'Which is less: -5 or 2?', answer: '-5' },
        { prompt: 'Order from least to greatest: 3, -1, 0, -4', answer: '-4, -1, 0, 3' },
        { prompt: 'Order from least to greatest: -2, 5, -8, 1', answer: '-8, -2, 1, 5' },
        { prompt: 'What is 5 degrees below zero?', answer: -5 },
        { prompt: 'What is 10 degrees below zero?', answer: -10 },
        { prompt: 'Which is greater: -12 or -2?', answer: '-2' },
        { prompt: 'Which is less: -6 or -9?', answer: '-9' },
        { prompt: 'Compare: -3 ___ -3 (>, <, or =)', answer: '=' },
        { prompt: 'Is -4 to the left or right of -1 on a number line?', answer: 'left' },
        { prompt: 'Is 0 positive, negative, or neither?', answer: 'neither' },
        { prompt: 'Compare: -8 ___ -5 (>, <, or =)', answer: '<' },
        { prompt: 'Compare: -1 ___ 1 (>, <, or =)', answer: '<' },
        { prompt: 'Which is greater: -100 or -1?', answer: '-1' },
        { prompt: 'A submarine is at -200 feet. A fish is at -50 feet. Which is deeper?', answer: 'submarine' },
        { prompt: 'The temperature was -3°C. It dropped 5 degrees. What is it now?', answer: -8 },
        { prompt: 'Order from least to greatest: 0, -5, 5, -10', answer: '-10, -5, 0, 5' },
        { prompt: 'Compare: -15 ___ -20 (>, <, or =)', answer: '>' },
        { prompt: 'Which is closer to 0: -7 or -2?', answer: '-2' },
      ],
    },
    'absolute-value': {
      problems: [
        { prompt: 'What is |5|?', answer: 5 },
        { prompt: 'What is |-5|?', answer: 5 },
        { prompt: 'What is |0|?', answer: 0 },
        { prompt: 'What is |-12|?', answer: 12 },
        { prompt: 'What is |7|?', answer: 7 },
        { prompt: 'What is |-100|?', answer: 100 },
        { prompt: 'Which has a greater absolute value: -8 or 6?', answer: '-8' },
        { prompt: 'Which has a greater absolute value: -3 or 5?', answer: '5' },
        { prompt: 'What is |-1|?', answer: 1 },
        { prompt: 'Is |4| = |-4|? (yes/no)', answer: 'yes' },
        { prompt: 'What is |23|?', answer: 23 },
        { prompt: 'What is |-23|?', answer: 23 },
        { prompt: 'Which has a greater absolute value: -15 or 10?', answer: '-15' },
        { prompt: 'What is |-0.5|?', answer: 0.5 },
        { prompt: 'True or false: Absolute value is always positive or zero.', answer: 'true' },
        { prompt: 'What is |42|?', answer: 42 },
        { prompt: 'What is |-99|?', answer: 99 },
        { prompt: 'Which has a smaller absolute value: -4 or -7?', answer: '-4' },
        { prompt: 'What is |-2.5|?', answer: 2.5 },
        { prompt: 'If |x| = 6, what are the possible values of x?', answer: '6, -6' },
      ],
    },
    'rational-numbers': {
      problems: [
        { prompt: 'Is 3/4 a rational number? (yes/no)', answer: 'yes' },
        { prompt: 'Convert 3/4 to a decimal.', answer: '0.75' },
        { prompt: 'Convert 1/2 to a decimal.', answer: '0.5' },
        { prompt: 'Convert 0.25 to a fraction.', answer: '1/4' },
        { prompt: 'Convert 0.1 to a fraction.', answer: '1/10' },
        { prompt: 'Is -2/3 a rational number? (yes/no)', answer: 'yes' },
        { prompt: 'Convert 1/3 to a decimal (round to hundredths).', answer: '0.33' },
        { prompt: 'Convert 2/5 to a decimal.', answer: '0.4' },
        { prompt: 'Convert 0.75 to a fraction.', answer: '3/4' },
        { prompt: 'Which is greater: 2/3 or 3/5?', answer: '2/3' },
        { prompt: 'Convert 7/8 to a decimal.', answer: '0.875' },
        { prompt: 'Convert 0.6 to a fraction.', answer: '3/5' },
        { prompt: 'Which is greater: 0.5 or 1/3?', answer: '0.5' },
        { prompt: 'Convert 1/5 to a decimal.', answer: '0.2' },
        { prompt: 'Convert 0.125 to a fraction.', answer: '1/8' },
        { prompt: 'Is 0 a rational number? (yes/no)', answer: 'yes' },
        { prompt: 'Which is greater: -1/2 or -1/4?', answer: '-1/4' },
        { prompt: 'Convert 3/8 to a decimal.', answer: '0.375' },
        { prompt: 'Convert 0.2 to a fraction.', answer: '1/5' },
        { prompt: 'Is every integer a rational number? (yes/no)', answer: 'yes' },
      ],
    },
    'coordinate-plane': {
      problems: [
        { prompt: 'What is the origin on a coordinate plane?', answer: '(0, 0)' },
        { prompt: 'In the point (3, 5), what is the x-coordinate?', answer: 3 },
        { prompt: 'In the point (3, 5), what is the y-coordinate?', answer: 5 },
        { prompt: 'In which quadrant is the point (2, 4)?', answer: 'I' },
        { prompt: 'In which quadrant is the point (-3, 5)?', answer: 'II' },
        { prompt: 'In which quadrant is the point (-2, -6)?', answer: 'III' },
        { prompt: 'In which quadrant is the point (4, -1)?', answer: 'IV' },
        { prompt: 'What are the coordinates of a point 3 right and 2 up from the origin?', answer: '(3, 2)' },
        { prompt: 'What are the coordinates of a point 4 left and 1 down from the origin?', answer: '(-4, -1)' },
        { prompt: 'A point is at (0, 5). Is it on the x-axis or y-axis?', answer: 'y-axis' },
        { prompt: 'A point is at (3, 0). Is it on the x-axis or y-axis?', answer: 'x-axis' },
        { prompt: 'What is the distance from (0,0) to (3,0)?', answer: 3 },
        { prompt: 'What is the distance from (0,0) to (0,7)?', answer: 7 },
        { prompt: 'If you move from (1,2) right 3, where are you?', answer: '(4, 2)' },
        { prompt: 'If you move from (5,3) down 4, where are you?', answer: '(5, -1)' },
        { prompt: 'In which quadrant is the point (-1, -1)?', answer: 'III' },
        { prompt: 'In the point (-4, 7), what is the x-coordinate?', answer: -4 },
        { prompt: 'A point is at (-2, 0). Is it on the x-axis or y-axis?', answer: 'x-axis' },
        { prompt: 'If you reflect (3, 2) over the x-axis, where is it?', answer: '(3, -2)' },
        { prompt: 'If you reflect (3, 2) over the y-axis, where is it?', answer: '(-3, 2)' },
      ],
    },
  },
};

const CONTEXT_TEXTS = {
  'kindergarten': [
    { title: 'Counting at the Farm', focus: 'counting, cardinality', text: 'There are 5 chickens in the yard. 3 cows are in the barn. Count them all! How many animals in total? Use your fingers to count: 1, 2, 3, 4, 5, 6, 7, 8.' },
    { title: 'Ten Frame Fun', focus: 'ten-frames, number bonds', text: 'Put 6 apples on a ten frame. How many empty spaces? 4! Because 6 + 4 = 10. Now try 7 apples. How many spaces left? 3! Because 7 + 3 = 10.' },
    { title: 'Building Numbers', focus: 'composing-decomposing', text: 'You have 8 blocks. Split them into two groups. You could make 5 and 3, or 4 and 4, or 6 and 2. There are many ways to break apart a number!' },
  ],
  'grade-1': [
    { title: 'Place Value Party', focus: 'place value, tens and ones', text: 'The number 34 has 3 tens and 4 ones. Think of it as 3 bundles of ten sticks and 4 loose sticks. 30 + 4 = 34. Every two-digit number is made of tens and ones!' },
    { title: 'Skip Counting Song', focus: 'skip counting', text: 'Count by 2s: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20! Count by 5s: 5, 10, 15, 20, 25, 30! Count by 10s: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100!' },
  ],
  'grade-2': [
    { title: 'Hundreds, Tens, and Ones', focus: 'three-digit place value', text: 'The number 456 is like 4 big flats (hundreds), 5 long rods (tens), and 6 small cubes (ones). 400 + 50 + 6 = 456. That is "four hundred fifty-six" in words.' },
    { title: 'Estimation Station', focus: 'estimating sums', text: 'To estimate 48 + 31, round each number to the nearest 10 first. 48 rounds to 50, and 31 rounds to 30. So 48 + 31 is about 50 + 30 = 80. The exact answer is 79, very close!' },
  ],
  'grade-3': [
    { title: 'Rounding Roller Coaster', focus: 'rounding', text: 'To round 367 to the nearest hundred, look at the tens digit: 6. Since 6 >= 5, round up to 400. To round 367 to the nearest ten, look at the ones digit: 7. Since 7 >= 5, round up to 370.' },
    { title: 'Fractions are Everywhere', focus: 'fractions on number line', text: 'A fraction shows part of a whole. 1/2 is one out of two equal parts. On a number line from 0 to 1, 1/2 is right in the middle. 1/4 is one quarter of the way.' },
  ],
  'grade-4': [
    { title: 'Millions and Beyond', focus: 'multi-digit numbers', text: 'Our number system keeps growing: ones, tens, hundreds, thousands, ten-thousands, hundred-thousands, millions! The number 2,345,678 has 2 millions, 3 hundred-thousands, 4 ten-thousands, 5 thousands, 6 hundreds, 7 tens, and 8 ones.' },
    { title: 'Factors and Multiples', focus: 'factors, multiples', text: 'Factors of 12 are numbers that divide evenly into 12: 1, 2, 3, 4, 6, 12. Multiples of 3 are: 3, 6, 9, 12, 15... A prime number has only 2 factors: 1 and itself. 7 is prime. 12 is composite.' },
  ],
  'grade-5': [
    { title: 'Decimal Detectives', focus: 'decimal place value', text: 'Decimals extend place value to the right of the decimal point: tenths, hundredths, thousandths. In 3.456, the 4 is in the tenths place (worth 0.4), the 5 is in the hundredths (worth 0.05), and the 6 is in the thousandths (worth 0.006).' },
    { title: 'Powers of 10', focus: 'powers of 10', text: 'Multiplying by 10 moves digits one place to the left: 3.5 x 10 = 35. Dividing by 10 moves digits one place to the right: 35 ÷ 10 = 3.5. Each power of 10 shifts by that many places!' },
  ],
  'grade-6': [
    { title: 'Below Zero', focus: 'negative numbers', text: 'Negative numbers are less than zero. On a number line, they go to the left. -5 is less than -2 because it is farther from zero. Temperature, elevation, and debt all use negative numbers.' },
    { title: 'The Coordinate Plane', focus: 'coordinate plane', text: 'A coordinate plane has an x-axis (horizontal) and y-axis (vertical). They cross at the origin (0,0). Points are written as (x, y). The four quadrants are: I (+,+), II (-,+), III (-,-), IV (+,-).' },
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

function resolveSkillKey(grade, skill) {
  const gs = SKILLS[grade];
  if (!gs) return null;
  for (const [cat, skills] of Object.entries(gs)) { if (skills.includes(skill)) return { grade, category: cat, skill }; }
  return null;
}

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 .\/(),+-]/g, ''); }

// Exercise generation — dispatch table for different problem types

function exResult(type, skill, grade, instruction, items) { return { type, skill, grade, count: items.length, instruction, items }; }

function generateExercise(grade, skill, count = 5) {
  const bank = PROBLEM_BANKS[grade]?.[skill];
  if (!bank) return { error: `No problem bank for ${grade}/${skill}` };

  if ((skill === 'counting-to-20' || skill === 'counting-to-100') && bank.sequences)
    return exResult('counting-sequence', skill, grade, 'Fill in the missing number in the counting sequence.',
      pick(bank.sequences, count).map(s => ({ prompt: s.prompt, answer: s.missing })));

  if (skill === 'cardinality' && bank.problems)
    return exResult('cardinality', skill, grade, 'Count the objects and tell how many there are.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.count })));

  if (skill === 'ten-frames' && bank.frames)
    return exResult('ten-frame', skill, grade, 'Answer the ten frame question.',
      pick(bank.frames, count).map(f => ({ prompt: f.prompt, answer: f.answer, filled: f.filled })));

  if (skill === 'number-bonds-to-10' && bank.bonds)
    return exResult('number-bond', skill, grade, 'Find the missing number that makes 10.',
      pick(bank.bonds, count).map(b => ({ prompt: b.prompt, answer: b.answer })));

  if (skill === 'composing-decomposing' && bank.problems)
    return exResult('compose-decompose', skill, grade, 'Find the missing number to compose or decompose.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer })));

  if (skill === 'place-value-tens-ones' && bank.problems)
    return exResult('place-value', skill, grade, 'Answer the place value question about tens and ones.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer, number: p.number })));

  if (skill === 'comparing-2-digit' && bank.problems)
    return exResult('comparison', skill, grade, 'Compare the two numbers using >, <, or =.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer })));

  if (skill === 'number-line-0-120' && bank.problems)
    return exResult('number-line', skill, grade, 'Find the missing number on the number line.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer })));

  if (skill === 'skip-counting-2-5-10' && bank.sequences)
    return exResult('skip-counting', skill, grade, 'Fill in the missing number in the skip counting pattern.',
      pick(bank.sequences, count).map(s => ({ prompt: s.prompt, answer: s.answer, countBy: s.by })));

  if (skill === 'three-digit-place-value' && bank.problems)
    return exResult('place-value', skill, grade, 'Answer the place value question about hundreds, tens, and ones.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer, number: p.number })));

  if (skill === 'expanded-form' && bank.problems)
    return exResult('expanded-form', skill, grade, 'Write the number in expanded form or find the number from expanded form.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer, number: p.number })));

  if (skill === 'word-form' && bank.problems)
    return exResult('word-form', skill, grade, 'Write the number in word form or find the number from words.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer, number: p.number })));

  if (skill === 'comparing-3-digit' && bank.problems)
    return exResult('comparison', skill, grade, 'Compare the three-digit numbers using >, <, or =.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer })));

  if (skill === 'estimating-sums' && bank.problems)
    return exResult('estimation', skill, grade, 'Estimate the sum by rounding each number to the nearest 10 first.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer, hint: p.hint })));

  if (skill === 'four-digit-numbers' && bank.problems)
    return exResult('place-value', skill, grade, 'Answer the place value question about four-digit numbers.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer })));

  if ((skill === 'rounding-to-10' || skill === 'rounding-to-100') && bank.problems)
    return exResult('rounding', skill, grade, `Round the number to the nearest ${skill === 'rounding-to-10' ? '10' : '100'}.`,
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer, number: p.number })));

  if (skill === 'even-odd' && bank.problems)
    return exResult('even-odd', skill, grade, 'Is the number even or odd?',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer, number: p.number })));

  if (skill === 'fractions-number-line' && bank.problems)
    return exResult('fractions', skill, grade, 'Answer the question about fractions.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer })));

  if (skill === 'multi-digit-millions' && bank.problems)
    return exResult('place-value', skill, grade, 'Answer the question about large numbers.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer })));

  if (skill === 'rounding-any-place' && bank.problems)
    return exResult('rounding', skill, grade, 'Round the number to the specified place.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer })));

  if (skill === 'factors-multiples' && bank.problems)
    return exResult('factors-multiples', skill, grade, 'Answer the question about factors or multiples.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer })));

  if (skill === 'prime-composite' && bank.problems)
    return exResult('prime-composite', skill, grade, 'Is the number prime or composite?',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer, number: p.number })));

  if (skill === 'decimal-place-value' && bank.problems)
    return exResult('place-value', skill, grade, 'Answer the question about decimal place value.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer })));

  if (skill === 'powers-of-10' && bank.problems)
    return exResult('powers-of-10', skill, grade, 'Calculate the result using powers of 10.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer })));

  if (skill === 'comparing-decimals' && bank.problems)
    return exResult('comparison', skill, grade, 'Compare the decimal numbers using >, <, or =.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer })));

  if (skill === 'rounding-decimals' && bank.problems)
    return exResult('rounding', skill, grade, 'Round the decimal to the specified place.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer, number: p.number })));

  if (skill === 'negative-numbers' && bank.problems)
    return exResult('negative-numbers', skill, grade, 'Answer the question about negative numbers.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer })));

  if (skill === 'absolute-value' && bank.problems)
    return exResult('absolute-value', skill, grade, 'Find the absolute value.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer })));

  if (skill === 'rational-numbers' && bank.problems)
    return exResult('rational-numbers', skill, grade, 'Answer the question about rational numbers.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer })));

  if (skill === 'coordinate-plane' && bank.problems)
    return exResult('coordinate-plane', skill, grade, 'Answer the question about the coordinate plane.',
      pick(bank.problems, count).map(p => ({ prompt: p.prompt, answer: p.answer })));

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  return norm(String(expected)) === norm(String(answer));
}

// Public API

class NumberSense {
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

  getContextText(grade) {
    const texts = CONTEXT_TEXTS[grade];
    if (!texts) return { error: `No context texts for ${grade}. Available: ${Object.keys(CONTEXT_TEXTS).join(', ')}` };
    return pick(texts, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const text = CONTEXT_TEXTS[grade] ? pick(CONTEXT_TEXTS[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, contextText: text,
      lessonPlan: {
        review: 'Review previously learned number concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: text ? `Read context scenario: "${text.title}"` : 'Practice with real-world number problems',
        extend: `Try 2-3 challenge problems using ${target.skill}`,
      },
    };
  }
}

module.exports = NumberSense;

// CLI: node number-sense.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const ns = new NumberSense();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) ns.setGrade(id, grade);
        out({ action: 'start', profile: ns.getProfile(id), nextSkills: ns.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(ns.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, type] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'kindergarten';
        if (type) { out(ns.generateExercise(grade, type, 5)); }
        else { const n = ns.getNextSkills(id, 1).next; out(n.length ? ns.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current grade!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(ns.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(ns.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(ns.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(ns.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(ns.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? ns.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(ns.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(ns.setGrade(id, g)); break; }
      default: out({ usage: 'node number-sense.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
