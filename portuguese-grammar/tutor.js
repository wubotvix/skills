#!/usr/bin/env node
// Portuguese Grammar Tutor — discovery-based grammar teaching with FSRS spaced repetition
'use strict';

const core = require('../_lib/core');
const { CEFR, MASTERY_THRESHOLD, DEFAULT_RETENTION,
        dataDir, loadProfile, saveProfile, listProfiles,
        calcMastery, masteryLabel,
        fsrsRetention, fsrsNextReview, fsrsUpdateStability, fsrsUpdateDifficulty,
        shuffle, pick, norm, today, runCLI } = core;

const SKILL_NAME = 'portuguese-grammar';

// ─── Embedded Grammar Data ──────────────────────────────────────────────────

const TOPICS = [
  // ── A1 ──
  { id: 'ser-estar-basic', name: 'Ser vs Estar (basic)', level: 'A1', category: 'verbs',
    scoba: `What are you describing?
  → IDENTITY (name, profession, nationality, material)?
      → SER: "Sou professor." "A mesa é de madeira."
  → LOCATION of a person or thing?
      → ESTAR: "Estou em casa." "Lisboa está em Portugal."
  → TIME, DATE, or EVENT LOCATION?
      → SER: "São três horas." "A festa é na minha casa."
  → TEMPORARY STATE (mood, health, position)?
      → ESTAR: "Estou cansado." "A porta está aberta."
  → ADJECTIVE that CHANGES MEANING?
      ser esperto = clever / estar esperto = alert
      ser chato = boring / estar chato = annoyed
      ser mau = bad person / estar mau = ill (PT)
      ser rico = wealthy / estar rico = delicious`,
    exercises: [
      { type: 'fill', prompt: 'A minha mãe ___ (ser/estar) professora.', answer: 'é', hint: 'Identity/profession → ser' },
      { type: 'fill', prompt: 'Nós ___ (ser/estar) no parque.', answer: 'estamos', hint: 'Location → estar' },
      { type: 'fill', prompt: '___ (Ser/Estar) duas horas da tarde.', answer: 'São', hint: 'Time → ser' },
      { type: 'fill', prompt: 'A Maria ___ (ser/estar) cansada hoje.', answer: 'está', hint: 'Temporary state → estar' },
      { type: 'error', prompt: 'Eu sou doente hoje.', answer: 'Eu estou doente hoje.', hint: 'Illness is a temporary state → estar' },
      { type: 'error', prompt: 'A festa está na minha casa.', answer: 'A festa é na minha casa.', hint: 'Event location → ser' },
      { type: 'transform', prompt: 'Rewrite using estar: "Sou cansado."', answer: 'Estou cansado.', hint: 'Temporary state → estar' },
    ] },
  { id: 'present-regular', name: 'Present Tense (regular)', level: 'A1', category: 'verbs',
    scoba: `Regular present tense endings:
  -AR verbs (falar): -o, -as, -a, -amos, -am (BR: -amos, -am)
  -ER verbs (comer): -o, -es, -e, -emos, -em
  -IR verbs (partir): -o, -es, -e, -imos, -em
  Note: "tu" forms use -as/-es/-es; "você/ele/ela" uses -a/-e/-e`,
    exercises: [
      { type: 'fill', prompt: 'Eu ___ (falar) português.', answer: 'falo', hint: '-AR: eu → -o' },
      { type: 'fill', prompt: 'Eles ___ (comer) no restaurante.', answer: 'comem', hint: '-ER: eles → -em' },
      { type: 'fill', prompt: 'Nós ___ (partir) amanhã.', answer: 'partimos', hint: '-IR: nós → -imos' },
      { type: 'fill', prompt: 'Tu ___ (estudar) muito.', answer: 'estudas', hint: '-AR: tu → -as' },
      { type: 'error', prompt: 'Ela come muito e falam com a amiga dela.', answer: 'Ela come muito e fala com a amiga dela.', hint: 'Subject is ela (3rd sing) for both verbs' },
      { type: 'transform', prompt: 'Change subject to nós: "Eu escrevo cartas."', answer: 'Nós escrevemos cartas.', hint: '-ER: nós → -emos' },
    ] },
  { id: 'gender-articles', name: 'Gender & Articles', level: 'A1', category: 'nouns',
    scoba: `Masculine: o (the), um (a) — usually ending in -o
Feminine: a (the), uma (a) — usually ending in -a
Exceptions: o problema, o dia, o mapa, a mão, a foto
Plural: os/as, uns/umas — add -s (vowel) or -es (consonant)
Note: -ão → -ões (most), -ães, -ãos`,
    exercises: [
      { type: 'fill', prompt: '___ (o/a) casa é grande.', answer: 'A', hint: 'casa ends in -a → feminine' },
      { type: 'fill', prompt: '___ (o/a) problema é difícil.', answer: 'O', hint: 'problema is an exception — masculine' },
      { type: 'fill', prompt: 'Tenho ___ (um/uma) livro novo.', answer: 'um', hint: 'livro ends in -o → masculine' },
      { type: 'error', prompt: 'A problema é muito grande.', answer: 'O problema é muito grande.', hint: 'problema is masculine despite ending in -a' },
      { type: 'fill', prompt: '___ (Os/As) cidades são bonitas.', answer: 'As', hint: 'cidade is feminine' },
    ] },
  { id: 'adjective-agreement', name: 'Adjective Agreement', level: 'A1', category: 'nouns',
    scoba: `Adjectives must match the noun in gender and number:
  alto / alta / altos / altas
  inteligente / inteligente / inteligentes / inteligentes
Adjective usually follows the noun: "a casa branca"`,
    exercises: [
      { type: 'fill', prompt: 'As meninas são muito ___ (alto).', answer: 'altas', hint: 'Feminine plural → -as' },
      { type: 'fill', prompt: 'O carro é ___ (vermelho).', answer: 'vermelho', hint: 'Masculine singular → -o' },
      { type: 'error', prompt: 'As flores são bonito.', answer: 'As flores são bonitas.', hint: 'flores is feminine plural → bonitas' },
      { type: 'transform', prompt: 'Make plural: "O gato preto."', answer: 'Os gatos pretos.', hint: 'Both noun and adjective become plural' },
    ] },
  { id: 'gostar-de', name: 'Gostar de & Similar Verbs', level: 'A1', category: 'verbs',
    scoba: `Gostar de works differently from Spanish gustar:
  Eu gosto de chocolate. (I like chocolate.)
  Ela gosta de dançar. (She likes to dance.)
  Nós gostamos de música. (We like music.)
The subject is the person who likes; the thing liked follows "de".
Similar: precisar de, depender de, lembrar-se de`,
    exercises: [
      { type: 'fill', prompt: 'Eu ___ (gostar) de chocolate.', answer: 'gosto', hint: 'Regular -AR: eu → -o' },
      { type: 'fill', prompt: 'Eles ___ (gostar) de futebol.', answer: 'gostam', hint: 'Regular -AR: eles → -am' },
      { type: 'error', prompt: 'Eu gosto chocolate.', answer: 'Eu gosto de chocolate.', hint: 'Gostar requires the preposition "de"' },
      { type: 'fill', prompt: 'Nós ___ (gostar) muito ___ música.', answer: 'gostamos ... de', hint: 'gostar DE + noun' },
    ] },
  { id: 'ter-haver', name: 'Ter vs Haver', level: 'A1', category: 'verbs',
    scoba: `Ter = to have (possession, age, feelings)
  "Tenho um carro." "Tenho 25 anos." "Tenho fome."
Haver (impersonal) = there is/are (existence)
  "Há um gato no jardim." (formal/written)
  "Tem um gato no jardim." (BR informal = there is)
Note: In BR spoken language, "ter" replaces "haver" for existence.`,
    exercises: [
      { type: 'fill', prompt: '___ (Ter/Haver) um restaurante perto daqui.', answer: 'Há', hint: 'Existence (formal) → haver' },
      { type: 'fill', prompt: 'Eu ___ (ter) dois irmãos.', answer: 'tenho', hint: 'Possession → ter' },
      { type: 'error', prompt: 'Há muita fome. (meaning: I am very hungry)', answer: 'Tenho muita fome.', hint: 'Personal feeling → ter' },
    ] },

  // ── A2 ──
  { id: 'preterite-regular', name: 'Pretérito Perfeito (regular)', level: 'A2', category: 'verbs',
    scoba: `Regular preterite endings:
  -AR (falar): -ei, -aste, -ou, -ámos, -aram
  -ER (comer): -i, -este, -eu, -emos, -eram
  -IR (partir): -i, -iste, -iu, -imos, -iram`,
    exercises: [
      { type: 'fill', prompt: 'Ontem eu ___ (falar) com o Pedro.', answer: 'falei', hint: '-AR: eu → -ei' },
      { type: 'fill', prompt: 'Eles ___ (comer) no restaurante.', answer: 'comeram', hint: '-ER: eles → -eram' },
      { type: 'fill', prompt: 'Nós ___ (partir) cedo.', answer: 'partimos', hint: '-IR: nós → -imos (same as present!)' },
      { type: 'error', prompt: 'Ela falou comigo e depois comou no restaurante.', answer: 'Ela falou comigo e depois comeu no restaurante.', hint: '-ER: ela → -eu, not -ou' },
      { type: 'transform', prompt: 'Put into past: "Eu estudo português."', answer: 'Eu estudei português.', hint: '-AR: eu → -ei' },
    ] },
  { id: 'preterite-irregular', name: 'Pretérito Perfeito (irregular)', level: 'A2', category: 'verbs',
    scoba: `Key irregular preterits:
  ser/ir: fui, foste, foi, fomos, foram
  ter: tive, tiveste, teve, tivemos, tiveram
  estar: estive, estiveste, esteve, estivemos, estiveram
  fazer: fiz, fizeste, fez, fizemos, fizeram
  dizer: disse, disseste, disse, dissemos, disseram
  poder: pude, pudeste, pôde, pudemos, puderam`,
    exercises: [
      { type: 'fill', prompt: 'Ontem eu ___ (ir) ao cinema.', answer: 'fui', hint: 'Ir is irregular: eu → fui' },
      { type: 'fill', prompt: 'Ela ___ (ter) uma boa ideia.', answer: 'teve', hint: 'Ter is irregular: ela → teve' },
      { type: 'fill', prompt: 'Nós ___ (fazer) o jantar.', answer: 'fizemos', hint: 'Fazer: nós → fizemos' },
      { type: 'error', prompt: 'Eu fazi o trabalho ontem.', answer: 'Eu fiz o trabalho ontem.', hint: 'Fazer: eu → fiz (not fazi)' },
    ] },
  { id: 'reflexives', name: 'Reflexive Verbs', level: 'A2', category: 'verbs',
    scoba: `Reflexive pronouns: me, te, se, nos, se
  Eu levanto-me / Eu me levanto (BR)
  Tu levantas-te / Você se levanta (BR)
  Ele levanta-se / Ele se levanta (BR)
Position: After verb (PT default), before verb (BR default/with triggers)
Common reflexives: levantar-se, deitar-se, lavar-se, vestir-se, sentar-se, chamar-se`,
    exercises: [
      { type: 'fill', prompt: 'Eu ___ (levantar-se) às sete horas.', answer: 'levanto-me', hint: 'EU + reflexive: levanto-me (PT) or me levanto (BR)' },
      { type: 'fill', prompt: 'Como é que tu ___ (chamar-se)?', answer: 'te chamas', hint: 'TU: te chamas' },
      { type: 'error', prompt: 'Ela levanta-me cedo.', answer: 'Ela levanta-se cedo.', hint: 'Ela → se (not me)' },
      { type: 'transform', prompt: 'Make reflexive: "Eu lavo as mãos."', answer: 'Eu lavo-me as mãos. / Eu me lavo as mãos.', hint: 'Add reflexive pronoun' },
    ] },
  { id: 'ir-infinitive', name: 'Ir + Infinitive (future)', level: 'A2', category: 'verbs',
    scoba: `Ir (conjugated) + infinitive = near future
  Eu vou estudar. (I'm going to study.)
  Nós vamos comer. (We're going to eat.)
  Eles vão viajar. (They're going to travel.)
This is the most common way to express future in spoken Portuguese.`,
    exercises: [
      { type: 'fill', prompt: 'Amanhã eu ___ (ir) estudar.', answer: 'vou', hint: 'Ir: eu → vou' },
      { type: 'fill', prompt: 'Nós ___ (ir) comer fora.', answer: 'vamos', hint: 'Ir: nós → vamos' },
      { type: 'transform', prompt: 'Express as future: "Eu estudo português."', answer: 'Eu vou estudar português.', hint: 'Ir + infinitive' },
    ] },
  { id: 'direct-object-pronouns', name: 'Direct Object Pronouns', level: 'A2', category: 'pronouns',
    scoba: `Direct object pronouns: me, te, o/a, nos, os/as
  "Eu vejo a Maria." → "Eu vejo-a." (PT) / "Eu a vejo." (BR)
After verb forms ending in -r, -s, -z: o → lo, a → la
  "Vou comprar o livro." → "Vou comprá-lo."
After nasal: o → no, a → na
  "Eles compram os livros." → "Eles compram-nos."`,
    exercises: [
      { type: 'fill', prompt: 'Eu vejo ___ (a Maria) todos os dias.', answer: 'vejo-a', hint: 'Feminine direct object → a' },
      { type: 'fill', prompt: 'Vou comprar ___ (o livro).', answer: 'comprá-lo', hint: 'After infinitive -r: o → lo (remove -r, add accent)' },
      { type: 'error', prompt: 'Eu o vejo todos os dias. (in formal PT context)', answer: 'Eu vejo-o todos os dias.', hint: 'In PT, pronoun goes after verb in affirmative sentences' },
    ] },
  { id: 'comparatives', name: 'Comparatives', level: 'A2', category: 'nouns',
    scoba: `Comparative structures:
  mais + adj + (do) que = more ... than
  menos + adj + (do) que = less ... than
  tão + adj + como = as ... as
Irregular: bom → melhor, mau → pior, grande → maior, pequeno → menor`,
    exercises: [
      { type: 'fill', prompt: 'O Pedro é ___ alto ___ o João.', answer: 'mais ... do que', hint: 'more ... than = mais ... do que' },
      { type: 'fill', prompt: 'Este livro é ___ (bom) do que aquele.', answer: 'melhor', hint: 'bom → melhor (irregular)' },
      { type: 'error', prompt: 'Ela é mais boa do que ele.', answer: 'Ela é melhor do que ele.', hint: 'bom → melhor (not mais boa)' },
    ] },

  // ── B1 ──
  { id: 'imperfect', name: 'Imperfeito', level: 'B1', category: 'verbs',
    scoba: `Imperfect tense — used for:
  → Habitual past: "Eu falava com ele todos os dias."
  → Background description: "Estava sol e os pássaros cantavam."
  → Ongoing past action: "Eu dormia quando ele chegou."
Endings: -AR: -ava, -avas, -ava, -ávamos, -avam
  -ER/-IR: -ia, -ias, -ia, -íamos, -iam
Irregular: ser (era), ter (tinha), vir (vinha), pôr (punha)`,
    exercises: [
      { type: 'fill', prompt: 'Quando eu era criança, ___ (brincar) no parque todos os dias.', answer: 'brincava', hint: 'Habitual past: -AR eu → -ava' },
      { type: 'fill', prompt: 'Nós ___ (comer) sempre às oito.', answer: 'comíamos', hint: 'Habitual: -ER nós → -íamos' },
      { type: 'error', prompt: 'Quando eu era pequeno, fui ao parque todos os dias.', answer: 'Quando eu era pequeno, ia ao parque todos os dias.', hint: 'Habitual past → imperfeito, not perfeito' },
      { type: 'transform', prompt: 'Change to imperfeito: "Eu falo português."', answer: 'Eu falava português.', hint: '-AR: -ava' },
    ] },
  { id: 'perf-vs-imperf', name: 'Perfeito vs Imperfeito', level: 'B1', category: 'verbs',
    scoba: `When to use which?
  → PERFEITO: completed action, specific time, sequence of events
      "Ontem fui ao cinema."
  → IMPERFEITO: habitual, description, ongoing background
      "Quando eu era jovem, ia ao cinema todas as semanas."
  → BOTH TOGETHER: background (imperf) interrupted by event (perf)
      "Eu dormia (imperf) quando o telefone tocou (perf)."`,
    exercises: [
      { type: 'fill', prompt: 'Eu ___ (dormir) quando o telefone ___ (tocar).', answer: 'dormia ... tocou', hint: 'Background (imperf) interrupted by event (perf)' },
      { type: 'fill', prompt: 'Ontem eu ___ (ir) ao supermercado e ___ (comprar) fruta.', answer: 'fui ... comprei', hint: 'Sequence of completed events → perfeito' },
      { type: 'error', prompt: 'Quando era criança, fui ao parque todos os dias.', answer: 'Quando era criança, ia ao parque todos os dias.', hint: 'Habitual past → imperfeito' },
    ] },
  { id: 'conjuntivo-intro', name: 'Conjuntivo Presente (intro)', level: 'B1', category: 'verbs',
    scoba: `The conjuntivo (subjunctive) is triggered by:
  W - Wishes: "Espero que ele venha."
  E - Emotions: "Fico feliz que estejas bem."
  I - Impersonal: "É importante que estudemos."
  R - Requests/Recommendations: "Quero que faças isso."
  D - Doubt/Denial: "Duvido que ele saiba."
  O - Ojalá (Oxalá): "Oxalá tudo corra bem."
Formation: Take eu present, change ending:
  -AR: -e, -es, -e, -emos, -em
  -ER/-IR: -a, -as, -a, -amos, -am`,
    exercises: [
      { type: 'fill', prompt: 'Espero que tu ___ (vir) à festa.', answer: 'venhas', hint: 'Wish + que → conjuntivo: vir → venha-' },
      { type: 'fill', prompt: 'É importante que nós ___ (estudar).', answer: 'estudemos', hint: 'Impersonal + que → conjuntivo: -AR → -emos' },
      { type: 'error', prompt: 'Espero que ela vem amanhã.', answer: 'Espero que ela venha amanhã.', hint: 'After "espero que" → conjuntivo' },
      { type: 'fill', prompt: 'Duvido que ele ___ (saber) a resposta.', answer: 'saiba', hint: 'Doubt + que → conjuntivo: saber → saiba' },
    ] },
  { id: 'por-para', name: 'Por vs Para', level: 'B1', category: 'prepositions',
    scoba: `POR = through, by, because of, exchange, duration
  "Passei por Lisboa." (through)
  "O livro foi escrito por Saramago." (by/agent)
  "Faltei por estar doente." (because of)
  "Paguei 10 euros por isso." (exchange)
PARA = destination, purpose, recipient, deadline
  "Vou para Lisboa." (destination)
  "Estudo para aprender." (purpose)
  "Isto é para ti." (recipient)
  "Preciso disto para segunda." (deadline)`,
    exercises: [
      { type: 'fill', prompt: 'Este presente é ___ (por/para) ti.', answer: 'para', hint: 'Recipient → para' },
      { type: 'fill', prompt: 'O livro foi escrito ___ (por/para) Machado de Assis.', answer: 'por', hint: 'Agent in passive → por' },
      { type: 'fill', prompt: 'Estudo ___ (por/para) aprender português.', answer: 'para', hint: 'Purpose → para' },
      { type: 'error', prompt: 'Passei para a ponte.', answer: 'Passei pela ponte.', hint: 'Through/along → por (por + a = pela)' },
    ] },
  { id: 'personal-infinitive-intro', name: 'Personal Infinitive (intro)', level: 'B1', category: 'verbs',
    scoba: `UNIQUE TO PORTUGUESE! The infinitive can take personal endings:
  falar: falar, falares, falar, falarmos, falarem
Use when:
  → Subject of infinitive differs from main verb: "É bom eles saberem."
  → After prepositions with clear subject: "Antes de nós partirmos..."
  → To avoid ambiguity about who performs the action
Do NOT use when subject is the same as main verb.`,
    exercises: [
      { type: 'fill', prompt: 'É importante ___ (nós / estudar) todos os dias.', answer: 'estudarmos', hint: 'Different subject → personal infinitive: nós → -mos' },
      { type: 'fill', prompt: 'Antes de ___ (eles / sair), fechem as janelas.', answer: 'saírem', hint: 'eles + infinitive → -em ending' },
      { type: 'error', prompt: 'É bom eles saber a verdade.', answer: 'É bom eles saberem a verdade.', hint: 'Different subject (eles) → personal infinitive: saberem' },
    ] },
  { id: 'conditional', name: 'Condicional', level: 'B1', category: 'verbs',
    scoba: `Conditional = infinitive + endings: -ia, -ias, -ia, -íamos, -iam
  falar → falaria, comerias, partiria
Used for: polite requests, hypothetical, reported speech
  "Gostaria de um café." (polite)
  "Se pudesse, viajaria." (hypothetical)
  "Ele disse que viria." (reported speech)
Irregular stems: dizer → dir-, fazer → far-, trazer → trar-`,
    exercises: [
      { type: 'fill', prompt: 'Eu ___ (gostar) de um café, por favor.', answer: 'gostaria', hint: 'Polite request: infinitive + -ia' },
      { type: 'fill', prompt: 'Se pudesse, eu ___ (viajar) pelo mundo.', answer: 'viajaria', hint: 'Hypothetical: infinitive + -ia' },
      { type: 'fill', prompt: 'Ele ___ (dizer) a verdade.', answer: 'diria', hint: 'Irregular stem: dizer → dir- + -ia' },
    ] },

  // ── B2 ──
  { id: 'conjuntivo-full', name: 'Conjuntivo Presente (full)', level: 'B2', category: 'verbs',
    scoba: `Extended conjuntivo triggers:
  → Expressions of doubt: "Talvez ele venha."
  → Concessive: "Embora esteja frio, vou sair."
  → Purpose: "Vou falar devagar para que entendas."
  → Time (future): "Quando chegares, liga-me."
  → Conditional: "Caso chova, ficamos em casa."
  → Negative opinion: "Não acho que seja verdade."
Irregular stems: ser→sej-, estar→estej-, ter→tenh-, ir→vá-, saber→saib-, haver→haj-`,
    exercises: [
      { type: 'fill', prompt: 'Embora ___ (estar) cansado, vou continuar.', answer: 'esteja', hint: 'Embora + conjuntivo: estar → esteja' },
      { type: 'fill', prompt: 'Talvez ela ___ (ir) à praia.', answer: 'vá', hint: 'Talvez + conjuntivo: ir → vá' },
      { type: 'fill', prompt: 'Quando tu ___ (chegar), telefona-me.', answer: 'chegues', hint: 'Quando (future) + conjuntivo: -AR tu → -es' },
      { type: 'error', prompt: 'Embora está frio, vou sair.', answer: 'Embora esteja frio, vou sair.', hint: 'Embora always triggers conjuntivo' },
    ] },
  { id: 'imperf-conjuntivo', name: 'Imperfeito do Conjuntivo', level: 'B2', category: 'verbs',
    scoba: `Formation: 3rd person plural preterite stem + -sse endings
  falar → falaram → fala- → falasse, falasses, falasse, falássemos, falassem
  comer → comeram → come- → comesse, comesses, etc.
  ser/ir → foram → fo- → fosse, fosses, fosse, fôssemos, fossem
Used for: past wishes, past doubt, hypothetical si clauses
  "Se eu tivesse dinheiro, compraria uma casa."
  "Queria que ele viesse."`,
    exercises: [
      { type: 'fill', prompt: 'Se eu ___ (ter) mais tempo, estudaria mais.', answer: 'tivesse', hint: 'Hypothetical se + imperfeito do conjuntivo: ter → tivesse' },
      { type: 'fill', prompt: 'Queria que ele ___ (vir) à festa.', answer: 'viesse', hint: 'Past wish: vir → viesse' },
      { type: 'fill', prompt: 'Se nós ___ (ser) ricos, viajaríamos sempre.', answer: 'fôssemos', hint: 'ser → fôssemos' },
      { type: 'error', prompt: 'Se eu tenho mais dinheiro, compraria uma casa.', answer: 'Se eu tivesse mais dinheiro, compraria uma casa.', hint: 'Hypothetical se → imperfeito do conjuntivo' },
    ] },
  { id: 'si-clauses', name: 'Se Clauses', level: 'B2', category: 'verbs',
    scoba: `Three types of "se" (if) clauses:
  1. REAL: Se + presente, presente/futuro
     "Se chove, fico em casa." / "Se chover, ficarei em casa."
  2. HYPOTHETICAL: Se + imperfeito do conjuntivo, condicional
     "Se tivesse dinheiro, viajaria."
  3. PAST UNREAL: Se + mais-que-perfeito do conjuntivo, condicional composto
     "Se tivesse estudado, teria passado."
Note: In BR spoken, sometimes indicativo replaces conjuntivo in type 1.`,
    exercises: [
      { type: 'fill', prompt: 'Se ___ (chover), ficamos em casa.', answer: 'chover', hint: 'Real future condition: se + futuro do conjuntivo (or presente in BR)' },
      { type: 'fill', prompt: 'Se eu ___ (poder), viajaria pelo mundo.', answer: 'pudesse', hint: 'Hypothetical: se + imperfeito do conjuntivo' },
      { type: 'error', prompt: 'Se eu teria dinheiro, compraria uma casa.', answer: 'Se eu tivesse dinheiro, compraria uma casa.', hint: 'Se clause takes conjuntivo, not condicional' },
    ] },
  { id: 'passive', name: 'Passive Voice', level: 'B2', category: 'verbs',
    scoba: `Two main passive constructions:
  1. SER + particípio (process/action):
     "O livro foi escrito por Saramago."
  2. ESTAR + particípio (result/state):
     "A porta está fechada."
  3. Reflexive passive (SE):
     "Fala-se português aqui." = Portuguese is spoken here.
     "Vendem-se casas." = Houses for sale.`,
    exercises: [
      { type: 'fill', prompt: 'O bolo ___ (ser) feito pela minha mãe.', answer: 'foi', hint: 'Passive process → ser + particípio' },
      { type: 'fill', prompt: 'A janela ___ (estar) aberta.', answer: 'está', hint: 'State/result → estar + particípio' },
      { type: 'transform', prompt: 'Make passive: "Alguém escreveu o livro."', answer: 'O livro foi escrito.', hint: 'ser + past participle' },
      { type: 'fill', prompt: '___ (falar) português aqui.', answer: 'Fala-se', hint: 'Reflexive passive: verb-se' },
    ] },
  { id: 'ser-estar-ficar', name: 'Ser vs Estar vs Ficar', level: 'B2', category: 'verbs',
    scoba: `Portuguese has THREE copular verbs:
  SER: identity, inherent qualities, origin, time, events
    "Ela é alta." (inherent)
  ESTAR: temporary state, location, result of change
    "Ela está cansada." (temporary)
  FICAR: become, location (permanent), remain
    "Ela ficou contente." (became)
    "A escola fica na rua principal." (is located)
    "Fica aqui." (Stay here.)
SCOBA: Is it permanent/inherent? → SER
        Is it temporary/changeable? → ESTAR
        Is it a change of state / becoming? → FICAR
        Is it a permanent location? → FICAR (not estar!)`,
    exercises: [
      { type: 'fill', prompt: 'Quando soube a notícia, ela ___ (ficar) feliz.', answer: 'ficou', hint: 'Change of state → ficar' },
      { type: 'fill', prompt: 'A escola ___ (ficar) perto da minha casa.', answer: 'fica', hint: 'Permanent location → ficar' },
      { type: 'fill', prompt: 'Ele ___ (estar) doente esta semana.', answer: 'está', hint: 'Temporary state → estar' },
      { type: 'error', prompt: 'O banco está na Avenida da Liberdade.', answer: 'O banco fica na Avenida da Liberdade.', hint: 'Permanent location of a building → ficar' },
    ] },
  { id: 'reported-speech', name: 'Reported Speech', level: 'B2', category: 'verbs',
    scoba: `Direct → Indirect speech shifts:
  presente → imperfeito: "Gosto" → disse que gostava
  perfeito → mais-que-perfeito: "Fui" → disse que tinha ido
  futuro → condicional: "Irei" → disse que iria
  conjuntivo pres → conjuntivo imperf
  aqui → ali/lá, hoje → naquele dia, amanhã → no dia seguinte`,
    exercises: [
      { type: 'transform', prompt: 'Report: Ela disse: "Eu gosto de chocolate."', answer: 'Ela disse que gostava de chocolate.', hint: 'presente → imperfeito' },
      { type: 'transform', prompt: 'Report: Ele disse: "Fui ao cinema."', answer: 'Ele disse que tinha ido ao cinema.', hint: 'perfeito → mais-que-perfeito composto' },
    ] },

  // ── C1 ──
  { id: 'pluperfect-conjuntivo', name: 'Mais-que-perfeito do Conjuntivo', level: 'C1', category: 'verbs',
    scoba: `Formation: tivesse + past participle
  "Se eu tivesse estudado, teria passado."
Used for past unreal conditions and past regrets.`,
    exercises: [
      { type: 'fill', prompt: 'Se eu ___ (estudar) mais, teria passado no exame.', answer: 'tivesse estudado', hint: 'Past unreal: tivesse + particípio' },
      { type: 'fill', prompt: 'Se eles ___ (chegar) a tempo, teriam visto o espetáculo.', answer: 'tivessem chegado', hint: 'tivessem + particípio' },
    ] },
  { id: 'future-subjunctive', name: 'Futuro do Conjuntivo', level: 'C1', category: 'verbs',
    scoba: `UNIQUE TO PORTUGUESE (and formal Spanish). Used for:
  → "quando" (when, future): "Quando eu chegar, telefono-te."
  → "se" (if, real future): "Se chover, fico em casa."
  → "enquanto" (while, future): "Enquanto eu viver, sou feliz."
  → Relative clauses (future): "Quem quiser, pode vir."
Formation: 3rd person plural preterite stem + -r, -res, -r, -rmos, -rem
  falar → falaram → fala- → falar, falares, falar, falarmos, falarem
  ser/ir → foram → fo- → for, fores, for, formos, forem`,
    exercises: [
      { type: 'fill', prompt: 'Quando eu ___ (chegar) a casa, ligo-te.', answer: 'chegar', hint: 'Future conjuntivo: chegar (looks like infinitive for regular verbs!)' },
      { type: 'fill', prompt: 'Se ___ (ser) possível, venha amanhã.', answer: 'for', hint: 'Ser → futuro conj: for' },
      { type: 'fill', prompt: 'Enquanto nós ___ (viver), seremos amigos.', answer: 'vivermos', hint: 'viver: nós → vivermos' },
      { type: 'fill', prompt: 'Quem ___ (querer) pode vir.', answer: 'quiser', hint: 'Querer → futuro conj: quiser' },
      { type: 'error', prompt: 'Quando eu chegue, telefono-te.', answer: 'Quando eu chegar, telefono-te.', hint: '"Quando" + future → futuro do conjuntivo, not presente' },
    ] },
  { id: 'clitic-placement', name: 'Clitic Placement', level: 'C1', category: 'pronouns',
    scoba: `Portuguese clitic (pronoun) placement rules:
  ENCLISIS (after verb) = DEFAULT in PT
    "Dou-te o livro."
  PROCLISIS (before verb) = DEFAULT in BR, and in PT after:
    Negation: "Não te dou."
    Subordinators: "Que, quando, se, porque..."
    Adverbs: "Já, sempre, ainda, também..."
    Question words: "Quem te disse?"
  MESOCLISIS (inside verb) = Future/Conditional in formal PT:
    "Dar-te-ei o livro." (I will give you the book)
    "Dar-te-ia se pudesse." (I would give you)
  Never start a sentence with a clitic!`,
    exercises: [
      { type: 'fill', prompt: 'Não ___ (te / dizer) nada. (eu)', answer: 'te disse', hint: 'Negation → proclisis: Não te disse' },
      { type: 'fill', prompt: '___ (dar / te) o livro amanhã. (eu, formal PT future)', answer: 'Dar-te-ei', hint: 'Future + formal PT → mesoclisis: Dar-te-ei' },
      { type: 'error', prompt: 'Te dou o livro. (formal PT)', answer: 'Dou-te o livro.', hint: 'Cannot start sentence with clitic in PT → enclisis' },
      { type: 'fill', prompt: 'Quem ___ (te / dizer) isso?', answer: 'te disse', hint: 'Question word → proclisis' },
    ] },
  { id: 'verbal-periphrases', name: 'Verbal Periphrases', level: 'C1', category: 'verbs',
    scoba: `Common verbal periphrases:
  estar a + inf (PT) / estar + gerúndio (BR) = progressive
    "Estou a comer." (PT) = "Estou comendo." (BR)
  ir + gerúndio = gradual progression (BR)
    "Vai melhorando." = It keeps getting better.
  andar a + inf (PT) / andar + gerúndio (BR) = repeated/ongoing
    "Ando a estudar muito." (PT)
  acabar de + inf = just finished
    "Acabei de comer." = I just ate.
  deixar de + inf = to stop doing
    "Deixei de fumar." = I stopped smoking.
  voltar a + inf = to do again
    "Voltei a estudar." = I started studying again.`,
    exercises: [
      { type: 'fill', prompt: 'Eu ___ de comer. (just finished)', answer: 'acabei', hint: 'Acabar de + infinitive' },
      { type: 'fill', prompt: 'Ela ___ a trabalhar muito. (PT, repeated action)', answer: 'anda', hint: 'Andar a + infinitive (PT)' },
      { type: 'transform', prompt: 'Convert to BR: "Estou a comer."', answer: 'Estou comendo.', hint: 'PT: estar a + inf → BR: estar + gerúndio' },
    ] },

  // ── C2 ──
  { id: 'future-subjunctive-advanced', name: 'Future Subjunctive (advanced)', level: 'C2', category: 'verbs',
    scoba: `Advanced futuro do conjuntivo uses:
  → Legal/formal: "Quem infringir a lei será punido."
  → Proverbs: "Quem com ferro ferir, com ferro será ferido."
  → Complex relative: "Seja qual for a decisão..."
  → Compound: "Quando tiver terminado..." (future perfect subjunctive)
Note: In modern BR spoken, presente often replaces futuro do conjuntivo.
But in writing and formal contexts, it remains mandatory.`,
    exercises: [
      { type: 'fill', prompt: 'Quem ___ (infringir) a lei será punido.', answer: 'infringir', hint: 'Legal register: futuro do conjuntivo' },
      { type: 'fill', prompt: 'Quando ___ (ter) terminado, avise-me.', answer: 'tiver', hint: 'Compound future subjunctive: tiver + particípio' },
      { type: 'fill', prompt: 'Seja qual ___ (ser) a decisão, respeito-a.', answer: 'for', hint: 'ser → futuro conjuntivo: for' },
    ] },
  { id: 'register-br-pt', name: 'BR vs PT Grammar', level: 'C2', category: 'syntax',
    scoba: `Key grammatical differences:
  BR: gerúndio ("estou fazendo") / PT: a + infinitivo ("estou a fazer")
  BR: pronoun before verb default / PT: pronoun after verb default
  BR: "Eu te amo." / PT: "Eu amo-te."
  BR: uses "você" widely / PT: uses "tu" with tu-conjugations
  BR: "no/na" + gerúndio ("No chegando...") / PT: rare
  BR: "ter" for existence ("Tem gente aqui.") / PT: "Há gente aqui."
  BR: often drops articles before possessives / PT: keeps them
    BR: "Minha casa" / PT: "A minha casa"`,
    exercises: [
      { type: 'transform', prompt: 'Convert to PT: "Estou fazendo o jantar."', answer: 'Estou a fazer o jantar.', hint: 'BR gerúndio → PT a + infinitivo' },
      { type: 'transform', prompt: 'Convert to BR: "Eu amo-te."', answer: 'Eu te amo.', hint: 'PT enclisis → BR proclisis' },
      { type: 'transform', prompt: 'Convert to PT: "Tem muita gente aqui."', answer: 'Há muita gente aqui.', hint: 'BR "ter" for existence → PT "haver"' },
    ] },
];

