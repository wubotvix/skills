#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'russian-study-planner';

// ── Skill list ──────────────────────────────────────────────────────────────

const SKILL_LIST = [
  'vocabulary', 'grammar', 'conversation',
  'pronunciation', 'reading', 'writing', 'listening',
];

// ── Goal allocations (% per skill) ─────────────────────────────────────────

const GOAL_ALLOCATIONS = {
  conversation: { vocabulary: 20, grammar: 10, conversation: 30, pronunciation: 20, reading: 5,  writing: 5,  listening: 10 },
  work:         { vocabulary: 15, grammar: 15, conversation: 20, pronunciation: 10, reading: 15, writing: 15, listening: 10 },
  exam:         { vocabulary: 15, grammar: 15, conversation: 15, pronunciation: 10, reading: 15, writing: 15, listening: 15 },
  travel:       { vocabulary: 25, grammar: 5,  conversation: 30, pronunciation: 20, reading: 5,  writing: 5,  listening: 10 },
  academic:     { vocabulary: 10, grammar: 15, conversation: 10, pronunciation: 5,  reading: 25, writing: 25, listening: 10 },
  heritage:     { vocabulary: 15, grammar: 10, conversation: 25, pronunciation: 15, reading: 15, writing: 10, listening: 10 },
};

// ── CEFR Can-Do milestones (bilingual) ─────────────────────────────────────

const CANDO_MILESTONES = {
  A1: [
    { en: 'I can introduce myself and ask simple personal questions.',
      ru: 'Могу́ предста́виться и задáть про́стые вопро́сы о себе́.' },
    { en: 'I can understand familiar everyday expressions and very basic phrases.',
      ru: 'Могу́ понима́ть знако́мые повседне́вные выраже́ния и про́стые фра́зы.' },
    { en: 'I can interact in a simple way if the other person talks slowly.',
      ru: 'Могу́ обща́ться про́сто, е́сли собесе́дник говори́т ме́дленно.' },
  ],
  A2: [
    { en: 'I can describe my daily routine and understand short, simple messages.',
      ru: 'Могу́ описа́ть свой день и понима́ть коро́ткие сообще́ния.' },
    { en: 'I can communicate in simple tasks requiring a direct exchange of information.',
      ru: 'Могу́ обща́ться в просты́х ситуа́циях, тре́бующих обме́на информа́цией.' },
    { en: 'I can describe aspects of my background and immediate environment.',
      ru: 'Могу́ описа́ть своё окруже́ние и жи́зненный о́пыт.' },
  ],
  B1: [
    { en: 'I can deal with most situations likely to arise while traveling in Russia.',
      ru: 'Могу́ спра́виться с большинство́м ситуа́ций в путеше́ствии по Росси́и.' },
    { en: 'I can describe experiences, events, dreams, and briefly give reasons.',
      ru: 'Могу́ описа́ть о́пыт, собы́тия, мечты́ и кра́тко объясни́ть при́чины.' },
    { en: 'I can understand the main points of clear standard speech on familiar matters.',
      ru: 'Могу́ понима́ть основны́е поло́жения я́сной ста́ндартной ре́чи на знако́мые те́мы.' },
  ],
  B2: [
    { en: 'I can interact with a degree of fluency that makes regular interaction with native speakers possible.',
      ru: 'Могу́ свобо́дно обща́ться с носи́телями языка́ без напряже́ния.' },
    { en: 'I can produce clear, detailed text on a wide range of subjects.',
      ru: 'Могу́ создава́ть поня́тные дета́льные те́ксты на ши́рокий круг тем.' },
    { en: 'I can understand the main ideas of complex text on both concrete and abstract topics.',
      ru: 'Могу́ понима́ть основны́е иде́и сло́жных те́кстов на конкре́тные и абстра́ктные те́мы.' },
  ],
  C1: [
    { en: 'I can express myself fluently and spontaneously without much obvious searching for expressions.',
      ru: 'Могу́ свобо́дно и спонта́нно выража́ть мы́сли без заме́тного по́иска слов.' },
    { en: 'I can use language flexibly and effectively for social, academic, and professional purposes.',
      ru: 'Могу́ гибко и эффекти́вно испо́льзовать язы́к в социа́льных, академи́ческих и профессиона́льных це́лях.' },
    { en: 'I can understand a wide range of demanding, longer texts and recognize implicit meaning.',
      ru: 'Могу́ понима́ть ши́рокий круг сло́жных длинных те́кстов и распознава́ть скры́тый смысл.' },
  ],
  C2: [
    { en: 'I can summarize information from different spoken and written sources coherently.',
      ru: 'Могу́ связно обобща́ть информа́цию из ра́зных у́стных и пи́сьменных исто́чников.' },
    { en: 'I can express myself spontaneously, very fluently, differentiating finer shades of meaning.',
      ru: 'Могу́ выража́ться спонта́нно, с большо́й бе́глостью, различа́я то́нкие отте́нки смы́сла.' },
  ],
};

