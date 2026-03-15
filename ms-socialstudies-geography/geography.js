// MS Social Studies Geography Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-socialstudies-geography');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  "grade-6": {
    "map-skills": [
      "map-projections",
      "thematic-maps",
      "scale-distance",
      "latitude-longitude"
    ],
    "five-themes": [
      "location",
      "place",
      "human-environment-interaction",
      "movement",
      "region"
    ],
    "physical-geography": [
      "landforms",
      "climate-zones",
      "ecosystems",
      "water-cycle"
    ]
  },
  "grade-7": {
    "population": [
      "population-distribution",
      "demographics",
      "push-pull-factors",
      "urbanization"
    ],
    "culture": [
      "cultural-diffusion",
      "culture-regions",
      "religion-language",
      "cultural-conflict"
    ],
    "economic-geography": [
      "resources-distribution",
      "development-levels",
      "trade-patterns"
    ]
  },
  "grade-8": {
    "geopolitics": [
      "borders-boundaries",
      "international-organizations",
      "conflict-cooperation",
      "sovereignty"
    ],
    "globalization": [
      "global-connections",
      "cultural-exchange",
      "economic-interdependence"
    ],
    "environmental": [
      "climate-change-geography",
      "resource-management",
      "sustainability",
      "natural-hazards"
    ]
  }
};

