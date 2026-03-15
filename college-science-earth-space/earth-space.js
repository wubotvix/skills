// eClaw College Earth & Space Sciences Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-science-earth-space');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'introductory': {
    'plate-tectonics': ['plate-boundaries', 'continental-drift', 'seafloor-spreading', 'hotspots', 'tectonic-hazards'],
    'rock-cycle': ['igneous-rocks', 'sedimentary-rocks', 'metamorphic-rocks', 'mineral-identification', 'rock-classification'],
    'weather-climate': ['atmosphere-layers', 'weather-vs-climate', 'pressure-systems', 'fronts-storms', 'climate-zones'],
    'solar-system': ['planetary-overview', 'lunar-phases', 'eclipses', 'kepler-laws-intro', 'formation-of-solar-system'],
    'geologic-time': ['relative-dating', 'absolute-dating', 'geologic-time-scale', 'fossils-stratigraphy', 'mass-extinctions'],
    'natural-hazards': ['earthquakes', 'volcanoes', 'tsunamis', 'severe-weather', 'flood-landslide'],
  },
  'intermediate': {
    'structural-geology': ['stress-strain', 'folds', 'faults', 'geologic-maps', 'cross-sections'],
    'mineralogy': ['crystal-systems', 'mineral-chemistry', 'optical-mineralogy', 'silicate-structures', 'mineral-stability'],
    'atmospheric-dynamics': ['radiation-balance', 'general-circulation', 'jet-streams', 'monsoons', 'enso'],
    'oceanography': ['ocean-circulation', 'thermohaline-circulation', 'waves-tides', 'marine-ecosystems', 'ocean-chemistry'],
    'planetary-science': ['kepler-newton-laws', 'planetary-atmospheres', 'exoplanets', 'astrobiology-intro', 'space-missions'],
    'biogeochemical-cycles': ['carbon-cycle', 'nitrogen-cycle', 'water-cycle', 'phosphorus-cycle', 'human-impacts'],
  },
  'upper-division': {
    'seismology': ['seismic-waves', 'earthquake-location', 'focal-mechanisms', 'earth-interior', 'seismic-tomography'],
    'petrology': ['igneous-petrology', 'metamorphic-petrology', 'phase-diagrams', 'geochemistry-basics', 'isotope-geochemistry'],
    'climate-science': ['paleoclimatology', 'climate-models', 'greenhouse-effect-detail', 'feedback-mechanisms', 'climate-projections'],
    'planetary-formation': ['nebular-hypothesis', 'accretion', 'differentiation', 'giant-impacts', 'comparative-planetology'],
    'geophysics': ['gravity-methods', 'magnetic-methods', 'heat-flow', 'geoelectric-methods', 'geodesy'],
    'environmental-geoscience': ['groundwater-hydrology', 'soil-science', 'environmental-remediation', 'natural-resource-geology', 'geohazard-assessment'],
  },
};

