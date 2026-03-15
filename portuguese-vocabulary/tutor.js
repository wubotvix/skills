// Portuguese Vocabulary Tutor — complete implementation with embedded data
// Usage: node tutor.js <command> [args...]
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'portuguese-vocabulary';
const MAX_NEW_PER_SESSION = 7;

// ─── Embedded Word Banks by CEFR Level ───────────────────────────────────────

const WORD_BANKS = {
  A1: [
    // Greetings
    { word: 'olá', article: null, category: 'greetings', definition: 'hello',
      exampleSentence: 'Olá, como vai?', collocations: ['olá a todos', 'dizer olá'], falseFriends: null },
    { word: 'tchau', article: null, category: 'greetings', definition: 'bye',
      exampleSentence: 'Tchau, até amanhã!', collocations: ['dar tchau', 'tchau tchau'], falseFriends: null },
    { word: 'bom dia', article: null, category: 'greetings', definition: 'good morning',
      exampleSentence: 'Bom dia, senhora Garcia.', collocations: ['dar bom dia'], falseFriends: null },
    { word: 'obrigado', article: null, category: 'greetings', definition: 'thank you (said by male)',
      exampleSentence: 'Muito obrigado pela sua ajuda.', collocations: ['muito obrigado', 'obrigado por'], falseFriends: null },
    // Food
    { word: 'água', article: 'a', category: 'food', definition: 'water',
      exampleSentence: 'A água está muito fria.', collocations: ['água mineral', 'copo de água', 'água com gás'], falseFriends: null },
    { word: 'pão', article: 'o', category: 'food', definition: 'bread',
      exampleSentence: 'Compro o pão na padaria.', collocations: ['pão com manteiga', 'pão integral', 'pão francês'], falseFriends: null },
    { word: 'leite', article: 'o', category: 'food', definition: 'milk',
      exampleSentence: 'Tomo o leite no café da manhã.', collocations: ['leite integral', 'leite desnatado', 'café com leite'], falseFriends: null },
    { word: 'maçã', article: 'a', category: 'food', definition: 'apple',
      exampleSentence: 'A maçã vermelha é muito doce.', collocations: ['suco de maçã', 'torta de maçã'], falseFriends: null },
    // Family
    { word: 'mãe', article: 'a', category: 'family', definition: 'mother',
      exampleSentence: 'Minha mãe cozinha muito bem.', collocations: ['língua mãe', 'dia das mães'], falseFriends: null },
    { word: 'pai', article: 'o', category: 'family', definition: 'father',
      exampleSentence: 'Meu pai trabalha num hospital.', collocations: ['pai de família', 'dia dos pais'], falseFriends: null },
    { word: 'irmão', article: 'o', category: 'family', definition: 'brother',
      exampleSentence: 'Meu irmão mais velho se chama Carlos.', collocations: ['irmão menor', 'irmão gêmeo'], falseFriends: null },
    { word: 'amigo', article: 'o', category: 'family', definition: 'friend',
      exampleSentence: 'Meu amigo mora perto da minha casa.', collocations: ['melhor amigo', 'amigo íntimo', 'fazer amigos'], falseFriends: null },
    // Everyday objects
    { word: 'casa', article: 'a', category: 'everyday', definition: 'house',
      exampleSentence: 'A casa tem um jardim grande.', collocations: ['dona de casa', 'em casa', 'casa própria'], falseFriends: null },
    { word: 'livro', article: 'o', category: 'everyday', definition: 'book',
      exampleSentence: 'Leio um livro por semana.', collocations: ['livro didático', 'livro de bolso'], falseFriends: { en: 'library (which is "biblioteca")' } },
    { word: 'mesa', article: 'a', category: 'everyday', definition: 'table',
      exampleSentence: 'A mesa da sala de jantar é de madeira.', collocations: ['pôr a mesa', 'mesa redonda', 'mesa de cabeceira'], falseFriends: null },
    { word: 'rua', article: 'a', category: 'everyday', definition: 'street',
      exampleSentence: 'A rua está cheia de gente.', collocations: ['rua principal', 'atravessar a rua', 'na rua'], falseFriends: null },
    // Time
    { word: 'dia', article: 'o', category: 'time', definition: 'day',
      exampleSentence: 'Hoje é um dia muito bonito.', collocations: ['todos os dias', 'bom dia', 'dia útil'], falseFriends: null },
    { word: 'noite', article: 'a', category: 'time', definition: 'night',
      exampleSentence: 'A noite é muito tranquila aqui.', collocations: ['boa noite', 'à noite', 'de noite'], falseFriends: null },
    { word: 'hoje', article: null, category: 'time', definition: 'today',
      exampleSentence: 'Hoje vamos ao parque.', collocations: ['hoje em dia', 'hoje à noite'], falseFriends: null },
    { word: 'grande', article: null, category: 'adjectives', definition: 'big / large',
      exampleSentence: 'Esta cidade é muito grande.', collocations: ['em grande', 'grande parte'], falseFriends: null },
  ],

  A2: [
    // Travel
    { word: 'bagagem', article: 'a', category: 'travel', definition: 'luggage / baggage',
      exampleSentence: 'Minha bagagem pesa demais.', collocations: ['bagagem de mão', 'despachar a bagagem', 'retirar a bagagem'], falseFriends: null },
    { word: 'passagem', article: 'a', category: 'travel', definition: 'ticket (BR) / passage',
      exampleSentence: 'Preciso comprar uma passagem de avião.', collocations: ['passagem de ida', 'passagem de ida e volta', 'comprar passagem'],
      falseFriends: { note: 'In PT, "bilhete" is more common for ticket' } },
    { word: 'estação', article: 'a', category: 'travel', definition: 'station / season',
      exampleSentence: 'A estação de ônibus fica longe.', collocations: ['estação de trem', 'estação do ano'],
      falseFriends: { note: 'BR: estação de trem/ônibus; PT: estação de comboio/autocarros' } },
    { word: 'mala', article: 'a', category: 'travel', definition: 'suitcase',
      exampleSentence: 'Vou fazer a mala esta noite.', collocations: ['fazer a mala', 'mala de viagem'], falseFriends: null },
    // Food (expanded)
    { word: 'carne', article: 'a', category: 'food', definition: 'meat',
      exampleSentence: 'A carne de boi é minha favorita.', collocations: ['carne de porco', 'carne moída', 'churrasco de carne'], falseFriends: null },
    { word: 'peixe', article: 'o', category: 'food', definition: 'fish',
      exampleSentence: 'O peixe fresco é mais saboroso.', collocations: ['peixe grelhado', 'peixe frito', 'bacalhau'], falseFriends: null },
    { word: 'conta', article: 'a', category: 'food', definition: 'bill / check (at restaurant); account',
      exampleSentence: 'A conta, por favor.', collocations: ['pedir a conta', 'conta bancária', 'levar em conta', 'dar-se conta'],
      falseFriends: { en: 'count (verb is "contar")' } },
    { word: 'gorjeta', article: 'a', category: 'food', definition: 'tip (gratuity)',
      exampleSentence: 'Deixamos uma gorjeta generosa.', collocations: ['dar gorjeta', 'deixar gorjeta'], falseFriends: null },
    // Shopping
    { word: 'loja', article: 'a', category: 'shopping', definition: 'store / shop',
      exampleSentence: 'A loja fecha às nove.', collocations: ['loja de roupa', 'ir às compras', 'loja online'], falseFriends: null },
    { word: 'preço', article: 'o', category: 'shopping', definition: 'price',
      exampleSentence: 'O preço da fruta subiu.', collocations: ['bom preço', 'preço fixo', 'pela metade do preço'], falseFriends: null },
    { word: 'dinheiro', article: 'o', category: 'shopping', definition: 'money',
      exampleSentence: 'Não tenho dinheiro suficiente.', collocations: ['ganhar dinheiro', 'economizar dinheiro', 'dinheiro vivo'], falseFriends: null },
    { word: 'barato', article: null, category: 'shopping', definition: 'cheap / inexpensive',
      exampleSentence: 'Este restaurante é muito barato.', collocations: ['sair barato', 'mais barato'], falseFriends: null },
    // Weather
    { word: 'chuva', article: 'a', category: 'weather', definition: 'rain',
      exampleSentence: 'A chuva não para desde ontem.', collocations: ['chuva forte', 'dia de chuva', 'debaixo de chuva'], falseFriends: null },
    { word: 'sol', article: 'o', category: 'weather', definition: 'sun',
      exampleSentence: 'Hoje faz muito sol.', collocations: ['tomar sol', 'óculos de sol', 'pôr do sol'], falseFriends: null },
    { word: 'frio', article: 'o', category: 'weather', definition: 'cold',
      exampleSentence: 'No inverno faz muito frio.', collocations: ['fazer frio', 'estar com frio', 'frio de rachar'], falseFriends: null },
    // Body / health
    { word: 'cabeça', article: 'a', category: 'health', definition: 'head',
      exampleSentence: 'Estou com dor de cabeça.', collocations: ['dor de cabeça', 'de cabeça', 'perder a cabeça'], falseFriends: null },
    { word: 'médico', article: 'o', category: 'health', definition: 'doctor',
      exampleSentence: 'Tenho consulta com o médico amanhã.', collocations: ['ir ao médico', 'médico de família'], falseFriends: null },
    { word: 'doente', article: null, category: 'health', definition: 'sick / ill',
      exampleSentence: 'Meu filho está doente hoje.', collocations: ['ficar doente', 'cair doente'], falseFriends: null },
    { word: 'receita', article: 'a', category: 'health', definition: 'prescription; recipe',
      exampleSentence: 'O médico me deu uma receita.', collocations: ['receita médica', 'receita de bolo'], falseFriends: null },
    { word: 'dor', article: 'a', category: 'health', definition: 'pain / ache',
      exampleSentence: 'Tenho uma dor forte nas costas.', collocations: ['dor de cabeça', 'dor de barriga', 'sentir dor'], falseFriends: null },
  ],

  B1: [
    // Work
    { word: 'empresa', article: 'a', category: 'work', definition: 'company / business',
      exampleSentence: 'Trabalho numa empresa de tecnologia.', collocations: ['empresa privada', 'montar uma empresa', 'empresa familiar'], falseFriends: null },
    { word: 'reunião', article: 'a', category: 'work', definition: 'meeting',
      exampleSentence: 'A reunião começa às dez.', collocations: ['ter uma reunião', 'sala de reuniões', 'marcar uma reunião'], falseFriends: null },
    { word: 'salário', article: 'o', category: 'work', definition: 'salary / wages',
      exampleSentence: 'Vão me dar um aumento de salário este ano.', collocations: ['salário fixo', 'receber o salário', 'salário mínimo'], falseFriends: null },
    { word: 'chefe', article: 'o', category: 'work', definition: 'boss',
      exampleSentence: 'Meu chefe é muito exigente mas justo.', collocations: ['chefe de departamento', 'chefe de estado'], falseFriends: null },
    { word: 'candidatura', article: 'a', category: 'work', definition: 'application / candidacy',
      exampleSentence: 'Enviei minha candidatura de emprego ontem.', collocations: ['candidatura de trabalho', 'preencher uma candidatura', 'apresentar uma candidatura'], falseFriends: null },
    // Emotions
    { word: 'esperança', article: 'a', category: 'emotions', definition: 'hope',
      exampleSentence: 'Tenho esperança de que tudo corra bem.', collocations: ['perder a esperança', 'ter esperança', 'raio de esperança'], falseFriends: null },
    { word: 'orgulhoso', article: null, category: 'emotions', definition: 'proud',
      exampleSentence: 'Estou muito orgulhoso da minha filha.', collocations: ['estar orgulhoso de', 'sentir-se orgulhoso'], falseFriends: null },
    { word: 'preocupado', article: null, category: 'emotions', definition: 'worried',
      exampleSentence: 'Estou preocupado com a prova.', collocations: ['estar preocupado com', 'andar preocupado'], falseFriends: null },
    { word: 'vergonha', article: 'a', category: 'emotions', definition: 'shame / embarrassment',
      exampleSentence: 'Tenho vergonha de falar em público.', collocations: ['ter vergonha', 'passar vergonha', 'sem-vergonha'],
      falseFriends: { en: 'Not "vengeance" (vingança)' } },
    // False friends cluster
    { word: 'êxito', article: 'o', category: 'abstract', definition: 'success',
      exampleSentence: 'O filme foi um grande êxito.', collocations: ['ter êxito', 'êxito absoluto', 'com êxito'],
      falseFriends: { en: '"exit" is "saída" in Portuguese' } },
    { word: 'realizar', article: null, category: 'abstract', definition: 'to carry out / accomplish',
      exampleSentence: 'Vamos realizar o projeto juntos.', collocations: ['realizar um estudo', 'realizar um sonho', 'realizar mudanças'],
      falseFriends: { en: '"to realize" (understand) is "perceber" or "dar-se conta"' } },
    { word: 'atual', article: null, category: 'abstract', definition: 'current / present',
      exampleSentence: 'A situação atual é complicada.', collocations: ['na atualidade', 'momento atual'],
      falseFriends: { en: '"actual" (real) is "real" or "verdadeiro"' } },
    { word: 'sensível', article: null, category: 'abstract', definition: 'sensitive',
      exampleSentence: 'Ela é uma pessoa muito sensível.', collocations: ['ser sensível a', 'tema sensível'],
      falseFriends: { en: '"sensible" (reasonable) is "sensato"' } },
    // Education
    { word: 'disciplina', article: 'a', category: 'education', definition: 'school subject / discipline',
      exampleSentence: 'Matemática é minha disciplina favorita.', collocations: ['disciplina escolar', 'passar na disciplina'], falseFriends: null },
    { word: 'apontamentos', article: 'os', category: 'education', definition: 'notes (class notes)',
      exampleSentence: 'Faço apontamentos em todas as aulas.', collocations: ['tirar apontamentos', 'passar a limpo'],
      falseFriends: { note: 'BR also uses "anotações"' } },
    { word: 'bolsa', article: 'a', category: 'education', definition: 'scholarship / grant; bag',
      exampleSentence: 'Consegui uma bolsa para estudar em Lisboa.', collocations: ['bolsa de estudos', 'bolsista/bolseiro'], falseFriends: null },
    // Daily life
    { word: 'costume', article: 'o', category: 'daily', definition: 'habit / custom',
      exampleSentence: 'Tenho o costume de passear depois do jantar.', collocations: ['ter o costume de', 'como de costume', 'por costume'],
      falseFriends: { en: '"costume" (clothing) is "fantasia" (BR) or "fato" (PT)' } },
    { word: 'mudar-se', article: null, category: 'daily', definition: 'to move (change residence)',
      exampleSentence: 'Mudámo-nos para São Paulo no mês passado.', collocations: ['mudar-se de casa', 'mudar-se de cidade'], falseFriends: null },
    { word: 'alugar', article: null, category: 'daily', definition: 'to rent',
      exampleSentence: 'Quero alugar um apartamento no centro.', collocations: ['alugar um apartamento', 'alugar um carro', 'apartamento para alugar'],
      falseFriends: { note: 'PT also uses "arrendar" for long-term rental' } },
  ],

  B2: [
    // Work (advanced)
    { word: 'demissão', article: 'a', category: 'work', definition: 'dismissal / resignation',
      exampleSentence: 'A demissão foi completamente inesperada.', collocations: ['carta de demissão', 'pedir demissão', 'demissão em massa'], falseFriends: null },
    { word: 'promoção', article: 'a', category: 'work', definition: 'promotion (at work); sale',
      exampleSentence: 'Depois de cinco anos, conseguiu uma promoção.', collocations: ['conseguir uma promoção', 'promoção no trabalho'], falseFriends: null },
    { word: 'desempenho', article: 'o', category: 'work', definition: 'performance',
      exampleSentence: 'O desempenho da equipe melhorou muito.', collocations: ['alto desempenho', 'desempenho acadêmico', 'melhorar o desempenho'], falseFriends: null },
    { word: 'empreendedor', article: 'o', category: 'work', definition: 'entrepreneur',
      exampleSentence: 'Ele é um empreendedor com muita visão.', collocations: ['espírito empreendedor', 'jovem empreendedor'], falseFriends: null },
    // Society
    { word: 'desigualdade', article: 'a', category: 'society', definition: 'inequality',
      exampleSentence: 'A desigualdade social continua sendo um problema.', collocations: ['desigualdade de gênero', 'combater a desigualdade'], falseFriends: null },
    { word: 'cidadania', article: 'a', category: 'society', definition: 'citizenship',
      exampleSentence: 'Pediu a cidadania portuguesa.', collocations: ['obter a cidadania', 'dupla cidadania', 'direitos de cidadania'], falseFriends: null },
    { word: 'manifestação', article: 'a', category: 'society', definition: 'demonstration / protest',
      exampleSentence: 'Houve uma manifestação pacífica na praça.', collocations: ['convocar uma manifestação', 'manifestação multitudinária'], falseFriends: null },
    { word: 'compromisso', article: 'o', category: 'society', definition: 'commitment / appointment',
      exampleSentence: 'O compromisso com o meio ambiente é fundamental.', collocations: ['assumir um compromisso', 'sem compromisso', 'compromisso social'], falseFriends: null },
    // Abstract
    { word: 'matiz', article: 'o', category: 'abstract', definition: 'nuance / shade',
      exampleSentence: 'Há um matiz importante nessa frase.', collocations: ['com matizes', 'sem matizes'], falseFriends: null },
    { word: 'colocar', article: null, category: 'abstract', definition: 'to place / to raise (a question)',
      exampleSentence: 'Quero colocar uma questão importante.', collocations: ['colocar um problema', 'colocar uma pergunta', 'colocar-se'], falseFriends: null },
    { word: 'imprescindível', article: null, category: 'abstract', definition: 'essential / indispensable',
      exampleSentence: 'O dicionário é imprescindível para este curso.', collocations: ['ser imprescindível', 'tornar-se imprescindível'], falseFriends: null },
    { word: 'aproveitar', article: null, category: 'abstract', definition: 'to take advantage of / make the most of',
      exampleSentence: 'Temos que aproveitar o bom tempo.', collocations: ['aproveitar a oportunidade', 'aproveitar o tempo', 'bom proveito!'], falseFriends: null },
    // False friends (B2)
    { word: 'esquisito', article: null, category: 'abstract', definition: 'strange / weird',
      exampleSentence: 'Que sabor esquisito tem esta comida!', collocations: ['parecer esquisito', 'ser esquisito'],
      falseFriends: { en: '"exquisite" is "requintado" or "primoroso"' } },
    { word: 'constipado', article: null, category: 'health', definition: 'having a cold (PT) / constipated (BR)',
      exampleSentence: 'Estou constipado, tenho muita tosse. (PT)', collocations: ['estar constipado', 'apanhar uma constipação'],
      falseFriends: { note: 'In PT "constipado" = common cold. In BR "constipado" = constipated. BR uses "resfriado" for cold.' } },
    { word: 'pasta', article: 'a', category: 'everyday', definition: 'folder / briefcase / paste',
      exampleSentence: 'Guarde os documentos na pasta azul.', collocations: ['pasta de arquivos', 'pasta de dentes'],
      falseFriends: { en: '"pasta" (food) is "massa" in Portuguese' } },
    // Environment
    { word: 'meio ambiente', article: 'o', category: 'environment', definition: 'environment (natural)',
      exampleSentence: 'Devemos proteger o meio ambiente.', collocations: ['proteger o meio ambiente', 'dano ao meio ambiente'], falseFriends: null },
    { word: 'sustentável', article: null, category: 'environment', definition: 'sustainable',
      exampleSentence: 'Precisamos de um desenvolvimento mais sustentável.', collocations: ['desenvolvimento sustentável', 'energia sustentável'], falseFriends: null },
    { word: 'recurso', article: 'o', category: 'environment', definition: 'resource',
      exampleSentence: 'Os recursos naturais são limitados.', collocations: ['recursos naturais', 'recursos humanos', 'recurso renovável'], falseFriends: null },
    { word: 'pegada', article: 'a', category: 'environment', definition: 'footprint / trace',
      exampleSentence: 'Devemos reduzir a nossa pegada de carbono.', collocations: ['pegada de carbono', 'pegada ecológica', 'deixar pegada'], falseFriends: null },
  ],

  C1: [
    // Academic / formal
    { word: 'âmbito', article: 'o', category: 'academic', definition: 'sphere / field / scope',
      exampleSentence: 'No âmbito da investigação, os resultados são promissores.', collocations: ['no âmbito de', 'âmbito profissional', 'âmbito académico'], falseFriends: null },
    { word: 'abordar', article: null, category: 'academic', definition: 'to address / to tackle',
      exampleSentence: 'É necessário abordar este tema com seriedade.', collocations: ['abordar um tema', 'abordar um problema'], falseFriends: null },
    { word: 'desempenhar', article: null, category: 'academic', definition: 'to perform / fulfill (a role)',
      exampleSentence: 'Desempenha um papel fundamental na empresa.', collocations: ['desempenhar um papel', 'desempenhar um cargo'], falseFriends: null },
    { word: 'abranger', article: null, category: 'academic', definition: 'to encompass / cover / span',
      exampleSentence: 'O estudo abrange um período de dez anos.', collocations: ['abranger um tema', 'abranger muito'], falseFriends: null },
    { word: 'transferir', article: null, category: 'academic', definition: 'to transfer / to convey',
      exampleSentence: 'É difícil transferir esta ideia para outro idioma.', collocations: ['transferir um conceito', 'transferir-se de cidade'], falseFriends: null },
    // Connectors
    { word: 'no entanto', article: null, category: 'connectors', definition: 'nevertheless / however',
      exampleSentence: 'O plano é arriscado; no entanto, vale a pena tentar.', collocations: ['no entanto'], falseFriends: null },
    { word: 'apesar de', article: null, category: 'connectors', definition: 'despite / in spite of',
      exampleSentence: 'Apesar das dificuldades, continuou em frente.', collocations: ['apesar de tudo', 'apesar de que'], falseFriends: null },
    { word: 'em contrapartida', article: null, category: 'connectors', definition: 'on the other hand',
      exampleSentence: 'Ele prefere cinema; ela, em contrapartida, prefere teatro.', collocations: [], falseFriends: null },
    // Idiomatic
    { word: 'contar com', article: null, category: 'idiomatic', definition: 'to count on / to have available',
      exampleSentence: 'Pode contar comigo para o que precisar.', collocations: ['contar com alguém', 'contar com recursos'], falseFriends: null },
    { word: 'dar por garantido', article: null, category: 'idiomatic', definition: 'to take for granted',
      exampleSentence: 'Não dê por garantido que tudo vai correr bem.', collocations: ['dar algo por garantido'], falseFriends: null },
    { word: 'tomar conta', article: null, category: 'idiomatic', definition: 'to take care of',
      exampleSentence: 'Ela tomou conta da situação imediatamente.', collocations: ['tomar conta de algo', 'tomar conta de alguém'], falseFriends: null },
    // Abstract
    { word: 'afã', article: 'o', category: 'abstract', definition: 'eagerness / zeal',
      exampleSentence: 'O seu afã de superação é admirável.', collocations: ['afã de superação', 'com afã'], falseFriends: null },
    { word: 'paulatino', article: null, category: 'abstract', definition: 'gradual',
      exampleSentence: 'Observa-se uma mudança paulatina nas atitudes.', collocations: ['de forma paulatina', 'mudança paulatina'], falseFriends: null },
    { word: 'desvincular', article: null, category: 'abstract', definition: 'to dissociate / separate',
      exampleSentence: 'É impossível desvincular a economia da política.', collocations: ['desvincular-se de', 'desvincular algo de algo'], falseFriends: null },
    { word: 'incontornável', article: null, category: 'abstract', definition: 'unavoidable / inescapable',
      exampleSentence: 'A reforma do sistema é uma tarefa incontornável.', collocations: ['responsabilidade incontornável', 'questão incontornável'], falseFriends: null },
    // Legal / formal
    { word: 'tramitar', article: null, category: 'formal', definition: 'to process (paperwork)',
      exampleSentence: 'Preciso tramitar a minha autorização de residência.', collocations: ['tramitar um visto', 'tramitar uma solicitação'], falseFriends: null },
    { word: 'vigente', article: null, category: 'formal', definition: 'in force / current / valid',
      exampleSentence: 'A lei vigente proíbe essa prática.', collocations: ['legislação vigente', 'norma vigente'], falseFriends: null },
    { word: 'deliberar', article: null, category: 'formal', definition: 'to deliberate / to rule',
      exampleSentence: 'O tribunal deliberou a favor do requerente.', collocations: ['deliberar sobre', 'deliberar uma sentença'], falseFriends: null },
    { word: 'rescindir', article: null, category: 'formal', definition: 'to rescind / cancel (a contract)',
      exampleSentence: 'A empresa decidiu rescindir o contrato.', collocations: ['rescindir um contrato', 'rescindir um acordo'], falseFriends: null },
  ],

  C2: [
    // Literary
    { word: 'mister', article: 'o', category: 'literary', definition: 'need / necessity (formal/archaic)',
      exampleSentence: 'É mister agir com prudência.', collocations: ['ser mister', 'haver mister'], falseFriends: null },
    { word: 'suceder', article: null, category: 'literary', definition: 'to happen / occur',
      exampleSentence: 'Os factos que sucederam naquele verão mudaram tudo.', collocations: ['suceder um evento'], falseFriends: null },
    { word: 'deslinde', article: 'o', category: 'literary', definition: 'demarcation / resolution',
      exampleSentence: 'O deslinde entre ambos os conceitos não é claro.', collocations: ['deslinde de responsabilidades'], falseFriends: null },
    { word: 'vislumbrar', article: null, category: 'literary', definition: 'to glimpse / to discern',
      exampleSentence: 'Pode-se vislumbrar uma mudança no horizonte político.', collocations: ['vislumbrar uma solução', 'vislumbrar o futuro'], falseFriends: null },
    // Colloquial BR
    { word: 'trampo', article: 'o', category: 'colloquial', definition: 'work / job (informal, BR)',
      exampleSentence: 'Passei o dia todo no trampo.', collocations: ['ir pro trampo', 'sair do trampo'], falseFriends: null },
    { word: 'legal', article: null, category: 'colloquial', definition: 'cool / nice (informal, BR)',
      exampleSentence: 'Esse filme é muito legal!', collocations: ['que legal', 'ser legal'], falseFriends: { en: '"legal" (law) is also "legal" but in formal register' } },
    { word: 'curtir', article: null, category: 'colloquial', definition: 'to enjoy / to like (informal, BR)',
      exampleSentence: 'Estou curtindo muito a praia.', collocations: ['curtir a vida', 'curtir um som'], falseFriends: null },
    // Proverbs / expressions
    { word: 'dar conta', article: null, category: 'idiomatic', definition: 'to manage / to handle',
      exampleSentence: 'Com tantas encomendas, não damos conta.', collocations: ['dar conta do recado'], falseFriends: null },
    { word: 'à risca', article: null, category: 'idiomatic', definition: 'to the letter / strictly',
      exampleSentence: 'Cumpre as normas à risca.', collocations: ['seguir à risca', 'cumprir à risca'], falseFriends: null },
    { word: 'acertar na mouche', article: null, category: 'idiomatic', definition: 'to hit the nail on the head (PT)',
      exampleSentence: 'Com esse comentário, acertaste na mouche.', collocations: ['acertar na mouche'],
      falseFriends: { note: 'BR equivalent: "acertar em cheio" or "dar no prego"' } },
    // Academic
    { word: 'contornar', article: null, category: 'academic', definition: 'to circumvent / to get around',
      exampleSentence: 'Não podemos contornar as responsabilidades éticas.', collocations: ['contornar um problema', 'contornar uma questão'], falseFriends: null },
    { word: 'subjacente', article: null, category: 'academic', definition: 'underlying',
      exampleSentence: 'As causas subjacentes ao conflito são complexas.', collocations: ['subjacente a algo', 'ideia subjacente'], falseFriends: null },
    { word: 'concatenar', article: null, category: 'academic', definition: 'to concatenate / to link together',
      exampleSentence: 'Concatenaram-se vários erros que provocaram a crise.', collocations: ['concatenar ideias', 'concatenar factos'], falseFriends: null },
    { word: 'elucidar', article: null, category: 'academic', definition: 'to elucidate / to clarify',
      exampleSentence: 'Tentaram elucidar as causas do acidente.', collocations: ['elucidar uma questão', 'elucidar um mistério'], falseFriends: null },
    { word: 'esgrimir', article: null, category: 'academic', definition: 'to wield (an argument)',
      exampleSentence: 'Esgrimiu argumentos muito convincentes.', collocations: ['esgrimir um argumento', 'esgrimir razões'], falseFriends: null },
    // Regional variation
    { word: 'ônibus', article: 'o', category: 'regional', definition: 'bus (BR)',
      exampleSentence: 'Vou pegar o ônibus das oito. (BR)', collocations: ['ponto de ônibus', 'pegar o ônibus'],
      falseFriends: { note: 'In PT, "autocarro" is used instead' } },
    { word: 'autocarro', article: 'o', category: 'regional', definition: 'bus (PT)',
      exampleSentence: 'O autocarro chega às nove. (PT)', collocations: ['paragem de autocarro', 'apanhar o autocarro'],
      falseFriends: { note: 'In BR, "ônibus" is used instead' } },
    { word: 'telemóvel', article: 'o', category: 'regional', definition: 'mobile phone (PT)',
      exampleSentence: 'Esqueci o telemóvel em casa. (PT)', collocations: ['número de telemóvel'],
      falseFriends: { note: 'In BR, "celular" is used instead' } },
    { word: 'pegar', article: null, category: 'regional', definition: 'to catch/take (BR) / to stick/glue (PT)',
      exampleSentence: 'Vou pegar um táxi. (BR) / Isto não pega. (PT)', collocations: ['pegar o ônibus (BR)', 'pegar fogo'],
      falseFriends: { note: 'Meaning differs significantly between BR and PT' } },
  ],
};

