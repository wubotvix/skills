// eClaw Science Study Planner & Coordinator (K-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'science-study-planner');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'K-2': {
    'life-science': ['organisms', 'ecosystems-intro', 'heredity-basics'],
    'physical-science': ['matter-basics', 'forces-intro', 'energy-basics'],
    'earth-space': ['earth-materials', 'weather', 'sky-observations'],
    'engineering': ['design-process-intro', 'building-solutions'],
    'inquiry': ['asking-questions', 'making-observations', 'simple-investigations'],
    'reasoning': ['because-statements', 'pattern-recognition', 'simple-models'],
    'literacy': ['science-vocabulary', 'reading-science', 'writing-observations'],
  },
  '3-5': {
    'life-science': ['ecosystems', 'life-cycles', 'heredity', 'adaptation'],
    'physical-science': ['matter-properties', 'forces-and-motion', 'energy-transfer', 'waves'],
    'earth-space': ['earth-systems', 'rocks-and-minerals', 'weather-and-climate', 'space'],
    'engineering': ['design-process', 'prototyping', 'testing-and-improving'],
    'inquiry': ['fair-testing', 'variables', 'data-collection', 'drawing-conclusions'],
    'reasoning': ['cer-writing', 'crosscutting-concepts', 'scientific-models', 'evidence-evaluation'],
    'literacy': ['science-reading', 'science-writing', 'vocabulary-building', 'presenting-findings'],
  },
  '6-8': {
    'life-science': ['cells', 'body-systems', 'genetics', 'evolution', 'ecology'],
    'physical-science': ['atomic-structure', 'chemical-reactions', 'forces-and-laws', 'energy-conservation', 'waves-and-em'],
    'earth-space': ['plate-tectonics', 'earth-history', 'climate-systems', 'space-systems'],
    'engineering': ['advanced-design', 'engineering-constraints', 'optimization'],
    'inquiry': ['experimental-design', 'data-analysis', 'scientific-method', 'peer-review'],
    'reasoning': ['advanced-cer', 'argumentation', 'model-revision', 'statistical-reasoning'],
    'literacy': ['technical-reading', 'lab-reports', 'research-writing', 'scientific-communication'],
  },
};

const DOMAINS = ['life-science', 'physical-science', 'earth-space', 'engineering', 'inquiry', 'reasoning', 'literacy'];

const DOMAIN_LABELS = {
  'life-science': 'Life Science',
  'physical-science': 'Physical Science',
  'earth-space': 'Earth & Space',
  'engineering': 'Engineering',
  'inquiry': 'Inquiry',
  'reasoning': 'Reasoning',
  'literacy': 'Science Literacy',
};

const GOALS = {
  'catch-up': { label: 'Catch Up', focusWeakest: true, sessionsPerWeek: 5, minutesPerSession: 30 },
  'stay-strong': { label: 'Stay Strong', focusWeakest: false, sessionsPerWeek: 4, minutesPerSession: 25 },
  'explore-passion': { label: 'Explore a Passion', focusWeakest: false, sessionsPerWeek: 3, minutesPerSession: 30 },
  'get-ahead': { label: 'Get Ahead', focusWeakest: false, sessionsPerWeek: 5, minutesPerSession: 30 },
  'science-fair': { label: 'Science Fair Prep', focusWeakest: false, sessionsPerWeek: 4, minutesPerSession: 35 },
  'real-world': { label: 'Real-World Science', focusWeakest: false, sessionsPerWeek: 3, minutesPerSession: 25 },
};

const CONTENT_BANKS = {};

// File I/O

function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }

function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }

function loadProfile(id) {
  const fp = profilePath(id);
  if (fs.existsSync(fp)) {
    try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
    catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); }
  }
  return { studentId: id, grade: null, goal: null, dailyMinutes: 25, createdAt: new Date().toISOString(), assessments: [], skills: {}, streak: { current: 0, longest: 0, lastDate: null } };
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

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

function todayStr() { return new Date().toISOString().slice(0, 10); }

function dayOfWeek() { return new Date().getDay(); }

