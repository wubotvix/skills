// eClaw College Anthropology Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-socialstudies-anthropology');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'introductory': {
    'four-field-overview': ['cultural-anthropology', 'biological-anthropology', 'archaeology', 'linguistic-anthropology'],
    'key-concepts': ['culture-definition', 'ethnocentrism-vs-relativism', 'holism', 'comparison', 'fieldwork-basics'],
    'human-evolution': ['primate-classification', 'hominin-evolution', 'natural-selection', 'adaptation', 'human-variation'],
    'culture-and-society': ['norms-and-values', 'enculturation', 'cultural-change', 'globalization-intro', 'identity'],
  },
  'intermediate': {
    'cultural-anthropology': ['kinship-systems', 'economic-anthropology', 'political-anthropology', 'religion-and-ritual', 'gender-and-sexuality'],
    'biological-anthropology': ['forensic-anthropology', 'primatology', 'human-osteology', 'bioarchaeology', 'population-genetics'],
    'archaeology': ['excavation-methods', 'dating-techniques', 'artifact-analysis', 'site-formation', 'cultural-resource-management'],
    'linguistic-anthropology': ['language-and-culture', 'sociolinguistics', 'language-change', 'discourse-analysis', 'endangered-languages'],
  },
  'upper-division': {
    'theory': ['functionalism', 'structuralism', 'interpretive-anthropology', 'political-economy', 'postcolonial-theory'],
    'ethnographic-methods': ['participant-observation', 'interviews-and-life-histories', 'ethnographic-writing', 'reflexivity', 'research-ethics'],
    'applied-anthropology': ['medical-anthropology', 'development-anthropology', 'urban-anthropology', 'environmental-anthropology', 'digital-anthropology'],
    'contemporary-issues': ['indigenous-rights', 'migration-and-diaspora', 'race-and-racism', 'heritage-and-repatriation', 'anthropocene'],
  },
  'advanced': {
    'research-design': ['proposal-writing', 'methodology-selection', 'mixed-methods', 'longitudinal-fieldwork', 'collaborative-research'],
    'advanced-theory': ['practice-theory', 'actor-network-theory', 'ontological-turn', 'multispecies-ethnography', 'decolonizing-anthropology'],
    'professional-skills': ['grant-writing', 'academic-publishing', 'public-anthropology', 'teaching-anthropology', 'applied-careers'],
    'thesis-fieldwork': ['fieldwork-planning', 'data-collection', 'analysis-and-coding', 'writing-ethnography', 'defense-preparation'],
  },
};