// ─── Exercise Types ──────────────────────────────────────────────────────────

const EXERCISE_TYPES = ['definition', 'fill-in-blank', 'matching', 'context-guess', 'collocation'];

function makeDefinitionExercise(targetWord, level) {
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const distractors = core.pick(bank.filter(w => w.word !== targetWord.word), 3)
    .map(w => w.definition);
  const options = core.shuffle([targetWord.definition, ...distractors]);
  return {
    type: 'definition',
    prompt: `What does "${targetWord.article ? targetWord.article + ' ' : ''}${targetWord.word}" mean?`,
    options,
    answer: targetWord.definition,
    word: targetWord.word,
  };
}

function makeFillInBlankExercise(targetWord) {
  const sentence = targetWord.exampleSentence;
  const escapedWord = targetWord.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedWord, 'i');
  const blanked = sentence.replace(regex, '________');
  if (blanked === sentence) {
    return {
      type: 'fill-in-blank',
      prompt: `Complete the sentence with the correct word:\n"${sentence.replace(targetWord.word, '________')}"`,
      answer: targetWord.word,
      hint: targetWord.definition,
      word: targetWord.word,
    };
  }
  return {
    type: 'fill-in-blank',
    prompt: `Fill in the blank:\n"${blanked}"`,
    answer: targetWord.word,
    hint: targetWord.definition,
    word: targetWord.word,
  };
}

