#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'filipino-listening';

// ---------------------------------------------------------------------------
// Embedded exercise data by CEFR level
// ---------------------------------------------------------------------------

const EXERCISES = {
  A1: [
    {
      id: 'a1-dict-palengke',
      title: 'Sa palengke',
      type: 'dictation',
      transcript: 'Magandang umaga po. Magkano po ang mangga?',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Magandang umaga po. Magkano po ang mangga?',
          explanation: 'Note the linker -ng on "maganda" and the politeness marker "po".'
        }
      ],
      vocabulary: ['magkano', 'mangga', 'po'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-dict-pagpapakilala',
      title: 'Pagpapakilala',
      type: 'dictation',
      transcript: 'Kumusta po. Ang pangalan ko ay Maria. Taga-Maynila po ako.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Kumusta po. Ang pangalan ko ay Maria. Taga-Maynila po ako.',
          explanation: '"Taga-" prefix means "from". Note po for politeness.'
        }
      ],
      vocabulary: ['pangalan', 'taga-', 'kumusta'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-comp-greetings',
      title: 'Pagbati sa umaga',
      type: 'comprehension',
      transcript: 'JUAN: Magandang umaga po, Tita!\nTITA: Magandang umaga! Kumain ka na ba?\nJUAN: Opo, kumain na po ako.\nTITA: Magaling! Saan ka pupunta?\nJUAN: Sa eskwela po.',
      questions: [
        { question: 'Anong oras ng araw ito?', options: ['Umaga', 'Hapon', 'Gabi', 'Hindi sinabi'], answer: 0, explanation: '"Magandang umaga" means good morning.' },
        { question: 'Kumain na ba si Juan?', options: ['Oo', 'Hindi', 'Hindi sinabi'], answer: 0, explanation: 'He answered "Opo, kumain na po ako."' },
        { question: 'Saan pupunta si Juan?', options: ['Sa palengke', 'Sa bahay', 'Sa eskwela', 'Sa opisina'], answer: 2, explanation: 'He said "Sa eskwela po."' },
      ],
      vocabulary: ['kumain', 'eskwela', 'pupunta'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-stress-bukas',
      title: 'BUkas vs buKAS',
      type: 'stress-discrimination',
      transcript: 'Bukas mo ang pinto.',
      questions: [
        { question: 'Which meaning: to open or tomorrow?', answer: 'BUkas (open)', explanation: 'BUkas (penultimate stress) = open. buKAS (ultimate stress) = tomorrow. Here it is a command to open the door.' }
      ],
      vocabulary: ['bukas'],
      connectedSpeechFeatures: []
    },
  ],
  A2: [
    {
      id: 'a2-dict-transport',
      title: 'Sa jeepney',
      type: 'dictation',
      transcript: 'Kuya, magkano po hanggang Quiapo? Bayad po. Para po!',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Kuya, magkano po hanggang Quiapo? Bayad po. Para po!',
          explanation: '"Para po" signals the driver to stop. "Bayad po" means paying fare.'
        }
      ],
      vocabulary: ['bayad', 'para', 'hanggang'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a2-comp-doctor',
      title: 'Sa klinika',
      type: 'comprehension',
      transcript: 'DOKTOR: Kumusta ka? Ano ang nararamdaman mo?\nPASYENTE: Masakit po ang ulo ko at may lagnat po ako.\nDOKTOR: Gaano po katagal na?\nPASYENTE: Dalawang araw na po.\nDOKTOR: Sige, bibigyan kita ng gamot. Uminom ka tatlong beses sa isang araw.',
      questions: [
        { question: 'Ano ang problema ng pasyente?', options: ['Masakit ang tiyan', 'Masakit ang ulo at may lagnat', 'Masakit ang ngipin'], answer: 1, explanation: 'The patient said "Masakit po ang ulo ko at may lagnat po ako."' },
        { question: 'Gaano katagal na ang sakit?', options: ['Isang araw', 'Dalawang araw', 'Isang linggo'], answer: 1, explanation: '"Dalawang araw na po."' },
        { question: 'Ilang beses iinumin ang gamot?', options: ['Isang beses', 'Dalawang beses', 'Tatlong beses'], answer: 2, explanation: '"Tatlong beses sa isang araw."' },
      ],
      vocabulary: ['nararamdaman', 'lagnat', 'gamot'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a2-gap-reductions',
      title: 'Casual reductions',
      type: 'gap-fill',
      transcript: "'Di ko alam kung san siya pupunta.",
      questions: [
        { question: "Expand to full form: '___' ko alam kung '___' siya pupunta.", answer: 'Hindi, saan', explanation: "'Di = Hindi, san = saan (common casual reductions)" }
      ],
      vocabulary: ['hindi', 'saan'],
      connectedSpeechFeatures: ['reduction: Hindi->\'Di', 'reduction: saan->san']
    },
    {
      id: 'a2-stress-bata',
      title: 'BAta vs baTAʔ',
      type: 'stress-discrimination',
      transcript: 'Ang bata ay naglalaro.',
      questions: [
        { question: 'Which meaning: child or bathrobe?', answer: 'BAta (child)', explanation: 'BAta (penultimate stress) = child. baTAʔ (ultimate + glottal) = bathrobe. Context: playing = child.' }
      ],
      vocabulary: ['bata'],
      connectedSpeechFeatures: []
    },
  ],
  B1: [
    {
      id: 'b1-dict-reductions',
      title: 'Natural na Filipino',
      type: 'dictation',
      transcript: "'Di ko pa alam kung anong gagawin namin bukas.",
      questions: [
        {
          question: 'Write the full (unreduced) form.',
          answer: 'Hindi ko pa alam kung ano ang gagawin namin bukas.',
          explanation: "'Di = Hindi, anong = ano ang (contractions common in natural speech)"
        }
      ],
      vocabulary: ['gagawin', 'bukas'],
      connectedSpeechFeatures: ['reduction: Hindi->\'Di', 'contraction: anong=ano ang']
    },
    {
      id: 'b1-comp-news',
      title: 'Balita tungkol sa panahon',
      type: 'comprehension',
      transcript: 'Ayon sa PAGASA, may malakas na bagyo na papasok sa bansa sa susunod na dalawang araw. Pinayuhan ang mga residente sa mga baybayin na lugar na lumikas kung kinakailangan. Ang mga klase sa lahat ng antas ay suspendido bukas.',
      questions: [
        { question: 'Ano ang paparating?', options: ['Lindol', 'Bagyo', 'Tsunami', 'Baha'], answer: 1, explanation: '"May malakas na bagyo na papasok sa bansa."' },
        { question: 'Ano ang payo sa mga tao sa baybayin?', options: ['Manatili sa bahay', 'Lumikas', 'Pumunta sa trabaho'], answer: 1, explanation: '"Pinayuhan... na lumikas kung kinakailangan."' },
        { question: 'Ano ang mangyayari sa mga klase?', options: ['Tuloy', 'Suspendido', 'Online'], answer: 1, explanation: '"Ang mga klase... ay suspendido bukas."' },
      ],
      vocabulary: ['bagyo', 'lumikas', 'suspendido', 'baybayin'],
      connectedSpeechFeatures: []
    },
    {
      id: 'b1-gap-taglish',
      title: 'Taglish conversation',
      type: 'gap-fill',
      transcript: "Nag-meeting kami kanina about the project. May mga ______ pa kasi na kailangan _______ before the deadline.",
      questions: [
        { question: 'Fill the gaps with likely words.', answer: 'issues, i-resolve', explanation: 'Taglish naturally mixes Filipino function words with English content words.' }
      ],
      vocabulary: ['meeting', 'issues', 'deadline'],
      connectedSpeechFeatures: ['taglish: Filipino affixes on English roots']
    },
  ],
  B2: [
    {
      id: 'b2-dict-fast',
      title: 'Mabilis na pananalita',
      type: 'dictation',
      transcript: "Sabi niya, 'di raw siya pupunta kasi may gagawin pa raw siya sa bahay nila.",
      questions: [
        {
          question: 'Write the full sentence.',
          answer: "Sabi niya, hindi raw siya pupunta kasi may gagawin pa raw siya sa bahay nila.",
          explanation: "'di = hindi. Note double use of 'raw' (reportedly)."
        }
      ],
      vocabulary: ['raw', 'gagawin', 'pupunta'],
      connectedSpeechFeatures: ["reduction: hindi->'di", 'particle: raw (reportedly)']
    },
    {
      id: 'b2-comp-debate',
      title: 'Debate sa social media',
      type: 'comprehension',
      transcript: 'ANNA: Sa tingin ko, dapat i-ban na ang mga single-use plastic. Napakaraming basura sa dagat.\nBEN: Naiintindihan ko ang punto mo, pero paano naman ang mga maliliit na negosyo na umaasa sa plastic? Hindi lahat kayang bumili ng alternatibo.\nANNA: Tama, pero kailangan nating mag-isip ng pangmatagalang solusyon. Hindi natin pwedeng i-ignore ang problema.\nBEN: Sang-ayon ako na may problema, pero sa tingin ko, education muna bago regulation.',
      questions: [
        { question: 'Ano ang gusto ni Anna?', options: ['Mas maraming plastic', 'I-ban ang single-use plastic', 'Tulungan ang mga negosyo'], answer: 1, explanation: 'Anna said "dapat i-ban na ang mga single-use plastic."' },
        { question: 'Ano ang pangunahing alalahanin ni Ben?', options: ['Kalikasan', 'Maliliit na negosyo', 'Kalusugan'], answer: 1, explanation: 'Ben raised concern about "maliliit na negosyo na umaasa sa plastic."' },
        { question: 'Ano ang panukala ni Ben?', options: ['Immediate ban', 'Education muna bago regulation', 'Walang aksyon'], answer: 1, explanation: '"Education muna bago regulation."' },
      ],
      vocabulary: ['pangmatagalang', 'solusyon', 'alalahanin'],
      connectedSpeechFeatures: ['taglish: technical terms in English']
    },
    {
      id: 'b2-note-taking',
      title: 'Presentasyon sa trabaho',
      type: 'note-taking',
      transcript: 'Magandang hapon po sa lahat. Gusto ko pong i-present ang resulta ng aming pananaliksik tungkol sa mga epekto ng social media sa mental health ng mga kabataan. Una, napag-alaman namin na ang average na oras na ginugugol ng mga teenager sa social media ay apat na oras bawat araw. Pangalawa, ang mga gumagamit ng higit sa limang oras ay may mas mataas na tsansa ng anxiety at depression. Pangatlo, ang mga limitado ang screen time ay may mas magandang quality of sleep. Sa kabuuan, iminumungkahi namin na magkaroon ng structured na digital wellness program sa mga paaralan.',
      questions: [
        { question: 'List the 3 main findings.', answer: 'Average 4 hours/day on social media; 5+ hours linked to anxiety/depression; limited screen time improves sleep', explanation: 'The speaker presented three numbered findings (una, pangalawa, pangatlo).' },
        { question: 'Ano ang rekomendasyon?', answer: 'Digital wellness program sa mga paaralan', explanation: '"Iminumungkahi namin na magkaroon ng structured na digital wellness program sa mga paaralan."' },
      ],
      vocabulary: ['pananaliksik', 'epekto', 'kabataan', 'iminumungkahi'],
      connectedSpeechFeatures: ['formal Filipino register', 'numbered discourse markers']
    },
  ],
  C1: [
    {
      id: 'c1-dict-heavy-reduction',
      title: 'Mabilis at informal',
      type: 'dictation',
      transcript: "'No ba 'yan? 'Di ba sabi mo 'di ka pupunta? Aba, andito ka pala!",
      questions: [
        {
          question: 'Write the full (unreduced) form.',
          answer: 'Ano ba iyan? Hindi ba sabi mo hindi ka pupunta? Aba, andito ka pala!',
          explanation: "Heavy reductions: 'No='Ano, 'yan=iyan, 'di=hindi. Particle 'pala' expresses surprise."
        }
      ],
      vocabulary: ['pala', 'aba'],
      connectedSpeechFeatures: ["'No=Ano", "'yan=iyan", "'di=hindi"]
    },
    {
      id: 'c1-comp-academic',
      title: 'Lektura sa unibersidad',
      type: 'comprehension',
      transcript: 'Ang konsepto ng "kapwa" sa Filipino ay hindi lamang tumutukoy sa kapwa-tao kundi sa mas malalim na ugnayan ng pagkakakilanlan. Ayon kay Enriquez, ang "kapwa" ay ang pagkilala na ang ibang tao ay hindi "iba" kundi bahagi ng iyong sarili. Ito ang pundasyon ng Filipino psychology o Sikolohiyang Pilipino. Sa konteksto ng pakikiramdam, ang individwal ay hindi hiwalay sa komunidad.',
      questions: [
        { question: 'Ano ang "kapwa" ayon sa lektura?', options: ['Kaibigan', 'Pagkilala na ang iba ay bahagi ng sarili', 'Kaaway'], answer: 1, explanation: 'Kapwa = recognition that others are part of oneself.' },
        { question: 'Sino ang binanggit na scholar?', options: ['Rizal', 'Enriquez', 'Bonifacio'], answer: 1, explanation: '"Ayon kay Enriquez..."' },
      ],
      vocabulary: ['kapwa', 'ugnayan', 'pagkakakilanlan', 'pakikiramdam', 'pundasyon'],
      connectedSpeechFeatures: ['academic register', 'literary vocabulary']
    },
  ],
  C2: [
    {
      id: 'c2-dict-street',
      title: 'Kalye Filipino',
      type: 'dictation',
      transcript: "Oy, tara na! Late na tayo, 'wag mo nang intindihin 'yon, basta tara!",
      questions: [
        {
          question: 'Write the full form.',
          answer: 'Oy, tara na! Late na tayo, huwag mo nang intindihin iyon, basta tara!',
          explanation: "'Wag=Huwag, 'yon=iyon. Very fast, informal street Filipino."
        }
      ],
      vocabulary: ['tara', 'basta', 'intindihin'],
      connectedSpeechFeatures: ["'wag=huwag", "'yon=iyon", 'rapid delivery']
    },
    {
      id: 'c2-comp-literary',
      title: 'Pagsusuri ng tula',
      type: 'comprehension',
      transcript: 'Sa tulang "Sa Aking mga Kabata" na isinulat umano ni Rizal, makikita natin ang maagang pagpapahalaga sa wikang sarili. Ang linya na "Ang hindi magmahal sa kanyang salita, mahigit pa sa hayop at malansang isda" ay nagpapahiwatig na ang wika ay hindi lamang kasangkapan ng komunikasyon kundi simbolo ng dignidad at pagkakakilanlan bilang isang bansa.',
      questions: [
        { question: 'Ano ang pangunahing mensahe ng tula ayon sa pagsusuri?', options: ['Ang wika ay simbolo ng dignidad at pagkakakilanlan', 'Ang isda ay mahalaga', 'Ang hayop ay mas matalino'], answer: 0, explanation: 'The analysis focuses on language as symbol of dignity and national identity.' },
      ],
      vocabulary: ['pagpapahalaga', 'kasangkapan', 'dignidad', 'pagkakakilanlan'],
      connectedSpeechFeatures: ['literary analysis register', 'archaic reference']
    },
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function allExercises() {
  const out = [];
  for (const lvl of core.CEFR) {
    for (const ex of (EXERCISES[lvl] || [])) out.push({ ...ex, level: lvl });
  }
  return out;
}

function exercisesForLevel(level) {
  const idx = core.CEFR.indexOf(level);
  if (idx < 0) return allExercises();
  const out = [];
  for (let i = 0; i <= idx; i++) {
    for (const ex of (EXERCISES[core.CEFR[i]] || [])) out.push({ ...ex, level: core.CEFR[i] });
  }
  return out;
}

// ---------------------------------------------------------------------------
// ListeningTutor
// ---------------------------------------------------------------------------

class ListeningTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(id) {
    const p = core.loadProfile(this.dir, id);
    if (!p.level) p.level = 'A1';
    if (!p.skills) p.skills = {};
    if (!p.sessions) p.sessions = [];
    return p;
  }

  setLevel(id, level) {
    const lv = level.toUpperCase();
    if (!core.CEFR.includes(lv)) throw new Error('Invalid CEFR level: ' + lv);
    const p = this.getProfile(id);
    p.level = lv;
    core.saveProfile(this.dir, p);
    return { studentId: id, level: lv, exercisesAvailable: exercisesForLevel(lv).length };
  }

  generateLesson(id) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const available = exercisesForLevel(level);
    const seen = new Set((p.sessions || []).map(s => s.exerciseId));
    let candidates = available.filter(e => !seen.has(e.id));
    if (candidates.length < 3) candidates = available;
    const picked = core.pick(candidates, Math.min(3, candidates.length));

    return {
      studentId: id, level, date: core.today(),
      exercises: picked.map(e => ({
        id: e.id, title: e.title, type: e.type, level: e.level,
        transcript: e.transcript, questions: e.questions,
        vocabulary: e.vocabulary, connectedSpeechFeatures: e.connectedSpeechFeatures,
      })),
    };
  }

  generateExercise(id, type) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const available = exercisesForLevel(level);
    const filtered = type ? available.filter(e => e.type === type) : available;
    const pool = filtered.length ? filtered : available;
    const ex = core.pick(pool, 1)[0];
    return {
      studentId: id, level,
      exercise: {
        id: ex.id, title: ex.title, type: ex.type, level: ex.level,
        transcript: ex.transcript, questions: ex.questions,
        vocabulary: ex.vocabulary, connectedSpeechFeatures: ex.connectedSpeechFeatures,
      },
    };
  }

  checkAnswer(id, exerciseId, answer, questionIndex) {
    const ex = allExercises().find(e => e.id === exerciseId);
    if (!ex) throw new Error('Exercise not found: ' + exerciseId);
    const ans = core.norm(answer);
    const results = ex.questions.map((q, i) => {
      if (q.options) {
        const given = parseInt(answer, 10);
        return { questionIndex: i, correct: given === q.answer, explanation: q.explanation };
      }
      const expected = core.norm(q.answer);
      return { questionIndex: i, correct: ans === expected || ans.includes(expected), expected: q.answer, explanation: q.explanation };
    });
    return { exerciseId, results };
  }

  recordAssessment(id, exerciseId, score, total) {
    const s = parseInt(score, 10);
    const t = parseInt(total, 10);
    if (isNaN(s) || isNaN(t) || t <= 0) throw new Error('Score and total must be positive integers');
    const p = this.getProfile(id);

    if (!p.skills[exerciseId]) {
      p.skills[exerciseId] = { stability: 1, difficulty: 5, lastReview: null, nextReview: null, attempts: [] };
    }
    const sk = p.skills[exerciseId];
    const grade = s / t >= 0.9 ? 4 : s / t >= 0.7 ? 3 : s / t >= 0.5 ? 2 : 1;
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, grade);
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, grade);
    sk.lastReview = core.today();
    const interval = core.fsrsNextReview(sk.stability);
    const next = new Date();
    next.setDate(next.getDate() + interval);
    sk.nextReview = next.toISOString().slice(0, 10);
    sk.attempts.push({ score: s, total: t, date: core.today() });

    p.sessions.push({ exerciseId, score: s, total: t, date: core.today(), grade });
    core.saveProfile(this.dir, p);

    return { studentId: id, exerciseId, score: s, total: t, grade, nextReview: sk.nextReview };
  }

  getProgress(id) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const available = exercisesForLevel(level);
    const byType = {};
    for (const ex of available) {
      if (!byType[ex.type]) byType[ex.type] = { total: 0, studied: 0 };
      byType[ex.type].total++;
      if (p.skills[ex.id]) byType[ex.type].studied++;
    }
    const scored = (p.sessions || []).filter(s => s.score != null && s.total != null && s.total > 0);
    const mastery = core.calcMastery(scored.map(s => ({ score: s.score, total: s.total })));
    return { studentId: id, level, byType, mastery, masteryLabel: core.masteryLabel(mastery), totalSessions: p.sessions.length };
  }

  getReport(id) {
    const progress = this.getProgress(id);
    const p = this.getProfile(id);
    const recentSessions = (p.sessions || []).slice(-10).reverse();
    return { ...progress, recentSessions };
  }

  getNextExercises(id) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const available = exercisesForLevel(level);
    const td = core.today();
    const due = [];
    const unstarted = [];
    for (const ex of available) {
      const sk = p.skills[ex.id];
      if (!sk) { unstarted.push({ id: ex.id, title: ex.title, type: ex.type, level: ex.level }); continue; }
      if (sk.nextReview && sk.nextReview <= td) due.push({ id: ex.id, title: ex.title, type: ex.type, level: ex.level, nextReview: sk.nextReview });
    }
    return { studentId: id, date: td, due, unstarted: unstarted.slice(0, 5), totalDue: due.length, totalUnstarted: unstarted.length };
  }

  listExercises(level) {
    const list = level ? (EXERCISES[level.toUpperCase()] || []).map(e => ({ ...e, level: level.toUpperCase() })) : allExercises();
    return list.map(e => ({ id: e.id, title: e.title, type: e.type, level: e.level }));
  }

  listStudents() { return core.listProfiles(this.dir); }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new ListeningTutor();

