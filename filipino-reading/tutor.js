#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'filipino-reading';

// ---------------------------------------------------------------------------
// Embedded reading texts by CEFR level
// ---------------------------------------------------------------------------

const TEXTS = {
  A1: [
    {
      id: 'a1-karinderya',
      title: 'Sa karinderya',
      type: 'dialogue',
      text:
        '— Magandang tanghali po! Ano pong gusto ninyo?\n' +
        '— Magkano po ang adobo?\n' +
        '— Singkwenta pesos po ang isang order.\n' +
        '— Sige, isang adobo at isang kanin po.\n' +
        '— Gusto ninyo po ba ng inumin?\n' +
        '— Oo, isang baso ng tubig lang po.\n' +
        '— Sige po. Setenta pesos po lahat.',
      vocabulary: [
        { word: 'karinderya', definition: 'small eatery / food stall', example: 'Masarap ang pagkain sa karinderya.' },
        { word: 'kanin', definition: 'rice (cooked)', example: 'Gusto ko ng kanin at ulam.' },
        { word: 'inumin', definition: 'drink / beverage', example: 'Ano ang gusto mong inumin?' },
      ],
      comprehensionQuestions: [
        { question: 'Magkano ang adobo?', options: ['Trenta pesos', 'Singkwenta pesos', 'Setenta pesos', 'Walumpu pesos'], answer: 1, explanation: '"Singkwenta pesos po ang isang order."' },
        { question: 'Ano ang inorder na inumin?', options: ['Kape', 'Juice', 'Tubig', 'Softdrinks'], answer: 2, explanation: '"Isang baso ng tubig lang po."' },
        { question: 'Magkano lahat?', options: ['Singkwenta pesos', 'Animnapu pesos', 'Setenta pesos', 'Walumpu pesos'], answer: 2, explanation: '"Setenta pesos po lahat."' },
      ],
    },
    {
      id: 'a1-pamilya',
      title: 'Ang pamilya ko',
      type: 'narrative',
      text:
        'Ang pangalan ko ay Juan. Labinlimang taon ako. Apat kami sa pamilya. ' +
        'Ang tatay ko ay guro sa eskwela. Ang nanay ko ay nars sa ospital. ' +
        'Mayroon akong kapatid na babae. Ang pangalan niya ay Maria. ' +
        'Sampung taon siya. Masaya kami sa bahay namin.',
      vocabulary: [
        { word: 'pamilya', definition: 'family', example: 'Mahal ko ang pamilya ko.' },
        { word: 'guro', definition: 'teacher', example: 'Ang guro ko ay mabait.' },
        { word: 'kapatid', definition: 'sibling', example: 'Dalawa ang kapatid ko.' },
      ],
      comprehensionQuestions: [
        { question: 'Ilang taon si Juan?', options: ['Sampu', 'Labindalawa', 'Labinlima', 'Labing-anim'], answer: 2, explanation: '"Labinlimang taon ako."' },
        { question: 'Ano ang trabaho ng tatay niya?', options: ['Doktor', 'Guro', 'Nars', 'Pulis'], answer: 1, explanation: '"Ang tatay ko ay guro sa eskwela."' },
        { question: 'Ilang taon ang kapatid ni Juan?', options: ['Walo', 'Siyam', 'Sampu', 'Labing-isa'], answer: 2, explanation: '"Sampung taon siya."' },
      ],
    },
  ],
  A2: [
    {
      id: 'a2-jeepney',
      title: 'Ang jeepney',
      type: 'informational',
      text:
        'Ang jeepney ay isa sa pinakasikat na sasakyan sa Pilipinas. Gawa ito mula sa mga ' +
        'lumang military jeep ng mga Amerikano pagkatapos ng Ikalawang Digmaang Pandaigdig. ' +
        'Makulay ang mga jeepney at may iba\'t ibang disenyo. Mura lang ang pamasahe — ' +
        'kaya paborito ito ng mga Pilipino para sa pang-araw-araw na biyahe. Kapag sasakay ka, ' +
        'sasabihin mo "Para po!" kapag gusto mong bumaba.',
      vocabulary: [
        { word: 'sasakyan', definition: 'vehicle', example: 'Maraming sasakyan sa daan.' },
        { word: 'pamasahe', definition: 'fare', example: 'Magkano ang pamasahe hanggang Quiapo?' },
        { word: 'pang-araw-araw', definition: 'daily / everyday', example: 'Jeepney ang pang-araw-araw kong sasakyan.' },
      ],
      comprehensionQuestions: [
        { question: 'Saan galing ang jeepney?', options: ['Japan', 'American military jeeps', 'Germany', 'Korea'], answer: 1, explanation: '"Gawa ito mula sa mga lumang military jeep ng mga Amerikano."' },
        { question: 'Bakit paborito ang jeepney?', options: ['Mabilis', 'Komportable', 'Mura ang pamasahe', 'May aircon'], answer: 2, explanation: '"Mura lang ang pamasahe."' },
        { question: 'Ano ang sasabihin kapag bababa ka?', options: ['Tabi po', 'Para po', 'Bayad po', 'Sakay po'], answer: 1, explanation: '"Sasabihin mo \'Para po!\' kapag gusto mong bumaba."' },
      ],
    },
  ],
  B1: [
    {
      id: 'b1-fiesta',
      title: 'Ang Pista ng Bayan',
      type: 'narrative',
      text:
        'Ang pista ay isa sa pinakamahalagang tradisyon sa Pilipinas. Halos bawat bayan ' +
        'ay may sariling pista na ipinagdiriwang taun-taon. Karaniwang kasama sa pista ang ' +
        'parada, sayawan, at maraming pagkain. Ang pinakasikat na pista sa Pilipinas ay ang ' +
        'Sinulog sa Cebu, Ati-Atihan sa Aklan, at Pahiyas sa Lucban, Quezon.\n\n' +
        'Sa aming bayan, tuwing Mayo ang pista. Naghahanda ang bawat pamilya ng maraming ' +
        'pagkain para sa mga bisita. Bukas ang mga bahay at malaya ang sinumang gustong ' +
        'kumain. Ito ang tinatawag na "bayanihan" — ang espiritu ng pagtutulungan ng mga ' +
        'Pilipino. Sa pista, kahit sino ay welcome.',
      vocabulary: [
        { word: 'pista', definition: 'feast / fiesta / town celebration', example: 'Masaya ang pista sa amin.' },
        { word: 'ipinagdiriwang', definition: 'celebrated', example: 'Ipinagdiriwang namin ang kaarawan ni Lola.' },
        { word: 'bayanihan', definition: 'community spirit / helping each other', example: 'Ang bayanihan ay parte ng kulturang Pilipino.' },
      ],
      comprehensionQuestions: [
        { question: 'Ano ang karaniwang kasama sa pista?', options: ['Parada at pagkain', 'Trabaho', 'Eskwela', 'Palaro lang'], answer: 0, explanation: '"Kasama sa pista ang parada, sayawan, at maraming pagkain."' },
        { question: 'Ano ang ibig sabihin ng "bayanihan" sa konteksto?', options: ['Pagkain', 'Pagtutulungan', 'Pagsayaw', 'Paglalakbay'], answer: 1, explanation: '"Ang espiritu ng pagtutulungan ng mga Pilipino."' },
        { question: 'Kailan ang pista sa bayan ng may-akda?', options: ['Enero', 'Marso', 'Mayo', 'Disyembre'], answer: 2, explanation: '"Tuwing Mayo ang pista."' },
      ],
    },
  ],
  B2: [
    {
      id: 'b2-social-media',
      title: 'Ang Epekto ng Social Media sa mga Kabataan',
      type: 'essay',
      text:
        'Hindi maikakailang malaki ang papel ng social media sa buhay ng mga kabataang ' +
        'Pilipino ngayon. Ayon sa pinakabagong pag-aaral, ang Pilipinas ang isa sa mga ' +
        'bansang may pinakamahabang oras na ginugugol sa social media — halos apat na oras ' +
        'bawat araw.\n\n' +
        'Sa isang banda, nagbibigay ang social media ng plataporma para sa pagpapahayag, ' +
        'edukasyon, at koneksyon. Maraming kabataan ang natututo ng bagong kasanayan sa ' +
        'pamamagitan ng online tutorials at nakikipag-ugnayan sa mga kapwa estudyante.\n\n' +
        'Gayunpaman, may mga negatibong epekto rin. Napag-alaman na ang labis na paggamit ' +
        'ay nauugnay sa anxiety, depression, at mahinang kalidad ng tulog. Bukod dito, ' +
        'ang cyberbullying ay naging malaking problema sa mga paaralan.\n\n' +
        'Sa kabuuan, kailangan ng balanseng pamamaraan — hindi pagbabawal kundi responsableng ' +
        'paggamit na sinusuportahan ng edukasyon tungkol sa digital literacy.',
      vocabulary: [
        { word: 'maikakailang', definition: 'can be denied (negated: cannot be denied)', example: 'Hindi maikakailang magaling siya.' },
        { word: 'plataporma', definition: 'platform', example: 'Ang Facebook ay isang plataporma ng social media.' },
        { word: 'nauugnay', definition: 'linked / connected to', example: 'Ang stress ay nauugnay sa sakit.' },
        { word: 'pamamaraan', definition: 'approach / method', example: 'Kailangan ng tamang pamamaraan.' },
      ],
      comprehensionQuestions: [
        { question: 'Ilang oras ang average na ginugugol sa social media?', options: ['Dalawa', 'Tatlo', 'Apat', 'Lima'], answer: 2, explanation: '"Halos apat na oras bawat araw."' },
        { question: 'Ano ang positibong epekto na nabanggit?', options: ['Mas maraming tulog', 'Edukasyon at koneksyon', 'Mas maraming pera', 'Mas mabuting kalusugan'], answer: 1, explanation: '"Edukasyon, at koneksyon."' },
        { question: 'Ano ang konklusyon ng may-akda?', options: ['I-ban ang social media', 'Responsableng paggamit', 'Walang problema', 'Patayin ang internet'], answer: 1, explanation: '"Responsableng paggamit na sinusuportahan ng edukasyon."' },
      ],
    },
  ],
  C1: [
    {
      id: 'c1-kapwa',
      title: 'Ang Konsepto ng Kapwa',
      type: 'academic',
      text:
        'Sa Sikolohiyang Pilipino na itinaguyod ni Virgilio Enriquez, ang "kapwa" ay ' +
        'itinuturing na pundasyon ng Filipino values system. Hindi ito katumbas ng ' +
        'simpleng "fellow human being" sa Ingles — sa halip, ito ay nagpapahiwatig ng ' +
        'malalim na pagkilala na ang ibang tao ay hindi talaga "iba" kundi bahagi ng iyong ' +
        'pagkatao.\n\n' +
        'Ang kapwa ay nagbibigay-daan sa dalawang antas ng interaksyon: ang ibang-tao ' +
        '(outsider categories) at hindi-ibang-tao (insider categories). Sa antas ng ' +
        'hindi-ibang-tao, naroroon ang pakikisama, pakikilahok, pakikibagay, pakikisangkot, ' +
        'at ang pinakamataas — pakikiisa.\n\n' +
        'Ang pag-unawa sa kapwa ay mahalaga hindi lamang sa akademikong pag-aaral ng ' +
        'kultura kundi sa praktikal na komunikasyon. Ang pakikiramdam — ang sensitibong ' +
        'pagdarama sa ibang tao — ay nagmumula sa pagkilala ng kapwa.',
      vocabulary: [
        { word: 'itinaguyod', definition: 'championed / advocated', example: 'Itinaguyod niya ang mga karapatan ng mga manggagawa.' },
        { word: 'itinuturing', definition: 'considered / regarded as', example: 'Itinuturing siyang lider ng grupo.' },
        { word: 'pagkilala', definition: 'recognition / acknowledgment', example: 'Mahalaga ang pagkilala sa mga kontribusyon ng bawat isa.' },
      ],
      comprehensionQuestions: [
        { question: 'Sino ang nagtatag ng Sikolohiyang Pilipino?', options: ['Jose Rizal', 'Virgilio Enriquez', 'Andres Bonifacio', 'Nick Joaquin'], answer: 1, explanation: '"Itinaguyod ni Virgilio Enriquez."' },
        { question: 'Ano ang pinakamataas na antas ng hindi-ibang-tao?', options: ['Pakikisama', 'Pakikibagay', 'Pakikiisa', 'Pakikilahok'], answer: 2, explanation: '"At ang pinakamataas — pakikiisa."' },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function allTexts() {
  const out = [];
  for (const lvl of core.CEFR) {
    for (const t of (TEXTS[lvl] || [])) out.push({ ...t, level: lvl });
  }
  return out;
}

function textsForLevel(level) {
  const idx = core.CEFR.indexOf(level);
  if (idx < 0) return allTexts();
  const out = [];
  for (let i = 0; i <= idx; i++) {
    for (const t of (TEXTS[core.CEFR[i]] || [])) out.push({ ...t, level: core.CEFR[i] });
  }
  return out;
}

// ---------------------------------------------------------------------------
// ReadingTutor
// ---------------------------------------------------------------------------

class ReadingTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(id) {
    const p = core.loadProfile(this.dir, id);
    if (!p.level) p.level = 'A1';
    if (!p.skills) p.skills = {};
    if (!p.sessions) p.sessions = [];
    return p;
  }

  setLevel(id, level) {
    const lv = level.toUpperCase();
    if (!core.CEFR.includes(lv)) throw new Error('Invalid CEFR level: ' + lv);
    const p = this.getProfile(id);
    p.level = lv;
    core.saveProfile(this.dir, p);
    return { studentId: id, level: lv, textsAvailable: textsForLevel(lv).length };
  }

  generateLesson(id) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const available = textsForLevel(level).filter(t => t.level === level);
    const seen = new Set((p.sessions || []).map(s => s.textId));
    let candidates = available.filter(t => !seen.has(t.id));
    if (candidates.length === 0) candidates = available;
    const text = core.pick(candidates, 1)[0];
    if (!text) throw new Error('No texts available for level ' + level);

    return {
      studentId: id, level, date: core.today(),
      text: {
        id: text.id, title: text.title, type: text.type, level: text.level,
        text: text.text, vocabulary: text.vocabulary,
        questions: text.comprehensionQuestions.map((q, i) => ({ index: i, question: q.question, options: q.options })),
      },
    };
  }

  getText(id, textId) {
    const text = allTexts().find(t => t.id === textId);
    if (!text) throw new Error('Text not found: ' + textId);
    return {
      id: text.id, title: text.title, type: text.type, level: text.level,
      text: text.text, vocabulary: text.vocabulary,
      questions: text.comprehensionQuestions.map((q, i) => ({ index: i, question: q.question, options: q.options })),
    };
  }

  checkAnswer(id, textId, questionIndex, answer) {
    const text = allTexts().find(t => t.id === textId);
    if (!text) throw new Error('Text not found: ' + textId);
    const q = text.comprehensionQuestions[questionIndex];
    if (!q) throw new Error('Question not found at index: ' + questionIndex);
    const given = parseInt(answer, 10);
    const correct = given === q.answer;
    return { textId, questionIndex, correct, given, expected: q.answer, explanation: q.explanation };
  }

  recordAssessment(id, textId, score, total) {
    const s = parseInt(score, 10);
    const t = parseInt(total, 10);
    if (isNaN(s) || isNaN(t) || t <= 0) throw new Error('Score and total must be positive integers');
    const p = this.getProfile(id);

    if (!p.skills[textId]) {
      p.skills[textId] = { stability: 1, difficulty: 5, lastReview: null, nextReview: null, attempts: [] };
    }
    const sk = p.skills[textId];
    const grade = s / t >= 0.9 ? 4 : s / t >= 0.7 ? 3 : s / t >= 0.5 ? 2 : 1;
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, grade);
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, grade);
    sk.lastReview = core.today();
    const interval = core.fsrsNextReview(sk.stability);
    const next = new Date();
    next.setDate(next.getDate() + interval);
    sk.nextReview = next.toISOString().slice(0, 10);
    sk.attempts.push({ score: s, total: t, date: core.today() });

    p.sessions.push({ textId, score: s, total: t, date: core.today(), grade });
    core.saveProfile(this.dir, p);

    return { studentId: id, textId, score: s, total: t, grade, nextReview: sk.nextReview };
  }

  getProgress(id) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const available = textsForLevel(level);
    const scored = (p.sessions || []).filter(s => s.score != null && s.total != null && s.total > 0);
    const mastery = core.calcMastery(scored.map(s => ({ score: s.score, total: s.total })));
    return {
      studentId: id, level,
      textsStudied: Object.keys(p.skills).length,
      totalTexts: available.length,
      totalSessions: p.sessions.length,
      mastery, masteryLabel: core.masteryLabel(mastery),
    };
  }

  getReport(id) {
    const progress = this.getProgress(id);
    const p = this.getProfile(id);
    return { ...progress, recentSessions: (p.sessions || []).slice(-10).reverse() };
  }

  getNextTexts(id) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const available = textsForLevel(level);
    const td = core.today();
    const due = [];
    const unstarted = [];
    for (const t of available) {
      const sk = p.skills[t.id];
      if (!sk) { unstarted.push({ id: t.id, title: t.title, type: t.type, level: t.level }); continue; }
      if (sk.nextReview && sk.nextReview <= td) due.push({ id: t.id, title: t.title, type: t.type, level: t.level });
    }
    return { studentId: id, date: td, due, unstarted: unstarted.slice(0, 5), totalDue: due.length, totalUnstarted: unstarted.length };
  }

  listTexts(level) {
    const list = level ? (TEXTS[level.toUpperCase()] || []).map(t => ({ ...t, level: level.toUpperCase() })) : allTexts();
    return list.map(t => ({ id: t.id, title: t.title, type: t.type, level: t.level }));
  }

  listStudents() { return core.listProfiles(this.dir); }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new ReadingTutor();