// ── Adaptive placement questions (A1-C1) ───────────────────────────────────

const PLACEMENT_QUESTIONS = [
  {
    level: 'A1',
    topic: 'Basic sentence — nominative',
    prompt: 'Complete: "Что э́то? Э́то ___."',
    options: ['кни́га', 'кни́ги', 'кни́ге'],
    answer: 0,
    hints: [
      'Think about which case names things — the naming case.',
      'This sentence needs the nominative case — basic form of the noun.',
      'It is either (a) or (b).',
    ],
  },
  {
    level: 'A2',
    topic: 'Past tense + gender agreement',
    prompt: 'Complete: "Вчера́ она́ ___ в магази́н."',
    options: ['ходи́л', 'ходи́ла', 'ходи́ли'],
    answer: 1,
    hints: [
      '"Она́" is feminine. How does that affect the past tense ending?',
      'Feminine past tense ends in -а. Try again.',
      'It is either (a) or (b).',
    ],
  },
  {
    level: 'B1',
    topic: 'Prepositional case — location',
    prompt: 'Complete: "Я живу́ в ___."',
    options: ['Москва́', 'Москву́', 'Москве́'],
    answer: 2,
    hints: [
      '"В" + location requires a specific case. Which one indicates location (not direction)?',
      'Location after "в" takes the prepositional case, not accusative.',
      'It is either (b) or (c).',
    ],
  },
  {
    level: 'B2',
    topic: 'Aspect choice — completed action',
    prompt: 'Complete: "Вчера́ я ___ э́ту кни́гу." (finished reading)',
    options: ['чита́л', 'прочита́л', 'чита́ю'],
    answer: 1,
    hints: [
      'The context says "finished reading." Which aspect expresses a completed result?',
      'Perfective aspect (совершённый вид) expresses completion. Which form is perfective?',
      'It is either (a) or (b).',
    ],
  },
  {
    level: 'C1',
    topic: 'Participial construction',
    prompt: 'Complete: "Студе́нт, ___ на экза́мене, получи́л пятёрку."',
    options: ['отвеча́ющий', 'отве́тивший', 'отвеча́я'],
    answer: 1,
    hints: [
      'The student already answered — the action is complete. What type of participle expresses a completed past action?',
      'Past active participle (действи́тельное причáстие про́шедшего вре́мени) is needed here.',
      'It is either (a) or (b).',
    ],
  },
];

// ── Days of the week ───────────────────────────────────────────────────────

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ── Study Planner class ────────────────────────────────────────────────────

class StudyPlanner {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
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
    if (!p.cyrillic) p.cyrillic = null; // 'literate', 'learning', or 'none'
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

  // ── Adaptive placement test ────────────────────────────────────────────

