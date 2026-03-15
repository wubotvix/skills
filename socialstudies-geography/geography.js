// eClaw Social Studies Geography Interactive Tutor (K-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'socialstudies-geography');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kindergarten': {
    'maps-globes': ['classroom-map', 'globe-basics', 'land-and-water'],
    'cardinal-directions': ['left-right-up-down', 'north-south-east-west'],
    'land-water-features': ['hills-and-mountains', 'rivers-and-lakes', 'islands-and-oceans'],
    'neighborhoods-communities': ['my-neighborhood', 'community-places', 'urban-suburban-rural'],
    'continents-oceans': ['seven-continents', 'five-oceans', 'equator-poles'],
  },
  'grade-1': {
    'maps-globes': ['map-symbols', 'map-key', 'neighborhood-map'],
    'cardinal-directions': ['compass-rose', 'giving-directions', 'map-directions'],
    'land-water-features': ['mountains-valleys', 'rivers-streams', 'deserts-plains'],
    'neighborhoods-communities': ['city-state-country', 'community-helpers-places', 'how-places-change'],
    'continents-oceans': ['continent-locations', 'ocean-locations', 'earth-hemispheres'],
  },
  'grade-2': {
    'maps-globes': ['compass-rose-review', 'simple-grid-maps', 'physical-vs-political'],
    'cardinal-directions': ['intermediate-directions', 'following-map-routes', 'grid-coordinates'],
    'land-water-features': ['plateaus-peninsulas', 'bays-gulfs', 'volcanoes-earthquakes'],
    'neighborhoods-communities': ['urban-suburban-rural-compare', 'community-needs', 'maps-of-communities'],
    'continents-oceans': ['continent-features', 'ocean-facts', 'climate-basics'],
  },
  'grade-3': {
    'map-skills-scale-legend': ['map-scale', 'map-legend', 'measuring-distance'],
    'us-regions': ['northeast', 'southeast', 'midwest', 'southwest', 'west'],
    'world-regions': ['north-america', 'south-america', 'europe', 'africa', 'asia', 'australia-oceania'],
    'climate-zones': ['tropical', 'temperate', 'polar', 'arid'],
    'human-environment-interaction': ['farming-and-land', 'building-communities', 'natural-resources'],
  },
  'grade-4': {
    'map-skills-scale-legend': ['thematic-maps', 'elevation-maps', 'comparing-map-types'],
    'us-regions': ['region-landforms', 'region-climates', 'region-economies'],
    'world-regions': ['world-landforms', 'world-climates', 'world-cultures'],
    'climate-zones': ['climate-and-vegetation', 'weather-vs-climate', 'climate-and-people'],
    'human-environment-interaction': ['resource-use', 'pollution-conservation', 'adapting-to-environment'],
  },
  'grade-5': {
    'map-skills-scale-legend': ['historical-maps', 'map-projections', 'data-maps'],
    'us-regions': ['settlement-patterns', 'westward-expansion-geography', 'regional-conflicts'],
    'world-regions': ['ancient-civilizations-geography', 'trade-route-geography', 'colonial-geography'],
    'climate-zones': ['climate-change-intro', 'extreme-weather', 'climate-and-history'],
    'human-environment-interaction': ['deforestation', 'urbanization-intro', 'water-management'],
  },
  'grade-6': {
    'latitude-longitude': ['coordinate-system', 'finding-coordinates', 'absolute-vs-relative'],
    'physical-geography': ['plate-tectonics', 'weathering-erosion', 'biomes'],
    'human-geography': ['population-density', 'culture-regions', 'economic-systems'],
    'migration-patterns': ['push-pull-factors', 'historical-migrations', 'modern-migration'],
    'urbanization': ['city-growth', 'urban-challenges', 'megacities'],
    'resource-distribution': ['renewable-nonrenewable', 'resource-conflicts', 'global-trade'],
  },
  'grade-7': {
    'latitude-longitude': ['time-zones', 'coordinate-applications', 'gis-basics'],
    'physical-geography': ['ocean-currents', 'mountain-formation', 'river-systems'],
    'human-geography': ['language-religion-spread', 'political-boundaries', 'development-indicators'],
    'migration-patterns': ['refugee-crises', 'urbanization-migration', 'brain-drain'],
    'urbanization': ['urban-planning', 'suburban-sprawl', 'smart-cities'],
    'resource-distribution': ['energy-resources', 'water-scarcity', 'food-production'],
  },
  'grade-8': {
    'latitude-longitude': ['navigation-history', 'map-projection-math', 'remote-sensing'],
    'physical-geography': ['climate-systems', 'natural-hazards', 'ecosystem-services'],
    'human-geography': ['globalization', 'cultural-diffusion', 'geopolitics'],
    'migration-patterns': ['diaspora-communities', 'immigration-policy', 'climate-refugees'],
    'urbanization': ['gentrification', 'infrastructure-systems', 'sustainable-cities'],
    'resource-distribution': ['conflict-minerals', 'oil-geopolitics', 'circular-economy'],
  },
};

