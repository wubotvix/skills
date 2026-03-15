#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'german-listening';

// ---------------------------------------------------------------------------
// Embedded exercise data by CEFR level
// ---------------------------------------------------------------------------

const EXERCISES = {
  A1: [
    {
      id: 'a1-dict-apotheke',
      title: 'In der Apotheke',
      type: 'dictation',
      transcript: 'Guten Tag. Ich brauche etwas gegen Kopfschmerzen, bitte.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Guten Tag. Ich brauche etwas gegen Kopfschmerzen, bitte.',
          explanation: 'Note the compound noun "Kopfschmerzen" (Kopf + Schmerzen). "Gegen" means "against/for".'
        }
      ],
      vocabulary: ['Kopfschmerzen', 'brauchen', 'bitte'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-dict-vorstellung',
      title: 'Persönliche Vorstellung',
      type: 'dictation',
      transcript: 'Ich heiße Maria und bin fünfundzwanzig Jahre alt. Ich komme aus Österreich.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Ich heiße Maria und bin fünfundzwanzig Jahre alt. Ich komme aus Österreich.',
          explanation: 'Note the ß in "heiße" and the compound number "fünfundzwanzig" (25). "Österreich" has an umlaut.'
        }
      ],
      vocabulary: ['heißen', 'Jahre alt', 'kommen aus'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-mp-stadt-staat',
      title: 'Stadt vs Staat',
      type: 'minimal-pairs',
      transcript: 'Die ___ ist sehr groß.',
      questions: [
        {
          question: 'Which word fits: "Stadt" or "Staat"?',
          answer: 'Stadt',
          explanation: 'A city (Stadt) is big. Short /a/ in Stadt vs long /aː/ in Staat. Vowel length changes meaning.'
        }
      ],
      vocabulary: ['Stadt', 'Staat', 'groß'],
      connectedSpeechFeatures: ['vowel length contrast']
    },
    {
      id: 'a1-mp-miete-mitte',
      title: 'Miete vs Mitte',
      type: 'minimal-pairs',
      transcript: 'Die ___ der Stadt ist sehr schön.',
      questions: [
        {
          question: 'Which word fits: "Miete" (rent) or "Mitte" (center)?',
          answer: 'Mitte',
          explanation: 'The center (Mitte) of the city is beautiful. Long /iː/ in Miete vs short /ɪ/ in Mitte.'
        }
      ],
      vocabulary: ['Miete', 'Mitte', 'Stadt'],
      connectedSpeechFeatures: ['vowel length contrast']
    },
    {
      id: 'a1-comp-supermarkt',
      title: 'Im Supermarkt',
      type: 'comprehension',
      transcript: 'KASSIERERIN: Guten Tag. Das macht sieben Euro fünfzig.\nKUNDE: Hier, bitte. Zehn Euro.\nKASSIERERIN: Sehr gut. Ihr Wechselgeld: zwei Euro fünfzig. Brauchen Sie eine Tüte?\nKUNDE: Ja, bitte.',
      questions: [
        {
          question: 'Wie viel kostet der Einkauf?',
          answer: 'sieben Euro fünfzig',
          explanation: 'Die Kassiererin sagt: "Das macht sieben Euro fünfzig" (7,50 Euro).'
        },
        {
          question: 'Wie viel zahlt der Kunde?',
          answer: 'zehn Euro',
          explanation: 'Der Kunde gibt zehn Euro: "Hier, bitte. Zehn Euro."'
        },
        {
          question: 'Wie viel Wechselgeld bekommt er?',
          answer: 'zwei Euro fünfzig',
          explanation: '10,00 - 7,50 = 2,50. Die Kassiererin bestätigt: "zwei Euro fünfzig."'
        }
      ],
      vocabulary: ['Kassiererin', 'Wechselgeld', 'Tüte'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-gap-baeckerei',
      title: 'In der Bäckerei',
      type: 'gap-fill',
      transcript: 'Guten Morgen! Ich hätte gern zwei ___ und ein Stück ___.',
      questions: [
        {
          question: 'Fill in the blanks: "Ich hätte gern zwei ___ und ein Stück ___."',
          answer: 'Brötchen ... Kuchen',
          explanation: 'Common bakery items: Brötchen (bread rolls) and Kuchen (cake).'
        }
      ],
      vocabulary: ['Brötchen', 'Kuchen', 'Stück'],
      connectedSpeechFeatures: ['glottal stop before vowels']
    },
  ],

  A2: [
    {
      id: 'a2-dict-termin',
      title: 'Einen Termin machen',
      type: 'dictation',
      transcript: 'Guten Tag, ich möchte bitte einen Termin beim Hausarzt machen. Geht es am Mittwoch um vierzehn Uhr?',
      questions: [
        {
          question: 'Write what you heard.',
          answer: 'Guten Tag, ich möchte bitte einen Termin beim Hausarzt machen. Geht es am Mittwoch um vierzehn Uhr?',
          explanation: 'Note "beim" = bei + dem (dative contraction). "Hausarzt" is a compound: Haus + Arzt.'
        }
      ],
      vocabulary: ['Termin', 'Hausarzt', 'Mittwoch'],
      connectedSpeechFeatures: ['compound nouns']
    },
    {
      id: 'a2-comp-wetter',
      title: 'Wetterbericht',
      type: 'comprehension',
      transcript: 'Hier ist der Wetterbericht für Norddeutschland. Heute wird es bewölkt mit Temperaturen um die fünfzehn Grad. Am Nachmittag kann es leichten Regen geben. Morgen wird es freundlicher mit Sonne und bis zu zwanzig Grad.',
      questions: [
        {
          question: 'Wie wird das Wetter heute?',
          answer: 'bewölkt mit etwa fünfzehn Grad, nachmittags leichter Regen',
          explanation: '"bewölkt" = cloudy, "leichter Regen" = light rain'
        },
        {
          question: 'Wie wird das Wetter morgen?',
          answer: 'freundlicher mit Sonne und bis zu zwanzig Grad',
          explanation: '"freundlicher" = friendlier/nicer, common word for improving weather'
        }
      ],
      vocabulary: ['bewölkt', 'Temperaturen', 'Regen', 'freundlicher'],
      connectedSpeechFeatures: ['final devoicing']
    },
    {
      id: 'a2-mp-kuchen-kuchen',
      title: 'Kuchen vs Küchen',
      type: 'minimal-pairs',
      transcript: 'Wir haben drei ___ in unserem Restaurant.',
      questions: [
        {
          question: 'Which fits: "Kuchen" (cakes) or "Küchen" (kitchens)?',
          answer: 'Küchen',
          explanation: 'A restaurant has kitchens (Küchen). Note: Kuchen uses ach-Laut /x/, Küchen uses ich-Laut /ç/. The umlaut triggers the different ch-sound.'
        }
      ],
      vocabulary: ['Kuchen', 'Küche', 'Restaurant'],
      connectedSpeechFeatures: ['ich-Laut vs ach-Laut']
    },
    {
      id: 'a2-gap-zugansage',
      title: 'Zugdurchsage',
      type: 'gap-fill',
      transcript: 'Achtung auf Gleis ___! Der ICE nach ___ hat eine Verspätung von ___ Minuten.',
      questions: [
        {
          question: 'Fill the blanks from the train announcement.',
          answer: 'drei ... München ... fünfzehn',
          explanation: 'Typical Bahnansage vocabulary: Gleis (platform), Verspätung (delay).'
        }
      ],
      vocabulary: ['Gleis', 'Verspätung', 'Achtung'],
      connectedSpeechFeatures: ['compound stress']
    },
    {
      id: 'a2-note-restaurant',
      title: 'Im Restaurant bestellen',
      type: 'note-taking',
      transcript: 'Also, ich nehme als Vorspeise die Tomatensuppe, dann als Hauptgericht das Wiener Schnitzel mit Kartoffelsalat, und als Nachtisch hätte ich gern den Apfelstrudel.',
      questions: [
        {
          question: 'What did the person order? List Vorspeise, Hauptgericht, and Nachtisch.',
          answer: 'Vorspeise: Tomatensuppe, Hauptgericht: Wiener Schnitzel mit Kartoffelsalat, Nachtisch: Apfelstrudel',
          explanation: 'Note the compound nouns: Tomatensuppe, Kartoffelsalat, Apfelstrudel.'
        }
      ],
      vocabulary: ['Vorspeise', 'Hauptgericht', 'Nachtisch', 'Wiener Schnitzel'],
      connectedSpeechFeatures: ['compound nouns']
    },
  ],

  B1: [
    {
      id: 'b1-comp-bewerbung',
      title: 'Vorstellungsgespräch',
      type: 'comprehension',
      transcript: 'PERSONALCHEF: Guten Tag, Frau Schmidt. Erzählen Sie mir etwas über sich.\nBEWERBERIN: Ich habe an der TU München Informatik studiert und danach drei Jahre bei einer Softwarefirma gearbeitet. Ich bin teamfähig und habe Erfahrung im Projektmanagement.\nPERSONALCHEF: Warum möchten Sie die Stelle wechseln?\nBEWERBERIN: Ich suche eine neue Herausforderung und interessiere mich besonders für Ihr internationales Umfeld.',
      questions: [
        {
          question: 'Was hat Frau Schmidt studiert?',
          answer: 'Informatik an der TU München',
          explanation: 'TU = Technische Universität. Informatik = computer science.'
        },
        {
          question: 'Wie lange hat sie bei der Softwarefirma gearbeitet?',
          answer: 'drei Jahre',
          explanation: '"danach drei Jahre" = for three years afterwards.'
        },
        {
          question: 'Warum will sie die Stelle wechseln?',
          answer: 'Sie sucht eine neue Herausforderung und interessiert sich für das internationale Umfeld.',
          explanation: 'Herausforderung = challenge, Umfeld = environment.'
        }
      ],
      vocabulary: ['Vorstellungsgespräch', 'teamfähig', 'Herausforderung', 'Umfeld'],
      connectedSpeechFeatures: ['compound nouns', 'connected speech in natural tempo']
    },
    {
      id: 'b1-dict-nachrichten',
      title: 'Nachrichtenmeldung',
      type: 'dictation',
      transcript: 'Aufgrund des starken Schneefalls in Süddeutschland wurden zahlreiche Zugverbindungen eingestellt. Die Deutsche Bahn empfiehlt Reisenden, sich vor Fahrtantritt zu informieren.',
      questions: [
        {
          question: 'Write the news report.',
          answer: 'Aufgrund des starken Schneefalls in Süddeutschland wurden zahlreiche Zugverbindungen eingestellt. Die Deutsche Bahn empfiehlt Reisenden, sich vor Fahrtantritt zu informieren.',
          explanation: 'Note formal structures: "aufgrund" + genitive, passive "wurden eingestellt", compound "Zugverbindungen", "Fahrtantritt".'
        }
      ],
      vocabulary: ['Schneefall', 'Zugverbindungen', 'eingestellt', 'Fahrtantritt'],
      connectedSpeechFeatures: ['passive voice markers', 'genitive structures']
    },
    {
      id: 'b1-gap-ansage',
      title: 'Museumsführung',
      type: 'gap-fill',
      transcript: 'Willkommen im Deutschen Museum! Die Führung ___ um elf Uhr und ___ ungefähr neunzig Minuten. Bitte ___ Sie Ihre Taschen in den Schließfächern ab.',
      questions: [
        {
          question: 'Fill the blanks in the museum announcement.',
          answer: 'beginnt ... dauert ... geben',
          explanation: 'beginnen (to begin), dauern (to last), abgeben (to deposit — separable verb).'
        }
      ],
      vocabulary: ['Führung', 'Schließfächer', 'abgeben'],
      connectedSpeechFeatures: ['separable verbs in speech']
    },
  ],

  B2: [
    {
      id: 'b2-comp-vortrag',
      title: 'Universitätsvortrag',
      type: 'comprehension',
      transcript: 'In meinem heutigen Vortrag möchte ich auf die Auswirkungen der Digitalisierung auf den Arbeitsmarkt eingehen. Einerseits entstehen durch Automatisierung neue Arbeitsplätze in der Technologiebranche. Andererseits fallen viele traditionelle Berufe weg. Die Frage, die sich daraus ergibt, ist: Wie können wir sicherstellen, dass niemand zurückgelassen wird?',
      questions: [
        {
          question: 'What is the main topic of the lecture?',
          answer: 'Die Auswirkungen der Digitalisierung auf den Arbeitsmarkt.',
          explanation: 'Auswirkungen = effects/impacts, Arbeitsmarkt = job market.'
        },
        {
          question: 'Name one positive and one negative effect mentioned.',
          answer: 'Positiv: neue Arbeitsplätze in der Technologiebranche. Negativ: viele traditionelle Berufe fallen weg.',
          explanation: '"Einerseits...andererseits" = on one hand...on the other hand.'
        }
      ],
      vocabulary: ['Auswirkungen', 'Digitalisierung', 'Automatisierung', 'sicherstellen'],
      connectedSpeechFeatures: ['nominal style', 'academic register']
    },
    {
      id: 'b2-note-debatte',
      title: 'Podiumsdiskussion',
      type: 'note-taking',
      transcript: 'MODERATOR: Was halten Sie vom Tempolimit auf Autobahnen? SPRECHER 1: Ich bin dafür. Die Zahlen zeigen eindeutig, dass ein Tempolimit die Unfallrate senken und den CO2-Ausstoß reduzieren würde. SPRECHER 2: Ich sehe das anders. Die persönliche Freiheit ist ein Grundrecht. Außerdem zeigen Studien, dass die meisten schweren Unfälle nicht auf Autobahnen passieren.',
      questions: [
        {
          question: 'What are Speaker 1\'s arguments for a speed limit?',
          answer: 'Es senkt die Unfallrate und reduziert den CO2-Ausstoß.',
          explanation: 'senken = to lower, Unfallrate = accident rate, CO2-Ausstoß = CO2 emissions.'
        },
        {
          question: 'What are Speaker 2\'s arguments against?',
          answer: 'Persönliche Freiheit als Grundrecht; die meisten schweren Unfälle passieren nicht auf Autobahnen.',
          explanation: 'Grundrecht = fundamental right. Note: "Ich sehe das anders" = I see it differently.'
        }
      ],
      vocabulary: ['Tempolimit', 'Unfallrate', 'Grundrecht', 'CO2-Ausstoß'],
      connectedSpeechFeatures: ['debate register', 'counter-arguments']
    },
  ],

  C1: [
    {
      id: 'c1-comp-feuilleton',
      title: 'Feuilleton-Beitrag',
      type: 'comprehension',
      transcript: 'Der kürzlich erschienene Roman von Judith Hermann zeichnet sich durch eine bemerkenswert lakonische Sprache aus, die dem Leser gleichwohl ein komplexes Geflecht zwischenmenschlicher Beziehungen nahebringt. Die Autorin bedient sich einer Erzähltechnik, die bewusst Leerstellen setzt, sodass der Leser gezwungen ist, das Ungesagte selbst zu ergänzen.',
      questions: [
        {
          question: 'How is the author\'s writing style described?',
          answer: 'Lakonisch (laconic/concise) mit bewussten Leerstellen (deliberate gaps), die den Leser zwingen, das Ungesagte zu ergänzen.',
          explanation: '"Lakonisch" = laconic, "Leerstellen" = gaps/blank spaces, "das Ungesagte" = the unsaid.'
        }
      ],
      vocabulary: ['lakonisch', 'Geflecht', 'Leerstellen', 'das Ungesagte'],
      connectedSpeechFeatures: ['participial attributes', 'nominal style', 'literary register']
    },
    {
      id: 'c1-dict-wissenschaft',
      title: 'Wissenschaftliche Zusammenfassung',
      type: 'dictation',
      transcript: 'Die vorliegende Studie untersucht den Zusammenhang zwischen Schlafqualität und kognitiver Leistungsfähigkeit bei Studierenden. Die Ergebnisse deuten darauf hin, dass bereits geringfügige Schlafdefizite zu messbaren Einbußen in der Konzentrationsfähigkeit führen.',
      questions: [
        {
          question: 'Write the academic summary.',
          answer: 'Die vorliegende Studie untersucht den Zusammenhang zwischen Schlafqualität und kognitiver Leistungsfähigkeit bei Studierenden. Die Ergebnisse deuten darauf hin, dass bereits geringfügige Schlafdefizite zu messbaren Einbußen in der Konzentrationsfähigkeit führen.',
          explanation: 'Note the heavy nominal style: Schlafqualität, Leistungsfähigkeit, Schlafdefizite, Einbußen, Konzentrationsfähigkeit.'
        }
      ],
      vocabulary: ['Zusammenhang', 'Leistungsfähigkeit', 'geringfügig', 'Einbußen'],
      connectedSpeechFeatures: ['academic nominal style', 'compound nouns']
    },
  ],

  C2: [
    {
      id: 'c2-comp-kabarett',
      title: 'Politisches Kabarett',
      type: 'comprehension',
      transcript: 'Also, die Bundesregierung hat beschlossen, dass wir alle weniger Auto fahren sollen. Sehr gut. Ich würde ja auch weniger Auto fahren — wenn die Deutsche Bahn nur ab und zu mal pünktlich wäre. Aber nein, bei der Bahn ist eine Verspätung von dreißig Minuten kein Problem — das ist ein Feature! Die sagen: "Wir bieten Ihnen mehr Zeit zum Lesen!"',
      questions: [
        {
          question: 'What is the comedian satirizing?',
          answer: 'Die Bundesregierung will weniger Autofahren, aber die Deutsche Bahn ist immer unpünktlich. Er macht sich über beides lustig.',
          explanation: 'Kabarett uses irony: calling delays a "Feature" satirizes both politics and Deutsche Bahn.'
        },
        {
          question: 'What makes "das ist ein Feature" funny?',
          answer: 'Er benutzt den IT-Begriff "Feature" ironisch für Zugverspätungen und dreht den Nachteil in einen angeblichen Vorteil um.',
          explanation: 'Code-switching with English tech term + ironic inversion = typical German Kabarett humor.'
        }
      ],
      vocabulary: ['Bundesregierung', 'Verspätung', 'Feature', 'pünktlich'],
      connectedSpeechFeatures: ['irony markers', 'spoken register', 'code-switching']
    },
  ],
};

