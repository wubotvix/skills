// eClaw MS ELA Reading Informational Text Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-ela-reading-informational');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'cite-evidence': ['cite-textual-evidence'],
    'central-idea-summary': ['determine-central-idea', 'objective-summary'],
    'analyze-development': ['individuals-events-ideas'],
    'technical-connotative-words': ['technical-meaning', 'connotative-figurative'],
    'section-structure': ['section-fits-whole'],
    'author-purpose-pov': ['determine-pov', 'determine-purpose'],
    'multimedia-integration': ['integrate-formats'],
    'evaluate-argument': ['trace-argument', 'claims-vs-reasoning'],
    'compare-authors': ['compare-same-topic'],
  },
  'grade-7': {
    'cite-multiple-evidence': ['cite-several-pieces'],
    'two-central-ideas': ['two-plus-central-ideas', 'analyze-development'],
    'analyze-interactions': ['individuals-events-ideas-interact'],
    'word-choice-tone': ['word-impact-meaning', 'word-impact-tone'],
    'text-organization': ['organizational-structure'],
    'author-distinguish-position': ['distinguish-pov-from-others'],
    'compare-media-formats': ['text-vs-multimedia'],
    'evaluate-reasoning': ['soundness-of-reasoning', 'relevance-of-evidence'],
    'compare-texts-same-topic': ['different-emphasis'],
  },
  'grade-8': {
    'cite-strongest-evidence': ['strongest-textual-evidence'],
    'central-idea-relationship': ['central-idea-development', 'supporting-ideas-relationship'],
    'analyze-connections': ['connections-distinctions'],
    'analogy-allusion': ['analogy-meaning', 'allusion-meaning'],
    'structure-role': ['sentence-role', 'paragraph-role'],
    'author-conflicting-evidence': ['acknowledge-conflicting', 'respond-to-conflicting'],
    'evaluate-media-advantages': ['media-advantages-disadvantages'],
    'evaluate-argument-claims': ['delineate-argument', 'sound-reasoning-sufficient-evidence'],
    'analyze-conflicting-info': ['conflicting-facts', 'conflicting-interpretation'],
  },
};

// ── Passage Bank ──

