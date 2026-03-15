const core = require('../_lib/core');

const SKILL_NAME = 'portuguese-writing';

// ── Correction categories ──────────────────────────────────────────────────
const CORRECTION_CATEGORIES = [
  'gender', 'agreement', 'ser-estar-ficar', 'tense',
  'conjuntivo', 'por-para', 'personal-infinitive',
  'clitic-placement', 'spelling', 'punctuation',
];

// ── Prompts by CEFR level ──────────────────────────────────────────────────
const PROMPTS = {
  A1: [
    {
      id: 'a1-personal-1', category: 'personal', title: 'Postal das férias',
      type: 'postcard',
      instructions: 'Escreva um postal a um amigo de um lugar de férias. Inclua: onde está, como está o tempo, o que faz todos os dias. (30-50 palavras)',
      targetStructures: ['present tense regular verbs', 'estar + location', 'fazer for weather'],
      rubric: {
        content: 'Mentions location, weather, and daily activity',
        grammar: 'Correct present tense conjugation of regular -ar/-er/-ir verbs',
        vocabulary: 'Basic travel and weather words used appropriately',
        organization: 'Greeting, body, farewell structure',
      },
      modelResponse: 'Querido Paulo: Estou em Salvador. Faz muito sol e calor. Todos os dias vou à praia e como acarajé. A cidade é muito bonita. Até breve! Ana',
    },
    {
      id: 'a1-personal-2', category: 'personal', title: 'A minha família',
      type: 'description',
      instructions: 'Descreva a sua família. Inclua: nomes, idades, profissões e algo que gostam de fazer. (40-60 palavras)',
      targetStructures: ['ser for descriptions', 'ter for age', 'possessive adjectives'],
      rubric: {
        content: 'Names at least 3 family members with details',
        grammar: 'Correct use of ser/ter; gender agreement with adjectives',
        vocabulary: 'Family terms, numbers, professions',
        organization: 'Logical grouping of family members',
      },
      modelResponse: 'A minha família é pequena. O meu pai chama-se Carlos e tem 45 anos. É professor. A minha mãe chama-se Maria e tem 42 anos. É médica. A minha irmã Ana tem 12 anos. É estudante. Aos fins de semana gostamos de ir ao parque.',
    },
    {
      id: 'a1-formal-1', category: 'formal', title: 'Reserva de hotel',
      type: 'email',
      instructions: 'Escreva um email curto para reservar um quarto de hotel. Inclua: datas, tipo de quarto, número de pessoas. (30-50 palavras)',
      targetStructures: ['querer/precisar + infinitive', 'numbers and dates', 'formal o senhor/a senhora'],
      rubric: {
        content: 'Includes dates, room type, number of guests',
        grammar: 'Correct formal register; querer + infinitive',
        vocabulary: 'Hotel vocabulary: quarto, reserva, noite',
        organization: 'Greeting, request, sign-off',
      },
      modelResponse: 'Caro senhor: Gostaria de reservar um quarto duplo para duas pessoas de 15 a 20 de junho. Quanto custa por noite? Obrigado pela atenção. Com os melhores cumprimentos, Pedro Santos',
    },
    {
      id: 'a1-creative-1', category: 'creative', title: 'O meu dia perfeito',
      type: 'narrative',
      instructions: 'Descreva o seu dia perfeito desde a manhã até à noite. Use expressões de tempo. (40-60 palavras)',
      targetStructures: ['time expressions', 'reflexive verbs', 'present tense sequence'],
      rubric: {
        content: 'Covers morning, afternoon, and evening with activities',
        grammar: 'Correct reflexive verb forms; time expressions',
        vocabulary: 'Daily routine vocabulary',
        organization: 'Chronological order with time markers',
      },
      modelResponse: 'De manhã acordo às nove. Tomo o café da manhã com a família. Às onze vou à praia. À tarde como num restaurante italiano. À noite passeio pela cidade e tomo um sorvete. Deito-me às onze. É perfeito!',
    },
  ],
  A2: [
    {
      id: 'a2-personal-1', category: 'personal', title: 'O meu último fim de semana',
      type: 'narrative',
      instructions: 'Conte o que fez no fim de semana passado. Inclua pelo menos 4 atividades e diga com quem esteve. (60-80 palavras)',
      targetStructures: ['pretérito perfeito regular', 'time markers: no sábado, depois, a seguir'],
      rubric: {
        content: 'At least 4 activities with companions mentioned',
        grammar: 'Correct preterite forms of regular and common irregular verbs',
        vocabulary: 'Leisure activities, time connectors',
        organization: 'Chronological narrative with connectors',
      },
      modelResponse: 'No sábado de manhã fui ao mercado com a minha mãe e comprámos fruta fresca. Depois almoçámos em casa da minha avó. À tarde joguei futebol com os meus amigos no parque. No domingo levantei-me tarde. Depois estudei português e à noite vi um filme com o meu irmão. Foi um fim de semana muito divertido.',
    },
    {
      id: 'a2-personal-2', category: 'personal', title: 'Carta a um amigo',
      type: 'letter',
      instructions: 'Escreva uma carta informal a um novo amigo. Apresente-se, fale dos seus gostos e pergunte sobre os dele. (70-90 palavras)',
      targetStructures: ['gostar de', 'indirect object pronouns', 'question formation'],
      rubric: {
        content: 'Self-introduction, likes/dislikes, questions to the friend',
        grammar: 'Correct gostar de structure',
        vocabulary: 'Hobbies, interests, personality adjectives',
        organization: 'Informal letter format with greeting and questions',
      },
      modelResponse: 'Olá Marco: Chamo-me Lúcia e tenho 16 anos. Moro em Coimbra, uma cidade muito bonita no centro de Portugal. Adoro música e toco guitarra. Também gosto muito de ler romances de aventura. Não gosto nada de desporto — é muito chato! E tu? O que gostas de fazer nos tempos livres? Gostas de música? Espero a tua resposta. Um abraço, Lúcia',
    },
    {
      id: 'a2-formal-1', category: 'formal', title: 'Reclamação sobre um produto',
      type: 'email',
      instructions: 'Escreva um email de reclamação porque comprou um produto que chegou partido. Explique o que aconteceu e o que quer que façam. (60-80 palavras)',
      targetStructures: ['preterite for narrating events', 'conditional for polite requests'],
      rubric: {
        content: 'States problem clearly, explains what happened, requests solution',
        grammar: 'Preterite narration; conditional for requests',
        vocabulary: 'Shopping and complaint vocabulary',
        organization: 'Formal email structure',
      },
      modelResponse: 'Exmo. Senhor: Comprei um telemóvel no vosso site no dia 5 de março. Quando chegou, o ecrã estava partido. Gostaria de solicitar a substituição do produto ou o reembolso do valor pago. Junto envio fotos do produto danificado. Agradeço a vossa resposta o mais breve possível. Com os melhores cumprimentos, Ana Santos',
    },
  ],
  B1: [
    {
      id: 'b1-personal-1', category: 'personal', title: 'Uma experiência marcante',
      type: 'narrative',
      instructions: 'Conte uma experiência que o/a marcou muito (viagem, encontro, desafio). Use perfeito e imperfeito para criar a narrativa. (100-130 palavras)',
      targetStructures: ['perfeito vs imperfeito', 'connectors: enquanto, quando, depois, por isso'],
      rubric: {
        content: 'Clear narrative with setting, complication, resolution',
        grammar: 'Appropriate use of perfeito and imperfeito',
        vocabulary: 'Narrative vocabulary, emotions, descriptions',
        organization: 'Chronological structure with clear paragraphs',
      },
      modelResponse: 'Quando eu tinha quinze anos, a minha família mudou-se para o Brasil. No início estava muito nervoso porque não conhecia ninguém. O primeiro dia na escola nova foi difícil — todos falavam muito rápido e eu não percebia tudo. Mas depois conheci o João, que se sentou ao meu lado e me ajudou com tudo. Pouco a pouco fiz mais amigos e comecei a sentir-me em casa. Essa experiência ensinou-me que a mudança pode ser assustadora, mas também pode trazer coisas maravilhosas.',
    },
    {
      id: 'b1-academic-1', category: 'academic', title: 'Vantagens e desvantagens',
      type: 'essay',
      instructions: 'Escreva sobre as vantagens e desvantagens de viver numa cidade grande. Use conectores e expresse a sua opinião. (120-150 palavras)',
      targetStructures: ['opinion expressions: na minha opinião, penso que, parece-me que', 'comparatives', 'connectors: por um lado/por outro lado, além disso, no entanto'],
      rubric: {
        content: 'At least 2 advantages and 2 disadvantages with personal opinion',
        grammar: 'Correct use of connectors and opinion structures',
        vocabulary: 'Urban life vocabulary',
        organization: 'Introduction, advantages, disadvantages, conclusion',
      },
      modelResponse: 'Viver numa cidade grande tem vantagens e desvantagens. Por um lado, há mais oportunidades de emprego e uma maior oferta cultural. Além disso, o transporte público é geralmente melhor. Por outro lado, o custo de vida é mais alto e o stress do dia a dia pode afetar a saúde. No entanto, na minha opinião, as vantagens superam as desvantagens. Penso que a diversidade e as oportunidades que uma cidade grande oferece são muito importantes, especialmente para os jovens. Contudo, cada pessoa deve avaliar o que é mais importante para si.',
    },
  ],
  B2: [
    {
      id: 'b2-academic-1', category: 'academic', title: 'Redação argumentativa',
      type: 'essay',
      instructions: 'Escreva uma redação sobre o seguinte tema: "As redes sociais aproximam ou afastam as pessoas?" Apresente argumentos a favor e contra, e conclua com a sua posição. (180-220 palavras)',
      targetStructures: ['conjuntivo with expressions of doubt/opinion', 'passive voice', 'advanced connectors: embora, apesar de, contudo'],
      rubric: {
        content: 'Balanced argumentation with clear thesis and conclusion',
        grammar: 'Correct subjunctive use, passive voice, complex sentences',
        vocabulary: 'Academic and technology vocabulary',
        organization: 'Introduction with thesis, body paragraphs, conclusion',
      },
      modelResponse: 'As redes sociais transformaram radicalmente a forma como comunicamos. Embora muitos argumentem que estas plataformas nos aproximam, creio que a realidade é mais complexa. Por um lado, é inegável que as redes sociais permitem que mantenhamos contacto com pessoas que vivem longe. Graças a estas ferramentas, famílias separadas pela emigração podem comunicar diariamente. Contudo, estudos recentes sugerem que o uso excessivo de redes sociais está associado a sentimentos de solidão e ansiedade. É possível que, ao investirmos tanto tempo em conexões virtuais, negligenciemos as relações presenciais. Além disso, a comunicação online carece da riqueza da interação face a face. Em conclusão, considero que as redes sociais são ferramentas neutras — o impacto depende do uso que lhes damos. É fundamental que aprendamos a equilibrar o mundo digital com as relações reais.',
    },
    {
      id: 'b2-formal-1', category: 'formal', title: 'Carta de candidatura',
      type: 'formal-letter',
      instructions: 'Escreva uma carta de candidatura para um estágio numa empresa portuguesa. Apresente a sua formação, experiência e motivação. (150-200 palavras)',
      targetStructures: ['formal register', 'conditional for politeness', 'personal infinitive'],
      rubric: {
        content: 'Qualifications, experience, motivation clearly stated',
        grammar: 'Formal register consistent, conditional forms, correct agreement',
        vocabulary: 'Professional vocabulary',
        organization: 'Formal letter structure with proper openings/closings',
      },
      modelResponse: 'Exmo. Senhor Diretor de Recursos Humanos: Venho por este meio apresentar a minha candidatura ao estágio de comunicação, conforme anunciado no vosso site. Sou licenciada em Jornalismo pela Universidade de Coimbra. Durante os meus estudos, tive a oportunidade de realizar um estágio no jornal Público, onde desenvolvi competências em redação e edição. Domino o português e o inglês e tenho conhecimentos avançados de espanhol. Considero que a vossa empresa seria o ambiente ideal para aprofundar a minha experiência profissional. Estou disponível para iniciar em qualquer momento e gostaria de ter a oportunidade de apresentar a minha candidatura pessoalmente. Aguardo a vossa resposta com expectativa. Com os melhores cumprimentos, Maria Silva',
    },
  ],
  C1: [
    {
      id: 'c1-academic-1', category: 'academic', title: 'Ensaio académico',
      type: 'essay',
      instructions: 'Escreva um ensaio sobre o seguinte tema: "O papel da língua portuguesa no mundo globalizado." Analise criticamente, usando fontes hipotéticas. (250-300 palavras)',
      targetStructures: ['academic register', 'impersonal constructions', 'complex subordination', 'discourse markers'],
      rubric: {
        content: 'Critical analysis with thesis, evidence, counterargument',
        grammar: 'Academic register, complex sentences, correct subjunctive',
        vocabulary: 'Academic discourse vocabulary',
        organization: 'Introduction, thesis, body with evidence, conclusion',
      },
      modelResponse: 'O português, falado por mais de 250 milhões de pessoas em todos os continentes, ocupa uma posição estratégica no panorama linguístico global. Não obstante, o seu estatuto internacional permanece aquém do seu potencial demográfico. O presente ensaio analisa os fatores que condicionam a projeção internacional da língua portuguesa. Em primeiro lugar, importa reconhecer que a fragmentação entre as normas brasileira e europeia constitui simultaneamente uma riqueza e um obstáculo. Embora o Acordo Ortográfico de 1990 tenha procurado mitigar esta situação, a sua implementação desigual comprometeu parcialmente os seus objetivos. Por outro lado, o crescimento demográfico dos países africanos lusófonos — cuja população poderá ultrapassar os 500 milhões em 2100 — sugere que o futuro da língua se jogará sobretudo em África. Contudo, para que este potencial se concretize, é imprescindível que se invista no ensino e na literacia. Em suma, a língua portuguesa possui todos os requisitos para se afirmar como língua global. Para tal, será necessário superar divergências normativas e investir estrategicamente na educação.',
    },
  ],
  C2: [
    {
      id: 'c2-creative-1', category: 'creative', title: 'Crónica literária',
      type: 'chronicle',
      instructions: 'Escreva uma crónica sobre um momento quotidiano que revele algo profundo sobre a condição humana. Estilo livre, tom reflexivo. (250-350 palavras)',
      targetStructures: ['literary style', 'metaphor and imagery', 'varied sentence structure', 'register mastery'],
      rubric: {
        content: 'Everyday observation with philosophical depth',
        grammar: 'Flawless grammar across all structures',
        vocabulary: 'Rich, varied, literary vocabulary',
        organization: 'Free but deliberate structure with narrative arc',
      },
      modelResponse: 'Há uma velha que se senta todos os dias no banco do jardim, em frente ao chafariz que já não deita água. Chega sempre às dez, com um saco de plástico do supermercado cheio de migalhas de pão. Os pombos já a conhecem. Mal se senta, rodeiam-na como fiéis que se aproximam do altar. Ela distribui as migalhas com uma precisão que sugere décadas de prática. Nunca vi ninguém falar com ela. Uma vez sentei-me no banco ao lado e tentei um cumprimento. "Bom dia." Olhou-me como quem mede a distância entre a educação e a intrusão. "Bom dia", devolveu, sem mais. E continuou a alimentar os pombos. Pensei que talvez aquele ritual fosse a sua forma de dizer ao mundo que ainda estava ali, que ainda tinha algo para dar. Ou talvez fosse apenas uma velha a dar de comer a pombos, e eu é que insistia em ver sentido onde havia apenas hábito. É esta a nossa maldição de contadores de histórias: não sabemos olhar sem narrar.',
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
    if (!p.skills) p.skills = {};
    if (!p.assessments) p.assessments = [];
    if (!p.sessions) p.sessions = [];
    for (const cat of CORRECTION_CATEGORIES) {
      if (!p.skills[cat]) p.skills[cat] = { errors: 0, total: 0, lastSeen: null };
    }
    return p;
  }

  setLevel(id, level) {
    if (!core.CEFR.includes(level)) throw new Error('Invalid CEFR level');
    const p = this.getProfile(id);
    p.level = level;
    core.saveProfile(this.dir, p);
    return { studentId: id, level };
  }

  listStudents() { return core.listProfiles(this.dir); }

  generatePrompt(id, category) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const prompts = PROMPTS[level] || PROMPTS.A1;
    let filtered = category ? prompts.filter(pr => pr.category === category) : prompts;
    if (!filtered.length) filtered = prompts;
    const prompt = core.pick(filtered, 1)[0];
    return {
      studentId: id, level,
      prompt: {
        id: prompt.id, category: prompt.category, title: prompt.title, type: prompt.type,
        instructions: prompt.instructions, targetStructures: prompt.targetStructures,
      },
    };
  }

  getRubric(promptId) {
    for (const level of core.CEFR) {
      const prompts = PROMPTS[level] || [];
      const found = prompts.find(p => p.id === promptId);
      if (found) return { promptId, title: found.title, rubric: found.rubric, modelResponse: found.modelResponse };
    }
    throw new Error('Unknown prompt: ' + promptId);
  }

  recordAssessment(id, promptId, content, grammar, vocab, org, corrections) {
    const p = this.getProfile(id);
    const c = parseInt(content, 10), g = parseInt(grammar, 10), v = parseInt(vocab, 10), o = parseInt(org, 10);
    if ([c, g, v, o].some(x => isNaN(x) || x < 1 || x > 5)) throw new Error('Scores must be 1-5');

    const assessment = {
      promptId, date: core.today(),
      scores: { content: c, grammar: g, vocabulary: v, organization: o },
      average: Math.round((c + g + v + o) / 4 * 10) / 10,
      corrections: corrections || [],
    };

    // Update correction category tracking
    if (corrections && Array.isArray(corrections)) {
      for (const corr of corrections) {
        if (corr.category && p.skills[corr.category]) {
          p.skills[corr.category].errors++;
          p.skills[corr.category].total++;
          p.skills[corr.category].lastSeen = core.today();
        }
      }
    }

    p.assessments.push(assessment);
    core.saveProfile(this.dir, p);

    return { studentId: id, ...assessment };
  }

  getProgress(id) {
    const p = this.getProfile(id);
    const categories = {};
    for (const cat of CORRECTION_CATEGORIES) {
      const sk = p.skills[cat];
      categories[cat] = {
        errors: sk.errors,
        total: sk.total,
        errorRate: sk.total > 0 ? Math.round(sk.errors / sk.total * 100) + '%' : 'N/A',
        lastSeen: sk.lastSeen,
      };
    }
    const avgScores = {};
    if (p.assessments.length > 0) {
      const last = p.assessments.slice(-5);
      avgScores.content = Math.round(last.reduce((s, a) => s + a.scores.content, 0) / last.length * 10) / 10;
      avgScores.grammar = Math.round(last.reduce((s, a) => s + a.scores.grammar, 0) / last.length * 10) / 10;
      avgScores.vocabulary = Math.round(last.reduce((s, a) => s + a.scores.vocabulary, 0) / last.length * 10) / 10;
      avgScores.organization = Math.round(last.reduce((s, a) => s + a.scores.organization, 0) / last.length * 10) / 10;
    }
    return { studentId: id, level: p.level || 'A1', totalAssessments: p.assessments.length, averageScores: avgScores, correctionCategories: categories };
  }

  getReport(id) {
    const progress = this.getProgress(id);
    const p = this.getProfile(id);
    // Find weakest categories
    const weakest = CORRECTION_CATEGORIES
      .filter(c => p.skills[c].total > 0)
      .sort((a, b) => (p.skills[b].errors / p.skills[b].total) - (p.skills[a].errors / p.skills[a].total))
      .slice(0, 3);
    return {
      ...progress,
      weakestCategories: weakest,
      recommendation: weakest.length > 0
        ? `Focus on: ${weakest.join(', ')}. These categories show the most errors.`
        : 'Keep writing! More data needed for personalized recommendations.',
      recentAssessments: (p.assessments || []).slice(-5).reverse(),
    };
  }

  getPromptCatalog(level) {
    if (level) return { [level]: (PROMPTS[level] || []).map(p => ({ id: p.id, title: p.title, category: p.category, type: p.type })) };
    const catalog = {};
    for (const l of core.CEFR) {
      if (PROMPTS[l]) catalog[l] = PROMPTS[l].map(p => ({ id: p.id, title: p.title, category: p.category, type: p.type }));
    }
    return catalog;
  }
}