const CONTENT_BANKS = {
  "grade-6": {
    "map-projections": {
      "questions": [
        {
          "q": "Why do all flat maps distort the Earth?",
          "a": "because you cannot perfectly represent a 3D sphere on a 2D surface",
          "alts": [
            "sphere cant be flat without distortion"
          ]
        },
        {
          "q": "What does the Mercator projection distort?",
          "a": "the size of areas near the poles, making them appear much larger than they are",
          "alts": [
            "size near poles"
          ]
        },
        {
          "q": "What is an equal-area projection?",
          "a": "a map projection that preserves the relative sizes of areas",
          "alts": [
            "preserves area sizes"
          ]
        },
        {
          "q": "Why is Greenland so large on a Mercator map?",
          "a": "the Mercator projection stretches areas near the poles, exaggerating their size",
          "alts": [
            "stretched near poles"
          ]
        },
        {
          "q": "What projection is best for navigating?",
          "a": "Mercator, because straight lines represent constant compass bearings",
          "alts": [
            "mercator"
          ]
        },
        {
          "q": "What trade-offs do all map projections face?",
          "a": "they cannot preserve shape, size, distance, and direction all at once",
          "alts": [
            "cant preserve everything"
          ]
        }
      ]
    },
    "thematic-maps": {
      "questions": [
        {
          "q": "What is a thematic map?",
          "a": "a map that shows a specific theme or topic, like population, climate, or resources",
          "alts": [
            "map showing specific theme"
          ]
        },
        {
          "q": "What does a choropleth map show?",
          "a": "data using different colors or shading to represent values in different areas",
          "alts": [
            "colors for data values"
          ]
        },
        {
          "q": "Name three types of thematic maps.",
          "a": "population density, climate, natural resources, political, economic, or land use maps",
          "alts": [
            "population climate resource"
          ]
        },
        {
          "q": "How do you read the legend of a thematic map?",
          "a": "match the colors or symbols on the map to the values or categories in the legend",
          "alts": [
            "match colors to values"
          ]
        },
        {
          "q": "What is a dot density map?",
          "a": "a map using dots to show the distribution and density of something",
          "alts": [
            "dots show distribution"
          ]
        },
        {
          "q": "What is a flow map?",
          "a": "a map using arrows to show movement of people, goods, or ideas",
          "alts": [
            "arrows show movement"
          ]
        }
      ]
    },
    "scale-distance": {
      "questions": [
        {
          "q": "What is map scale?",
          "a": "the ratio between distance on the map and actual distance on Earth",
          "alts": [
            "ratio of map to real distance"
          ]
        },
        {
          "q": "A map scale is 1:100,000. 1 cm on the map equals how many km?",
          "a": "1 km",
          "alts": [
            "1"
          ]
        },
        {
          "q": "A large-scale map shows a ___ area with ___ detail.",
          "a": "small area with more detail",
          "alts": [
            "small more"
          ]
        },
        {
          "q": "A small-scale map shows a ___ area with ___ detail.",
          "a": "large area with less detail",
          "alts": [
            "large less"
          ]
        },
        {
          "q": "How do you calculate real distance using a map scale bar?",
          "a": "measure the distance on the map and multiply by the scale factor",
          "alts": [
            "measure and multiply"
          ]
        },
        {
          "q": "Which has a larger scale: a map of your neighborhood or a map of the world?",
          "a": "the neighborhood map",
          "alts": [
            "neighborhood"
          ]
        }
      ]
    },
    "latitude-longitude": {
      "questions": [
        {
          "q": "What is latitude?",
          "a": "imaginary lines running east-west that measure distance north or south of the equator",
          "alts": [
            "east-west lines measuring north-south"
          ]
        },
        {
          "q": "What is longitude?",
          "a": "imaginary lines running north-south that measure distance east or west of the Prime Meridian",
          "alts": [
            "north-south lines measuring east-west"
          ]
        },
        {
          "q": "What is the latitude of the equator?",
          "a": "0 degrees",
          "alts": [
            "0"
          ]
        },
        {
          "q": "What is the longitude of the Prime Meridian?",
          "a": "0 degrees",
          "alts": [
            "0"
          ]
        },
        {
          "q": "What continent is at approximately 0 latitude, 0 longitude?",
          "a": "Africa (Gulf of Guinea)",
          "alts": [
            "africa"
          ]
        },
        {
          "q": "What is absolute location?",
          "a": "the exact position of a place on Earth using coordinates like latitude and longitude",
          "alts": [
            "exact position using coordinates"
          ]
        }
      ]
    },
    "location": {
      "questions": [
        {
          "q": "What is the difference between absolute and relative location?",
          "a": "absolute is exact coordinates; relative is described in relation to other places",
          "alts": [
            "coordinates vs relation to places"
          ]
        },
        {
          "q": "Give an example of relative location.",
          "a": "The school is two blocks north of the park.",
          "alts": [
            "next to",
            "near",
            "between"
          ]
        },
        {
          "q": "Why is location the most basic theme of geography?",
          "a": "every geographic question starts with asking where something is",
          "alts": [
            "where is fundamental"
          ]
        },
        {
          "q": "How can two places have the same relative location but different absolute locations?",
          "a": "a town can be \"near the coast\" in both California and Florida",
          "alts": [
            "same description different coordinates"
          ]
        },
        {
          "q": "What tools help determine absolute location?",
          "a": "GPS, maps with coordinate systems, and globes",
          "alts": [
            "gps maps globes"
          ]
        },
        {
          "q": "Why does location matter for understanding events?",
          "a": "where something happens affects why and how it happens",
          "alts": [
            "where affects why and how"
          ]
        }
      ]
    },
    "place": {
      "questions": [
        {
          "q": "What does \"place\" mean in geography?",
          "a": "the physical and human characteristics that make a location unique",
          "alts": [
            "what makes a location unique"
          ]
        },
        {
          "q": "Name two physical characteristics of a place.",
          "a": "climate, landforms, soil, vegetation, water features",
          "alts": [
            "climate landforms"
          ]
        },
        {
          "q": "Name two human characteristics of a place.",
          "a": "language, religion, architecture, population, economy",
          "alts": [
            "language religion"
          ]
        },
        {
          "q": "How is \"place\" different from \"location\"?",
          "a": "location tells WHERE; place tells WHAT IT IS LIKE there",
          "alts": [
            "where vs what its like"
          ]
        },
        {
          "q": "How does a sense of place develop?",
          "a": "through personal experiences, memories, and cultural connections to a location",
          "alts": [
            "experiences and connections"
          ]
        },
        {
          "q": "Can a place change over time?",
          "a": "yes — both physical and human characteristics can change",
          "alts": [
            "yes"
          ]
        }
      ]
    },
    "human-environment-interaction": {
      "questions": [
        {
          "q": "What is human-environment interaction?",
          "a": "how people affect the environment and how the environment affects people",
          "alts": [
            "people affect environment and vice versa"
          ]
        },
        {
          "q": "Give an example of humans adapting to the environment.",
          "a": "wearing warm clothing in cold climates or building houses on stilts in flood areas",
          "alts": [
            "warm clothes",
            "stilts"
          ]
        },
        {
          "q": "Give an example of humans modifying the environment.",
          "a": "building dams, clearing forests, or irrigating deserts",
          "alts": [
            "dams",
            "deforestation"
          ]
        },
        {
          "q": "What is deforestation an example of?",
          "a": "humans modifying the environment",
          "alts": [
            "modification"
          ]
        },
        {
          "q": "How does the environment affect where people settle?",
          "a": "people tend to settle near water, fertile land, and moderate climates",
          "alts": [
            "water fertile land climate"
          ]
        },
        {
          "q": "What are negative consequences of human-environment interaction?",
          "a": "pollution, habitat destruction, climate change, resource depletion",
          "alts": [
            "pollution habitat loss"
          ]
        }
      ]
    },
    "movement": {
      "questions": [
        {
          "q": "What does \"movement\" refer to in geography?",
          "a": "the movement of people, goods, ideas, and information between places",
          "alts": [
            "flow of people goods ideas"
          ]
        },
        {
          "q": "What drives human migration?",
          "a": "push factors (war, poverty) and pull factors (jobs, safety, freedom)",
          "alts": [
            "push and pull factors"
          ]
        },
        {
          "q": "How has technology changed the movement of ideas?",
          "a": "the internet allows instant global communication",
          "alts": [
            "internet instant communication"
          ]
        },
        {
          "q": "What is cultural diffusion?",
          "a": "the spread of cultural traits from one place to another",
          "alts": [
            "spread of culture"
          ]
        },
        {
          "q": "Give an example of movement of goods.",
          "a": "international trade, shipping containers, or importing food",
          "alts": [
            "trade",
            "shipping"
          ]
        },
        {
          "q": "How does transportation technology affect movement?",
          "a": "faster and cheaper transportation increases the movement of people and goods",
          "alts": [
            "faster transport more movement"
          ]
        }
      ]
    },
    "region": {
      "questions": [
        {
          "q": "What is a region?",
          "a": "an area defined by one or more shared characteristics",
          "alts": [
            "area with shared features"
          ]
        },
        {
          "q": "What is a formal region?",
          "a": "a region defined by official boundaries, like countries or states",
          "alts": [
            "official boundaries"
          ]
        },
        {
          "q": "What is a functional region?",
          "a": "a region organized around a central point, like a city and its suburbs",
          "alts": [
            "organized around center"
          ]
        },
        {
          "q": "What is a perceptual region?",
          "a": "a region defined by people's shared feelings or attitudes, like \"the South\"",
          "alts": [
            "defined by feelings"
          ]
        },
        {
          "q": "Is \"the Midwest\" a formal or perceptual region?",
          "a": "perceptual — people disagree on its exact boundaries",
          "alts": [
            "perceptual"
          ]
        },
        {
          "q": "Why do geographers organize the world into regions?",
          "a": "to make the study of large areas more manageable",
          "alts": [
            "organize study"
          ]
        }
      ]
    },
    "landforms": {
      "questions": [
        {
          "q": "Name four major landforms.",
          "a": "mountains, valleys, plains, and plateaus",
          "alts": [
            "mountains valleys plains plateaus"
          ]
        },
        {
          "q": "How are mountains formed?",
          "a": "by tectonic plate collisions pushing rock upward",
          "alts": [
            "plate collisions"
          ]
        },
        {
          "q": "What is a plateau?",
          "a": "a flat, elevated landform",
          "alts": [
            "flat elevated area"
          ]
        },
        {
          "q": "What is the difference between weathering and erosion?",
          "a": "weathering breaks down rock in place; erosion moves the broken material",
          "alts": [
            "weathering breaks erosion moves"
          ]
        },
        {
          "q": "How do rivers shape landforms?",
          "a": "by eroding valleys, depositing sediment to form deltas and floodplains",
          "alts": [
            "erosion and deposition"
          ]
        },
        {
          "q": "What is a delta?",
          "a": "a landform created where a river deposits sediment as it enters a larger body of water",
          "alts": [
            "sediment deposit at river mouth"
          ]
        }
      ]
    },
    "climate-zones": {
      "questions": [
        {
          "q": "What are the three main climate zones?",
          "a": "tropical, temperate, and polar",
          "alts": [
            "tropical temperate polar"
          ]
        },
        {
          "q": "What is the difference between weather and climate?",
          "a": "weather is short-term conditions; climate is long-term average patterns",
          "alts": [
            "weather short-term climate long-term"
          ]
        },
        {
          "q": "What factors affect climate?",
          "a": "latitude, altitude, ocean currents, wind patterns, and distance from water",
          "alts": [
            "latitude altitude ocean distance"
          ]
        },
        {
          "q": "Why are places near the equator warmer?",
          "a": "they receive more direct sunlight throughout the year",
          "alts": [
            "more direct sunlight"
          ]
        },
        {
          "q": "How does altitude affect climate?",
          "a": "temperature decreases as altitude increases",
          "alts": [
            "higher is colder"
          ]
        },
        {
          "q": "What is a rain shadow?",
          "a": "a dry area on the side of a mountain away from the wind, which gets less rainfall",
          "alts": [
            "dry side of mountain"
          ]
        }
      ]
    },
    "ecosystems": {
      "questions": [
        {
          "q": "What is a biome?",
          "a": "a large area characterized by its climate, plants, and animals",
          "alts": [
            "large area defined by climate and life"
          ]
        },
        {
          "q": "Name four major biomes.",
          "a": "desert, grassland, forest, and tundra",
          "alts": [
            "desert grassland forest tundra"
          ]
        },
        {
          "q": "How does climate determine which biome exists in an area?",
          "a": "temperature and precipitation determine what plants and animals can survive",
          "alts": [
            "temp and rain determine life"
          ]
        },
        {
          "q": "What biome has the greatest biodiversity?",
          "a": "tropical rainforest",
          "alts": [
            "rainforest"
          ]
        },
        {
          "q": "How do humans affect biomes?",
          "a": "through deforestation, pollution, urbanization, and climate change",
          "alts": [
            "deforestation pollution"
          ]
        },
        {
          "q": "What is biodiversity?",
          "a": "the variety of living things in an area",
          "alts": [
            "variety of life"
          ]
        }
      ]
    },
    "water-cycle": {
      "questions": [
        {
          "q": "What are the main steps of the water cycle?",
          "a": "evaporation, condensation, precipitation, and collection",
          "alts": [
            "evaporation condensation precipitation collection"
          ]
        },
        {
          "q": "Where is most of Earth's fresh water?",
          "a": "in ice caps and glaciers",
          "alts": [
            "glaciers",
            "ice"
          ]
        },
        {
          "q": "What percentage of Earth's water is fresh?",
          "a": "about 3%",
          "alts": [
            "3 percent"
          ]
        },
        {
          "q": "How does the water cycle affect weather?",
          "a": "it moves water and heat energy through the atmosphere, creating weather patterns",
          "alts": [
            "moves water and energy"
          ]
        },
        {
          "q": "What is a watershed?",
          "a": "an area of land where all water drains to a common outlet like a river or lake",
          "alts": [
            "area draining to common point"
          ]
        },
        {
          "q": "How do humans affect the water cycle?",
          "a": "through dams, irrigation, deforestation, and pollution",
          "alts": [
            "dams irrigation deforestation"
          ]
        }
      ]
    }
  },
  "grade-7": {
    "population-distribution": {
      "questions": [
        {
          "q": "Where do most of the world's people live?",
          "a": "in Asia, particularly in China and India",
          "alts": [
            "asia"
          ]
        },
        {
          "q": "What factors attract large populations?",
          "a": "fertile land, water access, moderate climate, and economic opportunities",
          "alts": [
            "fertile land water climate jobs"
          ]
        },
        {
          "q": "What is population density?",
          "a": "the number of people per unit of area",
          "alts": [
            "people per area"
          ]
        },
        {
          "q": "Why are some areas sparsely populated?",
          "a": "harsh climate, lack of water, rugged terrain, or few resources",
          "alts": [
            "harsh conditions"
          ]
        },
        {
          "q": "How is population density calculated?",
          "a": "population divided by area",
          "alts": [
            "population / area"
          ]
        },
        {
          "q": "Name an area with very high population density.",
          "a": "Bangladesh, Hong Kong, or Mumbai",
          "alts": [
            "bangladesh",
            "tokyo"
          ]
        }
      ]
    },
    "demographics": {
      "questions": [
        {
          "q": "What are demographics?",
          "a": "statistical data about a population, like age, gender, income, and education",
          "alts": [
            "population statistics"
          ]
        },
        {
          "q": "What is a population pyramid?",
          "a": "a graph showing the age and gender distribution of a population",
          "alts": [
            "age gender graph"
          ]
        },
        {
          "q": "What does a wide-base population pyramid indicate?",
          "a": "a young, rapidly growing population with high birth rates",
          "alts": [
            "young growing population"
          ]
        },
        {
          "q": "What is the demographic transition model?",
          "a": "a model showing how birth and death rates change as a country develops",
          "alts": [
            "how rates change with development"
          ]
        },
        {
          "q": "What is life expectancy?",
          "a": "the average number of years a person is expected to live",
          "alts": [
            "average lifespan"
          ]
        },
        {
          "q": "How does education affect demographics?",
          "a": "higher education often leads to lower birth rates and longer life expectancy",
          "alts": [
            "lowers birth rate"
          ]
        }
      ]
    },
    "push-pull-factors": {
      "questions": [
        {
          "q": "What are push factors?",
          "a": "conditions that drive people to leave a place, like war, poverty, or persecution",
          "alts": [
            "reasons to leave"
          ]
        },
        {
          "q": "What are pull factors?",
          "a": "conditions that attract people to a new place, like jobs, safety, or freedom",
          "alts": [
            "reasons to go somewhere"
          ]
        },
        {
          "q": "Name two push factors.",
          "a": "war and famine",
          "alts": [
            "poverty persecution disaster"
          ]
        },
        {
          "q": "Name two pull factors.",
          "a": "economic opportunity and political freedom",
          "alts": [
            "jobs safety education"
          ]
        },
        {
          "q": "What is the difference between a refugee and an immigrant?",
          "a": "a refugee is forced to flee danger; an immigrant chooses to move for opportunities",
          "alts": [
            "forced vs chosen"
          ]
        },
        {
          "q": "Can a single factor be both push and pull?",
          "a": "yes — low wages push from one country but pull to another with even lower wages",
          "alts": [
            "yes"
          ]
        }
      ]
    },
    "urbanization": {
      "questions": [
        {
          "q": "What is urbanization?",
          "a": "the process of people moving from rural areas to cities",
          "alts": [
            "rural to city migration"
          ]
        },
        {
          "q": "What percentage of the world's population lives in cities today?",
          "a": "more than 50% (about 56%)",
          "alts": [
            "over 50",
            "more than half"
          ]
        },
        {
          "q": "What are benefits of urbanization?",
          "a": "access to jobs, education, healthcare, and cultural opportunities",
          "alts": [
            "jobs education healthcare"
          ]
        },
        {
          "q": "What are problems caused by urbanization?",
          "a": "overcrowding, pollution, housing shortages, and strain on infrastructure",
          "alts": [
            "overcrowding pollution"
          ]
        },
        {
          "q": "What is a megacity?",
          "a": "a city with more than 10 million people",
          "alts": [
            "city over 10 million"
          ]
        },
        {
          "q": "Name a megacity.",
          "a": "Tokyo, Delhi, Shanghai, Mexico City, or New York",
          "alts": [
            "tokyo",
            "delhi",
            "new york"
          ]
        }
      ]
    },
    "cultural-diffusion": {
      "questions": [
        {
          "q": "What is cultural diffusion?",
          "a": "the spread of cultural ideas, practices, or products from one place to another",
          "alts": [
            "spread of culture"
          ]
        },
        {
          "q": "Give an example of cultural diffusion.",
          "a": "pizza spreading from Italy to the world, or K-pop spreading from South Korea",
          "alts": [
            "pizza",
            "music",
            "food"
          ]
        },
        {
          "q": "What are three causes of cultural diffusion?",
          "a": "trade, migration, and technology (especially the internet)",
          "alts": [
            "trade migration technology"
          ]
        },
        {
          "q": "What is cultural assimilation?",
          "a": "when a minority group adopts the culture of the majority",
          "alts": [
            "adopting majority culture"
          ]
        },
        {
          "q": "What is globalization's role in cultural diffusion?",
          "a": "it speeds up the exchange of culture through trade, media, and travel",
          "alts": [
            "speeds exchange"
          ]
        },
        {
          "q": "Can cultural diffusion lead to conflict?",
          "a": "yes — when cultural changes threaten traditional values or identities",
          "alts": [
            "yes"
          ]
        }
      ]
    },
    "culture-regions": {
      "questions": [
        {
          "q": "What defines a culture region?",
          "a": "an area where people share common cultural traits like language, religion, or customs",
          "alts": [
            "shared cultural traits"
          ]
        },
        {
          "q": "What is a culture hearth?",
          "a": "a center from which culture traits spread outward",
          "alts": [
            "origin of cultural spread"
          ]
        },
        {
          "q": "Name a culture hearth.",
          "a": "Mesopotamia, Nile Valley, Indus Valley, or Yellow River Valley",
          "alts": [
            "mesopotamia"
          ]
        },
        {
          "q": "How do physical features affect culture regions?",
          "a": "mountains, rivers, and deserts can create barriers that lead to distinct cultures",
          "alts": [
            "barriers create distinct cultures"
          ]
        },
        {
          "q": "Can culture regions overlap?",
          "a": "yes — a person can belong to multiple cultural groups",
          "alts": [
            "yes"
          ]
        },
        {
          "q": "How are culture regions different from political regions?",
          "a": "culture regions are based on shared cultural traits; political regions have official borders",
          "alts": [
            "cultural traits vs official borders"
          ]
        }
      ]
    },
    "religion-language": {
      "questions": [
        {
          "q": "What are the five major world religions?",
          "a": "Christianity, Islam, Hinduism, Buddhism, and Judaism",
          "alts": [
            "christianity islam hinduism buddhism judaism"
          ]
        },
        {
          "q": "What is the most widely spoken language in the world?",
          "a": "English (most widely used) or Mandarin Chinese (most native speakers)",
          "alts": [
            "english",
            "mandarin"
          ]
        },
        {
          "q": "How does language affect cultural identity?",
          "a": "language is a core part of cultural identity and shapes how people think and communicate",
          "alts": [
            "core of identity"
          ]
        },
        {
          "q": "What is a lingua franca?",
          "a": "a common language used between people who speak different native languages",
          "alts": [
            "common shared language"
          ]
        },
        {
          "q": "How does religion influence geography?",
          "a": "it affects settlement patterns, architecture, food, holidays, and social customs",
          "alts": [
            "settlement architecture food"
          ]
        },
        {
          "q": "Can language barriers cause conflict?",
          "a": "yes — miscommunication and exclusion can lead to social tensions",
          "alts": [
            "yes"
          ]
        }
      ]
    },
    "cultural-conflict": {
      "questions": [
        {
          "q": "What causes cultural conflict?",
          "a": "differences in values, beliefs, customs, or competition for resources",
          "alts": [
            "differences in values and resources"
          ]
        },
        {
          "q": "What is ethnocentrism?",
          "a": "the belief that your own culture is superior to others",
          "alts": [
            "believing your culture is best"
          ]
        },
        {
          "q": "How can cultural conflict be resolved?",
          "a": "through dialogue, compromise, education, and respect for diversity",
          "alts": [
            "dialogue compromise respect"
          ]
        },
        {
          "q": "What is cultural relativism?",
          "a": "understanding other cultures on their own terms rather than judging by your own standards",
          "alts": [
            "understanding on their terms"
          ]
        },
        {
          "q": "Give an example of cultural conflict in history.",
          "a": "conflicts between colonizers and indigenous peoples, or religious wars",
          "alts": [
            "colonialism",
            "religious wars"
          ]
        },
        {
          "q": "How does immigration sometimes lead to cultural tension?",
          "a": "when newcomers and established residents have different customs and values",
          "alts": [
            "different customs create tension"
          ]
        }
      ]
    },
    "resources-distribution": {
      "questions": [
        {
          "q": "Why are natural resources unevenly distributed?",
          "a": "geological and geographical processes create resources in specific locations",
          "alts": [
            "geology creates resources in certain places"
          ]
        },
        {
          "q": "What is the difference between renewable and nonrenewable resources?",
          "a": "renewable can be replenished naturally; nonrenewable cannot",
          "alts": [
            "renewable replenish nonrenewable dont"
          ]
        },
        {
          "q": "How does resource distribution affect economic power?",
          "a": "countries with valuable resources (like oil) have more economic leverage",
          "alts": [
            "resources give economic power"
          ]
        },
        {
          "q": "Name a nonrenewable resource.",
          "a": "oil, coal, natural gas, or minerals",
          "alts": [
            "oil",
            "coal"
          ]
        },
        {
          "q": "How can resource scarcity lead to conflict?",
          "a": "competition for limited resources like water or oil can cause disputes",
          "alts": [
            "competition causes conflict"
          ]
        },
        {
          "q": "What is resource management?",
          "a": "planning how to use resources sustainably to meet current and future needs",
          "alts": [
            "sustainable use planning"
          ]
        }
      ]
    },
    "development-levels": {
      "questions": [
        {
          "q": "What is the Human Development Index (HDI)?",
          "a": "a measure combining life expectancy, education, and income to rank countries",
          "alts": [
            "health education income ranking"
          ]
        },
        {
          "q": "What is the difference between a developed and developing country?",
          "a": "developed countries have higher income, education, and life expectancy",
          "alts": [
            "higher income education life expectancy"
          ]
        },
        {
          "q": "What is GDP per capita?",
          "a": "the total economic output of a country divided by its population",
          "alts": [
            "economic output per person"
          ]
        },
        {
          "q": "Can a country be rich in resources but still underdeveloped?",
          "a": "yes — due to corruption, conflict, or poor governance",
          "alts": [
            "yes"
          ]
        },
        {
          "q": "What is infrastructure?",
          "a": "the basic systems a country needs to function, like roads, schools, and hospitals",
          "alts": [
            "roads schools hospitals"
          ]
        },
        {
          "q": "How does geography affect development?",
          "a": "access to coastlines, resources, and moderate climate facilitate development",
          "alts": [
            "coast resources climate help"
          ]
        }
      ]
    },
    "trade-patterns": {
      "questions": [
        {
          "q": "Why do countries trade?",
          "a": "because no country has all the resources it needs, so trade allows specialization",
          "alts": [
            "no country has everything"
          ]
        },
        {
          "q": "What is an export?",
          "a": "a good or service sold to another country",
          "alts": [
            "sold to other country"
          ]
        },
        {
          "q": "What is an import?",
          "a": "a good or service bought from another country",
          "alts": [
            "bought from other country"
          ]
        },
        {
          "q": "What is a trade route?",
          "a": "a path regularly used for commercial trade",
          "alts": [
            "path for trade"
          ]
        },
        {
          "q": "How has containerization changed global trade?",
          "a": "standardized containers made shipping goods faster, cheaper, and more efficient",
          "alts": [
            "faster cheaper shipping"
          ]
        },
        {
          "q": "What is a tariff?",
          "a": "a tax on imported goods",
          "alts": [
            "tax on imports"
          ]
        }
      ]
    }
  },
  "grade-8": {
    "borders-boundaries": {
      "questions": [
        {
          "q": "What is the difference between a natural and an artificial boundary?",
          "a": "natural boundaries follow geographic features like rivers; artificial ones are drawn by people",
          "alts": [
            "natural follows geography artificial is drawn"
          ]
        },
        {
          "q": "Give an example of a natural boundary.",
          "a": "the Rio Grande between the US and Mexico, or the Himalayas between India and China",
          "alts": [
            "rio grande",
            "himalayas",
            "rivers"
          ]
        },
        {
          "q": "Why were many African borders drawn as straight lines?",
          "a": "European colonizers drew borders without regard for ethnic or cultural groups",
          "alts": [
            "colonizers drew them"
          ]
        },
        {
          "q": "How can poorly drawn borders cause conflict?",
          "a": "they may split ethnic groups or combine rival groups, leading to tensions",
          "alts": [
            "split groups cause tension"
          ]
        },
        {
          "q": "What is a disputed territory?",
          "a": "an area claimed by two or more countries or groups",
          "alts": [
            "claimed by multiple countries"
          ]
        },
        {
          "q": "What is sovereignty?",
          "a": "the authority of a state to govern itself without outside interference",
          "alts": [
            "self-governance"
          ]
        }
      ]
    },
    "international-organizations": {
      "questions": [
        {
          "q": "What is the United Nations?",
          "a": "an international organization founded to promote peace, cooperation, and human rights",
          "alts": [
            "international peace organization"
          ]
        },
        {
          "q": "What is NATO?",
          "a": "a military alliance of North American and European countries for collective defense",
          "alts": [
            "military alliance"
          ]
        },
        {
          "q": "What is the European Union?",
          "a": "an economic and political union of European countries",
          "alts": [
            "european political economic union"
          ]
        },
        {
          "q": "Why do countries join international organizations?",
          "a": "for collective security, economic benefits, and cooperation on global issues",
          "alts": [
            "security economy cooperation"
          ]
        },
        {
          "q": "What is the World Health Organization?",
          "a": "a UN agency responsible for global public health",
          "alts": [
            "un health agency"
          ]
        },
        {
          "q": "Can international organizations enforce their decisions?",
          "a": "it varies — some have enforcement mechanisms, but sovereignty limits their power",
          "alts": [
            "limited enforcement"
          ]
        }
      ]
    },
    "conflict-cooperation": {
      "questions": [
        {
          "q": "What causes international conflict?",
          "a": "disputes over territory, resources, ideology, religion, or ethnic differences",
          "alts": [
            "territory resources ideology"
          ]
        },
        {
          "q": "What is diplomacy?",
          "a": "the practice of conducting negotiations between nations",
          "alts": [
            "negotiation between nations"
          ]
        },
        {
          "q": "What are economic sanctions?",
          "a": "restrictions on trade used to pressure a country to change its behavior",
          "alts": [
            "trade restrictions for pressure"
          ]
        },
        {
          "q": "Give an example of international cooperation.",
          "a": "the Paris Climate Agreement, international space station, or humanitarian aid",
          "alts": [
            "paris agreement",
            "iss"
          ]
        },
        {
          "q": "What is a treaty?",
          "a": "a formal agreement between two or more countries",
          "alts": [
            "formal agreement between countries"
          ]
        },
        {
          "q": "How can trade promote peace?",
          "a": "countries that trade with each other have economic incentives to maintain peace",
          "alts": [
            "economic incentive for peace"
          ]
        }
      ]
    },
    "sovereignty": {
      "questions": [
        {
          "q": "What is national sovereignty?",
          "a": "a nation's right to govern itself independently",
          "alts": [
            "right to self-governance"
          ]
        },
        {
          "q": "How can globalization challenge sovereignty?",
          "a": "international agreements and organizations may limit what countries can do independently",
          "alts": [
            "international rules limit independence"
          ]
        },
        {
          "q": "What is self-determination?",
          "a": "the right of a people to determine their own political status and government",
          "alts": [
            "people choosing their own government"
          ]
        },
        {
          "q": "Can sovereignty be shared?",
          "a": "yes — EU member states share some sovereignty for collective governance",
          "alts": [
            "yes"
          ]
        },
        {
          "q": "What happens when sovereignty is violated?",
          "a": "it can lead to international conflict, sanctions, or intervention",
          "alts": [
            "conflict sanctions"
          ]
        },
        {
          "q": "How does sovereignty relate to human rights?",
          "a": "tension exists when a sovereign nation violates its citizens' human rights",
          "alts": [
            "tension between sovereignty and rights"
          ]
        }
      ]
    },
    "global-connections": {
      "questions": [
        {
          "q": "How is the world more connected today than 100 years ago?",
          "a": "through the internet, air travel, global trade, and international organizations",
          "alts": [
            "internet travel trade"
          ]
        },
        {
          "q": "What is a supply chain?",
          "a": "the network of steps from raw materials to finished product reaching the consumer",
          "alts": [
            "raw materials to consumer"
          ]
        },
        {
          "q": "How did COVID-19 demonstrate global connections?",
          "a": "a virus from one country spread worldwide within months, affecting all economies",
          "alts": [
            "virus spread globally"
          ]
        },
        {
          "q": "What is outsourcing?",
          "a": "hiring workers in other countries to do work, often to reduce costs",
          "alts": [
            "hiring foreign workers"
          ]
        },
        {
          "q": "How does global connection benefit developing countries?",
          "a": "through investment, technology transfer, and access to larger markets",
          "alts": [
            "investment technology markets"
          ]
        },
        {
          "q": "What are risks of global interdependence?",
          "a": "problems in one country can quickly spread to others",
          "alts": [
            "problems spread"
          ]
        }
      ]
    },
    "cultural-exchange": {
      "questions": [
        {
          "q": "How does cultural exchange differ from cultural imperialism?",
          "a": "exchange is mutual sharing; imperialism is one culture dominating another",
          "alts": [
            "mutual vs domination"
          ]
        },
        {
          "q": "Give an example of positive cultural exchange.",
          "a": "learning new cuisines, music, art, or languages from other cultures",
          "alts": [
            "food music language"
          ]
        },
        {
          "q": "What is cultural homogenization?",
          "a": "when cultures become more similar due to globalization",
          "alts": [
            "cultures becoming similar"
          ]
        },
        {
          "q": "How does the internet facilitate cultural exchange?",
          "a": "it allows instant sharing of music, art, ideas, and information across borders",
          "alts": [
            "instant sharing across borders"
          ]
        },
        {
          "q": "What is a concern about cultural exchange?",
          "a": "dominant cultures may overshadow smaller ones, leading to loss of cultural diversity",
          "alts": [
            "loss of diversity"
          ]
        },
        {
          "q": "What is cultural preservation?",
          "a": "efforts to maintain traditional practices, languages, and heritage",
          "alts": [
            "maintaining traditions"
          ]
        }
      ]
    },
    "economic-interdependence": {
      "questions": [
        {
          "q": "What is economic interdependence?",
          "a": "when countries rely on each other for goods, services, and economic stability",
          "alts": [
            "countries relying on each other"
          ]
        },
        {
          "q": "How does economic interdependence promote peace?",
          "a": "countries that depend on each other economically have reasons to maintain good relations",
          "alts": [
            "economic reasons for peace"
          ]
        },
        {
          "q": "What happens when a major trading partner has an economic crisis?",
          "a": "it can affect all countries that trade with them",
          "alts": [
            "affects trading partners"
          ]
        },
        {
          "q": "What is a multinational corporation?",
          "a": "a company that operates in multiple countries",
          "alts": [
            "company in multiple countries"
          ]
        },
        {
          "q": "How does economic interdependence affect developing countries?",
          "a": "they gain access to markets but may become dependent on foreign investment",
          "alts": [
            "access markets but dependent"
          ]
        },
        {
          "q": "What is fair trade?",
          "a": "a movement ensuring producers in developing countries get fair prices for their goods",
          "alts": [
            "fair prices for producers"
          ]
        }
      ]
    },
    "climate-change-geography": {
      "questions": [
        {
          "q": "How is climate change a geographic issue?",
          "a": "it affects different places differently based on location, elevation, and proximity to water",
          "alts": [
            "affects places differently"
          ]
        },
        {
          "q": "Which areas are most vulnerable to climate change?",
          "a": "coastal areas, island nations, Arctic regions, and arid areas",
          "alts": [
            "coasts islands arctic"
          ]
        },
        {
          "q": "How does climate change affect migration?",
          "a": "rising seas and extreme weather can force people to leave their homes",
          "alts": [
            "forces people to move"
          ]
        },
        {
          "q": "What is a climate refugee?",
          "a": "a person forced to migrate due to climate change effects",
          "alts": [
            "migrating due to climate"
          ]
        },
        {
          "q": "How do different countries contribute unequally to climate change?",
          "a": "industrialized nations produce more emissions but developing nations often suffer more effects",
          "alts": [
            "rich produce more poor suffer more"
          ]
        },
        {
          "q": "What is the Paris Climate Agreement?",
          "a": "an international treaty to limit global warming to 1.5-2 degrees Celsius",
          "alts": [
            "treaty to limit warming"
          ]
        }
      ]
    },
    "resource-management": {
      "questions": [
        {
          "q": "What is sustainable resource management?",
          "a": "using resources in a way that meets current needs without compromising future generations",
          "alts": [
            "meeting needs without harming future"
          ]
        },
        {
          "q": "What is water scarcity?",
          "a": "when the demand for clean water exceeds the available supply",
          "alts": [
            "not enough clean water"
          ]
        },
        {
          "q": "How does deforestation affect resource management?",
          "a": "it reduces biodiversity, increases erosion, and contributes to climate change",
          "alts": [
            "reduces biodiversity increases erosion"
          ]
        },
        {
          "q": "What is conservation?",
          "a": "the careful management and protection of natural resources",
          "alts": [
            "protecting natural resources"
          ]
        },
        {
          "q": "Name a renewable energy source.",
          "a": "solar, wind, hydroelectric, or geothermal",
          "alts": [
            "solar",
            "wind"
          ]
        },
        {
          "q": "Why is resource management a global challenge?",
          "a": "resources cross borders, and one country's use affects others",
          "alts": [
            "resources cross borders"
          ]
        }
      ]
    },
    "sustainability": {
      "questions": [
        {
          "q": "What does sustainability mean?",
          "a": "meeting present needs without compromising the ability of future generations to meet theirs",
          "alts": [
            "not harming future generations"
          ]
        },
        {
          "q": "What are the three pillars of sustainability?",
          "a": "economic, social, and environmental",
          "alts": [
            "economic social environmental"
          ]
        },
        {
          "q": "What is an ecological footprint?",
          "a": "a measure of the environmental impact of a person or community",
          "alts": [
            "environmental impact measure"
          ]
        },
        {
          "q": "How can cities become more sustainable?",
          "a": "through public transit, green buildings, recycling, and renewable energy",
          "alts": [
            "transit green buildings recycling"
          ]
        },
        {
          "q": "What are the UN Sustainable Development Goals?",
          "a": "a set of 17 global goals to end poverty, protect the planet, and ensure prosperity",
          "alts": [
            "17 global goals"
          ]
        },
        {
          "q": "How does sustainability connect to geography?",
          "a": "every place has unique environmental challenges that require local sustainable solutions",
          "alts": [
            "local solutions for local challenges"
          ]
        }
      ]
    },
    "natural-hazards": {
      "questions": [
        {
          "q": "What is the difference between a natural hazard and a natural disaster?",
          "a": "a hazard is a potential threat; it becomes a disaster when it affects people and property",
          "alts": [
            "hazard is potential disaster is when it hits people"
          ]
        },
        {
          "q": "Name three types of natural hazards.",
          "a": "earthquakes, hurricanes, floods, volcanoes, tsunamis, droughts",
          "alts": [
            "earthquakes hurricanes floods"
          ]
        },
        {
          "q": "Why do some countries suffer more from natural hazards?",
          "a": "their geographic location, poverty, and lack of infrastructure increase vulnerability",
          "alts": [
            "location poverty infrastructure"
          ]
        },
        {
          "q": "What is the Ring of Fire?",
          "a": "a zone around the Pacific Ocean with frequent earthquakes and volcanic activity",
          "alts": [
            "pacific earthquake zone"
          ]
        },
        {
          "q": "How can communities prepare for natural hazards?",
          "a": "through building codes, early warning systems, education, and emergency planning",
          "alts": [
            "building codes warnings planning"
          ]
        },
        {
          "q": "How does climate change affect natural hazards?",
          "a": "it can increase the frequency and intensity of storms, floods, droughts, and heat waves",
          "alts": [
            "more frequent intense hazards"
          ]
        }
      ]
    }
  }
};

