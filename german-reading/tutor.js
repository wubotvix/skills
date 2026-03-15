#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'german-reading';

// ---------------------------------------------------------------------------
// Embedded reading texts by CEFR level
// ---------------------------------------------------------------------------

const TEXTS = {
  A1: [
    {
      id: 'a1-cafe',
      title: 'Im Café',
      type: 'dialogue',
      text:
        '— Guten Tag. Was möchten Sie?\n' +
        '— Guten Tag. Ich hätte gern einen Kaffee mit Milch, bitte.\n' +
        '— Groß oder klein?\n' +
        '— Groß. Und auch ein Stück Apfelkuchen.\n' +
        '— Sehr gut. Das macht vier Euro fünfzig.\n' +
        '— Hier, bitte. Danke.\n' +
        '— Guten Appetit!',
      vocabulary: [
        { word: 'hätte gern', definition: 'would like (polite)', example: 'Ich hätte gern einen Tee.' },
        { word: 'Stück', definition: 'piece', example: 'Ein Stück Kuchen, bitte.' },
        { word: 'Guten Appetit', definition: 'enjoy your meal', example: 'Guten Appetit zusammen!' },
      ],
      comprehensionQuestions: [
        {
          question: 'Was bestellt der Kunde zum Trinken?',
          options: ['Einen Tee', 'Einen Kaffee mit Milch', 'Einen Orangensaft', 'Ein Wasser'],
          answer: 1,
          explanation: 'Der Kunde sagt: "Ich hätte gern einen Kaffee mit Milch."',
        },
        {
          question: 'Welche Größe möchte der Kunde?',
          options: ['Klein', 'Mittel', 'Groß', 'Sagt er nicht'],
          answer: 2,
          explanation: 'Auf die Frage "Groß oder klein?" antwortet er: "Groß."',
        },
        {
          question: 'Wie viel kostet alles zusammen?',
          options: ['Drei Euro', 'Vier Euro', 'Vier Euro fünfzig', 'Fünf Euro'],
          answer: 2,
          explanation: 'Der Kellner sagt: "Das macht vier Euro fünfzig."',
        },
      ],
    },
    {
      id: 'a1-familie',
      title: 'Meine Familie',
      type: 'narrative',
      text:
        'Ich heiße Anna. Ich bin fünfundzwanzig Jahre alt und wohne in Berlin. Meine Familie ist klein. ' +
        'Mein Vater heißt Thomas und ist zweiundfünfzig Jahre alt. Er ist Lehrer. Meine Mutter ' +
        'heißt Maria und ist neunundvierzig Jahre alt. Sie ist Ärztin. Ich habe einen Bruder. ' +
        'Er heißt Peter und ist zweiundzwanzig Jahre alt. Peter studiert an der Universität. ' +
        'Am Wochenende essen wir zusammen bei meinen Eltern.',
      vocabulary: [
        { word: 'wohne', definition: 'I live', example: 'Ich wohne in einer großen Stadt.' },
        { word: 'Ärztin', definition: 'doctor (female)', example: 'Die Ärztin arbeitet im Krankenhaus.' },
        { word: 'am Wochenende', definition: 'on the weekend', example: 'Am Wochenende schlafe ich lange.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Wo wohnt Anna?',
          options: ['In München', 'In Berlin', 'In Hamburg', 'In Wien'],
          answer: 1,
          explanation: 'Anna sagt: "Ich wohne in Berlin."',
        },
        {
          question: 'Was ist die Mutter von Beruf?',
          options: ['Lehrerin', 'Krankenschwester', 'Ärztin', 'Anwältin'],
          answer: 2,
          explanation: 'Der Text sagt: "Sie ist Ärztin."',
        },
        {
          question: 'Was macht Peter?',
          options: ['Er arbeitet', 'Er studiert an der Universität', 'Er reist', 'Er kocht'],
          answer: 1,
          explanation: 'Der Text sagt: "Peter studiert an der Universität."',
        },
      ],
    },
    {
      id: 'a1-tagesablauf',
      title: 'Mein Tag',
      type: 'narrative',
      text:
        'Jeden Tag stehe ich um sieben Uhr auf. Ich frühstücke Kaffee und Obst. ' +
        'Um acht Uhr fahre ich mit dem Bus zur Arbeit. Ich arbeite in einem Büro von neun bis fünf. ' +
        'Mittags esse ich ein Sandwich im Park. Am Nachmittag komme ich nach Hause und koche ' +
        'das Abendessen. Danach sehe ich fern oder lese ein Buch. Um elf gehe ich ins Bett.',
      vocabulary: [
        { word: 'aufstehen', definition: 'to get up', example: 'Ich stehe früh auf.' },
        { word: 'Sandwich', definition: 'sandwich', example: 'Ein Sandwich mit Käse.' },
        { word: 'ins Bett gehen', definition: 'to go to bed', example: 'Ich gehe um elf ins Bett.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Wann steht die Person auf?',
          options: ['Um sechs', 'Um sieben', 'Um acht', 'Um neun'],
          answer: 1,
          explanation: '"Jeden Tag stehe ich um sieben Uhr auf."',
        },
        {
          question: 'Wie fährt die Person zur Arbeit?',
          options: ['Mit dem Auto', 'Mit dem Fahrrad', 'Mit dem Bus', 'Zu Fuß'],
          answer: 2,
          explanation: '"Um acht Uhr fahre ich mit dem Bus zur Arbeit."',
        },
        {
          question: 'Was macht die Person abends?',
          options: ['Sport', 'Fernsehen oder lesen', 'Ausgehen', 'Lernen'],
          answer: 1,
          explanation: '"Danach sehe ich fern oder lese ein Buch."',
        },
      ],
    },
  ],

  A2: [
    {
      id: 'a2-email',
      title: 'Eine E-Mail an einen Freund',
      type: 'email',
      text:
        'Lieber Marco,\n\n' +
        'vielen Dank für deine E-Mail! Es freut mich zu hören, dass es dir gut geht.\n\n' +
        'Am letzten Wochenende bin ich mit meiner Familie nach Dresden gefahren. Wir haben die ' +
        'Frauenkirche besichtigt und sind an der Elbe spazieren gegangen. Das Wetter war leider ' +
        'nicht so gut — es hat fast den ganzen Tag geregnet. Aber wir haben trotzdem viel Spaß gehabt!\n\n' +
        'Nächste Woche fange ich einen neuen Deutschkurs an. Ich bin schon ein bisschen nervös.\n\n' +
        'Schreib mir bald!\n' +
        'Deine Sofia',
      vocabulary: [
        { word: 'besichtigen', definition: 'to visit (a sight)', example: 'Wir besichtigen das Schloss.' },
        { word: 'spazieren gehen', definition: 'to go for a walk', example: 'Wir gehen im Park spazieren.' },
        { word: 'trotzdem', definition: 'nevertheless', example: 'Es regnet, aber wir gehen trotzdem raus.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Wohin ist Sofia am Wochenende gefahren?',
          options: ['Nach Berlin', 'Nach München', 'Nach Dresden', 'Nach Hamburg'],
          answer: 2,
          explanation: '"Am letzten Wochenende bin ich mit meiner Familie nach Dresden gefahren."',
        },
        {
          question: 'Wie war das Wetter?',
          options: ['Sonnig', 'Regnerisch', 'Schnee', 'Bewölkt'],
          answer: 1,
          explanation: '"Es hat fast den ganzen Tag geregnet."',
        },
        {
          question: 'Was macht Sofia nächste Woche?',
          options: ['Wieder reisen', 'Einen Deutschkurs anfangen', 'Arbeiten', 'Umziehen'],
          answer: 1,
          explanation: '"Nächste Woche fange ich einen neuen Deutschkurs an."',
        },
      ],
    },
  ],

  B1: [
    {
      id: 'b1-artikel',
      title: 'Digitalisierung an deutschen Schulen',
      type: 'article',
      text:
        'Die Digitalisierung an deutschen Schulen kommt nur langsam voran. Obwohl die Bundesregierung ' +
        'Milliarden Euro investiert hat, fehlt es vielen Schulen immer noch an grundlegender Ausstattung ' +
        'wie stabilem WLAN und modernen Laptops. Außerdem fühlen sich viele Lehrkräfte nicht ausreichend ' +
        'auf den digitalen Unterricht vorbereitet.\n\n' +
        'Eine aktuelle Studie zeigt, dass nur 30 Prozent der Lehrer regelmäßig digitale Medien im ' +
        'Unterricht einsetzen. Experten fordern mehr Fortbildungen und eine bessere technische ' +
        'Infrastruktur. Gleichzeitig warnen Kritiker davor, dass Bildschirmzeit für jüngere Schüler ' +
        'schädlich sein kann und das Lernen mit Papier und Stift nicht ersetzt werden sollte.',
      vocabulary: [
        { word: 'vorangehen', definition: 'to progress/advance', example: 'Das Projekt geht nur langsam voran.' },
        { word: 'Ausstattung', definition: 'equipment/facilities', example: 'Die technische Ausstattung ist veraltet.' },
        { word: 'Fortbildung', definition: 'continuing education/training', example: 'Lehrkräfte brauchen Fortbildungen.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Was ist das Hauptproblem laut dem Artikel?',
          options: ['Zu viele Computer', 'Fehlende Ausstattung und Vorbereitung', 'Zu hohe Kosten', 'Schüler wollen keine Technik'],
          answer: 1,
          explanation: 'Es fehlt an "grundlegender Ausstattung" und Lehrkräfte sind "nicht ausreichend vorbereitet".',
        },
        {
          question: 'Wie viel Prozent der Lehrer nutzen regelmäßig digitale Medien?',
          options: ['10%', '30%', '50%', '70%'],
          answer: 1,
          explanation: '"Nur 30 Prozent der Lehrer setzen regelmäßig digitale Medien im Unterricht ein."',
        },
        {
          question: 'Was sagen Kritiker?',
          options: ['Mehr Technik ist immer besser', 'Bildschirmzeit kann schädlich sein', 'Papier ist schlecht', 'Lehrer sind faul'],
          answer: 1,
          explanation: '"Kritiker warnen, dass Bildschirmzeit für jüngere Schüler schädlich sein kann."',
        },
      ],
    },
  ],

  B2: [
    {
      id: 'b2-essay',
      title: 'Homeoffice: Freiheit oder Falle?',
      type: 'essay',
      text:
        'Seit der Pandemie hat sich das Homeoffice in vielen Branchen fest etabliert. Was zunächst als ' +
        'Notlösung galt, wird von vielen Arbeitnehmern inzwischen als unverzichtbar angesehen. Die ' +
        'Vorteile liegen auf der Hand: keine Pendelzeit, flexible Zeiteinteilung und eine bessere ' +
        'Vereinbarkeit von Beruf und Familie.\n\n' +
        'Allerdings mehren sich auch kritische Stimmen. Psychologen weisen auf die Gefahr der sozialen ' +
        'Isolation hin und warnen vor einer Entgrenzung der Arbeitszeit. Wenn der Schreibtisch im ' +
        'Schlafzimmer steht, fällt es schwer, Feierabend zu machen. Hinzu kommt, dass nicht alle ' +
        'Berufsgruppen vom Homeoffice profitieren können — wer im Handwerk oder in der Pflege arbeitet, ' +
        'muss weiterhin vor Ort sein.\n\n' +
        'Es zeichnet sich ab, dass hybride Modelle — also eine Mischung aus Büro und Homeoffice — ' +
        'die Zukunft der Arbeit bestimmen werden. Entscheidend wird sein, klare Regeln zu schaffen, ' +
        'die sowohl die Flexibilität als auch das Wohlbefinden der Mitarbeiter sicherstellen.',
      vocabulary: [
        { word: 'Notlösung', definition: 'emergency solution', example: 'Das war nur eine Notlösung.' },
        { word: 'Entgrenzung', definition: 'blurring of boundaries', example: 'Die Entgrenzung von Arbeit und Freizeit.' },
        { word: 'Feierabend machen', definition: 'to call it a day', example: 'Um sechs mache ich Feierabend.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Welche Vorteile des Homeoffice werden genannt?',
          options: ['Höheres Gehalt', 'Keine Pendelzeit, flexible Zeit, Vereinbarkeit', 'Mehr Meetings', 'Besseres Internet'],
          answer: 1,
          explanation: '"Keine Pendelzeit, flexible Zeiteinteilung und eine bessere Vereinbarkeit von Beruf und Familie."',
        },
        {
          question: 'Wovor warnen Psychologen?',
          options: ['Zu viel Sport', 'Soziale Isolation und Entgrenzung der Arbeitszeit', 'Langeweile', 'Zu viele Kinder'],
          answer: 1,
          explanation: '"Soziale Isolation" und "Entgrenzung der Arbeitszeit".',
        },
        {
          question: 'Was wird als Zukunftsmodell vorgeschlagen?',
          options: ['Nur Homeoffice', 'Nur Büro', 'Hybride Modelle', 'Vier-Tage-Woche'],
          answer: 2,
          explanation: '"Hybride Modelle — also eine Mischung aus Büro und Homeoffice."',
        },
      ],
    },
  ],

  C1: [
    {
      id: 'c1-literatur',
      title: 'Auszug: Franz Kafka und das Unheimliche',
      type: 'literary-analysis',
      text:
        'Kafkas Erzählungen entfalten ihre Wirkung weniger durch das, was sie schildern, als durch das, ' +
        'was sie verschweigen. In "Die Verwandlung" etwa wird Gregor Samsas monströse Metamorphose mit ' +
        'einer beiläufigen Sachlichkeit beschrieben, die das Grauen gerade durch ihre Nüchternheit ' +
        'verstärkt. Der Leser sucht vergeblich nach einer Erklärung — und genau darin liegt die ' +
        'Strategie des Autors.\n\n' +
        'Das Unbehagen, das Kafkas Texte auslösen, speist sich aus der Kluft zwischen dem Alltäglichen ' +
        'und dem Ungeheuerlichen. Die bürokratische Sprache, die selbst das Absurdeste nüchtern erfasst, ' +
        'erzeugt jenes Gefühl, das Freud als "das Unheimliche" beschrieb: etwas zugleich Vertrautes und ' +
        'Fremdes, das sich jeder rationalen Einordnung entzieht.',
      vocabulary: [
        { word: 'entfalten', definition: 'to unfold/develop', example: 'Die Geschichte entfaltet sich langsam.' },
        { word: 'beiläufig', definition: 'casual/offhand', example: 'Er erwähnte es nur beiläufig.' },
        { word: 'das Unheimliche', definition: 'the uncanny', example: 'Freuds Konzept des Unheimlichen.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Wie erzeugt Kafka laut dem Text Grauen?',
          answer: 2,
          options: ['Durch blutige Details', 'Durch laute Sprache', 'Durch sachliche Nüchternheit und Verschweigen', 'Durch direkte Erklärungen'],
          explanation: '"Das Grauen wird gerade durch ihre Nüchternheit verstärkt" + "was sie verschweigen".',
        },
        {
          question: 'Was ist "das Unheimliche" im Sinne Freuds?',
          answer: 2,
          options: ['Etwas Neues', 'Etwas Gefährliches', 'Etwas zugleich Vertrautes und Fremdes', 'Etwas Lustiges'],
          explanation: '"Etwas zugleich Vertrautes und Fremdes, das sich jeder rationalen Einordnung entzieht."',
        },
      ],
    },
  ],

  C2: [
    {
      id: 'c2-essay',
      title: 'Sprachverfall oder Sprachwandel?',
      type: 'essay',
      text:
        'Die Klage über den angeblichen Verfall der deutschen Sprache ist so alt wie die Sprache selbst. ' +
        'Bereits im 19. Jahrhundert wetterten Puristen gegen den Einfluss des Französischen; heute ' +
        'richtet sich die Kritik vornehmlich gegen Anglizismen, Jugendsprache und die vermeintliche ' +
        'Verrohung durch soziale Medien.\n\n' +
        'Linguisten betonen indessen, dass Sprachwandel ein natürlicher, unaufhaltsamer Prozess ist, ' +
        'der einer Sprache keineswegs schadet, sondern sie an veränderte kommunikative Bedürfnisse ' +
        'anpasst. Der Genitiv mag im gesprochenen Deutsch zunehmend dem Dativ weichen — "wegen dem Wetter" ' +
        'statt "wegen des Wetters" —, doch bedeutet dies nicht, dass die Sprache verarmt. Vielmehr ' +
        'vollzieht sich hier ein Vereinfachungsprozess, wie ihn andere germanische Sprachen längst ' +
        'durchlaufen haben.\n\n' +
        'Entscheidend ist die Fähigkeit der Sprechenden, je nach Kontext zwischen verschiedenen ' +
        'Registern zu wechseln. Wer in der WhatsApp-Nachricht "hab kein bock" schreibt und im ' +
        'Bewerbungsschreiben einen einwandfreien Stil pflegt, demonstriert nicht Sprachverfall, ' +
        'sondern Sprachkompetenz.',
      vocabulary: [
        { word: 'wettern', definition: 'to rail/rant against', example: 'Er wetterte gegen die neuen Regeln.' },
        { word: 'unaufhaltsam', definition: 'unstoppable', example: 'Der Wandel ist unaufhaltsam.' },
        { word: 'verarmen', definition: 'to impoverish', example: 'Die Sprache verarmt nicht.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Was ist die These der Linguisten?',
          answer: 1,
          options: ['Sprache verfällt', 'Sprachwandel ist natürlich und passt sich an', 'Anglizismen zerstören Deutsch', 'Jugendsprache ist schlecht'],
          explanation: '"Sprachwandel ist ein natürlicher, unaufhaltsamer Prozess, der die Sprache an veränderte Bedürfnisse anpasst."',
        },
        {
          question: 'Was demonstriert laut dem Text jemand, der in WhatsApp umgangssprachlich und in Bewerbungen formal schreibt?',
          answer: 2,
          options: ['Sprachverfall', 'Faulheit', 'Sprachkompetenz', 'Unsicherheit'],
          explanation: '"Demonstriert nicht Sprachverfall, sondern Sprachkompetenz" — die Fähigkeit, Register zu wechseln.',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// ReadingTutor class
// ---------------------------------------------------------------------------

class ReadingTutor {
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

  _textsForLevel(level) {
    const idx = core.CEFR.indexOf(level);
    const out = [];
    for (let i = 0; i <= idx; i++) {
      const lv = core.CEFR[i];
      if (TEXTS[lv]) out.push(...TEXTS[lv].map(t => ({ ...t, level: lv })));
    }
    return out;
  }

  generateLesson(studentId, textId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';

    let text;
    if (textId) {
      for (const lv of core.CEFR) {
        if (TEXTS[lv]) {
          text = TEXTS[lv].find(t => t.id === textId);
          if (text) { text = { ...text, level: lv }; break; }
        }
      }
      if (!text) throw new Error('Text not found: ' + textId);
    } else {
      const available = this._textsForLevel(level);
      const seen = new Set(Object.keys(p.skills));
      const unseen = available.filter(t => !seen.has(t.id));
      const candidates = unseen.length ? unseen : available;
      text = core.pick(candidates, 1)[0];
    }

    return {
      studentId, level, date: core.today(),
      text: {
        id: text.id, title: text.title, type: text.type, level: text.level,
        text: text.text,
        vocabulary: text.vocabulary,
      },
      questions: text.comprehensionQuestions.map((q, i) => ({
        index: i, question: q.question, options: q.options,
      })),
      sessionFlow: [
        { step: 1, name: 'Pre-reading', note: 'Review vocabulary; predict content from title' },
        { step: 2, name: 'First read', note: 'Read for gist — what is the main idea?' },
        { step: 3, name: 'Second read', note: 'Read for detail — answer comprehension questions' },
        { step: 4, name: 'Post-reading', note: 'Discuss, summarize, connect to personal experience' },
      ],
    };
  }

  checkAnswer(textId, questionIndex, userAnswer) {
    let text = null;
    for (const lv of core.CEFR) {
      if (TEXTS[lv]) {
        text = TEXTS[lv].find(t => t.id === textId);
        if (text) break;
      }
    }
    if (!text) throw new Error('Text not found: ' + textId);
    const q = text.comprehensionQuestions[questionIndex];
    if (!q) throw new Error('Question not found at index: ' + questionIndex);

    const choiceIdx = parseInt(userAnswer, 10);
    if (!isNaN(choiceIdx) && q.options) {
      return {
        correct: choiceIdx === q.answer,
        expected: q.options[q.answer],
        explanation: q.explanation,
      };
    }

    const expected = core.norm(typeof q.answer === 'string' ? q.answer : q.options[q.answer]);
    const given = core.norm(userAnswer);
    return {
      correct: given === expected || expected.includes(given),
      expected: typeof q.answer === 'string' ? q.answer : q.options[q.answer],
      explanation: q.explanation,
    };
  }

  recordAssessment(studentId, textId, grade) {
    grade = parseInt(grade, 10);
    if (!core.isValidGrade(grade, 1, 4)) throw new Error('Grade must be 1-4');
    const p = this.getProfile(studentId);

    if (!p.skills[textId]) {
      p.skills[textId] = { stability: 1, difficulty: 5, lastReview: null, nextReview: null, attempts: [] };
    }
    const sk = p.skills[textId];
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, grade);
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, grade);
    sk.lastReview = core.today();
    const interval = core.fsrsNextReview(sk.stability, core.DEFAULT_RETENTION);
    const d = new Date(); d.setDate(d.getDate() + interval);
    sk.nextReview = d.toISOString().slice(0, 10);
    sk.attempts.push({ grade, date: core.today() });

    p.assessments.push({ textId, grade, date: core.today() });
    this._save(p);

    return { textId, grade, nextReview: sk.nextReview, interval };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = this._textsForLevel(level);
    let studied = 0, mastered = 0;

    const texts = available.map(t => {
      const sk = p.skills[t.id];
      const m = sk ? core.calcMastery(sk.attempts.map(a => ({ score: a.grade >= 3 ? 1 : 0, total: 1 }))) : 0;
      const status = !sk ? 'not-started' : m >= core.MASTERY_THRESHOLD ? 'mastered' : 'in-progress';
      if (sk) studied++;
      if (status === 'mastered') mastered++;
      return { id: t.id, title: t.title, type: t.type, level: t.level, status };
    });

    return { studentId, level, total: available.length, studied, mastered, texts };
  }

  getReport(studentId) {
    const progress = this.getProgress(studentId);
    const p = this.getProfile(studentId);
    const recent = (p.assessments || []).slice(-10).reverse();
    return { ...progress, recentAssessments: recent };
  }

  listTexts(level) {
    let list = [];
    if (level) {
      list = TEXTS[level.toUpperCase()] || [];
      list = list.map(t => ({ ...t, level: level.toUpperCase() }));
    } else {
      for (const lv of core.CEFR) {
        if (TEXTS[lv]) list.push(...TEXTS[lv].map(t => ({ ...t, level: lv })));
      }
    }
    return list.map(t => ({ id: t.id, title: t.title, type: t.type, level: t.level }));
  }

  listStudents() { return core.listProfiles(this.dir); }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new ReadingTutor();

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
    case 'check':
      out(tutor.checkAnswer(args[2], parseInt(args[3], 10), args.slice(4).join(' ')));
      break;
    case 'record':
      out(tutor.recordAssessment(sid, args[2], args[3]));
      break;
    case 'progress':
      out(tutor.getProgress(sid));
      break;
    case 'report':
      out(tutor.getReport(sid));
      break;
    case 'texts':
      out(tutor.listTexts(args[2] || null));
      break;
    case 'students':
      out({ students: tutor.listStudents() });
      break;
    case 'help':
      out({ commands: ['start','set-level','lesson','check','record','progress','report','texts','students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + cmd,
        commands: ['start','set-level','lesson','check','record','progress','report','texts','students'],
      });
  }
});
