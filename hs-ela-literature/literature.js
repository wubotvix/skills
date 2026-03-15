// eClaw HS ELA Literature Analysis Tutor (9-12). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-ela-literature');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-9': {
    'cite-evidence': ['identify-textual-evidence', 'support-inferences', 'explicit-vs-implicit'],
    'theme-objective-summary': ['determine-theme', 'trace-theme-development', 'objective-summary'],
    'character-development': ['character-traits', 'character-motivation', 'character-interaction'],
    'figurative-connotative': ['simile-metaphor', 'connotation-denotation', 'imagery-sensory'],
    'text-structure': ['plot-structure', 'pacing-tension', 'parallel-plots'],
    'author-pov': ['first-person-third', 'narrator-effect', 'suspense-humor'],
    'compare-source-material': ['adaptation-comparison', 'faithful-vs-departure', 'medium-effects'],
    'compare-themes-topics': ['cross-text-theme', 'genre-approach', 'author-perspective'],
  },
  'grade-10': {
    'cite-strong-evidence': ['strongest-evidence', 'ambiguous-evidence', 'evidence-hierarchy'],
    'theme-analysis': ['central-idea-analysis', 'theme-emergence', 'theme-and-detail'],
    'complex-characters': ['character-arc', 'conflicting-motivations', 'character-foil'],
    'cumulative-word-impact': ['word-choice-tone', 'repeated-imagery', 'diction-shift'],
    'structural-choices': ['scene-structure', 'flashback-foreshadow', 'chapter-purpose'],
    'cultural-pov': ['cultural-lens', 'historical-context', 'perspective-bias'],
    'multimedia-comparison': ['text-vs-film', 'visual-interpretation', 'audio-text-compare'],
    'foundational-texts': ['seminal-document', 'rhetorical-analysis', 'foundational-theme'],
  },
  'grade-11': {
    'cite-thorough-evidence': ['thorough-textual-support', 'unresolved-meaning', 'evidence-limitation'],
    'two-themes-interaction': ['dual-theme-analysis', 'theme-tension', 'theme-synthesis'],
    'author-choices-structure': ['nonlinear-narrative', 'manipulation-of-time', 'structural-innovation'],
    'figurative-language-advanced': ['extended-metaphor', 'symbol-allegory', 'paradox-oxymoron'],
    'beauty-meaning-structure': ['poetic-form-meaning', 'aesthetic-experience', 'sound-sense'],
    'satire-sarcasm-irony': ['identify-satire', 'verbal-dramatic-irony', 'satirical-purpose'],
    'multiple-sources-interpretation': ['critical-perspective', 'divergent-readings', 'synthesis-of-views'],
    'foundational-american': ['american-literary-periods', 'foundational-american-text', 'american-identity-theme'],
  },
  'grade-12': {
    'demonstrate-knowledge': ['sophisticated-evidence', 'nuanced-inference', 'interpretive-claim'],
    'universal-themes': ['archetypal-theme', 'cross-cultural-theme', 'theme-across-periods'],
    'character-complexity': ['psychological-depth', 'moral-ambiguity', 'character-as-symbol'],
    'ambiguity-nuance': ['deliberate-ambiguity', 'multiple-meanings', 'tonal-nuance'],
    'innovative-structure': ['experimental-form', 'genre-blending', 'metafictional-technique'],
    'unreliable-narrator': ['detect-unreliability', 'narrator-motive', 'reader-reconstruction'],
    'critical-lenses': ['formalist-reading', 'feminist-reading', 'postcolonial-reading'],
    'world-literature': ['global-text-analysis', 'translation-interpretation', 'cross-cultural-literary'],
  },
};

// ── Content Banks: Passages & Questions ──

