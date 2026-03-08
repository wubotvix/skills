/**
 * AutoClaw ELA Writing Progress Tracker
 * No external dependencies. Node.js built-in APIs only.
 *
 * Usage:
 *   const Writing = require('./writing');
 *   const writing = new Writing();
 *   const profile = await writing.getProfile('student-1');
 *   await writing.recordAssessment('student-1', 'grade-3', 'narrative', 'dialogue-and-description', 3, 4);
 *   const progress = await writing.getProgress('student-1');
 *   const next = await writing.getNextSkills('student-1');
 *   const report = await writing.getReport('student-1');
 */

const fs = require('fs');
const path = require('path');

const AGENT_DIR = path.join(__dirname, '..', '..', 'autoclaw', 'agent-id');
const DATA_DIR = path.join(AGENT_DIR, 'data', 'ela-writing');
const MASTERY_THRESHOLD = 0.8;

// ── Skill Catalog ────────────────────────────────────────

const SKILLS = {
  'kindergarten': {
    'narrative': ['draw-and-write-event'],
    'informational': ['name-topic-supply-facts'],
    'opinion': ['state-opinion-supply-reason'],
    'process': ['drawing-with-labels'],
  },
  'grade-1': {
    'narrative': ['recount-sequenced-events', 'include-details-closure'],
    'informational': ['name-topic-facts-closure'],
    'opinion': ['state-opinion-supply-reasons-closure'],
    'process': ['prewrite-brainstorm', 'draft-get-ideas-down'],
  },
  'grade-2': {
    'narrative': ['well-elaborated-event', 'actions-thoughts-feelings'],
    'informational': ['topic-facts-definitions-conclusion'],
    'opinion': ['opinion-reasons-linking-words-conclusion'],
    'craft': ['show-dont-tell', 'strong-leads'],
    'process': ['revise-arms', 'edit-cups'],
  },
  'grade-3': {
    'narrative': ['establish-situation-characters', 'use-dialogue', 'sequence-events', 'provide-closure'],
    'informational': ['group-related-info', 'develop-with-facts', 'use-linking-words'],
    'opinion': ['introduce-topic-state-opinion', 'supply-reasons', 'linking-words-conclusion'],
    'craft': ['transitions', 'sentence-variety'],
    'process': ['prewrite-graphic-organizer', 'revise-for-ideas', 'edit-for-conventions'],
  },
  'grade-4': {
    'narrative': ['orient-reader-setting-characters', 'dialogue-and-description', 'develop-events', 'provide-conclusion'],
    'informational': ['organize-with-headings', 'develop-with-facts-quotations', 'domain-specific-vocabulary'],
    'opinion': ['reasons-supported-by-facts', 'group-related-ideas'],
    'craft': ['strong-leads-advanced', 'show-dont-tell-advanced', 'transitions-advanced'],
    'process': ['revise-organization', 'edit-grammar-spelling', 'publish-share'],
  },
  'grade-5': {
    'narrative': ['narrative-techniques', 'organize-clear-sequence', 'pacing'],
    'informational': ['organize-logically', 'precise-language', 'develop-with-details-quotations'],
    'opinion': ['logically-ordered-reasons', 'facts-and-details', 'conclusion-related-to-opinion'],
    'craft': ['sentence-combining-reducing', 'voice-and-tone', 'word-choice'],
    'process': ['peer-revision', 'self-editing-checklist'],
  },
  'grade-6': {
    'narrative': ['engage-reader', 'develop-characters-plot', 'manage-pacing', 'reflective-conclusion'],
    'informational': ['headings-and-graphics', 'relevant-facts-quotations', 'appropriate-transitions', 'maintain-formal-style'],
    'opinion': ['introduce-claims', 'clear-reasons-relevant-evidence', 'clarify-relationships', 'formal-style-concluding'],
    'craft': ['vary-sentence-patterns', 'precise-word-choice', 'maintain-consistent-style'],
    'process': ['writing-workshop-full', 'conference-and-feedback'],
  },
};

// ── File I/O ─────────────────────────────────────────────

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function profilePath(studentId) {
  const safe = String(studentId).replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(DATA_DIR, `${safe}.json`);
}

function loadProfile(studentId) {
  const fp = profilePath(studentId);
  if (fs.existsSync(fp)) {
    try {
      return JSON.parse(fs.readFileSync(fp, 'utf8'));
    } catch (e) {
      const backup = fp + '.corrupt.' + Date.now();
      fs.renameSync(fp, backup);
      return { studentId, grade: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
    }
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
  const total = recent.reduce((sum, a) => a.total > 0 ? sum + a.score / a.total : sum, 0);
  const validCount = recent.filter(a => a.total > 0).length;
  if (validCount === 0) return 0;
  return Math.round((total / validCount) * 100) / 100;
}

function masteryLabel(ratio) {
  if (ratio >= 0.9) return 'mastered';
  if (ratio >= MASTERY_THRESHOLD) return 'proficient';
  if (ratio >= 0.6) return 'developing';
  if (ratio > 0) return 'emerging';
  return 'not-started';
}

// ── Public API ───────────────────────────────────────────

class Writing {
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
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    const profile = loadProfile(studentId);
    profile.grade = grade;
    saveProfile(profile);
    return { studentId, grade, summary: `Grade set to ${grade} for ${studentId}` };
  }

  async recordAssessment(studentId, grade, category, skill, score, total, notes = '') {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    if (!SKILLS[grade][category]) throw new Error(`Unknown category '${category}' for ${grade}. Valid: ${Object.keys(SKILLS[grade]).join(', ')}`);
    if (!SKILLS[grade][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${grade}/${category}. Valid: ${SKILLS[grade][category].join(', ')}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be a positive number');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be a number between 0 and ${total}`);
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
    const students = files.map(f => f.replace(/\.json$/, ''));
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
    const skillsCopy = {};
    let summary = `**${grade} Skill Catalog:**\n`;
    for (const [category, skills] of Object.entries(gradeSkills)) {
      totalSkills += skills.length;
      skillsCopy[category] = [...skills];
      summary += `  ${category}: ${skills.join(', ')}\n`;
    }
    summary += `Total: ${totalSkills} skills`;

    return { grade, skills: skillsCopy, totalSkills, summary };
  }
}

module.exports = Writing;
