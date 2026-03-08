/**
 * AutoClaw ELA Vocabulary & Spelling Progress Tracker
 * No external dependencies. Node.js built-in APIs only.
 *
 * Usage:
 *   const Vocabulary = require('./vocabulary');
 *   const vocab = new Vocabulary();
 *   const profile = await vocab.getProfile('student-1');
 *   await vocab.recordAssessment('student-1', 'grade-3', 'morphology', 'prefixes-un-re-pre', 4, 5);
 *   const progress = await vocab.getProgress('student-1');
 *   const next = await vocab.getNextSkills('student-1');
 *   const report = await vocab.getReport('student-1');
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const MASTERY_THRESHOLD = 0.8;

// ── Skill Catalog ────────────────────────────────────────

const SKILLS = {
  'kindergarten': {
    'word-learning': ['basic-vocabulary-tier1'],
    'spelling': ['letter-sound-matches', 'cvc-spelling'],
  },
  'grade-1': {
    'word-learning': ['tier2-describe-compare-because'],
    'word-relationships': ['synonyms-intro', 'antonyms-intro'],
    'spelling': ['digraphs-blends-spelling', 'cvce-spelling'],
    'dictionary': ['alphabetical-order'],
  },
  'grade-2': {
    'context-clues': ['definition-clues', 'synonym-clues', 'antonym-clues'],
    'word-relationships': ['shades-of-meaning', 'homophones', 'multiple-meaning-words'],
    'morphology': ['prefixes-un-re', 'suffixes-ful-less-ly'],
    'spelling': ['vowel-teams-spelling', 'r-controlled-spelling', 'drop-e-rule', 'double-consonant-rule'],
    'dictionary': ['use-glossary'],
  },
  'grade-3': {
    'context-clues': ['example-clues', 'general-context'],
    'morphology': ['prefixes-un-re-pre', 'prefixes-dis-mis-non', 'suffixes-tion-sion', 'suffixes-ment-ness', 'suffixes-able-ible'],
    'latin-greek-roots': ['aud-dict-graph', 'port-rupt-struct'],
    'word-relationships': ['synonyms-advanced', 'antonyms-advanced'],
    'spelling': ['i-before-e', 'change-y-to-i', 'prefix-suffix-patterns'],
    'dictionary': ['guide-words', 'choose-correct-definition'],
    'tier2-words': ['determine-predict-identify'],
  },
  'grade-4': {
    'context-clues': ['all-clue-types'],
    'morphology': ['prefixes-over-under-sub-super', 'prefixes-inter-trans-semi', 'suffixes-ous-ious'],
    'latin-greek-roots': ['spec-tract-vis', 'bio-geo-phon', 'auto-tele'],
    'word-part-analysis': ['break-down-unknown-words'],
    'spelling': ['greek-latin-root-patterns', 'tion-sion-patterns', 'multisyllable-patterns'],
    'dictionary': ['pronunciation-guide', 'digital-dictionary'],
    'tier2-words': ['analyze-evaluate-infer'],
  },
  'grade-5-6': {
    'morphology': ['absorbed-prefixes-il-ir-im', 'advanced-suffixes'],
    'latin-greek-roots': ['advanced-roots-etymology'],
    'word-relationships': ['word-origins', 'connotation-denotation'],
    'spelling': ['advanced-roots-spelling', 'absorbed-prefix-spelling'],
    'tier2-words': ['critique-distinguish-formulate'],
    'vocabulary-tiers': ['tier2-academic-words', 'tier3-domain-specific'],
  },
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
    createdAt: new Date().toISOString(),
    assessments: [],
    skills: {},
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

// ── Public API ───────────────────────────────────────────

class Vocabulary {
  async getProfile(studentId) {
    const profile = loadProfile(studentId);
    return {
      studentId: profile.studentId,
      grade: profile.grade,
      createdAt: profile.createdAt,
      totalAssessments: profile.assessments.length,
      summary: `Student: ${profile.studentId} | Grade: ${profile.grade || 'not set'} | Assessments: ${profile.assessments.length}`,
    };
  }

  async setGrade(studentId, grade) {
    const profile = loadProfile(studentId);
    profile.grade = grade;
    saveProfile(profile);
    return { studentId, grade, summary: `Grade set to ${grade} for ${studentId}` };
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
    const results = {};
    let masteredCount = 0;
    let totalCount = 0;

    for (const [category, skills] of Object.entries(gradeSkills)) {
      results[category] = {};
      for (const skill of skills) {
        totalCount++;
        const key = `${grade}/${category}/${skill}`;
        const data = profile.skills[key];
        if (data) {
          results[category][skill] = { mastery: data.mastery, label: data.label };
          if (data.mastery >= MASTERY_THRESHOLD) masteredCount++;
        } else {
          results[category][skill] = { mastery: 0, label: 'not-started' };
        }
      }
    }

    const overallPct = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

    let summary = `**${studentId}** — Grade: ${grade} | ${masteredCount}/${totalCount} skills proficient (${overallPct}%)\n\n`;
    for (const [category, skills] of Object.entries(results)) {
      summary += `**${category}**\n`;
      for (const [skill, info] of Object.entries(skills)) {
        const bar = info.mastery > 0 ? '█'.repeat(Math.round(info.mastery * 10)) + '░'.repeat(10 - Math.round(info.mastery * 10)) : '░░░░░░░░░░';
        summary += `  ${skill}: ${bar} ${info.label}\n`;
      }
    }

    return { studentId, grade, mastered: masteredCount, total: totalCount, overallPct, skills: results, summary: summary.trim() };
  }

  async getNextSkills(studentId, count = 5) {
    const profile = loadProfile(studentId);
    const grade = profile.grade || 'kindergarten';
    const gradeSkills = SKILLS[grade] || {};
    const candidates = [];

    for (const [category, skills] of Object.entries(gradeSkills)) {
      for (const skill of skills) {
        const key = `${grade}/${category}/${skill}`;
        const data = profile.skills[key];
        const mastery = data ? data.mastery : 0;
        if (mastery < MASTERY_THRESHOLD) {
          candidates.push({ grade, category, skill, mastery, label: data ? data.label : 'not-started' });
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
        summary += `  • ${s.category} → ${s.skill} (${s.label}, ${Math.round(s.mastery * 100)}%)\n`;
      }
    }

    return { studentId, grade, next, summary: summary.trim() };
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
        summary += `  ${date} | ${a.skill}: ${a.score}/${a.total}`;
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
    let summary = `**${grade} Skill Catalog:**\n`;
    for (const [category, skills] of Object.entries(gradeSkills)) {
      totalSkills += skills.length;
      summary += `  ${category}: ${skills.join(', ')}\n`;
    }
    summary += `Total: ${totalSkills} skills`;

    return { grade, skills: gradeSkills, totalSkills, summary };
  }
}

module.exports = Vocabulary;