const PASSAGE_BANK = {
  'grade-9': {
    'identify-textual-evidence': {
      items: [
        { passage: 'The old house stood at the end of the lane, its windows dark as closed eyes. No one had entered since the fire, yet footprints appeared each morning in the ash-covered porch. The neighbors whispered, but none dared investigate.', question: 'What textual evidence suggests someone is visiting the house?', answer: 'footprints appeared each morning in the ash-covered porch', skill: 'Locate explicit evidence that supports an inference.', options: ['The windows were dark', 'Footprints appeared each morning in the ash-covered porch', 'No one had entered since the fire', 'The neighbors whispered'] },
        { passage: 'Maria clutched the letter, her knuckles white. She read it three times, each reading slower than the last. When she finally looked up, her eyes were dry but her jaw was set like stone.', question: 'Which detail best shows Maria is determined rather than sad?', answer: 'her jaw was set like stone', skill: 'Select evidence that supports a specific interpretation.', options: ['Her knuckles were white', 'She read it three times', 'Her eyes were dry', 'Her jaw was set like stone'] },
        { passage: 'The forest path narrowed until branches scraped both shoulders. Kai pressed forward, though every instinct screamed retreat. Somewhere ahead, a light flickered — too steady for fireflies, too warm for starlight.', question: 'What evidence shows Kai is acting against his instincts?', answer: 'every instinct screamed retreat', skill: 'Identify evidence of internal conflict.', options: ['The path narrowed', 'Every instinct screamed retreat', 'A light flickered', 'Branches scraped both shoulders'] },
      ],
    },
    'support-inferences': {
      items: [
        { passage: 'James arrived at school twenty minutes early, his shirt pressed, shoes polished. He had reorganized his binder twice the night before and color-coded his notes. Today was the first day anyone from the scholarship committee would observe his class.', question: 'What can you infer about why James prepared so carefully?', answer: 'He wants to impress the scholarship committee', skill: 'Use textual details to support a logical inference.', options: ['He always dresses formally', 'He wants to impress the scholarship committee', 'He enjoys organizing', 'He is nervous about a test'] },
        { passage: 'The café owner placed a steaming bowl in front of the shivering boy without a word. She did not ask for payment. When he looked up, confused, she simply nodded toward the door where rain hammered the glass.', question: 'What can you infer about the café owner?', answer: 'She is compassionate and helps those in need', skill: 'Draw inferences about character from actions.', options: ['She knows the boy personally', 'She is compassionate and helps those in need', 'She wants the boy to leave', 'She forgot to charge him'] },
      ],
    },
    'explicit-vs-implicit': {
      items: [
        { passage: 'The soldier returned home after three years abroad. His mother hugged him at the door. His dog barked twice, then retreated under the porch. The garden he had planted was now a tangle of weeds.', question: 'Which detail is explicit, and which requires inference? The soldier was away for three years (A) vs. things changed significantly in his absence (B).', answer: 'A is explicit; B is implicit', skill: 'Distinguish between stated and implied information.', options: ['Both are explicit', 'Both are implicit', 'A is explicit; B is implicit', 'A is implicit; B is explicit'] },
        { passage: 'Lena set her violin case on the table and flexed her fingers. Red grooves marked each fingertip. She had not eaten since morning, but she smiled — the audition was tomorrow, and the Tchaikovsky was finally ready.', question: 'Is "Lena has been practicing intensely" explicit or implicit?', answer: 'implicit', skill: 'Recognize information conveyed through detail rather than direct statement.', options: ['Explicit', 'Implicit'] },
      ],
    },
    'determine-theme': {
      items: [
        { passage: 'After weeks of isolation, Tomás finally admitted he needed help. His pride had kept him silent, but it was his neighbor\'s quiet offer of a meal that broke through. Sometimes the hardest battles are the ones we fight alone unnecessarily.', question: 'What is the theme of this passage?', answer: 'Accepting help is a form of strength, not weakness', skill: 'Identify the central theme or message.', options: ['Food brings people together', 'Neighbors should mind their own business', 'Accepting help is a form of strength, not weakness', 'Pride is always a positive trait'] },
        { passage: 'The championship trophy gathered dust on the shelf. Coach Rivera told the new team the same thing every season: the trophy means nothing if you cannot remember what you sacrificed to earn it. The real victory was in the work.', question: 'What theme does the coach\'s statement develop?', answer: 'The journey and effort matter more than the reward', skill: 'Trace how theme emerges from dialogue and detail.', options: ['Winning is everything', 'Trophies are meaningless', 'The journey and effort matter more than the reward', 'Coaches are wise'] },
      ],
    },
    'trace-theme-development': {
      items: [
        { passage: 'At first, Amara resented the new city. The noise, the crowds, the unfamiliar food. But month by month, she found herself defending it to visiting relatives. The city had not changed — she had.', question: 'How does the theme of belonging develop across the passage?', answer: 'It shifts from resentment to acceptance, showing that belonging grows through experience', skill: 'Analyze how a theme develops over the course of a text.', options: ['The theme stays constant throughout', 'It shifts from resentment to acceptance, showing belonging grows through experience', 'The city changes to accommodate Amara', 'The theme is about family loyalty'] },
      ],
    },
    'objective-summary': {
      items: [
        { passage: 'The town council voted 5-2 to close the old library, citing budget constraints. Protesters gathered outside, holding signs. The mayor said the decision was "purely financial," but opponents argued the library served as a community lifeline, especially for elderly residents with no internet access.', question: 'Which is the most objective summary?', answer: 'The town council voted to close the library for budget reasons despite community opposition', skill: 'Summarize without inserting personal judgment.', options: ['The cruel town council destroyed a beloved library', 'The town council voted to close the library for budget reasons despite community opposition', 'The mayor made the right financial decision', 'Protesters overreacted to a simple budget cut'] },
      ],
    },
    'character-traits': {
      items: [
        { passage: 'Despite the rain, Elena walked the three miles to deliver the textbooks she had promised. She arrived soaked, smiling, and said only, "A promise is a promise." Her classmates stared, unsure whether to admire or pity her.', question: 'What character trait does Elena most clearly demonstrate?', answer: 'reliability and integrity', skill: 'Identify character traits through actions and dialogue.', options: ['Stubbornness', 'Reliability and integrity', 'Recklessness', 'Desire for attention'] },
        { passage: 'When the younger kids struggled with the science project, Marcus quietly sat beside them and worked through each step. He never announced his help or waited for thanks. He simply showed up, every Tuesday, until they understood.', question: 'What trait does Marcus display?', answer: 'selfless dedication', skill: 'Infer character traits from patterns of behavior.', options: ['Impatience', 'Selfless dedication', 'Academic superiority', 'Loneliness'] },
      ],
    },
    'character-motivation': {
      items: [
        { passage: 'Rosa studied every night until her eyes burned. Her family had pooled their savings for her tuition — her grandmother had sold earrings, her mother worked double shifts. Failure was not an option Rosa could afford.', question: 'What motivates Rosa\'s intense study habits?', answer: 'A sense of obligation to her family\'s sacrifices', skill: 'Identify what drives a character\'s actions.', options: ['Love of learning', 'Fear of her teachers', 'A sense of obligation to her family\'s sacrifices', 'Competition with classmates'] },
      ],
    },
    'character-interaction': {
      items: [
        { passage: 'Jay and Devon sat on opposite ends of the bench. Jay spoke rapidly, filling every silence. Devon answered in single words, arms crossed. When Jay finally asked, "Are we okay?" Devon stood and walked away without looking back.', question: 'How does the interaction between Jay and Devon reveal their relationship?', answer: 'The contrast in communication shows a breakdown in their relationship', skill: 'Analyze how characters\' interactions develop the narrative.', options: ['They are best friends having a normal conversation', 'The contrast in communication shows a breakdown in their relationship', 'Devon is shy and Jay is outgoing', 'They just met for the first time'] },
      ],
    },
    'simile-metaphor': {
      items: [
        { passage: 'The news hit her like a wall of cold water. For a moment she stood frozen, then the shock receded and anger flooded in, a red tide she could not hold back.', question: 'Identify the simile and the metaphor in this passage.', answer: 'Simile: "like a wall of cold water"; Metaphor: anger as "a red tide"', skill: 'Distinguish between simile and metaphor.', options: ['Both are similes', 'Both are metaphors', 'Simile: "like a wall of cold water"; Metaphor: anger as "a red tide"', 'There are no figurative devices'] },
        { passage: 'His words were knives, each one precise and aimed. She wore her composure like armor, though the blows landed just the same.', question: 'What effect do the metaphor and simile create together?', answer: 'They frame the conversation as a battle, showing the violence of emotional conflict', skill: 'Analyze the effect of figurative language.', options: ['They make the passage confusing', 'They frame the conversation as a battle, showing the violence of emotional conflict', 'They suggest the characters are soldiers', 'They add humor to the scene'] },
      ],
    },
    'connotation-denotation': {
      items: [
        { passage: 'The politician was described as "thrifty" by supporters and "cheap" by opponents. Both words denote careful spending, but their connotations create very different impressions.', question: 'What is the difference in connotation between "thrifty" and "cheap"?', answer: '"Thrifty" has a positive connotation of wisdom; "cheap" has a negative connotation of stinginess', skill: 'Analyze how connotation shapes meaning.', options: ['They mean the same thing', '"Thrifty" is positive (wise); "cheap" is negative (stingy)', '"Cheap" is more accurate', 'Both are neutral terms'] },
      ],
    },
    'imagery-sensory': {
      items: [
        { passage: 'The market hummed with voices haggling over baskets of bruised plums and fragrant bread. Sawdust clung to the butcher\'s apron, and somewhere a fiddle played a tune that made old men tap their boots.', question: 'Which senses does the imagery in this passage engage?', answer: 'Sound, sight, smell, and touch', skill: 'Identify sensory imagery and its effect.', options: ['Only sight', 'Sight and sound', 'Sound, sight, smell, and touch', 'All five senses'] },
      ],
    },
    'plot-structure': {
      items: [
        { passage: 'The story begins with the discovery of a letter, builds through a series of misunderstandings, reaches its peak when the truth is revealed at the dinner party, and ends with a quiet reconciliation on the porch the next morning.', question: 'Identify the climax of this plot structure.', answer: 'The truth is revealed at the dinner party', skill: 'Identify elements of plot structure.', options: ['Discovery of the letter', 'The series of misunderstandings', 'The truth revealed at the dinner party', 'The reconciliation on the porch'] },
      ],
    },
    'pacing-tension': {
      items: [
        { passage: 'She opened the door. The hallway was empty. She took one step. Then another. The floorboard groaned. She froze. Somewhere below, a voice murmured. She held her breath and counted to ten.', question: 'How does the author use sentence structure to create tension?', answer: 'Short, fragmented sentences slow the pace and heighten suspense', skill: 'Analyze how pacing creates mood and tension.', options: ['Long flowing sentences create calm', 'Short fragmented sentences slow the pace and heighten suspense', 'The author uses dialogue to build tension', 'Descriptive language creates a relaxed mood'] },
      ],
    },
    'parallel-plots': {
      items: [
        { passage: 'While the detective searched the abandoned warehouse downtown, across the city the suspect was packing a suitcase. Neither knew the other existed — yet. The author cuts between these scenes every other chapter, building toward their inevitable collision.', question: 'What is the effect of the parallel plot structure?', answer: 'It creates dramatic irony and builds anticipation for the characters\' eventual meeting', skill: 'Analyze how parallel plots create meaning.', options: ['It confuses the reader', 'It creates dramatic irony and anticipation for their eventual meeting', 'It slows the story down', 'It shows the detective is more important'] },
      ],
    },
    'first-person-third': {
      items: [
        { passage: 'Version A: "I watched the ship sink and felt nothing. That should have scared me." Version B: "He watched the ship sink and felt nothing. This absence of emotion would later haunt him."', question: 'How does the shift from first to third person change the effect?', answer: 'First person creates immediacy and ambiguity; third person provides distance and foreshadowing', skill: 'Compare effects of different points of view.', options: ['No significant difference', 'First person creates immediacy and ambiguity; third person provides distance and foreshadowing', 'Third person is always better', 'First person provides more information'] },
      ],
    },
    'narrator-effect': {
      items: [
        { passage: 'The child narrator reports: "Mama smiled when the men came, but her hands were shaking behind her back. I thought maybe she was cold, but it was July." The adult reader understands what the child does not.', question: 'What effect does the child narrator create?', answer: 'Dramatic irony — the reader perceives danger the narrator cannot understand', skill: 'Analyze how narrator choice shapes reader experience.', options: ['It makes the scene humorous', 'Dramatic irony — the reader perceives danger the narrator cannot understand', 'It creates confusion', 'It makes the mother seem dishonest'] },
      ],
    },
    'suspense-humor': {
      items: [
        { passage: 'The author writes: "The bomb was set to go off at noon. It was now 11:58. The Senator continued his speech about the importance of punctuality." The juxtaposition creates both tension and dark humor.', question: 'How does the author create both suspense and irony simultaneously?', answer: 'The ticking clock creates suspense while the Senator\'s topic of "punctuality" creates situational irony', skill: 'Analyze how point of view and dramatic irony create complex effects.', options: ['Only suspense is created', 'The ticking clock creates suspense while the Senator\'s topic of "punctuality" creates situational irony', 'Only humor is created', 'The passage is straightforward'] },
      ],
    },
    'adaptation-comparison': {
      items: [
        { passage: 'In the novel, the protagonist\'s decision to leave is described over three agonizing chapters of internal monologue. In the film adaptation, the same decision is conveyed in a single thirty-second shot of her staring at a train ticket.', question: 'How does the change in medium affect the portrayal of the decision?', answer: 'The novel emphasizes internal thought process while the film relies on visual symbolism', skill: 'Compare how different mediums convey the same narrative moment.', options: ['The film version is superior', 'The novel emphasizes internal thought process while the film relies on visual symbolism', 'They convey exactly the same thing', 'The novel version is superior'] },
      ],
    },
    'faithful-vs-departure': {
      items: [
        { passage: 'Shakespeare\'s Romeo and Juliet ends with both lovers dying in the tomb. A modern retelling moves the setting to a high school and allows both characters to survive, choosing separation over death.', question: 'What is the effect of this departure from the source material?', answer: 'It shifts the theme from fate and tragedy to choice and resilience', skill: 'Evaluate how departures from source material create new meaning.', options: ['It ruins the original story', 'It shifts the theme from fate and tragedy to choice and resilience', 'It has no effect on meaning', 'It makes the story less realistic'] },
      ],
    },
    'medium-effects': {
      items: [
        { passage: 'A graphic novel adaptation of a ghost story uses stark black-and-white panels with no dialogue for the haunting scenes. The original short story used elaborate sensory descriptions to create dread.', question: 'How do the different mediums create a similar mood through different techniques?', answer: 'Both create dread — the graphic novel through visual silence and contrast, the story through sensory language', skill: 'Analyze how different mediums achieve similar effects.', options: ['Only the story creates dread', 'Both create dread — the graphic novel through visual silence, the story through sensory language', 'The graphic novel cannot create mood', 'They use identical techniques'] },
      ],
    },
    'cross-text-theme': {
      items: [
        { passage: 'Text A: A folktale where a poor farmer outwits a greedy king through cleverness. Text B: A modern short story where a student exposes corporate fraud through careful research. Both share a common thematic thread.', question: 'What theme do these texts share?', answer: 'Intelligence and perseverance can overcome power and corruption', skill: 'Identify shared themes across different texts.', options: ['Money is the root of evil', 'Intelligence and perseverance can overcome power and corruption', 'Authority figures are always corrupt', 'Rural life is better than urban life'] },
      ],
    },
    'genre-approach': {
      items: [
        { passage: 'A science fiction story explores loneliness through an astronaut stranded on Mars. A realistic novel explores the same loneliness through an elderly widow in a small town. Both reach the same conclusion: connection is a human necessity.', question: 'How does genre affect the approach to the same theme?', answer: 'Sci-fi uses extreme physical isolation as metaphor; realism uses everyday social isolation — both illuminate the same truth', skill: 'Compare how genre shapes thematic exploration.', options: ['Genre has no effect on theme', 'Sci-fi uses extreme physical isolation as metaphor; realism uses everyday social isolation', 'Science fiction is better for exploring loneliness', 'Realistic fiction cannot explore deep themes'] },
      ],
    },
    'author-perspective': {
      items: [
        { passage: 'Author A, writing during wartime, portrays soldiers as tragic heroes. Author B, writing decades later, portrays the same war\'s soldiers as complex, morally compromised individuals. Both draw on the same historical events.', question: 'How does the author\'s historical position affect their perspective?', answer: 'Proximity to events shapes idealization vs. critical distance allows more nuanced portrayal', skill: 'Analyze how context shapes authorial perspective.', options: ['Earlier writers are always more accurate', 'Proximity shapes idealization vs. critical distance allows nuanced portrayal', 'Later writers are always more accurate', 'Historical position has no effect'] },
      ],
    },
  },
  'grade-10': {
    'strongest-evidence': {
      items: [
        { passage: 'The defendant claimed innocence, and three witnesses supported his alibi. However, DNA evidence placed him at the scene, his phone records showed he lied about his location, and security footage captured a figure matching his build entering the building at the time of the crime.', question: 'Which type of evidence is strongest and why?', answer: 'The DNA evidence is strongest because it is physical, objective, and directly links the defendant to the scene', skill: 'Evaluate the relative strength of different types of evidence.', options: ['Witness testimony is strongest because people saw him', 'The DNA evidence is strongest because it is physical, objective, and directly links him to the scene', 'The phone records are strongest because they prove lying', 'All evidence is equally strong'] },
      ],
    },
    'ambiguous-evidence': {
      items: [
        { passage: 'The narrator describes the old woman as "smiling as she watched the children play in the yard that was no longer hers." The house had been sold to pay medical bills. Her family said she was "at peace with it."', question: 'Why is the smile ambiguous evidence of the woman\'s feelings?', answer: 'The smile could indicate genuine peace, masked grief, or resigned acceptance — the evidence supports multiple readings', skill: 'Recognize when evidence supports multiple interpretations.', options: ['The smile clearly shows happiness', 'The smile could indicate genuine peace, masked grief, or resignation — it supports multiple readings', 'The smile is meaningless', 'Her family confirmed she is at peace'] },
      ],
    },
    'evidence-hierarchy': {
      items: [
        { passage: 'A literary critic argues that the green light in The Great Gatsby represents Gatsby\'s hope. Evidence: (1) Gatsby reaches toward it, (2) it is associated with Daisy, (3) it appears at moments of longing, (4) Fitzgerald mentioned "hope" and "green light" in his notes.', question: 'Rank the evidence from strongest to weakest for this interpretation.', answer: 'Author\'s notes (4) > pattern of association with longing (3) > connection to Daisy (2) > physical gesture (1)', skill: 'Organize evidence by analytical strength.', options: ['All equally strong', 'Author notes (4) > pattern of longing (3) > Daisy connection (2) > gesture (1)', 'Gesture (1) is strongest because it is most visible', 'Only the author notes matter'] },
      ],
    },
    'central-idea-analysis': {
      items: [
        { passage: 'The essay argues that public libraries are democracy\'s last free space. The author traces their history from Andrew Carnegie\'s vision through modern budget cuts, showing how each reduction in library funding disproportionately affects marginalized communities who depend on free internet, job resources, and safe gathering spaces.', question: 'What is the central idea and how does the author develop it?', answer: 'Libraries are essential to democracy; developed through historical tracing and evidence of disproportionate impact on marginalized communities', skill: 'Identify the central idea and analyze its development.', options: ['Libraries need more funding', 'Libraries are essential to democracy; developed through history and evidence of impact on marginalized communities', 'Andrew Carnegie was important', 'Budget cuts are always harmful'] },
      ],
    },
    'theme-emergence': {
      items: [
        { passage: 'In the opening chapter, the protagonist trusts everyone. By the midpoint, betrayal has made her suspicious. In the final scene, she extends trust again — but this time with open eyes. The trust is different: informed, chosen, and braver for its scars.', question: 'How does the theme of trust emerge and evolve?', answer: 'Trust moves from naivety to suspicion to informed choice, suggesting that mature trust requires experience with betrayal', skill: 'Trace how a theme emerges and transforms across a narrative.', options: ['Trust is shown as foolish', 'Trust moves from naivety to suspicion to informed choice, suggesting mature trust requires experiencing betrayal', 'The protagonist learns never to trust', 'Trust remains unchanged throughout'] },
      ],
    },
    'theme-and-detail': {
      items: [
        { passage: 'Every room the protagonist enters is described in terms of light: her childhood home is "flooded with gold," the prison is "a gray absence," and the final scene places her in "the honest light of early morning, which hides nothing."', question: 'How do these details develop the theme?', answer: 'The recurring light imagery charts a journey from idealized innocence through darkness to clear-eyed truth', skill: 'Connect specific details to thematic development.', options: ['The author just likes describing light', 'The light imagery charts a journey from idealized innocence through darkness to clear-eyed truth', 'Light represents hope throughout', 'The details are unrelated to theme'] },
      ],
    },
    'character-arc': {
      items: [
        { passage: 'At the start, Dr. Marin dismisses her patients\' fears as irrational. After her own diagnosis, she sits in the same waiting room, hands trembling. In her final scene, she kneels beside a frightened patient and says, "Tell me what scares you. I will listen."', question: 'Describe Dr. Marin\'s character arc.', answer: 'She transforms from dismissive detachment to empathetic understanding through personal suffering', skill: 'Trace a character\'s development across the narrative.', options: ['She becomes a worse doctor', 'She transforms from dismissive detachment to empathetic understanding through personal suffering', 'She stays the same throughout', 'She becomes more clinical'] },
      ],
    },
    'conflicting-motivations': {
      items: [
        { passage: 'The spy loves his country but also the woman on the other side. Each act of loyalty to one is a betrayal of the other. He feeds false intelligence to protect her, knowing it may cost soldiers\' lives. He cannot sleep.', question: 'What conflicting motivations drive the character?', answer: 'Patriotic duty conflicts with personal love, creating an impossible moral dilemma', skill: 'Analyze how conflicting motivations create complexity.', options: ['He is simply a traitor', 'Patriotic duty conflicts with personal love, creating an impossible moral dilemma', 'He has no real motivation', 'He only cares about himself'] },
      ],
    },
    'character-foil': {
      items: [
        { passage: 'While the protagonist labors over every word of her novel for years, her roommate publishes three bestsellers in quick succession, none of which she considers "real art." The protagonist resents the success but cannot stop admiring the fearlessness.', question: 'How does the roommate function as a foil?', answer: 'The roommate\'s prolific fearlessness highlights the protagonist\'s perfectionism and self-doubt', skill: 'Analyze how foil characters illuminate the protagonist.', options: ['The roommate is the real protagonist', 'The roommate\'s prolific fearlessness highlights the protagonist\'s perfectionism and self-doubt', 'They are essentially the same character', 'The roommate exists only for comic relief'] },
      ],
    },
    'word-choice-tone': {
      items: [
        { passage: 'Version A: "The soldiers marched home." Version B: "The soldiers staggered home." Version C: "The soldiers crawled home." Each verb changes the entire emotional landscape of the sentence.', question: 'How does the verb choice shift the tone in each version?', answer: '"Marched" suggests discipline and pride; "staggered" suggests exhaustion; "crawled" suggests defeat and desperation', skill: 'Analyze how individual word choices shape tone.', options: ['All three are interchangeable', '"Marched" = discipline/pride; "staggered" = exhaustion; "crawled" = defeat/desperation', 'Only "marched" is meaningful', 'Verb choice does not affect tone'] },
      ],
    },
    'repeated-imagery': {
      items: [
        { passage: 'Birds appear at every turning point: a caged canary when the protagonist is trapped in her marriage, a hawk circling when she considers escape, and a murmuration of starlings on the day she finally leaves.', question: 'What is the cumulative impact of the bird imagery?', answer: 'The progression from caged to soaring birds mirrors the protagonist\'s journey from confinement to freedom', skill: 'Analyze the cumulative impact of repeated images.', options: ['The author simply likes birds', 'The progression from caged to soaring mirrors the protagonist\'s journey from confinement to freedom', 'Birds symbolize death', 'The imagery is random'] },
      ],
    },
    'diction-shift': {
      items: [
        { passage: 'The first half of the story uses lush, ornate language: "luminescent," "resplendent," "cascading." After the protagonist\'s loss, the prose turns spare: "She sat. She ate. She slept. Days passed."', question: 'What does the shift in diction reflect?', answer: 'The shift from ornate to spare language mirrors the character\'s emotional collapse, as if grief has stripped language of beauty', skill: 'Analyze how diction shifts reflect changes in meaning or mood.', options: ['The author got tired of writing', 'The shift mirrors the character\'s emotional collapse, as if grief stripped language of beauty', 'The second style is objectively better', 'There is no meaningful shift'] },
      ],
    },
    'scene-structure': {
      items: [
        { passage: 'The chapter opens with a peaceful family dinner, interrupts it with a phone call that delivers devastating news, and ends with the family still at the table — the food now cold, no one speaking.', question: 'How does the scene structure create meaning?', answer: 'The frame of the dinner table before and after the call shows how a single moment shatters normalcy', skill: 'Analyze how the structure of a scene contributes to meaning.', options: ['It is standard chronological structure', 'The dinner table frame before and after the call shows how a single moment shatters normalcy', 'The scene is poorly structured', 'The phone call is unimportant'] },
      ],
    },
    'flashback-foreshadow': {
      items: [
        { passage: 'The narrator mentions a scar on his palm in chapter one without explanation. In chapter twelve, a flashback reveals he got it pulling his sister from a frozen lake. In chapter twenty, he grips a rope to save a stranger, the scar burning.', question: 'How do the flashback and foreshadowing work together?', answer: 'The scar foreshadows the flashback and then connects past trauma to present courage, creating a thematic arc about sacrifice', skill: 'Analyze the interplay between flashback and foreshadowing.', options: ['The scar is just a physical detail', 'The scar foreshadows the flashback and connects past trauma to present courage, creating a thematic arc', 'Flashback and foreshadowing are unrelated techniques', 'The author forgot to explain the scar earlier'] },
      ],
    },
    'chapter-purpose': {
      items: [
        { passage: 'Chapter seven abandons the main plot entirely to follow a minor character — the postal worker — for a single day. We see the town through his eyes: the secrets in the letters, the lies told at doorsteps, the loneliness behind every curtain.', question: 'What purpose does this chapter serve in the larger narrative?', answer: 'It provides a panoramic view of the community and reveals hidden truths that recontextualize the main plot', skill: 'Evaluate the purpose of structural choices within a larger work.', options: ['It is filler content', 'It provides a panoramic view of the community and reveals hidden truths that recontextualize the main plot', 'It develops only the postal worker', 'It slows the narrative unnecessarily'] },
      ],
    },
    'cultural-lens': {
      items: [
        { passage: 'In the Japanese novel, the protagonist\'s silence at the dinner table is described as respectful restraint. In the American adaptation, the same silence is reinterpreted as emotional suppression.', question: 'How does cultural context change the interpretation of the same behavior?', answer: 'Cultural values shape meaning: silence reads as respect in one framework and emotional repression in another', skill: 'Analyze how cultural perspective shapes interpretation.', options: ['The interpretations are identical', 'Cultural values shape meaning: silence reads as respect in one framework and repression in another', 'The American version is correct', 'The Japanese version is correct'] },
      ],
    },
    'historical-context': {
      items: [
        { passage: 'Published in 1852, the novel depicts enslaved people escaping north. When first published, it was banned in several Southern states and credited with helping ignite the abolitionist movement. Read today, critics debate its portrayal of race.', question: 'How does historical context affect the reading of this text?', answer: 'Its original context as abolitionist propaganda differs from modern readings that scrutinize its racial representations', skill: 'Analyze how historical context shapes textual meaning.', options: ['Historical context is irrelevant', 'Its original abolitionist context differs from modern readings that scrutinize its racial representations', 'Only the original context matters', 'Only modern readings matter'] },
      ],
    },
    'perspective-bias': {
      items: [
        { passage: 'The colonial-era travel narrative describes the indigenous people as "childlike" and "in need of guidance." The author, a government official, was writing to justify continued colonial rule. His observations served a political purpose.', question: 'How does the author\'s position create bias in the text?', answer: 'His role as a colonial official motivates him to portray indigenous people as dependent, justifying colonial authority', skill: 'Identify how an author\'s position creates perspective and bias.', options: ['The author is objective', 'His colonial official role motivates portraying indigenous people as dependent, justifying colonial authority', 'Travel narratives are always accurate', 'Bias does not affect literature'] },
      ],
    },
    'text-vs-film': {
      items: [
        { passage: 'In the novel, the battle scene is told through the protagonist\'s fragmented thoughts — incomplete sentences, repeated phrases, time jumps. The film uses slow motion, muted sound, and a single sustained close-up of the protagonist\'s face.', question: 'How do the text and film each convey the psychological impact of battle?', answer: 'The text uses linguistic fragmentation to simulate disorientation; the film uses visual and auditory techniques for the same effect', skill: 'Compare how text and film convey psychological states.', options: ['Only the novel can show psychology', 'The text uses linguistic fragmentation; the film uses visual and auditory techniques for the same effect', 'Only the film version is effective', 'They are identical in approach'] },
      ],
    },
    'visual-interpretation': {
      items: [
        { passage: 'A painting inspired by the poem shows the speaker standing at a fork in a road. But the poem never mentions standing still — the speaker says, "I took the one less traveled by." The painting freezes a moment of indecision the poem only implies.', question: 'How does the visual interpretation add to or change the poem\'s meaning?', answer: 'The painting emphasizes the moment of choice and indecision, making explicit what the poem only implies', skill: 'Evaluate how visual interpretations extend or alter textual meaning.', options: ['The painting is inaccurate', 'The painting emphasizes choice and indecision, making explicit what the poem only implies', 'The painting matches the poem exactly', 'Visual art cannot interpret poetry'] },
      ],
    },
    'audio-text-compare': {
      items: [
        { passage: 'Read silently, the poem\'s repeated "s" sounds are a subtle pattern. Heard aloud, the sibilance becomes a hissing undercurrent that transforms the peaceful garden scene into something sinister — the sound of a hidden snake.', question: 'What does the audio experience reveal that silent reading might miss?', answer: 'The audible sibilance creates a sinister undercurrent that makes the sound pattern\'s connection to danger visceral', skill: 'Compare how text and audio experiences create different effects.', options: ['Audio adds nothing', 'The audible sibilance creates a sinister undercurrent that makes the sound-danger connection visceral', 'Silent reading is always better', 'The poem has no sound devices'] },
      ],
    },
    'seminal-document': {
      items: [
        { passage: '"We hold these truths to be self-evident, that all men are created equal." Written in 1776, these words excluded enslaved people, women, and indigenous peoples. Over two centuries, movements have expanded "all men" to mean all people.', question: 'How has the meaning of this foundational text evolved?', answer: 'The original exclusionary meaning has been reinterpreted through social movements to become genuinely inclusive', skill: 'Analyze foundational texts and their evolving significance.', options: ['The meaning has never changed', 'The original exclusionary meaning has been reinterpreted through social movements to become inclusive', 'The original meaning was inclusive', 'The text is no longer relevant'] },
      ],
    },
    'rhetorical-analysis': {
      items: [
        { passage: '"I have a dream that my four little children will one day live in a nation where they will not be judged by the color of their skin but by the content of their character." The speaker uses personal stakes, parallel structure, and moral imperative.', question: 'How do rhetorical strategies strengthen the argument?', answer: 'Personal stakes create empathy, parallel structure creates rhythm and memorability, and moral framing elevates the argument beyond politics', skill: 'Analyze rhetorical strategies in foundational texts.', options: ['The rhetoric is purely decorative', 'Personal stakes create empathy, parallel structure creates memorability, moral framing elevates beyond politics', 'Only the content matters, not the rhetoric', 'The passage uses no rhetorical strategies'] },
      ],
    },
    'foundational-theme': {
      items: [
        { passage: 'Both the ancient Greek concept of hubris and the American ideal of "rugged individualism" deal with the relationship between the individual and limits. Greek tragedy warns against exceeding boundaries; American mythology celebrates it.', question: 'How do these foundational texts treat the theme of individual ambition differently?', answer: 'Greek tradition frames unchecked ambition as destructive (hubris), while American tradition frames it as heroic (individualism)', skill: 'Compare themes across foundational texts from different traditions.', options: ['Both traditions celebrate ambition equally', 'Greek tradition frames unchecked ambition as destructive; American tradition frames it as heroic', 'Both traditions warn against ambition', 'The traditions are unrelated'] },
      ],
    },
  },
  'grade-11': {
    'thorough-textual-support': {
      items: [
        { passage: 'The critic argues that the novel is "fundamentally about silence." Supporting this requires not just the moments characters refuse to speak, but also the narrative gaps, the white space between chapters, and the protagonist\'s job as a librarian — keeper of quiet.', question: 'What makes the textual support "thorough" rather than merely "adequate"?', answer: 'Thorough support draws from multiple levels — dialogue, structure, symbolism, and character detail — not just surface evidence', skill: 'Provide thorough textual evidence from multiple dimensions.', options: ['One strong quote is enough', 'Thorough support draws from multiple levels — dialogue, structure, symbolism, and character detail', 'Only direct quotes count as evidence', 'Paraphrasing is sufficient'] },
      ],
    },
    'unresolved-meaning': {
      items: [
        { passage: 'The story ends with the protagonist walking into fog. Critics disagree: some read it as death, others as freedom, and one argues it represents the author\'s refusal to resolve the colonial allegory. The text supports all three readings.', question: 'How should a reader handle textual evidence that supports multiple, contradictory interpretations?', answer: 'Acknowledge the ambiguity, present the strongest evidence for each reading, and evaluate which interpretation is most supported while noting the text\'s deliberate openness', skill: 'Engage with evidence that resists single interpretation.', options: ['Choose one reading and ignore others', 'Acknowledge ambiguity, present evidence for each reading, and evaluate which is most supported', 'Ambiguity means the text has failed', 'All readings are equally valid regardless of evidence'] },
      ],
    },
    'evidence-limitation': {
      items: [
        { passage: 'A student argues that the author intended the color red to symbolize revolution because "red often symbolizes revolution in literature." However, the text offers no internal evidence for this reading — no revolutionary themes, no political context, no authorial commentary linking color to politics.', question: 'What is the limitation of this evidence?', answer: 'It relies on external convention rather than textual evidence; strong literary arguments require support from within the specific text', skill: 'Recognize the limitations of evidence and avoid overreading.', options: ['The evidence is perfectly valid', 'It relies on external convention rather than textual evidence; strong arguments require support from within the text', 'Symbolism is always universal', 'Author intent does not matter'] },
      ],
    },
    'dual-theme-analysis': {
      items: [
        { passage: 'The novel simultaneously explores the desire for freedom and the need for belonging. The protagonist escapes her restrictive family only to find that independence brings loneliness. The tension between these two themes is never resolved — the novel suggests both are essential.', question: 'How do the two themes interact?', answer: 'Freedom and belonging exist in tension; pursuing one sacrifices the other, and the novel argues both are fundamental human needs', skill: 'Analyze the interaction between two or more themes.', options: ['Freedom wins over belonging', 'Freedom and belonging exist in tension; pursuing one sacrifices the other, and both are fundamental needs', 'The themes do not interact', 'Belonging is more important than freedom'] },
      ],
    },
    'theme-tension': {
      items: [
        { passage: 'The war novel celebrates individual heroism while simultaneously showing that heroic acts cause collateral suffering. The decorated soldier saves his unit but his actions destroy a village. The narrative neither condemns nor praises — it holds both truths.', question: 'How does the thematic tension create complexity?', answer: 'By refusing to resolve whether heroism justifies suffering, the novel forces readers to confront moral ambiguity', skill: 'Analyze how thematic tension creates literary complexity.', options: ['The novel is confused about its message', 'By refusing to resolve whether heroism justifies suffering, it forces readers to confront moral ambiguity', 'Heroism always justifies sacrifice', 'The novel condemns heroism'] },
      ],
    },
    'theme-synthesis': {
      items: [
        { passage: 'A memoir weaves together three threads: the author\'s immigrant experience, her mother\'s recipes, and the history of her homeland\'s civil war. Food becomes the bridge between personal memory and collective trauma, suggesting that culture survives through daily rituals.', question: 'How does the synthesis of themes create meaning greater than any single thread?', answer: 'The synthesis shows that personal identity, cultural memory, and historical trauma are inseparable, connected through everyday practice', skill: 'Analyze how the synthesis of multiple themes generates deeper meaning.', options: ['The themes are unrelated', 'Personal identity, cultural memory, and historical trauma are inseparable, connected through everyday practice', 'Only the immigration theme matters', 'Food is the only real theme'] },
      ],
    },
    'nonlinear-narrative': {
      items: [
        { passage: 'The novel opens with the protagonist\'s funeral, then jumps to her childhood, then to the week before her death, then to her twenties. The reader must assemble the chronology. The effect is that causality becomes a puzzle — was her fate inevitable or the result of specific choices?', question: 'How does the nonlinear structure shape the reader\'s understanding?', answer: 'It forces the reader to actively construct meaning and question whether events are causally linked or merely coincidental', skill: 'Analyze how nonlinear structure shapes interpretation.', options: ['It is confusing for no reason', 'It forces the reader to actively construct meaning and question causality', 'Chronological order is always better', 'The structure has no effect on meaning'] },
      ],
    },
    'manipulation-of-time': {
      items: [
        { passage: 'Ten years pass in a single sentence: "A decade slipped by like water through fingers." Then the next three pages describe a single afternoon in excruciating detail — the afternoon the protagonist\'s daughter asks, "Were you happy before I was born?"', question: 'Why does the author expand and compress time in this way?', answer: 'Compressing a decade shows its insignificance to the protagonist, while expanding one afternoon shows its transformative importance', skill: 'Analyze how manipulation of time creates emphasis and meaning.', options: ['The author lost track of pacing', 'Compressing a decade shows insignificance while expanding one afternoon shows its transformative importance', 'All time should be equally paced', 'The decade was boring'] },
      ],
    },
    'structural-innovation': {
      items: [
        { passage: 'The novel is written as a series of encyclopedia entries about a fictional country. There is no traditional narrator, no plot in the conventional sense. The reader constructs the nation\'s history by reading entries out of alphabetical order, discovering contradictions between entries.', question: 'How does this structural innovation create meaning?', answer: 'The encyclopedia form mirrors how history is constructed — fragmentary, contradictory, shaped by who writes the entries', skill: 'Evaluate how innovative structure creates meaning.', options: ['It is a gimmick with no purpose', 'The encyclopedia form mirrors how history is constructed — fragmentary, contradictory, shaped by who writes it', 'Traditional narrative is always superior', 'The structure prevents meaning'] },
      ],
    },
    'extended-metaphor': {
      items: [
        { passage: 'Throughout the poem, the speaker compares grief to an ocean: first a tsunami that "flattens everything standing," then a persistent tide that "recedes but always returns," and finally "a salt that lives in the blood — invisible, permanent, part of the body now."', question: 'How does the extended metaphor develop across the poem?', answer: 'It evolves from catastrophic to cyclical to internalized, showing how grief transforms from an external force to an intrinsic part of identity', skill: 'Trace the development and effect of an extended metaphor.', options: ['The metaphor stays the same throughout', 'It evolves from catastrophic to cyclical to internalized, showing grief becoming part of identity', 'Ocean metaphors are clichéd', 'The metaphor is only decorative'] },
      ],
    },
    'symbol-allegory': {
      items: [
        { passage: 'In the story, a walled garden is tended by an old man who allows no one else inside. The garden thrives but only he can enjoy it. When he dies, the walls crumble and the garden is open to all — but without his care, the plants begin to wither.', question: 'How does this function as both symbol and allegory?', answer: 'The garden symbolizes beauty/knowledge; as allegory it represents the tension between exclusive preservation and democratic access', skill: 'Distinguish between and analyze symbolism and allegory.', options: ['It is just a story about a garden', 'The garden symbolizes beauty/knowledge; as allegory it represents exclusive preservation vs. democratic access', 'Symbol and allegory are the same thing', 'The garden only represents death'] },
      ],
    },
    'paradox-oxymoron': {
      items: [
        { passage: '"She was cruelly kind, offering the truth no one wanted but everyone needed. Her painful honesty was the gentlest thing she could give." The speaker uses apparent contradictions to capture a complex reality.', question: 'How do the paradox and oxymorons function in this passage?', answer: 'They capture the dual nature of honesty — painful in the moment but ultimately compassionate — which cannot be expressed without contradiction', skill: 'Analyze how paradox and oxymoron convey complex meaning.', options: ['They are logical errors', 'They capture honesty\'s dual nature — painful yet compassionate — which requires contradiction to express', 'They are purely decorative', 'Contradictions always weaken writing'] },
      ],
    },
    'poetic-form-meaning': {
      items: [
        { passage: 'The sonnet about imprisonment follows the strict fourteen-line form with perfect rhyme and meter — the form itself enacts confinement. The final couplet breaks the rhyme scheme, mirroring the speaker\'s imagined escape.', question: 'How does the relationship between form and content create meaning?', answer: 'The rigid form embodies the imprisonment theme, and the broken couplet physically enacts the escape, making form inseparable from meaning', skill: 'Analyze how poetic form reinforces or complicates content.', options: ['Form and content are unrelated', 'The rigid form embodies imprisonment, and the broken couplet enacts escape, making form inseparable from meaning', 'Sonnets always represent imprisonment', 'The broken couplet is an error'] },
      ],
    },
    'aesthetic-experience': {
      items: [
        { passage: 'The passage describes a cathedral ceiling in sentences that grow longer and longer, clause piling upon clause, until the reader\'s breath runs out at the same moment the narrator looks up and gasps. The syntax performs the experience of awe.', question: 'How does the aesthetic experience of reading reinforce the passage\'s meaning?', answer: 'The escalating sentence length physically affects the reader\'s breathing, creating an embodied experience of awe that mirrors the narrator\'s', skill: 'Analyze how the experience of reading creates meaning beyond content.', options: ['Long sentences are always bad writing', 'The escalating sentence length creates an embodied experience of awe mirroring the narrator\'s', 'Only content matters, not form', 'The passage is poorly punctuated'] },
      ],
    },
    'sound-sense': {
      items: [
        { passage: '"The buzz saw snarled and rattled in the yard." Frost\'s harsh consonants (z, s, r, t) create the sound of the saw before the reader even pictures it. The onomatopoeia and cacophony are inseparable from the scene\'s meaning.', question: 'How do sound devices contribute to meaning in this line?', answer: 'The harsh consonant sounds aurally recreate the saw\'s violence, making the reader experience danger through sound before understanding it through content', skill: 'Analyze the interplay between sound and sense in poetry.', options: ['Sound devices are only for rhythm', 'Harsh consonants aurally recreate the saw\'s violence, making the reader experience danger through sound', 'The line has no sound devices', 'Only rhyme matters in poetry'] },
      ],
    },
    'identify-satire': {
      items: [
        { passage: 'The essay praises a new law requiring all citizens to smile in public, describing "smile inspectors" who patrol with "joy meters." Offenders face "mandatory happiness rehabilitation." The author\'s exaggerated enthusiasm reveals the opposite of support.', question: 'How do you identify this as satire?', answer: 'The absurd exaggeration of a "reasonable" premise, the deadpan tone, and the dystopian implications reveal the author is criticizing forced conformity', skill: 'Identify satirical intent and techniques.', options: ['The author genuinely supports the law', 'Absurd exaggeration, deadpan tone, and dystopian implications reveal criticism of forced conformity', 'It is a factual report', 'The author is simply being funny'] },
      ],
    },
    'verbal-dramatic-irony': {
      items: [
        { passage: 'As the Titanic launches, a character declares, "Not even God could sink this ship." The reader, knowing the outcome, experiences the statement differently than the character intends.', question: 'Identify and explain the types of irony operating here.', answer: 'Verbal irony in the character\'s overconfident claim, and dramatic irony because the audience knows the ship will sink', skill: 'Distinguish between verbal and dramatic irony.', options: ['Only verbal irony is present', 'Verbal irony in the overconfident claim, and dramatic irony because the audience knows the ship will sink', 'Only dramatic irony is present', 'There is no irony'] },
      ],
    },
    'satirical-purpose': {
      items: [
        { passage: 'Swift\'s essay proposes selling Irish children as food for the wealthy. The horrifying "modest proposal" exposes how England treated Ireland — as a resource to be consumed. By taking economic logic to its monstrous extreme, Swift indicts the system.', question: 'What is the purpose of Swift\'s satire?', answer: 'To expose and condemn England\'s economic exploitation of Ireland by extending its dehumanizing logic to a horrifying but consistent conclusion', skill: 'Analyze the purpose and target of satire.', options: ['Swift genuinely wants to eat children', 'To expose and condemn England\'s exploitation of Ireland by extending its dehumanizing logic to horrifying conclusion', 'To entertain readers with dark humor', 'To promote vegetarianism'] },
      ],
    },
    'critical-perspective': {
      items: [
        { passage: 'A feminist critic reads the fairy tale as a narrative of female disempowerment: the princess waits passively for rescue. A Marxist critic reads the same tale as class propaganda: royalty is inherently deserving. A psychoanalytic critic sees it as a journey from childhood dependence to adult individuation.', question: 'How do different critical perspectives reveal different meanings in the same text?', answer: 'Each lens foregrounds different elements — gender roles, class dynamics, psychological development — showing the text contains multiple layers of meaning', skill: 'Apply and compare multiple critical perspectives.', options: ['Only one perspective can be correct', 'Each lens foregrounds different elements, showing the text contains multiple layers of meaning', 'Critical theory ruins literature', 'All perspectives say the same thing'] },
      ],
    },
    'divergent-readings': {
      items: [
        { passage: 'Critic A calls the novel "a celebration of individualism." Critic B calls it "a devastating critique of selfish isolation." Both cite the same ending: the protagonist walks alone into the sunset. Their interpretive frameworks determine what the image means.', question: 'How can the same textual evidence support divergent readings?', answer: 'Evidence is interpreted through frameworks; "walking alone" can mean freedom (individualism) or disconnection (isolation) depending on the interpretive lens', skill: 'Analyze how interpretive frameworks shape readings.', options: ['One reading must be wrong', 'Evidence is interpreted through frameworks; "walking alone" can mean freedom or disconnection depending on the lens', 'The ending is meaningless', 'Both critics are wrong'] },
      ],
    },
    'synthesis-of-views': {
      items: [
        { passage: 'Three scholars debate the novel: one emphasizes its colonial critique, another its psychological depth, and a third its linguistic innovation. A synthesis might argue that the experimental language enacts the psychological fragmentation caused by colonial violence — connecting all three readings.', question: 'How does synthesis differ from simply listing multiple perspectives?', answer: 'Synthesis finds connections between perspectives, creating a richer interpretation that shows how language, psychology, and politics interact in the text', skill: 'Synthesize multiple interpretive sources into a coherent analysis.', options: ['Synthesis is just listing views', 'Synthesis finds connections between perspectives, creating richer interpretation showing how elements interact', 'One perspective is always sufficient', 'Perspectives cannot be synthesized'] },
      ],
    },
    'american-literary-periods': {
      items: [
        { passage: 'The Puritan plain style emphasized clarity and spiritual purpose. The Transcendentalists celebrated nature and self-reliance. The Realists stripped away romanticism to show life as it was. The Modernists fragmented form to reflect a fractured world. Each period reacted against the one before.', question: 'What pattern do you observe in the relationship between American literary periods?', answer: 'Each period reacts against its predecessor — spiritual certainty gives way to individualism, which gives way to realism, which gives way to formal experimentation', skill: 'Trace the development of American literary periods.', options: ['All periods are the same', 'Each period reacts against its predecessor in a chain of literary evolution', 'Only Modernism matters', 'The periods are unrelated'] },
      ],
    },
    'foundational-american-text': {
      items: [
        { passage: 'Emerson writes: "Trust thyself: every heart vibrates to that iron string." Thoreau goes to Walden to test this idea. Whitman declares, "I celebrate myself, and sing myself." All three texts build on and extend the same foundational American value.', question: 'What foundational American value do these texts develop?', answer: 'Radical self-reliance and individualism — the belief that the self is a sufficient source of truth and meaning', skill: 'Analyze foundational American texts and their shared values.', options: ['Material success', 'Radical self-reliance and individualism as sources of truth and meaning', 'Religious devotion', 'Community over self'] },
      ],
    },
    'american-identity-theme': {
      items: [
        { passage: 'From the slave narratives of Douglass to the immigrant stories of the twentieth century to contemporary fiction about undocumented Americans, the question persists: who gets to be "American"? Each generation\'s literature redefines the answer.', question: 'How does American literature engage with the theme of American identity?', answer: 'Each era\'s literature challenges and redefines who is included in "American" identity, reflecting evolving struggles for belonging and justice', skill: 'Trace the theme of American identity across literary periods.', options: ['American identity is fixed and settled', 'Each era\'s literature challenges and redefines who is included, reflecting struggles for belonging and justice', 'Only recent literature addresses identity', 'American identity is not a literary theme'] },
      ],
    },
  },
  'grade-12': {
    'sophisticated-evidence': {
      items: [
        { passage: 'A student writes: "The author uses symbolism to show loss." A sophisticated version: "The recurring image of empty chairs — at the dinner table, in the waiting room, facing the window — accumulates until absence itself becomes a character, a presence defined by what is missing."', question: 'What makes the second version a more sophisticated use of evidence?', answer: 'It cites specific instances, traces a pattern, and articulates a paradox (absence as presence), moving beyond identification to analysis', skill: 'Demonstrate sophisticated use of textual evidence.', options: ['Both versions are equally good', 'It cites specific instances, traces a pattern, and articulates a paradox, moving beyond identification to analysis', 'The first version is more concise and therefore better', 'Sophistication is unnecessary'] },
      ],
    },
    'nuanced-inference': {
      items: [
        { passage: 'The protagonist donates anonymously to the orphanage. A simple inference: he is generous. A nuanced inference notes he was an orphan himself, his donation follows a guilty acquittal in court, and he insists on anonymity — suggesting the donation may be motivated by guilt and self-redemption rather than pure altruism.', question: 'What makes the second inference more nuanced?', answer: 'It considers multiple motivations, connects disparate details, and resists the simplest explanation in favor of psychological complexity', skill: 'Draw nuanced inferences that account for complexity.', options: ['Simple inferences are always best', 'It considers multiple motivations, connects disparate details, and resists simplest explanation for complexity', 'The character is simply generous', 'Nuance overcomplicates things'] },
      ],
    },
    'interpretive-claim': {
      items: [
        { passage: 'Weak claim: "The novel is about family." Strong claim: "The novel argues that family is not a shelter from the world\'s violence but its primary transmission mechanism — the place where historical trauma is inherited, disguised as love."', question: 'What makes the second claim interpretive rather than descriptive?', answer: 'It takes a specific, arguable position that requires evidence and analysis, rather than simply identifying a topic', skill: 'Formulate interpretive claims that drive analysis.', options: ['Both are equally good claims', 'It takes a specific, arguable position requiring evidence and analysis rather than just identifying a topic', 'The first is better because it is clear', 'Interpretive claims are opinions, not arguments'] },
      ],
    },
    'archetypal-theme': {
      items: [
        { passage: 'The hero descends into the underworld: Odysseus visits Hades, Dante enters Hell, Marlow travels into the Congo, and a modern protagonist enters a coma. Each journey follows the same archetypal pattern — descent, confrontation with death, and return transformed.', question: 'How does the archetypal descent pattern function across these texts?', answer: 'The katabasis archetype persists because it embodies a universal human experience — confronting mortality and emerging with deeper knowledge', skill: 'Analyze archetypal themes across literary traditions.', options: ['These texts are unrelated', 'The katabasis archetype persists because it embodies confronting mortality and emerging with deeper knowledge', 'Only the ancient versions use this archetype', 'Modern literature has no archetypes'] },
      ],
    },
    'cross-cultural-theme': {
      items: [
        { passage: 'A Japanese novel, a Nigerian novel, and a Russian novel all explore the theme of duty to family versus personal desire. Each culture frames the conflict differently — filial piety, communal responsibility, and spiritual obligation — but the underlying tension is universal.', question: 'How does cross-cultural comparison deepen understanding of a universal theme?', answer: 'It reveals that the tension is fundamental to the human condition while showing how cultural frameworks shape its specific expression', skill: 'Analyze universal themes through cross-cultural comparison.', options: ['Cultural context is irrelevant to universal themes', 'It reveals the tension is fundamental to human condition while cultural frameworks shape its specific expression', 'Only Western literature addresses universal themes', 'Universal themes do not exist'] },
      ],
    },
    'theme-across-periods': {
      items: [
        { passage: 'The Romantic poet saw nature as transcendent and redemptive. The Victorian novelist saw nature as indifferent and Darwinian. The Modernist poet saw nature as a mirror for psychological fragmentation. The contemporary novelist sees nature as endangered and politically charged.', question: 'How does the treatment of nature as a theme evolve across literary periods?', answer: 'Nature shifts from spiritual source to scientific force to psychological mirror to political subject, reflecting each era\'s dominant concerns', skill: 'Trace a theme\'s evolution across literary periods.', options: ['Nature always means the same thing in literature', 'Nature shifts from spiritual source to scientific force to psychological mirror to political subject', 'Only Romantic nature writing matters', 'Modern writers ignore nature'] },
      ],
    },
    'psychological-depth': {
      items: [
        { passage: 'The character insists she has forgiven her father. Yet she flinches at the sound of keys in a door, names her son after a man her father wronged, and tears up his photograph — then tapes it back together. The text reveals what the character cannot admit to herself.', question: 'How does the author create psychological depth?', answer: 'By showing contradictions between stated feelings and unconscious behaviors, revealing the character\'s self-deception and unresolved trauma', skill: 'Analyze the creation of psychological depth in characters.', options: ['The character is simply confused', 'By showing contradictions between stated feelings and unconscious behaviors, revealing self-deception and unresolved trauma', 'The author should have stated her feelings directly', 'Psychology does not belong in literature'] },
      ],
    },
    'moral-ambiguity': {
      items: [
        { passage: 'The protagonist steals medicine to save her dying child. The pharmacist she steals from is a single mother who will lose her business. The novel refuses to tell us who is right. Both women are desperate, both are justified, and both are harmed by the other\'s actions.', question: 'How does moral ambiguity function in this narrative?', answer: 'It prevents easy judgment, forcing the reader to hold competing sympathies and confront the inadequacy of simple moral categories', skill: 'Analyze moral ambiguity as a literary strategy.', options: ['The protagonist is clearly wrong', 'It prevents easy judgment, forcing competing sympathies and confronting the inadequacy of simple moral categories', 'The pharmacist is clearly wrong', 'Moral ambiguity is a flaw in the writing'] },
      ],
    },
    'character-as-symbol': {
      items: [
        { passage: 'The old fisherman in the novella catches nothing for eighty-four days, then hooks a marlin too big to land. He fights it for three days. He is not merely a fisherman — he embodies the human struggle against forces larger than ourselves, and the dignity of endurance.', question: 'How does the character function as both a realistic figure and a symbol?', answer: 'He operates on two levels simultaneously: as a specific, believable fisherman and as a universal symbol of human perseverance against overwhelming odds', skill: 'Analyze characters that function simultaneously as realistic figures and symbols.', options: ['He is only a fisherman', 'He operates as both a specific fisherman and a universal symbol of human perseverance against overwhelming odds', 'He is only a symbol', 'Characters cannot be symbols'] },
      ],
    },
    'deliberate-ambiguity': {
      items: [
        { passage: 'The story\'s final line — "She turned the key and the door opened, or it didn\'t" — refuses to resolve the plot. The author has said in interviews that both endings are "true." The ambiguity is not a failure of craft but its highest expression.', question: 'Why would an author deliberately leave a text ambiguous?', answer: 'Deliberate ambiguity reflects the complexity of lived experience, resists reductive interpretations, and engages the reader as an active meaning-maker', skill: 'Analyze deliberate ambiguity as an artistic choice.', options: ['The author could not decide how to end it', 'Deliberate ambiguity reflects lived complexity, resists reductive interpretations, and engages the reader as meaning-maker', 'Ambiguity is always a flaw', 'The author is being pretentious'] },
      ],
    },
    'multiple-meanings': {
      items: [
        { passage: 'When the character says "I am free," the word "free" operates on at least three levels: she has been released from prison (literal), she has overcome her addiction (psychological), and she has broken from the social expectations that confined her (sociological).', question: 'How does multiplicity of meaning enrich the text?', answer: 'The layered meanings create density — a single word carries literal, psychological, and sociological significance, rewarding multiple readings', skill: 'Analyze how texts generate multiple simultaneous meanings.', options: ['Only the literal meaning matters', 'Layered meanings create density — one word carries literal, psychological, and sociological significance', 'Multiple meanings confuse the reader', 'The author intended only one meaning'] },
      ],
    },
    'tonal-nuance': {
      items: [
        { passage: 'The narrator describes a funeral with clinical precision: "The casket was mahogany, six feet two inches, brass handles, standard model." The detached tone does not indicate indifference — it reveals a grief so overwhelming that emotion has been replaced by factual inventory as a survival mechanism.', question: 'How does tonal nuance create meaning here?', answer: 'The surface tone (clinical detachment) means the opposite of what it seems (extreme emotion), creating a gap the reader must interpret', skill: 'Analyze how tonal nuance conveys meaning beneath the surface.', options: ['The narrator does not care about the death', 'The clinical surface tone means the opposite of what it seems, creating a gap the reader must interpret', 'The tone is straightforward', 'Tone does not carry meaning'] },
      ],
    },
    'experimental-form': {
      items: [
        { passage: 'The novel is told entirely through footnotes to a text that does not exist. The "main text" is absent — the reader only has commentary on something they cannot read. The form enacts the novel\'s theme: we only ever understand others through incomplete, secondhand fragments.', question: 'How does the experimental form enact the novel\'s theme?', answer: 'The absent main text with only footnotes physically enacts the impossibility of direct knowledge — we always interpret through fragments and mediation', skill: 'Analyze how experimental form creates meaning.', options: ['The form is a pointless gimmick', 'The absent text with footnotes enacts the impossibility of direct knowledge — we always interpret through fragments', 'Traditional forms are always better', 'Form and content are unrelated'] },
      ],
    },
    'genre-blending': {
      items: [
        { passage: 'The work combines memoir, recipe, scientific taxonomy, and fiction within a single chapter. The recipes interrupt a scene of grief. The taxonomy classifies types of loneliness as if they were species. Genre boundaries dissolve because the author argues that life does not fit into neat categories.', question: 'What is the effect of genre-blending in this text?', answer: 'Dissolving genre boundaries mirrors the argument that human experience resists categorization, and each genre illuminates the content differently', skill: 'Analyze how genre-blending creates meaning.', options: ['The author cannot pick a genre', 'Dissolving genre boundaries mirrors the argument that experience resists categorization, each genre illuminating differently', 'Genre-blending confuses readers', 'Genres should never be mixed'] },
      ],
    },
    'metafictional-technique': {
      items: [
        { passage: 'The character looks at the reader and says, "You want a happy ending? Fine — she lived happily ever after. But you know that is a lie. Real stories do not end." The narrator breaks the fourth wall to interrogate the conventions of storytelling itself.', question: 'What is the effect of this metafictional technique?', answer: 'It disrupts the fiction to make the reader aware of narrative conventions and question what "truth" in storytelling means', skill: 'Analyze metafictional techniques and their effects.', options: ['It ruins the story\'s illusion for no reason', 'It disrupts the fiction to make the reader aware of narrative conventions and question storytelling truth', 'The character is simply confused', 'Metafiction is not a real technique'] },
      ],
    },
    'detect-unreliability': {
      items: [
        { passage: 'The narrator insists he is "perfectly sane" while describing how he murdered the old man because of his "evil eye." He claims the murder was executed with "wonderful precision" and recounts hiding the body under the floorboards. He hears the dead man\'s heart beating.', question: 'What signals indicate this narrator is unreliable?', answer: 'The insistence on sanity while describing insane behavior, the irrational motive, and the auditory hallucination all signal unreliability', skill: 'Identify signals of narrator unreliability.', options: ['The narrator is perfectly reliable', 'Insistence on sanity during insane acts, irrational motive, and hallucination all signal unreliability', 'Only the hallucination signals unreliability', 'First-person narrators are always reliable'] },
      ],
    },
    'narrator-motive': {
      items: [
        { passage: 'The narrator of the confession addresses a "sympathetic reader" and takes care to present himself favorably. He omits dates, blames others, and describes his crimes with poetic language that aestheticizes violence. He is not confessing — he is performing.', question: 'What motivates this narrator\'s telling?', answer: 'The narrator seeks sympathy and absolution, using rhetorical manipulation to control the reader\'s perception rather than genuinely confessing', skill: 'Analyze the motives behind an unreliable narrator\'s storytelling.', options: ['He wants to tell the truth', 'He seeks sympathy and absolution, using rhetoric to control perception rather than genuinely confessing', 'He has no motive', 'All narrators are equally motivated'] },
      ],
    },
    'reader-reconstruction': {
      items: [
        { passage: 'The narrator says the evening was "pleasant." But we have been told the room was silent, the food untouched, and one guest left in tears. The reader must construct the true story by reading against the narrator\'s version.', question: 'How does the reader reconstruct the truth from an unreliable narrator?', answer: 'By noting contradictions between the narrator\'s claims and the textual details, the reader builds an alternative narrative the narrator tries to suppress', skill: 'Analyze how readers reconstruct meaning from unreliable narration.', options: ['Readers should trust the narrator', 'By noting contradictions between claims and details, the reader builds an alternative narrative the narrator suppresses', 'The narrator is simply mistaken', 'Unreliable narration is always obvious'] },
      ],
    },
    'formalist-reading': {
      items: [
        { passage: 'A formalist reads the poem by examining its structure: the volta occurs at line 9, shifting from natural imagery to death imagery. The rhyme scheme links "breath" with "death" and "bloom" with "doom." The form alone, without historical context, reveals the theme.', question: 'What are the strengths and limitations of a formalist approach?', answer: 'Strengths: precise attention to textual craft; limitations: ignores historical, cultural, and biographical context that may enrich interpretation', skill: 'Apply and evaluate the formalist critical lens.', options: ['Formalism has no limitations', 'Strengths: precise attention to craft; limitations: ignores historical, cultural, and biographical context', 'Formalism is the only valid approach', 'Formalism is entirely worthless'] },
      ],
    },
    'feminist-reading': {
      items: [
        { passage: 'A feminist reading of the fairy tale notices: the princess has no name, she never speaks, her value is defined by beauty, and the "reward" for the hero is her hand in marriage. She is not a character but a prize. The tale reinforces patriarchal structures while appearing innocent.', question: 'How does a feminist lens reveal hidden power structures in the text?', answer: 'It foregrounds the princess\'s silence, objectification, and lack of agency, exposing how the narrative normalizes patriarchal values', skill: 'Apply the feminist critical lens to reveal gender dynamics.', options: ['Fairy tales are harmless', 'It foregrounds silence, objectification, and lack of agency, exposing how the narrative normalizes patriarchal values', 'Feminist readings are biased', 'The princess is happy with her role'] },
      ],
    },
    'postcolonial-reading': {
      items: [
        { passage: 'The adventure novel describes the journey into the "dark continent" where the European hero brings "civilization" to "savage" peoples. A postcolonial reading exposes the racist assumptions embedded in the language: "dark," "savage," and "civilization" all carry ideological weight that justifies colonial violence.', question: 'How does a postcolonial lens interrogate the text\'s language?', answer: 'It reveals how seemingly neutral descriptive language embeds colonial ideology, positioning European culture as superior and indigenous peoples as subhuman', skill: 'Apply the postcolonial critical lens to expose ideological assumptions.', options: ['The language is neutral description', 'It reveals how descriptive language embeds colonial ideology, positioning European culture as superior', 'Postcolonial readings are anachronistic', 'Only modern texts can be read this way'] },
      ],
    },
    'global-text-analysis': {
      items: [
        { passage: 'A Latin American novel uses magical realism to describe political disappearances: the missing are literally erased from photographs, their names vanish from documents, butterflies emerge from their empty chairs. The fantastical elements make the political horror not less but more real.', question: 'How does the literary tradition shape the representation of historical events?', answer: 'Magical realism makes the surreal quality of political violence literal, conveying emotional and political truth that realism alone cannot capture', skill: 'Analyze how literary traditions from around the world create meaning.', options: ['Magical realism is escapist fantasy', 'Magical realism makes political violence\'s surreal quality literal, conveying truth realism alone cannot capture', 'Only realism can represent history accurately', 'The fantastical elements are meaningless'] },
      ],
    },
    'translation-interpretation': {
      items: [
        { passage: 'The Russian word "toska" has no English equivalent — it means a spiritual anguish without cause, a longing with nothing to long for. When translating Chekhov, one translator uses "melancholy," another "anguish," and a third leaves it untranslated. Each choice creates a different text.', question: 'How does translation shape literary interpretation?', answer: 'Translation is interpretation: each word choice reflects the translator\'s reading of the text, and untranslatable words reveal cultural concepts that resist crossing linguistic borders', skill: 'Analyze how translation affects interpretation of world literature.', options: ['Translation does not affect meaning', 'Translation is interpretation: each word choice reflects the translator\'s reading, and untranslatable words reveal cultural gaps', 'Only original-language reading is valid', 'All translations are identical'] },
      ],
    },
    'cross-cultural-literary': {
      items: [
        { passage: 'Comparing a Japanese haiku about cherry blossoms with an English Romantic ode about a nightingale: both use nature to explore impermanence, but the haiku does so in seventeen syllables through restraint and suggestion, while the ode does so in eighty lines through elaboration and argument.', question: 'What does cross-cultural comparison reveal about different literary aesthetics?', answer: 'It reveals that universal themes can be expressed through radically different aesthetic values — restraint vs. elaboration — each equally valid and culturally meaningful', skill: 'Compare literary traditions across cultures.', options: ['One tradition is superior to the other', 'Universal themes can be expressed through radically different aesthetics — restraint vs. elaboration — each equally valid', 'Only Western literature uses nature imagery', 'The traditions cannot be compared'] },
      ],
    },
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

function generateExercise(grade, skill, count = 5) {
  const bank = PASSAGE_BANK[grade]?.[skill];
  if (!bank) return { error: `No exercise bank for ${grade}/${skill}` };
  const items = bank.items;
  if (!items || !items.length) return { error: `Empty exercise bank for ${grade}/${skill}` };
  const selected = pick(items, count);
  return {
    type: 'passage-analysis',
    skill,
    grade,
    count: selected.length,
    instruction: 'Read the passage carefully, then answer the question.',
    items: selected.map(i => ({
      passage: i.passage,
      question: i.question,
      answer: i.answer,
      skill: i.skill || '',
      options: i.options || [],
    })),
  };
}

function generatePassage(grade, skill) {
  const bank = PASSAGE_BANK[grade]?.[skill];
  if (!bank) return { error: `No passage bank for ${grade}/${skill}` };
  const items = bank.items;
  if (!items || !items.length) return { error: `Empty passage bank for ${grade}/${skill}` };
  const item = pick(items, 1)[0];
  return {
    type: 'passage',
    skill,
    grade,
    passage: item.passage,
    question: item.question,
    expectedAnswer: item.answer,
    skillFocus: item.skill || '',
    options: item.options || [],
  };
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

class Literature {
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

  checkAnswer(expected, answer) { return { correct: checkAnswer(expected, answer), expected, studentAnswer: answer }; }

  generatePassage(grade, skill) { return generatePassage(grade, skill); }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-9';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    return {
      studentId: id, grade, targetSkill: target, exercise,
      lessonPlan: {
        warmup: `Read the passage and annotate for key details related to: ${target.category} > ${target.skill}`,
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} passage-analysis items`,
        apply: 'Write a short analytical paragraph using the skill practiced.',
      },
    };
  }
}

module.exports = Literature;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const lit = new Literature();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) lit.setGrade(id, grade);
        out({ action: 'start', profile: lit.getProfile(id), nextSkills: lit.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(lit.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'grade-9';
        if (skill) { out(lit.generateExercise(grade, skill, 5)); }
        else { const n = lit.getNextSkills(id, 1).next; out(n.length ? lit.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, expected, answer] = args;
        if (expected === undefined || answer === undefined) throw new Error('Usage: check <expected> <answer>');
        out(lit.checkAnswer(expected, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(lit.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(lit.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(lit.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(lit.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? lit.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(lit.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(lit.setGrade(id, g)); break; }
      case 'passage': { const [, g, sk] = args; if (!g || !sk) throw new Error('Usage: passage <grade> <skill>'); out(lit.generatePassage(g, sk)); break; }
      default: out({ usage: 'node literature.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','passage'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
