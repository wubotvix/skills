// MS Social Studies World History Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-socialstudies-world-history');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'early-civilizations': ['early-humans', 'neolithic-revolution', 'mesopotamia', 'ancient-egypt', 'indus-valley', 'ancient-china'],
  },
  'grade-7': {
    'classical-empires': ['ancient-greece', 'ancient-rome', 'maurya-gupta-india', 'han-china', 'classical-americas', 'trade-connections'],
    'medieval-world': ['feudal-europe', 'islamic-golden-age', 'african-empires', 'mongol-empire', 'medieval-asia', 'medieval-americas'],
  },
  'grade-8': {
    'age-of-exploration': ['renaissance', 'reformation', 'exploration-motives', 'columbian-exchange', 'scientific-revolution', 'enlightenment'],
    'revolutions-nationalism': ['american-revolution-global', 'french-revolution', 'latin-american-independence', 'industrial-revolution', 'imperialism', 'nationalism'],
    'modern-global-issues': ['world-wars', 'decolonization', 'cold-war-global', 'globalization', 'human-rights', 'contemporary-challenges'],
  },
};

const CONTENT_BANKS = {
  'grade-6': {
    'early-humans': {
      questions: [
        { q: 'How did early humans spread across the globe?', a: 'they migrated over thousands of years following food sources, crossing land bridges like Beringia', alts: ['migration', 'followed food', 'land bridges'] },
        { q: 'What evidence do archaeologists use to study early humans?', a: 'fossils, tools, cave paintings, and artifacts', alts: ['fossils', 'tools and artifacts', 'cave art'] },
        { q: 'What characterized the Paleolithic (Old Stone Age) way of life?', a: 'nomadic hunter-gatherer lifestyle using stone tools', alts: ['hunting and gathering', 'nomadic', 'stone tools'] },
        { q: 'How did the development of language change early human societies?', a: 'it allowed cooperation, sharing of knowledge, planning, and cultural transmission', alts: ['communication', 'cooperation', 'sharing knowledge'] },
        { q: 'What role did fire play in human development?', a: 'cooking food, warmth, protection from predators, and social gathering', alts: ['cooking warmth protection', 'survival tool'] },
        { q: 'Why is Africa called the "cradle of humanity"?', a: 'the oldest human fossils and evidence of early human evolution are found in Africa', alts: ['humans originated in africa', 'oldest fossils found there'] },
      ],
    },
    'neolithic-revolution': {
      questions: [
        { q: 'Why is the Neolithic Revolution considered the most important change in human history?', a: 'the shift from hunting-gathering to farming allowed permanent settlements, surplus food, and complex societies', alts: ['farming changed everything', 'enabled civilization'] },
        { q: 'What did humans domesticate during the Neolithic Revolution?', a: 'plants like wheat and rice, and animals like sheep, goats, and cattle', alts: ['crops and animals', 'wheat rice sheep goats'] },
        { q: 'How did farming lead to permanent settlements?', a: 'people no longer needed to follow food sources and could stay in one place near their crops', alts: ['stayed near crops', 'no need to migrate'] },
        { q: 'What is a food surplus and why does it matter?', a: 'more food than needed, which allows some people to specialize in other jobs', alts: ['extra food', 'allows specialization'] },
        { q: 'How did the Neolithic Revolution lead to social classes?', a: 'food surplus allowed specialization, leading to different jobs, wealth levels, and power structures', alts: ['specialization created hierarchy', 'some became leaders'] },
        { q: 'What are the characteristics of a civilization?', a: 'cities, organized government, religion, social classes, writing, art, and technology', alts: ['cities government writing', 'complex society'] },
      ],
    },
    'mesopotamia': {
      questions: [
        { q: 'Why is Mesopotamia called the "cradle of civilization"?', a: 'it is where the first cities, writing, and complex governments developed', alts: ['first civilization', 'first writing and cities'] },
        { q: 'What was cuneiform?', a: 'the first writing system, using wedge-shaped marks pressed into clay tablets', alts: ['first writing', 'wedge writing on clay'] },
        { q: 'What was the Code of Hammurabi and why was it important?', a: 'one of the first written law codes, establishing the idea that laws should be written and public', alts: ['first written laws', 'written law code'] },
        { q: 'How did the Tigris and Euphrates rivers shape Mesopotamian civilization?', a: 'they provided water for irrigation, fertile soil from floods, and transportation routes', alts: ['irrigation', 'fertile soil', 'water and trade'] },
        { q: 'What is a city-state?', a: 'an independent city and its surrounding territory with its own government', alts: ['independent city', 'city with own government'] },
        { q: 'What innovations came from Mesopotamia?', a: 'the wheel, plow, sailboat, writing, number system based on 60, and irrigation', alts: ['wheel', 'writing', 'irrigation systems'] },
      ],
    },
    'ancient-egypt': {
      questions: [
        { q: 'How did the Nile River shape Egyptian civilization?', a: 'annual floods deposited fertile soil, the river provided water and transportation, and deserts provided protection', alts: ['fertile soil from floods', 'water and protection'] },
        { q: 'What was the role of the pharaoh in Egyptian society?', a: 'the pharaoh was both political leader and religious figure, considered a living god', alts: ['god-king', 'political and religious leader'] },
        { q: 'What were hieroglyphics?', a: 'the Egyptian writing system using picture symbols', alts: ['picture writing', 'egyptian writing system'] },
        { q: 'Why did Egyptians build pyramids?', a: 'as tombs for pharaohs, reflecting beliefs about the afterlife', alts: ['pharaoh tombs', 'afterlife beliefs'] },
        { q: 'What did Egyptians believe about the afterlife?', a: 'that preserving the body (mummification) and including goods in tombs helped the dead in the next life', alts: ['mummification', 'life after death', 'preservation of body'] },
        { q: 'What was the social structure of ancient Egypt?', a: 'pharaoh at top, then priests and nobles, scribes, merchants, artisans, farmers, and slaves at bottom', alts: ['hierarchical', 'pharaoh on top'] },
      ],
    },
    'indus-valley': {
      questions: [
        { q: 'What made the Indus Valley civilization remarkable for its time?', a: 'advanced urban planning with grid streets, sewage systems, and standardized weights', alts: ['planned cities', 'grid layout', 'sewage system'] },
        { q: 'What were the two major cities of the Indus Valley civilization?', a: 'Harappa and Mohenjo-Daro', alts: ['harappa mohenjo daro'] },
        { q: 'Why is the Indus Valley civilization mysterious?', a: 'their writing has never been deciphered and the cause of their decline is unknown', alts: ['undeciphered writing', 'unknown decline'] },
        { q: 'How did geography help the Indus Valley civilization develop?', a: 'the Indus River provided water for farming, and monsoon rains supported agriculture', alts: ['river water', 'monsoons', 'fertile land'] },
        { q: 'What evidence of trade has been found in Indus Valley sites?', a: 'goods from Mesopotamia and other regions, suggesting extensive trade networks', alts: ['traded with mesopotamia', 'long-distance trade'] },
        { q: 'What might have caused the decline of the Indus Valley civilization?', a: 'theories include climate change, river shifting, drought, or invasion', alts: ['climate change', 'river changed course', 'drought'] },
      ],
    },
    'ancient-china': {
      questions: [
        { q: 'What is the Mandate of Heaven?', a: 'the Chinese belief that heaven grants the right to rule to a just emperor, and revokes it from unjust ones', alts: ['divine right to rule', 'heaven chooses ruler'] },
        { q: 'How did the Yellow River (Huang He) shape Chinese civilization?', a: 'it provided fertile soil for farming but devastating floods earned it the name "China\'s Sorrow"', alts: ['fertile soil', 'farming', 'floods'] },
        { q: 'What was the dynastic cycle?', a: 'the pattern of dynasties rising, ruling, declining, and being replaced', alts: ['rise and fall of dynasties', 'cycle of power'] },
        { q: 'What were oracle bones used for in Shang dynasty China?', a: 'divination — asking questions of ancestors and gods by reading cracks in heated bones', alts: ['fortune telling', 'divination', 'predicting future'] },
        { q: 'What geographic features isolated ancient China?', a: 'the Himalayas, Gobi Desert, and Pacific Ocean surrounded China', alts: ['mountains desert ocean', 'natural barriers'] },
        { q: 'What was the significance of silk in ancient China?', a: 'silk was a luxury trade good that connected China to the rest of the world via the Silk Road', alts: ['trade good', 'silk road trade', 'luxury item'] },
      ],
    },
  },
  'grade-7': {
    'ancient-greece': {
      questions: [
        { q: 'What was Athenian democracy and how did it differ from modern democracy?', a: 'direct democracy where citizens voted on laws themselves, but only free adult men were citizens', alts: ['direct democracy', 'limited to men'] },
        { q: 'Who were Socrates, Plato, and Aristotle?', a: 'Greek philosophers who developed methods of logical thinking that influence Western thought today', alts: ['philosophers', 'founders of western philosophy'] },
        { q: 'What were the city-states of Athens and Sparta like?', a: 'Athens valued democracy, education, and the arts; Sparta valued military discipline and strength', alts: ['athens democracy sparta military'] },
        { q: 'What was the significance of the Persian Wars?', a: 'Greek city-states united to defeat the Persian Empire, preserving Greek independence and democracy', alts: ['defeated persia', 'preserved democracy'] },
        { q: 'What was Alexander the Great\'s lasting impact?', a: 'he spread Greek culture across a vast empire, creating the Hellenistic civilization', alts: ['spread greek culture', 'hellenistic world'] },
        { q: 'How did Greek ideas influence the modern world?', a: 'democracy, philosophy, science, architecture, theater, and the Olympic games all have Greek roots', alts: ['democracy', 'philosophy', 'lasting influence'] },
      ],
    },
    'ancient-rome': {
      questions: [
        { q: 'How did Rome change from a republic to an empire?', a: 'power struggles, civil wars, and Julius Caesar\'s rise led to Augustus becoming the first emperor', alts: ['civil wars', 'caesar then augustus'] },
        { q: 'What was Roman law and why does it still matter?', a: 'Roman legal principles like innocent until proven guilty and written laws influence modern legal systems worldwide', alts: ['influenced modern law', 'legal principles'] },
        { q: 'How did Roman engineering change the world?', a: 'roads, aqueducts, arches, and concrete connected the empire and influenced building for centuries', alts: ['roads aqueducts', 'engineering innovations'] },
        { q: 'How did Christianity spread through the Roman Empire?', a: 'through missionaries, Roman roads, common language, and eventually becoming the official religion', alts: ['missionaries', 'roman roads helped spread it'] },
        { q: 'What caused the fall of the Roman Empire?', a: 'a combination of invasions, internal weakness, economic problems, and division of the empire', alts: ['invasions', 'internal decline', 'multiple causes'] },
        { q: 'What is the legacy of Rome?', a: 'law, language (Latin roots), engineering, government structure, and Christianity\'s spread', alts: ['law language engineering', 'lasting influence'] },
      ],
    },
    'maurya-gupta-india': {
      questions: [
        { q: 'What was the Maurya Empire known for?', a: 'unifying most of India under Ashoka, who promoted Buddhism and nonviolence after a brutal war', alts: ['ashoka', 'unified india', 'buddhism'] },
        { q: 'Why is the Gupta Empire called India\'s Golden Age?', a: 'major achievements in math (zero, decimal system), science, medicine, literature, and art', alts: ['golden age', 'math and science', 'invented zero'] },
        { q: 'How did Hinduism and Buddhism originate and differ?', a: 'both originated in India; Hinduism is polytheistic with caste; Buddhism rejected caste and taught the Middle Way', alts: ['both from india', 'hinduism polytheistic buddhism middle way'] },
        { q: 'What was the caste system?', a: 'a rigid social hierarchy in Hindu society that determined status by birth', alts: ['social hierarchy', 'birth determines class'] },
        { q: 'What mathematical contributions came from ancient India?', a: 'the concept of zero, the decimal number system, and advances in algebra', alts: ['zero', 'decimal system', 'algebra'] },
        { q: 'How did trade spread Indian culture?', a: 'Indian merchants spread Hinduism, Buddhism, and Indian cultural practices throughout Southeast Asia', alts: ['religion spread by trade', 'cultural influence in southeast asia'] },
      ],
    },
    'han-china': {
      questions: [
        { q: 'What was the Silk Road?', a: 'a network of trade routes connecting China to the Mediterranean, exchanging goods, ideas, and cultures', alts: ['trade routes', 'connected china to west'] },
        { q: 'What did China invent during the Han dynasty?', a: 'paper, the compass, and advancements in silk production and iron tools', alts: ['paper', 'compass'] },
        { q: 'What was the civil service examination system?', a: 'a merit-based system for selecting government officials through examinations', alts: ['test for government jobs', 'merit-based'] },
        { q: 'How did Confucianism shape Chinese society?', a: 'it emphasized respect for elders, education, social harmony, and proper relationships', alts: ['respect hierarchy education', 'social order'] },
        { q: 'How did the Qin dynasty unify China?', a: 'Qin Shi Huang standardized weights, measures, writing, and currency, and built the Great Wall', alts: ['standardization', 'great wall'] },
        { q: 'What connected Rome and Han China even though they never met?', a: 'the Silk Road connected them through trade — Roman gold for Chinese silk', alts: ['silk road', 'trade connected them'] },
      ],
    },
    'classical-americas': {
      questions: [
        { q: 'What were the major achievements of the Maya civilization?', a: 'advanced writing system, accurate calendar, knowledge of astronomy, and sophisticated mathematics', alts: ['writing calendar astronomy', 'math and astronomy'] },
        { q: 'Who were the Olmec and why are they important?', a: 'the earliest known major civilization in Mesoamerica, known for colossal stone heads and influencing later cultures', alts: ['first mesoamerican civilization', 'stone heads'] },
        { q: 'What was unique about Maya mathematics?', a: 'they independently developed the concept of zero', alts: ['invented zero', 'concept of zero'] },
        { q: 'How did geography shape civilizations in the Americas?', a: 'diverse environments led to different adaptations — farming in river valleys, fishing on coasts, hunting on plains', alts: ['geography shaped culture', 'different environments different ways of life'] },
        { q: 'What were the Mississippian mound-building cultures?', a: 'Native American cultures in eastern North America that built large earthen mounds for ceremonial and political purposes', alts: ['mound builders', 'cahokia'] },
        { q: 'How advanced were American civilizations compared to European ones?', a: 'they were equally sophisticated in many ways — astronomy, agriculture, engineering, and government', alts: ['equally advanced', 'sophisticated civilizations'] },
      ],
    },
    'trade-connections': {
      questions: [
        { q: 'How did the Silk Road connect different civilizations?', a: 'it carried goods like silk, spices, and gold, as well as ideas, religions, and technologies across Eurasia', alts: ['traded goods and ideas', 'connected east and west'] },
        { q: 'What besides goods traveled along trade routes?', a: 'religions (Buddhism, Islam, Christianity), technologies, languages, diseases, and cultural practices', alts: ['religion ideas disease', 'culture and knowledge'] },
        { q: 'Why were Indian Ocean trade routes important?', a: 'they connected East Africa, Arabia, India, and Southeast Asia through maritime trade', alts: ['sea trade', 'connected coastal civilizations'] },
        { q: 'How did trade lead to cultural diffusion?', a: 'when people traded, they also exchanged ideas, religions, art, and technologies', alts: ['exchange of ideas', 'cultures mixed through trade'] },
        { q: 'What role did geography play in trade routes?', a: 'mountains, deserts, and oceans determined where routes went and created chokepoints and trading posts', alts: ['geography shaped routes', 'natural barriers and passages'] },
        { q: 'Why do historians call trade routes the "highways of the ancient world"?', a: 'they were the main way civilizations connected, exchanged, and influenced each other', alts: ['connected civilizations', 'main connection between peoples'] },
      ],
    },
    'feudal-europe': {
      questions: [
        { q: 'What was feudalism?', a: 'a political and social system where lords granted land to vassals in exchange for military service and loyalty', alts: ['land for loyalty', 'lords and vassals'] },
        { q: 'What was the manor system?', a: 'the economic system where peasants (serfs) worked a lord\'s land in exchange for protection', alts: ['serfs worked lords land', 'agricultural system'] },
        { q: 'What role did the Catholic Church play in medieval Europe?', a: 'it was the most powerful institution, providing spiritual guidance, education, and political influence', alts: ['most powerful institution', 'spiritual and political power'] },
        { q: 'What were the Crusades?', a: 'religious wars fought between Christians and Muslims over control of the Holy Land', alts: ['wars for holy land', 'christian muslim wars'] },
        { q: 'How did the Black Death change European society?', a: 'it killed about one-third of Europe, leading to labor shortages, higher wages, and weakened feudalism', alts: ['killed millions', 'ended feudalism', 'labor shortage'] },
        { q: 'What was the Magna Carta and why does it matter?', a: 'a 1215 document limiting the king\'s power, establishing that even rulers must follow the law', alts: ['limited king power', 'rule of law'] },
      ],
    },
    'islamic-golden-age': {
      questions: [
        { q: 'What was the Islamic Golden Age?', a: 'a period from the 8th to 14th centuries of major achievements in science, math, medicine, and culture', alts: ['era of islamic achievement', 'advances in science and culture'] },
        { q: 'What contributions did Islamic scholars make to mathematics?', a: 'algebra, the spread of Hindu-Arabic numerals, and advances in geometry', alts: ['algebra', 'numerals we use today'] },
        { q: 'How did Islam spread across such a large area?', a: 'through conquest, trade, and the appeal of its message of equality before God', alts: ['conquest and trade', 'religious appeal'] },
        { q: 'What role did Islamic scholars play in preserving knowledge?', a: 'they translated and preserved Greek, Roman, and Persian texts that might have been lost', alts: ['preserved ancient knowledge', 'translated greek texts'] },
        { q: 'What were the Five Pillars of Islam?', a: 'faith declaration, prayer, charity, fasting during Ramadan, and pilgrimage to Mecca', alts: ['shahada salat zakat sawm hajj'] },
        { q: 'How did trade connect the Islamic world?', a: 'Muslim merchants traded across Africa, Asia, and Europe, spreading goods, ideas, and Islam', alts: ['trade across continents', 'spread islam through trade'] },
      ],
    },
    'african-empires': {
      questions: [
        { q: 'What made the Ghana Empire wealthy?', a: 'control of the gold and salt trade across the Sahara', alts: ['gold and salt trade', 'trans-saharan trade'] },
        { q: 'Who was Mansa Musa and why is he famous?', a: 'ruler of Mali who was so wealthy his pilgrimage to Mecca disrupted gold markets', alts: ['rich king of mali', 'gold pilgrimage'] },
        { q: 'What was Timbuktu known for?', a: 'a center of learning, trade, and Islamic scholarship in the Mali and Songhai empires', alts: ['center of learning', 'scholarship and trade'] },
        { q: 'What was the trans-Saharan trade?', a: 'trade routes across the Sahara Desert exchanging gold, salt, enslaved people, and ideas', alts: ['trade across sahara', 'gold salt trade'] },
        { q: 'What was the Swahili Coast and why was it important?', a: 'East African trading cities that blended African, Arab, and Indian cultures through Indian Ocean trade', alts: ['east african trade', 'cultural blending'] },
        { q: 'Why are African empires often left out of world history?', a: 'Eurocentric bias in historical writing has marginalized African achievements and civilizations', alts: ['eurocentric bias', 'western focus in history'] },
      ],
    },
    'mongol-empire': {
      questions: [
        { q: 'Who was Genghis Khan?', a: 'the founder of the Mongol Empire, which became the largest contiguous land empire in history', alts: ['mongol founder', 'built largest land empire'] },
        { q: 'What was the Pax Mongolica?', a: 'a period of relative peace and stability across the Mongol Empire that facilitated trade on the Silk Road', alts: ['mongol peace', 'safe trade period'] },
        { q: 'How did the Mongol Empire affect trade?', a: 'it made the Silk Road safer and more active, connecting East and West', alts: ['protected silk road', 'increased trade'] },
        { q: 'What was the negative impact of Mongol conquest?', a: 'massive destruction, millions killed, and cities devastated across Asia and Eastern Europe', alts: ['destruction', 'millions killed'] },
        { q: 'How did the Mongol Empire spread the Black Death?', a: 'trade routes protected by Mongols also spread the plague from Central Asia to Europe', alts: ['plague traveled on trade routes', 'spread disease'] },
        { q: 'What was the lasting legacy of the Mongol Empire?', a: 'it connected distant civilizations, spread technology, and reshaped political boundaries across Eurasia', alts: ['connected civilizations', 'spread technology'] },
      ],
    },
    'medieval-asia': {
      questions: [
        { q: 'What were the achievements of Tang and Song dynasty China?', a: 'printing, gunpowder, compass, porcelain, and a flourishing of art and poetry', alts: ['printing gunpowder compass', 'chinese golden age'] },
        { q: 'What was the role of the samurai in Japanese society?', a: 'warrior class who served feudal lords (daimyo) under a code of honor called bushido', alts: ['warriors', 'served lords', 'bushido code'] },
        { q: 'What was the shogunate system in Japan?', a: 'military government where the shogun held real power while the emperor was a figurehead', alts: ['military ruler', 'shogun ruled japan'] },
        { q: 'How did Buddhism spread to East and Southeast Asia?', a: 'through trade routes, missionaries, and royal patronage from India to China, Korea, Japan, and Southeast Asia', alts: ['trade and missionaries', 'from india eastward'] },
        { q: 'What were the Khmer achievements at Angkor Wat?', a: 'a massive temple complex in Cambodia that is one of the largest religious monuments ever built', alts: ['temple complex', 'cambodian monument'] },
        { q: 'How did Chinese innovations like paper and printing change the world?', a: 'they enabled the spread of knowledge, record-keeping, and eventually mass communication', alts: ['spread knowledge', 'enabled communication'] },
      ],
    },
    'medieval-americas': {
      questions: [
        { q: 'What was remarkable about the Aztec city of Tenochtitlan?', a: 'built on a lake, it was one of the largest cities in the world with causeways, markets, and temples', alts: ['city on a lake', 'huge city', 'larger than european cities'] },
        { q: 'How did the Inca Empire manage such a large territory without writing?', a: 'they used quipu (knotted strings) for record-keeping and built an extensive road system', alts: ['quipu', 'road system'] },
        { q: 'What was the Aztec tribute system?', a: 'conquered peoples paid tribute (goods and labor) to the Aztec Empire', alts: ['conquered peoples paid tribute', 'goods and labor'] },
        { q: 'What agricultural techniques did the Aztecs use?', a: 'chinampas (floating gardens) to grow food on the lake', alts: ['floating gardens', 'chinampas'] },
        { q: 'How did the Inca road system unite their empire?', a: 'over 25,000 miles of roads connected the empire for communication, trade, and military movement', alts: ['roads connected empire', 'communication network'] },
        { q: 'What was similar about Maya, Aztec, and Inca civilizations?', a: 'all developed complex societies with advanced agriculture, architecture, astronomy, and government', alts: ['all were advanced', 'complex civilizations'] },
      ],
    },
  },
  'grade-8': {
    'renaissance': {
      questions: [
        { q: 'What was the Renaissance?', a: 'a rebirth of interest in classical Greek and Roman learning, art, and culture starting in Italy around 1400', alts: ['rebirth of learning', 'classical revival'] },
        { q: 'What is humanism?', a: 'a philosophy focusing on human potential, individual achievement, and studying classical texts', alts: ['focus on humans', 'human potential'] },
        { q: 'How did the printing press change the world?', a: 'it made books affordable, spread literacy, and allowed ideas to spread rapidly across Europe', alts: ['spread ideas', 'made books cheap'] },
        { q: 'Name two major Renaissance artists and their contributions.', a: 'Leonardo da Vinci (Mona Lisa, inventions) and Michelangelo (Sistine Chapel, David)', alts: ['da vinci michelangelo', 'leonardo and michelangelo'] },
        { q: 'Why did the Renaissance begin in Italy?', a: 'wealthy trading cities, access to classical Roman ruins, and patronage by rich families like the Medici', alts: ['wealthy cities', 'trade wealth', 'medici patronage'] },
        { q: 'How did the Renaissance change how people thought about the world?', a: 'it encouraged questioning authority, observation, individual achievement, and secular thinking', alts: ['questioned authority', 'new ways of thinking'] },
      ],
    },
    'reformation': {
      questions: [
        { q: 'What did Martin Luther protest in his 95 Theses?', a: 'the Catholic Church\'s sale of indulgences and corruption', alts: ['indulgences', 'church corruption'] },
        { q: 'What was the Protestant Reformation?', a: 'a movement that split Western Christianity into Catholic and Protestant branches', alts: ['split in christianity', 'catholic protestant divide'] },
        { q: 'How did the printing press help spread the Reformation?', a: 'Luther\'s ideas were printed and distributed quickly across Europe', alts: ['spread ideas fast', 'printed luthers writings'] },
        { q: 'What was the Counter-Reformation?', a: 'the Catholic Church\'s response to Protestantism, including reforms and the Council of Trent', alts: ['catholic response', 'church reform'] },
        { q: 'How did the Reformation affect politics in Europe?', a: 'it led to religious wars, shifted power from the Church to monarchs, and divided Europe', alts: ['religious wars', 'political division'] },
        { q: 'Why is the Reformation considered a turning point in world history?', a: 'it broke the unity of Western Christianity, promoted individual interpretation, and challenged authority', alts: ['changed religion forever', 'challenged church authority'] },
      ],
    },
    'exploration-motives': {
      questions: [
        { q: 'What were the three main motives for European exploration?', a: 'God (spread Christianity), Gold (wealth and trade), and Glory (fame and power)', alts: ['god gold glory'] },
        { q: 'What technological advances made long-distance sailing possible?', a: 'the compass, astrolabe, better maps, and improved ship designs like the caravel', alts: ['compass', 'caravel', 'navigation tools'] },
        { q: 'How did Portuguese exploration differ from Spanish exploration?', a: 'Portugal focused on trade routes around Africa to Asia; Spain sailed west across the Atlantic', alts: ['portugal went around africa', 'spain went west'] },
        { q: 'What was the impact of European colonization on indigenous peoples?', a: 'disease, conquest, forced labor, cultural destruction, and loss of land and autonomy', alts: ['disease and conquest', 'devastating impact'] },
        { q: 'How did the Treaty of Tordesillas divide the world?', a: 'it drew a line dividing newly discovered lands between Spain and Portugal', alts: ['divided world between spain and portugal'] },
        { q: 'Why is it problematic to call European arrival in the Americas a "discovery"?', a: 'millions of people already lived there — it was only new to Europeans', alts: ['people already lived there', 'not a discovery for natives'] },
      ],
    },
    'columbian-exchange': {
      questions: [
        { q: 'What was the Columbian Exchange?', a: 'the transfer of plants, animals, diseases, people, and ideas between the Americas and the Old World', alts: ['biological exchange', 'old and new world exchange'] },
        { q: 'How did European diseases affect indigenous populations?', a: 'diseases like smallpox killed an estimated 90% of Native Americans who had no immunity', alts: ['massive death toll', 'no immunity'] },
        { q: 'What foods traveled from the Americas to Europe?', a: 'potatoes, tomatoes, corn, chocolate, peppers, and tobacco', alts: ['potatoes tomatoes corn'] },
        { q: 'How did New World crops change the global population?', a: 'potatoes and corn were highly nutritious and easy to grow, contributing to population growth worldwide', alts: ['population growth', 'better nutrition'] },
        { q: 'What was the Atlantic slave trade?', a: 'the forced transport of millions of enslaved Africans to the Americas to work on plantations', alts: ['forced transport of africans', 'slavery'] },
        { q: 'How did the Columbian Exchange create our modern interconnected world?', a: 'it began the process of global exchange that continues today through trade, migration, and cultural blending', alts: ['started globalization', 'connected the world'] },
      ],
    },
    'scientific-revolution': {
      questions: [
        { q: 'What was the Scientific Revolution?', a: 'a period when scientists used observation and experimentation to challenge traditional beliefs about nature', alts: ['new approach to knowledge', 'observation over tradition'] },
        { q: 'What did Copernicus propose?', a: 'that the Earth revolves around the Sun (heliocentric model), challenging the Church\'s geocentric view', alts: ['heliocentric', 'earth goes around sun'] },
        { q: 'Why was Galileo put on trial by the Church?', a: 'for supporting the heliocentric model, which contradicted Church teaching', alts: ['supported copernicus', 'disagreed with church'] },
        { q: 'What was Newton\'s contribution to science?', a: 'he developed laws of motion and gravity that explained how the physical universe works', alts: ['gravity', 'laws of motion'] },
        { q: 'What is the scientific method?', a: 'a systematic process of observation, hypothesis, experimentation, and conclusion', alts: ['observe hypothesize test conclude'] },
        { q: 'How did the Scientific Revolution change the relationship between knowledge and authority?', a: 'it showed that truth comes from evidence and observation, not from tradition or religious authority', alts: ['evidence over authority', 'challenged tradition'] },
      ],
    },
    'enlightenment': {
      questions: [
        { q: 'What was the Enlightenment?', a: 'an intellectual movement emphasizing reason, individual rights, and questioning traditional authority', alts: ['age of reason', 'rational thinking movement'] },
        { q: 'What did John Locke argue about natural rights?', a: 'that all people are born with rights to life, liberty, and property that government must protect', alts: ['life liberty property', 'natural rights'] },
        { q: 'What did Montesquieu argue about government?', a: 'that power should be separated into branches to prevent tyranny', alts: ['separation of powers', 'divided government'] },
        { q: 'What did Rousseau believe about the social contract?', a: 'that government gets its authority from the consent of the governed', alts: ['consent of governed', 'people agree to government'] },
        { q: 'How did Enlightenment ideas lead to revolutions?', a: 'ideas about natural rights, consent, and limited government inspired people to challenge monarchies and fight for freedom', alts: ['inspired revolutions', 'challenged kings'] },
        { q: 'How do Enlightenment ideas still shape our world today?', a: 'they form the basis of modern democracy, human rights, and constitutional government', alts: ['basis of democracy', 'foundation of modern government'] },
      ],
    },
    'american-revolution-global': {
      questions: [
        { q: 'How did the American Revolution inspire other revolutions worldwide?', a: 'it proved that a colonial people could overthrow a monarchy and create a democratic government', alts: ['showed revolution was possible', 'inspired french revolution'] },
        { q: 'What Enlightenment ideas shaped the American Revolution?', a: 'natural rights, social contract, consent of the governed, and limited government', alts: ['locke montesquieu', 'natural rights'] },
        { q: 'How did the American Revolution influence the French Revolution?', a: 'French soldiers who fought in America brought democratic ideas home, and the Declaration inspired the French', alts: ['soldiers brought ideas back', 'french inspired by america'] },
        { q: 'Why is the American Revolution considered a world-changing event?', a: 'it was the first successful colonial revolution based on Enlightenment principles', alts: ['first democratic revolution', 'changed world politics'] },
        { q: 'What were the limitations of American revolutionary ideals?', a: 'slavery continued, women were excluded, and Native Americans lost land', alts: ['slavery', 'excluded women', 'not universal freedom'] },
        { q: 'How did the Constitution become a model for other nations?', a: 'its written constitution, separation of powers, and bill of rights influenced governments worldwide', alts: ['model constitution', 'influenced other countries'] },
      ],
    },
    'french-revolution': {
      questions: [
        { q: 'What caused the French Revolution?', a: 'inequality between social classes, financial crisis, Enlightenment ideas, and food shortages', alts: ['inequality', 'financial crisis', 'class conflict'] },
        { q: 'What was the significance of the storming of the Bastille?', a: 'it symbolized the people rising against royal authority and the start of the Revolution', alts: ['start of revolution', 'people vs monarchy'] },
        { q: 'What was the Reign of Terror?', a: 'a period when the revolutionary government executed thousands of perceived enemies, including the king', alts: ['mass executions', 'guillotine era'] },
        { q: 'How did Napoleon rise to power after the Revolution?', a: 'he gained fame as a military leader and took power in a coup, eventually crowning himself emperor', alts: ['military leader', 'coup', 'became emperor'] },
        { q: 'What did the French Revolution accomplish?', a: 'it ended absolute monarchy, established ideas of equality and citizenship, and inspired revolutions worldwide', alts: ['ended monarchy', 'spread equality ideas'] },
        { q: 'What does the French Revolution teach about the dangers of revolution?', a: 'revolutions can produce violence, instability, and new forms of tyranny before achieving their goals', alts: ['violence and instability', 'revolution can go wrong'] },
      ],
    },
    'latin-american-independence': {
      questions: [
        { q: 'What inspired Latin American independence movements?', a: 'the American and French Revolutions, Enlightenment ideas, and resentment of colonial rule', alts: ['enlightenment', 'other revolutions', 'colonial resentment'] },
        { q: 'Who was Simon Bolivar?', a: 'a Venezuelan leader who helped liberate several South American countries from Spanish rule', alts: ['liberator of south america', 'fought for independence'] },
        { q: 'What was the Haitian Revolution?', a: 'the first successful slave revolution, where enslaved Haitians overthrew French colonial rule in 1804', alts: ['slave revolution', 'haiti won independence'] },
        { q: 'Why was the Haitian Revolution globally significant?', a: 'it was the first successful revolution led by enslaved people and challenged the institution of slavery worldwide', alts: ['first slave revolution', 'challenged slavery'] },
        { q: 'How did colonial social structures shape independence movements?', a: 'creoles (American-born Europeans) led revolutions because they resented being ruled by European-born officials', alts: ['creoles led', 'resentment of colonial hierarchy'] },
        { q: 'What challenges did newly independent Latin American nations face?', a: 'political instability, economic inequality, caudillo rule, and continued social hierarchies', alts: ['instability', 'inequality', 'strongman rule'] },
      ],
    },
    'industrial-revolution': {
      questions: [
        { q: 'Why did the Industrial Revolution begin in Britain?', a: 'coal and iron resources, colonial markets, stable government, and innovation culture', alts: ['resources', 'colonies', 'innovation'] },
        { q: 'How did the factory system change work?', a: 'workers moved from farms to factories, working long hours in dangerous conditions for wages', alts: ['farm to factory', 'wage labor'] },
        { q: 'What were the social effects of industrialization?', a: 'urbanization, child labor, pollution, wealth inequality, and the growth of a middle class', alts: ['cities grew', 'inequality', 'new social classes'] },
        { q: 'How did industrialization create global inequality?', a: 'industrialized nations gained economic and military power over non-industrialized regions', alts: ['power imbalance', 'rich vs poor nations'] },
        { q: 'What is the connection between industrialization and imperialism?', a: 'industrial nations needed raw materials and markets, driving them to colonize other regions', alts: ['needed resources', 'colonized for materials'] },
        { q: 'How does the Industrial Revolution connect to our world today?', a: 'it created the modern economy, urbanization, environmental challenges, and debates about workers rights', alts: ['shaped modern world', 'still affects us'] },
      ],
    },
    'imperialism': {
      questions: [
        { q: 'What was imperialism?', a: 'the practice of powerful nations extending control over weaker regions for economic and strategic benefit', alts: ['powerful nations controlling weaker ones', 'colonial expansion'] },
        { q: 'What motivated European imperialism in Africa and Asia?', a: 'economic resources, strategic advantage, nationalism, racism, and a belief in civilizing mission', alts: ['resources', 'racism', 'national pride'] },
        { q: 'What was the Scramble for Africa?', a: 'European nations rapidly divided and colonized nearly all of Africa in the late 1800s', alts: ['europeans carved up africa', 'colonization of africa'] },
        { q: 'How did imperialism affect colonized peoples?', a: 'loss of land and resources, cultural destruction, forced labor, and artificial borders that ignored ethnic groups', alts: ['exploitation', 'cultural destruction', 'artificial borders'] },
        { q: 'What was Social Darwinism and how was it used to justify imperialism?', a: 'a misuse of Darwin\'s ideas to claim that some races were superior and had the right to dominate others', alts: ['racism disguised as science', 'justified domination'] },
        { q: 'How does the legacy of imperialism affect the world today?', a: 'artificial borders, economic inequality, cultural impacts, and political instability in former colonies', alts: ['lasting effects', 'borders that cause conflict'] },
      ],
    },
    'nationalism': {
      questions: [
        { q: 'What is nationalism?', a: 'strong identification with and loyalty to one\'s nation, often based on shared culture, language, or history', alts: ['loyalty to nation', 'national identity'] },
        { q: 'How did nationalism lead to the unification of Germany and Italy?', a: 'shared language, culture, and desire for self-governance drove movements to unite separate states into nations', alts: ['unified separate states', 'cultural unity'] },
        { q: 'How can nationalism be both positive and negative?', a: 'it can unite people and promote independence, but also cause conflict, exclusion, and aggression', alts: ['unifying and divisive', 'independence and conflict'] },
        { q: 'How did nationalism contribute to World War I?', a: 'competing nationalisms, especially in the Balkans, created tensions that helped trigger the war', alts: ['balkan tensions', 'competing nations'] },
        { q: 'What is self-determination?', a: 'the right of peoples to determine their own political status and government', alts: ['right to choose own government', 'peoples right to rule themselves'] },
        { q: 'How did nationalism affect colonies?', a: 'colonized peoples developed national identities and movements to achieve independence', alts: ['independence movements', 'anti-colonial nationalism'] },
      ],
    },
    'world-wars': {
      questions: [
        { q: 'What were the main causes of World War I?', a: 'militarism, alliances, imperialism, and nationalism — triggered by the assassination of Archduke Franz Ferdinand', alts: ['main causes', 'assassination triggered it'] },
        { q: 'How did World War I change the world?', a: 'it destroyed empires, redrew borders, killed millions, and set the stage for World War II', alts: ['ended empires', 'massive death toll'] },
        { q: 'What caused World War II?', a: 'Treaty of Versailles resentment, global depression, rise of fascism and Nazism, and appeasement failures', alts: ['versailles', 'fascism', 'hitler'] },
        { q: 'What was the Holocaust?', a: 'the systematic murder of six million Jews and millions of others by Nazi Germany', alts: ['nazi genocide', 'murder of jews'] },
        { q: 'How did World War II reshape the global order?', a: 'it created two superpowers (US and USSR), led to the United Nations, and began decolonization', alts: ['superpowers', 'united nations', 'cold war'] },
        { q: 'What lessons should the world learn from the World Wars?', a: 'the dangers of unchecked nationalism, the importance of international cooperation, and the need to protect human rights', alts: ['cooperation needed', 'protect human rights'] },
      ],
    },
    'decolonization': {
      questions: [
        { q: 'What was decolonization?', a: 'the process by which colonized nations gained independence from European imperial powers', alts: ['gaining independence', 'end of colonialism'] },
        { q: 'How did India gain independence?', a: 'through a nonviolent movement led by Mahatma Gandhi and political organizing by the Indian National Congress', alts: ['gandhi nonviolence', 'peaceful resistance'] },
        { q: 'What challenges did newly independent nations face?', a: 'arbitrary borders, ethnic conflicts, economic dependence, and Cold War interference', alts: ['instability', 'colonial legacy', 'economic problems'] },
        { q: 'What was apartheid in South Africa?', a: 'a system of racial segregation enforced by law that denied Black South Africans basic rights', alts: ['racial segregation', 'legalized racism'] },
        { q: 'Who was Nelson Mandela?', a: 'anti-apartheid leader who was imprisoned for 27 years and became South Africa\'s first Black president', alts: ['south african leader', 'ended apartheid'] },
        { q: 'How does the legacy of colonialism continue to affect the world?', a: 'through economic inequality, political instability, cultural impacts, and artificial borders that cause conflict', alts: ['lasting effects', 'ongoing inequality'] },
      ],
    },
    'cold-war-global': {
      questions: [
        { q: 'How did the Cold War affect countries around the world?', a: 'the US and USSR supported opposing sides in conflicts, coups, and proxy wars in Asia, Africa, and Latin America', alts: ['proxy wars', 'superpower interference'] },
        { q: 'What were proxy wars?', a: 'conflicts where the US and USSR supported opposing sides without directly fighting each other', alts: ['indirect wars', 'fought through other countries'] },
        { q: 'How did the Cold War shape the Korean and Vietnam Wars?', a: 'both were conflicts between communist and non-communist forces, supported by the USSR/China and US respectively', alts: ['communist vs non-communist', 'superpower backed'] },
        { q: 'What was the Non-Aligned Movement?', a: 'nations that refused to ally with either the US or USSR during the Cold War', alts: ['neutral nations', 'neither side'] },
        { q: 'How did the Cold War end?', a: 'the Soviet Union collapsed in 1991 due to economic problems, reforms, and nationalist movements', alts: ['soviet collapse', 'ussr fell apart'] },
        { q: 'What was the lasting global impact of the Cold War?', a: 'arms proliferation, regional conflicts, divided nations (Korea), and the spread of democracy and capitalism', alts: ['nuclear weapons', 'divided countries', 'ongoing conflicts'] },
      ],
    },
    'globalization': {
      questions: [
        { q: 'What is globalization?', a: 'the increasing interconnection of the world through trade, technology, culture, and communication', alts: ['world becoming connected', 'global interconnection'] },
        { q: 'How has technology driven globalization?', a: 'the internet, air travel, container shipping, and communication technology have made the world smaller', alts: ['internet', 'technology connects world'] },
        { q: 'What are the benefits of globalization?', a: 'economic growth, cultural exchange, access to goods and information, and cooperation on global problems', alts: ['economic benefits', 'cultural exchange'] },
        { q: 'What are the criticisms of globalization?', a: 'inequality, job losses, cultural homogenization, environmental damage, and exploitation of workers', alts: ['inequality', 'job losses', 'environmental harm'] },
        { q: 'How does globalization connect to historical trade networks?', a: 'modern global trade extends patterns that began with the Silk Road, Indian Ocean trade, and Columbian Exchange', alts: ['continuation of ancient trade', 'historical roots'] },
        { q: 'How does globalization affect your daily life?', a: 'the clothes you wear, food you eat, technology you use, and media you consume come from around the world', alts: ['everything is global', 'products from everywhere'] },
      ],
    },
    'human-rights': {
      questions: [
        { q: 'What is the Universal Declaration of Human Rights?', a: 'a 1948 UN document declaring fundamental rights that belong to all people regardless of nationality', alts: ['un rights document', 'fundamental rights for all'] },
        { q: 'What inspired the creation of the UDHR?', a: 'the horrors of World War II and the Holocaust showed the need for international human rights protections', alts: ['wwii and holocaust', 'prevent atrocities'] },
        { q: 'What is genocide?', a: 'the deliberate and systematic destruction of a racial, ethnic, religious, or national group', alts: ['systematic killing of a group', 'mass murder of a people'] },
        { q: 'Why do human rights violations continue despite international agreements?', a: 'enforcement is difficult, sovereignty limits intervention, and some governments prioritize power over rights', alts: ['hard to enforce', 'sovereignty issues'] },
        { q: 'How do citizens and organizations work to protect human rights?', a: 'through advocacy, documentation, international courts, sanctions, and public awareness campaigns', alts: ['advocacy', 'international courts', 'awareness'] },
        { q: 'What is the connection between studying history and protecting human rights?', a: 'understanding past atrocities helps us recognize warning signs and work to prevent future violations', alts: ['learn from past', 'prevent future atrocities'] },
      ],
    },
    'contemporary-challenges': {
      questions: [
        { q: 'How does climate change connect to world history?', a: 'industrialization and the burning of fossil fuels since the 1800s have caused global warming', alts: ['industrial revolution caused it', 'fossil fuels'] },
        { q: 'What is the refugee crisis and what causes it?', a: 'millions of people displaced by war, persecution, and climate change seeking safety in other countries', alts: ['war and persecution', 'displaced people'] },
        { q: 'How does economic inequality between nations connect to historical patterns?', a: 'colonialism, imperialism, and unequal trade relationships created patterns of wealth and poverty that persist', alts: ['colonial legacy', 'historical exploitation'] },
        { q: 'Why is understanding multiple perspectives important for addressing global challenges?', a: 'complex problems require understanding different experiences, values, and priorities', alts: ['need different viewpoints', 'complex problems need diverse perspectives'] },
        { q: 'What role do international organizations play in addressing global issues?', a: 'the UN, WHO, World Bank, and others coordinate responses to problems that cross national borders', alts: ['coordinate global responses', 'un and other organizations'] },
        { q: 'How can studying world history help us build a better future?', a: 'it reveals patterns, teaches empathy, shows consequences of choices, and helps us learn from both successes and failures', alts: ['learn from past', 'understand patterns'] },
      ],
    },
  },
};

