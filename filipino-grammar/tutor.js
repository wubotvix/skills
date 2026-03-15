#!/usr/bin/env node
// Filipino Grammar Tutor — discovery-based grammar teaching with FSRS spaced repetition
'use strict';

const core = require('../_lib/core');
const { CEFR, MASTERY_THRESHOLD, DEFAULT_RETENTION,
        dataDir, loadProfile, saveProfile, listProfiles,
        calcMastery, masteryLabel,
        fsrsRetention, fsrsNextReview, fsrsUpdateStability, fsrsUpdateDifficulty,
        shuffle, pick, norm, today, runCLI } = core;

const SKILL_NAME = 'filipino-grammar';

// ─── Embedded Grammar Data ──────────────────────────────────────────────────

const TOPICS = [
  // ── A1 ──
  { id: 'pronouns-basic', name: 'Personal Pronouns', level: 'A1', category: 'pronouns',
    scoba: `Filipino pronouns have three forms based on case:
  → ANG form (topic/nominative): ako, ikaw/ka, siya, kami, tayo, kayo, sila
  → NG form (possessor/non-topic actor): ko, mo, niya, namin, natin, ninyo, nila
  → SA form (oblique/direction): akin, iyo, kanya, amin, atin, inyo, kanila
  Note: "tayo" = we (inclusive), "kami" = we (exclusive)`,
    exercises: [
      { type: 'fill', prompt: '___ (Ako/Ko) ang kumain ng mangga.', answer: 'Ako', hint: 'Topic/nominative → ang form → Ako' },
      { type: 'fill', prompt: 'Binasa ___ (ako/ko) ang libro.', answer: 'ko', hint: 'Non-topic actor (OF verb) → ng form → ko' },
      { type: 'fill', prompt: 'Ibigay mo sa ___ (ako/akin).', answer: 'akin', hint: 'Direction/oblique → sa form → akin' },
      { type: 'error', prompt: 'Ko ang kumain ng mangga.', answer: 'Ako ang kumain ng mangga.', hint: 'Topic of sentence needs ang-form pronoun' },
    ] },
  { id: 'ang-ng-sa-basic', name: 'Case Markers (ang/ng/sa)', level: 'A1', category: 'markers',
    scoba: `Three case marker sets:
  → ANG (nominative/topic): ang bata, si Maria, sina Pedro
  → NG (genitive/non-topic): ng bata, ni Maria, nina Pedro
  → SA (oblique/location): sa bata, kay Maria, kina Pedro
  ANG marks the topic — the focused element of the sentence.`,
    exercises: [
      { type: 'fill', prompt: 'Kumain ___ (ang/ng) bata ng mangga.', answer: 'ang', hint: 'The child is the topic (actor focus) → ang' },
      { type: 'fill', prompt: 'Kinain ___ (ang/ng) bata ang mangga.', answer: 'ng', hint: 'With object focus, the actor uses ng' },
      { type: 'fill', prompt: 'Pumunta siya ___ (ang/sa) palengke.', answer: 'sa', hint: 'Location/direction → sa' },
      { type: 'error', prompt: 'Kumain ng bata ang mangga.', answer: 'Kumain ang bata ng mangga.', hint: 'In actor focus, the doer is marked with ang' },
    ] },
  { id: 'um-verbs-basic', name: 'Basic -um- Verbs', level: 'A1', category: 'verbs',
    scoba: `-um- infix goes before the first vowel of the root:
  kain → kumain (eat), inom → uminom (drink)
  punta → pumunta (go), takbo → tumakbo (run)
  Completed and infinitive forms are the same for -um-`,
    exercises: [
      { type: 'fill', prompt: '___ (kain → -um-) ako ng almusal.', answer: 'Kumain', hint: 'Insert -um- before the first vowel: k-um-ain' },
      { type: 'fill', prompt: '___ (punta → -um-) siya sa eskwela.', answer: 'Pumunta', hint: 'Insert -um- before u: p-um-unta' },
      { type: 'fill', prompt: '___ (takbo → -um-) ang bata.', answer: 'Tumakbo', hint: 'Insert -um- before a: t-um-akbo' },
    ] },
  { id: 'mag-verbs-basic', name: 'Basic mag- Verbs', level: 'A1', category: 'verbs',
    scoba: `mag- prefix for actor focus verbs:
  Infinitive: mag- + root → magluto, mag-aral, maglinis
  Completed: nag- + root → nagluto, nag-aral, naglinis
  These are actor-focus verbs (the doer is the topic).`,
    exercises: [
      { type: 'fill', prompt: '___ (luto → mag-) siya ng pagkain.', answer: 'Nagluto', hint: 'Completed: nag- + root → nagluto' },
      { type: 'fill', prompt: 'Gusto kong ___ (aral → mag-).', answer: 'mag-aral', hint: 'Infinitive: mag- + root → mag-aral' },
      { type: 'error', prompt: 'Magluto siya ng pagkain kahapon.', answer: 'Nagluto siya ng pagkain kahapon.', hint: 'Kahapon (yesterday) = completed → nag-' },
    ] },
  { id: 'may-mayroon', name: 'May/Mayroon/Wala (Existence)', level: 'A1', category: 'existence',
    scoba: `Existence in Filipino:
  → MAY + noun (short form): "May libro sa mesa." (There is a book on the table.)
  → MAYROON + marker: "Mayroon akong libro." (I have a book.)
  → WALA (negation): "Wala akong libro." (I don't have a book.)
  May/Mayroon = there is/have; Wala = there is not/don't have`,
    exercises: [
      { type: 'fill', prompt: '___ (May/Wala) pera ako.', answer: 'May', hint: 'Positive existence → May' },
      { type: 'fill', prompt: '___ (Mayroon/Wala) akong sasakyan.', answer: 'Mayroon', hint: 'Positive with pronoun → Mayroon + -ng + pronoun' },
      { type: 'fill', prompt: '___ (May/Wala) akong alam.', answer: 'Wala', hint: 'Negative existence → Wala' },
    ] },
  { id: 'hindi-negation', name: 'Hindi (Negation)', level: 'A1', category: 'particles',
    scoba: `Hindi negates verbs and adjectives:
  → "Hindi ako kumain." (I did not eat.)
  → "Hindi maganda." (Not beautiful.)
  Hindi + na = no longer: "Hindi na siya kumain."
  Hindi + pa = not yet: "Hindi pa ako kumakain."`,
    exercises: [
      { type: 'fill', prompt: '___ (Hindi/Wala) siya pumunta sa eskwela.', answer: 'Hindi', hint: 'Negating a verb → Hindi' },
      { type: 'fill', prompt: '___ (Hindi/Wala) akong pera.', answer: 'Wala', hint: 'Negating existence/possession → Wala' },
      { type: 'error', prompt: 'Wala siya kumain.', answer: 'Hindi siya kumain.', hint: 'Use hindi (not wala) to negate verbs' },
    ] },

  // ── A2 ──
  { id: 'four-aspects', name: 'Four Verb Aspects', level: 'A2', category: 'verbs',
    scoba: `Filipino has aspects, not tenses:
  → Infinitive: kumain / magluto (neutral/command)
  → Completed: kumain / nagluto (action finished)
  → Incompleted: kumakain / nagluluto (action ongoing)
  → Contemplated: kakain / magluluto (action not yet started)
  Key: Has it started? → No = contemplated. Yes → Finished? → Yes = completed, No = incompleted.`,
    exercises: [
      { type: 'fill', prompt: '___ (kain, contemplated) ako bukas.', answer: 'Kakain', hint: 'Contemplated -um-: CV reduplication → kakain' },
      { type: 'fill', prompt: '___ (luto, incompleted) siya ngayon.', answer: 'Nagluluto', hint: 'Incompleted mag-: nag- + CV redup + root → nagluluto' },
      { type: 'fill', prompt: '___ (aral, completed) kami kahapon.', answer: 'Nag-aral', hint: 'Completed mag-: nag- + root → nag-aral' },
      { type: 'transform', prompt: 'Change to contemplated: "Nagluto siya ng pagkain."', answer: 'Magluluto siya ng pagkain.', hint: 'Contemplated mag-: mag- + CV redup + root' },
    ] },
  { id: 'object-focus-in', name: 'Object Focus (-in)', level: 'A2', category: 'verbs',
    scoba: `Object focus: the object/patient is the topic (marked by ang).
  -in suffix/infix pattern:
  → Infinitive: kainin, basahin
  → Completed: kinain, binasa (in- infix or prefix)
  → Incompleted: kinakain, binabasa
  → Contemplated: kakainin, babasahin`,
    exercises: [
      { type: 'fill', prompt: '___ (kain → -in, completed) ng bata ang mangga.', answer: 'Kinain', hint: 'Completed: k-in-ain → kinain' },
      { type: 'fill', prompt: '___ (basa → -in, incompleted) niya ang libro.', answer: 'Binabasa', hint: 'Incompleted: b-in-a + CV redup → binabasa' },
      { type: 'fill', prompt: '___ (luto → -in, contemplated) ko ang adobo.', answer: 'Lulutuin', hint: 'Contemplated: CV redup + root + -in → lulutuin' },
    ] },
  { id: 'po-opo-system', name: 'Po/Opo System', level: 'A2', category: 'particles',
    scoba: `Po/Opo = respect markers:
  → PO: added to statements/questions: "Kumain na po ako."
  → OPO: replaces "oo" (yes) for respect: "Opo, kumain na po."
  Use with: elders, parents, teachers, bosses, strangers
  Do NOT use with: close friends, younger people, peers
  Position: after the verb or at end of clause`,
    exercises: [
      { type: 'fill', prompt: '"Kumain ka na ba?" (formal response) "___."', answer: 'Opo, kumain na po ako', hint: 'Opo replaces oo; add po for respect' },
      { type: 'error', prompt: 'Gusto ko ng tubig. (to a teacher)', answer: 'Gusto ko po ng tubig.', hint: 'Add po when speaking to teachers/elders' },
    ] },
  { id: 'linkers-na-ng', name: 'Linkers (na / -ng)', level: 'A2', category: 'structure',
    scoba: `Linkers connect modifiers to nouns:
  → NA: after consonants (except n): "mabait na bata"
  → -NG: after vowels or n: "magandang umaga", "malaking bahay"
  Both word orders OK: "masarap na pagkain" = "pagkain na masarap"`,
    exercises: [
      { type: 'fill', prompt: 'maganda___ umaga', answer: 'ng', hint: 'maganda ends in vowel a → -ng' },
      { type: 'fill', prompt: 'mabait ___ bata', answer: 'na', hint: 'mabait ends in consonant t → na' },
      { type: 'fill', prompt: 'malaki___ bahay', answer: 'ng', hint: 'malaki ends in vowel i → -ng' },
    ] },
  { id: 'mga-plural', name: 'Mga (Plural Marker)', level: 'A2', category: 'structure',
    scoba: `Mga (pronounced "manga") marks plurality:
  → "ang bata" (the child) → "ang mga bata" (the children)
  → "libro" → "mga libro" (books)
  Filipino nouns do not change form for plural — mga does the work.`,
    exercises: [
      { type: 'fill', prompt: 'Ang ___ (plural marker) bata ay naglalaro.', answer: 'mga', hint: 'Use mga before the noun for plural' },
      { type: 'transform', prompt: 'Make plural: "Ang guro ay mabait."', answer: 'Ang mga guro ay mabait.', hint: 'Add mga before the noun' },
    ] },

  // ── B1 ──
  { id: 'locative-focus-an', name: 'Locative Focus (-an)', level: 'B1', category: 'verbs',
    scoba: `Locative focus: the location/direction is the topic.
  -an suffix pattern:
  → Infinitive: bilhan, takbuhan
  → Completed: binilhan, tinakbuhan
  → Incompleted: binibilhan, tinatakbuhan
  → Contemplated: bibilhan, tatakbuhan`,
    exercises: [
      { type: 'fill', prompt: '___ (bili → -an, completed) ko ang tindahan.', answer: 'Binilhan', hint: 'Completed: in- infix + root + -an → binilhan' },
      { type: 'fill', prompt: '___ (luto → -an, contemplated) niya ang kusina.', answer: 'Lulutuan', hint: 'Contemplated: CV redup + root + -an → lulutuan' },
    ] },
  { id: 'benefactive-focus-i', name: 'Benefactive Focus (i-)', level: 'B1', category: 'verbs',
    scoba: `Benefactive focus: the beneficiary is the topic.
  i- prefix pattern:
  → Infinitive: ibigay, iluto
  → Completed: ibinigay, iniluto
  → Incompleted: ibinibigay, iniluluto
  → Contemplated: ibibigay, iluluto`,
    exercises: [
      { type: 'fill', prompt: '___ (bigay → i-, completed) ng nanay ang pagkain sa bata.', answer: 'Ibinigay', hint: 'Completed i-: i- + -in- infix + root → ibinigay' },
      { type: 'fill', prompt: '___ (luto → i-, contemplated) ko ito para sa iyo.', answer: 'Iluluto', hint: 'Contemplated i-: i- + CV redup + root → iluluto' },
    ] },
  { id: 'maka-makapag', name: 'Ability (maka-/makapag-)', level: 'B1', category: 'verbs',
    scoba: `Ability/potential verbs:
  → maka- + root (for -um- verbs): makakain = can eat
  → makapag- + root (for mag- verbs): makapag-aral = can study
  Completed: naka- / nakapag-: nakakain, nakapag-aral
  Negative: hindi maka-/makapag-: "Hindi ako makakain."`,
    exercises: [
      { type: 'fill', prompt: 'Hindi ako ___ (punta → maka-) sa party.', answer: 'makapunta', hint: 'Ability: maka- + root → makapunta' },
      { type: 'fill', prompt: '___ (aral → nakapag-) na ba kayo?', answer: 'Nakapag-aral', hint: 'Completed ability: nakapag- + root → nakapag-aral' },
    ] },
  { id: 'complex-sentences', name: 'Complex Sentences', level: 'B1', category: 'structure',
    scoba: `Filipino conjunctions for complex sentences:
  → dahil/kasi = because: "Hindi ako pumunta dahil may sakit ako."
  → kung = if: "Kung libre ka, magkita tayo."
  → habang = while: "Habang nagluluto siya, nag-aaral ako."
  → kapag/pag = when (habitual): "Kapag umuulan, nananatili ako sa bahay."
  → pagkatapos = after: "Pagkatapos kumain, naglinis siya."`,
    exercises: [
      { type: 'fill', prompt: '___ (If) libre ka bukas, magkita tayo.', answer: 'Kung', hint: 'If = Kung' },
      { type: 'fill', prompt: 'Hindi ako pumunta ___ (because) may sakit ako.', answer: 'dahil', hint: 'Because = dahil (formal) or kasi (casual)' },
    ] },

  // ── B2 ──
  { id: 'instrumental-focus', name: 'Instrumental Focus (ipang-)', level: 'B2', category: 'verbs',
    scoba: `Instrumental focus: the instrument/tool is the topic.
  ipang- prefix pattern:
  → Infinitive: ipangkain, ipanggupit
  → Completed: ipinangkain, ipinanggupit
  → The instrument is marked by ang.
  "Ipinangkain ng bata ang kutsara." (The spoon was used by the child to eat.)`,
    exercises: [
      { type: 'fill', prompt: '___ (gupit → ipang-, completed) niya ang gunting.', answer: 'Ipinanggupit', hint: 'Completed: ipinang- + root → ipinanggupit' },
    ] },
  { id: 'causative-magpa', name: 'Causative (magpa-/pa-...-in)', level: 'B2', category: 'verbs',
    scoba: `Causative: making someone do something.
  → magpa- (AF): "Nagpagupit siya." (He had his hair cut.)
  → pa-...-in (OF): "Pagupitan mo siya." (Cut his hair for him.)
  The causer is the topic in magpa-; the caused action receiver in pa-...-in.`,
    exercises: [
      { type: 'fill', prompt: '___ (gupit → magpa-, completed) ako kahapon.', answer: 'Nagpagupit', hint: 'Completed causative: nagpa- + root → nagpagupit' },
    ] },
  { id: 'advanced-particles', name: 'Advanced Particles', level: 'B2', category: 'particles',
    scoba: `Key Filipino particles:
  → daw/raw = reportedly: "Maganda raw doon." (They say it's nice there.)
  → sana = wish/hope: "Sana pumunta ka." (I hope you go.)
  → naman = on the other hand/too: "Ikaw naman?" (How about you?)
  → pala = realization: "Ganoon pala!" (So that's how it is!)
  → yata = uncertainty: "Uulan yata." (It might rain.)
  → ba = question: "Kumain ka na ba?" (Have you eaten?)`,
    exercises: [
      { type: 'fill', prompt: 'Maganda ___ (reportedly) ang Palawan.', answer: 'raw', hint: 'Raw after vowels, daw after consonants' },
      { type: 'fill', prompt: '___ (I hope) pumasa ako sa exam.', answer: 'Sana', hint: 'Sana = wish/hope' },
    ] },
  { id: 'reduplication', name: 'Reduplication', level: 'B2', category: 'structure',
    scoba: `Filipino uses reduplication for various meanings:
  → Full reduplication (intensity/each): "araw-araw" (every day), "dahan-dahan" (slowly/carefully)
  → Partial/CV reduplication (aspect): "kakain" (will eat), "nagluluto" (is cooking)
  → Reduplication + ma- (somewhat): "maganda-ganda" (somewhat beautiful)`,
    exercises: [
      { type: 'fill', prompt: 'Pumupunta siya ___ (every day).', answer: 'araw-araw', hint: 'Full reduplication of araw (day)' },
      { type: 'fill', prompt: 'Maglakad ka nang ___ (slowly).', answer: 'dahan-dahan', hint: 'Full reduplication of dahan → dahan-dahan' },
    ] },

  // ── C1 ──
  { id: 'register-shifting', name: 'Register Shifting', level: 'C1', category: 'register',
    scoba: `Filipino register levels:
  → Very casual (barkada): "'Di ko alam, eh."
  → Casual: "Hindi ko alam."
  → Formal (with po): "Hindi ko po alam."
  → Very formal/literary: "Wala po akong nalalaman tungkol dito."
  Connectors shift too: kasi → dahil → sapagkat → sa kadahilanang`,
    exercises: [
      { type: 'transform', prompt: 'Make formal: "Gusto ko ng tubig."', answer: 'Gusto ko po ng tubig.', hint: 'Add po for formal register' },
      { type: 'transform', prompt: 'Make literary: "Hindi ko alam kasi busy ako."', answer: 'Hindi ko nalalaman sapagkat abala ako.', hint: 'Use formal vocabulary and connectors' },
    ] },
  { id: 'discourse-markers', name: 'Discourse Markers', level: 'C1', category: 'structure',
    scoba: `Formal Filipino discourse markers:
  → sa katunayan = in fact
  → sa kabilang banda = on the other hand
  → bukod dito = in addition
  → sa kabuuan = in conclusion
  → gayunpaman = however
  → samakatuwid = therefore`,
    exercises: [
      { type: 'fill', prompt: '___ (However), hindi pa rin naresolba ang problema.', answer: 'Gayunpaman', hint: 'Gayunpaman = however' },
      { type: 'fill', prompt: '___ (In conclusion), kailangan nating kumilos.', answer: 'Sa kabuuan', hint: 'Sa kabuuan = in conclusion' },
    ] },
  { id: 'complex-conditionals', name: 'Complex Conditionals', level: 'C1', category: 'structure',
    scoba: `Filipino conditional patterns:
  → Simple: "Kung uulan, hindi ako pupunta."
  → Counterfactual (past): "Kung pumunta lang sana ako, naabutan ko siya."
  → Regret: "Sana nag-aral ako." (I wish I had studied.)
  → kung... sana = if only: "Kung alam ko lang sana..."`,
    exercises: [
      { type: 'fill', prompt: '___ (If only) nag-aral ako, pumasa sana ako.', answer: 'Kung', hint: 'Kung + lang sana for counterfactuals' },
    ] },

  // ── C2 ──
  { id: 'academic-filipino', name: 'Academic Filipino', level: 'C2', category: 'register',
    scoba: `Academic Filipino uses:
  → Nominalization: pagkain (eating), pag-aaral (studying), pagkakaisa (unity)
  → Formal vocabulary: nararapat (appropriate), subalit (but), samakatuwid (therefore)
  → Complex verb forms with multiple affixes
  → Passive constructions preferred in formal writing`,
    exercises: [
      { type: 'transform', prompt: 'Nominalize: "Nag-aral siya nang mabuti."', answer: 'Ang kanyang pag-aaral ay naging mabuti.', hint: 'pag- + CV reduplication → pag-aaral (nominalization)' },
    ] },
  { id: 'code-switching-grammar', name: 'Code-Switching Grammar (Taglish)', level: 'C2', category: 'register',
    scoba: `Taglish follows structural rules:
  → Filipino affixes attach to English roots: "nag-meeting", "mag-shopping", "i-submit"
  → Filipino function words + English content words: "Nag-decide na sila"
  → Clause-level switching OK: "Pumunta kami sa mall, and then we ate."
  → Avoid: mixing markers within a phrase: NOT "ang the book"`,
    exercises: [
      { type: 'fill', prompt: '___ (submit → i-, completed) na niya ang report.', answer: 'Ini-submit', hint: 'Filipino affix on English root: i- + -in- → ini-submit' },
    ] },
];

