// College ELA Creative Writing Lab (Intro-Advanced). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-ela-creative-writing');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'intro': {
    'fiction': ['showing-vs-telling', 'pov-basics'],
    'poetry': ['image-metaphor'],
    'creative-nonfiction': ['personal-essay'],
    'craft-elements': ['basic-forms'],
  },
  'intermediate': {
    'fiction': ['plot-structure', 'character-dev'],
    'poetry': ['sonnet-villanelle'],
    'creative-nonfiction': ['memoir-techniques'],
    'craft-elements': ['workshop-critique'],
  },
  'advanced': {
    'fiction': ['experimental-fiction'],
    'poetry': ['prose-poetry'],
    'creative-nonfiction': ['genre-blending'],
    'craft-elements': ['mfa-portfolio'],
  },
};

const ITEM_BANKS = {
  'intro': {
    'showing-vs-telling': {
      type: 'craft-id', instruction: 'Read the passage and identify whether the writer is showing or telling.',
      items: [
        { passage: 'She was very sad about losing her dog.', question: 'Is this showing or telling?', answer: 'Telling — it names the emotion directly', options: ['Telling — it names the emotion directly', 'Showing — it uses sensory detail', 'Both equally', 'Neither'] },
        { passage: 'Her hands trembled as she folded the empty leash and placed it in the drawer, unable to look at the water bowl still sitting by the door.', question: 'Is this showing or telling?', answer: 'Showing — it conveys emotion through action and detail', options: ['Showing — it conveys emotion through action and detail', 'Telling — it states the emotion', 'Both equally', 'Neither'] },
        { passage: 'The old house was creepy and made everyone uncomfortable.', question: 'Is this showing or telling?', answer: 'Telling — it labels the atmosphere rather than evoking it', options: ['Telling — it labels the atmosphere rather than evoking it', 'Showing — it builds atmosphere', 'A mix of both', 'Neither'] },
        { passage: 'Cobwebs draped the banister like funeral lace, and every step on the staircase answered with a groan that seemed to come from somewhere beneath the wood.', question: 'Is this showing or telling?', answer: 'Showing — it uses imagery and figurative language to evoke atmosphere', options: ['Showing — it uses imagery and figurative language to evoke atmosphere', 'Telling — it states the mood', 'Both equally', 'Neither'] },
        { passage: 'He was angry. He hated everything about the situation.', question: 'What technique is this?', answer: 'Telling — directly naming emotions without dramatizing them', options: ['Telling — directly naming emotions without dramatizing them', 'Showing through internal monologue', 'Effective minimalism', 'Stream of consciousness'] },
        { passage: 'He slammed the door so hard the picture frames rattled on the wall. Outside, he kicked the recycling bin into the street and stood there, chest heaving, staring at nothing.', question: 'What technique is this?', answer: 'Showing — conveying anger through physical action', options: ['Showing — conveying anger through physical action', 'Telling with added detail', 'Objective narration only', 'Purple prose'] },
      ],
    },
    'pov-basics': {
      type: 'craft-id', instruction: 'Read the passage and identify the point of view.',
      items: [
        { passage: 'I walked into the room and immediately regretted it. The smell hit me first — burnt coffee and something chemical.', question: 'What point of view is this?', answer: 'First person', options: ['First person', 'Second person', 'Third person limited', 'Third person omniscient'] },
        { passage: 'You open the door and step inside. The fluorescent lights buzz overhead, and you notice a stain on the carpet that wasn\'t there yesterday.', question: 'What point of view is this?', answer: 'Second person', options: ['Second person', 'First person', 'Third person limited', 'Third person omniscient'] },
        { passage: 'Elena watched the train pull away. She wondered if she would ever see him again, but she couldn\'t bring herself to wave.', question: 'What point of view is this?', answer: 'Third person limited', options: ['Third person limited', 'Third person omniscient', 'First person', 'Second person'] },
        { passage: 'Elena watched the train pull away, wondering if she would see him again. Inside the train, Marco pressed his forehead against the glass, already composing the letter he would never send.', question: 'What point of view is this?', answer: 'Third person omniscient — access to multiple characters\' thoughts', options: ['Third person omniscient — access to multiple characters\' thoughts', 'Third person limited', 'First person plural', 'Second person'] },
        { passage: 'We moved through the hallways like a school of fish — together, silent, aware of every ripple.', question: 'What point of view is this?', answer: 'First person plural', options: ['First person plural', 'Second person', 'Third person omniscient', 'Third person limited'] },
        { passage: 'The man entered the diner and ordered coffee. He drank it in three swallows and left a five-dollar bill on the counter. He did not speak to anyone.', question: 'What point of view is this?', answer: 'Third person objective — no access to internal thoughts', options: ['Third person objective — no access to internal thoughts', 'Third person limited', 'Third person omniscient', 'First person'] },
      ],
    },
    'image-metaphor': {
      type: 'craft-id', instruction: 'Read the passage and identify the figurative language technique.',
      items: [
        { passage: 'The moon was a bone-white coin tossed onto black velvet.', question: 'What technique is used?', answer: 'Metaphor', options: ['Metaphor', 'Simile', 'Personification', 'Synecdoche'] },
        { passage: 'Her voice sounded like gravel poured slowly into a tin bucket.', question: 'What technique is used?', answer: 'Simile', options: ['Simile', 'Metaphor', 'Hyperbole', 'Onomatopoeia'] },
        { passage: 'The wind whispered through the alley, nudging a newspaper along the gutter like a patient teacher guiding a reluctant student.', question: 'What techniques are combined here?', answer: 'Personification and simile', options: ['Personification and simile', 'Metaphor only', 'Alliteration only', 'Hyperbole and irony'] },
        { passage: 'All the world\'s a stage, / And all the men and women merely players.', question: 'What technique is this?', answer: 'Extended metaphor (conceit)', options: ['Extended metaphor (conceit)', 'Simile', 'Allegory', 'Personification'] },
        { passage: 'The red wheelbarrow. The white chickens. Rain. That is all.', question: 'What poetic principle does this evoke?', answer: 'Imagism — concrete images without abstraction', options: ['Imagism — concrete images without abstraction', 'Surrealism', 'Romanticism', 'Confessionalism'] },
        { passage: 'He drowned in paperwork every evening, surfacing only for cold coffee.', question: 'What technique is used?', answer: 'Dead metaphor revived through extension', options: ['Dead metaphor revived through extension', 'Simile', 'Literal description', 'Synecdoche'] },
      ],
    },
    'basic-forms': {
      type: 'form-match', instruction: 'Match the description to the correct creative writing form.',
      items: [
        { prompt: 'A prose narrative typically under 1,000 words that focuses on a single moment or image.', answer: 'Flash fiction', options: ['Flash fiction', 'Novella', 'Prose poem', 'Personal essay'] },
        { prompt: 'A 14-line poem with a specific rhyme scheme and a turn (volta).', answer: 'Sonnet', options: ['Sonnet', 'Villanelle', 'Haiku', 'Ballad'] },
        { prompt: 'A nonfiction work that uses literary techniques — scene, dialogue, imagery — to tell a true story.', answer: 'Creative nonfiction / literary nonfiction', options: ['Creative nonfiction / literary nonfiction', 'Journalism', 'Academic essay', 'Autobiography'] },
        { prompt: 'A short prose piece that uses poetic devices (rhythm, imagery, compression) but is not lineated.', answer: 'Prose poem', options: ['Prose poem', 'Flash fiction', 'Free verse poem', 'Vignette'] },
        { prompt: 'A Japanese poetic form: three lines of 5, 7, and 5 syllables capturing a moment in nature.', answer: 'Haiku', options: ['Haiku', 'Tanka', 'Sonnet', 'Limerick'] },
        { prompt: 'A long narrative poem that tells the story of a hero\'s journey, often invoking a muse.', answer: 'Epic', options: ['Epic', 'Ballad', 'Ode', 'Elegy'] },
      ],
    },
    'personal-essay': {
      type: 'craft-id', instruction: 'Read the passage and identify the personal essay technique.',
      items: [
        { passage: 'I was eleven when I learned that silence could be louder than shouting. My father sat at the kitchen table, turning his wedding ring, and said nothing for what felt like a year.', question: 'What technique opens this essay?', answer: 'A specific scene grounded in a precise age and sensory detail', options: ['A specific scene grounded in a precise age and sensory detail', 'A thesis statement', 'An abstract reflection', 'A definition'] },
        { passage: 'The braided essay weaves together two or more seemingly unrelated strands — a personal story and a historical event, for instance — until their connection becomes clear.', question: 'What structure is described?', answer: 'Braided or hermit crab essay', options: ['Braided or hermit crab essay', 'Five-paragraph essay', 'Chronological narrative', 'Argumentative essay'] },
        { passage: 'What I mean is — I don\'t actually know what I mean yet. That\'s why I\'m writing this. The essay is the act of figuring it out.', question: 'What does this passage illustrate about the essay form?', answer: 'The essay as exploration — thinking on the page', options: ['The essay as exploration — thinking on the page', 'Poor planning', 'Stream of consciousness fiction', 'Academic uncertainty'] },
        { passage: 'My grandmother\'s kitchen smelled of cumin and kerosene. I return to that kitchen in every essay I write, though I am no longer sure the memories are accurate.', question: 'What tension does the writer acknowledge?', answer: 'The gap between memory and truth in nonfiction', options: ['The gap between memory and truth in nonfiction', 'Unreliable narration in fiction', 'A factual error', 'Nostalgia without purpose'] },
        { passage: 'After two pages about my mother\'s garden, I realize this essay is not about gardening. It is about control — who gets to decide what grows and what gets pulled.', question: 'What move does the writer make?', answer: 'The reflective turn — discovering the essay\'s deeper subject', options: ['The reflective turn — discovering the essay\'s deeper subject', 'A thesis statement', 'A plot twist', 'A counterargument'] },
        { passage: 'Montaigne wrote: "I am myself the matter of my book." The personal essayist uses the self not as the subject, but as the lens through which a larger question refracts.', question: 'What principle is being articulated?', answer: 'The self as lens, not as subject', options: ['The self as lens, not as subject', 'Autobiography is the only goal', 'The writer should be invisible', 'Essays must be objective'] },
      ],
    },
  },
  'intermediate': {
    'plot-structure': {
      type: 'craft-id', instruction: 'Read the passage and identify the element of plot structure.',
      items: [
        { passage: 'The story opens in a quiet village where nothing has changed for decades. We learn the routines of the main character, her job at the post office, her evening walks.', question: 'What part of plot structure is this?', answer: 'Exposition — establishing setting, character, and status quo', options: ['Exposition — establishing setting, character, and status quo', 'Rising action', 'Climax', 'Denouement'] },
        { passage: 'Then a stranger arrives on the 4:15 train with a suitcase full of letters addressed to people who died years ago.', question: 'What part of plot structure is this?', answer: 'Inciting incident — disrupting the status quo', options: ['Inciting incident — disrupting the status quo', 'Climax', 'Falling action', 'Exposition'] },
        { passage: 'She confronts him at the bridge. The river roars below. He holds out the last letter — it is addressed to her.', question: 'What part of plot structure is this?', answer: 'Climax — the moment of highest tension and confrontation', options: ['Climax — the moment of highest tension and confrontation', 'Inciting incident', 'Rising action', 'Resolution'] },
        { passage: 'In medias res: "The gun was already on the table when I walked in." The story opens in the middle of the action and fills in context later.', question: 'What structural technique is this?', answer: 'In medias res — beginning in the middle of events', options: ['In medias res — beginning in the middle of events', 'Flashback', 'Frame narrative', 'Chronological exposition'] },
        { passage: 'A writer structures a story so the final scene mirrors the opening scene, but the meaning has shifted because of everything that happened between.', question: 'What structural device is this?', answer: 'Circular or bookend structure', options: ['Circular or bookend structure', 'Linear plot', 'Episodic structure', 'Cliffhanger'] },
        { passage: 'Freytag\'s pyramid maps a five-act structure: exposition, rising action, climax, falling action, and denouement.', question: 'What is this model?', answer: 'Freytag\'s dramatic arc', options: ['Freytag\'s dramatic arc', 'The hero\'s journey', 'Three-act structure', 'Kishōtenketsu'] },
      ],
    },
    'character-dev': {
      type: 'craft-id', instruction: 'Read the passage and identify the character development technique.',
      items: [
        { passage: 'She said she was fine with the promotion going to someone else. But that night she sat in the parking lot for forty minutes, gripping the steering wheel, engine off.', question: 'What technique reveals character here?', answer: 'Contradiction between dialogue and action', options: ['Contradiction between dialogue and action', 'Direct characterization', 'Backstory exposition', 'Authorial commentary'] },
        { passage: '"Marcus was a kind man, generous to a fault, though he\'d never been able to forgive his brother."', question: 'What type of characterization is this?', answer: 'Direct characterization — the narrator tells us his traits', options: ['Direct characterization — the narrator tells us his traits', 'Indirect characterization', 'Dialogue-based characterization', 'Action-based characterization'] },
        { passage: 'She always ordered for other people at restaurants. She chose their drinks, suggested their desserts, and once sent back a dish on a friend\'s behalf without being asked.', question: 'What does this habitual action reveal?', answer: 'A controlling personality shown through indirect characterization', options: ['A controlling personality shown through indirect characterization', 'Generosity', 'Social anxiety', 'Nothing significant'] },
        { passage: 'At the start of the novel, he cannot look anyone in the eye. By the final chapter, he is giving a speech to three hundred people.', question: 'What is this an example of?', answer: 'Character arc — transformation over the course of the narrative', options: ['Character arc — transformation over the course of the narrative', 'Flat character', 'Static character', 'Stock character'] },
        { passage: 'A round character in E.M. Forster\'s terms is one who surprises convincingly — complex enough to behave in unexpected yet believable ways.', question: 'What concept is being described?', answer: 'Round character — complex and capable of surprise', options: ['Round character — complex and capable of surprise', 'Flat character', 'Archetype', 'Foil'] },
        { passage: 'The author gives the villain a scene where he feeds a stray cat and hums a lullaby his mother used to sing.', question: 'What technique is the author using?', answer: 'Humanizing the antagonist through vulnerability', options: ['Humanizing the antagonist through vulnerability', 'Making the villain sympathetic to confuse the reader', 'Comic relief', 'Foreshadowing'] },
      ],
    },
    'sonnet-villanelle': {
      type: 'form-match', instruction: 'Identify the poetic form or formal element described.',
      items: [
        { prompt: 'A poem of 19 lines using two repeating refrains and a strict ABA rhyme scheme across five tercets and a final quatrain.', answer: 'Villanelle', options: ['Villanelle', 'Sonnet', 'Sestina', 'Pantoum'] },
        { prompt: 'Three quatrains and a couplet, rhyming ABAB CDCD EFEF GG, with a volta often at line 9 or the couplet.', answer: 'Shakespearean (English) sonnet', options: ['Shakespearean (English) sonnet', 'Petrarchan sonnet', 'Spenserian sonnet', 'Villanelle'] },
        { prompt: 'An octave (ABBAABBA) and a sestet (CDCDCD or CDECDE), with the volta between the eighth and ninth lines.', answer: 'Petrarchan (Italian) sonnet', options: ['Petrarchan (Italian) sonnet', 'Shakespearean sonnet', 'Villanelle', 'Ballad'] },
        { prompt: '"Do not go gentle into that good night" repeats two lines — the first and third lines of the opening tercet — throughout the poem.', answer: 'Villanelle — Dylan Thomas\'s most famous example', options: ['Villanelle — Dylan Thomas\'s most famous example', 'Sonnet', 'Ghazal', 'Rondeau'] },
        { prompt: 'Iambic pentameter: five metrical feet of unstressed-stressed syllables per line, the backbone of English formal verse.', answer: 'Iambic pentameter', options: ['Iambic pentameter', 'Trochaic tetrameter', 'Anapestic trimeter', 'Free verse'] },
        { prompt: 'A turn or shift in argument, mood, or perspective within a poem — essential to the sonnet form.', answer: 'Volta', options: ['Volta', 'Caesura', 'Enjambment', 'Refrain'] },
      ],
    },
    'memoir-techniques': {
      type: 'craft-id', instruction: 'Read the passage and identify the memoir technique.',
      items: [
        { passage: 'The memoirist recreates a scene from childhood — complete with dialogue, sensory detail, and pacing — even though the exact words spoken decades ago cannot be remembered.', question: 'What technique is this?', answer: 'Reconstructed scene — dramatizing memory with acknowledged invention', options: ['Reconstructed scene — dramatizing memory with acknowledged invention', 'Fiction disguised as memoir', 'Journalistic reporting', 'Oral history'] },
        { passage: 'Between scenes of her father\'s illness, the writer inserts research about the history of the hospital where he was treated.', question: 'What technique is this?', answer: 'Layering personal narrative with research or historical context', options: ['Layering personal narrative with research or historical context', 'Digression', 'Padding', 'Academic writing'] },
        { passage: '"I want to tell you my mother was brave. But the truth is more complicated. She was afraid every day, and her courage was in getting up anyway."', question: 'What move does the memoirist make?', answer: 'Complicating the initial impulse — resisting a simple narrative', options: ['Complicating the initial impulse — resisting a simple narrative', 'Contradicting themselves', 'Lying', 'Being vague'] },
        { passage: 'The writer addresses her younger self directly: "You don\'t know it yet, but this is the last summer you\'ll spend in that house."', question: 'What technique is this?', answer: 'Retrospective address — the present self speaking to the past self', options: ['Retrospective address — the present self speaking to the past self', 'Second-person fiction', 'Apostrophe to the reader', 'Foreshadowing in fiction'] },
        { passage: 'She writes: "My sister remembers this differently. She says the dog was brown, not black, and that it was Tuesday. I have kept my version."', question: 'What does this passage address?', answer: 'The subjectivity of memory and competing family narratives', options: ['The subjectivity of memory and competing family narratives', 'A factual error', 'Unreliable narration in fiction', 'Poor research'] },
        { passage: 'The memoir uses white space and section breaks to jump between decades, trusting the reader to make connections across the gaps.', question: 'What structural technique is this?', answer: 'Fragmented or collage structure with intentional gaps', options: ['Fragmented or collage structure with intentional gaps', 'Poor organization', 'Stream of consciousness', 'Chronological narrative'] },
      ],
    },
    'workshop-critique': {
      type: 'revision-exercise', instruction: 'Identify the workshop feedback principle or revision strategy.',
      items: [
        { passage: 'A workshop participant says: "I loved it. It was really good. I don\'t have any criticism."', question: 'What is the problem with this feedback?', answer: 'It is not actionable — good critique identifies specific strengths and areas for development', options: ['It is not actionable — good critique identifies specific strengths and areas for development', 'It is too harsh', 'It is perfect feedback', 'It is sarcastic'] },
        { passage: 'The Liz Lerman Critical Response Process begins by asking the writer what questions they have about their own work, before the group offers observations.', question: 'Why start with the writer\'s questions?', answer: 'It centers the writer\'s agency and directs feedback where it is most needed', options: ['It centers the writer\'s agency and directs feedback where it is most needed', 'It wastes time', 'It prevents all criticism', 'It is a formality'] },
        { passage: 'A critiquer writes: "The pacing in section two drags because the dialogue exchanges are too evenly spaced. Consider varying the rhythm — one long speech, then a quick exchange."', question: 'Why is this effective feedback?', answer: 'It identifies a specific problem, explains why, and suggests a concrete revision', options: ['It identifies a specific problem, explains why, and suggests a concrete revision', 'It rewrites the author\'s work', 'It is too vague', 'It only praises'] },
        { passage: 'A writer receives conflicting feedback: one reader wants more backstory, another wants less. Both cannot be right.', question: 'How should the writer respond?', answer: 'Look for the underlying issue both readers sense — the current backstory may be poorly placed rather than too much or too little', options: ['Look for the underlying issue both readers sense — the current backstory may be poorly placed rather than too much or too little', 'Follow the majority', 'Ignore all feedback', 'Abandon the piece'] },
        { passage: '"Murder your darlings" is advice attributed to various writers. It means being willing to cut a beautiful sentence or passage if it does not serve the whole.', question: 'What revision principle is this?', answer: 'Cutting material that is good in isolation but weakens the larger work', options: ['Cutting material that is good in isolation but weakens the larger work', 'Deleting all figurative language', 'Writing shorter sentences', 'Removing all adjectives'] },
        { passage: 'During revision, the writer reads the draft aloud and marks every place where she stumbles or runs out of breath.', question: 'What is this revision technique testing?', answer: 'Prose rhythm, sentence length, and syntactic clarity', options: ['Prose rhythm, sentence length, and syntactic clarity', 'Spelling errors only', 'Plot holes', 'Character consistency'] },
      ],
    },
  },
  'advanced': {
    'experimental-fiction': {
      type: 'craft-id', instruction: 'Read the description and identify the experimental fiction technique.',
      items: [
        { passage: 'A novel is written entirely in footnotes to a text that does not exist. The "main" narrative is absent; the reader must reconstruct it from the margins.', question: 'What experimental technique is this?', answer: 'Ergodic or deconstructed narrative — the reader assembles meaning from fragments', options: ['Ergodic or deconstructed narrative — the reader assembles meaning from fragments', 'Traditional frame narrative', 'Unreliable narration', 'Epistolary novel'] },
        { passage: 'The story loops: the last sentence connects back to the first. Each re-reading changes the meaning as the reader accumulates context.', question: 'What technique is this?', answer: 'Circular narrative — the structure enacts its theme', options: ['Circular narrative — the structure enacts its theme', 'Cliffhanger', 'Linear plot', 'Flashback'] },
        { passage: 'A short story is written as a series of dictionary entries, each defining a word that, taken together, tells the story of a marriage dissolving.', question: 'What is this form called?', answer: 'Hermit crab essay/fiction — inhabiting a borrowed form', options: ['Hermit crab essay/fiction — inhabiting a borrowed form', 'Lexicon', 'Prose poem', 'Found poetry'] },
        { passage: 'The text includes blank spaces, crossed-out words, and contradictory footnotes. The reader cannot determine a single authoritative version of events.', question: 'What literary movement does this align with?', answer: 'Postmodernist metafiction — foregrounding textual instability', options: ['Postmodernist metafiction — foregrounding textual instability', 'Realism', 'Naturalism', 'Romanticism'] },
        { passage: 'B.S. Johnson\'s novel "The Unfortunates" was published as loose sections in a box, to be read in any order.', question: 'What does this form challenge?', answer: 'The assumption that narrative must be linear and fixed', options: ['The assumption that narrative must be linear and fixed', 'The publishing industry only', 'Grammar rules', 'Nothing — it is a gimmick'] },
        { passage: 'A story is told from the second-person future tense: "You will walk into the bar. You will not recognize her at first."', question: 'What effect does this unusual tense/person combination create?', answer: 'A sense of fate or inevitability — the reader is both participant and observer', options: ['A sense of fate or inevitability — the reader is both participant and observer', 'Confusion only', 'Past-tense nostalgia', 'Objective distance'] },
      ],
    },
    'prose-poetry': {
      type: 'craft-id', instruction: 'Read the passage and identify the prose poetry technique or principle.',
      items: [
        { passage: 'The piece uses no line breaks but relies on rhythm, repetition, and image density to create a poetic effect within paragraph form.', question: 'What defines this as a prose poem rather than flash fiction?', answer: 'Prioritizing linguistic texture and image over narrative arc', options: ['Prioritizing linguistic texture and image over narrative arc', 'It is shorter', 'It has no characters', 'It rhymes'] },
        { passage: 'Baudelaire\'s "Paris Spleen" is often cited as the origin of the prose poem in Western literature — short pieces that capture modern urban experience in lyrical prose.', question: 'What is the historical significance?', answer: 'It established the prose poem as a distinct literary form', options: ['It established the prose poem as a distinct literary form', 'It invented free verse', 'It ended Romanticism', 'It was the first novel'] },
        { passage: 'The writer uses anaphora — "In the city of..." repeated at the start of each sentence — to build incantatory rhythm without line breaks.', question: 'What poetic device creates rhythm in prose?', answer: 'Anaphora — repetition at the beginning of successive clauses', options: ['Anaphora — repetition at the beginning of successive clauses', 'End rhyme', 'Meter', 'Stanza breaks'] },
        { passage: 'A prose poem compresses a novel\'s worth of emotion into a single paragraph. Every word must earn its place; there is no room for filler.', question: 'What principle is described?', answer: 'Compression — maximum meaning in minimum space', options: ['Compression — maximum meaning in minimum space', 'Brevity for its own sake', 'Minimalism', 'Word count limits'] },
        { passage: 'The prose poem ends with an image rather than a conclusion: "The harbor at dusk. A single boat. The rope still swinging."', question: 'What technique is this?', answer: 'Closing on an image — letting resonance replace resolution', options: ['Closing on an image — letting resonance replace resolution', 'An incomplete draft', 'A cliffhanger', 'A thesis restatement'] },
        { passage: 'Russell Edson\'s prose poems often feature absurd domestic scenarios — a man marries a table, a family grows wings — told in deadpan prose.', question: 'What tradition does this represent?', answer: 'The fabulist or absurdist prose poem', options: ['The fabulist or absurdist prose poem', 'Magical realism', 'Surrealist manifesto', 'Children\'s literature'] },
      ],
    },
    'genre-blending': {
      type: 'craft-id', instruction: 'Identify the genre-blending technique or hybrid form.',
      items: [
        { passage: 'The book interweaves memoir with science writing: personal essays about grief sit alongside explanations of how the brain processes loss.', question: 'What form is this?', answer: 'Lyric essay — blending personal narrative with research or meditation', options: ['Lyric essay — blending personal narrative with research or meditation', 'Textbook', 'Science fiction', 'Autobiography'] },
        { passage: 'A novel uses footnotes, appendices, fake bibliographies, and scholarly apparatus — but tells a ghost story.', question: 'What is this hybrid?', answer: 'Academic parody or pseudo-scholarly fiction', options: ['Academic parody or pseudo-scholarly fiction', 'An actual academic text', 'A research paper', 'Nonfiction'] },
        { passage: 'Claudia Rankine\'s "Citizen" moves between poetry, essay, image, and script to address racism. It resists classification in a single genre.', question: 'What does this resistance to genre enact?', answer: 'The subject itself resists containment — form mirrors content', options: ['The subject itself resists containment — form mirrors content', 'Poor editing', 'Confusion', 'Marketing strategy'] },
        { passage: 'A writer uses the structure of a field guide — species name, habitat, behavior — to write poems about the people in her neighborhood.', question: 'What technique is this?', answer: 'Appropriated form — using nonfiction structures for literary purposes', options: ['Appropriated form — using nonfiction structures for literary purposes', 'Nature writing', 'Scientific classification', 'Journalism'] },
        { passage: 'The text alternates between a recipe and a story of domestic violence. The cooking instructions become increasingly disrupted as the narrative intensifies.', question: 'What does the disruption of the borrowed form achieve?', answer: 'The fracturing form mirrors the fracturing domestic reality', options: ['The fracturing form mirrors the fracturing domestic reality', 'A cooking error', 'Comic relief', 'Nothing meaningful'] },
        { passage: 'Maggie Nelson\'s "Bluets" numbers its sections like philosophical propositions but fills them with personal confession, art criticism, and color theory.', question: 'What genre is this work?', answer: 'Autotheory — blending autobiography with critical theory', options: ['Autotheory — blending autobiography with critical theory', 'Philosophy textbook', 'Art history', 'Color science'] },
      ],
    },
    'mfa-portfolio': {
      type: 'revision-exercise', instruction: 'Identify the MFA-level craft principle or portfolio strategy.',
      items: [
        { passage: 'A portfolio that contains only quiet domestic realism demonstrates skill but may not show range. Adding a formally experimental piece and a piece in a different register reveals versatility.', question: 'What portfolio principle is this?', answer: 'Demonstrating range — showing you can work in multiple modes', options: ['Demonstrating range — showing you can work in multiple modes', 'Including everything you\'ve written', 'Only including your best genre', 'Writing to impress'] },
        { passage: 'The writer has revised the story twelve times. Each draft focused on a different element: structure, then character, then sentence-level prose, then cutting.', question: 'What revision approach is this?', answer: 'Layered revision — addressing one craft element per pass', options: ['Layered revision — addressing one craft element per pass', 'Obsessive perfectionism', 'Inefficiency', 'Random editing'] },
        { passage: 'The writer\'s statement says: "I am interested in how silence functions in families — what is not said, and how the unsaid shapes the said."', question: 'What is this?', answer: 'An artist statement articulating a thematic obsession', options: ['An artist statement articulating a thematic obsession', 'A thesis statement', 'A book report', 'A query letter'] },
        { passage: 'A poet submits a manuscript where every poem shares the same subject but each uses a different form: sonnet, ghazal, prose poem, list poem, erasure.', question: 'What does this demonstrate?', answer: 'How form shapes meaning — the same subject refracts differently through each structure', options: ['How form shapes meaning — the same subject refracts differently through each structure', 'Indecision about form', 'Lack of focus', 'Technical showing off'] },
        { passage: 'The writer cuts the first three paragraphs of a story and discovers the real beginning was on page two all along.', question: 'What common revision discovery is this?', answer: 'The "throat-clearing" problem — writers often warm up before the story truly begins', options: ['The "throat-clearing" problem — writers often warm up before the story truly begins', 'Cutting too much', 'Losing important exposition', 'A mistake'] },
        { passage: 'In the cover letter, the writer names specific published works that influenced the manuscript and explains how their project is in conversation with those works.', question: 'What does this demonstrate?', answer: 'Literary lineage awareness — situating one\'s work within a tradition', options: ['Literary lineage awareness — situating one\'s work within a tradition', 'Name-dropping', 'Plagiarism', 'Insecurity'] },
      ],
    },
  },
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

function exResult(type, skill, level, instruction, items) { return { type, skill, level, count: items.length, instruction, items }; }

function generateExercise(level, skill, count = 5) {
  const bank = ITEM_BANKS[level]?.[skill];
  if (!bank) return { error: `No item bank for ${level}/${skill}` };
  const items = pick(bank.items, count);
  return exResult(bank.type, skill, level, bank.instruction, items);
}

// Answer checking

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
}