// File I/O
function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }
function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }
function loadProfile(id) { const fp = profilePath(id); if (fs.existsSync(fp)) { try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); } } return { studentId: id, grade: null, createdAt: new Date().toISOString(), assessments: [], skills: {} }; }
function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }

// Helpers
function calcMastery(attempts) { if (!attempts || !attempts.length) return 0; const recent = attempts.slice(-5).filter(a => a.total > 0); return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0; }
function masteryLabel(r) { return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started'; }
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }
function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

function generateExercise(grade, skill, count = 5) { const bank = CONTENT_BANKS[grade]?.[skill]; if (!bank) return { error: `No content bank for ${grade}/${skill}` }; if (bank.questions) { const items = pick(bank.questions, count).map(q => ({ prompt: q.q, answer: q.a, acceptedAnswers: q.alts || [] })); return { type: 'short-answer', skill, grade, count: items.length, instruction: 'Answer each question.', items }; } return { error: `Cannot generate exercise for ${grade}/${skill}` }; }
function checkAnswer(type, expected, answer) { if (Array.isArray(expected)) return expected.some(r => norm(r) === norm(answer)); return norm(expected) === norm(answer); }

class MSWorldHistory {
  getProfile(id) { const p = loadProfile(id); return { studentId: p.studentId, grade: p.grade, createdAt: p.createdAt, totalAssessments: p.assessments.length }; }
  setGrade(id, grade) { if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}. Valid: ${Object.keys(SKILLS).join(', ')}`); const p = loadProfile(id); p.grade = grade; saveProfile(p); return { studentId: id, grade }; }
  recordAssessment(id, grade, category, skill, score, total, notes = '') { if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}`); if (!SKILLS[grade][category]) throw new Error(`Unknown category '${category}' for ${grade}`); if (!SKILLS[grade][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${grade}/${category}`); if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive'); if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`); const p = loadProfile(id); if (!p.grade) p.grade = grade; const entry = { date: new Date().toISOString(), grade, category, skill, score, total, notes }; p.assessments.push(entry); const key = `${grade}/${category}/${skill}`; if (!p.skills[key]) p.skills[key] = { attempts: [] }; p.skills[key].attempts.push({ date: entry.date, score, total }); p.skills[key].mastery = calcMastery(p.skills[key].attempts); p.skills[key].label = masteryLabel(p.skills[key].mastery); saveProfile(p); return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label }; }
  getProgress(id) { const p = loadProfile(id); const grade = p.grade || 'grade-6'; const gs = SKILLS[grade] || {}; const results = {}; let mastered = 0, total = 0; for (const [cat, skills] of Object.entries(gs)) { results[cat] = {}; for (const sk of skills) { total++; const d = p.skills[`${grade}/${cat}/${sk}`]; results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' }; if (d && d.mastery >= MASTERY_THRESHOLD) mastered++; } } return { studentId: id, grade, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results }; }
  getNextSkills(id, count = 5) { const p = loadProfile(id); const grade = p.grade || 'grade-6'; const candidates = []; for (const [cat, skills] of Object.entries(SKILLS[grade] || {})) { for (const sk of skills) { const d = p.skills[`${grade}/${cat}/${sk}`]; const m = d ? d.mastery : 0; if (m < MASTERY_THRESHOLD) candidates.push({ grade, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' }); } } const order = { developing: 0, emerging: 1, 'not-started': 2 }; candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery); return { studentId: id, grade, next: candidates.slice(0, count) }; }
  getReport(id) { const p = loadProfile(id); return { studentId: id, grade: p.grade, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }
  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }
  getSkillCatalog(grade) { const gs = SKILLS[grade]; if (!gs) return { grade, error: `Unknown grade. Valid: ${Object.keys(SKILLS).join(', ')}` }; let total = 0; const catalog = {}; for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; } return { grade, skills: catalog, totalSkills: total }; }
  generateExercise(grade, skill, count = 5) { return generateExercise(grade, skill, count); }
  checkAnswer(type, expected, answer) { let exp = expected; if (typeof exp === 'string') { const bank = Object.values(CONTENT_BANKS).flatMap(g => Object.values(g)).find(b => b.questions?.some(q => q.a === exp)); if (bank) { const q = bank.questions.find(q => q.a === exp); if (q && q.alts) exp = [exp, ...q.alts]; } } return { correct: checkAnswer(type, exp, answer), expected, studentAnswer: answer }; }
  generateLesson(id) { const p = loadProfile(id); const grade = p.grade || 'grade-6'; const target = this.getNextSkills(id, 3).next[0]; if (!target) return { message: `All skills at ${grade} level are proficient!`, grade }; const exercise = generateExercise(grade, target.skill, 5); return { studentId: id, grade, targetSkill: target, exercise, lessonPlan: { hook: 'Present a compelling question or artifact (3 min)', teach: `Introduce/reinforce: ${target.category} > ${target.skill}`, practice: `Complete ${exercise.count || 0} practice items`, think: 'Analyze patterns: geography, cause/effect, perspectives', connect: 'Cross-civilization comparison and connection to today' } }; }
}

module.exports = MSWorldHistory;

if (require.main === module) {
  const args = process.argv.slice(2); const cmd = args[0]; const api = new MSWorldHistory(); const out = d => console.log(JSON.stringify(d, null, 2));
  try { switch (cmd) {
    case 'start': { const [, id, grade] = args; if (!id) throw new Error('Usage: start <id> [grade]'); if (grade) api.setGrade(id, grade); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
    case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
    case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const grade = loadProfile(id).grade || 'grade-6'; if (skill) { out(api.generateExercise(grade, skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
    case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); let exp = expected; try { exp = JSON.parse(expected); } catch {} out(api.checkAnswer(type, exp, answer)); break; }
    case 'record': { const [, id, grade, cat, skill, sc, tot, ...notes] = args; if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total>'); out(api.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
    case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
    case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
    case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
    case 'catalog': { const [, g] = args; out(g ? api.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
    case 'students': { out(api.listStudents()); break; }
    case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(api.setGrade(id, g)); break; }
    default: out({ usage: 'node world-history.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade'], grades: Object.keys(SKILLS) });
  } } catch (err) { out({ error: err.message }); process.exit(1); }
}