// ─── Tutor class ────────────────────────────────────────────────────────────

class GrammarTutor {
  constructor() {
    this.dir = dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(id) {
    const p = loadProfile(this.dir, id);
    if (!p.level) p.level = 'A1';
    if (!p.skills) p.skills = {};
    if (!p.sessions) p.sessions = [];
    return p;
  }

  setLevel(id, level) {
    const lv = level.toUpperCase();
    if (!CEFR.includes(lv)) throw new Error('Invalid CEFR level: ' + level);
    const p = this.getProfile(id);
    p.level = lv;
    saveProfile(this.dir, p);
    return { studentId: id, level: lv, topicsAvailable: this._topicsForLevel(lv).length };
  }

  _topicsForLevel(level) {
    const idx = CEFR.indexOf(level);
    return TOPICS.filter(t => CEFR.indexOf(t.level) <= idx);
  }

  generateLesson(id, topicId) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const available = this._topicsForLevel(level);

    let topic;
    if (topicId) {
      topic = TOPICS.find(t => t.id === topicId);
      if (!topic) throw new Error('Topic not found: ' + topicId);
    } else {
      // Prefer unmastered topics
      const mastered = new Set(Object.keys(p.skills).filter(k => {
        const sk = p.skills[k];
        return sk.history && sk.history.length && sk.history[sk.history.length - 1].grade >= 3;
      }));
      const candidates = available.filter(t => !mastered.has(t.id));
      topic = (candidates.length ? pick(candidates, 1) : pick(available, 1))[0];
    }

    const exercises = pick(topic.exercises, Math.min(3, topic.exercises.length));

    return {
      studentId: id, level, topic: { id: topic.id, name: topic.name, level: topic.level, category: topic.category },
      scoba: topic.scoba,
      exercises: exercises.map((e, i) => ({ index: i, ...e })),
    };
  }

