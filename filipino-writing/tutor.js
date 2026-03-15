const core = require('../_lib/core');

const SKILL_NAME = 'filipino-writing';

// ── Correction categories ──────────────────────────────────────────────────
const CORRECTION_CATEGORIES = [
  'spelling', 'grammar', 'vocabulary', 'word-order',
  'punctuation', 'coherence', 'register', 'aspect', 'focus',
];

// ── Prompts by CEFR level ──────────────────────────────────────────────────
const PROMPTS = {
  A1: [
    {
      id: 'a1-personal-1', category: 'personal', title: 'Text message sa kaibigan',
      type: 'text-message',
      instructions: 'Sumulat ng text message sa kaibigan mo. Isama: saan ka pupunta, anong oras, at sino ang kasama mo. (20-40 salita)',
      targetStructures: ['basic verb forms', 'time expressions', 'sa + location'],
      rubric: {
        content: 'Mentions location, time, and companion',
        grammar: 'Basic sentence structure with correct markers',
        vocabulary: 'Basic everyday words used appropriately',
        organization: 'Clear message format',
      },
      modelResponse: 'Uy! Pupunta ako sa mall mamaya, mga alas-tres. Kasama ko si Ana. Gusto mo bang sumama? Text mo ko!',
    },
    {
      id: 'a1-personal-2', category: 'personal', title: 'Ang pamilya ko',
      type: 'description',
      instructions: 'Ilarawan ang pamilya mo. Isama: mga pangalan, edad, trabaho, at isang bagay na gusto nilang gawin. (40-60 salita)',
      targetStructures: ['ang + noun', 'may/mayroon', 'gusto + verb'],
      rubric: {
        content: 'Names at least 3 family members with details',
        grammar: 'Correct use of ang/ng/sa markers',
        vocabulary: 'Family terms, numbers, occupations',
        organization: 'Clear description flow',
      },
      modelResponse: 'Apat kami sa pamilya. Ang tatay ko ay si Pedro. Apatnapu\'t limang taon siya. Guro siya sa eskwela. Ang nanay ko ay si Maria. Nars siya sa ospital. Mayroon akong kapatid na lalaki. Ang pangalan niya ay Juan. Labindalawang taon siya. Gusto niyang maglaro ng basketball.',
    },
  ],
  A2: [
    {
      id: 'a2-email-1', category: 'personal', title: 'Email sa kaibigan tungkol sa weekend',
      type: 'email',
      instructions: 'Sumulat ng email sa kaibigan mo tungkol sa ginawa mo noong weekend. Isama: saan ka pumunta, ano ang ginawa mo, at kung masaya ka. (60-80 salita)',
      targetStructures: ['completed aspect (nag-, -um-)', 'time connectors (una, tapos, pagkatapos)'],
      rubric: {
        content: 'Describes at least 2 activities with location',
        grammar: 'Correct completed aspect forms',
        vocabulary: 'Activities and places vocabulary',
        organization: 'Email format: greeting, body, farewell',
      },
      modelResponse: 'Hi Ana! Kumusta ka? Gusto kong ikwento ang weekend ko. Noong Sabado, pumunta kami sa Tagaytay ng pamilya ko. Una, kumain kami sa isang restaurant. Masarap ang bulalo! Pagkatapos, pumunta kami sa People\'s Park. Maganda ang view ng Taal Volcano. Noong Linggo, natulog lang ako sa bahay. Masaya ang weekend ko! Ikaw, anong ginawa mo? Sige, ingat ka! - Maria',
    },
  ],
  B1: [
    {
      id: 'b1-sanaysay-1', category: 'academic', title: 'Sanaysay tungkol sa social media',
      type: 'essay',
      instructions: 'Sumulat ng maikling sanaysay: "Ano ang mga epekto ng social media sa mga kabataan?" Isama ang iyong opinyon at mga halimbawa. (150-200 salita)',
      targetStructures: ['opinion expressions (sa tingin ko, sa aking palagay)', 'connectors (dahil, gayunpaman, bukod dito)', 'complex sentences'],
      rubric: {
        content: 'Clear thesis with at least 2 supporting points',
        grammar: 'Correct verb aspects, appropriate connectors',
        vocabulary: 'Abstract vocabulary (epekto, kabataan, pananaw)',
        organization: 'Introduction, body paragraphs, conclusion',
      },
      modelResponse: null,
    },
    {
      id: 'b1-formal-1', category: 'formal', title: 'Pormal na email sa guro',
      type: 'formal-email',
      instructions: 'Sumulat ng pormal na email sa guro mo. Humingi ng permiso na ma-late sa klase dahil may appointment ka sa doktor. Gumamit ng po/opo. (100-150 salita)',
      targetStructures: ['po/opo system', 'formal vocabulary (nais ko po, kung maaari po)', 'polite request forms'],
      rubric: {
        content: 'Clear request with reason and politeness',
        grammar: 'Consistent po/opo usage, formal sentence structure',
        vocabulary: 'Formal Filipino vocabulary',
        organization: 'Formal email format with proper opening/closing',
      },
      modelResponse: null,
    },
  ],
  B2: [
    {
      id: 'b2-argumentative-1', category: 'academic', title: 'Argumentatibong sanaysay',
      type: 'argumentative-essay',
      instructions: 'Sumulat ng argumentatibong sanaysay: "Dapat bang i-require ang Filipino subject sa kolehiyo?" Ipresenta ang dalawang panig bago ibigay ang iyong konklusyon. (250-350 salita)',
      targetStructures: ['formal connectors (gayunpaman, sa kabilang banda, samakatuwid)', 'conditional (kung)', 'nominalization (pagtuturo, pagpapahalaga)'],
      rubric: {
        content: 'Both sides presented, clear conclusion with reasoning',
        grammar: 'Complex sentences, formal register maintained',
        vocabulary: 'Academic Filipino vocabulary',
        organization: 'Thesis, arguments, counterarguments, conclusion',
      },
      modelResponse: null,
    },
    {
      id: 'b2-complaint-1', category: 'formal', title: 'Liham-reklamo',
      type: 'formal-letter',
      instructions: 'Sumulat ng liham-reklamo sa isang kumpanya tungkol sa produktong may depekto. Gumamit ng pormal na Filipino at po/opo. Isama: ano ang problema, kailan ito nangyari, at ano ang gusto mong solusyon. (200-300 salita)',
      targetStructures: ['formal Filipino', 'complaint language', 'po/opo throughout'],
      rubric: {
        content: 'Clear complaint with specific details and desired resolution',
        grammar: 'Formal register, correct verb forms',
        vocabulary: 'Business/formal vocabulary',
        organization: 'Formal letter structure',
      },
      modelResponse: null,
    },
  ],
  C1: [
    {
      id: 'c1-academic-1', category: 'academic', title: 'Akademikong sanaysay',
      type: 'academic-essay',
      instructions: 'Sumulat ng akademikong sanaysay: "Ang papel ng wika sa pagbuo ng pambansang pagkakakilanlan." Gumamit ng pormal na Filipino, walang Taglish. (400-500 salita)',
      targetStructures: ['academic Filipino', 'nominalization', 'complex discourse markers', 'formal connectors (sapagkat, samakatuwid, gayundin)'],
      rubric: {
        content: 'Well-developed thesis with academic rigor',
        grammar: 'Publication-quality Filipino',
        vocabulary: 'Academic register, precise word choice',
        organization: 'Academic essay structure with clear argumentation',
      },
      modelResponse: null,
    },
  ],
  C2: [
    {
      id: 'c2-creative-1', category: 'creative', title: 'Malikhaing pagsulat',
      type: 'creative',
      instructions: 'Sumulat ng maikling kwento o tula sa Filipino. Gumamit ng malalim na Filipino at mga literary devices (talinghaga, paghahambing, personipikasyon). (Variable length)',
      targetStructures: ['literary Filipino', 'figurative language', 'stylistic variation'],
      rubric: {
        content: 'Original creative work with literary merit',
        grammar: 'Masterful control of Filipino forms',
        vocabulary: 'Rich, varied, literary vocabulary',
        organization: 'Appropriate literary structure',
      },
      modelResponse: null,
    },
  ],
};

