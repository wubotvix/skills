// eClaw Social Studies Study Planner & Coordinator (K-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'socialstudies-study-planner');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'history': ['past-and-present', 'personal-history', 'holidays'],
    'geography': ['maps-intro', 'my-place', 'land-and-water'],
    'civics': ['rules', 'community-helpers', 'fairness'],
    'economics': ['wants-and-needs', 'goods-and-services', 'jobs'],
    'culture': ['identity', 'family', 'celebrations'],
    'inquiry': ['see-think-wonder', 'how-do-we-know', 'sequencing'],
    'current-events': ['real-vs-pretend', 'community-awareness', 'helpers-in-news'],
  },
  'grade-1': {
    'history': ['comparing-past-present', 'family-history', 'national-symbols'],
    'geography': ['map-skills', 'neighborhood-geography', 'weather-and-seasons'],
    'civics': ['rules-and-laws', 'symbols-and-traditions', 'community-roles'],
    'economics': ['wants-needs', 'money-basics', 'sharing-and-trading'],
    'culture': ['family-structures', 'similarities-differences', 'celebrations'],
    'inquiry': ['observations', 'i-wonder-questions', 'sources-of-info'],
    'current-events': ['fact-vs-fiction', 'community-news', 'identifying-helpers'],
  },
  'grade-2': {
    'history': ['local-history', 'native-americans', 'timelines'],
    'geography': ['map-reading', 'continents-oceans', 'community-geography'],
    'civics': ['government-services', 'local-government', 'rights-responsibilities'],
    'economics': ['scarcity', 'opportunity-cost', 'producers-consumers'],
    'culture': ['community-cultures', 'immigration', 'traditions'],
    'inquiry': ['primary-secondary-sources', 'five-ws', 'simple-evidence'],
    'current-events': ['five-ws', 'kid-news', 'fact-vs-opinion'],
  },
  'grade-3': {
    'history': ['state-history', 'native-peoples', 'cause-and-effect'],
    'geography': ['regions', 'physical-features', 'human-environment'],
    'civics': ['levels-of-government', 'elections', 'community-participation'],
    'economics': ['resources', 'specialization', 'saving'],
    'culture': ['cultural-universals', 'indigenous-cultures', 'cultural-exchange'],
    'inquiry': ['supporting-questions', 'source-types', 'evidence-claims'],
    'current-events': ['deeper-questions', 'fact-opinion', 'news-connections'],
  },
  'grade-4': {
    'history': ['exploration', 'colonial-era', 'revolution'],
    'geography': ['us-regions', 'resources', 'movement-migration'],
    'civics': ['constitution', 'three-branches', 'state-government'],
    'economics': ['supply-demand', 'markets', 'entrepreneurship'],
    'culture': ['us-cultural-regions', 'immigration-waves', 'identity'],
    'inquiry': ['source-reliability', 'corroboration', 'compelling-questions'],
    'current-events': ['source-evaluation', 'bias-intro', 'perspective'],
  },
  'grade-5': {
    'history': ['constitution', 'westward-expansion', 'civil-war'],
    'geography': ['western-hemisphere', 'human-geography', 'environment'],
    'civics': ['bill-of-rights', 'checks-balances', 'civic-action'],
    'economics': ['financial-literacy', 'taxes', 'economic-regions'],
    'culture': ['cultural-conflict', 'contributions', 'empathy'],
    'inquiry': ['cer-arguments', 'soapstone', 'research-skills'],
    'current-events': ['sift-method', 'bias-detection', 'historical-parallels'],
  },
  'grade-6': {
    'history': ['early-humans', 'river-civilizations', 'greece-rome', 'medieval'],
    'geography': ['world-geography', 'climate-regions', 'globalization'],
    'civics': ['democratic-principles', 'comparative-government', 'foundations'],
    'economics': ['economic-systems', 'international-trade', 'ancient-economies'],
    'culture': ['world-cultures', 'ancient-cultures', 'cultural-diffusion', 'world-religions'],
    'inquiry': ['source-analysis', 'evaluating-bias', 'constructing-arguments'],
    'current-events': ['propaganda', 'digital-literacy', 'comparative-media'],
  },
  'grade-7': {
    'history': ['exploration', 'renaissance-reformation', 'enlightenment', 'revolutions', 'industrialization'],
    'geography': ['world-regions', 'population', 'urbanization'],
    'civics': ['state-local-government', 'political-process', 'media-and-politics'],
    'economics': ['market-structures', 'business-cycles', 'banking', 'personal-finance'],
    'culture': ['culture-identity', 'social-institutions', 'cultural-change', 'media-culture'],
    'inquiry': ['historiography', 'research-methods', 'synthesizing', 'academic-argument'],
    'current-events': ['media-ecosystems', 'algorithms', 'investigative', 'news-production'],
  },
  'grade-8': {
    'history': ['constitution-depth', 'civil-rights', 'world-wars', 'cold-war-modern'],
    'geography': ['geopolitics', 'environmental-issues', 'migration'],
    'civics': ['constitutional-law', 'landmark-cases', 'civil-rights', 'civic-engagement'],
    'economics': ['macroeconomics', 'monetary-policy', 'trade-policy', 'inequality'],
    'culture': ['cultural-anthropology', 'power-culture', 'diaspora', 'global-citizenship'],
    'inquiry': ['advanced-analysis', 'independent-research', 'civic-argumentation'],
    'current-events': ['rhetoric', 'data-literacy', 'citizen-journalism', 'media-democracy'],
  },
};

