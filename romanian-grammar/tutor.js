#!/usr/bin/env node
// Romanian Grammar Tutor — discovery-based grammar teaching with FSRS spaced repetition
'use strict';

const core = require('../_lib/core');
const { CEFR, MASTERY_THRESHOLD, DEFAULT_RETENTION,
        dataDir, loadProfile, saveProfile, listProfiles,
        calcMastery, masteryLabel,
        fsrsRetention, fsrsNextReview, fsrsUpdateStability, fsrsUpdateDifficulty,
        shuffle, pick, norm, today, runCLI } = core;

const SKILL_NAME = 'romanian-grammar';

// ─── Embedded Grammar Data ──────────────────────────────────────────────────

const TOPICS = [
  // ── A1 ──
  { id: 'a-fi', name: 'A fi (to be)', level: 'A1', category: 'verbs',
    scoba: `A fi — present tense:
  eu sunt, tu ești, el/ea este (e)
  noi suntem, voi sunteți, ei/ele sunt`,
    exercises: [
      { type: 'fill', prompt: 'Eu ___ student.', answer: 'sunt', hint: '1st person singular of a fi' },
      { type: 'fill', prompt: 'Ea ___ profesoară.', answer: 'este', hint: '3rd person singular of a fi' },
      { type: 'fill', prompt: 'Noi ___ din România.', answer: 'suntem', hint: '1st person plural of a fi' },
      { type: 'error', prompt: 'Eu este fericit.', answer: 'Eu sunt fericit.', hint: '1st person requires sunt' },
    ] },
  { id: 'a-avea', name: 'A avea (to have)', level: 'A1', category: 'verbs',
    scoba: `A avea — present tense:
  eu am, tu ai, el/ea are
  noi avem, voi aveți, ei/ele au`,
    exercises: [
      { type: 'fill', prompt: 'Tu ___ o mașină.', answer: 'ai', hint: '2nd person singular of a avea' },
      { type: 'fill', prompt: 'Ei ___ doi copii.', answer: 'au', hint: '3rd person plural of a avea' },
      { type: 'error', prompt: 'Noi are o casă mare.', answer: 'Noi avem o casă mare.', hint: '1st person plural requires avem' },
    ] },
  { id: 'gender-articles', name: 'Gender & Indefinite Articles', level: 'A1', category: 'nouns',
    scoba: `Romanian has 3 genders:
  Masculine: un (a) — usually consonant ending: un om, un băiat
  Feminine: o (a) — usually -ă/-e ending: o casă, o floare
  Neuter: un (sg.), două/niște (pl.) — masculine sg, feminine pl: un scaun → două scaune`,
    exercises: [
      { type: 'fill', prompt: '___ (un/o) casă mare', answer: 'o', hint: 'casă ends in -ă → feminine' },
      { type: 'fill', prompt: '___ (un/o) băiat', answer: 'un', hint: 'băiat is masculine' },
      { type: 'fill', prompt: '___ (un/o) scaun', answer: 'un', hint: 'scaun is neuter (masculine in singular)' },
      { type: 'error', prompt: 'Un carte este pe masă.', answer: 'O carte este pe masă.', hint: 'carte is feminine' },
    ] },
  { id: 'def-article-suffix', name: 'Definite Article Suffix', level: 'A1', category: 'nouns',
    scoba: `The definite article is a SUFFIX in Romanian:
  Masc: -ul/-le → omul (the man), fratele (the brother)
  Fem: -a → casa (the house), floarea (the flower)
  Neuter sg: -ul/-le → scaunul (the chair)
  Neuter pl: -le → scaunele (the chairs)`,
    exercises: [
      { type: 'fill', prompt: 'om → ___ (the man)', answer: 'omul', hint: 'Masculine + -ul' },
      { type: 'fill', prompt: 'casă → ___ (the house)', answer: 'casa', hint: 'Feminine -ă → -a' },
      { type: 'fill', prompt: 'carte → ___ (the book)', answer: 'cartea', hint: 'Feminine -e → -ea' },
      { type: 'transform', prompt: 'Add the definite article: "frate"', answer: 'fratele', hint: 'Masculine ending in -e → -ele' },
    ] },
  { id: 'present-regular', name: 'Present Tense (4 conjugation groups)', level: 'A1', category: 'verbs',
    scoba: `4 conjugation groups:
  I (-a): a cânta → cânt, cânți, cântă, cântăm, cântați, cântă
  II (-ea): a vedea → văd, vezi, vede, vedem, vedeți, văd
  III (-e): a merge → merg, mergi, merge, mergem, mergeți, merg
  IV (-i/-î): a dormi → dorm, dormi, doarme, dormim, dormiți, dorm`,
    exercises: [
      { type: 'fill', prompt: 'Eu ___ (a cânta) bine.', answer: 'cânt', hint: 'Group I, 1st person' },
      { type: 'fill', prompt: 'Noi ___ (a merge) la școală.', answer: 'mergem', hint: 'Group III, 1st person plural' },
      { type: 'fill', prompt: 'Tu ___ (a dormi) mult.', answer: 'dormi', hint: 'Group IV, 2nd person singular' },
      { type: 'error', prompt: 'Ea merg la magazin.', answer: 'Ea merge la magazin.', hint: '3rd person singular of a merge' },
    ] },
  { id: 'basic-adjectives', name: 'Adjective Agreement', level: 'A1', category: 'nouns',
    scoba: `Adjectives agree in gender and number with the noun:
  frumos / frumoasă / frumoși / frumoase
  Position: usually AFTER the noun: "o casă frumoasă"`,
    exercises: [
      { type: 'fill', prompt: 'O fată ___ (frumos)', answer: 'frumoasă', hint: 'Feminine singular → frumoasă' },
      { type: 'fill', prompt: 'Băieții ___ (bun)', answer: 'buni', hint: 'Masculine plural → buni' },
      { type: 'error', prompt: 'Casa frumos este acolo.', answer: 'Casa frumoasă este acolo.', hint: 'casă is feminine singular' },
    ] },

  // ── A2 ──
  { id: 'perfect-compus', name: 'Past Tense (perfectul compus)', level: 'A2', category: 'verbs',
    scoba: `Formation: a avea (auxiliary) + past participle
  Am cântat, ai cântat, a cântat, am cântat, ați cântat, au cântat
  Past participle: -at (Gr.I), -ut (Gr.II/III), -it (Gr.IV)`,
    exercises: [
      { type: 'fill', prompt: 'Eu ___ (a merge) la cinema ieri.', answer: 'am mers', hint: 'a merge → mers (irregular)' },
      { type: 'fill', prompt: 'Ei ___ (a vedea) filmul.', answer: 'au văzut', hint: 'a vedea → văzut' },
      { type: 'error', prompt: 'Eu a mers acasă.', answer: 'Eu am mers acasă.', hint: '1st person singular: am + participle' },
    ] },
  { id: 'imperfect', name: 'Imperfect Tense', level: 'A2', category: 'verbs',
    scoba: `Habitual/ongoing past: -am, -ai, -a, -am, -ați, -au
  a cânta: cântam, cântai, cânta, cântam, cântați, cântau
  a merge: mergeam, mergeai, mergea, mergeam, mergeați, mergeau`,
    exercises: [
      { type: 'fill', prompt: 'Când eram mic, ___ (a merge) la bunici.', answer: 'mergeam', hint: 'Imperfect, 1st person' },
      { type: 'fill', prompt: 'Ea ___ (a citi) în fiecare seară.', answer: 'citea', hint: 'Imperfect, 3rd person singular' },
    ] },
  { id: 'gen-dat-case', name: 'Genitive/Dative Case', level: 'A2', category: 'nouns',
    scoba: `Gen/Dat forms (always identical):
  Masc sg: băiatul → băiatului
  Fem sg: fata → fetei
  Masc pl: băieții → băieților
  Fem pl: fetele → fetelor
  Requires definite article!`,
    exercises: [
      { type: 'fill', prompt: 'Cartea ___ (băiatul) este nouă.', answer: 'băiatului', hint: 'Genitive: masculine -ul → -ului' },
      { type: 'fill', prompt: 'Dau ___ (fata) o carte.', answer: 'fetei', hint: 'Dative: feminine -a → -ei' },
      { type: 'transform', prompt: 'Make genitive: "casa"', answer: 'casei', hint: 'Feminine -a → -ei in gen/dat' },
    ] },
  { id: 'reflexive-verbs', name: 'Reflexive Verbs', level: 'A2', category: 'verbs',
    scoba: `Reflexive pronouns: mă, te, se, ne, vă, se
  a se spăla: mă spăl, te speli, se spală, ne spălăm, vă spălați, se spală`,
    exercises: [
      { type: 'fill', prompt: 'Eu ___ (a se trezi) la 7.', answer: 'mă trezesc', hint: 'Reflexive: mă + verb' },
      { type: 'error', prompt: 'El spală în fiecare dimineață.', answer: 'El se spală în fiecare dimineață.', hint: 'Reflexive needs se' },
    ] },
  { id: 'object-pronouns', name: 'Object Pronouns', level: 'A2', category: 'pronouns',
    scoba: `Direct: mă, te, îl, o, ne, vă, îi, le
  Indirect: îmi, îți, îi, ne, vă, le
  Position: BEFORE finite verbs`,
    exercises: [
      { type: 'fill', prompt: '___ (I) văd pe Maria.', answer: 'O', hint: 'Direct object, feminine singular → o' },
      { type: 'fill', prompt: '___ (to me) place muzica.', answer: 'Îmi', hint: 'Indirect object, 1st person → îmi' },
    ] },
  { id: 'future-tense', name: 'Future Tense', level: 'A2', category: 'verbs',
    scoba: `Two main forms:
  Colloquial: o să + subjunctive → "O să merg."
  Formal: voi/vei/va/vom/veți/vor + infinitive → "Voi merge."
  Informal: am să + subjunctive → "Am să merg."`,
    exercises: [
      { type: 'fill', prompt: 'Mâine ___ (o să / a merge) la mare.', answer: 'o să merg', hint: 'Colloquial future: o să + subjunctive' },
      { type: 'fill', prompt: 'Ei ___ (a pleca) mâine. (formal)', answer: 'vor pleca', hint: 'Formal future: vor + infinitive' },
    ] },

  // ── B1 ──
  { id: 'subjunctive-sa', name: 'Subjunctive with "să"', level: 'B1', category: 'verbs',
    scoba: `să + present conjugation (3rd person may change):
  Vreau SĂ MERG. Trebuie SĂ MĂNÂNC. Pot SĂ VIN.
  3rd person changes: merge → SĂ MEARGĂ, face → SĂ FACĂ, vine → SĂ VINĂ
  Replaces infinitive in most subordinate clauses!`,
    exercises: [
      { type: 'fill', prompt: 'Vreau ___ (să/a merge) la cinema.', answer: 'să merg', hint: 'Romanian uses subjunctive, not infinitive' },
      { type: 'fill', prompt: 'Trebuie ___ (el/a face) temele.', answer: 'să facă', hint: '3rd person subjunctive: face → facă' },
      { type: 'error', prompt: 'Vreau că merg acasă.', answer: 'Vreau să merg acasă.', hint: 'After vreau, use să not că' },
    ] },
  { id: 'conditional', name: 'Conditional Mood', level: 'B1', category: 'verbs',
    scoba: `aș/ai/ar/am/ați/ar + infinitive:
  Aș merge. (I would go.) Ar fi bine. (It would be good.)`,
    exercises: [
      { type: 'fill', prompt: '___ (eu / a vrea) o cafea.', answer: 'Aș vrea', hint: 'Conditional: aș + infinitive' },
      { type: 'fill', prompt: 'Dacă ___ (el / a putea), ar veni.', answer: 'ar putea', hint: '3rd person conditional: ar + infinitive' },
    ] },
  { id: 'clitic-doubling', name: 'Clitic Doubling', level: 'B1', category: 'pronouns',
    scoba: `Animate accusative objects with "pe" require clitic doubling:
  Îl văd pe Ion. (I see Ion.) — clitic "îl" + "pe Ion"
  O văd pe Maria. — clitic "o" + "pe Maria"`,
    exercises: [
      { type: 'fill', prompt: '___ văd pe profesor.', answer: 'Îl', hint: 'Masculine accusative clitic: îl' },
      { type: 'error', prompt: 'Văd pe Maria.', answer: 'O văd pe Maria.', hint: 'Pe + proper name requires clitic doubling' },
    ] },
  { id: 'relative-pronouns', name: 'Relative Pronouns', level: 'B1', category: 'pronouns',
    scoba: `care (who/which), pe care (whom), al cărui/a cărei (whose),
  căruia/căreia (to whom)`,
    exercises: [
      { type: 'fill', prompt: 'Omul ___ a venit este profesorul meu.', answer: 'care', hint: 'Subject relative pronoun' },
      { type: 'fill', prompt: 'Cartea ___ am citit-o este bună.', answer: 'pe care', hint: 'Object relative pronoun: pe care' },
    ] },
  { id: 'passive-voice', name: 'Passive Voice', level: 'B1', category: 'verbs',
    scoba: `a fi + past participle: "Cartea este citită de mulți."
  Passive with "se": "Se vorbește mult despre asta."`,
    exercises: [
      { type: 'fill', prompt: 'Ușa ___ (a fi / a deschide).', answer: 'este deschisă', hint: 'Passive: este + past participle (feminine)' },
      { type: 'fill', prompt: '___ (se/a vorbi) româna aici.', answer: 'Se vorbește', hint: 'Impersonal passive with se' },
    ] },

  // ── B2 ──
  { id: 'presumptive', name: 'Presumptive Mood', level: 'B2', category: 'verbs',
    scoba: `Expresses probability — unique to Romanian:
  Present: o fi + gerund → "O fi dormind." (Probably sleeping.)
  Past: o fi + past participle → "O fi plecat." (Probably left.)`,
    exercises: [
      { type: 'fill', prompt: 'Nu răspunde. ___ dormind.', answer: 'O fi', hint: 'Present presumptive: o fi + gerund' },
      { type: 'fill', prompt: '___ plecat deja.', answer: 'O fi', hint: 'Past presumptive: o fi + past participle' },
    ] },
  { id: 'gerund', name: 'Gerund (-ând/-ind)', level: 'B2', category: 'verbs',
    scoba: `Formation: -ând (Groups I, II, III), -ind (Group IV)
  mergând (going), venind (coming), citind (reading)`,
    exercises: [
      { type: 'fill', prompt: '___ (a merge) pe stradă, am văzut un prieten.', answer: 'Mergând', hint: 'Gerund of a merge: mergând' },
      { type: 'transform', prompt: 'Form the gerund: "a citi"', answer: 'citind', hint: 'Group IV: -ind' },
    ] },
  { id: 'conditional-perfect', name: 'Conditional Perfect', level: 'B2', category: 'verbs',
    scoba: `aș fi / ai fi / ar fi + past participle:
  "Aș fi mers." (I would have gone.)
  "Ar fi știut." (He would have known.)`,
    exercises: [
      { type: 'fill', prompt: 'Dacă știam, ___ (eu/a veni).', answer: 'aș fi venit', hint: 'Conditional perfect: aș fi + participle' },
    ] },
  { id: 'topicalization', name: 'Topicalization & Word Order', level: 'B2', category: 'syntax',
    scoba: `SVO is default, but flexible word order signals emphasis:
  "Pe el l-am văzut." (HIM I saw.)
  "Cartea o citește Maria." (It's the book that Maria reads.)`,
    exercises: [
      { type: 'transform', prompt: 'Emphasize "Ion": "Am văzut pe Ion."', answer: 'Pe Ion l-am văzut.', hint: 'Front the object + clitic' },
    ] },

  // ── C1 ──
  { id: 'literary-tenses', name: 'Literary Tenses (perfectul simplu)', level: 'C1', category: 'verbs',
    scoba: `Simple perfect (rare in speech, literary):
  "Merse." (He went.) "Văzu." (He saw.)
  Mostly in southern dialects and literature.`,
    exercises: [
      { type: 'fill', prompt: '"Privi cerul și ___." (a zâmbi, literary)', answer: 'zâmbi', hint: 'Simple perfect, literary form' },
    ] },
  { id: 'advanced-presumptive', name: 'Advanced Presumptive', level: 'C1', category: 'verbs',
    scoba: `Complex forms: "Va fi fost." (He probably was.)
  "O fi știind." (He probably knows.)`,
    exercises: [
      { type: 'fill', prompt: 'La ora aceea, ___ deja acasă.', answer: 'va fi fost', hint: 'Past presumptive with va fi' },
    ] },
  { id: 'nominalization', name: 'Nominalization', level: 'C1', category: 'nouns',
    scoba: `Transforming verbs/adjectives to nouns:
  a veni → venirea, frumos → frumusețea, a citi → cititul`,
    exercises: [
      { type: 'transform', prompt: 'Nominalize: "a citi"', answer: 'cititul', hint: 'Verbal noun: infinitive + definite article' },
    ] },

  // ── C2 ──
  { id: 'stylistic-variation', name: 'Stylistic Variation', level: 'C2', category: 'syntax',
    scoba: `Choosing between grammatical alternatives for effect:
  Active vs passive, long vs short infinitive, word order choices`,
    exercises: [
      { type: 'transform', prompt: 'Rewrite formally: "O să plecăm mâine."', answer: 'Vom pleca mâine.', hint: 'Use formal future with voi/vom' },
    ] },
  { id: 'dialectal-forms', name: 'Dialectal Variation', level: 'C2', category: 'verbs',
    scoba: `Understanding non-standard forms:
  Moldavian: "hi" for "fi", vocabulary differences
  Transylvanian: Hungarian-influenced vocabulary
  Banat: Serbian/Hungarian influences`,
    exercises: [
      { type: 'fill', prompt: 'The Moldavian form "hi" corresponds to standard ___', answer: 'fi', hint: 'Moldavian dialectal variant of a fi' },
    ] },
];

