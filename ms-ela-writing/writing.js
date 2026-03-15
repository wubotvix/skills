// eClaw MS ELA Writing Interactive Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-ela-writing');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'argument-claim-evidence': ['introduce-claim', 'support-with-reasons', 'use-credible-sources', 'clarify-relationships', 'concluding-statement'],
    'informational-organize': ['introduce-topic', 'use-headings-graphics', 'develop-with-facts', 'appropriate-transitions', 'formal-style'],
    'narrative-engage': ['establish-context', 'organize-events', 'use-dialogue', 'sensory-language', 'provide-conclusion'],
    'writing-process': ['brainstorm', 'outline', 'draft', 'revise-with-guidance', 'edit'],
    'revision-strategies': ['strengthen-thesis', 'add-evidence', 'improve-transitions', 'cut-irrelevant', 'peer-feedback'],
  },
  'grade-7': {
    'argument-counterclaim': ['introduce-claim-preview', 'acknowledge-opposing', 'logical-reasoning', 'create-cohesion', 'formal-concluding'],
    'informational-develop': ['preview-what-follows', 'organize-with-multimedia', 'develop-with-quotations', 'domain-vocabulary', 'formal-style-tone'],
    'narrative-techniques': ['engage-reader', 'natural-sequence', 'dialogue-pacing', 'precise-phrases', 'reflective-conclusion'],
    'writing-coherence': ['task-appropriate', 'clear-development', 'logical-organization', 'consistent-style', 'audience-awareness'],
    'revision-new-approaches': ['try-new-structure', 'rethink-evidence', 'rewrite-sections', 'peer-critique', 'self-assess'],
  },
  'grade-8': {
    'argument-acknowledge-distinguish': ['nuanced-claim', 'distinguish-opposing', 'credible-sources', 'cohesion-clauses', 'implications-conclusion'],
    'informational-complex-ideas': ['previewing-structure', 'definition-classification', 'well-chosen-details', 'varied-transitions', 'domain-specific-style'],
    'narrative-reflection': ['establish-pov', 'natural-unfolding', 'dialogue-pacing-reflection', 'narrative-voice', 'reflective-ending'],
    'writing-style-audience': ['purpose-clarity', 'audience-register', 'style-choices', 'tone-consistency', 'voice-development'],
    'revision-purpose-audience': ['revise-for-purpose', 'revise-for-audience', 'strengthen-argument', 'refine-style', 'final-polish'],
  },
};

// ── Exercise Banks ──

