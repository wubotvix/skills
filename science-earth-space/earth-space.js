// eClaw Earth & Space Science Interactive Tutor (K-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'science-earth-space');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'K-2': {
    'weather': ['daily-weather', 'weather-patterns', 'severe-weather'],
    'sky': ['sun-moon-stars', 'daylight-changes', 'seasons-intro'],
    'earth-surface': ['land-and-water', 'slow-changes', 'fast-changes'],
    'rocks-soil': ['rock-sorting', 'soil-basics'],
  },
  '3-5': {
    'weather-climate': ['weather-vs-climate', 'climate-zones', 'natural-hazards'],
    'rock-cycle': ['igneous-sedimentary-metamorphic', 'weathering-erosion', 'fossils'],
    'water-cycle': ['evaporation-condensation-precipitation', 'earths-spheres'],
    'solar-system': ['planets-order', 'sun-as-star', 'day-night-seasons'],
    'natural-resources': ['renewable-nonrenewable', 'conservation'],
  },
  '6-8': {
    'plate-tectonics': ['plate-boundaries', 'earthquakes-volcanoes', 'continental-drift'],
    'earths-interior': ['layers-of-earth', 'convection-currents'],
    'moon-tides': ['moon-phases', 'tides', 'eclipses'],
    'earths-history': ['geologic-time', 'mass-extinctions', 'fossil-record'],
    'climate-change': ['greenhouse-effect', 'human-impact', 'evidence-of-change'],
    'space-exploration': ['technology', 'missions'],
  },
};

