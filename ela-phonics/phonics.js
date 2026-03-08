/**
 * AutoClaw ELA Phonics Progress Tracker
 * No external dependencies. Node.js built-in APIs only.
 *
 * Usage:
 *   const Phonics = require('./phonics');
 *   const phonics = new Phonics();
 *   const profile = await phonics.getProfile('student-1');
 *   await phonics.recordAssessment('student-1', 'kindergarten', 'cvc-words', 'cvc-blending', 4, 5);
 *   const progress = await phonics.getProgress('student-1');
 *   const next = await phonics.getNextSkills('student-1');
 *   const report = await phonics.getReport('student-1');
 */

const fs = require('fs');
const path = require('path');

const AGENT_DIR = path.join(__dirname, '..', '..', 'autoclaw', 'agent-id');
const DATA_DIR = path.join(AGENT_DIR, 'data', 'ela-phonics');
const MASTERY_THRESHOLD = 0.8;

// ── Skill Catalog ────────────────────────────────────────

const SKILLS = {
  'pre-k': {
    'phonological-awareness': ['rhyme-recognition', 'rhyme-production', 'syllable-counting', 'initial-sounds', 'blending-onset-rime'],
  },
  'kindergarten': {
    'letter-sounds': ['letter-names-and-sounds'],
    'short-vowels': ['short-a', 'short-e', 'short-i', 'short-o', 'short-u'],
    'cvc-words': ['cvc-blending', 'cvc-segmenting'],
    'sight-words': ['high-frequency-set-1'],
  },
  'grade-1': {
    'consonant-digraphs': ['sh', 'ch', 'th', 'wh', 'ck'],
    'initial-blends': ['bl-cr-fl-gr', 'sn-st-tr'],
    'final-blends': ['nd-nk', 'mp-lt-ft'],
    'silent-e': ['cvce-long-vowels'],
    'vowel-teams': ['ai-ay', 'ee-ea', 'oa-ow'],
    'r-controlled': ['ar', 'er-ir-ur', 'or'],
    'inflectional-endings': ['s-es', 'ed', 'ing'],
  },
  'grade-2': {
    'vowel-teams-extended': ['oi-oy', 'ou-ow', 'au-aw', 'oo'],
    'soft-c-g': ['soft-c', 'soft-g'],
    'silent-letters': ['kn-wr', 'gn-mb'],
    'syllable-types': ['closed', 'open', 'vce', 'vowel-team', 'r-controlled', 'consonant-le'],
    'multisyllabic': ['two-syllable-words'],
    'contractions': ['common-contractions'],
    'prefixes-suffixes-intro': ['un-re', 'ful-less-ly'],
  },
  'grade-3': {
    'multisyllabic-advanced': ['three-plus-syllable-words'],
    'prefixes': ['un-re-pre', 'dis-mis-non'],
    'suffixes': ['tion-sion', 'ment-ness', 'able-ible'],
    'latin-roots': ['struct-port-dict'],
    'irregular-spellings': ['ough-patterns'],
    'homophones': ['their-there-theyre', 'to-too-two'],
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

class Phonics {
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
    const grade = profile.grade || 'pre-k';
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
    const grade = profile.grade || 'pre-k';
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

module.exports = Phonics;