core.runCLI((cmd, args, out) => {
  const id = args[1] || 'default';
  switch (cmd) {
    case 'start': {
      const level = args[2] || 'A1';
      tutor.setLevel(id, level);
      out(tutor.getProfile(id));
      break;
    }
    case 'set-level':
      out(tutor.setLevel(id, args[2] || 'A1'));
      break;
    case 'lesson':
      out(tutor.generateLesson(id));
      break;
    case 'text':
      out(tutor.getText(id, args[2]));
      break;
    case 'check':
      out(tutor.checkAnswer(id, args[2], parseInt(args[3], 10), args[4]));
      break;
    case 'record':
      out(tutor.recordAssessment(id, args[2], args[3], args[4]));
      break;
    case 'progress':
      out(tutor.getProgress(id));
      break;
    case 'report':
      out(tutor.getReport(id));
      break;
    case 'next':
      out(tutor.getNextTexts(id));
      break;
    case 'texts':
      out(tutor.listTexts(args[2]));
      break;
    case 'students':
      out({ students: tutor.listStudents() });
      break;
    case 'help':
      out({ commands: ['start', 'set-level', 'lesson', 'text', 'check', 'record',
                   'progress', 'report', 'next', 'texts', 'students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + cmd,
        commands: ['start', 'set-level', 'lesson', 'text', 'check', 'record',
                   'progress', 'report', 'next', 'texts', 'students'],
      });
  }
});
