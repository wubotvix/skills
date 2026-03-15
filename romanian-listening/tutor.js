#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'romanian-listening';

// ---------------------------------------------------------------------------
// Embedded exercise data by CEFR level
// ---------------------------------------------------------------------------

const EXERCISES = {
  A1: [
    {
      id: 'a1-dict-farmacie',
      title: 'La farmacie',
      type: 'dictation',
      transcript: 'Bună ziua. Am nevoie de ceva pentru durere de cap, vă rog.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Bună ziua. Am nevoie de ceva pentru durere de cap, vă rog.',
          explanation: 'Note the diacritics: "Bună" with ă. "Durere de cap" is the fixed phrase for headache.'
        }
      ],
      vocabulary: ['durere de cap', 'a avea nevoie', 'vă rog'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-dict-prezentare',
      title: 'Prezentare personală',
      type: 'dictation',
      transcript: 'Mă numesc Maria și am douăzeci și cinci de ani. Sunt din România.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Mă numesc Maria și am douăzeci și cinci de ani. Sunt din România.',
          explanation: 'Note diacritics: "și" with ș, "România" with â. "Douăzeci și cinci" is twenty-five.'
        }
      ],
      vocabulary: ['a se numi', 'a avea ani', 'a fi din'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-mp-sar-sar',
      title: 'Sar vs Șar',
      type: 'minimal-pairs',
      transcript: '___ este un cuvânt românesc.',
      questions: [
        {
          question: 'Which word do you hear: "sar" (/s/) or "șar" (/ʃ/)?',
          answer: 'sar',
          explanation: '"Sar" (I jump) uses /s/. "Șar" would use /ʃ/ (ș). The /s/ vs /ʃ/ distinction is critical in Romanian.'
        }
      ],
      vocabulary: ['a sări', 'sar'],
      connectedSpeechFeatures: ['s-vs-ș']
    },
    {
      id: 'a1-mp-tara-tara',
      title: 'Tară vs Țară',
      type: 'minimal-pairs',
      transcript: 'România este o ___ frumoasă.',
      questions: [
        {
          question: 'Which word fits: "tară" (defect) or "țară" (country)?',
          answer: 'țară',
          explanation: '"Țară" (country) uses /ts/ (ț). "Tară" (defect) uses plain /t/. The /t/ vs /ts/ distinction changes meaning.'
        }
      ],
      vocabulary: ['țară', 'frumos'],
      connectedSpeechFeatures: ['t-vs-ț']
    },
    {
      id: 'a1-comp-magazin',
      title: 'La magazin',
      type: 'comprehension',
      transcript: '— Bună ziua! Cât costă un kilogram de mere?\n— Bună ziua! Trei lei kilogramul.\n— Bine, dați-mi două kilograme, vă rog.\n— Poftiți. Sunt șase lei.\n— Mulțumesc. La revedere!',
      questions: [
        {
          question: 'Ce cumpără clientul?',
          answer: 'mere',
          explanation: 'Clientul întreabă "Cât costă un kilogram de mere?" și cumpără două kilograme.'
        },
        {
          question: 'Cât plătește clientul?',
          answer: 'șase lei',
          explanation: 'Vânzătorul spune "Sunt șase lei" (2 kg × 3 lei).'
        }
      ],
      vocabulary: ['a costa', 'kilogram', 'mere', 'lei', 'poftiți'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-gap-salut',
      title: 'Salutări',
      type: 'gap-fill',
      transcript: 'Bună ___! Mă ___ Andrei. Sunt ___ București.',
      questions: [
        {
          question: 'Fill in the three blanks: "Bună ___! Mă ___ Andrei. Sunt ___ București."',
          answer: 'ziua numesc din',
          explanation: '"Bună ziua" (good day), "Mă numesc" (my name is), "Sunt din" (I am from).'
        }
      ],
      vocabulary: ['bună ziua', 'a se numi', 'a fi din'],
      connectedSpeechFeatures: []
    },
  ],

  A2: [
    {
      id: 'a2-dict-restaurant',
      title: 'La restaurant',
      type: 'dictation',
      transcript: 'Aș vrea o ciorbă de legume și o apă minerală, vă rog.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Aș vrea o ciorbă de legume și o apă minerală, vă rog.',
          explanation: 'Note: "Aș vrea" (I would like) uses the conditional. "Ciorbă" has ă. "Și" has ș.'
        }
      ],
      vocabulary: ['aș vrea', 'ciorbă', 'legume', 'apă minerală'],
      connectedSpeechFeatures: ['conditional-polite']
    },
    {
      id: 'a2-dict-directii',
      title: 'Cum ajung la gară?',
      type: 'dictation',
      transcript: 'Mergeți drept, apoi la dreapta, și gara este pe stânga.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Mergeți drept, apoi la dreapta, și gara este pe stânga.',
          explanation: '"Mergeți" is the formal/plural form (dumneavoastră). "Gara" is "gară" with the definite article suffix.'
        }
      ],
      vocabulary: ['a merge drept', 'la dreapta', 'pe stânga', 'gara'],
      connectedSpeechFeatures: ['definite-article-in-speech']
    },
    {
      id: 'a2-mp-par-par-par',
      title: 'Par vs Păr vs Pâr',
      type: 'minimal-pairs',
      transcript: 'Ea are ___ frumos.',
      questions: [
        {
          question: 'Which word fits: "par" (pear tree), "păr" (hair), or a form with â?',
          answer: 'păr',
          explanation: '"Păr" (hair) with /ə/. "Par" (pear tree) with /a/. The ă vs a distinction is critical.'
        }
      ],
      vocabulary: ['par', 'păr'],
      connectedSpeechFeatures: ['a-vs-ă']
    },
    {
      id: 'a2-comp-meteo',
      title: 'Prognoza meteo',
      type: 'comprehension',
      transcript: 'Mâine va fi soare în toată țara. Temperaturile vor fi între douăzeci și douăzeci și cinci de grade. La munte va ploua ușor după-amiază.',
      questions: [
        {
          question: 'Ce vreme va fi mâine în general?',
          answer: 'soare',
          explanation: '"Va fi soare în toată țara" — it will be sunny across the country.'
        },
        {
          question: 'Unde va ploua?',
          answer: 'la munte',
          explanation: '"La munte va ploua ușor după-amiază" — light rain in the mountains in the afternoon.'
        }
      ],
      vocabulary: ['prognoza meteo', 'temperaturi', 'grade', 'a ploua', 'ușor'],
      connectedSpeechFeatures: ['future-tense-va']
    },
    {
      id: 'a2-gap-cumparaturi',
      title: 'Cumpărături',
      type: 'gap-fill',
      transcript: 'Am ___ la piață și am ___ mere, pâine și brânză. A ___ douăzeci de lei.',
      questions: [
        {
          question: 'Fill in: "Am ___ la piață și am ___ mere, pâine și brânză. A ___ douăzeci de lei."',
          answer: 'mers cumpărat costat',
          explanation: '"Am mers" (I went), "am cumpărat" (I bought), "a costat" (it cost) — all perfectul compus.'
        }
      ],
      vocabulary: ['a merge', 'a cumpăra', 'a costa', 'piață'],
      connectedSpeechFeatures: ['perfectul-compus']
    },
    {
      id: 'a2-note-program',
      title: 'Programul zilei',
      type: 'note-taking',
      transcript: 'Cursul de limba română este luni și miercuri, de la nouă la unsprezece. Cursul de istorie este marți, de la două la patru. Vineri avem excursie la Muzeul Național.',
      questions: [
        {
          question: 'Note the schedule: What days and times for Romanian class? History? What is on Friday?',
          answer: 'Romanian: Monday and Wednesday, 9-11. History: Tuesday, 2-4. Friday: excursion to the National Museum.',
          explanation: 'Luni=Monday, Miercuri=Wednesday, Marți=Tuesday, Vineri=Friday. Practice extracting schedules.'
        }
      ],
      vocabulary: ['curs', 'luni', 'miercuri', 'marți', 'vineri', 'excursie', 'muzeu'],
      connectedSpeechFeatures: []
    },
  ],

  B1: [
    {
      id: 'b1-dict-job',
      title: 'La interviul de angajare',
      type: 'dictation',
      transcript: 'Am lucrat trei ani ca programator și aș vrea să schimb domeniul. Mă interesează marketingul digital.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Am lucrat trei ani ca programator și aș vrea să schimb domeniul. Mă interesează marketingul digital.',
          explanation: 'Note "să schimb" (subjunctive with să), "marketingul" (definite article suffix on borrowed word).'
        }
      ],
      vocabulary: ['a lucra', 'programator', 'a schimba', 'domeniu', 'marketing'],
      connectedSpeechFeatures: ['subjunctive-sa']
    },
    {
      id: 'b1-comp-stiri',
      title: 'Știrile zilei',
      type: 'comprehension',
      transcript: 'Guvernul a anunțat astăzi un nou program de investiții în infrastructura de transport. Proiectul prevede construirea a trei autostrăzi noi și modernizarea a zece gări. Bugetul total este de patru miliarde de euro, iar lucrările vor dura cinci ani.',
      questions: [
        {
          question: 'Ce a anunțat guvernul?',
          answer: 'un nou program de investiții în infrastructura de transport',
          explanation: 'The government announced a new investment program in transport infrastructure.'
        },
        {
          question: 'Cât va dura proiectul?',
          answer: 'cinci ani',
          explanation: '"Lucrările vor dura cinci ani" — the works will last five years.'
        },
        {
          question: 'Care este bugetul?',
          answer: 'patru miliarde de euro',
          explanation: '"Bugetul total este de patru miliarde de euro."'
        }
      ],
      vocabulary: ['guvern', 'investiții', 'infrastructură', 'autostradă', 'modernizare', 'buget'],
      connectedSpeechFeatures: ['formal-news-register']
    },
    {
      id: 'b1-gap-poveste',
      title: 'O poveste scurtă',
      type: 'gap-fill',
      transcript: 'Ieri ___ plimbat prin parc când ___ văzut un câine pierdut. ___ oprit și ___ dat apă. Apoi ___ sunat la poliția locală.',
      questions: [
        {
          question: 'Fill in the auxiliary verbs: "Ieri ___ plimbat prin parc când ___ văzut un câine pierdut..."',
          answer: 'm-am am m-am i-am am',
          explanation: '"M-am plimbat" (I walked), "am văzut" (I saw), "m-am oprit" (I stopped), "i-am dat" (I gave him), "am sunat" (I called).'
        }
      ],
      vocabulary: ['a se plimba', 'a vedea', 'a se opri', 'a da', 'a suna'],
      connectedSpeechFeatures: ['clitic-pronouns-in-speech']
    },
    {
      id: 'b1-note-prezentare',
      title: 'Prezentare despre România',
      type: 'note-taking',
      transcript: 'România se află în sud-estul Europei și are o populație de aproximativ nouăsprezece milioane de locuitori. Capitala este Bucureștiul, care are aproape două milioane de locuitori. România este membră a Uniunii Europene din anul două mii șapte. Limba oficială este limba română, o limbă romanică înrudită cu italiana, franceza și spaniola.',
      questions: [
        {
          question: 'Note: population, capital and its population, EU membership year, and language family.',
          answer: 'Population: ~19 million. Capital: Bucharest, ~2 million. EU member since 2007. Romanian is a Romance language related to Italian, French, Spanish.',
          explanation: 'Practice extracting key facts from an informational passage.'
        }
      ],
      vocabulary: ['sud-est', 'populație', 'locuitori', 'capitală', 'membră', 'limbă romanică'],
      connectedSpeechFeatures: ['numbers-in-speech']
    },
    {
      id: 'b1-mp-copii',
      title: 'Copii vs Copii',
      type: 'minimal-pairs',
      transcript: 'Stress matters: CO-pii vs co-PII',
      questions: [
        {
          question: 'Which meaning is intended when stress is on the first syllable: "COpi" = children or copies?',
          answer: 'children',
          explanation: '"COpii" (stress on first syllable) = children. "coPII" (stress on second syllable) = copies. Stress changes meaning in Romanian.'
        }
      ],
      vocabulary: ['copii (children)', 'copii (copies)'],
      connectedSpeechFeatures: ['stress-contrast']
    },
  ],

  B2: [
    {
      id: 'b2-dict-editorial',
      title: 'Editorial de ziar',
      type: 'dictation',
      transcript: 'Deși economia a crescut în ultimul trimestru, disparitățile regionale rămân o problemă majoră. Este necesar să se investească mai mult în zonele rurale.',
      questions: [
        {
          question: 'Write the full passage you heard.',
          answer: 'Deși economia a crescut în ultimul trimestru, disparitățile regionale rămân o problemă majoră. Este necesar să se investească mai mult în zonele rurale.',
          explanation: '"Deși" (although), "disparitățile" (the disparities, def. article suffix), "să se investească" (impersonal subjunctive).'
        }
      ],
      vocabulary: ['economie', 'trimestru', 'disparități', 'a rămâne', 'zonele rurale'],
      connectedSpeechFeatures: ['formal-register', 'subjunctive-impersonal']
    },
    {
      id: 'b2-comp-documentar',
      title: 'Documentar despre Delta Dunării',
      type: 'comprehension',
      transcript: 'Delta Dunării este cea mai mare deltă din Europa și a fost declarată rezervație a biosferei de către UNESCO în anul o mie nouă sute nouăzeci. Aici trăiesc peste trei sute de specii de păsări, inclusiv pelicanul comun. Pescuitul tradițional și turismul ecologic sunt principalele activități economice. Cu toate acestea, poluarea și schimbările climatice amenință acest ecosistem fragil.',
      questions: [
        {
          question: 'Când a fost declarată Delta Dunării rezervație UNESCO?',
          answer: '1990',
          explanation: '"O mie nouă sute nouăzeci" = 1990.'
        },
        {
          question: 'Câte specii de păsări trăiesc în deltă?',
          answer: 'peste trei sute',
          explanation: '"Peste trei sute de specii de păsări" = over 300 bird species.'
        },
        {
          question: 'Ce amenință ecosistemul?',
          answer: 'poluarea și schimbările climatice',
          explanation: 'Pollution and climate change threaten this fragile ecosystem.'
        }
      ],
      vocabulary: ['deltă', 'rezervație', 'biosferă', 'specii', 'pelican', 'ecosistem', 'amenința'],
      connectedSpeechFeatures: ['numbers-year', 'formal-documentary']
    },
    {
      id: 'b2-gap-conditional',
      title: 'Propoziții condiționale',
      type: 'gap-fill',
      transcript: 'Dacă ___ avea mai mult timp, ___ călători prin toată România. ___ vizita Transfăgărășanul și ___ merge la mănăstirile din Bucovina.',
      questions: [
        {
          question: 'Fill in the conditional forms.',
          answer: 'aș aș Aș aș',
          explanation: '"Dacă aș avea" (if I had), "aș călători" (I would travel), "Aș vizita" (I would visit), "aș merge" (I would go).'
        }
      ],
      vocabulary: ['a avea', 'a călători', 'a vizita', 'Transfăgărășan', 'mănăstire', 'Bucovina'],
      connectedSpeechFeatures: ['conditional-mood']
    },
    {
      id: 'b2-note-dezbatere',
      title: 'Dezbatere televizată',
      type: 'note-taking',
      transcript: 'Domnul Popescu consideră că digitalizarea educației este o prioritate. Doamna Ionescu susține că mai întâi trebuie rezolvată problema salarizării profesorilor. Domnul Marinescu propune un compromis: investiții simultane atât în tehnologie, cât și în resurse umane.',
      questions: [
        {
          question: 'Note each speaker\'s position on education.',
          answer: 'Popescu: digitalization is priority. Ionescu: teacher salaries first. Marinescu: compromise — invest in both tech and human resources simultaneously.',
          explanation: 'Practice tracking multiple speakers and their positions in a debate.'
        }
      ],
      vocabulary: ['digitalizare', 'salarizare', 'compromis', 'investiții', 'resurse umane'],
      connectedSpeechFeatures: ['multi-speaker-tracking', 'formal-debate']
    },
  ],

  C1: [
    {
      id: 'c1-dict-academic',
      title: 'Discurs academic',
      type: 'dictation',
      transcript: 'Cercetările recente demonstrează că bilingvismul influențează pozitiv funcțiile executive ale creierului, în special capacitatea de a comuta între sarcini diferite.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Cercetările recente demonstrează că bilingvismul influențează pozitiv funcțiile executive ale creierului, în special capacitatea de a comuta între sarcini diferite.',
          explanation: 'Note: "cercetările" (the research, def. art.), "funcțiile" (the functions), "creierului" (of the brain, genitive).'
        }
      ],
      vocabulary: ['cercetare', 'bilingvism', 'funcții executive', 'creier', 'a comuta', 'sarcini'],
      connectedSpeechFeatures: ['academic-register', 'genitive-in-speech']
    },
    {
      id: 'c1-comp-interviu',
      title: 'Interviu cultural',
      type: 'comprehension',
      transcript: 'Scriitorul mărturisește că romanul său cel mai recent a fost inspirat de experiența diasporei românești. „Am vrut să surprind acel sentiment de dor pe care îl resimți când ești departe de casă", spune el. „Dorul nu este doar nostalgie, ci o formă de iubire pentru un loc care nu mai există decât în memorie." Criticii au primit romanul cu entuziasm, numind-ul „o meditație profundă asupra identității în lumea globalizată."',
      questions: [
        {
          question: 'Ce a inspirat romanul?',
          answer: 'experiența diasporei românești',
          explanation: 'The novel was inspired by the Romanian diaspora experience.'
        },
        {
          question: 'Cum definește scriitorul "dorul"?',
          answer: 'o formă de iubire pentru un loc care nu mai există decât în memorie',
          explanation: 'He defines "dor" as a form of love for a place that only exists in memory.'
        },
        {
          question: 'Cum au primit criticii romanul?',
          answer: 'cu entuziasm',
          explanation: 'Critics received the novel enthusiastically, calling it a profound meditation on identity.'
        }
      ],
      vocabulary: ['scriitor', 'a mărturisi', 'diasporă', 'dor', 'nostalgie', 'meditație', 'identitate'],
      connectedSpeechFeatures: ['literary-register', 'reported-speech']
    },
    {
      id: 'c1-gap-presumptiv',
      title: 'Modul prezumtiv',
      type: 'gap-fill',
      transcript: 'Nu răspunde la telefon. ___ dormind. Sau ___ plecat deja. Cine știe, ___ uitat și de întâlnire.',
      questions: [
        {
          question: 'Fill in with presumptive mood forms.',
          answer: 'O fi Va fi o fi',
          explanation: '"O fi dormind" (he might be sleeping), "Va fi plecat" (he must have left), "o fi uitat" (he may have forgotten). The presumptive mood is unique to Romanian.'
        }
      ],
      vocabulary: ['a dormi', 'a pleca', 'a uita', 'modul prezumtiv'],
      connectedSpeechFeatures: ['presumptive-mood']
    },
  ],

  C2: [
    {
      id: 'c2-dict-literar',
      title: 'Proză literară',
      type: 'dictation',
      transcript: 'Amintirile se înșirau ca mărgelele pe o ață subțire, fiecare strălucind cu lumina ei proprie, dar amenințând mereu să se risipească în neant la cea mai mică atingere.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Amintirile se înșirau ca mărgelele pe o ață subțire, fiecare strălucind cu lumina ei proprie, dar amenințând mereu să se risipească în neant la cea mai mică atingere.',
          explanation: 'Complex literary prose: "se înșirau" (imperfect reflexive), "mărgelele" (the beads, def. art.), "amenințând" (gerund), "neant" (nothingness).'
        }
      ],
      vocabulary: ['amintire', 'a se înșira', 'mărgea', 'ață', 'a străluci', 'a se risipi', 'neant'],
      connectedSpeechFeatures: ['literary-prose', 'imperfect-tense', 'gerund']
    },
    {
      id: 'c2-comp-filosofic',
      title: 'Eseu filozofic',
      type: 'comprehension',
      transcript: 'Cioran scria că nenorocirea de a fi născut nu e doar o formulă retorică, ci expresia unei intuiții fundamentale. Existența precede esența nu în sensul sartrian, ci într-un sens mai radical: existăm înainte de a ne putea justifica existența. Această conștiință a absurdului, departe de a fi paralizantă, devine paradoxal motorul creației. Scriitorul transformă neantul în cuvânt, iar cuvântul, oricât de fragil, opune rezistență timpului.',
      questions: [
        {
          question: 'Ce susține textul despre relația dintre absurd și creație?',
          answer: 'Conștiința absurdului devine paradoxal motorul creației',
          explanation: 'The awareness of absurdity paradoxically becomes the engine of creation.'
        },
        {
          question: 'Cum transformă scriitorul neantul?',
          answer: 'în cuvânt care opune rezistență timpului',
          explanation: 'The writer transforms nothingness into words that resist time.'
        }
      ],
      vocabulary: ['nenorocire', 'formulă retorică', 'intuiție', 'esență', 'conștiință', 'absurd', 'neant'],
      connectedSpeechFeatures: ['philosophical-register', 'complex-syntax']
    },
  ],
};