const QUESTION_BANKS = {
  'introductory': {
    'plate-boundaries': {
      items: [
        { prompt: 'Name the three types of plate boundaries and give an example of each.', answer: 'Divergent (Mid-Atlantic Ridge), Convergent (Himalayas), Transform (San Andreas Fault)', type: 'concept' },
        { prompt: 'What forms at a divergent plate boundary?', answer: 'New oceanic crust (mid-ocean ridges), rift valleys', type: 'concept' },
        { prompt: 'What happens when an oceanic plate collides with a continental plate?', answer: 'Subduction: oceanic plate dives beneath continental plate, forming a trench and volcanic arc', type: 'concept' },
        { prompt: 'What drives plate tectonics?', answer: 'Mantle convection, ridge push, and slab pull', type: 'concept' },
      ],
    },
    'continental-drift': {
      items: [
        { prompt: 'Who proposed continental drift and when?', answer: 'Alfred Wegener, 1912', type: 'concept' },
        { prompt: 'Name three lines of evidence for continental drift.', answer: 'Matching coastlines, fossil distributions, paleoclimatic evidence (glacial deposits, coal beds)', type: 'concept' },
      ],
    },
    'seafloor-spreading': {
      items: [
        { prompt: 'What evidence supports seafloor spreading?', answer: 'Magnetic striping (reversals), age of ocean floor increasing from ridges, heat flow patterns', type: 'concept' },
      ],
    },
    'hotspots': {
      items: [
        { prompt: 'How do hotspot tracks form?', answer: 'A stationary mantle plume creates volcanoes as a plate moves over it, forming a chain (e.g., Hawaiian Islands)', type: 'concept' },
      ],
    },
    'tectonic-hazards': {
      items: [
        { prompt: 'Why do earthquakes occur at plate boundaries?', answer: 'Stress builds as plates interact; sudden release creates seismic waves', type: 'concept' },
      ],
    },
    'igneous-rocks': {
      items: [
        { prompt: 'What is the difference between intrusive and extrusive igneous rocks?', answer: 'Intrusive (plutonic): cool slowly underground, large crystals (granite). Extrusive (volcanic): cool quickly at surface, small crystals (basalt)', type: 'concept' },
        { prompt: 'What determines the texture of an igneous rock?', answer: 'Cooling rate: slow = coarse-grained, fast = fine-grained, very fast = glassy', type: 'concept' },
      ],
    },
    'sedimentary-rocks': {
      items: [
        { prompt: 'Name three types of sedimentary rocks with examples.', answer: 'Clastic (sandstone), chemical (limestone from precipitation), organic (coal)', type: 'concept' },
      ],
    },
    'metamorphic-rocks': {
      items: [
        { prompt: 'What causes metamorphism?', answer: 'Heat, pressure, and chemically active fluids change existing rock mineralogy and texture', type: 'concept' },
        { prompt: 'What is foliation?', answer: 'Alignment of flat/elongate minerals perpendicular to pressure, creating layered texture (e.g., schist, gneiss)', type: 'concept' },
      ],
    },
    'mineral-identification': {
      items: [
        { prompt: 'Name five physical properties used to identify minerals.', answer: 'Hardness, luster, streak, cleavage/fracture, color', type: 'concept' },
      ],
    },
    'rock-classification': {
      items: [
        { prompt: 'Describe the rock cycle.', answer: 'Igneous -> (weathering) -> Sedimentary -> (heat/pressure) -> Metamorphic -> (melting) -> Igneous. Any rock type can become any other.', type: 'concept' },
      ],
    },
    'atmosphere-layers': {
      items: [
        { prompt: 'Name the four main layers of the atmosphere from bottom to top.', answer: 'Troposphere, Stratosphere, Mesosphere, Thermosphere', type: 'concept' },
        { prompt: 'In which layer does weather occur?', answer: 'Troposphere', type: 'concept' },
      ],
    },
    'weather-vs-climate': {
      items: [
        { prompt: 'Distinguish weather from climate.', answer: 'Weather: short-term atmospheric conditions. Climate: long-term average patterns (30+ years)', type: 'concept' },
      ],
    },
    'pressure-systems': {
      items: [
        { prompt: 'How do high and low pressure systems differ in terms of weather?', answer: 'High: sinking air, clear skies. Low: rising air, clouds, precipitation', type: 'concept' },
      ],
    },
    'fronts-storms': {
      items: [
        { prompt: 'What is a cold front?', answer: 'Leading edge of a cold air mass displacing warmer air; causes rapid lifting, thunderstorms', type: 'concept' },
      ],
    },
    'climate-zones': {
      items: [
        { prompt: 'Name the five major climate zones.', answer: 'Tropical, dry, temperate, continental, polar', type: 'concept' },
      ],
    },
    'planetary-overview': {
      items: [
        { prompt: 'Name the terrestrial and gas giant planets.', answer: 'Terrestrial: Mercury, Venus, Earth, Mars. Gas giants: Jupiter, Saturn (gas), Uranus, Neptune (ice giants)', type: 'concept' },
      ],
    },
    'lunar-phases': {
      items: [
        { prompt: 'Why do we see lunar phases?', answer: 'The Moon orbits Earth; we see different portions of its sunlit half depending on geometry', type: 'concept' },
      ],
    },
    'eclipses': {
      items: [
        { prompt: 'What causes a solar eclipse?', answer: 'Moon passes between Earth and Sun, casting its shadow on Earth', type: 'concept' },
      ],
    },
    'kepler-laws-intro': {
      items: [
        { prompt: 'State Kepler\'s first law.', answer: 'Planets orbit the Sun in ellipses with the Sun at one focus', type: 'concept' },
      ],
    },
    'formation-of-solar-system': {
      items: [
        { prompt: 'Describe the nebular hypothesis.', answer: 'Solar system formed from a rotating cloud of gas and dust that collapsed, flattened into a disk, and accreted into planets', type: 'concept' },
      ],
    },
    'relative-dating': {
      items: [
        { prompt: 'State the principle of superposition.', answer: 'In undisturbed sedimentary layers, older layers are on the bottom and younger on top', type: 'concept' },
      ],
    },
    'absolute-dating': {
      items: [
        { prompt: 'How does radiometric dating work?', answer: 'Measures decay of radioactive isotopes. Half-life = time for half the parent to decay to daughter', type: 'concept' },
      ],
    },
    'geologic-time-scale': {
      items: [
        { prompt: 'Name the four eons in order.', answer: 'Hadean, Archean, Proterozoic, Phanerozoic', type: 'concept' },
      ],
    },
    'fossils-stratigraphy': {
      items: [
        { prompt: 'What are index fossils and why are they useful?', answer: 'Fossils of organisms that lived briefly but widely. Used to correlate rock ages across regions', type: 'concept' },
      ],
    },
    'mass-extinctions': {
      items: [
        { prompt: 'Name the biggest mass extinction and when it occurred.', answer: 'Permian-Triassic (~252 Ma), ~96% of marine species lost', type: 'concept' },
      ],
    },
    'earthquakes': {
      items: [
        { prompt: 'What is the difference between the Richter scale and moment magnitude?', answer: 'Richter: based on seismogram amplitude (local). Moment magnitude (Mw): based on seismic moment, works for all sizes', type: 'concept' },
      ],
    },
    'volcanoes': {
      items: [
        { prompt: 'Compare shield volcanoes and stratovolcanoes.', answer: 'Shield: broad, gentle slopes, basaltic lava (Hawaii). Strato: steep, explosive, mixed composition (Mt. St. Helens)', type: 'concept' },
      ],
    },
    'tsunamis': {
      items: [
        { prompt: 'What causes tsunamis?', answer: 'Vertical displacement of ocean floor from earthquakes, submarine landslides, or volcanic eruptions', type: 'concept' },
      ],
    },
    'severe-weather': {
      items: [
        { prompt: 'What atmospheric conditions produce tornadoes?', answer: 'Wind shear creating rotating updraft (mesocyclone) in a supercell thunderstorm', type: 'concept' },
      ],
    },
    'flood-landslide': {
      items: [
        { prompt: 'What factors increase landslide risk?', answer: 'Steep slopes, saturated soil, deforestation, earthquakes, weak rock layers', type: 'concept' },
      ],
    },
  },
  'intermediate': {
    'stress-strain': {
      items: [
        { prompt: 'Define stress and strain in geology.', answer: 'Stress: force per unit area on a rock. Strain: resulting deformation (change in shape/volume)', type: 'concept' },
        { prompt: 'What are the three types of stress?', answer: 'Compressional (push together), tensional (pull apart), shear (slide past)', type: 'concept' },
      ],
    },
    'folds': {
      items: [
        { prompt: 'Distinguish anticline and syncline.', answer: 'Anticline: arch-shaped fold (oldest rocks in center). Syncline: trough-shaped (youngest in center)', type: 'concept' },
      ],
    },
    'faults': {
      items: [
        { prompt: 'Compare normal, reverse, and strike-slip faults.', answer: 'Normal: hanging wall drops (tension). Reverse: hanging wall rises (compression). Strike-slip: horizontal movement (shear)', type: 'concept' },
      ],
    },
    'geologic-maps': {
      items: [
        { prompt: 'What information does a geologic map convey?', answer: 'Distribution of rock units, their ages, structures (folds, faults), contacts, and orientations (strike/dip)', type: 'concept' },
      ],
    },
    'cross-sections': {
      items: [
        { prompt: 'What is a geologic cross-section?', answer: 'A vertical slice through the Earth showing subsurface rock layers, structures, and geometry', type: 'concept' },
      ],
    },
    'crystal-systems': {
      items: [
        { prompt: 'How many crystal systems are there? Name them.', answer: 'Seven: cubic, tetragonal, orthorhombic, hexagonal, trigonal, monoclinic, triclinic', type: 'concept' },
      ],
    },
    'mineral-chemistry': {
      items: [
        { prompt: 'What is isomorphous substitution?', answer: 'Replacement of one ion by another of similar size and charge in a crystal structure (e.g., Fe for Mg in olivine)', type: 'concept' },
      ],
    },
    'optical-mineralogy': {
      items: [
        { prompt: 'What is birefringence in thin section?', answer: 'Double refraction: light splits into two rays with different velocities. Seen as interference colors under crossed polars', type: 'concept' },
      ],
    },
    'silicate-structures': {
      items: [
        { prompt: 'List the silicate structural types from isolated to framework.', answer: 'Nesosilicate (isolated), sorosilicate (pairs), cyclosilicate (rings), inosilicate (chains), phyllosilicate (sheets), tectosilicate (framework)', type: 'concept' },
      ],
    },
    'mineral-stability': {
      items: [
        { prompt: 'What does Bowen\'s reaction series describe?', answer: 'Order of mineral crystallization from cooling magma: olivine first, quartz last. Relates to mineral stability', type: 'concept' },
      ],
    },
    'radiation-balance': {
      items: [
        { prompt: 'What is Earth\'s energy budget?', answer: 'Incoming solar radiation balanced by reflected shortwave and emitted longwave radiation. Imbalance = climate change', type: 'concept' },
      ],
    },
    'general-circulation': {
      items: [
        { prompt: 'Name the three main atmospheric circulation cells.', answer: 'Hadley (0-30), Ferrel (30-60), Polar (60-90)', type: 'concept' },
      ],
    },
    'jet-streams': {
      items: [
        { prompt: 'What causes jet streams?', answer: 'Temperature gradients between air masses create strong pressure differences aloft, driving fast upper-level winds', type: 'concept' },
      ],
    },
    'monsoons': {
      items: [
        { prompt: 'Explain the monsoon mechanism.', answer: 'Seasonal reversal of wind direction due to differential heating of land and ocean. Summer: ocean to land (wet). Winter: land to ocean (dry)', type: 'concept' },
      ],
    },
    'enso': {
      items: [
        { prompt: 'Describe El Nino and its global effects.', answer: 'Weakened trade winds allow warm water to shift east in Pacific. Causes drought in Australia/SE Asia, flooding in South America, global weather disruption', type: 'concept' },
      ],
    },
    'ocean-circulation': {
      items: [
        { prompt: 'What drives surface ocean currents?', answer: 'Wind stress, Coriolis effect, and continental boundaries. Creates gyres', type: 'concept' },
      ],
    },
    'thermohaline-circulation': {
      items: [
        { prompt: 'What drives thermohaline circulation?', answer: 'Density differences from temperature and salinity. Cold, salty water sinks at poles, creating deep water that flows globally', type: 'concept' },
      ],
    },
    'waves-tides': {
      items: [
        { prompt: 'What causes tides?', answer: 'Gravitational pull of Moon and Sun on Earth\'s water. Spring tides (aligned), neap tides (perpendicular)', type: 'concept' },
      ],
    },
    'marine-ecosystems': {
      items: [
        { prompt: 'What are hydrothermal vents and why are they biologically important?', answer: 'Volcanic openings on ocean floor releasing hot, mineral-rich water. Support chemosynthetic ecosystems independent of sunlight', type: 'concept' },
      ],
    },
    'ocean-chemistry': {
      items: [
        { prompt: 'What is ocean acidification?', answer: 'CO2 dissolves in seawater forming carbonic acid, lowering pH. Threatens calcifying organisms (corals, shellfish)', type: 'concept' },
      ],
    },
    'kepler-newton-laws': {
      items: [
        { prompt: 'State Kepler\'s third law.', answer: 'T^2 = a^3 (period squared proportional to semi-major axis cubed) for orbits around the same body', type: 'concept' },
      ],
    },
    'planetary-atmospheres': {
      items: [
        { prompt: 'Why does Venus have a runaway greenhouse effect?', answer: 'Thick CO2 atmosphere traps heat. No water cycle to sequester carbon. Surface ~460C', type: 'concept' },
      ],
    },
    'exoplanets': {
      items: [
        { prompt: 'Name two methods for detecting exoplanets.', answer: 'Transit method (dimming as planet crosses star) and radial velocity (Doppler wobble of star)', type: 'concept' },
      ],
    },
    'astrobiology-intro': {
      items: [
        { prompt: 'What is the habitable zone?', answer: 'The orbital distance range where liquid water can exist on a planet\'s surface. Depends on star luminosity', type: 'concept' },
      ],
    },
    'space-missions': {
      items: [
        { prompt: 'What did the Mars rovers (Spirit/Opportunity/Curiosity) discover?', answer: 'Evidence of past water: layered sediments, mineral clays, rounded pebbles, sulfate deposits', type: 'concept' },
      ],
    },
    'carbon-cycle': {
      items: [
        { prompt: 'Describe the long-term carbon cycle.', answer: 'CO2 from volcanism -> weathering of silicates -> carried to ocean -> deposited as carbonates -> subducted -> released. Thermostat over millions of years', type: 'concept' },
      ],
    },
    'nitrogen-cycle': {
      items: [
        { prompt: 'What is nitrogen fixation?', answer: 'Conversion of atmospheric N2 to biologically usable forms (NH3/NH4+) by bacteria (Rhizobium) or lightning', type: 'concept' },
      ],
    },
    'water-cycle': {
      items: [
        { prompt: 'Name the main processes in the water cycle.', answer: 'Evaporation, condensation, precipitation, runoff, infiltration, transpiration', type: 'concept' },
      ],
    },
    'phosphorus-cycle': {
      items: [
        { prompt: 'How does the phosphorus cycle differ from carbon and nitrogen cycles?', answer: 'No significant gas phase. Phosphorus cycles through rocks, soil, water, and organisms only', type: 'concept' },
      ],
    },
    'human-impacts': {
      items: [
        { prompt: 'How have humans altered the carbon cycle?', answer: 'Burning fossil fuels and deforestation add CO2 faster than natural sinks can absorb, causing climate change', type: 'concept' },
      ],
    },
  },
  'upper-division': {
    'seismic-waves': {
      items: [
        { prompt: 'Compare P-waves and S-waves.', answer: 'P: compressional, travel through solids and liquids, faster. S: shear, solids only, slower. S-wave shadow zone reveals liquid outer core', type: 'concept' },
        { prompt: 'How do seismic waves reveal Earth\'s internal structure?', answer: 'Velocity changes at boundaries (refraction/reflection). Shadow zones for P and S waves reveal core-mantle boundary and liquid outer core', type: 'concept' },
      ],
    },
    'earthquake-location': {
      items: [
        { prompt: 'How is an earthquake epicenter located?', answer: 'Triangulation: use S-P time difference from 3+ stations to determine distance, then intersect circles', type: 'concept' },
      ],
    },
    'focal-mechanisms': {
      items: [
        { prompt: 'What does a focal mechanism ("beach ball") diagram show?', answer: 'Orientation of fault plane and type of faulting (normal, reverse, strike-slip) from first-motion patterns', type: 'concept' },
      ],
    },
    'earth-interior': {
      items: [
        { prompt: 'Name the main layers of Earth\'s interior with approximate depths.', answer: 'Crust (0-70km), mantle (70-2900km), outer core (2900-5150km, liquid Fe), inner core (5150-6371km, solid Fe)', type: 'concept' },
      ],
    },
    'seismic-tomography': {
      items: [
        { prompt: 'What is seismic tomography?', answer: '3D imaging of Earth\'s interior using variations in seismic wave speed. Reveals hot (slow) and cold (fast) regions in the mantle', type: 'concept' },
      ],
    },
    'igneous-petrology': {
      items: [
        { prompt: 'What controls magma composition?', answer: 'Source rock composition, degree of partial melting, fractional crystallization, assimilation, and magma mixing', type: 'concept' },
      ],
    },
    'metamorphic-petrology': {
      items: [
        { prompt: 'What is a metamorphic facies?', answer: 'Set of mineral assemblages that form under specific P-T conditions (e.g., greenschist, amphibolite, granulite facies)', type: 'concept' },
      ],
    },
    'phase-diagrams': {
      items: [
        { prompt: 'How do you read a pressure-temperature phase diagram for a mineral system?', answer: 'Fields represent stable mineral assemblages at given P-T. Boundary lines are reactions. Follow a P-T path to predict mineral changes', type: 'concept' },
      ],
    },
    'geochemistry-basics': {
      items: [
        { prompt: 'What are compatible vs incompatible elements in igneous petrology?', answer: 'Compatible: prefer solid (Mg, Cr). Incompatible: prefer melt (K, Rb, U). During melting, incompatibles concentrate in the liquid', type: 'concept' },
      ],
    },
    'isotope-geochemistry': {
      items: [
        { prompt: 'How are oxygen isotopes (d18O) used in paleoclimate?', answer: 'Higher d18O in ocean sediment forams = more ice (lighter O16 locked in glaciers). Proxy for ice volume and temperature', type: 'concept' },
      ],
    },
    'paleoclimatology': {
      items: [
        { prompt: 'Name three paleoclimate proxies.', answer: 'Ice cores (trapped gas, d18O), tree rings (width/density), ocean sediment cores (foram assemblages, isotopes)', type: 'concept' },
      ],
    },
    'climate-models': {
      items: [
        { prompt: 'What are the main components of a general circulation model (GCM)?', answer: 'Atmosphere, ocean, land surface, sea ice, coupled through energy/mass/momentum exchanges. Solved on a 3D grid', type: 'concept' },
      ],
    },
    'greenhouse-effect-detail': {
      items: [
        { prompt: 'Explain the mechanism of the greenhouse effect in detail.', answer: 'Earth absorbs solar shortwave, re-emits longwave IR. Greenhouse gases absorb and re-emit IR in all directions, warming the surface', type: 'concept' },
      ],
    },
    'feedback-mechanisms': {
      items: [
        { prompt: 'Give an example of a positive and negative climate feedback.', answer: 'Positive: ice-albedo (less ice -> less reflection -> more warming -> less ice). Negative: increased weathering with warming consumes CO2', type: 'concept' },
      ],
    },
    'climate-projections': {
      items: [
        { prompt: 'What are RCP/SSP scenarios?', answer: 'Representative Concentration Pathways/Shared Socioeconomic Pathways: standardized scenarios of future greenhouse gas emissions for climate modeling', type: 'concept' },
      ],
    },
    'nebular-hypothesis': {
      items: [
        { prompt: 'Describe the stages of the nebular hypothesis.', answer: 'Molecular cloud collapse -> spinning disk -> Sun forms at center -> dust grains accrete into planetesimals -> planetesimals into protoplanets -> clearing', type: 'concept' },
      ],
    },
    'accretion': {
      items: [
        { prompt: 'What is the difference between accretion and differentiation?', answer: 'Accretion: building up a body from smaller pieces. Differentiation: separation into layers by density (core, mantle, crust)', type: 'concept' },
      ],
    },
    'differentiation': {
      items: [
        { prompt: 'How did Earth differentiate?', answer: 'Heat from accretion/radioactive decay melted interior. Dense iron sank to form core; lighter silicates rose to form mantle/crust', type: 'concept' },
      ],
    },
    'giant-impacts': {
      items: [
        { prompt: 'Describe the giant impact hypothesis for the Moon\'s origin.', answer: 'A Mars-sized body (Theia) hit early Earth. Debris formed a disk that accreted into the Moon. Explains Moon\'s low iron, similar isotopes', type: 'concept' },
      ],
    },
    'comparative-planetology': {
      items: [
        { prompt: 'Compare the atmospheres of Venus, Earth, and Mars.', answer: 'Venus: thick CO2, extreme greenhouse. Earth: N2/O2, moderate greenhouse. Mars: thin CO2, minimal greenhouse. Size and distance from Sun matter', type: 'concept' },
      ],
    },
    'gravity-methods': {
      items: [
        { prompt: 'How do gravity surveys reveal subsurface structure?', answer: 'Measure variations in gravitational acceleration. Dense rocks = positive anomaly. Low density = negative. Reveals buried structures, basins, ore bodies', type: 'concept' },
      ],
    },
    'magnetic-methods': {
      items: [
        { prompt: 'What is paleomagnetism and how is it used?', answer: 'Rocks record Earth\'s magnetic field when they form. Used for dating (magnetic reversals), plate reconstruction, and understanding core dynamics', type: 'concept' },
      ],
    },
    'heat-flow': {
      items: [
        { prompt: 'Why is heat flow highest at mid-ocean ridges?', answer: 'New hot material rises from mantle. Heat flow decreases with distance as lithosphere cools and thickens', type: 'concept' },
      ],
    },
    'geoelectric-methods': {
      items: [
        { prompt: 'How does electrical resistivity surveying work?', answer: 'Inject current into ground, measure voltage. Resistivity depends on rock type, porosity, fluid content. Maps subsurface layers', type: 'concept' },
      ],
    },
    'geodesy': {
      items: [
        { prompt: 'How does GPS measure plate motion?', answer: 'Precise positioning over years shows mm/yr plate velocities. Confirms plate tectonics, measures strain accumulation near faults', type: 'concept' },
      ],
    },
    'groundwater-hydrology': {
      items: [
        { prompt: 'Define aquifer, water table, and porosity.', answer: 'Aquifer: rock/sediment that stores and transmits water. Water table: upper surface of saturated zone. Porosity: fraction of void space', type: 'concept' },
      ],
    },
    'soil-science': {
      items: [
        { prompt: 'What are the main soil horizons?', answer: 'O (organic), A (topsoil), B (subsoil/accumulation), C (weathered parent), R (bedrock)', type: 'concept' },
      ],
    },
    'environmental-remediation': {
      items: [
        { prompt: 'What is bioremediation?', answer: 'Using microorganisms to break down contaminants (e.g., oil spills, heavy metals). Can be in situ or ex situ', type: 'concept' },
      ],
    },
    'natural-resource-geology': {
      items: [
        { prompt: 'What geologic processes form mineral deposits?', answer: 'Magmatic segregation, hydrothermal circulation, sedimentary concentration, weathering/laterite formation', type: 'concept' },
      ],
    },
    'geohazard-assessment': {
      items: [
        { prompt: 'What factors go into a seismic hazard assessment?', answer: 'Fault locations, recurrence intervals, magnitude potential, site geology (amplification), distance, building vulnerability', type: 'concept' },
      ],
    },
  },
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
  return { studentId: id, level: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
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

function generateExercise(level, skill, count = 5) {
  const bank = QUESTION_BANKS[level]?.[skill];
  if (!bank || !bank.items) return { error: `No question bank for ${level}/${skill}` };
  const items = pick(bank.items, count);
  return { type: 'earth-space', skill, level, count: items.length, instruction: 'Answer each question. Connect concepts to Earth systems thinking.', items };
}

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(r => norm(r) === norm(answer));
  return norm(expected) === norm(answer);
}

// Public API

class CollegeEarthSpace {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, level: p.level, createdAt: p.createdAt, totalAssessments: p.assessments.length };
  }

  setLevel(id, level) {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    const p = loadProfile(id); p.level = level; saveProfile(p);
    return { studentId: id, level };
  }

  recordAssessment(id, level, category, skill, score, total, notes = '') {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}`);
    if (!SKILLS[level][category]) throw new Error(`Unknown category '${category}' for ${level}`);
    if (!SKILLS[level][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${level}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);

    const p = loadProfile(id);
    if (!p.level) p.level = level;
    const entry = { date: new Date().toISOString(), level, category, skill, score, total, notes };
    p.assessments.push(entry);
    const key = `${level}/${category}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p);
    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const level = p.level || 'introductory';
    const ls = SKILLS[level] || {};
    const results = {};
    let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(ls)) {
      results[cat] = {};
      for (const sk of skills) {
        total++;
        const d = p.skills[`${level}/${cat}/${sk}`];
        results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
      }
    }
    return { studentId: id, level, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id);
    const level = p.level || 'introductory';
    const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS[level] || {})) {
      for (const sk of skills) {
        const d = p.skills[`${level}/${cat}/${sk}`];
        const m = d ? d.mastery : 0;
        if (m < MASTERY_THRESHOLD) candidates.push({ level, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' });
      }
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, level, next: candidates.slice(0, count) };
  }

  getReport(id) {
    const p = loadProfile(id);
    return { studentId: id, level: p.level, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }

  getSkillCatalog(level) {
    const ls = SKILLS[level];
    if (!ls) return { level, error: `Unknown level. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0;
    const catalog = {};
    for (const [cat, skills] of Object.entries(ls)) { total += skills.length; catalog[cat] = [...skills]; }
    return { level, skills: catalog, totalSkills: total };
  }

  generateExercise(level, skill, count = 5) { return generateExercise(level, skill, count); }

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  generateLesson(id) {
    const p = loadProfile(id);
    const level = p.level || 'introductory';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Ready for next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    return {
      studentId: id, level, targetSkill: target, exercise,
      lessonPlan: {
        review: 'Review previously learned concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} -> ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Connect to Earth systems: how does this process interact with other spheres?',
        reflect: `Place ${target.skill} in the context of deep time and system interactions`,
      },
    };
  }
}

module.exports = CollegeEarthSpace;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new CollegeEarthSpace();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, level] = args;
        if (!id) throw new Error('Usage: start <id> [level]');
        if (level) api.setLevel(id, level);
        out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const level = loadProfile(id).level || 'introductory';
        if (skill) { out(api.generateExercise(level, skill, 5)); }
        else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient at current level!' }); }
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
        const [, id, level, cat, skill, sc, tot, ...notes] = args;
        if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total> [notes]');
        out(api.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? api.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(api.setLevel(id, l)); break; }
      default: out({ usage: 'node earth-space.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