  generateExercise(id, topicId, type) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const available = this._topicsForLevel(level);
    const topic = topicId ? TOPICS.find(t => t.id === topicId) : pick(available, 1)[0];
    if (!topic) throw new Error('Topic not found');

    let exercises = topic.exercises;
    if (type) exercises = exercises.filter(e => e.type === type);
    if (!exercises.length) exercises = topic.exercises;
    const ex = pick(exercises, 1)[0];
    return { studentId: id, topic: topic.id, topicName: topic.name, ...ex };
  }

  checkAnswer(topicId, exerciseIndex, answer) {
    const topic = TOPICS.find(t => t.id === topicId);
    if (!topic) throw new Error('Topic not found: ' + topicId);
    const ex = topic.exercises[exerciseIndex];
    if (!ex) throw new Error('Exercise not found at index: ' + exerciseIndex);

    const given = norm(answer);
    const expected = norm(ex.answer);
    const correct = given === expected;
    return { correct, given: answer, expected: ex.answer, hint: correct ? null : ex.hint };
  }

  recordGrade(id, topicId, grade) {
    grade = Number(grade);
    if (!isValidGrade(grade, 1, 4)) throw new Error('Grade must be 1-4');
    const p = this.getProfile(id);
    const topic = TOPICS.find(t => t.id === topicId);
    if (!topic) throw new Error('Topic not found: ' + topicId);

    if (!p.skills[topicId]) {
      p.skills[topicId] = { difficulty: 5, stability: 1, lastReview: null, nextReview: null, history: [] };
    }
    const sk = p.skills[topicId];
    sk.stability = fsrsUpdateStability(sk.stability || 1, sk.difficulty || 5, grade);
    sk.difficulty = fsrsUpdateDifficulty(sk.difficulty || 5, grade);
    sk.lastReview = today();
    const interval = fsrsNextReview(sk.stability);
    const next = new Date();
    next.setDate(next.getDate() + interval);
    sk.nextReview = next.toISOString().slice(0, 10);
    sk.history.push({ date: today(), grade });

    p.sessions.push({ date: today(), topicId, grade });
    saveProfile(this.dir, p);

    return {
      studentId: id, topicId, topicName: topic.name, grade,
      stability: sk.stability, difficulty: sk.difficulty,
      nextReview: sk.nextReview, interval,
    };
  }

  getProgress(id) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const available = this._topicsForLevel(level);
    const byCat = {};

    for (const t of available) {
      if (!byCat[t.category]) byCat[t.category] = { total: 0, studied: 0, mastered: 0, items: [] };
      const cat = byCat[t.category];
      cat.total++;
      const sk = p.skills[t.id];
      const lastGrade = sk && sk.history.length ? sk.history[sk.history.length - 1].grade : null;
      const status = !sk ? 'not-started' : lastGrade >= 4 ? 'mastered' : lastGrade >= 3 ? 'proficient' : lastGrade >= 2 ? 'developing' : 'emerging';
      if (sk) cat.studied++;
      if (lastGrade >= 3) cat.mastered++;
      cat.items.push({ id: t.id, name: t.name, status, lastGrade, nextReview: sk ? sk.nextReview : null });
    }

    return { studentId: id, level, categories: byCat };
  }

  getNextTopics(id, count) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const available = this._topicsForLevel(level);
    const td = today();
    const due = [];
    const unstarted = [];

    for (const t of available) {
      const sk = p.skills[t.id];
      if (!sk) { unstarted.push({ id: t.id, name: t.name, level: t.level, reason: 'new' }); continue; }
      if (sk.nextReview && sk.nextReview <= td) {
        due.push({ id: t.id, name: t.name, level: t.level, nextReview: sk.nextReview, reason: 'due' });
      }
    }

    const n = parseInt(count, 10) || 5;
    return { studentId: id, date: td, due: due.slice(0, n), unstarted: unstarted.slice(0, n), totalDue: due.length, totalUnstarted: unstarted.length };
  }

  getReport(id) {
    const progress = this.getProgress(id);
    const next = this.getNextTopics(id);
    const p = this.getProfile(id);

    let totalStudied = 0, totalMastered = 0, totalItems = 0;
    for (const [, data] of Object.entries(progress.categories)) {
      totalStudied += data.studied;
      totalMastered += data.mastered;
      totalItems += data.total;
    }

    return {
      studentId: id, level: p.level || 'A1',
      summary: { totalItems, totalStudied, totalMastered },
      categories: progress.categories,
      dueForReview: next.totalDue,
      unstartedRemaining: next.totalUnstarted,
      recentSessions: (p.sessions || []).slice(-10).reverse(),
    };
  }

  getScoba(topicId) {
    const t = TOPICS.find(t => t.id === topicId);
    if (!t) throw new Error('Topic not found: ' + topicId);
    return { id: t.id, name: t.name, level: t.level, scoba: t.scoba };
  }

  listTopics(level) {
    const list = level ? TOPICS.filter(t => t.level === level.toUpperCase()) : TOPICS;
    return list.map(t => ({ id: t.id, name: t.name, level: t.level, category: t.category }));
  }

  listStudents() { return listProfiles(this.dir); }
}