const CONTENT_BANKS = {
  'kindergarten': {
    'classroom-map': {
      questions: [
        { q: 'A map is a drawing of a place. What does a map show?', a: 'places', choices: ['places', 'sounds', 'tastes', 'smells'] },
        { q: 'Which shape on a map usually means water?', a: 'blue areas', choices: ['red areas', 'blue areas', 'yellow areas', 'green dots'] },
        { q: 'If you draw your classroom, what would you put on the map?', a: 'desks and doors', choices: ['desks and doors', 'clouds', 'trees', 'animals'] },
        { q: 'A map helps us find our way. True or false?', a: 'true', choices: ['true', 'false'] },
        { q: 'What is the top of a classroom map usually pointing to?', a: 'the front wall', choices: ['the front wall', 'the floor', 'the sky', 'outside'] },
      ],
    },
    'globe-basics': {
      questions: [
        { q: 'A globe is shaped like a ___?', a: 'ball', choices: ['ball', 'box', 'triangle', 'flat circle'] },
        { q: 'A globe shows the whole ___?', a: 'Earth', choices: ['Earth', 'classroom', 'city', 'house'] },
        { q: 'What color is most of the globe?', a: 'blue', choices: ['blue', 'red', 'yellow', 'green'] },
        { q: 'The blue on a globe stands for ___?', a: 'water', choices: ['sky', 'water', 'ice', 'grass'] },
        { q: 'Can you see the whole Earth on a flat map at once?', a: 'yes', choices: ['yes', 'no'] },
      ],
    },
    'land-and-water': {
      questions: [
        { q: 'Which is land — a mountain or an ocean?', a: 'mountain', choices: ['mountain', 'ocean'] },
        { q: 'Which is water — a river or a desert?', a: 'river', choices: ['desert', 'river'] },
        { q: 'Is there more land or water on Earth?', a: 'water', choices: ['land', 'water'] },
        { q: 'Green and brown on a map usually show ___?', a: 'land', choices: ['land', 'water', 'sky', 'roads'] },
        { q: 'Fish live in water. Bears live on ___?', a: 'land', choices: ['land', 'water', 'clouds', 'maps'] },
      ],
    },
    'left-right-up-down': {
      questions: [
        { q: 'You write with your right hand (usually). Which side is your right?', a: 'right side', choices: ['right side', 'left side', 'behind you', 'above you'] },
        { q: 'The sky is ___ you.', a: 'above', choices: ['above', 'below', 'beside', 'behind'] },
        { q: 'The ground is ___ your feet.', a: 'below', choices: ['above', 'below', 'left of', 'right of'] },
        { q: 'If you face the door, the wall behind you is ___ you.', a: 'behind', choices: ['in front of', 'behind', 'above', 'below'] },
        { q: 'Up on a map usually means which direction?', a: 'north', choices: ['north', 'south', 'east', 'west'] },
      ],
    },
    'north-south-east-west': {
      questions: [
        { q: 'The sun rises in the ___?', a: 'east', choices: ['north', 'south', 'east', 'west'] },
        { q: 'The sun sets in the ___?', a: 'west', choices: ['north', 'south', 'east', 'west'] },
        { q: 'On a map, north is usually at the ___?', a: 'top', choices: ['top', 'bottom', 'left', 'right'] },
        { q: 'On a map, south is usually at the ___?', a: 'bottom', choices: ['top', 'bottom', 'left', 'right'] },
        { q: 'How many cardinal directions are there?', a: '4', choices: ['2', '3', '4', '6'] },
      ],
    },
    'hills-and-mountains': {
      questions: [
        { q: 'A mountain is very ___ land.', a: 'high', choices: ['high', 'flat', 'wet', 'small'] },
        { q: 'A hill is like a small ___?', a: 'mountain', choices: ['mountain', 'lake', 'river', 'ocean'] },
        { q: 'The top of a mountain is called the ___?', a: 'peak', choices: ['peak', 'base', 'valley', 'shore'] },
        { q: 'Is a mountain taller than a hill?', a: 'yes', choices: ['yes', 'no'] },
        { q: 'Mountains can have ___ on top when they are very tall.', a: 'snow', choices: ['snow', 'sand', 'grass', 'houses'] },
      ],
    },
    'rivers-and-lakes': {
      questions: [
        { q: 'A river is water that ___?', a: 'flows', choices: ['flows', 'stays still', 'is frozen', 'is underground'] },
        { q: 'A lake has water all around with ___ on every side.', a: 'land', choices: ['land', 'water', 'ice', 'sand'] },
        { q: 'Rivers flow into the ___?', a: 'ocean', choices: ['sky', 'mountain', 'ocean', 'desert'] },
        { q: 'People build towns near rivers for ___?', a: 'water to drink', choices: ['water to drink', 'snow', 'sand', 'rocks'] },
        { q: 'Which is bigger — a pond or a lake?', a: 'lake', choices: ['pond', 'lake'] },
      ],
    },
    'islands-and-oceans': {
      questions: [
        { q: 'An island is land with ___ all around it.', a: 'water', choices: ['water', 'mountains', 'trees', 'roads'] },
        { q: 'An ocean is a very large body of ___?', a: 'water', choices: ['land', 'water', 'sand', 'ice'] },
        { q: 'Hawaii is a group of ___?', a: 'islands', choices: ['mountains', 'islands', 'lakes', 'deserts'] },
        { q: 'How many oceans does Earth have?', a: '5', choices: ['3', '4', '5', '7'] },
        { q: 'Oceans have ___ water, not fresh water.', a: 'salt', choices: ['salt', 'sweet', 'fresh', 'warm'] },
      ],
    },
    'my-neighborhood': {
      questions: [
        { q: 'A neighborhood is the area ___ where you live.', a: 'around', choices: ['around', 'far from', 'above', 'under'] },
        { q: 'Which might you find in a neighborhood?', a: 'houses and stores', choices: ['houses and stores', 'volcanoes', 'glaciers', 'jungles'] },
        { q: 'Neighbors are people who live ___?', a: 'near you', choices: ['near you', 'far away', 'in space', 'underwater'] },
        { q: 'Streets in your neighborhood help people ___?', a: 'travel', choices: ['travel', 'swim', 'fly', 'dig'] },
        { q: 'A map of your neighborhood would show ___?', a: 'streets and buildings', choices: ['streets and buildings', 'other countries', 'the moon', 'the ocean floor'] },
      ],
    },
    'community-places': {
      questions: [
        { q: 'A community is a place where people live, work, and ___?', a: 'play', choices: ['play', 'sleep all day', 'hide', 'fly'] },
        { q: 'Which building helps keep people safe?', a: 'fire station', choices: ['fire station', 'candy store', 'movie theater', 'toy shop'] },
        { q: 'Where do you go to borrow books?', a: 'library', choices: ['library', 'hospital', 'airport', 'farm'] },
        { q: 'A school is an important place in a community because ___?', a: 'children learn there', choices: ['children learn there', 'it has a pool', 'it sells food', 'it has animals'] },
        { q: 'A park in your community is a place to ___?', a: 'play outside', choices: ['play outside', 'buy groceries', 'see a doctor', 'mail a letter'] },
      ],
    },
    'urban-suburban-rural': {
      questions: [
        { q: 'A city with tall buildings and many people is called ___?', a: 'urban', choices: ['urban', 'rural', 'suburban', 'tropical'] },
        { q: 'A farm area with few people is called ___?', a: 'rural', choices: ['urban', 'rural', 'suburban', 'arctic'] },
        { q: 'An area near a city with houses and yards is called ___?', a: 'suburban', choices: ['urban', 'rural', 'suburban', 'coastal'] },
        { q: 'Where would you most likely see a tractor?', a: 'rural area', choices: ['urban area', 'rural area', 'on the ocean', 'in space'] },
        { q: 'Tall buildings called skyscrapers are in ___ areas.', a: 'urban', choices: ['urban', 'rural', 'suburban', 'desert'] },
      ],
    },
    'seven-continents': {
      questions: [
        { q: 'How many continents are there?', a: '7', choices: ['5', '6', '7', '8'] },
        { q: 'Which continent do you live on if you are in the United States?', a: 'North America', choices: ['North America', 'South America', 'Europe', 'Asia'] },
        { q: 'Which is the biggest continent?', a: 'Asia', choices: ['Africa', 'Asia', 'Europe', 'Antarctica'] },
        { q: 'Which continent is the coldest?', a: 'Antarctica', choices: ['Africa', 'Asia', 'Antarctica', 'Australia'] },
        { q: 'Penguins live on which icy continent?', a: 'Antarctica', choices: ['North America', 'Europe', 'Antarctica', 'Australia'] },
      ],
    },
    'five-oceans': {
      questions: [
        { q: 'Which is the biggest ocean?', a: 'Pacific', choices: ['Atlantic', 'Pacific', 'Indian', 'Arctic'] },
        { q: 'Which ocean is the coldest?', a: 'Arctic', choices: ['Atlantic', 'Pacific', 'Indian', 'Arctic'] },
        { q: 'The Atlantic Ocean is between North America and ___?', a: 'Europe', choices: ['Asia', 'Europe', 'Antarctica', 'Australia'] },
        { q: 'How many oceans does Earth have?', a: '5', choices: ['3', '4', '5', '7'] },
        { q: 'Oceans cover most of the Earth. True or false?', a: 'true', choices: ['true', 'false'] },
      ],
    },
    'equator-poles': {
      questions: [
        { q: 'The equator is an imaginary line around the ___ of Earth.', a: 'middle', choices: ['top', 'middle', 'bottom', 'side'] },
        { q: 'The North Pole is at the very ___ of Earth.', a: 'top', choices: ['top', 'bottom', 'middle', 'side'] },
        { q: 'The South Pole is at the very ___ of Earth.', a: 'bottom', choices: ['top', 'bottom', 'middle', 'side'] },
        { q: 'Is it hot or cold near the equator?', a: 'hot', choices: ['hot', 'cold'] },
        { q: 'Is it hot or cold at the poles?', a: 'cold', choices: ['hot', 'cold'] },
      ],
    },
  },
  'grade-3': {
    'map-scale': {
      questions: [
        { q: 'A map scale tells you the ___ between places.', a: 'distance', choices: ['distance', 'color', 'shape', 'name'] },
        { q: 'If 1 inch on a map equals 10 miles, then 3 inches equals ___ miles.', a: '30', choices: ['10', '20', '30', '40'] },
        { q: 'Why do maps need a scale?', a: 'to show real distances', choices: ['to look pretty', 'to show real distances', 'to add color', 'to name places'] },
        { q: 'A small-scale map shows a ___ area.', a: 'large', choices: ['small', 'large', 'tiny', 'flat'] },
        { q: 'A large-scale map shows ___ detail.', a: 'more', choices: ['more', 'less', 'no', 'the same'] },
      ],
    },
    'map-legend': {
      questions: [
        { q: 'A map legend explains what the ___ on a map mean.', a: 'symbols', choices: ['colors', 'symbols', 'edges', 'lines'] },
        { q: 'Another word for map legend is map ___?', a: 'key', choices: ['key', 'lock', 'door', 'scale'] },
        { q: 'A blue line on a map usually means ___?', a: 'river', choices: ['road', 'river', 'border', 'railroad'] },
        { q: 'A star on a map often shows a ___?', a: 'capital city', choices: ['mountain', 'capital city', 'lake', 'park'] },
        { q: 'Why is a map legend important?', a: 'it helps you read the map', choices: ['it makes the map bigger', 'it helps you read the map', 'it adds more land', 'it changes the scale'] },
      ],
    },
    'measuring-distance': {
      questions: [
        { q: 'To measure distance on a map, you use the ___?', a: 'scale', choices: ['legend', 'title', 'scale', 'compass'] },
        { q: 'If 1 cm on a map = 50 km, how far is 2 cm?', a: '100 km', choices: ['50 km', '100 km', '150 km', '200 km'] },
        { q: 'A ruler can help you measure ___ on a map.', a: 'distance', choices: ['temperature', 'distance', 'weight', 'time'] },
        { q: 'Two cities are 4 inches apart on a map. If 1 inch = 25 miles, how far apart are they?', a: '100 miles', choices: ['25 miles', '50 miles', '75 miles', '100 miles'] },
        { q: 'The scale bar on a map is usually at the ___?', a: 'bottom', choices: ['top', 'middle', 'bottom', 'left side'] },
      ],
    },
    'northeast': {
      questions: [
        { q: 'Which state is in the Northeast region?', a: 'New York', choices: ['Texas', 'New York', 'California', 'Florida'] },
        { q: 'The Northeast has cold winters and ___?', a: 'warm summers', choices: ['warm summers', 'no rain', 'hot all year', 'snow all year'] },
        { q: 'Which ocean borders the Northeast?', a: 'Atlantic', choices: ['Pacific', 'Atlantic', 'Indian', 'Arctic'] },
        { q: 'The Northeast is known for its fall ___?', a: 'leaves', choices: ['leaves', 'hurricanes', 'deserts', 'volcanoes'] },
        { q: 'Many of the first US colonies were in the ___?', a: 'Northeast', choices: ['Northeast', 'Southwest', 'Midwest', 'West'] },
      ],
    },
    'southeast': {
      questions: [
        { q: 'Which state is in the Southeast?', a: 'Georgia', choices: ['Ohio', 'Georgia', 'Oregon', 'Maine'] },
        { q: 'The Southeast has a ___ and humid climate.', a: 'warm', choices: ['cold', 'warm', 'dry', 'freezing'] },
        { q: 'Which body of water borders the Southeast to the south?', a: 'Gulf of Mexico', choices: ['Pacific Ocean', 'Gulf of Mexico', 'Great Lakes', 'Arctic Ocean'] },
        { q: 'The Southeast is known for growing ___?', a: 'cotton and tobacco', choices: ['wheat', 'cotton and tobacco', 'apples', 'potatoes'] },
        { q: 'Hurricanes often hit the ___ region.', a: 'Southeast', choices: ['Northeast', 'Midwest', 'Southeast', 'West'] },
      ],
    },
    'midwest': {
      questions: [
        { q: 'Which state is in the Midwest?', a: 'Illinois', choices: ['Florida', 'Illinois', 'Maine', 'Texas'] },
        { q: 'The Midwest is called the ___ of America.', a: 'breadbasket', choices: ['breadbasket', 'playground', 'rooftop', 'backyard'] },
        { q: 'The Midwest has large, flat areas called ___?', a: 'plains', choices: ['mountains', 'islands', 'plains', 'canyons'] },
        { q: 'The Great ___ are in the Midwest.', a: 'Lakes', choices: ['Deserts', 'Mountains', 'Lakes', 'Canyons'] },
        { q: 'Corn and wheat are major ___ in the Midwest.', a: 'crops', choices: ['animals', 'crops', 'minerals', 'rivers'] },
      ],
    },
    'southwest': {
      questions: [
        { q: 'Which state is in the Southwest?', a: 'Arizona', choices: ['Michigan', 'Arizona', 'Virginia', 'Alaska'] },
        { q: 'The Southwest has a ___ and dry climate.', a: 'hot', choices: ['cold', 'hot', 'wet', 'freezing'] },
        { q: 'The Grand Canyon is in the ___ region.', a: 'Southwest', choices: ['Northeast', 'Southeast', 'Midwest', 'Southwest'] },
        { q: 'Deserts are common in the ___?', a: 'Southwest', choices: ['Northeast', 'Southeast', 'Midwest', 'Southwest'] },
        { q: 'Adobe houses in the Southwest are made of ___?', a: 'clay and mud', choices: ['wood', 'ice', 'clay and mud', 'glass'] },
      ],
    },
    'west': {
      questions: [
        { q: 'Which state is in the West region?', a: 'California', choices: ['Alabama', 'Ohio', 'California', 'Maine'] },
        { q: 'The Rocky Mountains are in the ___?', a: 'West', choices: ['Northeast', 'Southeast', 'Midwest', 'West'] },
        { q: 'Which ocean borders the West region?', a: 'Pacific', choices: ['Atlantic', 'Pacific', 'Indian', 'Arctic'] },
        { q: 'The West has many ___ parks like Yellowstone.', a: 'national', choices: ['city', 'national', 'state', 'water'] },
        { q: 'Many people moved West during the ___ Rush.', a: 'Gold', choices: ['Gold', 'Silver', 'Oil', 'Diamond'] },
      ],
    },
    'north-america': {
      questions: [
        { q: 'How many countries are in North America?', a: '3 major countries', choices: ['1', '2', '3 major countries', '10'] },
        { q: 'The three big countries in North America are the US, Canada, and ___?', a: 'Mexico', choices: ['Brazil', 'Mexico', 'Cuba', 'Argentina'] },
        { q: 'The longest river in North America is the ___?', a: 'Mississippi', choices: ['Amazon', 'Nile', 'Mississippi', 'Danube'] },
        { q: 'Which mountain range runs through western North America?', a: 'Rocky Mountains', choices: ['Alps', 'Himalayas', 'Rocky Mountains', 'Andes'] },
        { q: 'The Great Lakes are shared by the US and ___?', a: 'Canada', choices: ['Mexico', 'Canada', 'Cuba', 'Brazil'] },
      ],
    },
    'south-america': {
      questions: [
        { q: 'The largest country in South America is ___?', a: 'Brazil', choices: ['Argentina', 'Brazil', 'Chile', 'Peru'] },
        { q: 'The Amazon ___ is the largest rainforest in the world.', a: 'Rainforest', choices: ['Desert', 'Rainforest', 'Tundra', 'Prairie'] },
        { q: 'The Andes Mountains run along the ___ coast of South America.', a: 'west', choices: ['north', 'south', 'east', 'west'] },
        { q: 'The Amazon River is in ___?', a: 'South America', choices: ['Africa', 'Asia', 'South America', 'Europe'] },
        { q: 'What language do most people in Brazil speak?', a: 'Portuguese', choices: ['Spanish', 'English', 'Portuguese', 'French'] },
      ],
    },
    'europe': {
      questions: [
        { q: 'Europe is connected to which continent?', a: 'Asia', choices: ['Africa', 'Asia', 'North America', 'Australia'] },
        { q: 'The Eiffel Tower is in which European country?', a: 'France', choices: ['Germany', 'Spain', 'France', 'Italy'] },
        { q: 'Which body of water separates Europe from Africa?', a: 'Mediterranean Sea', choices: ['Atlantic Ocean', 'Pacific Ocean', 'Mediterranean Sea', 'Red Sea'] },
        { q: 'Is Europe a large or small continent?', a: 'small', choices: ['the largest', 'large', 'medium', 'small'] },
        { q: 'London is the capital of ___?', a: 'England', choices: ['France', 'England', 'Spain', 'Germany'] },
      ],
    },
    'africa': {
      questions: [
        { q: 'Africa is the ___ largest continent.', a: 'second', choices: ['first', 'second', 'third', 'smallest'] },
        { q: 'The Sahara is the largest ___ in the world.', a: 'desert', choices: ['ocean', 'forest', 'desert', 'mountain'] },
        { q: 'The Nile River is the ___ river in the world.', a: 'longest', choices: ['shortest', 'widest', 'longest', 'coldest'] },
        { q: 'The Sahara Desert is in which part of Africa?', a: 'north', choices: ['north', 'south', 'east', 'west'] },
        { q: 'Africa has many different animals. Which lives there?', a: 'elephant', choices: ['polar bear', 'penguin', 'elephant', 'moose'] },
      ],
    },
    'asia': {
      questions: [
        { q: 'Asia is the ___ continent.', a: 'largest', choices: ['smallest', 'second largest', 'largest', 'coldest'] },
        { q: 'The Great Wall is in which Asian country?', a: 'China', choices: ['Japan', 'India', 'China', 'Korea'] },
        { q: 'Mount Everest, the tallest mountain, is in ___?', a: 'Asia', choices: ['Africa', 'Europe', 'Asia', 'South America'] },
        { q: 'Which ocean is east of Asia?', a: 'Pacific', choices: ['Atlantic', 'Pacific', 'Indian', 'Arctic'] },
        { q: 'Asia has more ___ than any other continent.', a: 'people', choices: ['deserts', 'people', 'islands', 'rivers'] },
      ],
    },
    'australia-oceania': {
      questions: [
        { q: 'Australia is both a continent and a ___?', a: 'country', choices: ['city', 'country', 'state', 'ocean'] },
        { q: 'Australia is known for which unique animal?', a: 'kangaroo', choices: ['elephant', 'kangaroo', 'penguin', 'bear'] },
        { q: 'The Great Barrier Reef is near ___?', a: 'Australia', choices: ['Africa', 'Europe', 'Australia', 'Asia'] },
        { q: 'Which ocean surrounds Australia?', a: 'Pacific and Indian', choices: ['Atlantic', 'Arctic', 'Pacific and Indian', 'Mediterranean'] },
        { q: 'Australia is in the ___ hemisphere.', a: 'southern', choices: ['northern', 'southern', 'eastern', 'western'] },
      ],
    },
    'tropical': {
      questions: [
        { q: 'Tropical climates are near the ___?', a: 'equator', choices: ['North Pole', 'South Pole', 'equator', 'mountains'] },
        { q: 'Tropical areas are usually ___?', a: 'hot and wet', choices: ['cold and dry', 'hot and wet', 'cool and breezy', 'freezing'] },
        { q: 'A rainforest has a ___ climate.', a: 'tropical', choices: ['polar', 'tropical', 'arid', 'temperate'] },
        { q: 'Which animal might live in a tropical area?', a: 'parrot', choices: ['polar bear', 'parrot', 'penguin', 'walrus'] },
        { q: 'Tropical areas get a lot of ___?', a: 'rain', choices: ['snow', 'rain', 'ice', 'frost'] },
      ],
    },
    'temperate': {
      questions: [
        { q: 'Temperate climates have ___ seasons.', a: 'four', choices: ['one', 'two', 'three', 'four'] },
        { q: 'Temperate means the weather is not too hot and not too ___?', a: 'cold', choices: ['cold', 'wet', 'windy', 'sunny'] },
        { q: 'Most of the United States has a ___ climate.', a: 'temperate', choices: ['tropical', 'polar', 'temperate', 'arid'] },
        { q: 'In a temperate climate, trees may lose their leaves in ___?', a: 'fall', choices: ['spring', 'summer', 'fall', 'never'] },
        { q: 'Temperate zones are between the tropics and the ___?', a: 'polar regions', choices: ['equator', 'polar regions', 'oceans', 'deserts'] },
      ],
    },
    'polar': {
      questions: [
        { q: 'Polar climates are found near the ___?', a: 'poles', choices: ['equator', 'tropics', 'poles', 'deserts'] },
        { q: 'Polar areas are very ___?', a: 'cold', choices: ['hot', 'warm', 'cold', 'wet'] },
        { q: 'Which animal lives in a polar climate?', a: 'polar bear', choices: ['parrot', 'monkey', 'polar bear', 'lizard'] },
        { q: 'Antarctica has a ___ climate.', a: 'polar', choices: ['tropical', 'temperate', 'arid', 'polar'] },
        { q: 'Polar areas have ice and ___?', a: 'snow', choices: ['sand', 'rainforest', 'snow', 'palm trees'] },
      ],
    },
    'arid': {
      questions: [
        { q: 'Arid means very ___?', a: 'dry', choices: ['wet', 'cold', 'dry', 'windy'] },
        { q: 'A desert has an ___ climate.', a: 'arid', choices: ['tropical', 'polar', 'temperate', 'arid'] },
        { q: 'Arid areas get very little ___?', a: 'rain', choices: ['sun', 'rain', 'wind', 'heat'] },
        { q: 'Which plant survives in arid climates?', a: 'cactus', choices: ['oak tree', 'cactus', 'fern', 'lily pad'] },
        { q: 'The Sahara Desert has an ___ climate.', a: 'arid', choices: ['polar', 'tropical', 'temperate', 'arid'] },
      ],
    },
    'farming-and-land': {
      questions: [
        { q: 'Farmers change the land by ___?', a: 'planting crops', choices: ['planting crops', 'building mountains', 'making oceans', 'creating deserts'] },
        { q: 'Irrigation brings ___ to crops.', a: 'water', choices: ['soil', 'water', 'seeds', 'sunlight'] },
        { q: 'Cutting down trees to make farmland is called ___?', a: 'deforestation', choices: ['irrigation', 'deforestation', 'pollution', 'erosion'] },
        { q: 'Farmers depend on good ___ and rain.', a: 'soil', choices: ['roads', 'soil', 'buildings', 'maps'] },
        { q: 'People grow food that fits their ___?', a: 'climate', choices: ['language', 'climate', 'clothing', 'music'] },
      ],
    },
    'building-communities': {
      questions: [
        { q: 'People build communities near water because ___?', a: 'they need water to live', choices: ['they like to swim', 'they need water to live', 'water is pretty', 'water is blue'] },
        { q: 'Roads and bridges are built to help people ___?', a: 'travel', choices: ['travel', 'sleep', 'eat', 'play'] },
        { q: 'When people build a city, they change the ___?', a: 'environment', choices: ['weather', 'ocean', 'environment', 'sun'] },
        { q: 'Dams are built across ___ to control water.', a: 'rivers', choices: ['mountains', 'rivers', 'deserts', 'roads'] },
        { q: 'Communities need ___ to build houses and buildings.', a: 'resources', choices: ['resources', 'pets', 'games', 'holidays'] },
      ],
    },
    'natural-resources': {
      questions: [
        { q: 'Things from nature that people use are called ___?', a: 'natural resources', choices: ['natural resources', 'inventions', 'buildings', 'machines'] },
        { q: 'Water, trees, and soil are all ___?', a: 'natural resources', choices: ['man-made things', 'natural resources', 'buildings', 'tools'] },
        { q: 'A resource that can be replaced is called ___?', a: 'renewable', choices: ['renewable', 'nonrenewable', 'extinct', 'expensive'] },
        { q: 'Oil and coal are ___ resources.', a: 'nonrenewable', choices: ['renewable', 'nonrenewable', 'unlimited', 'free'] },
        { q: 'Trees are renewable because they can ___?', a: 'grow back', choices: ['grow back', 'turn to stone', 'disappear', 'freeze'] },
      ],
    },
  },
  'grade-6': {
    'coordinate-system': {
      questions: [
        { q: 'Lines of latitude run ___?', a: 'east to west', choices: ['north to south', 'east to west', 'diagonally', 'in circles'] },
        { q: 'Lines of longitude run ___?', a: 'north to south', choices: ['north to south', 'east to west', 'diagonally', 'in circles'] },
        { q: 'The equator is at ___ degrees latitude.', a: '0', choices: ['0', '45', '90', '180'] },
        { q: 'The Prime Meridian is at ___ degrees longitude.', a: '0', choices: ['0', '45', '90', '180'] },
        { q: 'Latitude and longitude together give a ___?', a: 'precise location', choices: ['general area', 'precise location', 'direction', 'distance'] },
      ],
    },
    'finding-coordinates': {
      questions: [
        { q: 'What are the approximate coordinates of the North Pole?', a: '90N, 0', choices: ['0, 0', '90N, 0', '90S, 0', '0, 90E'] },
        { q: 'A location at 0 latitude, 0 longitude is in the ___?', a: 'Gulf of Guinea (Atlantic Ocean)', choices: ['Pacific Ocean', 'Gulf of Guinea (Atlantic Ocean)', 'Indian Ocean', 'Arctic Ocean'] },
        { q: 'New York City is approximately at 40N, 74W. Is it in the Northern or Southern Hemisphere?', a: 'Northern', choices: ['Northern', 'Southern', 'Eastern', 'Western'] },
        { q: 'Coordinates south of the equator have ___ latitude.', a: 'south (S)', choices: ['north (N)', 'south (S)', 'east (E)', 'west (W)'] },
        { q: 'Coordinates west of the Prime Meridian have ___ longitude.', a: 'west (W)', choices: ['north (N)', 'south (S)', 'east (E)', 'west (W)'] },
      ],
    },
    'absolute-vs-relative': {
      questions: [
        { q: 'An absolute location uses ___?', a: 'coordinates', choices: ['landmarks', 'coordinates', 'descriptions', 'directions'] },
        { q: '"Next to the library" is a ___ location.', a: 'relative', choices: ['absolute', 'relative', 'coordinate', 'exact'] },
        { q: '40.7N, 74W is an ___ location for New York City.', a: 'absolute', choices: ['absolute', 'relative', 'approximate', 'general'] },
        { q: '"South of Canada" describes the US using ___ location.', a: 'relative', choices: ['absolute', 'relative', 'coordinate', 'GPS'] },
        { q: 'Which is more precise — absolute or relative location?', a: 'absolute', choices: ['absolute', 'relative', 'both are equal', 'neither'] },
      ],
    },
    'plate-tectonics': {
      questions: [
        { q: 'Earth\'s surface is broken into large pieces called ___?', a: 'tectonic plates', choices: ['continents', 'tectonic plates', 'biomes', 'layers'] },
        { q: 'When plates collide, they can form ___?', a: 'mountains', choices: ['oceans', 'deserts', 'mountains', 'plains'] },
        { q: 'Earthquakes happen at plate ___?', a: 'boundaries', choices: ['centers', 'boundaries', 'surfaces', 'cores'] },
        { q: 'The Ring of Fire is a zone of ___ around the Pacific Ocean.', a: 'volcanoes and earthquakes', choices: ['calm weather', 'volcanoes and earthquakes', 'deep trenches only', 'coral reefs'] },
        { q: 'Plates move a few ___ per year.', a: 'centimeters', choices: ['meters', 'centimeters', 'kilometers', 'miles'] },
      ],
    },
    'weathering-erosion': {
      questions: [
        { q: 'Weathering is the breaking down of ___?', a: 'rock', choices: ['water', 'air', 'rock', 'plants'] },
        { q: 'Erosion is the ___ of weathered material.', a: 'movement', choices: ['creation', 'movement', 'freezing', 'coloring'] },
        { q: 'The Grand Canyon was formed mainly by ___?', a: 'water erosion', choices: ['wind', 'water erosion', 'earthquakes', 'volcanoes'] },
        { q: 'Glaciers cause erosion by ___ across the land.', a: 'sliding', choices: ['melting', 'sliding', 'evaporating', 'freezing'] },
        { q: 'Deltas form where rivers ___ sediment.', a: 'deposit', choices: ['erode', 'deposit', 'freeze', 'evaporate'] },
      ],
    },
    'biomes': {
      questions: [
        { q: 'A biome is a large area with similar ___ and animals.', a: 'climate, plants', choices: ['climate, plants', 'cities', 'languages', 'governments'] },
        { q: 'The tundra biome is very ___?', a: 'cold and treeless', choices: ['hot and dry', 'cold and treeless', 'warm and wet', 'mild and green'] },
        { q: 'A tropical rainforest has the most ___?', a: 'biodiversity', choices: ['snow', 'biodiversity', 'deserts', 'ice'] },
        { q: 'Grasslands are also called ___?', a: 'prairies or savannas', choices: ['tundra', 'prairies or savannas', 'wetlands', 'forests'] },
        { q: 'Which biome has the most trees?', a: 'forest', choices: ['desert', 'tundra', 'forest', 'grassland'] },
      ],
    },
    'population-density': {
      questions: [
        { q: 'Population density measures how many people live in a given ___?', a: 'area', choices: ['country', 'area', 'building', 'city'] },
        { q: 'A crowded city has ___ population density.', a: 'high', choices: ['low', 'medium', 'high', 'zero'] },
        { q: 'Rural areas usually have ___ population density.', a: 'low', choices: ['low', 'medium', 'high', 'extreme'] },
        { q: 'Which continent has the highest population?', a: 'Asia', choices: ['Europe', 'Asia', 'Africa', 'North America'] },
        { q: 'People tend to settle near ___ and coastlines.', a: 'rivers', choices: ['mountains', 'deserts', 'rivers', 'volcanoes'] },
      ],
    },
    'culture-regions': {
      questions: [
        { q: 'A culture region is an area where people share similar ___?', a: 'traditions and language', choices: ['weather', 'traditions and language', 'elevation', 'soil type'] },
        { q: 'Latin America is a cultural region because most people speak ___?', a: 'Spanish or Portuguese', choices: ['English', 'French', 'Spanish or Portuguese', 'Arabic'] },
        { q: 'The Middle East is a cultural region partly defined by ___?', a: 'religion and language', choices: ['climate only', 'religion and language', 'mountains', 'rivers'] },
        { q: 'Culture includes language, religion, food, and ___?', a: 'customs', choices: ['weather', 'rocks', 'customs', 'latitude'] },
        { q: 'Political boundaries and cultural regions are always the same. True or false?', a: 'false', choices: ['true', 'false'] },
      ],
    },
    'economic-systems': {
      questions: [
        { q: 'In a market economy, ___ decide what to produce.', a: 'businesses and consumers', choices: ['the government', 'businesses and consumers', 'the military', 'farmers only'] },
        { q: 'In a command economy, the ___ controls production.', a: 'government', choices: ['people', 'government', 'market', 'businesses'] },
        { q: 'Most countries today have a ___ economy.', a: 'mixed', choices: ['pure market', 'pure command', 'mixed', 'traditional'] },
        { q: 'A traditional economy is based on ___?', a: 'customs and history', choices: ['technology', 'customs and history', 'factories', 'banking'] },
        { q: 'Trade happens when countries exchange ___?', a: 'goods and services', choices: ['borders', 'languages', 'goods and services', 'governments'] },
      ],
    },
    'push-pull-factors': {
      questions: [
        { q: 'A push factor makes people want to ___ a place.', a: 'leave', choices: ['stay in', 'leave', 'visit', 'build'] },
        { q: 'A pull factor ___ people to a new place.', a: 'attracts', choices: ['pushes', 'attracts', 'traps', 'removes'] },
        { q: 'War is an example of a ___ factor.', a: 'push', choices: ['push', 'pull', 'neutral', 'economic'] },
        { q: 'Job opportunities are an example of a ___ factor.', a: 'pull', choices: ['push', 'pull', 'neutral', 'social'] },
        { q: 'Famine (no food) would be a ___ factor.', a: 'push', choices: ['push', 'pull', 'neutral', 'natural'] },
      ],
    },
    'historical-migrations': {
      questions: [
        { q: 'Early humans migrated out of ___ to other continents.', a: 'Africa', choices: ['Europe', 'Asia', 'Africa', 'North America'] },
        { q: 'The Great Migration in the US was when African Americans moved from the ___ to the ___.', a: 'South to the North', choices: ['North to the South', 'South to the North', 'East to the West', 'West to the East'] },
        { q: 'The Silk Road facilitated movement of ___ and ideas.', a: 'goods', choices: ['armies only', 'goods', 'water', 'animals only'] },
        { q: 'European colonization caused massive migration to ___?', a: 'the Americas', choices: ['Asia', 'the Americas', 'Antarctica', 'the Middle East'] },
        { q: 'The Irish Potato Famine caused migration to ___?', a: 'the United States', choices: ['Africa', 'the United States', 'Australia only', 'Asia'] },
      ],
    },
    'modern-migration': {
      questions: [
        { q: 'Today, people often migrate for better ___?', a: 'jobs and education', choices: ['weather only', 'jobs and education', 'scenery', 'food'] },
        { q: 'A refugee is someone who flees their country because of ___?', a: 'danger or persecution', choices: ['boredom', 'vacation', 'danger or persecution', 'curiosity'] },
        { q: 'Urbanization means people moving to ___?', a: 'cities', choices: ['farms', 'cities', 'islands', 'mountains'] },
        { q: 'Remittances are money sent by migrants back to their ___?', a: 'home country', choices: ['home country', 'new country', 'bank', 'employer'] },
        { q: 'Climate change may cause more migration because of ___?', a: 'rising seas and drought', choices: ['better weather', 'rising seas and drought', 'more jobs', 'new technology'] },
      ],
    },
    'city-growth': {
      questions: [
        { q: 'Urbanization is the growth of ___?', a: 'cities', choices: ['farms', 'forests', 'cities', 'deserts'] },
        { q: 'Cities often grow near rivers because rivers provide ___?', a: 'water and transportation', choices: ['entertainment', 'water and transportation', 'decoration', 'shade'] },
        { q: 'The Industrial Revolution caused rapid city growth because of ___?', a: 'factory jobs', choices: ['farming', 'factory jobs', 'tourism', 'mining only'] },
        { q: 'More than half the world\'s population now lives in ___?', a: 'cities', choices: ['rural areas', 'cities', 'suburbs', 'islands'] },
        { q: 'Infrastructure means ___?', a: 'roads, bridges, and systems that support a city', choices: ['buildings only', 'roads, bridges, and systems that support a city', 'parks', 'population'] },
      ],
    },
    'urban-challenges': {
      questions: [
        { q: 'One challenge of cities is ___?', a: 'overcrowding', choices: ['too few people', 'overcrowding', 'too much farmland', 'too many trees'] },
        { q: 'Air pollution in cities comes mainly from ___?', a: 'vehicles and factories', choices: ['trees', 'vehicles and factories', 'rivers', 'farms'] },
        { q: 'A slum is an area of a city with ___?', a: 'poor housing conditions', choices: ['wealthy homes', 'poor housing conditions', 'many parks', 'clean water'] },
        { q: 'Traffic congestion is a problem in cities because of ___?', a: 'too many vehicles', choices: ['too few roads', 'too many vehicles', 'too much rain', 'too many parks'] },
        { q: 'Public transportation helps cities by reducing ___?', a: 'traffic and pollution', choices: ['population', 'traffic and pollution', 'buildings', 'jobs'] },
      ],
    },
    'megacities': {
      questions: [
        { q: 'A megacity has a population of more than ___ million.', a: '10', choices: ['1', '5', '10', '50'] },
        { q: 'Tokyo, Japan is one of the world\'s largest ___?', a: 'megacities', choices: ['villages', 'megacities', 'islands', 'deserts'] },
        { q: 'Most megacities are in ___ and Africa.', a: 'Asia', choices: ['Europe', 'Asia', 'North America', 'Antarctica'] },
        { q: 'Megacities face challenges like pollution and ___?', a: 'housing shortages', choices: ['too much space', 'housing shortages', 'too few people', 'too many parks'] },
        { q: 'The number of megacities is ___ over time.', a: 'increasing', choices: ['decreasing', 'staying the same', 'increasing', 'disappearing'] },
      ],
    },
    'renewable-nonrenewable': {
      questions: [
        { q: 'Solar energy is a ___ resource.', a: 'renewable', choices: ['renewable', 'nonrenewable', 'limited', 'fossil'] },
        { q: 'Coal is a ___ resource.', a: 'nonrenewable', choices: ['renewable', 'nonrenewable', 'unlimited', 'solar'] },
        { q: 'Wind power is ___?', a: 'renewable', choices: ['renewable', 'nonrenewable', 'fossil fuel', 'nuclear'] },
        { q: 'Fossil fuels take ___ of years to form.', a: 'millions', choices: ['tens', 'hundreds', 'thousands', 'millions'] },
        { q: 'Water used for hydroelectric power is ___?', a: 'renewable', choices: ['renewable', 'nonrenewable', 'fossil', 'nuclear'] },
      ],
    },
    'resource-conflicts': {
      questions: [
        { q: 'Countries sometimes fight over ___?', a: 'oil and water', choices: ['music', 'oil and water', 'sports', 'art'] },
        { q: 'The Middle East has conflicts partly because of its ___?', a: 'oil reserves', choices: ['forests', 'oil reserves', 'mountains', 'rivers'] },
        { q: 'Water scarcity can cause ___ between countries.', a: 'conflict', choices: ['peace', 'conflict', 'trade', 'tourism'] },
        { q: 'Blood diamonds are diamonds mined in ___?', a: 'war zones', choices: ['peace zones', 'war zones', 'oceans', 'cities'] },
        { q: 'Sharing resources through trade can help prevent ___?', a: 'conflict', choices: ['growth', 'conflict', 'development', 'education'] },
      ],
    },
    'global-trade': {
      questions: [
        { q: 'Countries trade because no country has ___?', a: 'all the resources it needs', choices: ['enough people', 'all the resources it needs', 'enough land', 'enough water'] },
        { q: 'An export is a good ___ to another country.', a: 'sold', choices: ['bought from', 'sold', 'stolen from', 'given by'] },
        { q: 'An import is a good ___ from another country.', a: 'bought', choices: ['sold to', 'bought', 'made in', 'destroyed by'] },
        { q: 'Container ships transport goods across ___?', a: 'oceans', choices: ['deserts', 'mountains', 'oceans', 'forests'] },
        { q: 'Globalization means countries are becoming more ___?', a: 'connected', choices: ['isolated', 'connected', 'separate', 'independent'] },
      ],
    },
  },
};

