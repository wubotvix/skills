#!/usr/bin/env node
// Spanish Grammar Tutor — discovery-based grammar teaching with FSRS spaced repetition
'use strict';

const core = require('../_lib/core');
const { CEFR, MASTERY_THRESHOLD, DEFAULT_RETENTION,
        dataDir, loadProfile, saveProfile, listProfiles,
        calcMastery, masteryLabel,
        fsrsRetention, fsrsNextReview, fsrsUpdateStability, fsrsUpdateDifficulty,
        shuffle, pick, norm, today, runCLI } = core;

// ─── Embedded Grammar Data ──────────────────────────────────────────────────

const TOPICS = [
  // ── A1 ──
  { id: 'ser-estar-basic', name: 'Ser vs Estar (basic)', level: 'A1', category: 'verbs',
    scoba: `What are you describing?
  → IDENTITY (name, profession, nationality, material)?
      → SER: "Soy profesor." "La mesa es de madera."
  → LOCATION of a person or thing?
      → ESTAR: "Estoy en casa." "Madrid está en España."
  → TIME, DATE, or EVENT LOCATION?
      → SER: "Son las tres." "La fiesta es en mi casa."
  → TEMPORARY STATE (mood, health, position)?
      → ESTAR: "Estoy cansado." "La puerta está abierta."
  → ADJECTIVE that CHANGES MEANING?
      ser listo = clever / estar listo = ready
      ser aburrido = boring / estar aburrido = bored
      ser malo = bad person / estar malo = ill
      ser rico = wealthy / estar rico = delicious`,
    exercises: [
      { type: 'fill', prompt: 'Mi madre ___ (ser/estar) profesora.', answer: 'es', hint: 'Identity/profession → ser' },
      { type: 'fill', prompt: 'Nosotros ___ (ser/estar) en el parque.', answer: 'estamos', hint: 'Location → estar' },
      { type: 'fill', prompt: '___ (Ser/Estar) las dos de la tarde.', answer: 'son', hint: 'Time → ser' },
      { type: 'fill', prompt: 'María ___ (ser/estar) cansada hoy.', answer: 'está', hint: 'Temporary state → estar' },
      { type: 'error', prompt: 'Yo soy enfermo hoy.', answer: 'Yo estoy enfermo hoy.', hint: 'Illness is a temporary state → estar' },
      { type: 'error', prompt: 'La fiesta está en mi casa.', answer: 'La fiesta es en mi casa.', hint: 'Event location → ser' },
      { type: 'transform', prompt: 'Rewrite using estar: "Soy cansado."', answer: 'Estoy cansado.', hint: 'Temporary state → estar' },
    ] },
  { id: 'present-regular', name: 'Present Tense (regular)', level: 'A1', category: 'verbs',
    scoba: `Regular present tense endings:
  -AR verbs (hablar): -o, -as, -a, -amos, -áis, -an
  -ER verbs (comer):  -o, -es, -e, -emos, -éis, -en
  -IR verbs (vivir):  -o, -es, -e, -imos, -ís, -en`,
    exercises: [
      { type: 'fill', prompt: 'Yo ___ (hablar) español.', answer: 'hablo', hint: '-AR: yo → -o' },
      { type: 'fill', prompt: 'Ellos ___ (comer) en el restaurante.', answer: 'comen', hint: '-ER: ellos → -en' },
      { type: 'fill', prompt: 'Nosotros ___ (vivir) en Madrid.', answer: 'vivimos', hint: '-IR: nosotros → -imos' },
      { type: 'fill', prompt: 'Tú ___ (estudiar) mucho.', answer: 'estudias', hint: '-AR: tú → -as' },
      { type: 'error', prompt: 'Ella come mucho y hablan con su amiga.', answer: 'Ella come mucho y habla con su amiga.', hint: 'Subject is ella (3rd sing) for both verbs' },
      { type: 'transform', prompt: 'Change subject to nosotros: "Yo escribo cartas."', answer: 'Nosotros escribimos cartas.', hint: '-IR: nosotros → -imos' },
    ] },
  { id: 'gender-articles', name: 'Gender & Articles', level: 'A1', category: 'nouns',
    scoba: `Masculine: el (the), un (a) — usually ending in -o
Feminine: la (the), una (a) — usually ending in -a
Exceptions: el problema, el día, el mapa, la mano, la foto
Plural: los/las, unos/unas — add -s (vowel) or -es (consonant)`,
    exercises: [
      { type: 'fill', prompt: '___ (el/la) casa es grande.', answer: 'la', hint: 'casa ends in -a → feminine' },
      { type: 'fill', prompt: '___ (el/la) problema es difícil.', answer: 'el', hint: 'problema is an exception — masculine' },
      { type: 'fill', prompt: 'Tengo ___ (un/una) libro nuevo.', answer: 'un', hint: 'libro ends in -o → masculine' },
      { type: 'error', prompt: 'La problema es muy grande.', answer: 'El problema es muy grande.', hint: 'problema is masculine despite ending in -a' },
      { type: 'fill', prompt: '___ (Los/Las) ciudades son bonitas.', answer: 'Las', hint: 'ciudad is feminine' },
    ] },
  { id: 'adjective-agreement', name: 'Adjective Agreement', level: 'A1', category: 'nouns',
    scoba: `Adjectives must match the noun in gender and number:
  alto / alta / altos / altas
  inteligente / inteligente / inteligentes / inteligentes
Adjective usually follows the noun: "la casa blanca"`,
    exercises: [
      { type: 'fill', prompt: 'Las chicas son muy ___ (alto).', answer: 'altas', hint: 'Feminine plural → -as' },
      { type: 'fill', prompt: 'El coche es ___ (rojo).', answer: 'rojo', hint: 'Masculine singular → -o' },
      { type: 'error', prompt: 'Las flores son bonito.', answer: 'Las flores son bonitas.', hint: 'flores is feminine plural → bonitas' },
      { type: 'transform', prompt: 'Make plural: "El gato negro."', answer: 'Los gatos negros.', hint: 'Both noun and adjective become plural' },
    ] },
  { id: 'gustar', name: 'Gustar & Similar Verbs', level: 'A1', category: 'verbs',
    scoba: `Gustar works "backwards" from English:
  me gusta (I like — singular thing)
  me gustan (I like — plural things)
  te/le/nos/os/les gusta(n)
Similar verbs: encantar, molestar, interesar, importar, faltar`,
    exercises: [
      { type: 'fill', prompt: 'A mí me ___ (gustar) el chocolate.', answer: 'gusta', hint: 'Singular thing (el chocolate) → gusta' },
      { type: 'fill', prompt: 'A ellos les ___ (gustar) los deportes.', answer: 'gustan', hint: 'Plural thing (los deportes) → gustan' },
      { type: 'error', prompt: 'Yo gusto el café.', answer: 'A mí me gusta el café.', hint: 'Gustar uses indirect object + gusta/gustan' },
      { type: 'fill', prompt: 'A nosotros nos ___ (encantar) las películas.', answer: 'encantan', hint: 'Plural → encantan' },
    ] },
  { id: 'hay-estar', name: 'Hay vs Estar', level: 'A1', category: 'verbs',
    scoba: `Hay = existence ("there is/there are") — indefinite things
  "Hay un libro en la mesa."
Estar = location of specific/known things
  "El libro está en la mesa."`,
    exercises: [
      { type: 'fill', prompt: '___ (Hay/Está) un gato en el jardín.', answer: 'Hay', hint: 'Indefinite (un gato) → hay' },
      { type: 'fill', prompt: 'El gato ___ (hay/está) en el jardín.', answer: 'está', hint: 'Specific (el gato) → está' },
      { type: 'error', prompt: 'Está una farmacia cerca de aquí.', answer: 'Hay una farmacia cerca de aquí.', hint: 'Indefinite → hay' },
    ] },

  // ── A2 ──
  { id: 'preterite-regular', name: 'Preterite (regular)', level: 'A2', category: 'verbs',
    scoba: `Preterite = completed past actions
  -AR: -é, -aste, -ó, -amos, -asteis, -aron
  -ER/-IR: -í, -iste, -ió, -imos, -isteis, -ieron
Time markers: ayer, anoche, el lunes, la semana pasada`,
    exercises: [
      { type: 'fill', prompt: 'Ayer yo ___ (hablar) con mi madre.', answer: 'hablé', hint: '-AR: yo → -é' },
      { type: 'fill', prompt: 'Ellos ___ (comer) paella anoche.', answer: 'comieron', hint: '-ER: ellos → -ieron' },
      { type: 'fill', prompt: 'Tú ___ (escribir) una carta la semana pasada.', answer: 'escribiste', hint: '-IR: tú → -iste' },
      { type: 'error', prompt: 'Ayer nosotros comemos en un restaurante.', answer: 'Ayer nosotros comimos en un restaurante.', hint: 'Ayer = completed past → preterite' },
      { type: 'transform', prompt: 'Change to preterite: "María habla con Juan."', answer: 'María habló con Juan.', hint: '-AR: ella → -ó' },
    ] },
  { id: 'preterite-irregular', name: 'Preterite (key irregulars)', level: 'A2', category: 'verbs',
    scoba: `Key irregular preterite stems:
  ir/ser → fui, fuiste, fue, fuimos, fuisteis, fueron
  hacer → hice, hiciste, hizo, hicimos, hicisteis, hicieron
  tener → tuve; estar → estuve; poder → pude; poner → puse
  decir → dije; traer → traje; saber → supe; venir → vine`,
    exercises: [
      { type: 'fill', prompt: 'Ayer yo ___ (ir) al cine.', answer: 'fui', hint: 'ir → fui (irregular)' },
      { type: 'fill', prompt: 'Ella ___ (hacer) la tarea anoche.', answer: 'hizo', hint: 'hacer → hizo (irregular)' },
      { type: 'fill', prompt: 'Nosotros ___ (tener) un examen difícil.', answer: 'tuvimos', hint: 'tener → tuv- stem' },
      { type: 'error', prompt: 'Ayer yo hacé la cena.', answer: 'Ayer yo hice la cena.', hint: 'hacer → hice (irregular stem)' },
    ] },
  { id: 'reflexive-verbs', name: 'Reflexive Verbs', level: 'A2', category: 'verbs',
    scoba: `Reflexive = action on oneself. Pronoun before conjugated verb:
  me levanto, te levantas, se levanta, nos levantamos, os levantáis, se levantan
Common: levantarse, ducharse, acostarse, vestirse, sentarse, llamarse`,
    exercises: [
      { type: 'fill', prompt: 'Yo ___ (levantarse) a las siete.', answer: 'me levanto', hint: 'yo → me + levanto' },
      { type: 'fill', prompt: 'Ellos ___ (acostarse) tarde.', answer: 'se acuestan', hint: 'ellos → se + acuestan (o→ue stem change)' },
      { type: 'error', prompt: 'Yo levanto a las seis.', answer: 'Yo me levanto a las seis.', hint: 'Reflexive verb needs pronoun: me' },
      { type: 'transform', prompt: 'Make reflexive: "Ella lava." (herself)', answer: 'Ella se lava.', hint: 'Add se for ella' },
    ] },
  { id: 'ir-a-infinitive', name: 'Ir a + Infinitive', level: 'A2', category: 'verbs',
    scoba: `Near future: ir (conjugated) + a + infinitive
  Voy a estudiar. (I'm going to study.)
  Van a comer. (They're going to eat.)`,
    exercises: [
      { type: 'fill', prompt: 'Mañana nosotros ___ (ir a / viajar) a Barcelona.', answer: 'vamos a viajar', hint: 'nosotros → vamos + a + infinitive' },
      { type: 'fill', prompt: 'Ella ___ (ir a / comprar) un coche nuevo.', answer: 'va a comprar', hint: 'ella → va + a + infinitive' },
      { type: 'error', prompt: 'Yo ir a estudiar mañana.', answer: 'Yo voy a estudiar mañana.', hint: 'ir must be conjugated: yo → voy' },
    ] },
  { id: 'direct-object-pronouns', name: 'Direct Object Pronouns', level: 'A2', category: 'pronouns',
    scoba: `me, te, lo/la, nos, os, los/las
Placed BEFORE conjugated verb: "Lo veo." (I see him/it.)
With infinitive: after or before: "Voy a verlo." / "Lo voy a ver."`,
    exercises: [
      { type: 'fill', prompt: '¿El libro? Yo ___ leo todos los días.', answer: 'lo', hint: 'el libro → lo (masc. sing.)' },
      { type: 'fill', prompt: '¿Las flores? María ___ compra en el mercado.', answer: 'las', hint: 'las flores → las (fem. pl.)' },
      { type: 'transform', prompt: 'Replace the object with a pronoun: "Yo como la manzana."', answer: 'Yo la como.', hint: 'la manzana → la, placed before verb' },
    ] },
  { id: 'comparatives', name: 'Comparatives', level: 'A2', category: 'syntax',
    scoba: `más + adj + que = more than: "María es más alta que Juan."
menos + adj + que = less than: "Juan es menos alto que María."
tan + adj + como = as ... as: "Soy tan alto como tú."
Irregulars: mejor (better), peor (worse), mayor (older), menor (younger)`,
    exercises: [
      { type: 'fill', prompt: 'Madrid es ___ grande ___ Barcelona. (more ... than)', answer: 'mas grande que', hint: 'más + adj + que' },
      { type: 'fill', prompt: 'Mi hermano es ___ (better) que yo en fútbol.', answer: 'mejor', hint: 'better = mejor (irregular)' },
      { type: 'error', prompt: 'Ella es más buena que su hermana.', answer: 'Ella es mejor que su hermana.', hint: 'más buena → mejor (irregular)' },
    ] },

  // ── B1 ──
  { id: 'imperfect', name: 'Imperfect Tense', level: 'B1', category: 'verbs',
    scoba: `Imperfect = habitual/ongoing past
  -AR: -aba, -abas, -aba, -ábamos, -abais, -aban
  -ER/-IR: -ía, -ías, -ía, -íamos, -íais, -ían
Only 3 irregulars: ser (era), ir (iba), ver (veía)
Markers: siempre, todos los días, de niño, mientras, cuando`,
    exercises: [
      { type: 'fill', prompt: 'De niño, yo ___ (jugar) en el parque.', answer: 'jugaba', hint: '-AR imperfect: yo → -aba' },
      { type: 'fill', prompt: 'Cuando era joven, nosotros ___ (vivir) en México.', answer: 'vivíamos', hint: '-IR imperfect: nosotros → -íamos' },
      { type: 'fill', prompt: 'Mi abuela siempre ___ (cocinar) paella los domingos.', answer: 'cocinaba', hint: 'Habitual action → imperfect' },
      { type: 'error', prompt: 'Cuando era niño, yo fui al parque todos los días.', answer: 'Cuando era niño, yo iba al parque todos los días.', hint: 'Habitual past → imperfect: ir → iba' },
    ] },
  { id: 'preterite-vs-imperfect', name: 'Preterite vs Imperfect', level: 'B1', category: 'verbs',
    scoba: `Is the action COMPLETED (clear start/end, specific times)?
  → YES → PRETERITE: "Ayer comí paella."
  → NO  → Was it HABITUAL or ONGOING?
            → YES → IMPERFECT: "Siempre comía paella los domingos."
            → NO  → BACKGROUND (scene, weather, age, feelings)?
                      → YES → IMPERFECT: "Hacía sol. Tenía diez años."
                      → NO  → One action INTERRUPTS another?
                                → Ongoing = IMPERFECT: "Dormía cuando..."
                                → Interrupting = PRETERITE: "...sonó el teléfono."`,
    exercises: [
      { type: 'fill', prompt: 'Cuando yo ___ (ser) niño, ___ (vivir) en Barcelona.', answer: 'era vivía', hint: 'Ongoing background → imperfect for both' },
      { type: 'fill', prompt: 'Ayer ___ (llegar) tarde al trabajo.', answer: 'llegué', hint: 'Completed action yesterday → preterite' },
      { type: 'fill', prompt: 'Mientras ___ (llover), ___ (sonar) el teléfono.', answer: 'llovía sonó', hint: 'Ongoing=imperfect, interrupting=preterite' },
      { type: 'error', prompt: 'Ayer hacía buen tiempo y fui a la playa.', answer: 'Ayer hizo buen tiempo y fui a la playa.', hint: '"Ayer" makes the weather a completed observation → preterite' },
      { type: 'transform', prompt: 'Combine: "Dormía. El teléfono sonó." → one sentence', answer: 'Dormía cuando sonó el teléfono.', hint: 'Background (imperfect) + interruption (preterite)' },
    ] },
  { id: 'present-perfect', name: 'Present Perfect', level: 'B1', category: 'verbs',
    scoba: `haber (present) + past participle
  he, has, ha, hemos, habéis, han + -ado (AR) / -ido (ER/IR)
Irregulars: hecho, dicho, escrito, visto, puesto, vuelto, abierto, roto
Used for recent past or experiences: "He comido." "¿Has viajado a España?"`,
    exercises: [
      { type: 'fill', prompt: 'Yo ___ (comer) ya. No tengo hambre.', answer: 'he comido', hint: 'yo → he + -ido' },
      { type: 'fill', prompt: '¿Tú ___ (ver) esa película?', answer: 'has visto', hint: 'ver → visto (irregular participle)' },
      { type: 'fill', prompt: 'Ellos ___ (escribir) una carta.', answer: 'han escrito', hint: 'escribir → escrito (irregular)' },
      { type: 'error', prompt: 'Nosotros hemos escribido un libro.', answer: 'Nosotros hemos escrito un libro.', hint: 'escribir → escrito (irregular participle)' },
    ] },
  { id: 'subjunctive-intro', name: 'Subjunctive Present (intro)', level: 'B1', category: 'verbs',
    scoba: `Does the main clause express:
  → WISH (querer, desear, esperar, ojalá)? → SUBJUNCTIVE: "Quiero que vengas."
  → EMOTION (alegrarse, temer, molestar)? → SUBJUNCTIVE: "Me alegra que estés aquí."
  → IMPERSONAL (es importante, es posible)? → SUBJUNCTIVE: "Es necesario que estudies."
  → RECOMMENDATION (recomendar, aconsejar)? → SUBJUNCTIVE: "Te recomiendo que vayas."
  → DOUBT/DENIAL (dudar, no creer, negar)? → SUBJUNCTIVE: "Dudo que venga."
  → OJALÁ? → ALWAYS SUBJUNCTIVE: "Ojalá que llueva."
  → NONE (fact, belief)? → INDICATIVE: "Creo que viene."
Remember WEIRDO: Wishes, Emotions, Impersonal, Recommendations, Doubt, Ojalá`,
    exercises: [
      { type: 'fill', prompt: 'Quiero que tú ___ (venir) a la fiesta.', answer: 'vengas', hint: 'Wish (quiero que) → subjunctive' },
      { type: 'fill', prompt: 'Es importante que nosotros ___ (estudiar).', answer: 'estudiemos', hint: 'Impersonal expression → subjunctive' },
      { type: 'fill', prompt: 'Dudo que él ___ (saber) la respuesta.', answer: 'sepa', hint: 'Doubt → subjunctive; saber → sepa' },
      { type: 'error', prompt: 'Espero que vienes mañana.', answer: 'Espero que vengas mañana.', hint: 'esperar que → subjunctive: vengas' },
      { type: 'fill', prompt: 'Me alegra que ustedes ___ (estar) aquí.', answer: 'estén', hint: 'Emotion → subjunctive; estar → estén' },
    ] },
  { id: 'por-vs-para', name: 'Por vs Para', level: 'B1', category: 'prepositions',
    scoba: `PARA (destination, purpose, recipient, deadline):
  PURPOSE: "Estudio para aprender."
  RECIPIENT: "Este regalo es para ti."
  DESTINATION: "Salgo para Madrid."
  DEADLINE: "Lo necesito para el viernes."
POR (cause, exchange, through, duration, means):
  CAUSE: "Lo hizo por amor."
  EXCHANGE: "Pagué 20 euros por el libro."
  THROUGH: "Caminamos por el parque."
  DURATION: "Estudié por tres horas."
  MEANS: "Lo envié por correo."
  AGENT (passive): "Fue escrito por Cervantes."`,
    exercises: [
      { type: 'fill', prompt: 'Estudio español ___ (por/para) mi trabajo.', answer: 'para', hint: 'Purpose → para' },
      { type: 'fill', prompt: 'Pagué 50 euros ___ (por/para) el libro.', answer: 'por', hint: 'Exchange → por' },
      { type: 'fill', prompt: 'Caminamos ___ (por/para) el centro de la ciudad.', answer: 'por', hint: 'Through/along → por' },
      { type: 'fill', prompt: 'Este regalo es ___ (por/para) ti.', answer: 'para', hint: 'Recipient → para' },
      { type: 'error', prompt: 'Estudio por aprender español.', answer: 'Estudio para aprender español.', hint: 'Purpose (in order to) → para' },
    ] },
  { id: 'indirect-object-pronouns', name: 'Indirect Object Pronouns', level: 'B1', category: 'pronouns',
    scoba: `me, te, le, nos, os, les — placed before conjugated verb
"Le di el libro." (I gave him/her the book.)
Double pronouns: le/les → se before lo/la/los/las
"Se lo di." (I gave it to him/her.)`,
    exercises: [
      { type: 'fill', prompt: 'Yo ___ doy el regalo a María.', answer: 'le', hint: 'a María → indirect object → le' },
      { type: 'fill', prompt: '¿___ puedes dar el libro? (to me)', answer: 'me', hint: 'to me → me' },
      { type: 'transform', prompt: 'Replace both objects: "Yo di el libro a Juan."', answer: 'Yo se lo di.', hint: 'le + lo → se lo' },
    ] },
  { id: 'conditional', name: 'Conditional Tense', level: 'B1', category: 'verbs',
    scoba: `Infinitive + -ía, -ías, -ía, -íamos, -íais, -ían
Same irregulars as future: tendría, haría, podría, sabría, querría, diría, vendría
Uses: polite requests, hypotheticals, advice
"¿Podrías ayudarme?" "Yo comería paella."`,
    exercises: [
      { type: 'fill', prompt: '¿___ (poder, tú) ayudarme, por favor?', answer: 'podrías', hint: 'Polite request → conditional; poder → podr-' },
      { type: 'fill', prompt: 'Yo ___ (comer) en ese restaurante.', answer: 'comería', hint: 'Hypothetical → conditional: infinitive + -ía' },
      { type: 'fill', prompt: 'Nosotros ___ (viajar) a Japón si tuviéramos dinero.', answer: 'viajaríamos', hint: 'Hypothetical → conditional' },
      { type: 'error', prompt: 'Yo querré ir al cine.', answer: 'Yo querría ir al cine.', hint: 'Hypothetical want → conditional, not future' },
    ] },

  // ── B2 ──
  { id: 'subjunctive-full', name: 'Subjunctive (full mastery)', level: 'B2', category: 'verbs',
    scoba: `All triggers: doubt, emotion, denial, impersonal, purpose clauses, unknown antecedent
Key contrast:
  "Creo que viene." (certainty → indicative)
  "No creo que venga." (doubt → subjunctive)
  "Busco a alguien que habla inglés." (known person → indicative)
  "Busco a alguien que hable inglés." (unknown/hypothetical → subjunctive)`,
    exercises: [
      { type: 'fill', prompt: 'No creo que ella ___ (tener) razón.', answer: 'tenga', hint: 'Doubt (no creo que) → subjunctive' },
      { type: 'fill', prompt: 'Busco un hotel que ___ (tener) piscina.', answer: 'tenga', hint: 'Unknown antecedent → subjunctive' },
      { type: 'fill', prompt: 'Te llamo para que ___ (saber) la noticia.', answer: 'sepas', hint: 'Purpose clause (para que) → subjunctive' },
      { type: 'error', prompt: 'No pienso que tiene razón.', answer: 'No pienso que tenga razón.', hint: 'Negative belief → subjunctive' },
    ] },
  { id: 'imperfect-subjunctive', name: 'Imperfect Subjunctive', level: 'B2', category: 'verbs',
    scoba: `Formation: 3rd person plural preterite → drop -ron → add -ra/-se endings
  hablaron → habla-ra, habla-ras, habla-ra, hablá-ramos, habla-rais, habla-ran
Uses: si clauses, past wishes, polite requests
  "Si tuviera dinero, viajaría." "Quería que vinieras."`,
    exercises: [
      { type: 'fill', prompt: 'Si yo ___ (tener) más tiempo, estudiaría más.', answer: 'tuviera', hint: 'Si + imperfect subjunctive: tener → tuviera' },
      { type: 'fill', prompt: 'Quería que tú ___ (venir) a mi fiesta.', answer: 'vinieras', hint: 'Past wish → imperfect subjunctive' },
      { type: 'fill', prompt: 'Si ___ (ser) posible, me quedaría en casa.', answer: 'fuera', hint: 'Hypothetical si clause → imperfect subjunctive' },
      { type: 'error', prompt: 'Si tendría dinero, compraría un coche.', answer: 'Si tuviera dinero, compraría un coche.', hint: 'Si clause takes subjunctive, not conditional' },
    ] },
  { id: 'si-clauses', name: 'Si Clauses (conditionals)', level: 'B2', category: 'syntax',
    scoba: `Type 1 (real/possible): Si + present + present/future
  "Si llueve, me quedo en casa."
Type 2 (unreal present): Si + imperfect subjunctive + conditional
  "Si tuviera dinero, viajaría."
Type 3 (unreal past): Si + pluperfect subjunctive + conditional perfect
  "Si hubiera estudiado, habría aprobado."
NEVER: Si + conditional / Si + present subjunctive`,
    exercises: [
      { type: 'fill', prompt: 'Si ___ (llover), no iremos al parque.', answer: 'llueve', hint: 'Real condition → si + present' },
      { type: 'fill', prompt: 'Si yo ___ (ser) rico, compraría una isla.', answer: 'fuera', hint: 'Unreal present → si + imperfect subjunctive' },
      { type: 'error', prompt: 'Si tendría tiempo, iría al cine.', answer: 'Si tuviera tiempo, iría al cine.', hint: 'NEVER si + conditional. Use imperfect subjunctive.' },
      { type: 'transform', prompt: 'Make hypothetical: "Si tengo tiempo, voy al cine."', answer: 'Si tuviera tiempo, iría al cine.', hint: 'Present → imperfect subjunctive; present → conditional' },
    ] },
  { id: 'passive-voice', name: 'Passive Voice', level: 'B2', category: 'syntax',
    scoba: `ser + past participle + por (agent): "El libro fue escrito por Cervantes."
se pasiva (no agent): "Se habla español aquí."
estar + past participle (result): "La puerta está cerrada."`,
    exercises: [
      { type: 'fill', prompt: 'El cuadro ___ (pintar, passive) por Picasso.', answer: 'fue pintado', hint: 'ser + participle + por' },
      { type: 'fill', prompt: 'Aquí ___ (hablar, se pasiva) inglés y español.', answer: 'se hablan', hint: 'se + verb (plural for plural subject)' },
      { type: 'transform', prompt: 'Make passive: "Cervantes escribió Don Quijote."', answer: 'Don Quijote fue escrito por Cervantes.', hint: 'ser + past participle + por + agent' },
    ] },
  { id: 'advanced-ser-estar', name: 'Advanced Ser vs Estar', level: 'B2', category: 'verbs',
    scoba: `Adjectives that change meaning:
  ser listo = clever / estar listo = ready
  ser aburrido = boring / estar aburrido = bored
  ser malo = bad / estar malo = ill
  ser bueno = good / estar bueno = tasty/attractive
  ser vivo = clever / estar vivo = alive
  ser rico = wealthy / estar rico = delicious`,
    exercises: [
      { type: 'fill', prompt: 'El estudiante ___ (ser/estar) muy listo, siempre saca buenas notas.', answer: 'es', hint: 'clever (inherent quality) → ser listo' },
      { type: 'fill', prompt: '¿Ya ___ (ser/estar) listos para salir?', answer: 'están', hint: 'ready (state) → estar listo' },
      { type: 'fill', prompt: 'Esta paella ___ (ser/estar) muy rica.', answer: 'está', hint: 'delicious (current experience) → estar rico' },
      { type: 'error', prompt: 'Mi abuelo es malo. Está en el hospital.', answer: 'Mi abuelo está malo. Está en el hospital.', hint: 'Ill → estar malo (not ser malo = bad person)' },
    ] },
  { id: 'reported-speech', name: 'Reported Speech', level: 'B2', category: 'syntax',
    scoba: `Direct → Indirect: tense backshift
  "Tengo hambre." → Dijo que tenía hambre.
  "Iré mañana." → Dijo que iría al día siguiente.
  present → imperfect, preterite → pluperfect, future → conditional
  hoy → ese día, mañana → al día siguiente, ayer → el día anterior`,
    exercises: [
      { type: 'transform', prompt: 'Report: María dijo: "Tengo hambre."', answer: 'María dijo que tenía hambre.', hint: 'present → imperfect' },
      { type: 'transform', prompt: 'Report: Juan dijo: "Iré mañana."', answer: 'Juan dijo que iría al día siguiente.', hint: 'future → conditional; mañana → al día siguiente' },
      { type: 'fill', prompt: 'Ella me dijo que ___ (estar) enferma.', answer: 'estaba', hint: 'Tense backshift: está → estaba' },
    ] },

  // ── C1 ──
  { id: 'pluperfect-subjunctive', name: 'Pluperfect Subjunctive', level: 'C1', category: 'verbs',
    scoba: `hubiera/hubiese + past participle
  "Si hubiera sabido, no habría venido."
  "Ojalá hubiera estudiado más."
Used for: past unreal conditions, past regrets, past wishes`,
    exercises: [
      { type: 'fill', prompt: 'Si yo ___ (saber) la verdad, te habría dicho.', answer: 'hubiera sabido', hint: 'Past unreal → hubiera + participle' },
      { type: 'fill', prompt: 'Ojalá nosotros ___ (llegar) a tiempo.', answer: 'hubiéramos llegado', hint: 'Past wish → ojalá + pluperfect subjunctive' },
      { type: 'error', prompt: 'Si habría estudiado, habría aprobado.', answer: 'Si hubiera estudiado, habría aprobado.', hint: 'Si clause → subjunctive, never conditional' },
    ] },
  { id: 'si-clauses-past', name: 'Si Clauses (past unreal)', level: 'C1', category: 'syntax',
    scoba: `Si + pluperfect subjunctive + conditional perfect
  "Si hubiera estudiado, habría aprobado."
  "Si no hubiera llovido, habríamos ido a la playa."
Mixed: Si + pluperfect subj + conditional (present result)
  "Si hubiera estudiado medicina, sería doctor ahora."`,
    exercises: [
      { type: 'fill', prompt: 'Si ___ (llover, neg), habríamos ido a la playa.', answer: 'no hubiera llovido', hint: 'Past unreal → si + pluperfect subjunctive' },
      { type: 'fill', prompt: 'Si ella hubiera aceptado el trabajo, ahora ___ (vivir) en Madrid.', answer: 'viviría', hint: 'Mixed conditional: past cause → present result → conditional' },
      { type: 'transform', prompt: 'Make past unreal: "Si tengo tiempo, voy."', answer: 'Si hubiera tenido tiempo, habría ido.', hint: 'Both clauses shift to past unreal' },
    ] },
  { id: 'concessive-clauses', name: 'Concessive Clauses', level: 'C1', category: 'syntax',
    scoba: `aunque + indicative = factual concession: "Aunque llueve, salgo." (It IS raining, but I go out.)
aunque + subjunctive = hypothetical: "Aunque llueva, saldré." (Even IF it rains...)
Other: a pesar de que, por mucho que, por más que + subjunctive`,
    exercises: [
      { type: 'fill', prompt: 'Aunque ___ (llover), voy a salir. [it IS raining]', answer: 'llueve', hint: 'Factual → indicative' },
      { type: 'fill', prompt: 'Aunque ___ (llover), saldré. [even if it rains]', answer: 'llueva', hint: 'Hypothetical → subjunctive' },
      { type: 'fill', prompt: 'Por mucho que ___ (estudiar, tú), no aprobarás sin práctica.', answer: 'estudies', hint: 'por mucho que + subjunctive' },
    ] },
  { id: 'verbal-periphrases', name: 'Verbal Periphrases', level: 'C1', category: 'verbs',
    scoba: `llevar + gerund: duration ("Llevo tres años viviendo aquí.")
ir + gerund: gradual process ("Voy entendiendo.")
acabar de + inf: just did ("Acabo de llegar.")
dejar de + inf: stop doing ("Dejé de fumar.")
volver a + inf: do again ("Volvió a llamar.")
ponerse a + inf: start suddenly ("Se puso a llorar.")`,
    exercises: [
      { type: 'fill', prompt: 'Yo ___ tres años estudiando español. (llevar)', answer: 'llevo', hint: 'llevar + gerund for duration' },
      { type: 'fill', prompt: 'Ella ___ de llegar. (acabar)', answer: 'acaba', hint: 'acabar de + inf = just did' },
      { type: 'fill', prompt: 'El niño ___ a llorar de repente. (ponerse)', answer: 'se puso', hint: 'ponerse a + inf = started suddenly' },
      { type: 'transform', prompt: 'Express with volver a: "Llamó otra vez."', answer: 'Volvió a llamar.', hint: 'volver a + inf = do again' },
    ] },
  { id: 'advanced-relative-clauses', name: 'Advanced Relative Clauses', level: 'C1', category: 'syntax',
    scoba: `cuyo/a/os/as = whose (agrees with possessed noun)
  "El autor cuyo libro leí..." (The author whose book I read...)
el cual / la cual = which (after prepositions, formal)
  "La razón por la cual vino..."
lo cual = which (refers to whole clause)
  "Llegó tarde, lo cual me molestó."`,
    exercises: [
      { type: 'fill', prompt: 'El profesor ___ clase es difícil es muy bueno. (whose)', answer: 'cuya', hint: 'cuyo agrees with clase (feminine) → cuya' },
      { type: 'fill', prompt: 'Llegó tarde, ___ me molestó mucho.', answer: 'lo cual', hint: 'Refers to whole previous clause → lo cual' },
      { type: 'fill', prompt: 'La casa en ___ vivimos es antigua.', answer: 'la que', hint: 'After preposition + article → la que' },
    ] },
  { id: 'discourse-markers', name: 'Discourse Markers', level: 'C1', category: 'syntax',
    scoba: `Contrast: sin embargo, no obstante, en cambio, por el contrario
Consequence: por lo tanto, en consecuencia, de ahí que (+subj)
Addition: además, es más, incluso, de hecho
Reformulation: es decir, o sea, en otras palabras
Concession: a pesar de (que), si bien`,
    exercises: [
      { type: 'fill', prompt: 'Estudié mucho; ___, aprobé el examen. (therefore)', answer: 'por lo tanto', hint: 'Consequence → por lo tanto' },
      { type: 'fill', prompt: 'No me gusta el café; ___, prefiero el té. (on the other hand)', answer: 'en cambio', hint: 'Contrast → en cambio' },
      { type: 'fill', prompt: 'Es un buen restaurante. ___, es el mejor de la ciudad. (in fact)', answer: 'De hecho', hint: 'Strengthening → de hecho' },
    ] },

  // ── C2 ──
  { id: 'future-subjunctive', name: 'Future Subjunctive', level: 'C2', category: 'verbs',
    scoba: `Archaic form found in legal/literary texts.
Formation: like imperfect subjunctive -ra but with -re ending
  hablar → hablare, hablares, hablare, habláremos, hablareis, hablaren
"Si hubiere lugar..." (If there should be cause...)
"Donde fueres, haz lo que vieres." (proverb: When in Rome...)`,
    exercises: [
      { type: 'fill', prompt: '"Donde ___ (ir, tú), haz lo que ___ (ver, tú)."', answer: 'fueres vieres', hint: 'Literary proverb: future subjunctive' },
      { type: 'fill', prompt: '"Si el acusado ___ (cometer) dicho delito..." (legal)', answer: 'cometiere', hint: 'Legal register: future subjunctive' },
      { type: 'transform', prompt: 'Modernize: "Si hubiere problema, avisad."', answer: 'Si hay problema, avisad.', hint: 'Future subjunctive → present indicative in modern Spanish' },
    ] },
  { id: 'register-grammar', name: 'Register-Dependent Grammar', level: 'C2', category: 'syntax',
    scoba: `Voseo (Argentina, Uruguay, Central America):
  vos hablás, vos comés, vos vivís (present)
  vos hablá, vos comé, vos viví (imperative)
Latin America: ustedes replaces vosotros entirely
Formal correspondence: use subjunctive, impersonal se, conditional politeness`,
    exercises: [
      { type: 'transform', prompt: 'Rewrite in voseo: "Tú hablas muy bien."', answer: 'Vos hablás muy bien.', hint: 'tú → vos, hablas → hablás' },
      { type: 'transform', prompt: 'Rewrite for Latin America: "Vosotros coméis bien."', answer: 'Ustedes comen bien.', hint: 'vosotros → ustedes, coméis → comen' },
      { type: 'fill', prompt: '(Voseo imperative) ¡___ (venir) acá, vos!', answer: 'vení', hint: 'Voseo imperative: venir → vení' },
    ] },
  { id: 'subtle-mood', name: 'Subtle Mood Distinctions', level: 'C2', category: 'verbs',
    scoba: `Relative clauses with known vs unknown antecedent:
  "Busco al profesor que HABLA inglés." (I know who — indicative)
  "Busco un profesor que HABLE inglés." (anyone who — subjunctive)
Journalistic subjunctive: optional for reported uncertain events
  "El gobierno anunció que revisará / revise la ley."`,
    exercises: [
      { type: 'fill', prompt: 'Busco al estudiante que ___ (hablar) chino. [I know who]', answer: 'habla', hint: 'Known antecedent → indicative' },
      { type: 'fill', prompt: 'Necesito alguien que ___ (hablar) chino. [anyone]', answer: 'hable', hint: 'Unknown antecedent → subjunctive' },
      { type: 'fill', prompt: 'No hay nadie que ___ (poder) resolver esto.', answer: 'pueda', hint: 'Negative antecedent (nadie) → subjunctive' },
    ] },
  { id: 'dialectal-variation', name: 'Dialectal Variation', level: 'C2', category: 'syntax',
    scoba: `Leísmo (Spain): le used for masculine direct objects
  "Le vi ayer." (= Lo vi ayer.)
Dequeísmo: incorrect insertion of "de" before "que"
  *"Pienso de que..." → "Pienso que..."
Queísmo: incorrect omission of "de" before "que"
  *"Me alegro que..." → "Me alegro de que..."`,
    exercises: [
      { type: 'fill', prompt: '(Standard) Yo ___ vi ayer en el parque. (him)', answer: 'lo', hint: 'Standard: direct object masculine → lo' },
      { type: 'error', prompt: 'Pienso de que tienes razón.', answer: 'Pienso que tienes razón.', hint: 'Dequeísmo: pensar takes que, not de que' },
      { type: 'error', prompt: 'Me alegro que estés bien.', answer: 'Me alegro de que estés bien.', hint: 'Queísmo: alegrarse de que, not alegrarse que' },
    ] },
];