// ─── CLI ────────────────────────────────────────────────────────────────────

const tutor = new GrammarTutor();

runCLI((cmd, args, out) => {
  const id = args[1] || 'default';
  switch (cmd) {
    case 'start':
      out(tutor.getProfile(id));
      break;
    case 'set-level':
      out(tutor.setLevel(id, args[2] || 'A1'));
      break;
    case 'lesson':
      out(tutor.generateLesson(id, args[2]));
      break;
    case 'exercise':
      out(tutor.generateExercise(id, args[2], args[3]));
      break;
    case 'check':
      out(tutor.checkAnswer(args[2], parseInt(args[3], 10), args.slice(4).join(' ')));
      break;
    case 'record':
      out(tutor.recordGrade(id, args[2], args[3]));
      break;
    case 'progress':
      out(tutor.getProgress(id));
      break;
    case 'report':
      out(tutor.getReport(id));
      break;
    case 'next':
      out(tutor.getNextTopics(id, args[2]));
      break;
    case 'topics':
      out(tutor.listTopics(args[2]));
      break;
    case 'scoba':
      out(tutor.getScoba(args[2] || args[1]));
      break;
    case 'students':
      out({ students: tutor.listStudents() });
      break;
    case 'help':
      out({ commands: ['start', 'set-level', 'lesson', 'exercise', 'check', 'record',
                   'progress', 'report', 'next', 'topics', 'scoba', 'students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + cmd,
        commands: ['start', 'set-level', 'lesson', 'exercise', 'check', 'record',
                   'progress', 'report', 'next', 'topics', 'scoba', 'students'],
      });
  }
});
