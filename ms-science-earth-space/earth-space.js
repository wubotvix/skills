// eClaw MS Earth & Space Science Interactive Tutor (6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-science-earth-space');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'space-systems': ['earth-sun-moon', 'seasons', 'lunar-phases', 'eclipses'],
    'solar-system': ['solar-system-formation', 'scale-of-solar-system', 'planets'],
  },
  'grade-7': {
    'earths-structure': ['earths-layers', 'plate-tectonics', 'plate-boundaries'],
    'geological-events': ['earthquakes', 'volcanoes', 'mountain-building'],
    'rocks-minerals': ['rock-cycle', 'rock-types', 'fossils', 'relative-dating'],
  },
  'grade-8': {
    'weather-climate': ['weather-vs-climate', 'atmosphere-layers', 'water-cycle', 'air-masses-fronts', 'severe-weather'],
    'earth-systems': ['ocean-currents', 'unequal-heating', 'climate-factors'],
    'human-impact': ['natural-resources', 'natural-hazards', 'climate-change-evidence', 'climate-change-causes', 'solutions'],
  },
};

const QUESTION_BANKS = {
  'grade-6': {
    'earth-sun-moon': {
      questions: [
        { q: 'What causes day and night on Earth?', a: 'Earth\'s rotation on its axis', type: 'open' },
        { q: 'How long does it take Earth to complete one rotation?', a: ['24 hours', '1 day'], type: 'multi' },
        { q: 'How long does it take Earth to complete one orbit around the Sun?', a: ['365.25 days', '1 year', '365 days'], type: 'multi' },
        { q: 'How long does it take the Moon to orbit Earth?', a: ['about 27 days', '27 days', '29.5 days'], type: 'multi' },
        { q: 'True or false: The Moon produces its own light.', a: 'false', type: 'tf' },
        { q: 'What keeps the Moon in orbit around Earth?', a: 'gravity', type: 'short' },
        { q: 'What keeps Earth in orbit around the Sun?', a: 'gravity', type: 'short' },
        { q: 'True or false: The Sun orbits around Earth.', a: 'false', type: 'tf' },
      ],
    },
    'seasons': {
      questions: [
        { q: 'What causes the seasons on Earth?', a: 'Earth\'s axial tilt of 23.5 degrees', type: 'open' },
        { q: 'True or false: Seasons are caused by Earth being closer to the Sun in summer.', a: 'false', type: 'tf' },
        { q: 'When the Northern Hemisphere has summer, what season does the Southern Hemisphere have?', a: 'winter', type: 'short' },
        { q: 'During which season is sunlight most direct in the Northern Hemisphere?', a: 'summer', type: 'short' },
        { q: 'What is the summer solstice?', a: 'the longest day of the year, when the Sun is highest in the sky', type: 'open' },
        { q: 'What is an equinox?', a: 'a day when day and night are approximately equal in length', type: 'open' },
        { q: 'What angle is Earth\'s axis tilted?', a: '23.5 degrees', type: 'short' },
        { q: 'Why are days longer in summer?', a: 'the hemisphere is tilted toward the Sun, so it receives more hours of sunlight', type: 'open' },
      ],
    },
    'lunar-phases': {
      questions: [
        { q: 'What causes the phases of the Moon?', a: 'the Moon\'s position relative to Earth and the Sun changes how much of the lit side we see', type: 'open' },
        { q: 'What phase is it when we cannot see the Moon?', a: 'new moon', type: 'short' },
        { q: 'What phase is it when we see the entire lit face?', a: 'full moon', type: 'short' },
        { q: 'How long is one complete lunar cycle?', a: ['29.5 days', 'about 29 days', 'about a month'], type: 'multi' },
        { q: 'During a waxing phase, is the lit portion growing or shrinking?', a: 'growing', type: 'short' },
        { q: 'During a waning phase, is the lit portion growing or shrinking?', a: 'shrinking', type: 'short' },
        { q: 'True or false: The Moon changes shape.', a: 'false', type: 'tf' },
        { q: 'List the major Moon phases in order starting from new moon.', a: 'new moon, waxing crescent, first quarter, waxing gibbous, full moon, waning gibbous, third quarter, waning crescent', type: 'open' },
      ],
    },
    'eclipses': {
      questions: [
        { q: 'What happens during a solar eclipse?', a: 'the Moon passes between the Sun and Earth, blocking sunlight', type: 'open' },
        { q: 'What happens during a lunar eclipse?', a: 'Earth passes between the Sun and Moon, casting a shadow on the Moon', type: 'open' },
        { q: 'During which Moon phase can a solar eclipse occur?', a: 'new moon', type: 'short' },
        { q: 'During which Moon phase can a lunar eclipse occur?', a: 'full moon', type: 'short' },
        { q: 'Why don\'t eclipses happen every month?', a: 'the Moon\'s orbit is tilted about 5 degrees relative to Earth\'s orbit', type: 'open' },
        { q: 'True or false: You should look directly at a solar eclipse without protection.', a: 'false', type: 'tf' },
        { q: 'Which is more commonly visible from any given location: solar or lunar eclipse?', a: 'lunar', type: 'short' },
        { q: 'What celestial body casts the shadow in a solar eclipse?', a: 'the Moon', type: 'short' },
      ],
    },
    'solar-system-formation': {
      questions: [
        { q: 'How old is our solar system?', a: ['about 4.6 billion years', '4.6 billion years'], type: 'multi' },
        { q: 'What did the solar system form from?', a: ['a cloud of gas and dust', 'nebula', 'solar nebula'], type: 'multi' },
        { q: 'What force caused the cloud to collapse?', a: 'gravity', type: 'short' },
        { q: 'What formed at the center of the collapsing cloud?', a: ['the Sun', 'Sun'], type: 'multi' },
        { q: 'True or false: All planets formed at the same time as the Sun.', a: 'false', type: 'tf' },
        { q: 'What are the rocky inner planets called?', a: 'terrestrial planets', type: 'short' },
        { q: 'What are the large outer planets called?', a: ['gas giants', 'Jovian planets'], type: 'multi' },
        { q: 'Why are rocky planets closer to the Sun?', a: 'closer to the Sun was too hot for gases to condense, so only rock and metal remained', type: 'open' },
      ],
    },
    'scale-of-solar-system': {
      questions: [
        { q: 'Which planet is closest to the Sun?', a: 'Mercury', type: 'short' },
        { q: 'Which planet is largest in our solar system?', a: 'Jupiter', type: 'short' },
        { q: 'What unit is used to measure distances to other stars?', a: ['light-year', 'light-years'], type: 'multi' },
        { q: 'About how long does it take light from the Sun to reach Earth?', a: ['about 8 minutes', '8 minutes'], type: 'multi' },
        { q: 'True or false: The distances between planets are much larger than the planets themselves.', a: 'true', type: 'tf' },
        { q: 'What is the asteroid belt located between?', a: 'Mars and Jupiter', type: 'short' },
        { q: 'How many planets are in our solar system?', a: '8', type: 'short' },
        { q: 'List the planets in order from the Sun.', a: 'Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune', type: 'open' },
      ],
    },
    'planets': {
      questions: [
        { q: 'Which planet is known as the Red Planet?', a: 'Mars', type: 'short' },
        { q: 'Which planet has the most visible rings?', a: 'Saturn', type: 'short' },
        { q: 'Which planet is most similar to Earth in size?', a: 'Venus', type: 'short' },
        { q: 'Which planet rotates on its side?', a: 'Uranus', type: 'short' },
        { q: 'Which planet has the Great Red Spot?', a: 'Jupiter', type: 'short' },
        { q: 'True or false: Earth is the only planet with an atmosphere.', a: 'false', type: 'tf' },
        { q: 'Which inner planet has no atmosphere?', a: 'Mercury', type: 'short' },
        { q: 'What makes Earth habitable compared to other planets?', a: ['liquid water', 'atmosphere', 'moderate temperature', 'distance from Sun'], type: 'multi' },
      ],
    },
  },
  'grade-7': {
    'earths-layers': {
      questions: [
        { q: 'What are Earth\'s four main layers from outside to inside?', a: 'crust, mantle, outer core, inner core', type: 'short' },
        { q: 'Which layer is the thinnest?', a: 'crust', type: 'short' },
        { q: 'Which layer is the thickest?', a: 'mantle', type: 'short' },
        { q: 'What is the outer core made of?', a: ['liquid iron and nickel', 'liquid metal'], type: 'multi' },
        { q: 'What is the inner core\'s state of matter?', a: 'solid', type: 'short' },
        { q: 'True or false: The entire interior of Earth is liquid.', a: 'false', type: 'tf' },
        { q: 'What generates Earth\'s magnetic field?', a: 'the movement of liquid iron in the outer core', type: 'open' },
        { q: 'True or false: The mantle is entirely liquid.', a: 'false', type: 'tf' },
      ],
    },
    'plate-tectonics': {
      questions: [
        { q: 'What is the theory of plate tectonics?', a: 'Earth\'s crust is divided into large plates that move on top of the mantle', type: 'open' },
        { q: 'What drives the movement of tectonic plates?', a: ['convection currents in the mantle', 'convection'], type: 'multi' },
        { q: 'Name one piece of evidence for plate tectonics.', a: ['continental shapes fit together', 'matching fossils across continents', 'seafloor spreading', 'magnetic stripes'], type: 'multi' },
        { q: 'What was the ancient supercontinent called?', a: 'Pangaea', type: 'short' },
        { q: 'True or false: Continents have always been in their current positions.', a: 'false', type: 'tf' },
        { q: 'What is seafloor spreading?', a: 'new oceanic crust is created at mid-ocean ridges as plates move apart', type: 'open' },
        { q: 'Where do most earthquakes and volcanoes occur?', a: 'along plate boundaries', type: 'short' },
        { q: 'Who proposed the theory of continental drift?', a: ['Alfred Wegener', 'Wegener'], type: 'multi' },
      ],
    },
    'plate-boundaries': {
      questions: [
        { q: 'What are the three types of plate boundaries?', a: 'convergent, divergent, and transform', type: 'short' },
        { q: 'What happens at a divergent boundary?', a: 'plates move apart and new crust forms', type: 'open' },
        { q: 'What happens at a convergent boundary?', a: 'plates collide; one may subduct under the other', type: 'open' },
        { q: 'What happens at a transform boundary?', a: 'plates slide past each other', type: 'open' },
        { q: 'The San Andreas Fault is what type of boundary?', a: 'transform', type: 'short' },
        { q: 'The Himalayas formed at what type of boundary?', a: 'convergent', type: 'short' },
        { q: 'Mid-ocean ridges form at what type of boundary?', a: 'divergent', type: 'short' },
        { q: 'What is subduction?', a: 'when one plate slides under another at a convergent boundary', type: 'open' },
      ],
    },
    'earthquakes': {
      questions: [
        { q: 'What causes earthquakes?', a: 'the sudden release of energy from moving tectonic plates', type: 'open' },
        { q: 'What is the point underground where an earthquake starts?', a: 'focus', type: 'short' },
        { q: 'What is the point on the surface directly above the focus?', a: 'epicenter', type: 'short' },
        { q: 'What scale measures earthquake magnitude?', a: ['Richter scale', 'moment magnitude scale'], type: 'multi' },
        { q: 'What type of waves do earthquakes produce?', a: 'seismic waves', type: 'short' },
        { q: 'True or false: Earthquakes only happen in California.', a: 'false', type: 'tf' },
        { q: 'What instrument records seismic waves?', a: 'seismograph', type: 'short' },
        { q: 'At which type of boundary do most earthquakes occur?', a: ['all three types', 'convergent', 'transform'], type: 'multi' },
      ],
    },
    'volcanoes': {
      questions: [
        { q: 'What is a volcano?', a: 'an opening in Earth\'s surface where magma reaches the surface', type: 'open' },
        { q: 'What is the difference between magma and lava?', a: 'magma is underground; lava is on the surface', type: 'open' },
        { q: 'At which plate boundary types do volcanoes form?', a: 'convergent and divergent', type: 'short' },
        { q: 'What is a hot spot?', a: 'a volcanic area not at a plate boundary, caused by a plume of magma from deep in the mantle', type: 'open' },
        { q: 'Name a volcanic hot spot.', a: ['Hawaii', 'Yellowstone', 'Iceland'], type: 'multi' },
        { q: 'What is the Ring of Fire?', a: 'a zone of frequent earthquakes and volcanoes around the Pacific Ocean', type: 'open' },
        { q: 'True or false: Volcanoes can form in the middle of a plate.', a: 'true', type: 'tf' },
        { q: 'What can volcanic eruptions release into the atmosphere?', a: ['ash', 'gases', 'lava', 'SO2', 'CO2'], type: 'multi' },
      ],
    },
    'mountain-building': {
      questions: [
        { q: 'How are most mountain ranges formed?', a: 'by convergent plate collisions that fold and push up rock', type: 'open' },
        { q: 'The Himalayas formed from the collision of which two plates?', a: 'Indian and Eurasian plates', type: 'short' },
        { q: 'What is folding?', a: 'when rock layers bend due to compression', type: 'open' },
        { q: 'What is faulting?', a: 'when rock layers break and move along a crack', type: 'open' },
        { q: 'True or false: Mountains can form at divergent boundaries.', a: 'true', type: 'tf' },
        { q: 'What type of mountains form from volcanic activity?', a: 'volcanic mountains', type: 'short' },
        { q: 'Are the Appalachians still growing taller?', a: 'no, they are being worn down by erosion', type: 'open' },
        { q: 'What process wears down mountains over time?', a: ['erosion', 'weathering', 'weathering and erosion'], type: 'multi' },
      ],
    },
    'rock-cycle': {
      questions: [
        { q: 'What are the three main types of rock?', a: 'igneous, sedimentary, and metamorphic', type: 'short' },
        { q: 'How does igneous rock form?', a: 'from the cooling and solidifying of magma or lava', type: 'open' },
        { q: 'How does sedimentary rock form?', a: 'from layers of sediment compacted and cemented together', type: 'open' },
        { q: 'How does metamorphic rock form?', a: 'from existing rock changed by heat and pressure', type: 'open' },
        { q: 'True or false: Rocks cannot change from one type to another.', a: 'false', type: 'tf' },
        { q: 'What drives the rock cycle?', a: ['heat from Earth\'s interior and energy from the Sun', 'plate tectonics and weathering'], type: 'multi' },
        { q: 'Can any rock type become any other rock type?', a: 'yes', type: 'short' },
        { q: 'What process breaks down rocks at the surface?', a: ['weathering', 'erosion'], type: 'multi' },
      ],
    },
    'rock-types': {
      questions: [
        { q: 'Name an example of igneous rock.', a: ['granite', 'basalt', 'obsidian', 'pumice'], type: 'multi' },
        { q: 'Name an example of sedimentary rock.', a: ['sandstone', 'limestone', 'shale', 'conglomerate'], type: 'multi' },
        { q: 'Name an example of metamorphic rock.', a: ['marble', 'slate', 'quartzite', 'gneiss'], type: 'multi' },
        { q: 'Which rock type is most likely to contain fossils?', a: 'sedimentary', type: 'short' },
        { q: 'Intrusive igneous rock has what kind of crystals?', a: ['large', 'large crystals', 'visible crystals'], type: 'multi' },
        { q: 'Extrusive igneous rock has what kind of crystals?', a: ['small', 'small crystals', 'no visible crystals'], type: 'multi' },
        { q: 'What is marble formed from?', a: 'limestone', type: 'short' },
        { q: 'What is the identifying feature of sedimentary rocks?', a: ['layers', 'strata', 'visible layers'], type: 'multi' },
      ],
    },
    'fossils': {
      questions: [
        { q: 'What is a fossil?', a: 'preserved remains or traces of ancient organisms', type: 'open' },
        { q: 'In which type of rock are fossils most commonly found?', a: 'sedimentary', type: 'short' },
        { q: 'True or false: Fossils are only dinosaur bones.', a: 'false', type: 'tf' },
        { q: 'Name a type of fossil besides body fossils.', a: ['trace fossil', 'footprint', 'mold', 'cast', 'amber'], type: 'multi' },
        { q: 'What conditions help preserve fossils?', a: 'rapid burial in sediment that prevents decay', type: 'open' },
        { q: 'How can fossils tell us about past environments?', a: 'the type of organism reveals what the environment was like when it lived', type: 'open' },
        { q: 'What is petrification?', a: 'when minerals replace organic material, turning it to stone', type: 'open' },
        { q: 'Finding tropical plant fossils in Antarctica suggests what?', a: 'Antarctica once had a warmer climate or was in a different location', type: 'open' },
      ],
    },
    'relative-dating': {
      questions: [
        { q: 'What is the law of superposition?', a: 'in undisturbed rock layers, the oldest layers are at the bottom', type: 'open' },
        { q: 'What is relative dating?', a: 'determining the order of events without knowing exact ages', type: 'open' },
        { q: 'What is absolute dating?', a: 'determining the actual age of rocks or fossils, usually with radiometric methods', type: 'open' },
        { q: 'What is radiometric dating based on?', a: 'the decay of radioactive isotopes', type: 'open' },
        { q: 'How old is Earth?', a: ['about 4.6 billion years', '4.6 billion years'], type: 'multi' },
        { q: 'True or false: Deeper rock layers are always older.', a: 'false', type: 'tf' },
        { q: 'What is an index fossil?', a: 'a fossil of an organism that lived for a short time over a wide area, used to date rock layers', type: 'open' },
        { q: 'What are the major divisions of the geological timescale?', a: 'eons, eras, periods, epochs', type: 'short' },
      ],
    },
  },
  'grade-8': {
    'weather-vs-climate': {
      questions: [
        { q: 'What is the difference between weather and climate?', a: 'weather is short-term conditions; climate is long-term patterns', type: 'open' },
        { q: '"It is raining today" describes weather or climate?', a: 'weather', type: 'short' },
        { q: '"Seattle averages 37 inches of rain per year" describes weather or climate?', a: 'climate', type: 'short' },
        { q: 'What time scale does weather cover?', a: ['hours to days', 'short-term'], type: 'multi' },
        { q: 'What time scale does climate cover?', a: ['decades to centuries', 'long-term', '30+ years'], type: 'multi' },
        { q: 'True or false: A cold day in winter disproves climate change.', a: 'false', type: 'tf' },
        { q: 'Can climate change even if day-to-day weather varies a lot?', a: 'yes', type: 'short' },
        { q: 'How many years of data are typically needed to define climate?', a: ['30', '30 years', 'at least 30 years'], type: 'multi' },
      ],
    },
    'atmosphere-layers': {
      questions: [
        { q: 'Which layer of the atmosphere do we live in?', a: 'troposphere', type: 'short' },
        { q: 'In which layer does weather occur?', a: 'troposphere', type: 'short' },
        { q: 'Which layer contains the ozone layer?', a: 'stratosphere', type: 'short' },
        { q: 'What does the ozone layer protect us from?', a: ['UV radiation', 'ultraviolet radiation'], type: 'multi' },
        { q: 'What are the four main layers of the atmosphere from lowest to highest?', a: 'troposphere, stratosphere, mesosphere, thermosphere', type: 'short' },
        { q: 'What happens to air pressure as you go higher in the atmosphere?', a: 'it decreases', type: 'short' },
        { q: 'What are the main gases in Earth\'s atmosphere?', a: 'nitrogen and oxygen', type: 'short' },
        { q: 'True or false: The atmosphere has a sharp boundary with space.', a: 'false', type: 'tf' },
      ],
    },
    'water-cycle': {
      questions: [
        { q: 'What are the main processes in the water cycle?', a: 'evaporation, condensation, precipitation, runoff, and infiltration', type: 'open' },
        { q: 'What provides the energy that drives the water cycle?', a: ['the Sun', 'solar energy'], type: 'multi' },
        { q: 'What is evaporation?', a: 'liquid water changing to water vapor', type: 'open' },
        { q: 'What is condensation?', a: 'water vapor changing to liquid water', type: 'open' },
        { q: 'What forms when water vapor condenses in the atmosphere?', a: 'clouds', type: 'short' },
        { q: 'What is runoff?', a: 'water flowing over land into streams, rivers, and oceans', type: 'open' },
        { q: 'True or false: Groundwater flows as underground rivers.', a: 'false', type: 'tf' },
        { q: 'What is an aquifer?', a: 'an underground layer of rock or sediment that holds groundwater', type: 'open' },
      ],
    },
    'air-masses-fronts': {
      questions: [
        { q: 'What is an air mass?', a: 'a large body of air with similar temperature and humidity', type: 'open' },
        { q: 'What is a front?', a: 'the boundary between two different air masses', type: 'open' },
        { q: 'What typically happens when a cold front moves through?', a: 'temperatures drop, storms may occur, then clearing', type: 'open' },
        { q: 'What typically happens when a warm front moves through?', a: 'gradual warming with steady rain or clouds', type: 'open' },
        { q: 'What is a stationary front?', a: 'a front that is not moving', type: 'open' },
        { q: 'Which type of front typically causes more severe weather?', a: 'cold front', type: 'short' },
        { q: 'What causes wind?', a: 'differences in air pressure', type: 'short' },
        { q: 'True or false: Air moves from high pressure to low pressure.', a: 'true', type: 'tf' },
      ],
    },
    'severe-weather': {
      questions: [
        { q: 'What conditions form a hurricane?', a: 'warm ocean water (above 80F/26C) and rotating winds', type: 'open' },
        { q: 'What is a tornado?', a: 'a violently rotating column of air extending from a thunderstorm to the ground', type: 'open' },
        { q: 'True or false: Hurricanes in the Northern Hemisphere spin counterclockwise.', a: 'true', type: 'tf' },
        { q: 'What causes the Coriolis effect?', a: 'Earth\'s rotation', type: 'short' },
        { q: 'What type of cloud is associated with thunderstorms?', a: 'cumulonimbus', type: 'short' },
        { q: 'What is the difference between a watch and a warning?', a: 'a watch means conditions are favorable; a warning means severe weather is occurring or imminent', type: 'open' },
        { q: 'What is storm surge?', a: 'a rise in sea level caused by a hurricane pushing water onshore', type: 'open' },
        { q: 'What scale measures hurricane intensity?', a: ['Saffir-Simpson', 'Saffir-Simpson scale'], type: 'multi' },
      ],
    },
    'ocean-currents': {
      questions: [
        { q: 'What drives surface ocean currents?', a: 'wind', type: 'short' },
        { q: 'What drives deep ocean currents?', a: ['differences in water density (temperature and salinity)', 'thermohaline circulation'], type: 'multi' },
        { q: 'How do ocean currents affect climate?', a: 'they redistribute heat around the globe', type: 'open' },
        { q: 'True or false: The Gulf Stream carries warm water from the tropics toward Europe.', a: 'true', type: 'tf' },
        { q: 'What is upwelling?', a: 'when cold, nutrient-rich water rises from the deep to the surface', type: 'open' },
        { q: 'Why is upwelling important for marine life?', a: 'it brings nutrients to the surface that support phytoplankton and fish', type: 'open' },
        { q: 'Does the Coriolis effect influence ocean currents?', a: 'yes', type: 'short' },
        { q: 'In which direction do ocean currents flow in the Northern Hemisphere?', a: 'clockwise', type: 'short' },
      ],
    },
    'unequal-heating': {
      questions: [
        { q: 'Why does the Sun heat Earth unevenly?', a: 'because of Earth\'s curved surface; equator gets more direct sunlight than the poles', type: 'open' },
        { q: 'What does unequal heating create in the atmosphere?', a: ['wind', 'convection currents', 'weather patterns'], type: 'multi' },
        { q: 'Where on Earth receives the most direct sunlight?', a: ['equator', 'the equator'], type: 'multi' },
        { q: 'True or false: Land heats up faster than water.', a: 'true', type: 'tf' },
        { q: 'What is a sea breeze?', a: 'wind blowing from the cooler ocean toward the warmer land during the day', type: 'open' },
        { q: 'What is a convection current?', a: 'circular movement of fluid caused by unequal heating', type: 'open' },
        { q: 'Why is it generally colder at the poles than the equator?', a: 'sunlight hits the poles at a low angle, spreading energy over a larger area', type: 'open' },
        { q: 'True or false: Unequal heating of Earth is what drives global wind patterns.', a: 'true', type: 'tf' },
      ],
    },
    'climate-factors': {
      questions: [
        { q: 'Name three factors that affect climate.', a: 'latitude, altitude, and proximity to oceans', type: 'short' },
        { q: 'How does latitude affect climate?', a: 'areas closer to the equator are warmer; areas closer to the poles are cooler', type: 'open' },
        { q: 'How does altitude affect temperature?', a: 'temperature decreases as altitude increases', type: 'open' },
        { q: 'How does proximity to an ocean affect climate?', a: 'oceans moderate temperature, making coastal areas milder', type: 'open' },
        { q: 'What is the rain shadow effect?', a: 'mountains block moist air, causing one side to be wet and the other side to be dry', type: 'open' },
        { q: 'True or false: Two cities at the same latitude always have the same climate.', a: 'false', type: 'tf' },
        { q: 'How do ocean currents affect coastal climates?', a: 'warm currents warm nearby land; cold currents cool nearby land', type: 'open' },
        { q: 'What role does topography play in climate?', a: 'mountains affect wind patterns, precipitation, and temperature', type: 'open' },
      ],
    },
    'natural-resources': {
      questions: [
        { q: 'What is the difference between renewable and nonrenewable resources?', a: 'renewable resources can be replenished; nonrenewable cannot be replaced in a human lifetime', type: 'open' },
        { q: 'Name a renewable resource.', a: ['solar', 'wind', 'water', 'biomass', 'geothermal'], type: 'multi' },
        { q: 'Name a nonrenewable resource.', a: ['coal', 'oil', 'natural gas', 'minerals', 'fossil fuels'], type: 'multi' },
        { q: 'Why are fossil fuels considered nonrenewable?', a: 'they take millions of years to form', type: 'open' },
        { q: 'True or false: Natural resources are evenly distributed around the world.', a: 'false', type: 'tf' },
        { q: 'What is conservation?', a: 'the responsible use and protection of natural resources', type: 'open' },
        { q: 'What is a fossil fuel?', a: 'a fuel formed from ancient organisms over millions of years (coal, oil, natural gas)', type: 'open' },
        { q: 'Name one way to conserve energy.', a: ['turning off lights', 'using public transit', 'insulating homes', 'using LED bulbs'], type: 'multi' },
      ],
    },
    'natural-hazards': {
      questions: [
        { q: 'Name three types of natural hazards.', a: 'earthquakes, volcanoes, and hurricanes', type: 'short' },
        { q: 'Can we prevent natural hazards from occurring?', a: 'no, but we can prepare for and mitigate their effects', type: 'open' },
        { q: 'How can studying past natural hazards help us?', a: 'we can identify patterns and predict where future events are likely', type: 'open' },
        { q: 'What is a hazard map?', a: 'a map showing areas at risk for specific natural hazards', type: 'open' },
        { q: 'True or false: All natural hazards are unpredictable.', a: 'false', type: 'tf' },
        { q: 'What is one way to prepare for earthquakes?', a: ['building codes', 'earthquake drills', 'securing heavy objects', 'emergency kits'], type: 'multi' },
        { q: 'Why do some areas have more natural hazards than others?', a: 'geological and geographical factors like plate boundaries and climate zones', type: 'open' },
        { q: 'How does a tsunami form?', a: 'usually from an underwater earthquake or volcanic eruption displacing water', type: 'open' },
      ],
    },
    'climate-change-evidence': {
      questions: [
        { q: 'Name one piece of evidence for climate change.', a: ['rising temperatures', 'melting ice', 'rising sea levels', 'ocean acidification', 'retreating glaciers'], type: 'multi' },
        { q: 'What are ice cores used for?', a: 'to study past atmospheric conditions and temperatures', type: 'open' },
        { q: 'True or false: Global average temperatures have increased over the past century.', a: 'true', type: 'tf' },
        { q: 'What is happening to sea levels?', a: 'they are rising', type: 'short' },
        { q: 'Why are sea levels rising?', a: 'thermal expansion of water and melting of ice sheets and glaciers', type: 'open' },
        { q: 'What is ocean acidification?', a: 'the ocean becomes more acidic as it absorbs excess CO2 from the atmosphere', type: 'open' },
        { q: 'What do temperature records from the past 150 years show?', a: 'a clear warming trend, especially in recent decades', type: 'open' },
        { q: 'How far back can ice core data go?', a: ['about 800,000 years', 'hundreds of thousands of years'], type: 'multi' },
      ],
    },
    'climate-change-causes': {
      questions: [
        { q: 'What are greenhouse gases?', a: 'gases that trap heat in the atmosphere', type: 'open' },
        { q: 'Name two greenhouse gases.', a: ['carbon dioxide', 'methane', 'water vapor', 'nitrous oxide'], type: 'multi' },
        { q: 'What is the greenhouse effect?', a: 'the trapping of heat in Earth\'s atmosphere by greenhouse gases', type: 'open' },
        { q: 'What human activity is the largest source of greenhouse gas emissions?', a: ['burning fossil fuels', 'fossil fuel combustion'], type: 'multi' },
        { q: 'How does deforestation contribute to climate change?', a: 'fewer trees means less CO2 is absorbed from the atmosphere', type: 'open' },
        { q: 'True or false: The greenhouse effect is entirely bad and unnatural.', a: 'false', type: 'tf' },
        { q: 'What has happened to CO2 levels since the Industrial Revolution?', a: 'they have increased significantly', type: 'short' },
        { q: 'How does agriculture contribute to greenhouse gas emissions?', a: ['methane from livestock', 'nitrous oxide from fertilizers', 'deforestation for farmland'], type: 'multi' },
      ],
    },
    'solutions': {
      questions: [
        { q: 'Name one way to reduce greenhouse gas emissions.', a: ['renewable energy', 'reduce fossil fuel use', 'electric vehicles', 'energy efficiency'], type: 'multi' },
        { q: 'What is a renewable energy source?', a: ['solar', 'wind', 'hydroelectric', 'geothermal'], type: 'multi' },
        { q: 'How can individuals reduce their carbon footprint?', a: ['drive less', 'eat less meat', 'reduce energy use', 'recycle', 'use public transit'], type: 'multi' },
        { q: 'What is carbon capture?', a: 'technology that captures CO2 emissions before they enter the atmosphere', type: 'open' },
        { q: 'True or false: There is only one solution to climate change.', a: 'false', type: 'tf' },
        { q: 'How can planting trees help with climate change?', a: 'trees absorb CO2 through photosynthesis', type: 'open' },
        { q: 'What is adaptation in the context of climate change?', a: 'adjusting to the effects of climate change that are already happening', type: 'open' },
        { q: 'What is mitigation in the context of climate change?', a: 'reducing or preventing greenhouse gas emissions', type: 'open' },
      ],
    },
  },
};