// ─── Class ──────────────────────────────────────────────────────────────────

const DIR = dataDir(SKILL_NAME);
core.ensureDir(DIR);

function topicsForLevel(level) {
  const idx = CEFR.indexOf(level);
  if (idx < 0) return TOPICS;
  return TOPICS.filter(t => CEFR.indexOf(t.level) <= idx);
}

function findTopic(id) {
  return TOPICS.find(t => t.id === id) || null;
}

class GrammarTutor {
  getProfile(id) {
    const p = loadProfile(DIR, id);
    if (!p.skills) p.skills = {};
    if (!p.assessments) p.assessments = [];
    if (!p.sessions) p.sessions = [];
    return p;
  }

  setLevel(id, level) {
    if (!CEFR.includes(level)) throw new Error('Invalid CEFR level');
    const p = this.getProfile(id);
    p.level = level;
    saveProfile(DIR, p);
    return { studentId: id, level, topicsAvailable: topicsForLevel(level).length };
  }

  listStudents() { return listProfiles(DIR); }

  getTopicCatalog(level) {
    const topics = level ? topicsForLevel(level) : TOPICS;
    const byLevel = {};
    for (const t of topics) {
      if (!byLevel[t.level]) byLevel[t.level] = [];
      byLevel[t.level].push({ id: t.id, name: t.name, category: t.category });
    }
    return byLevel;
  }