function makeMatchingExercise(level) {
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const items = core.pick(bank, 5);
  const pairs = items.map(w => ({
    word: (w.article ? w.article + ' ' : '') + w.word,
    definition: w.definition,
  }));
  return {
    type: 'matching',
    prompt: 'Match each word with its definition.',
    pairs,
    shuffledDefinitions: core.shuffle(pairs.map(p => p.definition)),
    words: pairs.map(p => p.word),
  };
}

function makeContextGuessExercise(targetWord) {
  return {
    type: 'context-guess',
    prompt: `Read the sentence and guess the meaning of the underlined word:\n"${targetWord.exampleSentence}"\n\nWhat does "${targetWord.word}" mean?`,
    answer: targetWord.definition,
    word: targetWord.word,
    falseFriends: targetWord.falseFriends,
  };
}

function makeCollocationExercise(targetWord, level) {
  if (!targetWord.collocations || targetWord.collocations.length === 0) {
    return makeDefinitionExercise(targetWord, level);
  }
  const correctCollocation = core.pick(targetWord.collocations, 1)[0];
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const otherCollocations = [];
  for (const w of core.shuffle(bank)) {
    if (w.word !== targetWord.word && w.collocations && w.collocations.length) {
      otherCollocations.push(w.collocations[0]);
      if (otherCollocations.length >= 3) break;
    }
  }
  const options = core.shuffle([correctCollocation, ...otherCollocations]);
  return {
    type: 'collocation',
    prompt: `Which is a common collocation with "${targetWord.article ? targetWord.article + ' ' : ''}${targetWord.word}"?`,
    options,
    answer: correctCollocation,
    word: targetWord.word,
  };
}

