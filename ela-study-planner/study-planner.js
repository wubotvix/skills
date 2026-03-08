/**
 * AutoClaw ELA Study Planner Progress Tracker
 * No external dependencies. Node.js built-in APIs only.
 *
 * Usage:
 *   const StudyPlanner = require('./study-planner');
 *   const planner = new StudyPlanner();
 *   const profile = await planner.getProfile('student-1');
 *   await planner.setGoal('student-1', 'stay-strong');
 *   await planner.setTimeBudget('student-1', 30);
 *   await planner.recordAssessment('student-1', 'grade-3', 'phonics', 'digraphs', 4, 5);
 *   const plan = await planner.getWeeklyPlan('student-1');
 *   await planner.addBook('student-1', 'Charlotte\'s Web', 184);
 *   const progress = await planner.getProgress('student-1');
 *   const report = await planner.getReport('student-1');
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const MASTERY_THRESHOLD = 0.8;

// ── Skill Catalog (Cross-Skill Diagnostic) ───────────────

const SKILLS = {
  'kindergarten': {
    'phonics': ['letter-sounds', 'short-vowels', 'cvc-words'],
    'reading-literature': ['name-characters', 'identify-setting', 'retell-bme'],
    'reading-informational': ['name-topic', 'identify-details', 'use-pictures'],
    'writing': ['draw-and-write', 'write-opinion-reason'],
    'grammar': ['capitalize-first-word', 'end-punctuation', 'common-nouns'],
    'vocabulary': ['basic-words', 'phonetic-spelling'],
    'speaking-listening': ['take-turns', 'speak-audibly'],
  },
  'grade-1': {
    'phonics': ['digraphs', 'blends', 'silent-e', 'vowel-teams'],
    'reading-literature': ['describe-characters', 'retell-key-details', 'problem-solution'],
    'reading-informational': ['identify-topic', 'key-details', 'text-features'],
    'writing': ['narrative-sequenced', 'informational-facts', 'opinion-reasons'],
    'grammar': ['common-proper-nouns', 'past-present-future', 'conjunctions'],
    'vocabulary': ['synonyms-antonyms', 'context-clues-intro'],
    'speaking-listening': ['respond-to-comments', 'complete-sentences'],
  },
  'grade-2': {
    'phonics': ['vowel-teams-extended', 'syllable-types', 'multisyllabic'],
    'reading-literature': ['character-response', 'lesson-of-fable', 'text-structure'],
    'reading-informational': ['main-topic-multi-paragraph', 'text-features', 'authors-purpose'],
    'writing': ['narrative-elaborated', 'informational-paragraph', 'opinion-linking-words'],
    'grammar': ['irregular-plurals', 'irregular-past-tense', 'apostrophes'],
    'vocabulary': ['shades-of-meaning', 'homophones', 'prefixes-un-re'],
    'speaking-listening': ['build-on-others-talk', 'retell-with-details'],
  },
  'grade-3': {
    'phonics': ['prefixes-suffixes', 'latin-roots', 'multisyllabic-advanced'],
    'reading-literature': ['determine-theme', 'character-traits', 'point-of-view'],
    'reading-informational': ['main-idea-with-details', 'text-structure', 'compare-two-texts'],
    'writing': ['narrative-dialogue', 'informational-organized', 'opinion-with-reasons'],
    'grammar': ['subject-verb-agreement', 'possessives', 'quotation-marks'],
    'vocabulary': ['morphology-prefixes', 'latin-greek-roots', 'context-clues'],
    'speaking-listening': ['come-prepared', 'report-with-facts'],
  },
  'grade-4': {
    'phonics': ['advanced-patterns', 'word-analysis'],
    'reading-literature': ['theme-with-evidence', 'character-in-depth', 'first-vs-third-person'],
    'reading-informational': ['main-idea-summarize', 'text-structure-types', 'evidence-based'],
    'writing': ['narrative-setting-characters', 'informational-headings', 'opinion-facts-details'],
    'grammar': ['relative-pronouns', 'progressive-tenses', 'confused-words'],
    'vocabulary': ['word-part-analysis', 'greek-latin-roots', 'dictionary-skills'],
    'speaking-listening': ['carry-out-roles', 'present-with-facts'],
  },
  'grade-5': {
    'phonics': ['etymology', 'complex-word-analysis'],
    'reading-literature': ['two-or-more-themes', 'compare-characters', 'narrator-pov'],
    'reading-informational': ['two-main-ideas', 'compare-structure', 'quote-accurately'],
    'writing': ['narrative-techniques', 'informational-precise', 'opinion-logically-ordered'],
    'grammar': ['perfect-tenses', 'correlative-conjunctions', 'consistent-tense'],
    'vocabulary': ['advanced-morphology', 'connotation', 'academic-words'],
    'speaking-listening': ['summarize-presentation', 'sequence-logically'],
  },
  'grade-6': {
    'phonics': ['advanced-etymology'],
    'reading-literature': ['analyze-theme-development', 'character-change', 'compare-genres'],
    'reading-informational': ['central-idea-summary', 'trace-argument', 'evaluate-claims'],
    'writing': ['narrative-engage-reader', 'informational-formal-style', 'argument-claims-evidence'],
    'grammar': ['pronoun-cases', 'pronoun-antecedent', 'vary-sentences'],
    'vocabulary': ['advanced-roots', 'domain-specific', 'word-origins'],
    'speaking-listening': ['elaborate-discussion', 'multimedia-presentation'],
  },
};

// ── Time Allocation by Goal ──────────────────────────────

const TIME_ALLOCATION = {
  'catch-up':       { phonics: 25, 'reading-literature': 15, 'reading-informational': 10, writing: 15, grammar: 15, vocabulary: 15, 'speaking-listening': 5 },
  'stay-strong':    { phonics: 10, 'reading-literature': 20, 'reading-informational': 15, writing: 20, grammar: 10, vocabulary: 15, 'speaking-listening': 10 },
  'get-ahead':      { phonics: 5,  'reading-literature': 20, 'reading-informational': 15, writing: 20, grammar: 10, vocabulary: 15, 'speaking-listening': 15 },
  'love-reading':   { phonics: 5,  'reading-literature': 30, 'reading-informational': 20, writing: 10, grammar: 5,  vocabulary: 20, 'speaking-listening': 10 },
  'writing-focus':  { phonics: 5,  'reading-literature': 10, 'reading-informational': 10, writing: 35, grammar: 15, vocabulary: 15, 'speaking-listening': 10 },
  'test-prep':      { phonics: 10, 'reading-literature': 20, 'reading-informational': 20, writing: 20, grammar: 10, vocabulary: 15, 'speaking-listening': 5 },
};

const AREA_LABELS = {
  'phonics': 'Phonics/Decoding',
  'reading-literature': 'Reading: Literature',
  'reading-informational': 'Reading: Informational',
  'writing': 'Writing',
  'grammar': 'Grammar',
  'vocabulary': 'Vocabulary',
  'speaking-listening': 'Speaking/Listening',
};

const WEEKDAY_PLANS = {
  'Mon': ['reading-literature', 'vocabulary'],
  'Tue': ['writing', 'grammar'],
  'Wed': ['reading-informational', 'phonics'],
  'Thu': ['writing', 'speaking-listening'],
  'Fri': ['reading-literature', 'vocabulary'],
};

// ── File I/O ─────────────────────────────────────────────

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function profilePath(studentId) {
  return path.join(DATA_DIR, `${studentId}.json`);
}

function loadProfile(studentId) {
  const fp = profilePath(studentId);
  if (fs.existsSync(fp)) {
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
  }
  return {
    studentId,
    grade: null,
    goal: null,
    timeBudget: 30,
    createdAt: new Date().toISOString(),
    assessments: [],
    skills: {},
    books: [],
  };
}

function saveProfile(profile) {
  ensureDataDir();
  fs.writeFileSync(profilePath(profile.studentId), JSON.stringify(profile, null, 2), 'utf8');
}

// ── Mastery Calculation ──────────────────────────────────

function calcMastery(assessments) {
  if (assessments.length === 0) return 0;
  const recent = assessments.slice(-5);
  const total = recent.reduce((sum, a) => sum + a.score / a.total, 0);
  return Math.round((total / recent.length) * 100) / 100;
}

function masteryLabel(ratio) {
  if (ratio >= 0.9) return 'mastered';
  if (ratio >= MASTERY_THRESHOLD) return 'proficient';
  if (ratio >= 0.6) return 'developing';
  if (ratio > 0) return 'emerging';
  return 'not-started';
}

function statusIcon(ratio) {
  if (ratio >= 0.9) return '✓ Strong';
  if (ratio >= MASTERY_THRESHOLD) return '✓ On Track';
  if (ratio >= 0.6) return '▲ Growing';
  if (ratio > 0) return '⚠ Needs Work';
  return '— Not Started';
}

// ── Public API ───────────────────────────────────────────

class StudyPlanner {
  async getProfile(studentId) {
    const profile = loadProfile(studentId);
    return {
      studentId: profile.studentId,
      grade: profile.grade,
      goal: profile.goal,
      timeBudget: profile.timeBudget,
      createdAt: profile.createdAt,
      totalAssessments: profile.assessments.length,
      booksRead: profile.books.length,
      summary: `Student: ${profile.studentId} | Grade: ${profile.grade || 'not set'} | Goal: ${profile.goal || 'not set'} | ${profile.timeBudget} min/day | Books: ${profile.books.length}`,
    };
  }

  async setGrade(studentId, grade) {
    const profile = loadProfile(studentId);
    profile.grade = grade;
    saveProfile(profile);
    return { studentId, grade, summary: `Grade set to ${grade} for ${studentId}` };
  }

  async setGoal(studentId, goal) {
    const profile = loadProfile(studentId);
    if (!TIME_ALLOCATION[goal]) {
      return { studentId, goal: null, summary: `Unknown goal: ${goal}. Valid: ${Object.keys(TIME_ALLOCATION).join(', ')}` };
    }
    profile.goal = goal;
    saveProfile(profile);
    return { studentId, goal, summary: `Goal set to ${goal} for ${studentId}` };
  }

  async setTimeBudget(studentId, minutes) {
    const profile = loadProfile(studentId);
    profile.timeBudget = minutes;
    saveProfile(profile);
    return { studentId, timeBudget: minutes, summary: `Time budget set to ${minutes} min/day for ${studentId}` };
  }

  async recordAssessment(studentId, grade, category, skill, score, total, notes = '') {
    const profile = loadProfile(studentId);
    if (!profile.grade) profile.grade = grade;

    const entry = { date: new Date().toISOString(), grade, category, skill, score, total, notes };
    profile.assessments.push(entry);

    const key = `${grade}/${category}/${skill}`;
    if (!profile.skills[key]) profile.skills[key] = { attempts: [] };
    profile.skills[key].attempts.push({ date: entry.date, score, total });
    profile.skills[key].mastery = calcMastery(profile.skills[key].attempts);
    profile.skills[key].label = masteryLabel(profile.skills[key].mastery);

    saveProfile(profile);

    return {
      studentId,
      skill: key,
      score: `${score}/${total}`,
      mastery: profile.skills[key].mastery,
      label: profile.skills[key].label,
      summary: `Recorded ${score}/${total} for ${skill} → ${profile.skills[key].label} (${Math.round(profile.skills[key].mastery * 100)}%)`,
    };
  }

  async getProgress(studentId) {
    const profile = loadProfile(studentId);
    const grade = profile.grade || 'kindergarten';
    const gradeSkills = SKILLS[grade] || {};

    // Calculate per-area mastery
    const areaResults = {};
    let totalMastered = 0;
    let totalSkills = 0;

    for (const [area, skills] of Object.entries(gradeSkills)) {
      let areaMastered = 0;
      let areaTotal = skills.length;
      const skillResults = {};

      for (const skill of skills) {
        totalSkills++;
        const key = `${grade}/${area}/${skill}`;
        const data = profile.skills[key];
        if (data) {
          skillResults[skill] = { mastery: data.mastery, label: data.label };
          if (data.mastery >= MASTERY_THRESHOLD) { areaMastered++; totalMastered++; }
        } else {
          skillResults[skill] = { mastery: 0, label: 'not-started' };
        }
      }

      const areaMasteryPct = areaTotal > 0 ? Math.round((areaMastered / areaTotal) * 100) : 0;
      areaResults[area] = {
        mastered: areaMastered,
        total: areaTotal,
        pct: areaMasteryPct,
        status: statusIcon(areaMasteryPct / 100),
        skills: skillResults,
      };
    }

    const overallPct = totalSkills > 0 ? Math.round((totalMastered / totalSkills) * 100) : 0;

    // Build dashboard
    let summary = `**ELA PROGRESS DASHBOARD — ${studentId}**\n`;
    summary += `Grade: ${grade} | Goal: ${profile.goal || 'not set'} | ${profile.timeBudget} min/day\n\n`;
    summary += `Skill Area              Proficient  Status\n`;
    summary += `──────────────────────────────────────────\n`;
    for (const [area, info] of Object.entries(areaResults)) {
      const label = (AREA_LABELS[area] || area).padEnd(24);
      summary += `${label}${info.mastered}/${info.total} (${info.pct}%)   ${info.status}\n`;
    }
    summary += `──────────────────────────────────────────\n`;
    summary += `Overall: ${totalMastered}/${totalSkills} (${overallPct}%) | Books Read: ${profile.books.length}`;

    return {
      studentId, grade, goal: profile.goal, overallPct,
      mastered: totalMastered, total: totalSkills,
      areas: areaResults, booksRead: profile.books.length,
      summary: summary.trim(),
    };
  }

  async getNextSkills(studentId, count = 5) {
    const profile = loadProfile(studentId);
    const grade = profile.grade || 'kindergarten';
    const gradeSkills = SKILLS[grade] || {};
    const candidates = [];

    for (const [area, skills] of Object.entries(gradeSkills)) {
      for (const skill of skills) {
        const key = `${grade}/${area}/${skill}`;
        const data = profile.skills[key];
        const mastery = data ? data.mastery : 0;
        if (mastery < MASTERY_THRESHOLD) {
          candidates.push({ grade, area, skill, mastery, label: data ? data.label : 'not-started' });
        }
      }
    }

    candidates.sort((a, b) => {
      const order = { 'developing': 0, 'emerging': 1, 'not-started': 2 };
      const oa = order[a.label] ?? 3;
      const ob = order[b.label] ?? 3;
      if (oa !== ob) return oa - ob;
      return b.mastery - a.mastery;
    });

    const next = candidates.slice(0, count);

    let summary = `**Next skills for ${studentId}** (${grade}):\n`;
    if (next.length === 0) {
      summary += `All skills at grade level are proficient! Ready for the next grade.`;
    } else {
      for (const s of next) {
        summary += `  • ${AREA_LABELS[s.area] || s.area} → ${s.skill} (${s.label}, ${Math.round(s.mastery * 100)}%)\n`;
      }
    }

    return { studentId, grade, next, summary: summary.trim() };
  }

  async getWeeklyPlan(studentId) {
    const profile = loadProfile(studentId);
    const grade = profile.grade || 'kindergarten';
    const goal = profile.goal || 'stay-strong';
    const budget = profile.timeBudget || 30;
    const alloc = TIME_ALLOCATION[goal] || TIME_ALLOCATION['stay-strong'];
    const halfBudget = Math.round(budget / 2);

    let summary = `**WEEKLY ELA PLAN — ${studentId}**\n`;
    summary += `Grade: ${grade} | Goal: ${goal} | ${budget} min/day\n\n`;
    summary += `Day    Skill 1 (${halfBudget} min)          Skill 2 (${halfBudget} min)\n`;
    summary += `─────────────────────────────────────────────────\n`;

    for (const [day, [s1, s2]] of Object.entries(WEEKDAY_PLANS)) {
      const l1 = (AREA_LABELS[s1] || s1).padEnd(26);
      const l2 = AREA_LABELS[s2] || s2;
      summary += `${day}    ${l1}${l2}\n`;
    }
    summary += `Sat    [Weekend Read-Aloud or Book Club]\n`;
    summary += `Sun    Rest / Journal (optional)\n`;
    summary += `\n**Time Allocation (${goal}):**\n`;
    for (const [area, pct] of Object.entries(alloc)) {
      summary += `  ${AREA_LABELS[area] || area}: ${pct}%\n`;
    }

    return { studentId, grade, goal, budget, plan: WEEKDAY_PLANS, allocation: alloc, summary: summary.trim() };
  }

  async addBook(studentId, title, pages = 0) {
    const profile = loadProfile(studentId);
    const entry = { title, pages, date: new Date().toISOString() };
    profile.books.push(entry);
    saveProfile(profile);

    const totalPages = profile.books.reduce((sum, b) => sum + (b.pages || 0), 0);
    return {
      studentId,
      book: entry,
      totalBooks: profile.books.length,
      totalPages,
      summary: `Added "${title}" (${pages} pages). Total: ${profile.books.length} books, ${totalPages} pages.`,
    };
  }

  async getReadingLog(studentId) {
    const profile = loadProfile(studentId);
    const books = profile.books;
    const totalPages = books.reduce((sum, b) => sum + (b.pages || 0), 0);

    let summary = `**Reading Log — ${studentId}** (${books.length} books, ${totalPages} pages)\n\n`;
    if (books.length === 0) {
      summary += '  No books logged yet.\n';
    } else {
      for (const b of books.slice(-20).reverse()) {
        const date = b.date.split('T')[0];
        summary += `  ${date} | "${b.title}" (${b.pages} pages)\n`;
      }
    }

    return { studentId, books, totalBooks: books.length, totalPages, summary: summary.trim() };
  }

  async getReport(studentId) {
    const profile = loadProfile(studentId);
    const progress = await this.getProgress(studentId);
    const recent = profile.assessments.slice(-20).reverse();

    let summary = progress.summary + '\n\n**Recent Assessments:**\n';
    if (recent.length === 0) {
      summary += '  No assessments yet.\n';
    } else {
      for (const a of recent) {
        const date = a.date.split('T')[0];
        summary += `  ${date} | ${a.category}/${a.skill}: ${a.score}/${a.total}`;
        if (a.notes) summary += ` — ${a.notes}`;
        summary += '\n';
      }
    }

    return { studentId, grade: profile.grade, progress, recentAssessments: recent, summary: summary.trim() };
  }

  async listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    const students = files.map(f => f.replace('.json', ''));
    return {
      count: students.length,
      students,
      summary: students.length > 0 ? `${students.length} student(s): ${students.join(', ')}` : 'No students yet.',
    };
  }

  async getSkillCatalog(grade) {
    const gradeSkills = SKILLS[grade];
    if (!gradeSkills) {
      return { grade, skills: null, summary: `Unknown grade: ${grade}. Valid: ${Object.keys(SKILLS).join(', ')}` };
    }

    let totalSkills = 0;
    let summary = `**${grade} Skill Catalog (All Areas):**\n`;
    for (const [area, skills] of Object.entries(gradeSkills)) {
      totalSkills += skills.length;
      summary += `  ${AREA_LABELS[area] || area}: ${skills.join(', ')}\n`;
    }
    summary += `Total: ${totalSkills} skills across 7 areas`;

    return { grade, skills: gradeSkills, totalSkills, summary };
  }
}

module.exports = StudyPlanner;
