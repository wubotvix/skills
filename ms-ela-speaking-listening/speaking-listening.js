// eClaw MS ELA Speaking & Listening Interactive Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-ela-speaking-listening');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'discussion-preparation': ['come-prepared', 'draw-on-preparation', 'explore-ideas'],
    'discussion-norms': ['collegial-rules', 'set-goals-deadlines', 'define-roles'],
    'pose-respond-questions': ['specific-questions', 'elaboration-detail', 'follow-up-questions'],
    'review-key-ideas': ['summarize-discussion', 'multiple-perspectives', 'demonstrate-understanding'],
    'interpret-media': ['diverse-formats', 'explain-contribution', 'compare-media-sources'],
    'evaluate-speaker': ['identify-claims', 'supported-vs-unsupported', 'distinguish-evidence'],
    'present-claims': ['sequence-logically', 'pertinent-details', 'eye-contact-volume'],
    'multimedia-presentations': ['clarify-with-visuals', 'appropriate-components', 'readable-displays'],
    'formal-informal': ['adapt-to-context', 'formal-english-command', 'register-awareness'],
  },
  'grade-7': {
    'prepared-evidence': ['refer-to-evidence', 'explicit-preparation', 'text-based-support'],
    'track-goals': ['monitor-progress', 'deadlines-accountability', 'role-responsibilities'],
    'elicit-elaboration': ['elaboration-questions', 'acknowledge-new-info', 'probing-questions'],
    'build-on-ideas': ['modify-views', 'synthesize-contributions', 'respectful-disagreement'],
    'analyze-media-main-ideas': ['identify-main-ideas', 'supporting-details-media', 'clarify-topic'],
    'evaluate-reasoning': ['soundness-of-reasoning', 'relevance-of-evidence', 'sufficiency-of-evidence'],
    'present-organized': ['salient-points', 'coherent-manner', 'examples-descriptions'],
    'multimedia-emphasis': ['clarify-claims', 'emphasize-points', 'visual-audio-balance'],
    'adapt-speech': ['variety-of-contexts', 'task-appropriate', 'formal-command-gr7'],
  },
  'grade-8': {
    'connect-ideas': ['link-speakers-ideas', 'cross-reference', 'thematic-connections'],
    'propel-conversations': ['open-ended-questions', 'challenge-ideas', 'redirect-focus'],
    'respond-track-evidence': ['relevant-evidence', 'observations-ideas', 'evidence-tracking'],
    'acknowledge-new-perspectives': ['qualify-views', 'justify-positions', 'integrate-perspectives'],
    'evaluate-media-motives': ['analyze-purpose', 'detect-bias', 'evaluate-motives'],
    'evaluate-argument-evidence': ['soundness-relevance', 'irrelevant-evidence', 'logical-fallacies'],
    'present-logical-argument': ['focused-coherent', 'sound-reasoning', 'well-chosen-details'],
    'strategic-multimedia': ['strengthen-claims', 'add-interest', 'integrate-effectively'],
    'command-formal-english': ['adapt-contexts-tasks', 'demonstrate-command', 'strategic-register'],
  },
};

// ── Content Banks ──