function generateExercise(targetWord, level, type) {
  switch (type) {
    case 'fill-in-blank': return makeFillInBlankExercise(targetWord);
    case 'matching': return makeMatchingExercise(level);
    case 'context-guess': return makeContextGuessExercise(targetWord);
    case 'collocation': return makeCollocationExercise(targetWord, level);
    default: return makeDefinitionExercise(targetWord, level);
  }
}

// ─── Answer Checking ─────────────────────────────────────────────────────────

function checkAnswer(exercise, userAnswer) {
  const normalise = s => core.norm(s);
  if (exercise.type === 'matching') {
    if (!Array.isArray(userAnswer)) return { correct: false, message: 'Provide matched pairs.' };
    const correctCount = userAnswer.filter(ua =>
      exercise.pairs.some(p => normalise(p.word) === normalise(ua.word) && normalise(p.definition) === normalise(ua.definition))
    ).length;
    return {
      correct: correctCount === exercise.pairs.length,
      score: correctCount,
      total: exercise.pairs.length,
      message: correctCount === exercise.pairs.length ? 'Perfeito!' : `${correctCount}/${exercise.pairs.length} correct.`,
    };
  }

  const expected = normalise(exercise.answer);
  const given = normalise(userAnswer);

  if (given === expected) {
    return { correct: true, message: 'Correto! Muito bem.' };
  }

  if (expected.includes(given) && given.length > 2) {
    return { correct: true, partial: true, message: `Close enough — the full answer is "${exercise.answer}".` };
  }

  return {
    correct: false,
    message: `Not quite. The answer is "${exercise.answer}".`,
    expected: exercise.answer,
  };
}