// ─── Class ──────────────────────────────────────────────────────────────────

class GrammarTutor {
  constructor() {
    this.dir = dataDir('spanish-grammar');
  }

  // ── Profile ──

  getProfile(studentId) {
    return loadProfile(this.dir, studentId);
  }

  _save(p) {
    saveProfile(this.dir, p);
  }

  setLevel(studentId, level) {
    level = level.toUpperCase();
    if (!CEFR.includes(level)) throw new Error(`Invalid level. Use: ${CEFR.join(', ')}`);
    const p = this.getProfile(studentId);
    p.level = level;
    this._save(p);
    return { studentId, level };
  }

  // ── Topic Catalog ──

  getTopicCatalog(level) {
    const topics = level ? TOPICS.filter(t => t.level === level) : TOPICS;
    return topics.map(t => ({ id: t.id, name: t.name, level: t.level, category: t.category, exercises: t.exercises.length }));
  }

  getScoba(topicId) {
    const t = TOPICS.find(t => t.id === topicId);
    if (!t) throw new Error(`Unknown topic: ${topicId}`);
    return { id: t.id, name: t.name, level: t.level, scoba: t.scoba };
  }

  // ── Lesson Generation ──

  generateLesson(studentId, topicId) {
    const p = this.getProfile(studentId);
    const t = topicId ? TOPICS.find(t => t.id === topicId) : this._nextTopic(p);
    if (!t) throw new Error(topicId ? `Unknown topic: ${topicId}` : 'No topics available. Set a level first.');
    const exercises = pick(t.exercises, 3);
    return {
      topic: { id: t.id, name: t.name, level: t.level, category: t.category },
      scoba: t.scoba,
      exercises: exercises.map((e, i) => ({ n: i + 1, type: e.type, prompt: e.prompt })),
      flow: [
        'Step 1: Read the SCOBA decision flowchart above.',
        'Step 2: Try each exercise below.',
        'Step 3: Use "check <n> <answer>" to check your answers.',
        'Step 4: Use "record <studentId> <topicId> <grade 1-4>" to log mastery.',
      ],
    };
  }