const EXERCISE_BANKS = {
  'grade-6': {
    'come-prepared': {
      items: [
        { scenario: 'Your class will discuss Chapter 5 of a novel about immigration. How do you prepare?', best: 'Read the chapter, annotate key passages, write 2-3 questions about the author\'s message, and note connections to prior chapters.', weak: 'Skim the chapter quickly before class starts.', skill: 'Thorough preparation includes reading, annotating, and generating questions.' },
        { scenario: 'Tomorrow\'s discussion covers a news article about climate change. What preparation steps should you take?', best: 'Read the article twice, highlight main claims and evidence, research unfamiliar terms, and prepare notes with page references.', weak: 'Read the headline and first paragraph.', skill: 'Effective preparation means engaging deeply with the text and coming ready to reference specific details.' },
        { scenario: 'Your group will discuss two poems with similar themes. How should you prepare?', best: 'Read both poems multiple times, note literary devices, identify the shared theme, and prepare comparisons with textual evidence.', weak: 'Read each poem once and hope to remember the main ideas.', skill: 'Comparing texts requires careful reading and organized notes.' },
        { scenario: 'You need to discuss a documentary about ocean pollution. What should you do before the discussion?', best: 'Watch the full documentary, take notes on key statistics and arguments, research the topic further, and prepare evidence-based questions.', weak: 'Watch part of the documentary and rely on classmates to fill in gaps.', skill: 'Media preparation involves active note-taking and verification of claims.' },
        { scenario: 'Your Socratic seminar will focus on the Bill of Rights. How do you prepare?', best: 'Read the amendments, research historical context, prepare open-ended questions, and identify passages that are open to interpretation.', weak: 'Memorize the first two amendments.', skill: 'Seminar preparation requires deep engagement and question generation.' },
        { scenario: 'You will discuss a short story about friendship and betrayal. What preparation looks like?', best: 'Read the story, track character motivations, mark turning points, and prepare to discuss the theme with textual evidence.', weak: 'Read the story summary online instead of the full text.', skill: 'Using the actual text, not summaries, is essential for evidence-based discussion.' },
      ],
    },
    'draw-on-preparation': {
      items: [
        { prompt: 'During a discussion about a novel, a classmate says the protagonist is selfish. How do you draw on your preparation to respond?', answer: 'Reference specific passages or quotes from the text that either support or challenge this interpretation.', key: 'text-reference' },
        { prompt: 'The discussion turns to a topic you researched. How do you contribute?', answer: 'Share specific facts, statistics, or examples from your research notes, citing where you found the information.', key: 'evidence-sharing' },
        { prompt: 'A classmate raises a point you hadn\'t considered. How do you use your preparation to engage?', answer: 'Connect their point to evidence in your notes, ask how it relates to specific passages, or explain how it shifts your understanding.', key: 'connecting-ideas' },
        { prompt: 'The discussion stalls and no one is contributing. How do you use your preparation to restart it?', answer: 'Introduce one of your prepared questions or share a passage you found thought-provoking during your reading.', key: 'prepared-questions' },
        { prompt: 'Someone makes a claim without evidence. How do you draw on your preparation?', answer: 'Politely ask them to point to a specific part of the text, then share your own evidence that relates to the topic.', key: 'evidence-request' },
      ],
    },
    'explore-ideas': {
      items: [
        { prompt: 'What does it mean to "explore ideas" in a discussion rather than just state opinions?', answer: 'Exploring means considering multiple viewpoints, asking "what if" questions, connecting ideas across texts, and being willing to revise your thinking.', key: 'exploration-definition' },
        { prompt: 'How can you build on a classmate\'s idea to explore it further?', answer: 'Use phrases like "Building on that idea..." or "That makes me wonder..." to extend the thinking rather than just agreeing or disagreeing.', key: 'building-on' },
        { prompt: 'A classmate says the theme of a story is courage. How do you explore this idea?', answer: 'Ask what specific moments show courage, whether all characters show it the same way, and if the author might be saying something more complex about courage.', key: 'deepening' },
        { prompt: 'How is exploring ideas different from debating?', answer: 'Exploring is collaborative — you build understanding together. Debating is competitive — you try to win. In exploration, changing your mind is a sign of growth.', key: 'collaboration-vs-competition' },
      ],
    },
    'collegial-rules': {
      items: [
        { prompt: 'What are three essential rules for a collegial discussion?', answer: 'Listen without interrupting, support claims with evidence, and respond to ideas (not personalities).', key: 'core-rules' },
        { prompt: 'A classmate keeps interrupting others. What collegial norm should be applied?', answer: 'The norm that each speaker should finish their thought before others respond, and the group should use a speaking protocol like hand-raising or a talking piece.', key: 'interruption-norm' },
        { prompt: 'One student dominates the discussion. What rule addresses this?', answer: 'A norm requiring equitable participation, such as "speak once before speaking twice" or using a round-robin format.', key: 'equitable-participation' },
        { prompt: 'How should a group handle disagreements during discussion?', answer: 'Use respectful disagreement norms: address the idea not the person, use sentence starters like "I see it differently because...", and cite evidence.', key: 'disagreement-norms' },
        { prompt: 'Why is it important to follow discussion norms?', answer: 'Norms ensure everyone feels safe contributing, ideas are evaluated fairly on evidence, and the group makes productive progress.', key: 'norm-importance' },
      ],
    },
    'set-goals-deadlines': {
      items: [
        { prompt: 'Your group must prepare a presentation in one week. What goals and deadlines should you set?', answer: 'Day 1-2: Research and gather evidence. Day 3-4: Create outline and assign sections. Day 5-6: Draft and create visuals. Day 7: Rehearse and finalize.', key: 'timeline-planning' },
        { prompt: 'How do you set a specific, measurable discussion goal?', answer: 'Instead of "have a good discussion," set goals like "each member contributes at least 3 evidence-based points" or "we identify 4 different perspectives on the theme."', key: 'measurable-goals' },
        { prompt: 'Your group is behind on a project deadline. What should you do?', answer: 'Reassess the timeline, identify what can be completed, redistribute tasks based on who has capacity, and communicate revised deadlines to the group.', key: 'deadline-adjustment' },
        { prompt: 'What is the difference between a process goal and a content goal for discussion?', answer: 'A process goal focuses on how you discuss (e.g., "use evidence 5 times"), while a content goal focuses on what you learn (e.g., "identify 3 themes in the text").', key: 'goal-types' },
      ],
    },
    'define-roles': {
      items: [
        { prompt: 'Name four common discussion roles and their responsibilities.', answer: 'Facilitator (guides discussion, asks questions), Note-taker (records key ideas), Timekeeper (monitors pace), Summarizer (wraps up main points).', key: 'role-names' },
        { prompt: 'You are the facilitator. The discussion has gone off-topic. What do you do?', answer: 'Acknowledge the tangent, redirect with a question tied to the text, such as "That\'s interesting — how does it connect to our main question about [topic]?"', key: 'facilitator-redirect' },
        { prompt: 'Why is it important for each group member to have a defined role?', answer: 'Defined roles ensure accountability, prevent one person from dominating, distribute the cognitive load, and help the group function efficiently.', key: 'role-importance' },
        { prompt: 'As the note-taker, what should you record during a Socratic seminar?', answer: 'Key claims made, evidence cited, questions raised, areas of agreement and disagreement, and any conclusions or unresolved questions.', key: 'note-taking' },
      ],
    },
    'specific-questions': {
      items: [
        { vague: 'What did you think of the story?', specific: 'What do you think motivated the protagonist to lie to her best friend in Chapter 3, and how does that decision affect the story\'s outcome?', skill: 'Specific questions reference particular moments, characters, or ideas from the text.' },
        { vague: 'Was the article good?', specific: 'What evidence does the author use in paragraph 4 to support the claim that renewable energy is cost-effective?', skill: 'Replace general quality judgments with questions about specific claims and evidence.' },
        { vague: 'Do you agree?', specific: 'Do you agree that the author\'s comparison of the two historical events is valid? What evidence from the text supports or challenges this comparison?', skill: 'Ask for reasoning and evidence, not just agreement.' },
        { vague: 'What happened in the poem?', specific: 'How does the poet\'s use of imagery in stanza 2 create a mood shift from the opening stanza?', skill: 'Focus on literary elements and their effects rather than plot summary.' },
        { vague: 'Is climate change real?', specific: 'What are the three strongest pieces of evidence the speaker presented for human-caused climate change, and which do you find most convincing?', skill: 'Ask about specific evidence and its persuasive power.' },
      ],
    },
    'elaboration-detail': {
      items: [
        { brief: 'I think the character was brave.', elaborated: 'I think the character was brave because she chose to speak up against the town council in Chapter 7, even though she knew she might lose her job. This connects to the theme of moral courage.', skill: 'Elaboration adds specific evidence, examples, and connections to support a point.' },
        { brief: 'The article was convincing.', elaborated: 'The article was convincing because the author used three types of evidence: statistical data from 2024, expert testimony from Dr. Ramirez, and a real-world case study from Denmark.', skill: 'Name the specific types and sources of evidence that make something convincing.' },
        { brief: 'I disagree.', elaborated: 'I disagree because the text on page 12 actually says the character regretted the decision, which contradicts the idea that she was confident throughout.', skill: 'Support disagreement with textual evidence and explain the contradiction.' },
        { brief: 'The media was biased.', elaborated: 'The media piece showed bias by only interviewing people who supported the policy, using emotional language like "devastating" and "catastrophic," and omitting the opposing study from Oxford.', skill: 'Identify specific techniques and omissions that reveal bias.' },
      ],
    },
    'follow-up-questions': {
      items: [
        { statement: 'I think the theme is about identity.', followUp: 'Can you point to a specific scene where the protagonist struggles with identity? How does that scene develop this theme?', skill: 'Follow-up questions push for textual evidence and deeper analysis.' },
        { statement: 'The speaker made a good argument.', followUp: 'Which specific claim was strongest, and what evidence made it convincing? Was there anything the speaker left out?', skill: 'Follow-ups ask for specifics and critical evaluation.' },
        { statement: 'The two texts are different.', followUp: 'What is the most significant difference, and how does each author\'s purpose shape that difference?', skill: 'Follow-ups ask for prioritization and analysis of cause.' },
        { statement: 'I changed my mind about the character.', followUp: 'What moment in the text caused you to change your mind? What did you think before and why?', skill: 'Follow-ups explore the process of thinking, not just conclusions.' },
      ],
    },
    'summarize-discussion': {
      items: [
        { prompt: 'After a 15-minute discussion about symbolism in a novel, how would you summarize the key ideas?', answer: 'Identify the 2-3 main symbols discussed, note what each person argued they represented, highlight areas of agreement and disagreement, and state any conclusions reached.', key: 'summary-structure' },
        { prompt: 'What should a good discussion summary include?', answer: 'Main topics covered, key evidence cited, different perspectives shared, points of agreement, unresolved questions, and any decisions or conclusions the group reached.', key: 'summary-elements' },
        { prompt: 'How do you summarize without adding your own opinion?', answer: 'Use phrases like "The group discussed..." and "Several members argued..." rather than "I think..." Report what was said, not what you believe.', key: 'objective-summary' },
      ],
    },
    'multiple-perspectives': {
      items: [
        { prompt: 'During a discussion, three classmates have different interpretations of a poem. How do you demonstrate understanding of all three perspectives?', answer: 'Paraphrase each interpretation accurately, identify the evidence each person used, and explain how each reading is plausible based on the text.', key: 'paraphrase-all' },
        { prompt: 'Why is it important to consider multiple perspectives in a discussion?', answer: 'Multiple perspectives lead to deeper understanding, reveal aspects of the text you might have missed, and develop critical thinking by weighing different interpretations.', key: 'perspective-value' },
        { prompt: 'How can you show you understand a perspective you disagree with?', answer: 'Restate it accurately ("What I hear you saying is..."), acknowledge its strengths, and then explain where your interpretation differs and why.', key: 'respectful-disagreement' },
      ],
    },
    'demonstrate-understanding': {
      items: [
        { prompt: 'What are three ways to demonstrate understanding during a discussion?', answer: 'Paraphrase others\' points accurately, ask clarifying questions that show you listened, and connect others\' ideas to new evidence or examples.', key: 'demo-methods' },
        { prompt: 'A classmate makes a complex point. How do you show you understood?', answer: 'Say "So what you\'re saying is..." and restate the point in your own words, then ask if your understanding is correct before building on it.', key: 'paraphrase-check' },
      ],
    },
    'diverse-formats': {
      items: [
        { scenario: 'You watch a documentary clip, read a news article, and view an infographic about the same topic. How do you interpret information across these formats?', answer: 'Compare what information each format emphasizes, note what is unique to each (visuals in the documentary, statistics in the infographic, analysis in the article), and identify how they complement each other.', key: 'cross-format' },
        { scenario: 'A podcast episode discusses ocean acidification. How do you interpret the information presented?', answer: 'Listen for the main claim, identify supporting evidence (expert interviews, data cited), note the tone and any bias, and consider what visual information might have helped.', key: 'audio-interpretation' },
        { scenario: 'You view a graph showing rising global temperatures and a photo essay of melting glaciers. How do these contribute to understanding the topic?', answer: 'The graph provides quantitative evidence with specific data points, while the photo essay provides emotional and visual impact. Together they give both logical and emotional understanding.', key: 'data-visual' },
      ],
    },
    'explain-contribution': {
      items: [
        { prompt: 'A bar graph is included in a presentation about water usage. How does it contribute to the topic?', answer: 'The bar graph makes numerical comparisons visual and immediate, allowing the audience to quickly see which regions use the most water without reading through data tables.', key: 'graph-contribution' },
        { prompt: 'A speaker shows a video clip during a presentation about wildlife conservation. How does it contribute?', answer: 'The video provides emotional engagement and real-world context that statistics alone cannot — seeing an endangered animal in its habitat makes the issue feel urgent and personal.', key: 'video-contribution' },
        { prompt: 'An infographic is used in a report about nutrition. What does it contribute?', answer: 'The infographic organizes complex nutritional data into a visually accessible format, using icons and colors to help the audience quickly grasp key comparisons and recommendations.', key: 'infographic-contribution' },
      ],
    },
    'compare-media-sources': {
      items: [
        { prompt: 'Two news sources report on the same event but emphasize different details. How do you analyze this?', answer: 'Compare what each source includes and omits, identify the perspective or angle of each, consider the audience, and determine which provides more balanced coverage with stronger evidence.', key: 'news-comparison' },
        { prompt: 'A written article and a video news report cover the same story. How do they present information differently?', answer: 'The article provides detailed analysis and can be re-read; the video uses visual evidence and emotional impact. Compare what facts each includes and how the format shapes the message.', key: 'format-difference' },
      ],
    },
    'identify-claims': {
      items: [
        { speech: 'School should start at 9 AM because students perform better with more sleep. Studies show that teens who sleep 8+ hours score 15% higher on tests. Our school currently starts at 7:30, forcing many students to wake before 6 AM.', mainClaim: 'School should start at 9 AM.', supportingClaims: ['Students perform better with more sleep.', 'Teens who sleep 8+ hours score 15% higher.', 'Current start time forces early waking.'], skill: 'Identify the main claim and the supporting claims that build the argument.' },
        { speech: 'Social media should be restricted for students under 16. Research from Stanford shows increased anxiety in heavy teen users. Furthermore, cyberbullying rates have tripled since 2015, and academic performance drops when screen time exceeds 3 hours daily.', mainClaim: 'Social media should be restricted for students under 16.', supportingClaims: ['Heavy use increases anxiety.', 'Cyberbullying rates have tripled.', 'Academic performance drops with excessive screen time.'], skill: 'Break down arguments into main claims and supporting evidence.' },
        { speech: 'Our school needs a community garden. It would teach students about biology and nutrition. The cafeteria could use fresh produce, saving money. Plus, studies show gardening reduces stress in young people.', mainClaim: 'Our school needs a community garden.', supportingClaims: ['Teaches biology and nutrition.', 'Saves cafeteria money.', 'Gardening reduces student stress.'], skill: 'Identify claims that provide different types of support: educational, financial, and emotional.' },
      ],
    },
    'supported-vs-unsupported': {
      items: [
        { claim: 'Students who eat breakfast perform better in school.', evidence: 'A 2023 study by the Journal of School Health found that breakfast-eating students scored 20% higher on morning assessments.', supported: true, explanation: 'Supported by specific research with a source, date, and measurable finding.' },
        { claim: 'Everyone knows that homework is bad for kids.', evidence: 'None provided.', supported: false, explanation: 'Unsupported — "everyone knows" is not evidence. No study, example, or data is given.' },
        { claim: 'Recycling helps the environment.', evidence: 'The EPA reports that recycling prevented 193 million metric tons of CO2 emissions in 2022.', supported: true, explanation: 'Supported by a credible government source with specific data.' },
        { claim: 'Students today are lazier than previous generations.', evidence: 'My grandfather says kids used to work harder.', supported: false, explanation: 'Unsupported — one person\'s opinion without data is not sufficient evidence for a generalization.' },
        { claim: 'Music education improves math skills.', evidence: 'A study published in the Journal of Educational Psychology showed students in music programs scored 12% higher on standardized math tests.', supported: true, explanation: 'Supported by a peer-reviewed study with a specific, measurable finding.' },
      ],
    },
    'distinguish-evidence': {
      items: [
        { prompt: 'A speaker says: "We must ban plastic bags. They are terrible for the environment. I hate seeing them everywhere." Which part is evidence and which is opinion?', answer: '"Terrible for the environment" could be evidence if supported by data, but "I hate seeing them" is personal opinion. The speaker needs specific evidence like pollution statistics.', key: 'evidence-vs-opinion' },
        { prompt: 'Identify the evidence in this argument: "School uniforms reduce bullying. A 2023 study in Long Beach found a 40% decrease in bullying incidents after uniforms were required. Plus, uniforms just look better."', answer: 'The study finding (40% decrease) is evidence. "Uniforms just look better" is opinion, not evidence.', key: 'fact-opinion-split' },
        { prompt: 'A speaker cites "many experts agree" without naming any. Is this evidence?', answer: 'No. Vague references to unnamed experts are not verifiable evidence. Strong evidence names specific experts, studies, or sources.', key: 'vague-vs-specific' },
      ],
    },
    'sequence-logically': {
      items: [
        { scrambled: ['In conclusion, school gardens benefit everyone.', 'First, gardens teach hands-on biology.', 'Additionally, fresh produce improves cafeteria meals.', 'Our school should create a community garden.', 'Finally, gardening reduces student stress.'], correct: ['Our school should create a community garden.', 'First, gardens teach hands-on biology.', 'Additionally, fresh produce improves cafeteria meals.', 'Finally, gardening reduces student stress.', 'In conclusion, school gardens benefit everyone.'], skill: 'Logical sequence: claim, supporting points with transitions, conclusion.' },
        { scrambled: ['Therefore, we should extend recess.', 'Studies show physical activity improves focus.', 'Many students struggle to concentrate after lunch.', 'Our current 15-minute recess is too short.', 'Even 10 more minutes would make a difference.'], correct: ['Many students struggle to concentrate after lunch.', 'Our current 15-minute recess is too short.', 'Studies show physical activity improves focus.', 'Even 10 more minutes would make a difference.', 'Therefore, we should extend recess.'], skill: 'Start with the problem, provide evidence, then state the solution.' },
      ],
    },
    'pertinent-details': {
      items: [
        { topic: 'Why our school needs a new library', pertinent: ['Current library has books from 1995', 'Only 2 computers for 500 students', 'Reading scores have declined 10%'], irrelevant: ['The cafeteria food is bad', 'My sister goes to a different school', 'I like reading manga'], skill: 'Pertinent details directly support your claim with relevant facts.' },
        { topic: 'Benefits of learning a second language', pertinent: ['Bilingual students score higher on cognitive tests', 'Over 60% of the world speaks more than one language', 'Language skills improve career opportunities by 30%'], irrelevant: ['French food is delicious', 'My neighbor is from Mexico', 'Languages are hard to learn'], skill: 'Choose details that provide evidence, not just associations with the topic.' },
      ],
    },
    'eye-contact-volume': {
      items: [
        { scenario: 'You are presenting to your class of 25 students. Describe effective eye contact.', answer: 'Use the "lighthouse" technique: scan slowly from left to center to right, making brief eye contact with individuals in different sections. Avoid staring at one person or looking at the floor/ceiling.', key: 'eye-contact-technique' },
        { scenario: 'A student reads directly from their notes during a presentation. What feedback would you give?', answer: 'Practice enough to use notes as a reference, not a script. Look up after each key point, making eye contact with the audience for at least 3 seconds before glancing back at notes.', key: 'notes-vs-audience' },
        { scenario: 'How should you adjust your volume for a presentation?', answer: 'Project to the back of the room, vary volume for emphasis (louder for key claims, slightly softer for dramatic effect), and check that the farthest listeners can hear clearly.', key: 'volume-projection' },
      ],
    },
    'clarify-with-visuals': {
      items: [
        { prompt: 'You are presenting about water conservation. What multimedia would clarify your information?', answer: 'A bar graph comparing water usage across activities, photos of drought-affected areas, and a short video clip showing conservation techniques in action.', key: 'visual-selection' },
        { prompt: 'What makes a presentation slide effective vs. ineffective?', answer: 'Effective: 1-2 key points, large readable font, relevant image, minimal text. Ineffective: paragraphs of text, small font, cluttered layout, decorative but irrelevant images.', key: 'slide-design' },
        { prompt: 'When should you NOT use multimedia in a presentation?', answer: 'When it distracts from the message, when the technology might fail and you have no backup, or when the visual doesn\'t add information beyond what you\'re saying.', key: 'multimedia-judgment' },
      ],
    },
    'appropriate-components': {
      items: [
        { topic: 'History of space exploration', good: ['Timeline graphic', 'NASA photos', 'Short video clip of moon landing'], poor: ['Random space movie screenshots', 'Animated GIFs of aliens', 'A 5-minute unrelated video'], skill: 'Components should be relevant, credible, and directly support your points.' },
        { topic: 'Persuasive speech on recycling', good: ['Infographic on landfill growth', 'Before/after photos', 'Chart of recycling rates by country'], poor: ['Clip art of trash cans', 'Unrelated nature photos', 'A song about the environment'], skill: 'Choose components that strengthen your argument with data and real-world evidence.' },
      ],
    },
    'readable-displays': {
      items: [
        { prompt: 'What is the 6x6 rule for presentation slides?', answer: 'Maximum 6 lines of text per slide and maximum 6 words per line. This keeps slides readable and forces you to present key points rather than reading paragraphs.', key: 'six-by-six' },
        { prompt: 'What font size should you use for a classroom presentation?', answer: 'At least 24-point font for body text and 36-point or larger for titles. The audience in the back row must be able to read everything clearly.', key: 'font-size' },
      ],
    },
    'adapt-to-context': {
      items: [
        { formal: 'Good afternoon, Principal Rodriguez. I would like to discuss the possibility of extending library hours.', informal: 'Hey, so like, can we keep the library open longer?', context: 'Meeting with the principal to request a policy change', appropriate: 'formal', skill: 'Formal register is appropriate when addressing authority figures about official matters.' },
        { formal: 'I would like to express my appreciation for your contribution to our group project.', informal: 'Thanks for helping with the project — your part was awesome!', context: 'Thanking a friend after class', appropriate: 'informal', skill: 'Informal register is appropriate for casual conversations with peers.' },
        { formal: 'The data presented in this study demonstrates a correlation between sleep duration and academic performance.', informal: 'So basically, the study says if you sleep more, you do better in school.', context: 'Presenting research findings to the class', appropriate: 'formal', skill: 'Academic presentations call for formal register with precise vocabulary.' },
      ],
    },
    'formal-english-command': {
      items: [
        { informal: 'Me and him went to the store.', formal: 'He and I went to the store.', rule: 'Use subject pronouns (I, he) as subjects; place yourself last.' },
        { informal: 'We was going to the game.', formal: 'We were going to the game.', rule: 'Use correct subject-verb agreement.' },
        { informal: 'The team did good on the test.', formal: 'The team did well on the test.', rule: '"Well" is the adverb; "good" is the adjective.' },
        { informal: 'There is many reasons to recycle.', formal: 'There are many reasons to recycle.', rule: '"Reasons" is plural, requiring "are."' },
        { informal: 'Between you and I, this is important.', formal: 'Between you and me, this is important.', rule: '"Between" takes object pronouns (me, not I).' },
      ],
    },
    'register-awareness': {
      items: [
        { prompt: 'What is the difference between formal and informal register?', answer: 'Formal register uses standard grammar, complete sentences, academic vocabulary, and avoids slang. Informal register uses contractions, casual vocabulary, and conversational tone.', key: 'register-definition' },
        { prompt: 'Name three situations where formal English is expected.', answer: 'Presenting to the class, writing a letter to a community leader, and participating in a debate or Socratic seminar.', key: 'formal-situations' },
        { prompt: 'Can the same idea be expressed in both registers? Give an example.', answer: 'Yes. Formal: "The evidence suggests that the hypothesis is supported." Informal: "Looks like we were right about our guess."', key: 'register-comparison' },
      ],
    },
  },
  'grade-7': {
    'refer-to-evidence': {
      items: [
        { prompt: 'During a discussion about a persuasive article, how do you explicitly draw on your preparation?', answer: 'Say things like "In paragraph 3, the author states..." or "According to my notes, the key statistic was..." — directly reference specific text and your preparation materials.', key: 'explicit-reference' },
        { prompt: 'What is the difference between implicitly and explicitly referring to evidence?', answer: 'Implicit: "I think the character was sad." Explicit: "On page 47, the author writes that Maya \'stared at the empty chair,\' which shows her grief."', key: 'implicit-vs-explicit' },
        { prompt: 'How should you use your annotated text during a discussion?', answer: 'Reference your annotations by page number, read short quoted passages, and explain how each piece of evidence connects to the discussion question.', key: 'annotation-use' },
        { prompt: 'A classmate makes a claim without evidence. How do you model referring to evidence?', answer: '"That\'s an interesting point. I found something related on page 23 where the author says... What evidence did you find to support your idea?"', key: 'modeling-evidence' },
      ],
    },
    'explicit-preparation': {
      items: [
        { prompt: 'How does grade 7 preparation differ from grade 6?', answer: 'Grade 7 requires explicitly drawing on preparation by referring to specific evidence — not just being prepared, but actively citing sources, page numbers, and quotes during discussion.', key: 'grade-level-distinction' },
        { prompt: 'Create a preparation checklist for a Socratic seminar on a historical text.', answer: '1) Read text twice with annotations. 2) Mark 5+ passages with evidence. 3) Write 3 open-ended questions with page references. 4) Prepare one connection to current events. 5) Anticipate counterarguments.', key: 'checklist' },
      ],
    },
    'text-based-support': {
      items: [
        { claim: 'The author believes technology is harmful to children.', support: 'On page 15, the author states that "screen time has replaced the imaginative play that builds cognitive flexibility." The word "replaced" implies something valuable was lost.', skill: 'Strong text-based support quotes directly and explains the significance of the quoted language.' },
        { claim: 'The poem expresses hope despite hardship.', support: 'In line 12, the image of "green shoots through cracked concrete" uses natural imagery to symbolize resilience and growth even in difficult conditions.', skill: 'Connect specific imagery or language to the claim you are supporting.' },
      ],
    },
    'monitor-progress': {
      items: [
        { prompt: 'Your discussion group set a goal to identify 5 themes in a novel. Midway through, you\'ve found 2. How do you monitor and adjust?', answer: 'Note that you\'re behind pace, suggest the group focus more narrowly, divide remaining chapters among members, and set a mini-deadline to check in again.', key: 'mid-check' },
        { prompt: 'How can a group track discussion progress in real time?', answer: 'Use a visible tracker (whiteboard or shared doc) listing goals, check off completed items, note who has contributed, and identify remaining questions.', key: 'visible-tracking' },
      ],
    },
    'deadlines-accountability': {
      items: [
        { prompt: 'A group member hasn\'t completed their assigned research. How should the group handle this?', answer: 'Address it directly but respectfully: ask if they need help, redistribute tasks if needed, set a new mini-deadline, and discuss what support would help them contribute.', key: 'missed-deadline' },
        { prompt: 'How do you create accountability in a discussion group?', answer: 'Assign specific roles, set checkpoints, have each member report their contributions, and use a shared document where work is visible to all.', key: 'accountability-systems' },
      ],
    },
    'role-responsibilities': {
      items: [
        { prompt: 'In a grade 7 discussion, how do roles become more complex than in grade 6?', answer: 'Roles include more responsibility: the facilitator must track progress toward goals, the note-taker must organize by theme, and members must hold each other accountable to evidence-based contributions.', key: 'complex-roles' },
        { prompt: 'You are the discussion leader. Two members disagree strongly. What do you do?', answer: 'Redirect both to the text: "Let\'s look at what the evidence says. [Name], what passage supports your view? [Name], what evidence supports yours?" Keep focus on evidence, not opinions.', key: 'mediation' },
      ],
    },
    'elaboration-questions': {
      items: [
        { statement: 'The author uses foreshadowing.', question: 'Can you identify a specific example of foreshadowing and explain what it hints at? How does it affect the reader\'s experience?', skill: 'Elaboration questions ask for specifics, examples, and explanations of effect.' },
        { statement: 'The data shows improvement.', question: 'What specific data points show improvement? How significant is the change, and are there any factors that might explain it besides the one being studied?', skill: 'Push beyond vague claims to specific evidence and critical analysis.' },
        { statement: 'The speaker was persuasive.', question: 'What specific rhetorical strategy made the speaker persuasive? Can you point to a moment where you felt your opinion shifting and explain why?', skill: 'Ask for self-reflection on the process of persuasion.' },
        { statement: 'Both texts are about freedom.', question: 'How does each author define freedom differently? What specific language choices reveal each author\'s unique perspective on the concept?', skill: 'Elaboration questions probe differences within apparent similarities.' },
      ],
    },
    'acknowledge-new-info': {
      items: [
        { prompt: 'A classmate shares evidence you hadn\'t considered. How do you acknowledge it?', answer: '"That\'s a point I hadn\'t considered. The evidence you cited from page 34 changes how I see the character\'s motivation. Let me think about how this fits with what I found on page 28."', key: 'acknowledgment' },
        { prompt: 'What sentence starters help you acknowledge new information?', answer: '"I hadn\'t thought of it that way..." / "That evidence shifts my understanding because..." / "You\'re adding an important dimension — the text on page X supports that..." ', key: 'starters' },
      ],
    },
    'probing-questions': {
      items: [
        { surface: 'The character changed.', probe: 'At what point did the change begin? What event triggered it? Is the change permanent or might the character revert? What textual evidence shows the before and after?', skill: 'Probing questions dig beneath the surface to examine process, cause, and evidence.' },
        { surface: 'The argument was weak.', probe: 'Which specific claim lacked evidence? Was the reasoning flawed, or was the evidence insufficient? What would the speaker need to add to strengthen the argument?', skill: 'Probe to identify exactly where and how an argument fails.' },
      ],
    },
    'modify-views': {
      items: [
        { prompt: 'During a discussion, new evidence contradicts your original position. How do you respond?', answer: '"I started this discussion thinking X, but after hearing the evidence from page 42 and [classmate]\'s analysis, I now think Y because the text more strongly supports that reading."', key: 'view-change' },
        { prompt: 'Is changing your mind during a discussion a sign of weakness?', answer: 'No — it is a sign of intellectual growth. Modifying your view based on new evidence shows you are thinking critically and valuing truth over being right.', key: 'growth-mindset' },
      ],
    },
    'synthesize-contributions': {
      items: [
        { prompt: 'Three classmates have shared different views on a text\'s theme. How do you synthesize?', answer: '"[Name] argued the theme is justice, citing the trial scene. [Name] focused on loyalty through the friendship subplot. [Name] saw both. I think these connect — the story shows that true justice requires loyalty to principles."', key: 'synthesis' },
        { prompt: 'What is the difference between summarizing and synthesizing?', answer: 'Summarizing restates what was said. Synthesizing combines multiple ideas into a new understanding — it creates meaning that no single contribution had alone.', key: 'summary-vs-synthesis' },
      ],
    },
    'respectful-disagreement': {
      items: [
        { rude: 'That\'s wrong. You obviously didn\'t read the book.', respectful: 'I see it differently. On page 56, the author actually suggests the opposite — that the character was motivated by fear, not courage. What do you think about that passage?', skill: 'Respectful disagreement addresses ideas with evidence, not the person.' },
        { rude: 'That doesn\'t make any sense.', respectful: 'Can you help me understand your reasoning? I\'m seeing different evidence on page 30 that seems to point another direction.', skill: 'Express confusion as curiosity rather than dismissal.' },
      ],
    },
    'identify-main-ideas': {
      items: [
        { scenario: 'You watch a TED Talk about the future of education. How do you identify the main ideas?', answer: 'Listen for the speaker\'s thesis (usually stated early), note the 2-3 key arguments made, identify the evidence used for each, and distinguish between main claims and supporting details.', key: 'ted-talk-analysis' },
        { scenario: 'A podcast discusses three different solutions to food waste. How do you identify main ideas?', answer: 'Note each solution as a separate main idea, identify the evidence for each, compare which has the strongest support, and note which the host seems to favor.', key: 'podcast-analysis' },
      ],
    },
    'supporting-details-media': {
      items: [
        { prompt: 'In a documentary about coral reefs, identify what counts as a main idea vs. a supporting detail.', answer: 'Main idea: Coral reefs are dying due to climate change. Supporting details: Water temperature data, before/after footage, scientist interviews with specific research findings.', key: 'main-vs-supporting' },
        { prompt: 'How do visual elements in a news broadcast serve as supporting details?', answer: 'B-roll footage, graphics, maps, and charts provide visual evidence that supports the reporter\'s spoken claims, making abstract data concrete and verifiable.', key: 'visual-support' },
      ],
    },
    'clarify-topic': {
      items: [
        { prompt: 'How can multiple media sources together clarify a complex topic better than one source alone?', answer: 'Each format adds a different dimension: text provides depth and detail, video shows real-world context, data visualizations make statistics comprehensible, and audio interviews add expert voices and emotional tone.', key: 'multi-source-clarity' },
      ],
    },
    'soundness-of-reasoning': {
      items: [
        { argument: 'We should cancel school sports because one student got injured last year.', flaw: 'Hasty generalization — one incident doesn\'t justify eliminating all sports. Sound reasoning would examine injury rates over time compared to benefits.', sound: false },
        { argument: 'Schools that added 30 minutes of daily reading saw a 15% increase in test scores over 3 years across 50 schools. Therefore, daily reading time improves academic performance.', flaw: 'None — this uses sufficient sample size, specific data, and a clear causal mechanism.', sound: true },
        { argument: 'Everyone in my friend group thinks homework is useless, so homework must be useless.', flaw: 'Appeal to popularity / small sample — a friend group is not representative evidence for a universal claim.', sound: false },
        { argument: 'Students who participate in music programs have higher GPAs. A 10-year study across 200 schools found a consistent correlation, and controlled studies suggest music training develops executive function skills that transfer to academics.', flaw: 'None — uses long-term data, large sample, and explains the causal mechanism.', sound: true },
      ],
    },
    'relevance-of-evidence': {
      items: [
        { claim: 'Our school should serve healthier lunches.', evidence: 'A study shows students who eat nutritious lunches have better afternoon concentration and 12% higher test scores.', relevant: true, explanation: 'Directly connects lunch quality to student outcomes.' },
        { claim: 'Our school should serve healthier lunches.', evidence: 'The cafeteria was painted blue last summer.', relevant: false, explanation: 'The color of the cafeteria has nothing to do with food quality or student health.' },
        { claim: 'Students should learn computer programming.', evidence: 'Programming jobs are projected to grow 25% by 2030, and computational thinking develops problem-solving skills across all subjects.', relevant: true, explanation: 'Both career relevance and skill transfer directly support the claim.' },
        { claim: 'Students should learn computer programming.', evidence: 'Steve Jobs wore black turtlenecks.', relevant: false, explanation: 'A tech CEO\'s clothing choices have no bearing on whether students should learn programming.' },
      ],
    },
    'sufficiency-of-evidence': {
      items: [
        { argument: 'Cell phones should be banned in schools. My cousin got distracted by his phone once and failed a test.', sufficient: false, explanation: 'One anecdote is not sufficient. Need data on phone-related distraction rates, academic impact studies, and comparison with schools that have bans.' },
        { argument: 'Reading fiction improves empathy. Studies from Harvard (2019), York University (2020), and Stanford (2022) all found that regular fiction readers scored higher on empathy measures across different age groups and cultures.', sufficient: true, explanation: 'Multiple studies from credible institutions across years and populations provide sufficient evidence.' },
      ],
    },
    'salient-points': {
      items: [
        { prompt: 'You have 3 minutes to present on renewable energy. How do you choose salient points?', answer: 'Select the 2-3 strongest arguments (e.g., cost savings, job creation, environmental impact) and focus deeply on those with your best evidence, rather than mentioning 8 points briefly.', key: 'prioritization' },
        { prompt: 'What makes a point "salient" in a presentation?', answer: 'A salient point is one that is most important, most relevant to your audience, and most strongly supported by evidence. It\'s what the audience should remember.', key: 'salience-definition' },
      ],
    },
    'coherent-manner': {
      items: [
        { prompt: 'What makes a presentation coherent?', answer: 'Clear thesis stated upfront, logical order of points, transition words connecting ideas, consistent focus on the main argument, and a conclusion that ties back to the thesis.', key: 'coherence-elements' },
        { prompt: 'A student jumps between three different topics randomly. How would you advise them?', answer: 'Organize points in a logical order (chronological, cause-effect, or problem-solution), use transition phrases between sections, and make sure each point connects back to the main claim.', key: 'organization-advice' },
      ],
    },
    'examples-descriptions': {
      items: [
        { prompt: 'Why are specific examples more effective than general statements in a presentation?', answer: '"Renewable energy creates jobs" is weak. "A wind farm in Iowa created 450 construction jobs and 50 permanent positions, boosting the local economy by $12M annually" is compelling because it\'s specific, measurable, and real.', key: 'specificity' },
        { prompt: 'How do vivid descriptions strengthen a presentation?', answer: 'They help the audience visualize and emotionally connect. "Pollution is bad" vs. "The river ran brown with industrial waste, and dead fish lined the banks for half a mile" — the second creates urgency.', key: 'vivid-language' },
      ],
    },
    'clarify-claims': {
      items: [
        { prompt: 'How can a chart or graph clarify a claim in a presentation?', answer: 'A claim like "test scores improved" becomes much clearer with a line graph showing the actual trend over time — the audience can see the magnitude and consistency of improvement.', key: 'data-visualization' },
        { prompt: 'When should you use an image vs. a graph in a presentation?', answer: 'Use graphs for quantitative claims (statistics, trends, comparisons). Use images for qualitative claims (conditions, impacts, real-world examples) that benefit from visual evidence.', key: 'visual-choice' },
      ],
    },
    'emphasize-points': {
      items: [
        { prompt: 'How can multimedia be used to emphasize salient points?', answer: 'Highlight key statistics in large bold text, use color to draw attention to critical data, pause on an impactful image while making your strongest argument, or play a brief audio clip that reinforces your point.', key: 'emphasis-techniques' },
      ],
    },
    'visual-audio-balance': {
      items: [
        { prompt: 'A student\'s presentation has 20 slides for a 5-minute speech. What advice would you give?', answer: 'Reduce to 5-7 slides maximum. Each slide should support, not replace, what you\'re saying. The audience should listen to you, not read your slides.', key: 'slide-count' },
        { prompt: 'How do you balance speaking with visual elements?', answer: 'Speak first, then show the visual as evidence. Don\'t read from slides. Use the visual to reinforce your spoken point, pausing briefly to let the audience absorb it.', key: 'speak-then-show' },
      ],
    },
    'variety-of-contexts': {
      items: [
        { context: 'Classroom debate on school policy', register: 'formal', features: 'Standard grammar, complete sentences, evidence-based arguments, academic vocabulary, respectful tone.', key: 'debate-register' },
        { context: 'Group brainstorm with classmates', register: 'informal', features: 'Casual language, quick exchanges, building on each other, incomplete sentences OK, slang acceptable.', key: 'brainstorm-register' },
        { context: 'Phone call with a community leader for a project interview', register: 'formal', features: 'Polite greetings, prepared questions, standard grammar, professional tone, thank-you at the end.', key: 'interview-register' },
      ],
    },
    'task-appropriate': {
      items: [
        { prompt: 'You switch from a casual group discussion to a formal class presentation. What changes?', answer: 'Volume increases, slang disappears, sentences become more complete, evidence is cited formally, body language becomes more deliberate, and vocabulary becomes more precise.', key: 'register-shift' },
        { prompt: 'Why is it important to match your speech to the task?', answer: 'The wrong register undermines your credibility. Too casual in a formal setting seems unprepared; too formal in a casual setting seems stiff and disconnected. Matching shows awareness and competence.', key: 'register-importance' },
      ],
    },
    'formal-command-gr7': {
      items: [
        { informal: 'So like, the data basically shows that stuff is getting worse.', formal: 'The data clearly indicates a declining trend in environmental quality over the past decade.', rule: 'Replace vague words (stuff, basically, like) with precise academic vocabulary.' },
        { informal: 'The book was really really good because the characters were awesome.', formal: 'The novel is compelling due to its well-developed, multidimensional characters.', rule: 'Replace intensifiers and slang with specific, descriptive language.' },
        { informal: 'A lot of people think this is a big deal.', formal: 'A significant number of researchers consider this finding to have major implications.', rule: 'Replace "a lot" and "big deal" with quantified, specific language.' },
      ],
    },
  },
  'grade-8': {
    'link-speakers-ideas': {
      items: [
        { prompt: 'Two classmates have shared seemingly different points. How do you connect their ideas?', answer: '"I notice a connection between what [Name] said about the character\'s fear and [Name]\'s point about the setting. The author may be using the dark forest as an externalization of the character\'s internal conflict."', key: 'cross-speaker-connection' },
        { prompt: 'What phrases help you connect ideas across speakers?', answer: '"Building a bridge between [Name]\'s point and [Name]\'s... / That connects to what [Name] said earlier about... / I see a pattern: [Name] mentioned X, [Name] brought up Y, and both point toward..."', key: 'connecting-phrases' },
        { prompt: 'Why is connecting ideas across speakers a higher-level discussion skill?', answer: 'It requires active listening to multiple people, holding their ideas in mind, seeing patterns, and creating new meaning that no single speaker articulated — this is synthesis.', key: 'skill-rationale' },
      ],
    },
    'cross-reference': {
      items: [
        { prompt: 'During a discussion, you notice that three speakers have each referenced a different part of the text that relates to the same theme. How do you cross-reference?', answer: '"I want to pull together three passages we\'ve mentioned: the opening scene on page 3, the dialogue on page 45, and the ending on page 112. Together, they trace the theme of redemption through the entire novel."', key: 'multi-passage' },
        { prompt: 'How do you cross-reference ideas from different texts in a discussion?', answer: 'Identify the specific claim or theme in each text, name the page or section, explain how they relate (agree, contradict, extend), and state what the comparison reveals.', key: 'cross-text' },
      ],
    },
    'thematic-connections': {
      items: [
        { prompt: 'A discussion covers a novel and a historical document. How do you make thematic connections?', answer: 'Identify shared themes (justice, power, identity), show how each text explores the theme differently, and explain what the comparison reveals about the human experience across time and genre.', key: 'cross-genre' },
        { prompt: 'How do thematic connections deepen understanding beyond individual texts?', answer: 'They reveal universal ideas, show how different authors and eras grapple with similar questions, and help us see patterns in human thought and culture.', key: 'thematic-depth' },
      ],
    },
    'open-ended-questions': {
      items: [
        { closed: 'Did the character change?', openEnded: 'How does the character\'s transformation reflect the author\'s broader commentary on social conformity, and what does the ambiguous ending suggest about whether true change is possible?', skill: 'Open-ended questions have no single right answer and invite analysis, interpretation, and debate.' },
        { closed: 'Was the speaker effective?', openEnded: 'To what extent did the speaker\'s rhetorical choices serve their purpose, and where might different strategies have been more effective for this particular audience?', skill: 'Replace yes/no questions with "to what extent" or "how" to propel deeper conversation.' },
        { closed: 'Is social media good or bad?', openEnded: 'How do the benefits and risks of social media shift depending on the user\'s age, purpose, and level of media literacy, and what responsibilities do platforms have?', skill: 'Move beyond binary framing to explore nuance and multiple factors.' },
      ],
    },
    'challenge-ideas': {
      items: [
        { prompt: 'How do you respectfully challenge an idea to propel conversation forward?', answer: '"That\'s a strong reading, but I want to push back with a counterexample from page 78. If we consider this scene, it complicates the interpretation because..."', key: 'respectful-challenge' },
        { prompt: 'What is the difference between challenging an idea and attacking a person?', answer: 'Challenging an idea engages with evidence and reasoning: "The evidence on page 30 suggests otherwise." Attacking a person targets the speaker: "You\'re wrong" or "You don\'t understand." Always address the idea, not the person.', key: 'idea-vs-person' },
      ],
    },
    'redirect-focus': {
      items: [
        { prompt: 'The discussion has gone off-topic for 3 minutes. How do you redirect?', answer: '"These are interesting points. I want to bring us back to our central question about [topic]. [Name] raised something earlier about [relevant point] that I think we should explore further."', key: 'redirect-technique' },
        { prompt: 'Two speakers are going back and forth without progress. How do you redirect?', answer: '"It sounds like you both have strong evidence. Let me see if I can reframe the question: instead of whether [A or B], maybe we should ask [new angle]. What does the text say about that?"', key: 'reframe' },
      ],
    },
    'relevant-evidence': {
      items: [
        { prompt: 'In a grade 8 discussion, what counts as relevant evidence?', answer: 'Direct textual quotes, specific data from credible sources, documented examples, expert testimony, and logical reasoning that directly supports the claim being discussed.', key: 'evidence-types' },
        { prompt: 'How do you respond to a question with relevant evidence rather than just opinion?', answer: 'Instead of "I think the theme is loss," say "The repeated imagery of empty spaces — the vacant house on page 12, the abandoned playground on page 34 — establishes loss as a central theme."', key: 'evidence-over-opinion' },
      ],
    },
    'observations-ideas': {
      items: [
        { prompt: 'What is the difference between sharing an observation and sharing an idea?', answer: 'An observation notes what is in the text: "The author uses short sentences in this scene." An idea interprets: "The short sentences create urgency, mirroring the character\'s panic." Both are valuable in discussion.', key: 'observation-vs-idea' },
        { prompt: 'How do observations lead to deeper ideas in discussion?', answer: 'Observations are evidence; ideas are interpretation. When you share an observation, others can build on it with their own interpretations, creating layered understanding.', key: 'observation-to-idea' },
      ],
    },
    'evidence-tracking': {
      items: [
        { prompt: 'How do you track evidence across a long discussion?', answer: 'Keep a running list of claims and their supporting evidence, note which speaker contributed each point, mark where evidence conflicts, and identify claims that still lack support.', key: 'tracking-method' },
        { prompt: 'Why is evidence tracking important in grade 8 discussions?', answer: 'It ensures accountability (claims must be supported), prevents circular arguments, reveals gaps in reasoning, and helps the group build a coherent understanding.', key: 'tracking-purpose' },
      ],
    },
    'qualify-views': {
      items: [
        { unqualified: 'The author hates technology.', qualified: 'The author seems critical of technology\'s impact on human connection, though the final chapter suggests technology itself isn\'t the problem — it\'s how we choose to use it.', skill: 'Qualifying adds nuance, acknowledges complexity, and shows you\'ve considered multiple aspects of the text.' },
        { unqualified: 'This policy will definitely work.', qualified: 'This policy has strong evidence supporting it in urban settings, though its effectiveness in rural communities remains untested, and implementation costs could be a barrier.', skill: 'Qualifying shows intellectual honesty about limitations and conditions.' },
      ],
    },
    'justify-positions': {
      items: [
        { prompt: 'A classmate presents compelling evidence against your position. How do you justify your view?', answer: '"I acknowledge that evidence is strong. However, I maintain my position because [three specific pieces of evidence], and I believe the overall pattern in the text supports my reading more consistently."', key: 'maintain-with-evidence' },
        { prompt: 'What is the difference between justifying a position and being stubborn?', answer: 'Justifying means providing evidence and reasoning for your view while acknowledging counterarguments. Being stubborn means refusing to engage with opposing evidence. Justification is evidence-based; stubbornness is ego-based.', key: 'justify-vs-stubborn' },
      ],
    },
    'integrate-perspectives': {
      items: [
        { prompt: 'Three classmates have shared conflicting interpretations. How do you integrate their perspectives?', answer: '"Each reading highlights a different layer of the text. If we integrate all three, we see that the author may be deliberately creating ambiguity — the story works on the level of [A], [B], and [C] simultaneously."', key: 'integration' },
        { prompt: 'How does integrating perspectives differ from simply listing them?', answer: 'Listing says "A thinks X, B thinks Y, C thinks Z." Integrating says "X, Y, and Z together reveal something none of them shows alone" — it creates new understanding.', key: 'integration-vs-listing' },
      ],
    },
    'analyze-purpose': {
      items: [
        { media: 'A news segment about a new school policy features interviews only with administrators, not students or parents.', purpose: 'To present the policy favorably from the administration\'s perspective, potentially minimizing opposition.', analysis: 'The choice of interview subjects reveals the segment\'s purpose. Balanced reporting would include multiple stakeholder perspectives.', key: 'interview-selection' },
        { media: 'A social media campaign uses celebrity endorsements to promote a product.', purpose: 'To leverage celebrity influence and emotional connection to drive sales, not to provide objective product evaluation.', analysis: 'Celebrity status is not evidence of product quality. The purpose is persuasion through association, not information.', key: 'celebrity-endorsement' },
        { media: 'A documentary about fast food uses slow-motion shots of unhealthy food being prepared.', purpose: 'To create disgust and emotional aversion through visual technique, strengthening the filmmaker\'s anti-fast-food argument.', analysis: 'Visual techniques like slow motion and close-ups are rhetorical choices that serve the filmmaker\'s purpose.', key: 'visual-rhetoric' },
      ],
    },
    'detect-bias': {
      items: [
        { example: 'A news article about immigration uses the word "flood" to describe migrants.', bias: 'Loaded language — "flood" implies danger and overwhelm, framing immigration negatively through word choice rather than data.', key: 'loaded-language' },
        { example: 'A report on climate change interviews 5 scientists who agree and 1 who disagrees, giving each equal time.', bias: 'False balance — giving equal time to a fringe view creates the impression of a 50/50 debate when 97% of scientists agree.', key: 'false-balance' },
        { example: 'A product review website is funded by the company whose products it reviews.', bias: 'Conflict of interest — financial ties create incentive for positive reviews, undermining objectivity.', key: 'conflict-of-interest' },
      ],
    },
    'evaluate-motives': {
      items: [
        { prompt: 'A soda company sponsors a study that finds sugar is not harmful. How do you evaluate the motive?', answer: 'The financial motive creates a conflict of interest. The company benefits from findings that their product is safe. Look for independent, peer-reviewed studies for more reliable evidence.', key: 'financial-motive' },
        { prompt: 'A politician shares statistics about job growth right before an election. How do you evaluate the motive?', answer: 'The timing suggests the motive is political advantage. Check whether the data is accurate, whether it shows the full picture, and whether an independent source confirms the claims.', key: 'political-motive' },
        { prompt: 'What questions help you evaluate a media source\'s motives?', answer: 'Who created this? Who funded it? What do they gain? What perspectives are missing? Is the evidence verifiable? Does it inform or persuade? Who is the intended audience?', key: 'motive-questions' },
      ],
    },
    'soundness-relevance': {
      items: [
        { argument: 'Homework should be limited because studies show diminishing returns after 90 minutes for middle schoolers, excessive homework correlates with increased anxiety, and family time is important for development.', evaluation: 'Sound and relevant — multiple evidence types (research, correlation data, developmental reasoning) all directly support the claim about homework limits.', key: 'sound-argument' },
        { argument: 'We should cancel all field trips because a bus broke down once.', evaluation: 'Unsound — one incident is not a pattern. Irrelevant — mechanical issues can be addressed without eliminating educational experiences.', key: 'unsound-argument' },
      ],
    },
    'irrelevant-evidence': {
      items: [
        { argument: 'Schools should teach financial literacy. My mom says money is important. Also, the school building is old and needs repairs.', irrelevant: 'The school building\'s condition is irrelevant to curriculum decisions about financial literacy.', skill: 'Identify when a speaker introduces information that does not logically support their claim.' },
        { argument: 'We should have longer lunch periods because students need time to eat properly, recess reduces afternoon behavioral issues, and the football team won state last year.', irrelevant: 'The football team\'s success has no logical connection to lunch period length.', skill: 'Irrelevant evidence may sound impressive but does not connect to the specific claim.' },
        { argument: 'Standardized testing should be reformed because tests cause anxiety, they don\'t measure creativity, and the testing company\'s CEO is very wealthy.', irrelevant: 'The CEO\'s wealth is irrelevant to whether the tests themselves are effective educational tools.', skill: 'Distinguish between evidence about the policy and evidence about associated people or entities.' },
      ],
    },
    'logical-fallacies': {
      items: [
        { fallacy: 'Ad hominem', example: '"You can\'t trust her argument about climate change because she drives a big car."', explanation: 'Attacks the person rather than the argument. A person\'s behavior doesn\'t invalidate their evidence.', key: 'ad-hominem' },
        { fallacy: 'Straw man', example: '"People who want longer recess basically want to eliminate academics entirely."', explanation: 'Misrepresents the opponent\'s position to make it easier to attack. Wanting more recess is not wanting no academics.', key: 'straw-man' },
        { fallacy: 'Slippery slope', example: '"If we allow phones at lunch, next students will be on phones all day and never learn anything."', explanation: 'Assumes one small step will inevitably lead to extreme consequences without evidence for each step.', key: 'slippery-slope' },
        { fallacy: 'False dichotomy', example: '"Either we ban all social media or we accept that kids will be bullied online."', explanation: 'Presents only two extreme options when many middle-ground solutions exist.', key: 'false-dichotomy' },
      ],
    },
    'focused-coherent': {
      items: [
        { prompt: 'How does a grade 8 presentation differ in focus from grade 7?', answer: 'Grade 8 requires not just logical sequence but a focused, coherent argument with relevant evidence, sound reasoning, and well-chosen details that build toward a compelling conclusion.', key: 'grade-distinction' },
        { prompt: 'What does "focused and coherent" mean in a presentation?', answer: 'Every sentence serves the main argument. No tangents, no filler. Each point connects to the thesis, evidence is well-chosen (not just available), and the audience can follow the logic from start to finish.', key: 'focus-definition' },
      ],
    },
    'sound-reasoning': {
      items: [
        { prompt: 'What makes reasoning "sound" in a presentation?', answer: 'Sound reasoning has valid logical structure: premises are true, conclusions follow from evidence, counterarguments are addressed, and no logical fallacies are present.', key: 'sound-definition' },
        { prompt: 'A student argues: "All good students study hard. I study hard. Therefore I am a good student." Is this sound?', answer: 'No — this is a logical fallacy (affirming the consequent). Studying hard is necessary but might not be sufficient. Sound reasoning would say: "Students who study hard tend to perform better, and data shows..."', key: 'fallacy-check' },
      ],
    },
    'well-chosen-details': {
      items: [
        { prompt: 'What makes a detail "well-chosen" for a presentation?', answer: 'It is specific (not vague), credible (from a reliable source), relevant (directly supports the claim), and memorable (helps the audience understand and remember your point).', key: 'detail-criteria' },
        { prompt: 'You have 10 pieces of evidence for a 3-minute speech. How do you choose?', answer: 'Select the 3-4 strongest: prioritize recent data from credible sources, choose evidence that covers different types (statistical, testimonial, real-world example), and pick details your specific audience will find compelling.', key: 'evidence-selection' },
      ],
    },
    'strengthen-claims': {
      items: [
        { prompt: 'How can multimedia strategically strengthen a claim?', answer: 'Use data visualization to make statistics undeniable, show primary source images to provide direct evidence, or play audio clips of expert testimony to add authority — each chosen specifically to strengthen a particular claim.', key: 'strategic-multimedia' },
        { prompt: 'When does multimedia weaken rather than strengthen claims?', answer: 'When it\'s decorative rather than evidentiary, when it distracts from the argument, when it\'s low quality, or when it contradicts the spoken claim.', key: 'multimedia-pitfalls' },
      ],
    },
    'add-interest': {
      items: [
        { prompt: 'How do you use multimedia to add interest without distracting?', answer: 'Open with a compelling image or short video hook, use visuals to break up dense information, vary the types of media used, and ensure every element connects to your argument.', key: 'interest-balance' },
      ],
    },
    'integrate-effectively': {
      items: [
        { prompt: 'What does "integrate" multimedia mean vs. "include" it?', answer: '"Include" means adding slides alongside a speech. "Integrate" means weaving multimedia into the argument so it\'s inseparable from the message — the visual appears at the exact moment it strengthens your point.', key: 'integrate-definition' },
        { prompt: 'Describe an example of well-integrated multimedia.', answer: 'While saying "Ocean temperatures have risen 1.5 degrees since 1970," a graph appears showing the trend. Then, transitioning to impact, a before/after satellite image of a coral reef appears as you describe the consequences.', key: 'integration-example' },
      ],
    },
    'adapt-contexts-tasks': {
      items: [
        { scenario: 'You need to present the same research to your class, then to a community board meeting. How does your speech adapt?', answer: 'For class: use accessible vocabulary, relatable examples, more casual transitions. For the board: use formal register, cite sources precisely, address policy implications, and use professional visual aids.', key: 'audience-adaptation' },
        { scenario: 'You switch from a small group discussion to addressing the whole class. What changes?', answer: 'Volume, formality, and structure all increase. You organize thoughts more carefully, speak in complete sentences, project your voice, and provide more context since not everyone heard the small group discussion.', key: 'scale-adaptation' },
      ],
    },
    'demonstrate-command': {
      items: [
        { informal: 'The thing about this book is that, like, the guy basically doesn\'t know what he wants and it messes everything up.', formal: 'The central conflict of the novel stems from the protagonist\'s internal ambivalence, which catalyzes a chain of consequences that affect every character.', rule: 'Command of formal English means using precise vocabulary, complex sentence structures, and academic register consistently.' },
        { informal: 'So yeah, the data shows stuff is getting better, which is cool.', formal: 'The data demonstrates a statistically significant improvement, suggesting that the intervention is achieving its intended outcomes.', rule: 'Replace vague words with precise terms and use sentence structures that convey analytical thinking.' },
      ],
    },
    'strategic-register': {
      items: [
        { prompt: 'When might you strategically shift register within a single presentation?', answer: 'You might open with an informal anecdote to connect with the audience, then shift to formal register for your evidence and analysis, and close with a more personal, slightly informal call to action.', key: 'register-shifting' },
        { prompt: 'How does strategic register differ from inconsistent register?', answer: 'Strategic register shifts are intentional and effective — using informal language to build rapport, then formal language for credibility. Inconsistent register is accidental and undermines the speaker\'s authority.', key: 'strategic-vs-inconsistent' },
      ],
    },
  },
};