// ── CLI ─────────────────────────────────────────────────────────────────────

const tutor = new WritingTutor();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const id = args[1]; if (!id) throw new Error('Usage: start <id> [level]');
      const p = tutor.getProfile(id);
      if (args[2] && core.CEFR.includes(args[2].toUpperCase())) p.level = args[2].toUpperCase();
      core.saveProfile(tutor.dir, p);
      out({ status: 'ok', studentId: id, level: p.level || 'A1' });
      break;
    }
    case 'set-level': { const id = args[1], lvl = args[2]; if (!id || !lvl) throw new Error('Usage: set-level <id> <A1-C2>'); out(tutor.setLevel(id, lvl.toUpperCase())); break; }
    case 'prompt': { const id = args[1], cat = args[2] || null; if (!id) throw new Error('Usage: prompt <id> [category]'); out(tutor.generatePrompt(id, cat)); break; }
    case 'rubric': { const pid = args[1]; if (!pid) throw new Error('Usage: rubric <promptId>'); out(tutor.getRubric(pid)); break; }
    case 'record': {
      const id = args[1], pid = args[2], c = args[3], g = args[4], v = args[5], o = args[6];
      let corrections = null;
      if (args[7]) { try { corrections = JSON.parse(args.slice(7).join(' ')); } catch {} }
      if (!id || !pid || !c || !g || !v || !o) throw new Error('Usage: record <id> <promptId> <content> <grammar> <vocab> <org> [corrections-json]');
      out(tutor.recordAssessment(id, pid, c, g, v, o, corrections));
      break;
    }
    case 'progress': { const id = args[1]; if (!id) throw new Error('Usage: progress <id>'); out(tutor.getProgress(id)); break; }
    case 'report': { const id = args[1]; if (!id) throw new Error('Usage: report <id>'); out(tutor.getReport(id)); break; }
    case 'prompts': { const lvl = args[1] || null; out(tutor.getPromptCatalog(lvl ? lvl.toUpperCase() : null)); break; }
    case 'students': { out({ students: tutor.listStudents() }); break; }

    case 'help': out({ info: 'Use one of the commands listed in SKILL.md' }); break;
    default: out({ error: 'Unknown command: ' + cmd, commands: ['start','set-level','prompt','rubric','record','progress','report','prompts','students'] });
  }
});

module.exports = { WritingTutor, PROMPTS, CORRECTION_CATEGORIES };