// ─── Tutor Class ────────────────────────────────────────────────────────────

class GrammarTutor {
  constructor() {
    this.dir = dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    const p = loadProfile(this.dir, studentId);
    if (!p.level) p.level = 'A1';
    if (!p.skills) p.skills = {};
    if (!p.assessments) p.assessments = [];
    return p;
  }

  _save(p) { saveProfile(this.dir, p); }

  setLevel(studentId, level) {
    const lv = level.toUpperCase();
    if (!CEFR.includes(lv)) throw new Error('Invalid CEFR level: ' + level);
    const p = this.getProfile(studentId);
    p.level = lv;
    this._save(p);
    return { studentId, level: lv };
  }

  getTopicCatalog(level) {
    let topics = TOPICS;
    if (level) {
      const lv = level.toUpperCase();
      topics = TOPICS.filter(t => t.level === lv);
    }
    return topics.map(t => ({ id: t.id, name: t.name, level: t.level, category: t.category }));
  }

  getScoba(topicId) {
    const t = TOPICS.find(t => t.id === topicId);
    if (!t) throw new Error('Unknown topic: ' + topicId);
    return { id: t.id, name: t.name, level: t.level, scoba: t.scoba };
  }

  generateLesson(studentId, topicId) {
    const p = this.getProfile(studentId);
    const t = topicId
      ? TOPICS.find(t => t.id === topicId)
      : this._nextTopic(p);
    if (!t) throw new Error('No topic found');
    const exercises = pick(t.exercises, Math.min(3, t.exercises.length));
    return {
      studentId, level: p.level,
      topic: { id: t.id, name: t.name, level: t.level, category: t.category },
      scoba: t.scoba,
      exercises: exercises.map((e, i) => ({ index: i, type: e.type, prompt: e.prompt, hint: e.hint })),
    };
  }

