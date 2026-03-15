const core = require('../_lib/core');

const SKILL_NAME = 'german-writing';

// ── Correction categories ──────────────────────────────────────────────────
const CORRECTION_CATEGORIES = [
  'gender', 'case', 'agreement', 'verb-position',
  'konjunktiv', 'tense', 'spelling', 'punctuation',
];

// ── Prompts by CEFR level ──────────────────────────────────────────────────
const PROMPTS = {
  A1: [
    {
      id: 'a1-personal-1', category: 'personal', title: 'Postkarte aus dem Urlaub',
      type: 'postcard',
      instructions: 'Schreibe eine Postkarte an einen Freund aus dem Urlaub. Schreibe: wo du bist, wie das Wetter ist, was du jeden Tag machst. (30-50 Wörter)',
      targetStructures: ['present tense regular verbs', 'sein + location', 'weather expressions'],
      rubric: {
        content: 'Mentions location, weather, and daily activity',
        grammar: 'Correct present tense conjugation; V2 word order',
        vocabulary: 'Basic travel and weather words used appropriately',
        organization: 'Greeting, body, farewell structure',
      },
      modelResponse: 'Lieber Pablo, ich bin in München. Das Wetter ist super — es ist sonnig und warm. Jeden Tag besuche ich ein Museum und esse Brezeln. Die Stadt ist sehr schön. Bis bald! Deine Anna',
    },
    {
      id: 'a1-personal-2', category: 'personal', title: 'Meine Familie',
      type: 'description',
      instructions: 'Beschreibe deine Familie. Schreibe: Namen, Alter, Berufe und etwas, was sie gern machen. (40-60 Wörter)',
      targetStructures: ['sein for descriptions', 'haben for possession', 'possessive articles'],
      rubric: {
        content: 'Names at least 3 family members with details',
        grammar: 'Correct sein/haben; gender agreement with articles',
        vocabulary: 'Family terms, numbers, professions',
        organization: 'Logical grouping of family members',
      },
      modelResponse: 'Meine Familie ist klein. Mein Vater heißt Thomas und ist 45 Jahre alt. Er ist Lehrer. Meine Mutter heißt Maria und ist 42 Jahre alt. Sie ist Ärztin. Meine Schwester Anna ist 12 Jahre alt. Sie ist Schülerin. Am Wochenende gehen wir gern in den Park.',
    },
    {
      id: 'a1-formal-1', category: 'formal', title: 'Hotelreservierung',
      type: 'email',
      instructions: 'Schreibe eine kurze E-Mail, um ein Hotelzimmer zu reservieren. Schreibe: Daten, Zimmertyp, Anzahl der Personen. (30-50 Wörter)',
      targetStructures: ['möchten + infinitive', 'numbers and dates', 'formal Sie'],
      rubric: {
        content: 'Includes dates, room type, number of guests',
        grammar: 'Correct formal register (Sie); möchten + infinitive',
        vocabulary: 'Hotel vocabulary: Zimmer, Reservierung, Nacht',
        organization: 'Greeting, request, sign-off',
      },
      modelResponse: 'Sehr geehrte Damen und Herren, ich möchte ein Doppelzimmer für zwei Personen vom 15. bis 20. Juni reservieren. Was kostet das Zimmer pro Nacht? Vielen Dank im Voraus. Mit freundlichen Grüßen, Peter Müller',
    },
    {
      id: 'a1-creative-1', category: 'creative', title: 'Mein perfekter Tag',
      type: 'narrative',
      instructions: 'Beschreibe deinen perfekten Tag vom Morgen bis zum Abend. Benutze Zeitangaben. (40-60 Wörter)',
      targetStructures: ['time expressions', 'reflexive verbs', 'present tense sequence'],
      rubric: {
        content: 'Covers morning, afternoon, and evening with activities',
        grammar: 'Correct reflexive verb forms; time expressions; V2 word order',
        vocabulary: 'Daily routine vocabulary',
        organization: 'Chronological order with time markers',
      },
      modelResponse: 'Am Morgen wache ich um neun Uhr auf. Ich frühstücke mit meiner Familie. Um elf gehe ich an den Strand. Am Nachmittag esse ich in einem italienischen Restaurant. Am Abend gehe ich durch die Stadt spazieren und esse ein Eis. Um elf gehe ich ins Bett. Perfekt!',
    },
  ],
  A2: [
    {
      id: 'a2-personal-1', category: 'personal', title: 'Mein letztes Wochenende',
      type: 'narrative',
      instructions: 'Erzähle, was du letztes Wochenende gemacht hast. Schreibe mindestens 4 Aktivitäten und sage, mit wem du zusammen warst. (60-80 Wörter)',
      targetStructures: ['Perfekt tense', 'time markers: am Samstag, danach, dann'],
      rubric: {
        content: 'At least 4 activities with companions mentioned',
        grammar: 'Correct Perfekt forms (haben/sein + past participle)',
        vocabulary: 'Leisure activities, time connectors',
        organization: 'Chronological narrative with connectors',
      },
      modelResponse: 'Am Samstag bin ich mit meiner Mutter auf den Markt gegangen und wir haben frisches Obst gekauft. Danach haben wir bei meiner Großmutter gegessen. Am Nachmittag habe ich mit meinen Freunden im Park Fußball gespielt. Am Sonntag bin ich spät aufgestanden. Dann habe ich Deutsch gelernt und am Abend habe ich mit meinem Bruder einen Film gesehen. Es war ein tolles Wochenende!',
    },
    {
      id: 'a2-formal-1', category: 'formal', title: 'Beschwerde über ein Produkt',
      type: 'email',
      instructions: 'Schreibe eine Beschwerde-E-Mail, weil ein Produkt kaputt angekommen ist. Erkläre was passiert ist und was du möchtest. (60-80 Wörter)',
      targetStructures: ['Perfekt for narrating events', 'Konjunktiv II for polite requests'],
      rubric: {
        content: 'States problem clearly, explains what happened, requests solution',
        grammar: 'Perfekt narration; Konjunktiv II for requests (Ich würde gern...)',
        vocabulary: 'Shopping and complaint vocabulary',
        organization: 'Formal email structure with Sehr geehrte... and Mit freundlichen Grüßen',
      },
      modelResponse: 'Sehr geehrte Damen und Herren, am 5. März habe ich bei Ihnen einen Laptop bestellt (Bestellnummer 12345). Leider ist das Gerät mit einem kaputten Bildschirm angekommen. Ich würde gern das Gerät umtauschen oder mein Geld zurückbekommen. Bitte kontaktieren Sie mich so bald wie möglich. Mit freundlichen Grüßen, Sofia Weber',
    },
    {
      id: 'a2-personal-2', category: 'personal', title: 'Brief an einen Brieffreund',
      type: 'letter',
      instructions: 'Schreibe einen informellen Brief an einen neuen Brieffreund. Stelle dich vor, erzähle von deinen Hobbys und stelle Fragen. (70-90 Wörter)',
      targetStructures: ['gern + verb', 'question formation', 'informal du-form'],
      rubric: {
        content: 'Self-introduction, hobbies, questions to the friend',
        grammar: 'Correct gern usage; question word order',
        vocabulary: 'Hobbies, interests, personality adjectives',
        organization: 'Informal letter format with greeting and questions',
      },
      modelResponse: 'Lieber Marco, ich heiße Lucia und bin 16 Jahre alt. Ich wohne in Wien, einer sehr schönen Stadt in Österreich. Ich höre sehr gern Musik und spiele Gitarre. Außerdem lese ich gern Abenteuerromane. Sport mag ich gar nicht — das finde ich langweilig! Und du? Was machst du gern in deiner Freizeit? Magst du Musik? Ich warte auf deine Antwort. Liebe Grüße, Lucia',
    },
  ],
  B1: [
    {
      id: 'b1-opinion-1', category: 'opinion', title: 'Soziale Medien: Fluch oder Segen?',
      type: 'essay',
      instructions: 'Schreibe einen kurzen Aufsatz über die Vor- und Nachteile von sozialen Medien. Gib deine eigene Meinung. (100-130 Wörter)',
      targetStructures: ['Nebensätze with weil/obwohl/dass', 'opinion expressions', 'connectors'],
      rubric: {
        content: 'At least 2 pros and 2 cons with personal opinion',
        grammar: 'Correct Nebensatz word order; connectors (einerseits/andererseits)',
        vocabulary: 'Media and technology vocabulary',
        organization: 'Introduction, pro/con, conclusion with opinion',
      },
      modelResponse: 'Soziale Medien spielen heute eine große Rolle in unserem Leben. Einerseits sind sie sehr nützlich, weil man leicht mit Freunden und Familie in Kontakt bleiben kann. Außerdem kann man aktuelle Nachrichten schnell erfahren. Andererseits gibt es auch Nachteile. Viele Menschen verbringen zu viel Zeit am Handy, obwohl sie eigentlich andere Dinge tun sollten. Außerdem kann Cybermobbing ein ernstes Problem sein. Meiner Meinung nach sind soziale Medien grundsätzlich positiv, aber man muss lernen, sie verantwortungsvoll zu nutzen.',
    },
    {
      id: 'b1-formal-1', category: 'formal', title: 'Bewerbungsschreiben',
      type: 'letter',
      instructions: 'Schreibe ein kurzes Bewerbungsschreiben für ein Praktikum in einer deutschen Firma. Erkläre deine Qualifikationen und Motivation. (100-130 Wörter)',
      targetStructures: ['formal Sie', 'Konjunktiv II for politeness', 'Nebensätze'],
      rubric: {
        content: 'Qualifications, motivation, and reference to the position',
        grammar: 'Formal register; correct Sie-forms; Konjunktiv II (Ich würde mich freuen...)',
        vocabulary: 'Professional vocabulary: Qualifikation, Erfahrung, Praktikum',
        organization: 'Formal letter structure: Betreff, Anrede, Text, Grußformel',
      },
      modelResponse: 'Sehr geehrte Damen und Herren, hiermit bewerbe ich mich um das Praktikum in Ihrer Marketingabteilung. Ich studiere Betriebswirtschaft an der Universität Wien und bin derzeit im fünften Semester. Während meines Studiums habe ich bereits ein Praktikum bei einer Werbeagentur gemacht, wo ich Erfahrung in Social-Media-Marketing gesammelt habe. Ihr Unternehmen interessiert mich besonders, weil es international tätig ist und innovative Projekte durchführt. Ich würde mich sehr freuen, wenn Sie mir die Möglichkeit geben würden, Ihr Team zu unterstützen. Mit freundlichen Grüßen, Anna Schmidt',
    },
  ],
  B2: [
    {
      id: 'b2-erörterung-1', category: 'opinion', title: 'Tempolimit auf Autobahnen',
      type: 'erörterung',
      instructions: 'Schreibe eine Erörterung zum Thema "Sollte es ein allgemeines Tempolimit auf deutschen Autobahnen geben?" Berücksichtige Pro- und Kontra-Argumente. (150-200 Wörter)',
      targetStructures: ['Passiv', 'Konjunktiv II', 'formal connectors (darüber hinaus, dennoch, folglich)'],
      rubric: {
        content: 'Multiple pro and con arguments with evidence; clear conclusion',
        grammar: 'Passive constructions; Konjunktiv II for hypotheticals; formal connectors',
        vocabulary: 'Academic/political discourse vocabulary',
        organization: 'Einleitung, Hauptteil (Pro/Kontra), Schluss',
      },
      modelResponse: 'Die Debatte um ein Tempolimit auf deutschen Autobahnen wird seit Jahrzehnten geführt. Befürworter argumentieren, dass ein Tempolimit von 130 km/h die Unfallrate deutlich senken würde. Darüber hinaus könnte der CO2-Ausstoß reduziert werden, was angesichts des Klimawandels dringend notwendig sei. Gegner hingegen betonen, dass die persönliche Freiheit ein Grundrecht darstelle. Außerdem zeigen Statistiken, dass deutsche Autobahnen trotz fehlenden Tempolimits zu den sichersten Straßen Europas gehören. Die meisten schweren Unfälle ereignen sich auf Landstraßen und in Ortschaften. Meines Erachtens überwiegen die Argumente für ein Tempolimit. Auch wenn die individuelle Freiheit ein wichtiger Wert ist, sollte sie nicht über die Sicherheit aller Verkehrsteilnehmer gestellt werden. Ein moderates Tempolimit wäre ein vernünftiger Kompromiss.',
    },
  ],
  C1: [
    {
      id: 'c1-academic-1', category: 'academic', title: 'Wissenschaftliche Zusammenfassung',
      type: 'abstract',
      instructions: 'Schreibe eine wissenschaftliche Zusammenfassung (Abstract) zum Thema "Einfluss von Schlafmangel auf die kognitive Leistung". Verwende Nominalstil und Passivkonstruktionen. (150-200 Wörter)',
      targetStructures: ['Nominalstil', 'Passiv', 'erweiterte Partizipialattribute', 'formale Konnektoren'],
      rubric: {
        content: 'Clear research question, method hint, findings, and implications',
        grammar: 'Nominal style; passive; participial attributes; formal register',
        vocabulary: 'Academic vocabulary: Untersuchung, Ergebnis, Zusammenhang, Schlussfolgerung',
        organization: 'IMRaD structure hint: Introduction, Method, Results, Discussion',
      },
      modelResponse: 'Die vorliegende Studie untersucht den Zusammenhang zwischen Schlafqualität und kognitiver Leistungsfähigkeit bei Studierenden. Im Rahmen einer Querschnittserhebung wurden 200 Studierende der Universität München zu ihren Schlafgewohnheiten befragt und standardisierten Kognitionstests unterzogen. Die Ergebnisse deuten darauf hin, dass bereits geringfügige Schlafdefizite zu messbaren Einbußen in der Konzentrationsfähigkeit und im Arbeitsgedächtnis führen. Insbesondere die von chronischem Schlafmangel betroffenen Teilnehmenden zeigten signifikant schlechtere Leistungen im Bereich der exekutiven Funktionen. Diese Befunde unterstreichen die Notwendigkeit, Schlafhygiene als integralen Bestandteil universitärer Gesundheitsförderung zu etablieren.',
    },
  ],
  C2: [
    {
      id: 'c2-feuilleton-1', category: 'creative', title: 'Feuilleton: Über das Schweigen',
      type: 'essay',
      instructions: 'Schreibe einen Feuilleton-Beitrag (kulturjournalistischer Essay) zum Thema "Die Kunst des Schweigens in einer lauten Welt". Verwende literarische Mittel und ein hohes Sprachregister. (200-250 Wörter)',
      targetStructures: ['Konjunktiv I/II', 'erweiterte Partizipialattribute', 'stilistische Mittel', 'Registervariation'],
      rubric: {
        content: 'Thoughtful cultural observation with examples and insight',
        grammar: 'Flawless register; Konjunktiv I for distancing; complex syntax',
        vocabulary: 'Literary/philosophical vocabulary with Bildungssprache',
        organization: 'Feuilleton structure: provocative opening, exploration, resonant closing',
      },
      modelResponse: 'Wer heute schweigt, macht sich verdächtig. In einer Welt, die das permanente Senden zur Bürgerpflicht erhoben hat, gilt Stille als Defizit. Man müsse sich positionieren, heißt es; wer keine Meinung äußere, habe offenbar keine. Dabei wäre es gerade die bewusste Zurückhaltung, die dem öffentlichen Diskurs guttäte. Das in den sozialen Medien allgegenwärtige Rauschen — jenes unablässige Kommentieren, Teilen und Bewerten — hat die Schwelle des Mitteilungswürdigen bis zur Unkenntlichkeit abgesenkt. Wo einst das Bonmot blitzte, regiert nun das Meme. Susan Sontag schrieb einmal, Schweigen sei die äußerste Ausweitung jener Zurückhaltung, die allem wahrhaft Kunstvollen innewohne. Man mag ihr zustimmen oder nicht — unbestreitbar bleibt, dass das, was nicht gesagt wird, bisweilen mehr wiegt als das Gesagte. Die Kunst des Schweigens bestünde demnach nicht im Verstummen, sondern in der Fähigkeit, den richtigen Augenblick für das Wort zu finden. Eine Fähigkeit, die in Zeiten des Dauersendung zunehmend verloren zu gehen droht.',
    },
  ],
};