  // ── Exercise Generation ──

  generateExercise(studentId, topicId, type) {
    const p = this.getProfile(studentId);
    let pool;
    if (topicId) {
      const t = TOPICS.find(t => t.id === topicId);
      if (!t) throw new Error(`Unknown topic: ${topicId}`);
      pool = t.exercises;
    } else {
      const level = p.level || 'A1';
      const levelTopics = TOPICS.filter(t => t.level === level);
      pool = levelTopics.flatMap(t => t.exercises);
    }
    if (type) pool = pool.filter(e => e.type === type);
    if (!pool.length) throw new Error('No exercises match the criteria.');
    const ex = pick(pool, 1)[0];
    return { type: ex.type, prompt: ex.prompt, _hint: ex.hint };
  }

  // ── Answer Checking ──

  checkAnswer(topicId, exerciseIndex, userAnswer) {
    const t = TOPICS.find(t => t.id === topicId);
    if (!t) throw new Error(`Unknown topic: ${topicId}`);
    const idx = exerciseIndex - 1;
    if (idx < 0 || idx >= t.exercises.length) throw new Error(`Exercise index out of range (1-${t.exercises.length}).`);
    const ex = t.exercises[idx];
    const correct = norm(userAnswer) === norm(ex.answer);
    return {
      correct,
      expected: ex.answer,
      given: userAnswer,
      hint: correct ? null : ex.hint,
      type: ex.type,
    };
  }