const SCENARIOS = {
  "grade-6": [
    {
      "title": "The New Settlement",
      "focus": "Five Themes + physical geography",
      "text": "You are advising settlers on where to build a new town. Consider: location (near water? on flat land?), place (what is the climate and terrain like?), human-environment interaction (how will people change the land?), movement (how will people and goods travel?), and region (what larger area is this part of?). Use the Five Themes to design the ideal settlement."
    },
    {
      "title": "Map Detective",
      "focus": "map skills",
      "text": "You are given three different maps of the same area: a political map, a physical map, and a population density map. What different information does each provide? How do they complement each other? Why would you need all three to fully understand a place?"
    }
  ],
  "grade-7": [
    {
      "title": "The Migration Story",
      "focus": "population and movement",
      "text": "Millions of people are moving from rural areas to cities worldwide. Choose a country and research its urbanization. What push and pull factors drive migration? What challenges does the city face? How does this affect the rural areas people leave? Create a geographic profile of this migration."
    },
    {
      "title": "The Culture Clash",
      "focus": "culture and diffusion",
      "text": "A fast-food chain wants to open in a traditional village. Some residents welcome the jobs and modern food; others worry about losing their food culture. Analyze this from multiple geographic perspectives: economic geography, cultural geography, and human-environment interaction. What would you recommend?"
    }
  ],
  "grade-8": [
    {
      "title": "The Border Dispute",
      "focus": "geopolitics and conflict",
      "text": "Two neighboring countries share a river that provides water to both. Country A wants to build a dam for hydroelectric power. Country B depends on the river for farming. Analyze this from geographic perspectives: What are each country's legitimate needs? How does sovereignty apply? What role could international organizations play? Propose a solution."
    },
    {
      "title": "The Climate Migration",
      "focus": "environment and globalization",
      "text": "A Pacific island nation is sinking due to sea-level rise. Its 50,000 citizens may need to relocate within 30 years. As a geographic advisor: Where could they go? What cultural challenges would they face? Who is responsible for helping them? How does this illustrate the geographic connections between climate change, migration, and sovereignty?"
    }
  ]
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
  const bank = CONTENT_BANKS[grade]?.[skill];
  if (!bank || !bank.questions) return { error: `No content bank for ${grade}/${skill}` };
  const items = pick(bank.questions, count).map(q => ({ prompt: q.q, answer: q.a, acceptedAnswers: q.alts || [] }));
  return { type: 'short-answer', skill, grade, count: items.length, instruction: 'Answer each geography question.', items };
}

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(r => norm(r) === norm(answer));
  return norm(expected) === norm(answer);
}