// ── WritingTutor Class ─────────────────────────────────────────────────────

class WritingTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.level) p.level = 'A1';
    if (!p.skills) p.skills = {};
    if (!p.sessions) p.sessions = [];
    if (!p.assessments) p.assessments = [];
    return p;
  }

  _save(p) { core.saveProfile(this.dir, p); }

  setLevel(studentId, level) {
    const lv = level.toUpperCase();
    if (!core.CEFR.includes(lv)) throw new Error('Invalid CEFR level: ' + level);
    const p = this.getProfile(studentId);
    p.level = lv;
    this._save(p);
    return { studentId, level: lv };
  }

  _promptsForLevel(level) {
    const idx = core.CEFR.indexOf(level);
    const out = [];
    for (let i = 0; i <= idx; i++) {
      const lv = core.CEFR[i];
      if (PROMPTS[lv]) out.push(...PROMPTS[lv].map(pr => ({ ...pr, level: lv })));
    }
    return out;
  }

  generateLesson(studentId, promptId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';

    let prompt;
    if (promptId) {
      for (const lv of core.CEFR) {
        if (PROMPTS[lv]) {
          prompt = PROMPTS[lv].find(pr => pr.id === promptId);
          if (prompt) { prompt = { ...prompt, level: lv }; break; }
        }
      }
      if (!prompt) throw new Error('Prompt not found: ' + promptId);
    } else {
      const available = this._promptsForLevel(level);
      const seen = new Set(Object.keys(p.skills));
      const unseen = available.filter(pr => !seen.has(pr.id));
      const candidates = unseen.length ? unseen : available;
      prompt = core.pick(candidates, 1)[0];
    }

    return {
      studentId, level, date: core.today(),
      prompt: {
        id: prompt.id, title: prompt.title, type: prompt.type, level: prompt.level,
        category: prompt.category,
        instructions: prompt.instructions,
        targetStructures: prompt.targetStructures,
        rubric: prompt.rubric,
      },
      sessionFlow: [
        { step: 1, name: 'Planen', note: 'Brainstorm ideas, organize structure' },
        { step: 2, name: 'Entwerfen', note: 'Write first draft — focus on content, not perfection' },
        { step: 3, name: 'Überarbeiten', note: 'Review grammar, vocabulary, structure; get feedback' },
        { step: 4, name: 'Feilen', note: 'Polish: register, connectors, word choice' },
      ],
      correctionCategories: CORRECTION_CATEGORIES,
    };
  }

  getModelResponse(promptId) {
    for (const lv of core.CEFR) {
      if (PROMPTS[lv]) {
        const prompt = PROMPTS[lv].find(pr => pr.id === promptId);
        if (prompt) return { id: prompt.id, title: prompt.title, modelResponse: prompt.modelResponse, rubric: prompt.rubric };
      }
    }
    throw new Error('Prompt not found: ' + promptId);
  }

  recordAssessment(studentId, promptId, grade, feedback) {
    grade = parseInt(grade, 10);
    if (!core.isValidGrade(grade, 1, 4)) throw new Error('Grade must be 1-4');
    const p = this.getProfile(studentId);

    if (!p.skills[promptId]) {
      p.skills[promptId] = { stability: 1, difficulty: 5, lastReview: null, nextReview: null, attempts: [] };
    }
    const sk = p.skills[promptId];
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, grade);
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, grade);
    sk.lastReview = core.today();
    const interval = core.fsrsNextReview(sk.stability, core.DEFAULT_RETENTION);
    const d = new Date(); d.setDate(d.getDate() + interval);
    sk.nextReview = d.toISOString().slice(0, 10);
    sk.attempts.push({ grade, date: core.today(), feedback: feedback || null });

    p.assessments.push({ promptId, grade, date: core.today() });
    this._save(p);

    return { promptId, grade, nextReview: sk.nextReview, interval };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = this._promptsForLevel(level);

    const byCategory = {};
    for (const pr of available) {
      if (!byCategory[pr.category]) byCategory[pr.category] = { total: 0, studied: 0, mastered: 0 };
      byCategory[pr.category].total++;
      const sk = p.skills[pr.id];
      if (sk) {
        byCategory[pr.category].studied++;
        const m = core.calcMastery(sk.attempts.map(a => ({ score: a.grade >= 3 ? 1 : 0, total: 1 })));
        if (m >= core.MASTERY_THRESHOLD) byCategory[pr.category].mastered++;
      }
    }

    return { studentId, level, categories: byCategory, totalAssessments: p.assessments.length };
  }

  getReport(studentId) {
    const progress = this.getProgress(studentId);
    const p = this.getProfile(studentId);
    const recent = (p.assessments || []).slice(-10).reverse();
    return { ...progress, recentAssessments: recent };
  }

  listPrompts(level) {
    let list = [];
    if (level) {
      list = PROMPTS[level.toUpperCase()] || [];
      list = list.map(pr => ({ ...pr, level: level.toUpperCase() }));
    } else {
      for (const lv of core.CEFR) {
        if (PROMPTS[lv]) list.push(...PROMPTS[lv].map(pr => ({ ...pr, level: lv })));
      }
    }
    return list.map(pr => ({ id: pr.id, title: pr.title, type: pr.type, category: pr.category, level: pr.level }));
  }

  listStudents() { return core.listProfiles(this.dir); }
}

// ── CLI ──────────────────────────────────────────────────────────────────────

const tutor = new WritingTutor();

core.runCLI((cmd, args, out) => {
  const sid = args[1] || 'default';
  switch (cmd) {
    case 'start':
      out(tutor.getProfile(sid));
      break;
    case 'set-level':
      out(tutor.setLevel(sid, args[2] || ''));
      break;
    case 'lesson':
      out(tutor.generateLesson(sid, args[2] || null));
      break;
    case 'model':
      out(tutor.getModelResponse(args[2]));
      break;
    case 'record': {
      const feedback = args[4] ? args.slice(4).join(' ') : null;
      out(tutor.recordAssessment(sid, args[2], args[3], feedback));
      break;
    }
    case 'progress':
      out(tutor.getProgress(sid));
      break;
    case 'report':
      out(tutor.getReport(sid));
      break;
    case 'prompts':
      out(tutor.listPrompts(args[2] || null));
      break;
    case 'students':
      out({ students: tutor.listStudents() });
      break;
    case 'help':
      out({ commands: ['start','set-level','lesson','model','record','progress','report','prompts','students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + cmd,
        commands: ['start','set-level','lesson','model','record','progress','report','prompts','students'],
      });
  }
});