const PASSAGES = {
  'grade-6': {
    'cite-textual-evidence': [
      { passage: 'Honeybees communicate through a "waggle dance." When a forager finds flowers, it returns to the hive and performs a figure-eight movement. The angle of the dance tells other bees the direction of the food relative to the sun. The duration of the waggle indicates distance.', question: 'What textual evidence supports the claim that bees communicate direction?', answer: 'The angle of the dance tells other bees the direction of the food relative to the sun.', explanation: 'This sentence directly states how direction is communicated through dance angle.' },
      { passage: 'The Great Wall of China was not built all at once. Construction began in the 7th century BCE and continued for over 2,000 years. Different dynasties added new sections, repaired old ones, and connected existing walls. The result is a structure stretching over 13,000 miles.', question: 'Cite evidence that the Wall was built over a long period.', answer: 'Construction began in the 7th century BCE and continued for over 2,000 years.', explanation: 'This directly states the timespan of construction.' },
      { passage: 'Coral reefs support roughly 25% of all marine species despite covering less than 1% of the ocean floor. Scientists call them the "rainforests of the sea." Rising ocean temperatures cause coral bleaching, which threatens this biodiversity. Without intervention, half of all reefs could vanish by 2050.', question: 'What evidence shows coral reefs are disproportionately important?', answer: 'Coral reefs support roughly 25% of all marine species despite covering less than 1% of the ocean floor.', explanation: 'The contrast between 25% of species and less than 1% of ocean floor demonstrates outsized importance.' },
      { passage: 'Sleep deprivation affects teenagers more than most people realize. Studies show that adolescents who sleep fewer than eight hours perform worse on memory tasks. Their reaction times slow significantly, and their mood regulation suffers. The American Academy of Pediatrics recommends delaying school start times.', question: 'Cite evidence that sleep loss impacts cognitive performance.', answer: 'Adolescents who sleep fewer than eight hours perform worse on memory tasks.', explanation: 'This sentence directly links insufficient sleep to measurable cognitive decline.' },
      { passage: 'The Amazon River discharges more water into the ocean than any other river on Earth. At its mouth, the flow is so powerful that fresh water can be detected nearly 100 miles out to sea. This massive output accounts for roughly 20% of all river water entering the oceans worldwide.', question: 'What evidence supports the claim that the Amazon is the largest river by discharge?', answer: 'This massive output accounts for roughly 20% of all river water entering the oceans worldwide.', explanation: 'Contributing 20% of global river discharge proves its unmatched volume.' },
      { passage: 'Monarch butterflies migrate up to 3,000 miles each fall to reach their winter habitat in central Mexico. They navigate using the position of the sun and an internal magnetic compass. No single butterfly makes the full round trip; it takes multiple generations to complete the return journey north.', question: 'Cite evidence that the migration involves more than one generation.', answer: 'No single butterfly makes the full round trip; it takes multiple generations to complete the return journey north.', explanation: 'This directly states the multi-generational nature of the migration.' },
    ],
    'determine-central-idea': [
      { passage: 'Urban gardens are transforming empty lots into sources of fresh produce. In Detroit, over 1,400 community gardens provide food for neighborhoods that lack grocery stores. Volunteers learn gardening skills while building social connections. These gardens also reduce flooding by absorbing rainwater that would otherwise overwhelm storm drains.', question: 'What is the central idea of this passage?', answer: 'Urban gardens provide multiple benefits to communities, including food access, social connection, and environmental improvements.', explanation: 'The passage describes food production, social benefits, and stormwater management — all benefits of urban gardens.' },
      { passage: 'Invasive species cost the U.S. economy an estimated $120 billion per year. Zebra mussels clog water intake pipes, requiring expensive removal. Asian carp outcompete native fish for food, reducing biodiversity. Kudzu vine smothers trees and power lines across the Southeast, demanding constant maintenance.', question: 'What is the central idea?', answer: 'Invasive species cause enormous economic and ecological damage across the United States.', explanation: 'Each example illustrates a different costly impact of invasive species.' },
      { passage: 'The human brain continues developing until about age 25. The prefrontal cortex, responsible for decision-making and impulse control, is one of the last regions to mature. This explains why teenagers sometimes take risks that adults would avoid. Understanding brain development can help educators design better learning environments.', question: 'What is the central idea of this passage?', answer: 'The brain develops gradually into the mid-twenties, which affects teenage decision-making and has implications for education.', explanation: 'The passage connects brain development timelines to teen behavior and educational practice.' },
      { passage: 'Microplastics have been found in the deepest ocean trenches, the highest mountain peaks, and even in human blood. These tiny fragments come from degrading plastic bags, clothing fibers, and industrial waste. Their long-term health effects remain uncertain, but early studies link them to inflammation and cellular damage.', question: 'What is the central idea?', answer: 'Microplastics are now found everywhere on Earth and may pose health risks that scientists are still studying.', explanation: 'The passage emphasizes ubiquity and uncertain but concerning health effects.' },
      { passage: 'Public libraries have evolved far beyond book lending. Many now offer 3D printers, recording studios, and free internet access. Libraries host job-training workshops, citizenship classes, and after-school tutoring. In rural areas, bookmobiles and digital lending expand access to communities miles from the nearest branch.', question: 'What is the central idea?', answer: 'Modern public libraries serve communities through a wide range of resources and services beyond traditional book lending.', explanation: 'Every detail supports the idea that libraries have expanded their role.' },
      { passage: 'Wildfires are a natural part of many ecosystems. Some plant species, like the lodgepole pine, require fire to release their seeds. Fire clears dead wood and returns nutrients to the soil. However, decades of fire suppression have allowed fuel to accumulate, making modern wildfires larger and more destructive than they would naturally be.', question: 'What is the central idea?', answer: 'While fire is naturally beneficial to ecosystems, human fire suppression has made wildfires more severe.', explanation: 'The passage presents fire as natural and helpful, then explains how suppression backfired.' },
    ],
    'objective-summary': [
      { passage: 'In 1928, Alexander Fleming noticed that mold had contaminated one of his bacteria cultures. Instead of discarding it, he observed that the mold killed the surrounding bacteria. He identified the mold as Penicillium and published his findings. It took another decade before other scientists developed penicillin into a usable medicine that saved millions of lives during World War II.', question: 'Write an objective summary of this passage.', answer: 'Alexander Fleming discovered in 1928 that Penicillium mold killed bacteria, and his finding was later developed into the antibiotic penicillin, which saved millions of lives.', explanation: 'A good summary captures key events without adding opinion: the accidental discovery, identification, and later medical application.' },
      { passage: 'The Dust Bowl of the 1930s devastated the Great Plains. Farmers had plowed up native grasses to plant wheat, leaving topsoil exposed. When severe drought struck, wind swept the loose soil into massive dust storms. Thousands of families abandoned their farms and migrated west, creating a humanitarian crisis that reshaped American agriculture policy.', question: 'Provide an objective summary.', answer: 'Farming practices that removed native grasses combined with drought to cause the Dust Bowl, displacing thousands and leading to changes in agricultural policy.', explanation: 'The summary captures cause (farming + drought), effect (displacement), and outcome (policy change) without opinion.' },
      { passage: 'Desalination plants remove salt from seawater to produce fresh drinking water. The most common method, reverse osmosis, pushes water through membranes that filter out salt molecules. While effective, the process requires enormous energy and produces a concentrated brine that can harm marine life when discharged. Researchers are developing solar-powered systems to reduce costs and environmental impact.', question: 'Summarize this passage objectively.', answer: 'Desalination converts seawater to fresh water using reverse osmosis, but the process is energy-intensive and produces harmful brine, prompting research into solar-powered alternatives.', explanation: 'Covers the process, drawbacks, and current research direction without opinion.' },
    ],
    'individuals-events-ideas': [
      { passage: 'When Rachel Carson published "Silent Spring" in 1962, chemical companies attacked her credibility. They called her an alarmist and questioned her qualifications. Despite this opposition, her evidence linking pesticides like DDT to environmental damage proved compelling. Public pressure led President Kennedy to order an investigation, which ultimately resulted in the creation of the Environmental Protection Agency.', question: 'How does the passage develop the idea that one person can influence policy?', answer: 'Carson is introduced as facing opposition, but her evidence convinced the public, leading to a presidential investigation and the creation of the EPA.', explanation: 'The development moves from challenge (industry attacks) to evidence to public response to government action.' },
      { passage: 'The invention of the printing press in 1440 disrupted the control that monasteries held over written knowledge. Before Gutenberg, monks hand-copied texts, making books rare and expensive. The press made books affordable and widely available. Within fifty years, an estimated 20 million volumes had been printed, fueling the spread of literacy and new ideas across Europe.', question: 'How does the passage develop the impact of the printing press?', answer: 'It contrasts the slow, expensive process of hand-copying with the rapid, affordable production of the press, then shows the scale of change with the 20 million volumes statistic.', explanation: 'The development uses before/after contrast and a concrete statistic to show impact.' },
      { passage: 'Malala Yousafzai began advocating for girls\' education in Pakistan at age 11 by writing a blog for the BBC. The Taliban, which had banned girls from attending school, shot her in 2010. After recovering in England, she continued her activism with even greater visibility. In 2014, at age 17, she became the youngest Nobel Peace Prize laureate.', question: 'How are the key events in Malala\'s story developed?', answer: 'Events escalate from early advocacy to a violent attack to recovery and global recognition, showing how adversity strengthened her cause.', explanation: 'The sequence shows escalation: blogging, attack, recovery, Nobel Prize — each event raising the stakes.' },
    ],
    'technical-meaning': [
      { passage: 'Photosynthesis is the process by which plants convert light energy into chemical energy. Chlorophyll, the green pigment in leaves, absorbs sunlight. The plant then uses this energy to transform carbon dioxide and water into glucose and oxygen. This process is essential for nearly all life on Earth.', question: 'What does "photosynthesis" mean based on context clues?', answer: 'Photosynthesis is the process by which plants convert light energy into chemical energy using sunlight, carbon dioxide, and water.', explanation: 'The passage defines the term directly in the first sentence and elaborates with details.' },
      { passage: 'Tectonic plates are massive slabs of Earth\'s lithosphere that float on the semi-liquid asthenosphere below. Where plates converge, one may slide beneath the other in a process called subduction. This creates deep ocean trenches and can trigger earthquakes and volcanic activity along the boundary.', question: 'What does "subduction" mean as used here?', answer: 'Subduction is the process where one tectonic plate slides beneath another at a convergent boundary.', explanation: 'The passage defines subduction in context as one plate sliding under another.' },
      { passage: 'Epidemiologists track the spread of disease through populations. They collect data on infection rates, identify patterns, and trace outbreaks to their sources. During the COVID-19 pandemic, epidemiologists used contact tracing to map how the virus moved through communities and recommend targeted interventions.', question: 'What does "epidemiologists" mean based on context?', answer: 'Epidemiologists are scientists who study how diseases spread through populations by collecting data and tracking outbreaks.', explanation: 'The next sentences explain what epidemiologists do, defining the term through their activities.' },
    ],
    'connotative-figurative': [
      { passage: 'The old factory had been the heart of the town for decades. When it closed, businesses withered along Main Street. The once-bustling sidewalks grew quiet, and a sense of decay settled over the community like fog.', question: 'What is the connotative meaning of "heart" in this passage?', answer: '"Heart" connotes that the factory was the vital center of the town — essential to its life and energy, just as a heart is essential to a body.', explanation: 'The metaphor compares the factory to a heart, implying it sustained the town\'s economic and social life.' },
      { passage: 'Critics dismissed the mayor\'s plan as a band-aid on a bullet wound. They argued that adding two bus routes would barely scratch the surface of the city\'s transportation crisis, which affected over 200,000 commuters daily.', question: 'What does the figurative phrase "band-aid on a bullet wound" suggest?', answer: 'It suggests the mayor\'s plan is a minor, inadequate solution to a severe problem — a small fix for a large crisis.', explanation: 'The figurative language emphasizes the mismatch between a minor remedy and a serious issue.' },
    ],
    'section-fits-whole': [
      { passage: 'Article intro: "Water scarcity affects 2 billion people worldwide." Middle section: "In Cape Town, South Africa, residents faced \'Day Zero\' — the date taps were predicted to run dry. The city imposed strict rationing: 50 liters per person per day. Residents lined up at collection points and reused bathwater for gardens." Conclusion: "Cape Town\'s crisis offers lessons for cities everywhere."', question: 'How does the middle section fit into the overall structure?', answer: 'The middle section provides a specific real-world example (Cape Town) that illustrates the broad claim made in the introduction about global water scarcity, making the abstract problem concrete before the conclusion draws broader lessons.', explanation: 'It bridges the general intro and general conclusion with a detailed case study.' },
      { passage: 'Section 1: "Plastics were invented to solve problems — replacing scarce natural materials like ivory and tortoiseshell." Section 2: "Today, however, plastic pollution chokes oceans, fills landfills, and enters the food chain through microplastics." Section 3: "New biodegradable alternatives and recycling technologies offer hope for reducing plastic waste."', question: 'How does Section 2 fit into the overall structure?', answer: 'Section 2 serves as a turning point, shifting from the positive origins of plastic in Section 1 to the current problems, setting up the solutions presented in Section 3.', explanation: 'It creates a problem-solution structure by introducing the negative consequences that need addressing.' },
    ],
    'determine-pov': [
      { passage: 'The author, a former teacher, writes: "Standardized tests measure one narrow slice of student ability. They reward memorization over critical thinking. Students who excel in art, music, or hands-on problem solving are told their talents don\'t count. We are failing our children by reducing education to a bubble sheet."', question: 'What is the author\'s point of view?', answer: 'The author opposes standardized testing, believing it is too narrow and fails to recognize the full range of student abilities.', explanation: 'Words like "narrow," "failing," and "don\'t count" reveal a critical stance toward standardized testing.' },
      { passage: 'Dr. Patel argues that space exploration funding should increase: "Every dollar spent on NASA generates roughly $7 in economic activity through technology spinoffs. GPS, memory foam, and water purification systems all originated from space research. Cutting this funding would be short-sighted."', question: 'What is Dr. Patel\'s point of view?', answer: 'Dr. Patel supports increased space exploration funding because of its economic returns and technological benefits to society.', explanation: 'The economic multiplier claim and examples of spinoff technologies show a pro-funding stance.' },
    ],
    'determine-purpose': [
      { passage: 'Wearing a helmet reduces the risk of serious head injury by 69% and the risk of death by 42%. Despite these statistics, only 29% of cyclists in the U.S. wear helmets regularly. Many states lack helmet laws for adult riders. The data is clear: helmets save lives, and broader legislation could prevent thousands of injuries each year.', question: 'What is the author\'s purpose?', answer: 'The author\'s purpose is to persuade readers that helmet use and helmet legislation should increase, using statistics to support the argument.', explanation: 'The combination of statistics and the concluding call for "broader legislation" signals a persuasive purpose.' },
    ],
    'integrate-formats': [
      { passage: 'A textbook explains: "The water cycle involves evaporation, condensation, and precipitation." An accompanying diagram shows arrows connecting the ocean, clouds, and mountains, with labels showing temperature changes at each stage. A sidebar table lists average annual rainfall for five climate zones.', question: 'How does the diagram add to the written explanation?', answer: 'The diagram makes the cyclical process visual by showing how water moves between locations and the temperature changes involved, while the table adds specific data the text does not include.', explanation: 'The visual format shows spatial relationships and flow that text alone cannot easily convey.' },
      { passage: 'A news article describes a volcanic eruption in text, providing casualty figures and evacuation timelines. An embedded video shows the eruption plume and ash-covered buildings. A map overlay marks the evacuation zone and shelter locations.', question: 'What does the video and map contribute beyond the text?', answer: 'The video conveys the scale and immediacy of the eruption visually, while the map provides spatial information about affected areas and shelters that text descriptions alone would struggle to communicate clearly.', explanation: 'Visual and spatial media complement the text\'s factual reporting with experiential and geographic detail.' },
    ],
    'trace-argument': [
      { passage: 'The school board argues that starting school at 8:30 instead of 7:30 will improve student health. They cite a study showing that teens who sleep eight or more hours earn higher grades and have fewer absences. They also note that car accidents involving teen drivers decrease in districts with later start times. Opponents say the change would disrupt parent work schedules and bus routes.', question: 'Trace the argument presented by the school board.', answer: 'Claim: Later start times improve student health. Evidence 1: Students who sleep more earn higher grades and miss fewer days. Evidence 2: Teen car accidents decrease with later starts. Counterargument acknowledged: schedule and transportation disruptions.', explanation: 'The argument follows claim-evidence-counterargument structure.' },
    ],
    'claims-vs-reasoning': [
      { passage: 'The senator claims that raising the minimum wage will reduce poverty. She reasons that higher wages mean workers can afford basic necessities without government assistance. She supports this with data showing that states with higher minimum wages have lower poverty rates. Critics counter that higher wages may lead to layoffs.', question: 'Distinguish the claim from the reasoning and evidence.', answer: 'Claim: Raising the minimum wage will reduce poverty. Reasoning: Higher wages allow workers to meet basic needs independently. Evidence: States with higher minimum wages have lower poverty rates.', explanation: 'The claim is the assertion, the reasoning is the logical connection, and the evidence is the supporting data.' },
    ],
    'compare-same-topic': [
      { passage: 'Author A writes about wolves in Yellowstone: "The reintroduction of wolves in 1995 restored balance to the ecosystem. Elk herds, unchecked for decades, had overgrazed riverbanks. Wolves reduced elk numbers, allowing vegetation to recover." Author B writes: "Wolves have devastated ranching communities near Yellowstone. Livestock losses cost ranchers thousands of dollars annually, and compensation programs fall short."', question: 'How do these two authors present the same topic differently?', answer: 'Author A focuses on ecological benefits (ecosystem balance, vegetation recovery) while Author B focuses on economic costs to ranchers (livestock losses, inadequate compensation). They present the same event — wolf reintroduction — with different emphases and perspectives.', explanation: 'Same topic, different stakeholder perspectives: ecological vs. economic framing.' },
    ],
  },
  'grade-7': {
    'cite-several-pieces': [
      { passage: 'Ocean acidification threatens marine ecosystems in multiple ways. Shellfish like oysters and mussels struggle to build their calcium carbonate shells in more acidic water. Coral growth slows as pH drops, weakening reef structures. Even fish behavior changes — studies show that elevated CO2 levels impair the ability of clownfish to detect predators. Scientists project that ocean acidity will increase 150% by 2100 if emissions continue unchecked.', question: 'Cite several pieces of evidence that ocean acidification harms marine life.', answer: 'Evidence 1: Shellfish struggle to build shells. Evidence 2: Coral growth slows and reefs weaken. Evidence 3: Elevated CO2 impairs clownfish predator detection. Together these show harm across multiple species and biological functions.', explanation: 'Strong responses cite multiple, distinct pieces of evidence rather than paraphrasing one.' },
      { passage: 'Remote work has reshaped American cities. Office vacancy rates in San Francisco reached 33% in 2023. Meanwhile, smaller cities like Boise and Tulsa saw population surges as remote workers sought lower costs of living. Commercial real estate values in major downtowns dropped an average of 25%. However, coworking spaces in suburban areas reported record membership.', question: 'Cite several pieces of evidence showing how remote work changed urban areas.', answer: 'Evidence 1: San Francisco office vacancy hit 33%. Evidence 2: Smaller cities like Boise and Tulsa gained population. Evidence 3: Downtown commercial real estate dropped 25%. Evidence 4: Suburban coworking spaces saw record membership.', explanation: 'Multiple data points from different angles build a comprehensive evidence base.' },
    ],
    'two-plus-central-ideas': [
      { passage: 'Antibiotic resistance is one of the greatest threats to global health. Overuse of antibiotics in medicine — prescribing them for viral infections they cannot treat — has accelerated resistant bacteria. Meanwhile, the agricultural industry uses antibiotics to promote livestock growth, creating additional breeding grounds for resistance. At the same time, pharmaceutical companies have largely abandoned antibiotic research because new drugs are less profitable than treatments for chronic conditions.', question: 'Identify two central ideas in this passage.', answer: 'Central idea 1: Antibiotic resistance is growing due to overuse in both medicine and agriculture. Central idea 2: The economic incentives of pharmaceutical companies work against developing new antibiotics to combat resistance.', explanation: 'The passage develops two interconnected but distinct ideas: causes of resistance and the economic barrier to solutions.' },
    ],
    'analyze-development': [
      { passage: 'Social media began as a way to connect friends and family. Early platforms like MySpace let users create personal pages and share music. Facebook expanded the concept by linking real identities to online profiles. Over time, algorithms began curating content to maximize engagement rather than connection. Today, researchers link heavy social media use to increased anxiety, loneliness, and polarized political views.', question: 'How does the passage develop the idea that social media has changed over time?', answer: 'It traces a chronological development: from connection-focused origins (MySpace, early Facebook) to algorithm-driven engagement, ending with negative consequences (anxiety, loneliness, polarization). The progression shows a shift from positive origins to concerning outcomes.', explanation: 'The development follows a chronological arc from idealistic beginnings to problematic present.' },
    ],
    'individuals-events-ideas-interact': [
      { passage: 'When drought struck East Africa in 2011, food prices spiked across the region. The price increases triggered protests in several cities. Governments responded with emergency food imports, which strained national budgets. International aid organizations stepped in, but their relief efforts were slowed by ongoing conflict in Somalia. The interaction of drought, economics, politics, and conflict turned a weather event into a humanitarian catastrophe.', question: 'How do individuals, events, and ideas interact in this passage?', answer: 'The drought (natural event) caused price spikes (economic effect), which triggered protests (social response). Government spending (political response) was insufficient, and international aid (external intervention) was blocked by conflict (security factor). Each element amplified the others.', explanation: 'The passage shows a chain of interactions where each factor compounds the next.' },
    ],
    'word-impact-meaning': [
      { passage: 'The company didn\'t just cut jobs — it gutted the entire research division. Forty years of institutional knowledge walked out the door in a single afternoon. What remained was a hollow shell, stripped of the people who had built the company\'s reputation.', question: 'How does the word "gutted" impact the meaning?', answer: '"Gutted" suggests violent, thorough destruction — removing the essential interior. It conveys that the cuts were not minor reductions but a devastating removal of the company\'s core capabilities, far stronger than "reduced" or "downsized" would suggest.', explanation: 'The visceral, physical connotation of "gutted" intensifies the sense of loss beyond a neutral term.' },
    ],
    'word-impact-tone': [
      { passage: 'The politician "explained" his vote by reciting pre-written talking points. He "addressed concerns" without once looking up from his notes. Afterward, his staff "clarified" his position with a press release that said nothing new.', question: 'How do the quotation marks around key words affect the tone?', answer: 'The quotation marks create a sarcastic, skeptical tone, suggesting that the politician did not genuinely explain, address, or clarify anything. They signal that the author views these actions as performative rather than sincere.', explanation: 'Scare quotes undermine the literal meaning of the words, creating irony and distrust.' },
    ],
    'organizational-structure': [
      { passage: 'First, scientists collect water samples from the river at multiple points. Next, they test for chemical pollutants including heavy metals and pesticides. Then they analyze biological indicators — the types and numbers of aquatic insects present. Finally, they compile their findings into a water quality index score that rates the river\'s health on a scale of 1 to 100.', question: 'What organizational structure does this passage use and why?', answer: 'Sequential/chronological structure, signaled by "first," "next," "then," and "finally." This structure effectively shows the step-by-step scientific process of water quality testing.', explanation: 'Signal words and logical progression identify the sequential structure.' },
      { passage: 'Urban sprawl creates traffic congestion that wastes fuel and time. As a result, commuters in sprawling cities spend an average of 54 minutes per day in traffic. This congestion also increases air pollution, which in turn raises rates of asthma and respiratory illness. Consequently, healthcare costs in sprawling regions are 20% higher than in compact cities.', question: 'Identify and explain the text structure.', answer: 'Cause and effect structure, signaled by "as a result," "in turn," and "consequently." Each cause leads to an effect that becomes the cause of the next problem, creating a chain of consequences from sprawl to health costs.', explanation: 'The chain of cause-effect relationships is marked by clear signal words.' },
    ],
    'distinguish-pov-from-others': [
      { passage: 'The author, an environmental scientist, argues that nuclear power is essential for reducing carbon emissions. She acknowledges that many environmental groups oppose nuclear energy due to waste storage concerns and disaster risks. She responds: "The risks of nuclear power, while real, are far smaller than the certainty of climate catastrophe if we rely solely on fossil fuels and intermittent renewables."', question: 'How does the author distinguish her position from others cited in the text?', answer: 'The author supports nuclear power as necessary for fighting climate change. She distinguishes her view from environmental groups who oppose it by acknowledging their concerns (waste, disasters) but arguing those risks are smaller than the climate consequences of avoiding nuclear.', explanation: 'She presents opposing views fairly before countering them with a risk comparison.' },
    ],
    'text-vs-multimedia': [
      { passage: 'A magazine article about coral bleaching includes detailed paragraphs explaining the science of temperature-induced bleaching. An accompanying photo series shows the same reef section photographed in 2015 (vibrant color) and 2023 (stark white). A video interview with a marine biologist adds her emotional reaction to witnessing the decline.', question: 'Compare what the text and multimedia formats each contribute.', answer: 'The text explains the scientific process (how and why bleaching occurs). The photos provide immediate visual proof of the damage through before-and-after comparison. The video adds a human emotional dimension through the biologist\'s personal response. Together they inform, prove, and move the audience.', explanation: 'Each format contributes a different dimension: explanation, visual evidence, and emotional impact.' },
    ],
    'soundness-of-reasoning': [
      { passage: 'The editorial argues: "Video games cause violence. A study found that 85% of school shooters played violent video games. Therefore, reducing access to these games will reduce violence." However, the editorial does not mention that 97% of all teenage boys play video games, making the 85% statistic expected rather than significant.', question: 'Evaluate the soundness of the reasoning.', answer: 'The reasoning is unsound. The 85% statistic seems alarming until compared with the 97% base rate — if nearly all teenage boys play games, finding that most shooters also played games proves nothing about causation. The editorial confuses correlation with causation and omits the base rate.', explanation: 'Recognizing the base rate fallacy is key to evaluating this argument.' },
    ],
    'relevance-of-evidence': [
      { passage: 'A blogger argues that organic food is healthier than conventional food. She cites three pieces of evidence: (1) organic farms don\'t use synthetic pesticides, (2) her grandmother lived to 95 eating organic food, and (3) a Stanford meta-analysis found no significant nutritional differences between organic and conventional produce.', question: 'Evaluate the relevance and quality of the evidence.', answer: 'Evidence 1 is relevant but doesn\'t directly prove health benefits. Evidence 2 is an anecdote (weak — one person\'s experience doesn\'t prove a pattern). Evidence 3 actually contradicts the blogger\'s claim. The evidence overall does not support the argument that organic food is healthier.', explanation: 'Evaluating each piece shows that the evidence is weak, irrelevant, or contradictory.' },
    ],
    'different-emphasis': [
      { passage: 'Text A: "The construction of the Panama Canal was a triumph of American engineering. Workers moved 240 million cubic yards of earth, conquered tropical disease, and completed in ten years what France had failed to do in twenty." Text B: "The Panama Canal was built at tremendous human cost. Over 5,600 workers died during the American construction phase alone, many from landslides and dynamite accidents. Most were Black Caribbean laborers paid a fraction of white American wages."', question: 'How do the two authors emphasize different evidence on the same topic?', answer: 'Text A emphasizes engineering achievement and national pride (earth moved, diseases conquered, surpassing France). Text B emphasizes human cost and racial inequality (deaths, dangerous conditions, wage disparities). Both discuss the same construction but select evidence that shapes very different narratives.', explanation: 'Same event, different evidence selection creates contrasting narratives of triumph vs. exploitation.' },
    ],
  },
  'grade-8': {
    'strongest-textual-evidence': [
      { passage: 'The city council claims the new park will benefit all residents. Supporters note it will add green space. The mayor said it was "a nice idea." However, an independent study found that property values within a half-mile of similar parks increased 12%, while air quality improved measurably and hospital visits for respiratory issues dropped 8% in adjacent neighborhoods.', question: 'Which is the strongest evidence that the park benefits residents, and why?', answer: 'The independent study is strongest because it provides specific, measurable data (12% property increase, measurable air quality improvement, 8% fewer hospital visits) from a credible, unbiased source. The mayor\'s quote is weak (vague opinion) and "adding green space" is relevant but not measured.', explanation: 'Strongest evidence is specific, measurable, and from a credible source — not vague endorsements.' },
      { passage: 'Some argue that chess improves academic performance. A grandmaster said, "Chess taught me to think." A parent reported her child\'s grades improved after joining chess club. A longitudinal study tracking 3,000 students over four years found that regular chess players scored 10% higher on problem-solving assessments, even when controlling for socioeconomic background.', question: 'Identify the strongest evidence and explain why.', answer: 'The longitudinal study is strongest: it tracks 3,000 students over four years, measures specific outcomes (10% higher scores), and controls for confounding variables. The grandmaster quote is anecdotal opinion, and the parent report is a single uncontrolled anecdote.', explanation: 'Large sample, long duration, controlled variables, and specific measurements make evidence strongest.' },
    ],
    'central-idea-development': [
      { passage: 'Artificial intelligence is transforming medicine, but not without controversy. AI diagnostic tools can analyze medical images faster and sometimes more accurately than human doctors — one system detected breast cancer with 94.5% accuracy compared to radiologists\' 88%. Yet these systems are trained on historical data that underrepresents minorities, leading to higher error rates for Black and Hispanic patients. The promise of AI in healthcare cannot be fulfilled until its training data reflects the full diversity of patients.', question: 'How does the central idea develop across the passage?', answer: 'The central idea — that AI in medicine is promising but flawed — develops through contrast. It begins with AI\'s capability (speed, accuracy), then introduces the complication (biased training data, unequal error rates), and concludes by connecting the two: the promise depends on fixing the flaw.', explanation: 'The development follows promise → problem → conditional resolution.' },
    ],
    'supporting-ideas-relationship': [
      { passage: 'Clean energy adoption is accelerating worldwide. Solar panel costs have dropped 89% since 2010, making them cheaper than coal in most markets. Wind energy now employs more Americans than coal mining. Electric vehicle sales doubled in 2023. These trends are driven by a combination of technological improvement, government subsidies, and growing consumer demand for sustainable products.', question: 'What is the relationship between the central idea and the supporting ideas?', answer: 'The central idea (clean energy is accelerating) is supported by three parallel examples (solar costs, wind employment, EV sales) that each demonstrate acceleration in a different sector. The final sentence provides a unifying explanation (technology, subsidies, demand) for why all three are happening simultaneously.', explanation: 'Supporting ideas provide sector-specific evidence, and the causal explanation ties them together.' },
    ],
    'connections-distinctions': [
      { passage: 'Both Martin Luther King Jr. and Malcolm X fought for Black civil rights, but their approaches differed sharply. King advocated nonviolent resistance, drawing on Gandhi\'s philosophy and his Christian faith. Malcolm X initially promoted Black separatism and self-defense, influenced by the Nation of Islam. Over time, however, both leaders\' views evolved — King became more radical in addressing economic inequality, while Malcolm X, after his pilgrimage to Mecca, embraced a more inclusive vision of racial justice.', question: 'What connections and distinctions does the passage make?', answer: 'Connection: Both fought for Black civil rights and both evolved in their thinking. Distinction: Their methods differed (nonviolence vs. self-defense/separatism) as did their influences (Gandhi/Christianity vs. Nation of Islam). The passage then complicates the simple distinction by showing convergence over time.', explanation: 'The passage connects shared goals, distinguishes methods, then shows how the distinction blurred over time.' },
    ],
    'analogy-meaning': [
      { passage: 'The human immune system operates like a medieval castle\'s defenses. The skin serves as the outer wall, blocking most invaders. White blood cells patrol like guards, identifying and attacking foreign agents. When an infection breaches these defenses, the body raises its temperature — a moat of fire — to create hostile conditions for the invader.', question: 'How does the castle analogy help convey the immune system\'s function?', answer: 'The analogy maps familiar castle defenses onto biological processes: skin = outer wall (passive barrier), white blood cells = guards (active defense), fever = moat of fire (environmental countermeasure). This makes abstract biology concrete and shows the layered, strategic nature of immune response.', explanation: 'The analogy works at multiple levels, each castle element clarifying a biological function.' },
    ],
    'allusion-meaning': [
      { passage: 'The startup promised revolutionary technology, but investors soon realized it was an Emperor\'s New Clothes situation. The product demos used pre-recorded footage, the "AI" was actually human workers behind a screen, and the patents covered technology that didn\'t exist yet. Like the crowd watching the naked emperor, early supporters had praised what wasn\'t there.', question: 'What does the allusion to "The Emperor\'s New Clothes" convey?', answer: 'The allusion conveys that the startup\'s technology was an illusion that people pretended was real. Just as the emperor paraded naked while people praised his "clothes," investors and supporters praised technology that didn\'t actually exist, out of desire to believe or fear of appearing foolish.', explanation: 'The fairy tale allusion efficiently communicates collective self-deception and fraud.' },
    ],
    'sentence-role': [
      { passage: 'Paragraph: "Scientists have long debated whether octopuses are truly intelligent. They can solve mazes, open jars, and even use tools — behaviors once thought unique to mammals. But intelligence is difficult to define, let alone measure, in an animal whose brain is distributed across eight arms. Perhaps the question is not whether octopuses are intelligent, but whether our concept of intelligence is too narrow."', question: 'What role does the final sentence play?', answer: 'The final sentence reframes the entire discussion. Instead of answering the original question (are octopuses intelligent?), it challenges the premise by suggesting human definitions of intelligence may be inadequate. It shifts the focus from the animal to the concept itself, pushing the reader to think more broadly.', explanation: 'The sentence pivots from a factual debate to a philosophical challenge, refining the key concept.' },
    ],
    'paragraph-role': [
      { passage: 'Article about space debris: Paragraph 1 introduces the growing problem of orbital debris. Paragraph 2 details the "Kessler syndrome" — a chain reaction where collisions create more debris. Paragraph 3: "In 2009, an active Iridium satellite collided with a defunct Russian satellite at 26,000 mph. The impact created over 2,000 trackable fragments, each capable of destroying another satellite. This single event increased the tracked debris population by nearly 10%." Paragraph 4 discusses proposed cleanup solutions.', question: 'What role does Paragraph 3 play in the article?', answer: 'Paragraph 3 provides a concrete, specific example that illustrates the abstract concept (Kessler syndrome) from Paragraph 2. The real-world collision proves the theoretical chain reaction is not hypothetical — it has already begun. The specific numbers (26,000 mph, 2,000+ fragments, 10% increase) make the threat tangible before solutions are discussed in Paragraph 4.', explanation: 'The paragraph bridges theory and solutions by grounding the abstract concept in documented reality.' },
    ],
    'acknowledge-conflicting': [
      { passage: 'Dr. Hayes argues that genetically modified crops are essential for feeding a growing population. She writes: "Critics raise valid concerns about corporate control of seed supplies and potential allergenicity. These are serious issues requiring regulation and continued research. However, the evidence overwhelmingly shows that GM crops increase yields, reduce pesticide use, and can deliver essential nutrients to populations suffering from malnutrition."', question: 'How does the author acknowledge conflicting evidence or viewpoints?', answer: 'Dr. Hayes acknowledges two specific opposing concerns (corporate seed control and allergenicity), validates them as "serious issues," and agrees they need regulation and research. She then pivots with "however" to argue that the benefits (yields, reduced pesticides, nutrition) outweigh these concerns. This strengthens her argument by showing she has considered opposition rather than ignoring it.', explanation: 'Acknowledging and validating opposition before countering it demonstrates intellectual honesty.' },
    ],
    'respond-to-conflicting': [
      { passage: 'The author argues for year-round schooling. She notes opponents claim students need summer for rest and family time. She responds: "Research shows that long breaks actually increase stress as students fall behind and must re-learn material each fall. A year-round calendar with shorter, more frequent breaks provides rest without the learning loss — and families can still vacation during three-week intersessions."', question: 'How does the author respond to conflicting evidence?', answer: 'She directly addresses the opposition\'s claims (need for rest, family time) and counters each one: summer breaks increase stress rather than reduce it (citing research), learning loss is a measurable harm, and year-round schedules still include break time for families. She turns the opponent\'s argument around by showing summer breaks fail at their own stated purpose.', explanation: 'Effective response addresses each opposing point specifically rather than dismissing them broadly.' },
    ],
    'media-advantages-disadvantages': [
      { passage: 'A documentary about climate change uses time-lapse footage of glaciers retreating over decades, compressed into 30 seconds. A companion book covers the same topic with detailed charts showing ice mass measurements, temperature records, and sea level data spanning 150 years. An interactive website lets users input their city to see projected flooding by 2050.', question: 'Evaluate the advantages and disadvantages of each medium.', answer: 'Documentary: advantage — emotional impact and visual proof of change are immediate and compelling; disadvantage — compressed footage can exaggerate the pace. Book: advantage — precise data and long time scales allow rigorous analysis; disadvantage — abstract numbers lack emotional impact. Website: advantage — personalized, interactive data makes the issue feel locally relevant; disadvantage — requires digital access and may oversimplify projections.', explanation: 'Each medium has trade-offs between emotional impact, precision, accessibility, and potential distortion.' },
    ],
    'delineate-argument': [
      { passage: 'The editorial argues: "The voting age should be lowered to 16. Sixteen-year-olds can drive, work, and pay taxes — they have a stake in policy decisions. Research from Austria, where 16-year-olds can vote, shows participation rates comparable to older first-time voters. Critics say teens lack maturity, but we don\'t require maturity tests for adult voters. Expanding the franchise to engaged young citizens strengthens democracy."', question: 'Delineate the structure of this argument.', answer: 'Claim: Voting age should be lowered to 16. Reasons: (1) 16-year-olds already have civic responsibilities (driving, working, paying taxes). Evidence: Austrian data shows comparable participation rates. Counterargument addressed: Teens lack maturity. Rebuttal: No maturity test exists for adult voters. Concluding appeal: Expanding voting strengthens democracy.', explanation: 'Delineating means mapping each component: claim, reasons, evidence, counterargument, rebuttal.' },
    ],
    'sound-reasoning-sufficient-evidence': [
      { passage: 'A health blog claims: "Drinking lemon water every morning detoxifies your body. Lemons contain vitamin C, which is an antioxidant. Our ancient ancestors ate citrus fruits, so our bodies evolved to need them. Three of my readers reported feeling more energetic after trying it for a week."', question: 'Is the reasoning sound and the evidence sufficient?', answer: 'The reasoning is unsound and evidence insufficient. "Detoxifies" is vague and unscientific (the liver and kidneys detoxify; lemon water does not). Vitamin C being an antioxidant doesn\'t prove detoxification. The evolutionary argument is a non sequitur. Three reader reports are anecdotal, uncontrolled, and likely influenced by placebo effect. No clinical evidence is cited.', explanation: 'Each piece of evidence is evaluated: vague claims, logical gaps, and insufficient sample size.' },
    ],
    'conflicting-facts': [
      { passage: 'Source A: "The gray wolf population in the Northern Rockies has recovered to approximately 3,000 animals, exceeding the original recovery goal of 300. Wolves were delisted from the Endangered Species Act in 2011." Source B: "While wolf numbers have increased, genetic studies show that Northern Rockies wolves have lost 20% of their genetic diversity compared to historical populations. Population count alone does not indicate true recovery."', question: 'Where do the sources disagree on matters of fact or interpretation?', answer: 'Both agree wolf numbers increased, but they disagree on interpretation: Source A considers the population recovered (exceeding the 300 goal), while Source B argues population count is insufficient — genetic diversity loss of 20% means the species is not truly recovered. The factual disagreement is about what "recovery" means: numbers vs. genetic health.', explanation: 'The conflict is interpretive — same data (population increase) but different criteria for what constitutes recovery.' },
    ],
    'conflicting-interpretation': [
      { passage: 'Source A: "Screen time studies show that children who use tablets for more than two hours daily score lower on language tests. Limiting screen time is essential for healthy development." Source B: "The same studies Source A cites did not control for content type. Children using educational apps for two hours showed no language deficits. The issue is not screen time itself but what children do with it."', question: 'How do these sources interpret the same information differently?', answer: 'Both reference the same studies but draw opposite conclusions. Source A interprets the correlation between screen time and lower test scores as evidence to limit screen time. Source B argues the studies are flawed because they didn\'t distinguish content types, and interprets the data as showing content matters more than duration. Source B directly challenges Source A\'s methodology.', explanation: 'The conflict hinges on a methodological critique: controlling for content type changes the interpretation entirely.' },
    ],
  },
};