  generateExercise(studentId, topicId, type) {
    const p = this.getProfile(studentId);
    const t = topicId
      ? TOPICS.find(t => t.id === topicId)
      : this._nextTopic(p);
    if (!t) throw new Error('No topic found');
    let pool = t.exercises;
    if (type) pool = pool.filter(e => e.type === type);
    if (!pool.length) pool = t.exercises;
    const ex = pick(pool, 1)[0];
    const idx = t.exercises.indexOf(ex);
    return {
      topicId: t.id, topicName: t.name,
      index: idx, type: ex.type, prompt: ex.prompt, hint: ex.hint,
    };
  }

  checkAnswer(topicId, exerciseIndex, answer) {
    const t = TOPICS.find(t => t.id === topicId);
    if (!t) throw new Error('Unknown topic: ' + topicId);
    const ex = t.exercises[exerciseIndex];
    if (!ex) throw new Error('Invalid exercise index: ' + exerciseIndex);
    const correct = norm(answer) === norm(ex.answer);
    return {
      topicId, exerciseIndex, correct,
      yourAnswer: answer, expected: ex.answer,
      hint: correct ? null : ex.hint,
    };
  }

  recordAssessment(studentId, topicId, grade) {
    grade = Number(grade);
    if (![1, 2, 3, 4].includes(grade)) throw new Error('Grade must be 1 (Again), 2 (Hard), 3 (Good), or 4 (Easy).');
    const t = TOPICS.find(t => t.id === topicId);
    if (!t) throw new Error(`Unknown topic: ${topicId}`);
    const p = this.getProfile(studentId);
    if (!p.skills[topicId]) {
      p.skills[topicId] = { D: 5, S: 1, lastReview: null, attempts: [] };
    }
    const sk = p.skills[topicId];
    sk.S = fsrsUpdateStability(sk.S, sk.D, grade);
    sk.D = fsrsUpdateDifficulty(sk.D, grade);
    sk.lastReview = today();
    sk.attempts.push({ date: today(), score: grade >= 3 ? 1 : 0, total: 1 });
    p.assessments.push({ topicId, grade, date: today() });
    this._save(p);
    const mastery = calcMastery(sk.attempts);
    return {
      topicId, grade,
      gradeLabel: ['', 'Again', 'Hard', 'Good', 'Easy'][grade],
      D: sk.D, S: sk.S,
      nextReview: fsrsNextReview(sk.S, DEFAULT_RETENTION),
      mastery, masteryLabel: masteryLabel(mastery),
    };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const levelTopics = TOPICS.filter(t => t.level === level);
    const skills = levelTopics.map(t => {
      const sk = p.skills[t.id];
      if (!sk) return { id: t.id, name: t.name, status: 'not-started', mastery: 0 };
      const mastery = calcMastery(sk.attempts);
      const daysSince = sk.lastReview ? Math.floor((Date.now() - new Date(sk.lastReview).getTime()) / 86400000) : null;
      const R = sk.lastReview ? fsrsRetention(daysSince, sk.S) : 0;
      return {
        id: t.id, name: t.name, mastery, status: masteryLabel(mastery),
        D: sk.D, S: sk.S, R: Math.round(R * 100) / 100,
        nextReview: fsrsNextReview(sk.S, DEFAULT_RETENTION),
        dueForReview: R < DEFAULT_RETENTION,
      };
    });
    const totalMastery = skills.length ? Math.round(skills.reduce((s, sk) => s + sk.mastery, 0) / skills.length * 100) / 100 : 0;
    return { studentId, level, totalMastery, skills };
  }