function updateStreak(p) {
  const today = todayStr();
  if (p.streak.lastDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (p.streak.lastDate === yesterday) {
    p.streak.current++;
  } else {
    p.streak.current = 1;
  }
  if (p.streak.current > p.streak.longest) p.streak.longest = p.streak.current;
  p.streak.lastDate = today;
}

function getDomainMastery(p, grade, domain) {
  const skills = SKILLS[grade]?.[domain] || [];
  if (!skills.length) return 0;
  let total = 0;
  for (const sk of skills) {
    const d = p.skills[`${grade}/${domain}/${sk}`];
    total += d ? d.mastery : 0;
  }
  return Math.round(total / skills.length * 100) / 100;
}

// Public API

class StudyPlanner {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, grade: p.grade, goal: p.goal, dailyMinutes: p.dailyMinutes, createdAt: p.createdAt, totalAssessments: p.assessments.length, streak: p.streak };
  }

  setGrade(id, grade) {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    const p = loadProfile(id); p.grade = grade; saveProfile(p);
    return { studentId: id, grade };
  }

  setGoal(id, goal) {
    if (!GOALS[goal]) throw new Error(`Unknown goal: ${goal}. Valid: ${Object.keys(GOALS).join(', ')}`);
    const p = loadProfile(id); p.goal = goal; saveProfile(p);
    return { studentId: id, goal, details: GOALS[goal] };
  }

  setTime(id, minutes) {
    const mins = Number(minutes);
    if (!mins || mins < 5 || mins > 120) throw new Error('Minutes must be between 5 and 120');
    const p = loadProfile(id); p.dailyMinutes = mins; saveProfile(p);
    return { studentId: id, dailyMinutes: mins };
  }

  recordAssessment(id, domain, score, total) {
    if (!DOMAINS.includes(domain)) throw new Error(`Unknown domain: ${domain}. Valid: ${DOMAINS.join(', ')}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);

    const p = loadProfile(id);
    const grade = p.grade || 'K-2';
    const entry = { date: new Date().toISOString(), domain, score, total };
    p.assessments.push(entry);

    const skills = SKILLS[grade]?.[domain] || [];
    if (skills.length) {
      const pct = score / total;
      for (const sk of skills) {
        const key = `${grade}/${domain}/${sk}`;
        if (!p.skills[key]) p.skills[key] = { attempts: [] };
        p.skills[key].attempts.push({ date: entry.date, score: Math.round(pct * 5), total: 5 });
        p.skills[key].mastery = calcMastery(p.skills[key].attempts);
        p.skills[key].label = masteryLabel(p.skills[key].mastery);
      }
    }

    updateStreak(p);
    saveProfile(p);
    return { studentId: id, domain, score: `${score}/${total}`, mastery: getDomainMastery(p, grade, domain) };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'K-2';
    const domainProgress = {};
    let totalMastered = 0, totalSkills = 0;

    for (const domain of DOMAINS) {
      const skills = SKILLS[grade]?.[domain] || [];
      let domMastered = 0;
      const skillDetails = {};
      for (const sk of skills) {
        totalSkills++;
        const d = p.skills[`${grade}/${domain}/${sk}`];
        skillDetails[sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) { domMastered++; totalMastered++; }
      }
      domainProgress[domain] = {
        label: DOMAIN_LABELS[domain],
        mastery: getDomainMastery(p, grade, domain),
        mastered: domMastered,
        total: skills.length,
        skills: skillDetails,
      };
    }

    return {
      studentId: id, grade, goal: p.goal, streak: p.streak,
      mastered: totalMastered, total: totalSkills,
      overallPct: totalSkills > 0 ? Math.round(totalMastered / totalSkills * 100) : 0,
      domains: domainProgress,
    };
  }

  generatePlan(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'K-2';
    const goalConfig = GOALS[p.goal] || GOALS['stay-strong'];
    const sessionsPerWeek = goalConfig.sessionsPerWeek;
    const minutesPerSession = p.dailyMinutes || goalConfig.minutesPerSession;

    const domainScores = DOMAINS.map(d => ({ domain: d, label: DOMAIN_LABELS[d], mastery: getDomainMastery(p, grade, d) }));
    domainScores.sort((a, b) => a.mastery - b.mastery);

    const plan = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const startDay = 1; // Monday

    for (let i = 0; i < sessionsPerWeek; i++) {
      const dayIdx = (startDay + i) % 7;
      const domainIdx = i % domainScores.length;
      const domain = domainScores[goalConfig.focusWeakest ? domainIdx : (domainScores.length - 1 - domainIdx)];
      const skills = SKILLS[grade]?.[domain.domain] || [];
      const weakSkills = skills.filter(sk => {
        const d = p.skills[`${grade}/${domain.domain}/${sk}`];
        return !d || d.mastery < MASTERY_THRESHOLD;
      });

      plan.push({
        day: dayNames[dayIdx],
        domain: domain.domain,
        domainLabel: domain.label,
        mastery: domain.mastery,
        minutes: minutesPerSession,
        focusSkills: weakSkills.slice(0, 2),
        activity: weakSkills.length > 0 ? `Practice ${weakSkills[0].replace(/-/g, ' ')}` : 'Review and extend mastered skills',
      });
    }

    return {
      studentId: id, grade, goal: p.goal || 'stay-strong',
      sessionsPerWeek, minutesPerSession,
      weeklyPlan: plan,
      tip: goalConfig.focusWeakest
        ? 'Focus on your weakest domains first to catch up!'
        : 'Keep building on your strengths while filling gaps.',
    };
  }

  getToday(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'K-2';
    const dow = dayOfWeek();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const domainScores = DOMAINS.map(d => ({ domain: d, label: DOMAIN_LABELS[d], mastery: getDomainMastery(p, grade, d) }));
    domainScores.sort((a, b) => a.mastery - b.mastery);

    const todayDomain = domainScores[dow % domainScores.length];
    const skills = SKILLS[grade]?.[todayDomain.domain] || [];
    const weakSkills = skills.filter(sk => {
      const d = p.skills[`${grade}/${todayDomain.domain}/${sk}`];
      return !d || d.mastery < MASTERY_THRESHOLD;
    });

    return {
      studentId: id, grade, day: dayNames[dow],
      domain: todayDomain.domain,
      domainLabel: todayDomain.label,
      mastery: todayDomain.mastery,
      minutes: p.dailyMinutes || 25,
      focusSkills: weakSkills.slice(0, 2),
      recommendation: weakSkills.length > 0
        ? `Today, work on ${todayDomain.label}: focus on ${weakSkills[0].replace(/-/g, ' ')}`
        : `Great work in ${todayDomain.label}! Review and try challenge problems.`,
      streak: p.streak,
    };
  }

  getReport(id) {
    const p = loadProfile(id);
    return {
      studentId: id, grade: p.grade, goal: p.goal, streak: p.streak,
      progress: this.getProgress(id),
      recentAssessments: p.assessments.slice(-20).reverse(),
    };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }

  listDomains() {
    return { domains: DOMAINS.map(d => ({ key: d, label: DOMAIN_LABELS[d] })) };
  }
}

module.exports = StudyPlanner;

// CLI: node study-planner.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new StudyPlanner();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) api.setGrade(id, grade);
        out({ action: 'start', profile: api.getProfile(id), progress: api.getProgress(id) });
        break;
      }
      case 'plan': { const [, id] = args; if (!id) throw new Error('Usage: plan <id>'); out(api.generatePlan(id)); break; }
      case 'today': { const [, id] = args; if (!id) throw new Error('Usage: today <id>'); out(api.getToday(id)); break; }
      case 'assess': {
        const [, id, domain, sc, tot] = args;
        if (!id || !domain || !sc || !tot) throw new Error('Usage: assess <id> <domain> <score> <total>');
        out(api.recordAssessment(id, domain, Number(sc), Number(tot)));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(api.setGrade(id, g)); break; }
      case 'set-goal': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-goal <id> <goal>'); out(api.setGoal(id, g)); break; }
      case 'set-time': { const [, id, m] = args; if (!id || !m) throw new Error('Usage: set-time <id> <minutes>'); out(api.setTime(id, m)); break; }
      case 'domains': { out(api.listDomains()); break; }
      case 'students': { out(api.listStudents()); break; }
      default: out({ usage: 'node study-planner.js <command> [args]', commands: ['start','plan','today','assess','progress','report','set-grade','set-goal','set-time','domains','students'], grades: Object.keys(SKILLS), goals: Object.keys(GOALS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