// ---------------------------------------------------------------------------
// ListeningTutor class
// ---------------------------------------------------------------------------

class ListeningTutor {
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

  _exercisesForLevel(level) {
    const idx = core.CEFR.indexOf(level);
    const out = [];
    for (let i = 0; i <= idx; i++) {
      const lv = core.CEFR[i];
      if (EXERCISES[lv]) out.push(...EXERCISES[lv].map(e => ({ ...e, level: lv })));
    }
    return out;
  }

  generateLesson(studentId, type) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    let available = this._exercisesForLevel(level);

    if (type) available = available.filter(e => e.type === type);
    if (!available.length) throw new Error('No exercises available for level ' + level + (type ? ' type ' + type : ''));

    const seen = new Set(Object.keys(p.skills));
    const unseen = available.filter(e => !seen.has(e.id));
    const candidates = unseen.length ? unseen : available;
    const selected = core.pick(candidates, Math.min(3, candidates.length));

    return {
      studentId, level, date: core.today(),
      exercises: selected.map(e => ({
        id: e.id, title: e.title, type: e.type, level: e.level,
        transcript: e.transcript,
        questions: e.questions.map(q => ({ question: q.question })),
        vocabulary: e.vocabulary,
        connectedSpeechFeatures: e.connectedSpeechFeatures,
      })),
    };
  }

  generateExercise(studentId, type) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    let available = this._exercisesForLevel(level);

    if (type) available = available.filter(e => e.type === type);
    if (!available.length) throw new Error('No exercises available');

    const ex = core.pick(available, 1)[0];
    return {
      id: ex.id, title: ex.title, type: ex.type, level: ex.level,
      transcript: ex.transcript,
      questions: ex.questions.map(q => ({ question: q.question })),
      vocabulary: ex.vocabulary,
    };
  }

  checkAnswer(exerciseId, questionIndex, userAnswer) {
    let exercise = null;
    for (const lv of core.CEFR) {
      if (EXERCISES[lv]) {
        exercise = EXERCISES[lv].find(e => e.id === exerciseId);
        if (exercise) break;
      }
    }
    if (!exercise) throw new Error('Exercise not found: ' + exerciseId);
    const q = exercise.questions[questionIndex];
    if (!q) throw new Error('Question not found at index: ' + questionIndex);

    const expected = core.norm(q.answer);
    const given = core.norm(userAnswer);

    if (given === expected) {
      return { correct: true, message: 'Richtig!', explanation: q.explanation };
    }
    if (expected.includes(given) && given.length > 2) {
      return { correct: true, partial: true, message: `Fast! Full answer: "${q.answer}"`, explanation: q.explanation };
    }
    return { correct: false, expected: q.answer, explanation: q.explanation };
  }

  recordAssessment(studentId, exerciseId, grade) {
    grade = parseInt(grade, 10);
    if (!core.isValidGrade(grade, 1, 4)) throw new Error('Grade must be 1-4');
    const p = this.getProfile(studentId);

    if (!p.skills[exerciseId]) {
      p.skills[exerciseId] = { stability: 1, difficulty: 5, lastReview: null, nextReview: null, attempts: [] };
    }
    const sk = p.skills[exerciseId];
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, grade);
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, grade);
    sk.lastReview = core.today();
    const interval = core.fsrsNextReview(sk.stability, core.DEFAULT_RETENTION);
    const d = new Date(); d.setDate(d.getDate() + interval);
    sk.nextReview = d.toISOString().slice(0, 10);
    sk.attempts.push({ grade, date: core.today() });

    p.assessments.push({ exerciseId, grade, date: core.today() });
    this._save(p);

    return { exerciseId, grade, nextReview: sk.nextReview, interval };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = this._exercisesForLevel(level);

    const byType = {};
    for (const e of available) {
      if (!byType[e.type]) byType[e.type] = { total: 0, studied: 0, mastered: 0 };
      byType[e.type].total++;
      const sk = p.skills[e.id];
      if (sk) {
        byType[e.type].studied++;
        const m = core.calcMastery(sk.attempts.map(a => ({ score: a.grade >= 3 ? 1 : 0, total: 1 })));
        if (m >= core.MASTERY_THRESHOLD) byType[e.type].mastered++;
      }
    }

    return { studentId, level, exerciseTypes: byType, totalAssessments: p.assessments.length };
  }

  getReport(studentId) {
    const progress = this.getProgress(studentId);
    const p = this.getProfile(studentId);
    const recent = (p.assessments || []).slice(-10).reverse();
    return { ...progress, recentAssessments: recent };
  }

  listExercises(level, type) {
    let list = [];
    if (level) {
      list = EXERCISES[level.toUpperCase()] || [];
    } else {
      for (const lv of core.CEFR) {
        if (EXERCISES[lv]) list.push(...EXERCISES[lv].map(e => ({ ...e, level: lv })));
      }
    }
    if (type) list = list.filter(e => e.type === type);
    return list.map(e => ({ id: e.id, title: e.title, type: e.type, level: e.level || level }));
  }

  listStudents() { return core.listProfiles(this.dir); }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new ListeningTutor();

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
    case 'exercise':
      out(tutor.generateExercise(sid, args[2] || null));
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
    case 'exercises':
      out(tutor.listExercises(args[2] || null, args[3] || null));
      break;
    case 'students':
      out({ students: tutor.listStudents() });
      break;
    case 'help':
      out({ commands: ['start','set-level','lesson','exercise','check','record','progress','report','exercises','students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + cmd,
        commands: ['start','set-level','lesson','exercise','check','record','progress','report','exercises','students'],
      });
  }
});