// Public API

class CreativeWriting {
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
    const level = p.level || 'intro';
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
    const level = p.level || 'intro';
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

  generateLesson(id) {
    const p = loadProfile(id);
    const level = p.level || 'intro';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Ready for next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    return {
      studentId: id, level, targetSkill: target, exercise,
      lessonPlan: {
        inspire: 'Read a model text and discuss craft elements',
        present: `Focus: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        reflect: 'Metacognitive check: What strategies did you use?',
      },
    };
  }
}

module.exports = CreativeWriting;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const cw = new CreativeWriting();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': { const [, id, level] = args; if (!id) throw new Error('Usage: start <id> [level]'); if (level) cw.setLevel(id, level); out({ action: 'start', profile: cw.getProfile(id), nextSkills: cw.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(cw.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const level = loadProfile(id).level || 'intro'; if (skill) { out(cw.generateExercise(level, skill, 5)); } else { const n = cw.getNextSkills(id, 1).next; out(n.length ? cw.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); let exp = expected; try { exp = JSON.parse(expected); } catch {} out(cw.checkAnswer(type, exp, answer)); break; }
      case 'record': { const [, id, level, cat, skill, sc, tot, ...notes] = args; if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total>'); out(cw.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(cw.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(cw.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(cw.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? cw.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(cw.setLevel(id, l)); break; }
      case 'students': { out(cw.listStudents()); break; }
      default: out({ usage: 'node creative-writing.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