  getScoba(topicId) {
    const t = findTopic(topicId);
    if (!t) throw new Error('Unknown topic: ' + topicId);
    return { id: t.id, name: t.name, level: t.level, scoba: t.scoba };
  }

  generateLesson(id, topicId) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const available = topicsForLevel(level);

    let topic;
    if (topicId) {
      topic = findTopic(topicId);
      if (!topic) throw new Error('Unknown topic: ' + topicId);
    } else {
      // Pick due or new topic
      const td = today();
      const due = available.filter(t => {
        const sk = p.skills[t.id];
        return sk && sk.nextReview && sk.nextReview <= td;
      });
      const fresh = available.filter(t => !p.skills[t.id]);
      topic = pick(due.length ? due : fresh.length ? fresh : available, 1)[0];
    }

    const exercises = pick(topic.exercises, Math.min(3, topic.exercises.length));

    return {
      studentId: id, level, date: today(),
      topic: { id: topic.id, name: topic.name, level: topic.level, category: topic.category },
      scoba: topic.scoba,
      exercises: exercises.map((e, i) => ({ index: i, ...e })),
    };
  }

  generateExercise(id, topicId, type) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const available = topicsForLevel(level);
    const topic = topicId ? findTopic(topicId) : pick(available, 1)[0];
    if (!topic) throw new Error('No topic found');
    let exercises = topic.exercises;
    if (type) exercises = exercises.filter(e => e.type === type);
    if (!exercises.length) exercises = topic.exercises;
    const ex = pick(exercises, 1)[0];
    return { topicId: topic.id, topicName: topic.name, ...ex };
  }

  checkAnswer(topicId, exerciseIndex, answer) {
    const t = findTopic(topicId);
    if (!t) throw new Error('Unknown topic: ' + topicId);
    const ex = t.exercises[exerciseIndex];
    if (!ex) throw new Error('Invalid exercise index');
    const correct = norm(answer) === norm(ex.answer) || norm(answer) === norm(ex.answer.split(' ... ').join(' '));
    return {
      topicId, exerciseIndex, correct,
      expected: ex.answer,
      given: answer,
      hint: correct ? null : ex.hint,
    };
  }

  recordAssessment(id, topicId, grade) {
    grade = Number(grade);
    if (!isValidGrade(grade, 1, 4)) throw new Error('Grade must be 1-4');
    const t = findTopic(topicId);
    if (!t) throw new Error('Unknown topic: ' + topicId);
    const p = this.getProfile(id);

    if (!p.skills[topicId]) {
      p.skills[topicId] = { difficulty: 5, stability: 1, lastReview: null, nextReview: null, attempts: [] };
    }
    const sk = p.skills[topicId];
    sk.stability = fsrsUpdateStability(sk.stability || 1, sk.difficulty || 5, grade);
    sk.difficulty = fsrsUpdateDifficulty(sk.difficulty || 5, grade);
    sk.lastReview = today();
    const interval = fsrsNextReview(sk.stability);
    const next = new Date();
    next.setDate(next.getDate() + interval);
    sk.nextReview = next.toISOString().slice(0, 10);
    sk.attempts.push({ date: today(), grade });

    p.assessments.push({ topicId, grade, date: today() });
    saveProfile(DIR, p);

    return {
      studentId: id, topicId, topicName: t.name, grade,
      mastery: masteryLabel(calcMastery(sk.attempts.map(a => ({ score: a.grade >= 3 ? 1 : 0, total: 1 })))),
      nextReview: sk.nextReview, interval,
    };
  }

  getProgress(id) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const available = topicsForLevel(level);
    const byCategory = {};
    for (const t of available) {
      if (!byCategory[t.category]) byCategory[t.category] = { total: 0, studied: 0, mastered: 0, topics: [] };
      const cat = byCategory[t.category];
      cat.total++;
      const sk = p.skills[t.id];
      const m = sk ? calcMastery(sk.attempts.map(a => ({ score: a.grade >= 3 ? 1 : 0, total: 1 }))) : 0;
      const status = !sk ? 'not-started' : m >= MASTERY_THRESHOLD ? 'mastered' : m >= 0.5 ? 'developing' : 'emerging';
      if (sk) cat.studied++;
      if (m >= MASTERY_THRESHOLD) cat.mastered++;
      cat.topics.push({ id: t.id, name: t.name, status, mastery: m, nextReview: sk ? sk.nextReview : null });
    }
    return { studentId: id, level, categories: byCategory };
  }

  getNextTopics(id, count) {
    const p = this.getProfile(id);
    const level = p.level || 'A1';
    const available = topicsForLevel(level);
    const td = today();
    const due = [];
    const fresh = [];
    for (const t of available) {
      const sk = p.skills[t.id];
      if (!sk) { fresh.push({ id: t.id, name: t.name, level: t.level, reason: 'new' }); continue; }
      if (sk.nextReview && sk.nextReview <= td) {
        due.push({ id: t.id, name: t.name, level: t.level, nextReview: sk.nextReview, reason: 'due' });
      }
    }
    const n = count || 5;
    return { studentId: id, due: due.slice(0, n), new: fresh.slice(0, n), totalDue: due.length, totalNew: fresh.length };
  }

  getReport(id) {
    const progress = this.getProgress(id);
    const next = this.getNextTopics(id);
    const p = this.getProfile(id);
    let totalStudied = 0, totalMastered = 0, totalTopics = 0;
    const catSummary = {};
    for (const [cat, data] of Object.entries(progress.categories)) {
      totalStudied += data.studied;
      totalMastered += data.mastered;
      totalTopics += data.total;
      catSummary[cat] = `${data.mastered}/${data.total} mastered`;
    }
    return {
      studentId: id, level: p.level || 'A1',
      summary: { totalTopics, totalStudied, totalMastered, percentMastered: totalTopics ? Math.round(totalMastered / totalTopics * 100) : 0 },
      categories: catSummary,
      dueForReview: next.totalDue,
      newRemaining: next.totalNew,
      recentAssessments: (p.assessments || []).slice(-10).reverse(),
    };
  }
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