  // ── Assessment Recording ──

  recordAssessment(studentId, topicId, grade) {
    grade = Number(grade);
    if (![1, 2, 3, 4].includes(grade)) throw new Error('Grade must be 1 (Again), 2 (Hard), 3 (Good), or 4 (Easy).');
    const t = TOPICS.find(t => t.id === topicId);
    if (!t) throw new Error(`Unknown topic: ${topicId}`);
    const p = this.getProfile(studentId);
    if (!p.skills[topicId]) {
      p.skills[topicId] = { difficulty: 5, stability: 1, lastReview: null, attempts: [] };
    }
    const sk = p.skills[topicId];
    sk.stability = fsrsUpdateStability(sk.stability, sk.difficulty, grade);
    sk.difficulty = fsrsUpdateDifficulty(sk.difficulty, grade);
    sk.lastReview = today();
    sk.attempts.push({ date: today(), score: grade >= 3 ? 1 : 0, total: 1 });
    p.assessments.push({ topicId, grade, date: today() });
    this._save(p);
    const mastery = calcMastery(sk.attempts);
    return {
      topicId, grade,
      gradeLabel: ['', 'Again', 'Hard', 'Good', 'Easy'][grade],
      difficulty: sk.difficulty, stability: sk.stability,
      nextReview: fsrsNextReview(sk.stability, DEFAULT_RETENTION),
      mastery, masteryLabel: masteryLabel(mastery),
    };
  }

