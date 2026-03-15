#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'belarusian-reading';

// ---------------------------------------------------------------------------
// Embedded reading texts by CEFR level
// ---------------------------------------------------------------------------

const TEXTS = {
  A1: [
    {
      id: 'a1-kaviarnia',
      title: 'У кавярні',
      type: 'dialogue',
      text:
        '— Добры дзень! Што жадаеце?\n' +
        '— Добры дзень. Мне каву з малаком, калі ласка.\n' +
        '— Вялікую ці маленькую?\n' +
        '— Вялікую. І яшчэ адну булку.\n' +
        '— Добра. Тры рублі пяцьдзесят.\n' +
        '— Вось, калі ласка. Дзякуй.\n' +
        '— Няма за што. Смачна есці!',
      vocabulary: [
        { word: 'жадаеце', definition: 'do you want (formal)', example: 'Што вы жадаеце замовіць?' },
        { word: 'булка', definition: 'bread roll / bun', example: 'Адна булка з маслам.' },
        { word: 'смачна есці', definition: 'enjoy your meal', example: 'Смачна есці!' },
      ],
      comprehensionQuestions: [
        { question: 'Што заказвае кліент?', options: ['Гарбату', 'Каву з малаком', 'Сок', 'Ваду'], answer: 1, explanation: 'Кліент кажа "Мне каву з малаком, калі ласка."' },
        { question: 'Якую каву хоча кліент?', options: ['Маленькую', 'Сярэднюю', 'Вялікую', 'Не кажа'], answer: 2, explanation: 'Кліент адказвае "Вялікую."' },
        { question: 'Колькі каштуе ўсё?', options: ['Два рублі', 'Тры рублі', 'Тры рублі пяцьдзесят', 'Пяць рублёў'], answer: 2, explanation: 'Прадавец кажа "Тры рублі пяцьдзесят."' },
      ],
    },
    {
      id: 'a1-siamia',
      title: 'Мая сям\'я',
      type: 'description',
      text:
        'Мяне завуць Аліна. Мне дваццаць тры гады. Я жыву ў Мінску. ' +
        'Мая сям\'я невялікая. Мой тата працуе ў школе, ён настаўнік. ' +
        'Мая мама — лекар. Мой брат Мікола — студэнт. Ён вучыцца ў ' +
        'ўніверсітэце. Мы кахаем нашу сям\'ю.',
      vocabulary: [
        { word: 'сям\'я', definition: 'family', example: 'Мая сям\'я вялікая.' },
        { word: 'настаўнік', definition: 'teacher', example: 'Ён добры настаўнік.' },
        { word: 'вучыцца', definition: 'to study', example: 'Яна вучыцца ў школе.' },
      ],
      comprehensionQuestions: [
        { question: 'Дзе жыве Аліна?', options: ['У Гродна', 'У Мінску', 'У Брэсце', 'У Гомелі'], answer: 1, explanation: 'Аліна кажа "Я жыву ў Мінску."' },
        { question: 'Хто мама Аліны па прафесіі?', options: ['Настаўніца', 'Лекар', 'Студэнтка', 'Інжынер'], answer: 1, explanation: 'У тэксце: "Мая мама — лекар."' },
        { question: 'Што робіць Мікола?', options: ['Працуе', 'Вучыцца', 'Адпачывае', 'Не кажа'], answer: 1, explanation: '"Мой брат Мікола — студэнт. Ён вучыцца ў ўніверсітэце."' },
      ],
    },
  ],
  A2: [
    {
      id: 'a2-vikend',
      title: 'Мой выходны дзень',
      type: 'narrative',
      text:
        'У мінулую суботу я хадзіў у парк з сябрамі. Надвор\'е было цудоўнае — ' +
        'свяціла сонца і было цёпла. Мы гулялі па парку, піл каву і размаўлялі. ' +
        'Потым мы пайшлі ў кіно і глядзелі новы беларускі фільм. Фільм быў вельмі ' +
        'цікавы! Увечары я вярнуўся дадому і чытаў кнігу. Гэта быў выдатны дзень.',
      vocabulary: [
        { word: 'надвор\'е', definition: 'weather', example: 'Якое сёння надвор\'е?' },
        { word: 'цудоўнае', definition: 'wonderful', example: 'Надвор\'е цудоўнае!' },
        { word: 'вярнуўся', definition: 'returned', example: 'Ён вярнуўся дадому позна.' },
      ],
      comprehensionQuestions: [
        { question: 'Калі гэта было?', options: ['У панядзелак', 'У суботу', 'У нядзелю', 'Учора'], answer: 1, explanation: '"У мінулую суботу"' },
        { question: 'Што яны рабілі ў парку?', options: ['Бегалі', 'Гулялі, пілі каву, размаўлялі', 'Чыталі', 'Спявалі'], answer: 1, explanation: '"Мы гулялі па парку, піл каву і размаўлялі."' },
        { question: 'Што яны глядзелі ў кіно?', options: ['Амерыканскі фільм', 'Рускі серыял', 'Беларускі фільм', 'Дакументальны фільм'], answer: 2, explanation: '"глядзелі новы беларускі фільм"' },
      ],
    },
  ],
  B1: [
    {
      id: 'b1-bulba',
      title: 'Бульба — сімвал Беларусі',
      type: 'article',
      text:
        'Бульба займае асаблівае месца ў беларускай культуры. Беларусы жартоўна ' +
        'называюць сябе «бульбашамі» — бульбянымі людзьмі. Гэта не выпадкова: ' +
        'Беларусь знаходзіцца ў кліматычнай зоне, якая ідэальна падыходзіць для ' +
        'вырошчвання бульбы.\n\n' +
        'Бульба з\'явілася ў Беларусі ў XVII стагоддзі і хутка стала асноўным ' +
        'прадуктам. Дранікі — бульбяныя аладкі — лічацца нацыянальнай стравай. ' +
        'Акрамя дранікаў, з бульбы гатуюць каму, калдуны, бабку і шмат іншых страў.\n\n' +
        'Сёння бульба застаецца важнай часткай беларускай ідэнтычнасці і кухні.',
      vocabulary: [
        { word: 'бульбашы', definition: 'potato people (humorous Belarusian self-identity)', example: 'Беларусаў жартоўна завуць бульбашамі.' },
        { word: 'дранікі', definition: 'potato pancakes (national dish)', example: 'Дранікі — самая вядомая беларуская страва.' },
        { word: 'страва', definition: 'dish (food)', example: 'Гэта вельмі смачная страва.' },
      ],
      comprehensionQuestions: [
        { question: 'Чаму беларусы называюць сябе "бульбашамі"?', options: ['Бо яны круглыя', 'Бо бульба важная ў іх культуры', 'Бо яны жывуць у полі', 'Бо гэта прозвішча'], answer: 1, explanation: 'Бульба займае асаблівае месца ў культуры.' },
        { question: 'Калі бульба з\'явілася ў Беларусі?', options: ['У XV стагоддзі', 'У XVI стагоддзі', 'У XVII стагоддзі', 'У XVIII стагоддзі'], answer: 2, explanation: '"Бульба з\'явілася ў Беларусі ў XVII стагоддзі."' },
        { question: 'Якая нацыянальная страва згаданая?', options: ['Калдуны', 'Дранікі', 'Бабка', 'Зразы'], answer: 1, explanation: '"Дранікі — бульбяныя аладкі — лічацца нацыянальнай стравай."' },
      ],
    },
  ],
  B2: [
    {
      id: 'b2-mova',
      title: 'Беларуская мова: мінулае і сёння',
      type: 'article',
      text:
        'Беларуская мова мае багатую гісторыю. Яна паходзіць ад старабеларускай мовы, ' +
        'якая была афіцыйнай мовай Вялікага Княства Літоўскага. На гэтай мове быў ' +
        'напісаны Статут ВКЛ 1588 года — адзін з першых кодэксаў права ў Еўропе.\n\n' +
        'Аднак у XX стагоддзі беларуская мова перажыла цяжкія часы. Савецкая палітыка ' +
        'русіфікацыі прывяла да таго, што большасць беларусаў перайшла на рускую мову ' +
        'ў штодзённым жыцці. Сёння толькі каля 12% беларусаў актыўна карыстаюцца ' +
        'беларускай мовай штодня.\n\n' +
        'Пратэсты 2020 года выклікалі новую хвалю цікавасці да беларускай мовы і ' +
        'культуры. Многія людзі пачалі вывучаць мову як акт нацыянальнай свядомасці.',
      vocabulary: [
        { word: 'Вялікае Княства Літоўскае', definition: 'Grand Duchy of Lithuania', example: 'ВКЛ — гістарычная дзяржава.' },
        { word: 'русіфікацыя', definition: 'Russification', example: 'Русіфікацыя пашкодзіла беларускай мове.' },
        { word: 'свядомасць', definition: 'consciousness / awareness', example: 'Нацыянальная свядомасць расце.' },
      ],
      comprehensionQuestions: [
        { question: 'На якой мове быў напісаны Статут ВКЛ?', options: ['Лацінскай', 'Старабеларускай', 'Польскай', 'Рускай'], answer: 1, explanation: '"На гэтай мове быў напісаны Статут ВКЛ 1588 года"' },
        { question: 'Колькі беларусаў актыўна карыстаюцца беларускай мовай?', options: ['Каля 5%', 'Каля 12%', 'Каля 30%', 'Каля 50%'], answer: 1, explanation: '"толькі каля 12% беларусаў"' },
        { question: 'Што выклікала новую хвалю цікавасці да мовы?', options: ['Алімпійскія гульні', 'Пратэсты 2020 года', 'Новы закон', 'Фільм'], answer: 1, explanation: '"Пратэсты 2020 года выклікалі новую хвалю цікавасці"' },
      ],
    },
  ],
  C1: [
    {
      id: 'c1-bykau',
      title: 'Васіль Быкаў і тэма вайны',
      type: 'article',
      text:
        'Васіль Быкаў (1924-2003) — найвялікшы беларускі празаік XX стагоддзя. Яго ' +
        'аповесці пра Другую сусветную вайну — «Жураўліны крык», «Сотнікаў», ' +
        '«Знак бяды» — сталі класікай сусветнай ваеннай літаратуры.\n\n' +
        'Быкаў не апісваў гераічныя бітвы. Яго цікавіў маральны выбар звычайнага ' +
        'чалавека ў экстрэмальных умовах: як паводзіць сябе, калі паміж жыццём і ' +
        'годнасцю трэба выбіраць? У «Сотнікаве» два партызаны трапляюць у палон — ' +
        'адзін здраджвае, другі прымае смерць. Быкаў паказвае, што сапраўдная ' +
        'мужнасць — гэта не фізічная сіла, а маральная стойкасць.\n\n' +
        'Творчасць Быкава мае асаблівае значэнне для Беларусі, дзе вайна знішчыла ' +
        'кожнага трэцяга жыхара. Яго тэксты — гэта памяць народа.',
      vocabulary: [
        { word: 'аповесць', definition: 'novella / short novel', example: '«Сотнікаў» — аповесць Быкава.' },
        { word: 'годнасць', definition: 'dignity', example: 'Ён выбраў годнасць.' },
        { word: 'стойкасць', definition: 'fortitude / steadfastness', example: 'Маральная стойкасць важнейшая за сілу.' },
      ],
      comprehensionQuestions: [
        { question: 'Што цікавіла Быкава ў яго творах пра вайну?', options: ['Гераічныя бітвы', 'Маральны выбар звычайнага чалавека', 'Ваенная стратэгія', 'Палітыка'], answer: 1, explanation: '"Яго цікавіў маральны выбар звычайнага чалавека ў экстрэмальных умовах"' },
        { question: 'Пра што аповесць «Сотнікаў»?', options: ['Пра бітву', 'Пра двух партызанаў у палоне', 'Пра дзяцей', 'Пра школу'], answer: 1, explanation: '"два партызаны трапляюць у палон — адзін здраджвае, другі прымае смерць"' },
        { question: 'Якую долю насельніцтва Беларусі знішчыла вайна?', options: ['Кожнага пятага', 'Кожнага чацвёртага', 'Кожнага трэцяга', 'Палову'], answer: 2, explanation: '"вайна знішчыла кожнага трэцяга жыхара"' },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// ReadingTutor class
// ---------------------------------------------------------------------------

class ReadingTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.readingStats) p.readingStats = {};
    return p;
  }

  _save(p) { core.saveProfile(this.dir, p); }

  setLevel(studentId, level) {
    const lev = level.toUpperCase();
    if (!core.CEFR.includes(lev)) throw new Error(`Invalid level: ${level}. Use one of: ${core.CEFR.join(', ')}`);
    const p = this.getProfile(studentId);
    p.level = lev;
    this._save(p);
    return { studentId, level: lev, message: `Level set to ${lev}.` };
  }

  getTextCatalog(level) {
    if (level) {
      return (TEXTS[level] || []).map(t => ({ id: t.id, title: t.title, type: t.type, level, questions: t.comprehensionQuestions.length }));
    }
    const catalog = [];
    for (const lvl of core.CEFR) {
      for (const t of (TEXTS[lvl] || [])) {
        catalog.push({ id: t.id, title: t.title, type: t.type, level: lvl, questions: t.comprehensionQuestions.length });
      }
    }
    return catalog;
  }

  getText(studentId, textId) {
    for (const lvl of core.CEFR) {
      const found = (TEXTS[lvl] || []).find(t => t.id === textId);
      if (found) return { ...found, level: lvl };
    }
    throw new Error(`Text not found: ${textId}`);
  }

  generateLesson(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = TEXTS[level] || [];
    if (!available.length) throw new Error(`No texts available for level ${level}`);
    const seen = new Set(Object.keys(p.readingStats));
    let candidates = available.filter(t => !seen.has(t.id));
    if (!candidates.length) candidates = available;
    const text = core.pick(candidates, 1)[0];
    return {
      studentId, level, date: core.today(),
      text: { id: text.id, title: text.title, type: text.type, text: text.text },
      vocabulary: text.vocabulary,
      questions: text.comprehensionQuestions.map((q, i) => ({ index: i, question: q.question, options: q.options })),
      flow: ['1. Pre-reading: predict from title, preview vocabulary', '2. Read the text', '3. Answer comprehension questions', '4. Review vocabulary, record score'],
    };
  }

  checkAnswer(studentId, textId, questionIndex, answer) {
    const text = this.getText(studentId, textId);
    const q = text.comprehensionQuestions[questionIndex];
    if (!q) throw new Error(`Question index ${questionIndex} out of range.`);
    const ansIdx = typeof answer === 'number' ? answer : parseInt(answer, 10);
    const correct = ansIdx === q.answer;
    return { correct, expected: q.options[q.answer], given: q.options[ansIdx] || answer, explanation: q.explanation };
  }

  recordAssessment(studentId, textId, score, total) {
    const s = parseInt(score, 10), t = parseInt(total, 10);
    if (isNaN(s) || isNaN(t) || t <= 0) throw new Error('Score and total must be positive integers');
    const p = this.getProfile(studentId);
    if (!p.readingStats[textId]) {
      p.readingStats[textId] = { attempts: [], stability: 2, difficulty: 5 };
    }
    const rs = p.readingStats[textId];
    rs.attempts.push({ score: s, total: t, date: core.today() });
    const grade = s / t >= 0.8 ? 4 : s / t >= 0.5 ? 3 : s / t >= 0.3 ? 2 : 1;
    rs.stability = core.fsrsUpdateStability(rs.stability, rs.difficulty, grade);
    rs.difficulty = core.fsrsUpdateDifficulty(rs.difficulty, grade);
    const interval = core.fsrsNextReview(rs.stability);
    const next = new Date(); next.setDate(next.getDate() + interval);
    rs.nextReview = next.toISOString().slice(0, 10);
    this._save(p);
    return { studentId, textId, score: s, total: t, mastery: core.masteryLabel(core.calcMastery(rs.attempts)), nextReview: rs.nextReview };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = TEXTS[level] || [];
    const stats = available.map(t => {
      const rs = p.readingStats[t.id];
      const mastery = rs ? core.calcMastery(rs.attempts) : 0;
      return { id: t.id, title: t.title, mastery, label: core.masteryLabel(mastery), attempts: rs ? rs.attempts.length : 0 };
    });
    return { studentId, level, texts: stats };
  }

  getNextTexts(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = TEXTS[level] || [];
    const td = core.today();
    const due = [], fresh = [];
    for (const t of available) {
      const rs = p.readingStats[t.id];
      if (!rs) { fresh.push(t.id); continue; }
      if (rs.nextReview && rs.nextReview <= td) due.push(t.id);
    }
    return { studentId, level, due, fresh, totalDue: due.length, totalFresh: fresh.length };
  }

  getReport(studentId) {
    const progress = this.getProgress(studentId);
    const next = this.getNextTexts(studentId);
    return { ...progress, recommendations: next };
  }

  listStudents() { return core.listProfiles(this.dir); }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new ReadingTutor();

core.runCLI((cmd, args, out) => {
  const sid = args[1] || 'default';
  switch (cmd) {
    case 'start': {
      const level = args[2] || null;
      const p = tutor.getProfile(sid);
      if (level) tutor.setLevel(sid, level);
      tutor._save(p);
      out({ studentId: sid, level: p.level || 'A1' });
      break;
    }
    case 'set-level': out(tutor.setLevel(sid, args[2])); break;
    case 'lesson': out(tutor.generateLesson(sid)); break;
    case 'text': {
      if (!args[2]) throw new Error('Usage: text <studentId> <textId>');
      out(tutor.getText(sid, args[2]));
      break;
    }
    case 'check': {
      if (!args[2] || args[3] === undefined || args[4] === undefined) throw new Error('Usage: check <studentId> <textId> <qIndex> <answer>');
      out(tutor.checkAnswer(sid, args[2], parseInt(args[3], 10), parseInt(args[4], 10)));
      break;
    }
    case 'record': {
      if (!args[2] || !args[3] || !args[4]) throw new Error('Usage: record <studentId> <textId> <score> <total>');
      out(tutor.recordAssessment(sid, args[2], args[3], args[4]));
      break;
    }
    case 'progress': out(tutor.getProgress(sid)); break;
    case 'report': out(tutor.getReport(sid)); break;
    case 'next': out(tutor.getNextTexts(sid)); break;
    case 'texts': out(tutor.getTextCatalog(args[2] ? args[2].toUpperCase() : null)); break;
    case 'students': out({ students: tutor.listStudents() }); break;
    case 'help':
      out({ commands: 'Use one of the commands listed in SKILL.md' });
      break;
    default:
      out({ error: 'Unknown command: ' + cmd, commands: ['start','set-level','lesson','text','check','record','progress','report','next','texts','students'] });
  }
});