const tutor = new GrammarTutor();

runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const id = args[1]; if (!id) throw new Error('Usage: start <studentId>');
      const p = tutor.getProfile(id);
      saveProfile(DIR, p);
      out({ status: 'ok', studentId: id, level: p.level || 'not set', topicsTracked: Object.keys(p.skills).length });
      break;
    }
    case 'set-level': {
      const id = args[1], lvl = args[2];
      if (!id || !lvl) throw new Error('Usage: set-level <id> <A1-C2>');
      out(tutor.setLevel(id, lvl.toUpperCase()));
      break;
    }
    case 'lesson': {
      const id = args[1], topicId = args[2] || null;
      if (!id) throw new Error('Usage: lesson <id> [topicId]');
      out(tutor.generateLesson(id, topicId));
      break;
    }
    case 'exercise': {
      const id = args[1], topicId = args[2] || null, type = args[3] || null;
      if (!id) throw new Error('Usage: exercise <id> [topicId] [type]');
      out(tutor.generateExercise(id, topicId, type));
      break;
    }
    case 'check': {
      const topicId = args[1], n = parseInt(args[2], 10), answer = args.slice(3).join(' ');
      if (!topicId || isNaN(n)) throw new Error('Usage: check <topicId> <exerciseIndex> <answer>');
      out(tutor.checkAnswer(topicId, n, answer));
      break;
    }
    case 'record': {
      const id = args[1], topicId = args[2], grade = args[3];
      if (!id || !topicId || !grade) throw new Error('Usage: record <id> <topicId> <1-4>');
      out(tutor.recordAssessment(id, topicId, grade));
      break;
    }
    case 'progress': {
      const id = args[1]; if (!id) throw new Error('Usage: progress <id>');
      out(tutor.getProgress(id));
      break;
    }
    case 'report': {
      const id = args[1]; if (!id) throw new Error('Usage: report <id>');
      out(tutor.getReport(id));
      break;
    }
    case 'next': {
      const id = args[1], count = args[2] ? parseInt(args[2], 10) : 5;
      if (!id) throw new Error('Usage: next <id> [count]');
      out(tutor.getNextTopics(id, count));
      break;
    }
    case 'topics': {
      const lvl = args[1] || null;
      out(tutor.getTopicCatalog(lvl ? lvl.toUpperCase() : null));
      break;
    }
    case 'scoba': {
      const topicId = args[1];
      if (!topicId) throw new Error('Usage: scoba <topicId>');
      out(tutor.getScoba(topicId));
      break;
    }
    case 'students': {
      out({ students: tutor.listStudents() });
      break;
    }
    case 'help':
      out({ commands: ['start','set-level','lesson','exercise','check','record','progress','report','next','topics','scoba','students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + cmd,
        commands: ['start','set-level','lesson','exercise','check','record','progress','report','next','topics','scoba','students'],
      });
  }
});

module.exports = { GrammarTutor, TOPICS };