const CONTENT_BANKS = {
  'introductory': {
    'cultural-anthropology': {
      items: [
        { prompt: 'What is cultural anthropology?', answer: 'the study of human cultures and societies', explanation: 'Cultural anthropology examines how people live, organize societies, and create meaning through culture.' },
        { prompt: 'Name a key method used in cultural anthropology.', answer: 'participant observation', explanation: 'Anthropologists immerse themselves in communities to understand culture from the inside.' },
        { prompt: 'Who is considered the founder of American cultural anthropology?', answer: 'Franz Boas', explanation: 'Boas challenged racial theories and established cultural relativism as a methodological principle.' },
        { prompt: 'What is an ethnography?', answer: 'a detailed written description of a culture based on fieldwork', explanation: 'Ethnographies are the primary product of cultural anthropological research.' },
        { prompt: 'What distinguishes cultural anthropology from sociology?', answer: 'emphasis on cross-cultural comparison and long-term fieldwork', explanation: 'Anthropology typically involves immersive fieldwork in diverse cultural settings.' },
      ],
    },
    'biological-anthropology': {
      items: [
        { prompt: 'What does biological anthropology study?', answer: 'human biological variation and evolution', explanation: 'Also called physical anthropology, it examines human biology in evolutionary context.' },
        { prompt: 'What evidence do biological anthropologists use to study human evolution?', answer: 'fossils, DNA, and comparative anatomy', explanation: 'Fossil records, genetic data, and skeletal analysis reveal our evolutionary history.' },
        { prompt: 'What is primatology?', answer: 'the study of non-human primates', explanation: 'Studying primates helps us understand our own evolutionary heritage and behavior.' },
        { prompt: 'How does biological anthropology differ from biology?', answer: 'it focuses specifically on humans in biocultural context', explanation: 'Biological anthropology integrates culture and biology rather than studying biology alone.' },
        { prompt: 'What is forensic anthropology?', answer: 'using skeletal analysis to identify human remains', explanation: 'Forensic anthropologists assist in legal investigations and disaster victim identification.' },
      ],
    },
    'archaeology': {
      items: [
        { prompt: 'What is archaeology?', answer: 'the study of past human cultures through material remains', explanation: 'Archaeologists excavate and analyze artifacts, structures, and landscapes.' },
        { prompt: 'What is an artifact?', answer: 'an object made or modified by humans', explanation: 'Artifacts include tools, pottery, jewelry, and any human-made object.' },
        { prompt: 'What is stratigraphy?', answer: 'the study of rock and soil layers to determine age', explanation: 'Deeper layers are generally older, helping establish chronological sequences.' },
        { prompt: 'How does archaeology differ from history?', answer: 'archaeology studies material remains while history focuses on written records', explanation: 'Archaeology can study cultures that left no written records.' },
        { prompt: 'What is a site in archaeology?', answer: 'a location where evidence of past human activity is found', explanation: 'Sites range from single artifact scatters to complex urban ruins.' },
      ],
    },
    'linguistic-anthropology': {
      items: [
        { prompt: 'What is linguistic anthropology?', answer: 'the study of language in its social and cultural context', explanation: 'It examines how language shapes thought, identity, and social relations.' },
        { prompt: 'What is the Sapir-Whorf hypothesis?', answer: 'language influences how we perceive and think about the world', explanation: 'The strong version says language determines thought; the weak version says it influences it.' },
        { prompt: 'Why do anthropologists study endangered languages?', answer: 'each language encodes unique cultural knowledge and worldview', explanation: 'When a language dies, irreplaceable knowledge about human experience is lost.' },
        { prompt: 'What is code-switching?', answer: 'alternating between languages or dialects in conversation', explanation: 'Code-switching reflects social identity, context, and power dynamics.' },
        { prompt: 'How does linguistic anthropology differ from linguistics?', answer: 'it emphasizes the cultural and social dimensions of language use', explanation: 'Linguistic anthropology connects language to identity, power, and cultural meaning.' },
      ],
    },
    'culture-definition': {
      items: [
        { prompt: 'How do anthropologists define culture?', answer: 'learned shared patterns of behavior beliefs and values', explanation: 'Culture is not biological — it is learned through social interaction and passed across generations.' },
        { prompt: 'Is culture the same as race?', answer: 'no, culture is learned while race is a social construct based on physical appearance', explanation: 'Anthropologists distinguish biological variation from cultural practices.' },
        { prompt: 'What does it mean that culture is "shared"?', answer: 'it is held in common by members of a group', explanation: 'Culture exists at the group level, though individuals may vary in how they express it.' },
        { prompt: 'What does it mean that culture is "learned"?', answer: 'it is acquired through socialization not inherited biologically', explanation: 'Children learn their culture through interaction with family and community.' },
        { prompt: 'Can culture change?', answer: 'yes, cultures are dynamic and constantly evolving', explanation: 'Contact, innovation, and internal pressures all drive cultural change.' },
      ],
    },
    'ethnocentrism-vs-relativism': {
      items: [
        { prompt: 'What is ethnocentrism?', answer: 'judging other cultures by the standards of your own', explanation: 'Ethnocentrism assumes your own cultural practices are the correct or normal way.' },
        { prompt: 'What is cultural relativism?', answer: 'understanding a culture on its own terms', explanation: 'Cultural relativism is a methodological tool — understand before evaluating.' },
        { prompt: 'Why is cultural relativism important in anthropology?', answer: 'it prevents bias and allows genuine understanding of other cultures', explanation: 'Without relativism, researchers impose their own values on the people they study.' },
        { prompt: 'Does cultural relativism mean all practices are morally acceptable?', answer: 'no, it is a research method not a moral stance', explanation: 'Anthropologists can understand a practice without endorsing it.' },
        { prompt: 'Give an example of ethnocentrism.', answer: 'believing your food customs are normal and others are strange', explanation: 'What counts as "food" varies widely — insects are nutritious and widely eaten globally.' },
      ],
    },
    'holism': {
      items: [
        { prompt: 'What does holism mean in anthropology?', answer: 'studying all aspects of human experience as interconnected', explanation: 'Holism connects biology, culture, language, and history rather than studying them in isolation.' },
        { prompt: 'Why is the holistic approach distinctive to anthropology?', answer: 'it integrates biological cultural linguistic and historical perspectives', explanation: 'No other discipline systematically connects all four dimensions of human experience.' },
        { prompt: 'How does holism apply to studying a community?', answer: 'by examining economy politics religion kinship and ecology together', explanation: 'Understanding any one aspect requires understanding how it connects to all others.' },
        { prompt: 'What are the four fields of anthropology?', answer: 'cultural biological archaeological and linguistic', explanation: 'The four-field approach embodies the holistic principle.' },
        { prompt: 'Why might an anthropologist study both diet and religion in the same community?', answer: 'because food practices are often connected to religious beliefs', explanation: 'Holism reveals connections that disciplinary boundaries might obscure.' },
      ],
    },
    'comparison': {
      items: [
        { prompt: 'Why is cross-cultural comparison important in anthropology?', answer: 'it reveals both human universals and cultural diversity', explanation: 'Comparison shows what is universal to humans and what varies across cultures.' },
        { prompt: 'What is a human universal?', answer: 'a trait or practice found in all known human cultures', explanation: 'Examples include language, music, kinship systems, and taboos.' },
        { prompt: 'What is the Human Relations Area Files (HRAF)?', answer: 'a database for cross-cultural research', explanation: 'HRAF enables systematic comparison across hundreds of documented cultures.' },
        { prompt: 'What risk does comparison carry?', answer: 'oversimplifying or decontextualizing cultural practices', explanation: 'Comparison must be done carefully to avoid stripping practices of their meaning.' },
        { prompt: 'How does comparison help challenge ethnocentrism?', answer: 'by showing that other ways of life are equally valid solutions to human problems', explanation: 'Seeing multiple solutions to the same challenge undermines the idea that your way is the only way.' },
      ],
    },
    'fieldwork-basics': {
      items: [
        { prompt: 'What is fieldwork in anthropology?', answer: 'extended research conducted in the community being studied', explanation: 'Fieldwork typically involves living with and participating in community life.' },
        { prompt: 'Who pioneered modern fieldwork methods?', answer: 'Bronislaw Malinowski', explanation: 'Malinowski\'s work in the Trobriand Islands established participant observation as the standard method.' },
        { prompt: 'What is participant observation?', answer: 'participating in daily life while observing and recording cultural practices', explanation: 'The researcher is both an insider (participant) and outsider (observer).' },
        { prompt: 'How long does anthropological fieldwork typically last?', answer: 'at least one year', explanation: 'Extended time is needed to learn the language, build trust, and observe seasonal cycles.' },
        { prompt: 'What is rapport in fieldwork?', answer: 'a trusting relationship between researcher and community members', explanation: 'Without rapport, people may not share honest information.' },
      ],
    },
    'primate-classification': {
      items: [
        { prompt: 'Are humans primates?', answer: 'yes', explanation: 'Humans belong to the order Primates, sharing ancestors with apes and monkeys.' },
        { prompt: 'What are the two main suborders of primates?', answer: 'Strepsirrhini (lemurs and lorises) and Haplorhini (tarsiers, monkeys, apes)', explanation: 'The split reflects fundamental differences in nose structure and other features.' },
        { prompt: 'What is our closest living relative?', answer: 'chimpanzees and bonobos', explanation: 'We share approximately 98-99% of our DNA with chimpanzees.' },
        { prompt: 'What traits do all primates share?', answer: 'grasping hands forward-facing eyes and large brains relative to body size', explanation: 'These traits reflect arboreal ancestry and complex social lives.' },
        { prompt: 'What is a hominid?', answer: 'a member of the great ape family including humans', explanation: 'Hominidae includes orangutans, gorillas, chimpanzees, and humans.' },
      ],
    },
    'hominin-evolution': {
      items: [
        { prompt: 'What is a hominin?', answer: 'humans and our direct ancestors after the split from chimpanzees', explanation: 'Hominins are the human lineage, including all species more closely related to us than to chimps.' },
        { prompt: 'What was the first major hominin adaptation?', answer: 'bipedalism (walking upright)', explanation: 'Bipedalism appeared before large brains, freeing the hands for tool use.' },
        { prompt: 'What species is "Lucy"?', answer: 'Australopithecus afarensis', explanation: 'Lucy lived about 3.2 million years ago in East Africa and walked upright.' },
        { prompt: 'When did Homo sapiens first appear?', answer: 'approximately 300,000 years ago in Africa', explanation: 'The oldest known Homo sapiens fossils come from Jebel Irhoud, Morocco.' },
        { prompt: 'What is the Out of Africa theory?', answer: 'modern humans evolved in Africa and migrated to populate the world', explanation: 'Genetic and fossil evidence strongly supports an African origin for our species.' },
      ],
    },
    'natural-selection': {
      items: [
        { prompt: 'What is natural selection?', answer: 'the process by which traits that improve survival and reproduction become more common', explanation: 'Individuals with advantageous traits leave more offspring, spreading those traits.' },
        { prompt: 'Who proposed the theory of natural selection?', answer: 'Charles Darwin and Alfred Russel Wallace', explanation: 'Both independently arrived at the theory; Darwin published On the Origin of Species in 1859.' },
        { prompt: 'What are the requirements for natural selection?', answer: 'variation heritability and differential reproduction', explanation: 'There must be variety, traits must be inherited, and some must aid survival.' },
        { prompt: 'Is natural selection the same as "survival of the fittest"?', answer: 'not exactly — fitness means reproductive success not physical strength', explanation: 'The "fittest" are those who leave the most surviving offspring.' },
        { prompt: 'Give an example of natural selection in humans.', answer: 'sickle cell trait in malaria regions', explanation: 'Carriers have resistance to malaria, so the trait persists in affected populations.' },
      ],
    },
    'adaptation': {
      items: [
        { prompt: 'What is biological adaptation?', answer: 'a trait that improves an organism\'s fitness in its environment', explanation: 'Adaptations evolve through natural selection over many generations.' },
        { prompt: 'What is cultural adaptation?', answer: 'using cultural practices to cope with environmental challenges', explanation: 'Humans adapt culturally (clothing, shelter, agriculture) faster than biologically.' },
        { prompt: 'What is acclimatization?', answer: 'short-term physiological adjustment to environmental conditions', explanation: 'For example, your body acclimatizes to high altitude by producing more red blood cells.' },
        { prompt: 'How do humans adapt to cold environments?', answer: 'through both biological features and cultural practices like clothing and shelter', explanation: 'Shorter limbs (Allen\'s rule) and cultural innovations like fire and insulated clothing.' },
        { prompt: 'Why is human cultural adaptation so powerful?', answer: 'it allows rapid adjustment without waiting for genetic change', explanation: 'Cultural adaptation operates within a single generation, unlike biological evolution.' },
      ],
    },
    'human-variation': {
      items: [
        { prompt: 'Is race a valid biological category?', answer: 'no, human races are social constructs not biological realities', explanation: 'There is more genetic variation within so-called races than between them.' },
        { prompt: 'What is a cline?', answer: 'a gradual change in a trait across a geographic area', explanation: 'Skin color follows a cline — it varies gradually with latitude, not in discrete racial groups.' },
        { prompt: 'Why do human populations near the equator tend to have darker skin?', answer: 'darker skin protects against UV radiation which destroys folate', explanation: 'This is an adaptation to high UV environments — an example of natural selection.' },
        { prompt: 'What percentage of human genetic variation exists between "racial" groups?', answer: 'only about 5-15%', explanation: 'The vast majority of genetic variation exists within any population.' },
        { prompt: 'Why is the concept of race still important to anthropologists?', answer: 'because it has real social consequences even though it lacks biological basis', explanation: 'Race as a social construct affects lived experience, health outcomes, and opportunity.' },
      ],
    },
    'norms-and-values': {
      items: [
        { prompt: 'What is a cultural norm?', answer: 'an expected standard of behavior in a society', explanation: 'Norms guide behavior — some are formal (laws) and others informal (etiquette).' },
        { prompt: 'What is the difference between a norm and a value?', answer: 'norms are rules for behavior and values are beliefs about what is important', explanation: 'Values underlie norms — we create rules based on what we consider important.' },
        { prompt: 'What is a taboo?', answer: 'a strongly prohibited behavior', explanation: 'Taboos vary across cultures but often involve food, sex, or death.' },
        { prompt: 'What is a sanction?', answer: 'a reward or punishment for following or violating norms', explanation: 'Sanctions can be positive (praise) or negative (punishment) and formal or informal.' },
        { prompt: 'Do all cultures have the same norms?', answer: 'no, norms vary widely across cultures', explanation: 'What is normal in one culture may be taboo in another.' },
      ],
    },
    'enculturation': {
      items: [
        { prompt: 'What is enculturation?', answer: 'the process of learning your own culture', explanation: 'Through enculturation, children absorb the values, behaviors, and knowledge of their society.' },
        { prompt: 'What is acculturation?', answer: 'cultural change resulting from contact between cultures', explanation: 'Acculturation occurs when groups adopt elements of each other\'s cultures.' },
        { prompt: 'What is the difference between enculturation and socialization?', answer: 'enculturation emphasizes cultural learning while socialization emphasizes social learning', explanation: 'Anthropologists prefer enculturation because it centers culture as the unit of analysis.' },
        { prompt: 'How do children learn their culture?', answer: 'through observation imitation and instruction from family and community', explanation: 'Much cultural learning is informal and occurs through everyday interactions.' },
        { prompt: 'What is an agent of enculturation?', answer: 'a person or institution that transmits culture', explanation: 'Family, peers, schools, media, and religious institutions all transmit culture.' },
      ],
    },
    'cultural-change': {
      items: [
        { prompt: 'What is diffusion?', answer: 'the spread of cultural traits from one group to another', explanation: 'Ideas, technologies, and practices spread through contact, trade, and migration.' },
        { prompt: 'What is innovation?', answer: 'the creation of new cultural traits within a society', explanation: 'Innovations arise from invention or recombination of existing elements.' },
        { prompt: 'What is cultural loss?', answer: 'the disappearance of cultural traits', explanation: 'Languages, practices, and knowledge can be lost through assimilation or disruption.' },
        { prompt: 'What is assimilation?', answer: 'when a minority group adopts the culture of the dominant group', explanation: 'Assimilation can be voluntary or forced, often resulting in loss of original culture.' },
        { prompt: 'What drives cultural change?', answer: 'contact migration technology environment and internal dynamics', explanation: 'Cultures change through both external pressures and internal innovation.' },
      ],
    },
    'globalization-intro': {
      items: [
        { prompt: 'What is globalization from an anthropological perspective?', answer: 'increasing interconnection of cultures economies and peoples worldwide', explanation: 'Anthropologists study how globalization affects local cultures and identities.' },
        { prompt: 'Does globalization make all cultures the same?', answer: 'no, local cultures adapt and resist global forces in creative ways', explanation: 'Glocalization — the blending of global and local — is more common than homogenization.' },
        { prompt: 'What is glocalization?', answer: 'the adaptation of global products or ideas to local cultures', explanation: 'McDonald\'s menus vary by country — a classic example of glocalization.' },
        { prompt: 'How has globalization affected indigenous peoples?', answer: 'through both threats to traditions and new tools for cultural preservation', explanation: 'The internet helps indigenous groups share languages and connect globally.' },
        { prompt: 'What is cultural imperialism?', answer: 'the imposition of one culture over others through power', explanation: 'Colonial powers often forced their languages, religions, and values on colonized peoples.' },
      ],
    },
    'identity': {
      items: [
        { prompt: 'What is identity in anthropology?', answer: 'how individuals and groups define themselves in relation to others', explanation: 'Identity includes ethnicity, gender, class, religion, nationality, and more.' },
        { prompt: 'What is ethnicity?', answer: 'identification with a group based on shared cultural heritage', explanation: 'Ethnicity is based on perceived shared ancestry, language, religion, or customs.' },
        { prompt: 'Is identity fixed or fluid?', answer: 'fluid — it changes across contexts and over time', explanation: 'People emphasize different aspects of identity in different situations.' },
        { prompt: 'What is intersectionality?', answer: 'the interconnected nature of social categories like race gender and class', explanation: 'Intersectionality recognizes that identities overlap and create unique experiences.' },
        { prompt: 'How do anthropologists study identity?', answer: 'through fieldwork examining how people express and negotiate identity in daily life', explanation: 'Identity is performed and constructed through everyday social interaction.' },
      ],
    },
  },
  'intermediate': {
    'kinship-systems': {
      items: [
        { prompt: 'What is kinship in anthropology?', answer: 'the social relationships based on blood ties and marriage', explanation: 'Kinship organizes family, inheritance, and social obligations in every society.' },
        { prompt: 'What is the difference between patrilineal and matrilineal descent?', answer: 'patrilineal traces through the father and matrilineal through the mother', explanation: 'Descent rules determine group membership, inheritance, and family identity.' },
        { prompt: 'What is a clan?', answer: 'a group of people who claim descent from a common ancestor', explanation: 'Clan members may not be able to trace the exact genealogical connection.' },
        { prompt: 'What is exogamy?', answer: 'the rule that you must marry outside your group', explanation: 'Exogamy creates alliances between families and prevents inbreeding.' },
        { prompt: 'Why do anthropologists study kinship?', answer: 'because it is a fundamental organizing principle of human societies', explanation: 'Kinship determines who you can marry, inherit from, and rely on for support.' },
      ],
    },
    'economic-anthropology': {
      items: [
        { prompt: 'What is a gift economy?', answer: 'an economic system based on reciprocal exchange of gifts', explanation: 'Marcel Mauss showed that gift-giving creates social bonds and obligations.' },
        { prompt: 'What is the difference between reciprocity and redistribution?', answer: 'reciprocity is exchange between individuals; redistribution flows through a central authority', explanation: 'Reciprocity characterizes bands; redistribution characterizes chiefdoms and states.' },
        { prompt: 'What are the three types of reciprocity?', answer: 'generalized balanced and negative', explanation: 'Generalized is altruistic; balanced is tit-for-tat; negative is exploitative.' },
        { prompt: 'What is substantivism in economic anthropology?', answer: 'the view that economic behavior is embedded in social and cultural institutions', explanation: 'Substantivists (like Polanyi) argue that Western market models do not apply universally.' },
        { prompt: 'What is the kula ring?', answer: 'a ceremonial exchange system in the Trobriand Islands studied by Malinowski', explanation: 'Shell necklaces and armbands circulate in opposite directions, creating social bonds.' },
      ],
    },
    'political-anthropology': {
      items: [
        { prompt: 'What are the four types of political organization?', answer: 'bands tribes chiefdoms and states', explanation: 'This typology ranges from small egalitarian groups to large stratified societies.' },
        { prompt: 'What is a band?', answer: 'a small egalitarian group of foragers typically 20-50 people', explanation: 'Bands have informal leadership and make decisions through consensus.' },
        { prompt: 'What is a chiefdom?', answer: 'a ranked society with a hereditary leader and redistribution economy', explanation: 'Chiefs organize labor, collect tribute, and redistribute resources.' },
        { prompt: 'What is the difference between power and authority?', answer: 'power is the ability to compel; authority is the right to lead recognized by others', explanation: 'Authority is legitimate; power can be coercive.' },
        { prompt: 'What is a segmentary lineage system?', answer: 'a political system organized by levels of kinship that unite in opposition to outsiders', explanation: 'The Nuer of Sudan are a classic example: "I against my brother, my brother and I against our cousin."' },
      ],
    },
    'religion-and-ritual': {
      items: [
        { prompt: 'How do anthropologists define religion?', answer: 'a system of beliefs and practices concerning the sacred and supernatural', explanation: 'Anthropologists study religion as a cultural system, not evaluating truth claims.' },
        { prompt: 'What is a rite of passage?', answer: 'a ceremony marking the transition from one social status to another', explanation: 'Van Gennep identified three stages: separation, liminality, and incorporation.' },
        { prompt: 'What is animism?', answer: 'the belief that spirits inhabit natural objects and phenomena', explanation: 'Tylor proposed animism as the earliest form of religion.' },
        { prompt: 'What is a shaman?', answer: 'a ritual specialist who communicates with the spirit world', explanation: 'Shamans heal, divine, and mediate between human and spirit realms.' },
        { prompt: 'What is liminality?', answer: 'the transitional phase in a rite of passage where normal social structures are suspended', explanation: 'Victor Turner developed the concept — liminal individuals are "betwixt and between."' },
      ],
    },
    'gender-and-sexuality': {
      items: [
        { prompt: 'What is the difference between sex and gender in anthropology?', answer: 'sex is biological and gender is culturally constructed', explanation: 'Gender roles, expectations, and identities vary across cultures.' },
        { prompt: 'What is a third gender?', answer: 'a gender category beyond male and female recognized in some cultures', explanation: 'Examples include Two-Spirit in Native American cultures and hijra in South Asia.' },
        { prompt: 'What is Margaret Mead known for?', answer: 'studying gender roles across cultures in the Pacific', explanation: 'Mead showed that gender behavior varies across cultures, challenging biological determinism.' },
        { prompt: 'What is patriarchy?', answer: 'a social system in which men hold primary power', explanation: 'Anthropologists study how patriarchy manifests differently across cultures.' },
        { prompt: 'Why is gender important to anthropologists?', answer: 'because it organizes labor power relationships and identity in every society', explanation: 'Gender intersects with kinship, economics, politics, and religion.' },
      ],
    },
    'forensic-anthropology': {
      items: [
        { prompt: 'What do forensic anthropologists do?', answer: 'identify human skeletal remains for legal purposes', explanation: 'They determine age, sex, ancestry, stature, and cause of trauma from bones.' },
        { prompt: 'What is the biological profile?', answer: 'the estimated age sex stature and ancestry of skeletal remains', explanation: 'The biological profile helps identify unknown individuals.' },
        { prompt: 'How can you estimate age from a skeleton?', answer: 'from bone fusion epiphyseal closure and dental development', explanation: 'Growth plates fuse at predictable ages, and tooth eruption follows a schedule.' },
        { prompt: 'What is taphonomy?', answer: 'the study of what happens to remains after death', explanation: 'Understanding decomposition helps estimate time since death.' },
        { prompt: 'How do forensic anthropologists assist in human rights investigations?', answer: 'by identifying victims of mass atrocities through skeletal analysis', explanation: 'They have worked on cases from Argentina, Rwanda, Bosnia, and elsewhere.' },
      ],
    },
    'primatology': {
      items: [
        { prompt: 'Why do anthropologists study primates?', answer: 'to understand human evolution behavior and social organization', explanation: 'Primates are our closest relatives and share many behavioral traits.' },
        { prompt: 'Who is Jane Goodall?', answer: 'a primatologist who studied chimpanzees at Gombe Tanzania', explanation: 'Goodall discovered that chimps use tools, challenging the human uniqueness of tool use.' },
        { prompt: 'What is tool use in primates?', answer: 'using objects to accomplish tasks', explanation: 'Chimps use sticks to fish for termites, stones to crack nuts, and leaves as sponges.' },
        { prompt: 'What is primate social organization?', answer: 'the pattern of social relationships within a primate group', explanation: 'Primates show diverse patterns: solitary, pair-bonded, one-male, and multi-male groups.' },
        { prompt: 'How do primate studies inform our understanding of humans?', answer: 'by showing the evolutionary roots of cooperation conflict and communication', explanation: 'Studying primates reveals the deep evolutionary origins of human social behavior.' },
      ],
    },
    'human-osteology': {
      items: [
        { prompt: 'What is human osteology?', answer: 'the study of the human skeleton', explanation: 'Osteologists analyze bones to understand health, diet, activity, and identity.' },
        { prompt: 'How many bones are in the adult human skeleton?', answer: '206', explanation: 'Infants have more bones that fuse as they grow.' },
        { prompt: 'What can bones tell us about a person\'s diet?', answer: 'isotope analysis reveals what types of food they ate', explanation: 'Carbon and nitrogen isotopes distinguish between marine, terrestrial, and plant-based diets.' },
        { prompt: 'What are skeletal indicators of stress?', answer: 'Harris lines enamel hypoplasia and porotic hyperostosis', explanation: 'These markers indicate periods of malnutrition, disease, or physical stress.' },
        { prompt: 'What is a long bone?', answer: 'a bone that is longer than it is wide such as the femur', explanation: 'Long bones support weight and facilitate movement.' },
      ],
    },
    'bioarchaeology': {
      items: [
        { prompt: 'What is bioarchaeology?', answer: 'the study of human remains from archaeological sites', explanation: 'Bioarchaeologists reconstruct health, diet, disease, and lifestyle from skeletal remains.' },
        { prompt: 'How can bioarchaeologists detect disease in the past?', answer: 'by examining bone lesions and pathological changes', explanation: 'Diseases like tuberculosis, syphilis, and leprosy leave distinctive marks on bones.' },
        { prompt: 'What does the term "osteobiography" mean?', answer: 'the life story of an individual reconstructed from their skeleton', explanation: 'Bones record growth, injuries, disease, diet, and activity patterns.' },
        { prompt: 'What is NAGPRA?', answer: 'the Native American Graves Protection and Repatriation Act', explanation: 'NAGPRA requires the return of Native American remains and objects to descendant communities.' },
        { prompt: 'How does bioarchaeology differ from forensic anthropology?', answer: 'bioarchaeology studies ancient remains while forensic focuses on recent medico-legal cases', explanation: 'Both analyze skeletons but differ in time frame and purpose.' },
      ],
    },
    'population-genetics': {
      items: [
        { prompt: 'What is genetic drift?', answer: 'random changes in allele frequency in small populations', explanation: 'Drift is more powerful in small populations and does not involve natural selection.' },
        { prompt: 'What is the founder effect?', answer: 'reduced genetic diversity when a new population is established by a small group', explanation: 'The founding group carries only a subset of the original population\'s genetic variation.' },
        { prompt: 'What is gene flow?', answer: 'the movement of genes between populations through migration', explanation: 'Gene flow increases genetic similarity between populations.' },
        { prompt: 'What is the Hardy-Weinberg equilibrium?', answer: 'a model of allele frequencies when no evolution is occurring', explanation: 'It requires no selection, drift, mutation, migration, or non-random mating.' },
        { prompt: 'How do population geneticists study human migration?', answer: 'by analyzing DNA variation patterns across populations', explanation: 'Mitochondrial DNA and Y-chromosome data trace maternal and paternal lineages.' },
      ],
    },
    'excavation-methods': {
      items: [
        { prompt: 'What is a test pit?', answer: 'a small excavation used to assess a site before full excavation', explanation: 'Test pits help determine if a site warrants further investigation.' },
        { prompt: 'What is provenience?', answer: 'the exact location where an artifact was found', explanation: 'Recording provenience is essential — removing an artifact without recording its location destroys information.' },
        { prompt: 'What tools do archaeologists use in excavation?', answer: 'trowels brushes screens and measuring equipment', explanation: 'Careful excavation with hand tools preserves fragile artifacts and context.' },
        { prompt: 'What is a unit or square in excavation?', answer: 'a defined area of the site that is systematically excavated', explanation: 'Grids divide the site into units for systematic recording.' },
        { prompt: 'Why is excavation described as "destructive"?', answer: 'because you cannot re-excavate what has already been removed', explanation: 'Once removed, the spatial context is lost forever — hence meticulous recording.' },
      ],
    },
    'dating-techniques': {
      items: [
        { prompt: 'What is radiocarbon dating?', answer: 'a method that measures the decay of carbon-14 to determine age', explanation: 'Effective for organic materials up to about 50,000 years old.' },
        { prompt: 'What is the difference between relative and absolute dating?', answer: 'relative places events in sequence while absolute assigns a specific age', explanation: 'Stratigraphy is relative; radiocarbon dating is absolute.' },
        { prompt: 'What is potassium-argon dating used for?', answer: 'dating very old volcanic rocks associated with early human sites', explanation: 'Effective for materials millions of years old, far beyond radiocarbon\'s range.' },
        { prompt: 'What is seriation?', answer: 'a relative dating method based on changes in artifact styles over time', explanation: 'Artifacts evolve in style — earlier and later forms bracket the middle.' },
        { prompt: 'What is dendrochronology?', answer: 'dating using tree ring patterns', explanation: 'Tree rings provide precise year-by-year dates and climate data.' },
      ],
    },
    'artifact-analysis': {
      items: [
        { prompt: 'What is typology in archaeology?', answer: 'classifying artifacts into types based on shared characteristics', explanation: 'Typologies help organize collections and track changes over time.' },
        { prompt: 'What can pottery tell archaeologists?', answer: 'about trade networks technology diet and cultural identity', explanation: 'Pottery styles, materials, and residues reveal many aspects of past life.' },
        { prompt: 'What is lithic analysis?', answer: 'the study of stone tools', explanation: 'Stone tools are the most durable artifacts and preserve the longest human technological record.' },
        { prompt: 'What is use-wear analysis?', answer: 'studying microscopic wear patterns to determine how a tool was used', explanation: 'Different materials (wood, bone, hide) leave distinctive patterns on tool edges.' },
        { prompt: 'What is a feature in archaeology?', answer: 'a non-portable artifact like a hearth wall or storage pit', explanation: 'Features cannot be removed intact — they must be recorded in place.' },
      ],
    },
    'site-formation': {
      items: [
        { prompt: 'What are formation processes?', answer: 'the natural and cultural events that create the archaeological record', explanation: 'Schiffer distinguished C-transforms (cultural) from N-transforms (natural).' },
        { prompt: 'What is a C-transform?', answer: 'cultural formation process — human activities that affect the archaeological record', explanation: 'Examples: construction, destruction, trash disposal, looting.' },
        { prompt: 'What is an N-transform?', answer: 'natural formation process — geological and biological events affecting the record', explanation: 'Examples: erosion, flooding, animal burrowing, root growth.' },
        { prompt: 'Why do formation processes matter?', answer: 'because they affect what survives and how we interpret the record', explanation: 'Understanding how a site formed is essential to interpreting what we find.' },
        { prompt: 'What is post-depositional disturbance?', answer: 'changes to the archaeological record after artifacts were deposited', explanation: 'Plowing, construction, and natural processes can move artifacts from their original positions.' },
      ],
    },
    'cultural-resource-management': {
      items: [
        { prompt: 'What is CRM in archaeology?', answer: 'cultural resource management — protecting archaeological sites from destruction', explanation: 'CRM ensures that construction projects do not destroy significant heritage sites.' },
        { prompt: 'What law governs CRM in the United States?', answer: 'the National Historic Preservation Act (NHPA)', explanation: 'Section 106 requires federal agencies to consider impacts on historic properties.' },
        { prompt: 'What is a Phase I survey?', answer: 'an initial archaeological survey to identify potential sites', explanation: 'Phase I surveys determine if a project area contains archaeological resources.' },
        { prompt: 'What happens when a significant site is found during construction?', answer: 'work may be halted and the site must be evaluated and possibly excavated', explanation: 'Mitigation through excavation or project redesign may be required.' },
        { prompt: 'Why is CRM the largest employer of archaeologists?', answer: 'because development projects frequently require archaeological assessments', explanation: 'Roads, buildings, and pipelines all require compliance with heritage protection laws.' },
      ],
    },
    'language-and-culture': {
      items: [
        { prompt: 'What is the relationship between language and culture?', answer: 'language reflects encodes and transmits cultural knowledge', explanation: 'Language is not just a tool for communication — it shapes how we think and experience the world.' },
        { prompt: 'What is linguistic relativity?', answer: 'the idea that language influences thought and perception', explanation: 'The Sapir-Whorf hypothesis has weak (influence) and strong (determinism) versions.' },
        { prompt: 'How do color terms illustrate language and culture?', answer: 'different languages divide the color spectrum differently', explanation: 'Russian speakers distinguish "light blue" and "dark blue" as separate basic colors.' },
        { prompt: 'What is an ethnography of communication?', answer: 'studying how language is used in social context', explanation: 'Dell Hymes developed this approach to understand communicative competence.' },
        { prompt: 'How does language relate to identity?', answer: 'the way you speak signals your social group region and identity', explanation: 'Dialect, accent, and language choice communicate social belonging.' },
      ],
    },
    'sociolinguistics': {
      items: [
        { prompt: 'What is a dialect?', answer: 'a regional or social variety of a language', explanation: 'All speakers speak a dialect — "standard" language is just the prestige dialect.' },
        { prompt: 'What is a lingua franca?', answer: 'a language used for communication between groups with different native languages', explanation: 'English, Swahili, and Mandarin serve as lingua francas in different regions.' },
        { prompt: 'What is diglossia?', answer: 'a situation where two language varieties are used in different social contexts', explanation: 'A "high" variety for formal settings and a "low" variety for everyday use.' },
        { prompt: 'What is language ideology?', answer: 'beliefs about the value and correctness of language varieties', explanation: 'Judgments about "proper" language reflect social hierarchies, not linguistic facts.' },
        { prompt: 'What is linguistic discrimination?', answer: 'discrimination based on how someone speaks', explanation: 'Speakers of non-standard dialects face prejudice in education, employment, and media.' },
      ],
    },
    'language-change': {
      items: [
        { prompt: 'What is a proto-language?', answer: 'a reconstructed ancestral language', explanation: 'Proto-Indo-European is the reconstructed ancestor of most European and South Asian languages.' },
        { prompt: 'What is a language family?', answer: 'a group of languages descended from a common ancestor', explanation: 'Indo-European, Sino-Tibetan, and Niger-Congo are major language families.' },
        { prompt: 'What is a pidgin?', answer: 'a simplified language developed for communication between groups', explanation: 'Pidgins have limited grammar and vocabulary drawn from multiple languages.' },
        { prompt: 'What is a creole?', answer: 'a pidgin that has become the native language of a community', explanation: 'Creoles develop full grammar and are complete languages.' },
        { prompt: 'How do languages change?', answer: 'through sound change borrowing grammatical change and social factors', explanation: 'Language change is natural, continuous, and driven by both internal and external forces.' },
      ],
    },
    'discourse-analysis': {
      items: [
        { prompt: 'What is discourse analysis?', answer: 'the study of language use in social context beyond the sentence level', explanation: 'It examines how meaning is constructed through conversation, narrative, and text.' },
        { prompt: 'What is a speech act?', answer: 'an utterance that performs an action', explanation: 'Saying "I promise" or "I apologize" does not just describe — it enacts the promise or apology.' },
        { prompt: 'What is a narrative?', answer: 'a structured account of events', explanation: 'Narratives organize experience and create meaning — they are central to human culture.' },
        { prompt: 'How does power relate to discourse?', answer: 'those in power control which discourses are dominant and legitimate', explanation: 'Foucault showed that discourse shapes what can be said, thought, and done.' },
        { prompt: 'What is performativity?', answer: 'the idea that language creates social reality through repeated performance', explanation: 'Butler argued that gender identity is performed through everyday speech and action.' },
      ],
    },
    'endangered-languages': {
      items: [
        { prompt: 'How many languages are currently endangered?', answer: 'approximately half of the world\'s 7000 languages', explanation: 'At current rates, a language dies about every two weeks.' },
        { prompt: 'What causes language endangerment?', answer: 'dominant language pressure colonialism globalization and economic pressure', explanation: 'Speakers shift to dominant languages for economic and social opportunities.' },
        { prompt: 'Why does language loss matter?', answer: 'each language contains unique knowledge about the world', explanation: 'Languages encode ecological knowledge, oral history, and philosophical systems.' },
        { prompt: 'What is language revitalization?', answer: 'efforts to restore and strengthen endangered languages', explanation: 'Strategies include immersion schools, documentation, and community language programs.' },
        { prompt: 'What is the role of anthropologists in language documentation?', answer: 'recording and preserving languages in collaboration with communities', explanation: 'Documentation involves grammar, vocabulary, texts, and recordings.' },
      ],
    },
  },
  'upper-division': {
    'functionalism': {
      items: [
        { prompt: 'What is functionalism in anthropology?', answer: 'the theory that cultural practices serve to maintain social stability', explanation: 'Malinowski and Radcliffe-Brown argued that every custom fulfills a social function.' },
        { prompt: 'Who are the key figures in functionalism?', answer: 'Malinowski and Radcliffe-Brown', explanation: 'Malinowski emphasized individual needs; Radcliffe-Brown focused on social structure.' },
        { prompt: 'What is a criticism of functionalism?', answer: 'it assumes societies are stable and ignores conflict and change', explanation: 'Functionalism has difficulty explaining inequality, oppression, and rapid social change.' },
        { prompt: 'How does structural-functionalism differ from Malinowski\'s functionalism?', answer: 'it focuses on how institutions maintain social structure rather than individual needs', explanation: 'Radcliffe-Brown emphasized the social system rather than individual motivations.' },
        { prompt: 'What legacy did functionalism leave?', answer: 'the emphasis on participant observation and holistic ethnography', explanation: 'Even critics of functionalist theory adopted its fieldwork methods.' },
      ],
    },
    'structuralism': {
      items: [
        { prompt: 'What is structuralism in anthropology?', answer: 'the theory that universal mental structures underlie all cultures', explanation: 'Levi-Strauss argued that binary oppositions (nature/culture, raw/cooked) organize human thought.' },
        { prompt: 'Who is Claude Levi-Strauss?', answer: 'the founder of structural anthropology', explanation: 'Levi-Strauss analyzed myths, kinship, and classification using structural methods.' },
        { prompt: 'What is a binary opposition?', answer: 'a pair of opposed concepts that structure meaning', explanation: 'Examples: nature/culture, male/female, raw/cooked, sacred/profane.' },
        { prompt: 'How did Levi-Strauss analyze myths?', answer: 'by identifying recurring structural patterns across different cultures', explanation: 'He argued that myths from different cultures share deep structural similarities.' },
        { prompt: 'What is a criticism of structuralism?', answer: 'it is too abstract and ignores individual agency and historical change', explanation: 'Structuralism treats culture as a system of logic rather than lived experience.' },
      ],
    },
    'interpretive-anthropology': {
      items: [
        { prompt: 'What is interpretive anthropology?', answer: 'the view that culture is a system of meanings to be interpreted', explanation: 'Clifford Geertz defined culture as "webs of significance" that humans spin.' },
        { prompt: 'What is "thick description"?', answer: 'detailed ethnographic interpretation that captures the meaning of cultural practices', explanation: 'Geertz borrowed the term from philosopher Gilbert Ryle.' },
        { prompt: 'Who is Clifford Geertz?', answer: 'the founder of interpretive anthropology', explanation: 'His essay "Thick Description" and study of the Balinese cockfight are foundational texts.' },
        { prompt: 'How does interpretive anthropology differ from functionalism?', answer: 'it seeks meaning rather than function', explanation: 'Interpretive anthropology asks "what does this mean to participants?" not "what function does this serve?"' },
        { prompt: 'What is the critique of interpretive anthropology?', answer: 'it can be subjective and hard to verify', explanation: 'Critics argue that interpretation depends too much on the anthropologist\'s perspective.' },
      ],
    },
    'political-economy': {
      items: [
        { prompt: 'What is political economy in anthropology?', answer: 'the study of how political and economic forces shape culture', explanation: 'It examines how global capitalism, colonialism, and power structures affect local communities.' },
        { prompt: 'Who is Eric Wolf?', answer: 'an anthropologist who connected local cultures to world-historical processes', explanation: 'Wolf\'s "Europe and the People Without History" showed how no society exists in isolation.' },
        { prompt: 'What is world-systems theory?', answer: 'the analysis of global capitalism as a system of core and periphery', explanation: 'Wallerstein\'s theory shows how wealthy nations exploit poorer ones structurally.' },
        { prompt: 'How does political economy differ from interpretive anthropology?', answer: 'it emphasizes material conditions and power rather than meaning', explanation: 'Political economy asks who benefits and who is harmed by cultural arrangements.' },
        { prompt: 'What is structural violence?', answer: 'harm caused by social structures rather than individual actions', explanation: 'Paul Farmer showed how poverty, racism, and inequality cause suffering systematically.' },
      ],
    },
    'postcolonial-theory': {
      items: [
        { prompt: 'What is postcolonial theory?', answer: 'the study of the legacy of colonialism on cultures and power structures', explanation: 'It examines how colonial relationships continue to shape the world today.' },
        { prompt: 'What is Orientalism?', answer: 'Edward Said\'s concept of how the West constructs the East as exotic and inferior', explanation: 'Said showed that Western knowledge about the East served colonial power.' },
        { prompt: 'What is subaltern studies?', answer: 'the study of marginalized groups whose voices are excluded from dominant narratives', explanation: 'Spivak\'s "Can the Subaltern Speak?" is a foundational text.' },
        { prompt: 'How has anthropology been implicated in colonialism?', answer: 'early anthropology provided knowledge that served colonial administration', explanation: 'Understanding cultures helped colonial powers control them more effectively.' },
        { prompt: 'What does it mean to decolonize anthropology?', answer: 'to challenge the discipline\'s colonial legacy and center indigenous perspectives', explanation: 'Decolonizing means rethinking methods, theory, and power dynamics in research.' },
      ],
    },
    'participant-observation': {
      items: [
        { prompt: 'What is participant observation?', answer: 'the core ethnographic method of participating in and observing community life', explanation: 'The researcher lives with the community, learning through immersive experience.' },
        { prompt: 'What is the observer\'s paradox?', answer: 'the researcher\'s presence may alter the behavior being observed', explanation: 'People may behave differently when they know they are being studied.' },
        { prompt: 'How long should participant observation last?', answer: 'typically at least one year to capture seasonal and cyclical patterns', explanation: 'Extended time builds trust and captures the full range of cultural life.' },
        { prompt: 'What is the role of field notes?', answer: 'systematic written records of observations and reflections', explanation: 'Field notes are the primary data — they must be detailed, organized, and regularly written.' },
        { prompt: 'What is "going native"?', answer: 'over-identifying with the community to the point of losing analytical perspective', explanation: 'Anthropologists must balance participation with maintaining an observer\'s eye.' },
      ],
    },
    'interviews-and-life-histories': {
      items: [
        { prompt: 'What is a semi-structured interview?', answer: 'an interview with a guide but flexibility to follow up on responses', explanation: 'Semi-structured interviews balance consistency with depth.' },
        { prompt: 'What is a life history?', answer: 'a detailed narrative of an individual\'s life as told to the researcher', explanation: 'Life histories reveal how cultural forces shape individual experience.' },
        { prompt: 'What is a key informant?', answer: 'a community member who provides extensive knowledge and insight', explanation: 'Key informants are crucial sources but their perspective is not the whole picture.' },
        { prompt: 'What is the difference between emic and etic perspectives?', answer: 'emic is the insider\'s view and etic is the outsider\'s analytical view', explanation: 'Good ethnography integrates both perspectives.' },
        { prompt: 'Why is informed consent important in anthropological interviews?', answer: 'to ensure participants understand and voluntarily agree to the research', explanation: 'Ethical research requires transparency about purposes, risks, and data use.' },
      ],
    },
    'ethnographic-writing': {
      items: [
        { prompt: 'What is the "crisis of representation"?', answer: 'the critique that ethnographers construct rather than simply report culture', explanation: 'Writing Culture (1986) challenged anthropologists to examine their own literary practices.' },
        { prompt: 'What is polyphony in ethnographic writing?', answer: 'including multiple voices and perspectives in the ethnography', explanation: 'Polyphonic texts give voice to participants rather than only the anthropologist.' },
        { prompt: 'What is reflexivity in ethnographic writing?', answer: 'the researcher acknowledges their own position and how it shapes the account', explanation: 'Reflexive ethnographers examine how their identity, power, and biases affect their work.' },
        { prompt: 'What did "Writing Culture" argue?', answer: 'that ethnographies are literary constructions influenced by power and rhetoric', explanation: 'Clifford and Marcus showed that ethnographic authority is constructed, not given.' },
        { prompt: 'What is an experimental ethnography?', answer: 'an ethnography that uses unconventional narrative forms', explanation: 'Examples include dialogic, performative, poetic, and multimedia ethnographies.' },
      ],
    },
    'reflexivity': {
      items: [
        { prompt: 'What is reflexivity in anthropology?', answer: 'examining how the researcher\'s own position shapes the research', explanation: 'Reflexivity requires awareness of how identity, power, and assumptions influence findings.' },
        { prompt: 'What is positionality?', answer: 'the researcher\'s social location (race gender class nationality) in relation to the community', explanation: 'Positionality affects access, trust, interpretation, and what people share.' },
        { prompt: 'Why did reflexivity become important in anthropology?', answer: 'because scholars recognized that knowledge is always situated and partial', explanation: 'No researcher can produce a view from nowhere — all accounts are partial.' },
        { prompt: 'What is Lila Abu-Lughod\'s contribution to reflexivity?', answer: 'she challenged the concept of culture as creating artificial boundaries', explanation: 'Her "Writing Against Culture" argued for attention to individual experience and power.' },
        { prompt: 'How does reflexivity improve research quality?', answer: 'by making the researcher\'s biases transparent so readers can evaluate the account', explanation: 'Transparency about limitations strengthens rather than weakens anthropological knowledge.' },
      ],
    },
    'research-ethics': {
      items: [
        { prompt: 'What is the AAA Code of Ethics?', answer: 'the ethical guidelines of the American Anthropological Association', explanation: 'The primary obligation is to do no harm to the people studied.' },
        { prompt: 'What is the primary ethical obligation of anthropologists?', answer: 'to the people they study — do no harm', explanation: 'This obligation supersedes the pursuit of knowledge or career advancement.' },
        { prompt: 'What ethical issues arise from long-term fieldwork?', answer: 'complex relationships blurred boundaries and obligations to the community', explanation: 'Fieldwork creates real relationships that carry ethical responsibilities beyond the project.' },
        { prompt: 'What is informed consent in fieldwork?', answer: 'ensuring participants understand the research and freely agree to participate', explanation: 'Consent may be oral in communities where written documents are inappropriate.' },
        { prompt: 'What are the ethics of representing others in writing?', answer: 'anthropologists must be honest yet protect their participants from harm', explanation: 'Pseudonyms, anonymization, and sensitivity to consequences are essential practices.' },
      ],
    },
    'medical-anthropology': {
      items: [
        { prompt: 'What is medical anthropology?', answer: 'the study of health illness and healing across cultures', explanation: 'Medical anthropologists examine how culture shapes health experience and healthcare systems.' },
        { prompt: 'What is the difference between disease and illness?', answer: 'disease is biomedical pathology and illness is the cultural experience of being sick', explanation: 'The same disease is experienced differently depending on cultural context.' },
        { prompt: 'What is an explanatory model?', answer: 'a person\'s understanding of what caused their illness and how to treat it', explanation: 'Arthur Kleinman showed that patients and doctors may have different explanatory models.' },
        { prompt: 'What is structural violence in health?', answer: 'how social structures like poverty and racism create health inequities', explanation: 'Paul Farmer documented how structural violence drives disease in Haiti.' },
        { prompt: 'What is a culture-bound syndrome?', answer: 'a condition recognized in some cultures but not others', explanation: 'Examples include susto (fright illness) in Latin America and hikikomori in Japan.' },
      ],
    },
    'development-anthropology': {
      items: [
        { prompt: 'What is development anthropology?', answer: 'the application of anthropological knowledge to development projects', explanation: 'Development anthropologists work to make aid and development more culturally appropriate.' },
        { prompt: 'What is the critique of top-down development?', answer: 'it ignores local knowledge and imposes external solutions', explanation: 'James Scott\'s "Seeing Like a State" showed how centralized planning fails without local input.' },
        { prompt: 'What is participatory development?', answer: 'involving local communities in planning and implementing development', explanation: 'Participatory approaches center community knowledge and priorities.' },
        { prompt: 'What is the "anti-development" critique?', answer: 'the argument that development itself is a form of Western cultural imperialism', explanation: 'Arturo Escobar argued that "development" serves Western interests more than local needs.' },
        { prompt: 'How can anthropologists improve development outcomes?', answer: 'by providing cultural context local knowledge and community perspectives', explanation: 'Anthropologists help bridge the gap between planners and communities.' },
      ],
    },
    'urban-anthropology': {
      items: [
        { prompt: 'What is urban anthropology?', answer: 'the study of cultural life in cities', explanation: 'Urban anthropologists study migration, inequality, neighborhoods, and urban identity.' },
        { prompt: 'What methods do urban anthropologists use?', answer: 'multi-sited ethnography network analysis and participant observation in urban settings', explanation: 'Urban fieldwork requires adapting traditional methods to complex, mobile populations.' },
        { prompt: 'What is an urban village?', answer: 'a close-knit community within a city that maintains rural-like social ties', explanation: 'Herbert Gans studied Boston\'s West End as an urban village before its demolition.' },
        { prompt: 'How does urbanization affect culture?', answer: 'it creates new cultural forms while transforming existing ones', explanation: 'Cities are engines of cultural innovation, mixing, and conflict.' },
        { prompt: 'What is gentrification from an anthropological perspective?', answer: 'the displacement of existing communities by wealthier newcomers', explanation: 'Gentrification raises questions about belonging, identity, and structural inequality.' },
      ],
    },
    'environmental-anthropology': {
      items: [
        { prompt: 'What is environmental anthropology?', answer: 'the study of human-environment relationships across cultures', explanation: 'It examines how cultures adapt to, modify, and think about the natural world.' },
        { prompt: 'What is traditional ecological knowledge (TEK)?', answer: 'indigenous knowledge about ecosystems accumulated over generations', explanation: 'TEK often provides insights that complement or exceed Western scientific knowledge.' },
        { prompt: 'What is political ecology?', answer: 'the study of how political and economic forces shape environmental problems', explanation: 'Environmental degradation is not just natural — it is driven by power, inequality, and policy.' },
        { prompt: 'What is the Anthropocene?', answer: 'the proposed geological epoch defined by significant human impact on Earth', explanation: 'Anthropologists debate when it began and what it means for different communities.' },
        { prompt: 'How do anthropologists contribute to environmental conservation?', answer: 'by incorporating local knowledge and ensuring community participation', explanation: 'Conservation without community input often fails or displaces people.' },
      ],
    },
    'digital-anthropology': {
      items: [
        { prompt: 'What is digital anthropology?', answer: 'the study of how digital technologies shape culture and social life', explanation: 'It examines online communities, social media, AI, and digital identity.' },
        { prompt: 'Can ethnography be conducted online?', answer: 'yes, virtual ethnography studies online communities and digital culture', explanation: 'Researchers participate in forums, games, and social media as fieldwork sites.' },
        { prompt: 'What ethical issues are unique to digital anthropology?', answer: 'consent in public spaces privacy and the permanence of digital data', explanation: 'Online posts may be public but participants may not expect researcher scrutiny.' },
        { prompt: 'How has social media changed cultural practices?', answer: 'by enabling new forms of community identity and political mobilization', explanation: 'Digital platforms create new cultural spaces while transforming existing practices.' },
        { prompt: 'What is algorithmic culture?', answer: 'how algorithms shape what we see consume and believe', explanation: 'Recommendation algorithms create filter bubbles and shape cultural exposure.' },
      ],
    },
    'indigenous-rights': {
      items: [
        { prompt: 'What is the UN Declaration on the Rights of Indigenous Peoples?', answer: 'a 2007 declaration affirming indigenous peoples\' rights to self-determination and culture', explanation: 'UNDRIP establishes standards for indigenous rights but is not legally binding.' },
        { prompt: 'What is self-determination for indigenous peoples?', answer: 'the right to freely determine their political status and pursue development', explanation: 'Self-determination includes control over land, resources, education, and governance.' },
        { prompt: 'What is FPIC?', answer: 'free prior and informed consent — the right of indigenous peoples to approve projects affecting them', explanation: 'FPIC requires that communities be fully informed and freely consent before development on their lands.' },
        { prompt: 'How have anthropologists both helped and harmed indigenous peoples?', answer: 'helped through advocacy and documentation but harmed through extraction and misrepresentation', explanation: 'The discipline\'s colonial history requires ongoing reckoning and reform.' },
        { prompt: 'What is cultural repatriation?', answer: 'returning cultural objects and human remains to their communities of origin', explanation: 'NAGPRA in the US and similar laws worldwide mandate repatriation of indigenous heritage.' },
      ],
    },
    'migration-and-diaspora': {
      items: [
        { prompt: 'What is a diaspora?', answer: 'a dispersed population with a shared connection to a homeland', explanation: 'Diasporic communities maintain cultural ties across distance and generations.' },
        { prompt: 'What is transnationalism?', answer: 'maintaining connections across national borders', explanation: 'Transnational migrants live in multiple countries simultaneously through communication, travel, and remittances.' },
        { prompt: 'How does migration affect cultural identity?', answer: 'migrants negotiate between home culture and new cultural contexts', explanation: 'This produces hybrid identities and new cultural forms.' },
        { prompt: 'What is forced migration?', answer: 'displacement caused by war persecution or disaster', explanation: 'Refugees and internally displaced persons face unique cultural and psychological challenges.' },
        { prompt: 'How do anthropologists study migration?', answer: 'through multi-sited ethnography following people across locations', explanation: 'Migration research requires fieldwork in sending, receiving, and transit communities.' },
      ],
    },
    'race-and-racism': {
      items: [
        { prompt: 'How do anthropologists understand race?', answer: 'as a social construct with real social consequences', explanation: 'Race has no biological basis but profoundly shapes lived experience through racism.' },
        { prompt: 'What is structural racism?', answer: 'racism embedded in institutions and systems rather than individual attitudes', explanation: 'Structural racism operates through housing, education, healthcare, and criminal justice.' },
        { prompt: 'What is the anthropological contribution to understanding race?', answer: 'demonstrating that human biological variation does not map onto racial categories', explanation: 'Boas and his students challenged scientific racism with empirical evidence.' },
        { prompt: 'What is colorblind racism?', answer: 'the denial of race as significant while ignoring persistent racial inequality', explanation: 'Claiming not to "see color" ignores the structural effects of racial classification.' },
        { prompt: 'How does race intersect with other forms of inequality?', answer: 'through intersectionality with class gender nationality and other categories', explanation: 'Race cannot be understood in isolation from other systems of power.' },
      ],
    },
    'heritage-and-repatriation': {
      items: [
        { prompt: 'What is cultural heritage?', answer: 'the tangible and intangible legacy of cultural groups', explanation: 'Heritage includes artifacts, monuments, languages, practices, and knowledge.' },
        { prompt: 'What is NAGPRA?', answer: 'the Native American Graves Protection and Repatriation Act of 1990', explanation: 'NAGPRA requires museums to return human remains and sacred objects to Native nations.' },
        { prompt: 'What is the debate over museum collections?', answer: 'whether objects taken during colonialism should be returned to source communities', explanation: 'The Benin Bronzes and Elgin Marbles are prominent examples of contested heritage.' },
        { prompt: 'What is intangible cultural heritage?', answer: 'non-physical heritage like oral traditions rituals and knowledge systems', explanation: 'UNESCO recognizes intangible heritage through its Representative List.' },
        { prompt: 'What ethical obligations do anthropologists have regarding cultural heritage?', answer: 'to support community ownership and control of their own heritage', explanation: 'Heritage belongs to the community — not to researchers, museums, or collectors.' },
      ],
    },
    'anthropocene': {
      items: [
        { prompt: 'What is the Anthropocene from an anthropological perspective?', answer: 'a concept that highlights human impact on the planet as a cultural and political phenomenon', explanation: 'Anthropologists ask who is responsible and who suffers most from environmental change.' },
        { prompt: 'What is the critique of the Anthropocene concept?', answer: 'it implies all humans are equally responsible when impacts are unevenly distributed', explanation: 'Some suggest "Capitalocene" or "Plantationocene" as more accurate terms.' },
        { prompt: 'What is multispecies ethnography?', answer: 'ethnographic research that includes non-human organisms as active participants', explanation: 'It challenges the human-centered focus of traditional anthropology.' },
        { prompt: 'How do indigenous communities experience climate change?', answer: 'disproportionately and with unique knowledge for adaptation', explanation: 'Indigenous peoples often bear the greatest costs while contributing least to the problem.' },
        { prompt: 'What can anthropology contribute to environmental crisis?', answer: 'alternative cultural models for human-environment relationships', explanation: 'Many cultures have sustainable practices developed over millennia that Western science is now studying.' },
      ],
    },
  },
  'advanced': {
    'proposal-writing': {
      items: [
        { prompt: 'What are the key components of a research proposal?', answer: 'literature review research questions methods timeline and significance', explanation: 'A strong proposal demonstrates knowledge of the field and a clear plan for investigation.' },
        { prompt: 'What makes a strong research question in anthropology?', answer: 'it is specific ethnographically grounded and theoretically informed', explanation: 'Good questions connect local observations to broader anthropological debates.' },
        { prompt: 'Why is the literature review important in a proposal?', answer: 'it shows how your research contributes to existing knowledge', explanation: 'The review identifies gaps and positions your work within the scholarly conversation.' },
        { prompt: 'What should the methods section specify?', answer: 'site selection data collection techniques timeline and ethical considerations', explanation: 'Reviewers need to know your plan is feasible and ethical.' },
        { prompt: 'How do you justify the significance of your research?', answer: 'by explaining what new knowledge it will produce and why it matters', explanation: 'Significance can be theoretical, methodological, or applied.' },
      ],
    },
    'methodology-selection': {
      items: [
        { prompt: 'How do you choose between qualitative and quantitative methods?', answer: 'based on the research question and what type of data will best answer it', explanation: 'Qualitative methods explore meaning; quantitative methods test patterns.' },
        { prompt: 'What is multi-sited ethnography?', answer: 'conducting fieldwork in multiple locations to trace connections', explanation: 'George Marcus developed this approach for studying global flows and networks.' },
        { prompt: 'When is survey research appropriate in anthropology?', answer: 'when you need systematic data from a large population', explanation: 'Surveys can complement ethnographic methods by providing quantifiable patterns.' },
        { prompt: 'What is action research?', answer: 'research conducted in collaboration with a community to address a problem', explanation: 'Action research blurs the line between research and activism.' },
        { prompt: 'What is methodological triangulation?', answer: 'using multiple methods to study the same question', explanation: 'Triangulation strengthens findings by showing convergence from different approaches.' },
      ],
    },
    'mixed-methods': {
      items: [
        { prompt: 'What are mixed methods in anthropology?', answer: 'combining qualitative and quantitative approaches in one study', explanation: 'Mixed methods provide both depth of meaning and breadth of pattern.' },
        { prompt: 'How can participant observation and surveys complement each other?', answer: 'observation reveals context and surveys reveal patterns across a population', explanation: 'Observation explains why; surveys show how common.' },
        { prompt: 'What is a sequential design?', answer: 'using one method to inform the design of a subsequent method', explanation: 'For example, interviews first to identify themes, then a survey to test their prevalence.' },
        { prompt: 'What challenges arise in mixed-methods research?', answer: 'integrating different data types and resolving contradictions', explanation: 'Contradictions between qualitative and quantitative findings require careful interpretation.' },
        { prompt: 'Why is mixed methods increasingly common in applied anthropology?', answer: 'because funders and policymakers value both qualitative insight and quantitative evidence', explanation: 'Mixed methods bridges anthropological depth with broader generalizability.' },
      ],
    },
    'longitudinal-fieldwork': {
      items: [
        { prompt: 'What is longitudinal fieldwork?', answer: 'returning to the same community over years or decades', explanation: 'Longitudinal research reveals change and continuity that single-visit fieldwork cannot.' },
        { prompt: 'What are the advantages of longitudinal research?', answer: 'tracking change over time and deepening relationships', explanation: 'Extended engagement builds deeper understanding and trust.' },
        { prompt: 'What ethical challenges does longitudinal fieldwork present?', answer: 'evolving relationships changing consent and community expectations', explanation: 'Long-term relationships create obligations that extend beyond the research.' },
        { prompt: 'Name a famous longitudinal ethnography.', answer: 'Napoleon Chagnon\'s decades-long study of the Yanomami', explanation: 'Though controversial, it demonstrates the value and challenges of long-term engagement.' },
        { prompt: 'How has technology changed longitudinal fieldwork?', answer: 'it enables ongoing communication between visits', explanation: 'Email, social media, and video calls maintain relationships between field trips.' },
      ],
    },
    'collaborative-research': {
      items: [
        { prompt: 'What is collaborative research in anthropology?', answer: 'research designed and conducted in partnership with communities', explanation: 'Collaborative research shares power and ensures research serves community needs.' },
        { prompt: 'What is community-based participatory research (CBPR)?', answer: 'a research approach that involves community members as full partners', explanation: 'CBPR addresses community-identified priorities using shared decision-making.' },
        { prompt: 'What are the benefits of collaborative research?', answer: 'more relevant questions better data and more ethical outcomes', explanation: 'Communities contribute local knowledge that improves research quality.' },
        { prompt: 'What challenges does collaborative research present?', answer: 'power imbalances differing priorities and time constraints', explanation: 'True collaboration requires sustained commitment and flexibility from researchers.' },
        { prompt: 'How does collaborative research address anthropology\'s colonial legacy?', answer: 'by redistributing power and centering community voices', explanation: 'It transforms the relationship from extractive to reciprocal.' },
      ],
    },
    'practice-theory': {
      items: [
        { prompt: 'What is practice theory?', answer: 'the study of how everyday actions reproduce and transform social structures', explanation: 'Bourdieu and Giddens developed theories connecting individual action to structural patterns.' },
        { prompt: 'What is habitus?', answer: 'Bourdieu\'s concept of internalized dispositions that guide behavior', explanation: 'Habitus is the way social structures become embodied in individuals.' },
        { prompt: 'What is agency in practice theory?', answer: 'the capacity of individuals to act and potentially change social structures', explanation: 'Practice theory balances structure and agency — people are both shaped by and shape their world.' },
        { prompt: 'What is cultural capital?', answer: 'non-economic resources like education knowledge and taste that confer social advantage', explanation: 'Bourdieu showed how cultural capital reproduces class inequality.' },
        { prompt: 'How does practice theory bridge structure and agency?', answer: 'it shows how structures are reproduced through everyday practices which can also change them', explanation: 'Neither pure structure nor pure agency explains social life — practice connects both.' },
      ],
    },
    'actor-network-theory': {
      items: [
        { prompt: 'What is actor-network theory (ANT)?', answer: 'a theory that treats humans and non-humans as equal actors in networks', explanation: 'Bruno Latour argued that objects, technologies, and ideas act alongside humans.' },
        { prompt: 'What is an actant in ANT?', answer: 'any entity (human or non-human) that makes a difference in a network', explanation: 'A speed bump, a computer program, and a person can all be actants.' },
        { prompt: 'What is translation in ANT?', answer: 'the process by which actors align interests and build networks', explanation: 'Translation explains how diverse actors come together around shared goals.' },
        { prompt: 'What is the symmetry principle in ANT?', answer: 'analyzing human and non-human actors using the same framework', explanation: 'ANT refuses to privilege human agency over material agency.' },
        { prompt: 'What is a criticism of ANT?', answer: 'it can flatten important power differences between human and non-human actors', explanation: 'Critics argue that humans and objects do not have the same kind of agency.' },
      ],
    },
    'ontological-turn': {
      items: [
        { prompt: 'What is the ontological turn in anthropology?', answer: 'taking seriously that different cultures may inhabit different realities', explanation: 'Rather than seeing different "beliefs about" one world, it considers different worlds.' },
        { prompt: 'What is multinaturalism?', answer: 'Viveiros de Castro\'s concept that Amazonian peoples see one culture and many natures', explanation: 'This inverts Western multiculturalism (one nature, many cultures).' },
        { prompt: 'What is the difference between epistemology and ontology?', answer: 'epistemology is about knowledge and ontology is about what exists', explanation: 'The ontological turn moves from "different beliefs about the world" to "different worlds."' },
        { prompt: 'What is a criticism of the ontological turn?', answer: 'it may romanticize difference or make cross-cultural understanding impossible', explanation: 'If we inhabit truly different realities, can we understand each other at all?' },
        { prompt: 'Who are key figures in the ontological turn?', answer: 'Eduardo Viveiros de Castro Philippe Descola and Martin Holbraad', explanation: 'These scholars challenge Western ontological assumptions about nature, culture, and reality.' },
      ],
    },
    'multispecies-ethnography': {
      items: [
        { prompt: 'What is multispecies ethnography?', answer: 'ethnography that includes non-human organisms as participants in social worlds', explanation: 'It examines how humans and other species co-create environments and meanings.' },
        { prompt: 'Why study non-human animals ethnographically?', answer: 'because human lives are entangled with other species in ways that shape culture', explanation: 'Donna Haraway\'s work on companion species exemplifies this approach.' },
        { prompt: 'What is the concept of "becoming with"?', answer: 'Haraway\'s idea that species evolve and exist through mutual relationship', explanation: 'Humans and dogs, for example, have co-evolved and co-shaped each other.' },
        { prompt: 'How does multispecies ethnography challenge anthropocentrism?', answer: 'by decentering humans and recognizing non-human agency', explanation: 'It asks how other species shape human culture, not just vice versa.' },
        { prompt: 'Name an example of multispecies ethnographic research.', answer: 'Anna Tsing\'s study of matsutake mushrooms and global capitalism', explanation: 'The Mushroom at the End of the World traces how fungi, forests, and humans are interconnected.' },
      ],
    },
    'decolonizing-anthropology': {
      items: [
        { prompt: 'What does it mean to decolonize anthropology?', answer: 'to challenge colonial assumptions and center marginalized perspectives', explanation: 'It involves rethinking who does research, how, and for whose benefit.' },
        { prompt: 'What is indigenous methodology?', answer: 'research approaches grounded in indigenous epistemologies and ethics', explanation: 'Linda Tuhiwai Smith\'s "Decolonizing Methodologies" is a foundational text.' },
        { prompt: 'What is epistemic violence?', answer: 'the harm caused by dismissing non-Western knowledge systems', explanation: 'Treating indigenous knowledge as inferior to Western science is a form of epistemic violence.' },
        { prompt: 'How can researchers practice decolonized methods?', answer: 'through reciprocity community control and centering local epistemologies', explanation: 'Decolonized research benefits the community, not just the researcher.' },
        { prompt: 'What is the relationship between decolonization and repatriation?', answer: 'both return control of heritage and knowledge to originating communities', explanation: 'Repatriation of objects, data, and narratives is a concrete decolonizing practice.' },
      ],
    },
    'grant-writing': {
      items: [
        { prompt: 'Name two major funding sources for anthropological research.', answer: 'NSF and Wenner-Gren Foundation', explanation: 'The National Science Foundation and Wenner-Gren are primary funders of anthropological fieldwork.' },
        { prompt: 'What makes a grant proposal competitive?', answer: 'clear significance feasible methods and strong theoretical framing', explanation: 'Reviewers look for importance, innovation, and a realistic plan.' },
        { prompt: 'What is a budget justification?', answer: 'an explanation of why each budget item is necessary', explanation: 'Every expense must be clearly connected to the research activities.' },
        { prompt: 'What is broader impacts in an NSF proposal?', answer: 'how the research benefits society beyond academic knowledge', explanation: 'NSF requires demonstrating societal relevance alongside intellectual merit.' },
        { prompt: 'How do you demonstrate feasibility in a proposal?', answer: 'through preliminary research language skills and community connections', explanation: 'Showing preparation reassures reviewers that you can carry out the plan.' },
      ],
    },
    'academic-publishing': {
      items: [
        { prompt: 'What is the typical publication process for an anthropology article?', answer: 'submit to a journal undergo peer review revise and resubmit', explanation: 'Most articles require one or more rounds of revision before acceptance.' },
        { prompt: 'Name three top anthropology journals.', answer: 'American Ethnologist American Anthropologist and Current Anthropology', explanation: 'These journals publish across subfields and are highly regarded.' },
        { prompt: 'What is the role of peer review?', answer: 'to evaluate quality rigor and contribution before publication', explanation: 'Reviewers assess theoretical framing, methods, evidence, and argument.' },
        { prompt: 'Why is the ethnographic monograph important?', answer: 'it remains the primary format for presenting extended fieldwork', explanation: 'Book-length ethnographies allow depth and complexity that articles cannot.' },
        { prompt: 'What is open access publishing?', answer: 'making research freely available rather than behind paywalls', explanation: 'Open access increases accessibility but often requires author fees.' },
      ],
    },
    'public-anthropology': {
      items: [
        { prompt: 'What is public anthropology?', answer: 'communicating anthropological knowledge to audiences beyond academia', explanation: 'Public anthropologists write for general audiences, engage media, and contribute to public debate.' },
        { prompt: 'Why is public engagement important for anthropology?', answer: 'to demonstrate the discipline\'s relevance and contribute to social issues', explanation: 'Anthropological insights on race, migration, health, and environment are urgently needed.' },
        { prompt: 'What are some forms of public anthropology?', answer: 'blog posts podcasts museum exhibits and op-eds', explanation: 'Reaching public audiences requires adapting academic writing to accessible formats.' },
        { prompt: 'What is the tension between academic and public anthropology?', answer: 'universities reward academic publication over public engagement', explanation: 'Changing promotion criteria to value public work is an ongoing effort.' },
        { prompt: 'Name an example of public anthropology.', answer: 'Jason De Leon\'s work on undocumented migration and museum exhibitions', explanation: 'De Leon\'s "The Land of Open Graves" bridges academic research and public awareness.' },
      ],
    },
    'teaching-anthropology': {
      items: [
        { prompt: 'What is the value of teaching anthropology?', answer: 'it develops critical thinking cultural awareness and global citizenship', explanation: 'Anthropology combats ethnocentrism and promotes understanding of human diversity.' },
        { prompt: 'How can ethnographic examples enhance teaching?', answer: 'by grounding abstract concepts in real human experience', explanation: 'Students connect with specific stories more than abstract theories.' },
        { prompt: 'What is experiential learning in anthropology?', answer: 'learning through doing — such as mini-ethnographies or fieldwork exercises', explanation: 'Students learn anthropological methods by practicing them.' },
        { prompt: 'What challenges does teaching anthropology face?', answer: 'cultural sensitivity student assumptions and covering vast content', explanation: 'Addressing ethnocentric assumptions requires skill and patience.' },
        { prompt: 'Why include indigenous voices in the anthropology curriculum?', answer: 'to decolonize the syllabus and represent diverse perspectives', explanation: 'Including indigenous scholars and community perspectives enriches the curriculum.' },
      ],
    },
    'applied-careers': {
      items: [
        { prompt: 'Where do applied anthropologists work?', answer: 'NGOs government agencies businesses healthcare and tech companies', explanation: 'Anthropological skills are valued across many sectors.' },
        { prompt: 'What is design anthropology?', answer: 'applying anthropological methods to product and service design', explanation: 'Companies like Intel and Microsoft employ anthropologists to understand user behavior.' },
        { prompt: 'What is UX research?', answer: 'user experience research that studies how people interact with products', explanation: 'Many UX researchers have anthropological training.' },
        { prompt: 'How do anthropologists contribute to public health?', answer: 'by understanding cultural factors that affect health behavior', explanation: 'Cultural knowledge improves health interventions by making them culturally appropriate.' },
        { prompt: 'What transferable skills does anthropology provide?', answer: 'qualitative research cross-cultural communication and critical analysis', explanation: 'These skills apply in consulting, policy, education, and many other fields.' },
      ],
    },
    'fieldwork-planning': {
      items: [
        { prompt: 'What is the first step in planning fieldwork?', answer: 'developing a clear research question and reviewing the literature', explanation: 'A good question drives all subsequent decisions about site, methods, and timeline.' },
        { prompt: 'What is site selection?', answer: 'choosing where to conduct fieldwork based on the research question', explanation: 'The site must be appropriate for the question and accessible to the researcher.' },
        { prompt: 'What language preparation is needed?', answer: 'learning the local language or arranging for interpretation', explanation: 'Language ability fundamentally affects the quality of ethnographic data.' },
        { prompt: 'What is an IRB protocol for fieldwork?', answer: 'an ethics review document describing how human subjects will be protected', explanation: 'All research involving humans requires IRB approval before beginning.' },
        { prompt: 'What logistical considerations are important?', answer: 'housing health safety funding and community permissions', explanation: 'Practical planning is as important as intellectual preparation.' },
      ],
    },
    'data-collection': {
      items: [
        { prompt: 'What are the primary data collection methods in ethnography?', answer: 'participant observation interviews and field notes', explanation: 'These three methods form the core of ethnographic data collection.' },
        { prompt: 'How do you organize field notes?', answer: 'with dates categories and both descriptive and reflective entries', explanation: 'Organized notes are essential for later analysis.' },
        { prompt: 'What is a field journal?', answer: 'a personal record of the researcher\'s experiences and reflections', explanation: 'The journal captures the researcher\'s evolving understanding and emotional responses.' },
        { prompt: 'How do you handle unexpected findings?', answer: 'follow them — serendipity is part of fieldwork', explanation: 'The best ethnographic insights often come from unexpected observations.' },
        { prompt: 'What is data saturation?', answer: 'the point where new data no longer reveals new themes', explanation: 'Saturation indicates you have collected sufficient data for analysis.' },
      ],
    },
    'analysis-and-coding': {
      items: [
        { prompt: 'What is coding in qualitative analysis?', answer: 'assigning labels to segments of data to identify patterns', explanation: 'Codes are the building blocks of qualitative analysis.' },
        { prompt: 'What is the difference between open and axial coding?', answer: 'open coding identifies initial categories and axial coding connects them', explanation: 'Open coding is exploratory; axial coding is integrative.' },
        { prompt: 'What is thematic analysis?', answer: 'identifying recurring themes across the dataset', explanation: 'Themes emerge from patterns in the coded data.' },
        { prompt: 'What software tools support qualitative analysis?', answer: 'NVivo Atlas.ti and Dedoose', explanation: 'These tools help organize code and analyze large qualitative datasets.' },
        { prompt: 'How do you ensure analytical rigor?', answer: 'through systematic coding member checking and triangulation', explanation: 'Rigor in qualitative research comes from transparent and systematic methods.' },
      ],
    },
    'writing-ethnography': {
      items: [
        { prompt: 'What is the structure of an ethnographic monograph?', answer: 'introduction theoretical framework chapters on themes methods and conclusion', explanation: 'Each chapter typically addresses a different aspect of the research question.' },
        { prompt: 'How do you balance description and analysis?', answer: 'weave ethnographic detail with theoretical interpretation throughout', explanation: 'The best ethnographies integrate concrete details with analytical insight.' },
        { prompt: 'How do you protect participants in writing?', answer: 'use pseudonyms alter identifying details and consider consequences', explanation: 'Ethical writing protects people from potential harm while maintaining accuracy.' },
        { prompt: 'What makes ethnographic writing compelling?', answer: 'vivid detail strong voice and clear theoretical argument', explanation: 'Good ethnographies read well as stories while making significant intellectual contributions.' },
        { prompt: 'What is the "so what" question?', answer: 'why should anyone outside the field care about this research?', explanation: 'Strong ethnographies connect specific findings to broader human concerns.' },
      ],
    },
    'defense-preparation': {
      items: [
        { prompt: 'What is a thesis defense?', answer: 'an oral examination where you present and defend your research to a committee', explanation: 'The defense demonstrates your mastery of the subject and ability to respond to critique.' },
        { prompt: 'How should you prepare for a defense?', answer: 'reread your work anticipate questions and practice your presentation', explanation: 'Preparation includes both content mastery and presentation skills.' },
        { prompt: 'What types of questions should you expect?', answer: 'questions about theory methods findings limitations and significance', explanation: 'Committee members test depth of understanding and ability to think critically.' },
        { prompt: 'How do you handle a question you cannot answer?', answer: 'acknowledge the limitation honestly and suggest how you would address it', explanation: 'Honesty about limitations demonstrates intellectual maturity.' },
        { prompt: 'What happens after a successful defense?', answer: 'revisions may be required before the final thesis is submitted', explanation: 'Most defenses result in required revisions — this is normal and expected.' },
      ],
    },
  },
};

