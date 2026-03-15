// eClaw HS Geography Interactive Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-socialstudies-geography');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'spatial-thinking': {
    'map-reading': { name: 'Map Reading & Interpretation', unit: 'spatial-thinking' },
    'scale-distance': { name: 'Scale & Distance Calculation', unit: 'spatial-thinking' },
    'coordinate-systems': { name: 'Coordinate Systems & Grid References', unit: 'spatial-thinking' },
    'spatial-patterns': { name: 'Spatial Pattern Recognition', unit: 'spatial-thinking' },
  },
  'physical-geography': {
    'plate-tectonics': { name: 'Plate Tectonics & Landforms', unit: 'physical-geography' },
    'weathering-erosion': { name: 'Weathering & Erosion', unit: 'physical-geography' },
    'climate-systems': { name: 'Climate Systems & Patterns', unit: 'physical-geography' },
    'water-cycle': { name: 'Water Cycle & Hydrology', unit: 'physical-geography' },
    'biomes-ecosystems': { name: 'Biomes & Ecosystems', unit: 'physical-geography' },
  },
  'human-geography': {
    'population-dynamics': { name: 'Population Dynamics & Demographics', unit: 'human-geography' },
    'migration-patterns': { name: 'Migration Patterns & Push-Pull Factors', unit: 'human-geography' },
    'urbanization': { name: 'Urbanization & Urban Planning', unit: 'human-geography' },
    'settlement-patterns': { name: 'Settlement Patterns & Site Selection', unit: 'human-geography' },
  },
  'cultural-geography': {
    'cultural-diffusion': { name: 'Cultural Diffusion & Globalization', unit: 'cultural-geography' },
    'language-religion': { name: 'Language & Religion Distributions', unit: 'cultural-geography' },
    'ethnic-diversity': { name: 'Ethnic Diversity & Cultural Landscapes', unit: 'cultural-geography' },
    'cultural-regions': { name: 'Cultural Regions & Boundaries', unit: 'cultural-geography' },
    'folk-popular-culture': { name: 'Folk vs. Popular Culture', unit: 'cultural-geography' },
  },
  'political-geography': {
    'state-boundaries': { name: 'States, Nations & Boundaries', unit: 'political-geography' },
    'sovereignty-territory': { name: 'Sovereignty & Territorial Disputes', unit: 'political-geography' },
    'supranational-orgs': { name: 'Supranational Organizations', unit: 'political-geography' },
    'gerrymandering-redistricting': { name: 'Gerrymandering & Redistricting', unit: 'political-geography' },
  },
  'economic-geography': {
    'economic-sectors': { name: 'Economic Sectors & Development', unit: 'economic-geography' },
    'global-trade': { name: 'Global Trade Networks', unit: 'economic-geography' },
    'development-indicators': { name: 'Development Indicators (HDI, GDP)', unit: 'economic-geography' },
    'resource-distribution': { name: 'Natural Resource Distribution', unit: 'economic-geography' },
    'agriculture-land-use': { name: 'Agriculture & Land Use Models', unit: 'economic-geography' },
  },
  'environmental-geography': {
    'climate-change-impacts': { name: 'Climate Change Geographic Impacts', unit: 'environmental-geography' },
    'deforestation': { name: 'Deforestation & Desertification', unit: 'environmental-geography' },
    'water-management': { name: 'Water Resource Management', unit: 'environmental-geography' },
    'sustainability': { name: 'Sustainability & Conservation', unit: 'environmental-geography' },
  },
  'geospatial-technology': {
    'gis-fundamentals': { name: 'GIS Fundamentals', unit: 'geospatial-technology' },
    'remote-sensing': { name: 'Remote Sensing & Satellite Imagery', unit: 'geospatial-technology' },
    'gps-navigation': { name: 'GPS & Navigation Systems', unit: 'geospatial-technology' },
    'data-visualization-maps': { name: 'Geospatial Data Visualization', unit: 'geospatial-technology' },
  },
};

const UNITS = Object.keys(SKILLS);