const PHENOMENA = {
  'grade-6': [
    { title: 'Day and Night', focus: 'space-systems', text: 'The Sun appears to move across the sky, but Earth is actually spinning.', drivingQuestion: 'Why do we experience day and night?' },
    { title: 'Puzzle Continents', focus: 'solar-system', text: 'South America and Africa look like puzzle pieces that fit together.', drivingQuestion: 'Were the continents once connected? What evidence supports this?' },
  ],
  'grade-7': [
    { title: 'Mountain Seashell', focus: 'rocks-minerals', text: 'You find a seashell fossil on top of a mountain.', drivingQuestion: 'How did an ocean organism end up on a mountain peak?' },
    { title: 'Ring of Fire', focus: 'geological-events', text: 'Most of the world\'s volcanoes are located in a ring around the Pacific Ocean.', drivingQuestion: 'Why are volcanoes concentrated in this pattern?' },
  ],
  'grade-8': [
    { title: 'Spinning Hurricanes', focus: 'weather-climate', text: 'Hurricanes always spin counterclockwise in the Northern Hemisphere.', drivingQuestion: 'What causes hurricanes to spin, and why always the same direction?' },
    { title: 'Shrinking Glaciers', focus: 'human-impact', text: 'Before-and-after photos show glaciers retreating dramatically over decades.', drivingQuestion: 'What is causing glaciers to shrink, and what are the consequences?' },
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

function generateExercise(grade, skill, count = 5) {
  const bank = QUESTION_BANKS[grade]?.[skill];
  if (!bank || !bank.questions) return { error: `No question bank for ${grade}/${skill}` };
  const items = pick(bank.questions, count).map(q => ({
    prompt: q.q, answer: Array.isArray(q.a) ? q.a[0] : q.a,
    acceptedAnswers: Array.isArray(q.a) ? q.a : [q.a], type: q.type,
  }));
  return { type: 'earth-space', skill, grade, count: items.length, instruction: 'Answer each question about earth and space science.', items };
}

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(r => norm(r) === norm(answer));
  return norm(expected) === norm(answer);
}

class MSEarthSpace {
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
    const grade = p.grade || 'grade-6';
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
    const grade = p.grade || 'grade-6';
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

  getReport(id) { const p = loadProfile(id); return { studentId: id, grade: p.grade, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }

  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }

  getSkillCatalog(grade) {
    const gs = SKILLS[grade];
    if (!gs) return { grade, error: `Unknown grade. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0; const catalog = {};
    for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; }
    return { grade, skills: catalog, totalSkills: total };
  }

  generateExercise(grade, skill, count = 5) { return generateExercise(grade, skill, count); }
  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  getPhenomenon(grade) {
    const phenom = PHENOMENA[grade];
    if (!phenom) return { error: `No phenomena for ${grade}. Available: ${Object.keys(PHENOMENA).join(', ')}` };
    return pick(phenom, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-6';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const phenom = PHENOMENA[grade] ? pick(PHENOMENA[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, phenomenon: phenom,
      lessonPlan: {
        engage: phenom ? `Phenomenon: ${phenom.title} — ${phenom.drivingQuestion}` : 'Explore an earth or space science observation',
        explore: `Investigate: ${target.category} > ${target.skill}`,
        explain: `Build understanding with ${exercise.count || 0} practice items`,
        elaborate: 'Apply to a different location, time period, or connected system',
        evaluate: 'Check understanding with CER response or systems diagram',
      },
    };
  }
}

module.exports = MSEarthSpace;

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new MSEarthSpace();
  const out = d => console.log(JSON.stringify(d, null, 2));
  try {
    switch (cmd) {
      case 'start': { const [, id, grade] = args; if (!id) throw new Error('Usage: start <id> [grade]'); if (grade) api.setGrade(id, grade); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const grade = loadProfile(id).grade || 'grade-6'; if (skill) { out(api.generateExercise(grade, skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current grade!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); let exp = expected; try { exp = JSON.parse(expected); } catch {} out(api.checkAnswer(type, exp, answer)); break; }
      case 'record': { const [, id, grade, cat, skill, sc, tot, ...notes] = args; if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]'); out(api.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? api.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(api.setGrade(id, g)); break; }
      case 'phenomenon': { const [, g] = args; if (!g) throw new Error('Usage: phenomenon <grade>'); out(api.getPhenomenon(g)); break; }
      default: out({ usage: 'node earth-space.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','phenomenon'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