// ── File I/O ──

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

// ── Helpers ──

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

// ── Exercise Generation ──

function generateExercise(grade, skill, count = 3) {
  // Find the skill in the passage bank
  const gradeBank = PASSAGES[grade];
  if (!gradeBank) return { error: `No passage bank for ${grade}` };

  // Look for the skill directly or scan categories
  let items = gradeBank[skill];
  if (!items) {
    // Search through SKILLS to find which category contains this skill
    const cats = SKILLS[grade];
    if (cats) {
      for (const [cat, subs] of Object.entries(cats)) {
        if (subs.includes(skill)) {
          items = gradeBank[skill];
          break;
        }
      }
    }
  }
  if (!items || !items.length) return { error: `No exercises for ${grade}/${skill}` };

  const selected = pick(items, count);
  return {
    type: 'passage-question',
    skill,
    grade,
    count: selected.length,
    instruction: 'Read the passage carefully, then answer the question.',
    items: selected.map(i => ({
      passage: i.passage,
      question: i.question,
      answer: i.answer,
      explanation: i.explanation,
    })),
  };
}

function getPassage(grade, skill) {
  const gradeBank = PASSAGES[grade];
  if (!gradeBank) return { error: `No passages for ${grade}` };
  const items = gradeBank[skill];
  if (!items || !items.length) return { error: `No passages for ${grade}/${skill}` };
  return pick(items, 1)[0];
}

