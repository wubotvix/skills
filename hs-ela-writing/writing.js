// eClaw HS ELA Writing Interactive Tutor (9-12). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-ela-writing');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-9': {
    'narrative-personal': ['personal-narrative', 'sensory-detail', 'dialogue-writing', 'reflection-insight'],
    'basic-argument': ['claim-support', 'five-paragraph-structure', 'intro-conclusion', 'counterargument-intro'],
    'literary-analysis-intro': ['text-evidence', 'theme-identification', 'character-analysis', 'close-reading'],
    'thesis-development': ['simple-claim', 'claim-plus-reason', 'thesis-placement', 'arguable-vs-fact'],
    'evidence-integration': ['embedded-quotes', 'paraphrase-basics', 'citation-intro', 'lead-in-phrases'],
    'revision-basics': ['peer-feedback', 'self-checklist', 'paragraph-structure', 'proofreading'],
  },
  'grade-10': {
    'extended-argument': ['multi-source-argument', 'logical-reasoning', 'warrant-development', 'evidence-variety'],
    'comparative-analysis': ['compare-contrast-structure', 'textual-comparison', 'thematic-comparison', 'analytical-lens'],
    'research-report': ['source-evaluation', 'note-taking', 'mla-formatting', 'works-cited'],
    'counterargument-rebuttal': ['identifying-objections', 'concession-rebuttal', 'straw-man-avoidance', 'strengthening-claims'],
    'style-voice': ['sentence-variety', 'active-voice', 'concrete-diction', 'tone-awareness'],
    'peer-revision': ['structured-feedback', 'revision-priorities', 'global-vs-local', 'feedback-protocols'],
  },
  'grade-11': {
    'rhetorical-analysis': ['ethos-pathos-logos', 'rhetorical-strategies', 'audience-purpose', 'effect-analysis'],
    'synthesis-essay': ['source-integration', 'original-argument', 'source-balance', 'attribution'],
    'complex-argument': ['qualified-claims', 'nuanced-thesis', 'multiple-perspectives', 'logical-structure'],
    'research-paper': ['research-question', 'scholarly-sources', 'synthesis-of-sources', 'academic-voice'],
    'ap-timed-writing': ['time-management', 'thesis-under-pressure', 'evidence-selection', 'timed-drafting'],
    'advanced-revision': ['reverse-outline', 'cut-ten-percent', 'thesis-check', 'evidence-audit'],
  },
  'grade-12': {
    'literary-analysis-advanced': ['interpretive-thesis', 'craft-analysis', 'symbolic-reading', 'critical-lens'],
    'college-essay': ['topic-selection', 'authentic-voice', 'show-dont-tell', 'personal-insight'],
    'personal-essay': ['vulnerability-balance', 'narrative-arc', 'reflective-depth', 'specificity'],
    'senior-thesis': ['sustained-argument', 'multi-chapter-structure', 'original-contribution', 'defense-preparation'],
    'ap-lit-essays': ['poetry-analysis', 'prose-analysis', 'open-prompt', 'literary-argument'],
    'portfolio-reflection': ['growth-narrative', 'self-assessment', 'goal-setting', 'work-selection'],
  },
};

// ── Exercise Banks ──

