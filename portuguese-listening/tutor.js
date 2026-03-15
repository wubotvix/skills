#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'portuguese-listening';

// ---------------------------------------------------------------------------
// Embedded exercise data by CEFR level
// ---------------------------------------------------------------------------

const EXERCISES = {
  A1: [
    {
      id: 'a1-dict-farmacia',
      title: 'Na farmácia',
      type: 'dictation',
      transcript: 'Bom dia. Preciso de alguma coisa para a dor de cabeça, por favor.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Bom dia. Preciso de alguma coisa para a dor de cabeça, por favor.',
          explanation: 'Note the accent on "farmácia". "Dor de cabeça" is the fixed phrase for headache.'
        }
      ],
      vocabulary: ['dor de cabeça', 'precisar de', 'por favor'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-dict-apresentacao',
      title: 'Apresentação pessoal',
      type: 'dictation',
      transcript: 'Chamo-me Maria e tenho vinte e cinco anos. Sou do Brasil.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Chamo-me Maria e tenho vinte e cinco anos. Sou do Brasil.',
          explanation: 'Note the hyphen in "chamo-me" (reflexive). "Vinte e cinco" is three words.'
        }
      ],
      vocabulary: ['chamar-se', 'ter anos', 'ser de'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-mp-avo-avo',
      title: 'Avó vs avô',
      type: 'minimal-pairs',
      transcript: 'A minha ___ faz o melhor bolo.',
      questions: [
        {
          question: 'Which word fits: "avó" /ɔ/ or "avô" /o/?',
          answer: 'avó',
          explanation: 'Grandmother (avó) with open /ɔ/ makes bolo. Grandfather is avô with closed /o/. The open vs closed vowel changes meaning.'
        }
      ],
      vocabulary: ['avó', 'avô', 'bolo'],
      connectedSpeechFeatures: ['open vs closed vowels']
    },
    {
      id: 'a1-mp-pao-pau',
      title: 'Pão vs pau',
      type: 'minimal-pairs',
      transcript: 'Comprei ___ na padaria.',
      questions: [
        {
          question: 'Which word fits: "pão" (bread) or "pau" (stick)?',
          answer: 'pão',
          explanation: 'You buy bread (pão /pɐ̃w̃/) at a bakery. Pau (stick) has oral /aw/. The nasal diphthong /ɐ̃w̃/ vs oral /aw/ changes meaning.'
        }
      ],
      vocabulary: ['pão', 'pau', 'padaria'],
      connectedSpeechFeatures: ['nasal vs oral diphthong']
    },
    {
      id: 'a1-comp-supermercado',
      title: 'No supermercado',
      type: 'comprehension',
      transcript: 'CAIXA: Bom dia. São cinco reais e cinquenta centavos.\nCLIENTE: Aqui está. Dez reais.\nCAIXA: Muito bem. O troco: quatro reais e cinquenta. Quer sacola?\nCLIENTE: Sim, por favor.',
      questions: [
        {
          question: 'Quanto custa a compra?',
          answer: 'cinco reais e cinquenta centavos',
          explanation: 'The cashier states: "São cinco reais e cinquenta centavos" (R$5.50).'
        },
        {
          question: 'Quanto paga o cliente?',
          answer: 'dez reais',
          explanation: 'The client pays with ten reais: "Aqui está. Dez reais."'
        },
        {
          question: 'Quanto é o troco?',
          answer: 'quatro reais e cinquenta',
          explanation: '10.00 - 5.50 = 4.50. The cashier confirms: "quatro reais e cinquenta."'
        }
      ],
      vocabulary: ['caixa', 'troco', 'sacola', 'centavos'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-comp-hotel',
      title: 'Na receção do hotel',
      type: 'comprehension',
      transcript: 'RECECIONISTA: Boa tarde. Em que posso ajudar?\nHÓSPEDE: Boa tarde. Tenho uma reserva no nome de Pedro Santos.\nRECEIONISTA: Sim, um quarto duplo para três noites. Posso ver o seu passaporte?\nHÓSPEDE: Claro, aqui está.\nRECEIONISTA: Obrigada. O seu quarto é o 302, no terceiro andar.',
      questions: [
        {
          question: 'Que tipo de quarto reservou o hóspede?',
          answer: 'um quarto duplo',
          explanation: 'The receptionist confirms: "um quarto duplo para três noites."'
        },
        {
          question: 'Quantas noites vai ficar?',
          answer: 'três noites',
          explanation: 'The reservation is for "três noites."'
        },
        {
          question: 'Qual é o número do quarto?',
          answer: '302',
          explanation: 'The receptionist says: "O seu quarto é o 302, no terceiro andar."'
        }
      ],
      vocabulary: ['rececionista', 'reserva', 'hóspede', 'passaporte', 'andar'],
      connectedSpeechFeatures: []
    },
  ],

  A2: [
    {
      id: 'a2-dict-direccoes',
      title: 'A pedir direções',
      type: 'dictation',
      transcript: 'Com licença, pode dizer-me onde fica a estação de metro mais próxima? É sempre em frente e depois vire à esquerda.',
      questions: [
        {
          question: 'Write the full dialogue you heard.',
          answer: 'Com licença, pode dizer-me onde fica a estação de metro mais próxima? É sempre em frente e depois vire à esquerda.',
          explanation: 'Note "dizer-me" (enclisis), "à esquerda" (contraction a + a). "Metro" has the accent on the first syllable.'
        }
      ],
      vocabulary: ['com licença', 'estação de metro', 'em frente', 'à esquerda'],
      connectedSpeechFeatures: ['contraction à']
    },
    {
      id: 'a2-gap-restaurante',
      title: 'No restaurante',
      type: 'gap-fill',
      transcript: 'Boa noite. ___ ver o menu, por favor? Gostaria do ___ do dia e uma ___ de vinho tinto.',
      questions: [
        { question: 'Fill gap 1', answer: 'Posso', explanation: '"Posso" (Can I) is a polite request form.' },
        { question: 'Fill gap 2', answer: 'prato', explanation: '"Prato do dia" is the daily special.' },
        { question: 'Fill gap 3', answer: 'garrafa', explanation: '"Garrafa de vinho" means bottle of wine.' },
      ],
      vocabulary: ['menu', 'prato do dia', 'garrafa', 'vinho tinto'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a2-mp-caro-carro',
      title: 'Caro vs carro',
      type: 'minimal-pairs',
      transcript: 'Este restaurante é muito ___.',
      questions: [
        {
          question: 'Which word fits: "caro" (expensive) or "carro" (car)?',
          answer: 'caro',
          explanation: 'A restaurant is expensive (caro /ɾ/), not a car (carro /ʁ/ or /h/). Single R between vowels = tap /ɾ/, RR = strong R.'
        }
      ],
      vocabulary: ['caro', 'carro', 'restaurante'],
      connectedSpeechFeatures: ['tap /ɾ/ vs strong R']
    },
    {
      id: 'a2-comp-tempo',
      title: 'Previsão do tempo',
      type: 'comprehension',
      transcript: 'Bom dia a todos. A previsão para hoje: no Rio de Janeiro, sol com algumas nuvens à tarde. Temperatura máxima de trinta e dois graus. Em São Paulo, chuva durante a manhã com melhora à tarde. Máxima de vinte e cinco graus. Em Lisboa, céu nublado com possibilidade de chuva. Temperatura máxima de dezassete graus.',
      questions: [
        {
          question: 'Qual é a temperatura máxima no Rio?',
          answer: 'trinta e dois graus',
          explanation: 'The forecast says: "Temperatura máxima de trinta e dois graus" for Rio.'
        },
        {
          question: 'Como vai estar o tempo em São Paulo de manhã?',
          answer: 'chuva',
          explanation: '"Em São Paulo, chuva durante a manhã."'
        },
        {
          question: 'Qual é a cidade com a temperatura mais baixa?',
          answer: 'Lisboa',
          explanation: 'Lisboa has "dezassete graus" (17°C), the lowest mentioned.'
        }
      ],
      vocabulary: ['previsão', 'nuvens', 'nublado', 'melhora', 'graus'],
      connectedSpeechFeatures: ['BR: dezassete/dezessete variation']
    },
    {
      id: 'a2-dict-familia',
      title: 'A minha família',
      type: 'dictation',
      transcript: 'Tenho uma família grande. Os meus pais moram em Coimbra. A minha irmã mais velha tem dois filhos. O meu irmão mais novo estuda na universidade.',
      questions: [
        {
          question: 'Write what you heard.',
          answer: 'Tenho uma família grande. Os meus pais moram em Coimbra. A minha irmã mais velha tem dois filhos. O meu irmão mais novo estuda na universidade.',
          explanation: 'Notice: "os meus" (PT uses article before possessive), "irmã" has accent, "universidade" ends in -e.'
        }
      ],
      vocabulary: ['família', 'pais', 'irmã', 'irmão', 'universidade'],
      connectedSpeechFeatures: ['article + possessive (PT)']
    },
  ],

  B1: [
    {
      id: 'b1-comp-noticias',
      title: 'Notícias da manhã',
      type: 'comprehension',
      transcript: 'As principais notícias desta manhã: o presidente anunciou novas medidas para combater a inflação. O pacote inclui redução de impostos sobre produtos básicos e aumento do salário mínimo em cinco por cento. Os sindicatos reagiram de forma positiva, mas pediram mais investimento na educação e na saúde. Entretanto, o tempo vai continuar instável durante toda a semana.',
      questions: [
        {
          question: 'O que anunciou o presidente?',
          answer: 'novas medidas para combater a inflação',
          explanation: '"O presidente anunciou novas medidas para combater a inflação."'
        },
        {
          question: 'De quanto é o aumento do salário mínimo?',
          answer: 'cinco por cento',
          explanation: '"Aumento do salário mínimo em cinco por cento."'
        },
        {
          question: 'Como reagiram os sindicatos?',
          answer: 'de forma positiva, mas pediram mais investimento na educação e na saúde',
          explanation: 'The unions reacted positively but asked for more investment in education and health.'
        }
      ],
      vocabulary: ['inflação', 'impostos', 'sindicatos', 'investimento', 'salário mínimo'],
      connectedSpeechFeatures: ['vowel reduction in rapid speech']
    },
    {
      id: 'b1-gap-entrevista',
      title: 'Entrevista de emprego',
      type: 'gap-fill',
      transcript: 'Bom dia. ___ para a vaga de assistente administrativo. Tenho ___ anos de experiência na área. Falo ___ e inglês fluentemente. Estou ___ em começar o mais rápido possível.',
      questions: [
        { question: 'Fill gap 1', answer: 'Candidatei-me', explanation: 'Reflexive verb: candidatar-se' },
        { question: 'Fill gap 2', answer: 'três', explanation: 'Context: years of experience' },
        { question: 'Fill gap 3', answer: 'português', explanation: 'Bilingual: Portuguese and English' },
        { question: 'Fill gap 4', answer: 'disponível', explanation: '"Estou disponível" = I am available' },
      ],
      vocabulary: ['vaga', 'assistente', 'experiência', 'disponível'],
      connectedSpeechFeatures: ['T/D palatalization (BR): "administrativo" [adʒministrativu]']
    },
    {
      id: 'b1-dict-connected',
      title: 'Fala rápida (BR)',
      type: 'dictation',
      transcript: 'Estou com muita fome. Vamos almoçar naquele restaurante que fica perto do escritório?',
      questions: [
        {
          question: 'Write what you heard.',
          answer: 'Estou com muita fome. Vamos almoçar naquele restaurante que fica perto do escritório?',
          explanation: 'In rapid BR speech: "estou" → [iʃtow], "naquele" = em + aquele (contraction), final -e in "fome" → [i].'
        }
      ],
      vocabulary: ['almoçar', 'naquele', 'escritório'],
      connectedSpeechFeatures: ['vowel reduction: fome [fomɪ]', 'contraction: naquele = em + aquele', 'T palatalization: perto [pehtʃu] (some dialects)']
    },
    {
      id: 'b1-notetaking-palestra',
      title: 'Mini-palestra: Alimentação saudável',
      type: 'note-taking',
      transcript: 'Hoje vou falar sobre alimentação saudável. Primeiro, é importante comer pelo menos cinco porções de frutas e vegetais por dia. Segundo, devemos reduzir o consumo de açúcar e gordura saturada. Terceiro, a água é fundamental — recomenda-se beber pelo menos dois litros por dia. Finalmente, as refeições devem ser regulares: três refeições principais e dois lanches.',
      questions: [
        {
          question: 'List the 4 key recommendations.',
          answer: '1. Five portions of fruit/vegetables daily; 2. Reduce sugar and saturated fat; 3. Drink at least 2 liters of water daily; 4. Regular meals: 3 main + 2 snacks',
          explanation: 'The speaker uses "primeiro, segundo, terceiro, finalmente" to structure 4 points.'
        }
      ],
      vocabulary: ['porções', 'vegetais', 'gordura saturada', 'lanches', 'refeições'],
      connectedSpeechFeatures: ['discourse markers: primeiro, segundo, terceiro, finalmente']
    },
  ],

  B2: [
    {
      id: 'b2-comp-debate',
      title: 'Debate sobre redes sociais',
      type: 'comprehension',
      transcript: 'O debate de hoje centra-se no impacto das redes sociais na saúde mental dos jovens. A Dra. Silva argumenta que há uma correlação clara entre o uso excessivo de redes sociais e o aumento da ansiedade e depressão entre adolescentes. No entanto, o Professor Costa contrapõe que as redes sociais também podem ser uma ferramenta valiosa de conexão e apoio emocional, especialmente para jovens em comunidades isoladas. Ambos concordam que a regulação e a educação digital são fundamentais.',
      questions: [
        {
          question: 'Qual é a posição da Dra. Silva?',
          answer: 'Há correlação entre uso excessivo de redes sociais e aumento de ansiedade/depressão em jovens',
          explanation: 'She argues for a clear correlation between excessive social media use and mental health problems.'
        },
        {
          question: 'Qual é o contraponto do Professor Costa?',
          answer: 'As redes sociais podem ser ferramentas de conexão e apoio emocional para jovens isolados',
          explanation: 'He counters that social media can also be a valuable connection tool.'
        },
        {
          question: 'Em que é que ambos concordam?',
          answer: 'Que a regulação e a educação digital são fundamentais',
          explanation: '"Ambos concordam que a regulação e a educação digital são fundamentais."'
        }
      ],
      vocabulary: ['centra-se', 'correlação', 'contrapõe', 'ferramenta', 'regulação'],
      connectedSpeechFeatures: ['formal register', 'academic vocabulary', 'EP vs BR: centra-se/se centra']
    },
    {
      id: 'b2-gap-podcast',
      title: 'Podcast sobre viagens',
      type: 'gap-fill',
      transcript: 'O ___ destino que recomendo é o Algarve, no sul de Portugal. As ___ são deslumbrantes e a gastronomia é ___ . Se ___ em setembro, vai encontrar menos turistas e preços mais ___ .',
      questions: [
        { question: 'Fill gap 1', answer: 'próximo', explanation: 'Next destination' },
        { question: 'Fill gap 2', answer: 'praias', explanation: 'Algarve is famous for beaches' },
        { question: 'Fill gap 3', answer: 'incrível', explanation: 'The gastronomy is incredible' },
        { question: 'Fill gap 4', answer: 'for', explanation: 'Future subjunctive: Se for (if you go)' },
        { question: 'Fill gap 5', answer: 'acessíveis', explanation: 'More accessible/affordable prices' },
      ],
      vocabulary: ['deslumbrantes', 'gastronomia', 'turistas', 'acessíveis'],
      connectedSpeechFeatures: ['future subjunctive: se for']
    },
    {
      id: 'b2-dict-ep-rapid',
      title: 'Fala rápida (EP)',
      type: 'dictation',
      transcript: 'Desculpe, pode repetir? Não percebi o que disse. É que estou a aprender português e ainda tenho alguma dificuldade.',
      questions: [
        {
          question: 'Write what you heard.',
          answer: 'Desculpe, pode repetir? Não percebi o que disse. É que estou a aprender português e ainda tenho alguma dificuldade.',
          explanation: 'In EP rapid speech: "Desculpe" → [dʃkulp], "percebi" → [pɨrsɨbi], heavy vowel reduction. "Estou a aprender" = EP progressive (BR: "estou aprendendo").'
        }
      ],
      vocabulary: ['desculpe', 'perceber', 'dificuldade'],
      connectedSpeechFeatures: ['EP vowel reduction', 'estou a + infinitive (EP progressive)', 'é que (softening device)']
    },
  ],

  C1: [
    {
      id: 'c1-comp-conferencia',
      title: 'Conferência sobre sustentabilidade',
      type: 'comprehension',
      transcript: 'Caros colegas, gostaria de abordar hoje a questão da sustentabilidade urbana nos países lusófonos. As cidades brasileiras enfrentam desafios únicos: a expansão desenfreada das periferias, a carência de transporte público eficiente e a desigualdade no acesso a espaços verdes. Em contrapartida, cidades como Lisboa têm apostado na requalificação urbana e na mobilidade sustentável, embora o processo de gentrificação levante questões pertinentes sobre justiça social. É imprescindível que se adotem políticas integradas que contemplem tanto a dimensão ambiental como a social.',
      questions: [
        {
          question: 'Quais são os três desafios das cidades brasileiras mencionados?',
          answer: 'Expansão das periferias, carência de transporte público, desigualdade no acesso a espaços verdes',
          explanation: 'Three challenges: urban sprawl, lack of public transport, unequal access to green spaces.'
        },
        {
          question: 'Qual é o problema associado à requalificação em Lisboa?',
          answer: 'A gentrificação e questões de justiça social',
          explanation: '"O processo de gentrificação levante questões pertinentes sobre justiça social."'
        },
        {
          question: 'O que é que o orador considera imprescindível?',
          answer: 'Políticas integradas que contemplem a dimensão ambiental e social',
          explanation: '"É imprescindível que se adotem políticas integradas..."'
        }
      ],
      vocabulary: ['lusófonos', 'desenfreada', 'periferias', 'requalificação', 'gentrificação', 'imprescindível'],
      connectedSpeechFeatures: ['formal academic register', 'conjuntivo: que se adotem', 'complex subordination']
    },
    {
      id: 'c1-notetaking-historia',
      title: 'Aula: A expansão marítima portuguesa',
      type: 'note-taking',
      transcript: 'A expansão marítima portuguesa, iniciada no século XV sob o impulso do Infante D. Henrique, transformou radicalmente o mapa do mundo. Podemos identificar três fases principais: primeiro, a exploração da costa africana, que culminou na passagem do Cabo da Boa Esperança por Bartolomeu Dias em 1488. Segundo, a chegada à Índia por Vasco da Gama em 1498, que estabeleceu a rota marítima para o comércio de especiarias. Terceiro, o descobrimento do Brasil por Pedro Álvares Cabral em 1500, que expandiu dramaticamente o império português para o Novo Mundo.',
      questions: [
        {
          question: 'Organize the three phases with dates and key figures.',
          answer: '1. Costa africana — Bartolomeu Dias, Cabo da Boa Esperança, 1488; 2. Índia — Vasco da Gama, rota das especiarias, 1498; 3. Brasil — Pedro Álvares Cabral, 1500',
          explanation: 'Three phases clearly marked with "primeiro, segundo, terceiro" and specific dates/figures.'
        }
      ],
      vocabulary: ['expansão marítima', 'Infante D. Henrique', 'especiarias', 'descobrimento'],
      connectedSpeechFeatures: ['EP formal academic style', 'historical narrative register']
    },
  ],

  C2: [
    {
      id: 'c2-comp-literatura',
      title: 'Análise literária: Saramago',
      type: 'comprehension',
      transcript: 'A prosa de José Saramago caracteriza-se pela subversão das convenções narrativas. A ausência de pontuação convencional nos diálogos, onde as falas das personagens se entrelaçam num fluxo contínuo apenas demarcado por maiúsculas, obriga o leitor a uma participação ativa na construção do sentido. Em "Ensaio sobre a Cegueira", esta técnica ganha uma dimensão alegórica: à medida que as personagens perdem a visão, o próprio texto parece perder as suas fronteiras visuais, dissolvendo a distinção entre narrador e personagens, entre discurso direto e indireto.',
      questions: [
        {
          question: 'Qual é a principal característica estilística de Saramago mencionada?',
          answer: 'A ausência de pontuação convencional nos diálogos, com falas entrelaçadas em fluxo contínuo',
          explanation: 'The subversion of narrative conventions through absence of conventional punctuation in dialogue.'
        },
        {
          question: 'Que dimensão ganha esta técnica em "Ensaio sobre a Cegueira"?',
          answer: 'Uma dimensão alegórica — o texto perde fronteiras visuais assim como as personagens perdem a visão',
          explanation: 'The technique becomes allegorical: as characters lose sight, the text loses its visual boundaries.'
        }
      ],
      vocabulary: ['subversão', 'entrelaçam', 'demarcado', 'alegórica', 'dissolvendo'],
      connectedSpeechFeatures: ['literary/academic register', 'complex syntax', 'reflexive se: caracteriza-se, entrelaçam']
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

function findExercise(id) {
  return allExercises().find(e => e.id === id) || null;
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
    if (!p.sessions) p.sessions = [];
    return p;
  }

  setLevel(studentId, level) {
    level = level.toUpperCase();
    if (!core.CEFR.includes(level)) throw new Error('Invalid CEFR level: ' + level);
    const p = this.getProfile(studentId);
    p.level = level;
    core.saveProfile(this.dir, p);
    return { studentId, level, exercisesAvailable: exercisesForLevel(level).length };
  }

  listStudents() { return core.listProfiles(this.dir); }

  generateLesson(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = exercisesForLevel(level);
    const td = core.today();

    const due = [];
    const fresh = [];
    for (const ex of available) {
      const sk = p.skills[ex.id];
      if (!sk) { fresh.push(ex); continue; }
      if (sk.nextReview && sk.nextReview <= td) due.push(ex);
    }

    const reviewItems = core.pick(due, 2);
    const newItems = core.pick(fresh, 3);
    const exercises = [...reviewItems, ...newItems];

    return {
      studentId, level, date: td,
      reviewCount: reviewItems.length, newCount: newItems.length,
      exercises: exercises.map(e => ({
        id: e.id, title: e.title, type: e.type, level: e.level,
        transcript: e.transcript, questions: e.questions,
        vocabulary: e.vocabulary, connectedSpeechFeatures: e.connectedSpeechFeatures,
      })),
    };
  }

  generateExercise(studentId, type) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = exercisesForLevel(level);
    let filtered = type ? available.filter(e => e.type === type) : available;
    if (!filtered.length) filtered = available;
    const ex = core.pick(filtered, 1)[0];
    if (!ex) throw new Error('No exercises available');
    return {
      id: ex.id, title: ex.title, type: ex.type, level: ex.level,
      transcript: ex.transcript, questions: ex.questions,
      vocabulary: ex.vocabulary, connectedSpeechFeatures: ex.connectedSpeechFeatures,
    };
  }

  checkAnswer(studentId, exerciseId, answer, questionIndex) {
    const ex = findExercise(exerciseId);
    if (!ex) throw new Error('Unknown exercise: ' + exerciseId);
    const results = [];
    for (const q of ex.questions) {
      const correct = core.norm(answer).includes(core.norm(q.answer)) || core.norm(q.answer).includes(core.norm(answer));
      results.push({
        question: q.question,
        correct,
        expected: q.answer,
        explanation: q.explanation,
      });
    }
    return { exerciseId, results };
  }

  recordAssessment(studentId, exerciseId, score, total) {
    const ex = findExercise(exerciseId);
    if (!ex) throw new Error('Unknown exercise: ' + exerciseId);
    const s = parseInt(score, 10);
    const t = parseInt(total, 10);
    if (isNaN(s) || isNaN(t) || t <= 0) throw new Error('Score and total must be positive integers');

    const p = this.getProfile(studentId);
    const grade = s / t >= 0.9 ? 4 : s / t >= 0.7 ? 3 : s / t >= 0.5 ? 2 : 1;

    if (!p.skills[exerciseId]) {
      p.skills[exerciseId] = { stability: 1, difficulty: 5, lastReview: null, nextReview: null, attempts: [] };
    }
    const sk = p.skills[exerciseId];
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, grade);
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, grade);
    sk.lastReview = core.today();
    const interval = core.fsrsNextReview(sk.stability);
    const next = new Date();
    next.setDate(next.getDate() + interval);
    sk.nextReview = next.toISOString().slice(0, 10);
    sk.attempts.push({ score: s, total: t, date: core.today(), grade });

    p.assessments.push({ exerciseId, score: s, total: t, grade, date: core.today() });
    core.saveProfile(this.dir, p);

    return {
      studentId, exerciseId, score: s, total: t, grade,
      mastery: core.masteryLabel(core.calcMastery(sk.attempts)),
      nextReview: sk.nextReview, interval,
    };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = exercisesForLevel(level);
    const byType = {};
    for (const ex of available) {
      if (!byType[ex.type]) byType[ex.type] = { total: 0, studied: 0, mastered: 0 };
      byType[ex.type].total++;
      const sk = p.skills[ex.id];
      if (sk) {
        byType[ex.type].studied++;
        const m = core.calcMastery(sk.attempts);
        if (m >= core.MASTERY_THRESHOLD) byType[ex.type].mastered++;
      }
    }
    return { studentId, level, byType };
  }

  getNextExercises(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = exercisesForLevel(level);
    const td = core.today();
    const due = [];
    const unstarted = [];
    for (const ex of available) {
      const sk = p.skills[ex.id];
      if (!sk) { unstarted.push({ id: ex.id, title: ex.title, type: ex.type, level: ex.level }); continue; }
      if (sk.nextReview && sk.nextReview <= td) {
        due.push({ id: ex.id, title: ex.title, type: ex.type, level: ex.level, nextReview: sk.nextReview });
      }
    }
    return { studentId, date: td, due, unstarted: unstarted.slice(0, 5), totalDue: due.length, totalUnstarted: unstarted.length };
  }

  getReport(studentId) {
    const progress = this.getProgress(studentId);
    const next = this.getNextExercises(studentId);
    const p = this.getProfile(studentId);
    return {
      studentId, level: p.level || 'A1',
      progress: progress.byType,
      dueForReview: next.totalDue,
      unstartedRemaining: next.totalUnstarted,
      recentAssessments: (p.assessments || []).slice(-10).reverse(),
    };
  }

  getExerciseCatalog(level) {
    const exercises = level ? exercisesForLevel(level) : allExercises();
    const byLevel = {};
    for (const ex of exercises) {
      if (!byLevel[ex.level]) byLevel[ex.level] = [];
      byLevel[ex.level].push({ id: ex.id, title: ex.title, type: ex.type });
    }
    return byLevel;
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new ListeningTutor();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const id = args[1]; if (!id) throw new Error('Usage: start <studentId> [level]');
      const p = tutor.getProfile(id);
      if (args[2] && core.CEFR.includes(args[2].toUpperCase())) { p.level = args[2].toUpperCase(); }
      core.saveProfile(tutor.dir, p);
      out({ status: 'ok', studentId: id, level: p.level || 'A1' });
      break;
    }
    case 'set-level': {
      const id = args[1], lvl = args[2];
      if (!id || !lvl) throw new Error('Usage: set-level <studentId> <A1-C2>');
      out(tutor.setLevel(id, lvl.toUpperCase()));
      break;
    }
    case 'lesson': {
      const id = args[1]; if (!id) throw new Error('Usage: lesson <studentId>');
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
      if (!id || !exId) throw new Error('Usage: check <studentId> <exerciseId> <answer>');
      out(tutor.checkAnswer(id, exId, answer, parseInt(args[4], 10) || null));
      break;
    }
    case 'record': {
      const id = args[1], exId = args[2], score = args[3], total = args[4];
      if (!id || !exId || score == null || total == null) throw new Error('Usage: record <studentId> <exerciseId> <score> <total>');
      out(tutor.recordAssessment(id, exId, score, total));
      break;
    }
    case 'progress': {
      const id = args[1]; if (!id) throw new Error('Usage: progress <studentId>');
      out(tutor.getProgress(id));
      break;
    }
    case 'report': {
      const id = args[1]; if (!id) throw new Error('Usage: report <studentId>');
      out(tutor.getReport(id));
      break;
    }
    case 'next': {
      const id = args[1]; if (!id) throw new Error('Usage: next <studentId>');
      out(tutor.getNextExercises(id));
      break;
    }
    case 'exercises': {
      const lvl = args[1] || null;
      out(tutor.getExerciseCatalog(lvl ? lvl.toUpperCase() : null));
      break;
    }
    case 'students': {
      out({ students: tutor.listStudents() });
      break;
    }
    case 'help':
      out({ commands: ['start','set-level','lesson','exercise','check','record','progress','report','next','exercises','students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + cmd,
        commands: ['start','set-level','lesson','exercise','check','record','progress','report','next','exercises','students'],
      });
  }
});

module.exports = { ListeningTutor, EXERCISES };