class MSGeography {
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

  checkAnswer(type, expected, answer) {
    let exp = expected;
    if (typeof exp === 'string') {
      const bank = Object.values(CONTENT_BANKS).flatMap(g => Object.values(g)).find(b => b.questions?.some(q => q.a === exp));
      if (bank) { const q = bank.questions.find(q => q.a === exp); if (q && q.alts) exp = [exp, ...q.alts]; }
    }
    return { correct: checkAnswer(type, exp, answer), expected, studentAnswer: answer };
  }

  getScenario(grade) {
    const scenarios = SCENARIOS[grade];
    if (!scenarios) return { error: `No scenarios for ${grade}. Available: ${Object.keys(SCENARIOS).join(', ')}` };
    return pick(scenarios, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-6';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const scenario = SCENARIOS[grade] ? pick(SCENARIOS[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, scenario,
      lessonPlan: {
        hook: `Geographic scenario related to: ${target.category} - ${target.skill}`,
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: scenario ? `Analyze scenario: "${scenario.title}"` : 'Apply geographic thinking to a real-world place',
        connect: 'Link to history, economics, and current events',
      },
    };
  }
}

module.exports = MSGeography;

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new MSGeography();
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
      case 'scenario': { const [, g] = args; if (!g) throw new Error('Usage: scenario <grade>'); out(api.getScenario(g)); break; }
      default: out({ usage: 'node geography.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','scenario'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
