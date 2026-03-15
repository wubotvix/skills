#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

// ── Skill list ──────────────────────────────────────────────────────────────

const SKILL_LIST = [
  'vocabulary', 'grammar', 'conversation',
  'pronunciation', 'reading', 'writing', 'listening',
];

// ── Goal allocations (% per skill) ─────────────────────────────────────────

const GOAL_ALLOCATIONS = {
  conversation: { vocabulary: 20, grammar: 10, conversation: 30, pronunciation: 20, reading: 5,  writing: 5,  listening: 10 },
  heritage:     { vocabulary: 15, grammar: 15, conversation: 15, pronunciation: 10, reading: 15, writing: 20, listening: 10 },
  work:         { vocabulary: 15, grammar: 15, conversation: 20, pronunciation: 10, reading: 15, writing: 15, listening: 10 },
  travel:       { vocabulary: 25, grammar: 5,  conversation: 30, pronunciation: 20, reading: 5,  writing: 5,  listening: 10 },
  academic:     { vocabulary: 10, grammar: 15, conversation: 10, pronunciation: 5,  reading: 25, writing: 25, listening: 10 },
  cultural:     { vocabulary: 20, grammar: 10, conversation: 15, pronunciation: 10, reading: 15, writing: 5,  listening: 25 },
};

// ── CEFR Can-Do milestones (bilingual) ─────────────────────────────────────

const CANDO_MILESTONES = {
  A1: [
    { en: 'I can introduce myself and ask simple questions about personal details.',
      fil: 'Kaya kong magpakilala at magtanong ng simpleng mga tanong tungkol sa personal na impormasyon.' },
    { en: 'I can understand familiar everyday expressions and very basic phrases.',
      fil: 'Kaya kong maintindihan ang mga pamilyar na pang-araw-araw na ekspresyon at napakasimpleng mga parirala.' },
    { en: 'I can interact in a simple way if the other person talks slowly.',
      fil: 'Kaya kong makipag-usap nang simple kung dahan-dahan magsalita ang kausap ko.' },
  ],
  A2: [
    { en: 'I can describe my daily routine and understand short, simple messages.',
      fil: 'Kaya kong ilarawan ang aking pang-araw-araw na gawain at maintindihan ang maikling mensahe.' },
    { en: 'I can communicate in simple tasks requiring a direct exchange of information.',
      fil: 'Kaya kong makipag-usap sa simpleng mga gawain na nangangailangan ng direktang palitan ng impormasyon.' },
    { en: 'I can describe aspects of my background, immediate environment, and basic needs.',
      fil: 'Kaya kong ilarawan ang aking pinagmulan, kapaligiran, at mga pangunahing pangangailangan.' },
  ],
  B1: [
    { en: 'I can deal with most situations likely to arise while traveling in the Philippines.',
      fil: 'Kaya kong harapin ang karamihan ng mga sitwasyon na maaaring mangyari habang nagbibiyahe sa Pilipinas.' },
    { en: 'I can describe experiences, events, dreams, and briefly give reasons and explanations.',
      fil: 'Kaya kong maglahad ng mga karanasan, pangyayari, pangarap, at magbigay ng maikling mga dahilan at paliwanag.' },
    { en: 'I can understand the main points of clear standard speech on familiar matters.',
      fil: 'Kaya kong maintindihan ang mga pangunahing punto ng malinaw na pagsasalita tungkol sa pamilyar na mga paksa.' },
  ],
  B2: [
    { en: 'I can interact with a degree of fluency that makes regular interaction with Filipino speakers quite possible.',
      fil: 'Kaya kong makipag-usap nang may sapat na kasanayan upang regular na makipag-usap sa mga nagsasalita ng Filipino.' },
    { en: 'I can produce clear, detailed text on a wide range of subjects.',
      fil: 'Kaya kong gumawa ng malinaw at detalyadong teksto sa iba\'t ibang paksa.' },
    { en: 'I can understand the main ideas of complex text on both concrete and abstract topics.',
      fil: 'Kaya kong maintindihan ang mga pangunahing ideya ng kumplikadong teksto sa kongkreto at abstraktong mga paksa.' },
  ],
  C1: [
    { en: 'I can express myself fluently and spontaneously without much obvious searching for expressions.',
      fil: 'Kaya kong magpahayag nang matatas at natural nang hindi halatang naghahanap ng mga salita.' },
    { en: 'I can use language flexibly and effectively for social, academic, and professional purposes.',
      fil: 'Kaya kong gamitin ang wika nang nababagay at epektibo para sa sosyal, akademiko, at propesyonal na layunin.' },
    { en: 'I can understand a wide range of demanding, longer texts and recognize implicit meaning.',
      fil: 'Kaya kong maintindihan ang iba\'t ibang mahaba at mahirap na teksto at makilala ang nakatagong kahulugan.' },
  ],
  C2: [
    { en: 'I can summarize information from different spoken and written sources, reconstructing arguments coherently.',
      fil: 'Kaya kong buodin ang impormasyon mula sa iba\'t ibang pinagmulan, binubuo ang mga argumento nang magkakaugnay.' },
    { en: 'I can express myself spontaneously, very fluently, and precisely, differentiating finer shades of meaning.',
      fil: 'Kaya kong magpahayag nang kusa, matatas, at tumpak, na nagpapakilala ng mas pinong pagkakaiba ng kahulugan.' },
  ],
};