const EXERCISE_BANKS = {
  'grade-6': {
    'introduce-claim': {
      items: [
        { prompt: 'Write a claim for: Should students have homework?', sample: 'Students should not have homework because it reduces time for creative activities and family bonding.', type: 'thesis', rubric: 'Clear position + at least one reason' },
        { prompt: 'Write a claim for: Are school uniforms a good idea?', sample: 'School uniforms benefit students by reducing bullying and helping families save money on clothing.', type: 'thesis', rubric: 'Clear position + at least one reason' },
        { prompt: 'Write a claim for: Should recess be longer?', sample: 'Schools should extend recess to at least 30 minutes because physical activity improves focus and academic performance.', type: 'thesis', rubric: 'Clear position + at least one reason' },
        { prompt: 'Write a claim for: Is social media good for teens?', sample: 'Social media does more harm than good for teenagers because it increases anxiety and reduces face-to-face interaction.', type: 'thesis', rubric: 'Clear position + at least one reason' },
        { prompt: 'Write a claim for: Should junk food be banned in schools?', sample: 'Schools should ban junk food from cafeterias because it contributes to childhood obesity and poor concentration.', type: 'thesis', rubric: 'Clear position + at least one reason' },
        { prompt: 'Write a claim for: Are video games harmful?', sample: 'Video games are not harmful when played in moderation because they improve problem-solving skills and hand-eye coordination.', type: 'thesis', rubric: 'Clear position + at least one reason' },
      ],
    },
    'support-with-reasons': {
      items: [
        { claim: 'Students should have a later school start time.', weak: 'Because sleep is good.', strong: 'Research shows that teenagers need 8-10 hours of sleep, and early start times force them to wake before their natural sleep cycle ends.', rule: 'Strong reasons include specific evidence and explain WHY.' },
        { claim: 'Schools should teach financial literacy.', weak: 'Because money is important.', strong: 'Without financial education, young adults often accumulate credit card debt and fail to budget, leading to long-term financial struggles.', rule: 'Strong reasons show consequences and specifics.' },
        { claim: 'Physical education should be required daily.', weak: 'Because exercise is healthy.', strong: 'Studies from the CDC show that daily physical activity reduces childhood obesity by 25% and improves test scores by an average of 10%.', rule: 'Strong reasons cite data or authority.' },
        { claim: 'Students should learn a second language.', weak: 'Because languages are useful.', strong: 'Bilingual students score higher on standardized tests and have access to twice as many career opportunities in our global economy.', rule: 'Strong reasons provide measurable benefits.' },
        { claim: 'Schools should ban cell phones during class.', weak: 'Because phones are distracting.', strong: 'A University of Texas study found that students who had phones visible during class scored 20% lower on tests than those without phones present.', rule: 'Strong reasons reference research and include data.' },
      ],
    },
    'use-credible-sources': {
      items: [
        { source: 'A post on RandomBlog123.com says vaccines cause illness.', answer: 'not-credible', reason: 'Anonymous blogs are not credible sources; prefer peer-reviewed research or established health organizations.' },
        { source: 'The CDC reports that regular handwashing reduces respiratory illness by 21%.', answer: 'credible', reason: 'The CDC is a government health organization with expert researchers.' },
        { source: 'My friend told me that chocolate cures headaches.', answer: 'not-credible', reason: 'Anecdotal evidence from friends is not a credible source for health claims.' },
        { source: 'According to National Geographic, coral reefs have declined by 50% since 1950.', answer: 'credible', reason: 'National Geographic is a well-known scientific publication.' },
        { source: 'A Wikipedia article says the population of Mars is zero.', answer: 'not-credible', reason: 'Wikipedia can be edited by anyone; use it to find original sources but do not cite it directly.' },
        { source: 'A peer-reviewed study in the Journal of Education found that project-based learning improves retention by 30%.', answer: 'credible', reason: 'Peer-reviewed journals are among the most credible sources available.' },
      ],
    },
    'clarify-relationships': {
      items: [
        { sentence: 'Exercise is important. It reduces stress.', improved: 'Exercise is important because it reduces stress.', transition: 'because', purpose: 'cause-effect' },
        { sentence: 'Some say homework helps. Others disagree.', improved: 'Some say homework helps; however, others disagree.', transition: 'however', purpose: 'contrast' },
        { sentence: 'Reading improves vocabulary. It also builds empathy.', improved: 'Reading improves vocabulary. Additionally, it builds empathy.', transition: 'additionally', purpose: 'addition' },
        { sentence: 'Pollution harms wildlife. Many species are endangered.', improved: 'Pollution harms wildlife. As a result, many species are endangered.', transition: 'as a result', purpose: 'cause-effect' },
        { sentence: 'Technology has benefits. There are drawbacks too.', improved: 'Technology has benefits; nevertheless, there are significant drawbacks.', transition: 'nevertheless', purpose: 'contrast' },
        { sentence: 'Exercise boosts mood. Walking counts.', improved: 'Exercise boosts mood. For example, even a short walk can improve how you feel.', transition: 'for example', purpose: 'example' },
      ],
    },
    'concluding-statement': {
      items: [
        { topic: 'banning plastic bags', weak: 'So that is why plastic bags are bad.', strong: 'By banning single-use plastic bags, communities can protect marine life and take a meaningful step toward a cleaner planet.', rule: 'A strong conclusion restates the claim and connects to broader significance.' },
        { topic: 'longer school year', weak: 'In conclusion, school should be longer.', strong: 'Extending the school year would close achievement gaps and better prepare students for the demands of a global economy.', rule: 'Avoid formulaic openers; add significance.' },
        { topic: 'animal testing', weak: 'That is why animal testing is wrong.', strong: 'With modern alternatives like computer modeling and lab-grown tissue, there is no ethical justification for continued animal testing.', rule: 'Strong conclusions point toward solutions or the future.' },
        { topic: 'school lunch quality', weak: 'So schools should have better lunches.', strong: 'Investing in nutritious school lunches is an investment in student health, focus, and long-term academic success.', rule: 'Reframe the claim in terms of larger impact.' },
      ],
    },
    'introduce-topic': {
      items: [
        { prompt: 'Write an informational opening about volcanoes.', sample: 'Deep beneath the Earth\'s surface, molten rock churns under tremendous pressure. When this pressure finds a weak point in the crust, the result is one of nature\'s most powerful phenomena: a volcanic eruption.', rubric: 'Hook + background + topic introduction' },
        { prompt: 'Write an informational opening about the water cycle.', sample: 'Every drop of water you drink has been recycled billions of times. The water cycle — the continuous movement of water through evaporation, condensation, and precipitation — is the engine that sustains all life on Earth.', rubric: 'Hook + background + topic introduction' },
        { prompt: 'Write an informational opening about photosynthesis.', sample: 'Without a single factory or machine, plants produce the oxygen that every animal on Earth depends on. Through photosynthesis, plants convert sunlight, water, and carbon dioxide into glucose and oxygen.', rubric: 'Hook + background + topic introduction' },
        { prompt: 'Write an informational opening about the solar system.', sample: 'Our solar system stretches across 287 billion miles of space, yet it is just a tiny speck in the Milky Way galaxy. Eight planets, dozens of moons, and countless asteroids orbit a single star: our Sun.', rubric: 'Hook + background + topic introduction' },
      ],
    },
    'use-headings-graphics': {
      items: [
        { text: 'An essay about climate change covers: what it is, causes, effects, and solutions.', answer: ['What Is Climate Change?', 'Causes of Climate Change', 'Effects on the Planet', 'Solutions and Action Steps'], type: 'headings', rule: 'Use clear, descriptive headings that preview section content.' },
        { text: 'A report on the American Revolution covers: causes, key battles, important figures, and outcomes.', answer: ['Causes of the Revolution', 'Key Battles', 'Important Figures', 'Outcomes and Legacy'], type: 'headings', rule: 'Headings should be parallel in structure.' },
        { text: 'An article about healthy eating covers: food groups, meal planning, reading labels, and recipes.', answer: ['Understanding Food Groups', 'Planning Balanced Meals', 'How to Read Nutrition Labels', 'Simple Healthy Recipes'], type: 'headings', rule: 'Headings guide the reader through the content.' },
      ],
    },
    'develop-with-facts': {
      items: [
        { topic: 'ocean pollution', vague: 'The ocean has a lot of trash in it.', developed: 'According to the Ocean Conservancy, over 8 million metric tons of plastic enter the ocean each year, forming massive garbage patches and threatening more than 700 marine species.', rule: 'Develop with specific facts, data, and expert sources.' },
        { topic: 'rainforest deforestation', vague: 'Rainforests are being cut down.', developed: 'The World Wildlife Fund reports that 18.7 million acres of rainforest are lost each year — equivalent to 27 soccer fields every minute — primarily due to agriculture and logging.', rule: 'Use precise numbers and comparisons to make facts vivid.' },
        { topic: 'space exploration', vague: 'Space exploration has led to inventions.', developed: 'NASA\'s space program has produced over 2,000 spinoff technologies, including memory foam, water purification systems, and scratch-resistant eyeglass lenses.', rule: 'List specific examples to develop general claims.' },
        { topic: 'sleep deprivation', vague: 'Not sleeping enough is bad for students.', developed: 'The American Academy of Pediatrics found that students who sleep fewer than 8 hours per night are three times more likely to suffer from depression and twice as likely to struggle academically.', rule: 'Cite authoritative organizations and include statistics.' },
      ],
    },
    'appropriate-transitions': {
      items: [
        { before: 'Recycling saves energy. ___ making a can from recycled aluminum uses 95% less energy than making one from raw materials.', answer: 'For example,', purpose: 'giving an example' },
        { before: 'Many people support solar energy. ___ some argue that the initial cost is too high.', answer: 'However,', purpose: 'showing contrast' },
        { before: 'The experiment tested water temperature. ___ the researchers measured salinity levels.', answer: 'In addition,', purpose: 'adding information' },
        { before: 'Deforestation removes animal habitats. ___ many species face extinction.', answer: 'As a result,', purpose: 'showing cause and effect' },
        { before: 'The first step is to gather materials. ___ mix the dry ingredients together.', answer: 'Next,', purpose: 'sequencing' },
        { before: 'Regular exercise strengthens the heart. ___ it is one of the most important habits for long-term health.', answer: 'Indeed,', purpose: 'emphasizing' },
      ],
    },
    'formal-style': {
      items: [
        { informal: 'Lots of kids think homework is super lame and totally pointless.', formal: 'Many students believe that homework is ineffective and does not contribute to learning.', rule: 'Replace slang and casual language with precise, formal vocabulary.' },
        { informal: 'You should really think about how much water you waste every day.', formal: 'Individuals should consider their daily water consumption and seek ways to reduce waste.', rule: 'Avoid second person (you) in formal essays; use third person.' },
        { informal: 'The experiment was kinda cool because stuff happened that nobody expected.', formal: 'The experiment produced surprising results that contradicted the initial hypothesis.', rule: 'Replace vague words (stuff, things, cool) with precise language.' },
        { informal: 'So basically, pollution is really bad for the environment and we gotta do something about it.', formal: 'Pollution poses a serious threat to the environment, and immediate action is necessary to mitigate its effects.', rule: 'Remove filler words (so, basically) and use formal vocabulary.' },
      ],
    },
    'establish-context': {
      items: [
        { prompt: 'Write an opening that establishes the setting of a rainy school morning.', sample: 'Rain hammered the windows of Bus 42 as it lurched to a stop in front of Lincoln Middle School. Maya clutched her backpack to her chest, dreading the sprint to the front doors.', rubric: 'Establishes setting + character + mood through sensory details' },
        { prompt: 'Write an opening that introduces a character facing a challenge.', sample: 'Aiden stared at the climbing wall, its colorful holds stretching up like a puzzle with no solution. His hands were already sweating, and the harness felt like it was squeezing the air from his lungs.', rubric: 'Introduces character + conflict + physical detail' },
        { prompt: 'Write an opening using dialogue to hook the reader.', sample: '"You cannot be serious," Jada whispered, staring at the posted list. Her name was right there, under the heading "Lead Role" — the last place she ever expected to see it.', rubric: 'Dialogue + character reaction + situation revealed' },
        { prompt: 'Write an opening using action to engage the reader.', sample: 'The soccer ball sailed past Kai\'s outstretched fingers and slammed into the back of the net. The crowd erupted. The championship was slipping away, and there were only three minutes left on the clock.', rubric: 'Action + stakes + tension established immediately' },
      ],
    },
    'organize-events': {
      items: [
        { scrambled: ['She crossed the finish line first.', 'Maya laced up her running shoes.', 'The starting gun fired.', 'She pushed through the pain at mile two.'], order: [1, 2, 3, 0], rule: 'Events should follow chronological order for clarity.' },
        { scrambled: ['The audience applauded.', 'Jake forgot his lines on stage.', 'He took a deep breath and improvised.', 'The school play was about to begin.'], order: [3, 1, 2, 0], rule: 'Build toward the most intense moment.' },
        { scrambled: ['They found the missing dog in the park.', 'The family posted flyers around the neighborhood.', 'Buddy escaped through the open gate.', 'Everyone celebrated at home.'], order: [2, 1, 0, 3], rule: 'Each event should logically lead to the next.' },
      ],
    },
    'use-dialogue': {
      items: [
        { wrong: 'She said she was nervous about the test.', right: '"I can\'t stop thinking about that test," she whispered, gripping the edge of her desk.', rule: 'Show emotions through dialogue and action instead of telling.' },
        { wrong: 'He told his friend he was moving away.', right: '"We\'re moving to Texas," Marcus said, unable to meet Jordan\'s eyes. "My dad got transferred."', rule: 'Dialogue reveals information naturally and shows character.' },
        { wrong: 'The teacher said they did well.', right: '"I have to say," Ms. Chen began, pausing to look at each student, "this is the best work I\'ve seen all year."', rule: 'Use dialogue tags and action beats to bring speech to life.' },
        { wrong: 'They argued about which movie to watch.', right: '"Action movies are way better!" Priya insisted. "No way," countered Dev. "Comedies actually make you feel good."', rule: 'Dialogue shows conflict directly and reveals personality.' },
      ],
    },
    'sensory-language': {
      items: [
        { bland: 'The cafeteria was loud and smelled bad.', vivid: 'The cafeteria roared with the clatter of trays and the shrieks of sixth graders, while the sour smell of overcooked broccoli hung in the humid air.', senses: 'hearing, smell, touch' },
        { bland: 'The forest was pretty.', vivid: 'Sunlight filtered through the canopy in golden shafts, illuminating the mossy carpet below. The air tasted crisp and clean, carrying the earthy scent of pine needles.', senses: 'sight, taste, smell' },
        { bland: 'The gym was hot during the game.', vivid: 'Heat pressed against the gym walls like a living thing. Sneakers squeaked against the glossy floor, and the sharp tang of sweat mingled with the popcorn drifting from the concession stand.', senses: 'touch, hearing, smell' },
        { bland: 'The cookie was good.', vivid: 'The cookie shattered with a satisfying snap, revealing a gooey chocolate center that melted across her tongue, warm and impossibly sweet.', senses: 'hearing, sight, taste, touch' },
      ],
    },
    'provide-conclusion': {
      items: [
        { story: 'A student overcomes stage fright to perform in the talent show.', weak: 'And then it was over and I was happy.', strong: 'As the applause washed over me, I realized the shaking in my hands had stopped. I had spent months terrified of this moment — and now I never wanted it to end.', rule: 'Narrative conclusions should reflect on the experience and show change.' },
        { story: 'Friends resolve a conflict after a misunderstanding.', weak: 'We became friends again.', strong: 'Walking home together that afternoon felt different — lighter. We didn\'t talk about the fight again, but something had shifted between us, a quiet understanding that hadn\'t been there before.', rule: 'Show emotional resolution through specific detail, not summary.' },
      ],
    },
    'brainstorm': {
      items: [
        { prompt: 'List 3 reasons for your position on: Should students choose their own classes?', type: 'list', rubric: 'Three distinct, arguable reasons' },
        { prompt: 'Create a mind map with "climate change" at the center. List 4 branches.', type: 'mind-map', rubric: 'Four related but distinct subtopics' },
        { prompt: 'Freewrite for 3 minutes about a time you faced a difficult choice.', type: 'freewrite', rubric: 'Continuous writing with specific details' },
      ],
    },
    'outline': {
      items: [
        { prompt: 'Create a 5-part outline for an argument essay about school lunch quality.', sample: 'I. Hook + thesis\nII. Reason 1: Nutrition affects learning\nIII. Reason 2: Current options are unhealthy\nIV. Counterargument + rebuttal\nV. Conclusion: Call to action', rubric: 'Clear thesis, organized reasons, conclusion' },
        { prompt: 'Create an outline for a narrative about overcoming a fear.', sample: 'I. Hook: Describe the fear\nII. Rising action: First attempt fails\nIII. Turning point: New approach\nIV. Climax: Facing the fear\nV. Resolution: Reflection on growth', rubric: 'Plot arc with clear conflict and resolution' },
      ],
    },
    'draft': {
      items: [
        { prompt: 'Write a body paragraph arguing that schools should start later. Include a topic sentence, evidence, and explanation.', rubric: 'Topic sentence + evidence + explanation (AXES model)', type: 'paragraph' },
        { prompt: 'Write the opening paragraph of a narrative about getting lost.', rubric: 'Engaging hook + setting + character + hint of conflict', type: 'paragraph' },
      ],
    },
    'revise-with-guidance': {
      items: [
        { draft: 'School lunches are bad. They are unhealthy. Students dont like them. The school should change them.', issues: ['vague language', 'choppy sentences', 'no evidence'], improved: 'School lunches fail to meet basic nutritional standards, offering processed foods high in sodium and sugar. According to the USDA, only 12% of school meals include a full serving of vegetables. Students deserve meals that fuel their learning, not undermine it.', rule: 'Revise for specificity, sentence variety, and evidence.' },
        { draft: 'The forest was nice. There were trees. Birds were singing. It was a good day.', issues: ['bland description', 'no sensory detail', 'telling not showing'], improved: 'Sunlight dappled through the towering oaks, casting shifting patterns on the leaf-covered trail. A cardinal trilled from somewhere above, its song threading through the cool morning air.', rule: 'Revise for vivid sensory language and showing, not telling.' },
      ],
    },
    'edit': {
      items: [
        { draft: 'Their going to the store becuz they need supplys for there project.', corrected: 'They\'re going to the store because they need supplies for their project.', errors: ['their/they\'re', 'becuz/because', 'supplys/supplies', 'there/their'] },
        { draft: 'The students which forgot their homework was given extra time, the teacher was understanding.', corrected: 'The students who forgot their homework were given extra time. The teacher was understanding.', errors: ['which/who', 'was/were (subject-verb agreement)', 'comma splice'] },
        { draft: 'me and him went to the libary to do are science project about volcanos.', corrected: 'He and I went to the library to do our science project about volcanoes.', errors: ['me and him/He and I', 'libary/library', 'are/our', 'volcanos/volcanoes'] },
      ],
    },
    'strengthen-thesis': {
      items: [
        { weak: 'Homework is bad.', strong: 'Excessive homework harms middle school students by increasing stress, reducing sleep, and eliminating time for extracurricular growth.', rule: 'A strong thesis is specific, arguable, and previews the reasons.' },
        { weak: 'Social media is a problem.', strong: 'Social media platforms exploit adolescent psychology, creating addictive feedback loops that damage self-esteem and reduce meaningful social connection.', rule: 'Replace vague claims with precise, evidence-ready assertions.' },
        { weak: 'We should help the environment.', strong: 'Every school in the district should implement a composting program to reduce landfill waste and teach students environmental responsibility.', rule: 'Narrow the scope and specify the action.' },
      ],
    },
    'add-evidence': {
      items: [
        { claim: 'Screen time negatively affects sleep.', without: 'Screens are bad for sleep. Students who use phones at night don\'t sleep well.', with: 'According to the National Sleep Foundation, the blue light emitted by screens suppresses melatonin production by up to 50%, making it significantly harder to fall and stay asleep.', rule: 'Add specific data, expert sources, or research findings.' },
        { claim: 'Reading improves academic performance.', without: 'Reading helps students do better in school.', with: 'A longitudinal study by the University of Michigan found that students who read for 20 minutes daily scored in the 90th percentile on standardized reading tests, compared to the 50th percentile for non-readers.', rule: 'Cite specific studies with measurable results.' },
      ],
    },
    'improve-transitions': {
      items: [
        { choppy: 'Exercise improves heart health. Exercise reduces anxiety. Exercise helps with focus in school.', smooth: 'Exercise improves heart health. Beyond physical benefits, it also reduces anxiety. Most importantly for students, regular physical activity sharpens focus in the classroom.', rule: 'Use varied transition phrases to show relationships between ideas.' },
        { choppy: 'The colonists were angry about taxes. They dumped tea in the harbor. The king sent soldiers.', smooth: 'The colonists were angry about taxes imposed without representation. As a result, they staged the Boston Tea Party, dumping tea into the harbor. In response, the king sent soldiers to restore order.', rule: 'Transitions should clarify cause-effect and chronological relationships.' },
      ],
    },
    'cut-irrelevant': {
      items: [
        { paragraph: 'Schools should offer healthier lunches. Many students eat pizza every day. I love pizza, especially pepperoni. Studies show that poor nutrition leads to lower test scores. My mom makes great pizza at home.', irrelevant: ['I love pizza, especially pepperoni.', 'My mom makes great pizza at home.'], rule: 'Remove sentences that do not support the main idea.' },
        { paragraph: 'The water cycle is essential for life on Earth. Water evaporates from oceans and lakes. My family went to the lake last summer. The vapor rises and forms clouds. I like swimming in lakes.', irrelevant: ['My family went to the lake last summer.', 'I like swimming in lakes.'], rule: 'Personal anecdotes that don\'t support the topic should be cut.' },
      ],
    },
    'peer-feedback': {
      items: [
        { draft: 'Video games are fun and cool. Everyone plays them. They are good for you because they help your brain.', feedback: ['Thesis needs a specific, arguable claim', 'Replace "fun and cool" with precise language', 'Add evidence: what research supports brain benefits?', 'Avoid generalizations like "everyone"'], type: 'argument' },
        { draft: 'I walked into the room. It was dark. I was scared. Something moved.', feedback: ['Add sensory details beyond sight', 'Vary sentence length for pacing', 'Show fear through physical reactions, not just "I was scared"', 'Use more specific nouns: what kind of room?'], type: 'narrative' },
      ],
    },
  },
  'grade-7': {
    'introduce-claim-preview': {
      items: [
        { prompt: 'Write a claim with preview for: Should schools eliminate letter grades?', sample: 'Schools should replace letter grades with mastery-based assessments because traditional grading discourages risk-taking, fails to reflect true understanding, and prioritizes compliance over learning.', rubric: 'Clear claim + preview of 2-3 supporting reasons' },
        { prompt: 'Write a claim with preview for: Should community service be required for graduation?', sample: 'Requiring community service for graduation benefits students and communities alike by building empathy, developing real-world skills, and strengthening civic responsibility.', rubric: 'Clear claim + preview of 2-3 supporting reasons' },
        { prompt: 'Write a claim with preview for: Is year-round schooling better?', sample: 'Year-round schooling is superior to the traditional calendar because it reduces summer learning loss, distributes breaks more evenly, and keeps students engaged throughout the year.', rubric: 'Clear claim + preview of 2-3 supporting reasons' },
      ],
    },
    'acknowledge-opposing': {
      items: [
        { claim: 'Schools should ban single-use plastics.', opposing: 'Some argue that banning plastics is inconvenient and that alternatives are more expensive.', rebuttal: 'While reusable alternatives may cost more upfront, they save money over time and prevent the estimated 8 million tons of plastic entering oceans annually.', rule: 'Acknowledge the opposing view fairly, then counter with evidence.' },
        { claim: 'Students should be allowed to use phones in class.', opposing: 'Critics contend that phones distract students and reduce learning.', rebuttal: 'Although phones can be distracting, structured phone use for research and collaboration actually increases engagement, according to a 2023 study by EdTech Magazine.', rule: 'Use concession words (although, while, admittedly) before countering.' },
        { claim: 'The voting age should be lowered to 16.', opposing: 'Opponents argue that teenagers lack the maturity and knowledge to make informed voting decisions.', rebuttal: 'However, 16-year-olds pay taxes, can drive, and in some states can work full-time — responsibilities that warrant a voice in the democratic process.', rule: 'Counter with logical reasoning and parallel examples.' },
      ],
    },
    'logical-reasoning': {
      items: [
        { argument: 'Everyone in my class has a phone, so all middle schoolers must have phones.', fallacy: 'hasty-generalization', explanation: 'Drawing a broad conclusion from a small, unrepresentative sample.', fix: 'According to Pew Research, 95% of teens ages 13-17 have access to a smartphone.' },
        { argument: 'If we allow students to chew gum, next they\'ll want to eat full meals in class.', fallacy: 'slippery-slope', explanation: 'Assuming one small action will lead to extreme consequences without evidence.', fix: 'Allowing gum in class is a minor policy change; each future request would be evaluated on its own merits.' },
        { argument: 'My favorite athlete says this brand is the best, so it must be true.', fallacy: 'appeal-to-authority', explanation: 'Using a celebrity endorsement instead of relevant evidence.', fix: 'Consumer Reports testing found this brand ranked third in durability and value.' },
        { argument: 'You can\'t trust her argument about recycling because she drove to school today.', fallacy: 'ad-hominem', explanation: 'Attacking the person instead of addressing the argument.', fix: 'Evaluate the recycling argument based on the evidence presented, not the speaker\'s personal habits.' },
      ],
    },
    'create-cohesion': {
      items: [
        { disjointed: 'Renewable energy reduces carbon emissions. Solar panels have become cheaper. Many countries are investing in wind farms. Fossil fuels are running out.', cohesive: 'Renewable energy reduces carbon emissions, making it essential in the fight against climate change. Moreover, solar panels have become significantly cheaper over the past decade. As countries invest in wind farms and solar infrastructure, the transition away from fossil fuels — which are rapidly depleting — becomes both practical and urgent.', rule: 'Use transitions, pronouns, and repeated key terms to link ideas.' },
        { disjointed: 'Reading fiction builds empathy. Characters face different challenges. Readers see new perspectives. Empathy helps in real life.', cohesive: 'Reading fiction builds empathy by immersing readers in the lives of characters who face challenges far different from their own. Through these stories, readers gain new perspectives that extend beyond the page. This deepened understanding of others\' experiences translates directly into stronger real-world relationships and decision-making.', rule: 'Each sentence should connect to the one before and after it.' },
      ],
    },
    'formal-concluding': {
      items: [
        { topic: 'mandatory recess in middle school', conclusion: 'Ultimately, mandatory recess is not a luxury but a necessity. When schools invest in physical breaks, they invest in healthier, more focused, and more resilient students — the kind of investment that pays dividends far beyond the playground.', rubric: 'Restates claim + broader significance + no new evidence' },
        { topic: 'teaching coding in all schools', conclusion: 'In an increasingly digital world, coding literacy is as fundamental as reading and writing. By integrating computer science into every school\'s curriculum, we prepare students not just for future careers, but for informed citizenship in a technology-driven society.', rubric: 'Restates claim + broader significance + forward-looking' },
      ],
    },
    'preview-what-follows': {
      items: [
        { weak: 'This essay is about the water cycle.', strong: 'The water cycle — a continuous process of evaporation, condensation, and precipitation — drives weather patterns, sustains ecosystems, and shapes the landscapes we see every day. Understanding each stage reveals how interconnected our planet\'s systems truly are.', rule: 'Preview the subtopics that the essay will cover.' },
        { weak: 'I am going to write about the Civil War.', strong: 'The American Civil War, fought from 1861 to 1865, reshaped the nation through its causes rooted in slavery and states\' rights, its devastating battles, and its lasting impact on American identity and law.', rule: 'Introduce the topic with context and preview the essay\'s structure.' },
      ],
    },
    'organize-with-multimedia': {
      items: [
        { topic: 'Effects of deforestation', suggestion: 'Include a bar graph comparing annual forest loss by region, a map showing deforestation hotspots, and a before/after satellite image of the Amazon.', rule: 'Multimedia should clarify data, show spatial relationships, or provide visual evidence.' },
        { topic: 'How the heart pumps blood', suggestion: 'Include a labeled diagram of the heart, a flowchart showing the path of blood, and a short video link demonstrating the cardiac cycle.', rule: 'Use graphics to explain processes that are hard to describe in words alone.' },
      ],
    },
    'develop-with-quotations': {
      items: [
        { topic: 'importance of reading', bare: '"Reading is essential."', integrated: 'As literacy researcher Dr. Maryanne Wolf explains, "Reading is the only activity that simultaneously exercises language, memory, and critical thinking" — a combination that no other classroom activity replicates.', rule: 'Integrate quotes with lead-ins and explain their significance.' },
        { topic: 'effects of bullying', bare: '"Bullying causes lasting harm."', integrated: 'According to a 2022 report by the National Academies of Sciences, "students who experience chronic bullying are 2.5 times more likely to develop anxiety disorders by adulthood." This statistic underscores the urgency of anti-bullying programs.', rule: 'Provide context, cite the source, and explain the quote\'s relevance.' },
      ],
    },
    'domain-vocabulary': {
      items: [
        { general: 'The character changed throughout the story.', precise: 'The protagonist underwent a significant transformation, evolving from a timid bystander into a courageous advocate.', domain: 'literary analysis', terms: ['protagonist', 'transformation', 'evolving'] },
        { general: 'The scientist looked at the results.', precise: 'The researcher analyzed the data, noting a statistically significant correlation between the variables.', domain: 'scientific writing', terms: ['analyzed', 'statistically significant', 'correlation', 'variables'] },
        { general: 'The government made a new rule.', precise: 'The legislature enacted a statute regulating carbon emissions from industrial sources.', domain: 'civics/government', terms: ['legislature', 'enacted', 'statute', 'regulating'] },
      ],
    },
    'formal-style-tone': {
      items: [
        { informal: 'This book was totally awesome and I think everyone should read it ASAP.', formal: 'This novel offers a compelling narrative that deserves a wide readership.', rule: 'Eliminate slang, abbreviations, and exclamatory language in formal writing.' },
        { informal: 'The experiment was a bust — nothing worked and we were super confused.', formal: 'The experiment yielded unexpected results that required further investigation to understand.', rule: 'Maintain objective, measured tone even when reporting negative results.' },
        { informal: 'IMO, the president made the wrong call and it was a huge mess.', formal: 'The president\'s decision proved controversial, resulting in significant political and economic consequences.', rule: 'Remove opinion markers (IMO, I think) and use evidence-based language.' },
      ],
    },
    'engage-reader': {
      items: [
        { prompt: 'Write a narrative opening that starts in the middle of action.', sample: 'The rope snapped. For one frozen second, Elara hung in midair, fingers still curled around nothing, the canyon floor two hundred feet below. Then gravity remembered her.', rubric: 'In medias res + immediate tension + sensory detail' },
        { prompt: 'Write a narrative opening that begins with an unusual statement.', sample: 'The day I became invisible was a Tuesday. Not literally invisible — I could still see my own hands — but to everyone at Jefferson Middle School, I had simply ceased to exist.', rubric: 'Intriguing hook + voice + sets up conflict' },
      ],
    },
    'natural-sequence': {
      items: [
        { prompt: 'Reorder for natural flow: (A) She won the science fair. (B) She chose her topic after weeks of research. (C) Her experiment failed twice before succeeding. (D) Maya had always loved chemistry.', answer: 'D, B, C, A', rule: 'Organize events to build logically toward the climax.' },
        { prompt: 'Reorder for natural flow: (A) The crowd cheered. (B) He stepped up to the free-throw line. (C) The ball arced through the air. (D) It swished through the net.', answer: 'B, C, D, A', rule: 'Action sequences should follow cause-to-effect order.' },
      ],
    },
    'dialogue-pacing': {
      items: [
        { fast: '"Run!" she screamed. I ran. The door slammed. Footsteps behind us. Closer.', effect: 'Short sentences and fragments create urgency and speed.', technique: 'fast pacing' },
        { slow: 'She sat on the porch for a long time after he left, watching the fireflies blink on and off in the warm dusk. The swing creaked softly beneath her. Somewhere down the road, a dog barked once, then fell silent.', effect: 'Longer sentences with sensory detail slow the pace for reflection.', technique: 'slow pacing' },
        { prompt: 'Rewrite this at a faster pace: "He walked slowly toward the door. He reached for the handle. He turned it carefully and opened the door."', sample: 'He lunged for the door, wrenched the handle, and threw it open.', rule: 'Use strong verbs, shorter sentences, and remove unnecessary words to speed pace.' },
      ],
    },
    'precise-phrases': {
      items: [
        { vague: 'She walked across the room.', options: ['shuffled', 'strutted', 'crept', 'marched', 'staggered'], rule: 'Choose verbs that convey HOW the action happens.' },
        { vague: 'He looked at her.', options: ['glared', 'gazed', 'squinted', 'peeked', 'stared'], rule: 'Precise verbs reveal emotion and intent.' },
        { vague: 'The food was good.', options: ['savory', 'rich', 'tangy', 'crispy', 'velvety'], rule: 'Replace generic adjectives with sensory-specific ones.' },
        { vague: 'She was sad.', options: ['Her shoulders sagged', 'Tears blurred her vision', 'A lump formed in her throat', 'She bit her trembling lip'], rule: 'Show emotions through physical details instead of naming them.' },
      ],
    },
    'reflective-conclusion': {
      items: [
        { story: 'A student learns a lesson after cheating on a test.', sample: 'Walking out of the principal\'s office, I understood something I couldn\'t have learned from any textbook: the grade I\'d tried to steal was worth far less than the trust I\'d actually lost.', rubric: 'Reflects on experience + reveals insight or change' },
        { story: 'A student stands up to a bully for the first time.', sample: 'My voice had been shaking the whole time — I knew that. But as I watched Marcus walk away, I realized that courage was never about being unafraid. It was about deciding that something else mattered more.', rubric: 'Reflects on internal experience + universal insight' },
      ],
    },
    'task-appropriate': {
      items: [
        { task: 'Write a letter to the principal requesting a new elective.', wrong_approach: 'A narrative story about taking a fun class', right_approach: 'A formal persuasive letter with evidence of student interest and benefits', rule: 'Match your writing form and tone to the task and audience.' },
        { task: 'Explain how a bill becomes a law for a class presentation.', wrong_approach: 'An argumentative essay about which laws are best', right_approach: 'A step-by-step informational explanation with clear structure', rule: 'Informational tasks require explanation, not persuasion.' },
      ],
    },
    'clear-development': {
      items: [
        { weak: 'Dogs are great pets. They are loyal. They are fun. They are loving.', strong: 'Dogs make excellent companions for three key reasons. First, their loyalty is unmatched — studies show dogs form attachments comparable to human parent-child bonds. Second, their playful energy encourages owners to exercise daily. Third, the unconditional affection dogs provide has been shown to reduce stress hormones by up to 30%.', rule: 'Develop each point with evidence and explanation, not just listing.' },
      ],
    },
    'logical-organization': {
      items: [
        { prompt: 'Which organizational pattern fits best: explaining why the Roman Empire fell?', answer: 'cause-and-effect', options: ['chronological', 'cause-and-effect', 'compare-contrast', 'problem-solution'], rule: 'Choose the pattern that best serves your purpose and content.' },
        { prompt: 'Which organizational pattern fits best: showing how cats and dogs differ as pets?', answer: 'compare-contrast', options: ['chronological', 'cause-and-effect', 'compare-contrast', 'problem-solution'], rule: 'Compare-contrast works when examining similarities and differences.' },
      ],
    },
    'consistent-style': {
      items: [
        { mixed: 'The experiment demonstrated that temperature affects reaction rate. It was kinda cool to see. Furthermore, the data reveals a linear correlation. LOL the beakers almost exploded.', issue: 'Shifts between formal academic writing and casual/slang.', fixed: 'The experiment demonstrated that temperature affects reaction rate. This finding proved particularly striking when observed in real time. Furthermore, the data reveals a linear correlation, with higher temperatures producing faster reactions.', rule: 'Maintain a consistent register throughout the piece.' },
      ],
    },
    'audience-awareness': {
      items: [
        { audience: 'Fifth graders', topic: 'how photosynthesis works', approach: 'Use simple analogies (plants are like tiny kitchens), define science terms, keep sentences short.', rule: 'Adapt vocabulary and complexity to your audience.' },
        { audience: 'School board members', topic: 'why the library needs funding', approach: 'Use formal tone, cite usage statistics, reference educational research, propose specific budget amounts.', rule: 'Professional audiences expect evidence, formality, and specific proposals.' },
      ],
    },
    'try-new-structure': {
      items: [
        { original: 'Five-paragraph essay format', alternative: 'Try opening with a vivid anecdote, weaving evidence through a narrative structure, and ending with a call to action instead of a summary.', rule: 'Experimenting with structure can make writing more engaging and effective.' },
        { original: 'Chronological narrative', alternative: 'Try starting at the climax (in medias res), then flashing back to show how the character arrived at that moment.', rule: 'Non-linear structures can create suspense and reader engagement.' },
      ],
    },
    'rethink-evidence': {
      items: [
        { weak: 'I think homework is bad because I don\'t like it.', improved: 'Replace personal opinion with research: cite a Stanford study finding that excessive homework correlates with higher stress and sleep deprivation in adolescents.', rule: 'Replace personal opinions with research, data, and expert testimony.' },
      ],
    },
    'rewrite-sections': {
      items: [
        { original: 'In conclusion, as I have shown in this essay, there are many reasons why school uniforms are a good idea for students.', rewritten: 'School uniforms do more than standardize appearance — they level the socioeconomic playing field, reduce morning decision fatigue, and allow students to focus on what truly matters: learning.', rule: 'Rewrite weak sections completely rather than just tweaking words.' },
      ],
    },
    'peer-critique': {
      items: [
        { draft: 'The Amazon rainforest is being destroyed. This is bad for the environment. Many animals live there. We should save it.', feedback: ['Add specific data: how much is lost annually?', 'Explain WHY it matters to the environment (oxygen, biodiversity)', 'Name specific endangered species for impact', 'Propose concrete solutions in your conclusion'], type: 'informational' },
      ],
    },
    'self-assess': {
      items: [
        { checklist: ['Does my thesis state a clear, arguable claim?', 'Does each body paragraph have a topic sentence?', 'Have I included at least two pieces of evidence?', 'Did I address the counterargument?', 'Does my conclusion go beyond restating the thesis?', 'Is my tone formal and consistent?'], type: 'argument' },
        { checklist: ['Does my opening hook the reader?', 'Is the sequence of events clear and logical?', 'Have I used dialogue, pacing, and description?', 'Do I show emotions rather than tell them?', 'Does my conclusion reflect on the experience?'], type: 'narrative' },
      ],
    },
  },
  'grade-8': {
    'nuanced-claim': {
      items: [
        { simple: 'Social media is bad.', nuanced: 'While social media offers valuable tools for connection and self-expression, its current design prioritizes engagement over well-being, making regulation — not elimination — the most effective path forward.', rule: 'Nuanced claims acknowledge complexity and specify a precise position.' },
        { simple: 'School is important.', nuanced: 'Education is essential not merely for career preparation, but because it cultivates the critical thinking and civic awareness necessary for a functioning democracy.', rule: 'Move beyond obvious claims to reveal deeper significance.' },
        { simple: 'Pollution is a problem.', nuanced: 'Industrial pollution disproportionately affects low-income communities, making environmental policy not only an ecological issue but a matter of social justice.', rule: 'Nuanced claims connect issues to broader themes and specific impacts.' },
      ],
    },
    'distinguish-opposing': {
      items: [
        { claim: 'The electoral college should be abolished.', opposing: 'Supporters argue it protects smaller states\' interests.', distinction: 'While the electoral college was designed to balance representation, it now undermines the democratic principle of majority rule — in five elections, the popular vote winner lost the presidency.', rule: 'Distinguish your claim by showing why the opposing reasoning is flawed or outdated.' },
        { claim: 'Standardized testing should be eliminated.', opposing: 'Proponents claim tests provide objective, comparable data.', distinction: 'Although standardized tests offer measurable data points, research by the National Education Association shows they primarily measure socioeconomic status rather than genuine academic ability, making their "objectivity" illusory.', rule: 'Use evidence to expose weaknesses in the opposing position.' },
      ],
    },
    'credible-sources': {
      items: [
        { scenario: 'You are writing about the effects of sleep deprivation on teens.', best: 'American Academy of Pediatrics clinical report (2023)', acceptable: 'A well-researched news article from The New York Times', weak: 'A blog post by a self-described "sleep enthusiast"', rule: 'Prioritize peer-reviewed research and established institutions over popular media.' },
        { scenario: 'You are writing about climate change policy.', best: 'IPCC Assessment Report', acceptable: 'NASA climate change webpage', weak: 'A politician\'s campaign speech', rule: 'Distinguish between scientific evidence, credible reporting, and opinion.' },
      ],
    },
    'cohesion-clauses': {
      items: [
        { choppy: 'Renewable energy is growing. Fossil fuels still dominate. Change is slow.', cohesive: 'Although renewable energy is growing rapidly, fossil fuels still dominate global energy production — a disparity that underscores how slow the transition has been despite mounting evidence of climate change.', rule: 'Use subordinate clauses and transitional phrases to create complex, flowing sentences.' },
        { choppy: 'The study found a link between exercise and grades. Not all researchers agree. More studies are needed.', cohesive: 'While the study found a significant correlation between regular exercise and higher grades, not all researchers agree on the causal mechanism, suggesting that further investigation is warranted.', rule: 'Combine related ideas using clauses to show relationships and qualifications.' },
      ],
    },
    'implications-conclusion': {
      items: [
        { topic: 'AI in education', conclusion: 'Artificial intelligence will not replace teachers, but it will redefine what teaching means. Schools that embrace AI as a tool for personalized learning — while preserving the irreplaceable human elements of mentorship and empathy — will shape the next generation of thinkers, not just test-takers.', rubric: 'Forward-looking + acknowledges nuance + broader implications' },
        { topic: 'income inequality', conclusion: 'The growing gap between the wealthiest and poorest Americans is not merely an economic statistic — it is a fracture in the social contract that threatens the stability of democracy itself. Addressing it requires not charity, but systemic change.', rubric: 'Elevates to larger significance + calls for action + powerful language' },
      ],
    },
    'previewing-structure': {
      items: [
        { weak: 'This essay will discuss the causes and effects of the Industrial Revolution.', strong: 'The Industrial Revolution, spanning from the late 18th to early 19th century, transformed society through three interconnected forces: technological innovation that mechanized production, urbanization that redrew the social landscape, and labor movements that redefined workers\' rights.', rule: 'Preview specific subtopics and signal the essay\'s organizational logic.' },
      ],
    },
    'definition-classification': {
      items: [
        { prompt: 'Organize information about types of government for an explanatory essay.', pattern: 'classification', example: 'Governments can be classified by how power is distributed: in a democracy, citizens hold power through voting; in an autocracy, a single ruler holds absolute authority; and in an oligarchy, power rests with a small elite group.', rule: 'Use definition and classification to explain complex topics with clear categories.' },
        { prompt: 'Organize information about how earthquakes happen.', pattern: 'cause-effect', example: 'When tectonic plates along a fault line build up stress over decades, the eventual release of that energy sends seismic waves radiating outward, causing the ground to shake violently — what we experience as an earthquake.', rule: 'Use cause-effect structure to explain processes and phenomena.' },
      ],
    },
    'well-chosen-details': {
      items: [
        { weak: 'The Great Depression was a bad time in American history.', strong: 'At the height of the Great Depression in 1933, unemployment reached 24.9%, over 11,000 banks had failed, and families across the Dust Bowl watched their topsoil — and their livelihoods — blow away in black blizzards that darkened the sky for days.', rule: 'Select concrete details that make abstract concepts vivid and memorable.' },
        { weak: 'World War II had a big impact.', strong: 'World War II claimed an estimated 70-85 million lives, redrew the map of Europe, and gave rise to both the United Nations and the nuclear age — consequences that continue to shape global politics eight decades later.', rule: 'Choose details that convey scale, significance, and lasting impact.' },
      ],
    },
    'varied-transitions': {
      items: [
        { repetitive: 'Also, renewable energy creates jobs. Also, it reduces pollution. Also, it lowers energy costs.', varied: 'Renewable energy creates thousands of new jobs annually. Beyond economic benefits, it significantly reduces air and water pollution. Perhaps most compellingly for consumers, it lowers long-term energy costs.', rule: 'Vary transitions to avoid repetition and to signal different relationships.' },
        { repetitive: 'First, mix the ingredients. Second, pour into the pan. Third, bake for 30 minutes.', varied: 'Begin by mixing the dry and wet ingredients until smooth. Once combined, pour the batter into a greased pan. After baking at 350 degrees for 30 minutes, the edges should pull away from the pan.', rule: 'Embed transitions naturally rather than relying on numbered sequences.' },
      ],
    },
    'domain-specific-style': {
      items: [
        { general: 'The character in the book learned something important.', literary: 'Through the protagonist\'s arc, Cisneros illustrates the theme of cultural identity, employing symbolism and code-switching to convey the tension between assimilation and heritage.', domain: 'literary analysis', rule: 'Use discipline-specific terminology and analytical framing.' },
        { general: 'The experiment showed that plants grow better in light.', scientific: 'The experimental group, exposed to 12 hours of full-spectrum light daily, exhibited a mean growth rate 3.2 cm greater than the control group (p < 0.05), supporting the hypothesis that light duration significantly affects photosynthetic output.', domain: 'scientific writing', rule: 'Use precise measurements, technical vocabulary, and reference methodology.' },
      ],
    },
    'establish-pov': {
      items: [
        { prompt: 'Write an opening establishing first-person POV of a nervous performer.', sample: 'My hands wouldn\'t stop shaking. I pressed them flat against my thighs, hoping no one in the front row could see. The auditorium lights were blinding, and somewhere beyond them, three hundred people were waiting for me to speak.', rubric: 'First-person + internal thoughts + physical sensation + setting' },
        { prompt: 'Write an opening establishing third-person limited POV.', sample: 'Kai stood at the edge of the dock, watching the last ferry shrink into the fog. He should have been on it. He should have left this island when he had the chance. But something — maybe stubbornness, maybe fear — had rooted his sneakers to the splintered wood.', rubric: 'Third-person limited + character\'s thoughts + physical detail + tension' },
      ],
    },
    'natural-unfolding': {
      items: [
        { technique: 'foreshadowing', example: 'She almost didn\'t notice the crack in the dam wall. Almost.', effect: 'Hints at coming disaster, building suspense.' },
        { technique: 'flashback', example: 'The smell of pine hit him, and suddenly he was ten again, standing in his grandfather\'s workshop, sawdust curling at his feet.', effect: 'Provides backstory through sensory trigger, adding depth.' },
        { technique: 'in-medias-res', example: 'The lifeboat was sinking. That was the first problem. The second was that no one else seemed to notice.', effect: 'Drops the reader into action, creating immediate engagement.' },
      ],
    },
    'dialogue-pacing-reflection': {
      items: [
        { prompt: 'Write a passage that combines dialogue, pacing, and reflection.', sample: '"You knew?" Her voice cracked on the second word.\nI nodded. What else could I do?\nThe silence between us stretched like taffy — thin and fragile, ready to snap. I wanted to explain, to tell her that knowing and understanding are two completely different things. But the look on her face told me that this was not a moment for explanations. This was a moment for standing still and letting the truth settle like dust after an earthquake.', rubric: 'Dialogue advances conflict + pacing through sentence length + internal reflection reveals character' },
      ],
    },
    'narrative-voice': {
      items: [
        { neutral: 'The school hallway was crowded between classes.', voiced: 'The hallway between third and fourth period was a human pinball machine — backpacks swinging, sneakers squeaking, and somewhere in the chaos, someone was always yelling a name that wasn\'t yours.', rule: 'Voice comes from unique observations, metaphors, and attitude.' },
        { neutral: 'She didn\'t want to move to a new town.', voiced: 'Moving to Millfield was like being told to love a stranger — technically possible, but everything in her resisted it.', rule: 'Voice reveals character through comparison and emotional honesty.' },
      ],
    },
    'reflective-ending': {
      items: [
        { story: 'A student learns that winning isn\'t everything after losing a championship game.', sample: 'We lost 3-2. I keep waiting for that fact to sting less, and maybe someday it will. But what I remember most isn\'t the final buzzer or the other team\'s celebration. It\'s the way Coach looked at us in the locker room afterward and said, "I have never been prouder." I didn\'t believe her then. I\'m starting to now.', rubric: 'Honest reflection + specific detail + evolving understanding + resonant final line' },
      ],
    },
    'purpose-clarity': {
      items: [
        { draft: 'There are many opinions about school start times and this essay will explore some of them.', issue: 'No clear purpose — is this persuasive or informational?', revised: 'This essay argues that middle and high schools should start no earlier than 8:30 AM, based on sleep science and academic performance data.', rule: 'State your purpose clearly so the reader knows what to expect.' },
      ],
    },
    'audience-register': {
      items: [
        { audience: 'peers in a school newspaper', register: 'conversational but informed', example: 'Let\'s be honest: nobody actually reads the school handbook. But there\'s one new policy buried on page 47 that every student needs to know about.' },
        { audience: 'city council members', register: 'formal and evidence-based', example: 'We respectfully urge the council to consider the enclosed data from the Department of Transportation, which demonstrates a 40% reduction in pedestrian accidents in communities that have implemented traffic-calming measures near schools.' },
      ],
    },
    'style-choices': {
      items: [
        { technique: 'parallel structure', before: 'She liked to read books, going for runs, and she swam.', after: 'She liked reading, running, and swimming.', effect: 'Creates rhythm and clarity.' },
        { technique: 'rhetorical question', before: 'People should care about ocean pollution.', after: 'If not us, who will protect the oceans? If not now, when?', effect: 'Engages the reader and emphasizes urgency.' },
        { technique: 'anaphora (repetition)', before: 'We need to act on climate change for many reasons.', after: 'We march because the ice is melting. We march because the seas are rising. We march because our future depends on it.', effect: 'Builds emotional momentum through deliberate repetition.' },
      ],
    },
    'tone-consistency': {
      items: [
        { mixed: 'The humanitarian crisis in Syria has displaced millions. It\'s like, super sad, honestly. International organizations continue to provide aid.', issue: 'Casual interjection breaks the serious, formal tone.', fixed: 'The humanitarian crisis in Syria has displaced millions, creating one of the largest refugee populations in modern history. International organizations continue to provide aid, though the scale of need far exceeds available resources.', rule: 'Match tone to subject matter consistently throughout.' },
      ],
    },
    'voice-development': {
      items: [
        { generic: 'The sunset was beautiful. The colors were orange and pink. It was a nice evening.', voiced: 'The sky looked like someone had spilled watercolors across it — tangerine bleeding into rose, then deepening to bruise-purple at the edges. It was the kind of evening that made you want to say something profound, even though "wow" was all you could manage.', rule: 'Develop voice through fresh comparisons, honest observations, and a distinct perspective.' },
      ],
    },
    'revise-for-purpose': {
      items: [
        { draft: 'An essay about school funding that wanders between arguing for more funding, explaining how funding works, and telling a personal story about an underfunded school.', issue: 'Unclear purpose — argument, explanation, or narrative?', strategy: 'Decide on one primary purpose. If arguing, cut the process explanation and use the personal story only as a hook or evidence.', rule: 'Every paragraph should serve the essay\'s central purpose.' },
      ],
    },
    'revise-for-audience': {
      items: [
        { draft: 'According to the meta-analysis by Hattie (2009), the effect size of formative assessment on student achievement is d=0.90.', audience: 'parents at a school open house', revised: 'Research consistently shows that when teachers give students regular, specific feedback on their progress — rather than just a grade at the end — students learn nearly twice as much.', rule: 'Translate technical language for non-expert audiences while preserving accuracy.' },
      ],
    },
    'strengthen-argument': {
      items: [
        { weak: 'I think schools should have therapy dogs because dogs are cute and make people happy.', strong: 'Schools should implement therapy dog programs because peer-reviewed research from Purdue University demonstrates that interaction with trained therapy animals reduces cortisol levels by 23% and significantly decreases student-reported anxiety.', rule: 'Replace personal opinion with research evidence and specific data.' },
      ],
    },
    'refine-style': {
      items: [
        { wordy: 'Due to the fact that there is a lack of funding in the area of education, many schools are not able to provide the resources that are necessary for students to succeed.', refined: 'Because schools are underfunded, many cannot provide the resources students need to succeed.', rule: 'Cut wordiness: replace "due to the fact that" with "because," eliminate unnecessary phrases.' },
        { wordy: 'It is important to note that the situation with regard to climate change is something that affects each and every one of us.', refined: 'Climate change affects everyone.', rule: 'Eliminate filler phrases and write with directness.' },
      ],
    },
    'final-polish': {
      items: [
        { checklist: ['Thesis is nuanced and clearly stated', 'Each paragraph opens with a strong topic sentence', 'Evidence comes from credible, cited sources', 'Counterargument is acknowledged and rebutted', 'Transitions are varied and purposeful', 'Conclusion offers implications, not just summary', 'Tone is formal and consistent', 'No grammar, spelling, or punctuation errors', 'Title is engaging and relevant'], type: 'argument-final' },
        { checklist: ['Opening hooks the reader immediately', 'POV is consistent throughout', 'Dialogue sounds natural and advances the plot', 'Pacing varies — fast during action, slow during reflection', 'Sensory details create vivid imagery', 'The ending reflects on the experience meaningfully', 'Voice is distinct and authentic', 'No grammar, spelling, or punctuation errors'], type: 'narrative-final' },
      ],
    },
  },
};