function checkAnswer(expected, answer) {
  const ne = norm(expected), na = norm(answer);
  if (ne === na) return true;
  if (ne.length > 30) {
    const keywords = ne.split(/\s+/).filter(w => w.length > 3);
    if (keywords.length === 0) return false;
    const matched = keywords.filter(k => na.includes(k)).length;
    return matched / keywords.length >= 0.6;
  }
  return false;
}

// ── Public API ──

class ReadingInformational {
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

  generateExercise(grade, skill, count = 3) { return generateExercise(grade, skill, count); }

  checkAnswer(expected, answer) { return { correct: checkAnswer(expected, answer), expected, studentAnswer: answer }; }

  getPassage(grade, skill) { return getPassage(grade, skill); }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-6';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 3);
    const passage = getPassage(grade, target.skill);
    return {
      studentId: id, grade, targetSkill: target, exercise,
      passage: passage.error ? null : passage,
      lessonPlan: {
        read: passage.error ? 'Review a nonfiction passage on the target skill.' : `Read the passage and identify key details.`,
        analyze: `Focus: ${target.category} — ${target.skill}`,
        practice: `Complete ${exercise.count || 0} passage-based questions`,
        apply: 'Write a short response using evidence from the text.',
      },
    };
  }
}

module.exports = ReadingInformational;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const ri = new ReadingInformational();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) ri.setGrade(id, grade);
        out({ action: 'start', profile: ri.getProfile(id), nextSkills: ri.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(ri.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'grade-6';
        if (skill) { out(ri.generateExercise(grade, skill, 3)); }
        else { const n = ri.getNextSkills(id, 1).next; out(n.length ? ri.generateExercise(grade, n[0].skill, 3) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, expected, ...answerParts] = args;
        const answer = answerParts.join(' ');
        if (!expected || !answer) throw new Error('Usage: check <expected> <answer>');
        out(ri.checkAnswer(expected, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(ri.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(ri.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(ri.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(ri.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? ri.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(ri.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(ri.setGrade(id, g)); break; }
      case 'passage': { const [, g, sk] = args; if (!g || !sk) throw new Error('Usage: passage <grade> <skill>'); out(ri.getPassage(g, sk)); break; }
      default: out({ usage: 'node reading-informational.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','passage'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