// ── Adaptive placement questions (A1-C1) ───────────────────────────────────

const PLACEMENT_QUESTIONS = [
  {
    level: 'A1',
    topic: 'ang/ng pronouns — basic sentence',
    prompt: 'Piliin ang tamang sagot: "Kumain na ___ ng almusal."',
    options: ['ako', 'ko', 'akin'],
    answer: 0,
    hints: [
      'Think about which pronoun form is used after -um- verbs as the actor.',
      'After -um- verbs, the actor uses ang-form pronouns. "Ako" is the ang-form of the first person.',
      'It is either (a) or (b).',
    ],
  },
  {
    level: 'A2',
    topic: 'verb aspect — completed vs contemplated',
    prompt: 'Piliin ang tamang verb form: "_____ siya ng libro kahapon."',
    options: ['Bumili', 'Bibili', 'Bumibili'],
    answer: 0,
    hints: [
      'The word "kahapon" (yesterday) tells you this is a past/completed action.',
      'For completed aspect of -um- verbs, the infix -um- stays in the first syllable. "Bumili" is completed.',
      'It is either (a) or (b).',
    ],
  },
  {
    level: 'B1',
    topic: 'object focus — -in verb form',
    prompt: 'Piliin ang tamang pangungusap:',
    options: [
      'Kinain ng bata ang mangga.',
      'Kumain ang bata ang mangga.',
      'Kinain ang bata ng mangga.',
    ],
    answer: 0,
    hints: [
      'Object focus uses -in verbs. The object (mangga) takes "ang" and the actor (bata) takes "ng".',
      'In object focus: -in verb + ng actor + ang object. "Kinain ng bata ang mangga."',
      'It is either (a) or (c).',
    ],
  },
  {
    level: 'B2',
    topic: 'counterfactual conditional',
    prompt: 'Piliin ang tamang sagot: "Kung ___ lang sana akong mas maaga, naabutan ko siya."',
    options: ['pumunta', 'pumupunta', 'pupunta'],
    answer: 0,
    hints: [
      'This is a past counterfactual with "kung...lang sana." What aspect pairs with this?',
      '"Kung + completed aspect + lang sana" expresses a past unfulfilled condition.',
      'It is either (a) or (b).',
    ],
  },
  {
    level: 'C1',
    topic: 'formal Filipino — napag- causative',
    prompt: 'Piliin ang pinakaangkop: "_____ ang lupon na ang panukalang batas ay nararapat."',
    options: ['Napagpasyahan', 'Nagpasya', 'Pinagpasyahan'],
    answer: 0,
    hints: [
      '"Napagpasyahan" uses the napag-...-an form for formal/deliberative decisions by a group.',
      'The napag-...-an pattern indicates a deliberated collective decision — formal register.',
      'It is either (a) or (c).',
    ],
  },
];

