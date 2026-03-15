// eClaw HS World History Interactive Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-socialstudies-world-history');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'ancient-civilizations': {
    name: 'Ancient Civilizations (to 600 BCE)',
    topics: ['mesopotamia', 'egypt', 'indus-valley', 'shang-china', 'mesoamerica', 'early-agriculture'],
  },
  'classical-era': {
    name: 'Classical Era (600 BCE-600 CE)',
    topics: ['greece-rome', 'han-china', 'maurya-gupta', 'persia', 'trade-networks', 'belief-systems'],
  },
  'post-classical': {
    name: 'Post-Classical (600-1450)',
    topics: ['islamic-golden-age', 'tang-song', 'mongol-empire', 'mali-songhai', 'byzantium', 'silk-roads'],
  },
  'early-modern': {
    name: 'Early Modern (1450-1750)',
    topics: ['maritime-empires', 'columbian-exchange', 'gunpowder-empires', 'atlantic-slave-trade', 'reformation'],
  },
  'age-of-revolutions': {
    name: 'Age of Revolutions (1750-1900)',
    topics: ['enlightenment', 'american-revolution', 'french-revolution', 'haitian-revolution', 'latin-american-independence', 'industrialization'],
  },
  'imperialism-wwi': {
    name: 'Imperialism & WWI (1750-1918)',
    topics: ['scramble-for-africa', 'opium-wars', 'meiji-japan', 'nationalism', 'wwi-causes', 'wwi-consequences'],
  },
  'interwar-wwii': {
    name: 'Interwar Period & WWII (1918-1945)',
    topics: ['treaty-of-versailles', 'rise-of-fascism', 'great-depression-global', 'wwii-causes', 'holocaust', 'wwii-consequences'],
  },
  'cold-war-globalization': {
    name: 'Cold War & Globalization (1945-Present)',
    topics: ['cold-war-origins', 'decolonization', 'proxy-wars', 'fall-of-ussr', 'globalization', 'human-rights'],
  },
};

