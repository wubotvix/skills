#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'portuguese-reading';

// ---------------------------------------------------------------------------
// Embedded reading texts by CEFR level
// ---------------------------------------------------------------------------

const TEXTS = {
  A1: [
    {
      id: 'a1-cafe',
      title: 'No café',
      type: 'dialogue',
      text:
        '— Olá, bom dia. O que deseja?\n' +
        '— Bom dia. Quero um café com leite, por favor.\n' +
        '— Grande ou pequeno?\n' +
        '— Grande. E também um pão de queijo.\n' +
        '— Muito bem. São cinco reais e cinquenta.\n' +
        '— Aqui está. Obrigado.\n' +
        '— De nada. Bom apetite!',
      vocabulary: [
        { word: 'deseja', definition: 'do you want (formal)', example: 'O que deseja tomar?' },
        { word: 'pão de queijo', definition: 'cheese bread (typical Brazilian snack)', example: 'O pão de queijo está quentinho.' },
        { word: 'bom apetite', definition: 'enjoy your meal', example: 'Bom apetite a todos!' },
      ],
      comprehensionQuestions: [
        {
          question: 'O que pede o cliente para beber?',
          options: ['Um chá', 'Um café com leite', 'Um suco de laranja', 'Uma água'],
          answer: 1,
          explanation: 'O cliente diz "Quero um café com leite."',
        },
        {
          question: 'Que tamanho quer o café?',
          options: ['Pequeno', 'Médio', 'Grande', 'Não diz'],
          answer: 2,
          explanation: 'Quando perguntam "Grande ou pequeno?", responde "Grande."',
        },
        {
          question: 'Quanto custa tudo?',
          options: ['Dois reais', 'Três reais', 'Cinco reais e cinquenta', 'Dez reais'],
          answer: 2,
          explanation: 'O empregado diz "São cinco reais e cinquenta."',
        },
      ],
    },
    {
      id: 'a1-familia',
      title: 'A minha família',
      type: 'narrative',
      text:
        'Chamo-me Ana. Tenho vinte e cinco anos e moro em São Paulo. A minha família é pequena. ' +
        'O meu pai chama-se Carlos e tem cinquenta e dois anos. É professor. A minha mãe ' +
        'chama-se Maria e tem quarenta e nove anos. É médica. Tenho um irmão. ' +
        'Chama-se Pedro e tem vinte e dois anos. O Pedro estuda na universidade. ' +
        'Aos fins de semana comemos juntos em casa dos meus pais.',
      vocabulary: [
        { word: 'moro', definition: 'I live', example: 'Moro numa casa grande.' },
        { word: 'médica', definition: 'doctor (female)', example: 'A médica trabalha no hospital.' },
        { word: 'aos fins de semana', definition: 'on weekends', example: 'Aos fins de semana descanso.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Onde mora a Ana?',
          options: ['No Rio', 'Em São Paulo', 'Em Lisboa', 'Em Brasília'],
          answer: 1,
          explanation: 'Ana diz "moro em São Paulo."',
        },
        {
          question: 'Qual é a profissão da mãe da Ana?',
          options: ['Professora', 'Enfermeira', 'Médica', 'Advogada'],
          answer: 2,
          explanation: 'O texto diz "A minha mãe chama-se Maria... É médica."',
        },
        {
          question: 'O que faz o Pedro?',
          options: ['Trabalha', 'Estuda na universidade', 'Viaja', 'Cozinha'],
          answer: 1,
          explanation: 'O texto diz "O Pedro estuda na universidade."',
        },
      ],
    },
    {
      id: 'a1-rotina',
      title: 'O meu dia',
      type: 'narrative',
      text:
        'Todos os dias acordo às sete da manhã. Tomo o café da manhã: café e fruta. ' +
        'Às oito vou para o trabalho de ônibus. Trabalho num escritório das nove às cinco. ' +
        'Ao meio-dia como um sanduíche no parque. À tarde volto para casa e faço ' +
        'o jantar. Depois vejo televisão ou leio um livro. Deito-me às onze.',
      vocabulary: [
        { word: 'acordo', definition: 'I wake up', example: 'Acordo cedo todos os dias.' },
        { word: 'café da manhã', definition: 'breakfast (BR)', example: 'O café da manhã é a refeição mais importante.' },
        { word: 'deito-me', definition: 'I go to bed', example: 'Deito-me tarde às sextas.' },
      ],
      comprehensionQuestions: [
        {
          question: 'A que horas acorda?',
          options: ['Às seis', 'Às sete', 'Às oito', 'Às nove'],
          answer: 1,
          explanation: '"Todos os dias acordo às sete da manhã."',
        },
        {
          question: 'Como vai para o trabalho?',
          options: ['De carro', 'De metro', 'De ônibus', 'A pé'],
          answer: 2,
          explanation: '"Vou para o trabalho de ônibus."',
        },
        {
          question: 'O que faz à noite?',
          options: ['Estuda', 'Vê televisão ou lê', 'Sai com amigos', 'Faz desporto'],
          answer: 1,
          explanation: '"Depois vejo televisão ou leio um livro."',
        },
      ],
    },
  ],

  A2: [
    {
      id: 'a2-ferias',
      title: 'As minhas férias',
      type: 'narrative',
      text:
        'No verão passado fui de férias para o Nordeste do Brasil. Fiquei duas semanas em Salvador, ' +
        'na Bahia. O hotel ficava perto da praia e a vista era linda. Todos os dias ia à praia de manhã ' +
        'e à tarde visitava os monumentos históricos do Pelourinho. A comida baiana é deliciosa — comi ' +
        'acarajé, moqueca e vatapá. Também conheci pessoas muito simpáticas. No último dia, não queria ' +
        'ir embora! Espero voltar no próximo ano.',
      vocabulary: [
        { word: 'ficava', definition: 'was located / was staying', example: 'O hotel ficava no centro.' },
        { word: 'Pelourinho', definition: 'historic district in Salvador', example: 'O Pelourinho é Património da Humanidade.' },
        { word: 'acarajé', definition: 'deep-fried bean cake (Bahian dish)', example: 'O acarajé da Bahia é famoso.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Onde passou as férias?',
          options: ['Rio de Janeiro', 'Salvador, Bahia', 'Recife', 'Fortaleza'],
          answer: 1,
          explanation: '"Fiquei duas semanas em Salvador, na Bahia."',
        },
        {
          question: 'O que fazia de manhã?',
          options: ['Visitava monumentos', 'Ia à praia', 'Comia acarajé', 'Dormia'],
          answer: 1,
          explanation: '"Todos os dias ia à praia de manhã."',
        },
        {
          question: 'Qual foi o sentimento no último dia?',
          options: ['Estava feliz por ir embora', 'Estava aborrecido', 'Não queria ir embora', 'Estava indiferente'],
          answer: 2,
          explanation: '"No último dia, não queria ir embora!"',
        },
      ],
    },
    {
      id: 'a2-receita',
      title: 'Receita: Brigadeiro',
      type: 'informational',
      text:
        'O brigadeiro é o doce mais popular do Brasil. Ingredientes: uma lata de leite condensado, ' +
        'uma colher de sopa de manteiga, três colheres de sopa de chocolate em pó. Modo de fazer: ' +
        'Coloque todos os ingredientes numa panela. Mexa em fogo baixo durante uns dez minutos, ' +
        'até a massa desgrudar do fundo. Deixe arrefecer. Depois, faça bolinhas com as mãos e ' +
        'passe no chocolate granulado. Sirva frio.',
      vocabulary: [
        { word: 'leite condensado', definition: 'condensed milk', example: 'O leite condensado é muito doce.' },
        { word: 'desgrudar', definition: 'to unstick / come away from', example: 'A massa tem de desgrudar da panela.' },
        { word: 'granulado', definition: 'sprinkles', example: 'Passe as bolinhas no chocolate granulado.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Quantos ingredientes são necessários?',
          options: ['Dois', 'Três', 'Quatro', 'Cinco'],
          answer: 1,
          explanation: 'Three ingredients: leite condensado, manteiga, chocolate em pó.',
        },
        {
          question: 'Durante quanto tempo se mexe?',
          options: ['Cinco minutos', 'Dez minutos', 'Quinze minutos', 'Vinte minutos'],
          answer: 1,
          explanation: '"Mexa em fogo baixo durante uns dez minutos."',
        },
        {
          question: 'Como se serve o brigadeiro?',
          options: ['Quente', 'Morno', 'Frio', 'À temperatura ambiente'],
          answer: 2,
          explanation: '"Sirva frio."',
        },
      ],
    },
  ],

  B1: [
    {
      id: 'b1-saudade',
      title: 'Saudade: a palavra intraduzível',
      type: 'informational',
      text:
        'Existe em português uma palavra que não tem tradução exata em nenhuma outra língua: ' +
        'saudade. É um sentimento profundo de nostalgia, uma mistura de tristeza e carinho pela ' +
        'ausência de alguém ou de algo. Pode-se ter saudade de uma pessoa, de um lugar, de um tempo ' +
        'passado ou até de algo que nunca existiu.\n\n' +
        'A saudade está presente em toda a cultura lusófona. Na música portuguesa, o fado é a expressão ' +
        'máxima deste sentimento. No Brasil, a saudade aparece na bossa nova e no sertanejo. Fernando ' +
        'Pessoa escreveu: "Saudade é a presença da ausência." Esta frase resume bem o paradoxo desta ' +
        'emoção tão portuguesa.\n\n' +
        'Curiosamente, a palavra "saudade" foi incluída em várias listas de palavras intraduzíveis do ' +
        'mundo. Linguistas debatem se a existência desta palavra significa que os portugueses e brasileiros ' +
        'sentem esta emoção de forma diferente dos outros povos, ou se simplesmente lhe deram um nome.',
      vocabulary: [
        { word: 'intraduzível', definition: 'untranslatable', example: 'Algumas palavras são intraduzíveis.' },
        { word: 'nostalgia', definition: 'nostalgia, longing', example: 'Sinto nostalgia dos tempos de escola.' },
        { word: 'fado', definition: 'Portuguese folk music genre', example: 'O fado de Lisboa é património imaterial.' },
      ],
      comprehensionQuestions: [
        {
          question: 'O que é saudade?',
          options: ['Alegria', 'Nostalgia e carinho pela ausência', 'Raiva', 'Medo'],
          answer: 1,
          explanation: '"Um sentimento profundo de nostalgia, uma mistura de tristeza e carinho pela ausência."',
        },
        {
          question: 'Quem escreveu "Saudade é a presença da ausência"?',
          options: ['Camões', 'Machado de Assis', 'Fernando Pessoa', 'Saramago'],
          answer: 2,
          explanation: '"Fernando Pessoa escreveu: Saudade é a presença da ausência."',
        },
        {
          question: 'O que debatem os linguistas?',
          answer: 'Se a palavra significa que lusófonos sentem a emoção diferentemente ou se apenas lhe deram nome',
          explanation: 'The debate is whether the word reflects a unique emotional experience or simply a naming convention.',
        },
      ],
    },
  ],

  B2: [
    {
      id: 'b2-lusofonia',
      title: 'A Lusofonia no século XXI',
      type: 'analytical',
      text:
        'A Comunidade dos Países de Língua Portuguesa (CPLP) reúne nove países em quatro continentes, ' +
        'ligados pela língua portuguesa. Contudo, falar de uma lusofonia unificada é uma simplificação. ' +
        'O português falado em Moçambique incorpora estruturas das línguas bantas; o português de Timor-Leste ' +
        'coexiste com o tétum e dezenas de línguas locais; e as diferenças entre o português brasileiro e o ' +
        'europeu, já significativas, continuam a divergir.\n\n' +
        'O Acordo Ortográfico de 1990, que tentou unificar a ortografia, gerou polémica. Portugal implementou-o ' +
        'em 2009, o Brasil em 2016, mas Angola ainda não o ratificou. Críticos argumentam que o acordo favorece ' +
        'a norma brasileira, enquanto defensores sustentam que a unificação é essencial para fortalecer o ' +
        'português como língua internacional.\n\n' +
        'Com mais de 250 milhões de falantes nativos, o português é a sexta língua mais falada do mundo. ' +
        'O crescimento demográfico de África poderá torná-lo a terceira até 2100, segundo projeções da ONU. ' +
        'Esta realidade coloca desafios e oportunidades: como preservar a diversidade linguística dentro da ' +
        'lusofonia, sem fragmentar a língua ao ponto de comprometer a inteligibilidade mútua?',
      vocabulary: [
        { word: 'lusofonia', definition: 'the Portuguese-speaking world', example: 'A lusofonia abrange quatro continentes.' },
        { word: 'polémica', definition: 'controversy', example: 'O acordo gerou muita polémica.' },
        { word: 'ratificou', definition: 'ratified', example: 'Angola ainda não ratificou o acordo.' },
        { word: 'inteligibilidade mútua', definition: 'mutual intelligibility', example: 'A inteligibilidade mútua entre variantes é essencial.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Quantos países fazem parte da CPLP?',
          options: ['Sete', 'Oito', 'Nove', 'Dez'],
          answer: 2,
          explanation: '"A CPLP reúne nove países em quatro continentes."',
        },
        {
          question: 'Qual país ainda não ratificou o Acordo Ortográfico?',
          options: ['Brasil', 'Moçambique', 'Angola', 'Timor-Leste'],
          answer: 2,
          explanation: '"Angola ainda não o ratificou."',
        },
        {
          question: 'Segundo as projeções, que posição poderá alcançar o português até 2100?',
          options: ['Segunda', 'Terceira', 'Quarta', 'Quinta'],
          answer: 1,
          explanation: '"O crescimento demográfico de África poderá torná-lo a terceira até 2100."',
        },
      ],
    },
  ],

  C1: [
    {
      id: 'c1-saramago',
      title: 'A prosa de Saramago',
      type: 'literary',
      text:
        'José Saramago, Nobel da Literatura em 1998, revolucionou a narrativa contemporânea de ' +
        'língua portuguesa. A sua escrita caracteriza-se pela subversão deliberada das convenções ' +
        'tipográficas: os diálogos não são demarcados por travessões ou aspas, mas fluem dentro ' +
        'do corpo do texto, separados apenas por vírgulas e pela capitalização da primeira palavra ' +
        'de cada fala. Esta técnica, longe de ser um mero capricho estilístico, obriga o leitor a ' +
        'uma atenção redobrada e a uma participação ativa na construção do sentido.\n\n' +
        'Em "Ensaio sobre a Cegueira" (1995), Saramago leva esta abordagem ao extremo. As personagens ' +
        'não têm nome — são identificadas por perífrases descritivas: "a mulher do médico", "o rapaz ' +
        'estrábico", "a rapariga dos óculos escuros". Esta despersonalização reforça a alegoria central ' +
        'da obra: numa epidemia de cegueira branca, a perda da visão é também a perda da identidade ' +
        'individual e, por extensão, da civilização.\n\n' +
        'Saramago demonstrou que a língua portuguesa, tantas vezes considerada periférica no cânone ' +
        'literário mundial, é capaz de produzir uma das vozes mais originais e perturbadoras da ' +
        'ficção do século XX.',
      vocabulary: [
        { word: 'subversão', definition: 'subversion', example: 'A subversão das normas é característica de Saramago.' },
        { word: 'perífrases', definition: 'periphrases (roundabout descriptions)', example: 'Usou perífrases em vez de nomes.' },
        { word: 'cânone', definition: 'canon', example: 'O cânone literário é contestado.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Qual é a principal inovação estilística de Saramago?',
          options: ['Uso de rima', 'Subversão das convenções tipográficas nos diálogos', 'Escrita em verso', 'Narrativa em segunda pessoa'],
          answer: 1,
          explanation: 'His dialogues flow without conventional punctuation marks.',
        },
        {
          question: 'Como são identificadas as personagens em "Ensaio sobre a Cegueira"?',
          options: ['Por nomes', 'Por números', 'Por perífrases descritivas', 'Por iniciais'],
          answer: 2,
          explanation: '"São identificadas por perífrases descritivas."',
        },
        {
          question: 'Em que ano recebeu o Nobel?',
          options: ['1995', '1996', '1998', '2000'],
          answer: 2,
          explanation: '"José Saramago, Nobel da Literatura em 1998."',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function allTexts() {
  const out = [];
  for (const lvl of core.CEFR) {
    for (const t of (TEXTS[lvl] || [])) out.push({ ...t, level: lvl });
  }
  return out;
}

function textsForLevel(level) {
  const idx = core.CEFR.indexOf(level);
  if (idx < 0) return allTexts();
  const out = [];
  for (let i = 0; i <= idx; i++) {
    for (const t of (TEXTS[core.CEFR[i]] || [])) out.push({ ...t, level: core.CEFR[i] });
  }
  return out;
}

function findText(id) { return allTexts().find(t => t.id === id) || null; }

// ---------------------------------------------------------------------------
// ReadingTutor
// ---------------------------------------------------------------------------

class ReadingTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(id) {
    const p = core.loadProfile(this.dir, id);
    if (!p.skills) p.skills = {};
    if (!p.assessments) p.assessments = [];
    if (!p.sessions) p.sessions = [];
    return p;
  }

  setLevel(id, level) {
    if (!core.CEFR.includes(level)) throw new Error('Invalid CEFR level');
    const p = this.getProfile(id);
    p.level = level;
    core.saveProfile(this.dir, p);
    return { studentId: id, level, textsAvailable: textsForLevel(level).length };
  }

  listStudents() { return core.listProfiles(this.dir); }

  generateLesson(id) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const available = textsForLevel(level);
    const td = core.today();

    const due = available.filter(t => { const sk = p.skills[t.id]; return sk && sk.nextReview && sk.nextReview <= td; });
    const fresh = available.filter(t => !p.skills[t.id]);
    const text = core.pick(due.length ? due : fresh.length ? fresh : available, 1)[0];

    return {
      studentId: id, level, date: td,
      text: { id: text.id, title: text.title, type: text.type, level: text.level, text: text.text, vocabulary: text.vocabulary, comprehensionQuestions: text.comprehensionQuestions },
    };
  }

  getText(id, textId) {
    const text = findText(textId);
    if (!text) throw new Error('Unknown text: ' + textId);
    return text;
  }

  checkAnswer(id, textId, qIndex, answer) {
    const text = findText(textId);
    if (!text) throw new Error('Unknown text: ' + textId);
    const q = text.comprehensionQuestions[qIndex];
    if (!q) throw new Error('Invalid question index');
    let correct;
    if (q.options) {
      const ansNum = parseInt(answer, 10);
      correct = ansNum === q.answer;
    } else {
      correct = core.norm(answer).includes(core.norm(q.answer)) || core.norm(q.answer).includes(core.norm(answer));
    }
    return { textId, questionIndex: qIndex, correct, expected: q.options ? q.options[q.answer] : q.answer, explanation: q.explanation };
  }

  recordAssessment(id, textId, score, total) {
    const text = findText(textId);
    if (!text) throw new Error('Unknown text: ' + textId);
    const s = parseInt(score, 10);
    const t = parseInt(total, 10);
    const p = this.getProfile(id);
    const grade = s / t >= 0.9 ? 4 : s / t >= 0.7 ? 3 : s / t >= 0.5 ? 2 : 1;

    if (!p.skills[textId]) {
      p.skills[textId] = { stability: 1, difficulty: 5, lastReview: null, nextReview: null, attempts: [] };
    }
    const sk = p.skills[textId];
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, grade);
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, grade);
    sk.lastReview = core.today();
    const interval = core.fsrsNextReview(sk.stability);
    const next = new Date();
    next.setDate(next.getDate() + interval);
    sk.nextReview = next.toISOString().slice(0, 10);
    sk.attempts.push({ score: s, total: t, date: core.today(), grade });
    p.assessments.push({ textId, score: s, total: t, grade, date: core.today() });
    core.saveProfile(this.dir, p);
    return { studentId: id, textId, score: s, total: t, grade, mastery: core.masteryLabel(core.calcMastery(sk.attempts)), nextReview: sk.nextReview };
  }

  getProgress(id) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const available = textsForLevel(level);
    let studied = 0, mastered = 0;
    const items = [];
    for (const t of available) {
      const sk = p.skills[t.id];
      const m = sk ? core.calcMastery(sk.attempts) : 0;
      if (sk) studied++;
      if (m >= core.MASTERY_THRESHOLD) mastered++;
      items.push({ id: t.id, title: t.title, level: t.level, mastery: m, status: !sk ? 'not-started' : m >= core.MASTERY_THRESHOLD ? 'mastered' : 'in-progress' });
    }
    return { studentId: id, level, total: available.length, studied, mastered, texts: items };
  }

  getNextTexts(id) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const available = textsForLevel(level);
    const td = core.today();
    const due = [], unstarted = [];
    for (const t of available) {
      const sk = p.skills[t.id];
      if (!sk) { unstarted.push({ id: t.id, title: t.title, level: t.level }); continue; }
      if (sk.nextReview && sk.nextReview <= td) due.push({ id: t.id, title: t.title, level: t.level, nextReview: sk.nextReview });
    }
    return { studentId: id, date: td, due, unstarted: unstarted.slice(0, 5), totalDue: due.length, totalUnstarted: unstarted.length };
  }

  getReport(id) {
    const progress = this.getProgress(id);
    const next = this.getNextTexts(id);
    const p = this.getProfile(id);
    return { studentId: id, level: p.level || 'A1', ...progress, dueForReview: next.totalDue, unstartedRemaining: next.totalUnstarted, recentAssessments: (p.assessments || []).slice(-10).reverse() };
  }

  getTextCatalog(level) {
    const texts = level ? textsForLevel(level) : allTexts();
    const byLevel = {};
    for (const t of texts) { if (!byLevel[t.level]) byLevel[t.level] = []; byLevel[t.level].push({ id: t.id, title: t.title, type: t.type }); }
    return byLevel;
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new ReadingTutor();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const id = args[1]; if (!id) throw new Error('Usage: start <studentId> [level]');
      const p = tutor.getProfile(id);
      if (args[2] && core.CEFR.includes(args[2].toUpperCase())) p.level = args[2].toUpperCase();
      core.saveProfile(tutor.dir, p);
      out({ status: 'ok', studentId: id, level: p.level || 'A1' });
      break;
    }
    case 'set-level': { const id = args[1], lvl = args[2]; if (!id || !lvl) throw new Error('Usage: set-level <id> <A1-C2>'); out(tutor.setLevel(id, lvl.toUpperCase())); break; }
    case 'lesson': { const id = args[1]; if (!id) throw new Error('Usage: lesson <id>'); out(tutor.generateLesson(id)); break; }
    case 'text': { const id = args[1], tid = args[2]; if (!id || !tid) throw new Error('Usage: text <id> <textId>'); out(tutor.getText(id, tid)); break; }
    case 'check': { const id = args[1], tid = args[2], qi = parseInt(args[3], 10), ans = args.slice(4).join(' '); if (!id || !tid || isNaN(qi)) throw new Error('Usage: check <id> <textId> <qIndex> <answer>'); out(tutor.checkAnswer(id, tid, qi, ans)); break; }
    case 'record': { const id = args[1], tid = args[2], sc = args[3], tot = args[4]; if (!id || !tid || !sc || !tot) throw new Error('Usage: record <id> <textId> <score> <total>'); out(tutor.recordAssessment(id, tid, sc, tot)); break; }
    case 'progress': { const id = args[1]; if (!id) throw new Error('Usage: progress <id>'); out(tutor.getProgress(id)); break; }
    case 'report': { const id = args[1]; if (!id) throw new Error('Usage: report <id>'); out(tutor.getReport(id)); break; }
    case 'next': { const id = args[1]; if (!id) throw new Error('Usage: next <id>'); out(tutor.getNextTexts(id)); break; }
    case 'texts': { const lvl = args[1] || null; out(tutor.getTextCatalog(lvl ? lvl.toUpperCase() : null)); break; }
    case 'students': { out({ students: tutor.listStudents() }); break; }

    case 'help': out({ info: 'Use one of the commands listed in SKILL.md' }); break;
    default: out({ error: 'Unknown command: ' + cmd, commands: ['start','set-level','lesson','text','check','record','progress','report','next','texts','students'] });
  }
});

module.exports = { ReadingTutor, TEXTS };