  runPlacement(id, answers) {
    if (!answers || !answers.length) {
      return {
        studentId: id,
        instructions: 'Answer each question. Provide choice (0-2) and mediation level (0=no help, 5=failed even with help).',
        cyrillicCheck: 'First, can you read this? Здра́вствуйте, как вас зову́т?',
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

      if (mediation >= 4) break;
    }

    const placedLevel = highestPassed || 'A1';
    const zpd = results.filter(r => r.mediation >= 3 && r.mediation <= 4).map(r => r.level);

    p.level = placedLevel;
    for (const sk of SKILL_LIST) p.skills[sk].level = placedLevel;
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

    const alloc = GOAL_ALLOCATIONS[p.goal];
    const budget = p.budget || 30;

    const ranked = SKILL_LIST.slice().sort((a, b) => alloc[b] - alloc[a]);

    const plan = {};
    for (const day of DAYS) {
      plan[day] = { skills: [], minutes: {} };
    }

    // Saturday = deep dive on weakest skill
    const weakest = this._weakestSkill(p);
    plan.Sat = { skills: [weakest], minutes: { [weakest]: budget }, type: 'deep-dive' };

    // Sunday = rest / quick review
    plan.Sun = { skills: [], minutes: {}, type: 'rest', note: 'Rest or 5-min quick FSRS review' };

    // Weekdays: assign 2 skills per day
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    let lastSkill = null;

    const slots = [];
    for (const sk of ranked) {
      const pct = alloc[sk];
      if (pct >= 25) { slots.push(sk, sk, sk, sk); }
      else if (pct >= 20) { slots.push(sk, sk, sk); }
      else if (pct >= 15) { slots.push(sk, sk); }
      else if (pct >= 5) { slots.push(sk); }
    }

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

    // Cyrillic intensive override for pre-A1
    if (p.cyrillic === 'none' || p.cyrillic === 'learning') {
      for (const day of weekdays) {
        plan[day] = {
          skills: ['reading', 'writing'],
          minutes: { reading: Math.round(budget * 0.55), writing: budget - Math.round(budget * 0.55) },
          type: 'cyrillic-intensive',
          note: 'Cyrillic literacy focus: letter recognition + writing practice',
        };
      }
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

    const streak = this._currentStreak(p);

    return {
      studentId: id,
      date: core.today(),
      day: dayName,
      type: dayPlan.type || 'daily',
      level: p.level,
      session: {
        retrievalWarmup: '3-5 min: recall items from previous sessions before reviewing',
        skills: dayPlan.skills,
        minutes: dayPlan.minutes,
        note: dayPlan.note || null,
      },
      fsrsDue: totalDue > 0 ? dueCounts : null,
      streak,
      motivation: streak > 0
        ? `${streak}-day streak! Keep building momentum.`
        : 'Start a new streak today. Every session counts.',
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

    skData.items += t;
    skData.correct += s;

    const ratio = s / t;
    const grade = ratio >= 0.9 ? 4 : ratio >= 0.7 ? 3 : ratio >= 0.5 ? 2 : 1;

    skData.stability = core.fsrsUpdateStability(skData.stability || 2.5, skData.difficulty || 5, grade);
    skData.difficulty = core.fsrsUpdateDifficulty(skData.difficulty || 5, grade);

    const td = core.today();
    if (skData.lastPractice === td) {
      // Already practiced today
    } else if (skData.lastPractice && this._daysSince(skData.lastPractice) === 1) {
      skData.streak = (skData.streak || 0) + 1;
    } else if (!skData.lastPractice || this._daysSince(skData.lastPractice) > 1) {
      skData.streak = 1;
    }
    skData.lastPractice = td;

    p.sessions.push({ date: td, skill: sk, score: s, total: t, grade });

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
      cyrillic: p.cyrillic,
      streak: globalStreak,
      skills: rows,
    };
  }

  // ── Detailed report with milestones ────────────────────────────────────

  getReport(id) {
    const dash = this.getProgressDashboard(id);
    const p = this.getProfile(id);

    const lvl = p.level || 'A1';
    const milestones = CANDO_MILESTONES[lvl] || [];
    const nextLvl = core.CEFR[core.CEFR.indexOf(lvl) + 1];
    const nextMilestones = nextLvl ? CANDO_MILESTONES[nextLvl] || [] : [];

    const last7 = p.sessions.filter(s => this._daysSince(s.date) <= 7);
    const last30 = p.sessions.filter(s => this._daysSince(s.date) <= 30);

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
        currentMilestones: milestones.map(m => ({ achieved: lvl, en: m.en, ru: m.ru })),
        nextLevel: nextLvl || 'max',
        nextMilestones: nextMilestones.map(m => ({ target: nextLvl, en: m.en, ru: m.ru })),
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

    if (p.cyrillic === 'none') {
      parts.push('Priority: learn the Cyrillic alphabet. Focus on reading and writing until literate.');
    }

    if (streak === 0) {
      parts.push('Start a new streak today. Consistency beats intensity.');
    } else if (streak >= 7) {
      parts.push(`Great ${streak}-day streak! Consider increasing your daily budget.`);
    }

    const wd = p.skills[weakest];
    const wAcc = wd.items > 0 ? Math.round(wd.correct / wd.items * 100) : 0;
    parts.push(`Focus on ${weakest} (${wAcc}% accuracy) — it is holding back your overall level.`);

    for (const sk of SKILL_LIST) {
      const d = p.skills[sk];
      if (d.lastPractice && this._daysSince(d.lastPractice) >= 5) {
        parts.push(`${sk} not practiced in ${this._daysSince(d.lastPractice)} days — schedule a session soon.`);
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
        cyrillic: p.cyrillic,
        message: p.level
          ? `Welcome back! Level: ${p.level}, Goal: ${p.goal || 'not set'}, Budget: ${p.budget}min`
          : 'New student created. Run placement, set-goal, and set-budget to get started.',
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
      if (!id || !goal) throw new Error('Usage: set-goal <student> <conversation|work|exam|travel|academic|heritage>');
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

    case 'students': {
      out({ students: planner.listStudents() });
      break;
    }

    case 'help':
      out({ commands: ['start', 'placement', 'plan', 'today', 'record', 'progress',
                   'report', 'set-goal', 'set-budget', 'set-level', 'students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + (cmd || '(none)'),
        commands: ['start', 'placement', 'plan', 'today', 'record', 'progress',
                   'report', 'set-goal', 'set-budget', 'set-level', 'students'],
      });
  }
});