const CONTENT_BANKS = {
  'K-2': {
    'daily-weather': {
      items: [
        { question: 'Name 4 things we observe about weather', answer: 'temperature, wind, clouds, precipitation' },
        { question: 'What tool measures temperature?', answer: 'thermometer' },
        { question: 'What tool measures rainfall?', answer: 'rain gauge' },
        { question: 'What are clouds made of?', answer: 'tiny water droplets or ice crystals' },
        { question: 'What causes wind?', answer: 'moving air' },
      ],
    },
    'weather-patterns': {
      items: [
        { question: 'Why do we wear coats in winter?', answer: 'it is cold in winter' },
        { question: 'What season is usually warmest?', answer: 'summer' },
        { question: 'In spring, what happens to plants?', answer: 'they start growing and flowers bloom' },
        { question: 'What falls from the sky in winter in cold places?', answer: 'snow' },
      ],
    },
    'severe-weather': {
      items: [
        { question: 'Name a type of severe weather', answer: 'tornado, hurricane, thunderstorm, or blizzard' },
        { question: 'What should you do during a thunderstorm?', answer: 'go inside and stay away from windows' },
        { question: 'What is a tornado?', answer: 'a spinning column of air that touches the ground' },
        { question: 'How can people prepare for severe weather?', answer: 'listen to warnings, have an emergency kit, know where to shelter' },
      ],
    },
    'sun-moon-stars': {
      items: [
        { question: 'Does the Sun actually move across the sky?', answer: 'no, Earth rotates, making it look like the Sun moves' },
        { question: 'Does the Moon make its own light?', answer: 'no, it reflects sunlight' },
        { question: 'What are stars?', answer: 'huge balls of hot glowing gas far away' },
        { question: 'What is our closest star?', answer: 'the Sun' },
      ],
    },
    'daylight-changes': {
      items: [
        { question: 'In summer, are days longer or shorter?', answer: 'longer' },
        { question: 'In winter, are days longer or shorter?', answer: 'shorter' },
        { question: 'Why is it dark earlier in winter?', answer: 'the Sun is in the sky for fewer hours' },
      ],
    },
    'seasons-intro': {
      items: [
        ['spring', 'flowers bloom, warmer weather'],
        ['summer', 'hottest, longest days'],
        ['fall', 'leaves change color, cooler'],
        ['winter', 'coldest, shortest days'],
      ],
    },
    'land-and-water': {
      items: [
        { question: 'Name 3 types of land features', answer: 'mountains, plains, valleys' },
        { question: 'Name 3 types of water features', answer: 'oceans, rivers, lakes' },
        { question: 'Is more of Earth covered by land or water?', answer: 'water (about 70%)' },
      ],
    },
    'slow-changes': {
      items: [
        { question: 'What is erosion?', answer: 'when wind, water, or ice moves rock and soil' },
        { question: 'How did the Grand Canyon form?', answer: 'a river slowly eroded the rock over millions of years' },
        { question: 'What is weathering?', answer: 'when rock is broken down by water, wind, ice, or plants' },
      ],
    },
    'fast-changes': {
      items: [
        { question: 'Name something that changes Earth quickly', answer: 'earthquake, volcano, flood, or landslide' },
        { question: 'What causes earthquakes?', answer: 'sudden movement of Earth crust (plates)' },
        { question: 'What comes out of a volcano?', answer: 'lava, ash, and gases' },
      ],
    },
    'rock-sorting': {
      items: [
        { question: 'Name 3 ways to sort rocks', answer: 'by color, texture, and hardness' },
        { question: 'Which is harder: a diamond or a piece of chalk?', answer: 'diamond' },
        { question: 'What makes some rocks smooth?', answer: 'water wearing them down over time' },
      ],
    },
    'soil-basics': {
      items: [
        { question: 'What is soil made of?', answer: 'tiny bits of rock, dead plants and animals, air, and water' },
        { question: 'Why is soil important?', answer: 'plants grow in it and many animals live in it' },
        { question: 'What lives in soil?', answer: 'worms, insects, bacteria, fungi, and plant roots' },
      ],
    },
  },
  '3-5': {
    'weather-vs-climate': {
      items: [
        { question: 'What is the difference between weather and climate?', answer: 'weather is daily conditions; climate is the pattern over many years' },
        { question: 'Can climate be rainy one day and sunny the next?', answer: 'no, that is weather; climate describes long-term patterns' },
        { question: 'Chicago has cold winters and warm summers. Is that weather or climate?', answer: 'climate' },
        { question: 'It rained today. Is that weather or climate?', answer: 'weather' },
      ],
    },
    'climate-zones': {
      items: [
        ['tropical', 'warm and wet year-round, near equator'],
        ['temperate', 'moderate temperatures, four seasons'],
        ['polar', 'very cold year-round, near poles'],
        ['desert', 'very dry, hot or cold'],
        ['Mediterranean', 'dry summers, mild wet winters'],
      ],
    },
    'natural-hazards': {
      items: [
        { question: 'Where do most earthquakes occur?', answer: 'along plate boundaries' },
        { question: 'Can we predict exactly when an earthquake will happen?', answer: 'no, but we know where they are most likely' },
        { question: 'What scale measures earthquake strength?', answer: 'Richter scale or moment magnitude scale' },
        { question: 'How do tornadoes form?', answer: 'from rotating thunderstorms when warm and cold air meet' },
      ],
    },
    'igneous-sedimentary-metamorphic': {
      items: [
        ['formed from cooled lava or magma', 'igneous'],
        ['formed from layers of sediment pressed together', 'sedimentary'],
        ['formed from existing rock changed by heat and pressure', 'metamorphic'],
        ['granite, basalt, obsidian', 'igneous'],
        ['sandstone, limestone, shale', 'sedimentary'],
        ['marble, slate, quartzite', 'metamorphic'],
      ],
    },
    'weathering-erosion': {
      items: [
        { question: 'What is the difference between weathering and erosion?', answer: 'weathering breaks rock down; erosion moves the pieces' },
        { question: 'How does water weather rock?', answer: 'water seeps into cracks, freezes, expands, and splits rock' },
        { question: 'Name 3 agents of erosion', answer: 'water, wind, and ice (glaciers)' },
        { question: 'Why are river rocks smooth?', answer: 'water and tumbling wear them down over time' },
      ],
    },
    'fossils': {
      items: [
        { question: 'What is a fossil?', answer: 'preserved remains or traces of organisms from long ago' },
        { question: 'Why are seashell fossils found on mountains?', answer: 'those areas were once underwater' },
        { question: 'What can fossils tell us?', answer: 'what organisms lived long ago and what the environment was like' },
        { question: 'How do most fossils form?', answer: 'an organism is buried in sediment that hardens into rock' },
      ],
    },
    'evaporation-condensation-precipitation': {
      items: [
        ['water from oceans and lakes turns to vapor', 'evaporation'],
        ['water vapor cools and forms clouds', 'condensation'],
        ['water falls from clouds as rain or snow', 'precipitation'],
        ['water flows into rivers and back to oceans', 'collection'],
      ],
    },
    'earths-spheres': {
      items: [
        ['rocks and land', 'geosphere'], ['water (oceans, rivers, ice)', 'hydrosphere'],
        ['air and gases', 'atmosphere'], ['all living things', 'biosphere'],
      ],
    },
    'planets-order': {
      items: [
        { question: 'List the planets in order from the Sun', answer: 'Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune' },
        { question: 'Which planet is largest?', answer: 'Jupiter' },
        { question: 'Which planet is closest to the Sun?', answer: 'Mercury' },
        { question: 'Which planets are gas giants?', answer: 'Jupiter, Saturn, Uranus, Neptune' },
        { question: 'Which planet has rings?', answer: 'Saturn (also Jupiter, Uranus, Neptune have faint rings)' },
      ],
    },
    'sun-as-star': {
      items: [
        { question: 'Is the Sun a planet or a star?', answer: 'a star' },
        { question: 'Why does the Sun look bigger than other stars?', answer: 'it is much closer to Earth' },
        { question: 'What holds the planets in orbit?', answer: "the Sun's gravity" },
      ],
    },
    'day-night-seasons': {
      items: [
        { question: 'What causes day and night?', answer: 'Earth rotating on its axis' },
        { question: 'What causes seasons?', answer: 'Earth tilted axis as it orbits the Sun' },
        { question: 'When it is summer in the US, what season is it in Australia?', answer: 'winter' },
        { question: 'How long does one Earth rotation take?', answer: '24 hours (one day)' },
        { question: 'How long does one orbit around the Sun take?', answer: 'about 365 days (one year)' },
      ],
    },
    'renewable-nonrenewable': {
      items: [
        ['solar energy', 'renewable'], ['coal', 'nonrenewable'], ['wind energy', 'renewable'],
        ['natural gas', 'nonrenewable'], ['water (hydroelectric)', 'renewable'], ['oil', 'nonrenewable'],
        ['geothermal', 'renewable'], ['uranium', 'nonrenewable'],
      ],
    },
    'conservation': {
      items: [
        { question: 'Name 3 ways to conserve resources', answer: 'reduce, reuse, recycle' },
        { question: 'Why is conserving water important?', answer: 'fresh water is limited and all living things need it' },
        { question: 'What is a renewable resource?', answer: 'a resource that can be replaced naturally in a human lifetime' },
      ],
    },
  },
  '6-8': {
    'plate-boundaries': {
      items: [
        ['plates move apart', 'divergent'], ['plates push together', 'convergent'],
        ['plates slide past each other', 'transform'],
        ['mid-ocean ridges form here', 'divergent'], ['mountains and trenches form here', 'convergent'],
        ['San Andreas Fault is this type', 'transform'],
      ],
    },
    'earthquakes-volcanoes': {
      items: [
        { question: 'What causes earthquakes?', answer: 'sudden release of energy when tectonic plates move' },
        { question: 'What is the Ring of Fire?', answer: 'a zone of frequent earthquakes and volcanoes around the Pacific Ocean' },
        { question: 'Where do most volcanoes form?', answer: 'at convergent plate boundaries and hotspots' },
        { question: 'What is a seismograph?', answer: 'an instrument that detects and records earthquake waves' },
      ],
    },
    'continental-drift': {
      items: [
        { question: 'Who proposed continental drift?', answer: 'Alfred Wegener' },
        { question: 'What was Pangaea?', answer: 'a supercontinent that included all present-day continents' },
        { question: 'What evidence supports continental drift?', answer: 'matching coastlines, fossils on separate continents, similar rock formations' },
      ],
    },
    'layers-of-earth': {
      items: [
        ['thin outer layer of solid rock', 'crust'], ['thick layer of hot rock that flows slowly', 'mantle'],
        ['liquid iron and nickel', 'outer core'], ['solid iron and nickel at the center', 'inner core'],
      ],
    },
    'convection-currents': {
      items: [
        { question: 'What drives plate tectonics?', answer: 'convection currents in the mantle' },
        { question: 'How do convection currents work?', answer: 'hot material rises, cools, sinks, creating a circular flow' },
        { question: 'What heats the mantle?', answer: 'heat from Earth core and radioactive decay' },
      ],
    },
    'moon-phases': {
      items: [
        ['fully lit face visible', 'full moon'], ['no lit face visible', 'new moon'],
        ['right half lit', 'first quarter'], ['left half lit', 'third quarter'],
        ['sliver growing', 'waxing crescent'], ['sliver shrinking', 'waning crescent'],
        ['mostly lit and growing', 'waxing gibbous'], ['mostly lit and shrinking', 'waning gibbous'],
      ],
    },
    'tides': {
      items: [
        { question: 'What causes tides?', answer: 'the Moon gravitational pull on Earth oceans' },
        { question: 'How many high tides occur each day?', answer: 'two' },
        { question: 'When are tides strongest (spring tides)?', answer: 'when Sun, Moon, and Earth are aligned' },
      ],
    },
    'eclipses': {
      items: [
        { question: 'What causes a solar eclipse?', answer: 'the Moon passes between the Sun and Earth' },
        { question: 'What causes a lunar eclipse?', answer: 'Earth passes between the Sun and Moon' },
        { question: 'Why don\'t eclipses happen every month?', answer: 'the Moon orbit is tilted relative to Earth orbit' },
      ],
    },
    'geologic-time': {
      items: [
        { question: 'How old is Earth?', answer: 'about 4.6 billion years' },
        { question: 'What is the geologic time scale?', answer: 'a timeline dividing Earth history into eons, eras, periods' },
        { question: 'When did the first life appear?', answer: 'about 3.5 billion years ago' },
        { question: 'When did dinosaurs go extinct?', answer: 'about 66 million years ago' },
      ],
    },
    'mass-extinctions': {
      items: [
        { question: 'What is a mass extinction?', answer: 'when many species die out in a short time' },
        { question: 'What caused the dinosaur extinction?', answer: 'an asteroid impact and volcanic activity' },
        { question: 'How many major mass extinctions have occurred?', answer: 'five' },
      ],
    },
    'fossil-record': {
      items: [
        { question: 'What does the fossil record show?', answer: 'how life on Earth has changed over time' },
        { question: 'Are older fossils found in deeper or shallower rock?', answer: 'deeper' },
        { question: 'What are index fossils?', answer: 'fossils used to date rock layers because they lived for a short, known time' },
      ],
    },
    'greenhouse-effect': {
      items: [
        { question: 'What is the greenhouse effect?', answer: 'gases in the atmosphere trap heat from the Sun' },
        { question: 'Name 2 greenhouse gases', answer: 'carbon dioxide and methane' },
        { question: 'Is the greenhouse effect naturally bad?', answer: 'no, without it Earth would be too cold; the problem is too much' },
      ],
    },
    'human-impact': {
      items: [
        { question: 'How do humans increase greenhouse gases?', answer: 'burning fossil fuels, deforestation, agriculture' },
        { question: 'What is one effect of global warming?', answer: 'melting ice caps, rising sea levels, or extreme weather' },
        { question: 'Name one way to reduce human impact', answer: 'use renewable energy, reduce emissions, plant trees' },
      ],
    },
    'evidence-of-change': {
      items: [
        { question: 'How do scientists know climate is changing?', answer: 'ice cores, temperature records, sea level data, glacier retreat' },
        { question: 'What do ice cores reveal?', answer: 'past atmosphere composition and temperatures going back thousands of years' },
        { question: 'Is Earth average temperature rising or falling?', answer: 'rising' },
      ],
    },
    'technology': {
      items: [
        { question: 'Name a technology used for space exploration', answer: 'telescope, satellite, rover, space station' },
        { question: 'What is a satellite?', answer: 'an object orbiting a planet; can be natural (Moon) or human-made' },
        { question: 'How do we study Mars without going there?', answer: 'rovers, orbiters, and landers' },
      ],
    },
    'missions': {
      items: [
        { question: 'What was the Apollo 11 mission?', answer: 'the first mission to land humans on the Moon (1969)' },
        { question: 'What is the International Space Station?', answer: 'a laboratory orbiting Earth where astronauts live and do research' },
        { question: 'Name a Mars rover', answer: 'Curiosity, Perseverance, Spirit, or Opportunity' },
      ],
    },
  },
};