// Flat lookup for all exercises
const ALL_EXERCISES = {};
for (const level of Object.keys(EXERCISES)) {
  for (const ex of EXERCISES[level]) {
    ALL_EXERCISES[ex.id] = { ...ex, level };
  }
}

// ---------------------------------------------------------------------------
// ListeningTutor
// ---------------------------------------------------------------------------

class ListeningTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.skills) p.skills = {};
    if (!p.assessments) p.assessments = [];
    if (!p.exerciseHistory) p.exerciseHistory = {};
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

  getExerciseCatalog(level) {
    if (level) {
      const lv = level.toUpperCase();
      const exs = EXERCISES[lv];
      if (!exs) return { error: `No exercises for level ${lv}` };
      return { level: lv, exercises: exs.map(e => ({ id: e.id, title: e.title, type: e.type })) };
    }
    const catalog = {};
    for (const lv of Object.keys(EXERCISES)) {
      catalog[lv] = EXERCISES[lv].map(e => ({ id: e.id, title: e.title, type: e.type }));
    }
    return catalog;
  }

  // ---- Exercise generation ----

  generateExercise(studentId, type) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const pool = EXERCISES[level] || EXERCISES.A1;
    const filtered = type ? pool.filter(e => e.type === type) : pool;
    if (!filtered.length) throw new Error('No exercises of type ' + type + ' at level ' + level);

    const chosen = core.pick(filtered, 1)[0];
    return {
      studentId,
      level,
      exerciseId: chosen.id,
      type: chosen.type,
      title: chosen.title,
      transcript: chosen.transcript,
      questions: chosen.questions.map((q, i) => ({
        index: i,
        question: q.question
      })),
      vocabulary: chosen.vocabulary,
      connectedSpeechFeatures: chosen.connectedSpeechFeatures
    };
  }

  generateLesson(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const pool = EXERCISES[level] || EXERCISES.A1;

    // Pick up to 4 exercises, varying types
    const types = [...new Set(pool.map(e => e.type))];
    const lesson = [];
    for (const t of core.shuffle(types).slice(0, 4)) {
      const ofType = pool.filter(e => e.type === t);
      lesson.push(core.pick(ofType, 1)[0]);
    }

    return {
      studentId,
      level,
      date: core.today(),
      exercises: lesson.map(ex => ({
        exerciseId: ex.id,
        type: ex.type,
        title: ex.title,
        transcript: ex.transcript,
        questions: ex.questions.map((q, i) => ({ index: i, question: q.question })),
        vocabulary: ex.vocabulary,
        connectedSpeechFeatures: ex.connectedSpeechFeatures
      }))
    };
  }

  // ---- Answer checking ----

  checkAnswer(studentId, exerciseId, answerText, questionIndex) {
    const ex = ALL_EXERCISES[exerciseId];
    if (!ex) throw new Error('Exercise not found: ' + exerciseId);

    const results = [];
    for (const q of ex.questions) {
      const normAnswer = core.norm(answerText);
      const normExpected = core.norm(q.answer);
      const exact = normAnswer === normExpected;
      const partial = !exact && normExpected.split(' ').filter(w =>
        normAnswer.split(' ').includes(w)
      ).length / normExpected.split(' ').length;

      results.push({
        question: q.question,
        expected: q.answer,
        given: answerText,
        correct: exact,
        partialScore: exact ? 1 : Math.round((partial || 0) * 100) / 100,
        explanation: q.explanation
      });
    }

    // Record in profile
    const p = this.getProfile(studentId);
    p.exerciseHistory[exerciseId] = {
      lastAttempt: core.today(),
      results,
      type: ex.type,
      level: ex.level
    };
    this._save(p);

    return {
      exerciseId,
      type: ex.type,
      level: ex.level,
      results
    };
  }

  // ---- Assessment recording ----

  recordAssessment(studentId, exerciseId, score, total) {
    const ex = ALL_EXERCISES[exerciseId];
    if (!ex) throw new Error('Exercise not found: ' + exerciseId);

    const p = this.getProfile(studentId);
    const skillKey = `${ex.level}-${ex.type}`;

    if (!p.skills[skillKey]) {
      p.skills[skillKey] = {
        level: ex.level,
        type: ex.type,
        attempts: [],
        stability: 1,
        difficulty: 5,
        lastReview: null,
        nextReview: null
      };
    }

    const sk = p.skills[skillKey];
    sk.attempts.push({ score, total, date: core.today(), exerciseId });
    if (sk.attempts.length > 20) sk.attempts = sk.attempts.slice(-20);

    // FSRS update
    const grade = total > 0 ? Math.min(4, Math.max(1, Math.round((score / total) * 4))) : 1;
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, Math.max(1, grade));
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, Math.max(1, grade));
    sk.lastReview = core.today();
    sk.nextReview = (() => {
      const d = new Date();
      d.setDate(d.getDate() + core.fsrsNextReview(sk.stability));
      return d.toISOString().slice(0, 10);
    })();

    p.assessments.push({
      exerciseId,
      skillKey,
      score,
      total,
      date: core.today()
    });

    this._save(p);
    return {
      studentId,
      exerciseId,
      skillKey,
      score,
      total,
      mastery: core.calcMastery(sk.attempts),
      masteryLabel: core.masteryLabel(core.calcMastery(sk.attempts)),
      nextReview: sk.nextReview
    };
  }

  // ---- Progress & reports ----

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const progress = {};
    for (const [key, sk] of Object.entries(p.skills || {})) {
      progress[key] = {
        level: sk.level,
        type: sk.type,
        mastery: core.calcMastery(sk.attempts),
        masteryLabel: core.masteryLabel(core.calcMastery(sk.attempts)),
        attempts: (sk.attempts || []).length,
        nextReview: sk.nextReview
      };
    }
    return { studentId, level: p.level, progress };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);

    // Summary by type
    const byType = {};
    for (const [, sk] of Object.entries(p.skills || {})) {
      if (!byType[sk.type]) byType[sk.type] = { attempts: 0, totalScore: 0, totalPossible: 0 };
      for (const a of sk.attempts || []) {
        byType[sk.type].attempts++;
        byType[sk.type].totalScore += a.score;
        byType[sk.type].totalPossible += a.total;
      }
    }
    for (const t of Object.keys(byType)) {
      byType[t].accuracy = byType[t].totalPossible > 0
        ? Math.round(byType[t].totalScore / byType[t].totalPossible * 100) : 0;
    }

    // Summary by level
    const byLevel = {};
    for (const [, sk] of Object.entries(p.skills || {})) {
      if (!byLevel[sk.level]) byLevel[sk.level] = { skills: 0, mastered: 0 };
      byLevel[sk.level].skills++;
      if (core.calcMastery(sk.attempts) >= core.MASTERY_THRESHOLD) byLevel[sk.level].mastered++;
    }

    return {
      studentId,
      level: p.level,
      createdAt: p.createdAt,
      totalAssessments: (p.assessments || []).length,
      skillProgress: progress.progress,
      byType,
      byLevel,
      recentActivity: (p.assessments || []).slice(-10).reverse()
    };
  }

  getNextExercises(studentId) {
    const p = this.getProfile(studentId);
    const now = core.today();
    const due = [];

    for (const [key, sk] of Object.entries(p.skills || {})) {
      if (sk.nextReview && sk.nextReview <= now) {
        due.push({
          skillKey: key,
          level: sk.level,
          type: sk.type,
          mastery: core.calcMastery(sk.attempts),
          dueDate: sk.nextReview
        });
      }
    }

    // Also suggest new exercise types not yet attempted at current level
    const level = p.level || 'A1';
    const pool = EXERCISES[level] || [];
    const triedTypes = new Set(Object.values(p.skills || {})
      .filter(sk => sk.level === level)
      .map(sk => sk.type));
    const newTypes = [...new Set(pool.map(e => e.type))].filter(t => !triedTypes.has(t));

    return {
      studentId,
      level,
      dueForReview: due.sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
      newTypesToTry: newTypes
    };
  }

  // ---- Admin ----

  listStudents() {
    return core.listProfiles(this.dir);
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new ListeningTutor();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const id = args[1];
      if (!id) throw new Error('Usage: start <studentId> [level]');
      const level = args[2] || 'A1';
      if (!core.CEFR.includes(level.toUpperCase())) throw new Error('Invalid level: ' + level);
      const p = tutor.getProfile(id);
      if (!p.level) p.level = level.toUpperCase();
      tutor._save(p);
      out({ studentId: id, level: p.level, status: 'ready' });
      break;
    }
    case 'set-level': {
      const id = args[1], level = args[2];
      if (!id || !level) throw new Error('Usage: set-level <studentId> <level>');
      out(tutor.setLevel(id, level));
      break;
    }
    case 'lesson': {
      const id = args[1];
      if (!id) throw new Error('Usage: lesson <studentId>');
      out(tutor.generateLesson(id));
      break;
    }
    case 'exercise': {
      const id = args[1], type = args[2] || null;
      if (!id) throw new Error('Usage: exercise <studentId> [type]');
      out(tutor.generateExercise(id, type));
      break;
    }
    case 'check': {
      const id = args[1], exId = args[2], answer = args.slice(3).join(' ');
      if (!id || !exId || !answer) throw new Error('Usage: check <studentId> <exerciseId> <answer>');
      out(tutor.checkAnswer(id, exId, answer, parseInt(args[4], 10) || null));
      break;
    }
    case 'record': {
      const id = args[1], exId = args[2], score = parseInt(args[3]), total = parseInt(args[4]);
      if (!id || !exId || isNaN(score) || isNaN(total)) throw new Error('Usage: record <studentId> <exerciseId> <score> <total>');
      out(tutor.recordAssessment(id, exId, score, total));
      break;
    }
    case 'progress': {
      const id = args[1];
      if (!id) throw new Error('Usage: progress <studentId>');
      out(tutor.getProgress(id));
      break;
    }
    case 'report': {
      const id = args[1];
      if (!id) throw new Error('Usage: report <studentId>');
      out(tutor.getReport(id));
      break;
    }
    case 'next': {
      const id = args[1];
      if (!id) throw new Error('Usage: next <studentId>');
      out(tutor.getNextExercises(id));
      break;
    }
    case 'exercises': {
      const level = args[1] || null;
      out(tutor.getExerciseCatalog(level));
      break;
    }
    case 'students': {
      out({ students: tutor.listStudents() });
      break;
    }
    case 'help':
      out({ commands: ['start', 'set-level', 'lesson', 'exercise', 'check', 'record',
                   'progress', 'report', 'next', 'exercises', 'students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + cmd,
        commands: ['start', 'set-level', 'lesson', 'exercise', 'check', 'record',
                   'progress', 'report', 'next', 'exercises', 'students']
      });
  }
});

module.exports = { ListeningTutor, EXERCISES };