  // ── Progress & Reports ──

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const levelTopics = TOPICS.filter(t => t.level === level);
    const skills = levelTopics.map(t => {
      const sk = p.skills[t.id];
      if (!sk) return { id: t.id, name: t.name, status: 'not-started', mastery: 0 };
      const mastery = calcMastery(sk.attempts);
      const daysSince = sk.lastReview ? Math.floor((Date.now() - new Date(sk.lastReview).getTime()) / 86400000) : null;
      const R = sk.lastReview ? fsrsRetention(daysSince, sk.stability) : 0;
      return {
        id: t.id, name: t.name, mastery, status: masteryLabel(mastery),
        difficulty: sk.difficulty, stability: sk.stability, R: Math.round(R * 100) / 100,
        nextReview: fsrsNextReview(sk.stability, DEFAULT_RETENTION),
        dueForReview: R < DEFAULT_RETENTION,
      };
    });
    const totalMastery = skills.length ? Math.round(skills.reduce((s, sk) => s + sk.mastery, 0) / skills.length * 100) / 100 : 0;
    return { studentId, level, totalMastery, skills };
  }

  getNextTopics(studentId, count) {
    count = count || 5;
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    // Prioritize: due for review, then not started, then by level order
    const levelTopics = TOPICS.filter(t => t.level === level);
    const due = [];
    const notStarted = [];
    for (const t of levelTopics) {
      const sk = p.skills[t.id];
      if (!sk) { notStarted.push({ id: t.id, name: t.name, reason: 'not-started' }); continue; }
      const daysSince = sk.lastReview ? Math.floor((Date.now() - new Date(sk.lastReview).getTime()) / 86400000) : 999;
      const R = fsrsRetention(daysSince, sk.stability);
      if (R < DEFAULT_RETENTION) {
        due.push({ id: t.id, name: t.name, reason: 'due-for-review', R: Math.round(R * 100) / 100 });
      }
    }
    return { studentId, level, next: [...due, ...notStarted].slice(0, count) };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const recentAssessments = (p.assessments || []).slice(-10).reverse();
    const byCategory = {};
    for (const t of TOPICS.filter(t => t.level === (p.level || 'A1'))) {
      if (!byCategory[t.category]) byCategory[t.category] = { total: 0, mastered: 0 };
      byCategory[t.category].total++;
      const sk = p.skills[t.id];
      if (sk && calcMastery(sk.attempts) >= MASTERY_THRESHOLD) byCategory[t.category].mastered++;
    }
    return {
      studentId, level: p.level || 'A1',
      totalMastery: progress.totalMastery,
      categoryBreakdown: byCategory,
      recentAssessments,
      topicCount: progress.skills.length,
      masteredCount: progress.skills.filter(s => s.mastery >= MASTERY_THRESHOLD).length,
    };
  }

  listStudents() {
    return listProfiles(this.dir);
  }

  // ── Internal ──

  _nextTopic(p) {
    const level = p.level || 'A1';
    const levelTopics = TOPICS.filter(t => t.level === level);
    // First: due for review
    for (const t of levelTopics) {
      const sk = p.skills[t.id];
      if (sk && sk.lastReview) {
        const days = Math.floor((Date.now() - new Date(sk.lastReview).getTime()) / 86400000);
        if (fsrsRetention(days, sk.stability) < DEFAULT_RETENTION) return t;
      }
    }
    // Then: not started
    for (const t of levelTopics) {
      if (!p.skills[t.id]) return t;
    }
    // All done at this level — pick lowest mastery
    return levelTopics.reduce((best, t) => {
      const m = p.skills[t.id] ? calcMastery(p.skills[t.id].attempts) : 0;
      const bm = best && p.skills[best.id] ? calcMastery(p.skills[best.id].attempts) : 1;
      return m < bm ? t : best;
    }, levelTopics[0]);
  }
}