// ── Days of the week ───────────────────────────────────────────────────────

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ── Study Planner class ────────────────────────────────────────────────────

class StudyPlanner {
  constructor() {
    this.dir = core.dataDir('filipino-study-planner');
    core.ensureDir(this.dir);
  }

  // ── Profile management ─────────────────────────────────────────────────

  getProfile(id) {
    const p = core.loadProfile(this.dir, id);
    if (!p.skills || typeof p.skills !== 'object') p.skills = {};
    if (!p.sessions) p.sessions = [];
    if (!p.assessments) p.assessments = [];
    if (!p.weeklyPlan) p.weeklyPlan = null;
    if (!p.goal) p.goal = null;
    if (!p.budget) p.budget = 30;
    if (!p.retention) p.retention = core.DEFAULT_RETENTION;
    if (p.heritage === undefined) p.heritage = false;
    // Ensure each skill has tracking data
    for (const sk of SKILL_LIST) {
      if (!p.skills[sk]) {
        p.skills[sk] = {
          level: p.level || 'A1',
          items: 0,
          correct: 0,
          streak: 0,
          lastPractice: null,
          stability: 2.5,
          difficulty: 5,
        };
      }
    }
    return p;
  }

  _save(p) { core.saveProfile(this.dir, p); }

  setLevel(id, level) {
    const lv = level.toUpperCase();
    if (!core.CEFR.includes(lv)) throw new Error('Invalid CEFR level: ' + level);
    const p = this.getProfile(id);
    p.level = lv;
    for (const sk of SKILL_LIST) p.skills[sk].level = lv;
    this._save(p);
    return { studentId: id, level: lv, message: `Level set to ${lv}` };
  }

  setGoal(id, goal) {
    const g = core.norm(goal);
    if (!GOAL_ALLOCATIONS[g]) throw new Error('Invalid goal. Choose: ' + Object.keys(GOAL_ALLOCATIONS).join(', '));
    const p = this.getProfile(id);
    p.goal = g;
    this._save(p);
    return { studentId: id, goal: g, allocation: GOAL_ALLOCATIONS[g] };
  }

  setBudget(id, minutes) {
    const m = parseInt(minutes, 10);
    if (isNaN(m) || m < 5 || m > 240) throw new Error('Budget must be 5-240 minutes');
    const p = this.getProfile(id);
    p.budget = m;
    this._save(p);
    return { studentId: id, budget: m, message: `Daily budget set to ${m} minutes` };
  }

  setHeritage(id, isHeritage) {
    const p = this.getProfile(id);
    p.heritage = !!isHeritage;
    this._save(p);
    return { studentId: id, heritage: p.heritage, message: p.heritage
      ? 'Heritage learner mode enabled. Skills will be assessed independently — listening/speaking may be ahead of reading/writing.'
      : 'Heritage learner mode disabled.' };
  }

  // ── Adaptive placement test ────────────────────────────────────────────

