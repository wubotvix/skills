#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'romanian-reading';

// ---------------------------------------------------------------------------
// Embedded reading texts by CEFR level
// ---------------------------------------------------------------------------

const TEXTS = {
  A1: [
    {
      id: 'a1-cafenea',
      title: 'La cafenea',
      type: 'dialogue',
      text:
        '— Bună ziua! Ce doriți?\n' +
        '— Bună ziua. Vreau o cafea cu lapte, vă rog.\n' +
        '— Mare sau mică?\n' +
        '— Mare. Și o prăjitură, vă rog.\n' +
        '— Bine. Sunt doisprezece lei.\n' +
        '— Poftiți. Mulțumesc.\n' +
        '— Cu plăcere. Poftă bună!',
      vocabulary: [
        { word: 'doriți', definition: 'do you want (formal)', example: 'Ce doriți să comandați?' },
        { word: 'prăjitură', definition: 'cake / pastry', example: 'O prăjitură cu ciocolată.' },
        { word: 'poftă bună', definition: 'enjoy your meal', example: 'Poftă bună la toți!' },
      ],
      comprehensionQuestions: [
        {
          question: 'Ce comandă clientul pentru băut?',
          options: ['Un ceai', 'O cafea cu lapte', 'Un suc de portocale', 'O apă'],
          answer: 1,
          explanation: 'Clientul spune "Vreau o cafea cu lapte."',
        },
        {
          question: 'Ce mărime alege clientul?',
          options: ['Mică', 'Medie', 'Mare', 'Nu spune'],
          answer: 2,
          explanation: 'Când este întrebat "Mare sau mică?", răspunde "Mare."',
        },
        {
          question: 'Cât costă totul?',
          options: ['Zece lei', 'Unsprezece lei', 'Doisprezece lei', 'Cincisprezece lei'],
          answer: 2,
          explanation: '"Sunt doisprezece lei."',
        },
      ],
    },
    {
      id: 'a1-prezentare',
      title: 'Mă prezint',
      type: 'description',
      text:
        'Bună! Mă numesc Ana. Am douăzeci și trei de ani. Sunt din Cluj-Napoca, ' +
        'un oraș frumos din Transilvania. Sunt studentă la universitate. Studiez ' +
        'informatica. Îmi place muzica și filmele. Am un câine. Se cheamă Rex.',
      vocabulary: [
        { word: 'oraș', definition: 'city', example: 'București este un oraș mare.' },
        { word: 'studentă', definition: 'student (female)', example: 'Este studentă la medicină.' },
        { word: 'se cheamă', definition: 'is called', example: 'Cum se cheamă prietenul tău?' },
      ],
      comprehensionQuestions: [
        {
          question: 'De unde este Ana?',
          options: ['București', 'Timișoara', 'Cluj-Napoca', 'Iași'],
          answer: 2,
          explanation: '"Sunt din Cluj-Napoca."',
        },
        {
          question: 'Ce studiază Ana?',
          options: ['Medicina', 'Dreptul', 'Informatica', 'Limba română'],
          answer: 2,
          explanation: '"Studiez informatica."',
        },
        {
          question: 'Ce animal are Ana?',
          options: ['O pisică', 'Un câine', 'Un papagal', 'Nu are'],
          answer: 1,
          explanation: '"Am un câine. Se cheamă Rex."',
        },
      ],
    },
    {
      id: 'a1-familie',
      title: 'Familia mea',
      type: 'description',
      text:
        'Am o familie mare. Tatăl meu se cheamă Ion și are patruzeci și cinci de ani. ' +
        'El este inginer. Mama mea se cheamă Elena și este profesoară. Am doi frați: ' +
        'Mihai are optsprezece ani și Andrei are cincisprezece ani. Bunica mea locuiește ' +
        'la țară și ne vizitează în fiecare vară.',
      vocabulary: [
        { word: 'inginer', definition: 'engineer', example: 'Tatăl meu este inginer.' },
        { word: 'profesoară', definition: 'teacher (female)', example: 'Doamna Popescu este profesoară de matematică.' },
        { word: 'la țară', definition: 'in the countryside', example: 'Bunicii locuiesc la țară.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Ce profesie are tatăl?',
          options: ['Profesor', 'Doctor', 'Inginer', 'Avocat'],
          answer: 2,
          explanation: '"El este inginer."',
        },
        {
          question: 'Câți frați are naratorul?',
          options: ['Unul', 'Doi', 'Trei', 'Niciunul'],
          answer: 1,
          explanation: '"Am doi frați: Mihai și Andrei."',
        },
        {
          question: 'Unde locuiește bunica?',
          options: ['În București', 'La munte', 'La țară', 'În alt oraș'],
          answer: 2,
          explanation: '"Bunica mea locuiește la țară."',
        },
      ],
    },
  ],

  A2: [
    {
      id: 'a2-vacanta',
      title: 'Vacanța la mare',
      type: 'narrative',
      text:
        'Vara trecută am mers la mare cu familia. Am stat o săptămână la Vama Veche, un ' +
        'sat mic pe malul Mării Negre. Am plecat din București cu mașina și drumul a ' +
        'durat patru ore. Vremea a fost foarte frumoasă — soare în fiecare zi. Am ' +
        'înotat în mare, am mâncat pește proaspăt și am vizitat Mangalia. Seara, am ' +
        'ascultat muzică pe plajă. A fost cea mai frumoasă vacanță!',
      vocabulary: [
        { word: 'malul', definition: 'the shore / bank', example: 'Casa este pe malul râului.' },
        { word: 'a durat', definition: 'lasted', example: 'Filmul a durat două ore.' },
        { word: 'proaspăt', definition: 'fresh', example: 'Pâinea este proaspătă.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Unde au mers în vacanță?',
          options: ['La munte', 'La mare', 'Într-un alt oraș', 'În străinătate'],
          answer: 1,
          explanation: '"Am mers la mare cu familia."',
        },
        {
          question: 'Cât a durat drumul?',
          options: ['Două ore', 'Trei ore', 'Patru ore', 'Cinci ore'],
          answer: 2,
          explanation: '"Drumul a durat patru ore."',
        },
        {
          question: 'Ce au făcut seara?',
          options: ['Au citit', 'Au dormit', 'Au ascultat muzică pe plajă', 'Au gătit'],
          answer: 2,
          explanation: '"Seara, am ascultat muzică pe plajă."',
        },
      ],
    },
    {
      id: 'a2-programul',
      title: 'Programul meu zilnic',
      type: 'description',
      text:
        'Mă trezesc la șapte dimineața. Fac duș, mă îmbrac și iau micul dejun. ' +
        'De obicei mănânc pâine cu brânză și beau o cafea. La opt și jumătate plec ' +
        'la serviciu. Lucrez de la nouă la cinci. La prânz mănânc la cantina de la ' +
        'birou. După serviciu, merg la sală de două ori pe săptămână. Seara gătesc ' +
        'cina, mă uit la televizor și citesc o carte. Mă culc la unsprezece.',
      vocabulary: [
        { word: 'a se trezi', definition: 'to wake up', example: 'Mă trezesc devreme.' },
        { word: 'serviciu', definition: 'work / job', example: 'Plec la serviciu la opt.' },
        { word: 'a se culca', definition: 'to go to bed', example: 'Copiii se culcă la nouă.' },
      ],
      comprehensionQuestions: [
        {
          question: 'La ce oră se trezește?',
          options: ['La șase', 'La șapte', 'La opt', 'La nouă'],
          answer: 1,
          explanation: '"Mă trezesc la șapte dimineața."',
        },
        {
          question: 'Unde mănâncă la prânz?',
          options: ['Acasă', 'La restaurant', 'La cantina de la birou', 'Nu mănâncă'],
          answer: 2,
          explanation: '"La prânz mănânc la cantina de la birou."',
        },
        {
          question: 'Cât de des merge la sală?',
          options: ['În fiecare zi', 'De două ori pe săptămână', 'O dată pe săptămână', 'Niciodată'],
          answer: 1,
          explanation: '"Merg la sală de două ori pe săptămână."',
        },
      ],
    },
  ],

  B1: [
    {
      id: 'b1-traditii',
      title: 'Tradiții românești de Crăciun',
      type: 'informational',
      text:
        'Crăciunul este una dintre cele mai importante sărbători în România. Pregătirile ' +
        'încep cu câteva săptămâni înainte. În multe familii, se face curat în toată casa ' +
        'și se pregătesc dulciuri tradiționale: cozonac, sarmale și salată de boeuf.\n\n' +
        'În ajunul Crăciunului, copiii merg din casă în casă să colinde. Colindatul este ' +
        'o tradiție foarte veche, cu origini precreștine. Copiii cântă colinde tradiționale ' +
        'și primesc în schimb nuci, mere și bani.\n\n' +
        'În ziua de Crăciun, întreaga familie se reunește la masă. Este o zi de bucurie, ' +
        'în care oamenii își vizitează rudele și prietenii.',
      vocabulary: [
        { word: 'sărbătoare', definition: 'holiday / celebration', example: 'Paștele este o sărbătoare importantă.' },
        { word: 'cozonac', definition: 'traditional sweet bread', example: 'Bunica face cel mai bun cozonac.' },
        { word: 'a colinda', definition: 'to carol / go caroling', example: 'Copiii colindă în tot satul.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Ce fac copiii în ajunul Crăciunului?',
          options: ['Deschid cadouri', 'Merg la biserică', 'Merg din casă în casă să colinde', 'Dormă devreme'],
          answer: 2,
          explanation: '"Copiii merg din casă în casă să colinde."',
        },
        {
          question: 'Ce primesc copiii pentru colinde?',
          options: ['Jucării', 'Nuci, mere și bani', 'Ciocolată', 'Haine'],
          answer: 1,
          explanation: '"Primesc în schimb nuci, mere și bani."',
        },
        {
          question: 'Care sunt dulciurile tradiționale menționate?',
          options: ['Tort și înghețată', 'Cozonac, sarmale și salată de boeuf', 'Clătite și gogoși', 'Prăjituri și biscuiți'],
          answer: 1,
          explanation: '"Se pregătesc dulciuri tradiționale: cozonac, sarmale și salată de boeuf."',
        },
      ],
    },
    {
      id: 'b1-transport',
      title: 'Transportul public în București',
      type: 'informational',
      text:
        'Bucureștiul are o rețea de transport public care include metroul, autobuze, ' +
        'tramvaie și troleibuze. Metroul este cel mai rapid mijloc de transport, cu ' +
        'patru linii care acoperă principalele zone ale orașului.\n\n' +
        'Biletele se pot cumpăra de la automate sau de la chioșcuri. De asemenea, ' +
        'există un card reîncărcabil care poate fi folosit în toate mijloacele de ' +
        'transport. Un bilet de o călătorie costă trei lei, iar un abonament lunar ' +
        'costă cincizeci de lei.\n\n' +
        'În ultimii ani, sistemul de transport a fost modernizat: s-au introdus autobuze ' +
        'electrice și o aplicație mobilă pentru informații în timp real.',
      vocabulary: [
        { word: 'rețea', definition: 'network', example: 'Rețeaua de internet este rapidă.' },
        { word: 'mijloc de transport', definition: 'means of transport', example: 'Mașina este un mijloc de transport.' },
        { word: 'reîncărcabil', definition: 'rechargeable', example: 'Cardul este reîncărcabil la automate.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Câte linii de metrou are Bucureștiul?',
          options: ['Două', 'Trei', 'Patru', 'Cinci'],
          answer: 2,
          explanation: '"Patru linii care acoperă principalele zone ale orașului."',
        },
        {
          question: 'Cât costă un abonament lunar?',
          options: ['Treizeci de lei', 'Patruzeci de lei', 'Cincizeci de lei', 'Șaizeci de lei'],
          answer: 2,
          explanation: '"Un abonament lunar costă cincizeci de lei."',
        },
        {
          question: 'Ce modernizări au fost făcute?',
          options: ['Metrou nou', 'Autobuze electrice și aplicație mobilă', 'Tramvaie noi', 'Piste de biciclete'],
          answer: 1,
          explanation: '"S-au introdus autobuze electrice și o aplicație mobilă."',
        },
      ],
    },
  ],

  B2: [
    {
      id: 'b2-film',
      title: 'Noul val cinematografic românesc',
      type: 'essay',
      text:
        'Noul val al cinematografiei românești, apărut la începutul anilor 2000, a adus ' +
        'filmul românesc pe scena internațională. Regizori precum Cristian Mungiu, ' +
        'Cristi Puiu și Corneliu Porumboiu au câștigat premii prestigioase la ' +
        'festivaluri internaționale, inclusiv Palme d\'Or la Cannes.\n\n' +
        'Filmele acestei mișcări se caracterizează prin realism, planuri-secvență ' +
        'lungi, dialoguri naturaliste și o abordare minimalistă a narațiunii. Multe ' +
        'dintre ele abordează teme legate de viața cotidiană, birocrația și moștenirea ' +
        'comunistă.\n\n' +
        'Criticii susțin că succesul noului val se datorează nu doar talentului ' +
        'regizorilor, ci și autenticității cu care aceștia surprind realitatea ' +
        'românească contemporană. Cu toate acestea, există voci care critică ' +
        'pesimismul excesiv al acestor filme.',
      vocabulary: [
        { word: 'cinematografie', definition: 'cinema / filmmaking', example: 'Cinematografia românească este recunoscută internațional.' },
        { word: 'plan-secvență', definition: 'long take / sequence shot', example: 'Regizorul folosește planuri-secvență lungi.' },
        { word: 'moștenire', definition: 'heritage / legacy', example: 'Moștenirea comunistă influențează societatea.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Când a apărut noul val cinematografic românesc?',
          options: ['Anii 1990', 'Începutul anilor 2000', 'Anii 2010', 'Anii 1980'],
          answer: 1,
          explanation: '"Apărut la începutul anilor 2000."',
        },
        {
          question: 'Ce caracterizează filmele noului val?',
          options: ['Efecte speciale', 'Realism și dialoguri naturaliste', 'Muzică de film elaborată', 'Acțiune rapidă'],
          answer: 1,
          explanation: '"Se caracterizează prin realism, planuri-secvență lungi, dialoguri naturaliste."',
        },
        {
          question: 'Ce critici există?',
          options: ['Lipsa de originalitate', 'Pesimismul excesiv', 'Bugetele prea mari', 'Lipsa actorilor buni'],
          answer: 1,
          explanation: '"Există voci care critică pesimismul excesiv al acestor filme."',
        },
      ],
    },
    {
      id: 'b2-mediu',
      title: 'Protecția mediului în România',
      type: 'essay',
      text:
        'România beneficiază de o biodiversitate remarcabilă. Carpații adăpostesc una ' +
        'dintre cele mai mari populații de urși bruni din Europa, iar Delta Dunării ' +
        'este un paradis pentru ornitologi, cu peste 300 de specii de păsări.\n\n' +
        'Cu toate acestea, provocările de mediu sunt semnificative. Defrișările ilegale ' +
        'din pădurile virgine reprezintă o problemă gravă. Organizațiile de mediu ' +
        'estimează că România pierde anual mii de hectare de pădure. Poluarea urbană ' +
        'și gestionarea deficitară a deșeurilor sunt alte probleme presante.\n\n' +
        'Recent, societatea civilă a devenit tot mai activă în domeniul protecției ' +
        'mediului. Au apărut numeroase inițiative de împădurire, reciclare și ' +
        'conștientizare a populației.',
      vocabulary: [
        { word: 'biodiversitate', definition: 'biodiversity', example: 'România are o biodiversitate bogată.' },
        { word: 'defrișare', definition: 'deforestation', example: 'Defrișările ilegale distrug pădurile.' },
        { word: 'conștientizare', definition: 'awareness-raising', example: 'Campaniile de conștientizare sunt importante.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Ce animal sălbatic este menționat în legătură cu Carpații?',
          options: ['Lupul', 'Ursul brun', 'Vulpea', 'Cerbul'],
          answer: 1,
          explanation: '"Carpații adăpostesc una dintre cele mai mari populații de urși bruni din Europa."',
        },
        {
          question: 'Care este problema principală legată de păduri?',
          options: ['Incendiile', 'Defrișările ilegale', 'Seceta', 'Speciile invazive'],
          answer: 1,
          explanation: '"Defrișările ilegale din pădurile virgine reprezintă o problemă gravă."',
        },
        {
          question: 'Ce inițiative au apărut recent?',
          options: ['Turism ecologic', 'Împădurire, reciclare și conștientizare', 'Parcuri noi', 'Legi noi'],
          answer: 1,
          explanation: '"Au apărut numeroase inițiative de împădurire, reciclare și conștientizare."',
        },
      ],
    },
  ],

  C1: [
    {
      id: 'c1-diaspora',
      title: 'Fenomenul diasporei românești',
      type: 'essay',
      text:
        'Diaspora românească numără în prezent aproximativ cinci milioane de persoane, ' +
        'ceea ce reprezintă un sfert din populația țării. Italia și Spania găzduiesc ' +
        'cele mai mari comunități, urmate de Germania, Marea Britanie și Franța.\n\n' +
        'Impactul economic al diasporei este substanțial. Remitențele trimise de ' +
        'românii din străinătate contribuie semnificativ la PIB-ul țării. Totodată, ' +
        'mulți dintre cei care s-au întors au adus cu ei experiență profesională, ' +
        'mentalități antreprenoriale și conexiuni internaționale.\n\n' +
        'Din punct de vedere cultural, fenomenul generează un sentiment complex de ' +
        'dor — acel concept românesc greu de tradus care îmbină nostalgia, dorul de ' +
        'casă și dragostea pentru un loc care, în absență, devine idealizat. ' +
        'Scriitori precum Herta Müller și Norman Manea au explorat această tematică ' +
        'a exilului și a identității fracturate, fiecare dintr-o perspectivă unică.\n\n' +
        'Provocarea principală rămâne integrarea politică a diasporei. Deși dreptul ' +
        'de vot în străinătate a fost extins, infrastructura electorală rămâne ' +
        'insuficientă, generând frustrări recurente la fiecare ciclu electoral.',
      vocabulary: [
        { word: 'remitențe', definition: 'remittances', example: 'Remitențele susțin economia locală.' },
        { word: 'antreprenorial', definition: 'entrepreneurial', example: 'Spiritul antreprenorial crește.' },
        { word: 'dor', definition: 'longing/yearning (untranslatable)', example: 'Dorul de casă este puternic.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Câte persoane numără diaspora românească?',
          options: ['Un milion', 'Trei milioane', 'Cinci milioane', 'Zece milioane'],
          answer: 2,
          explanation: '"Diaspora românească numără aproximativ cinci milioane de persoane."',
        },
        {
          question: 'Ce este "dorul" conform textului?',
          options: ['Tristețe', 'Un concept complex care îmbină nostalgia și dragostea de casă', 'Depresie', 'Bucurie'],
          answer: 1,
          explanation: '"Acel concept românesc greu de tradus care îmbină nostalgia, dorul de casă și dragostea."',
        },
        {
          question: 'Care este provocarea principală legată de diasporă?',
          options: ['Integrarea economică', 'Integrarea politică', 'Bariera lingvistică', 'Discriminarea'],
          answer: 1,
          explanation: '"Provocarea principală rămâne integrarea politică a diasporei."',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// ReadingTutor
// ---------------------------------------------------------------------------

class ReadingTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.readingStats) p.readingStats = {};
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

  getTextCatalog(level) {
    if (level) {
      const lev = level.toUpperCase();
      const texts = TEXTS[lev];
      if (!texts) return { error: `No texts for level ${lev}.` };
      return { level: lev, texts: texts.map(t => ({ id: t.id, title: t.title, type: t.type })) };
    }
    const catalog = {};
    for (const lev of Object.keys(TEXTS)) {
      catalog[lev] = TEXTS[lev].map(t => ({ id: t.id, title: t.title, type: t.type }));
    }
    return catalog;
  }

  _textsForLevel(level) {
    return TEXTS[level] || TEXTS[Object.keys(TEXTS).find(k => k === level)] || [];
  }

  _findText(textId) {
    for (const lev of Object.keys(TEXTS)) {
      const t = TEXTS[lev].find(t => t.id === textId);
      if (t) return { text: t, level: lev };
    }
    return null;
  }

  generateLesson(studentId) {
    const p = this.getProfile(studentId);
    if (!p.level) throw new Error('No level set. Use set-level first.');
    const texts = this._textsForLevel(p.level);
    if (!texts.length) throw new Error(`No texts available for level ${p.level}.`);

    const stats = p.readingStats || {};
    const unattempted = texts.filter(t => !stats[t.id] || !stats[t.id].attempts || stats[t.id].attempts.length === 0);
    const chosen = unattempted.length > 0 ? core.pick(unattempted, 1)[0] : core.pick(texts, 1)[0];

    return {
      studentId,
      level: p.level,
      text: {
        id: chosen.id,
        title: chosen.title,
        type: chosen.type,
        text: chosen.text,
        vocabulary: chosen.vocabulary,
      },
      questions: chosen.comprehensionQuestions.map((q, i) => ({
        index: i,
        question: q.question,
        options: q.options.map((o, j) => `${j}) ${o}`),
      })),
      instructions: 'Citește textul cu atenție. Apoi răspunde la întrebările de înțelegere folosind numărul opțiunii (0-3).',
    };
  }

  getText(studentId, textId) {
    const found = this._findText(textId);
    if (!found) throw new Error(`Text not found: ${textId}`);
    const t = found.text;
    return {
      id: t.id,
      title: t.title,
      type: t.type,
      level: found.level,
      text: t.text,
      vocabulary: t.vocabulary,
      questionCount: t.comprehensionQuestions.length,
    };
  }

  checkAnswer(studentId, textId, qIndex, answer) {
    const found = this._findText(textId);
    if (!found) throw new Error(`Text not found: ${textId}`);
    const t = found.text;
    const qi = parseInt(qIndex, 10);
    if (qi < 0 || qi >= t.comprehensionQuestions.length) {
      throw new Error(`Invalid question index: ${qIndex}. Text has ${t.comprehensionQuestions.length} questions.`);
    }
    const q = t.comprehensionQuestions[qi];
    const ans = parseInt(answer, 10);
    const correct = ans === q.answer;
    return {
      textId,
      questionIndex: qi,
      correct,
      yourAnswer: ans,
      correctAnswer: q.answer,
      correctOption: q.options[q.answer],
      explanation: q.explanation,
    };
  }

  recordAssessment(studentId, textId, score, total) {
    const found = this._findText(textId);
    if (!found) throw new Error(`Text not found: ${textId}`);
    const p = this.getProfile(studentId);
    if (!p.readingStats[textId]) {
      p.readingStats[textId] = {
        attempts: [],
        stability: 1,
        difficulty: 5,
        nextReview: core.today(),
      };
    }
    const st = p.readingStats[textId];
    const s = parseInt(score, 10);
    const t = parseInt(total, 10);
    st.attempts.push({ score: s, total: t, date: core.today() });

    const grade = s === t ? 4 : s >= t * 0.7 ? 3 : s >= t * 0.5 ? 2 : 1;
    st.stability = core.fsrsUpdateStability(st.stability, st.difficulty, grade);
    st.difficulty = core.fsrsUpdateDifficulty(st.difficulty, grade);
    st.nextReview = (() => {
      const days = core.fsrsNextReview(st.stability);
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    })();

    p.assessments.push({
      type: 'reading',
      textId,
      score: s,
      total: t,
      date: core.today(),
    });

    this._save(p);
    return {
      studentId,
      textId,
      score: s,
      total: t,
      mastery: core.calcMastery(st.attempts),
      nextReview: st.nextReview,
    };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const stats = p.readingStats || {};
    const textIds = Object.keys(stats);
    const totalAttempts = textIds.reduce((sum, id) => sum + (stats[id].attempts || []).length, 0);
    const masteries = textIds.map(id => core.calcMastery(stats[id].attempts));
    const avgMastery = masteries.length ? Math.round(masteries.reduce((a, b) => a + b, 0) / masteries.length * 100) / 100 : 0;

    return {
      studentId,
      level: p.level || 'not set',
      textsAttempted: textIds.length,
      totalAttempts,
      averageMastery: avgMastery,
      masteryLabel: core.masteryLabel(avgMastery),
    };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const stats = p.readingStats || {};
    const details = [];
    for (const textId of Object.keys(stats)) {
      const st = stats[textId];
      const found = this._findText(textId);
      const mastery = core.calcMastery(st.attempts);
      details.push({
        textId,
        title: found ? found.text.title : textId,
        level: found ? found.level : '?',
        attempts: st.attempts.length,
        lastScore: st.attempts.length ? st.attempts[st.attempts.length - 1] : null,
        mastery,
        masteryLabel: core.masteryLabel(mastery),
        nextReview: st.nextReview,
      });
    }
    return {
      studentId,
      level: p.level || 'not set',
      createdAt: p.createdAt,
      texts: details,
    };
  }

  getNextTexts(studentId) {
    const p = this.getProfile(studentId);
    if (!p.level) throw new Error('No level set. Use set-level first.');
    const stats = p.readingStats || {};
    const todayStr = core.today();

    const due = [];
    for (const textId of Object.keys(stats)) {
      const st = stats[textId];
      if (st.nextReview <= todayStr) {
        const found = this._findText(textId);
        due.push({
          textId,
          title: found ? found.text.title : textId,
          level: found ? found.level : '?',
          nextReview: st.nextReview,
          mastery: core.calcMastery(st.attempts),
        });
      }
    }

    const texts = this._textsForLevel(p.level);
    const unattempted = texts
      .filter(t => !stats[t.id])
      .map(t => ({ textId: t.id, title: t.title, level: p.level, nextReview: 'new', mastery: 0 }));

    return {
      studentId,
      level: p.level,
      dueForReview: due,
      newTexts: unattempted,
    };
  }

  listStudents() {
    return { students: core.listProfiles(this.dir) };
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new ReadingTutor();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const [, sid, level] = args;
      if (!sid) throw new Error('Usage: start <studentId> [level]');
      if (level) tutor.setLevel(sid, level.toUpperCase());
      const p = tutor.getProfile(sid);
      tutor._save(p);
      out({ message: `Profile loaded for ${sid}.`, level: p.level || 'not set' });
      break;
    }
    case 'set-level': {
      const [, sid, level] = args;
      if (!sid || !level) throw new Error('Usage: set-level <studentId> <level>');
      out(tutor.setLevel(sid, level));
      break;
    }
    case 'lesson': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: lesson <studentId>');
      out(tutor.generateLesson(sid));
      break;
    }
    case 'text': {
      const [, sid, textId] = args;
      if (!sid || !textId) throw new Error('Usage: text <studentId> <textId>');
      out(tutor.getText(sid, textId));
      break;
    }
    case 'check': {
      const [, sid, textId, qIndex, answer] = args;
      if (!sid || !textId || qIndex === undefined || answer === undefined) {
        throw new Error('Usage: check <studentId> <textId> <qIndex> <answer>');
      }
      out(tutor.checkAnswer(sid, textId, qIndex, answer));
      break;
    }
    case 'record': {
      const [, sid, textId, score, total] = args;
      if (!sid || !textId || score === undefined || total === undefined) {
        throw new Error('Usage: record <studentId> <textId> <score> <total>');
      }
      out(tutor.recordAssessment(sid, textId, score, total));
      break;
    }
    case 'progress': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: progress <studentId>');
      out(tutor.getProgress(sid));
      break;
    }
    case 'report': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: report <studentId>');
      out(tutor.getReport(sid));
      break;
    }
    case 'next': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: next <studentId>');
      out(tutor.getNextTexts(sid));
      break;
    }
    case 'texts': {
      const [, level] = args;
      out(tutor.getTextCatalog(level || null));
      break;
    }
    case 'students': {
      out({ students: tutor.listStudents() });
      break;
    }

    case 'help':
      out({ info: 'Use one of the commands listed in SKILL.md' });
      break;
    default:
      out({
        error: `Unknown command: ${cmd}`,
        commands: ['start', 'set-level', 'lesson', 'text', 'check', 'record', 'progress', 'report', 'next', 'texts', 'students'],
      });
  }
});

module.exports = { ReadingTutor, TEXTS };