// ─── CLI ────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const tutor = new GrammarTutor();
  runCLI((cmd, args, out) => {
    const sid = args[1];
    switch (cmd) {
      case 'start':
        if (!sid) throw new Error('Usage: start <studentId>');
        out(tutor.getProfile(sid));
        break;
      case 'set-level':
        if (!sid || !args[2]) throw new Error('Usage: set-level <studentId> <A1|A2|B1|B2|C1|C2>');
        out(tutor.setLevel(sid, args[2].toUpperCase()));
        break;
      case 'lesson':
        if (!sid) throw new Error('Usage: lesson <studentId> [topicId]');
        out(tutor.generateLesson(sid, args[2] || null));
        break;
      case 'exercise':
        if (!sid) throw new Error('Usage: exercise <studentId> [topicId] [fill|error|transform]');
        out(tutor.generateExercise(sid, args[2] || null, args[3] || null));
        break;
      case 'check':
        if (!args[1] || !args[2] || !args[3]) throw new Error('Usage: check <topicId> <exerciseIndex> <answer...>');
        out(tutor.checkAnswer(args[1], Number(args[2]), args.slice(3).join(' ')));
        break;
      case 'record':
        if (!sid || !args[2] || !args[3]) throw new Error('Usage: record <studentId> <topicId> <grade 1-4>');
        out(tutor.recordAssessment(sid, args[2], Number(args[3])));
        break;
      case 'progress':
        if (!sid) throw new Error('Usage: progress <studentId>');
        out(tutor.getProgress(sid));
        break;
      case 'report':
        if (!sid) throw new Error('Usage: report <studentId>');
        out(tutor.getReport(sid));
        break;
      case 'next':
        if (!sid) throw new Error('Usage: next <studentId> [count]');
        out(tutor.getNextTopics(sid, args[2] ? Number(args[2]) : 5));
        break;
      case 'topics':
        out(tutor.getTopicCatalog(args[1] || null));
        break;
      case 'scoba':
        if (!args[1]) throw new Error('Usage: scoba <topicId>');
        out(tutor.getScoba(args[1]));
        break;
      case 'students':
        out({ students: tutor.listStudents() });
        break;
      case 'help':
        out({ info: 'Use one of the commands listed in SKILL.md' });
        break;
      default:
        out({
          commands: {
            'start <studentId>': 'Load or create a student profile',
            'set-level <studentId> <level>': 'Set CEFR level (A1-C2)',
            'lesson <studentId> [topicId]': 'Generate a full lesson with SCOBA + exercises',
            'exercise <studentId> [topicId] [type]': 'Generate a single exercise',
            'check <topicId> <exerciseIndex> <answer>': 'Check an answer',
            'record <studentId> <topicId> <grade>': 'Record assessment (1=Again 2=Hard 3=Good 4=Easy)',
            'progress <studentId>': 'View progress for current level',
            'report <studentId>': 'Full student report with category breakdown',
            'next <studentId> [count]': 'Get next recommended topics',
            'topics [level]': 'List all grammar topics, optionally filtered by level',
            'scoba <topicId>': 'Show the SCOBA decision flowchart for a topic',
            'students': 'List all student profiles',
          },
        });
    }
  });
}

module.exports = { GrammarTutor, TOPICS };