// ── Discussion Prompt Bank ──

const DISCUSSION_PROMPTS = {
  'grade-6': [
    { topic: 'Should students be allowed to choose their own reading books?', type: 'opinion', textConnection: 'Connect to any current class reading.' },
    { topic: 'What makes a character in a story truly "brave"? Is bravery always about physical courage?', type: 'literary-analysis', textConnection: 'Reference characters from current or recent reading.' },
    { topic: 'How does the setting of a story influence the characters\' choices?', type: 'literary-analysis', textConnection: 'Use specific examples from a class text.' },
    { topic: 'Is it ever okay to break a rule? Under what circumstances?', type: 'ethical', textConnection: 'Connect to a character\'s decision in a class text.' },
    { topic: 'How reliable are online sources of information? How can you tell?', type: 'media-literacy', textConnection: 'Apply to a recent research project or news event.' },
    { topic: 'What responsibility do we have to people who are different from us?', type: 'ethical', textConnection: 'Connect to themes in current class reading.' },
  ],
  'grade-7': [
    { topic: 'To what extent should individuals sacrifice personal freedom for the good of the community?', type: 'philosophical', textConnection: 'Reference dystopian or historical texts.' },
    { topic: 'How do authors use unreliable narrators, and why?', type: 'literary-analysis', textConnection: 'Analyze narrator reliability in a class text.' },
    { topic: 'Should social media companies be responsible for content posted by users?', type: 'policy', textConnection: 'Connect to media literacy or informational texts.' },
    { topic: 'How does an author\'s background influence their perspective and the stories they tell?', type: 'author-study', textConnection: 'Research the author of a current class text.' },
    { topic: 'Is it possible to be truly objective when reporting news? Should journalists try?', type: 'media-literacy', textConnection: 'Compare coverage of the same event from multiple sources.' },
    { topic: 'What is the difference between justice and revenge?', type: 'philosophical', textConnection: 'Apply to character motivations in class reading.' },
  ],
  'grade-8': [
    { topic: 'To what extent is history written by the victors? How does this affect what we learn?', type: 'critical-analysis', textConnection: 'Compare primary sources with textbook accounts.' },
    { topic: 'How do power structures influence who gets to speak and who is silenced in literature and in life?', type: 'critical-analysis', textConnection: 'Analyze voice and power in a class text.' },
    { topic: 'Should art be separated from the artist? Can we appreciate work by people whose views we oppose?', type: 'philosophical', textConnection: 'Apply to an author or work studied in class.' },
    { topic: 'How do media sources use framing to shape public opinion on controversial issues?', type: 'media-literacy', textConnection: 'Analyze framing in news coverage of a current event.' },
    { topic: 'What is the relationship between language and power? How does the way we speak affect how we are perceived?', type: 'sociolinguistic', textConnection: 'Connect to code-switching, register, and character speech in texts.' },
    { topic: 'Is civil disobedience ever justified? What criteria should be met?', type: 'philosophical', textConnection: 'Connect to historical texts, speeches, or literary works.' },
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
  const first = selected[0];

  // Scenario-based (discussion preparation, media analysis)
  if (first.scenario !== undefined && first.best !== undefined) {
    return { type: 'scenario-analysis', skill, grade, count: selected.length, instruction: 'Read the scenario and describe the best approach.', items: selected.map(i => ({ prompt: i.scenario, answer: i.best, weak: i.weak || '', skill: i.skill || '' })) };
  }
  // Prompt-response (open-ended skill questions)
  if (first.prompt !== undefined && first.answer !== undefined) {
    return { type: 'prompt-response', skill, grade, count: selected.length, instruction: 'Answer the question about speaking and listening skills.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, key: i.key || '' })) };
  }
  // Vague-to-specific (question improvement)
  if (first.vague !== undefined && first.specific !== undefined) {
    return { type: 'improve-question', skill, grade, count: selected.length, instruction: 'Improve this vague question to make it more specific and discussion-worthy.', items: selected.map(i => ({ prompt: i.vague, answer: i.specific, skill: i.skill || '' })) };
  }
  // Brief-to-elaborated (elaboration practice)
  if (first.brief !== undefined && first.elaborated !== undefined) {
    return { type: 'elaborate', skill, grade, count: selected.length, instruction: 'Elaborate on this brief response with evidence and detail.', items: selected.map(i => ({ prompt: i.brief, answer: i.elaborated, skill: i.skill || '' })) };
  }
  // Follow-up question generation
  if (first.statement !== undefined && first.followUp !== undefined) {
    return { type: 'follow-up', skill, grade, count: selected.length, instruction: 'Write a follow-up question that pushes for deeper thinking.', items: selected.map(i => ({ prompt: i.statement, answer: i.followUp, skill: i.skill || '' })) };
  }
  // Speech/claim identification
  if (first.speech !== undefined && first.mainClaim !== undefined) {
    return { type: 'identify-claims', skill, grade, count: selected.length, instruction: 'Identify the main claim and supporting claims in this argument.', items: selected.map(i => ({ prompt: i.speech, answer: i.mainClaim, supportingClaims: i.supportingClaims, skill: i.skill || '' })) };
  }
  // Supported vs unsupported claims
  if (first.claim !== undefined && first.supported !== undefined) {
    return { type: 'evaluate-support', skill, grade, count: selected.length, instruction: 'Is this claim supported or unsupported? Explain.', items: selected.map(i => ({ prompt: `Claim: "${i.claim}" Evidence: "${i.evidence}"`, answer: i.supported ? 'supported' : 'unsupported', explanation: i.explanation })) };
  }
  // Scrambled sequence (logical ordering)
  if (first.scrambled !== undefined && first.correct !== undefined) {
    return { type: 'sequence', skill, grade, count: selected.length, instruction: 'Put these sentences in the most logical order for a presentation.', items: selected.map(i => ({ prompt: shuffle(i.scrambled).join(' | '), answer: i.correct.join(' | '), skill: i.skill || '' })) };
  }
  // Pertinent vs irrelevant details
  if (first.topic !== undefined && first.pertinent !== undefined) {
    return { type: 'sort-details', skill, grade, count: selected.length, instruction: 'Identify which details are pertinent to the topic and which are irrelevant.', items: selected.map(i => ({ prompt: `Topic: ${i.topic}. Details: ${[...i.pertinent, ...i.irrelevant].sort(() => Math.random() - 0.5).join('; ')}`, answer: `Pertinent: ${i.pertinent.join('; ')}`, irrelevant: i.irrelevant, skill: i.skill || '' })) };
  }
  // Formal/informal register
  if (first.formal !== undefined && first.informal !== undefined && first.context !== undefined) {
    return { type: 'register-choice', skill, grade, count: selected.length, instruction: 'Which register (formal or informal) is appropriate for this context?', items: selected.map(i => ({ prompt: `Context: ${i.context}\nOption A: "${i.formal}"\nOption B: "${i.informal}"`, answer: i.appropriate, skill: i.skill || '' })) };
  }
  // Fix informal to formal
  if (first.informal !== undefined && first.formal !== undefined && first.rule !== undefined) {
    return { type: 'fix-register', skill, grade, count: selected.length, instruction: 'Rewrite this informal statement using formal English.', items: selected.map(i => ({ prompt: i.informal, answer: i.formal, rule: i.rule })) };
  }
  // Soundness evaluation
  if (first.argument !== undefined && first.sound !== undefined) {
    return { type: 'evaluate-soundness', skill, grade, count: selected.length, instruction: 'Is this argument sound? Explain any flaws.', items: selected.map(i => ({ prompt: i.argument, answer: i.sound ? 'sound' : 'unsound', flaw: i.flaw })) };
  }
  // Relevance evaluation
  if (first.claim !== undefined && first.relevant !== undefined) {
    return { type: 'evaluate-relevance', skill, grade, count: selected.length, instruction: 'Is this evidence relevant to the claim?', items: selected.map(i => ({ prompt: `Claim: "${i.claim}" Evidence: "${i.evidence}"`, answer: i.relevant ? 'relevant' : 'irrelevant', explanation: i.explanation })) };
  }
  // Sufficiency evaluation
  if (first.argument !== undefined && first.sufficient !== undefined) {
    return { type: 'evaluate-sufficiency', skill, grade, count: selected.length, instruction: 'Is the evidence sufficient to support the argument?', items: selected.map(i => ({ prompt: i.argument, answer: i.sufficient ? 'sufficient' : 'insufficient', explanation: i.explanation })) };
  }
  // Open-ended vs closed question improvement
  if (first.closed !== undefined && first.openEnded !== undefined) {
    return { type: 'open-ended', skill, grade, count: selected.length, instruction: 'Transform this closed question into an open-ended discussion question.', items: selected.map(i => ({ prompt: i.closed, answer: i.openEnded, skill: i.skill || '' })) };
  }
  // Rude vs respectful
  if (first.rude !== undefined && first.respectful !== undefined) {
    return { type: 'respectful-rewrite', skill, grade, count: selected.length, instruction: 'Rewrite this response respectfully while still disagreeing.', items: selected.map(i => ({ prompt: i.rude, answer: i.respectful, skill: i.skill || '' })) };
  }
  // Unqualified vs qualified
  if (first.unqualified !== undefined && first.qualified !== undefined) {
    return { type: 'qualify-statement', skill, grade, count: selected.length, instruction: 'Add qualifications and nuance to this statement.', items: selected.map(i => ({ prompt: i.unqualified, answer: i.qualified, skill: i.skill || '' })) };
  }
  // Media analysis
  if (first.media !== undefined && first.purpose !== undefined) {
    return { type: 'media-analysis', skill, grade, count: selected.length, instruction: 'Analyze the purpose and techniques of this media.', items: selected.map(i => ({ prompt: i.media, answer: i.purpose, analysis: i.analysis || '', key: i.key || '' })) };
  }
  // Bias detection
  if (first.example !== undefined && first.bias !== undefined) {
    return { type: 'detect-bias', skill, grade, count: selected.length, instruction: 'Identify the type of bias in this example.', items: selected.map(i => ({ prompt: i.example, answer: i.bias, key: i.key || '' })) };
  }
  // Logical fallacies
  if (first.fallacy !== undefined && first.example !== undefined) {
    return { type: 'identify-fallacy', skill, grade, count: selected.length, instruction: 'Identify the logical fallacy in this argument.', items: selected.map(i => ({ prompt: i.example, answer: i.fallacy, explanation: i.explanation, key: i.key || '' })) };
  }
  // Irrelevant evidence identification
  if (first.argument !== undefined && first.irrelevant !== undefined) {
    return { type: 'find-irrelevant', skill, grade, count: selected.length, instruction: 'Identify the irrelevant evidence in this argument.', items: selected.map(i => ({ prompt: i.argument, answer: i.irrelevant, skill: i.skill || '' })) };
  }
  // Context-register matching
  if (first.context !== undefined && first.register !== undefined) {
    return { type: 'match-register', skill, grade, count: selected.length, instruction: 'What register is appropriate for this context?', items: selected.map(i => ({ prompt: i.context, answer: i.register, features: i.features || '', key: i.key || '' })) };
  }

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
}

// ── Public API ──

class SpeakingListening {
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

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  getDiscussionPrompt(grade) {
    const prompts = DISCUSSION_PROMPTS[grade];
    if (!prompts) return { error: `No discussion prompts for ${grade}. Valid: ${Object.keys(DISCUSSION_PROMPTS).join(', ')}` };
    return pick(prompts, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-6';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const prompt = DISCUSSION_PROMPTS[grade] ? pick(DISCUSSION_PROMPTS[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, discussionPrompt: prompt,
      lessonPlan: {
        warmUp: prompt ? `Discussion starter: "${prompt.topic}"` : 'Quick pair-share on a speaking or listening goal.',
        teach: `Focus skill: ${target.category} — ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        reflect: 'Self-assess: What did I do well? What will I work on next?',
      },
    };
  }
}

module.exports = SpeakingListening;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const sl = new SpeakingListening();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) sl.setGrade(id, grade);
        out({ action: 'start', profile: sl.getProfile(id), nextSkills: sl.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(sl.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'grade-6';
        if (skill) { out(sl.generateExercise(grade, skill, 5)); }
        else { const n = sl.getNextSkills(id, 1).next; out(n.length ? sl.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(sl.checkAnswer(type, expected, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(sl.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(sl.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(sl.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(sl.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? sl.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(sl.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(sl.setGrade(id, g)); break; }
      case 'discussion-prompt': { const [, g] = args; if (!g) throw new Error('Usage: discussion-prompt <grade>'); out(sl.getDiscussionPrompt(g)); break; }
      default: out({ usage: 'node speaking-listening.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','discussion-prompt'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