  runPlacement(id, answers) {
    // answers: array of { choice: 0|1|2, mediation: 0-5 } for each question
    // If no answers provided, return the questions
    if (!answers || !answers.length) {
      return {
        studentId: id,
        instructions: 'Answer each question. Provide choice (0-2) and mediation level (0=no help, 5=failed even with help).',
        questions: PLACEMENT_QUESTIONS.map((q, i) => ({
          index: i,
          level: q.level,
          topic: q.topic,
          prompt: q.prompt,
          options: q.options.map((o, j) => `(${String.fromCharCode(97 + j)}) ${o}`),
        })),
      };
    }

    const p = this.getProfile(id);
    let highestPassed = null;
    const results = [];

    for (let i = 0; i < PLACEMENT_QUESTIONS.length && i < answers.length; i++) {
      const q = PLACEMENT_QUESTIONS[i];
      const a = answers[i];
      const correct = a.choice === q.answer;
      const mediation = typeof a.mediation === 'number' ? a.mediation : (correct ? 0 : 5);

      results.push({
        level: q.level,
        correct,
        mediation,
        independent: mediation <= 2,
      });

      if (correct && mediation <= 2) {
        highestPassed = q.level;
      }

      // Stop if heavy mediation needed (mediation >= 4)
      if (mediation >= 4) break;
    }

    const placedLevel = highestPassed || 'A1';
    // Identify ZPD: levels where mediation was 3-4
    const zpd = results.filter(r => r.mediation >= 3 && r.mediation <= 4).map(r => r.level);

    p.level = placedLevel;
    if (p.heritage) {
      // Heritage learners: receptive skills (listening, reading) may be ahead
      const receptive = ['listening', 'vocabulary', 'conversation'];
      const productive = ['writing', 'grammar', 'reading'];
      const cefrIdx = core.CEFR.indexOf(placedLevel);
      const boostIdx = Math.min(cefrIdx + 1, core.CEFR.length - 1);
      for (const sk of SKILL_LIST) {
        p.skills[sk].level = receptive.includes(sk) ? core.CEFR[boostIdx] : placedLevel;
      }
    } else {
      for (const sk of SKILL_LIST) p.skills[sk].level = placedLevel;
    }
    p.assessments.push({
      type: 'placement',
      date: core.today(),
      results,
      placedLevel,
      zpd,
    });
    this._save(p);

    return {
      studentId: id,
      placedLevel,
      zpd: zpd.length ? zpd : ['none'],
      results,
      message: `Placed at ${placedLevel}. ${zpd.length ? 'ZPD targets: ' + zpd.join(', ') : 'No ZPD levels identified.'}`,
    };
  }

  // ── Weekly plan generation ─────────────────────────────────────────────

  generateWeeklyPlan(id) {
    const p = this.getProfile(id);
    if (!p.goal) throw new Error('Set a goal first (set-goal command)');
    if (!p.level) throw new Error('Set a level first (placement or set-level command)');

    let alloc = { ...GOAL_ALLOCATIONS[p.goal] };
    const budget = p.budget || 30;

    // Heritage learners: boost writing/grammar/reading allocation
    if (p.heritage) {
      alloc.writing = Math.min(30, (alloc.writing || 10) + 5);
      alloc.grammar = Math.min(30, (alloc.grammar || 10) + 5);
      alloc.reading = Math.min(30, (alloc.reading || 10) + 5);
      alloc.listening = Math.max(5, (alloc.listening || 15) - 5);
      alloc.conversation = Math.max(5, (alloc.conversation || 15) - 5);
    }

    // Sort skills by allocation weight descending
    const ranked = SKILL_LIST.slice().sort((a, b) => alloc[b] - alloc[a]);

    // Assign skills to days
    const plan = {};
    for (const day of DAYS) {
      plan[day] = { skills: [], minutes: {} };
    }

    // Saturday = deep dive on weakest skill
    const weakest = this._weakestSkill(p);
    plan.Sat = { skills: [weakest], minutes: { [weakest]: budget }, type: 'deep-dive' };

    // Sunday = rest / quick review
    plan.Sun = { skills: [], minutes: {}, type: 'rest', note: 'Pahinga o 5-minutong mabilisang FSRS review' };

    // Weekdays: assign 2 skills per day, respecting no-repeat rule
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    let lastSkill = null;

    // High-weight skills (>=20%) get 3+ slots, low-weight (<=10%) get 1-2
    const slots = [];
    for (const sk of ranked) {
      const pct = alloc[sk];
      if (pct >= 25) { slots.push(sk, sk, sk, sk); }
      else if (pct >= 20) { slots.push(sk, sk, sk); }
      else if (pct >= 15) { slots.push(sk, sk); }
      else if (pct >= 5) { slots.push(sk); }
    }

    // Fill 2 slots per weekday
    const shuffled = core.shuffle(slots);
    let si = 0;
    for (const day of weekdays) {
      const daySkills = [];
      let attempts = 0;
      while (daySkills.length < 2 && attempts < shuffled.length * 2) {
        const candidate = shuffled[si % shuffled.length];
        si++;
        attempts++;
        if (daySkills.includes(candidate)) continue;
        if (daySkills.length === 0 && candidate === lastSkill) continue;
        daySkills.push(candidate);
      }
      // Fallback: fill from ranked if needed
      while (daySkills.length < 2) {
        const fallback = ranked.find(s => !daySkills.includes(s));
        if (fallback) daySkills.push(fallback);
        else break;
      }

      const primary = daySkills[0];
      const secondary = daySkills[1] || daySkills[0];
      const primaryPct = alloc[primary] / (alloc[primary] + alloc[secondary]);
      const primaryMin = Math.round(budget * primaryPct);
      const secondaryMin = budget - primaryMin;

      plan[day] = {
        skills: daySkills,
        minutes: { [primary]: primaryMin, [secondary]: secondaryMin },
        type: 'daily',
      };
      lastSkill = daySkills[daySkills.length - 1];
    }

    p.weeklyPlan = { generatedAt: core.today(), budget, goal: p.goal, level: p.level, days: plan };
    this._save(p);

    return { studentId: id, weeklyPlan: p.weeklyPlan };
  }