  getNextTopics(studentId, count) {
    count = count || 5;
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const levelTopics = TOPICS.filter(t => t.level === level);
    const due = [];
    const notStarted = [];
    for (const t of levelTopics) {
      const sk = p.skills[t.id];
      if (!sk) { notStarted.push({ id: t.id, name: t.name, reason: 'not-started' }); continue; }
      const daysSince = sk.lastReview ? Math.floor((Date.now() - new Date(sk.lastReview).getTime()) / 86400000) : 999;
      const R = fsrsRetention(daysSince, sk.S);
      if (R < DEFAULT_RETENTION) {
        due.push({ id: t.id, name: t.name, reason: 'due-for-review', R: Math.round(R * 100) / 100 });
      }
    }
    return { studentId, level, next: [...due, ...notStarted].slice(0, count) };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const recentAssessments = (p.assessments || []).slice(-10).reverse();
    const byCategory = {};
    for (const t of TOPICS.filter(t => t.level === (p.level || 'A1'))) {
      if (!byCategory[t.category]) byCategory[t.category] = { total: 0, mastered: 0 };
      byCategory[t.category].total++;
      const sk = p.skills[t.id];
      if (sk && calcMastery(sk.attempts) >= MASTERY_THRESHOLD) byCategory[t.category].mastered++;
    }
    return {
      studentId, level: p.level || 'A1',
      totalMastery: progress.totalMastery,
      categoryBreakdown: byCategory,
      recentAssessments,
      topicCount: progress.skills.length,
      masteredCount: progress.skills.filter(s => s.mastery >= MASTERY_THRESHOLD).length,
    };
  }