const PASSAGES = {
  'K-2': [
    { title: 'What Is Weather?', focus: 'weather', text: 'Weather is what the air is like outside. Is it hot or cold? Is it sunny or rainy? Is the wind blowing? We can observe the weather every day. Weather changes, but it follows patterns with the seasons.' },
    { title: 'Rocks Are Everywhere', focus: 'rocks', text: 'Rocks are everywhere! Some are big like mountains. Some are tiny like sand. Rocks can be hard or soft, rough or smooth. Water and wind slowly break rocks into smaller pieces over a very long time.' },
  ],
  '3-5': [
    { title: 'The Water Cycle', focus: 'water cycle', text: 'The Sun heats water in oceans and lakes. The water evaporates and rises as vapor. High in the sky, it cools and condenses into clouds. When droplets get heavy enough, they fall as rain or snow. The water flows into rivers and back to the ocean. The cycle never stops.' },
    { title: 'Our Solar System', focus: 'solar system', text: 'Our Sun is a star at the center of our solar system. Eight planets orbit the Sun. The four inner planets are small and rocky. The four outer planets are large gas giants. Gravity from the Sun keeps everything in orbit.' },
  ],
  '6-8': [
    { title: 'Plate Tectonics', focus: 'plates', text: 'Earth\'s crust is broken into large plates that float on the hot mantle below. Where plates meet, earthquakes and volcanoes occur. Plates move apart at mid-ocean ridges and collide at subduction zones. This movement shaped every continent and ocean on Earth.' },
    { title: 'Climate Change Evidence', focus: 'climate', text: 'Ice cores from Antarctica contain tiny bubbles of ancient air. Scientists analyze these to measure CO2 levels going back 800,000 years. The data shows CO2 is now higher than at any point in that record. Global temperatures correlate with CO2 levels.' },
  ],
};