const QUESTION_BANKS = {
  'ancient-civilizations': [
    { type: 'mc', q: 'The Neolithic Revolution refers to:', choices: ['The invention of writing', 'The shift from hunting-gathering to agriculture', 'The rise of empires', 'The invention of the wheel'], answer: 'B', explanation: 'The Neolithic Revolution was the transition from nomadic hunting-gathering to settled agriculture, enabling population growth, surplus, and the rise of civilizations.' },
    { type: 'mc', q: 'Mesopotamia\'s location between the Tigris and Euphrates rivers earned it the name:', choices: ['Fertile Crescent', 'Land of the Nile', 'Middle Kingdom', 'Indus Valley'], answer: 'A', explanation: 'Mesopotamia ("land between rivers") was part of the Fertile Crescent, where river flooding provided rich soil for agriculture.' },
    { type: 'mc', q: 'The Code of Hammurabi is significant because:', choices: ['It established democracy', 'It was one of the earliest written legal codes', 'It abolished slavery', 'It unified all of Mesopotamia'], answer: 'B', explanation: 'Hammurabi\'s Code (c. 1754 BCE) was one of the earliest comprehensive written legal codes, establishing the principle that laws should be publicly known.' },
    { type: 'mc', q: 'Egyptian civilization developed primarily along:', choices: ['The Mediterranean coast', 'The Nile River', 'The Red Sea', 'The Sahara oases'], answer: 'B', explanation: 'Egyptian civilization depended on the Nile\'s annual flooding, which deposited fertile silt for agriculture in an otherwise desert environment.' },
    { type: 'sa', q: 'Why was the development of writing significant for early civilizations?', answer: 'record', explanation: 'Writing (cuneiform, hieroglyphics) enabled record-keeping for trade and taxes, preservation of laws and religious texts, communication across distances, and transmission of knowledge across generations.' },
    { type: 'mc', q: 'The caste system originated in:', choices: ['China', 'Mesopotamia', 'India', 'Egypt'], answer: 'C', explanation: 'The caste system developed in ancient India, creating a rigid social hierarchy (Brahmins, Kshatriyas, Vaishyas, Shudras, and Dalits) tied to religious beliefs about purity and dharma.' },
    { type: 'sa', q: 'Compare the geographic advantages of Mesopotamia and Egypt for developing civilizations.', answer: 'rivers', explanation: 'Both relied on river systems for agriculture. The Nile flooded predictably, while the Tigris-Euphrates flooded unpredictably. Egypt was protected by deserts, while Mesopotamia was open to invasion.' },
    { type: 'mc', q: 'The Indus Valley civilization is notable for its:', choices: ['Military conquests', 'Advanced urban planning and sanitation', 'Written literature', 'Iron weapons'], answer: 'B', explanation: 'Harappa and Mohenjo-Daro featured sophisticated urban planning with grid streets, standardized brick sizes, and advanced drainage and sanitation systems.' },
    { type: 'mc', q: 'Shang Dynasty China is best known for:', choices: ['The Great Wall', 'Bronze working and oracle bones', 'The Silk Road', 'Paper invention'], answer: 'B', explanation: 'The Shang Dynasty (c. 1600-1046 BCE) developed sophisticated bronze casting and used oracle bones for divination, providing early Chinese written records.' },
    { type: 'sa', q: 'What role did religion play in early civilizations?', answer: 'authority', explanation: 'Religion legitimized political authority (divine kingship), organized social behavior through moral codes, explained natural phenomena, and motivated monumental construction (pyramids, ziggurats, temples).' },
  ],
  'classical-era': [
    { type: 'mc', q: 'Athenian democracy differed from modern democracy in that:', choices: ['Only free adult male citizens could participate', 'All residents could vote', 'Women held most political offices', 'It used a representative system'], answer: 'A', explanation: 'Athenian democracy was direct but limited — only free adult male citizens could participate, excluding women, slaves, and foreign residents.' },
    { type: 'mc', q: 'The Silk Road facilitated exchange of:', choices: ['Only silk', 'Goods, ideas, diseases, and technologies', 'Only military alliances', 'Only religious texts'], answer: 'B', explanation: 'The Silk Road was a vast network exchanging goods (silk, spices, metals), ideas (religions, philosophy), technologies (paper, gunpowder), and diseases across Eurasia.' },
    { type: 'mc', q: 'The Roman Republic fell primarily due to:', choices: ['Foreign invasion', 'Internal power struggles, inequality, and civil wars', 'Natural disaster', 'Religious conflict'], answer: 'B', explanation: 'The Republic collapsed through civil wars (Caesar, Pompey, Octavian), land inequality, political corruption, and the concentration of military power in individual commanders.' },
    { type: 'mc', q: 'Confucianism emphasizes:', choices: ['Individual salvation', 'Social harmony through proper relationships and duty', 'Military conquest', 'Rejection of worldly life'], answer: 'B', explanation: 'Confucianism focuses on social harmony, filial piety, respect for hierarchy, education, and proper conduct in the five key relationships.' },
    { type: 'sa', q: 'How did the Han Dynasty and Roman Empire compare in terms of governance?', answer: 'bureaucracy', explanation: 'Both administered vast territories — Rome through provincial governors and legions, Han through a centralized bureaucracy with civil service examinations. Both faced challenges of distance and diversity.' },
    { type: 'mc', q: 'The Maurya Empire under Ashoka is notable for:', choices: ['Military expansion through conquest', 'Spreading Buddhism and promoting tolerance after Kalinga', 'Establishing the caste system', 'Conquering China'], answer: 'B', explanation: 'After the brutal conquest of Kalinga, Ashoka converted to Buddhism and promoted nonviolence, tolerance, and dharma throughout his empire.' },
    { type: 'mc', q: 'The fall of the Western Roman Empire (476 CE) is attributed to:', choices: ['A single cause', 'Multiple factors including invasions, economic decline, and political instability', 'Volcanic eruption', 'Muslim conquest'], answer: 'B', explanation: 'Rome\'s fall resulted from Germanic invasions, economic decline, political instability, military overextension, and the splitting of the empire.' },
    { type: 'sa', q: 'Why were trade networks significant in the classical era?', answer: 'connection', explanation: 'Trade networks (Silk Road, Indian Ocean, Mediterranean) connected civilizations, spreading goods, technologies, religions (Buddhism, Christianity, Hinduism), and diseases, creating an increasingly interconnected world.' },
    { type: 'mc', q: 'The spread of Buddhism from India to East Asia is an example of:', choices: ['Forced conversion', 'Cultural diffusion through trade and missionaries', 'Military conquest', 'Political decree'], answer: 'B', explanation: 'Buddhism spread through trade routes (especially the Silk Road), traveling merchants, missionaries, and royal patronage, adapting to local cultures (Mahayana in East Asia).' },
    { type: 'mc', q: 'The Persian Empire under Cyrus the Great was notable for:', choices: ['Destroying conquered cultures', 'Religious and cultural tolerance of conquered peoples', 'Isolationism', 'Democracy'], answer: 'B', explanation: 'Cyrus practiced tolerance, allowing conquered peoples to maintain their customs and religions (famously freeing the Jews from Babylonian captivity), creating a stable multi-ethnic empire.' },
  ],
  'post-classical': [
    { type: 'mc', q: 'The Islamic Golden Age (750-1258) was characterized by:', choices: ['Military decline', 'Advances in science, mathematics, medicine, and philosophy', 'Rejection of Greek knowledge', 'Isolation from other civilizations'], answer: 'B', explanation: 'The Islamic Golden Age saw major advances in algebra, optics, medicine, astronomy, and philosophy, preserving and building on Greek, Persian, and Indian knowledge.' },
    { type: 'mc', q: 'The Mongol Empire\'s most lasting impact was:', choices: ['Spreading Christianity', 'Facilitating trade and exchange across Eurasia (Pax Mongolica)', 'Introducing democracy', 'Ending all warfare in Asia'], answer: 'B', explanation: 'The Pax Mongolica created safe trade routes across Eurasia, facilitating exchange of goods, ideas, and technologies between East and West.' },
    { type: 'mc', q: 'The Song Dynasty is known for innovations including:', choices: ['The alphabet', 'Gunpowder, compass, and movable type printing', 'Democracy', 'Monotheism'], answer: 'B', explanation: 'Song China (960-1279) produced transformative innovations including gunpowder, the magnetic compass, movable type printing, and paper money.' },
    { type: 'mc', q: 'Mansa Musa\'s famous pilgrimage to Mecca demonstrated:', choices: ['Mali\'s military power', 'Mali\'s extraordinary wealth and connection to Islamic world', 'African isolation', 'The decline of Trans-Saharan trade'], answer: 'B', explanation: 'Mansa Musa\'s 1324 hajj, distributing so much gold it depressed prices in Egypt, demonstrated Mali\'s vast wealth from Trans-Saharan gold-salt trade and its Islamic connections.' },
    { type: 'sa', q: 'How did the Crusades affect cultural exchange between Europe and the Islamic world?', answer: 'exchange', explanation: 'The Crusades increased European exposure to Islamic science, medicine, mathematics, and luxury goods, stimulating trade, intellectual exchange, and demand for Asian products.' },
    { type: 'mc', q: 'The Byzantine Empire preserved and transmitted:', choices: ['Only military technology', 'Greco-Roman culture, law, and Christianity', 'Chinese technology', 'Persian religion'], answer: 'B', explanation: 'Byzantium preserved Greco-Roman learning, Roman law (Justinian\'s Code), and Orthodox Christianity, transmitting classical knowledge to both the Islamic world and later Western Europe.' },
    { type: 'mc', q: 'The Indian Ocean trade network was unique because:', choices: ['It was controlled by one empire', 'It relied on monsoon winds and was multi-cultural', 'It only traded spices', 'It was exclusively Islamic'], answer: 'B', explanation: 'Indian Ocean trade was shaped by monsoon winds and involved diverse participants (Arab, Indian, Chinese, Southeast Asian, African) exchanging goods, religions, and technologies.' },
    { type: 'sa', q: 'What factors enabled the rapid expansion of Islam in the post-classical era?', answer: 'trade', explanation: 'Islam spread through trade networks, military conquest, the appeal of its egalitarian message, Sufi missionaries, and political patronage, reaching from Spain to Southeast Asia.' },
    { type: 'mc', q: 'Feudalism in medieval Europe was characterized by:', choices: ['Strong central government', 'A decentralized system of lords, vassals, and serfs', 'Democratic governance', 'Urban commercial economy'], answer: 'B', explanation: 'European feudalism was a decentralized political and economic system based on land grants (fiefs) exchanged for military service, with serfs tied to the land.' },
    { type: 'mc', q: 'Champa rice from Vietnam was significant because:', choices: ['It was a luxury trade good', 'It allowed multiple harvests per year, boosting Chinese population', 'It was used for medicine', 'It was a military innovation'], answer: 'B', explanation: 'Fast-ripening Champa rice allowed double or triple harvesting in southern China, dramatically increasing food production and enabling population growth during the Song Dynasty.' },
  ],
  'early-modern': [
    { type: 'mc', q: 'The Columbian Exchange resulted in:', choices: ['Only positive outcomes', 'Transfer of crops, animals, and diseases between hemispheres', 'European isolation', 'African colonization of the Americas'], answer: 'B', explanation: 'The Columbian Exchange transferred plants (potatoes, maize, tobacco), animals (horses, cattle), and diseases (smallpox) between the Americas and Afro-Eurasia, with devastating effects on Indigenous populations.' },
    { type: 'mc', q: 'The Atlantic slave trade was driven primarily by:', choices: ['African military aggression', 'European demand for plantation labor in the Americas', 'Religious conversion efforts', 'Natural migration patterns'], answer: 'B', explanation: 'The Atlantic slave trade was driven by European colonial demand for labor on sugar, tobacco, and cotton plantations in the Americas, forcibly transporting millions of Africans.' },
    { type: 'mc', q: 'The Ottoman Empire was considered a "gunpowder empire" because:', choices: ['It invented gunpowder', 'It used firearms and artillery to build and maintain power', 'It traded gunpowder exclusively', 'It banned gunpowder use'], answer: 'B', explanation: 'The Ottoman, Safavid, and Mughal empires all used gunpowder weapons to conquer territory and centralize power, earning the collective label "gunpowder empires."' },
    { type: 'mc', q: 'The Protestant Reformation was sparked by:', choices: ['The Crusades', 'Martin Luther\'s 95 Theses criticizing Church practices', 'The fall of Constantinople', 'The discovery of the Americas'], answer: 'B', explanation: 'Luther\'s 1517 challenge to indulgences and papal authority sparked the Reformation, leading to the fragmentation of Western Christianity and religious wars.' },
    { type: 'sa', q: 'How did maritime exploration change global trade patterns after 1450?', answer: 'oceanic', explanation: 'European maritime exploration shifted trade from overland Silk Road routes to oceanic routes, connecting the Americas to global trade, establishing colonial empires, and creating the first truly global economy.' },
    { type: 'mc', q: 'The encomienda system was:', choices: ['A form of democratic governance', 'A labor system granting colonists control over Indigenous workers', 'A trade agreement', 'A religious order'], answer: 'B', explanation: 'The encomienda system granted Spanish colonists the right to demand labor from Indigenous people, functioning as a form of forced labor that devastated native populations.' },
    { type: 'mc', q: 'The Mughal Empire was notable for:', choices: ['Rejecting all foreign influences', 'Blending Islamic and Hindu cultural elements under Akbar', 'Establishing democracy in India', 'Conquering China'], answer: 'B', explanation: 'Under Akbar, the Mughal Empire practiced religious tolerance, abolished the jizya tax on non-Muslims, and fostered a cultural synthesis of Islamic and Hindu traditions.' },
    { type: 'sa', q: 'What were the long-term effects of the Atlantic slave trade on Africa?', answer: 'depopulation', explanation: 'The slave trade caused massive depopulation, disrupted existing political systems, fueled internal warfare, distorted economies toward slave-raiding, and created lasting underdevelopment.' },
    { type: 'mc', q: 'Mercantilism held that:', choices: ['Free trade benefits all nations', 'A nation\'s wealth is measured by gold and a favorable trade balance', 'Colonies should be independent', 'Agriculture is more important than trade'], answer: 'B', explanation: 'Mercantilism held that national wealth depended on accumulating gold and silver through a favorable balance of trade, with colonies providing raw materials and captive markets.' },
    { type: 'mc', q: 'The Qing Dynasty\'s relationship with European traders was characterized by:', choices: ['Eager embrace of Western goods', 'Restrictions through the Canton system and limited trade', 'Military alliance', 'Complete isolation'], answer: 'B', explanation: 'The Qing limited European trade to the port of Canton (Guangzhou) through the Canton system, reflecting China\'s view of itself as self-sufficient and Europeans as culturally inferior.' },
  ],
  'age-of-revolutions': [
    { type: 'mc', q: 'The Enlightenment\'s most influential political idea was:', choices: ['Divine right of kings', 'Natural rights and the social contract', 'Theocracy', 'Absolute monarchy'], answer: 'B', explanation: 'Enlightenment thinkers (Locke, Rousseau, Montesquieu) challenged divine right with ideas of natural rights, social contract, separation of powers, and popular sovereignty.' },
    { type: 'mc', q: 'The French Revolution\'s radical phase (1793-94) is known as:', choices: ['The Enlightenment', 'The Reign of Terror', 'The Restoration', 'The Thermidorian Reaction'], answer: 'B', explanation: 'The Reign of Terror under Robespierre saw mass executions by guillotine, radical social reforms, and the suppression of perceived enemies of the revolution.' },
    { type: 'mc', q: 'The Haitian Revolution (1791-1804) was significant because:', choices: ['It was led by European colonists', 'It was the only successful slave revolution leading to independence', 'It reinforced colonial power', 'It was a peaceful transition'], answer: 'B', explanation: 'Led by Toussaint Louverture and Jean-Jacques Dessalines, Haiti became the first nation founded by formerly enslaved people and the second independent nation in the Americas.' },
    { type: 'mc', q: 'The Industrial Revolution began in Britain because of:', choices: ['Government central planning', 'Coal, capital, colonies, and key inventions', 'Foreign aid', 'Religious reform'], answer: 'B', explanation: 'Britain industrialized first due to abundant coal and iron, colonial markets and raw materials, capital from trade, a stable government, and key inventions like the steam engine.' },
    { type: 'sa', q: 'How did the ideas of the Enlightenment influence the Atlantic revolutions?', answer: 'rights', explanation: 'Enlightenment ideas of natural rights, popular sovereignty, and social contract provided the intellectual justification for the American, French, Haitian, and Latin American revolutions against monarchical and colonial rule.' },
    { type: 'mc', q: 'Simon Bolivar sought to:', choices: ['Maintain Spanish colonial rule', 'Liberate South America from Spanish control', 'Establish a monarchy', 'Conquer North America'], answer: 'B', explanation: 'Bolivar led independence movements across South America (Venezuela, Colombia, Ecuador, Peru, Bolivia), envisioning a united Latin America free from Spanish rule.' },
    { type: 'mc', q: 'A major consequence of industrialization was:', choices: ['Rural population growth', 'Urbanization, new social classes, and labor exploitation', 'Decreased production', 'Return to feudalism'], answer: 'B', explanation: 'Industrialization drove massive urbanization, created a new industrial working class and bourgeoisie, and led to harsh working conditions that sparked labor movements.' },
    { type: 'sa', q: 'Compare the causes of the American and French Revolutions.', answer: 'taxation', explanation: 'Both involved taxation grievances and Enlightenment ideals, but France had deeper class inequality (Three Estates), widespread poverty, and a more radical social revolution, while America focused on colonial self-governance.' },
    { type: 'mc', q: 'Nationalism in the 19th century led to:', choices: ['Only peaceful unification', 'Both unification movements (Italy, Germany) and independence movements', 'The end of all empires', 'Global peace'], answer: 'B', explanation: 'Nationalism drove unification (Italy, Germany) and independence movements (Greece, Latin America), while also fueling ethnic tensions and imperial competition.' },
    { type: 'mc', q: 'The abolition of slavery in the 19th century was driven by:', choices: ['Economic factors alone', 'Moral, economic, and political factors', 'Military defeat of all slaveholding nations', 'Religious decree'], answer: 'B', explanation: 'Abolition resulted from moral arguments (Enlightenment, religious movements), economic shifts (industrialization made free labor more profitable), slave resistance, and political activism.' },
  ],
  'imperialism-wwi': [
    { type: 'mc', q: 'The Berlin Conference (1884-85) resulted in:', choices: ['African independence', 'European partition of Africa with no African representation', 'A trade agreement with Africa', 'The abolition of slavery'], answer: 'B', explanation: 'European powers divided Africa among themselves at the Berlin Conference without any African participation, imposing arbitrary borders that ignored ethnic and cultural boundaries.' },
    { type: 'mc', q: 'The Opium Wars demonstrated:', choices: ['Chinese military superiority', 'The power of Western industrialized militaries over non-industrialized nations', 'Chinese embrace of Western culture', 'Mutual respect between civilizations'], answer: 'B', explanation: 'Britain\'s victories in the Opium Wars (1839-42, 1856-60) forced China to open ports and cede Hong Kong, demonstrating the military advantage of industrialized nations.' },
    { type: 'mc', q: 'Japan\'s Meiji Restoration (1868) aimed to:', choices: ['Restore feudalism', 'Rapidly modernize and industrialize to resist Western imperialism', 'Isolate Japan from the world', 'Spread Buddhism'], answer: 'B', explanation: 'The Meiji Restoration ended the Tokugawa shogunate and rapidly modernized Japan through industrialization, Western-style military, and education reforms to prevent colonization.' },
    { type: 'mc', q: 'WWI was triggered by:', choices: ['The invasion of Poland', 'The assassination of Archduke Franz Ferdinand and alliance systems', 'Economic depression', 'Colonial revolution'], answer: 'B', explanation: 'The assassination of Archduke Franz Ferdinand in Sarajevo (1914) triggered a chain reaction through alliance systems (Triple Alliance vs. Triple Entente), escalating into global war.' },
    { type: 'sa', q: 'How did Social Darwinism justify imperialism?', answer: 'superiority', explanation: 'Social Darwinism applied "survival of the fittest" to races and nations, claiming European dominance proved racial superiority and justified colonizing "inferior" peoples as a civilizing mission.' },
    { type: 'mc', q: 'The Sepoy Rebellion (1857) in India resulted in:', choices: ['Indian independence', 'Transfer of control from East India Company to British Crown', 'British withdrawal from India', 'Democracy in India'], answer: 'B', explanation: 'After the Sepoy Rebellion, the British Crown took direct control of India from the East India Company, establishing the British Raj that lasted until 1947.' },
    { type: 'mc', q: 'Trench warfare in WWI resulted in:', choices: ['Quick victories', 'A devastating stalemate with massive casualties', 'Naval supremacy', 'Colonial independence'], answer: 'B', explanation: 'Trench warfare on the Western Front created a bloody stalemate, with millions dying in battles over small amounts of territory, defining the war\'s horrific character.' },
    { type: 'sa', q: 'What were the long-term causes of WWI beyond the immediate trigger?', answer: 'militarism', explanation: 'Long-term causes included militarism (arms race), alliance systems, imperialism (colonial rivalries), and nationalism (ethnic tensions in Austria-Hungary and the Balkans) — often summarized as MAIN.' },
    { type: 'mc', q: 'The Treaty of Versailles placed primary blame for WWI on:', choices: ['Austria-Hungary', 'Germany through the War Guilt Clause', 'Russia', 'The Ottoman Empire'], answer: 'B', explanation: 'Article 231 (War Guilt Clause) blamed Germany for WWI, imposing harsh reparations, territorial losses, and military restrictions that fueled resentment and contributed to WWII.' },
    { type: 'mc', q: 'European justifications for imperialism included:', choices: ['Only economic motives', 'Economic gain, strategic advantage, and the "civilizing mission"', 'Genuine desire for equality', 'Scientific research only'], answer: 'B', explanation: 'Europeans justified imperialism through economic exploitation, strategic competition, Social Darwinism, the "white man\'s burden," and religious missionary work.' },
  ],
  'interwar-wwii': [
    { type: 'mc', q: 'The rise of fascism in the 1920s-30s was fueled by:', choices: ['Economic prosperity', 'Economic crisis, national humiliation, and fear of communism', 'Colonial independence movements', 'Religious revival'], answer: 'B', explanation: 'Fascism rose in Italy, Germany, and Japan due to post-WWI economic devastation, national humiliation (especially Germany\'s Treaty of Versailles resentment), and fear of communist revolution.' },
    { type: 'mc', q: 'The policy of appeasement toward Hitler culminated in:', choices: ['The Munich Agreement allowing German annexation of Sudetenland', 'The Treaty of Versailles', 'The bombing of Pearl Harbor', 'The Yalta Conference'], answer: 'A', explanation: 'The Munich Agreement (1938) allowed Hitler to annex the Sudetenland, with Britain and France hoping to avoid war, but it emboldened further German aggression.' },
    { type: 'mc', q: 'The Holocaust resulted in the murder of approximately:', choices: ['1 million people', '6 million Jews and millions of others', '100,000 people', '10,000 people'], answer: 'B', explanation: 'The Holocaust systematically murdered approximately 6 million Jews along with millions of Roma, disabled people, LGBTQ individuals, political opponents, and others.' },
    { type: 'mc', q: 'Japan\'s invasion of Manchuria (1931) demonstrated:', choices: ['League of Nations effectiveness', 'The failure of collective security and the League of Nations', 'Chinese military strength', 'US-Japan alliance'], answer: 'B', explanation: 'Japan\'s invasion of Manchuria and the League\'s inability to respond effectively demonstrated the failure of collective security, emboldening further aggression.' },
    { type: 'sa', q: 'How did the Great Depression contribute to the rise of totalitarianism?', answer: 'desperation', explanation: 'Economic devastation created mass unemployment and desperation, making populations receptive to authoritarian leaders who promised order, employment, and national revival (Hitler, Mussolini).' },
    { type: 'mc', q: 'The atomic bombings of Hiroshima and Nagasaki:', choices: ['Had no effect on the war', 'Led to Japan\'s surrender and raised ethical questions about nuclear weapons', 'Were ordered by Stalin', 'Targeted military bases only'], answer: 'B', explanation: 'The bombings killed over 200,000 people, led to Japan\'s surrender, ended WWII, and opened the nuclear age with profound ethical debates about targeting civilians.' },
    { type: 'mc', q: 'Total war in WWII meant:', choices: ['Only soldiers were involved', 'Entire societies — military and civilian — were mobilized for war', 'Wars were fought only at sea', 'Diplomacy replaced combat'], answer: 'B', explanation: 'Total war mobilized entire societies for the war effort, blurring the line between military and civilian targets, including strategic bombing, rationing, and propaganda.' },
    { type: 'sa', q: 'What were the major outcomes of WWII?', answer: 'superpower', explanation: 'WWII resulted in the emergence of US-Soviet superpowers, the United Nations, decolonization movements, the Nuremberg Trials, the beginning of the Cold War, and a new international order.' },
    { type: 'mc', q: 'Stalin\'s Five-Year Plans aimed to:', choices: ['Democratize the USSR', 'Rapidly industrialize the Soviet Union through centralized planning', 'Establish free trade', 'Reduce military spending'], answer: 'B', explanation: 'Stalin\'s Five-Year Plans (starting 1928) rapidly industrialized the USSR through centralized economic planning, collectivized agriculture, and massive human cost including famines.' },
    { type: 'mc', q: 'The Weimar Republic failed primarily because of:', choices: ['Foreign invasion', 'Economic crisis, political extremism, and constitutional weaknesses', 'Religious conflict', 'Colonial revolt'], answer: 'B', explanation: 'The Weimar Republic collapsed under hyperinflation, the Great Depression, political violence from left and right, and constitutional provisions that enabled Hitler\'s rise.' },
  ],
  'cold-war-globalization': [
    { type: 'mc', q: 'The Cold War was primarily a conflict between:', choices: ['The US and China', 'Capitalism/democracy (US) and communism (USSR)', 'Europe and Asia', 'NATO and the UN'], answer: 'B', explanation: 'The Cold War was an ideological, political, and military rivalry between the US-led capitalist/democratic West and the Soviet-led communist East, lasting from 1947 to 1991.' },
    { type: 'mc', q: 'Decolonization in Africa was driven by:', choices: ['European generosity', 'African nationalism, WWII\'s weakening of colonial powers, and Cold War dynamics', 'Economic prosperity of colonies', 'Religious conversion'], answer: 'B', explanation: 'Decolonization resulted from African nationalist movements, the weakening of European powers after WWII, Cold War competition for allies, and the moral contradictions of colonialism.' },
    { type: 'mc', q: 'The Non-Aligned Movement sought to:', choices: ['Join NATO', 'Maintain independence from both US and Soviet blocs', 'Support Soviet communism', 'Promote European colonialism'], answer: 'B', explanation: 'The Non-Aligned Movement (Nehru, Nasser, Tito, Sukarno) sought to avoid alignment with either Cold War superpower, asserting newly independent nations\' right to self-determination.' },
    { type: 'mc', q: 'The fall of the Berlin Wall (1989) symbolized:', choices: ['Soviet military victory', 'The end of the Cold War and communist control in Eastern Europe', 'German aggression', 'A new wall being built'], answer: 'B', explanation: 'The fall of the Berlin Wall symbolized the collapse of communist regimes in Eastern Europe and the approaching end of the Cold War, with German reunification following in 1990.' },
    { type: 'sa', q: 'How has globalization both connected and divided the world?', answer: 'inequality', explanation: 'Globalization has increased trade, cultural exchange, and technological access, but also widened inequality, disrupted local economies, homogenized cultures, and enabled exploitation of developing nations.' },
    { type: 'mc', q: 'The Korean War (1950-53) resulted in:', choices: ['Korean unification', 'A divided Korea along the 38th parallel with ongoing tensions', 'South Korean control of the entire peninsula', 'Withdrawal of all foreign troops'], answer: 'B', explanation: 'The Korean War ended in armistice (not a peace treaty), leaving Korea divided at roughly the 38th parallel, with US troops still stationed in South Korea today.' },
    { type: 'mc', q: 'Nelson Mandela and the anti-apartheid movement achieved:', choices: ['Nothing significant', 'The end of racial apartheid and democratic elections in South Africa', 'Military takeover', 'Colonial restoration'], answer: 'B', explanation: 'After decades of resistance and international pressure, apartheid ended with South Africa\'s first democratic elections in 1994, electing Mandela as president.' },
    { type: 'sa', q: 'What factors led to the collapse of the Soviet Union in 1991?', answer: 'reform', explanation: 'The USSR collapsed due to economic stagnation, the costs of the arms race, Gorbachev\'s reforms (glasnost and perestroika), nationalist movements in Soviet republics, and the failure of communist ideology to deliver prosperity.' },
    { type: 'mc', q: 'The United Nations was established to:', choices: ['Replace all national governments', 'Promote international cooperation and prevent war', 'Enforce US foreign policy', 'Manage global trade only'], answer: 'B', explanation: 'The UN was established in 1945 to maintain international peace, promote human rights, foster development, and provide a forum for diplomacy, learning from the League of Nations\' failures.' },
    { type: 'mc', q: 'China\'s economic reforms under Deng Xiaoping:', choices: ['Established full democracy', 'Introduced market economics while maintaining communist political control', 'Returned to Mao-era policies', 'Led to economic collapse'], answer: 'B', explanation: 'Deng\'s reforms (1978+) opened China to market forces and foreign investment while maintaining CCP political control, creating rapid economic growth and lifting hundreds of millions from poverty.' },
  ],
};