// ── Prompt Banks ──

const WRITING_PROMPTS = {
  argument: [
    'Should students be required to learn a musical instrument?',
    'Is it better to read books or watch documentaries to learn?',
    'Should middle schoolers have jobs?',
    'Are zoos ethical?',
    'Should the school day be shorter with more homework, or longer with less?',
    'Should athletes be role models?',
    'Is technology making us smarter or lazier?',
    'Should kids under 13 be allowed on social media?',
  ],
  informational: [
    'Explain how a natural disaster (your choice) forms and its effects.',
    'Describe the process of how food gets from farm to table.',
    'Explain how the human immune system fights infection.',
    'Describe the causes and effects of the Great Migration.',
    'Explain how artificial intelligence works in everyday life.',
    'Describe how a specific ecosystem maintains balance.',
  ],
  narrative: [
    'Write about a time you had to make a difficult choice.',
    'Tell the story of a day that changed how you see the world.',
    'Write about a misunderstanding that taught you something.',
    'Describe a moment when you surprised yourself.',
    'Write about finding something unexpected.',
    'Tell the story of the hardest thing you have ever had to learn.',
  ],
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

function generateExercise(grade, skill, count = 5) {
  const bank = EXERCISE_BANKS[grade]?.[skill];
  if (!bank) return { error: `No exercise bank for ${grade}/${skill}` };
  const items = bank.items;
  if (!items || !items.length) return { error: `Empty exercise bank for ${grade}/${skill}` };
  const selected = pick(items, count);

  // Thesis / claim writing
  if (selected[0].prompt !== undefined && selected[0].sample !== undefined && selected[0].rubric !== undefined) {
    return { type: 'writing-prompt', skill, grade, count: selected.length, instruction: 'Write a response. Compare to the sample.', items: selected.map(i => ({ prompt: i.prompt, sample: i.sample, rubric: i.rubric })) };
  }
  // Fix-it: wrong → right or informal → formal
  if (selected[0].wrong !== undefined && selected[0].right !== undefined) {
    return { type: 'fix-it', skill, grade, count: selected.length, instruction: 'Fix the error in this text.', items: selected.map(i => ({ prompt: i.wrong, answer: i.right, rule: i.rule || '' })) };
  }
  if (selected[0].informal !== undefined && selected[0].formal !== undefined) {
    return { type: 'fix-it', skill, grade, count: selected.length, instruction: 'Rewrite in formal style.', items: selected.map(i => ({ prompt: i.informal, answer: i.formal, rule: i.rule || '' })) };
  }
  // Weak → strong improvement
  if (selected[0].weak !== undefined && selected[0].strong !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Improve this weak example.', items: selected.map(i => ({ prompt: i.weak, answer: i.strong, rule: i.rule || '' })) };
  }
  // Claim + weak/strong reasons
  if (selected[0].claim !== undefined && selected[0].weak !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Strengthen this weak reasoning.', items: selected.map(i => ({ prompt: `Claim: ${i.claim}\nWeak: ${i.weak}`, answer: i.strong || i.rebuttal, rule: i.rule || '' })) };
  }
  // Source evaluation
  if (selected[0].source !== undefined && selected[0].answer !== undefined) {
    return { type: 'evaluate', skill, grade, count: selected.length, instruction: 'Is this source credible or not?', items: selected.map(i => ({ prompt: i.source, answer: i.answer, reason: i.reason })) };
  }
  // Transition fill-in
  if (selected[0].before !== undefined && selected[0].answer !== undefined) {
    return { type: 'fill-in', skill, grade, count: selected.length, instruction: 'Fill in the best transition.', items: selected.map(i => ({ prompt: i.before, answer: i.answer, hint: i.purpose })) };
  }
  // Sentence improvement with transitions
  if (selected[0].sentence !== undefined && selected[0].improved !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Connect these sentences with an appropriate transition.', items: selected.map(i => ({ prompt: i.sentence, answer: i.improved, rule: `Use: ${i.transition} (${i.purpose})` })) };
  }
  // Concluding statements
  if (selected[0].topic !== undefined && selected[0].conclusion !== undefined) {
    return { type: 'writing-prompt', skill, grade, count: selected.length, instruction: 'Write a strong conclusion for this topic.', items: selected.map(i => ({ prompt: `Topic: ${i.topic}`, sample: i.conclusion, rubric: i.rubric || 'Restates claim + broader significance' })) };
  }
  if (selected[0].topic !== undefined && selected[0].weak !== undefined && selected[0].strong !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Improve this weak conclusion.', items: selected.map(i => ({ prompt: `Topic: ${i.topic}\nWeak: ${i.weak}`, answer: i.strong, rule: i.rule || '' })) };
  }
  // Ordering exercises
  if (selected[0].scrambled !== undefined && selected[0].order !== undefined) {
    return { type: 'order', skill, grade, count: selected.length, instruction: 'Put these events in the best order.', items: selected.map(i => ({ prompt: i.scrambled.map((s, idx) => `${idx}: ${s}`).join('\n'), answer: i.order.join(', '), rule: i.rule })) };
  }
  // Multiple choice
  if (selected[0].prompt !== undefined && selected[0].answer !== undefined && selected[0].options !== undefined) {
    return { type: 'fill-in-choice', skill, grade, count: selected.length, instruction: 'Choose the best answer.', items: selected.map(i => ({ prompt: i.prompt, options: i.options, answer: i.answer, rule: i.rule || '' })) };
  }
  // Editing exercises
  if (selected[0].draft !== undefined && selected[0].corrected !== undefined) {
    return { type: 'fix-it', skill, grade, count: selected.length, instruction: 'Find and fix all errors.', items: selected.map(i => ({ prompt: i.draft, answer: i.corrected, rule: `Errors: ${(i.errors || []).join(', ')}` })) };
  }
  // Draft with feedback
  if (selected[0].draft !== undefined && selected[0].feedback !== undefined) {
    return { type: 'peer-review', skill, grade, count: selected.length, instruction: 'Review this draft and identify improvements.', items: selected.map(i => ({ prompt: i.draft, feedback: i.feedback, type: i.type || '' })) };
  }
  // Revision with issues
  if (selected[0].draft !== undefined && selected[0].issues !== undefined) {
    return { type: 'revise', skill, grade, count: selected.length, instruction: 'Revise this draft addressing the identified issues.', items: selected.map(i => ({ prompt: i.draft, issues: i.issues, answer: i.improved, rule: i.rule || '' })) };
  }
  // Vague → vivid / bland → vivid
  if (selected[0].bland !== undefined && selected[0].vivid !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Rewrite with vivid sensory details.', items: selected.map(i => ({ prompt: i.bland, answer: i.vivid, rule: `Senses: ${i.senses || ''}` })) };
  }
  if (selected[0].vague !== undefined && (selected[0].options !== undefined || selected[0].vivid !== undefined)) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Replace vague language with precise words.', items: selected.map(i => ({ prompt: i.vague, answer: (i.options || [i.vivid]).join(', '), rule: i.rule || '' })) };
  }
  // Fallacy identification
  if (selected[0].argument !== undefined && selected[0].fallacy !== undefined) {
    return { type: 'identify', skill, grade, count: selected.length, instruction: 'Identify the logical fallacy.', items: selected.map(i => ({ prompt: i.argument, answer: i.fallacy, reason: i.explanation, fix: i.fix })) };
  }
  // Disjointed → cohesive
  if (selected[0].disjointed !== undefined && selected[0].cohesive !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Rewrite for cohesion.', items: selected.map(i => ({ prompt: i.disjointed, answer: i.cohesive, rule: i.rule || '' })) };
  }
  // Choppy → cohesive/smooth/varied
  if (selected[0].choppy !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Improve flow and cohesion.', items: selected.map(i => ({ prompt: i.choppy, answer: i.cohesive || i.smooth || i.varied, rule: i.rule || '' })) };
  }
  // Repetitive → varied
  if (selected[0].repetitive !== undefined && selected[0].varied !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Vary the transitions.', items: selected.map(i => ({ prompt: i.repetitive, answer: i.varied, rule: i.rule || '' })) };
  }
  // General → domain-specific
  if (selected[0].general !== undefined && (selected[0].precise !== undefined || selected[0].literary !== undefined || selected[0].scientific !== undefined)) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Rewrite using domain-specific vocabulary.', items: selected.map(i => ({ prompt: i.general, answer: i.precise || i.literary || i.scientific, rule: i.rule || `Domain: ${i.domain || ''}` })) };
  }
  // Neutral → voiced
  if (selected[0].neutral !== undefined && selected[0].voiced !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Rewrite with a distinctive voice.', items: selected.map(i => ({ prompt: i.neutral, answer: i.voiced, rule: i.rule || '' })) };
  }
  // Generic → voiced
  if (selected[0].generic !== undefined && selected[0].voiced !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Rewrite with a distinctive voice.', items: selected.map(i => ({ prompt: i.generic, answer: i.voiced, rule: i.rule || '' })) };
  }
  // Mixed tone → fixed
  if (selected[0].mixed !== undefined && selected[0].fixed !== undefined) {
    return { type: 'fix-it', skill, grade, count: selected.length, instruction: 'Fix the inconsistent tone.', items: selected.map(i => ({ prompt: i.mixed, answer: i.fixed, rule: i.rule || `Issue: ${i.issue || ''}` })) };
  }
  // Wordy → refined
  if (selected[0].wordy !== undefined && selected[0].refined !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Cut wordiness and write with directness.', items: selected.map(i => ({ prompt: i.wordy, answer: i.refined, rule: i.rule || '' })) };
  }
  // Simple → nuanced
  if (selected[0].simple !== undefined && selected[0].nuanced !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Rewrite as a nuanced claim.', items: selected.map(i => ({ prompt: i.simple, answer: i.nuanced, rule: i.rule || '' })) };
  }
  // Claim with opposing + distinction
  if (selected[0].claim !== undefined && selected[0].opposing !== undefined && selected[0].distinction !== undefined) {
    return { type: 'argument-distinguish', skill, grade, count: selected.length, instruction: 'Distinguish your claim from the opposing view.', items: selected.map(i => ({ prompt: `Claim: ${i.claim}\nOpposing: ${i.opposing}`, answer: i.distinction, rule: i.rule || '' })) };
  }
  // Technique examples
  if (selected[0].technique !== undefined && selected[0].example !== undefined) {
    return { type: 'identify-technique', skill, grade, count: selected.length, instruction: 'Identify the narrative technique and its effect.', items: selected.map(i => ({ prompt: i.example, answer: i.technique, rule: i.effect || '' })) };
  }
  // Style choices (before/after)
  if (selected[0].technique !== undefined && selected[0].before !== undefined && selected[0].after !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Apply the style technique.', items: selected.map(i => ({ prompt: `Technique: ${i.technique}\nOriginal: ${i.before}`, answer: i.after, rule: i.effect || '' })) };
  }
  // Story + sample conclusion
  if (selected[0].story !== undefined && selected[0].sample !== undefined) {
    return { type: 'writing-prompt', skill, grade, count: selected.length, instruction: 'Write a reflective conclusion for this story.', items: selected.map(i => ({ prompt: `Story: ${i.story}`, sample: i.sample, rubric: i.rubric || 'Reflects on experience + reveals insight' })) };
  }
  // Story + weak/strong
  if (selected[0].story !== undefined && selected[0].weak !== undefined && selected[0].strong !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Improve this narrative conclusion.', items: selected.map(i => ({ prompt: `Story: ${i.story}\nWeak: ${i.weak}`, answer: i.strong, rule: i.rule || '' })) };
  }
  // Heading exercises
  if (selected[0].text !== undefined && selected[0].answer !== undefined && selected[0].type === 'headings') {
    return { type: 'organize', skill, grade, count: selected.length, instruction: 'Create appropriate headings.', items: selected.map(i => ({ prompt: i.text, answer: i.answer.join(' | '), rule: i.rule })) };
  }
  // Topic + vague/developed
  if (selected[0].topic !== undefined && selected[0].vague !== undefined && selected[0].developed !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Develop this vague statement with specific facts.', items: selected.map(i => ({ prompt: `Topic: ${i.topic}\nVague: ${i.vague}`, answer: i.developed, rule: i.rule || '' })) };
  }
  // Claim + without/with evidence
  if (selected[0].claim !== undefined && selected[0].without !== undefined && selected[0].with !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Add strong evidence to support this claim.', items: selected.map(i => ({ prompt: `Claim: ${i.claim}\nWithout evidence: ${i.without}`, answer: i.with, rule: i.rule || '' })) };
  }
  // Paragraph with irrelevant sentences
  if (selected[0].paragraph !== undefined && selected[0].irrelevant !== undefined) {
    return { type: 'identify', skill, grade, count: selected.length, instruction: 'Identify the irrelevant sentences.', items: selected.map(i => ({ prompt: i.paragraph, answer: i.irrelevant.join(' | '), reason: i.rule })) };
  }
  // Fast/slow pacing examples
  if (selected[0].fast !== undefined || selected[0].slow !== undefined) {
    return { type: 'identify-technique', skill, grade, count: selected.length, instruction: 'Identify the pacing technique and its effect.', items: selected.map(i => ({ prompt: i.fast || i.slow || i.prompt || '', answer: i.technique || 'pacing', rule: i.effect || i.rule || '' })) };
  }
  // Reorder exercises (string-based)
  if (selected[0].prompt !== undefined && selected[0].answer !== undefined && typeof selected[0].answer === 'string') {
    return { type: 'prompt-response', skill, grade, count: selected.length, instruction: 'Answer the question.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, rule: i.rule || '' })) };
  }
  // Checklists
  if (selected[0].checklist !== undefined) {
    return { type: 'checklist', skill, grade, count: selected.length, instruction: 'Use this checklist to evaluate your writing.', items: selected.map(i => ({ checklist: i.checklist, type: i.type })) };
  }
  // Scenario-based source evaluation
  if (selected[0].scenario !== undefined) {
    return { type: 'evaluate', skill, grade, count: selected.length, instruction: 'Rank these sources by credibility.', items: selected.map(i => ({ prompt: i.scenario, answer: `Best: ${i.best}`, rule: i.rule || '' })) };
  }
  // Audience-based exercises
  if (selected[0].audience !== undefined) {
    return { type: 'audience-analysis', skill, grade, count: selected.length, instruction: 'Identify the best approach for this audience.', items: selected.map(i => ({ prompt: `Audience: ${i.audience}\nTopic: ${i.topic || ''}`, answer: i.approach || i.register || '', rule: i.rule || '' })) };
  }

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
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

class Writing {
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

  checkAnswer(expected, answer) { return { correct: checkAnswer(expected, answer), expected, studentAnswer: answer }; }

  getPrompt(type) {
    const prompts = WRITING_PROMPTS[type];
    if (!prompts) return { error: `Unknown type. Valid: ${Object.keys(WRITING_PROMPTS).join(', ')}` };
    return { type, prompt: pick(prompts, 1)[0] };
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-6';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const prompt = pick(WRITING_PROMPTS[Object.keys(WRITING_PROMPTS)[Math.floor(Math.random() * Object.keys(WRITING_PROMPTS).length)]], 1)[0];
    return {
      studentId: id, grade, targetSkill: target, exercise, writingPrompt: prompt,
      lessonPlan: {
        warmup: `Quick write (3 min): ${prompt}`,
        teach: `Mini-lesson: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Apply this skill in your own writing draft.',
      },
    };
  }
}

module.exports = Writing;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const wr = new Writing();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) wr.setGrade(id, grade);
        out({ action: 'start', profile: wr.getProfile(id), nextSkills: wr.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(wr.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'grade-6';
        if (skill) { out(wr.generateExercise(grade, skill, 5)); }
        else { const n = wr.getNextSkills(id, 1).next; out(n.length ? wr.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , expected, answer] = args;
        if (expected === undefined || answer === undefined) throw new Error('Usage: check <id> <expected> <answer>');
        out(wr.checkAnswer(expected, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(wr.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(wr.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(wr.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(wr.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? wr.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(wr.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(wr.setGrade(id, g)); break; }
      case 'prompt': { const [, type] = args; if (!type) throw new Error('Usage: prompt <argument|informational|narrative>'); out(wr.getPrompt(type)); break; }
      default: out({ usage: 'node writing.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','prompt'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