const DOMAINS = ['history', 'geography', 'civics', 'economics', 'culture', 'inquiry', 'current-events'];

const DOMAIN_LABELS = {
  'history': 'History',
  'geography': 'Geography',
  'civics': 'Civics & Government',
  'economics': 'Economics',
  'culture': 'Culture & Society',
  'inquiry': 'Inquiry & Evidence',
  'current-events': 'Current Events & Media Literacy',
};

const GOALS = {
  'catch-up': { label: 'Catch Up', focusWeakest: true, sessionsPerWeek: 5, minutesPerSession: 30 },
  'stay-strong': { label: 'Stay Strong', focusWeakest: false, sessionsPerWeek: 4, minutesPerSession: 25 },
  'explore-passion': { label: 'Explore a Passion', focusWeakest: false, sessionsPerWeek: 3, minutesPerSession: 30 },
  'get-ahead': { label: 'Get Ahead', focusWeakest: false, sessionsPerWeek: 5, minutesPerSession: 30 },
  'current-events': { label: 'Current Events Focus', focusWeakest: false, sessionsPerWeek: 4, minutesPerSession: 25 },
  'cultural-connection': { label: 'Cultural Connection', focusWeakest: false, sessionsPerWeek: 3, minutesPerSession: 25 },
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

  recordAssessment(id, domain, category, skill, score, total) {
    if (!DOMAINS.includes(domain)) throw new Error(`Unknown domain: ${domain}. Valid: ${DOMAINS.join(', ')}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);

    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const entry = { date: new Date().toISOString(), domain, category, skill, score, total };
    p.assessments.push(entry);

    const key = `${grade}/${domain}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);

    updateStreak(p);
    saveProfile(p);
    return { studentId: id, domain, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
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
    const grade = p.grade || 'kindergarten';
    const goalConfig = GOALS[p.goal] || GOALS['stay-strong'];
    const sessionsPerWeek = goalConfig.sessionsPerWeek;
    const minutesPerSession = p.dailyMinutes || goalConfig.minutesPerSession;

    const domainScores = DOMAINS.map(d => ({ domain: d, label: DOMAIN_LABELS[d], mastery: getDomainMastery(p, grade, d) }));
    domainScores.sort((a, b) => a.mastery - b.mastery);

    const plan = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const startDay = 1;

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
        delegateTo: `socialstudies-${domain.domain}`,
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
    const grade = p.grade || 'kindergarten';
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
      delegateTo: `socialstudies-${todayDomain.domain}`,
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

  getStreak(id) {
    const p = loadProfile(id);
    return { studentId: id, streak: p.streak };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
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
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'assess': case 'record': {
        const [, id, domain, cat, skill, sc, tot] = args;
        if (!id || !domain || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <domain> <cat> <skill> <score> <total>');
        out(api.recordAssessment(id, domain, cat, skill, Number(sc), Number(tot)));
        break;
      }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'streak': { const [, id] = args; if (!id) throw new Error('Usage: streak <id>'); out(api.getStreak(id)); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(api.setGrade(id, g)); break; }
      case 'set-goal': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-goal <id> <goal>'); out(api.setGoal(id, g)); break; }
      case 'set-time': { const [, id, m] = args; if (!id || !m) throw new Error('Usage: set-time <id> <minutes>'); out(api.setTime(id, m)); break; }
      case 'students': { out(api.listStudents()); break; }
      default: out({ usage: 'node study-planner.js <command> [args]', commands: ['start','plan','today','progress','record','report','streak','set-grade','set-goal','set-time','students'], grades: Object.keys(SKILLS), goals: Object.keys(GOALS), domains: DOMAINS });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