core.runCLI((cmd, args, out) => {
  const id = args[1] || 'default';
  switch (cmd) {
    case 'start': {
      const level = args[2] || 'A1';
      tutor.setLevel(id, level);
      out(tutor.getProfile(id));
      break;
    }
    case 'set-level':
      out(tutor.setLevel(id, args[2] || 'A1'));
      break;
    case 'lesson':
      out(tutor.generateLesson(id));
      break;
    case 'exercise':
      out(tutor.generateExercise(id, args[2]));
      break;
    case 'check':
      out(tutor.checkAnswer(id, args[2], args.slice(3).join(' '), parseInt(args[4], 10) || null));
      break;
    case 'record':
      out(tutor.recordAssessment(id, args[2], args[3], args[4]));
      break;
    case 'progress':
      out(tutor.getProgress(id));
      break;
    case 'report':
      out(tutor.getReport(id));
      break;
    case 'next':
      out(tutor.getNextExercises(id));
      break;
    case 'exercises':
      out(tutor.listExercises(args[2]));
      break;
    case 'students':
      out({ students: tutor.listStudents() });
      break;
    case 'help':
      out({ commands: ['start', 'set-level', 'lesson', 'exercise', 'check', 'record',
                   'progress', 'report', 'next', 'exercises', 'students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + cmd,
        commands: ['start', 'set-level', 'lesson', 'exercise', 'check', 'record',
                   'progress', 'report', 'next', 'exercises', 'students'],
      });
  }
});