const READING_PASSAGES = {
  'kindergarten': [
    { title: 'Our Neighborhood', focus: 'community places', text: 'We live in a neighborhood. There are houses and a park. The store is on the corner. We walk to school on the sidewalk. Our neighborhood is a nice place to live!' },
    { title: 'Land and Water', focus: 'physical features', text: 'Earth has land and water. Mountains are tall land. Rivers are flowing water. Lakes have water with land all around. The ocean is very big water. Land and water are everywhere!' },
    { title: 'The Seven Continents', focus: 'continents', text: 'Earth has seven continents. We live on North America. Africa has lions and giraffes. Antarctica is very cold with penguins. Asia is the biggest continent. Every continent is special!' },
  ],
  'grade-3': [
    { title: 'The US Regions', focus: 'US regions', text: 'The United States has five regions. The Northeast has big cities and cold winters. The Southeast is warm and humid. The Midwest is flat with rich farmland. The Southwest has deserts and canyons. The West has tall mountains and the Pacific Ocean. Each region is different and special.' },
    { title: 'Climate Zones', focus: 'climate', text: 'Earth has different climate zones. Near the equator it is tropical — hot and rainy. In the middle areas it is temperate — not too hot, not too cold. Near the poles it is polar — very cold with ice and snow. Deserts are arid — hot and dry. Climate affects how people live, what they eat, and what they wear.' },
    { title: 'Natural Resources', focus: 'resources', text: 'Natural resources are things from nature that people use. Water, trees, and soil are natural resources. Some resources like trees are renewable — they can grow back. Other resources like oil and coal are nonrenewable — once they are used up, they are gone. We must take care of our natural resources.' },
  ],
  'grade-6': [
    { title: 'Latitude and Longitude', focus: 'coordinates', text: 'Every place on Earth can be found using two numbers: latitude and longitude. Latitude lines run east to west and measure how far north or south you are from the equator. Longitude lines run north to south and measure how far east or west you are from the Prime Meridian. Together, they create a grid that gives every place a unique address. Sailors and explorers used this system for centuries to navigate the seas.' },
    { title: 'Push and Pull', focus: 'migration', text: 'People move for many reasons. Push factors drive people away from a place — war, famine, or lack of jobs. Pull factors attract people to a new place — safety, opportunity, or freedom. Throughout history, millions have migrated seeking better lives. The Great Migration saw African Americans move from the rural South to northern cities. Today, refugees flee conflict zones, and workers cross borders for employment. Migration shapes every country on Earth.' },
    { title: 'Urbanization', focus: 'cities', text: 'For the first time in history, more people live in cities than in rural areas. Cities grow because they offer jobs, education, and services. But rapid urbanization brings challenges: overcrowding, pollution, traffic, and housing shortages. Megacities like Tokyo, Delhi, and Sao Paulo have populations over 10 million. City planners work to build sustainable cities with public transport, green spaces, and clean energy. The future of humanity is urban.' },
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

function resolveSkillKey(grade, skill) {
  const gs = SKILLS[grade];
  if (!gs) return null;
  for (const [cat, skills] of Object.entries(gs)) { if (skills.includes(skill)) return { grade, category: cat, skill }; }
  return null;
}

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

// Exercise generation

function exResult(type, skill, grade, instruction, items) { return { type, skill, grade, count: items.length, instruction, items }; }

function generateExercise(grade, skill, count = 5) {
  const bank = CONTENT_BANKS[grade]?.[skill];
  if (!bank) return { error: `No content bank for ${grade}/${skill}` };

  if (bank.questions) {
    return exResult('multiple-choice', skill, grade, 'Choose the best answer.',
      pick(bank.questions, count).map(q => ({ prompt: q.q, answer: q.a, choices: q.choices })));
  }

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected))
    return expected.some(r => norm(r) === norm(answer));
  return norm(expected) === norm(answer);
}

