// Portuguese Pronunciation Tutor -- all data embedded, FSRS-tracked
const core = require('../_lib/core');

const SKILL_NAME = 'portuguese-pronunciation';

// ---------------------------------------------------------------------------
// SOUND DATA by CEFR level
// ---------------------------------------------------------------------------
const SOUNDS = {
  A1: [
    // Oral vowels (7-vowel system)
    { id: 'v-a', cat: 'vowels', name: 'Open central /a/', ipa: '/a/', desc: 'Mouth wide open, tongue low and central. Like English "father" but shorter. In unstressed position (BR), reduces to [ɐ].', examples: ['casa','falar','mapa','banana'], minimalPairs: [['passo','posso'],['fala','fila']], commonErrors: ['Substituting English /æ/','Not reducing in unstressed position (BR)'] },
    { id: 'v-e-open', cat: 'vowels', name: 'Open-mid front /ɛ/', ipa: '/ɛ/', desc: 'Like English "bet". Occurs in stressed syllables. Distinguishes meaning: "avó" (grandmother) vs "avô" (grandfather).', examples: ['café','pé','ela','festa'], minimalPairs: [['avó /ɛ/','avô /o/'],['sé (cathedral)','se (if)']], commonErrors: ['Not distinguishing /ɛ/ from /e/'] },
    { id: 'v-e-closed', cat: 'vowels', name: 'Close-mid front /e/', ipa: '/e/', desc: 'Like the start of English "say" WITHOUT the glide. In unstressed final position (BR): [i]. In EP: often [ɨ] or dropped.', examples: ['mesa','você','dedo','leite'], minimalPairs: [['sê (be)','sé (cathedral)'],['dedo','dado']], commonErrors: ['Diphthongizing to /eɪ/','Not reducing final -e'] },
    { id: 'v-i', cat: 'vowels', name: 'Close front /i/', ipa: '/i/', desc: 'Lips spread, tongue high and front. Like English "see" but shorter.', examples: ['dia','aqui','vida','amigo'], minimalPairs: [['fila','fala'],['vi','vê']], commonErrors: ['Too long or glided'] },
    { id: 'v-o-open', cat: 'vowels', name: 'Open-mid back /ɔ/', ipa: '/ɔ/', desc: 'Like English "thought" (open). Marks meaning: "avó" /ɔ/ vs "avô" /o/.', examples: ['avó','sol','pode','porta'], minimalPairs: [['avó (grandmother)','avô (grandfather)'],['molho /ɔ/ (sauce)','molho /o/ (bundle)']], commonErrors: ['Not distinguishing /ɔ/ from /o/'] },
    { id: 'v-o-closed', cat: 'vowels', name: 'Close-mid back /o/', ipa: '/o/', desc: 'Lips rounded, mid-back. Like start of English "go" WITHOUT the glide. Unstressed final -o in BR: [u].', examples: ['avô','todo','corpo','bolo'], minimalPairs: [['avô (grandfather)','avó (grandmother)'],['poço (well)','posso (I can)']], commonErrors: ['Diphthongizing to /oʊ/','Not reducing final -o to [u]'] },
    { id: 'v-u', cat: 'vowels', name: 'Close back /u/', ipa: '/u/', desc: 'Lips rounded tightly, tongue high and back. Like English "too" but shorter.', examples: ['lua','muito','uva','grupo'], minimalPairs: [['tudo','todo'],['muro','moro']], commonErrors: ['Too long or glided'] },
    // Basic consonants
    { id: 'c-lh', cat: 'consonants', name: 'LH /ʎ/', ipa: '/ʎ/', desc: 'Palatal lateral: tongue blade on hard palate. Like "lli" in "million". Unique to Portuguese/Spanish. NOT "ly" as two sounds.', examples: ['filho','trabalho','olho','mulher'], minimalPairs: [['olho (eye)','olo'],['malha (mesh)','mala (suitcase)']], commonErrors: ['Pronouncing as /l/ + /j/','Pronouncing as plain /l/'] },
    { id: 'c-nh', cat: 'consonants', name: 'NH /ɲ/', ipa: '/ɲ/', desc: 'Palatal nasal: like Spanish ñ or "ny" in "canyon" but one sound. Written NH in Portuguese.', examples: ['senhor','amanhã','ninho','banho'], minimalPairs: [['sono (sleep)','sonho (dream)'],['cana (cane)','canha']], commonErrors: ['Pronouncing as /n/ + /j/','Pronouncing as plain /n/'] },
  ],
  A2: [
    // Nasal vowels
    { id: 'v-nasal-a', cat: 'nasal-vowels', name: 'Nasal /ã/', ipa: '/ɐ̃/', desc: 'Nasalize /a/ by lowering the velum. Air flows through nose AND mouth. Written: ã, an, am. Key Portuguese feature absent from Spanish.', examples: ['maçã','irmã','banco','campo'], minimalPairs: [['lã (wool)','lá (there)'],['manto (cloak)','mato (bush)']], commonErrors: ['Not nasalizing enough','Adding /n/ after the vowel instead of nasalizing'] },
    { id: 'v-nasal-e', cat: 'nasal-vowels', name: 'Nasal /ẽ/', ipa: '/ẽ/', desc: 'Nasalize /e/. Written: en, em. Very common in verb endings (-em, -ém).', examples: ['bem','também','tempo','sempre'], minimalPairs: [['sem (without)','se (if)'],['tem (has)','te (you)']], commonErrors: ['Pronouncing as oral /e/ + /n/'] },
    { id: 'v-nasal-i', cat: 'nasal-vowels', name: 'Nasal /ĩ/', ipa: '/ĩ/', desc: 'Nasalize /i/. Written: in, im.', examples: ['fim','assim','into','lindo'], minimalPairs: [['fim (end)','fi (not standard)'],['sim (yes)','si (if, musical note)']], commonErrors: ['Insufficient nasalization'] },
    { id: 'v-nasal-o', cat: 'nasal-vowels', name: 'Nasal /õ/', ipa: '/õ/', desc: 'Nasalize /o/. Written: on, om. Common in -ção words and "bom".', examples: ['bom','som','onde','contar'], minimalPairs: [['som (sound)','só (only)'],['tom (tone)','to (not standard)']], commonErrors: ['Pronouncing as oral /o/ + /n/'] },
    { id: 'v-nasal-u', cat: 'nasal-vowels', name: 'Nasal /ũ/', ipa: '/ũ/', desc: 'Nasalize /u/. Written: un, um. Common in the indefinite article "um".', examples: ['um','algum','mundo','fundo'], minimalPairs: [['um (one)','u'],['fundo (deep)','fudo']], commonErrors: ['Insufficient nasalization'] },
    // Nasal diphthongs
    { id: 'v-nasal-ao', cat: 'nasal-vowels', name: 'Nasal diphthong /ɐ̃w̃/', ipa: '/ɐ̃w̃/', desc: 'The signature Portuguese sound. Written: -ão. Starts nasal /ɐ̃/, glides to nasal /w̃/. Extremely common (-ção endings).', examples: ['não','pão','coração','informação'], minimalPairs: [['mão (hand)','mau (bad)'],['pão (bread)','pau (stick)']], commonErrors: ['Saying /aʊ/ without nasalization','Saying /ɑn/'] },
    { id: 'v-nasal-oe', cat: 'nasal-vowels', name: 'Nasal diphthong /õj̃/', ipa: '/õj̃/', desc: 'Nasal /o/ gliding to nasal /j/. Written: -ões (plural of -ão).', examples: ['ações','corações','aviões','opiniões'], minimalPairs: [['põe (puts)','pó (dust)']], commonErrors: ['Not nasalizing the glide'] },
    // Consonants
    { id: 'c-r-tap', cat: 'consonants', name: 'Tapped R /ɾ/', ipa: '/ɾ/', desc: 'Single quick tap of tongue tip on alveolar ridge. Occurs between vowels and in clusters (pr, tr, cr). Like American English "butter" flap.', examples: ['caro','três','prato','hora'], minimalPairs: [['caro (expensive)','carro (car)'],['para (for)','parra (vine)']], commonErrors: ['English retroflex /ɹ/','French uvular /ʁ/'] },
    { id: 'c-r-strong', cat: 'consonants', name: 'Strong R', ipa: '/ʁ/ or /h/ or /r/', desc: 'Word-initial R, RR, or after n/l/s. In BR: usually uvular [ʁ] or [h] (aspirated). In EP: usually uvular [ʁ] or trilled [r]. Rio: often [h].', examples: ['rato','carro','honra','Israel'], minimalPairs: [['caro (expensive)','carro (car)'],['era (was)','erra (errs)']], commonErrors: ['Using tap /ɾ/ where strong R is needed','Inconsistent realization between variants'] },
    { id: 's-basic', cat: 'stress', name: 'Basic stress rules', ipa: 'ˈ', desc: 'Vowel/n/s/m ending: penultimate stress (casa). Other consonant: final stress (falar). Accent mark overrides (café, português).', examples: ['CA-sa','fa-LAR','ca-FÉ','por-tu-GUÊS'], minimalPairs: [['sábia (wise f.)','sabia (knew)','sabiá (thrush)'],['esta (this)','está (is located)']], commonErrors: ['Stressing wrong syllable','Ignoring accent marks'] },
  ],
  B1: [
    // Connected speech - BR
    { id: 'cs-palatalization', cat: 'connected-speech', name: 'T/D palatalization (BR)', ipa: '/tʃ/ /dʒ/', desc: 'In most of Brazil, /t/ → [tʃ] and /d/ → [dʒ] before /i/ (including reduced /e/→[i]): "tia" = [tʃia], "dia" = [dʒia], "noite" = [nojtʃi].', examples: ['tia [tʃia]','dia [dʒia]','noite [nojtʃi]','cidade [sidadʒi]'], minimalPairs: [], commonErrors: ['Using plain [t]/[d] before /i/ in BR context'] },
    { id: 'cs-final-s', cat: 'connected-speech', name: 'Final S variation', ipa: '/s/ /ʃ/ /z/', desc: 'Before consonant or pause: Rio/EP = [ʃ] (as in "ship"); São Paulo = [s]. Before voiced consonant: [ʒ] or [z]. "Estamos" = [iʃtɐmuʃ] (Rio) or [istamus] (SP).', examples: ['estamos','desde [deʒdʒi]','as casas','os meninos'], minimalPairs: [], commonErrors: ['Using only one variant inconsistently'] },
    { id: 'cs-vowel-reduction-br', cat: 'connected-speech', name: 'Vowel reduction (BR)', ipa: '(reduction)', desc: 'Unstressed: /e/ → [i] (final), /o/ → [u] (final), /a/ → [ɐ] (some positions). "Leite" = [lejtʃi], "bolo" = [bolu].', examples: ['leite [lejtʃi]','bolo [bolu]','banana [bɐnɐnɐ]','grande [grɐ̃dʒi]'], minimalPairs: [], commonErrors: ['Pronouncing final -e as [e] not [i]','Pronouncing final -o as [o] not [u]'] },
    { id: 'cs-vowel-reduction-ep', cat: 'connected-speech', name: 'Vowel reduction (EP)', ipa: '(reduction)', desc: 'EP reduces much more aggressively: unstressed /e/ → [ɨ] (schwa-like, often silent), /o/ → [u], /a/ → [ɐ]. "Telefone" can sound like [tlfɔn].', examples: ['telefone [tɨlɨfɔnɨ]','pequeno [pɨkenu]','momento [mumẽtu]'], minimalPairs: [], commonErrors: ['Not reducing enough for EP','Over-reducing for BR'] },
    // Intonation
    { id: 'i-statement', cat: 'intonation', name: 'Statement intonation', ipa: '↘', desc: 'Gradual descent with fall at end: "Eu moro em Lisboa." ↘', examples: ['Eu moro em Lisboa.','Tenho dois irmãos.','Gosto de café.'], minimalPairs: [], commonErrors: ['Rising at end (English uptalk)'] },
    { id: 'i-ynq', cat: 'intonation', name: 'Yes/No question rise', ipa: '↗', desc: 'Rise at end: "Você mora aqui?" ↗. In BR, often a sharper rise than in EP.', examples: ['Você mora aqui?','Tem fome?','Está pronto?'], minimalPairs: [], commonErrors: ['Insufficient rise','Falling like a statement'] },
    // L vocalization
    { id: 'c-l-final', cat: 'consonants', name: 'Final L vocalization (BR)', ipa: '/w/', desc: 'In BR, syllable-final L → [w]: "Brasil" = [braziw], "sal" = [saw]. In EP, L stays as dark [ɫ].', examples: ['Brasil [braziw]','sal [saw]','azul [azuw]','futebol [futʃibow]'], minimalPairs: [], commonErrors: ['Using English clear [l]','Not vocalizing in BR context'] },
  ],
  B2: [
    // Advanced connected speech
    { id: 'cs-linking', cat: 'connected-speech', name: 'Vowel linking', ipa: '(linking)', desc: 'Word-final vowel + word-initial vowel link smoothly. No glottal stop: "minha amiga" = [miɲa.mi.gɐ].', examples: ['minha amiga','como está','de onde','a escola'], minimalPairs: [], commonErrors: ['Inserting glottal stop between words','Pausing between vowels'] },
    { id: 'cs-resyllabification', cat: 'connected-speech', name: 'Resyllabification', ipa: '(linking)', desc: 'Final consonants attach to following vowel: "mal estado" = [ma.les.ta.du].', examples: ['mal estado','as aulas','os amigos','vez ou outra'], minimalPairs: [], commonErrors: ['Keeping word boundaries rigid'] },
    // BR vs EP consonants
    { id: 'c-s-dialects', cat: 'consonants', name: 'S dialectal variation', ipa: '/s/ /ʃ/ /z/ /ʒ/', desc: 'Coda S: SP [s], Rio/Lisbon [ʃ], before voiced [z]/[ʒ]. Word-initial S always [s]. Between vowels: [z] (casa = [kaza]).', examples: ['casa [kaza]','isto [iʃtu] (Rio)','mesmo [meʒmu] (Rio)','isto [istu] (SP)'], minimalPairs: [['caça (hunt)','casa (house)']], commonErrors: ['Inconsistent S realization'] },
    { id: 'c-x-values', cat: 'consonants', name: 'X multiple values', ipa: '/ʃ/ /ks/ /z/ /s/', desc: 'Portuguese X has 4+ pronunciations: xícara [ʃ], táxi [ks], exame [z], próximo [s]. Must be learned per word.', examples: ['xícara [ʃ]','táxi [ks]','exame [z]','próximo [s]'], minimalPairs: [], commonErrors: ['Defaulting to one pronunciation for all X'] },
    // Prosody
    { id: 'i-whq', cat: 'intonation', name: 'Wh-question fall', ipa: '↘', desc: 'Wh-questions fall at end (like English): "Onde você mora?" ↘', examples: ['Onde você mora?','O que você quer?','Como se chama?'], minimalPairs: [], commonErrors: ['Rising like a yes/no question'] },
    { id: 'i-list', cat: 'intonation', name: 'List intonation', ipa: '↗...↘', desc: 'Rise on each item, fall on last: "Comprei maçãs↗, bananas↗ e laranjas↘."', examples: ['maçãs, bananas e laranjas','segunda, terça e quarta'], minimalPairs: [], commonErrors: ['Falling too early','Flat intonation'] },
  ],
  C1: [
    // Rhythm mastery
    { id: 'cs-rhythm-br', cat: 'connected-speech', name: 'BR syllable-timed rhythm', ipa: '(rhythm)', desc: 'Brazilian Portuguese is more syllable-timed: each syllable gets relatively equal duration. Unstressed vowels reduce but are still audible.', examples: ['u-ni-ver-si-da-de','te-le-fo-ne','cho-co-la-te'], minimalPairs: [], commonErrors: ['English stress-timing','Over-reducing unstressed vowels'] },
    { id: 'cs-rhythm-ep', cat: 'connected-speech', name: 'EP stress-timed rhythm', ipa: '(rhythm)', desc: 'European Portuguese is more stress-timed: unstressed syllables compress dramatically. Results in consonant clusters as vowels delete.', examples: ['pra.to (sounds like "prtu")','de.pois → [dpojʃ]','te.le.fo.ne → [tlfɔn]'], minimalPairs: [], commonErrors: ['Being too syllable-timed for EP','Not compressing enough'] },
    // Advanced sounds
    { id: 'c-schwa-ep', cat: 'vowels', name: 'EP schwa /ɨ/', ipa: '/ɨ/', desc: 'European Portuguese has a unique high central vowel [ɨ], used for unstressed /e/. Often nearly silent. "Pequeno" → [pɨkenu] or [pkenu].', examples: ['pequeno [pɨkenu]','telefone [tɨlfɔnɨ]','de [dɨ]','se [sɨ]'], minimalPairs: [], commonErrors: ['Using full [e] in EP context','Completely deleting the vowel when a hint should remain'] },
    { id: 'i-excl', cat: 'intonation', name: 'Exclamation contour', ipa: '↗↘', desc: 'Wide pitch range: "Que lindo!" ↗↘. BR tends to wider pitch range than EP.', examples: ['Que lindo!','Não acredito!','Incrível!'], minimalPairs: [], commonErrors: ['Too flat','Insufficient pitch range'] },
    // Regional accent features
    { id: 'c-chiado', cat: 'consonants', name: 'Chiado (Rio/Lisbon)', ipa: '/ʃ/ /ʒ/', desc: 'In Rio and Lisbon, syllable-final S → [ʃ] (before voiceless) or [ʒ] (before voiced). "Estamos" = [iʃtɐmuʃ].', examples: ['estamos [iʃtɐmuʃ]','desde [deʒdʒi]','as festas [aʃ feʃtɐʃ]'], minimalPairs: [], commonErrors: ['Not using chiado in Rio/Lisbon context','Using chiado in São Paulo context'] },
  ],
  C2: [
    // Full integration
    { id: 'cs-full', cat: 'connected-speech', name: 'Native-like connected speech', ipa: '(flow)', desc: 'Full integration: vowel linking + resyllabification + rhythm + nasal vowels + regional features in rapid natural speech.', examples: ['Vou-me embora agora [vowmiẽborɐgɔrɐ] (BR)','Estás a brincar comigo? (EP rapid)'], minimalPairs: [], commonErrors: ['Slowing down at word boundaries'] },
    { id: 'c-regional', cat: 'consonants', name: 'Pan-dialectal awareness', ipa: '(varies)', desc: 'Recognize and optionally produce features from BR and EP: T/D palatalization, L vocalization, chiado, vowel reduction levels, R variants.', examples: ['porta: [pohtɐ] (Rio) vs [pɔɾtɐ] (EP)','leite: [lejtʃi] (BR) vs [lɐjt] (EP)','Brasil: [braziw] (BR) vs [brɐziɫ] (EP)'], minimalPairs: [], commonErrors: ['Mixing BR and EP features inconsistently'] },
  ],
};