const QUESTION_BANKS = {
  'map-reading': [
    { type: 'mc', q: 'A topographic map uses contour lines to show:', choices: ['Population density', 'Elevation and terrain features', 'Political boundaries', 'Climate zones'], answer: 'B', explanation: 'Contour lines connect points of equal elevation, revealing terrain features like hills, valleys, ridges, and slopes. Closely spaced lines indicate steep terrain.' },
    { type: 'mc', q: 'A choropleth map is best used to display:', choices: ['Exact locations of events', 'Data values across geographic areas using color shading', 'Road networks', 'Weather patterns in real time'], answer: 'B', explanation: 'Choropleth maps use color shading to represent data values (population density, income levels) across defined areas like states or counties.' },
    { type: 'sa', q: 'What is the difference between a political map and a physical map?', answer: 'boundaries', explanation: 'Political maps show human-made boundaries (countries, states, cities) while physical maps show natural features (mountains, rivers, deserts, elevation). Thematic maps combine elements for specific topics.' },
    { type: 'mc', q: 'A map legend (key) is essential because it:', choices: ['Makes the map look professional', 'Explains what the symbols, colors, and patterns on the map represent', 'Shows the date the map was made', 'Lists the cartographer\'s name'], answer: 'B', explanation: 'The legend translates map symbols into meaningful information. Without it, readers cannot interpret what different colors, symbols, line types, or patterns represent.' },
    { type: 'mc', q: 'Map projections are necessary because:', choices: ['All maps are inaccurate', 'Transferring a 3D sphere to a 2D surface inevitably distorts shape, area, distance, or direction', 'Maps need to look attractive', 'Only globes are useful'], answer: 'B', explanation: 'No flat map can perfectly represent Earth\'s curved surface. All projections distort at least one property — Mercator preserves shape but distorts area; equal-area projections distort shape.' },
    { type: 'mc', q: 'An isoline map connects points of:', choices: ['Different values', 'Equal value for a specific variable (temperature, pressure, elevation)', 'Political importance', 'Historical significance'], answer: 'B', explanation: 'Isolines connect points of equal value: isotherms (temperature), isobars (pressure), contour lines (elevation). They reveal spatial patterns and gradients.' },
  ],
  'scale-distance': [
    { type: 'mc', q: 'A map scale of 1:50,000 means:', choices: ['The map is 50,000 times larger than reality', 'One unit on the map represents 50,000 of the same units on the ground', 'The map covers 50,000 square miles', 'There are 50,000 features on the map'], answer: 'B', explanation: 'A representative fraction of 1:50,000 means 1 cm on the map = 50,000 cm (500 m) on the ground. Larger denominators = smaller scale = larger area shown.' },
    { type: 'mc', q: 'A large-scale map shows:', choices: ['A large area with little detail', 'A small area with great detail', 'Only continents', 'Only oceans'], answer: 'B', explanation: 'Large-scale maps (e.g., 1:10,000) show small areas in great detail — city streets, individual buildings. Small-scale maps (e.g., 1:1,000,000) show large areas with less detail.' },
    { type: 'sa', q: 'If a map has a scale of 1:100,000, how far apart are two cities that are 5 cm apart on the map?', answer: '5 km', explanation: '5 cm x 100,000 = 500,000 cm = 5,000 m = 5 km. Representative fractions allow direct calculation of real-world distances from map measurements.' },
    { type: 'mc', q: 'A bar scale on a map is preferred over a verbal scale because:', choices: ['It looks better', 'It remains accurate when the map is enlarged or reduced', 'It is easier to draw', 'It takes up less space'], answer: 'B', explanation: 'Bar scales resize proportionally with the map, staying accurate when photocopied or digitally resized. Verbal scales ("1 inch = 1 mile") become inaccurate if the map size changes.' },
    { type: 'mc', q: 'Distortion in map projections is greatest:', choices: ['At the center of the projection', 'Near the edges, far from the projection\'s standard parallels or central meridian', 'At the equator only', 'At sea level'], answer: 'B', explanation: 'Distortion increases with distance from the projection\'s standard lines (parallels or meridians where the projection surface touches the globe), making edges less accurate.' },
    { type: 'mc', q: 'When measuring distance on a curved road using a map, you should:', choices: ['Measure the straight-line distance', 'Use a string or map wheel to follow the curve, then compare to the scale', 'Estimate by looking', 'Ignore the curves'], answer: 'B', explanation: 'Curved distances require tracing the actual path with a string, divider, or map wheel, then measuring that length against the bar scale for accurate distance.' },
  ],
  'coordinate-systems': [
    { type: 'mc', q: 'Lines of latitude run:', choices: ['North to south', 'East to west, parallel to the equator', 'Diagonally', 'In circles around the poles'], answer: 'B', explanation: 'Latitude lines (parallels) run east-west, parallel to the equator, measuring distance north or south of the equator from 0° to 90°.' },
    { type: 'mc', q: 'The Prime Meridian is located at:', choices: ['0° latitude', '0° longitude, passing through Greenwich, England', '180° longitude', '90° latitude'], answer: 'B', explanation: 'The Prime Meridian (0° longitude) passes through Greenwich, England, dividing Earth into Eastern and Western hemispheres and serving as the reference for longitude measurement.' },
    { type: 'sa', q: 'What are the coordinates of the location at 40°N latitude, 74°W longitude, and what city is near there?', answer: 'New York', explanation: '40°N, 74°W is approximately the location of New York City. Coordinates pinpoint exact locations using the intersection of latitude (N/S) and longitude (E/W).' },
    { type: 'mc', q: 'Time zones are based on:', choices: ['Country boundaries', 'Longitude — Earth rotates 360° in 24 hours, creating 15° per hour time zones', 'Latitude', 'Population density'], answer: 'B', explanation: 'Earth rotates 15° per hour (360°/24h), creating 24 time zones roughly following longitude lines, though political boundaries cause deviations from the ideal.' },
    { type: 'mc', q: 'The International Date Line is located approximately at:', choices: ['0° longitude', '180° longitude in the Pacific Ocean', '90° longitude', 'The equator'], answer: 'B', explanation: 'The International Date Line roughly follows 180° longitude in the Pacific Ocean. Crossing it westward advances the date by one day; crossing eastward sets it back one day.' },
    { type: 'mc', q: 'GPS technology determines location using:', choices: ['Magnetic compass readings', 'Signals from multiple satellites to triangulate position', 'Star positions', 'Radio towers only'], answer: 'B', explanation: 'GPS receivers calculate position by measuring signal travel time from at least four satellites, using trilateration to determine latitude, longitude, and altitude with high precision.' },
  ],
  'spatial-patterns': [
    { type: 'mc', q: 'Spatial distribution refers to:', choices: ['How maps are distributed to users', 'How phenomena are spread across geographic space (clustered, dispersed, or random)', 'The number of maps available', 'Only population patterns'], answer: 'B', explanation: 'Spatial distribution describes how features are arranged in space: clustered (grouped together), dispersed (spread evenly), or random (no pattern), revealing underlying processes.' },
    { type: 'sa', q: 'What is Tobler\'s First Law of Geography?', answer: 'near', explanation: 'Tobler\'s First Law: "Everything is related to everything else, but near things are more related than distant things." This principle of spatial autocorrelation underpins much geographic analysis.' },
    { type: 'mc', q: 'A density map showing population per square mile reveals:', choices: ['Where people live exactly', 'The concentration of population across geographic areas', 'How many people are moving', 'Only urban areas'], answer: 'B', explanation: 'Population density maps show how concentrated people are in different areas, revealing patterns of urbanization, empty spaces, and how physical geography influences settlement.' },
    { type: 'mc', q: 'The gravity model in geography predicts that:', choices: ['Objects fall to Earth', 'Interaction between places increases with population and decreases with distance', 'All places are equally connected', 'Only neighboring places interact'], answer: 'B', explanation: 'The gravity model predicts that interaction (trade, migration, communication) between two places is proportional to their populations and inversely proportional to the distance between them.' },
    { type: 'mc', q: 'Site and situation in geography refer to:', choices: ['Only the climate', 'Site: physical characteristics of a place; Situation: location relative to other places', 'Two types of maps', 'Urban planning zones'], answer: 'B', explanation: 'Site describes a place\'s internal physical characteristics (terrain, water, climate). Situation describes its external relationships — location relative to other places, trade routes, and resources.' },
    { type: 'mc', q: 'Diffusion in geography describes:', choices: ['Chemical processes', 'How ideas, innovations, or diseases spread across space over time', 'Water evaporation', 'Only technology transfer'], answer: 'B', explanation: 'Spatial diffusion describes how phenomena spread: expansion (outward from origin), relocation (moving to new areas), hierarchical (through cities by size), contagious (through direct contact).' },
  ],
  'plate-tectonics': [
    { type: 'mc', q: 'Convergent plate boundaries produce:', choices: ['Mid-ocean ridges', 'Subduction zones, mountain ranges, and deep ocean trenches', 'Transform faults', 'Hot spots'], answer: 'B', explanation: 'Convergent boundaries where plates collide create subduction zones (oceanic-continental), mountain ranges (continental-continental, e.g., Himalayas), and deep trenches (oceanic-oceanic).' },
    { type: 'mc', q: 'The Ring of Fire refers to:', choices: ['A volcanic island', 'The zone of frequent earthquakes and volcanic eruptions circling the Pacific Ocean', 'Forest fires in California', 'Underground coal fires'], answer: 'B', explanation: 'The Ring of Fire encircles the Pacific Ocean with about 75% of the world\'s active volcanoes and 90% of earthquakes, following tectonic plate boundaries.' },
    { type: 'sa', q: 'How do divergent plate boundaries create new oceanic crust?', answer: 'magma', explanation: 'At divergent boundaries, plates move apart, allowing magma to rise from the mantle to fill the gap, solidifying into new oceanic crust. This process at mid-ocean ridges (like the Mid-Atlantic Ridge) is called seafloor spreading.' },
    { type: 'mc', q: 'The Himalayas formed through:', choices: ['Divergent plate movement', 'The collision of the Indian and Eurasian plates (continental-continental convergence)', 'Volcanic activity', 'Erosion'], answer: 'B', explanation: 'The Himalayas formed and continue to rise from the ongoing collision of the Indian plate with the Eurasian plate, pushing up sedimentary rock to create the world\'s highest mountains.' },
    { type: 'mc', q: 'Transform boundaries are characterized by:', choices: ['Mountain building', 'Plates sliding horizontally past each other, causing earthquakes (e.g., San Andreas Fault)', 'Volcanic eruptions', 'Subduction'], answer: 'B', explanation: 'Transform boundaries involve plates sliding past each other horizontally. The San Andreas Fault in California is a well-known example, producing significant earthquake activity.' },
    { type: 'mc', q: 'Pangaea was:', choices: ['An ancient ocean', 'A supercontinent that existed roughly 300 million years ago before breaking apart into today\'s continents', 'A type of rock', 'An early civilization'], answer: 'B', explanation: 'Pangaea was a supercontinent that began breaking apart about 200 million years ago due to tectonic forces, eventually forming the continents we recognize today through continental drift.' },
    { type: 'mc', q: 'Earthquakes are measured using:', choices: ['The Beaufort scale', 'The Richter scale or moment magnitude scale, which measure energy released', 'The Fahrenheit scale', 'The pH scale'], answer: 'B', explanation: 'The moment magnitude scale (replacing the Richter scale) measures earthquake energy release. Each whole number increase represents roughly 32 times more energy released.' },
  ],
  'weathering-erosion': [
    { type: 'mc', q: 'Chemical weathering is most rapid in:', choices: ['Cold, dry climates', 'Warm, humid climates where water and heat accelerate chemical reactions', 'Deserts', 'Polar regions'], answer: 'B', explanation: 'Chemical weathering accelerates with warmth and moisture, which speed up reactions like dissolution of limestone, oxidation of iron minerals, and hydrolysis of feldspar.' },
    { type: 'sa', q: 'How does freeze-thaw weathering break down rocks?', answer: 'expansion', explanation: 'Water enters rock cracks and expands 9% when it freezes, exerting enormous pressure that widens cracks. Repeated freeze-thaw cycles progressively break rocks apart — a form of mechanical weathering common in mountain environments.' },
    { type: 'mc', q: 'A river delta forms when:', choices: ['A river flows faster', 'A river deposits sediment as it enters a slower-moving body of water like a sea or lake', 'Tectonic plates shift', 'Wind erodes a coastline'], answer: 'B', explanation: 'Deltas form at river mouths where flow velocity decreases upon entering a larger body of water, causing sediment to deposit in a fan-shaped landform (e.g., Mississippi, Nile deltas).' },
    { type: 'mc', q: 'Glacial erosion creates distinctive landforms including:', choices: ['Sand dunes', 'U-shaped valleys, cirques, moraines, and fjords', 'Mesas and buttes', 'Coral reefs'], answer: 'B', explanation: 'Glaciers carve U-shaped valleys (unlike V-shaped river valleys), scoop out cirques, deposit moraines (till), and create fjords when carved valleys are flooded by rising sea levels.' },
    { type: 'mc', q: 'Soil erosion is accelerated by:', choices: ['Dense vegetation', 'Deforestation, overgrazing, and poor agricultural practices that remove protective ground cover', 'Heavy snowfall', 'Wetland preservation'], answer: 'B', explanation: 'Removing vegetation exposes soil to wind and water erosion. Deforestation, overgrazing, and intensive farming without conservation practices accelerate topsoil loss, degrading agricultural productivity.' },
    { type: 'mc', q: 'Wind erosion is most significant in:', choices: ['Dense forests', 'Arid and semi-arid regions with loose, dry soil and little vegetation', 'Wetlands', 'Tropical rainforests'], answer: 'B', explanation: 'Wind erosion dominates in dry regions where loose soil, sparse vegetation, and lack of moisture allow wind to transport particles (deflation, abrasion), forming dunes and loess deposits.' },
  ],
  'climate-systems': [
    { type: 'mc', q: 'The primary factor determining climate zones is:', choices: ['Altitude only', 'Latitude — distance from the equator determines solar energy received', 'Longitude', 'Ocean depth'], answer: 'B', explanation: 'Latitude is the primary climate determinant: tropical zones near the equator receive direct sunlight year-round, while polar regions receive oblique rays. Altitude, ocean currents, and continental position modify this pattern.' },
    { type: 'mc', q: 'The Coriolis effect causes:', choices: ['Earth to rotate', 'Moving objects (including wind and ocean currents) to deflect right in the Northern Hemisphere and left in the Southern', 'Earthquakes', 'Seasons to change'], answer: 'B', explanation: 'Earth\'s rotation causes moving objects to appear to deflect — right in the Northern Hemisphere, left in the Southern — influencing wind patterns, ocean currents, and weather systems.' },
    { type: 'sa', q: 'How do ocean currents influence coastal climates?', answer: 'moderate', explanation: 'Warm currents (Gulf Stream) moderate cold climates and bring moisture (why Western Europe is milder than similar latitudes in Canada). Cold currents (California Current) cool warm coasts and can create fog and aridity.' },
    { type: 'mc', q: 'The rain shadow effect occurs when:', choices: ['Clouds block the sun', 'Mountains force moist air upward, causing precipitation on the windward side and dry conditions on the leeward side', 'Rivers flood', 'Oceans evaporate'], answer: 'B', explanation: 'Moist air rises over mountains (orographic lifting), cools, and releases precipitation on the windward side. Descending air on the leeward side is dry, creating rain shadows (e.g., eastern side of Cascades/Sierra Nevada).' },
    { type: 'mc', q: 'El Nino refers to:', choices: ['A permanent climate pattern', 'Periodic warming of Pacific Ocean surface waters that disrupts global weather patterns', 'A type of hurricane', 'Arctic ice melting'], answer: 'B', explanation: 'El Nino (warm phase of ENSO) involves periodic warming of equatorial Pacific waters, disrupting normal atmospheric circulation and causing floods, droughts, and temperature anomalies worldwide.' },
    { type: 'mc', q: 'The Koppen climate classification system categorizes climates based on:', choices: ['Only temperature', 'Temperature and precipitation patterns and their relationship to vegetation', 'Only rainfall', 'Population density'], answer: 'B', explanation: 'Koppen uses temperature and precipitation criteria to define climate zones (Tropical, Arid, Temperate, Continental, Polar) with subcategories reflecting seasonal patterns and their relationship to native vegetation.' },
    { type: 'mc', q: 'Monsoons are caused by:', choices: ['Ocean tides', 'Seasonal reversal of wind direction due to differential heating of land and ocean', 'Volcanic eruptions', 'Tectonic activity'], answer: 'B', explanation: 'Monsoons result from seasonal differences in land and ocean heating: summer monsoons bring moist ocean air over land (heavy rains); winter monsoons reverse, bringing dry air from the continent.' },
  ],
  'water-cycle': [
    { type: 'mc', q: 'The largest reservoir of fresh water on Earth is:', choices: ['Lakes', 'Ice caps and glaciers', 'Rivers', 'Groundwater'], answer: 'B', explanation: 'About 69% of fresh water is locked in ice caps and glaciers. Groundwater holds about 30%, while surface water (lakes, rivers) holds less than 1% of total fresh water.' },
    { type: 'sa', q: 'What is a watershed and why is it important for water management?', answer: 'drainage', explanation: 'A watershed (drainage basin) is the area of land where all precipitation drains into a common body of water. Understanding watersheds is essential for water management because pollution, development, and land use anywhere in the watershed affects downstream water quality.' },
    { type: 'mc', q: 'Aquifers are:', choices: ['Surface water features', 'Underground layers of permeable rock or sediment that store and transmit groundwater', 'Man-made reservoirs', 'Rain collection systems'], answer: 'B', explanation: 'Aquifers are geological formations that store and transmit groundwater. The Ogallala Aquifer underlies much of the Great Plains and is being depleted faster than it recharges.' },
    { type: 'mc', q: 'Transpiration in the water cycle refers to:', choices: ['Water evaporating from oceans', 'Water released into the atmosphere by plants through their leaves', 'Rainfall', 'Water flowing in rivers'], answer: 'B', explanation: 'Transpiration is the release of water vapor by plants through stomata in their leaves. It is a major component of the water cycle, with forests transpiring enormous quantities of water.' },
    { type: 'mc', q: 'A floodplain is important because:', choices: ['It is always dry', 'It naturally stores floodwater, supports biodiversity, and provides fertile agricultural land', 'It prevents all flooding', 'It is only found in deserts'], answer: 'B', explanation: 'Floodplains are flat areas adjacent to rivers that periodically flood, depositing nutrient-rich sediment that creates fertile farmland. They also provide natural flood storage and critical wildlife habitat.' },
    { type: 'mc', q: 'Groundwater depletion is a concern because:', choices: ['Groundwater is unlimited', 'Many aquifers are being pumped faster than they recharge, threatening future water supply', 'It only affects deserts', 'Technology can replace groundwater'], answer: 'B', explanation: 'Overextraction of groundwater for agriculture, industry, and cities depletes aquifers that took thousands of years to fill, causing land subsidence, reduced stream flow, and future water scarcity.' },
  ],
  'biomes-ecosystems': [
    { type: 'mc', q: 'The biome with the greatest biodiversity is:', choices: ['Tundra', 'Tropical rainforest', 'Temperate forest', 'Desert'], answer: 'B', explanation: 'Tropical rainforests contain roughly 50% of all species despite covering only about 6% of Earth\'s surface, due to high temperatures, abundant rainfall, and year-round growing conditions.' },
    { type: 'sa', q: 'How do latitude and altitude create similar biome patterns?', answer: 'temperature', explanation: 'Both increasing latitude (moving toward poles) and increasing altitude (moving up mountains) cause temperature to decrease, creating similar biome transitions: tropical/deciduous at base, coniferous forest, then tundra at high elevations or latitudes.' },
    { type: 'mc', q: 'Deserts are defined by:', choices: ['Hot temperatures only', 'Receiving less than 25 cm (10 in) of precipitation annually', 'Having only sand', 'Being located only in Africa'], answer: 'B', explanation: 'Deserts are defined by aridity (< 25 cm annual precipitation), not temperature. Both hot deserts (Sahara) and cold deserts (Antarctica, Gobi) exist across various latitudes.' },
    { type: 'mc', q: 'The tundra biome is characterized by:', choices: ['Dense forests', 'Permafrost, low temperatures, and minimal vegetation like mosses, lichens, and low shrubs', 'Heavy rainfall', 'High biodiversity'], answer: 'B', explanation: 'Arctic tundra features permafrost (permanently frozen ground), extremely cold temperatures, a short growing season, and vegetation limited to mosses, lichens, grasses, and low shrubs.' },
    { type: 'mc', q: 'Coral reefs are threatened by:', choices: ['Cold water', 'Ocean warming, acidification, pollution, and destructive fishing practices', 'Too much biodiversity', 'Deep water'], answer: 'B', explanation: 'Coral reefs face bleaching from warming waters, weakened structures from ocean acidification (CO2 absorption), sedimentation from coastal development, and physical destruction from harmful fishing practices.' },
    { type: 'mc', q: 'Savannas are characterized by:', choices: ['Dense canopy', 'Grasslands with scattered trees, distinct wet and dry seasons, and frequent fires', 'Frozen ground', 'No vegetation'], answer: 'B', explanation: 'Savannas feature grasslands with scattered trees, pronounced wet and dry seasons, and fire-adapted ecosystems. They are found in tropical and subtropical regions (African savanna, Brazilian cerrado).' },
  ],
  'population-dynamics': [
    { type: 'mc', q: 'The demographic transition model describes:', choices: ['Animal migration', 'How societies move from high birth/death rates to low birth/death rates as they industrialize', 'Political change', 'Climate change stages'], answer: 'B', explanation: 'The DTM traces population change through stages: Stage 1 (high birth/death rates), Stage 2 (death rate drops), Stage 3 (birth rate drops), Stage 4 (low birth/death rates), and potentially Stage 5 (population decline).' },
    { type: 'mc', q: 'A population pyramid with a wide base indicates:', choices: ['An aging population', 'A young, rapidly growing population with high birth rates', 'Population decline', 'Equal distribution across ages'], answer: 'B', explanation: 'A wide-base pyramid (many young people) indicates high birth rates and rapid growth, typical of developing countries. Columnar shapes indicate stable populations; inverted shapes suggest decline.' },
    { type: 'sa', q: 'What is the difference between population density and population distribution?', answer: 'where', explanation: 'Population density is the number of people per unit area (people per square km). Distribution describes WHERE people are located — clustered, dispersed, or linear. A country can have low average density but highly clustered distribution.' },
    { type: 'mc', q: 'Total fertility rate (TFR) is significant because:', choices: ['It measures mortality', 'A TFR of 2.1 is replacement level — below it, population eventually declines without immigration', 'It only applies to developed nations', 'It measures migration'], answer: 'B', explanation: 'TFR (average births per woman) determines long-term population trends. 2.1 is replacement level (accounting for mortality). Many developed countries are below replacement, while some developing nations exceed 5.' },
    { type: 'mc', q: 'China\'s one-child policy (1979-2015) resulted in:', choices: ['Only positive outcomes', 'Reduced population growth but also gender imbalance, aging population, and human rights concerns', 'Population increase', 'No demographic impact'], answer: 'B', explanation: 'The one-child policy reduced growth but created a severe gender imbalance (son preference), a rapidly aging population, workforce shrinkage, and was enforced through coercive measures including forced abortions.' },
    { type: 'mc', q: 'The epidemiological transition describes:', choices: ['Plant disease', 'The shift from infectious diseases to chronic/degenerative diseases as primary causes of death with development', 'Animal migration', 'Climate change'], answer: 'B', explanation: 'As countries develop, the leading causes of death shift from infectious diseases (cholera, malaria) to chronic conditions (heart disease, cancer) due to improved sanitation, nutrition, and healthcare.' },
  ],
  'migration-patterns': [
    { type: 'mc', q: 'Push factors in migration include:', choices: ['Job opportunities abroad', 'War, persecution, natural disasters, and economic hardship in the home country', 'Better healthcare abroad', 'Cultural attractions'], answer: 'B', explanation: 'Push factors drive people away from their origin: conflict, persecution, poverty, natural disasters, and environmental degradation. Pull factors attract people to destinations: jobs, safety, education, freedom.' },
    { type: 'sa', q: 'How has Ravenstein\'s Laws of Migration held up in the modern world?', answer: 'short distance', explanation: 'Ravenstein\'s laws (most migration is short-distance, in steps, rural-to-urban, with counter-flows) largely hold but modern transportation and communication have increased long-distance and international migration beyond his 1880s observations.' },
    { type: 'mc', q: 'Chain migration refers to:', choices: ['Forced migration', 'Migrants following established connections — family and community networks — to destinations', 'Random movement patterns', 'Government-organized migration'], answer: 'B', explanation: 'Chain migration occurs when migrants follow family or community members to established destinations, creating migration networks that reduce costs and risks for subsequent migrants.' },
    { type: 'mc', q: 'Internally displaced persons (IDPs) differ from refugees because:', choices: ['They are not fleeing danger', 'IDPs remain within their country\'s borders while refugees cross international boundaries', 'They are always voluntary migrants', 'There are fewer IDPs globally'], answer: 'B', explanation: 'IDPs are forced from their homes but remain in their country, while refugees cross international borders. IDPs often receive less international protection and assistance than refugees.' },
    { type: 'mc', q: 'Brain drain affects developing countries by:', choices: ['Improving their economies', 'Losing educated professionals (doctors, engineers, teachers) to wealthier countries', 'Having no impact', 'Only affecting small countries'], answer: 'B', explanation: 'Brain drain depletes developing countries of skilled professionals, undermining development capacity. Remittances partially compensate, and some migrants eventually return with enhanced skills (brain circulation).' },
    { type: 'mc', q: 'Step migration involves:', choices: ['Moving directly to a final destination', 'Migrating in stages, often from rural to small city to large city', 'Seasonal movement only', 'Government-planned relocation'], answer: 'B', explanation: 'Step migration involves progressive moves — typically from rural areas to nearby towns, then to larger cities — with each step providing economic advancement and acculturation before the next move.' },
  ],
  'urbanization': [
    { type: 'mc', q: 'Over 50% of the world\'s population now lives in:', choices: ['Rural areas', 'Urban areas, a threshold crossed around 2007', 'Suburbs', 'Coastal areas only'], answer: 'B', explanation: 'The world crossed the 50% urbanization threshold around 2007. By 2050, approximately 68% of the global population is projected to be urban, with the fastest growth in Africa and Asia.' },
    { type: 'sa', q: 'What are the main challenges facing megacities in developing countries?', answer: 'infrastructure', explanation: 'Megacities (10+ million) face challenges including inadequate infrastructure, housing shortages (slums/informal settlements), traffic congestion, pollution, water/sanitation access, inequality, and governance capacity that cannot keep pace with growth.' },
    { type: 'mc', q: 'Suburbanization in the US was driven by:', choices: ['Declining car ownership', 'Automobiles, highway construction, white flight, affordable housing, and federal mortgage policies', 'Lack of urban land', 'Agricultural expansion'], answer: 'B', explanation: 'Post-WWII suburbanization was driven by automobile access, federal highway construction, FHA/VA mortgage programs, white flight from urban cores, and the desire for larger homes and yards.' },
    { type: 'mc', q: 'Gentrification involves:', choices: ['Urban decay', 'Wealthier residents moving into lower-income neighborhoods, raising property values and often displacing original residents', 'Suburban expansion', 'Industrial development'], answer: 'B', explanation: 'Gentrification transforms neighborhoods through investment and higher-income residents, improving infrastructure but often displacing long-term residents through rising rents and property taxes.' },
    { type: 'mc', q: 'Urban sprawl is problematic because it:', choices: ['Creates density', 'Increases car dependency, consumes farmland, fragments habitats, and increases infrastructure costs', 'Reduces traffic', 'Preserves natural areas'], answer: 'B', explanation: 'Low-density sprawl requires more roads, utilities, and services per capita, increases commute times and vehicle emissions, converts agricultural and natural land, and fragments wildlife habitat.' },
    { type: 'mc', q: 'Smart growth principles advocate for:', choices: ['Unlimited suburban expansion', 'Compact, mixed-use, transit-oriented development that preserves open space', 'Only high-rise buildings', 'Eliminating all zoning'], answer: 'B', explanation: 'Smart growth promotes walkable, mixed-use neighborhoods, transit access, infill development, open space preservation, and diverse housing options to reduce sprawl and create livable communities.' },
  ],
  'settlement-patterns': [
    { type: 'mc', q: 'Central place theory (Christaller) predicts that:', choices: ['All cities are the same size', 'Settlements are arranged in a hierarchical pattern with larger places serving wider areas', 'Cities are random', 'Only coastal cities thrive'], answer: 'B', explanation: 'Christaller\'s theory predicts a hierarchy of settlements: many small places providing basic services, fewer medium cities with more services, and few large cities with specialized functions, arranged in hexagonal market areas.' },
    { type: 'sa', q: 'What factors influence where cities develop?', answer: 'location', explanation: 'Cities develop based on site factors (water access, flat land, natural harbors, defensive position) and situation factors (trade routes, resource proximity, transportation networks, access to markets). Historical cities often originated at river confluences, harbors, or crossroads.' },
    { type: 'mc', q: 'The rank-size rule states that:', choices: ['All cities are equally sized', 'The nth largest city will be 1/n the size of the largest city in a country', 'Only capital cities matter', 'Rural areas have no pattern'], answer: 'B', explanation: 'The rank-size rule predicts that in a developed urban system, the 2nd city will be 1/2 the size of the largest, 3rd city 1/3, etc. Deviations (primate cities) suggest different development patterns.' },
    { type: 'mc', q: 'A primate city is:', choices: ['Any capital city', 'A city disproportionately larger than the second-largest city, dominating the country\'s economy and culture', 'The oldest city', 'A planned city'], answer: 'B', explanation: 'Primate cities (Paris, Bangkok, Buenos Aires) are disproportionately large compared to other cities in their country, concentrating economic, political, and cultural functions — deviating from the rank-size rule.' },
    { type: 'mc', q: 'Nucleated settlement patterns typically form when:', choices: ['Land is abundant', 'Resources, services, or defensive needs concentrate people in a central location', 'People prefer isolation', 'Government mandates them'], answer: 'B', explanation: 'Nucleated (clustered) settlements form around resources (water, crossroads), defensive sites, or shared facilities. Dispersed patterns develop in areas with abundant farmland or resources spread over wide areas.' },
    { type: 'mc', q: 'Edge cities develop:', choices: ['In historic downtown areas', 'On the outskirts of major cities, often near highway intersections, as suburban employment centers', 'Only in developing nations', 'Along coastlines only'], answer: 'B', explanation: 'Edge cities (Joel Garreau) are substantial employment and commercial centers that develop in suburban areas, often at highway intersections, competing with traditional downtown cores.' },
  ],
  'cultural-diffusion': [
    { type: 'mc', q: 'Hierarchical diffusion means:', choices: ['Ideas spread randomly', 'Ideas spread from larger to smaller places or from authorities to the general population', 'Ideas move in straight lines', 'Only physical objects diffuse'], answer: 'B', explanation: 'Hierarchical diffusion spreads ideas through a hierarchy — from major cities to smaller ones, or from leaders/trendsetters to followers. Fashion trends, new technologies, and diseases often diffuse hierarchically.' },
    { type: 'sa', q: 'How does globalization both spread and threaten cultural diversity?', answer: 'homogenize', explanation: 'Globalization spreads ideas, products, and practices worldwide (cultural diffusion), but it can homogenize cultures by replacing local traditions with dominant (often Western) cultural products, languages, and values — a process some call cultural imperialism.' },
    { type: 'mc', q: 'Stimulus diffusion occurs when:', choices: ['An idea spreads unchanged', 'The underlying concept of an innovation is adopted but modified by the receiving culture', 'Diffusion stops at borders', 'Ideas only spread through the internet'], answer: 'B', explanation: 'Stimulus diffusion: the idea behind an innovation is adopted but adapted to local context. McDonald\'s global menus (McAloo Tikki in India, Teriyaki Burger in Japan) exemplify stimulus diffusion.' },
    { type: 'mc', q: 'Cultural hearths are:', choices: ['Types of buildings', 'Geographic areas where major cultural innovations originated and spread outward', 'Only in Europe', 'Modern phenomena'], answer: 'B', explanation: 'Cultural hearths are origins of cultural innovation: Mesopotamia, Nile Valley, Indus Valley, Yellow River, Mesoamerica — where agriculture, writing, religion, and urban civilization originated and diffused outward.' },
    { type: 'mc', q: 'Acculturation refers to:', choices: ['Rejecting all cultural change', 'The process of adopting traits from another culture while maintaining one\'s own cultural identity', 'Complete loss of original culture', 'Cultural isolation'], answer: 'B', explanation: 'Acculturation involves adopting elements of another culture (language, food, customs) while retaining one\'s original cultural identity. Assimilation involves more complete absorption into the dominant culture.' },
    { type: 'mc', q: 'Time-space compression refers to:', choices: ['Physical shrinking of Earth', 'Technology reducing the effective distance between places through faster transportation and communication', 'Only applies to airplanes', 'Slowing down of time'], answer: 'B', explanation: 'Time-space compression (David Harvey) describes how transportation and communication technology reduces the friction of distance, making places more interconnected and accelerating cultural and economic exchange.' },
  ],
  'language-religion': [
    { type: 'mc', q: 'The most widely spoken language family is:', choices: ['Sino-Tibetan', 'Indo-European, including English, Spanish, Hindi, and most European languages', 'Afro-Asiatic', 'Niger-Congo'], answer: 'B', explanation: 'Indo-European languages are spoken by nearly half the world\'s population, spread through migration, colonization, and trade from an origin likely in the Pontic steppe or Anatolia.' },
    { type: 'sa', q: 'How do language and religion create cultural boundaries?', answer: 'identity', explanation: 'Languages and religions define group identity, creating cultural boundaries that may or may not align with political borders. Linguistic/religious differences can cause conflict (Yugoslavia, Belgium, India-Pakistan) or enrich multicultural societies.' },
    { type: 'mc', q: 'A lingua franca is:', choices: ['A dead language', 'A common language used for communication between groups who speak different native languages', 'Only spoken in France', 'A computer language'], answer: 'B', explanation: 'Lingua francas (English globally, Swahili in East Africa, Mandarin in China) enable communication across linguistic boundaries for trade, diplomacy, and daily interaction.' },
    { type: 'mc', q: 'Universalizing religions differ from ethnic religions in that:', choices: ['They are older', 'They actively seek converts and claim universal applicability, not tied to one ethnic group', 'They have fewer followers', 'They are only in Asia'], answer: 'B', explanation: 'Universalizing religions (Christianity, Islam, Buddhism) actively seek converts worldwide. Ethnic religions (Hinduism, Judaism, Shinto) are tied to particular peoples/places and generally don\'t proselytize.' },
    { type: 'mc', q: 'Language extinction matters because:', choices: ['It has no real impact', 'Each language carries unique cultural knowledge, worldviews, and ecological understanding that is lost forever', 'It only affects linguists', 'New languages always replace old ones'], answer: 'B', explanation: 'Languages encode unique cultural knowledge, oral histories, ecological understanding, and ways of thinking. With roughly one language dying every two weeks, enormous cultural heritage is being lost.' },
    { type: 'mc', q: 'The spread of Islam across North Africa and the Middle East primarily occurred through:', choices: ['Only military conquest', 'A combination of trade, conquest, missionary activity, and political administration', 'Only trade', 'Only missionaries'], answer: 'B', explanation: 'Islam spread through multiple channels: military expansion, trade networks (especially across the Sahara and Indian Ocean), Sufi missionaries, and political administration, each important in different regions.' },
  ],
  'ethnic-diversity': [
    { type: 'mc', q: 'An ethnic enclave is:', choices: ['A prison', 'A neighborhood where a particular ethnic group is concentrated, maintaining cultural identity', 'A type of government', 'A geographic feature'], answer: 'B', explanation: 'Ethnic enclaves (Chinatown, Little Italy, Koreatown) form as immigrant communities cluster for social support, shared language, and cultural preservation, creating distinctive cultural landscapes within cities.' },
    { type: 'sa', q: 'How do ethnic conflicts relate to colonial-era boundaries?', answer: 'arbitrary', explanation: 'Colonial powers drew arbitrary boundaries that divided ethnic groups across countries or combined rival groups within one state, creating persistent tensions. Many African and Middle Eastern conflicts trace to boundaries that ignored ethnic, linguistic, and religious realities.' },
    { type: 'mc', q: 'Ethnocentrism is:', choices: ['Appreciation of other cultures', 'Judging other cultures by the standards of one\'s own, often assuming one\'s own culture is superior', 'Cultural relativism', 'Geographic study of ethnicity'], answer: 'B', explanation: 'Ethnocentrism evaluates other cultures through the lens of one\'s own, often leading to bias, misunderstanding, and conflict. Cultural relativism — understanding cultures on their own terms — is the counterpoint.' },
    { type: 'mc', q: 'The cultural landscape concept (Carl Sauer) refers to:', choices: ['Only natural features', 'The visible imprint of human activity on the physical environment', 'Political boundaries', 'Climate zones'], answer: 'B', explanation: 'Cultural landscapes show how human groups modify their environment: architecture, land use patterns, place names, religious structures, agricultural practices, and transportation networks all reflect cultural values and history.' },
    { type: 'mc', q: 'Multiculturalism as a policy:', choices: ['Demands cultural uniformity', 'Recognizes and supports the coexistence of diverse cultures within a society', 'Is the same as assimilation', 'Only exists in Canada'], answer: 'B', explanation: 'Multiculturalism (practiced in Canada, Australia, others) officially supports cultural diversity and group rights, contrasting with assimilationist approaches that expect immigrants to adopt the dominant culture.' },
    { type: 'mc', q: 'Indigenous peoples\' land rights are a geographic issue because:', choices: ['They are not geographic', 'Territory is central to indigenous identity, subsistence, culture, and self-determination', 'Only affects remote areas', 'Land has no cultural significance'], answer: 'B', explanation: 'For indigenous peoples, land is integral to cultural identity, spiritual practices, economic subsistence, and self-determination. Land rights disputes involve resource extraction, development, and historical dispossession.' },
  ],
  'cultural-regions': [
    { type: 'mc', q: 'A formal (uniform) region is defined by:', choices: ['Personal perception', 'Measurable, uniform characteristics like language, climate, or government', 'Functional connections', 'Emotional attachment'], answer: 'B', explanation: 'Formal regions have uniform characteristics throughout (Francophone Africa, the Corn Belt, climate zones). Functional regions are organized around a central node; perceptual regions are based on cultural identity.' },
    { type: 'sa', q: 'What is the difference between a functional region and a perceptual region?', answer: 'node', explanation: 'Functional regions are organized around a focal point (city and its commuter area, TV broadcast area). Perceptual (vernacular) regions exist in people\'s mental maps based on cultural identity (the South, the Midwest, Silicon Valley).' },
    { type: 'mc', q: 'A borderland or frontier zone is significant because:', choices: ['It is empty', 'It is an area of cultural transition and interaction between different groups', 'It only exists between countries', 'It is always violent'], answer: 'B', explanation: 'Borderlands are zones of cultural mixing, hybrid identities, and transition between dominant cultures — the US-Mexico border region, for example, has its own distinct cultural characteristics.' },
    { type: 'mc', q: 'Vernacular regions are determined by:', choices: ['Government census data', 'People\'s perceptions and cultural identification rather than precise boundaries', 'Satellite imagery', 'International law'], answer: 'B', explanation: 'Vernacular (perceptual) regions exist in collective imagination: "the South," "the Middle East," "Silicon Valley" have boundaries that vary by person and are defined by cultural perception, not precise measurement.' },
    { type: 'mc', q: 'Regionalization helps geographers by:', choices: ['Eliminating all differences', 'Organizing space into manageable units for analysis while recognizing that boundaries are often transitional', 'Creating permanent borders', 'Only applying to countries'], answer: 'B', explanation: 'Regionalization groups areas sharing common characteristics for analysis, but boundaries are often gradients rather than sharp lines, and regions can overlap depending on the criteria used.' },
    { type: 'mc', q: 'Cultural landscapes differ from natural landscapes in that:', choices: ['They are always urban', 'They show visible evidence of human modification, use, and cultural values imprinted on the environment', 'They are less important', 'They are only modern'], answer: 'B', explanation: 'Cultural landscapes reveal how humans interact with their environment: agricultural patterns, architecture, sacred sites, transportation networks, and land use all tell stories about the cultures that created them.' },
  ],
  'folk-popular-culture': [
    { type: 'mc', q: 'Folk culture differs from popular culture in that:', choices: ['It is newer', 'Folk culture is traditional, locally rooted, and slowly changing; popular culture is mass-produced and rapidly diffusing', 'Folk culture uses technology', 'They are the same'], answer: 'B', explanation: 'Folk culture is place-based, traditional, passed through generations, and varies by location. Popular culture is mass-produced, rapidly diffused through media, and tends toward global homogeneity.' },
    { type: 'sa', q: 'How does globalization threaten folk culture?', answer: 'replace', explanation: 'Globalization can replace local traditions, languages, crafts, food, and music with mass-produced popular culture. Economic pressures, media saturation, and youth migration to cities accelerate the loss of traditional practices.' },
    { type: 'mc', q: 'Fast food restaurants spreading worldwide is an example of:', choices: ['Folk culture diffusion', 'Cultural imperialism or the global spread of popular culture from dominant (often Western) sources', 'Reverse diffusion', 'Cultural isolation'], answer: 'B', explanation: 'Global fast food spread illustrates cultural imperialism: dominant cultures exporting products and values, potentially homogenizing food culture. Local responses include adaptation (glocalization) and resistance.' },
    { type: 'mc', q: 'Terroir in food geography refers to:', choices: ['A type of terrorism', 'How local geography, climate, and cultural practices create distinctive regional food products', 'Industrial farming', 'Food transportation'], answer: 'B', explanation: 'Terroir connects food to place — how soil, climate, and traditional practices create distinctive products (Champagne wine, Parmesan cheese, Darjeeling tea), reflecting geographic and cultural specificity.' },
    { type: 'mc', q: 'The concept of "placelessness" (Edward Relph) describes:', choices: ['Places without names', 'Homogenization of landscapes by chain stores, suburbs, and commercial strips that look the same everywhere', 'Unmapped territory', 'Virtual reality'], answer: 'B', explanation: 'Placelessness describes how commercial landscapes (strip malls, chain restaurants, suburban subdivisions) create identical environments everywhere, eroding distinctive local character and sense of place.' },
    { type: 'mc', q: 'Cultural appropriation in geography refers to:', choices: ['Sharing culture equally', 'Adoption of elements from marginalized cultures by dominant groups, often without understanding or credit', 'Cultural exchange', 'Tourism only'], answer: 'B', explanation: 'Cultural appropriation involves taking cultural elements (sacred symbols, traditional dress, music) from marginalized groups without context, credit, or understanding, often commodifying them for profit.' },
  ],
  'state-boundaries': [
    { type: 'mc', q: 'A nation-state is:', choices: ['Any country', 'A political state whose boundaries coincide with the territory of a single nation/ethnic group', 'A federal system', 'A city-state'], answer: 'B', explanation: 'A true nation-state (Japan, Iceland) has a single dominant nation matching state boundaries. Most states are multinational or multiethnic, making the nation-state an ideal rather than the norm.' },
    { type: 'sa', q: 'What is the difference between a geometric and natural boundary?', answer: 'straight', explanation: 'Geometric boundaries follow straight lines (often latitude/longitude) regardless of terrain or culture (US-Canada at 49°N). Natural boundaries follow physical features (rivers, mountains, lakes). Neither type necessarily prevents conflict.' },
    { type: 'mc', q: 'Antecedent boundaries are:', choices: ['Drawn after settlements exist', 'Drawn before significant settlement in the area, regardless of cultural patterns', 'Always natural features', 'Only in Africa'], answer: 'B', explanation: 'Antecedent boundaries were drawn before the area was well-populated (US-Canada). Subsequent boundaries were drawn after settlement patterns established (France-Germany). Superimposed boundaries ignore existing cultural patterns.' },
    { type: 'mc', q: 'The concept of a stateless nation refers to:', choices: ['A country without a military', 'An ethnic/national group without its own sovereign state (e.g., Kurds, Palestinians, Tibetans)', 'A failed state', 'An island nation'], answer: 'B', explanation: 'Stateless nations (Kurds across Turkey/Iraq/Syria/Iran, Palestinians, Tibetans) have distinct national identities but lack sovereign statehood, often leading to conflict and independence movements.' },
    { type: 'mc', q: 'Buffer states serve the purpose of:', choices: ['Increasing conflict', 'Separating rival powers to reduce direct confrontation (e.g., Mongolia between Russia and China)', 'Only economic trade', 'Colonial expansion'], answer: 'B', explanation: 'Buffer states (Mongolia, Nepal, Afghanistan historically) sit between rival powers, reducing the likelihood of direct confrontation by providing a neutral zone between competing spheres of influence.' },
    { type: 'mc', q: 'Devolution refers to:', choices: ['Evolution in reverse', 'The transfer of power from a central government to regional or local authorities', 'Government collapse', 'Military takeover'], answer: 'B', explanation: 'Devolution transfers power to subnational units (Scotland, Catalonia, Quebec), driven by ethnic, linguistic, or economic differences. It can prevent separatism or precede it.' },
  ],
  'sovereignty-territory': [
    { type: 'mc', q: 'Territorial waters extend:', choices: ['1 mile from shore', '12 nautical miles from the baseline, within which the coastal state has sovereignty', '200 miles from shore', 'The entire ocean'], answer: 'B', explanation: 'UNCLOS establishes 12 nautical mile territorial waters (full sovereignty), 24-mile contiguous zone (limited enforcement), and 200-mile exclusive economic zone (resource rights).' },
    { type: 'sa', q: 'Why is the South China Sea a contested territory?', answer: 'claims', explanation: 'Multiple nations (China, Vietnam, Philippines, Malaysia, Brunei, Taiwan) claim overlapping territory based on historical claims, resource access (oil, gas, fisheries), strategic shipping lanes, and artificial island construction by China.' },
    { type: 'mc', q: 'Self-determination as a principle means:', choices: ['Individuals decide their own fate', 'Peoples have the right to determine their own political status and governance', 'Only applies to colonized peoples', 'Is no longer relevant'], answer: 'B', explanation: 'Self-determination — the right of peoples to choose their political status — was central to decolonization but remains contentious when applied to separatist movements within existing states.' },
    { type: 'mc', q: 'Failed states are characterized by:', choices: ['Strong institutions', 'Loss of territorial control, inability to provide public services, and collapse of legitimate government', 'High GDP', 'Strong military'], answer: 'B', explanation: 'Failed states (Somalia, Yemen, South Sudan) cannot maintain order, provide services, or control their territory, often suffering from civil conflict, humanitarian crises, and external intervention.' },
    { type: 'mc', q: 'The Exclusive Economic Zone (EEZ) extends:', choices: ['12 nautical miles', '200 nautical miles from the baseline, granting resource rights but not full sovereignty', '500 miles', 'Only to the continental shelf'], answer: 'B', explanation: 'The EEZ grants coastal states sovereign rights over natural resources (fish, oil, minerals) within 200 nautical miles, but other nations retain freedom of navigation and overflight.' },
    { type: 'mc', q: 'Irredentism is:', choices: ['A form of government', 'A policy seeking to reclaim territory that a state considers historically or ethnically part of its domain', 'International cooperation', 'Trade agreement'], answer: 'B', explanation: 'Irredentism — claiming territory based on historical or ethnic connections — has driven conflicts (Russia/Crimea, Serbia/Kosovo, China/Taiwan), challenging existing borders and international norms.' },
  ],
  'supranational-orgs': [
    { type: 'mc', q: 'The European Union represents:', choices: ['A military alliance only', 'A supranational organization where member states pool sovereignty for economic and political cooperation', 'A single country', 'Only a trade agreement'], answer: 'B', explanation: 'The EU represents the most advanced supranational integration: common market, shared currency (eurozone), common policies, and EU-level governance, with ongoing debates about deeper integration vs. national sovereignty.' },
    { type: 'sa', q: 'What are the arguments for and against supranational organizations?', answer: 'cooperation', explanation: 'For: facilitate cooperation on transnational issues, increase collective bargaining power, reduce conflict, promote shared standards. Against: reduce national sovereignty, democratic deficit, bureaucratic complexity, unequal power among members.' },
    { type: 'mc', q: 'The African Union (AU) aims to:', choices: ['Replace national governments', 'Promote political unity, economic development, and conflict resolution across the African continent', 'Only address disease', 'Maintain colonial boundaries'], answer: 'B', explanation: 'The AU works toward continental integration, economic development, peace and security, democracy promotion, and representing Africa\'s interests globally, though capacity and enforcement remain challenges.' },
    { type: 'mc', q: 'Brexit demonstrated that supranational membership:', choices: ['Is permanent', 'Involves tradeoffs between sovereignty and cooperation that can lead to withdrawal', 'Has no drawbacks', 'Is only economic'], answer: 'B', explanation: 'Brexit illustrated tensions between national sovereignty and supranational membership, with debates about immigration, regulation, trade, identity, and democratic control driving the UK\'s EU departure.' },
    { type: 'mc', q: 'ASEAN (Association of Southeast Asian Nations) differs from the EU in that:', choices: ['They are identical', 'ASEAN emphasizes non-interference in members\' affairs and consensus-based decisions with less supranational authority', 'ASEAN has more members', 'ASEAN is older'], answer: 'B', explanation: 'ASEAN operates on principles of non-interference, consensus, and consultation rather than binding supranational authority, reflecting different political cultures and development levels among its members.' },
    { type: 'mc', q: 'The United Nations is limited because:', choices: ['It is not needed', 'Security Council vetoes by the P5 can block action, it depends on member state cooperation, and it has limited enforcement capacity', 'It has too much power', 'It is too small'], answer: 'B', explanation: 'The UN faces structural limitations: P5 vetoes paralyze the Security Council, the General Assembly lacks binding authority, enforcement depends on member state willingness, and funding is voluntary.' },
  ],
  'gerrymandering-redistricting': [
    { type: 'mc', q: 'Redistricting occurs:', choices: ['Every year', 'After each decennial census to adjust legislative districts based on population changes', 'Only when parties change', 'Only at the federal level'], answer: 'B', explanation: 'Redistricting after each census redraws legislative districts to maintain equal population representation. The process is political in most states, though some use independent commissions.' },
    { type: 'sa', q: 'What are "packing" and "cracking" in gerrymandering?', answer: 'concentrate', explanation: 'Packing concentrates opposition voters into few districts (wasting their surplus votes), while cracking spreads opposition voters across many districts (diluting their impact). Both techniques allow the controlling party to maximize its seats.' },
    { type: 'mc', q: 'Independent redistricting commissions are advocated to:', choices: ['Increase gerrymandering', 'Remove partisan bias from the redistricting process and create fairer districts', 'Eliminate voting', 'Only benefit one party'], answer: 'B', explanation: 'Independent commissions (used in California, Arizona, others) aim to reduce partisan manipulation in redistricting by having non-partisan or bipartisan bodies draw district lines based on neutral criteria.' },
    { type: 'mc', q: 'The Voting Rights Act affected redistricting by:', choices: ['Having no impact', 'Requiring that redistricting not dilute minority voting power, leading to majority-minority districts', 'Eliminating all districts', 'Only affecting Southern states'], answer: 'B', explanation: 'The VRA prohibited redistricting that dilutes minority voting power, leading to creation of majority-minority districts. Court decisions have debated whether race can be the predominant factor in drawing districts.' },
    { type: 'mc', q: 'Geographic Information Systems (GIS) affect redistricting by:', choices: ['Making it unnecessary', 'Enabling precise, data-driven district drawing that can either reduce or enable sophisticated gerrymandering', 'Only helping independent commissions', 'Having no impact'], answer: 'B', explanation: 'GIS allows block-by-block analysis for redistricting, which can create optimally fair districts OR enable extremely precise gerrymandering depending on who controls the process.' },
    { type: 'mc', q: 'The "efficiency gap" measures:', choices: ['Government spending', 'The degree of partisan advantage in a redistricting plan by comparing wasted votes between parties', 'Voter turnout', 'District population equality'], answer: 'B', explanation: 'The efficiency gap calculates wasted votes (votes for losing candidates plus excess votes for winners) for each party, quantifying partisan gerrymandering advantage. Courts have considered but not adopted it as a legal standard.' },
  ],
  'economic-sectors': [
    { type: 'mc', q: 'The primary economic sector involves:', choices: ['Manufacturing', 'Extraction of natural resources (agriculture, mining, fishing, forestry)', 'Services', 'Information technology'], answer: 'B', explanation: 'Primary sector activities extract raw materials from nature: farming, mining, fishing, forestry, and hunting. Developing economies tend to have larger primary sectors as a share of GDP and employment.' },
    { type: 'sa', q: 'How does Rostow\'s stages of economic growth model describe development?', answer: 'traditional', explanation: 'Rostow\'s model: (1) Traditional society, (2) Preconditions for takeoff, (3) Takeoff (industrialization), (4) Drive to maturity, (5) Age of mass consumption. Criticized for being linear, Western-centric, and ignoring structural barriers.' },
    { type: 'mc', q: 'Deindustrialization in developed countries refers to:', choices: ['Building more factories', 'The decline of manufacturing as economies shift to service and knowledge-based sectors', 'Returning to agriculture', 'Only a European phenomenon'], answer: 'B', explanation: 'Deindustrialization sees manufacturing decline (automation, outsourcing, global competition) as economies shift to services (tertiary), information (quaternary), and decision-making (quinary) sectors.' },
    { type: 'mc', q: 'The informal economy:', choices: ['Does not exist', 'Includes economic activities outside government regulation and taxation, significant in developing nations', 'Is only illegal activity', 'Is declining worldwide'], answer: 'B', explanation: 'The informal economy (street vendors, domestic workers, unlicensed businesses) employs over 60% of workers in many developing countries, operating outside formal regulation, taxation, and legal protection.' },
    { type: 'mc', q: 'Special Economic Zones (SEZs) are designed to:', choices: ['Restrict trade', 'Attract foreign investment through tax incentives, reduced regulations, and infrastructure in designated areas', 'Reduce employment', 'Only benefit agriculture'], answer: 'B', explanation: 'SEZs (pioneered by China\'s Shenzhen) offer favorable conditions to attract investment and stimulate economic growth, often serving as laboratories for market reforms within otherwise restricted economies.' },
    { type: 'mc', q: 'The quaternary economic sector involves:', choices: ['Mining', 'Knowledge-based activities including research, information technology, education, and consulting', 'Farming', 'Manufacturing'], answer: 'B', explanation: 'The quaternary sector focuses on knowledge and information: research & development, IT, education, financial planning, and consulting. It dominates advanced economies and drives innovation.' },
  ],
  'global-trade': [
    { type: 'mc', q: 'Comparative advantage explains why nations trade by showing that:', choices: ['Wealthy nations always benefit more', 'Countries should specialize in producing goods where their opportunity cost is lowest', 'Trade only benefits exporters', 'All countries produce the same things'], answer: 'B', explanation: 'Comparative advantage (Ricardo) demonstrates that all countries benefit from trade when each specializes in what it produces at the lowest opportunity cost, even if one country is more efficient at everything.' },
    { type: 'sa', q: 'How do global supply chains connect developed and developing countries?', answer: 'manufacturing', explanation: 'Global supply chains distribute production across countries based on comparative advantage: developing countries often provide raw materials and low-cost manufacturing; developed countries contribute design, marketing, and advanced manufacturing. This creates interdependence but also vulnerability.' },
    { type: 'mc', q: 'Fair trade certification aims to:', choices: ['Increase prices for consumers', 'Ensure producers in developing countries receive fair prices, safe conditions, and sustainable practices', 'Replace free trade', 'Only affect coffee'], answer: 'B', explanation: 'Fair trade guarantees minimum prices, direct trade relationships, community development premiums, and environmental standards for producers in developing countries, though its effectiveness is debated.' },
    { type: 'mc', q: 'The "commodity trap" refers to:', choices: ['Storing commodities', 'Developing countries being dependent on exporting raw materials with volatile prices and low value-added', 'An economic theory', 'A trade agreement'], answer: 'B', explanation: 'Countries dependent on commodity exports (oil, minerals, agricultural products) face volatile prices, declining terms of trade, and difficulty diversifying into higher-value manufacturing and services.' },
    { type: 'mc', q: 'Containerization revolutionized global trade by:', choices: ['Increasing shipping costs', 'Standardizing cargo containers, dramatically reducing loading time, costs, and enabling global supply chains', 'Only affecting ocean shipping', 'Reducing trade volume'], answer: 'B', explanation: 'Standardized containers (introduced 1956) reduced cargo handling costs by over 90%, enabling intermodal transport (ship-truck-rail) and making global supply chains economically viable.' },
    { type: 'mc', q: 'Neo-colonialism refers to:', choices: ['New colonies', 'Continued economic and political influence of former colonial powers over developing nations through trade, aid, and investment', 'Decolonization', 'Cultural exchange'], answer: 'B', explanation: 'Neo-colonialism describes how former colonial powers maintain influence through economic relationships (debt, trade agreements, resource extraction), multinational corporations, and political pressure.' },
  ],
  'development-indicators': [
    { type: 'mc', q: 'The Human Development Index (HDI) measures:', choices: ['Only GDP', 'Life expectancy, education (mean/expected years of schooling), and GNI per capita', 'Military strength', 'Population size'], answer: 'B', explanation: 'The HDI (UNDP) provides a broader development measure than GDP alone, combining health (life expectancy), education (schooling years), and income (GNI per capita) to rank countries.' },
    { type: 'sa', q: 'Why is GDP per capita alone insufficient for measuring development?', answer: 'inequality', explanation: 'GDP per capita averages hide inequality, ignore unpaid labor, exclude environmental degradation, don\'t measure health or education, and can be skewed by resource extraction that benefits few. HDI, Gini coefficient, and other measures provide fuller pictures.' },
    { type: 'mc', q: 'The Gender Inequality Index measures:', choices: ['Only pay gaps', 'Disparities between men and women in reproductive health, empowerment, and labor market participation', 'Only education differences', 'Military gender ratios'], answer: 'B', explanation: 'The GII captures gender disparities across reproductive health (maternal mortality, adolescent births), empowerment (education, parliamentary seats), and labor force participation.' },
    { type: 'mc', q: 'Core-periphery theory (Wallerstein) argues that:', choices: ['All countries develop equally', 'The global economy has a wealthy core that exploits a dependent periphery, maintaining inequality', 'Only internal factors determine development', 'Geography doesn\'t matter'], answer: 'B', explanation: 'World systems theory identifies core (wealthy, industrial), semi-periphery (intermediate), and periphery (poor, dependent) countries, arguing that global capitalism maintains this hierarchy through unequal exchange.' },
    { type: 'mc', q: 'Purchasing Power Parity (PPP) adjusts GDP by:', choices: ['Population size', 'Accounting for different price levels between countries, enabling more accurate standard-of-living comparisons', 'Exchange rates only', 'Inflation only'], answer: 'B', explanation: 'PPP adjusts for different costs of living: a dollar buys more in India than in Switzerland. PPP-adjusted GDP provides more meaningful comparisons of actual purchasing power and living standards.' },
    { type: 'mc', q: 'The "middle income trap" describes:', choices: ['Average-income individuals', 'Countries that achieve middle-income status but stall, unable to transition to high-income economies', 'A savings account type', 'A trade agreement'], answer: 'B', explanation: 'The middle income trap occurs when countries lose comparative advantage in low-wage manufacturing but fail to develop high-value industries, getting stuck at middle-income levels (e.g., some Latin American, Asian countries).' },
  ],
  'resource-distribution': [
    { type: 'mc', q: 'The "resource curse" refers to:', choices: ['Running out of resources', 'Countries rich in natural resources often experiencing slower economic growth, corruption, and conflict', 'A blessing of resources', 'Only affecting oil nations'], answer: 'B', explanation: 'The resource curse (paradox of plenty) describes how resource-rich countries often suffer from corruption, Dutch disease (currency appreciation hurting other exports), conflict over resources, and weak institutions.' },
    { type: 'sa', q: 'How does uneven distribution of freshwater resources create geopolitical tensions?', answer: 'conflict', explanation: 'Water scarcity creates tensions between upstream and downstream nations sharing rivers (Nile, Jordan, Mekong), between competing agricultural/urban/industrial users, and as climate change alters precipitation patterns in already stressed regions.' },
    { type: 'mc', q: 'OPEC\'s power comes from:', choices: ['Military strength', 'Member states collectively controlling a significant share of global oil reserves and production', 'Manufacturing capacity', 'Population size'], answer: 'B', explanation: 'OPEC coordinates oil production among member states to influence global oil prices, though its power has varied with shale oil production, renewable energy growth, and member compliance.' },
    { type: 'mc', q: 'Rare earth elements are geopolitically significant because:', choices: ['They are worthless', 'They are essential for technology/defense and China controls roughly 60% of mining and 90% of processing', 'They are abundant everywhere', 'Only affect jewelry'], answer: 'B', explanation: 'Rare earth elements are critical for electronics, electric vehicles, wind turbines, and military systems. China\'s dominance in mining and processing creates supply chain vulnerabilities for other nations.' },
    { type: 'mc', q: 'Conflict minerals refer to:', choices: ['Any mineral used in war', 'Natural resources whose extraction and trade fund armed conflict and human rights abuses', 'Minerals found in conflict zones', 'Synthetic materials'], answer: 'B', explanation: 'Conflict minerals (tin, tantalum, tungsten, gold from DRC) fund armed groups and are linked to human rights abuses. Regulations (Dodd-Frank, EU) require supply chain due diligence.' },
    { type: 'mc', q: 'The energy transition away from fossil fuels will:', choices: ['Have no geographic implications', 'Shift geopolitical power as countries rich in lithium, cobalt, and rare earths gain importance', 'Only affect oil-producing nations', 'Happen overnight'], answer: 'B', explanation: 'The energy transition reshapes resource geopolitics: countries with lithium (Chile, Australia), cobalt (DRC), and renewable energy potential gain influence, while petrostates face economic restructuring.' },
  ],
  'agriculture-land-use': [
    { type: 'mc', q: 'Von Thunen\'s model predicts that:', choices: ['All farming is identical', 'Agricultural land use is organized in concentric rings around a market center based on transportation costs', 'Only industrial areas exist', 'Distance doesn\'t matter'], answer: 'B', explanation: 'Von Thunen\'s model (1826): perishable/heavy products (dairy, vegetables) are produced near the market, with extensive land uses (grain, ranching) farther away where land is cheaper and transport costs are acceptable.' },
    { type: 'sa', q: 'What is the Green Revolution and what were its impacts?', answer: 'yield', explanation: 'The Green Revolution (1960s-80s) introduced high-yield crop varieties, irrigation, and chemical inputs, dramatically increasing food production. Benefits: reduced famine. Criticisms: environmental damage, water depletion, farmer debt, favored large farms, reduced biodiversity.' },
    { type: 'mc', q: 'Subsistence agriculture differs from commercial agriculture in that:', choices: ['It uses more technology', 'Farmers primarily produce food for their own consumption rather than for sale in markets', 'It is more profitable', 'It only exists in Europe'], answer: 'B', explanation: 'Subsistence farmers produce primarily for family consumption using traditional methods, while commercial agriculture produces for market sale using modern technology, larger scales, and capital investment.' },
    { type: 'mc', q: 'Agribusiness refers to:', choices: ['Small family farms', 'Large-scale, corporate, industrialized agriculture integrated with processing, distribution, and retail', 'Organic farming', 'Urban gardening'], answer: 'B', explanation: 'Agribusiness integrates farming with processing, distribution, and retail in corporate structures, dominating food production in developed countries through economies of scale, technology, and vertical integration.' },
    { type: 'mc', q: 'Food deserts are:', choices: ['Deserts with no food production', 'Urban or rural areas with limited access to affordable, nutritious food, often in low-income communities', 'A type of diet', 'Only found in developing nations'], answer: 'B', explanation: 'Food deserts are areas where residents lack easy access to fresh, affordable food — often low-income communities with few grocery stores, relying on convenience stores and fast food.' },
    { type: 'mc', q: 'Shifting cultivation (slash-and-burn) involves:', choices: ['Permanent farming', 'Clearing land, farming it briefly, then moving to new land as soil fertility declines', 'Only growing rice', 'Industrial logging'], answer: 'B', explanation: 'Shifting cultivation clears forest (slash-and-burn), farms the nutrient-rich ash for a few seasons, then moves on, allowing forest to regenerate. Sustainable at low populations but problematic with population pressure.' },
  ],
  'climate-change-impacts': [
    { type: 'mc', q: 'Sea level rise threatens:', choices: ['Only island nations', 'Coastal cities, low-lying deltas, island nations, and infrastructure serving billions of people', 'Only wealthy nations', 'No one significantly'], answer: 'B', explanation: 'Sea level rise threatens billions in coastal areas: flooding, saltwater intrusion, infrastructure damage, forced migration. Low-lying nations (Bangladesh, Maldives, Tuvalu) face existential threats.' },
    { type: 'sa', q: 'How does climate change affect agriculture globally?', answer: 'yield', explanation: 'Climate change alters growing seasons, shifts suitable crop zones, increases drought and flooding frequency, introduces new pests, reduces water availability, and decreases yields in tropical regions while potentially benefiting some higher-latitude areas.' },
    { type: 'mc', q: 'Climate refugees are people who:', choices: ['Prefer warmer climates', 'Are forced to migrate because climate change has made their homes uninhabitable', 'Only come from island nations', 'Have legal refugee status everywhere'], answer: 'B', explanation: 'Climate displacement forces migration due to sea level rise, drought, flooding, and extreme weather. Millions are projected to be displaced, but international law does not yet formally recognize "climate refugees."' },
    { type: 'mc', q: 'The Arctic is warming approximately:', choices: ['At the same rate as the rest of Earth', 'Two to four times faster than the global average, causing rapid ice loss', 'Slower than the tropics', 'Not at all'], answer: 'B', explanation: 'Arctic amplification causes the Arctic to warm 2-4 times faster than the global average, with dramatic ice loss, permafrost thaw, and ecosystem disruption, also affecting global weather patterns.' },
    { type: 'mc', q: 'Urban heat islands demonstrate that:', choices: ['Cities are always comfortable', 'Cities are significantly warmer than surrounding rural areas due to concrete, asphalt, and lack of vegetation', 'Only affect tropical cities', 'Have no health impacts'], answer: 'B', explanation: 'Urban heat islands create temperatures 5-10°F warmer than surrounding areas due to heat-absorbing surfaces, waste heat, and less vegetation, exacerbating heat waves and disproportionately affecting vulnerable populations.' },
    { type: 'mc', q: 'Permafrost thaw is concerning because:', choices: ['It creates more farmland', 'It releases stored methane and CO2, damages infrastructure, and creates a positive feedback loop', 'It only affects Siberia', 'It has no significant impact'], answer: 'B', explanation: 'Permafrost contains twice the carbon in the atmosphere. Thawing releases methane and CO2, accelerating warming in a dangerous feedback loop, while also destabilizing buildings, roads, and pipelines.' },
  ],
  'deforestation': [
    { type: 'mc', q: 'The primary driver of tropical deforestation is:', choices: ['Logging only', 'Agricultural expansion (cattle ranching, soybean/palm oil plantations)', 'Urbanization', 'Natural causes'], answer: 'B', explanation: 'Agricultural expansion drives roughly 80% of tropical deforestation: cattle ranching (Amazon), palm oil plantations (Indonesia/Malaysia), soy cultivation, and small-scale farming for food security.' },
    { type: 'sa', q: 'How does deforestation contribute to climate change?', answer: 'carbon', explanation: 'Forests are carbon sinks, absorbing CO2. Deforestation releases stored carbon (about 10% of global emissions), reduces future absorption capacity, alters water cycles, and disrupts local and regional climate patterns.' },
    { type: 'mc', q: 'Desertification is primarily caused by:', choices: ['Deserts naturally expanding', 'Overgrazing, deforestation, unsustainable farming, and climate change degrading drylands', 'Too much rainfall', 'Volcanic activity'], answer: 'B', explanation: 'Desertification — land degradation in arid areas — results from human activities (overgrazing, deforestation, poor irrigation) interacting with climate variability, affecting 1 billion people in 100+ countries.' },
    { type: 'mc', q: 'REDD+ is an international framework that:', choices: ['Promotes deforestation', 'Provides financial incentives for developing countries to reduce emissions from deforestation and forest degradation', 'Only plants new trees', 'Bans all logging'], answer: 'B', explanation: 'REDD+ (Reducing Emissions from Deforestation and Forest Degradation) compensates developing countries for preserving forests, recognizing forests\' carbon value, though implementation faces challenges with monitoring and indigenous rights.' },
    { type: 'mc', q: 'The Amazon rainforest is called the "lungs of the Earth" because:', choices: ['It produces all Earth\'s oxygen', 'It absorbs enormous amounts of CO2 and produces oxygen through photosynthesis on a massive scale', 'It only affects South America', 'It is the only forest left'], answer: 'B', explanation: 'The Amazon absorbs billions of tons of CO2, produces significant oxygen, influences continental rainfall, and houses unparalleled biodiversity. Approaching tipping points could turn it from carbon sink to source.' },
    { type: 'mc', q: 'Reforestation and afforestation differ in that:', choices: ['They are the same', 'Reforestation replants previously forested areas; afforestation plants trees where there were none before', 'Only governments do afforestation', 'Neither is effective'], answer: 'B', explanation: 'Reforestation restores previously forested land; afforestation creates new forests on non-forested land. Both sequester carbon, but ecological impact depends on species choice, management, and whether monocultures or diverse forests are planted.' },
  ],
  'water-management': [
    { type: 'mc', q: 'Water stress occurs when:', choices: ['There is too much water', 'Water demand exceeds available supply or quality is too poor for use', 'Only in deserts', 'Water prices are too low'], answer: 'B', explanation: 'Water stress affects regions where demand from agriculture, industry, and households exceeds sustainable supply. Nearly 2 billion people live in water-stressed areas, projected to increase with population growth and climate change.' },
    { type: 'sa', q: 'What are the main challenges of transboundary water management?', answer: 'sharing', explanation: 'Transboundary water challenges include: upstream/downstream conflicts, differing national priorities, sovereignty concerns, climate change uncertainty, population growth, pollution transfer, and the need for international agreements (Nile, Mekong, Colorado River).' },
    { type: 'mc', q: 'Desalination as a water source:', choices: ['Is free', 'Provides freshwater from seawater but is energy-intensive and expensive', 'Replaces all water needs', 'Has no environmental impact'], answer: 'B', explanation: 'Desalination removes salt from seawater, providing freshwater for water-scarce regions (Middle East, California). Challenges include high energy costs, brine waste disposal, and environmental impacts on marine ecosystems.' },
    { type: 'mc', q: 'The Aral Sea disaster was caused by:', choices: ['Natural drought', 'Soviet diversion of rivers for cotton irrigation, shrinking the sea to a fraction of its original size', 'Tectonic activity', 'Climate change alone'], answer: 'B', explanation: 'Soviet irrigation projects diverted the Amu Darya and Syr Darya rivers for cotton, shrinking the Aral Sea by 90%, devastating fisheries, creating toxic dust storms, and causing health crises — one of the worst environmental disasters.' },
    { type: 'mc', q: 'Groundwater irrigation has enabled:', choices: ['Only negative outcomes', 'Agricultural productivity gains but also aquifer depletion, land subsidence, and sustainability concerns', 'Universal water access', 'Reduced farming'], answer: 'B', explanation: 'Groundwater irrigation transformed agriculture (India, US Great Plains) but unsustainable pumping depletes aquifers (Ogallala, North India), causes land subsidence, and threatens long-term food security.' },
    { type: 'mc', q: 'Virtual water trade refers to:', choices: ['Digital water management', 'The hidden water embedded in products traded internationally (e.g., water used to grow exported crops)', 'Online water purchase', 'Cloud computing'], answer: 'B', explanation: 'Virtual water accounts for water used in producing goods that are traded. Water-scarce countries effectively import water by buying agricultural products, affecting global water distribution patterns.' },
  ],
  'sustainability': [
    { type: 'mc', q: 'Sustainable development is defined as:', choices: ['Zero economic growth', 'Development that meets present needs without compromising future generations\' ability to meet their needs', 'Only environmental protection', 'Maximum resource extraction'], answer: 'B', explanation: 'The Brundtland definition (1987) balances economic, social, and environmental needs across time — meeting current needs while preserving the ability of future generations to meet theirs.' },
    { type: 'sa', q: 'What is the ecological footprint and what does it reveal?', answer: 'biocapacity', explanation: 'The ecological footprint measures the land and water area needed to produce what a population consumes and absorb its waste. When footprint exceeds biocapacity, we are in ecological overshoot — humanity currently uses roughly 1.7 Earths\' worth of resources.' },
    { type: 'mc', q: 'The circular economy model aims to:', choices: ['Increase waste', 'Eliminate waste by designing products for reuse, repair, and recycling rather than disposal', 'Only use renewable energy', 'Reduce all production'], answer: 'B', explanation: 'The circular economy replaces the linear "take-make-dispose" model with closed loops: designing for durability, reuse, repair, remanufacturing, and recycling to minimize resource extraction and waste.' },
    { type: 'mc', q: 'Environmental Kuznets Curve theory suggests that:', choices: ['Development always helps the environment', 'Environmental degradation initially increases with development, then decreases as societies become wealthier and demand cleaner environments', 'Poor countries pollute less', 'The relationship is random'], answer: 'B', explanation: 'The EKC suggests an inverted-U relationship: pollution rises during early industrialization, then falls as wealth increases. Evidence is mixed — it works for some pollutants (SO2) but not others (CO2, biodiversity loss).' },
    { type: 'mc', q: 'Ecosystem services include:', choices: ['Only timber and food', 'Pollination, water purification, carbon sequestration, flood control, and recreation provided by natural systems', 'Only economic benefits', 'Nothing of monetary value'], answer: 'B', explanation: 'Ecosystem services — pollination, water filtration, carbon storage, soil formation, flood control, recreational value — are estimated at $125+ trillion annually, far exceeding global GDP.' },
    { type: 'mc', q: 'The tragedy of the commons describes:', choices: ['Common land being well-managed', 'Shared resources being overexploited because individuals benefit from overuse while costs are shared by all', 'Government failure', 'Private property problems'], answer: 'B', explanation: 'Garrett Hardin\'s concept: when resources are shared (fisheries, atmosphere), individuals maximize personal gain by overusing them, even though collective overuse degrades the resource for everyone.' },
  ],
  'gis-fundamentals': [
    { type: 'mc', q: 'GIS (Geographic Information Systems) integrates:', choices: ['Only maps', 'Hardware, software, data, and analysis methods for capturing, managing, analyzing, and displaying geographically referenced information', 'Only satellite imagery', 'Only census data'], answer: 'B', explanation: 'GIS combines spatial data (maps, imagery) with attribute data (population, land use) in layers that can be analyzed, queried, and visualized to understand spatial patterns and relationships.' },
    { type: 'sa', q: 'How do GIS layers work to analyze geographic problems?', answer: 'overlay', explanation: 'GIS layers stack different datasets (topography, roads, land use, demographics) that can be overlaid and analyzed together. Overlaying layers reveals relationships — e.g., overlaying flood zones with population data identifies vulnerable communities.' },
    { type: 'mc', q: 'Raster data in GIS represents:', choices: ['Vector lines', 'Information as a grid of cells/pixels, where each cell holds a value (elevation, temperature, land cover)', 'Only text', '3D models only'], answer: 'B', explanation: 'Raster data represents continuous phenomena as grids of cells: elevation models (DEM), satellite imagery, temperature maps. Cell resolution determines detail level — smaller cells = more detail but larger file sizes.' },
    { type: 'mc', q: 'Vector data in GIS uses:', choices: ['Pixels', 'Points, lines, and polygons to represent discrete features (cities, roads, boundaries)', 'Only satellite images', 'Sound waves'], answer: 'B', explanation: 'Vector data represents discrete features: points (cities, schools), lines (roads, rivers), and polygons (counties, land parcels). Each feature has associated attribute data in a database.' },
    { type: 'mc', q: 'Spatial analysis in GIS can answer questions like:', choices: ['Only "where is it?"', '"What is near this location? What patterns exist? How has this changed? What is the optimal route?"', 'Only about population', 'Only about weather'], answer: 'B', explanation: 'GIS spatial analysis answers proximity queries, pattern detection, change analysis, network routing, site selection, interpolation, and predictive modeling across any geographic phenomenon.' },
    { type: 'mc', q: 'Geocoding is the process of:', choices: ['Encrypting data', 'Converting addresses or place names into geographic coordinates (latitude/longitude)', 'Creating maps manually', 'Measuring distances'], answer: 'B', explanation: 'Geocoding converts text addresses into coordinates, enabling them to be mapped and analyzed spatially. Reverse geocoding converts coordinates to addresses. Essential for mapping address-based data.' },
  ],
  'remote-sensing': [
    { type: 'mc', q: 'Remote sensing collects data about Earth\'s surface:', choices: ['Only from ground level', 'From a distance, using sensors on satellites, aircraft, or drones that detect electromagnetic energy', 'Only through physical sampling', 'Only at night'], answer: 'B', explanation: 'Remote sensing uses sensors (cameras, radar, infrared, multispectral) on satellites or aircraft to collect information about Earth\'s surface without physical contact, enabling large-area monitoring.' },
    { type: 'sa', q: 'How is satellite imagery used to monitor deforestation?', answer: 'change detection', explanation: 'Satellites like Landsat provide repeated imagery allowing change detection: comparing images over time reveals forest loss rates, location, and patterns. Programs like Global Forest Watch use this for near-real-time deforestation monitoring.' },
    { type: 'mc', q: 'Multispectral imaging captures:', choices: ['Only visible light', 'Data across multiple wavelengths of the electromagnetic spectrum, including invisible bands like infrared', 'Only in black and white', 'Sound waves'], answer: 'B', explanation: 'Multispectral sensors capture data across multiple wavelength bands (visible, near-infrared, thermal), enabling analysis of vegetation health (NDVI), water quality, soil composition, and urban heat islands.' },
    { type: 'mc', q: 'LiDAR technology uses:', choices: ['Visible cameras only', 'Laser pulses to measure distance and create precise 3D models of terrain and features', 'Sound waves', 'Magnetic fields'], answer: 'B', explanation: 'LiDAR (Light Detection and Ranging) fires millions of laser pulses to create detailed 3D point clouds of terrain, buildings, and vegetation, used for elevation mapping, urban planning, and archaeology.' },
    { type: 'mc', q: 'The spatial resolution of a satellite image refers to:', choices: ['Image brightness', 'The size of the smallest feature that can be distinguished — smaller pixel size means higher resolution', 'Color accuracy', 'How fast the satellite moves'], answer: 'B', explanation: 'Spatial resolution is the ground area represented by each pixel. Higher resolution (smaller pixels, e.g., 30 cm) shows more detail but covers less area and generates more data than lower resolution (e.g., 1 km).' },
    { type: 'mc', q: 'NDVI (Normalized Difference Vegetation Index) measures:', choices: ['Air quality', 'Vegetation health and density by comparing near-infrared and red light reflectance', 'Water depth', 'Population density'], answer: 'B', explanation: 'NDVI exploits the fact that healthy vegetation strongly reflects near-infrared light and absorbs red light. Higher NDVI values indicate healthier, denser vegetation; lower values suggest stressed or absent vegetation.' },
  ],
  'gps-navigation': [
    { type: 'mc', q: 'GPS requires signals from at least how many satellites for accurate positioning?', choices: ['1', '4', '10', '24'], answer: 'B', explanation: 'GPS needs signals from at least 4 satellites: 3 for trilateration (X, Y, Z position) and a 4th to correct timing errors. More satellites improve accuracy.' },
    { type: 'sa', q: 'How has GPS technology changed geographic research and everyday life?', answer: 'precision', explanation: 'GPS enables precise field data collection, real-time navigation, fleet management, geotagging, precision agriculture, emergency response coordination, and location-based services on smartphones — transforming both geographic research and daily activities.' },
    { type: 'mc', q: 'Differential GPS (DGPS) improves accuracy by:', choices: ['Using more batteries', 'Using a ground reference station with known coordinates to correct satellite signal errors', 'Connecting to the internet', 'Using larger antennas'], answer: 'B', explanation: 'DGPS uses a reference station at a known location to calculate and broadcast correction signals, improving accuracy from ~5 meters to sub-meter or even centimeter levels.' },
    { type: 'mc', q: 'GLONASS, Galileo, and BeiDou are:', choices: ['Types of GPS receivers', 'Alternative satellite navigation systems operated by Russia, the EU, and China respectively', 'GPS manufacturers', 'Map projections'], answer: 'B', explanation: 'Multiple GNSS (Global Navigation Satellite Systems) exist: US GPS, Russian GLONASS, European Galileo, Chinese BeiDou. Modern receivers use multiple systems for improved accuracy and reliability.' },
    { type: 'mc', q: 'Geocaching as a recreational activity demonstrates:', choices: ['GPS is inaccurate', 'How GPS technology enables precise outdoor navigation for millions of people worldwide', 'GPS is only for military use', 'Maps are unnecessary'], answer: 'B', explanation: 'Geocaching (finding hidden containers using GPS coordinates) demonstrates public GPS accuracy and accessibility, engaging millions in geographic exploration and spatial thinking.' },
    { type: 'mc', q: 'Location-based services raise privacy concerns because:', choices: ['They never work accurately', 'They track and store users\' location data, which can be used for surveillance, marketing, or shared without consent', 'They use too much battery', 'They only work outdoors'], answer: 'B', explanation: 'Location data from smartphones reveals patterns of movement, habits, and associations. This data can be used for targeted advertising, law enforcement surveillance, or sold to third parties, raising significant privacy concerns.' },
  ],
  'data-visualization-maps': [
    { type: 'mc', q: 'A cartogram distorts geography to:', choices: ['Show accurate boundaries', 'Resize areas proportionally to a variable like population or GDP rather than physical area', 'Create artistic maps', 'Show elevation'], answer: 'B', explanation: 'Cartograms resize areas based on data values: a population cartogram makes India and China enormous while Canada shrinks, providing intuitive visualization of non-geographic data.' },
    { type: 'sa', q: 'How can maps be used to mislead or manipulate?', answer: 'projection', explanation: 'Maps can mislead through projection choice (Mercator distorts area), color selection (aggressive vs. neutral palettes), data classification (different breakpoints produce different impressions), scale manipulation, and selective feature inclusion/omission.' },
    { type: 'mc', q: 'A proportional symbol map uses:', choices: ['Equal-sized symbols', 'Symbols sized proportionally to data values at specific locations', 'Only text labels', 'Random colors'], answer: 'B', explanation: 'Proportional symbol maps use symbols (circles, squares) scaled to represent data values at point locations — larger symbols for larger values — effective for showing magnitude at specific places.' },
    { type: 'mc', q: 'Web mapping (Google Maps, OpenStreetMap) has democratized cartography by:', choices: ['Replacing all paper maps', 'Giving everyone access to interactive mapping tools, geospatial data, and map-making capabilities', 'Making maps less accurate', 'Only serving businesses'], answer: 'B', explanation: 'Web mapping platforms have made maps ubiquitous, interactive, and customizable. Open data and tools allow anyone to create maps, though this also raises quality and misrepresentation concerns.' },
    { type: 'mc', q: 'Heat maps are effective for showing:', choices: ['Temperature only', 'Density or intensity of phenomena across an area using color gradients', 'Only crime data', 'Building heights'], answer: 'B', explanation: 'Heat maps use color gradients to show density or intensity of any spatial phenomenon: crime hotspots, population density, website click patterns, disease outbreaks, or any continuously varying spatial data.' },
    { type: 'mc', q: 'Qualitative vs. quantitative data on maps requires different symbolization because:', choices: ['They look the same', 'Qualitative data needs categorical symbols (type, color) while quantitative needs ordered symbols (size, gradient)', 'Only quantitative data can be mapped', 'Maps only show qualitative data'], answer: 'B', explanation: 'Qualitative data (land use types, political parties) needs distinct categorical symbols. Quantitative data (population, income) needs ordered/proportional symbols that show magnitude differences.' },
  ],
};