const READING_PASSAGES = {
  'introductory': [
    { title: 'The Trobriand Islands', focus: 'fieldwork and reciprocity', text: 'In 1915, Bronislaw Malinowski arrived in the Trobriand Islands of Papua New Guinea. He lived among the islanders for years, learning their language and participating in daily life. He discovered the kula ring — a ceremonial exchange of shell necklaces and armbands between island communities. The objects had no economic value but created bonds of trust and obligation. Malinowski showed that economic life cannot be separated from social life.' },
    { title: 'Race Is Not Biology', focus: 'human variation', text: 'Franz Boas, working in the early 1900s, measured the skulls of immigrants and their American-born children. He found that head shape — supposedly a fixed racial trait — changed within a single generation depending on environment. This groundbreaking study helped demonstrate that "race" is not a fixed biological category. Today, geneticists confirm that there is more genetic variation within any racial group than between them.' },
    { title: 'The Nacirema', focus: 'ethnocentrism', text: 'In 1956, Horace Miner published a description of the "Nacirema" people and their bizarre body rituals. They visit "holy-mouth-men" who put instruments in their mouths. They have shrines in their homes with magical potions. Read backward, "Nacirema" is "American." Miner\'s satire showed how describing any culture — including your own — from the outside can make it seem strange.' },
  ],
  'intermediate': [
    { title: 'The Gift', focus: 'economic anthropology', text: 'Marcel Mauss\'s 1925 essay "The Gift" transformed how anthropologists understand exchange. He showed that gift-giving in traditional societies is not voluntary generosity — it creates obligations. You must give, you must receive, and you must reciprocate. Gifts create social bonds that markets cannot. This challenges the Western assumption that all economies naturally tend toward market exchange.' },
    { title: 'Deep Play', focus: 'interpretive anthropology', text: 'Clifford Geertz watched a Balinese cockfight and saw more than gambling. He saw a "deep play" — a cultural performance where status, masculinity, and village rivalries were enacted symbolically. The cockfight was not about money; it was about meaning. Geertz argued that the anthropologist\'s job is to read culture like a text, uncovering layers of significance invisible to the casual observer.' },
  ],
  'upper-division': [
    { title: 'Can the Subaltern Speak?', focus: 'postcolonial theory', text: 'Gayatri Spivak asked a provocative question: when marginalized people speak, are they truly heard? Or do Western frameworks always translate their words into familiar categories? She argued that colonial power structures persist in academia — even well-meaning researchers can silence the very people they study. This challenge pushed anthropology toward greater reflexivity and collaborative methods.' },
    { title: 'Writing Against Culture', focus: 'reflexivity', text: 'Lila Abu-Lughod argued that the concept of "culture" itself can be a problem. By describing people as belonging to a "culture," anthropologists create boundaries that essentialize and freeze human experience. She advocated for "ethnographies of the particular" — focusing on individual lives, contradictions, and change rather than static cultural descriptions.' },
  ],
  'advanced': [
    { title: 'The Mushroom at the End of the World', focus: 'multispecies ethnography', text: 'Anna Tsing followed the matsutake mushroom from the forests of Oregon to the markets of Japan. This mushroom only grows in disturbed forests — it thrives in ruins. Tsing used this to think about how life persists in the ruins of capitalism. Her multispecies ethnography showed that humans, fungi, trees, and economic systems are entangled in ways that no single discipline can fully explain.' },
    { title: 'Decolonizing Methodologies', focus: 'indigenous research', text: 'Linda Tuhiwai Smith, a Maori scholar, challenged Western research as a tool of colonialism. "Research" itself, she argued, is a dirty word in indigenous communities because it has historically extracted knowledge without consent or benefit. Smith outlined indigenous methodologies that center community priorities, respect cultural protocols, and ensure that research serves the people being studied.' },
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
  const bank = CONTENT_BANKS[level]?.[skill];
  if (!bank || !bank.items) return { error: `No content bank for ${level}/${skill}` };

  const items = pick(bank.items, count).map(item => ({
    prompt: item.prompt,
    answer: item.answer,
    explanation: item.explanation,
  }));

  return { type: 'anthropology', skill, level, count: items.length, instruction: 'Answer the following anthropology question.', items };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
}

// Public API

class Anthropology {
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

  getReadingPassage(level) {
    const texts = READING_PASSAGES[level];
    if (!texts) return { error: `No reading passages for ${level}. Available: ${Object.keys(READING_PASSAGES).join(', ')}` };
    return pick(texts, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const level = p.level || 'introductory';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Ready for next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    const text = READING_PASSAGES[level] ? pick(READING_PASSAGES[level], 1)[0] : null;
    return {
      studentId: id, level, targetSkill: target, exercise, readingPassage: text,
      lessonPlan: {
        review: 'Review previously learned anthropological concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: text ? `Read ethnographic passage: "${text.title}"` : 'Apply concepts to a cross-cultural example',
        reflect: `Connect ${target.skill} to broader anthropological themes`,
      },
    };
  }
}

module.exports = Anthropology;

// CLI: node anthropology.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new Anthropology();
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
        const [, id, type] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const level = loadProfile(id).level || 'introductory';
        if (type) { out(api.generateExercise(level, type, 5)); }
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
      default: out({ usage: 'node anthropology.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