  listStudents() {
    return listProfiles(this.dir);
  }

  _nextTopic(p) {
    const level = p.level || 'A1';
    const levelTopics = TOPICS.filter(t => t.level === level);
    for (const t of levelTopics) {
      const sk = p.skills[t.id];
      if (sk && sk.lastReview) {
        const days = Math.floor((Date.now() - new Date(sk.lastReview).getTime()) / 86400000);
        if (fsrsRetention(days, sk.S) < DEFAULT_RETENTION) return t;
      }
    }
    for (const t of levelTopics) {
      if (!p.skills[t.id]) return t;
    }
    return levelTopics.reduce((best, t) => {
      const m = p.skills[t.id] ? calcMastery(p.skills[t.id].attempts) : 0;
      const bm = best && p.skills[best.id] ? calcMastery(p.skills[best.id].attempts) : 1;
      return m < bm ? t : best;
    }, levelTopics[0]);
  }
}

// ─── CLI ────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const tutor = new GrammarTutor();
  runCLI((cmd, args, out) => {
    const sid = args[1];
    switch (cmd) {
      case 'start':
        if (!sid) throw new Error('Usage: start <studentId>');
        out(tutor.getProfile(sid));
        break;
      case 'set-level':
        if (!sid || !args[2]) throw new Error('Usage: set-level <studentId> <A1|A2|B1|B2|C1|C2>');
        out(tutor.setLevel(sid, args[2].toUpperCase()));
        break;
      case 'lesson':
        if (!sid) throw new Error('Usage: lesson <studentId> [topicId]');
        out(tutor.generateLesson(sid, args[2] || null));
        break;
      case 'exercise':
        if (!sid) throw new Error('Usage: exercise <studentId> [topicId] [fill|error|transform]');
        out(tutor.generateExercise(sid, args[2] || null, args[3] || null));
        break;
      case 'check':
        if (!args[1] || !args[2] || !args[3]) throw new Error('Usage: check <topicId> <exerciseIndex> <answer...>');
        out(tutor.checkAnswer(args[1], Number(args[2]), args.slice(3).join(' ')));
        break;
      case 'record':
        if (!sid || !args[2] || !args[3]) throw new Error('Usage: record <studentId> <topicId> <grade 1-4>');
        out(tutor.recordAssessment(sid, args[2], Number(args[3])));
        break;
      case 'progress':
        if (!sid) throw new Error('Usage: progress <studentId>');
        out(tutor.getProgress(sid));
        break;
      case 'report':
        if (!sid) throw new Error('Usage: report <studentId>');
        out(tutor.getReport(sid));
        break;
      case 'next':
        if (!sid) throw new Error('Usage: next <studentId> [count]');
        out(tutor.getNextTopics(sid, args[2] ? Number(args[2]) : 5));
        break;
      case 'topics':
        out(tutor.getTopicCatalog(args[1] || null));
        break;
      case 'scoba':
        if (!args[1]) throw new Error('Usage: scoba <topicId>');
        out(tutor.getScoba(args[1]));
        break;
      case 'students':
        out({ students: tutor.listStudents() });
        break;
      case 'help':
        out({ info: 'Use one of the commands listed in SKILL.md' });
        break;
      default:
        out({
          commands: {
            'start <studentId>': 'Load or create a student profile',
            'set-level <studentId> <level>': 'Set CEFR level (A1-C2)',
            'lesson <studentId> [topicId]': 'Generate a full lesson with SCOBA + exercises',
            'exercise <studentId> [topicId] [type]': 'Generate a single exercise',
            'check <topicId> <exerciseIndex> <answer>': 'Check an answer',
            'record <studentId> <topicId> <grade>': 'Record assessment (1=Again 2=Hard 3=Good 4=Easy)',
            'progress <studentId>': 'View progress for current level',
            'report <studentId>': 'Full student report with category breakdown',
            'next <studentId> [count]': 'Get next recommended topics',
            'topics [level]': 'List all grammar topics, optionally filtered by level',
            'scoba <topicId>': 'Show the SCOBA decision flowchart for a topic',
            'students': 'List all student profiles',
          },
        });
    }
  });
}

module.exports = { GrammarTutor, TOPICS };