// ── WritingTutor class ─────────────────────────────────────────────────────

class WritingTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(id) {
    const p = core.loadProfile(this.dir, id);
    if (!p.level) p.level = 'A1';
    if (!p.skills) p.skills = {};
    if (!p.sessions) p.sessions = [];
    if (!p.corrections) p.corrections = {};
    return p;
  }

  setLevel(id, level) {
    const lv = level.toUpperCase();
    if (!core.CEFR.includes(lv)) throw new Error('Invalid CEFR level: ' + lv);
    const p = this.getProfile(id);
    p.level = lv;
    core.saveProfile(this.dir, p);
    return { studentId: id, level: lv };
  }

  generatePrompt(id, category) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const bank = PROMPTS[level] || PROMPTS.A1;
    const filtered = category ? bank.filter(pr => pr.category === category) : bank;
    const pool = filtered.length ? filtered : bank;
    const prompt = core.pick(pool, 1)[0];

    return {
      studentId: id, level,
      prompt: {
        id: prompt.id, title: prompt.title, type: prompt.type, category: prompt.category,
        instructions: prompt.instructions,
        targetStructures: prompt.targetStructures,
        rubric: prompt.rubric,
        modelResponse: prompt.modelResponse,
      },
    };
  }

  getRubric(promptId) {
    for (const level of core.CEFR) {
      const bank = PROMPTS[level] || [];
      const prompt = bank.find(p => p.id === promptId);
      if (prompt) return { id: prompt.id, title: prompt.title, rubric: prompt.rubric, targetStructures: prompt.targetStructures };
    }
    throw new Error('Prompt not found: ' + promptId);
  }

  recordAssessment(id, promptId, content, grammar, vocab, org, corrections) {
    const p = this.getProfile(id);
    const scores = {
      content: parseInt(content, 10),
      grammar: parseInt(grammar, 10),
      vocabulary: parseInt(vocab, 10),
      organization: parseInt(org, 10),
    };

    for (const [k, v] of Object.entries(scores)) {
      if (isNaN(v) || v < 1 || v > 5) throw new Error(`${k} score must be 1-5`);
    }

    const session = {
      date: core.today(),
      promptId,
      scores,
      corrections: corrections || [],
    };

    p.sessions.push(session);

    // Track correction categories
    if (corrections && Array.isArray(corrections)) {
      for (const c of corrections) {
        const cat = c.category || 'other';
        if (!p.corrections[cat]) p.corrections[cat] = 0;
        p.corrections[cat]++;
      }
    }

    core.saveProfile(this.dir, p);
    return { studentId: id, recorded: true, session };
  }

  getProgress(id) {
    const p = this.getProfile(id);
    const sessions = p.sessions || [];
    const totalSessions = sessions.length;

    const avgScores = { content: 0, grammar: 0, vocabulary: 0, organization: 0 };
    if (totalSessions > 0) {
      for (const s of sessions) {
        for (const k of Object.keys(avgScores)) {
          avgScores[k] += (s.scores[k] || 0);
        }
      }
      for (const k of Object.keys(avgScores)) {
        avgScores[k] = Math.round(avgScores[k] / totalSessions * 10) / 10;
      }
    }

    return {
      studentId: id, level: p.level, totalSessions,
      averageScores: avgScores,
      correctionPatterns: p.corrections || {},
    };
  }

  getReport(id) {
    const progress = this.getProgress(id);
    const p = this.getProfile(id);
    const recentSessions = (p.sessions || []).slice(-5).reverse();
    return { ...progress, recentSessions };
  }

  listPrompts(level) {
    const lv = level ? level.toUpperCase() : null;
    if (lv && PROMPTS[lv]) {
      return PROMPTS[lv].map(p => ({ id: p.id, title: p.title, type: p.type, category: p.category }));
    }
    const all = [];
    for (const l of core.CEFR) {
      for (const p of (PROMPTS[l] || [])) {
        all.push({ id: p.id, title: p.title, type: p.type, category: p.category, level: l });
      }
    }
    return all;
  }

  listStudents() { return core.listProfiles(this.dir); }
}

// ── CLI ────────────────────────────────────────────────────────────────────

const tutor = new WritingTutor();

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
    case 'prompt':
      out(tutor.generatePrompt(id, args[2]));
      break;
    case 'rubric':
      out(tutor.getRubric(args[2] || args[1]));
      break;
    case 'record': {
      const [, sid, promptId, content, grammar, vocab, org] = args;
      let corrections = null;
      if (args[7]) {
        try { corrections = JSON.parse(args[7]); } catch { corrections = null; }
      }
      out(tutor.recordAssessment(sid, promptId, content, grammar, vocab, org, corrections));
      break;
    }
    case 'progress':
      out(tutor.getProgress(id));
      break;
    case 'report':
      out(tutor.getReport(id));
      break;
    case 'prompts':
      out(tutor.listPrompts(args[2]));
      break;
    case 'students':
      out({ students: tutor.listStudents() });
      break;
    case 'help':
      out({ commands: ['start', 'set-level', 'prompt', 'rubric', 'record',
                   'progress', 'report', 'prompts', 'students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + cmd,
        commands: ['start', 'set-level', 'prompt', 'rubric', 'record',
                   'progress', 'report', 'prompts', 'students'],
      });
  }
});