const SOURCE_EXCERPTS = {
  'ancient-civilizations': { title: 'Code of Hammurabi (c. 1754 BCE)', text: '"If a man has destroyed the eye of a free man, his own eye shall be destroyed. If he has broken the bone of a free man, his bone shall be broken."', context: 'Hammurabi\'s Code established one of the earliest systems of codified law in Mesopotamia.' },
  'classical-era': { title: 'Pericles\' Funeral Oration (431 BCE, recorded by Thucydides)', text: '"Our constitution does not copy the laws of neighboring states; we are rather a pattern to others than imitators ourselves. Its administration favors the many instead of the few; this is why it is called a democracy."', context: 'Pericles honored Athenian war dead while celebrating Athenian democracy during the Peloponnesian War.' },
  'post-classical': { title: 'Ibn Battuta, Travels (c. 1355)', text: '"I have indeed — praise be to God — attained my desire in this world, which was to travel through the earth, and I have attained in this respect what no other person has attained to my knowledge."', context: 'Ibn Battuta traveled over 75,000 miles across the Islamic world and beyond, documenting cultures and trade networks.' },
  'early-modern': { title: 'Bartolome de las Casas, A Short Account of the Destruction of the Indies (1542)', text: '"The reason the Christians have murdered on such a vast scale is purely and simply greed... their insatiable greed and ambition."', context: 'Las Casas documented Spanish colonial atrocities against Indigenous peoples, becoming an early advocate for Indigenous rights.' },
  'age-of-revolutions': { title: 'Declaration of the Rights of Man and Citizen (1789)', text: '"Men are born and remain free and equal in rights. Social distinctions may be founded only upon the general good."', context: 'This foundational document of the French Revolution declared universal principles of liberty, equality, and popular sovereignty.' },
  'imperialism-wwi': { title: 'Rudyard Kipling, "The White Man\'s Burden" (1899)', text: '"Take up the White Man\'s burden — Send forth the best ye breed — Go bind your sons to exile — To serve your captives\' need."', context: 'Kipling\'s poem encapsulated the paternalistic justification for imperialism, urging the US to colonize the Philippines.' },
  'interwar-wwii': { title: 'Winston Churchill, "Iron Curtain" Speech (1946)', text: '"From Stettin in the Baltic to Trieste in the Adriatic, an iron curtain has descended across the Continent."', context: 'Churchill warned of Soviet expansion and the division of Europe, helping define the emerging Cold War.' },
  'cold-war-globalization': { title: 'Nelson Mandela, Inaugural Address (1994)', text: '"Never, never and never again shall it be that this beautiful land will again experience the oppression of one by another."', context: 'Mandela spoke after being elected South Africa\'s first Black president, ending decades of apartheid.' },
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
  return { studentId: id, createdAt: new Date().toISOString(), assessments: [], skills: {} };
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

function generateExercise(skill, count = 5) {
  const bank = QUESTION_BANKS[skill];
  if (!bank) return { error: `No question bank for ${skill}` };
  const items = pick(bank, count);
  return {
    type: 'world-history',
    skill,
    skillName: SKILLS[skill]?.name || skill,
    count: items.length,
    instruction: 'Answer each question. For multiple choice, respond with the letter. For short answer, provide a brief response.',
    items: items.map((item, i) => ({
      number: i + 1,
      type: item.type,
      question: item.q,
      choices: item.choices || null,
      answer: item.answer,
      explanation: item.explanation,
    })),
  };
}

function checkAnswer(type, expected, answer) {
  if (type === 'mc') return norm(expected) === norm(answer.charAt(0));
  return norm(answer).includes(norm(expected)) || norm(expected).includes(norm(answer));
}

// Public API

class HSWorldHistory {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, createdAt: p.createdAt, totalAssessments: p.assessments.length };
  }

  recordAssessment(id, skill, score, total, notes = '') {
    if (!SKILLS[skill]) throw new Error(`Unknown skill: ${skill}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id);
    const entry = { date: new Date().toISOString(), skill, score, total, notes };
    p.assessments.push(entry);
    if (!p.skills[skill]) p.skills[skill] = { attempts: [] };
    p.skills[skill].attempts.push({ date: entry.date, score, total });
    p.skills[skill].mastery = calcMastery(p.skills[skill].attempts);
    p.skills[skill].label = masteryLabel(p.skills[skill].mastery);
    saveProfile(p);
    return { studentId: id, skill, score: `${score}/${total}`, mastery: p.skills[skill].mastery, label: p.skills[skill].label };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const results = {};
    let mastered = 0, total = 0;
    for (const [sk, info] of Object.entries(SKILLS)) {
      total++;
      const d = p.skills[sk];
      results[sk] = d ? { name: info.name, mastery: d.mastery, label: d.label } : { name: info.name, mastery: 0, label: 'not-started' };
      if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
    }
    return { studentId: id, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id);
    const candidates = [];
    for (const [sk, info] of Object.entries(SKILLS)) {
      const d = p.skills[sk];
      const m = d ? d.mastery : 0;
      if (m < MASTERY_THRESHOLD) candidates.push({ skill: sk, name: info.name, mastery: m, label: d ? d.label : 'not-started' });
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, next: candidates.slice(0, count) };
  }

  getReport(id) {
    const p = loadProfile(id);
    return { studentId: id, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }

  getSkillCatalog() {
    const catalog = {};
    let total = 0;
    for (const [sk, info] of Object.entries(SKILLS)) { total++; catalog[sk] = { name: info.name, topics: info.topics }; }
    return { skills: catalog, totalSkills: total };
  }

  generateExercise(skill, count = 5) { return generateExercise(skill, count); }

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  generateLesson(id) {
    const p = loadProfile(id);
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: 'All skills are proficient! Great work on World History.', skills: Object.keys(SKILLS) };
    const exercise = generateExercise(target.skill, 5);
    const source = SOURCE_EXCERPTS[target.skill] || null;
    return {
      studentId: id, targetSkill: target, exercise, sourceExcerpt: source,
      lessonPlan: {
        review: 'Review previously covered period concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.name}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        source: source ? `Analyze source: "${source.title}"` : 'Review key primary sources from this period',
        connect: 'Connect to AP World themes and compare across regions',
      },
    };
  }
}

module.exports = HSWorldHistory;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new HSWorldHistory();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: start <id> [skill]');
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
      case 'students': { out(api.listStudents()); break; }
      default: out({ usage: 'node world-history.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students'], skills: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