const EXERCISE_BANKS = {
  'grade-9': {
    // Thesis exercises
    'arguable-vs-fact': {
      items: [
        { text: 'Shakespeare wrote Romeo and Juliet in the 1590s.', answer: 'fact', explanation: 'This is a verifiable fact, not arguable. A thesis must be debatable.' },
        { text: 'Romeo and Juliet is ultimately a story about the destructive power of feuds, not romantic love.', answer: 'thesis', explanation: 'Reasonable people could disagree — this is an arguable interpretation.' },
        { text: 'The novel To Kill a Mockingbird was published in 1960.', answer: 'fact', explanation: 'A date of publication is a fact, not a thesis.' },
        { text: 'Atticus Finch represents an idealized but ultimately flawed model of racial justice.', answer: 'thesis', explanation: 'This is an interpretive claim that could be argued.' },
        { text: 'Social media usage among teens increased 40% between 2020 and 2024.', answer: 'fact', explanation: 'A statistic is a fact, not an arguable claim.' },
        { text: 'Social media does more harm than good for teenagers because it distorts self-image.', answer: 'thesis', explanation: 'This is a debatable claim with a reason — a proper thesis.' },
        { text: 'The Great Gatsby is set in the 1920s.', answer: 'fact', explanation: 'The setting is a fact about the novel.' },
        { text: 'Gatsby\'s downfall reveals Fitzgerald\'s critique of the American Dream as an illusion built on materialism.', answer: 'thesis', explanation: 'This is an arguable interpretation of the text.' },
      ],
    },
    'simple-claim': {
      items: [
        { prompt: 'Topic: school uniforms. Write a simple claim (X is Y).', model: 'School uniforms limit student self-expression.', criteria: ['states a position', 'is arguable', 'is a complete sentence'] },
        { prompt: 'Topic: homework. Write a simple claim.', model: 'Excessive homework reduces students\' motivation to learn.', criteria: ['states a position', 'is arguable', 'is a complete sentence'] },
        { prompt: 'Topic: social media. Write a simple claim.', model: 'Social media creates unrealistic expectations for teenagers.', criteria: ['states a position', 'is arguable', 'is a complete sentence'] },
        { prompt: 'Topic: school start times. Write a simple claim.', model: 'Later school start times would improve student academic performance.', criteria: ['states a position', 'is arguable', 'is a complete sentence'] },
        { prompt: 'Topic: standardized testing. Write a simple claim.', model: 'Standardized tests fail to measure true student ability.', criteria: ['states a position', 'is arguable', 'is a complete sentence'] },
        { prompt: 'Topic: cell phones in school. Write a simple claim.', model: 'Cell phones in classrooms are a distraction that undermines learning.', criteria: ['states a position', 'is arguable', 'is a complete sentence'] },
      ],
    },
    'claim-plus-reason': {
      items: [
        { prompt: 'Upgrade this simple claim to claim + reason: "School uniforms are bad."', model: 'School uniforms are harmful because they suppress individuality during a critical period of identity development.', pattern: 'X is Y because Z' },
        { prompt: 'Upgrade: "Video games are harmful."', model: 'Video games are harmful to adolescents because they normalize violence and reduce empathy.', pattern: 'X is Y because Z' },
        { prompt: 'Upgrade: "Reading is important."', model: 'Reading fiction is essential for teenagers because it builds empathy by immersing readers in unfamiliar perspectives.', pattern: 'X is Y because Z' },
        { prompt: 'Upgrade: "Arts education matters."', model: 'Arts education is vital in public schools because it develops creative problem-solving skills that transfer to every discipline.', pattern: 'X is Y because Z' },
        { prompt: 'Upgrade: "Climate change is a problem."', model: 'Climate change is the defining challenge of this generation because its effects disproportionately harm communities that contributed least to it.', pattern: 'X is Y because Z' },
        { prompt: 'Upgrade: "Social media is bad for teens."', model: 'Social media harms teenagers because its algorithmic design exploits adolescent insecurity for engagement.', pattern: 'X is Y because Z' },
      ],
    },
    'thesis-placement': {
      items: [
        { text: 'Many students struggle with homework. Teachers assign it to reinforce learning. But does it actually help? Homework in moderation reinforces learning, but excessive homework causes stress and burnout.', answer: 'last', explanation: 'The thesis ("Homework in moderation...") appears at the end of the introduction, which is the standard placement.' },
        { text: 'Standardized testing fails to measure true student intelligence. While proponents argue tests ensure accountability, the narrow focus on rote memorization ignores creativity, critical thinking, and collaboration.', answer: 'first', explanation: 'The thesis appears as the first sentence, a bold opening strategy.' },
        { text: 'Consider a student who spends three hours on homework each night. She has no time for sports, hobbies, or family. This is not an exception — it is the norm. The American obsession with homework is undermining student wellbeing.', answer: 'last', explanation: 'The thesis comes after an anecdotal hook, placed at the end of the paragraph.' },
      ],
    },
    // Evidence integration
    'embedded-quotes': {
      items: [
        { wrong: 'The character is brave. "I will not run from this fight."', right: 'The character demonstrates bravery when he declares, "I will not run from this fight."', rule: 'Embed quotes into your own sentence rather than dropping them in isolation.' },
        { wrong: 'Gatsby is obsessed with the past. "So we beat on, boats against the current, borne back ceaselessly into the past."', right: 'Fitzgerald captures Gatsby\'s obsession with the past in the novel\'s final line: "So we beat on, boats against the current, borne back ceaselessly into the past."', rule: 'Introduce quotes with context and attribution.' },
        { wrong: 'The theme is about justice. "Until justice rolls down like waters."', right: 'King reinforces his central theme by invoking the prophet Amos: "Until justice rolls down like waters."', rule: 'Always attribute quotes and connect them to your argument.' },
        { wrong: 'Scout learns about empathy. "You never really understand a person until you consider things from his point of view."', right: 'Scout begins to learn empathy when Atticus advises her, "You never really understand a person until you consider things from his point of view."', rule: 'Weave quotes seamlessly into your prose with a signal phrase.' },
        { wrong: 'The mood is dark. "It was a dark and stormy night."', right: 'The author establishes a foreboding mood from the opening line: "It was a dark and stormy night."', rule: 'Context before quote, analysis after.' },
        { wrong: 'He is sad. "My heart aches, and a drowsy numbness pains my sense."', right: 'Keats conveys his melancholy through physical sensation: "My heart aches, and a drowsy numbness pains my sense."', rule: 'Embed the quote with a colon or signal phrase and connect to your claim.' },
      ],
    },
    'paraphrase-basics': {
      items: [
        { original: '"The only thing we have to fear is fear itself." — FDR', good: 'Roosevelt argued that Americans\' greatest obstacle was their own anxiety, not any external threat (Roosevelt).', bad: 'Roosevelt said the only thing to fear is fear itself.', rule: 'A paraphrase restates ideas in genuinely new words, not just minor substitutions.' },
        { original: '"Ask not what your country can do for you — ask what you can do for your country." — JFK', good: 'Kennedy urged citizens to prioritize civic duty over personal benefit (Kennedy).', bad: 'Kennedy said don\'t ask what your country can do for you but ask what you can do for your country.', rule: 'Change both words AND sentence structure when paraphrasing.' },
        { original: '"I think, therefore I am." — Descartes', good: 'Descartes argued that the act of conscious thought is itself proof of existence (Descartes 1).', bad: 'Descartes said he thinks so he exists.', rule: 'A good paraphrase captures meaning without echoing the original phrasing.' },
        { original: '"To be, or not to be, that is the question." — Shakespeare', good: 'Hamlet wrestles with whether continuing to live is worth the suffering existence demands (Shakespeare 3.1.56).', bad: 'Hamlet asks whether to be or not to be.', rule: 'Paraphrase should demonstrate your understanding, not just repeat the source.' },
      ],
    },
    'lead-in-phrases': {
      items: [
        { prompt: 'Add an appropriate lead-in phrase before this quote: "_____ the economy is hemorrhaging jobs."', options: ['According to the report,', 'As the economist argues,', 'The author states that'], answer: 'As the economist argues,', rule: 'Use signal verbs (argues, claims, suggests) to introduce quotes with attribution.' },
        { prompt: 'Which lead-in best introduces an opposing view? _____ "standardized tests ensure accountability."', options: ['Proponents of testing argue that', 'It is true that', 'The fact is that'], answer: 'Proponents of testing argue that', rule: 'Name the source or perspective when introducing a counterargument quote.' },
        { prompt: 'Choose the strongest lead-in: _____ "the haunting of 124 was not a malicious act but a desperate plea."', options: ['Morrison writes,', 'Morrison suggests that', 'The book says'], answer: 'Morrison suggests that', rule: 'Use interpretive signal verbs (suggests, implies, reveals) for literary analysis.' },
      ],
    },
    'citation-intro': {
      items: [
        { prompt: 'Where does the in-text citation go? Morrison writes, "124 was spiteful" (3).', answer: 'after-quote-before-period', rule: 'MLA in-text citation goes after the closing quotation mark and before the period.' },
        { prompt: 'Format this citation: author Morrison, page 47', answer: '(Morrison 47)', rule: 'MLA format: (Author Page) with no comma, inside parentheses.' },
        { prompt: 'Format this citation for a source with no author, title "Youth and Media", page 12', answer: '("Youth and Media" 12)', rule: 'When no author is given, use a shortened title in quotes.' },
        { prompt: 'Format a citation for an online source by Smith with no page numbers', answer: '(Smith)', rule: 'When there are no page numbers, use only the author\'s last name.' },
      ],
    },
    // Narrative
    'sensory-detail': {
      items: [
        { weak: 'The kitchen smelled good.', strong: 'The kitchen smelled of cinnamon and browning butter, warmth rising from the cast-iron skillet.', technique: 'Replace vague descriptors with specific sensory details.' },
        { weak: 'The room was messy.', strong: 'Crumpled notebooks covered the desk, a half-eaten granola bar balanced on the keyboard, and dirty socks draped over the chair like flags of surrender.', technique: 'Use concrete, visual details to show rather than tell.' },
        { weak: 'It was cold outside.', strong: 'The wind sliced through my jacket, and each breath came out in a white plume that dissolved against the gray sky.', technique: 'Engage multiple senses: touch, sight, temperature.' },
        { weak: 'The music was loud.', strong: 'The bass thumped through the floorboards and into my chest, rattling my ribs like a second heartbeat.', technique: 'Use figurative language to convey sensory experience.' },
        { weak: 'She was nervous.', strong: 'Her fingers twisted the hem of her shirt into a tight spiral, and she kept glancing at the clock above the door.', technique: 'Show emotion through physical actions and body language.' },
        { weak: 'The food tasted bad.', strong: 'The overcooked broccoli dissolved into a bitter mush against my tongue, and I reached for my water glass.', technique: 'Name specific tastes and textures rather than using generic adjectives.' },
      ],
    },
    'dialogue-writing': {
      items: [
        { wrong: 'She said I don\'t want to go. He said you have to.', right: '"I don\'t want to go," she said.\n"You have to," he replied, crossing his arms.', rule: 'Use quotation marks, proper punctuation, and new paragraphs for each speaker.' },
        { wrong: '"I\'m leaving" said John. "Don\'t go" said Mary.', right: '"I\'m leaving," John said, reaching for his coat.\n"Don\'t go." Mary\'s voice cracked.', rule: 'Comma before attribution; add action beats to reveal character.' },
        { wrong: '"Hello" he said "how are you" she said "fine" he said.', right: '"Hello," he said.\n"How are you?" she asked.\n"Fine." He didn\'t look up.', rule: 'Each speaker gets a new paragraph. Vary dialogue tags and add action.' },
      ],
    },
    'reflection-insight': {
      items: [
        { narrative: 'I scored the winning goal and everyone cheered. It was the best day of my life.', problem: 'The reflection is a cliche. What did this moment actually teach or reveal?', model: 'Standing in the center of that noise, I realized the goal itself didn\'t matter — what mattered was that I\'d spent six months wanting to quit and hadn\'t.' },
        { narrative: 'My grandmother passed away last year. I was really sad. She was a good person.', problem: 'The reflection stays on the surface. Push past generic emotion into specific insight.', model: 'I didn\'t cry at the funeral. I cried three weeks later, reaching for my phone to call her about a recipe, and realizing that grief isn\'t a moment — it\'s the accumulation of small absences.' },
        { narrative: 'I moved to a new school and it was hard at first but then I made friends.', problem: 'This follows a predictable arc with no real insight. What was actually hard? What did you learn about yourself?', model: 'What I didn\'t expect was how quickly I started performing a version of myself I thought they\'d like — and how long it took to realize that the person they befriended wasn\'t quite me.' },
      ],
    },
    'personal-narrative': {
      items: [
        { prompt: 'Write a personal narrative opening about a moment that changed how you see yourself. Focus on a specific scene with sensory detail.', criteria: ['specific moment in time', 'sensory details', 'first person', 'shows rather than tells'], model_opening: 'The envelope sat on the kitchen counter for three days before I opened it.' },
        { prompt: 'Write a personal narrative about a time you failed at something. Start in the middle of the action.', criteria: ['in medias res opening', 'vulnerability', 'concrete detail', 'authentic voice'], model_opening: 'My hands were shaking so badly that the sheet music blurred into a gray smear.' },
      ],
    },
    // Paragraph and structure
    'paragraph-structure': {
      items: [
        { prompt: 'Identify the missing element: "In To Kill a Mockingbird, Atticus teaches his children about empathy. He tells Scout to walk in someone else\'s shoes. This shows he is a good father."', answer: 'analysis', explanation: 'The paragraph has a claim and evidence but no analysis explaining HOW the quote supports the claim.' },
        { prompt: 'Identify the missing element: "Morrison uses imagery to convey Sethe\'s trauma. The word \'venom\' suggests poison and contamination, transforming an infant\'s presence into something toxic. This imagery reveals how slavery corrupts even the most intimate bonds."', answer: 'evidence', explanation: 'There is a claim and analysis, but the specific quote is not provided — only referenced indirectly.' },
        { prompt: 'Identify the missing element: "\'The eyes of Doctor T.J. Eckleburg are blue and gigantic\' (Fitzgerald 23). The billboard watches over the valley of ashes like a god who has abandoned his creation. This symbolizes the moral decay of the American Dream."', answer: 'claim', explanation: 'The paragraph starts with evidence and analysis but lacks a clear topic sentence stating the paragraph\'s argument.' },
      ],
    },
    // Revision
    'self-checklist': {
      items: [
        { draft_issue: 'Every paragraph starts with "First," "Second," "Third," "Finally."', revision: 'Vary paragraph openings. Use topic sentences that preview the paragraph\'s argument rather than mechanical transitions.', category: 'transitions' },
        { draft_issue: 'The essay is 600 words but only has two body paragraphs.', revision: 'Break long paragraphs into focused units. Each paragraph should develop one claim with evidence and analysis.', category: 'structure' },
        { draft_issue: 'The conclusion restates the thesis word-for-word and adds "In conclusion."', revision: 'Reframe the thesis in light of the argument you\'ve built. End with significance, not repetition.', category: 'conclusion' },
        { draft_issue: 'Three quotes appear in the essay but none have analysis after them.', revision: 'Add 2-3 sentences of commentary after each quote explaining how it supports your claim.', category: 'evidence' },
      ],
    },
    'peer-feedback': {
      items: [
        { draft_excerpt: 'I think that maybe social media could possibly be somewhat harmful to teens.', feedback_type: 'hedging', suggestion: 'Remove hedging language. State your claim with confidence: "Social media harms teenagers."' },
        { draft_excerpt: 'Shakespeare uses metaphor, simile, alliteration, imagery, and symbolism in his play.', feedback_type: 'device-listing', suggestion: 'Pick one or two devices and analyze them in depth rather than listing many without analysis.' },
        { draft_excerpt: 'In the book, the character goes to the store and buys food and then goes home and eats dinner and then goes to bed.', feedback_type: 'plot-summary', suggestion: 'This summarizes plot. Instead, make a claim about what this scene reveals about the character or theme.' },
      ],
    },
    'proofreading': {
      items: [
        { wrong: 'Their going to the store, but there car is broke.', right: 'They\'re going to the store, but their car is broken.', rule: 'they\'re = they are; their = possessive; broke → broken (past participle).' },
        { wrong: 'The affects of social media effects how teens feel about theirselves.', right: 'The effects of social media affect how teens feel about themselves.', rule: 'effect (noun) vs. affect (verb); themselves, not theirselves.' },
        { wrong: 'Me and him went to school, him and me are best friends.', right: 'He and I went to school; he and I are best friends.', rule: 'Subject pronouns (he, I) for subjects; use a semicolon or period between independent clauses.' },
        { wrong: 'However the argument fails. Because it lacks evidence.', right: 'However, the argument fails because it lacks evidence.', rule: 'Comma after "however" as a conjunctive adverb; "because" clause is not a sentence on its own.' },
      ],
    },
    // Basic argument
    'claim-support': {
      items: [
        { prompt: 'Which sentence is the strongest claim? A) Dogs are popular pets. B) Golden retrievers are the best family dog because of their gentle temperament. C) Many families own dogs.', answer: 'B', explanation: 'B is specific, arguable, and includes a reason. A and C are observations, not claims.' },
        { prompt: 'Which sentence is the strongest claim? A) Many students use phones in class. B) Phones should be banned in classrooms because they reduce focus and enable cheating. C) Phones have pros and cons.', answer: 'B', explanation: 'B takes a clear position with reasons. A is a fact; C is too vague to be a thesis.' },
        { prompt: 'Which sentence is the strongest claim? A) Shakespeare is a famous writer. B) Hamlet is a play about a prince. C) Hamlet\'s indecision reveals Shakespeare\'s argument that overthinking paralyzes moral action.', answer: 'C', explanation: 'C is interpretive, specific, and arguable. A and B are facts.' },
      ],
    },
    'five-paragraph-structure': {
      items: [
        { prompt: 'Put these essay parts in order: A) Body paragraph with strongest argument. B) Introduction with thesis. C) Conclusion with significance. D) Body paragraph with counterargument/rebuttal. E) Body paragraph with supporting argument.', answer: 'B, E, A, D, C', explanation: 'Standard structure: intro, support, strongest point, counterargument, conclusion.' },
        { prompt: 'What is the purpose of the first body paragraph?', options: ['Restate the thesis', 'Present the first supporting argument with evidence', 'Summarize the essay', 'Introduce the counterargument'], answer: 'Present the first supporting argument with evidence', rule: 'Each body paragraph develops one claim with evidence and analysis.' },
      ],
    },
    'intro-conclusion': {
      items: [
        { prompt: 'Which opening strategy is this? "In 2024, 67% of American teens reported spending more than four hours daily on social media. This startling figure raises urgent questions about the impact of screens on developing minds."', answer: 'startling-statistic', explanation: 'The opening uses a surprising data point to hook the reader.' },
        { prompt: 'Which opening strategy is this? "The first time I opened my locker at Jefferson High, a crumpled note fell out. It read: Go home."', answer: 'anecdote', explanation: 'The opening uses a brief, vivid story to draw the reader in.' },
        { prompt: 'What is wrong with this conclusion? "In conclusion, I have argued that social media is bad for teens. Social media is bad for teens because it hurts them. That is why social media is bad for teens."', answer: 'repetitive-restatement', explanation: 'The conclusion merely restates the thesis without adding significance, insight, or a forward-looking statement.' },
      ],
    },
    'counterargument-intro': {
      items: [
        { prompt: 'Write a counterargument acknowledgment for: "School uniforms should be required." Start with a concession.', model: 'Admittedly, some argue that uniforms suppress students\' ability to express their identities through clothing. However, true individuality is demonstrated through ideas and actions, not brand names.', structure: 'concession + rebuttal' },
        { prompt: 'Write a counterargument acknowledgment for: "Homework should be limited to 30 minutes per night."', model: 'Critics may contend that reducing homework would leave students underprepared for rigorous college courses. Yet research from Stanford University shows that excessive homework produces diminishing returns after two hours.', structure: 'concession + rebuttal with evidence' },
      ],
    },
    // Literary analysis intro
    'text-evidence': {
      items: [
        { prompt: 'Which is a stronger use of text evidence? A) "Gatsby is obsessed with the green light." B) "Gatsby\'s obsession manifests in his nightly ritual of reaching toward the green light, which Fitzgerald describes as \'minute and far away\' (Fitzgerald 21), suggesting that Gatsby\'s dream is perpetually out of reach."', answer: 'B', explanation: 'B embeds the quote, provides context, and offers analysis. A makes a claim without evidence.' },
        { prompt: 'What is wrong with this evidence use? "The theme of the novel is loneliness. \'I am the loneliest person in the world.\'"', answer: 'dropped-quote', explanation: 'The quote is dropped in without attribution, context, or analysis. Embed it and explain its significance.' },
      ],
    },
    'theme-identification': {
      items: [
        { prompt: 'Which is a theme statement (not a topic)? A) The book is about friendship. B) True friendship requires sacrifice and the courage to be honest, even when honesty risks the relationship.', answer: 'B', explanation: 'A is a topic (one word: friendship). B is a theme — a complete statement about the human condition.' },
        { prompt: 'Which is a theme statement? A) The novel explores racism. B) The novel argues that systemic racism persists not because of overt hatred but because of the comfortable silence of those who benefit from it.', answer: 'B', explanation: 'A names a topic. B makes an arguable claim about what the novel says about racism.' },
        { prompt: 'Convert this topic into a theme: "identity"', model: 'The search for identity is not about discovering who you already are but about choosing who you want to become.', rule: 'A theme is a complete, arguable sentence about a topic — not just the topic word.' },
      ],
    },
    'character-analysis': {
      items: [
        { prompt: 'Which is stronger character analysis? A) "Atticus is a good person who does the right thing." B) "Atticus\'s decision to defend Tom Robinson reveals his belief that moral courage must be exercised even when — especially when — it is unpopular."', answer: 'B', explanation: 'B analyzes a specific action and connects it to a larger idea. A is a vague summary.' },
        { prompt: 'Analyze what this detail reveals about a character: "She alphabetized her bookshelf every Sunday morning before anyone else woke up."', model: 'This ritual suggests a need for control and order, perhaps compensating for chaos in other areas of her life. The early morning timing implies she hides this compulsion from others.', technique: 'Small, specific details reveal character more powerfully than broad descriptions.' },
      ],
    },
    'close-reading': {
      items: [
        { passage: '"It was a bright cold day in April, and the clocks were striking thirteen." — George Orwell, 1984', prompt: 'What is unusual about this sentence and what does it suggest?', model: 'The juxtaposition of "bright cold" creates unease, and "clocks striking thirteen" signals that this world operates outside normal rules. The matter-of-fact tone normalizes the abnormal, establishing the novel\'s dystopian reality.', technique: 'Close reading notices word choice, imagery, syntax, and tone.' },
        { passage: '"Call me Ishmael." — Herman Melville, Moby-Dick', prompt: 'What does this opening line establish?', model: 'The imperative "Call me" implies a chosen identity rather than a given one, suggesting the narrator may be withholding his true name. The brevity creates intimacy and directness, as if the narrator is speaking confidentially to the reader.', technique: 'Even a single sentence rewards close analysis of word choice and tone.' },
      ],
    },
  },
  'grade-10': {
    // Extended argument
    'multi-source-argument': {
      items: [
        { prompt: 'You have three sources on teen mental health: a psychology study, a teen\'s personal blog, and a CDC report. Rank them by credibility for an academic argument.', answer: 'CDC report, psychology study, teen blog', explanation: 'Government data and peer-reviewed research outrank personal anecdotes in academic writing, though the blog could provide a human perspective.' },
        { prompt: 'How should you integrate multiple sources in one paragraph?', model: 'Use one source as the primary evidence, then reinforce or complicate it with a second source. Avoid "source stacking" where you list sources without connecting them to your argument.', rule: 'Sources should be in conversation with each other, not just listed.' },
      ],
    },
    'logical-reasoning': {
      items: [
        { argument: 'All my friends use social media, so it must be safe.', fallacy: 'bandwagon', explanation: 'Popularity does not equal safety. This is an appeal to popularity rather than evidence.' },
        { argument: 'If we allow students to use phones in class, soon they\'ll be gaming during exams.', fallacy: 'slippery-slope', explanation: 'This assumes an extreme outcome without evidence for the chain of events.' },
        { argument: 'My opponent failed math in high school, so his economic plan must be wrong.', fallacy: 'ad-hominem', explanation: 'Attacking the person rather than the argument. Past grades don\'t invalidate an economic proposal.' },
        { argument: 'You\'re either with us or against us.', fallacy: 'false-dilemma', explanation: 'This presents only two options when more nuanced positions exist.' },
        { argument: 'We\'ve always done it this way, so we should keep doing it.', fallacy: 'appeal-to-tradition', explanation: 'Tradition alone does not justify a practice. The argument needs reasons beyond precedent.' },
        { argument: 'A famous actor says this diet works, so it must be effective.', fallacy: 'appeal-to-authority', explanation: 'Celebrity endorsement is not scientific evidence. The authority must be relevant to the field.' },
      ],
    },
    'warrant-development': {
      items: [
        { claim: 'Schools should start later.', evidence: 'Studies show teens\' circadian rhythms shift during puberty.', prompt: 'Write the warrant (the logical link between evidence and claim).', model: 'Because adolescent biology makes early morning alertness difficult, schools that start before 8:30 AM are working against their students\' natural cognitive rhythms, reducing the effectiveness of instruction.' },
        { claim: 'Reading fiction builds empathy.', evidence: 'Brain imaging studies show that reading narrative fiction activates the same neural pathways as real social experiences.', prompt: 'Write the warrant.', model: 'If fiction triggers the brain\'s empathy circuits in the same way real interactions do, then sustained reading effectively provides practice in perspective-taking — a skill that transfers to real-world relationships.' },
      ],
    },
    'evidence-variety': {
      items: [
        { prompt: 'Identify the type of evidence: "According to a 2024 Pew Research study, 72% of teens check social media within 10 minutes of waking up."', answer: 'statistical-data', explanation: 'This is a statistic from a credible research organization.' },
        { prompt: 'Identify the type of evidence: "My neighbor, a retired teacher of 30 years, recalls that students in the 1990s read twice as many books per year."', answer: 'anecdotal-testimony', explanation: 'This is an anecdote — one person\'s recollection, not systematic data.' },
        { prompt: 'Identify the type of evidence: "Morrison writes, \'124 was spiteful. Full of a baby\'s venom\' (3)."', answer: 'textual-evidence', explanation: 'This is a direct quote from a primary text being analyzed.' },
        { prompt: 'Identify the type of evidence: "The case of Brown v. Board of Education (1954) established that separate educational facilities are inherently unequal."', answer: 'historical-example', explanation: 'This is a specific historical precedent used to support an argument.' },
      ],
    },
    // Comparative analysis
    'compare-contrast-structure': {
      items: [
        { prompt: 'Which organizational pattern discusses all of Text A, then all of Text B? A) Point-by-point B) Block/subject-by-subject C) Alternating', answer: 'B', explanation: 'Block structure covers one subject completely, then the other. Point-by-point alternates between texts on each criterion.' },
        { prompt: 'Which pattern is usually stronger for literary comparison? Point-by-point or block?', answer: 'point-by-point', explanation: 'Point-by-point keeps the comparison active throughout, preventing the essay from becoming two separate summaries.' },
      ],
    },
    'textual-comparison': {
      items: [
        { prompt: 'Write a comparative thesis for two texts about the American Dream: The Great Gatsby and Death of a Salesman.', model: 'While both Fitzgerald and Miller expose the American Dream as destructive illusion, Gatsby frames the dream as tragically romantic whereas Willy Loman\'s pursuit reveals its pathetic banality.', criteria: ['names both texts', 'identifies similarity AND difference', 'is arguable'] },
        { prompt: 'Write a comparative thesis for two poems about nature.', model: 'Although both Frost and Dickinson use nature as a metaphor for human choice, Frost presents nature as a stage for decisive action while Dickinson reveals it as an indifferent force that exposes human insignificance.', criteria: ['names both authors', 'identifies similarity AND difference', 'is arguable'] },
      ],
    },
    'thematic-comparison': {
      items: [
        { prompt: 'How do you avoid writing two separate essays when comparing texts?', model: 'Use transitional phrases that explicitly connect the texts: "Unlike Gatsby, who...", "Where Morrison emphasizes X, Fitzgerald highlights Y", "Both authors suggest that... yet they diverge in..."', rule: 'Every paragraph in a comparison essay should reference both texts.' },
      ],
    },
    'analytical-lens': {
      items: [
        { prompt: 'What does it mean to read a text through a "feminist lens"?', model: 'A feminist reading examines how the text represents gender roles, power dynamics between genders, and the experiences of women — including what the text reveals about the society that produced it.', rule: 'A critical lens provides a specific angle of interpretation.' },
        { prompt: 'Name three common critical lenses for literary analysis.', model: 'Feminist, Marxist/economic, and post-colonial lenses are commonly used. Each focuses on different power structures: gender, class, and race/empire respectively.', rule: 'Critical lenses help generate focused, arguable interpretations.' },
      ],
    },
    // Research report
    'source-evaluation': {
      items: [
        { source: 'A blog post titled "Why Vaccines Are Poison" with no author listed, published on a site selling alternative medicine.', credible: 'no', explanation: 'No author, clear bias (selling competing products), no peer review. Fails the CRAAP test.' },
        { source: 'A 2023 article in The New England Journal of Medicine by three MDs, peer-reviewed, with a DOI.', credible: 'yes', explanation: 'Peer-reviewed journal, credentialed authors, recent, verifiable. Highly credible.' },
        { source: 'A Wikipedia article on climate change, last edited yesterday.', credible: 'starting-point', explanation: 'Wikipedia is useful for background and finding primary sources but should not be cited as a source itself in academic work.' },
        { source: 'A 2003 article about internet usage trends.', credible: 'outdated', explanation: 'For technology topics, a 20+ year old source is likely outdated. Check for more recent data.' },
      ],
    },
    'note-taking': {
      items: [
        { prompt: 'What is the difference between a direct quote note and a paraphrase note?', model: 'A direct quote note copies exact words in quotation marks with page numbers. A paraphrase note restates the idea in your own words. Both must include the source. Always mark which is which to avoid accidental plagiarism.', rule: 'Clear labeling prevents plagiarism.' },
        { prompt: 'What should every research note card include?', model: 'Source (author, title, page), the information (quote or paraphrase), and your own commentary or connection to your thesis.', rule: 'Three layers: source, content, your thinking.' },
      ],
    },
    'mla-formatting': {
      items: [
        { prompt: 'Format this book citation in MLA 9: Author: Toni Morrison. Title: Beloved. Publisher: Vintage. Year: 2004.', answer: 'Morrison, Toni. Beloved. Vintage, 2004.', rule: 'MLA 9: Last, First. Title (italicized). Publisher, Year.' },
        { prompt: 'Format this article citation in MLA 9: Author: Jane Smith. Title: "The Effects of Sleep." Journal: Sleep Science. Volume 12. Year: 2023. Pages: 45-52.', answer: 'Smith, Jane. "The Effects of Sleep." Sleep Science, vol. 12, 2023, pp. 45-52.', rule: 'MLA 9: Last, First. "Article Title." Journal (italicized), vol. #, Year, pp. #-#.' },
      ],
    },
    'works-cited': {
      items: [
        { prompt: 'How should entries on a Works Cited page be organized?', answer: 'alphabetical-by-author', explanation: 'Entries are alphabetized by the first word (usually author\'s last name). Do not number them.' },
        { prompt: 'True or false: Every source cited in the text must appear on the Works Cited page.', answer: 'true', explanation: 'Every in-text citation must correspond to a full entry on the Works Cited page, and vice versa.' },
      ],
    },
    // Counterargument and rebuttal
    'identifying-objections': {
      items: [
        { thesis: 'College should be free for all students.', prompt: 'Identify two likely counterarguments.', model: '1) Free college would require massive tax increases that burden working families. 2) Removing tuition may devalue degrees and reduce motivation.', rule: 'Anticipate the strongest objections, not the weakest.' },
        { thesis: 'Schools should eliminate letter grades in favor of narrative assessments.', prompt: 'Identify two likely counterarguments.', model: '1) Colleges need standardized metrics for admissions decisions. 2) Students and parents rely on grades to measure progress and identify struggles quickly.', rule: 'Think about who would disagree and why.' },
      ],
    },
    'concession-rebuttal': {
      items: [
        { prompt: 'Write a concession-rebuttal for this counterargument: "Banning phones in schools violates students\' rights."', model: 'While students do have a right to personal property, schools routinely regulate items that disrupt learning — from dress codes to food in labs. Restricting phone use during instructional time is a reasonable limitation, not a rights violation.', structure: 'While [concession], [rebuttal with reasoning].' },
        { prompt: 'Write a concession-rebuttal: "Homework builds discipline and responsibility."', model: 'Admittedly, homework can teach time management when assigned purposefully. However, the current culture of excessive homework — averaging 3+ hours nightly for high schoolers — replaces discipline with exhaustion and teaches compliance, not responsibility.', structure: 'Admittedly [concession]. However, [rebuttal with evidence].' },
      ],
    },
    'straw-man-avoidance': {
      items: [
        { straw_man: 'People who support gun control want to take away everyone\'s guns and leave citizens defenseless.', fair_version: 'Advocates of gun control generally support measures like universal background checks and restrictions on assault-style weapons, not a total ban on gun ownership.', rule: 'Represent opposing views accurately and charitably. Defeat the strongest version of the argument, not a distortion.' },
        { straw_man: 'People who oppose school uniforms just want kids to wear whatever they want with no rules at all.', fair_version: 'Opponents of school uniforms typically argue that dress codes (not total freedom) are sufficient, and that uniforms impose costs on families without proven academic benefits.', rule: 'A straw man is easier to knock down but weakens your credibility.' },
      ],
    },
    'strengthening-claims': {
      items: [
        { weak: 'Social media is bad for everyone.', strong: 'For adolescents whose identities are still forming, algorithm-driven social media platforms pose specific psychological risks that outweigh their social benefits.', technique: 'Qualify your claim: specify who, what kind, and under what conditions.' },
        { weak: 'Books are better than movies.', strong: 'Literary fiction develops sustained attention and interpretive thinking in ways that film adaptations, constrained by runtime and visual storytelling, cannot replicate.', technique: 'Replace vague comparisons with specific, defensible distinctions.' },
      ],
    },
    // Style and voice
    'sentence-variety': {
      items: [
        { boring: 'She walked to the store. She bought some milk. She walked home. She made dinner.', improved: 'After walking to the store for milk, she returned home and began making dinner.', method: 'Combine short, choppy sentences using subordination and coordination.' },
        { boring: 'The dog was big. The dog was brown. The dog was friendly. The dog liked children.', improved: 'The big brown dog, friendly and gentle, had a particular fondness for children.', method: 'Combine related details into one sentence with appositives and modifiers.' },
        { boring: 'He studied hard. He got good grades. He applied to college. He got accepted.', improved: 'Because he had studied hard and earned strong grades, his college application was accepted — a reward for years of discipline.', method: 'Use cause-effect relationships to combine sentences and add a dash for emphasis.' },
      ],
    },
    'active-voice': {
      items: [
        { passive: 'The decision was made by the committee to postpone the vote.', active: 'The committee decided to postpone the vote.', rule: 'In active voice, the subject performs the action. Active voice is more direct and vigorous.' },
        { passive: 'The ball was thrown by the quarterback into the end zone.', active: 'The quarterback threw the ball into the end zone.', rule: 'Move the true actor to the subject position.' },
        { passive: 'It was decided that the project would be completed by the students.', active: 'The students decided to complete the project.', rule: 'Eliminate "it was" constructions; name the actor.' },
        { passive: 'Mistakes were made.', active: 'The administration made mistakes.', rule: 'Passive voice can obscure responsibility. Active voice assigns accountability.' },
        { passive: 'The novel was written by Morrison in 1987.', active: 'Morrison wrote the novel in 1987.', rule: 'For attribution, active voice is clearer and more concise.' },
      ],
    },
    'concrete-diction': {
      items: [
        { vague: 'She felt bad about what happened.', concrete: 'Guilt tightened in her chest every time she replayed the conversation.', rule: 'Replace abstract emotions with physical sensations and specific actions.' },
        { vague: 'The place was nice.', concrete: 'Sunlight pooled on the hardwood floors, and the shelves sagged under the weight of old paperbacks.', rule: 'Replace generic adjectives with sensory details.' },
        { vague: 'He was a good leader.', concrete: 'He arrived first each morning, remembered every team member\'s name, and took blame publicly while giving credit privately.', rule: 'Show qualities through specific actions, not labels.' },
        { vague: 'The situation was very difficult.', concrete: 'Three deadlines converged on the same Friday, her car had been towed, and her phone was at 2%.', rule: 'Replace vague abstractions with concrete specifics.' },
      ],
    },
    'tone-awareness': {
      items: [
        { sentence: 'The author\'s argument is, like, totally unconvincing and basically dumb.', issue: 'informal/dismissive', revision: 'The author\'s argument is unconvincing because it relies on anecdotal evidence rather than systematic data.', rule: 'Academic writing requires formal tone. Critique arguments with reasoning, not insults.' },
        { sentence: 'One might potentially consider the possibility that the aforementioned thesis could perhaps be somewhat questionable.', issue: 'overly-hedged', revision: 'This thesis is questionable because it ignores contradicting evidence.', rule: 'Be direct. Excessive hedging weakens your authority.' },
        { sentence: 'Obviously, anyone with a brain can see that this policy is insane.', issue: 'condescending', revision: 'This policy is problematic because it overlooks key economic factors.', rule: 'Avoid assuming the reader agrees. Persuade with evidence, not attitude.' },
      ],
    },
    // Peer revision
    'structured-feedback': {
      items: [
        { prompt: 'Write feedback using the "praise-question-suggestion" model for a peer\'s essay that has a strong thesis but weak evidence.', model: 'Praise: Your thesis is specific and arguable — it gives the essay a clear direction. Question: In paragraph 2, what evidence supports your claim that social media "destroys" relationships? Suggestion: Try adding a specific example or statistic from your research to strengthen that paragraph.', rule: 'Balance positive feedback with actionable suggestions.' },
      ],
    },
    'revision-priorities': {
      items: [
        { prompt: 'Rank these revision concerns from most to least important: A) comma splice in paragraph 3, B) thesis is unclear, C) paragraph 4 doesn\'t support the thesis, D) misspelled word in the title.', answer: 'B, C, A, D', explanation: 'Global issues (thesis, coherence) before local issues (punctuation, spelling). Fix the big problems first.' },
      ],
    },
    'global-vs-local': {
      items: [
        { issue: 'The essay doesn\'t have a clear thesis.', level: 'global', explanation: 'Thesis is a global (whole-essay) issue. Fix it before worrying about commas.' },
        { issue: 'There\'s a comma splice in the third sentence.', level: 'local', explanation: 'Comma splices are local (sentence-level) issues. Important, but fix after global issues.' },
        { issue: 'Paragraph 3 doesn\'t connect to the thesis.', level: 'global', explanation: 'Coherence between paragraphs and thesis is a global structural issue.' },
        { issue: 'The word "their" should be "there" in line 5.', level: 'local', explanation: 'Spelling/word choice errors are local issues.' },
      ],
    },
    'feedback-protocols': {
      items: [
        { prompt: 'What is the difference between directive and facilitative feedback?', model: 'Directive feedback tells the writer what to fix ("Change this sentence to..."). Facilitative feedback asks questions that help the writer find solutions ("What would happen if you moved this paragraph before that one?"). Facilitative feedback develops stronger writers.', rule: 'Good peer review asks questions more than it gives orders.' },
      ],
    },
  },
  'grade-11': {
    // Rhetorical analysis
    'ethos-pathos-logos': {
      items: [
        { passage: '"As a surgeon with twenty years of experience in pediatric oncology, I can tell you that this treatment saves lives."', appeal: 'ethos', explanation: 'The speaker establishes credibility through professional credentials and experience.' },
        { passage: '"Imagine your child, alone in a hospital room, wondering if anyone is coming."', appeal: 'pathos', explanation: 'The passage evokes empathy and fear through a vivid emotional scenario directed at parents.' },
        { passage: '"Studies show that patients who receive this treatment have a 94% five-year survival rate, compared to 67% with the standard protocol."', appeal: 'logos', explanation: 'The passage uses statistical evidence and comparison to make a logical case.' },
        { passage: '"We the people — not the politicians, not the lobbyists, but ordinary citizens — must demand change."', appeal: 'ethos', explanation: 'The speaker builds solidarity and moral authority by identifying with the audience as a fellow citizen.' },
        { passage: '"If we cut education funding by 20%, and each classroom loses one teacher, and each remaining teacher gains 8 students, then the math is simple: learning suffers."', appeal: 'logos', explanation: 'The passage builds a logical chain of cause and effect using specific numbers.' },
        { passage: '"She was nine years old. She loved drawing horses and eating peanut butter sandwiches. She did not survive the shooting."', appeal: 'pathos', explanation: 'The specificity of the child\'s interests makes her vivid and real, intensifying grief and outrage.' },
      ],
    },
    'rhetorical-strategies': {
      items: [
        { passage: '"I have a dream that one day this nation will rise up. I have a dream that one day on the red hills of Georgia. I have a dream..."', strategy: 'anaphora', effect: 'The repetition of "I have a dream" creates rhythm, builds momentum, and makes the vision unforgettable.' },
        { passage: '"Ask not what your country can do for you — ask what you can do for your country."', strategy: 'antithesis/chiasmus', effect: 'The reversal of structure forces the audience to reconsider the relationship between citizen and nation.' },
        { passage: '"It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness."', strategy: 'parallel-structure-with-antithesis', effect: 'The balanced oppositions capture the contradictions of the era and create a memorable rhythmic pattern.' },
        { passage: 'A senator begins a speech about poverty by describing his own childhood in a trailer park.', strategy: 'narrative/anecdote', effect: 'Personal narrative builds ethos (shared experience) and pathos (emotional connection) simultaneously.' },
      ],
    },
    'audience-purpose': {
      items: [
        { prompt: 'A scientist writes an article about climate change for a scientific journal vs. for a popular magazine. How would the approach differ?', model: 'The journal article would use technical terminology, assume prior knowledge, cite methodology, and maintain an objective tone. The magazine article would use accessible language, explain concepts, include analogies, and might use a more urgent emotional appeal.', rule: 'Writers adapt tone, diction, evidence type, and structure to their audience.' },
        { prompt: 'Identify the likely audience and purpose: "If we don\'t act now, your grandchildren will inherit a planet 3 degrees warmer, with coastlines redrawn and summers that kill."', model: 'Audience: general public, likely voters or policymakers. Purpose: to persuade through urgency. The second-person "your" and the vivid imagery aim to make the threat personal and immediate.', rule: 'Analyzing audience helps explain why a writer makes specific rhetorical choices.' },
      ],
    },
    'effect-analysis': {
      items: [
        { prompt: 'Don\'t just identify the device — analyze its EFFECT. "King uses repetition." How do you improve this?', weak: 'King uses repetition in his speech.', strong: 'King\'s repetition of "I have a dream" transforms an individual aspiration into a collective vision, each iteration expanding the dream\'s scope from a courtroom to a mountaintop, building toward a crescendo that makes the future feel not just possible but inevitable.', rule: 'Effect analysis answers: What does this device DO to the reader? How does it advance the argument?' },
        { prompt: 'Analyze the effect of this metaphor: Lincoln calls the nation "a house divided."', model: 'By comparing the nation to a house, Lincoln frames unity not as a political ideal but as a structural necessity — a house divided does not merely disagree; it collapses. This metaphor raises the stakes from political debate to existential survival.', rule: 'Explain the specific associations the metaphor creates and how they shape the audience\'s understanding.' },
      ],
    },
    // Synthesis essay
    'source-integration': {
      items: [
        { prompt: 'Rewrite this to integrate the source into your own argument rather than just reporting it: "Source A says social media is bad. Source B says it is good. Source C says it depends."', model: 'While critics like Chen (Source A) emphasize social media\'s role in adolescent anxiety, proponents note its capacity for community-building (Source B). The reality, as Williams argues, is that impact varies based on usage patterns and platform design (Source C) — a nuance that demands policy targeted at specific harms rather than blanket regulation.', rule: 'Sources should serve YOUR argument. Don\'t just summarize them — put them in conversation.' },
      ],
    },
    'original-argument': {
      items: [
        { prompt: 'What is the #1 mistake students make in synthesis essays?', answer: 'summarizing sources instead of making an original argument', explanation: 'A synthesis essay requires your own thesis supported by sources. The sources are evidence, not the argument itself.' },
        { prompt: 'How many of the provided sources should you use in an AP synthesis essay?', answer: 'at least three, but more is better', explanation: 'AP scoring requires at least three sources for the evidence row. Using more demonstrates thorough engagement.' },
      ],
    },
    'source-balance': {
      items: [
        { prompt: 'A student\'s synthesis essay uses Source A twelve times and Sources B-F once each. What is the problem?', answer: 'over-reliance on one source', explanation: 'Balance demonstrates that your argument is supported broadly, not dependent on a single perspective. Aim for meaningful use of at least 3-4 sources.' },
      ],
    },
    'attribution': {
      items: [
        { wrong: 'Studies show that screen time reduces attention spans.', right: 'According to a 2024 study published in the Journal of Pediatric Psychology, more than two hours of daily screen time correlates with reduced sustained attention in adolescents (Martinez et al. 47).', rule: 'Always name the source. "Studies show" is too vague for academic writing.' },
        { wrong: 'Social media is addictive by design (Source B).', right: 'As former tech executive Aza Raskin explains in Source B, social media platforms are "deliberately engineered to be addictive," using variable reward schedules borrowed from slot machine design.', rule: 'Name the author and provide context, not just a parenthetical source label.' },
      ],
    },
    // Complex argument
    'qualified-claims': {
      items: [
        { unqualified: 'Technology destroys human connection.', qualified: 'While technology can facilitate surface-level interaction, its overuse as a substitute for face-to-face communication risks eroding the deep, sustained attention that meaningful relationships require.', technique: 'Add qualifiers (can, risks, when, for some) that make your claim defensible without making it wishy-washy.' },
        { unqualified: 'All standardized tests are useless.', qualified: 'Although standardized tests provide a common metric for comparison, their emphasis on rote recall fails to capture the creative and analytical skills that predict long-term success.', technique: 'Acknowledge what the opposing side gets right, then pivot to your qualified claim.' },
      ],
    },
    'nuanced-thesis': {
      items: [
        { prompt: 'Write a nuanced thesis on: Are social media companies responsible for teen mental health?', model: 'While social media companies bear significant responsibility for designing addictive platforms that exploit adolescent psychology, their culpability is shared with parents who provide unmonitored access and policymakers who have failed to regulate digital environments the way they regulate physical ones.', criteria: ['acknowledges complexity', 'assigns proportional responsibility', 'is arguable', 'suggests a line of reasoning'] },
        { prompt: 'Write a nuanced thesis on: Should classic literature be replaced with contemporary diverse texts?', model: 'Rather than framing this as an either-or choice, English curricula should pair canonical texts with contemporary diverse voices, using the juxtaposition to illuminate how literary conversations about power, identity, and justice evolve across centuries.', criteria: ['rejects false binary', 'proposes a third path', 'is arguable', 'is specific'] },
      ],
    },
    'multiple-perspectives': {
      items: [
        { prompt: 'For the topic "college admissions should be test-optional," identify three distinct stakeholder perspectives.', model: '1) Students from under-resourced schools who lack test-prep access see test-optional as leveling the playing field. 2) Admissions officers worry about losing a standardized comparison metric across applicants. 3) Testing companies argue their assessments predict college readiness better than grades, which vary by school rigor.', rule: 'A sophisticated argument considers multiple stakeholders, not just "pro" and "con."' },
      ],
    },
    'logical-structure': {
      items: [
        { prompt: 'What is the difference between deductive and inductive reasoning in essays?', model: 'Deductive: Start with a general principle, apply it to specific cases (thesis first, then evidence). Inductive: Start with specific evidence and build toward a general conclusion (evidence first, thesis emerges). Most academic essays are deductive; personal essays are often inductive.', rule: 'Choose a reasoning structure that serves your argument and audience.' },
      ],
    },
    // Research paper
    'research-question': {
      items: [
        { weak: 'What is social media?', strong: 'How do algorithm-driven social media platforms affect the political beliefs of first-time voters aged 18-22?', criteria: ['specific', 'researchable', 'not answered with a simple fact', 'appropriately scoped'] },
        { weak: 'Is climate change bad?', strong: 'To what extent have carbon offset programs reduced measurable emissions in the manufacturing sector since 2020?', criteria: ['specific', 'researchable', 'not answered with a simple fact', 'appropriately scoped'] },
        { weak: 'Tell me about Shakespeare.', strong: 'How do contemporary all-female productions of Shakespeare\'s histories reimagine the plays\' treatment of political power?', criteria: ['specific', 'researchable', 'arguable', 'appropriately scoped'] },
      ],
    },
    'scholarly-sources': {
      items: [
        { prompt: 'What makes a source "scholarly" or "peer-reviewed"?', model: 'A scholarly source is written by experts, published in an academic journal, reviewed by other experts before publication, includes citations, and contributes to ongoing research conversation. Look for databases like JSTOR, PubMed, or Google Scholar.', rule: 'Peer review is the gold standard for academic credibility.' },
        { prompt: 'How many sources should a junior/senior research paper typically use?', model: 'A 10-12 page research paper typically uses 8-15 sources, with a mix of scholarly articles, credible journalistic sources, and primary sources relevant to the topic.', rule: 'More sources isn\'t always better — quality and variety matter.' },
      ],
    },
    'synthesis-of-sources': {
      items: [
        { prompt: 'What is the difference between summarizing sources and synthesizing them?', model: 'Summarizing reports what each source says individually (Source A says X, Source B says Y). Synthesizing identifies patterns, tensions, and connections across sources to build your own argument (While A and B agree that X, they diverge on Y, suggesting Z).', rule: 'Synthesis creates new meaning from the combination of sources.' },
      ],
    },
    'academic-voice': {
      items: [
        { informal: 'This study is super interesting and basically proves that sleep matters a ton.', academic: 'This study provides compelling evidence for the significant role of sleep in cognitive performance.', rule: 'Academic voice avoids slang, qualifies claims, and uses precise vocabulary.' },
        { informal: 'Everyone knows that pollution is bad, but nobody does anything about it.', academic: 'Despite widespread awareness of pollution\'s health consequences, regulatory action has been inconsistent and often insufficient.', rule: 'Replace generalizations ("everyone," "nobody") with specific, defensible claims.' },
      ],
    },
    // AP timed writing
    'time-management': {
      items: [
        { prompt: 'How should you budget 40 minutes for an AP essay?', model: 'Reading/planning: 8-10 minutes. Drafting: 25-28 minutes. Review/revision: 2-5 minutes. The planning phase is critical — a clear outline prevents wasted time during drafting.', rule: 'Never start writing without a plan. A 10-minute outline saves 15 minutes of aimless drafting.' },
      ],
    },
    'thesis-under-pressure': {
      items: [
        { prompt: 'Practice: Write a defensible thesis in 2 minutes for this prompt: "Technology has made life easier." Write an essay that argues your position.', model: 'Although technology has streamlined daily tasks, it has simultaneously created new forms of stress — from information overload to digital surveillance — that complicate any simple narrative of progress.', rule: 'A quick thesis formula: Although [counterargument], [your position] because [reason].' },
        { prompt: 'Practice: Write a thesis in 2 minutes: "Should voting be mandatory?"', model: 'While mandatory voting would increase participation, it would undermine the democratic principle that choosing not to vote is itself a form of political expression.', rule: 'Under time pressure, use the Although/While + position + because structure.' },
      ],
    },
    'evidence-selection': {
      items: [
        { prompt: 'In a timed essay, you remember five pieces of evidence. How do you choose which to use?', model: 'Choose evidence that: 1) most directly supports your thesis, 2) you can analyze in depth (not just mention), 3) comes from different parts of the text or different sources. Quality over quantity: three well-analyzed pieces beat five barely mentioned ones.', rule: 'Under time pressure, depth of analysis matters more than breadth of evidence.' },
      ],
    },
    'timed-drafting': {
      items: [
        { prompt: 'What should you do if you\'re running out of time with 5 minutes left and no conclusion?', model: 'Write a brief 2-3 sentence conclusion that restates your thesis with a "so what" statement. A short conclusion is far better than no conclusion. Do NOT introduce new arguments.', rule: 'A complete essay with a brief conclusion scores better than an incomplete essay with no conclusion.' },
      ],
    },
    // Advanced revision
    'reverse-outline': {
      items: [
        { prompt: 'How do you create a reverse outline?', model: 'After drafting, write one sentence summarizing each paragraph\'s main point. Then check: 1) Does each point clearly support the thesis? 2) Is the order logical? 3) Are there gaps or repetitions? A reverse outline reveals structural problems invisible during drafting.', rule: 'A reverse outline shows what you actually wrote, not what you planned to write.' },
      ],
    },
    'cut-ten-percent': {
      items: [
        { wordy: 'In my personal opinion, I believe that the fact of the matter is that students at this point in time need to be given more opportunities to engage in the process of reading more books.', concise: 'Students need more opportunities to read.', technique: 'Cut: "in my personal opinion," "I believe that," "the fact of the matter is," "at this point in time," "engage in the process of." The meaning is unchanged.' },
        { wordy: 'Due to the fact that there is a lack of funding, the program which was established for the purpose of helping students who are struggling has been eliminated.', concise: 'Because of insufficient funding, the program for struggling students was eliminated.', technique: 'Replace wordy phrases: "due to the fact that" → "because"; "for the purpose of" → "for"; "which was established" → cut.' },
      ],
    },
    'thesis-check': {
      items: [
        { prompt: 'After drafting, you realize your essay argues something different from your thesis. What do you do?', model: 'Revise the THESIS to match the essay, not the other way around. Your best thinking often emerges during drafting. If the essay has evolved, the thesis should reflect the argument you actually made.', rule: 'The thesis serves the essay. If the essay discovered a better argument, update the thesis.' },
      ],
    },
    'evidence-audit': {
      items: [
        { prompt: 'How do you conduct an evidence audit?', model: 'Highlight every claim in one color and every piece of evidence in another. Check: 1) Does every claim have evidence? 2) Does every piece of evidence have analysis? 3) Is any evidence merely decorative (quoted but not analyzed)? Mark gaps and fill them.', rule: 'Claims without evidence are opinions. Evidence without analysis is decoration.' },
      ],
    },
  },
  'grade-12': {
    // Literary analysis advanced
    'interpretive-thesis': {
      items: [
        { prompt: 'Write an AP-level interpretive thesis for Beloved by Toni Morrison.', model: 'In Beloved, Morrison uses the haunting of 124 not merely as supernatural horror but as an embodiment of historical trauma that demands confrontation before healing can begin — suggesting that a nation, like a person, cannot move forward by choosing to forget.', criteria: ['interpretive (not summary)', 'specific to the text', 'arguable', 'accounts for complexity', 'connects to larger significance'] },
        { prompt: 'Write an AP-level thesis for Hamlet.', model: 'Hamlet\'s paralysis is not cowardice but radical skepticism: in a court built on performance and deception, his refusal to act reflects the impossibility of moral certainty in a world where appearance and reality have become indistinguishable.', criteria: ['interpretive', 'specific', 'arguable', 'nuanced', 'accounts for counterargument'] },
      ],
    },
    'craft-analysis': {
      items: [
        { prompt: 'Analyze Morrison\'s craft in this sentence: "124 was spiteful. Full of a baby\'s venom."', model: 'Morrison personifies the house with "spiteful," making the setting a character. The fragment "Full of a baby\'s venom" creates an oxymoron — babies are associated with innocence, venom with malice. This collision of innocence and poison encapsulates the novel\'s central tension: slavery corrupted even the most sacred bonds.', technique: 'Craft analysis examines how word choice, syntax, and figurative language create meaning.' },
        { prompt: 'Why might an author use a sentence fragment deliberately?', model: 'A deliberate fragment creates emphasis through brevity, mimics the rhythm of thought or speech, and draws the reader\'s attention precisely because it violates expectations. The fragment stands alone — isolated, insistent.', technique: 'Understanding intentional rule-breaking distinguishes sophisticated readers from those who only spot "errors."' },
      ],
    },
    'symbolic-reading': {
      items: [
        { prompt: 'What is the difference between a symbol and a motif?', model: 'A symbol is a specific image that represents something beyond itself (the green light = Gatsby\'s dream). A motif is a recurring element — image, phrase, or idea — that develops a theme throughout the work (eyes/sight in Gatsby = perception and moral judgment).', rule: 'Symbols are local; motifs are patterns across the text.' },
        { prompt: 'How do you write about symbolism without being reductive? Avoid: "The green light symbolizes hope."', model: 'Rather than assigning a single meaning, explore the symbol\'s complexity: The green light simultaneously represents Gatsby\'s specific desire for Daisy, the broader allure of the American Dream, and the universal human tendency to idealize what remains out of reach. Its meaning shifts as the novel progresses — from enchantment to obsession to elegy.', rule: 'Symbols are rich because they hold multiple meanings, not just one.' },
      ],
    },
    'critical-lens': {
      items: [
        { prompt: 'Apply a Marxist/economic lens to The Great Gatsby.', model: 'Through a Marxist lens, Gatsby\'s tragedy reveals that the American Dream is a myth designed to maintain class hierarchy. Despite his wealth, Gatsby can never penetrate the old-money elite because class in America is not just economic — it is cultural capital inherited at birth. Daisy\'s voice is "full of money" because she embodies the naturalized privilege that no amount of new wealth can replicate.', rule: 'A critical lens provides a specific vocabulary and set of questions for interpretation.' },
      ],
    },
    // College essay
    'topic-selection': {
      items: [
        { bad_topic: 'My mission trip to Guatemala changed my life.', problem: 'Volunteering abroad is one of the most common essay topics and risks sounding self-congratulatory or savior-like.', better_approach: 'Instead of the trip itself, focus on a small, specific moment that revealed something about yourself — perhaps the discomfort of realizing your help was unwanted, or the conversation that challenged an assumption.' },
        { bad_topic: 'I scored the winning touchdown in the state championship.', problem: 'Athletic victory essays are extremely common and often read as lists of achievements rather than reflections.', better_approach: 'The interesting essay isn\'t about winning — it\'s about what the pressure, preparation, or aftermath revealed about your character. What happened in the quiet moment after everyone stopped cheering?' },
        { bad_topic: 'I want to discuss all five of my extracurricular activities.', problem: 'A resume essay has no narrative arc and tells admissions nothing your activity list doesn\'t already say.', better_approach: 'Pick ONE experience and go deep. Show how it shaped the way you think, not just what you did.' },
      ],
    },
    'authentic-voice': {
      items: [
        { fake: 'Throughout my tenure in secondary education, I have endeavored to cultivate a multifaceted perspective on the human condition.', authentic: 'I didn\'t understand what my teacher meant by "empathy" until the day Marcus shared his lunch with me and I realized no one had done that before.', rule: 'Write like you talk (your best, most thoughtful talking). If you wouldn\'t say it in conversation, don\'t write it in your essay.' },
        { fake: 'As a passionate advocate for social justice, I have always believed in the inherent dignity of every human being.', authentic: 'The first time I saw someone sleeping on the sidewalk outside my school, I stepped over him. I\'ve been thinking about that step ever since.', rule: 'Specificity is authenticity. Grand claims without concrete details sound hollow.' },
      ],
    },
    'show-dont-tell': {
      items: [
        { telling: 'I am a hard worker who never gives up.', showing: 'I rebuilt the robot three times. The first version caught fire. The second fell apart during the qualifier. The third, held together partly by hope and partly by electrical tape, cleared the obstacle course with four seconds to spare.', rule: 'Don\'t declare your qualities — demonstrate them through specific scenes and actions.' },
        { telling: 'My family is very close and we value togetherness.', showing: 'Every Sunday, my grandmother FaceTimes from Oaxaca, and my mother holds the phone over the stove so Abuela can watch the mole simmer, critiquing the consistency from 2,000 miles away.', rule: 'A single vivid scene communicates more than a paragraph of abstract claims.' },
        { telling: 'I am passionate about science.', showing: 'I keep a field notebook in my backpack. Last week I spent my lunch period cataloging the moss species growing in the cracks of the school parking lot.', rule: 'Passion is revealed through behavior, not declaration.' },
      ],
    },
    'personal-insight': {
      items: [
        { surface: 'This experience taught me that hard work pays off.', deeper: 'What I learned wasn\'t that hard work pays off — I already knew that. What surprised me was how much of what I called "hard work" was actually just repetition, and that real growth required the much more uncomfortable act of admitting I was doing it wrong.', rule: 'Push past the first insight to the second, less obvious one. The interesting reflection is never the cliche.' },
        { surface: 'I learned that everyone is different and we should respect diversity.', deeper: 'I realized that "respecting diversity" had been easy when it meant eating different foods and celebrating different holidays. It became hard when it meant sitting with the discomfort of a worldview I genuinely couldn\'t understand — and choosing to stay in the conversation anyway.', rule: 'The best college essays show self-awareness and intellectual honesty, not moral certainty.' },
      ],
    },
    // Personal essay
    'vulnerability-balance': {
      items: [
        { prompt: 'How do you write about difficult experiences without trauma-dumping?', model: 'Focus on your response to the difficulty, not the difficulty itself. The reader needs enough context to understand the situation, but the essay\'s center should be your thinking, growth, or insight — not the graphic details of what happened. You are the subject, not the trauma.', rule: 'You control the narrative. Share what serves the essay\'s purpose, not everything that happened.' },
      ],
    },
    'narrative-arc': {
      items: [
        { prompt: 'What makes a personal essay different from a personal narrative?', model: 'A personal narrative tells a story. A personal essay uses a story (or multiple stories) to explore an idea. The narrative is the vehicle; the insight is the destination. Montaigne didn\'t just describe his experiences — he thought through them on the page.', rule: 'A personal essay is an essay of ideas grounded in personal experience.' },
      ],
    },
    'reflective-depth': {
      items: [
        { shallow: 'Moving to a new city was hard, but I learned to adapt.', deep: 'Moving taught me that "home" is less a place than a set of habits — and that I could rebuild those habits anywhere, though something unnamed is always lost in the translation.', technique: 'Push past the obvious lesson. What did you learn that surprised even you?' },
      ],
    },
    'specificity': {
      items: [
        { vague: 'My mom is a really important person in my life who has taught me a lot.', specific: 'My mother taught me to read a room by the way she could walk into any grocery store and, within thirty seconds, know which cashier would bag the bread on top.', rule: 'One specific, vivid detail communicates more than ten vague superlatives.' },
        { vague: 'I enjoy cooking and find it relaxing.', specific: 'There\'s a particular satisfaction in dicing an onion so fine it becomes translucent, almost liquid — a ten-minute meditation that produces the base of nearly everything worth eating.', rule: 'Specificity makes the reader see what you see and trust that you mean what you say.' },
      ],
    },
    // Senior thesis
    'sustained-argument': {
      items: [
        { prompt: 'What distinguishes a senior thesis from a regular essay?', model: 'A senior thesis sustains an original argument across 15-30+ pages, engages with existing scholarship, contributes a new perspective to an ongoing conversation, and demonstrates the ability to manage complexity over an extended work. It is not a long essay — it is a short piece of scholarship.', rule: 'A thesis is defined by its contribution to a field, not just its length.' },
      ],
    },
    'multi-chapter-structure': {
      items: [
        { prompt: 'How should a senior thesis be organized?', model: 'Introduction (research question, thesis, methodology, roadmap), Literature Review (what scholars have said), Body Chapters (your argument, each with its own sub-thesis), Conclusion (significance, limitations, future directions). Each chapter should be able to stand partly alone while contributing to the whole.', rule: 'Think of chapters as essays that build on each other.' },
      ],
    },
    'original-contribution': {
      items: [
        { prompt: 'What makes a thesis "original"?', model: 'Originality doesn\'t mean no one has ever thought about your topic. It means you bring a new angle: a new text pairing, a new critical lens, a new primary source, or a new interpretation that challenges or extends existing scholarship. Originality is about the argument, not the topic.', rule: 'Stand on the shoulders of existing scholarship, then look somewhere new.' },
      ],
    },
    'defense-preparation': {
      items: [
        { prompt: 'How do you prepare for a thesis defense?', model: 'Anticipate the three hardest questions about your argument and prepare answers. Know the limitations of your thesis and own them. Be ready to explain your methodology. Practice summarizing your argument in 2 minutes. Remember: a defense is a conversation, not an interrogation.', rule: 'The best defense is knowing your argument\'s weaknesses as well as its strengths.' },
      ],
    },
    // AP Lit essays
    'poetry-analysis': {
      items: [
        { prompt: 'What should an AP Lit poetry analysis essay focus on?', model: 'Focus on how poetic elements (imagery, diction, syntax, sound, structure, figurative language) create meaning. The prompt usually asks about a specific theme or effect. Your thesis should make an interpretive claim about what the poem means and how its craft achieves that meaning.', rule: 'AP poetry analysis = WHAT the poem means + HOW the craft creates that meaning.' },
        { prompt: 'Write a thesis for a poem about loss that uses extended metaphor of a garden.', model: 'Through the extended metaphor of a neglected garden, the speaker transforms grief from an internal emotion into a visible, physical decay — suggesting that loss is not an event but an ongoing process of letting go that the living must choose to either tend or abandon.', criteria: ['interpretive', 'addresses craft (metaphor)', 'connects to theme (loss)', 'arguable'] },
      ],
    },
    'prose-analysis': {
      items: [
        { prompt: 'What distinguishes a strong AP prose analysis from a weak one?', model: 'Strong: analyzes specific literary techniques (diction, syntax, point of view, pacing) and explains how they create meaning. Weak: summarizes the plot, lists techniques without analyzing effect, or makes claims without textual evidence. The key verb is "how" — how does the author achieve the effect?', rule: 'Always answer HOW, not just WHAT.' },
      ],
    },
    'open-prompt': {
      items: [
        { prompt: 'How do you choose a text for the AP Lit open prompt?', model: 'Choose a text you know well enough to cite specific scenes, quotes, and details from memory. It should have sufficient "literary merit" (complexity, craft, thematic depth). Novels with rich symbolism, complex characters, and debatable themes work best. Do NOT choose a text you only vaguely remember.', rule: 'Depth of knowledge matters more than impressiveness of title.' },
      ],
    },
    'literary-argument': {
      items: [
        { prompt: 'What is the difference between literary analysis and literary argument?', model: 'Literary analysis interprets how a text works (close reading of craft and meaning). Literary argument takes a position about a text\'s meaning and defends it against alternative interpretations. The AP Lit essay requires both: a defensible interpretive claim supported by close reading.', rule: 'Analysis is the method; argument is the structure.' },
      ],
    },
    // Portfolio reflection
    'growth-narrative': {
      items: [
        { prompt: 'Write a portfolio reflection opening that shows growth as a writer.', model: 'In September, my thesis statements were facts wearing thesis costumes: "Shakespeare uses imagery in Macbeth." By April, I had learned that a thesis is not a description but a dare — an invitation for the reader to disagree. My final thesis, on Morrison\'s use of fragmented chronology as a structural metaphor for trauma, would have been unrecognizable to the writer I was seven months ago.', rule: 'A growth narrative shows specific before-and-after evidence, not vague claims of improvement.' },
      ],
    },
    'self-assessment': {
      items: [
        { prompt: 'What should a portfolio self-assessment include?', model: 'Identify your greatest strength as a writer (with evidence from your portfolio). Identify your most significant area of growth (compare early and late work). Name a persistent challenge you\'re still working on. Set specific goals for college writing.', rule: 'Honest self-assessment demonstrates the metacognition that defines mature writers.' },
      ],
    },
    'goal-setting': {
      items: [
        { vague_goal: 'I want to be a better writer.', specific_goal: 'I want to develop my ability to write analysis that moves beyond identifying literary devices to explaining their cumulative effect on meaning. Specifically, I will practice writing 2-3 sentences of commentary after every piece of evidence in my next five essays.', rule: 'Writing goals should name a specific skill and a concrete action plan.' },
      ],
    },
    'work-selection': {
      items: [
        { prompt: 'How do you choose which pieces to include in a portfolio?', model: 'Include work that demonstrates range (different genres and essay types), growth (an early piece paired with a revised or later version), and your best thinking (the essay you\'re most proud of intellectually, not just the one with the best grade). Include at least one piece that shows significant revision.', rule: 'A portfolio tells the story of your development as a writer.' },
      ],
    },
  },
};