// Tongue twisters by difficulty
const TONGUE_TWISTERS = [
  { id: 'tt-1', level: 'A2', text: 'O rato roeu a roupa do rei de Roma.', focus: 'strong R /ʁ/ in multiple positions', ipa: '/u ʁatu ʁoew a ʁopɐ du ʁej dʒi ʁomɐ/' },
  { id: 'tt-2', level: 'A2', text: 'Três pratos de trigo para três tigres tristes.', focus: 'consonant clusters /tr/, /pr/, tap /ɾ/', ipa: '/tɾeʃ pɾatuʃ dʒi tɾigu pɐɾɐ tɾeʃ tʃigɾiʃ tɾiʃtʃiʃ/' },
  { id: 'tt-3', level: 'B1', text: 'O tempo perguntou ao tempo quanto tempo o tempo tem.', focus: 'nasal vowels /ẽ/, rhythm, connected speech', ipa: '(focus on nasalization and smooth rhythm)' },
  { id: 'tt-4', level: 'B1', text: 'A aranha arranha a rã. A rã arranha a aranha.', focus: 'strong R, NH /ɲ/, nasal vowels', ipa: '/a aɾɐ̃ɲɐ aʁɐ̃ɲɐ a ʁɐ̃ | a ʁɐ̃ aʁɐ̃ɲɐ a aɾɐ̃ɲɐ/' },
  { id: 'tt-5', level: 'B1', text: 'Num ninho de mafagafos, cinco mafagafinhos há.', focus: 'NH /ɲ/, nasal vowels, vowel purity', ipa: '(focus on NH and nasal vowels throughout)' },
  { id: 'tt-6', level: 'B2', text: 'O peito do pé do Pedro é preto. Quem disser que o peito do pé do Pedro é preto tem o peito do pé mais preto do que o peito do pé do Pedro.', focus: 'connected speech, /p/ clusters, vowel reduction', ipa: '(focus on smooth linking and plosive clusters)' },
  { id: 'tt-7', level: 'B2', text: 'Casa suja, chão sujo. Chão sujo, casa suja.', focus: 'nasal diphthong /ɐ̃w̃/, /ʃ/ sound, vowel linking', ipa: '/kazɐ suʒɐ ʃɐ̃w̃ suʒu | ʃɐ̃w̃ suʒu kazɐ suʒɐ/' },
  { id: 'tt-8', level: 'C1', text: 'Paralelipípedo é a palavra paralelepípedo que ninguém consegue falar certo.', focus: 'syllable-timed rhythm, vowel purity across many syllables, nasal /ẽ/', ipa: '(practice steady rhythm on each syllable)' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function allSounds() {
  const out = [];
  for (const lvl of core.CEFR) {
    for (const s of (SOUNDS[lvl] || [])) out.push({ ...s, level: lvl });
  }
  return out;
}

function soundsForLevel(level) {
  const idx = core.CEFR.indexOf(level);
  if (idx < 0) return allSounds();
  const out = [];
  for (let i = 0; i <= idx; i++) {
    for (const s of (SOUNDS[core.CEFR[i]] || [])) out.push({ ...s, level: core.CEFR[i] });
  }
  return out;
}

function findSound(id) {
  return allSounds().find(s => s.id === id) || null;
}

// ---------------------------------------------------------------------------
// PronunciationTutor
// ---------------------------------------------------------------------------

class PronunciationTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  // -- Profile management --

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
    return { studentId, level, soundsAvailable: soundsForLevel(level).length };
  }

  listStudents() {
    return core.listProfiles(this.dir);
  }

  // -- Sound catalog --

  getSoundCatalog(level) {
    const sounds = level ? soundsForLevel(level) : allSounds();
    const byCat = {};
    for (const s of sounds) {
      if (!byCat[s.cat]) byCat[s.cat] = [];
      byCat[s.cat].push({ id: s.id, name: s.name, ipa: s.ipa, level: s.level });
    }
    return byCat;
  }

  // -- Lesson generation --

  generateLesson(studentId, category) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = soundsForLevel(level);
    const filtered = category ? available.filter(s => s.cat === category) : available;
    const td = core.today();

    // Collect due items
    const due = [];
    const fresh = [];
    for (const s of filtered) {
      const sk = p.skills[s.id];
      if (!sk) { fresh.push(s); continue; }
      if (sk.nextReview && sk.nextReview <= td) due.push(s);
    }

    const reviewItems = core.pick(due, 5);
    const newItems = core.pick(fresh, 2);

    const exercises = [];
    for (const s of [...reviewItems, ...newItems]) {
      exercises.push(this._makeExercise(s, level));
    }

    return {
      studentId, level, date: td, category: category || 'all',
      reviewCount: reviewItems.length, newCount: newItems.length,
      exercises,
    };
  }

  // -- Exercise generation --

  generateExercise(studentId, type) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = soundsForLevel(level);
    const sound = core.pick(available, 1)[0];
    if (!sound) throw new Error('No sounds available for level ' + level);

    if (type === 'tonguetwister') return this._tongueTwister(level);
    return this._makeExercise(sound, level, type);
  }

  _makeExercise(sound, level, forceType) {
    const types = [];
    if (sound.minimalPairs && sound.minimalPairs.length) types.push('minimal-pairs');
    if (sound.cat === 'stress') types.push('stress-identification');
    types.push('production');

    const type = forceType && types.includes(forceType) ? forceType : (forceType === 'production' ? 'production' : core.pick(types, 1)[0] || 'production');
    const exId = sound.id + '-' + Date.now();

    if (type === 'minimal-pairs' && sound.minimalPairs.length) {
      const pair = core.pick(sound.minimalPairs, 1)[0];
      const target = core.pick(pair, 1)[0];
      const options = core.shuffle([...pair]);
      return {
        exerciseId: exId, type: 'minimal-pairs', soundId: sound.id, soundName: sound.name,
        ipa: sound.ipa, prompt: `Which word do you hear? Target: "${target}"`,
        options, answer: target, description: sound.desc,
      };
    }

    if (type === 'stress-identification') {
      const word = core.pick(sound.examples, 1)[0];
      return {
        exerciseId: exId, type: 'stress-identification', soundId: sound.id, soundName: sound.name,
        prompt: `Identify the stressed syllable in: "${word}"`, word,
        description: sound.desc, hint: 'Break the word into syllables and find the stressed one.',
      };
    }

    // production
    const word = core.pick(sound.examples, 1)[0];
    return {
      exerciseId: exId, type: 'production', soundId: sound.id, soundName: sound.name,
      ipa: sound.ipa, prompt: `Say this word aloud, focusing on ${sound.name}: "${word}"`,
      word, description: sound.desc,
      selfAssessPrompt: 'Rate yourself 0-3: 0=cannot produce, 1=hear difference but struggle, 2=produce with concentration, 3=natural',
    };
  }

  _tongueTwister(level) {
    const idx = core.CEFR.indexOf(level);
    const eligible = TONGUE_TWISTERS.filter(t => core.CEFR.indexOf(t.level) <= idx);
    const tt = core.pick(eligible.length ? eligible : TONGUE_TWISTERS, 1)[0];
    return {
      exerciseId: 'tt-' + Date.now(), type: 'tonguetwister',
      text: tt.text, focus: tt.focus, ipa: tt.ipa, level: tt.level,
      prompt: `Repeat this tongue twister slowly, then speed up:\n"${tt.text}"\nFocus: ${tt.focus}`,
      selfAssessPrompt: 'Rate yourself 0-3: 0=cannot say it, 1=very slow only, 2=moderate speed, 3=fast and clear',
    };
  }

  // -- Answer checking --

  checkAnswer(studentId, exerciseId, answer) {
    const ans = core.norm(answer);
    return {
      exerciseId, givenAnswer: answer, normalized: ans,
      note: 'For pronunciation exercises, use "record" to log your self-assessment grade (0-3).',
    };
  }

  // -- SRS recording --

  recordAssessment(studentId, soundId, grade) {
    grade = Number(grade);
    if (grade < 0 || grade > 3) throw new Error('Grade must be 0-3');
    const p = this.getProfile(studentId);
    const sound = findSound(soundId);
    if (!sound) throw new Error('Unknown sound: ' + soundId);

    // Map 0-3 student scale to FSRS 1-4 internal scale
    const fsrsGrade = grade + 1;

    if (!p.skills[soundId]) {
      p.skills[soundId] = { difficulty: 5, stability: 0.5, lastReview: null, nextReview: null, history: [] };
    }
    const sk = p.skills[soundId];
    sk.stability = core.fsrsUpdateStability(sk.stability || 0.5, sk.difficulty || 5, fsrsGrade);
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty || 5, fsrsGrade);
    sk.lastReview = core.today();
    const interval = core.fsrsNextReview(sk.stability);
    const next = new Date();
    next.setDate(next.getDate() + interval);
    sk.nextReview = next.toISOString().slice(0, 10);
    sk.history.push({ date: core.today(), grade, fsrsGrade });

    p.assessments.push({ soundId, grade, date: core.today() });
    core.saveProfile(this.dir, p);

    return {
      studentId, soundId, soundName: sound.name, grade,
      stability: sk.stability, difficulty: sk.difficulty,
      nextReview: sk.nextReview, interval,
    };
  }

  // -- Progress & reporting --

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = soundsForLevel(level);
    const byCat = {};

    for (const s of available) {
      if (!byCat[s.cat]) byCat[s.cat] = { total: 0, studied: 0, mastered: 0, items: [] };
      const cat = byCat[s.cat];
      cat.total++;
      const sk = p.skills[s.id];
      const lastGrade = sk && sk.history.length ? sk.history[sk.history.length - 1].grade : null;
      const status = !sk ? 'not-started' : lastGrade >= 3 ? 'mastered' : lastGrade >= 2 ? 'proficient' : lastGrade >= 1 ? 'developing' : 'emerging';
      if (sk) cat.studied++;
      if (lastGrade >= 3) cat.mastered++;
      cat.items.push({ id: s.id, name: s.name, status, lastGrade, nextReview: sk ? sk.nextReview : null });
    }

    return { studentId, level, categories: byCat };
  }

  getNextSounds(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const available = soundsForLevel(level);
    const td = core.today();
    const due = [];
    const unstarted = [];

    for (const s of available) {
      const sk = p.skills[s.id];
      if (!sk) { unstarted.push({ id: s.id, name: s.name, cat: s.cat, level: s.level, reason: 'new' }); continue; }
      if (sk.nextReview && sk.nextReview <= td) {
        due.push({ id: s.id, name: s.name, cat: s.cat, level: s.level, nextReview: sk.nextReview, reason: 'due' });
      }
    }

    return { studentId, date: td, due, unstarted: unstarted.slice(0, 5), totalDue: due.length, totalUnstarted: unstarted.length };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const next = this.getNextSounds(studentId);

    let totalStudied = 0, totalMastered = 0, totalItems = 0;
    const catSummary = {};
    for (const [cat, data] of Object.entries(progress.categories)) {
      totalStudied += data.studied;
      totalMastered += data.mastered;
      totalItems += data.total;
      catSummary[cat] = `${data.mastered}/${data.total} mastered`;
    }

    const recentAssessments = (p.assessments || []).slice(-10).reverse();

    return {
      studentId, level: p.level || 'A1',
      summary: { totalItems, totalStudied, totalMastered, percentMastered: totalItems ? Math.round(totalMastered / totalItems * 100) : 0 },
      categories: catSummary,
      dueForReview: next.totalDue,
      unstartedRemaining: next.totalUnstarted,
      recentAssessments,
      recommendations: this._recommendations(progress, next),
    };
  }

  _recommendations(progress, next) {
    const recs = [];
    const cats = progress.categories;
    if (cats.vowels) {
      const emerging = cats.vowels.items.filter(i => i.status === 'emerging' || i.status === 'not-started');
      if (emerging.length) recs.push('Focus on the 7-vowel system -- ' + emerging.length + ' vowel sounds need work.');
    }
    if (cats['nasal-vowels']) {
      const nasalEmerging = cats['nasal-vowels'].items.filter(i => i.status === 'emerging' || i.status === 'not-started');
      if (nasalEmerging.length) recs.push('Nasal vowels are essential for Portuguese -- ' + nasalEmerging.length + ' nasal sounds need work.');
    }
    if (next.totalDue > 0) recs.push(next.totalDue + ' sound(s) due for review today.');
    if (next.totalUnstarted > 3) recs.push(next.totalUnstarted + ' sounds not yet started at your level.');
    if (cats['connected-speech']) {
      const cs = cats['connected-speech'];
      if (cs.studied === 0) recs.push('Start connected speech practice (palatalization, vowel reduction, linking).');
    }
    if (!recs.length) recs.push('Great progress! Consider advancing to the next CEFR level.');
    return recs;
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new PronunciationTutor();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const id = args[1]; if (!id) throw new Error('Usage: start <studentId>');
      const p = tutor.getProfile(id);
      core.saveProfile(tutor.dir, p);
      out({ status: 'ok', studentId: id, level: p.level || 'not set', soundsTracked: Object.keys(p.skills).length });
      break;
    }
    case 'set-level': {
      const id = args[1], lvl = args[2];
      if (!id || !lvl) throw new Error('Usage: set-level <studentId> <A1-C2>');
      out(tutor.setLevel(id, lvl.toUpperCase()));
      break;
    }
    case 'lesson': {
      const id = args[1], cat = args[2] || null;
      if (!id) throw new Error('Usage: lesson <studentId> [category]');
      out(tutor.generateLesson(id, cat));
      break;
    }
    case 'exercise': {
      const id = args[1], type = args[2] || null;
      if (!id) throw new Error('Usage: exercise <studentId> [minimal-pairs|stress-identification|production|tonguetwister]');
      out(tutor.generateExercise(id, type));
      break;
    }
    case 'check': {
      const id = args[1], exId = args[2], answer = args.slice(3).join(' ');
      if (!id || !exId) throw new Error('Usage: check <studentId> <exerciseId> <answer>');
      out(tutor.checkAnswer(id, exId, answer));
      break;
    }
    case 'record': {
      const id = args[1], soundId = args[2], grade = args[3];
      if (!id || !soundId || grade === undefined) throw new Error('Usage: record <studentId> <soundId> <0-3>');
      out(tutor.recordAssessment(id, soundId, grade));
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
      out(tutor.getNextSounds(id));
      break;
    }
    case 'sounds': {
      const lvl = args[1] || null;
      out(tutor.getSoundCatalog(lvl ? lvl.toUpperCase() : null));
      break;
    }
    case 'students': {
      out({ students: tutor.listStudents() });
      break;
    }
    case 'help':
      out({ commands: ['start','set-level','lesson','exercise','check','record','progress','report','next','sounds','students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + cmd,
        commands: ['start','set-level','lesson','exercise','check','record','progress','report','next','sounds','students'],
      });
  }
});

module.exports = { PronunciationTutor, SOUNDS, TONGUE_TWISTERS };
