// Shared utilities for language skills. No external deps.
const fs = require('fs');
const path = require('path');

const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const MASTERY_THRESHOLD = 0.8;
const FSRS_FACTOR = 19 / 81;
const FSRS_DECAY = -0.5;
const DEFAULT_RETENTION = 0.9;

// File I/O

function dataDir(skillName) {
  return path.join(__dirname, '..', '..', 'data', skillName);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function profilePath(dir, id) {
  return path.join(dir, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json');
}

function loadProfile(dir, id) {
  ensureDir(dir);
  const fp = profilePath(dir, id);
  if (fs.existsSync(fp)) {
    try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
    catch { console.error('[warn] Corrupt profile ' + fp + ' — renamed to backup.'); fs.renameSync(fp, fp + '.corrupt.' + Date.now()); }
  }
  return {
    studentId: id, level: null, l1: null, goal: null, variant: null,
    createdAt: new Date().toISOString(), assessments: [], skills: {}, sessions: [],
  };
}

function saveProfile(dir, p) {
  ensureDir(dir);
  if (p.assessments && p.assessments.length > 200) p.assessments = p.assessments.slice(-200);
  if (p.sessions && p.sessions.length > 200) p.sessions = p.sessions.slice(-200);
  fs.writeFileSync(profilePath(dir, p.studentId), JSON.stringify(p, null, 2), 'utf8');
}

function listProfiles(dir) {
  ensureDir(dir);
  return fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, ''));
}

// Mastery

function calcMastery(attempts) {
  if (!attempts || !attempts.length) return 0;
  const recent = attempts.slice(-5).filter(a => a.total > 0);
  return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0;
}

function masteryLabel(r) {
  return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started';
}

// FSRS

function fsrsRetention(t, S) {
  if (S <= 0) S = 0.5;
  return Math.pow(1 + FSRS_FACTOR * t / S, FSRS_DECAY);
}

function fsrsNextReview(S, retention) {
  retention = retention || DEFAULT_RETENTION;
  return Math.max(1, Math.round(S * (Math.pow(retention, 1 / FSRS_DECAY) - 1) / FSRS_FACTOR));
}

function fsrsUpdateStability(S, D, grade) {
  if (grade === 1) return Math.max(0.5, S * 0.2);
  const bonus = grade === 4 ? 1.3 : grade === 3 ? 1.0 : 0.8;
  const diffFactor = 1 + (10 - D) / 10;
  return Math.round(S * bonus * diffFactor * 100) / 100;
}

function fsrsUpdateDifficulty(D, grade) {
  const delta = grade === 1 ? 1.0 : grade === 2 ? 0.3 : grade === 3 ? -0.1 : -0.3;
  return Math.max(1, Math.min(10, Math.round((D + delta) * 100) / 100));
}

// Helpers

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }

function norm(s) { return String(s).normalize('NFC').toLowerCase().trim().replace(/[\s]+/g, ' '); }

function isValidGrade(grade, min, max) { return !isNaN(grade) && grade >= min && grade <= max; }

function today() { return new Date().toISOString().slice(0, 10); }

// CLI

function runCLI(handler) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const out = d => console.log(JSON.stringify(d, null, 2));
  try {
    handler(cmd, args, out);
  } catch (err) {
    out({ error: err.message });
    process.exit(1);
  }
}

module.exports = {
  CEFR, MASTERY_THRESHOLD, DEFAULT_RETENTION,
  dataDir, ensureDir, profilePath, loadProfile, saveProfile, listProfiles,
  calcMastery, masteryLabel,
  fsrsRetention, fsrsNextReview, fsrsUpdateStability, fsrsUpdateDifficulty,
  shuffle, pick, norm, isValidGrade, today, runCLI,
};