// ── Writing Prompts ──

const WRITING_PROMPTS = {
  'grade-9': {
    'personal-narrative': [
      'Write about a moment when you realized something about yourself that surprised you.',
      'Describe a time when you had to make a difficult choice. Focus on one specific scene.',
      'Write about an object that holds special meaning for you. Show why through a story, not an explanation.',
    ],
    'basic-argument': [
      'Should students be required to take a financial literacy course to graduate? Argue your position.',
      'Is it ethical for schools to monitor students\' social media? Take a position and support it.',
      'Should community service be a graduation requirement? Write an argument with evidence.',
    ],
    'literary-analysis': [
      'Choose a character who changes significantly over the course of a novel. Analyze what drives that change.',
      'How does the setting of a text you\'ve read reflect or influence its central theme?',
      'Analyze how an author uses a specific symbol to develop a theme.',
    ],
  },
  'grade-10': {
    'extended-argument': [
      'Should the United States adopt a four-day school week? Use at least three sources.',
      'To what extent should governments regulate social media companies? Build a multi-source argument.',
      'Is college still worth the cost? Argue with evidence from multiple perspectives.',
    ],
    'comparative-analysis': [
      'Compare how two authors from different eras treat the theme of social class.',
      'Analyze how two texts present different perspectives on the American Dream.',
      'Compare the narrative techniques of two novels you\'ve read this year.',
    ],
    'research-report': [
      'Investigate the effectiveness of restorative justice programs in schools.',
      'Research the impact of artificial intelligence on a career field that interests you.',
      'Examine the history and current state of a social issue in your community.',
    ],
  },
  'grade-11': {
    'rhetorical-analysis': [
      'Analyze the rhetorical strategies in a speech by a contemporary political figure.',
      'How does a specific advertisement use ethos, pathos, and logos to persuade its audience?',
      'Analyze the rhetoric of a published op-ed on a topic you care about.',
    ],
    'synthesis-essay': [
      'Synthesize at least three sources to argue whether technology makes us more or less connected.',
      'Using multiple sources, argue whether cancel culture promotes or undermines accountability.',
      'Synthesize sources to take a position on the role of standardized testing in education.',
    ],
    'research-paper': [
      'Develop an original research question about a topic in your chosen field of interest and write an 8-10 page paper.',
      'Investigate a local issue using primary and secondary sources. Propose evidence-based solutions.',
    ],
    'ap-timed': [
      'AP Argument: Some people argue that competition brings out the best in people. Write an essay that argues your position on this claim.',
      'AP Rhetorical Analysis: Read the provided passage and analyze the rhetorical strategies the author uses to build an argument.',
      'AP Synthesis: Read the provided sources about public spaces and write an essay arguing your position on their importance.',
    ],
  },
  'grade-12': {
    'literary-analysis-advanced': [
      'Analyze how a novelist uses narrative structure (chronology, point of view, fragmentation) to develop a theme.',
      'Through the lens of a critical theory, interpret a major work of literature.',
      'Analyze how an author\'s style (diction, syntax, imagery) creates meaning in a specific passage.',
    ],
    'college-essay': [
      'Common App Prompt 1: Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it.',
      'Common App Prompt 2: The lessons we take from obstacles we encounter can be fundamental to later success.',
      'Common App Prompt 5: Discuss an accomplishment, event, or realization that sparked a period of personal growth.',
      'Common App Prompt 7: Share an essay on any topic of your choice.',
    ],
    'personal-essay': [
      'Write a personal essay exploring a belief you once held strongly but have since reconsidered.',
      'Write about a place that shaped who you are. Use the place as a lens for self-examination.',
    ],
    'ap-lit': [
      'AP Poetry Analysis: Read the following poem and write an essay analyzing how the poet uses literary elements to develop the poem\'s theme.',
      'AP Prose Analysis: Read the following passage and write an essay analyzing how the author uses literary techniques to characterize the protagonist.',
      'AP Open Prompt: Many works of literature feature a character who is alienated from a culture or community. Choose a novel or play and analyze how the character\'s alienation reveals the values of the surrounding society.',
    ],
  },
};