// ─── VocabularyTutor Class ───────────────────────────────────────────────────

class VocabularyTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.level) p.level = 'A1';
    if (!p.skills) p.skills = {};
    if (!p.sessions) p.sessions = [];
    return p;
  }

  setLevel(studentId, level) {
    level = level.toUpperCase();
    if (!core.CEFR.includes(level)) throw new Error(`Invalid CEFR level: ${level}`);
    const p = this.getProfile(studentId);
    p.level = level;
    core.saveProfile(this.dir, p);
    return { studentId, level };
  }

  generateLesson(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const bank = WORD_BANKS[level];
    if (!bank) throw new Error(`No word bank for level ${level}`);

    const seen = Object.keys(p.skills);
    const unseen = bank.filter(w => !seen.includes(w.word));
    const newWords = core.pick(unseen.length > 0 ? unseen : bank, Math.min(MAX_NEW_PER_SESSION, unseen.length || MAX_NEW_PER_SESSION));

    const exercises = newWords.map((w, i) => {
      const type = EXERCISE_TYPES[i % EXERCISE_TYPES.length];
      return generateExercise(w, level, type);
    });

    return {
      date: core.today(),
      level,
      newWords: newWords.map(w => ({
        word: w.word,
        article: w.article,
        definition: w.definition,
        exampleSentence: w.exampleSentence,
        collocations: w.collocations,
        falseFriends: w.falseFriends,
        category: w.category,
      })),
      exercises,
    };
  }

  generateExercise(studentId, type) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const bank = WORD_BANKS[level];
    if (!bank) throw new Error(`No word bank for level ${level}`);
    const targetWord = core.pick(bank, 1)[0];
    const exType = type && EXERCISE_TYPES.includes(type) ? type : core.pick(EXERCISE_TYPES, 1)[0];
    return generateExercise(targetWord, level, exType);
  }

  checkAnswer(exercise, userAnswer) {
    return checkAnswer(exercise, userAnswer);
  }

  recordAssessment(studentId, word, grade) {
    if (!core.isValidGrade(grade, 1, 4)) throw new Error('Grade must be 1-4 (1=forgot, 2=hard, 3=good, 4=easy)');
    const p = this.getProfile(studentId);

    if (!p.skills[word]) {
      p.skills[word] = {
        word,
        encounters: 0,
        stability: 1,
        difficulty: 5,
        lastReview: null,
        nextReview: null,
        attempts: [],
      };
    }
    const sk = p.skills[word];
    sk.encounters += 1;
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, grade);
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, grade);
    sk.lastReview = core.today();
    sk.nextReview = (() => {
      const days = core.fsrsNextReview(sk.stability, core.DEFAULT_RETENTION);
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    })();
    sk.attempts.push({ score: grade >= 3 ? 1 : 0, total: 1, date: core.today() });

    p.assessments.push({ word, grade, date: core.today() });
    core.saveProfile(this.dir, p);

    return {
      word,
      grade,
      mastery: core.masteryLabel(core.calcMastery(sk.attempts)),
      nextReview: sk.nextReview,
      encounters: sk.encounters,
    };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const bankSize = (WORD_BANKS[level] || []).length;
    const words = Object.keys(p.skills);
    const masteryMap = {};
    let masteredCount = 0;
    let totalEncounters = 0;

    for (const w of words) {
      const sk = p.skills[w];
      const m = core.calcMastery(sk.attempts);
      masteryMap[w] = { mastery: m, label: core.masteryLabel(m), encounters: sk.encounters };
      if (m >= core.MASTERY_THRESHOLD) masteredCount++;
      totalEncounters += sk.encounters;
    }

    return {
      studentId,
      level,
      wordsStudied: words.length,
      wordsMastered: masteredCount,
      totalInLevel: bankSize,
      totalEncounters,
      words: masteryMap,
    };
  }

  getNextTopics(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const bank = WORD_BANKS[level] || [];
    const seen = new Set(Object.keys(p.skills));
    const unseen = bank.filter(w => !seen.has(w.word));

    const categories = {};
    for (const w of unseen) {
      if (!categories[w.category]) categories[w.category] = [];
      categories[w.category].push(w.word);
    }

    return { level, unseenCount: unseen.length, byCategory: categories };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const review = this.getReviewDue(studentId);

    return {
      studentId,
      level: p.level,
      createdAt: p.createdAt,
      sessionsCount: p.assessments.length,
      ...progress,
      reviewDueCount: review.length,
      reviewDueWords: review.map(r => r.word),
    };
  }

  listStudents() {
    return core.listProfiles(this.dir);
  }

  getWordCatalog(level) {
    const lvl = level && core.CEFR.includes(level) ? level : null;
    if (lvl) {
      return { [lvl]: (WORD_BANKS[lvl] || []).map(w => ({ word: w.word, article: w.article, definition: w.definition, category: w.category })) };
    }
    const catalog = {};
    for (const l of core.CEFR) {
      if (WORD_BANKS[l]) {
        catalog[l] = WORD_BANKS[l].map(w => ({ word: w.word, article: w.article, definition: w.definition, category: w.category }));
      }
    }
    return catalog;
  }

  getReviewDue(studentId) {
    const p = this.getProfile(studentId);
    const t = core.today();
    const due = [];
    for (const [word, sk] of Object.entries(p.skills)) {
      if (sk.nextReview && sk.nextReview <= t) {
        due.push({ word, nextReview: sk.nextReview, encounters: sk.encounters, mastery: core.masteryLabel(core.calcMastery(sk.attempts)) });
      }
    }
    return due.sort((a, b) => a.nextReview.localeCompare(b.nextReview));
  }
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