// Public API

class Geography {
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
    const grade = p.grade || 'kindergarten';
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
    const grade = p.grade || 'kindergarten';
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

  getReadingPassage(grade) {
    const passages = READING_PASSAGES[grade];
    if (!passages) return { error: `No reading passages for ${grade}. Available: ${Object.keys(READING_PASSAGES).join(', ')}` };
    return pick(passages, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'kindergarten';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const passage = READING_PASSAGES[grade] ? pick(READING_PASSAGES[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, readingPassage: passage,
      lessonPlan: {
        review: 'Review previously learned geography concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} — ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: passage ? `Read and discuss: "${passage.title}"` : 'Discuss how this topic connects to real places',
        explore: `Find a real-world example of ${target.skill} on a map or globe`,
      },
    };
  }
}

module.exports = Geography;

// CLI: node geography.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const geo = new Geography();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) geo.setGrade(id, grade);
        out({ action: 'start', profile: geo.getProfile(id), nextSkills: geo.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(geo.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, type] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'kindergarten';
        if (type) { out(geo.generateExercise(grade, type, 5)); }
        else { const n = geo.getNextSkills(id, 1).next; out(n.length ? geo.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current grade!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(geo.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(geo.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(geo.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(geo.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(geo.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? geo.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(geo.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(geo.setGrade(id, g)); break; }
      case 'passage': { const [, g] = args; if (!g) throw new Error('Usage: passage <grade>'); out(geo.getReadingPassage(g)); break; }
      default: out({ usage: 'node geography.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','passage'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