  // ── Today's session ────────────────────────────────────────────────────

  getTodaySession(id) {
    const p = this.getProfile(id);
    if (!p.weeklyPlan) throw new Error('Generate a weekly plan first (plan command)');

    const d = new Date();
    const dayName = DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1];
    const dayPlan = p.weeklyPlan.days[dayName];
    if (!dayPlan) throw new Error('No plan found for ' + dayName);

    // Compute FSRS items due across skills
    const dueCounts = {};
    let totalDue = 0;
    for (const sk of SKILL_LIST) {
      const s = p.skills[sk];
      if (s.lastPractice && s.stability) {
        const elapsed = this._daysSince(s.lastPractice);
        const retention = core.fsrsRetention(elapsed, s.stability);
        const nextDays = core.fsrsNextReview(s.stability, p.retention || core.DEFAULT_RETENTION);
        if (elapsed >= nextDays) {
          dueCounts[sk] = Math.ceil(s.items * (1 - retention));
          totalDue += dueCounts[sk];
        }
      }
    }

    // Streak
    const streak = this._currentStreak(p);

    return {
      studentId: id,
      date: core.today(),
      day: dayName,
      type: dayPlan.type || 'daily',
      level: p.level,
      session: {
        retrievalWarmup: '3-5 min: alalahanin ang mga natutunan mula sa nakaraang sesyon bago mag-review',
        skills: dayPlan.skills,
        minutes: dayPlan.minutes,
        note: dayPlan.note || null,
      },
      fsrsDue: totalDue > 0 ? dueCounts : null,
      streak,
      motivation: streak > 0
        ? `${streak}-araw na streak! Ipagpatuloy ang momentum.`
        : 'Magsimula ng bagong streak ngayon. Bawat sesyon ay mahalaga.',
    };
  }

  // ── Record progress ────────────────────────────────────────────────────

  recordProgress(id, skill, score, total) {
    const sk = core.norm(skill);
    if (!SKILL_LIST.includes(sk)) throw new Error('Unknown skill: ' + skill + '. Valid: ' + SKILL_LIST.join(', '));
    const s = parseInt(score, 10);
    const t = parseInt(total, 10);
    if (isNaN(s) || isNaN(t) || t <= 0) throw new Error('Score and total must be positive integers');

    const p = this.getProfile(id);
    const skData = p.skills[sk];

    // Update counts
    skData.items += t;
    skData.correct += s;

    // FSRS grade: map score ratio to 1-4
    const ratio = s / t;
    const grade = ratio >= 0.9 ? 4 : ratio >= 0.7 ? 3 : ratio >= 0.5 ? 2 : 1;

    // Update FSRS
    skData.stability = core.fsrsUpdateStability(skData.stability || 2.5, skData.difficulty || 5, grade);
    skData.difficulty = core.fsrsUpdateDifficulty(skData.difficulty || 5, grade);

    // Streak
    const td = core.today();
    if (skData.lastPractice === td) {
      // Already practiced today, just update
    } else if (skData.lastPractice && this._daysSince(skData.lastPractice) === 1) {
      skData.streak = (skData.streak || 0) + 1;
    } else if (!skData.lastPractice || this._daysSince(skData.lastPractice) > 1) {
      skData.streak = 1;
    }
    skData.lastPractice = td;

    // Record session
    p.sessions.push({ date: td, skill: sk, score: s, total: t, grade });

    // Check level-up
    const levelUp = this._checkLevelUp(p, sk);

    this._save(p);

    const accuracy = skData.items > 0 ? Math.round(skData.correct / skData.items * 100) : 0;
    const nextReview = core.fsrsNextReview(skData.stability, p.retention || core.DEFAULT_RETENTION);

    return {
      studentId: id,
      skill: sk,
      recorded: { score: s, total: t, grade },
      accuracy: accuracy + '%',
      streak: skData.streak,
      nextReviewDays: nextReview,
      mastery: core.masteryLabel(core.calcMastery(
        p.sessions.filter(x => x.skill === sk).map(x => ({ score: x.score, total: x.total }))
      )),
      levelUp: levelUp || null,
    };
  }

  // ── Progress dashboard ─────────────────────────────────────────────────

  getProgressDashboard(id) {
    const p = this.getProfile(id);
    const rows = {};
    let lowestIdx = core.CEFR.length;

    for (const sk of SKILL_LIST) {
      const d = p.skills[sk];
      const accuracy = d.items > 0 ? Math.round(d.correct / d.items * 100) : 0;
      const elapsed = d.lastPractice ? this._daysSince(d.lastPractice) : null;
      const due = (d.lastPractice && d.stability)
        ? Math.max(0, core.fsrsNextReview(d.stability, p.retention || core.DEFAULT_RETENTION) - (elapsed || 0))
        : null;
      rows[sk] = {
        level: d.level || p.level || 'A1',
        items: d.items,
        accuracy: accuracy + '%',
        streak: d.streak || 0,
        daysSinceReview: elapsed,
        dueInDays: due,
      };
      const lvIdx = core.CEFR.indexOf(d.level || p.level || 'A1');
      if (lvIdx < lowestIdx) lowestIdx = lvIdx;
    }

    const overallLevel = core.CEFR[lowestIdx] || 'A1';
    const globalStreak = this._currentStreak(p);

    return {
      studentId: id,
      level: p.level,
      overallLevel,
      goal: p.goal,
      budget: p.budget,
      heritage: p.heritage || false,
      streak: globalStreak,
      skills: rows,
    };
  }

  // ── Detailed report with milestones ────────────────────────────────────

  getReport(id) {
    const dash = this.getProgressDashboard(id);
    const p = this.getProfile(id);

    // Can-do milestones for current level
    const lvl = p.level || 'A1';
    const milestones = CANDO_MILESTONES[lvl] || [];
    const nextLvl = core.CEFR[core.CEFR.indexOf(lvl) + 1];
    const nextMilestones = nextLvl ? CANDO_MILESTONES[nextLvl] || [] : [];

    // Session history summary
    const last7 = p.sessions.filter(s => this._daysSince(s.date) <= 7);
    const last30 = p.sessions.filter(s => this._daysSince(s.date) <= 30);

    // Skill breakdown for last 7 days
    const weekBySkill = {};
    for (const s of last7) {
      if (!weekBySkill[s.skill]) weekBySkill[s.skill] = { sessions: 0, score: 0, total: 0 };
      weekBySkill[s.skill].sessions++;
      weekBySkill[s.skill].score += s.score;
      weekBySkill[s.skill].total += s.total;
    }

    return {
      ...dash,
      report: {
        currentMilestones: milestones.map(m => ({ achieved: lvl, en: m.en, fil: m.fil })),
        nextLevel: nextLvl || 'max',
        nextMilestones: nextMilestones.map(m => ({ target: nextLvl, en: m.en, fil: m.fil })),
        last7days: { sessions: last7.length, bySkill: weekBySkill },
        last30days: { sessions: last30.length },
        assessments: p.assessments.length,
        recommendation: this._recommendation(p),
      },
    };
  }

  // ── List students ──────────────────────────────────────────────────────

  listStudents() {
    return { students: core.listProfiles(this.dir) };
  }

  // ── Internal helpers ───────────────────────────────────────────────────

  _weakestSkill(p) {
    let worst = SKILL_LIST[0];
    let worstScore = Infinity;
    for (const sk of SKILL_LIST) {
      const d = p.skills[sk];
      const acc = d.items > 0 ? d.correct / d.items : 0;
      const lvIdx = core.CEFR.indexOf(d.level || 'A1');
      const composite = lvIdx * 100 + acc * 100;
      if (composite < worstScore) {
        worstScore = composite;
        worst = sk;
      }
    }
    return worst;
  }

  _currentStreak(p) {
    if (!p.sessions.length) return 0;
    const dates = [...new Set(p.sessions.map(s => s.date))].sort().reverse();
    const td = core.today();
    if (dates[0] !== td && this._daysSince(dates[0]) > 1) return 0;
    let streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = this._daysBetween(dates[i], dates[i - 1]);
      if (diff === 1) streak++;
      else break;
    }
    return streak;
  }

  _daysSince(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const now = new Date(core.today() + 'T00:00:00');
    return Math.round((now - d) / 86400000);
  }

  _daysBetween(a, b) {
    const da = new Date(a + 'T00:00:00');
    const db = new Date(b + 'T00:00:00');
    return Math.round(Math.abs(db - da) / 86400000);
  }

  _checkLevelUp(p, sk) {
    const d = p.skills[sk];
    const lvIdx = core.CEFR.indexOf(d.level || 'A1');
    if (lvIdx >= core.CEFR.length - 1) return null;

    // Level-up thresholds vary by skill type
    const thresholds = {
      vocabulary:     { items: 50, accuracy: 0.7 },
      grammar:        { items: 30, accuracy: 0.7 },
      conversation:   { items: 15, accuracy: 0.6 },
      pronunciation:  { items: 20, accuracy: 0.7 },
      reading:        { items: 15, accuracy: 0.7 },
      writing:        { items: 15, accuracy: 0.6 },
      listening:      { items: 20, accuracy: 0.7 },
    };

    const th = thresholds[sk];
    const accuracy = d.items > 0 ? d.correct / d.items : 0;
    if (d.items >= th.items && accuracy >= th.accuracy) {
      const newLevel = core.CEFR[lvIdx + 1];
      d.level = newLevel;
      d.items = 0;
      d.correct = 0;
      return { skill: sk, from: core.CEFR[lvIdx], to: newLevel };
    }
    return null;
  }

  _recommendation(p) {
    const weakest = this._weakestSkill(p);
    const streak = this._currentStreak(p);
    const parts = [];

    if (streak === 0) {
      parts.push('Magsimula ng bagong streak ngayon. Mas mahalaga ang consistency kaysa intensity.');
    } else if (streak >= 7) {
      parts.push(`Magaling! ${streak}-araw na streak! Puwede mong dagdagan ang daily budget mo.`);
    }

    const wd = p.skills[weakest];
    const wAcc = wd.items > 0 ? Math.round(wd.correct / wd.items * 100) : 0;
    parts.push(`Focus sa ${weakest} (${wAcc}% accuracy) — ito ang pumipigil sa overall level mo.`);

    // Check for skills not practiced recently
    for (const sk of SKILL_LIST) {
      const d = p.skills[sk];
      if (d.lastPractice && this._daysSince(d.lastPractice) >= 5) {
        parts.push(`${sk} hindi napraktis sa ${this._daysSince(d.lastPractice)} araw — mag-schedule ng sesyon.`);
      }
    }

    // Heritage-specific advice
    if (p.heritage) {
      const readLv = core.CEFR.indexOf(p.skills.reading?.level || 'A1');
      const listLv = core.CEFR.indexOf(p.skills.listening?.level || 'A1');
      if (listLv - readLv >= 2) {
        parts.push('Heritage tip: Ang reading/writing mo ay mas mababa sa listening — dagdagan ang reading at writing practice.');
      }
    }

    return parts.join(' ');
  }
}