// File I/O

function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }

function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }

function loadProfile(id) {
  const fp = profilePath(id);
  if (fs.existsSync(fp)) {
    try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
    catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); }
  }
  return { studentId: id, grade: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
}

function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }

// Helpers

function calcMastery(attempts) {
  if (!attempts || !attempts.length) return 0;
  const recent = attempts.slice(-5).filter(a => a.total > 0);
  return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0;
}

function masteryLabel(r) { return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started'; }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

// Exercise generation

function exResult(type, skill, grade, instruction, items) { return { type, skill, grade, count: items.length, instruction, items }; }

function generateExercise(grade, skill, count = 5) {
  const bank = CONTENT_BANKS[grade]?.[skill];
  if (!bank) return { error: `No content bank for ${grade}/${skill}` };

  if (bank.items && Array.isArray(bank.items[0]) && bank.items[0].length === 2 && typeof bank.items[0][1] === 'string') {
    return exResult('classify', skill, grade, 'Classify or identify each item.',
      pick(bank.items, count).map(([item, cat]) => ({ prompt: item, answer: cat })));
  }

  if (bank.items && bank.items[0]?.question)
    return exResult('short-answer', skill, grade, 'Answer the question.',
      pick(bank.items, count).map(i => ({ prompt: i.question, answer: i.answer })));

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(e => norm(e) === norm(answer));
  return norm(expected) === norm(answer);
}

// Public API

class EarthSpace {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, grade: p.grade, createdAt: p.createdAt, totalAssessments: p.assessments.length };
  }

  setGrade(id, grade) {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    const p = loadProfile(id); p.grade = grade; saveProfile(p);
    return { studentId: id, grade };
  }

  recordAssessment(id, grade, category, skill, score, total, notes = '') {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}`);
    if (!SKILLS[grade][category]) throw new Error(`Unknown category '${category}' for ${grade}`);
    if (!SKILLS[grade][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${grade}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);

    const p = loadProfile(id);
    if (!p.grade) p.grade = grade;
    const entry = { date: new Date().toISOString(), grade, category, skill, score, total, notes };
    p.assessments.push(entry);
    const key = `${grade}/${category}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p);
    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'K-2';
    const gs = SKILLS[grade] || {};
    const results = {};
    let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(gs)) {
      results[cat] = {};
      for (const sk of skills) {
        total++;
        const d = p.skills[`${grade}/${cat}/${sk}`];
        results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
      }
    }
    return { studentId: id, grade, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id);
    const grade = p.grade || 'K-2';
    const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS[grade] || {})) {
      for (const sk of skills) {
        const d = p.skills[`${grade}/${cat}/${sk}`];
        const m = d ? d.mastery : 0;
        if (m < MASTERY_THRESHOLD) candidates.push({ grade, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' });
      }
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, grade, next: candidates.slice(0, count) };
  }

  getReport(id) {
    const p = loadProfile(id);
    return { studentId: id, grade: p.grade, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }

  getSkillCatalog(grade) {
    const gs = SKILLS[grade];
    if (!gs) return { grade, error: `Unknown grade. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0;
    const catalog = {};
    for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; }
    return { grade, skills: catalog, totalSkills: total };
  }

  generateExercise(grade, skill, count = 5) { return generateExercise(grade, skill, count); }

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  getPassage(grade) {
    const texts = PASSAGES[grade];
    if (!texts) return { error: `No passages for ${grade}. Available: ${Object.keys(PASSAGES).join(', ')}` };
    return pick(texts, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'K-2';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const passage = PASSAGES[grade] ? pick(PASSAGES[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, passage,
      lessonPlan: {
        engage: `Present a phenomenon related to ${target.category} -> ${target.skill}`,
        explore: `Complete ${exercise.count || 0} practice items`,
        explain: `Discuss the science behind ${target.skill}`,
        elaborate: 'Connect to local geology, weather, or sky observations',
        evaluate: passage ? `Read passage: "${passage.title}"` : 'Reflect on what was learned',
      },
    };
  }
}

module.exports = EarthSpace;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new EarthSpace();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) api.setGrade(id, grade);
        out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'K-2';
        if (skill) { out(api.generateExercise(grade, skill, 5)); }
        else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current grade!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(api.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(api.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? api.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(api.setGrade(id, g)); break; }
      case 'passage': { const [, g] = args; if (!g) throw new Error('Usage: passage <grade>'); out(api.getPassage(g)); break; }
      default: out({ usage: 'node earth-space.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','passage'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