const tutor = new VocabularyTutor();

core.runCLI((cmd, args, out) => {
  const sid = args[1] || 'default';
  switch (cmd) {
    case 'start':
      out(tutor.getProfile(sid));
      break;
    case 'set-level':
      out(tutor.setLevel(sid, (args[2] || '').toUpperCase()));
      break;
    case 'lesson':
      out(tutor.generateLesson(sid));
      break;
    case 'exercise':
      out(tutor.generateExercise(sid, args[2]));
      break;
    case 'check': {
      const ex = JSON.parse(args[2]);
      const ans = args.slice(3).join(' ');
      out(tutor.checkAnswer(ex, ans));
      break;
    }
    case 'record':
      out(tutor.recordAssessment(sid, args[2], parseInt(args[3], 10)));
      break;
    case 'review':
      out(tutor.getReviewDue(sid));
      break;
    case 'progress':
      out(tutor.getProgress(sid));
      break;
    case 'report':
      out(tutor.getReport(sid));
      break;
    case 'next':
      out(tutor.getNextTopics(sid));
      break;
    case 'words':
      out(tutor.getWordCatalog(args[1] ? args[2].toUpperCase() : null));
      break;
    case 'students':
      out({ students: tutor.listStudents() });
      break;
    case 'help':
      out({ info: 'Use one of the commands listed in SKILL.md' });
      break;
    default:
      out({
        usage: 'node tutor.js <command> [studentId] [args...]',
        commands: {
          start: 'Load or create student profile',
          'set-level': 'Set CEFR level (A1-C2)',
          lesson: 'Generate a lesson with new words + exercises',
          exercise: 'Generate a single exercise [type]',
          check: 'Check answer: check <id> <exerciseJSON> <answer>',
          record: 'Record assessment: record <id> <word> <grade 1-4>',
          review: 'Get words due for review',
          progress: 'Show progress summary',
          report: 'Full student report',
          next: 'Show upcoming topics by category',
          words: 'Show word catalog [level]',
          students: 'List all students',
        },
      });
  }
});