// ── Style Imitation Exercises ──

const STYLE_MODELS = {
  'grade-9': [
    { author: 'Gary Soto', excerpt: 'I knew she had turned to look at me — Loss of confidence led me to believe that I would be tossed to the ground like a sack of corn.', focus: 'simile and physical comedy in memoir', task: 'Write 3 sentences about an embarrassing moment using comparison to something physical and mundane.' },
    { author: 'Sandra Cisneros', excerpt: 'Those who don\'t know any better come into our neighborhood scared.', focus: 'short, declarative sentences with attitude', task: 'Write a paragraph about your neighborhood using short, punchy sentences that reveal a speaker\'s personality.' },
  ],
  'grade-10': [
    { author: 'Joan Didion', excerpt: 'We tell ourselves stories in order to live.', focus: 'aphoristic opening; abstract made concrete', task: 'Write an opening sentence that states a bold claim about human nature, then follow with a specific example.' },
    { author: 'James Baldwin', excerpt: 'Not everything that is faced can be changed, but nothing can be changed until it is faced.', focus: 'parallel structure and paradox', task: 'Write 2-3 sentences about a social issue using parallel structure and a reversal or paradox.' },
  ],
  'grade-11': [
    { author: 'Martin Luther King Jr.', excerpt: 'Injustice anywhere is a threat to justice everywhere.', focus: 'antithesis and moral urgency', task: 'Write a paragraph that builds an argument using at least one antithesis and escalating urgency.' },
    { author: 'George Orwell', excerpt: 'Political language is designed to make lies sound truthful and murder respectable, and to give an appearance of solidity to pure wind.', focus: 'plain style exposing complexity', task: 'Write 3 sentences that use simple, direct language to expose a complicated or hidden truth.' },
  ],
  'grade-12': [
    { author: 'Toni Morrison', excerpt: '124 was spiteful. Full of a baby\'s venom.', focus: 'fragments for emphasis, personification, oxymoron', task: 'Write an opening to a story that personifies a setting and uses a deliberate fragment for impact.' },
    { author: 'Virginia Woolf', excerpt: 'One cannot think well, love well, sleep well, if one has not dined well.', focus: 'cumulative parallel structure building to a surprising conclusion', task: 'Write a sentence that uses parallel structure to build through at least three items toward an unexpected final claim.' },
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
  // Search for the skill across all categories in the grade
  const gradeBank = EXERCISE_BANKS[grade];
  if (!gradeBank) return { error: `No exercise bank for grade ${grade}` };

  const bank = gradeBank[skill];
  if (!bank) return { error: `No exercise bank for ${grade}/${skill}` };

  const items = bank.items;
  if (!items || !items.length) return { error: `Empty exercise bank for ${grade}/${skill}` };

  const selected = pick(items, count);

  // Determine exercise type from item structure
  if (selected[0].wrong !== undefined && selected[0].right !== undefined) {
    return { type: 'fix-it', skill, grade, count: selected.length, instruction: 'Fix the error in this text.', items: selected.map(i => ({ prompt: i.wrong, answer: i.right, rule: i.rule || '' })) };
  }
  if (selected[0].text !== undefined && selected[0].answer !== undefined) {
    return { type: 'identify', skill, grade, count: selected.length, instruction: 'Classify or identify.', items: selected.map(i => ({ prompt: i.text, answer: i.answer, explanation: i.explanation || '' })) };
  }
  if (selected[0].prompt !== undefined && selected[0].options !== undefined) {
    return { type: 'multiple-choice', skill, grade, count: selected.length, instruction: 'Choose the best answer.', items: selected.map(i => ({ prompt: i.prompt, options: i.options, answer: i.answer, rule: i.rule || i.explanation || '' })) };
  }
  if (selected[0].prompt !== undefined && selected[0].answer !== undefined) {
    return { type: 'prompt-response', skill, grade, count: selected.length, instruction: 'Answer the question.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, explanation: i.explanation || i.rule || '' })) };
  }
  if (selected[0].prompt !== undefined && selected[0].model !== undefined) {
    return { type: 'open-ended', skill, grade, count: selected.length, instruction: 'Write your response. A model answer is provided for comparison.', items: selected.map(i => ({ prompt: i.prompt, model: i.model, criteria: i.criteria || [] })) };
  }
  if (selected[0].weak !== undefined && selected[0].strong !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Improve the weak example using the technique described.', items: selected.map(i => ({ prompt: i.weak, answer: i.strong, technique: i.technique || '' })) };
  }
  if (selected[0].passive !== undefined && selected[0].active !== undefined) {
    return { type: 'fix-it', skill, grade, count: selected.length, instruction: 'Rewrite in active voice.', items: selected.map(i => ({ prompt: i.passive, answer: i.active, rule: i.rule || '' })) };
  }
  if (selected[0].vague !== undefined && selected[0].concrete !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Replace vague language with concrete, specific details.', items: selected.map(i => ({ prompt: i.vague, answer: i.concrete, rule: i.rule || '' })) };
  }
  if (selected[0].wordy !== undefined && selected[0].concise !== undefined) {
    return { type: 'fix-it', skill, grade, count: selected.length, instruction: 'Cut the wordiness. Make it concise.', items: selected.map(i => ({ prompt: i.wordy, answer: i.concise, technique: i.technique || '' })) };
  }
  if (selected[0].sentence !== undefined && selected[0].issue !== undefined) {
    return { type: 'fix-it', skill, grade, count: selected.length, instruction: 'Identify the issue and revise.', items: selected.map(i => ({ prompt: i.sentence, issue: i.issue, answer: i.revision || '' })) };
  }
  if (selected[0].informal !== undefined && selected[0].academic !== undefined) {
    return { type: 'fix-it', skill, grade, count: selected.length, instruction: 'Rewrite in academic voice.', items: selected.map(i => ({ prompt: i.informal, answer: i.academic, rule: i.rule || '' })) };
  }
  if (selected[0].boring !== undefined && selected[0].improved !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Improve these sentences.', items: selected.map(i => ({ prompt: i.boring, answer: i.improved, method: i.method || '' })) };
  }
  if (selected[0].telling !== undefined && selected[0].showing !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Rewrite to show, don\'t tell.', items: selected.map(i => ({ prompt: i.telling, answer: i.showing, rule: i.rule || '' })) };
  }
  if (selected[0].fake !== undefined && selected[0].authentic !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Rewrite with an authentic voice.', items: selected.map(i => ({ prompt: i.fake, answer: i.authentic, rule: i.rule || '' })) };
  }
  if (selected[0].unqualified !== undefined && selected[0].qualified !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Add nuance and qualification.', items: selected.map(i => ({ prompt: i.unqualified, answer: i.qualified, technique: i.technique || '' })) };
  }
  if (selected[0].passage !== undefined && selected[0].appeal !== undefined) {
    return { type: 'identify', skill, grade, count: selected.length, instruction: 'Identify the rhetorical appeal (ethos, pathos, or logos).', items: selected.map(i => ({ prompt: i.passage, answer: i.appeal, explanation: i.explanation || '' })) };
  }
  if (selected[0].passage !== undefined && selected[0].strategy !== undefined) {
    return { type: 'identify', skill, grade, count: selected.length, instruction: 'Identify the rhetorical strategy and analyze its effect.', items: selected.map(i => ({ prompt: i.passage, answer: i.strategy, effect: i.effect || '' })) };
  }
  if (selected[0].argument !== undefined && selected[0].fallacy !== undefined) {
    return { type: 'identify', skill, grade, count: selected.length, instruction: 'Identify the logical fallacy.', items: selected.map(i => ({ prompt: i.argument, answer: i.fallacy, explanation: i.explanation || '' })) };
  }
  if (selected[0].source !== undefined && selected[0].credible !== undefined) {
    return { type: 'identify', skill, grade, count: selected.length, instruction: 'Evaluate the source\'s credibility.', items: selected.map(i => ({ prompt: i.source, answer: i.credible, explanation: i.explanation || '' })) };
  }
  if (selected[0].original !== undefined && selected[0].good !== undefined) {
    return { type: 'evaluate', skill, grade, count: selected.length, instruction: 'Identify which paraphrase is better and why.', items: selected.map(i => ({ prompt: i.original, good_example: i.good, bad_example: i.bad, rule: i.rule || '' })) };
  }
  if (selected[0].straw_man !== undefined) {
    return { type: 'fix-it', skill, grade, count: selected.length, instruction: 'Identify the straw man and write a fair version.', items: selected.map(i => ({ prompt: i.straw_man, answer: i.fair_version, rule: i.rule || '' })) };
  }
  if (selected[0].narrative !== undefined && selected[0].problem !== undefined) {
    return { type: 'open-ended', skill, grade, count: selected.length, instruction: 'Read the narrative and improve the reflection.', items: selected.map(i => ({ prompt: `${i.narrative}\n\nProblem: ${i.problem}`, model: i.model })) };
  }
  if (selected[0].draft_issue !== undefined) {
    return { type: 'prompt-response', skill, grade, count: selected.length, instruction: 'Identify the issue and suggest a revision strategy.', items: selected.map(i => ({ prompt: i.draft_issue, answer: i.revision, category: i.category || '' })) };
  }
  if (selected[0].draft_excerpt !== undefined) {
    return { type: 'prompt-response', skill, grade, count: selected.length, instruction: 'Provide peer feedback for this excerpt.', items: selected.map(i => ({ prompt: i.draft_excerpt, answer: i.suggestion, feedback_type: i.feedback_type || '' })) };
  }
  if (selected[0].claim !== undefined && selected[0].evidence !== undefined) {
    return { type: 'open-ended', skill, grade, count: selected.length, instruction: 'Write the warrant connecting claim to evidence.', items: selected.map(i => ({ prompt: `Claim: ${i.claim}\nEvidence: ${i.evidence}\n${i.prompt}`, model: i.model })) };
  }
  if (selected[0].thesis !== undefined && selected[0].prompt !== undefined) {
    return { type: 'open-ended', skill, grade, count: selected.length, instruction: 'Respond to the prompt about this thesis.', items: selected.map(i => ({ prompt: `Thesis: "${i.thesis}"\n${i.prompt}`, model: i.model })) };
  }
  if (selected[0].bad_topic !== undefined) {
    return { type: 'evaluate', skill, grade, count: selected.length, instruction: 'Evaluate the college essay topic.', items: selected.map(i => ({ prompt: i.bad_topic, issue: i.problem, suggestion: i.better_approach })) };
  }
  if (selected[0].surface !== undefined && selected[0].deeper !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Deepen the reflection beyond the surface insight.', items: selected.map(i => ({ prompt: i.surface, answer: i.deeper, rule: i.rule || '' })) };
  }
  if (selected[0].shallow !== undefined && selected[0].deep !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Deepen the reflection.', items: selected.map(i => ({ prompt: i.shallow, answer: i.deep, technique: i.technique || '' })) };
  }
  if (selected[0].vague_goal !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Make the writing goal specific and actionable.', items: selected.map(i => ({ prompt: i.vague_goal, answer: i.specific_goal, rule: i.rule || '' })) };
  }
  if (selected[0].weak !== undefined && selected[0].strong !== undefined && selected[0].criteria) {
    return { type: 'evaluate', skill, grade, count: selected.length, instruction: 'Evaluate and improve.', items: selected.map(i => ({ prompt: i.weak, answer: i.strong, criteria: i.criteria })) };
  }

  // Fallback for any remaining structures
  return { type: 'open-ended', skill, grade, count: selected.length, instruction: 'Complete the exercise.', items: selected };
}

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
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
    const grade = p.grade || 'grade-9';
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
    const grade = p.grade || 'grade-9';
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

  getPrompt(grade, type) {
    const prompts = WRITING_PROMPTS[grade]?.[type];
    if (!prompts) return { error: `No prompts for ${grade}/${type}. Available: ${Object.keys(WRITING_PROMPTS[grade] || {}).join(', ')}` };
    return pick(prompts, 1)[0];
  }

  getStyleModel(grade) {
    const models = STYLE_MODELS[grade];
    if (!models) return { error: `No style models for ${grade}.` };
    return pick(models, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-9';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const style = STYLE_MODELS[grade] ? pick(STYLE_MODELS[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, styleModel: style,
      lessonPlan: {
        warmup: style ? `Study: "${style.excerpt}" (${style.author}) — Focus: ${style.focus}` : 'Free-write for 3 minutes on a topic of your choice.',
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Use this writing skill in a draft or revision exercise.',
        reflect: 'Identify one takeaway and one goal for next session.',
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
        const grade = loadProfile(id).grade || 'grade-9';
        if (skill) { out(wr.generateExercise(grade, skill, 5)); }
        else { const n = wr.getNextSkills(id, 1).next; out(n.length ? wr.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(wr.checkAnswer(type, expected, answer));
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
      case 'prompt': {
        const [, g, type] = args;
        if (!g || !type) throw new Error('Usage: prompt <grade> <type>');
        out({ grade: g, type, prompt: wr.getPrompt(g, type) });
        break;
      }
      default: out({
        usage: 'node writing.js <command> [args]',
        commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-grade', 'prompt'],
        grades: Object.keys(SKILLS),
      });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