// ── CLI ────────────────────────────────────────────────────────────────────

const planner = new StudyPlanner();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const id = args[1];
      if (!id) throw new Error('Usage: start <student>');
      const p = planner.getProfile(id);
      planner._save(p);
      out({
        studentId: id,
        level: p.level,
        goal: p.goal,
        budget: p.budget,
        heritage: p.heritage,
        message: p.level
          ? `Maligayang pagbabalik! Level: ${p.level}, Goal: ${p.goal || 'not set'}, Budget: ${p.budget}min`
          : 'Bagong estudyante. Gawin ang placement, set-goal, at set-budget para makapagsimula.',
      });
      break;
    }

    case 'placement': {
      const id = args[1];
      if (!id) throw new Error('Usage: placement <student> [answers-json]');
      let answers = null;
      if (args[2]) {
        try { answers = JSON.parse(args.slice(2).join(' ')); }
        catch { throw new Error('Answers must be valid JSON array: [{"choice":0,"mediation":0}, ...]'); }
      }
      out(planner.runPlacement(id, answers));
      break;
    }

    case 'plan': {
      const id = args[1];
      if (!id) throw new Error('Usage: plan <student>');
      out(planner.generateWeeklyPlan(id));
      break;
    }

    case 'today': {
      const id = args[1];
      if (!id) throw new Error('Usage: today <student>');
      out(planner.getTodaySession(id));
      break;
    }

    case 'record': {
      const [, id, skill, score, total] = args;
      if (!id || !skill || score == null || total == null) {
        throw new Error('Usage: record <student> <skill> <score> <total>');
      }
      out(planner.recordProgress(id, skill, score, total));
      break;
    }

    case 'progress': {
      const id = args[1];
      if (!id) throw new Error('Usage: progress <student>');
      out(planner.getProgressDashboard(id));
      break;
    }

    case 'report': {
      const id = args[1];
      if (!id) throw new Error('Usage: report <student>');
      out(planner.getReport(id));
      break;
    }

    case 'set-goal': {
      const [, id, goal] = args;
      if (!id || !goal) throw new Error('Usage: set-goal <student> <conversation|heritage|work|travel|academic|cultural>');
      out(planner.setGoal(id, goal));
      break;
    }

    case 'set-budget': {
      const [, id, min] = args;
      if (!id || !min) throw new Error('Usage: set-budget <student> <minutes>');
      out(planner.setBudget(id, min));
      break;
    }

    case 'set-level': {
      const [, id, lv] = args;
      if (!id || !lv) throw new Error('Usage: set-level <student> <A1|A2|B1|B2|C1|C2>');
      out(planner.setLevel(id, lv));
      break;
    }

    case 'set-heritage': {
      const [, id, val] = args;
      if (!id) throw new Error('Usage: set-heritage <student> <true|false>');
      out(planner.setHeritage(id, val === 'true' || val === '1'));
      break;
    }

    case 'students': {
      out({ students: planner.listStudents() });
      break;
    }

    case 'help':
      out({ commands: ['start', 'placement', 'plan', 'today', 'record', 'progress',
                   'report', 'set-goal', 'set-budget', 'set-level', 'set-heritage', 'students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + (cmd || '(none)'),
        commands: ['start', 'placement', 'plan', 'today', 'record', 'progress',
                   'report', 'set-goal', 'set-budget', 'set-level', 'set-heritage', 'students'],
      });
  }
});