const GEOGRAPHIC_MODELS = {
  'spatial-thinking': {
    name: 'Spatial Interaction Model',
    description: 'The gravity model predicts that interaction between two places is proportional to their populations and inversely proportional to the distance between them. Used to predict trade, migration, and communication flows between places.',
  },
  'physical-geography': {
    name: 'Plate Tectonics Model',
    description: 'Earth\'s lithosphere is divided into plates that move on the asthenosphere. Their interactions at convergent, divergent, and transform boundaries explain earthquakes, volcanoes, mountain building, and the distribution of continents.',
  },
  'human-geography': {
    name: 'Demographic Transition Model',
    description: 'Describes how societies transition from high birth/death rates (Stage 1) through falling death rates (Stage 2), then falling birth rates (Stage 3), to low and stable rates (Stage 4). Some add Stage 5 with population decline.',
  },
  'cultural-geography': {
    name: 'Cultural Diffusion Models',
    description: 'Ideas spread through expansion diffusion (contagious, hierarchical, stimulus) or relocation diffusion. Understanding these patterns explains how innovations, languages, religions, and technologies spread across geographic space.',
  },
  'political-geography': {
    name: 'Heartland-Rimland Theory',
    description: 'Mackinder\'s Heartland Theory (who controls Eastern Europe controls the world) vs. Spykman\'s Rimland Theory (coastal areas are key). These geopolitical models still influence strategic thinking about power and territory.',
  },
  'economic-geography': {
    name: 'Von Thunen\'s Land Use Model',
    description: 'Agricultural land use is organized in concentric rings around a market center: intensive farming (dairy, vegetables) nearest the market, then forests, field crops, and extensive ranching farther out, based on transportation costs and land rent.',
  },
  'environmental-geography': {
    name: 'Tragedy of the Commons Model',
    description: 'Shared resources are overexploited because individuals benefit from personal overuse while degradation costs are shared by all. Solutions include regulation, privatization, or community management (Elinor Ostrom\'s work).',
  },
  'geospatial-technology': {
    name: 'GIS Overlay Analysis Model',
    description: 'Layering multiple geographic datasets to identify relationships and patterns. Combining topography, land use, demographics, and infrastructure layers enables spatial analysis for planning, conservation, and decision-making.',
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
  return { studentId: id, createdAt: new Date().toISOString(), currentUnit: null, assessments: [], skills: {} };
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

function allSkillKeys() {
  const keys = [];
  for (const unit of UNITS) {
    for (const sk of Object.keys(SKILLS[unit])) keys.push(sk);
  }
  return keys;
}

function findSkillUnit(skill) {
  for (const unit of UNITS) {
    if (SKILLS[unit][skill]) return unit;
  }
  return null;
}

// Exercise generation

function generateExercise(skill, count = 5) {
  const bank = QUESTION_BANKS[skill];
  if (!bank) return { error: `No question bank for ${skill}. Valid: ${allSkillKeys().join(', ')}` };
  const unit = findSkillUnit(skill);
  const items = pick(bank, count);
  return {
    type: 'geography',
    skill,
    skillName: SKILLS[unit]?.[skill]?.name || skill,
    unit,
    count: items.length,
    instruction: 'Answer each question. For multiple choice, respond with the letter. For short answer, provide a brief response.',
    items: items.map((item, i) => ({
      number: i + 1, type: item.type, question: item.q, choices: item.choices || null, answer: item.answer, explanation: item.explanation,
    })),
  };
}

function checkAnswer(type, expected, answer) {
  if (type === 'mc') return norm(expected) === norm(answer.charAt(0));
  return norm(answer).includes(norm(expected)) || norm(expected).includes(norm(answer));
}

// Public API

class Geography {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, createdAt: p.createdAt, currentUnit: p.currentUnit, totalAssessments: p.assessments.length };
  }

  setUnit(id, unit) {
    if (!UNITS.includes(unit)) throw new Error(`Unknown unit: ${unit}. Valid: ${UNITS.join(', ')}`);
    const p = loadProfile(id);
    p.currentUnit = unit;
    saveProfile(p);
    return { studentId: id, currentUnit: unit, skills: Object.keys(SKILLS[unit]).map(sk => ({ skill: sk, name: SKILLS[unit][sk].name })) };
  }

  recordAssessment(id, skill, score, total, notes = '') {
    const unit = findSkillUnit(skill);
    if (!unit) throw new Error(`Unknown skill: ${skill}. Valid: ${allSkillKeys().join(', ')}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id);
    const entry = { date: new Date().toISOString(), skill, unit, score, total, notes };
    p.assessments.push(entry);
    if (!p.skills[skill]) p.skills[skill] = { attempts: [] };
    p.skills[skill].attempts.push({ date: entry.date, score, total });
    p.skills[skill].mastery = calcMastery(p.skills[skill].attempts);
    p.skills[skill].label = masteryLabel(p.skills[skill].mastery);
    saveProfile(p);
    return { studentId: id, skill, unit, score: `${score}/${total}`, mastery: p.skills[skill].mastery, label: p.skills[skill].label };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const results = {};
    let mastered = 0, total = 0;
    for (const unit of UNITS) {
      results[unit] = {};
      for (const [sk, info] of Object.entries(SKILLS[unit])) {
        total++;
        const d = p.skills[sk];
        results[unit][sk] = d ? { name: info.name, mastery: d.mastery, label: d.label } : { name: info.name, mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
      }
    }
    const unitSummary = {};
    for (const unit of UNITS) {
      const vals = Object.values(results[unit]);
      const avg = vals.reduce((s, v) => s + v.mastery, 0) / vals.length;
      unitSummary[unit] = { avgMastery: Math.round(avg * 100) / 100, label: masteryLabel(avg) };
    }
    return { studentId: id, currentUnit: p.currentUnit, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, unitSummary, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id);
    const candidates = [];
    const targetUnits = p.currentUnit ? [p.currentUnit] : UNITS;
    for (const unit of targetUnits) {
      for (const [sk, info] of Object.entries(SKILLS[unit])) {
        const d = p.skills[sk];
        const m = d ? d.mastery : 0;
        if (m < MASTERY_THRESHOLD) candidates.push({ skill: sk, name: info.name, unit, mastery: m, label: d ? d.label : 'not-started' });
      }
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, currentUnit: p.currentUnit, next: candidates.slice(0, count) };
  }

  getReport(id) {
    const p = loadProfile(id);
    return { studentId: id, currentUnit: p.currentUnit, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }

  getSkillCatalog() {
    const catalog = {};
    let total = 0;
    for (const unit of UNITS) {
      catalog[unit] = {};
      for (const [sk, info] of Object.entries(SKILLS[unit])) {
        total++;
        catalog[unit][sk] = { name: info.name };
      }
    }
    return { units: UNITS, catalog, totalSkills: total };
  }

  generateExercise(skill, count = 5) { return generateExercise(skill, count); }

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  getModel(unit) {
    if (!GEOGRAPHIC_MODELS[unit]) return { error: `No model for ${unit}. Valid: ${Object.keys(GEOGRAPHIC_MODELS).join(', ')}` };
    return GEOGRAPHIC_MODELS[unit];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: 'All skills proficient! Great work on Geography.', units: UNITS };
    const exercise = generateExercise(target.skill, 5);
    const model = GEOGRAPHIC_MODELS[target.unit] || null;
    return {
      studentId: id, targetSkill: target, exercise, model,
      lessonPlan: {
        review: 'Review previously covered concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.name}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        model: model ? `Apply model: "${model.name}"` : 'Apply geographic analysis to real-world examples',
        connect: 'Connect to real-world geographic patterns and issues',
      },
    };
  }
}

module.exports = Geography;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new Geography();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id] = args;
        if (!id) throw new Error('Usage: start <id>');
        out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        if (skill) { out(api.generateExercise(skill, 5)); }
        else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(api.checkAnswer(type, expected, answer));
        break;
      }
      case 'record': {
        const [, id, skill, sc, tot, ...notes] = args;
        if (!id || !skill || !sc || !tot) throw new Error('Usage: record <id> <skill> <score> <total> [notes]');
        out(api.recordAssessment(id, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { out(api.getSkillCatalog()); break; }
      case 'setUnit': { const [, id, unit] = args; if (!id || !unit) throw new Error('Usage: setUnit <id> <unit>'); out(api.setUnit(id, unit)); break; }
      case 'model': { const [, unit] = args; if (!unit) throw new Error('Usage: model <unit>'); out(api.getModel(unit)); break; }
      case 'students': { out(api.listStudents()); break; }
      default: out({ usage: 'node geography.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','setUnit','model','students'], units: UNITS, skills: allSkillKeys() });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
